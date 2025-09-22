export const Nova = {
  async loadTraits(){
    const res = await fetch('./data/traits.json');
    return await res.json();
  },

  view(){
    return `
      <section class="section">
        <h2>Discover Your Purpose (NOVA)</h2>
        <div class="controls">
          <input id="traitSearch" type="search" placeholder="Search traits…">
          <button id="clearTraits" class="btn ghost">Clear</button>
        </div>
        <div id="traitsGrid" class="grid"></div>
        <div class="actions">
          <a class="btn ghost" href="#/home">Back</a>
          <a id="seeResult" class="btn primary" href="#/result">See My Snapshot</a>
        </div>
      </section>
    `;
  },

  resultView(state){
    const list = [...state.selectedTraits].sort();
    const summary = list.length ? list.join(', ') : 'No traits selected yet.';
    return `
      <section class="section">
        <h2>Your NOVA Snapshot</h2>
        <p><strong>Top Traits:</strong> ${summary}</p>
        <div class="actions">
          <a class="btn ghost" href="#/nova">Edit Traits</a>
          <a class="btn primary" href="#/navi">Build with NAVI</a>
        </div>
      </section>
    `;
  },

  async mount(state){
    const grid = document.getElementById('traitsGrid');
    const search = document.getElementById('traitSearch');
    const clearBtn = document.getElementById('clearTraits');
    const traits = await this.loadTraits();

    function render(filter=''){
      const q = filter.trim().toLowerCase();
      grid.innerHTML = traits
        .filter(t => t.toLowerCase().includes(q))
        .map(t => {
          const sel = state.selectedTraits.has(t) ? 'selected' : '';
          const checked = state.selectedTraits.has(t) ? 'checked' : '';
          return `<label class="trait ${sel}"><input type="checkbox" ${checked} data-trait="${t}"><span>${t}</span></label>`;
        }).join('');
      grid.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', (e)=>{
          const name = e.target.getAttribute('data-trait');
          if(e.target.checked){ state.selectedTraits.add(name); }
          else { state.selectedTraits.delete(name); }
          e.target.parentElement.classList.toggle('selected', e.target.checked);
        });
      });
    }
    render();

    search.addEventListener('input', (e)=> render(e.target.value));
    clearBtn.addEventListener('click', ()=>{
      state.selectedTraits.clear();
      render(search.value);
    });
  }
};
