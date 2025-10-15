const fs = require('fs');
const { createCanvas } = require('canvas');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Create icons directory
if (!fs.existsSync('icons')) {
    fs.mkdirSync('icons');
}

console.log('Generating Nous PWA icons...\n');

sizes.forEach(size => {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#f8f9fb';
    ctx.fillRect(0, 0, size, size);

    // Circle
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = (size * 0.35);

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = size * 0.03;
    ctx.stroke();

    // Text 'n'
    ctx.fillStyle = '#5d6b86';
    ctx.font = `300 ${size * 0.72}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // Center the 'n' vertically and horizontally
    ctx.fillText('n', centerX, centerY);

    // Save
    const buffer = canvas.toBuffer('image/png');
    const filename = `icons/icon-${size}x${size}.png`;
    fs.writeFileSync(filename, buffer);
    console.log(`✓ Generated ${filename}`);
});

console.log('\n✓ All icons generated successfully!');
