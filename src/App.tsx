/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Header from './components/Header';
import FirebaseStatusBadge from './components/FirebaseStatusBadge';
import AuthCard from './components/AuthCard';
import WelcomeNotes from './components/WelcomeNotes';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <main
        id="app-container"
        className="min-h-screen w-full bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col items-center justify-center px-4 py-12 sm:py-16"
      >
        <div className="w-full max-w-xl mx-auto flex flex-col items-center space-y-8">
          <FirebaseStatusBadge />
          <Header />
          <div className="w-full space-y-6">
            <AuthCard />
            <WelcomeNotes />
          </div>
        </div>
      </main>
    </AuthProvider>
  );
}


