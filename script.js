// ============================================
// BACKGROUND SHAPES
// ============================================
(function () {
    var wrap = document.createElement('div');
    wrap.className = 'bg-shapes';
    for (var i = 1; i <= 2; i++) {
        var s = document.createElement('div');
        s.className = 'shape shape-' + i;
        wrap.appendChild(s);
    }
    document.body.insertBefore(wrap, document.body.firstChild);
}());

// ============================================
// DARK MODE TOGGLE
// ============================================
var themeToggle = document.getElementById('themeToggle');

function applyTheme(dark) {
    document.body.classList.toggle('dark-mode', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
}

var savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    applyTheme(savedTheme === 'dark');
} else {
    applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches);
}

themeToggle.addEventListener('click', function () {
    applyTheme(!document.body.classList.contains('dark-mode'));
});

// ============================================
// BACK TO TOP
// ============================================
var backBtn = document.getElementById('backToTop');

window.addEventListener('scroll', function () {
    backBtn.classList.toggle('visible', window.pageYOffset > 400);
});

backBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================
// MOBILE NAVIGATION
// ============================================
var hamburger = document.querySelector('.hamburger');
var navMenu   = document.querySelector('.nav-menu');
var navLinks  = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

document.addEventListener('click', function (e) {
    if (!e.target.closest('.navbar')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
var navbar = document.querySelector('.navbar');

window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.pageYOffset > 50);
});

// ============================================
// ACTIVE NAVIGATION LINK
// ============================================
var sections = document.querySelectorAll('section');

function updateActiveNav() {
    var scrollY = window.pageYOffset + 160;
    sections.forEach(function (sec) {
        if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
            navLinks.forEach(function (link) {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + sec.id) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNav);
updateActiveNav();

// ============================================
// SMOOTH SCROLL WITH OFFSET
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
            var offset = target.id === 'about' ? 100 : 0;
            window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
        }
    });
});

// ============================================
// INTERSECTION OBSERVER — FADE IN
// ============================================
var fadeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll(
    '.skill-card, .project-card, .about-text, .contact-card, ' +
    '.experience-card, .education-card, .competition-card'
).forEach(function (el) {
    el.classList.add('fade-in');
    fadeObserver.observe(el);
});

// ============================================
// TYPING EFFECT FOR HERO SUBTITLE
// ============================================
var heroSubtitle = document.querySelector('.hero-subtitle');
var subtitleText = heroSubtitle.textContent;
var charIndex    = 0;

function typeWriter() {
    if (charIndex === 0) heroSubtitle.textContent = '';
    if (charIndex < subtitleText.length) {
        heroSubtitle.textContent += subtitleText.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, 75);
    }
}

window.addEventListener('load', function () {
    setTimeout(typeWriter, 700);
});

// ============================================
// PARALLAX FOR BG SHAPES
// ============================================
window.addEventListener('scroll', function () {
    if (window.innerWidth <= 768) return;
    var scrolled = window.pageYOffset;
    document.querySelectorAll('.shape').forEach(function (shape, i) {
        shape.style.transform = 'translate(0, ' + (scrolled * (0.05 + i * 0.02)) + 'px)';
    });
});

// ============================================
// SMOOTH PAGE LOAD
// ============================================
window.addEventListener('load', function () {
    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.5s ease';
});

// ============================================
// MOBILE PERFORMANCE OPTIMIZATION
// ============================================
if (window.innerWidth <= 768) {
    var perfStyle = document.createElement('style');
    perfStyle.textContent = '* { transition-duration: 0.2s !important; animation-duration: 0.5s !important; }';
    document.head.appendChild(perfStyle);
}

// ============================================
// FALLING LIGHT BEAMS BACKGROUND
// ============================================
var beamsCanvas = document.getElementById('fallingBeams');
var ctx         = beamsCanvas.getContext('2d');
var W, H;

function resizeCanvas() {
    W = beamsCanvas.width  = window.innerWidth;
    H = beamsCanvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function Beam() { this.reset(true); }

Beam.prototype.reset = function (initial) {
    this.x     = Math.random() * W;
    this.y     = initial ? Math.random() * H : -200 - Math.random() * 400;
    this.len   = 80  + Math.random() * 160;
    this.speed = 1.5 + Math.random() * 3;
    this.thick = 0.6 + Math.random() * 1.6;
    this.alpha = 0.18 + Math.random() * 0.28;
};

Beam.prototype.update = function () {
    this.y += this.speed;
    if (this.y > H + 200) this.reset(false);
};

Beam.prototype.draw = function () {
    var y2 = this.y + this.len;
    var g  = ctx.createLinearGradient(this.x, this.y, this.x, y2);
    g.addColorStop(0, 'rgba(0, 102, 255, ' + this.alpha + ')');
    g.addColorStop(1, 'rgba(0, 204, 255, 0)');
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x, y2);
    ctx.strokeStyle = g;
    ctx.lineWidth   = this.thick;
    ctx.stroke();
};

var beamCount = window.innerWidth < 768 ? 20 : 45;
var beams     = [];
for (var b = 0; b < beamCount; b++) beams.push(new Beam());

function animateBeams() {
    ctx.clearRect(0, 0, W, H);
    beams.forEach(function (beam) { beam.update(); beam.draw(); });
    requestAnimationFrame(animateBeams);
}

animateBeams();

// ============================================
// PROJECT IMAGE SLIDESHOW
// ============================================
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.project-slideshow').forEach(function (slideshow) {
        var slides  = slideshow.querySelectorAll('.slide');
        if (slides.length <= 1) return;
        var current = 0;
        setInterval(function () {
            slides[current].classList.remove('active');
            current = (current + 1) % slides.length;
            slides[current].classList.add('active');
        }, 3000);
    });
});