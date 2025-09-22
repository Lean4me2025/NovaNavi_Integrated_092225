export const Nova = {
  async loadTraits(){ const res = await fetch('./data/traits.json'); return await res.json(); },
  async loadRoles(){ const res = await fetch('./data/roles.json'); return await res.json(); },

  view(){
    return `
      <section class="section">
        <h2>Discover Your Purpose (NOVA)</h2>

        <div class="sticky-actions" role="region" aria-label="Trait actions">
          <div class="row">
            <input id="traitSearch" type="search" placeholder="Search traits…">
            <a id="seeResultTop" class="btn primary" href="#/result">See My Snapshot</a>
            <button id="clearTraits" class="btn ghost" type="button">Clear</button>
          </div>
        </div>

        <div id="traitsGrid" class="grid" aria-live="polite"></div>

        <div class="actions">
          <a class="btn ghost" href="#/home">Back</a>
          <a id="seeResult" class="btn primary" href="#/result">See My Snapshot</a>
        </div>
      </section>
    `;
  },},

  // Renders the snapshot with role suggestions + domain overview
  resultTemplate(summary, domainHtml, roleCards, hasChosen){
    return `
      <section class="section">
        <h2>Your NOVA Snapshot</h2>
        <p><strong>Top Traits:</strong> ${summary}</p>

        <div class="section" style="margin-top:1rem">
          <h3>Purpose Domains</h3>
          <div class="cards4">${domainHtml}</div>
        </div>

        <div class="section" style="margin-top:1rem">
          <h3>Suggested Roles (choose one to focus)</h3>
          <div id="roleCards" class="cards4">${roleCards}</div>
          <p class="fineprint">Choose a role to set your focus; NAVI will build the pathway.</p>
        </div>

        <div class="actions">
          <a class="btn ghost" href="#/nova">Edit Traits</a>
          <a id="reflectRefine" class="btn ghost" href="#/reflect">Reflect & Refine</a>
          <a class="btn primary ${hasChosen ? '' : 'disabled'}" id="toNavi" href="${hasChosen ? '#/navi' : 'javascript:void(0)'}">Build with NAVI</a>
        </div>
      </section>
    `;
  },

  // Builds domain summary HTML based on top ranked roles
  domainsSummary(ranked){
    const groups = {};
    ranked.forEach(r=>{ groups[r.domain] = (groups[r.domain]||0) + 1; });
    const entries = Object.entries(groups).sort((a,b)=> b[1]-a[1]);
    return entries.slice(0,4).map(([d,cnt])=>`
      <div class="card"><h4>${d}</h4><p><small>${cnt} matching role${cnt>1?'s':''}</small></p></div>
    `).join('') || `<div class="card"><p>No domains yet — select a few traits.</p></div>`;
  },

  async resultView(state){
    const traits = [...state.selectedTraits].sort();
    const summary = traits.length ? traits.join(', ') : 'No traits selected yet.';

    const allRoles = await this.loadRoles().catch(()=>[]);
    const tset = new Set(traits.map(s=>s.toLowerCase()));

    const boosts = new Set((state.reflection?.boosts || []).map(s=>s.toLowerCase()));
    const ranked = allRoles.map(r => {
      const base = (r.signals||[]).filter(s => tset.has(s.toLowerCase())).length;
      const bonus = (r.signals||[]).filter(s => boosts.has(s.toLowerCase())).length * 0.5;
      const hits = base + bonus;
      return { ...r, score: hits };
    }).sort((a,b)=> b.score - a.score).slice(0,8);

    const cards = ranked.map((r,idx)=>{
      const chosen = (state.selectedRole && state.selectedRole.title === r.title) ? 'style="outline:2px solid var(--accent)"' : '';
      return `<div class="card" ${chosen}>
        <h4>${r.title}</h4>
        <p>${r.summary}</p>
        <p><small>Signals: ${(r.signals||[]).join(', ')}</small></p>
        <button class="btn ghost" data-choose-role="${idx}">Choose</button>
      </div>`;
    }).join('') || `<p>No suggestions yet. Try selecting a few more traits.</p>`;

    const domainHtml = this.domainsSummary(ranked);
    const hasChosen = !!state.selectedRole;
    const html = this.resultTemplate(summary, domainHtml, cards, hasChosen);

    // Return HTML string; the router will set innerHTML then we bind events in mountResult
    return html;
  },

  async mount(state){
    // If traits grid present → we're on the trait selection screen
    const grid = document.getElementById('traitsGrid');
    if(grid){
      const search = document.getElementById('traitSearch');
      const clearBtn = document.getElementById('clearTraits');
      const traits = await this.loadTraits();

      const render = (filter='')=>{
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
      };
      render();

      search.addEventListener('input', (e)=> render(e.target.value));
      clearBtn.addEventListener('click', ()=>{ state.selectedTraits.clear(); render(search.value); });
      return;
    }

    // Otherwise we might be on result page: wire "Choose" buttons if present
    const roleContainer = document.getElementById('roleCards');
    if(roleContainer){
      const roles = await this.loadRoles();
      roleContainer.addEventListener('click', (e)=>{
        const btn = e.target.closest('[data-choose-role]');
        if(!btn) return;
        const idx = parseInt(btn.getAttribute('data-choose-role'));
        // Recompute ranking to map index consistently
        const tset = new Set([...state.selectedTraits].map(s=>s.toLowerCase()));
        const ranked = roles.map(r=>({ ...r, score:(r.signals||[]).filter(s=>tset.has(s.toLowerCase())).length }))
                            .sort((a,b)=> b.score-a.score).slice(0,8);
        const chosen = ranked[idx];
        state.selectedRole = { title: chosen.title, domain: chosen.domain, summary: chosen.summary, path: chosen.path||[] };
        // Visual outline refresh
        document.querySelectorAll('#roleCards .card').forEach(c=> c.style.outline='none');
        btn.closest('.card').style.outline='2px solid var(--accent)';
        const toNavi = document.getElementById('toNavi');
        if(toNavi){ toNavi.classList.remove('disabled'); toNavi.setAttribute('href','#/navi'); }
      });
    }
  }
};
