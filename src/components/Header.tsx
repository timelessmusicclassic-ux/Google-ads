import { motion } from 'motion/react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export default function Header({
  title = 'Welcome to the Application',
  subtitle = 'Get started by exploring your workspace or configuring your project settings.',
}: HeaderProps) {
  return (
    <header
      id="main-header"
      className="w-full flex flex-col items-center justify-center text-center px-6 py-12"
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl mx-auto space-y-3"
      >
        <h1
          id="header-title"
          className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100"
        >
          {title}
        </h1>
        {subtitle && (
          <p
            id="header-subtitle"
            className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed"
          >
            {subtitle}
          </p>
        )}
      </motion.div>
    </header>
  );
}
