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
            leaf: "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.77 10-10 10Z M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"
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
            if (navigator.onLine) await window.OfflineTimerManager.sync(db, user.id);
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
    const GamificationTab = ({ user, db, activeTimers, isWidget = false }) => {
        // State
        const [habits, setHabits] = useState([]);
        const [rewards, setRewards] = useState([]);
        const [wallet, setWallet] = useState({ coins: 0, history: [] });
        const [showAddHabit, setShowAddHabit] = useState(false);
        const [showShop, setShowShop] = useState(false);
        const [showAddReward, setShowAddReward] = useState(false);

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

                // Migration: Check for local habits and migrate ONE TIME if Firestore is empty
                const localHabits = JSON.parse(localStorage.getItem('nous_habits') || '[]');
                if (habitsData.length === 0 && localHabits.length > 0) {
                    console.log("Migrating local habits to Firestore...");
                    localHabits.forEach(async (h) => {
                        const { id, ...data } = h;
                        await window.setDoc(window.doc(db, `/artifacts/${appId}/users/${userId}/habits/${h.id}`), data);
                    });
                    localStorage.removeItem('nous_habits');
                }
            });

            // Rewards Collection
            const rewardsCol = window.collection(db, `/artifacts/${appId}/users/${userId}/rewards`);
            const unsubscribeRewards = window.onSnapshot(rewardsCol, (snapshot) => {
                const rewardsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setRewards(rewardsData);

                // Migration
                const localRewards = JSON.parse(localStorage.getItem('nous_rewards') || '[]');
                if (rewardsData.length === 0 && localRewards.length > 0) {
                    localRewards.forEach(async (r) => {
                        const { id, ...data } = r;
                        await window.setDoc(window.doc(db, `/artifacts/${appId}/users/${userId}/rewards/${r.id}`), r);
                    });
                    localStorage.removeItem('nous_rewards');
                }
            });

            // Wallet Doc
            const walletDocRef = window.doc(db, `/artifacts/${appId}/users/${userId}/gamification/wallet`);
            const unsubscribeWallet = window.onSnapshot(walletDocRef, (doc) => {
                if (doc.exists()) {
                    setWallet(doc.data());
                } else {
                    // Initialize or migrate
                    const localWallet = JSON.parse(localStorage.getItem('nous_wallet') || '{"coins": 0, "history": []}');
                    if (localWallet.coins > 0 || localWallet.history.length > 0) {
                        window.setDoc(walletDocRef, localWallet);
                        localStorage.removeItem('nous_wallet');
                    } else {
                        window.setDoc(walletDocRef, { coins: 0, history: [] });
                    }
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
                createdAt: new Date().toISOString()
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

            // Streak Logic
            let lastCompletedDate = null;
            if (habit.lastCompleted) {
                lastCompletedDate = new Date(habit.lastCompleted);
                lastCompletedDate.setHours(0, 0, 0, 0);
            }

            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            const wasYesterday = lastCompletedDate && lastCompletedDate.getTime() === yesterday.getTime();

            // Calculate new streak
            // If it was yesterday, increment. If it's new (!last), start at 1. If missed, reset to 1.
            let newStreak = (wasYesterday || !lastCompletedDate) ? (habit.streak || 0) + 1 : 1;
            if (!lastCompletedDate) newStreak = 1; // Double check for safety on fresh habit

            // Bonus Logic
            let baseCoins = habit.difficulty === 'hard' ? 20 : habit.difficulty === 'medium' ? 10 : 5;
            let multiplier = 1;
            let bonusMsg = "";

            if (newStreak >= 7) { multiplier = 1.4; bonusMsg = " (7 day streak! +40%)"; }
            else if (newStreak >= 5) { multiplier = 1.25; bonusMsg = " (5 day streak! +25%)"; }
            else if (newStreak >= 3) { multiplier = 1.1; bonusMsg = " (3 day streak! +10%)"; }

            const finalCoins = Math.round(baseCoins * multiplier);
            const newDates = [...new Set([...(habit.completionDates || []), todayISO])];

            // Update Habit
            await window.updateDoc(window.doc(db, `/artifacts/${appId}/users/${userId}/habits/${id}`), {
                streak: newStreak,
                completedToday: true,
                lastCompleted: today.toDateString(),
                completionDates: newDates
            });

            // Update Wallet
            const walletDocRef = window.doc(db, `/artifacts/${appId}/users/${userId}/gamification/wallet`);
            await window.updateDoc(walletDocRef, {
                coins: (wallet.coins || 0) + finalCoins,
                history: [{ id: Date.now(), text: `Completed: ${habit.title}${bonusMsg}`, amount: finalCoins, type: 'earn' }, ...(wallet.history || [])].slice(0, 20)
            });

            // User Feedback
            alert(`completed! +${finalCoins} coins${bonusMsg}`);
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
                    const walletDocRef = window.doc(db, `/artifacts/${appId}/users/${userId}/gamification/wallet`);
                    await window.updateDoc(walletDocRef, {
                        coins: wallet.coins - reward.cost,
                        history: [{ id: Date.now(), text: `Redeemed: ${reward.title}`, amount: -reward.cost, type: 'spend' }, ...(wallet.history || [])].slice(0, 20)
                    });
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

        // Navigation to Timer (Using existing tabs if possible, or just mock functionality logic)
        // Since we are inside the app, we can perhaps signal the parent or just show a message
        const [timerHabit, setTimerHabit] = useState(null);

        const handleTimeIt = (habit) => {
            setTimerHabit(habit);
        };

        return React.createElement("div", { className: `container mx-auto px-4 ${isWidget ? 'py-4' : 'py-8'} max-w-4xl min-h-screen text-slate-800` },

            // Top Bar: Coins & Date (Hidden if Widget)
            !isWidget && React.createElement("div", { className: "flex justify-between items-center mb-16" },
                React.createElement("div", null,
                    React.createElement("h1", { className: "text-3xl font-light tracking-wide text-gray-900 dark:text-gray-100 lowercase" }, "rewards shop")
                ),
                React.createElement("div", { className: "flex items-center gap-3 bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-sm border border-gray-100 dark:border-slate-700" },
                    React.createElement("div", { className: "text-yellow-500" }, React.createElement(Icon, { name: "coins", size: 24 })),
                    React.createElement("span", { className: "text-xl font-bold font-mono dark:text-white" }, wallet.coins)
                )
            ),

            // Main Content: Show Habits if Widget, otherwise Show Shop (Always)
            (isWidget && !showShop) ? React.createElement(React.Fragment, null,
                // --- HABITS LIST (Widget Only) ---
                React.createElement("div", { className: "space-y-3" },
                    habits.map(habit =>
                        React.createElement("div", { key: habit.id, className: `group relative bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border transition-all hover:shadow-md ${habit.completedToday ? 'border-green-100 bg-green-50/20' : 'border-gray-100 dark:border-slate-700'}` },
                            React.createElement("div", { className: "flex items-center justify-between gap-4" },

                                // Left: Info & Actions
                                React.createElement("div", { className: "flex-1 min-w-0" },
                                    React.createElement("h3", { className: `text-lg font-light dark:text-white leading-tight truncate ${habit.completedToday ? 'text-gray-400 line-through decoration-gray-300' : 'text-gray-800'}` }, habit.title),

                                    // Stats Row
                                    React.createElement("div", { className: "flex items-center gap-3 mt-2" },
                                        // Streak
                                        React.createElement("div", { className: "flex items-center gap-1.5 text-xs font-medium text-orange-500 dark:text-orange-400" },
                                            React.createElement(Icon, { name: "fire", size: 14 }),
                                            React.createElement("span", null, habit.streak || 0)
                                        ),
                                        // Difficulty Badge
                                        React.createElement("span", {
                                            className: `text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest font-medium border ${habit.difficulty === 'easy' ? 'text-green-600 border-green-200 bg-green-50' :
                                                habit.difficulty === 'hard' ? 'text-red-600 border-red-200 bg-red-50' :
                                                    'text-blue-600 border-blue-200 bg-blue-50'
                                                }`
                                        }, habit.difficulty)
                                    ),

                                    // Actions Row (Timer/Delete) - Always visible or hover based on pref, keeping hover for clean look
                                    !habit.completedToday && React.createElement("div", { className: "flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity" },
                                        // Timer Button
                                        React.createElement("button", {
                                            onClick: () => setTimerHabit(habit),
                                            className: "p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition"
                                        }, React.createElement(Icon, { name: "clock", size: 16 })),

                                        // Delete Button
                                        React.createElement("button", {
                                            onClick: () => deleteHabit(habit.id),
                                            className: "p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
                                        }, React.createElement(Icon, { name: "trash", size: 16 }))
                                    )
                                ),

                                // Right: Checkmark Button (Replaces Actions in original slot, Actions moved to left or kept separate? User asked to move ticks to right.)
                                // We moved actions under title to keep right side clean for just the tick.
                                React.createElement("button", {
                                    onClick: () => completeHabit(habit.id),
                                    disabled: habit.completedToday,
                                    className: `w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${habit.completedToday
                                        ? 'bg-green-500 border-green-500 text-white shadow-md scale-105'
                                        : 'bg-gray-50 border-gray-300 text-gray-300 hover:border-green-400 hover:text-green-400 dark:bg-slate-800 dark:border-slate-600 dark:text-gray-600'}`
                                }, React.createElement(Icon, { name: "check", size: 28, strokeWidth: 3 }))
                            )
                        )
                    ),

                    // Add New Habit Button (Minimalist)
                    React.createElement("button", {
                        onClick: () => setShowAddHabit(true),
                        className: "w-full py-4 mt-2 rounded-xl border border-dashed border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-600 hover:bg-gray-50/50 transition-all flex items-center justify-center gap-2 group"
                    },
                        React.createElement(Icon, { name: "plus", size: 20, className: "group-hover:scale-110 transition-transform" }),
                        React.createElement("span", { className: "font-light lowercase" }, "add new habit")
                    ),

                    // Timer Modal Render
                    timerHabit && React.createElement(TimerModal, {
                        habit: timerHabit,
                        db,
                        user: { id: userId },
                        onClose: () => setTimerHabit(null)
                    })
                ),

                // Add Habit Form
                showAddHabit && React.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" },
                    React.createElement("form", { onSubmit: addHabit, className: "bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-lg border border-indigo-100 dark:border-indigo-900 animate-in fade-in slide-in-from-bottom-4 relative w-full max-w-sm" },
                        // Close/Cancel X
                        React.createElement("button", {
                            type: "button",
                            onClick: () => setShowAddHabit(false),
                            className: "absolute top-4 right-4 text-gray-300 hover:text-gray-500 transition"
                        }, React.createElement(Icon, { name: "x", size: 20 })),

                        React.createElement("h3", { className: "text-lg font-light mb-6 dark:text-white lowercase text-center" }, "create new habit"),

                        React.createElement("div", { className: "space-y-6" },
                            React.createElement("div", null,
                                React.createElement("label", { className: "block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2" }, "habit name"),
                                React.createElement("input", {
                                    type: "text",
                                    value: newHabit.title,
                                    onChange: e => setNewHabit({ ...newHabit, title: e.target.value }),
                                    placeholder: "e.g., read for 30 mins",
                                    className: "w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition",
                                    autoFocus: true
                                })
                            ),
                            React.createElement("div", null,
                                React.createElement("label", { className: "block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2" }, "difficulty"),
                                React.createElement("div", { className: "grid grid-cols-3 gap-2" },
                                    ['easy', 'medium', 'hard'].map(level =>
                                        React.createElement("button", {
                                            key: level,
                                            type: "button",
                                            onClick: () => setNewHabit({ ...newHabit, difficulty: level }),
                                            className: `py-3 rounded-xl text-sm font-medium lowercase transition-all flex flex-col items-center gap-1 ${newHabit.difficulty === level
                                                ? (level === 'easy' ? 'bg-green-100 text-green-700 ring-2 ring-green-500 ring-offset-2' : level === 'hard' ? 'bg-red-100 text-red-700 ring-2 ring-red-500 ring-offset-2' : 'bg-blue-100 text-blue-700 ring-2 ring-blue-500 ring-offset-2')
                                                : 'bg-gray-50 dark:bg-slate-700 text-gray-400 hover:bg-gray-100'}`
                                        },
                                            React.createElement("span", null, level),
                                            React.createElement("span", { className: "text-[10px] opacity-60" }, level === 'easy' ? '+5' : level === 'medium' ? '+10' : '+20')
                                        )
                                    )
                                )
                            ),
                            React.createElement("div", { className: "flex justify-end pt-2" },
                                React.createElement("button", {
                                    type: "submit",
                                    className: "w-14 h-14 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:scale-105 transition-all flex items-center justify-center"
                                }, React.createElement(Icon, { name: "check", size: 28, strokeWidth: 3 }))
                            )
                        )
                    )
                )
            ) : (
                // --- REWARDS SHOP ---
                React.createElement("div", { className: "space-y-6" },
                    // Rewards Grid
                    React.createElement("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4" },
                        rewards.map(reward =>
                            React.createElement("button", {
                                key: reward.id,
                                onClick: () => buyReward(reward.id),
                                disabled: wallet.coins < reward.cost,
                                className: `relative group flex flex-col items-center p-6 rounded-2xl border transition-all text-center ${wallet.coins >= reward.cost ? 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 hover:border-pink-300 hover:shadow-lg hover:-translate-y-1' : 'bg-gray-50 dark:bg-slate-900 border-transparent opacity-60 cursor-not-allowed'}`
                            },
                                React.createElement("div", { className: "absolute top-2 right-2 transition" },
                                    React.createElement("div", { onClick: (e) => { e.stopPropagation(); deleteReward(reward.id); }, className: "p-1.5 text-gray-300 hover:text-red-500 rounded-full hover:bg-red-50" },
                                        React.createElement(Icon, { name: "x", size: 16 })
                                    )
                                ),
                                React.createElement("div", { className: "w-12 h-12 bg-pink-50 dark:bg-pink-900/20 text-pink-500 rounded-full flex items-center justify-center mb-3 text-2xl" }, "🎁"),
                                React.createElement("h3", { className: "font-normal text-gray-800 dark:text-gray-200 mb-1" }, reward.title),
                                React.createElement("div", { className: `text-sm font-mono font-light ${wallet.coins >= reward.cost ? 'text-pink-600' : 'text-gray-400'}` },
                                    reward.cost, " coins"
                                )
                            )
                        ),

                        // Add Reward Button
                        React.createElement("button", {
                            onClick: () => setShowAddReward(true),
                            className: "flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-700 text-gray-400 hover:text-pink-500 hover:border-pink-300 dark:hover:border-pink-800 hover:bg-pink-50/50 dark:hover:bg-slate-800 transition min-h-[160px]"
                        },
                            React.createElement(Icon, { name: "plus", size: 32 }),
                            React.createElement("span", { className: "mt-2 font-light lowercase" }, "add reward")
                        )
                    ),

                    // Add Reward Modal
                    showAddReward && React.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" },
                        React.createElement("form", { onSubmit: addReward, className: "bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl w-full max-w-sm animate-in zoom-in-95 relative" },
                            // Close/Cancel X
                            React.createElement("button", {
                                type: "button",
                                onClick: () => setShowAddReward(false),
                                className: "absolute top-4 right-4 text-gray-300 hover:text-gray-500 transition"
                            }, React.createElement(Icon, { name: "x", size: 20 })),

                            React.createElement("h3", { className: "text-lg font-light mb-6 dark:text-white lowercase text-center" }, "new reward"),

                            React.createElement("div", { className: "space-y-6" },
                                React.createElement("div", null,
                                    React.createElement("label", { className: "block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2" }, "reward name"),
                                    React.createElement("input", {
                                        type: "text",
                                        value: newReward.title,
                                        onChange: e => setNewReward({ ...newReward, title: e.target.value }),
                                        placeholder: "e.g., ice cream, 1h gaming",
                                        className: "w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition",
                                        autoFocus: true
                                    })
                                ),
                                React.createElement("div", null,
                                    React.createElement("label", { className: "block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2" }, "cost (coins)"),
                                    React.createElement("input", {
                                        type: "number",
                                        value: newReward.cost,
                                        onChange: e => setNewReward({ ...newReward, cost: e.target.value }),
                                        className: "w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition"
                                    })
                                ),
                                React.createElement("div", { className: "flex justify-end pt-2" },
                                    React.createElement("button", {
                                        type: "submit",
                                        className: "w-14 h-14 bg-pink-600 text-white rounded-full hover:bg-pink-700 shadow-lg shadow-pink-200 hover:scale-105 transition-all flex items-center justify-center"
                                    }, React.createElement(Icon, { name: "check", size: 28, strokeWidth: 3 }))
                                )
                            )
                        )
                    )
                )
            )
        );
    };

    window.HabitsTab = GamificationTab;
})();
