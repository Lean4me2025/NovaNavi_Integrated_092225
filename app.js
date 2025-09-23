
// Simple SPA navigation & state
const S = {
  page: 'welcome',
  selectedTraits: new Set(),
  reflectionChoice: null
};

const $ = (q, scope=document) => scope.querySelector(q);
const $$ = (q, scope=document) => Array.from(scope.querySelectorAll(q));

function go(page){
  S.page = page;
  $$('.section').forEach(s => s.classList.remove('active'));
  $('#' + page).classList.add('active');
  window.scrollTo({top:0, behavior:'instant'});
  updateNavActive(page);
  if (page === 'results') renderResults();
  if (page === 'plans') ensurePayhip();
}

function updateNavActive(page){
  $$('.nav-btn').forEach(b => b.classList.remove('active'));
  const map = {welcome:'nav-home', traits:'nav-discover', results:'nav-snapshot'};
  if (map[page]) $('#'+map[page]).classList.add('active');
}

async function loadTraits(){
  const res = await fetch('traits.json');
  const traits = await res.json();
  const grid = $('#traitsGrid');
  grid.innerHTML = '';
  traits.forEach(t => {
    const div = document.createElement('div');
    div.className = 'trait';
    div.textContent = t;
    div.onclick = () => {
      if (S.selectedTraits.has(t)) {
        S.selectedTraits.delete(t);
        div.classList.remove('active');
      } else {
        S.selectedTraits.add(t);
        div.classList.add('active');
      }
      $('#toResults').disabled = S.selectedTraits.size < 5;
    };
    grid.appendChild(div);
  });
}

function renderResults(){
  const chosen = Array.from(S.selectedTraits).slice(0, 10);
  $('#chosenTraits').textContent = chosen.join(', ');
  // toy aligned roles based on traits count
  const roles = [
    'Strategy Consultant','Product Manager','Data Analyst',
    'UX Researcher','Operations Lead','Customer Success Manager'
  ];
  const list = $('#rolesList');
  list.innerHTML = '';
  roles.forEach(r => {
    const li = document.createElement('li');
    li.textContent = r;
    list.appendChild(li);
  });
}

function selectReflection(id){
  S.reflectionChoice = id;
  $$('#reflection .card').forEach(c => c.style.borderColor = 'rgba(255,255,255,.12)');
  $('#card-'+id).style.borderColor = 'rgba(74,133,255,.8)';
  $('#continueToPlans').disabled = false;
}

function ensurePayhip(){
  // Load Payhip script once
  if (!document.querySelector('script[src*="payhip.com/payhip.js"]')){
    const s = document.createElement('script');
    s.src = "https://payhip.com/payhip.js";
    s.async = true;
    document.head.appendChild(s);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  // nav
  $('#nav-home').onclick    = () => go('welcome');
  $('#nav-discover').onclick= () => go('traits');
  $('#nav-snapshot').onclick= () => go('results');

  // welcome
  $('#startNova').onclick = () => go('traits');

  // traits
  loadTraits();
  $('#toResults').onclick = () => go('results');

  // results
  $('#toReflection').onclick = () => go('reflection');

  // reflection
  $('#backToResults').onclick = () => go('results');
  $('#continueToPlans').onclick = () => go('plans');

  // plans
  $('#toNavi').onclick = () => go('navi');
  $('#toThanks').onclick = () => go('thanks');

  // start
  go('welcome');
});
