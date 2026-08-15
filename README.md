# NoTime

A distraction-free clock, Pomodoro timer, and productivity hub — built with React, TypeScript, Tailwind CSS v4, and shadcn-style components.

## What's inside

Every page has a shared sidebar + top bar shell and is fully wired to real, working state (persisted in `localStorage`, so your data survives refreshes):

- **Clock** (`/`) — a live, ticking local clock, a strip of world-city mini clocks, today's focus/session/task stats, and a quick-start Pomodoro card.
- **Pomodoro** (`/pomodoro`) — a real countdown timer (Focus / Short Break / Long Break) with start, pause, and reset. Every completed or abandoned session is logged automatically and feeds the Stats and Insights pages. Includes a compact task list.
- **Stats** (`/stats`) — a real bar chart (Recharts) of your focused minutes, switchable between Daily / Weekly / Monthly, plus totals, streaks, and your busiest day — all computed from your actual session history.
- **World Clock** (`/world-clock`) — live times for any city, computed with the native `Intl` timezone API (not hardcoded offsets), a searchable "add city" list, and a dotted world map with live day/night markers.
- **Calendar** (`/calendar`) — a real month grid. Click any day to see the Pomodoro sessions logged on it and your open tasks.
- **Tasks** (`/tasks`) — full task management: add, complete, delete, and organize into Today / Upcoming / Someday lists, with a live completion progress bar.
- **Insights** (`/insights`) — a 14-day focus trend chart plus derived stats (completion rate, best streak, average session length) with plain-language takeaways.
- **Settings** (`/settings`) — light/dark/system appearance, 6 accent colors, 12h/24h time format, and adjustable Pomodoro durations, all applied live across the app.

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

## Build for production

```bash
npm run build
npm run preview   # serve the production build locally to double check
```

The production build is written to `dist/`, ready to deploy to any static host (Vercel, Netlify, Cloudflare Pages, S3, etc).

## Tech stack

- **React 19 + TypeScript** via Vite
- **React Router** for the 8 pages
- **Tailwind CSS v4** (CSS-first `@theme` tokens — see `src/index.css` for the full palette)
- **shadcn-style primitives** hand-built in `src/components/ui` (Button, Card, Switch, Progress, Input, Badge, Checkbox) — no external UI kit dependency, so you can restyle freely
- **Recharts** for the Stats bar chart and Insights trend chart
- **lucide-react** for icons
- Native **`Intl.DateTimeFormat`** for all timezone math (no hardcoded UTC offsets, so it's correct year-round including DST)
- **`localStorage`** (via a small `useLocalStorage` hook) for settings, tasks, and Pomodoro session history — no backend required

## Project structure

```
src/
  components/
    layout/        Sidebar, Topbar, AppShell (the shared shell every page renders inside)
    ui/             Hand-built shadcn-style primitives
    WorldMap.tsx    Dotted world map background used on the World Clock page
  hooks/
    useClock.ts     Ticks once a second, returns a live Date
    usePomodoro.ts  Countdown timer state machine + auto session logging
    useLocalStorage.ts
  lib/
    cities.ts       City list with lat/lng + IANA time zones
    format.ts       Time/date formatting + timezone helpers
    utils.ts        `cn()` class-merging helper
  pages/            One file per route
  store/
    AppContext.tsx  Global settings / tasks / session state + persistence
```

## Customizing

- **Rename or re-theme**: colors, radii, and animation timing all live in `src/index.css` under `@theme`. Change `--color-ember` (and the `ACCENTS` array in `AppContext.tsx`) to swap the accent palette.
- **Add a city**: append an entry to `CITIES` in `src/lib/cities.ts` with its IANA time zone and lat/lng.
- **Change default Pomodoro lengths**: edit `DEFAULT_SETTINGS` in `src/store/AppContext.tsx`, or just use the sliders on the Settings page.
