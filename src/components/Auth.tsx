import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, db } from "../config/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { AuthService } from "../services/authService";
import { testFirebaseAuth, getDetailedAuthError } from "../utils/firebaseTest";
import "./Auth.css";

interface AuthProps {
  className?: string;
  onAuthSuccess?: () => void;
}

type AuthMode = "signin" | "signup" | "forgot-password" | "verify-email";

const Auth: React.FC<AuthProps> = ({ className = "", onAuthSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<AuthMode>("signin");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const clearMessages = () => {
    setError("");
    setMessage("");
  };

  // Test Firebase connection on component mount
  useEffect(() => {
    testFirebaseAuth()
      .then((isConnected) => {
        if (!isConnected) {
          console.warn(
            "⚠️ Firebase connection test failed - authentication may not work properly",
          );
        }
      })
      .catch((error) => {
        console.error("Firebase test error:", error);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearMessages();

    try {
      if (mode === "signup") {
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
            displayName: user.email?.split("@")[0] || "User",
            createdAt: serverTimestamp(),
            photoURL: "",
            onboardingCompleted: false,
            isNewUser: true, // Mark as new user for onboarding
          },
          { merge: true },
        );

        await AuthService.sendVerificationEmail(userCredential.user);
        setMode("verify-email");
        setMessage(
          "Account created! Please check your email to verify your account before signing in.",
        );
      } else if (mode === "signin") {
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
      } else if (mode === "forgot-password") {
        await AuthService.sendPasswordReset(email);
        setMessage(
          "Password reset email sent! Check your inbox for instructions.",
        );
      }
    } catch (err: any) {
      // Log detailed error information for debugging
      getDetailedAuthError(err);

      // Handle specific Firebase Auth errors
      let errorMessage = "An error occurred during authentication";

      switch (err.code) {
        case "auth/network-request-failed":
          errorMessage =
            "Network error. Please check your internet connection and try again.";
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
      await signInWithPopup(auth, provider);
      onAuthSuccess?.();
    } catch (err: any) {
      getDetailedAuthError(err);

      let errorMessage = "Google sign-in failed. Please try again.";

      switch (err.code) {
        case "auth/network-request-failed":
          errorMessage =
            "Network error. Please check your internet connection and try again.";
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

  const handleResendVerification = async () => {
    if (!auth.currentUser) {
      setError("No user found. Please sign up again.");
      return;
    }

    setLoading(true);
    clearMessages();

    try {
      await AuthService.sendVerificationEmail(auth.currentUser);
      setMessage("Verification email sent! Please check your inbox.");
    } catch (err: any) {
      setError(AuthService.getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case "signup":
        return "Sign Up";
      case "signin":
        return "Sign In";
      case "forgot-password":
        return "Reset Password";
      case "verify-email":
        return "Verify Email";
      default:
        return "Sign In";
    }
  };

  const getButtonText = () => {
    if (loading) return "Please wait...";
    switch (mode) {
      case "signup":
        return "Sign Up";
      case "signin":
        return "Sign In";
      case "forgot-password":
        return "Send Reset Email";
      case "verify-email":
        return "Resend Verification";
      default:
        return "Sign In";
    }
  };

  return (
    <div className={`auth-container ${className}`}>
      <h2>{getTitle()}</h2>

      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}

      {mode === "verify-email" ? (
        <div className="verification-content">
          <p>
            We've sent a verification email to <strong>{email}</strong>
          </p>
          <p>
            Please check your inbox and click the verification link to activate
            your account.
          </p>
          <button
            onClick={handleResendVerification}
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Sending..." : "Resend Verification Email"}
          </button>
          <p>
            Already verified?{" "}
            <span className="toggle-link" onClick={() => setMode("signin")}>
              Sign In
            </span>
          </p>
        </div>
      ) : (
        <>
          <form
            onSubmit={handleSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading) {
                e.preventDefault();
                const canSubmit =
                  email.trim() &&
                  (mode === "forgot-password" || password.trim());
                if (canSubmit) {
                  handleSubmit(e);
                }
              }
            }}
          >
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (
                      !loading &&
                      email.trim() &&
                      (password.trim() || mode === "forgot-password")
                    ) {
                      handleSubmit(e);
                    }
                  }
                }}
                required
                disabled={loading}
                placeholder="Enter your email address"
              />
            </div>

            {mode !== "forgot-password" && (
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (!loading && email.trim() && password.trim()) {
                        handleSubmit(e);
                      }
                    }
                  }}
                  required
                  disabled={loading}
                  placeholder="Enter your password"
                />
              </div>
            )}

            <button type="submit" className="auth-button" disabled={loading}>
              {getButtonText()}
            </button>
          </form>

          {mode === "signin" && (
            <button
              onClick={handleGoogleSignIn}
              className="google-button"
              disabled={loading}
            >
              {loading ? "Please wait..." : "Sign in with Google"}
            </button>
          )}

          <div className="auth-links">
            {mode === "signin" && (
              <>
                <p>
                  <span
                    className="toggle-link"
                    onClick={() => {
                      setMode("forgot-password");
                      clearMessages();
                    }}
                  >
                    Forgot your password?
                  </span>
                </p>
                <p>
                  Don't have an account?{" "}
                  <span
                    className="toggle-link"
                    onClick={() => {
                      setMode("signup");
                      clearMessages();
                    }}
                  >
                    Sign Up
                  </span>
                </p>
              </>
            )}

            {mode === "signup" && (
              <p>
                Already have an account?{" "}
                <span
                  className="toggle-link"
                  onClick={() => {
                    setMode("signin");
                    clearMessages();
                  }}
                >
                  Sign In
                </span>
              </p>
            )}

            {mode === "forgot-password" && (
              <p>
                Remember your password?{" "}
                <span
                  className="toggle-link"
                  onClick={() => {
                    setMode("signin");
                    clearMessages();
                  }}
                >
                  Sign In
                </span>
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Auth;
