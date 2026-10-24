// POWERTRAIN SELECTOR: correct model-specific figures, keyboard navigation.
const data={350:['275','HORSEPOWER','Your introduction to TX luxury.','Turbocharged gas power. Choose front-wheel drive or available all-wheel drive.'],500:['366','NET COMBINED HORSEPOWER','Give the everyday a sportier side.','TX 500h F SPORT Performance pairs hybrid power with standard DIRECT4 all-wheel drive.'],550:['404','NET COMBINED HORSEPOWER','Take your next step into electrification.','TX 550h+ combines a V6 plug-in hybrid powertrain with standard DIRECT4 all-wheel drive.']};
const tabs=[...document.querySelectorAll('[role="tab"]')];function select(tab){tabs.forEach(t=>{t.setAttribute('aria-selected',String(t===tab));t.tabIndex=t===tab?0:-1});const d=data[tab.dataset.model];['power-number','power-unit','power-title','power-desc'].forEach((id,i)=>document.getElementById(id).textContent=d[i]);document.getElementById('power-panel').setAttribute('aria-labelledby',tab.id)}tabs.forEach((t,i)=>{t.addEventListener('click',()=>select(t));t.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(i+1)%tabs.length;if(e.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;if(e.key==='Home')next=0;if(e.key==='End')next=tabs.length-1;if(next!==undefined){e.preventDefault();select(tabs[next]);tabs[next].focus()}})});
// Nonblocking entrance effects. Content remains available without JavaScript.
if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('js-motion');const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>io.observe(el))}
// CINEMATIC INTRO: content remains usable; cleanup is registered before playback.
(() => {
 const intro = document.querySelector('.cinematic-intro');
 if (!intro) return;
 const close = () => {
   document.documentElement.classList.remove('intro-playing');
   intro.hidden = true;
   intro.style.display = 'none';
   intro.setAttribute('aria-hidden', 'true');
   document.querySelectorAll('[inert]').forEach(el => el.removeAttribute('inert'));
 };
 const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if (reduced) { close(); return; }
 // Independent timeout and animation-end cleanup prevent a stuck overlay.
 window.setTimeout(close, 10000);
 intro.addEventListener('animationend', event => { if(event.target === intro) close(); });
 intro.querySelector('.intro-skip')?.addEventListener('click', close);
 document.addEventListener('keydown', event => { if(event.key === 'Escape') close(); });
 window.addEventListener('pagehide', close);
 intro.hidden = false;
 intro.setAttribute('aria-hidden', 'false');
 document.documentElement.classList.add('intro-playing');
})();
// TOOLBAR: browser-native full screen (where supported), refresh, and state sync.
const fs=document.getElementById('fullscreen-toggle'),status=document.getElementById('tool-status');
function syncFullscreen(){const on=Boolean(document.fullscreenElement);fs.setAttribute('aria-pressed',String(on));fs.setAttribute('aria-label',on?'Exit full screen':'Enter full screen');fs.title=on?'Exit full screen':'Enter full screen';fs.textContent=on?'⊡':'⛶';}
fs.addEventListener('click',async()=>{try{if(document.fullscreenElement){await document.exitFullscreen();}else if(document.documentElement.requestFullscreen){await document.documentElement.requestFullscreen();}else{status.textContent='Full screen is not supported by this browser.';}}catch(e){status.textContent='Full screen is unavailable in this browser window.'}syncFullscreen()});document.addEventListener('fullscreenchange',syncFullscreen);document.getElementById('refresh-page').addEventListener('click',()=>location.reload());
