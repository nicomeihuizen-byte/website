// Posts the "Let's talk" form to the deployed contact-form serverless function.
// Update ENDPOINT if the function is redeployed under a different URL.
const ENDPOINT = "https://meihuizen-contact-function.vercel.app/api/send-email";
 
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;
 
  const status = document.getElementById("contact-form-status");
  const submitBtn = form.querySelector('button[type="submit"]');
 
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
 
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const website = form.website ? form.website.value.trim() : ""; // honeypot
 
    if (!name || !email || !message) {
      setStatus("Please fill in your name, email, and message.", true);
      return;
    }
 
    setStatus("Sending…", false);
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
        setStatus("Thanks, your message is on its way. I'll get back to you soon.", false);
        form.reset();
      } else {
        setStatus(result.error || "Something went wrong. Please try again.", true);
      }
    } catch (err) {
      setStatus(
        "Could not reach the server. Please email me directly instead.",
        true
      );
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
 
  function setStatus(text, isError) {
    if (!status) return;
    status.textContent = text;
    status.style.color = isError ? "#b91c1c" : "";
  }
});
 