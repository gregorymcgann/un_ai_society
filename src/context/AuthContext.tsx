import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile, UserRole } from '../types';
import { MOCK_USERS } from '../services/mockData';

interface AuthContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  loginAsUser: (userId: string) => void;
  loginWithMicrosoft: (email: string, displayName?: string, department?: string) => void;
  logout: () => void;
  switchUserRole: (role: UserRole) => void;
}

const STORAGE_KEY = 'un_ai_society_auth_user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved user:', e);
      }
    }
    return MOCK_USERS[0];
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [currentUser]);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const loginAsUser = (userId: string) => {
    const user = MOCK_USERS.find(u => u.uid === userId);
    if (user) {
      setCurrentUser(user);
      setIsLoginModalOpen(false);
    }
  };

  const loginWithMicrosoft = (email: string, displayName?: string, department?: string) => {
    const newUser: UserProfile = {
      uid: `un-user-${Date.now()}`,
      displayName: displayName || email.split('@')[0].replace('.', ' '),
      email: email.toLowerCase().endsWith('@un.org') ? email : `${email}@un.org`,
      photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || email)}&background=009EDB&color=fff`,
      department: department || 'UN Secretariat / AI Advisory',
      title: 'Delegation Representative',
      role: 'member',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
    setCurrentUser(newUser);
    setIsLoginModalOpen(false);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchUserRole = (role: UserRole) => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        role
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        loginAsUser,
        loginWithMicrosoft,
        logout,
        switchUserRole,
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
