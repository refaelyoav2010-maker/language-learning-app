import { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Props to allow navigating to registration screen or notifying login success
interface LoginScreenProps {
  onNavigateToRegister?: () => void;
  onLoginSuccess?: () => void;
}

// LoginScreen component based directly on the provided login screen mockup source
export default function LoginScreen({ onNavigateToRegister, onLoginSuccess }: LoginScreenProps) {
  // Form input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Password visibility toggle
  const [showPassword, setShowPassword] = useState(false);

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle standard email & password login
  const handleEmailLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      setErrorMessage('נא להזין כתובת אימייל וסיסמה.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      // Authenticate with Firebase Auth
      await signInWithEmailAndPassword(auth, email.trim(), password);
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err: unknown) {
      // Map Firebase Auth error codes to user-friendly messages
      const error = err as { code?: string; message?: string };
      if (
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password'
      ) {
        setErrorMessage('כתובת אימייל או סיסמה שגויים.');
      } else if (error.code === 'auth/invalid-email') {
        setErrorMessage('כתובת האימייל אינה תקינה.');
      } else if (error.code === 'auth/too-many-requests') {
        setErrorMessage('יותר מדי ניסיונות כושלים. אנא נסה שוב מאוחר יותר.');
      } else {
        setErrorMessage(error.message || 'שגיאה בהתחברות. נסה שוב.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google OAuth login
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage('');
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      // Ensure user document exists in Firestore
      if (result.user) {
        await setDoc(
          doc(db, 'users', result.user.uid),
          {
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName || '',
            lastLogin: serverTimestamp(),
          },
          { merge: true }
        );
      }
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      setErrorMessage(error.message || 'שגיאה בהתחברות עם Google.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
      <div className="relative flex h-full min-h-screen w-full flex-col max-w-[480px] mx-auto bg-white dark:bg-background-dark overflow-x-hidden shadow-2xl">
        
        {/* Top bar with back button */}
        <div className="flex items-center p-4 justify-between">
          <div
            className="text-slate-900 dark:text-slate-100 flex size-12 shrink-0 items-center justify-center cursor-pointer"
            data-icon="arrow_back"
            onClick={onNavigateToRegister}
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </div>
          <div className="w-12 h-1 bg-primary/10 rounded-full"></div>
        </div>

        {/* Header & Logo */}
        <div className="flex flex-col items-center justify-center pt-8 pb-6">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-primary text-5xl" data-icon="school">
              school
            </span>
          </div>
          <h2 className="text-slate-900 dark:text-slate-100 text-[32px] font-bold leading-tight tracking-tight">
            Welcome Back
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-base">Sign in to continue your journey</p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleEmailLogin} className="flex flex-col flex-1">
          {/* Input fields */}
          <div className="px-6 py-4 space-y-5">
            
            {/* Error Message Alert */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-xs font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Email input field */}
            <div className="flex flex-col gap-2">
              <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold px-1">Email Address</label>
              <div className="flex w-full items-stretch rounded-xl group transition-all duration-200">
                <div className="text-slate-400 group-focus-within:text-primary flex border-y border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 items-center justify-center pl-4 rounded-l-xl">
                  <span className="material-symbols-outlined text-[22px]">mail</span>
                </div>
                <input
                  className="form-input flex w-full min-w-0 flex-1 border-y border-x-0 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-0 focus:border-slate-200 dark:focus:border-slate-700 h-14 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 px-3 text-base"
                  placeholder="name@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
                <div className="flex border-y border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 items-center pr-4 rounded-r-xl"></div>
              </div>
            </div>

            {/* Password input field */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Password</label>
                <button type="button" className="text-accent text-sm font-medium hover:underline">
                  Forgot?
                </button>
              </div>
              <div className="flex w-full items-stretch rounded-xl group transition-all duration-200">
                <div className="text-slate-400 group-focus-within:text-primary flex border-y border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 items-center justify-center pl-4 rounded-l-xl">
                  <span className="material-symbols-outlined text-[22px]">lock</span>
                </div>
                <input
                  className="form-input flex w-full min-w-0 flex-1 border-y border-x-0 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-0 focus:border-slate-200 dark:focus:border-slate-700 h-14 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 px-3 text-base"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <div
                  className="text-slate-400 hover:text-slate-600 cursor-pointer flex border-y border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 items-center pr-4 rounded-r-xl"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-[22px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons & OAuth */}
          <div className="px-6 py-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 disabled:opacity-75 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                  <span>מתחבר...</span>
                </>
              ) : (
                <>
                  <span>Login to EduTrack</span>
                  <span className="material-symbols-outlined">login</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-background-dark text-slate-500">Or continue with</span>
              </div>
            </div>

            {/* Social login buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 rounded-xl py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  G
                </div>
                <span className="text-sm font-medium">Google</span>
              </button>
              <button
                type="button"
                disabled={isLoading}
                className="flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 rounded-xl py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors opacity-60 cursor-not-allowed"
              >
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  f
                </div>
                <span className="text-sm font-medium">Facebook</span>
              </button>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-auto pb-10 text-center px-6">
          <p className="text-slate-600 dark:text-slate-400">
            New to the platform?{' '}
            <button
              type="button"
              onClick={onNavigateToRegister}
              className="text-primary font-bold hover:underline ml-1"
            >
              Create Account
            </button>
          </p>
          <div className="mt-8 flex justify-center items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success"></span>
            <p className="text-xs text-slate-400 font-medium">Verified Educational Partner</p>
          </div>
        </div>

        {/* Decorative blur elements */}
        <div className="absolute top-[-100px] right-[-100px] w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-50px] left-[-50px] w-48 h-48 bg-accent/5 rounded-full blur-2xl pointer-events-none"></div>
      </div>
    </div>
  );
}
