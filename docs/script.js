const body = document.body;
const header = document.querySelector(".site-header");
const navLinks = Array.from(document.querySelectorAll(".main-nav a"));
const hashNavLinks = navLinks.filter((link) => link.getAttribute("href")?.startsWith("#"));
const sections = hashNavLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const syncHeaderState = () => {
  const shouldElevate = window.scrollY > 12;
  body.classList.toggle("is-scrolled", shouldElevate);
};

const setActiveLink = (id) => {
  hashNavLinks.forEach((link) => {
    const isActive = Boolean(id) && link.getAttribute("href") === `#${id}`;
    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

const syncActiveSection = () => {
  if (sections.length === 0) {
    return;
  }

  const headerOffset = header?.offsetHeight ?? 0;
  const anchor = window.scrollY + headerOffset + 40;
  const activeSection =
    sections.find((section) => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      return anchor >= top && anchor < bottom;
    })?.id ?? "";

  setActiveLink(activeSection);
};

const syncPageState = () => {
  syncHeaderState();
  syncActiveSection();
};

window.addEventListener("scroll", syncPageState, { passive: true });
window.addEventListener("load", syncPageState);
window.addEventListener("resize", syncActiveSection);
window.addEventListener("hashchange", () => {
  window.requestAnimationFrame(syncActiveSection);
});

syncPageState();
