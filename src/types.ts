export interface UserProfile {
  userId: string;
  displayName: string;
  email?: string;
  photoURL?: string;
  createdAt: string;
}

export interface WelcomeNote {
  id: string;
  userId: string;
  authorName: string;
  message: string;
  createdAt: string;
}
