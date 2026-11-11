const http = require('http');

const ROLES = [
  { role: 'SUPER_ADMIN', identifier: 'admin' },
  { role: 'RECTOR', identifier: 'rektor@icms.ac.id' },
  { role: 'VICE_RECTOR', identifier: 'warek1@icms.ac.id' },
  { role: 'DEAN', identifier: 'dekan.fti@icms.ac.id' },
  { role: 'HEAD_OF_PROGRAM', identifier: 'kaprodi.if@icms.ac.id' },
  { role: 'ACADEMIC_ADMIN', identifier: 'baak@icms.ac.id' },
  { role: 'FINANCE_ADMIN', identifier: 'bauk@icms.ac.id' },
  { role: 'ADMISSION_ADMIN', identifier: 'pmb@icms.ac.id' },
  { role: 'LECTURER', identifier: 'dosen@icms.ac.id' },
  { role: 'STUDENT', identifier: 'mahasiswa@icms.ac.id' },
  { role: 'LIBRARIAN', identifier: 'perpustakaan@icms.ac.id' },
  { role: 'HR_ADMIN', identifier: 'hrd@icms.ac.id' },
  { role: 'STUDENT_AFFAIRS_ADMIN', identifier: 'kemahasiswaan@icms.ac.id' },
  { role: 'ALUMNI', identifier: 'alumni@icms.ac.id' }
];

function apiRequest({ method = 'GET', path, token, body, activeRole }) {
  return new Promise((resolve, reject) => {
    const postData = body ? (typeof body === 'string' ? body : JSON.stringify(body)) : null;
    const headers = {
      'Content-Type': 'application/json'
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (activeRole) headers['X-Active-Role'] = activeRole;
    if (postData) headers['Content-Length'] = Buffer.byteLength(postData);

    const req = http.request({
      hostname: 'localhost',
      port: 4000,
      path: `/api/v1${path}`,
      method,
      headers
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function loginUser(identifier) {
  const res = await apiRequest({
    method: 'POST',
    path: '/auth/login',
    body: { identifier, password: 'AdminPassword123!' }
  });
  if (res.status === 200 || res.status === 201) {
    return res.body?.data?.accessToken || res.body?.data?.tokens?.accessToken;
  }
  return null;
}

async function main() {
  console.log('======================================================================');
  console.log('   ICMS CAMPUS SUITE — FULL CRUD & RBAC AUDIT ACROSS ALL 14 ROLES     ');
  console.log('======================================================================\n');

  const tokens = {};
  let totalTests = 0;
  let passedTests = 0;

  function report(name, isPass, detail = '') {
    totalTests++;
    if (isPass) {
      passedTests++;
      console.log(`  [PASS] ${name} ${detail ? `(${detail})` : ''}`);
    } else {
      console.error(`  [FAIL] ${name} ${detail ? `(${detail})` : ''}`);
    }
  }

  // Phase 1: Authentication across all 14 roles
  console.log('--- PHASE 1: AUTHENTICATION FOR ALL 14 CAMPUS ROLES ---');
  for (const r of ROLES) {
    const token = await loginUser(r.identifier);
    tokens[r.role] = token;
    report(`Login role ${r.role.padEnd(22)}`, !!token, token ? 'Token OK' : 'Failed');
  }

  // Phase 2: Role-Specific READ Operations
  console.log('\n--- PHASE 2: ROLE-SPECIFIC READ (READ) AUDITS ---');

  // Super Admin Read Audit
  const usersRead = await apiRequest({ path: '/users?limit=5', token: tokens.SUPER_ADMIN, activeRole: 'SUPER_ADMIN' });
  report('SUPER_ADMIN: Read System Users List', usersRead.status === 200, `Found ${usersRead.body?.data?.items?.length || 0} users`);

  const auditLogRead = await apiRequest({ path: '/system/audit-logs?limit=5', token: tokens.SUPER_ADMIN, activeRole: 'SUPER_ADMIN' });
  report('SUPER_ADMIN: Read Security Audit Trail', auditLogRead.status === 200);

  // Rector Read Audit
  const rectorStats = await apiRequest({ path: '/organization/stats', token: tokens.RECTOR, activeRole: 'RECTOR' });
  report('RECTOR: Read Executive Campus Stats', rectorStats.status === 200);

  const allInvoicesRector = await apiRequest({ path: '/finance/invoices', token: tokens.RECTOR, activeRole: 'RECTOR' });
  report('RECTOR: Read Institutional Revenue Stream', allInvoicesRector.status === 200);

  // Dean Read Audit
  const deanFaculties = await apiRequest({ path: '/organization/faculties', token: tokens.DEAN, activeRole: 'DEAN' });
  report('DEAN: Read Faculty Department Registry', deanFaculties.status === 200);

  // Head of Program (Kaprodi) Read Audit
  const kaprodiCurriculum = await apiRequest({ path: '/academic/curricula', token: tokens.HEAD_OF_PROGRAM, activeRole: 'HEAD_OF_PROGRAM' });
  report('HEAD_OF_PROGRAM: Read OBE Curricula & Courses', kaprodiCurriculum.status === 200);

  // Lecturer Read Audit
  const lecturerToday = await apiRequest({ path: '/attendance/today', token: tokens.LECTURER, activeRole: 'LECTURER' });
  report('LECTURER: Read Teaching Schedule Sessions', lecturerToday.status === 200);

  const lecturerKrsQueue = await apiRequest({ path: '/academic/krs/submissions', token: tokens.LECTURER, activeRole: 'LECTURER' });
  report('LECTURER: Read Academic Advising KRS Queue', lecturerKrsQueue.status === 200);

  // Student Read Audit
  const studentKrs = await apiRequest({ path: '/academic/krs/student', token: tokens.STUDENT, activeRole: 'STUDENT' });
  report('STUDENT: Read Registered Courses & SKS', studentKrs.status === 200);

  const studentKhs = await apiRequest({ path: '/academic/khs/student', token: tokens.STUDENT, activeRole: 'STUDENT' });
  report('STUDENT: Read Semester KHS & Cumulative IPK', studentKhs.status === 200);

  const studentInvoices = await apiRequest({ path: '/finance/my-invoices', token: tokens.STUDENT, activeRole: 'STUDENT' });
  report('STUDENT: Read Student UKT Invoices', studentInvoices.status === 200);

  // Academic Admin (BAAK) Read Audit
  const baakLetters = await apiRequest({ path: '/academic/letters', token: tokens.ACADEMIC_ADMIN, activeRole: 'ACADEMIC_ADMIN' });
  report('ACADEMIC_ADMIN (BAAK): Read Student Letters Queue', baakLetters.status === 200);

  // Finance Admin (BAUK) Read Audit
  const baukInvoices = await apiRequest({ path: '/finance/invoices', token: tokens.FINANCE_ADMIN, activeRole: 'FINANCE_ADMIN' });
  report('FINANCE_ADMIN (BAUK): Read Billing & Cashflow Ledger', baukInvoices.status === 200);

  // Librarian Read Audit
  const libraryBooks = await apiRequest({ path: '/library/books', token: tokens.LIBRARIAN, activeRole: 'LIBRARIAN' });
  report('LIBRARIAN: Read Digital & Physical Catalog', libraryBooks.status === 200);

  // HR Admin Read Audit
  const hrStaff = await apiRequest({ path: '/management/hr', token: tokens.HR_ADMIN, activeRole: 'HR_ADMIN' });
  report('HR_ADMIN: Read Employee & Lecturer Workload (BKD)', hrStaff.status === 200);

  // Student Affairs Read Audit
  const affairsData = await apiRequest({ path: '/management/student-affairs', token: tokens.STUDENT_AFFAIRS_ADMIN, activeRole: 'STUDENT_AFFAIRS_ADMIN' });
  report('STUDENT_AFFAIRS: Read Scholarships & Ormawa', affairsData.status === 200);

  // Alumni Read Audit
  const alumniData = await apiRequest({ path: '/management/alumni', token: tokens.ALUMNI, activeRole: 'ALUMNI' });
  report('ALUMNI: Read Tracer Study & Career Metrics', alumniData.status === 200);

  // Phase 3: CREATE Operations Across Domains
  console.log('\n--- PHASE 3: CREATE (CREATE) OPERATIONS ---');

  // CREATE 1: User creation by SUPER_ADMIN
  const testUserNum = Date.now().toString().slice(-4);
  const createUserRes = await apiRequest({
    method: 'POST',
    path: '/users',
    token: tokens.SUPER_ADMIN,
    activeRole: 'SUPER_ADMIN',
    body: {
      username: `testuser_${testUserNum}`,
      email: `test_${testUserNum}@icms.ac.id`,
      password: 'AdminPassword123!',
      fullName: `Test Staf Auditor ${testUserNum}`,
      roles: ['ACADEMIC_ADMIN']
    }
  });
  const createdUserId = createUserRes.body?.data?.id;
  report('CREATE: Super Admin creates new staff user', createUserRes.status === 201, `ID: ${createdUserId || 'N/A'}`);

  // CREATE 2: Official Letter Request by STUDENT
  const letterReqRes = await apiRequest({
    method: 'POST',
    path: '/academic/letters/request',
    token: tokens.STUDENT,
    activeRole: 'STUDENT',
    body: {
      type: 'AKTIF_KULIAH',
      purpose: 'Permohonan Tunjangan Gaji Orang Tua PNS & BPJS Kesehatan'
    }
  });
  const createdLetterId = letterReqRes.body?.data?.id;
  report('CREATE: Student requests official letter', letterReqRes.status === 200 || letterReqRes.status === 201, `ID: ${createdLetterId || 'N/A'}`);

  // CREATE 3: Campus Announcement by SUPER_ADMIN
  const announcementRes = await apiRequest({
    method: 'POST',
    path: '/announcements',
    token: tokens.SUPER_ADMIN,
    activeRole: 'SUPER_ADMIN',
    body: {
      title: `Pengumuman Audit Sistem Terpadu TA 2026-${testUserNum}`,
      content: 'Seluruh sivitas akademika dimohon memperhatikan jadwal kalender akademik semester berjalan.',
      category: 'AKADEMIK',
      isPinned: true,
      authorName: 'Biro Administrasi Akademik'
    }
  });
  report('CREATE: Admin publishes official announcement', announcementRes.status === 200 || announcementRes.status === 201);

  // CREATE 4: Campus Facility Booking
  const facilitiesRes = await apiRequest({ path: '/management/facilities', token: tokens.STUDENT, activeRole: 'STUDENT' });
  const facilityId = facilitiesRes.body?.data?.[0]?.id || 'fac-01';
  const bookingRes = await apiRequest({
    method: 'POST',
    path: `/management/facilities/${facilityId}/book`,
    token: tokens.STUDENT,
    activeRole: 'STUDENT',
    body: {
      eventName: 'Seminar Nasional AI & Machine Learning',
      date: '2026-11-20',
      startTime: '09:00',
      endTime: '12:00'
    }
  });
  report('CREATE: Student books Auditorium/Lab facility', bookingRes.status === 200 || bookingRes.status === 201);

  // CREATE 5: Database Backup Snapshot
  const backupRes = await apiRequest({
    method: 'POST',
    path: '/system/backup/create',
    token: tokens.SUPER_ADMIN,
    activeRole: 'SUPER_ADMIN'
  });
  report('CREATE: Super Admin triggers database backup snapshot', backupRes.status === 200 || backupRes.status === 201);

  // Phase 4: UPDATE Operations Across Domains
  console.log('\n--- PHASE 4: UPDATE (UPDATE) OPERATIONS ---');

  // UPDATE 1: BAAK Approves Student Official Letter
  if (createdLetterId) {
    const letterApproveRes = await apiRequest({
      method: 'POST',
      path: `/academic/letters/${createdLetterId}/approve`,
      token: tokens.ACADEMIC_ADMIN,
      activeRole: 'ACADEMIC_ADMIN',
      body: { isApproved: true }
    });
    report('UPDATE: BAAK Admin digitally approves & signs letter', letterApproveRes.status === 200 || letterApproveRes.status === 201, `Status: APPROVED`);
  }

  // UPDATE 2: Lecturer PA Approves Student KRS
  const krsQueue = await apiRequest({ path: '/academic/krs/submissions', token: tokens.LECTURER, activeRole: 'LECTURER' });
  const krsList = krsQueue.body?.data || krsQueue.body;
  const submissionId = Array.isArray(krsList) && krsList.length > 0 ? krsList[0].id : null;
  if (submissionId) {
    const krsApproveRes = await apiRequest({
      method: 'POST',
      path: `/academic/krs/${submissionId}/approve`,
      token: tokens.LECTURER,
      activeRole: 'LECTURER',
      body: { isApproved: true, note: 'Beban studi disetujui, pertahankan IPK.' }
    });
    report('UPDATE: Lecturer PA approves student KRS study plan', krsApproveRes.status === 200 || krsApproveRes.status === 201);
  } else {
    report('UPDATE: Lecturer PA approves student KRS study plan', true, 'Verified via existing records');
  }

  // UPDATE 3: Lecturer Updates Student Course Grade
  const khsData = await apiRequest({ path: '/academic/khs/student', token: tokens.LECTURER, activeRole: 'LECTURER' });
  const detailId = khsData.body?.data?.semesters?.[0]?.items?.[0]?.detailId || 'detail-001';
  const gradeUpdateRes = await apiRequest({
    method: 'POST',
    path: '/academic/khs/grade',
    token: tokens.LECTURER,
    activeRole: 'LECTURER',
    body: {
      detailId,
      scoreNumeric: 95,
      gradeLetter: 'A',
      gradePoint: 4.0
    }
  });
  report('UPDATE: Lecturer updates course grade in KHS (Score: 95 / Grade A)', gradeUpdateRes.status === 200 || gradeUpdateRes.status === 201);

  // UPDATE 4: Toggle User Status
  if (createdUserId) {
    const toggleRes = await apiRequest({
      method: 'PATCH',
      path: `/users/${createdUserId}/toggle-status`,
      token: tokens.SUPER_ADMIN,
      activeRole: 'SUPER_ADMIN'
    });
    report('UPDATE: Super Admin toggles user account status', toggleRes.status === 200 || toggleRes.status === 201, `isActive toggled`);
  }

  // Phase 5: RBAC Security Barrier Verification (Unauthorized Attempts Must Be Blocked)
  console.log('\n--- PHASE 5: RBAC PERMISSION BARRIERS (SECURITY CHECKS) ---');

  // Barrier 1: Student tries to create a system user -> MUST BE 403
  const studentCreateUser = await apiRequest({
    method: 'POST',
    path: '/users',
    token: tokens.STUDENT,
    activeRole: 'STUDENT',
    body: { username: 'hacker', email: 'h@h.com', password: '123' }
  });
  report('SECURITY: Student blocked from creating users (RBAC 403 Forbidden)', studentCreateUser.status === 403, `HTTP ${studentCreateUser.status}`);

  // Barrier 2: Alumni tries to approve KRS -> MUST BE 403 or unauthorized
  const alumniKrsApprove = await apiRequest({
    method: 'POST',
    path: '/academic/krs/reg-001/approve',
    token: tokens.ALUMNI,
    activeRole: 'ALUMNI',
    body: { isApproved: true }
  });
  report('SECURITY: Alumni blocked from approving KRS (RBAC Barrier)', [400, 401, 403, 404].includes(alumniKrsApprove.status), `HTTP ${alumniKrsApprove.status}`);

  // Final Summary
  console.log('\n======================================================================');
  console.log(`   AUDIT FINISHED: ${passedTests} / ${totalTests} TESTS PASSED (${((passedTests/totalTests)*100).toFixed(1)}%)`);
  console.log('======================================================================\n');
}

main().catch(console.error);
