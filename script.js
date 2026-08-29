/**
 * PORTFOLIO WEBSITE JAVASCRIPT
 * Features: Dark/Light Mode, Canvas Particle System, Typewriter,
 * Counters, Filterable Gallery, Modal, Form Validation, Smooth Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initCursorGlow();
  initHeroCanvas();
  initTypewriter();
  initNavigation();
  initStatsCounter();
  initSkillsAnimation();
  initTimelineTabs();
  initProjectsFilterAndModal();
  initContactForm();
  initBackToTop();
  updateCopyrightYear();
});

/* ==========================================================================
   1. DARK / LIGHT THEME TOGGLE WITH LOCAL STORAGE
   ========================================================================== */
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  // Retrieve saved preference or default to 'dark'
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
  });
}

/* ==========================================================================
   2. INTERACTIVE CURSOR GLOW
   ========================================================================== */
function initCursorGlow() {
  const cursorGlow = document.getElementById('cursorGlow');
  if (!cursorGlow || window.innerWidth < 768) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function renderCursor() {
    // Linear interpolation for smooth trailing
    currentX += (mouseX - currentX) * 0.12;
    currentY += (mouseY - currentY) * 0.12;

    cursorGlow.style.left = `${currentX}px`;
    cursorGlow.style.top = `${currentY}px`;

    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);
}

/* ==========================================================================
   3. HERO CANVAS BACKGROUND ANIMATION (INTERACTIVE PARTICLES & CONSTELLATION)
   ========================================================================== */
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = window.innerWidth < 768 ? 35 : 70;
  const maxDistance = 120;

  let mouse = {
    x: null,
    y: null,
    radius: 140
  };

  function resize() {
    const heroSection = document.getElementById('home');
    width = canvas.width = heroSection.offsetWidth;
    height = canvas.height = heroSection.offsetHeight;
  }

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });

  window.addEventListener('mousemove', (e) => {
    const heroRect = canvas.getBoundingClientRect();
    if (e.clientY >= heroRect.top && e.clientY <= heroRect.bottom) {
      mouse.x = e.clientX - heroRect.left;
      mouse.y = e.clientY - heroRect.top;
    } else {
      mouse.x = null;
      mouse.y = null;
    }
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = Math.random() * 2 + 1;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.baseAlpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interactivity
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 2;
          this.y -= Math.sin(angle) * force * 2;
        }
      }
    }

    draw() {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = isLight ? `rgba(99, 102, 241, ${this.baseAlpha * 0.6})` : `rgba(129, 140, 248, ${this.baseAlpha})`;
      ctx.fill();
    }
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function drawConnections() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const opacity = (1 - dist / maxDistance) * (isLight ? 0.12 : 0.22);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = isLight ? `rgba(99, 102, 241, ${opacity})` : `rgba(56, 189, 248, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    drawConnections();
    requestAnimationFrame(animate);
  }

  resize();
  createParticles();
  animate();
}

/* ==========================================================================
   4. TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
  const element = document.getElementById('typewriter');
  if (!element) return;

  const words = [
    'Prompt Engineering',
    'StartUP Yaratuvchi'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const delayBetweenWords = 1800;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      element.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      element.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let speed = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentWord.length) {
      speed = delayBetweenWords;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      speed = 300;
    }

    setTimeout(type, speed);
  }

  type();
}

/* ==========================================================================
   5. NAVIGATION (SCROLL STATE, MOBILE MENU, ACTIVE LINK HIGHLIGHT)
   ========================================================================== */
function initNavigation() {
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll Header Shadow
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active Section Spy
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile Menu Toggle
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
    });

    // Close menu when clicking nav items
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('open');
      });
    });
  }
}

/* ==========================================================================
   6. STATS COUNTER ANIMATION
   ========================================================================== */
function initStatsCounter() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const duration = 1800; // ms
          const startTime = performance.now();

          function updateCount(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic formula
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(easeOutProgress * target);

            counter.textContent = currentVal;

            if (progress < 1) {
              requestAnimationFrame(updateCount);
            } else {
              counter.textContent = target;
            }
          }

          requestAnimationFrame(updateCount);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.getElementById('stats');
  if (statsSection) observer.observe(statsSection);
}

/* ==========================================================================
   7. SKILLS PROGRESS ANIMATION
   ========================================================================== */
function initSkillsAnimation() {
  const skillsSection = document.getElementById('skills');
  if (!skillsSection) return;

  const progressBars = document.querySelectorAll('.skill-progress');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        progressBars.forEach(bar => {
          const targetWidth = bar.style.getPropertyValue('--w') || '85%';
          bar.style.width = targetWidth;
        });
        observer.unobserve(skillsSection);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(skillsSection);
}

/* ==========================================================================
   8. TIMELINE TABS (WORK VS EDUCATION)
   ========================================================================== */
function initTimelineTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const workTimeline = document.getElementById('work-timeline');
  const educationTimeline = document.getElementById('education-timeline');

  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const tabTarget = btn.getAttribute('data-tab');
      if (tabTarget === 'work') {
        workTimeline.classList.add('active');
        educationTimeline.classList.remove('active');
      } else {
        workTimeline.classList.remove('active');
        educationTimeline.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   9. PROJECTS FILTER & MODAL SYSTEM
   ========================================================================== */
const projectsData = {
  1: {
    title: 'Personal Portfolio Veb-Sayti',
    category: 'Web Sayt & Shaxsiy Brend',
    period: '2024',
    description: 'Dasturchi va AI Prompt Engineer uchun yaratilgan, yuqori samaradorlik va zamonaviy glassmorphism dizayniga ega shaxsiy portfolio veb-sayti.',
    features: [
      'Glassmorphism va neon UI elementlari, Dark & Light mavzular',
      'HTML5 Canvas zarrachalar animatsiyasi va Typewriter effekti',
      'Filtrlash tizimiga ega loyihalar vitrinasi va modal darchalari',
      'Telegram Bot orqali real-vaqt rejimida ishlovchi aloqa formasi',
      'Vercel orqali avtomatlashtirilgan CI/CD joylashuvi'
    ],
    tech: ['HTML5', 'CSS3 Custom Properties', 'JavaScript ES6+', 'Vercel', 'Telegram Bot API'],
    demoUrl: 'https://portfolio-sayt-psi.vercel.app/',
    githubUrl: 'https://github.com/dalerxolmamatov0-rgb/Portfolio-Sayt'
  },
  2: {
    title: 'SMM AI Assistant Platformasi',
    category: 'Web Sayt / AI Xizmat',
    period: '2024',
    description: 'SMM mutaxassislari, marketologlar va bizneslar uchun sun\'iy intellekt (Prompt Engineering) yordamida sifatli postlar, ssenariylar va rejalashtirish imkoniyatini taqdim etuvchi AI platforma.',
    features: [
      'Ijtimoiy tarmoqlar (Instagram, Telegram, LinkedIn) uchun AI post yaratish',
      'Prompt shablonlari va maxsus ton/temperatura parametrlari',
      'Tezkor kontent-reja generatsiyasi va saqlash',
      'Vercel orqali tezkor va optimallashgan deploy'
    ],
    tech: ['Next.js', 'React', 'OpenAI / Gemini API', 'Tailwind CSS', 'Vercel'],
    demoUrl: 'https://smm-ai-asissant.vercel.app/',
    githubUrl: 'https://github.com/dalerxolmamatov0-rgb'
  },
  3: {
    title: 'Video & Media Installer Telegram Boti',
    category: 'Telegram Bot & Media',
    period: '2024',
    description: 'Instagram reels, YouTube videolari, TikTok va boshqa platformalardan media fayllarni bir zumda yuqori sifatda yuklab beruvchi qulay va tezkor Telegram bot.',
    features: [
      'Instagram, YouTube, TikTok va Pinterest havolalarini avtomatik aniqlash',
      'Yuqori sifatli (HD / Full HD) video va audio formatlarda yuklab olish',
      'Tezkor yuklash tezligi va optimallashtirilgan server arxitekturasi',
      'Foydalanuvchilar statistikasi va oson boshqaruv'
    ],
    tech: ['Python', 'Aiogram 3.x', 'FFmpeg', 'Telegram API', 'Redis'],
    demoUrl: 'https://t.me/video_installer_bot',
    githubUrl: 'https://github.com/dalerxolmamatov0-rgb'
  },
  4: {
    title: 'Portfolio Notification & Chat Boti',
    category: 'Telegram Bot & Integratsiya',
    period: '2024',
    description: 'Portfolio saytidan yuborilgan har qanday murojaat, savol va buyurtmalarni zudlik bilan Telegram guruhiga jo\'natuvchi, xabarlarni formatlovchi va avtomatlashtiruvchi bot.',
    features: [
      'Saytdan guruhga real-vaqt rejimida xabarnoma jo\'natish',
      'HTML teglari bilan chiroyli formatlangan xabarlar',
      'Foydalanuvchi ma\'lumotlari va kontaktlarini avtomatik ajratish',
      '24/7 uzluksiz ishlash va yuqori xavfsizlik'
    ],
    tech: ['Telegram Bot API', 'JavaScript', 'REST API', 'JSON Webhook'],
    demoUrl: 'https://t.me/portfolio_chatt_bot',
    githubUrl: 'https://github.com/dalerxolmamatov0-rgb'
  }
};

function initProjectsFilterAndModal() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  // Filter functionality
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || filterValue === cardCategory) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // Modal Functionality
  const modal = document.getElementById('projectModal');
  const modalContent = document.getElementById('modalContent');
  const modalClose = document.getElementById('modalClose');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const viewDetailsBtns = document.querySelectorAll('.view-details-btn');

  function openModal(projectId) {
    const data = projectsData[projectId];
    if (!data) return;

    modalContent.innerHTML = `
      <div class="modal-meta">
        <span><i class="fa-solid fa-tag text-cyan"></i> ${data.category}</span>
        <span><i class="fa-regular fa-calendar"></i> ${data.period}</span>
      </div>
      <h3 class="modal-title">${data.title}</h3>
      <p class="modal-desc">${data.description}</p>
      
      <div class="modal-features">
        <h4><i class="fa-solid fa-star text-yellow"></i> Asosiy Imkoniyatlari:</h4>
        <ul>
          ${data.features.map(f => `<li>${f}</li>`).join('')}
        </ul>
      </div>

      <div class="modal-features">
        <h4><i class="fa-solid fa-code text-cyan"></i> Ishlatilgan Texnologiyalar:</h4>
        <div class="project-tags" style="margin-top: 10px;">
          ${data.tech.map(t => `<span style="font-size:0.85rem; padding:6px 12px;">${t}</span>`).join('')}
        </div>
      </div>

      <div style="display: flex; gap: 14px; margin-top: 30px; flex-wrap: wrap;">
        <a href="${data.demoUrl}" target="_blank" class="btn btn-primary">
          <i class="fa-solid fa-arrow-up-right-from-square"></i>
          <span>Saytni Ko'rish</span>
        </a>
        <a href="${data.githubUrl}" target="_blank" class="btn btn-outline">
          <i class="fa-brands fa-github"></i>
          <span>GitHub Kodi</span>
        </a>
      </div>
    `;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  viewDetailsBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const projectId = btn.getAttribute('data-project');
      openModal(projectId);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   10. CONTACT FORM - REAL TELEGRAM BOT INTEGRATION
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formStatus = document.getElementById('formStatus');

  // Telegram sozlamalari
  const TELEGRAM_CONFIG = {
    chatId: '-1003994018848',
    botTokens: [
      '8967160185:AAHPGmgsoPG8zYpNiF1XbaydZc_v5zUyRO4',
      '8812926882:AAFo1oZxnoTVSw-vXj-QSHCW4cerpyw3YHc'
    ]
  };

  if (!contactForm) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const contactInfo = document.getElementById('contactInfo').value.trim();
    const subjectSelect = document.getElementById('subject');
    const subjectText = subjectSelect.options[subjectSelect.selectedIndex].text;
    const message = document.getElementById('message').value.trim();

    if (!name || !contactInfo || !message) {
      formStatus.className = 'form-status error';
      formStatus.textContent = "Iltimos, barcha majburiy maydonlarni to'ldiring!";
      return;
    }

    // Loading holati
    const btnText = submitBtn.querySelector('.btn-text');
    const btnIcon = submitBtn.querySelector('.btn-icon');
    const spinner = submitBtn.querySelector('.spinner');

    btnText.textContent = 'Yuborilmoqda...';
    btnIcon.style.display = 'none';
    spinner.style.display = 'inline-block';
    submitBtn.disabled = true;

    // Telegram uchun chiroyli formatlangan xabar
    const telegramMessage = 
`🚀 <b>Portfolio saytingizdan yangi murojaat!</b>

👤 <b>Mijoz:</b> ${name}
📬 <b>Email / Telegram:</b> ${contactInfo}
📌 <b>Mavzu:</b> ${subjectText}
💬 <b>Xabar:</b>
<i>"${message}"</i>

⏰ <b>Vaqt:</b> ${new Date().toLocaleString('uz-UZ')}`;

    try {
      let sentSuccessfully = false;
      let lastErrorMessage = '';

      for (const token of TELEGRAM_CONFIG.botTokens) {
        if (!token || token.startsWith('BOT_TOKEN')) continue;
        try {
          const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: TELEGRAM_CONFIG.chatId,
              text: telegramMessage,
              parse_mode: 'HTML'
            })
          });
          const result = await response.json();
          if (result.ok) {
            sentSuccessfully = true;
            break;
          } else {
            lastErrorMessage = result.description;
          }
        } catch (err) {
          lastErrorMessage = err.message;
        }
      }

      if (!sentSuccessfully && lastErrorMessage) {
        throw new Error(lastErrorMessage);
      }

      // Muvaffaqiyatli xabar
      formStatus.className = 'form-status success';
      formStatus.innerHTML = `
        <i class="fa-solid fa-circle-check"></i> 
        Rahmat, <strong>${name}</strong>! Xabaringiz muvaffaqiyatli qabul qilindi va guruhga yuborildi.
      `;
      contactForm.reset();

    } catch (error) {
      console.error('Telegram yuborish xatosi:', error);
      formStatus.className = 'form-status error';
      formStatus.innerHTML = `
        <i class="fa-solid fa-triangle-exclamation"></i> 
        Xabar yuborishda xatolik yuz berdi: ${error.message}. Iltimos, Telegram orqali to'g'ridan-to'g'ri yozing.
      `;
    } finally {
      btnText.textContent = 'Xabarni Yuborish';
      btnIcon.style.display = 'inline-block';
      spinner.style.display = 'none';
      submitBtn.disabled = false;

      // 6 soniyadan so'ng statusni yashirish
      setTimeout(() => {
        formStatus.style.display = 'none';
        formStatus.className = 'form-status';
      }, 7000);
    }
  });
}

/* ==========================================================================
   11. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const backToTop = document.getElementById('backToTop');
  if (!backToTop) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   12. COPYRIGHT YEAR
   ========================================================================== */
function updateCopyrightYear() {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}
