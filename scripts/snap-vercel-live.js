const { spawn } = require('child_process');
const http = require('http');
const os = require('os');
const path = require('path');
const fs = require('fs');

async function snapVercelLive() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = path.join(os.tmpdir(), 'chrome-vercel-live-' + Date.now());
  const artifactDir = 'C:\\Users\\Rayyan af\\.gemini\\antigravity\\brain\\cf8494e5-a0d2-471c-8baa-408b070b1fb2';
  const liveMobilePath = path.join(artifactDir, 'vercel_live_student_dashboard.png');

  // Mobile viewport: 390 x 844
  const proc = spawn(chromePath, [
    '--headless=new',
    '--window-size=390,844',
    '--remote-debugging-port=9344',
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    'https://icms-campus.vercel.app/login'
  ]);

  await new Promise(r => setTimeout(r, 3000));

  try {
    const targets = await new Promise((resolve, reject) => {
      http.get('http://localhost:9344/json', (res) => {
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

      // Select student demo and submit
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 3,
          method: 'Runtime.evaluate',
          params: {
            expression: `
              (async () => {
                // Fill identifier
                const inputs = Array.from(document.querySelectorAll('input'));
                const userInput = inputs.find(i => i.type === 'text' || i.placeholder?.includes('Username') || !i.type);
                if (userInput) {
                  userInput.value = 'mahasiswa@icms.ac.id';
                  userInput.dispatchEvent(new Event('input', { bubbles: true }));
                }
                const passInput = inputs.find(i => i.type === 'password');
                if (passInput) {
                  passInput.value = 'AdminPassword123!';
                  passInput.dispatchEvent(new Event('input', { bubbles: true }));
                }

                // Submit form
                const form = document.querySelector('form');
                if (form) {
                  form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                }
              })()
            `
          }
        }));

        // Wait 5 seconds for live dashboard on Vercel
        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 4,
            method: 'Page.captureScreenshot',
            params: { format: 'png' }
          }));
        }, 5500);
      }, 2000);
    });

    ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 4 && msg.result && msg.result.data) {
        fs.writeFileSync(liveMobilePath, Buffer.from(msg.result.data, 'base64'));
        console.log('Saved Vercel live mobile screenshot to:', liveMobilePath);
        ws.close();
        proc.kill();
        process.exit(0);
      }
    });

  } catch (err) {
    console.error('Error during Vercel live snap:', err);
    proc.kill();
    process.exit(1);
  }
}

snapVercelLive();
