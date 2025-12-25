(function () {
    const { useState, useEffect } = React;

    // Premium detailed icons - wellness focused with fine details
    const ICONS = {
        // User's specific habits - DETAILED versions
        reading: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z M8 7h8 M8 11h6 M8 15h4",
        meditation: "M12 3a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z M12 8c-3 0-5 1.5-5 3v1h10v-1c0-1.5-2-3-5-3z M5 22c0-3.5 3-5.5 7-5.5s7 2 7 5.5 M8.5 13.5v3 M15.5 13.5v3 M12 16.5v2",
        jamming: "M9 18V5l12-2v13 M9 9l12-2 M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M18 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M9 13l12-2 M6 18h.01",
        running: "M13 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M5.5 17L9 13l3 2.5L16 10l3.5 3 M7 22l2.5-5 M14.5 22L13 17 M10.5 14l-1 3 M15.5 12l1 2",
        swimming: "M2 12c1.5-1.5 3-2 5-2s3.5.5 5 2c1.5-1.5 3-2 5-2s3.5.5 5 2 M2 18c1.5-1.5 3-2 5-2s3.5.5 5 2c1.5-1.5 3-2 5-2s3.5.5 5 2 M10 7a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z M6 10l3-2 M10 9l4 1",
        jiujitsu: "M12 3.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z M8 8l4 2 4-2 M12 10v3 M8 17l4-3 4 3 M6 13c0-1.5 2.5-3 6-3s6 1.5 6 3 M4 21h6l2-3 2 3h6 M8 17v4 M16 17v4",
        yoga: "M12 3a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z M12 7v5 M12 22v-5 M12 17l-5 5 M12 17l5 5 M5 12h14 M7 12l2-3 M17 12l-2-3 M9 9l3 3 M15 9l-3 3",
        // Common healthy lifestyle habits - DETAILED
        sleep: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z M15 9l1.5 1 M13 13l1 1.5 M17 15l.5 1",
        water: "M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z M8 14c0 2 1.79 4 4 4s4-2 4-4 M10 11l1.5 1.5 M12.5 9l1.5 1.5",
        eating: "M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2 M7 2v9 M21 15c0 1.1-.9 2-2 2h-4a2 2 0 0 1-2-2V8h8v7z M17 2v6 M21 2v6 M13 2v6 M3 14h8v6H5a2 2 0 0 1-2-2v-4z M13 17h8",
        walking: "M14 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M6 21l3-8.5 3.5 1V8l3.5 2.5 M10.5 13l-3 8 M14.5 13l1 8 M10 10l1.5 3",
        journal: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M16 9H8 M8 5h2",
        gratitude: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z M9 10l2 2 4-4",
        coffee: "M17 8h1a4 4 0 0 1 0 8h-1 M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z M6 1v3 M10 1v3 M14 1v3 M7 12h6",
        study: "M22 10v6 M2 10l10-5 10 5-10 5z M6 12v5c0 2 3 3 6 3s6-1 6-3v-5 M18 12v8 M18 20l2 2m-4 0l2-2",
        stretch: "M12 3.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z M5 18l3-6 3 1.5 3.5-5 4 3.5 M12 22v-6 M9 16l-1 6 M15 15l2 7 M7 18l-2 4",
        nature: "M12 22v-8 M16 7c0 4-4 5-4 8 M8 7c0 4 4 5 4 8 M12 7a4 4 0 0 0-4-4 M12 7a4 4 0 0 1 4-4 M12 2v5 M9 14c1.5 0 2.5.5 3 1.5.5-1 1.5-1.5 3-1.5",
        social: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75 M10 7h-2 M9 6v2",
        nophone: "M16 2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z M12 18h.01 M4 4l16 16 M10 6h4 M9 11h6",
        // General purpose icons - DETAILED
        heart: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z M12 8v6 M9 11h6",
        star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z M12 6v5 M10 9h4",
        flame: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z M12 18v-4 M10 15h4",
        leaf: "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.77 10-10 10Z M2 21l9-9 M14 9c-1 1-2 3-2 6 M11 10c2 0 4 1 5 3",
        // Additional detailed icons
        gym: "M6.5 6.5L17.5 17.5 M6.5 17.5L17.5 6.5 M2 12h4 M18 12h4 M12 2v4 M12 18v4 M4.93 4.93l2.83 2.83 M16.24 16.24l2.83 2.83 M4.93 19.07l2.83-2.83 M16.24 7.76l2.83-2.83",
        brain: "M12 2a4 4 0 0 0-4 4c0 1.5.5 2.5 1.5 3.5L8 12c-1.5 0-3 1.5-3 3s1.5 3 3 3l1.5 2.5c0 1 1 1.5 2.5 1.5s2.5-.5 2.5-1.5L16 18c1.5 0 3-1.5 3-3s-1.5-3-3-3l-1.5-2.5c1-.9 1.5-2 1.5-3.5a4 4 0 0 0-4-4z M12 9v3 M10 15h4"
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
            edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
            star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        };
        return React.createElement("svg", {
            width: size, height: size, viewBox: "0 0 24 24", fill: "none",
            stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round"
        }, React.createElement("path", { d: paths[name] || "" }));
    };

    const CoinDisplay = ({ amount }) => React.createElement("div", {
        className: "flex items-center gap-2 px-4 py-2 rounded-full",
        style: {
            background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
            border: '1px solid #fcd34d',
            boxShadow: '0 2px 8px rgba(251, 191, 36, 0.15)'
        }
    },
        React.createElement("div", {
            className: "w-6 h-6 rounded-full flex items-center justify-center",
            style: {
                background: 'linear-gradient(145deg, #fbbf24, #f59e0b)',
                boxShadow: '0 2px 4px rgba(217, 119, 6, 0.3), inset 0 1px 0 rgba(255,255,255,0.3)'
            }
        },
            React.createElement("span", {
                style: { color: '#fffbeb', fontSize: '12px', fontWeight: '600', textShadow: '0 1px 1px rgba(0,0,0,0.2)' }
            }, "✦")
        ),
        React.createElement("span", {
            style: { fontSize: '17px', fontWeight: '500', color: '#92400e', letterSpacing: '-0.01em' }
        }, amount || 0)
    );

    const calcStreak = (dates) => {
        if (!dates || dates.length === 0) return 0;
        const sorted = [...dates].sort().reverse();
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
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

    // Timer utility functions
    const formatTimerDisplay = (totalMs) => {
        const totalSeconds = Math.floor(totalMs / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const ms = Math.floor((totalMs % 1000) / 10);
        if (hours > 0) {
            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const getTimerMs = (totalMs) => Math.floor((totalMs % 1000) / 10);

    const HabitsPage = ({ user, db, isWidget = false, onToggleView }) => {
        const [habits, setHabits] = useState([]);
        const [wallet, setWallet] = useState({ coins: 0 });
        const [showAddHabit, setShowAddHabit] = useState(false);
        const [editingHabit, setEditingHabit] = useState(null);
        const [weekOffset, setWeekOffset] = useState(0);
        const [notification, setNotification] = useState(null);
        const [newHabit, setNewHabit] = useState({ title: "", difficulty: "medium", icon: "leaf", color: "#26DE81" });
        // Timer state
        const [timers, setTimers] = useState({});
        const [currentTime, setCurrentTime] = useState(Date.now());
        const [expandedHabit, setExpandedHabit] = useState(null);

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

        // Timer tick effect
        useEffect(() => {
            const hasRunning = Object.values(timers).some(t => t && t.isRunning);
            if (!hasRunning) return;
            const interval = setInterval(() => setCurrentTime(Date.now()), 50);
            return () => clearInterval(interval);
        }, [timers]);

        const showNotif = (msg) => { setNotification(msg); setTimeout(() => setNotification(null), 3000); };

        // Timer functions
        const startTimer = (habitId) => {
            setTimers(prev => ({
                ...prev,
                [habitId]: {
                    isRunning: true,
                    startTime: Date.now(),
                    elapsedTime: prev[habitId]?.elapsedTime || 0
                }
            }));
        };

        const pauseTimer = (habitId) => {
            setTimers(prev => {
                const timer = prev[habitId];
                if (!timer) return prev;
                const elapsed = timer.isRunning ? (Date.now() - timer.startTime) + timer.elapsedTime : timer.elapsedTime;
                return { ...prev, [habitId]: { ...timer, isRunning: false, elapsedTime: elapsed } };
            });
        };

        const stopTimer = (habitId) => {
            const timer = timers[habitId];
            if (!timer) return;
            const elapsed = timer.isRunning ? (Date.now() - timer.startTime) + timer.elapsedTime : timer.elapsedTime;
            if (elapsed > 0) {
                showNotif(`session saved: ${formatTimerDisplay(elapsed)}`);
            }
            setTimers(prev => ({ ...prev, [habitId]: null }));
        };

        const resetTimer = (habitId) => {
            setTimers(prev => ({ ...prev, [habitId]: { isRunning: false, startTime: null, elapsedTime: 0 } }));
        };

        const getElapsedTime = (habitId) => {
            const timer = timers[habitId];
            if (!timer) return 0;
            if (timer.isRunning) {
                const elapsed = (currentTime - timer.startTime) + timer.elapsedTime;
                return Math.max(0, elapsed); // Prevent negative values
            }
            return Math.max(0, timer.elapsedTime || 0);
        };

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
                title: editingHabit.title.trim(), icon: editingHabit.icon || 'leaf', color: editingHabit.color || '#26DE81', difficulty: editingHabit.difficulty || 'medium'
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
            // No confetti on habit completion - only on reward claims
        };

        const monthYear = weekDays[3]?.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        const rowStyle = { display: 'flex', alignItems: 'center', gap: '2px' };
        const dayStyle = { flex: '1', textAlign: 'center', minWidth: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' };
        const habitColStyle = { width: '140px', flexShrink: 0, overflow: 'visible', wordBreak: 'break-word' };

        return React.createElement("div", { className: "px-4 py-2 max-w-4xl mx-auto", style: { paddingBottom: '80px', position: 'relative' } },
            notification && React.createElement("div", {
                className: "fixed top-20 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl lowercase",
                style: { zIndex: 9999 }
            }, notification),

            // Header - only show when NOT embedded as widget (dashboard has its own header)
            !isWidget && React.createElement("div", { className: "flex justify-between items-center mb-4" },
                React.createElement("h2", { className: "text-3xl text-calm-800 mb-2", style: { fontWeight: 300 } }, "habit tracker"),
                React.createElement("div", { className: "flex items-center gap-3" },
                    React.createElement(CoinDisplay, { amount: wallet.coins }),
                    onToggleView && React.createElement("button", {
                        onClick: onToggleView,
                        className: "px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition lowercase text-sm",
                        title: "View Rewards"
                    }, "rewards")
                )
            ),

            // Week Nav
            React.createElement("div", { className: "flex items-center justify-between mb-4 p-2 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl" },
                React.createElement("button", { onClick: () => setWeekOffset(w => w - 1), className: "p-1 hover:bg-white/50 rounded-lg" },
                    React.createElement(SysIcon, { name: "left", size: 18 })
                ),
                React.createElement("div", { className: "text-center flex items-center gap-3" },
                    React.createElement("span", { className: "text-sm font-medium text-gray-800 dark:text-white" }, monthYear),
                    weekOffset !== 0 && React.createElement("button", {
                        onClick: () => setWeekOffset(0), className: "text-xs text-blue-500 hover:underline lowercase"
                    }, "today")
                ),
                React.createElement("button", { onClick: () => setWeekOffset(w => w + 1), className: "p-1 hover:bg-white/50 rounded-lg" },
                    React.createElement(SysIcon, { name: "right", size: 18 })
                )
            ),

            // Days Header - includes spacer for flame icon alignment
            React.createElement("div", { style: { ...rowStyle, alignItems: 'center' }, className: "mb-2 px-2" },
                // Spacer for flame icon (28px to match button width)
                React.createElement("div", { style: { width: '28px', flexShrink: 0 } }),
                React.createElement("div", { style: habitColStyle, className: "text-sm font-medium text-gray-600 dark:text-gray-300" }, "habit"),
                weekDays.map(d => {
                    const iso = d.toISOString().split('T')[0];
                    const isToday = iso === todayStr;
                    return React.createElement("div", { key: iso, style: dayStyle, className: isToday ? 'text-blue-600 font-bold' : 'text-gray-500' },
                        React.createElement("div", { className: "text-[10px] lowercase" }, d.toLocaleDateString('en-US', { weekday: 'narrow' })),
                        React.createElement("div", { className: "text-sm" }, d.getDate())
                    );
                })
            ),

            // Habits
            habits.length === 0 ? React.createElement("div", { className: "text-center py-8 text-gray-400" },
                React.createElement("p", { className: "text-lg lowercase mb-1" }, "no habits yet"),
                React.createElement("p", { className: "text-sm lowercase" }, "tap + to create one")
            ) : habits.map(h => {
                const coinVal = h.difficulty === 'hard' ? 20 : h.difficulty === 'medium' ? 10 : 5;
                const streak = calcStreak(h.completionDates);
                const timer = timers[h.id];
                const isRunning = timer && timer.isRunning;
                const elapsed = getElapsedTime(h.id);
                const isExpanded = expandedHabit === h.id;

                return React.createElement("div", { key: h.id, className: "mb-3 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 overflow-hidden" },
                    // Main habit row
                    React.createElement("div", { style: rowStyle, className: "p-2" },
                        // Drag handle / Timer toggle
                        React.createElement("button", {
                            onClick: () => setExpandedHabit(isExpanded ? null : h.id),
                            className: `p-1.5 rounded-lg transition ${isExpanded ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`,
                            title: "Toggle timer"
                        }, React.createElement(SysIcon, { name: "fire", size: 16 })),
                        React.createElement("div", { style: habitColStyle, className: "flex items-center gap-2" },
                            React.createElement("div", {
                                className: "w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0",
                                style: { backgroundColor: h.color || '#26DE81' }
                            }, React.createElement(Icon, { name: h.icon || 'leaf', size: 16 })),
                            React.createElement("div", { className: "flex-1 min-w-0" },
                                React.createElement("div", { className: "text-sm font-medium text-gray-800 dark:text-white lowercase leading-tight", style: { wordBreak: 'break-word', whiteSpace: 'normal' } }, h.title || 'untitled'),
                                React.createElement("div", { className: "flex items-center gap-1 text-xs text-gray-400 mt-0.5" },
                                    React.createElement("span", null, `${coinVal}c`),
                                    streak > 0 && React.createElement("span", { className: "text-orange-500" }, `🔥${streak}`),
                                    React.createElement("button", { onClick: () => setEditingHabit({ ...h, difficulty: h.difficulty || 'medium', icon: h.icon || 'leaf', color: h.color || '#26DE81' }), className: "ml-1 p-1 text-gray-400 hover:text-blue-500" },
                                        React.createElement(SysIcon, { name: "edit", size: 14 })
                                    )
                                )
                            )
                        ),
                        weekDays.map(d => {
                            const iso = d.toISOString().split('T')[0];
                            const done = (h.completionDates || []).includes(iso);
                            const isToday = iso === todayStr;
                            return React.createElement("div", { key: iso, style: dayStyle, className: "flex items-center justify-center" },
                                React.createElement("button", {
                                    onClick: () => toggleDate(h.id, iso),
                                    style: done ? { backgroundColor: '#22c55e', width: '28px', height: '28px' } : { width: '28px', height: '28px' },
                                    className: `rounded-full flex items-center justify-center transition-all ${done ? 'text-white shadow-md' : isToday ? 'border-2 border-blue-400 bg-blue-50 dark:bg-blue-900/30' : 'border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400'}`
                                }, done && React.createElement(SysIcon, { name: "check", size: 14 }))
                            );
                        })
                    ),
                    // Timer section (expandable)
                    isExpanded && React.createElement("div", {
                        className: "px-4 py-3 border-t border-gray-100 dark:border-gray-700 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20"
                    },
                        React.createElement("div", { className: "flex items-center justify-between flex-wrap gap-3" },
                            // Timer display
                            React.createElement("div", {
                                className: `timer-display flex-1 min-w-[200px] ${isRunning ? 'running' : (timer ? 'paused' : '')}`,
                                style: { margin: 0, padding: '12px 16px', fontSize: '2rem' }
                            },
                                React.createElement("span", null, formatTimerDisplay(elapsed)),
                                React.createElement("span", { className: "milliseconds", style: { fontSize: '1rem' } },
                                    `.${String(getTimerMs(elapsed)).padStart(2, '0')}`
                                )
                            ),
                            // Timer controls
                            React.createElement("div", { className: "flex items-center gap-2" },
                                // Play/Pause
                                isRunning ?
                                    React.createElement("button", {
                                        onClick: (e) => { e.preventDefault(); e.stopPropagation(); pauseTimer(h.id); },
                                        onTouchEnd: (e) => { e.preventDefault(); pauseTimer(h.id); },
                                        className: "p-3 bg-yellow-100 text-yellow-600 rounded-full hover:bg-yellow-200 transition",
                                        title: "Pause",
                                        type: "button"
                                    }, React.createElement("svg", { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2 },
                                        React.createElement("rect", { x: 6, y: 4, width: 4, height: 16 }),
                                        React.createElement("rect", { x: 14, y: 4, width: 4, height: 16 })
                                    )) :
                                    React.createElement("button", {
                                        onClick: () => startTimer(h.id),
                                        className: "p-3 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition",
                                        title: "Play"
                                    }, React.createElement("svg", { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2 },
                                        React.createElement("polygon", { points: "5 3 19 12 5 21 5 3" })
                                    )),
                                // Stop
                                React.createElement("button", {
                                    onClick: () => stopTimer(h.id),
                                    disabled: !timer,
                                    className: "p-3 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition disabled:opacity-50",
                                    title: "Stop & Save"
                                }, React.createElement("svg", { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2 },
                                    React.createElement("rect", { x: 3, y: 3, width: 18, height: 18, rx: 2 })
                                )),
                                // Add time (placeholder)
                                React.createElement("button", {
                                    onClick: () => showNotif("manual entry coming soon!"),
                                    className: "p-3 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition",
                                    title: "Add Time"
                                }, React.createElement("svg", { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2 },
                                    React.createElement("circle", { cx: 12, cy: 12, r: 10 }),
                                    React.createElement("line", { x1: 12, y1: 8, x2: 12, y2: 16 }),
                                    React.createElement("line", { x1: 8, y1: 12, x2: 16, y2: 12 })
                                )),
                                // Reset
                                React.createElement("button", {
                                    onClick: () => resetTimer(h.id),
                                    disabled: !timer,
                                    className: "p-3 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200 transition disabled:opacity-50",
                                    title: "Reset"
                                }, React.createElement("svg", { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2 },
                                    React.createElement("path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" }),
                                    React.createElement("path", { d: "M21 3v5h-5" }),
                                    React.createElement("path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" }),
                                    React.createElement("path", { d: "M3 21v-5h5" })
                                )),
                                // Delete timer
                                React.createElement("button", {
                                    onClick: () => { setTimers(prev => ({ ...prev, [h.id]: null })); setExpandedHabit(null); },
                                    className: "p-3 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 transition",
                                    title: "Close Timer"
                                }, React.createElement(SysIcon, { name: "trash", size: 18 }))
                            )
                        )
                    )
                );
            }),

            // Add Habit Button - static inline at end of habits list
            React.createElement("button", {
                onClick: () => setShowAddHabit(true),
                className: "add-habit-btn w-full mt-4 mb-6 py-3.5 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-500 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-all bg-white/50 dark:bg-gray-800/30 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
            },
                React.createElement(SysIcon, { name: "plus", size: 20 }),
                React.createElement("span", { className: "lowercase text-sm font-medium" }, "add habit")
            ),

            // Add Habit Modal (positioned within container)
            showAddHabit && React.createElement("div", {
                className: "absolute inset-0 flex items-start justify-center bg-black/30 backdrop-blur-sm rounded-2xl",
                style: { zIndex: 100, padding: '20px', paddingTop: '60px' },
                onClick: () => setShowAddHabit(false)
            },
                React.createElement("form", {
                    onSubmit: addHabit,
                    onClick: e => e.stopPropagation(),
                    className: "bg-white dark:bg-gray-900 p-5 rounded-2xl w-full max-w-sm shadow-2xl overflow-y-auto border border-gray-200 dark:border-gray-700",
                    style: { maxHeight: 'calc(100% - 80px)' }
                },
                    React.createElement("div", { className: "flex justify-between items-center mb-3" },
                        React.createElement("h3", { className: "text-lg font-light text-gray-800 dark:text-white lowercase" }, "new habit"),
                        React.createElement("button", { type: "button", onClick: () => setShowAddHabit(false), className: "p-1 text-gray-400 hover:text-gray-600" },
                            React.createElement(SysIcon, { name: "x", size: 18 })
                        )
                    ),
                    React.createElement("input", { type: "text", value: newHabit.title, onChange: e => setNewHabit({ ...newHabit, title: e.target.value }), placeholder: "habit name...", className: "w-full px-3 py-2 rounded-lg mb-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white lowercase text-sm", autoFocus: true }),
                    React.createElement("label", { className: "block text-xs text-gray-500 mb-1 lowercase" }, "color"),
                    React.createElement("div", { className: "flex gap-1.5 mb-3 flex-wrap" },
                        COLORS.map(c => React.createElement("button", {
                            key: c, type: "button",
                            onClick: () => setNewHabit({ ...newHabit, color: c }),
                            style: {
                                backgroundColor: c,
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                border: 'none',
                                boxShadow: newHabit.color === c ? '0 0 0 3px #3b82f6, inset 0 0 0 2px white' : 'inset 0 0 0 1px rgba(0,0,0,0.1)'
                            }
                        }))
                    ),
                    React.createElement("label", { className: "block text-xs text-gray-500 mb-1 lowercase" }, "icon"),
                    React.createElement("div", { className: "flex gap-1 flex-wrap mb-3" },
                        Object.keys(ICONS).map(k => React.createElement("button", {
                            key: k, type: "button",
                            onClick: () => setNewHabit({ ...newHabit, icon: k }),
                            className: `p-1.5 rounded-md transition ${newHabit.icon === k ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'}`
                        }, React.createElement(Icon, { name: k, size: 16 })))
                    ),
                    React.createElement("label", { className: "block text-xs text-gray-500 mb-1 lowercase" }, "difficulty"),
                    React.createElement("div", { className: "grid grid-cols-3 gap-2 mb-3" },
                        ['easy', 'medium', 'hard'].map(d => {
                            const coins = d === 'hard' ? 20 : d === 'medium' ? 10 : 5;
                            const isSelected = newHabit.difficulty === d;
                            const bgColor = isSelected
                                ? (d === 'easy' ? 'bg-green-500 text-white' : d === 'hard' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-gray-900')
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200';
                            return React.createElement("button", {
                                key: d, type: "button",
                                onClick: () => setNewHabit({ ...newHabit, difficulty: d }),
                                className: `py-2 rounded-lg lowercase transition text-xs font-medium ${bgColor}`
                            }, `${d} · ${coins}c`);
                        })
                    ),
                    React.createElement("button", { type: "submit", className: "w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg lowercase text-sm" }, "add habit")
                )
            ),

            // Edit Habit Modal
            editingHabit && React.createElement("div", {
                className: "absolute inset-0 flex items-start justify-center bg-black/30 backdrop-blur-sm rounded-2xl",
                style: { zIndex: 100, padding: '20px', paddingTop: '60px' },
                onClick: () => setEditingHabit(null)
            },
                React.createElement("form", {
                    onSubmit: saveHabit,
                    onClick: e => e.stopPropagation(),
                    className: "bg-white dark:bg-gray-900 p-6 rounded-2xl w-full max-w-md shadow-2xl overflow-y-auto border border-gray-200 dark:border-gray-700",
                    style: { maxHeight: 'calc(100% - 40px)', minHeight: '500px' }
                },
                    React.createElement("div", { className: "flex justify-between items-center mb-5" },
                        React.createElement("h3", { className: "text-xl font-light text-gray-800 dark:text-white lowercase" }, "edit habit"),
                        React.createElement("button", { type: "button", onClick: () => setEditingHabit(null), className: "p-2 text-gray-400 hover:text-gray-600" },
                            React.createElement(SysIcon, { name: "x", size: 20 })
                        )
                    ),
                    React.createElement("input", { type: "text", value: editingHabit.title, onChange: e => setEditingHabit({ ...editingHabit, title: e.target.value }), className: "w-full px-4 py-4 rounded-xl mb-5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white lowercase text-base", autoFocus: true }),
                    React.createElement("label", { className: "block text-sm text-gray-500 mb-2 lowercase" }, "color"),
                    React.createElement("div", { className: "flex gap-3 mb-5 flex-wrap" },
                        COLORS.map(c => React.createElement("button", {
                            key: c, type: "button",
                            onClick: () => setEditingHabit({ ...editingHabit, color: c }),
                            style: {
                                backgroundColor: c,
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                border: 'none',
                                boxShadow: editingHabit.color === c ? '0 0 0 3px #3b82f6, inset 0 0 0 2px white' : 'inset 0 0 0 1px rgba(0,0,0,0.1)'
                            }
                        }))
                    ),
                    React.createElement("label", { className: "block text-sm text-gray-500 mb-2 lowercase" }, "icon"),
                    React.createElement("div", { className: "flex gap-2 flex-wrap mb-5" },
                        Object.keys(ICONS).map(k => React.createElement("button", {
                            key: k, type: "button",
                            onClick: () => setEditingHabit({ ...editingHabit, icon: k }),
                            className: `p-2.5 rounded-lg transition ${editingHabit.icon === k ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'}`
                        }, React.createElement(Icon, { name: k, size: 20 })))
                    ),
                    React.createElement("label", { className: "block text-sm text-gray-500 mb-2 lowercase" }, "difficulty"),
                    React.createElement("div", { className: "grid grid-cols-3 gap-3 mb-5" },
                        ['easy', 'medium', 'hard'].map(d => {
                            const coins = d === 'hard' ? 20 : d === 'medium' ? 10 : 5;
                            const isSelected = editingHabit.difficulty === d;
                            const bgColor = isSelected
                                ? (d === 'easy' ? 'bg-green-500 text-white' : d === 'hard' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-gray-900')
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200';
                            return React.createElement("button", {
                                key: d, type: "button",
                                onClick: () => setEditingHabit({ ...editingHabit, difficulty: d }),
                                className: `py-3 rounded-xl lowercase transition text-sm font-medium ${bgColor}`
                            }, `${d} · ${coins}c`);
                        })
                    ),
                    React.createElement("div", { className: "flex gap-3 pt-5 mt-2 border-t border-gray-100 dark:border-gray-800" },
                        React.createElement("button", { type: "button", onClick: () => { deleteHabit(editingHabit.id); setEditingHabit(null); }, className: "flex-1 py-3.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl lowercase text-sm font-medium" }, "delete"),
                        React.createElement("button", { type: "submit", className: "flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl lowercase text-sm font-medium" }, "save")
                    )
                )
            )
        );
    };

    const RewardsPage = ({ user, db, onToggleView }) => {
        const [rewards, setRewards] = useState([]);
        const [claimedRewards, setClaimedRewards] = useState([]);
        const [wallet, setWallet] = useState({ coins: 0 });
        const [showAddReward, setShowAddReward] = useState(false);
        const [editingReward, setEditingReward] = useState(null);
        const [notification, setNotification] = useState(null);
        const [newReward, setNewReward] = useState({ title: "", cost: 50, description: "" });

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
            const unsub3 = window.onSnapshot(window.collection(db, `/artifacts/${appId}/users/${userId}/claimedRewards`), snap => {
                const claims = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                claims.sort((a, b) => (b.claimedAt || 0) - (a.claimedAt || 0));
                setClaimedRewards(claims);
            });
            return () => { unsub1(); unsub2(); unsub3(); };
        }, [db, userId, appId]);

        const showNotif = (msg) => { setNotification(msg); setTimeout(() => setNotification(null), 3000); };

        const addReward = async (e) => {
            e.preventDefault();
            if (!newReward.title.trim()) return;
            const id = Date.now().toString();
            await window.setDoc(window.doc(db, `/artifacts/${appId}/users/${userId}/rewards/${id}`), {
                id,
                title: newReward.title.trim(),
                cost: parseInt(newReward.cost) || 50,
                description: newReward.description.trim() || ""
            });
            setNewReward({ title: "", cost: 50, description: "" });
            setShowAddReward(false);
            showNotif("reward added!");
        };

        const saveReward = async (e) => {
            e.preventDefault();
            if (!editingReward || !editingReward.title.trim()) return;
            await window.updateDoc(window.doc(db, `/artifacts/${appId}/users/${userId}/rewards/${editingReward.id}`), {
                title: editingReward.title.trim(),
                cost: parseInt(editingReward.cost) || 50,
                description: editingReward.description?.trim() || ""
            });
            setEditingReward(null);
            showNotif("reward updated!");
        };

        const buyReward = async (id) => {
            const r = rewards.find(x => x.id === id);
            if (!r || wallet.coins < r.cost) return showNotif("insufficient coins, complete habits to earn more!");
            await window.updateDoc(window.doc(db, `/artifacts/${appId}/users/${userId}/gamification/wallet`), { coins: wallet.coins - r.cost });
            const claimId = Date.now().toString();
            await window.setDoc(window.doc(db, `/artifacts/${appId}/users/${userId}/claimedRewards/${claimId}`), {
                id: claimId,
                rewardId: r.id,
                title: r.title,
                cost: r.cost,
                claimedAt: Date.now()
            });
            if (typeof window.confetti === 'function') window.confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
            showNotif("congratulations! reward claimed!");
        };

        const deleteReward = async (id) => {
            if (confirm('Delete reward?')) await window.deleteDoc(window.doc(db, `/artifacts/${appId}/users/${userId}/rewards/${id}`));
        };

        const formatDate = (timestamp) => {
            if (!timestamp) return '';
            const date = new Date(timestamp);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        };

        return React.createElement("div", { className: "container mx-auto px-4 py-6 max-w-4xl", style: { paddingBottom: '100px', marginTop: '16px' } },
            notification && React.createElement("div", { className: "fixed top-20 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl lowercase", style: { zIndex: 9999 } }, notification),

            React.createElement("div", { className: "flex justify-between items-center mb-6" },
                React.createElement("h2", { className: "text-3xl text-calm-800 mb-2", style: { fontWeight: 300 } }, "rewards"),
                React.createElement("div", { className: "flex items-center gap-3" },
                    React.createElement(CoinDisplay, { amount: wallet.coins }),
                    onToggleView && React.createElement("button", {
                        onClick: onToggleView,
                        className: "px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition lowercase text-sm",
                        title: "View Habits"
                    }, "habits")
                )
            ),

            // Available Rewards
            React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8" },
                rewards.map(r => React.createElement("div", {
                    key: r.id,
                    className: `relative p-4 rounded-2xl border transition ${wallet.coins >= r.cost ? 'bg-white dark:bg-gray-800 hover:border-blue-400 hover:shadow-lg' : 'bg-gray-50 dark:bg-gray-800 opacity-60'}`
                },
                    // Reward content
                    React.createElement("div", { className: "text-left mb-3" },
                        React.createElement("h3", { className: "text-lg dark:text-white lowercase font-medium mb-1" }, r.title),
                        r.description && React.createElement("p", { className: "text-sm text-gray-500 dark:text-gray-400 mb-1" }, r.description),
                        React.createElement("div", { className: "text-sm", style: { color: '#92400e', fontWeight: '500' } }, `${r.cost} coins`)
                    ),
                    // Action buttons
                    React.createElement("div", { className: "flex gap-2" },
                        React.createElement("button", {
                            onClick: () => buyReward(r.id),
                            disabled: wallet.coins < r.cost,
                            className: `flex-1 py-2 rounded-lg lowercase text-sm transition ${wallet.coins >= r.cost ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`
                        }, "claim"),
                        React.createElement("button", {
                            onClick: () => setEditingReward({ ...r }),
                            className: "px-3 py-2 text-gray-400 hover:text-blue-500 transition"
                        }, React.createElement(SysIcon, { name: "edit", size: 16 })),
                        React.createElement("button", {
                            onClick: () => deleteReward(r.id),
                            className: "px-3 py-2 text-gray-400 hover:text-red-500 transition"
                        }, React.createElement(SysIcon, { name: "x", size: 16 }))
                    )
                )),
                React.createElement("button", { onClick: () => setShowAddReward(true), className: "flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-400 hover:text-blue-500 hover:border-blue-400 min-h-[120px]" },
                    React.createElement(SysIcon, { name: "plus", size: 28 }),
                    React.createElement("span", { className: "mt-2 lowercase text-sm" }, "add reward")
                )
            ),

            // Claimed Rewards History
            claimedRewards.length > 0 && React.createElement("div", { className: "mt-8" },
                React.createElement("h3", { className: "text-lg font-light text-gray-600 dark:text-gray-300 lowercase mb-4" }, "claimed rewards"),
                React.createElement("div", { className: "space-y-2" },
                    claimedRewards.slice(0, 10).map(claim => React.createElement("div", {
                        key: claim.id,
                        className: "flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-100 dark:border-green-800/30"
                    },
                        React.createElement("div", { className: "flex-1" },
                            React.createElement("span", { className: "text-gray-800 dark:text-white lowercase font-medium" }, claim.title),
                            React.createElement("span", { className: "text-gray-400 text-sm ml-2" }, `${claim.cost}c`)
                        ),
                        React.createElement("span", { className: "text-xs text-gray-400" }, formatDate(claim.claimedAt))
                    ))
                ),
                claimedRewards.length > 10 && React.createElement("p", { className: "text-sm text-gray-400 mt-2 text-center lowercase" }, `+ ${claimedRewards.length - 10} more`)
            ),

            // Add Reward Modal
            showAddReward && React.createElement("div", { className: "fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4", style: { zIndex: 10000 }, onClick: () => setShowAddReward(false) },
                React.createElement("form", { onSubmit: addReward, onClick: e => e.stopPropagation(), className: "bg-white dark:bg-gray-900 p-5 sm:p-6 rounded-2xl w-full max-w-xs sm:max-w-sm md:max-w-md shadow-2xl" },
                    React.createElement("div", { className: "flex justify-between items-center mb-4" },
                        React.createElement("h3", { className: "text-xl font-light dark:text-white lowercase" }, "new reward"),
                        React.createElement("button", { type: "button", onClick: () => setShowAddReward(false), className: "p-2 text-gray-400 hover:text-gray-600" }, React.createElement(SysIcon, { name: "x", size: 18 }))
                    ),
                    React.createElement("input", { type: "text", value: newReward.title, onChange: e => setNewReward({ ...newReward, title: e.target.value }), placeholder: "reward name...", className: "w-full px-4 py-3 rounded-xl mb-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white lowercase", autoFocus: true }),
                    React.createElement("textarea", { value: newReward.description, onChange: e => setNewReward({ ...newReward, description: e.target.value }), placeholder: "description (optional)...", rows: 2, className: "w-full px-4 py-3 rounded-xl mb-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white resize-none" }),
                    React.createElement("input", { type: "number", value: newReward.cost, onChange: e => setNewReward({ ...newReward, cost: e.target.value }), placeholder: "cost in coins", className: "w-full px-4 py-3 rounded-xl mb-4 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white" }),
                    React.createElement("button", { type: "submit", className: "w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl lowercase" }, "add reward")
                )
            ),

            // Edit Reward Modal
            editingReward && React.createElement("div", { className: "fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4", style: { zIndex: 10000 }, onClick: () => setEditingReward(null) },
                React.createElement("form", { onSubmit: saveReward, onClick: e => e.stopPropagation(), className: "bg-white dark:bg-gray-900 p-5 sm:p-6 rounded-2xl w-full max-w-xs sm:max-w-sm md:max-w-md shadow-2xl" },
                    React.createElement("div", { className: "flex justify-between items-center mb-4" },
                        React.createElement("h3", { className: "text-xl font-light dark:text-white lowercase" }, "edit reward"),
                        React.createElement("button", { type: "button", onClick: () => setEditingReward(null), className: "p-2 text-gray-400 hover:text-gray-600" }, React.createElement(SysIcon, { name: "x", size: 18 }))
                    ),
                    React.createElement("input", { type: "text", value: editingReward.title, onChange: e => setEditingReward({ ...editingReward, title: e.target.value }), placeholder: "reward name...", className: "w-full px-4 py-3 rounded-xl mb-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white lowercase", autoFocus: true }),
                    React.createElement("textarea", { value: editingReward.description || "", onChange: e => setEditingReward({ ...editingReward, description: e.target.value }), placeholder: "description (optional)...", rows: 2, className: "w-full px-4 py-3 rounded-xl mb-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white resize-none" }),
                    React.createElement("input", { type: "number", value: editingReward.cost, onChange: e => setEditingReward({ ...editingReward, cost: e.target.value }), placeholder: "cost in coins", className: "w-full px-4 py-3 rounded-xl mb-4 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white" }),
                    React.createElement("div", { className: "flex gap-2" },
                        React.createElement("button", { type: "button", onClick: () => { deleteReward(editingReward.id); setEditingReward(null); }, className: "flex-1 py-3 text-red-500 hover:bg-red-50 rounded-xl lowercase border border-red-200" }, "delete"),
                        React.createElement("button", { type: "submit", className: "flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl lowercase" }, "save")
                    )
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
    console.log("HabitsTab v50 loaded - improved edit habit modal spacing");
})();


