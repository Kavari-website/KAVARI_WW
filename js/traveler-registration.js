(function(){
  const key='kavari-travelers';
  const get=()=>{try{return JSON.parse(localStorage.getItem(key))||[]}catch(_){return[]}};
  const esc=s=>String(s||'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const initials=name=>String(name||'?').trim().split(/\s+/).slice(0,2).map(w=>w[0]?.toUpperCase()||'').join('')||'?';

  function open(){document.getElementById('travelerModal')?.classList.add('open');document.body.style.overflow='hidden'}
  function close(){document.getElementById('travelerModal')?.classList.remove('open');document.body.style.overflow=''}

  function render(){
    const root=document.getElementById('travelersByCountry');
    if(!root)return;
    const countryKey=localStorage.getItem('paisSeleccionado')||'';
    const countryName=root.dataset.countryName||'';
    const items=get().filter(x=>x.country===countryKey);

    if(!countryKey){
      root.innerHTML=`
        <div class="tbc-head"><h3>Viajeros registrados</h3></div>
        <div class="tbc-empty"><strong>Selecciona un país</strong><span>Elige un destino para ver quién más viaja allí.</span></div>`;
      return;
    }

    if(!items.length){
      root.innerHTML=`
        <div class="tbc-head"><h3>Viajeros registrados</h3><span class="tbc-count">0</span></div>
        <p class="tbc-sub">Aún nadie se ha registrado para ${esc(countryName||'este destino')}.</p>
        <div class="tbc-empty"><strong>Sé el primero</strong><span>Regístrate y aparece aquí para otros viajeros.</span>
          <button type="button" class="tbc-cta">Registrarme</button>
        </div>`;
      root.querySelector('.tbc-cta')?.addEventListener('click',open);
      return;
    }

    root.innerHTML=`
      <div class="tbc-head"><h3>Viajeros registrados</h3><span class="tbc-count">${items.length}</span></div>
      <p class="tbc-sub">Personas registradas para ${esc(countryName||'este destino')}.</p>
      <div class="traveler-list">
        ${items.map(x=>`
          <div class="traveler-chip">
            <span class="chip-avatar">${esc(initials(x.name))}</span>
            <span class="chip-body">
              <span class="chip-name">${esc(x.name)}</span>
              <small>${esc(x.plan)}</small>
            </span>
          </div>`).join('')}
      </div>`;
  }

  function renderSkeleton(){
    const root=document.getElementById('travelersByCountry');
    if(!root)return;
    root.innerHTML=`<div class="tbc-head"><h3>Viajeros registrados</h3></div>
      <div class="tbc-skeleton">${'<span></span>'.repeat(4)}</div>`;
  }

  function init(){
    document.querySelectorAll('.nav-register').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();open()}));

    if(document.querySelector('.nav-register')&&!document.getElementById('travelerModal')){
      const m=document.createElement('div');
      m.id='travelerModal';
      m.className='traveler-modal';
      m.innerHTML=`<section class="traveler-card" role="dialog" aria-modal="true">
        <button class="traveler-close" type="button" aria-label="Cerrar">×</button>
        <h2>Regístrate como viajero</h2>
        <p>Guarda tu país y plan para aparecer en la lista del destino elegido.</p>
        <form class="traveler-form" novalidate>
          <label>Nombre<input name="name" required minlength="2"></label>
          <label>Correo<input name="email" type="email" required></label>
          <label>País<select name="country" required><option value="">Cargando países…</option></select></label>
          <label>Plan<select name="plan"><option>Gratis</option><option>Premium · US$9.99/mes</option><option>OP · US$19.99/mes</option></select></label>
          <button class="traveler-submit" type="submit">Guardar registro</button>
          <p class="traveler-status" role="status" aria-live="polite"></p>
        </form>
      </section>`;
      document.body.appendChild(m);

      m.querySelector('.traveler-close').onclick=close;
      m.addEventListener('click',e=>{if(e.target===m)close()});
      document.addEventListener('keydown',e=>{if(e.key==='Escape'&&m.classList.contains('open'))close()});

      fetch('data/data.json').then(r=>r.json()).then(data=>{
        const s=m.querySelector('[name=country]');
        s.innerHTML='<option value="">Selecciona un país</option>'+Object.entries(data)
          .filter(([,v])=>v&&v.nombre)
          .map(([k,v])=>`<option value="${esc(k)}">${esc(v.nombre)}</option>`).join('');
        s.value=localStorage.getItem('paisSeleccionado')||'';
      }).catch(()=>{
        m.querySelector('.traveler-status').textContent='No se pudo cargar la lista de países.';
        m.querySelector('.traveler-status').classList.add('is-error');
      });

      const form=m.querySelector('form');
      const status=m.querySelector('.traveler-status');
      const submitBtn=m.querySelector('.traveler-submit');

      form.onsubmit=e=>{
        e.preventDefault();
        status.classList.remove('is-error');

        const f=new FormData(form);
        const name=(f.get('name')||'').trim();
        const email=(f.get('email')||'').trim();
        const country=f.get('country');
        const plan=f.get('plan');

        form.querySelectorAll('.field-error').forEach(el=>el.classList.remove('field-error'));
        const errors=[];
        if(name.length<2){errors.push('name')}
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){errors.push('email')}
        if(!country){errors.push('country')}
        if(errors.length){
          errors.forEach(n=>form.querySelector(`[name=${n}]`).classList.add('field-error'));
          status.textContent='Revisa los campos marcados.';
          status.classList.add('is-error');
          return;
        }

        submitBtn.disabled=true;
        submitBtn.textContent='Guardando…';

        const list=get();
        const country_ = country;
        if(list.some(x=>x.email.toLowerCase()===email.toLowerCase()&&x.country===country_)){
          status.textContent='Ya estás registrado para este destino.';
          status.classList.add('is-error');
          submitBtn.disabled=false;
          submitBtn.textContent='Guardar registro';
          return;
        }

        list.push({name,email,country:country_,plan});
        localStorage.setItem(key,JSON.stringify(list));

        setTimeout(()=>{
          status.textContent='Registro guardado. Ya apareces en el destino elegido.';
          submitBtn.disabled=false;
          submitBtn.textContent='Guardar registro';
          render();
          setTimeout(close,900);
          form.reset();
        },250);
      };
    }

    if(document.body.classList.contains('page-destino')){
      const root=document.createElement('section');
      root.id='travelersByCountry';
      root.className='travelers-by-country';
      document.querySelector('#section-guias .guides-section')?.prepend(root);
      renderSkeleton();
      setTimeout(render,150);
      window.addEventListener('kavari:countrychange',e=>{
        if(e?.detail?.nombre)root.dataset.countryName=e.detail.nombre;
        render();
      });
    }
  }

  document.addEventListener('DOMContentLoaded',init);
})();