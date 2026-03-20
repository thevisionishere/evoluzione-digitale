/* ============================================
   STUDIO LEGALE RAJANI & IRTUSO
   Premium Website — LUXE Framework
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
  initSmoothScroll();
  initActiveNav();
  initForms();
  initDynamicYear();
  initFAQ();
  initServiceExplorer();
  initTextReveal();
  initTabs();
  initTimeline();

  if (!isMobile && !prefersReducedMotion) {
    initCustomCursor();
    initParallax();
    initMagneticButtons();
  }

  /* --- 1. PRELOADER --- */
  function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;

    const isHome = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || window.location.pathname === '';
    const visited = sessionStorage.getItem('luxe-visited');

    if (!isHome || visited) {
      preloader.remove();
      document.body.classList.remove('no-scroll');
      triggerHeroReveal();
      return;
    }

    document.body.classList.add('no-scroll');

    setTimeout(() => {
      preloader.classList.add('fade-out');
      document.body.classList.remove('no-scroll');
      sessionStorage.setItem('luxe-visited', 'true');

      setTimeout(() => {
        preloader.remove();
        document.dispatchEvent(new CustomEvent('preloaderComplete'));
        triggerHeroReveal();
      }, 800);
    }, prefersReducedMotion ? 100 : 1800);
  }

  function triggerHeroReveal() {
    const heroElements = document.querySelectorAll('.hero [data-hero-reveal]');
    heroElements.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('revealed');
      }, prefersReducedMotion ? 0 : 150 * i);
    });
  }

  /* --- 2. HEADER --- */
  function initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScrollY = window.scrollY;
    let ticking = false;
    let menuOpen = false;

    window.headerMenuOpen = (state) => { menuOpen = state; };

    function updateHeader() {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 50) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }

      if (!menuOpen) {
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
          header.classList.add('header-hidden');
        } else {
          header.classList.remove('header-hidden');
        }
      }

      lastScrollY = currentScrollY;
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });
  }

  /* --- 3. MOBILE MENU --- */
  function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.mobile-menu');
    if (!hamburger || !menu) return;

    const links = menu.querySelectorAll('a');
    let previousFocus = null;

    function openMenu() {
      previousFocus = document.activeElement;
      hamburger.classList.add('active');
      menu.classList.add('open');
      document.body.classList.add('no-scroll');
      hamburger.setAttribute('aria-expanded', 'true');
      if (window.headerMenuOpen) window.headerMenuOpen(true);
      if (links.length) links[0].focus();
    }

    function closeMenu() {
      hamburger.classList.remove('active');
      menu.classList.remove('open');
      document.body.classList.remove('no-scroll');
      hamburger.setAttribute('aria-expanded', 'false');
      if (window.headerMenuOpen) window.headerMenuOpen(false);
      if (previousFocus) previousFocus.focus();
    }

    hamburger.addEventListener('click', () => {
      menu.classList.contains('open') ? closeMenu() : openMenu();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();

      if (e.key === 'Tab' && menu.classList.contains('open')) {
        const focusable = menu.querySelectorAll('a, button');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    links.forEach(link => {
      link.addEventListener('click', () => closeMenu());
    });
  }

  /* --- 4. SCROLL PROGRESS BAR --- */
  function initScrollProgress() {
    const bar = document.querySelector('.scroll-progress');
    if (!bar) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = docHeight > 0 ? scrollTop / docHeight : 0;
          bar.style.transform = `scaleX(${progress})`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* --- 5. REVEAL ANIMATIONS --- */
  function initRevealAnimations() {
    const elements = document.querySelectorAll('.reveal-up');
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
    }, { threshold: 0.15 });

    elements.forEach(el => observer.observe(el));
  }

  /* --- 6. COUNTER ANIMATION --- */
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

  /* --- 7. SMOOTH SCROLL --- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const header = document.querySelector('.header');
          const offset = (header ? header.offsetHeight : 0) + 20;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: prefersReducedMotion ? 'instant' : 'smooth' });
        }
      });
    });
  }

  /* --- 8. ACTIVE NAV LINK --- */
  function initActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.header-nav a, .mobile-menu-nav a');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html') || (currentPage === 'index.html' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  /* --- 9. FORM VALIDATION --- */
  function initForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      const fields = form.querySelectorAll('[required]');

      fields.forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
          if (field.classList.contains('error')) validateField(field);
        });
      });

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;

        fields.forEach(field => {
          if (!validateField(field)) valid = false;
        });

        if (valid) {
          const success = form.parentElement.querySelector('.form-success');
          if (success) {
            form.style.display = 'none';
            success.classList.add('show');
          }
        } else {
          const firstError = form.querySelector('.error');
          if (firstError) firstError.focus();
        }
      });
    });

    function validateField(field) {
      const group = field.closest('.form-group');
      const error = group ? group.querySelector('.form-error') : null;
      let valid = true;
      let message = '';

      if (field.type === 'checkbox' && !field.checked) {
        valid = false;
        message = 'Questo campo è obbligatorio';
      } else if (!field.value.trim()) {
        valid = false;
        message = 'Questo campo è obbligatorio';
      } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
        valid = false;
        message = 'Inserisci un indirizzo email valido';
      } else if (field.type === 'tel' && !/^[\d\s\+\-\(\)]{7,}$/.test(field.value)) {
        valid = false;
        message = 'Inserisci un numero di telefono valido';
      }

      field.classList.toggle('error', !valid);
      field.classList.toggle('valid', valid);
      if (group) group.classList.toggle('has-error', !valid);
      if (error) error.textContent = message;

      return valid;
    }
  }

  /* --- 10. DYNAMIC YEAR --- */
  function initDynamicYear() {
    document.querySelectorAll('[data-year]').forEach(el => {
      el.textContent = new Date().getFullYear();
    });
  }

  /* --- 11. CUSTOM CURSOR --- */
  function initCustomCursor() {
    const gavel = document.createElement('div');
    gavel.className = 'cursor-gavel';
    gavel.innerHTML = '<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<rect x="8" y="2" width="16" height="10" rx="2" fill="#8B6914" stroke="#6B4F10" stroke-width="0.8"/>' +
      '<rect x="10" y="3" width="12" height="8" rx="1" fill="#A67C1A" opacity="0.5"/>' +
      '<rect x="14.5" y="11" width="3" height="18" rx="1" fill="#6B4F10"/>' +
      '<rect x="15" y="12" width="2" height="16" rx="0.5" fill="#8B6914" opacity="0.4"/>' +
      '<rect x="12" y="28" width="8" height="3" rx="1" fill="#6B4F10"/>' +
      '</svg>';
    gavel.style.left = '0';
    gavel.style.top = '0';
    document.body.appendChild(gavel);

    let mouseX = -100, mouseY = -100;
    let cursorActivated = false;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      const pos = `translate(${mouseX - 25}px, ${mouseY - 31}px)`;
      gavel.style.setProperty('--gavel-pos', pos);
      gavel.style.transform = pos + ' rotate(-20deg)';

      if (!cursorActivated) {
        cursorActivated = true;
        document.body.classList.add('custom-cursor');
      }
    });

    document.addEventListener('mousedown', (e) => {
      if (!cursorActivated) return;

      gavel.classList.remove('slam');
      void gavel.offsetWidth;
      gavel.classList.add('slam');

      /* Gavel head tip relative to pivot (70% 85% of 36×36 = 25.2, 30.6) */
      const headRelX = -17, headRelY = -24;
      const slamRad = -55 * Math.PI / 180;
      const tipX = mouseX + (headRelX * Math.cos(slamRad) - headRelY * Math.sin(slamRad));
      const tipY = mouseY + (headRelX * Math.sin(slamRad) + headRelY * Math.cos(slamRad));

      /* Delay impact to match slam keyframe (35% of 300ms) */
      setTimeout(() => {
        const impact = document.createElement('div');
        impact.className = 'gavel-impact';
        impact.style.left = tipX + 'px';
        impact.style.top = tipY + 'px';
        document.body.appendChild(impact);

        for (let i = 0; i < 8; i++) {
          const spark = document.createElement('div');
          spark.className = 'gavel-crack';
          spark.style.left = tipX + 'px';
          spark.style.top = tipY + 'px';
          const angle = (Math.PI * 2 / 8) * i + Math.random() * 0.5;
          const dist = 18 + Math.random() * 25;
          spark.style.setProperty('--cx', '0px');
          spark.style.setProperty('--cy', '0px');
          spark.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
          spark.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
          document.body.appendChild(spark);
          spark.addEventListener('animationend', () => spark.remove());
        }

        impact.addEventListener('animationend', () => impact.remove());
      }, 105);

      gavel.addEventListener('animationend', () => gavel.classList.remove('slam'), { once: true });
    });

    document.addEventListener('mouseleave', () => gavel.classList.add('hidden'));
    document.addEventListener('mouseenter', () => gavel.classList.remove('hidden'));
  }

  /* --- 12. PARALLAX --- */
  function initParallax() {
    const heroImage = document.querySelector('.hero-image img');
    if (!heroImage) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = heroImage.closest('.hero').getBoundingClientRect();
          if (rect.bottom > 0 && rect.top < window.innerHeight) {
            heroImage.style.transform = `translateY(${window.scrollY * 0.15}px) scale(1.1)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    heroImage.style.transform = 'scale(1.1)';
  }

  /* --- 13. MAGNETIC BUTTONS --- */
  function initMagneticButtons() {
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
        btn.style.transform = `translate(${x}px, ${y}px) translateY(-2px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* --- 14. FAQ ACCORDION --- */
  function initFAQ() {
    const items = document.querySelectorAll('.faq-item');
    if (!items.length) return;

    items.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      if (!question || !answer) return;

      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        items.forEach(other => {
          other.classList.remove('active');
          const otherAnswer = other.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = '0';
          other.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
        });

        if (!isActive) {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
          question.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* --- 15. SERVICE EXPLORER --- */
  function initServiceExplorer() {
    const cards = document.querySelectorAll('.explorer-card');
    if (!cards.length) return;

    function toggleCard(card) {
      const isActive = card.classList.contains('active');
      const body = card.querySelector('.explorer-card-body');
      if (!body) return;

      if (isActive) {
        card.classList.remove('active');
        card.setAttribute('aria-expanded', 'false');
        body.style.maxHeight = '0';
      } else {
        card.classList.add('active');
        card.setAttribute('aria-expanded', 'true');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    }

    cards.forEach(card => {
      card.addEventListener('click', () => toggleCard(card));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleCard(card);
        }
      });
    });
  }

  /* --- 16. TEXT REVEAL ON SCROLL --- */
  function initTextReveal() {
    const container = document.querySelector('.text-reveal');
    if (!container) return;

    const words = container.querySelectorAll('.text-reveal-word');
    if (!words.length) return;

    if (prefersReducedMotion) {
      words.forEach(w => w.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          words.forEach((word, i) => {
            setTimeout(() => word.classList.add('visible'), i * 80);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(container);
  }

  /* --- 17. TABS --- */
  function initTabs() {
    const tabContainers = document.querySelectorAll('.tabs-nav');
    if (!tabContainers.length) return;

    tabContainers.forEach(nav => {
      const buttons = nav.querySelectorAll('.tab-btn');
      const section = nav.closest('section') || nav.parentElement;
      const panels = section.querySelectorAll('.tab-panel');

      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          const target = btn.dataset.tab;

          buttons.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
          });
          panels.forEach(p => p.classList.remove('active'));

          btn.classList.add('active');
          btn.setAttribute('aria-selected', 'true');
          const panel = section.querySelector(`[data-panel="${target}"]`);
          if (panel) panel.classList.add('active');
        });
      });

      nav.addEventListener('keydown', (e) => {
        const btns = Array.from(buttons);
        const current = btns.findIndex(b => b.classList.contains('active'));
        let next;

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          next = (current + 1) % btns.length;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          next = (current - 1 + btns.length) % btns.length;
        } else if (e.key === 'Home') {
          next = 0;
        } else if (e.key === 'End') {
          next = btns.length - 1;
        } else {
          return;
        }

        e.preventDefault();
        btns[next].click();
        btns[next].focus();
      });
    });
  }

  /* ── Timeline — animated line + progressive reveal ── */
  function initTimeline() {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;

    const lineFill = timeline.querySelector('.timeline-line-fill');
    const items = timeline.querySelectorAll('.timeline-item');
    if (!items.length) return;

    function update() {
      const timelineRect = timeline.getBoundingClientRect();
      const timelineTop = timelineRect.top;
      const timelineHeight = timelineRect.height;
      const trigger = window.innerHeight * 0.65;

      /* Calculate how far the line should extend */
      const scrolled = trigger - timelineTop;
      const progress = Math.max(0, Math.min(1, scrolled / timelineHeight));
      lineFill.style.height = (progress * 100) + '%';

      /* Reveal items + activate dots when line reaches them */
      items.forEach(item => {
        const itemTop = item.getBoundingClientRect().top;
        if (itemTop < trigger) {
          item.classList.add('visible');
          item.classList.add('active');
        }
      });
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

});
