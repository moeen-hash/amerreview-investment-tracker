# 🚀 Deployment Guide - Go Live with Your App

This guide will help you deploy your Investment Tracker app to production with a custom domain.

---

## 📋 What You Need

- ✅ MongoDB Atlas (already set up!)
- 🔄 GitHub account (free)
- 🔄 Vercel account (free)
- 🔄 Railway account (free $5/month credit)
- 💰 Domain name (optional, ~$10-15/year)

---

## Architecture Overview

```
Your Domain (yourdomain.com)
         ↓
    Frontend (Vercel)
         ↓
    Backend (Railway)
         ↓
    Database (MongoDB Atlas) ✅
```

---

## Step 1: Prepare Code for GitHub

### 1.1 Create `.gitignore` file

Create a file named `.gitignore` in your project root:

```
# Dependencies
node_modules/
server/node_modules/

# Environment files (IMPORTANT - Never commit passwords!)
.env
server/.env

# Build outputs
dist/
server/dist/
build/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
```

### 1.2 Initialize Git

Open terminal in your project folder:

```bash
cd c:\Users\moeen\Downloads\AmerReview
git init
git add .
git commit -m "Initial commit - Investment Tracker App"
```

### 1.3 Push to GitHub

1. Go to https://github.com
2. Click **"New repository"**
3. Name it: `amerreview-investment-tracker`
4. **Don't** initialize with README
5. Click **"Create repository"**

Then run these commands:

```bash
git remote add origin https://github.com/YOUR_USERNAME/amerreview-investment-tracker.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend (Railway)

### 2.1 Sign Up

1. Go to https://railway.app
2. Click **"Start a New Project"**
3. Sign up with GitHub
4. Authorize Railway to access your repos

### 2.2 Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository: `amerreview-investment-tracker`
4. Railway will auto-detect Node.js

### 2.3 Configure Backend Service

1. Click on your service
2. Go to **"Settings"**
3. Set **Root Directory**: `server`
4. Set **Build Command**: `npm install && npm run build`
5. Set **Start Command**: `npm start`

### 2.4 Add Environment Variables

Click **"Variables"** tab and add:

```env
PORT=5000
MONGODB_URI=mongodb+srv://moeen_db_user:Password123!@cluster0.at0xgqd.mongodb.net/amerreview?retryWrites=true&w=majority
NODE_ENV=production
APP_PASSWORD=mypassword123
```

**⚠️ IMPORTANT**: Use your actual MongoDB connection string!

### 2.5 Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Railway will give you a URL like: `https://amerreview-production.up.railway.app`
4. Test it: `https://your-url.railway.app/api/health` - should return `{"status":"OK"}`

### 2.6 Get Your Backend URL

Copy your Railway URL - you'll need it for the frontend!

Example: `https://amerreview-production.up.railway.app`

---

## Step 3: Deploy Frontend (Vercel)

### 3.1 Update Environment Variable

Before deploying, you need to update your frontend to use the Railway backend URL.

**Option A: Use Vercel Environment Variables** (Recommended)

Just note your Railway URL - we'll add it in Vercel settings.

**Option B: Update `.env` file**

Update your `.env` file:

```env
VITE_API_URL=https://your-backend.railway.app/api
```

Commit and push:

```bash
git add .env
git commit -m "Update API URL for production"
git push
```

### 3.2 Sign Up on Vercel

1. Go to https://vercel.com
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel

### 3.3 Import Project

1. Click **"Add New..." → "Project"**
2. Import your GitHub repo: `amerreview-investment-tracker`
3. Click **"Import"**

### 3.4 Configure Build Settings

Vercel should auto-detect Vite. Verify these settings:

- **Framework Preset**: Vite
- **Root Directory**: `./` (leave as root)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 3.5 Add Environment Variable

Click **"Environment Variables"** and add:

**Key**: `VITE_API_URL`  
**Value**: `https://your-backend.railway.app/api`

(Use your actual Railway URL from Step 2.6)

### 3.6 Deploy

1. Click **"Deploy"**
2. Wait 1-2 minutes
3. Vercel will give you a URL like: `https://amerreview-investment-tracker.vercel.app`

### 3.7 Test Your App

1. Visit your Vercel URL
2. You should see the login page
3. Enter password: `mypassword123`
4. Create a test investment
5. Refresh the page - data should persist!

---

## Step 4: Custom Domain (Optional)

### 4.1 Buy a Domain

Recommended providers:
- **Namecheap**: https://www.namecheap.com (~$10/year)
- **GoDaddy**: https://www.godaddy.com (~$12/year)
- **Cloudflare**: https://www.cloudflare.com (~$10/year)

Example domains:
- `amerreview.com`
- `myinvestmenttracker.com`
- `yourname-trading.com`

### 4.2 Add Domain to Vercel

1. Go to your Vercel project
2. Click **"Settings" → "Domains"**
3. Enter your domain: `yourdomain.com`
4. Click **"Add"**

### 4.3 Update DNS Records

Vercel will show you DNS records to add. Go to your domain provider and add:

**Type**: `A`  
**Name**: `@`  
**Value**: `76.76.21.21` (Vercel's IP)

**Type**: `CNAME`  
**Name**: `www`  
**Value**: `cname.vercel-dns.com`

### 4.4 Wait for DNS Propagation

- Usually takes 10-60 minutes
- Can take up to 24 hours
- Check status at: https://www.whatsmydns.net

### 4.5 Enable HTTPS

Vercel automatically provides free SSL certificate once DNS is configured.

---

## Step 5: Final Configuration

### 5.1 Update MongoDB Network Access

1. Go to MongoDB Atlas
2. Click **"Network Access"**
3. Make sure **"Allow Access from Anywhere"** is enabled
   - Or add Railway's IP addresses (they provide these in settings)

### 5.2 Test Everything

Visit your domain (or Vercel URL):

1. ✅ Login page loads
2. ✅ Can log in with password
3. ✅ Can create investments
4. ✅ Data persists after refresh
5. ✅ Can move items between columns
6. ✅ Can view item details
7. ✅ Archive page works
8. ✅ Sign out works

---

## 📊 Your Live URLs

After deployment, you'll have:

- **Frontend**: `https://yourdomain.com` (or `https://your-app.vercel.app`)
- **Backend**: `https://your-app.railway.app`
- **Database**: MongoDB Atlas (already live)

---

## 🔧 Updating Your Live App

Whenever you make changes:

```bash
git add .
git commit -m "Description of changes"
git push
```

- Vercel automatically rebuilds frontend
- Railway automatically rebuilds backend
- Takes 1-2 minutes to update

---

## 💰 Cost Breakdown

### Free Options
- ✅ MongoDB Atlas: **FREE** (M0 tier)
- ✅ Vercel: **FREE** (hobby tier)
- ✅ Railway: **$5/month credit FREE** (enough for small apps)

### Paid Options
- 💰 Domain name: **$10-15/year**
- 💰 Railway (if you exceed free credit): **~$5-10/month**

**Total**: Can run completely free, or ~$1-2/month with domain

---

## 🐛 Troubleshooting

### Frontend shows "Connection error"
- Check backend URL in Vercel environment variables
- Make sure Railway backend is running
- Test backend health: `https://your-backend.railway.app/api/health`

### Backend won't start on Railway
- Check logs in Railway dashboard
- Verify environment variables are set correctly
- Make sure `npm run build` works locally

### Database connection error
- Check MongoDB connection string in Railway variables
- Verify MongoDB Network Access allows all IPs
- Test connection locally first

### Domain not working
- Wait 24 hours for DNS propagation
- Check DNS records at https://www.whatsmydns.net
- Verify DNS records match Vercel's requirements

---

## 🎯 Security Checklist

Before going live:

- ✅ `.env` files are in `.gitignore`
- ✅ Never commit passwords to Git
- ✅ Change default password in Railway env variables
- ✅ MongoDB connection string is secure
- ✅ Use strong password for app login
- ✅ HTTPS is enabled (automatic with Vercel)

---

## 🚀 You're Live!

Your investment tracker is now:
- ✅ Accessible from anywhere in the world
- ✅ Secure with HTTPS
- ✅ Data persisted in cloud database
- ✅ Automatically backed up
- ✅ Running 24/7

**Share your app**: Send your URL to anyone who needs access!

---

## 📞 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **MongoDB Docs**: https://www.mongodb.com/docs

**Pro tip**: Keep this guide handy for future updates! 📝
