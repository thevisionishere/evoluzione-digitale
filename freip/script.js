/* ============================================================
   FREIP — Premium Custom Apparel
   Main Script — Vanilla JS, no dependencies
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const isMobile = !window.matchMedia('(hover: hover)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  initPreloader();
  initHeader();
  initMobileMenu();
  initScrollProgress();
  initRevealAnimations();
  initCounters();
  if (!isMobile) initCustomCursor();
  if (!isMobile) initParallax();
  if (!isMobile) initMagneticButtons();
  initSmoothScroll();
  initActiveNav();
  initForms();
  initDynamicYear();

  // Section-specific — lazy init only if element exists
  initMarquee();
  initHeroGallery();
  initHorizontalScroll();
  initProcessPath();
  initGalleryFilter();
  initLightbox();
  initFAQ();
  initReviewsSlider();
});

/* ============================================================
   1. PRELOADER — Curtain Split
   ============================================================ */
function initPreloader() {
  const preloader = document.querySelector('.preloader');
  if (!preloader) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Skip on revisit within same session
  if (sessionStorage.getItem('freip-visited')) {
    preloader.style.display = 'none';
    return;
  }

  // Lock scroll while preloader runs
  document.body.classList.add('preloader-active');

  if (prefersReducedMotion) {
    // Skip animation entirely
    _finishPreloader(preloader);
    return;
  }

  const textEl      = preloader.querySelector('.preloader__text');
  const curtainLeft = preloader.querySelector('.preloader__curtain--left');
  const curtainRight = preloader.querySelector('.preloader__curtain--right');

  // Phase 1: FREIP text appears (opacity 0 → 1, slight translateY)
  requestAnimationFrame(() => {
    if (textEl) {
      textEl.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      textEl.style.opacity    = '1';
      textEl.style.transform  = 'translateY(0)';
    }
  });

  // Phase 2: curtains split apart after text appears
  const splitDelay = 1000;
  const splitDuration = 700;

  setTimeout(() => {
    if (curtainLeft) {
      curtainLeft.style.transition  = `transform ${splitDuration}ms cubic-bezier(0.76, 0, 0.24, 1)`;
      curtainLeft.style.transform   = 'translateX(-100%)';
    }
    if (curtainRight) {
      curtainRight.style.transition = `transform ${splitDuration}ms cubic-bezier(0.76, 0, 0.24, 1)`;
      curtainRight.style.transform  = 'translateX(100%)';
    }
  }, splitDelay);

  // Phase 3: cleanup
  setTimeout(() => {
    _finishPreloader(preloader);
  }, splitDelay + splitDuration + 200);
}

function _finishPreloader(preloader) {
  document.body.classList.remove('preloader-active');
  preloader.classList.add('preloader--done');

  // Remove from DOM after CSS transition fades it out
  setTimeout(() => {
    if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
  }, 500);

  sessionStorage.setItem('freip-visited', '1');
  document.dispatchEvent(new Event('preloaderComplete'));
}

/* ============================================================
   2. HEADER — Scroll-aware show/hide
   ============================================================ */
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  let lastY     = window.scrollY;
  let ticking   = false;
  const THRESHOLD = 5;
  const SCROLLED_AT = 50;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }

  function updateHeader() {
    const y     = window.scrollY;
    const delta = y - lastY;

    // Scrolled state
    if (y > SCROLLED_AT) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
      header.classList.remove('header-hidden');
      lastY   = y;
      ticking = false;
      return;
    }

    // Don't hide when mobile menu is open
    const menuOpen = document.body.classList.contains('menu-open');

    if (Math.abs(delta) > THRESHOLD && !menuOpen) {
      if (delta > 0) {
        // Scrolling DOWN
        header.classList.add('header-hidden');
      } else {
        // Scrolling UP
        header.classList.remove('header-hidden');
      }
    }

    lastY   = y;
    ticking = false;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ============================================================
   3. MOBILE MENU
   ============================================================ */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const menu      = document.querySelector('.mobile-menu');
  if (!hamburger || !menu) return;

  const closeBtn    = menu.querySelector('.mobile-menu__close');
  const links       = Array.from(menu.querySelectorAll('a'));
  const focusable   = [closeBtn, ...links].filter(Boolean);

  function openMenu() {
    menu.classList.add('active');
    hamburger.classList.add('active');
    document.body.classList.add('menu-open');
    hamburger.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');

    // Stagger link animations
    links.forEach((link, i) => {
      link.style.transitionDelay = `${i * 50}ms`;
      link.classList.add('visible');
    });

    // Focus first focusable element after short delay
    setTimeout(() => {
      if (closeBtn) closeBtn.focus();
    }, 100);
  }

  function closeMenu() {
    menu.classList.remove('active');
    hamburger.classList.remove('active');
    document.body.classList.remove('menu-open');
    hamburger.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');

    links.forEach(link => {
      link.style.transitionDelay = '0ms';
      link.classList.remove('visible');
    });

    hamburger.focus();
  }

  // Toggle
  hamburger.addEventListener('click', () => {
    if (menu.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close button
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('active')) closeMenu();
  });

  // Close on link click
  links.forEach(link => link.addEventListener('click', closeMenu));

  // Focus trap
  menu.addEventListener('keydown', e => {
    if (!menu.classList.contains('active') || e.key !== 'Tab') return;

    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}

/* ============================================================
   4. SCROLL PROGRESS BAR
   ============================================================ */
function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;

  let ticking = false;

  function update() {
    const docH   = document.documentElement.scrollHeight - window.innerHeight;
    const ratio  = docH > 0 ? window.scrollY / docH : 0;
    bar.style.transform = `scaleX(${Math.min(ratio, 1)})`;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
}

/* ============================================================
   5. REVEAL ANIMATIONS
   ============================================================ */
function initRevealAnimations() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const elements = Array.from(document.querySelectorAll('.reveal-up'));
  if (!elements.length) return;

  if (prefersReducedMotion) {
    elements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el    = entry.target;
      const delay = (parseInt(el.dataset.delay, 10) || 0) * 100;

      setTimeout(() => {
        el.classList.add('revealed');
      }, delay);

      observer.unobserve(el);
    });
  }, { threshold: 0.15 });

  elements.forEach(el => observer.observe(el));
}

/* ============================================================
   6. COUNTERS
   ============================================================ */
function initCounters() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const elements = Array.from(document.querySelectorAll('[data-count]'));
  if (!elements.length) return;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCounter(el) {
    const target  = parseFloat(el.dataset.count);
    const suffix  = el.dataset.suffix || '';
    const decimals = String(target).includes('.') ? String(target).split('.')[1].length : 0;
    const duration = 2000;
    let startTime = null;

    if (prefersReducedMotion) {
      el.textContent = target.toFixed(decimals) + suffix;
      return;
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed  = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value    = easeOutCubic(progress) * target;
      el.textContent = value.toFixed(decimals) + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  elements.forEach(el => observer.observe(el));
}

/* ============================================================
   7. CUSTOM CURSOR
   ============================================================ */
function initCustomCursor() {
  // Guard: desktop only (caller already checks hover: hover)
  const dot      = document.createElement('div');
  const follower = document.createElement('div');
  dot.className      = 'cursor-dot';
  follower.className = 'cursor-follower';

  // Start hidden until first mousemove
  dot.style.opacity      = '0';
  follower.style.opacity = '0';

  document.body.appendChild(dot);
  document.body.appendChild(follower);

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;
  let initialized = false;
  let rafId = null;

  const interactiveSelectors = 'a, button, [role="button"], input, textarea, select, .magnetic-btn, .gallery-item, .faq-item__trigger';

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function animate() {
    followerX = lerp(followerX, mouseX, 0.15);
    followerY = lerp(followerY, mouseY, 0.15);

    dot.style.left      = mouseX + 'px';
    dot.style.top       = mouseY + 'px';
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';

    rafId = requestAnimationFrame(animate);
  }

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!initialized) {
      followerX = mouseX;
      followerY = mouseY;
      dot.style.opacity      = '';
      follower.style.opacity = '';
      document.body.classList.add('custom-cursor');
      initialized = true;
      animate();
    }
  });

  // Hide when leaving viewport
  document.addEventListener('mouseleave', () => {
    dot.classList.add('hidden');
    follower.classList.add('hidden');
  });

  document.addEventListener('mouseenter', () => {
    dot.classList.remove('hidden');
    follower.classList.remove('hidden');
  });

  // Hover state on interactive elements
  document.addEventListener('mouseover', e => {
    if (e.target.closest(interactiveSelectors)) {
      follower.classList.add('hover');
    }
  });

  document.addEventListener('mouseout', e => {
    if (e.target.closest(interactiveSelectors)) {
      follower.classList.remove('hover');
    }
  });
}

/* ============================================================
   8. PARALLAX
   ============================================================ */
function initParallax() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const elements = Array.from(document.querySelectorAll('.parallax-bg'));
  if (!elements.length) return;

  let ticking = false;

  function update() {
    const scrollY = window.scrollY;

    elements.forEach(el => {
      const rect   = el.getBoundingClientRect();
      const inView = rect.bottom > 0 && rect.top < window.innerHeight;
      if (!inView) return;

      const centerY = rect.top + rect.height / 2;
      const offset  = (centerY - window.innerHeight / 2) * 0.3;
      el.style.transform = `translateY(${offset}px)`;
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  // Initial render
  update();
}

/* ============================================================
   9. MAGNETIC BUTTONS
   ============================================================ */
function initMagneticButtons() {
  const buttons = Array.from(document.querySelectorAll('.magnetic-btn'));
  if (!buttons.length) return;

  const MAX_SHIFT = 12;

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect    = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width  / 2;
      const centerY = rect.top  + rect.height / 2;
      const dx      = (e.clientX - centerX) * 0.3;
      const dy      = (e.clientY - centerY) * 0.3;
      const clampX  = Math.max(-MAX_SHIFT, Math.min(MAX_SHIFT, dx));
      const clampY  = Math.max(-MAX_SHIFT, Math.min(MAX_SHIFT, dy));

      btn.style.transform = `translate(${clampX}px, ${clampY}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      btn.style.transform  = 'translate(0, 0)';

      // Reset transition after it completes
      setTimeout(() => {
        btn.style.transition = '';
      }, 400);
    });

    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'transform 0.1s ease';
    });
  });
}

/* ============================================================
   10. SMOOTH SCROLL
   ============================================================ */
function initSmoothScroll() {
  const links = Array.from(document.querySelectorAll('a[href^="#"]'));
  if (!links.length) return;

  links.forEach(link => {
    link.addEventListener('click', e => {
      const href   = link.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const header    = document.querySelector('.header');
      const headerH   = header ? header.offsetHeight : 0;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerH - 20;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });
}

/* ============================================================
   11. ACTIVE NAV
   ============================================================ */
function initActiveNav() {
  const links = Array.from(document.querySelectorAll('.nav a, .header__nav a'));
  if (!links.length) return;

  const current = window.location.pathname.split('/').pop() || 'index.html';

  links.forEach(link => {
    const href    = link.getAttribute('href') || '';
    const page    = href.split('/').pop().split('?')[0].split('#')[0] || 'index.html';

    if (page === current || (current === '' && (page === 'index.html' || page === ''))) {
      link.classList.add('active');
    }
  });
}

/* ============================================================
   12. FORMS — Validation + Success
   ============================================================ */
function initForms() {
  const forms = Array.from(document.querySelectorAll('form'));
  if (!forms.length) return;

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_RE = /^[\d\s\+\-\(\)]{7,}$/;

  function getWrapper(field) {
    return field.closest('.form-field');
  }

  function getErrorEl(field) {
    const wrapper = getWrapper(field);
    if (!wrapper) return null;
    let err = wrapper.querySelector('.form-field__error-msg');
    if (!err) {
      err = document.createElement('span');
      err.className = 'form-field__error-msg';
      err.setAttribute('aria-live', 'polite');
      wrapper.appendChild(err);
    }
    return err;
  }

  function validateField(field) {
    const value   = field.value.trim();
    const type    = field.type;
    const wrapper = getWrapper(field);
    const errEl   = getErrorEl(field);
    let message   = '';

    if (field.required && !value) {
      message = 'Questo campo è obbligatorio.';
    } else if (value && type === 'email' && !EMAIL_RE.test(value)) {
      message = 'Inserisci un indirizzo email valido.';
    } else if (value && type === 'tel' && !PHONE_RE.test(value)) {
      message = 'Inserisci un numero di telefono valido.';
    }

    if (message) {
      if (wrapper) { wrapper.classList.add('is-error'); wrapper.classList.remove('is-valid'); }
      if (errEl) errEl.textContent = message;
      field.setAttribute('aria-invalid', 'true');
      return false;
    } else {
      if (wrapper) { wrapper.classList.remove('is-error'); if (value) wrapper.classList.add('is-valid'); }
      if (errEl) errEl.textContent = '';
      field.setAttribute('aria-invalid', 'false');
      return true;
    }
  }

  forms.forEach(form => {
    const fields = Array.from(form.querySelectorAll('input, textarea, select'));

    // Blur validation
    fields.forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        const w = getWrapper(field);
        if (w && w.classList.contains('is-error')) validateField(field);
      });
    });

    // Submit
    form.addEventListener('submit', e => {
      e.preventDefault();

      const allValid = fields.map(f => validateField(f)).every(Boolean);

      if (!allValid) {
        const firstError = form.querySelector('.form-field.is-error');
        if (firstError) {
          const header  = document.querySelector('.header');
          const headerH = header ? header.offsetHeight : 0;
          const top     = firstError.getBoundingClientRect().top + window.scrollY - headerH - 30;
          window.scrollTo({ top, behavior: 'smooth' });
          const input = firstError.querySelector('input, textarea, select');
          if (input) input.focus();
        }
        return;
      }

      // Success state — use existing status element or create one
      const existingStatus = form.parentNode.querySelector('.form-status--success');
      if (existingStatus) {
        form.style.display = 'none';
        existingStatus.classList.add('is-shown');
        existingStatus.style.display = 'block';
        return;
      }

      const successMsg = document.createElement('div');
      successMsg.className = 'form-success';
      successMsg.style.cssText = 'text-align:center;padding:var(--space-8) var(--space-4);';
      successMsg.innerHTML = `
        <div style="font-size:3rem;color:var(--color-accent);margin-bottom:var(--space-4);">&#10003;</div>
        <h3 style="font-family:var(--font-display);font-size:var(--text-2xl);margin-bottom:var(--space-3);color:var(--color-text-dark);">Messaggio inviato!</h3>
        <p style="color:var(--color-text-muted);font-size:var(--text-base);">Ti risponderemo il prima possibile.</p>
      `;

      form.style.transition = 'opacity 0.3s ease';
      form.style.opacity    = '0';

      setTimeout(() => {
        form.parentNode.replaceChild(successMsg, form);
        // Trigger reveal
        requestAnimationFrame(() => {
          successMsg.style.opacity  = '0';
          successMsg.style.transform = 'translateY(20px)';
          successMsg.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          requestAnimationFrame(() => {
            successMsg.style.opacity  = '1';
            successMsg.style.transform = 'translateY(0)';
          });
        });
      }, 300);
    });
  });
}

/* ============================================================
   13. DYNAMIC YEAR
   ============================================================ */
function initDynamicYear() {
  const els = Array.from(document.querySelectorAll('[data-year]'));
  const year = new Date().getFullYear();
  els.forEach(el => { el.textContent = year; });
}

/* ============================================================
   14. MARQUEE — Pause on Hover
   ============================================================ */
function initMarquee() {
  const tracks = Array.from(document.querySelectorAll('.marquee__track'));
  if (!tracks.length) return;

  tracks.forEach(track => {
    const wrapper = track.closest('.marquee');
    if (!wrapper) return;

    wrapper.addEventListener('mouseenter', () => {
      track.style.animationPlayState = 'paused';
    });

    wrapper.addEventListener('mouseleave', () => {
      track.style.animationPlayState = 'running';
    });
  });
}

/* ============================================================
   15. HERO GALLERY — Crossfade Slideshow
   ============================================================ */
function initHeroGallery() {
  const gallery = document.querySelector('.hero-gallery');
  if (!gallery) return;

  const slides = Array.from(gallery.querySelectorAll('.hero-gallery__slide'));
  const dots   = Array.from(gallery.querySelectorAll('.hero__gallery-dot'));
  if (slides.length < 2) return;

  let current  = 0;
  let interval = null;
  let startX   = 0;

  function goTo(index) {
    slides[current].classList.remove('is-active');
    if (dots[current]) dots[current].classList.remove('is-active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('is-active');
    if (dots[current]) dots[current].classList.add('is-active');
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    interval = setInterval(next, 4000);
  }

  function stopAuto() {
    clearInterval(interval);
  }

  // Initialise first slide
  slides[0].classList.add('is-active');
  if (dots[0]) dots[0].classList.add('is-active');
  startAuto();

  // Dot click navigation
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      stopAuto();
      goTo(i);
      startAuto();
    });
  });

  // Touch swipe support
  gallery.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    stopAuto();
  }, { passive: true });

  gallery.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) {
      dx < 0 ? next() : prev();
    }
    startAuto();
  }, { passive: true });
}

/* ============================================================
   16. HORIZONTAL SCROLL — Signature Moment 1
   ============================================================ */
function initHorizontalScroll() {
  const section = document.querySelector('.horizontal-scroll-section');
  if (!section) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = !window.matchMedia('(hover: hover)').matches;

  if (isMobile || prefersReducedMotion) {
    // Mobile: enable CSS scroll-snap, nothing to do in JS
    section.classList.add('horizontal-scroll--mobile');
    return;
  }

  const track   = section.querySelector('.horizontal-scroll__track');
  if (!track) return;

  let pinStart  = 0;
  let maxScroll = 0;
  let pinned    = false;
  let ticking   = false;

  function measure() {
    const rect = section.getBoundingClientRect();
    pinStart   = rect.top + window.scrollY;
    maxScroll  = track.scrollWidth - window.innerWidth;
  }

  function update() {
    const y = window.scrollY;

    if (y >= pinStart && y <= pinStart + maxScroll) {
      // Pin the section
      const progress = (y - pinStart) / maxScroll;
      track.style.transform = `translateX(${-progress * maxScroll}px)`;

      if (!pinned) {
        section.style.position = 'sticky';
        section.style.top      = '0';
        pinned = true;
      }
    } else {
      if (pinned && y > pinStart + maxScroll) {
        track.style.transform = `translateX(${-maxScroll}px)`;
      } else if (y < pinStart) {
        track.style.transform = 'translateX(0)';
      }
    }

    ticking = false;
  }

  // Set section height to accommodate horizontal scroll
  function setSectionHeight() {
    measure();
    // Extra scroll range equals horizontal travel
    section.style.height = `${maxScroll + window.innerHeight}px`;
  }

  setSectionHeight();

  const resizeObserver = new ResizeObserver(() => {
    setSectionHeight();
  });
  resizeObserver.observe(document.body);

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update();
}

/* ============================================================
   17. PROCESS PATH — SVG Draw on Scroll + Node Reveals
   ============================================================ */
function initProcessPath() {
  const section = document.querySelector('.process-path');
  if (!section) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const path  = section.querySelector('.process-path__line');
  const steps = Array.from(section.querySelectorAll('.process-step'));

  if (prefersReducedMotion) {
    if (path) {
      path.style.strokeDashoffset = '0';
    }
    steps.forEach(s => s.classList.add('visible'));
    return;
  }

  // Mobile: sequential fade-in via IntersectionObserver
  const isMobile = !window.matchMedia('(hover: hover)').matches;

  if (isMobile || !path) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    steps.forEach(s => observer.observe(s));
    return;
  }

  // Desktop: SVG path draw
  const totalLength = path.getTotalLength();
  path.style.strokeDasharray  = totalLength;
  path.style.strokeDashoffset = totalLength;
  path.style.transition       = 'none';

  let ticking = false;

  function update() {
    const rect     = section.getBoundingClientRect();
    const viewH    = window.innerHeight;
    const sectionH = section.offsetHeight;

    // Progress: 0 when top enters viewport, 1 at 80% of scroll range
    const rawProgress = (viewH - rect.top) / (sectionH + viewH);
    const progress = Math.min(1, Math.max(0, rawProgress / 0.80));

    path.style.strokeDashoffset = totalLength * (1 - progress);

    // Reveal steps as path passes through them
    steps.forEach((step, i) => {
      const threshold = (i + 1) / (steps.length + 1);
      if (progress >= threshold) {
        step.classList.add('visible');
      }
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update();
}

/* ============================================================
   18. GALLERY FILTER
   ============================================================ */
function initGalleryFilter() {
  const filterContainer = document.querySelector('.gallery-filter-tabs');
  const grid            = document.querySelector('.gallery-grid');
  if (!filterContainer || !grid) return;

  const tabs  = Array.from(filterContainer.querySelectorAll('[data-filter]'));
  const items = Array.from(grid.querySelectorAll('[data-category]'));

  function filter(category) {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.filter === category));

    items.forEach(item => {
      const match = category === 'all' || item.dataset.category === category;

      if (match) {
        item.style.display = '';
        // Trigger reflow then animate in
        requestAnimationFrame(() => {
          item.style.opacity   = '1';
          item.style.transform = 'scale(1)';
          item.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
        });
      } else {
        item.style.opacity    = '0';
        item.style.transform  = 'scale(0.92)';
        item.style.transition = 'opacity 0.25s ease, transform 0.25s ease';

        setTimeout(() => {
          item.style.display = 'none';
        }, 260);
      }
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filter(tab.dataset.filter);
    });
  });

  // Activate first tab
  if (tabs[0]) {
    tabs[0].click();
  }
}

/* ============================================================
   19. LIGHTBOX
   ============================================================ */
function initLightbox() {
  const grid = document.querySelector('.gallery-grid');
  if (!grid) return;

  // Build lightbox DOM
  const lb = document.createElement('div');
  lb.className   = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Galleria immagini');
  lb.innerHTML = `
    <div class="lightbox__backdrop"></div>
    <div class="lightbox__inner">
      <button class="lightbox__close" aria-label="Chiudi">&times;</button>
      <button class="lightbox__prev" aria-label="Precedente">&#8249;</button>
      <button class="lightbox__next" aria-label="Successivo">&#8250;</button>
      <div class="lightbox__img-wrap">
        <img class="lightbox__img" src="" alt="" />
      </div>
    </div>
  `;
  document.body.appendChild(lb);

  const img      = lb.querySelector('.lightbox__img');
  const closeBtn = lb.querySelector('.lightbox__close');
  const prevBtn  = lb.querySelector('.lightbox__prev');
  const nextBtn  = lb.querySelector('.lightbox__next');
  const backdrop = lb.querySelector('.lightbox__backdrop');

  let items   = [];
  let current = 0;
  let prevFocus = null;

  function getItems() {
    return Array.from(grid.querySelectorAll('[data-category]')).filter(
      item => item.style.display !== 'none'
    );
  }

  function open(index) {
    items   = getItems();
    current = index;
    prevFocus = document.activeElement;
    show(current);
    lb.classList.add('active');
    document.body.classList.add('lightbox-open');
    closeBtn.focus();
  }

  function close() {
    lb.classList.remove('active');
    document.body.classList.remove('lightbox-open');
    if (prevFocus) prevFocus.focus();
  }

  function show(index) {
    const item   = items[index];
    if (!item) return;

    const imgEl  = item.querySelector('img') || item;
    const src    = imgEl.dataset.full || imgEl.src || '';
    const alt    = imgEl.alt || '';

    img.style.opacity = '0';
    img.src           = src;
    img.alt           = alt;

    img.onload = () => {
      img.style.transition = 'opacity 0.3s ease';
      img.style.opacity    = '1';
    };

    prevBtn.style.display = items.length > 1 ? '' : 'none';
    nextBtn.style.display = items.length > 1 ? '' : 'none';
  }

  function showPrev() {
    current = (current - 1 + items.length) % items.length;
    show(current);
  }

  function showNext() {
    current = (current + 1) % items.length;
    show(current);
  }

  // Open on click
  grid.addEventListener('click', e => {
    const item = e.target.closest('[data-category]');
    if (!item) return;

    const all   = getItems();
    const index = all.indexOf(item);
    if (index >= 0) open(index);
  });

  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  prevBtn.addEventListener('click', showPrev);
  nextBtn.addEventListener('click', showNext);

  // Keyboard
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('active')) return;

    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  // Focus trap
  lb.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const focusable = Array.from(lb.querySelectorAll('button')).filter(
      b => b.style.display !== 'none'
    );
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  // Swipe on mobile
  let touchStartX = 0;

  lb.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  lb.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      dx < 0 ? showNext() : showPrev();
    }
  }, { passive: true });
}

/* ============================================================
   20. FAQ — Accordion
   ============================================================ */
function initFAQ() {
  const items = Array.from(document.querySelectorAll('.faq-item'));
  if (!items.length) return;

  function closeItem(item) {
    const body   = item.querySelector('.faq-item__body');
    const trigger = item.querySelector('.faq-item__trigger');
    if (!body) return;

    item.classList.remove('is-open');
    body.style.maxHeight = '0';
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  }

  function openItem(item) {
    const body   = item.querySelector('.faq-item__body');
    const trigger = item.querySelector('.faq-item__trigger');
    if (!body) return;

    item.classList.add('is-open');
    body.style.maxHeight = body.scrollHeight + 'px';
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
  }

  items.forEach(item => {
    const trigger = item.querySelector('.faq-item__trigger');
    if (!trigger) return;

    // Set initial ARIA state
    trigger.setAttribute('aria-expanded', 'false');
    const body = item.querySelector('.faq-item__body');
    if (body) {
      body.style.maxHeight = '0';
      body.style.overflow  = 'hidden';
      body.style.transition = 'max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
    }

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close all others
      items.forEach(other => {
        if (other !== item) closeItem(other);
      });

      // Toggle clicked
      if (isOpen) {
        closeItem(item);
      } else {
        openItem(item);
      }
    });

    // Keyboard accessibility
    trigger.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trigger.click();
      }
    });
  });
}

/* ============================================================
   21. REVIEWS SLIDER — Scroll-snap carousel
   ============================================================ */
function initReviewsSlider() {
  const slider = document.querySelector('.reviews-slider');
  if (!slider) return;

  const track  = slider.querySelector('.reviews-slider__track');
  const nav    = slider.querySelector('.reviews-slider__nav');
  if (!track) return;

  const slides    = Array.from(track.querySelectorAll('.review-card'));
  let dots        = [];
  let current     = 0;
  let pageCount   = 1;
  let autoInterval = null;
  let isDragging  = false;
  let touchStartX = 0;
  let isHovered   = false;

  function getVisibleCount() {
    const slideW  = slides[0] ? slides[0].offsetWidth : 1;
    const trackW  = track.offsetWidth;
    return Math.max(1, Math.round(trackW / slideW));
  }

  function buildDots() {
    const visible = getVisibleCount();
    const newPageCount = Math.max(1, slides.length - visible + 1);
    if (newPageCount === pageCount && dots.length === newPageCount) return;
    pageCount = newPageCount;

    // Clamp current page
    if (current >= pageCount) current = pageCount - 1;

    // Rebuild dot elements
    if (nav) {
      nav.innerHTML = '';
      dots = [];
      for (let i = 0; i < pageCount; i++) {
        const btn = document.createElement('button');
        btn.className = 'reviews-slider__dot' + (i === current ? ' active' : '');
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-label', 'Pagina ' + (i + 1));
        btn.setAttribute('aria-selected', i === current ? 'true' : 'false');
        btn.addEventListener('click', () => {
          scrollToPage(i);
          stopAuto();
          startAuto();
        });
        nav.appendChild(btn);
        dots.push(btn);
      }
    }
  }

  function updateDots(index) {
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
      dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });
  }

  function scrollToPage(index) {
    if (index < 0 || index >= pageCount) return;
    current = index;
    const slideW = slides[0].offsetWidth;
    const gap    = parseInt(getComputedStyle(track).gap) || 0;

    track.scrollTo({
      left: index * (slideW + gap),
      behavior: 'smooth'
    });

    updateDots(index);
  }

  function next() {
    scrollToPage((current + 1) % pageCount);
  }

  function startAuto() {
    stopAuto();
    autoInterval = setInterval(() => {
      if (!isHovered) next();
    }, 5000);
  }

  function stopAuto() {
    clearInterval(autoInterval);
  }

  // Pause on hover / touch
  slider.addEventListener('mouseenter', () => { isHovered = true; });
  slider.addEventListener('mouseleave', () => { isHovered = false; });

  slider.addEventListener('touchstart', () => {
    touchStartX = 0;
    stopAuto();
  }, { passive: true });

  slider.addEventListener('touchend', () => {
    startAuto();
  }, { passive: true });

  // Sync dots on native scroll (scroll-snap)
  let scrollTicking = false;
  track.addEventListener('scroll', () => {
    if (scrollTicking) return;
    requestAnimationFrame(() => {
      const slideW  = slides[0] ? slides[0].offsetWidth : 1;
      const gap     = parseInt(getComputedStyle(track).gap) || 0;
      const newIdx  = Math.min(pageCount - 1, Math.round(track.scrollLeft / (slideW + gap)));

      if (newIdx !== current) {
        current = newIdx;
        updateDots(current);
      }
      scrollTicking = false;
    });
    scrollTicking = true;
  }, { passive: true });

  // Arrow buttons (optional, if present)
  const prevBtn = slider.querySelector('.reviews-slider__prev');
  const nextBtn = slider.querySelector('.reviews-slider__next');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      scrollToPage((current - 1 + pageCount) % pageCount);
      stopAuto();
      startAuto();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      scrollToPage((current + 1) % pageCount);
      stopAuto();
      startAuto();
    });
  }

  // Build dots based on visible cards, rebuild on resize
  buildDots();
  window.addEventListener('resize', buildDots);

  updateDots(0);
  startAuto();
}
