import { readFileSync, writeFileSync } from 'node:fs';

const APK_URL = 'https://github.com/Yadav0141/marketing/releases/latest/download/lh-microfinance-customer.apk';
const SITE_URL = 'https://yadav0141.github.io/marketing/';

const src = (f) => readFileSync(new URL(`./src/${f}`, import.meta.url), 'utf8').replace(/^﻿/, '');
const i18n = Object.fromEntries(['en', 'hi', 'gu'].map((l) => [l, JSON.parse(src(`i18n/${l}.json`))]));

const keys = (o, p = '') => Object.entries(o).flatMap(([k, v]) => (typeof v === 'object' ? keys(v, `${p}${k}.`) : [`${p}${k}`]));
const enKeys = keys(i18n.en).sort().join();
for (const l of ['hi', 'gu']) if (keys(i18n[l]).sort().join() !== enKeys) throw new Error(`i18n/${l}.json keys differ from en.json`);

const customer = src('screens-customer.html');
const html = [
  ['/*LEAFLET*/', src('leaflet.css')],
  ['/*STYLES*/', src('styles.css')],
  ['<!--SCREEN_HERO-->', customer],
  ['<!--SCREENS_CUSTOMER-->', customer],
  ['<!--SCREENS_STAFF-->', src('screens-staff.html')],
  ['/*I18N*/', JSON.stringify(i18n)],
  ['/*APP*/', src('app.js')],
  ['__APK_URL__', APK_URL],
  ['__SITE_URL__', SITE_URL]
].reduce((out, [k, v]) => out.split(k).join(v), src('index.template.html'));

const used = [...html.matchAll(/data-i18n(?:-ph)?="([^"]+)"/g)].map((m) => m[1]);
const missing = used.filter((k) => !keys(i18n.en).includes(k));
if (missing.length) throw new Error(`Missing i18n keys: ${missing.join(', ')}`);

writeFileSync(new URL('./index.html', import.meta.url), html);
console.log(`index.html written (${(html.length / 1024).toFixed(1)} KB, ${used.length} translated strings)`);
