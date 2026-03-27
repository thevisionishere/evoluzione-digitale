/* ============================================================
   DEREKH SOLUZIONI — Premium Website Script
   ============================================================ */

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
  initTechTabs();

  /* ----------------------------------------------------------
     1. PRELOADER
  ---------------------------------------------------------- */
  function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;

    const isHome = document.body.classList.contains('page-home');
    const visited = sessionStorage.getItem('derekh-visited');

    if (!isHome || visited) {
      preloader.remove();
      triggerHeroReveal();
      return;
    }

    sessionStorage.setItem('derekh-visited', 'true');
    document.body.classList.add('preloader-active');

    const logo = preloader.querySelector('.preloader-logo');
    const line = preloader.querySelector('.preloader-line');

    setTimeout(() => logo && logo.classList.add('visible'), 300);
    setTimeout(() => line && line.classList.add('expand'), 800);
    setTimeout(() => {
      preloader.classList.add('done');
      document.body.classList.remove('preloader-active');
      triggerHeroReveal();
      setTimeout(() => preloader.remove(), 1000);
    }, 2200);
  }

  function triggerHeroReveal() {
    const hero = document.querySelector('.hero');
    if (hero) {
      setTimeout(() => hero.classList.add('animate'), 100);
    }
    document.dispatchEvent(new CustomEvent('preloaderComplete'));
  }

  /* ----------------------------------------------------------
     2. HEADER
  ---------------------------------------------------------- */
  function initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScrollY = window.scrollY;
    let ticking = false;
    let menuOpen = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentY = window.scrollY;

          if (currentY > 50) {
            header.classList.add('header-scrolled');
          } else {
            header.classList.remove('header-scrolled');
          }

          if (!menuOpen) {
            if (currentY > lastScrollY && currentY > 100) {
              header.classList.add('header-hidden');
            } else {
              header.classList.remove('header-hidden');
            }
          }

          lastScrollY = currentY;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    document.addEventListener('menuToggle', (e) => {
      menuOpen = e.detail.open;
      if (menuOpen) header.classList.remove('header-hidden');
    });
  }

  /* ----------------------------------------------------------
     3. MOBILE MENU
  ---------------------------------------------------------- */
  function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.mobile-menu');
    if (!hamburger || !menu) return;

    const links = menu.querySelectorAll('.mobile-menu-link');
    let previousFocus = null;

    function openMenu() {
      previousFocus = document.activeElement;
      hamburger.classList.add('active');
      menu.classList.add('open');
      document.body.classList.add('menu-open');
      hamburger.setAttribute('aria-expanded', 'true');
      document.dispatchEvent(new CustomEvent('menuToggle', { detail: { open: true } }));
      if (links.length) links[0].focus();
    }

    function closeMenu() {
      hamburger.classList.remove('active');
      menu.classList.remove('open');
      document.body.classList.remove('menu-open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.dispatchEvent(new CustomEvent('menuToggle', { detail: { open: false } }));
      if (previousFocus) previousFocus.focus();
    }

    hamburger.addEventListener('click', () => {
      menu.classList.contains('open') ? closeMenu() : openMenu();
    });

    links.forEach(link => link.addEventListener('click', closeMenu));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
    });

    // Focus trap
    menu.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
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
    });
  }

  /* ----------------------------------------------------------
     4. SCROLL PROGRESS
  ---------------------------------------------------------- */
  function initScrollProgress() {
    const bar = document.querySelector('.scroll-progress-bar');
    if (!bar) return;

    window.addEventListener('scroll', () => {
      requestAnimationFrame(() => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        const progress = h > 0 ? window.scrollY / h : 0;
        bar.style.transform = `scaleX(${progress})`;
      });
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     5. REVEAL ON SCROLL
  ---------------------------------------------------------- */
  function initRevealAnimations() {
    const els = document.querySelectorAll('.reveal-up');
    if (!els.length) return;

    if (prefersReducedMotion) {
      els.forEach(el => el.classList.add('revealed'));
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

    els.forEach(el => observer.observe(el));
  }

  /* ----------------------------------------------------------
     6. COUNTERS
  ---------------------------------------------------------- */
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

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
    const target = parseInt(element.dataset.count);
    const suffix = element.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();

    if (prefersReducedMotion) {
      element.textContent = target + suffix;
      return;
    }

    function update(currentTime) {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  /* ----------------------------------------------------------
     7. CUSTOM CURSOR
  ---------------------------------------------------------- */
  function initCustomCursor() {
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const follower = document.createElement('div');
    follower.className = 'cursor-follower';

    dot.style.transform = 'translate(-100px, -100px)';
    follower.style.transform = 'translate(-100px, -100px)';

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

    const hoverTargets = 'a, button, [role="button"], input, textarea, select, label';
    document.querySelectorAll(hoverTargets).forEach(el => {
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

  /* ----------------------------------------------------------
     8. PARALLAX
  ---------------------------------------------------------- */
  function initParallax() {
    if (prefersReducedMotion) return;
    const heroImg = document.querySelector('.hero-image img');
    if (!heroImg) return;

    window.addEventListener('scroll', () => {
      requestAnimationFrame(() => {
        const rect = heroImg.closest('.hero').getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          heroImg.style.transform = `translateY(${window.scrollY * 0.15}px)`;
        }
      });
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     9. MAGNETIC BUTTONS
  ---------------------------------------------------------- */
  function initMagneticButtons() {
    if (prefersReducedMotion) return;
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }

  /* ----------------------------------------------------------
     10. SMOOTH SCROLL
  ---------------------------------------------------------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const headerH = document.querySelector('.header')?.offsetHeight || 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH - 20;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  /* ----------------------------------------------------------
     11. ACTIVE NAV
  ---------------------------------------------------------- */
  function initActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link, .mobile-menu-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  /* ----------------------------------------------------------
     12. FORMS
  ---------------------------------------------------------- */
  function initForms() {
    const form = document.querySelector('.contact-form form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      form.querySelectorAll('[required]').forEach(input => {
        const group = input.closest('.form-group');
        if (!input.value.trim()) {
          group.classList.add('invalid');
          valid = false;
        } else {
          group.classList.remove('invalid');
        }

        if (input.type === 'email' && input.value) {
          const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRe.test(input.value)) {
            group.classList.add('invalid');
            valid = false;
          }
        }
      });

      const privacy = form.querySelector('input[type="checkbox"]');
      if (privacy && !privacy.checked) {
        valid = false;
        privacy.closest('.form-privacy')?.classList.add('invalid');
      }

      if (valid) {
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Messaggio Inviato!';
        btn.disabled = true;
        btn.style.background = 'var(--color-success)';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
          btn.style.background = '';
          form.reset();
        }, 3000);
      }
    });

    form.querySelectorAll('[required]').forEach(input => {
      input.addEventListener('input', () => {
        input.closest('.form-group')?.classList.remove('invalid');
      });
      if (input.type === 'checkbox') {
        input.addEventListener('change', () => {
          input.closest('.form-privacy')?.classList.remove('invalid');
        });
      }
    });
  }

  /* ----------------------------------------------------------
     13. DYNAMIC YEAR
  ---------------------------------------------------------- */
  function initDynamicYear() {
    const el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ----------------------------------------------------------
     14. TECHNOLOGY TABS
  ---------------------------------------------------------- */
  function initTechTabs() {
    const tabs = document.querySelectorAll('.tech-tab');
    const panels = document.querySelectorAll('.tech-panel');
    if (!tabs.length) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const panel = document.getElementById(target);
        if (panel) panel.classList.add('active');
      });
    });
  }
});
