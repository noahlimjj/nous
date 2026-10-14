(function () {
    console.log("HabitsTab script starting execution...");
    const { useState, useEffect } = React;

    // Bespoke vector symbols crafted for Nous minimalist aesthetic
    const NOUS_SYMBOLS = {
        // Study & Knowledge Work
        // Habit symbols: 24x24, 2px-optical line style, round caps (Lucide-derived geometry)
        study: { label: "study", path: "M21.42 10.92a1 1 0 0 0-.02-1.84L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.83l8.57 3.91a2 2 0 0 0 1.66 0z M22 10v6 M6 12.5V16a6 3 0 0 0 12 0v-3.5" },
        reading: { label: "read", path: "M12 7v14 M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" },
        writing: { label: "write", path: "M12 20h9 M16.38 3.62a1 1 0 0 1 3 3L7.37 18.64a2 2 0 0 1-.86.5l-2.87.84a.5.5 0 0 1-.62-.62l.84-2.87a2 2 0 0 1 .5-.86z" },
        coding: { label: "code", path: "M18 5a2 2 0 0 1 2 2v8.53a2 2 0 0 0 .21.9l1.07 2.12a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45l1.07-2.12a2 2 0 0 0 .21-.9V7a2 2 0 0 1 2-2z M20.05 16H3.95 M10 9l-2 2 2 2 M14 9l2 2-2 2" },
        language: { label: "language", path: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" },
        bulb: { label: "idea", path: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5 M9 18h6 M10 22h4" },
        target: { label: "focus", path: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" },
        bolt: { label: "energy", path: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" },
        chart: { label: "progress", path: "M22 7l-8.5 8.5-5-5L2 17 M16 7h6v6" },
        wake: { label: "wake up", path: "M12 2v8 M4.93 10.93l1.41 1.41 M2 18h2 M20 18h2 M19.07 10.93l-1.41 1.41 M22 22H2 M8 6l4-4 4 4 M16 18a4 4 0 0 0-8 0" },
        sleep: { label: "sleep", path: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z" },
        nophone: { label: "no phone", path: "M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z M11 18h2 M2 2l20 20" },
        gym: { label: "gym", path: "M14.4 14.4 9.6 9.6 M18.66 21.49a2 2 0 1 1-2.83-2.83l-1.77 1.77a2 2 0 1 1-2.83-2.83l6.36-6.36a2 2 0 1 1 2.83 2.83l-1.77 1.77a2 2 0 1 1 2.83 2.83z M21.5 21.5l-1.4-1.4 M3.9 3.9 2.5 2.5 M6.4 12.77a2 2 0 1 1-2.83-2.83l1.77-1.77a2 2 0 1 1-2.83-2.83l2.83-2.83a2 2 0 1 1 2.83 2.83l1.77-1.77a2 2 0 1 1 2.83 2.83z" },
        walk: { label: "walk", path: "M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0z M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0z M16 17h4 M4 13h4" },
        water: { label: "water", path: "M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" },
        apple: { label: "eat well", path: "M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06z M10 2c1 .5 2 2 2 5" },
        coffee: { label: "coffee", path: "M10 2v2 M14 2v2 M6 2v2 M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1" },
        leaf: { label: "nature", path: "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" },
        heart: { label: "health", path: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7z" },
        fire: { label: "streak", path: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z" },
        star: { label: "star", path: "M11.53 2.3a.53.53 0 0 1 .95 0l2.31 4.68a2.12 2.12 0 0 0 1.6 1.16l5.16.76a.53.53 0 0 1 .3.9l-3.74 3.64a2.12 2.12 0 0 0-.61 1.88l.88 5.14a.53.53 0 0 1-.77.56l-4.62-2.43a2.12 2.12 0 0 0-1.97 0L6.4 21.01a.53.53 0 0 1-.77-.56l.88-5.14a2.12 2.12 0 0 0-.61-1.88L2.16 9.8a.53.53 0 0 1 .3-.9l5.16-.76a2.12 2.12 0 0 0 1.6-1.16z" },
        music: { label: "music", path: "M9 18V5l12-2v13 M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0z M21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" },
        budget: { label: "budget", path: "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1 M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" },
        create: { label: "create", path: "M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z M13.5 6.5h.01 M17.5 10.5h.01 M8.5 7.5h.01 M6.5 12.5h.01" },

        // System & Milestone icons (for full compatibility with Milestones tab)
        trophy: { label: "trophy", path: "M8 21h8m-4-4v4M5 4h14a2 2 0 0 1 2 2v2a5 5 0 0 1-5 5h-4a5 5 0 0 1-5-5V6a2 2 0 0 1 2-2zM3 6h2v3a3 3 0 0 1-3-3zm18 0h-2v3a3 3 0 0 0 3-3z" },
        calendar: { label: "calendar", path: "M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM16 2v4M8 2v4M3 10h18" },
        edit: { label: "edit", path: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" }
    };

    // Curated high-aesthetic habit icons for selection in Add/Edit habit modals
    const CURATED_HABIT_ICONS = [
        'study', 'reading', 'writing', 'coding', 'language', 'bulb',
        'target', 'bolt', 'chart', 'wake', 'sleep', 'nophone',
        'gym', 'walk', 'water', 'apple', 'coffee', 'leaf',
        'heart', 'fire', 'star', 'music', 'budget', 'create'
    ];

    // Emoji to custom vector symbol lookup
    const EMOJI_TO_SYMBOL = {
        '😴': 'sleep', '💤': 'sleep', '⏰': 'wake', '🌅': 'wake', '☀️': 'wake',
        '📖': 'reading', '📚': 'study', '🥋': 'gym', '🤸': 'gym', '🏋️': 'gym',
        '💪': 'gym', '🏃': 'walk', '🚶': 'walk', '🏊': 'gym', '🧘': 'leaf',
        '🧠': 'target', '👁️': 'target', '🍃': 'leaf', '🌿': 'leaf', '🌱': 'leaf',
        '🌳': 'leaf', '💧': 'water', '☕': 'coffee', '💻': 'coding', '📝': 'writing',
        '✍️': 'writing', '🙏': 'heart', '🔥': 'fire', '⭐': 'star', '❤️': 'heart',
        '🎵': 'music', '🥗': 'apple', '🍎': 'apple', '📵': 'nophone', '⚡': 'bolt',
        '🎯': 'target', '🏆': 'target', '💼': 'study', '🎓': 'study',
        '🔬': 'study', '💡': 'bulb', '🏅': 'star', '🩺': 'heart',
        '🧪': 'study', '📅': 'chart', '📊': 'chart', '🔗': 'target', '✏️': 'writing',
        '🌍': 'language', '🗣️': 'language', '💰': 'budget', '🎨': 'create', '📱': 'nophone'
    };

    const resolveIconKey = (rawName, fallback = 'study') => {
        if (!rawName) return fallback;
        if (NOUS_SYMBOLS[rawName]) return rawName;
        if (EMOJI_TO_SYMBOL[rawName]) return EMOJI_TO_SYMBOL[rawName];

        const str = String(rawName).toLowerCase().trim();
        if (NOUS_SYMBOLS[str]) return str;
        if (EMOJI_TO_SYMBOL[str]) return EMOJI_TO_SYMBOL[str];

        // Keyword resolution to curated clean geometric symbols
        if (str.includes('sleep') || str.includes('bed') || str.includes('night')) return 'sleep';
        if (str.includes('wake') || str.includes('morning') || str.includes('sun')) return 'wake';
        if (str.includes('read') || str.includes('book')) return 'reading';
        if (str.includes('study') || str.includes('exam')) return 'study';
        if (str.includes('phone') || str.includes('screen') || str.includes('social media') || str.includes('scroll')) return 'nophone';
        if (str.includes('walk') || str.includes('run') || str.includes('step') || str.includes('jog')) return 'walk';
        if (str.includes('language') || str.includes('spanish') || str.includes('french') || str.includes('japanese') || str.includes('korean') || str.includes('chinese') || str.includes('duolingo')) return 'language';
        if (str.includes('budget') || str.includes('money') || str.includes('finance') || str.includes('saving')) return 'budget';
        if (str.includes('draw') || str.includes('paint') || str.includes('sketch') || str.includes('design')) return 'create';
        if (str.includes('gym') || str.includes('lift') || str.includes('workout') || str.includes('fit') || str.includes('swim') || str.includes('bjj') || str.includes('martial') || str.includes('sport')) return 'gym';
        if (str.includes('meditat') || str.includes('mind') || str.includes('zen') || str.includes('yoga') || str.includes('breathe') || str.includes('eye') || str.includes('focus')) return 'target';
        if (str.includes('water') || str.includes('hydrat')) return 'water';
        if (str.includes('eat') || str.includes('food') || str.includes('diet') || str.includes('fruit') || str.includes('veg')) return 'apple';
        if (str.includes('leaf') || str.includes('nature') || str.includes('green')) return 'leaf';
        if (str.includes('coffee') || str.includes('tea')) return 'coffee';
        if (str.includes('code') || str.includes('dev') || str.includes('program') || str.includes('tech')) return 'coding';
        if (str.includes('write') || str.includes('journal') || str.includes('log') || str.includes('note')) return 'writing';
        if (str.includes('target') || str.includes('goal')) return 'target';
        if (str.includes('bolt') || str.includes('deep') || str.includes('energy') || str.includes('power')) return 'bolt';
        if (str.includes('fire') || str.includes('streak')) return 'fire';
        if (str.includes('star')) return 'star';
        if (str.includes('music') || str.includes('audio') || str.includes('song')) return 'music';
        if (str.includes('heart') || str.includes('love') || str.includes('health')) return 'heart';
        if (str.includes('idea') || str.includes('bulb') || str.includes('think')) return 'bulb';
        if (str.includes('chart') || str.includes('stat') || str.includes('track')) return 'chart';

        return fallback;
    };

    // Preset habit colors (kept for internal consistency and safety)
    const COLORS = [
        '#FF6B6B', '#FF9F43', '#FECA57', '#26DE81', '#17C0EB',
        '#4B7BEC', '#A55EEA', '#FD79A8', '#000000', '#FFFFFF'
    ];

    // Selectable symbols for Add / Edit habit modals
    const ICONS = CURATED_HABIT_ICONS.reduce((acc, k) => {
        acc[k] = k;
        return acc;
    }, {});

    // Pure vector SVG Icon component
    const Icon = ({ name, size = 20, className = '', color = 'currentColor', strokeWidth = 2, style = {} }) => {
        const key = resolveIconKey(name);
        const item = NOUS_SYMBOLS[key] || NOUS_SYMBOLS.leaf;

        return React.createElement("svg", {
            width: size,
            height: size,
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: color,
            strokeWidth: strokeWidth,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            className: className,
            style: { flexShrink: 0, display: 'inline-block', verticalAlign: 'middle', ...style }
        }, React.createElement("path", { d: item.path }));
    };

    // Expose for Milestones and other tabs
    window.NOUS_SYMBOLS = NOUS_SYMBOLS;
    window.EMOJI_TO_SYMBOL = EMOJI_TO_SYMBOL;
    window.resolveNousSymbol = resolveIconKey;
    window.NousIcon = Icon;

    // Stopwatch icon component (same as index.js timer section)
    const StopwatchIcon = ({ size = 16 }) => React.createElement('svg', {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
    },
        React.createElement('circle', { cx: "12", cy: "13", r: "8" }),
        React.createElement('path', { d: "M12 9v4l2 2" }),
        React.createElement('path', { d: "M9 4h6" }),
        React.createElement('path', { d: "M12 2v2" })
    );

    // Hourglass icon component for countdown/timer mode
    const HourglassIcon = ({ size = 16 }) => React.createElement('svg', {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
    },
        React.createElement('path', { d: "M5 22h14" }),
        React.createElement('path', { d: "M5 2h14" }),
        React.createElement('path', { d: "M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" }),
        React.createElement('path', { d: "M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" })
    );

    const SysIcon = ({ name, size = 20 }) => {
        const paths = {
            check: "M20 6L9 17l-5-5",
            circle: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
            plus: "M12 4v16m8-8H4",
            trash: "M3 6h18 M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6 M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2 M10 11v6 M14 11v6",
            reset: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8 M3 3v5h5",
            x: "M6 18L18 6M6 6l12 12",
            fire: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z",
            left: "M15 18l-6-6 6-6",
            right: "M9 18l6-6-6-6",
            edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
            star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        };
        return React.createElement("svg", {
            width: size, height: size, viewBox: "0 0 24 24", fill: "none",
            stroke: "currentColor", strokeWidth: name === 'check' ? "2.6" : "2", strokeLinecap: "round", strokeLinejoin: "round"
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

    const toLocalDateString = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        // console.log(`toLocalDateString: input=${date}, output=${year}-${month}-${day} (timezone offset check)`);
        return `${year}-${month}-${day}`;
    };

    const calcStreak = (dates) => {
        if (!dates || dates.length === 0) return 0;
        const sorted = [...dates].sort().reverse();
        const today = toLocalDateString(new Date());
        const yesterday = toLocalDateString(new Date(Date.now() - 86400000));
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
            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
        }
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
    };

    const getTimerMs = (totalMs) => Math.floor((totalMs % 1000) / 10);

    // Custom hook for timer tick - only re-renders when timers are running
    const useTimerTick = (timers) => {
        const [tick, setTick] = useState(0);
        useEffect(() => {
            const hasRunning = Object.values(timers).some(t => t && t.isRunning);
            if (!hasRunning) return;
            // Update every 100ms instead of 50ms for better performance
            const interval = setInterval(() => setTick(Date.now()), 100);
            return () => clearInterval(interval);
        }, [timers]);
        return tick;
    };

    // ============================================
    // STARTER PACK + WEEKLY RECAP HELPERS
    // ============================================

    // Suggested first habits for new users (first three are preselected)
    const STARTER_HABITS = [
        { key: 'deep-work', title: 'deep work', icon: 'target', tracking_type: 'timed', daily_goal_mins: 60, difficulty: 'medium' },
        { key: 'read', title: 'read', icon: 'reading', tracking_type: 'timed', daily_goal_mins: 20, difficulty: 'easy' },
        { key: 'wake', title: 'wake up early', icon: 'wake', tracking_type: 'binary', daily_goal_mins: 0, difficulty: 'hard' },
        { key: 'move', title: 'move your body', icon: 'gym', tracking_type: 'timed', daily_goal_mins: 30, difficulty: 'medium' },
        { key: 'water', title: 'drink water', icon: 'water', tracking_type: 'binary', daily_goal_mins: 0, difficulty: 'easy' },
        { key: 'nophone', title: 'no phone before bed', icon: 'nophone', tracking_type: 'binary', daily_goal_mins: 0, difficulty: 'medium' },
        { key: 'journal', title: 'journal', icon: 'writing', tracking_type: 'binary', daily_goal_mins: 0, difficulty: 'easy' },
        { key: 'language', title: 'learn a language', icon: 'language', tracking_type: 'timed', daily_goal_mins: 15, difficulty: 'easy' }
    ];
    const STARTER_DEFAULT_KEYS = ['deep-work', 'read', 'wake'];

    // Local date string a session belongs to (mirrors getTodayLoggedMs precedence)
    const sessionDateStr = (s) => {
        if (s.localDate) return s.localDate;
        const raw = s.startTime || s.endTime || s.createdAt;
        if (!raw) return null;
        const dt = raw.toDate ? raw.toDate() : new Date(raw);
        return isNaN(dt) ? null : toLocalDateString(dt);
    };

    const formatFocus = (ms) => {
        const totalMins = Math.round(ms / 60000);
        const h = Math.floor(totalMins / 60);
        const m = totalMins % 60;
        if (h === 0) return `${m}m`;
        return m === 0 ? `${h}h` : `${h}h ${m}m`;
    };

    // Builds the recap for the Mon–Sun week starting at `monday`
    const computeWeekRecap = (habits, sessions, monday) => {
        const days = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            days.push(toLocalDateString(d));
        }
        const prevMonday = new Date(monday);
        prevMonday.setDate(monday.getDate() - 7);
        const prevStart = toLocalDateString(prevMonday);
        const todayIso = toLocalDateString(new Date());
        const elapsedDays = days.filter(d => d <= todayIso);

        const dailyMs = days.map(() => 0);
        const habitMs = {};
        let prevFocusMs = 0;
        (sessions || []).forEach(s => {
            const ds = sessionDateStr(s);
            if (!ds) return;
            const idx = days.indexOf(ds);
            const dur = s.duration || 0;
            if (idx >= 0) {
                dailyMs[idx] += dur;
                if (s.habitId) habitMs[s.habitId] = (habitMs[s.habitId] || 0) + dur;
            } else if (ds >= prevStart && ds < days[0]) {
                prevFocusMs += dur;
            }
        });
        const focusMs = dailyMs.reduce((a, b) => a + b, 0);

        const perHabit = habits.map(h => {
            const dates = new Set(h.completionDates || []);
            const doneDays = days.map(d => dates.has(d));
            return {
                id: h.id,
                title: h.title || 'untitled',
                icon: h.icon,
                doneDays,
                doneCount: doneDays.filter(Boolean).length,
                focusMs: habitMs[h.id] || 0,
                streak: calcStreak(h.completionDates)
            };
        });
        const checkins = perHabit.reduce((a, h) => a + h.doneCount, 0);
        const possible = habits.length * elapsedDays.length;
        const perfectDays = habits.length === 0 ? 0 : elapsedDays.filter(d => habits.every(h => (h.completionDates || []).includes(d))).length;
        const bestIdx = dailyMs.reduce((best, v, i) => (v > dailyMs[best] ? i : best), 0);
        const topStreak = perHabit.reduce((a, h) => Math.max(a, h.streak), 0);

        return {
            days, todayIso, dailyMs, focusMs, prevFocusMs, perHabit, checkins, possible,
            perfectDays, bestIdx: dailyMs[bestIdx] > 0 ? bestIdx : -1, topStreak,
            hasActivity: focusMs > 0 || checkins > 0
        };
    };

    const recapRangeLabel = (days) => {
        const fmt = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return `${fmt(days[0])} – ${fmt(days[6])}`.toLowerCase();
    };

    const WeekRecapModal = ({ recap, onClose }) => {
        const [copied, setCopied] = useState(false);
        const maxMs = Math.max(...recap.dailyMs, 1);
        const delta = recap.focusMs - recap.prevFocusMs;
        const shareText = [
            `my week on nous (${recapRangeLabel(recap.days)})`,
            `${formatFocus(recap.focusMs)} focused`,
            recap.possible > 0 ? `${recap.checkins}/${recap.possible} check-ins` : null,
            recap.perfectDays > 0 ? `${recap.perfectDays} perfect day${recap.perfectDays === 1 ? '' : 's'}` : null,
            recap.topStreak > 0 ? `🔥 ${recap.topStreak} day streak` : null
        ].filter(Boolean).join(' · ');

        const share = async () => {
            try {
                if (navigator.share) {
                    await navigator.share({ text: shareText });
                    return;
                }
                await navigator.clipboard.writeText(shareText);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (e) { /* user cancelled share */ }
        };

        return React.createElement("div", {
            className: "fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm",
            style: { zIndex: 10000, padding: '20px' },
            onClick: onClose
        },
            React.createElement("div", {
                className: "nous-recap",
                onClick: e => e.stopPropagation(),
                role: "dialog",
                "aria-label": "Weekly recap"
            },
                // Header
                React.createElement("div", { className: "nous-recap-head" },
                    React.createElement("div", null,
                        React.createElement("div", { className: "nous-recap-title" }, "your week"),
                        React.createElement("div", { className: "nous-recap-sub" }, recapRangeLabel(recap.days))
                    ),
                    React.createElement("button", { className: "nous-icon-btn", onClick: onClose, title: "Close", "aria-label": "Close" },
                        React.createElement(SysIcon, { name: "x", size: 18 }))
                ),

                // Hero number
                React.createElement("div", { className: "nous-recap-hero" },
                    React.createElement("div", { className: "nous-recap-hero-num" }, formatFocus(recap.focusMs)),
                    React.createElement("div", { className: "nous-recap-hero-label" },
                        "focused",
                        (recap.prevFocusMs > 0 || recap.focusMs > 0) && React.createElement("span", {
                            className: `nous-pill ${delta >= 0 ? 'is-met' : ''}`,
                            style: { marginLeft: '8px' }
                        }, `${delta >= 0 ? '↑' : '↓'} ${formatFocus(Math.abs(delta))} vs last week`)
                    )
                ),

                // Daily focus columns
                React.createElement("div", { className: "nous-recap-chart", role: "img", "aria-label": `Daily focus: ${recap.days.map((d, i) => `${new Date(`${d}T12:00:00`).toLocaleDateString('en-US', { weekday: 'short' })} ${formatFocus(recap.dailyMs[i])}`).join(', ')}` },
                    recap.days.map((d, i) => {
                        const ms = recap.dailyMs[i];
                        const isFuture = d > recap.todayIso;
                        const pct = ms > 0 ? Math.max(6, Math.round((ms / maxMs) * 100)) : 0;
                        const dayName = new Date(`${d}T12:00:00`).toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();
                        return React.createElement("div", { key: d, className: "nous-recap-col", title: `${dayName} · ${formatFocus(ms)}` },
                            React.createElement("div", { className: "nous-recap-bar-area" },
                                i === recap.bestIdx && React.createElement("div", { className: "nous-recap-bar-label", style: { bottom: `calc(${pct}% + 4px)` } }, formatFocus(ms)),
                                ms > 0
                                    ? React.createElement("div", { className: "nous-recap-bar", style: { height: `${pct}%` } })
                                    : React.createElement("div", { className: `nous-recap-bar-empty ${isFuture ? 'is-future' : ''}` })
                            ),
                            React.createElement("div", { className: `nous-recap-day ${d === recap.todayIso ? 'is-today' : ''}` }, dayName.charAt(0))
                        );
                    })
                ),

                // Stat tiles
                React.createElement("div", { className: "nous-recap-stats" },
                    [
                        { label: 'check-ins', value: recap.possible > 0 ? `${recap.checkins}/${recap.possible}` : '—' },
                        { label: 'perfect days', value: String(recap.perfectDays) },
                        { label: 'best streak', value: recap.topStreak > 0 ? `${recap.topStreak}d` : '—' }
                    ].map(t => React.createElement("div", { key: t.label, className: "nous-recap-stat" },
                        React.createElement("div", { className: "nous-recap-stat-value" }, t.value),
                        React.createElement("div", { className: "nous-recap-stat-label" }, t.label)
                    ))
                ),

                // Per-habit rows
                recap.perHabit.length > 0 && React.createElement("div", { className: "nous-recap-habits" },
                    recap.perHabit.map(h => React.createElement("div", { key: h.id, className: "nous-recap-habit" },
                        React.createElement("div", { className: `nous-glyph ${h.doneCount > 0 ? '' : ''}`, style: { width: '30px', height: '30px', borderRadius: '9px' } },
                            React.createElement(Icon, { name: h.icon || 'study', size: 15 })),
                        React.createElement("div", { className: "nous-recap-habit-name" }, h.title),
                        React.createElement("div", { className: "nous-recap-dots", "aria-label": `${h.doneCount} of 7 days` },
                            h.doneDays.map((done, i) => React.createElement("span", { key: i, className: `nous-recap-dot ${done ? 'is-done' : ''}` }))
                        ),
                        React.createElement("div", { className: "nous-recap-habit-count" }, `${h.doneCount}/7`)
                    ))
                ),

                // Actions
                React.createElement("div", { className: "nous-recap-actions" },
                    React.createElement("button", { className: "nous-btn-secondary", onClick: share }, copied ? "copied ✓" : "share"),
                    React.createElement("button", { className: "nous-btn-primary", onClick: onClose }, "done")
                )
            )
        );
    };

    const StarterPack = ({ onAdd, onScratch }) => {
        const [selected, setSelected] = useState(STARTER_DEFAULT_KEYS);
        const [isAdding, setIsAdding] = useState(false);
        const toggle = (key) => setSelected(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);

        return React.createElement("div", { className: "nous-starter" },
            React.createElement("div", { className: "nous-starter-title" }, "start with a few habits"),
            React.createElement("div", { className: "nous-starter-sub" }, "we picked three to get you going. tap to change, you can edit them anytime."),
            React.createElement("div", { className: "nous-starter-grid" },
                STARTER_HABITS.map(h => {
                    const isOn = selected.includes(h.key);
                    return React.createElement("button", {
                        key: h.key,
                        type: "button",
                        onClick: () => toggle(h.key),
                        className: `nous-starter-opt ${isOn ? 'is-selected' : ''}`,
                        "aria-pressed": isOn
                    },
                        React.createElement("span", { className: "nous-glyph", style: { width: '34px', height: '34px', borderRadius: '10px' } },
                            React.createElement(Icon, { name: h.icon, size: 17 })),
                        React.createElement("span", { className: "nous-starter-opt-text" },
                            React.createElement("span", { className: "nous-starter-opt-title" }, h.title),
                            React.createElement("span", { className: "nous-starter-opt-meta" }, h.tracking_type === 'binary' ? '1-tap check-in' : `${h.daily_goal_mins}m a day`)
                        ),
                        React.createElement("span", { className: "nous-starter-check" }, isOn && React.createElement(SysIcon, { name: "check", size: 12 }))
                    );
                })
            ),
            React.createElement("button", {
                type: "button",
                className: "nous-btn-primary",
                style: { width: '100%', marginTop: '20px' },
                disabled: selected.length === 0 || isAdding,
                onClick: async () => {
                    setIsAdding(true);
                    await onAdd(STARTER_HABITS.filter(h => selected.includes(h.key)));
                    setIsAdding(false);
                }
            }, selected.length === 0 ? "pick at least one" : `add ${selected.length} habit${selected.length === 1 ? '' : 's'}`),
            React.createElement("button", { type: "button", className: "nous-starter-scratch", onClick: onScratch }, "or start from scratch")
        );
    };

    // ============================================
    // NATIVE BRIDGE (iOS app only): home-screen widget + local reminders
    // ============================================
    const NousNative = {
        isAvailable: () => !!(window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' &&
            window.Capacitor.isNativePlatform() && typeof window.Capacitor.nativePromise === 'function'),
        call: (method, options = {}) => NousNative.isAvailable()
            ? window.Capacitor.nativePromise('NousNative', method, options)
            : Promise.resolve(null)
    };

    const REMINDER_PREFS_KEY = 'nous_reminder_prefs';
    const NousReminders = {
        getPrefs: () => {
            try {
                return { enabled: false, time: '20:00', ...JSON.parse(localStorage.getItem(REMINDER_PREFS_KEY) || '{}') };
            } catch (e) {
                return { enabled: false, time: '20:00' };
            }
        },
        setPrefs: (prefs) => {
            try { localStorage.setItem(REMINDER_PREFS_KEY, JSON.stringify(prefs)); } catch (e) { /* storage unavailable */ }
            window.dispatchEvent(new Event('nous-reminders-changed'));
        }
    };
    window.NousNative = NousNative;
    window.NousReminders = NousReminders;

    // Snapshot of today's progress for the widget, and the next week of reminders
    const buildNativeSync = (habits, sessions) => {
        const now = new Date();
        const todayIso = toLocalDateString(now);
        const doneToday = habits.filter(h => (h.completionDates || []).includes(todayIso));
        const focusMs = (sessions || []).reduce((acc, s) => sessionDateStr(s) === todayIso ? acc + (s.duration || 0) : acc, 0);
        const streak = habits.reduce((a, h) => Math.max(a, calcStreak(h.completionDates)), 0);

        const snapshot = {
            date: todayIso,
            done: doneToday.length,
            total: habits.length,
            focusMinutes: Math.round(focusMs / 60000),
            streak,
            habits: habits.slice(0, 6).map(h => ({
                title: h.title || 'untitled',
                icon: resolveIconKey(h.icon),
                done: (h.completionDates || []).includes(todayIso)
            }))
        };

        const prefs = NousReminders.getPrefs();
        const items = [];
        if (prefs.enabled && habits.length > 0) {
            const [hh, mm] = String(prefs.time || '20:00').split(':').map(Number);
            const nudges = [
                'a few focused minutes keep the streak alive',
                'small steps count. check in on your habits',
                'your habits are waiting for you',
                'future you will thank you. check in today'
            ];
            for (let i = 0; i < 7; i++) {
                const at = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i, hh || 0, mm || 0, 0);
                if (at <= now) continue;
                let body;
                if (i === 0) {
                    const left = habits.length - doneToday.length;
                    if (left === 0) continue; // all done today, no nudge
                    body = `${left} habit${left === 1 ? '' : 's'} left today`;
                } else {
                    body = nudges[(at.getDate() + i) % nudges.length];
                }
                if (streak > 0) body += ` · keep your 🔥${streak} going`;
                items.push({ id: `daily-${toLocalDateString(at)}`, at: at.getTime(), title: 'nous', body });
            }
            // Sunday evening weekly recap
            const daysToSunday = (7 - now.getDay()) % 7;
            const recapAt = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysToSunday, 19, 0, 0);
            if (recapAt <= now) recapAt.setDate(recapAt.getDate() + 7);
            items.push({ id: `recap-${toLocalDateString(recapAt)}`, at: recapAt.getTime(), title: 'your week in review is ready', body: 'see your focus time, check-ins and streaks' });
        }
        return { snapshot, reminders: prefs.enabled ? items : null };
    };

    const HabitsPage = ({ user, db, isWidget = false, onToggleView, appId: propAppId, sharedTimers = [] }) => {
        // console.log("HabitsPage rendered. User:", user, "DB:", db);
        const userId = user?.uid || user?.id || null;
        // Use prop, or global, or default
        const appId = propAppId || (typeof __app_id !== 'undefined' ? __app_id : 'study-tracker-app');
        const [habits, setHabits] = useState([]);
        const [sessions, setSessions] = useState([]);
        const [wallet, setWallet] = useState({ coins: 0 });
        const [showAddHabit, setShowAddHabit] = useState(false);
        const [editingHabit, setEditingHabit] = useState(null);
        const [weekOffset, setWeekOffset] = useState(0);
        const [notification, setNotification] = useState(null);
        const [newHabit, setNewHabit] = useState({ title: "", difficulty: "medium", icon: "study", color: "#111827", tracking_type: "timed", daily_goal_mins: 0, milestone_id: null });
        const [timers, setTimers] = useState({});
        const [expandedHabit, setExpandedHabit] = useState(null);
        const [selectedHabitId, setSelectedHabitId] = useState(null);
        const [milestones, setMilestones] = useState([]);
        // Manual session state
        const [showManualSession, setShowManualSession] = useState(null); // habitId for which to show modal
        const [manualHours, setManualHours] = useState('0');
        const [manualMinutes, setManualMinutes] = useState('0');
        const [manualSessionDate, setManualSessionDate] = useState(null); // dateStr for the target date
        // Duration picker state for countdown mode
        const [showDurationPicker, setShowDurationPicker] = useState(null); // habitId for duration picker
        const [countdownHours, setCountdownHours] = useState('0');
        const [countdownMinutes, setCountdownMinutes] = useState('25');
        const [countdownSeconds, setCountdownSeconds] = useState('0');
        const [showHabitSelector, setShowHabitSelector] = useState(false);
        const [draggedHabit, setDraggedHabit] = useState(null);
        const [habitsLoaded, setHabitsLoaded] = useState(false);
        const [recapMonday, setRecapMonday] = useState(null); // Date of the Monday whose recap is open
        const [recapBannerHidden, setRecapBannerHidden] = useState(false);
        const [nativeSyncTick, setNativeSyncTick] = useState(0);

        // Touch-based reordering state (for PWA)
        const [touchDragHabit, setTouchDragHabit] = useState(null);
        const [touchDragTargetId, setTouchDragTargetId] = useState(null);
        const [touchStartY, setTouchStartY] = useState(0);
        const touchTimerRef = React.useRef(null);
        const habitRefsMap = React.useRef({});

        // BroadcastChannel for cross-tab timer sync
        const timerBroadcastRef = React.useRef(null);

        // Dashboard state
        // Track heaters checks
        const stoppedTimersRef = React.useRef(new Set());

        // Use timer tick hook - this will cause re-renders only when timers are running
        const timerTick = useTimerTick(timers);

        // Audio context ref for bell sound
        const audioContextRef = React.useRef(null);

        // Track which countdown timers have already completed (to prevent duplicate triggers)
        const completedCountdownsRef = React.useRef(new Set());

        // Play premium completion chime using Web Audio API
        const playCompletionChime = async () => {
            console.log('[HabitsTab Audio] playCompletionChime called');
            try {
                // Get or create audio context
                if (!audioContextRef.current) {
                    console.log('[HabitsTab Audio] Creating new AudioContext');
                    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
                }

                const audioContext = audioContextRef.current;
                console.log('[HabitsTab Audio] AudioContext state:', audioContext.state);

                // Resume audio context if suspended
                if (audioContext.state === 'suspended') {
                    console.log('[HabitsTab Audio] Resuming suspended AudioContext');
                    await audioContext.resume();
                }

                // Play a premium two-tone chime 3 times
                const playChime = (startOffset = 0) => {
                    // First note - C6 (1047 Hz)
                    const osc1 = audioContext.createOscillator();
                    const gain1 = audioContext.createGain();
                    osc1.connect(gain1);
                    gain1.connect(audioContext.destination);
                    osc1.frequency.setValueAtTime(1047, audioContext.currentTime + startOffset);
                    osc1.type = 'sine';
                    gain1.gain.setValueAtTime(0.3, audioContext.currentTime + startOffset);
                    gain1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + startOffset + 0.6);
                    osc1.start(audioContext.currentTime + startOffset);
                    osc1.stop(audioContext.currentTime + startOffset + 0.6);

                    // Second note - E6 (1319 Hz) with slight delay for chord effect
                    const osc2 = audioContext.createOscillator();
                    const gain2 = audioContext.createGain();
                    osc2.connect(gain2);
                    gain2.connect(audioContext.destination);
                    osc2.frequency.setValueAtTime(1319, audioContext.currentTime + startOffset + 0.05);
                    osc2.type = 'sine';
                    gain2.gain.setValueAtTime(0.25, audioContext.currentTime + startOffset + 0.05);
                    gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + startOffset + 0.65);
                    osc2.start(audioContext.currentTime + startOffset + 0.05);
                    osc2.stop(audioContext.currentTime + startOffset + 0.65);

                    // High harmonic for shimmer - G6 (1568 Hz)
                    const osc3 = audioContext.createOscillator();
                    const gain3 = audioContext.createGain();
                    osc3.connect(gain3);
                    gain3.connect(audioContext.destination);
                    osc3.frequency.setValueAtTime(1568, audioContext.currentTime + startOffset + 0.1);
                    osc3.type = 'sine';
                    gain3.gain.setValueAtTime(0.15, audioContext.currentTime + startOffset + 0.1);
                    gain3.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + startOffset + 0.7);
                    osc3.start(audioContext.currentTime + startOffset + 0.1);
                    osc3.stop(audioContext.currentTime + startOffset + 0.7);
                };

                // Play chime 3 times with gaps
                playChime(0);
                playChime(0.8);
                playChime(1.6);

                // Wait for chimes to finish, then speak
                setTimeout(() => {
                    if ('speechSynthesis' in window) {
                        const utterance = new SpeechSynthesisUtterance('Timer complete');
                        utterance.rate = 0.9;
                        utterance.pitch = 1.1;
                        utterance.volume = 0.8;
                        window.speechSynthesis.speak(utterance);
                        console.log('[HabitsTab Audio] Spoke "Timer complete"');
                    }
                }, 2500);

                console.log('[HabitsTab Audio] Chime sequence complete');
            } catch (error) {
                console.error('[HabitsTab Audio] Error playing chime:', error);
            }
        };

        // Effect to detect countdown timer completion
        useEffect(() => {
            // Check all running countdown timers
            habits.forEach(habit => {
                if (habit.timerMode !== 'timer') return; // Only check countdown timers

                const timer = timers[habit.id];
                if (!timer || !timer.isRunning) return;

                // Calculate remaining time
                const elapsed = (Date.now() - timer.startTime) + (timer.elapsedTime || 0);
                const remaining = (habit.targetDuration || 0) - elapsed;

                // Only log when close to completion (last 5 seconds)
                if (remaining <= 5000 && remaining > 0) {
                    console.log(`[HabitsTab Countdown] ${habit.title}: remaining=${Math.round(remaining)}ms`);
                }

                // Timer has completed!
                if (remaining <= 0 && !completedCountdownsRef.current.has(habit.id)) {
                    console.log(`[HabitsTab Countdown] Timer completed for ${habit.title}!`);
                    completedCountdownsRef.current.add(habit.id);

                    // Play completion chime and announce
                    playCompletionChime();

                    // Auto-stop the timer
                    stopTimer(habit.id, true);

                    // Clean up completed ref after a delay
                    setTimeout(() => {
                        completedCountdownsRef.current.delete(habit.id);
                    }, 2000);
                }
            });
        }, [timerTick, habits, timers]); // Runs on every tick

        useEffect(() => {
            if (!db || !userId) return;
            const unsub1 = window.onSnapshot(window.collection(db, `/artifacts/${appId}/users/${userId}/habits`), snap => {
                const habitsData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                // Sort by backend order if present, otherwise by creation/alphabetical
                habitsData.sort((a, b) => {
                    const orderA = a.order !== undefined ? a.order : 9999;
                    const orderB = b.order !== undefined ? b.order : 9999;
                    if (orderA !== orderB) return orderA - orderB;
                    // Fallback to ID for stable sort
                    return a.id.localeCompare(b.id);
                });
                setHabits(habitsData);
                setHabitsLoaded(true);

                // Sync active timers from Firestore
                setTimers(prev => {
                    const next = { ...prev };
                    habitsData.forEach(h => {
                        if (h.activeTimer) {
                            // Clear any stale reset marker when valid timer arrives from Firestore
                            try {
                                localStorage.removeItem(`nous_timer_reset_${h.id}`);
                            } catch (e) { /* ignore localStorage errors */ }

                            next[h.id] = {
                                isRunning: h.activeTimer.isRunning,
                                startTime: h.activeTimer.startTime?.toMillis ? h.activeTimer.startTime.toMillis() : h.activeTimer.startTime, // Convert to ms
                                elapsedTime: h.activeTimer.elapsedTime || 0,
                                originalStartTime: h.activeTimer.startTime?.toMillis ? h.activeTimer.startTime.toMillis() : h.activeTimer.startTime
                            };
                        } else if (prev[h.id] && prev[h.id].isRunning) {
                            // CONFLICT: Local timer is running, but Firestore says it's not.
                            // Check if this timer was recently reset on any device (within last 10 seconds)
                            let wasRecentlyReset = false;
                            try {
                                const resetTimestamp = localStorage.getItem(`nous_timer_reset_${h.id}`);
                                wasRecentlyReset = resetTimestamp && (Date.now() - parseInt(resetTimestamp)) < 10000;
                            } catch (e) { /* ignore localStorage errors */ }

                            if (wasRecentlyReset) {
                                // Timer was intentionally reset - trust Firestore, clear local state
                                console.log(`[HabitsTab] Timer ${h.id} was recently reset, clearing local state`);
                                next[h.id] = null;
                                if (window.OfflineTimerManager) {
                                    window.OfflineTimerManager.reset(h.id);
                                }
                                try {
                                    localStorage.removeItem(`nous_timer_reset_${h.id}`);
                                } catch (e) { /* ignore localStorage errors */ }
                            } else if (window.OfflineTimerManager && window.OfflineTimerManager.getTimers()[h.id]) {
                                // Not a recent reset + exists in OfflineManager = restore to Firestore
                                console.log(`[HabitsTab] Restoring missing activeTimer for ${h.id} from local state`);
                                // Keep local state running
                                const localTimer = prev[h.id];
                                next[h.id] = localTimer;

                                // Trigger restore sync
                                const restoreData = {
                                    activeTimer: {
                                        isRunning: true,
                                        startTime: localTimer.originalStartTime, // Keep original start time
                                        elapsedTime: localTimer.elapsedTime
                                    }
                                };
                                window.updateDoc(window.doc(db, `/artifacts/${appId}/users/${userId}/habits/${h.id}`), restoreData)
                                    .catch(e => console.error("Error restoring missing timer:", e));
                            } else if (!window.OfflineTimerManager?.isOffline()) {
                                // Only if NOT in offline mode (active decision) and NOT in OfflineManager do we trust Firestore stop
                                // (If it's not in OfflineManager, it might be a zombie state, so we let it die)
                                next[h.id] = null;
                            }
                        }
                    });
                    return next;
                });
            });

            const unsub2 = window.onSnapshot(window.doc(db, `/artifacts/${appId}/users/${userId}/gamification/wallet`), doc => {
                if (doc.exists()) setWallet(doc.data());
                else window.setDoc(window.doc(db, `/artifacts/${appId}/users/${userId}/gamification/wallet`), { coins: 0 });
            });

            let unsub3 = () => {};
            try {
                unsub3 = window.onSnapshot(window.collection(db, `/artifacts/${appId}/users/${userId}/milestones`), snap => {
                    const mList = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                    setMilestones(mList);
                }, err => console.warn('[HabitsTab] milestones listener', err));
            } catch (e) {}

            let unsub4 = () => {};
            try {
                unsub4 = window.onSnapshot(window.collection(db, `/artifacts/${appId}/users/${userId}/sessions`), snap => {
                    const sList = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                    setSessions(sList);
                }, err => console.warn('[HabitsTab] sessions listener', err));
            } catch (e) {}

            return () => { unsub1(); unsub2(); unsub3(); unsub4(); };
        }, [db, userId, appId]);

        // iOS app: keep the widget snapshot and scheduled reminders current
        useEffect(() => {
            if (!NousNative.isAvailable()) return;
            const bump = () => setNativeSyncTick(t => t + 1);
            const onVisible = () => { if (document.visibilityState === 'visible') bump(); };
            window.addEventListener('nous-reminders-changed', bump);
            document.addEventListener('visibilitychange', onVisible);
            return () => {
                window.removeEventListener('nous-reminders-changed', bump);
                document.removeEventListener('visibilitychange', onVisible);
            };
        }, []);

        useEffect(() => {
            if (!habitsLoaded || !NousNative.isAvailable()) return;
            const t = setTimeout(() => {
                const { snapshot, reminders } = buildNativeSync(habits, sessions);
                NousNative.call('setWidgetData', { json: JSON.stringify(snapshot) })
                    .catch(e => console.warn('[HabitsTab] widget sync failed', e));
                (reminders ? NousNative.call('scheduleReminders', { items: reminders }) : NousNative.call('cancelReminders'))
                    .catch(e => console.warn('[HabitsTab] reminder sync failed', e));
            }, 800);
            return () => clearTimeout(t);
        }, [habits, sessions, habitsLoaded, nativeSyncTick]);

        // Hydrate timers from OfflineTimerManager on mount

        useEffect(() => {
            if (window.OfflineTimerManager) {
                const offlineTimers = window.OfflineTimerManager.getTimers();
                setTimers(prev => {
                    const next = { ...prev };
                    Object.values(offlineTimers).forEach(t => {
                        next[t.habitId] = {
                            isRunning: t.isRunning,
                            startTime: t.startTime,
                            elapsedTime: t.elapsedTime,
                            originalStartTime: t.startTime
                        };
                    });
                    return next;
                });
            }
        }, []);

        // Auto-select habit with active timer on load/refresh
        // This ensures the running timer appears on top when the app is opened
        useEffect(() => {
            // Only auto-select if no habit is currently selected
            if (selectedHabitId !== null) return;

            // Find any habit with an active (running) timer
            const activeTimerHabitId = Object.keys(timers).find(habitId => {
                const timer = timers[habitId];
                return timer && timer.isRunning;
            });

            // Also check for paused timers (has elapsed time but not running)
            const pausedTimerHabitId = !activeTimerHabitId ? Object.keys(timers).find(habitId => {
                const timer = timers[habitId];
                return timer && !timer.isRunning && timer.elapsedTime > 0;
            }) : null;

            const habitIdToSelect = activeTimerHabitId || pausedTimerHabitId;

            if (habitIdToSelect && habits.some(h => h.id === habitIdToSelect)) {
                console.log(`[HabitsTab] Auto-selecting habit with active timer: ${habitIdToSelect}`);
                setSelectedHabitId(habitIdToSelect);
            }
        }, [timers, habits, selectedHabitId]);

        // Listen for online status to sync
        useEffect(() => {
            if (db && userId) {
                window.__currentDb = db;
                window.__currentUserId = userId;
                window.__currentAppId = appId;

                // Also trigger an immediate sync attempt if we just came online/loaded
                if (navigator.onLine && window.OfflineTimerManager) {
                    window.OfflineTimerManager.sync(db, userId, appId).catch(e => console.error("Initial sync failed", e));
                }
            }
            const handleOnline = () => {
                if (window.OfflineTimerManager) {
                    window.OfflineTimerManager.sync(db, userId, appId).catch(console.error);
                }
            };
            window.addEventListener('online', handleOnline);
            return () => window.removeEventListener('online', handleOnline);
        }, [db, userId, appId]);

        // BroadcastChannel for cross-tab timer sync (PWA <-> Web App)
        useEffect(() => {
            if (typeof BroadcastChannel === 'undefined') {
                console.log('[HabitsTab] BroadcastChannel not supported');
                return;
            }

            timerBroadcastRef.current = new BroadcastChannel('nous-timer-sync');
            console.log('[HabitsTab] BroadcastChannel "nous-timer-sync" initialized');

            timerBroadcastRef.current.onmessage = (event) => {
                const { type, habitId, userId: msgUserId } = event.data;

                // Only process messages for the same user
                if (msgUserId && msgUserId !== userId) return;

                console.log(`[HabitsTab] BroadcastChannel received: ${type} for ${habitId}`);

                if (type === 'timer-stop' || type === 'timer-reset') {
                    // Set reset timestamp to prevent restoration by conflict resolution
                    if (type === 'timer-reset') {
                        try {
                            localStorage.setItem(`nous_timer_reset_${habitId}`, Date.now().toString());
                        } catch (e) { /* ignore localStorage errors */ }
                    }

                    // Clear local timer state from another tab
                    setTimers(prev => {
                        if (prev[habitId]) {
                            console.log(`[HabitsTab] Clearing timer ${habitId} from BroadcastChannel`);
                            return { ...prev, [habitId]: null };
                        }
                        return prev;
                    });

                    // Clear from OfflineTimerManager
                    if (window.OfflineTimerManager) {
                        window.OfflineTimerManager.reset(habitId);
                    }
                }
            };

            return () => {
                if (timerBroadcastRef.current) {
                    timerBroadcastRef.current.close();
                    timerBroadcastRef.current = null;
                }
            };
        }, [userId]);

        const showNotif = (msg) => { setNotification(msg); setTimeout(() => setNotification(null), 3000); };

        // Timer functions
        const startTimer = (habitId) => {
            const habit = habits.find(h => h.id === habitId);

            // CRITICAL: Initialize AudioContext during user interaction (click)
            // This unlocks audio playback for when the timer auto-completes
            if (habit && habit.timerMode === 'timer') {
                console.log('[HabitsTab Audio] Initializing AudioContext during user interaction');
                if (!audioContextRef.current) {
                    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
                    console.log('[HabitsTab Audio] AudioContext created, state:', audioContextRef.current.state);
                }
                // Resume if suspended - this is allowed during user gesture
                if (audioContextRef.current.state === 'suspended') {
                    audioContextRef.current.resume().then(() => {
                        console.log('[HabitsTab Audio] AudioContext resumed during start, state:', audioContextRef.current.state);
                    });
                }
            }

            setTimers(prev => ({
                ...prev,
                [habitId]: {
                    isRunning: true,
                    startTime: Date.now(),
                    originalStartTime: prev[habitId]?.originalStartTime || Date.now(),
                    elapsedTime: prev[habitId]?.elapsedTime || 0
                }
            }));

            // Persist start to Firestore
            if (db && userId) {
                const batch = window.writeBatch(db);
                const habitRef = window.doc(db, `/artifacts/${appId}/users/${userId}/habits/${habitId}`);
                const userRef = window.doc(db, 'users', userId);

                batch.update(habitRef, {
                    activeTimer: {
                        isRunning: true,
                        startTime: Date.now(),
                        elapsedTime: timers[habitId]?.elapsedTime || 0
                    }
                });

                // Set current topic for friends to see
                batch.set(userRef, {
                    currentTopic: habit.title || "Studying",
                    lastActive: window.serverTimestamp ? window.serverTimestamp() : new Date()
                }, { merge: true });

                batch.commit().catch(e => console.error("Error syncing start timer:", e));
            }

            // Sync with OfflineTimerManager
            if (window.OfflineTimerManager) {
                const prevTimer = timers[habitId];
                if (prevTimer && prevTimer.elapsedTime > 0) {
                    window.OfflineTimerManager.resume(habitId);
                } else {
                    window.OfflineTimerManager.start(habitId, habit?.title || 'Unknown', habit?.targetDuration || 0);
                }
            }
        };

        const pauseTimer = (habitId) => {
            setTimers(prev => {
                const timer = prev[habitId];
                if (!timer) return prev;
                const elapsed = timer.isRunning ? (Date.now() - timer.startTime) + timer.elapsedTime : timer.elapsedTime;

                // Persist pause to Firestore
                if (db && userId) {
                    window.updateDoc(window.doc(db, `/artifacts/${appId}/users/${userId}/habits/${habitId}`), {
                        activeTimer: {
                            isRunning: false,
                            startTime: null,
                            elapsedTime: elapsed
                        }
                    }).catch(e => console.error("Error syncing pause timer:", e));
                }

                return { ...prev, [habitId]: { ...timer, isRunning: false, elapsedTime: elapsed } };
            });

            // Sync with OfflineTimerManager
            if (window.OfflineTimerManager) {
                window.OfflineTimerManager.pause(habitId);
            }
        };

        const stopTimer = async (habitId, isAutoComplete = false) => {
            // Prevent duplicate saves - check if this timer was already stopped
            if (stoppedTimersRef.current.has(habitId)) {
                return;
            }

            const timer = timers[habitId];
            if (!timer) return;
            const habit = habits.find(h => h.id === habitId);
            if (!habit) return;

            // Mark as stopped immediately
            stoppedTimersRef.current.add(habitId);

            const elapsed = timer.isRunning ? (Date.now() - timer.startTime) + timer.elapsedTime : timer.elapsedTime;

            // Clear active timer from Firestore
            if (db && userId) {
                const batch = window.writeBatch(db);
                const habitRef = window.doc(db, `/artifacts/${appId}/users/${userId}/habits/${habitId}`);

                batch.update(habitRef, {
                    activeTimer: window.deleteField ? window.deleteField() : null
                });

                // Clear current topic if no other timers are running (check local state)
                // We use a small delay or check other habits to be sure, but for now assuming single-tasking
                // is the norm. To be safe, we only clear if THIS was the active topic.
                // ideally we'd query all active timers but that's async. 
                // Simple approach: Set to null. If another timer is running, its next tick or status update should set it back?
                // Better: Just set it to null. Authenticity > Persistence for now.
                const userRef = window.doc(db, 'users', userId);
                batch.set(userRef, {
                    currentTopic: null,
                    lastActive: window.serverTimestamp ? window.serverTimestamp() : new Date()
                }, { merge: true });

                batch.commit().catch(e => console.error("Error clearing active timer:", e));
            }

            // Use OfflineTimerManager to handle the stop logic (it queues the save)
            let result = null;
            if (window.OfflineTimerManager) {
                result = window.OfflineTimerManager.stop(habitId, habit.title);
            }

            if (result) {
                if (isAutoComplete) {
                    showNotif("⏰ countdown complete!");
                } else {
                    showNotif(`session finished: ${formatTimerDisplay(elapsed)}`);
                }

                // Attempt immediate sync if online
                if (navigator.onLine && db && userId) {
                    try {
                        console.log(`[HabitsTab] Attempting sync with appId: ${appId}`);
                        const syncResult = await window.OfflineTimerManager.sync(db, userId, appId);

                        if (syncResult && syncResult.success) {
                            showNotif(`session saved to cloud`);
                        } else {
                            console.error("Sync incomplete:", syncResult);
                            const errorMsg = syncResult?.errors?.[0]?.error || "unknown error";
                            showNotif(`sync warning: ${errorMsg}`);
                        }
                    } catch (e) {
                        console.error("Sync failed, will retry later", e);
                        showNotif("saved offline, will sync later");
                    }
                } else {
                    showNotif("saved offline, will sync later");
                }
            } else {
                // Fallback: Timer not found in Offline Manager (e.g. cross-device, cache cleared)
                console.warn("Timer not found in OfflineManager, attempting fallback save...");

                // Sanity check: if elapsed time is more than 24 hours, discard as orphaned
                const MAX_TIMER_AGE = 24 * 60 * 60 * 1000;
                if (elapsed > MAX_TIMER_AGE) {
                    console.error(`Timer duration exceeds 24h (${Math.round(elapsed / 3600000)}h), discarding as orphaned`);
                    setTimers(prev => ({ ...prev, [habitId]: null }));
                    stoppedTimersRef.current.delete(habitId);
                    showNotif("timer data discarded (too old)");
                    return;
                }

                if (navigator.onLine && db && userId) {
                    try {
                        const hoursTracked = elapsed / (1000 * 60 * 60);

                        // 1. Update Habit
                        const habitRef = window.doc(db, `/artifacts/${appId}/users/${userId}/habits/${habitId}`);
                        const habitSnap = await window.getDoc(habitRef);
                        if (habitSnap.exists()) {
                            const hData = habitSnap.data(); // Ensure .data() is used
                            const newTotal = (hData.totalHours || 0) + hoursTracked;

                            const dateStr = toLocalDateString(new Date());
                            const currentDates = hData.completionDates || [];
                            const updatedDates = currentDates.includes(dateStr) ? currentDates : [...currentDates, dateStr];

                            await window.updateDoc(habitRef, {
                                totalHours: newTotal,
                                lastStudied: new Date(),
                                completionDates: updatedDates
                            });
                        }

                        // 2. Add Session
                        await window.addDoc(window.collection(db, `/artifacts/${appId}/users/${userId}/sessions`), {
                            habitId,
                            habitName: habit.title,
                            duration: elapsed,
                            startTime: new Date(Date.now() - elapsed),
                            endTime: new Date(),
                            createdAt: window.serverTimestamp ? window.serverTimestamp() : new Date(),
                            isManual: false,
                            source: 'timer_fallback'
                        });

                        showNotif(`session saved (restored): ${formatTimerDisplay(elapsed)}`);
                    } catch (e) {
                        console.error("Fallback save failed:", e);
                        showNotif("failed to save session");
                    }
                } else {
                    console.error("Active timer not tracked offline and currently offline. Data lost.");
                    showNotif("error: timer data lost (offline mismatch)");
                }
            }

            setSessions(prev => [...prev, {
                habitId,
                habitName: habit.title,
                duration: elapsed,
                localDate: toLocalDateString(new Date()),
                isManual: false
            }]);

            setTimers(prev => ({ ...prev, [habitId]: null }));

            // Broadcast timer stop to other tabs/PWA
            if (timerBroadcastRef.current) {
                timerBroadcastRef.current.postMessage({ type: 'timer-stop', habitId, userId });
                console.log(`[HabitsTab] Broadcast timer-stop for ${habitId}`);
            }

            // Clean up the stopped ref after a short delay
            setTimeout(() => {
                stoppedTimersRef.current.delete(habitId);
            }, 1000);
        };

        const resetTimer = (habitId) => {
            console.log(`[HabitsTab] Resetting timer for ${habitId}`);
            setTimers(prev => ({ ...prev, [habitId]: null }));

            // Track reset timestamp to prevent other devices from restoring this timer
            // This is critical for cross-device sync - prevents the conflict resolution
            // from accidentally restoring a timer that was intentionally reset
            try {
                localStorage.setItem(`nous_timer_reset_${habitId}`, Date.now().toString());
            } catch (e) {
                console.warn('[HabitsTab] Could not save reset timestamp:', e);
            }

            if (window.OfflineTimerManager) {
                window.OfflineTimerManager.reset(habitId);
            }
            // Clear active timer from BOTH Firestore locations on reset
            if (db && userId) {
                // 1. Delete from activeTimers collection (used by Dashboard/index.js)
                window.deleteDoc(window.doc(db, `/artifacts/${appId}/users/${userId}/activeTimers/${habitId}`))
                    .then(() => console.log(`[HabitsTab] Deleted activeTimers/${habitId}`))
                    .catch(e => console.warn("Error deleting from activeTimers:", e));

                // 2. Clear activeTimer field on habit document
                window.updateDoc(window.doc(db, `/artifacts/${appId}/users/${userId}/habits/${habitId}`), {
                    activeTimer: window.deleteField ? window.deleteField() : null
                }).then(() => console.log(`[HabitsTab] Cleared activeTimer for ${habitId} in DB`))
                    .catch(e => console.error("Error clearing on reset:", e));
            }

            // Broadcast timer reset to other tabs/PWA
            if (timerBroadcastRef.current) {
                timerBroadcastRef.current.postMessage({ type: 'timer-reset', habitId, userId });
                console.log(`[HabitsTab] Broadcast timer-reset for ${habitId}`);
            }
        };

        // Open duration picker for countdown mode
        const openDurationPicker = (habitId) => {
            const habit = habits.find(h => h.id === habitId);
            if (habit && habit.targetDuration) {
                // Pre-fill with existing target duration
                const totalSeconds = Math.floor(habit.targetDuration / 1000);
                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;
                setCountdownHours(String(hours));
                setCountdownMinutes(String(minutes));
                setCountdownSeconds(String(seconds));
            } else {
                // Default to 25 minutes (Pomodoro)
                setCountdownHours('0');
                setCountdownMinutes('25');
                setCountdownSeconds('0');
            }
            setShowDurationPicker(habitId);
        };

        // Save duration and switch to timer mode
        const saveDuration = async (habitId) => {
            const hours = parseInt(countdownHours) || 0;
            const minutes = parseInt(countdownMinutes) || 0;
            const seconds = parseInt(countdownSeconds) || 0;
            const totalMs = (hours * 3600 + minutes * 60 + seconds) * 1000;

            if (totalMs <= 0) {
                showNotif("please enter a valid duration");
                return;
            }

            if (!db || !userId) return;

            try {
                await window.updateDoc(window.doc(db, `/artifacts/${appId}/users/${userId}/habits/${habitId}`), {
                    timerMode: 'timer',
                    targetDuration: totalMs
                });
                showNotif(`countdown set: ${hours > 0 ? hours + 'h ' : ''}${minutes}m ${seconds}s`);
                setShowDurationPicker(null);
                // Reset the timer for this habit to start fresh
                setTimers(prev => ({ ...prev, [habitId]: { isRunning: false, startTime: null, originalStartTime: null, elapsedTime: 0 } }));
            } catch (error) {
                console.error('Error setting duration:', error);
                showNotif('failed to set duration');
            }
        };

        // Toggle timer mode - if switching to timer mode, show duration picker
        const toggleTimerMode = async (habitId) => {
            const habit = habits.find(h => h.id === habitId);
            if (!habit || !db || !userId) return;

            if (habit.timerMode === 'timer') {
                // Switch back to stopwatch mode
                try {
                    await window.updateDoc(window.doc(db, `/artifacts/${appId}/users/${userId}/habits/${habitId}`), {
                        timerMode: 'stopwatch'
                    });
                    showNotif('switched to stopwatch mode');
                } catch (error) {
                    console.error('Error toggling timer mode:', error);
                    showNotif('failed to switch mode');
                }
            } else {
                // Show duration picker to set countdown
                openDurationPicker(habitId);
            }
        };

        // Get remaining time for countdown mode
        const getRemainingTime = (habitId, habit) => {
            const elapsed = getElapsedTime(habitId);
            const target = habit?.targetDuration || 0;
            return Math.max(0, target - elapsed);
        };

        const getElapsedTime = (habitId) => {
            const timer = timers[habitId];
            if (!timer) return 0;
            if (timer.isRunning) {
                const elapsed = (Date.now() - timer.startTime) + timer.elapsedTime;
                return Math.max(0, elapsed); // Prevent negative values
            }
            return Math.max(0, timer.elapsedTime || 0);
        };

        // Calculates total tracked ms for today (from completed sessions today + active running timer)
        const getTodayLoggedMs = (habitId) => {
            const todayStr = toLocalDateString(new Date());
            const sessionMs = (sessions || []).reduce((acc, s) => {
                if (s.habitId !== habitId) return acc;
                let isToday = false;
                if (s.localDate) {
                    isToday = s.localDate === todayStr;
                } else if (s.startTime) {
                    const dt = s.startTime.toDate ? s.startTime.toDate() : new Date(s.startTime);
                    isToday = toLocalDateString(dt) === todayStr;
                } else if (s.endTime) {
                    const dt = s.endTime.toDate ? s.endTime.toDate() : new Date(s.endTime);
                    isToday = toLocalDateString(dt) === todayStr;
                } else if (s.createdAt) {
                    const dt = s.createdAt.toDate ? s.createdAt.toDate() : new Date(s.createdAt);
                    isToday = toLocalDateString(dt) === todayStr;
                }
                return isToday ? acc + (s.duration || 0) : acc;
            }, 0);

            const currentElapsed = getElapsedTime(habitId);
            return sessionMs + currentElapsed;
        };

        const getWeekDays = () => {
            const days = [];
            const today = new Date();
            const monday = new Date(today);
            // Fix for Sunday: getDay() returns 0 for Sunday, so we need to go back 6 days
            // For other days, we go back (getDay() - 1) days to reach Monday
            const dayOfWeek = today.getDay();
            const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
            monday.setDate(today.getDate() - daysSinceMonday + (weekOffset * 7));
            for (let i = 0; i < 7; i++) {
                const d = new Date(monday);
                d.setDate(monday.getDate() + i);
                days.push(d);
            }
            return days;
        };
        const weekDays = getWeekDays();
        const todayStr = toLocalDateString(new Date());

        const addHabit = async (e) => {
            e.preventDefault();
            const habitTitle = newHabit.title.trim();
            if (!habitTitle) return;

            const id = Date.now().toString();
            const maxOrder = habits.length > 0 ? Math.max(...habits.map(h => h.order || 0)) : 0;
            const createdHabit = {
                id,
                title: habitTitle,
                difficulty: newHabit.difficulty || 'medium',
                icon: newHabit.icon || 'study',
                color: '#111827',
                tracking_type: newHabit.tracking_type || 'timed',
                target_duration_sec: newHabit.target_duration_sec || 1500,
                daily_goal_mins: Number(newHabit.daily_goal_mins) || 0,
                milestone_id: newHabit.milestone_id || null,
                streak: 0,
                completionDates: [],
                order: maxOrder + 1
            };

            // 1. Optimistically update local state immediately so user sees it instantly
            setHabits(prev => [...prev, createdHabit]);
            setSelectedHabitId(id);
            setNewHabit({ title: "", difficulty: "medium", icon: "study", color: "#111827", tracking_type: "timed", daily_goal_mins: 0, milestone_id: null });
            setShowAddHabit(false);
            showNotif("habit created!");

            // 2. Persist to Firestore if available
            if (db && userId) {
                try {
                    await window.setDoc(window.doc(db, `/artifacts/${appId}/users/${userId}/habits/${id}`), createdHabit);
                } catch (error) {
                    console.error("Error creating habit in db:", error);
                }
            }
        };

        // Create the habits picked in the first-run starter pack
        const addStarterHabits = async (picks) => {
            const base = Date.now();
            const created = picks.map((p, i) => ({
                id: String(base + i),
                title: p.title,
                difficulty: p.difficulty,
                icon: p.icon,
                color: '#111827',
                tracking_type: p.tracking_type,
                target_duration_sec: 1500,
                daily_goal_mins: p.daily_goal_mins,
                milestone_id: null,
                streak: 0,
                completionDates: [],
                order: i
            }));
            setHabits(created);
            setSelectedHabitId(created[0]?.id || null);
            showNotif(`${created.length} habit${created.length === 1 ? '' : 's'} added`);
            if (db && userId) {
                try {
                    const batch = window.writeBatch(db);
                    created.forEach(h => batch.set(window.doc(db, `/artifacts/${appId}/users/${userId}/habits/${h.id}`), h));
                    await batch.commit();
                } catch (error) {
                    console.error("Error creating starter habits:", error);
                }
            }
        };

        // Weekly recap: Sunday evening shows this week, Monday shows last week
        const recapPrompt = (() => {
            const now = new Date();
            const dow = now.getDay();
            if (!(dow === 0 && now.getHours() >= 17) && dow !== 1) return null;
            const monday = new Date(weekDays[0]);
            if (weekOffset !== 0) monday.setDate(monday.getDate() - weekOffset * 7);
            if (dow === 1) monday.setDate(monday.getDate() - 7);
            monday.setHours(0, 0, 0, 0);
            const key = `nous_recap_seen_${toLocalDateString(monday)}`;
            try { if (localStorage.getItem(key)) return null; } catch (e) { /* storage unavailable */ }
            return { monday, key };
        })();
        const dismissRecapPrompt = () => {
            if (recapPrompt) { try { localStorage.setItem(recapPrompt.key, '1'); } catch (e) { /* storage unavailable */ } }
            setRecapBannerHidden(true);
        };
        const openRecap = (monday) => {
            setRecapMonday(monday);
            dismissRecapPrompt();
        };

        const saveHabit = async (e) => {
            e.preventDefault();
            if (!editingHabit || !editingHabit.title.trim()) return;
            const updatedTitle = editingHabit.title.trim();
            const updatedHabit = {
                ...editingHabit,
                title: updatedTitle,
                icon: editingHabit.icon || 'study',
                color: '#111827',
                difficulty: editingHabit.difficulty || 'medium',
                tracking_type: editingHabit.tracking_type || 'timed',
                target_duration_sec: editingHabit.target_duration_sec || 1500,
                daily_goal_mins: Number(editingHabit.daily_goal_mins) || 0,
                milestone_id: editingHabit.milestone_id || null
            };

            // 1. Optimistically update local state immediately
            setHabits(prev => prev.map(h => h.id === editingHabit.id ? updatedHabit : h));
            setEditingHabit(null);
            showNotif("habit updated!");

            // 2. Persist to Firestore if available
            if (db && userId) {
                try {
                    await window.updateDoc(window.doc(db, `/artifacts/${appId}/users/${userId}/habits/${editingHabit.id}`), {
                        title: updatedHabit.title,
                        icon: updatedHabit.icon,
                        color: updatedHabit.color,
                        difficulty: updatedHabit.difficulty,
                        tracking_type: updatedHabit.tracking_type,
                        target_duration_sec: updatedHabit.target_duration_sec,
                        daily_goal_mins: updatedHabit.daily_goal_mins,
                        milestone_id: updatedHabit.milestone_id
                    });
                } catch (error) {
                    console.error("Error saving habit in db:", error);
                }
            }
        };

        const deleteHabit = async (id) => {
            if (!confirm('Delete this habit AND all its history/sessions? This cannot be undone.')) return;

            // 1. Optimistically update local state immediately
            setHabits(prev => prev.filter(h => h.id !== id));
            if (selectedHabitId === id) {
                const remaining = habits.filter(h => h.id !== id);
                setSelectedHabitId(remaining.length > 0 ? remaining[0].id : null);
            }
            showNotif("habit deleted");

            // 2. Persist to Firestore if available
            if (db && userId) {
                try {
                    const sessionsRef = window.collection(db, `/artifacts/${appId}/users/${userId}/sessions`);
                    const q = window.query(sessionsRef, window.where('habitId', '==', id));
                    const snapshot = await window.getDocs(q);

                    const batch = window.writeBatch(db);
                    snapshot.docs.forEach(doc => {
                        batch.delete(doc.ref);
                    });

                    const habitRef = window.doc(db, `/artifacts/${appId}/users/${userId}/habits/${id}`);
                    batch.delete(habitRef);

                    await batch.commit();
                } catch (error) {
                    console.error("Error deleting habit:", error);
                }
            }
        };

        const toggleDate = async (habitId, dateStr) => {
            const habit = habits.find(h => h.id === habitId);
            if (!habit) return;
            const dates = habit.completionDates || [];
            const done = dates.includes(dateStr);
            const newDates = done ? dates.filter(d => d !== dateStr) : [...dates, dateStr];
            const coins = habit.difficulty === 'hard' ? 20 : habit.difficulty === 'medium' ? 10 : 5;
            const newStreak = calcStreak(newDates);

            // Optimistically update local state immediately
            setHabits(prev => prev.map(h => h.id === habitId ? { ...h, completionDates: newDates, streak: newStreak } : h));
            setWallet(prev => ({ ...prev, coins: Math.max(0, (prev.coins || 0) + (done ? -coins : coins)) }));

            if (db && userId) {
                try {
                    await window.updateDoc(window.doc(db, `/artifacts/${appId}/users/${userId}/habits/${habitId}`), {
                        completionDates: newDates, streak: newStreak
                    });
                    await window.setDoc(window.doc(db, `/artifacts/${appId}/users/${userId}/gamification/wallet`), {
                        coins: Math.max(0, (wallet.coins || 0) + (done ? -coins : coins))
                    }, { merge: true });
                } catch (e) {
                    console.error("Error saving toggleDate:", e);
                }
            }

            // If marking as done (not unchecking):
            // For binary habits, 1-tap completes without opening duration modal!
            // For timed habits, open manual session modal to ask for duration.
            if (!done && habit.tracking_type !== 'binary') {
                openManualSession(habitId, dateStr);
            }
            // No confetti on habit completion - only on reward claims
        };

        // Drag and Drop Handlers
        const handleDragStart = (e, habit) => {
            setDraggedHabit(habit);
            e.dataTransfer.effectAllowed = 'move';
            // Slight delay to allow ghost image to form
            setTimeout(() => e.target.classList.add('opacity-50'), 0);
        };

        const handleDragEnd = (e) => {
            setDraggedHabit(null);
            e.target.classList.remove('opacity-50');
        };

        const handleDragOver = (e, targetHabit) => {
            e.preventDefault(); // Necessary for onDrop to fire
            e.dataTransfer.dropEffect = 'move';
        };

        const handleDrop = async (e, targetHabit) => {
            e.preventDefault();
            if (!draggedHabit || draggedHabit.id === targetHabit.id) return;

            // Reorder habits array locally first for "instant" feel
            const updatedHabits = [...habits];
            const sourceIndex = updatedHabits.findIndex(h => h.id === draggedHabit.id);
            const targetIndex = updatedHabits.findIndex(h => h.id === targetHabit.id);

            updatedHabits.splice(sourceIndex, 1);
            updatedHabits.splice(targetIndex, 0, draggedHabit);

            setHabits(updatedHabits);

            // Persist new order to Firebase
            // We update ALL habits' order fields to be sure (optimization: only update affected range)
            const batch = window.writeBatch(db);
            updatedHabits.forEach((h, index) => {
                const ref = window.doc(db, `/artifacts/${appId}/users/${userId}/habits/${h.id}`);
                batch.update(ref, { order: index });
            });

            try {
                await batch.commit();
            } catch (err) {
                console.error("Order save failed:", err);
                showNotif("failed to save order");
            }
        };

        // Touch-based reordering for mobile/PWA (press and hold)
        // We track if we're awaiting a long-press to prevent scroll
        const [awaitingLongPress, setAwaitingLongPress] = useState(false);

        // Refs to store current state for use in native event handlers
        const touchDragHabitRef = React.useRef(null);
        const touchStartYRef = React.useRef(0);
        const awaitingLongPressRef = React.useRef(false);

        // Keep refs in sync with state
        React.useEffect(() => {
            touchDragHabitRef.current = touchDragHabit;
        }, [touchDragHabit]);

        React.useEffect(() => {
            awaitingLongPressRef.current = awaitingLongPress;
        }, [awaitingLongPress]);

        const handleTouchStart = (e, habit) => {
            // Clear any existing timer
            if (touchTimerRef.current) clearTimeout(touchTimerRef.current);

            const touch = e.touches[0];
            setTouchStartY(touch.clientY);
            touchStartYRef.current = touch.clientY;
            setAwaitingLongPress(true);

            // Start long-press detection timer (500ms)
            touchTimerRef.current = setTimeout(() => {
                console.log(`[HabitsTab] Long press detected on ${habit.title}`);
                setTouchDragHabit(habit);
                setAwaitingLongPress(false);
                // Haptic feedback if available
                if (navigator.vibrate) navigator.vibrate(50);
                showNotif("drag to reorder");
            }, 500);
        };

        // Native touchmove handler with { passive: false } - attached via useEffect
        const handleNativeTouchMove = React.useCallback((e) => {
            const touch = e.touches[0];
            const deltaY = Math.abs(touch.clientY - touchStartYRef.current);

            // If we're in drag mode, prevent scrolling and update target
            if (touchDragHabitRef.current) {
                e.preventDefault();
                e.stopPropagation();

                // Find which habit element is under the current touch point
                const touchY = touch.clientY;

                let newTargetId = null;
                Object.entries(habitRefsMap.current).forEach(([habitId, el]) => {
                    if (el && habitId !== touchDragHabitRef.current.id) {
                        const rect = el.getBoundingClientRect();
                        if (touchY >= rect.top && touchY <= rect.bottom) {
                            newTargetId = habitId;
                        }
                    }
                });

                setTouchDragTargetId(prev => prev !== newTargetId ? newTargetId : prev);
                return;
            }

            // If we're awaiting long-press and user moved too much, cancel it (user is scrolling)
            if (awaitingLongPressRef.current && deltaY > 10) {
                if (touchTimerRef.current) {
                    clearTimeout(touchTimerRef.current);
                    touchTimerRef.current = null;
                }
                setAwaitingLongPress(false);
            }
        }, []);

        // Attach non-passive touch event listeners to habit elements
        React.useEffect(() => {
            const elements = Object.values(habitRefsMap.current);

            elements.forEach(el => {
                if (el) {
                    el.addEventListener('touchmove', handleNativeTouchMove, { passive: false });
                }
            });

            return () => {
                elements.forEach(el => {
                    if (el) {
                        el.removeEventListener('touchmove', handleNativeTouchMove);
                    }
                });
            };
        }, [habits, handleNativeTouchMove]);

        // React touchmove handler (fallback, but passive - won't prevent scroll)
        const handleTouchMove = (e, habit) => {
            // This is now handled by native event listener above
            // Keep this for compatibility but actual prevention happens in handleNativeTouchMove
        };

        const handleTouchEnd = async (e, habit) => {
            // Clear long-press timer
            if (touchTimerRef.current) {
                clearTimeout(touchTimerRef.current);
                touchTimerRef.current = null;
            }

            // Reset awaiting state
            setAwaitingLongPress(false);

            // If we were dragging, find the drop target and reorder
            if (touchDragHabit) {
                const touch = e.changedTouches[0];
                const dropY = touch.clientY;

                // Find the habit element under the drop point
                let targetHabit = null;
                habits.forEach(h => {
                    const el = habitRefsMap.current[h.id];
                    if (el) {
                        const rect = el.getBoundingClientRect();
                        if (dropY >= rect.top && dropY <= rect.bottom) {
                            targetHabit = h;
                        }
                    }
                });

                // Perform reorder if valid target
                if (targetHabit && targetHabit.id !== touchDragHabit.id) {
                    const updatedHabits = [...habits];
                    const sourceIndex = updatedHabits.findIndex(h => h.id === touchDragHabit.id);
                    const targetIndex = updatedHabits.findIndex(h => h.id === targetHabit.id);

                    updatedHabits.splice(sourceIndex, 1);
                    updatedHabits.splice(targetIndex, 0, touchDragHabit);

                    setHabits(updatedHabits);

                    // Persist to Firestore
                    const batch = window.writeBatch(db);
                    updatedHabits.forEach((h, index) => {
                        const ref = window.doc(db, `/artifacts/${appId}/users/${userId}/habits/${h.id}`);
                        batch.update(ref, { order: index });
                    });

                    try {
                        await batch.commit();
                        showNotif("habit reordered");
                    } catch (err) {
                        console.error("Touch reorder save failed:", err);
                        showNotif("failed to save order");
                    }
                }

                setTouchDragHabit(null);
                setTouchDragTargetId(null);
            }
        };

        // Manual session handlers
        const openManualSession = (habitId, dateStr) => {
            setShowManualSession(habitId);
            setManualHours('0');
            setManualMinutes('0');
            setManualSessionDate(dateStr || toLocalDateString(new Date()));
        };

        const saveManualSession = async (habitId) => {
            const hours = parseInt(manualHours) || 0;
            const minutes = parseInt(manualMinutes) || 0;
            const totalMs = (hours * 3600 + minutes * 60) * 1000;

            if (totalMs <= 0) {
                showNotif("please enter a valid time");
                return;
            }

            const habit = habits.find(h => h.id === habitId);
            if (!habit) return;

            // Save the session to Firestore
            try {
                const dateStr = manualSessionDate || toLocalDateString(new Date());
                const [year, month, day] = dateStr.split('-').map(Number);
                const sessionDate = new Date(year, month - 1, day, 12, 0, 0); // noon on target date

                // Update habit completion dates if not already present
                const currentDates = habit.completionDates || [];
                if (!currentDates.includes(dateStr)) {
                    await window.updateDoc(window.doc(db, `/artifacts/${appId}/users/${userId}/habits/${habitId}`), {
                        completionDates: [...currentDates, dateStr]
                    });
                }

                await window.addDoc(window.collection(db, `/artifacts/${appId}/users/${userId}/sessions`), {
                    habitId: habitId,
                    habitName: habit.title,
                    duration: totalMs,
                    startTime: window.Timestamp.fromDate(sessionDate),
                    endTime: window.Timestamp.fromDate(new Date(sessionDate.getTime() + totalMs)),
                    isManual: true,
                    localDate: dateStr
                });
                // The sessions listener picks up the new doc (latency-compensated), so no local append here
                showNotif(`manual session saved: ${hours > 0 ? hours + 'h ' : ''}${minutes}m`);
                setShowManualSession(null);
            } catch (error) {
                console.error('Error saving manual session:', error);
                showNotif("failed to save session");
            }
        };

        const monthYear = weekDays[3]?.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        // Responsive layout - detect mobile screens
        const [isMobile, setIsMobile] = useState(window.innerWidth < 480);
        useEffect(() => {
            const handleResize = () => setIsMobile(window.innerWidth < 480);
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }, []);

        // Adjust sizes based on screen width
        const checkboxSize = isMobile ? '22px' : '28px';
        const habitColWidth = isMobile ? '84px' : '210px';
        const flameColWidth = isMobile ? '24px' : '36px';

        const rowStyle = { display: 'flex', alignItems: 'center', gap: isMobile ? '1px' : '4px' };
        const dayStyle = { flex: '1', textAlign: 'center', minWidth: isMobile ? '22px' : '28px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' };
        const habitColStyle = { width: habitColWidth, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };

        return React.createElement("div", { className: "px-4 py-2 max-w-4xl mx-auto", style: { paddingBottom: '80px', position: 'relative' } },
            notification && React.createElement("div", {
                className: "fixed top-20 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl lowercase",
                style: { zIndex: 9999 }
            }, notification),

            // Big Timer (if habit selected)
            // Big Timer (Always visible if habits exist)
            habits.length > 0 && (() => {
                const activeHabitId = selectedHabitId || habits[0].id;
                const h = habits.find(h => h.id === activeHabitId) || habits[0];
                if (!h) return null;
                const timer = timers[h.id];
                const isRunning = timer && timer.isRunning;
                const elapsed = getElapsedTime(h.id);

                // Check if this habit is part of a specific active shared timer
                const isShared = (sharedTimers || []).some(t =>
                    (t.active || t.status === 'active') &&
                    t.participants &&
                    t.participants.includes(userId) &&
                    t.participantHabits &&
                    t.participantHabits[userId] &&
                    t.participantHabits[userId].habitId === h.id
                );

                return React.createElement("div", {
                    className: `${isShared ? "bg-purple-50/50 ring-2 ring-purple-400" : "bg-white"} p-5 sm:p-9 rounded-3xl shadow-sm transition-all mb-8 border border-gray-100 dark:border-gray-700/80 dark:bg-gray-800/90 relative`
                },
                    // Top Bar: Habit identity on left, minimalist actions & mode toggle on right
                    React.createElement("div", { className: "nous-hero-head flex items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700/50" },
                        // Left: Habit selector + Symbol badge + Title + Edit Button
                        React.createElement("div", { className: "nous-hero-identity flex items-center gap-4 relative z-30 min-w-0" },
                            // Symbol tile
                            React.createElement("div", {
                                className: "nous-glyph nous-glyph--lg",
                                onClick: () => setShowHabitSelector(!showHabitSelector),
                                title: "Switch habit"
                            }, React.createElement(Icon, { name: h.icon || "study", size: 22 })),

                            // Dropdown & Title
                            React.createElement("div", { className: "relative flex items-center gap-1 min-w-0" },
                                React.createElement("button", {
                                    onClick: () => setShowHabitSelector(!showHabitSelector),
                                    className: "text-xl sm:text-2xl text-gray-900 dark:text-white flex items-center gap-2 hover:opacity-80 py-1 rounded-xl transition font-light min-w-0",
                                    title: "Click to switch habit"
                                },
                                    React.createElement("span", { className: "tracking-tight truncate" }, h.title),
                                    React.createElement("span", { className: "text-gray-400 flex-shrink-0" }, React.createElement(SysIcon, { name: "down", size: 18 }))
                                ),
                                // Edit button (pencil) - passes full object with defaults!
                                React.createElement("button", {
                                    onClick: () => setEditingHabit({ ...h, difficulty: h.difficulty || "medium", icon: h.icon || "study", color: "#111827", daily_goal_mins: h.daily_goal_mins || 0 }),
                                    className: "nous-icon-btn",
                                    style: { width: "36px", height: "36px" },
                                    title: "Edit habit details"
                                }, React.createElement(SysIcon, { name: "edit", size: 18 })),

                                // Dropdown menu
                                showHabitSelector && React.createElement("div", {
                                    className: "absolute top-full left-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-top-2 z-50",
                                    style: { maxHeight: "300px", overflowY: "auto" }
                                },
                                    habits.map(habit => React.createElement("button", {
                                        key: habit.id,
                                        onClick: () => { setSelectedHabitId(habit.id); setShowHabitSelector(false); },
                                        className: `w-full text-left px-5 py-4 text-base flex items-center gap-3.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition ${habit.id === h.id ? "bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-200"}`
                                    },
                                        React.createElement("div", { className: "nous-glyph", style: { width: "34px", height: "34px", borderRadius: "11px" } },
                                            React.createElement(Icon, { name: habit.icon || "study", size: 16 })),
                                        React.createElement("span", { className: "truncate" }, habit.title)
                                    )),
                                    React.createElement("button", {
                                        onClick: () => { setShowAddHabit(true); setShowHabitSelector(false); },
                                        className: "w-full text-left px-5 py-4 text-base flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-500 border-t border-gray-100 dark:border-gray-700"
                                    },
                                        React.createElement(SysIcon, { name: "plus", size: 16 }),
                                        "new habit"
                                    )
                                ),
                                showHabitSelector && React.createElement("div", { className: "fixed inset-0 z-20", onClick: () => setShowHabitSelector(false) })
                            )
                        ),

                        // Right side: Mode switcher + subtle actions (for timed habits)
                        h.tracking_type !== "binary" ? React.createElement("div", { className: "flex items-center gap-2" },
                            // Minimalist segmented pill switcher
                            React.createElement("div", { className: "flex items-center bg-gray-100 dark:bg-gray-750 p-1 rounded-full text-xs" },
                                React.createElement("button", {
                                    onClick: () => h.timerMode === "timer" && toggleTimerMode(h.id),
                                    className: `px-3 py-1 rounded-full transition-all flex items-center gap-1 font-light ${h.timerMode !== "timer" ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm font-medium" : "text-gray-500 hover:text-gray-700 dark:text-gray-400"}`
                                }, React.createElement(StopwatchIcon, { size: 13 }), "stopwatch"),
                                React.createElement("button", {
                                    onClick: () => h.timerMode !== "timer" && toggleTimerMode(h.id),
                                    className: `px-3 py-1 rounded-full transition-all flex items-center gap-1 font-light ${h.timerMode === "timer" ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm font-medium" : "text-gray-500 hover:text-gray-700 dark:text-gray-400"}`
                                }, React.createElement(HourglassIcon, { size: 13 }), "countdown")
                            ),
                            // Manual Log (+)
                            React.createElement("button", {
                                onClick: () => openManualSession(h.id, toLocalDateString(new Date())),
                                className: "nous-icon-btn",
                                title: "Log manual session",
                                "aria-label": "Log manual session"
                            }, React.createElement(SysIcon, { name: "plus", size: 17 })),
                            // Delete habit
                            React.createElement("button", {
                                onClick: () => deleteHabit(h.id),
                                className: "nous-icon-btn nous-icon-btn--danger",
                                title: "Delete habit",
                                "aria-label": "Delete habit"
                            }, React.createElement(SysIcon, { name: "trash", size: 17 }))
                        ) : React.createElement("button", {
                            onClick: () => deleteHabit(h.id),
                            className: "nous-icon-btn nous-icon-btn--danger",
                            title: "Delete habit",
                            "aria-label": "Delete habit"
                        }, React.createElement(SysIcon, { name: "trash", size: 17 }))
                    ),

                    // Center Hero: Timer or Binary Habit
                    h.tracking_type === "binary" ? (
                        (() => {
                            const todayStr = toLocalDateString(new Date());
                            const isDoneToday = (h.completionDates || []).includes(todayStr);
                            return React.createElement("div", {
                                className: "py-8 flex flex-col items-center justify-center cursor-pointer select-none",
                                onClick: () => toggleDate(h.id, todayStr)
                            },
                                React.createElement("div", {
                                    className: "rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95",
                                    style: isDoneToday ? {
                                        width: "80px", height: "80px", minWidth: "80px", minHeight: "80px",
                                        borderRadius: "50%",
                                        backgroundColor: "#10b981",
                                        color: "#ffffff",
                                        boxShadow: "0 10px 25px rgba(16, 185, 129, 0.4)",
                                        display: "flex", alignItems: "center", justifyContent: "center"
                                    } : {
                                        width: "80px", height: "80px", minWidth: "80px", minHeight: "80px",
                                        borderRadius: "50%",
                                        backgroundColor: "#f3f4f6",
                                        color: "#9ca3af",
                                        border: "2px solid #e5e7eb",
                                        display: "flex", alignItems: "center", justifyContent: "center"
                                    }
                                },
                                    React.createElement(SysIcon, { name: isDoneToday ? "check" : "circle", size: 40 })
                                ),
                                React.createElement("div", {
                                    className: "mt-4 text-base text-gray-700 dark:text-gray-200 font-light lowercase tracking-wide",
                                    style: { fontFamily: '"Satoshi", sans-serif' }
                                }, isDoneToday ? "completed today ✓" : "tap to check in today"),
                                React.createElement("div", { className: "text-xs text-gray-400 font-light mt-1" }, "1-tap habit")
                            );
                        })()
                    ) : (
                        // Standard Timer Display & Centered Controls
                        React.createElement("div", { className: "py-4 flex flex-col items-center justify-center text-center" },
                            // Digits
                            React.createElement("div", {
                                className: `timer-display text-7xl sm:text-8xl font-thin tabular-nums tracking-tight ${isShared ? "text-purple-600" : "text-gray-900 dark:text-white"} select-none transition-colors ${h.timerMode === "timer" && !isRunning ? "cursor-pointer hover:opacity-80" : ""}`,
                                style: { fontFamily: '"Satoshi", sans-serif', fontVariationSettings: '"wght" 200' },
                                onClick: h.timerMode === "timer" && !isRunning ? () => openDurationPicker(h.id) : undefined,
                                title: h.timerMode === "timer" && !isRunning ? "Click to customize countdown duration" : undefined
                            },
                                (() => {
                                    const isTimerMode = h.timerMode === "timer";
                                    const displayTime = isTimerMode ? getRemainingTime(h.id, h) : elapsed;
                                    const formatted = formatTimerDisplay(displayTime);
                                    const [mainTime, msTime] = formatted.split(".");
                                    return [
                                        React.createElement("span", { key: "time" }, mainTime),
                                        React.createElement("span", { key: "ms", className: "milliseconds text-3xl sm:text-4xl text-gray-300 dark:text-gray-600 font-thin ml-1" }, `.${msTime}`)
                                    ];
                                })()
                            ),

                            // Subtitle helper for countdown target duration
                            h.timerMode === "timer" && !isRunning && React.createElement("button", {
                                onClick: () => openDurationPicker(h.id),
                                className: "mt-2 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors font-light flex items-center gap-1.5"
                            },
                                React.createElement("span", null, `${Math.round((h.targetDuration || 1500000) / 60000)}m target`),
                                React.createElement("span", { className: "text-gray-300 dark:text-gray-600" }, "•"),
                                React.createElement("span", { className: "underline underline-offset-2" }, "click to adjust")
                            ),

                            // Centered Tactile Primary Action Controls (generous 24px gap between pause & stop buttons)
                            React.createElement("div", {
                                className: "flex items-center justify-center mt-6 mb-2",
                                style: { display: "flex", alignItems: "center", justifyContent: "center", gap: "24px" }
                            },
                                // Reset (always visible, dimmed when there's nothing to reset)
                                React.createElement("button", {
                                    onClick: () => (timer || elapsed > 0) && resetTimer(h.id),
                                    disabled: !(timer || elapsed > 0),
                                    className: "nous-reset-btn",
                                    title: "Reset timer",
                                    "aria-label": "Reset timer"
                                }, React.createElement(SysIcon, { name: "reset", size: 20 })),
                                !isRunning ? React.createElement(React.Fragment, null,
                                    // Big Beautiful Tactile Play Button (resumes when paused)
                                    React.createElement("button", {
                                        onClick: () => startTimer(h.id),
                                        className: "nous-play-btn",
                                        title: timer && elapsed > 0 ? "Resume timer" : "Start timer"
                                    },
                                        React.createElement("svg", { width: 28, height: 28, viewBox: "0 0 24 24", fill: "currentColor", className: "ml-1" },
                                            React.createElement("polygon", { points: "6 3 20 12 6 21 6 3" })
                                        )
                                    ),
                                    // Keeps play centered when there's no finish button
                                    !(timer && elapsed > 0) && React.createElement("span", { style: { width: "56px", height: "56px" }, "aria-hidden": true }),
                                    // Paused: finish & log without resuming first
                                    timer && elapsed > 0 && React.createElement("button", {
                                        onClick: () => stopTimer(h.id),
                                        className: "nous-stop-btn",
                                        title: "Finish & log session"
                                    },
                                        React.createElement("svg", { width: 20, height: 20, viewBox: "0 0 24 24", fill: "currentColor" },
                                            React.createElement("rect", { x: 5, y: 5, width: 14, height: 14, rx: 2 })
                                        )
                                    )
                                ) : (
                                    // Running Controls: Pause & Stop/Save
                                    React.createElement(React.Fragment, null,
                                        React.createElement("button", {
                                            onClick: () => pauseTimer(h.id),
                                            className: "nous-pause-btn",
                                            title: "Pause timer"
                                        },
                                            React.createElement("svg", { width: 22, height: 22, viewBox: "0 0 24 24", fill: "currentColor" },
                                                React.createElement("rect", { x: 6, y: 4, width: 4, height: 16, rx: 1 }),
                                                React.createElement("rect", { x: 14, y: 4, width: 4, height: 16, rx: 1 })
                                            )
                                        ),
                                        React.createElement("button", {
                                            onClick: () => stopTimer(h.id),
                                            className: "nous-stop-btn",
                                            title: "Finish & log session"
                                        },
                                            React.createElement("svg", { width: 20, height: 20, viewBox: "0 0 24 24", fill: "currentColor" },
                                                React.createElement("rect", { x: 5, y: 5, width: 14, height: 14, rx: 2 })
                                            )
                                        )
                                    )
                                )
                            ),

                            // Daily Goal / Countdown Progress Bar
                            (() => {
                                const hasDailyGoal = h.tracking_type !== "binary" && h.daily_goal_mins && h.daily_goal_mins > 0;
                                const isCountdown = h.tracking_type !== "binary" && h.timerMode === "timer" && h.targetDuration > 0;
                                if (!hasDailyGoal && !isCountdown) return null;

                                if (hasDailyGoal) {
                                    const targetMs = h.daily_goal_mins * 60 * 1000;
                                    const todayLoggedMs = getTodayLoggedMs(h.id);
                                    const goalPct = Math.min(100, Math.round((todayLoggedMs / targetMs) * 100));
                                    const todayMins = Math.floor(todayLoggedMs / 60000);
                                    const todaySecs = Math.floor((todayLoggedMs % 60000) / 1000);
                                    const goalMins = h.daily_goal_mins;
                                    const isAchieved = todayLoggedMs >= targetMs;

                                    return React.createElement("div", { className: "w-full max-w-md mt-6 mx-auto px-2" },
                                        React.createElement("div", {
                                            className: "flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-1.5 font-light",
                                            style: { fontFamily: '"Satoshi", sans-serif' }
                                        },
                                            React.createElement("span", { className: "flex items-center gap-1.5" },
                                                React.createElement(Icon, { name: "target", size: 13, className: isAchieved ? "text-green-600" : "text-gray-400" }),
                                                React.createElement("span", null, isAchieved
                                                    ? `daily goal achieved! ${todayMins}m / ${goalMins}m`
                                                    : `daily goal: ${todayMins}m ${isRunning ? `${todaySecs}s ` : ''}/ ${goalMins}m`
                                                )
                                            ),
                                            React.createElement("span", {
                                                className: `font-medium ${isAchieved ? "text-green-600 dark:text-green-400 font-semibold" : "text-gray-900 dark:text-white"}`
                                            }, isAchieved ? "100% ✓" : `${goalPct}%`)
                                        ),
                                        React.createElement("div", { className: "nous-progress-container" },
                                            React.createElement("div", { className: "nous-progress-track" },
                                                React.createElement("div", {
                                                    className: `nous-progress-fill ${isAchieved ? "is-complete" : ""} ${isRunning ? "is-active" : ""}`,
                                                    style: { width: `${goalPct}%` }
                                                },
                                                    goalPct > 0 && React.createElement("div", { className: "nous-progress-beacon" })
                                                )
                                            )
                                        )
                                    );
                                }

                                // Fallback to session countdown bar
                                const remainingTime = getRemainingTime(h.id, h);
                                const elapsedSession = Math.max(0, h.targetDuration - remainingTime);
                                const sessionPct = Math.min(100, Math.round((elapsedSession / h.targetDuration) * 100));
                                const targetMins = Math.round(h.targetDuration / 60000);
                                const elapsedMins = Math.floor(elapsedSession / 60000);
                                const elapsedSecs = Math.floor((elapsedSession % 60000) / 1000);
                                const sessionLabel = `session goal: ${targetMins}m target • ${elapsedMins}m ${elapsedSecs}s logged`;

                                return React.createElement("div", { className: "w-full max-w-md mt-6 mx-auto px-2" },
                                    React.createElement("div", {
                                        className: "flex justify-between items-center text-xs text-gray-400 dark:text-gray-500 mb-1.5 font-light",
                                        style: { fontFamily: '"Satoshi", sans-serif' }
                                    },
                                        React.createElement("span", null, sessionLabel),
                                        React.createElement("span", { className: "text-gray-900 dark:text-white font-medium" }, `${sessionPct}%`)
                                    ),
                                    React.createElement("div", { className: "nous-progress-container" },
                                        React.createElement("div", { className: "nous-progress-track" },
                                            React.createElement("div", {
                                                className: `nous-progress-fill ${isRunning ? "is-active" : ""}`,
                                                style: { width: `${sessionPct}%` }
                                            },
                                                sessionPct > 0 && React.createElement("div", { className: "nous-progress-beacon" })
                                            )
                                        )
                                    )
                                );
                            })()
                        )
                    )
                );
            })(),

            // First run: starter habit pack
            habitsLoaded && habits.length === 0 && React.createElement(StarterPack, {
                onAdd: addStarterHabits,
                onScratch: () => setShowAddHabit(true)
            }),

            // Weekly recap prompt (Sunday evening / Monday, once per week)
            habits.length > 0 && recapPrompt && !recapBannerHidden && computeWeekRecap(habits, sessions, recapPrompt.monday).hasActivity && React.createElement("div", { className: "nous-recap-banner" },
                React.createElement("span", { className: "nous-glyph", style: { width: '34px', height: '34px', borderRadius: '10px' } },
                    React.createElement(Icon, { name: "chart", size: 17 })),
                React.createElement("div", { className: "nous-recap-banner-text" },
                    React.createElement("div", { className: "nous-recap-banner-title" }, "your week in review is ready"),
                    React.createElement("div", { className: "nous-recap-banner-sub" }, "see your focus time, check-ins and streaks")
                ),
                React.createElement("button", { className: "nous-btn-primary", style: { padding: '8px 14px' }, onClick: () => openRecap(recapPrompt.monday) }, "view"),
                React.createElement("button", { className: "nous-icon-btn", onClick: dismissRecapPrompt, title: "Dismiss", "aria-label": "Dismiss" },
                    React.createElement(SysIcon, { name: "x", size: 16 }))
            ),

            // Week Nav
            habits.length > 0 && React.createElement("div", { className: "flex items-center justify-between mb-5 px-1" },
                React.createElement("button", { onClick: () => setWeekOffset(w => w - 1), className: "nous-icon-btn nous-icon-btn--strong", title: "Previous week" },
                    React.createElement(SysIcon, { name: "left", size: 18 })
                ),
                React.createElement("div", { className: "text-center flex items-center gap-3" },
                    React.createElement("span", { className: "text-sm font-medium text-gray-800 dark:text-white" }, monthYear),
                    weekOffset !== 0 && React.createElement("button", {
                        onClick: () => setWeekOffset(0), className: "nous-pill hover:opacity-80 lowercase"
                    }, "today"),
                    React.createElement("button", {
                        onClick: () => openRecap(new Date(weekDays[0].getFullYear(), weekDays[0].getMonth(), weekDays[0].getDate())),
                        className: "nous-pill hover:opacity-80 lowercase",
                        title: "Weekly recap"
                    }, React.createElement(Icon, { name: "chart", size: 12, strokeWidth: 2 }), "recap")
                ),
                React.createElement("button", { onClick: () => setWeekOffset(w => w + 1), className: "nous-icon-btn nous-icon-btn--strong", title: "Next week" },
                    React.createElement(SysIcon, { name: "right", size: 18 })
                )
            ),

            // Days Header - includes spacer for flame icon alignment
            habits.length > 0 && React.createElement("div", { style: { ...rowStyle, alignItems: 'flex-end', padding: isMobile ? '0 12px' : '0 16px' }, className: "mb-3" },
                // Spacer for flame icon (responsive)
                React.createElement("div", { style: { width: flameColWidth, flexShrink: 0 } }),
                React.createElement("div", { style: { ...habitColStyle, paddingLeft: isMobile ? 0 : '4px' }, className: "text-sm text-gray-500 dark:text-gray-400" }, "habit"),
                weekDays.map(d => {
                    const iso = toLocalDateString(d);
                    const isToday = iso === todayStr;
                    return React.createElement("div", { key: iso, style: dayStyle, className: `nous-day-head ${isToday ? 'is-today' : ''}` },
                        React.createElement("div", { className: "nous-day-letter" }, d.toLocaleDateString('en-US', { weekday: 'narrow' })),
                        React.createElement("div", { className: "nous-day-num" }, d.getDate())
                    );
                })
            ),

            // Habits
            habits.map(h => {
                const coinVal = h.difficulty === 'hard' ? 20 : h.difficulty === 'medium' ? 10 : 5;
                const streak = calcStreak(h.completionDates);
                const timer = timers[h.id];
                const isRunning = timer && timer.isRunning;
                const elapsed = getElapsedTime(h.id);
                const isExpanded = expandedHabit === h.id;

                return React.createElement("div", {
                    key: h.id,
                    ref: (el) => { if (el) habitRefsMap.current[h.id] = el; },
                    className: `mb-3 rounded-xl bg-white dark:bg-gray-800/50 border overflow-hidden transition-all ${touchDragHabit?.id === h.id ? 'border-blue-400 ring-2 ring-blue-200 scale-105 opacity-80' : touchDragTargetId === h.id ? 'border-green-400 ring-2 ring-green-200 bg-green-50 dark:bg-green-900/20' : 'border-gray-100 dark:border-gray-700'}`,
                    draggable: true,
                    onDragStart: (e) => handleDragStart(e, h),
                    onDragEnd: handleDragEnd,
                    onDragOver: (e) => handleDragOver(e, h),
                    onDrop: (e) => handleDrop(e, h),
                    onTouchStart: (e) => handleTouchStart(e, h),
                    onTouchMove: (e) => handleTouchMove(e, h),
                    onTouchEnd: (e) => handleTouchEnd(e, h),
                    style: {
                        cursor: touchDragHabit ? 'grabbing' : 'grab',
                        // Always prevent browser scroll on habit items - we handle it ourselves
                        touchAction: 'none'
                    }
                },
                    // Main habit row
                    React.createElement("div", { style: { ...rowStyle, padding: isMobile ? '12px' : '16px' } },
                        // Timer toggle button - changed to Focus button - shows correct icon based on timer mode or binary
                        React.createElement("button", {
                            onClick: () => {
                                setSelectedHabitId(h.id);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            },
                            className: `nous-icon-btn ${(selectedHabitId || habits[0]?.id) === h.id ? 'is-active' : ''}`,
                            style: isMobile ? { width: '24px', height: '24px' } : undefined,
                            title: h.tracking_type === 'binary' ? "Focus on 1-tap habit" : "Focus on this habit"
                        }, h.tracking_type === 'binary' ? React.createElement(SysIcon, { name: "check", size: 16 }) : (h.timerMode === 'timer' ? React.createElement(HourglassIcon, { size: 16 }) : React.createElement(StopwatchIcon, { size: 16 }))),
                        React.createElement("div", { style: { ...habitColStyle, paddingLeft: isMobile ? '2px' : '6px' }, className: "flex items-center gap-3" },
                            // Habit symbol tile (tints green once done today)
                            !isMobile && React.createElement("div", {
                                className: `nous-glyph ${(h.completionDates || []).includes(todayStr) ? 'is-done' : ''}`
                            }, React.createElement(Icon, { name: h.icon || 'study', size: 20 })),
                            React.createElement("div", { className: "flex-1 min-w-0", style: { overflow: 'hidden' } },
                                // Habit title with double click to edit
                                React.createElement("div", {
                                    className: `${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-900 dark:text-white lowercase leading-tight cursor-pointer select-none hover:opacity-80 transition-opacity truncate`,
                                    onClick: () => setSelectedHabitId(h.id),
                                    onDoubleClick: () => setEditingHabit({ ...h, difficulty: h.difficulty || 'medium', icon: h.icon || 'study', color: '#111827', daily_goal_mins: h.daily_goal_mins || 0 }),
                                    title: h.title || "Click to focus, double click to edit"
                                }, h.title || 'untitled'),
                                // Hide coins/streak on mobile to save space
                                !isMobile && React.createElement("div", { className: "flex items-center gap-2 text-xs text-gray-400 mt-1" },
                                    React.createElement("span", { title: "Coins per completion" }, `${coinVal}c`),
                                    streak > 0 && React.createElement("span", { className: "text-orange-500 inline-flex items-center gap-0.5 font-medium", title: `${streak} day streak` },
                                        React.createElement(Icon, { name: "fire", size: 12, color: "#f97316" }),
                                        streak
                                    ),
                                    h.tracking_type === 'binary' && React.createElement("span", {
                                        className: "nous-pill",
                                        title: "1-tap completion habit"
                                    }, "1-tap"),
                                    // Daily goal badge if set
                                    h.daily_goal_mins > 0 && (() => {
                                        const loggedMins = Math.floor(getTodayLoggedMs(h.id) / 60000);
                                        const isMet = loggedMins >= h.daily_goal_mins;
                                        return React.createElement("span", {
                                            className: `nous-pill ${isMet ? 'is-met' : ''}`,
                                            title: `Daily goal: ${loggedMins}/${h.daily_goal_mins}m logged today`
                                        }, isMet ? `goal ✓` : `${loggedMins}/${h.daily_goal_mins}m`);
                                    })(),
                                    (() => {
                                        const linkedM = milestones.find(m => m.id === h.milestone_id);
                                        return linkedM ? React.createElement("span", {
                                            title: `Linked to ${linkedM.name}`,
                                            className: "inline-flex items-center text-gray-500 dark:text-gray-400"
                                        }, React.createElement(Icon, { name: linkedM.emoji || 'target', size: 12 })) : null;
                                    })()
                                )
                            ),
                            !isMobile && React.createElement("button", {
                                onClick: () => setEditingHabit({ ...h, difficulty: h.difficulty || 'medium', icon: h.icon || 'study', color: '#111827', daily_goal_mins: h.daily_goal_mins || 0 }),
                                className: "nous-icon-btn",
                                title: "Edit habit"
                            }, React.createElement(SysIcon, { name: "edit", size: 16 }))
                        ),
                        weekDays.map(d => {
                            const iso = toLocalDateString(d);
                            const done = (h.completionDates || []).includes(iso);
                            const isToday = iso === todayStr;
                            return React.createElement("div", { key: iso, style: dayStyle, className: "flex items-center justify-center" },
                                React.createElement("button", {
                                    onClick: () => toggleDate(h.id, iso),
                                    className: `transition-all duration-200 rounded-full flex items-center justify-center ${done ? 'bg-green-500 shadow-sm transform scale-100' : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300'}`,
                                    style: { width: checkboxSize, height: checkboxSize },
                                }, done && React.createElement(SysIcon, { name: "check", size: isMobile ? 12 : 16 }))
                            );
                        })
                    ),
                    // Timer section (debug placeholder)
                    isExpanded && React.createElement("div", { className: "p-4 text-center bg-gray-50 border-t" }, "Timer Controls Placeholder")
                )
            }),


            // Add Habit Button - static inline at end of habits list
            !(habitsLoaded && habits.length === 0) && React.createElement("button", {
                onClick: () => setShowAddHabit(true),
                className: "add-habit-btn w-full mt-4 mb-6 py-3.5 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:text-gray-200 transition-all bg-white/50 dark:bg-gray-800/30 hover:bg-white dark:hover:bg-gray-700/60"
            },
                React.createElement(SysIcon, { name: "plus", size: 20 }),
                React.createElement("span", { className: "lowercase text-sm font-medium" }, "add habit")
            ),

            // Weekly recap modal
            recapMonday && React.createElement(WeekRecapModal, {
                recap: computeWeekRecap(habits, sessions, recapMonday),
                onClose: () => setRecapMonday(null)
            }),

            // Add Habit Modal (positioned within container)
            showAddHabit && React.createElement("div", {
                className: "fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm",
                style: { zIndex: 10000, padding: '20px' },
                onClick: () => setShowAddHabit(false)
            },
                React.createElement("form", {
                    onSubmit: addHabit,
                    onClick: e => e.stopPropagation(),
                    className: "bg-white dark:bg-gray-900 p-6 rounded-3xl w-full max-w-sm shadow-2xl overflow-y-auto border border-gray-200 dark:border-gray-700 soft-shadow-lg",
                    style: { maxHeight: 'calc(100% - 40px)' }
                },
                    React.createElement("div", { className: "flex justify-between items-center mb-6" },
                        React.createElement("h3", { className: "text-xl font-light text-gray-800 dark:text-white lowercase tracking-tight" }, "new habit"),
                        React.createElement("button", { type: "button", onClick: () => setShowAddHabit(false), className: "p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" },
                            React.createElement(SysIcon, { name: "x", size: 20 })
                        )
                    ),

                    React.createElement("div", { className: "space-y-8" },
                        // Name Input
                        React.createElement("div", null,
                            React.createElement("input", {
                                type: "text",
                                value: newHabit.title,
                                onChange: e => setNewHabit({ ...newHabit, title: e.target.value }),
                                placeholder: "e.g. morning jog...",
                                className: "w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white lowercase text-lg placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-400 dark:focus:border-blue-500 transition-all outline-none",
                                autoFocus: true
                            })
                        ),

                        // Daily Goal (Optional)
                        React.createElement("div", null,
                            React.createElement("div", { className: "flex justify-between items-center mb-2" },
                                React.createElement("label", { className: "block text-xs font-semibold text-gray-800 dark:text-white uppercase tracking-wider ml-1" }, "daily goal (optional)"),
                                React.createElement("span", { className: "text-xs text-blue-600 dark:text-blue-400 font-light" },
                                    newHabit.daily_goal_mins > 0
                                        ? (newHabit.daily_goal_mins >= 60
                                            ? `${Math.floor(newHabit.daily_goal_mins / 60)}h ${newHabit.daily_goal_mins % 60 ? (newHabit.daily_goal_mins % 60) + 'm' : ''} / day`
                                            : `${newHabit.daily_goal_mins}m / day`)
                                        : "no goal (optional)"
                                )
                            ),
                            React.createElement("div", {
                                className: "mb-2.5",
                                style: { display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: "8px" }
                            },
                                [
                                    { mins: 0, label: "none" },
                                    { mins: 15, label: "15m" },
                                    { mins: 30, label: "30m" },
                                    { mins: 45, label: "45m" },
                                    { mins: 60, label: "1h" },
                                    { mins: 120, label: "2h" }
                                ].map(p => {
                                    const isSel = (newHabit.daily_goal_mins || 0) === p.mins;
                                    return React.createElement("button", {
                                        key: p.mins,
                                        type: "button",
                                        onClick: () => setNewHabit({ ...newHabit, daily_goal_mins: p.mins }),
                                        className: `py-2 px-1 text-xs rounded-xl border lowercase transition-all font-medium ${
                                            isSel
                                                ? "nous-chip-selected"
                                                : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750"
                                        }`
                                    }, p.label);
                                })
                            ),
                            React.createElement("div", { className: "flex items-center gap-2" },
                                React.createElement("span", { className: "text-xs text-gray-400 font-light lowercase" }, "or custom:"),
                                React.createElement("input", {
                                    type: "number",
                                    min: "0",
                                    max: "1440",
                                    placeholder: "mins (e.g. 90)",
                                    value: newHabit.daily_goal_mins > 0 ? newHabit.daily_goal_mins : "",
                                    onChange: e => {
                                        const v = parseInt(e.target.value, 10);
                                        setNewHabit({ ...newHabit, daily_goal_mins: isNaN(v) || v < 0 ? 0 : v });
                                    },
                                    className: "w-28 px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white outline-none focus:border-blue-400"
                                }),
                                React.createElement("span", { className: "text-xs text-gray-400 font-light lowercase" }, "mins / day")
                            )
                        ),

                        // Icon Picker (Curated crisp symbols)
                        React.createElement("div", null,
                            React.createElement("label", { className: "flex items-center justify-between text-xs font-semibold text-gray-800 dark:text-white mb-3 uppercase tracking-wider ml-1" },
                                "symbol",
                                React.createElement("span", { className: "nous-symbol-label" }, (NOUS_SYMBOLS[resolveIconKey(newHabit.icon)] || {}).label || "")
                            ),
                            React.createElement("div", {
                                style: { display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: "8px" }
                            },
                                CURATED_HABIT_ICONS.map(k => React.createElement("button", {
                                    key: k, type: "button",
                                    onClick: () => setNewHabit({ ...newHabit, icon: k }),
                                    className: `nous-symbol-opt ${resolveIconKey(newHabit.icon) === k ? 'is-selected' : ''}`,
                                    title: NOUS_SYMBOLS[k].label,
                                    "aria-label": NOUS_SYMBOLS[k].label
                                }, React.createElement(Icon, { name: k, size: 22 })))
                            )
                        ),

                        // Difficulty Picker
                        React.createElement("div", null,
                            React.createElement("label", { className: "block text-xs font-semibold text-gray-800 dark:text-white mb-3 uppercase tracking-wider ml-1" }, "difficulty"),
                            React.createElement("div", { className: "grid grid-cols-3 gap-4" },
                                ['easy', 'medium', 'hard'].map(d => {
                                    const coins = d === 'hard' ? 20 : d === 'medium' ? 10 : 5;
                                    const isSelected = newHabit.difficulty === d;
                                    const bgColor = isSelected
                                        ? (d === 'easy' ? 'bg-green-100 text-green-700 border-green-200' : d === 'hard' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200')
                                        : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-750';

                                    return React.createElement("button", {
                                        key: d, type: "button",
                                        onClick: () => setNewHabit({ ...newHabit, difficulty: d }),
                                        className: `py-4 px-2 rounded-xl border lowercase transition-all text-sm font-medium flex flex-col items-center gap-1 ${bgColor} ${isSelected ? 'shadow-sm ring-1 ring-inset ring-black/5 dark:ring-white/10' : ''}`
                                    },
                                        React.createElement("span", null, d),
                                        React.createElement("span", { className: "text-[10px] opacity-70" }, `+${coins} coins`)
                                    );
                                })
                            )
                        ),

                        // Tracking Type Selector
                        React.createElement("div", null,
                            React.createElement("label", { className: "block text-xs font-semibold text-gray-800 dark:text-white mb-3 uppercase tracking-wider ml-1" }, "tracking type"),
                            React.createElement("div", { className: "grid grid-cols-2 gap-3" },
                                [
                                    { id: 'timed', label: '⏱️ timed focus', desc: 'track session timer' },
                                    { id: 'binary', label: '✓ 1-tap check', desc: 'simple daily check-in' }
                                ].map(t => {
                                    const isSelected = (newHabit.tracking_type || 'timed') === t.id;
                                    return React.createElement("button", {
                                        key: t.id,
                                        type: "button",
                                        onClick: () => setNewHabit({ ...newHabit, tracking_type: t.id }),
                                        className: `py-3 px-3 rounded-xl border lowercase transition-all text-sm font-medium flex flex-col items-center gap-0.5 ${isSelected ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-700 shadow-sm' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-750'}`
                                    },
                                        React.createElement("span", null, t.label),
                                        React.createElement("span", { className: "text-[10px] opacity-70 font-light" }, t.desc)
                                    );
                                })
                            )
                        ),

                        // Link to Milestone
                        milestones && milestones.length > 0 && React.createElement("div", null,
                            React.createElement("label", { className: "block text-xs font-semibold text-gray-800 dark:text-white mb-2 uppercase tracking-wider ml-1" }, "link to milestone"),
                            React.createElement("select", {
                                value: newHabit.milestone_id || '',
                                onChange: e => setNewHabit({ ...newHabit, milestone_id: e.target.value || null }),
                                className: "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 font-light"
                            },
                                React.createElement("option", { value: "" }, "none (unlinked)"),
                                milestones.map(m => React.createElement("option", { key: m.id, value: m.id }, m.name))
                            )
                        ),

                        // Submit Button
                        React.createElement("button", {
                            type: "submit",
                            className: "nous-btn-primary nous-btn-lg w-full lowercase mt-6"
                        }, "create habit")
                    )
                )
            ),

            // Edit Habit Modal - use fixed positioning for full viewport access
            editingHabit && React.createElement("div", {
                className: "fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm",
                style: { zIndex: 10000, padding: '16px' },
                onClick: () => setEditingHabit(null)
            },
                React.createElement("form", {
                    onSubmit: saveHabit,
                    onClick: e => e.stopPropagation(),
                    className: "bg-white dark:bg-gray-900 p-6 rounded-3xl w-full max-w-md shadow-2xl overflow-y-auto border border-gray-200 dark:border-gray-700 soft-shadow-lg",
                    style: { maxHeight: 'calc(100vh - 32px)' }
                },
                    React.createElement("div", { className: "flex justify-between items-center mb-6" },
                        React.createElement("h3", { className: "text-2xl font-light text-gray-800 dark:text-white lowercase tracking-tight" }, "edit habit"),
                        React.createElement("button", { type: "button", onClick: () => setEditingHabit(null), className: "p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" },
                            React.createElement(SysIcon, { name: "x", size: 22 })
                        )
                    ),

                    React.createElement("div", { className: "space-y-8" },
                        // Name Input
                        React.createElement("div", null,
                            React.createElement("input", {
                                type: "text",
                                value: editingHabit.title,
                                onChange: e => setEditingHabit({ ...editingHabit, title: e.target.value }),
                                className: "w-full px-5 py-4 rounded-xl mb-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white lowercase text-lg placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-400 dark:focus:border-blue-500 transition-all outline-none",
                                autoFocus: true
                            })
                        ),

                        // Daily Goal (Optional)
                        React.createElement("div", null,
                            React.createElement("div", { className: "flex justify-between items-center mb-2" },
                                React.createElement("label", { className: "block text-xs font-semibold text-gray-800 dark:text-white uppercase tracking-wider ml-1" }, "daily goal (optional)"),
                                React.createElement("span", { className: "text-xs text-blue-600 dark:text-blue-400 font-light" },
                                    editingHabit.daily_goal_mins > 0
                                        ? (editingHabit.daily_goal_mins >= 60
                                            ? `${Math.floor(editingHabit.daily_goal_mins / 60)}h ${editingHabit.daily_goal_mins % 60 ? (editingHabit.daily_goal_mins % 60) + 'm' : ''} / day`
                                            : `${editingHabit.daily_goal_mins}m / day`)
                                        : "no goal (optional)"
                                )
                            ),
                            React.createElement("div", {
                                className: "mb-2.5",
                                style: { display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: "8px" }
                            },
                                [
                                    { mins: 0, label: "none" },
                                    { mins: 15, label: "15m" },
                                    { mins: 30, label: "30m" },
                                    { mins: 45, label: "45m" },
                                    { mins: 60, label: "1h" },
                                    { mins: 120, label: "2h" }
                                ].map(p => {
                                    const isSel = (editingHabit.daily_goal_mins || 0) === p.mins;
                                    return React.createElement("button", {
                                        key: p.mins,
                                        type: "button",
                                        onClick: () => setEditingHabit({ ...editingHabit, daily_goal_mins: p.mins }),
                                        className: `py-2 px-1 text-xs rounded-xl border lowercase transition-all font-medium ${
                                            isSel
                                                ? "nous-chip-selected"
                                                : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750"
                                        }`
                                    }, p.label);
                                })
                            ),
                            React.createElement("div", { className: "flex items-center gap-2" },
                                React.createElement("span", { className: "text-xs text-gray-400 font-light lowercase" }, "or custom:"),
                                React.createElement("input", {
                                    type: "number",
                                    min: "0",
                                    max: "1440",
                                    placeholder: "mins (e.g. 90)",
                                    value: editingHabit.daily_goal_mins > 0 ? editingHabit.daily_goal_mins : "",
                                    onChange: e => {
                                        const v = parseInt(e.target.value, 10);
                                        setEditingHabit({ ...editingHabit, daily_goal_mins: isNaN(v) || v < 0 ? 0 : v });
                                    },
                                    className: "w-28 px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white outline-none focus:border-blue-400"
                                }),
                                React.createElement("span", { className: "text-xs text-gray-400 font-light lowercase" }, "mins / day")
                            )
                        ),

                        // Icon Picker (Curated crisp symbols)
                        React.createElement("div", null,
                            React.createElement("label", { className: "flex items-center justify-between text-xs font-semibold text-gray-800 dark:text-white mb-3 uppercase tracking-wider ml-1" },
                                "symbol",
                                React.createElement("span", { className: "nous-symbol-label" }, (NOUS_SYMBOLS[resolveIconKey(editingHabit.icon)] || {}).label || "")
                            ),
                            React.createElement("div", {
                                style: { display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: "8px" }
                            },
                                CURATED_HABIT_ICONS.map(k => React.createElement("button", {
                                    key: k, type: "button",
                                    onClick: () => setEditingHabit({ ...editingHabit, icon: k }),
                                    className: `nous-symbol-opt ${resolveIconKey(editingHabit.icon) === k ? 'is-selected' : ''}`,
                                    title: NOUS_SYMBOLS[k].label,
                                    "aria-label": NOUS_SYMBOLS[k].label
                                }, React.createElement(Icon, { name: k, size: 22 })))
                            )
                        ),

                        // Difficulty Picker
                        React.createElement("div", null,
                            React.createElement("label", { className: "block text-xs font-semibold text-gray-800 dark:text-white mb-3 uppercase tracking-wider ml-1" }, "difficulty"),
                            React.createElement("div", { className: "grid grid-cols-3 gap-4" },
                                ['easy', 'medium', 'hard'].map(d => {
                                    const coins = d === 'hard' ? 20 : d === 'medium' ? 10 : 5;
                                    const isSelected = editingHabit.difficulty === d;
                                    const bgColor = isSelected
                                        ? (d === 'easy' ? 'bg-green-100 text-green-700 border-green-200' : d === 'hard' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200')
                                        : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-750';

                                    return React.createElement("button", {
                                        key: d, type: "button",
                                        onClick: () => setEditingHabit({ ...editingHabit, difficulty: d }),
                                        className: `py-4 px-2 rounded-xl border lowercase transition-all text-sm font-medium flex flex-col items-center gap-1 ${bgColor} ${isSelected ? 'shadow-sm ring-1 ring-inset ring-black/5 dark:ring-white/10' : ''}`
                                    },
                                        React.createElement("span", null, d),
                                        React.createElement("span", { className: "text-[10px] opacity-70" }, `+${coins} coins`)
                                    );
                                })
                            )
                        ),

                        // Tracking Type Selector
                        React.createElement("div", null,
                            React.createElement("label", { className: "block text-xs font-semibold text-gray-800 dark:text-white mb-3 uppercase tracking-wider ml-1" }, "tracking type"),
                            React.createElement("div", { className: "grid grid-cols-2 gap-3" },
                                [
                                    { id: 'timed', label: '⏱️ timed focus', desc: 'track session timer' },
                                    { id: 'binary', label: '✓ 1-tap check', desc: 'simple daily check-in' }
                                ].map(t => {
                                    const isSelected = (editingHabit.tracking_type || 'timed') === t.id;
                                    return React.createElement("button", {
                                        key: t.id,
                                        type: "button",
                                        onClick: () => setEditingHabit({ ...editingHabit, tracking_type: t.id }),
                                        className: `py-3 px-3 rounded-xl border lowercase transition-all text-sm font-medium flex flex-col items-center gap-0.5 ${isSelected ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-700 shadow-sm' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-750'}`
                                    },
                                        React.createElement("span", null, t.label),
                                        React.createElement("span", { className: "text-[10px] opacity-70 font-light" }, t.desc)
                                    );
                                })
                            )
                        ),

                        // Link to Milestone
                        milestones && milestones.length > 0 && React.createElement("div", null,
                            React.createElement("label", { className: "block text-xs font-semibold text-gray-800 dark:text-white mb-2 uppercase tracking-wider ml-1" }, "link to milestone"),
                            React.createElement("select", {
                                value: editingHabit.milestone_id || '',
                                onChange: e => setEditingHabit({ ...editingHabit, milestone_id: e.target.value || null }),
                                className: "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 font-light"
                            },
                                React.createElement("option", { value: "" }, "none (unlinked)"),
                                milestones.map(m => React.createElement("option", { key: m.id, value: m.id }, m.name))
                            )
                        ),

                        // Actions
                        React.createElement("div", { className: "flex gap-3 pt-6 mt-4 border-t border-gray-100 dark:border-gray-800" },
                            React.createElement("button", {
                                type: "button",
                                onClick: () => { deleteHabit(editingHabit.id); setEditingHabit(null); },
                                className: "flex-1 py-4 text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/20 rounded-2xl lowercase text-base font-medium transition-colors"
                            }, "delete habit"),
                            React.createElement("button", {
                                type: "submit",
                                className: "nous-btn-primary nous-btn-lg flex-[2] lowercase"
                            }, "save changes")
                        )
                    )
                )
            ),

            // Manual Session Modal
            showManualSession && React.createElement("div", {
                className: "absolute inset-0 flex items-start justify-center bg-black/30 backdrop-blur-sm rounded-2xl",
                style: { zIndex: 100, padding: '20px', paddingTop: '200px' },
                onClick: () => setShowManualSession(null)
            },
                React.createElement("div", {
                    onClick: e => e.stopPropagation(),
                    className: "bg-white dark:bg-gray-900 p-5 rounded-2xl w-full max-w-xs shadow-2xl border border-gray-200 dark:border-gray-700"
                },
                    React.createElement("div", { className: "flex justify-between items-center mb-4" },
                        React.createElement("h3", { className: "text-lg font-light text-gray-800 dark:text-white lowercase" }, "forgot to time? add in time spent (optional)"),
                        React.createElement("button", {
                            type: "button",
                            onClick: () => setShowManualSession(null),
                            className: "p-1 text-gray-400 hover:text-gray-600"
                        },
                            React.createElement(SysIcon, { name: "x", size: 18 })
                        )
                    ),
                    React.createElement("p", { className: "text-sm text-gray-500 mb-4 lowercase" },
                        `for: ${habits.find(h => h.id === showManualSession)?.title || 'habit'} • ${manualSessionDate ? (() => { const [y,m,d] = manualSessionDate.split('-').map(Number); const dt = new Date(y, m-1, d); return dt.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' }).toLowerCase(); })() : 'today'}`
                    ),
                    React.createElement("div", { className: "flex items-center gap-3 mb-4" },
                        React.createElement("div", { className: "flex-1" },
                            React.createElement("label", { className: "block text-xs text-gray-500 mb-1 lowercase" }, "hours"),
                            React.createElement("input", {
                                type: "number",
                                min: "0",
                                max: "24",
                                value: manualHours,
                                onChange: e => setManualHours(e.target.value),
                                className: "w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-center text-lg"
                            })
                        ),
                        React.createElement("span", { className: "text-2xl text-gray-400 mt-5" }, ":"),
                        React.createElement("div", { className: "flex-1" },
                            React.createElement("label", { className: "block text-xs text-gray-500 mb-1 lowercase" }, "minutes"),
                            React.createElement("input", {
                                type: "number",
                                min: "0",
                                max: "59",
                                value: manualMinutes,
                                onChange: e => setManualMinutes(e.target.value),
                                className: "w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-center text-lg"
                            })
                        )
                    ),
                    React.createElement("div", { className: "flex gap-2" },
                        React.createElement("button", {
                            type: "button",
                            onClick: () => setShowManualSession(null),
                            className: "flex-1 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg lowercase text-sm"
                        }, "cancel"),
                        React.createElement("button", {
                            type: "button",
                            onClick: () => saveManualSession(showManualSession),
                            className: "flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg lowercase text-sm"
                        }, "save session")
                    )
                )
            ),

            // Duration Picker Modal for Countdown Timer
            showDurationPicker && React.createElement("div", {
                className: "fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm",
                style: { zIndex: 10000, padding: '16px' },
                onClick: () => setShowDurationPicker(null)
            },
                React.createElement("div", {
                    onClick: e => e.stopPropagation(),
                    className: "bg-white dark:bg-gray-900 p-5 rounded-2xl w-full max-w-sm shadow-2xl border border-gray-200 dark:border-gray-700"
                },
                    React.createElement("div", { className: "flex justify-between items-center mb-4" },
                        React.createElement("h3", { className: "text-lg font-light text-gray-800 dark:text-white lowercase" }, "set countdown timer"),
                        React.createElement("button", {
                            type: "button",
                            onClick: () => setShowDurationPicker(null),
                            className: "p-1 text-gray-400 hover:text-gray-600"
                        },
                            React.createElement(SysIcon, { name: "x", size: 18 })
                        )
                    ),
                    React.createElement("p", { className: "text-sm text-gray-500 mb-4 lowercase" },
                        `for: ${habits.find(h => h.id === showDurationPicker)?.title || 'habit'}`
                    ),
                    // Time input: HH:MM:SS
                    React.createElement("div", { className: "flex items-center justify-center gap-2 mb-4" },
                        React.createElement("div", { className: "flex-1" },
                            React.createElement("label", { className: "block text-xs text-gray-500 mb-1 lowercase text-center" }, "hours"),
                            React.createElement("input", {
                                type: "number",
                                min: "0",
                                max: "23",
                                value: countdownHours,
                                onChange: e => setCountdownHours(e.target.value),
                                className: "w-full px-2 py-3 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-center text-2xl font-mono"
                            })
                        ),
                        React.createElement("span", { className: "text-3xl text-gray-400 mt-5 font-mono" }, ":"),
                        React.createElement("div", { className: "flex-1" },
                            React.createElement("label", { className: "block text-xs text-gray-500 mb-1 lowercase text-center" }, "minutes"),
                            React.createElement("input", {
                                type: "number",
                                min: "0",
                                max: "59",
                                value: countdownMinutes,
                                onChange: e => setCountdownMinutes(e.target.value),
                                className: "w-full px-2 py-3 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-center text-2xl font-mono"
                            })
                        ),
                        React.createElement("span", { className: "text-3xl text-gray-400 mt-5 font-mono" }, ":"),
                        React.createElement("div", { className: "flex-1" },
                            React.createElement("label", { className: "block text-xs text-gray-500 mb-1 lowercase text-center" }, "seconds"),
                            React.createElement("input", {
                                type: "number",
                                min: "0",
                                max: "59",
                                value: countdownSeconds,
                                onChange: e => setCountdownSeconds(e.target.value),
                                className: "w-full px-2 py-3 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-center text-2xl font-mono"
                            })
                        )
                    ),
                    // Quick preset buttons
                    React.createElement("div", { className: "flex gap-2 mb-4" },
                        [5, 15, 25, 45].map(mins =>
                            React.createElement("button", {
                                key: mins,
                                type: "button",
                                onClick: () => { setCountdownHours('0'); setCountdownMinutes(String(mins)); setCountdownSeconds('0'); },
                                className: "flex-1 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg lowercase text-sm"
                            }, `${mins}m`)
                        )
                    ),
                    React.createElement("div", { className: "flex gap-2" },
                        React.createElement("button", {
                            type: "button",
                            onClick: () => setShowDurationPicker(null),
                            className: "flex-1 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg lowercase text-sm"
                        }, "cancel"),
                        React.createElement("button", {
                            type: "button",
                            onClick: () => saveDuration(showDurationPicker),
                            className: "flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg lowercase text-sm"
                        }, "start countdown")
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

        const deleteClaimedReward = async (id) => {
            if (confirm('Delete this claimed reward from history?')) {
                await window.deleteDoc(window.doc(db, `/artifacts/${appId}/users/${userId}/claimedRewards/${id}`));
                showNotif("claim history deleted");
            }
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
                        React.createElement("span", { className: "text-xs text-gray-400 mr-2" }, formatDate(claim.claimedAt)),
                        React.createElement("button", {
                            onClick: () => deleteClaimedReward(claim.id),
                            className: "text-gray-400 hover:text-red-500 transition p-1",
                            title: "Remove from history"
                        }, React.createElement(SysIcon, { name: "x", size: 14 }))
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
    console.log("HabitsTab v59 loaded");
})();


