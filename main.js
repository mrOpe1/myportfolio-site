/* =============================================
   OPE LABS PORTFOLIO — JAVASCRIPT
   Features:
   - Sticky navbar
   - Mobile hamburger menu
   - Typewriter effect
   - Floating particles
   - Fade-in on scroll (IntersectionObserver)
   - Skill bar animations
   - Project filter tabs
   - FAQ accordion
   - Contact form
   ============================================= */
/* ===========================
   0. THEME MANAGER (PRIORITY - RUNS IMMEDIATELY)
=========================== */
(function() {
  const activeTheme = localStorage.getItem('ope-labs-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', activeTheme);
})();

document.addEventListener('DOMContentLoaded', () => {

  const themeToggle = document.getElementById('theme-toggle');
  
  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ope-labs-theme', theme);
    if (themeToggle) {
        themeToggle.classList.add('rotating');
        setTimeout(() => themeToggle.classList.remove('rotating'), 500);
    }
  };

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
    });
  }


  /* ===========================
     1. NAVBAR SCROLL STYLE
  =========================== */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  /* ===========================
     2. HAMBURGER MENU
  =========================== */
  const hamburger   = document.getElementById('hamburger');
  const navLinks    = document.getElementById('nav-links');
  const navCloseBtn = document.getElementById('nav-close-btn');
  const navBackdrop = document.getElementById('nav-backdrop');

  function openMenu() {
    hamburger.classList.add('open');
    navLinks.classList.add('open');
    if (navBackdrop) navBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden'; // prevent background scroll
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    if (navBackdrop) navBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.contains('open') ? closeMenu() : openMenu();
    });

    // Close button inside the panel
    if (navCloseBtn) navCloseBtn.addEventListener('click', closeMenu);

    // Click on the dimmed backdrop to close
    if (navBackdrop) navBackdrop.addEventListener('click', closeMenu);

    // Close on nav link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }


  /* ===========================
     3. TYPEWRITER EFFECT
  =========================== */
  const typewriterEl = document.getElementById('typewriter');
  if (typewriterEl) {
    const phrases = [
      'Digital Laboratory',
      'Code Experimentalist',
      'Innovation Studio',
      'UX/UI Alchemist',
    ];
    let pIdx = 0, cIdx = 0, deleting = false;
    const speed = { type: 90, delete: 50, pause: 1800 };

    const type = () => {
      const current = phrases[pIdx];
      if (!deleting) {
        typewriterEl.textContent = current.substring(0, cIdx + 1);
        cIdx++;
        if (cIdx === current.length) {
          deleting = true;
          setTimeout(type, speed.pause);
          return;
        }
      } else {
        typewriterEl.textContent = current.substring(0, cIdx - 1);
        cIdx--;
        if (cIdx === 0) {
          deleting = false;
          pIdx = (pIdx + 1) % phrases.length;
        }
      }
      setTimeout(type, deleting ? speed.delete : speed.type);
    };
    setTimeout(type, 600);
  }


  /* ===========================
     4. HERO PARTICLES
  =========================== */
  const particleContainer = document.getElementById('particles');
  if (particleContainer) {
    const count = 18;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.classList.add('particle');
      const size = Math.random() * 5 + 2;
      const delay = Math.random() * 12;
      const duration = Math.random() * 8 + 8;
      const left = Math.random() * 100;
      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        bottom: -10px;
        animation-duration: ${duration}s;
        animation-delay: -${delay}s;
        opacity: ${Math.random() * 0.6 + 0.2};
      `;
      particleContainer.appendChild(p);
    }
  }


  /* ===========================
     5. FADE-UP ON SCROLL
  =========================== */
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger sibling cards
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    // Add stagger delay to grid children
    const grids = document.querySelectorAll('.skills-grid, .projects-grid, .projects-full-grid, .testimonials-grid, .tech-grid');
    grids.forEach(grid => {
      Array.from(grid.children).forEach((child, idx) => {
        child.dataset.delay = idx * 80;
      });
    });

    fadeEls.forEach(el => observer.observe(el));
  }


  /* ===========================
     6. SKILL BARS
  =========================== */
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  if (skillBars.length) {
    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          const width = fill.dataset.width || 0;
          fill.style.width = `${width}%`;
          barObserver.unobserve(fill);
        }
      });
    }, { threshold: 0.3 });
    skillBars.forEach(bar => barObserver.observe(bar));
  }


  /* ===========================
     7. PROJECT FILTER TABS
  =========================== */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-full-card');

  if (filterBtns.length && projectCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        projectCards.forEach(card => {
          const category = card.dataset.category;
          if (filter === 'all' || category === filter) {
            card.classList.remove('hidden');
            card.style.animation = 'none';
            card.offsetHeight; // reflow
            card.style.animation = '';
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }


  /* ===========================
     8. FAQ ACCORDION
  =========================== */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      faqItems.forEach(f => f.classList.remove('open'));
      question.setAttribute('aria-expanded', 'false');
      // Open clicked if was closed
      if (!isOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });


  /* ===========================
     9. CONTACT FORM SUBMISSION
  =========================== */
  const contactForm = document.getElementById('contact-form');
  const successModal = document.getElementById('success-modal');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('.form-submit-btn');
      const originalBtnHtml = submitBtn.innerHTML;
      
      // Loading State
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

      try {
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          // 1. Reset All Form Fields
          contactForm.reset();

          // Reset custom select triggers back to placeholder text
          contactForm.querySelectorAll('.custom-select-wrapper').forEach(wrapper => {
            const trigger = wrapper.querySelector('.custom-select-trigger span');
            const nativeSelect = wrapper.querySelector('select');
            if (trigger && nativeSelect) {
              // Revert trigger text to the first (placeholder) option's text
              trigger.textContent = nativeSelect.options[0].text;
            }
            // Clear 'selected' highlight from all custom options
            wrapper.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected'));
          });

          // Reset all native <select> elements to first disabled option
          contactForm.querySelectorAll('select').forEach(sel => { sel.selectedIndex = 0; });
          
          // 2. Show Success Modal
          if (successModal) {
            successModal.style.display = 'flex';
            setTimeout(() => successModal.classList.add('is-active'), 10);
          }
        } else {
          const data = await response.json();
          alert(data.errors ? data.errors.map(err => err.message).join(', ') : 'Oops! There was a problem submitting your form');
        }
      } catch (error) {
        alert('Oops! There was a problem submitting your form');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    });
  }

  window.closeSuccessModal = () => {
    if (successModal) {
      successModal.classList.remove('is-active');
      setTimeout(() => {
        successModal.style.display = 'none';
      }, 400); // Wait for transition
    }
  };
  
  /* ===========================
     10. SMOOTH ACTIVE NAV
  =========================== */
  // Highlight nav link for the current page only
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const linkPage = link.getAttribute('href').split('/').pop();
    if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });


  /* ===========================
     13. CUSTOM ANIMATED DROPDOWNS
  =========================== */
  const initCustomSelects = () => {
    const selects = document.querySelectorAll('.contact-form select');
    
    selects.forEach(select => {
      // 1. Create Wrapper
      const wrapper = document.createElement('div');
      wrapper.className = 'custom-select-wrapper';
      select.parentNode.insertBefore(wrapper, select);
      wrapper.appendChild(select);
      select.classList.add('native-select-hidden');

      // 2. Create Trigger
      const trigger = document.createElement('div');
      trigger.className = 'custom-select-trigger';
      const initialText = select.options[select.selectedIndex]?.text || 'Select an option';
      trigger.innerHTML = `<span>${initialText}</span><i class="fa-solid fa-chevron-down"></i>`;
      wrapper.appendChild(trigger);

      // 3. Create Options Container
      const optionsContainer = document.createElement('div');
      optionsContainer.className = 'custom-options';
      
      Array.from(select.options).forEach((option, idx) => {
        if (idx === 0 && option.disabled) return; // Skip placeholder if disabled
        
        const customOption = document.createElement('div');
        customOption.className = 'custom-option';
        if (select.selectedIndex === idx) customOption.classList.add('selected');
        customOption.textContent = option.text;
        customOption.dataset.value = option.value;
        
        customOption.addEventListener('click', (e) => {
          e.stopPropagation();
          select.value = option.value;
          trigger.querySelector('span').textContent = option.text;
          
          // Update selected class
          optionsContainer.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected'));
          customOption.classList.add('selected');
          
          wrapper.classList.remove('open');
          // Trigger change event for validation
          select.dispatchEvent(new Event('change'));
        });
        
        optionsContainer.appendChild(customOption);
      });
      
      wrapper.appendChild(optionsContainer);

      // 4. Toggle Open/Close
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        // Close other open selects
        document.querySelectorAll('.custom-select-wrapper').forEach(other => {
          if (other !== wrapper) other.classList.remove('open');
        });
        wrapper.classList.toggle('open');
      });
    });

    // Close on outside click
    document.addEventListener('click', () => {
      document.querySelectorAll('.custom-select-wrapper').forEach(w => w.classList.remove('open'));
    });
  };

  initCustomSelects();

});
