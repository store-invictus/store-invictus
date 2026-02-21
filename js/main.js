/* ================================================
   STORE INVICTUS — main.js v3.0
   FIXES:
   - Mobile menu usa visibility em vez de display toggle
   - Filtros realmente filtram cards por data-categoria
   - Counter com threshold menor para mobile
   - FAQ max-height dinâmico via scrollHeight

   - aria-pressed sincronizado nos filtros
   ================================================ */

(function () {
  'use strict';

  /* ────────────────────────────────────────────
     NAVBAR SCROLL
  ──────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          navbar.classList.toggle('scrolled', window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ────────────────────────────────────────────
     FIX: HAMBURGER / MOBILE MENU
     Usa visibility+opacity em vez de display toggle
     para permitir transição CSS suave
  ──────────────────────────────────────────── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      mobileMenu.setAttribute('aria-hidden', String(!isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobile);
    });

    document.addEventListener('click', (e) => {
      if (
        mobileMenu.classList.contains('open') &&
        !mobileMenu.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        closeMobile();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMobile();
    });
  }

  function closeMobile() {
    mobileMenu?.classList.remove('open');
    hamburger?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    mobileMenu?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /* ────────────────────────────────────────────
     ACTIVE NAV LINK
  ──────────────────────────────────────────── */
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentFile || (currentFile === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ────────────────────────────────────────────
     SCROLL REVEAL
  ──────────────────────────────────────────── */
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-reveal]').forEach((el, i) => {
      const delay = el.dataset.delay || (i % 4) * 80;
      el.style.animationDelay = delay + 'ms';
      revealObserver.observe(el);
    });
  } else {
    document.querySelectorAll('[data-reveal]').forEach(el => {
      el.style.opacity = '1';
    });
  }

  /* ────────────────────────────────────────────
     COUNTER ANIMATION
     FIX: threshold reduzido para 0.3 (mobile friendly)
  ──────────────────────────────────────────── */
  function animateCounter(el) {
    const target   = parseInt(el.dataset.count, 10);
    const suffix   = el.dataset.suffix || '';
    const duration = 1800;
    const startTime = performance.now();

    function step(now) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 4);
      const current  = Math.floor(eased * target);
      el.textContent = current.toLocaleString('pt-BR') + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 }); // FIX: era 0.6, falhava em mobile

    document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));
  }

  /* ────────────────────────────────────────────
     FIX: FAQ ACCORDION
     max-height dinâmico via scrollHeight
     (antes era fixo em 320px — cortava respostas longas)
  ──────────────────────────────────────────── */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('open');

      // Fecha todos
      document.querySelectorAll('.faq-item.open').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        const a = i.querySelector('.faq-answer');
        if (a) a.style.maxHeight = '0';
      });

      // Abre o clicado se estava fechado
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        // Calcula altura real do conteúdo
        const body = answer.querySelector('.faq-body');
        if (body && answer) {
          answer.style.maxHeight = (body.scrollHeight + 34) + 'px';
        }
      }
    });
  });

  // Remove max-height inicial do CSS (agora controlado por JS)
  document.querySelectorAll('.faq-answer').forEach(a => {
    a.style.maxHeight = '0';
  });

  /* ────────────────────────────────────────────
     FIX: FILTROS — realmente filtram cards
     Lê data-categoria nos cards e compara com
     o data-filter do botão clicado
  ──────────────────────────────────────────── */
  document.querySelectorAll('[data-filter-group]').forEach(group => {
    const btns  = group.querySelectorAll('[data-filter]');
    // Seleciona container de cards (próximo .cursos-grid ou .ebooks-grid)
    const gridContainer = document.querySelector('.cursos-grid, .ebooks-grid');

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        // Atualiza estado dos botões
        btns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        // Filtra cards se existirem
        if (gridContainer) {
          const cards = gridContainer.querySelectorAll('[data-categoria]');
          cards.forEach(card => {
            if (filter === 'todos' || card.dataset.categoria === filter) {
              card.classList.remove('filtro-oculto');
            } else {
              card.classList.add('filtro-oculto');
            }
          });
        }
      });
    });
  });

  /* ────────────────────────────────────────────
     SCROLL SUAVE PARA ÂNCORAS
  ──────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

})();
