const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const desktopScreenshot = path.join(__dirname, '..', 'landing-desktop.png');
const mobileScreenshot = path.join(__dirname, '..', 'landing-mobile.png');

console.log('=== VERIFYING REDESIGNED LANDING PAGE & DOODLE SYSTEM ===');

try {
  // 1. Capture Full-Screen Doodle Loader (at startup)
  console.log('Capturing Full-Screen Doodle Loader...');
  execSync(
    `"${chromePath}" --headless=new --disable-gpu --window-size=1440,900 --screenshot="${path.join(__dirname, '..', 'landing-loader.png')}" "http://127.0.0.1:5173/?view=landing"`,
    { timeout: 30000 }
  );

  // 2. Capture Desktop Post-Loader Page (after 3.5s virtual time)
  console.log('Capturing Desktop Post-Loader Page...');
  execSync(
    `"${chromePath}" --headless=new --disable-gpu --window-size=1440,900 --virtual-time-budget=4500 --screenshot="${desktopScreenshot}" "http://127.0.0.1:5173/?view=landing"`,
    { timeout: 35000 }
  );

  // 3. Capture Mobile Viewport
  console.log('Capturing Mobile Viewport...');
  execSync(
    `"${chromePath}" --headless=new --disable-gpu --window-size=390,844 --virtual-time-budget=4500 --screenshot="${mobileScreenshot}" "http://127.0.0.1:5173/?view=landing"`,
    { timeout: 35000 }
  );

  if (fs.existsSync(desktopScreenshot) && fs.existsSync(mobileScreenshot)) {
    const dStat = fs.statSync(desktopScreenshot);
    const mStat = fs.statSync(mobileScreenshot);
    console.log(`✓ Desktop Screenshot: ${(dStat.size / 1024).toFixed(1)} KB`);
    console.log(`✓ Mobile Screenshot: ${(mStat.size / 1024).toFixed(1)} KB`);
    console.log('SUCCESS: Landing page rendered and captured successfully on desktop and mobile!');
  } else {
    console.error('FAIL: Screenshots not created');
    process.exit(1);
  }
} catch (err) {
  console.error('Error during screenshot capture:', err.message);
  process.exit(1);
}
