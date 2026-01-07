<div style="text-align:center;">

# Multilingual Online CV (EN/FR/JP)

</div>

A fast, print-friendly, SEO-ready online CV built with vanilla HTML/CSS/JS, featuring dark mode and Japanese application documents (履歴書 / 職務経歴書) as PDFs.

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
  - 履歴書 (Rirekisho) PDF
  - 職務経歴書 (Shokumu-keirekisho) PDF

---

## <ins>Tech stack</ins>

- HTML5
- CSS (variables, responsive, print styles)
- JavaScript (theme toggle)

---

## <ins>Folder structure</ins>

```text
.
├─ en/           # English page
├─ fr/           # French page
├─ jp/           # Japanese page
├─ css/
│  └─ style.css
├─ js/
│  └─ script.js
└─ resume/
   ├─ cv-en.pdf
   ├─ cv-fr.pdf
   ├─ cv-jp.pdf
   ├─ rirekisho-*.pdf
   └─ shokumu-keirekisho-*.pdf
```

---

## <ins>Roadmap</ins>

- add absolute URLs (canonical / hreflang - x-default / JSON-LD) when my portfolio will be online (as for the sub-domains).
