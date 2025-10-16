#!/usr/bin/env node
/**
 * Generate PWA icons using Canvas
 * Run: node generate-icons.js
 */

const fs = require('fs');
const path = require('path');

// For now, let's create placeholders and a guide
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

console.log('\n=== Nous PWA Icon Generator ===\n');
console.log('To generate icons from your SVG logo, you have two options:\n');

console.log('OPTION 1: Use the HTML Generator (Recommended)');
console.log('1. Open generate-icons.html in your browser');
console.log('2. Click "Generate Icons" button');
console.log('3. Save all downloaded PNG files to the /icons folder\n');

console.log('OPTION 2: Manual Generation');
console.log('1. Visit https://realfavicongenerator.net/');
console.log('2. Upload your Nous logo SVG');
console.log('3. Generate and download all icon sizes');
console.log('4. Save them to the /icons folder with these names:\n');

iconSizes.forEach(size => {
    console.log(`   - icon-${size}x${size}.png`);
});

console.log('\nOPTION 3: Use your current SVG as favicon');
console.log('Your app will work with the current inline SVG favicon,');
console.log('but PNG icons are recommended for better compatibility.\n');

// Create placeholder icons directory structure
const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir);
}

// Create a README in the icons folder
const readmeContent = `# App Icons

Place your generated PWA icons here with the following names:

${iconSizes.map(size => `- icon-${size}x${size}.png (${size}x${size} pixels)`).join('\n')}

## How to Generate Icons

### Method 1: Use generate-icons.html (Easiest)
1. Open generate-icons.html in your browser
2. Click "Generate Icons" button
3. Save all downloaded files here

### Method 2: Online Tool
1. Visit https://realfavicongenerator.net/
2. Upload your Nous logo
3. Generate and download icons
4. Save them here

### Method 3: Design Software
Use Figma, Sketch, or Photoshop to export your logo at these sizes.

## Your Logo SVG

Your current Nous logo is an inline SVG in index.html:
- Circle with 'n' text
- Font: Satoshi
- Color: #5d6b86
- Background: #f8f9fb
`;

fs.writeFileSync(path.join(iconsDir, 'README.md'), readmeContent);

console.log('✓ Created /icons folder with README');
console.log('✓ Ready for icon generation!\n');
