import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  signInAnonymously,
  type User as FirebaseUser 
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import type { UserProfile, UserRole } from '../types';
import { MOCK_USERS } from '../services/mockData';
import { auth, db, googleProvider } from '../firebase';

interface AuthContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  loginAsUser: (userId: string) => void;
  loginWithGoogle: () => Promise<void>;
  loginWithMicrosoft: (email: string, displayName?: string, department?: string) => Promise<void>;
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

  // Sync state with localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [currentUser]);

  // Firebase Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        const memberRef = doc(db, 'members', fbUser.uid);
        try {
          const snap = await getDoc(memberRef);
          if (snap.exists()) {
            const data = snap.data();
            setCurrentUser({
              uid: fbUser.uid,
              displayName: data.displayName || fbUser.displayName || 'UN Representative',
              email: data.email || fbUser.email || 'representative@un.org',
              photoURL: fbUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(fbUser.displayName || 'UN')}&background=009EDB&color=fff`,
              department: data.department || 'UN AI Advisory Group',
              title: data.title || 'Delegation Representative',
              role: (data.role as UserRole) || 'member',
              createdAt: data.createdAt || new Date().toISOString(),
              lastLoginAt: new Date().toISOString(),
            });
          } else {
            const newProfile: UserProfile = {
              uid: fbUser.uid,
              displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'UN Representative',
              email: fbUser.email || 'representative@un.org',
              photoURL: fbUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(fbUser.displayName || 'UN')}&background=009EDB&color=fff`,
              department: 'UN Secretariat / AI Advisory',
              title: 'Delegation Representative',
              role: 'member',
              createdAt: new Date().toISOString(),
              lastLoginAt: new Date().toISOString(),
            };
            await setDoc(memberRef, {
              ...newProfile,
              updatedAt: serverTimestamp()
            });
            setCurrentUser(newProfile);
          }
        } catch (err) {
          console.warn('Firestore fetch failed, falling back to local Auth state:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const saveMemberToFirestore = async (userProfile: UserProfile) => {
    try {
      const memberRef = doc(db, 'members', userProfile.uid);
      await setDoc(memberRef, {
        ...userProfile,
        lastLoginAt: new Date().toISOString(),
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (e) {
      console.warn('Unable to sync member profile to Firestore (using fallback mode):', e);
    }
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const loginAsUser = async (userId: string) => {
    const user = MOCK_USERS.find(u => u.uid === userId);
    if (user) {
      setCurrentUser(user);
      await saveMemberToFirestore(user);
      setIsLoginModalOpen(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const profile: UserProfile = {
        uid: fbUser.uid,
        displayName: fbUser.displayName || 'UN Representative',
        email: fbUser.email || '',
        photoURL: fbUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(fbUser.displayName || 'UN')}&background=009EDB&color=fff`,
        department: 'UN AI Society Member',
        title: 'Delegation Representative',
        role: 'member',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
      setCurrentUser(profile);
      await saveMemberToFirestore(profile);
      setIsLoginModalOpen(false);
    } catch (error) {
      console.error('Google Sign-In failed:', error);
      // Fall back to anonymous or mock if popup fails
      try {
        const anon = await signInAnonymously(auth);
        const anonProfile: UserProfile = {
          uid: anon.user.uid,
          displayName: 'UN Guest Member',
          email: 'guest@un.org',
          photoURL: `https://ui-avatars.com/api/?name=Guest+User&background=009EDB&color=fff`,
          department: 'UN Secretariat',
          title: 'Guest Representative',
          role: 'member',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        };
        setCurrentUser(anonProfile);
        await saveMemberToFirestore(anonProfile);
        setIsLoginModalOpen(false);
      } catch (anonErr) {
        console.error('Anonymous fallback failed:', anonErr);
      }
    }
  };

  const loginWithMicrosoft = async (email: string, displayName?: string, department?: string) => {
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
    await saveMemberToFirestore(newUser);
    setIsLoginModalOpen(false);
  };

  const logout = () => {
    firebaseSignOut(auth).catch(() => {});
    setCurrentUser(null);
  };

  const switchUserRole = async (role: UserRole) => {
    if (currentUser) {
      const updated = {
        ...currentUser,
        role
      };
      setCurrentUser(updated);
      await saveMemberToFirestore(updated);
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
        loginWithGoogle,
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

