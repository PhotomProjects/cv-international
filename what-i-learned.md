<div style="text-align:center;">

# What I learned through this project ?

Below are my notes that I took throughout the making of this project.

</div>

# <ins>HTML</ins>

## \<script> tag

**Wrong**

Never between head and body.

```HTML
</head>
<script src="js/script.js" defer></script>
<body>
```

**Correct**

Option A — in the \<head> (with defer)

```HTML
<head>
  ...
  <script src="../../js/script.js" defer></script>
</head>
```

With defer:

- defer makes the browser execute the script after the DOM is built (the script get downloaded during HTML parsing)
- advantage: JS does not block HTML loading and it is possible to do getElementById() without it returning null (if the element is indeed in the page)

Without defer or async, the browser downloads and executes the script immediately, before continuing to read the rest of the HTML.
Consequences:

- the page rendering is blocked until the JS has finished loading and executing
- if the script manipulates HTML elements that do not yet exist (e.g., `document.getElementById("theme-toggle")`), it will fail because the DOM has not yet been constructed.
  -> mauvais pour la performance et le SEO

Option B — just before \</body> (without defer)

```HTML
<body>
  ...
  <script src="js/script.js"></script>
</body>
```

The browser loads all the HTML first, then downloads and executes the script last.

Advantages:

- the DOM is already set up; JS can interact directly with the elements
- page rendering is not blocked -> better performance

Inconvenience:

- if JS needs to execute something before rendering (like a default theme), it will be applied a little late (possible "flash" effect -> found a fis for that, refer to the <a href="#JS">JS section</a>).

## i18n

### lang attribute on anchor links

This lang attribute
`<a href="/jp/" lang="ja">JP</a>`

does NOT have the same role as:
`<html lang="ja">`

Different roles, different levels

`<html lang="ja">` is the main language of the document and used by:

- search engines
- search engines
- screen readers
- language correctors

Only one per page.

`<a lang="ja">` is the language of the content of this link, it's mostly used by:

- screen readers
- accessibility tools
- specialized browsers

Example:

- a French screen reader arrives on a French page:
  `<a href="/jp/" lang="ja">JP</a>`

It automatically knows that this link leads to Japanese. Without `lang="ja`:

- it may mispronounce or read with the wrong voice
- it may read with the wrong voice

**Differences with hreflang**

hreflang is used to:

- Google
- search engines
- multilingual indexing

So it is invisible to the user.

lang is used to:

- humans
- screen readers
- accessibility

Semantically visible, not directly tied to SEO.

### hreflang

`rel="alternate" hreflang="..."`

- tells Google that there are alternative language versions of the same page
- helps Google serve the correct language for the user and understand that it's not duplicate content, but translated variations

3 distinct levels
| Element | Used to | What field |
| :-----: | :-----: | :--------: |
| `<html lang="">` | document language | SEO + accessibility
| `hreflang` | relations between pages | SEO
| `<a lang="">` | language of the link | accessibility

They are not replacements, they are complementary.

**alternate**
If there is multiple versions of a page for different languages or regions, it tells Google about these different variations. Doing so will help Google Search point users to the most appropriate version of the page of said language or region.

Example, a page in English:

```HTML
  <link rel="alternate" hreflang="en" href="../en/index.html"/>
  <link rel="alternate" hreflang="fr" href="../fr/index.html"/>
  <link rel="alternate" hreflang="ja" href="../jp/index.html"/>
```

All of the language versions need to be linked in each HTML code. The order of the `<link rel="alternate">` elements does not matter, but it is more logical and practical to write the language concerned first.

**x-default**

`<link rel="alternate" hreflang="x-default" href="../en/index.html"/>`

- _x-default_ is the "default" version when Google doesn't know which language to choose, so it's like a fallback

### canonical

`<link rel="canonical" href="../en/index.html"/>`

- _canonical_ has the role to declare the official URL of this page
- in the example, it indicates that the "official" URL for this EN page is ../en/index.html

### translating \<aria-label> attribute

It is essential to translate them depending on the language of the document for the screen readers.

The aria-label attribute provides a text label accessible to an element for assistive technologies (screen readers, etc.).

Example:

```HTML
<html lang="fr">
<button aria-label="Open menu">☰</button>
```

A sighted user sees the ☰ icon, but a screen reader user hears “Open menu”.

Screen readers read the text in the document's language (`<html lang="en">`, `<html lang="fr">`, etc.).
Therefore, in the example above, if the visible text is translated, but the aria-labels remain in English, the experience becomes confusing for non-English-speaking users.
The screen reader will pronounce "Open menu" with a French accent, incomprehensible to a French-speaking user.

Corrected version

```HTML
<html lang="fr">
<button aria-label="Ouvrir le menu">☰</button>
```

**Mixing languages**

If an element has an aria-label in a language other than that of the page (for example, a brand name or a foreign quote), it is possible to specify the language directly:

```HTML
<button aria-label="Start" lang="en">🚀</button>
```

This tells the screen reader to pronounce the word correctly.

## JSON-LD

```JSON
    <script type="application/ld+json">
    {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "AUTHELIN Florian",
    "jobTitle": "Full-Stack Developer",
    "email": "mailto:photomprojects@gmail.com",
    "address": {
        "@type": "PostalAddress",
        "addressLocality": "Metz",
        "addressCountry": "FR"
    },
    "url": "https://authelinflorian.dev/en/",
    "sameAs": [
        "https://github.com/PhotomProjects",
        "https://www.linkedin.com/in/florianauthelin57/"
    ],
    "knowsAbout": [
        "JavaScript",
        "TypeScript",
        "SQL",
        "React",
        "HTML5",
        "CSS3",
        "Tailwind CSS",
        "Node.js",
        "Express",
        "PostgreSQL",
        "Git",
        "Docker",
        "Vercel",
        "REST APIs",
        "Web Accessibility",
        "SEO"
        ]
    }
    </script>
```

- intended for the crawlers, with those info they tell Google that the website is based on a real person
- `<script type="application/ld+json">` is a data container (JSON-LD) for search engines
- `"@context": "https://schema.org"` indicates the dict format as for the words used (Person, name, jobTitle, etc.), they must be interpreted according to the rules of Schema.org otherwise without this line Google sees a normal JSON and skips it because it does not know how to interpret the keys with their values
- `"@type": "Person"` indicates that the entity described is a person

## \<address> tag

```HTML
<address>
    <p>
        <a href="mailto:photomprojects@gmail.com">photomprojects@gmail.com</a>
    </p>
</address>
```

- this tag is used to indicate contact information related to the author/owner of the document (or section)

## download=""

`<a href="../../resume/cv-en.pdf" download="AUTHELIN Florian's Resume" ...>💾</a>`

- the download attribute specifies that the target (the file specified in the href attribute) will be downloaded when a user clicks on the hyperlink
- optional value will be the new name of the file after it is downloaded, there are no restrictions on allowed values, and the browser will automatically detect the correct file extension and add it to the file

## target="\_blank" and rel="noopener noreferrer

`<a ... target="_blank" rel="noopener noreferrer" ...>`

- rel="noopener" prevents the new page from accessing window.opener so that it cannot control the original page
- rel="noreferrer" restrains the sending of the HTTP header named Referer so that the visited website does not know where the user came from

---

# <ins>CSS</ins>

## :root

```CSS
:root {
  --bg-color: #ffffff;
  --text-color: #1f2933;
  --muted-text: #374151;
  --border-color: #000000;
  --link-color: #2563eb;
  --btn-border: #000000;
  --btn-bg: #ffffff;
  --btn-hover: #e0e0e0;
  font-size: 16px;
}
```

`:root { }`

- :root targets the root element of the document (effectively \<html>)
- defines variables globally
- threy're available everywhere unless they're overwritten later (e.g. in html.dark)

`--bg-color: ...;`

- CSS variables must start with --
- we read them with var(--bg-color) later in my styles
- this makes theming/easier maintenance easy: I change variables instead of rewriting many rules

`font-size: 16px;`

- sets the base font size on the root, ensures design is consistent across all browsers and makes calculations easier for responsive scaling via rem
- 1rem is now 16px (default value used by the navigator), which makes sizing with rem predictable across the site
- em = relative to the font size of its direct parent, each level multiplies the size of the parent, so it increases with each nesting

## Reset

`*, *::before, _::after { }`

- **\*** selects every element
- `*::before` and `*::after` include pseudo-elements too, so they follow the same sizing rules

`box-sizing: border-box;`

- with `border-box`, width/height includes padding and border
- prevents layout surprises and makes sizing much easier to reason about
- (default `content-box` does the opposite.)

## Animation

```CSS
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

- defines an animation named fadeIn
- it transitions from:
  - `from { ... }` initial state
  - `to { ... } ` final state
- `opacity:` 0 to 1: the element transitions from transparent to visible -> fade effect
- `transform: translateY` (4px to 0): the element moves slightly upward when appearing -> "smooth sliding" effect
- creates a subtle “content appears” effect

`main { animation: fadeIn 0.3s ease-out; }`

- applies that animation to the \<main> section
- animation is a super property that combines several sub-properties:
- 0.3s = duration, ease-out = fast start, slows down at the end

`.btn { transition: background-color 0.15s ease, transform 0.1s ease; }`

- `transition` property makes a change gradual (instead of immediate) when a property changes
- `background-color` will change smoothly over 0.15 seconds
- `transform` will change over 0.1 seconds (e.g., when the button moves on hover)
- without `transition`, changes are abrupt
- with `transition`, they become smooth and animated

`.btn:hover { transform: translateY(-1px); }`

- `:hover` property is activated when the mouse hovers over the button
- `transform: translateY(-1px)` moves the button upwards by 1 pixel

This creates an illusion of depth, as if the button is "rising."
Thanks to the transition defined earlier, this movement is animated and smooth.

`.btn.active { box-shadow: inset 0 -2px 0 var(--text-color); }`

- `box-shadow: inset` creates an inner shadow (towards the inside of the button)
- `0 -2px 0`:
  - 0 = horizontal offset
  - -2px = vertical offset upwards
  - 0 = blur (here, no blur)
- `var(--text-color)` = color taken from the CSS variable (defined in :root)
  - visual effect: the button appears pressed (state “pressed”)

`html { transition: background-color 0.2s ease, color 0.2s ease; }`

When the background or text color changes (for example, in dark mode), the transition will be smooth and take 0.2 seconds.
The change between light and dark is gradual, not abrupt.

## HTML background

`html { background-color: var(--bg-color); }`

- sets the page background on \<html>, not only on \<body>
- it helps avoid white background flashes and ensures the entire viewport has the right background immediately

I did this because the browser creates the document, paints the default background, and only then displays the \<body> element.
This default background is white.
So before:

- JS executes
- \<html> is styled
- .dark is taken into account

The browser may display a white background for a fraction of a second. That's the white flash.

The actual DOM is:

```text
viewport
  └── html
    └── body
      └── content
```

HTML covers all of the viewport. If \<body> has a dark theme, \<html> can show a white background in the initial paint.
So thats why this line of code is for:

- even before the CSS
- even before the JS
- even before the layout

The viewport is never white.

## Buttons

`cursor: pointer;`

cursor: pointer shows the hand cursor when hovering.

Communicates “this is clickable” and improves UX consistency.

## Address / Layout with gap

`address { display: grid; }`

I used display: grid so I can use gap for spacing.

gap doesn’t work on display: block, so using Grid (or Flex) makes spacing clean and consistent.

This avoids having to manually set margins between children.

(Small note: gap also works with Flex in modern browsers.)

## Responsive behavior

`.language-switcher ul { ... }`

I used flex and flex-wrap so the language buttons can wrap onto multiple lines.

justify-content: center keeps them centered when they wrap.

Result: your header doesn’t overflow or “break” on small screens.

## @page and @media print rules

```CSS
@page {
    size: 21cm 29.7cm;
    margin-top: 1cm;
}

@media print {
    /* Force light mode */
    body {
        background: #ffffff !important;
        color: #000000 !important;
    }

    /* Overrides the dark mode colors to get the light theme when printing */
    body.dark {
        --bg-color: #ffffff;
        --text-color: #000000;
        --muted-text: #000000;
        --border-color: #000000;
        --link-color: #000000;
        --btn-bg: #ffffff;
        --btn-hover: #ffffff;
    }

    body h1 {
        font-size: 17pt;
    }

    body h2 {
        font-size: 15pt;
    }

    body h3 {
        font-size: 13pt;
    }

    p,
    li {
        font-size: 12pt;
        line-height: 1.1;
    }
}
```

- @media print and @page complement each other
- @media print stylize the content (typography, colors, layout)
- @page configure the printed page (targets and modifies the page's dimensions, orientation, and margins)
- a width: 210mm; and height: 297mm; will result in a A4 page format
- pt measure is used to ensure a consistent and legible physical size on paper, regardless of the browser or screen resolution
- when printing, the navigator does not understand pixels, it needs to convert them into actual measurements (points (pt), centimeters (cm), and millimeters (mm) are recognized
  as actual units by the browser's print engine)
- 1pt = 1/72 inch (≈ 0.35 mm) so 12pt ≈ 4.23 mm -> standard size of readable printed text
- pixels (px) have no fixed equivalent on paper -> text at 16px can appear tiny or enormous depending on the print scaling
- so pt / cm / mm are for printing and px / rem for the screen

---

# <ins id="JS">JavaScript</ins>

## Operators

```JS
if (savedTheme === "dark" || (!savedTheme && prefersDark))

toggleButton.textContent = isDark ? "☀️" : "🌙";

localStorage.setItem("theme", isDark ? "dark" : "light");
```

<sub>few lines took here and there, just to show the operators</sub>

### 3 logical and conditional operators: ===, ||, &&, and the ternary

**1. Line:**

```JS
if (savedTheme === "dark" || (!savedTheme && prefersDark))
```

Breakdown:

- savedTheme === "dark" -> checks if the savedTheme variable (retrieved from localStorage) is exactly the string "dark" -> if so, dark mode is applied
- || is the logical operator “OR”, this means: “if the first condition is true, or, otherwise, if the second is true, then execute the block.”
- (!savedTheme && prefersDark) -> !savedTheme veut dire “il n’y a pas de thème enregistré” (le ! inverse la valeur)
- && is the logical operator “AND”, it checks that both conditions are true at the same time

So we read for `(!savedTheme && prefersDark)`: “if no theme is saved AND the system prefers dark mode, then activate dark mode.”

**2. Line:**

```JS
localStorage.setItem("theme", isDark ? "dark" : "light");
```

Breakdown:

- the ternary operator ? -> it's a short way to write an if...else statement in a single line
- structure -> condition **?** value_if_true **:** value_if_false
- application -> isDark is the condition (equals true if the body has the class “dark”), if isDark is true → we save “dark” otherwise → we save “light”

Therefore, localStorage.setItem("theme", isDark ? "dark" : "light"); is equivalent to:

```JS
if (isDark) {
localStorage.setItem("theme", "dark");
} else {
localStorage.setItem("theme", "light");
}
```

**3. Line:**

```JS
toggleButton.textContent = isDark ? "☀️" : "🌙";
```

Breakdown:

- same logic, if isDark is true -> display the sun ☀️ (dark mode active, click = return to light)
- otherwise -> display the moon 🌙 (light mode active, click = switch to dark mode)

Summary of operators used
| Symbol | Name | Used to... | Example |
| ------------------- | --- | ------------------------- | ------------------------------------------------------- |
| === | Strict equality | Compare values ​​and types | x === "dark" is true only if x is exactly "dark" |
| ! | NOT | Invert a Boolean value | !savedTheme true if savedTheme is empty/false |
| && | AND | Verify that two conditions are true. | a && b are true only if a AND b are true |
| `\| \|` | OR | Check that at least one is true | a \| \| b is true only if one of the two conditions is true |
| ? : | Ternary operator | Short version of if...else | cond ? A : B returns A if cond is true, otherwise B |

### Ternary operator

The following code is:

```JS
if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
 body.classList.add("dark");
toggleButton.textContent = "☀️";
} else {
toggleButton.textContent = "🌙";
}
```

- readable and clear
- each instruction is separated, simplifying maintenance
- ideal when there are multiple lines to execute in each branch

**Ternary version possible**
The code could technically be written like this:

```JS
(savedTheme === "dark" || (!savedTheme && prefersDark))
? (body.classList.add("dark"), toggleButton.textContent = "☀️")
: (toggleButton.textContent = "🌙");
```

But... it's hard to read and fragile:

- the execution order becomes less obvious
- rarely used in production code
- complicates debugging and understanding

**Good usage of the ternary**
The ternary is perfect for a simple assignment, e.g.:

```JS
toggleButton.textContent = isDark ? "☀️" : "🌙";
```

It replaces a small one-line if/else statement, without sacrificing clarity.

## Darkmode

```JavaScript
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
```

**Code breakdown**

### 1. Grabbing references from the DOM

`const toggleButton = document.getElementById("theme-toggle");`

- this line looks up the element with `id="theme-toggle"` (your theme button)
- returns:
  - the element if it exists
  - or null if it doesn’t exist on this page

I store it in a variable so I don't have to repeat the lookup.

`const root = document.documentElement;`

- `document.documentElement` is the \<html> element.
- I stored it in root because I apply the dark class to \<html> (`html.dark { ... }`) to theme the entire page reliably

### 2. Keeping the UI in sync with the current theme

`function syncThemeUI() { ... }`

This function updates the button UI (emoji + accessibility state) to match the current theme.
I used a function because I needed to do this:

- once on page load
- again after every click

`const isDark = root.classList.contains("dark");`

- checks whether \<html> currently has the dark class
- isDark is:
  - true when dark mode is active
  - false otherwise

This is the “single source of truth” for the current theme state.

`if (toggleButton) { ... }`

- ensures the button exists before trying to modify it
- prevents runtime errors like “Cannot read properties of null…”
- useful if the same JS file runs on multiple pages and some pages don’t include the toggle

`toggleButton.textContent = isDark ? "☀️" : "🌙";`

- updates the emoji shown on the button
- if dark mode is active → show ☀️ (meaning “switch to light”)
- if light mode is active → show 🌙 (meaning “switch to dark”)

This follows a common UX pattern: the icon represents the action a user can take next, not necessarily the current state.

`toggleButton.setAttribute("aria-pressed", String(isDark));`

- sets aria-pressed for accessibility
- aria-pressed is meant for toggle buttons (on/off)
- it should be "true" or "false" (strings), so I used String(isDark)

This helps screen readers announce the toggle state correctly.

### 3. Only attaching behavior if the button exists

`if (toggleButton) { ... }`

- if the button is missing, the script does nothing (safe)

`syncThemeUI();`

- **important:** the theme might already be applied on page load (e.g., via the inline \<head> script that prevents the white flash)
- this call ensures the button emoji and aria-pressed reflect the actual current state immediately

`toggleButton.addEventListener("click", () => { ... });`

- registers a click handler so the code inside runs each time the user clicks the button

### 4. On click: toggle theme, persist it, update UI

`root.classList.toggle("dark");`

- adds dark if it’s missing, removes it if it’s present
- my CSS reacts instantly because it’s based on html.dark

`const isDark = root.classList.contains("dark");`

- re-checks the state after toggling, so I know the final state

`localStorage.setItem("theme", isDark ? "dark" : "light");`

- saves the user’s choice to localStorage
- this allows the \<head> script (on the next visit/refresh) to apply the right theme before the first paint

`syncThemeUI();`

- updates the emoji + accessibility state to match the new theme

The whole logic in one sentence
Dark mode is controlled by a dark class on the \<html> element; clicking the button toggles that class, stores the preference in localStorage, and updates the button’s UI/accessibility state.

**JS code in the \<head>**

```HTML
    <script>
        (function () {
            try {
                const savedTheme = localStorage.getItem("theme");
                const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

                if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
                document.documentElement.classList.add("dark");
                }
            } catch (e) {}
        })();
    </script>
```

Why this script exists?
Its job is to apply the correct theme before the first paint.
Without it, the browser may render the page in light mode for a split second, then the deferred JS toggles dark mode → white flash (FOUC).
Because it runs early in \<head>, it can set the theme class on \<html> before CSS finishes painting.

Line-by-line explanation

\<script> ... \</script>

- a script tag containing JavaScript
- since it’s in \<head> and has no defer, it executes immediately while the HTML is being parsed

This early execution is what helps prevent the white flash.

`(function () { ... })();`

This is an IIFE (Immediately Invoked Function Expression).

It means:

- define a function
- run it right away

Why use an IIFE?

- it keeps variables like savedTheme and prefersDark out of the global scope
- avoids polluting window and reduces the chance of name collisions

`try { ... } catch (e) {}`

A safety wrapper.

Why?
In rare cases, accessing localStorage can throw an error (privacy modes, strict browser settings, blocked storage contexts, etc.).
If this script crashed, it could break the page load experience.

With `try/catch`:

- best case: it applies the theme correctly
- worst case: it does nothing, but it never breaks the page

`catch (e) {}` intentionally ignores errors because failing to set the theme is better than breaking the site.

`const savedTheme = localStorage.getItem("theme");`

- reads the user’s saved theme choice from localStorage
- possible values:
  - "dark"
  - "light"
  - null (nothing saved yet)

So `savedTheme` represents the explicit user preference, if it exists.

`const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;`

- checks the operating system/browser preference via a media query
- `matchMedia(...)` returns an object describing whether the query matches
- `.matches` is a boolean:
  - true if the system prefers dark mode
  - false otherwise

This is the fallback when the user hasn’t chosen a theme on my site yet.

`if (savedTheme === "dark" || (!savedTheme && prefersDark)) { ... }`

This is the core decision logic, with clear priority:

- if the user explicitly chose dark mode before (savedTheme === "dark") → use dark mode
- otherwise, if no saved preference exists (!savedTheme) → follow the system preference (prefersDark)

Why this priority?

- user choice should override system settings
- system preference only applies when the user hasn’t chosen

`document.documentElement.classList.add("dark");`

- `document.documentElement` is the \<html> element
- `classList.add("dark")` adds the dark class

Because my CSS uses `html.dark { ... }` (or variables overridden under `.dark`), this immediately activates dark mode styling.

Applying it on <html> is important because:

- it affects the whole page
- it can take effect before <body> is fully painted

Summary in one sentence
This script runs early, reads the saved theme (or system preference if none), and adds dark to the <html> element before the first paint, preventing the white flash.

---

# Link between HTML / CSS / JS

How are the three languages ​​linked?
Let's take the example of dark mode:

- there is no "defined" `.dark` class in the HTML code
- however, JavaScript can dynamically add it to any element in the DOM, and this is precisely where the bridge between JS and CSS is created

## Step by step: the CSS ⇄ JS link

**1. In CSS:**

```CSS
html.dark {
  --bg-color: #0f172a;
  --text-color: #e5e7eb;
  /* ... */
}
```

- here, the styles are defined and will only apply when the `<html>` element has the class `dark`
- as long as the `<html>` element does not contain this class, these styles are not active

**2. In HTML:**

```HTML
<body>
  ...
  <button id="theme-toggle">🌙</button>
</body>
```

The \<html> does not have the dark class initially, so only the “light” theme (defined in :root { ... }) applies.

**3. In JavaScript:**

```JS
root.classList.toggle("dark");
```

This line tells JavaScript: “Add the `dark` class to the \<html> if it isn't already there, or remove it if it is.” The browser then updates the DOM (Document Object Model), and therefore the HTML becomes:

```HTML
<html class="dark">
  ...
</html>
```

**4. The link**

The browser automatically recalculates the CSS style:

- he sees that Body now has the dark class
- therefore, all CSS rules that target `html.dark { ... }` become active.

This is the implicit linking mechanism between CSS and JS:

- CSS listens for class states in the DOM
- and the JS modifies these classes according to the defined logic

---

# <ins>Resume</ins>

## ATS

[ATS Scan Result](ats/jobscan-match_report.pdf)
