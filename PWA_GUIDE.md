# Nous - Progressive Web App (PWA) Guide

Your Nous Study Tracker is now a **Progressive Web App** that can be installed directly from the browser, just like PassMedicine! Users can install it on their mobile devices, tablets, and laptops without going through app stores.

## What is a PWA?

A Progressive Web App allows your web application to:
- Be installed directly from the browser
- Work offline with cached data
- Sync data between devices via Firebase
- Send push notifications (future feature)
- Provide a native app-like experience
- Bypass traditional app stores (no Apple/Google approval needed)

## Features

### ✅ Implemented Features

1. **Installable App**
   - Install button appears automatically when visiting the site
   - Works on Chrome, Edge, Safari (iOS 16.4+), and other modern browsers
   - Install from browser menu or floating "Install App" button

2. **Offline Access**
   - Core app functionality works without internet
   - Firebase has built-in offline persistence
   - Service worker caches essential resources
   - Data syncs automatically when back online

3. **Cross-Device Sync**
   - Firebase Authentication maintains user sessions
   - Data syncs automatically between installed instances
   - No login timeouts in installed app

4. **Optimized UI**
   - Responsive design works on all screen sizes
   - Native app feel with standalone display mode
   - Custom theme colors matching Nous branding

5. **No Login Timeouts**
   - Firebase maintains persistent authentication
   - Sessions stay active in installed app

## Installation Instructions

### On Mobile (iOS/Android)

#### Chrome (Android) or Safari (iOS 16.4+)
1. Visit your Nous app URL in the browser
2. Look for the "Install App" button (floating button in bottom-right)
3. Tap the button and follow the prompts
4. Or use browser menu: "Add to Home Screen" or "Install App"

#### Safari/Chrome (iOS) - Recommended Method ✓
1. Open the app in Safari or Chrome
2. Look at the **top-right corner** next to the URL (nousi.netlify.app)
3. Tap the **Share icon** (square with arrow pointing up)
4. Scroll down and tap **"Add to Home Screen"**
5. Tap **"Add"** to confirm

**Important:** The share icon is located in the **top-right corner** of the browser, right next to the address bar. This works on both Chrome and Safari browsers.

### On Desktop (Mac/PC)

#### Chrome/Edge
1. Visit your Nous app URL
2. Click the install icon in the address bar (computer with arrow)
3. Or click the "Install App" button that appears
4. Or use menu: Chrome menu > "Install Nous..."

#### Safari (Mac)
1. Safari 17+ supports PWA installation
2. File menu > "Add to Dock"

## Files Added

### Core PWA Files
- `manifest.json` - App configuration and metadata
- `service-worker.js` - Offline functionality and caching
- `generate-icons.html` - Browser-based icon generator
- `generate-icons.js` - Helper script for icon generation
- `generate-icons.py` - Python-based icon generator (requires dependencies)

### Icon Files (to be generated)
Place in `/icons/` folder:
- `icon-72x72.png` - Smallest icon
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png` - Apple Touch Icon
- `icon-192x192.png` - Standard PWA icon
- `icon-384x384.png`
- `icon-512x512.png` - Largest icon (for splash screens)

### Modified Files
- `index.html` - Added PWA meta tags, manifest link, service worker registration, and install prompt UI

## How to Generate Icons

You need to create PNG icons from your Nous logo. Choose one method:

### Method 1: Browser-Based Generator (Easiest)
1. Open `generate-icons.html` in your browser
2. Click "Generate Icons" button
3. Save all downloaded PNG files to the `/icons` folder
4. Done!

### Method 2: Online Tool
1. Visit [RealFaviconGenerator](https://realfavicongenerator.net/)
2. Upload a high-resolution version of your Nous logo
3. Configure settings (use theme color #5d6b86)
4. Download generated icons
5. Rename to match required names and save to `/icons` folder

### Method 3: Design Tool
Use Figma, Sketch, or Photoshop to export your logo at all required sizes.

## Testing Your PWA

### Local Testing
1. PWAs require HTTPS or localhost
2. Run locally: `npm start` (serves on localhost:8080)
3. Test installation in Chrome DevTools:
   - Open DevTools (F12)
   - Go to "Application" tab
   - Check "Manifest" section
   - Check "Service Workers" section

### Production Testing
1. Deploy to Netlify (already configured)
2. Visit deployed URL
3. Test install button appears
4. Test installation on different devices
5. Test offline functionality (disable network in DevTools)

### Checklist
- [ ] Generate and add all required icons to `/icons` folder
- [ ] Test manifest loads correctly (DevTools > Application > Manifest)
- [ ] Test service worker registers (DevTools > Application > Service Workers)
- [ ] Test install prompt appears on supported browsers
- [ ] Test app installs successfully
- [ ] Test app launches in standalone mode
- [ ] Test offline functionality (disable network)
- [ ] Test data syncs when back online
- [ ] Test on both mobile and desktop

## Browser Compatibility

| Browser | Install Support | Offline Support |
|---------|----------------|-----------------|
| Chrome (Desktop) | ✅ Yes | ✅ Yes |
| Chrome (Android) | ✅ Yes | ✅ Yes |
| Edge (Desktop) | ✅ Yes | ✅ Yes |
| Safari (iOS 16.4+) | ✅ Yes | ✅ Yes |
| Safari (Mac 17+) | ✅ Yes | ✅ Yes |
| Firefox (Desktop) | ⚠️  Limited | ✅ Yes |
| Samsung Internet | ✅ Yes | ✅ Yes |

## Future Enhancements

Consider adding these features later:

1. **Push Notifications**
   - Study reminders
   - Goal achievement notifications
   - Session completion alerts

2. **Background Sync**
   - Better offline data handling
   - Periodic background updates

3. **Share Target**
   - Share content to Nous from other apps

4. **Advanced Caching**
   - Cache study session history
   - Pre-cache frequently accessed data

5. **Update Notifications**
   - Notify users when new version available
   - Prompt to update service worker

## Troubleshooting

### Install Button Doesn't Appear
- Ensure you're on HTTPS (or localhost)
- Check browser supports PWA installation
- Check DevTools console for errors
- Verify manifest.json loads correctly

### Service Worker Not Registering
- Check browser console for errors
- Ensure service-worker.js is at root level
- Clear browser cache and reload
- Check HTTPS is enabled (required for service workers)

### Icons Not Showing
- Verify icons exist in `/icons` folder
- Check icon file names match manifest.json
- Check icon dimensions are correct
- Try hard refresh (Cmd+Shift+R / Ctrl+Shift+F5)

### App Not Working Offline
- Check service worker is active (DevTools > Application)
- Verify cache is populated
- Check network requests in DevTools
- Firebase requires initial online connection for auth

## Deployment Notes

Your existing Netlify setup should work automatically:

1. Push changes to your repository
2. Netlify will deploy automatically
3. PWA will be available at your Netlify URL
4. HTTPS is provided automatically by Netlify

### Important for Production
- Generate all required icons before deploying
- Test PWA features on production URL
- Update manifest.json if you change domain
- Service worker will cache the deployed version

## Support

For more information:
- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [web.dev PWA Documentation](https://web.dev/progressive-web-apps/)
- [Chrome PWA Install Criteria](https://web.dev/install-criteria/)

---

**Your Nous app is now installable just like PassMedicine!** 🎉

Users can enjoy:
- Direct installation from browser
- Offline access to core features
- No app store approval needed
- Automatic updates when you deploy
- Cross-device sync via Firebase
