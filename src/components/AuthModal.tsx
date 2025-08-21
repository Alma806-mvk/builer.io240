import React, { useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, db } from "../config/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { AuthService } from "../services/authService";
import { getDetailedAuthError } from "../utils/firebaseTest";
import { Eye, EyeOff } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: () => void;
  defaultTab?: 'signin' | 'signup';
  onNavigateToTerms?: () => void;
  onNavigateToPrivacy?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess, defaultTab = 'signin', onNavigateToTerms, onNavigateToPrivacy }) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>(defaultTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Reset to default tab when modal opens and close modal on escape key
  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab); // Reset to default tab when opening
    }
  }, [isOpen, defaultTab]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Mouse glow effect - tracks cursor position exactly
  useEffect(() => {
    if (!isOpen) return;
    
    // Initialize with center position
    document.documentElement.style.setProperty("--mx", "50%");
    document.documentElement.style.setProperty("--my", "50%");
    
    const onMove = (e: MouseEvent) => {
      // Set exact pixel position where mouse is
      document.documentElement.style.setProperty("--mx", `${e.clientX}px`);
      document.documentElement.style.setProperty("--my", `${e.clientY}px`);
    };
    
    // Use passive listener for better performance
    window.addEventListener("mousemove", onMove, { passive: true });
    
    return () => {
      window.removeEventListener("mousemove", onMove);
      // Reset to center when modal closes
      document.documentElement.style.setProperty("--mx", "50%");
      document.documentElement.style.setProperty("--my", "50%");
    };
  }, [isOpen]);

  const clearMessages = () => {
    setError('');
    setMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearMessages();

    try {
      if (activeTab === 'signup') {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );

        // Create user document in Firestore for new email/password signups
        const user = userCredential.user;
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(
          userDocRef,
          {
            uid: user.uid,
            email: user.email,
            displayName: name || user.email?.split("@")[0] || "User",
            createdAt: serverTimestamp(),
            photoURL: "",
            onboardingCompleted: false,
            isNewUser: true, // Mark as new user for onboarding
          },
          { merge: true },
        );

        await AuthService.sendVerificationEmail(userCredential.user);
        setMessage(
          "Account created! Please check your email to verify your account before signing in.",
        );
        // Switch to signin tab after successful signup
        setTimeout(() => {
          setActiveTab('signin');
          setMessage('');
        }, 3000);
      } else if (activeTab === 'signin') {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
        if (!userCredential.user.emailVerified) {
          setError(
            "Please verify your email before signing in. Check your inbox for a verification link.",
          );
          return;
        }
        onAuthSuccess?.();
        onClose();
      }
    } catch (err: any) {
      // Log detailed error information for debugging
      getDetailedAuthError(err);

      // Add specific debug logging for auth errors
      console.log("🔍 AuthModal Error Debug:");
      console.log("Error code:", err.code);
      console.log("Error message:", err.message);
      console.log("Full error object:", err);

      // Handle specific Firebase Auth errors
      let errorMessage = "An error occurred during authentication";

      switch (err.code) {
        case "auth/network-request-failed":
          // Check if this is during a sign-in attempt (likely auth error disguised as network error)
          if (activeTab === "signin" && email && password) {
            errorMessage = "Incorrect email or password. Please check your credentials and try again.";
          } else if (activeTab === "signup") {
            // For signup, could be various issues
            errorMessage = "Unable to create account. Please check your details and try again.";
          } else {
            errorMessage =
              `Network error (Code: ${err.code}). Please check your internet connection and try again. Debug: ${err.message}`;
          }
          break;
        case "auth/invalid-email":
          errorMessage = "Please enter a valid email address.";
          break;
        case "auth/user-disabled":
          errorMessage = "This account has been disabled.";
          break;
        case "auth/user-not-found":
          errorMessage = "No account found with this email address.";
          break;
        case "auth/wrong-password":
        case "auth/invalid-credential":
        case "auth/invalid-login-credentials":
          errorMessage =
            "Invalid email or password. Please check your credentials and try again.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many failed attempts. Please try again later.";
          break;
        case "auth/email-already-in-use":
          errorMessage = "An account with this email already exists.";
          break;
        case "auth/weak-password":
          errorMessage =
            "Password is too weak. Please choose a stronger password.";
          break;
        default:
          errorMessage = AuthService.getErrorMessage(err);
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    clearMessages();

    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Create user document in Firestore for Google signups (if it doesn't exist)
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(
        userDocRef,
        {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email?.split("@")[0] || "User",
          createdAt: serverTimestamp(),
          photoURL: user.photoURL || "",
          onboardingCompleted: false,
          isNewUser: true, // Mark as new user for onboarding
        },
        { merge: true }, // This will only create if document doesn't exist
      );

      onAuthSuccess?.();
      onClose();
    } catch (err: any) {
      getDetailedAuthError(err);

      // Add specific debug logging for Google auth errors
      console.log("🔍 Google Sign-in Error Debug:");
      console.log("Error code:", err.code);
      console.log("Error message:", err.message);
      console.log("Full error object:", err);

      let errorMessage = "Google sign-in failed. Please try again.";

      switch (err.code) {
        case "auth/network-request-failed":
          // For Google sign-in, could be various issues
          errorMessage = "Google sign-in failed. Please check your internet connection and try again.";
          break;
        case "auth/popup-closed-by-user":
          errorMessage = "Sign-in was cancelled. Please try again.";
          break;
        case "auth/popup-blocked":
          errorMessage =
            "Pop-up was blocked. Please allow pop-ups and try again.";
          break;
        default:
          errorMessage =
            err.message || "Google sign-in failed. Please try again.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Clear form when tab changes
  useEffect(() => {
    setEmail('');
    setPassword('');
    setName('');
    clearMessages();
  }, [activeTab]);

  if (!isOpen) return null;

  return (
    <>
      {/* Fullscreen Auth Page with Dark Theme */}
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          animation: 'authModalSlideIn 0.3s ease-out',
          height: '100vh',
          overflow: 'auto',
          // Dark theme colors matching original
          backgroundColor: 'hsl(222.2, 84%, 4.9%)',
          color: 'hsl(210, 40%, 98%)'
        }}
      >
        {/* Background Image - Fixed and covers entire screen */}
        <img 
          src="https://cdn.builder.io/api/v1/image/assets%2F74e626ce7c2b455ebf01b3e2c7015061%2Fc6168819d113450b83ae33eb2e4e09b0?format=webp&width=800" 
          alt="CreateGen Studio authentication gradient background" 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: -30,
            height: '100%',
            width: '100%',
            objectFit: 'cover'
          }} 
        />
        
        {/* Background Overlay - Much lighter like original */}
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: -20,
            background: 'linear-gradient(to bottom, rgba(34, 39, 46, 0.6), rgba(34, 39, 46, 0.3), rgba(34, 39, 46, 0.6))'
          }}
        />

        {/* BackgroundGlow Effect - Mouse tracking glow that follows cursor exactly */}
        <div
          aria-hidden
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: -10,
            pointerEvents: 'none',
            background: `
              radial-gradient(600px circle at var(--mx, 50%) var(--my, 50%), hsl(188 92% 55% / 0.18), transparent 60%),
              radial-gradient(400px circle at calc(var(--mx, 50%) + 200px) calc(var(--my, 50%) + 100px), hsl(266 85% 60% / 0.15), transparent 60%)
            `,
            filter: 'blur(40px)',
            transition: 'background 0.1s ease-out'
          }}
        />

        {/* Close Button - Top right corner */}
        <button
          onClick={onClose}
          style={{
            position: 'fixed',
            top: '1.5rem',
            right: '1.5rem',
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '50%',
            border: '1px solid hsl(217.2, 32.6%, 17.5%)',
            backgroundColor: 'hsl(222.2, 84%, 4.9%) / 50%',
            color: 'hsl(210, 40%, 98%)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            zIndex: 50,
            transition: 'all 0.2s',
            backdropFilter: 'blur(10px)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'hsl(217.2, 32.6%, 17.5%)';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'hsl(222.2, 84%, 4.9%) / 50%';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          ×
        </button>

        {/* Main Content */}
        <main style={{ 
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3rem 1.5rem'
        }}>
          <section style={{
            maxWidth: '1200px',
            width: '100%',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              maxWidth: '32rem',
              width: '100%',
              margin: '0 auto'
            }}>
              {/* Header */}
              <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{
                  fontSize: 'clamp(2.25rem, 5vw, 3rem)',
                  fontWeight: '600',
                  color: 'hsl(210, 40%, 98%)',
                  marginBottom: '1rem',
                  fontFamily: '"Space Grotesk", Inter, system-ui, sans-serif'
                }}>
                  Welcome back
                </h1>
                <p style={{
                  color: 'hsl(215, 20.2%, 65.1%)',
                  fontSize: '1.125rem',
                  marginTop: '0.5rem'
                }}>
                  Sign in or create your account to get started.
                </p>

                {/* Error and Success Messages */}
                {error && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    backgroundColor: 'hsl(0, 84%, 60%, 0.1)',
                    border: '1px solid hsl(0, 84%, 60%, 0.3)',
                    color: 'hsl(0, 84%, 60%)',
                    fontSize: '0.875rem'
                  }}>
                    {error}
                  </div>
                )}
                {message && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    backgroundColor: 'hsl(120, 84%, 60%, 0.1)',
                    border: '1px solid hsl(120, 84%, 60%, 0.3)',
                    color: 'hsl(120, 84%, 60%)',
                    fontSize: '0.875rem'
                  }}>
                    {message}
                  </div>
                )}
              </header>

              {/* Tab Navigation - Rounded corners with smooth sliding animation */}
              <div style={{
                position: 'relative',
                display: 'flex',
                height: '2.5rem',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '0.75rem', // More rounded corners
                backgroundColor: 'hsl(217.2, 32.6%, 17.5%)',
                padding: '0.25rem',
                color: 'hsl(215, 20.2%, 65.1%)',
                width: '100%',
                marginBottom: '1rem' // Reduced from 2rem to bring tabs closer
              }}>
                {/* Sliding background indicator */}
                <div style={{
                  position: 'absolute',
                  top: '0.25rem',
                  bottom: '0.25rem',
                  left: activeTab === 'signin' ? '0.25rem' : '50%',
                  width: 'calc(50% - 0.25rem)',
                  backgroundColor: 'hsl(222.2, 84%, 4.9%)',
                  borderRadius: '0.5rem', // Rounded corners for sliding element
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                  transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)', // Smooth easing animation
                  zIndex: 1
                }} />

                <button
                  onClick={() => setActiveTab('signin')}
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    whiteSpace: 'nowrap',
                    borderRadius: '0.5rem',
                    paddingLeft: '0.75rem',
                    paddingRight: '0.75rem',
                    paddingTop: '0.375rem',
                    paddingBottom: '0.375rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    backgroundColor: 'transparent',
                    color: activeTab === 'signin' ? 'hsl(210, 40%, 98%)' : 'hsl(215, 20.2%, 65.1%)',
                    cursor: 'pointer',
                    border: 'none',
                    transition: 'color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    flex: 1
                  }}
                >
                  Sign in
                </button>
                <button
                  onClick={() => setActiveTab('signup')}
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    whiteSpace: 'nowrap',
                    borderRadius: '0.5rem',
                    paddingLeft: '0.75rem',
                    paddingRight: '0.75rem',
                    paddingTop: '0.375rem',
                    paddingBottom: '0.375rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    backgroundColor: 'transparent',
                    color: activeTab === 'signup' ? 'hsl(210, 40%, 98%)' : 'hsl(215, 20.2%, 65.1%)',
                    cursor: 'pointer',
                    border: 'none',
                    transition: 'color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    flex: 1
                  }}
                >
                  Create account
                </button>
              </div>

              {/* Form Card */}
              <div style={{
                borderRadius: '0.75rem',
                border: '1px solid hsl(217.2, 32.6%, 17.5%)',
                backgroundColor: 'hsl(222.2, 84%, 4.9%)',
                color: 'hsl(210, 40%, 98%)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}>
                <div style={{
                  padding: '2rem'
                }}>
                  <div style={{
                    minHeight: '3rem', // Fixed height area for title to prevent movement
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '1.5rem'
                  }}>
                    <h3 style={{
                      fontSize: '1.75rem',
                      fontWeight: '600',
                      lineHeight: '1',
                      letterSpacing: '-0.025em',
                      color: 'hsl(210, 40%, 98%)',
                      margin: 0
                    }}>
                      {activeTab === 'signin' ? 'Sign in' : 'Create your account'}
                    </h3>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1.5rem'
                      // Removed minHeight to allow natural expansion/contraction
                    }}>
                      {activeTab === 'signup' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          <label style={{
                            fontSize: '1rem',
                            fontWeight: '500',
                            color: 'hsl(210, 40%, 98%)'
                          }} htmlFor="name">
                            Name
                          </label>
                          <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            required
                            disabled={loading}
                            style={{
                              height: '3rem',
                              width: '100%',
                              borderRadius: '0.5rem',
                              border: '1px solid hsl(0, 0%, 0%)',
                              backgroundColor: 'hsl(0, 0%, 0%)',
                              paddingLeft: '1rem',
                              paddingRight: '1rem',
                              fontSize: '1rem',
                              color: 'hsl(210, 40%, 98%)',
                              outline: 'none',
                              transition: 'border-color 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'hsl(212.7, 26.8%, 83.9%)'}
                            onBlur={(e) => e.target.style.borderColor = 'hsl(0, 0%, 0%)'}
                          />
                        </div>
                      )}
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <label style={{
                          fontSize: '1rem',
                          fontWeight: '500',
                          color: 'hsl(210, 40%, 98%)'
                        }} htmlFor="email">
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="example@gmail.com"
                          required
                          disabled={loading}
                          style={{
                            height: '3rem',
                            width: '100%',
                            borderRadius: '0.5rem',
                            border: '1px solid hsl(0, 0%, 0%)',
                            backgroundColor: 'hsl(0, 0%, 0%)',
                            paddingLeft: '1rem',
                            paddingRight: '1rem',
                            fontSize: '1rem',
                            color: 'hsl(210, 40%, 98%)',
                            outline: 'none',
                            transition: 'border-color 0.2s'
                          }}
                          onFocus={(e) => e.target.style.borderColor = 'hsl(212.7, 26.8%, 83.9%)'}
                          onBlur={(e) => e.target.style.borderColor = 'hsl(0, 0%, 0%)'}
                        />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <label style={{
                          fontSize: '1rem',
                          fontWeight: '500',
                          color: 'hsl(210, 40%, 98%)'
                        }} htmlFor="password">
                          Password
                        </label>
                        <div style={{ position: 'relative' }}>
                          <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            disabled={loading}
                            style={{
                              height: '3rem',
                              width: '100%',
                              borderRadius: '0.5rem',
                              border: '1px solid hsl(0, 0%, 0%)',
                              backgroundColor: 'hsl(0, 0%, 0%)',
                              paddingLeft: '1rem',
                              paddingRight: '3rem',
                              fontSize: '1rem',
                              color: 'hsl(210, 40%, 98%)',
                              outline: 'none',
                              transition: 'border-color 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'hsl(212.7, 26.8%, 83.9%)'}
                            onBlur={(e) => e.target.style.borderColor = 'hsl(0, 0%, 0%)'}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={loading}
                            style={{
                              position: 'absolute',
                              right: '0.75rem',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              background: 'none',
                              border: 'none',
                              color: 'hsl(215, 20.2%, 65.1%)',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                              padding: '0.25rem',
                              borderRadius: '0.25rem',
                              transition: 'color 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(210, 40%, 98%)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(215, 20.2%, 65.1%)'}
                          >
                            {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                          </button>
                        </div>
                      </div>

                      {/* Forgot Password Link - Only show on signin */}
                      {activeTab === 'signin' && (
                        <div style={{ textAlign: 'right', marginTop: '-0.5rem', marginBottom: '0.5rem' }}>
                          <button
                            type="button"
                            onClick={() => setMessage('Password reset functionality coming soon!')}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'hsl(266, 85%, 60%)',
                              fontSize: '0.875rem',
                              cursor: 'pointer',
                              textDecoration: 'underline',
                              padding: 0
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(188, 92%, 55%)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(266, 85%, 60%)'}
                          >
                            Forgot password?
                          </button>
                        </div>
                      )}

                      <button 
                        type="submit"
                        disabled={loading}
                        style={{
                          height: '3rem',
                          width: '100%',
                          borderRadius: '0.5rem',
                          fontSize: '1rem',
                          fontWeight: '500',
                          background: loading ? 'hsl(0, 0%, 50%)' : 'linear-gradient(135deg, hsl(266, 85%, 60%), hsl(188, 92%, 55%))',
                          color: 'hsl(0, 0%, 100%)',
                          border: 'none',
                          cursor: loading ? 'not-allowed' : 'pointer',
                          transition: 'opacity 0.2s'
                        }}
                        onMouseEnter={(e) => !loading && (e.currentTarget.style.opacity = '0.9')}
                        onMouseLeave={(e) => !loading && (e.currentTarget.style.opacity = '1')}
                      >
                        {loading ? (activeTab === 'signin' ? 'Signing in...' : 'Creating account...') : (activeTab === 'signin' ? 'Sign In' : 'Create account')}
                      </button>

                      {/* Separator */}
                      <div style={{ position: 'relative', margin: '0.5rem 0' }}>
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          <div style={{
                            width: '100%',
                            borderTop: '1px solid hsl(217.2, 32.6%, 17.5%)'
                          }} />
                        </div>
                        <span style={{
                          position: 'absolute',
                          left: '50%',
                          transform: 'translateX(-50%) translateY(-50%)',
                          top: '50%',
                          backgroundColor: 'hsl(222.2, 84%, 4.9%)',
                          paddingLeft: '0.75rem',
                          paddingRight: '0.75rem',
                          fontSize: '0.875rem',
                          color: 'hsl(215, 20.2%, 65.1%)'
                        }}>
                          or
                        </span>
                      </div>

                      {/* Google Button */}
                      <button 
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        style={{
                          height: '3rem',
                          width: '100%',
                          borderRadius: '0.5rem',
                          fontSize: '1rem',
                          fontWeight: '500',
                          border: '1px solid hsl(217.2, 32.6%, 17.5%)',
                          backgroundColor: 'transparent',
                          color: 'hsl(210, 40%, 98%)',
                          cursor: loading ? 'not-allowed' : 'pointer',
                          transition: 'background-color 0.2s',
                          opacity: loading ? 0.6 : 1
                        }}
                        onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = 'hsl(217.2, 32.6%, 17.5%)')}
                        onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        {loading ? 'Please wait...' : `${activeTab === 'signin' ? 'Continue' : 'Sign up'} with Google`}
                      </button>

                      {/* Footer Text */}
                      <p style={{
                        fontSize: '0.875rem',
                        color: 'hsl(215, 20.2%, 65.1%)',
                        textAlign: 'center'
                      }}>
                        {activeTab === 'signin'
                          ? (
                            <>
                              By continuing you agree to our{' '}
                              <button
                                type="button"
                                onClick={() => onNavigateToTerms?.()}
                                style={{
                                  color: 'hsl(210, 40%, 98%)',
                                  textDecoration: 'underline',
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  fontSize: 'inherit'
                                }}
                              >
                                Terms
                              </button>
                              {' '}and{' '}
                              <button
                                type="button"
                                onClick={() => onNavigateToPrivacy?.()}
                                style={{
                                  color: 'hsl(210, 40%, 98%)',
                                  textDecoration: 'underline',
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  fontSize: 'inherit'
                                }}
                              >
                                Privacy
                              </button>.
                            </>
                          )
                          : 'No credit card required. Free plan included.'
                        }
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer - Only visible when scrolling down */}
        <footer style={{ 
          borderTop: '1px solid hsl(217.2, 32.6%, 17.5%)',
          marginTop: '4rem'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '2.5rem 1.5rem',
            display: 'grid',
            gap: '2rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'
          }}>
            <div>
              <div style={{
                background: 'linear-gradient(135deg, hsl(266, 85%, 60%), hsl(188, 92%, 55%))',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                fontFamily: '"Space Grotesk", Inter, system-ui, sans-serif',
                fontSize: '1.125rem',
                fontWeight: '600'
              }}>
                CreateGen Studio
              </div>
              <p style={{
                fontSize: '0.875rem',
                color: 'hsl(215, 20.2%, 65.1%)',
                marginTop: '0.5rem'
              }}>
                The confident co‑pilot for creator‑entrepreneurs.
              </p>
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: 'hsl(215, 20.2%, 65.1%)'
            }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li><a href="/features" style={{ color: 'hsl(215, 20.2%, 65.1%)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(210, 40%, 98%)'} onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(215, 20.2%, 65.1%)'}>Features</a></li>
                <li><a href="/pricing" style={{ color: 'hsl(215, 20.2%, 65.1%)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(210, 40%, 98%)'} onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(215, 20.2%, 65.1%)'}>Pricing</a></li>
                <li><a href="/faq" style={{ color: 'hsl(215, 20.2%, 65.1%)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(210, 40%, 98%)'} onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(215, 20.2%, 65.1%)'}>FAQ</a></li>
              </ul>
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: 'hsl(215, 20.2%, 65.1%)'
            }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li><a href="/terms" style={{ color: 'hsl(215, 20.2%, 65.1%)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(210, 40%, 98%)'} onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(215, 20.2%, 65.1%)'}>Terms</a></li>
                <li><a href="/privacy" style={{ color: 'hsl(215, 20.2%, 65.1%)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(210, 40%, 98%)'} onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(215, 20.2%, 65.1%)'}>Privacy</a></li>
              </ul>
            </div>
          </div>
          <div style={{ borderTop: '1px solid hsl(217.2, 32.6%, 17.5%)' }}>
            <div style={{
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '1.5rem',
              fontSize: '0.75rem',
              color: 'hsl(215, 20.2%, 65.1%)'
            }}>
              © {new Date().getFullYear()} CreateGen Studio. All rights reserved.
            </div>
          </div>
        </footer>
      </div>

      {/* CSS Animation and Media Queries */}
      <style>{`
        @keyframes authModalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

    </>
  );
};

export default AuthModal;
