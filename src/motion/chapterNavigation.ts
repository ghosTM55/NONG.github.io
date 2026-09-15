export function initChapterNavigation(): () => void {
  const footers = document.querySelectorAll<HTMLElement>("[data-chapter-navigation]");
  if (!footers.length) return () => undefined;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-revealed");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  footers.forEach((footer) => {
    footer.setAttribute("data-chapter-motion-ready", "");
    observer.observe(footer);
  });

  return () => {
    observer.disconnect();
    footers.forEach((footer) => footer.removeAttribute("data-chapter-motion-ready"));
  };
}
