const fs = require('fs');
const path = require('path');

// Create a simple SVG icon
const svgIcon = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#7c3aed" rx="64"/>
  <text x="256" y="320" font-family="Arial, sans-serif" font-size="200" font-weight="bold" text-anchor="middle" fill="white">SP</text>
</svg>
`;

// Save SVG for reference
fs.writeFileSync(path.join(__dirname, 'icon.svg'), svgIcon.trim());

// Create a simple PNG placeholder (1x1 pixel)
// For production, you should use proper icon conversion tools
const pngData = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, // PNG signature
  0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
  0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // 1x1 dimensions
  0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, // bit depth, color type, etc
  0x00, 0x00, 0x00, 0x0d, 0x49, 0x44, 0x41, 0x54, // IDAT chunk
  0x78, 0x9c, 0x62, 0x7c, 0x3a, 0xed, 0xff, 0x00, 0x05, 0xfe, 0x02, 0xfe,
  0xa7, 0x35, 0x81, 0x84, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82 // IEND
]);

// Create placeholder files
fs.writeFileSync(path.join(__dirname, 'icon.png'), pngData);
fs.writeFileSync(path.join(__dirname, 'icon.ico'), pngData); // Windows - should be proper ICO in production
fs.writeFileSync(path.join(__dirname, 'icon.icns'), pngData); // macOS - should be proper ICNS in production

console.log('✅ Placeholder icons created in electron/build/');
console.log('⚠️  Note: For production, replace these with proper icons:');
console.log('   - icon.ico: Windows icon (use ico converter)');
console.log('   - icon.icns: macOS icon (use iconutil or similar)');
console.log('   - icon.png: Linux icon (512x512 PNG recommended)'); 