// Fade-in effect only for elements with .fade-in
document.addEventListener("DOMContentLoaded", () => {
  const faders = document.querySelectorAll(".fade-in");

  const appearOptions = { threshold: 0.2 };

  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, appearOptions);

  faders.forEach(fader => {
    appearOnScroll.observe(fader);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  const nav = document.getElementById('siteNav');

  if (!toggle || !links) {
    console.warn('Nav toggle/links not found');
    return;
  }

  // helper functions
  function openMenu() {
    links.classList.add('open');
    toggle.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    links.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // optional: prevent page scroll
  }
  function closeMenu() {
    links.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    links.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // toggle click
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (links.classList.contains('open')) closeMenu();
    else openMenu();
  });

  // close when link clicked
  links.addEventListener('click', (e) => {
    if (e.target && e.target.matches('a')) {
      closeMenu();
    }
  });

  // close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // click outside closes
  document.addEventListener('click', (e) => {
    if (!links.classList.contains('open')) return;
    if (!nav.contains(e.target)) closeMenu();
  });

  // close on resize to desktop to avoid stuck state
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  });

  console.log('Navbar script initialized');
});


//canvas


const canvas = document.getElementById("cometCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

class Comet {
  constructor() {
    this.reset();
  }

  reset() {
    const isMobile = window.innerWidth <= 768;

    // Start X position: full width on desktop, narrower on mobile
    this.x = isMobile
      ? Math.random() * (canvas.width * 0.4)
      : Math.random() * canvas.width;

    this.y = -50;

    // Speed
    this.vx = 1 + Math.random() * 2;
    this.vy = isMobile ? (2 + Math.random() * 2) : (3 + Math.random() * 3);

    // Tail properties
    this.alpha = 1;
    this.length = (isMobile ? 40 : 80) + Math.random() * (isMobile ? 40 : 80);

    // NEW ✨ Randomize brightness and thickness
    this.brightness = 200 + Math.floor(Math.random() * 55); // 200–255 (whiter)
    this.lineWidth = Math.random() * 1.5 + 1; // 1–2.5 px

    // Delay before activation (staggered start)
    this.delay = Math.random() * 2000;
    this.active = false;
  }

  update() {
    if (this.delay > 0) {
      this.delay -= 16; // wait ~16ms per frame
      return;
    }
    this.active = true;

    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 0.01;

    // Reset when faded or out of bounds
    if (this.alpha <= 0 || this.y > canvas.height + 100 || this.x > canvas.width + 100) {
      this.reset();
    }
  }

  draw() {
    if (!this.active) return;

    const gradient = ctx.createLinearGradient(
      this.x, this.y,
      this.x - this.length, this.y - this.length
    );
    gradient.addColorStop(0, `rgba(${this.brightness},${this.brightness},${this.brightness},${this.alpha})`);
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    ctx.strokeStyle = gradient;
    ctx.lineWidth = this.lineWidth;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - this.length, this.y - this.length);
    ctx.stroke();
  }
}

// Spawn 10 comets (they stagger in naturally)
let comets = Array.from({ length: 10 }, () => new Comet());

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  comets.forEach(comet => {
    comet.update();
    comet.draw();
  });
  requestAnimationFrame(animate);
}
animate();




