# Google Authentication Setup Guide

This guide explains how to properly configure Firebase Google Authentication for the Indrani Paithani website.

## 1. Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** (or create a project).
3. Enter a project name (e.g., `indrani-paithani`).
4. Disable Google Analytics (optional, for simplicity) and click **Create Project**.

## 2. Register Your Web App
1. On the Project Overview page, click the **Web** icon (</>) to add a web app.
2. Enter an app nickname (e.g., `indrani-paithani-web`).
3. Click **Register app**.
4. Firebase will show your configuration object. You don't need to copy the code, but you will need the values in Step 4.

## 3. Enable Google Authentication
1. In the left sidebar, click **Build > Authentication**.
2. Click **Get Started**.
3. Go to the **Sign-in method** tab.
4. Click **Add new provider** and select **Google**.
5. Enable the toggle in the top right.
6. Provide a **Project support email** (your email).
7. Click **Save**.

## 4. Add Authorized Domains (Crucial for Production)
For Google Sign-In to work on your live website, you MUST authorize your domain.
1. In the Authentication section, go to the **Settings** tab.
2. Click on **Authorized domains**.
3. Click **Add domain**.
4. Enter your production domain: `indrani-paithani.onrender.com` (and any custom domain you add later).
5. Click **Add**.
*(Note: `localhost` is authorized by default for local development).*

## 5. Add Environment Variables to Render
Your code uses environment variables to securely load Firebase credentials. You must add these variables in your Render Dashboard.

1. Go to your Render Dashboard and select your Web Service.
2. Go to the **Environment** tab.
3. Add the following variables. (You can find these values in Firebase Console -> Project Settings -> General -> Your apps -> SDK setup and configuration).

```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 6. Deploy
After saving the environment variables on Render, you may need to trigger a manual deploy if it doesn't start automatically. Render will inject these variables during the build process, and Google Sign-In will begin working.
