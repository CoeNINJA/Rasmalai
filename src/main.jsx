import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, AudioLines, Battery, BatteryLow, Check, ChevronDown, Expand, ImagePlus, Menu, Moon, Pause, Play, RotateCcw, Sparkles, Volume2, VolumeX, Wifi, X, Zap } from 'lucide-react';
import './styles.css';

const letter = `Happy Birthday, Aditi!\n\nOkay, first of all, I know I missed your 12 AM wish. And before you start judging me, listen to the full story.\n\nMy phone battery died, the transformer at my flat decided to give up on life, there was no electricity, no Wi-Fi, no internet, and not a single friend around whose phone I could borrow.\n\nBasically, the entire universe teamed up against my birthday wish.\n\nBut jokes apart, I genuinely hope this year brings you endless happiness, beautiful memories, good people, peaceful days, and countless reasons to smile.\n\nStay the same amazing, funny, slightly annoying, and wonderful person that you are.\n\nAnd please, next time send me some photos yourself. I cannot keep running a full investigation through your stories. 😭\n\nI am genuinely glad to have you as my friend.\n\nHappy Birthday once again, Aditi.\n\nYou deserve all the happiness in the world. ❤️`;
function useAmbientSound(enabled) {
  useEffect(() => {
    if (!enabled) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const master = context.createGain();
    master.gain.setValueAtTime(0.0001, context.currentTime);
    master.gain.exponentialRampToValueAtTime(0.018, context.currentTime + 1.4);
    master.connect(context.destination);
    const oscillators = [174.61, 261.63, 349.23].map((frequency, i) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = 'sine'; oscillator.frequency.value = frequency;
      gain.gain.value = [0.4, 0.23, 0.1][i];
      oscillator.connect(gain); gain.connect(master); oscillator.start();
      return oscillator;
    });
    return () => {
      if (context.state !== 'closed') {
        master.gain.cancelScheduledValues(context.currentTime);
        master.gain.setTargetAtTime(0.0001, context.currentTime, 0.2);
        window.setTimeout(() => { oscillators.forEach(oscillator => { try { oscillator.stop(); } catch {} }); context.close(); }, 900);
      }
    };
  }, [enabled]);
}

function useReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll('[data-reveal]');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      nodes.forEach(node => node.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.13, rootMargin: '0px 0px -45px 0px' });
    nodes.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, []);
}

function Particles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = 0, height = 0, raf;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let particles = [];
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth; height = window.innerHeight;
      canvas.width = width * dpr; canvas.height = height * dpr;
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: Math.min(90, Math.floor(width / 14)) }, () => ({
        x: Math.random() * width, y: Math.random() * height, r: Math.random() * 1.4 + .35,
        alpha: Math.random() * .48 + .12, speed: Math.random() * .22 + .05, phase: Math.random() * 6.28,
      }));
    };
    const draw = t => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        const a = p.alpha * (.58 + .42 * Math.sin(t * .0005 + p.phase));
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 231, 213, ${a})`; ctx.fill();
        if (!reduced) { p.y -= p.speed; if (p.y < -4) { p.y = height + 4; p.x = Math.random() * width; } }
      }
      if (!reduced) raf = requestAnimationFrame(draw);
    };
    resize(); draw(0); window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="particle-canvas" aria-hidden="true" />;
}

function Intro({ onOpen }) {
  const [opening, setOpening] = useState(false);
  const reveal = () => { if (opening) return; setOpening(true); window.setTimeout(onOpen, 520); };
  return <div className={`intro ${opening?'intro-opening':''}`} id="intro">
    <div className="intro-orbit orbit-one"/><div className="intro-orbit orbit-two" />
    <div className="intro-content">
      <div className="intro-eyebrow"><span className="eyebrow-line"/> A SMALL THING, MADE WITH LOVE <span className="eyebrow-line"/></div>
      <p className="intro-line intro-line-one">Some people deserve more than<br/>a simple birthday text.</p>
      <p className="intro-line intro-line-two">And this one is for you, <em>Aditi.</em></p>
      <button className="gift-button" onClick={reveal} aria-label="Open your birthday surprise">
        <span className="gift-aura"/><span className="gift-box"><span className="gift-lid"/><span className="gift-ribbon-v"/><span className="gift-ribbon-h"/><span className="gift-bow">∞</span></span>
      </button>
      <div className="gift-caption">a little surprise, wrapped in a story</div>
      <button className="button button-primary intro-cta" onClick={reveal}>Open Your Surprise <ArrowRight size={16}/></button>
      <div className="intro-foot"><span>02 — 11 — 26</span><span>FOR ADITI, ALWAYS A FRIEND</span></div>
    </div>
  </div>;
}

function Header({ active, audioOn, toggleAudio, progress }) {
  const [menu, setMenu] = useState(false);
  const links = [['story','The story'],['photos','The evidence'],['wish','The wish'],['letter','A note']];
  const jump = id => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenu(false); };
  return <>
    <div className="reading-progress"><span style={{ width: `${progress}%` }}/></div>
    <header className="topbar">
      <a className="wordmark" href="#top" onClick={e => {e.preventDefault(); jump('top')}}><span className="wordmark-mark">a.</span><span>AN ADITI ORIGINAL</span></a>
      <nav className={menu ? 'nav-links nav-open' : 'nav-links'} aria-label="Story navigation">{links.map(([id,label])=><button key={id} onClick={()=>jump(id)} className={active===id?'nav-active':''}>{label}</button>)}</nav>
      <div className="topbar-actions"><button className="sound-toggle" onClick={toggleAudio} aria-label={audioOn?'Turn ambient sound off':'Turn ambient sound on'}>{audioOn?<Volume2 size={15}/>:<VolumeX size={15}/>}<span>{audioOn?'SOUND ON':'SOUND OFF'}</span></button><button className="menu-toggle" onClick={()=>setMenu(!menu)} aria-label="Toggle navigation">{menu?<X/>:<Menu/>}</button></div>
    </header>
  </>;
}

function SectionLabel({ number, children, light=false }) { return <div className={`section-label ${light?'label-light':''}`}><span>{number}</span><i/>{children}</div>; }

function Story() {
  const [activeBeat, setActiveBeat] = useState(2);
  const beats = [
    { time:'11:59 PM', title:'Everything was under control.', copy:'Wish typed. Finger hovering. Main character energy fully activated.', icon:<Battery size={20}/>, state:'ready' },
    { time:'12:00 AM', title:'Birthday wish ready. Mission: wish Aditi.', copy:'A heroic countdown. A very confident plan. What could possibly go wrong?', icon:<Sparkles size={20}/>, state:'ready' },
    { time:'MOMENTS LATER', title:'The universe had other plans.', copy:'One by one, every possible method of saying “happy birthday” simply… left the chat.', icon:<Zap size={20}/>, state:'disaster' },
  ];
  return <section className="story-section section" id="story">
    <div className="section-inner">
      <SectionLabel number="01">THE GREAT MIDNIGHT INCIDENT</SectionLabel>
      <div className="section-heading story-heading" data-reveal><div><h2>My 12 AM Plan<br/><em>vs. Reality.</em></h2></div><p className="section-intro">A short, tragic retelling of the night I had one job—and the entire power grid said “not today.”</p></div>
      <div className="timeline" data-reveal>
        <div className="timeline-rail"><span className="rail-fill" style={{height:`${(activeBeat+1)*33.3}%`}}/></div>
        {beats.map((beat,i)=><button key={beat.time} onClick={()=>setActiveBeat(i)} className={`timeline-beat ${activeBeat===i?'beat-active':''} ${i===2?'beat-chaos':''}`}>
          <span className="beat-dot">{i<2?<span/>:<Zap size={13}/>}</span>
          <span className="beat-copy"><span className="mono beat-time">{beat.time}</span><strong>{beat.title}</strong><span>{beat.copy}</span></span>
          <span className="beat-state">{i===0?'ALL GOOD':i===1?'STANDING BY':'OH NO'}</span>
        </button>)}
      </div>
      <div className={`blackout-scene ${activeBeat===2?'blackout-active':''}`} data-reveal>
        <div className="blackout-glow"/><div className="blackout-sky"><span className="window-grid"/><span className="moon-shape"/><span className="little-person"><span className="person-head"/><span className="person-body"/></span><span className="phone-glow"/><span className="floor-line"/></div>
        <div className="blackout-copy"><span className="mono small-kicker">FIELD REPORT · 00:03 AM</span><h3>And then there<br/>was <em>nothing.</em></h3><p>The room went dark. The phone went dead. I sat there like a very confused side character in a disaster film.</p></div>
        <div className="outage-list">
          <div className="outage-row"><BatteryLow size={16}/><span>Phone battery</span><b>0%</b><span className="status-off">DEAD</span></div>
          <div className="outage-row"><Zap size={16}/><span>Transformer</span><b>BOOM</b><span className="status-off">GONE</span></div>
          <div className="outage-row"><Moon size={16}/><span>Electricity</span><b>NOPE</b><span className="status-off">OFFLINE</span></div>
          <div className="outage-row"><Wifi size={16}/><span>Wi-Fi & internet</span><b>...</b><span className="status-off">VANISHED</span></div>
          <div className="outage-row"><span className="people-icon">◌</span><span>Friends nearby</span><b>NONE</b><span className="status-off">NOT FOUND</span></div>
        </div>
      </div>
      <div className="story-punchline" data-reveal><span className="quote-mark">“</span><div><p className="hinglish">Universe ne literally mujhe birthday wish karne se rok diya.</p><p>Trust me, I wasn't ignoring you. I was fighting for my life against the electricity department.</p></div><span className="punchline-aside">CASE<br/>CLOSED?</span></div>
    </div>
  </section>;
}

function Photos({ onOpenPhoto }) {
  const [photos, setPhotos] = useState(()=>[
    {src:'/photos/aditi-story-01.jpeg',name:'Story find 01',caption:'EXHIBIT 01 · OBTAINED VIA STORY',id:'aditi-story-01'},
    {src:'/photos/aditi-story-02.jpeg',name:'Story find 02',caption:'EXHIBIT 02 · STILL WAITING FOR A DM',id:'aditi-story-02'},
    {src:'/photos/aditi-story-03.jpeg',name:'Story find 03',caption:'EXHIBIT 03 · STORY ARCHIVE, YOUR HONOUR',id:'aditi-story-03'},
    {src:'/photos/aditi-story-04.jpeg',name:'Story find 04',caption:'EXHIBIT 04 · SOURCES: VERY PUBLIC',id:'aditi-story-04'},
  ]);
  const photoUrls = useRef([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);
  const addFiles = files => {
    const valid = Array.from(files || []).filter(f => f.type.startsWith('image/'));
    const additions = valid.map(file=>({src:URL.createObjectURL(file), name:file.name, id:`${file.name}-${file.lastModified}`}));
    photoUrls.current.push(...additions.map(photo=>photo.src));
    setPhotos(prev => [...prev, ...additions]);
  };
  useEffect(()=>()=>photoUrls.current.forEach(url=>URL.revokeObjectURL(url)),[]);
  const sampleOffsets = ['rotate(-4deg)','rotate(3deg)','rotate(-2deg)','rotate(4deg)'];
  return <section className="photo-section section" id="photos">
    <div className="section-inner">
      <SectionLabel number="02" light>THE EVIDENCE ARCHIVE</SectionLabel>
      <div className="section-heading photo-heading" data-reveal><div><h2>Your photos.<br/><em>My investigation.</em></h2><p className="hinglish">Tum khud photos toh deti nahi ho...</p></div><p className="section-intro">...toh stories se screenshots nikaalne pade.<br/><span>With the investigative resources of a best friend and absolutely no shame.</span></p></div>
      <div className={`gallery-stage ${dragging?'dragging':''}`} onDragOver={e=>{e.preventDefault();setDragging(true)}} onDragLeave={()=>setDragging(false)} onDrop={e=>{e.preventDefault();setDragging(false);addFiles(e.dataTransfer.files)}} data-reveal>
        <div className="gallery-topline"><span className="mono">ADITI_ARCHIVE / 001—{String(Math.max(photos.length,4)).padStart(3,'0')}</span><span>PRIVATE INVESTIGATION · EST. 2026</span></div>
        {photos.length ? <div className="photo-grid">{photos.map((photo,i)=><button className={`photo-card photo-card-${i%4}`} key={photo.id} style={{'--tilt':sampleOffsets[i%4]}} onClick={()=>onOpenPhoto(photo.src)}><img src={photo.src} alt={`Aditi photo ${i+1}`} /><span className="photo-caption">{photo.caption || `EXHIBIT ${String(i+1).padStart(2,'0')} · STORY-SOURCED`} <Expand size={12}/></span></button>)}<button className="add-photo-card" onClick={()=>inputRef.current?.click()}><ImagePlus/><span>Add another photo</span></button></div> : <div className="empty-gallery">
          <div className="gallery-frame frame-a"><div className="frame-inner"><span className="frame-cross">+</span><span className="frame-note">EXHIBIT A</span></div></div>
          <div className="gallery-frame frame-b"><div className="frame-inner"><span className="frame-cross">+</span><span className="frame-note">EXHIBIT B</span></div></div>
          <div className="gallery-frame frame-c"><div className="frame-inner"><span className="frame-cross">+</span><span className="frame-note">EXHIBIT C</span></div></div>
          <div className="gallery-empty-copy"><div className="upload-icon"><ImagePlus size={20}/></div><strong>The evidence is still being collected.</strong><span>Drop her photos here, or add them from your device.<br/>They stay right here in your browser.</span><button className="button button-outline" onClick={()=>inputRef.current?.click()}>Add her photos <ArrowRight size={15}/></button></div>
        </div>}
        <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={e=>addFiles(e.target.files)} />
        <div className="gallery-footer"><span>ALL PHOTOS PROVIDED BY THE INVESTIGATOR (YOU)</span><span>NO STOCK PHOTOS. NO IMPOSTERS.</span></div>
      </div>
      <div className="photo-roast" data-reveal><div className="roast-stamp">CASE<br/><strong>ADITI</strong><br/>002</div><div className="roast-words"><p className="hinglish">“Madam, itni privacy bhi kya ki birthday surprise ke liye photo investigation karni pad rahi hai.”</p><p>Tumhare photos na dene ka natija hai yeh. Ab jo mila hai, usi se kaam chala raha hoon.</p></div><div className="roast-sign">with affection,<br/><em>your unpaid detective</em></div></div>
      <p className="photo-note">Choose photos above to make this gallery yours. Selected images are only displayed locally and are never uploaded.</p>
    </div>
  </section>;
}

function getAgeInYears(current) {
  const birth=new Date(2007,10,2,0,0,0);
  let years=current.getFullYear()-birth.getFullYear();
  const anniversary=new Date(current.getFullYear(),10,2,0,0,0);
  if(current<anniversary) years--;
  return years;
}

function AgeHeading() {
  const [age,setAge]=useState(()=>getAgeInYears(new Date()));
  useEffect(()=>{const timer=setInterval(()=>setAge(getAgeInYears(new Date())),60000);return()=>clearInterval(timer)},[]);
  return <h2>{age} years of<br/><em>being Aditi.</em></h2>;
}

function AgeCounter() {
  const [now,setNow]=useState(Date.now());
  useEffect(()=>{const timer=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(timer)},[]);
  const current=new Date(now);
  const years=getAgeInYears(current);
  const birth=new Date(2007,10,2,0,0,0);
  const lastBirthday=new Date(birth.getFullYear()+years,10,2,0,0,0);
  let months=current.getMonth()-lastBirthday.getMonth(); if(current.getDate()<lastBirthday.getDate()) months--;
  if(months<0) months+=12;
  const monthMark=new Date(lastBirthday); monthMark.setMonth(lastBirthday.getMonth()+months);
  const diff=Math.max(0,current-monthMark);
  const days=Math.floor(diff/86400000), hours=Math.floor(diff/3600000)%24, minutes=Math.floor(diff/60000)%60, seconds=Math.floor(diff/1000)%60;
  const units=[['YEARS',years],['MONTHS',months],['DAYS',days],['HOURS',hours],['MINUTES',minutes],['SECONDS',seconds]];
  return <div className="age-block" aria-label={`Age: ${years} years, ${months} months, ${days} days`}>
    {units.map(([label,value])=><div className="age-unit" key={label}><span className="age-digit" key={`${label}-${value}`}>{String(value).padStart(2,'0')}</span><span className="mono age-label">{label}</span></div>)}
  </div>;
}

function Cake({ lit }) {
 return <div className={`cake-art ${lit?'cake-lit':'cake-blown'}`} aria-label={lit?'Birthday cake with glowing candles':'Birthday candles blown out'}>
   <div className="cake-glow"/><div className="candle c-one"><i/></div><div className="candle c-two"><i/></div><div className="candle c-three"><i/></div>
   <div className="cake-top"><span className="icing-drip drip-a"/><span className="icing-drip drip-b"/><span className="icing-drip drip-c"/></div>
   <div className="cake-layer layer-top"/><div className="cake-layer layer-bottom"/><div className="cake-plate"/><div className="cake-sparkle sparkle-one">✦</div><div className="cake-sparkle sparkle-two">✧</div>
 </div>;
}

function WishScene() {
  const [wished,setWished]=useState(false),[sound,setSound]=useState(false), [confetti,setConfetti]=useState(false);
  useAmbientSound(sound);
  const explode=()=>{if(wished)return;setWished(true);setConfetti(true);window.setTimeout(()=>setConfetti(false),4200)};
  const toggleSound=()=>setSound(value=>!value);
  return <section className="wish-section section" id="wish">
    {confetti&&<div className="confetti-layer" aria-hidden="true">{Array.from({length:70},(_,i)=><i key={i} style={{'--x':`${Math.random()*100}%`,'--delay':`${Math.random()*0.8}s`,'--duration':`${2.3+Math.random()*2}s`,'--hue':`${[315,265,42,352,190][i%5]}`,'--size':`${5+Math.random()*7}px`}}/>)}</div>}
    <div className="wish-inner section-inner"><SectionLabel number="03">A LITTLE BIRTHDAY MAGIC</SectionLabel><div className="wish-kicker mono" data-reveal>THE IMPORTANT PART</div><h2 data-reveal>Make a wish,<br/><em>Aditi.</em></h2><p className="wish-lede" data-reveal>One candle for every year of being wonderfully, unmistakably you.</p><div className="cake-wrap" data-reveal><Cake lit={!wished}/></div><button className={`button wish-button ${wished?'wish-done':''}`} onClick={explode} disabled={wished}>{wished?<><Check size={17}/> Wish sent. Make it a good one.</>:<>Make A Wish, Aditi <Sparkles size={16}/></>}</button><button className="soundtrack" onClick={toggleSound}>{sound?<Pause size={13}/>:<Play size={13}/>}<span>{sound?'PAUSE AMBIENT GLOW':'PLAY A LITTLE AMBIENCE'}</span><AudioLines size={14}/></button><p className={`wish-reveal ${wished?'wish-reveal-visible':''}`}>May the year ahead be as lovely as the person you are. <span>✦</span></p></div>
  </section>;
}

function Letter() {
  const [typed,setTyped]=useState(false),[visible,setVisible]=useState(false);const sectionRef=useRef(null);const timer=useRef(null);
  useEffect(()=>{const observer=new IntersectionObserver(entries=>{if(entries[0].isIntersecting){setVisible(true);observer.disconnect()}},{threshold:.2});if(sectionRef.current)observer.observe(sectionRef.current);return()=>observer.disconnect()},[]);
  useEffect(()=>{if(!visible||typed)return;let index=0;const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(reduce){setTyped(true);return}timer.current=setInterval(()=>{index+=5;if(index>=letter.length){setTyped(true);clearInterval(timer.current)}else setText(letter.slice(0,index))},14);return()=>clearInterval(timer.current)},[visible,typed]);
  const [text,setText]=useState('');
  return <section ref={sectionRef} className="letter-section section" id="letter"><div className="section-inner letter-inner"><SectionLabel number="05" light>A NOTE, IN MY OWN WORDS</SectionLabel><div className="letter-layout"><div className="letter-side" data-reveal><span className="mono">NOVEMBER 02, 2026</span><h2>To the girl<br/>who never<br/><em>sends photos.</em></h2><div className="letter-doodle">✳</div><p>Just a little reminder that you are very appreciated. And yes, the photo request is still open.</p></div><div className="letter-paper" data-reveal><div className="paper-top"><span>JUST FOR YOU</span><span className="paper-heart">✳</span></div><div className="letter-copy">{typed?letter:text}{!typed&&visible&&<span className="type-cursor"/>}</div>{!typed&&visible&&<button className="finish-typing" onClick={()=>{clearInterval(timer.current);setText(letter);setTyped(true)}}>Read the whole note <ArrowRight size={13}/></button>}<div className="letter-signature">Always in your corner,<br/><em>your friend,</em> <span>with affection.</span></div><div className="paper-stamp">A<br/>✳<br/>02</div></div></div></div></section>;
}

function Finale({ replay }) { return <section className="finale-section section" id="finale"><div className="finale-rays"/><div className="finale-content" data-reveal><div className="finale-star">✳</div><p className="finale-setup">One missed midnight.<br/>One very unfortunate transformer.<br/>And one birthday wish that was still worth making.</p><div className="finale-rule"><span/><i>✦</i><span/></div><h2>Happy Birthday,<br/><em>Aditi.</em></h2><p className="finale-date mono">NOVEMBER 02 · 2026</p><button className="button button-primary replay-button" onClick={replay}><RotateCcw size={15}/> Replay your surprise</button><div className="finale-footer">MADE WITH FRIENDSHIP & A QUESTIONABLE POWER SUPPLY</div></div></section> }

function PhotoLightbox({src,onClose}) { useEffect(()=>{const key=e=>e.key==='Escape'&&onClose();window.addEventListener('keydown',key);document.body.style.overflow='hidden';return()=>{window.removeEventListener('keydown',key);document.body.style.overflow=''}},[onClose]);return <div className="lightbox" onClick={onClose}><button className="lightbox-close" onClick={onClose} aria-label="Close photo"><X/></button><img src={src} alt="Aditi photo, enlarged" onClick={e=>e.stopPropagation()}/></div> }

function App() {
  const [opened,setOpened]=useState(false),[active,setActive]=useState('story'),[audioOn,setAudioOn]=useState(false),[progress,setProgress]=useState(0),[photo,setPhoto]=useState(null);
  useReveal();
  useAmbientSound(audioOn);
  useEffect(()=>{const onScroll=()=>{const max=document.documentElement.scrollHeight-window.innerHeight;setProgress(max>0?window.scrollY/max*100:0);const ids=['story','photos','wish','letter'];const at=window.scrollY+window.innerHeight*.42;for(const id of ids){const el=document.getElementById(id);if(el&&el.offsetTop<=at)setActive(id)}};window.addEventListener('scroll',onScroll,{passive:true});onScroll();return()=>window.removeEventListener('scroll',onScroll)},[]);
  const open=()=>{setOpened(true);window.setTimeout(()=>document.getElementById('top')?.scrollIntoView({behavior:'smooth'}),80)};
  const replay=()=>{setOpened(false);window.scrollTo({top:0,behavior:'smooth'});};
  return <main id="top"><Particles/><Header active={active} progress={progress} audioOn={audioOn} toggleAudio={()=>setAudioOn(!audioOn)}/><div className={`site-shell ${opened?'site-open':''}`}><div className="hero-spacer"><div className="hero-orb"/><div className="hero-inner"><div className="hero-pretitle mono"><span/> THE 19TH CHAPTER <span/></div><h1>For the girl<br/>who <em>never</em> sends<br/>her photos.</h1><p>A birthday story, a minor power-grid incident,<br/>and a very dedicated detective.</p><button className="scroll-cue" onClick={()=>document.getElementById('story')?.scrollIntoView({behavior:'smooth'})}>SCROLL TO INVESTIGATE <ChevronDown size={15}/></button></div><div className="hero-index mono">A BIRTHDAY STORY · VOL. 02</div><div className="hero-side-note">A SMALL SURPRISE FOR ADITI <span>✳</span></div></div><Story/><Photos onOpenPhoto={setPhoto}/><WishScene/><section className="age-section"><div className="age-inner section-inner"><div className="age-copy" data-reveal><SectionLabel number="04">THE NUMBERS, UNINTERRUPTED</SectionLabel><AgeHeading/><p>And still refusing to send me photos.</p></div><div className="age-counter-wrap" data-reveal><div className="age-topline"><span className="mono">AGE, DOWN TO THE SECOND</span><span className="live-dot">LIVE</span></div><AgeCounter/><div className="age-foot"><span>Born November 2, 2007</span><span>AND COUNTING ✦</span></div></div></div></section><Letter/><Finale replay={replay}/></div>{!opened&&<Intro onOpen={open}/>} {photo&&<PhotoLightbox src={photo} onClose={()=>setPhoto(null)}/>}</main>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
