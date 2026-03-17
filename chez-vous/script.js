/* ============================================
   CHEZ VOUS 3.0 — Script
   Premium Cocktail Bar & Restaurant Lounge
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const isMobile = !window.matchMedia('(hover: hover)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let menuOpen = false;

  initPreloader();
  initHeader();
  initMobileMenu();
  initScrollProgress();
  initRevealAnimations();
  initSmoothScroll();
  initActiveNav();
  initDynamicYear();
  initMarquee();
  initCinematic();
  initCocktailCards();
  if (!isMobile) initCustomCursor();
  if (!isMobile) initParallax();
  if (!isMobile) initMagneticButtons();

  /* ----------------------------------------
     PRELOADER — Variant A (Logo + Line)
     ---------------------------------------- */
  function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;

    if (sessionStorage.getItem('luxe-visited') || prefersReducedMotion) {
      preloader.remove();
      document.body.classList.remove('preloader-active');
      revealHero();
      return;
    }

    document.body.classList.add('preloader-active');

    setTimeout(() => preloader.classList.add('active'), 100);
    setTimeout(() => {
      preloader.classList.add('done');
      document.body.classList.remove('preloader-active');
      sessionStorage.setItem('luxe-visited', 'true');
      setTimeout(() => {
        preloader.setAttribute('aria-hidden', 'true');
        revealHero();
      }, 800);
    }, 2800);
  }

  function revealHero() {
    const heroElements = document.querySelectorAll('.hero-label, .hero-title, .hero-desc, .hero-ctas');
    heroElements.forEach((el, i) => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        el.style.transition = `opacity 0.8s ${getComputedStyle(document.documentElement).getPropertyValue('--ease-out')}, transform 0.8s ${getComputedStyle(document.documentElement).getPropertyValue('--ease-out')}`;
      }, i * 150);
    });
    const heroScroll = document.querySelector('.hero-scroll');
    if (heroScroll) {
      heroScroll.style.animationDelay = '0.6s';
    }
  }

  /* ----------------------------------------
     HEADER SCROLL BEHAVIOR
     ---------------------------------------- */
  function initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScrollY = 0;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
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
          } else if (scrollY < lastScrollY - 5) {
            header.classList.remove('header-hidden');
          }
        }

        lastScrollY = scrollY;
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ----------------------------------------
     MOBILE MENU — Fullscreen Overlay
     ---------------------------------------- */
  function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.mobile-menu');
    if (!hamburger || !menu) return;

    const menuLinks = menu.querySelectorAll('a');
    let previousFocus = null;

    function openMenu() {
      previousFocus = document.activeElement;
      hamburger.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
      menu.classList.add('open');
      document.body.style.overflow = 'hidden';
      menuOpen = true;
      if (menuLinks.length) menuLinks[0].focus();
    }

    function closeMenu() {
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      menu.classList.remove('open');
      document.body.style.overflow = '';
      menuOpen = false;
      if (previousFocus) previousFocus.focus();
    }

    hamburger.addEventListener('click', () => {
      menu.classList.contains('open') ? closeMenu() : openMenu();
    });

    menuLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        closeMenu();
      }
      if (e.key === 'Tab' && menu.classList.contains('open')) {
        const focusables = [hamburger, ...menuLinks];
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
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

  /* ----------------------------------------
     SCROLL PROGRESS BAR
     ---------------------------------------- */
  function initScrollProgress() {
    const bar = document.querySelector('.scroll-progress-bar');
    if (!bar) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? window.scrollY / docHeight : 0;
        bar.style.transform = `scaleX(${progress})`;
        ticking = false;
      });
    }, { passive: true });
  }

  /* ----------------------------------------
     REVEAL ON SCROLL
     ---------------------------------------- */
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

  /* ----------------------------------------
     SMOOTH SCROLL
     ---------------------------------------- */
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

  /* ----------------------------------------
     ACTIVE NAV (Page-based for multi-page)
     ---------------------------------------- */
  function initActiveNav() {
    const navLinks = document.querySelectorAll('.header-nav a:not(.header-cta), .mobile-menu-nav a');
    if (!navLinks.length) return;

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html') || (currentPage === 'index.html' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  /* ----------------------------------------
     DYNAMIC YEAR
     ---------------------------------------- */
  function initDynamicYear() {
    document.querySelectorAll('[data-year]').forEach(el => {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ----------------------------------------
     MARQUEE (ensure seamless loop)
     ---------------------------------------- */
  function initMarquee() {
    const track = document.querySelector('.marquee-track');
    if (!track) return;
    // Content is duplicated in HTML for seamless loop — no JS needed
    // CSS animation handles the movement
  }

  /* ----------------------------------------
     CINEMATIC IMAGE SEQUENCE — SM1
     ---------------------------------------- */
  function initCinematic() {
    const section = document.querySelector('.cinematic');
    if (!section) return;

    const frames = section.querySelectorAll('.cinematic-frame');
    const dots = section.querySelectorAll('.cinematic-dot');
    if (!frames.length) return;

    let currentIndex = 0;
    let autoplayInterval;

    function showFrame(index) {
      frames.forEach((f, i) => {
        const isActive = i === index;
        f.classList.toggle('active', isActive);
        f.setAttribute('aria-hidden', !isActive);
      });
      dots.forEach((d, i) => {
        d.classList.toggle('active', i === index);
      });
      currentIndex = index;
    }

    // Auto-advance
    function startAutoplay() {
      autoplayInterval = setInterval(() => {
        showFrame((currentIndex + 1) % frames.length);
      }, 4000);
    }

    // Dot click
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        clearInterval(autoplayInterval);
        showFrame(i);
        startAutoplay();
      });
    });

    // Scroll-driven on desktop: cross-fade based on scroll position within section
    if (!isMobile && !prefersReducedMotion) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            startAutoplay();
          } else {
            clearInterval(autoplayInterval);
          }
        });
      }, { threshold: 0.3 });
      observer.observe(section);
    } else {
      // Mobile: swipe support + lazy autoplay via IntersectionObserver
      let touchStartX = 0;
      section.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        clearInterval(autoplayInterval);
      }, { passive: true });
      section.addEventListener('touchend', (e) => {
        const diff = e.changedTouches[0].screenX - touchStartX;
        if (Math.abs(diff) > 50) {
          if (diff < 0) {
            showFrame((currentIndex + 1) % frames.length);
          } else {
            showFrame((currentIndex - 1 + frames.length) % frames.length);
          }
        }
        startAutoplay();
      }, { passive: true });

      const mobileObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            startAutoplay();
          } else {
            clearInterval(autoplayInterval);
          }
        });
      }, { threshold: 0.3 });
      mobileObserver.observe(section);
    }

    showFrame(0);
  }

  /* ----------------------------------------
     COCKTAIL CARDS — SM2 (Mobile tap)
     ---------------------------------------- */
  function initCocktailCards() {
    if (isMobile) {
      const cards = document.querySelectorAll('.cocktail-card');
      cards.forEach(card => {
        card.addEventListener('click', () => {
          cards.forEach(c => { if (c !== card) c.classList.remove('tapped'); });
          card.classList.toggle('tapped');
        });
      });
    }
  }

  /* ----------------------------------------
     CUSTOM CURSOR (Desktop only)
     ---------------------------------------- */
  function initCustomCursor() {
    if (prefersReducedMotion) return;

    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const follower = document.createElement('div');
    follower.className = 'cursor-follower';

    document.body.appendChild(dot);
    document.body.appendChild(follower);

    let mouseX = -100, mouseY = -100;
    let followerX = -100, followerY = -100;

    dot.style.transform = `translate(-100px, -100px)`;
    follower.style.transform = `translate(-100px, -100px)`;
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

    const selectors = 'a, button, [role="button"], input, textarea, select, label, .cocktail-card, .gallery-item';
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

  /* ----------------------------------------
     PARALLAX (Desktop only)
     ---------------------------------------- */
  function initParallax() {
    if (prefersReducedMotion) return;

    const heroBg = document.querySelector('.hero-bg img');
    const storyBg = document.querySelector('.story-strip-bg img');
    const targets = [heroBg, storyBg].filter(Boolean);

    if (!targets.length) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        targets.forEach(img => {
          const section = img.closest('section') || img.closest('.hero') || img.closest('.story-strip');
          if (!section) return;
          const rect = section.getBoundingClientRect();
          if (rect.bottom > 0 && rect.top < window.innerHeight) {
            const scrolled = -rect.top * 0.3;
            img.style.transform = `translateY(${scrolled}px) scale(1.1)`;
          }
        });
        ticking = false;
      });
    }, { passive: true });
  }

  /* ----------------------------------------
     MAGNETIC BUTTONS (Desktop only)
     ---------------------------------------- */
  function initMagneticButtons() {
    if (prefersReducedMotion) return;

    document.querySelectorAll('.magnetic-btn').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) translateY(-2px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transition = 'transform 400ms cubic-bezier(0.16, 1, 0.3, 1)';
        btn.style.transform = '';
      });
    });
  }
});
