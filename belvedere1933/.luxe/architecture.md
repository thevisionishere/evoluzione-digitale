# Site Architecture — Ristorante Belvedere dal 1933

## Site Type
Single-page (all content on index.html)

## Pages
- `index.html` — Home (single-page, all sections)

## Section Order & Justification

The customer journey: **Immersion → Story → Trust → Action → Details**

### 1. Hero (Variant A — Centered Fullscreen) — DARK
- Fullscreen atmospheric image (food/ambiance with Belvedere sign) + dark overlay
- Label: "DAL 1933 • FRASCATI"
- Title: "Storie in *Cucina*" (accent word in Cormorant italic)
- Description: Brief about panoramic dining experience
- CTAs: "Prenota un Tavolo" (primary) + "Scopri il Menu" (secondary)
- Stats bar: "90+ Anni" | "Km Zero" | "Terrazza Panoramica"
- Scroll indicator at bottom
- **Justification**: Experience business = immersive fullscreen opening. Premium positioning demands this.

### 2. Marquee — ACCENT/DARK
- Infinite scrolling strip: "Cucina Mediterranea • Panorama su Roma • Dal 1933 • Km Zero • Chef Alain & Nelson • Attività Storica del Lazio"
- Decorative separator: the fregio/leaf motif from their branding
- **Justification**: Breathing moment + brand messaging. Establishes all key points in a premium, kinetic way.

### 3. Cinematic Image Sequence (SIGNATURE MOMENT 1 — Visual Spectacle) — DARK/VISUAL
- 4 full-width images cross-fading on scroll: food plating, terrace panorama, kitchen action, dessert
- Minimal text overlay on last image: "L'arte del gusto"
- Mobile: swipeable carousel with dots
- **Justification**: Experience business = SHOW the experience first, before telling. These images sell the dinner before any text does.

### 4. About / Story Timeline (SIGNATURE MOMENT 2 — Interactive Delight) — LIGHT/WARM
- Section title: "La Nostra Storia"
- Scroll-triggered vertical timeline:
  - **1933** — "Nasce la Trattoria Belvedere" — founding on the Frascati hilltop
  - **1998** — "La Famiglia Rosica" — Alain and Nelson take over, transformation begins
  - **Oggi** — "Innovazione nella Tradizione" — Mediterranean fine dining with km zero ingredients
- Timeline line draws itself as user scrolls, nodes appear progressively
- Image alongside each milestone
- "Attività Storica del Lazio" badge at the end
- **Justification**: History IS their #1 differentiator. A timeline that draws itself creates engagement and makes 90 years of history feel alive, not dusty.

### 5. Team — DARK/WARM
- Section title: "I Nostri Chef"
- 2 large side-by-side cards (NOT small grid — only 2 people)
- Each card: portrait photo, name, role, philosophy quote in Cormorant italic
- Warm dark background, gold accent details
- **Justification**: Two brothers running a family kitchen is deeply personal. Large format cards give them the prominence they deserve.

### 6. CTA Banner (Style B — Image Background) — IMAGE
- Fullwidth panoramic terrace image + dark overlay
- Text: "Vivi l'Esperienza Belvedere"
- Subtitle: "Una cena con vista su Roma e i Castelli Romani"
- CTA: "Prenota Ora" → tel link
- **Justification**: Mid-page conversion point. The panoramic view IS the product — showing it behind the CTA creates desire.

### 7. Services Card Grid — LIGHT
- Section title: "I Nostri Servizi"
- 4 cards in 2x2 grid (desktop), stacked mobile:
  - Ristorante — Fine dining mediterraneo
  - Catering — Servizio per eventi (link a belvederecatering.it)
  - Menu Digitale — Consulta i nostri piatti (link a leggimenu.it)
  - Eventi Privati — Cene private e ricorrenze
- Each card: number, icon, title, description, hover accent underline
- **Justification**: Simple offering (4 services) fits card grid. Light background creates breathing room after CTA image.

### 8. Numbers / Statistics — DARK/ACCENT
- Dark warm background with gold accent elements
- 4 stats: "1933" (Anno di Fondazione) | "90+" (Anni di Storia) | "2" (Chef Fratelli) | "1" (Terrazza Panoramica)
- Animated counters on scroll
- **Justification**: Concrete numbers build credibility. The "since 1933" stat is a powerful trust signal.

### 9. Gallery Grid — LIGHT
- Section title: "Galleria"
- CSS Grid masonry layout with 6-8 images (mix of scraped food photos + Unsplash)
- Hover: dark overlay with label
- Categories of images: food, interior, terrace, plating
- **Justification**: Highly visual business needs a dedicated gallery. Light background lets photos breathe.

### 10. Reviews Slider — WARM/DARK
- Section title: "Cosa Dicono di Noi"
- Horizontal scroll-snap carousel with 4-5 reviews
- Quote styling: large Cormorant italic quotes, reviewer name + stars
- Created reviews (none from research): specific, varied, credible
- **Justification**: Social proof is essential for restaurants. Placed after gallery (visual proof) to reinforce the decision.

### 11. FAQ — LIGHT
- Section title: "Domande Frequenti"
- Accordion with 5-6 questions:
  - Quali sono gli orari di apertura?
  - Come posso prenotare?
  - C'è un parcheggio disponibile?
  - Avete opzioni per intolleranze alimentari?
  - Offrite servizio catering?
  - Qual è il dress code?
- **Justification**: Quick Info Seekers (secondary profile) need practical answers. Placed late because emotional buyers scroll first, info seekers can jump here.

### 12. Brand Story Strip (SIGNATURE MOMENT 3 — Emotional Closer) — IMAGE/DARK
- Full-width panoramic terrace image (60-70vh), heavy dark overlay
- Single powerful sentence: "Storie in cucina dal 1933" in huge display font (6-8vw)
- Accent word "Storie" in Cormorant italic gold
- Creates gravitas and emotional connection before contact section
- **Justification**: The emotional closer. Before asking for contact info, remind them what makes this place special. The panoramic image + founder tagline creates desire.

### 13. Contact Full + Map — DARK
- Section title: "Contattaci"
- 2-column: Left = contact methods (phone, WhatsApp, email, address, hours), Right = contact form
- Google Maps embed below
- CTA: "Prenota un Tavolo" (phone) + "Scrivici su WhatsApp" (WhatsApp link)
- **Justification**: Final conversion section. All info in one place. Map is essential (location IS the product).

## Visual Rhythm Verification
1. Hero — DARK ✓
2. Marquee — ACCENT ✓ (different texture)
3. Cinematic — DARK ✓ (visual, different from #1)
4. About — LIGHT ← breaks dark streak ✓
5. Team — DARK ✓
6. CTA Banner — IMAGE ✓ (different from #5)
7. Services — LIGHT ✓ ← breaks dark streak
8. Numbers — DARK ✓
9. Gallery — LIGHT ✓ ← alternates
10. Reviews — WARM/DARK ✓
11. FAQ — LIGHT ✓ ← alternates
12. Brand Story — IMAGE ✓
13. Contact — DARK ✓

No 3 consecutive same-background sections. ✓
Alternating dense and airy. ✓
Breathing moments: Marquee (2), CTA Banner (6), Brand Story Strip (12). ✓

## Signature Moments

### 1. Visual Spectacle — Cinematic Image Sequence (Section 3)
- **Technique**: Cross-fading full-width images on scroll
- **Placement**: Immediately after marquee, 2nd scroll position
- **Why**: Experience/atmosphere business — the food and ambiance ARE the product. Showing 4 stunning images in a cinematic cross-fade creates the "I need to eat there" reaction before any text
- **Mobile**: Swipeable carousel with dot indicators

### 2. Interactive Delight — Scroll-Triggered Timeline (Section 4)
- **Technique**: Timeline line draws itself as user scrolls, nodes and content reveal progressively
- **Placement**: About section, middle-early in page
- **Why**: 90 years of history is their strongest differentiator. A static timeline is forgettable — one that draws itself creates engagement and makes the visitor an active participant in the story
- **Mobile**: Simplified vertical timeline, content fades in on scroll (no self-drawing line)

### 3. Emotional Closer — Brand Story Strip (Section 12)
- **Technique**: Full-width parallax image with single powerful sentence in oversized display typography
- **Placement**: Before contact section, final third
- **Why**: Before asking the visitor to take action (book/call), remind them of the emotional promise. The panoramic view + "Storie in cucina dal 1933" creates a moment of desire that pushes toward conversion
- **Mobile**: Static image + overlaid text (no parallax)

**Variety check**: Scroll-based (Cinematic) + Scroll-interactive (Timeline) + Static-emotional (Brand Story) — three different interaction types ✓

## User Journey Map
1. **Arrive** → Hero: immersed in atmosphere, see panoramic promise, stats build intrigue
2. **Scroll** → Marquee: brand keywords sink in subconsciously
3. **Experience** → Cinematic: food and ambiance photos create desire
4. **Learn** → Timeline: the story builds credibility and emotional connection
5. **Connect** → Team: faces behind the food, personal touch
6. **Want** → CTA Banner: the panoramic view + "Prenota Ora" creates urgency
7. **Understand** → Services: what they offer, practical details
8. **Trust** → Numbers + Reviews: social proof and stats seal the deal
9. **See more** → Gallery: additional visual proof
10. **Practical** → FAQ: hours, parking, dietary needs
11. **Feel** → Brand Story Strip: final emotional push
12. **Act** → Contact + Map: book, call, visit

## CTA Strategy
- **Primary action**: Phone call (tel:+390694190004) — restaurant reservations are phone-based
- **Secondary action**: WhatsApp message (wa.me/393517722207) — modern alternative
- **Tertiary**: Contact form (for inquiries, events, catering)
- **CTA placements**: Hero (2 CTAs), CTA Banner (1), Contact section (2), WhatsApp floating button (always)
