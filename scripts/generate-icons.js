// Simple icon generator to produce valid PNGs for PWA icons
const fs = require('fs');
const path = require('path');

const iconDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// Minimal valid 1x1 PNG buffer that can be scaled or used as fallback
const png1x1Base64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const baseBuffer = Buffer.from(png1x1Base64, 'base64');

['icon-192.png', 'icon-512.png'].forEach((fileName) => {
  const filePath = path.join(iconDir, fileName);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, baseBuffer);
  }
});

console.log('PWA icon assets verified.');
