const NODES = [
  { id:'n1', title:'Bench / Shrine', author:'Nicholas', medium:'Visual Sketch + Ambient Video', url:'', audio:'', dur:8000, color:'#6aa1ff' },
  { id:'n2', title:'GarageBand Soundscape', author:'Gabby', medium:'Audio Composition', url:'', audio:'gabby-track.mp3', dur:8000, color:'#ffce9e' },
  { id:'n3', title:'Line Sketch', author:'Oscar', medium:'Digital Sketch / Visual Loop', url:'', audio:'', dur:8000, color:'#9effc7' },
  { id:'n4', title:'Form Study', author:'Bryan', medium:'Drawing / Animation', url:'', audio:'', dur:8000, color:'#ff9ed7' }
];

const ORDER = NODES.map(n=>n.id);
const tree = document.getElementById('tree');
const stage = document.getElementById('stage');
const placeholder = document.getElementById('placeholder');
const btnStart = document.getElementById('btnStart');
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');
const btnPause = document.getElementById('btnPause');
const btnMute = document.getElementById('btnMute');

let idx = -1, playing=false, paused=false, muted=false, showing=null, audioA=null, audioB=null, showingA=true;

NODES.forEach((n,i)=>{
  const li = document.createElement('li');
  li.textContent = `${i+1}. ${n.author} — ${n.title}`;
  li.style.borderLeft = `4px solid ${n.color}`;
  li.onclick = ()=> selectNode(n.id,true);
  tree.appendChild(li);
});

function selectNode(id,manual=false){
  const i = ORDER.indexOf(id); if(i===-1)return; idx=i;
  const n = NODES[i];
  [...tree.children].forEach(li=>li.classList.toggle('active',li.textContent.includes(n.author)));
  placeholder.remove();
  stage.innerHTML='';
  const el=document.createElement('div');
  el.style.cssText='width:100%;height:100%;display:grid;place-items:center;animation:fadein 1s ease forwards;';
  el.innerHTML=`<div style="text-align:center"><h2>${n.title}</h2><p style="color:#9aa3ad">${n.author} · ${n.medium}</p></div>`;
  stage.appendChild(el);

  // handle audio
  const nextAudio = n.audio? new Audio(n.audio):null;
  if(nextAudio){ nextAudio.volume=0; nextAudio.muted=muted; nextAudio.play().catch(()=>{}); }
  const prevAudio = showingA? audioB:audioA;
  const start=performance.now();
  function fade(){
    const p=Math.min(1,(performance.now()-start)/800);
    if(nextAudio) nextAudio.volume=muted?0:p;
    if(prevAudio) prevAudio.volume=muted?0:(1-p);
    if(p<1)requestAnimationFrame(fade); else{ if(prevAudio){prevAudio.pause();prevAudio.src='';} }
  }
  requestAnimationFrame(fade);
  if(showingA){audioA=nextAudio;}else{audioB=nextAudio;}
  showingA=!showingA;
}

function next(){ idx=(idx+1)%NODES.length; selectNode(ORDER[idx]); }
function prev(){ idx=(idx-1+NODES.length)%NODES.length; selectNode(ORDER[idx]); }

btnStart.onclick=()=>{playing=true; if(idx<0){selectNode(ORDER[0]);}else{next();}};
btnNext.onclick=()=>next();
btnPrev.onclick=()=>prev();
btnPause.onclick=()=>{paused=!paused; btnPause.textContent=paused?'Resume':'Pause';};
btnMute.onclick=()=>{muted=!muted; btnMute.textContent=muted?'Unmute':'Mute'; [audioA,audioB].forEach(a=>{if(a)a.muted=muted;});};

window.addEventListener('keydown',e=>{
  if(e.key===' '||e.key==='Enter'){btnStart.click();}
  if(e.key==='ArrowRight'){next();}
  if(e.key==='ArrowLeft'){prev();}
});
