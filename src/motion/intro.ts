function initIntro(): () => void {
  const page = document.querySelector<HTMLElement>("[data-intro-page]");
  if (!page) return () => undefined;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const events = new AbortController();
  const { signal } = events;
  const media = Array.from(page.querySelectorAll<HTMLElement>("[data-intro-media]"));
  const dividers = Array.from(page.querySelectorAll<HTMLElement>("[data-intro-divider]"));
  const sections = Array.from(page.querySelectorAll<HTMLElement>("[data-intro-practice]"));
  const links = Array.from(page.querySelectorAll<HTMLAnchorElement>("[data-intro-link]"));

  const players = media.flatMap((figure) => {
    const video = figure.querySelector<HTMLVideoElement>("[data-intro-video]");
    if (!video) return [];

    let visible = false;
    let failed = false;

    const canPlay = () => visible && !document.hidden && !page.inert && !failed && !reducedMotion.matches;

    const sync = () => {
      if (!canPlay()) {
        video.pause();
        if (reducedMotion.matches) figure.removeAttribute("data-video-ready");
        return;
      }
      if (!video.hasAttribute("src")) video.src = video.dataset.src!;
      void video.play().then(() => {
        // A pending play request may resolve after scrolling away or opening Index.
        if (!canPlay()) video.pause();
      }).catch(() => {
        if (!canPlay()) return;
        failed = true;
        figure.removeAttribute("data-video-ready");
      });
    };

    video.addEventListener("playing", () => {
      if (canPlay()) figure.setAttribute("data-video-ready", "");
    }, { signal });
    video.addEventListener("error", () => {
      failed = true;
      figure.removeAttribute("data-video-ready");
    }, { signal });

    return [{
      figure,
      video,
      sync,
      setVisible(value: boolean) { visible = value; sync(); },
    }];
  });

  const mediaObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const player = players.find(({ figure }) => figure === entry.target);
      if (entry.isIntersecting && entry.intersectionRatio >= 0.15) player?.figure.classList.add("is-revealed");
      player?.setVisible(entry.isIntersecting && entry.intersectionRatio >= 0.55);
    });
  }, { threshold: [0, 0.15, 0.55] });

  const dividerObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-revealed", entry.isIntersecting && entry.intersectionRatio >= 0.5);
    });
  }, { rootMargin: "-200px 0px -12% 0px", threshold: 0.5 });

  const visibleSections = new Map<Element, number>();
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) visibleSections.set(entry.target, entry.intersectionRatio);
      else visibleSections.delete(entry.target);
    });
    const active = [...visibleSections].sort((a, b) => b[1] - a[1])[0]?.[0].id;
    links.forEach((link) => {
      if (link.dataset.introLink === active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }, { rootMargin: "-190px 0px -20% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] });

  const syncPlayers = () => players.forEach((player) => player.sync());
  const overlayObserver = new MutationObserver(syncPlayers);
  overlayObserver.observe(page, { attributes: true, attributeFilter: ["inert"] });
  document.addEventListener("visibilitychange", syncPlayers, { signal });
  reducedMotion.addEventListener("change", syncPlayers, { signal });
  page.setAttribute("data-motion-ready", "");
  players.forEach(({ figure }) => mediaObserver.observe(figure));
  dividers.forEach((divider) => dividerObserver.observe(divider));
  sections.forEach((section) => sectionObserver.observe(section));

  return () => {
    events.abort();
    mediaObserver.disconnect();
    dividerObserver.disconnect();
    sectionObserver.disconnect();
    overlayObserver.disconnect();
    players.forEach(({ video }) => video.pause());
    page.removeAttribute("data-motion-ready");
  };
}

let cleanup = initIntro();
window.addEventListener("pagehide", () => cleanup());
window.addEventListener("pageshow", (event) => {
  if (event.persisted) cleanup = initIntro();
});
