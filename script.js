document.addEventListener('DOMContentLoaded', () => {
  // --- Sticky Header & Mobile Nav Toggle ---
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    highlightNavLink();
  });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    // Close mobile menu when clicking nav links
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });
  }

  // --- Scroll Active Nav Link Highlight ---
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  function highlightNavLink() {
    let scrollPos = window.scrollY + 100;
    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sec.id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // --- Scroll Reveal Animations ---
  const revealElements = document.querySelectorAll('.scroll-reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Pricing Plan Toggle Logic ---
  const billingToggleBtn = document.getElementById('billing-toggle-btn');
  const pricingToggleContainer = document.getElementById('price-plan-toggle');
  const labelOneTime = document.getElementById('label-onetime');
  const labelMonthly = document.getElementById('label-monthly');
  
  const basicPrice = document.getElementById('basic-price-tag');
  const premiumPrice = document.getElementById('premium-price-tag');
  const platinumPrice = document.getElementById('platinum-price-tag');

  let isMonthlySub = false;

  const basePrices = {
    basic: 399,
    premium: 799,
    platinum: 1999
  };

  function updatePricingUI() {
    const discount = 0.8; // 20% discount
    if (isMonthlySub) {
      basicPrice.innerHTML = `₹${Math.round(basePrices.basic * discount)}<span>/ mo</span>`;
      premiumPrice.innerHTML = `₹${Math.round(basePrices.premium * discount)}<span>/ mo</span>`;
      platinumPrice.innerHTML = `₹${Math.round(basePrices.platinum * discount)}<span>/ mo</span>`;
      billingToggleBtn.setAttribute('aria-checked', 'true');
    } else {
      basicPrice.innerHTML = `₹${basePrices.basic}<span>/ wash</span>`;
      premiumPrice.innerHTML = `₹${basePrices.premium}<span>/ wash</span>`;
      platinumPrice.innerHTML = `₹${basePrices.platinum}<span>/ wash</span>`;
      billingToggleBtn.setAttribute('aria-checked', 'false');
    }
  }

  if (billingToggleBtn) {
    const toggleAction = () => {
      isMonthlySub = !isMonthlySub;
      pricingToggleContainer.classList.toggle('toggled', isMonthlySub);
      labelOneTime.classList.toggle('active', !isMonthlySub);
      labelMonthly.classList.toggle('active', isMonthlySub);
      updatePricingUI();
    };

    billingToggleBtn.addEventListener('click', toggleAction);
    labelOneTime.addEventListener('click', () => { if (isMonthlySub) toggleAction(); });
    labelMonthly.addEventListener('click', () => { if (!isMonthlySub) toggleAction(); });
  }

  // --- Download App Modal Toggle ---
  const downloadModal = document.getElementById('download-app-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const downloadTriggers = document.querySelectorAll('.open-download-trigger');

  function openDownloadModal() {
    downloadModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDownloadModal() {
    downloadModal.classList.remove('open');
    document.body.style.overflow = 'auto';
  }

  downloadTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openDownloadModal();
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeDownloadModal);
  }

  if (downloadModal) {
    downloadModal.addEventListener('click', (e) => {
      if (e.target === downloadModal) {
        closeDownloadModal();
      }
    });
  }

  // --- Customer Reviews Slider Logic ---
  const reviewSlides = document.querySelectorAll('.review-slide');
  const prevBtn = document.getElementById('prev-review-btn');
  const nextBtn = document.getElementById('next-review-btn');
  const dotsContainer = document.getElementById('carousel-indicator-dots');

  let activeSlideIndex = 0;
  let slideTimer;

  function showSlide(index) {
    reviewSlides.forEach(slide => slide.classList.remove('active'));
    
    if (index >= reviewSlides.length) activeSlideIndex = 0;
    else if (index < 0) activeSlideIndex = reviewSlides.length - 1;
    else activeSlideIndex = index;

    reviewSlides[activeSlideIndex].classList.add('active');
    updateCarouselDots();
  }

  function updateCarouselDots() {
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === activeSlideIndex);
    });
  }

  function autoRotateSlides() {
    clearInterval(slideTimer);
    slideTimer = setInterval(() => {
      showSlide(activeSlideIndex + 1);
    }, 6000);
  }

  if (prevBtn && nextBtn && dotsContainer) {
    prevBtn.addEventListener('click', () => {
      showSlide(activeSlideIndex - 1);
      autoRotateSlides();
    });

    nextBtn.addEventListener('click', () => {
      showSlide(activeSlideIndex + 1);
      autoRotateSlides();
    });

    dotsContainer.querySelectorAll('.carousel-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        const targetIdx = parseInt(dot.getAttribute('data-slide'));
        showSlide(targetIdx);
        autoRotateSlides();
      });
    });

    autoRotateSlides();
  }

  // --- Interactive Mobile Screen Tabs Selector ---
  const phoneTabs = document.querySelectorAll('.phone-nav-item');
  const phoneScreens = document.querySelectorAll('.screen-content');

  phoneTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetScreenId = tab.getAttribute('data-target');
      
      phoneTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      phoneScreens.forEach(screen => {
        if (screen.id === targetScreenId) {
          screen.classList.add('active');
        } else {
          screen.classList.remove('active');
        }
      });
    });
  });

  // --- City Coverage Search Filter & Map Marks highlight ---
  const citySearchInput = document.getElementById('city-search-input');
  const cityBadges = document.querySelectorAll('.city-badge');
  const mapMarkers = document.querySelectorAll('.map-marker');

  if (citySearchInput) {
    citySearchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      cityBadges.forEach(badge => {
        const cityName = badge.textContent.toLowerCase();
        if (cityName.includes(query)) {
          badge.style.display = 'inline-block';
        } else {
          badge.style.display = 'none';
        }
      });
    });
  }

  function selectCity(cityName) {
    cityBadges.forEach(badge => {
      if (badge.getAttribute('data-city') === cityName) {
        badge.classList.add('active');
      } else {
        badge.classList.remove('active');
      }
    });

    mapMarkers.forEach(marker => {
      if (marker.getAttribute('data-city') === cityName) {
        marker.style.transform = 'translate(-50%, -50%) scale(1.3)';
        marker.style.boxShadow = '0 0 25px var(--secondary-color)';
        
        const tooltip = marker.nextElementSibling;
        if (tooltip && tooltip.classList.contains('map-tooltip')) {
          tooltip.style.opacity = '1';
          setTimeout(() => {
            tooltip.style.opacity = '';
          }, 2500);
        }
      } else {
        marker.style.transform = '';
        marker.style.boxShadow = '';
      }
    });
  }

  cityBadges.forEach(badge => {
    badge.addEventListener('click', () => {
      const cityName = badge.getAttribute('data-city');
      selectCity(cityName);
    });
  });

  mapMarkers.forEach(marker => {
    marker.addEventListener('click', () => {
      const cityName = marker.getAttribute('data-city');
      selectCity(cityName);
    });
  });

  // --- Collapsible FAQ Accordion Toggle ---
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-content').style.maxHeight = null;
        });

        if (!isActive) {
          item.classList.add('active');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    }
  });

});
