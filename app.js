function resultView(){
    const chosen = state.traits.filter(t=>state.selected.has(t.name));
    const selectedNames = chosen.map(t=>t.name);
    const topRoles = scoreRoles(selectedNames);
    const traitBadges = chosen.map(t=>`<div class="badge"><h6>${t.name}</h6><p>${t.desc}</p></div>`).join('') || '<p>— No traits selected yet —</p>';
    const roleCards = topRoles.length? topRoles.map(r=>`<div class="role-card"><h6>${r.role}</h6><p>Matches: ${r.matched.join(', ')}</p></div>`).join('') : '<p>— Select a few traits to see aligned roles —</p>';
    return `<section class="section card">
      <h1>Your NOVA Snapshot</h1>
      <h3>Selected Traits (${chosen.length})</h3>
      <div class="badges">${traitBadges}</div>
      
        <div class="info-block">
          <h3>How your purpose is determined</h3>
          <p>✨ This isn’t random. Your traits reveal the way you naturally think, act, and contribute. We then compare your profile against the skills and requirements of more than 400 career paths. The result: a focused list of roles where your strengths are already aligned — so you can see practical, real-world fits for who you are.</p>
        </div>
        <h3 class="section-label">Aligned Roles</h3>
        
      <div class="role-cards">${roleCards}</div>
      <div class="actions" style="margin-top:.6rem">
        <a class="btn" href="#/nova">Edit Traits</a>
        <a class="btn primary" href="#/reflect">Reflect &amp; Refine</a>
      </div>
    </section>`;
  }
  