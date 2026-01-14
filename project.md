# Multilingual Resume (tech/IT)

It's my main resume to use by default to candidate for international/remote jobs offers.

## Sub-domain + Structure

```
authelinflorian.dev
├── / (portfolio EN)
├── /projects
├── /contact
```

```
cv.authelinflorian.dev
├── /en → international resume (main)
├── /fr → french resume
├── /jp → japanse resume (adapted)
```

## Source Resume

First, I created my resume as a PDF and run it through an Applicant Tracking System (ATS) to ensure a high score. Then, I used it as a template for my online resume.

See [ATS Resullt](jobscan-match_report.pdf)

There was 4 important points to follow:

- a strict and simple design
- ATS-friendly
- 1 page only
- standard structure

## Online Resume

It has to be:

- readable, human-like
- pleasant
- enriched
- but faithful to the source resume

**What my online resume**

Can do (and a PDF can't)

- collapsible sections
- direct links to GitHub/LinkedIn
- live demo
- vertical scrolling

Should not do

- remove key sections
- change the headings (Skills → “What I Know”)
- be more vague than the source resume

## **Rirekisho (履歴書)** — japanese resume

It's a cultural document, not a tech resume.

**Keypoints**

| Element | Required |
| ------- | -------- |
| Format  | A4       |
| Lenght  | 2 pages  |
| Photo   | Yes      |
| Age     | Yes      |
| Adress  | Yes      |
| Writing | Formal   |

It is very codified.
I had to adapt the content (make it more concise, less sales-oriented), and avoid translating the international resume word for word.

**Rirekisho Contents**

Personal Information

- Name
- Date of Birth
- Gender
- Nationality
- Address
- Phone number
- Email

Photo

- Light Background
- Suit
- Neutral Expression

**Motivation (超重要)**

A written section:

> Why this company?

> Why Japan?

> Why this position?

**What Rirekisho IS NOT**

- not skills-oriented
- not project-oriented
- not tech stack-oriented

It is used to assess cultural fit, not skill.

## Format

| Element          | Standard        |
| ---------------- | --------------- |
| Lenght           | **1 page**      |
| Language         | **English**     |
| Photo            | **No**          |
| Age / sex        | **No**          |
| Family situation | **No**          |
| Design           | Simple, lisible |

It is crucial to not put anything personal or I risk to be eliminated.

What to avoid for design:

- overly graphic design
- “creative” resume
- PDF not selectable

## ATS

Very important for Applicant Tracking Systems (ATS):

- keywords are required (stack / summary section helps)
- no progress bars or stars, it means nothing
- no columns
- no profile pics

HTML & ATS: What to know

The online resume:

- is not parsed by ATS
- can be parsed by simple scrapers
- must remain accessible

So:

- semantic HTML
- no canvas
- no "hidden" content

## Empty resume

My resume looks empty, for now.
That's because I don't yet have any:

- experience
- projects

Therefore, it's vital to create projects. Having more projects > IT degrees.

## Strategy

International resume

- EN
- main resume

French resume

- same structure
- exact same translation
- useful for France / Luxembourg / Switzerland

Rirekisho -> JP

- Web resume (overview) + Download Rirekisho (PDF)
- international startups/companies in Japan -> international resume
- traditional Japanese companies -> Rirekisho
