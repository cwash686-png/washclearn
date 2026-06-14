/* ============================================================
   WashGo — script.js
   Full-featured Vanilla JavaScript
   ============================================================ */

'use strict';

/* ─── Constants ──────────────────────────────────────────── */
/* ─── Vehicle → Service Price Matrix ─────────────────────── */
const VEHICLE_SERVICES = {
  bike: [
    { key: 'bike-basic',   label: '🏍️ Basic Wash',          price: 149 },
    { key: 'bike-foam',    label: '🧴 Foam Wash',             price: 249 },
    { key: 'deep-clean',   label: '🧽 Deep Engine Clean',    price: 399 },
    { key: 'detailing',    label: '✨ Full Detailing',        price: 899 },
    { key: 'monthly',      label: '🗓️ Monthly (4 Washes)',    price: 599 },
  ],
  auto: [
    { key: 'car-basic',    label: '🛺 Basic Auto Wash',       price: 199 },
    { key: 'foam-wash',    label: '🧴 Premium Foam Wash',    price: 299 },
    { key: 'interior',     label: '🧼 Interior Deep Clean',  price: 499 },
    { key: 'detailing',    label: '✨ Full Detailing',       price: 999 },
    { key: 'monthly',      label: '🗓️ Monthly (4 Washes)',   price: 799 },
  ],
  'car-hatch': [
    { key: 'car-basic',    label: '🚗 Basic Car Wash',         price: 249 },
    { key: 'foam-wash',    label: '🧴 Premium Foam Wash',      price: 399 },
    { key: 'interior',     label: '🧼 Interior Deep Clean',    price: 699 },
    { key: 'detailing',    label: '✨ Full Detailing',         price: 1499 },
    { key: 'monthly',      label: '🗓️ Monthly (4 Washes)',     price: 1299 },
  ],
  'car-sedan': [
    { key: 'car-basic',    label: '🚙 Basic Car Wash',         price: 299 },
    { key: 'foam-wash',    label: '🧴 Premium Foam Wash',      price: 449 },
    { key: 'interior',     label: '🧼 Interior Deep Clean',    price: 799 },
    { key: 'detailing',    label: '✨ Full Detailing',         price: 1799 },
    { key: 'monthly',      label: '🗓️ Monthly (4 Washes)',     price: 1499 },
  ],
  suv: [
    { key: 'car-basic',    label: '🚐 Basic SUV Wash',         price: 349 },
    { key: 'foam-wash',    label: '🧴 Premium Foam Wash',      price: 549 },
    { key: 'interior',     label: '🧼 Interior Deep Clean',    price: 999 },
    { key: 'detailing',    label: '✨ Full Detailing',         price: 2499 },
    { key: 'monthly',      label: '🗓️ Monthly (4 Washes)',     price: 1999 },
  ],
  truck: [
    { key: 'car-basic',    label: '🚚 Basic Wash',             price: 449 },
    { key: 'foam-wash',    label: '🧴 Premium Foam Wash',      price: 649 },
    { key: 'interior',     label: '🧼 Interior Deep Clean',    price: 1199 },
    { key: 'detailing',    label: '✨ Full Detailing',         price: 2999 },
    { key: 'monthly',      label: '🗓️ Monthly (4 Washes)',     price: 2499 },
  ],
};

/* Flat lookup used elsewhere (built dynamically) */
const SERVICE_PRICES = {};

const COUPON_CODES = {
  'WASHGO10': { type: 'percent', value: 10, desc: '10% off' },
  'FIRST50':  { type: 'flat',    value: 50, desc: '₹50 off for first booking' },
  'SAVE100':  { type: 'flat',    value: 100, desc: '₹100 off on orders above ₹500' },
  'PREMIUM20':{ type: 'percent', value: 20, desc: '20% off on premium services' },
};

const STATUS_STEPS = [
  { icon: '📋', label: 'Booked',          desc: 'Your booking has been received and confirmed.' },
  { icon: '👷', label: 'Worker Assigned', desc: 'A skilled wash specialist has been assigned to you.' },
  { icon: '🛵', label: 'On The Way',      desc: 'Your wash specialist is heading to your location.' },
  { icon: '🧼', label: 'Service Started', desc: 'Washing in progress. Sit back and relax!' },
  { icon: '✅', label: 'Completed',       desc: 'Your vehicle is sparkling clean! Enjoy!' },
];

const TESTIMONIALS = [
  { name: 'Arjun Sharma',  city: 'Mumbai',    rating: 5, text: 'WashGo is absolutely fantastic! My car has never looked this clean. The professional showed up right on time and did an incredible job.', service: 'Premium Foam Wash', avatar: 'A' },
  { name: 'Priya Patel',   city: 'Ahmedabad', rating: 5, text: 'I love the convenience. Booked the bike wash while having my morning tea and by the afternoon my scooter was spotless. 10/10!', service: 'Bike Wash', avatar: 'P' },
  { name: 'Rohit Kumar',   city: 'Delhi',     rating: 4, text: 'Great interior cleaning service. They did an amazing job on the seats and dashboard. Will definitely go with the monthly subscription.', service: 'Interior Cleaning', avatar: 'R' },
  { name: 'Sneha Iyer',    city: 'Bangalore', rating: 5, text: 'Full detailing was worth every rupee. The team was professional, on time and very thorough. My car looks brand new!', service: 'Full Detailing', avatar: 'S' },
  { name: 'Vikram Mehta',  city: 'Pune',      rating: 5, text: 'Monthly subscription is a steal. Getting my car washed regularly without any hassle is a game-changer. Highly recommended!', service: 'Monthly Subscription', avatar: 'V' },
  { name: 'Kavya Nair',    city: 'Chennai',   rating: 4, text: 'Super easy to book, the app is smooth and the service was great. Car wash in 45 mins flat. Love using WashGo!', service: 'Car Wash', avatar: 'K' },
  { name: 'Rahul Verma',   city: 'Jaipur',    rating: 5, text: 'The attention to detail is unmatched. They even cleaned the areas I usually miss. Truly a premium experience.', service: 'Premium Foam Wash', avatar: 'R' },
  { name: 'Anjali Gupta',  city: 'Lucknow',   rating: 5, text: 'Excellent service! The staff was polite and well-equipped. Eco-friendly products are a big plus for me.', service: 'Full Detailing', avatar: 'A' },
  { name: 'Siddharth S.',  city: 'Gurgaon',   rating: 5, text: 'I was skeptical about doorstep wash, but WashGo proved me wrong. My SUV is sparkling! Great value for money.', service: 'SUV Foam Wash', avatar: 'S' },
  { name: 'Megha Rao',     city: 'Hyderabad', rating: 4, text: 'Very professional. They called before arriving and finished exactly within the estimated time. Highly impressed!', service: 'Bike Wash', avatar: 'M' },
  { name: 'Ishaan K.',     city: 'Chandigarh',rating: 5, text: 'Best detailing service in the city. They used high-quality ceramic spray that made my car shine for weeks.', service: 'Full Detailing', avatar: 'I' },
  { name: 'Tanvi Shah',    city: 'Surat',     rating: 5, text: 'I book every two weeks. The consistency and quality are always top-notch. The foam wash is my favorite!', service: 'Premium Foam Wash', avatar: 'T' },
  { name: 'Karan Mehra',   city: 'Amritsar',  rating: 5, text: 'Finally a reliable doorstep service. No more wasting weekends at the local car wash. 5 stars!', service: 'Car Basic Wash', avatar: 'K' },
  { name: 'Neha Das',      city: 'Kolkata',   rating: 4, text: 'Interior deep clean removed some really old stains. Very happy with the results. Will book again.', service: 'Interior Deep Clean', avatar: 'N' },
  { name: 'Varun T.',      city: 'Bhopal',    rating: 5, text: 'Great for bike enthusiasts. They know how to handle high-end bikes with care. Thoroughly recommended.', service: 'Deep Engine Clean', avatar: 'V' },
  { name: 'Sonia G.',      city: 'Indore',    rating: 5, text: 'Prompt, professional, and perfect. The monthly plan is great for busy professionals like me. Thank you WashGo!', service: 'Monthly Plan', avatar: 'S' },
];

/* ─── State ──────────────────────────────────────────────── */
let state = {
  darkMode: false,
  mobileNavOpen: false,
  lang: 'en',
  selectedTime: null,
  selectedPayment: 'cash',
  appliedCoupon: null,
  currentStatusStep: 0,
  statusInterval: null,
  vehicleQty: 1,
  cart: [],
  bookings: JSON.parse(localStorage.getItem('washgo_bookings') || '[]'),
  lastBooking: null,
};

/* ─── DOM Helpers ────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const el = (tag, cls, html) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  return e;
};

/* ═══════════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initParticles();
  initNavbar();
  initTheme();
  initSmoothScroll();
  initAnimatedCounters();
  initTestimonials();
  initBookingForm();
  initStatusTracker();
  initServiceCards();
  initMobileNav();
  renderBookingHistory();
  renderMyBookings();
  setMinDate();
  initFOMOToasts();
  initStarRating();
  initSupportForm();
  initAddressAutocomplete();
  initLanguageSelector();
  initFeatureButtons();
  
  // Initialize Scroll Reveal LAST so it sees all dynamic content
  initScrollReveal();

  // Check URL parameters to auto-trigger customer login modal
  const params = new URLSearchParams(window.location.search);
  if (params.get('login') === 'true') {
    setTimeout(() => {
      if (typeof openLoginModal === 'function') openLoginModal();
    }, 1000);
  }
});

/* ─── Loader ──────────────────────────────────────────────── */
function initLoader() {
  const loader = $('#loading-screen');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 800);
  });
  // Fallback
  setTimeout(() => loader && loader.classList.add('hidden'), 2500);
}

/* ─── Social Proof / FOMO Toasts ──────────────────────────── */
function initFOMOToasts() {
  const container = $('#toast-container');
  if (!container) return;

  const names = ['Amit S.', 'Priya M.', 'Rahul K.', 'Sneha R.', 'Vikram D.', 'Neha P.', 'Rohan G.', 'Anjali V.', 'Karan B.', 'Pooja J.', 'Aditya N.', 'Shruti T.'];
  const services = ['Bike Wash', 'Premium Foam Wash', 'Basic Car Wash', 'SUV Foam Wash'];
  const locations = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai', 'Ahmedabad', 'Kolkata'];

  function showRandomToast() {
    const name = names[Math.floor(Math.random() * names.length)];
    const service = services[Math.floor(Math.random() * services.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const timeAgo = Math.floor(Math.random() * 59) + 1; // 1 to 59 mins
    const initials = name.split(' ').map(n => n[0]).join('');

    const toast = document.createElement('div');
    toast.className = 'toast info';
    toast.innerHTML = `
      <div style="width:38px;height:38px;border-radius:50%;background:var(--primary);color:var(--text-white);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9rem;flex-shrink:0;">
        ${initials}
      </div>
      <div style="display:flex;flex-direction:column;line-height:1.4;">
        <span class="toast-msg"><strong style="color:var(--primary);">${name}</strong> booked a wash</span>
        <span style="font-size:0.8rem;color:var(--text-secondary);">${service} • ${timeAgo} mins ago</span>
      </div>
    `;

    // Add to container
    container.appendChild(toast);

    // Remove toast after 5 seconds
    setTimeout(() => {
      toast.classList.add('hiding');
      setTimeout(() => toast.remove(), 400);
    }, 5000);
  }

  // Initial delay, then fire randomly between 12 and 25 seconds
  setTimeout(() => {
    showRandomToast();
    setInterval(showRandomToast, Math.floor(Math.random() * 13000) + 12000);
  }, 4000);
}

/* ─── Particles ───────────────────────────────────────────── */
function initParticles() {
  const bg = $('.hero-bg');
  if (!bg) return;
  const sizes  = [4, 6, 8, 12, 16];
  const delays = [0, 2, 4, 6, 8, 10];
  const durations = [15, 20, 25, 30, 35];
  for (let i = 0; i < 25; i++) {
    const p = el('div', 'particle');
    const s = sizes[Math.floor(Math.random() * sizes.length)];
    p.style.cssText = `
      width:${s}px;height:${s}px;
      left:${Math.random() * 100}%;
      bottom:-${s}px;
      animation-duration:${durations[Math.floor(Math.random() * durations.length)]}s;
      animation-delay:${delays[Math.floor(Math.random() * delays.length)]}s;
      opacity:${0.04 + Math.random() * 0.08};
    `;
    bg.appendChild(p);
  }
}

/* ─── Navbar ──────────────────────────────────────────────── */
function initNavbar() {
  const nav = $('#navbar');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
    updateActiveNavLink();
  }, { passive: true });

  // Active link highlight
  updateActiveNavLink();
}

function updateActiveNavLink() {
  const sections = $$('section[id]');
  const scrollY  = window.scrollY + 100;
  let current = '';

  sections.forEach(sec => {
    if (sec.offsetTop <= scrollY) current = sec.id;
  });

  $$('.nav-menu a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
}

/* ─── Mobile Nav ──────────────────────────────────────────── */
function initMobileNav() {
  const hamburger  = $('#hamburger');
  const mobileNav  = $('#mobile-nav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    state.mobileNavOpen = !state.mobileNavOpen;
    hamburger.classList.toggle('open', state.mobileNavOpen);
    mobileNav.classList.toggle('open', state.mobileNavOpen);
  });

  // Close on link click
  $$('.mobile-nav a, .mobile-book-btn').forEach(a => {
    a.addEventListener('click', () => {
      state.mobileNavOpen = false;
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (state.mobileNavOpen && !hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
      state.mobileNavOpen = false;
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
    }
  });
}

/* ─── Theme Toggle ────────────────────────────────────────── */
function initTheme() {
  const saved = localStorage.getItem('washgo_theme');
  if (saved === 'light') {
    enableLight();
  } else {
    enableDark();
  }

  const toggle = document.getElementById('theme-toggle');
  if (toggle) toggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
  const isLight = document.body.classList.contains('light-mode');
  isLight ? enableDark() : enableLight();
}

function enableDark() {
  document.body.classList.remove('light-mode');
  document.body.classList.add('dark-mode');
  state.darkMode = true;
  const toggle = document.getElementById('theme-toggle');
  if (toggle) toggle.textContent = '☀️';
  localStorage.setItem('washgo_theme', 'dark');
}

function enableLight() {
  document.body.classList.add('light-mode');
  document.body.classList.remove('dark-mode');
  state.darkMode = false;
  const toggle = document.getElementById('theme-toggle');
  if (toggle) toggle.textContent = '🌙';
  localStorage.setItem('washgo_theme', 'light');
}

/* ─── Smooth Scroll ───────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id  = a.getAttribute('href').slice(1);
      const tgt = document.getElementById(id);
      if (!tgt) return;
      e.preventDefault();
      const top = tgt.offsetTop - parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-h'));
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ─── Scroll Reveal ───────────────────────────────────────── */
function initScrollReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  $$('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));
}

/* ─── Animated Counters ───────────────────────────────────── */
function initAnimatedCounters() {
  const counters = $$('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

function animateCount(el) {
  const target   = parseInt(el.dataset.count);
  const suffix   = el.dataset.suffix || '';
  const duration = 2000;
  const step     = target / (duration / 16);
  let current    = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString('en-IN') + suffix;
  }, 16);
}

/* ─── Testimonials ────────────────────────────────────────── */
function initTestimonials() {
  const track = $('#testimonials-track');
  if (!track) return;

  TESTIMONIALS.forEach(t => {
    const stars = '★'.repeat(t.rating) + '☆'.repeat(5 - t.rating);
    const card = el('div', 'review-card reveal');
    card.innerHTML = `
      <div class="review-header">
        <div class="review-avatar">${t.avatar}</div>
        <div class="review-meta">
          <strong>${t.name}</strong>
          <span>📍 ${t.city}</span>
          <div class="stars">${stars}</div>
        </div>
      </div>
      <p class="review-text">"${t.text}"</p>
      <span class="review-service">${t.service}</span>
    `;
    track.appendChild(card);
  });

  // Navigation
  const prevBtn = $('#t-prev');
  const nextBtn = $('#t-next');
  if (prevBtn) prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -340, behavior: 'smooth' });
    stopAutoPlay();
  });
  if (nextBtn) nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: 340, behavior: 'smooth' });
    stopAutoPlay();
  });

  // Auto-play
  let autoPlayInterval = setInterval(() => {
    if (track.scrollLeft + track.offsetWidth >= track.scrollWidth - 10) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: 340, behavior: 'smooth' });
    }
  }, 4000);

  function stopAutoPlay() {
    clearInterval(autoPlayInterval);
    // Restart after 10s of inactivity
    setTimeout(() => {
      // (Re-logic if desired, but stopping is safer for UX)
    }, 10000);
  }

  track.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
  track.addEventListener('mouseleave', () => {
    autoPlayInterval = setInterval(() => {
      if (track.scrollLeft + track.offsetWidth >= track.scrollWidth - 10) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: 340, behavior: 'smooth' });
      }
    }, 4000);
  });
}

/* ─── Service Cards ───────────────────────────────────────── */
function initServiceCards() {
  $$('.btn-book-card').forEach(btn => {
    btn.addEventListener('click', e => {
      const serviceKey = btn.closest('.service-card').dataset.service;
      // Pre-fill service dropdown
      const sel = $('#service-type');
      if (sel && serviceKey) sel.value = serviceKey;
      updatePrice();

      // Scroll to booking
      const bookSec = $('#booking');
      if (bookSec) {
        const top = bookSec.offsetTop - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
      showToast('✨ Service selected! Fill in your details to book.', 'info');
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   BOOKING FORM
═══════════════════════════════════════════════════════════ */
function initBookingForm() {
  initTimeSlots();
  initPaymentSelect();
  initCoupon();
  initPriceUpdater();

  // Handle URL parameters (e.g. from pricing.html)
  const params = new URLSearchParams(window.location.search);
  const plan = params.get('plan');
  if (plan) {
    const map = { bike: 'monthly-sub', car: 'monthly-sub', premium: 'monthly-sub' };
    const sel = document.getElementById('service-type');
    if (sel) {
      sel.value = map[plan] || 'monthly-sub';
      if (typeof updatePrice === 'function') updatePrice();
      showToast(`📦 ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan pre-selected!`, 'info');
    }
  }

  const form = $('#booking-form');
  if (form) form.addEventListener('submit', handleFormSubmit);

  // WhatsApp button
  const waBtn = $('#btn-whatsapp');
  if (waBtn) waBtn.addEventListener('click', handleWhatsAppBooking);
}

function setMinDate() {
  const dateInput = $('#booking-date');
  if (!dateInput) return;
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;
  dateInput.value = today;
}

/* ── Time Slots ── */
function initTimeSlots() {
  const container = $('#time-slots-container');
  if (!container) return;

  const slots = ['7:00 AM','8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM',
                 '1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM'];
  const unavail = ['12:00 PM', '5:00 PM'];

  container.innerHTML = '';
  slots.forEach(slot => {
    const div = el('div', `time-slot${unavail.includes(slot) ? ' unavailable' : ''}`);
    div.textContent = slot;
    if (!unavail.includes(slot)) {
      div.addEventListener('click', () => {
        $$('.time-slot').forEach(s => s.classList.remove('selected'));
        div.classList.add('selected');
        state.selectedTime = slot;
        clearFieldError('time-slot');
        const hiddenTime = document.getElementById('hidden-time-slot');
        if (hiddenTime) hiddenTime.value = slot;
      });
    }
    container.appendChild(div);
  });
}

/* ── Payment Select ── */
function initPaymentSelect() {
  $$('.pay-option').forEach(opt => {
    opt.addEventListener('click', () => {
      $$('.pay-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      state.selectedPayment = opt.dataset.pay;
      const hiddenPay = document.getElementById('hidden-payment-method');
      if (hiddenPay) hiddenPay.value = opt.dataset.pay;
    });
  });
  // Default select first
  const first = $('.pay-option');
  if (first) first.classList.add('selected');
}

/* ── Coupon ── */
function initCoupon() {
  const btn = $('#apply-coupon-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const input = $('#coupon-input');
    const code  = input.value.trim().toUpperCase();
    const couponInfo = COUPON_CODES[code];

    if (!code) { showToast('Please enter a coupon code.', 'error'); return; }

    if (couponInfo) {
      state.appliedCoupon = { code, ...couponInfo };
      updatePrice();
      showToast(`🎉 Coupon "${code}" applied — ${couponInfo.desc}!`, 'success');
      input.classList.add('success');
      btn.textContent = '✓ Applied';
      btn.style.background = 'var(--success)';
      btn.style.color = 'white';
      btn.style.borderColor = 'var(--success)';
    } else {
      showToast('Invalid coupon code. Try WASHGO10, FIRST50 or SAVE100.', 'error');
      input.classList.add('error');
      state.appliedCoupon = null;
      updatePrice();
    }
  });
}

/* ── Price Calculator ── */
function initPriceUpdater() {
  const vehicleSelect  = $('#vehicle-type');
  const serviceSelect  = $('#service-type');
  if (vehicleSelect) vehicleSelect.addEventListener('change', () => { updateServiceOptions(); });
  initQtyStepper();
  
  const addBtn = $('#btn-add-vehicle');
  if (addBtn) addBtn.addEventListener('click', addVehicleToCart);
  
  updatePrice();
}

function initQtyStepper() {
  const minusBtn = $('#qty-minus');
  const plusBtn  = $('#qty-plus');
  const qtyInput = $('#vehicle-qty');
  const hint     = $('#qty-hint');

  if (!minusBtn || !plusBtn || !qtyInput) return;

  function setQty(val) {
    val = Math.max(1, Math.min(5, val));
    state.vehicleQty = val;
    qtyInput.value   = val;
    if (hint) hint.textContent = `× ${val} vehicle${val > 1 ? 's' : ''}`;
    minusBtn.disabled = val <= 1;
    plusBtn.disabled  = val >= 5;
    updatePrice();
  }

  minusBtn.addEventListener('click', () => setQty(state.vehicleQty - 1));
  plusBtn.addEventListener('click',  () => setQty(state.vehicleQty + 1));
  setQty(1);
}

function updateServiceOptions() {
  const vehicleKey = $('#vehicle-type')?.value;
  const serviceEl  = $('#service-type');
  const hint       = $('#service-vehicle-hint');
  if (!serviceEl) return;

  const VEHICLE_LABELS = {
    bike: 'Bike / Scooter', auto: 'Auto Rickshaw', 'car-hatch': 'Hatchback',
    'car-sedan': 'Sedan', suv: 'SUV / MUV', truck: 'Truck / Van',
  };

  if (!vehicleKey) {
    serviceEl.innerHTML = '<option value="">← Select vehicle first</option>';
    serviceEl.disabled = true;
    if (hint) hint.textContent = '';
    return;
  }

  const services = VEHICLE_SERVICES[vehicleKey] || [];
  serviceEl.disabled = false;
  serviceEl.innerHTML = services.map(s => `<option value="${s.key}">${s.label} — ₹${s.price.toLocaleString('en-IN')}</option>`).join('');

  if (hint) hint.textContent = `for ${VEHICLE_LABELS[vehicleKey] || ''}`;

  // Update SERVICE_PRICES lookup from current vehicle
  services.forEach(s => { SERVICE_PRICES[s.key] = s.price; });
}

/* ── Cart Logic ── */
function addVehicleToCart() {
  const vSelect = $('#vehicle-type');
  const sSelect = $('#service-type');
  
  if (!vSelect.value) { setFieldError('vehicle-type', 'Select a vehicle first.'); return; }
  else clearFieldError('vehicle-type');
  
  if (!sSelect.value) { setFieldError('service-type', 'Select a service.'); return; }
  else clearFieldError('service-type');

  const VEHICLE_LABELS = {
    bike: 'Bike / Scooter', auto: 'Auto Rickshaw', 'car-hatch': 'Hatchback',
    'car-sedan': 'Sedan', suv: 'SUV / MUV', truck: 'Truck / Van',
  };

  const vKey   = vSelect.value;
  const sKey   = sSelect.value;
  const sLabel = sSelect.options[sSelect.selectedIndex].text.split(' — ')[0];
  const qty    = state.vehicleQty;
  const price  = VEHICLE_SERVICES[vKey].find(s => s.key === sKey).price;

  const item = {
    id: Date.now().toString(),
    vehicleKey: vKey,
    vehicleLabel: VEHICLE_LABELS[vKey],
    serviceKey: sKey,
    serviceLabel: sLabel,
    qty: qty,
    basePrice: price,
    subtotal: price * qty
  };

  state.cart.push(item);
  showToast(`Added ${qty}x ${VEHICLE_LABELS[vKey]} to booking!`, 'success');
  
  // Reset form inputs for next addition
  vSelect.value = '';
  document.getElementById('vehicle-qty').value = 1;
  state.vehicleQty = 1;
  updateServiceOptions();
  
  renderCart();
  updatePrice();
  
  // Clear cart missing error
  const cartErr = $('#cart-error');
  if (cartErr) cartErr.textContent = '';
}

function removeFromCart(id) {
  state.cart = state.cart.filter(item => item.id !== id);
  renderCart();
  updatePrice();
}

window.removeFromCart = removeFromCart; // Expose for inline onclick

function renderCart() {
  const block = $('#cart-summary-block');
  const list = $('#cart-items');
  if (!block || !list) return;

  if (state.cart.length === 0) {
    block.style.display = 'none';
    return;
  }
  
  block.style.display = 'block';
  list.innerHTML = state.cart.map(item => `
    <div class="cart-item">
      <div class="ci-details">
        <span class="ci-title">${item.qty}× ${item.vehicleLabel}</span>
        <span class="ci-sub">${item.serviceLabel}</span>
      </div>
      <div class="ci-price-wrap">
        <span class="ci-price">₹${item.subtotal.toLocaleString('en-IN')}</span>
        <button type="button" class="btn-remove-item" onclick="removeFromCart('${item.id}')" aria-label="Remove item">✕</button>
      </div>
    </div>
  `).join('');
}

function updatePrice() {
  let baseTot = 0;
  let totalQty = 0;
  state.cart.forEach(item => {
    baseTot += item.subtotal;
    totalQty += item.qty;
  });

  const basePrice  = baseTot;
  const gst        = Math.round(basePrice * 0.18);
  let discount     = 0;

  if (state.appliedCoupon) {
    const c = state.appliedCoupon;
    if (c.type === 'percent') discount = Math.round(basePrice * c.value / 100);
    else if (c.type === 'flat') discount = c.value;
  }

  const total = Math.max(0, basePrice + gst - discount);

  const setText = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };

  setText('price-base', basePrice ? `₹${basePrice.toLocaleString('en-IN')} (${totalQty} item${totalQty>1?'s':''})` : '—');
  setText('price-gst',      basePrice ? `₹${gst.toLocaleString('en-IN')}` : '—');
  setText('price-discount', discount  ? `-₹${discount.toLocaleString('en-IN')}` : '₹0');
  setText('price-total',    basePrice ? `₹${total.toLocaleString('en-IN')}` : '—');

  const hiddenTotal = document.getElementById('hidden-total-payable');
  if (hiddenTotal) hiddenTotal.value = basePrice ? total : 0;
}

/* ── Form Submit ── */
function handleFormSubmit(e) {
  e.preventDefault();
  if (!validateForm()) return;
  submitBooking();
}

function validateForm() {
  let valid = true;

  const rules = [
    { id: 'full-name',    msg: 'Please enter your full name.' },
    { id: 'phone',        msg: 'Please enter a valid 10-digit phone number.', pattern: /^[6-9]\d{9}$/ },
    { id: 'booking-date', msg: 'Please select a date.' },
    { id: 'address',      msg: 'Please enter your address.' },
  ];

  rules.forEach(rule => {
    const input = document.getElementById(rule.id);
    if (!input) return;
    const val = input.value.trim();
    let ok = !!val;
    if (ok && rule.pattern) ok = rule.pattern.test(val);
    if (!ok) { setFieldError(rule.id, rule.msg); valid = false; }
    else clearFieldError(rule.id);
  });

  if (!state.selectedTime) {
    setFieldError('time-slot', 'Please select a time slot.');
    valid = false;
  } else clearFieldError('time-slot');

  if (state.cart.length === 0) {
    const cartErr = $('#cart-error');
    if (cartErr) cartErr.textContent = 'Your booking cart is empty. Please add a vehicle before confirming.';
    cartErr.style.display = 'block';
    
    // Check if user has entered data in the vehicle entry but forgot to press 'Add'
    const vSelect = $('#vehicle-type');
    const sSelect = $('#service-type');
    if (vSelect && sSelect && vSelect.value && sSelect.value) {
      showToast('You forgot to click "Add to Booking"! Adding it for you now.', 'info');
      addVehicleToCart();
      valid = state.cart.length > 0;
    } else {
      valid = false;
      showToast('Please add at least one vehicle to your booking.', 'error');
    }
  }

  return valid;
}

function setFieldError(id, msg) {
  const group = document.querySelector(`[data-field="${id}"]`);
  if (!group) return;
  group.classList.add('has-error');
  const errEl = group.querySelector('.field-error');
  if (errEl) errEl.textContent = msg;

  const input = document.getElementById(id);
  if (input) input.classList.add('error');
}

function clearFieldError(id) {
  const group = document.querySelector(`[data-field="${id}"]`);
  if (group) group.classList.remove('has-error');
  const input = document.getElementById(id);
  if (input) { input.classList.remove('error'); input.classList.add('success'); }
}

function submitBooking() {
  const form = document.getElementById('booking-form');
  const bookingId = generateBookingId();
  const data = collectFormData();
  data.bookingId    = bookingId;
  data.status       = 'Booked';
  data.createdAt    = new Date().toISOString();

  // Populate hidden fields for Formspree
  const hiddenBid = document.getElementById('hidden-booking-id');
  if (hiddenBid) hiddenBid.value = bookingId;
  
  const hiddenCart = document.getElementById('hidden-cart-details');
  if (hiddenCart) {
    hiddenCart.value = data.cart.map(item => `${item.qty}x ${item.vehicleLabel} (${item.serviceLabel}) - ₹${item.subtotal}`).join(' | ');
  }

  // Save to localStorage
  state.bookings.unshift(data);
  if (state.bookings.length > 20) state.bookings.pop();
  localStorage.setItem('washgo_bookings', JSON.stringify(state.bookings));
  state.lastBooking = data;

  // Send to Formspree
  const submitBtn = document.getElementById('confirm-booking-btn');
  const originalText = submitBtn ? submitBtn.innerHTML : '';
  if (submitBtn) {
    submitBtn.innerHTML = 'Booking...';
    submitBtn.disabled = true;
  }

  // Save to Firebase (New Backend)
  if (window.saveBookingToFirebase) {
    window.saveBookingToFirebase(data);
  }

  const endpoint = form.getAttribute('action') || 'https://formspree.io/f/myklnyrq';
  
  fetch(endpoint, {
    method: 'POST',
    body: new FormData(form),
    headers: {
      'Accept': 'application/json'
    }
  })
  .then(response => {
    if (response.ok) {
      showSuccessModal(data);
      renderBookingHistory();
      renderMyBookings();
      form.reset();
      state.cart = [];
      renderCart();
      updatePrice();
    } else {
      showToast('Booking saved locally, but email notification failed.', 'warning');
      showSuccessModal(data);
      renderBookingHistory();
      renderMyBookings();
    }
  })
  .catch(error => {
    console.error('Formspree error:', error);
    showToast('Booking saved locally (Offline mode).', 'info');
    showSuccessModal(data);
    renderBookingHistory();
    renderMyBookings();
  })
  .finally(() => {
    if (submitBtn) {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}

function collectFormData() {
  const get = id => document.getElementById(id)?.value?.trim() || '';
  
  let baseTot = 0;
  let totalQty = 0;
  state.cart.forEach(item => {
    baseTot += item.subtotal;
    totalQty += item.qty;
  });

  const basePrice   = baseTot;
  const gst         = Math.round(basePrice * 0.18);
  let discount      = 0;
  if (state.appliedCoupon) {
    const c = state.appliedCoupon;
    if (c.type === 'percent') discount = Math.round(basePrice * c.value / 100);
    else if (basePrice >= 500 || c.type === 'flat') discount = c.value;
  }

  // Create a summary name for the service
  let mainServiceLabel = state.cart.length === 1 
    ? state.cart[0].serviceLabel 
    : `Multiple Services (${totalQty} Items)`;

  return {
    name:      get('full-name'),
    phone:     get('phone'),
    cart:      [...state.cart], // deep copy cart
    qty:       totalQty,
    service:   mainServiceLabel, // For UI displays where it expects a single string
    date:      get('booking-date'),
    time:      state.selectedTime,
    address:   get('address'),
    payment:   state.selectedPayment,
    coupon:    state.appliedCoupon?.code || '',
    base:      basePrice,
    gst:       gst,
    discount:  discount,
    total:     Math.max(0, basePrice + gst - discount),
  };
}

function generateBookingId() {
  const chars   = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const prefix  = 'WG';
  let id = prefix;
  for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

/* ─── WhatsApp Booking ───────────────────────────────────── */
function handleWhatsAppBooking() {
  const name    = document.getElementById('full-name')?.value?.trim() || 'Customer';
  const phone   = document.getElementById('phone')?.value?.trim()     || '';
  const service = document.getElementById('service-type')?.value  || '';
  const vehicle = document.getElementById('vehicle-type')?.value  || '';
  const date    = document.getElementById('booking-date')?.value  || '';
  const time    = state.selectedTime || 'Not selected';
  const address = document.getElementById('address')?.value?.trim() || '';

  const msg = encodeURIComponent(
    `🚗 *WashGo Booking Request*\n\n` +
    `👤 Name: ${name}\n📞 Phone: ${phone}\n🚘 Vehicle: ${vehicle}\n🧼 Service: ${service}\n📅 Date: ${date}\n⏰ Time: ${time}\n📍 Address: ${address}\n\n_Sent via WashGo App_`
  );

  window.open(`https://wa.me/919999999999?text=${msg}`, '_blank');
}

/* ═══════════════════════════════════════════════════════════
   SUCCESS MODAL
═══════════════════════════════════════════════════════════ */
function showSuccessModal(data) {
  const overlay = $('#success-modal');
  if (!overlay) return;

  document.getElementById('modal-booking-id').textContent  = data.bookingId;
  document.getElementById('modal-name').textContent        = data.name;
  document.getElementById('modal-service').textContent     = data.service;
  document.getElementById('modal-date').textContent        = formatDate(data.date);
  document.getElementById('modal-time').textContent        = data.time;
  document.getElementById('modal-total').textContent       = `₹${data.total}`;
  document.getElementById('modal-payment').textContent     = data.payment;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Reset status tracker
  resetStatusTracker();
}

function closeModal(id) {
  const overlay = document.getElementById(id || 'success-modal');
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

/* Repeat booking */
function repeatLastBooking() {
  if (!state.lastBooking) return;
  const d = state.lastBooking;
  const set = (id, val) => { const e = document.getElementById(id); if (e) e.value = val; };
  set('full-name',    d.name);
  set('phone',        d.phone);
  set('vehicle-type', d.vehicle);
  set('service-type', d.service);
  set('address',      d.address);
  updatePrice();
  closeModal('success-modal');
  const bookSec = $('#booking');
  if (bookSec) window.scrollTo({ top: bookSec.offsetTop - 80, behavior: 'smooth' });
  showToast('♻️ Details pre-filled. Select date & time to rebook.', 'info');
}

/* ═══════════════════════════════════════════════════════════
   STATUS TRACKER
═══════════════════════════════════════════════════════════ */
function initStatusTracker() {
  renderStatusSteps();

  // Search by booking ID
  const searchBtn = $('#search-booking-btn');
  if (searchBtn) searchBtn.addEventListener('click', searchBookingById);

  const searchInput = $('#search-booking-id');
  if (searchInput) {
    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') searchBookingById();
    });
  }

  // Demo button
  const demoBtn = $('#btn-demo-status');
  if (demoBtn) demoBtn.addEventListener('click', runDemoStatus);
}

function renderStatusSteps(currentStep = 0) {
  const container = $('#steps-row');
  const fill      = $('#progress-fill');
  if (!container) return;

  container.innerHTML = '';
  STATUS_STEPS.forEach((step, i) => {
    const item = el('div', `step-item${i < currentStep ? ' done' : i === currentStep ? ' active' : ''}`);
    item.innerHTML = `
      <div class="step-circle">${step.icon}</div>
      <span class="step-label">${step.label}</span>
    `;
    container.appendChild(item);
  });

  if (fill) {
    const pct = currentStep === 0 ? 0 : (currentStep / (STATUS_STEPS.length - 1)) * 100;
    fill.style.width = `${pct}%`;
  }

  const cur = STATUS_STEPS[currentStep];
  const badge = $('#status-badge');
  const title = $('#status-title');
  const desc  = $('#status-desc');
  if (badge) badge.innerHTML = `<span class="dot"></span>${cur.label}`;
  if (title) title.textContent = `${cur.icon} ${cur.label}`;
  if (desc)  desc.textContent  = cur.desc;

  state.currentStatusStep = currentStep;
}

function resetStatusTracker() {
  if (state.statusInterval) clearInterval(state.statusInterval);
  state.currentStatusStep = 0;
  renderStatusSteps(0);

  let step = 0;
  state.statusInterval = setInterval(() => {
    step++;
    if (step >= STATUS_STEPS.length) {
      clearInterval(state.statusInterval);
      state.statusInterval = null;
      return;
    }
    renderStatusSteps(step);
  }, 3000);
}

function runDemoStatus() {
  resetStatusTracker();
  showToast('🚀 Demo tracking started! Watch the progress.', 'info');
  const sec = $('#status');
  if (sec) window.scrollTo({ top: sec.offsetTop - 80, behavior: 'smooth' });
}

function searchBookingById() {
  const input = $('#search-booking-id');
  if (!input) return;
  const id = input.value.trim().toUpperCase();

  if (!id) { showToast('Please enter a Booking ID.', 'error'); return; }

  const found = state.bookings.find(b => (b.bookingId || b.id) === id);
  if (found) {
    showToast(`✅ Booking found for ${found.name || found.customer || 'Customer'}! Status: ${found.status}`, 'success');
    resetStatusTracker();
  } else {
    showToast(`❌ Booking ID "${id}" not found. Try DEMO to see a simulation.`, 'error');
  }
}

/* ─── Booking History ─────────────────────────────────────── */
function renderBookingHistory() {
  const list = $('#booking-history-list');
  if (!list) return;

  if (!state.bookings.length) {
    list.innerHTML = '<p class="no-bookings">No bookings yet. Make your first booking above!</p>';
    return;
  }

  list.innerHTML = state.bookings.slice(0, 5).map((b, i) => {
    const isCancelled = b.status === 'Cancelled';
    const badgeClass  = isCancelled ? 'badge-cancelled' : 'badge-success';
    const bid         = b.bookingId || b.id || `WG-${i}`;
    const cancelBtn   = !isCancelled
      ? `<button class="btn-cancel-booking" onclick="showCancelModal('${bid}')" aria-label="Cancel booking ${bid}">❌ Cancel</button>`
      : '';

    // Determine vehicle emoji
    let vehicleEmoji = '🚗'; // default
    const vehicleStr = (b.vehicle || (b.cart && b.cart[0] && b.cart[0].vehicleLabel) || '').toLowerCase();
    const serviceStr = (b.service || '').toLowerCase();
    if (vehicleStr.includes('bike') || vehicleStr.includes('scooter') || serviceStr.includes('bike')) {
      vehicleEmoji = '🏍️';
    } else if (vehicleStr.includes('auto') || serviceStr.includes('auto')) {
      vehicleEmoji = '🛺';
    } else if (vehicleStr.includes('hatchback') || vehicleStr.includes('hatch') || serviceStr.includes('hatch')) {
      vehicleEmoji = '🚗';
    } else if (vehicleStr.includes('sedan') || serviceStr.includes('sedan')) {
      vehicleEmoji = '🚙';
    } else if (vehicleStr.includes('suv') || vehicleStr.includes('muv') || serviceStr.includes('suv')) {
      vehicleEmoji = '🚐';
    } else if (vehicleStr.includes('truck') || vehicleStr.includes('van') || serviceStr.includes('truck')) {
      vehicleEmoji = '🚚';
    }

    // Format service label - avoid double emojis if already present
    let displayService = b.service || '—';
    if (!displayService.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|\p{Emoji}/u)) {
      displayService = `${vehicleEmoji} ${displayService}`;
    }

    const displayTime = b.time ? ` · ${b.time}` : '';

    return `
    <div class="history-item${isCancelled ? ' hi-cancelled' : ''}" id="hi-${bid}">
      <div class="hi-left">
        <span class="hi-id">${bid}</span>
        <span class="hi-service">${displayService}${displayTime}</span>
      </div>
      <div class="hi-right">
        <span class="hi-date">${formatDate(b.date)}</span>
        <span class="badge ${badgeClass}">${b.status}</span>
        ${cancelBtn}
      </div>
    </div>`;
  }).join('');
}

/* ─── Cancel Booking ─────────────────────────────────────── */
let _pendingCancelId = null;

function showCancelModal(bookingId) {
  _pendingCancelId = bookingId;
  const booking = state.bookings.find(b => (b.bookingId || b.id) === bookingId);
  if (!booking) return;

  // Inject modal if not already present
  if (!document.getElementById('cancel-modal')) {
    const m = document.createElement('div');
    m.id = 'cancel-modal';
    m.className = 'modal-overlay cancel-modal-overlay';
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-modal', 'true');
    m.setAttribute('aria-labelledby', 'cancel-modal-title');
    m.innerHTML = `
      <div class="modal-box cancel-modal-box">
        <div class="cancel-modal-icon">🗑️</div>
        <h2 class="modal-title" id="cancel-modal-title">Cancel Booking?</h2>
        <p class="cancel-modal-desc" id="cancel-modal-desc"></p>
        <div class="cancel-modal-meta" id="cancel-modal-meta"></div>
        <p class="cancel-modal-note">⚠️ Cancellations made less than 2 hours before the slot may attract a small fee.</p>
        <div class="cancel-modal-actions">
          <button class="btn-keep" onclick="closeCancelModal()">Keep Booking</button>
          <button class="btn-confirm-cancel" id="btn-confirm-cancel" onclick="confirmCancelBooking()">Yes, Cancel</button>
        </div>
      </div>`;
    document.body.appendChild(m);
    // Close on backdrop click
    m.addEventListener('click', e => { if (e.target === m) closeCancelModal(); });
  }

  // Populate details
  const bid = booking.bookingId || booking.id;
  document.getElementById('cancel-modal-desc').textContent =
    `Are you sure you want to cancel the following booking?`;
  document.getElementById('cancel-modal-meta').innerHTML = `
    <div class="cmm-row"><span>Booking ID</span><strong>${bid}</strong></div>
    <div class="cmm-row"><span>Service</span><strong>${booking.service}</strong></div>
    <div class="cmm-row"><span>Date &amp; Time</span><strong>${formatDate(booking.date)} · ${booking.time || '—'}</strong></div>
    <div class="cmm-row"><span>Amount</span><strong>₹${booking.total || booking.price || 0}</strong></div>`;

  const modal = document.getElementById('cancel-modal');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Animate confirm button with countdown
  const btn = document.getElementById('btn-confirm-cancel');
  btn.disabled = true;
  btn.textContent = 'Yes, Cancel (3)';
  let sec = 3;
  const t = setInterval(() => {
    sec--;
    if (sec <= 0) {
      clearInterval(t);
      btn.disabled = false;
      btn.textContent = 'Yes, Cancel';
    } else {
      btn.textContent = `Yes, Cancel (${sec})`;
    }
  }, 1000);
}

function closeCancelModal() {
  const modal = document.getElementById('cancel-modal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
  _pendingCancelId = null;
}

function confirmCancelBooking() {
  if (!_pendingCancelId) return;
  const idx = state.bookings.findIndex(b => (b.bookingId || b.id) === _pendingCancelId);
  if (idx === -1) return;

  state.bookings[idx].status = 'Cancelled';
  state.bookings[idx].cancelledAt = new Date().toISOString();
  localStorage.setItem('washgo_bookings', JSON.stringify(state.bookings));

  closeCancelModal();
  renderBookingHistory();
  renderMyBookings();
  showToast(`🗑️ Booking ${_pendingCancelId} has been cancelled.`, 'warning', 4000);

  // Animate the card out
  const card = document.getElementById(`hi-${_pendingCancelId}`) || document.getElementById(`mbc-${_pendingCancelId}`);
  if (card) {
    card.style.transition = 'all 0.4s ease';
    card.style.opacity = '0.5';
  }
  _pendingCancelId = null;
}

/* ═══════════════════════════════════════════════════════════
   MY BOOKINGS SECTION
═══════════════════════════════════════════════════════════ */
let _mbFilter = 'all';

const MB_SERVICE_LABELS = {
  'bike-basic':  '🏍️ Bike Wash',
  'car-basic':   '🚗 Car Wash',
  'foam-wash':   '🧴 Foam Wash',
  'interior':    '🪣 Interior Cleaning',
  'full-detail': '✨ Full Detailing',
  'monthly-sub': '📦 Monthly Subscription',
};

function renderMyBookings() {
  const list  = $('#my-bookings-list');
  const empty = $('#my-bookings-empty');
  if (!list) return;

  let bookings = state.bookings;
  if (_mbFilter !== 'all') {
    bookings = bookings.filter(b => b.status === _mbFilter);
  }

  if (!bookings.length) {
    list.innerHTML = '';
    if (empty) empty.style.display = 'block';
    return;
  }
  if (empty) empty.style.display = 'none';

  list.innerHTML = bookings.map(b => {
    const isCancelled  = b.status === 'Cancelled';
    const bid          = b.bookingId || b.id;
    let serviceLabel   = MB_SERVICE_LABELS[b.service] || b.service || '—';

    // Map vehicle emoji if serviceLabel doesn't start with one
    if (!serviceLabel.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|\p{Emoji}/u)) {
      let vehicleEmoji = '🚗';
      const vehicleStr = (b.vehicle || (b.cart && b.cart[0] && b.cart[0].vehicleLabel) || '').toLowerCase();
      const serviceStr = (b.service || '').toLowerCase();
      if (vehicleStr.includes('bike') || vehicleStr.includes('scooter') || serviceStr.includes('bike')) {
        vehicleEmoji = '🏍️';
      } else if (vehicleStr.includes('auto') || serviceStr.includes('auto')) {
        vehicleEmoji = '🛺';
      } else if (vehicleStr.includes('hatchback') || vehicleStr.includes('hatch') || serviceStr.includes('hatch')) {
        vehicleEmoji = '🚗';
      } else if (vehicleStr.includes('sedan') || serviceStr.includes('sedan')) {
        vehicleEmoji = '🚙';
      } else if (vehicleStr.includes('suv') || vehicleStr.includes('muv') || serviceStr.includes('suv')) {
        vehicleEmoji = '🚐';
      } else if (vehicleStr.includes('truck') || vehicleStr.includes('van') || serviceStr.includes('truck')) {
        vehicleEmoji = '🚚';
      }
      serviceLabel = `${vehicleEmoji} ${serviceLabel}`;
    }

    const cancelBtn    = !isCancelled
      ? `<button class="mb-cancel-btn" onclick="showCancelModal('${bid}')" aria-label="Cancel booking ${bid}">
           ❌ Cancel Booking
         </button>`
      : `<span class="mb-cancelled-tag">🚫 Cancelled</span>`;

    const displayVehicle = b.vehicle || (b.cart && b.cart.map(item => `${item.qty}x ${item.vehicleLabel}`).join(', ')) || '—';
    const displayTotal = b.total || b.price || 0;

    return `
    <div class="mb-card${isCancelled ? ' mb-card-cancelled' : ''}" id="mbc-${bid}">
      <div class="mb-card-header">
        <div class="mb-card-left">
          <span class="mb-booking-id">${bid}</span>
          <span class="mb-service-name">${serviceLabel}</span>
        </div>
        <div class="mb-card-right">
          <span class="mb-status-badge ${isCancelled ? 'mb-status-cancelled' : 'mb-status-active'}">
            ${isCancelled ? '🚫 Cancelled' : '✅ Active'}
          </span>
        </div>
      </div>
      <div class="mb-card-details">
        <div class="mb-detail-row">
          <span class="mb-detail-icon">📅</span>
          <span class="mb-detail-label">Date</span>
          <span class="mb-detail-val">${formatDate(b.date)}</span>
        </div>
        <div class="mb-detail-row">
          <span class="mb-detail-icon">⏰</span>
          <span class="mb-detail-label">Time</span>
          <span class="mb-detail-val">${b.time || '—'}</span>
        </div>
        <div class="mb-detail-row">
          <span class="mb-detail-icon">🚘</span>
          <span class="mb-detail-label">Vehicle</span>
          <span class="mb-detail-val">${displayVehicle}</span>
        </div>
        <div class="mb-detail-row">
          <span class="mb-detail-icon">💳</span>
          <span class="mb-detail-label">Payment</span>
          <span class="mb-detail-val">${b.payment || '—'}</span>
        </div>
        <div class="mb-detail-row">
          <span class="mb-detail-icon">💰</span>
          <span class="mb-detail-label">Total</span>
          <span class="mb-detail-val mb-total">₹${displayTotal}</span>
        </div>
        ${b.address ? `<div class="mb-detail-row">
          <span class="mb-detail-icon">📍</span>
          <span class="mb-detail-label">Address</span>
          <span class="mb-detail-val">${b.address}</span>
        </div>` : ''}
      </div>
      <div class="mb-card-footer">
        ${cancelBtn}
        <button class="mb-track-btn" onclick="trackBooking('${bid}')">
          🔍 Track Status
        </button>
      </div>
    </div>`;
  }).join('');
}

function filterBookings(filter) {
  _mbFilter = filter;
  $$('.mb-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.filter === filter);
  });
  renderMyBookings();
}

function trackBooking(bookingId) {
  const statusSec = $('#status');
  if (statusSec) window.scrollTo({ top: statusSec.offsetTop - 80, behavior: 'smooth' });
  const input = $('#search-booking-id');
  if (input) { input.value = bookingId; searchBookingById(); }
}

/* ═══════════════════════════════════════════════════════════
   PRICING PLANS
═══════════════════════════════════════════════════════════ */
function selectPlan(planName) {
  // If we are not on index or booking page, redirect to booking
  const isBookingPage = window.location.pathname.includes('booking.html');
  const bookSec = $('#booking');

  if (!isBookingPage && !bookSec) {
    window.location.href = `booking.html?plan=${planName}`;
    return;
  }

  // Map plan to service
  const map = { bike: 'monthly-sub', car: 'monthly-sub', premium: 'monthly-sub' };
  const sel = $('#service-type');
  if (sel) { 
    sel.value = map[planName] || 'monthly-sub'; 
    if (typeof updatePrice === 'function') updatePrice(); 
  }

  if (bookSec) window.scrollTo({ top: bookSec.offsetTop - 80, behavior: 'smooth' });
  showToast(`📦 ${planName.charAt(0).toUpperCase() + planName.slice(1)} Plan selected!`, 'info');
}

/* ═══════════════════════════════════════════════════════════
   LOGIN MODAL
═══════════════════════════════════════════════════════════ */
function openLoginModal() {
  const overlay = $('#login-modal');
  if (overlay) { overlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
}

function switchTab(tab) {
  $$('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  $$('.tab-panel').forEach(p => p.style.display = p.dataset.panel === tab ? 'block' : 'none');
}

function initLanguageSelector() {
  const select = $('#language-select');
  if (!select) return;

  const savedLang = localStorage.getItem('washgo_lang') || 'en';
  select.value = savedLang;

  const PAGE_TRANSLATIONS = {
    en: {
      title: 'WashGo — Doorstep Car & Bike Wash',
      text: {
        '#btn-login-nav': 'Login',
        '.btn-nav-book': 'Book Now ✨',
        '.portal-link': '⚡ Portals',
        '.nav-menu li:nth-child(1) a': 'Home',
        '.nav-menu li:nth-child(2) a': 'Services',
        '.nav-menu li:nth-child(3) a': 'Pricing',
        '.nav-menu li:nth-child(4) a': 'How It Works',
        '.nav-menu li:nth-child(5) a': 'My Bookings',
        '.nav-menu li:nth-child(6) a': 'Reviews',
        '.nav-menu li:nth-child(7) a': 'Book Now',
        '.nav-menu li:nth-child(8) a': 'Support',
        '.nav-menu li:nth-child(9) a': 'Contact',
        '#mobile-nav a:nth-child(1)': '🏠 Home',
        '#mobile-nav a:nth-child(2)': '🧼 Services',
        '#mobile-nav a:nth-child(3)': '💰 Pricing',
        '#mobile-nav a:nth-child(4)': '📋 How It Works',
        '#mobile-nav a:nth-child(5)': '📂 My Bookings',
        '#mobile-nav a:nth-child(6)': '⭐ Reviews',
        '#mobile-nav a:nth-child(7)': '✨ Book Now',
        '#mobile-nav a:nth-child(8)': '📧 Support',
        '#mobile-nav a:nth-child(9)': '📞 Contact',
        '#mobile-nav a:nth-child(10)': '⚡ All Portals',
        '#hero-book-btn': '🚀 Book Now — It\'s Easy',
        '#hero-services-btn': '🔍 View Services',
        '#services .section-subtitle': 'From a quick rinse to a full detail — we\'ve got a service for every vehicle and budget.',
        '#pricing .section-subtitle': 'Choose a monthly plan that fits your lifestyle. No hidden charges.',
        '#how-it-works .section-subtitle': 'Get a spotless vehicle in 4 simple steps. No hassle, no waiting.',
        '#booking .section-subtitle': 'Fill in your details and we\'ll be at your doorstep on time, every time.',
        '#status .section-subtitle': 'Real-time status updates from booking to completion.',
        '#my-bookings .section-subtitle': 'View, track and cancel your recent WashGo bookings below.',
        '#testimonials .section-subtitle': 'Over 4,500 happy customers trust WashGo for their vehicles every month.',
        '#support .section-subtitle': 'Have a question or want to share your experience? We\'d love to hear from you!',
        '#services-heading': 'Everything Your Vehicle Needs',
        '#pricing-heading': 'Simple, Transparent Pricing',
        '#how-heading': 'How WashGo Works',
        '#booking-heading': 'Schedule Your Doorstep Wash',
        '#status-heading': 'Track Your Booking',
        '#my-bookings-heading': 'Your Booking History',
        '#testimonials-heading': 'Loved by Customers',
        '#support-heading': 'Support & Feedback',
        '#support-form .form-title': '📩 Send a Message',
        '#confirm-booking-btn': '🎉 Confirm Booking',
        '#btn-whatsapp': '💬 Book via WhatsApp',
        '#tab-login': 'Login',
        '#tab-signup': 'Sign Up',
        '#login-heading': 'Welcome Back!',
        '#select-bike-plan': 'Get Bike Plan',
        '#select-car-plan': 'Get Car Plan',
        '#select-premium-plan': 'Get Premium Plan',
        '#services .service-card:nth-child(1) .card-title': 'Bike Wash',
        '#services .service-card:nth-child(2) .card-title': 'Car Wash',
        '#services .service-card:nth-child(3) .card-title': 'Premium Foam Wash',
        '#services .service-card:nth-child(1) .card-desc': 'Complete exterior wash for all two-wheelers. Removes dust, mud and grime. Engine bay wipe included.',
        '#services .service-card:nth-child(2) .card-desc': 'Thorough exterior car wash with microfiber towels. Tyre dressing, window cleaning & mirror wipe.',
        '#services .service-card:nth-child(3) .card-desc': 'High-pressure foam cannon treatment with pH-neutral shampoo. Paint-safe deep clean with gloss finish.'
      },
      placeholder: {
        '#full-name': 'Rahul Sharma',
        '#phone': '9876543210',
        '#address': 'Start typing your address...',
        '#coupon-input': 'e.g. WASHGO10, FIRST50',
        '#search-booking-id': 'Enter Booking ID (e.g. WGABC12345)',
        '#login-phone': 'rahul@example.com',
        '#login-pass': '••••••••',
        '#signup-name': 'Rahul Sharma',
        '#signup-phone': '9876543210',
        '#signup-pass': '••••••••',
        '#support-name': 'Rahul Sharma',
        '#support-email': 'rahul@example.com',
        '#support-phone': '9876543210',
        '#support-address': 'Sector 21, Noida',
        '#support-message': 'Tell us how we can help...'
      },
      html: {
        '.hero-badge': '<span class="dot" aria-hidden="true"></span> ⚡ #1 Doorstep Wash Service',
        '.hero-title': '<span class="highlight">Doorstep</span> Car &amp;<br/>Bike Wash at<br/><span class="accent">Your Home</span>',
        '.hero-desc': 'Skip the queue! Book a professional vehicle wash in 30 seconds. Trained specialists arrive at your doorstep — sparkling clean, guaranteed.',
        '[data-field="full-name"] label': 'Full Name <span class="req">*</span>',
        '[data-field="phone"] label': 'Phone Number <span class="req">*</span>',
        '[data-field="booking-date"] label': 'Date <span class="req">*</span>',
        '[data-field="address"] label': 'Full Address <span class="req">*</span>',
        '[data-field="vehicle-type"] label': 'Vehicle Type <span class="req">*</span>',
        '[data-field="service-type"] label': 'Service <span class="req">*</span> <span class="service-label-hint" id="service-vehicle-hint"></span>'
      },
      toast: 'Language switched to English'
    },
    hi: {
      title: 'WashGo — घर बैठे कार और बाइक वॉश',
      text: {
        '#btn-login-nav': 'लॉगिन',
        '.btn-nav-book': 'अभी बुक करें ✨',
        '.portal-link': '⚡ पोर्टल्स',
        '.nav-menu li:nth-child(1) a': 'होम',
        '.nav-menu li:nth-child(2) a': 'सेवाएं',
        '.nav-menu li:nth-child(3) a': 'प्राइसिंग',
        '.nav-menu li:nth-child(4) a': 'कैसे काम करता है',
        '.nav-menu li:nth-child(5) a': 'मेरी बुकिंग',
        '.nav-menu li:nth-child(6) a': 'रिव्यू',
        '.nav-menu li:nth-child(7) a': 'अभी बुक करें',
        '.nav-menu li:nth-child(8) a': 'सपोर्ट',
        '.nav-menu li:nth-child(9) a': 'संपर्क',
        '#mobile-nav a:nth-child(1)': '🏠 होम',
        '#mobile-nav a:nth-child(2)': '🧼 सेवाएं',
        '#mobile-nav a:nth-child(3)': '💰 प्राइसिंग',
        '#mobile-nav a:nth-child(4)': '📋 कैसे काम करता है',
        '#mobile-nav a:nth-child(5)': '📂 मेरी बुकिंग',
        '#mobile-nav a:nth-child(6)': '⭐ रिव्यू',
        '#mobile-nav a:nth-child(7)': '✨ अभी बुक करें',
        '#mobile-nav a:nth-child(8)': '📧 सपोर्ट',
        '#mobile-nav a:nth-child(9)': '📞 संपर्क',
        '#mobile-nav a:nth-child(10)': '⚡ सभी पोर्टल्स',
        '#hero-book-btn': '🚀 अभी बुक करें — आसान है',
        '#hero-services-btn': '🔍 सेवाएं देखें',
        '#services .section-subtitle': 'क्विक रिंस से लेकर फुल डिटेल तक — हर वाहन और बजट के लिए सही सेवा उपलब्ध है।',
        '#pricing .section-subtitle': 'अपने लाइफस्टाइल के हिसाब से मासिक प्लान चुनें। कोई छिपे हुए शुल्क नहीं।',
        '#how-it-works .section-subtitle': '4 आसान स्टेप्स में चमचमाती गाड़ी पाएँ। बिना झंझट, बिना इंतज़ार।',
        '#booking .section-subtitle': 'अपनी जानकारी भरें और हम समय पर आपके घर पहुँचेंगे।',
        '#status .section-subtitle': 'बुकिंग से कंप्लीशन तक रियल-टाइम स्टेटस अपडेट्स।',
        '#my-bookings .section-subtitle': 'अपनी हाल की WashGo बुकिंग देखें, ट्रैक करें और कैंसिल करें।',
        '#testimonials .section-subtitle': '4,500+ खुश ग्राहक हर महीने WashGo पर भरोसा करते हैं।',
        '#support .section-subtitle': 'कोई सवाल है या अनुभव साझा करना है? हम आपकी बात सुनना चाहते हैं!',
        '#services-heading': 'आपकी गाड़ी के लिए सब कुछ',
        '#pricing-heading': 'सरल और पारदर्शी प्राइसिंग',
        '#how-heading': 'WashGo कैसे काम करता है',
        '#booking-heading': 'घर बैठे वॉश शेड्यूल करें',
        '#status-heading': 'अपनी बुकिंग ट्रैक करें',
        '#my-bookings-heading': 'आपकी बुकिंग हिस्ट्री',
        '#testimonials-heading': 'ग्राहकों की पसंद',
        '#support-heading': 'सपोर्ट और फीडबैक',
        '#support-form .form-title': '📩 संदेश भेजें',
        '#confirm-booking-btn': '🎉 बुकिंग कन्फर्म करें',
        '#btn-whatsapp': '💬 WhatsApp से बुक करें',
        '#tab-login': 'लॉगिन',
        '#tab-signup': 'साइन अप',
        '#login-heading': 'वापस स्वागत है!',
        '#select-bike-plan': 'बाइक प्लान लें',
        '#select-car-plan': 'कार प्लान लें',
        '#select-premium-plan': 'प्रीमियम प्लान लें',
        '#services .service-card:nth-child(1) .card-title': 'बाइक वॉश',
        '#services .service-card:nth-child(2) .card-title': 'कार वॉश',
        '#services .service-card:nth-child(3) .card-title': 'प्रीमियम फोम वॉश',
        '#services .service-card:nth-child(1) .card-desc': 'सभी दोपहिया वाहनों के लिए कंप्लीट एक्सटीरियर वॉश। धूल, मिट्टी और गंदगी हटाएँ। इंजन बे वाइप शामिल।',
        '#services .service-card:nth-child(2) .card-desc': 'माइक्रोफाइबर टॉवेल के साथ पूरी कार एक्सटीरियर वॉश। टायर ड्रेसिंग, विंडो और मिरर क्लीनिंग शामिल।',
        '#services .service-card:nth-child(3) .card-desc': 'हाई-प्रेशर फोम कैनन ट्रीटमेंट pH-न्यूट्रल शैम्पू के साथ। पेंट-सेफ डीप क्लीन और ग्लॉस फिनिश।'
      },
      placeholder: {
        '#full-name': 'राहुल शर्मा',
        '#phone': '9876543210',
        '#address': 'अपना पता लिखना शुरू करें...',
        '#coupon-input': 'जैसे WASHGO10, FIRST50',
        '#search-booking-id': 'बुकिंग आईडी डालें (जैसे WGABC12345)',
        '#login-phone': 'rahul@example.com',
        '#login-pass': '••••••••',
        '#signup-name': 'पूरा नाम',
        '#signup-phone': 'मोबाइल नंबर',
        '#signup-pass': 'पासवर्ड बनाएं',
        '#support-name': 'आपका नाम',
        '#support-email': 'ईमेल पता',
        '#support-phone': 'मोबाइल नंबर',
        '#support-address': 'पूरा पता',
        '#support-message': 'हम आपकी कैसे मदद कर सकते हैं...'
      },
      html: {
        '.hero-badge': '<span class="dot" aria-hidden="true"></span> ⚡ #1 घर बैठे वॉश सेवा',
        '.hero-title': '<span class="highlight">घर बैठे</span> कार और<br/>बाइक वॉश<br/><span class="accent">आपके घर</span>',
        '.hero-desc': 'लाइन में लगना छोड़िए! सिर्फ 30 सेकंड में प्रोफेशनल वॉश बुक करें। प्रशिक्षित विशेषज्ञ आपके घर पहुँचते हैं।',
        '[data-field="full-name"] label': 'पूरा नाम <span class="req">*</span>',
        '[data-field="phone"] label': 'फोन नंबर <span class="req">*</span>',
        '[data-field="booking-date"] label': 'तारीख <span class="req">*</span>',
        '[data-field="address"] label': 'पूरा पता <span class="req">*</span>',
        '[data-field="vehicle-type"] label': 'वाहन प्रकार <span class="req">*</span>',
        '[data-field="service-type"] label': 'सेवा <span class="req">*</span> <span class="service-label-hint" id="service-vehicle-hint"></span>'
      },
      toast: 'भाषा हिंदी में बदल दी गई'
    },
    kn: {
      title: 'WashGo — ಮನೆ ಬಾಗಿಲಲ್ಲೇ ಕಾರ್ ಮತ್ತು ಬೈಕ್ ವಾಶ್',
      text: {
        '#btn-login-nav': 'ಲಾಗಿನ್',
        '.btn-nav-book': 'ಈಗ ಬುಕ್ ಮಾಡಿ ✨',
        '.portal-link': '⚡ ಪೋರ್ಟಲ್ಸ್',
        '.nav-menu li:nth-child(1) a': 'ಮುಖಪುಟ',
        '.nav-menu li:nth-child(2) a': 'ಸೇವೆಗಳು',
        '.nav-menu li:nth-child(3) a': 'ದರಗಳು',
        '.nav-menu li:nth-child(4) a': 'ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ',
        '.nav-menu li:nth-child(5) a': 'ನನ್ನ ಬುಕ್ಕಿಂಗ್‌ಗಳು',
        '.nav-menu li:nth-child(6) a': 'ವಿಮರ್ಶೆಗಳು',
        '.nav-menu li:nth-child(7) a': 'ಈಗ ಬುಕ್ ಮಾಡಿ',
        '.nav-menu li:nth-child(8) a': 'ಸಹಾಯ',
        '.nav-menu li:nth-child(9) a': 'ಸಂಪರ್ಕ',
        '#mobile-nav a:nth-child(1)': '🏠 ಮುಖಪುಟ',
        '#mobile-nav a:nth-child(2)': '🧼 ಸೇವೆಗಳು',
        '#mobile-nav a:nth-child(3)': '💰 ದರಗಳು',
        '#mobile-nav a:nth-child(4)': '📋 ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ',
        '#mobile-nav a:nth-child(5)': '📂 ನನ್ನ ಬುಕ್ಕಿಂಗ್‌ಗಳು',
        '#mobile-nav a:nth-child(6)': '⭐ ವಿಮರ್ಶೆಗಳು',
        '#mobile-nav a:nth-child(7)': '✨ ಈಗ ಬುಕ್ ಮಾಡಿ',
        '#mobile-nav a:nth-child(8)': '📧 ಸಹಾಯ',
        '#mobile-nav a:nth-child(9)': '📞 ಸಂಪರ್ಕ',
        '#mobile-nav a:nth-child(10)': '⚡ ಎಲ್ಲಾ ಪೋರ್ಟಲ್ಸ್',
        '#hero-book-btn': '🚀 ಈಗ ಬುಕ್ ಮಾಡಿ — ತುಂಬಾ ಸುಲಭ',
        '#hero-services-btn': '🔍 ಸೇವೆಗಳು ನೋಡಿ',
        '#services .section-subtitle': 'ಕ್ವಿಕ್ ರಿನ್ಸ್‌ನಿಂದ ಫುಲ್ ಡೀಟೈಲ್‌ವರೆಗೆ — ಪ್ರತಿಯೊಂದು ವಾಹನಕ್ಕೂ ಮತ್ತು ಬಜೆಟ್‌ಗೆ ಸರಿಯಾದ ಸೇವೆ.',
        '#pricing .section-subtitle': 'ನಿಮ್ಮ ಜೀವನಶೈಲಿಗೆ ಸರಿಹೊಂದುತ್ತಾದ ಮಾಸಿಕ ಪ್ಲಾನ್ ಆಯ್ಕೆಮಾಡಿ. ಯಾವುದೇ ಮರೆಮಾಚಿದ ಶುಲ್ಕಗಳಿಲ್ಲ.',
        '#how-it-works .section-subtitle': '4 ಸರಳ ಹಂತಗಳಲ್ಲಿ ಮಿನುಗುವ ವಾಹನ. ಯಾವುದೇ ತೊಂದರೆ ಇಲ್ಲ, ಕಾಯುವಿಕೆಯೂ ಇಲ್ಲ.',
        '#booking .section-subtitle': 'ನಿಮ್ಮ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ, ಸಮಯಕ್ಕೆ ನಾವು ನಿಮ್ಮ ಮನೆಬಾಗಿಲಿಗೆ ಬರುತ್ತೇವೆ.',
        '#status .section-subtitle': 'ಬುಕ್ಕಿಂಗ್‌ನಿಂದ ಪೂರ್ಣಗೊಳ್ಳುವವರೆಗಿನ ರಿಯಲ್-ಟೈಮ್ ಅಪ್‌ಡೇಟ್ಸ್.',
        '#my-bookings .section-subtitle': 'ನಿಮ್ಮ ಇತ್ತೀಚಿನ WashGo ಬುಕ್ಕಿಂಗ್‌ಗಳನ್ನು ನೋಡಿ, ಟ್ರ್ಯಾಕ್ ಮಾಡಿ ಮತ್ತು ರದ್ದುಗೊಳಿಸಿ.',
        '#testimonials .section-subtitle': 'ಪ್ರತಿ ತಿಂಗಳು 4,500+ ಸಂತೃಪ್ತ ಗ್ರಾಹಕರು WashGo ಮೇಲೆ ನಂಬಿಕೆ ಇಟ್ಟುಕೊಂಡಿದ್ದಾರೆ.',
        '#support .section-subtitle': 'ಯಾವುದೇ ಪ್ರಶ್ನೆಯಿದೆಯಾ ಅಥವಾ ನಿಮ್ಮ ಅನುಭವ ಹಂಚಿಕೊಳ್ಳಬೇಕೇ? ನಮಗೆ ತಿಳಿಸಿ!',
        '#services-heading': 'ನಿಮ್ಮ ವಾಹನಕ್ಕೆ ಬೇಕಾದ ಎಲ್ಲವೂ',
        '#pricing-heading': 'ಸರಳ ಮತ್ತು ಸ್ಪಷ್ಟ ದರಗಳು',
        '#how-heading': 'WashGo ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ',
        '#booking-heading': 'ಮನೆ ಬಾಗಿಲಲ್ಲೇ ವಾಶ್ ವೇಳಾಪಟ್ಟಿ ಮಾಡಿ',
        '#status-heading': 'ನಿಮ್ಮ ಬುಕ್ಕಿಂಗ್ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ',
        '#my-bookings-heading': 'ನಿಮ್ಮ ಬುಕ್ಕಿಂಗ್ ಇತಿಹಾಸ',
        '#testimonials-heading': 'ಗ್ರಾಹಕರ ಮೆಚ್ಚುಗೆ',
        '#support-heading': 'ಸಹಾಯ ಮತ್ತು ಪ್ರತಿಕ್ರಿಯೆ',
        '#support-form .form-title': '📩 ಸಂದೇಶ ಕಳುಹಿಸಿ',
        '#confirm-booking-btn': '🎉 ಬುಕ್ಕಿಂಗ್ ದೃಢೀಕರಿಸಿ',
        '#btn-whatsapp': '💬 WhatsApp ಮೂಲಕ ಬುಕ್ ಮಾಡಿ',
        '#tab-login': 'ಲಾಗಿನ್',
        '#tab-signup': 'ಸೈನ್ ಅಪ್',
        '#login-heading': 'ಮತ್ತೆ ಸ್ವಾಗತ!',
        '#select-bike-plan': 'ಬೈಕ್ ಪ್ಲಾನ್ ಪಡೆಯಿರಿ',
        '#select-car-plan': 'ಕಾರ್ ಪ್ಲಾನ್ ಪಡೆಯಿರಿ',
        '#select-premium-plan': 'ಪ್ರೀಮಿಯಂ ಪ್ಲಾನ್ ಪಡೆಯಿರಿ',
        '#services .service-card:nth-child(1) .card-title': 'ಬೈಕ್ ವಾಶ್',
        '#services .service-card:nth-child(2) .card-title': 'ಕಾರ್ ವಾಶ್',
        '#services .service-card:nth-child(3) .card-title': 'ಪ್ರೀಮಿಯಂ ಫೋಮ್ ವಾಶ್',
        '#services .service-card:nth-child(1) .card-desc': 'ಎಲ್ಲಾ ಎರಡು ಚಕ್ರ ವಾಹನಗಳಿಗೆ ಸಂಪೂರ್ಣ ಹೊರಭಾಗದ ವಾಶ್. ಧೂಳು, ಮಣ್ಣು ಮತ್ತು ಕಸ ತೆಗೆಯುತ್ತದೆ. ಎಂಜಿನ್ ಬೇ ವೈಪ್ ಒಳಗೊಂಡಿದೆ.',
        '#services .service-card:nth-child(2) .card-desc': 'ಮೈಕ್ರೋಫೈಬರ್ ಟವಲ್‌ಗಳೊಂದಿಗೆ ಸಂಪೂರ್ಣ ಕಾರ್ ಹೊರಭಾಗದ ವಾಶ್. ಟೈರ್ ಡ್ರೆಸ್ಸಿಂಗ್, ವಿಂಡೋ ಮತ್ತು ಮಿರರ್ ಕ್ಲೀನಿಂಗ್ ಒಳಗೊಂಡಿದೆ.',
        '#services .service-card:nth-child(3) .card-desc': 'pH-ನ್ಯೂಟ್ರಲ್ ಶಾಂಪೂ ಜೊತೆಗೆ ಹೈ-ಪ್ರೆಶರ್ ಫೋಮ್ ಕ್ಯಾನನ್ ಟ್ರೀಟ್ಮೆಂಟ್. ಪೇಂಟ್‌ಗೆ ಸುರಕ್ಷಿತವಾದ ಡೀಪ್ ಕ್ಲೀನ್ ಮತ್ತು ಗ್ಲಾಸ್ ಫಿನಿಷ್.'
      },
      placeholder: {
        '#full-name': 'ರಾಹುಲ್ ಶರ್ಮಾ',
        '#phone': '9876543210',
        '#address': 'ನಿಮ್ಮ ವಿಳಾಸ ಟೈಪ್ ಮಾಡಲು ಆರಂಭಿಸಿ...',
        '#coupon-input': 'ಉದಾ: WASHGO10, FIRST50',
        '#search-booking-id': 'ಬುಕ್ಕಿಂಗ್ ಐಡಿ ನಮೂದಿಸಿ (ಉದಾ: WGABC12345)',
        '#login-phone': 'rahul@example.com',
        '#login-pass': '••••••••',
        '#signup-name': 'ಪೂರ್ಣ ಹೆಸರು',
        '#signup-phone': 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
        '#signup-pass': 'ಪಾಸ್ವರ್ಡ್ ರಚಿಸಿ',
        '#support-name': 'ನಿಮ್ಮ ಹೆಸರು',
        '#support-email': 'ಇಮೇಲ್ ವಿಳಾಸ',
        '#support-phone': 'ಫೋನ್ ಸಂಖ್ಯೆ',
        '#support-address': 'ಪೂರ್ಣ ವಿಳಾಸ',
        '#support-message': 'ನಾವು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು...'
      },
      html: {
        '.hero-badge': '<span class="dot" aria-hidden="true"></span> ⚡ #1 ಮನೆಬಾಗಿಲಿನ ವಾಶ್ ಸೇವೆ',
        '.hero-title': '<span class="highlight">ಮನೆಬಾಗಿಲಿನ</span> ಕಾರ್ ಮತ್ತು<br/>ಬೈಕ್ ವಾಶ್<br/><span class="accent">ನಿಮ್ಮ ಮನೆಗೆ</span>',
        '.hero-desc': 'ಸರದಿ ತಪ್ಪಿಸಿ! ಕೇವಲ 30 ಸೆಕೆಂಡಿನಲ್ಲಿ ಪ್ರೊಫೆಷನಲ್ ವಾಹನ ವಾಶ್ ಬುಕ್ ಮಾಡಿ. ತರಬೇತಿ ಪಡೆದ ತಜ್ಞರು ಮನೆಬಾಗಿಲಿಗೆ ಬರುತ್ತಾರೆ.',
        '[data-field="full-name"] label': 'ಪೂರ್ಣ ಹೆಸರು <span class="req">*</span>',
        '[data-field="phone"] label': 'ಫೋನ್ ಸಂಖ್ಯೆ <span class="req">*</span>',
        '[data-field="booking-date"] label': 'ದಿನಾಂಕ <span class="req">*</span>',
        '[data-field="address"] label': 'ಪೂರ್ಣ ವಿಳಾಸ <span class="req">*</span>',
        '[data-field="vehicle-type"] label': 'ವಾಹನದ ಪ್ರಕಾರ <span class="req">*</span>',
        '[data-field="service-type"] label': 'ಸೇವೆ <span class="req">*</span> <span class="service-label-hint" id="service-vehicle-hint"></span>'
      },
      toast: 'ಭಾಷೆಯನ್ನು ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಲಾಗಿದೆ'
    }
  };

  const applyTextMap = (map = {}) => {
    Object.entries(map).forEach(([selector, value]) => {
      const node = $(selector);
      if (node) node.textContent = value;
    });
  };

  const applyPlaceholderMap = (map = {}) => {
    Object.entries(map).forEach(([selector, value]) => {
      const node = $(selector);
      if (node) node.placeholder = value;
    });
  };

  const applyHtmlMap = (map = {}) => {
    Object.entries(map).forEach(([selector, value]) => {
      const node = $(selector);
      if (node) node.innerHTML = value;
    });
  };

  const applyLang = (lang, silent = false) => {
    const dict = PAGE_TRANSLATIONS[lang] || PAGE_TRANSLATIONS.en;
    localStorage.setItem('washgo_lang', lang);
    state.lang = lang;
    document.title = dict.title;
    applyTextMap(dict.text);
    applyPlaceholderMap(dict.placeholder);
    applyHtmlMap(dict.html);
    if (!silent) showToast(dict.toast || `Language switched to ${lang.toUpperCase()}`, 'success');
  };

  applyLang(savedLang, true);
  select.addEventListener('change', (e) => applyLang(e.target.value));
}

function initFeatureButtons() {
  const notifyBtn = $('#btn-notify');
  if (notifyBtn) {
    notifyBtn.addEventListener('click', () => {
      showToast('🔔 Push notifications enabled for booking updates.', 'success');
    });
  }


  const referralBtn = $('#copy-referral-btn');
  if (referralBtn) {
    referralBtn.addEventListener('click', async () => {
      const code = $('#referral-code')?.textContent?.trim();
      if (!code) return;
      try {
        await navigator.clipboard.writeText(code);
        showToast(`🎁 Referral code copied: ${code}`, 'success');
      } catch {
        showToast('Unable to copy. Please copy referral code manually.', 'error');
      }
    });
  }
}

/* ═══════════════════════════════════════════════════════════
   TOAST NOTIFICATIONS
═══════════════════════════════════════════════════════════ */
function showToast(msg, type = 'info', duration = 3500) {
  const container = $('#toast-container');
  if (!container) return;

  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const toast = el('div', `toast ${type}`);
  toast.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ️'}</span><span class="toast-msg">${msg}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ═══════════════════════════════════════════════════════════
   MAP PLACEHOLDER CLICK
═══════════════════════════════════════════════════════════ */
function openMap() {
  const placeholder   = document.getElementById('map-placeholder');
  const mapResult     = document.getElementById('map-result');
  const mapIframe     = document.getElementById('map-iframe');
  const mapCoords     = document.getElementById('map-coords-label');
  const addressInput  = document.getElementById('address');

  if (!navigator.geolocation) {
    showToast('❌ Geolocation is not supported by your browser.', 'error');
    return;
  }

  // Show loading state
  if (placeholder) {
    placeholder.innerHTML = `
      <span class="map-icon">🔍</span>
      <span class="map-text">Detecting your location…</span>
      <span class="map-sub">Please allow location access</span>
    `;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude.toFixed(6);
      const lng = pos.coords.longitude.toFixed(6);

      // Embed Google Maps showing the pin
      if (mapIframe) {
        mapIframe.src = `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
      }

      // Show the map panel
      if (mapResult) mapResult.style.display = 'block';

      // Show coords
      if (mapCoords) mapCoords.textContent = `📌 ${lat}, ${lng}`;

      // Auto-fill address with coordinates if field is empty
      if (addressInput && !addressInput.value.trim()) {
        addressInput.value = `Lat: ${lat}, Lng: ${lng}`;
      }

      // Reset placeholder to success state
      if (placeholder) {
        placeholder.innerHTML = `
          <span class="map-icon">✅</span>
          <span class="map-text" style="color:var(--success);">Location detected!</span>
          <span class="map-sub">${lat}, ${lng}</span>
        `;
      }

      showToast('📍 Location pinned successfully!', 'success');
    },
    (err) => {
      // Reset placeholder
      if (placeholder) {
        placeholder.innerHTML = `
          <span class="map-icon">📍</span>
          <span class="map-text">Click to detect my location</span>
          <span class="map-sub">Uses your device GPS — no API key needed</span>
        `;
      }

      const msgs = {
        1: 'Location access denied. Please allow it in your browser settings.',
        2: 'Unable to determine your location. Try again.',
        3: 'Location request timed out. Try again.',
      };
      showToast(`❌ ${msgs[err.code] || 'Could not get location.'}`, 'error');
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

/* Global helpers exposed for inline HTML handlers */
window.closeModal           = closeModal;
window.repeatLastBooking    = repeatLastBooking;
window.openLoginModal       = openLoginModal;
window.switchTab            = switchTab;
window.selectPlan           = selectPlan;
window.openMap              = openMap;
window.runDemoStatus        = runDemoStatus;
window.showCancelModal      = showCancelModal;
window.closeCancelModal     = closeCancelModal;
window.confirmCancelBooking = confirmCancelBooking;
window.filterBookings       = filterBookings;
window.trackBooking         = trackBooking;

/* ═══════════════════════════════════════════════════════════
   STAR RATING
═══════════════════════════════════════════════════════════ */
function initStarRating() {
  const subjectSelect = $('#support-subject');
  const ratingGroup = $('#rating-group');
  const ratingInput = $('#support-rating');
  const ratingText = $('#rating-text');
  const stars = $$('.star');

  if (!subjectSelect || !ratingGroup || !stars.length) return;

  // Toggle visibility based on subject
  subjectSelect.addEventListener('change', (e) => {
    if (e.target.value === 'Service Feedback') {
      ratingGroup.style.display = 'block';
      // Reset if needed or keep previous
    } else {
      ratingGroup.style.display = 'none';
      ratingInput.value = ''; // clear rating if hidden
      updateStars(0);
      if (ratingText) ratingText.textContent = 'Select a rating';
    }
  });

  const ratingDesc = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent'
  };

  function updateStars(val) {
    stars.forEach(s => {
      s.classList.toggle('active', parseInt(s.dataset.value) <= val);
    });
  }

  stars.forEach(star => {
    star.addEventListener('mouseover', () => {
      const val = parseInt(star.dataset.value);
      stars.forEach(s => s.classList.toggle('hover', parseInt(s.dataset.value) <= val));
    });

    star.addEventListener('mouseout', () => {
      stars.forEach(s => s.classList.remove('hover'));
    });

    star.addEventListener('click', () => {
      const val = parseInt(star.dataset.value);
      ratingInput.value = val;
      updateStars(val);
      if (ratingText) {
        ratingText.textContent = `${val} out of 5 — ${ratingDesc[val]}`;
        ratingText.style.color = 'var(--primary)';
        ratingText.style.fontWeight = '600';
      }
    });
  });
}

/* ─── Support Form ────────────────────────────────────────── */
function initSupportForm() {
  const form = $('#support-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('.btn-primary') || form.querySelector('.btn-send');
    const originalText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.innerHTML = 'Sending...';
      submitBtn.disabled = true;
    }

    try {
      const endpoint = form.dataset.formspree || form.action;
      const response = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        showToast('Thank you for your reply', 'success');
        form.reset();
        
        // Reset stars
        const stars = $$('.star', form);
        stars.forEach(s => s.classList.remove('active', 'hover'));
        const ratingText = $('#rating-text');
        if (ratingText) {
          ratingText.textContent = 'Select a rating';
          ratingText.style.color = 'var(--text-secondary)';
          ratingText.style.fontWeight = 'normal';
        }
        const ratingInput = $('#support-rating');
        if (ratingInput) ratingInput.value = '';
        
      } else {
        const data = await response.json();
        if (data && data.errors) {
          showToast(data.errors.map(err => err.message).join(', '), 'error');
        } else {
          showToast('Oops! There was a problem submitting your form', 'error');
        }
      }
    } catch (error) {
      showToast('Oops! There was a problem submitting your form', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    }
  });
}

/* ═══════════════════════════════════════════════════════════
   ADDRESS AUTOCOMPLETE (Nominatim / OpenStreetMap — free)
═══════════════════════════════════════════════════════════ */
function initAddressAutocomplete() {
  const input       = document.getElementById('address');
  const sugBox      = document.getElementById('address-suggestions');
  const loadingIcon = document.getElementById('address-loading');
  if (!input || !sugBox) return;

  let debounceTimer = null;
  let lastQuery     = '';

  function showSuggestions(items) {
    sugBox.innerHTML = '';
    if (!items.length) {
      sugBox.innerHTML = '<div class="asi-no-result">No results found. Try a more specific address.</div>';
      sugBox.style.display = 'block';
      return;
    }

    items.forEach(item => {
      const row = document.createElement('div');
      row.className = 'address-suggestion-item';
      row.tabIndex  = 0;

      const parts = item.display_name.split(', ');
      const main  = parts.slice(0, 2).join(', ');
      const sub   = parts.slice(2).join(', ');

      row.innerHTML = `
        <span class="asi-icon">📍</span>
        <span class="asi-text">
          <span class="asi-main">${main}</span>
          <span class="asi-sub">${sub}</span>
        </span>
      `;

      const select = () => {
        input.value = item.display_name;
        sugBox.style.display = 'none';
        lastQuery = item.display_name;

        // Pin on map
        pinOnMap(parseFloat(item.lat), parseFloat(item.lon), item.display_name);
      };

      row.addEventListener('click', select);
      row.addEventListener('keydown', e => { if (e.key === 'Enter') select(); });
      sugBox.appendChild(row);
    });

    sugBox.style.display = 'block';
  }

  function hideSuggestions() {
    sugBox.style.display = 'none';
    sugBox.innerHTML = '';
  }

  async function fetchSuggestions(query) {
    if (loadingIcon) loadingIcon.style.display = 'inline';
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=6&countrycodes=in&addressdetails=1`;
      const res  = await fetch(url, {
        headers: { 'Accept-Language': 'en' }
      });
      const data = await res.json();
      showSuggestions(data);
    } catch {
      // silently fail — user can still type manually
      hideSuggestions();
    } finally {
      if (loadingIcon) loadingIcon.style.display = 'none';
    }
  }

  input.addEventListener('input', () => {
    const q = input.value.trim();
    if (q === lastQuery) return;
    if (q.length < 3) { hideSuggestions(); return; }

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => fetchSuggestions(q), 400);
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!input.contains(e.target) && !sugBox.contains(e.target)) {
      hideSuggestions();
    }
  });

  // Keyboard navigation in dropdown
  input.addEventListener('keydown', e => {
    const items = sugBox.querySelectorAll('.address-suggestion-item');
    if (!items.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); items[0].focus(); }
    if (e.key === 'Escape')    { hideSuggestions(); }
  });
}

/* ── Pin a coordinate on the embedded map ── */
function pinOnMap(lat, lng, label) {
  const mapResult  = document.getElementById('map-result');
  const mapIframe  = document.getElementById('map-iframe');
  const mapCoords  = document.getElementById('map-coords-label');
  const placeholder = document.getElementById('map-placeholder');

  if (mapIframe) {
    mapIframe.src = `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
  }
  if (mapResult)  mapResult.style.display = 'block';
  if (mapCoords)  mapCoords.textContent   = `📌 ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  if (placeholder) {
    placeholder.innerHTML = `
      <span class="map-icon">✅</span>
      <span class="map-text" style="color:var(--success);">Location pinned!</span>
      <span class="map-sub">${lat.toFixed(5)}, ${lng.toFixed(5)}</span>
    `;
  }
}

/* ═══════════════════════════════════════════════════════════
   DELIVERY MODE SELECTOR
═══════════════════════════════════════════════════════════ */
// Multipliers per mode
const DELIVERY_MODE_MULTIPLIERS = {
  home:   1.0,   // Base price
  pickup: 1.5,   // +50% for pickup + drop
  shop:   0.8,   // -20% for shop visit walk-in
};

const DELIVERY_MODE_LABELS = {
  home:   '🏠 Home Service',
  pickup: '🚐 Pickup + Drop',
  shop:   '🏪 Shop Visit',
};

const DELIVERY_MODE_NOTES = {
  home:   '🏠 A trained WashGo specialist will arrive at your doorstep with all equipment. Available 7 AM – 6 PM.',
  pickup: '🚐 We will pickup your vehicle, take it to our service center, complete the job, and drop it back. Scheduling slots 7 AM – 4 PM.',
  shop:   '🏪 Visit any WashGo partner service center near you. Walk-ins welcome. Lowest prices guaranteed.',
};

// Track selected mode in state
state.deliveryMode = 'home';

function selectDeliveryMode(mode, el) {
  state.deliveryMode = mode;

  // Update tab highlight
  document.querySelectorAll('.dm-tab').forEach(t => {
    t.classList.remove('selected');
    t.setAttribute('aria-checked', 'false');
  });
  el.classList.add('selected');
  el.setAttribute('aria-checked', 'true');

  // Update note
  const note = document.getElementById('dm-note');
  if (note) note.textContent = DELIVERY_MODE_NOTES[mode] || '';

  // Update address label if pickup mode
  const addrLabel = document.querySelector('[data-field="address"] label');
  if (addrLabel) {
    if (mode === 'pickup') {
      addrLabel.innerHTML = 'Pickup Address <span class="req">*</span>';
    } else if (mode === 'shop') {
      addrLabel.innerHTML = 'Preferred Shop Area <span class="req">*</span>';
    } else {
      addrLabel.innerHTML = 'Full Address <span class="req">*</span>';
    }
  }

  // Update mode label in price estimate
  const modeLabel = document.getElementById('price-mode');
  if (modeLabel) modeLabel.textContent = DELIVERY_MODE_LABELS[mode];

  // Recalculate price
  updatePrice();

  showToast(`${DELIVERY_MODE_LABELS[mode]} selected!`, 'info');
}

// Keyboard support for dm-tabs
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.dm-tab').forEach(tab => {
    tab.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        tab.click();
      }
    });
  });
});

/* ═══════════════════════════════════════════════════════════
   ADD-ON PRICING
═══════════════════════════════════════════════════════════ */
function updateAddonPrice() {
  updatePrice(); // Just re-run the main price calculator
}

// Patch updatePrice to include delivery mode multiplier + add-ons
const _origUpdatePrice = updatePrice;
window.updatePrice = function() {
  // Recalculate cart base
  let baseTot = 0;
  let totalQty = 0;
  state.cart.forEach(item => {
    baseTot += item.subtotal;
    totalQty += item.qty;
  });

  // Apply delivery mode multiplier
  const mode = state.deliveryMode || 'home';
  const multiplier = DELIVERY_MODE_MULTIPLIERS[mode] || 1;
  const adjustedBase = Math.round(baseTot * multiplier);

  // Add-on total
  let addonTotal = 0;
  document.querySelectorAll('.addons-grid input[type="checkbox"]').forEach(cb => {
    if (cb.checked) {
      addonTotal += parseInt(cb.dataset.price || 0);
    }
  });

  const rawBase  = adjustedBase + addonTotal;
  const gst      = Math.round(rawBase * 0.18);
  let   discount = 0;

  if (state.appliedCoupon) {
    const c = state.appliedCoupon;
    if (c.type === 'percent') discount = Math.round(rawBase * c.value / 100);
    else if (c.type === 'flat') discount = c.value;
  }

  const total = Math.max(0, rawBase + gst - discount);

  const setText = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };

  setText('price-mode',     DELIVERY_MODE_LABELS[mode] || '—');
  setText('price-base',    rawBase   ? `₹${adjustedBase.toLocaleString('en-IN')} (${totalQty} item${totalQty>1?'s':''})` : '—');
  setText('price-addons',  addonTotal ? `+₹${addonTotal.toLocaleString('en-IN')}` : '₹0');
  setText('price-gst',     rawBase   ? `₹${gst.toLocaleString('en-IN')}` : '—');
  setText('price-discount', discount ? `-₹${discount.toLocaleString('en-IN')}` : '₹0');
  setText('price-total',   rawBase   ? `₹${total.toLocaleString('en-IN')}` : '—');
};

