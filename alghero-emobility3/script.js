/* ============================================
   ALGHERO E-MOBILITY — script.js
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
  initVehicleCards();
  initHorizontalScroll();
  initBookingSystem();
  initDatePickers();
  initUSPCascade();
});

/* --- Preloader (Variant E — Minimal Fade) --- */
function initPreloader() {
  const preloader = document.querySelector('.preloader');
  if (!preloader) return;

  const isHome = window.location.pathname === '/' ||
                 window.location.pathname.endsWith('index.html') ||
                 window.location.pathname.endsWith('/');
  const hasVisited = sessionStorage.getItem('emobility-visited');

  if (!isHome || hasVisited) {
    preloader.remove();
    document.body.classList.remove('preloader-active');
    revealHero();
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    preloader.remove();
    document.body.classList.remove('preloader-active');
    sessionStorage.setItem('emobility-visited', 'true');
    revealHero();
    return;
  }

  setTimeout(() => {
    preloader.classList.add('fade-out');
    setTimeout(() => {
      preloader.remove();
      document.body.classList.remove('preloader-active');
      sessionStorage.setItem('emobility-visited', 'true');
      document.dispatchEvent(new CustomEvent('preloaderComplete'));
      revealHero();
    }, 600);
  }, 1200);
}

function revealHero() {
  const hero = document.querySelector('.hero');
  if (hero) {
    setTimeout(() => hero.classList.add('revealed'), 100);
  }
}

/* --- Header --- */
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  let lastScrollY = window.scrollY;
  let ticking = false;
  const mobileMenu = document.querySelector('.mobile-menu');

  function updateHeader() {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 50) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }

    const menuOpen = mobileMenu && mobileMenu.classList.contains('active');
    if (!menuOpen) {
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        header.classList.add('header-hidden');
      } else {
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
}

/* --- Mobile Menu --- */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const menu = document.querySelector('.mobile-menu');
  if (!hamburger || !menu) return;

  const links = menu.querySelectorAll('a');
  let previousFocus = null;

  function openMenu() {
    previousFocus = document.activeElement;
    hamburger.classList.add('active');
    menu.classList.add('active');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
    if (links.length) links[0].focus();
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    menu.classList.remove('active');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
    if (previousFocus) previousFocus.focus();
  }

  hamburger.addEventListener('click', () => {
    menu.classList.contains('active') ? closeMenu() : openMenu();
  });

  links.forEach(link => link.addEventListener('click', closeMenu));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('active')) {
      closeMenu();
    }

    if (e.key === 'Tab' && menu.classList.contains('active')) {
      const focusable = [hamburger, ...links];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

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
  });
}

/* --- Scroll Progress Bar --- */
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

/* --- Reveal Animations --- */
function initRevealAnimations() {
  const reveals = document.querySelectorAll('.reveal-up');
  if (!reveals.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    reveals.forEach(el => el.classList.add('revealed'));
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

  reveals.forEach(el => observer.observe(el));
}

/* --- Counter Animation --- */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animateCounter(element) {
    const target = parseInt(element.dataset.count);
    const suffix = element.dataset.suffix || '';
    const prefix = element.dataset.prefix || '';

    if (prefersReducedMotion) {
      element.textContent = prefix + target + suffix;
      return;
    }

    const duration = 2000;
    const start = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = prefix + Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(update);
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
  }, { threshold: 0.3 });

  counters.forEach(el => observer.observe(el));
}

/* --- Custom Cursor --- */
function initCustomCursor() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
      dot.classList.remove('hidden');
      follower.classList.remove('hidden');
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

  const selectors = 'a, button, [role="button"], input, textarea, select, label, .vehicle-card, .vehicle-option, .toggle-switch';
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

/* --- Parallax --- */
function initParallax() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const rect = heroBg.parentElement.getBoundingClientRect();
        if (rect.bottom > 0) {
          heroBg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* --- Magnetic Buttons --- */
function initMagneticButtons() {
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

/* --- Smooth Scroll --- */
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

/* --- Active Nav Link --- */
function initActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.header-nav a, .mobile-menu-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html') ||
        (currentPage === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* --- Form Validation --- */
function initForms() {
  const forms = document.querySelectorAll('form[data-validate]');

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
      let hasErrors = false;

      fields.forEach(field => {
        if (!validateField(field)) hasErrors = true;
      });

      if (!hasErrors) {
        const formEl = form;
        const successEl = form.parentElement.querySelector('.form-success');
        if (successEl) {
          formEl.style.display = 'none';
          successEl.style.display = 'block';
        }
      }
    });
  });
}

function validateField(field) {
  const value = field.value.trim();
  const type = field.type;
  let valid = true;
  let message = '';

  if (!value) {
    valid = false;
    message = 'Questo campo è obbligatorio';
  } else if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    valid = false;
    message = 'Inserisci un indirizzo email valido';
  } else if (type === 'tel' && !/^[\d\s+()-]{6,}$/.test(value)) {
    valid = false;
    message = 'Inserisci un numero di telefono valido';
  }

  const errorEl = field.parentElement.querySelector('.error-message');

  if (!valid) {
    field.classList.add('error');
    field.classList.remove('valid');
    if (errorEl) errorEl.textContent = message;
  } else {
    field.classList.remove('error');
    field.classList.add('valid');
    if (errorEl) errorEl.textContent = '';
  }

  return valid;
}

/* --- Dynamic Year --- */
function initDynamicYear() {
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
}

/* --- FAQ Accordion --- */
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    function toggleFAQ() {
      const isActive = item.classList.contains('active');

      items.forEach(other => {
        other.classList.remove('active');
        other.querySelector('.faq-answer').style.maxHeight = '0';
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        question.setAttribute('aria-expanded', 'true');
      }
    }

    question.addEventListener('click', toggleFAQ);
    question.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleFAQ(); }
    });
  });
}

/* --- Vehicle Cards (Mobile tap) --- */
function initVehicleCards() {
  if (!window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.vehicle-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.vehicle-card').forEach(c => {
          if (c !== card) c.classList.remove('expanded');
        });
        card.classList.toggle('expanded');
      });
    });
  }
}

/* --- Horizontal Scroll (Desktop) --- */
function initHorizontalScroll() {
  const wrapper = document.querySelector('.horizontal-scroll-wrapper');
  const track = document.querySelector('.horizontal-scroll-track');
  if (!wrapper || !track) return;

  if (window.matchMedia('(hover: hover)').matches && window.innerWidth >= 768) {
    const section = wrapper.closest('section');
    if (!section) return;

    const cards = track.querySelectorAll('.explore-card');
    const totalScrollWidth = track.scrollWidth - wrapper.clientWidth;

    if (totalScrollWidth <= 0) return; // All cards fit — no animation needed

    function updateScroll() {
      const rect = section.getBoundingClientRect();
      const sectionTop = -rect.top;
      const sectionHeight = section.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, sectionTop / sectionHeight));
      track.style.transform = `translateX(-${progress * totalScrollWidth}px)`;
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

    section.style.height = `${window.innerHeight + totalScrollWidth}px`;
    wrapper.style.position = 'sticky';
    wrapper.style.top = '0';
    wrapper.style.height = '100vh';
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
  }
}

/* --- Booking System --- */
function initBookingSystem() {
  const system = document.querySelector('.booking-system');
  if (!system) return;

  const steps = system.querySelectorAll('.booking-step');
  const progressSteps = system.querySelectorAll('.booking-progress-step');
  let currentStep = 0;

  const state = {
    vehicle: '',
    vehicleLabel: '',
    dateIn: '',
    dateOut: '',
    insurance: false,
    gps: false,
    name: '',
    email: '',
    phone: ''
  };

  function showStep(index) {
    steps.forEach((s, i) => {
      s.classList.toggle('active', i === index);
    });
    progressSteps.forEach((s, i) => {
      s.classList.remove('active', 'completed');
      if (i < index) s.classList.add('completed');
      if (i === index) s.classList.add('active');
    });
    currentStep = index;
  }

  // Step 1: Vehicle selection
  const vehicleOptions = system.querySelectorAll('.vehicle-option');
  vehicleOptions.forEach(opt => {
    function selectVehicle() {
      vehicleOptions.forEach(o => {
        o.classList.remove('selected');
        o.setAttribute('aria-checked', 'false');
      });
      opt.classList.add('selected');
      opt.setAttribute('aria-checked', 'true');
      state.vehicle = opt.dataset.vehicle;
      state.vehicleLabel = opt.querySelector('h4').textContent;
    }
    opt.addEventListener('click', selectVehicle);
    opt.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectVehicle(); }
    });
  });

  // Step 3: Extras toggles
  const toggles = system.querySelectorAll('.toggle-switch');
  toggles.forEach(toggle => {
    function toggleSwitch() {
      toggle.classList.toggle('active');
      const isActive = toggle.classList.contains('active');
      toggle.setAttribute('aria-checked', String(isActive));
      const field = toggle.dataset.field;
      if (field) state[field] = isActive;
    }
    toggle.addEventListener('click', toggleSwitch);
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSwitch(); }
    });
  });

  // GPS visibility
  const gpsOption = system.querySelector('.extra-gps');
  function updateGpsVisibility() {
    if (gpsOption) {
      gpsOption.style.display = state.vehicle === 'auto' ? 'flex' : 'none';
    }
  }

  // Navigation
  system.querySelectorAll('.btn-next').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep === 0 && !state.vehicle) {
        alert('Seleziona un tipo di veicolo');
        return;
      }
      if (currentStep === 1) {
        const dateIn = system.querySelector('#date-in');
        const dateOut = system.querySelector('#date-out');
        if (dateIn) state.dateIn = dateIn.value;
        if (dateOut) state.dateOut = dateOut.value;
        if (!state.dateIn || !state.dateOut) {
          alert('Seleziona le date di ritiro e riconsegna');
          return;
        }
      }
      if (currentStep === 2) {
        updateGpsVisibility();
      }
      if (currentStep === 3) {
        const nameInput = system.querySelector('#booking-name');
        const emailInput = system.querySelector('#booking-email');
        const phoneInput = system.querySelector('#booking-phone');
        if (nameInput) state.name = nameInput.value;
        if (emailInput) state.email = emailInput.value;
        if (phoneInput) state.phone = phoneInput.value;
        if (!state.name || !state.email || !state.phone) {
          alert('Compila tutti i campi');
          return;
        }
        updateSummary();
      }
      if (currentStep === 2) updateGpsVisibility();
      showStep(currentStep + 1);
    });
  });

  system.querySelectorAll('.btn-prev').forEach(btn => {
    btn.addEventListener('click', () => {
      showStep(currentStep - 1);
    });
  });

  // Set min date
  const dateInputs = system.querySelectorAll('input[type="date"]');
  const today = new Date().toISOString().split('T')[0];
  dateInputs.forEach(input => input.setAttribute('min', today));

  function updateSummary() {
    const summaryList = system.querySelector('.summary-list');
    if (!summaryList) return;

    let html = `
      <div class="summary-item"><strong>Veicolo</strong><span>${state.vehicleLabel}</span></div>
      <div class="summary-item"><strong>Ritiro</strong><span>${formatDate(state.dateIn)}</span></div>
      <div class="summary-item"><strong>Riconsegna</strong><span>${formatDate(state.dateOut)}</span></div>
    `;
    if (state.insurance) {
      html += '<div class="summary-item"><strong>Assicurazione extra</strong><span>€15/giorno</span></div>';
    }
    if (state.gps && state.vehicle === 'auto') {
      html += '<div class="summary-item"><strong>Navigatore GPS</strong><span>€10/giorno</span></div>';
    }
    html += `
      <div class="summary-item"><strong>Nome</strong><span>${state.name}</span></div>
      <div class="summary-item"><strong>Email</strong><span>${state.email}</span></div>
      <div class="summary-item"><strong>Telefono</strong><span>${state.phone}</span></div>
    `;
    summaryList.innerHTML = html;

    // Update WhatsApp link
    const waBtn = system.querySelector('.btn-whatsapp');
    if (waBtn) {
      const msg = encodeURIComponent(
        `Ciao! Vorrei prenotare:\n` +
        `Veicolo: ${state.vehicleLabel}\n` +
        `Ritiro: ${formatDate(state.dateIn)}\n` +
        `Riconsegna: ${formatDate(state.dateOut)}\n` +
        `${state.insurance ? 'Assicurazione extra: Sì\n' : ''}` +
        `${state.gps && state.vehicle === 'auto' ? 'GPS: Sì\n' : ''}` +
        `Nome: ${state.name}\n` +
        `Email: ${state.email}\n` +
        `Telefono: ${state.phone}`
      );
      waBtn.href = `https://wa.me/393282747108?text=${msg}`;
    }

    // Update Email link
    const emailBtn = system.querySelector('.btn-email-booking');
    if (emailBtn) {
      const subject = encodeURIComponent(`Prenotazione ${state.vehicleLabel} - ${state.name}`);
      const body = encodeURIComponent(
        `Buongiorno,\n\nVorrei prenotare:\n\n` +
        `Veicolo: ${state.vehicleLabel}\n` +
        `Ritiro: ${formatDate(state.dateIn)}\n` +
        `Riconsegna: ${formatDate(state.dateOut)}\n` +
        `${state.insurance ? 'Assicurazione extra: Sì\n' : ''}` +
        `${state.gps && state.vehicle === 'auto' ? 'GPS: Sì\n' : ''}` +
        `\nNome: ${state.name}\n` +
        `Email: ${state.email}\n` +
        `Telefono: ${state.phone}\n\n` +
        `Grazie!`
      );
      emailBtn.href = `mailto:info@algheroemobility.com?subject=${subject}&body=${body}`;
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  // Init: show first step
  showStep(0);
}

/* --- Date Pickers: open on click --- */
function initDatePickers() {
  document.querySelectorAll('input[type="date"]').forEach(function (input) {
    input.style.cursor = 'pointer';
    input.addEventListener('click', function () {
      try { this.showPicker(); } catch (e) { /* unsupported browser */ }
    });
  });
}

/* --- USP Cascade (Signature Moment 3) --- */
function initUSPCascade() {
  const panels = document.querySelectorAll('.usp-panel');
  if (!panels.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    panels.forEach(p => p.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  panels.forEach(p => observer.observe(p));
}
