(function(){
  const app = ()=>document.getElementById('app');
  const state = { traits: [], roles: [], selected: new Set(), reflection: null };

  async function fetchJSON(path){
    try{
      const res = await fetch(path, {cache:'no-store'});
      if(!res.ok) throw new Error('Failed to load '+path);
      return await res.json();
    }catch(e){
      console.warn('Fetch error:', e.message);
      return [];
    }
  }

  // Views
  function novaView(){ return '<section class="section card"><h1>Discover with NOVA</h1><p>Select traits that describe you. Each card includes a short explanation.</p><div class="sticky-actions"><input id="traitSearch" class="input" placeholder="Search traits" aria-label="Search traits"><button id="clearTraits" class="btn">Clear</button><a class="btn primary" href=\"#/result\">See My Snapshot</a></div><div id="traitsGrid" class="traits"></div></section>'; }
  function traitCard(t){ return '<div class="trait-card" data-name="'+t.name.replace(/"/g,'&quot;')+'"><h5>'+t.name+'</h5><p>'+t.desc+'</p></div>'; }
  async function renderNova(){
    if(!state.traits.length){ state.traits = await fetchJSON('data/traits.json'); }
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
    if(search){ search.addEventListener('input', ()=>{
      const q = search.value.toLowerCase();
      grid.querySelectorAll('.trait-card').forEach(card=>{
        const txt=(card.textContent||'').toLowerCase();
        card.style.display = txt.includes(q)?'':'';
      });
    });}
    const clear = document.getElementById('clearTraits');
    if(clear){ clear.addEventListener('click', ()=>{
      state.selected.clear(); grid.querySelectorAll('.trait-card').forEach(c=>c.classList.remove('selected'));
      if(search){ search.value=''; search.dispatchEvent(new Event('input')); }
    });}
  }

  function scoreRoles(selected){
    const sel = new Set(selected);
    return (state.roles||[]).map(r=>{
      const matched = (r.traits||[]).filter(t=>sel.has(t));
      return {role:r.role, matched, score:matched.length};
    }).filter(x=>x.score>0).sort((a,b)=> b.score-a.score || a.role.localeCompare(b.role)).slice(0,5);
  }
  function resultView(){
    const chosen = (state.traits||[]).filter(t=>state.selected.has(t.name));
    const selectedNames = chosen.map(t=>t.name);
    const top = scoreRoles(selectedNames);
    const traitBadges = chosen.length ? chosen.map(t=>'<div class="badge"><h6>'+t.name+'</h6><p>'+t.desc+'</p></div>').join('') : '<p>— No traits selected yet —</p>';
    const info = '<div class="info-block"><h3>How your purpose is determined</h3><p>✨ This isn’t random. Your traits reveal the way you naturally think, act, and contribute. We then compare your profile against the skills and requirements of more than 400 career paths. The result: a focused list of roles where your strengths are already aligned — so you can see practical, real-world fits for who you are.</p></div>';
    const roles = top.length ? top.map(r=>'<div class="role-card"><h6>'+r.role+'</h6><p>Matches: '+r.matched.join(', ')+'</p></div>').join('') : '<p>— Select a few traits to see aligned roles —</p>';
    return '<section class="section card"><h1>Your NOVA Snapshot</h1><h3>Selected Traits ('+chosen.length+')</h3><div class="badges">'+traitBadges+'</div>'+info+'<h3>Aligned Roles</h3><div class="role-cards">'+roles+'</div><div class="actions" style="margin-top:.6rem"><a class="btn" href=\"#/nova\">Edit Traits</a><a class="btn primary" href=\"#/reflect\">Reflect &amp; Refine</a></div></section>';
  }
  function renderResult(){ app().innerHTML = resultView(); }

  const REFLECTION = [
    {key:'lost', title:'I feel lost and unsure', desc:'I’m unclear where I belong. Help me translate my traits into viable paths.'},
    {key:'starting', title:'I’m just starting out', desc:'I want to choose a direction that matches who I am.'},
    {key:'misaligned', title:'I’m in a field that doesn’t fit', desc:'I’ve built skills, but NOVA points to a better match. Help me realign.'},
    {key:'refining', title:'I’m partly aligned — going deeper', desc:'I’m close to my purpose; I want to refine and specialize.'}
  ];
  function reflectView(){
    const cards = REFLECTION.map(o=>'<div class="reflect-card" data-key="'+o.key+'" role="button" tabindex="0" aria-label="'+o.title+'"><h4>'+o.title+'</h4><p>'+o.desc+'</p></div>').join('');
    const disabled = state.reflection ? '' : 'style="opacity:.6;pointer-events:none"';
    return '<section class="section card"><h1>Reflection</h1><p class="reflect-hint"><strong>Click one of the options below</strong> to choose where you are in your journey.</p><div class="reflect-grid">'+cards+'</div><div class="actions" style="margin-top:.9rem"><a class="btn" href=\"#/result\">Back to Snapshot</a><a id="toPlan" class="btn primary" '+disabled+' href=\"#/plan\">Save &amp; Continue to Plans</a></div></section>';
  }
  function renderReflect(){
    app().innerHTML = reflectView();
    document.querySelectorAll('.reflect-card').forEach(card=>{
      const key = card.getAttribute('data-key');
      if(state.reflection && state.reflection.key===key) card.classList.add('selected');
      const select = ()=>{
        document.querySelectorAll('.reflect-card').forEach(c=>c.classList.remove('selected'));
        card.classList.add('selected');
        state.reflection = REFLECTION.find(o=>o.key===key);
        const toPlan = document.getElementById('toPlan'); if(toPlan){ toPlan.style.opacity=''; toPlan.style.pointerEvents=''; }
      };
      card.addEventListener('click', select);
      card.addEventListener('keypress', e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); select(); } });
    });
  }

  function pickPlan(){
    if(!state.reflection) return 'Starter';
    const k = state.reflection.key;
    if(k==='lost'||k==='starting') return 'Starter';
    if(k==='misaligned'||k==='refining') return 'Pro';
    return 'Starter';
  }
  function plansView(){
    const rec = pickPlan();
    const plans = [
      {name:'Starter', price:'$49', bullets:['Trait discovery + snapshot','Guided reflection','1 resume template','Email support']},
      {name:'Pro', price:'$149', bullets:['Everything in Starter','Role targeting toolkit','Cover letter builder','30-60-90 day planner']},
      {name:'Mastery', price:'$299', bullets:['Everything in Pro','Portfolio/project guides','Interview drills','1:1 review checklist']}
    ];
    const cards = plans.map(p=>'<div class="plan">'+(p.name===rec?'<div class="rec">Recommended</div>':'')+'<h4>'+p.name+'</h4><p><strong>'+p.price+'</strong></p><ul>'+p.bullets.map(b=>'<li>'+b+'</li>').join('')+'</ul><a class="btn primary" href=\"#/navi\">Continue</a></div>').join('');
    return '<section class="section card"><h1>Choose Your Plan</h1><p>Based on your reflection, we recommend: <strong>'+rec+'</strong>. You can pick any plan to continue.</p><div class="plan-grid">'+cards+'</div><div class="actions" style="margin-top:.8rem"><a class="btn" href=\"#/reflect\">Back</a></div></section>';
  }
  function renderPlans(){ app().innerHTML = plansView(); }

  function step(title, html){ return '<div class="stair-step"><button class="toggle btn">Toggle</button><h3>'+title+'</h3><div class="content">'+html+'</div></div>'; }
  function naviView(){
    const chosen = (state.traits||[]).filter(t=>state.selected.has(t.name)).map(t=>t.name);
    const who = chosen.slice(0,8).join(', ') || '—';
    const why = state.reflection ? state.reflection.title : 'Clarify your motivation and alignment.';
    return '<section class="section card"><h1>NAVI — Strategy Staircase</h1><div class="stair">'+step('Who','<p>'+who+'</p>')+step('What','<p>Define your focus role (e.g., Product Designer, Operations Lead).</p><input class="input" placeholder="Type a target role/title">')+step('Why','<p>'+why+'</p>')+step('When','<p>Set a 30–60–90 day plan with milestones.</p>')+step('Where','<p>List target companies/teams to pursue.</p>')+step('How','<ul><li>Tailor your resume to emphasize top traits.</li><li>Draft a cover letter connecting traits → impact.</li><li>Identify 3 projects to showcase.</li></ul>')+'</div><div class="actions" style="margin-top:.9rem"><a class="btn" href=\"#/plan\">Back</a><a class="btn" href=\"#/result\">Snapshot</a><a class="btn" href=\"#/home\">Home</a></div></section>';
  }
  function renderNavi(){
    app().innerHTML = naviView();
    document.querySelectorAll('.stair-step .toggle').forEach((btn,i)=>{
      const step = btn.closest('.stair-step');
      if(i===0) step.classList.add('active');
      btn.addEventListener('click', ()=> step.classList.toggle('active'));
    });
  }

  // Router
  function getRoute(){ const r = (location.hash||'#/home').replace(/^#\/?/,''); return r||'home'; }
  function render(route){
    if(route==='home'){ return; }
    if(route==='nova') return renderNova();
    if(route==='result') return renderResult();
    if(route==='reflect') return renderReflect();
    if(route==='plan') return renderPlans();
    if(route==='navi') return renderNavi();
  }

  // Delegated hash-link click handler (works for nav + in-page CTAs)
  document.addEventListener('click', (e)=>{
    const a = e.target.closest('a[href^="#/"]');
    if(!a) return;
    e.preventDefault();
    const href = a.getAttribute('href');
    if(href != null){ location.hash = href; }
  });

  window.addEventListener('hashchange', ()=> render(getRoute()));

  document.addEventListener('DOMContentLoaded', async ()=>{
    // Preload roles but don't block nav
    fetchJSON('data/roles.json').then(d=> state.roles = d||[] );
    render(getRoute());
    // Start CTA also uses delegated handler, but ensure presence
    const start = document.getElementById('startNovaCta');
    if(start){ start.setAttribute('href', '#/nova'); }
  });
})();