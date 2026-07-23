# STRATEGY BOT 369 — Deployment Guide

This package has two parts now, not one file:

- `index.html` — the dashboard and strategy engine (runs in your browser).
- `netlify/functions/deriv-token-exchange.js` — the backend piece. This is what
  securely swaps your Deriv login code for a real access token. Deriv's own docs
  require this step to happen on a server, never in the browser, which is why a
  single HTML file alone can no longer do the full login.

**Important:** because there's now a backend function, drag-and-drop hosting
(like Netlify Drop) will NOT work — it only serves static files. You need a
proper site deploy so Netlify actually runs the function. The easiest way to do
that entirely from a browser, no terminal required, is via GitHub + Netlify:

## Step 1 — Put the files on GitHub

1. Go to [github.com](https://github.com) and log in (or create a free account).
2. Click the **+** in the top right → **New repository**.
3. Name it (e.g. `strategy-bot-369`), keep it **Public** or **Private** (either
   works), then click **Create repository**.
4. On the new repo's page, click **Add file → Upload files**.
5. Drag in all three items from this package, keeping the folder structure:
   - `index.html`
   - `netlify.toml`
   - the whole `netlify` folder (with `functions/deriv-token-exchange.js` inside it)
6. Scroll down and click **Commit changes**.

## Step 2 — Connect the repo to Netlify

1. Go to [app.netlify.com](https://app.netlify.com) and log in (or sign up free).
2. Click **Add new site → Import an existing project**.
3. Choose **GitHub**, authorize Netlify if asked, then pick the repo you just created.
4. Netlify should auto-detect the settings from `netlify.toml` — leave them as is.
5. Click **Deploy site**.
6. After a minute you'll get a live URL like `https://your-site-name.netlify.app`.

That URL is now your bot's real address — open it in your browser to use it.

## Step 3 — Register your Deriv app with this exact URL

1. Go to `https://developers.deriv.com` → your app (or register a new one).
2. Set the app's **Redirect URI** to your Netlify URL exactly as shown in the
   address bar (same `https://`, no missing/extra trailing slash).
3. Copy the app's **client_id / App ID** — paste that into the **Deriv-App-ID**
   field in the bot.

## Step 4 — Log in

Open your Netlify URL, enter the App ID, click **Login with Deriv**, sign in,
and you should land back on the bot fully authenticated — live tick feed and
trading both work from there.

## Making future changes

Any time you (or I) edit `index.html` or the function file, upload the new
version to the same GitHub repo (**Add file → Upload files**, overwrite) —
Netlify redeploys automatically within about a minute, at the same URL.
