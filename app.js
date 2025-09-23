// Router + simple persistence across steps
(function(){
  const views = {
    welcome: document.getElementById('view-welcome'),
    traits: document.getElementById('view-traits'),
    results: document.getElementById('view-results'),
    reflection: document.getElementById('view-reflection'),
    choosePath: document.getElementById('view-choose-path'),
    where: document.getElementById('view-where'),
    plans: document.getElementById('view-plans')
  };
  const crumbs = document.getElementById('crumbs');

  function show(view){
    Object.values(views).forEach(v => v.classList.add('hide'));
    views[view].classList.remove('hide');
    crumbs.textContent = views[view].dataset.step;
    location.hash = view;
  }

  // handle button navigation
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-goto]');
    if(!btn) return;
    const next = btn.getAttribute('data-goto');
    if(next === 'where-are-you') show('where');
    else show(next.replace(/-/g,'')); // normalize ids like 'choose-path'
  });

  // capture selected path
  let chosenPath = null;
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-path]');
    if(!btn) return;
    chosenPath = btn.getAttribute('data-path');
    localStorage.setItem('navi_chosen_path', chosenPath);
  });

  // reflection persistence
  const keyWhere = 'nova_reflect_where_am_i';
  const keyMile = 'nova_reflect_milestones';
  const txtWhere = document.getElementById('where-am-i');
  const inputM = document.getElementById('milestones');
  const saveBtn = document.getElementById('save-reflection');
  function restoreReflection(){
    if(txtWhere) txtWhere.value = localStorage.getItem(keyWhere) || '';
    if(inputM) inputM.value = localStorage.getItem(keyMile) || '';
  }
  function saveReflection(){
    if(txtWhere) localStorage.setItem(keyWhere, txtWhere.value.trim());
    if(inputM) localStorage.setItem(keyMile, inputM.value.trim());
    alert('Reflection saved.');
  }
  if(saveBtn) saveBtn.addEventListener('click', saveReflection);

  // where-are-you persistence
  const selStatus = document.getElementById('status');
  const selResume = document.getElementById('resume');
  const inputTime = document.getElementById('time');
  const saveWhere = document.getElementById('save-where');
  function restoreWhere(){
    if(selStatus) selStatus.value = localStorage.getItem('navi_status') || '';
    if(selResume) selResume.value = localStorage.getItem('navi_resume') || '';
    if(inputTime) inputTime.value = localStorage.getItem('navi_time') || '';
  }
  function saveWhereNow(){
    if(selStatus) localStorage.setItem('navi_status', selStatus.value);
    if(selResume) localStorage.setItem('navi_resume', selResume.value);
    if(inputTime) localStorage.setItem('navi_time', inputTime.value);
    alert('Saved.');
  }
  if(saveWhere) saveWhere.addEventListener('click', saveWhereNow);

  // init route
  const start = (location.hash || '#welcome').replace('#','');
  const valid = {welcome:1, traits:1, results:1, reflection:1, 'choose-path':1, where:1, plans:1};
  if(!valid[start]) show('welcome');
  else {
    if(start === 'choose-path') show('choosePath');
    else if(start === 'where-are-you') show('where');
    else show(start);
  }
  restoreReflection();
  restoreWhere();
})();