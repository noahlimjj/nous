// Generate centered PWA icons with proper alignment
// Run with: node generate-centered-icons.js

const fs = require('fs');
const path = require('path');

// SVG template for centered icon
function createCenteredIconSVG(size) {
    const circleRadius = size * 0.35; // 35% of size
    const strokeWidth = size * 0.03; // 3% of size
    const fontSize = size * 0.72; // 72% of size for the 'n'

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300&amp;display=swap');
      .letter {
        font-family: 'Inter', -apple-system, system-ui, sans-serif;
        font-weight: 300;
        font-size: ${fontSize}px;
        fill: #5d6b86;
        text-anchor: middle;
        dominant-baseline: central;
        letter-spacing: 1.5px;
      }
    </style>
  </defs>

  <!-- Background (optional - transparent for maskable) -->
  <rect width="${size}" height="${size}" fill="#f8f9fb" opacity="0"/>

  <!-- Circle -->
  <circle
    cx="${size / 2}"
    cy="${size / 2}"
    r="${circleRadius}"
    fill="none"
    stroke="#5d6b86"
    stroke-width="${strokeWidth}"
  />

  <!-- Letter 'n' - centered -->
  <text
    x="${size / 2}"
    y="${size / 2 - fontSize * 0.06}"
    class="letter"
  >n</text>
</svg>`;
}

// Icon sizes needed for PWA
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir);
}

console.log('🎨 Generating centered PWA icons...\n');

// Generate SVG files for each size
sizes.forEach(size => {
    const svg = createCenteredIconSVG(size);
    const filename = `icon-${size}x${size}.svg`;
    const filepath = path.join(iconsDir, filename);

    fs.writeFileSync(filepath, svg);
    console.log(`✓ Created ${filename}`);
});

console.log('\n✅ All SVG icons generated!');
console.log('\nNext steps:');
console.log('1. Convert SVGs to PNGs using an online tool or ImageMagick:');
console.log('   For example: https://cloudconvert.com/svg-to-png');
console.log('2. Or use ImageMagick:');
sizes.forEach(size => {
    console.log(`   convert icons/icon-${size}x${size}.svg icons/icon-${size}x${size}.png`);
});
console.log('\n3. Or use this script with sharp (npm install sharp first)');
console.log('   Uncomment the PNG generation code below');

// Uncomment this section if you have 'sharp' installed
// const sharp = require('sharp');
//
// async function convertToPNG() {
//     for (const size of sizes) {
//         const svgPath = path.join(iconsDir, `icon-${size}x${size}.svg`);
//         const pngPath = path.join(iconsDir, `icon-${size}x${size}.png`);
//
//         await sharp(svgPath)
//             .png()
//             .toFile(pngPath);
//
//         console.log(`✓ Converted icon-${size}x${size}.png`);
//     }
//     console.log('\n✅ All PNG icons generated!');
// }
//
// convertToPNG().catch(console.error);
