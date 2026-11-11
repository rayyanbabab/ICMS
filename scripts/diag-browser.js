const { spawn } = require('child_process');
const http = require('http');
const os = require('os');
const path = require('path');
const fs = require('fs');

async function testUrl(targetUrl, filename) {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = path.join(os.tmpdir(), 'chrome-diag-' + Date.now());
  const artifactDir = 'C:\\Users\\Rayyan af\\.gemini\\antigravity\\brain\\cf8494e5-a0d2-471c-8baa-408b070b1fb2';
  const screenshotPath = path.join(artifactDir, filename);

  const proc = spawn(chromePath, [
    '--headless=new',
    '--window-size=1440,900',
    '--remote-debugging-port=9244',
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    targetUrl
  ]);

  await new Promise(r => setTimeout(r, 2500));

  try {
    const targets = await new Promise((resolve, reject) => {
      http.get('http://localhost:9244/json', (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });

    const page = targets.find(t => t.type === 'page');
    if (!page) {
      console.error('No page target found for', targetUrl);
      proc.kill();
      return;
    }

    const ws = new WebSocket(page.webSocketDebuggerUrl);
    ws.addEventListener('open', () => {
      ws.send(JSON.stringify({ id: 1, method: 'Console.enable' }));
      ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));
      ws.send(JSON.stringify({ id: 3, method: 'Page.enable' }));

      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 4,
          method: 'Page.captureScreenshot',
          params: { format: 'png' }
        }));
      }, 3000);
    });

    ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Console.messageAdded') {
        console.log('[BROWSER CONSOLE]', msg.params.message.text);
      }
      if (msg.method === 'Runtime.consoleAPICalled') {
        console.log('[BROWSER LOG]', msg.params.args.map(a => a.value || a.description).join(' '));
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        console.error('[BROWSER EXCEPTION]', msg.params.exceptionDetails);
      }
      if (msg.id === 4 && msg.result?.data) {
        fs.writeFileSync(screenshotPath, Buffer.from(msg.result.data, 'base64'));
        console.log(`Saved screenshot to: ${screenshotPath}`);
        ws.close();
        proc.kill();
      }
    });
  } catch (err) {
    console.error('Error during testUrl:', err.message);
    proc.kill();
  }
}

async function main() {
  console.log('Testing http://localhost:5173/login ...');
  await testUrl('http://localhost:5173/login', 'diag_login.png');
  await new Promise(r => setTimeout(r, 2000));
  console.log('Testing http://localhost:5173/ ...');
  await testUrl('http://localhost:5173/', 'diag_root.png');
}

main();

