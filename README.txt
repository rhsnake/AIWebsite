================================================================================
  STOP KILLING GAMES — Awareness Website
================================================================================

  A static, multi-page awareness site for the Stop Killing Games consumer
  rights initiative. Built with plain HTML, CSS, and JavaScript — no framework,
  no build tools, no dependencies.

--------------------------------------------------------------------------------
  OVERVIEW
--------------------------------------------------------------------------------

  Stop Killing Games is a global consumer rights campaign founded by Ross Scott
  (Accursed Farms) demanding that video game publishers leave purchased games in
  a playable state after end of service. The European Citizens' Initiative
  crossed one million signatures in October 2024, legally requiring a formal
  response from the European Commission.

  This site exists to spread awareness of the initiative and its goals.

  Official initiative website: https://www.stopkillinggames.com

--------------------------------------------------------------------------------
  PAGES
--------------------------------------------------------------------------------

  index.html        Home
                    Hero section, statistics, problem overview, and call to action.

  about.html        About
                    Founder background (Ross Scott), mission statement, and the
                    four core goals of the initiative.

  milestones.html   Major Milestones
                    Chronological timeline of key events from the 2023 campaign
                    launch through the formal European Commission review in 2025.

  join.html         Join the Initiative
                    Support form for visitors to register interest. UI only —
                    no data is collected or transmitted.

--------------------------------------------------------------------------------
  TECHNICAL DETAILS
--------------------------------------------------------------------------------

  Stack             Plain HTML5 / CSS3 / Vanilla JavaScript
  Fonts             Cormorant Garamond + DM Sans (Google Fonts, loaded via CDN)
  Theming           CSS custom properties; dark/light mode toggled via a button
                    and persisted in localStorage (key: skg-theme)
  Structured Data   Schema.org JSON-LD on every page (WebSite, Organization,
                    Event ItemList, ContactPage)
  Responsive        Mobile-friendly layout with hamburger navigation below 800px

  No build step is required. Open any .html file directly in a browser, or
  serve the directory with any static file server, for example:

      python -m http.server 8000
      npx serve .
      live-server .

--------------------------------------------------------------------------------
  FILE STRUCTURE
--------------------------------------------------------------------------------

  index.html          Home page
  about.html          About page
  milestones.html     Milestones timeline page
  join.html           Join / support form page
  styles.css          Shared stylesheet (all pages)
  main.js             Shared JavaScript (theme, nav, mobile menu)
  README.txt          This file
  .gitignore          Version control exclusions

--------------------------------------------------------------------------------
  DISCLAIMER
--------------------------------------------------------------------------------

  This is an independent awareness site and is not affiliated with, endorsed by,
  or officially connected to the Stop Killing Games initiative or Ross Scott.
  All factual information has been sourced from publicly available records.

================================================================================
