const triggerImages = document.querySelectorAll('.project-gallery a, .project-figure a, .project-image');
const lightbox = document.querySelector('.image-lightbox');
const lightboxImage = document.querySelector('.image-lightbox img');
const closeButton = document.querySelector('.image-lightbox-close');

if (lightbox && lightboxImage) {
  const openLightbox = (imageSource, altText) => {
    lightboxImage.src = imageSource;
    lightboxImage.alt = altText || 'Project image';
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    closeButton?.focus();
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    lightboxImage.src = '';
  };

  triggerImages.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      const anchor = event.currentTarget;
      const image = anchor.querySelector('img') || anchor;
      const source = anchor.href || image.src || anchor.dataset.src;
      const alt = image.getAttribute('alt') || '';

      if (source) {
        event.preventDefault();
        openLightbox(source, alt);
      }
    });
  });

  closeButton?.addEventListener('click', closeLightbox);
  lightboxImage.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (!lightbox.hidden && event.key === 'Escape') {
      closeLightbox();
    }
  });
}
