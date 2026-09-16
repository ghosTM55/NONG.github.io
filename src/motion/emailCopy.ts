const FEEDBACK_DURATION = 1800;

export function initEmailCopy(root: ParentNode = document) {
  const cleanups = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-copy-email]")).map(button => {
    const status = button.parentElement?.querySelector<HTMLElement>("[data-copy-email-status]");

    if (!status) return () => undefined;

    let feedbackTimer = 0;

    const showFeedback = (message: string, copied: boolean) => {
      window.clearTimeout(feedbackTimer);
      status.textContent = message;
      status.dataset.visible = "true";
      button.dataset.copied = copied ? "true" : "false";

      feedbackTimer = window.setTimeout(() => {
        status.dataset.visible = "false";
        button.dataset.copied = "false";
      }, FEEDBACK_DURATION);
    };

    const copyEmail = async () => {
      const email = button.dataset.email;
      if (!email) return;

      try {
        await navigator.clipboard.writeText(email);
        showFeedback(button.dataset.copyMessage ?? "EMAIL ADDRESS COPIED", true);
      } catch {
        showFeedback(button.dataset.copyError ?? "COPY FAILED", false);
      }
    };

    button.addEventListener("click", copyEmail);

    return () => {
      window.clearTimeout(feedbackTimer);
      button.removeEventListener("click", copyEmail);
    };
  });

  return () => cleanups.forEach(cleanup => cleanup());
}
