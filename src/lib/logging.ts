import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const logUserActivity = async (userId: string | undefined, action: string, details?: any) => {
  try {
    // If no user ID is provided (anonymous user), use 'anonymous'
    const uid = userId || 'anonymous';
    
    // Firestore doesn't accept 'undefined', so we default to null if details is missing
    const safeDetails = details === undefined ? null : details;

    await addDoc(collection(db, 'user_logs'), {
      userId: uid,
      action,
      details: safeDetails,
      timestamp: serverTimestamp(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
    });
  } catch (error) {
    console.error("Error logging activity:", error);
  }
};
