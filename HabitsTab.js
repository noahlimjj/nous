(function () {
    const { useState, useEffect } = React;

    const ICONS = {
        book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z",
        brain: "M12 2a5 5 0 0 0-5 5v3a1 1 0 0 0 1 1h1v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2h1a1 1 0 0 0 1-1V7a5 5 0 0 0-5-5z",
        dumbbell: "M6.5 6.5h11 M4 8v8 M20 8v8 M2 10v4 M22 10v4",
        heart: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
        lotus: "M12 22c-4 0-8-2-8-6 2 1 4 2 8 2s6-1 8-2c0 4-4 6-8 6z M12 2c-2 4-6 6-8 8 2 0 5 1 8 3 3-2 6-3 8-3-2-2-6-4-8-8z",
        leaf: "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.77 10-10 10Z",
        flame: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z",
        star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
        coffee: "M18 8h1a4 4 0 0 1 0 8h-1 M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z",
        zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
        footprints: "M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.5 1.5-4 4-4s4 1.5 4 4",
        moon: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
    };

    const COLORS = ['#FF6B6B', '#FF9F43', '#FECA57', '#26DE81', '#17C0EB', '#4B7BEC', '#A55EEA', '#FD79A8'];

    const Icon = ({ name, size = 20 }) => React.createElement("svg", {
        width: size, height: size, viewBox: "0 0 24 24", fill: "none",
        stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round"
    }, React.createElement("path", { d: ICONS[name] || ICONS.leaf }));

    const SysIcon = ({ name, size = 20 }) => {
        const paths = {
            check: "M20 6L9 17l-5-5",
            plus: "M12 4v16m8-8H4",
            trash: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
            x: "M6 18L18 6M6 6l12 12",
            fire: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z",
            left: "M15 18l-6-6 6-6",
            right: "M9 18l6-6-6-6",
            edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
        };
        return React.createElement("svg", {
            width: size, height: size, viewBox: "0 0 24 24", fill: "none",
            stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round"
        }, React.createElement("path", { d: paths[name] || "" }));
    };

    const CoinDisplay = ({ amount }) => React.createElement("div", {
        className: "flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
    },
        React.createElement("div", { className: "w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center" },
            React.createElement("span", { className: "text-white text-xs font-bold" }, "₵")
        ),
        React.createElement("span", { className: "text-lg font-medium text-amber-700 dark:text-amber-300" }, amount || 0)
    );

    // Calculate continuous streak
    const calcStreak = (dates) => {
        if (!dates || dates.length === 0) return 0;
        const sorted = [...dates].sort().reverse();
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        // Start counting from today or yesterday
        if (sorted[0] !== today && sorted[0] !== yesterday) return 0;

        let streak = 1;
        for (let i = 1; i < sorted.length; i++) {
            const prev = new Date(sorted[i - 1]);
            const curr = new Date(sorted[i]);
            const diff = (prev - curr) / 86400000;
            if (diff === 1) streak++;
            else break;
        }
        return streak;
    };

    const HabitsPage = ({ user, db, isWidget = false }) => {
        const [habits, setHabits] = useState([]);
        const [wallet, setWallet] = useState({ coins: 0 });
        const [showAddHabit, setShowAddHabit] = useState(false);
        const [editingHabit, setEditingHabit] = useState(null);
        const [weekOffset, setWeekOffset] = useState(0);
        const [notification, setNotification] = useState(null);
        const [newHabit, setNewHabit] = useState({ title: "", difficulty: "medium", icon: "leaf", color: "#26DE81" });

        const userId = user?.uid || user?.id || null;
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'study-tracker-app';

        useEffect(() => {
            if (!db || !userId) return;
            const unsub1 = window.onSnapshot(window.collection(db, `/artifacts/${appId}/users/${userId}/habits`), snap => {
                setHabits(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            });
            const unsub2 = window.onSnapshot(window.doc(db, `/artifacts/${appId}/users/${userId}/gamification/wallet`), doc => {
                if (doc.exists()) setWallet(doc.data());
                else window.setDoc(window.doc(db, `/artifacts/${appId}/users/${userId}/gamification/wallet`), { coins: 0 });
            });
            return () => { unsub1(); unsub2(); };
        }, [db, userId, appId]);

        const showNotif = (msg) => { setNotification(msg); setTimeout(() => setNotification(null), 3000); };

        const getWeekDays = () => {
            const days = [];
            const today = new Date();
            const monday = new Date(today);
            monday.setDate(today.getDate() - today.getDay() + 1 + (weekOffset * 7));
            for (let i = 0; i < 7; i++) {
                const d = new Date(monday);
                d.setDate(monday.getDate() + i);
                days.push(d);
            }
            return days;
        };
        const weekDays = getWeekDays();
        const todayStr = new Date().toISOString().split('T')[0];

        const addHabit = async (e) => {
            e.preventDefault();
            if (!newHabit.title.trim() || !db || !userId) return;
            const id = Date.now().toString();
            await window.setDoc(window.doc(db, `/artifacts/${appId}/users/${userId}/habits/${id}`), {
                id, title: newHabit.title.trim(), difficulty: newHabit.difficulty,
                icon: newHabit.icon, color: newHabit.color, streak: 0, completionDates: []
            });
            setNewHabit({ title: "", difficulty: "medium", icon: "leaf", color: "#26DE81" });
            setShowAddHabit(false);
            showNotif("habit created!");
        };

        const saveHabit = async (e) => {
            e.preventDefault();
            if (!editingHabit || !editingHabit.title.trim()) return;
            await window.updateDoc(window.doc(db, `/artifacts/${appId}/users/${userId}/habits/${editingHabit.id}`), {
                title: editingHabit.title.trim(),
                icon: editingHabit.icon,
                color: editingHabit.color,
                difficulty: editingHabit.difficulty
            });
            setEditingHabit(null);
            showNotif("habit updated!");
        };

        const deleteHabit = async (id) => {
            if (confirm('Delete habit?')) await window.deleteDoc(window.doc(db, `/artifacts/${appId}/users/${userId}/habits/${id}`));
        };

        const toggleDate = async (habitId, dateStr) => {
            const habit = habits.find(h => h.id === habitId);
            if (!habit) return;
            const dates = habit.completionDates || [];
            const done = dates.includes(dateStr);
            const newDates = done ? dates.filter(d => d !== dateStr) : [...dates, dateStr];
            const coins = habit.difficulty === 'hard' ? 20 : habit.difficulty === 'medium' ? 10 : 5;
            const newStreak = calcStreak(newDates);
            await window.updateDoc(window.doc(db, `/artifacts/${appId}/users/${userId}/habits/${habitId}`), {
                completionDates: newDates, streak: newStreak
            });
            await window.updateDoc(window.doc(db, `/artifacts/${appId}/users/${userId}/gamification/wallet`), {
                coins: Math.max(0, (wallet.coins || 0) + (done ? -coins : coins))
            });
            if (!done && typeof window.confetti === 'function') {
                window.confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } });
            }
        };

        const monthYear = weekDays[3]?.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        const rowStyle = { display: 'flex', alignItems: 'center', gap: '8px' };
        const dayStyle = { flex: '1', textAlign: 'center', minWidth: '40px' };
        const habitColStyle = { width: '160px', flexShrink: 0 };

        // Always show header with title and date
        const showHeader = true;

        return React.createElement("div", { className: "container mx-auto px-4 py-6 max-w-4xl", style: { paddingBottom: '100px' } },
            notification && React.createElement("div", {
                className: "fixed top-20 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl lowercase",
                style: { zIndex: 9999 }
            }, notification),

            // Header - only show once
            showHeader && React.createElement("div", { className: "flex justify-between items-center mb-6" },
                React.createElement("div", null,
                    React.createElement("h1", { className: "text-3xl font-light text-gray-800 dark:text-white lowercase" }, "daily habits"),
                    React.createElement("p", { className: "text-lg text-gray-500 lowercase" },
                        new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
                    )
                ),
                React.createElement(CoinDisplay, { amount: wallet.coins })
            ),

            // Week Nav
            React.createElement("div", { className: "flex items-center justify-between mb-6 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl" },
                React.createElement("button", { onClick: () => setWeekOffset(w => w - 1), className: "p-2 hover:bg-white/50 rounded-lg" },
                    React.createElement(SysIcon, { name: "left", size: 20 })
                ),
                React.createElement("div", { className: "text-center flex items-center gap-4" },
                    React.createElement("span", { className: "text-lg font-medium text-gray-800 dark:text-white" }, monthYear),
                    weekOffset !== 0 && React.createElement("button", {
                        onClick: () => setWeekOffset(0), className: "text-sm text-blue-500 hover:underline lowercase"
                    }, "today")
                ),
                React.createElement("button", { onClick: () => setWeekOffset(w => w + 1), className: "p-2 hover:bg-white/50 rounded-lg" },
                    React.createElement(SysIcon, { name: "right", size: 20 })
                )
            ),

            // Days Header
            React.createElement("div", { style: rowStyle, className: "mb-3 px-3" },
                React.createElement("div", { style: habitColStyle, className: "text-sm text-gray-500 lowercase font-medium" }, "habit"),
                weekDays.map(d => {
                    const iso = d.toISOString().split('T')[0];
                    const isToday = iso === todayStr;
                    return React.createElement("div", { key: iso, style: dayStyle, className: isToday ? 'text-blue-600 font-bold' : 'text-gray-500' },
                        React.createElement("div", { className: "text-xs lowercase" }, d.toLocaleDateString('en-US', { weekday: 'short' })),
                        React.createElement("div", { className: "text-lg" }, d.getDate())
                    );
                })
            ),

            // Habits
            habits.length === 0 ? React.createElement("div", { className: "text-center py-12 text-gray-400" },
                React.createElement("p", { className: "text-xl lowercase mb-2" }, "no habits yet"),
                React.createElement("p", { className: "lowercase" }, "tap + to create one")
            ) : habits.map(h => {
                const coinVal = h.difficulty === 'hard' ? 20 : h.difficulty === 'medium' ? 10 : 5;
                const streak = calcStreak(h.completionDates);
                return React.createElement("div", { key: h.id, style: rowStyle, className: "p-3 mb-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800" },
                    React.createElement("div", { style: habitColStyle, className: "flex items-center gap-2" },
                        React.createElement("div", {
                            className: "w-9 h-9 rounded-full flex items-center justify-center text-white flex-shrink-0 cursor-pointer hover:scale-110 transition",
                            style: { backgroundColor: h.color || '#26DE81' },
                            onClick: () => setEditingHabit({ ...h })
                        },
                            React.createElement(Icon, { name: h.icon || 'leaf', size: 18 })
                        ),
                        React.createElement("div", { className: "flex-1 min-w-0" },
                            React.createElement("div", {
                                className: "text-sm font-medium text-gray-800 dark:text-white lowercase truncate cursor-pointer hover:text-blue-500",
                                onClick: () => setEditingHabit({ ...h })
                            }, h.title || 'untitled'),
                            React.createElement("div", { className: "flex items-center gap-1 text-xs text-gray-400" },
                                React.createElement("span", { className: `px-1 py-0.5 rounded text-[10px] ${h.difficulty === 'hard' ? 'bg-red-100 text-red-600' : h.difficulty === 'easy' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}` }, `${coinVal}c`),
                                streak > 0 && React.createElement("span", { className: "flex items-center gap-0.5 text-orange-500" },
                                    React.createElement(SysIcon, { name: "fire", size: 10 }), streak
                                ),
                                React.createElement("button", { onClick: () => deleteHabit(h.id), className: "text-gray-300 hover:text-red-400 ml-1" },
                                    React.createElement(SysIcon, { name: "trash", size: 12 })
                                )
                            )
                        )
                    ),
                    // CIRCLES instead of lines - GREEN when complete
                    weekDays.map(d => {
                        const iso = d.toISOString().split('T')[0];
                        const done = (h.completionDates || []).includes(iso);
                        const isToday = iso === todayStr;
                        return React.createElement("div", { key: iso, style: dayStyle },
                            React.createElement("button", {
                                onClick: () => toggleDate(h.id, iso),
                                className: `w-10 h-10 mx-auto rounded-full flex items-center justify-center transition-all ${done
                                    ? 'bg-green-500 text-white shadow-md scale-105'
                                    : isToday
                                        ? 'border-2 border-blue-400 bg-blue-50 hover:bg-blue-100'
                                        : 'border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 hover:bg-gray-50'
                                    }`
                            }, done && React.createElement(SysIcon, { name: "check", size: 18 }))
                        );
                    })
                );
            }),

            // FAB
            React.createElement("button", {
                onClick: () => setShowAddHabit(true),
                style: { position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, width: '56px', height: '56px' },
                className: "bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 transition"
            }, React.createElement(SysIcon, { name: "plus", size: 28 })),

            // Add Habit Modal
            showAddHabit && React.createElement("div", { className: "fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4", style: { zIndex: 10000 } },
                React.createElement("form", { onSubmit: addHabit, className: "bg-white dark:bg-gray-900 p-6 rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto" },
                    React.createElement("div", { className: "flex justify-between items-center mb-4" },
                        React.createElement("h3", { className: "text-2xl font-light text-gray-800 dark:text-white lowercase" }, "new habit"),
                        React.createElement("button", { type: "button", onClick: () => setShowAddHabit(false), className: "p-2 text-gray-400" },
                            React.createElement(SysIcon, { name: "x", size: 24 })
                        )
                    ),
                    React.createElement("input", { type: "text", value: newHabit.title, onChange: e => setNewHabit({ ...newHabit, title: e.target.value }), placeholder: "habit name...", className: "w-full px-4 py-3 rounded-xl mb-4 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-lg lowercase", autoFocus: true }),
                    React.createElement("label", { className: "block text-sm text-gray-500 mb-2 lowercase" }, "color"),
                    React.createElement("div", { className: "flex gap-3 mb-4 flex-wrap" },
                        COLORS.map(c => React.createElement("button", { key: c, type: "button", onClick: () => setNewHabit({ ...newHabit, color: c }), style: { backgroundColor: c, width: '40px', height: '40px', borderRadius: '50%', border: newHabit.color === c ? '3px solid #333' : 'none' } }))
                    ),
                    React.createElement("label", { className: "block text-sm text-gray-500 mb-2 lowercase" }, "icon"),
                    React.createElement("div", { className: "flex gap-2 flex-wrap mb-4" },
                        Object.keys(ICONS).map(k => React.createElement("button", { key: k, type: "button", onClick: () => setNewHabit({ ...newHabit, icon: k }), className: `p-3 rounded-xl transition border-2 ${newHabit.icon === k ? 'bg-blue-500 text-white border-blue-600 shadow-md' : 'bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:border-blue-400'}` }, React.createElement(Icon, { name: k, size: 22 })))
                    ),
                    React.createElement("label", { className: "block text-sm text-gray-500 mb-2 lowercase" }, "difficulty"),
                    React.createElement("div", { className: "flex gap-2 mb-5" },
                        ['easy', 'medium', 'hard'].map(d => {
                            const coins = d === 'hard' ? 20 : d === 'medium' ? 10 : 5;
                            return React.createElement("button", { key: d, type: "button", onClick: () => setNewHabit({ ...newHabit, difficulty: d }), className: `flex-1 py-3 rounded-xl lowercase transition ${newHabit.difficulty === d ? (d === 'easy' ? 'bg-green-500 text-white' : d === 'hard' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white') : 'bg-gray-100 dark:bg-gray-800 text-gray-600'}` }, `${d} · ${coins}c`);
                        })
                    ),
                    React.createElement("button", { type: "submit", className: "w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl text-lg lowercase" }, "add habit")
                )
            ),

            // Edit Habit Modal
            editingHabit && React.createElement("div", { className: "fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4", style: { zIndex: 10000 } },
                React.createElement("form", { onSubmit: saveHabit, className: "bg-white dark:bg-gray-900 p-6 rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto" },
                    React.createElement("div", { className: "flex justify-between items-center mb-4" },
                        React.createElement("h3", { className: "text-2xl font-light text-gray-800 dark:text-white lowercase" }, "edit habit"),
                        React.createElement("button", { type: "button", onClick: () => setEditingHabit(null), className: "p-2 text-gray-400" },
                            React.createElement(SysIcon, { name: "x", size: 24 })
                        )
                    ),
                    React.createElement("input", { type: "text", value: editingHabit.title, onChange: e => setEditingHabit({ ...editingHabit, title: e.target.value }), className: "w-full px-4 py-3 rounded-xl mb-4 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-lg lowercase", autoFocus: true }),
                    React.createElement("label", { className: "block text-sm text-gray-500 mb-2 lowercase" }, "color"),
                    React.createElement("div", { className: "flex gap-3 mb-4 flex-wrap" },
                        COLORS.map(c => React.createElement("button", { key: c, type: "button", onClick: () => setEditingHabit({ ...editingHabit, color: c }), style: { backgroundColor: c, width: '40px', height: '40px', borderRadius: '50%', border: editingHabit.color === c ? '3px solid #333' : 'none' } }))
                    ),
                    React.createElement("label", { className: "block text-sm text-gray-500 mb-2 lowercase" }, "icon"),
                    React.createElement("div", { className: "flex gap-2 flex-wrap mb-4" },
                        Object.keys(ICONS).map(k => React.createElement("button", { key: k, type: "button", onClick: () => setEditingHabit({ ...editingHabit, icon: k }), className: `p-3 rounded-xl transition border-2 ${editingHabit.icon === k ? 'bg-blue-500 text-white border-blue-600 shadow-md' : 'bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:border-blue-400'}` }, React.createElement(Icon, { name: k, size: 22 })))
                    ),
                    React.createElement("label", { className: "block text-sm text-gray-500 mb-2 lowercase" }, "difficulty"),
                    React.createElement("div", { className: "flex gap-2 mb-5" },
                        ['easy', 'medium', 'hard'].map(d => {
                            const coins = d === 'hard' ? 20 : d === 'medium' ? 10 : 5;
                            return React.createElement("button", { key: d, type: "button", onClick: () => setEditingHabit({ ...editingHabit, difficulty: d }), className: `flex-1 py-3 rounded-xl lowercase transition ${editingHabit.difficulty === d ? (d === 'easy' ? 'bg-green-500 text-white' : d === 'hard' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white') : 'bg-gray-100 dark:bg-gray-800 text-gray-600'}` }, `${d} · ${coins}c`);
                        })
                    ),
                    React.createElement("button", { type: "submit", className: "w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl text-lg lowercase" }, "save changes")
                )
            )
        );
    };

    const RewardsPage = ({ user, db }) => {
        const [rewards, setRewards] = useState([]);
        const [wallet, setWallet] = useState({ coins: 0 });
        const [showAddReward, setShowAddReward] = useState(false);
        const [notification, setNotification] = useState(null);
        const [newReward, setNewReward] = useState({ title: "", cost: 50 });

        const userId = user?.uid || user?.id || null;
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'study-tracker-app';

        useEffect(() => {
            if (!db || !userId) return;
            const unsub1 = window.onSnapshot(window.collection(db, `/artifacts/${appId}/users/${userId}/rewards`), snap => {
                setRewards(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            });
            const unsub2 = window.onSnapshot(window.doc(db, `/artifacts/${appId}/users/${userId}/gamification/wallet`), doc => {
                if (doc.exists()) setWallet(doc.data());
            });
            return () => { unsub1(); unsub2(); };
        }, [db, userId, appId]);

        const showNotif = (msg) => { setNotification(msg); setTimeout(() => setNotification(null), 3000); };

        const addReward = async (e) => {
            e.preventDefault();
            if (!newReward.title.trim()) return;
            const id = Date.now().toString();
            await window.setDoc(window.doc(db, `/artifacts/${appId}/users/${userId}/rewards/${id}`), { id, title: newReward.title.trim(), cost: parseInt(newReward.cost) || 50 });
            setNewReward({ title: "", cost: 50 });
            setShowAddReward(false);
            showNotif("reward added!");
        };

        const buyReward = async (id) => {
            const r = rewards.find(x => x.id === id);
            if (!r || wallet.coins < r.cost) return showNotif("not enough coins!");
            await window.updateDoc(window.doc(db, `/artifacts/${appId}/users/${userId}/gamification/wallet`), { coins: wallet.coins - r.cost });
            if (typeof window.confetti === 'function') window.confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
            showNotif("🎉 congratulations! reward claimed!");
        };

        const deleteReward = async (id) => {
            if (confirm('Delete reward?')) await window.deleteDoc(window.doc(db, `/artifacts/${appId}/users/${userId}/rewards/${id}`));
        };

        return React.createElement("div", { className: "container mx-auto px-4 py-8 max-w-4xl" },
            notification && React.createElement("div", { className: "fixed top-20 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl lowercase", style: { zIndex: 9999 } }, notification),

            React.createElement("div", { className: "flex justify-between items-center mb-8" },
                React.createElement("div", null,
                    React.createElement("h1", { className: "text-3xl font-light text-gray-800 dark:text-white lowercase" }, "rewards"),
                    React.createElement("p", { className: "text-lg text-gray-500 lowercase" }, "spend your coins on rewards")
                ),
                React.createElement(CoinDisplay, { amount: wallet.coins })
            ),

            React.createElement("div", { className: "grid grid-cols-2 gap-4" },
                rewards.map(r => React.createElement("button", {
                    key: r.id, onClick: () => buyReward(r.id), disabled: wallet.coins < r.cost,
                    className: `relative flex flex-col items-center p-6 rounded-2xl border transition ${wallet.coins >= r.cost ? 'bg-white dark:bg-gray-900 hover:border-blue-400 hover:shadow-lg cursor-pointer' : 'bg-gray-50 dark:bg-gray-900 opacity-60 cursor-not-allowed'}`
                },
                    React.createElement("div", { className: "text-4xl mb-3" }, "🎁"),
                    React.createElement("h3", { className: "text-lg dark:text-white mb-1 lowercase" }, r.title),
                    React.createElement("div", { className: "flex items-center gap-1 text-amber-600 font-medium" }, `${r.cost} coins`),
                    React.createElement("button", { onClick: e => { e.stopPropagation(); deleteReward(r.id); }, className: "absolute top-2 right-2 p-1 text-gray-300 hover:text-red-400" },
                        React.createElement(SysIcon, { name: "x", size: 16 })
                    )
                )),
                React.createElement("button", { onClick: () => setShowAddReward(true), className: "flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 hover:text-blue-500 hover:border-blue-400 min-h-[160px]" },
                    React.createElement(SysIcon, { name: "plus", size: 32 }),
                    React.createElement("span", { className: "mt-2 lowercase" }, "add reward")
                )
            ),

            showAddReward && React.createElement("div", { className: "fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4", style: { zIndex: 10000 } },
                React.createElement("form", { onSubmit: addReward, className: "bg-white dark:bg-gray-900 p-6 rounded-2xl w-full max-w-sm shadow-2xl" },
                    React.createElement("div", { className: "flex justify-between items-center mb-4" },
                        React.createElement("h3", { className: "text-xl font-light dark:text-white lowercase" }, "new reward"),
                        React.createElement("button", { type: "button", onClick: () => setShowAddReward(false), className: "p-2 text-gray-400" }, React.createElement(SysIcon, { name: "x", size: 20 }))
                    ),
                    React.createElement("input", { type: "text", value: newReward.title, onChange: e => setNewReward({ ...newReward, title: e.target.value }), placeholder: "reward name...", className: "w-full px-4 py-3 rounded-xl mb-4 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white lowercase", autoFocus: true }),
                    React.createElement("input", { type: "number", value: newReward.cost, onChange: e => setNewReward({ ...newReward, cost: e.target.value }), placeholder: "cost in coins", className: "w-full px-4 py-3 rounded-xl mb-5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white" }),
                    React.createElement("button", { type: "submit", className: "w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl lowercase" }, "add reward")
                )
            )
        );
    };

    const GamificationTab = (props) => {
        if (props.isRewardsPage) return React.createElement(RewardsPage, props);
        return React.createElement(HabitsPage, props);
    };

    window.HabitsTab = GamificationTab;
    window.RewardsPage = RewardsPage;
    console.log("HabitsTab v29 loaded - circles, green complete, edit modal, proper streaks");
})();
