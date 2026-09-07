/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Header from './components/Header';

export default function App() {
  return (
    <main
      id="app-container"
      className="min-h-screen w-full bg-neutral-50 dark:bg-neutral-950 flex flex-col items-center justify-center p-6"
    >
      <Header />
    </main>
  );
}

