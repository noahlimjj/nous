#!/usr/bin/env python3
"""
Generate PWA icons from SVG logo
Requires: pip install cairosvg pillow
"""

import os
from io import BytesIO

try:
    import cairosvg
    from PIL import Image
except ImportError:
    print("Installing required packages...")
    os.system("pip3 install cairosvg pillow")
    import cairosvg
    from PIL import Image

# Your Nous logo SVG
svg_logo = """<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
    <style>
        text {
            font-family: Arial, sans-serif;
            font-weight: 300;
            font-size: 72px;
            fill: #5d6b86;
        }
    </style>
    <rect width="100" height="100" fill="#f8f9fb"/>
    <circle cx='50' cy='50' r='35' fill='none' stroke='#000000' stroke-width='3'/>
    <text x='50' y='72' text-anchor='middle' letter-spacing='1.5'>n</text>
</svg>"""

# Icon sizes needed for PWA
sizes = [72, 96, 128, 144, 152, 192, 384, 512]

# Create icons directory if it doesn't exist
os.makedirs('icons', exist_ok=True)

print("Generating PWA icons from Nous logo...\n")

for size in sizes:
    try:
        # Convert SVG to PNG using cairosvg
        png_data = cairosvg.svg2png(
            bytestring=svg_logo.encode('utf-8'),
            output_width=size,
            output_height=size
        )

        # Save the PNG
        filename = f'icons/icon-{size}x{size}.png'
        with open(filename, 'wb') as f:
            f.write(png_data)

        print(f"✓ Generated {filename}")
    except Exception as e:
        print(f"✗ Failed to generate {size}x{size}: {e}")

print("\n✓ All icons generated successfully!")
print("Icons are saved in the /icons folder.")
