const state = {
  category: null,
  selectedTraits: new Set(),
  reflection: null,
  minTraits: 8
};

function $(s){return document.querySelector(s)}; 
function $all(s){return [...document.querySelectorAll(s)]};

function showView(hash){
  $all('.view').forEach(v=>v.classList.remove('active'));
  const el = document.querySelector(hash || '#welcome');
  if(el) el.classList.add('active');
  window.location.hash = hash;
}

// Load JSON helpers
async function loadJSON(path){ const res = await fetch(path); return await res.json(); }

// Render Categories
async function renderCategories(){
  const cats = await loadJSON('data/categories.json');
  const grid = $('#category-grid');
  grid.innerHTML = '';
  Object.keys(cats).forEach(name => {
    const div = document.createElement('div');
    div.className = 'category';
    div.textContent = name;
    div.onclick = ()=>{
      state.category = name;
      $all('.category').forEach(c=>c.classList.remove('selected'));
      div.classList.add('selected');
      $('#to-traits').disabled = false;
    };
    grid.appendChild(div);
  });
}

// Render Traits (from chosen category, but allow adding more via "Explore More")
async function renderTraits(){
  const cats = await loadJSON('data/categories.json');
  const base = cats[state.category] || [];
  const all = await loadJSON('data/traits.json');
  const grid = $('#traits-grid');
  grid.innerHTML = '';

  const header = document.createElement('div');
  header.style.gridColumn = '1/-1';
  header.innerHTML = `<div style="opacity:.9;margin-bottom:6px">Showing traits for: <strong>${state.category||'—'}</strong>. Explore more by selecting additional traits below.</div>`;
  grid.appendChild(header);

  const list = [...new Set([...base, ...all])];
  list.forEach(t=>{
    const div = document.createElement('div');
    div.className = 'trait';
    div.textContent = t;
    if(state.selectedTraits.has(t)) div.classList.add('selected');
    div.onclick = ()=>{
      if(state.selectedTraits.has(t)){ state.selectedTraits.delete(t); div.classList.remove('selected'); }
      else { state.selectedTraits.add(t); div.classList.add('selected'); }
      $('#see-results').disabled = state.selectedTraits.size < state.minTraits;
    };
    grid.appendChild(div);
  });

  $('#min-count').textContent = state.minTraits;
  $('#see-results').disabled = state.selectedTraits.size < state.minTraits;
}

// Results render
async function renderResults(){
  const wrap = $('#results-list');
  wrap.innerHTML = '';
  [...state.selectedTraits].slice(0, 24).forEach(t=>{
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.textContent = t;
    wrap.appendChild(tag);
  });

  // Roles
  const rolesEl = $('#role-suggestions');
  rolesEl.innerHTML = '';
  const rules = await loadJSON('data/roles.json');
  const traits = state.selectedTraits;
  const suggestions = [];
  rules.forEach(r => {
    if(r.needs.every(n => traits.has(n))) suggestions.push(r.role);
  });
  if(suggestions.length === 0) suggestions.push('Explore more traits or choose a different category to refine suggestions.');
  suggestions.forEach(role => {
    const li = document.createElement('li'); li.textContent = role; rolesEl.appendChild(li);
  });
}

// Reflection
async function renderReflection(){
  const cards = await loadJSON('data/reflection.json');
  const wrap = $('#reflection-options');
  wrap.innerHTML = '';
  cards.forEach(c=>{
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `<div style="font-weight:700;margin-bottom:6px">${c.title}</div><div style="opacity:.85">${c.desc}</div>`;
    div.onclick = ()=>{
      state.reflection = c.id;
      $all('#reflection .card').forEach(x=>x.classList.remove('selected'));
      div.classList.add('selected');
      $('#save-reflection').disabled = false;
    };
    wrap.appendChild(div);
  });
}

// Path
function renderPathSuggestions(){
  const wrap = $('#path-suggestions');
  wrap.innerHTML = '';
  const out = [];
  const r = state.reflection;
  if(r==='starting') out.push('Start with the Purpose Book + light Starter plan.');
  if(r==='pivoting') out.push('Use Pro tools to translate strengths into a new lane.');
  if(r==='advancing') out.push('Mastery plan + targeted applications to level up.');
  if(r==='restarting') out.push('Purpose Book + Pro templates to rebuild momentum.');
  if(out.length===0) out.push('Choose the option that resonates most as your next step.');
  out.forEach(s=>{ const div=document.createElement('div'); div.className='card'; div.textContent=s; wrap.appendChild(div); });
}

// Events
document.addEventListener('click',(e)=>{
  const btn = e.target.closest('[data-goto]');
  if(btn){
    const target = btn.getAttribute('data-goto');
    if(target==='#traits') renderTraits();
    if(target==='#results') renderResults();
    if(target==='#reflection') renderReflection();
    if(target==='#path') renderPathSuggestions();
    showView(target);
  }
});

$('#clear-traits')?.addEventListener('click',()=>{
  state.selectedTraits.clear();
  $all('.trait').forEach(t=>t.classList.remove('selected'));
  $('#see-results').disabled = true;
});

$('#save-reflection')?.addEventListener('click',()=>{
  if(!state.reflection) return;
  showView('#path');
});

// Boot
async function boot(){
  await renderCategories();
  showView(location.hash || '#welcome');
}
boot();

window.addEventListener('hashchange', ()=> showView(location.hash || '#welcome'));
