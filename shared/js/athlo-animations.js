/**
 * ATHLOBOARD REFINED INTERACTIVE ENGINE
 * Features: Scroll-Triggered Sliding Text & Card Reveals, Sleek Micro-Cursor, Sticky Header Blur, Eased Counters, Back-to-Top
 */

document.addEventListener('DOMContentLoaded', () => {
  initSleekCursor();
  initStickyHeader();
  initBackToTop();
  initScrollReveals();
  initStatCounters();
});

// 1. Scroll-Triggered Sliding Text & Component Reveals
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.slide-up-reveal, .slide-left-reveal, .slide-right-reveal, .card-stagger-reveal');
  
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

// 2. Refined Sleek Micro-Cursor (Instant, natural tracking)
function initSleekCursor() {
  if (window.innerWidth <= 1024) return;

  const cursor = document.createElement('div');
  cursor.className = 'athlo-cursor';
  document.body.appendChild(cursor);

  window.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  });

  // Expand subtly over interactive elements
  const hoverTargets = 'a, button, input, select, textarea, .btn-volt, .btn-ghost, .athlo-card, .gym-rail-item, .product-card-bespoke';
  
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.add('active');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.remove('active');
    }
  });
}

// 3. Sticky Header Blur
function initStickyHeader() {
  const header = document.querySelector('.athlo-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.style.background = 'rgba(8, 8, 10, 0.95)';
      header.style.borderBottomColor = 'rgba(255, 255, 255, 0.12)';
      header.style.padding = '0.85rem 3.5rem';
    } else {
      header.style.background = 'rgba(17, 18, 22, 0.85)';
      header.style.borderBottomColor = 'rgba(255, 255, 255, 0.08)';
      header.style.padding = '1rem 3.5rem';
    }
  });
}

// 4. Floating Back to Top Button
function initBackToTop() {
  let backBtn = document.querySelector('.btn-back-to-top');
  if (!backBtn) {
    backBtn = document.createElement('button');
    backBtn.className = 'btn-back-to-top';
    backBtn.innerHTML = '↑';
    backBtn.setAttribute('title', 'Back to top');
    backBtn.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backBtn);
  }

  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backBtn.style.opacity = '1';
      backBtn.style.pointerEvents = 'auto';
    } else {
      backBtn.style.opacity = '0';
      backBtn.style.pointerEvents = 'none';
    }
  });
}

// 5. Natural Animated Numerical Counters
function initStatCounters() {
  const statDigits = document.querySelectorAll('.counter-val');
  if (!statDigits.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        animateValue(entry.target);
      }
    });
  }, { threshold: 0.2 });

  statDigits.forEach(d => observer.observe(d));
}

function animateValue(elem) {
  const text = elem.textContent.trim();
  const numMatch = text.match(/\d[\d,]*/);
  if (!numMatch) return;

  const targetNum = parseInt(numMatch[0].replace(/,/g, ''), 10);
  if (isNaN(targetNum) || targetNum === 0) return;

  const prefix = text.split(numMatch[0])[0];
  const suffix = text.split(numMatch[0])[1] || '';

  const duration = 1000;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(easeProgress * targetNum);
    
    elem.textContent = `${prefix}${current.toLocaleString()}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      elem.textContent = `${prefix}${targetNum.toLocaleString()}${suffix}`;
    }
  }

  requestAnimationFrame(update);
}
