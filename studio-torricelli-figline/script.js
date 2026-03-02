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
  initTextReveal();
  initTreatmentExplorer();
  initFaqAccordion();
  initDropdownMenus();
  initMobileSubmenus();

  // ─── 1. PRELOADER ────────────────────────────────────────────────────────────
  function initPreloader() {
    const preloader = document.getElementById('preloader');
    const isHome = document.body.classList.contains('page-home') || window.location.pathname === '/' || window.location.pathname.endsWith('index.html');
    const hasVisited = sessionStorage.getItem('torricelli-visited');

    if (!preloader || !isHome || hasVisited) {
      if (preloader) preloader.style.display = 'none';
      setTimeout(() => {
        document.dispatchEvent(new CustomEvent('preloaderComplete'));
      }, 300);
      return;
    }

    if (prefersReducedMotion) {
      preloader.style.display = 'none';
      document.body.classList.remove('preloader-active');
      sessionStorage.setItem('torricelli-visited', '1');
      document.dispatchEvent(new CustomEvent('preloaderComplete'));
      return;
    }

    document.body.classList.add('preloader-active');

    setTimeout(() => {
      preloader.style.opacity = '0';
      preloader.style.transition = 'opacity 0.6s ease';

      preloader.addEventListener('transitionend', () => {
        preloader.style.display = 'none';
        document.body.classList.remove('preloader-active');
        sessionStorage.setItem('torricelli-visited', '1');
        document.dispatchEvent(new CustomEvent('preloaderComplete'));
      }, { once: true });
    }, 800);
  }

  // ─── 2. HEADER SCROLL BEHAVIOR ───────────────────────────────────────────────
  function initHeader() {
    const header = document.getElementById('header') || document.querySelector('header');
    if (!header) return;

    let lastScrollY = window.scrollY;
    let ticking = false;
    let mobileMenuOpen = false;

    const onMobileMenuToggle = (e) => {
      mobileMenuOpen = e.detail?.open ?? false;
    };
    document.addEventListener('mobileMenuToggle', onMobileMenuToggle);

    const updateHeader = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 50) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }

      if (!mobileMenuOpen) {
        const delta = currentScrollY - lastScrollY;
        if (delta > 5 && currentScrollY > 100) {
          header.classList.add('header-hidden');
        } else if (delta < -5) {
          header.classList.remove('header-hidden');
        }
      }

      lastScrollY = currentScrollY;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });
  }

  // ─── 3. MOBILE MENU ──────────────────────────────────────────────────────────
  function initMobileMenu() {
    const hamburger = document.getElementById('hamburger') || document.querySelector('[data-hamburger]');
    const mobileMenu = document.getElementById('mobile-menu') || document.querySelector('.mobile-menu');
    const mobileBackdrop = document.querySelector('.mobile-menu-backdrop');
    const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a, button') : [];

    if (!hamburger || !mobileMenu) return;

    let isOpen = false;

    const openMenu = () => {
      isOpen = true;
      document.body.classList.add('mobile-menu-open');
      mobileMenu.classList.add('is-open');
      hamburger.classList.add('is-active');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';

      document.dispatchEvent(new CustomEvent('mobileMenuToggle', { detail: { open: true } }));

      const links = mobileMenu.querySelectorAll('.mobile-nav-link, .mobile-menu-link, nav a');
      links.forEach((link, i) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(30px)';
        link.style.transition = `opacity 0.4s ease ${i * 50}ms, transform 0.4s ease ${i * 50}ms`;
        requestAnimationFrame(() => {
          link.style.opacity = '1';
          link.style.transform = 'translateY(0)';
        });
      });
    };

    const closeMenu = () => {
      isOpen = false;
      document.body.classList.remove('mobile-menu-open');
      mobileMenu.classList.remove('is-open');
      hamburger.classList.remove('is-active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';

      document.dispatchEvent(new CustomEvent('mobileMenuToggle', { detail: { open: false } }));
    };

    hamburger.addEventListener('click', () => {
      isOpen ? closeMenu() : openMenu();
    });

    if (mobileBackdrop) {
      mobileBackdrop.addEventListener('click', closeMenu);
    }

    document.addEventListener('keydown', (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        closeMenu();
        hamburger.focus();
        return;
      }

      if (e.key === 'Tab') {
        const focusable = [...mobileMenu.querySelectorAll('a, button, input, [tabindex]:not([tabindex="-1"])')].filter(el => !el.closest('.mobile-submenu') || el.closest('.mobile-submenu.is-open'));
        if (!focusable.length) return;

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

  // ─── 4. CUSTOM CURSOR (DESKTOP ONLY) ─────────────────────────────────────────
  function initCustomCursor() {
    if (prefersReducedMotion) return;

    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    dot.style.cssText = 'position:fixed;width:8px;height:8px;border-radius:50%;pointer-events:none;z-index:99999;transform:translate(-50%,-50%);left:-100px;top:-100px;';

    const follower = document.createElement('div');
    follower.className = 'cursor-follower';
    follower.style.cssText = 'position:fixed;width:32px;height:32px;border-radius:50%;pointer-events:none;z-index:99998;transform:translate(-50%,-50%);left:-100px;top:-100px;transition:opacity 0.3s ease;';

    document.body.appendChild(dot);
    document.body.appendChild(follower);

    let mouseX = -100;
    let mouseY = -100;
    let followerX = -100;
    let followerY = -100;
    let firstMove = false;
    let rafId = null;

    const lerp = (a, b, t) => a + (b - a) * t;

    const animate = () => {
      followerX = lerp(followerX, mouseX, 0.15);
      followerY = lerp(followerY, mouseY, 0.15);

      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
      follower.style.left = followerX + 'px';
      follower.style.top = followerY + 'px';

      rafId = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!firstMove) {
        firstMove = true;
        followerX = mouseX;
        followerY = mouseY;
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
        follower.style.left = mouseX + 'px';
        follower.style.top = mouseY + 'px';
        document.body.classList.add('custom-cursor');
        animate();
      }
    }, { passive: true });

    const hoverTargets = 'a, button, [role="button"], input, textarea, select, label, .magnetic-btn';

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverTargets)) {
        follower.classList.add('hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverTargets)) {
        follower.classList.remove('hover');
      }
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

  // ─── 5. SCROLL PROGRESS BAR ──────────────────────────────────────────────────
  function initScrollProgress() {
    const bar = document.getElementById('scroll-progress') || document.querySelector('.scroll-progress');
    if (!bar) return;

    let ticking = false;

    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;

      bar.style.transform = `scaleX(${progress})`;
      bar.style.transformOrigin = 'left';
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
  }

  // ─── 6. REVEAL ANIMATIONS ────────────────────────────────────────────────────
  function initRevealAnimations() {
    const revealEls = document.querySelectorAll('.reveal-up');
    if (!revealEls.length) return;

    if (prefersReducedMotion) {
      revealEls.forEach(el => el.classList.add('revealed'));
      return;
    }

    const heroRevealEls = document.querySelectorAll('.hero .reveal-up, [data-hero-reveal]');
    const nonHeroRevealEls = [...revealEls].filter(el => !el.closest('.hero') && !el.hasAttribute('data-hero-reveal'));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
          setTimeout(() => {
            el.classList.add('revealed');
          }, delay);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.1 });

    nonHeroRevealEls.forEach(el => observer.observe(el));

    const revealHeroElements = () => {
      heroRevealEls.forEach((el, i) => {
        const delay = el.dataset.delay ? parseInt(el.dataset.delay) : i * 100;
        setTimeout(() => {
          el.classList.add('revealed');
        }, delay);
      });
    };

    document.addEventListener('preloaderComplete', revealHeroElements, { once: true });
  }

  // ─── 7. COUNTER ANIMATION ────────────────────────────────────────────────────
  function initCounters() {
    const counterEls = document.querySelectorAll('[data-count]');
    if (!counterEls.length) return;

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animateCounter = (el) => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const duration = 2000;
      const start = performance.now();

      if (prefersReducedMotion) {
        el.textContent = target + suffix;
        return;
      }

      const update = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);
        const current = Math.round(eased * target);

        el.textContent = current + suffix;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = target + suffix;
        }
      };

      requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counterEls.forEach(el => observer.observe(el));
  }

  // ─── 8. PARALLAX (DESKTOP ONLY) ──────────────────────────────────────────────
  function initParallax() {
    if (prefersReducedMotion) return;

    const heroBg = document.querySelector('.hero-bg, .hero-parallax, [data-parallax]');
    if (!heroBg) return;

    const hero = heroBg.closest('.hero') || heroBg.parentElement;
    let ticking = false;

    const update = () => {
      const heroRect = hero.getBoundingClientRect();
      const inViewport = heroRect.bottom > 0 && heroRect.top < window.innerHeight;

      if (inViewport) {
        const offset = window.scrollY * 0.3;
        heroBg.style.transform = `translateY(${offset}px)`;
      }

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
  }

  // ─── 9. MAGNETIC BUTTONS (DESKTOP ONLY) ──────────────────────────────────────
  function initMagneticButtons() {
    if (prefersReducedMotion) return;

    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    if (!magneticBtns.length) return;

    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.35;
        const deltaY = (e.clientY - centerY) * 0.35;
        const maxShift = 12;
        const shiftX = Math.max(-maxShift, Math.min(maxShift, deltaX));
        const shiftY = Math.max(-maxShift, Math.min(maxShift, deltaY));

        btn.style.transform = `translate(${shiftX}px, ${shiftY}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
        btn.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

        btn.addEventListener('transitionend', () => {
          btn.style.transition = '';
        }, { once: true });
      });
    });
  }

  // ─── 10. ACTIVE NAV LINK ─────────────────────────────────────────────────────
  function initActiveNav() {
    const navLinks = document.querySelectorAll('nav a, .nav-link, .dropdown-link');
    if (!navLinks.length) return;

    const currentPath = window.location.pathname;
    const currentHref = window.location.href;

    navLinks.forEach(link => {
      const linkHref = link.getAttribute('href');
      if (!linkHref) return;

      const isAbsolute = linkHref.startsWith('http');
      const linkPath = isAbsolute ? new URL(linkHref).pathname : linkHref;

      const matches = linkPath !== '/' && currentPath.endsWith(linkPath)
        || linkPath !== '/' && currentHref.includes(linkPath)
        || (linkPath === '/' && (currentPath === '/' || currentPath.endsWith('index.html')));

      if (matches) {
        link.classList.add('active');

        const parentDropdown = link.closest('.dropdown');
        if (parentDropdown) {
          const parentToggle = parentDropdown.querySelector('.dropdown-toggle, .has-dropdown > a');
          if (parentToggle) parentToggle.classList.add('active');
        }
      }
    });
  }

  // ─── 11. SMOOTH SCROLL ───────────────────────────────────────────────────────
  function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    if (!anchorLinks.length) return;

    anchorLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        const header = document.getElementById('header') || document.querySelector('header');
        const headerHeight = header ? header.offsetHeight : 0;
        const offset = headerHeight + 20;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
          top: targetTop,
          behavior: prefersReducedMotion ? 'instant' : 'smooth'
        });
      });
    });
  }

  // ─── 12. FORM VALIDATION ─────────────────────────────────────────────────────
  function initForms() {
    const forms = document.querySelectorAll('form[data-validate], .contact-form, .booking-form');
    if (!forms.length) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{8,20}$/;

    const showError = (field, message) => {
      field.classList.remove('valid');
      field.classList.add('error');

      let errorEl = field.parentElement.querySelector('.field-error');
      if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.className = 'field-error';
        errorEl.setAttribute('role', 'alert');
        field.parentElement.appendChild(errorEl);
      }
      errorEl.textContent = message;
    };

    const showValid = (field) => {
      field.classList.remove('error');
      field.classList.add('valid');

      const errorEl = field.parentElement.querySelector('.field-error');
      if (errorEl) errorEl.textContent = '';
    };

    const validateField = (field) => {
      const value = field.value.trim();
      const type = field.type;
      const required = field.hasAttribute('required');

      if (required && !value) {
        showError(field, 'Questo campo è obbligatorio.');
        return false;
      }

      if (!required && !value) {
        showValid(field);
        return true;
      }

      if (type === 'email' || field.name === 'email') {
        if (!emailRegex.test(value)) {
          showError(field, 'Inserisci un indirizzo email valido.');
          return false;
        }
      }

      if (type === 'tel' || field.name === 'phone' || field.name === 'telefono') {
        if (!phoneRegex.test(value)) {
          showError(field, 'Inserisci un numero di telefono valido.');
          return false;
        }
      }

      if (field.tagName === 'SELECT' && required && !value) {
        showError(field, 'Seleziona un\'opzione.');
        return false;
      }

      showValid(field);
      return true;
    };

    forms.forEach(form => {
      const fields = form.querySelectorAll('input, textarea, select');

      fields.forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
          if (field.classList.contains('error')) validateField(field);
        });
      });

      form.addEventListener('submit', (e) => {
        e.preventDefault();

        let allValid = true;
        let firstError = null;

        fields.forEach(field => {
          if (!validateField(field)) {
            allValid = false;
            if (!firstError) firstError = field;
          }
        });

        if (!allValid && firstError) {
          const header = document.getElementById('header') || document.querySelector('header');
          const offset = (header ? header.offsetHeight : 0) + 20;
          const top = firstError.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: prefersReducedMotion ? 'instant' : 'smooth' });
          firstError.focus();
          return;
        }

        const successMsg = form.querySelector('.form-success') || (() => {
          const el = document.createElement('div');
          el.className = 'form-success';
          form.appendChild(el);
          return el;
        })();

        successMsg.textContent = 'Messaggio inviato con successo. La contatteremo presto.';
        successMsg.style.color = 'var(--color-accent, #c9a96e)';
        successMsg.style.marginTop = '1rem';
        successMsg.style.fontWeight = '500';

        form.reset();
        fields.forEach(field => {
          field.classList.remove('valid', 'error');
          const errorEl = field.parentElement.querySelector('.field-error');
          if (errorEl) errorEl.textContent = '';
        });

        setTimeout(() => {
          successMsg.textContent = '';
        }, 6000);
      });
    });
  }

  // ─── 13. DYNAMIC YEAR ────────────────────────────────────────────────────────
  function initDynamicYear() {
    const yearEls = document.querySelectorAll('[data-year]');
    if (!yearEls.length) return;

    const year = new Date().getFullYear();
    yearEls.forEach(el => {
      el.textContent = year;
    });
  }

  // ─── 14. TEXT REVEAL ON SCROLL ───────────────────────────────────────────────
  function initTextReveal() {
    const textRevealSections = document.querySelectorAll('.text-reveal');
    if (!textRevealSections.length) return;

    if (prefersReducedMotion) {
      textRevealSections.forEach(section => {
        section.querySelectorAll('.text-reveal__word').forEach(w => w.classList.add('is-visible'));
        const statement = section.querySelector('.text-reveal__statement');
        if (statement) statement.classList.add('active');
      });
      return;
    }

    textRevealSections.forEach(section => {
      // Use pre-existing .text-reveal__word spans from HTML
      const wordEls = section.querySelectorAll('.text-reveal__word');
      const statement = section.querySelector('.text-reveal__statement');

      if (!wordEls.length) return;

      // Set initial hidden state on each word
      wordEls.forEach(word => {
        word.style.opacity = '0';
        word.style.transform = 'translateY(12px)';
        word.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        word.style.display = 'inline-block';
      });

      let hasRevealed = false;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasRevealed) {
            hasRevealed = true;

            // Mark statement as active for color transition
            if (statement) statement.classList.add('active');

            // Reveal words one by one
            wordEls.forEach((word, i) => {
              setTimeout(() => {
                word.style.opacity = '1';
                word.style.transform = 'translateY(0)';
                word.classList.add('is-visible');
              }, i * 120);
            });

            observer.unobserve(section);
          }
        });
      }, { threshold: 0.3 });

      observer.observe(section);
    });
  }

  // ─── 15. TREATMENT EXPLORER ──────────────────────────────────────────────────
  function initTreatmentExplorer() {
    const explorer = document.querySelector('.treatment-explorer');
    if (!explorer) return;

    const items = explorer.querySelectorAll('.explorer__item');
    if (!items.length) return;

    const desktopImage = explorer.querySelector('#explorer-img');

    const openItem = (item) => {
      // Close all others
      items.forEach(other => {
        if (other === item) return;
        other.classList.remove('is-active');
        const btn = other.querySelector('.explorer__header');
        if (btn) btn.setAttribute('aria-expanded', 'false');
        const content = other.querySelector('.explorer__content');
        if (content) {
          content.hidden = true;
          content.style.maxHeight = '0';
        }
        // Hide mobile image
        const mobileImg = other.querySelector('.explorer__image--mobile');
        if (mobileImg) mobileImg.style.display = 'none';
      });

      // Open this item
      item.classList.add('is-active');
      const btn = item.querySelector('.explorer__header');
      if (btn) btn.setAttribute('aria-expanded', 'true');
      const content = item.querySelector('.explorer__content');
      if (content) {
        content.hidden = false;
        content.style.transition = 'max-height 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        content.style.overflow = 'hidden';
        content.style.maxHeight = content.scrollHeight + 'px';
      }
      // Show mobile image
      const mobileImg = item.querySelector('.explorer__image--mobile');
      if (mobileImg) mobileImg.style.display = '';

      // Update desktop image
      if (desktopImage) {
        const mobileImgEl = item.querySelector('.explorer__image--mobile img');
        if (mobileImgEl) {
          desktopImage.style.opacity = '0';
          desktopImage.style.transition = 'opacity 0.4s ease';
          setTimeout(() => {
            desktopImage.src = mobileImgEl.src;
            desktopImage.alt = mobileImgEl.alt;
            desktopImage.style.opacity = '1';
          }, 300);
        }
      }
    };

    items.forEach(item => {
      const trigger = item.querySelector('.explorer__header, [data-explorer-trigger]');
      if (!trigger) return;

      trigger.addEventListener('click', () => {
        if (!item.classList.contains('is-active')) {
          openItem(item);
        }
      });
    });

    // Initialize first item as open
    const firstItem = items[0];
    if (firstItem) {
      firstItem.classList.add('is-active');
      const content = firstItem.querySelector('.explorer__content');
      if (content) {
        content.hidden = false;
        content.style.overflow = 'hidden';
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    }
  }

  // ─── 16. FAQ ACCORDION ───────────────────────────────────────────────────────
  function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach((item, index) => {
      const trigger = item.querySelector('.faq-trigger');
      const body = item.querySelector('.faq-body');
      const icon = item.querySelector('.faq-icon');

      if (!trigger || !body) return;

      const bodyId = `faq-body-${index}`;
      body.id = bodyId;
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-controls', bodyId);
      body.style.maxHeight = '0';
      body.style.overflow = 'hidden';
      body.style.transition = 'max-height 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');

        faqItems.forEach(other => {
          if (other === item) return;
          other.classList.remove('active');
          const otherBody = other.querySelector('.faq-body');
          const otherTrigger = other.querySelector('.faq-trigger');
          const otherIcon = other.querySelector('.faq-icon');
          if (otherBody) otherBody.style.maxHeight = '0';
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
        });

        if (!isOpen) {
          item.classList.add('active');
          body.style.maxHeight = body.scrollHeight + 'px';
          trigger.setAttribute('aria-expanded', 'true');
          if (icon) icon.style.transform = 'rotate(45deg)';
        } else {
          item.classList.remove('active');
          body.style.maxHeight = '0';
          trigger.setAttribute('aria-expanded', 'false');
          if (icon) icon.style.transform = 'rotate(0deg)';
        }
      });
    });
  }

  // ─── 17. DESKTOP DROPDOWN MENUS ──────────────────────────────────────────────
  function initDropdownMenus() {
    const dropdownItems = document.querySelectorAll('.nav__item--dropdown');
    if (!dropdownItems.length) return;

    dropdownItems.forEach(item => {
      const dropdown = item.querySelector('.nav__dropdown');
      const toggle = item.querySelector('.nav-link--dropdown, a, button');
      if (!dropdown) return;

      let closeTimer = null;

      const openDropdown = () => {
        clearTimeout(closeTimer);
        dropdown.style.opacity = '0';
        dropdown.style.transform = 'translateY(-8px)';
        dropdown.style.display = 'block';
        dropdown.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        requestAnimationFrame(() => {
          dropdown.style.opacity = '1';
          dropdown.style.transform = 'translateY(0)';
        });
      };

      const closeDropdown = () => {
        dropdown.style.opacity = '0';
        dropdown.style.transform = 'translateY(-8px)';
        closeTimer = setTimeout(() => {
          dropdown.style.display = 'none';
        }, 300);
      };

      if (!isMobile) {
        item.addEventListener('mouseenter', openDropdown);
        item.addEventListener('mouseleave', closeDropdown);
      } else {
        let tapped = false;

        toggle.addEventListener('click', (e) => {
          if (!tapped) {
            e.preventDefault();
            tapped = true;
            openDropdown();
          } else {
            tapped = false;
          }
        });

        document.addEventListener('click', (e) => {
          if (!item.contains(e.target)) {
            tapped = false;
            closeDropdown();
          }
        });
      }

      dropdown.style.display = 'none';
    });
  }

  // ─── 18. MOBILE SUBMENUS ─────────────────────────────────────────────────────
  function initMobileSubmenus() {
    const mobileMenu = document.getElementById('mobile-menu') || document.querySelector('.mobile-menu');
    if (!mobileMenu) return;

    const submenuToggles = mobileMenu.querySelectorAll('.mobile-nav-link--accordion');
    if (!submenuToggles.length) return;

    submenuToggles.forEach(toggle => {
      const submenu = toggle.nextElementSibling?.classList.contains('mobile-submenu')
        ? toggle.nextElementSibling
        : toggle.parentElement.querySelector('.mobile-submenu');

      if (!submenu) return;

      const chevron = toggle.querySelector('.mobile-nav__chevron');

      submenu.style.maxHeight = '0';
      submenu.style.overflow = 'hidden';
      submenu.style.transition = 'max-height 0.35s ease';
      toggle.setAttribute('aria-expanded', 'false');

      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = submenu.classList.contains('is-open');

        submenuToggles.forEach(otherToggle => {
          const otherSubmenu = otherToggle.nextElementSibling?.classList.contains('mobile-submenu')
            ? otherToggle.nextElementSibling
            : otherToggle.parentElement.querySelector('.mobile-submenu');
          const otherChevron = otherToggle.querySelector('.mobile-nav__chevron');

          if (otherSubmenu && otherSubmenu !== submenu) {
            otherSubmenu.classList.remove('is-open');
            otherSubmenu.style.maxHeight = '0';
            otherToggle.setAttribute('aria-expanded', 'false');
            if (otherChevron) otherChevron.style.transform = 'rotate(0deg)';
          }
        });

        if (!isOpen) {
          submenu.classList.add('is-open');
          submenu.style.maxHeight = submenu.scrollHeight + 'px';
          toggle.setAttribute('aria-expanded', 'true');
          if (chevron) chevron.style.transform = 'rotate(180deg)';
        } else {
          submenu.classList.remove('is-open');
          submenu.style.maxHeight = '0';
          toggle.setAttribute('aria-expanded', 'false');
          if (chevron) chevron.style.transform = 'rotate(0deg)';
        }
      });
    });
  }

  // ─── 19. REDUCED MOTION OVERRIDE ─────────────────────────────────────────────
  if (prefersReducedMotion) {
    document.querySelectorAll('.reveal-up').forEach(el => el.classList.add('revealed'));
    document.querySelectorAll('[data-count]').forEach(el => {
      el.textContent = el.dataset.count + (el.dataset.suffix || '');
    });
    document.querySelectorAll('.text-reveal').forEach(el => el.classList.add('revealed'));
  }
});
