// ================= MENU MÓVEL — VERSÃO PROFISSIONAL =================
(() => {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');
  const navLinks = document.querySelectorAll('nav a');

  // Verificação defensiva
  if (!menuToggle || !nav) return;

  // Estado inicial de acessibilidade
  menuToggle.setAttribute('aria-expanded', 'false');

  const openMenu = () => {
    nav.classList.add('open');
    menuToggle.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
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
