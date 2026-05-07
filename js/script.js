/* ─────────────────────────────────────────────────
   Garv Patel Portfolio — Static Frontend Script
   Optimized for GitHub Pages / Static Hosting
───────────────────────────────────────────────── */

// ═══════════════════════════════════════
// Loader — Robust Reveal
// ═══════════════════════════════════════
const hideLoader = () => {
  const loader = document.getElementById('loader');
  if (loader && !loader.classList.contains('hidden')) {
    loader.classList.add('hidden');
  }
};

// Main reveal on window load
window.addEventListener('load', () => setTimeout(hideLoader, 600));

// Safety fallback: Reveal anyway after 3 seconds if load event is stuck
setTimeout(hideLoader, 3000);

document.addEventListener('DOMContentLoaded', () => {

  // ── Custom Cursor ──────────────────────────────
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  (function animateCursor() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateCursor);
  })();

  document.querySelectorAll('a, button, .project-card, .skill-tag').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width = '56px'; ring.style.height = '56px';
      ring.style.borderColor = 'rgba(16,185,129,0.8)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width = '36px'; ring.style.height = '36px';
      ring.style.borderColor = 'rgba(16,185,129,0.5)';
    });
  });

  // ── Scroll Reveal ──────────────────────────────
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // ── Navbar Scroll ─────────────────────────────
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 60);
    if (backToTop) backToTop.classList.toggle('visible', y > 400);

    // Active nav link
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(s => { if (y >= s.offsetTop - 120) current = s.id; });
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  });

  // ── Back To Top ───────────────────────────────
  if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ── Mobile Menu ───────────────────────────────
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks      = document.getElementById('navLinks');
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  // ── Typing Animation ──────────────────────────
  const phrases = ['AI & Machine Learning.', 'Logistics Platforms.', 'Admin Systems.', 'Full-Stack Apps.'];
  let phraseIdx = 0, charIdx = 0, deleting = false;
  const typedEl = document.getElementById('typedText');

  function typeLoop() {
    if (!typedEl) return;
    const phrase = phrases[phraseIdx];
    if (!deleting) {
      typedEl.textContent = phrase.slice(0, ++charIdx);
      if (charIdx === phrase.length) { deleting = true; setTimeout(typeLoop, 2200); return; }
    } else {
      typedEl.textContent = phrase.slice(0, --charIdx);
      if (charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; }
    }
    setTimeout(typeLoop, deleting ? 55 : 90);
  }
  setTimeout(typeLoop, 2200);

  // ── Counter Animation ─────────────────────────
  function animateCounter(el, target, duration = 1500) {
    if (!el) return;
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      el.textContent = Math.floor(progress * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  }

  // ═════════════════════════════════════
  // Data (Hardcoded for Static Hosting)
  // ═════════════════════════════════════
  const PROJECT_DATA = [
    {
      title: 'Agricare',
      description: 'A collaborative precision agriculture platform featuring AI-driven crop disease detection, real-time weather integration, and smart market insights for sustainable farming.',
      tags: ['AI', 'Python', 'PHP', 'MySQL'],
      github_url: 'https://github.com/Nilay-Patel-5/Agricare',
      live_url: null,
      color_from: '#064e3b', color_to: '#065f46',
      image_class: 'agricare-bg', type: 'group'
    },
    {
      title: 'Vehicle Rental System',
      description: 'A full-stack rental platform with real-time geofencing, secure KYC document verification, and automated invoice generation.',
      tags: ['Python', 'Supabase', 'PostgreSQL', 'Geofencing'],
      github_url: 'https://github.com/garvpatel14/Vehicle-Rental',
      live_url: null,
      color_from: '#1e3a8a', color_to: '#172554',
      image_class: 'vehicle-bg', type: 'solo'
    },
    {
      title: 'Cadet Dossier Management',
      description: 'A comprehensive military cadet records system with inventory tracking, administrative oversight, and secure multi-role access control.',
      tags: ['PHP', 'PostgreSQL', 'Military Tech', 'RBAC'],
      github_url: 'https://github.com/garvpatel14/Cadet-Dossier-Management-System',
      live_url: null,
      color_from: '#374151', color_to: '#111827',
      image_class: 'cadet-bg', type: 'solo'
    }
  ];

  const SKILLS_DATA = {
    'Languages':         ['Python', 'PHP', 'JavaScript', 'Java', 'C++', 'HTML5/CSS3'],
    'Backend & Databases': ['Node.js', 'Express.js', 'PostgreSQL', 'MySQL', 'Supabase', 'MongoDB'],
    'Specializations':   ['AI Integration', 'Real-time Tracking', 'REST APIs', 'Geofencing'],
    'Tools & DevOps':    ['Git & GitHub', 'Docker', 'Vercel']
  };

  const STATS_DATA = {
    projects: 3,
    skills: 20,
    years: 2
  };

  const CAT_ICONS = {
    'Languages': 'code',
    'Backend & Databases': 'database',
    'Specializations': 'cpu',
    'Tools & DevOps': 'settings'
  };

  const EMOJIS = { 'agricare-bg': '🌿', 'vehicle-bg': '🚗', 'cadet-bg': '🎖️' };

  function buildProjectCard(p) {
    const imgClass = p.image_class || 'agricare-bg';
    const emoji    = EMOJIS[imgClass] || '💻';
    const badge    = p.type === 'group'
      ? '<span class="project-badge badge-group">Group Project</span>'
      : '<span class="project-badge badge-solo">Solo Project</span>';
    const tagsHTML = (p.tags || []).map(t => `<span class="project-tag">${t}</span>`).join('');
    const liveBtn  = p.live_url
      ? `<a href="${p.live_url}" target="_blank" class="project-link live"><i data-lucide="external-link"></i> Live Demo</a>`
      : '';
    const ghBtn = p.github_url
      ? `<a href="${p.github_url}" target="_blank" class="project-link"><i data-lucide="github"></i> Repository</a>`
      : '';

    return `
      <div class="project-card reveal">
        <div class="project-image">
          <div class="project-image-inner ${imgClass}">${emoji}</div>
          ${badge}
        </div>
        <div class="project-content">
          <div class="project-tags">${tagsHTML}</div>
          <h3>${p.title}</h3>
          <p>${p.description}</p>
          <div class="project-links">${ghBtn}${liveBtn}</div>
        </div>
      </div>`;
  }

  function renderProjects(data) {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;
    grid.innerHTML = data.map(buildProjectCard).join('');
    grid.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    lucide.createIcons();
  }

  function renderSkills(grouped) {
    const grid = document.getElementById('skillsGrid');
    if (!grid) return;
    grid.innerHTML = Object.entries(grouped).map(([cat, skills], i) => {
      const icon = CAT_ICONS[cat] || 'star';
      const tagsHTML = skills.map(s => `<span class="skill-tag">${s}</span>`).join('');
      return `
        <div class="skill-category reveal delay-${i % 3}">
          <div class="skill-cat-header">
            <i data-lucide="${icon}"></i>
            <h4>${cat}</h4>
          </div>
          <div class="skill-tags">${tagsHTML}</div>
        </div>`;
    }).join('');
    grid.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    lucide.createIcons();
  }

  function initStats() {
    const statsRow = document.querySelector('.stats-row');
    if (statsRow) {
      const statsObs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          animateCounter(document.getElementById('statProjects'), STATS_DATA.projects);
          animateCounter(document.getElementById('statSkills'),   STATS_DATA.skills);
          animateCounter(document.getElementById('statYears'),    STATS_DATA.years);
          statsObs.disconnect();
        }
      }, { threshold: 0.5 });
      statsObs.observe(statsRow);
    }
  }

  // ═════════════════════════════════════
  // Contact Form (Client-side logic only)
  // ═════════════════════════════════════
  const form       = document.getElementById('contactForm');
  const submitBtn  = document.getElementById('submitBtn');
  const submitText = document.getElementById('submitText');
  const feedback   = document.getElementById('formFeedback');

  function setFieldError(id, msg) {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
  }
  function clearErrors() {
    ['nameError', 'emailError', 'messageError'].forEach(id => setFieldError(id, ''));
  }

  function showFeedback(msg, type) {
    if (!feedback) return;
    feedback.textContent = msg;
    feedback.className = `form-feedback ${type}`;
    feedback.classList.remove('hidden');
    setTimeout(() => feedback.classList.add('hidden'), 6000);
  }

  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      clearErrors();

      const name    = document.getElementById('contactName')?.value.trim();
      const email   = document.getElementById('contactEmail')?.value.trim();
      const message = document.getElementById('contactMessage')?.value.trim();
      let valid = true;

      if (!name)    { setFieldError('nameError', 'Name is required.'); valid = false; }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setFieldError('emailError', 'Enter a valid email address.'); valid = false;
      }
      if (!message || message.length < 10) {
        setFieldError('messageError', 'Message must be at least 10 characters.'); valid = false;
      }
      if (!valid) return;

      submitBtn.disabled = true;
      submitText.textContent = 'Sending…';

      try {
        const response = await fetch('https://formspree.io/f/mlgzlqlg', {
          method: 'POST',
          body: JSON.stringify({ name, email, message }),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          showFeedback('✅ Thank you! Your message has been sent successfully.', 'success');
          form.reset();
        } else {
          const data = await response.json();
          throw new Error(data.errors?.[0]?.message || 'Submission failed');
        }
      } catch (err) {
        showFeedback('❌ ' + (err.message || 'Failed to send. Please email directly.'), 'error');
      } finally {
        submitBtn.disabled = false;
        submitText.textContent = 'Send Message';
        lucide.createIcons();
      }
    });
  }

  // ── Bootstrap ─────────────────────────────────
  renderProjects(PROJECT_DATA);
  renderSkills(SKILLS_DATA);
  initStats();
});
