/* ============================================
   ALGHERO E-MOBILITY — Premium Interactions
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
  initFAQ();
  initFleetCards();
  initWhatsAppPulse();
  initBookingForm();

  /* ========================================
     PRELOADER — Variant E (Minimal Fade)
     ======================================== */
  function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;

    const isHome = document.body.dataset.page === 'home';
    const visited = sessionStorage.getItem('aem-visited');

    if (!isHome || visited || prefersReducedMotion) {
      preloader.remove();
      document.body.classList.remove('preloader-active');
      dispatchPreloaderComplete();
      return;
    }

    document.body.classList.add('preloader-active');
    sessionStorage.setItem('aem-visited', 'true');

    setTimeout(() => {
      preloader.classList.add('fade-out');
      document.body.classList.remove('preloader-active');
      setTimeout(() => {
        preloader.remove();
        dispatchPreloaderComplete();
      }, 800);
    }, 1500);
  }

  function dispatchPreloaderComplete() {
    window.dispatchEvent(new CustomEvent('preloaderComplete'));
  }

  /* ========================================
     HEADER — Scroll Behavior
     ======================================== */
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

          if (!menuOpen) {
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
              header.classList.add('header-hidden');
            } else if (lastScrollY - currentScrollY > 5) {
              header.classList.remove('header-hidden');
            }
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    window.menuOpenState = (open) => { menuOpen = open; };
  }

  /* ========================================
     MOBILE MENU
     ======================================== */
  function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.mobile-menu');
    const header = document.querySelector('.header');
    if (!hamburger || !menu) return;

    const links = menu.querySelectorAll('a');
    let previousFocus = null;

    function openMenu() {
      previousFocus = document.activeElement;
      hamburger.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
      menu.classList.add('open');
      document.body.classList.add('menu-open');
      header.classList.remove('header-hidden');
      if (window.menuOpenState) window.menuOpenState(true);
      if (links.length) links[0].focus();
    }

    function closeMenu() {
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      menu.classList.remove('open');
      document.body.classList.remove('menu-open');
      if (window.menuOpenState) window.menuOpenState(false);
      if (previousFocus) previousFocus.focus();
    }

    hamburger.addEventListener('click', () => {
      menu.classList.contains('open') ? closeMenu() : openMenu();
    });

    links.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        closeMenu();
      }

      if (e.key === 'Tab' && menu.classList.contains('open')) {
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
  }

  /* ========================================
     SCROLL PROGRESS BAR
     ======================================== */
  function initScrollProgress() {
    const bar = document.querySelector('.scroll-progress-bar');
    if (!bar) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
          bar.style.transform = `scaleX(${progress})`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ========================================
     REVEAL ON SCROLL
     ======================================== */
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

    // Hero elements: reveal after preloader
    const heroElements = document.querySelectorAll('.hero .reveal-up');
    if (heroElements.length) {
      heroElements.forEach(el => observer.unobserve(el));

      const revealHero = () => {
        heroElements.forEach((el, i) => {
          setTimeout(() => el.classList.add('revealed'), i * 150);
        });
      };

      if (document.querySelector('.preloader')) {
        window.addEventListener('preloaderComplete', revealHero, { once: true });
      } else {
        setTimeout(revealHero, 300);
      }
    }
  }

  /* ========================================
     COUNTER ANIMATION
     ======================================== */
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
        element.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    }
  }

  /* ========================================
     CUSTOM CURSOR (Desktop only)
     ======================================== */
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
        followerX = mouseX;
        followerY = mouseY;
        document.body.classList.add('custom-cursor');
        dot.classList.remove('hidden');
        follower.classList.remove('hidden');
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

  /* ========================================
     PARALLAX (Desktop only)
     ======================================== */
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
              const speed = parseFloat(el.dataset.parallax) || 0.3;
              const center = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
              el.style.transform = `translateY(${center}px)`;
            }
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ========================================
     MAGNETIC BUTTONS (Desktop only)
     ======================================== */
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

  /* ========================================
     SMOOTH SCROLL
     ======================================== */
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

  /* ========================================
     ACTIVE NAV LINK (Page-based)
     ======================================== */
  function initActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.header-nav a, .mobile-menu-nav a');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      const linkPage = href.split('/').pop() || 'index.html';
      if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  /* ========================================
     FORM VALIDATION
     ======================================== */
  function initForms() {
    const forms = document.querySelectorAll('form[data-validate]');
    forms.forEach(form => {
      const fields = form.querySelectorAll('[required]');
      const formWrapper = form.closest('.contact-form') || form.parentElement;
      const formSuccess = formWrapper.querySelector('.form-success');

      fields.forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
          if (field.closest('.form-group').classList.contains('error')) {
            validateField(field);
          }
        });
      });

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;

        fields.forEach(field => {
          if (!validateField(field)) valid = false;
        });

        if (valid) {
          form.querySelector('.contact-form-fields').style.display = 'none';
          if (formSuccess) formSuccess.style.display = 'block';
        } else {
          const firstError = form.querySelector('.form-group.error input, .form-group.error textarea, .form-group.error select');
          if (firstError) firstError.focus();
        }
      });
    });

    function validateField(field) {
      const group = field.closest('.form-group');
      const errorMsg = group.querySelector('.error-msg');

      group.classList.remove('error', 'valid');

      if (field.required && !field.value.trim()) {
        group.classList.add('error');
        if (errorMsg) errorMsg.textContent = 'Questo campo è obbligatorio';
        return false;
      }

      if (field.type === 'email' && field.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
          group.classList.add('error');
          if (errorMsg) errorMsg.textContent = 'Inserisci un indirizzo email valido';
          return false;
        }
      }

      if (field.value.trim()) {
        group.classList.add('valid');
      }
      return true;
    }
  }

  /* ========================================
     DYNAMIC COPYRIGHT YEAR
     ======================================== */
  function initDynamicYear() {
    document.querySelectorAll('[data-year]').forEach(el => {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ========================================
     FAQ ACCORDION
     ======================================== */
  function initFAQ() {
    const items = document.querySelectorAll('.faq-item');
    if (!items.length) return;

    items.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      if (!question || !answer) return;

      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        items.forEach(other => {
          other.classList.remove('active');
          const otherAnswer = other.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = '0';
          const otherBtn = other.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        });

        if (!isActive) {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
          question.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ========================================
     FLEET CARDS — Tap to reveal on mobile
     ======================================== */
  function initFleetCards() {
    if (!isMobile) return;

    const cards = document.querySelectorAll('.fleet-card');
    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;
        const wasActive = card.classList.contains('active');
        cards.forEach(c => c.classList.remove('active'));
        if (!wasActive) card.classList.add('active');
      });
    });
  }

  /* ========================================
     BOOKING FORM — Date init + WhatsApp submit
     ======================================== */
  function initBookingForm() {
    const form = document.getElementById('booking-form');
    if (!form) return;

    const ritiro = document.getElementById('booking-ritiro');
    const riconsegna = document.getElementById('booking-riconsegna');

    // Set min dates
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    if (ritiro) ritiro.min = todayStr;
    if (riconsegna) riconsegna.min = todayStr;

    // Also init date inputs on contact page
    const contactRitiro = document.getElementById('date-ritiro');
    const contactRiconsegna = document.getElementById('date-riconsegna');
    if (contactRitiro) contactRitiro.min = todayStr;
    if (contactRiconsegna) contactRiconsegna.min = todayStr;
    if (contactRitiro && contactRiconsegna) {
      contactRitiro.addEventListener('change', () => {
        if (contactRitiro.value) {
          contactRiconsegna.min = contactRitiro.value;
          if (contactRiconsegna.value && contactRiconsegna.value < contactRitiro.value) {
            contactRiconsegna.value = '';
          }
        }
      });
    }

    // Force calendar picker open on click for all date inputs
    document.querySelectorAll('input[type="date"]').forEach(input => {
      input.addEventListener('click', () => {
        try { input.showPicker(); } catch(e) { /* older browsers fallback to native */ }
      });
    });

    // Auto-set riconsegna min when ritiro changes
    if (ritiro && riconsegna) {
      ritiro.addEventListener('change', () => {
        if (ritiro.value) {
          riconsegna.min = ritiro.value;
          if (riconsegna.value && riconsegna.value < ritiro.value) {
            riconsegna.value = '';
          }
        }
      });
    }

    // Submit → WhatsApp
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const veicolo = form.querySelector('input[name="veicolo"]:checked');
      const veicoloText = veicolo ? veicolo.value : 'Non specificato';
      const ritiroVal = ritiro ? ritiro.value : '';
      const riconsegnaVal = riconsegna ? riconsegna.value : '';

      const formatDate = (dateStr) => {
        if (!dateStr) return 'Da definire';
        const d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
      };

      const message = `Ciao! Vorrei prenotare:\n\nVeicolo: ${veicoloText}\nRitiro: ${formatDate(ritiroVal)}\nRiconsegna: ${formatDate(riconsegnaVal)}\n\nGrazie!`;
      const encoded = encodeURIComponent(message);
      window.open(`https://wa.me/393282747108?text=${encoded}`, '_blank');
    });
  }

  /* ========================================
     WHATSAPP PULSE
     ======================================== */
  function initWhatsAppPulse() {
    const btn = document.querySelector('.whatsapp-float');
    if (!btn || prefersReducedMotion) return;
    btn.classList.add('pulse');
    setTimeout(() => btn.classList.remove('pulse'), 6000);
  }
});
