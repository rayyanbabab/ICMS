const { spawn } = require('child_process');
const http = require('http');
const os = require('os');
const path = require('path');
const fs = require('fs');

async function testStudentSwitch() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = path.join(os.tmpdir(), 'chrome-student-sw-' + Date.now());
  const artifactDir = 'C:\\Users\\Rayyan af\\.gemini\\antigravity\\brain\\cf8494e5-a0d2-471c-8baa-408b070b1fb2';
  const screenshotPath = path.join(artifactDir, 'diag_student_portal_live.png');

  const proc = spawn(chromePath, [
    '--headless=new',
    '--window-size=1440,900',
    '--remote-debugging-port=9266',
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    'http://localhost:5173/login'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  try {
    const targets = await new Promise((resolve, reject) => {
      http.get('http://localhost:9266/json', (res) => {
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

      // Auto submit login
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 3,
          method: 'Runtime.evaluate',
          params: {
            expression: `
              (async () => {
                const buttons = Array.from(document.querySelectorAll('button'));
                const loginSubmit = buttons.find(b => b.textContent.includes('Masuk ke Dashboard'));
                if (loginSubmit) loginSubmit.click();
              })()
            `
          }
        }));
      }, 1500);

      // Once on dashboard, switch role to STUDENT
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 4,
          method: 'Runtime.evaluate',
          params: {
            expression: `
              (async () => {
                const buttons = Array.from(document.querySelectorAll('button'));
                const mhsBtn = buttons.find(b => b.textContent.trim() === 'Mahasiswa' || b.textContent.includes('Mahasiswa'));
                if (mhsBtn) {
                  mhsBtn.click();
                }
              })()
            `
          }
        }));
      }, 4500);

      // Take screenshot of Student Portal with Recharts and buttons
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 5,
          method: 'Page.captureScreenshot',
          params: { format: 'png' }
        }));
      }, 6500);
    });

    ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 5 && msg.result?.data) {
        fs.writeFileSync(screenshotPath, Buffer.from(msg.result.data, 'base64'));
        console.log(`Saved screenshot to: ${screenshotPath}`);
        ws.close();
        proc.kill();
      }
    });
  } catch (err) {
    console.error('Error during test:', err.message);
    proc.kill();
  }
}

testStudentSwitch();

