# Deployment Guide for Vercel

## Option 1: Deploy using Vercel CLI (Quickest)

1. Install Vercel CLI (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from your project directory:
   ```bash
   vercel
   ```
   - Follow the prompts:
     - Set up and deploy? **Yes**
     - Which scope? Choose your account
     - Link to existing project? **No** (for first deployment)
     - What's your project's name? **playitloid** (or choose a name)
     - In which directory is your code located? **./** (current directory)
   
4. For production deployment:
   ```bash
   vercel --prod
   ```

## Option 2: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub** (if not already):
   ```bash
   # Create a new repository on GitHub, then:
   git remote add origin https://github.com/YOUR_USERNAME/playitloid.git
   git branch -M main
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up or log in
   - Click "Add New Project"
   - Import your GitHub repository

3. **Configure Project**:
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: **./**
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
   - Install Command: `npm install` (auto-detected)

4. **Environment Variables** (if needed):
   - Currently, Firebase config is hardcoded (public config, so it's fine)
   - If you want to use environment variables later, add them in Vercel dashboard:
     - Go to Project Settings → Environment Variables
     - Add any required variables

5. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at: `https://your-project-name.vercel.app`

## Post-Deployment Steps

1. **Test the deployment**:
   - Visit your Vercel URL
   - Try logging in with: `albert@nrgug.radio` / `123456`
   - Or create admin account: `admin@example.com` / `admin123`

2. **Create user accounts**:
   - Visit: `https://your-app.vercel.app/api/create-admin` (POST request)
   - Visit: `https://your-app.vercel.app/api/create-user` (POST request)
   - Or use the signup page at `/signup`

3. **Custom Domain** (Optional):
   - Go to Project Settings → Domains
   - Add your custom domain

## Important Notes

- ✅ Firebase configuration is already included (public config)
- ✅ All dependencies are in `package.json`
- ✅ Build should work out of the box
- ✅ No environment variables needed for basic setup
- ⚠️ Make sure your Firebase project allows your Vercel domain

## Firebase Security Rules

Make sure your Firestore security rules allow access. You may need to update them in Firebase Console:
- Go to Firebase Console → Firestore Database → Rules
- Adjust rules as needed for your use case

## Troubleshooting

If deployment fails:
1. Check build logs in Vercel dashboard
2. Ensure `npm run build` works locally:
   ```bash
   npm run build
   ```
3. Check for any missing dependencies
4. Verify Firebase config is correct

