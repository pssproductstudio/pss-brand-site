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

  const isNearPageEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  if (isNearPageEnd) {
    setActiveLink(sections[sections.length - 1].id);
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

const scrollToHashTarget = (event) => {
  const href = event.currentTarget.getAttribute("href");
  if (!href?.startsWith("#")) {
    return;
  }

  const target = href === "#top" ? body : document.querySelector(href);
  if (!target) {
    return;
  }

  event.preventDefault();

  const headerOffset = header?.offsetHeight ?? 0;
  const top = href === "#top" ? 0 : target.offsetTop - headerOffset - 16;
  window.history.pushState(null, "", href);
  const previousScrollBehavior = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = "auto";
  window.scrollTo(0, Math.max(0, top));
  document.documentElement.style.scrollBehavior = previousScrollBehavior;
  setActiveLink(href.slice(1));
};

const syncPageState = () => {
  syncHeaderState();
  syncActiveSection();
};

hashNavLinks.forEach((link) => {
  link.addEventListener("click", scrollToHashTarget);
});

window.addEventListener("scroll", syncPageState, { passive: true });
window.addEventListener("load", syncPageState);
window.addEventListener("resize", syncActiveSection);
window.addEventListener("hashchange", () => {
  window.requestAnimationFrame(syncActiveSection);
});

syncPageState();
