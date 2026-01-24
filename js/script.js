// ================= MENU MÓVEL — VERSÃO PROFISSIONAL =================
(() => {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');
  const navLinks = document.querySelectorAll('nav a');

  // Verificação defensiva
  if (!menuToggle || !nav) return;

  // Estado inicial de acessibilidade
  menuToggle.setAttribute('aria-expanded', 'false');

  // Funções de abrir/fechar
  const openMenu = () => {
    nav.classList.add('open');
    menuToggle.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Fechar menu');
  };

  const closeMenu = () => {
    nav.classList.remove('open');
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
  };

  const toggleMenu = () => {
    const isOpen = nav.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  };

  // Clique no botão hambúrguer
  menuToggle.addEventListener('click', toggleMenu);

  // Acessibilidade por teclado (Enter e Espaço)
  menuToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMenu();
    }
  });

  // Fecha menu ao clicar em um link
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Fecha menu ao clicar fora
  document.addEventListener('click', (e) => {
    if (
      nav.classList.contains('open') &&
      !nav.contains(e.target) &&
      !menuToggle.contains(e.target)
    ) {
      closeMenu();
    }
  });

  // Fecha menu com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      closeMenu();
      menuToggle.focus();
    }
  });
})();

// ================= LAZY LOADING OTIMIZADO =================
(() => {
  // Verifica se o navegador suporta IntersectionObserver
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // Carrega a imagem se tiver data-src
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          
          // Para de observar essa imagem
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px' // Começa a carregar 50px antes de entrar na viewport
    });

    // Observa todas as imagens com lazy loading
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => imageObserver.observe(img));
  }
})();

// ================= SMOOTH SCROLL COM OFFSET =================
(() => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      // Ignora âncoras vazias
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        
        // Calcula offset do header fixo
        const header = document.querySelector('header');
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Foca no elemento após scroll (acessibilidade)
        setTimeout(() => {
          targetElement.focus({ preventScroll: true });
        }, 500);
      }
    });
  });
})();

// ================= PREFETCH DE PÁGINAS =================
(() => {
  // Quando usuário passa o mouse sobre um link de produto, faz preload da página
  const productLinks = document.querySelectorAll('.product .btn');
  
  productLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
      const href = this.getAttribute('href');
      
      // Só faz preload de páginas internas (não URLs externas)
      if (href && !href.startsWith('http') && !href.startsWith('#')) {
        // Verifica se já existe um prefetch para essa URL
        const existingPrefetch = document.querySelector(`link[rel="prefetch"][href="${href}"]`);
        
        if (!existingPrefetch) {
          const preloadLink = document.createElement('link');
          preloadLink.rel = 'prefetch';
          preloadLink.href = href;
          document.head.appendChild(preloadLink);
        }
      }
    }, { once: true }); // Executa apenas uma vez por link
  });
})();

// ================= DETECTA SCROLL E ADICIONA CLASSE NO HEADER =================
(() => {
  const header = document.querySelector('header');
  if (!header) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Adiciona sombra quando rola pra baixo
    if (currentScroll > 50) {
      header.style.boxShadow = '0 4px 15px rgba(0,0,0,.7)';
    } else {
      header.style.boxShadow = '0 2px 10px rgba(0,0,0,.5)';
    }

    lastScroll = currentScroll;
  });
})();

// ================= ANALYTICS DE CLIQUES (OPCIONAL) =================
(() => {
  // Rastreia cliques nos botões "Comprar" / "Ver detalhes"
  document.querySelectorAll('.btn.buy').forEach(btn => {
    btn.addEventListener('click', function() {
      const productName = this.closest('.product')?.querySelector('h3')?.textContent || 'Produto desconhecido';
      
      // Se você tiver Google Analytics configurado, descomente:
      // gtag('event', 'click', {
      //   event_category: 'Product',
      //   event_label: productName
      // });
      
      console.log('Clique em produto:', productName);
    });
  });
})();
