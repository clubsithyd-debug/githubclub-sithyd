/* ===============================
   LOADER ROUTING
   =============================== */

const LOADED_KEY = 'ghc_loader_done';
const path = window.location.pathname.toLowerCase();
const isIndexPage = /(^|\/)index\.html$/.test(path) || path.endsWith('/') || path.endsWith('/github') || path.endsWith('/github/');

const cameFromLoader   = sessionStorage.getItem(LOADED_KEY) === '1';
const sessionActive    = sessionStorage.getItem('ghc_session_active') === '1';
const navEntry         = performance.getEntriesByType('navigation')[0];
const navType          = navEntry?.type ?? 'navigate';

// Only show loader on a completely fresh visit — not back nav, not internal navigation
const isBackNav        = navType === 'back_forward';
const shouldShowLoader = isIndexPage && !cameFromLoader && !isBackNav && !sessionActive;

if (shouldShowLoader) {
    sessionStorage.removeItem(LOADED_KEY);
    window.location.replace('load.html');
}

// Clear flag so next reload triggers loader again, but only after a real navigation
if (cameFromLoader) {
    sessionStorage.removeItem(LOADED_KEY);
}

// Mark the session as active so other pages know we're already inside the site
sessionStorage.setItem('ghc_session_active', '1');

/* ===============================
   ELEMENTS
   =============================== */

const cursor = document.getElementById('custom-cursor');
const logoContainer = document.getElementById('logo-container');
const easterModal = document.getElementById('easter-modal');
const cmdInput = document.getElementById('cmd-input');

/* ===============================
   CUSTOM CURSOR
   =============================== */

document.addEventListener('mousemove', (e) => {
    if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
});

function attachCursorListeners() {
    document.querySelectorAll('.interactive:not(#logo-container):not(#logo-container *)').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
    });

    const logo = document.getElementById('logo-container');
    if (logo) {
        logo.addEventListener('mouseenter', () => cursor.classList.remove('cursor-hover'));
        logo.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
    }
}

/* ===============================
   TYPEWRITER EFFECT
   =============================== */

var TxtType = function (el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.isDeleting = false;
    setTimeout(() => this.tick(), 600);
};

TxtType.prototype.tick = function () {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];

    this.txt = this.isDeleting
        ? fullTxt.substring(0, this.txt.length - 1)
        : fullTxt.substring(0, this.txt.length + 1);

    this.el.querySelector('.wrap').textContent = this.txt;

    var delta = 140 - Math.random() * 60;
    if (this.isDeleting) delta /= 2;

    if (!this.isDeleting && this.txt === fullTxt) {
        delta = this.period;
        this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500;
    }

    setTimeout(() => this.tick(), delta);
};

/* ===============================
   COUNTDOWN TIMER
   =============================== */

function initCountdown() {
    const daysEl    = document.getElementById('days');
    const hoursEl   = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    const target = new Date("2026-04-24T00:00:00+05:30").getTime();
    const pad = n => String(n).padStart(2, "0");

    setInterval(() => {
        const d = target - Date.now();
        if (d <= 0) {
            daysEl.textContent = hoursEl.textContent = minutesEl.textContent = secondsEl.textContent = "00";
            return;
        }
        daysEl.textContent    = pad(Math.floor(d / 86400000));
        hoursEl.textContent   = pad(Math.floor(d / 3600000 % 24));
        minutesEl.textContent = pad(Math.floor(d / 60000 % 60));
        secondsEl.textContent = pad(Math.floor(d / 1000 % 60));
    }, 1000);
}

/* ===============================
   QUOTE ROTATION
   =============================== */

const quotes = [
    { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "— Harold Abelson" },
    { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "— Martin Fowler" },
    { text: "First, solve the problem. Then, write the code.", author: "— John Johnson" },
    { text: "Talk is cheap. Show me the code.", author: "— Linus Torvalds" },
    { text: "The best error message is the one that never shows up.", author: "— Thomas Fuchs" },
    { text: "Simplicity is the soul of efficiency.", author: "— Austin Freeman" },
    { text: "Make it work, make it right, make it fast.", author: "— Kent Beck" },
    { text: "Sometimes it pays to stay in bed on Monday, rather than spending the rest of the week debugging Monday's code.", author: "— Dan Salomon" },
    { text: "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.", author: "— Antoine de Saint-Exupéry" },
    { text: "Code is like humor. When you have to explain it, it's bad.", author: "— Cory House" },
];

let currentQuote = 0;

function initQuoteRotation() {
    const quoteText   = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');
    if (!quoteText || !quoteAuthor) return;

    function rotateQuote() {
        // Slide up + fade out
        quoteText.style.transition   = 'opacity 1s ease, transform 1s ease';
        quoteAuthor.style.transition = 'opacity 1s ease, transform 1s ease';
        quoteText.style.opacity      = '0';
        quoteText.style.transform    = 'translateY(-20px)';
        quoteAuthor.style.opacity    = '0';
        quoteAuthor.style.transform  = 'translateY(-20px)';

        setTimeout(() => {
            currentQuote = (currentQuote + 1) % quotes.length;
            quoteText.textContent   = `"${quotes[currentQuote].text}"`;
            quoteAuthor.textContent = quotes[currentQuote].author;

            // Reset below instantly, then slide up + fade in
            quoteText.style.transition   = 'none';
            quoteAuthor.style.transition = 'none';
            quoteText.style.transform    = 'translateY(20px)';
            quoteAuthor.style.transform  = 'translateY(20px)';

            requestAnimationFrame(() => requestAnimationFrame(() => {
                quoteText.style.transition   = 'opacity 1s ease, transform 1s ease';
                quoteAuthor.style.transition = 'opacity 1s ease, transform 1s ease';
                quoteText.style.opacity      = '1';
                quoteText.style.transform    = 'translateY(0)';
                quoteAuthor.style.opacity    = '1';
                quoteAuthor.style.transform  = 'translateY(0)';
            }));
        }, 1000);
    }

    setInterval(rotateQuote, 20000);
}

/* ===============================
   MATRIX BACKGROUND ANIMATION
   =============================== */

function initMatrixBackground() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const fontSize = 14;
    const columns  = Math.floor(canvas.width / fontSize);
    const drops    = Array(columns).fill(1);

    function drawMatrix() {
        ctx.fillStyle = 'rgba(1, 4, 9, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#1f9d47';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = Math.random() > 0.5 ? '1' : '0';
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }

    setInterval(drawMatrix, 33);
}

/* ===============================
   EASTER EGG - THREE STAGES
   =============================== */

let clicks = 0;
let resetTimer;

if (logoContainer && easterModal && cmdInput) {
    logoContainer.onclick = () => {
        clicks++;
        if (!resetTimer) {
            resetTimer = setTimeout(() => { clicks = 0; resetTimer = null; }, 3500);
        }
        if (clicks === 5) {
            easterModal.style.display = "flex";
            cmdInput.value = "";
            cmdInput.focus();
            clicks = 0;
        }
    };
}

if (cmdInput) {
    cmdInput.addEventListener("keydown", e => {
        if (e.key !== "Enter") return;
        const input = cmdInput.value.trim().toLowerCase();
        if (input === "git fork githubclub-sith" ||
            input === "git fork" ||
            input === "git clone githubclub-sith" ||
            input === "git clone") {
            document.getElementById('cmd-test').classList.add('hidden');
            document.getElementById('color-test').classList.remove('hidden');
            renderColorDoors();
        } else {
            cmdInput.style.animation = 'shake 0.4s';
            setTimeout(() => cmdInput.style.animation = '', 400);
        }
    });
}

function closeEasterEgg() {
    easterModal.style.display = 'none';
    document.getElementById('cmd-test').classList.remove('hidden');
    document.getElementById('color-test').classList.add('hidden');
    document.getElementById('final-test').classList.add('hidden');
    cmdInput.value = '';
}

if (easterModal) {
    easterModal.addEventListener('click', (e) => {
        if (e.target === easterModal) closeEasterEgg();
    });
}

/* ===============================
   STAGE 2: COLOR DOOR PUZZLE
   =============================== */

function renderColorDoors() {
    const container = document.getElementById('doors-container');
    const doors = [
        { color: "true-red",    correct: false, label: "Yellow" },
        { color: "decoy-green", correct: true,  label: "Green"  },
        { color: "decoy-blue",  correct: false, label: "Blue"   },
    ];
    for (let i = doors.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [doors[i], doors[j]] = [doors[j], doors[i]];
    }
    container.innerHTML = "";
    doors.forEach(d => {
        const btn = document.createElement("button");
        btn.className = `door ${d.color}`;
        btn.setAttribute('aria-label', d.label + ' door');
        btn.onclick = () => chooseDoor(d.correct, btn);
        container.appendChild(btn);
    });
}

function chooseDoor(correct, doorElement) {
    if (correct) {
        document.getElementById('color-test').classList.add('hidden');
        document.getElementById('final-test').classList.remove('hidden');
    } else {
        doorElement.classList.add('wrong');
        setTimeout(() => doorElement.classList.remove('wrong'), 400);
    }
}

/* ===============================
   SMOOTH SCROLLING
   =============================== */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

/* ===============================
   SHAKE ANIMATION
   =============================== */

const style = document.createElement('style');
style.textContent = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25%       { transform: translateX(-5px); }
    75%       { transform: translateX(5px); }
}`;
document.head.appendChild(style);

/* ===============================
   INITIALIZATION
   =============================== */

window.onload = () => {
    if (shouldShowLoader) return;

    document.querySelectorAll('.typewrite').forEach(el => {
        new TxtType(el, JSON.parse(el.dataset.type), el.dataset.period);
    });

    initCountdown();
    initQuoteRotation();
    initMatrixBackground();
    attachCursorListeners();
};