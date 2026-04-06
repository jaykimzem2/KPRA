// ─── HERO SLIDER ───
(function() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;
  let current = 0, timer;

  function goTo(n) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }
  function start() { timer = setInterval(next, 6000); }
  function reset() { clearInterval(timer); start(); }

  document.querySelector('.hero-next')?.addEventListener('click', () => { next(); reset(); });
  document.querySelector('.hero-prev')?.addEventListener('click', () => { prev(); reset(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); reset(); }));
  start();
})();

// ─── STICKY NAVBAR ───
window.addEventListener('scroll', () => {
  const nb = document.querySelector('.navbar');
  if (nb) nb.classList.toggle('scrolled', window.scrollY > 60);
  const st = document.querySelector('.scroll-top');
  if (st) st.classList.toggle('visible', window.scrollY > 300);
});

// ─── HAMBURGER ───
const ham = document.querySelector('.hamburger');
const menu = document.querySelector('.nav-menu');
if (ham && menu) {
  ham.addEventListener('click', () => {
    menu.classList.toggle('open');
    ham.classList.toggle('open');
  });
}

// ─── DROPDOWNS (mobile) ───
document.querySelectorAll('.nav-menu > li > a').forEach(link => {
  if (link.querySelector('i')) {
    link.addEventListener('click', e => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const dd = link.nextElementSibling;
        if (dd && dd.classList.contains('dropdown')) {
          dd.classList.toggle('open');
        }
      }
    });
  }
});

// ─── SCROLL TO TOP ───
document.querySelector('.scroll-top')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ─── AOS ANIMATION ───
const aosObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('aos-animate');
      aosObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('[data-aos]').forEach((el, i) => {
  const delay = el.dataset.aosDelay || 0;
  el.style.transitionDelay = delay + 'ms';
  aosObserver.observe(el);
});

// ─── COUNTER ANIMATION ───
function animateCounter(el, target, duration = 2000) {
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = prefix + Math.floor(start).toLocaleString() + suffix;
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const target = parseInt(el.dataset.count);
      animateCounter(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// ─── TABS ───
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const parent = btn.closest('.tabs-wrap') || document.querySelector('.about-content');
    const group = btn.closest('.tabs');
    group.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const target = btn.dataset.tab;
    const panes = parent?.querySelectorAll('.tab-pane') || document.querySelectorAll('.tab-pane');
    panes.forEach(p => p.classList.remove('active'));
    document.getElementById(target)?.classList.add('active');
  });
});

// ─── ACCORDION ───
document.querySelectorAll('.accordion-header').forEach(header => {
  header.addEventListener('click', () => {
    const item = header.closest('.accordion-item');
    const body = item.querySelector('.accordion-body');
    const isOpen = header.classList.contains('active');
    // Close all
    document.querySelectorAll('.accordion-header').forEach(h => h.classList.remove('active'));
    document.querySelectorAll('.accordion-body').forEach(b => b.classList.remove('open'));
    if (!isOpen) {
      header.classList.add('active');
      body.classList.add('open');
    }
  });
});

// ─── PORTAL TABS ───
document.querySelectorAll('.ptab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.ptab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.ptab-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.target)?.classList.add('active');
  });
});

// ─── TESTIMONIALS SLIDER ───
(function() {
  const track = document.querySelector('.testimonials-track');
  if (!track) return;
  const cards = track.querySelectorAll('.testimonial-card');
  if (cards.length <= 2) return;
  let idx = 0;
  const visible = window.innerWidth > 768 ? 2 : 1;
  const cardW = 100 / visible;

  function move() {
    idx = (idx + 1) % (cards.length - visible + 1);
    track.style.transform = `translateX(-${idx * cardW}%)`;
  }
  setInterval(move, 5000);
})();

// ─── FORM VALIDATION ───
function validateForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return false;
  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    const err = field.parentElement.querySelector('.field-error');
    if (!field.value.trim()) {
      field.classList.add('error');
      if (err) { err.textContent = 'This field is required.'; err.style.display = 'block'; }
      valid = false;
    } else {
      field.classList.remove('error');
      if (err) err.style.display = 'none';
    }
    if (field.type === 'email' && field.value) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(field.value)) {
        field.classList.add('error');
        if (err) { err.textContent = 'Enter a valid email.'; err.style.display = 'block'; }
        valid = false;
      }
    }
  });
  return valid;
}

// ─── MEMBERSHIP APPLICATION FORM ───
const appForm = document.getElementById('applicationForm');
if (appForm) {
  // Dynamic sub-options
  const memType = document.getElementById('membershipType');
  const subOptions = document.getElementById('subOptions');
  const subTypeField = document.getElementById('subType');

  const subMap = {
    associate: [],
    professional: ['Junior (JR) – 1-4 Years Experience', 'Executive/Senior (SR) – 5+ Years Experience', 'Certified Professional Realtor (CPR)'],
    broker: ['General Brokerage', 'Owner', 'Manager'],
    corporate: [],
    affiliate: ['Chapter by Location/Region', 'Subsidiary', 'Partnership (M.O.U)', 'Linkage – Other Association'],
  };

  memType?.addEventListener('change', () => {
    const opts = subMap[memType.value] || [];
    if (opts.length) {
      subOptions.style.display = 'block';
      subTypeField.innerHTML = '<option value="">-- Select Sub-type --</option>' + opts.map(o => `<option>${o}</option>`).join('');
    } else {
      subOptions.style.display = 'none';
    }
    updateFee();
  });

  const feeMap = { associate: 7500, professional: 12500, broker: 20000, corporate: 50000, affiliate: 50000 };
  const appFeeEl = document.getElementById('displayAppFee');
  const annFeeEl = document.getElementById('displayAnnFee');

  function updateFee() {
    const type = memType?.value;
    if (appFeeEl) appFeeEl.textContent = 'KSh 2,500';
    if (annFeeEl) annFeeEl.textContent = type && feeMap[type] ? 'KSh ' + feeMap[type].toLocaleString() : '—';
  }
  updateFee();
  memType?.addEventListener('change', updateFee);

  // Step wizard
  const steps = document.querySelectorAll('.form-step');
  const stepDots = document.querySelectorAll('.step-dot');
  let step = 0;

  function showStep(n) {
    steps.forEach((s, i) => { s.style.display = i === n ? 'block' : 'none'; });
    stepDots.forEach((d, i) => { d.classList.toggle('active', i <= n); });
    step = n;
  }
  if (steps.length) showStep(0);

  document.querySelectorAll('.btn-next-step').forEach(btn => {
    btn.addEventListener('click', () => {
      const cur = steps[step];
      let ok = true;
      cur.querySelectorAll('[required]').forEach(f => {
        if (!f.value.trim()) { f.classList.add('error'); ok = false; }
        else f.classList.remove('error');
      });
      if (ok && step < steps.length - 1) showStep(step + 1);
    });
  });

  document.querySelectorAll('.btn-prev-step').forEach(btn => {
    btn.addEventListener('click', () => { if (step > 0) showStep(step - 1); });
  });

  appForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!appForm.querySelector('#consent')?.checked) {
      alert('Please agree to the terms to proceed.');
      return;
    }
    const successMsg = document.getElementById('formSuccess');
    if (successMsg) {
      appForm.style.display = 'none';
      successMsg.style.display = 'block';
    }
  });
}

// ─── PROGRESS BARS ───
const progObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.progress-bar').forEach(bar => {
        bar.style.width = bar.dataset.width || '0%';
      });
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.progress-wrap').forEach(w => progObserver.observe(w));

// ─── NEWSLETTER ───
document.querySelectorAll('.newsletter-form').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('input');
    if (input && input.value) {
      input.value = '';
      const btn = form.querySelector('button');
      if (btn) { btn.textContent = '✓ Subscribed!'; setTimeout(() => btn.textContent = 'Subscribe', 3000); }
    }
  });
});

// ─── CONTACT FORM ───
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    if (validateForm('contactForm')) {
      const btn = contactForm.querySelector('[type=submit]');
      btn.textContent = '✓ Message Sent!';
      btn.style.background = '#22c55e';
      contactForm.reset();
      setTimeout(() => { btn.textContent = 'Send Message'; btn.style.background = ''; }, 4000);
    }
  });
}

// ─── PORTAL QUIZ ───
document.querySelectorAll('.quiz-option').forEach(opt => {
  opt.addEventListener('click', () => {
    const group = opt.closest('.quiz-question');
    group.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected', 'correct', 'wrong'));
    opt.classList.add('selected');
    const correct = opt.dataset.correct === 'true';
    setTimeout(() => {
      opt.classList.add(correct ? 'correct' : 'wrong');
      const feedback = group.querySelector('.quiz-feedback');
      if (feedback) {
        feedback.textContent = correct ? '✓ Correct!' : '✗ Incorrect. ' + (group.dataset.explanation || '');
        feedback.style.color = correct ? '#22c55e' : '#ef4444';
        feedback.style.display = 'block';
      }
    }, 300);
  });
});
