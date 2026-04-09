/* ============================================
   DOMENICO TALARICO — IMPRESA EDILE
   Premium Website — script.js
   ============================================ */

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
  initFAQ();
  initBeforeAfter();
  initCalculator();
  initTimeline();
  initMapTooltips();

  /* ---- Preloader ---- */
  function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;

    const isHome = document.body.dataset.page === 'home';
    const visited = sessionStorage.getItem('talarico-visited');

    if (!isHome || visited) {
      preloader.remove();
      document.body.classList.remove('preloader-active');
      triggerHeroReveal();
      return;
    }

    document.body.classList.add('preloader-active');
    const logo = preloader.querySelector('.preloader-logo');
    const line = preloader.querySelector('.preloader-line');

    setTimeout(() => { if (logo) logo.classList.add('show'); }, 200);
    setTimeout(() => { if (line) line.classList.add('expand'); }, 600);
    setTimeout(() => {
      preloader.classList.add('exit');
      document.body.classList.remove('preloader-active');
      sessionStorage.setItem('talarico-visited', 'true');
      setTimeout(() => {
        preloader.remove();
        triggerHeroReveal();
      }, 600);
    }, 2200);
  }

  function triggerHeroReveal() {
    const heroEls = document.querySelectorAll('.hero-label, .hero-title, .hero-desc, .hero-btns');
    let delay = 0;
    heroEls.forEach(el => {
      setTimeout(() => el.classList.add('show'), delay);
      delay += 150;
    });
    document.dispatchEvent(new CustomEvent('preloaderComplete'));
  }

  /* ---- Header ---- */
  function initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScrollY = 0;
    let ticking = false;
    let menuOpen = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;

          if (scrollY > 50) {
            header.classList.add('header-scrolled');
          } else {
            header.classList.remove('header-scrolled');
          }

          if (!menuOpen) {
            if (scrollY > lastScrollY && scrollY > 200) {
              header.classList.add('header-hidden');
            } else {
              header.classList.remove('header-hidden');
            }
          }

          lastScrollY = scrollY;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    window.headerSetMenuOpen = (open) => { menuOpen = open; };
  }

  /* ---- Mobile Menu ---- */
  function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.mobile-menu');
    if (!hamburger || !menu) return;

    const links = menu.querySelectorAll('a');
    let previousFocus = null;

    function openMenu() {
      previousFocus = document.activeElement;
      hamburger.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
      menu.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (window.headerSetMenuOpen) window.headerSetMenuOpen(true);

      links.forEach((link, i) => {
        link.style.transitionDelay = `${i * 50 + 100}ms`;
      });

      setTimeout(() => { if (links[0]) links[0].focus(); }, 300);
    }

    function closeMenu() {
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      menu.classList.remove('open');
      document.body.style.overflow = '';
      if (window.headerSetMenuOpen) window.headerSetMenuOpen(false);

      links.forEach(link => { link.style.transitionDelay = '0ms'; });

      if (previousFocus) previousFocus.focus();
    }

    hamburger.addEventListener('click', () => {
      menu.classList.contains('open') ? closeMenu() : openMenu();
    });

    links.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();

      if (e.key === 'Tab' && menu.classList.contains('open')) {
        const focusable = [hamburger, ...links];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
    });
  }

  /* ---- Scroll Progress ---- */
  function initScrollProgress() {
    const bar = document.querySelector('.scroll-progress-bar');
    if (!bar) return;

    window.addEventListener('scroll', () => {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight > 0) {
          bar.style.transform = `scaleX(${scrollY / docHeight})`;
        }
      });
    }, { passive: true });
  }

  /* ---- Reveal on Scroll ---- */
  function initRevealAnimations() {
    if (prefersReducedMotion) {
      document.querySelectorAll('.reveal-up').forEach(el => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));
  }

  /* ---- Counter Animation ---- */
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    if (prefersReducedMotion) {
      counters.forEach(el => {
        el.textContent = el.dataset.count + (el.dataset.suffix || '');
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(el => observer.observe(el));

    function animateCounter(element) {
      const target = parseInt(element.dataset.count);
      const suffix = element.dataset.suffix || '';
      const duration = 2000;
      const start = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    }
  }

  /* ---- Custom Cursor ---- */
  function initCustomCursor() {
    if (prefersReducedMotion) return;

    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const follower = document.createElement('div');
    follower.className = 'cursor-follower';

    dot.classList.add('hidden');
    follower.classList.add('hidden');

    document.body.appendChild(dot);
    document.body.appendChild(follower);

    let mouseX = -100, mouseY = -100;
    let followerX = -100, followerY = -100;
    let cursorActivated = false;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;

      if (!cursorActivated) {
        cursorActivated = true;
        dot.classList.remove('hidden');
        follower.classList.remove('hidden');
        document.body.classList.add('custom-cursor');
      }
    });

    function updateFollower() {
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;
      follower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;
      requestAnimationFrame(updateFollower);
    }
    requestAnimationFrame(updateFollower);

    const selectors = 'a, button, [role="button"], input, textarea, select, label, .calc-option, .calc-finish-option, .calc-extra-item';
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

  /* ---- Parallax ---- */
  function initParallax() {
    if (prefersReducedMotion) return;

    const parallaxEls = document.querySelectorAll('[data-parallax]');
    if (!parallaxEls.length) return;

    window.addEventListener('scroll', () => {
      requestAnimationFrame(() => {
        parallaxEls.forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.bottom > 0 && rect.top < window.innerHeight) {
            const factor = parseFloat(el.dataset.parallax) || 0.3;
            el.style.transform = `translateY(${window.scrollY * factor}px)`;
          }
        });
      });
    }, { passive: true });
  }

  /* ---- Magnetic Buttons ---- */
  function initMagneticButtons() {
    if (prefersReducedMotion) return;

    document.querySelectorAll('.magnetic-btn').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }

  /* ---- Smooth Scroll ---- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          e.preventDefault();
          const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
          const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
          window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        }
      });
    });
  }

  /* ---- Active Nav ---- */
  function initActiveNav() {
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.header-nav a, .mobile-menu a').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  /* ---- Forms ---- */
  function initForms() {
    document.querySelectorAll('form[data-validate]').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;

        form.querySelectorAll('[required]').forEach(field => {
          const group = field.closest('.form-group');
          if (!field.value.trim()) {
            if (group) group.classList.add('error');
            valid = false;
          } else {
            if (group) group.classList.remove('error');
          }

          if (field.type === 'email' && field.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
              if (group) group.classList.add('error');
              valid = false;
            }
          }
        });

        if (valid) {
          form.style.display = 'none';
          const success = form.parentElement.querySelector('.form-success');
          if (success) success.classList.add('show');
        }
      });

      form.querySelectorAll('[required]').forEach(field => {
        field.addEventListener('input', () => {
          const group = field.closest('.form-group');
          if (group && field.value.trim()) group.classList.remove('error');
        });
      });
    });
  }

  /* ---- Dynamic Year ---- */
  function initDynamicYear() {
    document.querySelectorAll('[data-year]').forEach(el => {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ---- FAQ ---- */
  function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const answer = item.querySelector('.faq-answer');
        const isOpen = item.classList.contains('open');

        item.closest('.faq-list').querySelectorAll('.faq-item.open').forEach(openItem => {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-answer').style.maxHeight = '0';
          openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
          item.classList.add('open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ---- Before/After Slider ---- */
  function initBeforeAfter() {
    const container = document.querySelector('.ba-container');
    if (!container) return;

    const beforeImg = container.querySelector('.ba-image-before');
    const handle = container.querySelector('.ba-handle');
    const handleArrows = container.querySelector('.ba-handle-arrows');
    let isDragging = false;

    function updatePosition(x) {
      const rect = container.getBoundingClientRect();
      let percent = ((x - rect.left) / rect.width) * 100;
      percent = Math.max(5, Math.min(95, percent));

      beforeImg.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
      handle.style.left = percent + '%';
      if (handleArrows) handleArrows.style.left = percent + '%';
    }

    container.addEventListener('mousedown', (e) => { isDragging = true; updatePosition(e.clientX); });
    document.addEventListener('mousemove', (e) => { if (isDragging) updatePosition(e.clientX); });
    document.addEventListener('mouseup', () => { isDragging = false; });

    container.addEventListener('touchstart', (e) => { isDragging = true; updatePosition(e.touches[0].clientX); }, { passive: true });
    container.addEventListener('touchmove', (e) => { if (isDragging) updatePosition(e.touches[0].clientX); }, { passive: true });
    container.addEventListener('touchend', () => { isDragging = false; });
  }

  /* ---- Calculator ---- */
  function initCalculator() {
    const calc = document.querySelector('.calculator');
    if (!calc) return;

    const steps = calc.querySelectorAll('.calc-step');
    const progressDots = calc.querySelectorAll('.calc-progress-dot');
    let currentStep = 0;

    let selectedType = null;
    let selectedSqm = 100;
    let selectedFinish = null;
    let selectedExtras = [];

    // Price ranges per type, per finish (low-high per sqm)
    const prices = {
      'ristrutturazione': { standard: [600, 800], premium: [800, 1100], luxury: [1100, 1500] },
      'bagno': { standard: [4000, 6000], premium: [6000, 10000], luxury: [10000, 15000] },
      'costruzione': { standard: [1200, 1500], premium: [1500, 2000], luxury: [2000, 2800] },
      'copertura': { standard: [80, 120], premium: [120, 180], luxury: [180, 250] }
    };

    const extraPrices = {
      'bioedilizia': 0.20,
      'cappotto': [80, 120],
      'elettrico': [3000, 6000],
      'idraulico': [3000, 7000]
    };

    function showStep(index) {
      steps.forEach((s, i) => {
        s.classList.toggle('active', i === index);
        const dots = s.querySelectorAll('.calc-progress-dot');
        dots.forEach((d, j) => {
          d.classList.toggle('active', j <= index);
        });
      });
      currentStep = index;
    }

    // Type selection
    calc.querySelectorAll('.calc-option').forEach(option => {
      option.addEventListener('click', () => {
        calc.querySelectorAll('.calc-option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        selectedType = option.dataset.type;
      });
    });

    // Slider
    const slider = calc.querySelector('.calc-slider');
    const sliderValue = calc.querySelector('.calc-slider-value span');
    if (slider) {
      slider.addEventListener('input', () => {
        selectedSqm = parseInt(slider.value);
        if (sliderValue) sliderValue.textContent = selectedSqm;
      });
    }

    // Finish selection
    calc.querySelectorAll('.calc-finish-option').forEach(option => {
      option.addEventListener('click', () => {
        calc.querySelectorAll('.calc-finish-option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        selectedFinish = option.dataset.finish;
      });
    });

    // Extras
    calc.querySelectorAll('.calc-extra-item').forEach(item => {
      item.addEventListener('click', () => {
        item.classList.toggle('selected');
        const extra = item.dataset.extra;
        if (selectedExtras.includes(extra)) {
          selectedExtras = selectedExtras.filter(e => e !== extra);
        } else {
          selectedExtras.push(extra);
        }
      });
    });

    // Navigation
    calc.querySelectorAll('[data-calc-next]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (currentStep === 0 && !selectedType) return;
        if (currentStep === 2 && !selectedFinish) return;
        if (currentStep < steps.length - 1) {
          if (currentStep === 3) calculateResult();
          showStep(currentStep + 1);
        }
      });
    });

    calc.querySelectorAll('[data-calc-prev]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (currentStep > 0) showStep(currentStep - 1);
      });
    });

    function calculateResult() {
      if (!selectedType || !selectedFinish) return;

      const priceRange = prices[selectedType]?.[selectedFinish];
      if (!priceRange) return;

      let lowTotal, highTotal;

      if (selectedType === 'bagno') {
        lowTotal = priceRange[0];
        highTotal = priceRange[1];
      } else {
        lowTotal = priceRange[0] * selectedSqm;
        highTotal = priceRange[1] * selectedSqm;
      }

      // Extras
      selectedExtras.forEach(extra => {
        if (extra === 'bioedilizia') {
          lowTotal *= (1 + extraPrices.bioedilizia * 0.75);
          highTotal *= (1 + extraPrices.bioedilizia);
        } else if (extraPrices[extra]) {
          const ep = extraPrices[extra];
          if (Array.isArray(ep)) {
            lowTotal += ep[0];
            highTotal += ep[1];
          } else {
            lowTotal += ep * selectedSqm;
            highTotal += ep * selectedSqm;
          }
        }
      });

      const resultEl = calc.querySelector('.calc-result-range');
      if (resultEl) {
        resultEl.textContent = `€${formatNumber(Math.round(lowTotal))} — €${formatNumber(Math.round(highTotal))}`;
      }
    }

    function formatNumber(n) {
      return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    showStep(0);
  }

  /* ---- Timeline ---- */
  function initTimeline() {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;

    const steps = timeline.querySelectorAll('.timeline-step');
    const lineFill = timeline.querySelector('.timeline-line-fill');

    if (prefersReducedMotion) {
      steps.forEach(s => s.classList.add('active'));
      if (lineFill) lineFill.style.height = '100%';
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);

          // Update line fill
          const allSteps = Array.from(steps);
          const activeCount = allSteps.filter(s => s.classList.contains('active')).length;
          if (lineFill) {
            lineFill.style.height = ((activeCount / allSteps.length) * 100) + '%';
          }
        }
      });
    }, { threshold: 0.3 });

    steps.forEach(step => observer.observe(step));
  }

  /* ---- Map Tooltips ---- */
  function initMapTooltips() {
    const mapContainer = document.querySelector('.map-container');
    if (!mapContainer) return;

    const tooltip = mapContainer.querySelector('.map-tooltip');
    const provinces = mapContainer.querySelectorAll('.map-province.served');

    provinces.forEach(province => {
      province.addEventListener('mouseenter', (e) => {
        if (tooltip) {
          tooltip.textContent = province.dataset.name || '';
          tooltip.classList.add('visible');
        }
      });

      province.addEventListener('mousemove', (e) => {
        if (tooltip) {
          const rect = mapContainer.getBoundingClientRect();
          tooltip.style.left = (e.clientX - rect.left + 12) + 'px';
          tooltip.style.top = (e.clientY - rect.top - 30) + 'px';
        }
      });

      province.addEventListener('mouseleave', () => {
        if (tooltip) tooltip.classList.remove('visible');
      });
    });
  }
});
