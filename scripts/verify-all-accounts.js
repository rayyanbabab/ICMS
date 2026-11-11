const http = require('http');

const ACCOUNTS = [
  { role: 'SUPER_ADMIN', identifier: 'admin' },
  { role: 'RECTOR', identifier: 'rektor@icms.ac.id' },
  { role: 'VICE_RECTOR', identifier: 'warek1@icms.ac.id' },
  { role: 'DEAN', identifier: 'dekan.fti@icms.ac.id' },
  { role: 'HEAD_OF_PROGRAM', identifier: 'kaprodi.if@icms.ac.id' },
  { role: 'LECTURER', identifier: 'dosen@icms.ac.id' },
  { role: 'STUDENT', identifier: 'mahasiswa@icms.ac.id' },
  { role: 'ACADEMIC_ADMIN', identifier: 'baak@icms.ac.id' },
  { role: 'FINANCE_ADMIN', identifier: 'bauk@icms.ac.id' },
  { role: 'ADMISSION_ADMIN', identifier: 'pmb@icms.ac.id' },
  { role: 'LIBRARIAN', identifier: 'perpustakaan@icms.ac.id' },
  { role: 'HR_ADMIN', identifier: 'hrd@icms.ac.id' },
  { role: 'STUDENT_AFFAIRS_ADMIN', identifier: 'kemahasiswaan@icms.ac.id' },
  { role: 'ALUMNI', identifier: 'alumni@icms.ac.id' }
];

async function main() {
  console.log('Testing authentication for all 14 demo accounts with AdminPassword123! ...');
  let passed = 0;

  for (const acc of ACCOUNTS) {
    const payload = JSON.stringify({ identifier: acc.identifier, password: 'AdminPassword123!' });
    const res = await new Promise((resolve) => {
      const req = http.request({
        hostname: 'localhost',
        port: 4000,
        path: '/api/v1/auth/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      }, (r) => {
        let data = '';
        r.on('data', chunk => data += chunk);
        r.on('end', () => resolve({ status: r.statusCode, data }));
      });
      req.on('error', (err) => resolve({ status: 500, data: err.message }));
      req.write(payload);
      req.end();
    });

    if (res.status === 200 || res.status === 201) {
      console.log(`[PASS] ${acc.role.padEnd(24)} (${acc.identifier.padEnd(26)}) -> HTTP ${res.status}`);
      passed++;
    } else {
      console.error(`[FAIL] ${acc.role.padEnd(24)} (${acc.identifier.padEnd(26)}) -> HTTP ${res.status}`);
    }
  }

  console.log(`\nDemo Accounts Login Verification: ${passed} / ${ACCOUNTS.length} PASSED`);
}

main();
