import { Nova } from './modules/nova.js';
import { Reflection } from './modules/reflection.js';
import { Navi } from './modules/navi.js';

const el = (sel) => document.querySelector(sel);

const state = {
  selectedTraits: new Set(),
  novaSummary: null,
  resumeDraft: '',
  coverLetterDraft: '',
};

function render(route){
  const app = el('#app');
  switch(route){
    case 'reflect':
      document.querySelector('#app').innerHTML = Reflection.view(state);
      Reflection.mount(state);
      break;
    case 'home':
      app.innerHTML = `
        <section class="section">
          <h2>Welcome</h2>
          <p>NOVA helps you discover your purpose profile. NAVI turns it into resumes, letters, and roles.</p>
          <div class="actions">
            <a class="btn primary" href="#/reflect">Start with Reflection</a>
            <a class="btn ghost" href="#/navi">Jump to NAVI</a>
          </div>
        </section>
      `;
      break;
    case 'nova':
      app.innerHTML = Nova.view();
      Nova.mount(state);
      break;
    case 'result':
      app.innerHTML = Nova.resultView(state);
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
  document.getElementById('year').textContent = new Date().getFullYear();
  render(routeFromHash());
});
