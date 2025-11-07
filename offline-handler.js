// Offline Mode Handler
// Suppresses Firebase errors and provides offline mode support

(function() {
    'use strict';

    // Track online/offline state
    let isOnline = navigator.onLine;
    let offlineIndicatorAdded = false;

    // Suppress noisy Firebase errors when offline
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    console.error = function(...args) {
        const message = args.join(' ');

        // Suppress these errors when offline
        if (!isOnline) {
            if (
                message.includes('ERR_INTERNET_DISCONNECTED') ||
                message.includes('ERR_NETWORK_CHANGED') ||
                message.includes('ERR_CONNECTION') ||
                message.includes('WebChannelConnection') ||
                message.includes('webchannel_connection') ||
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

    console.warn = function(...args) {
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
        indicator.style.cssText = `
            position: fixed;
            top: 64px;
            left: 0;
            right: 0;
            background: #ff9800;
            color: white;
            text-align: center;
            padding: 8px;
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 14px;
            font-weight: 500;
            z-index: 9999;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        `;
        indicator.innerHTML = '⚠️ Offline Mode - Some features unavailable';

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
                    window.OfflineTimerManager.sync(window.__currentDb, window.__currentUserId)
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
