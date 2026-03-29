/* =============================================
   APPETIT NUTRITION — script.js
   LUXE Framework Build
   ============================================= */

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
  initTextReveal();
  initProcessLine();
  initPillarCards();

  if (!isMobile && !prefersReducedMotion) {
    initParallax();
    initMagneticButtons();
  }

  /* === PRELOADER (Variant E — Minimal Fade) === */
  function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;

    const isHome = document.body.classList.contains('page-home');
    const visited = sessionStorage.getItem('appetit-visited');

    if (!isHome || visited) {
      preloader.remove();
      document.body.classList.remove('preloader-active');
      triggerHeroReveal();
      return;
    }

    sessionStorage.setItem('appetit-visited', 'true');
    document.body.classList.add('preloader-active');

    setTimeout(() => {
      preloader.classList.add('fade-out');
      document.body.classList.remove('preloader-active');
      setTimeout(() => {
        preloader.remove();
        triggerHeroReveal();
      }, 600);
    }, 1800);
  }

  function triggerHeroReveal() {
    if (!document.querySelector('.hero-content')) return;
    if (prefersReducedMotion) {
      document.querySelectorAll('.hero-content, .hero-image').forEach(el => el.classList.add('revealed'));
      return;
    }
    setTimeout(() => {
      document.querySelectorAll('.hero-content, .hero-image').forEach(el => el.classList.add('revealed'));
    }, 150);
  }

  /* === HEADER === */
  function initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScrollY = window.scrollY;
    let ticking = false;
    let menuOpen = false;

    window.headerMenuOpen = (val) => { menuOpen = val; };

    function updateHeader() {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 50) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }

      if (!menuOpen) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
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

  /* === MOBILE MENU === */
  function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.mobile-menu');
    if (!hamburger || !menu) return;

    const links = menu.querySelectorAll('a');
    let previousFocus = null;

    function openMenu() {
      previousFocus = document.activeElement;
      hamburger.classList.add('active');
      menu.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      window.headerMenuOpen(true);

      links.forEach((link, i) => {
        link.style.transitionDelay = `${i * 60}ms`;
      });

      setTimeout(() => { if (links[0]) links[0].focus(); }, 400);
    }

    function closeMenu() {
      hamburger.classList.remove('active');
      menu.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      window.headerMenuOpen(false);

      links.forEach(link => { link.style.transitionDelay = '0ms'; });

      if (previousFocus) previousFocus.focus();
    }

    hamburger.addEventListener('click', () => {
      menu.classList.contains('active') ? closeMenu() : openMenu();
    });

    links.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('active')) closeMenu();

      if (e.key === 'Tab' && menu.classList.contains('active')) {
        const focusable = [hamburger, ...links];
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
  }

  /* === SCROLL PROGRESS BAR === */
  function initScrollProgress() {
    const bar = document.querySelector('.scroll-progress-bar');
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

  /* === REVEAL ON SCROLL === */
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

  /* === COUNTER ANIMATION === */
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
  }

  function animateCounter(element) {
    const target = parseFloat(element.dataset.count);
    const suffix = element.dataset.suffix || '';
    const isDecimal = target % 1 !== 0;
    const duration = 2000;
    const start = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;
      element.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  /* === SMOOTH SCROLL === */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
          const offset = headerHeight + 20;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: prefersReducedMotion ? 'instant' : 'smooth' });
        }
      });
    });
  }

  /* === ACTIVE NAV LINK === */
  function initActiveNav() {
    const navLinks = document.querySelectorAll('.header-nav a:not(.header-cta), .mobile-menu a:not(.mobile-cta)');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html') || (currentPage === 'index.html' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  /* === FORM VALIDATION === */
  function initForms() {
    const form = document.querySelector('.contact-form form');
    if (!form) return;

    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.closest('.form-group').classList.contains('error')) {
          validateField(field);
        }
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let hasErrors = false;

      requiredFields.forEach(field => {
        if (!validateField(field)) hasErrors = true;
      });

      if (!hasErrors) {
        form.style.display = 'none';
        const success = form.parentElement.querySelector('.form-success');
        if (success) success.classList.add('visible');
      } else {
        const firstError = form.querySelector('.form-group.error input, .form-group.error select, .form-group.error textarea');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstError.focus();
        }
      }
    });
  }

  function validateField(field) {
    const group = field.closest('.form-group');
    const errorMsg = group?.querySelector('.error-message');

    if (!field.value.trim()) {
      group.classList.add('error');
      group.classList.remove('valid');
      if (errorMsg) errorMsg.textContent = 'Questo campo è obbligatorio';
      return false;
    }

    if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
      group.classList.add('error');
      group.classList.remove('valid');
      if (errorMsg) errorMsg.textContent = 'Inserisci un\'email valida';
      return false;
    }

    group.classList.remove('error');
    group.classList.add('valid');
    return true;
  }

  /* === DYNAMIC YEAR === */
  function initDynamicYear() {
    document.querySelectorAll('[data-year]').forEach(el => {
      el.textContent = new Date().getFullYear();
    });
  }

  /* === FAQ ACCORDION === */
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

  /* === TEXT REVEAL ON SCROLL (Signature 1) === */
  function initTextReveal() {
    const section = document.querySelector('.text-reveal-section');
    if (!section) return;

    const words = section.querySelectorAll('.text-reveal-title .word');
    if (!words.length) return;

    if (prefersReducedMotion) {
      words.forEach(w => w.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startTextReveal(words, section);
          observer.unobserve(section);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(section);
  }

  function startTextReveal(words, section) {
    function onScroll() {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const viewportHeight = window.innerHeight;
      const progress = Math.max(0, Math.min(1, (viewportHeight - sectionTop) / (viewportHeight + sectionHeight * 0.5)));

      words.forEach((word, i) => {
        const wordProgress = (i + 1) / words.length;
        if (progress >= wordProgress * 0.8) {
          word.classList.add('visible');
        }
      });

      if (progress >= 1) {
        window.removeEventListener('scroll', onScroll);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* === PROCESS LINE ANIMATION === */
  function initProcessLine() {
    const steps = document.querySelectorAll('.process-step');
    const lineFill = document.querySelector('.process-line-fill');
    if (!steps.length) return;

    if (prefersReducedMotion) {
      steps.forEach(s => s.classList.add('revealed'));
      if (lineFill) lineFill.style.height = '100%';
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');

          if (lineFill) {
            const revealedCount = document.querySelectorAll('.process-step.revealed').length;
            const totalSteps = steps.length;
            lineFill.style.height = `${(revealedCount / totalSteps) * 100}%`;
          }

          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    steps.forEach(step => observer.observe(step));
  }

  /* === PILLAR CARDS (Mobile Tap) === */
  function initPillarCards() {
    if (!isMobile) return;
    const cards = document.querySelectorAll('.pillar-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        cards.forEach(c => { if (c !== card) c.classList.remove('tapped'); });
        card.classList.toggle('tapped');
      });
    });
  }

  /* === PARALLAX === */
  function initParallax() {
    const heroImage = document.querySelector('.hero-image img');
    if (!heroImage) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = heroImage.closest('.hero')?.getBoundingClientRect();
          if (rect && rect.bottom > 0 && rect.top < window.innerHeight) {
            heroImage.style.transform = `translateY(${window.scrollY * 0.15}px) scale(1.05)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* === MAGNETIC BUTTONS === */
  function initMagneticButtons() {
    const buttons = document.querySelectorAll('.magnetic-btn, .header-cta');
    buttons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) translateY(-2px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }
});
