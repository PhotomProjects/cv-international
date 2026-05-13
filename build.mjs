import { rm, mkdir, cp, readFile, writeFile, access } from "node:fs/promises";
import path from "node:path";

// Project paths
const ROOT = process.cwd();
const SRC = path.join(ROOT, "src");
const DIST = path.join(ROOT, "dist");

// Build config
const SUPPORTED_LOCALES = ["fr", "en", "ja"];
const DEFAULT_LOCALE = "fr";
const DEFAULT_VARIANT = "designer";

// Small UI labels that are easier to keep in code for now
const PROJECT_LINK_LABELS = {
  fr: {
    viewProject: "Voir le projet",
    github: "GitHub",
    professionalLinks: "Liens professionnels",
    homeTitle: "Redirection du CV",
    homeMessage: "Redirection vers la bonne langue…",
    homeFallback: "Si rien ne se passe, choisir une langue :"
  },
  en: {
    viewProject: "View Project",
    github: "GitHub",
    professionalLinks: "Professional Links",
    homeTitle: "CV Redirect",
    homeMessage: "Redirecting to the correct language…",
    homeFallback: "If nothing happens, choose a language:"
  },
  ja: {
    viewProject: "プロジェクトを見る",
    github: "GitHub",
    professionalLinks: "関連リンク",
    homeTitle: "CVリダイレクト",
    homeMessage: "適切な言語へ移動しています…",
    homeFallback: "移動しない場合は言語を選択してください："
  }
};

// Check whether a file or directory exists
async function exists(targetPath) {
    try {
        await access(targetPath);
        return true;
    } catch {
        return false;
    }
}

// Clean and recreate the output directory
async function cleanDist() {
    await rm(DIST, { recursive: true, force: true });
    await mkdir(DIST, { recursive: true });
}

// Copy a directory only if it exists
async function copyDirIfExists(from, to) {
    if (!(await exists(from))) {
        console.warn(`Skipped missing directory: ${from}`);
        return;
  }
    await mkdir(path.dirname(to), { recursive: true });
    await cp(from, to, { recursive: true });
}

// Read and parse a JSON file inside src/
async function loadJson(relativePath) {
    const filePath = path.join(SRC, relativePath);
    const content = await readFile(filePath, "utf-8");    
  try {
    return JSON.parse(content);
  } catch (error) {
    console.error(`Invalid JSON in: ${filePath}`);
    throw error;
  }
}

async function loadTemplate(relativePath) {
  const filePath = path.join(SRC, relativePath);
  return readFile(filePath, "utf-8");
}

function renderTemplate(template, data) {
  return Object.entries(data).reduce((output, [key, value]) => {
    return output.replaceAll(`{{${key}}}`, value ?? "");
  }, template);
}

// Escape unsafe HTML characters before injecting text into markup
function escapeHtml(value = "") {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

// Get a localized value.
// Supports:
// - plain strings
// - objects like { fr: "...", en: "...", ja: "..." }
function getLocalizedValue(value, locale, fallbackLocale = DEFAULT_LOCALE) {
  if (value == null) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "object") {
    if (typeof value[locale] === "string") {
      return value[locale];
    }

    if (typeof value[fallbackLocale] === "string") {
      return value[fallbackLocale];
    }

    const firstStringValue = Object.values(value).find(
      (entry) => typeof entry === "string"
    );

    return firstStringValue ?? "";
  }

  return String(value);
}

// Render a list of <li> items from an array of strings or localized objects
function renderListItems(items = [], locale) {
  return items
    .map((item) => `<li>${escapeHtml(getLocalizedValue(item, locale))}</li>`)
    .join("");
}

// Render a comma-separated inline list where each item is wrapped in <strong>
function renderInlineStrongList(items = [], locale) {
  return items
    .map((item) => `<strong>${escapeHtml(getLocalizedValue(item, locale))}</strong>`)
    .join(", ");
}

function getGithubIcon() {
  return `
    <svg viewBox="0 0 24 24" class="social-icon" aria-hidden="true">
      <path d="M12,0.296c-6.627,0-12,5.372-12,12c0,5.302,3.438,9.8,8.206,11.387
      c0.6,0.111,0.82-0.26,0.82-0.577c0-0.286-0.011-1.231-0.016-2.234c-3.338,0.726-4.043-1.416-4.043-1.416
      C4.421,18.069,3.635,17.7,3.635,17.7c-1.089-0.745,0.082-0.729,0.082-0.729c1.205,0.085,1.839,1.237,1.839,1.237
      c1.07,1.834,2.807,1.304,3.492,0.997C9.156,18.429,9.467,17.9,9.81,17.6c-2.665-0.303-5.467-1.332-5.467-5.93
      c0-1.31,0.469-2.381,1.237-3.221C5.455,8.146,5.044,6.926,5.696,5.273c0,0,1.008-0.322,3.301,1.23
      C9.954,6.237,10.98,6.104,12,6.099c1.02,0.005,2.047,0.138,3.006,0.404c2.29-1.553,3.297-1.23,3.297-1.23
      c0.653,1.653,0.242,2.873,0.118,3.176c0.769,0.84,1.235,1.911,1.235,3.221c0,4.609-2.807,5.624-5.479,5.921
      c0.43,0.372,0.814,1.103,0.814,2.222c0,1.606-0.014,2.898-0.014,3.293c0,0.319,0.216,0.694,0.824,0.576
      c4.766-1.589,8.2-6.085,8.2-11.385C24,5.669,18.627,0.296,12,0.296z"/>
    </svg>
  `;
}

function getLinkedinIcon() {
  return `
    <svg viewBox="0 0 24 24" class="social-icon" aria-hidden="true">
      <path d="M17.291,19.073h-3.007v-4.709c0-1.123-0.02-2.568-1.564-2.568c-1.566,0-1.806,1.223-1.806,2.487v4.79H7.908
      V9.389h2.887v1.323h0.04c0.589-1.006,1.683-1.607,2.848-1.564c3.048,0,3.609,2.005,3.609,4.612L17.291,19.073z M4.515,8.065
      c-0.964,0-1.745-0.781-1.745-1.745c0-0.964,0.781-1.745,1.745-1.745c0.964,0,1.745,0.781,1.745,1.745
      C6.26,7.284,5.479,8.065,4.515,8.065L4.515,8.065 M6.018,19.073h-3.01V9.389h3.01V19.073z M18.79,1.783H1.497
      C0.68,1.774,0.01,2.429,0,3.246V20.61c0.01,0.818,0.68,1.473,1.497,1.464H18.79c0.819,0.01,1.492-0.645,1.503-1.464V3.245
      c-0.012-0.819-0.685-1.474-1.503-1.463"/>
    </svg>
  `;
}

function renderSocialLinks(contact, locale) {
  const githubUrl = contact?.links?.github ?? "";
  const linkedinUrl = contact?.links?.linkedin ?? "";

  if (!githubUrl && !linkedinUrl) {
    return "";
  }

  const ariaLabels = {
    fr: {
      nav: "Liens professionnels",
      github: "GitHub",
      linkedin: "LinkedIn"
    },
    en: {
      nav: "Professional links",
      github: "GitHub",
      linkedin: "LinkedIn"
    },
    ja: {
      nav: "関連リンク",
      github: "GitHub",
      linkedin: "LinkedIn"
    }
  };

  const labels = ariaLabels[locale] ?? ariaLabels.fr;

  return `
    <div class="social-links">
      <nav aria-label="${escapeHtml(labels.nav)}">
        <ul>
          ${
            githubUrl
              ? `
            <li>
              <a
                href="${escapeHtml(githubUrl)}"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="${escapeHtml(labels.github)}"
              >
                ${getGithubIcon()}
              </a>
            </li>
          `
              : ""
          }
          ${
            linkedinUrl
              ? `
            <li>
              <a
                href="${escapeHtml(linkedinUrl)}"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="${escapeHtml(labels.linkedin)}"
              >
                ${getLinkedinIcon()}
              </a>
            </li>
          `
              : ""
          }
        </ul>
      </nav>
    </div>
  `;
}

// Render the locale switcher for the current page
function renderLanguageSwitcher(currentLocale) {
  return `
    <nav class="language-switcher" aria-label="Language switcher">
      <ul>
        ${SUPPORTED_LOCALES.map((locale) => {
          const isActive = locale === currentLocale;
          const activeClass = isActive ? "active" : "";
          const ariaCurrent = isActive ? 'aria-current="page"' : "";

          return `
            <li>
              <a
                href="/${locale}/cv/${DEFAULT_VARIANT}/"
                data-locale="${locale}"
                class="${isActive}"
                lang="${locale}"
                ${ariaCurrent}
              >
                ${locale.toUpperCase()}
               </a>
            </li>
          `;
        }).join("")}
      </ul>
    </nav>
  `;
}

// Render the education section
function renderEducation(education, locale) {
  return (education?.items ?? [])
    .map((item) => {
      const title = getLocalizedValue(item.title, locale);
      const certification = item.certification
        ? ` (${escapeHtml(item.certification)})`
        : "";

      const details = [
        escapeHtml(item.school ?? ""),
        item.period ? `(${escapeHtml(item.period)})` : "",
        item.location ? escapeHtml(item.location) : ""
      ]
        .filter(Boolean)
        .join(", ");

      return `
        <p>
          <strong>${escapeHtml(title)}</strong>${certification}
          ${details ? `- ${details}` : ""}
        </p>
      `;
    })
    .join("");
}

// Render the skills section
function renderSkills(skills, locale) {
  const groups = skills?.skills?.groups ?? [];

  return groups
    .map((group) => {
      const label = getLocalizedValue(group.label, locale);
      const items = group.items ?? [];

      return `
        <li>
          ${escapeHtml(label)}: ${renderInlineStrongList(items, locale)}
        </li>
      `;
    })
    .join("");
}

// Render the projects section
function renderProjects(projects, locale) {
  const projectLinkLabels = PROJECT_LINK_LABELS[locale] ?? PROJECT_LINK_LABELS[DEFAULT_LOCALE];

  return (projects?.items ?? [])
    .map((project) => {
      const title = getLocalizedValue(project.title, locale);
      const summary = getLocalizedValue(project.summary, locale);
      const stackText = (project.stack ?? []).join(" / ");
      const highlightsHtml = renderListItems(project.highlights ?? [], locale);

      const liveLink = project?.links?.live
        ? `<a href="${escapeHtml(project.links.live)}" target="_blank" rel="noopener noreferrer">${projectLinkLabels.viewProject}</a>`
        : "";

      const githubLink = project?.links?.github
        ? `<a href="${escapeHtml(project.links.github)}" target="_blank" rel="noopener noreferrer">${projectLinkLabels.github}</a>`
        : "";

      const linksHtml = [liveLink, githubLink].filter(Boolean).join(" · ");

      return `
        <article>
          <h3>
            ${escapeHtml(title)}
            ${stackText ? `(${escapeHtml(stackText)})` : ""}
          </h3>
          ${summary ? `<p>${escapeHtml(summary)}</p>` : ""}
          ${highlightsHtml ? `<ul>${highlightsHtml}</ul>` : ""}
          ${linksHtml ? `<p>${linksHtml}</p>` : ""}
        </article>
      `;
    })
    .join("");
}

// Render the spoken languages section
function renderLanguages(languages, locale) {
  return (languages?.items ?? [])
    .map((language) => {
      const name = getLocalizedValue(language.name, locale);
      const level = getLocalizedValue(language.level, locale);

      return `
        <li>
          ${escapeHtml(name)}: ${escapeHtml(level)}
        </li>
      `;
    })
    .join("");
}

async function buildDesignerPage(locale) {
  const profile = await loadJson("data/base/profile.json");
  const contact = await loadJson("data/base/contact.json");
  const education = await loadJson("data/base/education.json");
  const skills = await loadJson("data/base/skills.json");
  const projects = await loadJson("data/base/projects.json");
  const languages = await loadJson("data/base/languages.json");
  const localeCommon = await loadJson(`locales/${locale}/common.json`);
  const localeDesigner = await loadJson(`locales/${locale}/cv-designer.json`);
  const template = await loadTemplate("templates/cv.html");

  const outDir = path.join(DIST, locale, "cv", DEFAULT_VARIANT);
  await mkdir(outDir, { recursive: true });

  const pageTitle =
    localeDesigner?.cv?.designer?.title ??
    getLocalizedValue(profile.headline, locale) ??
    "Designer";

  const pageSummary =
    localeDesigner?.cv?.designer?.summary ?? "";

  const summaryLabel =
    localeCommon?.sections?.summary ?? "Summary";

  const educationLabel =
    localeCommon?.sections?.education ?? "Education";

  const skillsLabel =
    localeCommon?.sections?.skills ?? "Skills";

  const projectsLabel =
    localeCommon?.sections?.projects ?? "Projects";

  const languagesLabel =
    localeCommon?.sections?.languages ?? "Languages";
  
  const printLabel =
    localeCommon?.ui?.print ?? "Imprimer";

  // Render HTML fragments
  const educationHtml = renderEducation(education, locale);
  const skillsHtml = renderSkills(skills, locale);
  const projectsHtml = renderProjects(projects, locale);
  const languagesHtml = renderLanguages(languages, locale);
  const languageSwitcherHtml = renderLanguageSwitcher(locale);
  const socialLinksHtml = renderSocialLinks(contact, locale);
  
  const html = renderTemplate(template, {
    lang: escapeHtml(locale),
    document_title: `${escapeHtml(pageTitle)} - ${escapeHtml(profile.name ?? "")}`,
    meta_description: escapeHtml(pageSummary),
    body_class: "win98-theme",
    cv_variant: escapeHtml(DEFAULT_VARIANT),

    profile_name: escapeHtml(profile.name ?? ""),
    page_title: escapeHtml(pageTitle),

    contact_location: contact?.location
      ? `<p>${escapeHtml(contact.location)}</p>`
      : "",

    contact_email: contact?.email
      ? `<p><a href="mailto:${escapeHtml(contact.email)}">${escapeHtml(contact.email)}</a></p>`
      : "",

    contact_portfolio: contact?.links?.portfolio
      ? `<p><a href="${escapeHtml(contact.links.portfolio)}" target="_blank" rel="noopener noreferrer">${escapeHtml(contact.links.portfolio)}</a></p>`
      : "",

    language_switcher: languageSwitcherHtml,
    social_links: socialLinksHtml,

    print: escapeHtml(printLabel),

    summary_label: escapeHtml(summaryLabel),
    page_summary: escapeHtml(pageSummary),

    education_label: escapeHtml(educationLabel),
    education_html: educationHtml,

    skills_label: escapeHtml(skillsLabel),
    skills_html: skillsHtml,

    projects_label: escapeHtml(projectsLabel),
    projects_html: projectsHtml,

    languages_label: escapeHtml(languagesLabel),
    languages_html: languagesHtml
  });

  await writeFile(path.join(outDir, "index.html"), html, "utf-8");
}

// Build the root index.html that redirects to the preferred locale
async function buildRootIndex() {
  const fallbackLinks = SUPPORTED_LOCALES.map(
    (locale) => `<li><a href="/${locale}/cv/${DEFAULT_VARIANT}/">${locale.toUpperCase()}</a></li>`
  ).join("");

  const html = `<!DOCTYPE html>
<html lang="${DEFAULT_LOCALE}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CV Redirect</title>
  <script>
    (() => {
      const supportedLocales = ${JSON.stringify(SUPPORTED_LOCALES)};
      const defaultLocale = "${DEFAULT_LOCALE}";
      const forcedVariant = "${DEFAULT_VARIANT}";

      function normalizeLocale(value) {
        if (!value) {
          return defaultLocale;
        }

        const shortLocale = value.toLowerCase().slice(0, 2);

        if (supportedLocales.includes(shortLocale)) {
          return shortLocale;
        }

        return defaultLocale;
      }

      let locale = defaultLocale;

      try {
        const storedLocale = localStorage.getItem("locale");

        if (storedLocale) {
          locale = normalizeLocale(storedLocale);
        } else {
          locale = normalizeLocale(navigator.language);
        }

        // Force the published variant for V1
        localStorage.setItem("cvVariant", forcedVariant);
      } catch {
        locale = normalizeLocale(navigator.language);
      }

      window.location.replace('/' + locale + '/cv/' + forcedVariant + '/');
    })();
  </script>
</head>
<body>
  <main>
    <h1>CV Redirect</h1>
    <p>Redirecting…</p>
    <p>If nothing happens, choose a language:</p>
    <ul>
      ${fallbackLinks}
    </ul>
  </main>
</body>
</html>`;

  await writeFile(path.join(DIST, "index.html"), html, "utf-8");
}

// Main build entry point
async function main() {
  // 1) Start from a clean output folder
  await cleanDist();

  // 2) Copy shared assets
  await copyDirIfExists(path.join(SRC, "assets"), path.join(DIST, "assets"));

  // 3) Copy static files as-is
  await copyDirIfExists(path.join(SRC, "static"), DIST);

  // 4) Generate all designer pages
  for (const locale of SUPPORTED_LOCALES) {
    await buildDesignerPage(locale);
  }

  // 5) Generate the root redirect page
  await buildRootIndex();

  console.log("Build completed successfully.");
}

// Run the build
main().catch((error) => {
  console.error("Build failed:", error);
  process.exit(1);
});