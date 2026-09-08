/* KCHP landing v2.1 final polish */
'use strict';
document.documentElement.classList.add('js');

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
const desktop = window.matchMedia('(min-width: 1000px)');

function closeMenu(returnFocus = false) {
  if (!navigation || !menuButton) return;
  navigation.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Открыть меню');
  if (returnFocus) menuButton.focus();
}

if (menuButton && navigation) {
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

    if (link.origin === location.origin &&
        link.pathname === location.pathname &&
        link.hash) {
      let id;
      try {
        id = decodeURIComponent(link.hash.slice(1));
      } catch {
        return;
      }
      const destination = document.getElementById(id);
      if (destination) {
        destination.setAttribute('tabindex', '-1');
        destination.focus({ preventScroll: true });
      }
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
      closeMenu(true);
    }
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.header')) closeMenu();
  });

  desktop.addEventListener('change', () => closeMenu());
}

/* Final visual overrides.
   Kept in JS so the existing styles.css does not need to be replaced. */
const finalStyle = document.createElement('style');
finalStyle.textContent = `
  /* Hero: real product assets */
  .mini-check.has-image {
    height: 176px !important;
    padding: 0 !important;
    overflow: hidden !important;
  }

  .mini-check.has-image > img {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    object-position: top center !important;
  }

  .drawing.has-image > img {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    object-position: 61% 32% !important;
  }

  .book.has-image > img {
    width: 100% !important;
    height: 100% !important;
    object-fit: contain !important;
    object-position: center !important;
  }

  /* Main CHECK must remain readable and complete */
  .check-window.has-image > img {
    width: 100% !important;
    height: auto !important;
    max-height: none !important;
    object-fit: contain !important;
    object-position: top center !important;
  }

  /* Real booklet previews */
  .preview-media.has-image > img {
    width: 100% !important;
    height: 100% !important;
    object-fit: contain !important;
    object-position: center top !important;
  }

  /* Author */
  .author-photo {
    width: 100%;
    max-width: 360px;
    aspect-ratio: 4 / 5;
    overflow: hidden;
    border-radius: 8px;
    background: #101e32;
    box-shadow: 0 18px 45px rgba(16, 30, 50, .14);
    margin-inline: auto;
  }

  .author-photo img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
  }

  @media (max-width: 600px) {
    .mini-check.has-image {
      height: 148px !important;
    }

    .author-photo {
      max-width: 330px;
    }
  }
`;
document.head.appendChild(finalStyle);

/* Update small bits of stale v2 copy once real files are present. */
const formats = document.querySelector('.hero .formats');
if (formats) {
  formats.textContent = 'PDF + КЧП CHECK (.XLSM) + проектные примеры';
}

/* Checkout remains a safe placeholder until payment is connected. */
const checkoutButton = document.querySelector('[data-checkout]');
if (checkoutButton) {
  checkoutButton.addEventListener('click', (event) => {
    event.preventDefault();
    const note = document.querySelector('#payment-note');
    if (!note) return;

    note.textContent =
      'Покупка пока недоступна: оплата еще не подключена. Порядок получения файлов будет указан до начала продаж.';
    note.classList.add('is-active');
    note.focus({ preventScroll: true });
  });
}

/* Real assets progressively replace fallbacks. */
const mediaSlots = [...document.querySelectorAll('[data-media]')];

function refreshStaleCaptions() {
  const previewSlots = [...document.querySelectorAll('#previews [data-preview]')];
  const previewNote = document.querySelector('.preview-note');

  if (previewNote && previewSlots.length &&
      previewSlots.every((slot) => slot.classList.contains('has-image'))) {
    previewNote.hidden = true;
  }

  const heroSlots = [...document.querySelectorAll('.product-visual [data-media]')];
  const heroCaption = document.querySelector('.product-visual > figcaption');

  if (heroCaption && heroSlots.length &&
      heroSlots.every((slot) => slot.classList.contains('has-image'))) {
    heroCaption.hidden = true;
  }
}

mediaSlots.forEach((slot) => {
  const img = slot.querySelector('img');
  const fallback = slot.querySelector('.media-fallback');
  const caption = slot.querySelector('[data-media-caption]');

  if (!img || !fallback) return;

  const initialCaption = caption?.textContent;

  const update = () => {
    const loaded = img.complete && img.naturalWidth > 0;

    img.hidden = !loaded;
    fallback.hidden = loaded;
    slot.classList.toggle('has-image', loaded);

    if (caption) {
      caption.textContent =
        loaded && caption.dataset.loadedCaption
          ? caption.dataset.loadedCaption
          : initialCaption;
    }

    refreshStaleCaptions();
  };

  img.addEventListener('load', update);
  img.addEventListener('error', update);
  update();
});

/* Image priorities */
const heroCover = document.querySelector('.book > img');
if (heroCover) {
  heroCover.loading = 'eager';
  heroCover.decoding = 'async';
  heroCover.setAttribute('fetchpriority', 'high');
}

document.querySelectorAll('img').forEach((img) => {
  if (img !== heroCover) {
    img.loading = 'lazy';
    img.decoding = 'async';
  }
});

/* Author photo.
   If assets/author.webp is unavailable, existing initials remain. */
const authorFallback = document.querySelector('#author .author-monogram');

if (authorFallback) {
  const authorImage = new Image();
  authorImage.src = 'assets/author.webp';
  authorImage.alt = 'Ришат Зарипов — инженер-проектировщик ОВиК/ВК';
  authorImage.loading = 'lazy';
  authorImage.decoding = 'async';
  authorImage.width = 800;
  authorImage.height = 1000;

  authorImage.addEventListener('load', () => {
    const frame = document.createElement('div');
    frame.className = 'author-photo';
    frame.appendChild(authorImage);
    authorFallback.replaceWith(frame);
  });
}

/* Lightbox */
const dialog = document.querySelector('#preview-dialog');
const enlargedImage = document.querySelector('#lightbox-image');
const enlargedPlaceholder = document.querySelector('#lightbox-placeholder');
const dialogTitle = document.querySelector('#lightbox-title');
let previewTrigger = null;

if (
  dialog &&
  enlargedImage &&
  enlargedPlaceholder &&
  dialogTitle &&
  typeof dialog.showModal === 'function'
) {
  document.querySelectorAll('[data-preview]').forEach((button) => {
    button.disabled = false;

    button.addEventListener('click', () => {
      previewTrigger = button;

      const source = button.querySelector('img');
      const heading = button.closest('article')?.querySelector('h3');
      if (!source) return;

      dialogTitle.textContent = heading?.textContent || 'Превью';

      const available = source.complete && source.naturalWidth > 0;

      enlargedImage.hidden = !available;
      enlargedPlaceholder.hidden = available;
      enlargedImage.alt = source.alt;

      if (available) {
        enlargedImage.src = source.currentSrc || source.src;
      } else {
        enlargedImage.removeAttribute('src');
      }

      dialog.showModal();
      document.documentElement.classList.add('lightbox-open');
    });
  });

  const closeButton = dialog.querySelector('.lightbox-close');

  closeButton?.addEventListener('click', () => dialog.close());

  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'Tab' && closeButton) {
      event.preventDefault();
      closeButton.focus();
    }
  });

  dialog.addEventListener('click', (event) => {
    if (
      event.target === dialog ||
      event.target === dialog.querySelector('.lightbox-content')
    ) {
      dialog.close();
    }
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
