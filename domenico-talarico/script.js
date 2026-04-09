/* === core.js === */
/**
 * JARVISWEBSITES — Core Engine
 * Always-included foundation: scroll reveal, smooth scroll,
 * copyright year, reduced motion & mobile flags.
 * Exposes: window.JW.delegate, window.JW.reducedMotion(), window.JW.isMobile()
 */

(function () {
  'use strict';

  /* ─── Reduced Motion Detection ──────────────────────────────────────── */
  var reducedMotionMQ = window.matchMedia('(prefers-reduced-motion: reduce)');

  function applyReducedMotion() {
    document.documentElement.dataset.reducedMotion = reducedMotionMQ.matches ? 'true' : 'false';
  }
  applyReducedMotion();
  reducedMotionMQ.addEventListener('change', applyReducedMotion);

  /* ─── Mobile / Touch Detection ───────────────────────────────────────── */
  function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }
  document.documentElement.dataset.mobile = isTouchDevice() ? 'true' : 'false';

  /* ─── Global JW Namespace ────────────────────────────────────────────── */
  window.JW = window.JW || {};

  /**
   * Event delegation helper.
   * @param {Element|Document} parent
   * @param {string} event
   * @param {string} selector
   * @param {Function} handler - receives (event, matchedElement)
   */
  window.JW.delegate = function (parent, event, selector, handler) {
    parent.addEventListener(event, function (e) {
      var target = e.target.closest(selector);
      if (target && parent.contains(target)) {
        handler(e, target);
      }
    });
  };

  window.JW.reducedMotion = function () {
    return document.documentElement.dataset.reducedMotion === 'true';
  };

  window.JW.isMobile = function () {
    return document.documentElement.dataset.mobile === 'true';
  };

  /* ─── DOMContentLoaded Wrapper ───────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {

    /* ── Scroll Reveal System ─────────────────────────────────────────── */
    var revealSelectors = '.reveal-up, .reveal-left, .reveal-right, .reveal-scale';
    var revealElements = document.querySelectorAll(revealSelectors);

    if (revealElements.length && !window.JW.reducedMotion()) {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      });

      revealElements.forEach(function (el) {
        revealObserver.observe(el);
      });
    } else if (revealElements.length) {
      revealElements.forEach(function (el) {
        el.classList.add('revealed');
        el.style.transitionDuration = '0ms';
      });
    }

    /* ── Smooth Scroll for Anchor Links ──────────────────────────────── */
    document.addEventListener('click', function (e) {
      var anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;

      var href = anchor.getAttribute('href');
      if (href === '#') return;

      var target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      var header = document.querySelector('[data-header]');
      var offset = header ? header.getBoundingClientRect().height : 80;
      var targetY = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({
        top: targetY,
        behavior: window.JW.reducedMotion() ? 'auto' : 'smooth'
      });
    });

    /* ── Copyright Year ───────────────────────────────────────────────── */
    var yearEls = document.querySelectorAll('[data-year]');
    var year = new Date().getFullYear();
    yearEls.forEach(function (el) {
      el.textContent = year;
    });

    /* ── Zero stagger delays under reduced motion ─────────────────────── */
    if (window.JW.reducedMotion()) {
      var staggerEls = document.querySelectorAll('[class*="stagger-"]');
      staggerEls.forEach(function (el) {
        el.style.transitionDelay = '0ms';
        el.style.animationDelay = '0ms';
      });
    }

  }); // end DOMContentLoaded

}());

/* === header.js === */
/**
 * JARVISWEBSITES — Header Module
 * Targets [data-header].
 * Sets data-scrolled="true" after 50px scroll.
 * Sets data-hidden="true" on scroll down, removes on scroll up.
 * Uses rAF + passive scroll listener.
 *
 * CSS must style via:
 *   [data-header][data-scrolled="true"] { }
 *   [data-header][data-hidden="true"] { }
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var header = document.querySelector('[data-header]');
    if (!header) return;

    var lastScrollY = window.scrollY;
    var ticking = false;
    var THRESHOLD = 50;

    function updateHeader() {
      var y = window.scrollY;

      if (y > THRESHOLD) {
        header.dataset.scrolled = 'true';
        if (y > lastScrollY) {
          header.dataset.hidden = 'true';
        } else {
          header.dataset.hidden = 'false';
        }
      } else {
        header.dataset.scrolled = 'false';
        header.dataset.hidden = 'false';
      }

      // Keep CSS variable in sync for offset calculations
      document.documentElement.style.setProperty(
        '--header-height-actual',
        header.getBoundingClientRect().height + 'px'
      );

      lastScrollY = y;
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });

    // Set initial CSS variable
    document.documentElement.style.setProperty(
      '--header-height-actual',
      header.getBoundingClientRect().height + 'px'
    );
  });

}());

/* === mobile-menu.js === */
/**
 * JARVISWEBSITES — Mobile Menu Module
 * Toggle: [data-mobile-toggle]
 * Panel:  [data-mobile-menu]
 *
 * Open state:
 *   - [data-mobile-menu][data-open="true"]
 *   - [data-mobile-toggle][aria-expanded="true"]
 *   - body[data-menu-open] → overflow: hidden via CSS
 *
 * Closes on: link click inside menu, ESC key, outside click.
 * Full focus trap when open.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.querySelector('[data-mobile-toggle]');
    var menu = document.querySelector('[data-mobile-menu]');
    if (!toggle || !menu) return;

    var isOpen = false;
    var focusableEls = [];
    var firstFocusable = null;
    var lastFocusable = null;

    var FOCUSABLE_SEL = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

    // Set initial ARIA
    if (!menu.id) menu.id = 'mobile-nav-menu';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', menu.id);
    menu.setAttribute('aria-hidden', 'true');

    function updateFocusables() {
      focusableEls = Array.from(menu.querySelectorAll(FOCUSABLE_SEL));
      firstFocusable = focusableEls[0] || null;
      lastFocusable = focusableEls[focusableEls.length - 1] || null;
    }

    function openMenu() {
      isOpen = true;
      menu.dataset.open = 'true';
      toggle.setAttribute('aria-expanded', 'true');
      menu.setAttribute('aria-hidden', 'false');
      document.body.dataset.menuOpen = '';

      updateFocusables();
      if (firstFocusable) firstFocusable.focus();
    }

    function closeMenu() {
      isOpen = false;
      menu.dataset.open = 'false';
      toggle.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
      delete document.body.dataset.menuOpen;

      toggle.focus();
    }

    toggle.addEventListener('click', function () {
      isOpen ? closeMenu() : openMenu();
    });

    // Close on link click inside menu
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });

    // ESC + focus trap
    document.addEventListener('keydown', function (e) {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        closeMenu();
        return;
      }

      if (e.key === 'Tab') {
        if (!focusableEls.length) { e.preventDefault(); return; }

        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      }
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!isOpen) return;
      if (!menu.contains(e.target) && !toggle.contains(e.target)) {
        closeMenu();
      }
    });
  });

}());

/* === preloader.js === */
/**
 * JARVISWEBSITES — Preloader Module
 * Target: [data-preloader]
 *
 * After window load + 500ms minimum:
 *   1. Sets data-exit="true" on preloader (CSS transitions it out)
 *   2. Removes element from DOM after transition ends
 *   3. Adds 'loaded' class to body
 *
 * CSS must style via:
 *   [data-preloader][data-exit="true"] { opacity: 0; transform: translateY(-100%); }
 */

(function () {
  'use strict';

  var preloader = document.querySelector('[data-preloader]');
  if (!preloader) return;

  var MIN_MS = 500;
  var startTime = Date.now();

  function hidePreloader() {
    var elapsed = Date.now() - startTime;
    var wait = Math.max(0, MIN_MS - elapsed);

    setTimeout(function () {
      preloader.dataset.exit = 'true';

      function onEnd() {
        preloader.removeEventListener('transitionend', onEnd);
        if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
        document.body.classList.add('loaded');
      }

      preloader.addEventListener('transitionend', onEnd, { once: true });

      // Fallback in case transitionend never fires
      setTimeout(function () {
        if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
        document.body.classList.add('loaded');
      }, 1000);
    }, wait);
  }

  if (document.readyState === 'complete') {
    hidePreloader();
  } else {
    window.addEventListener('load', hidePreloader, { once: true });
  }

}());

/* === form-validation.js === */
/**
 * JARVISWEBSITES — Form Validation Module
 * Target: form[data-validate]
 *
 * Validates [required] fields on blur.
 * Validates type="email" for email format.
 * Shows .form-error sibling elements.
 * Adds .error class to invalid inputs.
 * Prevents submit if errors exist.
 * On valid submit: fires normally or shows success state if data-success-message set.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var forms = document.querySelectorAll('form[data-validate]');
    if (!forms.length) return;

    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function getError(input) {
      var value = input.value.trim();

      if (input.required && !value) {
        return input.dataset.errorRequired || 'Questo campo è obbligatorio.';
      }

      if (input.type === 'email' && value && !EMAIL_RE.test(value)) {
        return input.dataset.errorEmail || 'Inserisci un indirizzo email valido.';
      }

      return null;
    }

    function showError(input, message) {
      input.classList.add('error');
      input.setAttribute('aria-invalid', 'true');

      // Look for a .form-error sibling first
      var errorEl = input.parentElement.querySelector('.form-error');

      if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.className = 'form-error';
        errorEl.setAttribute('role', 'alert');
        if (input.id) {
          errorEl.id = input.id + '-error';
          input.setAttribute('aria-describedby', errorEl.id);
        }
        input.parentNode.appendChild(errorEl);
      }

      errorEl.textContent = message;
      errorEl.style.display = 'block';
    }

    function clearError(input) {
      input.classList.remove('error');
      input.setAttribute('aria-invalid', 'false');

      var errorEl = input.parentElement.querySelector('.form-error');
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.style.display = 'none';
      }
    }

    forms.forEach(function (form) {
      var inputs = Array.from(form.querySelectorAll('input, textarea, select'));
      var validatableInputs = inputs.filter(function (input) {
        return input.required || input.type === 'email';
      });

      validatableInputs.forEach(function (input) {
        // Validate on blur
        input.addEventListener('blur', function () {
          var error = getError(input);
          error ? showError(input, error) : clearError(input);
        });

        // Clear error live as user fixes it
        input.addEventListener('input', function () {
          if (input.classList.contains('error')) {
            var error = getError(input);
            if (!error) clearError(input);
          }
        });
      });

      form.addEventListener('submit', function (e) {
        var hasErrors = false;
        var firstErrorInput = null;

        validatableInputs.forEach(function (input) {
          var error = getError(input);
          if (error) {
            showError(input, error);
            hasErrors = true;
            if (!firstErrorInput) firstErrorInput = input;
          } else {
            clearError(input);
          }
        });

        if (hasErrors) {
          e.preventDefault();
          if (firstErrorInput) firstErrorInput.focus();
          return;
        }

        // Optional success state
        var successMsg = form.dataset.successMessage;
        if (successMsg) {
          e.preventDefault();
          var successEl = form.querySelector('.form-success');
          if (!successEl) {
            successEl = document.createElement('div');
            successEl.className = 'form-success';
            successEl.setAttribute('role', 'status');
            form.appendChild(successEl);
          }
          successEl.textContent = successMsg;
          successEl.style.display = 'block';
          form.reset();
        }
      });
    });
  });

}());

/* === parallax.js === */
/**
 * JARVISWEBSITES — Parallax Module
 * Target: [data-parallax]
 *
 * Config:
 *   data-parallax="0.3" — speed factor (0 = static, 1 = full scroll speed)
 *
 * Desktop only (skip on touch devices).
 * Respects prefers-reduced-motion.
 * GPU-accelerated via transform: translateY.
 * Passive scroll + rAF.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var reducedMotion = window.JW ? window.JW.reducedMotion() : window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var isMobile = window.JW ? window.JW.isMobile() : ('ontouchstart' in window || navigator.maxTouchPoints > 0);

    if (reducedMotion || isMobile) return;

    var elements = document.querySelectorAll('[data-parallax]');
    if (!elements.length) return;

    var ticking = false;

    var items = Array.from(elements).map(function (el) {
      el.style.willChange = 'transform';
      return {
        el: el,
        speed: parseFloat(el.dataset.parallax) || 0.3
      };
    });

    function applyParallax() {
      items.forEach(function (item) {
        var rect = item.el.getBoundingClientRect();
        var centerY = rect.top + rect.height / 2;
        var viewportCenter = window.innerHeight / 2;
        var offset = (centerY - viewportCenter) * item.speed;

        item.el.style.transform = 'translateY(' + offset.toFixed(2) + 'px)';
      });

      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(applyParallax);
        ticking = true;
      }
    }, { passive: true });

    applyParallax();
  });

}());

/* === counter.js === */
/**
 * JARVISWEBSITES — Counter Module
 * Target: [data-count]
 *
 * Config:
 *   data-count="150"         — target number
 *   data-count-suffix="+"    — suffix after number
 *   data-count-prefix="€"    — prefix before number
 *   data-count-duration="2000" — duration ms (default 2000)
 *
 * Triggers via IntersectionObserver (threshold 0.3). Animates once.
 * Thousands separator uses Italian format: 10.000 not 10,000.
 * easeOutCubic easing.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    var reducedMotion = window.JW ? window.JW.reducedMotion() : window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function formatNumber(n, decimals) {
      var fixed = n.toFixed(decimals);
      if (decimals > 0) {
        var parts = fixed.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return parts.join(',');
      }
      return fixed.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    function animateCounter(el) {
      var target = parseFloat(el.dataset.count) || 0;
      var prefix = el.dataset.countPrefix || '';
      var suffix = el.dataset.countSuffix || '';
      var duration = parseInt(el.dataset.countDuration, 10) || 2000;
      var isFloat = String(el.dataset.count).includes('.');
      var decimals = isFloat ? (String(el.dataset.count).split('.')[1] || '').length : 0;

      if (reducedMotion) {
        el.textContent = prefix + formatNumber(target, decimals) + suffix;
        return;
      }

      var startTime = null;

      function tick(timestamp) {
        if (!startTime) startTime = timestamp;
        var elapsed = timestamp - startTime;
        var progress = Math.min(elapsed / duration, 1);
        var eased = easeOutCubic(progress);
        var current = target * eased;

        el.textContent = prefix + formatNumber(current, decimals) + suffix;

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = prefix + formatNumber(target, decimals) + suffix;
        }
      }

      requestAnimationFrame(tick);
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(function (el) {
      var prefix = el.dataset.countPrefix || '';
      var suffix = el.dataset.countSuffix || '';
      el.textContent = prefix + '0' + suffix;
      observer.observe(el);
    });
  });

}());

/* === carousel.js === */
/**
 * JARVISWEBSITES — Carousel Module
 * Wrapper:    [data-carousel]
 * Track:      [data-carousel-track]
 * Slides:     [data-carousel-slide]
 * Prev/Next:  [data-carousel-prev] / [data-carousel-next]
 * Dots:       [data-carousel-dots]
 *
 * Config on [data-carousel]:
 *   data-autoplay="5000"  — ms between advances
 *   data-loop="true"      — infinite loop
 *   data-fade="true"      — crossfade mode instead of slide
 *
 * Active slide: [data-carousel-slide][data-active="true"]
 * Active dot: child of [data-carousel-dots][data-active="true"]
 * Supports multiple instances. Touch/swipe, keyboard, pause-on-hover.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var carousels = document.querySelectorAll('[data-carousel]');
    if (!carousels.length) return;

    var reducedMotion = window.JW ? window.JW.reducedMotion() : window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    carousels.forEach(function (carousel) {
      var track = carousel.querySelector('[data-carousel-track]');
      if (!track) return;

      var slides = Array.from(carousel.querySelectorAll('[data-carousel-slide]'));
      if (!slides.length) return;

      var dotsContainer = carousel.querySelector('[data-carousel-dots]');
      var prevBtn = carousel.querySelector('[data-carousel-prev]');
      var nextBtn = carousel.querySelector('[data-carousel-next]');

      var autoplayMs = parseInt(carousel.dataset.autoplay, 10) || 0;
      var loop = carousel.dataset.loop === 'true';
      var fade = carousel.dataset.fade === 'true';
      var total = slides.length;

      var current = 0;
      var autoplayTimer = null;
      var touchStartX = 0;
      var touchEndX = 0;
      var isDragging = false;

      // ── Setup fade vs slide mode ──────────────────────────────────────
      if (fade) {
        slides.forEach(function (slide) {
          slide.style.position = 'absolute';
          slide.style.top = '0';
          slide.style.left = '0';
          slide.style.width = '100%';
          slide.style.transition = reducedMotion ? 'none' : 'opacity 0.5s ease';
          slide.style.opacity = '0';
        });
        track.style.position = 'relative';
      } else {
        track.style.transition = reducedMotion ? 'none' : 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
        track.style.willChange = 'transform';
      }

      // ── Build dots ────────────────────────────────────────────────────
      var dots = [];
      if (dotsContainer) {
        slides.forEach(function (_, i) {
          var dot = document.createElement('button');
          dot.setAttribute('aria-label', 'Vai alla slide ' + (i + 1));
          dot.addEventListener('click', function () { goTo(i); resetAutoplay(); });
          dotsContainer.appendChild(dot);
          dots.push(dot);
        });
      }

      function updateDots() {
        dots.forEach(function (dot, i) {
          dot.dataset.active = String(i === current);
          dot.setAttribute('aria-pressed', String(i === current));
        });
      }

      function updateSlides() {
        slides.forEach(function (slide, i) {
          var isActive = i === current;
          slide.dataset.active = String(isActive);
          slide.setAttribute('aria-hidden', String(!isActive));

          if (fade) {
            slide.style.opacity = isActive ? '1' : '0';
            slide.style.zIndex = isActive ? '1' : '0';
          }
        });
      }

      function goTo(index) {
        if (loop) {
          current = (index + total) % total;
        } else {
          current = Math.max(0, Math.min(index, total - 1));
        }

        if (!fade) {
          track.style.transform = 'translateX(-' + (current * 100) + '%)';
        }

        updateSlides();
        updateDots();

        // Update prev/next disabled state (non-loop)
        if (!loop) {
          if (prevBtn) prevBtn.disabled = current === 0;
          if (nextBtn) nextBtn.disabled = current === total - 1;
        }
      }

      function goNext() { goTo(current + 1); }
      function goPrev() { goTo(current - 1); }

      // ── Controls ──────────────────────────────────────────────────────
      if (prevBtn) prevBtn.addEventListener('click', function () { goPrev(); resetAutoplay(); });
      if (nextBtn) nextBtn.addEventListener('click', function () { goNext(); resetAutoplay(); });

      // ── Keyboard ──────────────────────────────────────────────────────
      carousel.setAttribute('tabindex', '0');
      carousel.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); resetAutoplay(); }
        if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); resetAutoplay(); }
      });

      // ── Touch / swipe ─────────────────────────────────────────────────
      track.addEventListener('touchstart', function (e) {
        touchStartX = e.touches[0].clientX;
        touchEndX = touchStartX;
        isDragging = true;
      }, { passive: true });

      track.addEventListener('touchmove', function (e) {
        if (isDragging) touchEndX = e.touches[0].clientX;
      }, { passive: true });

      track.addEventListener('touchend', function () {
        if (!isDragging) return;
        isDragging = false;
        var diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 40) {
          diff > 0 ? goNext() : goPrev();
          resetAutoplay();
        }
      });

      // ── Autoplay ──────────────────────────────────────────────────────
      function startAutoplay() {
        if (!autoplayMs || reducedMotion) return;
        autoplayTimer = setInterval(goNext, autoplayMs);
      }

      function stopAutoplay() {
        if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; }
      }

      function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
      }

      if (autoplayMs && !reducedMotion) {
        startAutoplay();
        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);
        carousel.addEventListener('focusin', stopAutoplay);
        carousel.addEventListener('focusout', startAutoplay);
      }

      // ── Init ──────────────────────────────────────────────────────────
      goTo(0);
    });
  });

}());

/* === accordion.js === */
/**
 * JARVISWEBSITES — Accordion Module
 * Wrapper:  [data-accordion]
 * Trigger:  [data-accordion-trigger] (must be <button>)
 * Body:     [data-accordion-body]
 *
 * Config:
 *   data-single="true" on wrapper → close others when one opens
 *   [data-accordion-trigger][aria-expanded="true"] → initially open
 *
 * Animation: max-height transition on [data-accordion-body].
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var accordions = document.querySelectorAll('[data-accordion]');
    if (!accordions.length) return;

    var reducedMotion = window.JW ? window.JW.reducedMotion() : window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    accordions.forEach(function (accordion) {
      var isSingle = accordion.dataset.single === 'true';
      var triggers = Array.from(accordion.querySelectorAll('[data-accordion-trigger]'));

      triggers.forEach(function (trigger, i) {
        var body = trigger.getAttribute('aria-controls')
          ? document.getElementById(trigger.getAttribute('aria-controls'))
          : trigger.closest('[data-accordion-item]')
            ? trigger.closest('[data-accordion-item]').querySelector('[data-accordion-body]')
            : trigger.parentElement.querySelector('[data-accordion-body]');

        if (!body) return;

        // Generate IDs if not present
        if (!body.id) body.id = 'accordion-body-' + i + '-' + Date.now();
        if (!trigger.id) trigger.id = 'accordion-trigger-' + i + '-' + Date.now();

        trigger.setAttribute('aria-controls', body.id);
        body.setAttribute('role', 'region');
        body.setAttribute('aria-labelledby', trigger.id);

        // Setup body for animation
        if (!reducedMotion) {
          body.style.overflow = 'hidden';
          body.style.transition = 'max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
        }

        var initiallyOpen = trigger.getAttribute('aria-expanded') === 'true';

        function open() {
          trigger.setAttribute('aria-expanded', 'true');
          if (reducedMotion) {
            body.style.maxHeight = 'none';
          } else {
            body.style.maxHeight = body.scrollHeight + 'px';
          }
        }

        function close() {
          trigger.setAttribute('aria-expanded', 'false');
          if (reducedMotion) {
            body.style.maxHeight = '0';
          } else {
            body.style.maxHeight = '0';
          }
        }

        // Set initial state
        if (initiallyOpen) {
          open();
        } else {
          trigger.setAttribute('aria-expanded', 'false');
          if (!reducedMotion) body.style.maxHeight = '0';
        }

        trigger.addEventListener('click', function () {
          var isOpen = trigger.getAttribute('aria-expanded') === 'true';

          if (isSingle && !isOpen) {
            // Close all other triggers in this accordion
            triggers.forEach(function (otherTrigger) {
              if (otherTrigger === trigger) return;
              if (otherTrigger.getAttribute('aria-expanded') !== 'true') return;

              var otherBody = otherTrigger.getAttribute('aria-controls')
                ? document.getElementById(otherTrigger.getAttribute('aria-controls'))
                : otherTrigger.closest('[data-accordion-item]')
                  ? otherTrigger.closest('[data-accordion-item]').querySelector('[data-accordion-body]')
                  : otherTrigger.parentElement.querySelector('[data-accordion-body]');

              otherTrigger.setAttribute('aria-expanded', 'false');
              if (otherBody) {
                otherBody.style.maxHeight = reducedMotion ? '0' : '0';
              }
            });
          }

          isOpen ? close() : open();
        });

        // Arrow key navigation between triggers
        trigger.addEventListener('keydown', function (e) {
          var idx = triggers.indexOf(trigger);
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            var next = triggers[idx + 1];
            if (next) next.focus();
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            var prev = triggers[idx - 1];
            if (prev) prev.focus();
          }
        });
      });
    });
  });

}());

/* === cookie-banner.js === */
/**
 * JARVISWEBSITES — Cookie Banner Module
 * Banner: [data-cookie-banner]
 * Accept: [data-cookie-accept]
 * Reject: [data-cookie-reject]
 *
 * If no consent in localStorage: shows banner by setting data-visible="true" after 1s.
 * Accept: stores in localStorage, sets data-visible="false", dispatches cookie:accepted event.
 * Reject: stores in localStorage, sets data-visible="false".
 *
 * CSS must style via:
 *   [data-cookie-banner][data-visible="true"] { transform: translateY(0); }
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var banner = document.querySelector('[data-cookie-banner]');
    if (!banner) return;

    var STORAGE_KEY = 'jw_cookie_consent';

    // Already decided — do nothing
    if (localStorage.getItem(STORAGE_KEY)) return;

    var acceptBtn = banner.querySelector('[data-cookie-accept]');
    var rejectBtn = banner.querySelector('[data-cookie-reject]');

    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-modal', 'true');
    banner.setAttribute('aria-label', 'Consenso cookie');

    function showBanner() {
      banner.dataset.visible = 'true';

      // Move focus to first focusable in banner
      var firstFocusable = banner.querySelector('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (firstFocusable) setTimeout(function () { firstFocusable.focus(); }, 100);
    }

    function hideBanner() {
      banner.dataset.visible = 'false';
    }

    if (acceptBtn) {
      acceptBtn.addEventListener('click', function () {
        localStorage.setItem(STORAGE_KEY, 'accepted');
        hideBanner();
        banner.dispatchEvent(new CustomEvent('cookie:accepted', { bubbles: true }));
      });
    }

    if (rejectBtn) {
      rejectBtn.addEventListener('click', function () {
        localStorage.setItem(STORAGE_KEY, 'rejected');
        hideBanner();
        banner.dispatchEvent(new CustomEvent('cookie:rejected', { bubbles: true }));
      });
    }

    // Show after 1s delay
    setTimeout(showBanner, 1000);
  });

}());

/* === whatsapp-widget.js === */
/**
 * JARVISWEBSITES — WhatsApp Widget Module
 * Target: [data-whatsapp]
 *
 * Config:
 *   data-phone="39XXXXXXXXXX"  — phone number (no + prefix)
 *   data-message="Ciao..."     — default message
 *
 * Shows after 300px scroll by setting data-visible="true".
 * Builds wa.me URL and sets href on inner <a> element.
 *
 * CSS must style via:
 *   [data-whatsapp][data-visible="true"] { }
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var widget = document.querySelector('[data-whatsapp]');
    if (!widget) return;

    var phone = (widget.dataset.phone || '').replace(/\D/g, '');
    var message = widget.dataset.message || '';
    var SHOW_THRESHOLD = 300;
    var ticking = false;

    // Build URL
    var waUrl = 'https://wa.me/' + phone + (message ? '?text=' + encodeURIComponent(message) : '');

    // Set href on inner <a> if present, otherwise on widget itself if it's an <a>
    var link = widget.querySelector('a') || (widget.tagName === 'A' ? widget : null);
    if (link) {
      link.href = waUrl;
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }

    widget.setAttribute('aria-label', 'Chatta con noi su WhatsApp');

    function updateVisibility() {
      widget.dataset.visible = window.scrollY > SHOW_THRESHOLD ? 'true' : 'false';
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateVisibility);
        ticking = true;
      }
    }, { passive: true });

    // Initial check
    updateVisibility();
  });

}());

/* === back-to-top.js === */
/**
 * JARVISWEBSITES — Back to Top Module
 * Target: [data-back-to-top]
 *
 * Shows after 500px scroll: sets data-visible="true".
 * Hides under 500px: sets data-visible="false".
 * Click: smooth scroll to top.
 *
 * CSS must style via:
 *   [data-back-to-top][data-visible="true"] { }
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.querySelector('[data-back-to-top]');
    if (!btn) return;

    var SHOW_THRESHOLD = 500;
    var reducedMotion = window.JW ? window.JW.reducedMotion() : window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var ticking = false;

    btn.setAttribute('aria-label', 'Torna in cima');

    function updateVisibility() {
      btn.dataset.visible = window.scrollY > SHOW_THRESHOLD ? 'true' : 'false';
      ticking = false;
    }

    btn.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: reducedMotion ? 'auto' : 'smooth'
      });
    });

    btn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateVisibility);
        ticking = true;
      }
    }, { passive: true });

    updateVisibility();
  });

}());

/* ========================================
   CUSTOM: Calcolatore Preventivo Ristrutturazione
   ======================================== */
(function() {
  'use strict';

  const PRICES = {
    'ristrutturazione-completa': { standard: [600, 900], premium: [900, 1300], luxury: [1300, 2000] },
    'rifacimento-bagno': { standard: [800, 1200], premium: [1200, 1800], luxury: [1800, 3000] },
    'costruzione-nuova': { standard: [1200, 1600], premium: [1600, 2200], luxury: [2200, 3500] },
    'cappotto-termico': { standard: [80, 120], premium: [120, 180], luxury: [180, 280] },
    'rifacimento-tetto': { standard: [150, 250], premium: [250, 400], luxury: [400, 600] },
    'facciata': { standard: [60, 100], premium: [100, 160], luxury: [160, 250] },
    'bioedilizia': { standard: [1400, 1800], premium: [1800, 2500], luxury: [2500, 4000] }
  };

  document.querySelectorAll('[data-calculator="preventivo"]').forEach(function(calculator) {
    var form = calculator.querySelector('.calculator__form');
    var result = calculator.querySelector('.calculator__result');
    if (!form || !result) return;

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var type = form.querySelector('[name="work-type"]').value;
      var sqm = parseFloat(form.querySelector('[name="square-meters"]').value);
      var quality = form.querySelector('[name="quality"]').value;

      if (!type || !sqm || !quality || sqm <= 0) {
        result.classList.remove('visible');
        return;
      }

      var priceRange = PRICES[type] && PRICES[type][quality];
      if (!priceRange) return;

      var min = Math.round(sqm * priceRange[0]);
      var max = Math.round(sqm * priceRange[1]);

      var formatter = new Intl.NumberFormat('it-IT');
      result.querySelector('.calculator__result-value').textContent = formatter.format(min) + ' - ' + formatter.format(max) + ' EUR';

      var rangeEl = result.querySelector('.calculator__result-range');
      if (rangeEl) {
        rangeEl.textContent = 'Prezzo al m\u00B2: ' + formatter.format(priceRange[0]) + ' - ' + formatter.format(priceRange[1]) + ' EUR/m\u00B2';
      }

      result.classList.add('visible');
      result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });
})();

/* ========================================
   CUSTOM: Calcolatore Bonus Fiscali 2026
   ======================================== */
(function() {
  'use strict';

  var BONUSES = {
    'ristrutturazione': [
      { name: 'Bonus Ristrutturazione', percentage: 50, maxDeduction: 96000, description: 'Detrazione IRPEF del 50% sulle spese di ristrutturazione edilizia, fino a un massimo di 96.000 EUR per unita immobiliare.' },
      { name: 'Bonus Mobili', percentage: 50, maxDeduction: 8000, description: 'Detrazione del 50% per l\'acquisto di mobili e grandi elettrodomestici destinati all\'immobile ristrutturato.' }
    ],
    'efficienza-energetica': [
      { name: 'Ecobonus', percentage: 65, maxDeduction: 100000, description: 'Detrazione fino al 65% per interventi di riqualificazione energetica globale degli edifici.' },
      { name: 'Bonus Ristrutturazione', percentage: 50, maxDeduction: 96000, description: 'In alternativa all\'Ecobonus, detrazione del 50% per lavori di ristrutturazione che includono efficientamento.' }
    ],
    'cappotto-termico': [
      { name: 'Ecobonus Involucro', percentage: 65, maxDeduction: 60000, description: 'Detrazione del 65% per interventi sull\'involucro edilizio (cappotto termico, coibentazione, infissi).' }
    ],
    'sostituzione-infissi': [
      { name: 'Ecobonus Infissi', percentage: 50, maxDeduction: 60000, description: 'Detrazione del 50% per la sostituzione di infissi e schermature solari.' }
    ],
    'impianto-riscaldamento': [
      { name: 'Ecobonus Impianti', percentage: 65, maxDeduction: 30000, description: 'Detrazione del 65% per sostituzione di impianti di climatizzazione invernale con caldaie a condensazione classe A+ o pompe di calore.' }
    ],
    'pannelli-solari': [
      { name: 'Ecobonus Solare', percentage: 65, maxDeduction: 60000, description: 'Detrazione del 65% per l\'installazione di pannelli solari per la produzione di acqua calda sanitaria.' }
    ],
    'antisismica': [
      { name: 'Sismabonus', percentage: 50, maxDeduction: 96000, description: 'Detrazione dal 50% all\'85% per interventi antisismici su edifici in zone sismiche 1, 2 e 3. La percentuale aumenta in base al miglioramento di classe sismica.' }
    ],
    'barriere-architettoniche': [
      { name: 'Bonus Barriere', percentage: 75, maxDeduction: 50000, description: 'Detrazione del 75% per interventi di eliminazione delle barriere architettoniche.' }
    ],
    'verde': [
      { name: 'Bonus Verde', percentage: 36, maxDeduction: 5000, description: 'Detrazione del 36% per la sistemazione a verde di aree scoperte, realizzazione di coperture a verde e giardini pensili.' }
    ]
  };

  document.querySelectorAll('[data-calculator="bonus"]').forEach(function(calculator) {
    var form = calculator.querySelector('.bonus__form');
    var results = calculator.querySelector('.bonus__results');
    if (!form || !results) return;

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var type = form.querySelector('[name="intervention-type"]').value;
      var cost = parseFloat(form.querySelector('[name="intervention-cost"]').value);

      if (!type || !cost || cost <= 0) {
        results.classList.remove('visible');
        return;
      }

      var bonuses = BONUSES[type];
      if (!bonuses) return;

      var formatter = new Intl.NumberFormat('it-IT');
      var itemsHtml = '';
      var totalSaving = 0;

      bonuses.forEach(function(bonus) {
        var deductibleAmount = Math.min(cost, bonus.maxDeduction);
        var saving = Math.round(deductibleAmount * bonus.percentage / 100);
        totalSaving += saving;

        itemsHtml += '<div class="bonus__result-item">' +
          '<div class="bonus__result-name">' + bonus.name + '<span class="bonus__result-percentage">' + bonus.percentage + '%</span></div>' +
          '<div class="bonus__result-detail">' + bonus.description + '</div>' +
          '<div class="bonus__result-detail">Spesa detraibile: <strong>' + formatter.format(deductibleAmount) + ' EUR</strong> | Risparmio: <span class="bonus__result-saving">' + formatter.format(saving) + ' EUR</span></div>' +
          '</div>';
      });

      results.innerHTML = itemsHtml +
        '<div class="bonus__total">' +
          '<div class="bonus__total-label">Risparmio fiscale totale stimato</div>' +
          '<div class="bonus__total-value">' + formatter.format(totalSaving) + ' EUR</div>' +
          '<div class="bonus__total-cta"><a href="contatti.html" class="btn btn--primary">Richiedi Consulenza Gratuita</a></div>' +
          '<div class="bonus__disclaimer">* I calcoli sono indicativi e basati sulla normativa vigente 2026. Per una consulenza fiscale dettagliata, contattaci per un appuntamento gratuito.</div>' +
        '</div>';

      results.classList.add('visible');
      results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });
})();
