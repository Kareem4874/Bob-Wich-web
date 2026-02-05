// ====================================
// BobWich Menu Page
// Category filtering, menu interactions, and lightbox gallery
// ====================================

// Menu images data for lightbox navigation
const menuImages = [
  { src: './menu 7.PNG', caption: 'ساندويتشات الدجاج' },
  { src: './menu 6.PNG', caption: 'ساندويتشات اللحوم والبرجر' },
  { src: './menu 5.PNG', caption: 'سبيشيال برجر والمشروبات' },
  { src: './menu 4.PNG', caption: 'سناكس وساندويتشات الفارم' },
  { src: './menu 3.PNG', caption: 'ميكسات الفارم' },
  { src: './menu 1.PNG', caption: 'المنيو الكامل 1' },
  { src: './menu 2.PNG', caption: 'المنيو الكامل 2' }
];

let currentImageIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
  // Category filtering
  const categoryButtons = document.querySelectorAll('.category-btn');
  const menuItems = document.querySelectorAll('.menu-item');

  if (categoryButtons.length > 0) {
    categoryButtons.forEach(button => {
      button.addEventListener('click', () => {
        const category = button.getAttribute('data-category');

        // Update active button
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Filter menu items
        menuItems.forEach(item => {
          const itemCategory = item.getAttribute('data-category');

          if (category === 'all' || itemCategory === category) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, 10);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });

        // Scroll to menu items section
        const firstVisibleItem = document.querySelector('.menu-item:not([style*="display: none"])');
        if (firstVisibleItem && category !== 'all') {
          const headerHeight = document.getElementById('header')?.offsetHeight || 0;
          const filterHeight = document.querySelector('.menu-categories')?.offsetHeight || 0;
          const targetPosition = firstVisibleItem.offsetTop - headerHeight - filterHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('lightboxModal');
    if (modal && modal.classList.contains('active')) {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        // ArrowRight = next, ArrowLeft = prev (for RTL, we swap them)
        const direction = e.key === 'ArrowLeft' ? 1 : -1;
        navigateLightbox(direction);
      }
    }
  });
});

// Open Lightbox - fullscreen image viewer
function openLightbox(imageSrc, caption) {
  const modal = document.getElementById('lightboxModal');
  const image = document.getElementById('lightboxImage');
  const captionText = document.getElementById('lightboxCaption');
  const counterText = document.getElementById('lightboxCounter');

  // Find current image index
  currentImageIndex = menuImages.findIndex(img => img.src === imageSrc);
  if (currentImageIndex === -1) currentImageIndex = 0;

  if (modal && image) {
    image.src = imageSrc;
    captionText.textContent = caption || '';
    counterText.textContent = `${currentImageIndex + 1} / ${menuImages.length}`;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

// Navigate Lightbox - move to prev/next image
function navigateLightbox(direction) {
  currentImageIndex += direction;

  // Loop around
  if (currentImageIndex < 0) {
    currentImageIndex = menuImages.length - 1;
  } else if (currentImageIndex >= menuImages.length) {
    currentImageIndex = 0;
  }

  const image = document.getElementById('lightboxImage');
  const captionText = document.getElementById('lightboxCaption');
  const counterText = document.getElementById('lightboxCounter');

  if (image && menuImages[currentImageIndex]) {
    // Add fade animation
    image.style.opacity = '0';
    image.style.transform = 'scale(0.95)';

    setTimeout(() => {
      image.src = menuImages[currentImageIndex].src;
      captionText.textContent = menuImages[currentImageIndex].caption;
      counterText.textContent = `${currentImageIndex + 1} / ${menuImages.length}`;

      image.style.opacity = '1';
      image.style.transform = 'scale(1)';
    }, 150);
  }
}

// Close Lightbox
function closeLightbox() {
  const modal = document.getElementById('lightboxModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.navigateLightbox = navigateLightbox;

// Open Product Image Lightbox (for individual menu items)
function openProductImage(imageSrc, caption) {
  const modal = document.getElementById('lightboxModal');
  const image = document.getElementById('lightboxImage');
  const captionText = document.getElementById('lightboxCaption');
  const counterText = document.getElementById('lightboxCounter');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');

  if (modal && image) {
    image.src = imageSrc;
    if (captionText) captionText.textContent = caption || '';
    if (counterText) counterText.style.display = 'none'; // Hide counter for single image
    if (prevBtn) prevBtn.style.display = 'none'; // Hide navigation for single image
    if (nextBtn) nextBtn.style.display = 'none';

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

// Extended closeLightbox to restore navigation visibility
const originalCloseLightbox = closeLightbox;
window.closeLightbox = function () {
  const counterText = document.getElementById('lightboxCounter');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');

  // Restore visibility for menu images
  if (counterText) counterText.style.display = '';
  if (prevBtn) prevBtn.style.display = '';
  if (nextBtn) nextBtn.style.display = '';

  originalCloseLightbox();
};

window.openProductImage = openProductImage;

console.log('صفحة المنيو تم تحميلها بنجاح!');
