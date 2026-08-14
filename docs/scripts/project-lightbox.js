(function(){
  const lightbox = document.querySelector('.image-lightbox');
  if(!lightbox){ return; }

  const gallery = document.querySelector('.project-gallery');
  const projectImage = document.querySelector('.project-image');
  const lightboxImage = lightbox.querySelector('img');
  const closeButton = lightbox.querySelector('.image-lightbox-close');
  const imageLinks = gallery ? gallery.querySelectorAll('a') : [projectImage];

  function closeLightbox(){
    lightbox.hidden = true;
    lightboxImage.removeAttribute('src');
    lightboxImage.alt = '';
    document.body.style.overflow = '';
  }

  imageLinks.forEach(function(link){
    if(!link){ return; }

    link.addEventListener('click', function(event){
      event.preventDefault();
      const thumbnail = link.querySelector('img');
      lightboxImage.src = link.href;
      lightboxImage.alt = thumbnail ? thumbnail.alt : link.getAttribute('aria-label') || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
    });
  });

  closeButton.addEventListener('click', closeLightbox);
  lightboxImage.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function(event){
    if(event.target === lightbox){ closeLightbox(); }
  });
  document.addEventListener('keydown', function(event){
    if(event.key === 'Escape' && !lightbox.hidden){ closeLightbox(); }
  });

  closeLightbox();
})();
