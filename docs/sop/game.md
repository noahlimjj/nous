# Study Tracker Gamification System - "My World" Implementation Guide

## 🎯 Mission
Implement a complete gamification system that rewards users with in-game currency for studying and allows them to build and customize a virtual world. This makes studying fun, addictive, and visually rewarding.

---

## 📋 Current Codebase Context

### Architecture
- **Framework**: React (via CDN, React.createElement syntax)
- **Database**: Firebase Firestore
- **Auth**: Firebase Authentication (anonymous, email/password, Google)
- **File**: Single `index.html` file (~3700 lines)
- **Styling**: Tailwind CSS (via CDN)
- **No Build Process**: Direct HTML/JS, served via Python HTTP server

### Existing Pages (via currentPage state)
1. `dashboard` - Habit tracking with timers
2. `goals` - Goal management
3. `friends` - Friend system with codes
4. `leaderboard` - Rankings
5. `reports` - Study analytics
6. `about` - About page
7. `settings` - User settings

### Firebase Data Structure (Current)
```
/artifacts/{appId}/users/{userId}/
  ├── habits/ - User's study habits
  │   └── {habitId}: {name, createdAt, order}
  ├── sessions/ - Completed study sessions
  │   └── {sessionId}: {habitId, habitName, startTime, endTime, duration}
  └── activeTimers/ - Currently running timers
      └── {habitId}: {habitId, habitName, startTime, elapsedBeforePause, isPaused, originalStartTime}

/users/{userId}
  └── {friendCode, treeName, treeType, totalHours, totalSessions, longestStreak, currentStreak}
```

### Key Functions & Patterns

**Component Definition Pattern:**
```javascript
const ComponentName = ({ db, userId, setNotification, ...props }) => {
    const [state, setState] = useState(initialValue);

    useEffect(() => {
        // Firebase listeners
        const unsubscribe = window.onSnapshot(collection, callback);
        return () => unsubscribe();
    }, [dependencies]);

    return React.createElement('div', props, ...children);
};
```

**Firebase Operations:**
- `window.collection(db, path)` - Get collection reference
- `window.addDoc(collectionRef, data)` - Add document
- `window.setDoc(docRef, data)` - Set/update document
- `window.updateDoc(docRef, data)` - Update specific fields
- `window.deleteDoc(docRef)` - Delete document
- `window.onSnapshot(ref, callback)` - Real-time listener
- `window.serverTimestamp()` - Server timestamp

**Navigation:**
- State: `const [currentPage, setCurrentPage] = useState('dashboard')`
- Change: `setCurrentPage('myworld')`
- Render: `currentPage === 'myworld' && React.createElement(MyWorld, props)`

---

## 💰 Feature 1: Currency System Implementation

### Requirements
- **Base Rate**: 50 coins per 10 minutes (600 seconds)
- **Multiplier System** (based on continuous study time):
  - 0-60 min: 1.0x (50 coins/10min)
  - 60-120 min: 1.5x (75 coins/10min)
  - 120-180 min: 2.0x (100 coins/10min)
  - 180+ min: 2.5x (125 coins/10min)
- **Persistence**: Coins stored in Firebase, synced across devices
- **Display**: Show coin balance in header and "My World" page

### Database Schema Addition
```javascript
/users/{userId}
  └── coins: number  // Total accumulated coins
```

### Implementation Steps

#### Step 1.1: Add Coin Calculation Function
**Location**: After line ~700 (near other utility functions)

```javascript
// Calculate coins earned from a study session
const calculateCoinsEarned = (durationMs) => {
    const durationMinutes = durationMs / (1000 * 60);
    const BASE_COINS_PER_10MIN = 50;

    let totalCoins = 0;
    let remainingMinutes = durationMinutes;

    // Apply multipliers based on time ranges
    const ranges = [
        { max: 60, multiplier: 1.0 },    // 0-60 min
        { max: 120, multiplier: 1.5 },   // 60-120 min
        { max: 180, multiplier: 2.0 },   // 120-180 min
        { max: Infinity, multiplier: 2.5 } // 180+ min
    ];

    let currentMin = 0;
    for (const range of ranges) {
        const rangeSize = range.max - currentMin;
        const minutesInRange = Math.min(remainingMinutes, rangeSize);

        if (minutesInRange > 0) {
            const segments = minutesInRange / 10; // How many 10-min segments
            totalCoins += segments * BASE_COINS_PER_10MIN * range.multiplier;
            remainingMinutes -= minutesInRange;
        }

        currentMin = range.max;
        if (remainingMinutes <= 0) break;
    }

    return Math.floor(totalCoins);
};
```

#### Step 1.2: Modify stopTimer to Award Coins
**Location**: Find `const stopTimer = useCallback(async (habitId, habitName)` in Dashboard component (around line 1360)

**Current stopTimer**: Saves session to Firebase
**Modified stopTimer**: Save session + award coins + show notification

```javascript
const stopTimer = useCallback(async (habitId, habitName) => {
    const timerData = activeTimers[habitId];

    if (timerData) {
        try {
            // Calculate total elapsed time
            const currentElapsed = timerData.elapsedBeforePause || 0;
            const sessionElapsed = (!timerData.isPaused && timerData.startTime)
                ? Date.now() - timerData.startTime.toMillis()
                : 0;
            const totalElapsed = currentElapsed + sessionElapsed;

            if (totalElapsed > 0) {
                // Calculate coins earned
                const coinsEarned = calculateCoinsEarned(totalElapsed);

                // Save session to Firebase
                const sessionsCol = window.collection(db, `/artifacts/${appId}/users/${userId}/sessions`);
                const originalStartTime = timerData.originalStartTime || timerData.startTime;

                await window.addDoc(sessionsCol, {
                    habitId,
                    habitName,
                    startTime: originalStartTime,
                    endTime: window.Timestamp.now(),
                    duration: Math.round(totalElapsed),
                    coinsEarned // NEW: Store coins earned in session
                });

                // Award coins to user
                const userDocRef = window.doc(db, `users/${userId}`);
                const userDoc = await window.getDoc(userDocRef);
                const currentCoins = userDoc.exists() ? (userDoc.data().coins || 0) : 0;

                await window.setDoc(userDocRef, {
                    coins: currentCoins + coinsEarned
                }, { merge: true });

                setNotification({
                    type: 'success',
                    message: `Session saved! 🎉 +${coinsEarned} coins earned`
                });
            }

            // Delete from activeTimers collection
            const timerDocRef = window.doc(db, `/artifacts/${appId}/users/${userId}/activeTimers/${habitId}`);
            await window.deleteDoc(timerDocRef);
        } catch(error) {
            console.error("Error stopping timer:", error);
            setNotification({ type: 'error', message: 'Failed to stop timer.' });
        }
    }
}, [activeTimers, db, userId, appId, setNotification]);
```

#### Step 1.3: Display Coin Balance in Header
**Location**: Find `const Header = ({ setCurrentPage, currentPage })` (around line 811)

**Add coin display state and listener:**

```javascript
const Header = ({ setCurrentPage, currentPage, userId, db }) => {
    const [coinBalance, setCoinBalance] = useState(0);

    // Listen to coin balance changes
    useEffect(() => {
        if (!db || !userId) return;

        const userDocRef = window.doc(db, `users/${userId}`);
        const unsubscribe = window.onSnapshot(userDocRef, (snapshot) => {
            if (snapshot.exists()) {
                setCoinBalance(snapshot.data().coins || 0);
            }
        });

        return () => unsubscribe();
    }, [db, userId]);

    return React.createElement('nav', { ... },
        // ... existing nav items ...

        // Add coin display (before settings icon)
        React.createElement('div', {
            className: "flex items-center gap-2 px-3 py-2 bg-yellow-100 rounded-full",
            title: "Your coins"
        },
            React.createElement('span', { className: "text-2xl" }, "🪙"),
            React.createElement('span', {
                className: "font-semibold text-yellow-700",
                style: { fontWeight: 500 }
            }, coinBalance.toLocaleString())
        )
    );
};
```

**Update Header Usage** (around line 3715):
```javascript
React.createElement(Header, { setCurrentPage, currentPage, userId, db }),
```

---

## 🏠 Feature 2: "My World" Page - Core Structure

### Requirements
- Grid-based world (10x10 tiles initially)
- Placeable items (furniture, decorations)
- Character/avatar in the world
- Shop panel with item categories
- Inventory/coin display

### Database Schema
```javascript
/users/{userId}/world
  └── {
      items: [
        {id: string, itemType: string, x: number, y: number, rotation: number}
      ],
      character: {x: number, y: number, outfit: string, accessories: []}
    }
```

### Item Database (Static)
Create constant object with all available items:

```javascript
const SHOP_ITEMS = {
    furniture: [
        { id: 'desk_wooden', name: 'Wooden Desk', price: 200, emoji: '🪑', size: {w: 2, h: 1} },
        { id: 'chair_study', name: 'Study Chair', price: 150, emoji: '🪑', size: {w: 1, h: 1} },
        { id: 'bookshelf', name: 'Bookshelf', price: 300, emoji: '📚', size: {w: 1, h: 1} },
        { id: 'lamp_desk', name: 'Desk Lamp', price: 100, emoji: '🔦', size: {w: 1, h: 1} },
        { id: 'sofa', name: 'Cozy Sofa', price: 400, emoji: '🛋️', size: {w: 2, h: 1} },
        { id: 'table_coffee', name: 'Coffee Table', price: 250, emoji: '🪵', size: {w: 2, h: 1} },
        { id: 'beanbag', name: 'Bean Bag', price: 200, emoji: '💺', size: {w: 1, h: 1} },
        { id: 'desk_standing', name: 'Standing Desk', price: 500, emoji: '🖥️', size: {w: 2, h: 1} },
    ],
    decorations: [
        { id: 'plant_small', name: 'Small Plant', price: 50, emoji: '🌱', size: {w: 1, h: 1} },
        { id: 'plant_large', name: 'Large Plant', price: 150, emoji: '🪴', size: {w: 1, h: 1} },
        { id: 'clock_wall', name: 'Wall Clock', price: 100, emoji: '🕐', size: {w: 1, h: 1} },
        { id: 'poster', name: 'Motivational Poster', price: 75, emoji: '🖼️', size: {w: 1, h: 1} },
        { id: 'map_world', name: 'World Map', price: 200, emoji: '🗺️', size: {w: 2, h: 1} },
        { id: 'trophy_bronze', name: 'Bronze Trophy', price: 300, emoji: '🥉', size: {w: 1, h: 1} },
        { id: 'trophy_silver', name: 'Silver Trophy', price: 500, emoji: '🥈', size: {w: 1, h: 1} },
        { id: 'trophy_gold', name: 'Gold Trophy', price: 800, emoji: '🥇', size: {w: 1, h: 1} },
        { id: 'rug_small', name: 'Small Rug', price: 150, emoji: '🟫', size: {w: 2, h: 2} },
        { id: 'window', name: 'Window', price: 250, emoji: '🪟', size: {w: 1, h: 1} },
    ],
    special: [
        { id: 'computer', name: 'Computer Setup', price: 600, emoji: '💻', size: {w: 2, h: 1}, bonus: '+10% coins' },
        { id: 'whiteboard', name: 'Whiteboard', price: 400, emoji: '⬜', size: {w: 2, h: 2} },
        { id: 'aquarium', name: 'Aquarium', price: 700, emoji: '🐠', size: {w: 2, h: 1} },
        { id: 'music_player', name: 'Music Player', price: 350, emoji: '🎵', size: {w: 1, h: 1} },
    ]
};
```

### Component Structure

#### Main Component: MyWorld
```javascript
const MyWorld = ({ db, userId, setNotification }) => {
    const [worldData, setWorldData] = useState({ items: [], character: { x: 5, y: 5 } });
    const [coinBalance, setCoinBalance] = useState(0);
    const [selectedItem, setSelectedItem] = useState(null);
    const [shopOpen, setShopOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('furniture');

    // Load world data from Firebase
    useEffect(() => {
        if (!db || !userId) return;

        const userDocRef = window.doc(db, `users/${userId}`);
        const unsubscribe = window.onSnapshot(userDocRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data();
                setCoinBalance(data.coins || 0);
                setWorldData(data.world || { items: [], character: { x: 5, y: 5 } });
            }
        });

        return () => unsubscribe();
    }, [db, userId]);

    // Handle item purchase
    const handlePurchaseItem = async (item) => {
        if (coinBalance < item.price) {
            setNotification({ type: 'error', message: 'Not enough coins!' });
            return;
        }

        // Create new item instance
        const newItem = {
            id: `${item.id}_${Date.now()}`,
            itemType: item.id,
            x: 5, // Center of grid
            y: 5,
            rotation: 0
        };

        const updatedWorld = {
            ...worldData,
            items: [...worldData.items, newItem]
        };

        try {
            const userDocRef = window.doc(db, `users/${userId}`);
            await window.setDoc(userDocRef, {
                world: updatedWorld,
                coins: coinBalance - item.price
            }, { merge: true });

            setNotification({ type: 'success', message: `${item.name} purchased!` });
            setShopOpen(false);
        } catch (error) {
            console.error('Error purchasing item:', error);
            setNotification({ type: 'error', message: 'Failed to purchase item' });
        }
    };

    // Handle item movement
    const handleMoveItem = async (itemId, newX, newY) => {
        const updatedItems = worldData.items.map(item =>
            item.id === itemId ? { ...item, x: newX, y: newY } : item
        );

        const updatedWorld = { ...worldData, items: updatedItems };

        try {
            const userDocRef = window.doc(db, `users/${userId}`);
            await window.setDoc(userDocRef, { world: updatedWorld }, { merge: true });
        } catch (error) {
            console.error('Error moving item:', error);
        }
    };

    // Handle item deletion
    const handleDeleteItem = async (itemId) => {
        const item = worldData.items.find(i => i.id === itemId);
        const itemDefinition = Object.values(SHOP_ITEMS)
            .flat()
            .find(def => def.id === item.itemType);

        const refund = Math.floor(itemDefinition.price * 0.5); // 50% refund

        const updatedWorld = {
            ...worldData,
            items: worldData.items.filter(i => i.id !== itemId)
        };

        try {
            const userDocRef = window.doc(db, `users/${userId}`);
            await window.setDoc(userDocRef, {
                world: updatedWorld,
                coins: coinBalance + refund
            }, { merge: true });

            setNotification({ type: 'success', message: `Item sold for ${refund} coins` });
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    return React.createElement('div', {
        className: "min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-8"
    },
        // Header with coins
        React.createElement('div', {
            className: "max-w-7xl mx-auto mb-6 flex justify-between items-center"
        },
            React.createElement('h1', {
                className: "text-4xl text-gray-800",
                style: { fontWeight: 300 }
            }, "my world"),
            React.createElement('div', {
                className: "flex items-center gap-4"
            },
                React.createElement('div', {
                    className: "flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-lg"
                },
                    React.createElement('span', { className: "text-3xl" }, "🪙"),
                    React.createElement('span', {
                        className: "text-2xl font-semibold text-yellow-700",
                        style: { fontWeight: 600 }
                    }, coinBalance.toLocaleString())
                ),
                React.createElement('button', {
                    onClick: () => setShopOpen(!shopOpen),
                    className: "px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition",
                    style: { fontWeight: 500 }
                }, shopOpen ? 'Close Shop' : '🛒 Open Shop')
            )
        ),

        // Main content area
        React.createElement('div', {
            className: "max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6"
        },
            // World canvas (left side, 2 columns)
            React.createElement('div', {
                className: "lg:col-span-2 bg-white rounded-lg shadow-lg p-6"
            },
                React.createElement(WorldCanvas, {
                    worldData,
                    selectedItem,
                    setSelectedItem,
                    onMoveItem: handleMoveItem,
                    onDeleteItem: handleDeleteItem
                })
            ),

            // Shop panel (right side, 1 column)
            shopOpen && React.createElement('div', {
                className: "lg:col-span-1 bg-white rounded-lg shadow-lg p-6 max-h-[800px] overflow-y-auto"
            },
                React.createElement(ShopPanel, {
                    selectedCategory,
                    setSelectedCategory,
                    onPurchase: handlePurchaseItem,
                    coinBalance
                })
            )
        )
    );
};
```

#### WorldCanvas Component
```javascript
const WorldCanvas = ({ worldData, selectedItem, setSelectedItem, onMoveItem, onDeleteItem }) => {
    const GRID_SIZE = 10;
    const CELL_SIZE = 60; // pixels

    const handleCellClick = (x, y) => {
        if (selectedItem) {
            onMoveItem(selectedItem, x, y);
            setSelectedItem(null);
        }
    };

    return React.createElement('div', {
        className: "relative",
        style: {
            width: GRID_SIZE * CELL_SIZE + 'px',
            height: GRID_SIZE * CELL_SIZE + 'px',
            margin: '0 auto',
            backgroundImage: 'repeating-linear-gradient(0deg, #e5e7eb 0px, #e5e7eb 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, #e5e7eb 0px, #e5e7eb 1px, transparent 1px, transparent 60px)',
            backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
            border: '2px solid #9ca3af',
            borderRadius: '8px'
        }
    },
        // Render grid cells (clickable)
        Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
            const x = index % GRID_SIZE;
            const y = Math.floor(index / GRID_SIZE);

            return React.createElement('div', {
                key: `cell-${x}-${y}`,
                onClick: () => handleCellClick(x, y),
                style: {
                    position: 'absolute',
                    left: x * CELL_SIZE + 'px',
                    top: y * CELL_SIZE + 'px',
                    width: CELL_SIZE + 'px',
                    height: CELL_SIZE + 'px',
                    cursor: selectedItem ? 'crosshair' : 'default'
                }
            });
        }),

        // Render character
        React.createElement('div', {
            style: {
                position: 'absolute',
                left: worldData.character.x * CELL_SIZE + 10 + 'px',
                top: worldData.character.y * CELL_SIZE + 5 + 'px',
                fontSize: '40px',
                zIndex: 100,
                pointerEvents: 'none'
            }
        }, '🧑‍🎓'),

        // Render placed items
        worldData.items.map(item => {
            const itemDef = Object.values(SHOP_ITEMS)
                .flat()
                .find(def => def.id === item.itemType);

            return React.createElement('div', {
                key: item.id,
                onClick: (e) => {
                    e.stopPropagation();
                    setSelectedItem(selectedItem === item.id ? null : item.id);
                },
                className: `absolute transition-all ${selectedItem === item.id ? 'ring-4 ring-blue-500' : ''}`,
                style: {
                    left: item.x * CELL_SIZE + 'px',
                    top: item.y * CELL_SIZE + 'px',
                    width: (itemDef.size.w * CELL_SIZE) + 'px',
                    height: (itemDef.size.h * CELL_SIZE) + 'px',
                    fontSize: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    backgroundColor: selectedItem === item.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                    borderRadius: '4px'
                }
            },
                itemDef.emoji,

                // Delete button (only show when selected)
                selectedItem === item.id && React.createElement('button', {
                    onClick: (e) => {
                        e.stopPropagation();
                        onDeleteItem(item.id);
                    },
                    className: "absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600",
                    style: { fontSize: '12px' }
                }, '×')
            );
        })
    );
};
```

#### ShopPanel Component
```javascript
const ShopPanel = ({ selectedCategory, setSelectedCategory, onPurchase, coinBalance }) => {
    const categories = Object.keys(SHOP_ITEMS);

    return React.createElement('div', { className: "space-y-4" },
        // Category tabs
        React.createElement('div', { className: "flex gap-2 flex-wrap" },
            categories.map(category =>
                React.createElement('button', {
                    key: category,
                    onClick: () => setSelectedCategory(category),
                    className: `px-4 py-2 rounded-lg transition ${
                        selectedCategory === category
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`,
                    style: { fontWeight: 500 }
                }, category.charAt(0).toUpperCase() + category.slice(1))
            )
        ),

        // Items grid
        React.createElement('div', { className: "space-y-3" },
            SHOP_ITEMS[selectedCategory].map(item =>
                React.createElement('div', {
                    key: item.id,
                    className: "border border-gray-200 rounded-lg p-4 hover:border-blue-400 transition"
                },
                    React.createElement('div', { className: "flex items-center gap-3" },
                        React.createElement('span', { className: "text-4xl" }, item.emoji),
                        React.createElement('div', { className: "flex-grow" },
                            React.createElement('h3', {
                                className: "font-semibold text-gray-800",
                                style: { fontWeight: 500 }
                            }, item.name),
                            React.createElement('div', { className: "flex items-center gap-2 text-sm text-gray-600" },
                                React.createElement('span', null, `${item.size.w}×${item.size.h} tiles`),
                                item.bonus && React.createElement('span', {
                                    className: "text-green-600",
                                    style: { fontWeight: 500 }
                                }, item.bonus)
                            )
                        )
                    ),
                    React.createElement('button', {
                        onClick: () => onPurchase(item),
                        disabled: coinBalance < item.price,
                        className: `mt-3 w-full py-2 rounded-lg transition ${
                            coinBalance >= item.price
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`,
                        style: { fontWeight: 500 }
                    },
                        React.createElement('span', null, `🪙 ${item.price} coins`)
                    )
                )
            )
        )
    );
};
```

### Integration Steps

#### Step 2.1: Add "My World" to Navigation
**Location**: In Header component (around line 850)

Add new navigation item:
```javascript
React.createElement('button', {
    onClick: () => setCurrentPage('myworld'),
    title: "My World",
    className: `p-2 rounded-full transition ${currentPage === 'myworld' ? 'bg-calm-100 text-accent-blue' : 'text-calm-600 hover:bg-calm-50'}`,
    style: { color: currentPage === 'myworld' ? '#6B8DD6' : '#7d8ca8' }
},
    React.createElement('span', { className: "text-2xl" }, '🏠')
)
```

#### Step 2.2: Add MyWorld to Page Routing
**Location**: In App component render (around line 3720)

Add:
```javascript
currentPage === 'myworld' && React.createElement(MyWorld, { db, userId, setNotification }),
```

---

## 🧪 Testing Strategy with Playwright MCP

### Test Setup
Create test file: `test-myworld-game.js`

```javascript
const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    // Navigate to app
    await page.goto('http://localhost:8080');

    console.log('🧪 Starting My World Game Tests...\n');

    // Wait for app to load
    await page.waitForTimeout(2000);

    // Test 1: Login and check initial coin balance
    console.log('Test 1: Login and verify initial state');
    await page.click('button:has-text("try as guest")');
    await page.waitForTimeout(2000);

    const initialCoins = await page.textContent('.flex.items-center.gap-2.px-3.py-2.bg-yellow-100');
    console.log(`  ✓ Initial coins: ${initialCoins}`);

    // Test 2: Start and stop timer to earn coins
    console.log('\nTest 2: Earn coins by studying');

    // Find first habit and start timer
    await page.click('button.bg-green-100'); // Start button
    console.log('  ⏱️  Timer started');

    // Wait 10 seconds (simulate study)
    await page.waitForTimeout(10000);

    // Stop timer
    await page.click('button.bg-red-100'); // Stop button
    await page.waitForTimeout(1000);

    const notification = await page.textContent('.fixed');
    console.log(`  ✓ ${notification}`);

    // Check coins increased
    const newCoins = await page.textContent('.flex.items-center.gap-2.px-3.py-2.bg-yellow-100');
    console.log(`  ✓ New coin balance: ${newCoins}`);

    // Test 3: Navigate to My World
    console.log('\nTest 3: Navigate to My World page');
    await page.click('button[title="My World"]');
    await page.waitForTimeout(1000);

    const heading = await page.textContent('h1');
    if (heading.includes('my world')) {
        console.log('  ✓ My World page loaded');
    }

    // Test 4: Open shop
    console.log('\nTest 4: Open shop and view items');
    await page.click('button:has-text("Open Shop")');
    await page.waitForTimeout(500);

    const shopItems = await page.locator('.border.border-gray-200.rounded-lg.p-4').count();
    console.log(`  ✓ Shop opened with ${shopItems} items`);

    // Test 5: Purchase item
    console.log('\nTest 5: Purchase first item');
    const firstBuyButton = page.locator('button:has-text("coins")').first();
    await firstBuyButton.click();
    await page.waitForTimeout(1000);

    const purchaseNotification = await page.textContent('.fixed');
    console.log(`  ✓ ${purchaseNotification}`);

    // Test 6: Verify item appears in world
    console.log('\nTest 6: Verify item placed in world');
    await page.click('button:has-text("Close Shop")');
    await page.waitForTimeout(500);

    const placedItems = await page.locator('.absolute.transition-all').count();
    console.log(`  ✓ ${placedItems} item(s) in world`);

    // Test 7: Select and move item
    console.log('\nTest 7: Move item in world');
    await page.click('.absolute.transition-all').first();
    await page.waitForTimeout(500);
    console.log('  ✓ Item selected (blue ring visible)');

    // Click different position to move
    await page.click('.relative', { position: { x: 300, y: 300 } });
    await page.waitForTimeout(500);
    console.log('  ✓ Item moved to new position');

    // Test 8: Delete item (get refund)
    console.log('\nTest 8: Sell item for refund');
    await page.click('.absolute.transition-all').first();
    await page.waitForTimeout(500);
    await page.click('button.bg-red-500'); // Delete button
    await page.waitForTimeout(1000);

    const refundNotification = await page.textContent('.fixed');
    console.log(`  ✓ ${refundNotification}`);

    console.log('\n✅ All tests passed!');

    await page.waitForTimeout(3000);
    await browser.close();
})();
```

### Running Tests

```bash
# Start server (if not running)
npm start

# Run Playwright test
npx playwright test test-myworld-game.js

# Or use node
node test-myworld-game.js
```

### Iteration Workflow

1. **Write feature code** → Save index.html
2. **Run Playwright test** → Check console output
3. **Fix issues** → Look for errors in test output
4. **Re-test** → Run again until all tests pass
5. **Manual verification** → Open browser and test UI/UX
6. **Commit** → git add, commit, push

### Test Scenarios to Cover

- [ ] Coin calculation accuracy (different durations)
- [ ] Coin multiplier application (60min, 120min, 180min+)
- [ ] Shop filtering by category
- [ ] Purchase with insufficient funds (error)
- [ ] Purchase with sufficient funds (success)
- [ ] Item placement on grid
- [ ] Item collision detection (optional)
- [ ] Item movement
- [ ] Item deletion + refund
- [ ] Firebase sync across tabs
- [ ] Coin balance persistence
- [ ] World state persistence

---

## 🎯 Success Criteria

### Phase 1 (MVP) ✓
- [x] Coin earning system working (base + multipliers)
- [x] Coin balance displayed in header
- [x] My World page accessible from navigation
- [x] Shop with 3 categories (furniture, decorations, special)
- [x] Item purchase system (deduct coins, add to world)
- [x] Grid-based world canvas
- [x] Item placement and movement
- [x] Item deletion with 50% refund
- [x] Character displayed in world
- [x] All data persists in Firebase

### Phase 2 (Polish)
- [ ] Smooth animations for coin earning
- [ ] Item rotation (90° increments)
- [ ] Collision detection (prevent overlapping)
- [ ] Undo/redo for placements
- [ ] World themes (backgrounds)
- [ ] Achievement items (unlockable)
- [ ] Sound effects (optional)

### Phase 3 (Advanced)
- [ ] Multiple rooms
- [ ] Character movement (click-to-walk)
- [ ] Character customization shop
- [ ] Daily login bonuses
- [ ] Quest system
- [ ] Social features (visit friends' worlds)

---

## 🐛 Troubleshooting Guide

### Issue: Coins not updating after study session
**Solution**: Check `stopTimer` function includes coin calculation and Firebase update

### Issue: Items not appearing in world
**Solution**: Verify Firebase world structure matches schema, check console for errors

### Issue: Shop items not loading
**Solution**: Ensure SHOP_ITEMS object is defined before MyWorld component

### Issue: Grid not rendering correctly
**Solution**: Check CELL_SIZE and GRID_SIZE calculations, verify CSS styles

### Issue: Firebase permission denied
**Solution**: Check Firestore security rules allow read/write for authenticated users

### Issue: Coin balance shows NaN
**Solution**: Initialize coins to 0 if undefined: `snapshot.data().coins || 0`

---

## 📚 Additional Features (Future)

### Item Crafting (Growtopia-style)
- Combine 2 items to create rare items
- Crafting recipes stored in database
- Special animations for crafting success

### Pet System
- Pets that follow character
- Feed with study coins
- Pets level up with study hours
- Different pet types unlockable

### Daily Quests
- "Study for 30 minutes" → +100 bonus coins
- "Place 3 decorations" → +50 coins
- "Visit a friend's world" → +75 coins

### Seasonal Events
- Limited-time items (holidays)
- Special decorations (Halloween, Christmas)
- Bonus coin multipliers during events

---

## 🚀 Implementation Checklist

Use this checklist to track progress:

**Currency System:**
- [ ] Add calculateCoinsEarned function
- [ ] Modify stopTimer to award coins
- [ ] Add coins field to user profile
- [ ] Display coin balance in header
- [ ] Test multiplier calculations

**My World Page:**
- [ ] Define SHOP_ITEMS constant
- [ ] Create MyWorld component
- [ ] Create WorldCanvas component
- [ ] Create ShopPanel component
- [ ] Add navigation to My World
- [ ] Add page routing

**Item System:**
- [ ] Implement purchase flow
- [ ] Implement placement system
- [ ] Implement movement system
- [ ] Implement deletion system
- [ ] Add character display

**Testing:**
- [ ] Create Playwright test file
- [ ] Test coin earning
- [ ] Test shop functionality
- [ ] Test item placement
- [ ] Test Firebase persistence
- [ ] Manual UI/UX testing

**Polish:**
- [ ] Add animations
- [ ] Improve styling
- [ ] Add sound effects (optional)
- [ ] Mobile responsive design
- [ ] Error handling

---

## 💡 Tips for LLM Implementation

1. **Work incrementally**: Implement one component at a time, test, then move to next
2. **Use Playwright early**: Write tests before implementing features
3. **Follow existing patterns**: Match the React.createElement style used throughout
4. **Console.log everything**: Debug by logging state changes
5. **Test in browser**: Open DevTools and inspect Firebase data
6. **Check Firebase rules**: Ensure permissions allow read/write
7. **Commit frequently**: Small commits make debugging easier

---

## 📞 Ready to Start?

You now have everything needed to implement this feature. Follow the steps in order:

1. Start with currency system (Feature 1)
2. Test coin earning with Playwright
3. Implement My World page (Feature 2)
4. Test item system with Playwright
5. Polish and refine
6. Deploy!

Good luck building an amazing gamification system! 🎮✨

---

## ❌ Rejected Implementation (Not Realistic Enough)

**Status**: Reverted - User feedback indicated these changes were "not realistic enough"

**User Request**: "make the ingame tokens just a simple dollar sign and the world a world symbol. allow the user to move around in the house and make the world green."

### Changes That Were Made (Then Reverted)

#### 1. Currency Symbol Change (🪙 → $)

**Locations Modified**:
- Header component coin display (line ~230)
- MyWorld component coin display (line ~422)
- ShopPanel purchase buttons (line ~624)

**Original Code**:
```javascript
React.createElement('span', { className: "text-2xl" }, "🪙")
```

**Changed To**:
```javascript
React.createElement('span', { className: "text-2xl" }, "$")
```

**Why Rejected**: Simple dollar sign was too plain, lacked visual appeal and gamification feel. The coin emoji (🪙) provided better visual feedback and game-like atmosphere.

---

#### 2. Character Change (🧑‍🎓 → 🌍)

**Location Modified**: WorldCanvas component (line ~523)

**Original Code**:
```javascript
// Render character
React.createElement('div', {
    style: {
        position: 'absolute',
        left: worldData.character.x * CELL_SIZE + 10 + 'px',
        top: worldData.character.y * CELL_SIZE + 5 + 'px',
        fontSize: '40px',
        zIndex: 100,
        pointerEvents: 'none'
    }
}, '🧑‍🎓'),
```

**Changed To**:
```javascript
// Render character (world symbol)
React.createElement('div', {
    style: {
        position: 'absolute',
        left: worldData.character.x * CELL_SIZE + 10 + 'px',
        top: worldData.character.y * CELL_SIZE + 5 + 'px',
        fontSize: '40px',
        zIndex: 100,
        pointerEvents: 'auto',
        cursor: 'pointer'
    },
    onClick: () => setCharacterSelected(!characterSelected)
}, '🌍'),
```

**Why Rejected**: World symbol (🌍) doesn't make sense as a character representation. The student emoji (🧑‍🎓) better represents the user studying and building their study world. A globe is not something that would "move around" in a room.

---

#### 3. Character Movement System

**Location Modified**: MyWorld component

**New State Added**:
```javascript
const [characterSelected, setCharacterSelected] = useState(false);
```

**New Handler Function Added**:
```javascript
const handleMoveCharacter = async (newX, newY) => {
    const updatedWorld = {
        ...worldData,
        character: { x: newX, y: newY }
    };

    try {
        const userDocRef = window.doc(db, `users/${userId}`);
        await window.setDoc(userDocRef, { world: updatedWorld }, { merge: true });
        setCharacterSelected(false);
    } catch (error) {
        console.error('Error moving character:', error);
    }
};
```

**Modified WorldCanvas Component**:
- Made character clickable (added `onClick` handler)
- Added selection visual feedback (yellow ring when selected)
- Modified `handleCellClick` to handle character movement

**Full Modified WorldCanvas Code**:
```javascript
const WorldCanvas = ({ worldData, selectedItem, setSelectedItem, onMoveItem, onDeleteItem, characterSelected, setCharacterSelected, onMoveCharacter }) => {
    const GRID_SIZE = 10;
    const CELL_SIZE = 60;

    const handleCellClick = (x, y) => {
        if (characterSelected) {
            // Move character to clicked cell
            onMoveCharacter(x, y);
        } else if (selectedItem) {
            // Move selected item
            onMoveItem(selectedItem, x, y);
            setSelectedItem(null);
        }
    };

    return React.createElement('div', {
        className: "relative",
        style: {
            width: GRID_SIZE * CELL_SIZE + 'px',
            height: GRID_SIZE * CELL_SIZE + 'px',
            margin: '0 auto',
            backgroundColor: '#86efac', // Green background
            backgroundImage: 'repeating-linear-gradient(0deg, rgba(34, 197, 94, 0.3) 0px, rgba(34, 197, 94, 0.3) 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, rgba(34, 197, 94, 0.3) 0px, rgba(34, 197, 94, 0.3) 1px, transparent 1px, transparent 60px)',
            backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
            border: '2px solid #22c55e',
            borderRadius: '8px'
        }
    },
        // Grid cells...
        Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
            const x = index % GRID_SIZE;
            const y = Math.floor(index / GRID_SIZE);

            return React.createElement('div', {
                key: `cell-${x}-${y}`,
                onClick: () => handleCellClick(x, y),
                style: {
                    position: 'absolute',
                    left: x * CELL_SIZE + 'px',
                    top: y * CELL_SIZE + 'px',
                    width: CELL_SIZE + 'px',
                    height: CELL_SIZE + 'px',
                    cursor: (characterSelected || selectedItem) ? 'crosshair' : 'default'
                }
            });
        }),

        // Render character (clickable with selection state)
        React.createElement('div', {
            style: {
                position: 'absolute',
                left: worldData.character.x * CELL_SIZE + 10 + 'px',
                top: worldData.character.y * CELL_SIZE + 5 + 'px',
                fontSize: '40px',
                zIndex: 100,
                pointerEvents: 'auto',
                cursor: 'pointer',
                borderRadius: '50%',
                boxShadow: characterSelected ? '0 0 0 4px rgba(234, 179, 8, 0.6)' : 'none', // Yellow ring when selected
                transition: 'box-shadow 0.2s'
            },
            onClick: (e) => {
                e.stopPropagation();
                setCharacterSelected(!characterSelected);
                setSelectedItem(null); // Deselect any items
            }
        }, '🌍'),

        // Render items...
        worldData.items.map(item => {
            // ... same as before
        })
    );
};
```

**Props Added to WorldCanvas in MyWorld**:
```javascript
React.createElement(WorldCanvas, {
    worldData,
    selectedItem,
    setSelectedItem,
    onMoveItem: handleMoveItem,
    onDeleteItem: handleDeleteItem,
    characterSelected, // NEW
    setCharacterSelected, // NEW
    onMoveCharacter: handleMoveCharacter // NEW
})
```

**Why Rejected**:
- Character movement felt disconnected from the core study-tracking purpose
- The green background made it look like a lawn/outdoor space rather than a study room
- The visual design didn't match the "realistic" aesthetic the user wanted
- The globe character didn't make narrative sense for moving around a room

---

#### 4. Green Background & Grid Lines

**Location Modified**: WorldCanvas component background styling

**Original Styling**:
```javascript
style: {
    backgroundColor: 'transparent', // or white
    backgroundImage: 'repeating-linear-gradient(0deg, #e5e7eb 0px, #e5e7eb 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, #e5e7eb 0px, #e5e7eb 1px, transparent 1px, transparent 60px)',
    border: '2px solid #9ca3af',
}
```

**Changed To**:
```javascript
style: {
    backgroundColor: '#86efac', // Bright green (Tailwind green-300)
    backgroundImage: 'repeating-linear-gradient(0deg, rgba(34, 197, 94, 0.3) 0px, rgba(34, 197, 94, 0.3) 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, rgba(34, 197, 94, 0.3) 0px, rgba(34, 197, 94, 0.3) 1px, transparent 1px, transparent 60px)',
    border: '2px solid #22c55e', // Green border (Tailwind green-500)
}
```

**Why Rejected**:
- Green background felt too vibrant and unrealistic for an indoor study room
- Made the space look like grass/outdoor environment rather than room interior
- Clashed with furniture/decoration items that are designed for indoor spaces
- Reduced visual contrast, making items harder to distinguish
- Didn't match the cozy, realistic study room aesthetic

---

### Summary of Rejection Reasons

**User Feedback**: "hmm i dont love these changes. its not realistic enough."

**Key Issues Identified**:

1. **Visual Realism**: Green lawn-like background didn't match indoor furniture aesthetic
2. **Narrative Coherence**: Globe character doesn't fit study room concept
3. **Design Consistency**: Dollar sign was too plain, lost gamification feel
4. **Feature Relevance**: Character movement felt like feature creep, not core to study tracking
5. **Color Scheme**: Bright green reduced contrast and professional appearance

**Lessons Learned**:

1. **Maintain Thematic Consistency**: Virtual world should feel like a realistic study space, not a game world
2. **Visual Hierarchy**: Game elements (coins) need visual appeal to motivate users
3. **Feature Alignment**: New features should enhance core value (study tracking), not distract
4. **User Testing**: Get feedback on design changes before full implementation
5. **Incremental Changes**: Test one change at a time rather than bundling multiple updates

**Better Alternatives to Consider**:

- **Instead of green background**: Use realistic floor textures (wood, carpet, tile)
- **Instead of globe character**: Keep student emoji or use customizable avatars
- **Instead of character movement**: Focus on room expansion, multiple rooms
- **Instead of dollar sign**: Keep coin emoji or create custom coin icon
- **Color scheme**: Neutral/warm tones for indoor study environment (beige, wood tones, soft blues)

---

### Reversion Process

To revert these changes:

```bash
# Check git status
git status

# View recent commits
git log --oneline -5

# Revert to commit before rejected changes
# (Assuming the last good commit was before these UI changes)
git checkout HEAD~1 -- index.html

# Or revert specific changes manually using Edit tool
```

**Files to Revert**: `/Users/User/Study_tracker_app/index.html`

**Specific Lines to Restore**:
- Line ~230: Restore 🪙 emoji in Header
- Line ~422: Restore 🪙 emoji in MyWorld
- Line ~490-493: Restore gray background in WorldCanvas
- Line ~523: Restore 🧑‍🎓 character emoji
- Line ~624: Restore 🪙 emoji in ShopPanel
- Remove: characterSelected state and handleMoveCharacter function
- Remove: Character selection props from WorldCanvas

**Commit Message for Reversion**:
```
Revert "Add dollar sign currency and character movement"

User feedback indicated these changes were not realistic enough:
- Green background didn't match indoor furniture aesthetic
- Globe character didn't fit study room narrative
- Dollar sign lacked visual appeal for gamification
- Character movement felt disconnected from core purpose

Reverting to previous working state with:
- Coin emoji (🪙) for currency
- Student emoji (🧑‍🎓) for character
- Neutral background for WorldCanvas
- Static character position
```

---
