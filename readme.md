> [!WARNING]
> **Archived — old version**
>
> This project is no longer maintained. Its source code and documentation are preserved as a record of its development and learning outcomes.

# Multilingual Web Designer and Front-End CV

A static, multilingual online CV for a junior web designer and front-end developer. The interface uses a Windows 98-inspired visual language while keeping the document readable, responsive, printable, and easy to maintain.

The site is generated with a small Node.js build script from shared data, localized content, and one HTML template. The production output remains plain HTML, CSS, and JavaScript and can be deployed on any static host.

## Project status and reason for archiving

The decision to retire the separate CV website was made on 5 October 2026 as part of a broader portfolio redesign. Maintaining a CV and portfolio on different websites added navigation friction and duplicated maintenance work.

The new direction is a single, simpler portfolio that brings project presentations and CV information together. The professional focus remains web design and front-end development.

This repository preserves the final implementation, earlier HTML pages, technical decisions, and lessons learned. It is no longer an active product and is retained for historical and educational reference.

## Archived site URLs

- [French CV](https://oldcv.authelinflorian.dev/fr/cv/)
- [English CV](https://oldcv.authelinflorian.dev/en/cv/)
- [Japanese CV](https://oldcv.authelinflorian.dev/ja/cv/)

The archived build generates French, English, and Japanese pages. The visible language selector exposes French and English, while the root redirect still supports all three locales.

## Why this project exists

The first version was a manually maintained multilingual CV. Every language duplicated most of the same HTML, which made content changes, translations, metadata, and layout fixes increasingly difficult to keep aligned.

An intermediate plan introduced separate Designer and Full Stack CV variants plus a letter editor. That scope was deliberately reduced. The final implementation contains one focused CV combining web design and front-end development. The letter editor was considered but never implemented.

This direction was chosen to:

- present a clearer professional positioning;
- avoid duplicated pages and variant-specific code;
- keep factual data separate from localized wording;
- generate fast, indexable, printable static pages;
- preserve a simple stack that can be explained and maintained without a framework.

## Features in the archived version

- French, English, and Japanese static pages generated from shared sources;
- localized titles, descriptions, content, navigation labels, and project information;
- canonical URLs, reciprocal `hreflang` links, and an `x-default` entry;
- generated XML sitemap and a `robots.txt` reference to it;
- root-language redirection based on saved preference or browser language;
- responsive Windows 98-inspired interface;
- print stylesheet and browser-based PDF export through `window.print()`;
- modular source CSS bundled into one production stylesheet;
- static deployment configuration for redirects and security headers;
- strict Content Security Policy without `unsafe-inline` scripts.

## Technical approach

| Concern                    | Source of truth               | Production result                 |
| -------------------------- | ----------------------------- | --------------------------------- |
| Personal and project facts | `src/data/base/*.json`        | Injected into each localized page |
| Localized wording and SEO  | `src/locales/{locale}/*.json` | One page per locale               |
| Page structure             | `src/templates/cv.html`       | Static `index.html` files         |
| Styles                     | `src/assets/css/*.css`        | `dist/assets/css/style.css`       |
| Client behavior            | `src/assets/js/*.js`          | Plain deferred JavaScript         |
| Hosting rules              | `src/static/`                 | Copied to the root of `dist/`     |

The build follows a clean pipeline:

1. remove and recreate `dist/`;
2. copy shared assets;
3. bundle the CSS modules in their declared order;
4. copy static hosting files;
5. generate one CV page for every supported locale;
6. generate the root redirect page and sitemap.

## Project structure

```text
.
├── archives/                 # Legacy HTML kept as a migration reference
├── ats/                      # Historical ATS reports
├── docs/
│   ├── project-evolution.md  # Major stages, trade-offs, and decisions
│   └── what-i-learned.md     # Technical and editorial lessons
├── src/
│   ├── assets/
│   │   ├── css/              # Modular source styles
│   │   ├── fonts/
│   │   ├── img/
│   │   └── js/
│   ├── data/base/            # Shared factual data
│   ├── locales/              # FR, EN, and JA content
│   ├── static/               # robots.txt, redirects, and headers
│   └── templates/            # Shared HTML template
├── build.mjs                 # Static-site generator and CSS bundler
├── preview.mjs               # Local server with live reload
├── package.json
└── LICENSE
```

`dist/` is generated and ignored by Git. It is disposable output, not an editable source directory.

## Local development

Requirements:

- Node.js;
- npm.

Install dependencies:

```bash
npm install
```

Start the development workflow:

```bash
npm run dev
```

This performs an initial build, watches `src/`, rebuilds after source changes, and serves `dist/` locally.

Create a production build:

```bash
npm run build
```

Preview an existing build:

```bash
npm run preview
```

Generated routes:

```text
dist/
├── index.html
├── fr/cv/index.html
├── en/cv/index.html
├── ja/cv/index.html
├── sitemap.xml
├── robots.txt
├── _headers
└── _redirects
```

## SEO and localization

Each localized page declares its own canonical URL and links to every language version with `hreflang`. The root URL is used as `x-default` because it selects a locale before redirecting.

The sitemap is generated from the same locale configuration as the pages, preventing routes and sitemap entries from drifting apart. Locale codes use `fr`, `en`, and `ja`; `ja` is the correct language code for Japanese, while `JP` is a country code.

Legacy `/lang/...` routes are redirected permanently to the current `/fr/cv/`, `/en/cv/`, and `/ja/cv/` structure.

## Security and deployment

The static hosting configuration applies:

- `X-Content-Type-Options: nosniff`;
- `Referrer-Policy: strict-origin-when-cross-origin`;
- `X-Frame-Options: DENY`;
- a restrictive `Permissions-Policy`;
- a Content Security Policy limited to same-origin resources;
- an `X-Robots-Tag: noindex` rule for `/resume/*.pdf`, retained from the planned downloadable PDF feature.

The root redirect logic is stored in an external JavaScript file. This removed the need for `script-src 'unsafe-inline'` in the Content Security Policy.

## Key decisions

### One focused CV instead of multiple variants

The Full Stack variant was removed to match the intended career direction and reduce maintenance cost. Back-end knowledge can still appear as supporting skills without defining the product architecture or professional positioning.

### Static generation instead of client-side rendering

The CV content is generated at build time. Visitors receive complete HTML without waiting for JavaScript, which improves reliability, printing, SEO, and accessibility.

### Native stack instead of a framework

The project does not need component hydration, routing state, or an application runtime. A small Node.js generator solves the duplication problem while keeping the deployed site framework-free.

### Modular CSS in source, one CSS file in production

Separate source files keep design tokens, base styles, components, the Windows 98 theme, and print rules understandable. Bundling them removes chained `@import` requests in production.

### Deferred letter editor

Empty placeholder files were removed to avoid speculative architecture. The editor was deferred before the project was archived and is not part of the final implementation.

## Documentation

- [Project evolution](docs/project-evolution.md)
- [What I learned](docs/what-i-learned.md)

The former `docs/project.md` content has been consolidated into this README to avoid maintaining two competing project overviews.

## License

See [LICENSE](LICENSE).
