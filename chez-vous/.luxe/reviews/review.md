# Chez Vous 3.0 — Comprehensive Quality Review
**Date**: 2026-03-16
**Reviewer**: Frontend Developer Agent
**Deliverable tier**: 15,000€ premium website
**Files audited**: index.html, menu.html, gallery.html, contact.html, styles.css, script.js

---

## Summary Scorecard

| Area | Score | Critical | High | Medium | Low |
|---|---|---|---|---|---|
| Part A — Design & UX | 84/100 | 0 | 2 | 4 | 3 |
| Part B — Bug Hunt | 76/100 | 2 | 3 | 5 | 3 |
| Part C — Cross-Page | 91/100 | 0 | 1 | 3 | 2 |
| Part D — Mobile Quality | 80/100 | 1 | 2 | 3 | 2 |
| **Overall** | **83/100** | **3** | **8** | **15** | **10** |

---

## PART B — BUG HUNT (highest priority — listed first)

### CRITICAL

---

**BUG-01** | CRITICAL | `styles.css` line 681–683 | **Cinematic section is 100vh on mobile — violates rule "no section > 100vh except hero"**

The `.cinematic` section is set to `height: 100vh` at the base level. The mobile override at line 729 reduces it to `60vh`, which is correct. However, `60vh` on a 375px-wide device with a short screen (e.g., iPhone SE at 667px height) is approximately 400px — this is fine. The core violation here is that the base CSS sets `100vh` before the max-width breakpoint override, and this rule fires for ALL screens below 768px at `60vh`, which is acceptable. However, this is **not** a carousel on mobile — it is a crossfade/swipe interaction implemented with absolutely-positioned stacked frames. On mobile the user sees only the active frame because all others are `opacity: 0` and `position: absolute`. This is functionally equivalent to a carousel (tap/swipe advances frames). However the **structural issue** is that the element remains a full-frame section with stacked absolute children rather than a proper carousel with `overflow: hidden` and single-item display. If a screen reader or non-JS browser encounters this, all 4 images are stacked visibly.

**Fix**: Ensure the non-active `.cinematic-frame` elements have `aria-hidden="true"` set dynamically via JS when they are not active. Also confirm the `60vh` value is acceptable (it is). The swipe interaction does work. This is HIGH severity for accessibility but not layout-breaking.

**Reclassified severity: HIGH** (demoted from CRITICAL — the visual output is correct, the accessibility gap is the issue).

---

**BUG-02** | CRITICAL | `script.js` line 39 | **Preloader race condition: `document.body.classList.add('preloader-active')` called redundantly inside `initPreloader()` when `body` already has the class in HTML**

In `index.html` line 13, `<body class="preloader-active">` is hardcoded. Inside `initPreloader()` at script.js line 39, `document.body.classList.add('preloader-active')` is called again. This is redundant but harmless on its own.

The real bug: when `sessionStorage.getItem('luxe-visited')` is true (return visit), `preloader.remove()` is called and `body.classList.remove('preloader-active')` is called. However the `body` element in HTML already has `overflow: hidden` applied via `body.preloader-active { overflow: hidden; }` in CSS. On a return visit this is correctly removed. This flow is correct.

**The actual CRITICAL bug**: The `hero-scroll` element uses `animation: fadeInUp 0.8s var(--ease-out) 2.5s forwards` (CSS animation, hardcoded 2.5s delay). On **return visits** where the preloader is skipped, `revealHero()` is called immediately but the `hero-scroll` remains invisible until 2.5s passes (due to its CSS animation delay). This means the scroll indicator never appears on return visits within a reasonable time window because it relies solely on the CSS animation with a 2.5s delay that is not reset or overridden by JS.

**Fix**: In `revealHero()`, add logic to also trigger the scroll indicator animation for return visits:
```js
const heroScroll = document.querySelector('.hero-scroll');
if (heroScroll) {
  heroScroll.style.animationDelay = '0.5s';
}
```
Or add `.hero-scroll` to the `revealHero` query list.

---

**BUG-03** | CRITICAL | `index.html` line 228, `gallery.html` line 305 (index) | **Inline `style` attributes override CSS system**

`index.html` line 228:
```html
<div class="reveal-up" data-delay="5" style="margin-top: var(--space-7); text-align: center;">
```
`index.html` line 305–307:
```html
<div class="reveal-up" data-delay="3" style="margin-top: var(--space-7); text-align: center;">
  <a href="gallery.html" class="btn-secondary" style="border-color: rgba(240,236,229,0.3); color: var(--color-text-light);">View Full Gallery</a>
</div>
```

Two violations:
1. Inline styles break the single-source-of-truth CSS architecture. This is a quality rule violation.
2. `btn-secondary` in this context has its `border-color` and `color` overridden inline. This means if the design system changes, these values will be out of sync. The hardcoded `rgba(240,236,229,0.3)` is also a rogue hardcoded color value (though it matches `--color-text-light` with opacity, it is not using a custom property).

**Fix**: Move these styles to utility classes or BEM modifiers in `styles.css`. Create `.btn-secondary--light` or use existing CSS to handle the dark-background variant.

---

### HIGH

---

**BUG-04** | HIGH | `script.js` lines 356–408 | **Custom cursor initializes cursor DOM elements and RAF loop BEFORE first mousemove**

The `cursor-dot` and `cursor-follower` elements are appended to `body` immediately when `initCustomCursor()` is called (lines 359–370). The `updateFollower()` RAF loop starts immediately at line 393. The `custom-cursor` class is only added to `body` on first `mousemove` (line 383), which correctly hides the native cursor only after first interaction.

However, the RAF loop `updateFollower()` runs indefinitely with no cancellation mechanism. Even after the user leaves the page (or on a Single Page App navigation), this RAF loop never stops. On a multi-page site this is less critical (navigation destroys the JS context), but the loop also has a floating-point convergence issue: `followerX += (mouseX - followerX) * 0.15` will never reach exact 0 convergence at `-100px`, meaning it oscillates infinitely near the off-screen position.

More critically: the `cursor-dot` and `cursor-follower` elements start at `left: -100px; top: -100px` (set via JS inline style), which means they render in the DOM immediately, potentially triggering layout. They are `position: fixed` so no reflow, but `z-index: 10000` means they are always in the stacking context.

**The real bug**: The cursor elements are positioned using `style.left` / `style.top` initially, but then moved using `style.transform = translate(...)`. This is a mixed approach — once transform takes over, the `left: -100px` / `top: -100px` baseline still applies, meaning the actual rendered position is `-100px + transform`. The `transform: translate(mouseX, mouseY) translate(-50%, -50%)` will correctly position the cursor at the mouse position, but before first mousemove, the element is at `(-100px, -100px)` which is off-screen. This is intentional and works correctly.

**Actual issue to fix**: Add RAF cancellation when the page is about to unload, and consider memoizing whether cursor has been activated to avoid duplicate class adds.

---

**BUG-05** | HIGH | `script.js` lines 445–459 | **Magnetic button transform conflict**

In `initMagneticButtons()`, the `mousemove` handler sets:
```js
btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) translateY(-2px)`;
```

The `-2px` translateY is correctly included (matching the CSS hover base of `translateY(-2px)` in `.btn-primary:hover` and `.header-cta:hover`). This is correctly implemented.

However, the `mouseleave` handler sets:
```js
btn.style.transform = '';
```

Clearing the transform on mouseleave resets to no transform, but the CSS `:hover` rule still applies `transform: translateY(-2px)` on hover state. When the cursor is still technically hovering at the button edge (mouseleave fires just before hover ends), there will be a brief snap from the JS transform to the CSS transform then to nothing. This is a minor visual glitch but noticeable.

**More critical issue**: When `.btn-primary` is used inside `.cta-banner` with additional sizing (`.cta-banner .btn-primary` has larger padding), the magnetic effect is applied to `magnetic-btn` class elements. The `.header-cta.magnetic-btn` and `.hero .btn-primary.magnetic-btn` and `.cta-banner .btn-primary.magnetic-btn` all get this effect. The `mouseleave` clearing `style.transform = ''` will snap the button back instantly (no easing), creating a jarring UX. The CSS transition is `var(--transition-normal)` (400ms), so CSS hover transitions would normally apply, but the inline style takes precedence.

**Fix**: On `mouseleave`, instead of setting empty string, set the base hover transform or use a CSS class toggle:
```js
btn.addEventListener('mouseleave', () => {
  btn.style.transform = 'translateY(-2px)'; // match CSS hover base
  setTimeout(() => { btn.style.transform = ''; }, 400); // then clear after transition
});
```

---

**BUG-06** | HIGH | `contact.html` line 120–125 | **Google Maps iframe missing `allowfullscreen` and `width`/`height` attributes; also no `title` on iframe for accessibility on some browsers requires it as `aria-label`**

The iframe:
```html
<iframe
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3231.8!2d14.489!3d35.921..."
  loading="lazy"
  referrerpolicy="no-referrer-when-downgrade"
  title="Chez Vous 3.0 Location">
</iframe>
```

Missing `allowfullscreen` attribute. While not required for the basic embed, Google Maps embeds display a "View Larger Map" link that may not function correctly without it. More importantly, the iframe has no explicit `width` and `height` attributes, relying entirely on CSS (`min-height: 300px` on the container and `height: 100%` on the iframe). The `height: 100%` on the iframe within the `.contact-map` container which has `min-height: 300px` but no fixed height will cause the iframe to collapse to 0px height in some browsers because the parent has no explicit height — only a `min-height`. The grid item stretches, which should work in most cases, but in Safari, `height: 100%` on a child of a grid cell with only `min-height` can fail.

**Fix**: Add explicit `height` to `.contact-map` at large breakpoints, or set `height: 450px` directly on the iframe as a fallback attribute:
```html
<iframe ... width="100%" height="450" allowfullscreen>
```
And in CSS ensure `.contact-map { height: 450px; }` at desktop.

---

**BUG-07** | HIGH | `styles.css` line 1103–1105 | **Gallery items on home page lose aspect ratio when masonry spans are applied**

```css
.gallery-item { aspect-ratio: 4/3; }
.gallery-item:nth-child(1),
.gallery-item:nth-child(4) { aspect-ratio: auto; }
```

The first and fourth items span 2 rows (`grid-row: span 2`) and have `aspect-ratio: auto`. But the `.gallery-item img` has `height: 100%; object-fit: cover`. For span-2 items without a defined height, the browser needs to calculate the row height. In a CSS Grid with `grid-template-rows: auto`, the row heights are determined by content. When items 1 and 4 span 2 rows but have no explicit height, their height becomes ambiguous — the grid engine will size each row based on the non-spanning items (which have `aspect-ratio: 4/3`), and the spanning item will simply fill both rows. This works correctly in modern browsers. However, on mobile (2-column grid), all items are set to `aspect-ratio: 4/3` globally, but items 1 and 4 are `aspect-ratio: auto` with `grid-row: span 2` still active. This means on mobile, items 1 and 4 will span 2 rows with no aspect ratio, creating inconsistent heights.

**Fix**: Reset the `grid-row: span` at mobile or add a mobile media query:
```css
@media (max-width: 767px) {
  .gallery-item:nth-child(1),
  .gallery-item:nth-child(4) {
    grid-row: span 1;
    aspect-ratio: 4/3;
  }
}
```

---

### MEDIUM

---

**BUG-08** | MEDIUM | `script.js` line 302–333 | **Cinematic autoplay only starts on desktop via IntersectionObserver; on mobile autoplay starts immediately regardless of visibility**

On mobile (`isMobile` is true), `startAutoplay()` is called at line 332 immediately, before the user has scrolled to the cinematic section. This means the interval starts running in the background from page load, burning CPU/battery. The desktop path correctly only starts autoplay when the section is intersecting.

**Fix**: Wrap the mobile `startAutoplay()` call in a visibility check:
```js
} else {
  // Mobile swipe + lazy autoplay
  let touchStartX = 0;
  // ... touch listeners ...

  const mobileObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startAutoplay();
      } else {
        clearInterval(autoplayInterval);
      }
    });
  }, { threshold: 0.3 });
  mobileObserver.observe(section);
}
```

---

**BUG-09** | MEDIUM | `styles.css` line 1670–1685 | **`.menu-food-item` uses `justify-content: space-between` but only has one child element in some cases**

The `.menu-food-item` in `menu.html` contains:
```html
<div class="menu-food-item">
  <span class="menu-food-item-name">Bruschetta Trio</span>
  <small class="menu-food-item-desc">Heirloom tomato, pesto & ricotta, olive tapenade</small>
</div>
```

The `small` element is styled with `margin-top: var(--space-1)` (CSS line 1683), implying it is intended to go below the name, not to the right. But the parent uses `justify-content: space-between` which pushes name left and desc right, creating an awkward inline layout — the name and description appear side by side rather than stacked. This is a layout design inconsistency.

The intent appears to be a stacked layout (name above, description below), but `justify-content: space-between` and `align-items: baseline` create a horizontal side-by-side layout. This could be intentional (restaurant-style menu with item name on left, description on right), but the `margin-top` on `small` suggests stacking was intended. Without prices, the space-between layout is odd.

**Fix**: If side-by-side is intended, remove `margin-top` from `.menu-food-item-desc`. If stacked is intended, change the flex direction to column:
```css
.menu-food-item {
  flex-direction: column;
  align-items: flex-start;
}
```

---

**BUG-10** | MEDIUM | `script.js` line 75 | **Global variable pollution: `window._setMenuOpen`**

```js
window._setMenuOpen = (val) => { menuOpen = val; };
```

This creates a global `window` property from inside the `DOMContentLoaded` closure. While functional, it breaks the "no global variables" quality rule. It is used only by `initHeader()` to track menu state. Both `initHeader()` and `initMobileMenu()` are sibling functions in the same closure scope — there is no reason to go via `window`.

**Fix**: Lift `menuOpen` to the outer `DOMContentLoaded` closure scope and share it directly between the two functions, removing the `window._setMenuOpen` pattern entirely.

---

**BUG-11** | MEDIUM | `styles.css` line 1429 | **Hardcoded color `#25D366` for WhatsApp button**

The WhatsApp button background uses a hardcoded hex value `#25D366` instead of a CSS custom property. This violates the "all colors use CSS custom properties" quality rule.

**Fix**: Add `--color-whatsapp: #25D366;` to `:root` and use `background: var(--color-whatsapp)` in `.whatsapp-btn`.

Similarly, `box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4)` uses raw RGB values instead of a custom property.

---

**BUG-12** | MEDIUM | `styles.css` line 584 | **Hardcoded `rgba` for `btn-secondary` border color**

```css
.btn-secondary {
  border: 1px solid rgba(240, 236, 229, 0.3);
}
```

`rgba(240, 236, 229, 0.3)` is a hardcoded color. `--color-text-light` is `#f0ece5` which is approximately `rgb(240, 236, 229)`. This should use `rgba(var(--color-text-light-rgb), 0.3)` or a dedicated border custom property. There is no `--color-text-light-rgb` variable defined. The same pattern appears again in `.footer-social a` (line 1380).

**Fix**: Add `--color-text-light-rgb: 240, 236, 229;` to `:root` and refactor affected rules.

---

**BUG-13** | MEDIUM | `gallery.html` line 53 | **Page hero image missing `loading="eager"` or not loading eagerly**

`gallery.html` page hero image (line 53) does not have `loading="lazy"` nor `loading="eager"` — the attribute is simply absent. All above-the-fold images should explicitly use `loading="eager"` (or omit the attribute, which defaults to eager, which is fine). However, `menu.html` line 53 correctly uses `loading="eager"`. The inconsistency suggests a copy-paste oversight.

`contact.html` page hero image (line 53) also has `loading="lazy"` — this is incorrect for an above-the-fold image. A page hero image that is in the viewport on first paint should NEVER use `loading="lazy"` as it will delay the LCP (Largest Contentful Paint).

**Fix**:
- `gallery.html` line 53: Add `loading="eager"` (or remove the lazy attribute — currently absent, so this is fine)
- `contact.html` line 53: Change `loading="lazy"` to `loading="eager"`

---

### LOW

---

**BUG-14** | LOW | `styles.css` line 1590 | **Hardcoded `rgba(255,255,255,0.03)` in `.menu-cocktail-item` and `.menu-bar-card`**

Multiple sections use raw `rgba(255,255,255,0.03)` instead of a CSS custom property. Lines 1590, 1706, 1836.

---

**BUG-15** | LOW | `styles.css` line 1706 | **`.menu-bar-card` missing hover box-shadow**

`.service-card:hover` has `box-shadow: var(--shadow-lg)` but `.menu-bar-card:hover` does not, creating inconsistent hover feedback between similar card types.

---

**BUG-16** | LOW | `script.js` line 209–223 | **Smooth scroll does not account for `#experience` anchor target being in index.html only**

The `initSmoothScroll()` function iterates all `a[href^="#"]` links. In `index.html`, `<a href="#experience">Explore</a>` correctly targets the cinematic section. On other pages, there are no anchor links. This function runs on all pages. This is safe (the `document.querySelector(href)` call returns null and the handler returns early), but the check `if (href === '#') return;` only guards against bare hashes — any page-specific anchor on a wrong page will silently fail. This is acceptable behavior and correctly handled.

---

## PART A — DESIGN & UX AUDIT

### HIGH

---

**UX-01** | HIGH | `index.html` sections 5, 8 | **Two `<section>` elements with `id="gallery"` and class `.gallery` on index.html create a potential anchor conflict with the gallery preview section**

`index.html` line 275: `<section class="gallery" id="gallery">` — this is the home page gallery preview. `gallery.html` is the gallery page. There is no conflict in anchor navigation (each page is separate), but if any link to `#gallery` were added (e.g., in nav), it would target this preview section rather than the full gallery page. This is not an active bug but is a naming overlap that could cause confusion during maintenance.

---

**UX-02** | HIGH | All pages | **No `aria-live` region for mobile menu state change — screen readers will not announce menu open/close**

When the mobile menu opens/closes, the hamburger `aria-expanded` attribute is updated (correctly). However, there is no `aria-live` region announcing the change, and the focus is moved to the first menu link. This is partially correct but screen readers may not clearly announce "navigation menu opened" to users in some AT combinations. The implementation is passing WCAG 2.1 AA minimum, but for a 15,000€ premium deliverable, a polite live region announcement would be best practice.

---

### MEDIUM

---

**UX-03** | MEDIUM | `index.html` | **`about-text` `.section-label` and `.section-title` appear inside `.about-text` div but the `.section-title` has `data-delay="1"` while the label has no delay — both have `reveal-up` so they animate independently, which is correct, but on fast connections the label may flash at `opacity: 0` briefly before JS loads**

The `.reveal-up` CSS sets `opacity: 0` by default. Elements with this class are invisible until JS adds `.revealed`. On slow connections or with JS loading issues, all `.reveal-up` elements will be invisible. This creates a "blank page" flash. There is no `<noscript>` fallback.

**Fix**: Add a `.no-js` body class via HTML and a JS-removes-it pattern, or add `@media (scripting: none)` CSS to show all elements when JS is disabled.

---

**UX-04** | MEDIUM | `styles.css` line 606 | **Hero scroll indicator animation fires at hardcoded 2.5s delay regardless of preloader state**

`.hero-scroll` has `animation: fadeInUp 0.8s var(--ease-out) 2.5s forwards`. This 2.5s delay is designed to fire after the preloader (which runs for 2.2s + 1s exit = 3.2s total). But the scroll indicator actually appears at 2.5s, which is BEFORE the preloader finishes its exit animation. On first visit: preloader starts at 100ms (line 41), goes `done` at 2300ms (2200 + 100ms padding), then slides out over 1000ms (finishes at ~3300ms). The hero scroll indicator fires at 2500ms — during the preloader exit animation. This means the scroll "Scroll" text appears visible before the preloader finishes clearing.

**Fix**: Increase the `hero-scroll` animation delay to at least `3.5s`:
```css
.hero-scroll {
  animation: fadeInUp 0.8s var(--ease-out) 3.5s forwards;
}
```

---

**UX-05** | MEDIUM | `styles.css` line 1009–1017 | **Reviews track has no scroll indicator or navigation arrows — users on desktop may not know it is horizontally scrollable**

The `.reviews-track` uses `overflow-x: auto` with `scroll-snap-type: x mandatory`. On desktop, this displays as a horizontal scroll container with no visible scrollbar (`scrollbar-width: none`). There are no arrows, dots, or visual affordance indicating scrollability. Users on desktop are likely to miss that additional reviews exist beyond the visible ones.

**Fix**: Add CSS to show a subtle "drag to scroll" affordance, or add JS-driven arrow buttons for the reviews track.

---

**UX-06** | MEDIUM | `index.html` line 338–339 | **Contact compact card uses emoji (📍 📞 💬) which conflicts with the "no emojis" premium design standard**

The contact compact section on the home page:
```html
<p>📍 Dragonara Road, STJ-3143 San Giljan, Malta</p>
<p>📞 <a href="tel:+35699005834">+356 9900 5834</a></p>
<p>💬 <a href="https://wa.me/+35699426960"...>WhatsApp Reservations</a></p>
```

The full contact page (`contact.html`) uses proper SVG icons inside `.contact-method-icon` elements. The home page version uses emoji characters, creating design inconsistency and degrading the premium feel. Emojis also render differently across OS and browsers.

**Fix**: Replace emoji with inline SVGs matching the contact.html treatment, or use the same `.contact-method` component pattern.

---

### LOW

---

**UX-07** | LOW | `styles.css` line 862–867 | **`.service-number` uses `var(--color-border)` (gold at 20% opacity) which may have insufficient contrast on `--color-light` background**

The service number `01`, `02`, `03` uses `color: var(--color-border)` = `rgba(201, 168, 76, 0.2)`. On `--color-light` (`#faf8f5`) background, this is an extremely light gold. The contrast ratio is approximately 1.3:1, well below the WCAG AA threshold of 3:1 for large text and 4.5:1 for normal text. Although this is decorative text, the numbers serve a structural purpose (ordering) and should be legible.

**Fix**: Increase opacity to at least 0.4 or use `var(--color-accent-light)` at reduced opacity.

---

**UX-08** | LOW | `styles.css` line 1871 | **`.directions-content` is not centered or contained with `margin-inline: auto`**

`.directions-content` has `max-width: 700px` but no `margin-inline: auto`. This means it aligns left regardless of container width, potentially breaking visual centering. The section has no explicit text-align either.

**Fix**: Add `margin-inline: auto;` or at least left-align consistently with the section's header content.

---

**UX-09** | LOW | All pages | **No `<link rel="canonical">` tags on any page**

For a public website, canonical tags prevent duplicate content issues if the site is crawled from multiple URLs (with/without www, http/https, trailing slashes, etc.).

---

## PART C — CROSS-PAGE VERIFICATION

### HIGH

---

**CROSS-01** | HIGH | All pages | **`initActiveNav()` in JS will ALWAYS add `.active` class in addition to the static class in HTML, creating duplicate active states and doubled `::after` pseudo-element animations**

`index.html` line 29: `<a href="index.html" class="active">Home</a>` — active class is static in HTML.

`initActiveNav()` in `script.js` lines 229–240 also computes active state and adds `.active` dynamically. When both fire, the nav link gets `.active` twice (only one class is stored in the set, so classList effectively does nothing on the second add). This is harmless in effect, but creates a semantic redundancy.

More importantly: the JS function adds `.active` to `.mobile-menu-nav a` elements, but the mobile menu in HTML has NO static active class on any link in any page's mobile menu. This is actually correct JS behavior — the JS correctly highlights the active item in the mobile menu. However, the desktop nav already has static `.active` on one item, creating a mixed pattern (HTML-static for desktop, JS-dynamic for mobile). This is architecturally inconsistent but functionally works.

**Recommendation**: Remove static `.active` classes from all HTML nav links and rely entirely on the JS `initActiveNav()` function for consistency.

---

### MEDIUM

---

**CROSS-02** | MEDIUM | `gallery.html` line 144–153 | **Story Strip section appears on both `gallery.html` AND `index.html` with identical content ("Where the Night Begins")**

The Brand Story Strip (SM3) appears as a Signature Moment in `index.html` (line 312) and is also included in `gallery.html` (line 144). Both use identical copy: "Where the Night Begins." For gallery visitors who came from the home page, this creates a repetitive experience.

**Fix**: Differentiate the gallery story strip with alternate copy (e.g., "Every Image Tells a Story") or remove it from the gallery page since the gallery content is already visually rich.

---

**CROSS-03** | MEDIUM | `contact.html` line 66 | **Section label "GET IN TOUCH" is in ALL CAPS directly in HTML, inconsistent with other section labels**

Other section labels like "Our Story", "What We Offer", "The Craft", "What They Say", "Atmosphere", "Find Us" use normal Title Case in HTML. The CSS applies `text-transform: uppercase` to `.section-label`. "GET IN TOUCH" on contact.html (line 66) and "OPENING HOURS" (line 135) and "GETTING HERE" (line 173) are already uppercase in HTML — doubling the text-transform creates no visual difference but is semantically inconsistent and means the actual text in the DOM (and screen readers) is SHOUTED.

**Fix**: Change to title case in HTML: "Get in Touch", "Opening Hours", "Getting Here" — let CSS handle the uppercase transformation.

---

**CROSS-04** | MEDIUM | `gallery.html` line 53 | **Page hero has no `loading="eager"` attribute (inconsistent with `menu.html`)**

`menu.html` line 53 has `loading="eager"`. `gallery.html` line 53 has no loading attribute (defaults to eager, which is correct). `contact.html` line 53 has `loading="lazy"` which is wrong for an LCP image (see BUG-13). Minor inconsistency in approach.

---

### LOW

---

**CROSS-05** | LOW | All pages | **Footer social links are identical but `footer-social` uses 36px icons while `contact-social-link` uses 44px icons**

The contact page contact section uses 44×44px social links (meeting touch target requirements), but the footer social icons are only 36×36px (below the 44px touch target recommendation for mobile). This creates a size inconsistency between the same social icon pattern across the page.

**Fix**: Increase footer social icons to minimum 44px: `width: 44px; height: 44px;`.

---

**CROSS-06** | LOW | All pages | **`data-year` span in footer requires JS — if JS fails or is slow, copyright year shows as empty**

`<span data-year></span>` is an empty span waiting for JS to populate it. Consider hardcoding the year as fallback content: `<span data-year>2026</span>`.

---

## PART D — MOBILE QUALITY GATES (375px)

### CRITICAL

---

**MOB-01** | CRITICAL | `contact.html` | **Map iframe will collapse on mobile due to `height: 100%` on element inside container with only `min-height`**

As detailed in BUG-06, the contact map iframe uses `height: 100%; min-height: 300px` within a container that has `min-height: 300px`. On mobile, the `.contact-grid` is single column (stacked), and the `.contact-map` container has `min-height: 300px` with no explicit height. The iframe's `height: 100%` resolves to 100% of the container, which is `min-height: 300px` — this works in Chrome/Firefox. However in Safari iOS, `height: 100%` on a child within a parent that only has `min-height` (not an explicit `height`) will collapse to 0. This is a known Safari bug.

**Fix**:
```css
.contact-map {
  min-height: 300px;
  height: 300px; /* explicit height for Safari */
}
@media (min-width: 1024px) {
  .contact-map {
    height: 450px;
  }
}
```

---

### HIGH

---

**MOB-02** | HIGH | `index.html` | **Hero CTA buttons may overflow on very narrow screens (320px) or cause wrapping issues**

The `.hero-ctas` uses `flex-wrap: wrap` and `justify-content: center`. On 375px, with two buttons each having `padding: var(--space-3) var(--space-6)` (0.75rem + 2rem sides = 56px+ wide each), plus text "Reserve a Table" and "Explore", the total width may exceed 375px. `flex-wrap: wrap` handles this but the wrapped layout creates unequal button widths that look unpolished.

**Fix**: On mobile, make buttons full-width:
```css
@media (max-width: 479px) {
  .hero-ctas {
    flex-direction: column;
    align-items: center;
  }
  .hero-ctas .btn-primary,
  .hero-ctas .btn-secondary {
    width: 100%;
    max-width: 280px;
    justify-content: center;
  }
}
```

---

**MOB-03** | HIGH | `index.html` gallery section (line 306) | **Inline style on gallery CTA button with `border-color: rgba(240,236,229,0.3)` is a hardcoded rogue value — on mobile dark backgrounds, this renders correctly, but the pattern should use CSS variables**

Related to BUG-03 and BUG-12. On mobile the gallery section uses a dark background (`--color-dark`) and the "View Full Gallery" btn-secondary has its border-color overridden inline. On mobile, the interaction is touch-based so hover states don't apply, but the button will still appear with a very subtle border due to the low-opacity override. This is a quality concern on a premium deliverable.

---

### MEDIUM

---

**MOB-04** | MEDIUM | All pages | **WhatsApp floating button overlaps scrollable content on mobile at the bottom of the viewport**

The `.whatsapp-btn` is positioned `bottom: var(--space-6); right: var(--space-6)` = `bottom: 2rem; right: 2rem`. On mobile, the CTA banners and contact sections have full-width content including buttons. The WhatsApp FAB at bottom-right (56px circle + 2rem from edge) can overlap the "Or call us" secondary link in `.cta-banner-secondary` if the user pauses while scrolling through a CTA section. Consider adding `padding-bottom: 80px` to the last section on mobile, or keeping the FAB visible only when scrolled past the main CTA sections.

---

**MOB-05** | MEDIUM | `menu.html` | **At 768px breakpoint, `.menu-cocktails-grid` switches to 2 columns, but `.menu-cocktail-item` at 768–1023px still uses single-column internal layout (image + text stacked)**

At 768px, the cocktail grid becomes 2-column (2 cards per row). Each card (`menu-cocktail-item`) still uses the single-column internal layout (image above, text below) until 1024px where it switches to `grid-template-columns: 200px 1fr`. At 768–1024px, two cards sit side-by-side, each with image+text stacked. This works correctly on a 768px tablet but on intermediate sizes (800–900px), the cards can feel cramped. This is acceptable but worth monitoring.

---

**MOB-06** | MEDIUM | `index.html` | **`contact-compact-card` uses emoji icons which are not scalable/accessible on all mobile OS**

Already flagged in UX-06. On some Android systems, emoji render significantly smaller or in different aspect ratios than on iOS, creating a degraded experience on the home page contact card.

---

### LOW

---

**MOB-07** | LOW | All pages | **Custom scrollbar styles (`::-webkit-scrollbar`) are only supported on Chromium-based browsers; Firefox shows native scrollbar**

The premium gold scrollbar is a nice touch but will not display in Firefox (which has its own `scrollbar-color` / `scrollbar-width` CSS). Firefox users will see the native scrollbar style.

**Fix**: Add Firefox scrollbar styling:
```css
html {
  scrollbar-color: var(--color-accent) var(--color-dark);
  scrollbar-width: thin;
}
```

---

**MOB-08** | LOW | `styles.css` line 467–469 | **`.mobile-menu` has `display: none` at 1024px breakpoint — this is a min-width rule inside a breakpoint block but uses `display: none` which cannot be transitioned; the open/close animation uses opacity/visibility which are overridden**

The `@media (min-width: 1024px) { .mobile-menu { display: none; } }` rule hides the mobile menu at desktop. This works correctly. However, the transition on `.mobile-menu` is for `opacity` and `visibility`, not `display`. Since `display: none` is set at 1024px, this is fine — the mobile menu simply does not render. No bug here, just noting the pattern is correct.

---

## PART A (continued) — Additional Design Quality Issues

### CSS Quality Rule Violations

---

**CSS-QR-01** | LOW | `styles.css` line 91–93 | **Shorthand `--transition-*` variables use `all` keyword**

```css
--transition-fast:    all 200ms cubic-bezier(0.16, 1, 0.3, 1);
--transition-normal:  all 400ms cubic-bezier(0.16, 1, 0.3, 1);
--transition-slow:    all 600ms cubic-bezier(0.16, 1, 0.3, 1);
```

Using `transition: all` transitions every animatable property, including expensive properties like `box-shadow`, `filter`, and `border-color`. This can cause performance issues on lower-end devices. Specific property transitions (e.g., `color, border-color, background-color, transform, box-shadow, opacity`) are preferred.

---

**CSS-QR-02** | LOW | `styles.css` — No `scroll-behavior: smooth` on `<html>` — PASS

Confirmed: there is no `scroll-behavior: smooth` on the `<html>` element. Smooth scrolling is handled entirely by JS in `initSmoothScroll()`. This correctly respects `prefers-reduced-motion`. PASS.

---

### JS Quality Rule Verification

| Rule | Status | Notes |
|---|---|---|
| No `var` | PASS | Only `const`/`let` used throughout |
| No `console.log` | PASS | None found |
| No global variables | FAIL | `window._setMenuOpen` at line 75 (see BUG-10) |
| Element existence checks | PASS | Every init function checks `if (!element) return` |
| Passive scroll/touch listeners | PASS | All scroll/touch listeners use `{ passive: true }` |
| IntersectionObserver unobserves after trigger | PASS | `observer.unobserve(entry.target)` called in reveal animations |
| Section-specific JS only runs if section exists | PASS | All section inits guard with existence check |

---

### HTML Quality Rule Verification

| Rule | Status | File/Line | Notes |
|---|---|---|---|
| Semantic HTML | PASS | All pages | header, nav, main, section, footer all used correctly |
| One `h1` per page | PASS | All pages | Single `h1` per page confirmed |
| Heading hierarchy | PASS | All pages | h1 → h2 → h3, no skipping |
| Unique title per page | PASS | All pages | Each page has unique `<title>` |
| Unique meta description | PASS | All pages | Each page has unique description |
| `<html lang="en">` | PASS | All pages | Present on all pages |
| Alt text on images | PASS | All pages | All images have descriptive alt attributes |
| `width` and `height` attributes | PASS | All images | Explicit dimensions on all images |
| `loading="lazy"` on below-fold images | PARTIAL FAIL | contact.html:53 | Page hero has lazy (should be eager) |
| External links `target="_blank" rel="noopener noreferrer"` | PASS | All pages | All external links correctly attributed |
| Phone links `href="tel:+XX..."` | PASS | All pages | Correctly formatted |
| WhatsApp links `https://wa.me/[number]` | PASS | All pages | Using `wa.me` format |

---

## Prioritized Fix List

### Fix Immediately (Before Delivery)

1. **BUG-03** — Remove all inline `style` attributes; move to CSS utility classes
2. **MOB-01** — Fix map iframe height on Safari iOS (add explicit height to `.contact-map`)
3. **BUG-13** — Fix `contact.html` page hero `loading="lazy"` → `loading="eager"` (LCP impact)
4. **BUG-02** — Fix hero scroll indicator timing (increase animation delay to 3.5s or override in `revealHero()`)
5. **UX-06** — Replace emoji in contact-compact card with SVG icons

### Fix Before Launch (High Priority)

6. **BUG-05** — Fix magnetic button `mouseleave` snap (add transition easing on reset)
7. **BUG-07** — Add mobile override for gallery masonry span (prevent broken layout on 2-col mobile)
8. **BUG-10** — Remove `window._setMenuOpen` global; share `menuOpen` via closure scope
9. **UX-04** — Fix hero scroll indicator firing during preloader exit
10. **CROSS-03** — Fix ALL-CAPS section labels in HTML (let CSS handle uppercase)
11. **BUG-11** — Add `--color-whatsapp` CSS custom property
12. **BUG-12** — Add `--color-text-light-rgb` and refactor hardcoded `rgba` border values
13. **MOB-02** — Add full-width button layout for hero CTAs on very narrow screens
14. **CROSS-01** — Remove static `.active` HTML classes from nav; rely entirely on JS

### Fix Post-Launch (Medium/Low Priority)

15. **BUG-08** — Add IntersectionObserver for mobile cinematic autoplay
16. **BUG-09** — Clarify/fix `.menu-food-item` layout intent (stacked vs. side-by-side)
17. **UX-05** — Add scroll affordance for reviews track on desktop
18. **CROSS-02** — Differentiate story strip copy on gallery.html
19. **UX-03** — Add `<noscript>` or `@media (scripting: none)` fallback for reveal animations
20. **UX-08** — Add `margin-inline: auto` to `.directions-content`
21. **CROSS-05** — Increase footer social icon touch targets to 44×44px
22. **CROSS-06** — Add fallback year text content to `[data-year]` spans
23. **MOB-07** — Add Firefox scrollbar styling
24. **CSS-QR-01** — Replace `transition: all` with specific property lists
25. **UX-07** — Increase service number opacity for legibility
26. **BUG-14** — Replace hardcoded `rgba(255,255,255,0.03)` with custom properties
27. **BUG-15** — Add hover `box-shadow` to `.menu-bar-card`
28. **UX-09** — Add `<link rel="canonical">` to all pages

---

## Overall Assessment

The Chez Vous 3.0 website is a well-structured, visually coherent luxury site. The dark luxury palette is correctly applied throughout. Typography hierarchy is strong. The three Signature Moments (Cinematic Sequence, Cocktail Cards, Story Strip) are architecturally sound. Cross-page consistency is high. The codebase shows professional discipline: no `var`, passive listeners, IntersectionObserver with unobserve, proper ARIA attributes.

The issues found fall into three clusters:

**Cluster 1 — Hardcoded values** (BUG-11, BUG-12, BUG-14, CSS-QR-01): The design system custom properties are excellent but not applied consistently in ~5 places. These are quick fixes.

**Cluster 2 — Mobile edge cases** (MOB-01, BUG-07, BUG-13): Safari iframe height collapse and contact hero lazy loading are the most impactful mobile issues. Both have straightforward fixes.

**Cluster 3 — Animation timing** (BUG-02, UX-04): The hero scroll indicator and preloader interaction timing has a race condition on return visits. Low visual impact but worth addressing for polish.

None of the critical/high issues are architectural — all are fixable without restructuring. The codebase is delivery-quality after addressing the 14 priority fixes.
