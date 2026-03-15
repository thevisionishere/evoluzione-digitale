/* ============================================
   PURANATURA WEB — script.js
   Global Interactions
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
  initMarquee();
  initFAQ();
  initScrollTimeline();

  /* -----------------------------------------------
     1. PRELOADER (Variant E — Minimal Fade)
     ----------------------------------------------- */
  function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;

    const isHome = window.location.pathname.endsWith('index.html') ||
                   window.location.pathname.endsWith('/');
    const hasVisited = sessionStorage.getItem('pn-visited');

    if (!isHome || hasVisited) {
      preloader.remove();
      document.body.classList.remove('preloader-active');
      triggerHeroReveal();
      return;
    }

    sessionStorage.setItem('pn-visited', 'true');

    if (prefersReducedMotion) {
      preloader.remove();
      document.body.classList.remove('preloader-active');
      triggerHeroReveal();
      return;
    }

    setTimeout(() => {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        preloader.remove();
        document.body.classList.remove('preloader-active');
        document.dispatchEvent(new CustomEvent('preloaderComplete'));
      }, 600);
    }, 1200);
  }

  function triggerHeroReveal() {
    setTimeout(() => {
      document.dispatchEvent(new CustomEvent('preloaderComplete'));
    }, 100);
  }

  /* -----------------------------------------------
     2. HEADER SCROLL BEHAVIOR
     ----------------------------------------------- */
  function initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScrollY = 0;
    let ticking = false;
    let menuOpen = false;

    window.headerMenuOpen = (val) => { menuOpen = val; };

    function updateHeader() {
      const scrollY = window.scrollY;
      const delta = scrollY - lastScrollY;

      if (scrollY > 50) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }

      if (!menuOpen) {
        if (delta > 5 && scrollY > 100) {
          header.classList.add('header-hidden');
        } else if (delta < -5) {
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

  /* -----------------------------------------------
     3. MOBILE MENU
     ----------------------------------------------- */
  function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (!hamburger || !mobileMenu) return;

    const links = mobileMenu.querySelectorAll('a');
    let previousFocus = null;

    function openMenu() {
      previousFocus = document.activeElement;
      hamburger.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
      mobileMenu.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (window.headerMenuOpen) window.headerMenuOpen(true);
      if (links.length) links[0].focus();
    }

    function closeMenu() {
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
      if (window.headerMenuOpen) window.headerMenuOpen(false);
      if (previousFocus) previousFocus.focus();
    }

    hamburger.addEventListener('click', () => {
      mobileMenu.classList.contains('active') ? closeMenu() : openMenu();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMenu();
      }
    });

    links.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Focus trap
    mobileMenu.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const focusable = mobileMenu.querySelectorAll('a, button');
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

  /* -----------------------------------------------
     4. SCROLL PROGRESS BAR
     ----------------------------------------------- */
  function initScrollProgress() {
    const bar = document.querySelector('.scroll-progress-bar');
    if (!bar) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = docHeight > 0 ? scrollY / docHeight : 0;
          bar.style.transform = `scaleX(${progress})`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* -----------------------------------------------
     5. REVEAL ON SCROLL
     ----------------------------------------------- */
  function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal-up');
    if (!revealElements.length) return;

    if (prefersReducedMotion) {
      revealElements.forEach(el => el.classList.add('revealed'));
      return;
    }

    // Hero elements are handled separately
    const heroElements = document.querySelectorAll('.hero .reveal-up');
    const nonHeroElements = document.querySelectorAll('.reveal-up:not(.hero .reveal-up)');

    // Hero reveals on preloader complete
    document.addEventListener('preloaderComplete', () => {
      heroElements.forEach((el, i) => {
        setTimeout(() => {
          el.classList.add('revealed');
        }, i * 150);
      });
    });

    // Non-hero reveals via IntersectionObserver
    if (nonHeroElements.length) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      nonHeroElements.forEach(el => observer.observe(el));
    }
  }

  /* -----------------------------------------------
     6. COUNTER ANIMATION
     ----------------------------------------------- */
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
    }, { threshold: 0.5 });

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

  /* -----------------------------------------------
     7. CUSTOM CURSOR (Desktop only)
     ----------------------------------------------- */
  function initCustomCursor() {
    if (prefersReducedMotion) return;

    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const follower = document.createElement('div');
    follower.className = 'cursor-follower';

    dot.style.left = '0';
    dot.style.top = '0';
    follower.style.left = '0';
    follower.style.top = '0';
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

  /* -----------------------------------------------
     8. PARALLAX (Desktop only)
     ----------------------------------------------- */
  function initParallax() {
    if (prefersReducedMotion) return;

    const parallaxElements = document.querySelectorAll('[data-parallax]');
    if (!parallaxElements.length) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          parallaxElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < window.innerHeight) {
              const factor = parseFloat(el.dataset.parallax) || 0.3;
              const offset = window.scrollY * factor;
              el.style.transform = `translateY(${offset}px)`;
            }
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* -----------------------------------------------
     9. MAGNETIC BUTTONS (Desktop only)
     ----------------------------------------------- */
  function initMagneticButtons() {
    if (prefersReducedMotion) return;

    const buttons = document.querySelectorAll('.magnetic-btn');
    if (!buttons.length) return;

    buttons.forEach(btn => {
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

  /* -----------------------------------------------
     10. SMOOTH SCROLL
     ----------------------------------------------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const header = document.querySelector('.header');
          const offset = (header ? header.offsetHeight : 0) + 20;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({
            top,
            behavior: prefersReducedMotion ? 'instant' : 'smooth'
          });
        }
      });
    });
  }

  /* -----------------------------------------------
     11. ACTIVE NAV LINK
     ----------------------------------------------- */
  function initActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.header-nav a, .mobile-menu-nav a');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html') ||
          (currentPage === 'index.html' && href === 'index.html') ||
          (currentPage.endsWith('/') && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  /* -----------------------------------------------
     12. FORM VALIDATION
     ----------------------------------------------- */
  function initForms() {
    const forms = document.querySelectorAll('form[data-validate]');
    if (!forms.length) return;

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
          const formWrapper = form.closest('.contact-form') || form.parentElement;
          const successMsg = formWrapper ? formWrapper.querySelector('.form-success') : form.querySelector('.form-success');
          if (successMsg) {
            form.style.display = 'none';
            successMsg.style.display = 'block';
          }
        } else {
          const firstError = form.querySelector('.error');
          if (firstError) firstError.focus();
        }
      });
    });

    function validateField(field) {
      const wrapper = field.closest('.form-group') || field.closest('.form-checkbox');
      const errorEl = wrapper ? wrapper.querySelector('.form-error') : null;
      let isValid = true;
      let message = '';

      if (field.hasAttribute('required')) {
        if (field.type === 'checkbox' && !field.checked) {
          isValid = false;
          message = 'Questo campo è obbligatorio';
        } else if (field.type !== 'checkbox' && !field.value.trim()) {
          isValid = false;
          message = 'Questo campo è obbligatorio';
        }
      }
      if (field.type === 'email' && field.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
          isValid = false;
          message = 'Inserisci un indirizzo email valido';
        }
      }

      if (isValid) {
        field.classList.remove('error');
        field.classList.add('valid');
        if (errorEl) errorEl.textContent = '';
      } else {
        field.classList.remove('valid');
        field.classList.add('error');
        if (errorEl) errorEl.textContent = message;
      }

      return isValid;
    }
  }

  /* -----------------------------------------------
     13. DYNAMIC YEAR
     ----------------------------------------------- */
  function initDynamicYear() {
    document.querySelectorAll('[data-year]').forEach(el => {
      el.textContent = new Date().getFullYear();
    });
  }

  /* -----------------------------------------------
     14. MARQUEE (CSS-driven, JS pause on hover)
     ----------------------------------------------- */
  function initMarquee() {
    const marquees = document.querySelectorAll('.marquee');
    if (!marquees.length) return;

    marquees.forEach(marquee => {
      marquee.addEventListener('mouseenter', () => {
        marquee.style.animationPlayState = 'paused';
        const inner = marquee.querySelector('.marquee-inner');
        if (inner) inner.style.animationPlayState = 'paused';
      });
      marquee.addEventListener('mouseleave', () => {
        marquee.style.animationPlayState = 'running';
        const inner = marquee.querySelector('.marquee-inner');
        if (inner) inner.style.animationPlayState = 'running';
      });
    });
  }

  /* -----------------------------------------------
     15. FAQ ACCORDION
     ----------------------------------------------- */
  function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(item => {
      const trigger = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      if (!trigger || !answer) return;

      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');

        // Close all others
        faqItems.forEach(other => {
          if (other !== item && other.classList.contains('active')) {
            other.classList.remove('active');
            const otherAnswer = other.querySelector('.faq-answer');
            if (otherAnswer) otherAnswer.style.maxHeight = '0';
            other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          }
        });

        if (isOpen) {
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

  /* -----------------------------------------------
     17. SCROLL-TRIGGERED TIMELINE (Signature Moment 2)
     ----------------------------------------------- */
  function initScrollTimeline() {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;

    const line = timeline.querySelector('.timeline-line-fill');
    const nodes = timeline.querySelectorAll('.timeline-node');
    if (!line || !nodes.length) return;

    if (prefersReducedMotion) {
      if (line) line.style.height = '100%';
      nodes.forEach(node => node.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.3 });

    nodes.forEach(node => observer.observe(node));

    // Line draw on scroll
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = timeline.getBoundingClientRect();
          const timelineTop = rect.top;
          const timelineHeight = rect.height;
          const viewportHeight = window.innerHeight;

          if (timelineTop < viewportHeight && timelineTop + timelineHeight > 0) {
            const progress = Math.min(1, Math.max(0,
              (viewportHeight - timelineTop) / (viewportHeight + timelineHeight)
            ));
            line.style.height = (progress * 100) + '%';
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
});
