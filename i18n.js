const supportedLanguages=['ko','en'];
const defaultLanguage='ko';
const toggle=document.getElementById('language-toggle');
let currentLanguage=localStorage.getItem('movlog-language')||defaultLanguage;
async function loadLanguage(language){
  if(!supportedLanguages.includes(language)) language=defaultLanguage;
  const response=await fetch('locales/'+language+'.json');
  if(!response.ok) throw new Error('Unable to load language: '+language);
  const messages=await response.json();
  document.documentElement.lang=language;
  document.title=messages['site.title'];
  document.querySelector('meta[name="description"]').setAttribute('content',messages['site.description']);
  document.querySelectorAll('[data-i18n]').forEach(element=>{
    const value=messages[element.dataset.i18n];
    if(value!==undefined) element.innerHTML=value;
  });
  document.querySelectorAll('[data-i18n-src]').forEach(element=>{
    const value=messages[element.dataset.i18nSrc];
    if(value!==undefined) element.setAttribute('src',value);
  });
  document.querySelectorAll('[data-i18n-alt]').forEach(element=>{
    const value=messages[element.dataset.i18nAlt];
    if(value!==undefined) element.setAttribute('alt',value);
  });
  const nextLanguage=language==='ko'?'en':'ko';
  toggle.setAttribute('aria-label',messages['language.switch']);
  toggle.setAttribute('title',messages['language.switch']);
  currentLanguage=language;
  localStorage.setItem('movlog-language',language);
}
toggle.addEventListener('click',()=>loadLanguage(currentLanguage==='ko'?'en':'ko').catch(console.error));
loadLanguage(currentLanguage).catch(()=>loadLanguage(defaultLanguage));
