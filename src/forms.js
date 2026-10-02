/* Shared form handling for every page: Web3Forms delivery, the 4-step
   "Start a project" wizard (#wizard) and the contact form (#msgForm).
   Each part is skipped when its form isn't on the page. */
export function initForms(){
  /* ================= form delivery (Web3Forms) =================
     Same endpoint and access key as the site this replaces, so mail keeps
     arriving in the same inbox. Web3Forms keys are public by design: the key
     only lets a page submit to that inbox and carries no account access. */
  const ENDPOINT = 'https://api.web3forms.com/submit';
  const ACCESS_KEY = 'dc20b60f-c2b1-42d8-aaca-3baac1ec76d0';
  // One message per form per minute. Kept in memory only: the privacy policy promises this
  // site stores nothing in the browser, so this guard deliberately avoids localStorage.
  const COOLDOWN_MS = 60 * 1000;
  const sentAt = {};
  const recentlySent = key => Date.now() - (sentAt[key] || 0) < COOLDOWN_MS;
  const markSent = key => { sentAt[key] = Date.now(); };
  async function deliver(fields){
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ access_key: ACCESS_KEY, from_name: 'Apex Development Studio website', ...fields }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) throw new Error(data.message || `The form service answered ${res.status}.`);
  }

  /* ================= project intake wizard ================= */
  (function wizard(){
    const form = document.getElementById('wizard');
    if (!form) return;
    const steps = [...form.querySelectorAll('.wz-step')];
    const legend = [...document.querySelectorAll('#stepsLegend li')];
    const back = document.getElementById('wzBack'), next = document.getElementById('wzNext'), send = document.getElementById('wzSend');
    const status = document.getElementById('wzStatus');
    let cur = 0;
    const val = n => [...form.querySelectorAll(`[name="${n}"]`)].filter(e => (e.type === 'radio' || e.type === 'checkbox') ? e.checked : true).map(e => e.value.trim()).filter(Boolean);
    const checks = [
      () => val('kind').length ? '' : 'Choose what you have in mind.',
      () => !val('platforms').length ? 'Pick at least one platform, or "Not sure yet".' : (!val('stage').length ? 'Tell us how far along it is.' : ''),
      () => val('problem').length ? '' : 'Describe the problem it solves in a sentence or two.',
      () => !val('name').length ? 'Add your name.' : (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val('email')[0] || '') ? 'Enter a valid email address, like name@example.com.' : ''),
    ];
    function review(){
      const rows = [['Looking for', val('kind')], ['Platforms', val('platforms')], ['Stage', val('stage')], ['Name', val('project')], ['Timeline', val('timeline')], ['Budget', val('budget')]];
      const box = document.getElementById('wzReview'); box.innerHTML = '';
      for (const [k, v] of rows){ if (!v.length) continue; const dt = document.createElement('dt'); dt.textContent = k; const dd = document.createElement('dd'); dd.textContent = v.join(', '); box.append(dt, dd); }
    }
    function show(i){
      cur = i;
      steps.forEach((s, k) => s.hidden = k !== i);
      legend.forEach((l, k) => { l.classList.toggle('on', k === i); l.classList.toggle('done', k < i); });
      document.getElementById('wzCount').textContent = `Step ${i+1} of ${steps.length}`;
      document.getElementById('wzBar').style.width = ((i+1)/steps.length*100) + '%';
      back.hidden = i === 0; next.hidden = i === steps.length-1; send.hidden = i !== steps.length-1;
      status.textContent = ''; status.className = 'form-status';
      if (i === steps.length-1) review();
    }
    function guard(){ const msg = checks[cur](); if (msg){ status.className = 'form-status err'; status.textContent = msg; } return !msg; }
    next.addEventListener('click', () => { if (guard()) show(cur+1); });
    back.addEventListener('click', () => show(cur-1));
    let sending = false;
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (sending || !guard()) return;
      const done = () => { status.className = 'form-status ok'; status.textContent = 'Thank you. Your idea is on its way, and the founder will reply by email.'; send.disabled = true; back.disabled = true; };
      if (val('botcheck').length){ done(); return; }          // bot filled the trap: pretend, send nothing
      if (recentlySent('apex-sent-project')){ status.className = 'form-status err'; status.textContent = 'Your idea was just sent. Wait a minute before sending another.'; return; }
      sending = true; send.disabled = true; send.textContent = 'Sending…';
      status.className = 'form-status'; status.textContent = '';
      const name = val('name')[0], kind = val('kind')[0];
      try {
        await deliver({
          subject: `[Project] ${kind} from ${name}`,
          name, email: val('email')[0],
          'Looking for': kind,
          'Platforms': val('platforms').join(', '),
          'Stage': val('stage')[0] || '',
          'Working name': val('project')[0] || '(none given)',
          'Problem it solves': val('problem')[0],
          'Timeline': val('timeline')[0],
          'Budget': val('budget')[0],
          'NDA requested': val('nda').length ? 'Yes' : 'No',
        });
        markSent('apex-sent-project');
        send.textContent = 'Sent';
        done();
      } catch (err) {
        status.className = 'form-status err';
        status.textContent = `Your idea didn't send. ${err.message} Try again, or email support@apexdevelopmentstudio.com.`;
        send.disabled = false; send.textContent = 'Send my idea';
      } finally { sending = false; }
    });
    show(0);
  })();

  /* ================= contact form ================= */
  (function contact(){
  const form = document.getElementById('msgForm'), statusEl = document.getElementById('formStatus');
  if (!form) return;
  const sendBtn = document.getElementById('sendBtn');
  let msgSending = false;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (msgSending) return;
    const f = new FormData(form);
    const thanks = () => { statusEl.className = 'form-status ok'; statusEl.textContent = 'Thank you. Your message is on its way, and the founder will reply by email.'; };
    if ((f.get('botcheck') || '').trim()){ thanks(); return; } // bot filled the trap: pretend, send nothing
    const fields = ['name','email','inquiry_type','message'];
    let firstBad = null;
    for (const n of fields){
      const el = form.elements[n]; const v = (f.get(n) || '').trim();
      const bad = !v || (n === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
      el.setAttribute('aria-invalid', bad ? 'true' : 'false');
      if (bad && !firstBad) firstBad = el;
    }
    if (firstBad){
      statusEl.className = 'form-status err';
      statusEl.textContent = firstBad.name === 'email' && (f.get('email')||'').trim() ? 'Enter a valid email address, like name@example.com.' : 'Fill in every field so we can reply.';
      firstBad.focus(); return;
    }
    if (recentlySent('apex-sent-contact')){ statusEl.className = 'form-status err'; statusEl.textContent = 'Your message was just sent. Wait a minute before sending another.'; return; }
    const topic = form.elements.inquiry_type.selectedOptions[0].textContent;
    const name = f.get('name').trim();
    msgSending = true; sendBtn.disabled = true; sendBtn.textContent = 'Sending…';
    statusEl.className = 'form-status'; statusEl.textContent = '';
    try {
      await deliver({ subject: `[${topic}] Message from ${name}`, name, email: f.get('email').trim(), inquiry_type: topic, message: f.get('message').trim() });
      markSent('apex-sent-contact');
      form.reset(); thanks();
    } catch (err) {
      statusEl.className = 'form-status err';
      statusEl.textContent = `Your message didn't send. ${err.message} Try again, or email support@apexdevelopmentstudio.com.`;
    } finally { msgSending = false; sendBtn.disabled = false; sendBtn.textContent = 'Send message'; }
  });
  })();
}
