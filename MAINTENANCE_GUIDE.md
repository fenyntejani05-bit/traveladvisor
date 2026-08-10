# TravelAdvisor — Maintenance Guide

> **Version:** 1.0  
> **Project:** TravelAdvisor Full Stack Web Application  
> **Environment:** Production on Render.com + Cloud MySQL  
> **Last Updated:** August 2026

---

## 1. Routine Maintenance Schedule

| Task | Frequency | Owner | Tool |
|---|---|---|---|
| Review Render service logs | Daily | DevOps | Render Dashboard |
| Check database connection health | Daily | DevOps | Render → Logs |
| Monitor service uptime | Continuous | UptimeRobot | Auto-ping |
| Review application error logs | Weekly | Developer | Render → Logs |
| Run automated test suite | Weekly | Developer | `npm test` |
| Update `npm` dependencies (minor) | Monthly | Developer | `npm update` |
| Review JWT secret rotation | Monthly | Security | Render Env Vars |
| Full dependency audit | Quarterly | Developer | `npm audit` |
| Database backup verification | Monthly | DBA | Aiven/PlanetScale Dashboard |
| Security vulnerability scan | Quarterly | Security | `npm audit fix` |

---

## 2. Monitoring

### 2.1 Render Dashboard Monitoring

1. Navigate to [dashboard.render.com](https://dashboard.render.com)
2. Select the **traveladvisor** service
3. Click **Logs** to view real-time output
4. Click **Metrics** to view:
   - CPU usage
   - Memory usage
   - Response time

**Key log indicators:**
```
✅ Normal:  "MySQL Database connected successfully"
✅ Normal:  "TravelAdvisor REST API running"
⚠️ Warning: "DB connection pool exhausted"
❌ Error:   "Failed to start server: Access denied for user"
```

### 2.2 UptimeRobot Setup (Free External Monitoring)

1. Sign up at [uptimerobot.com](https://uptimerobot.com)
2. Add New Monitor:
   - **Monitor Type:** HTTP(s)
   - **Friendly Name:** TravelAdvisor Production
   - **URL:** `https://YOUR-APP.onrender.com/`
   - **Monitoring Interval:** 5 minutes
3. Add alert contacts (email, SMS)

This also prevents Render Free tier cold starts (app stays warm).

### 2.3 Health Check Endpoint

```
GET /
Response: { "message": "TravelAdvisor REST API is live", "version": "1.0.0" }
Status:   200 OK
```

### 2.4 Database Health Check

```bash
# From your local machine, connect to cloud MySQL and verify tables:
mysql -h YOUR_DB_HOST -u YOUR_USER -p travel_advisor_db -e "SHOW TABLES;"
```

Expected output:
```
categories
destinations
hotels
reviews
users
```

---

## 3. Backup and Recovery

### 3.1 Database Backup — Aiven (Automatic)

Aiven provides automatic daily backups on the free tier. To verify:

1. Aiven Console → Select MySQL service
2. Click **Backups** tab
3. Confirm latest backup timestamp

**Manual backup (run locally):**
```bash
mysqldump -h YOUR_CLOUD_HOST -P 12345 -u avnadmin -p \
  --ssl-mode=REQUIRED \
  travel_advisor_db > backup_$(date +%Y%m%d).sql
```

### 3.2 Database Restore

```bash
# Restore from a backup file
mysql -h YOUR_CLOUD_HOST -P 12345 -u avnadmin -p \
  --ssl-mode=REQUIRED \
  travel_advisor_db < backup_20260810.sql
```

### 3.3 Code Backup (GitHub)

All code is version-controlled on GitHub. To recover any version:
```bash
git log --oneline -20          # View recent commits
git checkout <commit-hash>     # Restore to specific commit
git revert HEAD                # Undo last commit (safe for production)
```

---

## 4. Updating the Application

### 4.1 Deploy a Code Update

```bash
# 1. Make your changes locally and test
npm test                       # Run all tests
npm run build                  # Verify React build succeeds

# 2. Commit and push to GitHub
git add .
git commit -m "fix: description of your change"
git push origin main

# 3. Render auto-deploys on push to main branch
# 4. Monitor Render logs to confirm successful deployment
```

### 4.2 Update npm Dependencies

```bash
# Check for outdated packages
npm outdated
cd backend && npm outdated

# Update minor/patch versions (safe)
npm update
cd backend && npm update

# Audit for security vulnerabilities
npm audit
npm audit fix

# Update a specific package (use carefully)
npm install package-name@latest
```

### 4.3 Emergency Rollback

If a new deployment breaks production:

**Option 1 — Revert via GitHub:**
```bash
git revert HEAD
git push origin main
# Render auto-deploys the reverted code
```

**Option 2 — Revert via Render Dashboard:**
1. Dashboard → traveladvisor → **Events**
2. Find the last successful deploy
3. Click **Rollback to this deploy**

---

## 5. Security Maintenance

### 5.1 JWT Secret Rotation

Rotate the JWT secret quarterly or after any suspected compromise:

1. Generate a new secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ```
2. Render Dashboard → Environment → Update `JWT_SECRET`
3. Click **Save** → Render redeploys automatically
4. ⚠️ **All active user sessions will be invalidated.** Users must log in again.

### 5.2 Database Password Rotation

1. Generate a new password in your cloud MySQL dashboard
2. Update `DB_PASSWORD` in Render Environment Variables
3. Render redeploys automatically

### 5.3 Security Headers (Already Configured)

The application uses **Helmet.js** which sets these headers automatically:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security` (HTTPS enforced)
- `Content-Security-Policy`

### 5.4 Dependency Vulnerability Scanning

```bash
# Run audit (do this monthly)
npm audit
cd backend && npm audit

# Auto-fix vulnerabilities
npm audit fix

# Force fix (use with caution — may break APIs)
npm audit fix --force
```

---

## 6. Performance Optimization

### 6.1 Database Indexing

Key indexes already defined in `schema.sql`. Verify they exist:
```sql
SHOW INDEX FROM destinations;
SHOW INDEX FROM hotels;
SHOW INDEX FROM reviews;
```

### 6.2 Render Free Tier Limitations

| Limitation | Impact | Mitigation |
|---|---|---|
| Sleep after 15 min inactivity | ~30s cold start | UptimeRobot ping every 10 min |
| 512 MB RAM | Memory limits | Optimize query result sizes |
| Shared CPU | Slow under load | Upgrade to Render Starter ($7/mo) |
| 100 GB bandwidth/month | Traffic limit | Compress API responses |

### 6.3 Enable gzip Compression

Add to `backend/app.js` if not already present:
```javascript
const compression = require('compression');
app.use(compression());
```

Install: `cd backend && npm install compression`

---

## 7. Log Management

### 7.1 Viewing Logs on Render

1. Render Dashboard → traveladvisor → **Logs**
2. Use the filter box to search for specific errors:
   - `ERROR` — application errors
   - `WARN` — non-fatal warnings
   - `DB_` — database-related logs

### 7.2 Log Format (Structured JSON)

The application uses the custom logger at `backend/utils/logger.js`:
```json
{
  "timestamp": "2026-08-10T12:00:00.000Z",
  "level": "error",
  "message": "Database query failed",
  "stack": "Error: ...",
  "requestId": "req-abc123"
}
```

### 7.3 Log Retention on Render

Render retains logs for **7 days** on the free tier. For longer retention:
- Download logs via Render API
- Integrate with **Papertrail** (free tier: 48-hour search, 1GB/month)
- Integrate with **LogDNA** or **Datadog**

---

## 8. Incident Response

### Severity Levels

| Level | Description | Response Time |
|---|---|---|
| P1 — Critical | App completely down | Immediate |
| P2 — High | Core feature broken | Within 1 hour |
| P3 — Medium | Non-critical bug | Within 24 hours |
| P4 — Low | Minor UI issue | Within 1 week |

### Incident Response Steps

1. **Detect** — Monitoring alert or user report
2. **Assess** — Check Render logs + UptimeRobot
3. **Communicate** — Notify stakeholders
4. **Mitigate** — Rollback or hotfix
5. **Resolve** — Deploy fix and verify
6. **Post-mortem** — Document root cause + prevention
