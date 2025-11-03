# Login Credentials & Testing Guide

## 🔐 Test Credentials

### User Account:
- **Email:** `albert@nrgug.radio`
- **Password:** `123456`

### Admin Account:
- **Email:** `admin@example.com`
- **Password:** `admin123`

## 🚀 Quick Setup (First Time Only)

When you first deploy to Vercel, you need to create these accounts. Visit these URLs (POST requests):

1. **Create Admin User:**
   ```
   https://playitloud.vercel.app/api/create-admin
   ```
   (Use a tool like Postman, or run: `curl -X POST https://playitloud.vercel.app/api/create-admin`)

2. **Create User Account:**
   ```
   https://playitloud.vercel.app/api/create-user
   ```
   (Use a tool like Postman, or run: `curl -X POST https://playitloud.vercel.app/api/create-user`)

## ✅ Testing Login

1. Go to: `https://playitloud.vercel.app/login`
2. Enter credentials:
   - Email: `albert@nrgug.radio`
   - Password: `123456`
3. Click "Sign in"
4. You should be redirected to the dashboard

## 🔍 Troubleshooting

If login doesn't work:
1. Make sure you've created the users first (see Quick Setup above)
2. Check browser console for errors
3. Verify Firebase Authentication is enabled in Firebase Console
4. Check that your Vercel domain is allowed in Firebase Authentication settings

## 📝 Firebase Console Steps

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: `playitloud-1e8fe`
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Make sure your Vercel domain is listed (it should auto-add)

