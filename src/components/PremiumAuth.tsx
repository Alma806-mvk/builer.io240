import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, db } from "../config/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { AuthService } from "../services/authService";
import { testFirebaseAuth, getDetailedAuthError } from "../utils/firebaseTest";
import {
  SparklesIcon,
  UserCircleIcon,
  CheckCircleIcon,
  StarIcon,
  LightBulbIcon,
  TrendingUpIcon,
  PenToolIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "./IconComponents";
import TermsOfService from "./TermsOfService";
import PrivacyPolicy from "./PrivacyPolicy";

interface PremiumAuthProps {
  className?: string;
  onAuthSuccess?: () => void;
}

type AuthMode = "signin" | "signup" | "forgot-password";

const PremiumAuth: React.FC<PremiumAuthProps> = ({
  className = "",
  onAuthSuccess,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mode, setMode] = useState<AuthMode>("signin");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const clearMessages = () => {
    setError("");
    setMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearMessages();

    // Validate inputs
    if (!email.trim()) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    if (mode !== "forgot-password" && !password.trim()) {
      setError("Password is required");
      setLoading(false);
      return;
    }

    try {
      console.log(`Attempting ${mode} with email: ${email}`);

      if (mode === "signup") {
        if (password !== confirmPassword) {
          setError("Passwords don't match");
          setLoading(false);
          return;
        }

        if (password.length < 6) {
          setError("Password must be at least 6 characters long");
          setLoading(false);
          return;
        }

        console.log("Creating user account...");
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        console.log("User created successfully:", userCredential.user.uid);

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
        setMessage("Account created! Welcome to CreateGen Studio!");
        if (onAuthSuccess) onAuthSuccess();
      } else if (mode === "signin") {
        console.log("Signing in user...");
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
        console.log("User signed in successfully:", userCredential.user.uid);
        if (onAuthSuccess) onAuthSuccess();
      } else if (mode === "forgot-password") {
        console.log("Sending password reset email...");
        await sendPasswordResetEmail(auth, email);
        setMessage("Password reset email sent! Check your inbox.");
        console.log("Password reset email sent successfully");
      }
    } catch (error: any) {
      console.error("Authentication error:", error);

      // Handle specific error codes
      let errorMessage = "An error occurred during authentication";

      switch (error.code) {
        case "auth/network-request-failed":
          errorMessage =
            "Network connection issue. Please check your internet and try again. If the problem persists, try refreshing the page.";
          // Try to refresh firebase config or provide fallback
          console.info("Attempting to reconnect Firebase...");
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
          if (error.message) {
            errorMessage = error.message;
          }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    clearMessages();

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      if (onAuthSuccess) onAuthSuccess();
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      setError("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    {
      icon: <SparklesIcon className="h-5 w-5" />,
      text: "25 free AI generations per month",
      highlight: true,
    },
    {
      icon: <LightBulbIcon className="h-5 w-5" />,
      text: "15+ AI-powered content generators",
    },
    {
      icon: <TrendingUpIcon className="h-5 w-5" />,
      text: "Real-time trend analysis & insights",
    },
    {
      icon: <PenToolIcon className="h-5 w-5" />,
      text: "Advanced canvas & design suite",
    },
    {
      icon: <ShieldCheckIcon className="h-5 w-5" />,
      text: "Firebase-secured data protection",
    },
  ];

  const testimonials = [
    {
      text: "Perfect for generating YouTube titles and thumbnails instantly!",
      author: "Alex K., Content Creator",
      rating: 5,
    },
    {
      text: "The AI script generator helps me structure my videos better.",
      author: "Jordan P., YouTuber",
      rating: 5,
    },
  ];

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-black flex items-center justify-center p-4 relative overflow-hidden ${className}`}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="w-full max-w-7xl mx-auto relative z-10">
        <div className="flex items-center justify-between">
          {/* Left Side - Value Proposition */}
          <div className="hidden lg:block space-y-8 max-w-2xl pl-8">
            {/* Premium Header */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-sky-500/20 to-indigo-500/20 border border-sky-500/30 rounded-full text-sky-300 text-sm font-medium mb-6">
                <SparklesIcon className="h-4 w-4 mr-2" />
                AI-powered content creation platform
              </div>

              <h1 className="text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Create Viral
                </span>
                <br />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Content with AI
                </span>
              </h1>

              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Generate{" "}
                <span className="text-sky-400 font-semibold">
                  scripts, thumbnails, titles & more
                </span>{" "}
                with{" "}
                <span className="text-purple-400 font-semibold">
                  15+ specialized AI generators
                </span>{" "}
                for every platform.
              </p>
            </div>

            {/* Benefits List */}
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div
                  key={`benefit-${benefit.title || benefit.icon}-${index}`}
                  className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 ${
                    benefit.highlight
                      ? "bg-gradient-to-r from-sky-500/20 to-purple-500/20 border border-sky-500/30"
                      : "bg-slate-800/30"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      benefit.highlight
                        ? "bg-gradient-to-r from-sky-600 to-purple-600"
                        : "bg-slate-700"
                    }`}
                  >
                    <div className="text-white">{benefit.icon}</div>
                  </div>
                  <span
                    className={`font-medium ${
                      benefit.highlight ? "text-sky-300" : "text-slate-300"
                    }`}
                  >
                    {benefit.text}
                  </span>
                  {benefit.highlight && (
                    <div className="ml-auto px-3 py-1 bg-sky-500/20 border border-sky-400/30 rounded-full">
                      <span className="text-sky-400 text-sm font-semibold">
                        FREE
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Social Proof */}
            <div className="grid grid-cols-2 gap-6">
              {testimonials.map((testimonial, index) => (
                <div
                  key={`testimonial-${testimonial.name}-${index}`}
                  className="bg-slate-800/40 backdrop-blur border border-slate-700/50 rounded-xl p-4"
                >
                  <div className="flex mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={`star-${testimonial.name}-${i}`} className="h-4 w-4 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm mb-2 italic">
                    "{testimonial.text}"
                  </p>
                  <p className="text-slate-400 text-xs font-medium">
                    {testimonial.author}
                  </p>
                </div>
              ))}
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center lg:justify-start space-x-6 text-slate-400 text-sm">
              <div className="flex items-center space-x-2">
                <ShieldCheckIcon className="h-4 w-4 text-sky-400" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center space-x-2">
                <UsersIcon className="h-4 w-4 text-sky-400" />
                <span>Ready to Use</span>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div className="w-full max-w-md flex-shrink-0 pr-8">
            <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center space-x-1 mb-4">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F64ff045265d44798a3091f704fc3d25a%2F233e717aa17f46c180d3e8a805cd77d4?format=webp&width=800"
                    alt="CreateGen Studio"
                    className="w-14 h-14 rounded-lg"
                  />
                  <span className="text-xl font-bold text-white">
                    CreateGen Studio
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">
                  {mode === "signin"
                    ? "Welcome back!"
                    : mode === "signup"
                      ? "Start creating today"
                      : "Reset password"}
                </h2>

                <p className="text-slate-400 text-sm">
                  {mode === "signin"
                    ? "Access your AI content generators instantly"
                    : mode === "signup"
                      ? "Get 25 free AI generations to start creating"
                      : "Enter your email to reset your password"}
                </p>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {message && (
                <div className="mb-6 p-4 bg-green-900/30 border border-green-500/50 rounded-lg">
                  <p className="text-green-400 text-sm">{message}</p>
                </div>
              )}

              {/* Google Sign In */}
              {mode !== "forgot-password" && (
                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full mb-6 px-6 py-3 bg-white hover:bg-gray-100 text-gray-900 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              )}

              {/* Divider */}
              {mode !== "forgot-password" && (
                <div className="mb-6">
                  <div className="text-center text-sm text-slate-400 mb-4">
                    or continue with email
                  </div>
                  <div className="border-t border-slate-600"></div>
                </div>
              )}

              {/* Email/Password Form */}
              <div
                className="space-y-6"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading) {
                    e.preventDefault();
                    const canSubmit =
                      email.trim() &&
                      (mode === "forgot-password" ||
                        (password.trim() &&
                          (mode !== "signup" || confirmPassword.trim())));
                    if (canSubmit) {
                      handleSubmit(e);
                    }
                  }
                }}
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        console.log("Enter pressed on email field");
                        e.preventDefault();
                        if (
                          !loading &&
                          email.trim() &&
                          (password.trim() || mode === "forgot-password")
                        ) {
                          console.log("Submitting form via Enter key");
                          handleSubmit(e);
                        } else {
                          console.log("Cannot submit - validation failed", {
                            loading,
                            email: email.trim(),
                            password: password.trim(),
                            mode,
                          });
                        }
                      }
                    }}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400 transition-all duration-200 hover:bg-slate-700/50"
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                  />
                </div>

                {mode !== "forgot-password" && (
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-slate-300 mb-2"
                    >
                      Password
                    </label>
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
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400 transition-all duration-200 hover:bg-slate-700/50"
                      placeholder="Enter your password"
                      required
                      disabled={loading}
                    />
                  </div>
                )}

                {mode === "signup" && (
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-slate-300 mb-2"
                    >
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (
                            !loading &&
                            email.trim() &&
                            password.trim() &&
                            confirmPassword.trim()
                          ) {
                            handleSubmit(e);
                          }
                        }
                      }}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400 transition-all duration-200 hover:bg-slate-700/50"
                      placeholder="Confirm your password"
                      required
                      disabled={loading}
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={
                    loading ||
                    !email ||
                    (!password && mode !== "forgot-password")
                  }
                  className="group relative w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white py-4 px-8 rounded-xl font-bold text-lg tracking-wide
                           hover:from-blue-700 hover:via-purple-700 hover:to-blue-800
                           focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-slate-900
                           transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
                           before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-white/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {mode === "signup"
                        ? "Creating account..."
                        : mode === "forgot-password"
                          ? "Sending email..."
                          : "Signing in..."}
                    </div>
                  ) : mode === "signup" ? (
                    "Start creating today"
                  ) : mode === "forgot-password" ? (
                    "Send reset email"
                  ) : (
                    "Sign in"
                  )}
                </button>
              </div>

              <div className="mt-6 text-center space-y-3">
                {mode === "signin" && (
                  <>
                    <span
                      onClick={() => setMode("forgot-password")}
                      className="text-sky-400 hover:text-sky-300 text-sm transition-colors cursor-pointer hover:underline"
                    >
                      Forgot your password?
                    </span>
                    <div className="text-slate-400 text-sm">
                      Don't have an account?{" "}
                      <span
                        onClick={() => setMode("signup")}
                        className="text-sky-400 hover:text-sky-300 font-medium transition-colors cursor-pointer hover:underline"
                      >
                        Sign up free
                      </span>
                    </div>
                  </>
                )}

                {mode === "signup" && (
                  <div className="text-slate-400 text-sm">
                    Already have an account?{" "}
                    <span
                      onClick={() => setMode("signin")}
                      className="text-sky-400 hover:text-sky-300 font-medium transition-colors cursor-pointer hover:underline"
                    >
                      Sign in
                    </span>
                  </div>
                )}

                {mode === "forgot-password" && (
                  <span
                    onClick={() => setMode("signin")}
                    className="text-sky-400 hover:text-sky-300 text-sm transition-colors cursor-pointer hover:underline"
                  >
                    Back to sign in
                  </span>
                )}

                {/* Terms */}
                <p className="text-xs text-slate-500 mt-4">
                  By continuing, you agree to our{" "}
                  <span
                    onClick={() => setShowTerms(true)}
                    className="text-sky-400 hover:text-sky-300 underline transition-colors cursor-pointer"
                  >
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span
                    onClick={() => setShowPrivacy(true)}
                    className="text-sky-400 hover:text-sky-300 underline transition-colors cursor-pointer"
                  >
                    Privacy Policy
                  </span>
                </p>
              </div>
            </div>

            {/* Mobile Benefits (only show on small screens) */}
            <div className="lg:hidden mt-8 space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-4">
                  What you'll get:
                </h3>
              </div>
              {benefits.slice(0, 3).map((benefit, index) => (
                <div
                  key={`quick-benefit-${benefit.title || benefit.icon}-${index}`}
                  className="flex items-center space-x-3 text-slate-300"
                >
                  <div className="p-2 bg-sky-600 rounded-lg">
                    <div className="text-white text-sm">{benefit.icon}</div>
                  </div>
                  <span className="text-sm">{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Terms of Service Modal */}
      <TermsOfService isOpen={showTerms} onClose={() => setShowTerms(false)} />

      {/* Privacy Policy Modal */}
      <PrivacyPolicy
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
      />
    </div>
  );
};

export default PremiumAuth;
