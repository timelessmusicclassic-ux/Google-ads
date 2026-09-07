import { useState, useEffect, FormEvent } from 'react';
import { Send, Trash2, MessageSquare, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  createWelcomeNote,
  subscribeToUserNotes,
  deleteWelcomeNote,
} from '../services/firestoreService';
import { WelcomeNote } from '../types';

export default function WelcomeNotes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<WelcomeNote[]>([]);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setNotes([]);
      setLoadingNotes(false);
      return;
    }

    setLoadingNotes(true);
    const unsubscribe = subscribeToUserNotes(user.uid, (fetchedNotes) => {
      setNotes(fetchedNotes);
      setLoadingNotes(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || submitting) return;

    setSubmitting(true);
    setErrorMsg(null);
    try {
      await createWelcomeNote(message);
      setMessage('');
    } catch (err: unknown) {
      console.error('Failed to create note:', err);
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save note');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (noteId: string) => {
    try {
      await deleteWelcomeNote(noteId);
    } catch (err: unknown) {
      console.error('Failed to delete note:', err);
      setErrorMsg(err instanceof Error ? err.message : 'Failed to delete note');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div
      id="welcome-notes-container"
      className="w-full max-w-md mx-auto bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm space-y-5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
          <h2 id="notes-title" className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Your Firestore Notes
          </h2>
        </div>
        <span
          id="notes-count-badge"
          className="text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 px-2 py-0.5 rounded-full"
        >
          {notes.length} {notes.length === 1 ? 'note' : 'notes'}
        </span>
      </div>

      {errorMsg && (
        <div
          id="notes-error"
          className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400"
        >
          {errorMsg}
        </div>
      )}

      {/* Note Creation Form */}
      <form onSubmit={handleSubmit} id="new-note-form" className="space-y-2">
        <div className="relative">
          <input
            id="note-message-input"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a welcome note or message..."
            maxLength={500}
            disabled={submitting}
            className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 disabled:opacity-60 pr-10"
          />
          <button
            id="submit-note-btn"
            type="submit"
            disabled={!message.trim() || submitting}
            className="absolute right-1.5 top-1.5 p-1.5 rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:opacity-90 disabled:opacity-30 transition-opacity cursor-pointer"
            title="Save Note to Firestore"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
        <div className="flex justify-between items-center text-[11px] text-neutral-400 px-1">
          <span>Synced directly with Cloud Firestore</span>
          <span>{message.length}/500</span>
        </div>
      </form>

      {/* Notes List */}
      <div id="notes-list" className="space-y-2.5 pt-1">
        {loadingNotes ? (
          <div className="py-6 flex items-center justify-center text-xs text-neutral-400 gap-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-400" />
            <span>Loading notes...</span>
          </div>
        ) : notes.length === 0 ? (
          <div
            id="notes-empty-state"
            className="py-6 text-center rounded-lg border border-dashed border-neutral-200 dark:border-neutral-800 text-neutral-400 text-xs"
          >
            No notes yet. Add your first note above!
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              id={`note-${note.id}`}
              className="group p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors flex items-start justify-between gap-3"
            >
              <div className="space-y-1 min-w-0">
                <p className="text-xs text-neutral-800 dark:text-neutral-200 break-words leading-relaxed">
                  {note.message}
                </p>
                <p className="text-[10px] text-neutral-400">
                  {new Date(note.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  •{' '}
                  {new Date(note.createdAt).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <button
                id={`delete-note-${note.id}`}
                onClick={() => handleDelete(note.id)}
                title="Delete note"
                className="opacity-60 hover:opacity-100 p-1 text-neutral-400 hover:text-rose-500 rounded transition-colors cursor-pointer shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
