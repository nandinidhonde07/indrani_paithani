import useAuthStore from '../store/useAuthStore';
import { auth } from '../config/firebase';

class UserService {
  static PROFILES_KEY = 'indrani_profiles_db';
  static CURRENT_USER_KEY = 'currentUser';

  static _getProfilesDb() {
    try {
      return JSON.parse(localStorage.getItem(this.PROFILES_KEY) || '{}');
    } catch (e) {
      return {};
    }
  }

  static _saveProfilesDb(db) {
    localStorage.setItem(this.PROFILES_KEY, JSON.stringify(db));
  }

  static _normalizeUserSchema(user) {
    if (!user || !user.uid) return null;
    const uid = user.uid;
    const rawName = user.name || user.displayName || user.email?.split('@')[0] || 'Valued Patron';
    const nameParts = rawName.trim().split(' ');
    const firstName = user.firstName || nameParts[0] || 'Patron';
    const lastName = user.lastName || (nameParts.length > 1 ? nameParts.slice(1).join(' ') : '');
    const fullName = `${firstName} ${lastName}`.trim() || rawName;

    return {
      id: user.id || `profile_${uid}`,
      auth_user_id: uid,
      uid: uid,
      firstName,
      lastName,
      name: fullName,
      fullName: fullName,
      email: user.email || '',
      phone: user.phone || 'Not added yet',
      altPhone: user.altPhone || '',
      mobileVerified: !!user.mobileVerified,
      emailVerified: !!user.emailVerified,
      gender: user.gender || 'Not specified',
      dob: user.dob || '',
      anniversaryDate: user.anniversaryDate || '',
      marketingOptIn: user.marketingOptIn !== false,
      avatarUrl: user.avatarUrl || user.photoURL || '/assets/official_logo.jpg',
      address: user.address || 'No saved address',
      deliveryInstructions: user.deliveryInstructions || '',
      addresses: Array.isArray(user.addresses) ? user.addresses : [],
      authProvider: user.authProvider || (user.photoURL?.includes('google') ? 'Google SSO' : 'Email / Password'),
      createdAt: user.createdAt || new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };
  }

  static async getProfileByUid(uid) {
    if (!uid) return null;
    const db = this._getProfilesDb();
    if (db[uid]) {
      return this._normalizeUserSchema(db[uid]);
    }
    return null;
  }

  static async createOrUpdateProfile(profileData) {
    if (!profileData || !profileData.uid) return null;
    const uid = profileData.uid;
    const db = this._getProfilesDb();
    const existing = db[uid] || {};
    const merged = { ...existing, ...profileData, uid, auth_user_id: uid };
    const normalized = this._normalizeUserSchema(merged);
    
    db[uid] = normalized;
    this._saveProfilesDb(db);
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(normalized));
    
    return normalized;
  }

  static async getUsers() {
    const db = this._getProfilesDb();
    return Object.values(db).map(p => this._normalizeUserSchema(p));
  }

  static async getCurrentUser() {
    const authStoreUser = useAuthStore.getState().user;
    const firebaseUser = auth.currentUser;
    const uid = authStoreUser?.uid || firebaseUser?.uid;

    if (!uid) {
      const localProfile = JSON.parse(localStorage.getItem(this.CURRENT_USER_KEY) || 'null');
      if (localProfile && localProfile.uid) {
        return this._normalizeUserSchema(localProfile);
      }
      return null;
    }

    const dbProfile = await this.getProfileByUid(uid);
    if (dbProfile) {
      return dbProfile;
    }

    // Create fresh profile if none exists for this UID
    const baseInfo = {
      uid,
      email: authStoreUser?.email || firebaseUser?.email || '',
      name: authStoreUser?.name || firebaseUser?.displayName || '',
      avatarUrl: authStoreUser?.photoURL || firebaseUser?.photoURL || '/assets/official_logo.jpg'
    };
    return await this.createOrUpdateProfile(baseInfo);
  }

  static async updateCurrentUser(updates) {
    const current = await this.getCurrentUser();
    if (!current || !current.uid) {
      throw new Error("No authenticated user active.");
    }

    const updated = await this.createOrUpdateProfile({
      ...current,
      ...updates,
      uid: current.uid
    });

    const authUser = useAuthStore.getState().user;
    if (authUser) {
      useAuthStore.getState().setAuth({ ...authUser, ...updated }, useAuthStore.getState().role);
    }

    return updated;
  }

  // Address Management Methods
  static async addAddress(newAddrData) {
    const user = await this.getCurrentUser();
    if (!user) return null;

    const addresses = Array.isArray(user.addresses) ? [...user.addresses] : [];
    const newAddressObj = {
      id: 'addr_' + Date.now(),
      label: newAddrData.label || 'Home',
      street: newAddrData.street || '',
      landmark: newAddrData.landmark || '',
      pincode: newAddrData.pincode || '',
      city: newAddrData.city || '',
      state: newAddrData.state || '',
      country: newAddrData.country || 'India',
      deliveryInstructions: newAddrData.deliveryInstructions || '',
      isDefault: addresses.length === 0 ? true : !!newAddrData.isDefault
    };

    if (newAddressObj.isDefault) {
      addresses.forEach(a => a.isDefault = false);
    }

    addresses.push(newAddressObj);
    const primaryAddressStr = `${newAddressObj.street}, ${newAddressObj.city}, ${newAddressObj.state} - ${newAddressObj.pincode}`;

    return await this.updateCurrentUser({
      addresses,
      address: newAddressObj.isDefault ? primaryAddressStr : user.address,
      deliveryInstructions: newAddressObj.isDefault ? newAddressObj.deliveryInstructions : user.deliveryInstructions
    });
  }

  static async setDefaultAddress(addressId) {
    const user = await this.getCurrentUser();
    if (!user || !Array.isArray(user.addresses)) return null;

    let selectedAddressStr = user.address;
    let selectedDeliveryNotes = user.deliveryInstructions;

    const updatedAddresses = user.addresses.map(a => {
      const isMatch = a.id === addressId;
      if (isMatch) {
        selectedAddressStr = `${a.street}, ${a.city}, ${a.state} - ${a.pincode}`;
        selectedDeliveryNotes = a.deliveryInstructions || selectedDeliveryNotes;
      }
      return { ...a, isDefault: isMatch };
    });

    return await this.updateCurrentUser({
      addresses: updatedAddresses,
      address: selectedAddressStr,
      deliveryInstructions: selectedDeliveryNotes
    });
  }

  static async deleteAddress(addressId) {
    const user = await this.getCurrentUser();
    if (!user || !Array.isArray(user.addresses)) return null;

    const filtered = user.addresses.filter(a => a.id !== addressId);
    if (filtered.length > 0 && !filtered.some(a => a.isDefault)) {
      filtered[0].isDefault = true;
    }

    const defaultAddr = filtered.find(a => a.isDefault);
    const newAddressStr = defaultAddr 
      ? `${defaultAddr.street}, ${defaultAddr.city}, ${defaultAddr.state} - ${defaultAddr.pincode}`
      : 'No saved address';

    return await this.updateCurrentUser({
      addresses: filtered,
      address: newAddressStr
    });
  }
}

export default UserService;
