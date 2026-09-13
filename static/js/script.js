/**
 * Fruteinz™ Protein Bites — site interactions.
 *
 * Vanilla JS, no dependencies:
 *  - Sticky nav compact/translucent state + active-link highlighting
 *  - Accessible hamburger menu (mobile)
 *  - Scroll-reveal animation system (IntersectionObserver)
 *  - Lightweight multi-layer parallax (rAF, disabled on reduced motion)
 *  - Flavour selector (tabs/panels)
 *  - Find Your Bite quiz (2 questions -> recommended flavour)
 */

(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------------------------------------------------------------------
   * Sticky navigation state
   * ------------------------------------------------------------------- */
  var nav = document.getElementById("siteNav");
  var SCROLL_THRESHOLD = 24;

  function updateNavState() {
    if (!nav) return;
    if (window.scrollY > SCROLL_THRESHOLD) {
      nav.classList.add("is-scrolled");
    } else {
      nav.classList.remove("is-scrolled");
    }
  }

  updateNavState();
  window.addEventListener("scroll", updateNavState, { passive: true });

  /* ---------------------------------------------------------------------
   * Mobile hamburger menu
   * ------------------------------------------------------------------- */
  var hamburger = document.getElementById("hamburger");
  var mobileMenu = document.getElementById("mobileMenu");

  function closeMobileMenu() {
    if (!hamburger || !mobileMenu) return;
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "Open menu");
    mobileMenu.classList.remove("is-open");
    mobileMenu.setAttribute("aria-hidden", "true");
  }

  function openMobileMenu() {
    if (!hamburger || !mobileMenu) return;
    hamburger.setAttribute("aria-expanded", "true");
    hamburger.setAttribute("aria-label", "Close menu");
    mobileMenu.classList.add("is-open");
    mobileMenu.setAttribute("aria-hidden", "false");
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", function () {
      var isOpen = hamburger.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMobileMenu();
        hamburger.focus();
      }
    });

    mobileMenu.querySelectorAll("[data-nav-link]").forEach(function (link) {
      link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("click", function (event) {
      var isOpen = hamburger.getAttribute("aria-expanded") === "true";
      if (!isOpen) return;
      var withinMenu = mobileMenu.contains(event.target);
      var isToggle = hamburger.contains(event.target);
      if (!withinMenu && !isToggle) {
        closeMobileMenu();
      }
    });
  }

  /* ---------------------------------------------------------------------
   * Active nav-link highlighting while scrolling
   * ------------------------------------------------------------------- */
  var navLinks = document.querySelectorAll("[data-nav-link]");
  var sections = Array.prototype.map.call(
    document.querySelectorAll("main > section[id]"),
    function (s) {
      return s;
    }
  );

  function setActiveLink(id) {
    navLinks.forEach(function (link) {
      var match = link.getAttribute("href") === "#" + id;
      link.classList.toggle("is-active", match);
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    sections.forEach(function (section) {
      navObserver.observe(section);
    });
  }

  /* ---------------------------------------------------------------------
   * Scroll-reveal animation system
   * ------------------------------------------------------------------- */
  var revealSelectors =
    ".reveal, .reveal-left, .reveal-right, .scale-in, .stagger-item";
  var revealTargets = document.querySelectorAll(revealSelectors);

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    revealTargets.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ---------------------------------------------------------------------
   * Parallax (rAF-throttled, multi-speed)
   * ------------------------------------------------------------------- */
  var parallaxEls = Array.prototype.slice.call(
    document.querySelectorAll(".parallax")
  );
  var ticking = false;

  var MAX_PARALLAX_OFFSET = 46; // keeps movement subtle and bounded (never "extreme")

  function applyParallax() {
    var viewportH = window.innerHeight;
    parallaxEls.forEach(function (el) {
      var speed = parseFloat(el.getAttribute("data-speed")) || 0.1;
      var rect = el.getBoundingClientRect();

      // Elements far outside the viewport (or its near neighbourhood) are not
      // visible, so skip transforming them. Without this guard the offset
      // (distance * speed) grows unbounded the further a section scrolls
      // away, which then snaps back oddly when it re-enters view.
      var inRange = rect.bottom > -viewportH && rect.top < viewportH * 2;
      if (!inRange) return;

      var elementCenter = rect.top + rect.height / 2;
      var distanceFromCenter = elementCenter - viewportH / 2;
      var offset = distanceFromCenter * speed * -1;
      offset = Math.max(-MAX_PARALLAX_OFFSET, Math.min(MAX_PARALLAX_OFFSET, offset));
      el.style.transform = "translate3d(0, " + offset.toFixed(1) + "px, 0)";
    });
    ticking = false;
  }

  function requestParallaxTick() {
    if (!ticking) {
      window.requestAnimationFrame(applyParallax);
      ticking = true;
    }
  }

  if (!prefersReducedMotion && parallaxEls.length) {
    window.addEventListener("scroll", requestParallaxTick, { passive: true });
    window.addEventListener("resize", requestParallaxTick);
    applyParallax();
  }

  /* ---------------------------------------------------------------------
   * Flavour selector (tabs / panels)
   * ------------------------------------------------------------------- */
  var flavourSection = document.querySelector(".flavour-journey");
  var flavourTabs = document.querySelectorAll(".flavour-tab");
  var flavourPanels = document.querySelectorAll(".flavour-panel");

  function activateFlavour(key) {
    flavourTabs.forEach(function (tab) {
      var match = tab.getAttribute("data-flavour") === key;
      tab.classList.toggle("is-active", match);
      tab.setAttribute("aria-selected", match ? "true" : "false");
    });
    flavourPanels.forEach(function (panel) {
      var match = panel.getAttribute("data-flavour-panel") === key;
      panel.classList.toggle("is-active", match);
      if (match) {
        panel.removeAttribute("hidden");
      } else {
        panel.setAttribute("hidden", "");
      }
    });
    if (flavourSection) {
      flavourSection.setAttribute("data-active-flavour", key);
    }
  }

  flavourTabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () {
      activateFlavour(tab.getAttribute("data-flavour"));
    });

    tab.addEventListener("keydown", function (event) {
      var lastIndex = flavourTabs.length - 1;
      var nextIndex = null;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        nextIndex = index === lastIndex ? 0 : index + 1;
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        nextIndex = index === 0 ? lastIndex : index - 1;
      }
      if (nextIndex !== null) {
        event.preventDefault();
        var nextTab = flavourTabs[nextIndex];
        nextTab.focus();
        activateFlavour(nextTab.getAttribute("data-flavour"));
      }
    });
  });

  /* ---------------------------------------------------------------------
   * Find Your Bite quiz
   * ------------------------------------------------------------------- */
  var flavourDataEl = document.getElementById("flavourData");
  var FLAVOURS = [];
  try {
    FLAVOURS = flavourDataEl ? JSON.parse(flavourDataEl.textContent) : [];
  } catch (err) {
    FLAVOURS = [];
  }

  // How each "what are you reaching for" answer nudges the flavour score.
  var VIBE_WEIGHTS = {
    power: { avocado: 1, jackfruit: 1 },
    fruity: { guava: 1, raspberry: 1 },
    convenient: { jackfruit: 1, guava: 1 },
    adventurous: { blackberry: 1, avocado: 1 },
  };

  var quizCard = document.getElementById("quizCard");
  var progressBar = document.getElementById("quizProgressBar");
  var quizAnswers = { 1: null, 2: null };

  function goToStep(step) {
    if (!quizCard) return;
    quizCard.querySelectorAll(".quiz-step").forEach(function (el) {
      var match = el.getAttribute("data-step") === String(step);
      el.classList.toggle("is-active", match);
    });
    var progressMap = { 1: "33.33%", 2: "66.66%", result: "100%" };
    if (progressBar) {
      progressBar.style.width = progressMap[step] || "0%";
    }
  }

  function computeResult() {
    var scores = {};
    FLAVOURS.forEach(function (f) {
      scores[f.key] = 0;
    });

    var vibe = quizAnswers[1];
    if (vibe && VIBE_WEIGHTS[vibe]) {
      Object.keys(VIBE_WEIGHTS[vibe]).forEach(function (key) {
        scores[key] = (scores[key] || 0) + VIBE_WEIGHTS[vibe][key];
      });
    }

    var colorChoice = quizAnswers[2];
    if (colorChoice && scores.hasOwnProperty(colorChoice)) {
      scores[colorChoice] += 2; // direct colour pick is the strongest signal
    }

    var bestKey = colorChoice || FLAVOURS[0].key;
    var bestScore = -Infinity;
    Object.keys(scores).forEach(function (key) {
      if (scores[key] > bestScore) {
        bestScore = scores[key];
        bestKey = key;
      }
    });

    return FLAVOURS.filter(function (f) {
      return f.key === bestKey;
    })[0];
  }

  function showResult() {
    var flavour = computeResult();
    if (!flavour) return;

    var resultImg = document.getElementById("resultImg");
    var resultTitle = document.getElementById("resultTitle");
    var resultDesc = document.getElementById("resultDesc");
    var resultCta = document.getElementById("resultCta");

    if (resultImg) {
      resultImg.src = flavour.image;
      resultImg.alt = "Fruteinz " + flavour.name + " Protein Bites pouch";
    }
    if (resultTitle) {
      var article = /^[aeiou]/i.test(flavour.name) ? "an" : "a";
      resultTitle.textContent = "You're " + article + " " + flavour.name + " Bite.";
      resultTitle.style.color = flavour.color;
    }
    if (resultDesc) {
      resultDesc.textContent = flavour.vibe || flavour.description;
    }
    if (resultCta) {
      resultCta.textContent = "Meet the " + flavour.name + " bite";
    }

    goToStep("result");
  }

  if (quizCard) {
    quizCard.querySelectorAll('.quiz-option[data-q="1"]').forEach(function (btn) {
      btn.addEventListener("click", function () {
        quizAnswers[1] = btn.getAttribute("data-value");
        quizCard
          .querySelectorAll('.quiz-option[data-q="1"]')
          .forEach(function (b) {
            b.classList.toggle("is-selected", b === btn);
          });
        window.setTimeout(function () {
          goToStep(2);
        }, 180);
      });
    });

    quizCard.querySelectorAll('.quiz-option[data-q="2"]').forEach(function (btn) {
      btn.addEventListener("click", function () {
        quizAnswers[2] = btn.getAttribute("data-value");
        quizCard
          .querySelectorAll('.quiz-option[data-q="2"]')
          .forEach(function (b) {
            b.classList.toggle("is-selected", b === btn);
          });
        window.setTimeout(showResult, 180);
      });
    });

    var restartBtn = document.getElementById("quizRestart");
    if (restartBtn) {
      restartBtn.addEventListener("click", function () {
        quizAnswers = { 1: null, 2: null };
        quizCard.querySelectorAll(".quiz-option").forEach(function (b) {
          b.classList.remove("is-selected");
        });
        goToStep(1);
      });
    }
  }
})();
