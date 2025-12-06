import React, { createContext, useContext, useEffect, useState } from 'react';
import { validateLogin, registerUser, LocalUser } from '@/data/users';

interface MockUser {
  id: string;
  email: string;
  fullName: string;
  staffId?: string;
}

interface AuthContextType {
  user: MockUser | null;
  loading: boolean;
  isManager: boolean;
  isStaff: boolean;
  isCustomer: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  signup: (email: string, password: string, fullName: string, staffId?: string) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isManager: false,
  isStaff: false,
  isCustomer: false,
  login: () => ({ success: false }),
  signup: () => ({ success: false }),
  logout: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

const determineRole = (staffId?: string) => {
  if (staffId === '12345678') return 'manager';
  if (staffId === '12345') return 'staff';
  return 'customer';
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem('mockUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email: string, password: string): { success: boolean; error?: string } => {
    const validUser = validateLogin(email, password);
    if (!validUser) {
      return { success: false, error: 'Invalid email or password' };
    }
    const mockUser: MockUser = {
      id: `user_${Date.now()}`,
      email: validUser.email,
      fullName: validUser.fullName,
      staffId: validUser.staffId,
    };
    localStorage.setItem('mockUser', JSON.stringify(mockUser));
    setUser(mockUser);
    return { success: true };
  };

  const signup = (email: string, password: string, fullName: string, staffId?: string): { success: boolean; error?: string } => {
    const newUser: LocalUser = { email, password, fullName, staffId };
    const registered = registerUser(newUser);
    if (!registered) {
      return { success: false, error: 'Email already exists' };
    }
    const mockUser: MockUser = {
      id: `user_${Date.now()}`,
      email,
      fullName,
      staffId,
    };
    localStorage.setItem('mockUser', JSON.stringify(mockUser));
    setUser(mockUser);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('mockUser');
    localStorage.removeItem('wishlist');
    setUser(null);
  };

  const role = user ? determineRole(user.staffId) : null;
  const isManager = role === 'manager';
  const isStaff = role === 'staff';
  const isCustomer = role === 'customer';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isManager,
        isStaff,
        isCustomer,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
