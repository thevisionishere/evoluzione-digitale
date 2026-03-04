/**
 * Taverna dei Peccati — Premium Website Script
 * LUXE Framework | Evoluzione Digitale
 * Built for performance, accessibility, and rich interaction
 */

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
  // Section-specific inits (conditional on element existence)
  initMarquee();
  initMenuTabs();
  initGallery();
  initFAQ();
});

// ─────────────────────────────────────────────
// 1. PRELOADER — Variant A: Logo + Line
// ─────────────────────────────────────────────
function initPreloader() {
  const preloader = document.querySelector('.preloader');
  if (!preloader) return;

  const alreadyVisited = sessionStorage.getItem('luxe-visited');

  if (alreadyVisited) {
    preloader.style.display = 'none';
    document.body.classList.remove('preloader-active');
    dispatchPreloaderComplete();
    return;
  }

  document.body.classList.add('preloader-active');

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    preloader.style.display = 'none';
    document.body.classList.remove('preloader-active');
    sessionStorage.setItem('luxe-visited', 'true');
    dispatchPreloaderComplete();
    return;
  }

  const logo = preloader.querySelector('.preloader-logo');
  const line = preloader.querySelector('.preloader-line');

  // Step 1: Fade in logo
  requestAnimationFrame(() => {
    if (logo) {
      logo.style.transition = 'opacity 0.6s ease';
      logo.style.opacity = '1';
    }

    // Step 2: Expand line after logo appears
    setTimeout(() => {
      if (line) {
        line.style.transition = 'width 0.8s cubic-bezier(0.77, 0, 0.175, 1)';
        line.style.width = '100%';
      }

      // Step 3: Slide overlay up, reveal page
      setTimeout(() => {
        preloader.style.transition = 'transform 0.7s cubic-bezier(0.77, 0, 0.175, 1)';
        preloader.style.transform = 'translateY(-100%)';

        let preloaderDone = false;
        function finishPreloader() {
          if (preloaderDone) return;
          preloaderDone = true;
          preloader.style.display = 'none';
          document.body.classList.remove('preloader-active');
          sessionStorage.setItem('luxe-visited', 'true');
          dispatchPreloaderComplete();
        }

        preloader.addEventListener('transitionend', finishPreloader, { once: true });
        // Safety: force-remove preloader if transitionend never fires
        setTimeout(finishPreloader, 1200);
      }, 900);
    }, 700);
  });
}

function dispatchPreloaderComplete() {
  document.dispatchEvent(new CustomEvent('preloaderComplete'));
}

// ─────────────────────────────────────────────
// 2. HEADER SCROLL BEHAVIOR
// ─────────────────────────────────────────────
function initHeader() {
  const header = document.querySelector('header, .header, [data-header]');
  if (!header) return;

  let lastScrollY = window.scrollY;
  let ticking = false;
  let menuOpen = false;

  // Expose menuOpen setter for mobile menu module
  window._setMenuOpen = (val) => { menuOpen = val; };

  function updateHeader() {
    const currentScrollY = window.scrollY;
    const delta = currentScrollY - lastScrollY;

    if (currentScrollY < 50) {
      header.classList.remove('header-scrolled', 'header-hidden');
    } else {
      header.classList.add('header-scrolled');

      if (!menuOpen && Math.abs(delta) > 5) {
        if (delta > 0) {
          header.classList.add('header-hidden');
        } else {
          header.classList.remove('header-hidden');
        }
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
}

// ─────────────────────────────────────────────
// 3. MOBILE MENU — Fullscreen Overlay
// ─────────────────────────────────────────────
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger, [data-hamburger], .mobile-menu-toggle');
  const menu = document.querySelector('.mobile-menu');
  if (!hamburger || !menu) return;

  const links = menu.querySelectorAll('a');
  let isOpen = false;

  function openMenu() {
    isOpen = true;
    menu.classList.add('active');
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (window._setMenuOpen) window._setMenuOpen(true);

    // Stagger link animations
    links.forEach((link, i) => {
      link.style.opacity = '0';
      link.style.transform = 'translateY(30px)';
      link.style.transition = `opacity 0.4s ease ${i * 50}ms, transform 0.4s ease ${i * 50}ms`;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          link.style.opacity = '1';
          link.style.transform = 'translateY(0)';
        });
      });
    });

    // Focus trap setup
    trapFocus(menu);
  }

  function closeMenu() {
    isOpen = false;
    menu.classList.remove('active');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (window._setMenuOpen) window._setMenuOpen(false);
    hamburger.focus();
  }

  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-controls', menu.id || 'mobile-menu');

  hamburger.addEventListener('click', () => {
    isOpen ? closeMenu() : openMenu();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeMenu();
  });

  // Close on link click (for SPA-like navigation)
  links.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });
}

function trapFocus(element) {
  const focusable = element.querySelectorAll(
    'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
  );
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  first.focus();

  function handleTab(e) {
    if (e.key !== 'Tab') return;
    if (!element.classList.contains('active')) {
      document.removeEventListener('keydown', handleTab);
      return;
    }

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  document.addEventListener('keydown', handleTab);
}

// ─────────────────────────────────────────────
// 4. CUSTOM CURSOR (desktop only)
// ─────────────────────────────────────────────
function initCustomCursor() {
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const follower = document.createElement('div');
  follower.className = 'cursor-follower';

  // Start hidden until first mousemove
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
      followerX = mouseX;
      followerY = mouseY;
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

  // Hover states on interactive elements
  const interactiveSelector = 'a, button, [role="button"], input, textarea, select, label';
  document.querySelectorAll(interactiveSelector).forEach(el => {
    el.addEventListener('mouseenter', () => follower.classList.add('hover'));
    el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
  });

  // Observe dynamically added elements (e.g., forms, modals)
  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          const interactives = node.matches?.(interactiveSelector)
            ? [node]
            : [...(node.querySelectorAll?.(interactiveSelector) || [])];
          interactives.forEach(el => {
            el.addEventListener('mouseenter', () => follower.classList.add('hover'));
            el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
          });
        }
      });
    });
  });
  mutationObserver.observe(document.body, { childList: true, subtree: true });

  // Hide cursor when leaving viewport
  document.addEventListener('mouseleave', () => {
    dot.classList.add('hidden');
    follower.classList.add('hidden');
  });
  document.addEventListener('mouseenter', () => {
    dot.classList.remove('hidden');
    follower.classList.remove('hidden');
  });
}

// ─────────────────────────────────────────────
// 5. SCROLL PROGRESS BAR
// ─────────────────────────────────────────────
function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress, [data-scroll-progress]');
  if (!bar) return;

  let ticking = false;

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;
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

// ─────────────────────────────────────────────
// 6. REVEAL ON SCROLL
// ─────────────────────────────────────────────
function initRevealAnimations() {
  const elements = document.querySelectorAll('.reveal-up');
  if (!elements.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach(el => el.classList.add('revealed'));
    return;
  }

  // Hero elements: triggered by preloaderComplete, not IntersectionObserver
  const heroElements = document.querySelectorAll(
    '.hero .reveal-up, .internal-hero .reveal-up, .page-hero .reveal-up, [data-hero] .reveal-up'
  );
  const nonHeroElements = [...elements].filter(
    el => !el.closest('.hero, .internal-hero, .page-hero, [data-hero]')
  );

  // Apply data-delay to transition-delay
  elements.forEach(el => {
    const delay = el.dataset.delay;
    if (delay) {
      el.style.transitionDelay = `${delay}ms`;
    }
  });

  // IntersectionObserver for non-hero elements
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  nonHeroElements.forEach(el => observer.observe(el));

  // Hero elements fire on preloaderComplete (or immediately if no preloader)
  function revealHero() {
    heroElements.forEach(el => el.classList.add('revealed'));
  }

  const preloader = document.querySelector('.preloader');
  if (preloader && !sessionStorage.getItem('luxe-visited')) {
    document.addEventListener('preloaderComplete', revealHero, { once: true });
  } else {
    // No preloader or already visited — reveal heroes immediately
    setTimeout(revealHero, 100);
  }
}

// ─────────────────────────────────────────────
// 7. COUNTER ANIMATION
// ─────────────────────────────────────────────
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCounter(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const rawCount = el.dataset.count;
    const isFloat = rawCount.includes('.');
    const decimals = isFloat ? (rawCount.split('.')[1] || '').length : 0;
    const finalText = (isFloat ? target.toFixed(decimals) : target) + suffix;

    // Skip animation for very small numbers (e.g. "1 Passione") — show immediately
    if (target <= 1) {
      el.textContent = finalText;
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = finalText;
      return;
    }

    const duration = 1000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const currentValue = target * easedProgress;

      el.textContent = (isFloat ? currentValue.toFixed(decimals) : Math.round(currentValue)) + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = finalText;
      }
    }

    requestAnimationFrame(update);
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
}

// ─────────────────────────────────────────────
// 8. PARALLAX (desktop only)
// ─────────────────────────────────────────────
function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;

  let ticking = false;

  function updateParallax() {
    const rect = heroBg.closest('.hero, [data-hero]')?.getBoundingClientRect();
    if (rect && rect.bottom > 0 && rect.top < window.innerHeight) {
      const scrollY = window.scrollY;
      heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
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

// ─────────────────────────────────────────────
// 9. MAGNETIC BUTTONS (desktop only)
// ─────────────────────────────────────────────
function initMagneticButtons() {
  const buttons = document.querySelectorAll('.magnetic-btn');
  if (!buttons.length) return;

  const MAX_SHIFT = 12;

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) / (rect.width / 2);
      const deltaY = (e.clientY - centerY) / (rect.height / 2);
      const shiftX = deltaX * MAX_SHIFT;
      const shiftY = deltaY * MAX_SHIFT;

      btn.style.transform = `translate(${shiftX}px, ${shiftY}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)';
      btn.style.transform = 'translate(0, 0)';

      // Remove transition override after spring-back to avoid interfering with hover CSS
      btn.addEventListener('transitionend', () => {
        btn.style.transition = '';
      }, { once: true });
    });

    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'transform 0.1s ease';
    });
  });
}

// ─────────────────────────────────────────────
// 10. SMOOTH SCROLL
// ─────────────────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const header = document.querySelector('header, .header, [data-header]');
      const headerHeight = header ? header.offsetHeight : 0;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

      const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth';

      window.scrollTo({ top: targetTop, behavior });
    });
  });
}

// ─────────────────────────────────────────────
// 11. ACTIVE NAV LINK DETECTION (multi-page)
// ─────────────────────────────────────────────
function initActiveNav() {
  const navLinks = document.querySelectorAll('.nav-link, [data-nav-link]');
  if (!navLinks.length) return;

  // HTML already has hardcoded .active on the correct link.
  // This function only adds aria-current="page" to already-active links for accessibility.
  navLinks.forEach(link => {
    if (link.classList.contains('active')) {
      link.setAttribute('aria-current', 'page');
    }
  });
}

// ─────────────────────────────────────────────
// 12. FORM VALIDATION
// ─────────────────────────────────────────────
function initForms() {
  const forms = document.querySelectorAll('.contact-form');
  if (!forms.length) return;

  forms.forEach(form => {
    const inputs = form.querySelectorAll('input, textarea, select');

    // Floating labels
    inputs.forEach(input => {
      const label = form.querySelector(`label[for="${input.id}"]`);
      if (!label) return;

      function updateLabel() {
        if (input.value.trim() !== '' || document.activeElement === input) {
          label.classList.add('filled');
        } else {
          label.classList.remove('filled');
        }
      }

      input.addEventListener('focus', updateLabel);
      input.addEventListener('blur', () => {
        updateLabel();
        validateField(input);
      });
      input.addEventListener('input', updateLabel);

      // Init on load (e.g., autofill)
      updateLabel();
    });

    // Form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let firstError = null;
      let isValid = true;

      inputs.forEach(input => {
        const valid = validateField(input);
        if (!valid && !firstError) {
          firstError = input;
          isValid = false;
        }
      });

      if (!isValid && firstError) {
        const header = document.querySelector('header, .header');
        const offset = header ? header.offsetHeight + 20 : 20;
        const top = firstError.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
        firstError.focus();
        return;
      }

      // Success: submit form (or show success message)
      submitForm(form);
    });
  });
}

function validateField(input) {
  const value = input.value.trim();
  const type = input.type;
  const required = input.hasAttribute('required');

  clearFieldError(input);

  if (required && value === '') {
    showFieldError(input, 'Questo campo è obbligatorio.');
    return false;
  }

  if (type === 'email' && value !== '') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      showFieldError(input, 'Inserisci un indirizzo email valido.');
      return false;
    }
  }

  if (type === 'tel' && value !== '') {
    const phoneRegex = /^[\d\s\+\-\(\)]{7,20}$/;
    if (!phoneRegex.test(value)) {
      showFieldError(input, 'Inserisci un numero di telefono valido.');
      return false;
    }
  }

  input.classList.add('valid');
  input.classList.remove('error');
  return true;
}

function showFieldError(input, message) {
  input.classList.add('error');
  input.classList.remove('valid');

  let errorEl = input.parentElement.querySelector('.field-error');
  if (!errorEl) {
    errorEl = document.createElement('span');
    errorEl.className = 'field-error';
    errorEl.setAttribute('role', 'alert');
    input.parentElement.appendChild(errorEl);
  }
  errorEl.textContent = message;
}

function clearFieldError(input) {
  input.classList.remove('error');
  const errorEl = input.parentElement.querySelector('.field-error');
  if (errorEl) errorEl.remove();
}

function submitForm(form) {
  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Invio in corso...';
  }

  const formData = new FormData(form);

  fetch(form.action, {
    method: 'POST',
    body: formData,
    headers: { 'Accept': 'application/json' }
  })
  .then(response => {
    if (response.ok) {
      form.innerHTML = `
        <div class="form-success" role="status" aria-live="polite">
          <div class="form-success-icon">✓</div>
          <h3 class="form-success-title">Messaggio inviato!</h3>
          <p class="form-success-message">Grazie per averci contattato. Ti risponderemo al più presto.</p>
        </div>
      `;
      form.querySelector('.form-success')?.focus?.();
    } else {
      throw new Error('Invio fallito');
    }
  })
  .catch(() => {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Invia Prenotazione';
    }
    const errorMsg = form.querySelector('.form-error-global');
    if (!errorMsg) {
      const el = document.createElement('p');
      el.className = 'form-error-global';
      el.setAttribute('role', 'alert');
      el.textContent = 'Si è verificato un errore. Riprova o contattaci per telefono.';
      form.querySelector('.form-submit')?.prepend(el);
    }
  });
}

// ─────────────────────────────────────────────
// 13. DYNAMIC COPYRIGHT YEAR
// ─────────────────────────────────────────────
function initDynamicYear() {
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
}

// ─────────────────────────────────────────────
// 14. MARQUEE — Hover pause
// ─────────────────────────────────────────────
function initMarquee() {
  const marquees = document.querySelectorAll('.marquee, [data-marquee]');
  if (!marquees.length) return;

  marquees.forEach(marquee => {
    const track = marquee.querySelector('.marquee-track, .marquee__track');
    if (!track) return;

    // Desktop: pause on hover
    marquee.addEventListener('mouseenter', () => {
      track.style.animationPlayState = 'paused';
    });
    marquee.addEventListener('mouseleave', () => {
      track.style.animationPlayState = 'running';
    });

    // Touch: pause while touching (mobile JS fallback)
    marquee.addEventListener('touchstart', () => {
      track.style.animationPlayState = 'paused';
    }, { passive: true });
    marquee.addEventListener('touchend', () => {
      track.style.animationPlayState = 'running';
    }, { passive: true });
  });
}

// ─────────────────────────────────────────────
// 15. MENU TABS (Signature Moment 2)
// ─────────────────────────────────────────────
function initMenuTabs() {
  const tabsContainer = document.querySelector('.menu-tabs, [data-menu-tabs]');
  if (!tabsContainer) return;

  const tabs = tabsContainer.querySelectorAll('[role="tab"], .tab-btn, [data-tab]');
  const panels = tabsContainer.querySelectorAll('[role="tabpanel"], .tab-panel, [data-panel]');
  const indicator = tabsContainer.querySelector('.tab-indicator');
  const featuredImage = tabsContainer.querySelector('.tab-featured-image, [data-featured-img]');

  if (!tabs.length) return;

  // Set ARIA attributes
  tabs.forEach((tab, i) => {
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    const panelId = tab.dataset.panel || tab.getAttribute('aria-controls') || `panel-${i}`;
    tab.setAttribute('aria-controls', panelId);
    if (panels[i]) {
      panels[i].setAttribute('role', 'tabpanel');
      panels[i].id = panelId;
      panels[i].setAttribute('aria-labelledby', tab.id || `tab-${i}`);
      if (!tab.id) tab.id = `tab-${i}`;
    }
  });

  const tablist = tabsContainer.querySelector('[role="tablist"], .tabs-list') || tabs[0]?.parentElement;
  if (tablist) tablist.setAttribute('role', 'tablist');

  function activateTab(index) {
    tabs.forEach((tab, i) => {
      const isActive = i === index;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    panels.forEach((panel, i) => {
      const isActive = i === index;
      panel.classList.toggle('active', isActive);
      panel.hidden = !isActive;

      if (isActive) {
        // Slide in animation
        panel.style.opacity = '0';
        panel.style.transform = 'translateY(10px)';
        panel.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            panel.style.opacity = '1';
            panel.style.transform = 'translateY(0)';
          });
        });
      }
    });

    // Move sliding indicator
    if (indicator) {
      const activeTab = tabs[index];
      const tabRect = activeTab.getBoundingClientRect();
      const containerRect = activeTab.parentElement.getBoundingClientRect();
      indicator.style.width = `${tabRect.width}px`;
      indicator.style.transform = `translateX(${tabRect.left - containerRect.left}px)`;
    }

    // Crossfade featured image
    if (featuredImage) {
      const newSrc = tabs[index].dataset.image;
      if (newSrc) {
        featuredImage.style.opacity = '0';
        featuredImage.style.transition = 'opacity 0.4s ease';
        setTimeout(() => {
          featuredImage.src = newSrc;
          featuredImage.style.opacity = '1';
        }, 200);
      }
    }
  }

  // Init first tab
  activateTab(0);

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => activateTab(i));

    // Keyboard navigation (Left/Right arrows)
    tab.addEventListener('keydown', (e) => {
      let newIndex = i;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        newIndex = (i + 1) % tabs.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        newIndex = (i - 1 + tabs.length) % tabs.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        newIndex = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        newIndex = tabs.length - 1;
      }

      if (newIndex !== i) {
        activateTab(newIndex);
        tabs[newIndex].focus();
      }
    });
  });
}

// ─────────────────────────────────────────────
// 17. GALLERY — Lightbox & Hover Effects
// ─────────────────────────────────────────────
function initGallery() {
  const gallery = document.querySelector('.gallery, [data-gallery]');
  if (!gallery) return;

  const items = gallery.querySelectorAll('.gallery-item, [data-gallery-item]');
  if (!items.length) return;

  // Build lightbox
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Galleria immagini');
  lightbox.innerHTML = `
    <div class="lightbox__overlay"></div>
    <div class="lightbox__content">
      <button class="lightbox__close" aria-label="Chiudi galleria">&times;</button>
      <button class="lightbox__prev" aria-label="Immagine precedente">&#8249;</button>
      <button class="lightbox__next" aria-label="Immagine successiva">&#8250;</button>
      <div class="lightbox__img-wrapper">
        <img class="lightbox__img" src="" alt="" />
      </div>
      <p class="lightbox__caption"></p>
    </div>
  `;
  document.body.appendChild(lightbox);

  const lbImg = lightbox.querySelector('.lightbox__img');
  const lbCaption = lightbox.querySelector('.lightbox__caption');
  const lbClose = lightbox.querySelector('.lightbox__close');
  const lbPrev = lightbox.querySelector('.lightbox__prev');
  const lbNext = lightbox.querySelector('.lightbox__next');
  const lbOverlay = lightbox.querySelector('.lightbox__overlay');

  let currentLbIndex = 0;
  const imgItems = [...items].filter(item => item.querySelector('img'));

  function openLightbox(index) {
    currentLbIndex = index;
    const img = imgItems[index].querySelector('img');
    const src = imgItems[index].dataset.full || img.src;
    const alt = img.alt || '';

    lbImg.src = src;
    lbImg.alt = alt;
    lbCaption.textContent = imgItems[index].dataset.caption || alt;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    // Return focus to the triggering element
    imgItems[currentLbIndex]?.focus?.();
  }

  function prevImage() {
    currentLbIndex = (currentLbIndex - 1 + imgItems.length) % imgItems.length;
    openLightbox(currentLbIndex);
  }

  function nextImage() {
    currentLbIndex = (currentLbIndex + 1) % imgItems.length;
    openLightbox(currentLbIndex);
  }

  imgItems.forEach((item, i) => {
    item.style.cursor = 'pointer';
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `Apri immagine ${i + 1}`);

    item.addEventListener('click', () => openLightbox(i));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(i);
      }
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  lbOverlay.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', prevImage);
  lbNext.addEventListener('click', nextImage);

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  });

  // Touch swipe for lightbox
  let lbTouchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    lbTouchStartX = e.touches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    const diff = lbTouchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? nextImage() : prevImage();
    }
  }, { passive: true });
}

// ─────────────────────────────────────────────
// 18. FAQ ACCORDION
// ─────────────────────────────────────────────
function initFAQ() {
  const faqContainer = document.querySelector('.faq, [data-faq]');
  if (!faqContainer) return;

  const items = faqContainer.querySelectorAll('.faq-item, [data-faq-item]');
  if (!items.length) return;

  items.forEach((item, i) => {
    const toggle = item.querySelector('.faq-toggle, [data-faq-toggle], button');
    const panel = item.querySelector('.faq-panel, [data-faq-panel], .faq-answer');
    if (!toggle || !panel) return;

    const panelId = `faq-panel-${i}`;
    const toggleId = `faq-toggle-${i}`;

    toggle.id = toggleId;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', panelId);
    panel.id = panelId;
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-labelledby', toggleId);

    // Initial state: collapsed
    panel.style.maxHeight = '0';
    panel.style.overflow = 'hidden';
    panel.style.transition = 'max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)';

    const icon = toggle.querySelector('.faq-icon, [data-faq-icon]');

    toggle.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all other items
      items.forEach((otherItem) => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          closeItem(otherItem);
        }
      });

      if (isOpen) {
        closeItem(item);
      } else {
        openItem(item);
      }
    });

    function openItem(el) {
      const p = el.querySelector('.faq-panel, [data-faq-panel], .faq-answer');
      const t = el.querySelector('.faq-toggle, [data-faq-toggle], button');
      const ic = t?.querySelector('.faq-icon, [data-faq-icon]');

      el.classList.add('active');
      t?.setAttribute('aria-expanded', 'true');
      if (p) p.style.maxHeight = `${p.scrollHeight}px`;
      if (ic) {
        ic.style.transition = 'transform 0.3s ease';
        ic.style.transform = 'rotate(45deg)';
      }
    }

    function closeItem(el) {
      const p = el.querySelector('.faq-panel, [data-faq-panel], .faq-answer');
      const t = el.querySelector('.faq-toggle, [data-faq-toggle], button');
      const ic = t?.querySelector('.faq-icon, [data-faq-icon]');

      el.classList.remove('active');
      t?.setAttribute('aria-expanded', 'false');
      if (p) p.style.maxHeight = '0';
      if (ic) {
        ic.style.transition = 'transform 0.3s ease';
        ic.style.transform = 'rotate(0deg)';
      }
    }
  });
}
