/* =============================================
   Mobile nav toggle
============================================= */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* =============================================
   Typing animation for hero title
============================================= */
const titles = ['Full Stack Developer', 'Java Full Stack Developer', 'React & Node Developer'];
const typedEl = document.getElementById('typedTitle');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let titleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  const current = titles[titleIndex];

  if (!deleting) {
    charIndex++;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1600);
      return;
    }
  } else {
    charIndex--;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
    }
  }

  setTimeout(typeLoop, deleting ? 40 : 70);
}

if (prefersReducedMotion) {
  typedEl.textContent = titles[0];
} else {
  typeLoop();
}

/* =============================================
   Scroll reveal via Intersection Observer (staggered)
============================================= */
const revealEls = document.querySelectorAll('.reveal');

if (prefersReducedMotion) {
  revealEls.forEach((el) => el.classList.add('in-view'));
} else {
  // Stagger siblings that reveal together (e.g. skill groups, project cards)
  const staggerGroups = new Map();
  revealEls.forEach((el) => {
    const parent = el.parentElement;
    if (!staggerGroups.has(parent)) staggerGroups.set(parent, []);
    staggerGroups.get(parent).push(el);
  });
  staggerGroups.forEach((siblings) => {
    siblings.forEach((el, i) => {
      el.style.setProperty('--reveal-delay', `${Math.min(i * 90, 270)}ms`);
    });
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach((el) => revealObserver.observe(el));
}

/* =============================================
   Subtle hero parallax (pointer devices only)
============================================= */
const heroGlow = document.querySelector('.hero__glow');
const portraitCard = document.querySelector('.portrait-card');
const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (heroGlow && portraitCard && supportsHover && !prefersReducedMotion) {
  const hero = document.getElementById('home');
  hero.addEventListener('mousemove', (e) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5) * 2;
    const y = (e.clientY / innerHeight - 0.5) * 2;
    heroGlow.style.transform = `translate(${x * 24}px, ${y * 24}px)`;
    portraitCard.style.transform = `rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
  });
  hero.addEventListener('mouseleave', () => {
    heroGlow.style.transform = '';
    portraitCard.style.transform = '';
  });
}

/* =============================================
   Navbar background on scroll
============================================= */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.style.boxShadow = window.scrollY > 20 ? '0 1px 0 rgba(0,0,0,0.3)' : 'none';
});

/* =============================================
   Footer year
============================================= */
document.getElementById('year').textContent = new Date().getFullYear();

/* =============================================
   Scroll progress bar, back-to-top, nav shadow
============================================= */
const progressBar = document.getElementById('progress');
const toTop = document.getElementById('toTop');
let ticking = false;

function onScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? window.scrollY / max : 0;
  progressBar.style.transform = `scaleX(${ratio})`;
  toTop.classList.toggle('show', window.scrollY > 600);
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(onScroll);
    ticking = true;
  }
}, { passive: true });
onScroll();

toTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
});

/* =============================================
   Active nav link (scroll spy)
============================================= */
const spyLinks = [...document.querySelectorAll('.nav__link')];
const spySections = spyLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

const spyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        spyLinks.forEach((link) =>
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`)
        );
      }
    });
  },
  { rootMargin: '-45% 0px -50% 0px' }
);
spySections.forEach((section) => spyObserver.observe(section));

/* =============================================
   Project card cursor spotlight (pointer devices)
============================================= */
if (supportsHover) {
  document.querySelectorAll('.project').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  });
}
