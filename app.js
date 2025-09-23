const $ = (s)=>document.querySelector(s);
const appEl = ()=>document.getElementById('app');

function setYear(){ const y = document.getElementById('year'); if(y) y.textContent = new Date().getFullYear(); }

async function fetchJSON(path){
  const res = await fetch(path, {cache:'no-store'});
  if(!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

function stickyBar(){
  return `
    <div class="sticky-actions">
      <input id="traitSearch" class="input" placeholder="Search traits" aria-label="Search traits"/>
      <button id="clearTraits" class="btn">Clear</button>
      <button id="seeSnapshot" class="btn primary">See My Snapshot</button>
    </div>`;
}

function traitChip(t){ return `<label class="chip"><input type="checkbox" value="${t}"> ${t}</label>`; }

function novaTemplate(){
  return `
    <section class="section card">
      <h1>Discover with NOVA</h1>
      <p>Select every trait that feels true to you. We’ll turn these into attributes and aligned roles.</p>
      ${stickyBar()}
      <div id="traitsGrid" class="traits"></div>
    </section>`;
}

async function renderNova(){
  const root = appEl();
  root.innerHTML = novaTemplate();
  const data = await fetchJSON('data/traits.json'); // {traits:[...]}
  const traits = Array.isArray(data) ? data : (data.traits || []);
  const grid = document.getElementById('traitsGrid');
  grid.innerHTML = traits.map(traitChip).join('');

  const search = document.getElementById('traitSearch');
  const clear = document.getElementById('clearTraits');
  const see = document.getElementById('seeSnapshot');

  search.addEventListener('input', () => {
    const q = search.value.toLowerCase();
    grid.querySelectorAll('.chip').forEach(ch => {
      const txt = ch.textContent.toLowerCase();
      ch.style.display = txt.includes(q) ? '' : 'none';
    });
  });
  clear.addEventListener('click', () => {
    grid.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    search.value=''; search.dispatchEvent(new Event('input'));
  });
  see.addEventListener('click', () => {
    const selected = Array.from(grid.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
    renderResult(selected);
  });
}

function renderResult(selected){
  appEl().innerHTML = `
    <section class="section card">
      <h1>Your NOVA Snapshot</h1>
      <p><strong>Top Traits (${selected.length}):</strong> ${selected.join(', ') || '—'}</p>
      <div class="actions">
        <a class="btn" href="#/nova">Edit Traits</a>
        <a class="btn primary" href="#/reflect">Reflect &amp; Refine</a>
      </div>
    </section>`;
}

function renderReflect(){
  appEl().innerHTML = `
    <section class="section card">
      <h1>Reflection</h1>
      <p>Take a moment to choose where you are in your journey.</p>
      <div class="actions"><a class="btn" href="#/result">Back to Snapshot</a></div>
    </section>`;
}

function routeFromHash(){
  const raw = location.hash || '#/home';
  return raw.replace(/^#+/,'').replace(/^\/+/, '').trim() || 'home';
}

function render(route){
  if(route==='home'){ /* prerendered welcome */ return; }
  if(route==='nova'){ renderNova().catch(err=> appEl().innerHTML = `<pre class="error">${err.message}</pre>`); return; }
  if(route==='result'){ renderResult([]); return; }
  if(route==='reflect'){ renderReflect(); return; }
}

function bindStartNova(){
  const el = document.getElementById('startNovaCta');
  if(!el) return;
  const go=()=>{ location.hash = '#/nova'; };
  el.addEventListener('click', e=>{ e.preventDefault(); go(); });
  el.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); go(); }});
}

window.addEventListener('hashchange', ()=>render(routeFromHash()));
document.addEventListener('DOMContentLoaded', ()=>{ setYear(); bindStartNova(); render(routeFromHash()); });
