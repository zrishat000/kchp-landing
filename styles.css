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
  // Only same-page anchors: external URLs may also contain a hash.
  if (link.origin === location.origin && link.pathname === location.pathname && link.hash) {
    let id;
    try { id = decodeURIComponent(link.hash.slice(1)); } catch { return; }
    const destination = document.getElementById(id);
    if (destination) {
      destination.setAttribute('tabindex', '-1');
      destination.focus({ preventScroll: true });
    }
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

// Real assets progressively replace the existing mockups.
// Missing or invalid files keep a labelled fallback, including without JS.
document.querySelectorAll('[data-media]').forEach((slot) => {
  const img = slot.querySelector('img');
  const fallback = slot.querySelector('.media-fallback');
  const caption = slot.querySelector('[data-media-caption]');
  const initialCaption = caption?.textContent;
  const update = () => {
    const loaded = img.complete && img.naturalWidth > 0;
    img.hidden = !loaded;
    fallback.hidden = loaded;
    slot.classList.toggle('has-image', loaded);
    if (caption) caption.textContent = loaded ? caption.dataset.loadedCaption : initialCaption;
  };
  img.addEventListener('load', update);
  img.addEventListener('error', update);
  update();
});

const dialog = document.querySelector('#preview-dialog');
const enlargedImage = document.querySelector('#lightbox-image');
const enlargedPlaceholder = document.querySelector('#lightbox-placeholder');
const dialogTitle = document.querySelector('#lightbox-title');
let previewTrigger = null;

if (typeof dialog.showModal === 'function') {
  document.querySelectorAll('[data-preview]').forEach((button) => {
    button.disabled = false;
    button.addEventListener('click', () => {
      previewTrigger = button;
      const source = button.querySelector('img');
      dialogTitle.textContent = button.closest('article').querySelector('h3').textContent;
      const available = source.complete && source.naturalWidth > 0;
      enlargedImage.hidden = !available;
      enlargedPlaceholder.hidden = available;
      enlargedImage.alt = source.alt;
      if (available) enlargedImage.src = source.currentSrc || source.src;
      else enlargedImage.removeAttribute('src');
      dialog.showModal();
      document.documentElement.classList.add('lightbox-open');
    });
  });
  dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', (event) => {
    // The close button is the only interactive control in this image viewer.
    if (event.key === 'Tab') {
      event.preventDefault();
      dialog.querySelector('.lightbox-close').focus();
    }
  });
  // Native modal dialog supplies Escape, focus containment and inert background.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog || event.target === dialog.querySelector('.lightbox-content')) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('lightbox-open');
    previewTrigger?.focus({ preventScroll: true });
  });
  enlargedImage.addEventListener('error', () => {
    enlargedImage.hidden = true;
    enlargedPlaceholder.hidden = false;
  });
}
