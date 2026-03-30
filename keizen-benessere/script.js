/* ============================================
   KEIZEN — Formazione e Benessere
   Global JavaScript
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
  initTabs();
  initMarquee();

  if (!isMobile && !prefersReducedMotion) {
    initCustomCursor();
    initParallax();
    initMagneticButtons();
  }

  if (!isMobile && !prefersReducedMotion) {
    initCinematic();
  }

  initTimeline();

  /* ============================================
     PRELOADER
     ============================================ */
  function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;

    const isHome = document.body.classList.contains('page-home');
    const visited = sessionStorage.getItem('keizen-visited');

    if (!isHome || visited) {
      preloader.remove();
      document.body.classList.remove('preloader-active');
      triggerHeroReveal();
      return;
    }

    if (prefersReducedMotion) {
      preloader.remove();
      document.body.classList.remove('preloader-active');
      sessionStorage.setItem('keizen-visited', 'true');
      triggerHeroReveal();
      return;
    }

    document.body.classList.add('preloader-active');
    const logo = preloader.querySelector('.preloader-logo');
    const line = preloader.querySelector('.preloader-line');

    setTimeout(() => logo && logo.classList.add('visible'), 200);
    setTimeout(() => line && line.classList.add('expand'), 600);
    setTimeout(() => {
      preloader.classList.add('exit');
      document.body.classList.remove('preloader-active');
      sessionStorage.setItem('keizen-visited', 'true');
    }, 2000);
    setTimeout(() => {
      preloader.remove();
      triggerHeroReveal();
    }, 2800);
  }

  function triggerHeroReveal() {
    document.dispatchEvent(new CustomEvent('preloaderComplete'));
    const heroEls = document.querySelectorAll('.hero-reveal');
    heroEls.forEach((el, i) => {
      setTimeout(() => el.classList.add('revealed'), i * 150);
    });
  }

  /* ============================================
     HEADER
     ============================================ */
  function initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScrollY = window.scrollY;
    let ticking = false;
    let menuOpen = false;

    window._setMenuOpen = (val) => { menuOpen = val; };

    function updateHeader() {
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
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ============================================
     MOBILE MENU
     ============================================ */
  function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.mobile-menu');
    if (!hamburger || !menu) return;

    const focusableEls = menu.querySelectorAll('a, button');
    let previousFocus = null;

    function openMenu() {
      previousFocus = document.activeElement;
      hamburger.classList.add('active');
      menu.classList.add('open');
      document.body.classList.add('menu-open');
      hamburger.setAttribute('aria-expanded', 'true');
      if (window._setMenuOpen) window._setMenuOpen(true);
      if (focusableEls.length) focusableEls[0].focus();
    }

    function closeMenu() {
      hamburger.classList.remove('active');
      menu.classList.remove('open');
      document.body.classList.remove('menu-open');
      hamburger.setAttribute('aria-expanded', 'false');
      if (window._setMenuOpen) window._setMenuOpen(false);
      if (previousFocus) previousFocus.focus();
    }

    hamburger.addEventListener('click', () => {
      menu.classList.contains('open') ? closeMenu() : openMenu();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();

      if (e.key === 'Tab' && menu.classList.contains('open')) {
        const firstEl = focusableEls[0];
        const lastEl = focusableEls[focusableEls.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    });

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  /* ============================================
     SCROLL PROGRESS
     ============================================ */
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

  /* ============================================
     REVEAL ANIMATIONS
     ============================================ */
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

  /* ============================================
     COUNTERS
     ============================================ */
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

    function animateCounter(el) {
      const target = parseInt(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const duration = 2000;
      const start = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    }
  }

  /* ============================================
     CUSTOM CURSOR
     ============================================ */
  function initCustomCursor() {
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const follower = document.createElement('div');
    follower.className = 'cursor-follower';

    dot.style.opacity = '0';
    follower.style.opacity = '0';

    document.body.appendChild(dot);
    document.body.appendChild(follower);

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    let cursorActivated = false;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;

      if (!cursorActivated) {
        cursorActivated = true;
        dot.style.opacity = '';
        follower.style.opacity = '';
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

    const selectors = 'a, button, [role="button"], input, textarea, select, label';
    document.querySelectorAll(selectors).forEach(el => {
      el.addEventListener('mouseenter', () => follower.classList.add('hover'));
      el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
    });

    document.addEventListener('mouseleave', () => { dot.classList.add('hidden'); follower.classList.add('hidden'); });
    document.addEventListener('mouseenter', () => { dot.classList.remove('hidden'); follower.classList.remove('hidden'); });
  }

  /* ============================================
     PARALLAX
     ============================================ */
  function initParallax() {
    const parallaxBgs = document.querySelectorAll('.quote-parallax-bg, .hero-image[data-parallax]');
    if (!parallaxBgs.length) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          parallaxBgs.forEach(bg => {
            const rect = bg.parentElement.getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < window.innerHeight) {
              const speed = 0.3;
              const offset = rect.top * speed;
              bg.style.transform = `translateY(${offset}px)`;
            }
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ============================================
     MAGNETIC BUTTONS
     ============================================ */
  function initMagneticButtons() {
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
        btn.style.transform = `translate(${x}px, ${y - 2}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
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
          const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
          const offset = headerHeight + 20;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: prefersReducedMotion ? 'instant' : 'smooth' });
        }
      });
    });
  }

  /* ============================================
     ACTIVE NAV
     ============================================ */
  function initActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.header-nav a, .mobile-menu-nav a').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html') || (currentPage === 'index.html' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  /* ============================================
     FORMS
     ============================================ */
  function initForms() {
    const form = document.querySelector('.contact-form form');
    if (!form) return;

    form.querySelectorAll('[required]').forEach(field => {
      field.addEventListener('blur', () => validateField(field));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll('[required]').forEach(field => {
        if (!validateField(field)) valid = false;
      });

      if (valid) {
        form.style.display = 'none';
        const success = form.parentElement.querySelector('.form-success');
        if (success) success.classList.add('visible');
      }
    });

    function validateField(field) {
      const group = field.closest('.form-group');
      if (!group) return true;
      const error = group.querySelector('.form-error');

      group.classList.remove('error', 'valid');

      if (field.type === 'checkbox') {
        if (!field.checked) {
          group.classList.add('error');
          if (error) error.textContent = 'Questo campo è obbligatorio';
          return false;
        }
        group.classList.add('valid');
        return true;
      }

      if (!field.value.trim()) {
        group.classList.add('error');
        if (error) error.textContent = 'Questo campo è obbligatorio';
        return false;
      }

      if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
        group.classList.add('error');
        if (error) error.textContent = 'Inserisci un indirizzo email valido';
        return false;
      }

      group.classList.add('valid');
      return true;
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
  function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const answer = item.querySelector('.faq-answer');
        const isOpen = item.classList.contains('active');

        item.closest('.faq-list')?.querySelectorAll('.faq-item').forEach(other => {
          other.classList.remove('active');
          other.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
          const a = other.querySelector('.faq-answer');
          if (a) a.style.maxHeight = null;
        });

        if (!isOpen) {
          item.classList.add('active');
          btn.setAttribute('aria-expanded', 'true');
          if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }

  /* ============================================
     TABS (Corsi page)
     ============================================ */
  function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        const wrapper = btn.closest('.tabs-section');
        if (!wrapper) return;

        wrapper.querySelectorAll('.tab-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        wrapper.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        const panel = wrapper.querySelector(`#panel-${target}`);
        if (panel) panel.classList.add('active');
      });
    });

    // Accordion on mobile
    document.querySelectorAll('.accordion-trigger').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        const wrapper = btn.closest('.tabs-section');
        if (!wrapper) return;

        const isOpen = btn.classList.contains('active');
        const content = btn.nextElementSibling;

        wrapper.querySelectorAll('.accordion-trigger').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-expanded', 'false');
          const c = b.nextElementSibling;
          if (c) c.style.maxHeight = null;
        });

        // Also sync tabs
        wrapper.querySelectorAll('.tab-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        wrapper.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

        if (!isOpen) {
          btn.classList.add('active');
          btn.setAttribute('aria-expanded', 'true');
          if (content) content.style.maxHeight = content.scrollHeight + 'px';
          const tabBtn = wrapper.querySelector(`.tab-btn[data-tab="${target}"]`);
          if (tabBtn) {
            tabBtn.classList.add('active');
            tabBtn.setAttribute('aria-selected', 'true');
          }
          const panel = wrapper.querySelector(`#panel-${target}`);
          if (panel) panel.classList.add('active');
        }
      });
    });

    // Init: set scrollHeight on first open accordion panel
    document.querySelectorAll('.accordion-trigger.active').forEach(btn => {
      const content = btn.nextElementSibling;
      if (content) content.style.maxHeight = content.scrollHeight + 'px';
    });
  }

  /* ============================================
     MARQUEE (ensure seamless loop)
     ============================================ */
  function initMarquee() {
    // Marquee animation is CSS-driven. No JS needed unless dynamic content.
  }

  /* ============================================
     CINEMATIC IMAGE SEQUENCE (Signature 1)
     ============================================ */
  function initCinematic() {
    const cinematic = document.querySelector('.cinematic');
    if (!cinematic) return;

    const sticky = cinematic.querySelector('.cinematic-sticky');
    const frames = cinematic.querySelectorAll('.cinematic-frame');
    if (!frames.length) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = cinematic.getBoundingClientRect();
          const totalHeight = cinematic.offsetHeight - window.innerHeight;
          const scrolled = -rect.top;
          const progress = Math.max(0, Math.min(1, scrolled / totalHeight));

          const frameIndex = Math.min(Math.floor(progress * frames.length), frames.length - 1);
          frames.forEach((f, i) => {
            f.classList.toggle('active', i === frameIndex);
          });

          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Set first frame active
    if (frames[0]) frames[0].classList.add('active');
  }

  /* ============================================
     TIMELINE (Signature 2 — Scroll-Triggered)
     ============================================ */
  function initTimeline() {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;

    const lineProgress = timeline.querySelector('.timeline-line-progress');
    const items = timeline.querySelectorAll('.timeline-item');
    if (!items.length) return;

    if (prefersReducedMotion) {
      if (lineProgress) lineProgress.style.height = '100%';
      items.forEach(item => item.classList.add('active'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.4 });

    items.forEach(item => observer.observe(item));

    // Line progress
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (!lineProgress) { ticking = false; return; }
          const timelineRect = timeline.getBoundingClientRect();
          const timelineHeight = timeline.offsetHeight;
          const windowH = window.innerHeight;
          const scrolled = windowH - timelineRect.top;
          const progress = Math.max(0, Math.min(1, scrolled / (timelineHeight + windowH * 0.5)));
          lineProgress.style.height = (progress * 100) + '%';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
});
