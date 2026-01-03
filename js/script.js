console.log("Script loaded"); // log to console to confirm the script is loaded

// ------------
// | DARKMODE |
// ------------

const toggleButton = document.getElementById("theme-toggle");       // get the theme-toggle btn element by its ID, this btn will be used to switch between light/dark mode
console.log(toggleButton);                                          // debug: make sure the element exists
const body = document.body;                                         // reference the <body> element by accessing to the HTML using document (DOM), will be used to toggle the 'dark' class on <body> for theme switching
// Load saved theme or system preference
const savedTheme = localStorage.getItem("theme");                   // check for saved theme in localStorage(-> preserves user preference when page reloads), 
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches; // detect system preference for dark mode, window.matchMedia("(prefers-color-scheme: dark)") returns true if the user prefers dark mode

if (savedTheme === "dark" || (!savedTheme && prefersDark)) {        // apply the initial theme based on saved preference or system preference
    // if user previously chose dark OR system prefers dark:
    body.classList.add("dark");                                     // add 'dark' class to body
    toggleButton.textContent = "☀️";                              // set button icon to sun (indicating click will go light)
} else {
  // otherwise, default to light theme:
    toggleButton.textContent = "🌙";                              // set button icon to moon (indicating click will go dark)
}
// Toggle theme
toggleButton.addEventListener("click", () => {                      // add click event listener to the toggle button
    body.classList.toggle("dark");                                  // Toggle the 'dark' class on body

    const isDark = body.classList.contains("dark");                 // check if dark mode is now active
    localStorage.setItem("theme", isDark ? "dark" : "light");       // save the current theme in localStorage for future visits
    toggleButton.textContent = isDark ? "☀️" : "🌙";              // update the button icon based on current theme
});

