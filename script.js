// ===================================
// DREAMERS BAY PRESCHOOL & DAYCARE
// Modern Professional JavaScript
// ===================================

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 1000,
        easing: 'ease-out-cubic',
        once: true,
        offset: 100,
        delay: 100
    });
});

// ===================================
// NAVIGATION
// ===================================

const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile menu
if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking a nav link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Close mobile menu when clicking the close button (X)
if (navMenu) {
    navMenu.addEventListener('click', (e) => {
        // Check if click is on the ::before pseudo-element area (close button)
        const rect = navMenu.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Close button is at top-right (within 60px from top and right)
        if (y < 60 && x > rect.width - 60) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Navbar scroll effect with shadow
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ===================================
// ACTIVE NAVIGATION LINK
// ===================================

const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ===================================
// SMOOTH SCROLL
// ===================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// ANIMATED COUNTER
// ===================================

const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    const suffix = element.textContent.includes('%') ? '%' : '';
    
    const updateCounter = () => {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + suffix;
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + suffix;
        }
    };
    
    updateCounter();
};

// ===================================
// INTERSECTION OBSERVER FOR COUNTERS
// ===================================

const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            const target = parseInt(entry.target.getAttribute('data-target'));
            animateCounter(entry.target, target);
            entry.target.classList.add('counted');
        }
    });
}, observerOptions);

// Observe all stat numbers
document.querySelectorAll('.stat-number').forEach(stat => {
    statsObserver.observe(stat);
});

// ===================================
// GALLERY MODAL
// ===================================

const modal = document.getElementById('galleryModal');
const modalImg = document.getElementById('modalImage');
const modalCaption = document.getElementById('modalCaption');
const closeBtn = document.querySelector('.modal-close');
const prevBtn = document.querySelector('.modal-prev');
const nextBtn = document.querySelector('.modal-next');
const galleryItems = document.querySelectorAll('.gallery-item');

let currentImageIndex = 0;
const imageArray = Array.from(galleryItems);

// Open modal
galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        modal.style.display = 'block';
        currentImageIndex = index;
        updateModalImage();
        document.body.style.overflow = 'hidden';
    });
});

// Update modal image
function updateModalImage() {
    const currentItem = imageArray[currentImageIndex];
    const imgSrc = currentItem.querySelector('img').src;
    const imgAlt = currentItem.querySelector('img').alt;
    
    // Add fade effect
    modalImg.style.opacity = '0';
    setTimeout(() => {
        modalImg.src = imgSrc;
        modalCaption.textContent = imgAlt;
        modalImg.style.opacity = '1';
    }, 200);
}

// Close modal
if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
}

// Close modal when clicking outside
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Previous image
if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentImageIndex = (currentImageIndex - 1 + imageArray.length) % imageArray.length;
        updateModalImage();
    });
}

// Next image
if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentImageIndex = (currentImageIndex + 1) % imageArray.length;
        updateModalImage();
    });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (modal && modal.style.display === 'block') {
        if (e.key === 'Escape') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        } else if (e.key === 'ArrowLeft') {
            currentImageIndex = (currentImageIndex - 1 + imageArray.length) % imageArray.length;
            updateModalImage();
        } else if (e.key === 'ArrowRight') {
            currentImageIndex = (currentImageIndex + 1) % imageArray.length;
            updateModalImage();
        }
    }
});

// Touch swipe support for modal
let touchStartX = 0;
let touchEndX = 0;

if (modal) {
    modal.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    modal.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
}

function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
        // Swipe left - next image
        currentImageIndex = (currentImageIndex + 1) % imageArray.length;
        updateModalImage();
    }
    if (touchEndX > touchStartX + 50) {
        // Swipe right - previous image
        currentImageIndex = (currentImageIndex - 1 + imageArray.length) % imageArray.length;
        updateModalImage();
    }
}

// ===================================
// CONTACT FORM
// ===================================

const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const childName = document.getElementById('childName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const age = document.getElementById('age').value;
        const program = document.getElementById('program').value;
        const message = document.getElementById('message').value;
        
        // Validate form
        if (name && childName && email && phone && age && program && message) {
            // Show success message
            formMessage.className = 'form-message success';
            formMessage.innerHTML = '<i class="fas fa-check-circle"></i> Thank you for your interest! We will contact you shortly to discuss admission details.';
            
            // Reset form
            contactForm.reset();
            
            // Scroll to message
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Hide message after 8 seconds
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 8000);
            
            // In real application, send data to server
            console.log('Enquiry submitted:', { 
                name, 
                childName, 
                email, 
                phone, 
                age, 
                program, 
                message 
            });
        } else {
            // Show error message
            formMessage.className = 'form-message error';
            formMessage.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please fill in all fields to submit your enquiry.';
            
            // Hide message after 5 seconds
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }
    });
}

// ===================================
// SCROLL TO TOP BUTTON
// ===================================

const scrollTopBtn = document.getElementById('scrollTop');

if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===================================
// PARALLAX EFFECT
// ===================================

window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (hero && window.innerWidth > 768) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
    
    if (heroContent && window.innerWidth > 768) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// ===================================
// LAZY LOADING IMAGES
// ===================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px'
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===================================
// FORM INPUT ANIMATIONS
// ===================================

const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
formInputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
        if (!input.value) {
            input.parentElement.classList.remove('focused');
        }
    });
    
    // Check if field has value on load
    if (input.value) {
        input.parentElement.classList.add('focused');
    }
});

// ===================================
// PRELOAD GALLERY IMAGES
// ===================================

const preloadImages = () => {
    galleryItems.forEach(item => {
        const img = new Image();
        img.src = item.querySelector('img').src;
    });
};

window.addEventListener('load', preloadImages);

// ===================================
// PROGRAM CARDS HOVER EFFECT
// ===================================

const programCards = document.querySelectorAll('.program-card');
programCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// ===================================
// ADD RIPPLE EFFECT TO BUTTONS
// ===================================

const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ripple.style.cssText = `
            position: absolute;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: translate(-50%, -50%) scale(0);
            animation: ripple 0.6s ease-out;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
        `;
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: translate(-50%, -50%) scale(20);
            opacity: 0;
        }
    }
    
    .modal-content {
        transition: opacity 0.3s ease;
    }
    
    img.loaded {
        animation: fadeInImage 0.6s ease;
    }
    
    @keyframes fadeInImage {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// ===================================
// TYPING EFFECT FOR HERO SUBTITLE
// ===================================

const typingText = document.querySelector('.typing-text');
if (typingText && window.innerWidth > 768) {
    const text = typingText.textContent;
    typingText.textContent = '';
    typingText.style.borderRight = '2px solid white';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            typingText.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        } else {
            setTimeout(() => {
                typingText.style.borderRight = 'none';
            }, 1000);
        }
    };
    
    // Start typing after page load
    setTimeout(typeWriter, 1000);
}

// ===================================
// CONSOLE MESSAGE
// ===================================

console.log('%c🚢 Welcome to Dreamers Bay! ', 'background: linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 100%); color: white; font-size: 20px; padding: 10px 20px; border-radius: 5px;');
console.log('%cWhere Little Dreams Set Sail ⛵', 'color: #FF6B9D; font-size: 14px; font-weight: bold;');
console.log('Total Gallery Images:', galleryItems.length);
console.log('Website loaded successfully! ✨');

// ===================================
// PAGE LOAD ANIMATION
// ===================================

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Refresh AOS after content loads
    setTimeout(() => {
        AOS.refresh();
    }, 500);
});

// ===================================
// PREVENT MODAL IMAGE DRAGGING
// ===================================

if (modalImg) {
    modalImg.addEventListener('dragstart', (e) => {
        e.preventDefault();
    });
}

// ===================================
// ACCESSIBILITY IMPROVEMENTS
// ===================================

// Add keyboard navigation for gallery
galleryItems.forEach((item, index) => {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `View image ${index + 1}`);
    
    item.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            item.click();
        }
    });
});

// ===================================
// MOBILE OPTIMIZATIONS
// ===================================

// Detect if user is on mobile
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

if (isMobile) {
    // Disable parallax on mobile for better performance
    window.removeEventListener('scroll', () => {});
    
    // Optimize touch interactions
    document.body.classList.add('mobile');
}

// ===================================
// PERFORMANCE MONITORING
// ===================================

if (window.performance) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`⚡ Page loaded in ${pageLoadTime}ms`);
    });
}
