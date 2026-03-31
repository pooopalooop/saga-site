# SAGA Project Knowledge File

Read this file before starting any work on this project.

---

## What is SAGA?

SAGA is a manufacturer's rep firm and industrial sales consultancy. We are independent contractors who represent seal manufacturers and connect them with engineers and procurement teams. We generate qualified leads and sales opportunities on behalf of the manufacturers we represent.

SAGA is run by Mike Krupoff and his father Stu Krupoff.

---

## Current Manufacturer Represented

**Performance Sealing Inc. (PSI)**
- Location: 1821 Langley Avenue, Irvine, CA 92614
- Website: www.psiseal.com
- Phone: 714-662-5918
- PSI designs and manufactures high-performance engineered polymer seals, bearings, and related components
- AS9100D certified (quality management system for aerospace and defense)
- Proprietary Duron® material formulations (200+ formulations)
- Capabilities: custom engineering services, product design, reverse engineering, rapid prototyping, FEA, installation tools
- Manufacturing: CNC machining, digital molding presses, sintering ovens, cleanroom manufacturing
- Spring energizer types: angled coil, cantilever, helical coil
- Temperature range: -450F to +600F
- Key value props: polymer sealing expertise, Duron® materials, spring technologies, rapid product development, clean manufacturing, vertically integrated

SAGA is not PSI. SAGA represents PSI. Do not confuse the two.

---

## SAGA Team Contact Info

- Mike Krupoff: mike@sagareps.com / (510) 915-7119
- Stu Krupoff: stu@sagareps.com / (949) 337-9563
- Business Gmail: sagareps1@gmail.com (used for Formspree and general account setup)
- Domain: sagareps.com

---

## Target Audience

- Mechanical design engineers
- New product development engineers
- R&D engineers
- Supply chain and procurement specialists

These are technical people. Copy should be professional, credible, and specific. Avoid fluffy marketing language. Speak to their problems: finding the right seal material, meeting tight tolerances, getting from prototype to production on schedule.

---

## Industries Served

1. Aerospace and Space
2. Medical devices
3. Analytical and clinical lab instruments
4. Semiconductor processing equipment
5. Autonomous defense equipment
6. Energy processing equipment (oil, gas, solar)
7. Battery technology

---

## Website Goals

**Outward facing (primary):**
- Establish credibility so prospects take SAGA seriously
- Generate inbound leads through contact form and calls to action
- Showcase team experience, industries served, and products represented
- Primary CTA: "Schedule an Appointment"

**Inward facing (future):**
- Serve as a hub and dashboard for the sales rep team
- This is secondary and will be built later

---

## Website Structure

Five pages:
1. Home (index.html) -- first impression, who SAGA is, what we do, CTA
2. About (about.html) -- Mike and Stu's story, experience, why SAGA exists
3. Products/Solutions (products.html) -- PSI seals, structured to add more product lines later
4. Industries (industries.html) -- the seven markets listed above
5. Contact (contact.html) -- appointment form, direct contact info for Mike and Stu

---

## Design Direction

- Dark theme inspired by loomaide.com
- Background: #0a0a0a, Surface: #161616, Accent: #c8a2ff (purple)
- Google Fonts: Inter
- Clean, modern, professional
- Mobile responsive
- Sticky nav with backdrop blur
- Text-based "SAGA" logo in nav (no custom logo designed yet)
- PSI logo integrated on all pages (images/psi-logo.png) in white container with rounded corners
- Photo gallery section exists with placeholder icons — real seal photos to be added later (no confidential designs)

---

## Technical Setup

- Built with plain HTML, CSS, and JavaScript (no frameworks)
- Shared styles.css file
- Git version control, GitHub repo (username: pooopalooop, repo: saga-site)
- Current working branch: claude/modest-ride (PR #1 open)
- Dev server: `npx serve` on port 8080 (configured in .claude/launch.json)
- Claude Code used for development
- Form submissions: Formspree (endpoint: https://formspree.io/f/mlgpbvdo) — sends to sagareps1@gmail.com
- Favicon: SVG file (purple "S" on dark background, matches brand accent color)
- SEO: Meta descriptions and Open Graph tags added to all 5 pages
- Free hosting (platform TBD — GitHub Pages, Netlify, or Vercel under consideration)

---

## Important Reminders

- SAGA is a sales rep firm, not a technology company or consultancy. Do not write copy that sounds like a tech startup or SaaS company.
- The site should feel like an industrial B2B company that knows sealing technology, not a generic agency.
- Future expansion: the site structure should allow adding new product lines and manufacturers without rebuilding.
- All PSI product details, specs, and technical data in this project's reference docs (PDFs) can be used for writing site copy. Do not include anything marked proprietary or confidential on public-facing pages.

---

## Page Section Order (Consistent Across All Pages)

Every page follows this bottom-of-page pattern:
1. (Page-specific content sections)
2. Who We Represent (PSI partner spotlight) — second-to-last
3. Contact section with CTA + Stu & Mike's info — last
4. Footer

Sections alternate between default (`section`) and alt (`section--alt`) backgrounds for visual rhythm.

---

## Current Status / Remaining Tasks

**Completed:**
- All 5 pages built with content, nav, footer
- PSI logo integrated on all pages
- Real phone numbers for Stu and Mike on all pages
- Formspree contact form live (sends to sagareps1@gmail.com)
- SEO meta tags and Open Graph tags on all pages
- SVG favicon on all pages
- GitHub repo set up, PR #1 open

**Pending:**
- Buy domain (sagareps.com or similar — saga.com too expensive)
- Set up custom email (@saga domain) for Stu and Mike
- Update email addresses on site once domain email is live
- Add real seal photos to gallery sections
- Final copy review and polish
- Deploy to hosting (GitHub Pages, Netlify, or Vercel)
- Connect custom domain to hosting
- Merge PR #1 to main
