# What I learned through this project

These notes summarize the technical, editorial, and project-management lessons that remain relevant to the current codebase. Earlier experiments that were removed, such as dark mode and JSON-LD, are kept out of the feature documentation.

## 1. A static site can still have a build system

Static output does not require manually authored pages. Node.js can read data and templates, then generate complete HTML before deployment.

This project separates:

- editable sources in `src/`;
- generated output in `dist/`;
- factual data in JSON;
- localized wording in locale files;
- structure in an HTML template;
- browser behavior in small JavaScript files.

The deployed site remains plain HTML, CSS, and JavaScript. Node.js is a development tool, not a production runtime.

## 2. Build and preview are different operations

`npm run build` creates the site. It does not serve it.

`npm run preview` starts a local server for the existing generated output.

`npm run dev` combines an initial build, source watching, automatic rebuilds, and local preview.

Absolute URLs such as `/assets/css/style.css` assume an HTTP server root. Opening a generated HTML file directly with `file://` is therefore not a reliable preview method.

## 3. Clean builds prevent stale output

The build removes and recreates `dist/` before generating the site.

This ensures that:

- deleted source files do not survive in production;
- renamed routes do not leave old pages behind;
- copied assets match the current source tree;
- local and deployment builds behave consistently.

For a small site, a complete rebuild is simpler and safer than an incremental build.

## 4. The build is a pipeline

The important sequence is:

```text
clean -> copy assets -> bundle CSS -> copy static files -> generate pages -> generate sitemap
```

Each helper has one responsibility, while `main()` defines the order and acts as the build entry point.

The final error handler matters:

```js
main().catch((error) => {
  console.error("Build failed:", error);
  process.exit(1);
});
```

A non-zero exit code allows npm, deployment services, and future CI checks to distinguish a failed build from a successful one.

## 5. Data must be escaped before HTML generation

Valid JSON is not automatically safe HTML. Values loaded from `src/data` and `src/locales` are inserted into generated pages, so they must remain text instead of being interpreted as markup.

### Escaping used by the build

The project centralizes HTML escaping in `build.mjs`:

```js
function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
```

This protects the five characters that can change the structure of HTML text or a quoted attribute.

### Where it is applied in the CV

| CV value                        | Generated context                  | Current handling                                               |
| ------------------------------- | ---------------------------------- | -------------------------------------------------------------- |
| Name, titles and summaries      | HTML text                          | `escapeHtml()`                                                 |
| SEO title and description       | `<title>` and `content` attributes | `escapeHtml()`                                                 |
| Canonical and social links      | `href` attributes                  | `escapeHtml()`                                                 |
| Education, skills and languages | Generated lists and paragraphs     | Escaped inside their render helpers                            |
| Project sections                | Trusted HTML fragments             | Each dynamic value is escaped before the fragment is assembled |

For example, project summaries are loaded from JSON and rendered as text:

```js
summary ? `<p>${escapeHtml(summary)}</p>` : "";
```

If a summary accidentally contained:

```html
Frontend developer
<script>
  alert("test");
</script>
```

the generated page would display the tags as text instead of adding an executable element.

### Trusted markup and data remain separate

Functions such as `renderProjects()` and `renderEducation()` create trusted HTML structure. Their complete result must not be escaped, otherwise elements such as `<article>` or `<li>` would appear as text.

The rule used by the build is therefore:

> Keep JSON and translations unescaped, then escape each value once when inserting it into its final HTML context.

The generic `renderTemplate()` function only replaces placeholders. It cannot escape everything automatically because some placeholders contain plain text while others contain already constructed HTML fragments.

### URLs need a separate rule

The CV currently stores portfolio, GitHub, LinkedIn and project URLs inside the repository. Escaping prevents these values from breaking an `href` attribute, but it does not validate their protocol or destination.

This is acceptable while the repository remains the only source of those URLs. If the future letter editor makes them user-controlled, they will also need explicit URL validation.

The lesson from this project is that escaping belongs at the output boundary, even when the current data is repository-controlled. It protects against both accidental markup corruption and future injection risks.

## 6. Templates reduce structural duplication

Generating HTML inside one very large JavaScript string works for a prototype, but becomes difficult to read. Moving the shared document into `src/templates/cv.html` separates page structure from rendering logic.

Small render helpers remain useful for repeated fragments such as:

- education entries;
- skill groups;
- projects;
- spoken languages;
- social links;
- language navigation.

The goal is not abstraction for its own sake. A helper is useful when it removes real duplication or gives one responsibility a clear name.

## 7. Localized data needs a fallback strategy

A value can be either a shared string or an object such as:

```json
{
  "fr": "Accessibilité web",
  "en": "Web accessibility",
  "ja": "Webアクセシビリティ"
}
```

The localization helper checks:

1. the requested locale;
2. the default locale;
3. another available string;
4. an empty value as a last resort.

Fallbacks prevent a build from crashing, but they can also hide missing translations. A future validation step should report missing locale keys explicitly.

## 8. Language codes and country codes are different

Japanese uses `ja` as its ISO language code. `JP` identifies the country Japan.

This affects:

- `<html lang="ja">`;
- `hreflang="ja"`;
- route names such as `/ja/cv/`;
- locale configuration and translation files.

Legacy `/lang/jp/` routes can still redirect to `/ja/cv/`, but new language-aware code should use `ja`.

## 9. `lang`, `hreflang`, and canonical have distinct roles

| Mechanism            | Purpose                                                                                    |
| -------------------- | ------------------------------------------------------------------------------------------ |
| `<html lang="...">`  | Declares the main document language for browsers, assistive technology, and search engines |
| `lang` on an element | Identifies a language change inside the document                                           |
| `hreflang`           | Connects equivalent localized URLs for search engines                                      |
| `rel="canonical"`    | Declares the preferred URL for the current page                                            |

They are complementary, not interchangeable.

Every localized page should link back to every other localized version, including itself. `x-default` can point to the root page when that page performs language selection.

## 10. Supported and visible locales are separate concepts

A locale may remain generated without being actively promoted in the interface.

Using two configuration lists makes that intent explicit:

```js
const SUPPORTED_LOCALES = ["fr", "en", "ja"];
const VISIBLE_LOCALES = ["fr", "en"];
```

`SUPPORTED_LOCALES` can drive page generation, `hreflang`, and the sitemap. `VISIBLE_LOCALES` can drive the language selector.

The root redirect requires a separate decision. Automatically redirecting a Japanese browser to `/ja/cv/` conflicts with temporarily hiding Japanese from navigation. Availability, discoverability, and automatic selection must be designed together.

## 11. SEO route lists need one source of truth

Manually maintaining page routes, `hreflang`, and the sitemap creates three lists that can diverge.

Generating all three from the same locale configuration reduces that risk. Each page still needs localized title and description content because translation alone does not guarantee useful search snippets.

Durable metadata should describe the profile and page content. Temporary phrases such as “looking for an apprenticeship” become stale quickly and are better handled elsewhere unless they are actively maintained.

## 12. Root redirects need an accessible fallback

The root page uses JavaScript to select a locale from:

1. a previously saved choice;
2. the browser language;
3. the default locale.

The page also provides ordinary links so navigation remains possible if JavaScript is blocked or fails.

Storage access is wrapped in `try/catch` because private browsing policies, browser settings, or storage restrictions can make `localStorage` unavailable.

## 13. `defer` is appropriate for the CV interface

A script in the document `<head>` can use `defer`:

```html
<script src="/assets/js/cv-ui.js" defer></script>
```

The file downloads while HTML is parsed and executes after the document has been parsed. This prevents the script from blocking parsing and allows DOM queries to find page elements.

Because the interface script is deferred, it can initialize directly. A global `window.CVUI` API and a second wrapper script were unnecessary.

The locale redirect is different: it should run as soon as its root-page script is reached, so its execution timing is intentionally independent from the CV interface.

## 14. Client-side features should fail safely

The static document remains useful even if JavaScript fails. JavaScript only enhances:

- remembering the locale;
- switching language preference;
- opening the browser print dialog;
- redirecting from the root page.

This is progressive enhancement. Core CV content is already present in the generated HTML.

DOM initialization also checks whether optional elements exist before attaching events. Reusing the same script on a page without a print button should not cause an exception.

## 15. External scripts enable a stricter CSP

An inline redirect script required:

```text
script-src 'self' 'unsafe-inline'
```

Moving that logic into `locale-redirect.js` allowed the policy to become:

```text
script-src 'self'
```

Build configuration is passed to the script through generated `data-*` attributes. This keeps locale lists in the build instead of duplicating them in JavaScript.

Security headers must be checked after deployment. A correct local `_headers` file is not proof that the hosting platform applied it.

## 16. CSP is only one part of static-site security

The CV is static, but the browser still loads and executes HTML, CSS and JavaScript. The hosting configuration therefore combines CSP with several complementary response headers.

### Configuration used by the CV

```text
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
  Permissions-Policy: geolocation=(), microphone=(), camera=()
  Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; img-src 'self' data:; style-src 'self'; script-src 'self'; font-src 'self'; connect-src 'self'; form-action 'self' mailto:;
```

| Rule                                                 | Purpose in this project                                                     |
| ---------------------------------------------------- | --------------------------------------------------------------------------- |
| `default-src 'self'`                                 | Uses local resources as the default                                         |
| `script-src 'self'`                                  | Allows the two local JavaScript files and blocks inline or external scripts |
| `style-src 'self'`                                   | Allows the generated local CSS bundle                                       |
| `font-src 'self'`                                    | Allows the locally hosted Windows 98-style fonts                            |
| `img-src 'self' data:`                               | Allows local icons and embedded image data                                  |
| `connect-src 'self'`                                 | Prevents scripts from contacting unapproved external APIs                   |
| `form-action 'self' mailto:`                         | Limits form destinations to the site or an email client                     |
| `object-src 'none'`                                  | Disables unused legacy embedded objects                                     |
| `frame-ancestors 'none'` and `X-Frame-Options: DENY` | Prevent the CV from being embedded in another site                          |
| `Permissions-Policy`                                 | Disables camera, microphone and geolocation, which the CV does not use      |
| `X-Content-Type-Options: nosniff`                    | Requires deployed resources to use their declared MIME types                |
| `Referrer-Policy`                                    | Avoids exposing the complete CV URL to external sites                       |

### Moving the redirect script strengthened the policy

The root locale redirect was originally inline and required:

```text
script-src 'self' 'unsafe-inline'
```

Moving it to `assets/js/locale-redirect.js` allowed the CV to use:

```text
script-src 'self'
```

The supported locales and fallback locale are passed through generated `data-*` attributes. This keeps the configuration in the build while avoiding inline JavaScript.

### Local assets simplify security

The CV hosts its scripts, stylesheet, images and fonts locally. The CSP therefore does not need to trust a CDN, a font provider or a third-party script domain.

This is both a security and maintenance advantage: the allowlist stays short and the page does not depend on external assets to render correctly.

### The configuration must follow real features

The current policy should remain unchanged while the CV only uses local assets and `mailto:` links. If the future letter editor sends data to an external service, only that service should be added to the required directive instead of using a wildcard or restoring `'unsafe-inline'`.

The main lesson is that CSP is one layer of defense. Correct escaping, local assets, valid MIME types, HTTPS and post-deployment header checks remain necessary.

## 17. Source CSS can stay modular without production `@import`

Separate source modules improve maintenance:

```text
reset -> tokens -> base -> components -> theme -> print
```

The browser receives one generated stylesheet. This avoids sequential CSS import requests and keeps the deployed asset list simple.

The current bundler uses a regular expression matching the project's exact absolute `@import` syntax. This is acceptable for a controlled small project, but fragile as a general CSS parser. If imports become more complex, a maintained CSS tool is safer than extending the regular expression indefinitely.

## 18. Print is a separate presentation context

Browser display and A4 output have different constraints.

Print styles should:

- remove navigation and decorative controls;
- use a white background and strong contrast;
- remove unnecessary shadows and retro effects;
- control margins and page breaks;
- avoid splitting important blocks where possible;
- preserve readable link information;
- disable animation and other screen-only behavior.

`window.print()` opens the browser's print dialog and lets the user save a PDF. It does not guarantee identical pagination in every browser, so A4 output still requires manual testing.

## 19. A disabled decorative control is still an accessibility decision

Windows-style minimize, maximize, and close buttons are visual decoration when they do not perform actions.

Their implementation must avoid suggesting unavailable functionality. Disabled buttons are removed from normal interaction, but their labels and purpose still need review. Possible alternatives include rendering non-interactive elements or hiding purely decorative controls from assistive technology.

Visible and accessible labels must be localized. English `aria-label` values on French or Japanese pages create an inconsistent screen-reader experience.

## 20. Content architecture matters as much as code architecture

Separating facts from wording prevents duplicated truth:

- name, dates, links, and certifications belong in shared data;
- translated titles, summaries, and SEO descriptions belong in locale files;
- page order and markup belong in the template and renderers.

The same rule applies inside one layer. Keeping both `profile.headline` and `cv.title` creates two competing values. A field that is not the source of truth should be removed rather than retained as an invisible fallback.

## 21. Removing speculative files improves maintainability

Empty placeholders for a future letter editor did not make the feature easier to build. They created invalid JSON, unused paths, and the illusion of an existing architecture.

A better sequence is:

1. define the user workflow;
2. define the data and print requirements;
3. choose the architecture;
4. create the files needed by that implementation.

Git history is a safer archive than dead source files.

## 22. Refactoring needs executable checks

A visual preview is not enough after changing the generator, routes, content or security configuration. The CV uses repeatable checks against both the source and the generated `dist/` directory.

All commands are run from the project root.

### Build and JSON

Build the production version:

```bash
npm run build
```

Expected result:

```text
Build completed successfully.
```

When a JSON error needs to be isolated, validate every data and locale file independently:

```bash
find src/data src/locales -type f -name "*.json" -exec node -e \
'JSON.parse(require("node:fs").readFileSync(process.argv[1], "utf8")); console.log("Valid JSON:", process.argv[1])' {} \;
```

### Generated routes and removed concepts

Inspect the generated files:

```bash
find dist -type f -print | sort
```

Search for concepts that should have disappeared during the refactoring:

```bash
grep -RIn "profile\.headline" src build.mjs dist
grep -RInE 'class="(true|false)"' src build.mjs dist
grep -RInE '/(designer|fullstack)/' src build.mjs dist
```

No output is expected once those removals are complete.

Check that old variant directories and the obsolete root `public/` directory are absent:

```bash
find dist -type d \( -name "designer" -o -name "fullstack" \) -print
find . -maxdepth 1 -type d -name "public" -print
```

### CSS bundle

The production build should contain one stylesheet:

```bash
find dist/assets/css -maxdepth 1 -type f -print
```

Expected file:

```text
dist/assets/css/style.css
```

Confirm that browser-level `@import` rules are gone and inspect the bundled module order:

```bash
grep -n "@import" dist/assets/css/style.css
grep -n "^/\* .*\.css \*/" dist/assets/css/style.css
```

The first command should return no output. The second should list:

```text
reset.css
tokens.css
base.css
components.css
win98-theme.css
print.css
```

### Localized SEO and security

Inspect language, canonical and alternate links in every generated CV:

```bash
grep -nE '<html lang=|rel="canonical"|hreflang=' \
  dist/fr/cv/index.html \
  dist/en/cv/index.html \
  dist/ja/cv/index.html
```

Check the sitemap and generated security policy:

```bash
grep -n "<loc>" dist/sitemap.xml
grep -n "Content-Security-Policy" dist/_headers
grep -n "unsafe-inline" src/static/_headers dist/_headers
```

The final command should return no output.

### Deployed responses

Generated files do not prove that the hosting platform applied them. Check the live security headers:

```bash
curl -sI "https://cv.authelinflorian.dev/fr/cv/" |
grep -Ei '^(HTTP/|content-security-policy:|x-content-type-options:|referrer-policy:|x-frame-options:|permissions-policy:)'
```

Verify the JavaScript MIME type:

```bash
curl -sI "https://cv.authelinflorian.dev/assets/js/locale-redirect.js" |
grep -Ei '^(HTTP/|content-type:)'
```

Verify a legacy redirect:

```bash
curl -sI "https://cv.authelinflorian.dev/lang/fr/" |
grep -Ei '^(HTTP/|location:)'
```

### Final Git checks

Before committing:

```bash
git status --short
git diff --check
```

`git status --short` shows the files affected by the refactoring. `git diff --check` detects whitespace errors.

For negative searches, `grep` returning exit code `1` means that no match was found, which is the expected result.

## 23. Scope reduction can be an architectural improvement

The most important decision was not adding the generator or bundler. It was removing the second CV variant after the professional goal changed.

Keeping an unused abstraction would have increased:

- content duplication;
- translation work;
- testing combinations;
- route and SEO complexity;
- maintenance cost.

The final architecture is more scalable for the actual product because it scales one clear source across locales without preserving requirements that no longer exist.
