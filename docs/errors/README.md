# Error Documentation Index

**Last Updated:** October 31, 2025

This directory contains all error documentation, troubleshooting guides, and incident reports.

---

## 📂 Documentation Structure

```
docs/errors/
├── README.md (this file)
├── COMMON_ERRORS.md             # Quick reference for frequent issues
├── FIREBASE_ERRORS.md            # Firebase-specific errors and solutions
└── incidents/
    ├── SECURITY_INCIDENT_OCT30.md    # API key exposure incident
    └── DATA_INCIDENT_REPORT.md       # Data migration incidents
```

---

## 🚨 Most Common Errors (Quick Links)

### 1. Firebase Configuration Issues
**File:** [FIREBASE_ERRORS.md](./FIREBASE_ERRORS.md)

- Firebase config missing or invalid
- API key errors
- Environment variable configuration
- Offline mode

### 2. Port Already in Use
**Quick Fix:**
```bash
lsof -ti:8081 | xargs kill -9
npm start
```

### 3. Timezone Display Issues
**Solution:** All times use Singapore timezone (UTC+8)
```javascript
new Date(timestamp).toLocaleString('en-US', { timeZone: 'Asia/Singapore' })
```

---

## 📚 Related Documentation

| Document | Location | Purpose |
|----------|----------|---------|
| **CLAUDE.md** | `.claude/CLAUDE.md` | Common errors & project context for Claude Code |
| **TROUBLESHOOTING_GUIDE** | `docs/sop/TROUBLESHOOTING_GUIDE.md` | General troubleshooting procedures |
| **FIREBASE_CONFIG_TROUBLESHOOTING** | `docs/FIREBASE_CONFIG_TROUBLESHOOTING.md` | Firebase configuration detailed guide |
| **NETLIFY_FIREBASE_SETUP** | `NETLIFY_FIREBASE_SETUP.md` | Production deployment setup |
| **SECURITY.md** | `docs/sop/SECURITY.md` | Security best practices |

---

## 🔍 How to Use This Documentation

### For Developers:
1. Check **COMMON_ERRORS.md** first for quick fixes
2. For Firebase issues, see **FIREBASE_ERRORS.md**
3. For production deployment, see **NETLIFY_FIREBASE_SETUP.md**
4. For historical context, see incident reports in `incidents/`

### For Claude Code:
1. Read `.claude/CLAUDE.md` for project context
2. Reference error docs when encountering issues
3. Update docs when new errors are discovered

---

## 📝 How to Add New Error Documentation

When you encounter a new error:

1. **Document it in COMMON_ERRORS.md** if it's a frequent issue
2. **Create a specific guide** if it requires detailed explanation
3. **Update .claude/CLAUDE.md** to add it to the quick reference
4. **Link from this README** for easy discovery

---

## 🎯 Error Categories

### Configuration Errors
- Firebase config missing/invalid
- Environment variables not set
- Config file generation issues

### Runtime Errors
- Port conflicts
- Authentication failures
- Database connection issues

### Display/UI Errors
- Timezone display issues
- Dark mode problems
- Tree rendering issues

### Security Incidents
- API key exposure
- Credential leaks
- See `incidents/` folder

---

**Maintained by:** Noah Lim
**Last Review:** October 31, 2025
