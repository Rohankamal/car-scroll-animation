# Scroll-Driven Hero Section Animation

Recreation of a scroll-based hero animation (car driving across the screen as you scroll) using **HTML, CSS, JavaScript, GSAP and Tailwind CSS**.

- **Live demo:** `https://<your-username>.github.io/<repo-name>/`
- **Repository:** `https://github.com/<your-username>/<repo-name>`

## Features
- Hero fills the first screen: letter-spaced headline `W E L C O M E  I T Z F I Z Z` plus four impact stats (58%, 23%, 27%, 40%)
- **Top-view supercar** (hand-drawn SVG) drives left → right as you scroll, and reverses when you scroll back
- **Reveal behind the car:** the outlined headline and stat cards light up with a neon light trail and scanner edge as the car passes; stats count up (and replay if you drive back)
- **Load animation (GSAP):** headline letters flip in with a stagger → stats pop in one by one → the car drives in from off-screen
- **Scroll-tied motion:** scroll progress is eased with a lerp, then drives car position, scrolling road lanes, two parallax particle layers, speed lines, speedometer, headlight beams, underglow, yaw/tilt and a top progress bar
- Works inside embedded preview frames too: if native scroll is unavailable it switches to wheel / touch / keyboard virtual scroll automatically
- Performance: only `transform`, `opacity` and `clip-path` are animated; layout is measured on resize only
- Responsive + `prefers-reduced-motion` support

## Structure
```
index.html        markup + Tailwind layout utilities
css/style.css     theme, sticky stage, road/car styles
js/main.js        intro (GSAP) + scroll-progress engine
nextjs-version/   same hero ported to Next.js + React + Tailwind + GSAP (see its README)
.nojekyll
```

## Run locally
Just open `index.html` in a browser (or `npx serve .`).

## Deploy to GitHub Pages
1. Create a public GitHub repo and push this folder to `main` (or upload via the GitHub web UI).
2. Repo → **Settings → Pages → Source: Deploy from a branch → `main` / `(root)`** → Save.
3. Live at `https://<username>.github.io/<repo>/`.

```bash
git init && git add . && git commit -m "Scroll-driven hero animation"
git branch -M main
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
```

## Tech stack
HTML · CSS · JavaScript · GSAP · Tailwind (vanilla build) — plus Next.js / React version in `nextjs-version/`.
