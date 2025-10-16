#!/usr/bin/env node
/**
 * PWA Installation Verification Script
 * Checks if all PWA requirements are met
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Nous PWA Installation Checker\n');
console.log('='.repeat(50));

let allPassed = true;

// Check 1: Manifest file exists
console.log('\n1. Checking manifest.json...');
if (fs.existsSync('manifest.json')) {
    const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
    console.log('   ✅ manifest.json exists');
    console.log(`   - Name: ${manifest.name}`);
    console.log(`   - Short Name: ${manifest.short_name}`);
    console.log(`   - Theme Color: ${manifest.theme_color}`);
    console.log(`   - Icons: ${manifest.icons.length} configured`);
} else {
    console.log('   ❌ manifest.json not found');
    allPassed = false;
}

// Check 2: Service Worker exists
console.log('\n2. Checking service-worker.js...');
if (fs.existsSync('service-worker.js')) {
    console.log('   ✅ service-worker.js exists');
    const swContent = fs.readFileSync('service-worker.js', 'utf8');
    if (swContent.includes('install')) console.log('   ✅ Has install event handler');
    if (swContent.includes('activate')) console.log('   ✅ Has activate event handler');
    if (swContent.includes('fetch')) console.log('   ✅ Has fetch event handler');
} else {
    console.log('   ❌ service-worker.js not found');
    allPassed = false;
}

// Check 3: Icon files exist
console.log('\n3. Checking icon files...');
const requiredSizes = [72, 96, 128, 144, 152, 192, 384, 512];
let iconsExist = 0;

requiredSizes.forEach(size => {
    const iconPath = `icons/icon-${size}x${size}.png`;
    if (fs.existsSync(iconPath)) {
        iconsExist++;
        console.log(`   ✅ icon-${size}x${size}.png exists`);
    } else {
        console.log(`   ❌ icon-${size}x${size}.png missing`);
        allPassed = false;
    }
});

console.log(`\n   Total: ${iconsExist}/${requiredSizes.length} icons present`);

// Check 4: index.html has PWA meta tags
console.log('\n4. Checking index.html for PWA tags...');
if (fs.existsSync('index.html')) {
    const html = fs.readFileSync('index.html', 'utf8');

    const checks = [
        { pattern: /<link rel="manifest"/, label: 'Manifest link' },
        { pattern: /<meta name="theme-color"/, label: 'Theme color meta tag' },
        { pattern: /<meta name="apple-mobile-web-app-capable"/, label: 'Apple mobile capable' },
        { pattern: /serviceWorker\.register/, label: 'Service Worker registration' },
        { pattern: /beforeinstallprompt/, label: 'Install prompt handler' }
    ];

    checks.forEach(check => {
        if (check.pattern.test(html)) {
            console.log(`   ✅ ${check.label}`);
        } else {
            console.log(`   ❌ ${check.label} missing`);
            allPassed = false;
        }
    });
} else {
    console.log('   ❌ index.html not found');
    allPassed = false;
}

// Check 5: HTTPS requirement (note)
console.log('\n5. HTTPS Requirement:');
console.log('   ℹ️  PWAs require HTTPS in production');
console.log('   ℹ️  localhost is exempt for testing');
console.log('   ✅ Netlify provides HTTPS automatically');

// Summary
console.log('\n' + '='.repeat(50));
if (allPassed) {
    console.log('✅ All PWA requirements met!');
    console.log('\nNext steps:');
    console.log('1. Test locally: http://localhost:8081');
    console.log('2. Open Chrome DevTools > Application tab');
    console.log('3. Check Manifest and Service Workers sections');
    console.log('4. Look for install button in address bar');
    console.log('5. Deploy to Netlify for production testing');
} else {
    console.log('❌ Some requirements are missing');
    console.log('Please fix the issues above before deploying');
}
console.log('='.repeat(50) + '\n');
