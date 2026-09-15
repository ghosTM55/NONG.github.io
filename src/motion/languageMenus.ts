interface LanguageController {
  root: HTMLElement;
  trigger: HTMLButtonElement;
  menu: HTMLElement;
  options: HTMLElement[];
  close: (returnFocus?: boolean) => void;
}

export function initLanguageMenus(root: ParentNode = document): {
  closeAll: (returnFocus?: boolean) => void;
  destroy: () => void;
} {
  const cleanups: Array<() => void> = [];
  const controllers: LanguageController[] = [];

  const closeAll = (returnFocus = true) => {
    controllers.forEach((controller) => controller.close(returnFocus));
  };

  root.querySelectorAll<HTMLElement>("[data-language-root]").forEach((languageRoot) => {
    const trigger = languageRoot.querySelector<HTMLButtonElement>("[data-language-trigger]");
    const menu = languageRoot.querySelector<HTMLElement>("[data-language-menu]");
    const options = Array.from(languageRoot.querySelectorAll<HTMLElement>("[data-language-option]"));
    if (!trigger || !menu || options.length === 0) return;

    const close = (returnFocus = true) => {
      trigger.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-hidden", "true");
      menu.dataset.open = "false";
      if (returnFocus && languageRoot.contains(document.activeElement)) trigger.focus();
    };

    const open = (focusIndex = 0) => {
      trigger.setAttribute("aria-expanded", "true");
      menu.setAttribute("aria-hidden", "false");
      menu.dataset.open = "true";
      options[focusIndex]?.focus();
    };

    const handleTriggerClick = () => {
      const isOpen = trigger.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        close(false);
        return;
      }

      closeAll(false);
      const selectedIndex = Math.max(
        0,
        options.findIndex((option) => option.getAttribute("aria-checked") === "true"),
      );
      open(selectedIndex);
    };

    const handleTriggerKeydown = (event: KeyboardEvent) => {
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      event.preventDefault();
      closeAll(false);
      const selectedIndex = Math.max(
        0,
        options.findIndex((option) => option.getAttribute("aria-checked") === "true"),
      );
      const targetIndex =
        event.key === "ArrowDown"
          ? selectedIndex
          : (selectedIndex - 1 + options.length) % options.length;
      open(targetIndex);
    };

    const handleMenuKeydown = (event: KeyboardEvent) => {
      const current = options.indexOf(document.activeElement as HTMLElement);

      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        close();
      } else if ((event.key === "Enter" || event.key === " ") && current >= 0) {
        event.preventDefault();
        options[current]?.click();
      } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const direction = event.key === "ArrowDown" ? 1 : -1;
        options[(current + direction + options.length) % options.length]?.focus();
      } else if (event.key === "Home" || event.key === "End") {
        event.preventDefault();
        options[event.key === "Home" ? 0 : options.length - 1]?.focus();
      } else if (event.key === "Tab") {
        close(false);
      }
    };

    const controller: LanguageController = {
      root: languageRoot,
      trigger,
      menu,
      options,
      close,
    };
    controllers.push(controller);

    trigger.addEventListener("click", handleTriggerClick);
    trigger.addEventListener("keydown", handleTriggerKeydown);
    menu.addEventListener("keydown", handleMenuKeydown);
    cleanups.push(() => {
      trigger.removeEventListener("click", handleTriggerClick);
      trigger.removeEventListener("keydown", handleTriggerKeydown);
      menu.removeEventListener("keydown", handleMenuKeydown);
    });
  });

  const handlePointerDown = (event: PointerEvent) => {
    controllers.forEach((controller) => {
      if (!controller.root.contains(event.target as Node)) controller.close(false);
    });
  };
  document.addEventListener("pointerdown", handlePointerDown);

  return {
    closeAll,
    destroy: () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      cleanups.forEach((cleanup) => cleanup());
    },
  };
}
