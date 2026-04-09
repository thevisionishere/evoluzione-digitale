/* ============================================================
   DOMENICO TALARICO — IMPRESA EDILE
   Main Script — LUXE Framework Build
   ============================================================ */

(function () {
  'use strict';

  /* ── Utilities ───────────────────────────────────────────── */
  var isDesktop = window.matchMedia('(hover: hover)').matches;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function qs(selector, ctx) {
    return (ctx || document).querySelector(selector);
  }

  function qsa(selector, ctx) {
    return Array.from((ctx || document).querySelectorAll(selector));
  }

  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function formatEur(n) {
    return '€' + Math.round(n).toLocaleString('it-IT');
  }

  /* ============================================================
     1. PRELOADER — Variant C Counter
     ============================================================ */
  function initPreloader() {
    var preloader = qs('.preloader');
    if (!preloader) return;

    if (sessionStorage.getItem('preloaded')) {
      preloader.classList.add('done');
      triggerHeroReveal();
      return;
    }

    var counter = qs('.preloader-counter', preloader);
    var barFill = qs('.preloader-bar-fill', preloader);
    var start = null;
    var duration = 2000;
    var current = 0;

    function step(timestamp) {
      if (!start) start = timestamp;
      var elapsed = timestamp - start;
      var progress = Math.min(elapsed / duration, 1);
      var easedProgress = easeOutCubic(progress);
      var value = Math.floor(easedProgress * 100);

      if (value !== current) {
        current = value;
        if (counter) counter.textContent = current;
        if (barFill) barFill.style.width = current + '%';
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        if (counter) counter.textContent = '100';
        setTimeout(function () {
          preloader.classList.add('done');
          sessionStorage.setItem('preloaded', '1');
          setTimeout(triggerHeroReveal, 300);
        }, 400);
      }
    }

    if (reducedMotion) {
      preloader.classList.add('done');
      sessionStorage.setItem('preloaded', '1');
      triggerHeroReveal();
      return;
    }

    requestAnimationFrame(step);
  }

  /* ============================================================
     2. HERO REVEAL
     ============================================================ */
  function triggerHeroReveal() {
    var heroContent = qs('.hero-content');
    if (!heroContent) return;

    var items = qsa('.reveal-up', heroContent);
    items.forEach(function (el, i) {
      var delay = parseInt(el.dataset.delay || i * 100, 10);
      setTimeout(function () {
        el.classList.add('revealed');
      }, delay);
    });

    var heroImage = qs('.hero-image-wrapper');
    if (heroImage) {
      setTimeout(function () {
        heroImage.classList.add('revealed');
      }, 200);
    }
  }

  /* ============================================================
     3. HEADER — Scroll Behavior + Auto-hide
     ============================================================ */
  function initHeader() {
    var header = qs('.header');
    if (!header) return;

    var lastScroll = 0;
    var scrolled = false;
    var hidden = false;
    var ticking = false;

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(function () {
          var current = window.scrollY;

          if (current > 50 && !scrolled) {
            header.classList.add('scrolled');
            scrolled = true;
          } else if (current <= 50 && scrolled) {
            header.classList.remove('scrolled');
            scrolled = false;
          }

          if (current > lastScroll && current > 200 && !hidden) {
            header.classList.add('header-hidden');
            hidden = true;
          } else if (current < lastScroll && hidden) {
            header.classList.remove('header-hidden');
            hidden = false;
          }

          lastScroll = current <= 0 ? 0 : current;
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ============================================================
     4. MOBILE MENU
     ============================================================ */
  function initMobileMenu() {
    var hamburger = qs('.hamburger');
    var menu = qs('.mobile-menu');
    var backdrop = qs('.mobile-menu-backdrop');
    if (!hamburger || !menu) return;

    var focusableSelectors = 'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
    var isOpen = false;

    function openMenu() {
      isOpen = true;
      hamburger.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
      menu.classList.add('active');
      if (backdrop) backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
      var firstFocusable = qs(focusableSelectors, menu);
      if (firstFocusable) setTimeout(function () { firstFocusable.focus(); }, 50);
    }

    function closeMenu() {
      isOpen = false;
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      menu.classList.remove('active');
      if (backdrop) backdrop.classList.remove('active');
      document.body.style.overflow = '';
      hamburger.focus();
    }

    hamburger.addEventListener('click', function () {
      if (isOpen) closeMenu(); else openMenu();
    });

    if (backdrop) {
      backdrop.addEventListener('click', closeMenu);
    }

    document.addEventListener('keydown', function (e) {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        closeMenu();
        return;
      }

      if (e.key === 'Tab') {
        var focusables = qsa(focusableSelectors, menu);
        var first = focusables[0];
        var last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    qsa('.mobile-menu-nav a', menu).forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  /* ============================================================
     5. DROPDOWNS
     ============================================================ */
  function initDropdowns() {
    var dropdowns = qsa('.nav-dropdown');
    if (!dropdowns.length) return;

    dropdowns.forEach(function (dropdown) {
      var toggle = qs('.nav-dropdown-toggle', dropdown);
      var dropMenu = qs('.nav-dropdown-menu', dropdown);
      if (!toggle || !dropMenu) return;

      toggle.setAttribute('aria-haspopup', 'true');
      toggle.setAttribute('aria-expanded', 'false');

      dropdown.addEventListener('mouseenter', function () {
        dropdown.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
      });

      dropdown.addEventListener('mouseleave', function () {
        dropdown.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });

      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        var isOpen = dropdown.classList.contains('open');
        dropdowns.forEach(function (d) {
          d.classList.remove('open');
          var t = qs('.nav-dropdown-toggle', d);
          if (t) t.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          dropdown.classList.add('open');
          toggle.setAttribute('aria-expanded', 'true');
        }
      });
    });

    document.addEventListener('click', function (e) {
      dropdowns.forEach(function (dropdown) {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove('open');
          var toggle = qs('.nav-dropdown-toggle', dropdown);
          if (toggle) toggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  /* ============================================================
     6. SCROLL PROGRESS
     ============================================================ */
  function initScrollProgress() {
    var bar = qs('.scroll-progress-bar');
    if (!bar) return;

    function update() {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = pct + '%';
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ============================================================
     7. REVEAL ANIMATIONS
     ============================================================ */
  function initRevealAnimations() {
    var elements = qsa('.reveal-up:not(.hero-content .reveal-up)');
    if (!elements.length) return;

    if (reducedMotion) {
      elements.forEach(function (el) {
        el.classList.add('revealed');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var delay = parseInt(el.dataset.delay || 0, 10);
          setTimeout(function () {
            el.classList.add('revealed');
          }, delay);
          observer.unobserve(el);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ============================================================
     8. COUNTERS
     ============================================================ */
  function initCounters() {
    var elements = qsa('[data-count]');
    if (!elements.length) return;

    if (reducedMotion) {
      elements.forEach(function (el) {
        var target = parseFloat(el.dataset.count);
        var suffix = el.dataset.suffix || '';
        el.textContent = (Number.isInteger(target) ? target : target.toFixed(1)) + suffix;
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        observer.unobserve(el);

        var target = parseFloat(el.dataset.count);
        var suffix = el.dataset.suffix || '';
        var duration = 1800;
        var start = null;

        function tick(timestamp) {
          if (!start) start = timestamp;
          var elapsed = timestamp - start;
          var progress = Math.min(elapsed / duration, 1);
          var eased = easeOutCubic(progress);
          var current = target * eased;
          var display = Number.isInteger(target) ? Math.round(current) : current.toFixed(1);
          el.textContent = display + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
      });
    }, { threshold: 0.3 });

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ============================================================
     9. CUSTOM CURSOR (desktop only)
     ============================================================ */
  function initCustomCursor() {
    if (!isDesktop) return;

    var dot = qs('.cursor-dot');
    var ring = qs('.cursor-ring');
    if (!dot || !ring) return;

    var mouseX = 0;
    var mouseY = 0;
    var ringX = 0;
    var ringY = 0;
    var lag = 0.12;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = 'translate(' + mouseX + 'px, ' + mouseY + 'px)';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * lag;
      ringY += (mouseY - ringY) * lag;
      ring.style.transform = 'translate(' + ringX + 'px, ' + ringY + 'px)';
      requestAnimationFrame(animateRing);
    }

    requestAnimationFrame(animateRing);

    var hoverTargets = 'a, button, [role="button"], .service-card, .calc-option, .calc-finish-card, .ba-handle, .gallery-item, .blog-card';

    document.addEventListener('mouseover', function (e) {
      if (e.target.closest(hoverTargets)) {
        dot.classList.add('hovered');
        ring.classList.add('hovered');
      }
    });

    document.addEventListener('mouseout', function (e) {
      if (e.target.closest(hoverTargets)) {
        dot.classList.remove('hovered');
        ring.classList.remove('hovered');
      }
    });

    document.addEventListener('mouseleave', function () {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    });

    document.addEventListener('mouseenter', function () {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    });
  }

  /* ============================================================
     10. MAGNETIC BUTTONS
     ============================================================ */
  function initMagneticButtons() {
    if (!isDesktop) return;

    var btns = qsa('.magnetic-btn');
    if (!btns.length) return;

    btns.forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var dx = (e.clientX - cx) * 0.3;
        var dy = (e.clientY - cy) * 0.3;
        btn.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
      });

      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }

  /* ============================================================
     11. SMOOTH SCROLL
     ============================================================ */
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;

      var href = anchor.getAttribute('href');
      if (href === '#') return;

      var target = qs(href);
      if (!target) return;

      e.preventDefault();
      var header = qs('.header');
      var offset = header ? header.offsetHeight + 20 : 80;
      var targetY = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({
        top: targetY,
        behavior: reducedMotion ? 'auto' : 'smooth'
      });
    });
  }

  /* ============================================================
     12. ACTIVE NAV
     ============================================================ */
  function initActiveNav() {
    var links = qsa('.header-nav a, .mobile-menu-nav a');
    if (!links.length) return;

    var current = window.location.pathname.split('/').pop() || 'index.html';

    links.forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;
      var linkPage = href.split('/').pop().split('#')[0] || 'index.html';

      if (linkPage === current) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  /* ============================================================
     13. FORMS VALIDATION
     ============================================================ */
  function initForms() {
    var forms = qsa('.site-form');
    if (!forms.length) return;

    forms.forEach(function (form) {
      var successEl = form.parentElement.querySelector('.form-success') ||
                      qs('.form-success', form.closest('[data-form-wrapper]'));

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var valid = validateForm(form);
        if (!valid) return;

        var submitBtn = qs('[type="submit"]', form);
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Invio in corso...';
        }

        /* Simulate async submit — replace with real fetch if needed */
        setTimeout(function () {
          form.style.display = 'none';
          if (successEl) {
            successEl.classList.add('visible');
            successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 800);
      });

      var fields = qsa('input, textarea, select', form);
      fields.forEach(function (field) {
        field.addEventListener('input', function () {
          clearFieldError(field);
        });
        field.addEventListener('blur', function () {
          validateField(field);
        });
      });
    });
  }

  function validateForm(form) {
    var fields = qsa('input[required], textarea[required], select[required]', form);
    var valid = true;

    fields.forEach(function (field) {
      if (!validateField(field)) valid = false;
    });

    return valid;
  }

  function validateField(field) {
    clearFieldError(field);

    var value = field.value.trim();
    var type = field.type;
    var required = field.hasAttribute('required');

    if (required && !value) {
      showFieldError(field, 'Campo obbligatorio.');
      return false;
    }

    if (value && type === 'email') {
      var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(value)) {
        showFieldError(field, 'Inserisci un indirizzo email valido.');
        return false;
      }
    }

    if (value && type === 'tel') {
      var telRe = /^[+\d\s\-().]{6,20}$/;
      if (!telRe.test(value)) {
        showFieldError(field, 'Inserisci un numero di telefono valido.');
        return false;
      }
    }

    return true;
  }

  function showFieldError(field, msg) {
    field.classList.add('error');
    var errorEl = field.parentElement.querySelector('.form-error');
    if (errorEl) {
      errorEl.textContent = msg;
      errorEl.classList.add('visible');
    }
  }

  function clearFieldError(field) {
    field.classList.remove('error');
    var errorEl = field.parentElement.querySelector('.form-error');
    if (errorEl) {
      errorEl.classList.remove('visible');
      errorEl.textContent = '';
    }
  }

  /* ============================================================
     14. DYNAMIC YEAR
     ============================================================ */
  function initDynamicYear() {
    qsa('[data-year]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ============================================================
     15. MARQUEE — CSS-driven, no JS needed
     ============================================================ */
  function initMarquee() {
    /* Duplicate items for seamless loop */
    var marquee = qs('.marquee');
    if (!marquee) return;

    var items = qsa('.marquee-item', marquee);
    if (!items.length) return;

    items.forEach(function (item) {
      var clone = item.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      marquee.appendChild(clone);
    });
  }

  /* ============================================================
     16. SERVICE CARD FLIP (mobile tap)
     ============================================================ */
  function initServiceCardFlip() {
    if (isDesktop) return;

    var cards = qsa('.service-card');
    if (!cards.length) return;

    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        var isFlipped = card.classList.contains('flipped');
        cards.forEach(function (c) { c.classList.remove('flipped'); });
        if (!isFlipped) card.classList.add('flipped');
      });
    });
  }

  /* ============================================================
     17. BEFORE / AFTER SLIDER
     ============================================================ */
  function initBeforeAfter() {
    var slider = qs('.ba-slider');
    if (!slider) return;

    var handle = qs('.ba-handle', slider);
    var after = qs('.ba-after', slider);
    if (!handle || !after) return;

    var dragging = false;
    var pct = 50;

    function setPosition(clientX) {
      var rect = slider.getBoundingClientRect();
      var relX = clientX - rect.left;
      pct = clamp((relX / rect.width) * 100, 1, 99);
      handle.style.left = pct + '%';
      after.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
    }

    /* Mouse */
    handle.addEventListener('mousedown', function (e) {
      e.preventDefault();
      dragging = true;
    });

    document.addEventListener('mousemove', function (e) {
      if (!dragging) return;
      setPosition(e.clientX);
    });

    document.addEventListener('mouseup', function () {
      dragging = false;
    });

    /* Touch */
    handle.addEventListener('touchstart', function (e) {
      dragging = true;
    }, { passive: true });

    document.addEventListener('touchmove', function (e) {
      if (!dragging) return;
      setPosition(e.touches[0].clientX);
    }, { passive: true });

    document.addEventListener('touchend', function () {
      dragging = false;
    });

    /* Click on slider itself */
    slider.addEventListener('click', function (e) {
      setPosition(e.clientX);
    });

    /* Initial position */
    after.style.clipPath = 'inset(0 50% 0 0)';
  }

  /* ============================================================
     18. PROCESS PATH LINE
     ============================================================ */
  function initProcessPath() {
    var fill = qs('.process-line-fill');
    if (!fill) return;

    if (reducedMotion) {
      fill.style.width = '100%';
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          fill.style.width = '100%';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(fill.closest('.process-path') || fill);
  }

  /* ============================================================
     19. FINAL CTA STAGGER
     ============================================================ */
  function initFinalCTA() {
    var section = qs('.final-cta');
    if (!section) return;

    var words = qsa('.final-cta-word', section);
    var line = qs('.final-cta-line', section);
    var buttons = qs('.final-cta-buttons', section);

    if (reducedMotion) {
      words.forEach(function (w) { w.classList.add('revealed'); });
      if (line) line.classList.add('revealed');
      if (buttons) buttons.classList.add('revealed');
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        words.forEach(function (word, i) {
          setTimeout(function () {
            word.classList.add('revealed');
          }, i * 80);
        });

        var lineDelay = words.length * 80 + 100;
        if (line) {
          setTimeout(function () {
            line.classList.add('revealed');
          }, lineDelay);
        }

        if (buttons) {
          setTimeout(function () {
            buttons.classList.add('revealed');
          }, lineDelay + 200);
        }

        observer.unobserve(entry.target);
      });
    }, { threshold: 0.3 });

    observer.observe(section);
  }

  /* ============================================================
     20. COST CALCULATOR
     ============================================================ */
  function initCalculator() {
    var wrapper = qs('.calculator-wrapper');
    if (!wrapper) return;

    /* State */
    var state = {
      type: null,
      sqm: 100,
      finish: 'medio',
      zone: 'lecco'
    };

    /* Price tables */
    var basePrices = {
      'nuova-costruzione': [1200, 2500],
      'ristrutturazione':  [600,  1500],
      'bagno':             [6400, 27000], /* fixed total */
      'cappotto':          [80,   150],   /* per mq */
      'copertura':         [100,  250]    /* per mq */
    };

    var finishMultipliers = {
      standard: 1.0,
      medio:    1.3,
      premium:  1.7
    };

    var zoneMultipliers = {
      lecco:   1.0,
      como:    1.05,
      milano:  1.15,
      bergamo: 1.0,
      brescia: 1.0,
      monza:   1.10
    };

    /* Fixed types (bathroom is total price, not per mq) */
    var fixedTypes = ['bagno'];

    /* DOM refs */
    var typeOptions = qsa('.calc-option[data-type]', wrapper);
    var finishCards = qsa('.calc-finish-card[data-finish]', wrapper);
    var zoneSelect = qs('select[data-zone]', wrapper);
    var rangeInput = qs('input[type="range"]', wrapper);
    var rangeValue = qs('.calc-range-value', wrapper);
    var resultEl = qs('.calc-result', wrapper);
    var resultRange = qs('.calc-result-range', wrapper);

    /* Pre-fill hidden form fields */
    function prefillHiddenFields() {
      var typeField = qs('#calc-form-type');
      var sqmField = qs('#calc-form-sqm');
      var typeLabel = state.type ? wrapper.querySelector('.calc-option[data-type="' + state.type + '"] .calc-option-title') : null;
      if (typeField && typeLabel) typeField.value = typeLabel.textContent;
      if (sqmField) sqmField.value = state.sqm;
    }

    function calculate() {
      if (!state.type) return;

      var prices = basePrices[state.type];
      if (!prices) return;

      var finishMult = finishMultipliers[state.finish] || 1;
      var zoneMult = zoneMultipliers[state.zone] || 1;
      var min, max;

      if (fixedTypes.indexOf(state.type) !== -1) {
        /* Fixed price: multiply finish + zone only */
        min = prices[0] * finishMult * zoneMult;
        max = prices[1] * finishMult * zoneMult;
      } else {
        /* Per sqm: multiply by sqm, then finish, then zone */
        min = prices[0] * state.sqm * finishMult * zoneMult;
        max = prices[1] * state.sqm * finishMult * zoneMult;
      }

      if (resultRange) {
        resultRange.textContent = 'Da ' + formatEur(min) + ' a ' + formatEur(max);
      }

      if (resultEl) {
        resultEl.classList.add('visible');
        resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      prefillHiddenFields();
    }

    /* Type selection */
    typeOptions.forEach(function (opt) {
      opt.addEventListener('click', function () {
        typeOptions.forEach(function (o) { o.classList.remove('selected', 'active'); });
        opt.classList.add('selected', 'active');
        state.type = opt.dataset.type;

        /* Show/hide sqm range for fixed types */
        var sqmStep = qs('[data-step="sqm"]', wrapper);
        if (sqmStep) {
          sqmStep.style.display = fixedTypes.indexOf(state.type) !== -1 ? 'none' : '';
        }

        calculate();
      });
    });

    /* Finish selection */
    finishCards.forEach(function (card) {
      card.addEventListener('click', function () {
        finishCards.forEach(function (c) { c.classList.remove('selected', 'active'); });
        card.classList.add('selected', 'active');
        state.finish = card.dataset.finish;
        calculate();
      });
    });

    /* Zone selection */
    if (zoneSelect) {
      zoneSelect.addEventListener('change', function () {
        state.zone = zoneSelect.value;
        calculate();
      });
    }

    /* Range input */
    if (rangeInput) {
      function updateRange() {
        state.sqm = parseInt(rangeInput.value, 10);
        if (rangeValue) {
          rangeValue.innerHTML = state.sqm + ' <span>mq</span>';
        }
        calculate();
      }

      rangeInput.addEventListener('input', updateRange);

      /* Init display */
      if (rangeValue) {
        rangeValue.innerHTML = rangeInput.value + ' <span>mq</span>';
      }
    }

    /* Select medio finish by default */
    var defaultFinish = qs('.calc-finish-card[data-finish="medio"]', wrapper);
    if (defaultFinish) {
      defaultFinish.classList.add('selected', 'active');
    }
  }

  /* ============================================================
     21. ENERGY SIMULATOR
     ============================================================ */
  function initEnergySimulator() {
    var sim = qs('.energy-sim');
    if (!sim) return;

    /* DOM refs */
    var typeOptions = qsa('button.calc-option[data-group="type"]', sim);
    var heatOptions = qsa('button.calc-option[data-group="heat"]', sim);
    var areaRange = qs('#energy-area', sim);
    var yearSelect = qs('#energy-year', sim);
    var calcBtn = qs('#energy-calc-btn', sim);
    var resultEl = qs('.energy-result', sim);
    var beforeAmountEl = qs('.energy-box.before .energy-box-amount', sim);
    var afterAmountEl = qs('.energy-box.after .energy-box-amount', sim);
    var savingsAmountEl = qs('.energy-savings-amount', sim);
    var roiValueEl = qs('.energy-roi-value', sim);
    var classItems = qsa('.energy-class-item', sim);

    /* Base costs per mq/year (euro) */
    var baseCosts = {
      gas:      12,
      gasolio:  15,
      elettrico: 18,
      pompa:    8
    };

    /* Year multipliers */
    var yearMults = {
      'pre1980':    1.5,
      '1980-2000':  1.2,
      '2000-2010':  1.0,
      'post2010':   0.85
    };

    var savingsRate = 0.35;
    var investmentPerMq = 180;

    /* State */
    var state = {
      type: null,
      heat: null,
      area: 100,
      year: 'pre1980'
    };

    /* Selection helpers */
    function selectOption(group, value) {
      var opts = group === 'type' ? typeOptions : heatOptions;
      opts.forEach(function (o) { o.classList.remove('selected', 'active'); });
      var target = Array.from(opts).find(function (o) { return o.dataset[group === 'type' ? 'type' : 'heat'] === value || o.dataset.value === value; });
      if (target) target.classList.add('selected', 'active');
    }

    typeOptions.forEach(function (opt) {
      opt.addEventListener('click', function () {
        typeOptions.forEach(function (o) { o.classList.remove('selected', 'active'); });
        opt.classList.add('selected', 'active');
        state.type = opt.dataset.type || opt.dataset.value || opt.textContent.trim().toLowerCase();
      });
    });

    heatOptions.forEach(function (opt) {
      opt.addEventListener('click', function () {
        heatOptions.forEach(function (o) { o.classList.remove('selected', 'active'); });
        opt.classList.add('selected', 'active');
        state.heat = opt.dataset.heat || opt.dataset.value || opt.textContent.trim().toLowerCase();
        /* Match heat system to base cost key */
        var txt = (opt.dataset.heat || opt.dataset.value || opt.textContent).toLowerCase();
        if (txt.includes('gas'))      state.heatKey = 'gas';
        else if (txt.includes('gasolio') || txt.includes('olio')) state.heatKey = 'gasolio';
        else if (txt.includes('elettr') || txt.includes('elett')) state.heatKey = 'elettrico';
        else if (txt.includes('pompa') || txt.includes('heat pump')) state.heatKey = 'pompa';
        else state.heatKey = 'gas';
      });
    });

    if (areaRange) {
      var areaDisplay = qs('[data-area-display]', sim) || qs('.calc-range-value', sim.closest('.calc-step') || sim);
      areaRange.addEventListener('input', function () {
        state.area = parseInt(areaRange.value, 10);
        if (areaDisplay) areaDisplay.innerHTML = state.area + ' <span>mq</span>';
      });
    }

    if (yearSelect) {
      yearSelect.addEventListener('change', function () {
        state.year = yearSelect.value;
      });
    }

    /* Energy class estimation */
    function estimateClass(costPerMq) {
      /* Cost per mq / year thresholds (after baseline, before intervention) */
      if (costPerMq >= 20)   return 0; /* G */
      if (costPerMq >= 16)   return 1; /* F */
      if (costPerMq >= 12)   return 2; /* E */
      if (costPerMq >= 9)    return 3; /* D */
      if (costPerMq >= 6)    return 4; /* C */
      if (costPerMq >= 4)    return 5; /* B */
      return 6;                         /* A */
    }

    function highlightClass(index) {
      classItems.forEach(function (item, i) {
        item.classList.toggle('active', i === index);
      });
    }

    if (calcBtn) {
      calcBtn.addEventListener('click', function () {
        var heatKey = state.heatKey || 'gas';
        var baseCost = baseCosts[heatKey] || 12;
        var yearMult = yearMults[state.year] || 1.0;
        var area = state.area || (areaRange ? parseInt(areaRange.value, 10) : 100);

        var costPerMqBefore = baseCost * yearMult;
        var totalBefore = costPerMqBefore * area;
        var totalAfter = totalBefore * (1 - savingsRate);
        var savings = totalBefore - totalAfter;

        /* Investment & ROI */
        var investment = investmentPerMq * area;
        var roiYears = savings > 0 ? (investment / savings).toFixed(1) : '--';

        /* Update DOM */
        if (beforeAmountEl) beforeAmountEl.textContent = formatEur(totalBefore) + '/anno';
        if (afterAmountEl) afterAmountEl.textContent = formatEur(totalAfter) + '/anno';
        if (savingsAmountEl) savingsAmountEl.textContent = formatEur(savings) + '/anno';
        if (roiValueEl) roiValueEl.textContent = roiYears + ' anni';

        /* Energy class highlight (after intervention) */
        var costPerMqAfter = (costPerMqBefore * (1 - savingsRate));
        highlightClass(estimateClass(costPerMqAfter));

        /* Show result */
        if (resultEl) {
          resultEl.classList.add('visible');
          setTimeout(function () {
            resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 100);
        }
      });
    }
  }

  /* ============================================================
     INIT
     ============================================================ */
  document.addEventListener('DOMContentLoaded', function () {
    initPreloader();
    initHeader();
    initMobileMenu();
    initDropdowns();
    initScrollProgress();
    initRevealAnimations();
    initCounters();
    initCustomCursor();
    initMagneticButtons();
    initSmoothScroll();
    initActiveNav();
    initForms();
    initDynamicYear();
    initMarquee();
    initServiceCardFlip();
    initBeforeAfter();
    initProcessPath();
    initFinalCTA();
    initCalculator();
    initEnergySimulator();
  });

})();
