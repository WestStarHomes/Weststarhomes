// West Star Home LTD — single-page site interactions
(function () {
  'use strict';

  // ---------- Mobile nav toggle ----------
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      const isOpen = siteNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close nav after clicking a link on mobile
    siteNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        siteNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---------- Hero carousel ----------
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.slider-dots button');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  const slidesWrap = document.querySelector('.slides');

  let current = 0;
  let autoplay = null;
  const AUTOPLAY_MS = 6000;

  function goTo(index) {
    if (!slides.length) return;
    current = (index + slides.length) % slides.length;
    slides.forEach(function (s, i) {
      s.classList.toggle('is-active', i === current);
    });
    dots.forEach(function (d, i) {
      d.classList.toggle('is-active', i === current);
    });
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAutoplay() {
    stopAutoplay();
    autoplay = setInterval(next, AUTOPLAY_MS);
  }

  function stopAutoplay() {
    if (autoplay) {
      clearInterval(autoplay);
      autoplay = null;
    }
  }

  if (slides.length) {
    if (nextBtn) nextBtn.addEventListener('click', function () { next(); startAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); startAutoplay(); });

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goTo(i); startAutoplay(); });
    });

    if (slidesWrap) {
      slidesWrap.addEventListener('mouseenter', stopAutoplay);
      slidesWrap.addEventListener('mouseleave', startAutoplay);
    }

    startAutoplay();
  }

  // ---------- Scrollspy: highlight active nav link on scroll ----------
  const sections = ['home', 'about', 'services', 'vision', 'contact']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  const navLinks = document.querySelectorAll('.site-nav a');

  function setActive(id) {
    navLinks.forEach(function (link) {
      const href = link.getAttribute('href') || '';
      link.classList.toggle('active', href === '#' + id);
    });
  }

  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver(function (entries) {
      // Pick the entry with the largest intersection ratio that is intersecting
      let best = null;
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          if (!best || entry.intersectionRatio > best.intersectionRatio) {
            best = entry;
          }
        }
      });
      if (best && best.target && best.target.id) {
        setActive(best.target.id);
      }
    }, {
      rootMargin: '-40% 0px -50% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1]
    });

    sections.forEach(function (s) { observer.observe(s); });
  }

  // ---------- Footer year ----------
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();
