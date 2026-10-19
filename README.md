# Enzo Mixology

Static personal website for Enzo, with the original Chinese cocktail self-assessment integrated as a subpage.

- Home: https://rqguan.github.io/bartending/
- Quiz: https://rqguan.github.io/bartending/cocktailtest/

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
- `assets/site.css`: responsive layouts, colors, typography, and decorative CSS artwork.
- `assets/site.js`: progressive mobile menu enhancement; navigation works with JavaScript disabled.
- `cocktailtest/index.html`: the original ten questions and weighted calculation, with a home link and accessible input labels and button state.
- `assets/quiz.css`: visual integration and responsive quiz layout.
- `tests/fixtures/cocktailtest-original.html`: unmodified source snapshot from `rqguan/cocktailtest`, retrieved 2026-10-18. Do not edit this baseline to make tests pass.
- `tests/quiz.test.mjs`: comparison against original questions/scoring, 512 answer sets, and yes/no state checks.

Keep local asset links relative (`assets/...`, `cocktailtest/`, `../`), not rooted at `/`. Keep the canonical URLs above. For a future Chinese home page, use `zh/index.html`, correct relative links, `lang="zh-CN"`, and reciprocal hreflang links only when that translation exists.

## Brand and image accuracy

The supplied BRAND_BRIEF.md and CODEX_TASK.md are the factual basis. Private source documents and private contact details are not included in this public repository.

Preserve: **Understanding is the Technique. Hospitality is the Purpose.** Do not imply employment at Hope & Sesame, invent degrees, employers, client names, drink recipes, or production responsibilities. Tepache's traditional sugar is **piloncillo**.

The owner-supplied kitchen work photograph is included in About at `assets/kitchen-work.jpg`, with its complete original frame. It is a process photograph, not evidence of a specific recipe or client project. The Piña Colada thumbnail has been received and is awaiting its video URL. Other drink and process photographs are archived separately until their names and context are confirmed. The Japan street portrait and standalone original logo are still pending; the logo currently appears only within a supplied event poster. The coupe motif is decorative CSS artwork; the typographic writing panel is an editorial graphic, not a photographed publication or original logo.

When originals arrive: save optimized copies in `assets/images/`, retain provenance and permission information privately, add accurate alt text and intrinsic dimensions, and visually check desktop/mobile crops. Do not substitute generated portraits or stock photographs as Enzo's work. A real portrait can replace `.hero-art`; the layout remains responsive. Only add a video link when its real destination is provided.

## GitHub Pages

Publish from `main` / `/ (root)` in repository **Settings → Pages → Build and deployment → Deploy from a branch**. `.nojekyll` keeps the static sources intact. No third-party hosting or paid service is required.

After every update, wait for the Pages deployment and verify both URLs above: homepage navigation, mobile menu, practice disclosures, quiz sliders and yes/no controls, and the link back home. Maximum answers must yield 100%; minimum answers 0%. A successful commit alone does not confirm deployment.

The original `rqguan/cocktailtest` repository is independent and must not be modified by this project.
