import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../services/api';
import { UserRole } from '@icms/shared';

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  fullName: string;
  roles: UserRole[];
  avatarUrl?: string;
  studentId?: string;
  lecturerProfile?: {
    id: string;
    nidn?: string;
    academicRank?: string;
    specialization?: string;
  };
  studentProfile?: {
    id: string;
    nim: string;
    currentSemester: number;
    gpa: number;
    totalCredits: number;
    studyProgram?: {
      name: string;
      faculty?: { name: string };
    };
  };
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('icms_access_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeRole, setActiveRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem('icms_active_role');
    return (saved as UserRole) || UserRole.SUPER_ADMIN;
  });

  const setActiveRole = (role: UserRole) => {
    localStorage.setItem('icms_active_role', role);
    setActiveRoleState(role);
  };

  useEffect(() => {
    const fetchMe = async () => {
      const storedToken = localStorage.getItem('icms_access_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await apiRequest<AuthUser>('/auth/me');
        if (response.success && response.data) {
          const fetchedUser = response.data;
          setUser(fetchedUser);

          // Update active role if not set or invalid for user
          const savedRole = localStorage.getItem('icms_active_role') as UserRole;
          if (savedRole) {
            setActiveRoleState(savedRole);
          } else if (fetchedUser.roles && fetchedUser.roles.length > 0) {
            const defaultRole = fetchedUser.roles[0];
            setActiveRoleState(defaultRole);
            localStorage.setItem('icms_active_role', defaultRole);
          }
        } else {
          logout();
        }
      } catch {
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    fetchMe();
  }, []);

  const login = async (identifier: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiRequest<{
        accessToken: string;
        refreshToken: string;
        user: AuthUser;
      }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identifier, password }),
      });

      if (response.success && response.data) {
        localStorage.setItem('icms_access_token', response.data.accessToken);
        localStorage.setItem('icms_refresh_token', response.data.refreshToken);
        setToken(response.data.accessToken);
        setUser(response.data.user);

        const primaryRole = response.data.user.roles[0] || UserRole.SUPER_ADMIN;
        setActiveRoleState(primaryRole);
        localStorage.setItem('icms_active_role', primaryRole);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('icms_access_token');
    localStorage.removeItem('icms_refresh_token');
    localStorage.removeItem('icms_active_role');
    setToken(null);
    setUser(null);
    setActiveRoleState(UserRole.SUPER_ADMIN);
  };

  const hasRole = (role: UserRole) => {
    if (!user) return false;
    if (user.roles.includes(UserRole.SUPER_ADMIN)) return true;
    return user.roles.includes(role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        activeRole,
        setActiveRole,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
