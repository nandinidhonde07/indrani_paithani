import { openDB } from 'idb';

const DB_NAME = 'IndraniMediaDB';
const STORE_NAME = 'media';
const DB_VERSION = 1;

class MediaService {
  static async getDB() {
    return openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      },
    });
  }

  static async uploadFile(file) {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        return reject(new Error('Only image files are allowed.'));
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target.result;
        try {
          const compressedBase64 = await this.compressImage(base64, file.type);
          
          const mediaRecord = {
            id: `media_${Date.now()}`,
            name: file.name,
            type: file.type,
            size: file.size,
            url: compressedBase64,
            createdAt: new Date().toISOString()
          };

          const db = await this.getDB();
          await db.put(STORE_NAME, mediaRecord);
          resolve(mediaRecord);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  static async compressImage(base64Str, mimeType, maxWidth = 1920, quality = 0.8) {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL(mimeType, quality));
      };
      img.onerror = () => resolve(base64Str);
    });
  }

  static async getAllMedia() {
    const db = await this.getDB();
    const all = await db.getAll(STORE_NAME);
    return all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  static async deleteMedia(id) {
    const db = await this.getDB();
    await db.delete(STORE_NAME, id);
  }
}

export default MediaService;
