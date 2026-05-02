/* ===== HOTEL RUBÍ — MAIN JAVASCRIPT ===== */

document.addEventListener('DOMContentLoaded', () => {

  /* ----- Navbar scroll effect ----- */
  const navbar = document.querySelector('.navbar');
  const handleNavScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });

  /* ----- Mobile menu toggle ----- */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
    navbar.classList.toggle('menu-open', navLinks.classList.contains('active'));
  });

  // Close menu when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      navbar.classList.remove('menu-open');
      const spans = navToggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
  });

  /* ----- Intersection Observer — Scroll Reveal ----- */
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ----- Parallax Effect ----- */
  const heroBg = document.querySelector('.hero-bg');
  const handleParallax = () => {
    if (window.innerWidth < 768) return; // skip on mobile
    const scrolled = window.scrollY;
    if (heroBg) {
      heroBg.style.transform = `translateY(${scrolled * 0.35}px)`;
    }
  };
  window.addEventListener('scroll', handleParallax, { passive: true });

  /* ----- 3D Card Tilt Effect ----- */
  const cards3D = document.querySelectorAll('.service-card');

  cards3D.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      if (window.innerWidth < 768) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -8;
      const rotateY = (x - centerX) / centerX * 8;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  /* ----- Floating shapes mouse follow ----- */
  const shapes = document.querySelectorAll('.shape');

  document.addEventListener('mousemove', (e) => {
    if (window.innerWidth < 768) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    shapes.forEach((shape, i) => {
      const speed = (i + 1) * 12;
      shape.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
  });

  /* ----- Smooth scroll for anchor links ----- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = navbar.offsetHeight + 20;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

  /* ----- Staggered card reveal ----- */
  const staggerCards = document.querySelectorAll('.services-grid .card-3d-wrapper');
  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('active');
        }, index * 150);
      }
    });
  }, { threshold: 0.1 });

  staggerCards.forEach(card => {
    card.classList.add('reveal');
    staggerObserver.observe(card);
  });

  /* ----- Gallery items stagger ----- */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const galleryObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('active');
        }, index * 120);
      }
    });
  }, { threshold: 0.1 });

  galleryItems.forEach(item => {
    item.classList.add('reveal');
    galleryObserver.observe(item);
  });

  /* ----- Active nav link on scroll ----- */
  const sections = document.querySelectorAll('.section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const activateNavLink = () => {
    const scrollPos = window.scrollY + 150;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navAnchors.forEach(a => a.classList.remove('active-link'));
        const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (activeLink) activeLink.classList.add('active-link');
      }
    });
  };
  window.addEventListener('scroll', activateNavLink, { passive: true });

  /* ----- Counter animation (if needed) ----- */
  const animateCounters = () => {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;
      const update = () => {
        current += increment;
        if (current < target) {
          counter.textContent = Math.ceil(current);
          requestAnimationFrame(update);
        } else {
          counter.textContent = target;
        }
      };
      update();
    });
  };

  const counterSection = document.querySelector('.counters');
  if (counterSection) {
    const counterObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounters();
        counterObserver.disconnect();
      }
    }, { threshold: 0.3 });
    counterObserver.observe(counterSection);
  }

});
