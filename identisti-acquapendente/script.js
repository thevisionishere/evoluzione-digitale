/* ============================================
   STUDIO IDENTISTI — Global Scripts
   LUXE Framework
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
  initCustomCursor();
  if (!isMobile) initParallax();
  if (!isMobile) initMagneticButtons();
  initSmoothScroll();
  initActiveNav();
  initForms();
  initDynamicYear();
  initFaqAccordion();
  initServiceExplorer();
  initWhatsAppPulse();

  /* ============================================
     PRELOADER — Variant E (Minimal Fade)
     ============================================ */
  function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;

    const isHome = document.body.classList.contains('page-home');
    const visited = sessionStorage.getItem('luxe-visited');

    if (!isHome || visited) {
      preloader.remove();
      revealHero();
      return;
    }

    document.body.classList.add('preloader-active');

    if (prefersReducedMotion) {
      preloader.remove();
      document.body.classList.remove('preloader-active');
      sessionStorage.setItem('luxe-visited', 'true');
      revealHero();
      return;
    }

    const logo = preloader.querySelector('.preloader-logo');
    setTimeout(() => { if (logo) logo.classList.add('visible'); }, 200);

    setTimeout(() => {
      preloader.classList.add('fade-out');
      document.body.classList.remove('preloader-active');
      sessionStorage.setItem('luxe-visited', 'true');

      setTimeout(() => {
        preloader.remove();
        document.dispatchEvent(new CustomEvent('preloaderComplete'));
        revealHero();
      }, 800);
    }, 2000);
  }

  function revealHero() {
    const hero = document.querySelector('.hero');
    if (hero) {
      setTimeout(() => hero.classList.add('hero-revealed'), 100);
    }
  }

  /* ============================================
     HEADER — Scroll behavior
     ============================================ */
  function initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScrollY = 0;
    let scrollThreshold = 5;
    let menuOpen = false;
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          if (currentScrollY > 50) {
            header.classList.add('header-scrolled');
          } else {
            header.classList.remove('header-scrolled');
          }

          if (!menuOpen) {
            if (currentScrollY > lastScrollY + scrollThreshold && currentScrollY > 100) {
              header.classList.add('header-hidden');
            } else if (currentScrollY < lastScrollY - scrollThreshold) {
              header.classList.remove('header-hidden');
            }
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    window.headerSetMenuOpen = (isOpen) => { menuOpen = isOpen; };
  }

  /* ============================================
     MOBILE MENU — Fullscreen Overlay
     ============================================ */
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
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-open');
      if (window.headerSetMenuOpen) window.headerSetMenuOpen(true);
      const header = document.querySelector('.header');
      if (header) header.classList.remove('header-hidden');
      if (links.length > 0) links[0].focus();
    }

    function closeMenu() {
      hamburger.classList.remove('active');
      menu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
      if (window.headerSetMenuOpen) window.headerSetMenuOpen(false);
      if (previousFocus) previousFocus.focus();
    }

    hamburger.addEventListener('click', () => {
      if (menu.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        closeMenu();
      }

      if (e.key === 'Tab' && menu.classList.contains('open')) {
        const focusable = [hamburger, ...links];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

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
      }
    });

    links.forEach(link => {
      link.addEventListener('click', () => closeMenu());
    });
  }

  /* ============================================
     SCROLL PROGRESS BAR
     ============================================ */
  function initScrollProgress() {
    const bar = document.querySelector('.scroll-progress-bar');
    if (!bar) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = docHeight > 0 ? window.scrollY / docHeight : 0;
          bar.style.transform = `scaleX(${progress})`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ============================================
     REVEAL ON SCROLL
     ============================================ */
  function initRevealAnimations() {
    const elements = document.querySelectorAll('.reveal-up');
    if (elements.length === 0) return;

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

  /* ============================================
     COUNTER ANIMATION
     ============================================ */
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (counters.length === 0) return;

    if (prefersReducedMotion) {
      counters.forEach(el => {
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        el.textContent = target + suffix;
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

  /* ============================================
     CUSTOM CURSOR (Desktop pointer devices only)
     ============================================ */
  function initCustomCursor() {
    if (prefersReducedMotion) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const follower = document.createElement('div');
    follower.className = 'cursor-follower';
    document.body.appendChild(dot);
    document.body.appendChild(follower);

    let mouseX = -40, mouseY = -40;
    let followerX = -40, followerY = -40;
    let running = false;

    function tick() {
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;
      follower.style.transform =
        'translate(' + (followerX - 16) + 'px,' + (followerY - 16) + 'px)';
      requestAnimationFrame(tick);
    }

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform =
        'translate(' + (mouseX - 4) + 'px,' + (mouseY - 4) + 'px)';

      if (!running) {
        running = true;
        followerX = mouseX;
        followerY = mouseY;
        follower.style.transform =
          'translate(' + (mouseX - 16) + 'px,' + (mouseY - 16) + 'px)';
        document.body.classList.add('custom-cursor');
        requestAnimationFrame(tick);
      }
    });

    // Hover effect on interactive elements
    function bindHover() {
      document.querySelectorAll('a, button, [role="button"], label').forEach(function (el) {
        if (el.dataset.cursorBound) return;
        el.dataset.cursorBound = '1';
        el.addEventListener('mouseenter', function () { follower.classList.add('hover'); });
        el.addEventListener('mouseleave', function () { follower.classList.remove('hover'); });
      });
    }

    bindHover();
    new MutationObserver(bindHover).observe(document.body, { childList: true, subtree: true });
  }

  /* ============================================
     PARALLAX (Desktop only)
     ============================================ */
  function initParallax() {
    if (prefersReducedMotion) return;

    const heroImage = document.querySelector('.hero-image img');
    if (!heroImage) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const hero = heroImage.closest('.hero');
          if (hero) {
            const rect = hero.getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < window.innerHeight) {
              heroImage.style.transform = `translateY(${window.scrollY * 0.15}px) scale(1.1)`;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    heroImage.style.transform = 'scale(1.1)';
  }

  /* ============================================
     MAGNETIC BUTTONS (Desktop only)
     ============================================ */
  function initMagneticButtons() {
    if (prefersReducedMotion) return;

    const buttons = document.querySelectorAll('.magnetic-btn');
    buttons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }

  /* ============================================
     SMOOTH SCROLL
     ============================================ */
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
          window.scrollTo({
            top,
            behavior: prefersReducedMotion ? 'instant' : 'smooth'
          });
        }
      });
    });
  }

  /* ============================================
     ACTIVE NAV LINK (multi-page)
     ============================================ */
  function initActiveNav() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.header-nav a, .mobile-menu-nav a');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;

      const linkPath = new URL(href, window.location.origin).pathname;

      if (currentPath === linkPath) {
        link.classList.add('active');
      } else if (currentPath.includes('/servizi/') && href.includes('servizi.html')) {
        link.classList.add('active');
      }
    });
  }

  /* ============================================
     FORM VALIDATION
     ============================================ */
  function initForms() {
    const forms = document.querySelectorAll('form[data-validate]');
    forms.forEach(form => {
      const fields = form.querySelectorAll('[required]');
      const successEl = form.parentElement?.querySelector('.form-success');

      fields.forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
          const group = field.closest('.form-group');
          if (group && group.classList.contains('error')) {
            validateField(field);
          }
        });
      });

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;

        fields.forEach(field => {
          if (!validateField(field)) valid = false;
        });

        const checkbox = form.querySelector('input[type="checkbox"][required]');
        if (checkbox && !checkbox.checked) {
          valid = false;
        }

        if (valid) {
          form.style.display = 'none';
          if (successEl) successEl.classList.add('visible');
        } else {
          const firstError = form.querySelector('.form-group.error');
          if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            const input = firstError.querySelector('input, textarea, select');
            if (input) input.focus();
          }
        }
      });
    });

    function validateField(field) {
      const group = field.closest('.form-group');
      if (!group) return true;

      const errorMsg = group.querySelector('.form-error-message');
      let valid = true;

      if (field.hasAttribute('required') && !field.value.trim()) {
        valid = false;
        if (errorMsg) errorMsg.textContent = 'Questo campo è obbligatorio';
      } else if (field.type === 'email' && field.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
          valid = false;
          if (errorMsg) errorMsg.textContent = 'Inserisci un indirizzo email valido';
        }
      } else if (field.type === 'tel' && field.value) {
        const telRegex = /^[\d\s\+\-\.()]{6,}$/;
        if (!telRegex.test(field.value)) {
          valid = false;
          if (errorMsg) errorMsg.textContent = 'Inserisci un numero di telefono valido';
        }
      }

      if (valid) {
        group.classList.remove('error');
        group.classList.add('valid');
      } else {
        group.classList.add('error');
        group.classList.remove('valid');
      }

      return valid;
    }
  }

  /* ============================================
     DYNAMIC YEAR
     ============================================ */
  function initDynamicYear() {
    document.querySelectorAll('[data-year]').forEach(el => {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ============================================
     FAQ ACCORDION
     ============================================ */
  function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length === 0) return;

    faqItems.forEach(item => {
      const trigger = item.querySelector('.faq-trigger');
      const answer = item.querySelector('.faq-answer');
      if (!trigger || !answer) return;

      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        faqItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('active');
            const otherAnswer = other.querySelector('.faq-answer');
            if (otherAnswer) otherAnswer.style.maxHeight = '0';
            const otherTrigger = other.querySelector('.faq-trigger');
            if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          }
        });

        if (isActive) {
          item.classList.remove('active');
          answer.style.maxHeight = '0';
          trigger.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ============================================
     SERVICE EXPLORER (Home)
     ============================================ */
  function initServiceExplorer() {
    const explorerItems = document.querySelectorAll('.explorer-item');
    if (explorerItems.length === 0) return;

    if (explorerItems.length > 0) {
      const first = explorerItems[0];
      first.classList.add('active');
      const firstContent = first.querySelector('.explorer-content');
      if (firstContent) {
        firstContent.style.maxHeight = firstContent.scrollHeight + 'px';
      }
    }

    explorerItems.forEach(item => {
      const trigger = item.querySelector('.explorer-trigger');
      const content = item.querySelector('.explorer-content');
      if (!trigger || !content) return;

      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        explorerItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('active');
            const otherContent = other.querySelector('.explorer-content');
            if (otherContent) otherContent.style.maxHeight = '0';
          }
        });

        if (isActive) {
          item.classList.remove('active');
          content.style.maxHeight = '0';
        } else {
          item.classList.add('active');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    });
  }

  /* ============================================
     WHATSAPP PULSE
     ============================================ */
  function initWhatsAppPulse() {
    const waBtn = document.querySelector('.whatsapp-btn');
    if (!waBtn || prefersReducedMotion) return;

    setTimeout(() => waBtn.classList.add('pulse'), 3000);
    waBtn.addEventListener('animationend', () => waBtn.classList.remove('pulse'));
  }
});
