/* ============================================
   RISTORANTE ACQUAROSSA — LUXE Framework
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
  // Custom cursor removed
  if (!isMobile) initParallax();
  if (!isMobile) initMagneticButtons();
  initSmoothScroll();
  initActiveNav();
  initMobileDropdowns();
  initForms();
  initDynamicYear();
  initMarquee();
  initCinematic();
  initTimelineProgress();

  /* ==========================================
     PRELOADER — Variant A (Logo + Line)
     ========================================== */
  function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;

    const isHome = document.body.classList.contains('page-home');
    const visited = sessionStorage.getItem('acquarossa-visited');

    if (!isHome || visited) {
      preloader.remove();
      revealHero();
      return;
    }

    if (prefersReducedMotion) {
      preloader.remove();
      sessionStorage.setItem('acquarossa-visited', 'true');
      revealHero();
      return;
    }

    document.body.classList.add('no-scroll');
    const name = preloader.querySelector('.preloader-name');
    const line = preloader.querySelector('.preloader-line');

    setTimeout(() => { if (name) name.classList.add('visible'); }, 300);
    setTimeout(() => { if (line) line.classList.add('expand'); }, 800);
    setTimeout(() => {
      preloader.classList.add('exit');
      document.body.classList.remove('no-scroll');
      sessionStorage.setItem('acquarossa-visited', 'true');
      setTimeout(() => {
        preloader.remove();
        document.dispatchEvent(new CustomEvent('preloaderComplete'));
      }, 800);
    }, 2200);
  }

  function revealHero() {
    setTimeout(() => {
      document.dispatchEvent(new CustomEvent('preloaderComplete'));
    }, 100);
  }

  /* ==========================================
     HEADER — Scroll Behavior
     ========================================== */
  function initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScrollY = window.scrollY;
    let ticking = false;
    let menuOpen = false;

    window._setMenuOpen = (val) => { menuOpen = val; };

    function updateHeader() {
      const currentY = window.scrollY;

      if (currentY > 50) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }

      if (!menuOpen) {
        if (currentY > lastScrollY && currentY > 100) {
          header.classList.add('header-hidden');
        } else if (currentY < lastScrollY) {
          header.classList.remove('header-hidden');
        }
      }

      lastScrollY = currentY;
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ==========================================
     MOBILE MENU — Fullscreen Overlay
     ========================================== */
  function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.mobile-menu');
    if (!hamburger || !menu) return;

    const links = menu.querySelectorAll('.mobile-menu-link');
    let previousFocus = null;

    function openMenu() {
      previousFocus = document.activeElement;
      hamburger.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
      menu.classList.add('open');
      document.body.classList.add('no-scroll');
      if (window._setMenuOpen) window._setMenuOpen(true);
      const header = document.querySelector('.header');
      if (header) header.classList.remove('header-hidden');
      if (links.length) links[0].focus();
    }

    function closeMenu() {
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      menu.classList.remove('open');
      document.body.classList.remove('no-scroll');
      if (window._setMenuOpen) window._setMenuOpen(false);
      if (previousFocus) previousFocus.focus();
    }

    hamburger.addEventListener('click', () => {
      if (menu.classList.contains('open')) closeMenu();
      else openMenu();
    });

    links.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

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

  /* ==========================================
     SCROLL PROGRESS BAR
     ========================================== */
  function initScrollProgress() {
    const bar = document.querySelector('.scroll-progress-bar');
    if (!bar) return;

    let ticking = false;

    function updateProgress() {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
      bar.style.transform = `scaleX(${progress})`;
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ==========================================
     REVEAL ON SCROLL
     ========================================== */
  function initRevealAnimations() {
    const elements = document.querySelectorAll('.reveal-up');
    if (!elements.length) return;

    if (prefersReducedMotion) {
      elements.forEach(el => el.classList.add('revealed'));
      return;
    }

    // Hero reveals: use preloaderComplete event
    const heroElements = document.querySelectorAll('.hero-label, .hero-title, .hero-description, .hero-ctas, .hero-stats');
    document.addEventListener('preloaderComplete', () => {
      heroElements.forEach((el, i) => {
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          el.style.transition = `opacity 0.8s ${getComputedStyle(document.documentElement).getPropertyValue('--ease-out')}, transform 0.8s ${getComputedStyle(document.documentElement).getPropertyValue('--ease-out')}`;
        }, i * 150);
      });
    });

    // Other elements: IntersectionObserver
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

  /* ==========================================
     COUNTER ANIMATION
     ========================================== */
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
        const value = Math.floor(eased * target);
        element.textContent = value.toLocaleString('it-IT') + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    }
  }


  /* ==========================================
     PARALLAX (Desktop only)
     ========================================== */
  function initParallax() {
    if (prefersReducedMotion) return;

    const parallaxElements = document.querySelectorAll('[data-parallax]');
    if (!parallaxElements.length) return;

    let ticking = false;

    function updateParallax() {
      parallaxElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const factor = parseFloat(el.dataset.parallax) || 0.3;
        const offset = window.scrollY * factor;
        el.style.transform = `translateY(${offset}px)`;
      });
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ==========================================
     MAGNETIC BUTTONS (Desktop only)
     ========================================== */
  function initMagneticButtons() {
    if (prefersReducedMotion) return;

    const buttons = document.querySelectorAll('.magnetic-btn');
    if (!buttons.length) return;

    buttons.forEach(btn => {
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

  /* ==========================================
     SMOOTH SCROLL
     ========================================== */
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

  /* ==========================================
     ACTIVE NAV LINK (Multi-page)
     ========================================== */
  function initActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.header-nav-link, .mobile-menu-link, .mobile-menu-sublink, .header-nav-dropdown a');

    const parentMap = {
      'menu.html': 'ristorante.html',
      'sposi.html': 'eventi.html'
    };

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      const linkPage = href.split('/').pop();

      if (linkPage === currentPage ||
          (currentPage === '' && linkPage === 'index.html') ||
          (currentPage === 'index.html' && linkPage === 'index.html')) {
        link.classList.add('active');
      }

      if (parentMap[currentPage] && linkPage === parentMap[currentPage]) {
        link.classList.add('active');
      }
    });

    if (parentMap[currentPage]) {
      document.querySelectorAll('.mobile-menu-group').forEach(group => {
        const sublinks = group.querySelectorAll('.mobile-menu-sublink');
        sublinks.forEach(sl => {
          if (sl.getAttribute('href')?.split('/').pop() === currentPage) {
            const toggle = group.querySelector('.mobile-menu-group-toggle');
            if (toggle) toggle.classList.add('active');
          }
        });
      });
    }
  }

  /* ==========================================
     MOBILE DROPDOWN GROUPS
     ========================================== */
  function initMobileDropdowns() {
    const groups = document.querySelectorAll('.mobile-menu-group');
    groups.forEach(group => {
      const toggle = group.querySelector('.mobile-menu-group-toggle');
      if (!toggle) return;

      toggle.addEventListener('click', () => {
        const isOpen = group.classList.contains('open');
        groups.forEach(g => {
          g.classList.remove('open');
          const t = g.querySelector('.mobile-menu-group-toggle');
          if (t) t.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          group.classList.add('open');
          toggle.setAttribute('aria-expanded', 'true');
        }
      });
    });

    document.querySelectorAll('.mobile-menu-sublink').forEach(link => {
      link.addEventListener('click', () => {
        const menu = document.querySelector('.mobile-menu');
        const hamburger = document.querySelector('.hamburger');
        if (menu) menu.classList.remove('open');
        if (hamburger) {
          hamburger.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
        }
        document.body.classList.remove('no-scroll');
      });
    });
  }

  /* ==========================================
     FORM VALIDATION
     ========================================== */
  function initForms() {
    const forms = document.querySelectorAll('.contact-form');
    if (!forms.length) return;

    forms.forEach(form => {
      const fields = form.querySelectorAll('[required]');

      fields.forEach(field => {
        field.addEventListener('blur', () => validateField(field));
      });

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;

        fields.forEach(field => {
          if (!validateField(field)) valid = false;
        });

        if (valid) {
          const successEl = form.parentElement.querySelector('.form-success');
          if (successEl) {
            form.style.display = 'none';
            successEl.classList.add('visible');
          }
        } else {
          const firstError = form.querySelector('.error input, .error textarea, .error select');
          if (firstError) firstError.focus();
        }
      });
    });

    function validateField(field) {
      const group = field.closest('.form-group');
      if (!group) return true;
      const errorMsg = group.querySelector('.error-message');

      group.classList.remove('error', 'valid');

      if (!field.value.trim()) {
        group.classList.add('error');
        if (errorMsg) errorMsg.textContent = 'Questo campo è obbligatorio';
        return false;
      }

      if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
        group.classList.add('error');
        if (errorMsg) errorMsg.textContent = 'Inserisci un indirizzo email valido';
        return false;
      }

      group.classList.add('valid');
      return true;
    }
  }

  /* ==========================================
     DYNAMIC YEAR
     ========================================== */
  function initDynamicYear() {
    document.querySelectorAll('[data-year]').forEach(el => {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ==========================================
     MARQUEE — Duplicate for seamless loop
     ========================================== */
  function initMarquee() {
    const tracks = document.querySelectorAll('.marquee-track');
    tracks.forEach(track => {
      const content = track.querySelector('.marquee-content');
      if (content && track.children.length < 2) {
        track.appendChild(content.cloneNode(true));
      }
    });
  }

  /* ==========================================
     CINEMATIC IMAGE SEQUENCE (Desktop: scroll, Mobile: swipe)
     ========================================== */
  function initCinematic() {
    const section = document.querySelector('.cinematic');
    if (!section) return;

    const frames = section.querySelectorAll('.cinematic-frame');
    if (!frames.length) return;

    if (isMobile) {
      initCinematicMobile(section, frames);
    } else {
      initCinematicDesktop(section, frames);
    }
  }

  /* ==========================================
     TIMELINE LINE PROGRESS (Scroll-driven)
     ========================================== */
  function initTimelineProgress() {
    const timelines = document.querySelectorAll('.timeline');
    if (!timelines.length) return;

    if (prefersReducedMotion) {
      timelines.forEach(tl => {
        const progress = tl.querySelector('.timeline-line-progress');
        if (progress) progress.style.height = '100%';
      });
      return;
    }

    let ticking = false;

    function updateProgress() {
      timelines.forEach(tl => {
        const progress = tl.querySelector('.timeline-line-progress');
        if (!progress) return;

        const rect = tl.getBoundingClientRect();
        const totalHeight = tl.offsetHeight;
        const visibleStart = window.innerHeight * 0.7;
        const scrolled = visibleStart - rect.top;
        const pct = Math.max(0, Math.min(1, scrolled / totalHeight));
        progress.style.height = (pct * 100) + '%';
      });
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }, { passive: true });

    updateProgress();
  }

  function initCinematicDesktop(section, frames) {
    if (prefersReducedMotion) {
      frames[0]?.classList.add('active');
      return;
    }

    let ticking = false;

    function updateCinematic() {
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const scrollInSection = -rect.top;
      const progress = Math.max(0, Math.min(1, scrollInSection / (sectionHeight - window.innerHeight)));
      const activeIndex = Math.min(frames.length - 1, Math.floor(progress * frames.length));

      frames.forEach((frame, i) => {
        frame.classList.toggle('active', i === activeIndex);
      });
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateCinematic);
        ticking = true;
      }
    }, { passive: true });

    updateCinematic();
  }

  function initCinematicMobile(section, frames) {
    let currentSlide = 0;
    const dots = section.querySelectorAll('.cinematic-dot');

    function showSlide(index) {
      frames.forEach((f, i) => f.classList.toggle('active', i === index));
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
      currentSlide = index;
    }

    showSlide(0);

    // Swipe detection
    let touchStartX = 0;
    const sticky = section.querySelector('.cinematic-sticky');
    if (!sticky) return;

    sticky.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    sticky.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0 && currentSlide < frames.length - 1) showSlide(currentSlide + 1);
        else if (diff < 0 && currentSlide > 0) showSlide(currentSlide - 1);
      }
    }, { passive: true });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => showSlide(i));
    });
  }
});
