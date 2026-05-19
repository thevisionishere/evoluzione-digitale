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
  initArtBook();
  initGalleryWalk();
  initCriticsSlider();
  initContactForm();
  initSmoothScroll();
  initActiveNav();
  initDynamicYear();
  initHeroSlideshow();
  initGalleriaFilters();
  initGalleriaDetail();
  initReadingsSlideshow();
  initNavDropdown();
  initMostreTabs();

  // Custom cursor disabled — use native browser cursor
  // if (!isMobile) initCustomCursor();
  if (!isMobile) initMagneticButtons();

  /* ==========================================================
     1. PRELOADER — Variant F: Vertical Wipe
     ========================================================== */
  function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) {
      // No preloader on this page — trigger hero reveal immediately so the
      // hero text fades in instead of staying at opacity 0 forever.
      triggerHeroReveal(100);
      return;
    }

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

    audio.volume = 0.15;
    audio.loop = true;

    // Persist playback state across page navigations
    const wasPlaying = sessionStorage.getItem('gdt-audio-playing') === '1';
    const savedTime = parseFloat(sessionStorage.getItem('gdt-audio-time') || '0');

    function setPlaying() {
      player.classList.add('playing');
      if (iconPlay) iconPlay.style.display = 'none';
      if (iconMute) iconMute.style.display = 'block';
      if (tooltip) tooltip.textContent = 'Disattiva musica';
      sessionStorage.setItem('gdt-audio-playing', '1');
    }

    function setPaused() {
      player.classList.remove('playing');
      if (iconPlay) iconPlay.style.display = 'block';
      if (iconMute) iconMute.style.display = 'none';
      if (tooltip) tooltip.textContent = 'Attiva musica ambientale';
      sessionStorage.setItem('gdt-audio-playing', '0');
    }

    // Save playback position periodically
    audio.addEventListener('timeupdate', () => {
      sessionStorage.setItem('gdt-audio-time', String(audio.currentTime));
    });

    // Save state before leaving the page
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('gdt-audio-time', String(audio.currentTime));
      sessionStorage.setItem('gdt-audio-playing', audio.paused ? '0' : '1');
    });

    function toggleAudio() {
      if (audio.paused) {
        audio.play().then(setPlaying).catch(() => {});
      } else {
        audio.pause();
        setPaused();
      }
    }

    function removeAutoplayListeners() {
      document.removeEventListener('click', startOnInteraction);
      document.removeEventListener('touchstart', startOnInteraction);
      document.removeEventListener('keydown', startOnInteraction);
      document.removeEventListener('scroll', startOnInteraction);
    }

    function startOnInteraction(e) {
      if (player.contains(e.target)) return;
      if (savedTime) audio.currentTime = savedTime;
      audio.play().then(() => {
        setPlaying();
        removeAutoplayListeners();
      }).catch(() => {});
    }

    // Resume if was playing on previous page, or autoplay on first visit
    if (wasPlaying) {
      audio.currentTime = savedTime;
      audio.play().then(() => {
        setPlaying();
      }).catch(() => {
        // Browser blocked — wait for interaction to resume
        document.addEventListener('click', startOnInteraction);
        document.addEventListener('touchstart', startOnInteraction);
        document.addEventListener('keydown', startOnInteraction);
      });
    } else if (!sessionStorage.getItem('gdt-audio-playing')) {
      // First visit ever — try autoplay
      audio.play().then(setPlaying).catch(() => {
        document.addEventListener('click', startOnInteraction);
        document.addEventListener('touchstart', startOnInteraction);
        document.addEventListener('keydown', startOnInteraction);
        document.addEventListener('scroll', startOnInteraction, { once: true });
      });
    }
    // If gdt-audio-playing === '0', user manually paused — don't autoplay

    player.addEventListener('click', (e) => {
      e.stopPropagation();
      removeAutoplayListeners();
      toggleAudio();
    });
    player.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        removeAutoplayListeners();
        toggleAudio();
      }
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
      document.body.classList.add('viewer-open');
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    }

    function closeViewer() {
      viewer.classList.remove('active');
      document.body.classList.remove('viewer-open');
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
     9b. ART BOOK (Page flip catalog)
     ========================================================== */
  function initArtBook() {
    const book = document.getElementById('art-book');
    if (!book) return;

    const leaves = Array.from(book.querySelectorAll('.book-leaf'));
    const totalLeaves = leaves.length;
    const prevBtn = document.querySelector('.book-prev-btn');
    const nextBtn = document.querySelector('.book-next-btn');
    const counter = document.querySelector('.book-page-counter');

    // Fullscreen viewer elements
    const viewer = document.querySelector('.painting-viewer');
    const viewerImg = viewer ? viewer.querySelector('.painting-viewer-content img') : null;
    const viewerTitle = viewer ? viewer.querySelector('.painting-viewer-info h3') : null;
    const viewerMeta = viewer ? viewer.querySelector('.painting-viewer-info p') : null;
    const viewerCounter = viewer ? viewer.querySelector('.viewer-counter') : null;
    const closeBtn = viewer ? viewer.querySelector('.viewer-close') : null;
    const viewerPrev = viewer ? viewer.querySelector('.viewer-prev') : null;
    const viewerNext = viewer ? viewer.querySelector('.viewer-next') : null;

    // Extract painting data from leaves for fullscreen viewer
    const paintings = [];
    leaves.forEach(leaf => {
      if (leaf.dataset.painting !== undefined) {
        const img = leaf.querySelector('.leaf-painting img');
        if (img) {
          paintings.push({
            src: img.src,
            title: leaf.dataset.title || '',
            meta: leaf.dataset.meta || ''
          });
        }
      }
    });

    let currentPage = 0;
    let isAnimating = false;
    let viewerIndex = 0;
    const animDuration = prefersReducedMotion ? 50 : 1050;

    // Reduced motion: skip animations
    if (prefersReducedMotion) {
      leaves.forEach(l => l.classList.add('no-transition'));
    }

    // Initial z-indexes
    updateZIndexes();

    function updateZIndexes() {
      leaves.forEach((leaf, i) => {
        if (leaf.classList.contains('flipped')) {
          leaf.style.zIndex = i + 1;
        } else {
          leaf.style.zIndex = totalLeaves - i;
        }
      });
    }

    function flipForward() {
      if (currentPage >= totalLeaves || isAnimating) return;
      isAnimating = true;

      const leaf = leaves[currentPage];
      leaf.style.zIndex = totalLeaves + 10;
      leaf.classList.add('flipped');
      currentPage++;
      updateUI();

      setTimeout(() => {
        updateZIndexes();
        isAnimating = false;
      }, animDuration);
    }

    function flipBackward() {
      if (currentPage <= 0 || isAnimating) return;
      isAnimating = true;

      currentPage--;
      const leaf = leaves[currentPage];
      leaf.style.zIndex = totalLeaves + 10;
      leaf.classList.remove('flipped');
      updateUI();

      setTimeout(() => {
        updateZIndexes();
        isAnimating = false;
      }, animDuration);
    }

    function updateUI() {
      if (counter) {
        if (currentPage === 0) {
          counter.textContent = 'Copertina';
        } else if (currentPage >= totalLeaves) {
          counter.textContent = 'Fine';
        } else {
          counter.textContent = '';
        }
      }
      if (prevBtn) prevBtn.disabled = currentPage <= 0;
      if (nextBtn) nextBtn.disabled = currentPage >= totalLeaves;
    }

    // Navigation buttons
    if (prevBtn) prevBtn.addEventListener('click', flipBackward);
    if (nextBtn) nextBtn.addEventListener('click', flipForward);

    // Click on leaves to flip
    leaves.forEach(leaf => {
      leaf.addEventListener('click', (e) => {
        // If clicking a painting image, open viewer instead
        if (e.target.closest('.leaf-painting img')) return;

        const idx = parseInt(leaf.dataset.leaf);
        if (leaf.classList.contains('flipped')) {
          if (idx === currentPage - 1) flipBackward();
        } else {
          if (idx === currentPage) flipForward();
        }
      });
    });

    // Click painting image → open fullscreen viewer
    leaves.forEach(leaf => {
      const img = leaf.querySelector('.leaf-painting img');
      if (img && viewer) {
        img.addEventListener('click', (e) => {
          e.stopPropagation();
          const pIdx = parseInt(leaf.dataset.painting);
          if (!isNaN(pIdx)) openViewer(pIdx);
        });
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (viewer && viewer.classList.contains('active')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); flipForward(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); flipBackward(); }
    });

    // Touch swipe
    let touchStartX = 0;
    let touchStartY = 0;
    book.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    book.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        if (dx < 0) flipForward();
        else flipBackward();
      }
    }, { passive: true });

    // --- Fullscreen viewer ---
    function openViewer(index) {
      if (!viewer || !paintings[index]) return;
      viewerIndex = index;
      showViewerPainting(index);
      viewer.classList.add('active');
      document.body.classList.add('viewer-open');
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    }

    function closeViewerFn() {
      if (!viewer) return;
      viewer.classList.remove('active');
      document.body.classList.remove('viewer-open');
      document.body.style.overflow = '';
    }

    function showViewerPainting(index) {
      viewerIndex = index;
      if (viewerImg) { viewerImg.src = paintings[index].src; viewerImg.alt = paintings[index].title; }
      if (viewerTitle) viewerTitle.textContent = paintings[index].title;
      if (viewerMeta) viewerMeta.textContent = paintings[index].meta;
      if (viewerCounter) viewerCounter.textContent = (index + 1) + ' / ' + paintings.length;
    }

    if (closeBtn) closeBtn.addEventListener('click', closeViewerFn);
    if (viewerPrev) viewerPrev.addEventListener('click', () => {
      showViewerPainting((viewerIndex - 1 + paintings.length) % paintings.length);
    });
    if (viewerNext) viewerNext.addEventListener('click', () => {
      showViewerPainting((viewerIndex + 1) % paintings.length);
    });
    if (viewer) viewer.addEventListener('click', (e) => {
      if (e.target === viewer) closeViewerFn();
    });

    document.addEventListener('keydown', (e) => {
      if (!viewer || !viewer.classList.contains('active')) return;
      if (e.key === 'Escape') closeViewerFn();
      if (e.key === 'ArrowLeft') showViewerPainting((viewerIndex - 1 + paintings.length) % paintings.length);
      if (e.key === 'ArrowRight') showViewerPainting((viewerIndex + 1) % paintings.length);
    });

    updateUI();
  }

  /* ==========================================================
     10. GALLERY WALK (Horizontal Scroll)
     ========================================================== */
  function initGalleryWalk() {
    document.querySelectorAll('.gallery-walk-wrapper').forEach(initCarousel);
  }

  function initCarousel(wrapper) {
    const sticky = wrapper.querySelector('.gallery-walk-sticky');
    const track = wrapper.querySelector('.gallery-walk-track');
    if (!sticky || !track) return;

    const items = Array.from(track.querySelectorAll('.gallery-walk-item'));
    if (items.length < 2) return;

    const prevBtn = wrapper.querySelector('.gallery-walk-prev');
    const nextBtn = wrapper.querySelector('.gallery-walk-next');
    const dotsContainer = wrapper.querySelector('.gallery-walk-dots');

    let currentIndex = 0;
    let interval;
    let userScrolling = false;
    let userScrollTimer;

    // Build dots
    if (dotsContainer) {
      items.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'gallery-walk-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Vai all'opera ${i + 1}`);
        dot.addEventListener('click', () => { goToItem(i); resetAutoScroll(); });
        dotsContainer.appendChild(dot);
      });
    }

    function updateDots() {
      if (!dotsContainer) return;
      dotsContainer.querySelectorAll('.gallery-walk-dot').forEach((d, i) => {
        d.classList.toggle('active', i === currentIndex);
      });
    }

    function scrollToItem(index) {
      const item = items[index];
      if (!item) return;
      const itemLeft = item.offsetLeft;
      const itemWidth = item.offsetWidth;
      const containerWidth = sticky.clientWidth;
      const target = itemLeft - (containerWidth / 2) + (itemWidth / 2);
      sticky.scrollTo({ left: target, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }

    function goToItem(index) {
      currentIndex = (index + items.length) % items.length;
      scrollToItem(currentIndex);
      updateDots();
    }

    function nextItem() {
      if (userScrolling) return;
      goToItem(currentIndex + 1);
    }
    function prevItem() {
      goToItem(currentIndex - 1);
    }

    function startAutoScroll() {
      if (prefersReducedMotion) return;
      stopAutoScroll();
      interval = setInterval(nextItem, 5000);
    }
    function stopAutoScroll() {
      if (interval) clearInterval(interval);
    }
    function resetAutoScroll() {
      stopAutoScroll();
      startAutoScroll();
    }

    // Arrow controls
    if (prevBtn) prevBtn.addEventListener('click', () => { prevItem(); resetAutoScroll(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { nextItem(); resetAutoScroll(); });

    // Update current index based on scroll position (manual scroll, swipe)
    sticky.addEventListener('scroll', () => {
      userScrolling = true;
      clearTimeout(userScrollTimer);
      userScrollTimer = setTimeout(() => { userScrolling = false; }, 1200);
      // Find which item is currently centered
      const center = sticky.scrollLeft + sticky.clientWidth / 2;
      let closest = 0, minDist = Infinity;
      items.forEach((item, i) => {
        const itemCenter = item.offsetLeft + item.offsetWidth / 2;
        const dist = Math.abs(itemCenter - center);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      if (closest !== currentIndex) {
        currentIndex = closest;
        updateDots();
      }
    }, { passive: true });

    // Pause on hover (desktop)
    sticky.addEventListener('mouseenter', stopAutoScroll);
    sticky.addEventListener('mouseleave', startAutoScroll);

    // Start when section enters viewport, pause when leaves
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) startAutoScroll();
        else stopAutoScroll();
      });
    }, { threshold: 0.2 });
    observer.observe(sticky);
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

    // On initial page load with a hash (e.g. /mostre.html#premi), adjust scroll to account for sticky header.
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        // Wait a moment for layout (images, reveal-up etc.) before scrolling
        setTimeout(() => {
          const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
          const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
          window.scrollTo({ top, behavior: prefersReducedMotion ? 'instant' : 'smooth' });
        }, 300);
      }
    }
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
    document.querySelectorAll('span[data-year=""], span[data-year]:empty').forEach(el => {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ==========================================================
     GALLERIA FILTERS (opere.html)
     ========================================================== */
  function initGalleriaFilters() {
    const section = document.querySelector('.galleria-section');
    if (!section) return;
    const items = Array.from(section.querySelectorAll('.galleria-item'));
    const count = section.querySelector('.galleria-count');
    const noResults = section.querySelector('.galleria-no-results');
    const grid = section.querySelector('.galleria-grid');
    if (!items.length) return;

    const state = { year: 'all', size: 'all', price: 'all' };

    function matchPrice(price, filterVal) {
      if (filterVal === 'all') return true;
      const [lo, hi] = filterVal.split('-').map(Number);
      return price >= lo && price < hi;
    }

    function applyFilters() {
      let visible = 0;
      items.forEach(item => {
        const y = item.dataset.year;
        const s = item.dataset.size;
        const p = parseInt(item.dataset.price);
        const match =
          (state.year === 'all' || state.year === y) &&
          (state.size === 'all' || state.size === s) &&
          matchPrice(p, state.price);
        item.classList.toggle('hidden', !match);
        if (match) visible++;
      });
      if (count) count.textContent = visible + (visible === 1 ? ' opera' : ' opere');
      if (noResults) noResults.hidden = visible > 0;
      if (grid) grid.style.display = visible > 0 ? '' : 'none';
    }

    section.querySelectorAll('.filter-select').forEach(sel => {
      sel.addEventListener('change', () => {
        state[sel.dataset.filter] = sel.value;
        applyFilters();
      });
    });
  }

  /* ==========================================================
     GALLERIA DETAIL MODAL (opere.html)
     ========================================================== */
  function initGalleriaDetail() {
    const modal = document.getElementById('galleria-detail');
    if (!modal) return;
    const section = document.querySelector('.galleria-section');
    if (!section) return;

    const imgWrap     = modal.querySelector('.galleria-detail-image');
    const img         = modal.querySelector('.galleria-detail-img');
    const lens        = modal.querySelector('.galleria-detail-zoom-lens');
    const zoomToggle  = modal.querySelector('.galleria-detail-zoom-toggle');
    const titleEl     = modal.querySelector('.detail-title-text');
    const yearEl      = modal.querySelector('.detail-year');
    const techEl      = modal.querySelector('.detail-technique');
    const dimsEl      = modal.querySelector('.detail-dimensions');
    const frameRow    = modal.querySelector('.detail-spec-frame');
    const frameEl     = modal.querySelector('.detail-frame');
    const priceEl     = modal.querySelector('.galleria-detail-price');
    const ctaBtn      = modal.querySelector('.galleria-detail-cta');
    const closeBtn    = modal.querySelector('.galleria-detail-close');

    let previousFocus = null;
    let zoomActive = false;

    function open(article) {
      previousFocus = document.activeElement;
      const data = article.dataset;
      const imgSrc = article.querySelector('img').getAttribute('src');
      const title  = data.title || article.querySelector('h3').textContent.trim();
      const year   = data.year || '';
      const tech   = data.technique || 'Acrilico su tela';
      const dims   = data.dimensions || '';
      const frame  = data.frame || '';
      const price  = parseInt(data.price, 10);
      const sold   = data.sold === 'true';

      img.src = imgSrc;
      img.alt = title;
      // Background image is only used during zoom — clear it for normal view
      imgWrap.dataset.src = imgSrc;
      imgWrap.style.backgroundImage = '';
      imgWrap.style.backgroundPosition = '50% 50%';

      titleEl.textContent = title;
      yearEl.textContent  = year;
      techEl.textContent  = tech;
      dimsEl.textContent  = dims;

      if (frame) {
        frameRow.hidden = false;
        frameEl.textContent = frame;
      } else {
        frameRow.hidden = true;
      }

      if (sold) {
        priceEl.textContent = 'Venduta';
        priceEl.classList.add('is-sold');
        ctaBtn.textContent = 'Richiedi un\'opera simile';
        ctaBtn.href = 'contatti.html?oggetto=' + encodeURIComponent('Richiesta opera simile a "' + title + '"');
      } else {
        priceEl.textContent = '€' + price.toLocaleString('it-IT');
        priceEl.classList.remove('is-sold');
        ctaBtn.textContent = 'Contatta l\'artista';
        ctaBtn.href = 'contatti.html?oggetto=' + encodeURIComponent('Interesse acquisto: "' + title + '" (' + year + ')');
      }

      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      setTimeout(() => closeBtn.focus(), 50);
    }

    function close() {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      setZoom(false);
      if (previousFocus && previousFocus.focus) previousFocus.focus();
    }

    function setZoom(on) {
      zoomActive = on;
      imgWrap.classList.toggle('zoom-active', on);
      zoomToggle.setAttribute('aria-pressed', on ? 'true' : 'false');
      if (on && imgWrap.dataset.src) {
        imgWrap.style.backgroundImage = `url("${imgWrap.dataset.src}")`;
      } else {
        imgWrap.style.backgroundImage = '';
        imgWrap.style.backgroundPosition = '50% 50%';
      }
    }

    // Click on a gallery item opens the modal
    section.addEventListener('click', e => {
      const article = e.target.closest('.galleria-item');
      if (article) {
        e.preventDefault();
        open(article);
      }
    });

    // Keyboard accessible: enter on focused article
    section.addEventListener('keydown', e => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const article = e.target.closest('.galleria-item');
      if (article) {
        e.preventDefault();
        open(article);
      }
    });

    closeBtn.addEventListener('click', close);
    modal.addEventListener('click', e => {
      if (e.target === modal) close();
    });
    document.addEventListener('keydown', e => {
      if (!modal.classList.contains('active')) return;
      if (e.key === 'Escape') close();
    });

    // Zoom interaction: toggle zoom mode, then mouse-pan
    zoomToggle.addEventListener('click', e => {
      e.stopPropagation();
      setZoom(!zoomActive);
    });

    imgWrap.addEventListener('mousemove', e => {
      if (!zoomActive) return;
      const r = imgWrap.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      imgWrap.style.backgroundPosition = `${x}% ${y}%`;
    });

    imgWrap.addEventListener('mouseleave', () => {
      if (!zoomActive) return;
      imgWrap.style.backgroundPosition = '50% 50%';
    });

    // Click image to also toggle zoom (intuitive)
    img.addEventListener('click', e => {
      if (e.target === zoomToggle || zoomToggle.contains(e.target)) return;
      setZoom(!zoomActive);
    });

    // Make cards focusable for keyboard
    section.querySelectorAll('.galleria-item').forEach(a => {
      if (!a.hasAttribute('tabindex')) a.setAttribute('tabindex', '0');
      a.style.cursor = 'pointer';
    });
  }

  /* ==========================================================
     NAV DROPDOWN (Mostre e Premi)
     ========================================================== */
  function initNavDropdown() {
    document.querySelectorAll('.nav-dropdown').forEach(dd => {
      const trigger = dd.querySelector('.nav-dropdown-trigger');
      if (!trigger) return;

      // On touch / no-hover devices, tap toggles open; otherwise rely on CSS hover
      const isTouch = !window.matchMedia('(hover: hover)').matches;
      if (isTouch) {
        trigger.addEventListener('click', e => {
          // First tap opens dropdown; second tap (or tap on a menu item) follows link
          if (!dd.classList.contains('open')) {
            e.preventDefault();
            // Close other dropdowns
            document.querySelectorAll('.nav-dropdown.open').forEach(other => {
              if (other !== dd) other.classList.remove('open');
            });
            dd.classList.add('open');
            trigger.setAttribute('aria-expanded', 'true');
          }
        });
        document.addEventListener('click', e => {
          if (!dd.contains(e.target)) {
            dd.classList.remove('open');
            trigger.setAttribute('aria-expanded', 'false');
          }
        });
      }

      // Keyboard support: Esc closes, Down/Up traverses menu items
      trigger.addEventListener('keydown', e => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          dd.classList.add('open');
          trigger.setAttribute('aria-expanded', 'true');
          const first = dd.querySelector('.nav-dropdown-menu a');
          if (first) first.focus();
        }
      });
      dd.querySelectorAll('.nav-dropdown-menu a').forEach((item, i, arr) => {
        item.addEventListener('keydown', e => {
          if (e.key === 'ArrowDown') { e.preventDefault(); (arr[i+1] || arr[0]).focus(); }
          if (e.key === 'ArrowUp')   { e.preventDefault(); (arr[i-1] || arr[arr.length-1]).focus(); }
          if (e.key === 'Escape')    { e.preventDefault(); dd.classList.remove('open'); trigger.setAttribute('aria-expanded','false'); trigger.focus(); }
        });
      });
    });
  }

  /* ==========================================================
     MOSTRE TABS (mostre.html — Lista / Immagini)
     ========================================================== */
  function initMostreTabs() {
    const tabsRoot = document.querySelector('.mostre-tabs');
    if (!tabsRoot) return;
    const tabs   = Array.from(tabsRoot.querySelectorAll('.mostre-tab'));
    const panels = Array.from(document.querySelectorAll('.mostre-tabpanel'));

    function activate(name) {
      tabs.forEach(t => {
        const isActive = t.dataset.tab === name;
        t.classList.toggle('active', isActive);
        t.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
      panels.forEach(p => {
        p.hidden = p.dataset.tabpanel !== name;
      });
    }

    tabs.forEach(t => t.addEventListener('click', () => activate(t.dataset.tab)));

    // Initial scroll-to-hash for sub-anchors (if user came in via #mostre etc.)
    // We just ensure the default "lista" tab is active on landing.
    if (window.location.hash === '#mostre' || !window.location.hash) {
      activate('lista');
    }
  }

  /* ==========================================================
     LETTURE CRITICHE — Slideshow (artista.html)
     ========================================================== */
  function initReadingsSlideshow() {
    const root = document.querySelector('.readings-slideshow');
    if (!root) return;
    const viewport = root.querySelector('.readings-viewport');
    const track    = root.querySelector('.readings-track');
    const slides   = Array.from(track.querySelectorAll('.reading-card'));
    const dots     = Array.from(root.querySelectorAll('.readings-dot'));
    const prevBtn  = root.querySelector('.readings-prev');
    const nextBtn  = root.querySelector('.readings-next');
    if (slides.length < 2) return;

    let current = 0;

    function syncHeight() {
      const h = slides[current].offsetHeight;
      viewport.style.height = h + 'px';
    }

    function go(i) {
      current = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, idx) => {
        d.classList.toggle('active', idx === current);
        d.setAttribute('aria-selected', idx === current ? 'true' : 'false');
      });
      syncHeight();
    }

    prevBtn.addEventListener('click', () => go(current - 1));
    nextBtn.addEventListener('click', () => go(current + 1));
    dots.forEach((d, idx) => d.addEventListener('click', () => go(idx)));

    // Keyboard navigation when slideshow is in view & focused
    root.setAttribute('tabindex', '-1');
    root.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); go(current - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); go(current + 1); }
    });

    // Basic touch swipe
    let touchStartX = null;
    track.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    track.addEventListener('touchend', e => {
      if (touchStartX === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) go(current + (dx < 0 ? 1 : -1));
      touchStartX = null;
    });

    // Resize: reflow height to active slide
    let resizeRaf;
    window.addEventListener('resize', () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(syncHeight);
    });

    // Wait for fonts so initial height is accurate
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(syncHeight);
    }
    // Initial measure (also after a small delay for any reveal-up animations / images)
    syncHeight();
    setTimeout(syncHeight, 250);
  }

  /* ==========================================================
     HERO BACKGROUND SLIDESHOW
     ========================================================== */
  function initHeroSlideshow() {
    document.querySelectorAll('.hero-bg-slideshow').forEach(container => {
      const slides = Array.from(container.querySelectorAll('.hero-bg'));
      if (slides.length < 2) return;
      const interval = parseInt(container.dataset.interval) || 6000;
      let i = 0;
      // Preload all images
      slides.forEach(s => {
        const m = (s.style.backgroundImage || '').match(/url\(["']?([^"')]+)["']?\)/);
        if (m) { const img = new Image(); img.src = m[1]; }
      });
      setInterval(() => {
        slides[i].classList.remove('active');
        i = (i + 1) % slides.length;
        slides[i].classList.add('active');
      }, interval);
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
