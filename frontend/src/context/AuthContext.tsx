import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, role: UserRole, fullName: string) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const DEMO_USERS: Record<UserRole, User> = {
  HR_ADMIN: {
    id: "usr-hr-admin",
    email: "hr@technova.com",
    fullName: "Sarah Jenkins",
    role: "HR_ADMIN",
    organizationId: "org-technova-01",
    departmentId: "dept-eng",
    teamId: "team-core-backend"
  },
  MANAGER: {
    id: "usr-mgr-sre",
    email: "elena.sre@technova.com",
    fullName: "Elena Rostova",
    role: "MANAGER",
    organizationId: "org-technova-01",
    departmentId: "dept-eng",
    teamId: "team-devops-sre"
  },
  EMPLOYEE: {
    id: "usr-emp-01",
    email: "alex.chen@technova.com",
    fullName: "Alex Chen",
    role: "EMPLOYEE",
    organizationId: "org-technova-01",
    departmentId: "dept-eng",
    teamId: "team-core-backend"
  },
  ADMIN: {
    id: "usr-admin-sys",
    email: "admin@technova.com",
    fullName: "System Admin",
    role: "ADMIN",
    organizationId: "org-technova-01"
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('emotionsense_user');
    return saved ? JSON.parse(saved) : DEMO_USERS.HR_ADMIN;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('emotionsense_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('emotionsense_user');
      localStorage.removeItem('emotionsense_token');
    }
  }, [user]);

  const login = (email: string, role: UserRole, fullName: string) => {
    const newUser: User = {
      id: "usr-" + Math.random().toString(36).substring(2, 8),
      email,
      fullName,
      role,
      organizationId: "org-technova-01"
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: UserRole) => {
    setUser(DEMO_USERS[role]);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
