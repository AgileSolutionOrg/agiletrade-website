const header = document.querySelector(".site-header");
const toggle = document.querySelector(".nav-toggle");

if (header && toggle) {
  toggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("menu-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  header.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      header.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}
