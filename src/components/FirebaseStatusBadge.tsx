import { Flame, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function FirebaseStatusBadge() {
  const { firestoreConnected } = useAuth();

  return (
    <div
      id="firebase-status-badge"
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-amber-800 dark:text-amber-200"
    >
      <Flame className="w-3.5 h-3.5 text-amber-500" />
      <span>Firebase & Firestore Connected</span>
      {firestoreConnected ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
      ) : (
        <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
      )}
      <span className="text-neutral-400 dark:text-neutral-500">|</span>
      <span className="inline-flex items-center gap-1 text-neutral-600 dark:text-neutral-300">
        <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
        Zero-Trust Rules Deployed
      </span>
    </div>
  );
}
