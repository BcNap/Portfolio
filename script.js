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
    recolorTechLogos(dark);
}

// A few brand colours are unreadable against one of the two backgrounds
// (Notion black, Django's dark green, JS yellow). Those pills carry
// data-light / data-dark overrides; everything else keeps its official
// brand colour, which the CDN serves by default.
function recolorTechLogos(dark) {
    document.querySelectorAll('.tech-logo').forEach(function (img) {
        var slug  = img.getAttribute('data-slug');
        var color = img.getAttribute(dark ? 'data-dark' : 'data-light');
        if (!slug) return;
        var next = 'https://cdn.simpleicons.org/' + slug + (color ? '/' + color : '');
        if (img.getAttribute('src') !== next) img.setAttribute('src', next);
    });
}

// If a logo 404s, drop the image so the lettermark underneath shows instead
document.querySelectorAll('.tech-logo').forEach(function (img) {
    img.addEventListener('error', function () { img.remove(); });
});

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
    '.project-card, .about-text, .contact-card, ' +
    '.experience-card, .education-card, .competition-card, ' +
    '.skills-intro, .skills-extra'
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
// Note: the marquee tracks are excluded so the carousel keeps its
// long loop duration instead of being forced down to 0.5s.
if (window.innerWidth <= 768) {
    var perfStyle = document.createElement('style');
    perfStyle.textContent =
        '*:not(.tech-track) { transition-duration: 0.2s !important; animation-duration: 0.5s !important; }';
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

// ============================================
// AI CHAT WIDGET
// ============================================
(function () {
    var fab       = document.getElementById('chatFab');
    var panel     = document.getElementById('chatPanel');
    var messages  = document.getElementById('chatMessages');
    var form      = document.getElementById('chatForm');
    var input     = document.getElementById('chatInput');
    var sendBtn   = form ? form.querySelector('.chat-send') : null;
    var suggBox   = document.getElementById('chatSuggestions');

    if (!fab || !panel || !form || !input) return;

    var history = []; // { role: 'user' | 'assistant', content: string }
    var isOpen  = false;
    var isSending = false;

    function toggle(open) {
        isOpen = open !== undefined ? open : !isOpen;
        fab.classList.toggle('active', isOpen);
        panel.classList.toggle('active', isOpen);
        fab.setAttribute('aria-expanded', String(isOpen));
        panel.setAttribute('aria-hidden', String(!isOpen));
        if (isOpen) setTimeout(function () { input.focus(); }, 250);
    }

    fab.addEventListener('click', function () { toggle(); });

    document.addEventListener('click', function (e) {
        if (isOpen && !e.target.closest('.chat-panel') && !e.target.closest('.chat-fab')) {
            toggle(false);
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && isOpen) toggle(false);
    });

    function appendMessage(role, text) {
        var el = document.createElement('div');
        el.className = 'chat-msg chat-msg--' + role;
        el.innerHTML = text; // fixed strings / escaped user text only, see below
        messages.appendChild(el);
        messages.scrollTop = messages.scrollHeight;
        return el;
    }

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function showTyping() {
        var el = document.createElement('div');
        el.className = 'chat-typing';
        el.id = 'chatTypingIndicator';
        el.innerHTML = '<span></span><span></span><span></span>';
        messages.appendChild(el);
        messages.scrollTop = messages.scrollHeight;
    }

    function hideTyping() {
        var el = document.getElementById('chatTypingIndicator');
        if (el) el.remove();
    }

    async function sendMessage(text) {
        text = text.trim();
        if (!text || isSending) return;

        if (suggBox) suggBox.classList.add('hidden');

        appendMessage('user', escapeHtml(text));
        history.push({ role: 'user', content: text });
        input.value = '';
        isSending = true;
        sendBtn.disabled = true;
        showTyping();

        try {
            var res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: history }),
            });

            var data = await res.json();
            hideTyping();

            if (!res.ok || !data.reply) {
                appendMessage('error', 'Something went wrong. Please try again, or email Nap Carlo directly.');
                return;
            }

            appendMessage('bot', escapeHtml(data.reply));
            history.push({ role: 'assistant', content: data.reply });
        } catch (err) {
            hideTyping();
            appendMessage('error', "Couldn't reach the server. Check your connection and try again.");
        } finally {
            isSending = false;
            sendBtn.disabled = false;
        }
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        sendMessage(input.value);
    });

    if (suggBox) {
        suggBox.querySelectorAll('.chat-suggestion').forEach(function (btn) {
            btn.addEventListener('click', function () { sendMessage(btn.textContent); });
        });
    }
})();