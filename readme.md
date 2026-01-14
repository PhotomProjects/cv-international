<div style="text-align:center;">

# Multilingual Online CV (EN/FR/JP)

A fast, print-friendly, SEO-ready online CV built with vanilla HTML/CSS/JS, featuring dark mode and Japanese application documents (履歴書 / 職務経歴書) as PDFs.

The goal was to make it the more simplistic possible for a quick reading.

It was thinked for durability and maintenance, notably for the projects section so that it'll be easy to add multiple projects to show with demos in it.

For more information about the project, see:

<a href="project.md" style="color:cyan;">About the project</a>

</div>

---

## <ins>Demo</ins>

- EN: (coming soon)
- FR: (coming soon)
- JP: (coming soon)

---

## <ins>Features</ins>

- Multi-language pages (EN/FR/JP) with `hreflang` + `x-default`
- Dark mode with saved preference via localStorage (no white flash on load - theme applied before first paint)
- Print stylesheet **optimized** for A4
- SEO basics: **per languages,** titles, descriptions, canonical/hreflang, JSON-LD `Person`
- Social links (GitHub/LinkedIn) as inline SVG
- Japanese documents:
  履歴書 (Rirekisho) PDF
  職務経歴書 (Shokumu-keirekisho) PDF

---

## <ins>Tech stack</ins>

- HTML5
- CSS (variables, responsive, print styles)
- JavaScript (theme toggle)

---

## <ins>Folder structure</ins>

```text
.
├─ ats/
│  └─ jobscan-match_report.pdf
│  └─ jobscan-offer_comparison.png
├─ css/
│  └─ style.css
├─ img/
│  └─ github.svg
│  └─ linkedin.svg
├─ js/
│  └─ script.js
├─ lang/
│  └─ en/           # English page
│     └─ index.html
│  └─ fr/           # French page
│     └─ index.html
│  └─ jp/           # Japanese page
│     └─ index.html
├─ resume/
│  ├─ cv-en.pdf
│  ├─ cv-fr.pdf
│  ├─ cv-jp.pdf
│  ├─ rirekisho-*.pdf
│  └─ shokumu-keirekisho-*.pdf
├─ LICENSE
└─ readme.md
```

---

## <ins>Project timeline</ins>

### 1st day

- stack selection
- organization of the subdomain structure
- brainstorming of features to add
- creation of my resume in docx to scan it afterwards (ATS)

### 2nd day to 5th day

- initialization of the project (repo created)
- code
  - HTML structure first, writing content after, made two different branches for FR/JP versions (i18n-fr (FR) and i18n-jp (JP), both merged and deleted now)
  - CSS (media/page rules, responsive, dark mode)
  - JS (dark mode)
- test/debug
- fix (fixed a major issue with darkmode, issue #1)
- creation of Rirekisho and Shokumukeirekisho

### 6th day

- cleaning code and folder
- writing readme - licence - what I learned

---

## <ins>Roadmap</ins>

- add absolute URLs (canonical / hreflang - x-default / JSON-LD) when my portfolio will be online (as for the sub-domains).

---

## <ins>License</ins>

See `LICENSE`.
