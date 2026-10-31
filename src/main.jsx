import React, {useState, useEffect, useId} from 'react';
import {createRoot} from 'react-dom/client';
import {ArrowUpRight, ArrowRight, Menu, X, ShieldCheck, Users, Flag, Mail, CheckCircle2} from 'lucide-react';
import './style.css';

/* Optional real photos: drop licensed files into /public/photos/ with these names.
   If a file is missing, the built-in artwork shows instead (never a blank box). */
const photos = {
  hero: `${import.meta.env.BASE_URL}photos/hero.jpg`,
  story: `${import.meta.env.BASE_URL}photos/story.jpg`,
  h1: `${import.meta.env.BASE_URL}photos/horse1.jpg`,
  h2: `${import.meta.env.BASE_URL}photos/horse2.jpg`,
  h3: `${import.meta.env.BASE_URL}photos/horse3.jpg`,
  contact: `${import.meta.env.BASE_URL}photos/contact.jpg`,
};
const SILKS = {green:['#176b53','#e8d5a9'], navy:['#14253f','#f6f0e4'], burgundy:['#6d1f2f','#e8d5a9']};
const horses = [
  {name:'The Next Contender', type:'Future prospect', silks:'green', photo:photos.h1},
  {name:'The Journey Ahead', type:'Upcoming opportunity', silks:'navy', photo:photos.h2},
  {name:'Behind the Stable Doors', type:'Horse to watch', silks:'burgundy', photo:photos.h3}
];
const states = ['Alabama','Arizona','California','Colorado','Florida','Illinois','Kentucky','Louisiana','Maryland','New Jersey','New York','Ohio','Pennsylvania','Texas','Virginia','Washington','Other'];

function Scene({kind, silks='green', u}){
  if(kind === 'silks'){
    const [a,b] = SILKS[silks];
    return <svg className="scene" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs><pattern id={'p'+u} width="86" height="86" patternUnits="userSpaceOnUse" patternTransform="rotate(0)"><rect width="86" height="86" fill={a}/><path d="M43 0l43 43-43 43L0 43z" fill={b}/><path d="M43 22l21 21-21 21-21-21z" fill={a}/></pattern></defs>
      <rect width="400" height="300" fill={'url(#p'+u+')'}/>
    </svg>;
  }
  return <svg className="scene" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id={'s'+u} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0b241b"/><stop offset=".5" stopColor="#2f6a52"/><stop offset="1" stopColor="#e8d5a9"/></linearGradient>
      <radialGradient id={'g'+u}><stop offset="0" stopColor="#fff3cf"/><stop offset="1" stopColor="#fff3cf" stopOpacity="0"/></radialGradient>
    </defs>
    <rect width="1600" height="900" fill={'url(#s'+u+')'}/>
    <circle className="sun-glow" cx="1120" cy="500" r="420" fill={'url(#g'+u+')'}/>
    <circle cx="1120" cy="500" r="82" fill="#fff6d8"/>
    <path d="M0 540Q300 470 620 520T1250 500T1600 520V900H0Z" fill="#12362a"/>
    <path d="M0 585H1600V900H0Z" fill="#1d4a39"/>
    <polygon points="1120,585 -300,900 1900,900" fill="#c9a96b"/>
    <g stroke="#f6f0e4" strokeOpacity=".4" strokeWidth="3">{[-100,350,800,1250,1700].map(x=><line key={x} x1="1120" y1="585" x2={x} y2="900"/>)}</g>
    <g stroke="#fbfaf7" strokeWidth="7"><line x1="1120" y1="585" x2="-300" y2="900"/><line x1="1120" y1="585" x2="1900" y2="900"/></g>
    <rect x="1115" y="360" width="10" height="225" fill="#fbfaf7"/><rect x="1115" y="360" width="10" height="28" fill="#b8955a"/><rect x="1115" y="416" width="10" height="28" fill="#b8955a"/><rect x="1115" y="472" width="10" height="28" fill="#b8955a"/>
  </svg>;
}

function Photo({src, alt='', kind='track', silks, className='', eager=false, children}){
  const [ok,setOk] = useState(!!src); const u = useId().replace(/:/g,'');
  return <div className={'photo '+className}>
    <Scene kind={kind} silks={silks} u={u}/>
    {ok && <img src={src} alt={alt} onError={()=>setOk(false)} loading={eager?'eager':'lazy'}/>}
    <div className="photo-shade"/>{children}
  </div>;
}

function FinalCTA({inquire}){
  return <section className="final-cta"><div className="eyebrow light">The start of something special</div><h2>Your place in<br/><em>the story awaits.</em></h2><p>Discover where your passion for racing could take you.</p><button className="btn btn-gold" onClick={inquire}>Inquire to join <ArrowUpRight size={18}/></button></section>;
}

function App(){
  const [page,setPage] = useState('home'), [menu,setMenu] = useState(false), [sent,setSent] = useState(false), [note,setNote] = useState(''), [quick,setQuick] = useState(false);
  useEffect(()=>{window.scrollTo(0,0); document.title = (page==='home'?'Modern Thoroughbred Syndicate':page==='about'?'Our Story':'Inquire to Join')+' | The Thoroughbred Club';},[page]);
  const go = next => {setPage(next); setMenu(false); setSent(false); setNote('');};
  const inquire = () => go('contact');
  const toHorses = () => {go('home'); setTimeout(()=>document.getElementById('horses')?.scrollIntoView({behavior:'smooth'}),60);};
  const formEndpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT;
  const notify = async e => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = new FormData(form).get('email');
    if (!formEndpoint) { window.location.href = `mailto:?subject=${encodeURIComponent('Thoroughbred Club updates')}&body=${encodeURIComponent('Please add '+email+' to the updates list.')}`; setNote('Your email app should open with a draft. No details have been submitted automatically.'); return; }
    try { const res = await fetch(formEndpoint,{method:'POST',headers:{Accept:'application/json'},body:new FormData(form)}); if(!res.ok) throw Error('Failed'); setQuick(true); setNote('Thank you. Your request has been submitted.'); form.reset(); }
    catch {setNote('Could not submit. Please try again later.');}
  };
  const submitInquiry = async e => {
    e.preventDefault();
    const form = e.currentTarget; const data = new FormData(form);
    if (!formEndpoint) {
      const body = [...data.entries()].map(([k,v])=>`${k}: ${v}`).join('\n');
      window.location.href = `mailto:?subject=${encodeURIComponent('Thoroughbred Club inquiry')}&body=${encodeURIComponent(body)}`;
      setNote('An email draft should open in your email app. Please send it to the club’s verified address.');
      return;
    }
    try {const res=await fetch(formEndpoint,{method:'POST',body:data,headers:{Accept:'application/json'}});if(!res.ok)throw Error('Failed');setSent(true);setNote('Your inquiry has been submitted successfully.');}
    catch {setNote('Submission failed. Please try again later.');}
  };

  const Home = <main>
    <section className="hero">
      <Photo className="hero-photo" kind="track" src={photos.hero} alt="Thoroughbred racing at dawn" eager>
        <div className="hero-content">
          <div className="eyebrow light"><span className="line"/> A new way to experience the sport</div>
          <h1>The thrill of racing.<br/><em>The privilege of belonging.</em></h1>
          <p>Share the excitement of thoroughbred racing with a small, welcoming group of people who love the horses, the atmosphere and the journey.</p>
          <div className="hero-actions"><button className="btn btn-gold" onClick={inquire}>Inquire to join <ArrowUpRight size={18}/></button><button className="btn btn-line" onClick={()=>go('about')}>Our story</button></div>
        </div>
      </Photo>
    </section>
    <div className="benefit-bar">{[[Flag,'The racing experience'],[Users,'Shared passion'],[ShieldCheck,'A thoughtful approach'],[Mail,'Personal connection']].map(([I,t])=><div key={t}><I/><span>{t}</span></div>)}</div>

    <section className="intro-section section-container">
      <div className="intro-copy"><span className="eyebrow">Who we are</span><h2>Built for the <em>modern racing</em> enthusiast.</h2><p>We believe the best moments in racing are the ones you share. Our vision is to bring together people who love the horses, the atmosphere and everything that makes this sport extraordinary.</p><button className="text-link" onClick={()=>go('about')}>Discover our story <ArrowUpRight size={17}/></button></div>
      <Photo kind="silks" silks="green" src={photos.story} alt="Racing scene" className="intro-photo"><span className="image-label">More than a race. A shared experience.</span></Photo>
    </section>

    <section className="horses-section" id="horses"><div className="section-container">
      <div className="section-heading"><div><span className="eyebrow">Looking ahead</span><h2>Upcoming <em>horses.</em></h2></div><p>Every journey begins somewhere. Get to know the horses and opportunities that may shape our next chapter.</p></div>
      <div className="horse-grid">{horses.map(h=><article className="horse-card" key={h.name}>
        <Photo kind="silks" silks={h.silks} src={h.photo} alt={h.name} className="horse-image"><span className="horse-tag">Coming soon</span></Photo>
        <div className="horse-info"><span className="card-kicker">{h.type}</span><h3>{h.name}</h3>
          <dl><div><dt>Trainer</dt><dd>To be announced</dd></div><div><dt>Share details</dt><dd>To be announced</dd></div></dl>
          <button className="text-link small-link" onClick={inquire}>Register interest <ArrowUpRight size={15}/></button></div>
      </article>)}</div>
      <p className="horse-disclaimer">Concept titles and illustrative artwork. Confirmed horse details will be added by the syndicate.</p>
    </div></section>

    <section className="experience-section"><div className="section-container">
      <span className="eyebrow">The experience</span>
      <div className="experience-head"><h2>More than <em>the finish line.</em></h2><p>It's the anticipation, the people beside you and the stories you'll tell long after race day.</p></div>
      <div className="experience-grid">{[[Flag,'The thrill','Feel the anticipation and atmosphere that make every race unforgettable.'],[Users,'The people','Connect with others who share your enthusiasm for thoroughbred racing.'],[ShieldCheck,'The journey','Follow the story from the stable to the track, with updates along the way.']].map(([I,t,d])=><div key={t}><I/><h3>{t}</h3><p>{d}</p></div>)}</div>
    </div></section>

    <section className="steps-section section-container">
      <div><span className="eyebrow">Your next step</span><h2>It starts with <em>a conversation.</em></h2><button className="btn btn-dark" onClick={inquire}>Register your interest <ArrowUpRight size={17}/></button>
        <form className="notify" onSubmit={notify}><label className="sr" htmlFor="qe">Email address</label><input id="qe" name="email" type="email" required placeholder="Just want updates? Your email" autoComplete="email"/><button className="btn btn-gold" type="submit">Notify me</button>{note && <small role="status">{note}</small>}</form></div>
      <ol className="steps-list">{[['Discover','Explore our approach and upcoming plans.'],['Inquire','Leave your details in a short form.'],['Connect','Talk with us about joining the syndicate.'],['Decide','Review the terms in your own time.']].map(([t,d],i)=><li key={t}><b>{i+1}</b><span><strong>{t}</strong><small>{d}</small></span></li>)}</ol>
    </section>
    <FinalCTA inquire={inquire}/>
  </main>;

  const About = <main>
    <section className="page-banner"><span className="eyebrow">The people behind the passion</span><h1>Our story.<br/><em>Your next chapter.</em></h1><p>A contemporary approach to the extraordinary world of thoroughbred racing.</p></section>
    <section className="intro-section section-container about-intro">
      <div className="intro-copy"><span className="eyebrow">Who we are</span><h2>United by <em>a love of racing.</em></h2><p>The Thoroughbred Club is a new syndicate built around shared experiences, a genuine appreciation for horses and a sense of belonging.</p><p>We won't invent a track record. We'll offer clear terms, careful horse selection and members who are treated as owners from day one.</p></div>
      <Photo className="intro-photo" kind="track" src={photos.story} alt="Racing at dawn"><span className="image-label">Clear terms. Honest updates.</span></Photo>
    </section>
    <section className="mission section-container"><span className="eyebrow">What we believe</span><h2>A better experience starts with <em>the right values.</em></h2>
      <div className="mission-grid">{[['Passion first','A genuine appreciation for thoroughbred racing and its traditions.'],['People matter','Shared experiences and lasting connections at the heart of the journey.'],['Clarity always','Costs, rights and exit terms explained in plain English before you commit.']].map(([t,d])=><div key={t}><h3>{t}</h3><p>{d}</p></div>)}</div></section>
    <section className="horses-section"><div className="section-container section-heading"><div><span className="eyebrow">What's next</span><h2>Horses on <em>the horizon.</em></h2></div><div><p>Details of confirmed horses and ownership opportunities will be shared as they become available.</p><button className="text-link" onClick={toHorses}>See upcoming horses <ArrowUpRight size={17}/></button></div></div></section>
    <FinalCTA inquire={inquire}/>
  </main>;

  const Contact = <main><section className="contact-layout section-container">
    <div className="contact-copy"><span className="eyebrow">Let's start a conversation</span><h1>Be part of <em>the story.</em></h1><p>Interested in learning more? Leave your details to begin a conversation with the team.</p>
      <div className="contact-note"><CheckCircle2/><span>No commitment. Just a conversation about what comes next.</span></div>
      <Photo kind="silks" silks="navy" src={photos.contact} alt="" className="contact-photo"/></div>
    <div className="form-panel"><span className="eyebrow">Membership inquiry</span><h2>Inquire to join.</h2><p>Tell us a little about yourself.</p>
      {sent ? <div className="form-success"><CheckCircle2 size={36}/><h3>Thank you for your inquiry</h3><p>{note}</p><button className="text-link" onClick={()=>setSent(false)}>Back to form <ArrowRight size={16}/></button></div>
      : <form onSubmit={submitInquiry}>
        <label>Full name<input required name="name" placeholder="Your full name" autoComplete="name"/></label>
        <label>Email address<input required type="email" name="email" placeholder="you@example.com" autoComplete="email"/></label>
        <label>Phone number<input required type="tel" name="phone" placeholder="(555) 123-4567" autoComplete="tel" pattern=".*\d{3}.*\d{3}.*\d{4}.*" title="Enter a 10-digit US phone number"/></label>
        <label>State<select name="state" autoComplete="address-level1" defaultValue=""><option value="" disabled>Select your state</option>{states.map(s=><option key={s}>{s}</option>)}</select></label>
        <fieldset><legend>How far along are you?</legend>{[['exploring','Just exploring'],['share','Interested in a share'],['call','Ready for a call']].map(([v,l],i)=><label className="chip" key={v}><input type="radio" name="stage" value={v} defaultChecked={i===0}/><span>{l}</span></label>)}</fieldset>
        <label className="check-row"><input required type="checkbox"/> <span>I agree to be contacted by phone, text or email about my inquiry.</span></label>
        <button className="btn btn-dark form-submit" type="submit">Send inquiry <ArrowUpRight size={18}/></button>
        <small className="form-disclaimer">{formEndpoint ? "Your inquiry will be submitted securely." : "Without a connected form service, clicking send opens an email draft; no automatic submission occurs."}</small>{note && <p className="form-feedback" role="status">{note}</p>}</form>}
    </div></section></main>;

  return <>
    <header className="header">
      <button className="brand" onClick={()=>go('home')} aria-label="The Thoroughbred Club, home"><img className="brand-logo" src={`${import.meta.env.BASE_URL}logo.svg`} alt=""/><span className="brand-name">The Thoroughbred <small>Club · Racing syndicate</small></span></button>
      <nav className={menu?'nav open':'nav'} aria-label="Main navigation">
        <button className={page==='home'?'active':''} onClick={()=>go('home')}>Home</button>
        <button className={page==='about'?'active':''} onClick={()=>go('about')}>Our story</button>
        <button onClick={toHorses}>Upcoming horses</button>
        <button className={page==='contact'?'active':''} onClick={inquire}>Contact</button>
      </nav>
      <button className="btn btn-dark header-cta" onClick={inquire}>Inquire to join <ArrowUpRight size={16}/></button>
      <button className="menu-toggle" aria-label="Toggle navigation" aria-expanded={menu} onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button>
    </header>
    {page==='home'?Home:page==='about'?About:Contact}
    <footer className="footer"><div className="footer-top"><div className="footer-brand">The Thoroughbred<br/><em>Club.</em></div>
      <div><span>Explore</span><button onClick={()=>go('home')}>Home</button><button onClick={()=>go('about')}>Our story</button><button onClick={inquire}>Contact</button></div>
      <div><span>Get in touch</span><p>Interested in joining?</p><button className="footer-enquire" onClick={inquire}>Inquire to join <ArrowUpRight size={16}/></button></div></div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} The Thoroughbred Club · Concept website</span><span>Racing involves risk. Please read all terms before joining.</span></div></footer>
  </>;
}

createRoot(document.getElementById('root')).render(<App/>);
