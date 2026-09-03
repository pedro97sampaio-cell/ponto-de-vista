/* Ponto de Vista — comportamento. Sem dependências. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── nav: fundo ao sair do herói, esconde a descer, aparece a subir ── */
  const nav = document.getElementById('nav');
  let last = 0;
  addEventListener('scroll', () => {
    const y = scrollY;
    nav.classList.toggle('is-stuck', y > 40);
    nav.classList.toggle('is-hidden', y > 400 && y > last && !menuOpen);
    last = y;
  }, { passive: true });

  /* ── menu mobile ── */
  const burger = document.getElementById('burger');
  const menu = document.getElementById('menu');
  let menuOpen = false;
  const setMenu = (open) => {
    menuOpen = open;
    menu.hidden = !open;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setMenu(!menuOpen));
  menu.addEventListener('click', (e) => { if (e.target.tagName === 'A') setMenu(false); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuOpen) setMenu(false); });

  /* ── revelação ao scroll ── */
  const targets = document.querySelectorAll('[data-reveal], .tile');
  if (reduce) {
    targets.forEach(el => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        setTimeout(() => entry.target.classList.add('is-in'), i * 70);
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    targets.forEach(el => io.observe(el));
  }

  /* ── filtros do trabalho ── */
  const filters = document.querySelectorAll('.filter');
  const tiles = [...document.querySelectorAll('.tile')];
  filters.forEach(btn => btn.addEventListener('click', () => {
    const cat = btn.dataset.filter;
    filters.forEach(b => {
      const on = b === btn;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', String(on));
    });
    tiles.forEach(t => {
      const show = cat === 'todos' || t.dataset.cat === cat;
      if (show) {
        t.hidden = false;
        requestAnimationFrame(() => t.classList.remove('is-out'));
      } else {
        t.classList.add('is-out');
        setTimeout(() => {
          if (t.classList.contains('is-out')) { t.hidden = true; repack(); }
        }, reduce ? 0 : 400);
      }
    });
    repack();
  }));

  /* ── empacotamento da grelha ──────────────────────────────────
     A grelha tem linhas de 4px; cada peça ocupa as linhas que a sua
     altura real pedir. Assim mantém-se a assimetria das 12 colunas
     sem que cada linha herde a altura da peça mais alta.           */
  const grid = document.getElementById('grid');
  const ROW = 4;
  const pack = () => {
    if (getComputedStyle(grid).gridTemplateColumns.split(' ').length < 2) return;
    const gap = parseFloat(getComputedStyle(grid).columnGap) || 0;
    grid.classList.add('is-packed');
    tiles.forEach(t => {
      if (t.hidden) return;
      // offsetHeight: altura de layout, imune aos transforms da revelação
      t.style.gridRowEnd = `span ${Math.ceil((t.offsetHeight + gap) / ROW)}`;
    });
  };
  const repack = () => requestAnimationFrame(pack);
  addEventListener('load', repack);
  addEventListener('resize', repack);
  new ResizeObserver(repack).observe(grid);
  document.querySelectorAll('.grid img').forEach(img => {
    if (!img.complete) img.addEventListener('load', repack, { once: true });
  });
  document.fonts?.ready.then(repack);
  repack();

  /* ── lightbox de vídeo (dialog nativo) ── */
  const lb = document.getElementById('lb');
  const lbVideo = document.getElementById('lb-video');
  const lbCap = document.getElementById('lb-cap');
  document.querySelectorAll('.tile[data-video]').forEach(tile => {
    tile.addEventListener('click', () => {
      const img = tile.querySelector('img');
      lbVideo.poster = img.currentSrc || img.src;
      lbVideo.src = `assets/media/${tile.dataset.video}.mp4`;
      lbCap.textContent = tile.querySelector('.t').textContent + ' — ' + tile.querySelector('.m').textContent;
      lb.showModal();
      lbVideo.play().catch(() => { /* sem ficheiro: fica o poster e os controlos */ });
    });
  });
  const closeLb = () => { lbVideo.pause(); lbVideo.removeAttribute('src'); lbVideo.load(); lb.close(); };
  document.getElementById('lb-x').addEventListener('click', closeLb);
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
  lb.addEventListener('close', () => { lbVideo.pause(); });

  /* ── formulário: validação nativa, sem backend ligado ── */
  const form = document.getElementById('form');
  const note = document.getElementById('form-note');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    // TODO: ligar ao endpoint real (Formspree, Resend, API própria).
    form.classList.add('is-sent');
    note.textContent = 'Recebido. Respondemos em 24 h — verifiquem também o spam.';
  });
})();
