import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";
import useAuthStore from "../store/useAuthStore";
import ActivityLogger from './ActivityLogger';

class AuthService {
  static ROLES = {
    OWNER: 'owner',
    BUYER: 'buyer',
    GUEST: 'guest'
  };

  static OWNER_EMAIL = 'nandini.dhonde1@gmail.com';

  static init() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // If a user is logged in, determine their role based on email and where they are trying to access?
        // Actually, role should be inherent to the user.
        // If they are the owner email, give them OWNER role, else BUYER.
        const role = user.email === this.OWNER_EMAIL ? this.ROLES.OWNER : this.ROLES.BUYER;
        
        useAuthStore.getState().setAuth({
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        }, role);

        if (role === this.ROLES.OWNER) {
          ActivityLogger.log('Owner Session Restored', `${user.displayName} session resumed.`, user.displayName);
        }
      } else {
        useAuthStore.getState().clearAuth();
      }
    });
  }

  static async loginBuyer() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const role = user.email === this.OWNER_EMAIL ? this.ROLES.OWNER : this.ROLES.BUYER;
      
      useAuthStore.getState().setAuth({
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL
      }, role);
      
      return { success: true, user: useAuthStore.getState().user };
    } catch (error) {
      console.error("Buyer Login Error:", error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  static async loginOwner() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      if (user.email === this.OWNER_EMAIL) {
        useAuthStore.getState().setAuth({
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        }, this.ROLES.OWNER);
        
        ActivityLogger.log('Owner Login', `${user.displayName} logged in via Google.`, user.displayName);
        return { success: true, user: useAuthStore.getState().user };
      } else {
        // Unauthorized owner attempt
        await signOut(auth);
        useAuthStore.getState().clearAuth();
        return { success: false, error: "Access Denied: You are not authorized to access the Owner Portal." };
      }
    } catch (error) {
      console.error("Owner Login Error:", error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  static async logout() {
    try {
      const { user, role } = useAuthStore.getState();
      if (user && role === this.ROLES.OWNER) {
        ActivityLogger.log('Owner Logout', `${user.name} logged out.`, user.name);
      }
      await signOut(auth);
      useAuthStore.getState().clearAuth();
      return { success: true };
    } catch (error) {
      console.error("Logout Error:", error);
      return { success: false, error: "Failed to log out. Please try again." };
    }
  }

  static getErrorMessage(error) {
    if (error.code === 'auth/popup-closed-by-user') {
      return "Login popup was closed before completion. Please try again.";
    }
    if (error.code === 'auth/popup-blocked') {
      return "Login popup was blocked by your browser. Please allow popups for this site.";
    }
    if (error.code === 'auth/unauthorized-domain') {
      return "This domain is not authorized for Google Sign-In. Please check Firebase settings.";
    }
    if (error.code === 'auth/network-request-failed') {
      return "Network error. Please check your internet connection.";
    }
    return error.message || "An unexpected authentication error occurred.";
  }
}

export default AuthService;
