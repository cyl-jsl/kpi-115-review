/* ============================================
   KPI 115 Self-Evaluation — App Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initCardNavigation();
  initScrollHeader();
  animateOnVisible();
});

/* ---- Tab Navigation ---- */
function initTabs() {
  const itemTabs = document.querySelectorAll('.item-tab');
  const panels = document.querySelectorAll('.tab-panel');

  itemTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      // Update tab active state
      itemTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Switch panel
      panels.forEach(p => p.classList.remove('active'));
      const panel = document.getElementById(target);
      if (panel) {
        panel.classList.add('active');
        // Re-trigger animation
        panel.style.animation = 'none';
        panel.offsetHeight; // force reflow
        panel.style.animation = '';
      }

      // Scroll to top of content area (below fixed header + tabs)
      const contentTop = document.querySelector('.content').offsetTop - 112;
      window.scrollTo({ top: Math.max(0, contentTop), behavior: 'instant' });

      // Update URL hash without scrolling
      history.replaceState(null, '', '#' + target);
    });
  });

  // Handle initial hash
  const hash = window.location.hash.slice(1);
  if (hash) {
    const tab = document.querySelector(`.item-tab[data-tab="${hash}"]`);
    if (tab) tab.click();
  }
}

/* ---- Card Navigation (Overview → Detail) ---- */
function initCardNavigation() {
  document.querySelectorAll('.kpi-card[data-navigate]').forEach(card => {
    card.addEventListener('click', () => {
      const target = card.dataset.navigate;
      const tab = document.querySelector(`.item-tab[data-tab="${target}"]`);
      if (tab) tab.click();
    });
  });
}

/* ---- Header scroll effect ---- */
function initScrollHeader() {
  const header = document.querySelector('.site-header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (current > 100) {
      header.style.borderBottomColor = 'rgba(42, 42, 54, 0.8)';
    } else {
      header.style.borderBottomColor = '';
    }
    lastScroll = current;
  }, { passive: true });
}

/* ---- Staggered entrance animation ---- */
function animateOnVisible() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        entry.target.style.animationDelay = `${index * 60}ms`;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  // Observe cards and evidence items
  document.querySelectorAll('.kpi-card, .metric-card, .evidence-item').forEach(el => {
    el.classList.add('animate-in');
    observer.observe(el);
  });
}

/* Add animation styles dynamically */
const style = document.createElement('style');
style.textContent = `
  .animate-in {
    opacity: 0;
    transform: translateY(12px);
    transition: opacity 0.4s ease, transform 0.4s ease;
  }
  .animate-in.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(style);
