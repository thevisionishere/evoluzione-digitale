/* ========================================
   IL POGGIO DI TEO — Global Interactions
   ======================================== */

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
  initCinematic();
  initTabs();
  initQuoteParallax();

  if (!isMobile) initCustomCursor();
  if (!isMobile && !prefersReducedMotion) initParallax();
  if (!isMobile) initMagneticButtons();

  /* ------ PRELOADER ------ */
  function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;

    const isHome = document.body.dataset.page === 'home';
    const visited = sessionStorage.getItem('poggio-visited') || localStorage.getItem('poggio-preloader-done');

    if (!isHome || visited) {
      preloader.remove();
      document.body.classList.remove('preloader-active');
      revealHero();
      return;
    }

    document.body.classList.add('preloader-active');

    requestAnimationFrame(() => {
      preloader.classList.add('active');
    });

    setTimeout(() => {
      preloader.classList.add('done');
      document.body.classList.remove('preloader-active');
      sessionStorage.setItem('poggio-visited', 'true');
      localStorage.setItem('poggio-preloader-done', 'true');

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
      setTimeout(() => hero.classList.add('revealed'), 100);
    }
  }

  /* ------ HEADER ------ */
  function initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScrollY = 0;
    let ticking = false;
    const threshold = 5;
    const menuOpen = () => document.body.classList.contains('menu-open');

    function updateHeader() {
      const scrollY = window.scrollY;

      if (scrollY > 50) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }

      if (!menuOpen()) {
        if (scrollY > lastScrollY && scrollY - lastScrollY > threshold && scrollY > 100) {
          header.classList.add('header-hidden');
        } else if (lastScrollY - scrollY > threshold) {
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

  /* ------ MOBILE MENU ------ */
  function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (!hamburger || !mobileMenu) return;

    const links = mobileMenu.querySelectorAll('a');
    let previousFocus = null;

    function openMenu() {
      previousFocus = document.activeElement;
      hamburger.classList.add('active');
      mobileMenu.classList.add('open');
      document.body.classList.add('menu-open');
      hamburger.setAttribute('aria-expanded', 'true');
      if (links.length) links[0].focus();
    }

    function closeMenu() {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.classList.remove('menu-open');
      hamburger.setAttribute('aria-expanded', 'false');
      if (previousFocus) previousFocus.focus();
    }

    hamburger.addEventListener('click', () => {
      mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();

      if (e.key === 'Tab' && mobileMenu.classList.contains('open')) {
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

    links.forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  /* ------ SCROLL PROGRESS ------ */
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

  /* ------ REVEAL ON SCROLL ------ */
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

  /* ------ COUNTERS ------ */
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

  /* ------ CUSTOM CURSOR ------ */
  function initCustomCursor() {
    if (prefersReducedMotion) return;

    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const follower = document.createElement('div');
    follower.className = 'cursor-follower';

    dot.style.left = '-100px';
    dot.style.top = '-100px';
    follower.style.left = '-100px';
    follower.style.top = '-100px';

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

    const selectors = 'a, button, [role="button"], input, textarea, select, label';
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

  /* ------ PARALLAX (Hero) ------ */
  function initParallax() {
    const heroBg = document.querySelector('.hero-bg img');
    if (!heroBg) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const heroH = document.querySelector('.hero').offsetHeight;
          if (scrollY < heroH) {
            heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ------ MAGNETIC BUTTONS ------ */
  function initMagneticButtons() {
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) translateY(-2px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ------ SMOOTH SCROLL ------ */
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
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

  /* ------ ACTIVE NAV ------ */
  function initActiveNav() {
    const navLinks = document.querySelectorAll('.header-nav a, .mobile-menu a');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html') ||
          (currentPage === 'index.html' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  /* ------ FORM VALIDATION ------ */
  function initForms() {
    const forms = document.querySelectorAll('form[data-validate]');
    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        let valid = true;
        form.querySelectorAll('[required]').forEach(field => {
          const group = field.closest('.form-group');
          if (!field.value.trim()) {
            group?.classList.add('error');
            valid = false;
          } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
            group?.classList.add('error');
            valid = false;
          } else {
            group?.classList.remove('error');
          }
        });
        if (!valid) e.preventDefault();
      });

      form.querySelectorAll('[required]').forEach(field => {
        field.addEventListener('input', () => {
          const group = field.closest('.form-group');
          if (field.value.trim()) group?.classList.remove('error');
        });
      });
    });
  }

  /* ------ DYNAMIC YEAR ------ */
  function initDynamicYear() {
    const yearEl = document.querySelector('.current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  /* ------ CINEMATIC IMAGE SEQUENCE ------ */
  function initCinematic() {
    const section = document.querySelector('.cinematic');
    if (!section) return;

    const slides = section.querySelectorAll('.cinematic-slide');
    const dots = section.querySelectorAll('.cinematic-dot');
    if (!slides.length) return;

    if (prefersReducedMotion) {
      slides[0].classList.add('active');
      if (dots[0]) dots[0].classList.add('active');
      return;
    }

    let currentSlide = 0;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startCinematic();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(section);

    function startCinematic() {
      slides[0].classList.add('active');
      if (dots[0]) dots[0].classList.add('active');

      setInterval(() => {
        slides[currentSlide].classList.remove('active');
        if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
      }, 3000);
    }

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
      });
    });
  }

  /* ------ TABS ------ */
  function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    if (!tabBtns.length) return;

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(target)?.classList.add('active');
      });
    });
  }

  /* ------ QUOTE PARALLAX ------ */
  function initQuoteParallax() {
    if (isMobile || prefersReducedMotion) return;
    const bg = document.querySelector('.quote-parallax-bg img');
    if (!bg) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const section = bg.closest('.quote-parallax');
          const rect = section.getBoundingClientRect();
          if (rect.bottom > 0 && rect.top < window.innerHeight) {
            const offset = rect.top * 0.3;
            bg.style.transform = `translateY(${offset}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ------ EXPERIENCE TIMELINE ------ */
  const timelineFill = document.querySelector('.experience-line-fill');
  if (timelineFill) {
    const timeline = timelineFill.closest('.experience-timeline');
    if (timeline && !prefersReducedMotion) {
      window.addEventListener('scroll', () => {
        requestAnimationFrame(() => {
          const rect = timeline.getBoundingClientRect();
          const h = timeline.offsetHeight;
          const visible = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (h + window.innerHeight * 0.5)));
          timelineFill.style.height = (visible * 100) + '%';
        });
      }, { passive: true });
    }
  }
});
