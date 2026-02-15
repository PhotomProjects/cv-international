// ------------
// | DARKMODE |
// ------------

const toggleButton = document.getElementById("theme-toggle");
const root = document.documentElement;

function syncThemeUI() {
  const isDark = root.classList.contains("dark");
  if (toggleButton) {
    toggleButton.textContent = isDark ? "☀️" : "🌙";
    toggleButton.setAttribute("aria-pressed", String(isDark));
  }
}

if (toggleButton) {
    syncThemeUI();

toggleButton.addEventListener("click", () => {
    root.classList.toggle("dark");
    const isDark = root.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    syncThemeUI();
   });
}

