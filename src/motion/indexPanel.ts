export function initIndexPanel(
  closeLanguageMenus: (returnFocus?: boolean) => void,
  root: ParentNode = document,
): () => void {
  const triggers = Array.from(
    root.querySelectorAll<HTMLButtonElement>("[data-index-trigger]"),
  );
  const panel = root.querySelector<HTMLElement>("#index-panel");
  const surface = panel?.querySelector<HTMLElement>(".index-panel__surface");
  const navTrigger = root.querySelector<HTMLButtonElement>("[data-index-nav-trigger]");
  const main = root.querySelector<HTMLElement>("main");
  if (!triggers.length || !panel || !surface || !navTrigger || !main) {
    return () => undefined;
  }

  const entries = Array.from(panel.querySelectorAll<HTMLElement>("[data-index-link]"));
  const links = entries.filter((entry): entry is HTMLAnchorElement => entry instanceof HTMLAnchorElement);
  const videos = Array.from(panel.querySelectorAll<HTMLVideoElement>("[data-index-video]"));
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const eventRoot = root instanceof Document ? root : (root.ownerDocument ?? document);
  let returnFocusTrigger = triggers[0];

  const stopVideo = (video: HTMLVideoElement) => {
    video.pause();
    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
      video.currentTime = 0;
    }
    video.removeAttribute("data-active");
  };

  const startVideo = (video: HTMLVideoElement) => {
    if (!finePointer.matches || reducedMotion.matches) return;

    if (!video.hasAttribute("src")) {
      const source = video.dataset.videoSrc;
      if (!source) return;
      video.src = source;
      video.load();
    }

    video.setAttribute("data-active", "true");
    void video.play().catch(() => {
      video.removeAttribute("data-active");
    });
  };

  const stopAllVideos = () => videos.forEach(stopVideo);

  const handleMediaPreferenceChange = () => {
    if (!finePointer.matches || reducedMotion.matches) stopAllVideos();
  };

  const open = (event: Event) => {
    const source = event.currentTarget as HTMLButtonElement;
    const openedWithKeyboard = event instanceof MouseEvent && event.detail === 0;
    returnFocusTrigger = source;
    closeLanguageMenus(false);
    panel.removeAttribute("inert");
    panel.setAttribute("aria-hidden", "false");
    triggers.forEach((trigger) => {
      trigger.setAttribute("aria-expanded", "true");
      trigger.setAttribute("aria-label", "Close index");
    });
    main.setAttribute("inert", "");
    eventRoot.documentElement.classList.add("is-index-open");
    if (openedWithKeyboard) navTrigger.focus({ preventScroll: true });
  };

  const close = (returnFocus = true) => {
    stopAllVideos();
    panel.setAttribute("aria-hidden", "true");
    triggers.forEach((trigger) => {
      trigger.setAttribute("aria-expanded", "false");
      trigger.setAttribute("aria-label", trigger.dataset.closedLabel ?? "Open index");
    });
    main.removeAttribute("inert");
    eventRoot.documentElement.classList.remove("is-index-open");
    if (returnFocus) returnFocusTrigger.focus();
    panel.setAttribute("inert", "");
  };

  const handlePanelKeydown = (event: KeyboardEvent) => {
    if (!event.defaultPrevented && event.key === "Escape" && panel.getAttribute("aria-hidden") === "false") {
      event.preventDefault();
      close();
    }
  };

  const handleIndexLink = (event: Event) => {
    const link = event.currentTarget as HTMLAnchorElement;
    if (link.pathname !== window.location.pathname) return;
    if (!link.hash) return;
    const target = link.hash ? document.querySelector(link.hash) : null;
    if (!target) {
      event.preventDefault();
      close();
    } else {
      close(false);
    }
  };

  const handleTriggerClick = (event: Event) => {
    if (panel.getAttribute("aria-hidden") === "false") {
      returnFocusTrigger = event.currentTarget as HTMLButtonElement;
      close();
    } else {
      open(event);
    }
  };

  const handleOutsidePointerdown = (event: PointerEvent) => {
    if (panel.getAttribute("aria-hidden") === "true" || !(event.target instanceof Node)) return;
    if (surface.contains(event.target)) return;
    if (triggers.some((trigger) => trigger.contains(event.target as Node))) return;
    close(false);
  };

  const videoBindings = entries.map((link) => {
    const video = link.querySelector<HTMLVideoElement>("[data-index-video]");
    if (!video) return () => undefined;

    const start = () => startVideo(video);
    const stop = () => stopVideo(video);
    link.addEventListener("pointerenter", start);
    link.addEventListener("pointerleave", stop);
    link.addEventListener("focus", start);
    link.addEventListener("blur", stop);

    return () => {
      link.removeEventListener("pointerenter", start);
      link.removeEventListener("pointerleave", stop);
      link.removeEventListener("focus", start);
      link.removeEventListener("blur", stop);
      stop();
    };
  });

  links.forEach((link) => {
    link.addEventListener("click", handleIndexLink);
  });
  triggers.forEach((trigger) => trigger.addEventListener("click", handleTriggerClick));
  eventRoot.addEventListener("keydown", handlePanelKeydown);
  eventRoot.addEventListener("pointerdown", handleOutsidePointerdown);
  finePointer.addEventListener("change", handleMediaPreferenceChange);
  reducedMotion.addEventListener("change", handleMediaPreferenceChange);

  return () => {
    close(false);
    links.forEach((link) => {
      link.removeEventListener("click", handleIndexLink);
    });
    triggers.forEach((trigger) => trigger.removeEventListener("click", handleTriggerClick));
    eventRoot.removeEventListener("keydown", handlePanelKeydown);
    eventRoot.removeEventListener("pointerdown", handleOutsidePointerdown);
    finePointer.removeEventListener("change", handleMediaPreferenceChange);
    reducedMotion.removeEventListener("change", handleMediaPreferenceChange);
    videoBindings.forEach((removeListeners) => removeListeners());
  };
}
