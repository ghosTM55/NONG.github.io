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
  const dialog = root.querySelector<HTMLElement>("[data-index-dialog]");
  if (!triggers.length || !panel || !surface || !navTrigger || !main || !dialog) {
    return () => undefined;
  }

  const entries = Array.from(panel.querySelectorAll<HTMLElement>("[data-index-link]"));
  const links = entries.filter((entry): entry is HTMLAnchorElement => entry instanceof HTMLAnchorElement);
  const videos = Array.from(panel.querySelectorAll<HTMLVideoElement>("[data-index-video]"));
  const desktopLoops = new Map(videos.map((video) => [video, video.loop]));
  const playbackRequests = new Map<HTMLVideoElement, symbol>();
  const hoverPreview = window.matchMedia("(min-width: 681px) and (hover: hover) and (pointer: fine)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const eventRoot = root instanceof Document ? root : (root.ownerDocument ?? document);
  let returnFocusTrigger = triggers[0];

  const canPlay = () => panel.getAttribute("aria-hidden") === "false" && !eventRoot.hidden && !reducedMotion.matches;

  const stopVideo = (video: HTMLVideoElement) => {
    playbackRequests.delete(video);
    video.pause();
    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
      video.currentTime = 0;
    }
    video.removeAttribute("data-active");
  };

  const startVideo = (video: HTMLVideoElement) => {
    if (!canPlay() || playbackRequests.has(video)) return;
    if (hoverPreview.matches) stopAllVideos();
    const request = Symbol();
    playbackRequests.set(video, request);

    if (!video.hasAttribute("src")) {
      const source = video.dataset.videoSrc;
      if (!source) return stopVideo(video);
      video.src = source;
      video.load();
    }

    void video.play().then(() => {
      // Closing Index or changing input mode can overtake a pending play request.
      if (playbackRequests.get(video) !== request) {
        if (!playbackRequests.has(video)) video.pause();
        return;
      }
      if (!canPlay()) return stopVideo(video);
      video.setAttribute("data-active", "true");
    }).catch(() => {
      if (playbackRequests.get(video) === request) stopVideo(video);
    });
  };

  const stopAllVideos = () => videos.forEach(stopVideo);

  const handleMediaPreferenceChange = () => {
    stopAllVideos();
    videos.forEach((video) => { video.loop = !hoverPreview.matches || desktopLoops.get(video)!; });
    if (!canPlay()) return;
    if (hoverPreview.matches) {
      const entry = entries.find((entry) => entry.matches(":hover, :focus-visible"));
      const video = entry?.querySelector<HTMLVideoElement>("[data-index-video]");
      if (video) startVideo(video);
    } else {
      videos.forEach(startVideo);
    }
  };

  const open = (event: Event) => {
    const source = event.currentTarget as HTMLButtonElement;
    returnFocusTrigger = source;
    closeLanguageMenus(false);
    panel.removeAttribute("inert");
    panel.setAttribute("aria-hidden", "false");
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-label", "Index");
    triggers.forEach((trigger) => {
      trigger.setAttribute("aria-expanded", "true");
      trigger.setAttribute("aria-label", "Close index");
    });
    main.setAttribute("inert", "");
    eventRoot.documentElement.classList.add("is-index-open");
    navTrigger.focus({ preventScroll: true });
    handleMediaPreferenceChange();
  };

  const close = (returnFocus = true) => {
    stopAllVideos();
    panel.setAttribute("aria-hidden", "true");
    dialog.removeAttribute("role");
    dialog.removeAttribute("aria-modal");
    dialog.removeAttribute("aria-label");
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
    if (event.defaultPrevented || panel.getAttribute("aria-hidden") !== "false") return;
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "Tab") {
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not(:disabled), [tabindex="0"]',
      )).filter((element) => !element.closest("[inert]") && element.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = eventRoot.activeElement;
      if (event.shiftKey && (active === first || !dialog.contains(active))) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && (active === last || !dialog.contains(active))) {
        event.preventDefault();
        first?.focus();
      }
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

    const start = () => { if (hoverPreview.matches) startVideo(video); };
    const stop = () => { if (hoverPreview.matches) stopVideo(video); };
    link.addEventListener("pointerenter", start);
    link.addEventListener("pointerleave", stop);
    link.addEventListener("focus", start);
    link.addEventListener("blur", stop);

    return () => {
      link.removeEventListener("pointerenter", start);
      link.removeEventListener("pointerleave", stop);
      link.removeEventListener("focus", start);
      link.removeEventListener("blur", stop);
      stopVideo(video);
    };
  });

  links.forEach((link) => {
    link.addEventListener("click", handleIndexLink);
  });
  triggers.forEach((trigger) => trigger.addEventListener("click", handleTriggerClick));
  eventRoot.addEventListener("keydown", handlePanelKeydown);
  eventRoot.addEventListener("pointerdown", handleOutsidePointerdown);
  eventRoot.addEventListener("visibilitychange", handleMediaPreferenceChange);
  hoverPreview.addEventListener("change", handleMediaPreferenceChange);
  reducedMotion.addEventListener("change", handleMediaPreferenceChange);

  return () => {
    close(false);
    links.forEach((link) => {
      link.removeEventListener("click", handleIndexLink);
    });
    triggers.forEach((trigger) => trigger.removeEventListener("click", handleTriggerClick));
    eventRoot.removeEventListener("keydown", handlePanelKeydown);
    eventRoot.removeEventListener("pointerdown", handleOutsidePointerdown);
    eventRoot.removeEventListener("visibilitychange", handleMediaPreferenceChange);
    hoverPreview.removeEventListener("change", handleMediaPreferenceChange);
    reducedMotion.removeEventListener("change", handleMediaPreferenceChange);
    videoBindings.forEach((removeListeners) => removeListeners());
    videos.forEach((video) => { video.loop = desktopLoops.get(video)!; });
  };
}
