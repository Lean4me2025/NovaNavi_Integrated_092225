export const Reflection = {
  options: [
    {
      key: 'starting_fresh',
      title: 'Starting Fresh',
      subtitle: 'I’m new or switching into a new field.',
      boosts: ['Learner','Curious','Growth Mindset','Coach','Mentor','Hands-On']
    },
    {
      key: 'lost_clarity',
      title: 'Lost / Need Clarity',
      subtitle: 'I’m not sure what fits. I need direction first.',
      boosts: ['Researcher','Listener','Facilitator','Design Thinker','Analytical','Empathetic']
    },
    {
      key: 'correcting_course',
      title: 'Correcting Course',
      subtitle: 'I work in my field but it’s misaligned. I want purpose-fit.',
      boosts: ['Process-Focused','Strategic','Organizer','Quality-Focused','Customer-Obsessed','Systems Thinker']
    },
    {
      key: 'growing_here',
      title: 'Growing Where Planted',
      subtitle: 'I’m close to purpose and want to deepen & advance.',
      boosts: ['Leader','Servant-Leader','Visionary','Results-Driven','Networker','Planner']
    }
  ],

  view(state){
    const chosen = state.reflection?.persona || '';
    const cards = this.options.map(o => `
      <div class="card" data-persona="${o.key}" style="${chosen===o.key?'outline:2px solid var(--accent)':''}">
        <h3>${o.title}</h3>
        <p>${o.subtitle}</p>
      </div>
    `).join('');

    return `
      <section class="section">
        <h2>Reflection</h2>
        <p>Before we select traits, where are you in your journey?</p>
        <div id="reflectCards" class="cards4">${cards}</div>
        <div class="actions">
          <a class="btn ghost" href="#/home">Back</a>
          <a id="toNova" class="btn primary ${chosen?'':'disabled'}" href="${chosen?'#/nova':'javascript:void(0)'}">Continue to NOVA</a>
        </div>
      </section>
    `;
  },

  mount(state){
    const wrap = document.getElementById('reflectCards');
    const toNova = document.getElementById('toNova');
    if(!wrap) return;
    wrap.addEventListener('click', (e)=>{
      const card = e.target.closest('[data-persona]');
      if(!card) return;
      const key = card.getAttribute('data-persona');
      const opt = this.options.find(o=>o.key===key);
      state.reflection = { persona:key, boosts: opt?.boosts || [] };
      // outline refresh
      document.querySelectorAll('#reflectCards .card').forEach(c=> c.style.outline='none');
      card.style.outline = '2px solid var(--accent)';
      if(toNova){ toNova.classList.remove('disabled'); toNova.setAttribute('href','#/nova'); }
    });
  }
};
