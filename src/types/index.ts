export interface NavLink { label: string; href: string }
export interface ServiceItem { num: string; title: string; icon: string; desc: string }
export interface TeamMember { initials: string; name: string; role: string; bio: string; grad: string; imageSrc?: string }
export interface Testimonial { initials: string; name: string; role: string; quote: string; avatarBg: string }
export interface PricingPlan { name: string; price: string; period: string; desc: string; features: readonly string[]; cta: string; accent: boolean }
export interface FaqItem { q: string; a: string }
