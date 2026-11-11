const { spawn } = require('child_process');
const http = require('http');
const os = require('os');
const path = require('path');
const fs = require('fs');

async function snapDashboard() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = path.join(os.tmpdir(), 'chrome-snap-' + Date.now());
  const artifactDir = 'C:\\Users\\Rayyan af\\.gemini\\antigravity\\brain\\cf8494e5-a0d2-471c-8baa-408b070b1fb2';
  const screenshotPath = path.join(artifactDir, 'dashboard_clean_no_switcher.png');

  const proc = spawn(chromePath, [
    '--headless=new',
    '--window-size=1440,900',
    '--remote-debugging-port=9288',
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    'http://localhost:5173/login'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  try {
    const targets = await new Promise((resolve, reject) => {
      http.get('http://localhost:9288/json', (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });

    const page = targets.find(t => t.type === 'page');
    if (!page) {
      console.error('No page target found');
      proc.kill();
      return;
    }

    const ws = new WebSocket(page.webSocketDebuggerUrl);
    ws.addEventListener('open', () => {
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
      ws.send(JSON.stringify({ id: 2, method: 'Page.enable' }));

      // Click "Masuk ke Sistem"
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 3,
          method: 'Runtime.evaluate',
          params: {
            expression: `
              (async () => {
                const buttons = Array.from(document.querySelectorAll('button'));
                const loginSubmit = buttons.find(b => b.textContent.includes('Masuk ke Sistem') || b.textContent.includes('Masuk'));
                if (loginSubmit) loginSubmit.click();
              })()
            `
          }
        }));

        // Wait 6 seconds for login and dashboard to load
        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 4,
            method: 'Page.captureScreenshot',
            params: { format: 'png' }
          }));
        }, 6000);
      }, 1500);
    });

    ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 4 && msg.result && msg.result.data) {
        fs.writeFileSync(screenshotPath, Buffer.from(msg.result.data, 'base64'));
        console.log('Saved screenshot to:', screenshotPath);
        ws.close();
        proc.kill();
        process.exit(0);
      }
    });

  } catch (err) {
    console.error('Error during snap:', err);
    proc.kill();
    process.exit(1);
  }
}

snapDashboard();
