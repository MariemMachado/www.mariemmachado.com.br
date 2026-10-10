(function () {
  const whatsappUrl = 'https://wa.me/5548988127289';

  const openWhatsApp = function (event, customText) {
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }

    const text = customText ? encodeURIComponent(customText) : '';
    const target = text ? whatsappUrl + '?text=' + text : whatsappUrl;
    window.open(target, '_blank', 'noopener,noreferrer');
  };

  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', function () {
      setTimeout(function () {
        loader.style.opacity = '0';
        loader.style.pointerEvents = 'none';
        setTimeout(function () {
          loader.style.display = 'none';
        }, 450);
      }, 700);
    });
  }

  const statsNumber = document.getElementById('stNumber');
  if (statsNumber) {
    const target = Number(statsNumber.dataset.count);
    const suffix = statsNumber.dataset.suffix || '';
    const statsSection = document.getElementById('stOuter') || statsNumber;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const showTarget = function () {
      statsNumber.textContent = String(target) + suffix;
    };

    const animateCount = function () {
      if (!Number.isFinite(target) || target < 0 || prefersReducedMotion) {
        showTarget();
        return;
      }

      const duration = 1400;
      const startTime = performance.now();
      statsNumber.textContent = '1' + suffix;

      const updateCount = function (time) {
        const progress = Math.min((time - startTime) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const current = Math.min(target, Math.max(1, Math.round(easedProgress * target)));
        statsNumber.textContent = String(current) + suffix;

        if (progress < 1) {
          window.requestAnimationFrame(updateCount);
        } else {
          showTarget();
        }
      };

      window.requestAnimationFrame(updateCount);
    };

    if ('IntersectionObserver' in window) {
      const statsObserver = new IntersectionObserver(function (entries, observer) {
        if (entries.some(function (entry) { return entry.isIntersecting; })) {
          observer.disconnect();
          animateCount();
        }
      }, { threshold: 0.35 });
      statsObserver.observe(statsSection);
    } else {
      animateCount();
    }
  }

  const processSection = document.getElementById('procOuter');
  const processTrack = document.getElementById('procTrack');
  const processCounter = document.getElementById('procCurNum');
  const processProgress = document.getElementById('procFill');
  if (processSection && processTrack && processCounter && processProgress) {
    const processSlides = Array.from(processTrack.querySelectorAll('.proc-slide'));
    const desktopProcess = window.matchMedia('(min-width: 981px)');
    let processFrame = 0;

    const updateProcess = function () {
      processFrame = 0;
      if (!desktopProcess.matches || processSlides.length < 2) {
        processTrack.style.transform = '';
        processCounter.textContent = '01';
        processProgress.style.width = '0%';
        return;
      }

      const scrollDistance = processSection.offsetHeight - window.innerHeight;
      const sectionTop = processSection.getBoundingClientRect().top;
      const progress = scrollDistance > 0
        ? Math.min(1, Math.max(0, -sectionTop / scrollDistance))
        : 0;
      const slidePosition = progress * (processSlides.length - 1);
      const activeSlide = Math.min(processSlides.length - 1, Math.round(slidePosition));
      const translateX = slidePosition * processSection.clientWidth;

      processTrack.style.transform = 'translate3d(-' + translateX + 'px, 0, 0)';
      processCounter.textContent = String(activeSlide + 1).padStart(2, '0');
      processProgress.style.width = (progress * 100) + '%';
    };

    const scheduleProcessUpdate = function () {
      if (!processFrame) {
        processFrame = window.requestAnimationFrame(updateProcess);
      }
    };

    window.addEventListener('scroll', scheduleProcessUpdate, { passive: true });
    window.addEventListener('resize', scheduleProcessUpdate);
    if (typeof desktopProcess.addEventListener === 'function') {
      desktopProcess.addEventListener('change', scheduleProcessUpdate);
    } else {
      desktopProcess.addListener(scheduleProcessUpdate);
    }
    updateProcess();
  }

  document.querySelectorAll('[data-quote-open], .btn-wpp, .btn-acc, .nav-pill, .is-btn').forEach(function (element) {
    element.addEventListener('click', function (event) {
      const quotePanel = document.getElementById('quotePanel');
      if (quotePanel && element.hasAttribute('data-quote-open')) {
        quotePanel.classList.add('is-open');
      }
      if (!element.matches('.nav-pill') && !element.matches('.btn-wpp') && !element.matches('.btn-acc') && !element.matches('.is-btn')) {
        return;
      }
      openWhatsApp(event);
    }, { passive: false });
  });

  const menuBtn = document.getElementById('menuBtn');
  const navOv = document.getElementById('navOv');
  if (menuBtn && navOv) {
    menuBtn.addEventListener('click', function () {
      const isOpen = navOv.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', String(isOpen));
    });

    navOv.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function () {
        navOv.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const quoteClose = document.getElementById('quoteClose');
  const quotePanel = document.getElementById('quotePanel');
  const quoteLauncher = document.getElementById('quoteLauncher');
  if (quotePanel && quoteLauncher) {
    quoteLauncher.addEventListener('click', function () {
      const isOpen = quotePanel.classList.toggle('is-open');
      quoteLauncher.setAttribute('aria-expanded', String(isOpen));
    });
  }

  if (quoteClose && quotePanel) {
    quoteClose.addEventListener('click', function () {
      quotePanel.classList.remove('is-open');
      if (quoteLauncher) {
        quoteLauncher.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const backTop = document.getElementById('backTop');
  if (backTop) {
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
  }

  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    const toggleText = themeToggle.querySelector('.theme-toggle__text');
    const syncThemeLabel = function () {
      const isLight = document.body.classList.contains('theme-light');
      themeToggle.setAttribute('aria-pressed', String(isLight));
      if (toggleText) {
        toggleText.textContent = isLight ? 'Dark' : 'Light';
      }
    };

    themeToggle.addEventListener('click', function () {
      document.body.classList.toggle('theme-light');
      syncThemeLabel();
    });

    syncThemeLabel();
  }

  const form = document.getElementById('quoteForm');
  if (form) {
    const steps = Array.from(form.querySelectorAll('.quote-step'));
    const nextBtn = document.getElementById('quoteNext');
    const backBtn = document.getElementById('quoteBack');
    const sendBtn = document.getElementById('quoteSend');
    const progressFill = document.getElementById('quoteProgressFill');
    let currentStep = 0;

    const updateWizard = function () {
      const isLastStep = currentStep === steps.length - 1;
      form.dataset.activeStep = String(currentStep);
      steps.forEach(function (step, index) {
        step.classList.toggle('is-active', index === currentStep);
      });
      if (backBtn) {
        backBtn.style.visibility = currentStep === 0 ? 'hidden' : 'visible';
      }
      if (nextBtn) {
        nextBtn.style.display = isLastStep ? 'none' : 'inline-flex';
      }
      if (sendBtn) {
        sendBtn.style.display = isLastStep ? 'inline-flex' : 'none';
      }
      const progress = ((currentStep + 1) / steps.length) * 100;
      if (progressFill) {
        progressFill.style.width = progress + '%';
      }
    };

    const ensureField = function (fieldName) {
      let field = form.querySelector('input[name="' + fieldName + '"]');
      if (!field) {
        field = document.createElement('input');
        field.type = 'hidden';
        field.name = fieldName;
        form.appendChild(field);
      }
      return field;
    };

    form.querySelectorAll('.quote-options button').forEach(function (button) {
      button.addEventListener('click', function () {
        const fieldName = button.closest('.quote-options').dataset.field;
        const hiddenField = ensureField(fieldName);
        hiddenField.value = button.dataset.value;

        button.parentNode.querySelectorAll('button').forEach(function (item) {
          item.classList.toggle('is-selected', item === button);
        });
      });
    });

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        if (currentStep < steps.length - 1) {
          currentStep += 1;
          updateWizard();
        }
      });
    }

    if (backBtn) {
      backBtn.addEventListener('click', function () {
        if (currentStep > 0) {
          currentStep -= 1;
          updateWizard();
        }
      });
    }

    updateWizard();

    form.addEventListener('submit', async function (event) {
      event.preventDefault();

      const selected = {};
      form.querySelectorAll('.quote-options button.is-selected').forEach(function (button) {
        const fieldName = button.closest('.quote-options').dataset.field;
        if (fieldName) selected[fieldName] = button.dataset.value;
      });

      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
      Object.assign(payload, selected);

      const name = payload.nome || 'Cliente';
      const motivo = payload.detalhes || 'Quero um diagnóstico do site';
      const text = [
        'Olá! Gostaria de um diagnóstico de site.',
        '',
        'Nome: ' + name,
        'Empresa: ' + (payload.empresa || 'Não informado'),
        'Serviço: ' + (payload.servico || 'Não informado'),
        'Objetivo: ' + (payload.objetivo || 'Não informado'),
        'Momento: ' + (payload.momento || 'Não informado'),
        'Prazo: ' + (payload.prazo || 'Não informado'),
        'Investimento: ' + (payload.investimento || 'Não informado'),
        'Detalhes: ' + motivo
      ].join('\n');

      try {
        await fetch('/api/lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (error) {
        console.warn('Falha ao salvar lead localmente:', error);
      }

      openWhatsApp(null, text);
    });
  }
})();
