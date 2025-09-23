// Shared helpers
const go = (page) => window.location.href = page;
const save = (k,v) => localStorage.setItem(k, JSON.stringify(v));
const load = (k, d=null) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch(e){ return d; } };

// Trait list (50)
const TRAITS = [
  "Analytical", "Creative", "Empathetic", "Leader", "Detail-Oriented", "Strategic",
  "Communicator", "Problem Solver", "Organizer", "Curious", "Resilient", "Adaptable",
  "Collaborative", "Independent", "Visionary", "Innovative", "Hands-on", "Process-Driven",
  "Data-Driven", "Customer-Centric", "Teacher", "Mentor", "Researcher", "Builder",
  "Planner", "Finisher", "Big-Picture", "Practical", "Ethical", "Calm Under Pressure",
  "Persuasive", "Listener", "Fast Learner", "Technical", "Design-Thinking", "Systems-Oriented",
  "Quality-Focused", "Service-Oriented", "Entrepreneurial", "Financially Savvy", "Results-Focused",
  "Growth Mindset", "Storyteller", "Networker", "Decision-Maker", "Change Agent",
  "Curator", "Reliable", "Diligent", "Resourceful"
];

// Render traits grid if container exists
function renderTraits() {
  const host = document.getElementById('traits-grid');
  if (!host) return;
  host.innerHTML = '';
  const selected = new Set(load('nova.selectedTraits', []));
  TRAITS.forEach((t, i) => {
    const id = `trait_${i}`;
    const item = document.createElement('label');
    item.className = 'card';
    item.style.display = 'flex';
    item.style.alignItems = 'center';
    item.style.gap = '10px';
    item.innerHTML = `
      <input type="checkbox" id="${id}" ${selected.has(t) ? 'checked' : ''}/>
      <span>${t}</span>
    `;
    item.querySelector('input').addEventListener('change', (e) => {
      if (e.target.checked) { selected.add(t); } else { selected.delete(t); }
      save('nova.selectedTraits', Array.from(selected));
    });
    host.appendChild(item);
  });
}

// Generate aligned roles (placeholder demo logic)
function computeAlignedRoles(traits) {
  // Very simple mapping demo; replace with your scoring later
  const roles = [
    { role: "Process Engineer", why: "Strong in Process/Quality/Systems traits", match: 0.86 },
    { role: "Product Manager", why: "Blend of Strategy, Communication, Decision-making", match: 0.83 },
    { role: "Data Analyst", why: "Analytical, Curious, Data-Driven", match: 0.81 },
    { role: "Operations Manager", why: "Organizer, Results-Focused, Calm Under Pressure", match: 0.8 },
    { role: "Innovation Lead", why: "Creative, Visionary, Change Agent", match: 0.78 },
  ];
  // Bump scores if traits include certain anchors
  const bump = (key, inc) => { if (traits.includes(key)) roles.forEach(r => r.match = +(r.match + inc).toFixed(2)); };
  if (traits.includes("Process-Driven")) bump("Process-Driven", 0.02);
  if (traits.includes("Data-Driven")) bump("Data-Driven", 0.02);
  if (traits.includes("Leader")) bump("Leader", 0.01);
  return roles.sort((a,b)=>b.match-a.match);
}

function renderResults() {
  const host = document.getElementById('roles-table');
  if (!host) return;
  const traits = load('nova.selectedTraits', []);
  const roles = computeAlignedRoles(traits);
  host.innerHTML = roles.map(r => `
    <tr>
      <td>${r.role}</td>
      <td>${r.why}</td>
      <td>${Math.round(r.match*100)}%</td>
    </tr>
  `).join('');
  // Show selected trait chips
  const chips = document.getElementById('selected-traits');
  if (chips) {
    chips.innerHTML = traits.map(t => `<span class="badge">${t}</span>`).join(' ');
  }
}

function initReflection() {
  const area = document.getElementById('reflection-notes');
  if (!area) return;
  area.value = load('nova.reflection', "") || "";
  document.getElementById('save-reflection').addEventListener('click', () => {
    save('nova.reflection', area.value);
    const msg = document.getElementById('saved-msg');
    msg.textContent = "Saved ✓";
    setTimeout(()=> msg.textContent = "", 1500);
  });
}
document.addEventListener('DOMContentLoaded', () => {
  renderTraits();
  renderResults();
  initReflection();
});
