const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector("#primary-menu");
const navLinks = document.querySelectorAll(".nav-menu a");
const year = document.querySelector("#year");
const contactForm = document.querySelector(".contact-form");
const formStatus = document.querySelector(".form-status");

// Keep footer date current without requiring manual edits.
if (year) {
  year.textContent = new Date().getFullYear();
}

function setMenuState(isOpen) {
  document.body.classList.toggle("nav-open", isOpen);
  navMenu.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.querySelector(".sr-only").textContent = isOpen ? "Close menu" : "Open menu";
}

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    setMenuState(!isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
      setMenuState(false);
      navToggle.focus();
    }
  });
}

// Demo-only form feedback for a complete front-end experience.
if (contactForm && formStatus) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      formStatus.textContent = "Please complete each field before submitting.";
      contactForm.reportValidity();
      return;
    }

    contactForm.reset();
    formStatus.textContent = "Thanks for reaching out. We will get back to you soon.";
  });
}
