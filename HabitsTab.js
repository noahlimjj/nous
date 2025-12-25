
(function () {
    const { useState, useEffect, useMemo } = React;

    // --- Icon Definitions for Habits ---
    const HABIT_ICONS = {
        book: { path: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z", label: "study" },
        brain: { path: "M12 2a5 5 0 0 0-5 5v3a1 1 0 0 0 1 1h1v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2h1a1 1 0 0 0 1-1V7a5 5 0 0 0-5-5z M9 22v-4 M15 22v-4 M12 13v2", label: "research" },
        dumbbell: { path: "M6.5 6.5h11 M17.5 6.5v11 M6.5 17.5v-11 M17.5 17.5h-11 M4 8v8 M20 8v8 M2 10v4 M22 10v4", label: "gym" },
        martial: { path: "M12 2c1 3 4 5 7 6-1 4-4 7-7 10-3-3-6-6-7-10 3-1 6-3 7-6z", label: "bjj" },
        heart: { path: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z", label: "health" },
        lotus: { path: "M12 22c-4 0-8-2-8-6 2 1 4 2 8 2s6-1 8-2c0 4-4 6-8 6z M12 2c-2 4-6 6-8 8 2 0 5 1 8 3 3-2 6-3 8-3-2-2-6-4-8-8z", label: "meditation" },
        sunset: { path: "M17 18a5 5 0 1 0-10 0 M12 2v7 M4.22 10.22l1.42 1.42 M1 18h2 M21 18h2 M18.36 11.64l1.42-1.42 M23 22H1 M16 5l-4 4-4-4", label: "nature" },
        footprints: { path: "M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.5 1.5-4 4-4s4 1.5 4 4c.03 2.5-1 3.5-1 5.62V16 M20 16v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.5-1.5-4-4-4s-4 1.5-4 4c-.03 2.5 1 3.5 1 5.62V16", label: "walk" },
        flame: { path: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z", label: "sauna" },
        leaf: { path: "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.77 10-10 10Z M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12", label: "default" },
        star: { path: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z", label: "goal" },
        coffee: { path: "M18 8h1a4 4 0 0 1 0 8h-1 M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z M6 1v3 M10 1v3 M14 1v3", label: "morning" },
        moon: { path: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z", label: "sleep" },
        zap: { path: "M13 2L3 14h9l-1 8 10-12h-9l1-8z", label: "energy" },
        droplet: { path: "M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z", label: "hydrate" }
    };

    // --- Vibrant Color Palette ---
    const HABIT_COLORS = [
        { id: 'coral', bg: '#FF6B6B', light: '#FFE8E8' },
        { id: 'orange', bg: '#FF9F43', light: '#FFF0E0' },
        { id: 'yellow', bg: '#FECA57', light: '#FFF8E0' },
        { id: 'mint', bg: '#26DE81', light: '#E0FFF0' },
        { id: 'teal', bg: '#17C0EB', light: '#E0F8FF' },
        { id: 'blue', bg: '#4B7BEC', light: '#E8F0FF' },
        { id: 'purple', bg: '#A55EEA', light: '#F0E8FF' },
        { id: 'pink', bg: '#FD79A8', light: '#FFE8F0' }
    ];

    // --- Icon Component ---
    const Icon = ({ name, size = 20, className = "" }) => {
        const iconData = HABIT_ICONS[name];
        const path = iconData ? iconData.path : HABIT_ICONS.leaf.path;
        return React.createElement("svg", {
            xmlns: "http://www.w3.org/2000/svg", width: size, height: size,
            viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
            strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", className
        }, React.createElement("path", { d: path }));
    };

    // System icons
    const SysIcon = ({ name, size = 20 }) => {
        const icons = {
            check: "M20 6L9 17l-5-5",
            plus: "M12 4v16m8-8H4",
            trash: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
            x: "M6 18L18 6M6 6l12 12",
            fire: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",
            edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
            chevronLeft: "M15 18l-6-6 6-6",
            chevronRight: "M9 18l6-6-6-6",
            bag: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
            coins: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        };
        return React.createElement("svg", {
            xmlns: "http://www.w3.org/2000/svg", width: size, height: size,
            viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
            strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round"
        }, React.createElement("path", { d: icons[name] || "" }));
    };

    // --- Confetti ---
    const triggerConfetti = () => {
        if (typeof window.confetti === 'function') {
            window.confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
        }
    };

    // --- Main Component ---
    const GamificationTab = ({ user, db, activeTimers, isWidget = false }) => {
        const [habits, setHabits] = useState([]);
        const [rewards, setRewards] = useState([]);
        const [wallet, setWallet] = useState({ coins: 0, history: [] });
        const [showAddHabit, setShowAddHabit] = useState(false);
        const [showShop, setShowShop] = useState(false);
        const [showAddReward, setShowAddReward] = useState(false);
        const [editingHabit, setEditingHabit] = useState(null);
        const [weekOffset, setWeekOffset] = useState(0);
        const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

        const [newHabit, setNewHabit] = useState({ title: "", difficulty: "medium", icon: "leaf", color: "coral" });
        const [newReward, setNewReward] = useState({ title: "", cost: 50 });

        const userId = user?.uid || user?.id || null;
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'study-tracker-app';

        // Load data
        useEffect(() => {
            if (!db || !userId) return;
            const habitsCol = window.collection(db, `/artifacts/${appId}/users/${userId}/habits`);
            const unsubHabits = window.onSnapshot(habitsCol, (snap) => {
                setHabits(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            });
            const rewardsCol = window.collection(db, `/artifacts/${appId}/users/${userId}/rewards`);
            const unsubRewards = window.onSnapshot(rewardsCol, (snap) => {
                setRewards(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            });
            const walletRef = window.doc(db, `/artifacts/${appId}/users/${userId}/gamification/wallet`);
            const unsubWallet = window.onSnapshot(walletRef, (doc) => {
                if (doc.exists()) setWallet(doc.data());
                else window.setDoc(walletRef, { coins: 0, history: [] });
            });
            return () => { unsubHabits(); unsubRewards(); unsubWallet(); };
        }, [db, userId, appId]);

        const getColor = (id) => HABIT_COLORS.find(c => c.id === id) || HABIT_COLORS[0];

        // Week days calculation
        const getWeekDays = () => {
            const result = [];
            const today = new Date();
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay() + 1 + (weekOffset * 7)); // Monday
            for (let i = 0; i < 7; i++) {
                const d = new Date(startOfWeek);
                d.setDate(startOfWeek.getDate() + i);
                result.push(d);
            }
            return result;
        };
        const weekDays = getWeekDays();
        const todayStr = new Date().toISOString().split('T')[0];

        // Add Habit
        const addHabit = async (e) => {
            e.preventDefault();
            if (!newHabit.title.trim() || !db || !userId) return;
            try {
                const habitId = Date.now().toString();
                const habit = {
                    id: habitId,
                    title: newHabit.title.trim(),
                    difficulty: newHabit.difficulty,
                    icon: newHabit.icon,
                    color: newHabit.color,
                    streak: 0,
                    completionDates: [],
                    createdAt: new Date().toISOString()
                };
                await window.setDoc(window.doc(db, `/artifacts/${appId}/users/${userId}/habits/${habitId}`), habit);
                setNewHabit({ title: "", difficulty: "medium", icon: "leaf", color: "coral" });
                setShowAddHabit(false);
            } catch (err) {
                console.error("Error adding habit:", err);
                alert("Failed to add habit. Please try again.");
            }
        };

        // Delete Habit
        const deleteHabit = async (id) => {
            if (confirm('delete this habit?')) {
                await window.deleteDoc(window.doc(db, `/artifacts/${appId}/users/${userId}/habits/${id}`));
            }
        };

        // Rename Habit
        const renameHabit = async (id, newName) => {
            if (newName.trim()) {
                await window.updateDoc(window.doc(db, `/artifacts/${appId}/users/${userId}/habits/${id}`), { title: newName.trim() });
            }
            setEditingHabit(null);
        };

        // Toggle Habit Completion for a date
        const toggleHabitDate = async (habitId, dateStr) => {
            const habit = habits.find(h => h.id === habitId);
            if (!habit) return;
            const dates = habit.completionDates || [];
            const isCompleted = dates.includes(dateStr);
            let newDates, coinsChange = 0, msg = "";

            if (isCompleted) {
                newDates = dates.filter(d => d !== dateStr);
                const coinValue = habit.difficulty === 'hard' ? 20 : habit.difficulty === 'medium' ? 10 : 5;
                coinsChange = -coinValue;
                msg = `uncompleted: ${habit.title}`;
            } else {
                newDates = [...dates, dateStr];
                const coinValue = habit.difficulty === 'hard' ? 20 : habit.difficulty === 'medium' ? 10 : 5;
                // Streak bonus
                let multiplier = 1;
                const streak = newDates.length;
                if (streak >= 7) multiplier = 1.4;
                else if (streak >= 5) multiplier = 1.25;
                else if (streak >= 3) multiplier = 1.1;
                coinsChange = Math.round(coinValue * multiplier);
                msg = `completed: ${habit.title}`;
                if (dateStr === todayStr) triggerConfetti();
            }

            await window.updateDoc(window.doc(db, `/artifacts/${appId}/users/${userId}/habits/${habitId}`), {
                completionDates: newDates,
                streak: newDates.length
            });

            // Update wallet
            const walletRef = window.doc(db, `/artifacts/${appId}/users/${userId}/gamification/wallet`);
            await window.updateDoc(walletRef, {
                coins: Math.max(0, (wallet.coins || 0) + coinsChange),
                history: [{ id: Date.now(), text: msg, amount: coinsChange, type: coinsChange > 0 ? 'earn' : 'spend' }, ...(wallet.history || [])].slice(0, 20)
            });
        };

        // Shop handlers
        const addReward = async (e) => {
            e.preventDefault();
            if (!newReward.title.trim()) return;
            const rewardId = Date.now().toString();
            await window.setDoc(window.doc(db, `/artifacts/${appId}/users/${userId}/rewards/${rewardId}`), {
                id: rewardId, title: newReward.title.trim(), cost: parseInt(newReward.cost) || 50
            });
            setNewReward({ title: "", cost: 50 });
            setShowAddReward(false);
        };

        const buyReward = async (id) => {
            const reward = rewards.find(r => r.id === id);
            if (!reward || wallet.coins < reward.cost) return alert("not enough coins!");
            if (confirm(`purchase ${reward.title} for ${reward.cost} coins?`)) {
                await window.updateDoc(window.doc(db, `/artifacts/${appId}/users/${userId}/gamification/wallet`), {
                    coins: wallet.coins - reward.cost,
                    history: [{ id: Date.now(), text: `redeemed: ${reward.title}`, amount: -reward.cost, type: 'spend' }, ...(wallet.history || [])].slice(0, 20)
                });
                triggerConfetti();
            }
        };

        const deleteReward = async (id) => {
            if (confirm('remove reward?')) {
                await window.deleteDoc(window.doc(db, `/artifacts/${appId}/users/${userId}/rewards/${id}`));
            }
        };

        const currentMonthYear = weekDays[3]?.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        return React.createElement("div", { className: "container mx-auto px-4 py-6 max-w-5xl" },
            // Header
            React.createElement("div", { className: "flex justify-between items-center mb-6" },
                React.createElement("div", null,
                    React.createElement("h1", { className: "text-3xl font-light text-gray-800 dark:text-white lowercase" },
                        showShop ? "rewards shop" : "daily habits"
                    ),
                    React.createElement("p", { className: "text-lg text-gray-500 dark:text-gray-400 lowercase mt-1" },
                        new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
                    )
                ),
                React.createElement("div", { className: "flex items-center gap-3" },
                    React.createElement("div", { className: "flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30" },
                        React.createElement("span", { className: "text-xl" }, "🪙"),
                        React.createElement("span", { className: "text-xl font-medium text-amber-700 dark:text-amber-300" }, wallet.coins || 0)
                    ),
                    React.createElement("button", {
                        onClick: () => setShowShop(!showShop),
                        className: `p-3 rounded-2xl transition-all ${showShop
                            ? 'bg-blue-500 text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'}`
                    }, React.createElement(SysIcon, { name: "bag", size: 22 }))
                )
            ),

            !showShop ? React.createElement(React.Fragment, null,
                // Week Navigation
                React.createElement("div", { className: "flex items-center justify-between mb-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl" },
                    React.createElement("button", {
                        onClick: () => setWeekOffset(weekOffset - 1),
                        className: "p-2 hover:bg-white/50 dark:hover:bg-white/10 rounded-xl transition"
                    }, React.createElement(SysIcon, { name: "chevronLeft", size: 24 })),
                    React.createElement("div", { className: "text-center" },
                        React.createElement("span", { className: "text-lg font-medium text-gray-800 dark:text-white" }, currentMonthYear),
                        weekOffset !== 0 && React.createElement("button", {
                            onClick: () => setWeekOffset(0),
                            className: "ml-3 text-sm text-blue-500 hover:underline lowercase"
                        }, "today")
                    ),
                    React.createElement("button", {
                        onClick: () => setWeekOffset(weekOffset + 1),
                        className: "p-2 hover:bg-white/50 dark:hover:bg-white/10 rounded-xl transition"
                    }, React.createElement(SysIcon, { name: "chevronRight", size: 24 }))
                ),

                // Calendar Header
                React.createElement("div", { className: "grid grid-cols-8 gap-2 mb-2 px-2" },
                    React.createElement("div", { className: "text-sm font-medium text-gray-500 dark:text-gray-400 lowercase" }, "habit"),
                    ...weekDays.map(d => React.createElement("div", {
                        key: d.toISOString(),
                        className: `text-center text-sm ${d.toISOString().split('T')[0] === todayStr
                            ? 'font-bold text-blue-600 dark:text-blue-400'
                            : 'text-gray-500 dark:text-gray-400'}`
                    },
                        React.createElement("div", { className: "lowercase" }, d.toLocaleDateString('en-US', { weekday: 'short' })),
                        React.createElement("div", { className: "text-lg" }, d.getDate())
                    ))
                ),

                // Habits List
                React.createElement("div", { className: "space-y-2" },
                    habits.length === 0 && React.createElement("div", { className: "text-center py-12 text-gray-400" },
                        React.createElement("p", { className: "text-lg lowercase" }, "no habits yet"),
                        React.createElement("p", { className: "text-sm lowercase" }, "click + to add your first habit")
                    ),
                    habits.map(habit => {
                        const color = getColor(habit.color);
                        const coinValue = habit.difficulty === 'hard' ? '20' : habit.difficulty === 'medium' ? '10' : '5';
                        return React.createElement("div", {
                            key: habit.id,
                            className: "grid grid-cols-8 gap-2 items-center p-3 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-md transition"
                        },
                            // Habit Info
                            React.createElement("div", { className: "flex items-center gap-3 min-w-0" },
                                React.createElement("div", {
                                    className: "w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0",
                                    style: { backgroundColor: color.bg }
                                }, React.createElement(Icon, { name: habit.icon, size: 20 })),
                                React.createElement("div", { className: "min-w-0 flex-1" },
                                    editingHabit === habit.id ?
                                        React.createElement("input", {
                                            autoFocus: true,
                                            defaultValue: habit.title,
                                            onBlur: (e) => renameHabit(habit.id, e.target.value),
                                            onKeyDown: (e) => e.key === 'Enter' && renameHabit(habit.id, e.target.value),
                                            className: "w-full px-2 py-1 text-sm border rounded-lg dark:bg-gray-800 dark:text-white lowercase"
                                        }) :
                                        React.createElement("h3", {
                                            className: "text-base font-medium text-gray-800 dark:text-white lowercase truncate cursor-pointer hover:text-blue-500",
                                            onClick: () => setEditingHabit(habit.id)
                                        }, habit.title),
                                    React.createElement("div", { className: "flex items-center gap-2 text-xs" },
                                        React.createElement("span", {
                                            className: `px-2 py-0.5 rounded-full lowercase ${habit.difficulty === 'hard' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                                                    habit.difficulty === 'easy' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                                                        'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                                                }`
                                        }, `${habit.difficulty} · ${coinValue}🪙`),
                                        habit.streak > 0 && React.createElement("span", { className: "flex items-center gap-1 text-gray-400" },
                                            React.createElement(SysIcon, { name: "fire", size: 12 }),
                                            habit.streak
                                        ),
                                        React.createElement("button", {
                                            onClick: () => deleteHabit(habit.id),
                                            className: "p-1 text-gray-300 hover:text-red-400 transition"
                                        }, React.createElement(SysIcon, { name: "trash", size: 14 }))
                                    )
                                )
                            ),
                            // Week Checkboxes
                            ...weekDays.map(d => {
                                const dateStr = d.toISOString().split('T')[0];
                                const isCompleted = (habit.completionDates || []).includes(dateStr);
                                const isToday = dateStr === todayStr;
                                return React.createElement("button", {
                                    key: dateStr,
                                    onClick: () => toggleHabitDate(habit.id, dateStr),
                                    className: `w-full aspect-square rounded-xl flex items-center justify-center transition-all ${isCompleted
                                            ? 'text-white shadow-md'
                                            : isToday
                                                ? 'border-2 border-blue-400 text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                                                : 'border border-gray-200 dark:border-gray-700 text-gray-300 hover:border-gray-400'
                                        }`,
                                    style: isCompleted ? { backgroundColor: color.bg } : {}
                                }, isCompleted ? React.createElement(SysIcon, { name: "check", size: 18 }) : "");
                            })
                        );
                    })
                ),

                // FAB
                React.createElement("button", {
                    onClick: () => setShowAddHabit(true),
                    className: "fixed bottom-8 right-6 w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl shadow-xl flex items-center justify-center hover:scale-105 transition z-40"
                }, React.createElement(SysIcon, { name: "plus", size: 28 })),

                // Add Habit Modal
                showAddHabit && React.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" },
                    React.createElement("form", { onSubmit: addHabit, className: "bg-white dark:bg-gray-900 p-6 rounded-3xl w-full max-w-md shadow-2xl" },
                        React.createElement("div", { className: "flex justify-between items-center mb-5" },
                            React.createElement("h3", { className: "text-2xl font-light text-gray-800 dark:text-white lowercase" }, "new habit"),
                            React.createElement("button", { type: "button", onClick: () => setShowAddHabit(false), className: "p-2 text-gray-400 hover:text-gray-600 rounded-lg" },
                                React.createElement(SysIcon, { name: "x", size: 24 })
                            )
                        ),
                        React.createElement("input", {
                            type: "text",
                            value: newHabit.title,
                            onChange: e => setNewHabit({ ...newHabit, title: e.target.value }),
                            placeholder: "habit name...",
                            className: "w-full px-4 py-3 rounded-xl mb-4 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none lowercase text-lg",
                            autoFocus: true
                        }),
                        // Colors
                        React.createElement("div", { className: "mb-4" },
                            React.createElement("label", { className: "block text-sm text-gray-500 mb-2 lowercase" }, "color"),
                            React.createElement("div", { className: "flex gap-2 flex-wrap" },
                                HABIT_COLORS.map(c => React.createElement("button", {
                                    key: c.id, type: "button",
                                    onClick: () => setNewHabit({ ...newHabit, color: c.id }),
                                    className: `w-9 h-9 rounded-full transition ${newHabit.color === c.id ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-105'}`,
                                    style: { backgroundColor: c.bg }
                                }))
                            )
                        ),
                        // Icons
                        React.createElement("div", { className: "mb-4" },
                            React.createElement("label", { className: "block text-sm text-gray-500 mb-2 lowercase" }, "icon"),
                            React.createElement("div", { className: "grid grid-cols-8 gap-2" },
                                Object.keys(HABIT_ICONS).map(key => React.createElement("button", {
                                    key, type: "button",
                                    onClick: () => setNewHabit({ ...newHabit, icon: key }),
                                    className: `p-2 rounded-xl transition ${newHabit.icon === key ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'}`
                                }, React.createElement(Icon, { name: key, size: 18 })))
                            )
                        ),
                        // Difficulty
                        React.createElement("div", { className: "mb-5" },
                            React.createElement("label", { className: "block text-sm text-gray-500 mb-2 lowercase" }, "difficulty (coins earned)"),
                            React.createElement("div", { className: "flex gap-2" },
                                [{ d: 'easy', coins: 5, color: 'green' }, { d: 'medium', coins: 10, color: 'orange' }, { d: 'hard', coins: 20, color: 'red' }].map(({ d, coins, color }) =>
                                    React.createElement("button", {
                                        key: d, type: "button",
                                        onClick: () => setNewHabit({ ...newHabit, difficulty: d }),
                                        className: `flex-1 py-3 rounded-xl text-sm lowercase transition ${newHabit.difficulty === d
                                            ? `bg-${color}-500 text-white shadow-lg`
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`
                                    }, `${d} · ${coins}🪙`)
                                )
                            )
                        ),
                        React.createElement("button", { type: "submit", className: "w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl text-lg lowercase hover:shadow-lg transition" }, "add habit")
                    )
                )
            ) : (
                // Shop View
                React.createElement("div", { className: "grid grid-cols-2 gap-4" },
                    rewards.map(r => React.createElement("button", {
                        key: r.id,
                        onClick: () => buyReward(r.id),
                        disabled: wallet.coins < r.cost,
                        className: `relative flex flex-col items-center p-6 rounded-2xl border transition ${wallet.coins >= r.cost
                            ? 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-blue-400 hover:shadow-lg'
                            : 'bg-gray-50 dark:bg-gray-900 border-gray-100 opacity-60'}`
                    },
                        React.createElement("div", { className: "text-4xl mb-3" }, "🎁"),
                        React.createElement("h3", { className: "text-lg text-gray-800 dark:text-white mb-1 lowercase" }, r.title),
                        React.createElement("div", { className: "text-blue-500 font-medium" }, `${r.cost}🪙`),
                        React.createElement("button", {
                            onClick: (e) => { e.stopPropagation(); deleteReward(r.id); },
                            className: "absolute top-2 right-2 p-1 text-gray-300 hover:text-red-400"
                        }, React.createElement(SysIcon, { name: "x", size: 16 }))
                    )),
                    React.createElement("button", {
                        onClick: () => setShowAddReward(true),
                        className: "flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-gray-400 hover:text-blue-500 hover:border-blue-400 transition min-h-[160px]"
                    },
                        React.createElement(SysIcon, { name: "plus", size: 32 }),
                        React.createElement("span", { className: "mt-2 lowercase" }, "add reward")
                    )
                )
            ),
            // Add Reward Modal
            showAddReward && React.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" },
                React.createElement("form", { onSubmit: addReward, className: "bg-white dark:bg-gray-900 p-6 rounded-3xl w-full max-w-sm shadow-2xl" },
                    React.createElement("div", { className: "flex justify-between items-center mb-5" },
                        React.createElement("h3", { className: "text-xl font-light text-gray-800 dark:text-white lowercase" }, "new reward"),
                        React.createElement("button", { type: "button", onClick: () => setShowAddReward(false), className: "p-2 text-gray-400 hover:text-gray-600" },
                            React.createElement(SysIcon, { name: "x", size: 20 })
                        )
                    ),
                    React.createElement("input", {
                        type: "text", value: newReward.title,
                        onChange: e => setNewReward({ ...newReward, title: e.target.value }),
                        placeholder: "reward name...",
                        className: "w-full px-4 py-3 rounded-xl mb-4 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white outline-none lowercase",
                        autoFocus: true
                    }),
                    React.createElement("input", {
                        type: "number", value: newReward.cost,
                        onChange: e => setNewReward({ ...newReward, cost: e.target.value }),
                        placeholder: "cost in coins",
                        className: "w-full px-4 py-3 rounded-xl mb-5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white outline-none"
                    }),
                    React.createElement("button", { type: "submit", className: "w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl lowercase hover:shadow-lg transition" }, "add reward")
                )
            )
        );
    };

    window.HabitsTab = GamificationTab;
})();
