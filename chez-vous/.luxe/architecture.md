# Site Architecture — Chez Vous 3.0

## Site Type
Multi-page (4 pages)

## Pages
1. `index.html` — Home
2. `menu.html` — Menu (Cocktails & Kitchen)
3. `gallery.html` — Gallery (Atmosphere)
4. `contact.html` — Contact & Location

## Navigation Structure
- Home → index.html
- Menu → menu.html
- Gallery → gallery.html
- Contact → contact.html
- CTA Button: "Reserve" → WhatsApp (wa.me/+35699426960)

## User Journey
**See it → Explore it → Trust it → Book it**
Home hooks with atmosphere → Menu shows craft → Gallery immerses → Contact converts.

---

## HOME (index.html) — Minimum 10 sections

### 1. HERO — Variant A (Centered Fullscreen)
- Fullscreen atmospheric bar ambiance image with dark overlay
- Label: "COCKTAIL BAR & RESTAURANT LOUNGE"
- Title: "Cosmopolitan by *Nature*"
- Description: "A luxury cocktail & dining experience in the heart of Paceville, Malta."
- CTA 1: "Reserve a Table" (→ WhatsApp)
- CTA 2: "Explore" (→ scroll to next section)
- Scroll indicator at bottom (desktop)

### 2. MARQUEE (Infinite Scroll)
- Dark background strip
- Content: "Signature Cocktails ● Mediterranean Fusion ● Premium Spirits ● Live Music ● DJ Sets ● Craft Mixology"

### 3. CINEMATIC IMAGE SEQUENCE ★ Signature Moment 1 — Visual Spectacle
- 4 full-width atmospheric images cross-fading (auto + dots)
- Images: bar interior, cocktail close-up, plated dish, lounge ambiance
- Mobile: swipeable carousel

### 4. ABOUT / STORY — Layout D (Collage)
- Label: "OUR STORY"
- Title: "Where Every Evening Becomes an *Experience*"
- Asymmetric image collage + text
- Pull quote: "We don't just serve drinks — we craft moments."

### 5. SERVICES — Card Grid
- Label: "WHAT WE OFFER"
- Title: "Three Ways to *Indulge*"
- 3 cards: Craft Cocktails, Mediterranean Kitchen, Live Entertainment
- Each card links to relevant page (menu.html or gallery.html)

### 6. COCKTAIL SHOWCASE ★ SM2 + Surprise Element (Hover-Reveal Cards)
- Label: "THE CRAFT"
- Title: "Our Signature *Cocktails*"
- 4 cocktail cards with hover-reveal effect
- CTA: "View Full Menu" → menu.html

### 7. REVIEWS — Slider
- Label: "WHAT THEY SAY"
- Title: "The *Chez Vous* Experience"
- 5 review cards with stars

### 8. GALLERY PREVIEW
- Label: "ATMOSPHERE"
- Title: "Step *Inside*"
- 4-6 images grid preview
- CTA: "View Gallery" → gallery.html

### 9. BRAND STORY STRIP ★ SM3 — Emotional Closer
- Full-width, 70vh min, dramatic image + overlay
- Statement: "Where the *Night* Begins"
- Parallax background

### 10. CTA BANNER
- "Your Table Awaits"
- "Reserve your spot for an unforgettable evening."
- CTA: "Book via WhatsApp" + "Or call us"

### 11. CONTACT COMPACT
- Label: "FIND US"
- Quick contact card with address, phone, WhatsApp
- CTA: "Get Directions" → contact.html

---

## MENU PAGE (menu.html) — 5+ sections

### 1. INTERNAL HERO
- Height: 40-50vh
- BG: Moody cocktail image with heavy overlay
- Breadcrumb: Home > Menu
- Title: "The *Menu*"
- Subtitle: "Signature cocktails & Mediterranean fusion cuisine"

### 2. COCKTAILS SECTION
- Label: "SIGNATURE COCKTAILS"
- Title: "Crafted with *Passion*"
- 6 cocktail cards with image, name, ingredients, description
- Editorial layout: large cards, atmospheric images
- Dark background

### 3. KITCHEN / FOOD SECTION
- Label: "THE KITCHEN"
- Title: "Mediterranean *Fusion*"
- Description of the culinary philosophy
- Food categories: Starters, Mains, Desserts (simple elegant list or cards)
- Light background

### 4. DRINKS SECTION
- Label: "THE BAR"
- Title: "Premium *Spirits* & Wine"
- Selection of wines, spirits, champagne
- Simple elegant presentation
- Dark background

### 5. CTA BANNER
- "Ready to Taste?"
- CTA: "Reserve a Table" → WhatsApp

---

## GALLERY PAGE (gallery.html) — 4+ sections

### 1. INTERNAL HERO
- Height: 40-50vh
- BG: Bar interior panoramic
- Breadcrumb: Home > Gallery
- Title: "Step *Inside*"
- Subtitle: "Explore the Chez Vous 3.0 atmosphere"

### 2. GALLERY GRID — Full
- 12+ images in masonry-like grid
- Categories: Interior, Cocktails, Food, Atmosphere, Events
- Hover overlays with labels
- Mix of landscape and portrait

### 3. BRAND STORY STRIP (reuse from Home)
- "Where the *Night* Begins"
- Parallax background

### 4. CTA BANNER
- "Experience It Yourself"
- CTA: "Reserve a Table" → WhatsApp

---

## CONTACT PAGE (contact.html) — 5+ sections

### 1. INTERNAL HERO
- Height: 40-50vh
- BG: Warm bar ambiance
- Breadcrumb: Home > Contact
- Title: "Visit *Us*"
- Subtitle: "Find us in the heart of Paceville"

### 2. CONTACT INFO + MAP
- 2-column: contact methods + Google Maps
- Address, phone, WhatsApp, email placeholder
- Social links: Instagram, Facebook

### 3. OPENING HOURS
- Elegant card with days and hours
- Premium styling, dark background

### 4. HOW TO FIND US
- Description of location with landmarks
- Parking/transport info for Paceville area
- Light background

### 5. CTA BANNER
- "See You Tonight"
- CTA: "Book via WhatsApp"

---

## Signature Moments

### SM1 — Visual Spectacle: Cinematic Image Sequence (Home, section 3)
- Full-width images auto-crossfading with dot navigation
- Mobile: swipeable carousel
- Interaction type: Scroll/auto-driven

### SM2 — Interactive Delight: Hover-Reveal Cocktail Cards (Home, section 6)
- Cards transform dramatically on hover
- Mobile: tap to reveal
- Interaction type: Hover/tap-driven

### SM3 — Emotional Closer: Brand Story Strip (Home section 9, Gallery section 3)
- Giant display text + parallax background
- Interaction type: Parallax/visual

**Variety**: ✓ Auto/scroll + Hover/tap + Parallax — three different types.

---

## Visual Rhythm — Home

| # | Section | Background |
|---|---------|-----------|
| 1 | Hero | Dark (image) |
| 2 | Marquee | Dark-alt |
| 3 | Cinematic | Dark (images) |
| 4 | About | **Light** |
| 5 | Services | **Light-alt** |
| 6 | Cocktails | **Dark** |
| 7 | Reviews | **Light** |
| 8 | Gallery Preview | **Dark** |
| 9 | Brand Story | **Dark (image)** |
| 10 | CTA Banner | **Dark-alt** |
| 11 | Contact Compact | **Light** |
| 12 | Footer | **Dark** |

Rhythm check: max 2 consecutive darks (8-9), acceptable because 9 is image-dominant.
