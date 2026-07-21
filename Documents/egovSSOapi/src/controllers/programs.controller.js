const supabase = require('../supabase');

/**
 * POST /api/programs/match
 *
 * Body: { category, natural_query, user_context }
 *
 * Queries public.services filtered by category, then uses the eGov AI
 * to determine eligibility for each program based on the user's profile.
 */
async function matchPrograms(req, res, next) {
  try {
    const { category, natural_query, user_context } = req.body;

    if (!category) {
      return res.status(400).json({ status: 400, message: 'category is required' });
    }

    // ── Fetch services from Supabase ─────────────────────────────────────────
    let query = supabase
      .from('services')
      .select('id, title, agency, category, subcategory, summary, description, benefits, eligibility, required_documents, application_process, official_url')
      .limit(20);

    // For natural language queries, fetch across all categories
    // For category clicks, filter by category
    if (category !== 'general') {
      query = query.ilike('category', `%${category}%`);
    }

    const { data: services, error: servicesError } = await query;

    if (servicesError) {
      throw new Error(`Failed to fetch services: ${servicesError.message}`);
    }

    if (!services || services.length === 0) {
      return res.status(200).json({ status: 200, data: [] });
    }

    // ── Map services to Program shape with basic eligibility ─────────────────
    // For a production app, this is where you'd call the eGov AI to score
    // eligibility. For now we return all programs as 'possibly' eligible
    // so the UI renders correctly while the AI integration is wired up.
    const programs = services.map((s, i) => ({
      id:               i + 1,
      name:             s.title,
      agency:           s.agency,
      category:         s.category,
      description:      s.summary || s.description || '',
      benefits:         Array.isArray(s.benefits) ? s.benefits.join(', ') : (s.benefits ?? ''),
      requirements:     Array.isArray(s.eligibility) ? s.eligibility : [],
      documents:        Array.isArray(s.required_documents) ? s.required_documents : [],
      process:          Array.isArray(s.application_process) ? s.application_process : [],
      status:           'possibly',
      criteriasMet:     [],
      criteriasMissing: [],
      url:              s.official_url,
    }));

    return res.status(200).json({ status: 200, data: programs });
  } catch (error) {
    next(error);
  }
}

module.exports = { matchPrograms };
