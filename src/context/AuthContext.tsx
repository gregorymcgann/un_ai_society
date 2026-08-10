import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  type User as FirebaseUser 
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import type { UserProfile, UserRole } from '../types';
import { auth, db, googleProvider } from '../firebase';

export type AuthPageView = 'calendar' | 'auth';

interface AuthContextType {
  currentUser: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  isLoginModalOpen: boolean;
  currentPage: AuthPageView;
  setCurrentPage: (page: AuthPageView) => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  loginWithGoogle: () => Promise<void>;
  loginWithMicrosoft: (email?: string, displayName?: string, department?: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName?: string, department?: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  reloadAndCheckVerification: () => Promise<boolean>;
  sendPasswordReset: (email: string) => Promise<void>;
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
    return null;
  });

  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(auth.currentUser);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(() => {
    if (auth.currentUser) {
      return auth.currentUser.emailVerified;
    }
    return true; // Default true for mock/demo users if no active Firebase email/password user
  });

  const [currentPage, setCurrentPageState] = useState<AuthPageView>(() => {
    const savedUser = localStorage.getItem(STORAGE_KEY);
    if (!savedUser) {
      return 'auth';
    }
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (path.includes('login') || hash.includes('login') || search.includes('auth')) {
        return 'auth';
      }
    }
    return 'calendar';
  });

  const setCurrentPage = (page: AuthPageView) => {
    if (!currentUser && page !== 'auth') {
      setCurrentPageState('auth');
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.history.pushState({ page: 'auth' }, '', '/login');
      }
      return;
    }
    setCurrentPageState(page);
    if (typeof window !== 'undefined') {
      const targetUrl = page === 'auth' ? '/login' : '/';
      if (window.location.pathname !== targetUrl) {
        window.history.pushState({ page }, '', targetUrl);
      }
    }
  };

  useEffect(() => {
    if (!currentUser) {
      setCurrentPageState('auth');
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.history.replaceState({ page: 'auth' }, '', '/login');
      }
    }
  }, [currentUser]);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (!currentUser || path.includes('login') || hash.includes('login')) {
        setCurrentPageState('auth');
      } else {
        setCurrentPageState('calendar');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentUser]);

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
      setFirebaseUser(fbUser);
      if (fbUser) {
        const isPasswordUser = fbUser.providerData.some(p => p.providerId === 'password');
        const verifiedStatus = isPasswordUser ? fbUser.emailVerified : true;
        setIsEmailVerified(verifiedStatus);

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
              emailVerified: verifiedStatus,
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
              emailVerified: verifiedStatus,
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
      } else {
        setIsEmailVerified(true);
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

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    setCurrentPage('auth');
  };
  const closeLoginModal = () => setIsLoginModalOpen(false);

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
        emailVerified: true,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
      setCurrentUser(profile);
      setIsEmailVerified(true);
      await saveMemberToFirestore(profile);
      setIsLoginModalOpen(false);
      setCurrentPage('calendar');
    } catch (error) {
      console.error('Google Sign-In failed:', error);
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
          emailVerified: true,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        };
        setCurrentUser(anonProfile);
        setIsEmailVerified(true);
        await saveMemberToFirestore(anonProfile);
        setIsLoginModalOpen(false);
        setCurrentPage('calendar');
      } catch (anonErr) {
        console.error('Anonymous fallback failed:', anonErr);
      }
    }
  };

  const loginWithMicrosoft = async (email?: string, displayName?: string, department?: string) => {
    const targetEmail = email && email.trim() ? email.trim() : 'delegate@un.org';
    const newUser: UserProfile = {
      uid: `un-user-${Date.now()}`,
      displayName: displayName || (targetEmail.includes('@') ? targetEmail.split('@')[0].replace('.', ' ') : targetEmail),
      email: targetEmail.toLowerCase().endsWith('@un.org') ? targetEmail : `${targetEmail}@un.org`,
      photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || targetEmail)}&background=009EDB&color=fff`,
      department: department || 'UN Secretariat / AI Advisory',
      title: 'Delegation Representative',
      role: 'member',
      emailVerified: true,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
    setCurrentUser(newUser);
    setIsEmailVerified(true);
    await saveMemberToFirestore(newUser);
    setIsLoginModalOpen(false);
    setCurrentPage('calendar');
  };

  const signUpWithEmail = async (email: string, password: string, displayName?: string, department?: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const fbUser = userCredential.user;
    
    if (displayName) {
      await updateProfile(fbUser, { displayName });
    }

    // Automatically send email verification link via Firebase Auth
    await sendEmailVerification(fbUser);

    const profile: UserProfile = {
      uid: fbUser.uid,
      displayName: displayName || email.split('@')[0],
      email: fbUser.email || email,
      photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || email)}&background=009EDB&color=fff`,
      department: department || 'UN Global Pulse / Technology Bureau',
      title: 'Delegation Representative',
      role: 'member',
      emailVerified: false,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    setCurrentUser(profile);
    setIsEmailVerified(false);
    await saveMemberToFirestore(profile);
    setIsLoginModalOpen(false);
  };

  const signInWithEmail = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const fbUser = userCredential.user;

    const isVerified = fbUser.emailVerified;
    setIsEmailVerified(isVerified);

    const profile: UserProfile = {
      uid: fbUser.uid,
      displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'UN Representative',
      email: fbUser.email || email,
      photoURL: fbUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(fbUser.displayName || 'UN')}&background=009EDB&color=fff`,
      department: 'UN AI Advisory Group',
      title: 'Delegation Representative',
      role: 'member',
      emailVerified: isVerified,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    setCurrentUser(profile);
    await saveMemberToFirestore(profile);
    setIsLoginModalOpen(false);
    if (isVerified) {
      setCurrentPage('calendar');
    }
  };

  const resendVerificationEmail = async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    } else {
      throw new Error('No active user session found to resend verification email.');
    }
  };

  const reloadAndCheckVerification = async (): Promise<boolean> => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      const verified = auth.currentUser.emailVerified;
      setIsEmailVerified(verified);
      if (currentUser) {
        setCurrentUser({ ...currentUser, emailVerified: verified });
      }
      if (verified) {
        setCurrentPage('calendar');
      }
      return verified;
    }
    return false;
  };

  const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const logout = () => {
    firebaseSignOut(auth).catch(() => {});
    setCurrentUser(null);
    setFirebaseUser(null);
    setIsEmailVerified(true);
    setCurrentPageState('auth');
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
      window.history.pushState({ page: 'auth' }, '', '/login');
    }
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
        firebaseUser,
        isAuthenticated: !!currentUser,
        isEmailVerified,
        isLoginModalOpen,
        currentPage,
        setCurrentPage,
        openLoginModal,
        closeLoginModal,
        loginWithGoogle,
        loginWithMicrosoft,
        signUpWithEmail,
        signInWithEmail,
        resendVerificationEmail,
        reloadAndCheckVerification,
        sendPasswordReset,
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


