(function () {
  // Safely write a value to localStorage.
  // If storage is blocked, the app should keep working.
  function safeSetStorage(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Ignore storage errors
    }
  }

  // Read the current locale from the <html lang="..."> attribute.
  // Example: <html lang="fr"> -> returns "fr"
  function getCurrentLocale() {
    const htmlLang = document.documentElement.getAttribute("lang");

    if (!htmlLang) {
      return "fr";
    }

    return htmlLang.toLowerCase().slice(0, 2);
  }

  // Save the current locale into localStorage.
  // This helps the root redirect page remember the selected language.
  function persistCurrentPageState() {
    safeSetStorage("locale", getCurrentLocale());
  }

  // Add click listeners to language links.
  // Each language link must have a data-locale attribute.
  function initLanguageSwitcher() {
    const languageLinks = document.querySelectorAll("[data-locale]");

    languageLinks.forEach((link) => {
      link.addEventListener("click", () => {
        const locale = link.dataset.locale;

        if (!locale) {
          return;
        }

        safeSetStorage("locale", locale);
      });
    });
  }

// Add a click listener to the print button if it exists.
// The button must have data-action="print".
  function initPrintButton() {
    const printButton = document.querySelector("[data-action='print']");

    if (!printButton) {
      return;
    }

    printButton.addEventListener("click", () => {
      window.print();
    });
  }

  // Main initialization function for the CV UI.
  function initCvUI() {
    persistCurrentPageState();
    initLanguageSwitcher();
    initPrintButton();
  }

  // Expose a small public API on window.
initCvUI();
})();