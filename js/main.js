// ====================================
// BobWich Main JavaScript
// Navigation, scroll effects, and utilities
// ====================================

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', () => {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const header = document.getElementById('header');

    // Mobile menu toggle
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            // Update aria-expanded for accessibility
            const isExpanded = navMenu.classList.contains('active');
            mobileToggle.setAttribute('aria-expanded', isExpanded);
        });

        // Keyboard support for accessibility (Enter and Space keys)
        mobileToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                mobileToggle.click();
            }
        });

        // Close mobile menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Header scroll effect
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = target.offsetTop - headerHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Animate elements on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.card, .testimonial-card, .about-content, .value-card, .stat-card');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach(el => observer.observe(el));
    };

    animateOnScroll();

    // Active page indicator in navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});

// Utility: Show notification
// Unified styling with cart.js for consistent UX (bottom center)
function showNotification(message, type = 'success') {
    // Remove existing notifications (from both main.js and cart.js)
    const existingNotifications = document.querySelectorAll('.notification, .cart-notification');
    existingNotifications.forEach(notif => notif.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Consistent bottom-center styling (unified with cart.js)
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#28A745' : '#DC3545'};
        color: white;
        padding: 15px 30px;
        border-radius: 50px;
        font-size: 16px;
        font-weight: 600;
        z-index: 99999;
        animation: slideUpNotif 0.3s ease;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
    `;

    document.body.appendChild(notification);

    // Remove after delay
    setTimeout(() => {
        notification.style.animation = 'slideDownNotif 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUpNotif {
        from { transform: translateX(-50%) translateY(100px); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    @keyframes slideDownNotif {
        from { transform: translateX(-50%) translateY(0); opacity: 1; }
        to { transform: translateX(-50%) translateY(100px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Contact form handler (for contact page)
function handleContactForm(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    // Get form values
    const name = formData.get('name') || '';
    const phone = formData.get('phone') || '';
    const email = formData.get('email') || '';
    const subject = formData.get('subject') || '';
    const message = formData.get('message') || '';

    // Map subject values to Arabic text
    const subjectMap = {
        'order': 'استفسار عن طلب',
        'feedback': 'ملاحظات',
        'complaint': 'شكوى',
        'suggestion': 'اقتراح',
        'other': 'آخر'
    };
    const subjectText = subjectMap[subject] || subject;

    // Build WhatsApp message
    let whatsappMessage = `*رسالة جديدة من موقع بوب ويتش*\n\n`;
    whatsappMessage += `*الاسم:* ${name}\n`;
    whatsappMessage += `*رقم التليفون:* ${phone}\n`;
    if (email) {
        whatsappMessage += `*الإيميل:* ${email}\n`;
    }
    whatsappMessage += `*الموضوع:* ${subjectText}\n`;
    whatsappMessage += `*الرسالة:*\n${message}`;

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(whatsappMessage);

    // WhatsApp phone number (for inquiries/feedback)
    const whatsappNumber = '201556311496';

    // Open WhatsApp with the message (fallback to same tab if blocked)
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    const popup = window.open(whatsappUrl, '_blank');
    if (!popup) {
        window.location.href = whatsappUrl;
    }

    // Show notification and reset form
    showNotification('تم فتح الواتساب! أرسل الرسالة لإكمال التواصل.', 'success');
    form.reset();
}

console.log('بوب ويتش - تم تحميل الموقع بنجاح!');
