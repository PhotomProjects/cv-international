(() => {
    const script = document.currentScript;
    const supportedLocales = (script?.dataset.supportedLocales ?? "").split(",").map((locale) => locale.trim().toLowerCase()).filter(Boolean);
    const configuredDefaultLocale = (script?.dataset.defaultLocale ?? "").toLowerCase();
    const defaultLocale = supportedLocales.includes(configuredDefaultLocale) ? configuredDefaultLocale : supportedLocales[0] ?? "fr";

    function normalizeLocale(value) {
        if (!value) {
            return defaultLocale;
        }

        const shortLocale = value.toLowerCase().slice(0, 2);
        return supportedLocales.includes(shortLocale) ? shortLocale : defaultLocale; 
    }

    let locale;

    try {
        locale = normalizeLocale(localStorage.getItem("locale") || navigator.language);
    } catch {
        locale = normalizeLocale(navigator.language);
    }

    window.location.replace(`/${locale}/cv/`);
})();