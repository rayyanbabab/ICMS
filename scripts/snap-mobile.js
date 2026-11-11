const { spawn } = require('child_process');
const http = require('http');
const os = require('os');
const path = require('path');
const fs = require('fs');

async function snapMobile() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = path.join(os.tmpdir(), 'chrome-mobile-' + Date.now());
  const artifactDir = 'C:\\Users\\Rayyan af\\.gemini\\antigravity\\brain\\cf8494e5-a0d2-471c-8baa-408b070b1fb2';
  const loginMobilePath = path.join(artifactDir, 'mobile_login_view.png');
  const dashMobilePath = path.join(artifactDir, 'mobile_dashboard_view.png');

  // Mobile viewport: 390 x 844 (iPhone 14 / modern Android)
  const proc = spawn(chromePath, [
    '--headless=new',
    '--window-size=390,844',
    '--remote-debugging-port=9299',
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    'http://localhost:5173/login'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  try {
    const targets = await new Promise((resolve, reject) => {
      http.get('http://localhost:9299/json', (res) => {
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

      // 1. Capture mobile login screen
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 3,
          method: 'Page.captureScreenshot',
          params: { format: 'png' }
        }));
      }, 2000);
    });

    let step = 1;
    ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 3 && msg.result && msg.result.data) {
        fs.writeFileSync(loginMobilePath, Buffer.from(msg.result.data, 'base64'));
        console.log('Saved mobile login screenshot to:', loginMobilePath);

        // Click login button to go to dashboard
        ws.send(JSON.stringify({
          id: 4,
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

        // Wait 4 seconds for dashboard on mobile
        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 5,
            method: 'Page.captureScreenshot',
            params: { format: 'png' }
          }));
        }, 4500);
      }

      if (msg.id === 5 && msg.result && msg.result.data) {
        fs.writeFileSync(dashMobilePath, Buffer.from(msg.result.data, 'base64'));
        console.log('Saved mobile dashboard screenshot to:', dashMobilePath);
        ws.close();
        proc.kill();
        process.exit(0);
      }
    });

  } catch (err) {
    console.error('Error during mobile snap:', err);
    proc.kill();
    process.exit(1);
  }
}

snapMobile();
