(function(){
  const app = ()=>document.getElementById('app');
  const state = { traits: [], roles: [], selected: new Set(), reflection: null };

  async function fetchJSON(path){ const r = await fetch(path, {cache:'no-store'}); if(!r.ok) throw new Error('Failed: '+path); return r.json(); }

  function homeView(){ /* prerendered */ }

  // ---- NOVA
  function novaView(){ return `
    <section class="section card">
      <h1>Discover with NOVA</h1>
      <p>Select traits that describe you. Each card includes a short explanation.</p>
      <div class="sticky-actions">
        <input id="traitSearch" class="input" placeholder="Search traits" aria-label="Search traits">
        <button id="clearTraits" class="btn">Clear</button>
        <button id="seeSnapshot" class="btn primary">See My Snapshot</button>
      </div>
      <div id="traitsGrid" class="traits"></div>
    </section>`; }

  function traitCard(t){ return `<div class="trait-card" data-name="${t.name}"><h5>${t.name}</h5><p>${t.desc}</p></div>`; }

  async function renderNova(){
    if(!state.traits.length) state.traits = await fetchJSON('data/traits.json');
    app().innerHTML = novaView();
    const grid = document.getElementById('traitsGrid');
    grid.innerHTML = state.traits.map(traitCard).join('');
    grid.querySelectorAll('.trait-card').forEach(card=>{
      const name = card.getAttribute('data-name');
      if(state.selected.has(name)) card.classList.add('selected');
      card.addEventListener('click', ()=>{
        card.classList.toggle('selected');
        if(card.classList.contains('selected')) state.selected.add(name); else state.selected.delete(name);
      });
    });
    const search = document.getElementById('traitSearch');
    search.addEventListener('input', ()=>{
      const q = search.value.toLowerCase();
      grid.querySelectorAll('.trait-card').forEach(card=>{
        const txt=(card.textContent||'').toLowerCase();
        card.style.display = txt.includes(q)?'':'none';
      });
    });
    document.getElementById('clearTraits').addEventListener('click', ()=>{
      state.selected.clear(); grid.querySelectorAll('.trait-card').forEach(c=>c.classList.remove('selected'));
      search.value=''; search.dispatchEvent(new Event('input'));
    });
    document.getElementById('seeSnapshot').addEventListener('click', ()=>{ location.hash = '#/result'; });
  }

  // ---- Snapshot (traits + role matches)
  function scoreRoles(selectedNames){
    const sel = new Set(selectedNames);
    const scored = state.roles.map(r=>{
      const matched = r.traits.filter(t=>sel.has(t));
      return {role:r.role, score:matched.length, matched};
    }).filter(x=>x.score>0).sort((a,b)=> b.score-a.score || a.role.localeCompare(b.role));
    return scored.slice(0,5);
  }
  function resultView(){
    const chosen = state.traits.filter(t=>state.selected.has(t.name));
    const selectedNames = chosen.map(t=>t.name);
    const topRoles = scoreRoles(selectedNames);
    const traitBadges = chosen.map(t=>`<div class="badge"><h6>${t.name}</h6><p>${t.desc}</p></div>`).join('') || '<p>— No traits selected yet —</p>';
    const roleCards = topRoles.length? topRoles.map(r=>`<div class="role-card"><h6>${r.role}</h6><p>Matches: ${r.matched.join(', ')}</p></div>`).join('') : '<p>— Select a few traits to see aligned roles —</p>';
    return `<section class="section card">
      <h1>Your NOVA Snapshot</h1>
      <h3>Selected Traits (${chosen.length})</h3>
      <div class="badges">${traitBadges}</div>
      <h3>Aligned Roles</h3>
      <div class="role-cards">${roleCards}</div>
      <div class="actions" style="margin-top:.6rem">
        <a class="btn" href="#/nova">Edit Traits</a>
        <a class="btn primary" href="#/reflect">Reflect &amp; Refine</a>
      </div>
    </section>`;
  }
  function renderResult(){ app().innerHTML = resultView(); }

  // ---- Reflection
  const REFLECTION_OPTIONS = [
    {key:'lost', title:'I feel lost and unsure', desc:'I’m unclear where I belong. Help me translate my traits into viable paths.'},
    {key:'starting', title:'I’m just starting out', desc:'I want to choose a direction that matches who I am.'},
    {key:'misaligned', title:'I’m in a field that doesn’t fit', desc:'I’ve built skills, but NOVA points to a better match. Help me realign.'},
    {key:'refining', title:'I’m partly aligned — going deeper', desc:'I’m close to my purpose; I want to refine and specialize.'}
  ];
  function reflectView(){
    const cards = REFLECTION_OPTIONS.map(o=>`
      <div class="reflect-card" data-key="${o.key}" role="button" tabindex="0" aria-label="${o.title}">
        <h4>${o.title}</h4>
        <p>${o.desc}</p>
      </div>`).join('');
    const hint = `<p class="reflect-hint"><strong>Click one of the options below</strong> to choose where you are in your journey.</p>`;
    const disabled = state.reflection ? '' : 'style="opacity:.6;pointer-events:none"';
    return `<section class="section card">
      <h1>Reflection</h1>
      ${hint}
      <div class="reflect-grid">${cards}</div>
      <div class="actions" style="margin-top:.9rem">
        <a class="btn" href="#/result">Back to Snapshot</a>
        <a id="toPlan" class="btn primary" ${disabled} href="#/plan">Save &amp; Continue to Plans</a>
      </div>
    </section>`;
  }
  function renderReflect(){
    app().innerHTML = reflectView();
    document.querySelectorAll('.reflect-card').forEach(card=>{
      const key = card.getAttribute('data-key');
      if(state.reflection && state.reflection.key===key) card.classList.add('selected');
      function select(){
        document.querySelectorAll('.reflect-card').forEach(c=>c.classList.remove('selected'));
        card.classList.add('selected');
        state.reflection = REFLECTION_OPTIONS.find(o=>o.key===key);
        const toPlan = document.getElementById('toPlan'); if(toPlan){ toPlan.style.opacity=''; toPlan.style.pointerEvents=''; }
      }
      card.addEventListener('click', select);
      card.addEventListener('keypress', (e)=>{ if(e.key==='Enter' || e.key===' ') { e.preventDefault(); select(); } });
    });
  }

  // ---- Plans (recommend based on reflection)
  function pickPlan(){
    if(!state.reflection) return 'Starter';
    const k = state.reflection.key;
    if(k==='lost' || k==='starting') return 'Starter';
    if(k==='misaligned') return 'Pro';
    if(k==='refining') return 'Pro';
    return 'Starter';
  }
  function plansView(){
    const rec = pickPlan();
    const plans = [
      {name:'Starter', price:'$49', bullets:['Trait discovery + snapshot','Guided reflection','1 resume template','Email support']},
      {name:'Pro', price:'$149', bullets:['Everything in Starter','Role targeting toolkit','Cover letter builder','30-60-90 day planner']},
      {name:'Mastery', price:'$299', bullets:['Everything in Pro','Portfolio/project guides','Interview drills','1:1 review checklist']}
    ];
    const cards = plans.map(p=>`
      <div class="plan">
        ${p.name===rec?'<div class="rec">Recommended</div>':''}
        <h4>${p.name}</h4>
        <p><strong>${p.price}</strong></p>
        <ul>${p.bullets.map(b=>`<li>${b}</li>`).join('')}</ul>
        <a class="btn primary" href="#/navi">Continue</a>
      </div>`).join('');
    return `<section class="section card">
      <h1>Choose Your Plan</h1>
      <p>Based on your reflection, we recommend: <strong>${rec}</strong>. You can pick any plan to continue.</p>
      <div class="plan-grid">${cards}</div>
      <div class="actions" style="margin-top:.8rem">
        <a class="btn" href="#/reflect">Back</a>
      </div>
    </section>`;
  }
  function renderPlans(){ app().innerHTML = plansView(); }

  // ---- NAVI: Visual Staircase
  function naviView(){
    const chosen = (state.traits||[]).filter(t=>state.selected.has(t.name)).map(t=>t.name);
    const who = chosen.slice(0,8).join(', ') || '—';
    const why = state.reflection ? state.reflection.title : 'Clarify your motivation and alignment.';
    return `<section class="section card">
      <h1>NAVI — Strategy Staircase</h1>
      <div class="stair">
        ${step('Who', `<p>${who}</p>`)}
        ${step('What', `<p>Define your focus role (e.g., Product Designer, Operations Lead).</p><input class="input" placeholder="Type a target role/title">`)}
        ${step('Why', `<p>${why}</p>`)}
        ${step('When', `<p>Set a 30–60–90 day plan with milestones.</p>`)}
        ${step('Where', `<p>List target companies/teams to pursue.</p>`)}
        ${step('How', `<ul><li>Tailor your resume to emphasize top traits.</li><li>Draft a cover letter connecting traits → impact.</li><li>Identify 3 projects to showcase (portfolio or examples).</li></ul>`)}
      </div>
      <div class="actions" style="margin-top:.9rem">
        <a class="btn" href="#/plan">Back</a>
        <a class="btn" href="#/result">Snapshot</a>
        <a class="btn" href="#/home">Home</a>
      </div>
    </section>`;
  }
  function step(title, html){ return `<div class="stair-step"><button class="toggle btn">Toggle</button><h3>${title}</h3><div class="content">${html}</div></div>`; }
  function renderNavi(){
    app().innerHTML = naviView();
    document.querySelectorAll('.stair-step').forEach((s,i)=>{
      if(i===0) s.classList.add('active');
      s.querySelector('.toggle').addEventListener('click', ()=> s.classList.toggle('active'));
    });
  }

  // ---- Router
  function route(){ const r=(location.hash||'#/home').replace(/^#\/?/,''); return r||'home'; }
  function render(r){
    if(r==='home'){ /* welcome is prerendered */ return; }
    if(r==='nova') return renderNova();
    if(r==='result') return renderResult();
    if(r==='reflect') return renderReflect();
    if(r==='plan') return renderPlans();
    if(r==='navi') return renderNavi();
  }
  window.addEventListener('hashchange', ()=>render(route()));
  document.addEventListener('DOMContentLoaded', async ()=>{
    state.roles = await fetchJSON('data/roles.json');
    // bind welcome CTA
    const start = document.getElementById('startNovaCta');
    if(start){ start.addEventListener('click', e=>{ e.preventDefault(); location.hash = '#/nova'; render('nova'); }); }
    render(route());
  });
})();