 /* =====================================================
   PRECISION ENGINEERING — MAIN SCRIPT
   (includes auth/login/signup page script below)
===================================================== */
/* =====================================================
   PRECISION ENGINEERING — SCRIPT
===================================================== */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    setupPreloader();
    setupCursor();
    setupHeaderScroll();
    setupMobileNav();
    setupHeroGridParallax();
    setupDial();
    setupMagnetic();
    setupTiltCards();
    setupSplitText();
    setupScrollReveal();
    setupCounters();
    setupProcessLine();
    setupSlider();
    setupGauges();
    setupNewsletter();
    setupFooter();
    setupForm();
    setupActiveNav();
    setupSmoothAnchors();
  }

  /* ---------------------------------------------------
     ACTIVE NAV HIGHLIGHT
  --------------------------------------------------- */
  function setupActiveNav() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const pageName = currentPage.toLowerCase() || "index.html";

    document.querySelectorAll(".main-nav__link, .mobile-nav__links a").forEach((link) => {
      const href = link.getAttribute("href")?.split("#")[0] || "";
      if (!href) return;
      const normalizedHref = href.split("/").pop().toLowerCase();
      const isActive = normalizedHref === pageName || (pageName === "" && normalizedHref === "index.html");
      link.classList.toggle("active", isActive);
    });
  }

  /* ---------------------------------------------------
     SPLIT TEXT INTO PER-LETTER SPANS (for hover wiggle)
  --------------------------------------------------- */
  function setupSplitText() {
    document.querySelectorAll("[data-split]").forEach((el) => {
      const text = el.textContent;
      el.textContent = "";
      const chars = [];
      text.split("").forEach((ch) => {
        const span = document.createElement("span");
        span.className = "char" + (ch === " " ? " char--space" : "");
        span.textContent = ch === " " ? "\u00A0" : ch;
        el.appendChild(span);
        chars.push(span);
      });

      const normalized = text.replace(/\u00A0/g, " ").trim().toLowerCase();
      if (normalized === "a promise.") {
        const jumpChar = chars.find((span) => span.textContent.toLowerCase() === "p");
        if (jumpChar) jumpChar.classList.add("char--jump");
      }
    });
  }

  /* ---------------------------------------------------
     PRELOADER — simulated calibration sequence
  --------------------------------------------------- */
  function setupPreloader() {
    const preloader = document.getElementById("preloader");
    const ring = document.getElementById("preloaderRing");
    const needle = document.getElementById("preloaderNeedle");
    const pctEl = document.getElementById("preloaderPct");
    if (!preloader) return;

    document.body.classList.add("lock-scroll");

    const circumference = 326.7; // 2 * PI * 52
    let progress = 0;
    const duration = reduceMotion ? 200 : 1700;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      progress = Math.min(100, (elapsed / duration) * 100);
      const offset = circumference - (circumference * progress) / 100;
      ring.style.strokeDashoffset = offset.toFixed(1);
      needle.style.transform = `rotate(${(progress / 100) * 360}deg)`;
      pctEl.textContent = String(Math.floor(progress)).padStart(2, "0") + "%";

      if (progress < 100) {
        requestAnimationFrame(tick);
      } else {
        finish();
      }
    }

    function finish() {
      setTimeout(() => {
        preloader.classList.add("is-done");
        document.body.classList.remove("lock-scroll");
        setTimeout(() => preloader.remove(), 700);
      }, 220);
    }

    requestAnimationFrame(tick);
  }

  /* ---------------------------------------------------
     CURSOR RETICLE
  --------------------------------------------------- */
  function setupCursor() {
    if (!hasHover) return;
    const dot = document.getElementById("cursorDot");
    const ring = document.getElementById("cursorRing");
    if (!dot || !ring) return;

    let ringX = 0, ringY = 0, targetX = 0, targetY = 0;
    let activated = false;

    window.addEventListener("mousemove", (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      dot.style.left = targetX + "px";
      dot.style.top = targetY + "px";
      if (!activated) {
        activated = true;
        document.body.classList.add("has-cursor");
      }
    });

    function loop() {
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      ring.style.left = ringX + "px";
      ring.style.top = ringY + "px";
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    const hoverables = document.querySelectorAll(
      "a, button, .tilt-card, .img-placeholder, input, textarea, .slider__dot"
    );
    hoverables.forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("is-active"));
      el.addEventListener("mouseleave", () => ring.classList.remove("is-active"));
    });
  }

  /* ---------------------------------------------------
     HEADER SCROLL STATE
  --------------------------------------------------- */
  function setupHeaderScroll() {
    const header = document.getElementById("siteHeader");
    if (!header) return;
    function update() {
      header.classList.toggle("is-scrolled", window.scrollY > 16);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  /* ---------------------------------------------------
     MOBILE NAV
  --------------------------------------------------- */
  function setupMobileNav() {
    const toggle = document.getElementById("navToggle");
    const drawer = document.getElementById("mobileNav");
    if (!toggle || !drawer) return;

    function close() {
      toggle.classList.remove("is-open");
      drawer.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("lock-scroll");
    }
    function open() {
      toggle.classList.add("is-open");
      drawer.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("lock-scroll");
    }

    toggle.addEventListener("click", () => {
      toggle.classList.contains("is-open") ? close() : open();
    });
    drawer.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
  }

  /* ---------------------------------------------------
     HERO GRID PARALLAX
  --------------------------------------------------- */
  function setupHeroGridParallax() {
    if (reduceMotion || !hasHover) return;
    const hero = document.getElementById("home");
    const grid = document.getElementById("heroGrid");
    if (!hero || !grid) return;

    hero.addEventListener("mousemove", (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      grid.style.transform = `translate(${x * -18}px, ${y * -18}px)`;
    });
    hero.addEventListener("mouseleave", () => {
      grid.style.transform = "translate(0,0)";
    });
  }

  /* ---------------------------------------------------
     LIVE CALIBRATION DIAL — signature hero element
  --------------------------------------------------- */
  function setupDial() {
    const dial = document.getElementById("dial");
    const ticksGroup = document.getElementById("dialTicks");
    const needle = document.getElementById("dialNeedle");
    const valueEl = document.getElementById("dialValue");
    const driftEl = document.getElementById("dialDrift");
    if (!dial || !needle) return;

    // build tick marks
    const total = 60;
    const cx = 120, cy = 120;
    for (let i = 0; i < total; i++) {
      const isMajor = i % 5 === 0;
      const angleDeg = (i / total) * 360 - 90;
      const rad = (angleDeg * Math.PI) / 180;
      const rOuter = 108;
      const rInner = isMajor ? 92 : 100;
      const x1 = cx + rOuter * Math.cos(rad);
      const y1 = cy + rOuter * Math.sin(rad);
      const x2 = cx + rInner * Math.cos(rad);
      const y2 = cy + rInner * Math.sin(rad);
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", x1.toFixed(2));
      line.setAttribute("y1", y1.toFixed(2));
      line.setAttribute("x2", x2.toFixed(2));
      line.setAttribute("y2", y2.toFixed(2));
      line.setAttribute("class", "dial__tick" + (isMajor ? " dial__tick--major" : ""));
      ticksGroup.appendChild(line);
    }

    let current = 0;
    let target = 0;
    let idle = true;
    let lastInteraction = 0;

    function setTargetFromPoint(clientX, clientY) {
      const rect = dial.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = clientX - centerX;
      const dy = clientY - centerY;
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      target = angle + 90;
      idle = false;
      lastInteraction = performance.now();
    }

    window.addEventListener("mousemove", (e) => setTargetFromPoint(e.clientX, e.clientY), { passive: true });
    window.addEventListener(
      "touchmove",
      (e) => {
        if (e.touches[0]) setTargetFromPoint(e.touches[0].clientX, e.touches[0].clientY);
      },
      { passive: true }
    );

    function shortestDelta(a, b) {
      return ((((b - a) % 360) + 540) % 360) - 180;
    }

    function loop(now) {
      // go idle (gentle sweep) if no interaction for a while
      if (!idle && now - lastInteraction > 4000) idle = true;

      if (idle) {
        target = Math.sin(now / 1400) * 55;
      }

      const delta = shortestDelta(current, target);
      current += delta * (reduceMotion ? 1 : 0.08);

      needle.style.transform = `rotate(${current}deg)`;
      const normalized = ((current % 360) + 360) % 360;
      if (valueEl) valueEl.textContent = normalized.toFixed(1) + "\u00B0";
      if (driftEl) driftEl.textContent = (Math.abs(delta) * 0.0006).toFixed(4) + "mm";

      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  /* ---------------------------------------------------
     MAGNETIC BUTTONS
  --------------------------------------------------- */
  function setupMagnetic() {
    if (reduceMotion || !hasHover) return;
    document.querySelectorAll("[data-magnetic]").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.35}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "translate(0,0)";
      });
    });
  }

  /* ---------------------------------------------------
     3D TILT CARDS
  --------------------------------------------------- */
  function setupTiltCards() {
    if (reduceMotion || !hasHover) return;
    document.querySelectorAll(".tilt-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(700px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-3px)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(700px) rotateY(0) rotateX(0) translateY(0)";
      });
    });
  }

  /* ---------------------------------------------------
     SCROLL REVEAL (IntersectionObserver)
  --------------------------------------------------- */
  function setupScrollReveal() {
    const targets = document.querySelectorAll(".reveal-up, .reveal-line");
    if (!("IntersectionObserver" in window) || targets.length === 0) {
      targets.forEach((t) => t.classList.add("in-view"));
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    targets.forEach((t) => obs.observe(t));

    // hero headline lines reveal immediately on load (no scroll needed)
    document.querySelectorAll(".hero__headline .reveal-line").forEach((el, i) => {
      el.style.setProperty("--delay", `${0.15 + i * 0.1}s`);
      setTimeout(() => el.classList.add("in-view"), 300 + i * 80);
    });
  }

  /* ---------------------------------------------------
     STAT COUNTERS
  --------------------------------------------------- */
  function setupCounters() {
    const counters = document.querySelectorAll("[data-count-to]");
    if (counters.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((c) => obs.observe(c));

    function animateCounter(el) {
      const to = parseFloat(el.getAttribute("data-count-to"));
      const decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
      const suffix = el.getAttribute("data-suffix") || "";
      const duration = reduceMotion ? 0 : 1600;
      const start = performance.now();

      function tick(now) {
        const p = duration === 0 ? 1 : Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = to * eased;
        el.textContent = val.toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
  }

  /* ---------------------------------------------------
     PROCESS LINE FILL + STEP POP
  --------------------------------------------------- */
  function setupProcessLine() {
    const section = document.getElementById("processLine");
    const fill = document.getElementById("processFill");
    if (!section || !fill) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            fill.style.width = "100%";
            obs.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    obs.observe(section);

    const steps = section.querySelectorAll(".process-step");
    const stepObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            stepObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    steps.forEach((s) => stepObs.observe(s));
  }

  /* ---------------------------------------------------
     TESTIMONIAL SLIDER
  --------------------------------------------------- */
  function setupSlider() {
    const track = document.getElementById("sliderTrack");
    const dotsWrap = document.getElementById("sliderDots");
    const prevBtn = document.getElementById("sliderPrev");
    const nextBtn = document.getElementById("sliderNext");
    if (!track) return;

    const slides = Array.from(track.querySelectorAll(".slide"));
    let index = 0;
    let autoplayTimer = null;

    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = "slider__dot" + (i === 0 ? " is-active" : "");
      dot.setAttribute("aria-label", "Go to testimonial " + (i + 1));
      dot.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function render() {
      slides.forEach((s, i) => s.classList.toggle("is-active", i === index));
      dots.forEach((d, i) => d.classList.toggle("is-active", i === index));
    }

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      render();
      restartAutoplay();
    }

    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    function restartAutoplay() {
      if (autoplayTimer) clearInterval(autoplayTimer);
      if (reduceMotion) return;
      autoplayTimer = setInterval(next, 6000);
    }

    if (nextBtn) nextBtn.addEventListener("click", next);
    if (prevBtn) prevBtn.addEventListener("click", prev);

    const sliderEl = document.getElementById("slider");
    if (sliderEl) {
      sliderEl.addEventListener("mouseenter", () => autoplayTimer && clearInterval(autoplayTimer));
      sliderEl.addEventListener("mouseleave", restartAutoplay);
    }

    render();
    restartAutoplay();
  }

  /* ---------------------------------------------------
     FOOTER GAUGES — animated circular meters
  --------------------------------------------------- */
  function setupGauges() {
    const gauges = document.querySelectorAll(".gauge");
    if (gauges.length === 0) return;
    const circumference = 264; // 2 * PI * 42

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const gauge = entry.target;
          const target = parseFloat(gauge.getAttribute("data-gauge")) || 0;
          const fill = gauge.querySelector("[data-gauge-fill]");
          const valueEl = gauge.querySelector("[data-gauge-value]");
          const offset = circumference - (circumference * target) / 100;
          if (fill) fill.style.strokeDashoffset = String(reduceMotion ? offset : circumference);
          requestAnimationFrame(() => {
            if (fill) fill.style.strokeDashoffset = String(offset);
          });

          const duration = reduceMotion ? 0 : 1500;
          const start = performance.now();
          function tick(now) {
            const p = duration === 0 ? 1 : Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            if (valueEl) valueEl.firstChild.textContent = Math.round(target * eased);
            if (p < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
          obs.unobserve(gauge);
        });
      },
      { threshold: 0.5 }
    );
    gauges.forEach((g) => obs.observe(g));
  }

  /* ---------------------------------------------------
     FOOTER NEWSLETTER
  --------------------------------------------------- */
  function setupNewsletter() {
    const form = document.getElementById("footerNewsletter");
    const confirm = document.getElementById("footerNewsletterConfirm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      if (confirm) confirm.textContent = "Subscribed — welcome to the shop floor.";
      form.reset();
      setTimeout(() => { if (confirm) confirm.textContent = ""; }, 5000);
    });
  }

  /* ---------------------------------------------------
     FOOTER — live clock + sweep trigger
  --------------------------------------------------- */
  function setupFooter() {
    const clock = document.getElementById("footerClock");
    const yearEl = document.getElementById("footerYear");
    const footer = document.querySelector(".site-footer");

    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    if (clock) {
      function updateClock() {
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, "0");
        const mm = String(now.getMinutes()).padStart(2, "0");
        const ss = String(now.getSeconds()).padStart(2, "0");
        clock.textContent = `${hh}:${mm}:${ss}`;
      }
      updateClock();
      setInterval(updateClock, 1000);
    }

    if (footer && "IntersectionObserver" in window) {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              footer.classList.add("is-visible");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );
      obs.observe(footer);
    }
  }

  /* ---------------------------------------------------
     BACK TO TOP
  --------------------------------------------------- */


  /* ---------------------------------------------------
     CONTACT FORM (front-end only — no backend wired up)
  --------------------------------------------------- */
  function setupForm() {
    const form = document.getElementById("quoteForm");
    const confirm = document.getElementById("formConfirm");
    const submitText = document.getElementById("submitText");
    const fileInput = document.getElementById("fFile");
    const fileText = document.getElementById("fileDropText");

    if (fileInput && fileText) {
      fileInput.addEventListener("change", () => {
        fileText.textContent = fileInput.files[0] ? fileInput.files[0].name : "Attach drawing or CAD file";
      });
    }

    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateContactForm(form) || !form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const submitBtn = form.querySelector("button[type=submit]");
      submitBtn.disabled = true;
      if (submitText) submitText.textContent = "Sending...";

      setTimeout(() => {
        if (submitText) submitText.textContent = "Send Request";
        submitBtn.disabled = false;
        if (confirm) confirm.textContent = "Submitted";
        form.reset();
        if (fileText) fileText.textContent = "Attach drawing or CAD file";
        setTimeout(() => { if (confirm) confirm.textContent = ""; }, 3000);
      }, 1100);
    });
  }

  function validateContactForm(form) {
    const firstNameInput = form.querySelector('input[name="firstName"]');
    const lastNameInput = form.querySelector('input[name="lastName"]');
    const emailInput = form.querySelector('input[name="email"]');
    const namePattern = /^[a-zA-Z' -]+$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = true;

    if (firstNameInput && !namePattern.test(firstNameInput.value.trim())) {
      firstNameInput.setCustomValidity("First name must contain only letters, spaces, hyphens, and apostrophes.");
      isValid = false;
    } else if (firstNameInput) {
      firstNameInput.setCustomValidity("");
    }

    if (lastNameInput && !namePattern.test(lastNameInput.value.trim())) {
      lastNameInput.setCustomValidity("Last name must contain only letters, spaces, hyphens, and apostrophes.");
      isValid = false;
    } else if (lastNameInput) {
      lastNameInput.setCustomValidity("");
    }

    if (emailInput && !emailPattern.test(emailInput.value.trim())) {
      emailInput.setCustomValidity("Invalid email. Use a full address like name@example.com.");
      isValid = false;
    } else if (emailInput) {
      emailInput.setCustomValidity("");
    }

    return isValid;
  }

  /* ---------------------------------------------------
     SMOOTH ANCHOR SCROLL (offset for fixed header)
  --------------------------------------------------- */
  function setupSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        const id = link.getAttribute("href");
        if (!id || id === "#") return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const headerOffset = 78;
        const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
      });
    });
  }
})();

/* =====================================================
   AUTH PAGES — login.html / signup.html
===================================================== */
/* =====================================================
   AUTH PAGES — SCRIPT (login.html / signup.html)
===================================================== */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("DOMContentLoaded", () => {
    setupPasswordToggles();
    setupPasswordStrength();
    setupAuthDial();
    setupAuthForms();
    setupAuthValidation();
  });

  /* ---------------------------------------------------
     AUTH FORM VALIDATION
  ---------------------------------------------------
  */
  function setupAuthValidation() {
    const emailInputs = document.querySelectorAll('input[type="email"]');
    const passwordInputs = document.querySelectorAll('input[type="password"]');

    emailInputs.forEach((input) => {
      input.addEventListener("input", () => input.setCustomValidity(""));
      input.addEventListener("invalid", () => {
        if (input.validity.valueMissing) {
          input.setCustomValidity("Email is required.");
        } else if (input.validity.typeMismatch || input.validity.patternMismatch) {
          input.setCustomValidity("Invalid email. Use a full address like name@example.com.");
        } else {
          input.setCustomValidity("Invalid email.");
        }
      });
    });

    passwordInputs.forEach((input) => {
      input.addEventListener("input", () => input.setCustomValidity(""));
      input.addEventListener("invalid", () => {
        if (input.validity.valueMissing) {
          input.setCustomValidity("Password is required.");
        } else if (input.validity.tooShort) {
          input.setCustomValidity("Password must be at least 8 characters.");
        } else {
          input.setCustomValidity("Invalid password.");
        }
      });
    });
  }

  /* ---------------------------------------------------
     SHOW / HIDE PASSWORD
  --------------------------------------------------- */
  function setupPasswordToggles() {
    document.querySelectorAll(".pw-toggle").forEach((btn) => {
      const field = btn.closest(".form__field--password");
      const input = field ? field.querySelector("input") : null;
      const eye = btn.querySelector(".pw-toggle__eye");
      const eyeOff = btn.querySelector(".pw-toggle__eye-off");
      if (!input) return;

      btn.addEventListener("click", () => {
        const isPassword = input.type === "password";
        input.type = isPassword ? "text" : "password";
        if (eye) eye.hidden = isPassword;
        if (eyeOff) eyeOff.hidden = !isPassword;
        btn.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
      });
    });
  }

  /* ---------------------------------------------------
     PASSWORD STRENGTH METER (signup only)
  --------------------------------------------------- */
  function setupPasswordStrength() {
    const input = document.getElementById("supPassword");
    const bar = document.getElementById("pwStrengthBar");
    const label = document.getElementById("pwStrengthLabel");
    if (!input || !bar || !label) return;

    const levels = [
      { color: "#d6543a", text: "Use 8+ characters" },
      { color: "#d6543a", text: "Weak password" },
      { color: "#e8a33d", text: "Okay password" },
      { color: "#cfd84d", text: "Good password" },
      { color: "#5fd97a", text: "Strong password" },
    ];

    input.addEventListener("input", () => {
      const val = input.value;
      let score = 0;
      if (val.length >= 8) score++;
      if (val.length >= 12) score++;
      if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
      if (/[0-9]/.test(val)) score++;
      if (/[^A-Za-z0-9]/.test(val)) score++;
      score = Math.min(score, 4);

      const pct = val.length === 0 ? 0 : (score / 4) * 100;
      bar.style.width = pct + "%";
      bar.style.background = levels[score].color;
      label.textContent = val.length === 0 ? "Use 8+ characters" : levels[score].text;
    });
  }

  /* ---------------------------------------------------
     AMBIENT CALIBRATION DIAL (visual side panel)
  --------------------------------------------------- */
  function setupAuthDial() {
    const dial = document.getElementById("authDial");
    const ticksGroup = document.getElementById("authDialTicks");
    const needle = document.getElementById("authDialNeedle");
    if (!dial || !needle || !ticksGroup) return;

    const total = 60;
    const cx = 120, cy = 120;
    for (let i = 0; i < total; i++) {
      const isMajor = i % 5 === 0;
      const angleDeg = (i / total) * 360 - 90;
      const rad = (angleDeg * Math.PI) / 180;
      const rOuter = 108;
      const rInner = isMajor ? 92 : 100;
      const x1 = cx + rOuter * Math.cos(rad);
      const y1 = cy + rOuter * Math.sin(rad);
      const x2 = cx + rInner * Math.cos(rad);
      const y2 = cy + rInner * Math.sin(rad);
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", x1.toFixed(2));
      line.setAttribute("y1", y1.toFixed(2));
      line.setAttribute("x2", x2.toFixed(2));
      line.setAttribute("y2", y2.toFixed(2));
      line.setAttribute("class", "dial__tick" + (isMajor ? " dial__tick--major" : ""));
      ticksGroup.appendChild(line);
    }

    if (reduceMotion) {
      needle.style.transform = "rotate(0deg)";
      return;
    }

    function loop(now) {
      const angle = Math.sin(now / 1600) * 38;
      needle.style.transform = `rotate(${angle}deg)`;
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  /* ---------------------------------------------------
     FORM SUBMIT STATES (front-end only, no backend)
  --------------------------------------------------- */
  function setupAuthForms() {
    bindForm("loginForm", "loginSubmit", "loginSubmitText", "loginConfirm", "Log In", "Logged in — redirecting...");
    bindForm("signupForm", "signupSubmit", "signupSubmitText", "signupConfirm", "Create Account", "Account created — welcome aboard.");
  }

  function bindForm(formId, btnId, textId, confirmId, idleText, successText) {
    const form = document.getElementById(formId);
    const btn = document.getElementById(btnId);
    const textEl = document.getElementById(textId);
    const confirm = document.getElementById(confirmId);
    if (!form || !btn) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateAuthForm(form) || !form.checkValidity()) {
        form.reportValidity();
        return;
      }
      btn.classList.add("is-loading");
      btn.disabled = true;

      setTimeout(() => {
        btn.classList.remove("is-loading");
        btn.disabled = false;
        if (confirm) confirm.textContent = successText;
        if (textEl) textEl.textContent = idleText;
      }, 1200);
    });
  }

  function validateAuthForm(form) {
    const emailInput = form.querySelector('input[type="email"]');
    const passwordInput = form.querySelector('input[type="password"]');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = true;

    if (emailInput) {
      const emailValue = emailInput.value.trim();
      if (!emailPattern.test(emailValue)) {
        emailInput.setCustomValidity("Invalid email. Use a full address like name@example.com.");
        isValid = false;
      } else {
        emailInput.setCustomValidity("");
      }
    }

    if (passwordInput) {
      const passwordValue = passwordInput.value;
      if (passwordValue.length < 8) {
        passwordInput.setCustomValidity("Password must be at least 8 characters.");
        isValid = false;
      } else {
        passwordInput.setCustomValidity("");
      }
    }

    return isValid;
  }
})();