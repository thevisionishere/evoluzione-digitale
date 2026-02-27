// ── core ────────────────────────────────────────
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

// ── header ────────────────────────────────────────
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

// ── mobile-menu ────────────────────────────────────────
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

// ── preloader ────────────────────────────────────────
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

// ── form-validation ────────────────────────────────────────
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

// ── cookie-banner ────────────────────────────────────────
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

// ── whatsapp-widget ────────────────────────────────────────
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

// ── back-to-top ────────────────────────────────────────
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

// ── carousel ────────────────────────────────────────
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

// ── counter ────────────────────────────────────────
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

// ── marquee ────────────────────────────────────────
/**
 * JARVISWEBSITES — Marquee Module
 * Target: [data-marquee]
 *
 * Config:
 *   data-speed="30"          — animation duration in seconds
 *   data-direction="left"    — scroll direction (left | right)
 *
 * Clones content for seamless loop.
 * Pauses on hover.
 * Uses CSS animation (set via JS).
 * Respects prefers-reduced-motion.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var marquees = document.querySelectorAll('[data-marquee]');
    if (!marquees.length) return;

    var reducedMotion = window.JW ? window.JW.reducedMotion() : window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Inject keyframes once
    if (!document.getElementById('jw-marquee-keyframes')) {
      var style = document.createElement('style');
      style.id = 'jw-marquee-keyframes';
      style.textContent = '@keyframes jw-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }';
      document.head.appendChild(style);
    }

    marquees.forEach(function (marquee) {
      var inner = marquee.querySelector('[data-marquee-inner]') || marquee.firstElementChild;
      if (!inner) return;

      var speed = parseInt(marquee.dataset.speed, 10) || 30;
      var direction = marquee.dataset.direction === 'right' ? 'reverse' : 'normal';

      // Wrap existing content + clone in a flex track
      var track = document.createElement('div');
      track.style.cssText = 'display:flex;width:max-content;will-change:transform;';

      // Move inner content into track
      var original = inner.cloneNode(true);
      var clone = inner.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');

      track.appendChild(original);
      track.appendChild(clone);

      // Replace inner with track
      marquee.innerHTML = '';
      marquee.style.overflow = 'hidden';
      marquee.appendChild(track);

      var animDuration = reducedMotion ? '0.01ms' : (speed + 's');
      track.style.animation = 'jw-marquee ' + animDuration + ' linear infinite';
      track.style.animationDirection = direction;

      // Pause on hover
      marquee.addEventListener('mouseenter', function () {
        track.style.animationPlayState = 'paused';
      });
      marquee.addEventListener('mouseleave', function () {
        track.style.animationPlayState = 'running';
      });

      // Pause when not visible (performance)
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          track.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
        });
      }, { threshold: 0 });

      observer.observe(marquee);
    });
  });

}());

// ── parallax ────────────────────────────────────────
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

// ── accordion ────────────────────────────────────────
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
