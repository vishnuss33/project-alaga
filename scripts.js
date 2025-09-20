// -------------------- Fade-in effect --------------------
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

  faders.forEach(fader => appearOnScroll.observe(fader));
});

// -------------------- Navbar --------------------
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  const nav = document.getElementById("siteNav");

  if (!toggle || !links) return;

  function openMenu() {
    links.classList.add("open");
    toggle.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
    links.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    links.classList.remove("open");
    toggle.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    links.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  toggle.addEventListener("click", e => {
    e.stopPropagation();
    links.classList.contains("open") ? closeMenu() : openMenu();
  });

  links.addEventListener("click", e => {
    if (e.target && e.target.matches("a")) closeMenu();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeMenu();
  });

  document.addEventListener("click", e => {
    if (links.classList.contains("open") && !nav.contains(e.target)) closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) closeMenu();
  });

  console.log("✅ Navbar script initialized");
});

// -------------------- Comet Animation --------------------
const canvas = document.getElementById("cometCanvas");
if (canvas) {
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  class Comet {
    constructor() { this.reset(); }
    reset() {
      const isMobile = window.innerWidth <= 768;
      this.x = isMobile ? Math.random() * (canvas.width * 0.4) : Math.random() * canvas.width;
      this.y = -50;
      this.vx = 1 + Math.random() * 2;
      this.vy = isMobile ? (2 + Math.random() * 2) : (3 + Math.random() * 3);
      this.alpha = 1;
      this.length = (isMobile ? 40 : 80) + Math.random() * (isMobile ? 40 : 80);
      this.brightness = 200 + Math.floor(Math.random() * 55);
      this.lineWidth = Math.random() * 1.5 + 1;
      this.delay = Math.random() * 2000;
      this.active = false;
    }
    update() {
      if (this.delay > 0) { this.delay -= 16; return; }
      this.active = true;
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= 0.01;
      if (this.alpha <= 0 || this.y > canvas.height + 100 || this.x > canvas.width + 100) this.reset();
    }
    draw() {
      if (!this.active) return;
      const gradient = ctx.createLinearGradient(this.x, this.y, this.x - this.length, this.y - this.length);
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

  let comets = Array.from({ length: 10 }, () => new Comet());
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    comets.forEach(c => { c.update(); c.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
}

// -------------------- Gallery --------------------
function renderGallery() {
  const galleryContainer = document.getElementById("gallery");
  if (!galleryContainer) return;

  if (typeof galleryData === "undefined") {
    console.error("❌ galleryData.js not loaded. Include it before scripts.js.");
    return;
  }

  // Create structure
  galleryContainer.innerHTML = `
    <h2>Our Gallery</h2>
    <p>Explore our collection of handloom dresses and imitation jewellery.</p>
    <div class="gallery-tabs"></div>
    <div class="gallery-content"></div>
  `;

  const tabsContainer = galleryContainer.querySelector(".gallery-tabs");
  const contentContainer = galleryContainer.querySelector(".gallery-content");
  const categories = Object.keys(galleryData);

  categories.forEach((category, i) => {
    const btn = document.createElement("button");
    btn.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    btn.className = `gallery-tab ${i === 0 ? "active" : ""}`;
    btn.dataset.category = category;
    tabsContainer.appendChild(btn);

    const grid = document.createElement("div");
    grid.id = `${category}Grid`;
    grid.className = `gallery-grid ${i === 0 ? "active" : ""}`;
    contentContainer.appendChild(grid);

    galleryData[category].forEach(item => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${item.img}" alt="${item.title}">
        <div class="card-content">
          <h4>${item.title}</h4>
          <p>${item.description}</p>
        </div>
      `;
      grid.appendChild(card);
    });
  });

  // Switch tabs
  tabsContainer.addEventListener("click", e => {
    if (!e.target.classList.contains("gallery-tab")) return;
    document.querySelectorAll(".gallery-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".gallery-grid").forEach(g => g.classList.remove("active"));
    e.target.classList.add("active");
    document.getElementById(`${e.target.dataset.category}Grid`).classList.add("active");
  });
}

document.addEventListener("DOMContentLoaded", renderGallery);





// FAQ Toggle
document.querySelectorAll(".faq-question").forEach(button => {
  button.addEventListener("click", () => {
    const faq = button.parentElement;
    const answer = faq.querySelector(".faq-answer");
    const isOpen = faq.classList.contains("open");

    // Close all other FAQs
    document.querySelectorAll(".faq").forEach(f => {
      f.classList.remove("open");
      f.querySelector(".faq-answer").style.maxHeight = null;
      f.querySelector("span").textContent = "+";
    });

    // Toggle current FAQ
    if (!isOpen) {
      faq.classList.add("open");
      answer.style.maxHeight = answer.scrollHeight + "px";
      button.querySelector("span").textContent = "−";
    }
  });
});

