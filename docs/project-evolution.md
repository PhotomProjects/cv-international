# Project evolution

This document records the major stages of the project, the problems encountered, and the decisions that changed its direction. It is not a raw development log; implementation details that no longer describe the project have been removed.

## 1. Initial multilingual CV

The first version was a conventional static CV with separate English, French, and Japanese HTML pages. It included responsive and print styles, a dark mode, SEO metadata, and downloadable Japanese application documents.

This first iteration proved that a multilingual CV could remain lightweight and deploy as a static site. It also exposed the main maintenance problem: every language repeated almost the same markup.

Changing a section required editing several HTML files. This created predictable risks:

- content and dates could diverge between languages;
- accessibility labels and metadata could be forgotten;
- layout fixes had to be repeated;
- adding another CV type would multiply the duplication.

The legacy pages were archived instead of deleted so their content and earlier technical choices remained recoverable.

## 2. Windows 98 visual redesign

The visual direction moved from a conventional document to a Windows 98-inspired interface. The objective was not to reproduce an operating system for decoration alone, but to use a recognizable desktop metaphor to support a stronger visual identity.

The interface still had to satisfy the primary purpose of a CV:

- information must remain easy to scan;
- the page must work across desktop, tablet, and mobile layouts;
- decorative controls must not interfere with reading or keyboard navigation;
- printing must produce a restrained, professional document.

This created a useful separation between screen presentation and print presentation. The retro interface belongs to the browser experience, while the print stylesheet removes unnecessary interface decoration.

## 3. Initial expansion: two CVs and a letter editor

An intermediate plan introduced:

- a Designer CV;
- a Full Stack CV;
- three languages for each variant;
- a personal letter editor with print-to-PDF support.

The idea was technically possible, but it expanded the number of pages and content combinations too early. With two variants and three locales, the project would already need six CV pages before the letter feature was considered.

The important architectural conclusion from this phase was retained: content, translations, layout, and generated output had to be separated. The product scope itself was later reduced.

## 4. Static generation with Node.js

A small Node.js build system replaced hand-maintained page copies.

The architecture became:

```text
src/data/base/     shared factual data
src/locales/       localized wording and SEO metadata
src/templates/     reusable HTML structure
src/assets/        editable CSS, JavaScript, fonts, and images
src/static/        files copied unchanged for hosting
dist/              generated deployment output
```

This approach kept the deployed site static while introducing a single source of truth during development.

The build pipeline was designed to:

1. remove stale output;
2. copy common assets and hosting files;
3. load and validate JSON through `JSON.parse()`;
4. localize shared data;
5. escape text before inserting it into HTML;
6. generate one page per locale;
7. fail with a non-zero exit code when the build cannot complete.

The decision not to introduce a framework was deliberate. The site required generation and reuse, not a client-side application runtime.

## 5. Development workflow

The build and preview responsibilities were separated:

- `npm run build` generates `dist/`;
- `npm run preview` serves the generated files;
- `npm run dev` performs an initial build, watches source files, and rebuilds automatically.

Every rebuild replaces the existing `dist/` directory rather than accumulating output. A full clean build is inexpensive for this project and prevents removed routes or assets from surviving accidentally.

## 6. Scope reduction and professional repositioning

The professional target changed from a general Full Stack profile to a profile centered on web design and front-end development.

Maintaining separate Designer and Full Stack CVs no longer supported that goal. The Full Stack variant was therefore removed, and back-end knowledge was reframed as complementary rather than central.

This decision simplified both the product and its public message:

- one CV is maintained;
- the route no longer needs a variant segment;
- the main competencies are interface design, front-end integration, responsive design, accessibility, SEO, and maintainable code;
- secondary knowledge can remain visible without competing with the target role.

Routes changed from:

```text
/{locale}/cv/designer/
/{locale}/cv/fullstack/
```

to:

```text
/fr/cv/
/en/cv/
/ja/cv/
```

Permanent redirects preserve the useful legacy `/lang/...` entry points.

## 7. Repository cleanup

Once the single-CV direction was confirmed, the architecture was reduced to what the build actually used.

### Removed variant infrastructure

The following concepts were deleted:

- Full Stack variant data and translations;
- the remaining empty Designer variant file;
- variant parameters, local storage values, and `data-*` attributes;
- variant-specific route generation.

The localized files were renamed to the neutral `cv.json`, and the page builder became `buildCvPage(locale)`.

### Removed speculative placeholders

Empty files for the future letter editor, theme, metadata, and letter translations were deleted. They did not represent an implemented feature and some empty JSON files were not valid JSON.

The letter editor remains on the roadmap, but its files will be created from actual requirements instead of guessed structure.

### Simplified JavaScript

The CV interface previously used a wrapper script and a global `window.CVUI` API. Because the active script is loaded with `defer`, the interface can initialize directly after parsing.

The result is one CV script responsible for:

- persisting the current locale;
- storing explicit language choices;
- invoking the browser print dialog.

Unused theme initialization and anti-flash code were removed along with the abandoned dark-mode mechanism.

### Bundled modular CSS

The source CSS remains split by responsibility:

- reset;
- design tokens;
- base rules;
- components;
- Windows 98 theme;
- print rules.

The build reads the imports from the CSS entry file and concatenates the modules into one production file. This preserves source maintainability while preventing a chain of browser `@import` requests.

The current bundler intentionally supports the exact import syntax used by the project. If that syntax changes, the import parser must be updated or replaced with a standard CSS build tool.

### Removed obsolete output

An old ignored `public/` folder still contained routes from the abandoned architecture. It was removed after confirming that `build.mjs` only writes to `dist/`.

The final rule is simple:

- `src/` is edited;
- `dist/` is generated;
- archived work is recovered from Git or `archives/`, not from obsolete build folders.

## 8. Content refactor

The content was reviewed after the technical cleanup so the message matched the new direction.

The main editorial decisions were:

- abandon the Full Stack headline;
- describe a junior profile without overstating design expertise;
- make interface conception and front-end implementation the core narrative;
- keep back-end, marketing, and audiovisual skills secondary;
- present skills only when they can be explained and defended in an interview;
- describe projects through design and implementation problems solved, not only through technology lists.

The Windows 98 portfolio project was reframed around:

- visual hierarchy and window organization;
- navigation experience;
- reusable focus and stacking behavior;
- multilingual and responsive delivery;
- automated static deployment.

The education title was aligned with the official `Développeur web et web mobile` qualification. Factual contact and language data remained centralized because they do not need separate copies per locale.

### Terminology decisions

Several wording choices were made to improve accuracy:

- `accessibility` is the competency; WCAG is the referenced standard;
- `a11y` is useful technical shorthand but is less clear for every recruiter;
- `Git / GitHub` is the correct product spelling;
- Cloudflare Pages provides the automated deployment, while Git records changes and GitHub hosts the repository;
- `ja` is the Japanese language code; `JP` identifies Japan.

## 9. Japanese version strategy

The Japanese content and `/ja/cv/` route were preserved rather than deleted. Removing them would discard completed localization work and make later reactivation more expensive.

The intended temporary strategy is to separate availability from promotion:

- Japanese remains a supported build locale;
- the page remains accessible by direct URL;
- the visible language choices can be limited to French and English;
- Japanese can be restored to the selector by changing one configuration list.

This distinction also needs to apply to root redirection. If Japanese is not promoted temporarily, a Japanese browser should not be redirected there automatically without an explicit product decision.

## 10. Multilingual SEO

SEO was moved into the generation pipeline rather than maintained independently on every page.

Each localized CV now has:

- its own title and description;
- its own canonical URL;
- reciprocal `hreflang` links for supported locales;
- an `x-default` link to the language-selection root.

The sitemap is generated from the same locale list used by the page builder. This avoids a second manually maintained route list. `robots.txt` points to the production sitemap.

Possible future additions such as Open Graph tags, social preview images, and `Person` structured data were deliberately left out of the current scope. Structured data is valuable only if it remains accurate and maintained.

## 11. Hosting and security hardening

The Cloudflare Pages `_headers` structure was corrected so route blocks and their headers were unambiguous.

The global configuration now includes:

- MIME sniffing protection;
- a strict referrer policy;
- clickjacking protection;
- disabled geolocation, microphone, and camera permissions;
- a restrictive Content Security Policy.

The root language redirect originally required an inline script, which forced the CSP to allow `script-src 'unsafe-inline'`. The redirect was moved to `src/assets/js/locale-redirect.js`, and its locale settings are supplied through `data-*` attributes generated by the build.

After externalization, the CSP could use `script-src 'self'`. The root page, JavaScript response, MIME type, and production headers were checked after deployment.

The `/resume/*.pdf` rule retains `X-Robots-Tag: noindex`. This does not block downloads; it prevents future PDF versions from being indexed separately from the HTML CV.

## 12. Validation performed

The refactors were checked incrementally with:

- repeated successful production builds;
- searches for removed Full Stack and variant references;
- JSON parsing for every remaining data and locale file;
- output checks for the new routes;
- confirmation that old Designer route folders were no longer generated;
- confirmation that production CSS contains no `@import`;
- confirmation that only the intended JavaScript files are emitted;
- checks for inline scripts and `unsafe-inline`;
- production requests for the sitemap, headers, and redirect script;
- `git diff --check` before commits.

Changes were split into focused English commits for architecture cleanup, content refactoring, sitemap generation, Cloudflare header correction, and CSP hardening.
