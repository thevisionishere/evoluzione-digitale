# Design Tokens — FREIP

## Palette Archetype
**E — Bold Contrast** (customized with FREIP brand green)
Rationale: FREIP è un brand modern/trendy con estetica street/urban. Il logo è verde vivace su sfondo scuro. Bold Contrast con green accent riflette l'energia del brand: audace, diretto, visivamente potente. Il verde del logo (#6B9B37) viene intensificato per il web a #5CB338 per maggiore vibrazione su sfondi scuri.

## Font Combination
**5 — Bold & Confident** (Syne + Work Sans)
Rationale: Syne è un display font bold, geometrico e condensato — perfetto per titoli che devono colpire come street art. Work Sans è pulito e leggibile per il body text. La combinazione esprime energia e modernità senza sacrificare leggibilità.

## CSS Custom Properties

```css
:root {
  /* --- Primary Palette (Bold Contrast + FREIP Green) --- */
  --color-dark:          #0a0a0a;
  --color-dark-alt:      #141414;
  --color-light:         #f5f5f5;
  --color-light-alt:     #ebebeb;

  /* --- Accent (FREIP Brand Green, intensified) --- */
  --color-accent:        #5CB338;
  --color-accent-light:  #7ACC55;
  --color-accent-dark:   #468A2A;
  --color-accent-rgb:    92, 179, 56;

  /* --- Neutral --- */
  --color-text-dark:     #1a1a1a;
  --color-text-light:    #e8e8e8;
  --color-text-muted:    #888888;
  --color-border:        rgba(92, 179, 56, 0.2);
  --color-border-light:  rgba(0, 0, 0, 0.08);

  /* --- Semantic --- */
  --color-error:         #c0392b;
  --color-success:       #5CB338;
  --color-overlay:       rgba(10, 10, 10, 0.7);

  /* --- Typography --- */
  --font-display:    'Syne', sans-serif;
  --font-body:       'Work Sans', sans-serif;
  --font-accent:     'Syne', sans-serif;

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
  --shadow-md:   0 4px 12px rgba(0,0,0,0.15);
  --shadow-lg:   0 8px 30px rgba(0,0,0,0.2);
  --shadow-xl:   0 20px 60px rgba(0,0,0,0.25);
  --shadow-glow: 0 0 20px rgba(92, 179, 56, 0.3);

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

## Image Search Direction
| Section | Image Direction | Mood |
|---|---|---|
| Hero Gallery | Design FREIP reali dalla cartella 00 disegni vari | Bold, colorful on dark |
| About Collage | Giovane artista/designer al lavoro, street art vibes | Urban, creative |
| Process | Illustrazioni/icone custom per ogni step | Clean icons on dark |
| Services | T-shirt mockup con design, close-up stampa | Product, detail |
| Brand Story | Street art murale, spray paint texture | Gritty, atmospheric |
| Instagram | Preview reali dal feed | Authentic |
| Internal Heroes | Design FREIP con overlay scuro | Brand-consistent |

## Design Personality Summary
- **Background dominante**: Dark (#0a0a0a) — coerente con l'estetica street/urban
- **Sezioni light**: Usate con parsimonia per contrasto (about, services, reviews)
- **Accent verde**: Usato per CTA, highlight, hover states, dettagli — mai come background pieno
- **Animazioni**: Energiche ma non caotiche. Ease-out rapido, stagger veloce (100ms). Il sito deve sentirsi "vivo" come la street art.
- **Radius**: md per cards, sm per buttons — non troppo arrotondato (non è un brand friendly/cute) ma non sharp/corporate
- **Imagery**: I design FREIP sono i protagonisti. Stock photo solo dove necessario (about, backgrounds). Mai foto generiche di t-shirt bianche.
- **Hover**: Sempre presenti, sempre con accent verde. Scale, glow, o color shift.

## Google Fonts URL
```
https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Work+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap
```
