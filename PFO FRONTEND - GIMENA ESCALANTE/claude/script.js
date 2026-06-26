/* ============================================================
   AURORA COFFEE HOUSE — script.js
   Handles: nav scroll state, mobile menu, scroll-reveal,
            contact form validation, footer year
============================================================ */

(function () {
  'use strict';

  /* ===== NAV: sticky scroll shadow ===== */
  const header = document.querySelector('.site-header');

  function onScroll () {
    if (window.scrollY > 20) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load


  /* ===== MOBILE MENU ===== */
  const navToggle = document.getElementById('navToggle');
  const navMenu   = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isExpanded));
      navMenu.classList.toggle('is-open', !isExpanded);
    });

    // Close menu when a link is clicked
    navMenu.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-open');
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!header.contains(e.target)) {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-open');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-open');
        navToggle.focus();
      }
    });
  }


  /* ===== SCROLL REVEAL ===== */
  const revealTargets = document.querySelectorAll(
    '.specialty-card, .testimonial-card, .about__grid, .contact__grid, .section__header'
  );

  revealTargets.forEach(function (el) {
    el.classList.add('reveal');
  });

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealTargets.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show all immediately if IntersectionObserver not supported
    revealTargets.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }


  /* ===== STAGGERED CARD REVEAL ===== */
  // Give each card within a grid a slight delay
  function staggerCards (gridSelector, cardSelector) {
    var grids = document.querySelectorAll(gridSelector);
    grids.forEach(function (grid) {
      var cards = grid.querySelectorAll(cardSelector);
      cards.forEach(function (card, i) {
        card.style.transitionDelay = (i * 0.08) + 's';
      });
    });
  }

  staggerCards('.specialties__grid',  '.specialty-card');
  staggerCards('.testimonials__grid', '.testimonial-card');


  /* ===== CONTACT FORM VALIDATION ===== */
  var form        = document.getElementById('contactForm');
  var formSuccess = document.getElementById('formSuccess');

  if (form) {
    var fields = {
      name:    { input: document.getElementById('name'),    error: document.getElementById('nameError'),    validate: validateName    },
      email:   { input: document.getElementById('email'),   error: document.getElementById('emailError'),   validate: validateEmail   },
      message: { input: document.getElementById('message'), error: document.getElementById('messageError'), validate: validateMessage }
    };

    // Live validation on blur
    Object.keys(fields).forEach(function (key) {
      var field = fields[key];
      field.input.addEventListener('blur', function () {
        validateField(field);
      });
      field.input.addEventListener('input', function () {
        if (field.input.classList.contains('is-error')) {
          validateField(field);
        }
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      Object.keys(fields).forEach(function (key) {
        if (!validateField(fields[key])) valid = false;
      });

      if (valid) {
        // Simulate successful submission (no backend)
        var submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';

        setTimeout(function () {
          form.reset();
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
          formSuccess.hidden = false;
          formSuccess.focus();

          setTimeout(function () {
            formSuccess.hidden = true;
          }, 6000);
        }, 900);
      }
    });
  }

  function validateField (field) {
    var result = field.validate(field.input.value.trim());
    if (result) {
      field.input.classList.add('is-error');
      field.error.textContent = result;
      field.input.setAttribute('aria-invalid', 'true');
      return false;
    } else {
      field.input.classList.remove('is-error');
      field.error.textContent = '';
      field.input.setAttribute('aria-invalid', 'false');
      return true;
    }
  }

  function validateName (value) {
    if (!value) return 'Please enter your name.';
    if (value.length < 2) return 'Name must be at least 2 characters.';
    return null;
  }

  function validateEmail (value) {
    if (!value) return 'Please enter your email address.';
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(value)) return 'Please enter a valid email address.';
    return null;
  }

  function validateMessage (value) {
    if (!value) return 'Please write a message.';
    if (value.length < 10) return 'Message is too short — give us a little more to work with!';
    return null;
  }


  /* ===== SMOOTH SCROLL OFFSET (account for sticky header) ===== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      var headerH = header ? header.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });


  /* ===== FOOTER: DYNAMIC YEAR ===== */
  var yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
