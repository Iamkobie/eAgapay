Figma Make Prompt — GovPH Opportunity Discovery Platform
Product Context

Design a desktop web application called the "Government Opportunity Discovery Platform" — an official companion web app for eGovPH. It helps Filipino citizens discover government programs, benefits, and services they are eligible for without browsing multiple agency websites or repeatedly filling out forms.

The app authenticates users via "Continue with eGovPH," retrieves their verified profile, asks only for missing information through an AI-generated adaptive form, matches them against government programs, and then redirects them to the official government website to complete the actual application. This app is a discovery and eligibility layer, not a transaction processor — it never submits applications itself.

Tone: official, trustworthy, calm, modern-government. Not flashy or startup-like. Should feel like a natural extension of eGovPH, not a third-party product.

Design System

Color palette — follow the official eGovPH brand and the Philippine government visual identity:

Primary: eGovPH blue (deep, trustworthy blue — the dominant brand color used for headers, primary buttons, active states, and links)
Secondary/accent: PH flag red (used sparingly — alerts, required-field indicators, "Not Eligible" status)
Accent/highlight: PH flag gold/yellow (used sparingly — "Possibly Eligible" status, highlights, badges)
Neutral base: white backgrounds, light gray surfaces for cards, dark gray/near-black for body text
Success green (not from PH flag, standard UI green) for "Eligible" status only

Keep the palette restrained — 1 dominant blue, white/gray neutrals, and red/gold used only as small functional accents (status, alerts). Avoid gradients or decorative color blocks; this should read as an official .gov digital service, not a consumer product.

Typography: Clean, highly legible sans-serif (e.g., Inter, Noto Sans, or similar humanist sans). Clear heading hierarchy. Body text sized for readability by a general public audience including older users.

Components: Rounded-but-restrained corners (not overly playful), clear button states, visible focus states, high-contrast text (WCAG AA minimum), status badges/pills (Eligible / Possibly Eligible / Missing Information / Not Eligible), progress indicators for multi-step forms.

Layout: Desktop web only, standard 1440px design width, persistent top navigation bar showing the eGovPH logo/wordmark, user's name/avatar once logged in, and a help icon.

Scope: Multi-Page Application

This is a multi-page application. Generate all of the following screens as connected pages within one Figma Make project, sharing the same design system, top navigation, and footer:

1. Login / Landing Page
eGovPH-branded landing page explaining the platform's purpose in one clear headline (e.g., "Discover government programs you're eligible for")
Primary CTA button: "Continue with eGovPH"
Brief 3-step visual explainer (Verify → Answer a few questions → See what you qualify for)
Official government footer (agency logos placeholder, disclaimer that this is an official government platform)
2. Category Selection
Shown immediately after login
Grid or list of opportunity categories: Education, Healthcare, Employment, Financial Assistance, Housing, Business, Agriculture, Senior Citizens, PWD, Disaster Assistance
Each category as a card with an icon, label, and short description
A persistent summary of the user's verified info (name, province) near the top for reassurance that they're logged in correctly
3. Adaptive Form (Dynamic Missing-Fields Form)
A short, clean multi-field form showing only the fields the system doesn't already know
Each field shows a small label indicating it's needed for specific programs (e.g., "Needed to check: TES Scholarship, TESDA NC II")
Progress indicator showing how many fields remain
Previously known/verified fields are NOT shown here — only display what's missing
Clear "Submit" / "Continue" CTA
4. Opportunity Results List
List/grid of matched programs, each showing: Program Name, Agency, Eligibility Status badge (Eligible / Possibly Eligible / Missing Information / Not Eligible), and a short description
Status badges color-coded: green (Eligible), gold (Possibly Eligible), gray (Missing Information), red-outline (Not Eligible)
Filter/sort controls (by category, by status)
5. Program Detail Page
Full program info: Name, Agency, Description, Benefits, Eligibility Summary, Requirements, Required Documents, Application Process
A "Why this program was recommended" checklist section showing criteria met (✓ Filipino Citizen, ✓ Age Requirement Met, etc.) in green checkmarks
If information is missing, a distinct "Missing Requirements" panel listing exactly what's needed
Prominent CTA button: "Open Official Government Website" — visually distinct as an outbound/external action (e.g., external-link icon)
6. Progressive Profile / Dashboard
A personal dashboard showing the user's accumulating profile over time: verified info (from eGovPH/NIDAS, locked/non-editable) vs. user-provided metadata (editable)
Each field tagged with its source (e.g., "Verified via NIDAS eVerify," "You provided this")
Shows how complete their profile is (e.g., a completeness indicator) and reinforces that future sessions will ask fewer questions
7. Help Assistant Chat Widget
A small, unobtrusive chat bubble/icon in the bottom corner (available on every page)
Expands into a simple chat panel for platform-usage questions only (e.g., "How do I update my profile?")
Should visually read as a lightweight help widget, not a full AI chatbot experience — this is not for eligibility questions
Navigation Flow

Login → Category Selection → Adaptive Form → Opportunity Results → Program Detail → (external link out) Dashboard/Profile is accessible at any time from the top navigation. Help widget is present on all pages.

Accessibility & Trust Signals
WCAG AA contrast minimum throughout
Never rely on color alone for status (pair badges with text labels, not just color)
Include standard "official government website" trust indicators (e.g., a small "An official eGovPH service" marker near the header)