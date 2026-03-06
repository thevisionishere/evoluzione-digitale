# Design Tokens — Ristorante Belvedere dal 1933

## Palette Archetype
**C — Warm Earth** (customized for Belvedere's gold/amber brand)
Rationale: Mediterranean restaurant + heritage + warm atmosphere. Their existing gold #dc902e becomes the accent. Deep warm browns for dark sections evoke candlelit dining rooms. Cream tones for light sections feel like linen tablecloths.

## Font Combination
**3 — Warm Editorial** (Libre Baskerville + Source Sans 3 + Cormorant)
Rationale: Libre Baskerville has editorial gravitas perfect for a 90-year restaurant story. Source Sans 3 is clean and readable for body text. Cormorant italic adds Mediterranean elegance for accent quotes and the hero "Cucina" word.

## Google Fonts URL
```
https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,700;1,400&family=Source+Sans+3:wght@400;600&family=Cormorant:ital,wght@0,600;1,400;1,500&display=swap
```

## CSS Custom Properties

```css
:root {
  /* --- Primary Palette (Warm Earth - Belvedere) --- */
  --color-dark:          #1a1410;
  --color-dark-alt:      #2c2416;
  --color-light:         #f7f2ec;
  --color-light-alt:     #ede5d8;

  /* --- Accent (Belvedere Gold) --- */
  --color-accent:        #dc902e;
  --color-accent-light:  #e8a84e;
  --color-accent-dark:   #b87520;
  --color-accent-rgb:    220, 144, 46;

  /* --- Neutral --- */
  --color-text-dark:     #2c2416;
  --color-text-light:    #f7f2ec;
  --color-text-muted:    #8a7a66;
  --color-border:        rgba(220, 144, 46, 0.2);
  --color-border-light:  rgba(44, 36, 22, 0.1);

  /* --- Semantic --- */
  --color-error:         #c0392b;
  --color-success:       #dc902e;
  --color-overlay:       rgba(26, 20, 16, 0.7);

  /* --- Typography --- */
  --font-display:    'Libre Baskerville', serif;
  --font-body:       'Source Sans 3', sans-serif;
  --font-accent:     'Cormorant', serif;

  /* --- Font Sizes (mobile-first, fluid) --- */
  --text-xs:    clamp(0.75rem, 0.7rem + 0.25vw, 0.8125rem);
  --text-sm:    clamp(0.8125rem, 0.76rem + 0.26vw, 0.875rem);
  --text-base:  clamp(0.9375rem, 0.88rem + 0.29vw, 1.0625rem);
  --text-lg:    clamp(1.0625rem, 0.97rem + 0.46vw, 1.25rem);
  --text-xl:    clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
  --text-2xl:   clamp(1.5rem, 1.2rem + 1.5vw, 2.25rem);
  --text-3xl:   clamp(2rem, 1.5rem + 2.5vw, 3.5rem);
  --text-4xl:   clamp(2.5rem, 1.8rem + 3.5vw, 5rem);

  --weight-regular:  400;
  --weight-medium:   500;
  --weight-semibold: 600;
  --weight-bold:     700;

  --leading-tight:   1.1;
  --leading-snug:    1.3;
  --leading-normal:  1.6;
  --leading-relaxed: 1.8;

  --tracking-tight:  -0.02em;
  --tracking-normal: 0;
  --tracking-wide:   0.05em;
  --tracking-wider:  0.1em;
  --tracking-widest: 0.2em;

  /* --- Spacing --- */
  --space-1:   0.25rem;
  --space-2:   0.5rem;
  --space-3:   0.75rem;
  --space-4:   1rem;
  --space-5:   1.5rem;
  --space-6:   2rem;
  --space-7:   3rem;
  --space-8:   4rem;
  --space-9:   6rem;
  --space-10:  8rem;

  --section-padding: clamp(4rem, 8vw, 8rem);
  --container-width: min(90%, 1280px);
  --container-narrow: min(85%, 900px);

  /* --- Border, Radius & Shadow --- */
  --radius-sm:   0.25rem;
  --radius-md:   0.5rem;
  --radius-lg:   1rem;
  --radius-xl:   1.5rem;
  --radius-full: 9999px;

  --shadow-sm:   0 1px 3px rgba(0,0,0,0.08);
  --shadow-md:   0 4px 12px rgba(0,0,0,0.1);
  --shadow-lg:   0 8px 30px rgba(0,0,0,0.12);
  --shadow-xl:   0 20px 60px rgba(0,0,0,0.15);
  --shadow-glow: 0 0 20px rgba(220, 144, 46, 0.3);

  /* --- Animation --- */
  --ease-out:     cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out:  cubic-bezier(0.65, 0, 0.35, 1);
  --ease-bounce:  cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-smooth:  cubic-bezier(0.25, 0.1, 0.25, 1);

  --duration-fast:    200ms;
  --duration-normal:  400ms;
  --duration-slow:    600ms;
  --duration-slower:  800ms;

  --transition-fast:    all var(--duration-fast) var(--ease-out);
  --transition-normal:  all var(--duration-normal) var(--ease-out);
  --transition-slow:    all var(--duration-slow) var(--ease-out);
}
```

## Image Direction

| Section | Image Style | Search Terms / Source |
|---|---|---|
| Hero BG | Warm, atmospheric, moody lighting | Scraped: home4.jpg (food + Belvedere sign) — OR Unsplash: "Italian restaurant terrace sunset panoramic" |
| Cinematic 1 | Close-up food plating, warm tones | Scraped: home4.jpg (tortellini dish) |
| Cinematic 2 | Panoramic Italian hilltop view | Unsplash: "Italian hills sunset panoramic view Rome" |
| Cinematic 3 | Chef working in kitchen, action shot | Unsplash: "Italian chef kitchen cooking action" |
| Cinematic 4 | Elegant dessert close-up | Scraped: home5.jpg (strawberry desserts) |
| Timeline images | Historic/vintage feel, B&W | Scraped: Esterni_Belvedere-1933-300x200.jpg + Unsplash: "Italian trattoria vintage" |
| Team | Warm, professional portraits | Scraped: DSC_6737-200x300.jpg (both brothers) |
| CTA Banner BG | Panoramic terrace at golden hour | Unsplash: "restaurant terrace panoramic view Italian sunset" |
| Gallery | Mix of food, interior, terrace | Scraped + Unsplash: variety of Italian fine dining images |
| Brand Story Strip BG | Epic panoramic landscape | Unsplash: "Italian countryside panoramic sunset Castelli Romani" |

## Design Personality Notes
- **Spacing**: Generous — Heritage Premium demands breathing room. Sections feel spacious, not cramped.
- **Radius**: Small (--radius-sm) — Classic, sharp edges. Heritage businesses don't do rounded corners.
- **Animation**: Slow and dignified — --duration-slow and --duration-slower. Nothing fast or bouncy. Every animation should feel like opening a wine bottle, not popping champagne.
- **Imagery mood**: Warm, golden hour, candlelit. Dark shadows with warm highlights. Nothing cold or clinical.
- **Whitespace**: Generous within sections. Text blocks are narrow (--container-narrow). Images are wide. Contrast between tight text and expansive visuals.
