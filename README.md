# Enzo Mixology

Static personal website for Enzo, with the original Chinese cocktail self-assessment integrated as a subpage.

- Home: https://rqguan.github.io/bartending/
- Quiz: https://rqguan.github.io/bartending/cocktailtest/
- Photo journal: https://rqguan.github.io/bartending/journal.html
- Room pages: `about.html`, `hospitality.html`, `drinks.html`, `fermentation.html`, `collaborations.html`, `writing.html`, `guestbook.html` under the same address

## Local preview and tests

Requires Python 3 for preview and Node.js 18+ for tests. No dependencies or build step.

```sh
python3 scripts/preview.py
# Open http://127.0.0.1:8765/bartending/
node --test tests/quiz.test.mjs
```

Preview deliberately uses `/bartending/` to catch broken project-site paths.

## Editing

- `index.html`: the homepage ("lobby"), styled as a late-1990s Chinese personal homepage: marquee, logo, a round portrait flanked by two columns of links, update line, notes, music button, visit counter and link buttons. Old single-page links such as `index.html#practice` or `#midtown-live` are redirected to the matching page by a small script in its `<head>`.
- Room pages, one per section, each with its own skin, a top bar (back-to-lobby button, "you are here" line, language switch) and a pager (previous room, lobby, next room), in this order: `about.html`, `hospitality.html`, `drinks.html`, `fermentation.html`, `collaborations.html` (anchors `#midtown-live`, `#fruit-stand`), `writing.html`, `guestbook.html`. When adding or reordering a page, update the neighbours' pager links and the lobby links.
- Kvass pages: `kvass.html` (overview, reached from the lobby banner and the Fermentation lab) with two product pages, `kvass-rye.html` and `kvass-pumpkin.html` (Halloween skin, falling-leaves effect and a countdown to the date in its `data-countdown`). Their back buttons and pagers lead up to `kvass.html`. Volume, price, alcohol and availability are not published yet; when confirmed, add a details table (`.spec-table`). For drafts, `.uc` (yellow-and-black "coming soon" sign) and `.tbc` text are available.
- `assets/kvass/`: four owner-supplied process photographs (bottles, toasted bread, steeping, straining), cropped only to remove the transparent margins of the supplied screenshots, and two AI-generated product images (`*-ai.jpg`). The owner confirmed the two glass images are AI-generated; they are captioned "AI-generated image" on the pages and must stay labelled.
- `assets/retro.css`: styles for the lobby and room pages. Each page puts one `.room--*` class on `<body>`; it only sets custom properties (tile, panel, ink, label, frame colors), and the frame, photo, button and type rules are shared.
- `assets/retro/`: hand-made SVG tiles (`tile-*.svg`), panel grain textures, and `sprite.svg` (vine ornament and pixel icons, used as `<use href="assets/retro/sprite.svg#vine"/>`). No external fonts, scripts or images are loaded, so the page also works where Google services are blocked.
- `assets/retro.js`: progressive enhancements only. "Dial-up" photo loading as photos scroll into view, a per-browser visit counter (localStorage, never sent anywhere), the Bar effects panel (champagne bubbles, falling ice, click fireworks, stardust cursor; choices remembered per browser; all off under reduced motion), and a music-box tune synthesised with the Web Audio API (only plays after a click). Without JavaScript the page and all links still work.
- `assets/thumbs/`: display copies (max 720–1100 px, EXIF stripped) of the photos used on the homepage. Every homepage photo still links to its untouched original in `assets/`.
- `journal.html`: 43 unique owner-supplied images, grouped by project, drinks, process, and visual references.
- `assets/site.css`, `assets/site.js`: styles and mobile menu for `journal.html` (the previous editorial design).
- `assets/i18n.js`: English/Chinese switch for the lobby, the room pages and `journal.html` (top-right button; English by default; `?lang=zh` opens Chinese). The chosen language is stored (`site-lang` in localStorage) and also added to every link to another page of the site, so each page opens in the language of the page you came from. The quiz reads and writes the same setting, and its back link keeps the language. Chinese wording is a dictionary keyed by the exact English text, so when you change English copy, update its key in `ZH` too. A text node can also carry its own Chinese in a `data-zh` attribute on its parent element.
- `cocktailtest/index.html`: the original ten questions and weighted calculation, with a home link and accessible input labels and button state. Chinese by default unless the visitor arrives from an English page; a top-right toggle (or `?lang=en` / `?lang=zh`) switches language. English wording lives in `questionsEn`, so `questions` and the scoring stay identical to the original.
- `assets/quiz.css`: visual integration and responsive quiz layout.
- `tests/fixtures/cocktailtest-original.html`: unmodified source snapshot from `rqguan/cocktailtest`, retrieved 2026-10-18. Do not edit this baseline to make tests pass.
- `tests/quiz.test.mjs`: comparison against original questions/scoring, 512 answer sets, and yes/no state checks.

Keep local asset links relative (`assets/...`, `cocktailtest/`, `../`), not rooted at `/`. Keep the canonical URLs above. For a future Chinese home page, use `zh/index.html`, correct relative links, `lang="zh-CN"`, and reciprocal hreflang links only when that translation exists.

## Brand and image accuracy

The supplied BRAND_BRIEF.md and CODEX_TASK.md are the factual basis. Private source documents and private contact details are not included in this public repository.

Preserve: **Understanding is the Technique. Hospitality is the Purpose.** Do not imply employment at Hope & Sesame, invent degrees, employers, client names, drink recipes, or production responsibilities. Tepache's traditional sugar is **piloncillo**.

The lobby shows the original logo and a portrait; About Enzo has a six-photo album, Drink themes eight drinks on back-bar shelves, and the Fermentation lab and Collaborations pages their research and event photographs. The photo journal includes all 43 unique supplied images; the duplicate Fruit Stand menu appears once. Each image opens its full original frame. Past cocktail menus live in `assets/menus/`: the supplied originals plus `-1600.jpg` display copies used inside the expanded practice entries. Original image files preserve the supplied bytes. Display crops are CSS-only; `assets/thumbs/` holds resized copies for display, never edited or retouched. The two trial edits, `condesa-edited.png` and `bar-shaking-edited.png`, are retained as unused assets; the owner will handle subsequent retouching.

Captions describe visible content without guessing unconfirmed drink names or recipes. Generated and unconfirmed visual references are explicitly identified in a separate section. The Lately poster is a generated design reference, not proof that an event took place. The Piña Colada cover has no invented video link. The original logo, full-frame Japan street portrait, and additional bar-work photograph are now included.

Retain provenance and permission information privately, add accurate alt text and intrinsic dimensions, and visually check desktop/mobile crops. Do not substitute generated portraits or stock photographs as Enzo's work. Only add a video link when its real destination is provided.

## GitHub Pages

Publish from `main` / `/ (root)` in repository **Settings → Pages → Build and deployment → Deploy from a branch**. `.nojekyll` keeps the static sources intact. No third-party hosting or paid service is required.

After every update, wait for the Pages deployment and verify both URLs above: lobby links, each room page's back button and pager, language carry-over between pages (including the quiz and journal), the Bar effects panel and music button, practice disclosures, quiz sliders and yes/no controls, and the link back home. Maximum answers must yield 100%; minimum answers 0%. A successful commit alone does not confirm deployment.

The original `rqguan/cocktailtest` repository is independent and must not be modified by this project.

## Selected project photographs

Midtown Live and Fruit Stand are documented with owner-supplied originals. The owner confirmed business coordination, beverage R&D, and bartending responsibilities for both. Midtown Live's date and drink names come from its supplied poster; Fruit Stand's seven-drink selection comes from its supplied menu. The event-counter image visibly carries a Fruit Stand label. No attendance, sponsorship, or performance claims are inferred.

- `assets/midtown-live.jpg`: original batch 02, photo 01.
- `assets/fruit-stand-menu.jpg`: original batch 02, photo 09 (identical to batch 03, photo 08).
- `assets/fruit-stand-service.jpg`: original batch 03, photo 07.

Earlier retouch experiments are held outside this public repository. The website displays unmodified photographs, with CSS display crops only.

The owner identified the latest Fruit Stand photographs as **As You Wish × WIP × Condesa**. The supplied menu and backdrop retain their original Teapulse branding. No additional partnership terms are inferred. Five original event photographs from batch 04 document conversation, preparation, shaking, and drinks.
