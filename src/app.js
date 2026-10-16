const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} }
};
let lang = 'en';
const t = (key) => key.split('.').reduce((o, k) => (o || {})[k], I18N[lang]) ?? key.split('.').reduce((o, k) => (o || {})[k], I18N.en) ?? key;

function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('on');
  clearTimeout(toast.h);
  toast.h = setTimeout(() => el.classList.remove('on'), 2600);
}

/* language */
function setLang(l) {
  lang = I18N[l] ? l : 'en';
  document.documentElement.lang = lang;
  $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  $$('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
  $$('.seg button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  store.set('lh-lang', lang);
  renderList();
  renderDev();
}
$$('.seg button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));

/* theme */
$('#theme').addEventListener('click', () => {
  const root = document.documentElement;
  const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  root.dataset.theme = dark ? 'light' : 'dark';
  store.set('lh-theme', root.dataset.theme);
});
const savedTheme = store.get('lh-theme');
if (savedTheme) document.documentElement.dataset.theme = savedTheme;

/* phone carousels */
function carousel(box) {
  const steps = $$('[data-go]', box);
  const scrs = $$('.scr', box);
  let i = 0, timer;
  const show = (n) => {
    i = (n + steps.length) % steps.length;
    const id = steps[i].dataset.go;
    steps.forEach((s, k) => s.setAttribute('aria-selected', String(k === i)));
    scrs.forEach(s => s.classList.toggle('on', s.dataset.scr === id));
    clearTimeout(timer);
    timer = setTimeout(() => show(i + 1), 6000);
  };
  steps.forEach((s, k) => s.addEventListener('click', () => show(k)));
  box.addEventListener('mouseenter', () => { clearTimeout(timer); box.classList.add('paused'); });
  box.addEventListener('mouseleave', () => { box.classList.remove('paused'); show(i); });
  show(0);
}
$$('[data-carousel]').forEach(carousel);
(function heroCycle() {
  const scrs = $$('#heroPhone .scr');
  let i = 0;
  setInterval(() => { i = (i + 1) % scrs.length; scrs.forEach((s, k) => s.classList.toggle('on', k === i)); }, 4500);
})();

/* journeys tabs */
$$('.tabs button').forEach(b => b.addEventListener('click', () => {
  $$('.tabs button').forEach(x => x.setAttribute('aria-selected', String(x === b)));
  $$('.lane').forEach(l => { l.hidden = l.id !== b.dataset.lane; if (!l.hidden) requestAnimationFrame(() => l.classList.add('in')); });
}));

/* reveal on scroll */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .15 });
$$('.reveal').forEach(el => io.observe(el));

/* sample devices at real places across India */
const DEVICES = [
  { id: 'DEV-7K2Q-91XF', name: 'Sunita Pawar', city: 'Hadapsar, Pune', lat: 18.5089, lng: 73.9260, st: 'fresh', bat: 82, chg: true, net: '4G', min: 8, acc: 12, phone: 'vivo Y28 · A14', app: '1.1.0', sim: 'Ready', loan: 'Active' },
  { id: 'DEV-3M8C-20LA', name: 'Rekha Jadhav', city: 'Pimpri-Chinchwad', lat: 18.6298, lng: 73.7997, st: 'fresh', bat: 64, chg: false, net: 'Wi-Fi', min: 3, acc: 20, phone: 'Redmi Note 13 · A14', app: '1.1.0', sim: 'Ready', loan: 'Active' },
  { id: 'DEV-4Q1N-66PR', name: 'Meena Patel', city: 'Maninagar, Ahmedabad', lat: 22.9962, lng: 72.6030, st: 'fresh', bat: 47, chg: false, net: '4G', min: 14, acc: 9, phone: 'Samsung A15 · A14', app: '1.1.0', sim: 'Ready', loan: 'Active' },
  { id: 'DEV-8T5H-03KD', name: 'Hetal Shah', city: 'Varachha, Surat', lat: 21.2050, lng: 72.8530, st: 'fresh', bat: 91, chg: true, net: '5G', min: 2, acc: 6, phone: 'realme 12 · A14', app: '1.1.0', sim: 'Ready', loan: 'Active' },
  { id: 'DEV-9P1D-77QW', name: 'Lata Shinde', city: 'Dharavi, Mumbai', lat: 19.0380, lng: 72.8538, st: 'stale', bat: 15, chg: false, net: 'No signal', min: 4320, acc: 45, phone: 'vivo Y28 · A14', app: '1.0.3', sim: 'Absent', loan: 'Overdue' },
  { id: 'DEV-1B7Y-58UV', name: 'Kamla Devi', city: 'Mansarovar, Jaipur', lat: 26.8505, lng: 75.7628, st: 'fresh', bat: 58, chg: false, net: '4G', min: 22, acc: 15, phone: 'Moto G34 · A14', app: '1.1.0', sim: 'Ready', loan: 'Active' },
  { id: 'DEV-5C2R-41GH', name: 'Pushpa Yadav', city: 'Alambagh, Lucknow', lat: 26.8133, lng: 80.9050, st: 'fresh', bat: 73, chg: false, net: '4G', min: 31, acc: 18, phone: 'Redmi 13C · A13', app: '1.1.0', sim: 'Ready', loan: 'Active' },
  { id: 'DEV-6R0K-12ZE', name: 'Sarita Kumari', city: 'Kankarbagh, Patna', lat: 25.5940, lng: 85.1580, st: 'off', bat: 39, chg: false, net: '3G', min: 55, acc: null, phone: 'itel A70 · A13', app: '1.1.0', sim: 'Ready', loan: 'Active' },
  { id: 'DEV-2H6T-58NB', name: 'Mousumi Das', city: 'Behala, Kolkata', lat: 22.4980, lng: 88.3100, st: 'stale', bat: 22, chg: false, net: 'Wi-Fi', min: 15840, acc: 60, phone: 'realme C55 · A13', app: '1.0.3', sim: 'Unknown', loan: 'Active' },
  { id: 'DEV-7J3W-90QS', name: 'Lakshmi Reddy', city: 'Kukatpally, Hyderabad', lat: 17.4948, lng: 78.3996, st: 'fresh', bat: 88, chg: true, net: '5G', min: 5, acc: 8, phone: 'Samsung M14 · A14', app: '1.1.0', sim: 'Ready', loan: 'Active' },
  { id: 'DEV-0F9E-27MX', name: 'Savitha Gowda', city: 'Yelahanka, Bengaluru', lat: 13.1007, lng: 77.5963, st: 'fresh', bat: 66, chg: false, net: '4G', min: 11, acc: 10, phone: 'POCO M6 · A14', app: '1.1.0', sim: 'Ready', loan: 'Active' },
  { id: 'DEV-3V6L-84TA', name: 'Selvi Murugan', city: 'Tambaram, Chennai', lat: 12.9249, lng: 80.1000, st: 'off', bat: 51, chg: false, net: '4G', min: 40, acc: null, phone: 'vivo T3 · A14', app: '1.1.0', sim: 'Ready', loan: 'Active' },
  { id: 'DEV-4K8P-15BC', name: 'Vandana Thakre', city: 'Sitabuldi, Nagpur', lat: 21.1458, lng: 79.0882, st: 'fresh', bat: 79, chg: false, net: '4G', min: 18, acc: 14, phone: 'Redmi 12 · A14', app: '1.1.0', sim: 'Ready', loan: 'Active' },
  { id: 'DEV-6N2D-33FY', name: 'Geeta Verma', city: 'Vijay Nagar, Indore', lat: 22.7533, lng: 75.8937, st: 'stale', bat: 9, chg: false, net: 'No signal', min: 2880, acc: 80, phone: 'Lava Blaze · A13', app: '1.0.3', sim: 'Absent', loan: 'Overdue' },
  { id: 'DEV-8W4G-62HN', name: 'Anita Rani', city: 'Uttam Nagar, Delhi', lat: 28.6210, lng: 77.0550, st: 'fresh', bat: 70, chg: false, net: '4G', min: 7, acc: 11, phone: 'Samsung A05 · A14', app: '1.1.0', sim: 'Ready', loan: 'Active' },
  { id: 'DEV-5S1M-09RJ', name: 'Pranita Boro', city: 'Dispur, Guwahati', lat: 26.1433, lng: 91.7898, st: 'fresh', bat: 55, chg: false, net: '4G', min: 26, acc: 22, phone: 'Redmi 13C · A13', app: '1.1.0', sim: 'Ready', loan: 'Active' },
  { id: 'DEV-2A7X-71KE', name: 'Kavita Rathod', city: 'Vadodara', lat: 22.3072, lng: 73.1812, st: 'fresh', bat: 61, chg: false, net: '4G', min: 9, acc: 13, phone: 'vivo Y18 · A14', app: '1.1.0', sim: 'Ready', loan: 'Active' },
  { id: 'DEV-9D3F-48WP', name: 'Usha Nair', city: 'Kakkanad, Kochi', lat: 10.0159, lng: 76.3419, st: 'fresh', bat: 84, chg: true, net: 'Wi-Fi', min: 4, acc: 7, phone: 'Samsung F15 · A14', app: '1.1.0', sim: 'Ready', loan: 'Active' }
];
const COLOR = { fresh: '#1F8A5B', stale: '#F2A900', off: '#8F8DA8' };
let filter = 'all', selId = DEVICES[0].id, map = null, markers = {}, offRing = null, meMarker = null;

const ago = (min) => {
  const rtf = new Intl.RelativeTimeFormat(lang === 'en' ? 'en-IN' : lang + '-IN', { numeric: 'auto', style: 'short' });
  if (min < 60) return rtf.format(-Math.max(1, Math.round(min)), 'minute');
  if (min < 1440) return rtf.format(-Math.round(min / 60), 'hour');
  return rtf.format(-Math.round(min / 1440), 'day');
};
const badgeCls = (d) => d.st === 'fresh' ? 'b-fresh' : d.st === 'stale' ? 'b-stale' : 'b-off';
const stLabel = (d) => d.st === 'fresh' ? t('map.fresh') : d.st === 'stale' ? t('map.stale') : t('map.off');
const visible = (d) => filter === 'all' || d.st === filter;
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function renderList() {
  const box = $('#devlist');
  box.innerHTML = DEVICES.filter(visible).map(d =>
    `<button data-id="${d.id}" aria-current="${d.id === selId}"><i class="dot" style="background:${COLOR[d.st]}"></i><span class="nm">${esc(d.name)} · ${esc(d.city)}</span><small>${ago(d.min)}</small></button>`
  ).join('');
  $$('button', box).forEach(b => b.addEventListener('click', () => select(b.dataset.id, true)));
}

function renderDev() {
  const d = DEVICES.find(x => x.id === selId);
  if (!d) return;
  const batColor = d.bat < 20 ? '#A12C2C' : d.bat < 50 ? '#F2A900' : '#1F8A5B';
  const loc = d.st === 'off' ? t('map.none') : `${d.lat.toFixed(4)}, ${d.lng.toFixed(4)}`;
  $('#dev').innerHTML = `
    <div class="dev-top"><span class="ic"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B36A8" stroke-width="2"><rect x="6" y="2.5" width="12" height="19" rx="2.5" fill="#D6D3F6"/><path d="M11 18h2"/></svg></span>
      <div style="flex:1;min-width:0"><b>${esc(d.name)}</b><small>${esc(d.id)} · ${esc(d.city)}</small></div>
      <span class="badge ${badgeCls(d)}">${stLabel(d)}</span></div>
    <div class="metrics">
      <div class="metric"><small>${t('map.battery')}</small><b>${d.bat}%${d.chg ? ' ⚡' : ''}</b><div class="meter"><i style="width:${d.bat}%;background:${batColor}"></i></div></div>
      <div class="metric"><small>${t('map.network')}</small><b>${esc(d.net)}</b></div>
      <div class="metric"><small>${t('map.seen')}</small><b>${ago(d.min)}</b></div>
      <div class="metric"><small>${t('map.acc')}</small><b>${d.acc ? '±' + d.acc + ' m' : '—'}</b></div>
    </div>
    <div class="rows">
      <div><span>${t('map.phone')}</span><span>${esc(d.phone)}</span></div>
      <div><span>${t('map.app')}</span><span>${esc(d.app)}</span></div>
      <div><span>${t('map.sim')}</span><span>${esc(d.sim)}</span></div>
      <div><span>${t('map.loan')}</span><span style="color:${d.loan === 'Overdue' ? '#A12C2C' : 'inherit'}">${esc(d.loan)}</span></div>
      <div><span>${t('map.consent')}</span><span>${d.st === 'off' ? t('map.declined') : t('map.given')}</span></div>
      <div><span>GPS</span><span>${loc}</span></div>
    </div>`;
}

const INDIA = { lat: 22.5, lng: 79 };
const mapFail = () => $('#maperr').classList.add('on');

function pinIcon(d) {
  const on = d.id === selId;
  return { path: google.maps.SymbolPath.CIRCLE, scale: on ? 11 : 8, fillColor: COLOR[d.st], fillOpacity: d.st === 'off' ? .75 : 1,
    strokeColor: on ? '#23206B' : '#FFFFFF', strokeWeight: on ? 4 : 3 };
}

function select(id, fly) {
  selId = id;
  const d = DEVICES.find(x => x.id === id);
  renderList(); renderDev();
  if (!map) return;
  Object.values(markers).forEach(m => { m.setIcon(pinIcon(m.dev)); m.setZIndex(m.dev.id === id ? 10 : 1); });
  if (offRing) { offRing.setMap(null); offRing = null; }
  if (d.st === 'off') offRing = new google.maps.Circle({ map, center: { lat: d.lat, lng: d.lng }, radius: 8000,
    strokeColor: '#8F8DA8', strokeWeight: 2, strokeOpacity: .8, fillColor: '#8F8DA8', fillOpacity: .08 });
  if (fly) { map.panTo({ lat: d.lat, lng: d.lng }); map.setZoom(d.st === 'off' ? 11 : 14); }
}

function applyFilter() {
  $$('.filters button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.f === filter)));
  Object.values(markers).forEach(m => m.setVisible(visible(m.dev)));
  renderList();
}
$$('.filters button').forEach(b => b.addEventListener('click', () => { filter = b.dataset.f; applyFilter(); }));

window.lhInitMap = function () {
  map = new google.maps.Map($('#lhmap'), {
    center: INDIA, zoom: 5, minZoom: 4, gestureHandling: 'cooperative', mapTypeControl: false, streetViewControl: false,
    fullscreenControl: true, clickableIcons: false,
    restriction: { latLngBounds: { north: 40, south: 2, west: 60, east: 102 }, strictBounds: false }
  });
  DEVICES.forEach(d => {
    const m = new google.maps.Marker({ map, position: { lat: d.lat, lng: d.lng }, icon: pinIcon(d), title: `${d.name} · ${d.city}` });
    m.dev = d;
    m.addListener('click', () => select(d.id, false));
    markers[d.id] = m;
  });
  applyFilter();
  select(selId, false);
};
// Google calls this when the key is invalid or the page's referrer isn't allowed for it.
window.gm_authFailure = mapFail;

function loadGoogleMaps() {
  if (!MAPS_KEY) return mapFail();
  const s = document.createElement('script');
  s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(MAPS_KEY)}&callback=lhInitMap&v=weekly&region=IN&language=${lang}`;
  s.async = true;
  s.onerror = mapFail;
  document.head.appendChild(s);
  setTimeout(() => { if (!map) mapFail(); }, 10000);
}

/* simulate live check-ins */
setInterval(() => {
  DEVICES.forEach(d => { d.min += 0.1; });
  const pool = DEVICES.filter(d => d.st === 'fresh');
  const d = pool[Math.floor(Math.random() * pool.length)];
  d.min = 0.2;
  d.bat = Math.max(5, Math.min(100, d.bat + (d.chg ? 1 : -1)));
  if (d.acc) { d.lat += (Math.random() - .5) * .0008; d.lng += (Math.random() - .5) * .0008; markers[d.id]?.setPosition({ lat: d.lat, lng: d.lng }); }
  renderList();
  if (d.id === selId) renderDev();
}, 6000);

/* search (Geocoding API) */
$('#search').addEventListener('submit', (e) => {
  e.preventDefault();
  const q = $('#q').value.trim();
  if (!q || !map) return;
  toast(t('map.searching'));
  new google.maps.Geocoder().geocode({ address: q, componentRestrictions: { country: 'IN' }, language: lang }, (res, status) => {
    if (status !== 'OK' || !res?.length) return toast(t('map.notFound'));
    map.fitBounds(res[0].geometry.viewport);
    toast(res[0].formatted_address);
  });
});

/* my location */
$('#me').addEventListener('click', () => {
  if (!navigator.geolocation) return toast(t('map.meNo'));
  navigator.geolocation.getCurrentPosition(p => {
    if (!map) return;
    const ll = { lat: p.coords.latitude, lng: p.coords.longitude };
    meMarker?.setMap(null);
    meMarker = new google.maps.Marker({ map, position: ll, zIndex: 20, title: t('map.meHere'),
      icon: { path: google.maps.SymbolPath.CIRCLE, scale: 9, fillColor: '#3B82F6', fillOpacity: 1, strokeColor: '#FFFFFF', strokeWeight: 3 } });
    new google.maps.InfoWindow({ content: `<b>${t('map.meHere')}</b><br>${ll.lat.toFixed(5)}, ${ll.lng.toFixed(5)} · ±${Math.round(p.coords.accuracy)} m` }).open({ map, anchor: meMarker });
    map.panTo(ll); map.setZoom(15);
  }, err => toast(err.code === 1 ? t('map.meDenied') : t('map.meNo')), { enableHighAccuracy: true, timeout: 12000 });
});
$('#india').addEventListener('click', () => { if (map) { map.panTo(INDIA); map.setZoom(5); } });

/* download */
try { new QRCode($('#qr'), { text: APK_URL, width: 200, height: 200, colorDark: '#23206B', colorLight: '#FFFFFF', correctLevel: QRCode.CorrectLevel.M }); } catch {}
$('#copy').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(APK_URL); toast(t('dl.copied')); } catch { toast(APK_URL); }
});

loadGoogleMaps();
setLang(new URLSearchParams(location.search).get('lang') || store.get('lh-lang') || (navigator.language || 'en').slice(0, 2));
