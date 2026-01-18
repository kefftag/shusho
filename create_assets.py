#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
import os

# Create assets directory if it doesn't exist
os.makedirs('assets', exist_ok=True)

# Create icon.png (1024x1024)
icon = Image.new('RGB', (1024, 1024), color='#2196F3')
draw = ImageDraw.Draw(icon)
# Draw a simple "S" for Shusho
try:
    font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 600)
except:
    font = ImageFont.load_default()
draw.text((512, 512), 'S', fill='white', anchor='mm', font=font)
icon.save('assets/icon.png')

# Create splash.png (1284x2778 - iPhone 14 Pro Max size)
splash = Image.new('RGB', (1284, 2778), color='#2196F3')
draw = ImageDraw.Draw(splash)
try:
    font_large = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 200)
except:
    font_large = ImageFont.load_default()
draw.text((642, 1389), 'Shusho', fill='white', anchor='mm', font=font_large)
splash.save('assets/splash.png')

# Create adaptive-icon.png (1024x1024)
adaptive = Image.new('RGB', (1024, 1024), color='#2196F3')
draw = ImageDraw.Draw(adaptive)
try:
    font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 600)
except:
    font = ImageFont.load_default()
draw.text((512, 512), 'S', fill='white', anchor='mm', font=font)
adaptive.save('assets/adaptive-icon.png')

# Create favicon.png (48x48)
favicon = Image.new('RGB', (48, 48), color='#2196F3')
draw = ImageDraw.Draw(favicon)
try:
    font_small = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 36)
except:
    font_small = ImageFont.load_default()
draw.text((24, 24), 'S', fill='white', anchor='mm', font=font_small)
favicon.save('assets/favicon.png')

print("Assets created successfully!")
