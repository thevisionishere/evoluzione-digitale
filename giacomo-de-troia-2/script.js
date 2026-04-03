/* ============================================================
   GIACOMO DE TROIA — Script.js
   LUXE Framework | All interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const isMobile = !window.matchMedia('(hover: hover)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  initPreloader();
  initHeader();
  initMobileMenu();
  initScrollProgress();
  initRevealAnimations();
  initCounters();
  initAudioPlayer();
  initVideoPlayer();
  initPaintingViewer();
  initGalleryWalk();
  initCriticsSlider();
  initContactForm();
  initSmoothScroll();
  initActiveNav();
  initDynamicYear();

  if (!isMobile) initCustomCursor();
  if (!isMobile) initMagneticButtons();

  /* ==========================================================
     1. PRELOADER — Variant F: Vertical Wipe
     ========================================================== */
  function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;

    const isHome = document.body.classList.contains('page-home');
    const visited = sessionStorage.getItem('luxe-visited');

    if (!isHome || visited) {
      preloader.remove();
      document.body.classList.remove('preloader-active');
      triggerHeroReveal(300);
      return;
    }

    document.body.classList.add('preloader-active');

    if (prefersReducedMotion) {
      sessionStorage.setItem('luxe-visited', 'true');
      preloader.remove();
      document.body.classList.remove('preloader-active');
      triggerHeroReveal(0);
      return;
    }

    const text = preloader.querySelector('.preloader-text');
    const accentLine = preloader.querySelector('.accent-line');
    const bars = preloader.querySelectorAll('.preloader-bar');

    setTimeout(() => {
      text.style.transition = `opacity 600ms ${getComputedStyle(document.documentElement).getPropertyValue('--ease-out')}`;
      text.style.opacity = '1';
    }, 200);

    setTimeout(() => {
      accentLine.style.transition = `width 800ms ${getComputedStyle(document.documentElement).getPropertyValue('--ease-out')}`;
      accentLine.style.width = '100%';
    }, 600);

    setTimeout(() => {
      bars.forEach((bar, i) => {
        bar.style.transition = `transform 500ms ${getComputedStyle(document.documentElement).getPropertyValue('--ease-out')} ${i * 60}ms`;
        bar.style.transform = 'scaleY(0)';
      });
    }, 1600);

    setTimeout(() => {
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
      document.body.classList.remove('preloader-active');
      sessionStorage.setItem('luxe-visited', 'true');
      triggerHeroReveal(100);

      setTimeout(() => preloader.remove(), 500);
    }, 2300);
  }

  function triggerHeroReveal(delay) {
    setTimeout(() => {
      document.dispatchEvent(new CustomEvent('preloaderComplete'));
    }, delay);
  }

  /* ==========================================================
     2. HEADER
     ========================================================== */
  function initHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let lastScrollY = window.scrollY;
    let ticking = false;
    let menuOpen = false;

    window.menuOpenFlag = { get: () => menuOpen, set: (v) => menuOpen = v };

    function updateHeader() {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 50) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }

      if (!menuOpen) {
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
          header.classList.add('header-hidden');
        } else if (currentScrollY < lastScrollY) {
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

  /* ==========================================================
     3. MOBILE MENU
     ========================================================== */
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
      if (window.menuOpenFlag) window.menuOpenFlag.set(true);
      document.querySelector('.site-header').classList.remove('header-hidden');

      links.forEach((link, i) => {
        link.style.transitionDelay = `${150 + i * 60}ms`;
      });

      setTimeout(() => { if (links[0]) links[0].focus(); }, 300);
    }

    function closeMenu() {
      hamburger.classList.remove('active');
      menu.classList.remove('active');
      document.body.style.overflow = '';
      hamburger.setAttribute('aria-expanded', 'false');
      if (window.menuOpenFlag) window.menuOpenFlag.set(false);

      links.forEach(link => { link.style.transitionDelay = '0ms'; });

      if (previousFocus) previousFocus.focus();
    }

    hamburger.addEventListener('click', () => {
      menu.classList.contains('active') ? closeMenu() : openMenu();
    });

    links.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('active')) closeMenu();
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

  /* ==========================================================
     4. SCROLL PROGRESS BAR
     ========================================================== */
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

  /* ==========================================================
     5. REVEAL ON SCROLL
     ========================================================== */
  function initRevealAnimations() {
    const els = document.querySelectorAll('.reveal-up');
    if (!els.length) return;

    if (prefersReducedMotion) {
      els.forEach(el => el.classList.add('revealed'));
      return;
    }

    // Hero reveals via preloaderComplete event
    const heroEls = document.querySelectorAll('.hero .reveal-up, .hero-internal .reveal-up');
    document.addEventListener('preloaderComplete', () => {
      heroEls.forEach((el, i) => {
        setTimeout(() => el.classList.add('revealed'), i * 120);
      });
    });

    // Non-hero reveals via IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    els.forEach(el => {
      const inHero = el.closest('.hero') || el.closest('.hero-internal');
      if (!inHero) observer.observe(el);
    });
  }

  /* ==========================================================
     6. COUNTER ANIMATION
     ========================================================== */
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

  /* ==========================================================
     7. AUDIO PLAYER
     ========================================================== */
  function initAudioPlayer() {
    const player = document.querySelector('.audio-player');
    if (!player) return;

    const audio = document.getElementById('bg-music');
    if (!audio) return;

    const iconPlay = player.querySelector('.icon-play');
    const iconMute = player.querySelector('.icon-mute');
    const tooltip = player.querySelector('.audio-tooltip');

    audio.volume = 0.3;
    audio.loop = true;

    function toggleAudio() {
      if (audio.paused) {
        audio.play().then(() => {
          player.classList.add('playing');
          if (iconPlay) iconPlay.style.display = 'none';
          if (iconMute) iconMute.style.display = 'block';
          if (tooltip) tooltip.textContent = 'Disattiva musica';
        }).catch(() => {});
      } else {
        audio.pause();
        player.classList.remove('playing');
        if (iconPlay) iconPlay.style.display = 'block';
        if (iconMute) iconMute.style.display = 'none';
        if (tooltip) tooltip.textContent = 'Attiva musica ambientale';
      }
    }

    player.addEventListener('click', toggleAudio);
    player.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleAudio(); }
    });
  }

  /* ==========================================================
     8. VIDEO PLAYER
     ========================================================== */
  function initVideoPlayer() {
    const wrapper = document.querySelector('.video-wrapper');
    if (!wrapper) return;

    const video = wrapper.querySelector('video');
    const playBtn = wrapper.querySelector('.video-play-btn');
    if (!video || !playBtn) return;

    playBtn.setAttribute('tabindex', '0');
    playBtn.setAttribute('role', 'button');

    function playVideo() {
      if (video.paused) {
        video.play();
        playBtn.classList.add('hidden');
      }
    }

    playBtn.addEventListener('click', playVideo);
    playBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); playVideo(); }
    });

    video.addEventListener('click', () => {
      if (!video.paused) {
        video.pause();
        playBtn.classList.remove('hidden');
      }
    });

    video.addEventListener('ended', () => {
      playBtn.classList.remove('hidden');
    });
  }

  /* ==========================================================
     9. PAINTING VIEWER (Fullscreen)
     ========================================================== */
  function initPaintingViewer() {
    const viewer = document.querySelector('.painting-viewer');
    if (!viewer) return;

    const cards = document.querySelectorAll('.painting-card');
    const viewerImg = viewer.querySelector('.painting-viewer-content img');
    const viewerTitle = viewer.querySelector('.painting-viewer-info h3');
    const viewerMeta = viewer.querySelector('.painting-viewer-info p');
    const viewerCounter = viewer.querySelector('.viewer-counter');
    const closeBtn = viewer.querySelector('.viewer-close');
    const prevBtn = viewer.querySelector('.viewer-prev');
    const nextBtn = viewer.querySelector('.viewer-next');

    if (!cards.length) return;

    const paintings = Array.from(cards).map(card => ({
      src: card.querySelector('img').src,
      title: card.querySelector('.painting-info h3')?.textContent || '',
      meta: card.querySelector('.painting-meta')?.textContent || ''
    }));

    let currentIndex = 0;

    let previousFocusViewer = null;

    function showPainting(index) {
      currentIndex = index;
      viewerImg.src = paintings[index].src;
      viewerImg.alt = paintings[index].title;
      viewerTitle.textContent = paintings[index].title;
      viewerMeta.textContent = paintings[index].meta;
      viewerCounter.textContent = `${index + 1} / ${paintings.length}`;
    }

    function openViewer(index) {
      previousFocusViewer = document.activeElement;
      showPainting(index);
      viewer.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    }

    function closeViewer() {
      viewer.classList.remove('active');
      document.body.style.overflow = '';
      if (previousFocusViewer) previousFocusViewer.focus();
    }

    cards.forEach((card, i) => {
      card.addEventListener('click', () => openViewer(i));
    });

    if (closeBtn) closeBtn.addEventListener('click', closeViewer);
    if (prevBtn) prevBtn.addEventListener('click', () => {
      showPainting((currentIndex - 1 + paintings.length) % paintings.length);
    });
    if (nextBtn) nextBtn.addEventListener('click', () => {
      showPainting((currentIndex + 1) % paintings.length);
    });

    viewer.addEventListener('click', (e) => {
      if (e.target === viewer) closeViewer();
    });

    document.addEventListener('keydown', (e) => {
      if (!viewer.classList.contains('active')) return;
      if (e.key === 'Escape') closeViewer();
      if (e.key === 'ArrowLeft') showPainting((currentIndex - 1 + paintings.length) % paintings.length);
      if (e.key === 'ArrowRight') showPainting((currentIndex + 1) % paintings.length);
    });
  }

  /* ==========================================================
     10. GALLERY WALK (Horizontal Scroll)
     ========================================================== */
  function initGalleryWalk() {
    const wrapper = document.querySelector('.gallery-walk-wrapper');
    const track = document.querySelector('.gallery-walk-track');
    if (!wrapper || !track || isMobile) return;

    if (prefersReducedMotion) return;

    const items = track.querySelectorAll('.gallery-walk-item');
    if (!items.length) return;

    function setupGalleryWalk() {
      const totalScrollWidth = track.scrollWidth - window.innerWidth;
      if (totalScrollWidth <= 0) return;

      wrapper.style.height = `${totalScrollWidth + window.innerHeight}px`;

      let ticking = false;
      window.addEventListener('scroll', () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            const wrapperTop = wrapper.getBoundingClientRect().top + window.scrollY;
            const scrollInWrapper = window.scrollY - wrapperTop;
            const progress = Math.max(0, Math.min(1, scrollInWrapper / totalScrollWidth));
            track.style.transform = `translateX(${-progress * totalScrollWidth}px)`;
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });
    }

    // Wait for images to load before measuring widths
    window.addEventListener('load', setupGalleryWalk);
  }

  /* ==========================================================
     11. CRITICS SLIDER
     ========================================================== */
  function initCriticsSlider() {
    const quotes = document.querySelectorAll('.critic-quote');
    const dots = document.querySelectorAll('.critic-dot');
    if (quotes.length < 2) return;

    let currentQuote = 0;
    let interval;

    function showQuote(index) {
      quotes.forEach((q, i) => {
        q.style.opacity = i === index ? '1' : '0';
        q.style.visibility = i === index ? 'visible' : 'hidden';
        q.style.position = i === index ? 'relative' : 'absolute';
      });
      dots.forEach((d, i) => {
        d.classList.toggle('active', i === index);
      });
      currentQuote = index;
    }

    function nextQuote() {
      showQuote((currentQuote + 1) % quotes.length);
    }

    showQuote(0);
    interval = setInterval(nextQuote, 6000);

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        clearInterval(interval);
        showQuote(i);
        interval = setInterval(nextQuote, 6000);
      });
    });
  }

  /* ==========================================================
     12. CONTACT FORM
     ========================================================== */
  function initContactForm() {
    const form = document.querySelector('.contact-form form');
    if (!form) return;

    const groups = form.querySelectorAll('.form-group');

    groups.forEach(group => {
      const input = group.querySelector('input, textarea, select');
      if (!input) return;

      input.addEventListener('blur', () => validateField(group, input));
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
        form.style.display = 'none';
        const success = form.parentElement.querySelector('.form-success');
        if (success) success.style.display = 'block';
      } else {
        const firstError = form.querySelector('.form-group.error input, .form-group.error textarea');
        if (firstError) firstError.focus();
      }
    });

    function validateField(group, input) {
      group.classList.remove('error', 'valid');
      const errorEl = group.querySelector('.form-error');

      if (input.hasAttribute('required') && !input.value.trim()) {
        group.classList.add('error');
        if (errorEl) errorEl.textContent = 'Questo campo è obbligatorio';
        return false;
      }

      if (input.type === 'email' && input.value) {
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRe.test(input.value)) {
          group.classList.add('error');
          if (errorEl) errorEl.textContent = 'Inserisci un indirizzo email valido';
          return false;
        }
      }

      if (input.value.trim()) group.classList.add('valid');
      return true;
    }
  }

  /* ==========================================================
     13. SMOOTH SCROLL
     ========================================================== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
          const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
          window.scrollTo({ top, behavior: prefersReducedMotion ? 'instant' : 'smooth' });
        }
      });
    });
  }

  /* ==========================================================
     14. ACTIVE NAV LINK
     ========================================================== */
  function initActiveNav() {
    const navLinks = document.querySelectorAll('.header-nav a, .mobile-menu a:not(.mobile-menu-contact a)');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  /* ==========================================================
     15. DYNAMIC YEAR
     ========================================================== */
  function initDynamicYear() {
    document.querySelectorAll('[data-year]').forEach(el => {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ==========================================================
     16. CUSTOM CURSOR (Desktop Only)
     ========================================================== */
  function initCustomCursor() {
    if (prefersReducedMotion) return;

    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const follower = document.createElement('div');
    follower.className = 'cursor-follower';

    dot.style.left = '-100px';
    dot.style.top = '-100px';
    follower.style.left = '-100px';
    follower.style.top = '-100px';

    document.body.appendChild(dot);
    document.body.appendChild(follower);

    let mouseX = -100, mouseY = -100;
    let followerX = -100, followerY = -100;
    let cursorActivated = false;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;

      if (!cursorActivated) {
        cursorActivated = true;
        dot.style.left = '0';
        dot.style.top = '0';
        follower.style.left = '0';
        follower.style.top = '0';
        followerX = mouseX;
        followerY = mouseY;
        document.body.classList.add('custom-cursor');
      }
    });

    function updateFollower() {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      follower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;
      requestAnimationFrame(updateFollower);
    }
    requestAnimationFrame(updateFollower);

    const selectors = 'a, button, [role="button"], input, textarea, select, label, .painting-card';
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

  /* ==========================================================
     17. MAGNETIC BUTTONS (Desktop Only)
     ========================================================== */
  function initMagneticButtons() {
    if (prefersReducedMotion) return;

    document.querySelectorAll('.magnetic-btn').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }
});
