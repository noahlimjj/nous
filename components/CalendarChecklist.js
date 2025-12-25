(function () {
    const { useState, useEffect } = React;

    const CalendarChecklist = () => {
        // --- Data & State ---
        const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
        const [tasks, setTasks] = useState({}); // Map: date -> array of tasks
        const [newTaskInput, setNewTaskInput] = useState('');
        const [notification, setNotification] = useState(null);

        // --- Constants ---
        const CATEGORIES = {
            'training': ['train', 'gym', 'bjj', 'workout', 'exercise', 'session', 'practice', 'training', 'cardio', 'strength', 'yoga', 'run', 'fitness'],
            'academic': ['study', 'sch', 'class', 'lecture', 'exam', 'review', 'read', 'homework', 'research', 'project', 'assignment', 'paper', 'course', 'lesson'],
            'personal': ['meet', 'appointment', 'lunch', 'dinner', 'call', 'chat', 'meditation', 'reflection', 'personal', 'errand', 'shop', 'doctor'],
            'travel': ['fly', 'trip', 'travel', 'flight', 'drive', 'visit', 'transport', 'commute', 'direction', 'journey', 'vacation']
        };

        const ICONS = {
            'training': '💪',
            'academic': '📚',
            'personal': '👤',
            'travel': '✈️',
            'default': '📝'
        };

        // --- Components ---
        const Icon = ({ name, size = 20, className = "" }) => {
            const icons = {
                check: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
                checkOutline: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z",
                trash: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
                clock: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
                training: "M13 2L3 14h9l-1 8 10-12h-9l1-8z", // Zap icon for training
                academic: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z", // Book
                personal: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", // User
                travel: "M5 22h14 M5 2h14 M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22 M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2",
                default: "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.77 10-10 10Z M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" // Leaf
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
            }, React.createElement("path", { d: icons[name] || icons.default }));
        };

        // --- Helpers ---
        const generateId = () => 'task_' + Date.now() + '_' + Math.floor(Math.random() * 1000000);

        const parseTask = (taskStr, date) => {
            // Extract time
            const timeMatch = taskStr.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm|a\.m\.|p\.m\.)?\b/i);
            let time = '08:00';
            let taskWithoutTime = taskStr;

            if (timeMatch) {
                let hours = parseInt(timeMatch[1]);
                const minutes = timeMatch[2] || '00';
                const period = timeMatch[3]?.toLowerCase().replace('.', '');

                if (period && period.includes('p') && hours !== 12) hours += 12;
                else if (period && period.includes('a') && hours === 12) hours = 0;

                time = `${String(hours).padStart(2, '0')}:${minutes}`;
                taskWithoutTime = taskStr.replace(timeMatch[0], '').trim();
            }

            // Determine category
            let category = 'default';
            for (const [cat, keywords] of Object.entries(CATEGORIES)) {
                if (keywords.some(k => taskWithoutTime.toLowerCase().includes(k))) {
                    category = cat;
                    break;
                }
            }

            const formattedTask = taskWithoutTime.replace(/\s+/g, ' ').trim();
            return {
                id: generateId(),
                date,
                time,
                task: formattedTask.charAt(0).toUpperCase() + formattedTask.slice(1),
                category,
                done: false,
                // Store category name for icon lookup
                iconName: category
            };
        };

        // --- Actions ---
        const addTask = () => {
            if (!newTaskInput.trim()) return;

            const task = parseTask(newTaskInput, currentDate);
            setTasks(prev => {
                const dateTasks = prev[currentDate] || [];
                return {
                    ...prev,
                    [currentDate]: [...dateTasks, task]
                };
            });

            setNewTaskInput('');
            showNotification(`added task to ${formatDate(currentDate)}`);
        };

        const toggleTask = (taskId) => {
            setTasks(prev => {
                const dateTasks = prev[currentDate] ? [...prev[currentDate]] : [];
                const taskIndex = dateTasks.findIndex(t => t.id === taskId);
                if (taskIndex > -1) {
                    dateTasks[taskIndex] = { ...dateTasks[taskIndex], done: !dateTasks[taskIndex].done };
                    return { ...prev, [currentDate]: dateTasks };
                }
                return prev;
            });
        };

        const deleteTask = (taskId) => {
            setTasks(prev => {
                const dateTasks = prev[currentDate] ? prev[currentDate].filter(t => t.id !== taskId) : [];
                return { ...prev, [currentDate]: dateTasks };
            });
        };

        const showNotification = (msg) => {
            setNotification(msg);
            setTimeout(() => setNotification(null), 3000);
        };

        // --- Render Helpers ---
        const formatDate = (dateStr) => {
            return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).toLowerCase();
        };

        const currentTasks = (tasks[currentDate] || []).sort((a, b) => a.time.localeCompare(b.time));

        // --- JSX ---
        return React.createElement('div', { className: "max-w-4xl mx-auto p-4" },
            // Header
            React.createElement('div', { className: "mb-8 text-center" },
                React.createElement('h2', { className: "text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2 lowercase" },
                    "daily habits"
                ),
                React.createElement('p', { className: "text-gray-600 dark:text-gray-400 lowercase" }, "track your daily tasks and habits")
            ),

            // Input Area
            React.createElement('div', { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6" },
                React.createElement('div', { className: "flex flex-col md:flex-row gap-4 items-end" },
                    React.createElement('div', { className: "flex-1 w-full" },
                        React.createElement('label', { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 lowercase" }, "select date"),
                        React.createElement('input', {
                            type: "date",
                            value: currentDate,
                            onChange: (e) => setCurrentDate(e.target.value),
                            className: "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 lowercase"
                        })
                    ),
                    React.createElement('div', { className: "flex-1 w-full" },
                        React.createElement('label', { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 lowercase" }, "add new task"),
                        React.createElement('input', {
                            type: "text",
                            value: newTaskInput,
                            onChange: (e) => setNewTaskInput(e.target.value),
                            onKeyDown: (e) => e.key === 'Enter' && addTask(),
                            placeholder: "e.g. 'gym 6pm' or 'study math'",
                            className: "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 lowercase"
                        })
                    ),
                    React.createElement('button', {
                        onClick: addTask,
                        className: "bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-colors h-[50px] flex items-center justify-center lowercase"
                    }, "add task")
                )
            ),

            // Tasks List
            React.createElement('div', { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6" },
                React.createElement('div', { className: "flex justify-between items-center mb-6" },
                    React.createElement('h3', { className: "text-xl font-semibold text-gray-800 dark:text-gray-100 lowercase" },
                        formatDate(currentDate)
                    ),
                    React.createElement('span', { className: "text-gray-500 dark:text-gray-400 lowercase" },
                        `${currentTasks.length} tasks`
                    )
                ),

                currentTasks.length === 0 ?
                    React.createElement('div', { className: "text-center py-12 text-gray-500 dark:text-gray-400" },
                        React.createElement('div', { className: "flex justify-center mb-4" },
                            React.createElement(Icon, { name: "default", size: 48, className: "text-gray-300" })
                        ),
                        React.createElement('p', { className: "lowercase" }, "no tasks yet")
                    ) :
                    React.createElement('div', { className: "space-y-4" },
                        currentTasks.map(task =>
                            React.createElement('div', {
                                key: task.id,
                                className: `p-4 rounded-xl border-l-4 transition-all hover:translate-x-1 ${task.category === 'training' ? 'bg-red-50 border-red-500 dark:bg-red-900/20' :
                                    task.category === 'academic' ? 'bg-blue-50 border-blue-500 dark:bg-blue-900/20' :
                                        task.category === 'personal' ? 'bg-sky-50 border-sky-500 dark:bg-sky-900/20' :
                                            task.category === 'travel' ? 'bg-green-50 border-green-500 dark:bg-green-900/20' :
                                                'bg-gray-50 border-gray-500 dark:bg-gray-700/50'
                                    }`
                            },
                                React.createElement('div', { className: "flex items-center" },
                                    // Checkbox (Button)
                                    React.createElement('button', {
                                        onClick: () => toggleTask(task.id),
                                        className: `mr-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.done ? 'bg-green-500 border-green-500 text-white' : 'border-gray-400 text-transparent hover:border-green-500'
                                            }`
                                    }, React.createElement(Icon, { name: "check", size: 14 })),

                                    React.createElement('div', { className: "flex-1" },
                                        React.createElement('div', { className: "flex items-center" },
                                            React.createElement("div", { className: "mr-3 text-gray-500" },
                                                React.createElement(Icon, { name: task.iconName || "default", size: 20 })
                                            ),
                                            React.createElement('span', {
                                                className: `font-medium lowercase ${task.done ? 'line-through text-gray-400' : 'text-gray-800 dark:text-gray-200'}`
                                            }, task.task)
                                        ),
                                        task.time !== '08:00' && React.createElement('div', { className: "text-sm text-gray-500 mt-1 flex items-center gap-1 ml-8" },
                                            React.createElement(Icon, { name: "clock", size: 14 }),
                                            React.createElement("span", null, task.time)
                                        )
                                    ),
                                    React.createElement('button', {
                                        onClick: () => deleteTask(task.id),
                                        className: "ml-2 text-gray-400 hover:text-red-500 transition-colors"
                                    }, React.createElement(Icon, { name: "trash", size: 18 }))
                                )
                            )
                        )
                    )
            ),

            // Notification
            notification && React.createElement('div', {
                className: "fixed bottom-8 right-8 bg-black/80 text-white px-6 py-3 rounded-lg shadow-xl animate-fade-in z-50 lowercase"
            }, notification)
        );
    };

    window.CalendarChecklist = CalendarChecklist;
})();
