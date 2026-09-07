import { useState } from 'react';
import { LogOut, User as UserIcon, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthCard() {
  const { user, loading, signInWithGoogle, signOutUser, authError, clearAuthError } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
    } finally {
      setIsSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div
        id="auth-loading-skeleton"
        className="w-full max-w-md mx-auto p-6 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm animate-pulse flex items-center justify-center min-h-[120px]"
      >
        <span className="text-sm text-neutral-400">Loading authentication...</span>
      </div>
    );
  }

  return (
    <div
      id="auth-card"
      className="w-full max-w-md mx-auto bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm"
    >
      {authError && (
        <div
          id="auth-error-alert"
          className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-start justify-between gap-2"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{authError}</span>
          </div>
          <button
            id="dismiss-auth-error-btn"
            onClick={clearAuthError}
            className="text-rose-500 hover:text-rose-700 font-semibold text-xs ml-2 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {!user ? (
        <div className="text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
            <UserIcon className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 id="auth-heading" className="text-base font-medium text-neutral-900 dark:text-neutral-100">
              Sign in with Firebase
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Sign in with your Google account to sync your profile and save notes to Firestore.
            </p>
          </div>
          <button
            id="google-signin-btn"
            onClick={handleSignIn}
            disabled={isSigningIn}
            className="w-full inline-flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-750 text-sm font-medium text-neutral-700 dark:text-neutral-200 transition-colors shadow-xs disabled:opacity-60 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isSigningIn ? 'Connecting...' : 'Sign in with Google'}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {user.photoURL ? (
              <img
                id="user-avatar-img"
                src={user.photoURL}
                alt={user.displayName || 'User Avatar'}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full border border-neutral-200 dark:border-neutral-700 object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-neutral-600 dark:text-neutral-300">
                <UserIcon className="w-5 h-5" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p id="user-display-name" className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                {user.displayName || 'Signed In User'}
              </p>
              <p id="user-email" className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                {user.email}
              </p>
            </div>
            <button
              id="signout-btn"
              onClick={signOutUser}
              title="Sign Out"
              className="p-2 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
