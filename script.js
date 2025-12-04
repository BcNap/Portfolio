// ============================================
// BACKGROUND SHAPES
// ============================================
function createBackgroundShapes() {
    const bgShapes = document.createElement('div');
    bgShapes.className = 'bg-shapes';
    
    for (let i = 1; i <= 2; i++) {
        const shape = document.createElement('div');
        shape.className = `shape shape-${i}`;
        bgShapes.appendChild(shape);
    }
    
    document.body.insertBefore(bgShapes, document.body.firstChild);
}

createBackgroundShapes();

// ============================================
// MOBILE NAVIGATION
// ============================================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ============================================
// ACTIVE NAVIGATION LINK
// ============================================
const sections = document.querySelectorAll('section');

function updateActiveNav() {
    const scrollPosition = window.pageYOffset + 150;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNav);
updateActiveNav();

// ============================================
// SMOOTH SCROLL WITH CUSTOM OFFSETS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const targetId = target.getAttribute('id');
            let offsetTop;
            
            // Different offsets for different sections
            if (targetId === 'about') {
                offsetTop = target.offsetTop - 100;
            } else if (targetId === 'experience') {
                offsetTop = target.offsetTop - 0;
            } else if (targetId === 'skills') {
                offsetTop = target.offsetTop - 0;
            } else if (targetId === 'projects') {
                offsetTop = target.offsetTop - 0;
            } else if (targetId === 'contact') {
                offsetTop = target.offsetTop - 0;
            } else {
                offsetTop = target.offsetTop - 0;
            }
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

const fadeElements = document.querySelectorAll('.skill-card, .project-card, .about-text, .contact-card, .experience-card');
fadeElements.forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// ============================================
// TYPING EFFECT FOR HERO
// ============================================
const heroSubtitle = document.querySelector('.hero-subtitle');
const subtitleText = heroSubtitle.textContent;
let charIndex = 0;

function typeWriter() {
    if (charIndex === 0) {
        heroSubtitle.textContent = '';
    }
    
    if (charIndex < subtitleText.length) {
        heroSubtitle.textContent += subtitleText.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, 80);
    }
}

window.addEventListener('load', () => {
    setTimeout(typeWriter, 600);
});

// ============================================
// PARALLAX EFFECT FOR SHAPES
// ============================================
window.addEventListener('scroll', () => {
    if (window.innerWidth > 768) {
        const scrolled = window.pageYOffset;
        const shapes = document.querySelectorAll('.shape');
        
        shapes.forEach((shape, index) => {
            const speed = 0.05 + (index * 0.02);
            shape.style.transform = `translate(0, ${scrolled * speed}px)`;
        });
    }
});

// ============================================
// SMOOTH PAGE LOAD
// ============================================
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.5s ease';
});

// ============================================
// MOBILE PERFORMANCE OPTIMIZATION
// ============================================
if (window.innerWidth <= 768) {
    const style = document.createElement('style');
    style.textContent = `
        * {
            transition-duration: 0.2s !important;
            animation-duration: 0.5s !important;
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// FALLING LIGHT BEAMS BACKGROUND
// ============================================
const beamsCanvas = document.getElementById('fallingBeams');
const ctx = beamsCanvas.getContext('2d');

let width, height;

function resize() {
    width = beamsCanvas.width = window.innerWidth;
    height = beamsCanvas.height = window.innerHeight;
}

resize();
window.addEventListener('resize', resize);

const beams = [];
const beamCount = window.innerWidth < 768 ? 25 : 50;

class Beam {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.x = Math.random() * width;
        this.y = -200 - Math.random() * 500;
        this.length = 100 + Math.random() * 200;
        this.speed = 2 + Math.random() * 4;
        this.thickness = 1 + Math.random() * 2;
        this.opacity = 0.3 + Math.random() * 0.4;
        this.angle = Math.PI / 2;
    }
    
    update() {
        this.y += this.speed;
        if (this.y > height + 200) this.reset();
    }
    
    draw() {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
            this.x + Math.cos(this.angle) * this.length,
            this.y + Math.sin(this.angle) * this.length
        );
        
        const gradient = ctx.createLinearGradient(
            this.x, 
            this.y, 
            this.x + Math.cos(this.angle) * this.length,
            this.y + Math.sin(this.angle) * this.length
        );
        
        gradient.addColorStop(0, `rgba(0, 102, 255, ${this.opacity})`);
        gradient.addColorStop(1, `rgba(0, 204, 255, 0)`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.thickness;
        ctx.stroke();
    }
}

for (let i = 0; i < beamCount; i++) {
    beams.push(new Beam());
}

function animateBeams() {
    ctx.clearRect(0, 0, width, height);
    beams.forEach(beam => {
        beam.update();
        beam.draw();
    });
    requestAnimationFrame(animateBeams);
}

animateBeams();

// ============================================
// PROJECT IMAGE SLIDESHOW
// ============================================
function initProjectSlideshows() {
    const slideshows = document.querySelectorAll('.project-slideshow');
    
    slideshows.forEach((slideshow, index) => {
        const slides = slideshow.querySelectorAll('.slide');
        const dotsContainer = slideshow.parentElement.querySelector('.slideshow-dots');
        const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];
        let currentSlide = 0;
        
        if (slides.length <= 1) return;
        
        // Auto-advance slides every 3 seconds
        setInterval(() => {
            // Remove active from current
            slides[currentSlide].classList.remove('active');
            if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
            
            // Move to next slide
            currentSlide = (currentSlide + 1) % slides.length;
            
            // Add active to new current
            slides[currentSlide].classList.add('active');
            if (dots[currentSlide]) dots[currentSlide].classList.add('active');
        }, 3000);
        
        // Click on dots to navigate
        dots.forEach((dot, dotIndex) => {
            dot.addEventListener('click', () => {
                slides[currentSlide].classList.remove('active');
                dots[currentSlide].classList.remove('active');
                
                currentSlide = dotIndex;
                
                slides[currentSlide].classList.add('active');
                dots[currentSlide].classList.add('active');
            });
        });
    });
}

// Initialize slideshows after DOM loads
document.addEventListener('DOMContentLoaded', initProjectSlideshows);