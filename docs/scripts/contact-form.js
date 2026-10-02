// Posts the "Let's talk" form to the deployed contact-form serverless function.
// Update ENDPOINT if the function is redeployed under a different URL.
const ENDPOINT = "https://website-contact-function-4efp.vercel.app/api/send-email";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;
 
  const status = document.getElementById("contact-form-status");
  const submitBtn = form.querySelector('button[type="submit"]');

  // Localized strings live as data-* attributes on the form itself, so one script
  // serves every language page without duplicating logic. Falls back to English.
  const messages = {
    required: form.dataset.msgRequired || "Please fill in your name, email, and message.",
    sending: form.dataset.msgSending || "Sending…",
    success: form.dataset.msgSuccess || "Thanks, your message is on its way. I'll get back to you soon.",
    genericError: form.dataset.msgError || "Something went wrong. Please try again.",
    networkError: form.dataset.msgNetworkError || "Could not reach the server. Please email me directly instead.",
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const typed = form.message.value.trim();
    // The contact page asks a few extra things (topic, company, phone,
    // domain). The serverless function only takes name, email and message,
    // so they ride along at the top of the message: no backend change.
    const extra = (n, label) => {
      const f = form.elements[n];
      const v = f ? String(f.value || "").trim() : "";
      return v ? label + ": " + v : "";
    };
    const header = [extra("topic", "Topic"), extra("company", "Company"), extra("phone", "Phone"), extra("domain", "Domain")].filter(Boolean);
    const message = typed && header.length ? header.join("\n") + "\n\n" + typed : typed;
    const website = form.website ? form.website.value.trim() : ""; // honeypot

    if (!name || !email || !message) {
      setStatus(messages.required, true);
      return;
    }

    setStatus(messages.sending, false);
    if (submitBtn) submitBtn.disabled = true;

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, website }),
      });

      let result = {};
      try {
        result = await res.json();
      } catch (_) {
        // non-JSON response, fall through to generic error below
      }

      if (res.ok && result.success) {
        setStatus(messages.success, false);
        form.reset();
      } else {
        setStatus(result.error || messages.genericError, true);
      }
    } catch (err) {
      setStatus(messages.networkError, true);
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });

  function setStatus(text, isError) {
    if (!status) return;
    status.textContent = text;
    status.classList.toggle("is-error", !!isError);
    status.style.fontWeight = "bold";
  }
});
 