export const Navi = {
  async roles(){
    const res = await fetch('./data/roles.json');
    return await res.json();
  },

  view(){
    return `
      <section class="section">
        <h2>Build Your Next Step (NAVI)</h2>
        <p>Based on your NOVA snapshot, NAVI drafts resumes, cover letters, and suggests roles/training.</p>
        <div class="controls">
          <button id="btnResume" class="btn primary">Draft Resume</button>
          <button id="btnLetter" class="btn ghost">Draft Cover Letter</button>
        </div>
        <div id="draftArea" class="section"></div>
        <div class="section">
          <h3>Suggested Roles</h3>
          <div id="rolesList">Loading…</div>
        </div>
        <div class="actions">
          <a class="btn ghost" href="#/result">Back</a>
          <a class="btn primary" href="#/plans">See Plans</a>
        </div>
      </section>
    `;
  },

  async mount(state){
    // Simple heuristic mapping
    const draftArea = document.getElementById('draftArea');
    const rolesList = document.getElementById('rolesList');
    const btnResume = document.getElementById('btnResume');
    const btnLetter = document.getElementById('btnLetter');
    const roles = await this.roles();

    function summarizeTraits(){
      const top = [...state.selectedTraits].slice(0,8);
      return top.length ? top.join(', ') : 'adaptable, reliable, learner';
    }

    btnResume.addEventListener('click', ()=>{
      const summary = summarizeTraits();
      state.resumeDraft = `SUMMARY
Purpose-driven professional with strengths in ${summary}.

EXPERIENCE
- Role Title — Company (YYYY–YYYY)
  • Quantified accomplishment using top traits.
  • Project or impact statement.
  • Tools & tech: …

EDUCATION
- School / Training — Focus

SKILLS
- ${summary}`;
      draftArea.textContent = state.resumeDraft;
    });

    btnLetter.addEventListener('click', ()=>{
      const summary = summarizeTraits();
      state.coverLetterDraft = `Dear Hiring Manager,

I’m excited to apply for the role and bring strengths in ${summary}. I thrive in environments that value purpose, integrity, and measurable impact. I would love to discuss how I can contribute.

Sincerely,
Your Name`;
      draftArea.textContent = state.coverLetterDraft;
    });

    // Role suggestions influenced by traits (very lightweight demo)
    const t = new Set([...state.selectedTraits].map(s => s.toLowerCase()));
    const ranked = roles.map(r => {
      const hits = r.signals.filter(s => t.has(s.toLowerCase())).length;
      return { ...r, score: hits };
    }).sort((a,b)=> b.score - a.score);

    rolesList.innerHTML = ranked.slice(0,6).map(r => `
      <div class="card">
        <h4>${r.title}</h4>
        <p>${r.summary}</p>
        <p><small>Signals: ${r.signals.join(', ')}</small></p>
      </div>
    `).join('');
  }
};
