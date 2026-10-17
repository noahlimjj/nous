#!/usr/bin/env node
/*
 * patch-firebase-auth.mjs — writes vendor/firebase/firebase-auth.nous.js from the stock
 * vendor/firebase/firebase-auth.js (Firebase 10.7.1).
 *
 * Stock Auth re-checks the saved user with Google on every launch before it reports
 * anyone, and Firestore will not even read its local cache until Auth reports. On a
 * slow connection that is 10s+ of "loading your dashboard...". The patch signs in from
 * the saved user at once and re-checks it in the background, signing out only if
 * Google rejects the user (deleted, disabled, revoked).
 */
import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';

const dir = fileURLToPath(new URL('../vendor/firebase/', import.meta.url));
const src = await readFile(dir + 'firebase-auth.js', 'utf8');

const stock = 'async reloadAndSetCurrentUserOrClear(e){try{await _reloadWithoutSaving(e)}catch(e){if("auth/network-request-failed"!==(null==e?void 0:e.code))return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}';
const patched = 'async reloadAndSetCurrentUserOrClear(e){_reloadWithoutSaving(e).then((()=>this._persistUserIfCurrent(e))).catch((t=>{"auth/network-request-failed"!==(null==t?void 0:t.code)&&this.currentUser===e&&this.signOut().catch((()=>{}))}));return this.directlySetCurrentUser(e)}';

if (src.split(stock).length !== 2) {
  console.error('patch-firebase-auth: reloadAndSetCurrentUserOrClear not found exactly once; Firebase version changed?');
  process.exit(1);
}
await writeFile(dir + 'firebase-auth.nous.js', src.replace(stock, patched));
console.log('✓ wrote vendor/firebase/firebase-auth.nous.js');
