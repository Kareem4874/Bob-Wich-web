# BobWich Project Review

**Scope:** Review of `index.html`, `menu.html`, `about.html`, `contact.html`, `css/*.css`, `js/*.js`, and documentation files.  
**Goal:** List issues with severity and actionable fixes.

## Severity Scale
- **Critical:** Blocks launch or causes direct business harm.
- **High:** Clear negative impact on trust/performance/UX. Must be fixed before launch.
- **Medium:** Quality/maintainability issues. Can launch but should be fixed soon.
- **Low:** Cosmetic or minor improvements.

## Issues and Recommendations

| ID | Severity | Issue | Evidence (Files) | Impact | Recommended Fix |
|---|---|---|---|---|---|
| 1 | High | **Arabic text encoding broken in JS** (garbled characters) | `js/main.js`, `js/menu.js`, `js/cart.js` | WhatsApp messages and notifications are unreadable → poor UX and trust loss | Save files as UTF‑8 and replace corrupted strings with correct Arabic |
| 2 | High | **Docs don’t match reality**: references to missing files/pages | `README.md`, `PROJECT_SUMMARY.md` (mentions `order.html` and `order.js`) | Misleads developers/clients | Either create the files or remove references |
| 3 | High | **Inconsistent contact info & hours** across pages/docs | `index.html`, `about.html`, `contact.html`, `README.md`, `PROJECT_SUMMARY.md` | Damages trust and local SEO | Unify phone/WhatsApp numbers and hours everywhere |
| 4 | High | **Google Map embed looks like a placeholder** | `contact.html` (iframe) | Sends customers to the wrong place | Replace with a real embed for each branch or a correct map link |
| 5 | High | **Menu images are huge and unoptimized** | `menu.html`, `menu *.PNG` files | Slow mobile load → lower conversion | Compress/convert to WebP, add `loading="lazy"` and `width/height` |
| 6 | Medium | **Non-accessible clickable elements** (div + onclick) | `menu.html` (menu image cards) | Keyboard/screen-reader users can’t interact | Use `<button>` or `<a>` with `aria-label` |
| 7 | Medium | **Mobile nav toggle isn’t a button and lacks ARIA** | `menu.html`, `about.html`, `contact.html` | Accessibility and usability issues | Use `<button>` and add `aria-expanded` + `aria-controls` |
| 8 | Medium | **Duplicated JS (inline + external)** | `index.html` and `js/main.js` | Harder maintenance, possible conflicts | Move all JS to external files and remove duplicates |
| 9 | Medium | **Duplicate `showNotification` function** | `js/main.js`, `js/cart.js` | Function can be overwritten depending on load order | Centralize the function or use a namespace |
| 10 | Medium | **Fonts are not optimal for Arabic** | `css/variables.css`, `css/styles.css` | Reduced readability | Add an Arabic font (Cairo/Tajawal) as primary |
| 11 | Medium | **Brand assets inconsistent** (Logo vs `file.jpg`) | `index.html` uses `file.jpg`, other pages use `Logo.png` | Visual inconsistency | Standardize logo usage and OG image |
| 12 | Low | **`@import` used for fonts** | `css/styles.css` | Slower font loading | Replace with `<link rel="preconnect">` + `<link rel="stylesheet">` in `<head>` |
| 13 | Low | **Minor language errors** | Nav labels like “كملنا” vs “كلمنا” | Less professional | Fix wording across pages |
| 14 | Low | **Limited SEO basics** | Missing `canonical`, `og:locale` | Missed SEO gains | Add basic SEO metadata |

## Priority Actions
1. Fix UTF‑8 encoding and unify sensitive business data (phones/hours/maps).  
2. Optimize menu images for mobile performance.  
3. Fix accessibility issues (real buttons + ARIA).  
4. Remove JS duplication and standardize branding + fonts.

If you want, I can implement the high‑priority fixes and then re‑evaluate.
