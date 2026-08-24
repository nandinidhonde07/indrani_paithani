import { auth, googleProvider } from '../config/firebase.js';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, setPersistence, browserLocalPersistence, updateProfile } from 'firebase/auth';
import UserService from './UserService.js';

class AuthService {
  static initAuthListener(callback) {
    // Ensures persistence across refreshes
    setPersistence(auth, browserLocalPersistence).catch(console.error);

    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Sync with UserService to ensure they have a profile
        const users = await UserService.getUsers();
        const existing = users.find(u => u.email === firebaseUser.email);
        
        let profileData = {
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          photo: firebaseUser.photoURL || null,
        };

        if (!existing) {
          await UserService.saveUsers([...users, profileData]);
        } else {
          // Merge Firebase updates (e.g. photo changing) with local extra fields (phone, address)
          profileData = { ...existing, ...profileData };
          const updatedUsers = users.map(u => u.email === profileData.email ? profileData : u);
          await UserService.saveUsers(updatedUsers);
        }
        
        // Also update currentUser in localStorage for legacy compatibility
        localStorage.setItem('currentUser', JSON.stringify(profileData));
        localStorage.setItem('role', 'buyer'); // Enforce buyer role
        
        callback(profileData);
      } else {
        localStorage.removeItem('currentUser');
        const role = localStorage.getItem('role');
        if (role === 'buyer') {
          localStorage.removeItem('role'); // Don't remove owner
        }
        callback(null);
      }
    });
  }

  static async loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return { success: true, user: result.user };
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/popup-closed-by-user') {
        return { success: false, message: 'Google Sign-In was cancelled.' };
      }
      if (error.code === 'auth/unauthorized-domain') {
         return { success: false, message: 'This domain is not authorized for Google Sign-In. Please check your Firebase settings.' };
      }
      return { success: false, message: 'Google authentication failed. Please try again later.' };
    }
  }

  static async loginWithEmail(email, password) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: result.user };
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        return { success: false, message: 'Invalid email or password.' };
      }
      return { success: false, message: 'Failed to sign in. Please try again.' };
    }
  }

  static async signupWithEmail(email, password, name) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // Update Firebase profile with the provided name
      if (result.user) {
        await updateProfile(result.user, { displayName: name });
        // The auth listener will pick up the new name on next event or reload
      }
      return { success: true, user: result.user };
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/email-already-in-use') {
         return { success: false, message: 'An account with this email already exists.' };
      }
      return { success: false, message: 'Failed to create account.' };
    }
  }

  static async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Failed to log out.' };
    }
  }
}

export default AuthService;
