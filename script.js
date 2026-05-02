/**
 * @fileoverview Main frontend application for Hospedaje Rubí.
 * 
 * ESTRUCTURA RECOMENDADA SI EL PROYECTO ESCALA:
 * /src/
 *  ├── components/
 *  │    ├── Navigation.js      (Lógica del Navbar y Menú)
 *  │    ├── Card3D.js          (Efecto tilt de las tarjetas)
 *  │    └── Gallery.js         (Staggering y lazy loading)
 *  ├── utils/
 *  │    ├── ObserverManager.js (Centralización de IntersectionObservers)
 *  │    └── scrollUtils.js     (Helpers para scroll suave y parallax)
 *  └── index.js                (Punto de entrada)
 * 
 * Por ahora, para evitar configuraciones complejas de bundlers (Webpack/Vite), 
 * usamos el Patrón Módulo (IIFE) para aislar responsabilidades.
 */

;(function App() {
  'use strict';

  /**
   * Maneja el UI del navbar, menú móvil y active states.
   */
  class NavigationManager {
    constructor() {
      this.nav = document.querySelector('#navbar');
      this.btn = document.querySelector('#navToggle');
      this.menu = document.querySelector('#navLinks');
      
      // early return si no hay nav (por ej en una página 404)
      if (!this.nav || !this.btn) return;

      this.links = this.menu.querySelectorAll('a');
      this.sections = document.querySelectorAll('.section[id]');
      
      this._init();
    }

    _init() {
      // Toggle en móvil
      this.btn.addEventListener('click', () => {
        const isOpen = this.menu.classList.toggle('active');
        this.nav.classList.toggle('menu-open', isOpen);
        // La animación en X se maneja vía CSS (.nav-toggle.active) que tú añadiste antes
        this.btn.classList.toggle('active', isOpen); 
      });

      // Cerrar al clickear link
      this.links.forEach(el => {
        el.addEventListener('click', (e) => {
          this.menu.classList.remove('active');
          this.nav.classList.remove('menu-open');
          this.btn.classList.remove('active');
          
          // Smooth scroll manual
          e.preventDefault();
          const targetId = el.getAttribute('href');
          const target = document.querySelector(targetId);
          if (target) {
            const offset = this.nav.offsetHeight + 20;
            window.scrollTo({
              top: target.getBoundingClientRect().top + window.scrollY - offset,
              behavior: 'smooth'
            });
          }
        });
      });

      // Background y link activo en scroll (throttled/rAF)
      let ticking = false;
      window.addEventListener('scroll', () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            this._onScroll();
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });
    }

    _onScroll() {
      const scrollY = window.scrollY;
      this.nav.classList.toggle('scrolled', scrollY > 60);

      // Link activo
      const pos = scrollY + 150;
      let currentId = '';
      
      for (const sec of this.sections) {
        if (pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight) {
          currentId = sec.id;
          break; // Optimización: no seguimos iterando si ya encontramos la sección
        }
      }

      if (currentId) {
        this.links.forEach(a => {
          a.classList.toggle('active-link', a.getAttribute('href') === `#${currentId}`);
        });
      }
    }
  }

  /**
   * Gestiona todas las animaciones vinculadas al scroll usando IntersectionObserver.
   */
  class ScrollEffects {
    constructor() {
      this.initReveals();
      this.initParallax();
      this.initCards3D();
    }

    initReveals() {
      const config = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
      const ob = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('active');
            ob.unobserve(e.target); // Solo animar la primera vez
          }
        });
      }, config);

      document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
        .forEach(node => ob.observe(node));

      // Staggering para tarjetas de servicios (añade .active con delay)
      const staggers = document.querySelectorAll('.services-grid .card-3d-wrapper, .gallery-item');
      if (!staggers.length) return;

      const staggerOb = new IntersectionObserver((entries) => {
        entries.forEach((e, idx) => {
          if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add('active'), idx * 100);
            staggerOb.unobserve(e.target);
          }
        });
      }, { threshold: 0.1 });

      staggers.forEach(node => {
        node.classList.add('reveal'); // Forzar estado inicial
        staggerOb.observe(node);
      });
    }

    initParallax() {
      const bg = document.querySelector('.hero-bg');
      const shapes = document.querySelectorAll('.shape');
      if (!bg && !shapes.length) return;

      let ticking = false;
      window.addEventListener('scroll', () => {
        if (window.innerWidth < 768) return; // Móviles no necesitan parallax complejo
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const sc = window.scrollY;
            if (bg) bg.style.transform = `translateY(${sc * 0.35}px)`;
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });

      // Mouse parallax para shapes
      document.addEventListener('mousemove', (e) => {
        if (window.innerWidth < 768) return;
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        
        shapes.forEach((s, idx) => {
          const speed = (idx + 1) * 12;
          s.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
      });
    }

    initCards3D() {
      const cards = document.querySelectorAll('.service-card');
      
      cards.forEach(c => {
        c.addEventListener('mousemove', (e) => {
          if (window.innerWidth < 768) return;
          const rect = c.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const cx = rect.width / 2;
          const cy = rect.height / 2;
          
          const rotX = (y - cy) / cy * -8;
          const rotY = (x - cx) / cx * 8;
          
          c.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.03, 1.03, 1.03)`;
        });

        c.addEventListener('mouseleave', () => {
          c.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
      });
    }
  }

  // Ejecutar cuando el DOM esté listo
  document.addEventListener('DOMContentLoaded', () => {
    try {
      new NavigationManager();
      new ScrollEffects();
      // TODO: Añadir lógica de contadores si alguna vez metemos stats en la landing
    } catch (err) {
      console.warn('App warning:', err);
    }
  });

})();
