# Enzo Mixology

Static personal website for Enzo, with the original Chinese cocktail self-assessment integrated as a subpage.

- Home: https://rqguan.github.io/bartending/
- Quiz: https://rqguan.github.io/bartending/cocktailtest/
- Photo journal: https://rqguan.github.io/bartending/journal.html

## Local preview and tests

Requires Python 3 for preview and Node.js 18+ for tests. No dependencies or build step.

```sh
python3 scripts/preview.py
# Open http://127.0.0.1:8765/bartending/
node --test tests/quiz.test.mjs
```

Preview deliberately uses `/bartending/` to catch broken project-site paths.

## Editing

- `index.html`: English homepage, factual copy, navigation, practice entries, and contact links. Each section has a stable anchor. Chinese text is marked `lang="zh-CN"`.
- `journal.html`: 32 unique owner-supplied images, grouped by project, drinks, process, and visual references.
- `assets/site.css`: responsive layouts, colors, typography, and photographic presentation.
- `assets/site.js`: progressive mobile menu enhancement; navigation works with JavaScript disabled.
- `cocktailtest/index.html`: the original ten questions and weighted calculation, with a home link and accessible input labels and button state.
- `assets/quiz.css`: visual integration and responsive quiz layout.
- `tests/fixtures/cocktailtest-original.html`: unmodified source snapshot from `rqguan/cocktailtest`, retrieved 2026-10-18. Do not edit this baseline to make tests pass.
- `tests/quiz.test.mjs`: comparison against original questions/scoring, 512 answer sets, and yes/no state checks.

Keep local asset links relative (`assets/...`, `cocktailtest/`, `../`), not rooted at `/`. Keep the canonical URLs above. For a future Chinese home page, use `zh/index.html`, correct relative links, `lang="zh-CN"`, and reciprocal hreflang links only when that translation exists.

## Brand and image accuracy

The supplied BRAND_BRIEF.md and CODEX_TASK.md are the factual basis. Private source documents and private contact details are not included in this public repository.

Preserve: **Understanding is the Technique. Hospitality is the Purpose.** Do not imply employment at Hope & Sesame, invent degrees, employers, client names, drink recipes, or production responsibilities. Tepache's traditional sugar is **piloncillo**.

The homepage uses the owner's original Fruit Stand work photograph, with additional photographs in the project, practice, research, and writing sections. The photo journal includes all 32 unique supplied images; the duplicate Fruit Stand menu appears once. Each image opens its full original frame. Display crops are CSS-only; the published image files preserve the supplied bytes.

Captions describe visible content without guessing unconfirmed drink names or recipes. Generated and unconfirmed visual references are explicitly identified in a separate section. The Lately poster is a generated design reference, not proof that an event took place. The Piña Colada cover has no invented video link. The Japan street portrait and standalone original logo are still pending.

Retain provenance and permission information privately, add accurate alt text and intrinsic dimensions, and visually check desktop/mobile crops. Do not substitute generated portraits or stock photographs as Enzo's work. Only add a video link when its real destination is provided.

## GitHub Pages

Publish from `main` / `/ (root)` in repository **Settings → Pages → Build and deployment → Deploy from a branch**. `.nojekyll` keeps the static sources intact. No third-party hosting or paid service is required.

After every update, wait for the Pages deployment and verify both URLs above: homepage navigation, mobile menu, practice disclosures, quiz sliders and yes/no controls, and the link back home. Maximum answers must yield 100%; minimum answers 0%. A successful commit alone does not confirm deployment.

The original `rqguan/cocktailtest` repository is independent and must not be modified by this project.

## Selected project photographs

Midtown Live and Fruit Stand are documented with owner-supplied originals. The owner confirmed business coordination, beverage R&D, and bartending responsibilities for both. Midtown Live's date and drink names come from its supplied poster; Fruit Stand's seven-drink selection comes from its supplied menu. The event-counter image visibly carries a Fruit Stand label. No attendance, sponsorship, or performance claims are inferred.

- `assets/midtown-live.jpg`: original batch 02, photo 01.
- `assets/fruit-stand-menu.jpg`: original batch 02, photo 09 (identical to batch 03, photo 08).
- `assets/fruit-stand-service.jpg`: original batch 03, photo 07.

AI retouch experiments are held outside this public repository; they are not used as documentary photographs.

The owner identified the latest Fruit Stand photographs as **As You Wish × WIP × Condesa**. The supplied menu and backdrop retain their original Teapulse branding. No additional partnership terms are inferred. Five original event photographs from batch 04 document conversation, preparation, shaking, and drinks.
