import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";
import useAuthStore from "../store/useAuthStore";
import UserService from "./UserService";
import ActivityLogger from './ActivityLogger';

class AuthService {
  static ROLES = {
    OWNER: 'owner',
    BUYER: 'buyer',
    GUEST: 'guest'
  };

  static OWNER_EMAIL = 'nandini.dhonde1@gmail.com';

  static init() {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let profile = await UserService.getProfileByUid(firebaseUser.uid);
        if (!profile) {
          const rawName = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Valued Patron';
          const nameParts = rawName.trim().split(' ');
          profile = await UserService.createOrUpdateProfile({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: rawName,
            firstName: nameParts[0] || 'Patron',
            lastName: nameParts.length > 1 ? nameParts.slice(1).join(' ') : '',
            avatarUrl: firebaseUser.photoURL || '/assets/official_logo.jpg'
          });
        }
        const role = firebaseUser.email === this.OWNER_EMAIL ? this.ROLES.OWNER : this.ROLES.BUYER;
        useAuthStore.getState().setAuth(profile, role);
        if (role === this.ROLES.OWNER) {
          ActivityLogger.log('Owner Session Restored', `${profile.name} session resumed.`, profile.name);
        }
      } else {
        const savedOwnerSession = JSON.parse(localStorage.getItem('indrani_owner_session') || 'null');
        if (savedOwnerSession) {
          useAuthStore.getState().setAuth(savedOwnerSession, this.ROLES.OWNER);
        } else {
          localStorage.removeItem('currentUser');
          useAuthStore.getState().clearAuth();
        }
      }
    });
  }

  static async registerWithEmailPassword(data) {
    const {
      email,
      password,
      firstName = '',
      lastName = '',
      phone = '',
      altPhone = '',
      gender = 'Female',
      dob = '',
      anniversaryDate = '',
      street = '',
      landmark = '',
      pincode = '',
      city = '',
      state = '',
      country = 'India',
      deliveryInstructions = '',
      marketingOptIn = true
    } = data;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      if (fullName) {
        await updateProfile(user, { displayName: fullName }).catch(() => {});
      }

      let primaryAddressStr = '';
      let initialAddresses = [];
      if (street || pincode) {
        primaryAddressStr = `${street}${landmark ? ', ' + landmark : ''}${city ? ', ' + city : ''}${state ? ', ' + state : ''}${pincode ? ' - ' + pincode : ''}`;
        initialAddresses = [{
          id: 'addr_' + Date.now(),
          label: 'Home',
          street,
          landmark,
          pincode,
          city,
          state,
          country: country || 'India',
          deliveryInstructions,
          isDefault: true
        }];
      }

      const profileData = {
        uid: user.uid,
        auth_user_id: user.uid,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        name: fullName || user.email.split('@')[0],
        email: user.email,
        phone: phone || '',
        altPhone: altPhone || '',
        gender: gender || 'Female',
        dob: dob || '',
        anniversaryDate: anniversaryDate || '',
        marketingOptIn: marketingOptIn !== false,
        avatarUrl: user.photoURL || '/assets/official_logo.jpg',
        address: primaryAddressStr || 'No primary delivery address saved.',
        deliveryInstructions: deliveryInstructions || '',
        addresses: initialAddresses,
        authProvider: 'Email / Password'
      };

      const profile = await UserService.createOrUpdateProfile(profileData);
      const role = user.email === this.OWNER_EMAIL ? this.ROLES.OWNER : this.ROLES.BUYER;
      useAuthStore.getState().setAuth(profile, role);

      return { success: true, user: profile };
    } catch (error) {
      console.error("Firebase Email/Password Signup Error:", error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  static async loginWithEmailPassword(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let profile = await UserService.getProfileByUid(user.uid);
      if (!profile) {
        const rawName = user.displayName || user.email.split('@')[0];
        const nameParts = rawName.trim().split(' ');
        profile = await UserService.createOrUpdateProfile({
          uid: user.uid,
          email: user.email,
          name: rawName,
          firstName: nameParts[0] || 'Patron',
          lastName: nameParts.length > 1 ? nameParts.slice(1).join(' ') : '',
          avatarUrl: user.photoURL || '/assets/official_logo.jpg',
          authProvider: 'Email / Password'
        });
      }

      const role = user.email === this.OWNER_EMAIL ? this.ROLES.OWNER : this.ROLES.BUYER;
      useAuthStore.getState().setAuth(profile, role);

      return { success: true, user: profile };
    } catch (error) {
      console.error("Firebase Email/Password Login Error:", error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  static async loginBuyer() {
    return this.loginWithGoogle();
  }

  static async loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      let profile = await UserService.getProfileByUid(user.uid);
      if (!profile) {
        const rawName = user.displayName || user.email.split('@')[0];
        const nameParts = rawName.trim().split(' ');
        profile = await UserService.createOrUpdateProfile({
          uid: user.uid,
          email: user.email,
          name: rawName,
          firstName: nameParts[0] || 'Patron',
          lastName: nameParts.length > 1 ? nameParts.slice(1).join(' ') : '',
          avatarUrl: user.photoURL || '/assets/official_logo.jpg',
          authProvider: 'Google SSO'
        });
      }

      const role = user.email === this.OWNER_EMAIL ? this.ROLES.OWNER : this.ROLES.BUYER;
      useAuthStore.getState().setAuth(profile, role);

      return { success: true, user: profile };
    } catch (error) {
      console.error("Firebase Google Login Error:", error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  static async loginOwner() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (user.email === this.OWNER_EMAIL) {
        let profile = await UserService.getProfileByUid(user.uid);
        if (!profile) {
          profile = await UserService.createOrUpdateProfile({
            uid: user.uid,
            name: user.displayName || 'Owner',
            email: user.email,
            avatarUrl: user.photoURL || '/assets/official_logo.jpg'
          });
        }

        localStorage.setItem('indrani_owner_session', JSON.stringify(profile));
        useAuthStore.getState().setAuth(profile, this.ROLES.OWNER);

        ActivityLogger.log('Owner Login', `${user.displayName} logged in via Google.`, user.displayName);
        return { success: true, user: profile };
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
    if (!error) return "An unexpected error occurred.";
    const code = error.code || '';
    
    switch (code) {
      case 'auth/user-not-found':
        return "Account not found. Please create an account first.";
      case 'auth/wrong-password':
        return "Incorrect password. Please try again.";
      case 'auth/invalid-credential':
        return "Account not found or invalid credentials. Please check your email and password.";
      case 'auth/email-already-in-use':
        return "An account with this email address already exists. Please login instead.";
      case 'auth/weak-password':
        return "Password should be at least 6 characters long.";
      case 'auth/invalid-email':
        return "Please enter a valid email address.";
      case 'auth/popup-closed-by-user':
        return "Google Sign-In popup was closed before completion. Please try again.";
      case 'auth/popup-blocked':
        return "Google Sign-In popup was blocked by your browser. Please allow popups for this site.";
      case 'auth/unauthorized-domain':
        return "This domain is not authorized for Google Sign-In. Please check Firebase configuration.";
      case 'auth/network-request-failed':
        return "Network error. Please check your internet connection.";
      case 'auth/too-many-requests':
        return "Too many failed attempts. Please try again later.";
      default:
        return error.message || "Authentication failed. Please check your details and try again.";
    }
  }
}

export default AuthService;
