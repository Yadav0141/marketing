import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const APK_URL = 'https://github.com/Yadav0141/marketing/releases/latest/download/lh-microfinance-customer.apk';
const SITE_URL = 'https://yadav0141.github.io/marketing/';

// Browser Maps keys are public by design; protect it with an HTTP-referrer restriction in Google Cloud.
const keyFile = new URL('./.maps-key', import.meta.url);
const MAPS_KEY = (process.env.GOOGLE_MAPS_KEY || (existsSync(keyFile) ? readFileSync(keyFile, 'utf8') : '')).trim();
if (!MAPS_KEY) console.warn('No Google Maps key (set GOOGLE_MAPS_KEY or create .maps-key); the map will show its fallback message.');

const src = (f) => readFileSync(new URL(`./src/${f}`, import.meta.url), 'utf8').replace(/^﻿/, '');
const i18n = Object.fromEntries(['en', 'hi', 'gu'].map((l) => [l, JSON.parse(src(`i18n/${l}.json`))]));

const keys = (o, p = '') => Object.entries(o).flatMap(([k, v]) => (typeof v === 'object' ? keys(v, `${p}${k}.`) : [`${p}${k}`]));
const enKeys = keys(i18n.en).sort().join();
for (const l of ['hi', 'gu']) if (keys(i18n[l]).sort().join() !== enKeys) throw new Error(`i18n/${l}.json keys differ from en.json`);

const customer = src('screens-customer.html');
const html = [
  ['/*STYLES*/', src('styles.css')],
  ['<!--SCREEN_HERO-->', customer],
  ['<!--SCREENS_CUSTOMER-->', customer],
  ['<!--SCREENS_STAFF-->', src('screens-staff.html')],
  ['/*I18N*/', JSON.stringify(i18n)],
  ['/*APP*/', src('app.js')],
  ['__APK_URL__', APK_URL],
  ['__SITE_URL__', SITE_URL],
  ['__MAPS_KEY__', MAPS_KEY]
].reduce((out, [k, v]) => out.split(k).join(v), src('index.template.html'));

const used = [...html.matchAll(/data-i18n(?:-ph)?="([^"]+)"/g)].map((m) => m[1]);
const missing = used.filter((k) => !keys(i18n.en).includes(k));
if (missing.length) throw new Error(`Missing i18n keys: ${missing.join(', ')}`);

writeFileSync(new URL('./index.html', import.meta.url), html);
console.log(`index.html written (${(html.length / 1024).toFixed(1)} KB, ${used.length} translated strings)`);
