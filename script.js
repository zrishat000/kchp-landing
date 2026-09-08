/* Purchase links stay local until a verified checkout URL is configured. */
'use strict';
document.documentElement.classList.add('js');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
const desktop = window.matchMedia('(min-width: 1000px)');
function closeMenu(returnFocus = false) {
  navigation.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Открыть меню');
  if (returnFocus) menuButton.focus();
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  navigation.classList.toggle('is-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
});
navigation.addEventListener('click', (event) => {
  const link = event.target.closest('a');
  if (!link) return;
  closeMenu();
  const destination = document.querySelector(link.hash);
  if (destination) {
    destination.setAttribute('tabindex', '-1');
    destination.focus({ preventScroll: true });
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navigation.classList.contains('is-open')) closeMenu(true);
});
document.addEventListener('click', (event) => {
  if (!event.target.closest('.header')) closeMenu();
});
desktop.addEventListener('change', () => closeMenu());
// Native details/summary keeps FAQ usable with keyboard and without JavaScript.
document.querySelector('[data-checkout]').addEventListener('click', (event) => {
  event.preventDefault();
  const note = document.querySelector('#payment-note');
  note.textContent = 'Покупка пока недоступна: оплата еще не подключена. Порядок получения файлов будет указан до начала продаж.';
  note.classList.add('is-active');
  note.focus({ preventScroll: true });
});
