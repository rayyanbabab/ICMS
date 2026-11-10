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
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('icms_access_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
          setUser(response.data);
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
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('icms_access_token');
    localStorage.removeItem('icms_refresh_token');
    setToken(null);
    setUser(null);
  };

  const hasRole = (role: UserRole) => {
    if (!user) return false;
    if (user.roles.includes(UserRole.SUPER_ADMIN)) return true;
    return user.roles.includes(role);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, hasRole }}>
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
