/**
 * JARVISWEBSITES — Core Engine
 */
(function () {
  'use strict';
  var reducedMotionMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  function applyReducedMotion() { document.documentElement.dataset.reducedMotion = reducedMotionMQ.matches ? 'true' : 'false'; }
  applyReducedMotion();
  reducedMotionMQ.addEventListener('change', applyReducedMotion);
  function isTouchDevice() { return 'ontouchstart' in window || navigator.maxTouchPoints > 0; }
  document.documentElement.dataset.mobile = isTouchDevice() ? 'true' : 'false';
  window.JW = window.JW || {};
  window.JW.delegate = function (parent, event, selector, handler) { parent.addEventListener(event, function (e) { var target = e.target.closest(selector); if (target && parent.contains(target)) { handler(e, target); } }); };
  window.JW.reducedMotion = function () { return document.documentElement.dataset.reducedMotion === 'true'; };
  window.JW.isMobile = function () { return document.documentElement.dataset.mobile === 'true'; };
  document.addEventListener('DOMContentLoaded', function () {
    var revealSelectors = '.reveal-up, .reveal-left, .reveal-right, .reveal-scale';
    var revealElements = document.querySelectorAll(revealSelectors);
    if (revealElements.length && !window.JW.reducedMotion()) {
      var revealObserver = new IntersectionObserver(function (entries) { entries.forEach(function (entry) { if (entry.isIntersecting) { entry.target.classList.add('revealed'); revealObserver.unobserve(entry.target); } }); }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
      revealElements.forEach(function (el) { revealObserver.observe(el); });
    } else if (revealElements.length) { revealElements.forEach(function (el) { el.classList.add('revealed'); el.style.transitionDuration = '0ms'; }); }
    document.addEventListener('click', function (e) { var anchor = e.target.closest('a[href^="#"]'); if (!anchor) return; var href = anchor.getAttribute('href'); if (href === '#') return; var target = document.querySelector(href); if (!target) return; e.preventDefault(); var header = document.querySelector('[data-header]'); var offset = header ? header.getBoundingClientRect().height : 80; var targetY = target.getBoundingClientRect().top + window.scrollY - offset; window.scrollTo({ top: targetY, behavior: window.JW.reducedMotion() ? 'auto' : 'smooth' }); });
    var yearEls = document.querySelectorAll('[data-year]'); var year = new Date().getFullYear(); yearEls.forEach(function (el) { el.textContent = year; });
    if (window.JW.reducedMotion()) { var staggerEls = document.querySelectorAll('[class*="stagger-"]'); staggerEls.forEach(function (el) { el.style.transitionDelay = '0ms'; el.style.animationDelay = '0ms'; }); }
  });
}());

/**
 * Header Module
 */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    var header = document.querySelector('[data-header]');
    if (!header) return;
    var lastScrollY = window.scrollY, ticking = false, THRESHOLD = 50;
    function updateHeader() { var y = window.scrollY; if (y > THRESHOLD) { header.dataset.scrolled = 'true'; header.dataset.hidden = y > lastScrollY ? 'true' : 'false'; } else { header.dataset.scrolled = 'false'; header.dataset.hidden = 'false'; } document.documentElement.style.setProperty('--header-height-actual', header.getBoundingClientRect().height + 'px'); lastScrollY = y; ticking = false; }
    window.addEventListener('scroll', function () { if (!ticking) { requestAnimationFrame(updateHeader); ticking = true; } }, { passive: true });
    document.documentElement.style.setProperty('--header-height-actual', header.getBoundingClientRect().height + 'px');
  });
}());

/**
 * Mobile Menu Module
 */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.querySelector('[data-mobile-toggle]');
    var menu = document.querySelector('[data-mobile-menu]');
    if (!toggle || !menu) return;
    var isOpen = false, focusableEls = [], firstFocusable = null, lastFocusable = null;
    var FOCUSABLE_SEL = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    if (!menu.id) menu.id = 'mobile-nav-menu';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', menu.id);
    menu.setAttribute('aria-hidden', 'true');
    function updateFocusables() { focusableEls = Array.from(menu.querySelectorAll(FOCUSABLE_SEL)); firstFocusable = focusableEls[0] || null; lastFocusable = focusableEls[focusableEls.length - 1] || null; }
    function openMenu() { isOpen = true; menu.dataset.open = 'true'; toggle.setAttribute('aria-expanded', 'true'); menu.setAttribute('aria-hidden', 'false'); document.body.dataset.menuOpen = ''; updateFocusables(); if (firstFocusable) firstFocusable.focus(); }
    function closeMenu() { isOpen = false; menu.dataset.open = 'false'; toggle.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-hidden', 'true'); delete document.body.dataset.menuOpen; toggle.focus(); }
    toggle.addEventListener('click', function () { isOpen ? closeMenu() : openMenu(); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', function (e) { if (!isOpen) return; if (e.key === 'Escape') { closeMenu(); return; } if (e.key === 'Tab') { if (!focusableEls.length) { e.preventDefault(); return; } if (e.shiftKey) { if (document.activeElement === firstFocusable) { e.preventDefault(); lastFocusable.focus(); } } else { if (document.activeElement === lastFocusable) { e.preventDefault(); firstFocusable.focus(); } } } });
    document.addEventListener('click', function (e) { if (!isOpen) return; if (!menu.contains(e.target) && !toggle.contains(e.target)) closeMenu(); });
  });
}());

/**
 * Preloader Module
 */
(function () {
  'use strict';
  var preloader = document.querySelector('[data-preloader]');
  if (!preloader) return;
  var MIN_MS = 500, startTime = Date.now();
  function hidePreloader() { var elapsed = Date.now() - startTime; var wait = Math.max(0, MIN_MS - elapsed); setTimeout(function () { preloader.dataset.exit = 'true'; function onEnd() { preloader.removeEventListener('transitionend', onEnd); if (preloader.parentNode) preloader.parentNode.removeChild(preloader); document.body.classList.add('loaded'); } preloader.addEventListener('transitionend', onEnd, { once: true }); setTimeout(function () { if (preloader.parentNode) preloader.parentNode.removeChild(preloader); document.body.classList.add('loaded'); }, 1000); }, wait); }
  if (document.readyState === 'complete') { hidePreloader(); } else { window.addEventListener('load', hidePreloader, { once: true }); }
}());

/**
 * Form Validation Module
 */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    var forms = document.querySelectorAll('form[data-validate]');
    if (!forms.length) return;
    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    function getError(input) { var value = input.value.trim(); if (input.required && !value) return input.dataset.errorRequired || 'Questo campo è obbligatorio.'; if (input.type === 'email' && value && !EMAIL_RE.test(value)) return input.dataset.errorEmail || 'Inserisci un indirizzo email valido.'; return null; }
    function showError(input, message) { input.classList.add('error'); input.setAttribute('aria-invalid', 'true'); var errorEl = input.parentElement.querySelector('.form-error'); if (!errorEl) { errorEl = document.createElement('span'); errorEl.className = 'form-error'; errorEl.setAttribute('role', 'alert'); if (input.id) { errorEl.id = input.id + '-error'; input.setAttribute('aria-describedby', errorEl.id); } input.parentNode.appendChild(errorEl); } errorEl.textContent = message; errorEl.style.display = 'block'; }
    function clearError(input) { input.classList.remove('error'); input.setAttribute('aria-invalid', 'false'); var errorEl = input.parentElement.querySelector('.form-error'); if (errorEl) { errorEl.textContent = ''; errorEl.style.display = 'none'; } }
    forms.forEach(function (form) {
      var inputs = Array.from(form.querySelectorAll('input, textarea, select'));
      var validatableInputs = inputs.filter(function (input) { return input.required || input.type === 'email'; });
      validatableInputs.forEach(function (input) { input.addEventListener('blur', function () { var error = getError(input); error ? showError(input, error) : clearError(input); }); input.addEventListener('input', function () { if (input.classList.contains('error')) { var error = getError(input); if (!error) clearError(input); } }); });
      form.addEventListener('submit', function (e) {
        var hasErrors = false, firstErrorInput = null;
        validatableInputs.forEach(function (input) { var error = getError(input); if (error) { showError(input, error); hasErrors = true; if (!firstErrorInput) firstErrorInput = input; } else { clearError(input); } });
        if (hasErrors) { e.preventDefault(); if (firstErrorInput) firstErrorInput.focus(); return; }
        var successMsg = form.dataset.successMessage;
        if (successMsg) { e.preventDefault(); var successEl = form.querySelector('.form-success'); if (!successEl) { successEl = document.createElement('div'); successEl.className = 'form-success'; successEl.setAttribute('role', 'status'); form.appendChild(successEl); } successEl.textContent = successMsg; successEl.style.display = 'block'; form.reset(); }
      });
    });
  });
}());

/**
 * Accordion Module
 */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    var accordions = document.querySelectorAll('[data-accordion]');
    if (!accordions.length) return;
    var reducedMotion = window.JW ? window.JW.reducedMotion() : window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    accordions.forEach(function (accordion) {
      var isSingle = accordion.dataset.single === 'true';
      var triggers = Array.from(accordion.querySelectorAll('[data-accordion-trigger]'));
      triggers.forEach(function (trigger, i) {
        var body = trigger.getAttribute('aria-controls') ? document.getElementById(trigger.getAttribute('aria-controls')) : trigger.closest('[data-accordion-item]') ? trigger.closest('[data-accordion-item]').querySelector('[data-accordion-body]') : trigger.parentElement.querySelector('[data-accordion-body]');
        if (!body) return;
        if (!body.id) body.id = 'accordion-body-' + i + '-' + Date.now();
        if (!trigger.id) trigger.id = 'accordion-trigger-' + i + '-' + Date.now();
        trigger.setAttribute('aria-controls', body.id); body.setAttribute('role', 'region'); body.setAttribute('aria-labelledby', trigger.id);
        if (!reducedMotion) { body.style.overflow = 'hidden'; body.style.transition = 'max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)'; }
        var initiallyOpen = trigger.getAttribute('aria-expanded') === 'true';
        function open() { trigger.setAttribute('aria-expanded', 'true'); body.style.maxHeight = reducedMotion ? 'none' : body.scrollHeight + 'px'; }
        function close() { trigger.setAttribute('aria-expanded', 'false'); body.style.maxHeight = '0'; }
        if (initiallyOpen) { open(); } else { trigger.setAttribute('aria-expanded', 'false'); if (!reducedMotion) body.style.maxHeight = '0'; }
        trigger.addEventListener('click', function () {
          var isOpen = trigger.getAttribute('aria-expanded') === 'true';
          if (isSingle && !isOpen) { triggers.forEach(function (otherTrigger) { if (otherTrigger === trigger) return; if (otherTrigger.getAttribute('aria-expanded') !== 'true') return; var otherBody = otherTrigger.getAttribute('aria-controls') ? document.getElementById(otherTrigger.getAttribute('aria-controls')) : otherTrigger.closest('[data-accordion-item]') ? otherTrigger.closest('[data-accordion-item]').querySelector('[data-accordion-body]') : otherTrigger.parentElement.querySelector('[data-accordion-body]'); otherTrigger.setAttribute('aria-expanded', 'false'); if (otherBody) otherBody.style.maxHeight = '0'; }); }
          isOpen ? close() : open();
        });
        trigger.addEventListener('keydown', function (e) { var idx = triggers.indexOf(trigger); if (e.key === 'ArrowDown') { e.preventDefault(); var next = triggers[idx + 1]; if (next) next.focus(); } else if (e.key === 'ArrowUp') { e.preventDefault(); var prev = triggers[idx - 1]; if (prev) prev.focus(); } });
      });
    });
  });
}());

/**
 * Counter Module
 */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;
    var reducedMotion = window.JW ? window.JW.reducedMotion() : window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
    function formatNumber(n, decimals) { var fixed = n.toFixed(decimals); if (decimals > 0) { var parts = fixed.split('.'); parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.'); return parts.join(','); } return fixed.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
    function animateCounter(el) { var target = parseFloat(el.dataset.count) || 0; var prefix = el.dataset.countPrefix || ''; var suffix = el.dataset.countSuffix || ''; var duration = parseInt(el.dataset.countDuration, 10) || 2000; var isFloat = String(el.dataset.count).includes('.'); var decimals = isFloat ? (String(el.dataset.count).split('.')[1] || '').length : 0; if (reducedMotion) { el.textContent = prefix + formatNumber(target, decimals) + suffix; return; } var startTime = null; function tick(timestamp) { if (!startTime) startTime = timestamp; var elapsed = timestamp - startTime; var progress = Math.min(elapsed / duration, 1); var eased = easeOutCubic(progress); var current = target * eased; el.textContent = prefix + formatNumber(current, decimals) + suffix; if (progress < 1) { requestAnimationFrame(tick); } else { el.textContent = prefix + formatNumber(target, decimals) + suffix; } } requestAnimationFrame(tick); }
    var observer = new IntersectionObserver(function (entries) { entries.forEach(function (entry) { if (entry.isIntersecting) { animateCounter(entry.target); observer.unobserve(entry.target); } }); }, { threshold: 0.3 });
    counters.forEach(function (el) { var prefix = el.dataset.countPrefix || ''; var suffix = el.dataset.countSuffix || ''; el.textContent = prefix + '0' + suffix; observer.observe(el); });
  });
}());

/**
 * Text Reveal Module
 */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    var elements = document.querySelectorAll('[data-text-reveal]');
    if (!elements.length) return;
    var reducedMotion = window.JW ? window.JW.reducedMotion() : window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) { elements.forEach(function (el) { el.style.opacity = '1'; }); return; }
    if (!document.getElementById('jw-text-reveal-styles')) { var style = document.createElement('style'); style.id = 'jw-text-reveal-styles'; style.textContent = '.jw-reveal-unit{display:inline-block;opacity:0;transform:translateY(0.5em);transition:opacity 0.55s cubic-bezier(0.16,1,0.3,1),transform 0.55s cubic-bezier(0.16,1,0.3,1)}.jw-reveal-unit.revealed{opacity:1;transform:translateY(0)}'; document.head.appendChild(style); }
    function splitElement(el) { var mode = el.dataset.textReveal || 'words'; var text = el.textContent; el.textContent = ''; el.style.opacity = '1'; var units = mode === 'chars' ? text.split('') : text.split(/\s+/).filter(Boolean); units.forEach(function (unit, i) { var span = document.createElement('span'); span.className = 'jw-reveal-unit'; span.textContent = unit; span.style.transitionDelay = (i * 0.04) + 's'; if (mode === 'words' && i < units.length - 1) span.style.marginRight = '0.25em'; el.appendChild(span); }); }
    var observer = new IntersectionObserver(function (entries) { entries.forEach(function (entry) { if (entry.isIntersecting) { var units = entry.target.querySelectorAll('.jw-reveal-unit'); units.forEach(function (unit) { unit.classList.add('revealed'); }); observer.unobserve(entry.target); } }); }, { threshold: 0.1 });
    elements.forEach(function (el) { splitElement(el); observer.observe(el); });
  });
}());

/**
 * WhatsApp Widget Module
 */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    var widget = document.querySelector('[data-whatsapp]');
    if (!widget) return;
    var phone = (widget.dataset.phone || '').replace(/\D/g, '');
    var message = widget.dataset.message || '';
    var SHOW_THRESHOLD = 300, ticking = false;
    var waUrl = 'https://wa.me/' + phone + (message ? '?text=' + encodeURIComponent(message) : '');
    var link = widget.querySelector('a') || (widget.tagName === 'A' ? widget : null);
    if (link) { link.href = waUrl; link.setAttribute('target', '_blank'); link.setAttribute('rel', 'noopener noreferrer'); }
    widget.setAttribute('aria-label', 'Chatta con noi su WhatsApp');
    function updateVisibility() { widget.dataset.visible = window.scrollY > SHOW_THRESHOLD ? 'true' : 'false'; ticking = false; }
    window.addEventListener('scroll', function () { if (!ticking) { requestAnimationFrame(updateVisibility); ticking = true; } }, { passive: true });
    updateVisibility();
  });
}());

/**
 * Cookie Banner Module
 */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    var banner = document.querySelector('[data-cookie-banner]');
    if (!banner) return;
    var STORAGE_KEY = 'jw_cookie_consent';
    if (localStorage.getItem(STORAGE_KEY)) return;
    var acceptBtn = banner.querySelector('[data-cookie-accept]');
    var rejectBtn = banner.querySelector('[data-cookie-reject]');
    banner.setAttribute('role', 'dialog'); banner.setAttribute('aria-modal', 'true'); banner.setAttribute('aria-label', 'Consenso cookie');
    function showBanner() { banner.dataset.visible = 'true'; var firstFocusable = banner.querySelector('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'); if (firstFocusable) setTimeout(function () { firstFocusable.focus(); }, 100); }
    function hideBanner() { banner.dataset.visible = 'false'; }
    if (acceptBtn) { acceptBtn.addEventListener('click', function () { localStorage.setItem(STORAGE_KEY, 'accepted'); hideBanner(); banner.dispatchEvent(new CustomEvent('cookie:accepted', { bubbles: true })); }); }
    if (rejectBtn) { rejectBtn.addEventListener('click', function () { localStorage.setItem(STORAGE_KEY, 'rejected'); hideBanner(); banner.dispatchEvent(new CustomEvent('cookie:rejected', { bubbles: true })); }); }
    setTimeout(showBanner, 1000);
  });
}());

/**
 * Back to Top Module
 */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.querySelector('[data-back-to-top]');
    if (!btn) return;
    var SHOW_THRESHOLD = 500;
    var reducedMotion = window.JW ? window.JW.reducedMotion() : window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var ticking = false;
    btn.setAttribute('aria-label', 'Torna in cima');
    function updateVisibility() { btn.dataset.visible = window.scrollY > SHOW_THRESHOLD ? 'true' : 'false'; ticking = false; }
    btn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' }); });
    btn.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); } });
    window.addEventListener('scroll', function () { if (!ticking) { requestAnimationFrame(updateVisibility); ticking = true; } }, { passive: true });
    updateVisibility();
  });
}());
