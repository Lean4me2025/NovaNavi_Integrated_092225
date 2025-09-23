(function(){
  const app = document.getElementById('app');
  const setYear = ()=>{ var y=document.getElementById('year'); if(y){ y.textContent = new Date().getFullYear(); } };
  setYear();

  function bindStartNova(){
    ['startNovaTop','startNovaBackup'].forEach(id => {
      const el = document.getElementById(id);
      if(!el) return;
      const go = ()=>{ location.hash = '#/nova'; };
      el.addEventListener('click', e=>{ e.preventDefault(); go(); });
      el.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); go(); }});
    });
  }

  function viewHome(){
    return document.querySelector('main').innerHTML; // prerendered content
  }

  function viewNova(){
    return `
      <section class="section">
        <h1>Discover with NOVA</h1>
        <p>Select the traits that describe you. (Demo view)</p>
        <div class="traits">
          ${['Creative','Innovative','Problem Solver','Planner','Patient','Design Thinker','Resilient']
             .map(t => `<label class="chip"><input type="checkbox"> ${t}</label>`).join('')}
        </div>
        <div class="actions">
          <a href="#/home" class="btn">Back</a>
        </div>
      </section>`;
  }

  function render(){
    const hash = (location.hash || '#/home').replace(/^#+/,'#');
    if(hash.startsWith('#/nova')){
      app.innerHTML = viewNova();
    } else {
      app.innerHTML = viewHome();
      bindStartNova();
    }
  }

  window.addEventListener('hashchange', render);
  document.addEventListener('DOMContentLoaded', render);
  render();
})();