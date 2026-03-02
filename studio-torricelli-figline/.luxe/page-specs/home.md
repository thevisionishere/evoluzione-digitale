# Page Spec — Home (index.html)

## Page Purpose
Hub principale del sito. Deve comunicare immediatamente professionalità, competenza ed esperienza pluridecennale. Guidare il paziente-ricercatore attraverso un percorso che va dalla scoperta alla conversione (telefonata).

## Ordered Sections (12)

### 1. Hero (Variant B — Split Layout)
- **Left side**:
  - Label: "Studio Dentistico a Figline Valdarno"
  - Headline: "La Tua Salute Orale, la Nostra Passione"
  - Description: "Con un'esperienza pluridecennale, ci prendiamo cura del tuo sorriso con tecnologie all'avanguardia e un approccio che mette il paziente al centro di tutto."
  - CTA 1 (primary): "Prenota una Visita" → tel:055952421
  - CTA 2 (secondary): "Scopri i Servizi" → servizi.html
  - Stats bar: "30+ Anni di Esperienza" | "15+ Servizi" | "Approccio Multidisciplinare"
- **Right side**: Immagine studio dentistico moderno / team professionale (Unsplash: modern dental clinic, dental team professional)
- **Animation**: Reveal after preloader — label → title → description → CTAs → stats (staggered 150ms)

### 2. Marquee
- Content: "Endodonzia • Ortodonzia • Implantologia • Protesi • Trattamenti Estetici • Odontoiatria Conservativa • Radiologia • Igiene e Prevenzione • Pedodonzia • Ortodonzia Infantile"
- Background: dark (--color-dark)
- Separator: bullet • in accent color

### 3. [SIGNATURE] Text Reveal on Scroll
- Text: "Il Paziente al Centro di Tutto"
- Font: display, 6-8vw (clamp)
- "Centro" in --color-accent
- Reveal: clip-path animation word by word on scroll (IntersectionObserver with thresholds)
- Background: light
- Padding: generous (min 30vh height)

### 4. Services — Card Grid
- 7 cards in grid (3+3+1 centered)
- Each card: number (01-07), icon, title, 1-line description, hover accent underline
- Cards link to respective subpages
- Data:
  1. Endodonzia — "Cura dei canali radicolari con precisione e tecnologia avanzata"
  2. Ortodonzia — "Diagnosi e trattamenti personalizzati per un sorriso allineato"
  3. Implantologia — "Soluzioni implantari con diagnostica 3D all'avanguardia"
  4. Protesi — "Passione e precisione con le più moderne apparecchiature"
  5. Trattamenti Estetici — "Sbiancamento con sostanze sicure e scientificamente testate"
  6. Odontoiatria Conservativa — "Cura e restauro dei denti colpiti da processi cariosi"
  7. Radiologia — "Radiografia digitale e TAC Cone Beam 3D"
- Staggered reveal

### 5. About / Story (Layout B — Image Overlap)
- Image: foto studio/ambiente con frame decorativo
- Label: "Chi Siamo"
- Title: "Esperienza Pluridecennale al Servizio del Tuo Sorriso"
- Text: "Alla base della nostra filosofia di lavoro c'è la centralità del paziente. Lo Studio Dentistico Torricelli si occupa di tutte le branche dell'odontoiatria, in un ambiente rilassante e con strumenti di avanguardia."
- Value cards (3): "Esperienza" / "Tecnologia" / "Cura del Paziente"
- CTA: "Scopri lo Studio →" → studio.html

### 6. [SIGNATURE] Expandable Treatment Explorer
- 3 macro-aree:
  1. "Servizi Odontoiatrici" → expanded: grid delle 7 sottopagine con mini-icone + link
  2. "Odontoiatria Pediatrica" → expanded: Ortodonzia Infantile + Pedodonzia con descrizione
  3. "Collaborazioni Specialistiche" → expanded: Osteopatia, Dietologia, Posturologia con nomi professionisti
- Default: primo item espanso
- Click animation: smooth height + crossfade immagine laterale
- Background: light con accent sul tab attivo

### 7. Technology Showcase
- Label: "Le Nostre Tecnologie"
- Title: "Strumenti di Avanguardia per la Tua Cura"
- 3 cards:
  1. TAC Cone Beam 3D — "Imaging tridimensionale di altissima precisione per diagnosi accurate"
  2. Radiografia Digitale — "Immagini immediate con esposizione ridotta ai raggi X"
  3. Strumentazione Moderna — "Attrezzature all'avanguardia per ogni tipo di trattamento"
- Layout: 3 colonne con icona/immagine in alto
- Background: scuro per contrasto

### 8. Comfort Pledge / Nessuna Paura
- Label: "Il Nostro Approccio"
- Title: "Nessuna Paura del Dentista"
- Text: "Con un approccio tranquillo e rassicurante riusciamo a trattare la quasi totalità dei nostri pazienti. Per chi conserva un po' di ansia, abbiamo soluzioni dedicate per rendere l'esperienza il più confortevole possibile."
- Layout: 2 colonne — testo a sinistra, immagine rassicurante a destra (sorriso, ambiente accogliente)
- Tono visivo: più caldo del resto della pagina, bordi arrotondati, colori morbidi
- Background: light con tint caldo

### 9. [SIGNATURE] Testimonial Immersion
- Background: dark
- Quote marks: enormi in accent font, semitrasparenti
- Testimonial text (credibile): "Avevo una grande paura del dentista, ma qui mi sono sentita subito a mio agio. Professionalità, competenza e gentilezza: lo Studio Torricelli è diventato il mio punto di riferimento per tutta la famiglia."
- Name: "Maria R., paziente da oltre 10 anni"
- Font size: 2.5-3rem (grande, impattante)
- Animation: fade up on scroll

### 10. Numbers / Statistics
- 4 stats animate con counter:
  1. "30+" — "Anni di Esperienza"
  2. "1000+" — "Pazienti Soddisfatti"
  3. "15+" — "Servizi Specialistici"
  4. "3" — "Collaborazioni Multidisciplinari"
- Background: accent gradient o tint
- Layout: 4 colonne desktop, 2x2 mobile

### 11. CTA Banner (Style B — Split with Image)
- Left: immagine (sorriso, studio moderno)
- Right: Label "Prenota Ora" + Title "La Tua Prima Visita Inizia Qui" + text + CTA: "Chiamaci: 055 952421" + "Via della Vetreria 73, Figline Valdarno"
- Background: dark

### 12. Map + Contact Preview
- Google Maps embed: Via della Vetreria 73, Figline e Incisa Valdarno (FI)
- Info card overlay: telefono 055 952421, indirizzo, link "Tutti i Contatti →"
- Layout: map full-width con card info sovrapposta

## CTA Strategy
- Hero: 2 CTA (prenota + servizi)
- Services cards: link a sottopagine
- About: link a studio
- Explorer: link a tutte le aree
- CTA Banner: telefono diretto
- Map: info contatto + link contatti

## Connections
- → servizi.html (da cards servizi + explorer)
- → studio.html (da about)
- → bambini.html (da explorer)
- → collaborazioni.html (da explorer)
- → contatti.html (da map section)
- → Tutte le sottopagine servizi (da cards)
