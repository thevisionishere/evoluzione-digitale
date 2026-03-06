/**
 * script.js — Ristorante Belvedere dal 1933
 * Premium single-page website interactions
 * Vanilla JS only — no dependencies
 */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Environment Detection ──────────────────────────────────────────────────
  const isMobile = !window.matchMedia('(hover: hover)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─── Boot Sequence ──────────────────────────────────────────────────────────
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
  initCinematic();
  initTimeline();
  initReviewsSlider();
  initFAQ();
  initGallery();


  // ══════════════════════════════════════════════════════════════════════════════
  // 1. PRELOADER — Variant A: Logo + expanding gold line → slide-up exit
  // ══════════════════════════════════════════════════════════════════════════════

  function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    const alreadyVisited = sessionStorage.getItem('belvedere-visited');
    const heroRevealEls = document.querySelectorAll('.hero .reveal-up');

    if (alreadyVisited) {
      // Skip preloader — already seen this session
      preloader.style.display = 'none';
      setTimeout(() => {
        heroRevealEls.forEach(el => el.classList.add('revealed'));
        document.dispatchEvent(new CustomEvent('preloaderComplete'));
      }, 300);
      return;
    }

    // First visit — run preloader sequence
    document.body.classList.add('preloader-active');

    const line  = preloader.querySelector('.preloader__line');
    const logo  = preloader.querySelector('.preloader__logo');

    // Phase 1: fade in logo (handled by CSS, starts immediately)
    // Phase 2: expand the gold line after 600ms
    // Phase 3: slide overlay up and reveal content after 2.0s

    const timeline = [
      { delay: 600,  fn: () => { if (line)  line.classList.add('expanded'); } },
      { delay: 2000, fn: () => { preloader.classList.add('exit'); } },
      {
        delay: 2700, fn: () => {
          preloader.style.visibility  = 'hidden';
          preloader.style.pointerEvents = 'none';
          document.body.classList.remove('preloader-active');
          heroRevealEls.forEach(el => el.classList.add('revealed'));
          document.dispatchEvent(new CustomEvent('preloaderComplete'));
          sessionStorage.setItem('belvedere-visited', '1');
        }
      }
    ];

    timeline.forEach(({ delay, fn }) => setTimeout(fn, delay));
  }


  // ══════════════════════════════════════════════════════════════════════════════
  // 2. HEADER — transparent → scrolled + hide-on-scroll-down
  // ══════════════════════════════════════════════════════════════════════════════

  function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    let lastScrollY  = window.scrollY;
    let ticking      = false;
    let menuIsOpen   = false;

    // External hook so mobile menu can tell header to pause auto-hide
    window._headerSetMenuOpen = (state) => { menuIsOpen = state; };

    const update = () => {
      const currentY = window.scrollY;
      const delta    = currentY - lastScrollY;

      // Scrolled class — background fill kicks in
      if (currentY > 50) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }

      // Auto-hide only when menu is closed
      if (!menuIsOpen) {
        if (delta > 5 && currentY > 80) {
          header.classList.add('header-hidden');
        } else if (delta < -5) {
          header.classList.remove('header-hidden');
        }
      }

      lastScrollY = currentY;
      ticking     = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
  }


  // ══════════════════════════════════════════════════════════════════════════════
  // 3. MOBILE MENU — staggered reveal, focus trap, keyboard support
  // ══════════════════════════════════════════════════════════════════════════════

  function initMobileMenu() {
    const trigger = document.getElementById('menu-toggle');
    const menu    = document.getElementById('mobile-menu');
    if (!trigger || !menu) return;

    const links    = Array.from(menu.querySelectorAll('a'));
    let isOpen     = false;
    let lastFocus  = null;

    const open = () => {
      isOpen = true;
      menu.classList.add('active');
      trigger.classList.add('active');
      trigger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      if (window._headerSetMenuOpen) window._headerSetMenuOpen(true);

      // Stagger link reveals
      links.forEach((link, i) => {
        link.style.transitionDelay = `${i * 50}ms`;
        link.classList.add('visible');
      });

      lastFocus = document.activeElement;
      // Focus first link after brief delay for animation
      setTimeout(() => { if (links[0]) links[0].focus(); }, 150);
    };

    const close = () => {
      isOpen = false;
      menu.classList.remove('active');
      trigger.classList.remove('active');
      trigger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (window._headerSetMenuOpen) window._headerSetMenuOpen(false);

      links.forEach(link => {
        link.style.transitionDelay = '';
        link.classList.remove('visible');
      });

      if (lastFocus) lastFocus.focus();
    };

    // Toggle on hamburger click
    trigger.addEventListener('click', () => {
      isOpen ? close() : open();
    });

    // Close on link click (smooth scroll handled separately)
    links.forEach(link => {
      link.addEventListener('click', () => {
        close();
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) close();
    });

    // Focus trap — cycle within menu links only
    menu.addEventListener('keydown', (e) => {
      if (!isOpen || e.key !== 'Tab' || links.length === 0) return;

      const first = links[0];
      const last  = links[links.length - 1];

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


  // ══════════════════════════════════════════════════════════════════════════════
  // 4. CUSTOM CURSOR (DESKTOP ONLY)
  //    Safe pattern: stays offscreen until first mousemove
  // ══════════════════════════════════════════════════════════════════════════════

  function initCustomCursor() {
    const dot      = document.createElement('div');
    const follower = document.createElement('div');

    dot.className      = 'cursor-dot';
    follower.className = 'cursor-follower';

    // Start offscreen — never flash at 0,0
    dot.style.cssText      = 'left:-100px;top:-100px;';
    follower.style.cssText = 'left:-100px;top:-100px;';

    document.body.appendChild(dot);
    document.body.appendChild(follower);

    let mouseX   = -100;
    let mouseY   = -100;
    let followX  = -100;
    let followY  = -100;
    let isActive = false;
    let rafId    = null;

    const lerp = (a, b, t) => a + (b - a) * t;

    const tick = () => {
      followX = lerp(followX, mouseX, 0.15);
      followY = lerp(followY, mouseY, 0.15);

      dot.style.transform      = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      follower.style.transform = `translate(${followX}px, ${followY}px) translate(-50%, -50%)`;

      rafId = requestAnimationFrame(tick);
    };

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isActive) {
        // First move — reveal cursor and start loop
        isActive = true;
        dot.style.left      = '';
        dot.style.top       = '';
        follower.style.left = '';
        follower.style.top  = '';
        followX = mouseX;
        followY = mouseY;
        document.body.classList.add('custom-cursor');
        tick();
      }
    });

    // Hover states
    const hoverTargets = 'a, button, [role="button"], input, textarea, select, label';

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverTargets)) {
        dot.classList.add('hovered');
        follower.classList.add('hovered');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverTargets)) {
        dot.classList.remove('hovered');
        follower.classList.remove('hovered');
      }
    });

    // Hide when leaving / entering viewport
    document.addEventListener('mouseleave', () => {
      dot.classList.add('hidden');
      follower.classList.add('hidden');
    });

    document.addEventListener('mouseenter', () => {
      dot.classList.remove('hidden');
      follower.classList.remove('hidden');
    });
  }


  // ══════════════════════════════════════════════════════════════════════════════
  // 5. SCROLL PROGRESS BAR — GPU-accelerated scaleX
  // ══════════════════════════════════════════════════════════════════════════════

  function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;

    let ticking = false;

    const update = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress  = docHeight > 0 ? window.scrollY / docHeight : 0;
      bar.style.transform = `scaleX(${progress})`;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
  }


  // ══════════════════════════════════════════════════════════════════════════════
  // 6. REVEAL ON SCROLL — IntersectionObserver, data-delay, hero exception
  // ══════════════════════════════════════════════════════════════════════════════

  function initRevealAnimations() {
    const elements = document.querySelectorAll('.reveal-up');

    // Reduced motion: skip all animations
    if (prefersReducedMotion) {
      elements.forEach(el => el.classList.add('revealed'));
      return;
    }

    // Hero elements: wait for preloaderComplete event, not intersection
    const heroElements    = document.querySelectorAll('.hero .reveal-up');
    const nonHeroElements = Array.from(elements).filter(el => !el.closest('.hero'));

    // Non-hero elements: standard IntersectionObserver
    if (nonHeroElements.length > 0) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el    = entry.target;
            const delay = el.dataset.delay;
            if (delay) {
              el.style.transitionDelay = `${delay}ms`;
            }
            el.classList.add('revealed');
            observer.unobserve(el);
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      });

      nonHeroElements.forEach(el => observer.observe(el));
    }

    // Hero elements: triggered by preloaderComplete
    document.addEventListener('preloaderComplete', () => {
      heroElements.forEach((el, i) => {
        const delay = el.dataset.delay || i * 100;
        el.style.transitionDelay = `${delay}ms`;
        el.classList.add('revealed');
      });
    });
  }


  // ══════════════════════════════════════════════════════════════════════════════
  // 7. COUNTER ANIMATION — easeOutCubic, data-count, data-suffix
  // ══════════════════════════════════════════════════════════════════════════════

  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (counters.length === 0) return;

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animateCounter = (el) => {
      const target   = parseFloat(el.dataset.count);
      const suffix   = el.dataset.suffix || '';
      const prefix   = el.dataset.prefix || '';
      const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
      const duration = 2000;
      let startTime  = null;

      if (prefersReducedMotion) {
        el.textContent = prefix + target.toFixed(decimals) + suffix;
        return;
      }

      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed  = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = easeOutCubic(progress);
        const current  = target * eased;

        el.textContent = prefix + current.toFixed(decimals) + suffix;

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  }


  // ══════════════════════════════════════════════════════════════════════════════
  // 8. PARALLAX (DESKTOP ONLY) — hero bg, CTA banner, brand story strip
  // ══════════════════════════════════════════════════════════════════════════════

  function initParallax() {
    if (prefersReducedMotion) return;

    const parallaxEls = document.querySelectorAll('[data-parallax]');
    if (parallaxEls.length === 0) return;

    let ticking = false;

    const update = () => {
      parallaxEls.forEach(el => {
        const rect   = el.getBoundingClientRect();
        const factor = parseFloat(el.dataset.parallax) || 0.3;

        // Only calculate when element is near viewport
        if (rect.bottom < -200 || rect.top > window.innerHeight + 200) return;

        const centerOffset = rect.top + rect.height / 2 - window.innerHeight / 2;
        const shift        = centerOffset * factor * -1;

        el.style.transform = `translateY(${shift}px)`;
      });

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });

    // Initial render
    update();
  }


  // ══════════════════════════════════════════════════════════════════════════════
  // 9. MAGNETIC BUTTONS (DESKTOP ONLY) — spring return on mouseleave
  // ══════════════════════════════════════════════════════════════════════════════

  function initMagneticButtons() {
    const buttons = document.querySelectorAll('.magnetic-btn');
    if (buttons.length === 0) return;

    const MAX_SHIFT = 12;

    buttons.forEach(btn => {
      // Read any existing CSS transform to preserve it
      const baseTransform = getComputedStyle(btn).getPropertyValue('--base-transform') || '';

      btn.addEventListener('mousemove', (e) => {
        const rect   = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width  / 2;
        const centerY = rect.top  + rect.height / 2;
        const dx      = (e.clientX - centerX) / (rect.width  / 2);
        const dy      = (e.clientY - centerY) / (rect.height / 2);
        const shiftX  = dx * MAX_SHIFT;
        const shiftY  = dy * MAX_SHIFT;

        btn.style.transform = `${baseTransform} translate(${shiftX}px, ${shiftY}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        // Spring back
        btn.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        btn.style.transform  = baseTransform || '';

        // Remove the override after spring so hover CSS works again
        setTimeout(() => {
          btn.style.transition = '';
        }, 400);
      });

      btn.addEventListener('mouseenter', () => {
        btn.style.transition = 'transform 0.1s ease-out';
      });
    });
  }


  // ══════════════════════════════════════════════════════════════════════════════
  // 10. SMOOTH SCROLL — header-offset aware, closes mobile menu
  // ══════════════════════════════════════════════════════════════════════════════

  function initSmoothScroll() {
    const header = document.getElementById('header');

    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        const headerHeight = header ? header.offsetHeight : 0;
        const targetTop    = target.getBoundingClientRect().top + window.scrollY;
        const scrollTo     = targetTop - headerHeight - 20;

        window.scrollTo({ top: scrollTo, behavior: 'smooth' });
      });
    });
  }


  // ══════════════════════════════════════════════════════════════════════════════
  // 11. ACTIVE NAV — IntersectionObserver on all #section IDs
  // ══════════════════════════════════════════════════════════════════════════════

  function initActiveNav() {
    const navLinks = document.querySelectorAll('[data-nav-link]');
    if (navLinks.length === 0) return;

    const sections = document.querySelectorAll('section[id], div[id]');
    if (sections.length === 0) return;

    const header      = document.getElementById('header');
    const headerH     = header ? header.offsetHeight : 70;
    const rootMargin  = `-${headerH + 20}px 0px -60% 0px`;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const id = entry.target.getAttribute('id');

        navLinks.forEach(link => {
          const matches = link.getAttribute('href') === `#${id}`;
          link.classList.toggle('active', matches);
        });
      });
    }, {
      threshold: 0.3,
      rootMargin
    });

    sections.forEach(section => observer.observe(section));
  }


  // ══════════════════════════════════════════════════════════════════════════════
  // 12. FORM VALIDATION — blur/submit, error state, success feedback
  // ══════════════════════════════════════════════════════════════════════════════

  function initForms() {
    const forms = document.querySelectorAll('form[data-validate]');
    if (forms.length === 0) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+]?[\d\s\-().]{7,20}$/;

    const getError = (field) => {
      const value = field.value.trim();
      const type  = field.type;
      const name  = field.name;

      if (field.required && !value) {
        return field.dataset.errorRequired || 'Questo campo è obbligatorio.';
      }
      if (type === 'email' && value && !emailRegex.test(value)) {
        return field.dataset.errorEmail || 'Inserisci un indirizzo email valido.';
      }
      if ((type === 'tel' || name === 'phone' || name === 'telefono') && value && !phoneRegex.test(value)) {
        return field.dataset.errorPhone || 'Inserisci un numero di telefono valido.';
      }
      if (field.tagName === 'SELECT' && field.required && (!value || value === '')) {
        return field.dataset.errorRequired || 'Seleziona un\'opzione.';
      }
      return null;
    };

    const showError = (field, msg) => {
      field.classList.add('error');
      field.setAttribute('aria-invalid', 'true');

      let msgEl = field.parentElement.querySelector('.field-error');
      if (!msgEl) {
        msgEl = document.createElement('span');
        msgEl.className = 'field-error';
        msgEl.setAttribute('role', 'alert');
        field.parentElement.appendChild(msgEl);
      }
      msgEl.textContent = msg;
    };

    const clearError = (field) => {
      field.classList.remove('error');
      field.removeAttribute('aria-invalid');
      const msgEl = field.parentElement.querySelector('.field-error');
      if (msgEl) msgEl.textContent = '';
    };

    forms.forEach(form => {
      const fields = Array.from(form.querySelectorAll('input, textarea, select'));

      // Blur validation
      fields.forEach(field => {
        field.addEventListener('blur', () => {
          const error = getError(field);
          if (error) showError(field, error);
          else clearError(field);
        });

        // Clear error on input
        field.addEventListener('input', () => {
          if (field.classList.contains('error')) {
            const error = getError(field);
            if (!error) clearError(field);
          }
        });
      });

      // Submit validation
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        let firstError = null;

        fields.forEach(field => {
          const error = getError(field);
          if (error) {
            showError(field, error);
            if (!firstError) firstError = field;
          } else {
            clearError(field);
          }
        });

        if (firstError) {
          const header = document.getElementById('header');
          const headerH = header ? header.offsetHeight : 70;
          const top = firstError.getBoundingClientRect().top + window.scrollY - headerH - 30;
          window.scrollTo({ top, behavior: 'smooth' });
          firstError.focus();
          return;
        }

        // No errors — show success
        const successEl = form.parentElement.querySelector('.form-success');
        if (successEl) {
          successEl.style.display = 'block';
          successEl.setAttribute('role', 'status');
        }

        form.reset();
        form.style.display = 'none';
      });
    });
  }


  // ══════════════════════════════════════════════════════════════════════════════
  // 13. DYNAMIC YEAR — [data-year] elements
  // ══════════════════════════════════════════════════════════════════════════════

  function initDynamicYear() {
    const year = new Date().getFullYear().toString();
    document.querySelectorAll('[data-current-year]').forEach(el => {
      el.textContent = year;
    });
  }


  // ══════════════════════════════════════════════════════════════════════════════
  // 14. CINEMATIC IMAGE SEQUENCE — Signature Moment 1
  //     Desktop: sticky section + scroll-driven cross-fade
  //     Mobile:  auto-playing dot-navigated carousel
  // ══════════════════════════════════════════════════════════════════════════════

  function initCinematic() {
    const section = document.getElementById('cinematic');
    if (!section) return;

    const images = section.querySelectorAll('.cinematic__img');
    if (images.length === 0) return;

    const totalImages = images.length;

    if (isMobile) {
      // ── Mobile: swipeable carousel with dots ──────────────────────────────

      let currentIndex = 0;
      let autoplayTimer = null;
      let touchStartX   = 0;
      let touchEndX     = 0;

      // Build dot indicators if not already in HTML
      let dotsContainer = section.querySelector('.cinematic__dots');
      if (!dotsContainer) {
        dotsContainer = document.createElement('div');
        dotsContainer.className = 'cinematic__dots';
        section.appendChild(dotsContainer);
      }

      if (dotsContainer.children.length === 0) {
        for (let i = 0; i < totalImages; i++) {
          const dot = document.createElement('button');
          dot.className = 'cinematic__dot';
          dot.setAttribute('aria-label', `Immagine ${i + 1}`);
          dot.dataset.index = i;
          dotsContainer.appendChild(dot);
        }
      }

      const dots = Array.from(dotsContainer.querySelectorAll('.cinematic__dot'));

      const showImage = (index) => {
        images.forEach((img, i) => {
          img.classList.toggle('active', i === index);
        });
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === index);
          dot.setAttribute('aria-pressed', i === index ? 'true' : 'false');
        });
        currentIndex = index;
      };

      const next = () => showImage((currentIndex + 1) % totalImages);
      const prev = () => showImage((currentIndex - 1 + totalImages) % totalImages);

      const startAutoplay = () => {
        autoplayTimer = setInterval(next, 4000);
      };

      const stopAutoplay = () => {
        clearInterval(autoplayTimer);
      };

      // Dot click navigation
      dots.forEach(dot => {
        dot.addEventListener('click', () => {
          stopAutoplay();
          showImage(parseInt(dot.dataset.index));
          startAutoplay();
        });
      });

      // Touch swipe
      section.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].clientX;
      }, { passive: true });

      section.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 40) {
          stopAutoplay();
          if (diff > 0) next(); else prev();
          startAutoplay();
        }
      }, { passive: true });

      showImage(0);
      if (!prefersReducedMotion) startAutoplay();

    } else {
      // ── Desktop: scroll-driven cross-fade ────────────────────────────────

      if (prefersReducedMotion) {
        // Just show all images statically
        images[0].classList.add('active');
        return;
      }

      let ticking = false;

      const update = () => {
        const rect        = section.getBoundingClientRect();
        const sectionH    = section.offsetHeight;
        const winH        = window.innerHeight;

        // Progress 0→1 through the scrollable height of the section
        // The section should be taller than the viewport (handled by CSS: e.g. height: 400vh)
        // scrollProgress = how far we've scrolled through it
        const scrolled    = -rect.top;             // pixels scrolled past section top
        const scrollRange = sectionH - winH;       // total scrollable range
        const progress    = Math.max(0, Math.min(1, scrolled / scrollRange));

        // Divide progress evenly across images
        // activeFloat ranges from 0 to totalImages-1
        const activeFloat = progress * (totalImages - 1);
        const activeIndex = Math.floor(activeFloat);
        const fadeAmount  = activeFloat - activeIndex;  // 0→1 between transitions

        images.forEach((img, i) => {
          if (i < activeIndex) {
            // Already passed
            img.style.opacity = '0';
            img.style.zIndex  = '1';
          } else if (i === activeIndex) {
            // Current — fading out
            img.style.opacity = String(1 - fadeAmount);
            img.style.zIndex  = '2';
          } else if (i === activeIndex + 1) {
            // Next — fading in
            img.style.opacity = String(fadeAmount);
            img.style.zIndex  = '2';
          } else {
            // Not yet reached
            img.style.opacity = '0';
            img.style.zIndex  = '1';
          }
        });

        ticking = false;
      };

      window.addEventListener('scroll', () => {
        if (!ticking) {
          requestAnimationFrame(update);
          ticking = true;
        }
      }, { passive: true });

      // Initial render
      update();
    }
  }


  // ══════════════════════════════════════════════════════════════════════════════
  // 15. SCROLL-TRIGGERED TIMELINE — Signature Moment 2
  //     Self-drawing center line + progressive node reveal
  // ══════════════════════════════════════════════════════════════════════════════

  function initTimeline() {
    const timeline = document.getElementById('timeline');
    if (!timeline) return;

    const line  = timeline.querySelector('.timeline__line');
    const nodes = Array.from(timeline.querySelectorAll('.timeline__node'));
    const items = Array.from(timeline.querySelectorAll('.timeline__item'));

    // ── Item & node visibility via IntersectionObserver (works on all devices) ──
    if (items.length > 0) {
      const itemObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Also activate the node inside this item
            const node = entry.target.querySelector('.timeline__node');
            if (node) node.classList.add('visible');
            itemObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

      items.forEach(item => itemObserver.observe(item));
    }

    // ── Line drawing animation (desktop only, scroll-driven) ──
    if (!isMobile && !prefersReducedMotion && line) {
      let ticking = false;

      const updateLine = () => {
        const rect   = timeline.getBoundingClientRect();
        const winH   = window.innerHeight;
        const totalH = timeline.offsetHeight;

        const triggerPoint = winH * 0.75;
        const scrolled     = triggerPoint - rect.top;
        const progress     = Math.max(0, Math.min(1, scrolled / totalH));

        line.style.transform = `translateX(-50%) scaleY(${progress})`;
        ticking = false;
      };

      window.addEventListener('scroll', () => {
        if (!ticking) {
          requestAnimationFrame(updateLine);
          ticking = true;
        }
      }, { passive: true });

      updateLine();
    }
  }


  // ══════════════════════════════════════════════════════════════════════════════
  // 16. REVIEWS SLIDER — scroll-snap + prev/next + dot indicators + touch
  // ══════════════════════════════════════════════════════════════════════════════

  function initReviewsSlider() {
    const slider   = document.getElementById('reviews-slider');
    if (!slider) return;

    const track    = slider.querySelector('.reviews__track');
    const cards    = Array.from(slider.querySelectorAll('.review-card'));
    const prevBtn  = slider.querySelector('.reviews__prev');
    const nextBtn  = slider.querySelector('.reviews__next');
    const dotsWrap = slider.querySelector('.reviews__dots');

    if (!track || cards.length === 0) return;

    // Build dot indicators if container exists but is empty
    let dots = [];
    if (dotsWrap) {
      if (dotsWrap.children.length === 0) {
        cards.forEach((_, i) => {
          const dot = document.createElement('button');
          dot.className = 'reviews__dot';
          dot.setAttribute('aria-label', `Recensione ${i + 1}`);
          dotsWrap.appendChild(dot);
        });
      }
      dots = Array.from(dotsWrap.querySelectorAll('.reviews__dot'));
    }

    let currentIndex = 0;

    const getCardWidth = () => {
      if (cards.length === 0) return 0;
      const style = getComputedStyle(cards[0]);
      return cards[0].offsetWidth + parseInt(style.marginRight || 0) + parseInt(style.marginLeft || 0);
    };

    const scrollToIndex = (index) => {
      const clampedIndex = Math.max(0, Math.min(index, cards.length - 1));
      const cardWidth    = getCardWidth();
      track.scrollTo({ left: clampedIndex * cardWidth, behavior: 'smooth' });
      currentIndex = clampedIndex;
      updateDots();
    };

    const updateDots = () => {
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
        dot.setAttribute('aria-pressed', i === currentIndex ? 'true' : 'false');
      });
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => scrollToIndex(currentIndex - 1));
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => scrollToIndex(currentIndex + 1));
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => scrollToIndex(i));
    });

    // Sync dots to native scroll-snap (user drag)
    let scrollTimer = null;
    track.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const cardWidth = getCardWidth();
        if (cardWidth > 0) {
          currentIndex = Math.round(track.scrollLeft / cardWidth);
          updateDots();
        }
      }, 80);
    }, { passive: true });

    // Touch swipe (supplemental — CSS scroll-snap handles most of it)
    let touchStartX = 0;

    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) scrollToIndex(currentIndex + 1);
        else scrollToIndex(currentIndex - 1);
      }
    }, { passive: true });

    updateDots();
  }


  // ══════════════════════════════════════════════════════════════════════════════
  // 17. FAQ ACCORDION — single-open, animated max-height, ARIA
  // ══════════════════════════════════════════════════════════════════════════════

  function initFAQ() {
    const faqSection = document.getElementById('faq');
    if (!faqSection) return;

    const items = Array.from(faqSection.querySelectorAll('.faq__item'));
    if (items.length === 0) return;

    const closeItem = (item) => {
      const btn    = item.querySelector('.faq__question');
      const answer = item.querySelector('.faq__answer');

      item.classList.remove('active');
      if (btn)    btn.setAttribute('aria-expanded', 'false');
      if (answer) answer.style.maxHeight = '0';
    };

    const openItem = (item) => {
      const btn    = item.querySelector('.faq__question');
      const answer = item.querySelector('.faq__answer');

      item.classList.add('active');
      if (btn)    btn.setAttribute('aria-expanded', 'true');
      if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
    };

    items.forEach(item => {
      const question = item.querySelector('.faq__question');
      if (!question) return;

      // Initial ARIA state
      question.setAttribute('aria-expanded', 'false');

      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');

        // Close all items first
        items.forEach(closeItem);

        // If it wasn't open, open it now
        if (!isOpen) openItem(item);
      });

      question.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          question.click();
        }
      });
    });
  }


  // ══════════════════════════════════════════════════════════════════════════════
  // 18. GALLERY — hover overlay reveal + optional lightbox
  // ══════════════════════════════════════════════════════════════════════════════

  function initGallery() {
    // HTML uses id="galleria" (Italian, matching nav anchor #galleria)
    const gallery = document.getElementById('galleria');
    if (!gallery) return;

    const items = gallery.querySelectorAll('.gallery__item');
    if (items.length === 0) return;

    // Mobile: tap to toggle overlay (since no hover)
    if (isMobile) {
      items.forEach(item => {
        item.addEventListener('click', () => {
          const isActive = item.classList.contains('overlay-visible');
          // Close all others
          items.forEach(i => i.classList.remove('overlay-visible'));
          if (!isActive) item.classList.add('overlay-visible');
        });
      });
    }

    // Optional lightbox — only init if .lightbox element exists in HTML
    const lightbox     = document.getElementById('lightbox');
    const lightboxImg  = lightbox ? lightbox.querySelector('.lightbox__img') : null;
    const lightboxClose = lightbox ? lightbox.querySelector('.lightbox__close') : null;

    if (!lightbox || !lightboxImg) return;

    const openLightbox = (src, alt) => {
      lightboxImg.src = src;
      lightboxImg.alt = alt || '';
      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    items.forEach(item => {
      const trigger = item.querySelector('[data-lightbox]');
      if (!trigger) return;

      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const src = trigger.dataset.lightbox || trigger.src || trigger.querySelector('img')?.src;
        const alt = trigger.dataset.alt || trigger.alt || '';
        if (src) openLightbox(src, alt);
      });

      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          trigger.click();
        }
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }


}); // end DOMContentLoaded
