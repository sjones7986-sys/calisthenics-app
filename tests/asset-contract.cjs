const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const root=require('node:path').join(__dirname,'..')+'/';
class Element {
 constructor(tag='div'){this.tagName=tag;this.children=[];this.attrs={};this.style={};this.dataset={};this.listeners={};this.classes=new Set();this.classList={toggle:(k,on)=>on?this.classes.add(k):this.classes.delete(k)};}
 setAttribute(k,v){this.attrs[k]=v} removeAttribute(k){delete this.attrs[k]}
 replaceChildren(...kids){this.children=kids}
 set innerHTML(s){this.children=s?[new Element(s.startsWith('<svg')?'svg':'span')]:[]}
 get firstElementChild(){return this.children[0]}
 appendChild(k){this.children.push(k)}
 querySelector(tag){return this.children.find(x=>x.tagName===tag)||null}
 contains(k){return this.children.includes(k)}
 addEventListener(k,f){this.listeners[k]=f}
 fire(k){this.listeners[k]?.()}
}
let rejectPlay=false,createdVideos=[],createdImages=[],timers=new Map(),sequence=0;
class Video extends Element {
 constructor(){super('video');this.paused=true;createdVideos.push(this)}
 pause(){this.paused=true} load(){}
 play(){if(rejectPlay)return Promise.reject(new Error('blocked'));this.paused=false;return Promise.resolve()}
}
class Image extends Element {constructor(){super('img');createdImages.push(this)}}
const host=new Element(),motion={matches:false,addEventListener(k,f){this.change=f}};
const context=vm.createContext({window:{matchMedia:()=>motion},Image,document:{getElementById:()=>host,createElement:t=>t==='video'?new Video():new Element(t)},setTimeout:f=>{timers.set(++sequence,f);return sequence},clearTimeout:id=>timers.delete(id),console});
let html=fs.readFileSync(root+'index.html.html','utf8');
let app=html.match(/<script>([\s\S]*?)<\/script>/)[1];
vm.runInContext(fs.readFileSync(root+'assets/manifest.js','utf8'),context);
vm.runInContext(app.slice(0,app.indexOf('const DAY_KEYS=')),context);
vm.runInContext("let S={paused:false,screen:'workout',phase:'warmup',mode:'work'};",context);
vm.runInContext(app.slice(app.indexOf('/* Local media contract:'),app.indexOf('/* =============================================\n   WORKOUT UI RENDER')),context);
const run=s=>vm.runInContext(s,context);
const render=()=>run("visualKey=null;renderExerciseVisual(WORKOUTS.monday.warmup[0],'blue')");
const settle=()=>new Promise(r=>setImmediate(r));
(async()=>{
 assert.equal(run('Object.keys(window.EXERCISE_ASSETS).length'),36);
 assert.equal(run('Object.values(WORKOUTS).flatMap(w=>[...w.warmup,...w.circuit,...w.cooldown]).length'),39);
 run("for(const w of Object.values(WORKOUTS))for(const ex of [...w.warmup,...w.circuit,...w.cooldown]){if(!window.EXERCISE_ASSETS[ex.svg]||!SVG[ex.svg])throw Error(ex.name);renderExerciseVisual(ex,'green');}");
 render();let saved=host.firstElementChild;run("renderExerciseVisual(WORKOUTS.monday.warmup[0],'green')");assert.equal(saved,host.firstElementChild);
 assert.equal(createdVideos.length,0);assert.equal(createdImages.length,0);
 run('S.paused=true;syncVisualPlayback()');assert(host.classes.has('visual-paused'));
 run('S.paused=false;window.EXERCISE_ASSETS.armCircles.animationReady=true;window.EXERCISE_ASSETS.armCircles.imageReady=true');
 render();let v=createdVideos.at(-1);v.fire('loadeddata');await settle();assert.equal(host.firstElementChild,v);assert.equal(v.paused,false);
 run('S.paused=true;syncVisualPlayback()');assert(v.paused);run('S.paused=false;syncVisualPlayback()');await settle();assert(!v.paused);
 run("S.mode='rest';S.phase='circuit';syncVisualPlayback()");assert(v.paused);run("S.mode='work';S.phase='warmup';S.screen='home';syncVisualPlayback()");assert(v.paused);run("S.screen='workout'");
 render();createdVideos.at(-1).fire('error');assert.equal(host.dataset.visual,'inline');createdImages.at(-1).onload();assert.equal(host.dataset.visual,'image');
 render();createdVideos.at(-1).fire('error'); // Broken PNG never replaces the correct SVG.
 assert.equal(host.dataset.visual,'inline');assert.equal(host.firstElementChild.tagName,'svg');
 motion.matches=true;render();assert(host.classes.has('visual-static'));assert.equal(host.firstElementChild.tagName,'svg');createdImages.at(-1).onload();assert.equal(host.firstElementChild.tagName,'img');
 motion.matches=false;render();const obsolete=createdVideos.at(-1);run("renderExerciseVisual(WORKOUTS.monday.warmup[1],'blue')");const current=host.firstElementChild;obsolete.fire('loadeddata');assert.equal(host.firstElementChild,current);assert(obsolete.paused);
 // A stalled load reaches the PNG fallback.
 render();assert.equal(timers.size,1);[...timers.values()][0]();createdImages.at(-1).onload();assert.equal(host.dataset.visual,'image');
 rejectPlay=true;render();createdVideos.at(-1).fire('loadeddata');await settle();assert.equal(host.dataset.visual,'inline');createdImages.at(-1).onload();assert.equal(host.dataset.visual,'image');rejectPlay=false;
 run("window.EXERCISE_ASSETS.armCircles.animation='https://untrusted.example/video.mp4';window.EXERCISE_ASSETS.armCircles.image='../wrong.png'");let count=createdVideos.length;render();assert.equal(createdVideos.length,count);assert.equal(host.dataset.visual,'inline');
 run("window.EXERCISE_ASSETS=undefined;visualKey=null;renderExerciseVisual(WORKOUTS.monday.warmup[0],'blue')");assert.equal(host.firstElementChild.tagName,'svg');
 run("renderExerciseVisual({svg:'missing',name:'Missing Exercise'},'blue')");assert.match(host.firstElementChild.textContent,/Illustration unavailable/);assert.match(host.attrs['aria-label'],/Missing Exercise/);
 console.log('PASS: manifest covers 39 slots / 36 unique visuals; all existing SVGs resolve; stable mount; disabled files; video load, errors, rejection and timeout; PNG fallback; pause/rest/home; reduced motion; stale callbacks; invalid paths; absent manifest; unknown exercise.');
 console.log('DOM/media events were simulated. Actual browser rendering and codec playback require manual verification.');
})().catch(e=>{console.error(e);process.exitCode=1});
