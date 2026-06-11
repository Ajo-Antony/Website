# StrixMind Image Guide

| Folder | Usage | Recommended size |
|--------|-------|-----------------|
| `public/images/hero/` | Hero bg, OG image | 1920×1080 |
| `public/images/team/` | Team photos | 400×400 (square) |
| `public/images/services/` | Service section images | 800×500 |
| `public/images/gallery/` | Platform screenshots | 800×600 |
| `public/images/clients/` | Client logos (SVG preferred) | 200×80 |

## Usage in Next.js components

```tsx
import Image from "next/image";

// Team photo (replace initials avatar)
<Image src="/images/team/antony.jpg" alt="Antony" width={72} height={72}
       style={{ borderRadius:"50%", objectFit:"cover" }} />

// Service image (replace placeholder div)
<Image src="/images/services/service-01.jpg" alt="AI Agents"
       width={800} height={500} style={{ borderRadius:20, width:"100%", height:"auto" }} />

// Hero background
<Image src="/images/hero/hero-bg.jpg" alt="" fill priority
       style={{ objectFit:"cover", opacity:0.15 }} />
```
