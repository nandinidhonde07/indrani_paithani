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
    // Restore session from LocalStorage first so refreshes never lose active login
    const savedOwnerSession = JSON.parse(localStorage.getItem('indrani_owner_session') || 'null');
    const savedLocalUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    if (savedOwnerSession) {
      useAuthStore.getState().setAuth(savedOwnerSession, this.ROLES.OWNER);
    } else if (savedLocalUser) {
      useAuthStore.getState().setAuth(savedLocalUser, this.ROLES.BUYER);
    } else {
      useAuthStore.getState().setLoading(false);
    }

    onAuthStateChanged(auth, (user) => {
      if (user) {
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
        // Only clear auth if no local session exists
        const hasOwner = localStorage.getItem('indrani_owner_session');
        const hasUser = localStorage.getItem('currentUser');
        if (!hasOwner && !hasUser) {
          useAuthStore.getState().clearAuth();
        } else {
          useAuthStore.getState().setLoading(false);
        }
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
        const ownerObj = {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        };
        localStorage.setItem('indrani_owner_session', JSON.stringify(ownerObj));
        useAuthStore.getState().setAuth(ownerObj, this.ROLES.OWNER);
        
        ActivityLogger.log('Owner Login', `${user.displayName} logged in via Google.`, user.displayName);
        return { success: true, user: useAuthStore.getState().user };
      } else {
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
      localStorage.removeItem('currentUser');
      localStorage.removeItem('indrani_owner_session');
      await signOut(auth).catch(() => {});
      useAuthStore.getState().clearAuth();
      return { success: true };
    } catch (error) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('indrani_owner_session');
      useAuthStore.getState().clearAuth();
      return { success: true };
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
