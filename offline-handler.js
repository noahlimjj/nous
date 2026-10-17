// Offline Mode Handler
// Suppresses Firebase errors and provides offline mode support

(function () {
    'use strict';

    // Track online/offline state
    let isOnline = navigator.onLine;
    let offlineIndicatorAdded = false;

    // Suppress noisy Firebase errors when offline
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    console.error = function (...args) {
        const message = args.join(' ');

        // Always suppress these specific noisy network/firebase errors
        if (
            message.includes('ERR_NETWORK_CHANGED') ||
            message.includes('ERR_HTTP2_PING_FAILED') ||
            message.includes('webchannel_connection') ||
            message.includes('fetchxmlhttpfactory')
        ) {
            return;
        }

        // Suppress these errors when offline
        if (!isOnline) {
            if (
                message.includes('ERR_INTERNET_DISCONNECTED') ||
                message.includes('ERR_CONNECTION') ||
                message.includes('WebChannelConnection') ||
                message.includes('net::ERR_') ||
                message.includes('firestore') ||
                message.includes('Firestore') ||
                message.includes('firebase') ||
                message.includes('Firebase') ||
                message.includes('googleapis.com') ||
                message.includes('firebasestorage') ||
                message.includes('transport errored') ||
                message.includes('RPC') ||
                message.includes('Write/Listen') ||
                message.includes('cleardot.gif') ||
                message.includes('Failed to fetch')
            ) {
                // Silently suppress - these are expected when offline
                return;
            }
        }

        // Pass through other errors
        originalConsoleError.apply(console, args);
    };

    console.warn = function (...args) {
        const message = args.join(' ');

        // Suppress Firebase warnings when offline
        if (!isOnline && message.includes('firebase')) {
            return;
        }

        originalConsoleWarn.apply(console, args);
    };

    // Add offline indicator to page
    function addOfflineIndicator() {
        if (offlineIndicatorAdded) return;

        const indicator = document.createElement('div');
        indicator.id = 'offline-indicator';
        // A quiet pill at the bottom of the screen, clear of the home indicator
        indicator.style.cssText = `
            position: fixed;
            left: 0;
            right: 0;
            bottom: calc(env(safe-area-inset-bottom) + 16px);
            margin: 0 auto;
            width: max-content;
            max-width: calc(100vw - 32px);
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 14px;
            border-radius: 9999px;
            background: rgba(54, 63, 81, 0.92);
            color: #f1f3f7;
            font-family: inherit;
            font-size: 13px;
            font-weight: 400;
            z-index: 9999;
            box-shadow: 0 6px 18px rgba(99, 110, 129, 0.2);
            pointer-events: none;
        `;
        indicator.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h.01"/><path d="M8.5 16.43a5 5 0 0 1 7 0"/><path d="M2 8.82a15 15 0 0 1 4.17-2.65"/><path d="M10.66 5c4.01-.36 8.14.9 11.34 3.76"/><path d="M16.85 11.25a10 10 0 0 1 2.22 1.68"/><path d="M5 12.86a10 10 0 0 1 5.17-2.69"/><path d="m2 2 20 20"/></svg>offline · changes will sync when you\'re back online';

        document.body.appendChild(indicator);
        offlineIndicatorAdded = true;

        console.log('📴 Offline mode detected - Firebase features disabled');
    }

    // Remove offline indicator
    function removeOfflineIndicator() {
        const indicator = document.getElementById('offline-indicator');
        if (indicator) {
            indicator.remove();
            offlineIndicatorAdded = false;
        }

        console.log('📶 Back online - Firebase features enabled');
    }

    // Monitor online/offline status
    window.addEventListener('online', () => {
        isOnline = true;
        removeOfflineIndicator();

        // Auto-sync offline timer data when back online
        if (window.OfflineTimerManager && window.OfflineTimerManager.getQueue().length > 0) {
            console.log('📶 Back online - syncing offline timer data...');

            // Wait for app to be ready (db and userId available)
            setTimeout(() => {
                if (window.__currentDb && window.__currentUserId) {
                    const appId = window.__currentAppId || (typeof window.__app_id !== 'undefined' ? window.__app_id : 'study-tracker-app');
                    window.OfflineTimerManager.sync(window.__currentDb, window.__currentUserId, appId)
                        .then(result => {
                            if (result.success) {
                                console.log(`✅ Synced ${result.synced} offline timer operations`);
                                if (result.synced > 0) {
                                    // Show notification to user
                                    if (window.__showNotification) {
                                        window.__showNotification(`Synced ${result.synced} offline timer session(s)`, 'success');
                                    }
                                }
                            } else {
                                console.error('⚠️  Some timer operations failed to sync:', result.errors);
                            }
                        })
                        .catch(err => {
                            console.error('❌ Offline timer sync failed:', err);
                        });
                } else {
                    console.log('⏳ Waiting for app to initialize before syncing...');
                }
            }, 2000); // Wait 2 seconds for app to initialize
        }
    });

    window.addEventListener('offline', () => {
        isOnline = false;
        addOfflineIndicator();
    });

    // Check initial state
    if (!isOnline) {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', addOfflineIndicator);
        } else {
            addOfflineIndicator();
        }
    }

    // Expose offline state
    window.__isOffline = () => !isOnline;

    console.log('✓ Offline handler initialized');
})();
