// Minimal router + robust CTA
const el = (s)=>document.querySelector(s);
function setYear(){ const y=el('#year'); if(y) y.textContent=new Date().getFullYear(); }

function bindStartNova(){
  const cta = document.getElementById('startNovaCta');
  if(!cta) return;
  const go = ()=>{ location.hash = '#/nova'; };
  cta.addEventListener('click', (e)=>{ e.preventDefault(); go(); });
  cta.addEventListener('keydown', (e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); go(); }});
}

function render(route){
  // Home is pre-rendered; just bind CTA
  if(route==='home' || !route){ bindStartNova(); return; }
  if(route==='nova'){
    const app = el('#app');
    app.innerHTML = `
      <section class="section card">
        <h1>Discover with NOVA</h1>
        <p>Select the traits that describe you (demo view so you can continue testing):</p>
        <div class="traits">
          ${['Creative','Innovative','Problem Solver','Planner','Patient','Design Thinker','Resilient']
            .map(t=>`<label class="chip"><input type="checkbox"> ${t}</label>`).join('')}
        </div>
        <div class="actions"><a class="btn" href="#/home">Back</a></div>
      </section>`;
  }
}

function routeFromHash(){
  const raw = location.hash || '#/home';
  const h = raw.replace(/^#+/,'').replace(/^\//,'').trim();
  return h || 'home';
}

window.addEventListener('hashchange', ()=>render(routeFromHash()));
document.addEventListener('DOMContentLoaded', ()=>{ setYear(); render(routeFromHash()); bindStartNova(); });
