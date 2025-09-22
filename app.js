import { Nova } from './modules/nova.js';
import { Navi } from './modules/navi.js';
import { Reflection } from './modules/reflection.js';

const el = (sel) => document.querySelector(sel);

const state = {
  selectedTraits: new Set(),
  novaSummary: null,
  resumeDraft: '',
  coverLetterDraft: '',
  reflection: null,
  selectedRole: null,
};

function homeView(){
  return `
    <section class="section">
      <h1>Welcome to NOVA + NAVI</h1>
      <p class="stat"><strong>🌍 Did you know?</strong> <em>89% of people say they don’t truly know their purpose.</em></p>
      <p>That’s why NOVA exists — she was designed to help you <strong>discover and understand your purpose</strong> by uncovering the traits that make you who you are.</p>

      <div class="phase">
        <h2>Phase 1 — Who You Are (NOVA)</h2>
        <p>NOVA is on your side. She gently guides you through selecting the traits that describe you best. From there, she connects those traits to deeper attributes, and reveals career paths where your strengths naturally fit.</p>
      </div>

      <div class="phase">
        <h2>Phase 2 — Where You’re Going (NAVI)</h2>
        <p>Once you’ve discovered who you are, NAVI takes your profile and turns it into action:</p>
        <ul>
          <li>Resumes & cover letters that highlight your strengths</li>
          <li>Career roles aligned with your attributes</li>
          <li>Training & steps to help you grow into your purpose</li>
        </ul>
      </div>

      <div class="roadmap">
        <h3>How it works</h3>
        <div class="steps-row">
          <div class="step-box">
            <h4>Discover with NOVA</h4>
            <p>Choose traits that describe you.</p>
          </div>
          <div class="step-box">
            <h4>See your results</h4>
            <p>Get matched to attributes & roles.</p>
          </div>
          <div class="step-box">
            <h4>Reflect</h4>
            <p>Pause and consider your journey.</p>
          </div>
          <div class="step-box">
            <h4>Choose a role</h4>
            <p>Pick a focus role that fits.</p>
          </div>
          <div class="step-box">
            <h4>Build with NAVI</h4>
            <p>Turn discovery into resumes, letters, and steps.</p>
          </div>
        </div>
      </div>

      <p class="closing">✨ This isn’t just job matching — it’s uncovering who you were designed to be, and then charting where you can go.</p>

      <div class="steps-cta">
        <a class="btn primary" href="#/nova">Start with NOVA</a>
      </div>
    </section>
  `;
}

function render(route){
  const app = el('#app');
  switch(route){
    case 'home':
      app.innerHTML = homeView();
      break;
    case 'nova':
      app.innerHTML = Nova.view();
      Nova.mount(state);
      break;
    case 'result':
      Nova.resultView(state).then(html => {
        app.innerHTML = html;
        Nova.mount(state);
      });
      break;
    case 'reflect':
      app.innerHTML = Reflection.view(state);
      Reflection.mount(state);
      break;
    case 'navi':
      app.innerHTML = Navi.view();
      Navi.mount(state);
      break;
    case 'plans':
      app.innerHTML = `
        <section class="section">
          <h2>Level Up (Optional)</h2>
          <p class="subtitle">Choose a plan to unlock NAVI's tools and training.</p>
          <div class="cards4">
            <div class="card">
              <h3>Purpose Book</h3>
              <p>Downloadable guide to purpose & activation.</p>
              <a href="https://payhip.com/b/REPLACE_BOOK_ID" class="payhip-buy-button" data-product="REPLACE_BOOK_ID">Buy Now</a>
            </div>
            <div class="card">
              <h3>Starter</h3>
              <p>NOVA 50-trait report + basic resume & 1 cover letter.</p>
              <a href="https://payhip.com/b/GdfU7" class="payhip-buy-button" data-product="GdfU7">Buy Now</a>
            </div>
            <div class="card">
              <h3>Pro Suite</h3>
              <p>Resume rewrite AI, unlimited cover letters, company intel.</p>
              <a href="https://payhip.com/b/re4Hy" class="payhip-buy-button" data-product="re4Hy">Buy Now</a>
            </div>
            <div class="card">
              <h3>Mastery</h3>
              <p>Everything in Pro + 1:1 coaching & career roadmap.</p>
              <a href="https://payhip.com/b/REPLACE_MASTERY_ID" class="payhip-buy-button" data-product="REPLACE_MASTERY_ID">Buy Now</a>
            </div>
          </div>
        </section>
      `;
      break;
    default:
      location.hash = '#/home';
  }
}

function routeFromHash(){
  const h = location.hash.replace('#/','').trim();
  return h || 'home';
}

window.addEventListener('hashchange', () => render(routeFromHash()));
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  render(routeFromHash());
});
