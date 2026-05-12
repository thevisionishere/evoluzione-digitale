/* =============================================================
   SCHIENAFIT — SCRIPT.JS
   Vanilla JS — no libraries. All interactions in one file.
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const isDesktop = window.matchMedia('(hover: hover)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isHome = document.body.dataset.page === 'home';

  initPreloader(isHome, prefersReducedMotion);
  initHeader();
  initMobileMenu();
  initScrollProgress();
  initRevealAnimations(prefersReducedMotion);
  initCounters(prefersReducedMotion);
  initSmoothScroll();
  initActiveNav();
  initFAQ();
  initMethodVisualizer();
  initTextReveal(prefersReducedMotion);
  initTestimonialReveal(prefersReducedMotion);
  initForm();
  initDynamicYear();
  if (isDesktop && !prefersReducedMotion) initCustomCursor();
  if (isDesktop && !prefersReducedMotion) initMagneticButtons();
  if (isDesktop && !prefersReducedMotion) initHeroParallax();
});


/* -------------------------------------------------------------
   PRELOADER (Counter variant)
   ------------------------------------------------------------- */
function initPreloader(isHome, prefersReducedMotion) {
  const preloader = document.querySelector('.preloader');
  if (!preloader) return;

  const hasVisited = sessionStorage.getItem('schienafit-visited');

  // Only show on Home first visit
  if (!isHome || hasVisited || prefersReducedMotion) {
    preloader.classList.add('is-complete');
    document.body.classList.remove('preloader-active');
    requestAnimationFrame(() => firePreloaderComplete());
    return;
  }

  document.body.classList.add('preloader-active');
  const counter = preloader.querySelector('.preloader__counter');
  const barFill = preloader.querySelector('.preloader__bar-fill');
  if (!counter) {
    preloader.classList.add('is-complete');
    document.body.classList.remove('preloader-active');
    firePreloaderComplete();
    return;
  }

  const duration = 1800;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(eased * 100);
    counter.textContent = String(value);
    if (barFill) barFill.style.transform = `scaleX(${eased})`;
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      sessionStorage.setItem('schienafit-visited', 'true');
      setTimeout(() => {
        preloader.classList.add('is-complete');
        document.body.classList.remove('preloader-active');
        firePreloaderComplete();
      }, 300);
    }
  }
  requestAnimationFrame(tick);
}

function firePreloaderComplete() {
  document.dispatchEvent(new CustomEvent('preloaderComplete'));
  // Trigger hero reveals
  setTimeout(() => {
    document.querySelectorAll('.hero .reveal-up, .hero--portrait .reveal-up, .hero--internal .reveal-up').forEach((el, i) => {
      setTimeout(() => el.classList.add('revealed'), i * 90);
    });
  }, 60);
}


/* -------------------------------------------------------------
   HEADER scroll behavior
   ------------------------------------------------------------- */
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;
  let lastScrollY = window.scrollY;
  let ticking = false;
  let menuOpen = false;

  document.addEventListener('mobile-menu-state', (e) => {
    menuOpen = e.detail.open;
    if (menuOpen) header.classList.remove('header-hidden');
  });

  function update() {
    const y = window.scrollY;
    if (y > 30) header.classList.add('header-scrolled');
    else header.classList.remove('header-scrolled');

    if (!menuOpen) {
      const delta = y - lastScrollY;
      if (Math.abs(delta) > 6) {
        if (delta > 0 && y > 240) header.classList.add('header-hidden');
        else header.classList.remove('header-hidden');
        lastScrollY = y;
      }
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
}


/* -------------------------------------------------------------
   MOBILE MENU
   ------------------------------------------------------------- */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const menu = document.querySelector('.mobile-menu');
  const backdrop = document.querySelector('.mobile-menu__backdrop');
  if (!hamburger || !menu) return;

  let lastFocused = null;

  function open() {
    lastFocused = document.activeElement;
    hamburger.classList.add('is-open');
    menu.classList.add('is-open');
    if (backdrop) backdrop.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
    document.dispatchEvent(new CustomEvent('mobile-menu-state', { detail: { open: true } }));

    menu.querySelectorAll('.mobile-menu__nav a').forEach((a, i) => {
      a.style.setProperty('--i', i);
    });

    setTimeout(() => {
      const firstLink = menu.querySelector('a');
      if (firstLink) firstLink.focus();
    }, 200);
  }

  function close() {
    hamburger.classList.remove('is-open');
    menu.classList.remove('is-open');
    if (backdrop) backdrop.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    document.dispatchEvent(new CustomEvent('mobile-menu-state', { detail: { open: false } }));
    if (lastFocused) lastFocused.focus();
  }

  hamburger.addEventListener('click', () => {
    menu.classList.contains('is-open') ? close() : open();
  });

  if (backdrop) backdrop.addEventListener('click', close);

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      if (!a.getAttribute('href').startsWith('#') || a.getAttribute('href') === '#') return close();
      // Anchor link within same page
      close();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) close();
  });

  // Focus trap
  menu.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || !menu.classList.contains('is-open')) return;
    const focusable = menu.querySelectorAll('a, button');
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
}


/* -------------------------------------------------------------
   SCROLL PROGRESS
   ------------------------------------------------------------- */
function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress__bar');
  if (!bar) return;
  let ticking = false;
  function update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;
    bar.style.transform = `scaleX(${progress})`;
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
}


/* -------------------------------------------------------------
   REVEAL ON SCROLL
   ------------------------------------------------------------- */
function initRevealAnimations(prefersReducedMotion) {
  const els = document.querySelectorAll('.reveal-up');
  if (!els.length) return;

  if (prefersReducedMotion) {
    els.forEach(el => el.classList.add('revealed'));
    return;
  }

  // Skip hero elements (they're triggered by preloader)
  const observed = Array.from(els).filter(el => !el.closest('.hero'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  observed.forEach(el => observer.observe(el));
}


/* -------------------------------------------------------------
   COUNTERS
   ------------------------------------------------------------- */
function initCounters(prefersReducedMotion) {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  if (prefersReducedMotion) {
    counters.forEach(c => {
      const suffix = c.dataset.suffix || '';
      const prefix = c.dataset.prefix || '';
      c.textContent = prefix + c.dataset.count + suffix;
    });
    return;
  }

  function animate(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 1800;
    const start = performance.now();
    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = prefix + target + suffix;
    }
    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(c => observer.observe(c));
}


/* -------------------------------------------------------------
   SMOOTH SCROLL
   ------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;
    link.addEventListener('click', (e) => {
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const header = document.querySelector('.header');
      const offset = (header ? header.offsetHeight : 0) + 20;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}


/* -------------------------------------------------------------
   ACTIVE NAV (multi-page)
   ------------------------------------------------------------- */
function initActiveNav() {
  const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.header__nav a, .mobile-menu__nav a').forEach(link => {
    const href = (link.getAttribute('href') || '').toLowerCase();
    if (!href || href.startsWith('#')) return;
    const file = href.split('/').pop();
    if (file === current || (current === '' && file === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}


/* -------------------------------------------------------------
   FAQ ACCORDION
   ------------------------------------------------------------- */
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;
  items.forEach((item, idx) => {
    const trigger = item.querySelector('.faq-item__trigger');
    const content = item.querySelector('.faq-item__content');
    if (!trigger || !content) return;

    const contentId = content.id || `faq-content-${idx}-${Math.random().toString(36).slice(2, 7)}`;
    content.id = contentId;
    trigger.setAttribute('aria-controls', contentId);
    trigger.setAttribute('aria-expanded', 'false');

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      items.forEach(it => {
        if (it !== item) {
          it.classList.remove('is-open');
          const c = it.querySelector('.faq-item__content');
          if (c) c.style.maxHeight = null;
          const t = it.querySelector('.faq-item__trigger');
          if (t) t.setAttribute('aria-expanded', 'false');
        }
      });
      if (isOpen) {
        item.classList.remove('is-open');
        content.style.maxHeight = null;
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('is-open');
        content.style.maxHeight = content.scrollHeight + 'px';
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}


/* -------------------------------------------------------------
   METHOD VISUALIZER (A.A.P.E.C.)
   ------------------------------------------------------------- */
function initMethodVisualizer() {
  const panels = Array.from(document.querySelectorAll('.method-panel'));
  if (!panels.length) return;

  function activate(panel) {
    panels.forEach(p => {
      p.classList.remove('is-active');
      p.setAttribute('aria-selected', 'false');
      p.setAttribute('tabindex', '-1');
    });
    panel.classList.add('is-active');
    panel.setAttribute('aria-selected', 'true');
    panel.setAttribute('tabindex', '0');
  }

  // Initial state — first panel active
  activate(panels[0]);

  panels.forEach((panel, idx) => {
    panel.addEventListener('click', () => activate(panel));

    panel.addEventListener('mouseenter', () => {
      if (window.matchMedia('(hover: hover)').matches && window.innerWidth >= 1024) {
        activate(panel);
      }
    });

    panel.addEventListener('keydown', (e) => {
      let target = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        target = panels[(idx + 1) % panels.length];
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        target = panels[(idx - 1 + panels.length) % panels.length];
      } else if (e.key === 'Home') {
        target = panels[0];
      } else if (e.key === 'End') {
        target = panels[panels.length - 1];
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate(panel);
        return;
      }
      if (target) {
        e.preventDefault();
        activate(target);
        target.focus();
      }
    });
  });
}


/* -------------------------------------------------------------
   TEXT REVEAL (Signature 1)
   ------------------------------------------------------------- */
function initTextReveal(prefersReducedMotion) {
  const container = document.querySelector('.text-reveal__statement');
  if (!container) return;

  if (prefersReducedMotion) {
    container.querySelectorAll('.text-reveal__word').forEach(w => w.classList.add('is-active'));
    return;
  }

  const words = container.querySelectorAll('.text-reveal__word');
  if (!words.length) return;

  let ticking = false;
  function update() {
    const rect = container.getBoundingClientRect();
    const viewportH = window.innerHeight;
    // Activation window: when the container's center crosses 60% to -20% of viewport
    const containerTop = rect.top;
    const containerHeight = rect.height;
    // Calculate progress: 0 when top of container at 80vh, 1 when bottom of container at 30vh
    const startScroll = viewportH * 0.85;
    const endScroll = -containerHeight * 0.35;
    const range = startScroll - endScroll;
    const progress = Math.max(0, Math.min(1, (startScroll - containerTop) / range));
    const totalWords = words.length;
    const wordsToShow = Math.ceil(progress * totalWords);
    words.forEach((w, i) => {
      if (i < wordsToShow) w.classList.add('is-active');
      else w.classList.remove('is-active');
    });
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
}


/* -------------------------------------------------------------
   TESTIMONIAL IMMERSION word reveal
   ------------------------------------------------------------- */
function initTestimonialReveal(prefersReducedMotion) {
  const quote = document.querySelector('.testimonial-immersion__quote');
  if (!quote) return;
  if (prefersReducedMotion) {
    quote.querySelectorAll('.reveal-word').forEach(w => w.classList.add('is-active'));
    return;
  }
  const words = quote.querySelectorAll('.reveal-word');
  if (!words.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        words.forEach((w, i) => {
          setTimeout(() => w.classList.add('is-active'), i * 55);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });
  observer.observe(quote);
}


/* -------------------------------------------------------------
   CONTACT FORM (static — mailto fallback)
   ------------------------------------------------------------- */
function initForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  const status = form.querySelector('.form-status');

  function validateField(field) {
    const isRequired = field.hasAttribute('required');
    let valid = true;
    if (field.type === 'checkbox') {
      if (isRequired && !field.checked) valid = false;
      const checkboxWrapper = field.closest('.form-checkbox');
      if (checkboxWrapper) {
        if (!valid) checkboxWrapper.classList.add('error');
        else checkboxWrapper.classList.remove('error');
      }
      return valid;
    }
    const wrapper = field.closest('.form-field');
    if (!wrapper) return true;
    if (isRequired && !field.value.trim()) valid = false;
    if (field.type === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) valid = false;
    if (!valid) wrapper.classList.add('error');
    else wrapper.classList.remove('error');
    return valid;
  }

  form.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      const wrapper = field.closest('.form-field');
      if (wrapper && wrapper.classList.contains('error')) validateField(field);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let allValid = true;
    let firstError = null;
    form.querySelectorAll('input, textarea, select').forEach(field => {
      if (!validateField(field)) {
        allValid = false;
        if (!firstError) firstError = field;
      }
    });
    if (!allValid) {
      if (firstError) {
        firstError.focus();
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    // Build mailto fallback
    const name = form.querySelector('[name="name"]')?.value || '';
    const email = form.querySelector('[name="email"]')?.value || '';
    const phone = form.querySelector('[name="phone"]')?.value || '';
    const need = form.querySelector('[name="need"]')?.value || '';
    const message = form.querySelector('[name="message"]')?.value || '';

    const subject = encodeURIComponent(`Richiesta da schienafit.it — ${name}`);
    const body = encodeURIComponent(
`Nome: ${name}
Email: ${email}
Telefono: ${phone}
Di cosa hai bisogno: ${need}

Messaggio:
${message}

—
Invio dal sito schienafit.it`
    );
    window.location.href = `mailto:schienafit@gmail.com?subject=${subject}&body=${body}`;

    if (status) {
      status.classList.add('is-visible');
      status.textContent = 'Stiamo aprendo il tuo client email per inviare il messaggio. Se non si apre automaticamente, scrivi a schienafit@gmail.com.';
    }
  });
}


/* -------------------------------------------------------------
   DYNAMIC YEAR
   ------------------------------------------------------------- */
function initDynamicYear() {
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
}


/* -------------------------------------------------------------
   CUSTOM CURSOR (desktop only)
   ------------------------------------------------------------- */
function initCustomCursor() {
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const follower = document.createElement('div');
  follower.className = 'cursor-follower';

  // Position offscreen via transform — keep CSS top/left at 0 so transform is the
  // only positioning source. Setting style.left/top here would create a permanent
  // offset that the transform-based mousemove handler does not compensate for.
  dot.style.transform = 'translate(-200px, -200px)';
  follower.style.transform = 'translate(-200px, -200px)';

  document.body.appendChild(dot);
  document.body.appendChild(follower);

  let mouseX = -200, mouseY = -200;
  let followerX = -200, followerY = -200;
  let cursorActivated = false;

  // Detect dark/teal background sections — invert cursor to white for visibility
  const darkSelectors = '.numbers, .cta-banner, .footer, .section-dark, [data-cursor="light"]';
  let isOverDark = false;
  let checkPending = false;

  function updateCursorContrast() {
    checkPending = false;
    const el = document.elementFromPoint(mouseX, mouseY);
    const overDark = !!(el && el.closest && el.closest(darkSelectors));
    if (overDark !== isOverDark) {
      isOverDark = overDark;
      dot.classList.toggle('is-light', isOverDark);
      follower.classList.toggle('is-light', isOverDark);
    }
  }

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    if (!cursorActivated) {
      cursorActivated = true;
      document.body.classList.add('custom-cursor');
    }
    if (!checkPending) {
      checkPending = true;
      requestAnimationFrame(updateCursorContrast);
    }
  });

  // Also re-check on scroll (background changes as sections pass under cursor)
  window.addEventListener('scroll', () => {
    if (!checkPending && cursorActivated) {
      checkPending = true;
      requestAnimationFrame(updateCursorContrast);
    }
  }, { passive: true });

  function update() {
    followerX += (mouseX - followerX) * 0.16;
    followerY += (mouseY - followerY) * 0.16;
    follower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;
    requestAnimationFrame(update);
  }
  requestAnimationFrame(update);

  const selectors = 'a, button, [role="button"], input, textarea, select, label, .method-panel, .faq-item__trigger, .service-card, .condition-card, .tech-card';
  document.querySelectorAll(selectors).forEach(el => {
    el.addEventListener('mouseenter', () => follower.classList.add('hover'));
    el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
  });

  document.addEventListener('mouseleave', () => {
    dot.classList.add('hidden');
    follower.classList.add('hidden');
  });
  document.addEventListener('mouseenter', () => {
    dot.classList.remove('hidden');
    follower.classList.remove('hidden');
  });
}


/* -------------------------------------------------------------
   MAGNETIC BUTTONS (desktop)
   ------------------------------------------------------------- */
function initMagneticButtons() {
  document.querySelectorAll('.btn-primary, .whatsapp-fab').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transition = 'transform var(--duration-fast) var(--ease-out)';
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px) translateY(-2px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transition = '';
      btn.style.transform = '';
    });
  });
}


/* -------------------------------------------------------------
   HERO PARALLAX (disabled to keep portrait fully visible — no head crop)
   ------------------------------------------------------------- */
function initHeroParallax() {
  return;
}
