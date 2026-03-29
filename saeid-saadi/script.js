/* ================================================================
   DOTT. SAEID SAADI — NEUROLOGO
   Interactions & Animations
   Built with LUXE Framework
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const isMobile = !window.matchMedia('(hover: hover)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  initPreloader();
  initHeader();
  initMobileMenu();
  initScrollProgress();
  initRevealAnimations();
  initCounters();
  initTextReveal();
  initServiceExplorer();
  initFAQ();
  initTabs();
  initSmoothScroll();
  initActiveNav();
  initForms();
  initDynamicYear();

  if (!isMobile && !prefersReducedMotion) {
    initCustomCursor();
    initParallax();
    initMagneticButtons();
  }

  /* ---- PRELOADER (Variant E — Minimal Fade) ---- */
  function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;

    const isHome = document.body.classList.contains('page-home');
    const visited = sessionStorage.getItem('saadi-visited');

    if (!isHome || visited) {
      preloader.remove();
      document.body.classList.remove('preloader-active');
      revealHero();
      return;
    }

    document.body.classList.add('preloader-active');
    sessionStorage.setItem('saadi-visited', 'true');

    setTimeout(() => {
      preloader.classList.add('done');
      document.body.classList.remove('preloader-active');
      setTimeout(() => {
        preloader.setAttribute('aria-hidden', 'true');
        preloader.remove();
      }, 800);
      revealHero();
    }, 2000);
  }

  function revealHero() {
    const hero = document.querySelector('.hero, .hero-internal');
    if (hero) {
      setTimeout(() => hero.classList.add('revealed'), 100);
    }
  }

  /* ---- HEADER ---- */
  function initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScrollY = window.scrollY;
    let ticking = false;
    let menuOpen = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          if (currentScrollY > 50) {
            header.classList.add('header-scrolled');
          } else {
            header.classList.remove('header-scrolled');
          }

          if (!menuOpen && Math.abs(currentScrollY - lastScrollY) > 5) {
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
              header.classList.add('header-hidden');
            } else {
              header.classList.remove('header-hidden');
            }
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    window.headerMenuState = (open) => { menuOpen = open; };
  }

  /* ---- MOBILE MENU ---- */
  function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.mobile-menu');
    if (!hamburger || !menu) return;

    const links = menu.querySelectorAll('a');
    let previousFocus = null;

    function open() {
      previousFocus = document.activeElement;
      hamburger.classList.add('active');
      menu.classList.add('active');
      document.body.classList.add('menu-open');
      hamburger.setAttribute('aria-expanded', 'true');
      if (window.headerMenuState) window.headerMenuState(true);
      document.querySelector('.header').classList.remove('header-hidden');
      if (links.length) links[0].focus();
    }

    function close() {
      hamburger.classList.remove('active');
      menu.classList.remove('active');
      document.body.classList.remove('menu-open');
      hamburger.setAttribute('aria-expanded', 'false');
      if (window.headerMenuState) window.headerMenuState(false);
      if (previousFocus) previousFocus.focus();
    }

    hamburger.addEventListener('click', () => {
      menu.classList.contains('active') ? close() : open();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('active')) close();
    });

    links.forEach(link => link.addEventListener('click', close));

    // Focus trap
    menu.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const focusable = menu.querySelectorAll('a, button');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ---- SCROLL PROGRESS ---- */
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

  /* ---- REVEAL ANIMATIONS ---- */
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

  /* ---- COUNTER ANIMATION ---- */
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

  /* ---- TEXT REVEAL (Signature Moment 1) ---- */
  function initTextReveal() {
    const section = document.querySelector('.text-reveal-section');
    const lines = document.querySelectorAll('.text-reveal-line');
    if (!section || !lines.length) return;

    if (prefersReducedMotion) {
      lines.forEach(l => l.classList.add('revealed'));
      return;
    }

    /* Apply clip-path via JS so text is visible if JS fails */
    lines.forEach(line => {
      line.style.clipPath = 'inset(0 100% 0 0)';
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          lines.forEach((line, i) => {
            setTimeout(() => {
              line.style.clipPath = '';
              line.classList.add('revealed');
            }, i * 300);
          });
          observer.unobserve(section);
        }
      });
    }, { threshold: 0.1 });

    observer.observe(section);
  }

  /* ---- SERVICE EXPLORER (Signature Moment 2) ---- */
  function initServiceExplorer() {
    const cards = document.querySelectorAll('.service-card[data-expandable]');
    if (!cards.length) return;

    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('a')) return; // don't toggle when clicking links
        const wasExpanded = card.classList.contains('expanded');
        cards.forEach(c => c.classList.remove('expanded'));
        if (!wasExpanded) card.classList.add('expanded');
      });
    });
  }

  /* ---- FAQ ACCORDION ---- */
  function initFAQ() {
    const items = document.querySelectorAll('.faq-item');
    if (!items.length) return;

    items.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      if (!question || !answer) return;

      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        items.forEach(i => {
          i.classList.remove('active');
          const a = i.querySelector('.faq-answer');
          if (a) a.style.maxHeight = null;
        });

        if (!isActive) {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }

  /* ---- TABS ---- */
  function initTabs() {
    const tabContainers = document.querySelectorAll('[data-tabs]');
    if (!tabContainers.length) return;

    tabContainers.forEach(container => {
      const btns = container.querySelectorAll('.tab-btn');
      const panels = container.querySelectorAll('.tab-panel');

      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          const target = btn.dataset.tab;
          btns.forEach(b => b.classList.remove('active'));
          panels.forEach(p => p.classList.remove('active'));
          btn.classList.add('active');
          const panel = container.querySelector(`[data-panel="${target}"]`);
          if (panel) panel.classList.add('active');
        });
      });
    });
  }

  /* ---- SMOOTH SCROLL ---- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerH = document.querySelector('.header')?.offsetHeight || 0;
          const offset = headerH + 20;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: prefersReducedMotion ? 'instant' : 'smooth' });
        }
      });
    });
  }

  /* ---- ACTIVE NAV ---- */
  function initActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.header-nav a, .mobile-menu-nav a').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
      // Also check parent dropdown items
      if (href && currentPage.includes(href.replace('.html', ''))) {
        const dropdown = link.closest('.nav-dropdown');
        if (dropdown) {
          const trigger = dropdown.querySelector(':scope > a');
          if (trigger) trigger.classList.add('active');
        }
      }
    });
  }

  /* ---- FORMS ---- */
  function initForms() {
    const forms = document.querySelectorAll('form[data-validate]');
    if (!forms.length) return;

    forms.forEach(form => {
      const groups = form.querySelectorAll('.form-group');

      groups.forEach(group => {
        const input = group.querySelector('input, textarea, select');
        if (!input) return;

        input.addEventListener('blur', () => validateField(group, input));
        input.addEventListener('input', () => {
          if (group.classList.contains('error')) validateField(group, input);
        });
      });

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;

        groups.forEach(group => {
          const input = group.querySelector('input, textarea, select');
          if (input && input.hasAttribute('required')) {
            if (!validateField(group, input)) valid = false;
          }
        });

        if (valid) {
          const successEl = form.querySelector('.form-success');
          if (successEl) {
            form.style.display = 'none';
            successEl.style.display = 'block';
          }
        } else {
          const firstError = form.querySelector('.form-group.error input, .form-group.error textarea, .form-group.error select');
          if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
          }
        }
      });
    });
  }

  function validateField(group, input) {
    const errorMsg = group.querySelector('.error-msg');
    let valid = true;

    if (input.hasAttribute('required') && !input.value.trim()) {
      valid = false;
      if (errorMsg) errorMsg.textContent = 'Questo campo è obbligatorio';
    } else if (input.type === 'email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
      valid = false;
      if (errorMsg) errorMsg.textContent = 'Inserisci un indirizzo email valido';
    } else if (input.type === 'tel' && input.value && !/^[\d\s\+\-\(\)]{7,}$/.test(input.value)) {
      valid = false;
      if (errorMsg) errorMsg.textContent = 'Inserisci un numero di telefono valido';
    }

    group.classList.toggle('error', !valid);
    group.classList.toggle('valid', valid && input.value.trim() !== '');
    return valid;
  }

  /* ---- DYNAMIC YEAR ---- */
  function initDynamicYear() {
    document.querySelectorAll('[data-year]').forEach(el => {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ---- CUSTOM CURSOR ---- */
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
        dot.style.opacity = '1';
        follower.style.opacity = '1';
        followerX = mouseX;
        followerY = mouseY;
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

    const hoverSelectors = 'a, button, [role="button"], input, textarea, select, label, .service-card';
    document.querySelectorAll(hoverSelectors).forEach(el => {
      el.addEventListener('mouseenter', () => follower.classList.add('hover'));
      el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
    });

    document.addEventListener('mouseleave', () => { dot.classList.add('hidden'); follower.classList.add('hidden'); });
    document.addEventListener('mouseenter', () => { dot.classList.remove('hidden'); follower.classList.remove('hidden'); });
  }

  /* ---- PARALLAX ---- */
  function initParallax() {
    const heroImg = document.querySelector('.hero-image img');
    if (!heroImg) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = heroImg.closest('.hero')?.getBoundingClientRect();
          if (rect && rect.bottom > 0 && rect.top < window.innerHeight) {
            heroImg.style.transform = `translateY(${window.scrollY * 0.15}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ---- MAGNETIC BUTTONS ---- */
  function initMagneticButtons() {
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.3;
        const deltaY = (e.clientY - centerY) * 0.3;
        btn.style.transform = `translate(${deltaX}px, ${deltaY}px) translateY(-2px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }
});
