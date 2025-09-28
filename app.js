/* NOVA + NAVI • Full Flow v1.5 */
/* Simple SPA Router + State */
const SCREENS = ["welcome","category","traits","results","reflection","plan","navi"];
const state = {
  category: null,
  traits: new Set(),
  results: null,
  reflection: null,
};

const PAYHIP_IDS = {
  BOOK: "N7Lvg",
  STARTER: "",   // TODO: add product ID when available
  PRO: "",       // TODO: add product ID when available
  MASTERY: "re4Hy"
};

const CATEGORIES = [
  "Business", "Healthcare", "Technology", "Creative", "Public Service",
  "Education", "Skilled Trades", "Sales & Service", "Logistics", "Finance"
];

// 50 traits (sample set; can be swapped with your canonical 50)
const TRAITS = [
  "Analytical", "Adaptable", "Creative", "Detail-Oriented", "Empathetic",
  "Strategic", "Leadership", "Collaboration", "Initiative", "Communication",
  "Problem-Solving", "Resilient", "Curious", "Organized", "Visionary",
  "Results-Driven", "Process-Minded", "Hands-On", "Technical Aptitude", "Numerical Reasoning",
  "Customer-Focused", "Quality-Oriented", "Innovative", "Calm Under Pressure", "Ethical",
  "Teaching Mindset", "Mentoring", "Research-Oriented", "Design Thinking", "Entrepreneurial",
  "Growth Mindset", "Time Management", "Listening", "Persuasive", "Open-Minded",
  "Systematic", "Resourceful", "Independent", "Team Player", "Precision",
  "Safety-Conscious", "Service-Oriented", "Bilingual/Multilingual", "Strategic Networking", "Data-Literate",
  "Coding Basics", "Mechanical Aptitude", "Spatial Reasoning", "Writing", "Presentation"
];

const REFLECTION = [
  {key: "now", title: "Working in my field now", blurb: "You’re active in your space and ready to sharpen your edge."},
  {key: "pivot", title: "Pivoting to a new field", blurb: "You’re exploring a move—let’s map a bridge and close gaps."},
  {key: "return", title: "Returning after a break", blurb: "You’re relaunching with experience—let’s rebuild momentum."},
  {key: "launch", title: "Launching for the first time", blurb: "You’re stepping in fresh—let’s choose an achievable path."},
];

/* Utilities */
function $(sel){ return document.querySelector(sel); }
function $all(sel){ return Array.from(document.querySelectorAll(sel)); }

function goTo(step){
  SCREENS.forEach(s => {
    const el = document.getElementById(`screen-${s}`);
    if (el) el.classList.toggle("active", s === step);
  });
  // breadcrumb (optional)
  const bc = document.getElementById("breadcrumb");
  if (!bc.classList.contains("hidden")) {
    $all("#breadcrumb li").forEach(li => li.classList.toggle("active", li.dataset.step === step));
  }
  localStorage.setItem('nova.lastStep', step);
  window.scrollTo(0,0);
}

function hydrateFromStorage(){
  try {
    const raw = localStorage.getItem("nova.state.v1");
    if (raw){
      const saved = JSON.parse(raw);
      state.category = saved.category || null;
      state.traits = new Set(saved.traits || []);
      state.results = saved.results || null;
      state.reflection = saved.reflection || null;
    }
  } catch(e){}
}
function persist(){
  const payload = {
    category: state.category,
    traits: Array.from(state.traits),
    results: state.results,
    reflection: state.reflection
  };
  localStorage.setItem("nova.state.v1", JSON.stringify(payload));
}

function renderCategories(){
  const grid = $("#categoryGrid");
  grid.innerHTML = "";
  CATEGORIES.forEach(cat => {
    const div = document.createElement("div");
    div.className = "cell selectable small";
    div.innerHTML = `<h4>${cat}</h4>`;
    if (state.category === cat) div.classList.add("active");
    div.addEventListener("click", () => {
      state.category = cat;
      persist();
      renderCategories();
      $("#toTraits").disabled = false;
    });
    grid.appendChild(div);
  });
}

function renderTraits(){
  const grid = $("#traitGrid");
  grid.innerHTML = "";
  const limit = 10;
  const remaining = limit - state.traits.size;
  $("#selectionsLeft").textContent = remaining;
  TRAITS.forEach(tr => {
    const div = document.createElement("div");
    div.className = "cell selectable small";
    div.setAttribute("data-trait", tr);
    div.textContent = tr;
    if (state.traits.has(tr)) div.classList.add("active");
    div.addEventListener("click", () => {
      if (state.traits.has(tr)) {
        state.traits.delete(tr);
      } else {
        if (state.traits.size >= limit) return; // enforce limit
        state.traits.add(tr);
      }
      persist();
      renderTraits();
      $("#seeResults").disabled = state.traits.size === 0;
    });
    grid.appendChild(div);
  });
  $("#seeResults").disabled = state.traits.size === 0;
}

function computeResults(){
  // Lightweight placeholder logic: echoes category + traits count, and infers rough role buckets.
  // Replace with your real scoring/mapping when ready.
  const rolesByCategory = {
    "Business": ["Operations Analyst", "Project Manager", "Business Consultant"],
    "Healthcare": ["Clinical Coordinator", "Health Informatics Analyst", "Patient Services Lead"],
    "Technology": ["Data Analyst", "QA Engineer", "Product Manager"],
    "Creative": ["UX Designer", "Content Strategist", "Brand Designer"],
    "Public Service": ["Program Specialist", "Community Outreach Coordinator", "Policy Analyst"],
    "Education": ["Instructional Designer", "Academic Advisor", "Training Coordinator"],
    "Skilled Trades": ["Field Technician", "Quality Inspector", "Maintenance Planner"],
    "Sales & Service": ["Account Executive", "Customer Success Manager", "Sales Operations"],
    "Logistics": ["Supply Chain Analyst", "Logistics Coordinator", "Inventory Planner"],
    "Finance": ["Financial Analyst", "Risk & Compliance Analyst", "Revenue Operations"]
  };
  const suggested = rolesByCategory[state.category] || ["Generalist Role"];
  const topTraits = Array.from(state.traits).slice(0, 5);

  return {
    category: state.category,
    count: state.traits.size,
    topTraits,
    suggested
  };
}

function renderResults(){
  state.results = computeResults();
  persist();
  const box = $("#resultsSummary");
  const r = state.results;
  box.innerHTML = `
    <p><strong>Category:</strong> ${r.category || "-"}</p>
    <p><strong>Traits Selected:</strong> ${r.count}</p>
    <p><strong>Top Traits:</strong> ${r.topTraits.join(", ") || "-"}</p>
    <div class="cell" style="margin-top:.6rem;">
      <h3 style="margin:.2rem 0 .4rem;">Aligned Roles</h3>
      <ul style="margin:.2rem 0 .2rem 1rem;">
        ${r.suggested.map(s => `<li>${s}</li>`).join("")}
      </ul>
    </div>
  `;
}

function renderReflection(){
  const grid = $("#reflectionOptions");
  grid.innerHTML = "";
  REFLECTION.forEach(opt => {
    const el = document.createElement("div");
    el.className = "cell selectable";
    el.innerHTML = `<h4>${opt.title}</h4><p class="sub">${opt.blurb}</p>`;
    if (state.reflection === opt.key) el.classList.add("active");
    el.addEventListener("click", () => {
      state.reflection = opt.key;
      persist();
      renderReflection();
      $("#toPlan").disabled = false;
    });
    grid.appendChild(el);
  });
  $("#toPlan").disabled = !state.reflection;
}

function wireNav(){
  // From Welcome
  $("#startFlowBtn")?.addEventListener("click", () => goTo("category"));
  $("#resumeLink")?.addEventListener("click", (e) => {
    e.preventDefault();
    const last = localStorage.getItem("nova.lastStep");
    goTo(last || "category");
  });

  // Generic back via data-nav
  $all("[data-nav]").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-nav");
      goTo(target);
      if (target === "category") renderCategories();
      if (target === "traits") renderTraits();
      if (target === "results") renderResults();
      if (target === "reflection") renderReflection();
    });
  });

  // Category → Traits
  $("#toTraits")?.addEventListener("click", () => {
    goTo("traits");
    renderTraits();
  });

  // Traits → Results
  $("#seeResults")?.addEventListener("click", () => {
    goTo("results");
    renderResults();
  });

  // Results → Reflection
  $("#toReflection")?.addEventListener("click", () => {
    goTo("reflection");
    renderReflection();
  });

  // Reflection → Plan
  $("#toPlan")?.addEventListener("click", () => {
    goTo("plan");
    // Activate Payhip buttons if IDs provided
    activatePayhipIfReady();
  });

  // Plan → Navi
  $("#toNavi")?.addEventListener("click", () => {
    goTo("navi");
  });
}

function activatePayhipIfReady(){
  // If you later add real product IDs, swap the disabled buttons for Payhip anchors.
  const starterBtn = document.querySelector(".plan:nth-child(2) .btn-disabled");
  const proBtn     = document.querySelector(".plan:nth-child(3) .btn-disabled");

  if (PAYHIP_IDS.STARTER){
    const a = document.createElement("a");
    a.href = `https://payhip.com/b/${PAYHIP_IDS.STARTER}`;
    a.className = "payhip-buy-button";
    a.dataset.theme = "green";
    a.dataset.product = PAYHIP_IDS.STARTER;
    a.textContent = "Buy Now";
    starterBtn.replaceWith(a);
  }
  if (PAYHIP_IDS.PRO){
    const a = document.createElement("a");
    a.href = `https://payhip.com/b/${PAYHIP_IDS.PRO}`;
    a.className = "payhip-buy-button";
    a.dataset.theme = "green";
    a.dataset.product = PAYHIP_IDS.PRO;
    a.textContent = "Buy Now";
    proBtn.replaceWith(a);
  }
}

function init(){
  hydrateFromStorage();
  // Default step
  const last = localStorage.getItem("nova.lastStep") || "welcome";
  goTo(last);
  renderCategories();
  // Traits grid and reflection options render lazily when entering screens
  $("#clearSelections")?.addEventListener("click", () => {
    state.traits.clear();
    persist();
    renderTraits();
  });
  wireNav();
}

document.addEventListener("DOMContentLoaded", init);
