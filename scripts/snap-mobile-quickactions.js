const { spawn } = require('child_process');
const http = require('http');
const os = require('os');
const path = require('path');
const fs = require('fs');

async function snapQuickActions() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = path.join(os.tmpdir(), 'chrome-mobile-qa-' + Date.now());
  const artifactDir = 'C:\\Users\\Rayyan af\\.gemini\\antigravity\\brain\\cf8494e5-a0d2-471c-8baa-408b070b1fb2';
  const qaMobilePath = path.join(artifactDir, 'mobile_quickactions_view.png');

  // Mobile viewport: 390 x 844
  const proc = spawn(chromePath, [
    '--headless=new',
    '--window-size=390,844',
    '--remote-debugging-port=9333',
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    'http://localhost:5173/login'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  try {
    const targets = await new Promise((resolve, reject) => {
      http.get('http://localhost:9333/json', (res) => {
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

      // Submit login
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 3,
          method: 'Runtime.evaluate',
          params: {
            expression: `
              (() => {
                const form = document.querySelector('form');
                if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
              })()
            `
          }
        }));

        // After dashboard loads, click the center "Aksi Cepat" button
        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 4,
            method: 'Runtime.evaluate',
            params: {
              expression: `
                (() => {
                  const qaBtn = document.querySelector('button[aria-label="Buka Aksi Cepat"]');
                  if (qaBtn) qaBtn.click();
                })()
              `
            }
          }));

          // Take screenshot of the Quick Action bottom sheet
          setTimeout(() => {
            ws.send(JSON.stringify({
              id: 5,
              method: 'Page.captureScreenshot',
              params: { format: 'png' }
            }));
          }, 1500);
        }, 4500);
      }, 1500);
    });

    ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 5 && msg.result && msg.result.data) {
        fs.writeFileSync(qaMobilePath, Buffer.from(msg.result.data, 'base64'));
        console.log('Saved mobile quick actions screenshot to:', qaMobilePath);
        ws.close();
        proc.kill();
        process.exit(0);
      }
    });

  } catch (err) {
    console.error('Error during quick actions snap:', err);
    proc.kill();
    process.exit(1);
  }
}

snapQuickActions();

