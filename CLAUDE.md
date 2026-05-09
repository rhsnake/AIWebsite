# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A plain HTML/CSS/JS static awareness site for the **Stop Killing Games** consumer rights initiative.
No build step, no framework, no package manager — open any `.html` file directly in a browser.

## Structure

```
index.html        Home — hero, stats bar, problem overview, CTA
about.html        About — founder (Ross Scott), mission, four goals as cards
milestones.html   Milestones — vertical timeline of key events with Schema.org Event markup
join.html         Join — support form (UI only, no backend)
styles.css        All shared styles; CSS custom properties drive light/dark theming
main.js           Theme toggle (localStorage key: skg-theme), active nav link, mobile nav
```

## Architecture

**Theming** — `data-theme` attribute on `<html>`. `main.js` reads `localStorage` and applies the attribute before paint to avoid flash. All colours are CSS custom properties under `:root` and `[data-theme="dark"]`.

**Navigation** — identical nav block copy-pasted across all four pages. Active link is set by `main.js` matching `window.location.pathname` to `href`. Mobile nav toggled via `.is-open` class on `.nav-links`.

**Schema.org** — each page has a `<script type="application/ld+json">` block. `index.html` declares `WebSite` + `Organization`. `milestones.html` uses `ItemList` of `Event` nodes. `join.html` uses `ContactPage`.

**Fonts** — Cormorant Garamond (display/headings) + DM Sans (body), loaded from Google Fonts.

## When editing

- Add a new page: copy the nav and footer blocks from any existing page, update the `<title>`, `<meta name="description">`, and Schema.org JSON-LD, then add the `<a>` to the nav in **all four** existing pages.
- Change the accent colour: update `--accent` and `--accent-hover` in both `:root` and `[data-theme="dark"]` in `styles.css`.
- The form on `join.html` is intentionally non-functional (no `action` target). Do not add backend wiring without explicit instruction.
