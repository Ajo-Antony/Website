/*
 * src/lib/cms/registry.ts
 * ─────────────────────────────────────────────────────────────
 * FILE PURPOSE:
 *   The CMS content registry — the single source of truth for
 *   all editable site content. Defines defaults AND field schemas
 *   for every content key.
 *
 * HOW IT WORKS:
 *   1. CONTENT_DEFAULTS   — plain JS objects, used as fallbacks when
 *                           Supabase has no stored value for a key.
 *   2. CONTENT_SCHEMAS    — field definitions used by ContentForm.tsx
 *                           to render the right editor UI per field type.
 *   3. getContent(key)    — server action reads Supabase first, falls
 *                           back to CONTENT_DEFAULTS[key] if missing.
 *
 * CMS KEYS REGISTERED:
 *   global.nav        — Navbar links, CTA label/href, sign-in label
 *   global.footer     — Footer tagline, columns, socials, bottom text
 *   home.hero         — Hero badge, headline, subheadline, CTAs
 *   home.services     — Services eyebrow, heading, 6× service items
 *   home.pricing      — Pricing eyebrow, heading, 3 plan objects
 *   work.hub          — Work hub badge, headings, CTAs, bottom CTA
 *   (+ more — see file)
 *
 * USED BY:
 *   src/lib/actions/content.ts   — getContent / upsertContent
 *   src/components/admin/ContentForm.tsx  — admin editor
 *   All section components that accept CMS-driven props
 * ─────────────────────────────────────────────────────────────
 */

import type { SectionSchema, FieldDef, FieldType, ContentValue } from "./types";

function f(key: string, label: string, type: FieldType = "text", extra: Partial<FieldDef> = {}): FieldDef {
  return { key, label, type, ...extra };
}

// ─────────────────────────────────────────────────────────────────────────
// SCHEMAS — describes every editable field, grouped by the page it lives on.
// ─────────────────────────────────────────────────────────────────────────
export const CONTENT_SECTIONS: SectionSchema[] = [
  // ── GLOBAL (navbar / footer, shared on every page) ──
  {
    key: "global.nav", label: "Navigation Bar", group: "Global",
    description: "Logo text and links shown in the navbar on every page.",
    fields: [
      f("links", "Nav links", "array", {
        itemLabel: "Link",
        itemFields: [f("label", "Label"), f("href", "Link (e.g. /#features or /work)")],
      }),
      f("signInLabel", "\"Sign in\" link label"),
      f("ctaLabel", "Primary button label"),
      f("ctaHref", "Primary button link"),
    ],
  },
  {
    key: "global.footer", label: "Footer", group: "Global",
    description: "Footer tagline, link columns, and social links.",
    fields: [
      f("tagline", "Tagline", "textarea", { rows: 2 }),
      f("ctaLabel", "Footer button label"),
      f("ctaHref", "Footer button link"),
      f("statusLabel", "Status line"),
      f("columns", "Link columns", "array", {
        itemLabel: "Column",
        itemFields: [
          f("heading", "Column heading"),
          f("links", "Links", "array", { itemLabel: "Link", itemFields: [f("label", "Label"), f("href", "Link")] }),
        ],
      }),
      f("socials", "Social links", "array", {
        itemLabel: "Social",
        itemFields: [f("label", "Label"), f("href", "URL")],
      }),
      f("bottomText", "Bottom copyright line"),
    ],
  },

  // ── HOME ──
  {
    key: "home.hero", label: "Hero", group: "Home",
    fields: [
      f("badge", "Top badge text"),
      f("headline", "Headline", "textarea", { rows: 2 }),
      f("subheadline", "Subheadline", "textarea", { rows: 3 }),
      f("primaryCtaLabel", "Primary button label"),
      f("primaryCtaHref", "Primary button link"),
      f("secondaryCtaLabel", "Secondary button label"),
      f("secondaryCtaHref", "Secondary button link"),
    ],
  },
  {
    key: "home.trustedBy", label: "Trusted By Strip", group: "Home",
    fields: [
      f("heading", "Heading"),
      f("logos", "Company names", "stringlist", { itemLabel: "Company" }),
    ],
  },
  {
    key: "home.services", label: "What We Do (6 modules)", group: "Home",
    fields: [
      f("eyebrow", "Eyebrow label"),
      f("heading", "Heading", "textarea", { rows: 2 }),
      f("items", "Modules", "array", {
        itemLabel: "Module",
        itemFields: [f("title", "Title"), f("desc", "Description", "textarea", { rows: 2 })],
      }),
    ],
  },
  {
    key: "home.whyUs", label: "Why Different + Live Preview", group: "Home",
    fields: [
      f("eyebrow", "Eyebrow label"),
      f("heading", "Heading", "textarea", { rows: 2 }),
      f("items", "Differentiators", "array", {
        itemLabel: "Differentiator",
        itemFields: [f("icon", "Icon (emoji)"), f("title", "Title"), f("desc", "Description", "textarea", { rows: 2 })],
      }),
      f("previewLabel", "Live preview panel label"),
      f("stats", "Metric tiles", "array", {
        itemLabel: "Metric",
        itemFields: [f("val", "Value"), f("label", "Label")],
      }),
      f("bars", "Progress bars", "array", {
        itemLabel: "Bar",
        itemFields: [f("label", "Label"), f("pct", "Percent (number)")],
      }),
      f("statusLine", "Status line"),
    ],
  },
  {
    key: "home.workflow", label: "How It Works", group: "Home",
    fields: [
      f("eyebrow", "Eyebrow label"),
      f("heading", "Heading", "textarea", { rows: 2 }),
      f("subheading", "Subheading", "textarea", { rows: 2 }),
      f("steps", "Steps", "array", {
        itemLabel: "Step",
        itemFields: [f("icon", "Icon (emoji)"), f("title", "Title"), f("desc", "Description", "textarea", { rows: 2 })],
      }),
    ],
  },
  {
    key: "home.mission", label: "Mission Teaser", group: "Home",
    fields: [
      f("eyebrow", "Eyebrow label"),
      f("heading", "Heading", "textarea", { rows: 2 }),
      f("paragraph1", "Paragraph 1", "textarea", { rows: 3 }),
      f("paragraph2", "Paragraph 2", "textarea", { rows: 3 }),
      f("timeline", "Timeline", "array", {
        itemLabel: "Milestone",
        itemFields: [f("year", "Year"), f("text", "Text")],
      }),
    ],
  },
  {
    key: "home.testimonials", label: "Testimonials", group: "Home",
    fields: [
      f("eyebrow", "Eyebrow label"),
      f("heading", "Heading", "textarea", { rows: 2 }),
      f("items", "Testimonials", "array", {
        itemLabel: "Testimonial",
        itemFields: [
          f("initials", "Avatar initials"),
          f("name", "Name"),
          f("role", "Role / company"),
          f("quote", "Quote", "textarea", { rows: 3 }),
          f("stars", "Star rating (1-5)"),
        ],
      }),
    ],
  },
  {
    key: "home.pricing", label: "Pricing", group: "Home",
    fields: [
      f("eyebrow", "Eyebrow label"),
      f("heading", "Heading", "textarea", { rows: 2 }),
      f("subheading", "Subheading", "textarea", { rows: 2 }),
      f("note", "Bottom note", "textarea", { rows: 2 }),
      f("plans", "Plans", "array", {
        itemLabel: "Plan",
        itemFields: [
          f("name", "Plan name"),
          f("price", "Price"),
          f("period", "Billing period (e.g. /month)"),
          f("billing", "Billing note"),
          f("popular", "Mark as \"Most Popular\"", "boolean"),
          f("desc", "Description", "textarea", { rows: 2 }),
          f("features", "Features", "stringlist", { itemLabel: "Feature" }),
          f("cta", "Button label"),
          f("ctaHref", "Button link"),
        ],
      }),
    ],
  },
  {
    key: "home.team", label: "Team", group: "Home",
    fields: [
      f("eyebrow", "Eyebrow label"),
      f("heading", "Heading", "textarea", { rows: 2 }),
      f("members", "Team members", "array", {
        itemLabel: "Member",
        itemFields: [
          f("initials", "Avatar initials"),
          f("name", "Name"),
          f("role", "Role"),
          f("bio", "Bio", "textarea", { rows: 2 }),
          f("photo", "Photo", "image"),
        ],
      }),
    ],
  },
  {
    key: "home.brand", label: "Brand Identity", group: "Home",
    fields: [
      f("eyebrow", "Eyebrow label"),
      f("heading", "Heading", "textarea", { rows: 2 }),
      f("subheading", "Subheading", "textarea", { rows: 2 }),
      f("conceptParagraph1", "Design concept — paragraph 1", "textarea", { rows: 3 }),
      f("conceptParagraph2", "Design concept — paragraph 2", "textarea", { rows: 3 }),
      f("colors", "Brand colours", "array", {
        itemLabel: "Colour",
        itemFields: [f("hex", "Hex code"), f("name", "Name"), f("role", "Usage / role")],
      }),
      f("attributes", "Design attributes", "array", {
        itemLabel: "Attribute",
        itemFields: [f("label", "Label"), f("desc", "Description", "textarea", { rows: 2 })],
      }),
      f("conclusionHeading", "Conclusion heading"),
      f("conclusionParagraph", "Conclusion paragraph", "textarea", { rows: 3 }),
    ],
  },
  {
    key: "home.faq", label: "FAQ", group: "Home",
    fields: [
      f("eyebrow", "Eyebrow label"),
      f("heading", "Heading", "textarea", { rows: 2 }),
      f("subheading", "Subheading", "textarea", { rows: 2 }),
      f("ctaLabel", "\"Ask us\" button label"),
      f("items", "Questions", "array", {
        itemLabel: "Question",
        itemFields: [f("q", "Question"), f("a", "Answer", "textarea", { rows: 3 })],
      }),
    ],
  },
  {
    key: "home.cta", label: "CTA Banner", group: "Home",
    fields: [
      f("badge", "Badge text"),
      f("heading", "Heading", "textarea", { rows: 2 }),
      f("subheading", "Subheading", "textarea", { rows: 2 }),
      f("primaryCtaLabel", "Primary button label"),
      f("primaryCtaHref", "Primary button link"),
      f("secondaryCtaLabel", "Secondary button label"),
      f("secondaryCtaHref", "Secondary button link"),
    ],
  },
  {
    key: "home.contact", label: "Contact Section", group: "Home",
    fields: [
      f("eyebrow", "Eyebrow label"),
      f("heading", "Heading", "textarea", { rows: 2 }),
      f("subheading", "Subheading", "textarea", { rows: 2 }),
      f("infoItems", "Contact details", "array", {
        itemLabel: "Detail",
        itemFields: [f("icon", "Icon (emoji)"), f("label", "Label"), f("value", "Value")],
      }),
    ],
  },

  // ── ABOUT ──
  {
    key: "about.hero", label: "About — Hero", group: "About",
    fields: [
      f("eyebrow", "Eyebrow label"),
      f("heading", "Heading"),
      f("headingAccent", "Heading (accent line)"),
      f("paragraph", "Paragraph", "textarea", { rows: 3 }),
    ],
  },
  {
    key: "about.story", label: "About — Story", group: "About",
    fields: [
      f("eyebrow", "Eyebrow label"),
      f("heading", "Heading"),
      f("paragraph1", "Paragraph 1", "textarea", { rows: 3 }),
      f("paragraph2", "Paragraph 2", "textarea", { rows: 3 }),
      f("timeline", "Timeline", "array", {
        itemLabel: "Milestone",
        itemFields: [f("year", "Year"), f("text", "Text")],
      }),
    ],
  },
  {
    key: "about.values", label: "About — Values", group: "About",
    fields: [
      f("eyebrow", "Eyebrow label"),
      f("heading", "Heading"),
      f("items", "Values", "array", {
        itemLabel: "Value",
        itemFields: [f("icon", "Icon (emoji)"), f("title", "Title"), f("desc", "Description", "textarea", { rows: 2 })],
      }),
    ],
  },
  {
    key: "about.team", label: "About — Team", group: "About",
    fields: [
      f("eyebrow", "Eyebrow label"),
      f("heading", "Heading"),
      f("members", "Team members", "array", {
        itemLabel: "Member",
        itemFields: [
          f("initials", "Avatar initials"),
          f("name", "Name"),
          f("role", "Role"),
          f("bio", "Bio", "textarea", { rows: 2 }),
          f("photo", "Photo", "image"),
        ],
      }),
    ],
  },

  // ── SERVICES ──
  {
    key: "services.hero", label: "Services — Hero", group: "Services",
    fields: [
      f("eyebrow", "Eyebrow label"),
      f("heading", "Heading"),
      f("headingAccent", "Heading (accent line)"),
      f("paragraph", "Paragraph", "textarea", { rows: 3 }),
    ],
  },
  {
    key: "services.list", label: "Services — List", group: "Services",
    fields: [
      f("items", "Services", "array", {
        itemLabel: "Service",
        itemFields: [
          f("icon", "Icon (emoji)"),
          f("title", "Title"),
          f("desc", "Description", "textarea", { rows: 3 }),
          f("image", "Image", "image"),
        ],
      }),
    ],
  },
  {
    key: "services.cta", label: "Services — CTA", group: "Services",
    fields: [
      f("heading", "Heading"),
      f("paragraph", "Paragraph", "textarea", { rows: 2 }),
      f("primaryCtaLabel", "Primary button label"),
      f("primaryCtaHref", "Primary button link"),
      f("secondaryCtaLabel", "Secondary button label"),
      f("secondaryCtaHref", "Secondary button link"),
    ],
  },

  // ── CONTACT ──
  {
    key: "contact.hero", label: "Contact — Hero", group: "Contact",
    fields: [
      f("eyebrow", "Eyebrow label"),
      f("heading", "Heading"),
      f("headingAccent", "Heading (accent line)"),
      f("paragraph", "Paragraph", "textarea", { rows: 2 }),
    ],
  },
  {
    key: "contact.info", label: "Contact — Details", group: "Contact",
    fields: [
      f("items", "Contact details", "array", {
        itemLabel: "Detail",
        itemFields: [f("icon", "Icon (emoji)"), f("label", "Label"), f("value", "Value")],
      }),
    ],
  },

  // ── BOOKING ──
  {
    key: "booking.hero", label: "Booking — Hero", group: "Booking",
    fields: [
      f("eyebrow", "Eyebrow label"),
      f("heading", "Heading"),
      f("headingAccent", "Heading (accent line)"),
      f("paragraph", "Paragraph", "textarea", { rows: 2 }),
    ],
  },
  {
    key: "booking.slots", label: "Booking — Time Slots", group: "Booking",
    fields: [
      f("slots", "Available slots", "stringlist", { itemLabel: "Slot" }),
    ],
  },

  // ── WORK ──
  {
    key: "work.hub", label: "Work Hub", group: "Work",
    description: "Intro copy on the /work landing page. Gallery, Blog, and Projects content is managed in their own sections.",
    fields: [
      f("badge", "Badge text"),
      f("heading", "Heading"),
      f("headingAccent", "Heading (accent line)"),
      f("paragraph", "Paragraph", "textarea", { rows: 2 }),
      f("primaryCtaLabel", "Primary button label"),
      f("secondaryCtaLabel", "Secondary button label"),
      f("ctaHeading", "Bottom CTA heading"),
      f("ctaParagraph", "Bottom CTA paragraph", "textarea", { rows: 2 }),
      f("ctaButtonLabel", "Bottom CTA button label"),
    ],
  },
];

export function getSchema(key: string): SectionSchema | undefined {
  return CONTENT_SECTIONS.find((s) => s.key === key);
}

export function getGroupedSchemas(): Record<string, SectionSchema[]> {
  const groups: Record<string, SectionSchema[]> = {};
  for (const s of CONTENT_SECTIONS) {
    groups[s.group] = groups[s.group] || [];
    groups[s.group].push(s);
  }
  return groups;
}

// ─────────────────────────────────────────────────────────────────────────
// DEFAULTS — the copy that ships out of the box. Used as a fallback when a
// section hasn't been edited/saved yet, and as the starting point in the
// admin form. Mirrors the original hardcoded marketing copy.
// ─────────────────────────────────────────────────────────────────────────
export const CONTENT_DEFAULTS: Record<string, ContentValue> = {
  "global.nav": {
    links: [
      { label: "Features", href: "/#features" },
      { label: "Platform", href: "/#why" },
      { label: "Work", href: "/work" },
      { label: "FAQ", href: "/#faq" },
      { label: "Contact", href: "/#contact" },
    ],
    signInLabel: "Sign in",
    ctaLabel: "Start Free Trial",
    ctaHref: "/booking",
  },
  "global.footer": {
    tagline: "AI-powered business automation for Indian businesses. Scale without limits.",
    ctaLabel: "Start Free Trial →",
    ctaHref: "/booking",
    statusLabel: "All systems operational",
    columns: [
      { heading: "Product", links: [
        { label: "Features", href: "/#features" },
        { label: "Platform Demo", href: "/#why" },
        { label: "Our Work", href: "/work" },
      ]},
      { heading: "Use Cases", links: [
        { label: "WhatsApp Automation", href: "/#features" },
        { label: "AI CRM", href: "/#features" },
        { label: "Lead Generation", href: "/#features" },
        { label: "Campaign Outreach", href: "/#features" },
        { label: "Revenue Analytics", href: "/#features" },
      ]},
      { heading: "Company", links: [
        { label: "About Us", href: "/about" },
        { label: "Brand Identity", href: "/#brand" },
        { label: "Contact", href: "/#contact" },
        { label: "Kerala, India 🇮🇳", href: "/" },
      ]},
      { heading: "Support", links: [
        { label: "FAQ", href: "/#faq" },
        { label: "Book a Demo", href: "/booking" },
      ]},
    ],
    socials: [
      { label: "X", href: "https://x.com/strixmind" },
      { label: "LinkedIn", href: "https://linkedin.com/company/strixmind" },
      { label: "GitHub", href: "https://github.com/strixmind" },
      { label: "YouTube", href: "https://youtube.com/@strixmind" },
    ],
    bottomText: "StrixMind Technologies Pvt. Ltd. · Made with ❤️ in Kerala, India",
  },

  "home.hero": {
    badge: "AI-Powered Business Operating System",
    headline: "Automate Workflows. Scale Operations. Grow Without Limits.",
    subheadline: "AI-powered CRM, WhatsApp automation, lead management, multi-agent workflows, and revenue intelligence — built for Indian businesses.",
    primaryCtaLabel: "Start Free Trial →",
    primaryCtaHref: "/booking",
    secondaryCtaLabel: "Book a Demo",
    secondaryCtaHref: "#why",
  },
  "home.trustedBy": {
    heading: "Trusted by 500+ businesses across India",
    logos: ["NovaBridge", "UrbanScale", "Tessera Labs", "ZenithCorp", "ArcVentures", "PeakFlow", "BrightStack", "NexaGrowth"],
  },
  "home.services": {
    eyebrow: "What we do",
    heading: "Every growth lever,\nin one system.",
    items: [
      { title: "Lead Generation", desc: "AI-powered prospecting that identifies, qualifies, and enriches leads from multiple channels automatically." },
      { title: "WhatsApp Automation", desc: "Intelligent bots handle bookings, follow-ups, and queries on WhatsApp — 24/7 with human-like responses." },
      { title: "Intelligent CRM", desc: "A CRM that updates itself. AI enriches contacts, scores pipeline health, and surfaces the right follow-up." },
      { title: "Campaign Outreach", desc: "Multi-channel campaigns across email, SMS, and social — written, tested, and optimised by AI." },
      { title: "Multi-Agent Workflows", desc: "Visual drag-and-drop builder for autonomous AI agent chains. No code required." },
      { title: "Revenue Analytics", desc: "Unified dashboards with AI-generated insights, forecasts, and performance recommendations." },
    ],
  },
  "home.whyUs": {
    eyebrow: "Advantages",
    heading: "Built different,\nby design.",
    items: [
      { icon: "shuffle", title: "Provider-agnostic AI routing", desc: "Route tasks to GPT-4o, Gemini, or Claude based on cost and latency. No vendor lock-in, ever." },
      { icon: "bolt", title: "Sub-second response latency", desc: "Edge-deployed agents, smart caching, and optimised token management keep every interaction instant." },
      { icon: "shield", title: "Enterprise-grade security", desc: "SOC 2 aligned, end-to-end encrypted data pipelines, and role-based access control." },
      { icon: "book", title: "Real-time knowledge base", desc: "Upload docs and FAQs. Agents reference your knowledge instantly — always accurate, always on-brand." },
    ],
    previewLabel: "Live Platform Preview",
    stats: [
      { val: "2,847", label: "Active Leads" },
      { val: "₹18.4L", label: "This Month" },
      { val: "99.8%", label: "Agent Uptime" },
      { val: "4.2s", label: "Avg Response" },
    ],
    bars: [
      { label: "WhatsApp response rate", pct: 82 },
      { label: "Campaign open rate", pct: 67 },
      { label: "Lead qualification", pct: 91 },
    ],
    statusLine: "All systems operational · AI agents active",
  },
  "home.workflow": {
    eyebrow: "How It Works",
    heading: "Up and running in three minutes flat.",
    subheading: "No engineers. No complex setup. Just connect, configure, and start growing today.",
    steps: [
      { icon: "plug", title: "Connect your stack", desc: "Link CRM, WhatsApp, email, calendar, and 500+ tools in seconds using one-click OAuth connectors — no developer needed." },
      { icon: "puzzle", title: "Configure AI agents", desc: "Pick from ready-made templates — sales bot, support agent, lead qualifier — or build fully custom workflows in the visual builder." },
      { icon: "rocket", title: "Launch campaigns", desc: "Set your target audience and growth goal. StrixMind writes copy, schedules sends, and A/B tests automatically." },
      { icon: "chart-up", title: "Watch it compound", desc: "Every interaction trains agents to be smarter. Revenue compounds, costs fall, and your team focuses on what only humans can do." },
    ],
  },
  "home.mission": {
    eyebrow: "Our mission",
    heading: "We make AI\naccessible to every business.",
    paragraph1: "StrixMind was built because we saw brilliant businesses losing deals to slower competitors who simply had better automation. We decided to change that.",
    paragraph2: "Our platform gives any team — from solo founders to enterprise ops — the same AI leverage previously reserved for tech giants.",
    timeline: [
      { year: "2022", text: "StrixMind founded in Kerala, India" },
      { year: "2023", text: "First 100 business customers" },
      { year: "2024", text: "Multi-agent workflow builder launched" },
      { year: "2025", text: "500+ businesses across 12 industries" },
    ],
  },
  "home.testimonials": {
    eyebrow: "Customer Stories",
    heading: "Trusted by teams\nwho move fast.",
    items: [
      { initials: "RK", name: "Rahul Krishnan", role: "Founder, UrbanScale Ventures", quote: "StrixMind cut our lead response time from 6 hours to under 30 seconds. Our close rate doubled within the first month. The WhatsApp bot alone paid for itself in week two.", stars: 5 },
      { initials: "PS", name: "Priya Suresh", role: "Head of Growth, NovaBridge", quote: "The multi-agent workflow builder is unlike anything I've ever seen. We automated our entire onboarding sequence — lead to contract — in a single afternoon, with zero developers.", stars: 5 },
      { initials: "AM", name: "Arjun Menon", role: "CTO, Tessera Labs", quote: "Finally a platform where the AI actually understands our business context. The knowledge base integration means our bots never give wrong answers. Our support CSAT went from 72% to 94%.", stars: 5 },
    ],
  },
  "home.pricing": {
    eyebrow: "Pricing",
    heading: "Simple, transparent pricing.",
    subheading: "No credit card required. 14-day free trial on all plans. Cancel any time.",
    note: "All prices in INR. GST applicable. Annual plans available at 20% discount.",
    plans: [
      { name: "Starter", price: "₹4,999", period: "/month", billing: "Billed monthly", popular: false, desc: "Perfect for solo founders and small teams just getting started with AI automation.", features: ["1,000 leads/month", "WhatsApp bot (500 messages)", "Basic CRM + pipeline", "Email campaign module", "2 workflow automations", "Email support"], cta: "Start free trial", ctaHref: "/booking" },
      { name: "Growth", price: "₹14,999", period: "/month", billing: "Save 20% annually", popular: true, desc: "Full AI power for scaling teams ready to automate sales, support, and operations.", features: ["10,000 leads/month", "Unlimited WhatsApp messages", "AI CRM + lead scoring", "Multi-channel campaigns", "5 multi-agent workflows", "Real-time analytics dashboard", "Priority support (4hr SLA)"], cta: "Start free trial", ctaHref: "/booking" },
      { name: "Enterprise", price: "Custom", period: "", billing: "Volume pricing available", popular: false, desc: "Full-platform access with dedicated infrastructure, custom AI models, and white-glove onboarding.", features: ["Unlimited leads", "Custom AI model routing", "Dedicated agent cluster", "SSO + SAML authentication", "Self-hosted deployment option", "99.99% SLA guarantee", "Dedicated success manager"], cta: "Book a call", ctaHref: "/#contact" },
    ],
  },
  "home.team": {
    eyebrow: "The team",
    heading: "Built by people who\nobsess over your growth.",
    members: [
      { initials: "AK", name: "Antony Kuriakose", role: "Founder & CEO", bio: "AI systems architect with 10+ years in enterprise automation.", photo: "" },
      { initials: "PS", name: "Priya Suresh", role: "Head of Product", bio: "Previously built growth tooling at Razorpay and Freshworks.", photo: "" },
      { initials: "RK", name: "Rahul Krishnan", role: "Lead Engineer", bio: "Full-stack engineer specialising in AI inference pipelines.", photo: "" },
      { initials: "AM", name: "Arjun Menon", role: "Head of Growth", bio: "Scaled 3 SaaS companies from zero to ₹10Cr ARR.", photo: "" },
    ],
  },
  "home.brand": {
    eyebrow: "Identity & Branding",
    heading: "Built on Connected Intelligence.",
    subheading: "The Strixmind identity unifies technological sophistication with approachable design — a visual system that scales from a mobile icon to enterprise deployments.",
    conceptParagraph1: "The Strixmind wordmark uses custom, interconnected letterforms to symbolise the seamless flow of data, intelligence, and technology. Rounded geometry conveys innovation and accessibility, while the consistent structure reflects reliability and technical precision.",
    conceptParagraph2: "Violet accent points represent moments of insight and intelligence — reinforcing Strixmind's focus on AI-driven innovation at every visual touchpoint.",
    colors: [
      { hex: "#1a1333", name: "Strixmind Ink", role: "Primary text & dark surfaces" },
      { hex: "#6c63ff", name: "Intelligence Violet", role: "Primary accent & CTAs" },
      { hex: "#4c46c4", name: "Deep Violet", role: "Depth & brand shadows" },
    ],
    attributes: [
      { label: "Memorable", desc: "Distinctive geometric arrangement creates high recognition across all sizes." },
      { label: "Versatile", desc: "Functions effectively across dark, light, and color backgrounds without modification." },
      { label: "Meaningful", desc: "Every element — node, line, color — contributes to telling the brand story." },
      { label: "Timeless", desc: "Avoids trendy design elements for longer-lasting appeal and brand consistency." },
      { label: "Scalable", desc: "Works equally well at 16px favicon resolution and billboard scale." },
    ],
    conclusionHeading: "A future-ready identity built to last.",
    conclusionParagraph: "The Strixmind logo embodies the brand's vision of Connected Intelligence — combining innovation, collaboration, and technological expertise into a distinctive identity.",
  },
  "home.faq": {
    eyebrow: "FAQ",
    heading: "Got questions?\nWe've got\nanswers.",
    subheading: "Can't find what you're looking for? Our team typically responds within 2 hours.",
    ctaLabel: "Ask us anything →",
    items: [
      { q: "What exactly is StrixMind?", a: "StrixMind is an AI-powered business operating system built for Indian businesses. It unifies lead generation, WhatsApp automation, CRM, multi-agent workflows, campaign outreach, and revenue analytics into one platform — so your entire growth stack runs from a single dashboard." },
      { q: "How does the workflow automation work?", a: "Our visual drag-and-drop workflow builder lets you chain AI agents, triggers, conditions, and actions without writing a single line of code. Choose from 50+ pre-built templates or build fully custom flows from scratch. Most teams are live within their first session." },
      { q: "Can I connect WhatsApp to StrixMind?", a: "Yes. StrixMind integrates natively with WhatsApp Business API. You can deploy intelligent bots, send broadcast messages, manage conversations, handle bookings, and automate follow-ups — all from one unified inbox. We support Hindi, Malayalam, Tamil, Telugu, and 10+ Indian languages." },
      { q: "What AI models do you use?", a: "StrixMind uses a provider-agnostic AI routing layer, meaning your workflows can use GPT-4o, Google Gemini, or Anthropic Claude depending on the task's requirements for speed, accuracy, and cost. You're never locked into a single provider." },
      { q: "Is there a free trial available?", a: "Yes — all plans include a 14-day free trial with no credit card required. You get full access to the Growth plan features during the trial period so you can evaluate the platform properly before committing." },
      { q: "Can StrixMind be self-hosted?", a: "Enterprise plans include a self-hosted deployment option on your own infrastructure (Hetzner, AWS, Azure, or on-premise). Our team handles full setup, migration, and ongoing support with SLA guarantees." },
      { q: "What kind of support do you offer?", a: "Starter plans include email support. Growth plans include priority support with a 4-hour SLA. Enterprise plans come with a dedicated customer success manager, 24/7 phone support, and a guaranteed 99.99% uptime SLA." },
      { q: "How long does onboarding take?", a: "Most businesses are fully onboarded within 3 minutes for basic automation and under 1 day for complex enterprise workflows. We provide guided setup wizards, video walkthroughs, and live onboarding sessions for all new customers." },
    ],
  },
  "home.cta": {
    badge: "14-day free trial · No credit card required",
    heading: "Start automating your\nbusiness today.",
    subheading: "Automate WhatsApp, email, and lead management with StrixMind — and start generating more leads, closing more deals, and growing without limits.",
    primaryCtaLabel: "Start Free Trial →",
    primaryCtaHref: "/booking",
    secondaryCtaLabel: "Book a Demo",
    secondaryCtaHref: "/booking",
  },
  "home.contact": {
    eyebrow: "Get In Touch",
    heading: "Let's talk about\nyour growth.",
    subheading: "Ready to automate your business?",
    infoItems: [
      { icon: "mail", label: "Email us", value: "hello@strixmind.ai" },
      { icon: "map-pin", label: "Our office", value: "Kerala, India" },
      { icon: "clock", label: "Response time", value: "Within 2 business hours" },
      { icon: "clock", label: "Office hours", value: "Mon – Fri, 9 AM – 6 PM IST" },
    ],
  },

  "about.hero": {
    eyebrow: "About us",
    heading: "We make AI accessible",
    headingAccent: "to every business.",
    paragraph: "StrixMind is a Kerala-born AI company on a mission to give every business the same automation leverage previously reserved for tech giants.",
  },
  "about.story": {
    eyebrow: "Our story",
    heading: "From frustration to platform.",
    paragraph1: "StrixMind was born when our founders watched brilliant businesses lose deals simply because they couldn't respond fast enough. The tools existed — they were scattered, expensive, and required engineers to operate.",
    paragraph2: "We built StrixMind to change that — one platform where AI does the heavy lifting from day one, accessible to any team regardless of technical expertise.",
    timeline: [
      { year: "2022", text: "Founded in Kochi, Kerala" },
      { year: "2023", text: "First 100 business customers" },
      { year: "2024", text: "Multi-agent workflow builder launched" },
      { year: "2025", text: "500+ businesses across 12 industries" },
    ],
  },
  "about.values": {
    eyebrow: "Values",
    heading: "What we believe.",
    items: [
      { icon: "target", title: "Radical simplicity", desc: "Complex AI made simple. If your team needs a manual to use a feature, we haven't done our job." },
      { icon: "bolt", title: "Speed is a feature", desc: "Every decision — design, infra, AI routing — is made to remove milliseconds and friction from your workflow." },
      { icon: "lock", title: "Privacy by default", desc: "Your data never trains our models. What's yours stays yours, encrypted end-to-end, always." },
      { icon: "sprout", title: "Growth over perfection", desc: "We ship, learn, and improve. Your feedback directly shapes our next release." },
    ],
  },
  "about.team": {
    eyebrow: "The team",
    heading: "Meet the builders.",
    members: [
      { initials: "AK", name: "Antony Kuriakose", role: "Founder & CEO", bio: "AI systems architect with 10+ years in enterprise automation.", photo: "" },
      { initials: "PS", name: "Priya Suresh", role: "Head of Product", bio: "Previously built growth tooling at Razorpay and Freshworks.", photo: "" },
      { initials: "RK", name: "Rahul Krishnan", role: "Lead Engineer", bio: "Full-stack engineer specialising in AI inference pipelines.", photo: "" },
      { initials: "AM", name: "Arjun Menon", role: "Head of Growth", bio: "Scaled 3 SaaS companies from zero to ₹10Cr ARR.", photo: "" },
    ],
  },

  "services.hero": {
    eyebrow: "Services",
    heading: "Everything your business needs",
    headingAccent: "to grow on autopilot.",
    paragraph: "Six fully integrated modules. One platform. Zero friction between them.",
  },
  "services.list": {
    items: [
      { icon: "robot", title: "AI Agents", desc: "Deploy intelligent agents for sales, support, HR, and legal. Each agent learns your business, handles queries 24/7, and escalates complex cases to your team.", image: "" },
      { icon: "bolt", title: "Workflow Automation", desc: "Build powerful automations with our visual drag-and-drop builder. Connect 500+ integrations and custom nodes to create any business flow imaginable.", image: "" },
      { icon: "users", title: "Intelligent CRM", desc: "A CRM that updates itself. AI enriches contacts, scores pipeline deals, and surfaces the highest-value actions for your team every single day.", image: "" },
      { icon: "chat", title: "WhatsApp Automation", desc: "Connect WhatsApp Business API and deploy intelligent bots for bookings, follow-ups, support, and broadcast campaigns — all in one place.", image: "" },
      { icon: "chart", title: "Revenue Analytics", desc: "Unified dashboards combining pipeline, campaign, and agent performance data with AI-generated insights and 90-day revenue forecasts.", image: "" },
      { icon: "rocket", title: "Campaign Outreach", desc: "Multi-channel campaigns across email, SMS, and social — written, A/B tested, and continuously optimised by AI to maximise every conversion.", image: "" },
    ],
  },
  "services.cta": {
    heading: "Ready to automate your growth?",
    paragraph: "Start your 14-day free trial. No credit card required.",
    primaryCtaLabel: "Book a demo →",
    primaryCtaHref: "/booking",
    secondaryCtaLabel: "Ask a question",
    secondaryCtaHref: "/#contact",
  },

  "contact.hero": {
    eyebrow: "Get in touch",
    heading: "Let's talk about",
    headingAccent: "your growth.",
    paragraph: "Whether you have a quick question or want a full platform walkthrough, we're here.",
  },
  "contact.info": {
    items: [
      { icon: "mail", label: "Email", value: "hello@strixmind.ai" },
      { icon: "map-pin", label: "Location", value: "Kerala, India" },
      { icon: "clock", label: "Response time", value: "Within 2 business hours" },
      { icon: "phone", label: "Office hours", value: "Mon–Fri, 9 AM – 6 PM IST" },
    ],
  },

  "booking.hero": {
    eyebrow: "Book a demo",
    heading: "See StrixMind",
    headingAccent: "live in 30 minutes.",
    paragraph: "Pick a time, tell us about your business, and we'll show you exactly how StrixMind will work for you.",
  },
  "booking.slots": {
    slots: ["Mon 9:00 AM", "Mon 2:00 PM", "Tue 10:00 AM", "Tue 3:00 PM", "Wed 9:00 AM", "Wed 11:00 AM", "Thu 2:00 PM", "Fri 10:00 AM"],
  },

  "work.hub": {
    badge: "Our Work",
    heading: "Real projects.",
    headingAccent: "Real results.",
    paragraph: "A look at what we've shipped for clients, what we're building next, and what we're thinking about along the way.",
    primaryCtaLabel: "Browse projects",
    secondaryCtaLabel: "Read the blog",
    ctaHeading: "Have a project in mind?",
    ctaParagraph: "Tell us what you're building — we'll tell you how we'd automate it.",
    ctaButtonLabel: "Get in touch",
  },
};