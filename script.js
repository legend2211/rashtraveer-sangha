/**
 * RASHTRAVEER SANGHA - CORE JAVASCRIPT CONTROLLER
 * Handles interactive components: Multilingual Engine (English/Marathi), Theme Switcher,
 * Mobile Navigation Drawer, Gallery Filtering, Accessible Lightbox Modal,
 * Event Registration Auto-Select, WhatsApp Enquiry Builder, Future Donate Modal, Keyboard Traps & Accessibility.
 */

// Central Organization & Production Configuration
const CONFIG = {
  organizationName: "Rashtraveer Sangha",
  devanagariName: "राष्ट्रवीर संघ",
  whatsappNumber: "REPLACE_WITH_OFFICIAL_WHATSAPP_NUMBER", // Official WhatsApp Configuration Variable
  email: "contact@rashtraveersangha.org"
};

document.addEventListener("DOMContentLoaded", () => {
  initLanguage();
  initTheme();
  initMobileMenu();
  initGalleryFilter();
  initGalleryLightbox();
  initEventRegistration();
  initKeyboardListeners();
});

/* --------------------------------------------------------------------------
   0. MULTILINGUAL TRANSLATION ENGINE (English / Marathi)
   -------------------------------------------------------------------------- */
let currentLang = "en";

function initLanguage() {
  const savedLang = localStorage.getItem("rs_lang");
  const browserLang = navigator.language.startsWith("mr") || navigator.language.startsWith("hi") ? "mr" : "en";
  currentLang = savedLang || browserLang;
  
  applyLanguage(currentLang);
}

function applyLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  // 1. Text Content Translation (data-i18n)
  document.querySelectorAll("[data-i18n]").forEach((elem) => {
    const key = elem.getAttribute("data-i18n");
    if (t[key] !== undefined) {
      elem.innerHTML = t[key];
    }
  });

  // 2. Input Placeholders (data-i18n-ph)
  document.querySelectorAll("[data-i18n-ph]").forEach((elem) => {
    const key = elem.getAttribute("data-i18n-ph");
    if (t[key] !== undefined) {
      elem.setAttribute("placeholder", t[key]);
    }
  });

  // 3. Update Language Toggle Button Label
  const labelElem = document.getElementById("lang-toggle-label");
  const mobileLabelElem = document.getElementById("mobile-lang-label");

  if (lang === "mr") {
    if (labelElem) labelElem.textContent = "English";
    if (mobileLabelElem) mobileLabelElem.textContent = "English";
  } else {
    if (labelElem) labelElem.textContent = "मराठी";
    if (mobileLabelElem) mobileLabelElem.textContent = "मराठी";
  }
}

function toggleLanguage() {
  const newLang = currentLang === "en" ? "mr" : "en";
  applyLanguage(newLang);
  localStorage.setItem("rs_lang", newLang);
}

/* --------------------------------------------------------------------------
   1. THEME SWITCHER (Light / Dark Mode Handler)
   -------------------------------------------------------------------------- */
function initTheme() {
  const savedTheme = localStorage.getItem("rs_theme");
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  const theme = savedTheme || (systemPrefersDark ? "dark" : "light");
  applyTheme(theme);
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const iconElem = document.getElementById("theme-toggle-icon");
  const labelElem = document.getElementById("theme-toggle-label");
  const mobileIconElem = document.getElementById("mobile-theme-icon");
  const mobileLabelElem = document.getElementById("mobile-theme-label");

  if (theme === "dark") {
    if (iconElem) iconElem.textContent = "☀️";
    if (labelElem) labelElem.textContent = "Light";
    if (mobileIconElem) mobileIconElem.textContent = "☀️";
    if (mobileLabelElem) mobileLabelElem.textContent = "Light Mode";
  } else {
    if (iconElem) iconElem.textContent = "🌙";
    if (labelElem) labelElem.textContent = "Dark";
    if (mobileIconElem) mobileIconElem.textContent = "🌙";
    if (mobileLabelElem) mobileLabelElem.textContent = "Dark Mode";
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  
  applyTheme(newTheme);
  localStorage.setItem("rs_theme", newTheme);
}

/* --------------------------------------------------------------------------
   2. MOBILE MENU DRAWER CONTROLLER
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const menuBtn = document.getElementById("mobile-menu-btn");
  const closeBtn = document.getElementById("close-mobile-nav");
  const navPanel = document.getElementById("mobile-nav-panel");
  const navOverlay = document.getElementById("mobile-nav-overlay");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");

  if (!menuBtn || !navPanel || !navOverlay) return;

  function openMenu() {
    navPanel.classList.add("open");
    navOverlay.classList.add("open");
    menuBtn.setAttribute("aria-expanded", "true");
    navPanel.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; // Lock scroll
  }

  window.closeMobileNav = function() {
    navPanel.classList.remove("open");
    navOverlay.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    navPanel.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  menuBtn.addEventListener("click", openMenu);
  if (closeBtn) closeBtn.addEventListener("click", closeMobileNav);
  navOverlay.addEventListener("click", closeMobileNav);

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileNav();
    });
  });
}

/* --------------------------------------------------------------------------
   3. GALLERY FILTER TABS
   -------------------------------------------------------------------------- */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const tiles = document.querySelectorAll(".gallery-tile");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Update active tab styling & aria-selected
      filterBtns.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      const category = btn.getAttribute("data-filter");

      tiles.forEach((tile) => {
        const tileCategory = tile.getAttribute("data-category");
        if (category === "all" || tileCategory === category) {
          tile.style.display = "block";
          tile.style.opacity = "1";
        } else {
          tile.style.display = "none";
          tile.style.opacity = "0";
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   4. ACCESSIBLE GALLERY LIGHTBOX MODAL
   -------------------------------------------------------------------------- */
function initGalleryLightbox() {
  const tiles = document.querySelectorAll(".gallery-tile");
  const modal = document.getElementById("gallery-lightbox");
  const overlay = document.getElementById("lightbox-overlay");
  const closeBtn = document.getElementById("close-lightbox");
  const mediaBox = document.getElementById("lightbox-media");
  const titleElem = document.getElementById("lightbox-title");
  const tagElem = document.getElementById("lightbox-category-tag");

  if (!modal || !mediaBox) return;

  function openLightbox(tile) {
    const svgBox = tile.querySelector(".tile-image-box").innerHTML;
    const titleText = tile.querySelector(".tile-title").textContent;
    const categoryText = tile.querySelector(".tile-category").textContent;

    mediaBox.innerHTML = svgBox;
    if (titleElem) titleElem.textContent = titleText;
    if (tagElem) tagElem.textContent = categoryText;

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  window.closeLightboxModal = function() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  tiles.forEach((tile) => {
    tile.addEventListener("click", () => openLightbox(tile));
    tile.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(tile);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener("click", closeLightboxModal);
  if (overlay) overlay.addEventListener("click", closeLightboxModal);
}

/* --------------------------------------------------------------------------
   5. EVENT REGISTRATION PRE-SELECTION
   -------------------------------------------------------------------------- */
function initEventRegistration() {
  const registerBtns = document.querySelectorAll(".register-event-btn");
  const topicSelect = document.getElementById("enquiry-topic");
  const contactSection = document.getElementById("contact");
  const nameInput = document.getElementById("user-name");

  registerBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const eventTitle = btn.getAttribute("data-event-title");
      
      if (topicSelect && eventTitle) {
        // Find matching option or select general
        let matched = false;
        for (let i = 0; i < topicSelect.options.length; i++) {
          if (topicSelect.options[i].value.includes(eventTitle) || topicSelect.options[i].text.includes(eventTitle)) {
            topicSelect.selectedIndex = i;
            matched = true;
            break;
          }
        }
        if (!matched) {
          topicSelect.value = "General Enquiry";
        }
      }

      // Smooth scroll to contact
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
      }

      // Focus name input after brief delay for smooth scroll
      setTimeout(() => {
        if (nameInput) nameInput.focus();
      }, 500);
    });
  });
}

/* --------------------------------------------------------------------------
   6. WHATSAPP ENQUIRY FORM HANDLER
   -------------------------------------------------------------------------- */
function handleContactSubmit(event) {
  event.preventDefault();

  const name = document.getElementById("user-name").value.trim();
  const phone = document.getElementById("user-phone").value.trim();
  const topicSelect = document.getElementById("enquiry-topic");
  const topic = topicSelect.options[topicSelect.selectedIndex].text;
  const message = document.getElementById("user-message").value.trim();

  if (!name || !phone || !message) {
    alert(currentLang === "mr" ? "कृपया सर्व आवश्यक माहिती भरा." : "Please fill in all required fields.");
    return;
  }

  // Format WhatsApp message according to active language
  const headerText = currentLang === "mr" ? "*राष्ट्रवीर संघ चौकशी*" : "*Enquiry for Rashtraveer Sangha*";
  const nameLabel = currentLang === "mr" ? "*नाव:*" : "*Name:*";
  const phoneLabel = currentLang === "mr" ? "*फोन:*" : "*Phone:*";
  const topicLabel = currentLang === "mr" ? "*विषय:*" : "*Topic:*";
  const msgLabel = currentLang === "mr" ? "*संदेश:*" : "*Message:*";

  const waText = 
`${headerText}

${nameLabel} ${name}
${phoneLabel} ${phone}
${topicLabel} ${topic}
${msgLabel} ${message}`;

  const encodedText = encodeURIComponent(waText);
  const waUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodedText}`;

  // Open WhatsApp in new tab
  window.open(waUrl, "_blank", "noopener,noreferrer");
}

/* Direct Floating WhatsApp Trigger */
function openWhatsAppDirect(event) {
  event.preventDefault();
  const defaultMsg = currentLang === "mr" 
    ? "नमस्ते, मला राष्ट्रवीर संघाच्या उपक्रमांविषयी चौकशी करायची आहे." 
    : "Namaste, I would like to enquire about Rashtraveer Sangha activities.";
  const waText = encodeURIComponent(defaultMsg);
  const waUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${waText}`;
  window.open(waUrl, "_blank", "noopener,noreferrer");
}

/* --------------------------------------------------------------------------
   7. DONATE MODAL CONTROLLER
   -------------------------------------------------------------------------- */
function openDonateModal() {
  const donateModal = document.getElementById("donate-modal");
  if (!donateModal) return;
  donateModal.classList.add("active");
  donateModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeDonateModal() {
  const donateModal = document.getElementById("donate-modal");
  if (!donateModal) return;
  donateModal.classList.remove("active");
  donateModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

/* --------------------------------------------------------------------------
   8. ACCESSIBILITY & ESCAPE KEY HANDLER
   -------------------------------------------------------------------------- */
function initKeyboardListeners() {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      // Close mobile menu if open
      if (typeof closeMobileNav === "function") closeMobileNav();
      // Close lightbox if open
      if (typeof closeLightboxModal === "function") closeLightboxModal();
      // Close donate modal if open
      if (typeof closeDonateModal === "function") closeDonateModal();
    }
  });
}
