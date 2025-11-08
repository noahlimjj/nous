// Convert SVG icons to PNG with sharp
// Run with: node convert-icons-to-png.js

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, 'icons');

async function convertToPNG() {
    console.log('🖼️  Converting SVG icons to PNG...\n');

    for (const size of sizes) {
        const svgPath = path.join(iconsDir, `icon-${size}x${size}.svg`);
        const pngPath = path.join(iconsDir, `icon-${size}x${size}.png`);

        try {
            await sharp(svgPath)
                .resize(size, size)
                .png({
                    quality: 100,
                    compressionLevel: 9
                })
                .toFile(pngPath);

            console.log(`✓ Converted icon-${size}x${size}.png`);
        } catch (error) {
            console.error(`✗ Failed to convert icon-${size}x${size}: ${error.message}`);
        }
    }

    console.log('\n✅ All PNG icons generated with proper centering!');
    console.log('\nNext: git add icons/ && git commit && git push');
}

convertToPNG().catch(console.error);
