# Deployment Checklist

**ALWAYS follow this checklist before pushing to main/deploying to Netlify!**

---

## Pre-Deployment Steps

### 1. ✅ Rebuild CSS Locally

```bash
npm run build
```

**Expected output:**
```
Rebuilding...
Done in ~150ms
```

### 2. ✅ Verify CSS File Size

```bash
ls -lh tailwind-output.css
```

**Expected size:** ~24KB (23-25KB is normal)

⚠️ **If size is < 10KB:** Something is wrong! Check `tailwind.config.js`

### 3. ✅ Test Locally

```bash
# Start local server
python3 -m http.server 8000

# Open in browser
open http://localhost:8000/index.html
```

**Verify:**
- [ ] Home page loads correctly
- [ ] All navigation works (Home, Tree, Friends, Settings, About)
- [ ] Styling looks correct (colors, fonts, spacing)
- [ ] No console errors (press F12)
- [ ] Responsive design works (try mobile view)

### 4. ✅ Check Git Status

```bash
git status
```

**Make sure:**
- [ ] Only intended files are modified
- [ ] No accidental changes to index2.* files
- [ ] tailwind-output.css is included if you ran build

### 5. ✅ Commit with Descriptive Message

```bash
git add <files>
git commit -m "descriptive message"
```

### 6. ✅ Push to GitHub

```bash
git push origin main
```

---

## Post-Deployment Verification

### 1. Monitor Netlify Build

```bash
# Open Netlify deploys page
open https://app.netlify.com/sites/nousi/deploys
```

**Wait for:**
- [ ] Build status: "Published" (not "Failed")
- [ ] Build time: ~30-60 seconds typical

### 2. Test Production Site

```bash
open https://nousi.netlify.app
```

**Important:** Do a **hard refresh** to clear cache:
- Mac: `Cmd + Shift + R`
- Windows: `Ctrl + Shift + F5`

**Verify:**
- [ ] Styling looks identical to localhost
- [ ] All pages work
- [ ] No console errors
- [ ] Features work as expected

### 3. Check CSS on Production

```bash
# Verify CSS file size matches local
curl -s https://nousi.netlify.app/tailwind-output.css | wc -c
```

**Expected:** ~24000 bytes (should match local)

---

## Emergency Rollback

**If production is broken:**

```bash
# Find last good commit
git log --oneline -5

# Revert to it (replace COMMIT_HASH)
git reset --hard <COMMIT_HASH>

# Force push
git push origin main --force
```

**Then:**
1. Wait for Netlify to rebuild (~1 minute)
2. Hard refresh production site
3. Verify it's working
4. Debug locally before trying again

---

## Common Issues

### Issue: "Netlify looks different than localhost"

**Likely cause:** CSS rebuild problem

**Solution:**
1. Check `tailwind.config.js` content paths include all active files
2. Run `npm run build` locally
3. Verify CSS file size (~24KB)
4. Test locally
5. Then push

### Issue: "CSS file is tiny (< 10KB)"

**Likely cause:** Tailwind not scanning the right files

**Solution:**
1. Check `tailwind.config.js`:
   ```javascript
   content: [
     "./index.html",
     "./index.js",    // ← Make sure this is here!
     "./script.js"
   ]
   ```
2. Rebuild: `npm run build`
3. Verify size: `ls -lh tailwind-output.css`

### Issue: "Site looks fine locally but broken on Netlify"

**Likely cause:** You're serving old cached CSS locally

**Solution:**
1. Clear local server cache
2. Rebuild CSS: `npm run build`
3. Restart server
4. Hard refresh browser

---

## Files to NEVER Accidentally Deploy

- `index2.html` - Future feature, not ready
- `index2.js` - Future feature, not ready
- `index2.css` - Future feature, not ready
- `node_modules/` - Should be in .gitignore
- `config.js` - Contains secrets, should be in .gitignore (generated on Netlify)

---

## Quick Validation Script

Run before deploying:

```bash
node scripts/validate-deployment.js
```

This will automatically check:
- ✅ CSS file size
- ✅ Tailwind config is correct
- ✅ No accidental files included
- ✅ Build succeeds

---

**Remember:** Test locally, verify CSS, then deploy! 🚀
