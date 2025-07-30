import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { auth, firebase } from '@/firebaseConfig';

// Use the compat User type
type User = firebase.User;

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged returns an unsubscribe function
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const login = async () => {
    setLoading(true);
    try {
      await auth.signInAnonymously();
    } catch (error) {
      console.error("Error signing in anonymously:", error);
    } finally {
      // onAuthStateChanged will handle setting the user and loading state
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      // onAuthStateChanged will handle setting the user and loading state
    }
  };

  const value = { user, loading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
