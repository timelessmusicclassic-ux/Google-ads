import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreError';
import { UserProfile, WelcomeNote } from '../types';

export async function syncUserProfile(profile: Omit<UserProfile, 'createdAt'>): Promise<void> {
  const currentUid = auth.currentUser?.uid;
  if (!currentUid || currentUid !== profile.userId) {
    throw new Error('Authentication required to sync profile');
  }

  const userPath = `users/${profile.userId}`;
  try {
    const docRef = doc(db, 'users', profile.userId);
    const existingSnap = await getDoc(docRef);
    
    const payload: UserProfile = {
      userId: profile.userId,
      displayName: profile.displayName.slice(0, 100),
      createdAt: existingSnap.exists()
        ? (existingSnap.data() as UserProfile).createdAt || new Date().toISOString()
        : new Date().toISOString(),
    };

    if (profile.email) {
      payload.email = profile.email.slice(0, 200);
    }
    if (profile.photoURL) {
      payload.photoURL = profile.photoURL.slice(0, 500);
    }

    await setDoc(docRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, userPath);
  }
}

export async function createWelcomeNote(message: string): Promise<string> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('You must be signed in to create a note');
  }

  const trimmedMessage = message.trim().slice(0, 500);
  if (!trimmedMessage) {
    throw new Error('Message cannot be empty');
  }

  const noteId = `note_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const notePath = `welcome_notes/${noteId}`;

  const newNote: Omit<WelcomeNote, 'id'> = {
    userId: user.uid,
    authorName: (user.displayName || 'Anonymous User').slice(0, 100),
    message: trimmedMessage,
    createdAt: new Date().toISOString(),
  };

  try {
    const noteDoc = doc(db, 'welcome_notes', noteId);
    await setDoc(noteDoc, newNote);
    return noteId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, notePath);
  }
}

export function subscribeToUserNotes(
  userId: string,
  onNotes: (notes: WelcomeNote[]) => void
): Unsubscribe {
  const notesPath = 'welcome_notes';
  const q = query(collection(db, notesPath), where('userId', '==', userId));

  return onSnapshot(
    q,
    (snapshot) => {
      const notes: WelcomeNote[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Omit<WelcomeNote, 'id'>;
        notes.push({
          id: docSnap.id,
          ...data,
        });
      });
      // Sort client-side by creation timestamp descending
      notes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onNotes(notes);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, notesPath);
    }
  );
}

export async function deleteWelcomeNote(noteId: string): Promise<void> {
  const notePath = `welcome_notes/${noteId}`;
  try {
    await deleteDoc(doc(db, 'welcome_notes', noteId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, notePath);
  }
}
