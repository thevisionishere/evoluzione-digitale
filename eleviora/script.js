/* =============================================================================
   ELEVIORA — script.js
   ============================================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const isDesktop = window.matchMedia('(hover: hover)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  initPreloader(prefersReducedMotion);
  initHeader();
  initMobileMenu();
  initScrollProgress();
  initRevealAnimations(prefersReducedMotion);
  initCounters(prefersReducedMotion);
  if (isDesktop && !prefersReducedMotion) initCustomCursor();
  if (isDesktop && !prefersReducedMotion) initParallax();
  if (isDesktop && !prefersReducedMotion) initMagneticButtons();
  initSmoothScroll();
  initActiveNav();
  initForms();
  initDynamicYear();
  initTabs('.territory-tabs', '.territory-tab', '.territory-panels', '.territory-panel');
  initTabs('.service-tabs-nav', '.service-tab-btn', '.service-tabs-content', '.service-tab-panel');
  initFAQ();
  initPropertyFilter();
  initHorizontalScrollShowcase(prefersReducedMotion);
});

/* ============================================================================= */
function initPreloader(prefersReducedMotion) {
  const preloader = document.querySelector('.preloader');
  if (!preloader) return;
  const isHome = document.body.classList.contains('page-home') ||
                 /index\.html?$|\/$/.test(location.pathname);
  const visited = sessionStorage.getItem('eleviora-visited');

  if (!isHome || visited || prefersReducedMotion) {
    preloader.style.display = 'none';
    document.body.classList.remove('preloader-active');
    window.dispatchEvent(new CustomEvent('preloaderComplete'));
    return;
  }
  document.body.classList.add('preloader-active');
  sessionStorage.setItem('eleviora-visited', 'true');

  setTimeout(() => {
    preloader.classList.add('done');
    document.body.classList.remove('preloader-active');
    window.dispatchEvent(new CustomEvent('preloaderComplete'));
    setTimeout(() => { preloader.style.display = 'none'; }, 900);
  }, 2300);
}

/* ============================================================================= */
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;
  let lastScrollY = window.scrollY;
  let ticking = false;
  let menuIsOpen = false;

  window.addEventListener('menuStateChange', (e) => { menuIsOpen = e.detail.open; });

  function updateHeader() {
    const currentScrollY = window.scrollY;
    if (currentScrollY > 50) header.classList.add('header-scrolled');
    else header.classList.remove('header-scrolled');

    if (!menuIsOpen) {
      if (currentScrollY > lastScrollY + 5 && currentScrollY > 180) {
        header.classList.add('header-hidden');
      } else if (currentScrollY < lastScrollY - 5) {
        header.classList.remove('header-hidden');
      }
    } else {
      header.classList.remove('header-hidden');
    }
    lastScrollY = currentScrollY;
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(updateHeader); ticking = true; }
  }, { passive: true });
  updateHeader();
}

/* ============================================================================= */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const menu = document.querySelector('.mobile-menu');
  if (!hamburger || !menu) return;
  const links = menu.querySelectorAll('a');
  let lastFocused = null;

  function open() {
    lastFocused = document.activeElement;
    menu.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
    window.dispatchEvent(new CustomEvent('menuStateChange', { detail: { open: true } }));
    setTimeout(() => { const first = menu.querySelector('a, button'); if (first) first.focus(); }, 200);
  }
  function close() {
    menu.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    window.dispatchEvent(new CustomEvent('menuStateChange', { detail: { open: false } }));
    if (lastFocused) lastFocused.focus();
  }
  hamburger.addEventListener('click', () => {
    if (menu.classList.contains('is-open')) close(); else open();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) close();
  });
  links.forEach(link => link.addEventListener('click', () => close()));

  // Focus trap
  menu.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const focusable = menu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
    else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
  });
}

/* ============================================================================= */
function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;
  let ticking = false;
  function update() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollY / docHeight : 0;
    bar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
}

/* ============================================================================= */
function initRevealAnimations(prefersReducedMotion) {
  const elements = document.querySelectorAll('.reveal-up, .fade-in');
  if (!elements.length) return;
  if (prefersReducedMotion) {
    elements.forEach(el => el.classList.add('revealed'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  elements.forEach(el => observer.observe(el));

  // Hero reveal on preloaderComplete
  const hero = document.querySelector('.hero');
  if (hero) {
    const revealHero = () => hero.classList.add('revealed');
    window.addEventListener('preloaderComplete', () => setTimeout(revealHero, 250));
    // Fallback: internal pages with no preloader
    setTimeout(() => { if (!hero.classList.contains('revealed')) revealHero(); }, 700);
  }
}

/* ============================================================================= */
function initCounters(prefersReducedMotion) {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  if (prefersReducedMotion) {
    counters.forEach(c => { c.textContent = formatCount(c); });
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(c => observer.observe(c));
}
function formatCount(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const isFloat = !Number.isInteger(target);
  return (isFloat ? target.toFixed(2) : target) + suffix;
}
function animateCounter(element) {
  const target = parseFloat(element.dataset.count);
  const suffix = element.dataset.suffix || '';
  const isFloat = !Number.isInteger(target);
  const duration = 2000;
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const val = eased * target;
    element.textContent = (isFloat ? val.toFixed(2) : Math.floor(val)) + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else element.textContent = (isFloat ? target.toFixed(2) : target) + suffix;
  }
  requestAnimationFrame(update);
}

/* ============================================================================= */
function initCustomCursor() {
  const dot = document.createElement('div'); dot.className = 'cursor-dot';
  const follower = document.createElement('div'); follower.className = 'cursor-follower';
  dot.style.left = '-100px'; dot.style.top = '-100px';
  follower.style.left = '-100px'; follower.style.top = '-100px';
  document.body.appendChild(dot);
  document.body.appendChild(follower);

  let mouseX = -100, mouseY = -100;
  let fx = -100, fy = -100;
  let activated = false;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    if (!activated) { activated = true; document.body.classList.add('custom-cursor'); }
  });
  function updateFollower() {
    fx += (mouseX - fx) * 0.15;
    fy += (mouseY - fy) * 0.15;
    follower.style.transform = `translate(${fx}px, ${fy}px) translate(-50%, -50%)`;
    requestAnimationFrame(updateFollower);
  }
  requestAnimationFrame(updateFollower);

  const sel = 'a, button, [role="button"], input, textarea, select, label, .property-card, .hs-card, .zone-card, .territory-card';
  document.querySelectorAll(sel).forEach(el => {
    el.addEventListener('mouseenter', () => follower.classList.add('hover'));
    el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
  });
  document.addEventListener('mouseleave', () => {
    dot.classList.add('hidden'); follower.classList.add('hidden');
  });
  document.addEventListener('mouseenter', () => {
    dot.classList.remove('hidden'); follower.classList.remove('hidden');
  });
}

/* ============================================================================= */
function initParallax() {
  const targets = document.querySelectorAll('.hero-bg, .cta-banner-bg');
  if (!targets.length) return;
  let ticking = false;
  function update() {
    const scrollY = window.scrollY;
    targets.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const offset = scrollY * 0.25;
      el.style.transform = `translateY(${offset}px)`;
    });
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
}

/* ============================================================================= */
function initMagneticButtons() {
  // Scope to explicitly-marked .magnetic-btn only (Hero + CTA Banner primary)
  // so we don't attach handlers to 30+ property-card buttons.
  const buttons = document.querySelectorAll('.magnetic-btn');
  buttons.forEach(btn => {
    let cssTranslateY = 0;
    btn.addEventListener('mouseenter', () => { cssTranslateY = -2; });
    btn.addEventListener('mouseleave', () => {
      cssTranslateY = 0;
      btn.style.transform = '';
    });
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15 + cssTranslateY}px)`;
    });
  });
}

/* ============================================================================= */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#' || href.length <= 1) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const header = document.querySelector('.header');
      const headerHeight = header ? header.offsetHeight : 80;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  });
}

/* ============================================================================= */
function initActiveNav() {
  const links = document.querySelectorAll('.nav-link, .mobile-menu-nav a');
  const path = location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#')) return;
    const linkFile = href.split('/').pop();
    if (linkFile === path || (path === '' && linkFile === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ============================================================================= */
function initForms() {
  document.querySelectorAll('form.form').forEach(form => {
    const fields = form.querySelectorAll('[required]');
    fields.forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        const wrap = field.closest('.form-field');
        if (wrap && wrap.classList.contains('error')) wrap.classList.remove('error');
      });
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      let firstError = null;
      fields.forEach(field => {
        const ok = validateField(field);
        if (!ok) { valid = false; if (!firstError) firstError = field; }
      });
      if (!valid) {
        if (firstError) {
          firstError.focus();
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
      form.classList.add('submitted');
    });
  });
}
function validateField(field) {
  const wrap = field.closest('.form-field') || field.closest('.form-privacy');
  let valid = true;
  if (field.type === 'checkbox') {
    valid = field.checked;
  } else if (field.tagName === 'SELECT') {
    valid = field.value !== '';
  } else if (field.value.trim() === '') {
    valid = false;
  } else if (field.type === 'email') {
    valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
  } else if (field.type === 'tel') {
    valid = /[\d\s+()-]{6,}/.test(field.value);
  }
  if (wrap) wrap.classList.toggle('error', !valid);
  return valid;
}

/* ============================================================================= */
function initDynamicYear() {
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
}

/* ============================================================================= */
function initTabs(navSel, btnSel, panelsSel, panelSel) {
  const nav = document.querySelector(navSel);
  if (!nav) return;
  const buttons = nav.querySelectorAll(btnSel);
  const panels = document.querySelectorAll(panelSel);
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      buttons.forEach(b => { b.classList.toggle('active', b === btn); b.setAttribute('aria-selected', b === btn); });
      panels.forEach(p => p.classList.toggle('active', p.dataset.panel === target));
    });
  });
}

/* ============================================================================= */
function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', () => {
      const active = item.classList.toggle('active');
      trigger.setAttribute('aria-expanded', active);
    });
  });
}

/* ============================================================================= */
function initPropertyFilter() {
  const container = document.querySelector('.property-grid');
  const chips = document.querySelectorAll('.filter-chip');
  if (!container || !chips.length) return;
  const cards = container.querySelectorAll('.property-card');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const zone = chip.dataset.zone || '';
      const kind = chip.dataset.kind || '';
      chips.forEach(c => {
        const sameGroup = (
          (c.dataset.zone !== undefined && chip.dataset.zone !== undefined) ||
          (c.dataset.kind !== undefined && chip.dataset.kind !== undefined)
        );
        if (sameGroup) c.classList.toggle('active', c === chip);
      });
      filterCards();
    });
  });

  function filterCards() {
    const activeZoneChip = document.querySelector('.filter-chip[data-zone].active');
    const activeKindChip = document.querySelector('.filter-chip[data-kind].active');
    const zoneFilter = activeZoneChip ? activeZoneChip.dataset.zone : '';
    const kindFilter = activeKindChip ? activeKindChip.dataset.kind : '';

    cards.forEach(card => {
      const z = card.dataset.zone;
      const k = card.dataset.kind;
      const zoneMatch = !zoneFilter || zoneFilter === 'all' || z === zoneFilter;
      const kindMatch = !kindFilter || kindFilter === 'all' || k === kindFilter;
      card.classList.toggle('is-hidden', !(zoneMatch && kindMatch));
    });
  }
}

/* ============================================================================= */
function initHorizontalScrollShowcase(prefersReducedMotion) {
  const section = document.querySelector('.horizontal-showcase');
  if (!section) return;
  const container = section.querySelector('.hs-scroll-container');
  const track = section.querySelector('.hs-track');
  if (!container || !track) return;

  // Skip scroll-driven on mobile — CSS handles swipe carousel
  const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
  if (!isDesktop || prefersReducedMotion) return;

  let ticking = false;
  function update() {
    const rect = section.getBoundingClientRect();
    const trackWidth = track.scrollWidth;
    const containerWidth = container.clientWidth;
    const maxTranslate = trackWidth - containerWidth;
    if (maxTranslate <= 0) { ticking = false; return; }

    const sectionHeight = section.offsetHeight;
    const windowHeight = window.innerHeight;
    // progress: how far the section has scrolled past viewport center
    const totalScroll = sectionHeight + windowHeight;
    const scrolled = Math.max(0, windowHeight - rect.top);
    const progress = Math.max(0, Math.min(1, scrolled / totalScroll));
    const translate = -progress * maxTranslate;
    track.style.transform = `translateX(${translate}px)`;
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
}
