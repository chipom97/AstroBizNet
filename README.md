# AstroBizNet Dashboard — hosting it yourself

Your dashboard was built as a Claude artifact. To run it on your own URL you need
two things: (1) the small build setup below so the code compiles, and (2) a
replacement for Claude's built-in `window.storage` (handled by `src/storage.js`).

---

## ⚠️ Read this first: the storage gotcha

The dashboard saves your tick-offs using `window.storage` — a feature Claude
injects **only inside published artifacts**. Outside Claude it doesn't exist, so
those calls would fail silently.

`src/storage.js` fixes this. By default it uses the browser's **localStorage**,
which means:

- ✅ The board works immediately on any host, no accounts, no backend.
- ⚠️ Ticks are saved **per device / per browser** — they do **NOT** sync between
  you and your teammates.

If you need everyone to see the same board (recommended for your team), see
**"Turning on shared sync"** at the bottom.

---

## File layout

Drop these into your repo so it looks like this:

```
your-repo/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── App.jsx        ← your existing dashboard file, renamed to App.jsx
    ├── main.jsx
    ├── storage.js
    └── index.css
```

Your existing dashboard code (the file you uploaded to GitHub) becomes
`src/App.jsx`. It already ends with `export default function Dashboard()`, so no
code changes are needed — `main.jsx` imports it for you.

---

## Run it locally (one minute)

You need **Node.js 18 or newer** (check with `node -v`).

```bash
npm install
npm run dev
```

Open the URL it prints (usually http://localhost:5173). If the board appears and
you can tick things off, you're ready to deploy.

```bash
npm run build      # produces the /dist folder you deploy
npm run preview    # preview the production build locally
```

---

## Deploy — pick one

### Option A — Vercel (easiest)
1. Push these files to your GitHub repo.
2. Go to vercel.com → **Add New → Project** → import your repo.
3. It auto-detects Vite. Leave the defaults (Build: `npm run build`, Output: `dist`).
4. Click **Deploy**. You get a live URL in ~1 minute. Every future `git push`
   redeploys automatically.

### Option B — Netlify
1. Push to GitHub.
2. netlify.com → **Add new site → Import an existing project** → pick the repo.
3. Build command `npm run build`, publish directory `dist`. Deploy.

### Option C — GitHub Pages
Works, but needs one extra step because the site lives under `/your-repo/`:
1. In `vite.config.js`, uncomment the `base` line and set it to `'/your-repo-name/'`.
2. Run `npm run build`, then publish the `dist` folder to a `gh-pages` branch
   (e.g. with the `gh-pages` npm package, or a GitHub Action).

---

## Turning on shared sync (so the whole team shares one board)

localStorage can't sync between people. For a genuinely shared board you need a
tiny (free) database. The quickest is **Supabase**:

1. Create a free project at supabase.com.
2. Make a table called `board` with columns `id` (text, primary key) and
   `data` (jsonb).
3. Copy your project URL and anon key.
4. In `src/storage.js`, follow the commented **Supabase** section — paste your
   URL + key and switch the export. The dashboard code doesn't change.

That's the only piece that needs your hands on real credentials, so once you've
made the Supabase project, send me the table setup and I'll finish wiring it.

> Alternatively: keep the **published Claude artifact** as your live shared board
> (it already syncs for free) and use this self-hosted version only if you want a
> branded public URL. Many teams run both.
