export const Navi = {
  view(){
    return `
      <section class="section">
        <h2>Build Your Path (NAVI)</h2>
        <div id="focusRole"></div>
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

    const role = state.selectedRole || { title:'(No role chosen yet)', summary:'Choose a role on your NOVA Snapshot.', domain:'', path:[] };
    roleDiv.innerHTML = `<p><strong>Focus Role:</strong> ${role.title} <br><small>${role.summary}</small></p>`;

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

I’m excited to pursue the ${role.title} path. I bring strengths in ${summary} and align with ${role.domain} outcomes. I’d love to discuss how I can contribute.

Sincerely,
Your Name`;
    });
  }
};
