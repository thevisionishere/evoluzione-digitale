/* ── core ──────────────────────────────────────────────────────────────── */
/**
 * JARVISWEBSITES — Core Engine
 * Always-included foundation: scroll reveal, smooth scroll,
 * active nav detection, copyright year, reduced motion & mobile flags.
 */

(function () {
  'use strict';

  /* ─── Reduced Motion Detection ──────────────────────────────────────── */
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  function applyReducedMotion() {
    document.documentElement.dataset.reducedMotion = reducedMotion.matches ? 'true' : 'false';
  }
  applyReducedMotion();
  reducedMotion.addEventListener('change', applyReducedMotion);

  /* ─── Mobile / Touch Detection ───────────────────────────────────────── */
  function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }
  document.documentElement.dataset.mobile = isTouchDevice() ? 'true' : 'false';

  /* ─── Event Delegation Helper ────────────────────────────────────────── */
  /**
   * Attach a delegated event listener.
   * @param {Element|Document} parent  - The element to attach the listener to
   * @param {string}           event   - Event type (e.g. 'click')
   * @param {string}           selector - CSS selector for target matching
   * @param {Function}         handler  - Callback receives (event, matchedElement)
   */
  window.JW = window.JW || {};
  window.JW.delegate = function (parent, event, selector, handler) {
    parent.addEventListener(event, function (e) {
      const target = e.target.closest(selector);
      if (target && parent.contains(target)) {
        handler(e, target);
      }
    });
  };

  /* ─── Expose reducedMotion flag helper ───────────────────────────────── */
  window.JW.reducedMotion = function () {
    return document.documentElement.dataset.reducedMotion === 'true';
  };

  window.JW.isMobile = function () {
    return document.documentElement.dataset.mobile === 'true';
  };

  /* ─── DOMContentLoaded Wrapper ───────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {

    /* ── Scroll Reveal System ─────────────────────────────────────────── */
    const revealSelectors = '.reveal-up, .reveal-left, .reveal-right, .reveal-scale';
    const revealElements = document.querySelectorAll(revealSelectors);

    if (revealElements.length && !window.JW.reducedMotion()) {
      const revealObserver = new IntersectionObserver(function (entries) {
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
      // Reduced motion: reveal immediately without animation
      revealElements.forEach(function (el) {
        el.classList.add('revealed');
        el.style.transitionDuration = '0ms';
      });
    }

    /* ── Smooth Scroll for Anchor Links ──────────────────────────────── */
    const SCROLL_OFFSET = 80; // matches --header-height default

    document.addEventListener('click', function (e) {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const header = document.querySelector('header, .site-header, [data-header]');
      const offset = header ? header.getBoundingClientRect().height : SCROLL_OFFSET;
      const targetY = target.getBoundingClientRect().top + window.scrollY - offset;

      if (window.JW.reducedMotion()) {
        window.scrollTo({ top: targetY });
      } else {
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    });

    /* ── Active Nav Link Detection ───────────────────────────────────── */
    // Highlights the nav link whose href matches the current page path
    const navLinks = document.querySelectorAll('nav a, .nav a, [data-nav] a');
    if (navLinks.length) {
      const currentPath = window.location.pathname.replace(/\/$/, '') || '/';

      navLinks.forEach(function (link) {
        const linkPath = link.getAttribute('href') || '';
        const normalised = linkPath.replace(/\/$/, '') || '/';

        // Exact match or index page
        if (normalised === currentPath || (currentPath === '/' && normalised === '/index.html')) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        }

        // Partial match for section-based sub-pages (skip root href)
        if (normalised !== '/' && normalised !== '' && currentPath.startsWith(normalised)) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        }
      });
    }

    /* ── Dynamic Copyright Year ──────────────────────────────────────── */
    const yearEls = document.querySelectorAll('[data-year], .copyright-year');
    const year = new Date().getFullYear();
    yearEls.forEach(function (el) {
      el.textContent = year;
    });

    /* ── Stagger Delay Support (via CSS classes) ─────────────────────── */
    // Stagger classes are handled in CSS (.stagger-1 through .stagger-8).
    // The JS layer ensures stagger delays are zeroed under reduced motion.
    if (window.JW.reducedMotion()) {
      const staggerEls = document.querySelectorAll('[class*="stagger-"]');
      staggerEls.forEach(function (el) {
        el.style.transitionDelay = '0ms';
        el.style.animationDelay = '0ms';
      });
    }

  }); // end DOMContentLoaded

}());

/* ── header ────────────────────────────────────────────────────────────── */
/**
 * JARVISWEBSITES — Header Module
 * Auto-hide on scroll down, show on scroll up.
 * Adds .header--scrolled class after 50px scroll.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const header = document.querySelector('header, .site-header, [data-header]');
    if (!header) return;

    let lastScrollY = window.scrollY;
    let ticking = false;
    const SHRINK_THRESHOLD = 50;

    function updateHeader() {
      const currentScrollY = window.scrollY;

      // Scrolled state (shrink)
      if (currentScrollY > SHRINK_THRESHOLD) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
        header.classList.remove('header--hidden');
        lastScrollY = currentScrollY;
        ticking = false;
        return;
      }

      // Hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > SHRINK_THRESHOLD) {
        // Scrolling down
        header.classList.add('header--hidden');
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        header.classList.remove('header--hidden');
      }

      // Update CSS variable so other modules can reference actual header height
      const headerHeight = header.getBoundingClientRect().height;
      document.documentElement.style.setProperty('--header-height-actual', headerHeight + 'px');

      lastScrollY = currentScrollY;
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });

    // Set initial header height variable
    const initialHeight = header.getBoundingClientRect().height;
    document.documentElement.style.setProperty('--header-height-actual', initialHeight + 'px');
  });

}());

/* ── mobile-menu ───────────────────────────────────────────────────────── */
/**
 * JARVISWEBSITES — Mobile Menu Module
 * Toggles mobile menu with hamburger button, handles close states,
 * body scroll lock, focus trap, and full accessibility.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.mobile-menu, .nav-mobile, [data-mobile-menu]');
    if (!toggle || !menu) return;

    let isOpen = false;
    let focusableEls = [];
    let firstFocusable = null;
    let lastFocusable = null;

    const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

    function updateFocusables() {
      focusableEls = Array.from(menu.querySelectorAll(FOCUSABLE));
      firstFocusable = focusableEls[0] || null;
      lastFocusable = focusableEls[focusableEls.length - 1] || null;
    }

    function openMenu() {
      isOpen = true;
      document.body.classList.add('menu-open');
      menu.classList.add('is-open');
      toggle.classList.add('is-active');
      toggle.setAttribute('aria-expanded', 'true');
      menu.setAttribute('aria-hidden', 'false');

      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      updateFocusables();
      if (firstFocusable) firstFocusable.focus();
    }

    function closeMenu() {
      isOpen = false;
      document.body.classList.remove('menu-open');
      menu.classList.remove('is-open');
      toggle.classList.remove('is-active');
      toggle.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');

      // Restore body scroll
      document.body.style.overflow = '';

      toggle.focus();
    }

    // Set initial ARIA state
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', menu.id || 'mobile-menu');
    if (!menu.id) menu.id = 'mobile-menu';
    menu.setAttribute('aria-hidden', 'true');

    // Toggle on button click
    toggle.addEventListener('click', function () {
      isOpen ? closeMenu() : openMenu();
    });

    // Close on nav link click
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        closeMenu();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        closeMenu();
        return;
      }

      // Focus trap within menu
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

    // Close on outside click (not on toggle or menu itself)
    document.addEventListener('click', function (e) {
      if (!isOpen) return;
      if (!menu.contains(e.target) && !toggle.contains(e.target)) {
        closeMenu();
      }
    });
  });

}());

/* ── preloader ─────────────────────────────────────────────────────────── */
/**
 * JARVISWEBSITES — Preloader Module
 * Fades out .preloader after window load with a minimum display time.
 * Removes element from DOM after transition and sets body.loaded class.
 */

(function () {
  'use strict';

  const preloader = document.querySelector('.preloader');
  if (!preloader) return;

  const MIN_DISPLAY_MS = 500;
  const startTime = Date.now();

  function hidePreloader() {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);

    setTimeout(function () {
      preloader.style.transition = 'opacity 0.5s ease';
      preloader.style.opacity = '0';

      document.body.classList.add('loaded');

      preloader.addEventListener('transitionend', function onEnd() {
        preloader.removeEventListener('transitionend', onEnd);
        if (preloader.parentNode) {
          preloader.parentNode.removeChild(preloader);
        }
      }, { once: true });

      // Fallback removal in case transitionend doesn't fire
      setTimeout(function () {
        if (preloader.parentNode) {
          preloader.parentNode.removeChild(preloader);
        }
      }, 700);
    }, remaining);
  }

  if (document.readyState === 'complete') {
    hidePreloader();
  } else {
    window.addEventListener('load', hidePreloader, { once: true });
  }

}());

/* ── form-validation ───────────────────────────────────────────────────── */
/**
 * JARVISWEBSITES — Form Validation Module
 * Real-time blur validation for .form-input and .form-textarea with [required].
 * Supports: required, email, phone, min length, custom via data-validate.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const forms = document.querySelectorAll('form[data-validate-form], .form--validated');
    if (!forms.length) return;

    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const PHONE_RE = /^[+]?[\d\s\-().]{7,20}$/;

    function getError(input) {
      const value = input.value.trim();
      const rules = (input.dataset.validate || '').split('|').filter(Boolean);

      if (input.required && !value) {
        return input.dataset.errorRequired || 'This field is required.';
      }

      for (const rule of rules) {
        if (rule === 'email' && value && !EMAIL_RE.test(value)) {
          return input.dataset.errorEmail || 'Please enter a valid email address.';
        }
        if (rule === 'phone' && value && !PHONE_RE.test(value)) {
          return input.dataset.errorPhone || 'Please enter a valid phone number.';
        }
        if (rule.startsWith('min:')) {
          const min = parseInt(rule.split(':')[1], 10);
          if (value && value.length < min) {
            return input.dataset.errorMin || 'Please enter at least ' + min + ' characters.';
          }
        }
      }

      return null;
    }

    function showError(input, message) {
      input.classList.add('error');
      input.setAttribute('aria-invalid', 'true');

      let errorEl = document.getElementById(input.id + '-error');
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
      errorEl.classList.add('visible');
    }

    function clearError(input) {
      input.classList.remove('error');
      input.setAttribute('aria-invalid', 'false');

      const errorEl = document.getElementById(input.id + '-error');
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.remove('visible');
      }
    }

    forms.forEach(function (form) {
      const inputs = form.querySelectorAll('.form-input[required], .form-textarea[required], .form-input[data-validate], .form-textarea[data-validate]');

      // Real-time validation on blur
      inputs.forEach(function (input) {
        input.addEventListener('blur', function () {
          const error = getError(input);
          error ? showError(input, error) : clearError(input);
        });

        // Clear error on input
        input.addEventListener('input', function () {
          if (input.classList.contains('error')) {
            const error = getError(input);
            if (!error) clearError(input);
          }
        });
      });

      // Submit handler
      form.addEventListener('submit', function (e) {
        let hasErrors = false;
        let firstErrorInput = null;

        inputs.forEach(function (input) {
          const error = getError(input);
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

        // Optional: show success message if data-success-message is set
        const successMsg = form.dataset.successMessage;
        if (successMsg) {
          e.preventDefault();
          let successEl = form.querySelector('.form-success');
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

/* ── cookie-banner ─────────────────────────────────────────────────────── */
/**
 * JARVISWEBSITES — Cookie Banner Module
 * Shows .cookie-banner if no consent stored. Slides up from bottom.
 * Accept/reject stored in localStorage. Focus trap when visible.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const banner = document.querySelector('.cookie-banner');
    if (!banner) return;

    const STORAGE_KEY = 'jw_cookie_consent';

    // Already decided — do nothing
    if (localStorage.getItem(STORAGE_KEY)) return;

    const acceptBtn = banner.querySelector('.cookie-accept, [data-cookie-accept]');
    const rejectBtn = banner.querySelector('.cookie-reject, [data-cookie-reject]');

    const FOCUSABLE = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';
    let focusableEls = [];
    let firstFocusable = null;
    let lastFocusable = null;

    function showBanner() {
      banner.removeAttribute('hidden');
      banner.setAttribute('role', 'dialog');
      banner.setAttribute('aria-modal', 'true');
      banner.setAttribute('aria-label', 'Cookie consent');

      // Animate in
      requestAnimationFrame(function () {
        banner.classList.add('is-visible');
      });

      focusableEls = Array.from(banner.querySelectorAll(FOCUSABLE));
      firstFocusable = focusableEls[0] || null;
      lastFocusable = focusableEls[focusableEls.length - 1] || null;

      if (firstFocusable) setTimeout(function () { firstFocusable.focus(); }, 100);

      // Focus trap
      document.addEventListener('keydown', trapFocus);
    }

    function hideBanner() {
      banner.classList.remove('is-visible');
      document.removeEventListener('keydown', trapFocus);

      banner.addEventListener('transitionend', function onEnd() {
        banner.removeEventListener('transitionend', onEnd);
        banner.setAttribute('hidden', '');
      }, { once: true });
    }

    function trapFocus(e) {
      if (e.key !== 'Tab' || !focusableEls.length) return;

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

    if (acceptBtn) {
      acceptBtn.addEventListener('click', function () {
        localStorage.setItem(STORAGE_KEY, 'accepted');
        banner.dispatchEvent(new CustomEvent('cookie:accepted', { bubbles: true }));
        hideBanner();
      });
    }

    if (rejectBtn) {
      rejectBtn.addEventListener('click', function () {
        localStorage.setItem(STORAGE_KEY, 'rejected');
        banner.dispatchEvent(new CustomEvent('cookie:rejected', { bubbles: true }));
        hideBanner();
      });
    }

    // Show after short delay
    setTimeout(showBanner, 800);
  });

}());

/* ── whatsapp-widget ───────────────────────────────────────────────────── */
/**
 * JARVISWEBSITES — WhatsApp Widget Module
 * Floating button (.whatsapp-float) visible after 300px scroll.
 * Reads data-phone and data-message attributes for the wa.me link.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const widget = document.querySelector('.whatsapp-float');
    if (!widget) return;

    const phone = widget.dataset.phone || '';
    const message = widget.dataset.message || '';
    const SHOW_THRESHOLD = 300;
    let hasAppeared = false;
    let ticking = false;

    // Build wa.me URL
    const waUrl = 'https://wa.me/' + phone.replace(/\D/g, '') +
      (message ? '?text=' + encodeURIComponent(message) : '');

    // If widget is a link, set href; otherwise wrap or handle click
    if (widget.tagName === 'A') {
      widget.href = waUrl;
      widget.setAttribute('target', '_blank');
      widget.setAttribute('rel', 'noopener noreferrer');
    } else {
      widget.setAttribute('role', 'link');
      widget.setAttribute('tabindex', '0');
      widget.addEventListener('click', function () { window.open(waUrl, '_blank', 'noopener'); });
      widget.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.open(waUrl, '_blank', 'noopener');
        }
      });
    }

    widget.setAttribute('aria-label', 'Chat with us on WhatsApp');

    function updateVisibility() {
      if (window.scrollY > SHOW_THRESHOLD) {
        widget.classList.add('is-visible');

        if (!hasAppeared) {
          hasAppeared = true;
          widget.classList.add('pulse-once');
          widget.addEventListener('animationend', function () {
            widget.classList.remove('pulse-once');
          }, { once: true });
        }
      } else {
        widget.classList.remove('is-visible');
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateVisibility);
        ticking = true;
      }
    }, { passive: true });

    // Run once on load
    updateVisibility();
  });

}());

/* ── back-to-top ───────────────────────────────────────────────────────── */
/**
 * JARVISWEBSITES — Back to Top Module
 * Shows .back-to-top button after 500px scroll.
 * Smooth scroll to top on click. Accessible.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    const SHOW_THRESHOLD = 500;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let ticking = false;

    btn.setAttribute('aria-label', 'Back to top');

    function updateVisibility() {
      if (window.scrollY > SHOW_THRESHOLD) {
        btn.classList.add('is-visible');
      } else {
        btn.classList.remove('is-visible');
      }
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

    // Initial state
    updateVisibility();
  });

}());

/* ── marquee ───────────────────────────────────────────────────────────── */
/**
 * JARVISWEBSITES — Marquee Module
 * Infinite scrolling text for .marquee elements.
 * Clones content for seamless loop. Pauses on hover.
 * Supports data-speed and data-direction="left|right".
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const marquees = document.querySelectorAll('.marquee');
    if (!marquees.length) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    marquees.forEach(function (marquee) {
      const inner = marquee.querySelector('.marquee__inner');
      if (!inner) return;

      const speed = marquee.dataset.speed || '30s';
      const direction = marquee.dataset.direction === 'right' ? 'reverse' : 'normal';

      // Clone inner content for seamless loop
      const clone = inner.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      marquee.appendChild(clone);

      // Apply animation
      const animDuration = reducedMotion ? '0.01ms' : speed;

      [inner, clone].forEach(function (el) {
        el.style.animation = 'marquee-scroll ' + animDuration + ' linear infinite';
        el.style.animationDirection = direction;
        el.style.willChange = 'transform';
      });

      // Pause on hover (desktop)
      marquee.addEventListener('mouseenter', function () {
        inner.style.animationPlayState = 'paused';
        clone.style.animationPlayState = 'paused';
      });

      marquee.addEventListener('mouseleave', function () {
        inner.style.animationPlayState = 'running';
        clone.style.animationPlayState = 'running';
      });

      // Pause when not in viewport (performance)
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          const state = entry.isIntersecting ? 'running' : 'paused';
          inner.style.animationPlayState = state;
          clone.style.animationPlayState = state;
        });
      }, { threshold: 0 });

      observer.observe(marquee);
    });

    // Inject keyframes if not already present
    if (!document.getElementById('jw-marquee-keyframes')) {
      const style = document.createElement('style');
      style.id = 'jw-marquee-keyframes';
      style.textContent = '@keyframes marquee-scroll { from { transform: translateX(0); } to { transform: translateX(-100%); } }';
      document.head.appendChild(style);
    }
  });

}());

/* ── carousel ──────────────────────────────────────────────────────────── */
/**
 * JARVISWEBSITES — Carousel Module
 * Generic carousel with dots, arrows, touch/swipe, autoplay, and infinite loop.
 * Supports multiple instances via .carousel class.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const carousels = document.querySelectorAll('.carousel');
    if (!carousels.length) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    carousels.forEach(function (carousel) {
      const track = carousel.querySelector('.carousel__track');
      if (!track) return;

      const slides = Array.from(track.querySelectorAll('.carousel__slide'));
      if (!slides.length) return;

      const dotsContainer = carousel.querySelector('.carousel__dots');
      const prevBtn = carousel.querySelector('.carousel__prev');
      const nextBtn = carousel.querySelector('.carousel__next');
      const autoplayMs = parseInt(carousel.dataset.autoplay, 10) || 0;
      const total = slides.length;

      let current = 0;
      let autoplayTimer = null;
      let touchStartX = 0;
      let touchEndX = 0;
      let isDragging = false;

      // Set transition speed
      track.style.transition = reducedMotion
        ? 'none'
        : 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';

      // Build dot indicators
      let dots = [];
      if (dotsContainer) {
        slides.forEach(function (_, i) {
          const dot = document.createElement('button');
          dot.className = 'carousel__dot';
          dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
          dot.addEventListener('click', function () { goTo(i); });
          dotsContainer.appendChild(dot);
          dots.push(dot);
        });
      }

      function updateDots() {
        dots.forEach(function (dot, i) {
          dot.classList.toggle('is-active', i === current);
          dot.setAttribute('aria-pressed', String(i === current));
        });
      }

      function updateAriaSlides() {
        slides.forEach(function (slide, i) {
          slide.setAttribute('aria-hidden', String(i !== current));
        });
      }

      function goTo(index) {
        current = (index + total) % total;
        track.style.transform = 'translateX(-' + (current * 100) + '%)';
        updateDots();
        updateAriaSlides();
      }

      function goNext() { goTo(current + 1); }
      function goPrev() { goTo(current - 1); }

      // Arrow buttons
      if (prevBtn) prevBtn.addEventListener('click', function () { goPrev(); resetAutoplay(); });
      if (nextBtn) nextBtn.addEventListener('click', function () { goNext(); resetAutoplay(); });

      // Keyboard navigation
      carousel.setAttribute('tabindex', '0');
      carousel.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') { goPrev(); resetAutoplay(); }
        if (e.key === 'ArrowRight') { goNext(); resetAutoplay(); }
      });

      // Touch / swipe support
      track.addEventListener('touchstart', function (e) {
        touchStartX = e.touches[0].clientX;
        isDragging = true;
      }, { passive: true });

      track.addEventListener('touchmove', function (e) {
        if (!isDragging) return;
        touchEndX = e.touches[0].clientX;
      }, { passive: true });

      track.addEventListener('touchend', function () {
        if (!isDragging) return;
        isDragging = false;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 40) {
          diff > 0 ? goNext() : goPrev();
          resetAutoplay();
        }
      });

      // Autoplay
      function startAutoplay() {
        if (!autoplayMs) return;
        autoplayTimer = setInterval(goNext, autoplayMs);
      }

      function stopAutoplay() {
        if (autoplayTimer) clearInterval(autoplayTimer);
        autoplayTimer = null;
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

      // Initial state
      goTo(0);
    });
  });

}());

/* ── accordion ─────────────────────────────────────────────────────────── */
/**
 * JARVISWEBSITES — Accordion Module
 * Expand/collapse with smooth max-height animation.
 * Optional data-single="true" to allow only one open item per group.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const accordions = document.querySelectorAll('.accordion');
    if (!accordions.length) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    accordions.forEach(function (accordion) {
      const isSingle = accordion.dataset.single === 'true';
      const items = Array.from(accordion.querySelectorAll('.accordion__item'));

      items.forEach(function (item, i) {
        const trigger = item.querySelector('.accordion__trigger');
        const content = item.querySelector('.accordion__content');
        if (!trigger || !content) return;

        const contentId = 'accordion-content-' + i + '-' + Date.now();
        const triggerId = 'accordion-trigger-' + i + '-' + Date.now();

        trigger.setAttribute('id', triggerId);
        trigger.setAttribute('aria-expanded', 'false');
        trigger.setAttribute('aria-controls', contentId);

        content.setAttribute('id', contentId);
        content.setAttribute('role', 'region');
        content.setAttribute('aria-labelledby', triggerId);

        if (!reducedMotion) {
          content.style.maxHeight = '0';
          content.style.overflow = 'hidden';
          content.style.transition = 'max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
        }

        function open() {
          trigger.setAttribute('aria-expanded', 'true');
          trigger.classList.add('is-open');
          item.classList.add('is-open');

          if (reducedMotion) {
            content.removeAttribute('hidden');
          } else {
            content.style.maxHeight = content.scrollHeight + 'px';
          }
        }

        function close() {
          trigger.setAttribute('aria-expanded', 'false');
          trigger.classList.remove('is-open');
          item.classList.remove('is-open');

          if (reducedMotion) {
            content.setAttribute('hidden', '');
          } else {
            content.style.maxHeight = '0';
          }
        }

        trigger.addEventListener('click', function () {
          const isCurrentlyOpen = trigger.getAttribute('aria-expanded') === 'true';

          if (isSingle && !isCurrentlyOpen) {
            // Close all others in this accordion
            items.forEach(function (otherItem) {
              const otherTrigger = otherItem.querySelector('.accordion__trigger');
              const otherContent = otherItem.querySelector('.accordion__content');
              if (otherTrigger && otherContent && otherTrigger !== trigger) {
                otherTrigger.setAttribute('aria-expanded', 'false');
                otherTrigger.classList.remove('is-open');
                otherItem.classList.remove('is-open');
                if (!reducedMotion) otherContent.style.maxHeight = '0';
                else otherContent.setAttribute('hidden', '');
              }
            });
          }

          isCurrentlyOpen ? close() : open();
        });

        // Keyboard support
        trigger.addEventListener('keydown', function (e) {
          const idx = items.indexOf(item);
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            const next = items[idx + 1];
            if (next) next.querySelector('.accordion__trigger')?.focus();
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prev = items[idx - 1];
            if (prev) prev.querySelector('.accordion__trigger')?.focus();
          }
        });
      });
    });
  });

}());

/* ── counter ───────────────────────────────────────────────────────────── */
/**
 * JARVISWEBSITES — Counter Module
 * Animates numbers from 0 to [data-count] target on scroll into view.
 * Supports prefix/suffix, easeOutCubic easing, ~2s duration. Fires once.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const DURATION = 2000; // ms

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function animateCounter(el) {
      const target = parseFloat(el.dataset.count) || 0;
      const prefix = el.dataset.countPrefix || '';
      const suffix = el.dataset.countSuffix || '';
      const isFloat = String(target).includes('.');
      const decimals = isFloat ? (String(target).split('.')[1] || '').length : 0;

      // Reduced motion: just set final value
      if (reducedMotion) {
        el.textContent = prefix + target.toFixed(decimals) + suffix;
        return;
      }

      const startTime = performance.now();

      function tick(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / DURATION, 1);
        const eased = easeOutCubic(progress);
        const current = target * eased;

        el.textContent = prefix + current.toFixed(decimals) + suffix;

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = prefix + target.toFixed(decimals) + suffix;
        }
      }

      requestAnimationFrame(tick);
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(function (el) {
      // Set initial display to 0
      const prefix = el.dataset.countPrefix || '';
      const suffix = el.dataset.countSuffix || '';
      el.textContent = prefix + '0' + suffix;
      observer.observe(el);
    });
  });

}());

/* ── parallax ──────────────────────────────────────────────────────────── */
/**
 * JARVISWEBSITES — Parallax Module
 * Applies GPU-accelerated parallax to [data-parallax] elements.
 * Desktop only — skipped on touch devices and reduced motion.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    // Skip on touch devices or reduced motion
    if ((window.JW && window.JW.isMobile()) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    const elements = document.querySelectorAll('[data-parallax]');
    if (!elements.length) return;

    let ticking = false;

    // Pre-parse speed values
    const items = Array.from(elements).map(function (el) {
      return {
        el: el,
        speed: parseFloat(el.dataset.parallax) || 0.3
      };
    });

    function applyParallax() {
      const scrollY = window.scrollY;

      items.forEach(function (item) {
        const rect = item.el.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const viewportCenter = window.innerHeight / 2;
        const offset = (centerY - viewportCenter) * item.speed;

        item.el.style.transform = 'translateY(' + offset.toFixed(2) + 'px)';
        item.el.style.willChange = 'transform';
      });

      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(applyParallax);
        ticking = true;
      }
    }, { passive: true });

    // Run once on init
    applyParallax();
  });

}());
