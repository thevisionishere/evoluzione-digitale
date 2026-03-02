# LUXE Architecture — Studio Dentistico Torricelli

## Site Type
Multi-page (19 pagine totali)

## Pages & Filenames

### Pagine Principali (8)
1. **Home** → `index.html`
2. **Studio Dentistico** → `studio.html`
3. **Servizi** (hub) → `servizi.html`
4. **Igiene e Prevenzione** → `igiene-prevenzione.html`
5. **Bambini** (hub) → `bambini.html`
6. **Qualità** → `qualita.html`
7. **Collaborazioni** (hub) → `collaborazioni.html`
8. **Contatti** → `contatti.html`

### Sottopagine Servizi (7)
9. Endodonzia → `endodonzia.html`
10. Ortodonzia → `ortodonzia.html`
11. Implantologia → `implantologia.html`
12. Protesi → `protesi.html`
13. Trattamenti Estetici Conservativi → `trattamenti-estetici.html`
14. Odontoiatria Conservativa → `odontoiatria-conservativa.html`
15. Radiologia → `radiologia.html`

### Sottopagine Bambini (2)
16. Ortodonzia Infantile → `ortodonzia-infantile.html`
17. Pedodonzia → `pedodonzia.html`

### Sottopagine Collaborazioni (3)
18. Osteopatia → `osteopatia.html`
19. Dietologia → `dietologia.html`
20. Posturologia → `posturologia.html`

---

## Navigation Structure

```
[Logo]  Home | Studio Dentistico | Servizi ▾ | Igiene e Prevenzione | Bambini ▾ | Qualità | Collaborazioni ▾ | Contatti  [Chiamaci]

                                    ├── Endodonzia               ├── Ortodonzia Infantile    ├── Osteopatia
                                    ├── Ortodonzia               └── Pedodonzia              ├── Dietologia
                                    ├── Implantologia                                        └── Posturologia
                                    ├── Protesi
                                    ├── Trattamenti Estetici
                                    ├── Odontoiatria Conservativa
                                    └── Radiologia
```

CTA Header: "Chiamaci" → tel:055952421

---

## HOME PAGE (index.html) — 12 Sections

### Section Order & Justification

1. **Hero (Variant B — Split Layout)**
   - Left: label "Studio Dentistico Torricelli" + headline "La Tua Salute Orale, la Nostra Passione" + descrizione + 2 CTA (Prenota Visita / Scopri i Servizi) + stats bar (anni esperienza, pazienti, servizi)
   - Right: immagine studio/team professionale
   - WHY: Il paziente deve sentire immediatamente autorevolezza + competenza. Split layout bilancia informazione e impatto visivo.

2. **Marquee (Servizi)**
   - Scorrimento infinito: "Endodonzia • Ortodonzia • Implantologia • Protesi • Trattamenti Estetici • Odontoiatria Conservativa • Radiologia • Igiene e Prevenzione • Pedodonzia"
   - Background scuro per contrasto
   - WHY: Transizione dinamica dall'hero, comunica immediatamente l'ampiezza dell'offerta.

3. **[SIGNATURE MOMENT 1 — VISUAL SPECTACLE] Text Reveal on Scroll**
   - Grande frase in display font (6-8vw): "Il Paziente al Centro di Tutto"
   - Ogni parola si rivela progressivamente allo scroll con clip-path animation
   - Background chiaro con accent turchese sulla parola "Centro"
   - WHY: Statement filosofico dello studio che si rivela in modo cinematico. Ferma lo scroll, crea impatto emotivo.

4. **Services — Card Grid (Servizi Preview)**
   - Griglia 3+3+1 dei 7 servizi principali: icona, titolo, breve descrizione, link alla sottopagina
   - Numbered cards con accent underline on hover
   - Staggered reveal
   - WHY: Il paziente-ricercatore vuole vedere SUBITO cosa offre lo studio. Card grid per complex offering è la scelta giusta.

5. **About / Story (Layout B — Image Overlap)**
   - Immagine sovrapposta con frame decorativo dello studio/ambiente
   - Testo: esperienza pluridecennale, filosofia paziente-centrica, approccio multidisciplinare
   - Value cards sotto: Esperienza, Tecnologia, Cura del Paziente
   - Link "Scopri lo Studio →"
   - WHY: Dopo aver visto i servizi, il paziente vuole sapere CHI li eroga. Image overlap crea profondità professionale.

6. **[SIGNATURE MOMENT 2 — INTERACTIVE DELIGHT] Expandable Treatment Explorer**
   - Lista dei 3 macro-aree (Servizi Odontoiatrici / Bambini / Collaborazioni)
   - Click su un'area → si espande full-width mostrando dettagli + immagine + link alle sottopagine
   - Le altre aree si comprimono
   - Feels like an app, non un sito template
   - WHY: Con 19 pagine di servizi, serve un modo intelligente per navigare. L'explorer interattivo trasforma la complessità in scoperta.

7. **Technology Showcase (Surprise Element)**
   - 2-3 cards con le tecnologie principali: TAC Cone Beam 3D, Radiografia Digitale, Strumenti di Avanguardia
   - Ogni card: icona/immagine, nome tecnologia, breve spiegazione del beneficio per il paziente
   - Background alternato per ritmo visivo
   - WHY: Differenziatore chiave. Il paziente vede concretamente PERCHÉ questo studio è diverso. Giustifica la scelta razionale.

8. **Comfort Pledge / Nessuna Paura (Surprise Element)**
   - Sezione dedicata all'odontofobia
   - Layout: icona/illustrazione rassicurante + headline "Nessuna Paura del Dentista" + testo approccio rassicurante
   - Tono caldo e accogliente, differente dal resto della pagina
   - CTA: "Scopri il Nostro Approccio"
   - WHY: Barriera emotiva #1 dei pazienti. Affrontarla direttamente sulla homepage umanizza lo studio e disinnesca l'ansia.

9. **[SIGNATURE MOMENT 3 — EMOTIONAL CLOSER] Testimonial Immersion**
   - Una grande testimonial full-section con quote marks enormi in accent font
   - Testo grande, nome paziente, foto (stock Unsplash)
   - Animated on scroll, background scuro per contrasto
   - WHY: Il paziente ha visto competenza (servizi), ambiente (about), tecnologia. Ora serve la prova sociale emotiva. Una grande testimonial > molte piccole.

10. **Numbers / Statistics**
    - 4 stat cards animate: Anni di Esperienza (30+), Pazienti Soddisfatti (migliaia), Servizi Offerti (15+), Collaborazioni Specialistiche (3)
    - Background accent/dark per contrasto
    - WHY: Rinforzo quantitativo dell'esperienza. I numeri consolidano la fiducia dopo la testimonial.

11. **CTA Banner (Style B — Split with Image)**
    - Lato sinistro: immagine sorriso/studio
    - Lato destro: headline "Prenota la Tua Prima Visita" + testo + CTA telefono + CTA indirizzo
    - WHY: Pre-footer conversion point. Lo split con immagine è più coinvolgente di un banner generico.

12. **Map + Contact Preview**
    - Google Maps embed dell'indirizzo Via della Vetreria 73
    - Info contatto essenziali: telefono, indirizzo, orari
    - Link "Tutti i Contatti →"
    - WHY: Il paziente locale vuole sapere DOVE siamo. Mappa in posizione finale = ultimo check prima di decidere.

---

## INTERNAL PAGES — Section Plans

### Studio Dentistico (studio.html) — 5 sections
1. Internal Hero — "Il Nostro Studio"
2. About/Story (Layout A — Image + Text Columns) — storia, filosofia, esperienza pluridecennale
3. Team — foto e ruoli dei professionisti
4. Gallery — Grid delle foto dello studio/ambiente
5. CTA Banner — "Vieni a Trovarci" con link contatti

### Servizi (servizi.html) — Hub — 5 sections
1. Internal Hero — "I Nostri Servizi"
2. Services Overview — Card Grid completa di tutti i 7 servizi con link alle sottopagine
3. Process — Come Funziona (prima visita → diagnosi → trattamento → follow-up)
4. Technology Showcase — richiamo alle tecnologie
5. CTA Banner — "Prenota una Visita" con telefono

### Singole Sottopagine Servizi (template condiviso) — 5 sections ciascuna
Template per: endodonzia.html, ortodonzia.html, implantologia.html, protesi.html, trattamenti-estetici.html, odontoiatria-conservativa.html, radiologia.html

1. Internal Hero — Titolo del servizio
2. Service Detail — Descrizione approfondita del servizio, cosa include, come funziona
3. Process Steps — Il percorso del paziente per questo specifico trattamento
4. FAQ — 3-4 domande frequenti specifiche del servizio
5. CTA Banner — "Prenota per [Servizio]" + link ad altri servizi correlati

### Igiene e Prevenzione (igiene-prevenzione.html) — 5 sections
1. Internal Hero — "Igiene e Prevenzione"
2. Service Detail — Ruolo delle igieniste, importanza della prevenzione, cosa aspettarsi
3. Tips / Consigli — Norme elementari di igiene che ciascuno può mettere in pratica
4. Process — Il percorso della seduta di igiene
5. CTA Banner — "Prenota la Tua Seduta di Igiene"

### Bambini (bambini.html) — Hub — 5 sections
1. Internal Hero — "Odontoiatria per Bambini" (tono accogliente, colori caldi)
2. Intro — Perché la cura dentale dei bambini è fondamentale, approccio rassicurante
3. Services Cards — 2 card grandi: Ortodonzia Infantile + Pedodonzia con link
4. Comfort / Approccio bambini — Come lo studio rende l'esperienza positiva per i piccoli
5. CTA Banner — "Prenota per il Tuo Bambino"

### Ortodonzia Infantile (ortodonzia-infantile.html) — 5 sections
1. Internal Hero — "Ortodonzia Infantile"
2. Service Detail — Check-up ortodontico, diagnosi, piano trattamento
3. FAQ — Domande frequenti dei genitori
4. Comfort — Approccio dedicato ai bambini
5. CTA Banner — Link a pedodonzia + contatti

### Pedodonzia (pedodonzia.html) — 5 sections
1. Internal Hero — "Pedodonzia"
2. Service Detail — Importanza della dentatura decidua, obiettivi
3. Tips — Consigli per genitori sulla salute orale dei bambini
4. FAQ — Domande frequenti
5. CTA Banner — Link a ortodonzia infantile + contatti

### Qualità (qualita.html) — 5 sections
1. Internal Hero — "La Nostra Qualità"
2. Sterilizzazione — Protocolli di sterilizzazione, prevenzione infezioni
3. Technology Showcase — Attrezzature e strumenti di avanguardia
4. Certifications / Standards — Standard di qualità seguiti
5. CTA Banner — "La Tua Sicurezza è la Nostra Priorità" + contatti

### Collaborazioni (collaborazioni.html) — Hub — 5 sections
1. Internal Hero — "Collaborazioni Specialistiche"
2. Intro — Approccio multidisciplinare, valore delle collaborazioni
3. Services Cards — 3 card: Osteopatia, Dietologia, Posturologia con link e info professionista
4. Value Proposition — Perché l'approccio multidisciplinare fa la differenza
5. CTA Banner — "Scopri i Nostri Specialisti" + contatti

### Osteopatia (osteopatia.html) — 5 sections
1. Internal Hero — "Osteopatia"
2. Service Detail — Tecniche manuali, benefici, indicazioni
3. Professional Card — Dott. Matteo Balocco, contatto 392 972 5232, email
4. FAQ — Domande frequenti su osteopatia in contesto odontoiatrico
5. CTA Banner — Link a altre collaborazioni + contatti studio

### Dietologia (dietologia.html) — 5 sections
1. Internal Hero — "Dietologia"
2. Service Detail — Dieta come stile di vita, benessere psicofisico, cura sintomi e patologie
3. Connection — Legame tra alimentazione e salute orale
4. FAQ — Domande frequenti
5. CTA Banner — Link a altre collaborazioni + contatti

### Posturologia (posturologia.html) — 5 sections
1. Internal Hero — "Posturologia"
2. Service Detail — Importanza della postura, connessione con salute orale
3. Professional Info — Contatto: +39 328 306 7181
4. FAQ — Domande frequenti
5. CTA Banner — Link a altre collaborazioni + contatti

### Contatti (contatti.html) — 5 sections
1. Internal Hero — "Contattaci"
2. Contact Full — 2 colonne: info contatto (telefono, indirizzo, orari) + form
3. Map Embed — Google Maps Via della Vetreria 73, Figline e Incisa Valdarno
4. Quick Links — Link rapidi alle pagine principali del sito
5. CTA Banner minimale — "Ti Aspettiamo"

---

## Signature Moments

### 1. Visual Spectacle — Text Reveal on Scroll
- **Technique**: Text Reveal on Scroll
- **Placement**: Sezione 3 della homepage (subito dopo il marquee)
- **Content**: "Il Paziente al Centro di Tutto" — la filosofia dello studio
- **Implementation**: Display font 6-8vw, ogni parola si rivela con clip-path progressivo al scroll. Parola "Centro" in accent color (#29d8db)
- **WHY**: Statement filosofico cinematico. Per uno studio dentistico, comunicare la filosofia paziente-centrica in modo memorabile è il modo migliore per differenziarsi dai competitor che mostrano solo servizi. Il text reveal crea gravitas e memorabilità.
- **Interaction type**: SCROLL-BASED

### 2. Interactive Delight — Expandable Treatment Explorer
- **Technique**: Expandable Service Explorer
- **Placement**: Sezione 6 della homepage (dopo l'about)
- **Content**: 3 macro-aree cliccabili che si espandono rivelando dettagli + immagini
- **Implementation**: Click → area si espande full-width, altre si comprimono. Transizione smooth height + opacity. Immagine che si crossfade.
- **WHY**: 19 pagine di servizi richiedono un modo intelligente per navigare. L'explorer trasforma la complessità dell'offerta in un'esperienza di scoperta coinvolgente.
- **Interaction type**: CLICK-BASED

### 3. Emotional Closer — Testimonial Immersion
- **Technique**: Testimonial Immersion
- **Placement**: Sezione 9 della homepage (penultima terza parte)
- **Content**: Una grande testimonial con quote marks enormi, background scuro
- **Implementation**: Full-section, quote in accent font 4-5vw, reveal on scroll con opacity e translateY
- **WHY**: Dopo competenza e tecnologia, serve la prova sociale emotiva. Per un dentista, la fiducia del paziente è tutto. Una testimonial grande e immersiva ha più impatto di un carosello di card piccole.
- **Interaction type**: SCROLL-REVEAL (diverso dal text reveal — qui è opacity, non clip-path)

**Variety check**: ✅ 3 tipi di interazione diversi (scroll-clip, click, scroll-opacity)

---

## User Journey Map

```
VISITATORE ARRIVA (da Google/passaparola)
    ↓
HERO → Impressione immediata: professionale, esperienza, tecnologia moderna
    ↓
MARQUEE → Vede l'ampiezza dei servizi → "Qui fanno tutto"
    ↓
TEXT REVEAL → "Il Paziente al Centro" → impatto emotivo, filosofia
    ↓
SERVIZI CARDS → Trova il servizio che cercava → può cliccare per dettagli
    ↓
ABOUT → Conosce lo studio, la storia → rassicurazione
    ↓
TREATMENT EXPLORER → Esplora le 3 macro-aree → scoperta interattiva
    ↓
TECHNOLOGY → Vede le tecnologie → "Sono all'avanguardia"
    ↓
COMFORT PLEDGE → "Non devo aver paura" → barriera emotiva rimossa
    ↓
TESTIMONIAL → Prova sociale → "Altri pazienti sono soddisfatti"
    ↓
NUMBERS → Conferma quantitativa → decisione consolidata
    ↓
CTA → Prenota la visita → CONVERSIONE (telefono)
    ↓
MAP → Conferma posizione → VISITA
```

---

## Anti-Sameness Checklist
- [x] Preloader: Variant E (Minimal Fade) — appropriato per professionale/pulito
- [x] Hero: Variant B (Split Layout) — scelto per expertise tecnica, non default
- [x] Font Combo: 2 (Modern Authority) — Geist + Source Sans 3
- [x] Palette: D (Cool Professional) — basata sul brand turchese/blu esistente
- [x] About: Layout B (Image Overlap) — non il solito 2-col
- [x] CTA Banner: Style B (Split with Image) — non il solito dark text
- [x] 3 Signature Moments selezionati (1 per categoria) ✅
- [x] Nessun Signature Moment usa lo stesso tipo di interazione ✅
- [x] Ogni Signature Moment è giustificato dal profilo business ✅
