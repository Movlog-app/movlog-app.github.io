const supportedLanguages=['ko','en'];
const defaultLanguage='ko';
let language=localStorage.getItem('movlog-language')||defaultLanguage;

const messages={
  ko:{
    'nav.home':'홈',
    'updates.eyebrow':'MOVLOG CHANGELOG',
    'updates.title':'Movlog의<br><i>변화의 기록.</i>',
    'updates.description':'첫 출시부터 지금까지, Movlog가 걸어온 길을 기록합니다.',
    'language.switch':'영어로 변경',
    'updates.latest':'LATEST UPDATE',
    'updates.details':'자세히 보기',
    'updates.close':'접기',
    'updates.new':'NEW',
    'updates.improved':'IMPROVED',
    'updates.design':'DESIGN',
    'updates.performance':'PERFORMANCE',
    'updates.fixed':'FIXED',
    'updates.feature':'FEATURE'
  },
  en:{
    'nav.home':'Home',
    'updates.eyebrow':'MOVLOG CHANGELOG',
    'updates.title':'The story of<br><i>Movlog evolving.</i>',
    'updates.description':'From the first release to today, a record of Movlog in motion.',
    'language.switch':'Switch to Korean',
    'updates.latest':'LATEST UPDATE',
    'updates.details':'View details',
    'updates.close':'Collapse',
    'updates.new':'NEW',
    'updates.improved':'IMPROVED',
    'updates.design':'DESIGN',
    'updates.performance':'PERFORMANCE',
    'updates.fixed':'FIXED',
    'updates.feature':'FEATURE'
  }
};

const toggle=document.getElementById('language-toggle');
const escapeHtml=value=>String(value).replace(/[&<>"']/g,character=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[character]));

function getTags(update,m){
  const text=update.items.join(' ').toLowerCase();
  const tags=[];
  if(update===window.__latestUpdate) tags.push(m['updates.new']);
  if(/추가|added|add|new|지원|support|gallery|weather|theme|photo|사진|날씨|테마/.test(text)) tags.push(m['updates.feature']);
  if(/개선|improv|향상|성능|performance|stabil|안정|정확|accur/.test(text)) tags.push(m['updates.improved']);
  if(/디자인|design|아이콘|icon|화면|screen|ui|테마|theme/.test(text)) tags.push(m['updates.design']);
  if(/버그|bug|fix|문제|오류|수정|issue/.test(text)) tags.push(m['updates.fixed']);
  return [...new Set(tags)].slice(0,3);
}

function updateBody(update){
  return '<ul>'+update.items.map(item=>'<li>'+escapeHtml(item)+'</li>').join('')+'</ul>';
}

function renderUpdate(update,index,m){
  const latest=index===0;
  const tags=getTags(update,m).map(tag=>'<span>'+escapeHtml(tag)+'</span>').join('');
  const date='<time datetime="'+escapeHtml(update.date)+'">'+escapeHtml(update.date)+'</time>';
  if(latest){
    return '<article class="update-card latest"><div class="update-topline"><span class="update-kicker">'+m['updates.latest']+'</span>'+date+'</div><div class="update-heading"><div><span class="update-version">v'+escapeHtml(update.version)+'</span><h2>'+escapeHtml(update.title)+'</h2></div><span class="update-symbol" aria-hidden="true">↗</span></div><div class="update-tags">'+tags+'</div><div class="update-body">'+updateBody(update)+'</div></article>';
  }
  return '<article class="update-card timeline-item"><div class="update-marker" aria-hidden="true"></div><div class="update-card-inner"><div class="update-meta"><strong>v'+escapeHtml(update.version)+'</strong>'+date+'</div><h2>'+escapeHtml(update.title)+'</h2><button class="update-toggle" type="button" aria-expanded="false"><span>'+m['updates.details']+'</span><span aria-hidden="true">+</span></button><div class="update-body" hidden>'+updateBody(update)+'</div></div></article>';
}

async function render(next){
  language=next;
  const [localeResponse,updatesResponse]=await Promise.all([
    fetch('locales/'+language+'.json'),
    fetch('updates.json')
  ]);
  const locale=await localeResponse.json();
  const all=await updatesResponse.json();
  const m={...messages[language],...locale};
  const current=all[language]||all[defaultLanguage]||[];
  window.__latestUpdate=current[0];
  document.documentElement.lang=language;
  document.title=language==='ko'?'Movlog 업데이트':'Movlog Updates';
  document.querySelectorAll('[data-i18n]').forEach(element=>{
    if(m[element.dataset.i18n]) element.innerHTML=m[element.dataset.i18n];
  });
  toggle.title=m['language.switch'];
  toggle.setAttribute('aria-label',m['language.switch']);
  document.getElementById('updates-list').innerHTML=current.map((update,index)=>renderUpdate(update,index,m)).join('');
  document.querySelectorAll('.update-toggle').forEach(button=>{
    button.addEventListener('click',()=>{
      const body=button.parentElement.querySelector('.update-body');
      const expanded=button.getAttribute('aria-expanded')==='true';
      button.setAttribute('aria-expanded',String(!expanded));
      body.hidden=expanded;
      button.querySelector('span').textContent=expanded?m['updates.details']:m['updates.close'];
      button.lastElementChild.textContent=expanded?'+':'−';
    });
  });
  localStorage.setItem('movlog-language',language);
}

toggle.addEventListener('click',()=>render(language==='ko'?'en':'ko'));
render(language).catch(console.error);
