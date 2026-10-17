/* =========================================================
   ANANYA & ADITYA — WEDDING INVITATION
   All interactive logic
   ========================================================= */
(function(){

  /* ---------------- Guest personalization via URL (?to=Name) ---------------- */
  const params = new URLSearchParams(window.location.search);
  const guestName = (params.get('to') || '').trim();
  const envGuestText = document.getElementById('envGuestText');
  const heroGreeting = document.getElementById('heroGreeting');
  if(guestName){
    envGuestText.textContent = guestName + ' जी, आपके लिए एक निमंत्रण है';
    heroGreeting.textContent = 'प्रिय ' + guestName + ', सादर आमंत्रित हैं';
  } else {
    envGuestText.textContent = 'आपके लिए एक निमंत्रण है';
    heroGreeting.textContent = 'सादर आमंत्रित हैं';
  }

  /* ---------------- Floating gold flecks in hero ---------------- */
  const flecksHost = document.getElementById('flecks');
  const FLECK_COUNT = 14;
  for(let i=0;i<FLECK_COUNT;i++){
    const s = document.createElement('span');
    s.style.left = Math.random()*100 + '%';
    s.style.bottom = (Math.random()*40) + 'px';
    s.style.animationDelay = (Math.random()*9) + 's';
    s.style.animationDuration = (7 + Math.random()*5) + 's';
    flecksHost.appendChild(s);
  }

  /* ---------------- Envelope open logic ---------------- */
  const envelopeScreen = document.getElementById('envelope-screen');
  const mainContent = document.getElementById('main-content');
  envelopeScreen.addEventListener('click', function(){
    if(envelopeScreen.classList.contains('opening')) return;
    envelopeScreen.classList.add('opening');
    mainContent.style.display = 'block';
    setTimeout(function(){
      envelopeScreen.classList.add('hidden');
      document.body.classList.remove('locked');
      window.scrollTo({top:0, behavior:'instant'});
      initScrollObservers(); // start nav + reveal tracking only once content is visible
    }, 850);
  });

  /* ---------------- Sticky nav: background on scroll + active link ---------------- */
  const nav = document.getElementById('site-nav');
  const navLinks = Array.from(nav.querySelectorAll('a'));
  function onScrollNav(){
    if(window.scrollY > 60){ nav.classList.add('scrolled'); }
    else { nav.classList.remove('scrolled'); }
  }
  window.addEventListener('scroll', onScrollNav, {passive:true});

  function initScrollObservers(){
    // Active section highlight
    const sectionIds = navLinks.map(a => a.dataset.target);
    const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

    const navObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          const id = entry.target.id;
          navLinks.forEach(a => a.classList.toggle('active', a.dataset.target === id));
        }
      });
    }, {rootMargin: "-45% 0px -50% 0px", threshold: 0});
    sections.forEach(sec => navObserver.observe(sec));

    // Reveal-on-scroll animation
    const revealObserver = new IntersectionObserver(function(entries, obs){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, {threshold: 0.15});
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  }

  /* ---------------- Smooth-scroll for nav clicks ---------------- */
  navLinks.forEach(function(a){
    a.addEventListener('click', function(e){
      e.preventDefault();
      const target = document.getElementById(a.dataset.target);
      if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

  /* ---------------- Countdown ---------------- */
  const weddingDate = new Date("2026-12-12T19:00:00").getTime();
  function updateCountdown(){
    const diff = weddingDate - Date.now();
    const cd = document.getElementById('countdown');
    if(diff <= 0){
      cd.innerHTML = "<p style='font-family:var(--serif);font-size:1.6rem;color:var(--gold-300)'>शादी की खुशियां शुरू!</p>";
      return;
    }
    document.getElementById('cd-days').textContent = Math.floor(diff/86400000);
    document.getElementById('cd-hours').textContent = Math.floor((diff%86400000)/3600000);
    document.getElementById('cd-mins').textContent = Math.floor((diff%3600000)/60000);
    document.getElementById('cd-secs').textContent = Math.floor((diff%60000)/1000);
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ---------------- Toast helper ---------------- */
  function showToast(msg){
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(()=>t.classList.remove('show'), 2600);
  }

  /* ---------------- Add to Calendar (.ics generation) ---------------- */
  document.getElementById('addCalBtn').addEventListener('click', function(){
    const start = "20261212T190000";
    const end   = "20261212T230000";
    const ics = [
      "BEGIN:VCALENDAR","VERSION:2.0","BEGIN:VEVENT",
      "SUMMARY:Ananya & Aditya - Wedding Ceremony",
      "DTSTART:"+start, "DTEND:"+end,
      "LOCATION:The Grand Palace Lawns, Amer Road, Jaipur, Rajasthan",
      "DESCRIPTION:Aapko Ananya aur Aditya ki shadi mein sadar aamantrit kiya jata hai.",
      "END:VEVENT","END:VCALENDAR"
    ].join("\r\n");
    const blob = new Blob([ics], {type:"text/calendar"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = "ananya-aditya-wedding.ics";
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    showToast("Calendar file download ho gayi!");
  });

  /* ---------------- Share button ---------------- */
  document.getElementById('shareBtn').addEventListener('click', async function(){
    const link = window.location.href;
    try{
      await navigator.clipboard.writeText(link);
      showToast("Link copy ho gaya, ab share kar sakte hain!");
    }catch(e){
      window.prompt("Is link ko copy karein:", link);
    }
  });

  /* ---------------- QR code for venue ---------------- */
  const venueQuery = encodeURIComponent("The Grand Palace Lawns, Amer Road, Jaipur, Rajasthan 302002");
  document.getElementById('qrImg').src =
    "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://maps.google.com/?q=" + venueQuery;

  /* ---------------- Gallery lightbox ---------------- */
  const lightbox = document.getElementById('lightbox');
  const lbFill = document.getElementById('lbFill');
  const lbCaption = document.getElementById('lbCaption');
  document.querySelectorAll('.g-frame').forEach(function(frame){
    frame.addEventListener('click', function(){
      const fillEl = frame.querySelector('.g-fill');
      lbFill.style.background = getComputedStyle(fillEl).backgroundImage;
      lbCaption.textContent = frame.dataset.caption || '';
      lightbox.classList.add('open');
    });
  });
  function closeLightbox(){ lightbox.classList.remove('open'); }
  document.getElementById('lbClose').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function(e){ if(e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeLightbox(); });

  /* ---------------- RSVP logic ---------------- */
  const responses = [];
  const rsvpForm = document.getElementById('rsvpForm');
  const phoneInput = document.getElementById('phone');

  function validatePhone(v){ return /^[0-9]{10}$/.test(v.replace(/\s+/g,'')); }

  function renderGuestList(){
    const list = document.getElementById('guestList');
    if(responses.length === 0){
      list.innerHTML = "<li class='empty'>अभी तक कोई RSVP नहीं आया</li>";
    } else {
      list.innerHTML = responses.map(function(r){
        const label = r.attend === 'yes' ? 'आ रहे हैं' : (r.attend === 'maybe' ? 'शायद' : 'नहीं आ पाएंगे');
        return "<li><span>"+r.name+"</span><span class='badge "+r.attend+"'>"+label+"</span></li>";
      }).join('');
    }
    const confirmed = responses.filter(r => r.attend === 'yes')
                                .reduce((sum,r) => sum + (r.guests >= 5 ? 5 : r.guests), 0);
    const maybeCount = responses.filter(r => r.attend === 'maybe').length;
    document.getElementById('statResponses').textContent = responses.length;
    document.getElementById('statConfirmed').textContent = confirmed;
    document.getElementById('statMaybe').textContent = maybeCount;
  }

  rsvpForm.addEventListener('submit', function(e){
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const phone = phoneInput.value.trim();
    const guests = parseInt(document.getElementById('guests').value, 10);
    const attend = document.getElementById('attend').value;

    let valid = true;
    if(name.length < 2){
      document.getElementById('name').classList.add('error');
      document.getElementById('err-name').style.display = 'block';
      valid = false;
    } else {
      document.getElementById('name').classList.remove('error');
      document.getElementById('err-name').style.display = 'none';
    }
    if(!validatePhone(phone)){
      phoneInput.classList.add('error');
      document.getElementById('err-phone').style.display = 'block';
      valid = false;
    } else {
      phoneInput.classList.remove('error');
      document.getElementById('err-phone').style.display = 'none';
    }
    if(!valid) return;

    responses.push({name, phone, guests, attend});
    renderGuestList();
    rsvpForm.reset();
    showToast("Dhanyavaad " + name + "! Aapka RSVP mil gaya.");
  });

  /* ---------------- Wishes wall logic ---------------- */
  const wishes = [];
  const wishForm = document.getElementById('wishForm');
  function renderWishes(){
    const wl = document.getElementById('wishList');
    if(wishes.length === 0){
      wl.innerHTML = "<p style='text-align:center;color:#a08a72;font-style:italic;'>सबसे पहले शुभकामना देने वाले आप बनें</p>";
      return;
    }
    wl.innerHTML = wishes.slice().reverse().map(function(w){
      return "<div class='wish-card'><div class='wn'>"+w.name+"</div><div class='wm'>"+w.msg+"</div><div class='wt'>"+w.time+"</div></div>";
    }).join('');
  }
  wishForm.addEventListener('submit', function(e){
    e.preventDefault();
    const n = document.getElementById('wishName').value.trim();
    const m = document.getElementById('wishMsg').value.trim();
    if(!n || !m) return;
    wishes.push({name:n, msg:m, time: new Date().toLocaleString('hi-IN', {hour:'2-digit', minute:'2-digit', day:'2-digit', month:'short'})});
    renderWishes();
    wishForm.reset();
  });
  renderWishes();
  renderGuestList();

})();