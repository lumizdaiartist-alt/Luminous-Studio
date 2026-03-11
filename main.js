// ─── CURSOR ───
  const cur = document.getElementById('cur');
  const curR = document.getElementById('curR');
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove',e=>{
    mx=e.clientX; my=e.clientY;
    cur.style.left=mx+'px'; cur.style.top=my+'px';
  });
  (function animR(){
    rx+=(mx-rx)*.13; ry+=(my-ry)*.13;
    curR.style.left=rx+'px'; curR.style.top=ry+'px';
    requestAnimationFrame(animR);
  })();
  document.querySelectorAll('a,button,.svc-card,.wc,.proj-card,.svc-detail-item,.team-card').forEach(el=>{
    el.addEventListener('mouseenter',()=>document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave',()=>document.body.classList.remove('cursor-hover'));
  });

  // ─── NAV ───
  window.addEventListener('scroll',()=>{
    document.getElementById('navbar').classList.toggle('scrolled',scrollY>40);
  });

  // ─── PAGE ROUTING ───
  function nav(page){
    document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
    document.getElementById('page-'+page).classList.add('active');
    document.querySelectorAll('.nav-links a').forEach(a=>{
      a.classList.toggle('active', a.dataset.page===page);
    });
    window.scrollTo({top:0,behavior:'smooth'});
    setTimeout(initReveal,100);
    // Re-bind cursor hovers on new page
    setTimeout(()=>{
      document.querySelectorAll('a,button,.svc-card,.wc,.proj-card,.svc-detail-item,.team-card').forEach(el=>{
        el.addEventListener('mouseenter',()=>document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave',()=>document.body.classList.remove('cursor-hover'));
      });
    },200);
  }

  // ─── MOBILE MENU ───
  function toggleMobile(){
    const m=document.getElementById('mobileMenu');
    const h=document.getElementById('hamburger');
    m.classList.toggle('open');
    h.classList.toggle('open');
  }
  function closeMobile(){
    document.getElementById('mobileMenu').classList.remove('open');
    document.getElementById('hamburger').classList.remove('open');
  }

  // ─── REVEAL ───
  const observer = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting) e.target.classList.add('vis');
    });
  },{threshold:.12});
  function initReveal(){
    document.querySelectorAll('.rv:not(.vis)').forEach(el=>observer.observe(el));
  }
  initReveal();

  // ─── COUNTER ───
  function runCounters(){
    document.querySelectorAll('[data-count]').forEach(el=>{
      const target=+el.dataset.count;
      const suffix=el.querySelector('span')?.outerHTML||'';
      const inner=el.innerHTML.replace(suffix,'').replace(/[^0-9]/g,'');
      let c=0; const step=target/55;
      const t=setInterval(()=>{
        c=Math.min(c+step,target);
        el.innerHTML=Math.floor(c)+(suffix);
        if(c>=target)clearInterval(t);
      },16);
    });
  }
  const statsObs=new IntersectionObserver(e=>{
    if(e[0].isIntersecting){runCounters();statsObs.disconnect();}
  },{threshold:.6});
  const aside=document.querySelector('.hero-aside');
  if(aside) statsObs.observe(aside);

  // ─── WORK FILTER ───
  function filterWork(btn, cat){
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.proj-card').forEach(c=>{
      const cats=c.dataset.cat||'';
      const show=cat==='all'||cats.includes(cat);
      c.style.opacity=show?'1':'0.2'
      c.style.pointerEvents=show?'auto':'none';
      c.style.transition='opacity .3s';
    });
  }

  // ─── CONTACT FORM → WHATSAPP ───
  function submitForm(){
    const inputs = document.querySelectorAll('#contactForm .form-input, #contactForm .form-textarea, #contactForm .form-select');
    const firstName  = inputs[0]?.value.trim();
    const lastName   = inputs[1]?.value.trim();
    const email      = inputs[2]?.value.trim();
    const company    = inputs[3]?.value.trim();
    const service    = inputs[4]?.value;
    const message    = inputs[5]?.value.trim();

    if(!firstName || !email || !message){
      [inputs[0], inputs[2], inputs[5]].forEach(f=>{
        if(f && !f.value.trim()) f.style.borderColor='var(--gold)';
      });
      if(!document.getElementById('formErr')){
        const e = document.createElement('p');
        e.id='formErr';
        e.style.cssText='font-family:Syne,sans-serif;font-size:.7rem;letter-spacing:.1em;color:var(--gold);margin-top:.5rem;';
        e.textContent='Please fill in your name, email, and project details.';
        document.querySelector('.submit-btn').insertAdjacentElement('beforebegin', e);
      }
      return;
    }

    const phone = '2349166819937';
    const text = [
      '✦ NEW PROJECT ENQUIRY — Luminous Studio',
      '',
      'Name: ' + firstName + ' ' + lastName,
      'Email: ' + email,
      company ? 'Company: ' + company : null,
      service ? 'Service: ' + service : null,
      '',
      'Project Details:',
      message,
      '',
      '— Sent via luminous.studio'
    ].filter(l=>l!==null).join('\n');

    window.open('https://wa.me/' + phone + '?text=' + encodeURIComponent(text), '_blank');

    document.getElementById('contactForm').style.display='none';
    document.getElementById('formSuccess').classList.add('show');
  }

  // ─── HERO VISUAL ICON CYCLE ───
  const hvIcons  = ['hv-pen','hv-cam','hv-code'];
  const hvLabels = ['Brand','Visual','Digital'];
  let hvCurrent  = 0;
  function hvActivate(i){
    hvIcons.forEach((id,idx)=>{
      const el=document.getElementById(id);
      if(el) el.classList.toggle('active',idx===i);
    });
    const lbl=document.getElementById('hvLabel');
    if(lbl) lbl.textContent=hvLabels[i];
    for(let d=0;d<3;d++){
      const dot=document.getElementById('hvDot'+d);
      if(dot) dot.classList.toggle('active',d===i);
    }
  }
  setTimeout(()=>{
    hvActivate(0);
    setInterval(()=>{ hvCurrent=(hvCurrent+1)%3; hvActivate(hvCurrent); },2600);
  },1400);
