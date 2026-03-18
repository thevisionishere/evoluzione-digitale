# Site Architecture — FREIP

## Pages

| # | Page | Filename | Purpose |
|---|------|----------|---------|
| 1 | Home | index.html | Effetto WOW → showcase design → drive to preventivo |
| 2 | Chi Siamo | chi-siamo.html | Storia del fondatore e la filosofia FREIP |
| 3 | Servizi | servizi.html | Cosa offre FREIP e come funziona |
| 4 | Galleria | galleria.html | Portfolio completo categorizzato |
| 5 | Recensioni | recensioni.html | Social proof e testimonianze |
| 6 | Contatti | contatti.html | Form + info per ordinare |

---

## Home Page — Section Flow (12 sections)

Il flusso segue il journey dell'acquirente emotivo/impulsivo:
**VEDI l'arte (WOW) → ESPLORA la varietà → CAPPISCI il processo → FIDATI dell'artista → AGISCI**

| # | Section | Type | Justification |
|---|---------|------|---------------|
| 1 | **Hero Gallery** | Hero Variant C | I design SONO il prodotto. Gallery rotante dei migliori lavori crea impatto immediato. Niente stock photo: le grafiche FREIP parlano da sole. |
| 2 | **Marquee** | Marquee Infinite Scroll | Strip di energia: "CUSTOM T-SHIRT • FELPE PERSONALIZZATE • STREET ART • ANIME • MANGA • LA TUA UNICITÀ". Separa hero dalla galleria, crea ritmo. |
| 3 | **Design Showcase** | Horizontal Scroll Section | **SIGNATURE MOMENT 1** — I top design scorrono orizzontalmente, immersivi. Il visitatore esplora la varietà senza scrollare verticalmente. |
| 4 | **L'Artista** | About Collage (Layout D) | Anteprima: foto dell'artista + collage dei lavori + breve bio. Umanizza il brand: non è un servizio automatico, è una persona. |
| 5 | **Come Nasce la Tua Custom** | Process Interactive Path (Layout C) | **SIGNATURE MOMENT 2** — I 4 step (Parlami di te → Bozzetto → Revisione → Stampa) si rivelano con scroll animation. Path che si disegna. |
| 6 | **I Nostri Servizi** | Services Card Grid | 3 card: T-Shirt Custom, Felpe Custom, Design Su Misura. Hover-reveal con preview del design. Link a pagina servizi. |
| 7 | **CTA "Crea la Tua Custom"** | CTA Banner Style B (Bold/Dynamic) | Background dark, testo grande verde accent, bottone diretto a WhatsApp. Break visivo che spinge all'azione. |
| 8 | **Dicono di Noi** | Reviews Slider | Testimonianze clienti (da creare credibili basate sul profilo). Stars + quote + nome. Social proof prima dei numeri. |
| 9 | **I Numeri FREIP** | Numbers/Statistics | 3-4 stat animate: "150+ Design Creati", "98% Clienti Soddisfatti", "5 Stili Disponibili", "2 Anni di Passione". |
| 10 | **Brand Story** | Brand Story Strip | **SIGNATURE MOMENT 3** — Full-width, background scuro, frase potente gigante: "Ogni t-shirt racconta la tua storia. Noi la disegniamo." Display font, 60vh minimo. |
| 11 | **Instagram Feed** | Instagram Grid | 6 immagini dal feed @tshirtme79. Ponte tra sito e social. |
| 12 | **Contatto Rapido** | Contact Compact | Card centrata: telefono, email, WhatsApp, CTA "Chiedi un Preventivo". Ultimo push prima del footer. |

### Visual Rhythm Check
- Dark/Light alternanza: Hero(dark) → Marquee(dark) → Showcase(light) → About(light) → Process(dark) → Services(light) → CTA(dark) → Reviews(light) → Numbers(dark) → Story(dark) → Instagram(light) → Contact(light)
- Dense/Airy: Gallery(visual) → Marquee(breathing) → Scroll(visual) → About(mixed) → Process(interactive) → Cards(grid) → CTA(breathing) → Slider(visual) → Numbers(grid) → Story(breathing) → Grid(visual) → Card(compact)
- No 3 consecutive same backgrounds ✓
- First section after hero is impactful (Marquee + Horizontal Gallery) ✓
- Ends with CTA before footer ✓

---

## Internal Pages

### Chi Siamo (chi-siamo.html) — 5 sections
| # | Section | Justification |
|---|---------|---------------|
| 1 | Internal Hero | Titolo "La Nostra Storia", background con collage design |
| 2 | About Timeline (Layout C) | La storia completa: Scuola d'Arte → Prima P.IVA → Pausa → Rinascita Digitale → FREIP Oggi. Timeline verticale, perfetta per il percorso del fondatore. |
| 3 | Numbers/Stats | I numeri che parlano |
| 4 | Gallery Collage | Processo creativo: dalla sketch al prodotto finito |
| 5 | CTA → Servizi | "Scopri Cosa Possiamo Creare Per Te" |

### Servizi (servizi.html) — 5 sections
| # | Section | Justification |
|---|---------|---------------|
| 1 | Internal Hero | Titolo "I Nostri Servizi" |
| 2 | Services Expanded List | T-Shirt Custom, Felpe Custom, Design Su Misura — con immagini, descrizioni dettagliate, categorie di stile |
| 3 | Process Steps (Layout A) | "Come Funziona" in versione dettagliata |
| 4 | FAQ | Domande frequenti: tempi, materiali, spedizione, prezzi |
| 5 | CTA → Contatti | "Richiedi il Tuo Preventivo" |

### Galleria (galleria.html) — 4 sections
| # | Section | Justification |
|---|---------|---------------|
| 1 | Internal Hero | Titolo "Le Nostre Creazioni" |
| 2 | Gallery Grid con Filter Tabs | Tab: Tutti / Anime & Manga / Street Art / Frasi & Lettere / Personaggi / Custom. Masonry grid con hover overlay + lightbox. Il cuore del sito. |
| 3 | CTA Banner | "Ti piace quello che vedi? Creiamo il tuo design." |
| 4 | Contact Compact | Quick contact |

### Recensioni (recensioni.html) — 4 sections
| # | Section | Justification |
|---|---------|---------------|
| 1 | Internal Hero | Titolo "Cosa Dicono i Nostri Clienti" |
| 2 | Reviews Grid (Masonry) | Tutte le recensioni in formato masonry, più impattante dello slider |
| 3 | Numbers/Stats | Statistiche di soddisfazione |
| 4 | CTA → Contatti | "Unisciti ai Nostri Clienti Soddisfatti" |

### Contatti (contatti.html) — 4 sections
| # | Section | Justification |
|---|---------|---------------|
| 1 | Internal Hero | Titolo "Contattaci" |
| 2 | Contact Full | Form + info contatto (telefono, email, WhatsApp, social) in 2 colonne |
| 3 | FAQ Compact | 3-4 domande pratiche (tempi, pagamento, spedizione) |
| 4 | Social Links / Instagram | Collegamento ai social |

---

## User Journey Map

```
NUOVO VISITATORE (da Instagram/TikTok/ricerca)
    │
    ▼
HOME: Hero Gallery → WOW visivo immediato
    │
    ▼
Scrolls → Horizontal Design Showcase → "Questi design sono incredibili"
    │
    ▼
Come Nasce la Tua Custom → "Capisco, è un processo personale"
    │
    ▼
Reviews + Numbers → "Anche altri lo hanno fatto e sono contenti"
    │
    ▼
Brand Story → Connessione emotiva con l'artista
    │
    ▼
CTA → WhatsApp / Email per preventivo
    │
    ├──→ GALLERIA (se vuole vedere tutto il portfolio)
    ├──→ SERVIZI (se vuole dettagli su cosa può ordinare)
    ├──→ CHI SIAMO (se vuole sapere di più sull'artista)
    └──→ CONTATTI (se è pronto a ordinare)
```

## Surprise Element Placement
Il "Come Nasce la Tua Custom" (processo interattivo) è l'elemento sorpresa principale. Nessun competitor print-on-demand mostra il processo creativo come un viaggio personale. Combinato con la Horizontal Scroll Gallery (che mostra la varietà in modo cinematico) e il Brand Story Strip (che chiude con emozione), il trittico crea un'esperienza unica.

---

## Signature Moments

### 1. Visual Spectacle — Horizontal Scroll Design Showcase
- **Tecnica**: Horizontal Scroll Section
- **Posizione**: 3a sezione della Home (dopo Hero + Marquee)
- **Implementazione**: Scroll verticale trigghera movimento orizzontale. I top design FREIP scorrono in cards larghe con titolo e categoria. Sfondo scuro, design su sfondo chiaro con ombre. Conta almeno 8-10 design.
- **Perché**: FREIP è un business visivo puro. Il visitatore deve ESPLORARE i design come in una galleria d'arte, non in una griglia statica. L'horizontal scroll crea un momento cinematico che un template non può replicare.
- **Mobile**: Scroll snap orizzontale nativo con swipe.

### 2. Interactive Delight — Come Nasce la Tua Custom (Interactive Path)
- **Tecnica**: Scroll-Triggered Timeline / Interactive Path
- **Posizione**: 5a sezione della Home
- **Implementazione**: 4 step con icone illustrate: (1) "Parlami di Te" — il cliente condivide la sua idea (2) "Il Bozzetto" — FREIP crea la prima bozza (3) "Revisione Insieme" — feedback e aggiustamenti (4) "La Tua Custom è Pronta" — stampa e consegna. La linea del path si disegna con lo scroll, i nodi appaiono progressivamente con stagger.
- **Perché**: Differenzia FREIP dal print-on-demand generico. Mostra che dietro c'è un PROCESSO UMANO, non un configuratore automatico. Il fondatore parla con te: questo è il USP e va mostrato in modo interattivo.
- **Mobile**: Timeline verticale con animazione semplificata, nodi che appaiono on-scroll.

### 3. Emotional Closer — Brand Story Strip
- **Tecnica**: Brand Story Strip
- **Posizione**: 10a sezione della Home (penultimo terzo)
- **Implementazione**: Full-width section, minimo 60vh. Background scuro con overlay su immagine artistica. Frase potente in display font gigante (6-8vw): "Ogni t-shirt racconta la tua storia. Noi la disegniamo." Accent word ("tua storia") in colore verde accent. Sotto: breve citazione del fondatore in font accent italic.
- **Perché**: Chiude il cerchio emotivo. Dopo aver visto i design (WOW), capito il processo (trust), letto le recensioni (proof), questa sezione crea la connessione personale. Non stai comprando una maglietta: stai raccontando chi sei.
- **Mobile**: Font size ridotta ma comunque impattante, stesso layout semplificato.

### Variety Check
- Moment 1: Scroll-triggered (horizontal movement) ✓
- Moment 2: Scroll-triggered (path drawing + node reveal) — diverso tipo di interazione (disegno, non movimento) ✓
- Moment 3: Static visual impact (no interaction, puro impatto emotivo) ✓
- Tre tipi diversi di esperienza: cinematica, interattiva, emotiva ✓
