# Login Credentials

## How to Create Login Accounts

You have two options to create login credentials:

### Option 1: Use the Signup Page (Recommended)

1. Go to `/signup` in your browser
2. Enter an email and password (minimum 6 characters)
3. Click "Sign up"
4. You'll be redirected to login page
5. Use those credentials to sign in at `/login`

### Option 2: Create via Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `playitloud-1e8fe`
3. Go to **Authentication** > **Users**
4. Click **Add user**
5. Enter email and password
6. Click **Add user**
7. Use those credentials to login at `/login`

## Default Test Credentials

**✅ Admin account is ready to use:**

**Email:** `admin@example.com`  
**Password:** `admin123`

This account has been created and is ready to use. You can login directly at `/login` with these credentials.

## Important Notes

- Password must be at least 6 characters
- Email must be valid format
- Each user needs to be created before they can login
- The middleware will redirect unauthenticated users to `/login`

