# Design Tokens — Chez Vous 3.0

## Palette
**Archetype A — Dark Luxury** customized for cocktail bar nightlife ambiance.
Dark backgrounds dominate to mirror the moody interior lighting. Warm gold accent evokes candlelight, premium spirits, and luxury.

## Font Combination
**Combo 4 — Refined Contemporary** (Cormorant Garamond + Plus Jakarta Sans)
Elegant serif display creates sophistication; clean contemporary body ensures readability. The italic accent font adds editorial flair for quotes and featured text.

## CSS Custom Properties

```css
:root {
  /* --- Primary Palette --- */
  --color-dark:          #0d0d0d;
  --color-dark-alt:      #1a1a2e;
  --color-light:         #faf8f5;
  --color-light-alt:     #f2ede6;

  /* --- Accent (Warm Gold) --- */
  --color-accent:        #c9a84c;
  --color-accent-light:  #d4b86a;
  --color-accent-dark:   #a88a35;
  --color-accent-rgb:    201, 168, 76;

  /* --- Neutral --- */
  --color-text-dark:     #1a1a1a;
  --color-text-light:    #f0ece5;
  --color-text-muted:    #8a8578;
  --color-border:        rgba(201, 168, 76, 0.2);
  --color-border-light:  rgba(26, 26, 26, 0.08);

  /* --- Semantic --- */
  --color-error:         #c45b5b;
  --color-success:       #c9a84c;
  --color-overlay:       rgba(13, 13, 13, 0.7);

  /* --- Typography --- */
  --font-display:    'Cormorant Garamond', serif;
  --font-body:       'Plus Jakarta Sans', sans-serif;
  --font-accent:     'Cormorant Garamond', serif;

  /* --- Font Sizes (mobile-first, fluid) --- */
  --text-xs:    clamp(0.75rem, 0.7rem + 0.25vw, 0.8125rem);
  --text-sm:    clamp(0.8125rem, 0.76rem + 0.26vw, 0.875rem);
  --text-base:  clamp(0.9375rem, 0.88rem + 0.29vw, 1.0625rem);
  --text-lg:    clamp(1.0625rem, 0.97rem + 0.46vw, 1.25rem);
  --text-xl:    clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
  --text-2xl:   clamp(1.5rem, 1.2rem + 1.5vw, 2.25rem);
  --text-3xl:   clamp(2rem, 1.5rem + 2.5vw, 3.5rem);
  --text-4xl:   clamp(2.5rem, 1.8rem + 3.5vw, 5rem);

  --weight-light:    300;
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
  --shadow-glow: 0 0 20px rgba(201, 168, 76, 0.3);

  /* --- Animation --- */
  --ease-out:     cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out:  cubic-bezier(0.65, 0, 0.35, 1);
  --ease-bounce:  cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-smooth:  cubic-bezier(0.25, 0.1, 0.25, 1);

  --duration-fast:    200ms;
  --duration-normal:  400ms;
  --duration-slow:    600ms;
  --duration-slower:  800ms;

  --transition-fast:    all 200ms cubic-bezier(0.16, 1, 0.3, 1);
  --transition-normal:  all 400ms cubic-bezier(0.16, 1, 0.3, 1);
  --transition-slow:    all 600ms cubic-bezier(0.16, 1, 0.3, 1);
}
```

## Google Fonts URL
```
https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap
```

## Image Direction per Section

| Section | Unsplash Search Direction | Mood |
|---|---|---|
| Hero BG | luxury cocktail bar interior, dim lighting, amber tones | Dark, inviting, luxurious |
| Cinematic 1 | upscale bar counter, bottles, warm lighting | Atmospheric, warm |
| Cinematic 2 | craft cocktail close-up, dark background | Detailed, artful |
| Cinematic 3 | Mediterranean food plating, elegant | Appetizing, refined |
| Cinematic 4 | lounge seating, night ambiance, candles | Intimate, social |
| About collage 1 | bartender making cocktail, action shot | Dynamic, craft |
| About collage 2 | bar interior detail, decor | Textural, moody |
| About collage 3 | drinks and food on bar, ambient | Social, warm |
| Cocktail cards | individual cocktails on dark background | Dramatic, artful |
| Gallery images | mix of bar interior, drinks, food, nightlife | Varied, atmospheric |
| Brand Story Strip BG | panoramic bar/lounge at night | Cinematic, grand |
| CTA Banner BG | cocktail glass, bokeh lights | Warm, inviting |

## Design Personality Summary
- **Spacing**: Very generous — luxury needs breathing room
- **Radius**: sm/none — sharp, sophisticated edges (no rounded friendliness)
- **Animation**: Slow, subtle, restrained — confidence, not excitement
- **Overall feel**: Like stepping into a premium bar at golden hour — warm, dark, inviting, with golden accents catching the light
