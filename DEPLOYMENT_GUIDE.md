# TravelAdvisor — Deployment Guide

## Render Deployment Guide (Week 6)

> **Platform:** Render.com  
> **Strategy:** Single Web Service — Express backend serves the React production build  
> **Database:** Cloud MySQL (Aiven, PlanetScale, or any MySQL host)

---

## Prerequisites

Before starting, ensure you have:

- [ ] GitHub account with the TravelAdvisor project pushed to a repository
- [ ] Render account (free at [render.com](https://render.com))
- [ ] Cloud MySQL database credentials (from Aiven, PlanetScale, etc.)
- [ ] Node.js 18+ installed locally for testing the production build

---

## Step 1 — Set Up a Cloud MySQL Database

Render cannot connect to your local MySQL. You need a cloud-hosted MySQL.

### Option A — Aiven (Recommended Free Tier)

1. Go to [aiven.io](https://aiven.io) → Sign up free
2. Click **Create Service** → Select **MySQL**
3. Choose the **Free** plan → Select any cloud region
4. Wait for provisioning (~2 minutes)
5. Go to **Service Overview** → Copy these values:
   ```
   Host:     mysql-xxxxxxxx.aivencloud.com
   Port:     12345
   Database: defaultdb
   User:     avnadmin
   Password: xxxxxxxx
   ```
6. Under **Quick Connect** → switch to **URL** format → copy `DATABASE_URL`

### Option B — PlanetScale

1. Go to [planetscale.com](https://planetscale.com) → Sign up free
2. Create a new database → Choose region closest to you
3. Go to **Connect** → Select **Node.js** driver
4. Copy the `DATABASE_URL` connection string

### Initialize Your Database

After creating the cloud DB, run the schema migration:

```bash
# From your local machine — point to cloud DB
cd backend
# Set DATABASE_URL to your cloud connection string, then run:
node database/migrate.js
```

---

## Step 2 — Push Project to GitHub

```bash
cd c:\Users\Feny N Tejani\OneDrive\Desktop\traveladvisor

# Initialize git if not already done
git init
git add .
git commit -m "feat: production-ready TravelAdvisor for Render deployment"

# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/traveladvisor.git
git branch -M main
git push -u origin main
```

> ⚠️ Verify `.env` files are NOT committed: `git status` should NOT show any `.env` files.

---

## Step 3 — Create a Render Web Service

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Click **Connect a repository** → Authorize GitHub → Select `traveladvisor`
4. Configure the service:

| Field | Value |
|---|---|
| **Name** | `traveladvisor` |
| **Region** | Singapore (or closest to India) |
| **Branch** | `main` |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build && cd backend && npm install` |
| **Start Command** | `cd backend && node server.js` |
| **Plan** | Free |

5. Click **Advanced** → set Health Check Path to `/`

---

## Step 4 — Configure Environment Variables

In the Render dashboard, click **Environment** → add each variable:

| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `JWT_SECRET` | *(generate: click "Generate")* |
| `JWT_EXPIRES_IN` | `7d` |
| `DB_HOST` | *(your cloud MySQL host)* |
| `DB_PORT` | `3306` (or your cloud DB port) |
| `DB_USER` | *(your cloud MySQL user)* |
| `DB_PASSWORD` | *(your cloud MySQL password)* |
| `DB_NAME` | *(your cloud MySQL database name)* |
| `DATABASE_URL` | *(optional: full connection URL if using Aiven SSL)* |
| `CORS_ORIGIN` | `https://YOUR-APP-NAME.onrender.com` |

> 💡 **JWT_SECRET:** Click the "Generate" button in Render — it creates a cryptographically secure random value automatically.

---

## Step 5 — Deploy

1. Click **Create Web Service** → Render begins the build
2. Watch the **Logs** tab — you will see:
   ```
   ==> Running build command: npm install && npm run build && cd backend && npm install
   ==> Starting service with: cd backend && node server.js
   ✅  MySQL Database connected successfully
   🌍  TravelAdvisor REST API running
   ```
3. After ~3–5 minutes, your service will show **Live** status
4. Copy your live URL: `https://traveladvisor.onrender.com`

---

## Step 6 — Update CORS_ORIGIN

After your first deploy, you know the live URL:

1. In Render Dashboard → **Environment** → edit `CORS_ORIGIN`
2. Set value to: `https://traveladvisor.onrender.com`
3. Click **Save Changes** → Render auto-redeploys

---

## Step 7 — Verify Deployment

Test these URLs in your browser or Postman:

| Test | URL | Expected |
|---|---|---|
| Health Check | `https://YOUR-APP.onrender.com/` | JSON: `"TravelAdvisor REST API is live"` |
| Get Destinations | `https://YOUR-APP.onrender.com/api/destinations` | JSON: paginated destination list |
| Get Categories | `https://YOUR-APP.onrender.com/api/categories` | JSON: category list |
| Frontend Home | `https://YOUR-APP.onrender.com` | React app loads |
| Frontend Login | `https://YOUR-APP.onrender.com/login` | Login form renders |

---

## Troubleshooting Common Issues

### Build Failed — `npm run build` error
- **Cause:** Missing `react-scripts` in dependencies
- **Fix:** Move `react-scripts` from `devDependencies` to `dependencies` in root `package.json`

### Database Connection Failed
- **Cause:** Wrong DB credentials or firewall blocking Render's IP
- **Fix:** 
  1. Verify `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` in Render env vars
  2. In Aiven: go to **Allowed IP addresses** → add `0.0.0.0/0` (allow all — safe for testing)
  3. Check Render logs for the exact error code

### CORS Errors in Browser Console
- **Cause:** `CORS_ORIGIN` env var not set to the correct frontend URL
- **Fix:** Set `CORS_ORIGIN=https://your-actual-render-url.onrender.com`

### 404 on React Routes (e.g. `/destinations/1`)
- **Cause:** Browser requests the URL directly, but Express doesn't handle it
- **Fix:** Verify the catch-all route in `backend/app.js` under the `production` block serves `index.html`

### Free Tier — App Sleeps After 15 Minutes Inactivity
- **Cause:** Render Free tier spins down inactive services
- **Fix (workaround):** Use [UptimeRobot](https://uptimerobot.com) to ping your app every 10 minutes (free)

### JWT Authentication Fails in Production
- **Cause:** `JWT_SECRET` env var is missing or different from what was used to sign old tokens
- **Fix:** Ensure `JWT_SECRET` is set in Render env vars; clear browser localStorage and log in again

---

## Environment Variables Reference

### Backend (set in Render Dashboard)

| Variable | Required | Description |
|---|---|---|
| `NODE_ENV` | ✅ | Set to `production` |
| `PORT` | ❌ | Auto-assigned by Render — do NOT set |
| `JWT_SECRET` | ✅ | Secret key for JWT signing (min 32 chars) |
| `JWT_EXPIRES_IN` | ✅ | Token expiry e.g. `7d` |
| `DB_HOST` | ✅ | Cloud MySQL hostname |
| `DB_PORT` | ✅ | Cloud MySQL port (usually 3306) |
| `DB_USER` | ✅ | Cloud MySQL username |
| `DB_PASSWORD` | ✅ | Cloud MySQL password |
| `DB_NAME` | ✅ | Cloud MySQL database name |
| `DATABASE_URL` | ⭕ | Alternative to individual DB vars |
| `CORS_ORIGIN` | ✅ | Your Render app URL |

### Frontend (built into React bundle at build time)

| Variable | Required | Description |
|---|---|---|
| `REACT_APP_API_URL` | ✅ | Set to `https://your-app.onrender.com/api` |

> 🔑 **Note:** Since the frontend is built and served by the same Express server, `REACT_APP_API_URL` should be set as a Render environment variable **before** the build runs — Render passes it to `npm run build`.

---

## Post-Deployment Checklist

- [ ] Health check endpoint returns 200 OK
- [ ] Database connection confirmed in logs
- [ ] User registration works
- [ ] User login returns JWT token
- [ ] Destinations list loads
- [ ] Destination details page loads
- [ ] Hotels display for destinations
- [ ] Reviews can be submitted (authenticated)
- [ ] Admin dashboard accessible with admin credentials
- [ ] Search and filter functionality works
- [ ] All CRUD operations function correctly
- [ ] Logout clears session
