(function () {
    const { useState, useEffect, useMemo } = React;

    // --- Components ---

    const MoodInput = ({ value, onChange, disabled }) => {
        // 1-10 Scale
        const MOODS = [
            { r: 1, color: '#ef4444' }, // Red-500
            { r: 2, color: '#f87171' },
            { r: 3, color: '#fca5a5' },
            { r: 4, color: '#facc15' }, // Yellow-400
            { r: 5, color: '#fde047' },
            { r: 6, color: '#fef08a' },
            { r: 7, color: '#4ade80' }, // Green-400
            { r: 8, color: '#22c55e' },
            { r: 9, color: '#16a34a' },
            { r: 10, color: '#15803d' } // Green-700
        ];

        return React.createElement('div', { className: "mb-10 font-sans w-full" },
            // Label
            React.createElement('div', { className: "text-center mb-6 text-xs font-bold text-gray-400 opacity-60 lowercase tracking-[0.2em]" }, "select your mood"),

            // Buttons Container
            React.createElement('div', { className: "flex justify-between items-center w-full gap-2 px-1 overflow-x-auto pb-4 no-scrollbar" },
                MOODS.map(mood =>
                    React.createElement('button', {
                        key: mood.r,
                        onClick: () => !disabled && onChange(mood.r),
                        disabled: disabled,
                        // Oval shape
                        className: `group relative flex items-center justify-center flex-shrink-0 transition-all duration-300 ease-out border-2 ${value === mood.r
                            ? 'w-14 h-10 sm:w-16 sm:h-12 shadow-lg scale-110 border-transparent'
                            : 'w-10 h-8 sm:w-12 sm:h-9 hover:w-14 hover:h-10 bg-white border-gray-100 hover:border-transparent hover:shadow-md'
                            } rounded-full ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`,
                        style: {
                            backgroundColor: value === mood.r ? mood.color : undefined,
                            borderColor: value === mood.r ? mood.color : undefined,
                            color: value === mood.r ? 'white' : '#9ca3af'
                        }
                    },
                        // Number inside
                        React.createElement('span', {
                            className: `text-base sm:text-lg font-bold`
                        }, mood.r)
                    )
                )
            ),
            // Range Labels (Only start and end)
            React.createElement('div', { className: "flex justify-between text-[10px] text-gray-300 px-2 mt-4 font-bold lowercase tracking-widest w-full" },
                React.createElement('span', null, "awful"),
                React.createElement('span', null, "perfect")
            )
        );
    };

    const JournalInput = ({ journal, onChange, disabled }) => {
        const handleChange = (field, text) => {
            onChange({ ...journal, [field]: text });
        };

        const questions = [
            { id: 'well', label: 'what are you grateful for?' },
            { id: 'learned', label: 'what did you learn?' },
            { id: 'improve', label: 'what would you change?' }
        ];

        return React.createElement('div', { className: "space-y-8 mb-10 font-sans w-full" },
            questions.map(q =>
                React.createElement('div', { key: q.id, className: "group relative" },
                    React.createElement('label', { className: "block text-sm font-medium text-gray-400 mb-3 pl-1 lowercase tracking-wide transition-colors group-hover:text-gray-600" }, q.label),
                    React.createElement('textarea', {
                        value: journal[q.id] || '',
                        onChange: (e) => handleChange(q.id, e.target.value),
                        disabled: disabled,
                        className: "w-full p-5 rounded-[2rem] bg-gray-50/80 border border-transparent focus:bg-white focus:border-gray-100 focus:shadow-lg focus:ring-0 transition-all duration-300 outline-none resize-none h-28 text-base font-normal text-gray-700 placeholder-gray-300",
                        placeholder: "type here...",
                        style: { lineHeight: '1.6' }
                    })
                )
            )
        );
    };

    // Exportable MoodStats component for use in Reports
    const MoodStats = ({ history }) => {
        const getAverage = (days) => {
            const now = new Date();
            const cutoff = new Date();
            cutoff.setDate(cutoff.getDate() - days);

            const logs = history.filter(h => {
                const d = new Date(h.date);
                return d >= cutoff && d <= now;
            });

            if (logs.length === 0) return 0;
            const sum = logs.reduce((acc, curr) => acc + curr.rating, 0);
            return (sum / logs.length).toFixed(1);
        };

        const weeklyAvg = getAverage(7);
        const monthlyAvg = getAverage(30);
        const totalLogs = history.length;

        return React.createElement('div', { className: "flex justify-center gap-12 sm:gap-24 w-full mb-12 font-sans border-b border-gray-100/50 pb-8" },
            [
                { label: '7-day avg', value: weeklyAvg },
                { label: '30-day avg', value: monthlyAvg },
                { label: 'total logs', value: totalLogs }
            ].map(stat =>
                React.createElement('div', { key: stat.label, className: "text-center flex flex-col items-center" },
                    React.createElement('div', { className: "text-3xl font-light text-gray-800 mb-1 tracking-tighter" }, stat.value),
                    React.createElement('div', { className: "text-[10px] text-gray-400 font-bold lowercase tracking-[0.2em]" }, stat.label)
                )
            )
        );
    };

    // Expose MoodStats for Reports page
    window.MoodStats = MoodStats;

    const MoodCalendar = ({ history, onDateSelect, selectedDate }) => {
        const [currentDate, setCurrentDate] = useState(new Date());

        const calendarData = useMemo(() => {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const daysInMonth = lastDay.getDate();
            const startPadding = firstDay.getDay();
            const days = [];
            for (let i = 0; i < startPadding; i++) days.push(null);
            for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
            return days;
        }, [currentDate]);

        const getMoodColor = (rating) => {
            if (!rating) return '#f3f4f6';
            if (rating >= 8) return '#4ade80';
            if (rating >= 6) return '#a3e635';
            if (rating >= 4) return '#facc15';
            return '#f87171';
        };

        const getMoodForDay = (date) => {
            if (!date) return null;
            const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            return history.find(h => h.date === dateStr);
        };

        const weekDays = ['s', 'm', 't', 'w', 't', 'f', 's'];
        const monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

        const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
        const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

        const isSelected = (day) => {
            if (!day || !selectedDate) return false;
            const dayStr = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
            return dayStr === selectedDate;
        };

        return React.createElement('div', { className: "w-full font-sans bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100" },
            // Header
            React.createElement('div', { className: "flex justify-between items-center mb-8" },
                React.createElement('h2', { className: "text-xl font-light text-gray-800 tracking-tight lowercase" },
                    `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                ),
                React.createElement('div', { className: "flex gap-4" },
                    React.createElement('button', { onClick: prevMonth, className: "w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition" }, "←"),
                    React.createElement('button', { onClick: nextMonth, className: "w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition" }, "→")
                )
            ),

            // Calendar Grid
            React.createElement('div', {
                style: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }
            },
                weekDays.map((d, i) =>
                    React.createElement('div', { key: i, className: "text-center text-[10px] text-gray-300 font-bold lowercase tracking-widest mb-2" }, d)
                ),

                calendarData.map((day, i) => {
                    if (!day) return React.createElement('div', { key: `pad-${i}` });

                    const log = getMoodForDay(day);
                    const selected = isSelected(day);
                    const isToday = day && new Date().toDateString() === day.toDateString();

                    return React.createElement('div', {
                        key: day ? day.toISOString() : `empty-${i}`,
                        onClick: () => day && onDateSelect(day),
                        className: `aspect-square rounded-xl flex items-center justify-center text-xs font-medium transition-all duration-300 cursor-pointer relative group 
                            ${selected ? 'ring-2 ring-gray-900 z-10 scale-105' : ''} 
                            ${!selected && isToday ? 'bg-gray-100 text-gray-900' : ''}
                            hover:scale-105
                        `,
                        style: {
                            backgroundColor: log ? getMoodColor(log.rating) : (!selected && isToday ? undefined : 'transparent'),
                            color: log ? 'white' : (isToday ? undefined : '#d1d5db'),
                            border: (!log && !isToday && !selected) ? '1px solid #f9fafb' : 'none'
                        },
                        title: log ? `rating: ${log.rating}/10` : 'no log'
                    },
                        React.createElement('span', { className: "z-10 relative" }, day.getDate()),

                        // Tooltip
                        log && React.createElement('div', {
                            className: "absolute bottom-full mb-3 hidden group-hover:block bg-gray-900 text-white text-[10px] py-1.5 px-3 rounded-xl pointer-events-none whitespace-nowrap z-20 shadow-xl"
                        }, `${log.rating}/10`)
                    );
                })
            )
        );
    };

    // Main component - accepts showStats prop to conditionally render stats
    const MoodTrackerTab = ({ user, db, appId, showStats = true, embedded = false }) => {
        const [selectedDate, setSelectedDate] = useState(() => {
            const d = new Date();
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        });

        const [moodRating, setMoodRating] = useState(null);
        const [journal, setJournal] = useState({ well: '', learned: '', improve: '' });
        const [isSubmitting, setIsSubmitting] = useState(false);
        const [history, setHistory] = useState([]);

        useEffect(() => {
            const log = history.find(h => h.date === selectedDate);
            if (log) {
                setMoodRating(log.rating);
                setJournal(log.journal || { well: '', learned: '', improve: '' });
            } else {
                setMoodRating(null);
                setJournal({ well: '', learned: '', improve: '' });
            }
        }, [selectedDate, history]);

        useEffect(() => {
            if (!user || !db) return;
            const fetchHistory = async () => {
                try {
                    const logsRef = window.collection(db, `/artifacts/${appId}/users/${user.id}/mood_logs`);
                    const snapshot = await window.getDocs(logsRef);
                    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setHistory(data);
                } catch (e) {
                    console.error("Error fetching mood history:", e);
                }
            };
            fetchHistory();
        }, [user, db, appId]);

        const handleSave = async () => {
            if (!user || !db || !moodRating) return;

            setIsSubmitting(true);
            try {
                const docRef = window.doc(db, `/artifacts/${appId}/users/${user.id}/mood_logs/${selectedDate}`);
                const logData = {
                    rating: moodRating,
                    journal: journal,
                    timestamp: window.serverTimestamp ? window.serverTimestamp() : new Date(),
                    userId: user.id,
                    date: selectedDate
                };

                await window.setDoc(docRef, logData, { merge: true });

                setHistory(prev => {
                    const filtered = prev.filter(h => h.date !== selectedDate);
                    return [...filtered, logData];
                });

                if (window.__showNotification) {
                    window.__showNotification({ type: 'success', message: 'saved successfully!' });
                }
            } catch (e) {
                console.error("Error saving mood log:", e);
            } finally {
                setIsSubmitting(false);
            }
        };

        const handleDateSelect = (dateObj) => {
            const dateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
            setSelectedDate(dateStr);
        };

        const isToday = (selectedDate === (() => {
            const d = new Date();
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        })());

        // Embedded mode: more compact, no full-page wrapper
        if (embedded) {
            return React.createElement('div', { className: "w-full font-sans mb-12" },
                // Header
                React.createElement('header', { className: "text-center mb-8" },
                    React.createElement('h2', { className: "text-2xl font-light text-gray-800 mb-2 tracking-tight lowercase" }, "mood check-in"),
                    React.createElement('div', { className: "flex items-center justify-center gap-3 text-sm text-gray-400 font-medium tracking-widest lowercase" },
                        React.createElement('span', null, new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })),
                        !isToday && React.createElement('span', { className: "bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-[10px] font-bold" }, "history")
                    )
                ),

                React.createElement('div', { className: "flex flex-col gap-8" },
                    // Mood Input
                    React.createElement(MoodInput, {
                        value: moodRating,
                        onChange: setMoodRating,
                        disabled: isSubmitting
                    }),

                    // Journal Input
                    React.createElement('div', { className: "animate-fade-in" },
                        React.createElement(JournalInput, {
                            journal: journal,
                            onChange: setJournal,
                            disabled: isSubmitting
                        }),

                        // Save Button
                        React.createElement('div', { className: "flex justify-center mt-6" },
                            React.createElement('button', {
                                onClick: handleSave,
                                disabled: isSubmitting || !moodRating,
                                className: `w-full px-10 py-4 rounded-2xl font-bold text-sm lowercase tracking-[0.2em] shadow-xl transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${isSubmitting ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-black border border-transparent dark:border-gray-700'
                                    }`
                            }, isSubmitting ? 'saving...' : (history.find(h => h.date === selectedDate) ? 'update entry' : 'save entry'))
                        )
                    ),

                    // Calendar
                    React.createElement('div', { className: "pt-8 border-t border-gray-100" },
                        React.createElement(MoodCalendar, { history, onDateSelect: handleDateSelect, selectedDate })
                    )
                )
            );
        }

        // Standalone mode (full page)
        return React.createElement('div', { className: "w-full min-h-screen bg-[#fafafa] dark:bg-gray-900" },
            React.createElement('div', { className: "max-w-4xl mx-auto p-6 md:p-12 pb-32 font-sans" },
                // Header
                React.createElement('header', { className: "text-center mb-12 mt-4" },
                    React.createElement('h1', { className: "text-4xl font-light text-gray-800 dark:text-gray-100 mb-3 tracking-tighter lowercase" }, "mood check-in"),
                    React.createElement('div', { className: "flex items-center justify-center gap-3 text-sm text-gray-400 font-medium tracking-widest lowercase" },
                        React.createElement('span', null, new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })),
                        !isToday && React.createElement('span', { className: "bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-[10px] font-bold" }, "history")
                    )
                ),

                // Stats (only show if showStats is true)
                showStats && React.createElement(MoodStats, { history }),

                React.createElement('div', { className: "flex flex-col gap-12" },

                    // Mood Input
                    React.createElement(MoodInput, {
                        value: moodRating,
                        onChange: setMoodRating,
                        disabled: isSubmitting
                    }),

                    // Journal Input
                    React.createElement('div', { className: "animate-fade-in" },
                        React.createElement(JournalInput, {
                            journal: journal,
                            onChange: setJournal,
                            disabled: isSubmitting
                        }),

                        // Save Button
                        React.createElement('div', { className: "flex justify-center mt-8" },
                            React.createElement('button', {
                                onClick: handleSave,
                                disabled: isSubmitting || !moodRating,
                                className: `w-full px-10 py-5 rounded-2xl font-bold text-sm lowercase tracking-[0.2em] shadow-xl transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${isSubmitting ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-black border border-transparent dark:border-gray-700'
                                    }`
                            }, isSubmitting ? 'saving...' : (history.find(h => h.date === selectedDate) ? 'update entry' : 'save entry'))
                        )
                    ),

                    // Calendar at bottom
                    React.createElement('div', { className: "pt-10 border-t border-gray-100" },
                        React.createElement(MoodCalendar, { history, onDateSelect: handleDateSelect, selectedDate })
                    )
                )
            )
        );
    };

    // Expose to window
    window.MoodTrackerTab = MoodTrackerTab;
})();
