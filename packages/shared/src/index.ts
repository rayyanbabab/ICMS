/**
 * ICMS Shared Contracts, Enums, and Core Types
 * Integrated Campus Management System
 */

// =============================================================================
// Roles & Authorization
// =============================================================================

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  RECTOR = 'RECTOR',
  VICE_RECTOR = 'VICE_RECTOR',
  DEAN = 'DEAN',
  HEAD_OF_PROGRAM = 'HEAD_OF_PROGRAM',
  ACADEMIC_ADMIN = 'ACADEMIC_ADMIN',
  FINANCE_ADMIN = 'FINANCE_ADMIN',
  ADMISSION_ADMIN = 'ADMISSION_ADMIN',
  LECTURER = 'LECTURER',
  STUDENT = 'STUDENT',
  LIBRARIAN = 'LIBRARIAN',
  HR_ADMIN = 'HR_ADMIN',
  STUDENT_AFFAIRS_ADMIN = 'STUDENT_AFFAIRS_ADMIN',
  ALUMNI = 'ALUMNI',
}

export enum PermissionAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
  VERIFY = 'VERIFY',
  MANAGE = 'MANAGE',
}

export enum PermissionScope {
  GLOBAL = 'GLOBAL',
  CAMPUS = 'CAMPUS',
  FACULTY = 'FACULTY',
  STUDY_PROGRAM = 'STUDY_PROGRAM',
  INDIVIDUAL = 'INDIVIDUAL',
}

// =============================================================================
// Student & Academic Lifecycle Enums
// =============================================================================

export enum StudentStatus {
  PROSPECTIVE = 'PROSPECTIVE',
  ACTIVE = 'ACTIVE',
  ON_LEAVE = 'ON_LEAVE',
  INACTIVE = 'INACTIVE',
  GRADUATED = 'GRADUATED',
  WITHDRAWN = 'WITHDRAWN',
}

export enum SemesterType {
  ODD = 'ODD',       // Ganjil
  EVEN = 'EVEN',     // Genap
  SHORT = 'SHORT',   // Antara / Pendek
}

export enum CourseType {
  MANDATORY = 'MANDATORY', // Wajib
  ELECTIVE = 'ELECTIVE',   // Pilihan
}

export enum KrsStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  REVISED = 'REVISED',
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',     // Hadir
  LATE = 'LATE',           // Terlambat
  SICK = 'SICK',           // Sakit
  PERMITTED = 'PERMITTED', // Izin
  ABSENT = 'ABSENT',       // Alpa / Tanpa Keterangan
}

// =============================================================================
// Financial & Examination Enums
// =============================================================================

export enum InvoiceStatus {
  UNPAID = 'UNPAID',
  PENDING = 'PENDING',
  PAID = 'PAID',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethodType {
  VIRTUAL_ACCOUNT = 'VIRTUAL_ACCOUNT',
  BANK_TRANSFER = 'BANK_TRANSFER',
  QRIS = 'QRIS',
  MANUAL_VERIFICATION = 'MANUAL_VERIFICATION',
}

export enum ExamType {
  MIDTERM = 'MIDTERM', // UTS
  FINAL = 'FINAL',     // UAS
  QUIZ = 'QUIZ',       // Kuis
}

// =============================================================================
// Common API Payload Contracts
// =============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: Record<string, any>;
  errors?: string[];
  timestamp: string;
}

export interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: PaginatedMeta;
}

export interface AuthUserTokenPayload {
  sub: string;             // User UUID
  email: string;
  username: string;
  roles: UserRole[];
  facultyId?: string;
  studyProgramId?: string;
  studentId?: string;
  lecturerId?: string;
}

