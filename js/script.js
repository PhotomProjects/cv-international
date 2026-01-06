console.log("Script loaded"); // log to console to confirm the script is loaded

// ------------
// | DARKMODE |
// ------------

const toggleButton = document.getElementById("theme-toggle");       // get the theme-toggle btn element by its ID, this btn will be used to switch between light/dark mode
// debug: make sure the element exists -> console.log(toggleButton);
const root = document.documentElement;                              // reference the <html> - </html> element by accessing to the HTML using document (DOM), will be used to toggle the 'dark' class on <htmtl> for theme switching

// Toggle theme
toggleButton.addEventListener("click", () => {                      // add click event listener to the toggle button
    root.classList.toggle("dark");                                  // Toggle the 'dark' class on the html tag

    const isDark = root.classList.contains("dark");                 // check if dark mode is now active
    localStorage.setItem("theme", isDark ? "dark" : "light");     // save the current theme in localStorage for future visits
    toggleButton.textContent = isDark ? "☀️" : "🌙";             // update the button icon based on current theme
});

