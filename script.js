// Menú mobile
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
if (burger && nav) {
  const close = () => { nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); };
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

// Botón compartir: Web Share en celular, copiar link en compu
const share = document.getElementById('share');
if (share) {
  share.addEventListener('click', async () => {
    const data = { title: document.title, url: location.href };
    try {
      if (navigator.share) { await navigator.share(data); return; }
      await navigator.clipboard.writeText(location.href);
      share.textContent = 'Link copiado';
      setTimeout(() => { share.textContent = 'Compartir esta página'; }, 2200);
    } catch (e) { /* el usuario canceló */ }
  });
}

// Pedido de primera entrevista: arma el mensaje de WhatsApp
const planner = document.getElementById('planner');
if (planner) {
  const msg = document.getElementById('planner-msg');
  const send = document.getElementById('planner-send');
  const list = arr => arr.length < 2 ? arr.join('') : arr.slice(0, -1).join(', ') + ' o ' + arr[arr.length - 1];
  const update = () => {
    const f = new FormData(planner);
    const dias = f.getAll('dia');
    const cuando = dias.length ? `Me sirven los ${list(dias)}` : 'Me sirve cualquier día de la semana';
    const text = `Hola Julián, quería pedir una primera entrevista para ${f.get('motivo')}, ${f.get('modo')}. ${cuando}, ${f.get('franja')}. Gracias!`;
    msg.textContent = text;
    send.href = 'https://wa.me/5491131818868?text=' + encodeURIComponent(text);
  };
  planner.addEventListener('change', update);
  planner.addEventListener('submit', e => e.preventDefault());
  update();
}

// Header con sombra al scrollear
const header = document.getElementById('top');
if (header) {
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// El botón fijo de mobile se esconde cuando ya se ven el inicio o el formulario
const sticky = document.querySelector('.sticky-cta');
if (sticky && 'IntersectionObserver' in window) {
  const zones = [document.querySelector('.hero'), document.getElementById('primera-entrevista')].filter(Boolean);
  const visible = new Set();
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => e.isIntersecting ? visible.add(e.target) : visible.delete(e.target));
    sticky.classList.toggle('is-hidden', visible.size > 0);
  }, { threshold: 0.15 });
  zones.forEach(z => io.observe(z));
}
