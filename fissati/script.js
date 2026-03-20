/* ============================================
   FISSATI — script.js
   All interactions — vanilla JS, no dependencies
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Feature Detection --- */
  const isMobile = !window.matchMedia('(hover: hover)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- Init All Modules --- */
  initPreloader();
  initHeader();
  initMobileMenu();
  initScrollProgress();
  initRevealAnimations();
  initCounters();
  if (!isMobile) initCustomCursor();
  if (!isMobile && !prefersReducedMotion) initParallax();
  if (!isMobile) initMagneticButtons();
  initSmoothScroll();
  initActiveNav();
  initForms();
  initDynamicYear();

  /* Section-specific — only init if present */
  if (document.querySelector('.horizontal-scroll')) initHorizontalScroll();
  if (document.querySelector('.brand-card')) initBrandCards();
  if (document.querySelector('.faq-item')) initFaqAccordion();
  if (document.querySelector('.services-tabs')) initServicesTabs();
  if (document.querySelector('.gallery-grid')) initGalleryFilter();
  if (document.querySelector('.gallery-grid')) initLightbox();
  if (document.querySelector('.testimonial-slider')) initTestimonialSlider();


  /* ===========================================
     1. PRELOADER
     =========================================== */
  function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;

    const isHome = window.location.pathname === '/' ||
                   window.location.pathname.endsWith('index.html') ||
                   window.location.pathname.endsWith('/');
    const visited = sessionStorage.getItem('fissati-visited');

    if (!isHome || visited || prefersReducedMotion) {
      preloader.remove();
      document.body.classList.remove('preloader-active');
      triggerHeroReveal(300);
      return;
    }

    document.body.classList.add('preloader-active');

    const logo = preloader.querySelector('.preloader__logo');
    const sub = preloader.querySelector('.preloader__sub');
    const line = preloader.querySelector('.preloader__line');

    if (logo) setTimeout(() => { logo.classList.add('visible'); }, 200);
    if (sub) setTimeout(() => { sub.classList.add('visible'); }, 200);
    if (line) setTimeout(() => { line.classList.add('expand'); }, 500);

    setTimeout(() => {
      preloader.classList.add('done');
      document.body.classList.remove('preloader-active');
      sessionStorage.setItem('fissati-visited', 'true');

      setTimeout(() => {
        preloader.remove();
        document.dispatchEvent(new CustomEvent('preloaderComplete'));
        triggerHeroReveal(0);
      }, 600);
    }, 2500);
  }

  function triggerHeroReveal(delay) {
    setTimeout(() => {
      document.querySelectorAll('.hero .reveal-up').forEach((el, i) => {
        setTimeout(() => { el.classList.add('revealed'); }, i * 120);
      });
    }, delay);
  }


  /* ===========================================
     2. HEADER SCROLL BEHAVIOR
     =========================================== */
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
        if (currentY > lastScrollY && currentY - lastScrollY > 5 && currentY > 100) {
          header.classList.add('header-hidden');
        } else if (lastScrollY - currentY > 5) {
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


  /* ===========================================
     3. MOBILE MENU
     =========================================== */
  function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.mobile-menu');
    if (!toggle || !menu) return;

    const links = menu.querySelectorAll('.mobile-menu-link');
    let previousFocus = null;

    function openMenu() {
      previousFocus = document.activeElement;
      menu.classList.add('open');
      toggle.classList.add('active');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      if (window._setMenuOpen) window._setMenuOpen(true);

      const header = document.querySelector('.header');
      if (header) header.classList.remove('header-hidden');

      setTimeout(() => {
        if (links.length) links[0].focus();
      }, 200);
    }

    function closeMenu() {
      menu.classList.remove('open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (window._setMenuOpen) window._setMenuOpen(false);

      if (previousFocus) previousFocus.focus();
    }

    toggle.addEventListener('click', () => {
      menu.classList.contains('open') ? closeMenu() : openMenu();
    });

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        closeMenu();
      }
    });

    /* Focus trap */
    menu.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const focusable = menu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
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
    });
  }


  /* ===========================================
     4. CUSTOM CURSOR
     =========================================== */
  function initCustomCursor() {
    if (prefersReducedMotion) return;

    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const follower = document.createElement('div');
    follower.className = 'cursor-follower';

    dot.classList.add('hidden');
    follower.classList.add('hidden');

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
        dot.classList.remove('hidden');
        follower.classList.remove('hidden');
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

    /* Hover states — use event delegation for dynamic elements */
    const interactiveSelector = 'a, button, [role="button"], input, textarea, select, label';

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveSelector)) {
        follower.classList.add('hover');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveSelector)) {
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


  /* ===========================================
     5. SCROLL PROGRESS BAR
     =========================================== */
  function initScrollProgress() {
    const bar = document.querySelector('.scroll-progress__bar');
    if (!bar) return;

    let ticking = false;

    function updateProgress() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
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


  /* ===========================================
     6. REVEAL ON SCROLL
     =========================================== */
  function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal-up:not(.hero .reveal-up)');

    if (prefersReducedMotion) {
      reveals.forEach(el => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay;
          if (delay) {
            entry.target.style.transitionDelay = `${parseInt(delay) * 100}ms`;
          }
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    reveals.forEach(el => observer.observe(el));

    /* Hero reveals on pages without preloader */
    const preloader = document.querySelector('.preloader');
    if (!preloader) {
      triggerHeroReveal(300);
    }

    document.addEventListener('preloaderComplete', () => {
      triggerHeroReveal(0);
    });
  }


  /* ===========================================
     7. COUNTER ANIMATION
     =========================================== */
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


  /* ===========================================
     8. PARALLAX
     =========================================== */
  function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const bg = hero.querySelector('.hero__bg');
    if (!bg) return;

    let ticking = false;

    function updateParallax() {
      const rect = hero.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        bg.style.transform = `translateY(${window.scrollY * 0.3}px) scale(1.1)`;
      }
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }


  /* ===========================================
     9. MAGNETIC BUTTONS
     =========================================== */
  function initMagneticButtons() {
    if (prefersReducedMotion) return;

    document.querySelectorAll('.magnetic-btn').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const offsetX = (e.clientX - centerX) * 0.3;
        const offsetY = (e.clientY - centerY) * 0.3;
        btn.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }


  /* ===========================================
     10. SMOOTH SCROLL
     =========================================== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
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


  /* ===========================================
     11. ACTIVE NAV LINK
     =========================================== */
  function initActiveNav() {
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

    document.querySelectorAll('.nav-link, .mobile-menu-link').forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;

      const linkPage = href.split('/').pop() || 'index.html';
      if (linkPage === page || (page === '' && linkPage === 'index.html')) {
        link.classList.add('active');
      }
    });
  }


  /* ===========================================
     12. FORM VALIDATION
     =========================================== */
  function initForms() {
    const forms = document.querySelectorAll('form[data-validate]');

    forms.forEach(form => {
      /* Real-time validation on blur */
      form.querySelectorAll('[required]').forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
          if (field.classList.contains('error')) {
            validateField(field);
          }
        });
      });

      /* Submit handler */
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const fields = form.querySelectorAll('[required]');
        let valid = true;
        let firstError = null;

        fields.forEach(field => {
          if (!validateField(field)) {
            valid = false;
            if (!firstError) firstError = field;
          }
        });

        /* Privacy checkbox */
        const privacy = form.querySelector('input[name="privacy"]');
        if (privacy && !privacy.checked) {
          valid = false;
          const group = privacy.closest('.form-group');
          if (group) group.classList.add('error');
          if (!firstError) firstError = privacy;
        }

        if (!valid && firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstError.focus();
          return;
        }

        /* Success — show confirmation */
        const successMsg = form.querySelector('.form-success');
        if (successMsg) {
          form.style.display = 'none';
          successMsg.classList.add('visible');
        } else {
          form.innerHTML = `
            <div class="form-success visible">
              <div class="form-success-icon">✓</div>
              <h3>Grazie!</h3>
              <p>Ti risponderemo entro 24 ore.</p>
            </div>
          `;
        }
      });
    });
  }

  function validateField(field) {
    const group = field.closest('.form-group');
    let errorMsg = '';

    field.classList.remove('error', 'valid');
    if (group) {
      group.classList.remove('error');
      const existing = group.querySelector('.field-error');
      if (existing) existing.remove();
    }

    if (field.hasAttribute('required') && !field.value.trim()) {
      errorMsg = 'Questo campo è obbligatorio';
    } else if (field.type === 'email' && field.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value.trim())) {
        errorMsg = 'Inserisci un indirizzo email valido';
      }
    } else if (field.type === 'tel' && field.value.trim()) {
      const digits = field.value.replace(/\D/g, '');
      if (digits.length < 8 || digits.length > 15) {
        errorMsg = 'Inserisci un numero di telefono valido';
      }
    } else if (field.tagName === 'SELECT' && field.hasAttribute('required') && !field.value) {
      errorMsg = 'Seleziona un\'opzione';
    }

    if (errorMsg) {
      field.classList.add('error');
      if (group) {
        group.classList.add('error');
        const errEl = document.createElement('span');
        errEl.className = 'field-error';
        errEl.textContent = errorMsg;
        group.appendChild(errEl);
      }
      return false;
    }

    if (field.value.trim()) {
      field.classList.add('valid');
    }
    return true;
  }


  /* ===========================================
     13. DYNAMIC YEAR
     =========================================== */
  function initDynamicYear() {
    document.querySelectorAll('[data-year]').forEach(el => {
      el.textContent = new Date().getFullYear();
    });
  }


  /* ===========================================
     SECTION-SPECIFIC INTERACTIONS
     =========================================== */


  /* --- Horizontal Scroll Gallery (Signature Moment 1) --- */
  function initHorizontalScroll() {
    const section = document.querySelector('.horizontal-scroll');
    if (!section) return;

    /* Mobile: carousel with swipe */
    if (isMobile || prefersReducedMotion) {
      initMobileCarousel(section);
      return;
    }

    const track = section.querySelector('.horizontal-scroll-track');
    const items = section.querySelectorAll('.horizontal-scroll-item');
    if (!track || !items.length) return;

    const progress = section.querySelector('.horizontal-scroll-progress-fill');

    function updateScroll() {
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const windowH = window.innerHeight;
      const scrollStart = -rect.top;
      const scrollRange = sectionHeight - windowH;

      if (scrollStart < 0 || scrollStart > scrollRange) return;

      const scrollFraction = scrollStart / scrollRange;
      const totalTrackWidth = track.scrollWidth - window.innerWidth;
      const translateX = -scrollFraction * totalTrackWidth;

      track.style.transform = `translateX(${translateX}px)`;

      if (progress) {
        progress.style.width = `${scrollFraction * 100}%`;
      }
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateScroll();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  function initMobileCarousel(section) {
    const track = section.querySelector('.horizontal-scroll-track');
    const items = section.querySelectorAll('.horizontal-scroll-item');
    if (!track || items.length < 2) return;

    let current = 0;
    let startX = 0;
    let diffX = 0;

    /* Create dots */
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'carousel-dots';
    items.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = `carousel-dot${i === 0 ? ' active' : ''}`;
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });
    section.querySelector('.horizontal-scroll-container')?.appendChild(dotsContainer) ||
      section.appendChild(dotsContainer);

    function goToSlide(index) {
      current = Math.max(0, Math.min(index, items.length - 1));
      track.style.transform = `translateX(-${current * 100}%)`;
      dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
      diffX = e.touches[0].clientX - startX;
    }, { passive: true });

    track.addEventListener('touchend', () => {
      if (Math.abs(diffX) > 50) {
        if (diffX < 0 && current < items.length - 1) goToSlide(current + 1);
        else if (diffX > 0 && current > 0) goToSlide(current - 1);
      }
      diffX = 0;
    }, { passive: true });
  }


  /* --- Brand Cards (Signature Moment 2) — Mobile tap --- */
  function initBrandCards() {
    if (!isMobile) return; /* Desktop handled by CSS :hover */

    document.querySelectorAll('.brand-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('a')) return; /* Let links pass through */

        const wasExpanded = card.classList.contains('expanded');

        /* Close all others */
        document.querySelectorAll('.brand-card.expanded').forEach(c => {
          c.classList.remove('expanded');
        });

        if (!wasExpanded) {
          card.classList.add('expanded');
        }
      });
    });
  }


  /* --- FAQ Accordion --- */
  function initFaqAccordion() {
    document.querySelectorAll('.faq-question').forEach(trigger => {
      trigger.setAttribute('role', 'button');
      trigger.setAttribute('aria-expanded', 'false');

      const answer = trigger.nextElementSibling;
      if (answer) {
        const id = 'faq-' + Math.random().toString(36).substring(2, 9);
        answer.id = id;
        trigger.setAttribute('aria-controls', id);
      }

      trigger.addEventListener('click', () => {
        const item = trigger.closest('.faq-item');
        const isActive = item.classList.contains('active');

        /* Close all others (single-open mode) */
        document.querySelectorAll('.faq-item.active').forEach(other => {
          if (other !== item) {
            other.classList.remove('active');
            const otherTrigger = other.querySelector('.faq-question');
            const otherAnswer = other.querySelector('.faq-answer');
            if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
            if (otherAnswer) otherAnswer.style.maxHeight = '0';
          }
        });

        /* Toggle current */
        if (isActive) {
          item.classList.remove('active');
          trigger.setAttribute('aria-expanded', 'false');
          if (answer) answer.style.maxHeight = '0';
        } else {
          item.classList.add('active');
          trigger.setAttribute('aria-expanded', 'true');
          if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });

      /* Keyboard support */
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          trigger.click();
        }
      });

      trigger.setAttribute('tabindex', '0');
    });
  }


  /* --- Services Tabs --- */
  function initServicesTabs() {
    const tabsContainer = document.querySelector('.services-tabs');
    if (!tabsContainer) return;

    const tabs = tabsContainer.querySelectorAll('.tab-btn');
    const panels = tabsContainer.querySelectorAll('.tab-panel');

    tabs.forEach(tab => {
      tab.setAttribute('role', 'tab');
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;

        tabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        panels.forEach(panel => {
          if (panel.dataset.tab === target) {
            panel.classList.add('active');
            panel.setAttribute('role', 'tabpanel');
          } else {
            panel.classList.remove('active');
          }
        });
      });
    });
  }


  /* --- Gallery Filter --- */
  function initGalleryFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        items.forEach(item => {
          const category = item.dataset.category;
          if (filter === 'all' || category === filter) {
            item.style.display = '';
            setTimeout(() => { item.classList.add('visible'); }, 50);
          } else {
            item.classList.remove('visible');
            setTimeout(() => { item.style.display = 'none'; }, 400);
          }
        });
      });
    });

    /* Initial: show all */
    items.forEach(item => item.classList.add('visible'));
  }


  /* --- Gallery Lightbox --- */
  function initLightbox() {
    const items = document.querySelectorAll('.gallery-item');
    if (!items.length) return;

    /* Create lightbox elements */
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <div class="lightbox__overlay"></div>
      <button class="lightbox__close" aria-label="Chiudi">&times;</button>
      <button class="lightbox__nav lightbox__prev" aria-label="Precedente">&#8249;</button>
      <button class="lightbox__nav lightbox__next" aria-label="Successivo">&#8250;</button>
      <img class="lightbox__img" src="" alt="">
    `;
    document.body.appendChild(lightbox);

    const image = lightbox.querySelector('.lightbox__img');
    const overlay = lightbox.querySelector('.lightbox__overlay');
    const closeBtn = lightbox.querySelector('.lightbox__close');
    const prevBtn = lightbox.querySelector('.lightbox__prev');
    const nextBtn = lightbox.querySelector('.lightbox__next');

    let currentIndex = 0;
    let visibleItems = [];

    function getVisibleItems() {
      return Array.from(document.querySelectorAll('.gallery-item')).filter(
        item => item.style.display !== 'none'
      );
    }

    function openLightbox(index) {
      visibleItems = getVisibleItems();
      currentIndex = index;
      const img = visibleItems[currentIndex]?.querySelector('img');
      if (!img) return;

      image.src = img.dataset.full || img.src;
      image.alt = img.alt;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';

      prevBtn.style.display = visibleItems.length > 1 ? '' : 'none';
      nextBtn.style.display = visibleItems.length > 1 ? '' : 'none';
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }

    function navigate(direction) {
      currentIndex = (currentIndex + direction + visibleItems.length) % visibleItems.length;
      const img = visibleItems[currentIndex]?.querySelector('img');
      if (img) {
        image.style.opacity = '0';
        setTimeout(() => {
          image.src = img.dataset.full || img.src;
          image.alt = img.alt;
          image.style.opacity = '1';
        }, 200);
      }
    }

    items.forEach((item, i) => {
      item.style.cursor = 'pointer';
      item.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;
        const visibleIndex = getVisibleItems().indexOf(item);
        if (visibleIndex !== -1) openLightbox(visibleIndex);
      });
    });

    closeBtn.addEventListener('click', closeLightbox);
    overlay.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => navigate(-1));
    nextBtn.addEventListener('click', () => navigate(1));

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });

    /* Touch swipe in lightbox */
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      const diff = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(diff) > 50) {
        navigate(diff < 0 ? 1 : -1);
      }
    }, { passive: true });
  }


  /* --- Testimonial Slider (mini reviews after immersive quote) --- */
  function initTestimonialSlider() {
    const slider = document.querySelector('.testimonial-slider');
    if (!slider) return;

    const slides = slider.querySelectorAll('.testimonial-slide');
    if (slides.length < 2) return;

    let current = 0;

    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'testimonial-dots';
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = `testimonial-dot${i === 0 ? ' active' : ''}`;
      dot.setAttribute('aria-label', `Recensione ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });
    slider.parentElement.appendChild(dotsContainer);

    function goTo(index) {
      slides[current].classList.remove('active');
      current = index;
      slides[current].classList.add('active');
      slider.style.transform = `translateX(-${current * 100}%)`;
      dotsContainer.querySelectorAll('.testimonial-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    /* Auto-advance every 6 seconds */
    let autoplay = setInterval(() => {
      goTo((current + 1) % slides.length);
    }, 6000);

    slider.parentElement.addEventListener('mouseenter', () => clearInterval(autoplay));
    slider.parentElement.addEventListener('mouseleave', () => {
      autoplay = setInterval(() => {
        goTo((current + 1) % slides.length);
      }, 6000);
    });

    /* Touch swipe */
    let startX = 0;
    slider.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      clearInterval(autoplay);
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
      const diff = e.changedTouches[0].clientX - startX;
      if (Math.abs(diff) > 50) {
        if (diff < 0 && current < slides.length - 1) goTo(current + 1);
        else if (diff > 0 && current > 0) goTo(current - 1);
      }
    }, { passive: true });
  }

});
