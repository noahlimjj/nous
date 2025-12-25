
(function () {
    const { useState, useEffect, useMemo } = React;

    // --- Icon Definitions for Habits ---
    const HABIT_ICONS = {
        // Study & Learning
        book: { path: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z", label: "study" },
        brain: { path: "M12 2a5 5 0 0 0-5 5v3a1 1 0 0 0 1 1h1v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2h1a1 1 0 0 0 1-1V7a5 5 0 0 0-5-5z M9 22v-4 M15 22v-4 M12 13v2", label: "research" },
        graduation: { path: "M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5", label: "learning" },

        // Fitness & Health
        dumbbell: { path: "M6.5 6.5h11 M17.5 6.5v11 M6.5 17.5v-11 M17.5 17.5h-11 M4 8v8 M20 8v8 M2 10v4 M22 10v4", label: "gym" },
        martial: { path: "M12 2c1 3 4 5 7 6-1 4-4 7-7 10-3-3-6-6-7-10 3-1 6-3 7-6z", label: "bjj" },
        heart: { path: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z", label: "health" },
        run: { path: "M13 4v4l3 2 M4 15l3-3 3 3 4-4 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z", label: "cardio" },

        // Wellness & Mindfulness
        lotus: { path: "M12 22c-4 0-8-2-8-6 2 1 4 2 8 2s6-1 8-2c0 4-4 6-8 6z M12 2c-2 4-6 6-8 8 2 0 5 1 8 3 3-2 6-3 8-3-2-2-6-4-8-8z", label: "meditation" },
        sunset: { path: "M17 18a5 5 0 1 0-10 0 M12 2v7 M4.22 10.22l1.42 1.42 M1 18h2 M21 18h2 M18.36 11.64l1.42-1.42 M23 22H1 M16 5l-4 4-4-4", label: "nature" },
        footprints: { path: "M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.5 1.5-4 4-4s4 1.5 4 4c.03 2.5-1 3.5-1 5.62V16 M20 16v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.5-1.5-4-4-4s-4 1.5-4 4c-.03 2.5 1 3.5 1 5.62V16 M6 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M18 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4z", label: "walk" },
        flame: { path: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z", label: "sauna" },

        // General
        leaf: { path: "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.77 10-10 10Z M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12", label: "default" },
        star: { path: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z", label: "goal" },
        coffee: { path: "M18 8h1a4 4 0 0 1 0 8h-1 M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z M6 1v3 M10 1v3 M14 1v3", label: "morning" },
        moon: { path: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z", label: "sleep" },
        zap: { path: "M13 2L3 14h9l-1 8 10-12h-9l1-8z", label: "energy" },
        music: { path: "M9 18V5l12-2v13 M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0z M21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z", label: "music" },
        droplet: { path: "M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z", label: "hydrate" }
    };

    // --- Color Palette for Habits ---
    const HABIT_COLORS = [
        { id: 'coral', bg: '#FF6B6B', light: '#FFE5E5', text: '#B91C1C' },
        { id: 'orange', bg: '#F59E0B', light: '#FEF3C7', text: '#B45309' },
        { id: 'yellow', bg: '#FBBF24', light: '#FEF9C3', text: '#A16207' },
        { id: 'green', bg: '#10B981', light: '#D1FAE5', text: '#047857' },
        { id: 'teal', bg: '#14B8A6', light: '#CCFBF1', text: '#0F766E' },
        { id: 'blue', bg: '#3B82F6', light: '#DBEAFE', text: '#1D4ED8' },
        { id: 'indigo', bg: '#6366F1', light: '#E0E7FF', text: '#4338CA' },
        { id: 'purple', bg: '#8B5CF6', light: '#EDE9FE', text: '#6D28D9' },
        { id: 'pink', bg: '#EC4899', light: '#FCE7F3', text: '#BE185D' },
        { id: 'gray', bg: '#6B7280', light: '#F3F4F6', text: '#374151' }
    ];

    // --- Components ---
    const Icon = ({ name, size = 20, className = "" }) => {
        const iconData = HABIT_ICONS[name];
        const path = iconData ? iconData.path : HABIT_ICONS.leaf.path;

        return React.createElement("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            width: size,
            height: size,
            viewBox: "0 0 24 24",
            fill: name === 'check' ? "currentColor" : "none",
            stroke: name === 'check' ? "none" : "currentColor",
            strokeWidth: "1.5",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            className: className
        }, React.createElement("path", { d: path }));
    };

    // System icons (not for habit selection)
    const SystemIcon = ({ name, size = 20, className = "" }) => {
        const icons = {
            check: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
            checkSimple: "M20 6L9 17l-5-5",
            plus: "M12 4v16m8-8H4",
            trash: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
            clock: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
            coins: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
            x: "M6 18L18 6M6 6l12 12",
            fire: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",
            gift: "M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V6a2 2 0 10-2 2h2zm-7.5 0h15.5a1 1 0 011 1v2a1 1 0 01-1 1H4.5a1 1 0 01-1-1V9a1 1 0 011-1z",
            search: "M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z",
            menu: "M4 6h16M4 12h16M4 18h16",
            shoppingBag: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        };
        return React.createElement("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            width: size,
            height: size,
            viewBox: "0 0 24 24",
            fill: name === 'check' ? "currentColor" : "none",
            stroke: name === 'check' ? "none" : "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            className: className
        }, React.createElement("path", { d: icons[name] || "" }));
    };

    // --- CALENDAR STRIP COMPONENT ---
    const CalendarStrip = ({ completionDates = [] }) => {
        const today = new Date();
        const days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(today.getDate() - 2 + i);
            return d;
        });

        return React.createElement("div", { className: "flex items-center justify-between mb-6 overflow-x-auto pb-2 no-scrollbar" },
            days.map((date, i) => {
                const isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth();
                const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase().slice(0, 3);
                const dayNum = date.getDate();

                return React.createElement("div", {
                    key: i,
                    className: `flex flex-col items-center justify-center w-10 h-14 rounded-2xl transition-all flex-shrink-0 mx-0.5 ${isToday
                        ? 'bg-gradient-to-br from-rose-400 to-pink-500 text-white shadow-lg shadow-pink-500/20'
                        : 'text-gray-400 dark:text-slate-500'
                        }`
                },
                    React.createElement("span", { className: "text-[10px] font-light lowercase tracking-wide opacity-80" }, dayName),
                    React.createElement("span", { className: `text-base ${isToday ? 'font-medium' : 'font-light'}` }, dayNum)
                );
            })
        );
    };

    // --- CONFETTI HELPER ---
    const triggerConfetti = () => {
        if (typeof window.confetti === 'function') {
            window.confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
    };

    // --- ICON PICKER COMPONENT ---
    const IconPicker = ({ selectedIcon, onSelect }) => {
        const iconKeys = Object.keys(HABIT_ICONS);

        return React.createElement("div", { className: "grid grid-cols-6 gap-2" },
            iconKeys.map(key =>
                React.createElement("button", {
                    key: key,
                    type: "button",
                    onClick: () => onSelect(key),
                    className: `p-2.5 rounded-xl transition-all ${selectedIcon === key
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`
                },
                    React.createElement(Icon, { name: key, size: 20 })
                )
            )
        );
    };

    // --- COLOR PICKER COMPONENT ---
    const ColorPicker = ({ selectedColor, onSelect }) => {
        return React.createElement("div", { className: "flex gap-2 flex-wrap" },
            HABIT_COLORS.map(color =>
                React.createElement("button", {
                    key: color.id,
                    type: "button",
                    onClick: () => onSelect(color.id),
                    style: { backgroundColor: color.bg },
                    className: `w-8 h-8 rounded-full transition-all ${selectedColor === color.id
                        ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-900 scale-110'
                        : 'hover:scale-105'}`
                })
            )
        );
    };

    // --- MAIN GAMIFICATION TAB ---
    const GamificationTab = ({ user, db, activeTimers, isWidget = false }) => {
        // State
        const [habits, setHabits] = useState([]);
        const [rewards, setRewards] = useState([]);
        const [wallet, setWallet] = useState({ coins: 0, history: [] });
        const [showAddHabit, setShowAddHabit] = useState(false);
        const [showShop, setShowShop] = useState(false);
        const [showAddReward, setShowAddReward] = useState(false);
        const [purchasedRewards, setPurchasedRewards] = useState({});

        // Forms
        const [newHabit, setNewHabit] = useState({ title: "", difficulty: "medium", icon: "leaf", color: "coral" });
        const [newReward, setNewReward] = useState({ title: "", cost: 50 });

        const [userId, setUserId] = useState(user?.uid || user?.id || null);
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'study-tracker-app';

        // Load data on mount from Firestore
        useEffect(() => {
            if (!db || !userId) return;

            const habitsCol = window.collection(db, `/artifacts/${appId}/users/${userId}/habits`);
            const unsubscribeHabits = window.onSnapshot(habitsCol, (snapshot) => {
                const habitsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setHabits(habitsData);
            });

            const rewardsCol = window.collection(db, `/artifacts/${appId}/users/${userId}/rewards`);
            const unsubscribeRewards = window.onSnapshot(rewardsCol, (snapshot) => {
                const rewardsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setRewards(rewardsData);
            });

            const walletDocRef = window.doc(db, `/artifacts/${appId}/users/${userId}/gamification/wallet`);
            const unsubscribeWallet = window.onSnapshot(walletDocRef, (doc) => {
                if (doc.exists()) {
                    setWallet(doc.data());
                } else {
                    window.setDoc(walletDocRef, { coins: 0, history: [] });
                }
            });

            return () => {
                unsubscribeHabits();
                unsubscribeRewards();
                unsubscribeWallet();
            };
        }, [db, userId, appId]);

        // Helper to get color object
        const getColor = (colorId) => HABIT_COLORS.find(c => c.id === colorId) || HABIT_COLORS[0];

        // Handlers
        const addHabit = async (e) => {
            e.preventDefault();
            if (!newHabit.title.trim()) return;
            const habitId = Date.now().toString();
            const habit = {
                id: habitId,
                title: newHabit.title,
                difficulty: newHabit.difficulty,
                icon: newHabit.icon,
                color: newHabit.color,
                streak: 0,
                completedToday: false,
                lastCompleted: null,
                completionDates: [],
                createdAt: new Date().toISOString()
            };
            await window.setDoc(window.doc(db, `/artifacts/${appId}/users/${userId}/habits/${habitId}`), habit);
            setNewHabit({ title: "", difficulty: "medium", icon: "leaf", color: "coral" });
            setShowAddHabit(false);
        };

        const deleteHabit = async (id) => {
            if (confirm('delete this habit?')) {
                await window.deleteDoc(window.doc(db, `/artifacts/${appId}/users/${userId}/habits/${id}`));
            }
        };

        const completeHabit = async (id) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayISO = today.toISOString().split('T')[0];
            const habit = habits.find(h => h.id === id);
            if (!habit || habit.completedToday) return;

            let lastCompletedDate = null;
            if (habit.lastCompleted) {
                lastCompletedDate = new Date(habit.lastCompleted);
                lastCompletedDate.setHours(0, 0, 0, 0);
            }
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            const wasYesterday = lastCompletedDate && lastCompletedDate.getTime() === yesterday.getTime();
            let newStreak = (wasYesterday || !lastCompletedDate) ? (habit.streak || 0) + 1 : 1;
            if (!lastCompletedDate) newStreak = 1;

            let baseCoins = habit.difficulty === 'hard' ? 20 : habit.difficulty === 'medium' ? 10 : 5;
            let multiplier = 1;
            let bonusMsg = "";
            if (newStreak >= 7) { multiplier = 1.4; bonusMsg = " (7 day streak! +40%)"; }
            else if (newStreak >= 5) { multiplier = 1.25; bonusMsg = " (5 day streak! +25%)"; }
            else if (newStreak >= 3) { multiplier = 1.1; bonusMsg = " (3 day streak! +10%)"; }

            const finalCoins = Math.round(baseCoins * multiplier);
            const newDates = [...new Set([...(habit.completionDates || []), todayISO])];

            await window.updateDoc(window.doc(db, `/artifacts/${appId}/users/${userId}/habits/${id}`), {
                streak: newStreak,
                completedToday: true,
                lastCompleted: today.toDateString(),
                completionDates: newDates
            });

            const walletDocRef = window.doc(db, `/artifacts/${appId}/users/${userId}/gamification/wallet`);
            await window.updateDoc(walletDocRef, {
                coins: (wallet.coins || 0) + finalCoins,
                history: [{ id: Date.now(), text: `completed: ${habit.title}${bonusMsg}`, amount: finalCoins, type: 'earn' }, ...(wallet.history || [])].slice(0, 20)
            });

            triggerConfetti();
        };

        const addReward = async (e) => {
            e.preventDefault();
            if (!newReward.title.trim()) return;
            const rewardId = Date.now().toString();
            const reward = { id: rewardId, title: newReward.title, cost: parseInt(newReward.cost), icon: "gift" };
            await window.setDoc(window.doc(db, `/artifacts/${appId}/users/${userId}/rewards/${rewardId}`), reward);
            setNewReward({ title: "", cost: 50 });
            setShowAddReward(false);
        };

        const buyReward = async (id) => {
            const reward = rewards.find(r => r.id === id);
            if ((wallet.coins || 0) >= reward.cost) {
                if (confirm(`purchase ${reward.title} for ${reward.cost} coins?`)) {
                    const walletDocRef = window.doc(db, `/artifacts/${appId}/users/${userId}/gamification/wallet`);
                    await window.updateDoc(walletDocRef, {
                        coins: wallet.coins - reward.cost,
                        history: [{ id: Date.now(), text: `redeemed: ${reward.title}`, amount: -reward.cost, type: 'spend' }, ...(wallet.history || [])].slice(0, 20)
                    });
                    triggerConfetti();
                    setPurchasedRewards(prev => ({ ...prev, [id]: Date.now() }));
                    setTimeout(() => {
                        setPurchasedRewards(prev => { const next = { ...prev }; delete next[id]; return next; });
                    }, 5000);
                }
            } else {
                alert("not enough coins!");
            }
        };

        const deleteReward = async (id) => {
            if (confirm('remove this reward?')) {
                await window.deleteDoc(window.doc(db, `/artifacts/${appId}/users/${userId}/rewards/${id}`));
            }
        };

        const todayDateString = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).toLowerCase();

        // Week days for completion view
        const getWeekDays = () => {
            const today = new Date();
            return Array.from({ length: 5 }, (_, i) => {
                const d = new Date();
                d.setDate(today.getDate() - 4 + i);
                return d.toISOString().split('T')[0];
            });
        };

        const weekDays = getWeekDays();

        return React.createElement("div", { className: `container mx-auto px-4 ${isWidget ? 'py-4' : 'py-8'} max-w-4xl min-h-screen` },

            // Header with coin balance and shop toggle
            React.createElement("div", { className: "flex justify-between items-center mb-6" },
                React.createElement("div", null,
                    React.createElement("h1", { className: "text-2xl font-light text-gray-800 dark:text-white lowercase tracking-tight" },
                        showShop ? "rewards shop" : "habits"
                    ),
                    React.createElement("p", { className: "text-sm font-light text-gray-400 lowercase" }, todayDateString)
                ),
                React.createElement("div", { className: "flex items-center gap-3" },
                    // Coin Balance
                    React.createElement("div", { className: "flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200/50 dark:border-amber-700/30" },
                        React.createElement("span", { className: "text-lg" }, "🪙"),
                        React.createElement("span", { className: "text-lg font-light text-amber-700 dark:text-amber-300" }, wallet.coins || 0)
                    ),
                    // Shop Toggle
                    React.createElement("button", {
                        onClick: () => setShowShop(!showShop),
                        className: `p-2.5 rounded-xl transition-all ${showShop
                            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`
                    }, React.createElement(SystemIcon, { name: showShop ? "check" : "shoppingBag", size: 20 }))
                )
            ),

            // Calendar Strip
            !showShop && React.createElement(CalendarStrip, null),

            // Main Content
            !showShop ? React.createElement(React.Fragment, null,
                // --- HABITS LIST ---
                React.createElement("div", { className: "space-y-3" },
                    habits.length === 0 && React.createElement("div", { className: "text-center py-12" },
                        React.createElement("p", { className: "text-gray-400 font-light lowercase" }, "no habits yet"),
                        React.createElement("p", { className: "text-gray-300 text-sm font-light lowercase mt-1" }, "tap + to add your first habit")
                    ),
                    habits.map(habit => {
                        if (!habit || !habit.title) return null;
                        const color = getColor(habit.color);
                        const completedDays = weekDays.filter(d => (habit.completionDates || []).includes(d)).length;
                        const completionPercent = Math.round((completedDays / 5) * 100);

                        return React.createElement("div", {
                            key: habit.id,
                            className: `group relative rounded-2xl p-4 transition-all border ${habit.completedToday
                                ? 'opacity-60 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                                : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-black/20'}`
                        },
                            React.createElement("div", { className: "flex items-center gap-4" },
                                // Color Badge with Percentage
                                React.createElement("div", {
                                    className: "relative w-12 h-12 rounded-xl flex items-center justify-center text-white text-xs font-light",
                                    style: { backgroundColor: color.bg }
                                },
                                    React.createElement("span", null, `${completionPercent}%`)
                                ),

                                // Week Progress Dots
                                React.createElement("div", { className: "flex gap-1" },
                                    weekDays.map((day, i) => {
                                        const isCompleted = (habit.completionDates || []).includes(day);
                                        return React.createElement("div", {
                                            key: i,
                                            className: `w-5 h-5 rounded-full flex items-center justify-center text-xs transition-all ${isCompleted
                                                ? 'text-white'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600'}`
                                            ,
                                            style: isCompleted ? { backgroundColor: color.bg } : {}
                                        }, isCompleted ? "✓" : "○");
                                    })
                                ),

                                // Habit Info
                                React.createElement("div", { className: "flex-1 min-w-0 ml-2" },
                                    React.createElement("h3", { className: "text-base font-light text-gray-800 dark:text-white lowercase truncate" }, habit.title),
                                    habit.streak > 0 && React.createElement("div", { className: "flex items-center gap-1 text-xs text-gray-400 font-light" },
                                        React.createElement(SystemIcon, { name: "fire", size: 12 }),
                                        React.createElement("span", null, `${habit.streak} day streak`)
                                    )
                                ),

                                // Actions
                                React.createElement("div", { className: "flex items-center gap-2" },
                                    !habit.completedToday && React.createElement("button", {
                                        onClick: (e) => { e.stopPropagation(); deleteHabit(habit.id); },
                                        className: "p-2 text-gray-300 hover:text-red-400 transition opacity-0 group-hover:opacity-100"
                                    },
                                        React.createElement(SystemIcon, { name: "trash", size: 16 })
                                    ),

                                    // Complete Button
                                    React.createElement("button", {
                                        onClick: () => completeHabit(habit.id),
                                        disabled: habit.completedToday,
                                        className: `w-10 h-10 rounded-xl flex items-center justify-center transition-all ${habit.completedToday
                                            ? 'bg-green-500 text-white'
                                            : 'border-2 border-gray-200 dark:border-gray-700 text-gray-400 hover:border-green-400 hover:text-green-500'}`
                                    },
                                        habit.completedToday
                                            ? React.createElement(SystemIcon, { name: "check", size: 20 })
                                            : React.createElement("span", { className: "text-lg font-light" }, "✓")
                                    )
                                )
                            )
                        );
                    })
                ),

                // Floating Action Button
                React.createElement("button", {
                    onClick: () => setShowAddHabit(true),
                    className: "fixed bottom-8 right-6 w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl shadow-xl shadow-blue-500/30 flex items-center justify-center hover:scale-105 transition-transform z-40"
                }, React.createElement(SystemIcon, { name: "plus", size: 24 })),

                // Add Habit Modal
                showAddHabit && React.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" },
                    React.createElement("form", { onSubmit: addHabit, className: "bg-white dark:bg-gray-900 p-6 rounded-3xl w-full max-w-md border border-gray-100 dark:border-gray-800 shadow-2xl" },
                        React.createElement("div", { className: "flex justify-between items-center mb-6" },
                            React.createElement("h3", { className: "text-xl font-light text-gray-800 dark:text-white lowercase" }, "new habit"),
                            React.createElement("button", { type: "button", onClick: () => setShowAddHabit(false), className: "p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition" },
                                React.createElement(SystemIcon, { name: "x", size: 20 })
                            )
                        ),

                        // Title Input
                        React.createElement("input", {
                            type: "text",
                            value: newHabit.title,
                            onChange: e => setNewHabit({ ...newHabit, title: e.target.value }),
                            placeholder: "habit name...",
                            className: "w-full bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white px-4 py-3 rounded-xl mb-4 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none lowercase font-light",
                            autoFocus: true
                        }),

                        // Color Selection
                        React.createElement("div", { className: "mb-4" },
                            React.createElement("label", { className: "block text-sm text-gray-500 dark:text-gray-400 mb-2 lowercase font-light" }, "color"),
                            React.createElement(ColorPicker, { selectedColor: newHabit.color, onSelect: (color) => setNewHabit({ ...newHabit, color }) })
                        ),

                        // Icon Selection
                        React.createElement("div", { className: "mb-4" },
                            React.createElement("label", { className: "block text-sm text-gray-500 dark:text-gray-400 mb-2 lowercase font-light" }, "icon"),
                            React.createElement(IconPicker, { selectedIcon: newHabit.icon, onSelect: (icon) => setNewHabit({ ...newHabit, icon }) })
                        ),

                        // Difficulty Selection
                        React.createElement("div", { className: "mb-6" },
                            React.createElement("label", { className: "block text-sm text-gray-500 dark:text-gray-400 mb-2 lowercase font-light" }, "difficulty"),
                            React.createElement("div", { className: "flex gap-2" },
                                React.createElement("button", {
                                    type: "button",
                                    onClick: () => setNewHabit({ ...newHabit, difficulty: 'easy' }),
                                    className: `flex-1 py-2.5 px-3 rounded-xl text-sm font-light lowercase transition ${newHabit.difficulty === 'easy'
                                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`
                                }, "easy · 5🪙"),
                                React.createElement("button", {
                                    type: "button",
                                    onClick: () => setNewHabit({ ...newHabit, difficulty: 'medium' }),
                                    className: `flex-1 py-2.5 px-3 rounded-xl text-sm font-light lowercase transition ${newHabit.difficulty === 'medium'
                                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`
                                }, "medium · 10🪙"),
                                React.createElement("button", {
                                    type: "button",
                                    onClick: () => setNewHabit({ ...newHabit, difficulty: 'hard' }),
                                    className: `flex-1 py-2.5 px-3 rounded-xl text-sm font-light lowercase transition ${newHabit.difficulty === 'hard'
                                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`
                                }, "hard · 20🪙")
                            )
                        ),

                        React.createElement("button", { type: "submit", className: "w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-light hover:shadow-lg hover:shadow-blue-500/30 transition lowercase" }, "create habit")
                    )
                )
            ) : (
                // --- REWARDS SHOP ---
                React.createElement(React.Fragment, null,
                    React.createElement("div", { className: "grid grid-cols-2 gap-4" },
                        rewards.map(reward => {
                            const isPurchased = !!purchasedRewards[reward.id];
                            return React.createElement("button", {
                                key: reward.id,
                                onClick: () => buyReward(reward.id),
                                disabled: wallet.coins < reward.cost || isPurchased,
                                className: `relative flex flex-col items-center p-6 rounded-2xl transition-all text-center border ${isPurchased
                                    ? 'border-gray-300 bg-gray-100 dark:bg-gray-800 opacity-50'
                                    : wallet.coins >= reward.cost
                                        ? 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10'
                                        : 'bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 opacity-60'}`
                            },
                                isPurchased && React.createElement("div", { className: "absolute inset-0 flex items-center justify-center z-10" },
                                    React.createElement("div", { className: "w-full h-0.5 bg-green-500 absolute rotate-12" })
                                ),
                                React.createElement("div", { className: "text-4xl mb-3" }, "🎁"),
                                React.createElement("h3", { className: "font-light text-gray-800 dark:text-white mb-1 lowercase" }, reward.title),
                                React.createElement("div", { className: "text-blue-500 font-light" }, `${reward.cost} 🪙`),
                                React.createElement("button", {
                                    onClick: (e) => { e.stopPropagation(); deleteReward(reward.id); },
                                    className: "absolute top-2 right-2 text-gray-300 hover:text-red-400 p-1"
                                }, React.createElement(SystemIcon, { name: "x", size: 14 }))
                            );
                        }),
                        // Add Reward Button
                        React.createElement("button", {
                            onClick: () => setShowAddReward(true),
                            className: "flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-gray-400 hover:text-blue-500 hover:border-blue-400 transition min-h-[160px]"
                        },
                            React.createElement(SystemIcon, { name: "plus", size: 28 }),
                            React.createElement("span", { className: "mt-2 font-light lowercase text-sm" }, "add reward")
                        )
                    ),

                    // Add Reward Modal
                    showAddReward && React.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" },
                        React.createElement("form", { onSubmit: addReward, className: "bg-white dark:bg-gray-900 p-6 rounded-3xl w-full max-w-sm border border-gray-100 dark:border-gray-800 shadow-2xl" },
                            React.createElement("div", { className: "flex justify-between items-center mb-6" },
                                React.createElement("h3", { className: "text-xl font-light text-gray-800 dark:text-white lowercase" }, "new reward"),
                                React.createElement("button", { type: "button", onClick: () => setShowAddReward(false), className: "p-2 text-gray-400 hover:text-gray-600 rounded-lg" },
                                    React.createElement(SystemIcon, { name: "x", size: 20 })
                                )
                            ),
                            React.createElement("input", {
                                type: "text",
                                value: newReward.title,
                                onChange: e => setNewReward({ ...newReward, title: e.target.value }),
                                placeholder: "reward name...",
                                className: "w-full bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white px-4 py-3 rounded-xl mb-4 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none lowercase font-light",
                                autoFocus: true
                            }),
                            React.createElement("input", {
                                type: "number",
                                value: newReward.cost,
                                onChange: e => setNewReward({ ...newReward, cost: e.target.value }),
                                placeholder: "cost in coins",
                                className: "w-full bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white px-4 py-3 rounded-xl mb-6 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none font-light"
                            }),
                            React.createElement("button", { type: "submit", className: "w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-light hover:shadow-lg transition lowercase" }, "create reward")
                        )
                    )
                )
            )
        );
    };

    window.HabitsTab = GamificationTab;
})();
