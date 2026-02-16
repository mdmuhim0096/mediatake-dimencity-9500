document.addEventListener("DOMContentLoaded", () => {
  // Mobile nav toggle
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");

  if (toggle) {
    toggle.addEventListener("click", () => {
      header.classList.toggle("nav-open");
    });
  }

  // Close nav when clicking a link (mobile)
  document.querySelectorAll(".site-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      header.classList.remove("nav-open");
    });
  });

  // Scroll-triggered animations using IntersectionObserver
  const animated = document.querySelectorAll("[data-animate]");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -15% 0px",
        threshold: 0.15,
      }
    );

    animated.forEach((el) => {
      const delay = el.getAttribute("data-animate-delay");
      if (delay) {
        el.style.transitionDelay = `${parseInt(delay, 10)}ms`;
      }
      observer.observe(el);
    });
  } else {
    // Fallback: just show everything
    animated.forEach((el) => el.classList.add("in-view"));
  }
});