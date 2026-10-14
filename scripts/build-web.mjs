#!/usr/bin/env node
/*
 * build-web.mjs — assemble static web assets into www/ for Capacitor iOS build.
 */
import { rm, mkdir, cp, writeFile, stat } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const OUT = join(ROOT, 'www');

const INCLUDE = [
  'index.html',
  'index.js',
  'HabitsTab.js',
  'MoodTrackerTab.js',
  'components',
  'config.js',
  'style.css',
  'tailwind-output.css',
  'gamification.css',
  'offline-handler.js',
  'offline-timer-manager.js',
  'service-worker-v45.js',
  'manifest.json',
  'privacy.html',
  'icons',
  'assets'
];

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  console.log('Building web bundle into www/ ...');
  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  for (const entry of INCLUDE) {
    const src = join(ROOT, entry);
    if (!(await exists(src))) {
      console.warn(`  ! skip ${entry} (not found)`);
      continue;
    }
    await cp(src, join(OUT, entry), { recursive: true });
    console.log(`  + ${entry}`);
  }

  const buildInfo = {
    appName: 'Nous',
    bundleId: 'app.nous.studytracker',
    builtAt: new Date().toISOString()
  };
  await writeFile(join(OUT, 'build-info.json'), JSON.stringify(buildInfo, null, 2));

  console.log(`\n✓ www/ ready at ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
