import React, { useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import AuthModal from './AuthModal';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <AuthModal
      isOpen={true}
      onClose={() => {}}
      onNavigateToTerms={() => {
        const url = window.location.origin + '/terms';
        window.open(url, '_blank');
      }}
      onNavigateToPrivacy={() => {
        const url = window.location.origin + '/privacy';
        window.open(url, '_blank');
      }}
    />;
  }

  return <>{children}</>;
};

export default AuthWrapper;
