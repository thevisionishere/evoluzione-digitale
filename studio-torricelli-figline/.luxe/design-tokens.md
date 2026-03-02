# LUXE Design Tokens — Studio Dentistico Torricelli

## Palette Archetype
**D — Cool Professional** customized con brand colors (#29d8db turchese + #01578c blu)
Rationale: Studio medico/odontoiatrico con posizionamento professionale. Il turchese del brand si integra perfettamente nella palette cool-professional, comunicando pulizia, fiducia e modernità clinica.

## Font Combination
**2 — Modern Authority** (Outfit + Inter + Lora Italic)
Rationale: Outfit per i titoli comunica autorevolezza moderna senza essere freddo. Inter per il body è massimamente leggibile. Lora Italic per accenti aggiunge raffinatezza senza rompere la professionalità.

## CSS Custom Properties

```css
:root {
  /* --- Primary Palette --- */
  --color-dark:          #0f1923;
  --color-dark-alt:      #1a2b3d;
  --color-light:         #f8fafb;
  --color-light-alt:     #eef2f5;

  /* --- Accent (brand turchese) --- */
  --color-accent:        #29d8db;
  --color-accent-rgb:    41, 216, 219;
  --color-accent-light:  #5ee4e6;
  --color-accent-dark:   #01578c;

  /* --- Neutral --- */
  --color-text-dark:     #1a2332;
  --color-text-light:    #f0f4f7;
  --color-text-muted:    #6b7d8e;
  --color-border:        rgba(41, 216, 219, 0.2);
  --color-border-light:  rgba(15, 25, 35, 0.08);

  /* --- Semantic --- */
  --color-error:         #c0392b;
  --color-success:       #29d8db;
  --color-overlay:       rgba(15, 25, 35, 0.7);

  /* --- Typography --- */
  --font-display:    'Outfit', sans-serif;
  --font-body:       'Inter', sans-serif;
  --font-accent:     'Lora', serif;

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
  --shadow-glow: 0 0 20px rgba(41, 216, 219, 0.3);

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
https://fonts.googleapis.com/css2?family=Outfit:wght@600;700&family=Inter:wght@400;500&family=Lora:ital@1&display=swap
```

## Image Direction
Le immagini del sito esistente sono state scaricate e disponibili in `images/`. Usare quelle reali dove possibile:

| Sezione | Immagine reale | Fallback Unsplash |
|---------|---------------|-------------------|
| Hero | images/homepage/studio_dentistico_torricelli.jpg | modern dental clinic team |
| About | images/homepage/studio_torricelli_3.jpg | dental office interior modern |
| Studio/Sala | images/studio-.../sala_1.jpg, sala_2.jpg, sala_3.jpg | — |
| Team | images/studio-.../stefano_torricelli.jpg + tutti i membri | — |
| Sterilizzazione | images/sterilizzazione/sterilizzazione_studio_torricelli.jpg | — |
| Radiologia | images/studio-.../radiologia.jpg, images/radiologia-2/radiologia-1.jpg | — |
| Endodonzia | images/endodonzia/endodonzia_1.jpg | — |
| Implantologia | images/implantologia/implantologia.jpg | — |
| Protesi | images/protesi/protesi.jpg | — |
| Trattamenti Estetici | images/trattamenti-.../trattamenti-estetici.jpg | — |
| Odontoiatria Conservativa | images/odontoiatria-.../terapia_conservativa.jpg | — |
| Igiene/Prevenzione | images/igiene-.../prevenzione.jpg | — |
| Ortodonzia Infantile | images/ortodonzia-.../ortodonzia-infantile-pagina_1.jpg | — |
| Pedodonzia | images/homepage/piccoli_pazienti_crescono.jpg | — |
| Bambini | images/homepage/piccoli_pazienti_crescono.jpg | — |
| Osteopatia | images/osteopatia/matteo-balocco.jpg + balocco*.jpg | — |
| Posturologia | images/servizi-.../mirko_pasquini.jpg | — |
| Dietologia | images/servizi-.../dietologia.jpg | — |
| Comfort/Odontofobia | images/homepage/studio_torricelli_1.jpg | — |
| Logo | images/homepage/logo.png | — |
