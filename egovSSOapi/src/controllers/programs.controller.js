const supabase = require('../supabase');
const {
  extractKnownFields,
  generateDynamicQuestions,
  scoreEligibility,
  buildChatResponse,
} = require('../services/eligibility.service');
const { askAI, buildPrompt } = require('../services/egov-ai.service');

/**
 * POST /api/programs/profile
 * 
 * Returns:
 * - verified_fields: data already known from eGov profile
 * - questions: additional questions needed for eligibility checking
 * - services_count: how many programs will be checked
 *
 * Body: { category, user_context }
 */
async function getProfilingData(req, res, next) {
  try {
    const { category, user_context } = req.body;

    if (!category) {
      return res.status(400).json({ status: 400, message: 'category is required' });
    }

    const knownFields = extractKnownFields(user_context || {});

    // Fetch actual services for this category to determine what fields are needed
    let query = supabase
      .from('services')
      .select('id, title, required_fields, eligibility')
      .limit(20);

    if (category !== 'general') {
      query = query.ilike('category', `%${category}%`);
    }

    const { data: services, error: servicesError } = await query;

    if (servicesError) {
      throw new Error(`Failed to fetch services: ${servicesError.message}`);
    }

    // Generate questions dynamically based on what programs actually need
    const questions = generateDynamicQuestions(services || [], knownFields);

    return res.status(200).json({
      status: 200,
      data: {
        verified_fields: knownFields,
        questions,
        services_count: services?.length || 0,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/programs/match
 *
 * Body: { category, natural_query, user_context, answers }
 *
 * Queries public.services filtered by category, then scores eligibility
 * for each program based on user profile + profiling answers.
 */
async function matchPrograms(req, res, next) {
  try {
    const { category, natural_query, user_context, answers } = req.body;

    if (!category) {
      return res.status(400).json({ status: 400, message: 'category is required' });
    }

    // ── Fetch services from Supabase ─────────────────────────────────────────
    let query = supabase
      .from('services')
      .select('id, title, agency, category, subcategory, summary, description, benefits, eligibility, required_fields, required_documents, application_process, official_url')
      .limit(20);

    // For natural language queries, search across title/summary/description
    if (category === 'general' && natural_query) {
      // Use text search across relevant columns
      query = supabase
        .from('services')
        .select('id, title, agency, category, subcategory, summary, description, benefits, eligibility, required_fields, required_documents, application_process, official_url')
        .or(`title.ilike.%${natural_query}%,summary.ilike.%${natural_query}%,description.ilike.%${natural_query}%,category.ilike.%${natural_query}%`)
        .limit(20);
    } else if (category !== 'general') {
      query = query.ilike('category', `%${category}%`);
    }

    const { data: services, error: servicesError } = await query;

    if (servicesError) {
      throw new Error(`Failed to fetch services: ${servicesError.message}`);
    }

    // Fallback: if category/keyword search returns nothing, try broader search
    let finalServices = services;
    if ((!finalServices || finalServices.length === 0) && (natural_query || category === 'general')) {
      const { data: fallbackData } = await supabase
        .from('services')
        .select('id, title, agency, category, subcategory, summary, description, benefits, eligibility, required_fields, required_documents, application_process, official_url')
        .limit(20);
      finalServices = fallbackData || [];
    }

    console.log(`[programs/match] category="${category}" query="${natural_query || ''}" → ${finalServices?.length ?? 0} services found`);

    if (!finalServices || finalServices.length === 0) {
      return res.status(200).json({ status: 200, data: [] });
    }

    // ── Score eligibility for each service ───────────────────────────────────
    const knownFields = extractKnownFields(user_context || {});
    const userAnswers = answers || {};

    const programs = finalServices.map((s, i) => {
      const { status, criteriasMet, criteriasMissing } = scoreEligibility(s, knownFields, userAnswers);

      return {
        id:               s.id,
        name:             s.title,
        agency:           s.agency,
        category:         s.category,
        description:      s.summary || s.description || '',
        benefits:         Array.isArray(s.benefits) ? s.benefits.join(', ') : (s.benefits ?? ''),
        requirements:     Array.isArray(s.eligibility) ? s.eligibility : [],
        documents:        Array.isArray(s.required_documents) ? s.required_documents : [],
        process:          Array.isArray(s.application_process) ? s.application_process : [],
        status,
        criteriasMet,
        criteriasMissing,
        url:              s.official_url,
      };
    });

    // Sort: eligible first, then possibly, then missing, then not-eligible
    const statusOrder = { eligible: 0, possibly: 1, missing: 2, 'not-eligible': 3 };
    programs.sort((a, b) => (statusOrder[a.status] ?? 4) - (statusOrder[b.status] ?? 4));

    return res.status(200).json({ status: 200, data: programs });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/programs/chat
 * 
 * Natural language program discovery powered by eGov AI.
 * Takes a user's situation description + profile context and returns
 * an AI-generated conversational response with program recommendations.
 *
 * Body: { message, user_context, history }
 */
async function chatProgramDiscovery(req, res, next) {
  try {
    const { message, user_context, history } = req.body;

    if (!message) {
      return res.status(400).json({ status: 400, message: 'message is required' });
    }

    // Extract keywords for finding relevant services
    const keywords = extractKeywords(message);
    
    // Search services matching the user's situation
    let services = [];
    if (keywords.length > 0) {
      const orClauses = keywords.slice(0, 8).map(kw => 
        `title.ilike.%${kw}%,summary.ilike.%${kw}%,description.ilike.%${kw}%,category.ilike.%${kw}%`
      ).join(',');

      const { data } = await supabase
        .from('services')
        .select('id, title, agency, category, summary, eligibility, required_documents, application_process, official_url')
        .or(orClauses)
        .limit(10);

      if (data) services = data;
    }

    // Fallback: get a broad set of services
    if (services.length === 0) {
      const { data } = await supabase
        .from('services')
        .select('id, title, agency, category, summary, eligibility, required_documents, application_process, official_url')
        .limit(15);
      if (data) services = data;
    }

    // Build context-rich prompt and call eGov AI
    const knownFields = extractKnownFields(user_context || {});
    const userContextForPrompt = {
      ...knownFields,
      name: user_context?.name || [user_context?.first_name, user_context?.last_name].filter(Boolean).join(' '),
    };

    const prompt = buildPrompt(message, userContextForPrompt, services);

    let aiReply;
    try {
      // Use just the user message directly (shorter prompts avoid WAF blocks)
      const simplePrompt = `A Filipino citizen (${knownFields.age ? knownFields.age + ' years old, ' : ''}${knownFields.province ? 'from ' + knownFields.province + ', ' : ''}${knownFields.education ? 'education: ' + knownFields.education : ''}) asks: "${message}". What Philippine government programs can help them? Be specific with program names, eligibility, and application steps.`;
      aiReply = await askAI(simplePrompt, 'PH');
    } catch (aiError) {
      // Fallback to rule-based response if AI is unavailable
      console.error('[chat] AI unavailable, using fallback:', aiError.message);
      const matchedPrograms = services.map(s => {
        const { status, criteriasMet, criteriasMissing } = scoreEligibility(s, knownFields, {});
        return { name: s.title, agency: s.agency, status, criteriasMet, criteriasMissing, description: s.summary || '', url: s.official_url, process: Array.isArray(s.application_process) ? s.application_process : [] };
      });
      const relevant = matchedPrograms.filter(p => p.status !== 'not-eligible').slice(0, 8);
      aiReply = buildChatResponse(message, relevant, knownFields);
    }

    return res.status(200).json({
      status: 200,
      data: {
        reply: aiReply,
        programs: services.slice(0, 8).map(s => ({
          name: s.title,
          agency: s.agency,
          url: s.official_url,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Extract keywords from a natural language message for searching.
 * Handles common Filipino-English terms and expands synonyms.
 */
function extractKeywords(message) {
  const stopWords = new Set([
    'i', 'am', 'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been',
    'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'can', 'shall', 'must', 'need',
    'there', 'that', 'this', 'these', 'those', 'it', 'its', 'my', 'your',
    'his', 'her', 'our', 'their', 'me', 'him', 'us', 'them', 'who', 'what',
    'which', 'when', 'where', 'why', 'how', 'any', 'some', 'no', 'not',
    'and', 'or', 'but', 'if', 'of', 'to', 'for', 'with', 'on', 'in', 'at',
    'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before',
    'after', 'above', 'below', 'between', 'out', 'off', 'over', 'under',
    'again', 'further', 'then', 'once', 'so', 'than', 'too', 'very', 'just',
    'don', 'now', 'looking', 'find', 'get', 'want', 'like', 'know',
    'please', 'thank', 'thanks', 'also', 'really', 'currently',
  ]);

  // Synonym expansions: common terms → search keywords
  const synonymMap = {
    'student': ['education', 'scholarship', 'student'],
    'school': ['education', 'scholarship', 'school'],
    'college': ['education', 'scholarship', 'college', 'tertiary'],
    'university': ['education', 'scholarship', 'university', 'tertiary'],
    'scholar': ['scholarship', 'education'],
    'scholarship': ['scholarship', 'education'],
    'tuition': ['education', 'tuition', 'scholarship'],
    'financial': ['financial', 'assistance', 'cash'],
    'money': ['financial', 'assistance', 'cash', 'loan'],
    'cash': ['cash', 'financial', 'assistance'],
    'struggling': ['financial', 'assistance', 'indigent'],
    'poor': ['financial', 'indigent', 'assistance', 'poverty'],
    'job': ['employment', 'job', 'work'],
    'work': ['employment', 'work', 'job'],
    'unemployed': ['employment', 'unemployed', 'displaced'],
    'health': ['health', 'medical', 'hospital'],
    'hospital': ['health', 'hospital', 'medical'],
    'sick': ['health', 'medical', 'sickness'],
    'medicine': ['health', 'medicine', 'medical'],
    'house': ['housing', 'home', 'shelter'],
    'home': ['housing', 'home', 'shelter'],
    'housing': ['housing', 'home', 'shelter'],
    'rent': ['housing', 'rent', 'shelter'],
    'business': ['business', 'enterprise', 'livelihood'],
    'livelihood': ['livelihood', 'business', 'employment'],
    'farm': ['agriculture', 'farm', 'farmer'],
    'farmer': ['agriculture', 'farm', 'farmer'],
    'rice': ['agriculture', 'rice', 'farm'],
    'senior': ['senior', 'elderly', 'pension'],
    'elderly': ['senior', 'elderly', 'pension'],
    'pension': ['pension', 'senior', 'retirement'],
    'disability': ['pwd', 'disability', 'disabled'],
    'pwd': ['pwd', 'disability'],
    'disaster': ['disaster', 'calamity', 'typhoon', 'relief'],
    'typhoon': ['disaster', 'calamity', 'typhoon'],
    'flood': ['disaster', 'calamity', 'flood'],
    'relief': ['disaster', 'relief', 'assistance'],
    'solo': ['solo parent', 'welfare'],
    'parent': ['solo parent', 'children'],
    'pregnant': ['maternity', 'pregnancy', 'health'],
    'baby': ['maternity', 'health'],
    'loan': ['loan', 'financing', 'credit'],
    'insurance': ['insurance', 'philhealth', 'health'],
  };

  const words = message.toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));

  // Expand with synonyms
  const expanded = new Set();
  for (const word of words) {
    expanded.add(word);
    if (synonymMap[word]) {
      synonymMap[word].forEach(syn => expanded.add(syn));
    }
  }

  return [...expanded];
}

module.exports = { getProfilingData, matchPrograms, chatProgramDiscovery };
