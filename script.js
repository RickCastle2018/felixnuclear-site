(() => {
  const $ = (sel, root = document) => root.querySelector(sel);

  const registerBtn = $("#register-btn");
  const modal = $("#interest-modal");
  const emailInput = $("#email");
  const mailtoLink = $("#mailto-link");
  const toast = $("#toast");
  const closeBtn = document.querySelector(".modal__close");

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2400);
  }

  function openModal() {
    if (typeof modal.showModal === "function") modal.showModal();
    else modal.setAttribute("open", "");
    setTimeout(() => emailInput?.focus(), 60);
  }

  function closeModal() {
    if (typeof modal.close === "function") modal.close();
    else modal.removeAttribute("open");
  }

  function updateMailto() {
    const email = (emailInput?.value || "").trim();
    const subject = encodeURIComponent("Register interest — felixnuclear");
    const body = encodeURIComponent(
      `Please keep me posted.\nEmail: ${email || "(not provided)"}\n`,
    );
    mailtoLink.setAttribute(
      "href",
      `mailto:haiku-slam-angler@duck.com?subject=${subject}&body=${body}`,
    );
  }

  registerBtn?.addEventListener("click", openModal);
  closeBtn?.addEventListener("click", closeModal);
  emailInput?.addEventListener("input", updateMailto);

  // Basic validation + lightweight local persistence for UX
  $("#interest-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = (emailInput?.value || "").trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast("Enter a valid email");
      emailInput?.focus();
      return;
    }
    try {
      localStorage.setItem("fn_interest_email", email);
    } catch {}
    updateMailto();

    const btn = document.getElementById("notify-btn");
    const cfg = window.FN_CONFIG || {};
    const hasEndpoint =
      typeof cfg.submitEndpoint === "string" && cfg.submitEndpoint.length > 0;

    const finish = (ok) => {
      if (btn) {
        btn.disabled = false;
        btn.textContent = "Notify me";
      }
      if (ok) {
        showToast("You’re on the list. Thank you.");
        setTimeout(() => {
          try {
            modal.close();
          } catch {}
        }, 300);
      } else {
        showToast("Saved locally — you can use email button");
      }
    };

    if (btn) {
      btn.disabled = true;
      btn.textContent = "Sending…";
    }

    if (!hasEndpoint) {
      finish(false);
      return;
    }

    // Decide payload based on config: Google Form or Apps Script
    let fetchOptions;
    if (cfg.googleForm) {
      const formData = new URLSearchParams();
      if (!cfg.googleFormField) {
        finish(false);
        return;
      }
      formData.set(cfg.googleFormField, email);
      // Google Forms expects a form POST to formResponse
      fetchOptions = {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      };
    } else {
      // Apps Script: send as form-encoded (simpler, no preflight; e.parameter works reliably)
      const form = new URLSearchParams();
      form.set("email", email);
      form.set("ref", document.referrer || "");
      form.set("path", location.href);
      form.set("ua", navigator.userAgent);
      fetchOptions = {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: form.toString(),
      };
    }

    fetch(cfg.submitEndpoint, fetchOptions)
      .then(() => finish(true))
      .catch(() => finish(false));
  });

  // Prefill if available
  try {
    const saved = localStorage.getItem("fn_interest_email");
    if (saved && emailInput) emailInput.value = saved;
  } catch {}
  updateMailto();

  // Close on backdrop click
  modal?.addEventListener("click", (e) => {
    const rect = e.currentTarget
      .querySelector(".modal__card")
      ?.getBoundingClientRect();
    if (!rect) return;
    const within =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;
    if (!within) closeModal();
  });

  // ESC to close
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal?.open) closeModal();
  });
})();
