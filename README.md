# DC Power — Frontend (React + Vite + GSAP)

## Run it

```bash
npm install
npm run dev
```

Opens on `http://localhost:5173`.

## Structure

```
src/
  components/
    Navbar.jsx / .css
    Hero.jsx / .css      — GSAP-animated circuit trace (sun -> converter -> house)
    Services.jsx / .css  — scroll-triggered reveal via GSAP ScrollTrigger
    About.jsx / .css
    Gallery.jsx / .css   — placeholder project tiles, swap for real photos
    Contact.jsx / .css   — form UI only, see below to make it actually send
    Footer.jsx / .css
  App.jsx
  index.css              — design tokens (colors, fonts) live here
```

## Making the contact form actually send somewhere

Right now `Contact.jsx` just shows a success message locally — nothing is
sent anywhere. Easiest options, roughly in order of effort:

1. **Formspree / Getform / Web3Forms** — free tiers, no backend needed. Sign
   up, get a form endpoint URL, and swap the `handleSubmit` function in
   `Contact.jsx` to `fetch()` that URL instead of just setting state.
2. **Netlify Forms** — if you deploy to Netlify, add `data-netlify="true"` to
   the `<form>` and a hidden `form-name` input; Netlify captures submissions
   automatically.
3. **Your own API** — build a small backend (Node/Express, Java/Spring, etc.)
   with a POST endpoint and point `fetch()` at it.

## Build for production

```bash
npm run build
```

Outputs a static bundle to `dist/` — deploy that to Netlify/Vercel/Cloudflare
Pages, etc.

## Still placeholder

Stats in the hero, gallery project photos/locations, contact email & phone,
and the "fact list" numbers in the About section are all sample content —
replace with your real numbers before launch.
