# Next.js version (React + Tailwind + GSAP)

Same animation as the vanilla build, ported to **Next.js 14 (App Router) + React 18 + Tailwind CSS + GSAP (npm)**.

```bash
cd nextjs-version
npm install
npm run dev            # http://localhost:3000
```

## Build / host on GitHub Pages
```bash
NEXT_PUBLIC_BASE_PATH=/<repo-name> npm run build   # static export → out/
```
Deploy the `out/` folder (e.g. push it to a `gh-pages` branch). Without a base path (`npm run build`) it works on any root domain / Vercel.

- `components/Hero.jsx` – markup (JSX)
- `lib/hero.js` – animation engine (GSAP intro + scroll-progress engine, with cleanup)
- `app/globals.css` – Tailwind directives + hero styles
