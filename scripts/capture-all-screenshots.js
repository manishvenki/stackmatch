const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'docs', 'screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const screens = [
  {
    name: 'landing-page.png',
    url: 'http://127.0.0.1:5173/?view=landing',
    viewport: '1440,1000',
    delay: 4500,
  },
  {
    name: 'mobile-landing.png',
    url: 'http://127.0.0.1:5173/?view=landing',
    viewport: '390,844',
    delay: 4500,
  },
  {
    name: 'login.png',
    url: 'http://127.0.0.1:5173/?view=signin',
    viewport: '1440,1000',
    delay: 3500,
  },
  {
    name: 'signup.png',
    url: 'http://127.0.0.1:5173/?view=signup',
    viewport: '1440,1000',
    delay: 3500,
  },
  {
    name: 'dashboard.png',
    url: 'http://127.0.0.1:5173/?view=dashboard',
    viewport: '1440,1000',
    delay: 3500,
  },
  {
    name: 'project-planning.png',
    url: 'http://127.0.0.1:5173/?view=overview&tab=overview',
    viewport: '1440,1000',
    delay: 3500,
  },
  {
    name: 'technology-stack.png',
    url: 'http://127.0.0.1:5173/?view=overview&tab=stack',
    viewport: '1440,1000',
    delay: 3500,
  },
  {
    name: 'architecture.png',
    url: 'http://127.0.0.1:5173/?view=overview&tab=architecture',
    viewport: '1440,1000',
    delay: 3500,
  },
  {
    name: 'blueprint.png',
    url: 'http://127.0.0.1:5173/?view=blueprint',
    viewport: '1440,1000',
    delay: 4000,
  },
  {
    name: 'blueprint-pdf-preview.png',
    url: 'http://127.0.0.1:5173/?view=overview&tab=blueprint',
    viewport: '1440,1000',
    delay: 4000,
  },
  {
    name: 'ai-chat-status.png',
    url: 'http://127.0.0.1:5173/?view=chat',
    viewport: '1440,1000',
    delay: 3500,
  },
];

console.log('=== CAPTURING AUTHENTIC STACKMATCH APPLICATION SCREENSHOTS ===\n');

for (const screen of screens) {
  const destPath = path.join(SCREENSHOTS_DIR, screen.name);
  console.log(`Capturing ${screen.name} (${screen.viewport})...`);
  try {
    const cmd = `"${CHROME_PATH}" --headless=new --disable-gpu --window-size=${screen.viewport} --virtual-time-budget=${screen.delay} --screenshot="${destPath}" "${screen.url}"`;
    execSync(cmd, { timeout: 45000 });
    const stat = fs.statSync(destPath);
    console.log(`  ✓ Saved: ${screen.name} (${(stat.size / 1024).toFixed(1)} KB)`);
  } catch (err) {
    console.error(`  ✗ Failed to capture ${screen.name}:`, err.message);
  }
}

console.log('\n=== ALL SCREENSHOTS CAPTURED IN docs/screenshots/ ===');
