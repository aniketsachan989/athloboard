/**
 * ATHLOBOARD REFINED INTERACTIVE & RESPONSIVE ENGINE
 * Features: Mobile Navigation Drawer, Scroll-Triggered Text & Card Reveals, Sleek Micro-Cursor, Sticky Header Blur, Eased Counters, Back-to-Top
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initSleekCursor();
  initStickyHeader();
  initBackToTop();
  initScrollReveals();
  initStatCounters();
});

// 1. Full Mobile Navigation Drawer System
function initMobileNav() {
  const header = document.querySelector('.athlo-header');
  if (!header) return;

  // 1. Create and inject mobile hamburger toggle button into header if not present
  let menuBtn = header.querySelector('.athlo-menu-btn');
  if (!menuBtn) {
    menuBtn = document.createElement('button');
    menuBtn.className = 'athlo-menu-btn';
    menuBtn.setAttribute('aria-label', 'Open navigation menu');
    menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    header.appendChild(menuBtn);
  }

  // 2. Create and inject full-screen mobile navigation drawer into body if not present
  let drawer = document.querySelector('.mobile-nav-drawer');
  if (!drawer) {
    drawer = document.createElement('div');
    drawer.className = 'mobile-nav-drawer';
    
    // Determine path prefix based on location
    const isDashboard = window.location.pathname.includes('/dashboard/');
    const pfx = isDashboard ? '../' : '';

    drawer.innerHTML = `
      <div>
        <div class="mobile-drawer-header">
          <a href="${pfx}index.html" class="athlo-brand">
            <div class="athlo-brand-icon"><i class="fa-solid fa-bolt"></i></div>
            ATHLO<span>BOARD</span>
          </a>
          <button class="mobile-drawer-close" aria-label="Close navigation"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <ul class="mobile-nav-list">
          <li>
            <a href="${pfx}index.html" class="mobile-nav-item">
              <span><i class="fa-solid fa-house text-volt" style="margin-right: 0.75rem;"></i> Home</span>
              <i class="fa-solid fa-chevron-right" style="font-size: 0.8rem; color: var(--text-slate);"></i>
            </a>
          </li>
          <li>
            <a href="${pfx}search-gyms.html" class="mobile-nav-item">
              <span><i class="fa-solid fa-dumbbell text-gold" style="margin-right: 0.75rem;"></i> Verified Gyms</span>
              <i class="fa-solid fa-chevron-right" style="font-size: 0.8rem; color: var(--text-slate);"></i>
            </a>
          </li>
          <li>
            <a href="${pfx}marketplace.html" class="mobile-nav-item">
              <span><i class="fa-solid fa-bottle-droplet text-volt" style="margin-right: 0.75rem;"></i> Supplements</span>
              <i class="fa-solid fa-chevron-right" style="font-size: 0.8rem; color: var(--text-slate);"></i>
            </a>
          </li>
          <li>
            <a href="${pfx}leaderboard.html" class="mobile-nav-item">
              <span><i class="fa-solid fa-trophy text-gold" style="margin-right: 0.75rem;"></i> SBD Rankings</span>
              <i class="fa-solid fa-chevron-right" style="font-size: 0.8rem; color: var(--text-slate);"></i>
            </a>
          </li>
          <li>
            <a href="${pfx}competitions.html" class="mobile-nav-item">
              <span><i class="fa-solid fa-medal text-cyan" style="margin-right: 0.75rem;"></i> Championships</span>
              <i class="fa-solid fa-chevron-right" style="font-size: 0.8rem; color: var(--text-slate);"></i>
            </a>
          </li>
          <li>
            <a href="${pfx}city-map.html" class="mobile-nav-item">
              <span><i class="fa-solid fa-map-location-dot text-cyan" style="margin-right: 0.75rem;"></i> City Radar</span>
              <i class="fa-solid fa-chevron-right" style="font-size: 0.8rem; color: var(--text-slate);"></i>
            </a>
          </li>
        </ul>
      </div>

      <div class="mobile-nav-actions-box">
        <a href="${pfx}login.html" class="btn-ghost" style="width: 100%; justify-content: center; padding: 0.85rem;">
          <i class="fa-solid fa-lock"></i> Business Login
        </a>
        <a href="${pfx}signup.html" class="btn-volt" style="width: 100%; justify-content: center; padding: 0.85rem;">
          <span>Partner Enrollment</span>
          <i class="fa-solid fa-arrow-right"></i>
        </a>
        <div style="font-size: 0.7rem; color: var(--text-muted); text-align: center; margin-top: 0.5rem;">
          &copy; 2026 Athloboard &bull; 100% Verified Athletic Network
        </div>
      </div>
    `;
    document.body.appendChild(drawer);

    // Event listeners
    const closeBtn = drawer.querySelector('.mobile-drawer-close');
    menuBtn.addEventListener('click', () => {
      drawer.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
    closeBtn.addEventListener('click', () => {
      drawer.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
}

// 2. Scroll-Triggered Sliding Text & Component Reveals (Guaranteed visibility on mobile)
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.slide-up-reveal, .slide-left-reveal, .slide-right-reveal, .card-stagger-reveal');
  if (!revealElements.length) return;

  if (window.innerWidth <= 992) {
    revealElements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '50px 0px 0px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

// 3. Refined Sleek Micro-Cursor (Desktop only)
function initSleekCursor() {
  if (window.innerWidth <= 1024) return;

  const cursor = document.createElement('div');
  cursor.className = 'athlo-cursor';
  document.body.appendChild(cursor);

  window.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  });

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

// 4. Sticky Header Blur
function initStickyHeader() {
  const header = document.querySelector('.athlo-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.style.background = 'rgba(8, 8, 10, 0.95)';
      header.style.borderBottomColor = 'rgba(255, 255, 255, 0.12)';
      if (window.innerWidth > 992) {
        header.style.padding = '0.85rem 3.5rem';
      }
    } else {
      header.style.background = 'rgba(17, 18, 22, 0.85)';
      header.style.borderBottomColor = 'rgba(255, 255, 255, 0.08)';
      if (window.innerWidth > 992) {
        header.style.padding = '1rem 3.5rem';
      }
    }
  });
}

// 5. Floating Back to Top Button
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

// 6. Natural Animated Numerical Counters
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
  }, { threshold: 0.1 });

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
