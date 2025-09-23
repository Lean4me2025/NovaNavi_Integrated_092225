(function(){
  const $ = (s)=>document.querySelector(s);
  const app = ()=>document.getElementById('app');
  const state = { traits: [], selected: new Set(), reflection: null };

  function setYear(){ const y=document.getElementById('year'); if(y) y.textContent = new Date().getFullYear(); }

  async function fetchJSON(path){
    const res = await fetch(path, {cache:'no-store'});
    if(!res.ok) throw new Error('Failed to load '+path);
    return res.json();
  }

  // ---- Views
  function homeView(){ /* prerendered in index.html */ }

  function novaView(){
    return `
      <section class="section card">
        <h1>Discover with NOVA</h1>
        <p>Select traits that describe you. Each trait includes a short explanation.</p>
        <div class="sticky-actions">
          <input id="traitSearch" class="input" placeholder="Search traits" aria-label="Search traits">
          <button id="clearTraits" class="btn">Clear</button>
          <button id="seeSnapshot" class="btn primary">See My Snapshot</button>
        </div>
        <div id="traitsGrid" class="traits"></div>
      </section>`;
  }

  function traitCard(t){
    return `<div class="trait-card" data-name="${t.name}">
      <h5>${t.name}</h5>
      <p>${t.desc}</p>
    </div>`;
  }

  async function renderNova(){
    if (!state.traits.length){
      state.traits = await fetchJSON('data/traits.json');
    }
    app().innerHTML = novaView();
    const grid = document.getElementById('traitsGrid');
    grid.innerHTML = state.traits.map(traitCard).join('');

    // restore selections & wire clicks
    grid.querySelectorAll('.trait-card').forEach(card=>{
      const name = card.getAttribute('data-name');
      if(state.selected.has(name)) card.classList.add('selected');
      card.addEventListener('click', ()=>{
        card.classList.toggle('selected');
        if(card.classList.contains('selected')) state.selected.add(name);
        else state.selected.delete(name);
      });
    });

    // search/clear/snapshot
    const search = document.getElementById('traitSearch');
    search.addEventListener('input', ()=>{
      const q = search.value.toLowerCase();
      grid.querySelectorAll('.trait-card').forEach(card=>{
        const txt = (card.textContent||'').toLowerCase();
        card.style.display = txt.includes(q) ? '' : 'none';
      });
    });
    document.getElementById('clearTraits').addEventListener('click', ()=>{
      state.selected.clear();
      grid.querySelectorAll('.trait-card').forEach(c=>c.classList.remove('selected'));
      search.value=''; search.dispatchEvent(new Event('input'));
    });
    document.getElementById('seeSnapshot').addEventListener('click', ()=>{
      location.hash = '#/result';
    });
  }

  function resultView(){
    const chosen = state.traits.filter(t => state.selected.has(t.name));
    const badges = chosen.map(t => `<div class="badge"><h6>${t.name}</h6><p>${t.desc}</p></div>`).join('') || '<p>— No traits selected yet —</p>';
    return `
      <section class="section card">
        <h1>Your NOVA Snapshot</h1>
        <p><strong>Selected Traits (${chosen.length}):</strong></p>
        <div class="badges">${badges}</div>
        <div class="actions">
          <a class="btn" href="#/nova">Edit Traits</a>
          <a class="btn primary" href="#/reflect">Reflect &amp; Refine</a>
        </div>
      </section>`;
  }

  function renderResult(){ app().innerHTML = resultView(); }

  const REFLECTION_OPTIONS = [
    {key:'lost', title:'I feel lost and unsure', desc:'I’m unclear where I belong. Help me translate my traits into viable paths.'},
    {key:'starting', title:'I’m just starting out', desc:'I want to choose a direction that matches who I am.'},
    {key:'misaligned', title:'I’m in a field that doesn’t fit', desc:'I’ve built skills, but NOVA points to a better match. Help me realign.'},
    {key:'refining', title:'I’m partly aligned—going deeper', desc:'I’m close to my purpose; I want to refine and specialize.'}
  ];

  function reflectView(){
    const cards = REFLECTION_OPTIONS.map(opt => `
      <div class="reflect-card" data-key="${opt.key}">
        <h4>${opt.title}</h4>
        <p>${opt.desc}</p>
      </div>`).join('');
    const chosen = state.reflection ? `<p><em>Selected:</em> ${state.reflection.title}</p>` : '';
    return `
      <section class="section card">
        <h1>Reflection</h1>
        <p>Take a moment to choose where you are in your journey.</p>
        <div class="reflect-grid">${cards}</div>
        ${chosen}
        <div class="actions" style="margin-top:.9rem">
          <a class="btn" href="#/result">Back to Snapshot</a>
          <a id="toNavi" class="btn primary" href="#/navi">Save &amp; Continue to NAVI</a>
        </div>
      </section>`;
  }

  function renderReflect(){
    app().innerHTML = reflectView();
    document.querySelectorAll('.reflect-card').forEach(card => {
      const key = card.getAttribute('data-key');
      card.addEventListener('click', () => {
        document.querySelectorAll('.reflect-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        state.reflection = REFLECTION_OPTIONS.find(o => o.key === key);
      });
    });
  }

  function naviView(){
    const chosen = state.traits.filter(t => state.selected.has(t.name)).map(t=>t.name);
    const who = chosen.slice(0, 8).join(', ') || '—';
    const stage = state.reflection ? state.reflection.title : '—';

    return `
      <section class="section card">
        <h1>NAVI — Strategy Staircase</h1>
        <div class="stair">
          <h3>Who</h3>
          <p>${who}</p>
          <h3>What</h3>
          <p>Define your focus role (e.g., Product Designer, Operations Lead). <em>(Enter below)</em></p>
          <input id="roleInput" class="input" placeholder="Type a target role/title">
          <h3>Why</h3>
          <p>${stage === '—' ? 'Clarify your motivation and alignment.' : 'Based on your reflection: ' + stage}</p>
          <h3>When</h3>
          <p>Set a 30–60–90 day plan with milestones.</p>
          <h3>Where</h3>
          <p>List target companies/teams to pursue.</p>
          <h3>How</h3>
          <ul>
            <li>Tailor your resume to emphasize top traits.</li>
            <li>Draft a cover letter connecting traits → impact.</li>
            <li>Identify 3 projects to showcase (portfolio or examples).</li>
          </ul>
        </div>
        <div class="actions" style="margin-top:.9rem">
          <a class="btn" href="#/reflect">Back</a>
          <a class="btn" href="#/result">Snapshot</a>
          <a class="btn" href="#/home">Home</a>
        </div>
      </section>`;
  }

  function renderNavi(){ app().innerHTML = naviView(); }

  // ---- Router
  function routeFromHash(){
    const raw = location.hash || '#/home';
    const cleaned = raw.replace(/^#+/, '#').replace(/^#\/*/, '#/');
    const route = cleaned.slice(2).trim();
    return route || 'home';
  }

  function render(route){
    if(route==='home'){ /* prerendered welcome */ return; }
    if(route==='nova'){ renderNova().catch(err=> app().innerHTML = `<pre class="error">${err.message}</pre>`); return; }
    if(route==='result'){ renderResult(); return; }
    if(route==='reflect'){ renderReflect(); return; }
    if(route==='navi'){ renderNavi(); return; }
    // default -> home
  }

  // ---- Nav bindings & CTA
  function bindAllLinks(){
    document.querySelectorAll('a[href^="#/"]').forEach(a => {
      a.addEventListener('click', e => {
        // Let hash change, then render
        setTimeout(()=>render(routeFromHash()), 0);
      });
    });
    const start = document.getElementById('startNovaCta');
    if(start){
      start.addEventListener('click', e=>{
        e.preventDefault();
        location.hash = '#/nova';
        render('nova');
      });
    }
  }

  window.addEventListener('hashchange', ()=>render(routeFromHash()));
  document.addEventListener('DOMContentLoaded', ()=>{
    bindAllLinks();
    render(routeFromHash());
  });
})();