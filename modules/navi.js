export const Navi = {
  view(){
    return `
      <section class="section">
        <h2>Build Your Path (NAVI)</h2>
        <div id="focusRole"></div>

        <div class="stair" id="strategyStair">
          <!-- Steps render here -->
        </div>

        <div class="controls">
          <button id="btnResume" class="btn primary">Draft Resume</button>
          <button id="btnLetter" class="btn ghost">Draft Cover Letter</button>
        </div>
        <div id="draftArea" class="section"></div>
        <div class="section">
          <h3>Your First Steps</h3>
          <ol id="pathSteps"></ol>
        </div>
        <div class="actions">
          <a class="btn ghost" href="#/result">Back</a>
          <a class="btn primary" href="#/plans">See Plans</a>
        </div>
      </section>
    `;
  },

  mount(state){
    const roleDiv = document.getElementById('focusRole');
    const stepsOl = document.getElementById('pathSteps');
    const draftArea = document.getElementById('draftArea');
    const btnResume = document.getElementById('btnResume');
    const btnLetter = document.getElementById('btnLetter');
    const stair = document.getElementById('strategyStair');

    const role = state.selectedRole || { title:'(No role chosen yet)', summary:'Choose a role on your NOVA Snapshot.', domain:'', path:[] };
    roleDiv.innerHTML = `<p><strong>Focus Role:</strong> ${role.title} <br><small>${role.summary}</small></p>`;

    // WHO (traits)
    const who = [...(state.selectedTraits || [])].slice(0,10);
    // WHAT (role)
    const what = role.title || '(choose a role)';
    // WHY (reflection note)
    const why = (state.reflection && state.reflection.note) ? state.reflection.note : 'Add a short sentence in Reflection about why this matters to you.';
    // WHEN (timing idea)
    const when = 'Set a 30‑day target for the first deliverable, and a 90‑day checkpoint.';
    // WHERE (location/market)
    const where = 'Identify 3 target markets/locations or companies that fit your domain.';
    // HOW (execution)
    const how = (role.path && role.path.length) ? role.path : ['Pick a starter project that proves value','Ship it and measure outcomes','Share results with 3 stakeholders'];

    function stepTpl(level, title, subtitle, contentHtml){
      return `<div class="step" data-level="${level}">
        <header>${title} <small>${subtitle||''}</small></header>
        <div class="content">${contentHtml}</div>
      </div>`;
    }

    const html = [
      stepTpl(1,'Who','Rooted in NOVA traits', `<p><strong>Top traits:</strong> ${who.join(', ')||'(none yet)'}</p>`),
      stepTpl(2,'What','Roles that fit', `<p>${what}</p>`),
      stepTpl(3,'Why','Motivation / Legacy', `<p>${why}</p>`),
      stepTpl(4,'When','Timing & Market', `<p>${when}</p>`),
      stepTpl(5,'Where','Location', `<p>${where}</p>`),
      stepTpl(6,'How','Execution', `<ol>${how.map(h=>`<li>${h}</li>`).join('')}</ol>`),
    ].join('');

    if(stair){ stair.innerHTML = html;
      stair.querySelectorAll('.step header').forEach(h => {
        h.addEventListener('click', ()=> h.parentElement.classList.toggle('open'));
      });
    }

    stepsOl.innerHTML = (role.path && role.path.length)
      ? role.path.map(s=>`<li>${s}</li>`).join('')
      : `<li>Select a role on the NOVA Snapshot to see recommended steps.</li>`;

    function summarizeTraits(){
      const top = [...state.selectedTraits].slice(0,8);
      return top.length ? top.join(', ') : 'adaptable, reliable, learner';
    }

    btnResume.addEventListener('click', ()=>{
      const summary = summarizeTraits();
      draftArea.textContent = `SUMMARY
Purpose-driven candidate for ${role.title} with strengths in ${summary}.

EXPERIENCE
- Role Title — Company (YYYY–YYYY)
  • Quantified accomplishment using top traits.
  • Project or impact statement.
  • Tools & tech: …

SKILLS
- ${summary}`;
    });

    btnLetter.addEventListener('click', ()=>{
      const summary = summarizeTraits();
      draftArea.textContent = `Dear Hiring Manager,

I’m excited to pursue the ${role.title} path. I bring strengths in ${summary} and align with ${role.domain}. I’d love to discuss how I can contribute.

Sincerely,
Your Name`;
    });
  }
};