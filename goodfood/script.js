/**
 * Good Food — American Grill House / Grottaminarda
 * script.js — Complete UI interactions
 * Production-ready vanilla JS, no dependencies
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────────
   * 1. FEATURE DETECTION
   * ───────────────────────────────────────────── */
  const isMobile = !window.matchMedia('(hover: hover)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  /* ─────────────────────────────────────────────
   * 14. DYNAMIC COPYRIGHT YEAR (runs first — no deps)
   * ───────────────────────────────────────────── */
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });


  /* ─────────────────────────────────────────────
   * 2. PRELOADER (Variant B — Curtain Split)
   * ───────────────────────────────────────────── */
  const preloader = document.querySelector('.preloader');
  const isHomePage = document.body.dataset.page === 'home' ||
    window.location.pathname === '/' ||
    window.location.pathname.endsWith('index.html') ||
    window.location.pathname.endsWith('/');

  let preloaderDone = false;
  function dispatchPreloaderComplete() {
    preloaderDone = true;
    document.dispatchEvent(new CustomEvent('preloaderComplete'));
  }

  if (preloader && isHomePage) {
    const alreadyVisited = sessionStorage.getItem('gf-visited');

    if (alreadyVisited || prefersReducedMotion) {
      preloader.style.display = 'none';
      document.body.style.overflow = '';
      dispatchPreloaderComplete();
    } else {
      document.body.style.overflow = 'hidden';
      sessionStorage.setItem('gf-visited', '1');

      const leftCurtain = preloader.querySelector('.preloader-curtain-left');
      const rightCurtain = preloader.querySelector('.preloader-curtain-right');
      const brandText = preloader.querySelector('.preloader-logo');

      // Phase 1: fade in brand name (0 → 600ms)
      if (brandText) {
        brandText.style.opacity = '0';
        brandText.style.transition = 'opacity 0.5s ease';
        requestAnimationFrame(() => {
          setTimeout(() => {
            brandText.style.opacity = '1';
          }, 100);
        });
      }

      // Phase 2: curtains split apart (800ms → 2500ms)
      setTimeout(() => {
        if (leftCurtain) {
          leftCurtain.style.transition = 'transform 0.9s cubic-bezier(0.76, 0, 0.24, 1)';
          leftCurtain.style.transform = 'translateX(-100%)';
        }
        if (rightCurtain) {
          rightCurtain.style.transition = 'transform 0.9s cubic-bezier(0.76, 0, 0.24, 1)';
          rightCurtain.style.transform = 'translateX(100%)';
        }
        if (brandText) {
          brandText.style.transition = 'opacity 0.4s ease';
          brandText.style.opacity = '0';
        }
      }, 800);

      // Phase 3: remove preloader and restore scroll
      setTimeout(() => {
        preloader.style.display = 'none';
        document.body.style.overflow = '';
        document.querySelector('.hero-home')?.classList.add('loaded');
        dispatchPreloaderComplete();
      }, 1700);
    }
  } else if (preloader) {
    preloader.style.display = 'none';
    document.body.style.overflow = '';
    dispatchPreloaderComplete();
  } else {
    dispatchPreloaderComplete();
  }


  /* ─────────────────────────────────────────────
   * 3. HEADER SCROLL BEHAVIOR
   * ───────────────────────────────────────────── */
  const header = document.querySelector('.header');

  if (header) {
    let lastScrollY = window.scrollY;
    let ticking = false;
    let mobileMenuOpen = false;

    function updateHeader() {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;

      if (currentScrollY > 50) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }

      if (!mobileMenuOpen) {
        if (delta > 5 && currentScrollY > 100) {
          header.classList.add('header-hidden');
        } else if (delta < -5) {
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

    // Expose setter for mobile menu module
    window._setHeaderMobileState = (open) => {
      mobileMenuOpen = open;
      if (open) {
        header.classList.remove('header-hidden');
      }
    };
  }


  /* ─────────────────────────────────────────────
   * 4. MOBILE MENU
   * ───────────────────────────────────────────── */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileMenuClose = document.querySelector('.mobile-menu__close');
  const mobileMenuLinks = document.querySelectorAll('.mobile-menu__link');

  function openMobileMenu() {
    if (!mobileMenu || !hamburger) return;
    mobileMenu.classList.add('menu-open');
    document.body.classList.add('menu-open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (window._setHeaderMobileState) window._setHeaderMobileState(true);

    // Stagger link animations
    mobileMenuLinks.forEach((link, i) => {
      link.style.opacity = '0';
      link.style.transform = 'translateY(30px)';
      link.style.transition = `opacity 0.4s ease ${i * 50}ms, transform 0.4s ease ${i * 50}ms`;
      requestAnimationFrame(() => {
        setTimeout(() => {
          link.style.opacity = '1';
          link.style.transform = 'translateY(0)';
        }, 20);
      });
    });

    // Focus first focusable element
    setTimeout(() => {
      if (mobileMenuClose) mobileMenuClose.focus();
    }, 100);
  }

  function closeMobileMenu() {
    if (!mobileMenu || !hamburger) return;
    mobileMenu.classList.remove('menu-open');
    document.body.classList.remove('menu-open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (window._setHeaderMobileState) window._setHeaderMobileState(false);
    hamburger.focus();
  }

  if (hamburger) {
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu && mobileMenu.classList.contains('menu-open');
      isOpen ? closeMobileMenu() : openMobileMenu();
    });
  }

  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeMobileMenu);
  }

  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('menu-open')) {
      closeMobileMenu();
    }

    // Focus trap inside mobile menu
    if (e.key === 'Tab' && mobileMenu && mobileMenu.classList.contains('menu-open')) {
      const focusableEls = mobileMenu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
      const focusArray = Array.from(focusableEls);
      if (focusArray.length === 0) return;
      const firstEl = focusArray[0];
      const lastEl = focusArray[focusArray.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }
  });


  /* ─────────────────────────────────────────────
   * 5. CUSTOM CURSOR (desktop only)
   * ───────────────────────────────────────────── */
  if (!isMobile && !prefersReducedMotion) {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorFollower = document.querySelector('.cursor-follower');

    if (cursorDot && cursorFollower) {
      let mouseX = -100;
      let mouseY = -100;
      let followerX = -100;
      let followerY = -100;
      let cursorVisible = false;
      let rafId = null;

      // Start offscreen
      cursorDot.style.transform = 'translate(-100px, -100px)';
      cursorFollower.style.transform = 'translate(-100px, -100px)';

      function lerp(start, end, factor) {
        return start + (end - start) * factor;
      }

      function animateCursor() {
        followerX = lerp(followerX, mouseX, 0.15);
        followerY = lerp(followerY, mouseY, 0.15);

        cursorDot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
        cursorFollower.style.transform = `translate(${followerX - 16}px, ${followerY - 16}px)`;

        rafId = requestAnimationFrame(animateCursor);
      }

      document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!cursorVisible) {
          cursorVisible = true;
          document.body.classList.add('custom-cursor');
          followerX = mouseX;
          followerY = mouseY;
          animateCursor();
        }
      });

      document.addEventListener('mouseleave', () => {
        cursorDot.classList.add('hidden');
        cursorFollower.classList.add('hidden');
      });

      document.addEventListener('mouseenter', () => {
        cursorDot.classList.remove('hidden');
        cursorFollower.classList.remove('hidden');
      });

      const hoverTargets = document.querySelectorAll('a, button, [role="button"], input, textarea, select, label');
      hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => cursorFollower.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorFollower.classList.remove('hover'));
      });
    }
  }


  /* ─────────────────────────────────────────────
   * 6. SCROLL PROGRESS BAR
   * ───────────────────────────────────────────── */
  const scrollProgress = document.querySelector('.scroll-progress');

  if (scrollProgress) {
    let progressTicking = false;

    function updateScrollProgress() {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? window.scrollY / docHeight : 0;
      scrollProgress.style.transform = `scaleX(${progress})`;
      progressTicking = false;
    }

    window.addEventListener('scroll', () => {
      if (!progressTicking) {
        requestAnimationFrame(updateScrollProgress);
        progressTicking = true;
      }
    }, { passive: true });
  }


  /* ─────────────────────────────────────────────
   * 7. REVEAL ON SCROLL
   * ───────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal-up');
  const heroRevealEls = document.querySelectorAll('.hero-home .reveal-up, .hero-internal .reveal-up, .hero-reveal');

  if (prefersReducedMotion) {
    revealEls.forEach(el => el.classList.add('revealed'));
  } else {
    // Hero elements: reveal after preloader
    const heroRevealSet = new Set(heroRevealEls);

    function revealHeroElements() {
      heroRevealEls.forEach((el, i) => {
        setTimeout(() => el.classList.add('revealed'), i * 100);
      });
    }

    // If preloader already completed before this code ran, reveal immediately
    if (preloaderDone) {
      revealHeroElements();
    } else {
      document.addEventListener('preloaderComplete', revealHeroElements);
    }

    // Non-hero: IntersectionObserver
    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      revealEls.forEach(el => {
        if (!heroRevealSet.has(el)) {
          revealObserver.observe(el);
        }
      });
    } else {
      // Fallback: reveal all non-hero immediately
      revealEls.forEach(el => {
        if (!heroRevealSet.has(el)) el.classList.add('revealed');
      });
    }
  }


  /* ─────────────────────────────────────────────
   * 8. COUNTER ANIMATION
   * ───────────────────────────────────────────── */
  const counterEls = document.querySelectorAll('[data-count]');

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCounter(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const startTime = performance.now();

    if (prefersReducedMotion) {
      el.textContent = target + suffix;
      return;
    }

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const current = Math.round(easedProgress * target);
      el.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target + suffix;
      }
    }

    requestAnimationFrame(tick);
  }

  if (counterEls.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counterEls.forEach(el => {
      if (prefersReducedMotion) {
        const target = el.dataset.count;
        const suffix = el.dataset.suffix || '';
        el.textContent = target + suffix;
      } else {
        counterObserver.observe(el);
      }
    });
  }


  /* ─────────────────────────────────────────────
   * 9. PARALLAX (desktop only)
   * ───────────────────────────────────────────── */
  if (!isMobile && !prefersReducedMotion) {
    const parallaxEls = document.querySelectorAll('.parallax-bg');

    if (parallaxEls.length > 0) {
      let parallaxTicking = false;

      function updateParallax() {
        const scrollY = window.scrollY;
        parallaxEls.forEach(el => {
          const rect = el.getBoundingClientRect();
          const winH = window.innerHeight;
          // Only process if element is in or near viewport
          if (rect.bottom > -winH && rect.top < winH * 2) {
            const centerOffset = (rect.top + rect.height / 2) - winH / 2;
            const shift = centerOffset * 0.3;
            el.style.transform = `translateY(${shift}px)`;
          }
        });
        parallaxTicking = false;
      }

      window.addEventListener('scroll', () => {
        if (!parallaxTicking) {
          requestAnimationFrame(updateParallax);
          parallaxTicking = true;
        }
      }, { passive: true });

      // Initial call
      updateParallax();
    }
  }


  /* ─────────────────────────────────────────────
   * 10. MAGNETIC BUTTONS (desktop only)
   * ───────────────────────────────────────────── */
  if (!isMobile && !prefersReducedMotion) {
    const magneticBtns = document.querySelectorAll('.magnetic-btn');

    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;
        const maxShift = 12;
        const shiftX = (distX / (rect.width / 2)) * maxShift;
        const shiftY = (distY / (rect.height / 2)) * maxShift;
        btn.style.transform = `translate(${shiftX}px, ${shiftY}px)`;
        btn.style.transition = 'transform 0.1s ease';
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
        btn.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      });
    });
  }


  /* ─────────────────────────────────────────────
   * 11. SMOOTH SCROLL
   * ───────────────────────────────────────────── */
  function getHeaderHeight() {
    const h = document.querySelector('.header');
    return h ? h.offsetHeight : 0;
  }

  function scrollToTarget(targetEl) {
    const offset = getHeaderHeight() + 20;
    const top = targetEl.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({
      top,
      behavior: prefersReducedMotion ? 'instant' : 'smooth'
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const hash = link.getAttribute('href');
      if (hash === '#') return;
      const targetEl = document.querySelector(hash);
      if (targetEl) {
        e.preventDefault();
        scrollToTarget(targetEl);
      }
    });
  });

  // Handle incoming links with hash from other pages (e.g., index.html#recensioni)
  if (window.location.hash) {
    const hash = window.location.hash;
    const targetEl = document.querySelector(hash);
    if (targetEl) {
      // Wait briefly to let page render
      setTimeout(() => scrollToTarget(targetEl), 300);
    }
  }


  /* ─────────────────────────────────────────────
   * 12. ACTIVE NAV LINK
   * ───────────────────────────────────────────── */
  const navLinks = document.querySelectorAll('.nav__link, .mobile-menu__link');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (!linkHref) return;

    // Multi-page match
    const linkPage = linkHref.split('#')[0].split('/').pop() || 'index.html';
    if (linkPage === currentPath && !linkHref.includes('#')) {
      link.classList.add('active');
    } else if (currentPath === '' || currentPath === '/' || currentPath === 'index.html') {
      if (linkPage === 'index.html' && !linkHref.includes('#')) {
        link.classList.add('active');
      }
    }
  });

  // Same-page section tracking with IntersectionObserver
  const sections = document.querySelectorAll('section[id]');
  if (sections.length > 0 && 'IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            const href = link.getAttribute('href') || '';
            if (href.endsWith('#' + id)) {
              link.classList.add('active');
            } else if (href.includes('#')) {
              link.classList.remove('active');
            }
          });
        }
      });
    }, { threshold: 0.4, rootMargin: '-80px 0px -20% 0px' });

    sections.forEach(section => sectionObserver.observe(section));
  }


  /* ─────────────────────────────────────────────
   * 13. FORM VALIDATION
   * ───────────────────────────────────────────── */
  const contactForms = document.querySelectorAll('.contact-form, form[data-validate]');

  const validators = {
    email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()),
    phone: (val) => /^[\+\d\s\-\(\)]{6,20}$/.test(val.trim()),
    required: (val) => val.trim().length > 0
  };

  const errorMessages = {
    required: 'Questo campo è obbligatorio.',
    email: 'Inserisci un indirizzo email valido.',
    phone: 'Inserisci un numero di telefono valido.'
  };

  function getFieldWrapper(field) {
    return field.closest('.form-group') || field.parentElement;
  }

  function getErrorEl(wrapper) {
    return wrapper.querySelector('.form-error');
  }

  function validateField(field) {
    const wrapper = getFieldWrapper(field);
    const errorEl = getErrorEl(wrapper);
    const value = field.value;
    const type = field.type;
    let isValid = true;
    let message = '';

    if (field.required && !validators.required(value)) {
      isValid = false;
      message = errorMessages.required;
    } else if (type === 'email' && value.trim() && !validators.email(value)) {
      isValid = false;
      message = errorMessages.email;
    } else if ((field.dataset.type === 'phone' || type === 'tel') && value.trim() && !validators.phone(value)) {
      isValid = false;
      message = errorMessages.phone;
    }

    if (isValid) {
      wrapper.classList.remove('error');
      if (value.trim()) wrapper.classList.add('valid');
      if (errorEl) errorEl.textContent = '';
    } else {
      wrapper.classList.add('error');
      wrapper.classList.remove('valid');
      if (errorEl) errorEl.textContent = message;
    }

    return isValid;
  }

  contactForms.forEach(form => {
    const fields = form.querySelectorAll('input[required], textarea[required], select[required], input[type="email"], input[type="tel"]');

    // Blur validation
    fields.forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        const wrapper = getFieldWrapper(field);
        if (wrapper.classList.contains('error')) validateField(field);
      });
    });

    // Submit validation
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let allValid = true;
      let firstError = null;

      fields.forEach(field => {
        const valid = validateField(field);
        if (!valid && !firstError) firstError = field;
        if (!valid) allValid = false;
      });

      if (!allValid && firstError) {
        scrollToTarget(firstError);
        firstError.focus();
        return;
      }

      if (allValid) {
        // Replace form with success message
        const successMsg = document.createElement('div');
        successMsg.className = 'form-success';
        successMsg.innerHTML = `
          <p class="form-success__title">Messaggio inviato!</p>
          <p class="form-success__text">Grazie per averci contattato. Ti risponderemo al più presto.</p>
        `;
        form.parentNode.replaceChild(successMsg, form);

        // Optionally submit via fetch if action set
        if (form.action && form.action !== window.location.href) {
          const data = new FormData(form);
          fetch(form.action, { method: 'POST', body: data }).catch(() => {});
        }
      }
    });
  });


  /* ─────────────────────────────────────────────
   * 15. CINEMATIC GALLERY — HOME ONLY
   * ───────────────────────────────────────────── */
  const cinematicGallery = document.querySelector('.cinematic-gallery');

  if (cinematicGallery) {
    const images = cinematicGallery.querySelectorAll('.cinematic-gallery-slide');
    const dots = cinematicGallery.querySelectorAll('.cinematic-dot');

    if (images.length > 1) {
      let currentIndex = 0;

      function showImage(index) {
        images.forEach((img, i) => {
          img.classList.toggle('active', i === index);
        });
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === index);
          dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
        });
        const counter = cinematicGallery.querySelector('.current');
        if (counter) counter.textContent = String(index + 1).padStart(2, '0');
        currentIndex = index;
      }

      // Dot click
      dots.forEach((dot, i) => {
        dot.addEventListener('click', () => showImage(i));
      });

      if (!isMobile && !prefersReducedMotion) {
        // Desktop: scroll-driven crossfade
        function updateGalleryOnScroll() {
          const rect = cinematicGallery.getBoundingClientRect();
          const galleryHeight = cinematicGallery.offsetHeight;
          const progress = Math.max(0, Math.min(1, -rect.top / (galleryHeight - window.innerHeight)));
          const targetIndex = Math.min(
            Math.floor(progress * images.length),
            images.length - 1
          );
          if (targetIndex !== currentIndex) showImage(targetIndex);
        }

        window.addEventListener('scroll', updateGalleryOnScroll, { passive: true });
        updateGalleryOnScroll();
      } else {
        // Mobile: touch swipe carousel
        let touchStartX = 0;
        let touchStartY = 0;
        let isDragging = false;

        cinematicGallery.addEventListener('touchstart', (e) => {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
          isDragging = true;
        }, { passive: true });

        cinematicGallery.addEventListener('touchend', (e) => {
          if (!isDragging) return;
          isDragging = false;
          const dx = e.changedTouches[0].clientX - touchStartX;
          const dy = e.changedTouches[0].clientY - touchStartY;
          if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
            if (dx < 0) {
              showImage((currentIndex + 1) % images.length);
            } else {
              showImage((currentIndex - 1 + images.length) % images.length);
            }
          }
        }, { passive: true });

        // Auto-advance on mobile
        let autoAdvance = setInterval(() => {
          showImage((currentIndex + 1) % images.length);
        }, 4000);

        cinematicGallery.addEventListener('touchstart', () => {
          clearInterval(autoAdvance);
        }, { passive: true });
      }

      // Init first image
      showImage(0);
    }
  }


  /* ─────────────────────────────────────────────
   * 16. MENU TABS — MENU PAGE ONLY
   * ───────────────────────────────────────────── */
  const menuTabsContainer = document.querySelector('.menu-tabs');

  if (menuTabsContainer) {
    const tabList = menuTabsContainer.querySelector('[role="tablist"]') || menuTabsContainer;
    const tabs = menuTabsContainer.querySelectorAll('[role="tab"]');
    const panels = document.querySelectorAll('[role="tabpanel"]');
    const menuImageEl = document.querySelector('.menu-category-image');

    function activateTab(tab) {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
        t.setAttribute('tabindex', '-1');
      });

      panels.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('hidden', '');
      });

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      tab.setAttribute('tabindex', '0');

      const controlsId = tab.getAttribute('aria-controls');
      if (controlsId) {
        const panel = document.getElementById(controlsId);
        if (panel) {
          // Crossfade panel
          panel.style.opacity = '0';
          panel.removeAttribute('hidden');
          panel.classList.add('active');
          requestAnimationFrame(() => {
            panel.style.transition = 'opacity 0.35s ease';
            panel.style.opacity = '1';
          });
        }
      }

      // Crossfade category image
      if (menuImageEl) {
        const imgSrc = tab.dataset.image;
        if (imgSrc && imgSrc !== menuImageEl.src) {
          menuImageEl.style.transition = 'opacity 0.35s ease';
          menuImageEl.style.opacity = '0';
          setTimeout(() => {
            menuImageEl.src = imgSrc;
            menuImageEl.style.opacity = '1';
          }, 350);
        }
      }
    }

    tabs.forEach((tab, index) => {
      tab.setAttribute('role', 'tab');
      tab.setAttribute('tabindex', index === 0 ? '0' : '-1');
      if (index === 0) {
        tab.setAttribute('aria-selected', 'true');
      } else {
        tab.setAttribute('aria-selected', 'false');
      }

      tab.addEventListener('click', () => activateTab(tab));

      // Keyboard navigation
      tab.addEventListener('keydown', (e) => {
        let newIndex = index;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          newIndex = (index + 1) % tabs.length;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          newIndex = (index - 1 + tabs.length) % tabs.length;
        } else if (e.key === 'Home') {
          e.preventDefault();
          newIndex = 0;
        } else if (e.key === 'End') {
          e.preventDefault();
          newIndex = tabs.length - 1;
        }
        if (newIndex !== index) {
          tabs[newIndex].focus();
          activateTab(tabs[newIndex]);
        }
      });
    });

    // Init first tab
    if (tabs.length > 0) activateTab(tabs[0]);
  }


  /* ─────────────────────────────────────────────
   * 17. REVIEWS SLIDER
   * ───────────────────────────────────────────── */
  const reviewsSlider = document.querySelector('.reviews-slider');

  if (reviewsSlider) {
    const track = reviewsSlider.querySelector('.reviews-track');
    const slides = reviewsSlider.querySelectorAll('.review-card');
    const dotsContainer = reviewsSlider.querySelector('.reviews-slider-dots');

    if (track && slides.length > 1) {
      let currentPage = 0;
      let autoTimer = null;
      let touchStartX = 0;
      let isHovered = false;

      function getTotalPages() {
        const trackWidth = track.offsetWidth;
        const scrollWidth = track.scrollWidth;
        return Math.max(1, Math.ceil(scrollWidth / trackWidth));
      }

      // Build dots if container exists
      const dotEls = [];
      function buildDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        dotEls.length = 0;
        const totalPages = getTotalPages();
        for (let i = 0; i < totalPages; i++) {
          const dot = document.createElement('button');
          dot.className = 'reviews-slider-dot';
          dot.setAttribute('aria-label', `Pagina ${i + 1}`);
          dot.addEventListener('click', () => goTo(i));
          dotsContainer.appendChild(dot);
          dotEls.push(dot);
        }
        updateDots();
      }

      function updateDots() {
        dotEls.forEach((dot, i) => {
          dot.classList.toggle('active', i === currentPage);
        });
      }

      function goTo(index) {
        const totalPages = getTotalPages();
        currentPage = (index + totalPages) % totalPages;
        const maxScroll = track.scrollWidth - track.offsetWidth;
        const scrollTarget = currentPage === totalPages - 1
          ? maxScroll
          : currentPage * track.offsetWidth;
        track.scrollTo({
          left: scrollTarget,
          behavior: prefersReducedMotion ? 'instant' : 'smooth'
        });
        updateDots();
      }

      function startAuto() {
        if (autoTimer) clearInterval(autoTimer);
        autoTimer = setInterval(() => {
          if (!isHovered) goTo(currentPage + 1);
        }, 5000);
      }

      // Arrow buttons
      const prevBtn = reviewsSlider.querySelector('.reviews-arrow--prev');
      const nextBtn = reviewsSlider.querySelector('.reviews-arrow--next');
      if (prevBtn) prevBtn.addEventListener('click', () => goTo(currentPage - 1));
      if (nextBtn) nextBtn.addEventListener('click', () => goTo(currentPage + 1));

      reviewsSlider.addEventListener('mouseenter', () => { isHovered = true; });
      reviewsSlider.addEventListener('mouseleave', () => { isHovered = false; });

      // Touch swipe
      reviewsSlider.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
      }, { passive: true });

      reviewsSlider.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 40) {
          goTo(dx < 0 ? currentPage + 1 : currentPage - 1);
        }
      }, { passive: true });

      // Sync dots on manual scroll
      track.addEventListener('scroll', () => {
        const totalPages = getTotalPages();
        const maxScroll = track.scrollWidth - track.offsetWidth;
        const page = maxScroll > 0
          ? Math.round((track.scrollLeft / maxScroll) * (totalPages - 1))
          : 0;
        if (page !== currentPage) {
          currentPage = page;
          updateDots();
        }
      }, { passive: true });

      // Rebuild dots on resize
      window.addEventListener('resize', buildDots);
      buildDots();

      updateDots();
      if (!prefersReducedMotion) startAuto();
    }
  }


  /* ─────────────────────────────────────────────
   * 18. REDUCED MOTION MASTER OVERRIDE
   * ───────────────────────────────────────────── */
  if (prefersReducedMotion) {
    // Reveal all immediately
    document.querySelectorAll('.reveal-up').forEach(el => el.classList.add('revealed'));

    // Set counter final values immediately
    document.querySelectorAll('[data-count]').forEach(el => {
      el.textContent = (el.dataset.count || '0') + (el.dataset.suffix || '');
    });

    // Disable CSS transitions for animated elements
    document.documentElement.style.setProperty('--transition-speed', '0s');
  }

  /* ─────────────────────────────────────────────
   * LIVE HOVER TARGET UPDATES
   * (for dynamically added elements — custom cursor)
   * ───────────────────────────────────────────── */
  if (!isMobile && !prefersReducedMotion) {
    const cursorFollower = document.querySelector('.cursor-follower');
    if (cursorFollower) {
      document.addEventListener('mouseover', (e) => {
        if (e.target.closest('a, button, [role="button"], input, textarea, select, label')) {
          cursorFollower.classList.add('hover');
        }
      });
      document.addEventListener('mouseout', (e) => {
        if (e.target.closest('a, button, [role="button"], input, textarea, select, label')) {
          cursorFollower.classList.remove('hover');
        }
      });
    }
  }

}); // end DOMContentLoaded
