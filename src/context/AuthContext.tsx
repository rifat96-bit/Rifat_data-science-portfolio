import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db, testFirestoreConnection } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  authorizedAdminEmail: string;
}

export const AUTHORIZED_ADMIN_EMAIL = 'beingcrazyff@gmail.com';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Test initial Firestore connection on app mount
    testFirestoreConnection();

    // Listen to Firebase Auth state transitions
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      setUser(currentUser);

      if (currentUser) {
        try {
          // Email verification requirement matching firestore.rules isVerified()
          const isVerified = Boolean(
            currentUser.emailVerified ||
            currentUser.providerData.some(p => p.providerId === 'google.com')
          );

          if (!isVerified) {
            setIsAdmin(false);
            setLoading(false);
            return;
          }

          // Check if primary admin email matches (case-insensitive)
          const isPrimaryEmail = currentUser.email?.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase();

          // Or check Firestore /admins/{uid} registry with role === 'admin'
          let hasAdminDoc = false;
          try {
            const adminDocRef = doc(db, 'admins', currentUser.uid);
            const adminDocSnap = await getDoc(adminDocRef);
            hasAdminDoc = adminDocSnap.exists() && adminDocSnap.data()?.role === 'admin';
          } catch {
            // Permission denied or uninitialized collection: fallback to safe false
            hasAdminDoc = false;
          }

          setIsAdmin(isPrimaryEmail || hasAdminDoc);
        } catch (err) {
          console.error('Error evaluating admin authorization:', err);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      console.error('Sign-in error:', err);
      const message = err instanceof Error ? err.message : 'Authentication failed';
      setAuthError(message);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setIsAdmin(false);
    } catch (err: unknown) {
      console.error('Sign-out error:', err);
      setAuthError(err instanceof Error ? err.message : 'Sign-out failed');
    }
  };

  const clearError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        authError,
        signInWithGoogle,
        signOut,
        clearError,
        authorizedAdminEmail: AUTHORIZED_ADMIN_EMAIL,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
