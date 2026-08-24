# Google Authentication Setup Guide

This guide provides exact step-by-step instructions for creating a Firebase project and enabling Google Authentication for the Indrani Paithani website.

## 1. Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** (or **Create a project**).
3. Enter a project name (e.g., `Indrani-Paithani-Auth`).
4. Click **Continue**. (You can choose whether to enable Google Analytics or not; it is optional).
5. Click **Create project** and wait for it to finish. Click **Continue** when done.

## 2. Register Your Web App
1. On your Firebase project overview page, click the **Web icon** (</>) to add a new web app.
2. Enter an app nickname (e.g., `indrani-paithani-web`).
3. Leave "Also set up Firebase Hosting" unchecked.
4. Click **Register app**.
5. You will see a `firebaseConfig` object containing your keys. **Keep this tab open**, we will need these keys in Step 6.

## 3. Enable Authentication
1. In the left-hand menu, under **Build**, click **Authentication**.
2. Click **Get started**.

## 4. Enable Google Provider
1. In the Authentication dashboard, go to the **Sign-in method** tab.
2. Click **Add new provider** and select **Google**.
3. Toggle the **Enable** switch in the top right.
4. Set the **Project support email** to your email address.
5. Click **Save**.

## 5. Configure Authorized Domains
By default, `localhost` and your Firebase hosting domains are authorized. To ensure Google Login works on your live production website (e.g., Render):
1. In the **Authentication** dashboard, go to the **Settings** tab.
2. Click on **Authorized domains** in the sidebar.
3. Click **Add domain**.
4. Enter your production domain (e.g., `indrani-paithani.onrender.com`).
5. Click **Add**.

## 6. Add Environment Variables
Do **not** hardcode credentials in the source code. We use environment variables to keep them secure.
1. In the root of your project directory (`C:\Users\seema\Downloads\indrani\PAITHANI_SAREES`), create a file named exactly `.env.local`
2. Add the following keys, replacing the placeholders with the values from your `firebaseConfig` (from Step 2):

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
```
*(Note: Do not put quotes around the values).*

## 7. Run Locally
Because `.env.local` is already in `.gitignore`, it will not be committed to GitHub.
Run your development server locally:
```bash
npm run dev
```
Test the Google login flow.

## 8. Configure the Production Domain
When you are ready to deploy (e.g., on Render or Vercel), you **must** add these exact same environment variables to the Environment Settings of your hosting provider's dashboard.

Once configured, the Google Sign-in flow will seamlessly work on your live production app!
