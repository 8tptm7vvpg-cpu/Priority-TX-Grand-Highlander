// POWERTRAIN SELECTOR: correct model-specific figures, keyboard navigation.
const data={350:['275','HORSEPOWER','Your introduction to TX luxury.','Turbocharged gas power. Choose front-wheel drive or available all-wheel drive.'],500:['366','NET COMBINED HORSEPOWER','Give the everyday a sportier side.','TX 500h F SPORT Performance pairs hybrid power with standard DIRECT4 all-wheel drive.'],550:['404','NET COMBINED HORSEPOWER','Take your next step into electrification.','TX 550h+ combines a V6 plug-in hybrid powertrain with standard DIRECT4 all-wheel drive.']};
const tabs=[...document.querySelectorAll('[role="tab"]')];function select(tab){tabs.forEach(t=>{t.setAttribute('aria-selected',String(t===tab));t.tabIndex=t===tab?0:-1});const d=data[tab.dataset.model];['power-number','power-unit','power-title','power-desc'].forEach((id,i)=>document.getElementById(id).textContent=d[i]);document.getElementById('power-panel').setAttribute('aria-labelledby',tab.id);document.getElementById('model-seats').textContent=tab.dataset.model==='350'?'6–7':'6';document.getElementById('power-number').dataset.count=d[0];animateNumber(document.getElementById('power-number'),Number(d[0]))}tabs.forEach((t,i)=>{t.addEventListener('click',()=>select(t));t.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(i+1)%tabs.length;if(e.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;if(e.key==='Home')next=0;if(e.key==='End')next=tabs.length-1;if(next!==undefined){e.preventDefault();select(tabs[next]);tabs[next].focus()}})});
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
 window.setTimeout(close, 4500);
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
document.getElementById('palette-context').textContent=`${drive.options[drive.selectedIndex].text} · ${g}${drive.value==='350'&&!sport?' · FWD / AWD':''}${material?' · '+material:''}`;grid.replaceChildren();names.forEach((name,i)=>{const b=document.createElement('div');b.className='swatch';b.style.setProperty('--swatch',`linear-gradient(135deg,${shades[name][0]},${shades[name][1]} 48%,${shades[name][0]})`);b.innerHTML='<i aria-hidden="true"></i><span>'+name+'</span>';grid.append(b);});}
function reset(){grade.replaceChildren(...grades[drive.value].map(n=>new Option(n,n)));render();}drive.onchange=reset;grade.onchange=render;document.querySelectorAll('[data-palette]').forEach(b=>b.onclick=()=>{mode=b.dataset.palette;document.querySelectorAll('[data-palette]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render();});reset();
})();
// Gallery reads embedded source images, so the standalone page needs no network.
(() => {let category='exterior',index=0;const sets={exterior:[...document.querySelectorAll('[data-gallery-source="exterior"]')],interior:[...document.querySelectorAll('[data-gallery-source="interior"]')]};function render(){const list=sets[category],src=list[index];if(!src)return;const img=document.getElementById('gallery-image');img.src=src.src;img.alt=src.alt;document.getElementById('gallery-caption').textContent=`${index+1} / ${list.length} · ${src.alt}`;}document.querySelectorAll('[data-gallery]').forEach(b=>b.onclick=()=>{category=b.dataset.gallery;index=0;document.querySelectorAll('[data-gallery]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render();});document.getElementById('gallery-prev').onclick=()=>{index=(index-1+sets[category].length)%sets[category].length;render();};document.getElementById('gallery-next').onclick=()=>{index=(index+1)%sets[category].length;render();};render();})();
// Gentle scroll-linked photo movement; paused automatically for reduced motion.
(() => {const mq=matchMedia('(prefers-reduced-motion: reduce)');const photos=[...document.querySelectorAll('.hero-photo,.experience-photo img,#gallery-image')];photos.forEach(p=>p.classList.add('parallax-image'));let pending=false;function update(){pending=false;photos.forEach(p=>{if(mq.matches){p.style.transform='none';return;}const r=p.parentElement.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight){const y=Math.max(-22,Math.min(22,(innerHeight/2-r.top-r.height/2)*.055));p.style.transform=`translateY(${y}px) scale(1.08)`;}});}addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(update);}},{passive:true});addEventListener('resize',update);mq.addEventListener?.('change',update);update();})();

// SECTION MENU: keyboard accessible, dismissible, closes on section selection.
const menuButton=document.querySelector('.menu-toggle'),menu=document.getElementById('section-menu');
function closeMenu(){menu.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open section menu');}
menuButton.onclick=()=>{menu.hidden=!menu.hidden;menuButton.setAttribute('aria-expanded',String(!menu.hidden));menuButton.setAttribute('aria-label',menu.hidden?'Open section menu':'Close section menu');};
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden){closeMenu();menuButton.focus();}});document.addEventListener('click',e=>{if(!e.target.closest('header'))closeMenu();});
// NUMBER MOTION: one viewport entrance per figure; updates cancel prior frames.
function animateNumber(el,target){if(el._frame)cancelAnimationFrame(el._frame);const decimals=Number.isInteger(target)?0:1;if(matchMedia('(prefers-reduced-motion: reduce)').matches){el.textContent=target;return;}const start=performance.now();function tick(t){const k=Math.min(1,(t-start)/900);el.textContent=(target*(1-Math.pow(1-k,3))).toFixed(decimals);if(k<1)el._frame=requestAnimationFrame(tick);}el._frame=requestAnimationFrame(tick);}
const numberObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){animateNumber(e.target,Number(e.target.dataset.count));numberObserver.unobserve(e.target);}}),{threshold:.6});document.querySelectorAll('[data-count]').forEach(el=>numberObserver.observe(el));
// SPACE COMPARISON: all bars remain proportional; text explains genuine tradeoffs.
const spaceData={length:[203.1,201.4,210,'Overall exterior length · inches','The TX 350 is 1.7 inches longer overall. Exterior length does not establish greater passenger space.'],legroom:[33.5,33.5,40,'Third-row legroom · inches','Both publish 33.5 inches of third-row legroom. Experience the TX’s seating, materials and easy-access second row in person.'],cargo:[20.2,20.6,25,'Cargo behind third row · cubic feet','The Grand Highlander has 0.4 cu. ft. more behind the third row. The TX offers 20.2 cu. ft. with every seat upright.'],seats:[7,8,8,'Maximum seating · passengers','The TX seats six or seven, depending on configuration. No eight-seat TX is offered. The Grand Highlander offers up to eight.']};
document.querySelectorAll('[data-space]').forEach(b=>b.onclick=()=>{const d=spaceData[b.dataset.space];document.querySelectorAll('[data-space]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));document.getElementById('space-tx').dataset.count=d[0];document.getElementById('space-gh').dataset.count=d[1];animateNumber(document.getElementById('space-tx'),d[0]);animateNumber(document.getElementById('space-gh'),d[1]);document.getElementById('tx-bar').style.width=d[0]/d[2]*100+'%';document.getElementById('gh-bar').style.width=d[1]/d[2]*100+'%';document.getElementById('space-label').textContent=d[3];document.getElementById('space-insight').textContent=d[4];});
// Additional depth: decorative light moves behind the space comparison while scrolling.
(()=>{const section=document.querySelector('.space');let pending=false;function draw(){pending=false;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const y=section.getBoundingClientRect().top;section.style.setProperty('--glow-y',Math.max(-80,Math.min(80,y*.12))+'px');}addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(draw);}},{passive:true});})();
