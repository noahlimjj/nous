#!/usr/bin/env node
/*
 * prepare-ios.mjs — idempotent configuration and signing patches for Nous iOS project.
 */
import { execFileSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const PLIST = join(ROOT, 'ios/App/App/Info.plist');
const PBXPROJ = join(ROOT, 'ios/App/App.xcodeproj/project.pbxproj');
const ICON_PATH = join(ROOT, 'ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png');
const SOURCE_ICON = join(ROOT, 'icons/icon-512x512.png');
const TEAM_ID = '44BP374T6C';

if (!existsSync(PLIST)) {
  console.error(`✖ ${PLIST} not found — run "npx cap add ios" first.`);
  process.exit(1);
}

function plistCmd(...args) {
  return execFileSync('/usr/libexec/PlistBuddy', ['-c', args.join(' '), PLIST], {
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
  }).trim();
}

function hasKey(key) {
  try {
    execFileSync('/usr/libexec/PlistBuddy', ['-c', `Print :${key}`, PLIST], {
      stdio: ['pipe', 'pipe', 'ignore'],
    });
    return true;
  } catch {
    return false;
  }
}

function setString(key, value) {
  if (hasKey(key)) plistCmd(`Set :${key}`, `"${value}"`);
  else plistCmd(`Add :${key} string`, `"${value}"`);
  console.log(`  ✓ ${key} → ${value}`);
}

function setBool(key, value) {
  const boolVal = value ? 'true' : 'false';
  if (hasKey(key)) plistCmd(`Set :${key}`, boolVal);
  else plistCmd(`Add :${key} bool`, boolVal);
  console.log(`  ✓ ${key} → ${boolVal}`);
}

console.log('Patching Info.plist ...');
setString('CFBundleDisplayName', 'Nous');

// App Store Export Compliance (no non-exempt encryption used)
setBool('ITSAppUsesNonExemptEncryption', false);

// Keep app responsive to indirect input events
setBool('UIApplicationSupportsIndirectInputEvents', true);

// Set 64-bit architecture
try {
  plistCmd('Delete :UIRequiredDeviceCapabilities');
} catch {}
plistCmd('Add :UIRequiredDeviceCapabilities array');
plistCmd('Add :UIRequiredDeviceCapabilities:0 string arm64');
console.log('  ✓ UIRequiredDeviceCapabilities → [arm64]');

console.log('\nPatching project.pbxproj ...');
if (existsSync(PBXPROJ)) {
  let content = readFileSync(PBXPROJ, 'utf8');

  // Upgrade deployment target to 15.0 for modern Xcode
  content = content.replace(/IPHONEOS_DEPLOYMENT_TARGET = 13\.0;/g, 'IPHONEOS_DEPLOYMENT_TARGET = 15.0;');

  // Disable user script sandboxing for CocoaPods scripts (Xcode 15+)
  if (content.includes('ENABLE_USER_SCRIPT_SANDBOXING')) {
    content = content.replace(/ENABLE_USER_SCRIPT_SANDBOXING = YES;/g, 'ENABLE_USER_SCRIPT_SANDBOXING = NO;');
  } else {
    content = content.replace(/ENABLE_TESTABILITY = YES;/g, 'ENABLE_TESTABILITY = YES;\n\t\t\t\tENABLE_USER_SCRIPT_SANDBOXING = NO;');
  }

  // Inject DEVELOPMENT_TEAM if not already present
  if (!content.includes('DEVELOPMENT_TEAM =')) {
    content = content.replace(
      /CODE_SIGN_STYLE = Automatic;/g,
      `CODE_SIGN_STYLE = Automatic;\n\t\t\t\tDEVELOPMENT_TEAM = ${TEAM_ID};`
    );
  }

  writeFileSync(PBXPROJ, content, 'utf8');
  console.log(`  ✓ Configured DEVELOPMENT_TEAM = ${TEAM_ID} and IPHONEOS_DEPLOYMENT_TARGET = 15.0 in project.pbxproj`);
}

console.log('\nGenerating App Store Icon (1024x1024 RGB without alpha) ...');
async function generateIcon() {
  if (existsSync(SOURCE_ICON)) {
    const inner = await sharp(SOURCE_ICON).resize(1024, 1024).toBuffer();
    await sharp({
      create: {
        width: 1024,
        height: 1024,
        channels: 3,
        background: { r: 248, g: 249, b: 251 }
      }
    })
      .composite([{ input: inner, top: 0, left: 0 }])
      .removeAlpha()
      .png()
      .toFile(ICON_PATH);
    console.log(`  ✓ Generated ${ICON_PATH}`);
  } else {
    console.warn(`  ! Source icon ${SOURCE_ICON} not found, skipping icon generation.`);
  }
}

generateIcon()
  .then(() => {
    console.log('\n✓ iOS project prepared and configured successfully!');
  })
  .catch((err) => {
    console.error('Error during icon generation:', err);
    process.exit(1);
  });
