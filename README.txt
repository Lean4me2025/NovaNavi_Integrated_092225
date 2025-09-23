Nova + Navi — Welcome & Navigation Patch
Date: 2025-09-23

This patch improves the Welcome page (without reducing content), fixes nav clicks (incl. "Start with NOVA"),
and adds the credibility intro block above the Aligned Roles section.

FILES INCLUDED
- snippets/welcome_section.html         -> Drop-in section for the Welcome page
- snippets/results_intro.html           -> Drop-in intro block for results page (above Aligned Roles)
- assets/css/welcome_patch.css          -> Styles for the Welcome block
- assets/js/nav_patch.js                -> Safe, SPA-aware click handler for nav + Start with NOVA

INSTRUCTIONS (2–3 minutes)

1) BACKUP
   - Make a quick backup of your current files (especially your landing/welcome page and results page).

2) CSS
   - Add the following line in your global HTML <head> (AFTER your main stylesheet link is fine):
       <link rel="stylesheet" href="assets/css/welcome_patch.css">

3) HTML — WELCOME SECTION
   - Open your Welcome/Landing page file (e.g., index.html or home.html).
   - Find the current Welcome/hero block and replace it with the contents of:
       snippets/welcome_section.html

   Note: It's class-scoped (.welcome ...) and won't collide with your existing styles.

4) JS — NAVIGATION
   - Just before </body>, add:
       <script src="assets/js/nav_patch.js"></script>

   This makes the following buttons and links work consistently:
   - #startWithNova
   - any element with data-route="..."
   - any <a href="#..."> hash links

   It uses your SPA's window.navigateTo(route) if available; otherwise it falls back to hash routing.

5) RESULTS PAGE — CREDIBILITY INTRO
   - Open your Results page (where the Aligned Roles grid/list renders).
   - Insert the contents of snippets/results_intro.html immediately ABOVE the Aligned Roles list/grid.

6) OPTIONAL — VERIFY IDs/ROUTES
   - If your Start with NOVA button uses a different id, update the id in welcome_section.html AND nav_patch.js
     (default is "startWithNova").
   - If your route key for the discover page isn’t "discover", edit nav_patch.js (search for 'discover').

That’s it. Deploy and test. If any single button still doesn’t click, tell me which one and I’ll zero in.
