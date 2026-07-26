/**
 * Confirmation tool for login/page selectors (supports STAGE 1 "confirm, don't assume").
 * Loads a page and prints every <form> with its action/id/name and every input/button
 * (type, name, id, value, VISIBLE?). Use it to verify that the login form is the only
 * form containing input[name="j_password"], and which "Submit" control is visible.
 *
 *   node scripts/dump-login-dom.mjs                # login page (from OC_BASE_URL + context)
 *   node scripts/dump-login-dom.mjs /OpenClinica/pages/listUserAccounts   # any path
 */
import { chromium } from '@playwright/test';
import 'dotenv/config';

const base = (process.env.OC_BASE_URL ?? 'http://localhost:8080').replace(/\/$/, '');
const ctx = (process.env.OC_CONTEXT_PATH ?? '/OpenClinica').replace(/\/$/, '');
const pathArg = process.argv[2];
const url = pathArg ? `${base}${pathArg}` : `${base}${ctx}/`;

const browser = await chromium.launch();
const page = await browser.newPage({ ignoreHTTPSErrors: true });
try {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  const forms = await page.$$eval('form', (fs) =>
    fs.map((f, i) => ({
      index: i,
      action: f.getAttribute('action'),
      id: f.id || null,
      name: f.getAttribute('name'),
      hasPasswordField: !!f.querySelector('input[type="password"], input[name="j_password"]'),
      controls: [...f.querySelectorAll('input,button')].map((el) => ({
        tag: el.tagName.toLowerCase(),
        type: el.getAttribute('type'),
        name: el.getAttribute('name'),
        id: el.id || null,
        value: el.getAttribute('value'),
        visible: !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length),
      })),
    })),
  );
  console.log(JSON.stringify({ url, formCount: forms.length, forms }, null, 2));
} catch (e) {
  console.error(`Failed to load ${url}: ${e instanceof Error ? e.message : e}`);
  process.exitCode = 1;
} finally {
  await browser.close();
}
