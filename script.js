/* ════════════════════════════════════════════
   ASHUTOSH MOHANTY — PM PORTFOLIO
   script.js — Interactions & Animations
   ════════════════════════════════════════════ */

/* ── CUSTOM CURSOR ── */
(function initCursor() {
  if (window.matchMedia('(hover: none)').matches) return;
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = -100, my = -100;
  let rx = -100, ry = -100;
  let raf;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  });

  function lerp(a, b, t) { return a + (b - a) * t; }
  function animRing() {
    rx = lerp(rx, mx, 0.12);
    ry = lerp(ry, my, 0.12);
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    raf = requestAnimationFrame(animRing);
  }
  animRing();

  document.querySelectorAll('a, button, .case-card, .td-expand-card, .case-chevron').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.width = '14px';
      dot.style.height = '14px';
      ring.style.width = '48px';
      ring.style.height = '48px';
      ring.style.borderColor = 'rgba(224,36,56,0.7)';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.width = '8px';
      dot.style.height = '8px';
      ring.style.width = '32px';
      ring.style.height = '32px';
      ring.style.borderColor = 'rgba(224,36,56,0.45)';
    });
  });
})();

/* ── MOUSE-REACTIVE GLOW ── */
(function initMouseGlow() {
  if (window.matchMedia('(hover: none)').matches) return;
  const glow = document.createElement('div');
  glow.className = 'mouse-glow';
  document.body.appendChild(glow);
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
})();

/* ── CARD HOVER RADIAL (CSS variable) ── */
document.querySelectorAll('.case-card, .td-expand-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
    card.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
  });
});

/* ── TOGGLE CASE STUDY ── */
function toggleCase(id) {
  const card = document.getElementById(id);
  if (!card) return;
  const wasOpen = card.classList.contains('open');
  // Close all
  document.querySelectorAll('.case-card.open').forEach(c => c.classList.remove('open'));
  if (!wasOpen) {
    card.classList.add('open');
    setTimeout(() => {
      const body = card.querySelector('.case-body');
      if (body) body.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 80);
  }
}

/* ── TOGGLE TEARDOWN ── */
function toggleTeardown(bodyId, cardId) {
  event && event.stopPropagation();
  const body = document.getElementById(bodyId);
  const card = document.getElementById(cardId);
  if (!body || !card) return;
  const isOpen = card.classList.contains('td-open');
  // Close all
  document.querySelectorAll('.td-expand-card').forEach(c => c.classList.remove('td-open'));
  document.querySelectorAll('.td-expand-body').forEach(b => b.style.display = 'none');
  if (!isOpen) {
    card.classList.add('td-open');
    body.style.display = 'block';
    setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  }
}

/* ── SCROLL REVEAL ── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.05 });
document.querySelectorAll('.reveal').forEach(r => revealObs.observe(r));

/* ── SKILL BAR ANIMATION ── */
const skillSection = document.querySelector('.skills-section');
if (skillSection) {
  const skillObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      document.querySelectorAll('.skill-fill').forEach(f => {
        const w = f.style.width;
        f.style.width = '0';
        setTimeout(() => { f.style.width = w; }, 100);
      });
      skillObs.disconnect();
    }
  }, { threshold: 0.3 });
  skillObs.observe(skillSection);
}

/* ── ZETA SECTION FADE ON SCROLL ── */
const zetaFades = document.querySelectorAll('.zeta-wrap .fade');
if (zetaFades.length) {
  const zetaObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('on');
    });
  }, { threshold: 0.05 });
  zetaFades.forEach(f => zetaObs.observe(f));
}

/* ── SMOOTH SCROLL (fallback) ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── STAGGER HERO STATS ── */
document.querySelectorAll('.hero-stat').forEach((s, i) => {
  s.style.animation = `fadeUp 0.6s ${0.4 + i * 0.1}s cubic-bezier(0.4,0,0.2,1) both`;
});

/* ── NAV ACTIVE HIGHLIGHT ON SCROLL ── */
(function initNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a');
  if (!sections.length || !links.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.style.color = '');
        const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (active) active.style.color = 'var(--accent2)';
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => obs.observe(s));
})();

/* ── CARD ENTRANCE STAGGER ── */
(function staggerCards() {
  const cards = document.querySelectorAll('.case-card');
  const cObs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        e.target.style.animation = `fadeUp 0.6s ${i * 0.08}s cubic-bezier(0.4,0,0.2,1) both`;
        cObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  cards.forEach(c => cObs.observe(c));
})();
