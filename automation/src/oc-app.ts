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

// OpenClinica CE is served under a context path (default /OpenClinica). All routes are
// built from it so a different deployment path only needs OC_CONTEXT_PATH changed.
const CTX = (process.env.OC_CONTEXT_PATH ?? '/OpenClinica').replace(/\/$/, '');

export const routes = {
  login: `${CTX}/`,
  logout: `${CTX}/pages/logout`,
  listStudySubjects: `${CTX}/pages/listStudySubjects`,
  users: `${CTX}/pages/listUserAccounts`,
};

// The OpenClinica login page hosts TWO forms that each contain an <input name="Submit">:
// the Spring Security LOGIN form and a "Request Password" (forgot-password) form. A
// selector on name="Submit" / button[type=submit] alone matched the hidden
// "Submit Password Request" control and hung for 15 s (DEV-010).
//
// Fix: scope every login selector to the login form, identified WITHOUT assuming an
// action URL or button label — it is the only form on the page that contains a password
// field. `form:has(input[name="j_password"])` therefore uniquely selects it, and the
// submit control *inside that form* is unambiguous.
const LOGIN_FORM = 'form:has(input[name="j_password"])';

export const sel = {
  loginForm: LOGIN_FORM,
  usernameInput: `${LOGIN_FORM} input[name="j_username"]`,
  passwordInput: `${LOGIN_FORM} input[name="j_password"]`,
  // Submit control scoped to the login form only (excludes the forgot-password submit).
  loginButton: `${LOGIN_FORM} input[type="submit"], ${LOGIN_FORM} button[type="submit"]`,
  // Error banner rendered on the login page after a failed authentication.
  loginError: '.alert-error, span.error, .errorMessage',
  // Authenticated-only marker: the Log Out link is only present in a logged-in session.
  // Used as the positive proof of authentication (not the mere absence of an error).
  loggedInMarker: 'a[href*="logout" i]',
};

export async function login(page: Page, user: string, pass: string): Promise<void> {
  await page.goto(routes.login);
  // The element must be VISIBLE, not merely present — the previous defect was a resolved-
  // but-invisible control. Fail fast (default 15 s) if the login form itself is missing.
  await page.locator(sel.loginForm).waitFor({ state: 'visible' });
  await page.fill(sel.usernameInput, user);
  await page.fill(sel.passwordInput, pass);
  const submit = page.locator(sel.loginButton);
  await submit.waitFor({ state: 'visible' });
  // Submitting triggers a navigation. Wait for it to settle before any caller inspects
  // session state, otherwise isLoggedIn()/goto() race the auth response.
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded' }).catch(() => { /* no nav */ }),
    submit.click(),
  ]);
  // Settle on either the authenticated marker or a rendered login error before returning.
  await page
    .locator(`${sel.loggedInMarker}, ${sel.loginError}`)
    .first()
    .waitFor({ state: 'visible', timeout: 10_000 })
    .catch(() => { /* verdict is left to the caller's explicit assertions */ });
}

export async function isLoggedIn(page: Page): Promise<boolean> {
  // Positive, authenticated-only signal that must be VISIBLE (a hidden node is not proof).
  return page.locator(sel.loggedInMarker).first().isVisible().catch(() => false);
}

export async function logout(page: Page): Promise<void> {
  await page.goto(routes.logout).catch(() => { /* ignore if already out */ });
}
