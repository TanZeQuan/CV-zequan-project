# Tan Ze Quan — Junior Full Stack Developer Portfolio

React + TypeScript + Vite. Midnight Indigo theme, English by default with Chinese switching, ten preserved projects, four featured case studies and a real React Three Fiber laptop. No new dependencies were added for this refinement.

## Open the website

For a quick local preview, double-click `standalone/index.html`. Keep its assets folder beside the HTML file. Use `dist/` for hosting over HTTP.

For development, install Node.js, extract this ZIP, open a terminal in the folder containing `package.json`, then run:

```sh
npm install
npm run dev
```

Open the address printed in the terminal. Stop the server with Ctrl+C.

```sh
npm test
npm run lint
npm run build
npm run build:standalone
```

## Current implementation

- `src/CreativePortfolio.tsx`: page composition, language, navigation, filters and contact actions.
- `src/components/PortfolioProject.tsx`: featured and compact project cards.
- `src/components/ProjectCaseStudy.tsx`: native keyboard-accessible case detail sections.
- `src/data/referenceContent.ts`: all bilingual project, experience and skill records.
- `src/data/caseStudyDetails.ts`: four featured selections and their case notes.
- `src/styles/recruiter.css`: readable type, spacing, responsive cards and timeline refinement; layered over the existing structural/theme styles.
- `src/useCreativeMotion.ts`: scoped GSAP entrance, project chapter tracking, scroll progress, parallax and pointer depth.
- `src/CreativeSculpture.tsx` / `src/PrismScene.tsx`: the existing R3F laptop, visibility control and WebGL fallback.

The avatar is a transparent **2D image**, with restrained pointer and scroll depth. It is not a rigged 3D character. The laptop is real 3D and loads on supported desktop screens from 800px, with no reduced-motion preference. All portfolio content remains usable without WebGL.

Active avatar and project images use optimized WebP files. Original PNG images are retained in the source. FX8 and LIVI NeoAsia intentionally have no website links. MyUbiPay retains https://www.myubi.my/. Internal CRM/portal demos and source are not public. Existing PDF resume is preserved unchanged.

## Verification

See `REVIEW_NOTES.md` for executed checks and limitations, `IMPLEMENTATION_PLAN.md` for the scope, and `qa/recruiter-*.png` for current browser captures. Older spatial components are retained as historical source; App.tsx loads CreativePortfolio.
