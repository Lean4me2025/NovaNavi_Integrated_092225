NOVA + NAVI Integrated — Deployment Steps
=========================================

1. Create a new GitHub repo
---------------------------
- Go to GitHub and click "New Repository".
- Name it: NovaNavi_Integrated (or similar).
- Leave it blank (no README, .gitignore, or license).

2. Prepare local folder
-----------------------
- Unzip this NovaNavi_Integrated.zip file.
- Open your terminal/command prompt in the unzipped folder.

3. Push to GitHub
-----------------
Run these commands (swap in your repo URL):

    git init
    git add .
    git commit -m "Initial commit - NOVA + NAVI integrated"
    git branch -M main
    git remote add origin https://github.com/YOURUSERNAME/NovaNavi_Integrated.git
    git push -u origin main

4. Deploy on Vercel (recommended)
---------------------------------
- Go to https://vercel.com and log in.
- Click "New Project" → import your repo.
- Framework preset: choose "Other".
- Root directory: leave default (/).
- No build step needed.
- Click Deploy.

5. Test Live
------------
- Go to https://YOURPROJECT.vercel.app#/nova → select traits
- Go to #/result → snapshot summary
- Go to #/navi → resume + cover letter drafts
- Go to #/plans → Payhip embeds (Starter & Pro Suite pre-wired, others placeholders)

Notes
-----
- Update Payhip IDs in index.html and app.js if needed.
- All data is stored in-memory (client-side).
- For persistent user data, you can later connect a backend.

Enjoy your integrated NOVA + NAVI app!
