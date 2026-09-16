interface DemoObject {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  origin: string;
  material: string;
  dimensions: string;
  collection: string;
  accession: string;
  image: string;
  alt: string;
  source: string;
  license: string;
  ratio: number;
  notes: Array<{ title: string; description: string }>;
  story: string;
  recordStatus?: "verified" | "demo";
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function initCurationDemo(root: HTMLElement) {
  const viewport = root.querySelector<HTMLElement>("[data-artifact-viewport]");
  const artifact = root.querySelector<HTMLElement>("[data-artifact-object]");
  const image = root.querySelector<HTMLImageElement>("[data-artifact-image]");
  const zoomOutput = root.querySelector<HTMLOutputElement>("[data-zoom-output]");
  const note = root.querySelector<HTMLElement>("[data-artifact-note]");
  const noteNumber = root.querySelector<HTMLElement>("[data-note-number]");
  const noteTitle = root.querySelector<HTMLElement>("[data-note-title]");
  const noteCopy = root.querySelector<HTMLElement>("[data-note-copy]");
  const workspace = root.querySelector<HTMLElement>(".artifact-workspace");
  const dock = root.querySelector<HTMLElement>("[data-collection-dock]");
  const catalog = root.querySelector<HTMLElement>("[data-collection-catalog]");
  const imageError = root.querySelector<HTMLElement>("[data-image-error]");
  if (!viewport || !artifact || !image || !zoomOutput || !note || !noteNumber || !noteTitle || !noteCopy) return;

  let objects: DemoObject[] = [];
  try {
    objects = JSON.parse(root.dataset.objects ?? "[]") as DemoObject[];
  } catch {
    return;
  }

  let activeIndex = 0;
  let yaw = -8;
  let pitch = 4;
  let zoom = 1;
  let dragging = false;
  let pointerId = -1;
  let lastX = 0;
  let lastY = 0;
  let noteTimer = 0;
  let imageTimer = 0;
  let currentPage = 1;
  let railStart = 0;
  let catalogExpanded = false;
  let catalogReturnFocus: HTMLElement | null = null;

  const updateTransform = () => {
    viewport.style.setProperty("--artifact-yaw", `${yaw}deg`);
    viewport.style.setProperty("--artifact-pitch", `${pitch}deg`);
    viewport.style.setProperty("--artifact-zoom", `${zoom}`);
    zoomOutput.value = `${Math.round(zoom * 100)} %`;
  };

  const setView = (nextYaw: number, nextPitch: number, nextZoom = zoom) => {
    yaw = nextYaw;
    pitch = nextPitch;
    zoom = clamp(nextZoom, 0.72, 1.65);
    updateTransform();
  };

  const closeNote = () => {
    window.clearTimeout(noteTimer);
    note.removeAttribute("data-visible");
    note.setAttribute("aria-hidden", "true");
    note.setAttribute("inert", "");
    root.querySelectorAll<HTMLButtonElement>("[data-hotspot]").forEach((button) => button.removeAttribute("aria-pressed"));
  };

  const showNote = (index: number) => {
    const current = objects[activeIndex];
    if (!current?.notes[index]) return;
    window.clearTimeout(noteTimer);
    noteNumber.textContent = String(index + 1).padStart(2, "0");
    noteTitle.textContent = current.notes[index].title;
    noteCopy.textContent = current.notes[index].description;
    root.querySelectorAll<HTMLButtonElement>("[data-hotspot]").forEach((button) => {
      button.setAttribute("aria-pressed", String(Number(button.dataset.hotspot) === index));
    });
    note.dataset.visible = "true";
    note.setAttribute("aria-hidden", "false");
    note.removeAttribute("inert");
    noteTimer = window.setTimeout(closeNote, 8500);
  };

  const setText = (selector: string, value: string) => {
    const element = root.querySelector<HTMLElement>(selector);
    if (element) element.textContent = value;
  };

  const setRailWindow = (start: number) => {
    railStart = Math.round(clamp(start, 0, Math.max(0, objects.length - 5)) / 5) * 5;
    root.querySelectorAll<HTMLElement>("[data-rail-item]").forEach((item) => {
      const index = Number(item.dataset.railItem);
      item.hidden = index < railStart || index >= railStart + 5;
    });
    setText("[data-rail-start]", String(railStart + 1).padStart(2, "0"));
    setText("[data-rail-end]", String(Math.min(railStart + 5, objects.length)).padStart(2, "0"));
    root.querySelectorAll<HTMLButtonElement>("[data-rail-direction='previous']").forEach((button) => {
      button.disabled = railStart === 0;
    });
    root.querySelectorAll<HTMLButtonElement>("[data-rail-direction='next']").forEach((button) => {
      button.disabled = railStart + 5 >= objects.length;
    });
  };

  const settleImage = (loaded: boolean) => {
    if (image.getAttribute("src") !== objects[activeIndex]?.image) return;
    image.style.opacity = loaded ? "1" : "0";
    if (imageError) imageError.hidden = loaded;
    artifact.inert = !loaded;
    artifact.style.visibility = loaded ? "" : "hidden";
  };
  image.addEventListener("load", () => settleImage(image.naturalWidth > 0));
  image.addEventListener("error", () => settleImage(false));

  const loadSelectedImage = () => {
    window.clearTimeout(imageTimer);
    const object = objects[activeIndex];
    if (!object) return;
    if (imageError) imageError.hidden = true;
    image.style.opacity = "0";
    imageTimer = window.setTimeout(() => {
      image.alt = object.alt;
      artifact.style.setProperty("--artifact-ratio", String(object.ratio));
      image.src = object.image;
      if (image.complete) settleImage(image.naturalWidth > 0);
    }, 180);
  };
  root.querySelector("[data-image-retry]")?.addEventListener("click", loadSelectedImage);
  if (image.complete) settleImage(image.naturalWidth > 0);

  const selectObject = (index: number) => {
    const object = objects[index];
    if (!object) return;
    setRailWindow(Math.floor(index / 5) * 5);
    if (index === activeIndex) return;
    activeIndex = index;
    loadSelectedImage();

    setText("[data-object-number]", String(index + 1).padStart(2, "0"));
    setText("[data-object-title]", object.title);
    setText("[data-object-subtitle]", object.subtitle);
    setText("[data-object-date]", object.date);
    setText("[data-object-origin]", object.origin);
    setText("[data-object-material]", object.material);
    setText("[data-object-dimensions]", object.dimensions);
    setText("[data-object-collection]", object.collection);
    setText("[data-object-accession]", object.accession);
    setText("[data-object-license]", object.license);
    setText("[data-object-story]", object.story);

    const source = root.querySelector<HTMLAnchorElement>("[data-object-source]");
    if (source) source.href = object.source;

    root.querySelectorAll<HTMLButtonElement>("[data-collection-item]").forEach((button) => {
      button.setAttribute("aria-pressed", String(Number(button.dataset.collectionItem) === index));
    });
    setView(-8, 4, 1);
    closeNote();
    root.querySelectorAll<HTMLButtonElement>("[data-hotspot]").forEach((button, hotspotIndex) => {
      const annotation = object.notes[hotspotIndex];
      button.setAttribute("aria-label", annotation ? `Inspect ${annotation.title}` : "Inspect annotation");
      button.removeAttribute("aria-pressed");
    });

    workspace?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  };

  const setCatalogPage = (page: number) => {
    currentPage = clamp(page, 1, 2);
    root.querySelectorAll<HTMLElement>("[data-collection-page]").forEach((item) => {
      item.hidden = Number(item.dataset.collectionPage) !== currentPage;
    });
    setText("[data-current-page]", String(currentPage).padStart(2, "0"));
    setText("[data-range-start]", currentPage === 1 ? "01" : "31");
    setText("[data-range-end]", currentPage === 1 ? "30" : "60");

    root.querySelectorAll<HTMLButtonElement>("[data-page-direction='previous']").forEach((button) => {
      button.disabled = currentPage === 1;
    });
    root.querySelectorAll<HTMLButtonElement>("[data-page-direction='next']").forEach((button) => {
      button.disabled = currentPage === 2;
      if (button.closest(".collection-catalog__footer")) button.hidden = currentPage === 2;
    });
  };

  const setCatalogExpanded = (expanded: boolean, returnFocus = true) => {
    if (!catalog || !dock) return;
    catalogExpanded = expanded;
    root.dataset.catalogExpanded = String(expanded);
    catalog.hidden = !expanded;

    if (expanded) {
      catalog.removeAttribute("inert");
      workspace?.setAttribute("inert", "");
      dock.setAttribute("inert", "");
      setCatalogPage(activeIndex < 30 ? 1 : 2);
      requestAnimationFrame(() => catalog.querySelector<HTMLButtonElement>("[data-catalog-close]")?.focus());
      return;
    }

    catalog.setAttribute("inert", "");
    workspace?.removeAttribute("inert");
    dock.removeAttribute("inert");
    if (returnFocus) catalogReturnFocus?.focus();
  };

  viewport.addEventListener("pointerdown", (event) => {
    if ((event.target as HTMLElement).closest("button")) return;
    dragging = true;
    pointerId = event.pointerId;
    lastX = event.clientX;
    lastY = event.clientY;
    viewport.dataset.dragging = "true";
    viewport.setPointerCapture(pointerId);
  });

  viewport.addEventListener("pointermove", (event) => {
    if (!dragging || event.pointerId !== pointerId) return;
    yaw += (event.clientX - lastX) * 0.34;
    pitch = clamp(pitch - (event.clientY - lastY) * 0.24, -56, 56);
    lastX = event.clientX;
    lastY = event.clientY;
    updateTransform();
  });

  const endDrag = (event: PointerEvent) => {
    if (event.pointerId !== pointerId) return;
    dragging = false;
    viewport.removeAttribute("data-dragging");
    if (viewport.hasPointerCapture(pointerId)) viewport.releasePointerCapture(pointerId);
  };

  viewport.addEventListener("pointerup", endDrag);
  viewport.addEventListener("pointercancel", endDrag);
  viewport.addEventListener("wheel", (event) => {
    event.preventDefault();
    zoom = clamp(zoom - event.deltaY * 0.0012, 0.72, 1.65);
    updateTransform();
  }, { passive: false });

  viewport.addEventListener("keydown", (event) => {
    const controls: Record<string, () => void> = {
      ArrowLeft: () => { yaw -= 8; },
      ArrowRight: () => { yaw += 8; },
      ArrowUp: () => { pitch = clamp(pitch + 6, -56, 56); },
      ArrowDown: () => { pitch = clamp(pitch - 6, -56, 56); },
      "+": () => { zoom = clamp(zoom + 0.1, 0.72, 1.65); },
      "=": () => { zoom = clamp(zoom + 0.1, 0.72, 1.65); },
      "-": () => { zoom = clamp(zoom - 0.1, 0.72, 1.65); },
    };
    const control = controls[event.key];
    if (!control) return;
    event.preventDefault();
    control();
    updateTransform();
  });

  root.querySelectorAll<HTMLButtonElement>("button[data-surface]").forEach((button) => {
    button.addEventListener("click", () => {
      const mode = button.dataset.surface ?? "color";
      viewport.dataset.surface = mode;
      root.querySelectorAll<HTMLButtonElement>("button[data-surface]").forEach((item) => {
        item.setAttribute("aria-pressed", String(item === button));
      });
    });
  });

  root.querySelectorAll<HTMLButtonElement>("[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      switch (button.dataset.view) {
        case "front": setView(0, 0); break;
        case "edge": setView(82, 2, 1.08); break;
        case "reverse": setView(180, 0); break;
        default: setView(-8, 4, 1);
      }
      root.querySelectorAll<HTMLButtonElement>("[data-view]").forEach((item) => {
        item.setAttribute("aria-pressed", String(item === button && item.dataset.view !== "reset"));
      });
    });
  });

  root.querySelectorAll<HTMLButtonElement>("[data-zoom]").forEach((button) => {
    button.addEventListener("click", () => {
      zoom = clamp(zoom + (button.dataset.zoom === "in" ? 0.1 : -0.1), 0.72, 1.65);
      updateTransform();
    });
  });

  root.querySelectorAll<HTMLButtonElement>("[data-hotspot]").forEach((button) => {
    button.addEventListener("click", () => showNote(Number(button.dataset.hotspot)));
  });

  root.querySelector<HTMLButtonElement>("[data-note-close]")?.addEventListener("click", closeNote);

  document.addEventListener("pointerdown", (event) => {
    if (!note.hasAttribute("data-visible")) return;
    const target = event.target as HTMLElement;
    if (target.closest("[data-artifact-note], [data-hotspot]")) return;
    closeNote();
  });

  root.querySelectorAll<HTMLButtonElement>("[data-collection-item]").forEach((button) => {
    button.addEventListener("click", () => {
      const wasInCatalog = Boolean(button.closest("[data-collection-catalog]"));
      selectObject(Number(button.dataset.collectionItem));
      if (wasInCatalog) setCatalogExpanded(false, false);
    });
  });

  root.querySelectorAll<HTMLButtonElement>("[data-page-direction]").forEach((button) => {
    button.addEventListener("click", () => {
      setCatalogPage(currentPage + (button.dataset.pageDirection === "next" ? 1 : -1));
      catalog?.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  root.querySelectorAll<HTMLButtonElement>("[data-rail-direction]").forEach((button) => {
    button.addEventListener("click", () => {
      setRailWindow(railStart + (button.dataset.railDirection === "next" ? 5 : -5));
    });
  });

  root.querySelectorAll<HTMLButtonElement>("[data-catalog-open]").forEach((button) => {
    button.addEventListener("click", () => {
      catalogReturnFocus = button;
      setCatalogExpanded(true);
    });
  });

  root.querySelectorAll<HTMLButtonElement>("[data-catalog-close]").forEach((button) => {
    button.addEventListener("click", () => setCatalogExpanded(false));
  });

  document.addEventListener("keydown", (event) => {
    if (root.inert || event.defaultPrevented) return;
    if (event.key === "Escape" && catalogExpanded) {
      event.preventDefault();
      setCatalogExpanded(false);
      return;
    }
    if (event.key === "Escape" && note.hasAttribute("data-visible")) {
      event.preventDefault();
      closeNote();
    }
  });

  viewport.dataset.surface = "color";
  setCatalogPage(1);
  setRailWindow(0);
  updateTransform();
}

document.querySelectorAll<HTMLElement>("[data-curation-demo]").forEach(initCurationDemo);
