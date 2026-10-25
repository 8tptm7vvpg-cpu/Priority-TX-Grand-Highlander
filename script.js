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
// COLOR EXPLORER: 2026 grade-specific palettes. Approximate gradients only.
(() => {
const drive=document.getElementById('color-drive'),grade=document.getElementById('color-grade'),grid=document.getElementById('swatches');
const grades={350:['Standard','Premium','Luxury','F SPORT Handling AWD'],500:['F SPORT Performance Premium AWD','F SPORT Performance Luxury AWD'],550:['Luxury AWD']};
const shades={'Wind Chill Pearl':['#b8b8b2','#fffef5'],'Celestial Silver Metallic':['#72777d','#e4e8eb'],'Cloudburst Gray':['#34383e','#8a9096'],'Caviar':['#040405','#45454a'],'Nightfall Mica':['#081323','#354d74'],'Matador Red Mica':['#39090d','#b13c45'],'Incognito':['#5c6060','#acb0ac'],'Birch':['#aaa79b','#eee9db'],'Black':['#070707','#44413d'],'Peppercorn':['#35241f','#846252']};let mode='exterior';
function render(){const g=grade.value,sport=g.includes('SPORT');let names,material='';if(mode==='exterior'){names=['Wind Chill Pearl','Celestial Silver Metallic',...(sport?[]:['Cloudburst Gray']),'Caviar','Nightfall Mica',sport?'Incognito':'Matador Red Mica'];}else{names=['Birch','Black',...(!sport&&g!=='Standard'?['Peppercorn']:[])];material=g.includes('Luxury')?(sport?'Leather':'Semi-aniline leather'):'NuLuxe®';}
document.getElementById('palette-context').textContent=`${drive.options[drive.selectedIndex].text} · ${g}${drive.value==='350'&&!sport?' · FWD / AWD':''}${material?' · '+material:''}`;grid.replaceChildren();names.forEach((name,i)=>{const b=document.createElement('button');b.type='button';b.className='swatch';b.setAttribute('aria-pressed',String(i===0));b.style.setProperty('--swatch',`linear-gradient(135deg,${shades[name][0]},${shades[name][1]} 48%,${shades[name][0]})`);b.innerHTML='<i aria-hidden="true"></i><span>'+name+'</span>';b.onclick=()=>{grid.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));document.getElementById('color-selection').textContent=name+(material?' · '+material:'');};grid.append(b);});document.getElementById('color-selection').textContent=names[0]+(material?' · '+material:'');}
function reset(){grade.replaceChildren(...grades[drive.value].map(n=>new Option(n,n)));render();}drive.onchange=reset;grade.onchange=render;document.querySelectorAll('[data-palette]').forEach(b=>b.onclick=()=>{mode=b.dataset.palette;document.querySelectorAll('[data-palette]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render();});reset();
})();
// Gallery reads embedded source images, so the standalone page needs no network.
(() => {let category='exterior',index=0;const sets={exterior:[...document.querySelectorAll('[data-gallery-source="exterior"]')],interior:[...document.querySelectorAll('[data-gallery-source="interior"]')]};function render(){const list=sets[category],src=list[index];if(!src)return;const img=document.getElementById('gallery-image');img.src=src.src;img.alt=src.alt;document.getElementById('gallery-caption').textContent=`${index+1} / ${list.length} · ${src.alt}`;}document.querySelectorAll('[data-gallery]').forEach(b=>b.onclick=()=>{category=b.dataset.gallery;index=0;document.querySelectorAll('[data-gallery]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render();});document.getElementById('gallery-prev').onclick=()=>{index=(index-1+sets[category].length)%sets[category].length;render();};document.getElementById('gallery-next').onclick=()=>{index=(index+1)%sets[category].length;render();};render();})();
// Gentle scroll-linked photo movement; paused automatically for reduced motion.
(() => {const mq=matchMedia('(prefers-reduced-motion: reduce)');const photos=[...document.querySelectorAll('.hero-photo,.experience-photo img,#gallery-image')];photos.forEach(p=>p.classList.add('parallax-image'));let pending=false;function update(){pending=false;photos.forEach(p=>{if(mq.matches){p.style.transform='none';return;}const r=p.parentElement.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight){const y=Math.max(-22,Math.min(22,(innerHeight/2-r.top-r.height/2)*.055));p.style.transform=`translateY(${y}px) scale(1.08)`;}});}addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(update);}},{passive:true});addEventListener('resize',update);mq.addEventListener?.('change',update);update();})();
