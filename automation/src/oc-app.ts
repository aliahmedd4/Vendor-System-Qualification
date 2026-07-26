/**
 * Thin page-object for OpenClinica CE. Centralises URLs and selectors so that when
 * they are confirmed against the running build they are changed in ONE place.
 *
 * IMPORTANT (honesty): The selectors below are best-effort for OpenClinica 3.x and
 * MUST be confirmed against your installed instance before execution. Any that differ
 * are corrected here and the correction noted (this is configuration of the test tool,
 * not of the system under test). Where a flow cannot be confirmed, the corresponding
 * test is marked test.fixme() rather than being faked to pass.
 */
import type { Page } from '@playwright/test';

export const routes = {
  login: '/',
  logout: '/pages/logout',
  listStudySubjects: '/pages/listStudySubjects',
  users: '/pages/listUserAccounts',
};

export const sel = {
  usernameInput: '#j_username, input[name="j_username"]',
  passwordInput: '#j_password, input[name="j_password"]',
  loginButton: 'input[name="Submit"], button[type="submit"]',
  loginError: '.alert-error, .error, #errorPanel',
  userMenu: '#userName, .navbar .user',
};

export async function login(page: Page, user: string, pass: string): Promise<void> {
  await page.goto(routes.login);
  await page.fill(sel.usernameInput, user);
  await page.fill(sel.passwordInput, pass);
  // Submitting the login form triggers a navigation. We MUST wait for it to settle
  // before any caller inspects session state, otherwise isLoggedIn()/goto() race the
  // auth response and produce flaky verdicts (a goto issued mid-login can be redirected
  // back to the login page and misread as an access denial).
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded' }).catch(() => { /* SPA/no nav */ }),
    page.click(sel.loginButton),
  ]);
  // Settle on either the authenticated UI or a rendered login error before returning.
  await page
    .locator(`${sel.userMenu}, ${sel.loginError}`)
    .first()
    .waitFor({ state: 'visible', timeout: 10_000 })
    .catch(() => { /* leave verdict to the caller's explicit assertions */ });
}

export async function isLoggedIn(page: Page): Promise<boolean> {
  return (await page.locator(sel.userMenu).count()) > 0;
}

export async function logout(page: Page): Promise<void> {
  await page.goto(routes.logout).catch(() => { /* ignore if already out */ });
}
