(function () {
    const { useState, useEffect, useMemo } = React;

    // --- Components ---

    const Icon = ({ name, size = 20, className = "" }) => {
        const icons = {
            check: "M20 6L9 17l-5-5",
            plus: "M12 4v16m8-8H4",
            trash: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
            clock: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
            coins: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
            shoppingBag: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
            fire: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
            x: "M6 18L18 6M6 6l12 12",
            gift: "M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V6a2 2 0 10-2 2h2zm-7.5 0h15.5a1 1 0 011 1v2a1 1 0 01-1 1H4.5a1 1 0 01-1-1V9a1 1 0 011-1z",
            leaf: "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.77 10-10 10Z M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12",
            home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
            calendar: "M19 4h-1V3a1 1 0 0 0-2 0v1H8V3a1 1 0 0 0-2 0v1H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V9h14v11z",
            search: "M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z",
            menu: "M4 6h16M4 12h16M4 18h16",
            user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
            zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
            book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
        };
        return React.createElement("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            width: size,
            height: size,
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            className: className
        }, React.createElement("path", { d: icons[name] || "" }));
    };

    // --- TIMER MODAL COMPONENT ---
    const TimerModal = ({ habit, onClose, db, user }) => {
        const [elapsed, setElapsed] = useState(0);
        const [isRunning, setIsRunning] = useState(false);
        const [timerData, setTimerData] = useState(null);

        useEffect(() => {
            const existing = window.OfflineTimerManager.getTimers()[habit.id];
            if (existing) {
                setTimerData(existing);
                setIsRunning(existing.isRunning);
                setElapsed(window.OfflineTimerManager.getElapsedTime(habit.id));
            } else {
                const newTimer = window.OfflineTimerManager.start(habit.id, habit.title);
                setTimerData(newTimer);
                setIsRunning(true);
            }

            const interval = setInterval(() => {
                setElapsed(window.OfflineTimerManager.getElapsedTime(habit.id));
            }, 1000);

            return () => clearInterval(interval);
        }, [habit.id]);

        const toggleTimer = () => {
            if (isRunning) {
                window.OfflineTimerManager.pause(habit.id);
                setIsRunning(false);
            } else {
                window.OfflineTimerManager.resume(habit.id);
                setIsRunning(true);
            }
        };

        const finishSession = async () => {
            window.OfflineTimerManager.stop(habit.id, habit.title);
            if (navigator.onLine && db && user?.id) await window.OfflineTimerManager.sync(db, user.id);
            onClose();
        };

        const formatTime = (ms) => {
            const totalSeconds = Math.floor(ms / 1000);
            const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
            const s = (totalSeconds % 60).toString().padStart(2, '0');
            return `${m}:${s}`;
        };

        return React.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" },
            React.createElement("div", { className: "bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl w-full max-w-sm flex flex-col items-center gap-6 border border-gray-100 dark:border-slate-700" },
                React.createElement("div", { className: "text-center" },
                    React.createElement("h3", { className: "text-lg font-medium text-gray-500 dark:text-gray-400 lowercase mb-1" }, "active session"),
                    React.createElement("h2", { className: "text-2xl font-light text-gray-900 dark:text-white" }, habit.title)
                ),
                React.createElement("div", { className: "text-7xl font-mono font-light text-indigo-600 dark:text-indigo-400 tabular-nums tracking-tight my-4" },
                    formatTime(elapsed)
                ),
                React.createElement("div", { className: "flex items-center gap-4 w-full" },
                    React.createElement("button", {
                        onClick: toggleTimer,
                        className: `flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 transition-all ${isRunning ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' : 'bg-green-100 text-green-600 hover:bg-green-200'}`
                    },
                        React.createElement(Icon, { name: isRunning ? "pause" : "play", size: 24 }),
                        React.createElement("span", { className: "font-medium lowercase" }, isRunning ? "pause" : "resume")
                    ),
                    React.createElement("button", {
                        onClick: finishSession,
                        className: "flex-1 py-4 bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-300 rounded-2xl flex items-center justify-center gap-2 transition-all"
                    },
                        React.createElement(Icon, { name: "square", size: 20 }),
                        React.createElement("span", { className: "font-medium lowercase" }, "finish")
                    )
                )
            )
        );
    };

    // --- CALENDAR STRIP COMPONENT ---
    const CalendarStrip = () => {
        const today = new Date();
        // Generate last 2 days, today, next 4 days (Total 7)
        const days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(today.getDate() - 2 + i);
            return d;
        });

        return React.createElement("div", { className: "flex items-center justify-between mb-8 overflow-x-auto pb-2 no-scrollbar" },
            days.map((date, i) => {
                const isToday = date.getDate() === today.getDate();
                const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                const dayNum = date.getDate();

                return React.createElement("div", {
                    key: i,
                    className: `flex flex-col items-center justify-center w-12 h-16 rounded-2xl transition-all flex-shrink-0 mx-1 ${isToday
                        ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30 scale-105'
                        : 'bg-white dark:bg-slate-800 text-gray-400 dark:text-slate-500 border border-transparent dark:border-slate-700'
                        }`
                },
                    React.createElement("span", { className: "text-[10px] font-medium uppercase tracking-wide opacity-80" }, dayName),
                    React.createElement("span", { className: "text-lg font-bold" }, dayNum)
                );
            })
        );
    };

    // --- CONFETTI HELPER ---
    const triggerConfetti = () => {
        if (typeof window.confetti === 'function') {
            window.confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        } else {
            console.warn('Canvas confetti library not loaded');
        }
    };

    const GamificationTab = ({ user, db, activeTimers, isWidget = false }) => {
        // State
        const [habits, setHabits] = useState([]);
        const [rewards, setRewards] = useState([]);
        const [wallet, setWallet] = useState({ coins: 0, history: [] });
        const [showAddHabit, setShowAddHabit] = useState(false);
        const [showShop, setShowShop] = useState(false);
        const [showAddReward, setShowAddReward] = useState(false);
        const [purchasedRewards, setPurchasedRewards] = useState({}); // Track purchased ID -> timestamp

        // Forms
        const [newHabit, setNewHabit] = useState({ title: "", difficulty: "medium" });
        const [newReward, setNewReward] = useState({ title: "", cost: 50 });

        const [userId, setUserId] = useState(user?.uid || user?.id || null);
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'study-tracker-app';

        // Load data on mount from Firestore
        useEffect(() => {
            if (!db || !userId) return;

            // Habits Collection
            const habitsCol = window.collection(db, `/artifacts/${appId}/users/${userId}/habits`);
            const unsubscribeHabits = window.onSnapshot(habitsCol, (snapshot) => {
                const habitsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setHabits(habitsData);

                // --- RESTORE / SEED DATA LOGIC ---
                const desiredHabits = [
                    { title: "Make bed", icon: "home", difficulty: "easy" },
                    { title: "Meditate in the morning", icon: "user", difficulty: "medium" },
                    { title: "BJJ", icon: "zap", difficulty: "hard" },
                    { title: "Medical School", icon: "book", difficulty: "hard" },
                    { title: "Research", icon: "search", difficulty: "hard" },
                    { title: "Anki", icon: "book", difficulty: "medium" }
                ];

                desiredHabits.forEach(async (seed) => {
                    const exists = habitsData.some(h => h.title && h.title.toLowerCase() === seed.title.toLowerCase());
                    if (!exists) {
                        const habitId = Date.now().toString() + Math.random().toString(36).substr(2, 5);
                        const newH = {
                            id: habitId,
                            title: seed.title,
                            difficulty: seed.difficulty,
                            streak: 0,
                            completedToday: false,
                            lastCompleted: null,
                            completionDates: [],
                            createdAt: new Date().toISOString(),
                            icon: seed.icon
                        };
                        await window.setDoc(window.doc(db, `/artifacts/${appId}/users/${userId}/habits/${habitId}`), newH);
                    }
                });
            });

            // Rewards Collection
            const rewardsCol = window.collection(db, `/artifacts/${appId}/users/${userId}/rewards`);
            const unsubscribeRewards = window.onSnapshot(rewardsCol, (snapshot) => {
                const rewardsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setRewards(rewardsData);
            });

            // Wallet Doc
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

        // Handlers
        const addHabit = async (e) => {
            e.preventDefault();
            if (!newHabit.title.trim()) return;
            const habitId = Date.now().toString();
            const habit = {
                id: habitId,
                title: newHabit.title,
                difficulty: newHabit.difficulty,
                streak: 0,
                completedToday: false,
                lastCompleted: null,
                completionDates: [],
                createdAt: new Date().toISOString(),
                icon: "leaf" // Default icon
            };
            await window.setDoc(window.doc(db, `/artifacts/${appId}/users/${userId}/habits/${habitId}`), habit);
            setNewHabit({ title: "", difficulty: "medium" });
            setShowAddHabit(false);
        };

        const deleteHabit = async (id) => {
            if (confirm('Delete this habit?')) {
                await window.deleteDoc(window.doc(db, `/artifacts/${appId}/users/${userId}/habits/${id}`));
            }
        };

        const completeHabit = async (id) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayISO = today.toISOString().split('T')[0];
            const habit = habits.find(h => h.id === id);
            if (habit.completedToday) return;

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
                history: [{ id: Date.now(), text: `Completed: ${habit.title}${bonusMsg}`, amount: finalCoins, type: 'earn' }, ...(wallet.history || [])].slice(0, 20)
            });
        };

        const addReward = async (e) => {
            e.preventDefault();
            if (!newReward.title.trim()) return;
            const rewardId = Date.now().toString();
            const reward = {
                id: rewardId,
                title: newReward.title,
                cost: parseInt(newReward.cost),
                icon: "gift"
            };
            await window.setDoc(window.doc(db, `/artifacts/${appId}/users/${userId}/rewards/${rewardId}`), reward);
            setNewReward({ title: "", cost: 50 });
            setShowAddReward(false);
        };

        const buyReward = async (id) => {
            const reward = rewards.find(r => r.id === id);
            if ((wallet.coins || 0) >= reward.cost) {
                if (confirm(`Purchase ${reward.title} for ${reward.cost} coins?`)) {
                    // Update Wallet
                    const walletDocRef = window.doc(db, `/artifacts/${appId}/users/${userId}/gamification/wallet`);
                    await window.updateDoc(walletDocRef, {
                        coins: wallet.coins - reward.cost,
                        history: [{ id: Date.now(), text: `Redeemed: ${reward.title}`, amount: -reward.cost, type: 'spend' }, ...(wallet.history || [])].slice(0, 20)
                    });

                    // Trigger Effects
                    triggerConfetti();
                    alert("Congratulations! reward claimed");

                    // Mark as purchased temporarily (cross out)
                    setPurchasedRewards(prev => ({ ...prev, [id]: Date.now() }));

                    // Reset visual state after 5 seconds
                    setTimeout(() => {
                        setPurchasedRewards(prev => {
                            const next = { ...prev };
                            delete next[id];
                            return next;
                        });
                    }, 5000);
                }
            } else {
                alert("Not enough coins!");
            }
        };

        const deleteReward = async (id) => {
            if (confirm('Remove this reward?')) {
                await window.deleteDoc(window.doc(db, `/artifacts/${appId}/users/${userId}/rewards/${id}`));
            }
        };

        const [timerHabit, setTimerHabit] = useState(null);

        // Date String for Bottom
        const todayDateString = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

        return React.createElement("div", { className: `container mx-auto px-4 ${isWidget ? 'py-4' : 'py-8'} max-w-4xl min-h-screen text-slate-800 font-sans` },

            // Top Bar: Today's Header (Widget Only) or Shop Header
            !isWidget ? React.createElement("div", { className: "flex justify-between items-center mb-8" },
                React.createElement("h1", { className: "text-3xl font-bold tracking-tight text-gray-900 dark:text-white lowercase" }, "rewards shop"),
                React.createElement("div", { className: "flex items-center gap-3 bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-sm border border-gray-100 dark:border-slate-700" },
                    React.createElement("div", { className: "text-yellow-500" }, React.createElement(Icon, { name: "coins", size: 24 })),
                    React.createElement("span", { className: "text-xl font-bold font-mono dark:text-white" }, wallet.coins)
                )
            ) : React.createElement(React.Fragment, null,
                // Header for Widget Mode (Today View)
                React.createElement("div", { className: "flex justify-between items-center mb-6" },
                    React.createElement("div", { className: "flex items-center gap-3" },
                        React.createElement("div", { className: "p-2 bg-transparent rounded-xl" },
                            // Using menu icon or similar? keeping simple
                            React.createElement(Icon, { name: "menu", size: 24, className: "text-gray-900 dark:text-white" })
                        ),
                        React.createElement("h1", { className: "text-2xl font-bold text-gray-900 dark:text-white lowercase" }, "today")
                    ),
                    React.createElement("div", { className: "flex items-center gap-4" },
                        React.createElement(Icon, { name: "search", size: 24, className: "text-gray-400" }),
                        React.createElement(Icon, { name: "clock", size: 24, className: "text-gray-400" }),
                        React.createElement("div", { className: "w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 font-bold text-xs" }, "?")
                    )
                )
            ),

            // Main Content
            (isWidget && !showShop) ? React.createElement(React.Fragment, null,
                // --- HABITS LIST ---
                React.createElement("div", { className: "space-y-4 mt-6" },
                    habits.map(habit => {
                        if (!habit || !habit.title) return null; // Filter undefined
                        return React.createElement("div", {
                            key: habit.id,
                            className: `group relative rounded-3xl p-5 transition-all flex items-center justify-between ${habit.completedToday
                                ? 'opacity-60'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`
                        },

                            // Left: Icon & Info
                            React.createElement("div", { className: "flex items-center gap-4 flex-1 min-w-0" },
                                // Icon Box - Simplified
                                React.createElement("div", { className: "text-gray-900 dark:text-white" },
                                    React.createElement(Icon, { name: habit.icon || "leaf", size: 24 })
                                ),
                                React.createElement("div", { className: "flex-1" },
                                    React.createElement("h3", { className: `text-lg font-medium text-gray-900 dark:text-white leading-tight mb-0.5 lowercase` }, habit.title),
                                    React.createElement("div", { className: "flex items-center gap-2" },
                                        React.createElement("span", { className: "text-gray-400 text-xs font-bold uppercase tracking-wider" }, "HABIT"),
                                        habit.streak > 0 && React.createElement("span", { className: "text-gray-400 text-xs" }, ` • ${habit.streak} streak`)
                                    )
                                )
                            ),

                            // Right: Checkmark Button
                            React.createElement("div", { className: "flex items-center gap-4" },
                                // Delete/Timer Actions (Hover) - Moved here to match request
                                !habit.completedToday && React.createElement("div", { className: "flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity" },
                                    React.createElement("button", { onClick: (e) => { e.stopPropagation(); deleteHabit(habit.id); }, className: "p-2 text-gray-400 hover:text-red-500 transition" },
                                        React.createElement(Icon, { name: "trash", size: 18 })
                                    )
                                ),

                                // The Big Tick
                                React.createElement("button", {
                                    onClick: () => completeHabit(habit.id),
                                    disabled: habit.completedToday,
                                    className: `w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${habit.completedToday
                                        ? 'bg-green-500 text-white shadow-md scale-110'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'}`
                                }, React.createElement(Icon, { name: "check", size: 20, strokeWidth: 3 }))
                            )
                        );
                    })
                ),

                // Date at the bottom as requested
                React.createElement("div", { className: "mt-12 text-center" },
                    React.createElement("p", { className: "text-gray-400 uppercase tracking-widest text-sm" }, todayDateString)
                ),

                // Floating Action Button (FAB)
                React.createElement("button", {
                    onClick: () => setShowAddHabit(true),
                    className: "fixed bottom-8 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 transition-transform z-40"
                }, React.createElement(Icon, { name: "plus", size: 28 })),

                // Render Timer Modal
                timerHabit && React.createElement(TimerModal, {
                    habit: timerHabit,
                    db: db,
                    user: { id: userId },
                    onClose: () => setTimerHabit(null)
                }),

                // Add Habit Form Modal
                showAddHabit && React.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" },
                    React.createElement("form", { onSubmit: addHabit, className: "bg-white dark:bg-gray-900 p-6 rounded-3xl w-full max-w-sm border border-gray-100 dark:border-gray-800" },
                        React.createElement("div", { className: "flex justify-between items-center mb-6" },
                            React.createElement("h3", { className: "text-xl font-bold text-gray-900 dark:text-white lowercase" }, "new habit"),
                            React.createElement("button", { type: "button", onClick: () => setShowAddHabit(false), className: "text-gray-500 hover:text-white" },
                                React.createElement(Icon, { name: "x", size: 24 })
                            )
                        ),
                        React.createElement("input", {
                            type: "text",
                            value: newHabit.title,
                            onChange: e => setNewHabit({ ...newHabit, title: e.target.value }),
                            placeholder: "habit title...",
                            className: "w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 rounded-xl mb-4 border-none focus:ring-2 focus:ring-blue-500 outline-none lowercase",
                            autoFocus: true
                        }),
                        React.createElement("button", { type: "submit", className: "w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition lowercase" }, "create")
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
                                className: `relative flex flex-col items-center p-6 rounded-3xl transition-all text-center border-2
                                    ${isPurchased ? 'border-gray-800 bg-gray-900 opacity-50 line-through' :
                                        wallet.coins >= reward.cost ? 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 hover:border-blue-500' : 'bg-gray-50 dark:bg-slate-900 border-transparent opacity-60'}`
                            },
                                isPurchased && React.createElement("div", { className: "absolute inset-0 flex items-center justify-center z-10" },
                                    React.createElement("div", { className: "w-full h-1 bg-red-500 absolute rotate-12" })
                                ),
                                React.createElement("div", { className: "text-4xl mb-3" }, "🎁"),
                                React.createElement("h3", { className: "font-bold text-gray-900 dark:text-white mb-1 lowercase" }, reward.title),
                                React.createElement("div", { className: "text-blue-500 font-mono font-bold" }, reward.cost + " coins"),
                                React.createElement("button", {
                                    onClick: (e) => { e.stopPropagation(); deleteReward(reward.id); },
                                    className: "absolute top-2 right-2 text-gray-400 hover:text-red-500"
                                }, React.createElement(Icon, { name: "x", size: 16 }))
                            );
                        }),
                        React.createElement("button", {
                            onClick: () => setShowAddReward(true),
                            className: "flex flex-col items-center justify-center p-6 rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-700 text-gray-400 hover:text-blue-500 hover:border-blue-500 transition min-h-[160px]"
                        },
                            React.createElement(Icon, { name: "plus", size: 32 }),
                            React.createElement("span", { className: "mt-2 font-medium lowercase" }, "add reward")
                        )
                    )
                )
            ),
            // Add Reward Modal
            showAddReward && React.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" },
                React.createElement("form", { onSubmit: addReward, className: "bg-white dark:bg-gray-900 p-6 rounded-3xl w-full max-w-sm border border-gray-100 dark:border-gray-800" },
                    React.createElement("div", { className: "flex justify-between items-center mb-6" },
                        React.createElement("h3", { className: "text-xl font-bold text-gray-900 dark:text-white lowercase" }, "new reward"),
                        React.createElement("button", { type: "button", onClick: () => setShowAddReward(false), className: "text-gray-500 hover:text-white" },
                            React.createElement(Icon, { name: "x", size: 24 })
                        )
                    ),
                    React.createElement("input", {
                        type: "text",
                        value: newReward.title,
                        onChange: e => setNewReward({ ...newReward, title: e.target.value }),
                        placeholder: "reward title...",
                        className: "w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 rounded-xl mb-4 border-none focus:ring-2 focus:ring-blue-500 outline-none lowercase",
                        autoFocus: true
                    }),
                    React.createElement("input", {
                        type: "number",
                        value: newReward.cost,
                        onChange: e => setNewReward({ ...newReward, cost: e.target.value }),
                        placeholder: "cost",
                        className: "w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 rounded-xl mb-6 border-none focus:ring-2 focus:ring-blue-500 outline-none"
                    }),
                    React.createElement("button", { type: "submit", className: "w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition lowercase" }, "create")
                )
            )
        );
    };

    window.HabitsTab = GamificationTab;
})();
