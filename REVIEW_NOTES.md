# Refinement review — 17 October 2026

## Delivered

Preserved the existing React/TypeScript/Vite site and Midnight Indigo visual identity. Reworked hierarchy, readable 14–16px body text, project cards, controls and a dated career timeline. English now defaults; Chinese remains available.

The hero states Junior Full Stack Developer, hands-on web/mobile experience and an independently built Sales Leads CRM, with projects/resume/contact actions. Experience uses the user-supplied company correction InnovatePro Sdn Bhd and preserves Apr 2026–Present; the other three role dates are unchanged.

Four featured projects: Sales Leads CRM, collaborative Client Portal UI/UX Revamp, React Native messaging app, and Conference Website & Stripe. The latter two were selected from existing project records for mobile/API experience and freelance delivery respectively. Six other projects remain compact and grouped. Existing filters retain 10 all / 8 web / 2 mobile.

A reusable native details component contains nine case topics for all four featured projects, with each project's full original contributions/outcome preserved. Notes describe documented scope only; no database schema, duplicate algorithm, security mechanism or performance metric is invented. The portal is explicitly an HTML/CSS/JavaScript team prototype.

Motion includes one-time hero text entrance, image pointer depth, scroll-linked project perspective/previews/progress, a desktop chapter navigator with current-case tracking, section reveals and footer movement. GSAP contexts/listeners/observers clean up, and reduced-motion queries disable movement. Filtering and language changes do not replay the hero.

Eleven active images were encoded to WebP (source originals retained). Removed unused neon background references from active CSS so Vite no longer bundles the 2.18MB background image.

## Executed checks

- Full ESLint: `node node_modules/eslint/bin/eslint.js .` — passed, zero errors/warnings. Fixed legacy texture-effect/ref issues and WebGL availability state initialization found in the baseline.
- TypeScript: `node node_modules/typescript/bin/tsc -b` — passed.
- Tests: `node --test scripts/*.test.mjs` — 13 passed, 0 failed. Seven cover the current portfolio/content/filter/assets/contrast/featured ownership; six include retained camera-path math plus static rendering and archived asset checks. The retained world-camera tests are not proof that the current page uses that older world scene.
- Production Vite build — passed.
- Standalone build — passed, with its documented larger single-script tradeoff.
- Browser QA at 1280x900, 768x1024 and 375x812: visually reviewed hero, projects, career and contact; no horizontal page overflow. Corrected an inherited grid-column rule that initially squeezed mobile featured cards into two columns.
- Web/Mobile/All filters returned 8/2/10 cards. Both language switches retained ten projects and updated document language.
- CRM details opened by click and closed using Enter with focus on its summary. Nine numbered topics were present.
- Project anchor navigation and desktop current-case highlighting worked. Header and contact navigation worked.
- Copy email showed `Email copied.`; FAQ expanded. Existing mailto/phone/GitHub/resume links retained.
- Resume request returned HTTP 200, application/pdf, 90,007 bytes; PDF header also checked by tests.
- Desktop 3D toggle removed the canvas while preserving all ten projects, then re-enabled it. At 375px there was no canvas and the complete content was usable.
- A fresh reload of the final dev page showed no new console errors during final navigation. Earlier dev HMR temporarily reported changed hook count while the motion hook was being edited; full reload resolved it.

## Files changed

| Area | Files |
| --- | --- |
| Page and content | src/CreativePortfolio.tsx, src/data/referenceContent.ts, index.html |
| Reusable project views | src/components/PortfolioProject.tsx, src/components/ProjectCaseStudy.tsx, src/data/caseStudyDetails.ts |
| Layout and motion | src/styles/recruiter.css, src/styles/creative.css, src/main.tsx, src/useCreativeMotion.ts |
| Baseline lint repairs | src/three/WorldScene.tsx, src/three/InterfacePlate.tsx, src/components/WorldExperience.tsx |
| Assets/tests/docs | public/assets/*.webp, scripts/*.test.mjs, package.json, README.md, IMPLEMENTATION_PLAN.md, REVIEW_NOTES.md |
| Generated | dist/, standalone/, qa/recruiter-*.png |

## Remaining limits

- The avatar is a 2D transparent image with depth effects. No rigged avatar model was supplied. The existing laptop remains actual R3F 3D.
- Reduced-motion behavior is covered by media-query implementation and static-render checks; the browser tooling did not expose OS motion emulation, so a live OS reduced-motion change was not tested. Actual GPU loss and real phones were not simulated; mobile static fallback and the 3D off path were exercised.
- Vite reports the lazy Three.js chunk at about 892kB before compression (about 242kB gzip). The portable standalone combines scripts at about 1.25MB. Builds pass with advisory size warnings and an existing stale Browserslist-data notice.
- No Lighthouse/real-device performance measurement, screen-reader session, live payment transaction or private CRM functionality test was performed. Supplied project screenshots and authorized links were preserved; third-party live sites were not retested.
- The original PDF resume has not been rewritten. Case notes rely on the user's supplied scope and existing portfolio records, since internal project code is not included.
- No public deployment was performed.

## Scroll text reveal update

Main section headings, introductions, project titles/descriptions/roles/tags, experience text and contact text now fade in with a short upward movement and staggered timing as they enter the viewport. Each group plays once per render. Already visible groups are not hidden again when language or project filters change. Focus entering a group completes its reveal immediately. No CSS hides content before JavaScript; reduced-motion views remain static and readable.

Validation: TypeScript and targeted motion-hook ESLint passed; production and standalone builds regenerated. Browser verification observed an offscreen CRM title at opacity 0, then opacity 1 after project navigation/scroll. Updated source ZIP includes this motion change.

## Expanded detail image cleanup

Featured cases now hide the outer card preview while details are open, using one centered reading column (maximum 860px). The inline case screenshot remains, so there is only one image in the expanded view. Collapsing restores the normal card preview. Browser checked the open/closed states; production and standalone builds passed. Screenshot: qa/recruiter-clean-details.png.

## Restore left-content / right-image layout

Restored the two-column featured case layout on desktop, including when details are expanded. Removed the duplicated inline detail image, keeping one preview on the right and an optional link to the full screenshot. Small screens retain the responsive stacked layout. Browser verified content in grid column 1, preview in column 2, and exactly one image per expanded CRM card. TypeScript, production and standalone builds passed.

## Floating back-to-top arrow

Replaced the footer text link with an accessible 52px circular upward-arrow control using the existing SVG icon component. The arrow floats gently by 7px over a 2.6-second loop; hovering/focusing pauses it, and reduced motion disables it. The existing #top anchor action is preserved. TypeScript, targeted ESLint, production and standalone builds passed. Browser confirmed the SVG/animation and tested the return-to-top action. Screenshot: qa/recruiter-floating-arrow.png.

## Animated water footer — 18 October 2026

Replaced the decorative footer name with a real locally rendered GIF: white/silver water reflections within the TAN ZE QUAN lettering, with a subtle indigo base and matching #111111 background. The 1280x210 GIF contains 72 changing frames at 50ms each, loops infinitely over 3.6 seconds and is approximately 3.04MB. It loads lazily; dimensions are reserved. A picture source selects a static WebP for reduced-motion preferences. Existing back-to-top arrow and footer links remain intact. Render source: scripts/render-footer-water.py; no new frontend dependencies.

Verified changing GIF frames, infinite loop metadata, successful browser image loading and no horizontal overflow at the normal browser viewport. TypeScript, targeted ESLint, seven active portfolio tests and production/standalone builds passed. Browser capture: qa/recruiter-water-footer.png.

## Latest resume replacement — 18 October 2026

Replaced public/Tan_Ze_Quan_Resume.pdf with the user-supplied CV-zequan-latest.pdf (61,878 bytes), preserving both existing download URLs. Updated the dist and standalone copies. All three files were SHA256-verified against the supplied original. Website content was not rewritten from the PDF.
