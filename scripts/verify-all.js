const http = require('http');

async function testAll() {
  const loginBody = JSON.stringify({ identifier: 'admin', password: 'AdminPassword123!' });
  
  function req(options, postData) {
    return new Promise((resolve, reject) => {
      const r = http.request(options, res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data) });
          } catch(e) {
            resolve({ status: res.statusCode, body: data });
          }
        });
      });
      r.on('error', reject);
      if (postData) r.write(postData);
      r.end();
    });
  }

  console.log('Initiating test connection to ICMS API on port 4000...');
  const loginRes = await req({
    hostname: 'localhost',
    port: 4000,
    path: '/api/v1/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(loginBody) }
  }, loginBody);

  const token = loginRes.body?.data?.accessToken || loginRes.body?.data?.tokens?.accessToken;
  console.log('Login Status: HTTP ' + loginRes.status + ' | JWT Token Acquired: ' + (!!token ? 'YES' : 'NO'));
  if (!token) {
    console.error('Failed to get token:', loginRes.body);
    process.exit(1);
  }

  const headers = {
    'Authorization': 'Bearer ' + token,
    'X-Active-Role': 'SUPER_ADMIN'
  };

  const endpoints = [
    { name: 'Health Check', path: '/api/v1/health' },
    { name: 'Auth Profile (me)', path: '/api/v1/auth/me' },
    { name: 'Academic Courses', path: '/api/v1/academic/courses' },
    { name: 'Academic Offerings', path: '/api/v1/academic/offerings' },
    { name: 'Academic KRS (Student)', path: '/api/v1/academic/krs/student' },
    { name: 'Academic KRS Submissions', path: '/api/v1/academic/krs/submissions' },
    { name: 'Academic KHS (Student)', path: '/api/v1/academic/khs/student' },
    { name: 'Academic Schedules', path: '/api/v1/academic/schedules' },
    { name: 'Academic Calendar', path: '/api/v1/academic/calendar' },
    { name: 'Academic Exams', path: '/api/v1/academic/exams' },
    { name: 'Academic Curricula', path: '/api/v1/academic/curricula' },
    { name: 'Academic Letters', path: '/api/v1/academic/letters' },
    { name: 'Attendance Today', path: '/api/v1/attendance/today' },
    { name: 'LMS Overview', path: '/api/v1/lms/overview' },
    { name: 'Finance Invoices (Admin)', path: '/api/v1/finance/invoices' },
    { name: 'Finance Invoices (Student)', path: '/api/v1/finance/my-invoices' },
    { name: 'Library Catalog', path: '/api/v1/library/books' },
    { name: 'Announcements Board', path: '/api/v1/announcements' },
    { name: 'Organization Hierarchy', path: '/api/v1/organization/hierarchy' },
    { name: 'Organization Faculties', path: '/api/v1/organization/faculties' },
    { name: 'Organization Stats', path: '/api/v1/organization/stats' },
    { name: 'Management Facilities', path: '/api/v1/management/facilities' },
    { name: 'Management Research LPPM', path: '/api/v1/management/research' },
    { name: 'Management Student Affairs', path: '/api/v1/management/student-affairs' },
    { name: 'Management Career & Internship', path: '/api/v1/management/career' },
    { name: 'Management HR & Personnel', path: '/api/v1/management/hr' },
    { name: 'Management Alumni Tracer', path: '/api/v1/management/alumni' },
    { name: 'System Permissions Matrix', path: '/api/v1/system/permissions' },
    { name: 'System Audit Logs', path: '/api/v1/system/audit-logs' },
    { name: 'System Settings', path: '/api/v1/system/settings' },
    { name: 'System Backup Snapshots', path: '/api/v1/system/backup' },
    { name: 'System Users Directory', path: '/api/v1/users' }
  ];

  let passed = 0;
  let failed = 0;

  console.log('\nRunning End-to-End Route Audits (32 Core Endpoints)...');
  console.log('----------------------------------------------------------------------');

  for (const ep of endpoints) {
    const start = Date.now();
    try {
      const res = await req({
        hostname: 'localhost',
        port: 4000,
        path: ep.path,
        method: 'GET',
        headers
      });
      const ms = Date.now() - start;
      const isOk = res.status === 200 || res.status === 201;
      const statusStr = 'HTTP ' + res.status;
      if (isOk) {
        passed++;
        console.log('[PASS] ' + ep.name.padEnd(32) + ' -> ' + statusStr + ' (' + ms + 'ms)');
      } else {
        failed++;
        console.log('[FAIL] ' + ep.name.padEnd(32) + ' -> ' + statusStr + ' (' + ms + 'ms)');
      }
    } catch (err) {
      failed++;
      console.log('[ERR ] ' + ep.name.padEnd(32) + ' -> ' + err.message);
    }
  }

  console.log('----------------------------------------------------------------------');
  console.log('AUDIT RESULT: ' + passed + ' / ' + endpoints.length + ' PASSED (' + failed + ' failed)');
  if (failed === 0) {
    console.log('>>> ALL ' + endpoints.length + ' ENDPOINTS VERIFIED OPERATIONAL WITH ZERO ERRORS <<<');
  } else {
    console.error('>>> SOME ENDPOINTS RETURNED UNEXPECTED STATUS CODES <<<');
    process.exit(1);
  }
}

testAll().catch(err => {
  console.error(err);
  process.exit(1);
});
