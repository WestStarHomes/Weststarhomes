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

  // ---------- Scroll reveal ----------
  const revealTargets = document.querySelectorAll(
    '.section-head, .pillar, .portfolio-item, .service-card, .partner-category, .testimonial-card, .prose'
  );

  if ('IntersectionObserver' in window && revealTargets.length) {
    revealTargets.forEach(function (el) { el.classList.add('pre-reveal'); });

    const revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.remove('pre-reveal');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  }

  // ---------- Portfolio lightbox ----------
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const portfolioItems = Array.prototype.slice.call(document.querySelectorAll('.portfolio-item'));
  let lbIndex = 0;

  function openLightbox(index) {
    if (!lightbox || !portfolioItems.length) return;
    lbIndex = (index + portfolioItems.length) % portfolioItems.length;
    const item = portfolioItems[lbIndex];
    const img = item.querySelector('.portfolio-photo');
    const title = item.querySelector('.portfolio-caption h3');
    const tag = item.querySelector('.portfolio-caption span');
    if (!img) return;

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || '';
    lightboxCaption.textContent = (tag ? tag.textContent + ' — ' : '') + (title ? title.textContent : '');
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
  }

  function lbNext() { openLightbox(lbIndex + 1); }
  function lbPrev() { openLightbox(lbIndex - 1); }

  if (lightbox && portfolioItems.length) {
    portfolioItems.forEach(function (item, i) {
      item.addEventListener('click', function () { openLightbox(i); });
    });

    const lbCloseBtn = lightbox.querySelector('.lightbox-close');
    const lbNextBtn = lightbox.querySelector('.lightbox-next');
    const lbPrevBtn = lightbox.querySelector('.lightbox-prev');

    if (lbCloseBtn) lbCloseBtn.addEventListener('click', closeLightbox);
    if (lbNextBtn) lbNextBtn.addEventListener('click', lbNext);
    if (lbPrevBtn) lbPrevBtn.addEventListener('click', lbPrev);

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') lbNext();
      if (e.key === 'ArrowLeft') lbPrev();
    });
  }

  // ---------- Service card "What's included" toggle ----------
  document.querySelectorAll('.details-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const list = btn.nextElementSibling;
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!isOpen));
      if (list) list.classList.toggle('is-open', !isOpen);
    });
  });

  // ---------- Supplier category accordion ----------
  document.querySelectorAll('.partner-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const list = btn.parentElement.querySelector('.partner-list');
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!isOpen));
      if (list) list.classList.toggle('is-open', !isOpen);
    });
  });

  // ---------- Quote request form ----------
  const quoteForm = document.getElementById('quote-form');
  const quoteStatus = document.getElementById('quote-status');

  if (quoteForm) {
    quoteForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!quoteForm.checkValidity()) {
        quoteForm.classList.add('was-validated');
        quoteForm.reportValidity();
        return;
      }

      const name = quoteForm.name.value.trim();
      const email = quoteForm.email.value.trim();
      const phone = quoteForm.phone.value.trim();
      const project = quoteForm.project.value;
      const message = quoteForm.message.value.trim();

      const subject = 'Quote Request — ' + project;
      const bodyLines = [
        'Name: ' + name,
        'Email: ' + email,
        'Phone: ' + (phone || 'N/A'),
        'Project Type: ' + project,
        '',
        'Project Details:',
        message
      ];
      const mailto = 'mailto:info@weststarhomes.ca'
        + '?subject=' + encodeURIComponent(subject)
        + '&body=' + encodeURIComponent(bodyLines.join('\n'));

      window.location.href = mailto;
      if (quoteStatus) {
        quoteStatus.textContent = 'Opening your email app to send this request…';
      }
    });
  }
})();
