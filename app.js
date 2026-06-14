/* ═══════════════════════════════════════════════
   WASHGO INDIA — app.js
   Full interaction layer, navigation, state,
   animations, booking flow, payment, tracking
   ═══════════════════════════════════════════════ */
'use strict';

// ─── App State ────────────────────────────────────
const state = {
  currentScreen: 'splash',
  previousScreen: null,
  selectedVehicle: { type: 'car', icon: '🚗', name: 'Car', price: 199 },
  selectedService: { name: 'Foam Wash', price: 249 },
  selectedDate: null,
  selectedSlot: null,
  promoCode: null,
  promoDiscount: 0,
  paymentMethod: 'upi',
  tipAmount: 0,
  starRating: 0,
  etaInterval: null,
  promoSlideInterval: null,
  billingCycle: 'monthly',
  theme: 'light',
};

// ─── Screen Registry ──────────────────────────────
const screens = {
  splash: 'screen-splash',
  onboarding: 'screen-onboarding',
  login: 'screen-login',
  home: 'screen-home',
  service: 'screen-service',
  booking: 'screen-booking',
  payment: 'screen-payment',
  tracking: 'screen-tracking',
  completed: 'screen-completed',
  profile: 'screen-profile',
  wallet: 'screen-wallet',
  subscription: 'screen-subscription',
};

// ─── Navigation ───────────────────────────────────
function goToScreen(screenName, data={}) {
  const prev = state.currentScreen;
  const prevEl = document.getElementById(screens[prev]);
  const nextEl = document.getElementById(screens[screenName]);
  if (!nextEl) return;

  if (prevEl) {
    prevEl.style.display = 'none';
    prevEl.classList.remove('active');
  }

  nextEl.style.display = 'flex';
  nextEl.classList.add('active');

  state.previousScreen = prev;
  state.currentScreen = screenName;

  // Screen-specific initialization
  if (screenName === 'booking') initBookingScreen();
  if (screenName === 'tracking') initTracking();
  if (screenName === 'completed') initCompleted();
  if (screenName === 'payment') initPaymentScreen();

  // Scroll content to top
  const content = nextEl.querySelector('.app-content');
  if (content) content.scrollTop = 0;
}

function goBack() {
  if (state.previousScreen) {
    goToScreen(state.previousScreen);
  }
}

// Nav items mapping
function navTo(screen, el) {
  const allNavBtns = document.querySelectorAll('.nav-item');
  allNavBtns.forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
  goToScreen(screen);
}

// ─── Splash Screen ────────────────────────────────
(function initSplash() {
  setTimeout(() => {
    goToScreen('onboarding');
  }, 3000);
})();

// ─── Onboarding ───────────────────────────────────
let obCurrentSlide = 0;
const obSlides = ['ob1', 'ob2', 'ob3'];

function obNext() {
  const slides = document.querySelectorAll('.onboard-slide');
  const dots = document.querySelectorAll('.ob-dots .dot');
  const btn = document.getElementById('ob-next-btn');

  slides[obCurrentSlide].classList.remove('active');
  dots[obCurrentSlide].classList.remove('active');
  obCurrentSlide++;

  if (obCurrentSlide >= obSlides.length) {
    goToScreen('login');
    obCurrentSlide = 0;
    return;
  }

  slides[obCurrentSlide].classList.add('active');
  dots[obCurrentSlide].classList.add('active');

  if (obCurrentSlide === obSlides.length - 1) {
    btn.textContent = 'Get Started 🚀';
  } else {
    btn.textContent = 'Next →';
  }
}

document.querySelectorAll('.ob-dots .dot').forEach((dot, i) => {
  dot.addEventListener('click', () => {
    const slides = document.querySelectorAll('.onboard-slide');
    const dots = document.querySelectorAll('.ob-dots .dot');
    slides[obCurrentSlide].classList.remove('active');
    dots[obCurrentSlide].classList.remove('active');
    obCurrentSlide = i;
    slides[obCurrentSlide].classList.add('active');
    dots[obCurrentSlide].classList.add('active');
  });
});

// ─── Login ────────────────────────────────────────
function switchLoginTab(tab, btn) {
  document.querySelectorAll('.ltab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.login-form').forEach(f => f.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('login-' + tab).classList.add('active');
}

let otpTimer;
function sendOTP() {
  const phone = document.getElementById('phone-input').value;
  if (phone.length !== 10) {
    showToast('⚠️ Enter a valid 10-digit number');
    return;
  }
  const otpSection = document.getElementById('otp-section');
  document.getElementById('otp-phone-display').textContent = `+91 ${phone}`;
  otpSection.classList.remove('hidden');
  otpSection.classList.add('active');

  showToast('✅ OTP sent to +91 ' + phone);

  // OTP Box auto-focus
  const boxes = document.querySelectorAll('.otp-box');
  boxes.forEach((box, idx) => {
    box.value = '';
    if (idx === 0) box.focus();
    box.addEventListener('input', () => {
      if (box.value.length === 1 && boxes[idx + 1]) boxes[idx + 1].focus();
    });
    box.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !box.value && boxes[idx - 1]) boxes[idx - 1].focus();
    });
  });

  // Countdown
  let t = 30;
  clearInterval(otpTimer);
  otpTimer = setInterval(() => {
    document.getElementById('resend-timer').textContent = --t;
    if (t <= 0) clearInterval(otpTimer);
  }, 1000);
}

function verifyOTP() {
  const boxes = document.querySelectorAll('.otp-box');
  let otp = '';
  boxes.forEach(b => otp += b.value);
  if (otp.length < 4) {
    showToast('⚠️ Enter complete OTP');
    return;
  }
  showToast('✅ Login successful! Welcome to WashGo');
  setTimeout(() => goToScreen('home'), 800);
}

// ─── Home Screen ──────────────────────────────────
function toggleTheme() {
  const body = document.body;
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  body.setAttribute('data-theme', state.theme);
  showToast(state.theme === 'dark' ? '🌙 Dark mode on' : '☀️ Light mode on');
}

function toggleAddressModal() {
  showToast('📍 Address selector coming soon');
}

function showNotifications() {
  document.getElementById('notif-panel').style.display = 'flex';
  document.getElementById('notif-overlay').style.display = 'block';
}

function hideNotifications() {
  document.getElementById('notif-panel').style.display = 'none';
  document.getElementById('notif-overlay').style.display = 'none';
}

function dismissRainNotice() {
  const el = document.getElementById('rain-notice');
  if (el) { el.style.opacity = '0'; el.style.transform = 'translateY(-8px)'; setTimeout(() => el.remove(), 300); }
}

function selectVehicle(type, el) {
  document.querySelectorAll('.vehicle-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');

  const icons = { bike: '🏍️', scooter: '🛵', car: '🚗', suv: '🚙', luxury: '🏎️' };
  const prices = { bike: 79, scooter: 89, car: 199, suv: 299, luxury: 599 };
  const names = { bike: 'Bike', scooter: 'Scooter', car: 'Car', suv: 'SUV', luxury: 'Luxury Car' };

  state.selectedVehicle = { type, icon: icons[type], name: names[type], price: prices[type] };

  // Update service screen vehicle bar
  const svIcon = document.getElementById('sv-icon');
  const svName = document.getElementById('sv-name');
  if (svIcon) svIcon.textContent = icons[type];
  if (svName) svName.textContent = names[type] + ' selected';

  showToast(`${icons[type]} ${names[type]} selected`);
  setTimeout(() => goToScreen('service'), 600);
}

function selectService(name, price) {
  state.selectedService = { name, price };
  goToScreen('booking');
}

function applyPromo(code) {
  state.promoCode = code;
  showToast(`🎉 Promo ${code} applied!`);
}

// Promo Banner Rotation
(function initPromoSlider() {
  const slides = document.querySelectorAll('.promo-slide');
  const dots = document.querySelectorAll('.promo-dots .pd');
  let cur = 0;

  setInterval(() => {
    slides[cur].classList.remove('active');
    dots[cur].classList.remove('active');
    cur = (cur + 1) % slides.length;
    slides[cur].classList.add('active');
    dots[cur].classList.add('active');
  }, 4000);
})();

// ─── Service Selection ────────────────────────────
function selectServiceFull(name, desc, price) {
  state.selectedService = { name, desc, price };
  updateBookingScreen();
  updatePaymentScreen();
  goToScreen('booking');
}

// ─── Booking Screen ───────────────────────────────
function initBookingScreen() {
  updateBookingScreen();
  generateDateStrip();
}

function updateBookingScreen() {
  const icon = document.getElementById('book-vehicle-icon');
  const vname = document.getElementById('book-vehicle-name');
  const sname = document.getElementById('book-service-name');
  const price = document.getElementById('book-price');
  const pbService = document.getElementById('pb-service');
  const pbTotal = document.getElementById('pb-total');

  if (icon) icon.textContent = state.selectedVehicle.icon;
  if (vname) vname.textContent = state.selectedVehicle.name;
  if (sname) sname.textContent = state.selectedService.name;

  const servicePrice = state.selectedService.price || 249;
  const total = servicePrice + 15 - state.promoDiscount;

  if (price) price.textContent = `₹${servicePrice}`;
  if (pbService) pbService.textContent = `₹${servicePrice}`;
  if (pbTotal) pbTotal.textContent = `₹${total}`;
}

function generateDateStrip() {
  const strip = document.getElementById('date-strip');
  if (!strip) return;
  strip.innerHTML = '';
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const today = new Date();

  for (let i = 0; i < 10; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const chip = document.createElement('div');
    chip.className = 'date-chip' + (i === 0 ? ' today' : '') + (i === 1 ? ' selected' : '');
    chip.innerHTML = `
      <span class="day-name">${days[d.getDay()]}</span>
      <span class="day-num">${d.getDate()}</span>
    `;
    chip.addEventListener('click', () => {
      document.querySelectorAll('.date-chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      state.selectedDate = d;
    });
    strip.appendChild(chip);
  }

  // Set default selected date
  state.selectedDate = new Date(today);
  state.selectedDate.setDate(today.getDate() + 1);
}

function selectSlot(el, time) {
  if (el.classList.contains('booked')) return;
  document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
  el.classList.add('selected');
  state.selectedSlot = time;
  showToast(`⏰ Slot ${time} selected`);
}

function toggleAddressCard(el) {
  document.querySelectorAll('.address-card').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}

function showAddressModal() { showToast('📍 New address form opening...'); }

function triggerPhotoUpload() {
  document.getElementById('vehicle-photo-input').click();
}

function applyPromoCode() {
  const code = document.getElementById('promo-code-inp').value.toUpperCase();
  const promos = {
    'WASHGO20': { off: 20, type: 'percent' },
    'FIRST100': { off: 100, type: 'flat' },
    'SAVE50': { off: 50, type: 'flat' },
  };

  if (!code) { showToast('⚠️ Enter a promo code'); return; }

  if (promos[code]) {
    const promo = promos[code];
    const servicePrice = state.selectedService.price || 249;
    let discount = promo.type === 'flat' ? promo.off : Math.round(servicePrice * promo.off / 100);
    discount = Math.min(discount, servicePrice); // Cap at service price
    state.promoCode = code;
    state.promoDiscount = discount;

    // Update UI
    const discRow = document.getElementById('pb-discount-row');
    document.getElementById('pb-discount').textContent = `-₹${discount}`;
    if (discRow) discRow.style.display = 'flex';
    document.getElementById('pb-total').textContent = `₹${servicePrice + 15 - discount}`;

    // Show applied tag
    const appliedArea = document.getElementById('applied-promos');
    appliedArea.innerHTML = `<span class="promo-applied-tag">✅ ${code} — ₹${discount} off applied!</span>`;
    document.getElementById('promo-code-inp').value = '';
    showToast(`🎉 ₹${discount} discount applied!`);
  } else {
    showToast('❌ Invalid promo code');
  }
}

// ─── Payment Screen ───────────────────────────────
function initPaymentScreen() {
  updatePaymentScreen();
}

function updatePaymentScreen() {
  const servicePrice = state.selectedService.price || 249;
  const total = servicePrice + 15 - state.promoDiscount;

  const els = {
    payServiceIcon: document.getElementById('pay-service-icon'),
    payServiceName: document.getElementById('pay-service-name'),
    payTotal: document.getElementById('pay-total'),
    payBtnText: document.getElementById('pay-btn-text'),
  };

  if (els.payServiceIcon) els.payServiceIcon.textContent = '🫧';
  if (els.payServiceName) els.payServiceName.textContent = state.selectedService.name;
  if (els.payTotal) els.payTotal.textContent = `₹${total}`;
  if (els.payBtnText) els.payBtnText.textContent = `Pay ₹${total} Securely`;
}

function selectPayMethod(method, el) {
  document.querySelectorAll('.pay-method').forEach(m => m.classList.remove('active'));
  el.classList.add('active');
  state.paymentMethod = method;

  const upiSection = document.getElementById('upi-section');
  if (upiSection) {
    upiSection.style.display = method === 'upi' ? 'block' : 'none';
  }
}

function selectUPI(app, el) {
  document.querySelectorAll('.upi-app').forEach(a => a.classList.remove('active'));
  el.classList.add('active');
}

function processPayment() {
  const modal = document.getElementById('payment-modal');
  modal.style.display = 'flex';

  // Simulate payment processing
  const statuses = [
    { text: 'Processing Payment...', sub: 'Please wait, do not close', delay: 0 },
    { text: 'Verifying with Bank...', sub: 'Connecting to your UPI app', delay: 1500 },
    { text: 'Payment Successful! 🎉', sub: 'Finding nearby washer...', delay: 2800 },
  ];

  statuses.forEach(s => {
    setTimeout(() => {
      document.getElementById('pp-status').textContent = s.text;
      document.getElementById('pp-sub').textContent = s.sub;
    }, s.delay);
  });

  setTimeout(() => {
    modal.style.display = 'none';
    showToast('✅ Booking confirmed! Worker dispatched.');
    goToScreen('tracking');
  }, 4200);
}

// ─── Live Tracking ────────────────────────────────
function initTracking() {
  if (state.etaInterval) clearInterval(state.etaInterval);

  let eta = 8;
  const etaEl = document.getElementById('eta-minutes');
  const etaStatus = document.getElementById('eta-status');
  if (!etaEl) return;

  const statusMessages = [
    'Worker is on the way',
    'Getting closer...',
    'Almost there! 2 min',
    'Worker has arrived!',
    'Washing in progress...',
    'Almost done!',
  ];

  state.etaInterval = setInterval(() => {
    if (eta > 0) {
      eta--;
      if (etaEl) etaEl.textContent = eta;

      const index = Math.max(0, Math.round((8 - eta) * (statusMessages.length - 1) / 8));
      if (etaStatus) etaStatus.textContent = statusMessages[Math.min(index, statusMessages.length - 1)];
    }
  }, 2000);
}

function callWorker() { showToast('📞 Calling Raju Kumar...'); }
function msgWorker() { showToast('💬 Opening chat with Raju...'); }

function showCancelModal() {
  document.getElementById('cancel-modal').style.display = 'flex';
}

function hideCancelModal() {
  document.getElementById('cancel-modal').style.display = 'none';
}

function confirmCancel() {
  hideCancelModal();
  if (state.etaInterval) clearInterval(state.etaInterval);
  showToast('❌ Booking cancelled. Refund in 2-3 days.');
  setTimeout(() => goToScreen('home'), 1000);
}

// ─── Completed Screen ─────────────────────────────
function initCompleted() {
  createConfetti();
}

function createConfetti() {
  const container = document.getElementById('confetti-cont');
  if (!container) return;
  container.innerHTML = '';
  const colors = ['#1a6dff','#39FF14','#f59e0b','#ec4899','#8b5cf6','#ef4444'];
  for (let i = 0; i < 30; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.cssText = `
      left: ${Math.random() * 120 - 60}px;
      top: 0;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-delay: ${Math.random() * 0.5}s;
      animation-duration: ${1.5 + Math.random()}s;
      transform: rotate(${Math.random() * 360}deg);
    `;
    container.appendChild(piece);
  }
}

function rateStar(n) {
  state.starRating = n;
  const stars = document.querySelectorAll('.star-rating .star');
  stars.forEach((s, i) => {
    s.textContent = i < n ? '⭐' : '☆';
    s.classList.toggle('filled', i < n);
  });
  showToast(`⭐ Rated ${n} star${n > 1 ? 's' : ''}!`);
}

function selectTip(el, amount) {
  document.querySelectorAll('.tip-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  state.tipAmount = amount;
  if (amount > 0) showToast(`💝 ₹${amount} tip added for Raju!`);
}

function shareReceipt() { showToast('📤 Receipt shared!'); }

// ─── Wallet Screen ────────────────────────────────
function showAddMoneyModal() { showToast('💳 Add money feature coming soon'); }
function shareReferral() {
  if (navigator.share) {
    navigator.share({ title: 'WashGo India', text: 'Use my code ARJUN50 to get ₹50 off your first wash!', url: 'https://washgo.in' });
  } else {
    showToast('📋 Code ARJUN50 copied!');
    navigator.clipboard.writeText('ARJUN50').catch(() => {});
  }
}

// ─── Subscription Screen ──────────────────────────
function switchBilling(cycle) {
  state.billingCycle = cycle;
  const knob = document.getElementById('bt-knob');
  const monthlyLabel = document.getElementById('bt-monthly');
  const annualLabel = document.getElementById('bt-annual');
  const toggle = document.querySelector('.bt-switch');

  if (cycle === 'annual') {
    if (knob) { knob.classList.add('on'); }
    if (toggle) toggle.classList.add('on');
    monthlyLabel.classList.remove('active');
    annualLabel.classList.add('active');
  } else {
    if (knob) knob.classList.remove('on');
    if (toggle) toggle.classList.remove('on');
    monthlyLabel.classList.add('active');
    annualLabel.classList.remove('active');
  }

  // Update prices
  document.querySelectorAll('.pp-amount').forEach(el => {
    el.textContent = cycle === 'annual' ? el.dataset.annual : el.dataset.monthly;
  });
}

function toggleBilling() {
  switchBilling(state.billingCycle === 'monthly' ? 'annual' : 'monthly');
}

function selectPlan(plan, el) {
  document.querySelectorAll('.plan-card').forEach(c => c.style.outline = 'none');
  el.style.outline = '3px solid var(--blue)';
  showToast(`${plan === 'gold' ? '👑' : plan === 'platinum' ? '💎' : '🚿'} ${plan.charAt(0).toUpperCase()+plan.slice(1)} plan selected!`);

  // Open payment gate
  setTimeout(() => {
    const prices = { basic: '399', gold: '799', platinum: '1499' };
    state.selectedService = { name: `${plan.charAt(0).toUpperCase()+plan.slice(1)} Plan`, price: parseInt(prices[plan]) };
    goToScreen('payment');
  }, 800);
}

// ─── Toast Notification ───────────────────────────
let toastTimeout;
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 3200);
}

// ─── Keyboard shortcuts (Demo Mode) ──────────────
document.addEventListener('keydown', (e) => {
  if (e.altKey) {
    const screenMap = {
      '1': 'home', '2': 'service', '3': 'booking',
      '4': 'payment', '5': 'tracking', '6': 'completed',
      '7': 'profile', '8': 'wallet', '9': 'subscription',
    };
    if (screenMap[e.key]) {
      goToScreen(screenMap[e.key]);
      showToast(`🔀 Jumped to ${screenMap[e.key]}`);
    }
  }
});

// ─── Touch Swipe Support ──────────────────────────
(function initSwipe() {
  let startX = 0;
  document.addEventListener('touchstart', e => startX = e.changedTouches[0].screenX, { passive: true });
  document.addEventListener('touchend', e => {
    const deltaX = e.changedTouches[0].screenX - startX;
    if (Math.abs(deltaX) > 80) {
      // Right swipe — go back
      if (deltaX > 0 && state.previousScreen && state.currentScreen !== 'splash') {
        goBack();
      }
    }
  }, { passive: true });
})();

// ─── OTP Box Tab / Paste Support ─────────────────
(function initOTPPaste() {
  document.querySelectorAll('.otp-box').forEach((box, idx, boxes) => {
    box.addEventListener('paste', (e) => {
      const data = (e.clipboardData || window.clipboardData).getData('text').trim();
      if (/^\d{4}$/.test(data)) {
        [...data].forEach((d, i) => { if (boxes[i]) boxes[i].value = d; });
        boxes[3].focus();
      }
    });
  });
})();

// ─── Surge Pricing (Saturday/Sunday) ─────────────
(function checkSurge() {
  const day = new Date().getDay();
  if (day === 0 || day === 6) {
    setTimeout(() => showToast('⚡ Weekend surge pricing active — up to 20% extra'), 2000);
  }
})();

// ─── Multi-language demo ──────────────────────────
const translations = {
  en: { home: 'Home', book: 'Book', track: 'Track', wallet: 'Wallet', profile: 'Profile' },
  kn: { home: 'ಮನೆ', book: 'ಬುಕ್', track: 'ಟ್ರ್ಯಾಕ್', wallet: 'ವ್ಯಾಲೆಟ್', profile: 'ಪ್ರೊಫೈಲ್' },
  hi: { home: 'होम', book: 'बुक', track: 'ट्रैक', wallet: 'वॉलेट', profile: 'प्रोफाइल' },
};

// Initial screen setup
document.getElementById(screens.splash).style.display = 'flex';
document.getElementById(screens.splash).classList.add('active');

console.log(`
╔══════════════════════════════════════╗
║   WashGo India — Customer App        ║
║   Alt+1..9 to jump between screens  ║
║   Swipe right to go back             ║
╚══════════════════════════════════════╝
`);
