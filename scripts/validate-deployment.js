#!/usr/bin/env node

/**
 * Pre-deployment validation script
 * Run this before pushing to catch common issues
 *
 * Usage: node scripts/validate-deployment.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Running pre-deployment validation...\n');

let hasErrors = false;
let hasWarnings = false;

// 1. Check Tailwind CSS file size
console.log('✓ Checking Tailwind CSS...');
const cssPath = path.join(__dirname, '..', 'tailwind-output.css');
if (fs.existsSync(cssPath)) {
    const stats = fs.statSync(cssPath);
    const sizeKB = (stats.size / 1024).toFixed(2);

    if (stats.size < 10000) {
        console.error(`  ❌ ERROR: CSS file is too small (${sizeKB} KB)`);
        console.error(`     Expected: ~24 KB`);
        console.error(`     This usually means Tailwind config is wrong!`);
        hasErrors = true;
    } else if (stats.size < 20000) {
        console.warn(`  ⚠️  WARNING: CSS file is smaller than expected (${sizeKB} KB)`);
        console.warn(`     Expected: ~24 KB`);
        hasWarnings = true;
    } else {
        console.log(`  ✅ CSS file size looks good (${sizeKB} KB)`);
    }
} else {
    console.error(`  ❌ ERROR: tailwind-output.css not found!`);
    console.error(`     Run: npm run build`);
    hasErrors = true;
}

// 2. Check Tailwind config includes index.js
console.log('\n✓ Checking Tailwind config...');
const configPath = path.join(__dirname, '..', 'tailwind.config.js');
if (fs.existsSync(configPath)) {
    const configContent = fs.readFileSync(configPath, 'utf8');

    if (!configContent.includes('index.js')) {
        console.error(`  ❌ ERROR: tailwind.config.js missing "index.js" in content paths!`);
        console.error(`     This will break CSS on Netlify!`);
        console.error(`     Add: "./index.js" to the content array`);
        hasErrors = true;
    } else {
        console.log(`  ✅ Tailwind config includes index.js`);
    }

    if (configContent.includes('index2.js') || configContent.includes('index2.html')) {
        console.warn(`  ⚠️  WARNING: Config includes index2 files`);
        console.warn(`     These are for future features - remove unless actively using them`);
        hasWarnings = true;
    }
} else {
    console.error(`  ❌ ERROR: tailwind.config.js not found!`);
    hasErrors = true;
}

// 3. Check for accidental index2 files in staging
console.log('\n✓ Checking git staging...');
try {
    const { execSync } = require('child_process');
    const staged = execSync('git diff --cached --name-only', { encoding: 'utf8' });

    if (staged.includes('index2.')) {
        console.warn(`  ⚠️  WARNING: index2 files are staged!`);
        console.warn(`     These are for future features`);
        console.warn(`     Unstage them: git reset HEAD index2.*`);
        hasWarnings = true;
    } else {
        console.log(`  ✅ No accidental files staged`);
    }
} catch (e) {
    // Git not available or no files staged
    console.log(`  ℹ️  No staged files or git not available`);
}

// 4. Check main files exist
console.log('\n✓ Checking required files...');
const requiredFiles = [
    'index.html',
    'index.js',
    'style.css',
    'config.js',
    'netlify.toml'
];

for (const file of requiredFiles) {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
        console.log(`  ✅ ${file} exists`);
    } else {
        if (file === 'config.js') {
            console.log(`  ℹ️  ${file} missing (will be generated on Netlify)`);
        } else {
            console.error(`  ❌ ERROR: ${file} is missing!`);
            hasErrors = true;
        }
    }
}

// Final summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
    console.error('❌ VALIDATION FAILED');
    console.error('   Fix errors above before deploying!');
    process.exit(1);
} else if (hasWarnings) {
    console.warn('⚠️  VALIDATION PASSED WITH WARNINGS');
    console.warn('   Review warnings above');
    console.log('\n✅ Safe to deploy, but check warnings!');
    process.exit(0);
} else {
    console.log('✅ ALL CHECKS PASSED');
    console.log('   Safe to deploy!');
    console.log('\n🚀 Ready to push to production');
    process.exit(0);
}
