// NOVA Integrated Live - shared JS
const STORAGE_KEY = 'nova.selectedTraits';
const REFLECT_KEY = 'nova.reflectChoice';

// Helpers
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
const save = (k,v)=> localStorage.setItem(k, JSON.stringify(v));
const load = (k, fallback=null)=>{
  try { const v = JSON.parse(localStorage.getItem(k)); return (v===null?fallback:v); } catch(e){ return fallback; }
};

// Traits page
function initTraits() {
  const traits = [
    "Analytical","Creative","Leadership","Collaboration","Detail-Oriented","Strategic",
    "Innovative","Empathetic","Adaptable","Problem-Solver","Communicator","Resilient",
    "Initiative-Taker","Organized","Curious","Mentor","Visionary","Data-Driven",
    "Customer-Focused","Results-Oriented","Ethical","Calm Under Pressure","Decision-Maker",
    "Learner","Persistent","Relationship-Builder","Presenter","Planner","Entrepreneurial",
    "Systems Thinker","Resourceful","Independent","Team Player","Inclusive","Diplomatic",
    "Optimistic","Accountable","Thorough","Fast Learner","Self-Starter","Process-Oriented",
    "Quality-Focused","Storyteller","Technical","Numerical","Design Thinker","Researcher",
    "Teacher","Negotiator","Servant-Hearted"
  ]; // 50

  const grid = $('.traits-grid');
  const nextBtn = $('#toResults');
  const clearBtn = $('#clearTraits');
  const meta = $('#selectMeta');

  const selected = new Set(load(STORAGE_KEY, []));

  traits.forEach(t => {
    const div = document.createElement('div');
    div.className = 'trait' + (selected.has(t) ? ' selected':'');
    div.setAttribute('role','button');
    div.setAttribute('tabindex','0');
    div.innerHTML = `<div class="label">${t}</div>`;
    div.addEventListener('click', ()=> toggle(t, div));
    div.addEventListener('keydown', e=> { if(e.key===' '||e.key==='Enter'){ e.preventDefault(); toggle(t, div);} });
    grid.appendChild(div);
  });

  function renderMeta(){
    meta.textContent = `${selected.size} selected`;
    if (selected.size > 0) nextBtn.removeAttribute('disabled');
    else nextBtn.setAttribute('disabled','true');
  }

  function toggle(t, el){
    if (selected.has(t)) { selected.delete(t); el.classList.remove('selected'); }
    else { selected.add(t); el.classList.add('selected'); }
    save(STORAGE_KEY, Array.from(selected));
    renderMeta();
  }

  clearBtn.addEventListener('click', ()=> {
    selected.clear();
    save(STORAGE_KEY, []);
    $$('.trait').forEach(el=> el.classList.remove('selected'));
    renderMeta();
  });

  renderMeta();
}

// Results page
function initResults(){
  const out = $('#selectedOut');
  const traits = load(STORAGE_KEY, []);
  if (!traits || traits.length === 0) {
    out.innerHTML = `<p class="kicker">No traits selected yet. <a href="traits.html">Select traits</a>.</p>`;
    $('#toReflection').setAttribute('disabled','true');
    return;
  }

  const chips = traits.map(t=> `<span class="chip">${t}</span>`).join(' ');
  out.innerHTML = `<div class="chips">${chips}</div>`;

  const roleBuckets = [];
  const has = (k)=> traits.some(t=> t.toLowerCase().includes(k));
  if (has('data') || has('analytical') || has('numerical') || has('research')) roleBuckets.push('Data Analyst • Business Intelligence • Researcher');
  if (has('creative') || has('design')) roleBuckets.push('Designer • Content Strategist • Product Marketing');
  if (has('leadership') || has('visionary') || has('mentor')) roleBuckets.push('Team Lead • Program Manager • Operations Manager');
  if (has('technical')) roleBuckets.push('Technical Specialist • Solutions Architect • QA Engineer');
  if (has('teacher') || has('servant')) roleBuckets.push('Trainer • Customer Success • Community Manager');
  if (has('process') || has('quality') || has('organized')) roleBuckets.push('Process Engineer • Quality Analyst • Project Coordinator');
  const roles = roleBuckets.length ? roleBuckets.join('  |  ') : 'Generalist roles across operations, support, and coordination';
  $('#rolesOut').textContent = roles;
}

// Reflection page
function initReflection(){
  const options = $$('.option');
  const saveBtn = $('#saveContinue');
  let chosen = load(REFLECT_KEY, null);
  if (chosen !== null && options[chosen]) {
    options[chosen].classList.add('selected');
    saveBtn.removeAttribute('disabled');
  }
  options.forEach((opt, idx)=>{
    opt.addEventListener('click', ()=>{
      options.forEach(o=> o.classList.remove('selected'));
      opt.classList.add('selected');
      chosen = idx;
      save(REFLECT_KEY, chosen);
      saveBtn.removeAttribute('disabled');
    });
  });
}

document.addEventListener('DOMContentLoaded', ()=> {
  const page = document.body.getAttribute('data-page');
  if (page === 'traits') initTraits();
  if (page === 'results') initResults();
  if (page === 'reflection') initReflection();
});