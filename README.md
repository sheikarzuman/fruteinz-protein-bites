# Fruteinz™ Protein Bites — Concept Website

A scroll-driven brand website for **Fruteinz™ Protein Bites**, built as the
Task 6 creative deliverable for a Fundamentals of Marketing (MBA) project.

> **Real Fruits. Real Protein. Perfectly Bitesized.**
> Goodness in every bite ♡

---

## 1. Project overview

Fruteinz is a fictional protein-snack brand concept created for a
Fundamentals of Marketing course project. Rather than a slide deck, this
project's creative deliverable is a single-page, scroll-driven website that
tells the brand's story: from the consumer research that shaped it, to the
five real-fruit flavours, to a lightweight interactive "Find Your Bite" quiz.

The project follows the intended narrative arc:

```
Consumer Evidence → Consumer Insight → Market Opportunity →
Brand Proposition → Creative Execution
```

## 2. Brand concept

| | |
|---|---|
| **Brand** | Fruteinz™ Protein Bites |
| **Line** | "Real Fruits. Real Protein. Perfectly Bitesized." |
| **Supporting line** | "Goodness in every bite ♡" |
| **Flavours** | Guava · Jackfruit · Avocado · Blackberry · Raspberry |
| **Pack facts** | 20g protein / pack · 15 bites / pack · Soy + Whey + Honey · Natural fruit flavours · Plant-based soy protein · No artificial colours or preservatives |
| **Price** | ₹200 / pack (concept price, as shown on the source poster) |

All product facts on the site come directly from the supplied poster. No
additional nutrition facts, medical claims, certifications, or reviews have
been invented.

## 3. Marketing research context

The site's "Why Fruteinz" section is built on primary consumer research
conducted for this project:

- An online survey of **43 respondents** (41 answered the brand-recall
  question), plus **5 in-depth interviews**.
- Protein content was the single strongest product attribute; ingredient
  cleanliness was a close second (~86% rated "no artificial
  additives/preservatives/added sugar" 4 or 5 out of 5).
- Taste (especially bitterness), price, convenience, and a "heavy"/digestive
  feeling were recurring interview themes.
- ₹60–₹150 was the dominant spend range (67.5% of respondents); supermarket/
  retail was the dominant purchase channel (76.7%).
- Brand recall was fragmented, with no single dominant brand.

Every statistic shown on the site is explicitly labelled as coming from this
primary research — never presented as scientific validation, and never
stretched into unsupported claims (e.g. no "easier to digest" or "healthier
than X" language appears anywhere).

## 4. Features

- **Sticky navigation** that compresses and gains a translucent background on
  scroll, with an animated underline and active-section highlighting, plus a
  fully accessible animated hamburger menu on mobile.
- **Spectacular hero** built from the real product packaging cropped out of
  the supplied poster, with layered organic shapes and subtle parallax.
- **"Watch the Film" section** — a short brand video with native HTML5
  controls and a poster frame, sitting right after the hero.
- **Brand story, product benefits ("What's Inside"), and product showcase**
  sections using the poster's real icons, pack photography, and copy.
- **Interactive Flavour Journey** — a five-flavour selector where each
  flavour has its own colour system, product image, and short copy.
- **Consumer Insight section** translating the research above into four
  elegant insight cards, with a clear research disclaimer.
- **"Find Your Bite" quiz** — a real, working two-question JavaScript quiz
  that recommends one of the five flavours, clearly framed as a fun brand
  experience rather than a scientific result.
- **Bold final CTA and footer**, with academic-context and social
  placeholders as specified.

## 5. Scroll animation system

All scroll-triggered motion runs through one small, reusable system in
`static/js/script.js` and `static/css/style.css` — no animation library:

- `IntersectionObserver` adds `.is-visible` once to `.reveal`,
  `.reveal-left`, `.reveal-right`, `.scale-in`, and `.stagger-item` elements
  as they enter the viewport; CSS transitions (opacity/transform) do the
  rest, with per-element stagger via a `--d` custom property.
- A lightweight multi-layer **parallax** system reads `data-speed` on any
  `.parallax` element and offsets it with `requestAnimationFrame`-throttled
  `translate3d`, clamped to a small maximum so movement always stays subtle.
- Organic inline SVG "wave" dividers carry the cream ↔ forest-green ↔ fruit
  colour transitions between sections instead of hard cuts.
- Everything respects `prefers-reduced-motion: reduce` — reveals appear
  immediately and parallax is disabled entirely.

## 6. Interactive quiz

"Find Your Bite" asks two short questions (what you're reaching for, and
which flavour colour catches your eye), scores the five flavours against
your answers, and reveals a result card with the matching pack photo, name,
colour, and a short, neutral description — plus a "Try another bite" reset.
It's explicitly labelled as "a fun brand experience — not a scientific
personality test."

## 7. Technology stack

- **Python 3 + Flask** — a single route serving one Jinja template.
- **HTML5 + Jinja** — flavours, benefit icons, ingredient chips, and
  research insights are all data-driven from `app.py`, not duplicated in
  markup.
- **CSS3** — custom properties, `clamp()` fluid type, CSS Grid/Flexbox, no
  framework.
- **Vanilla JavaScript** — no dependencies at all.
- **Pillow** (dev-only) — used once by `scripts/process_assets.py` to crop
  the supplied poster into web-ready assets; not required to run the site.

## 8. Installation

```bash
git clone <this-repo-url>
cd fruteinz-website
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## 9. Running locally

```bash
python app.py
# or
flask --app app run
```

Then open **http://127.0.0.1:5000** in your browser.

## 10. Project structure

```
fruteinz-website/
│
├── app.py                     # Flask app + flavour/benefit/insight data
├── requirements.txt
├── README.md
├── .gitignore
│
├── scripts/
│   └── process_assets.py      # One-off poster → web-asset crop pipeline
│
├── templates/
│   └── index.html             # Single-page site template
│
└── static/
    ├── css/style.css
    ├── js/script.js
    ├── video/
    │   └── fruteinz-film.mp4  # "Watch the Film" brand video
    └── images/                # Cropped from the supplied poster
        ├── pack-guava.jpg, pack-jackfruit.jpg, pack-avocado.jpg,
        │   pack-blackberry.jpg, pack-raspberry.jpg
        ├── packs-lineup.jpg
        ├── icon-protein.png, icon-fruit-flavours.png, icon-honey.png,
        │   icon-soy.png, icon-no-artificial.png
        ├── logo-lockup.png, poster-full.jpg
        ├── film-poster.jpg       # Poster frame for the brand video
        └── favicon.png
```

## 11. Asset information

Every product photo, pack, and icon on the site is **cropped directly from
the supplied poster** (`scripts/process_assets.py` documents the exact crop
boxes) — the packaging itself was never redesigned or altered, only cropped
and resized without distortion. The only generated (non-cropped) image is
`favicon.png`, a small programmatic browser-tab mark — it is site chrome,
not product artwork.

## 12. GitHub

To publish this project:

```bash
git init
git add .
git commit -m "feat: initial Fruteinz concept website"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

Suggested repository name: **`fruteinz-protein-bites`**.

## Disclaimer

This is a fictional brand concept created solely for an academic
Fundamentals of Marketing course project. It is not a real, purchasable
product. No checkout or payment flow is implemented, and the ₹200 price
shown is the concept price from the supplied poster only.
