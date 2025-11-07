const body = document.body;

let scroll3dUpdate = null;

const updateCurrentYear = () => {
  const yearHolder = document.getElementById("current-year");
  if (yearHolder) {
    yearHolder.textContent = new Date().getFullYear();
  }
};

const setupNavigation = () => {
  const navToggle = document.querySelector(".nav-toggle");
  const navList = document.querySelector(".nav-list");
  const navLinks = document.querySelectorAll(".nav-link");

  if (!navList) return;

  const setActiveLink = () => {
    const page = body.dataset.page;
    navLinks.forEach((link) => {
      const target = link.dataset.page;
      const isActive = page && target && page === target;
      link.classList.toggle("active", Boolean(isActive));
    });
  };

  setActiveLink();

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      navList.classList.toggle("open");
    });
  }

  navLinks.forEach((link) =>
    link.addEventListener("click", () => {
      if (navList.classList.contains("open")) {
        navList.classList.remove("open");
        navToggle?.setAttribute("aria-expanded", "false");
      }
    })
  );
};

const intersectionAnimations = () => {
  const animatedNodes = document.querySelectorAll("[data-animate]");
  if (!animatedNodes.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in-view");
          if (entry.target.dataset.animate === "scroll-3d") {
            scroll3dUpdate?.();
          }
        }
      });
    },
    { threshold: 0.25, rootMargin: "0px 0px -10%" }
  );

  animatedNodes.forEach((node) => observer.observe(node));
};

const scrollDrivenDepth = () => {
  const depthNodes = document.querySelectorAll('[data-animate="scroll-3d"]');
  if (!depthNodes.length) return;

  scroll3dUpdate = () => {
    depthNodes.forEach((node) => {
      if (!node.classList.contains("is-in-view")) return;
      const rect = node.getBoundingClientRect();
      const viewHeight = window.innerHeight || document.documentElement.clientHeight;
      const center = rect.top + rect.height / 2;
      const progress = 1 - Math.min(Math.max(center / viewHeight, 0), 1);
      const rotate = (progress - 0.5) * 30; // -15deg to 15deg
      const translateZ = progress * 120 - 60; // oscillate around 0
      node.style.transform = `rotateX(${rotate.toFixed(2)}deg) translateZ(${translateZ.toFixed(1)}px)`;
    });
  };

  scroll3dUpdate();
  window.addEventListener("scroll", scroll3dUpdate, { passive: true });
  window.addEventListener("resize", scroll3dUpdate);
};

const heroParallax = () => {
  const heroCard = document.querySelector(".card-3d");
  if (!heroCard) return;

  const handlePointer = (event) => {
    const rect = heroCard.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const rotateY = (0.5 - x) * 14;
    const rotateX = (y - 0.5) * 16;

    heroCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const reset = () => {
    heroCard.style.transform = "rotateX(0deg) rotateY(0deg)";
  };

  heroCard.addEventListener("pointermove", handlePointer);
  heroCard.addEventListener("pointerleave", reset);
};

const hoverSpring = () => {
  const interactiveCards = document.querySelectorAll(
    ".achievement-card, .skill-card, .project-card, .service-card, .detail-card, .pillars li"
  );

  interactiveCards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(12px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
};

const init = () => {
  updateCurrentYear();
  setupNavigation();
  intersectionAnimations();
  scrollDrivenDepth();
  heroParallax();
  hoverSpring();
};

document.addEventListener("DOMContentLoaded", init);
