export const Reflection = {
  personas: [
    {
      key: 'correcting_course',
      heading: '1) I’m in a field that doesn’t match my purpose',
      body: `You’ve built valuable skills, but your NOVA signals point elsewhere (e.g., from admin → operations, from sales → product, from one industry into another). We’ll help you realign with a stepwise plan.`,
      boosts: ['Process-Focused','Strategic','Planner','Quality-Focused','Customer-Obsessed','Systems Thinker']
    },
    {
      key: 'partly_aligned',
      heading: '2) I’m partly aligned and want to go deeper',
      body: `Some of what you do already fits your purpose. We’ll help you sharpen focus, elevate projects, and move into higher‑fit roles with measurable wins.`,
      boosts: ['Results-Driven','Mentor','Servant-Leader','Organizer','Design Thinker','Data-Driven']
    },
    {
      key: 'starting_fresh',
      heading: '3) I’m just starting out and want to get it right',
      body: `Launch in the right direction. Align training, projects, and first roles to your purpose from the start. If you’re patient and willing to learn, we’ll build momentum fast.`,
      boosts: ['Learner','Curious','Growth Mindset','Hands-On','Coach','Builder']
    },
    {
      key: 'lost_clarity',
      heading: '4) I feel lost and unsure where I belong',
      body: `It’s okay to be unclear. We’ll translate your traits into clear options and first steps, then build momentum together—heart first, then head.`,
      boosts: ['Researcher','Listener','Facilitator','Empathetic','Analytical','Storyteller']
    }
  ],

  view(state){
    const note = state.reflection?.note || '';
    const cards = this.personas.map(p => `
      <div class="reflect-card card">
        <h3>${p.heading}</h3>
        <p>${p.body}</p>
        <div class="actions">
          <button class="btn primary" data-choose="${p.key}">Continue →</button>
        </div>
      </div>
    `).join('');

    return `
      <section class="section">
        <div class="progress"><small>Step 1 of 3 — Reflection</small></div>
        <h2>Where are you in your journey?</h2>
        <p class="subtitle">This is personal. Take a moment to reflect — pick the path that best describes you. If you’re not ready to choose, you can skip and come back later.</p>

        <div class="coach-tip">
          <strong>Heart first, then head.</strong> We’ll begin with where you truly are, then we’ll translate it into clear options and steps.
        </div>

        <div class="cards4" id="reflectContainer">${cards}</div>

        <div class="journal section">
          <label for="reflectNote"><strong>Optional journal:</strong> What do you want to change? What would “more aligned” feel like?</label>
          <textarea id="reflectNote" rows="4" placeholder="Write a sentence or two…">${note}</textarea>
        </div>

        <div class="actions">
          <a class="btn ghost" href="#/plans">Skip reflection — see plans</a>
        </div>

        <p class="reassure"><small>You haven’t lost time — every step brought you to clarity. The next step is yours.</small></p>
      </section>
    `;
  },

  mount(state){
    const container = document.getElementById('reflectContainer');
    const noteEl = document.getElementById('reflectNote');
    if(!container) return;

    container.addEventListener('click', (e)=>{
      const btn = e.target.closest('[data-choose]');
      if(!btn) return;
      const key = btn.getAttribute('data-choose');
      const persona = this.personas.find(p => p.key === key);
      state.reflection = { persona: key, boosts: persona.boosts, note: (noteEl?.value || '').trim() };
      // proceed to NOVA
      location.hash = '#/result';
    });

    if(noteEl){
      noteEl.addEventListener('input', ()=>{
        state.reflection = state.reflection || {};
        state.reflection.note = noteEl.value;
      });
    }
  }
};
