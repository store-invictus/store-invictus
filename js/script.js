// ================= MENU MÓVEL =================

// Seleciona o botão hambúrguer e o nav
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');

// Alterna a classe 'open' ao clicar no botão
menuToggle.addEventListener('click', () => {
  nav.classList.toggle('open');
});

// ================= OPCIONAL: FECHAR MENU AO CLICAR EM UM LINK =================
const navLinks = document.querySelectorAll('nav a');

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (nav.classList.contains('open')) {
      nav.classList.remove('open');
    }
  });
});
