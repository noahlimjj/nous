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
            icon: ICONS[category] || ICONS.default
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
        showNotification(`Added task to ${formatDate(currentDate)}`);
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
        return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    const getDaySummary = () => {
        const currentTasks = tasks[currentDate] || [];
        if (currentTasks.length === 0) return 'No tasks scheduled';

        const counts = {};
        currentTasks.forEach(t => counts[t.category] = (counts[t.category] || 0) + 1);
        const cats = Object.keys(counts).map(c => c === 'training' ? 'Training' : c.charAt(0).toUpperCase() + c.slice(1));

        return cats.length > 1 ? `Focus: ${cats.join(' + ')}` : `Focus: ${cats[0]}`;
    };

    const currentTasks = (tasks[currentDate] || []).sort((a, b) => a.time.localeCompare(b.time));

    // --- JSX ---
    return React.createElement('div', { className: "max-w-4xl mx-auto p-4" },
        // Header
        React.createElement('div', { className: "mb-8 text-center" },
            React.createElement('h2', { className: "text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2" },
                "Calendar Checklist"
            ),
            React.createElement('p', { className: "text-gray-600 dark:text-gray-400" }, "Daily checklist with calendar integration")
        ),

        // Input Area
        React.createElement('div', { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6" },
            React.createElement('div', { className: "flex flex-col md:flex-row gap-4 items-end" },
                React.createElement('div', { className: "flex-1 w-full" },
                    React.createElement('label', { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" }, "Select Date"),
                    React.createElement('input', {
                        type: "date",
                        value: currentDate,
                        onChange: (e) => setCurrentDate(e.target.value),
                        className: "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    })
                ),
                React.createElement('div', { className: "flex-1 w-full" },
                    React.createElement('label', { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" }, "Add New Task"),
                    React.createElement('input', {
                        type: "text",
                        value: newTaskInput,
                        onChange: (e) => setNewTaskInput(e.target.value),
                        onKeyDown: (e) => e.key === 'Enter' && addTask(),
                        placeholder: "e.g. 'gym 6pm' or 'study math'",
                        className: "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    })
                ),
                React.createElement('button', {
                    onClick: addTask,
                    className: "bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-colors h-[50px] flex items-center justify-center"
                }, "Add Task")
            )
        ),

        // Tasks List
        React.createElement('div', { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6" },
            React.createElement('div', { className: "flex justify-between items-center mb-6" },
                React.createElement('h3', { className: "text-xl font-semibold text-gray-800 dark:text-gray-100" },
                    formatDate(currentDate)
                ),
                React.createElement('span', { className: "text-gray-500 dark:text-gray-400" },
                    `${currentTasks.length} tasks`
                )
            ),

            currentTasks.length === 0 ?
                React.createElement('div', { className: "text-center py-12 text-gray-500 dark:text-gray-400" },
                    React.createElement('div', { className: "text-4xl mb-4" }, "📝"),
                    React.createElement('p', {}, "No tasks yet")
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
                                React.createElement('button', {
                                    onClick: () => toggleTask(task.id),
                                    className: "mr-4 text-xl hover:scale-110 transition-transform"
                                }, task.done ? '✅' : '○'),
                                React.createElement('div', { className: "flex-1" },
                                    React.createElement('div', { className: "flex items-center" },
                                        React.createElement('span', { className: "mr-2" }, task.icon),
                                        React.createElement('span', {
                                            className: `font-medium ${task.done ? 'line-through text-gray-400' : 'text-gray-800 dark:text-gray-200'}`
                                        }, task.task)
                                    ),
                                    task.time !== '08:00' && React.createElement('div', { className: "text-sm text-gray-500 mt-1" },
                                        `🕒 ${task.time}`
                                    )
                                ),
                                React.createElement('button', {
                                    onClick: () => deleteTask(task.id),
                                    className: "ml-2 text-red-500 hover:text-red-700"
                                }, "🗑️")
                            )
                        )
                    )
                )
        ),

        // Notification
        notification && React.createElement('div', {
            className: "fixed bottom-8 right-8 bg-black/80 text-white px-6 py-3 rounded-lg shadow-xl animate-fade-in z-50"
        }, notification)
    );
};

window.CalendarChecklist = CalendarChecklist;
