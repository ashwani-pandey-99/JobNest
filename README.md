# Job Portal Deployment Guide

This project is a MERN-style job portal with:

- `frontend/`: React + Vite app
- `backend/`: Express + MongoDB API

## Best Platform

The best deployment setup for this codebase is:

- Frontend: Vercel
- Backend: Render Web Service
- Database: MongoDB Atlas
- File uploads: Cloudinary

Why this combo works well:

- Vercel is excellent for Vite frontend deployments.
- Render is simple and reliable for long-running Express servers.
- MongoDB Atlas is the standard hosted option for MongoDB.
- Cloudinary is strongly recommended because local file storage on cloud platforms is not reliable for persistent uploads.

## Before You Deploy

Make sure you have:

1. A GitHub repository with this project pushed to it.
2. A MongoDB Atlas database and connection string.
3. A Cloudinary account if you want uploaded profile images, resumes, and company logos to persist correctly.

## Environment Variables

### Backend

Create `backend/.env` using `backend/.env.example` as a reference:

```env
PORT=8000
NODE_ENV=production
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority
SECRET_KEY=replace-with-a-long-random-secret
CLIENT_URL=https://your-frontend-domain.vercel.app
COOKIE_SAME_SITE=none
COOKIE_SECURE=true
CLOUD_NAME=your-cloudinary-cloud-name
API_KEY=your-cloudinary-api-key
API_SECRET=your-cloudinary-api-secret
```

Notes:

- `CLIENT_URL` must match your deployed frontend URL exactly.
- Use `COOKIE_SAME_SITE=none` and `COOKIE_SECURE=true` when frontend and backend are on different domains.
- If you do not configure Cloudinary, uploaded files may be stored on the server filesystem, which is not a good production setup on Render.

### Frontend

Create `frontend/.env` using `frontend/.env.example` as a reference:

```env
VITE_API_BASE_URL=https://your-backend-service.onrender.com
```

## Step-by-Step Deployment

### Step 1: Push the project to GitHub

Initialize git if needed, then push:

```powershell
git init
git add .
git commit -m "Prepare project for deployment"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

If the repo already exists, just commit and push your latest code.

### Step 2: Create MongoDB Atlas database

1. Sign in to MongoDB Atlas.
2. Create a cluster.
3. Create a database user.
4. Add your IP access rule.
5. Copy the connection string.
6. Replace the placeholders with your database username, password, and database name.

Save that value for `MONGO_URI`.

### Step 3: Create Cloudinary account

1. Create a Cloudinary account.
2. Open your dashboard.
3. Copy:
   - `cloud_name`
   - `api_key`
   - `api_secret`

Save these for your backend environment variables.

### Step 4: Deploy the backend on Render

1. Open Render.
2. Click `New +`.
3. Choose `Web Service`.
4. Connect your GitHub repository.
5. Set the root directory to `backend`.
6. Use these settings:

```txt
Build Command: npm install
Start Command: npm start
```

7. Add these environment variables in Render:

```txt
NODE_ENV=production
PORT=8000
MONGO_URI=your-mongodb-atlas-connection-string
SECRET_KEY=your-random-secret
CLIENT_URL=https://your-frontend-domain.vercel.app
COOKIE_SAME_SITE=none
COOKIE_SECURE=true
CLOUD_NAME=your-cloudinary-cloud-name
API_KEY=your-cloudinary-api-key
API_SECRET=your-cloudinary-api-secret
```

8. Deploy the service.
9. After deployment, copy the backend URL, for example:

```txt
https://jobportal-api.onrender.com
```

### Step 5: Deploy the frontend on Vercel

1. Open Vercel.
2. Import the same GitHub repository.
3. Set the root directory to `frontend`.
4. Add this environment variable:

```txt
VITE_API_BASE_URL=https://your-backend-service.onrender.com
```

5. Deploy the project.

This repo now includes `frontend/vercel.json` so React Router routes work correctly on refresh.

### Step 6: Update backend CORS origin

After Vercel gives you the final frontend URL:

1. Go back to Render.
2. Update `CLIENT_URL` to the exact Vercel production URL.
3. Trigger a redeploy or save changes and let Render restart.

Example:

```txt
CLIENT_URL=https://jobportal-frontend.vercel.app
```

### Step 7: Test the deployed app

Test these flows:

1. Open the frontend URL.
2. Sign up a new user.
3. Log in.
4. Create a company or post a job.
5. Upload profile image or resume.
6. Refresh protected pages and verify the session still works.

## Local Build Check Before Deploying

Run these commands:

### Backend

```powershell
cd backend
npm install
npm start
```

### Frontend

```powershell
cd frontend
npm install
npm run build
```

If the frontend build succeeds and the backend starts with your production-style env vars, deployment should be straightforward.

## Important Deployment Notes

### 1. Cookies and login

This app uses cookie-based authentication.

Because the frontend and backend are deployed on different domains, production must use:

- `COOKIE_SAME_SITE=none`
- `COOKIE_SECURE=true`
- `CLIENT_URL` set to the exact frontend domain

### 2. File uploads

Do not rely on local uploads in production.

Render’s local filesystem is not a durable file storage solution for user uploads. Use Cloudinary in production so uploads stay available after redeploys or restarts.

### 3. MongoDB connection

Make sure MongoDB Atlas allows connections from your deployed backend.

If Atlas blocks the connection, your API may deploy successfully but fail at runtime.

## If You Want a Simpler Alternative

If you want fewer platforms to manage, you can also deploy both frontend and backend on Render:

- Backend as a Web Service
- Frontend as a Static Site

That works too, but Vercel usually gives a smoother frontend deployment experience for Vite apps.

## Official Docs

- Render docs: https://render.com/docs
- Render first deploy guide: https://render.com/docs/your-first-deploy
- Vite on Vercel: https://vercel.com/docs/frameworks/frontend/vite
- Vercel environment variables: https://vercel.com/docs/environment-variables
- MongoDB Atlas connection strings: https://www.mongodb.com/docs/v8.0/reference/connection-string/

## Deployment-Ready Changes Added

This repo has been updated to make deployment easier:

- Backend production start script now uses `node index.js`
- Backend CORS now supports a `CLIENT_URL` allowlist
- Auth cookie settings are configurable with `COOKIE_SAME_SITE` and `COOKIE_SECURE`
- Added `backend/.env.example`
- Added `frontend/.env.example`
- Added `frontend/vercel.json` for SPA route rewrites
