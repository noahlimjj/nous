        const { useState, useEffect, useRef, useCallback } = React;

        // --- Configuration Validation ---
        // Check if Firebase is available or if running in offline mode
        const isFirebaseAvailable = () => {
            // Explicitly unavailable (set by generate-config.sh when env vars missing)
            if (window.__firebase_unavailable === true) {
                console.warn("⚠️  Firebase is not configured. Running in offline mode.");
                return false;
            }

            // Missing or invalid config
            if (typeof window.__firebase_config === 'undefined' ||
                !window.__firebase_config ||
                !window.__firebase_config.apiKey) {
                console.error("Firebase configuration is missing. The config.js file may not have been generated properly.");
                return false;
            }

            // Check for placeholder values that weren't replaced
            const apiKey = window.__firebase_config.apiKey;
            if (apiKey.includes('{{') || apiKey.includes('REPLACE_') || apiKey === 'YOUR_') {
                console.error("Firebase configuration contains placeholder values. Running in offline mode.");
                window.__firebase_unavailable = true;
                return false;
            }

            return true;
        };

        window.__isFirebaseAvailable = isFirebaseAvailable();

        // --- Helper Functions & Icons ---

        // Icon components (using inline SVG for single-file simplicity)
        const PlayIcon = () => React.createElement('svg', {
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
        }, React.createElement('polygon', { points: "5 3 19 12 5 21 5 3" }));

        const PauseIcon = () => React.createElement('svg', {
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
        }, React.createElement('rect', { x: "6", y: "4", width: "4", height: "16" }), React.createElement('rect', { x: "14", y: "4", width: "4", height: "16" }));

        const StopIcon = () => React.createElement('svg', {
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
        }, React.createElement('rect', { x: "3", y: "3", width: "18", height: "18", rx: "2", ry: "2" }));

        const PlusCircleIcon = () => React.createElement('svg', {
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
        }, React.createElement('circle', { cx: "12", cy: "12", r: "10" }), React.createElement('line', { x1: "12", y1: "8", x2: "12", y2: "16" }), React.createElement('line', { x1: "8", y1: "12", x2: "16", y2: "12" }));

        const TrashIcon = () => React.createElement('svg', {
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
        }, React.createElement('polyline', { points: "3 6 5 6 21 6" }), React.createElement('path', { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }), React.createElement('line', { x1: "10", y1: "11", x2: "10", y2: "17" }), React.createElement('line', { x1: "14", y1: "11", x2: "14", y2: "17" }));

        const ResetIcon = () => React.createElement('svg', {
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
        }, React.createElement('path', { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" }), React.createElement('path', { d: "M21 3v5h-5" }), React.createElement('path', { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" }), React.createElement('path', { d: "M3 21v-5h5" }));

        const ChartIcon = () => React.createElement('svg', {
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
        },
            React.createElement('path', { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
            React.createElement('path', { d: "M14 2v6h6" }),
            React.createElement('path', { d: "M8 13h2" }),
            React.createElement('path', { d: "M8 17h6" }),
            React.createElement('circle', { cx: "15", cy: "12", r: "2", strokeWidth: "1.5" }),
            React.createElement('path', { d: "M15 10v4m-2-2h4", strokeWidth: "1.5" })
        );

        const HomeIcon = () => React.createElement('svg', {
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
        }, React.createElement('path', { d: "m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" }), React.createElement('polyline', { points: "9 22 9 12 15 12 15 22" }));

        const LogOutIcon = () => React.createElement('svg', {
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
        }, React.createElement('path', { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }), React.createElement('polyline', { points: "16 17 21 12 16 7" }), React.createElement('line', { x1: "21", y1: "12", x2: "9", y2: "12" }));

        const LoaderIcon = () => React.createElement('svg', {
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            className: "animate-spin"
        }, React.createElement('line', { x1: "12", y1: "2", x2: "12", y2: "6" }), React.createElement('line', { x1: "12", y1: "18", x2: "12", y2: "22" }), React.createElement('line', { x1: "4.93", y1: "4.93", x2: "7.76", y2: "7.76" }), React.createElement('line', { x1: "16.24", y1: "16.24", x2: "19.07", y2: "19.07" }), React.createElement('line', { x1: "2", y1: "12", x2: "6", y2: "12" }), React.createElement('line', { x1: "18", y1: "12", x2: "22", y2: "12" }), React.createElement('line', { x1: "4.93", y1: "19.07", x2: "7.76", y2: "16.24" }), React.createElement('line', { x1: "16.24", y1: "7.76", x2: "19.07", y2: "4.93" }));

        const GoogleIcon = () => React.createElement('svg', {
            xmlns: "http://www.w3.org/2000/svg",
            width: "20",
            height: "20",
            viewBox: "0 0 48 48"
        },
            React.createElement('path', { fill: "#FFC107", d: "M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" }),
            React.createElement('path', { fill: "#FF3D00", d: "M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" }),
            React.createElement('path', { fill: "#4CAF50", d: "M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" }),
            React.createElement('path', { fill: "#1976D2", d: "M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" })
        );

        const SettingsIcon = () => React.createElement('svg', {
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
        },
            React.createElement('path', { d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" }),
            React.createElement('circle', { cx: "12", cy: "12", r: "3" })
        );

        const PenIcon = () => React.createElement('svg', {
            xmlns: "http://www.w3.org/2000/svg",
            width: "20",
            height: "20",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
        },
            React.createElement('path', { d: "M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" })
        );

        const EraserIcon = () => React.createElement('svg', {
            xmlns: "http://www.w3.org/2000/svg",
            width: "20",
            height: "20",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
        },
            React.createElement('path', { d: "m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" }),
            React.createElement('path', { d: "M22 21H7" }),
            React.createElement('path', { d: "m5 11 9 9" })
        );

        const TextIcon = () => React.createElement('svg', {
            xmlns: "http://www.w3.org/2000/svg",
            width: "20",
            height: "20",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
        },
            React.createElement('polyline', { points: "4 7 4 4 20 4 20 7" }),
            React.createElement('line', { x1: "9", y1: "20", x2: "15", y2: "20" }),
            React.createElement('line', { x1: "12", y1: "4", x2: "12", y2: "20" })
        );

        const NotebookIcon = () => React.createElement('svg', {
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
        }, React.createElement('path', { d: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20" }), React.createElement('path', { d: "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" }));

        const UsersIcon = () => React.createElement('svg', {
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
        }, React.createElement('path', { d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }), React.createElement('circle', { cx: "9", cy: "7", r: "4" }), React.createElement('path', { d: "M23 21v-2a4 4 0 0 0-3-3.87" }), React.createElement('path', { d: "M16 3.13a4 4 0 0 1 0 7.75" }));

        const TrophyIcon = () => React.createElement('svg', {
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
        }, React.createElement('path', { d: "M6 9H4.5a2.5 2.5 0 0 1 0-5H6" }), React.createElement('path', { d: "M18 9h1.5a2.5 2.5 0 0 0 0-5H18" }), React.createElement('path', { d: "M4 22h16" }), React.createElement('path', { d: "M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" }), React.createElement('path', { d: "M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" }), React.createElement('path', { d: "M18 2H6v7a6 6 0 0 0 12 0V2Z" }));

        const SearchIcon = () => React.createElement('svg', {
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
        }, React.createElement('circle', { cx: "11", cy: "11", r: "8" }), React.createElement('path', { d: "m21 21-4.35-4.35" }));

        const CheckIcon = () => React.createElement('svg', {
            xmlns: "http://www.w3.org/2000/svg",
            width: "20",
            height: "20",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
        }, React.createElement('polyline', { points: "20 6 9 17 4 12" }));

        const XIcon = () => React.createElement('svg', {
            xmlns: "http://www.w3.org/2000/svg",
            width: "20",
            height: "20",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
        }, React.createElement('line', { x1: "18", y1: "6", x2: "6", y2: "18" }), React.createElement('line', { x1: "6", y1: "6", x2: "18", y2: "18" }));

        const InfoIcon = () => React.createElement('svg', {
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
        }, React.createElement('circle', { cx: "12", cy: "12", r: "10" }), React.createElement('line', { x1: "12", y1: "16", x2: "12", y2: "12" }), React.createElement('line', { x1: "12", y1: "8", x2: "12.01", y2: "8" }));

        const MoonIcon = () => React.createElement('svg', {
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
        }, React.createElement('path', { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" }));

        const SunIcon = () => React.createElement('svg', {
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
        },
            React.createElement('circle', { cx: "12", cy: "12", r: "5" }),
            React.createElement('line', { x1: "12", y1: "1", x2: "12", y2: "3" }),
            React.createElement('line', { x1: "12", y1: "21", x2: "12", y2: "23" }),
            React.createElement('line', { x1: "4.22", y1: "4.22", x2: "5.64", y2: "5.64" }),
            React.createElement('line', { x1: "18.36", y1: "18.36", x2: "19.78", y2: "19.78" }),
            React.createElement('line', { x1: "1", y1: "12", x2: "3", y2: "12" }),
            React.createElement('line', { x1: "21", y1: "12", x2: "23", y2: "12" }),
            React.createElement('line', { x1: "4.22", y1: "19.78", x2: "5.64", y2: "18.36" }),
            React.createElement('line', { x1: "18.36", y1: "5.64", x2: "19.78", y2: "4.22" })
        );

        const PencilIcon = () => React.createElement('svg', {
            xmlns: "http://www.w3.org/2000/svg",
            width: "20",
            height: "20",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
        }, React.createElement('path', { d: "M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" }));

        const ArrowUpIcon = () => React.createElement('svg', {
            xmlns: "http://www.w3.org/2000/svg",
            width: "20",
            height: "20",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
        }, React.createElement('line', { x1: "12", y1: "19", x2: "12", y2: "5" }), React.createElement('polyline', { points: "5 12 12 5 19 12" }));

        const ArrowDownIcon = () => React.createElement('svg', {
            xmlns: "http://www.w3.org/2000/svg",
            width: "20",
            height: "20",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
        }, React.createElement('line', { x1: "12", y1: "5", x2: "12", y2: "19" }), React.createElement('polyline', { points: "19 12 12 19 5 12" }));

        const GripIcon = () => React.createElement('svg', {
            xmlns: "http://www.w3.org/2000/svg",
            width: "20",
            height: "20",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
        },
            React.createElement('circle', { cx: "9", cy: "5", r: "1" }),
            React.createElement('circle', { cx: "9", cy: "12", r: "1" }),
            React.createElement('circle', { cx: "9", cy: "19", r: "1" }),
            React.createElement('circle', { cx: "15", cy: "5", r: "1" }),
            React.createElement('circle', { cx: "15", cy: "12", r: "1" }),
            React.createElement('circle', { cx: "15", cy: "19", r: "1" })
        );

        // Logo component with circular flow around 'n'
        const NousLogo = ({ size = "medium" }) => {
            const sizes = {
                small: { width: 70, fontSize: "1.5rem" },
                medium: { width: 100, fontSize: "2.25rem" },
                large: { width: 140, fontSize: "3rem" }
            };
            const { width, fontSize } = sizes[size];

            return React.createElement('div', {
                className: "flex items-center gap-2",
                style: { position: 'relative' }
            },
                // SVG circular flow
                React.createElement('svg', {
                    width: width,
                    height: width * 0.5,
                    viewBox: "0 0 100 50",
                    style: { position: 'absolute', left: -8, top: '50%', transform: 'translateY(-50%)', zIndex: 0, opacity: 0.6 }
                },
                    React.createElement('circle', {
                        cx: "20",
                        cy: "25",
                        r: "18",
                        fill: "none",
                        stroke: "#6B8DD6",
                        strokeWidth: "1.5",
                        className: "circle-flow",
                        opacity: "0.4"
                    })
                ),
                // Text
                React.createElement('span', {
                    className: "nous-title",
                    style: {
                        fontSize,
                        color: '#5d6b86',
                        position: 'relative',
                        zIndex: 1
                    }
                }, "nous")
            );
        };

        // Function to format time like Google Timer with milliseconds
        const formatTime = (totalMilliseconds) => {
            const totalSeconds = Math.floor(totalMilliseconds / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            const milliseconds = Math.floor((totalMilliseconds % 1000) / 10);
            
            if (hours > 0) {
                return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
            }
            return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
        };

        // Function to format time for display (without milliseconds)
        const formatTimeDisplay = (totalMilliseconds) => {
            const totalSeconds = Math.floor(totalMilliseconds / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            
            if (hours > 0) {
                return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            }
            return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        };

        // Function to get milliseconds for display
        const getMilliseconds = (totalMilliseconds) => {
            return Math.floor((totalMilliseconds % 1000) / 10);
        };

        // Function to format Firestore Timestamp to a readable date
        const formatDate = (timestamp) => {
            if (!timestamp) return 'N/A';
            return timestamp.toDate().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        };

        // Generate unique friend code
        const generateFriendCode = () => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let code = '';
            for (let i = 0; i < 8; i++) {
                code += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return code;
        };

        // Generate unique friend code with collision check
        const generateUniqueFriendCode = async (db) => {
            let attempts = 0;
            const maxAttempts = 10;

            while (attempts < maxAttempts) {
                const code = generateFriendCode();

                // Check if this code already exists
                try {
                    const usersQuery = window.query(
                        window.collection(db, 'users'),
                        window.where('friendCode', '==', code)
                    );
                    const snapshot = await window.getDocs(usersQuery);

                    if (snapshot.empty) {
                        // Code is unique!
                        return code;
                    }
                    attempts++;
                } catch (error) {
                    console.error("Error checking friend code uniqueness:", error);
                    // If query fails, just return the code
                    return code;
                }
            }

            // If we somehow can't find a unique code after 10 attempts,
            // add a timestamp to make it unique
            return generateFriendCode() + Date.now().toString(36).slice(-2);
        };

        // Tree types with unlock requirements (total hours studied)
        const TREE_TYPES = [
            { id: 'oak', name: 'Oak', requiredHours: 0, color: '#4a7c2c', leafShapes: ['oval', 'circle'], leafColors: ['#3E7C17', '#5DAE49', '#A1C349', '#4a7c2c', '#6d9f4f'], branchColor: '#5A3E1B' },
            { id: 'maple', name: 'Maple', requiredHours: 5, color: '#d94f04', leafShapes: ['star', 'diamond'], leafColors: ['#FF4C29', '#FFB84C', '#D94F04', '#c2410c', '#f97316'], branchColor: '#6B2B06' },
            { id: 'cherry', name: 'Cherry Blossom', requiredHours: 15, color: '#f9a8d4', leafShapes: ['circle', 'circle'], leafColors: ['#F8C8DC', '#FADADD', '#FFD6E8', '#fbcfe8', '#fce7f3'], branchColor: '#8B5E3C' },
            { id: 'willow', name: 'Willow', requiredHours: 30, color: '#94a3b8', leafShapes: ['oval', 'oval'], leafColors: ['#A3C9A8', '#6BA292', '#446A46', '#94a3b8', '#d1d5db'], branchColor: '#4E3B31' },
            { id: 'pine', name: 'Pine', requiredHours: 50, color: '#166534', leafShapes: ['triangle', 'triangle'], leafColors: ['#2C5F2D', '#166534', '#15803d', '#052e16', '#064e3b'], branchColor: '#3B2F2F' },
            { id: 'cypress', name: 'Cypress', requiredHours: 75, color: '#4d7c0f', leafShapes: ['hexagon', 'diamond'], leafColors: ['#557A46', '#A9C46C', '#7BA23F', '#65a30d', '#84cc16'], branchColor: '#4B3D28' },
            { id: 'birch', name: 'Birch', requiredHours: 100, color: '#fde047', leafShapes: ['diamond', 'triangle'], leafColors: ['#C7E6D7', '#fef08a', '#fde047', '#facc15', '#eab308'], branchColor: '#8E7C5D' },
            { id: 'sakura', name: 'Ancient Sakura', requiredHours: 150, color: '#db2777', leafShapes: ['circle', 'fan'], leafColors: ['#F8C8DC', '#FADADD', '#FFD6E8', '#fbcfe8', '#f9a8d4', '#f472b6', '#ec4899', '#e11d48'], branchColor: '#705243' },
            { id: 'baobab', name: 'Baobab', requiredHours: 250, color: '#4d7c0f', leafShapes: ['star', 'circle'], leafColors: ['#8ABF69', '#C8E7A7', '#EBF2C0', '#4d7c0f', '#a3e635'], branchColor: '#8B5A2B' },
            { id: 'magnolia', name: 'Magnolia', requiredHours: 400, color: '#e879f9', leafShapes: ['oval', 'heart'], leafColors: ['#F6D6AD', '#EFBBCF', '#E6AACE', '#f5d0fe', '#f0abfc'], branchColor: '#7E6651' },
            {
                id: 'starry-night',
                name: 'Starry Night Tree',
                requiredHours: 600,
                color: '#8A2BE2',
                branchColor: '#2C3E50',
                leafColors: ['#000080', '#000066', '#191970', '#00008B', '#0000CD'],
                leafShapes: ['star', 'diamond', 'circle'],
            },
            { id: 'redwood', name: 'Redwood', requiredHours: 800, color: '#7f1d1d', leafShapes: ['rectangle', 'triangle'], leafColors: ['#8B4513', '#A0522D', '#D2691E', '#CD853F', '#DEB887'], branchColor: '#4A2C2A' },
            { id: 'ginkgo', name: 'Ginkgo', requiredHours: 1000, color: '#facc15', leafShapes: ['fan'], leafColors: ['#F0E68C', '#EEE8AA', '#FAFAD2', '#FFFFE0', '#FFFACD'], branchColor: '#8C5E24' }
        ];

        // Calculate total study hours from sessions
        const calculateTotalHours = (sessions) => {
            const totalMs = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
            return totalMs / (1000 * 60 * 60); // Convert to hours
        };

        // Get tree growth stage based on hours (0-100%)
        const getTreeGrowth = (totalHours, currentTree) => {
            // Calculate hours since this tree was unlocked
            const hoursSinceUnlock = totalHours - currentTree.requiredHours;
            return Math.min(100, (hoursSinceUnlock / 5) * 100); // Full growth at 5 hours after unlock
        };

        // Get available tree types based on hours
        const getUnlockedTrees = (totalHours) => {
            return TREE_TYPES.filter(tree => totalHours >= tree.requiredHours);
        };

        // --- Auto-Migration Utility ---
        // Automatically migrates and consolidates data from all locations into study-tracker-app
        // This ensures all users' data is in ONE place
        const migrateAndConsolidateData = async (db, userId) => {
            const TARGET_APP_ID = 'study-tracker-app';

            // Check if migration already completed for this user
            const migrationComplete = localStorage.getItem(`migration_complete_${userId}`);
            if (migrationComplete === 'true') {
                console.log('✓ Migration already completed, using study-tracker-app');
                return TARGET_APP_ID;
            }

            console.log('🔄 Starting automatic data migration...');
            const possibleAppIds = ['default-app-id', 'study-tracker-app', 'studyTrackerApp'];

            const allData = {
                habits: new Map(),
                sessions: new Map(),
                goals: new Map()
            };

            // Step 1: Collect all data from all locations
            for (const appId of possibleAppIds) {
                try {
                    console.log(`  Checking ${appId}...`);

                    // Collect habits
                    const habitsRef = window.collection(db, `/artifacts/${appId}/users/${userId}/habits`);
                    const habitsSnapshot = await window.getDocs(habitsRef);
                    habitsSnapshot.forEach(doc => {
                        if (!allData.habits.has(doc.id) || appId === TARGET_APP_ID) {
                            allData.habits.set(doc.id, doc.data());
                        }
                    });

                    // Collect sessions
                    const sessionsRef = window.collection(db, `/artifacts/${appId}/users/${userId}/sessions`);
                    const sessionsSnapshot = await window.getDocs(sessionsRef);
                    sessionsSnapshot.forEach(doc => {
                        if (!allData.sessions.has(doc.id) || appId === TARGET_APP_ID) {
                            allData.sessions.set(doc.id, doc.data());
                        }
                    });

                    // Collect goals
                    const goalsRef = window.collection(db, `/artifacts/${appId}/users/${userId}/goals`);
                    const goalsSnapshot = await window.getDocs(goalsRef);
                    goalsSnapshot.forEach(doc => {
                        if (!allData.goals.has(doc.id) || appId === TARGET_APP_ID) {
                            allData.goals.set(doc.id, doc.data());
                        }
                    });

                    if (habitsSnapshot.size > 0 || sessionsSnapshot.size > 0 || goalsSnapshot.size > 0) {
                        console.log(`  ✓ Found ${habitsSnapshot.size} habits, ${sessionsSnapshot.size} sessions, ${goalsSnapshot.size} goals`);
                    }
                } catch (error) {
                    console.warn(`  ⚠ Error checking ${appId}:`, error);
                }
            }

            console.log(`📊 Total collected: ${allData.habits.size} habits, ${allData.sessions.size} sessions, ${allData.goals.size} goals`);

            // Step 2: Write all data to target location
            if (allData.habits.size > 0 || allData.sessions.size > 0 || allData.goals.size > 0) {
                console.log(`💾 Writing all data to ${TARGET_APP_ID}...`);

                try {
                    // Write habits
                    for (const [id, data] of allData.habits) {
                        const docRef = window.doc(db, `/artifacts/${TARGET_APP_ID}/users/${userId}/habits`, id);
                        await window.setDoc(docRef, data);
                    }

                    // Write sessions
                    for (const [id, data] of allData.sessions) {
                        const docRef = window.doc(db, `/artifacts/${TARGET_APP_ID}/users/${userId}/sessions`, id);
                        await window.setDoc(docRef, data);
                    }

                    // Write goals
                    for (const [id, data] of allData.goals) {
                        const docRef = window.doc(db, `/artifacts/${TARGET_APP_ID}/users/${userId}/goals`, id);
                        await window.setDoc(docRef, data);
                    }

                    console.log('✅ Migration complete! All data consolidated to study-tracker-app');
                } catch (error) {
                    console.error('❌ Migration failed:', error);
                    // Don't mark as complete if migration failed
                    return TARGET_APP_ID;
                }
            } else {
                console.log('ℹ️ No data found - new user');
            }

            // Mark migration as complete
            localStorage.setItem(`migration_complete_${userId}`, 'true');
            return TARGET_APP_ID;
        };

        // --- Authentication Component ---
        const AuthComponent = ({ auth, setNotification }) => {
            const [email, setEmail] = useState('');
            const [password, setPassword] = useState('');
            const [isSignUp, setIsSignUp] = useState(false);

            const handleAuthAction = async (e) => {
                e.preventDefault();
                try {
                    if (isSignUp) {
                        await window.createUserWithEmailAndPassword(auth, email, password);
                        setNotification({ type: 'success', message: 'Signed up successfully! You are now logged in.' });
                    } else {
                        await window.signInWithEmailAndPassword(auth, email, password);
                        setNotification({ type: 'success', message: 'Logged in successfully!' });
                    }
                } catch (error) {
                    console.error("Authentication error:", error);
                    setNotification({ type: 'error', message: error.message });
                }
            };
            
            const handleAnonymousSignIn = async () => {
                try {
                    await window.signInAnonymously(auth);
                    setNotification({ type: 'success', message: 'Signed in as a guest. Your data is temporary.' });
                } catch (error) {
                    console.error("Anonymous sign-in error:", error);
                    // If Firebase fails, provide helpful message
                    setNotification({ type: 'error', message: 'Firebase connection failed. Please check config.js file. See docs/FIREBASE_CONFIG_TROUBLESHOOTING.md for help.' });
                }
            };

            const handleGoogleSignIn = async () => {
                try {
                    const provider = new window.GoogleAuthProvider();
                    await window.signInWithPopup(auth, provider);
                    setNotification({ type: 'success', message: 'Signed in with Google successfully!' });
                } catch (error) {
                    // Silently ignore user-cancelled actions
                    if (error.code === 'auth/cancelled-popup-request' ||
                        error.code === 'auth/popup-closed-by-user' ||
                        error.code === 'auth/popup-blocked') {
                        return;
                    }
                    // Only show real errors
                    setNotification({ type: 'error', message: 'Sign-in failed. Please try again.' });
                }
            };

            return React.createElement('div', { className: "min-h-screen flex flex-col justify-center items-center p-4" },
                React.createElement('div', { className: "max-w-md w-full bg-white soft-shadow-lg p-8 space-y-6", style: { borderRadius: '20px' } },
                    React.createElement('div', { className: "flex flex-col items-center" },
                        React.createElement(NousLogo, { size: "large" }),
                        React.createElement('p', { className: "text-calm-600 mt-4", style: { fontWeight: 300 } }, "log in or sign up to track your progress")
                    ),
                    React.createElement('form', { onSubmit: handleAuthAction, className: "space-y-4" },
                        React.createElement('input', {
                            type: "email",
                            value: email,
                            onChange: (e) => setEmail(e.target.value),
                            placeholder: "Email address",
                            required: true,
                            className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                        }),
                        React.createElement('input', {
                            type: "password",
                            value: password,
                            onChange: (e) => setPassword(e.target.value),
                            placeholder: "Password (6+ characters)",
                            required: true,
                            className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                        }),
                        React.createElement('button', {
                            type: "submit",
                            className: "w-full text-white py-3 px-4 rounded-xl soft-shadow hover:opacity-90 focus:outline-none transition",
                            style: { backgroundColor: '#6B8DD6', fontWeight: 400 }
                        }, isSignUp ? 'sign up' : 'log in')
                    ),
                    React.createElement('div', { className: "text-center" },
                        React.createElement('button', { onClick: () => setIsSignUp(!isSignUp), className: "text-sm text-blue-600 hover:underline" },
                            isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"
                        )
                    ),
                    React.createElement('div', { className: "relative flex py-3 items-center" },
                        React.createElement('div', { className: "flex-grow border-t border-gray-300" }),
                        React.createElement('span', { className: "flex-shrink mx-4 text-gray-400" }, "Or"),
                        React.createElement('div', { className: "flex-grow border-t border-gray-300" })
                    ),
                    React.createElement('button', {
                        onClick: handleGoogleSignIn,
                        className: "w-full bg-white soft-shadow text-calm-700 py-3 px-4 rounded-xl hover:bg-calm-50 focus:outline-none transition flex items-center justify-center gap-3",
                        style: { fontWeight: 400 }
                    },
                        React.createElement(GoogleIcon),
                        "continue with Google"
                    ),
                    React.createElement('button', {
                        onClick: handleAnonymousSignIn,
                        className: "w-full bg-calm-100 text-calm-700 py-3 px-4 rounded-xl hover:bg-calm-200 focus:outline-none transition",
                        style: { fontWeight: 400 }
                    }, "continue as guest")
                )
            );
        };

        // --- Main App Components ---

        const Header = ({ setCurrentPage, currentPage }) => {
            return React.createElement('header', { className: "bg-white sticky top-0 z-10 soft-shadow" },
                    React.createElement('div', { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" },
                        React.createElement('div', { className: "flex justify-between items-center h-16" },
                            React.createElement(NousLogo, { size: "medium" }),
                            React.createElement('nav', { className: "flex items-center space-x-2" },
                            React.createElement('button', {
                                onClick: () => setCurrentPage('dashboard'),
                                title: "Dashboard",
                                className: `p-2 rounded-full transition ${currentPage === 'dashboard' ? 'bg-calm-100 text-accent-blue' : 'text-calm-600 hover:bg-calm-50'}`,
                                style: { color: currentPage === 'dashboard' ? '#6B8DD6' : '#7d8ca8' }
                            },
                                React.createElement(HomeIcon)
                            ),
                            React.createElement('button', {
                                onClick: () => setCurrentPage('goals'),
                                title: "Goals",
                                className: `p-2 rounded-full transition ${currentPage === 'goals' ? 'bg-calm-100 text-accent-blue' : 'text-calm-600 hover:bg-calm-50'}`,
                                style: { color: currentPage === 'goals' ? '#6B8DD6' : '#7d8ca8' }
                            },
                                React.createElement(NotebookIcon)
                            ),
                            React.createElement('button', {
                                onClick: () => setCurrentPage('friends'),
                                title: "Friends",
                                className: `p-2 rounded-full transition ${currentPage === 'friends' ? 'bg-calm-100 text-accent-blue' : 'text-calm-600 hover:bg-calm-50'}`,
                                style: { color: currentPage === 'friends' ? '#6B8DD6' : '#7d8ca8' }
                            },
                                React.createElement(UsersIcon)
                            ),
                            React.createElement('button', {
                                onClick: () => setCurrentPage('leaderboard'),
                                title: "Leaderboard",
                                className: `p-2 rounded-full transition ${currentPage === 'leaderboard' ? 'bg-calm-100 text-accent-blue' : 'text-calm-600 hover:bg-calm-50'}`,
                                style: { color: currentPage === 'leaderboard' ? '#6B8DD6' : '#7d8ca8' }
                            },
                                React.createElement(TrophyIcon)
                            ),
                            React.createElement('button', {
                                onClick: () => setCurrentPage('reports'),
                                title: "Monthly Reports",
                                className: `p-2 rounded-full transition ${currentPage === 'reports' ? 'bg-calm-100 text-accent-blue' : 'text-calm-600 hover:bg-calm-50'}`,
                                style: { color: currentPage === 'reports' ? '#6B8DD6' : '#7d8ca8' }
                            },
                                React.createElement(ChartIcon)
                            ),
                            React.createElement('button', {
                                onClick: () => setCurrentPage('about'),
                                title: "About Nous",
                                className: `p-2 rounded-full transition ${currentPage === 'about' ? 'bg-calm-100 text-accent-blue' : 'text-calm-600 hover:bg-calm-50'}`,
                                style: { color: currentPage === 'about' ? '#6B8DD6' : '#7d8ca8' }
                            },
                                React.createElement(InfoIcon)
                            ),
                            React.createElement('button', {
                                onClick: () => setCurrentPage('settings'),
                                title: "Settings",
                                className: `p-2 rounded-full transition ${currentPage === 'settings' ? 'bg-calm-100 text-accent-blue' : 'text-calm-600 hover:bg-calm-50'}`,
                                style: { color: currentPage === 'settings' ? '#6B8DD6' : '#7d8ca8' }
                            },
                                React.createElement(SettingsIcon)
                            )
                        )
                    )
                )
            );
        };

        const ManualEntryModal = ({ db, userId, habit, onClose, setNotification }) => {
            const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
            const [hours, setHours] = useState('');
            const [minutes, setMinutes] = useState('');

            const handleSubmit = async (e) => {
                e.preventDefault();
                const totalMinutes = parseInt(hours || 0) * 60 + parseInt(minutes || 0);
                if (totalMinutes <= 0) {
                    setNotification({ type: 'error', message: 'Duration must be greater than zero.' });
                    return;
                }

                try {
                    const [year, month, day] = date.split('-').map(Number);
                    const sessionDate = new Date(year, month - 1, day);
                    const appId = typeof __app_id !== 'undefined' ? __app_id : 'study-tracker-app';
                    const sessionsCol = window.collection(db, `/artifacts/${appId}/users/${userId}/sessions`);
                    await window.addDoc(sessionsCol, {
                        habitId: habit.id,
                        habitName: habit.name,
                        startTime: window.Timestamp.fromDate(sessionDate),
                        endTime: window.Timestamp.fromDate(new Date(sessionDate.getTime() + totalMinutes * 60000)),
                        duration: totalMinutes * 60 * 1000, // store in milliseconds
                        createdAt: window.Timestamp.now(), // Add current timestamp for sorting
                    });
                    setNotification({ type: 'success', message: 'Manual session added successfully.' });
                    onClose();
                } catch (error) {
                    console.error("Error adding manual session:", error);
                    setNotification({ type: 'error', message: 'Failed to add manual session.' });
                }
            };

            return React.createElement('div', { className: "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20" },
                React.createElement('div', { className: "bg-white rounded-lg p-8 w-full max-w-md m-4" },
                    React.createElement('h2', { className: "text-2xl mb-4", style: { fontWeight: 400 } }, `add manual entry for "${habit.name}"`),
                    React.createElement('form', { onSubmit: handleSubmit, className: "space-y-4" },
                        React.createElement('div', null,
                            React.createElement('label', { htmlFor: "date", className: "block text-sm text-gray-700", style: { fontWeight: 400 } }, "date"),
                            React.createElement('input', {
                                type: "date",
                                id: "date",
                                value: date,
                                onChange: e => setDate(e.target.value),
                                className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            })
                        ),
                        React.createElement('div', null,
                            React.createElement('label', { className: "block text-sm text-gray-700", style: { fontWeight: 400 } }, "duration"),
                            React.createElement('div', { className: "flex items-center space-x-2 mt-1" },
                                React.createElement('input', {
                                    type: "number",
                                    value: hours,
                                    onChange: e => setHours(e.target.value),
                                    placeholder: "Hours",
                                    min: "0",
                                    className: "block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                }),
                                React.createElement('input', {
                                    type: "number",
                                    value: minutes,
                                    onChange: e => setMinutes(e.target.value),
                                    placeholder: "Minutes",
                                    min: "0",
                                    max: "59",
                                    className: "block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                })
                            )
                        ),
                        React.createElement('div', { className: "flex justify-end space-x-2 pt-4" },
                            React.createElement('button', { type: "button", onClick: onClose, className: "px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300", style: { fontWeight: 400 } }, "cancel"),
                            React.createElement('button', { type: "submit", className: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700", style: { fontWeight: 400 } }, "save")
                        )
                    )
                )
            );
        };

        // Update user stats in /users collection
        const updateUserStats = async (db, userId, sessions) => {
            try {
                const userDocRef = window.doc(db, 'users', userId);

                const totalHours = calculateTotalHours(sessions);
                const totalSessions = sessions.length;

                // Calculate current streak
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                let streak = 0;
                let checkDate = new Date(today);

                const sortedSessions = [...sessions].sort((a, b) =>
                    b.startTime.toMillis() - a.startTime.toMillis()
                );

                for (let i = 0; i < 365; i++) {
                    const dayStart = new Date(checkDate);
                    const dayEnd = new Date(checkDate);
                    dayEnd.setHours(23, 59, 59, 999);

                    const hasSessionOnDay = sortedSessions.some(s => {
                        const sessionDate = s.startTime.toDate();
                        return sessionDate >= dayStart && sessionDate <= dayEnd;
                    });

                    if (hasSessionOnDay) {
                        streak++;
                        checkDate.setDate(checkDate.getDate() - 1);
                    } else if (i === 0 && checkDate.getTime() === today.getTime()) {
                        checkDate.setDate(checkDate.getDate() - 1);
                    } else {
                        break;
                    }
                }

                // Calculate hours studied today (Singapore timezone UTC+8)
                // This ensures "today" is calculated based on Singapore time regardless of user's location
                // Example: If it's 9:00 AM EST (June 1), that's 10:00 PM SGT (June 1)
                //          Singapore's "today" started at midnight SGT = 11:00 AM EST May 31
                const now = new Date();
                const singaporeOffset = 8 * 60; // UTC+8 in minutes (Singapore is 8 hours ahead of UTC)
                const localOffset = now.getTimezoneOffset(); // Local offset from UTC in minutes (negative for ahead of UTC, positive for behind)
                const offsetDiff = singaporeOffset + localOffset; // Total minutes to adjust from local time to Singapore time
                // For Singapore (UTC+8): localOffset = -480, offsetDiff = 480 + (-480) = 0 (no adjustment needed)
                // For EST (UTC-5): localOffset = 300, offsetDiff = 480 + 300 = 780 minutes = 13 hours difference

                const todayStart = new Date();
                todayStart.setHours(0, 0, 0, 0); // Set to local midnight
                todayStart.setMinutes(todayStart.getMinutes() - offsetDiff); // Adjust to Singapore midnight

                const todayEnd = new Date();
                todayEnd.setHours(23, 59, 59, 999); // Set to local end of day
                todayEnd.setMinutes(todayEnd.getMinutes() - offsetDiff); // Adjust to Singapore end of day

                const todaySessions = sessions.filter(s => {
                    const sessionDate = s.startTime.toDate();
                    return sessionDate >= todayStart && sessionDate <= todayEnd;
                });

                const hoursToday = todaySessions.reduce((total, session) => {
                    return total + (session.duration || 0);
                }, 0) / (1000 * 60 * 60);

                // Calculate longest session
                const longestSession = sessions.reduce((max, session) => {
                    const duration = session.duration || 0;
                    return duration > max ? duration : max;
                }, 0) / (1000 * 60 * 60);

                await window.setDoc(userDocRef, {
                    stats: {
                        totalHours,
                        currentStreak: streak,
                        totalSessions,
                        hoursToday,
                        longestSession,
                        goalsCompleted: 0,
                        treeLevel: Math.floor(totalHours / 10),
                        lastUpdated: window.Timestamp.now()
                    }
                }, { merge: true });
            } catch (error) {
                console.error("Error updating user stats:", error);
            }
        };

        const Dashboard = ({ db, userId, setNotification, activeTimers, setActiveTimers, timerIntervals }) => {
            const [habits, setHabits] = useState([]);
            const [sessions, setSessions] = useState([]);
            const [newHabitName, setNewHabitName] = useState('');
            const [isLoading, setIsLoading] = useState(true);
            const [modalHabit, setModalHabit] = useState(null);
            const [editingHabitId, setEditingHabitId] = useState(null);
            const [nousRequests, setNousRequests] = useState([]);
            const [sharedTimers, setSharedTimers] = useState([]);
            const [tempHabitName, setTempHabitName] = useState('');
            const [draggedHabitId, setDraggedHabitId] = useState(null);
            const [dragOverIndex, setDragOverIndex] = useState(null);
            const [currentTime, setCurrentTime] = useState(Date.now());
            const [chatMessages, setChatMessages] = useState({});
            const [messageInput, setMessageInput] = useState({});
            const [chatOpen, setChatOpen] = useState({});
            const [customTimerInputs, setCustomTimerInputs] = useState({}); // {habitId: {hours, minutes, seconds}}
            const [unreadMessages, setUnreadMessages] = useState({});
            const [lastReadTime, setLastReadTime] = useState({});
            const chatMessagesRefs = useRef({});
            const [showInviteModal, setShowInviteModal] = useState(false);
            const [inviteSessionId, setInviteSessionId] = useState(null);
            const [friends, setFriends] = useState([]);
            const [selectedInviteFriends, setSelectedInviteFriends] = useState([]);
            const [sessionInvites, setSessionInvites] = useState([]);
            const [pings, setPings] = useState({});
            const [lastPingTime, setLastPingTime] = useState({});

            // Audio context for all sounds (reused to avoid creating multiple contexts)
            const audioContextRef = useRef(null);

            const [appId, setAppId] = useState('study-tracker-app');

            // Run migration on first load
            useEffect(() => {
                if (!db || !userId) return;

                const runMigration = async () => {
                    const migratedAppId = await migrateAndConsolidateData(db, userId);
                    setAppId(migratedAppId);
                };

                runMigration();
            }, [db, userId]);

            useEffect(() => {
                if (!db || !userId || !appId) return;
                setIsLoading(true);

                const habitsCol = window.collection(db, `/artifacts/${appId}/users/${userId}/habits`);
                const sessionsCol = window.collection(db, `/artifacts/${appId}/users/${userId}/sessions`);

                const unsubscribeHabits = window.onSnapshot(habitsCol, async (snapshot) => {
                    const habitsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                    // Initialize order field for existing habits that don't have it
                    const habitsNeedingOrder = habitsData.filter(h => h.order === undefined);
                    if (habitsNeedingOrder.length > 0) {
                        try {
                            const batch = window.writeBatch(db);
                            habitsNeedingOrder.forEach((habit, index) => {
                                const habitRef = window.doc(db, `/artifacts/${appId}/users/${userId}/habits/${habit.id}`);
                                batch.update(habitRef, { order: index });
                            });
                            await batch.commit();
                        } catch (error) {
                            console.error("Error initializing habit order:", error);
                        }
                    }

                    // Sort habits by order field
                    habitsData.sort((a, b) => (a.order || 0) - (b.order || 0));
                    setHabits(habitsData);
                    setIsLoading(false);
                }, (error) => {
                    console.error("Error fetching habits:", error);
                    setNotification({ type: 'error', message: "Could not fetch habits." });
                    setIsLoading(false);
                });

                const unsubscribeSessions = window.onSnapshot(sessionsCol, (snapshot) => {
                    const sessionsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    // Sort sessions by createdAt (if available) or startTime, descending (most recent first)
                    sessionsData.sort((a, b) => {
                        const aTime = a.createdAt || a.startTime;
                        const bTime = b.createdAt || b.startTime;
                        return bTime.toMillis() - aTime.toMillis();
                    });
                    setSessions(sessionsData);

                    // Update user stats whenever sessions change
                    if (sessionsData.length > 0) {
                        updateUserStats(db, userId, sessionsData);
                    }
                }, (error) => {
                    console.error("Error fetching sessions:", error);
                    setNotification({ type: 'error', message: "Could not fetch sessions." });
                });

                return () => {
                    unsubscribeHabits();
                    unsubscribeSessions();
                    // Don't clear intervals - they persist at App level
                };
            }, [db, userId, appId, setNotification]);

            // Listen for Nous requests and shared timers
            useEffect(() => {
                if (!db || !userId) return;

                // Listen to incoming Nous requests (multi-participant support with auto-decline)
                const nousRequestsQuery = window.query(
                    window.collection(db, 'nousRequests'),
                    window.where('toUserIds', 'array-contains', userId),
                    window.where('status', '==', 'pending')
                );

                const unsubscribeNousRequests = window.onSnapshot(nousRequestsQuery, async (snapshot) => {
                    const now = Date.now();
                    const TWO_HOURS = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

                    const requests = [];

                    for (const doc of snapshot.docs) {
                        const data = doc.data();
                        const requestAge = now - data.createdAt.toMillis();

                        // Auto-decline requests older than 2 hours
                        if (requestAge > TWO_HOURS) {
                            try {
                                await window.updateDoc(window.doc(db, 'nousRequests', doc.id), {
                                    status: 'expired',
                                    expiredAt: window.Timestamp.now()
                                });
                                console.log(`Auto-declined expired Nous request from @${data.fromUsername}`);
                            } catch (error) {
                                console.error('Error auto-declining request:', error);
                            }
                        } else {
                            requests.push({ id: doc.id, ...data });
                        }
                    }

                    setNousRequests(requests);
                });

                // Listen to incoming session invites
                const sessionInvitesQuery = window.query(
                    window.collection(db, 'sessionInvites'),
                    window.where('toUserId', '==', userId),
                    window.where('status', '==', 'pending')
                );

                const unsubscribeSessionInvites = window.onSnapshot(
                    sessionInvitesQuery,
                    (snapshot) => {
                        const invites = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                        setSessionInvites(invites);
                    },
                    (error) => {
                        console.error("Error listening to session invites:", error);
                        // Don't show notification - this is expected if rules aren't set up yet
                        setSessionInvites([]);
                    }
                );

                // Listen to shared timers where user is a participant
                const sharedTimersQuery = window.query(
                    window.collection(db, 'sharedTimers'),
                    window.where('participants', 'array-contains', userId),
                    window.where('status', '==', 'active')
                );

                const unsubscribeSharedTimers = window.onSnapshot(sharedTimersQuery, async (snapshot) => {
                    const timersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setSharedTimers(timersData);
                });

                return () => {
                    unsubscribeNousRequests();
                    unsubscribeSessionInvites();
                    unsubscribeSharedTimers();
                };
            }, [db, userId]);

            // Listen for chat messages for active shared timers
            useEffect(() => {
                if (!db || !userId || sharedTimers.length === 0) {
                    // Clean up chat messages when there are no active sessions
                    setChatMessages({});
                    setUnreadMessages({});
                    return;
                }

                // Create a stable set of active timer IDs for filtering
                const activeTimerIds = new Set(sharedTimers.map(t => t.id));

                // Query by participants (matches security rules)
                // Security rules check: request.auth.uid in resource.data.participants
                const chatQuery = window.query(
                    window.collection(db, 'chatMessages'),
                    window.where('participants', 'array-contains', userId)
                );

                try {
                    const unsubscribe = window.onSnapshot(chatQuery, (snapshot) => {
                        // Get all messages where user is a participant
                        let allMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                        // Group messages by timerId - ONLY for active timers
                        const messagesByTimer = {};
                        sharedTimers.forEach(timer => {
                            messagesByTimer[timer.id] = [];
                        });

                        allMessages.forEach(msg => {
                            // Only include messages for currently active sessions
                            if (activeTimerIds.has(msg.timerId) && messagesByTimer[msg.timerId] !== undefined) {
                                messagesByTimer[msg.timerId].push(msg);
                            }
                        });

                        // Sort messages for each timer by time
                        Object.keys(messagesByTimer).forEach(timerId => {
                            messagesByTimer[timerId].sort((a, b) => {
                                if (!a.createdAt || !b.createdAt) return 0;
                                return a.createdAt.toMillis() - b.createdAt.toMillis();
                            });
                        });

                        setChatMessages(messagesByTimer);

                        // Count unread messages for each timer
                        // Use functional update to get current lastReadTime without it being a dependency
                        setLastReadTime(currentLastReadTime => {
                            const unreadCounts = {};
                            Object.keys(messagesByTimer).forEach(timerId => {
                                const lastRead = currentLastReadTime[timerId] || 0;
                                unreadCounts[timerId] = messagesByTimer[timerId].filter(msg => {
                                    const msgTime = msg.createdAt ? msg.createdAt.toMillis() : 0;
                                    return msgTime > lastRead && msg.senderId !== userId;
                                }).length;
                            });
                            setUnreadMessages(unreadCounts);
                            return currentLastReadTime; // Don't modify lastReadTime here
                        });
                    }, (error) => {
                        console.error("Error listening to chat:", error);
                        // Don't retry immediately to avoid error loops
                    });

                    return () => {
                        if (unsubscribe) {
                            unsubscribe();
                        }
                    };
                } catch (error) {
                    console.error("Error setting up chat listener:", error);
                }
            }, [db, userId, sharedTimers.length, sharedTimers.map(t => t.id).sort().join(',')]);

            // Auto-scroll chat to bottom when messages change
            useEffect(() => {
                sharedTimers.forEach(timer => {
                    if (chatOpen[timer.id]) {
                        scrollChatToBottom(timer.id);
                    }
                });
            }, [chatMessages]);

            // Listen for pings in shared timers
            useEffect(() => {
                if (!db || !userId || sharedTimers.length === 0) return;

                // Create a stable set of active timer IDs for filtering
                const activeTimerIds = new Set(sharedTimers.map(t => t.id));

                const pingQuery = window.query(
                    window.collection(db, 'sessionPings'),
                    window.where('participants', 'array-contains', userId)
                );

                try {
                    const unsubscribe = window.onSnapshot(pingQuery, (snapshot) => {
                        snapshot.docChanges().forEach(change => {
                            if (change.type === 'added') {
                                const pingData = { id: change.doc.id, ...change.doc.data() };

                                // Only process pings for active sessions
                                if (!activeTimerIds.has(pingData.timerId)) return;

                                // Only show ping if it's from someone else and recent (within last 10 seconds)
                                if (pingData.senderId !== userId && pingData.createdAt) {
                                    const pingTime = pingData.createdAt.toMillis();
                                    const now = Date.now();

                                    if (now - pingTime < 10000) {
                                        // Show visual notification
                                        setPings(prev => ({
                                            ...prev,
                                            [pingData.timerId]: {
                                                ...pingData,
                                                timestamp: Date.now()
                                            }
                                        }));

                                        // Play musical sound
                                        playPingSound();

                                        // Clear ping notification after 3 seconds
                                        setTimeout(() => {
                                            setPings(prev => {
                                                const newPings = { ...prev };
                                                delete newPings[pingData.timerId];
                                                return newPings;
                                            });
                                        }, 3000);
                                    }
                                }
                            }
                        });
                    }, (error) => {
                        console.error("Error listening to pings:", error);
                        // Don't retry immediately to avoid error loops
                    });

                    return () => {
                        if (unsubscribe) {
                            unsubscribe();
                        }
                    };
                } catch (error) {
                    console.error("Error setting up ping listener:", error);
                }
            }, [db, userId, sharedTimers.length, sharedTimers.map(t => t.id).sort().join(',')]);

            // Listen for active timer changes from Firebase
            useEffect(() => {
                if (!db || !userId) return;

                const activeTimersCol = window.collection(db, `/artifacts/${appId}/users/${userId}/activeTimers`);
                const unsubscribeTimers = window.onSnapshot(activeTimersCol, (snapshot) => {
                    const timersData = {};
                    snapshot.docs.forEach(doc => {
                        const data = doc.data();
                        timersData[doc.id] = {
                            habitId: data.habitId,
                            habitName: data.habitName,
                            startTime: data.startTime,
                            elapsedBeforePause: data.elapsedBeforePause || 0,
                            isPaused: data.isPaused,
                            originalStartTime: data.originalStartTime || data.startTime
                        };
                    });
                    setActiveTimers(timersData);
                }, (error) => {
                    console.error("Error fetching active timers:", error);
                });

                return () => unsubscribeTimers();
            }, [db, userId, appId]);

            // Update lastActive timestamp every 2 minutes while timer is running
            useEffect(() => {
                if (!db || !userId || Object.keys(activeTimers).length === 0) return;

                const updateLastActive = async () => {
                    try {
                        const userDocRef = window.doc(db, 'users', userId);
                        await window.setDoc(userDocRef, {
                            lastActive: window.serverTimestamp()
                        }, { merge: true });
                    } catch (error) {
                        console.error("Error updating lastActive:", error);
                    }
                };

                // Update immediately
                updateLastActive();

                // Then update every 2 minutes
                const interval = setInterval(updateLastActive, 2 * 60 * 1000);

                return () => clearInterval(interval);
            }, [db, userId, Object.keys(activeTimers).length]);

            // Update timer display every 10ms for running timers
            useEffect(() => {
                const completedTimers = new Set(); // Track which timers have already played sound

                const interval = setInterval(() => {
                    setCurrentTime(Date.now());
                    setActiveTimers(prev => {
                        const updated = { ...prev };
                        let hasChanges = false;

                        Object.keys(updated).forEach(habitId => {
                            const timer = updated[habitId];
                            if (!timer.isPaused && timer.startTime) {
                                // Force re-render to update display
                                hasChanges = true;

                                // Check if countdown timer has completed
                                const habit = habits.find(h => h.id === habitId);
                                if (habit && habit.timerMode === 'timer') {
                                    const sessionElapsed = Date.now() - timer.startTime.toMillis();
                                    const totalElapsed = (timer.elapsedBeforePause || 0) + sessionElapsed;
                                    const remaining = habit.targetDuration - totalElapsed;

                                    // Timer has reached or passed 0 - stop it!
                                    if (remaining <= 0 && !completedTimers.has(habitId)) {
                                        completedTimers.add(habitId);

                                        // IMMEDIATELY remove timer from state to stop the display
                                        setActiveTimers(prev => {
                                            const newTimers = { ...prev };
                                            delete newTimers[habitId];
                                            return newTimers;
                                        });

                                        // Play bell 3 times using Web Audio API
                                        const playBell = async (times, delay = 500) => {
                                            try {
                                                // Get or create audio context
                                                if (!audioContextRef.current) {
                                                    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
                                                }

                                                const audioContext = audioContextRef.current;

                                                // Resume audio context if suspended
                                                if (audioContext.state === 'suspended') {
                                                    await audioContext.resume();
                                                }

                                                for (let i = 0; i < times; i++) {
                                                    const startTime = audioContext.currentTime + (i * delay / 1000);

                                                    // Create a bell tone
                                                    const oscillator = audioContext.createOscillator();
                                                    const gainNode = audioContext.createGain();

                                                    oscillator.connect(gainNode);
                                                    gainNode.connect(audioContext.destination);

                                                    oscillator.frequency.value = 800; // Bell frequency
                                                    oscillator.type = 'sine';

                                                    // Envelope for bell sound
                                                    gainNode.gain.setValueAtTime(0, startTime);
                                                    gainNode.gain.linearRampToValueAtTime(0.5, startTime + 0.01);
                                                    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

                                                    oscillator.start(startTime);
                                                    oscillator.stop(startTime + 0.3);
                                                }
                                            } catch (err) {
                                                console.log('Timer completion audio prevented:', err);
                                            }
                                        };
                                        playBell(3);

                                        // Stop timer and save session
                                        (async () => {
                                            try {
                                                const timerData = timer; // Use timer from loop since we already removed from state

                                                // Calculate exact duration (use targetDuration for countdown timers)
                                                const exactDuration = habit.targetDuration;

                                                // Save session to Firebase
                                                const sessionsCol = window.collection(db, `/artifacts/${appId}/users/${userId}/sessions`);
                                                const originalStartTime = timerData.originalStartTime || timerData.startTime;

                                                await window.addDoc(sessionsCol, {
                                                    habitId,
                                                    habitName: habit.name,
                                                    startTime: originalStartTime,
                                                    endTime: window.Timestamp.now(),
                                                    duration: Math.round(exactDuration),
                                                    createdAt: window.Timestamp.now()
                                                });

                                                // Delete from activeTimers collection in Firebase
                                                const timerDocRef = window.doc(db, `/artifacts/${appId}/users/${userId}/activeTimers/${habitId}`);
                                                await window.deleteDoc(timerDocRef);

                                                // Clear currentTopic and lastActive if no other timers active
                                                setActiveTimers(current => {
                                                    if (Object.keys(current).length === 0) {
                                                        const userDocRef = window.doc(db, 'users', userId);
                                                        window.setDoc(userDocRef, {
                                                            currentTopic: null,
                                                            lastActive: null
                                                        }, { merge: true });
                                                    }
                                                    return current;
                                                });

                                                console.log(`Timer completed! Session saved: ${habit.name} - ${Math.round(exactDuration / 1000)}s`);
                                            } catch (error) {
                                                console.error('Error auto-stopping timer:', error);
                                            }
                                        })();
                                    }
                                }
                            }
                        });

                        // Only trigger re-render if there are running timers
                        return hasChanges ? { ...updated } : prev;
                    });
                }, 10);

                return () => clearInterval(interval);
            }, [habits]);

            // Accept Nous request and create shared timer
            const handleAcceptNousRequest = async (request) => {
                try {
                    // Get current user's profile for username
                    const userDoc = await window.getDoc(window.doc(db, 'users', userId));
                    const userProfile = userDoc.data();
                    const myUsername = userProfile?.username || 'Anonymous';

                    const requestDocRef = window.doc(db, 'nousRequests', request.id);
                    await window.updateDoc(requestDocRef, {
                        status: 'accepted'
                    });

                    // Create shared timer with participantHabits field
                    const sharedTimerData = {
                        participants: [request.fromUserId, userId],
                        participantNames: [request.fromUsername, myUsername],
                        participantHabits: {
                            [request.fromUserId]: {
                                habitId: 'nous_together',
                                habitName: 'Nous Together'
                            },
                            [userId]: {
                                habitId: 'nous_together',
                                habitName: 'Nous Together'
                            }
                        },
                        status: 'active',
                        habitName: 'Nous Together',
                        startTime: window.Timestamp.now(),
                        elapsedBeforePause: 0,
                        isPaused: false,
                        createdAt: window.Timestamp.now(),
                        createdBy: userId,
                        timerMode: 'stopwatch',
                        targetDuration: 25 * 60 * 1000
                    };

                    await window.addDoc(window.collection(db, 'sharedTimers'), sharedTimerData);

                    setNousRequests(prev => prev.filter(r => r.id !== request.id));
                    setNotification({ type: 'success', message: `You're now studying together with @${request.fromUsername}!` });
                } catch (error) {
                    console.error("Error accepting Nous request:", error);
                    setNotification({ type: 'error', message: 'Failed to accept request.' });
                }
            };

            // Decline Nous request
            const handleDeclineNousRequest = async (request) => {
                try {
                    const requestDocRef = window.doc(db, 'nousRequests', request.id);
                    await window.updateDoc(requestDocRef, {
                        status: 'declined'
                    });
                    setNousRequests(prev => prev.filter(r => r.id !== request.id));
                    setNotification({ type: 'success', message: 'Nous request declined.' });
                } catch (error) {
                    console.error("Error declining Nous request:", error);
                    setNotification({ type: 'error', message: 'Failed to decline request.' });
                }
            };

            const handleAddHabit = async (e) => {
                e.preventDefault();
                if (newHabitName.trim() === '') return;
                try {
                    const habitsCol = window.collection(db, `/artifacts/${appId}/users/${userId}/habits`);
                    // New habits go to the end
                    const maxOrder = habits.length > 0 ? Math.max(...habits.map(h => h.order || 0)) : -1;
                    await window.addDoc(habitsCol, {
                        name: newHabitName,
                        createdAt: window.Timestamp.now(),
                        order: maxOrder + 1,
                        timerMode: 'stopwatch', // default mode
                        targetDuration: 0 // default 0 seconds
                    });
                    setNewHabitName('');
                    setNotification({ type: 'success', message: 'Habit added!' });
                } catch (error) {
                    console.error("Error adding habit:", error);
                    setNotification({ type: 'error', message: 'Failed to add habit.' });
                }
            };

            const handleDeleteHabit = async (habitId) => {
                if (window.confirm("Are you sure you want to delete this habit and all its sessions? This cannot be undone.")) {
                    try {
                        // Use a batch write to delete the habit and all its sessions atomically
                        const batch = window.writeBatch(db);

                        // 1. Delete the habit document
                        const habitDocRef = window.doc(db, `/artifacts/${appId}/users/${userId}/habits/${habitId}`);
                        batch.delete(habitDocRef);

                        // 2. Query and delete all associated sessions
                        const sessionsQuery = window.query(window.collection(db, `/artifacts/${appId}/users/${userId}/sessions`), window.where("habitId", "==", habitId));
                        const sessionsSnapshot = await window.getDocs(sessionsQuery);
                        sessionsSnapshot.forEach(doc => {
                            batch.delete(doc.ref);
                        });

                        await batch.commit();
                        setNotification({ type: 'success', message: 'Habit and all its sessions deleted.' });
                    } catch (error) {
                        console.error("Error deleting habit:", error);
                        setNotification({ type: 'error', message: 'Failed to delete habit.' });
                    }
                }
            };

            const handleResetTimer = async (habitId, habitName) => {
                try {
                    const activeTimer = activeTimers[habitId];
                    if (activeTimer) {
                        // If timer is running, stop and delete it
                        const timerDocRef = window.doc(db, `/artifacts/${appId}/users/${userId}/activeTimers/${habitId}`);
                        await window.deleteDoc(timerDocRef);
                        setNotification({ type: 'success', message: `Timer reset for ${habitName}.` });
                    } else {
                        setNotification({ type: 'info', message: `No active timer for ${habitName}.` });
                    }
                } catch (error) {
                    console.error("Error resetting timer:", error);
                    setNotification({ type: 'error', message: 'Failed to reset timer.' });
                }
            };

            const handleDeleteSession = async (sessionId) => {
                if (window.confirm("Are you sure you want to delete this session? This cannot be undone.")) {
                    try {
                        const sessionDocRef = window.doc(db, `/artifacts/${appId}/users/${userId}/sessions/${sessionId}`);
                        await window.deleteDoc(sessionDocRef);
                        setNotification({ type: 'success', message: 'Session deleted successfully.' });
                    } catch (error) {
                        console.error("Error deleting session:", error);
                        setNotification({ type: 'error', message: 'Failed to delete session.' });
                    }
                }
            };

            const handleRenameHabit = async (habitId, newName) => {
                console.log('handleRenameHabit called:', { habitId, newName });

                if (!newName || newName.trim() === '') {
                    console.log('Empty name, rejecting');
                    setNotification({ type: 'error', message: 'Habit name cannot be empty.' });
                    return;
                }

                try {
                    console.log('Updating habit in Firestore...');
                    const habitDocRef = window.doc(db, `/artifacts/${appId}/users/${userId}/habits/${habitId}`);
                    await window.updateDoc(habitDocRef, { name: newName.trim() });
                    console.log('Habit document updated');

                    // Also update all sessions with this habit
                    console.log('Updating sessions...');
                    const sessionsQuery = window.query(
                        window.collection(db, `/artifacts/${appId}/users/${userId}/sessions`),
                        window.where("habitId", "==", habitId)
                    );
                    const sessionsSnapshot = await window.getDocs(sessionsQuery);
                    console.log(`Found ${sessionsSnapshot.size} sessions to update`);

                    const batch = window.writeBatch(db);
                    sessionsSnapshot.forEach(doc => {
                        batch.update(doc.ref, { habitName: newName.trim() });
                    });
                    await batch.commit();
                    console.log('Sessions updated');

                    setEditingHabitId(null);
                    setTempHabitName('');
                    setNotification({ type: 'success', message: 'Habit renamed!' });
                    console.log('Rename complete!');
                } catch (error) {
                    console.error("Error renaming habit:", error);
                    setNotification({ type: 'error', message: 'Failed to rename habit.' });
                }
            };

            const handleDragStart = (e, habitId) => {
                setDraggedHabitId(habitId);
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/html', e.currentTarget);
            };

            const handleDragOver = (e, index) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                setDragOverIndex(index);
            };

            const handleDragLeave = () => {
                setDragOverIndex(null);
            };

            const handleDrop = async (e, targetIndex) => {
                e.preventDefault();
                setDragOverIndex(null);

                if (!draggedHabitId) return;

                const draggedIndex = habits.findIndex(h => h.id === draggedHabitId);
                if (draggedIndex === -1 || draggedIndex === targetIndex) {
                    setDraggedHabitId(null);
                    return;
                }

                try {
                    // Reorder the habits array
                    const reorderedHabits = [...habits];
                    const [draggedItem] = reorderedHabits.splice(draggedIndex, 1);
                    reorderedHabits.splice(targetIndex, 0, draggedItem);

                    // Update order field for all habits in batch
                    const batch = window.writeBatch(db);
                    reorderedHabits.forEach((habit, index) => {
                        const habitRef = window.doc(db, `/artifacts/${appId}/users/${userId}/habits/${habit.id}`);
                        batch.update(habitRef, { order: index });
                    });

                    await batch.commit();
                } catch (error) {
                    console.error("Error reordering habit:", error);
                    setNotification({ type: 'error', message: 'Failed to reorder habit.' });
                }

                setDraggedHabitId(null);
            };

            const handleDragEnd = () => {
                setDraggedHabitId(null);
                setDragOverIndex(null);
            };

            // Helper function to calculate current elapsed time for a timer
            const getTimerElapsedTime = useCallback((timer, habit) => {
                if (!timer) return 0;
                const timerMode = habit?.timerMode || 'stopwatch';
                const targetDuration = habit?.targetDuration || 25 * 60 * 1000;

                if (timer.isPaused) {
                    const elapsed = timer.elapsedBeforePause || 0;
                    return timerMode === 'timer' ? Math.max(0, targetDuration - elapsed) : elapsed;
                }
                // Timer is running - calculate elapsed time from start
                const elapsedBeforePause = timer.elapsedBeforePause || 0;
                const sessionElapsed = timer.startTime ? Date.now() - timer.startTime.toMillis() : 0;
                const totalElapsed = elapsedBeforePause + sessionElapsed;

                // For countdown timer, show remaining time
                if (timerMode === 'timer') {
                    return Math.max(0, targetDuration - totalElapsed);
                }
                return totalElapsed;
            }, []);

            const startTimer = useCallback(async (habitId) => {
                const habit = habits.find(h => h.id === habitId);
                if (!habit) return;

                try {
                    const timerDocRef = window.doc(db, `/artifacts/${appId}/users/${userId}/activeTimers/${habitId}`);
                    const existingTimer = activeTimers[habitId];

                    // Save timer to Firebase with server timestamp
                    await window.setDoc(timerDocRef, {
                        habitId,
                        habitName: habit.name,
                        startTime: window.serverTimestamp(),
                        elapsedBeforePause: existingTimer?.elapsedBeforePause || 0,
                        isPaused: false,
                        // Keep track of original start time for session recording
                        originalStartTime: existingTimer?.originalStartTime || window.serverTimestamp()
                    });

                    // Update currentTopic and lastActive in user profile
                    const userDocRef = window.doc(db, 'users', userId);
                    await window.setDoc(userDocRef, {
                        currentTopic: habit.name,
                        lastActive: window.serverTimestamp()
                    }, { merge: true });
                } catch (error) {
                    console.error("Error starting timer:", error);
                    setNotification({ type: 'error', message: 'Failed to start timer.' });
                }
            }, [db, userId, appId, habits, activeTimers, setNotification]);

            const pauseTimer = useCallback(async (habitId) => {
                const timer = activeTimers[habitId];
                if (!timer) return;

                try {
                    const timerDocRef = window.doc(db, `/artifacts/${appId}/users/${userId}/activeTimers/${habitId}`);

                    // Calculate total elapsed time including current session
                    const currentElapsed = timer.elapsedBeforePause || 0;
                    const sessionElapsed = timer.startTime ? Date.now() - timer.startTime.toMillis() : 0;
                    const totalElapsed = currentElapsed + sessionElapsed;

                    await window.updateDoc(timerDocRef, {
                        isPaused: true,
                        elapsedBeforePause: totalElapsed,
                        lastPauseTime: window.serverTimestamp()
                    });
                } catch (error) {
                    console.error("Error pausing timer:", error);
                    setNotification({ type: 'error', message: 'Failed to pause timer.' });
                }
            }, [db, userId, appId, activeTimers, setNotification]);

            const stopTimer = useCallback(async (habitId, habitName) => {
                const timerData = activeTimers[habitId];

                if (timerData) {
                    try {
                        // Calculate total elapsed time
                        const currentElapsed = timerData.elapsedBeforePause || 0;
                        const sessionElapsed = (!timerData.isPaused && timerData.startTime)
                            ? Date.now() - timerData.startTime.toMillis()
                            : 0;
                        const totalElapsed = currentElapsed + sessionElapsed;

                        if (totalElapsed > 0) {
                            // Save session to Firebase
                            const sessionsCol = window.collection(db, `/artifacts/${appId}/users/${userId}/sessions`);
                            const originalStartTime = timerData.originalStartTime || timerData.startTime;

                            await window.addDoc(sessionsCol, {
                                habitId,
                                habitName,
                                startTime: originalStartTime,
                                endTime: window.Timestamp.now(),
                                duration: Math.round(totalElapsed),
                                createdAt: window.Timestamp.now()
                            });
                            setNotification({ type: 'success', message: `Session for ${habitName} saved.` });
                        }

                        // Delete from activeTimers collection
                        const timerDocRef = window.doc(db, `/artifacts/${appId}/users/${userId}/activeTimers/${habitId}`);
                        await window.deleteDoc(timerDocRef);

                        // Clear currentTopic and lastActive in user profile if no other timers are active
                        const remainingTimers = Object.keys(activeTimers).filter(id => id !== habitId);
                        if (remainingTimers.length === 0) {
                            const userDocRef = window.doc(db, 'users', userId);
                            await window.setDoc(userDocRef, {
                                currentTopic: null,
                                lastActive: null
                            }, { merge: true });
                        }
                    } catch(error) {
                        console.error("Error stopping timer:", error);
                        setNotification({ type: 'error', message: 'Failed to stop timer.' });
                    }
                }
            }, [activeTimers, db, userId, appId, setNotification]);

            // Toggle timer mode between stopwatch and timer
            const toggleTimerMode = async (habitId) => {
                try {
                    const habit = habits.find(h => h.id === habitId);
                    if (!habit) return;

                    const habitDocRef = window.doc(db, `/artifacts/${appId}/users/${userId}/habits/${habitId}`);
                    const newMode = habit.timerMode === 'stopwatch' ? 'timer' : 'stopwatch';
                    await window.updateDoc(habitDocRef, {
                        timerMode: newMode
                    });

                    setNotification({
                        type: 'success',
                        message: `Switched to ${newMode} mode`
                    });
                } catch (error) {
                    console.error("Error toggling timer mode:", error);
                    setNotification({ type: 'error', message: 'Failed to toggle mode.' });
                }
            };

            // Update timer target duration
            const updateTimerDuration = async (habitId, duration) => {
                try {
                    const habitDocRef = window.doc(db, `/artifacts/${appId}/users/${userId}/habits/${habitId}`);
                    await window.updateDoc(habitDocRef, {
                        targetDuration: duration
                    });
                } catch (error) {
                    console.error("Error updating timer duration:", error);
                    setNotification({ type: 'error', message: 'Failed to update duration.' });
                }
            };

            // Helper function to convert milliseconds to HH:MM:SS format
            const msToTimeString = (ms) => {
                const totalSeconds = Math.floor(ms / 1000);
                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;
                return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            };

            // Helper function to convert HH:MM:SS string to milliseconds
            const timeStringToMs = (timeString) => {
                const parts = timeString.split(':');
                if (parts.length !== 3) return null;
                const hours = parseInt(parts[0]) || 0;
                const minutes = parseInt(parts[1]) || 0;
                const seconds = parseInt(parts[2]) || 0;
                return (hours * 3600 + minutes * 60 + seconds) * 1000;
            };

            // Get time input string for a habit
            const getTimeInputString = (habitId, habit) => {
                if (customTimerInputs[habitId]) {
                    return customTimerInputs[habitId];
                }
                return msToTimeString(habit.targetDuration || 0);
            };

            // Update time input from string
            const handleTimeInputChange = (habitId, value) => {
                // Allow typing freely
                setCustomTimerInputs(prev => ({ ...prev, [habitId]: value }));
            };

            // Update duration when input loses focus
            const handleTimeInputBlur = (habitId, value) => {
                const ms = timeStringToMs(value);
                if (ms !== null && ms >= 0) {
                    updateTimerDuration(habitId, ms);
                    // Format the input nicely
                    setCustomTimerInputs(prev => ({ ...prev, [habitId]: msToTimeString(ms) }));
                } else {
                    // Reset to current duration if invalid
                    const habit = habits.find(h => h.id === habitId);
                    if (habit) {
                        setCustomTimerInputs(prev => ({ ...prev, [habitId]: msToTimeString(habit.targetDuration || 0) }));
                    }
                }
            };

            // Toggle timer mode for shared sessions
            const toggleSharedTimerMode = async (sessionId) => {
                try {
                    const session = sharedTimers.find(t => t.id === sessionId);
                    if (!session) return;

                    const sessionDocRef = window.doc(db, 'sharedTimers', sessionId);
                    const newMode = session.timerMode === 'stopwatch' ? 'timer' : 'stopwatch';
                    await window.updateDoc(sessionDocRef, {
                        timerMode: newMode
                    });

                    setNotification({
                        type: 'success',
                        message: `Switched to ${newMode} mode`
                    });
                } catch (error) {
                    console.error("Error toggling timer mode:", error);
                    setNotification({ type: 'error', message: 'Failed to toggle mode.' });
                }
            };

            // Update shared timer target duration
            const updateSharedTimerDuration = async (sessionId, duration) => {
                try {
                    const sessionDocRef = window.doc(db, 'sharedTimers', sessionId);
                    await window.updateDoc(sessionDocRef, {
                        targetDuration: duration
                    });
                } catch (error) {
                    console.error("Error updating timer duration:", error);
                    setNotification({ type: 'error', message: 'Failed to update duration.' });
                }
            };

            // Shared timer control handlers
            const pauseSharedTimer = async (sessionId) => {
                try {
                    const session = sharedTimers.find(t => t.id === sessionId);
                    if (!session) return;

                    const currentElapsed = session.elapsedBeforePause || 0;
                    const sessionElapsed = !session.isPaused && session.startTime
                        ? Date.now() - session.startTime.toMillis()
                        : 0;

                    const sessionDocRef = window.doc(db, 'sharedTimers', sessionId);
                    await window.updateDoc(sessionDocRef, {
                        isPaused: true,
                        elapsedBeforePause: currentElapsed + sessionElapsed,
                        lastUpdated: window.Timestamp.now()
                    });

                    setNotification({ type: 'success', message: 'Shared timer paused.' });
                } catch (error) {
                    console.error("Error pausing timer:", error);
                    setNotification({ type: 'error', message: 'Failed to pause timer.' });
                }
            };

            const resumeSharedTimer = async (sessionId) => {
                try {
                    const session = sharedTimers.find(t => t.id === sessionId);
                    if (!session) return;

                    const sessionDocRef = window.doc(db, 'sharedTimers', sessionId);
                    await window.updateDoc(sessionDocRef, {
                        isPaused: false,
                        startTime: window.Timestamp.now(),
                        lastUpdated: window.Timestamp.now()
                    });

                    setNotification({ type: 'success', message: 'Shared timer resumed.' });
                } catch (error) {
                    console.error("Error resuming timer:", error);
                    setNotification({ type: 'error', message: 'Failed to resume timer.' });
                }
            };

            const stopSharedTimer = async (sessionId) => {
                // Add confirmation dialog
                if (!window.confirm('End this Nous session for everyone? All progress will be saved.')) {
                    return;
                }

                try {
                    const session = sharedTimers.find(t => t.id === sessionId);
                    if (!session) {
                        setNotification({ type: 'error', message: 'Session not found.' });
                        return;
                    }

                    // Calculate total elapsed time for the shared timer
                    const currentElapsed = session.elapsedBeforePause || 0;
                    const sessionElapsed = !session.isPaused && session.startTime
                        ? Date.now() - session.startTime.toMillis()
                        : 0;
                    const totalElapsed = currentElapsed + sessionElapsed;

                    if (totalElapsed > 0) {
                        const endTime = window.Timestamp.now();

                        // Save session for EACH participant with their selected habit
                        // Use Promise.allSettled to handle errors for individual participants
                        const savePromises = session.participants.map(async (participantId) => {
                            try {
                                const participantIndex = session.participants.indexOf(participantId);
                                const otherParticipants = session.participantNames.filter((name, idx) => idx !== participantIndex);

                                // Get this participant's selected habit
                                const participantHabit = session.participantHabits?.[participantId] || {
                                    habitId: 'nous_together',
                                    habitName: 'Nous Together'
                                };

                                console.log(`[NOUS] Saving session for participant ${participantId} with habit:`, participantHabit);

                                // Save session for this participant with their habit
                                const sessionsCol = window.collection(db, `/artifacts/${appId}/users/${participantId}/sessions`);
                                await window.addDoc(sessionsCol, {
                                    habitId: participantHabit.habitId,
                                    habitName: participantHabit.habitName,
                                    startTime: session.startTime,
                                    endTime: endTime,
                                    duration: Math.round(totalElapsed),
                                    isShared: true,
                                    sharedWith: otherParticipants,
                                    createdAt: window.Timestamp.now()
                                });

                                console.log(`[NOUS] ✅ Successfully saved session for participant ${participantId}`);

                                // Note: Stats will be automatically updated for each participant
                                // when they load their own sessions (see sessions listener)

                                return { success: true, participantId };
                            } catch (error) {
                                console.error(`[NOUS] ❌ Error saving session for participant ${participantId}:`, error);
                                return { success: false, participantId, error };
                            }
                        });

                        const results = await Promise.allSettled(savePromises);
                        const successes = results.filter(r => r.status === 'fulfilled' && r.value.success);
                        const failures = results.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success));

                        console.log(`[NOUS] Session save results: ${successes.length}/${session.participants.length} participants saved successfully`);

                        if (failures.length > 0) {
                            console.warn(`[NOUS] Failed to save sessions for ${failures.length} participant(s):`, failures);
                        }
                    }

                    // Delete the shared timer - always do this even if some saves failed
                    const sessionDocRef = window.doc(db, 'sharedTimers', sessionId);
                    await window.deleteDoc(sessionDocRef);

                    setNotification({ type: 'success', message: `Shared session saved! (${formatTimeDisplay(totalElapsed)})` });
                } catch (error) {
                    console.error("Error stopping timer:", error);
                    setNotification({ type: 'error', message: `Failed to stop timer: ${error.message}` });
                }
            };

            // Load friends list for inviting to existing session
            useEffect(() => {
                if (!db || !userId) return;

                const friendshipsQuery1 = window.query(
                    window.collection(db, 'friendships'),
                    window.where('user1Id', '==', userId)
                );
                const friendshipsQuery2 = window.query(
                    window.collection(db, 'friendships'),
                    window.where('user2Id', '==', userId)
                );

                const fetchFriends = async () => {
                    try {
                        const [snap1, snap2] = await Promise.all([
                            window.getDocs(friendshipsQuery1),
                            window.getDocs(friendshipsQuery2)
                        ]);

                        const friendsList = [];
                        for (const doc of [...snap1.docs, ...snap2.docs]) {
                            const data = doc.data();
                            const friendId = data.user1Id === userId ? data.user2Id : data.user1Id;

                            const friendDocRef = window.doc(db, 'users', friendId);
                            const friendSnapshot = await window.getDoc(friendDocRef);
                            const friendData = friendSnapshot.data();

                            if (friendData) {
                                friendsList.push({
                                    userId: friendId,
                                    username: data.user1Id === userId ? data.user2Username : data.user1Username,
                                    ...friendData
                                });
                            }
                        }

                        setFriends(friendsList);
                    } catch (error) {
                        console.error("Error fetching friends:", error);
                    }
                };

                fetchFriends();
            }, [db, userId]);

            // Open invite modal for existing session
            const handleOpenInviteModal = (sessionId) => {
                setInviteSessionId(sessionId);
                setSelectedInviteFriends([]);
                setShowInviteModal(true);
            };

            // Toggle friend selection for invite
            const handleToggleInviteFriend = (friend) => {
                setSelectedInviteFriends(prev => {
                    const isSelected = prev.some(f => f.userId === friend.userId);
                    if (isSelected) {
                        return prev.filter(f => f.userId !== friend.userId);
                    } else {
                        return [...prev, friend];
                    }
                });
            };

            // Send invites to join existing session
            const handleInviteToSession = async () => {
                try {
                    if (selectedInviteFriends.length === 0) {
                        setNotification({ type: 'error', message: 'Please select at least one friend!' });
                        return;
                    }

                    const session = sharedTimers.find(t => t.id === inviteSessionId);
                    if (!session) {
                        setNotification({ type: 'error', message: 'Session not found.' });
                        return;
                    }

                    // Get current user's profile
                    const userDoc = await window.getDoc(window.doc(db, 'users', userId));
                    const userProfile = userDoc.data();

                    // Create invite requests for each selected friend
                    for (const friend of selectedInviteFriends) {
                        await window.addDoc(window.collection(db, 'sessionInvites'), {
                            sessionId: inviteSessionId,
                            fromUserId: userId,
                            fromUsername: userProfile.username,
                            toUserId: friend.userId,
                            toUsername: friend.username,
                            status: 'pending',
                            createdAt: window.Timestamp.now()
                        });
                    }

                    setNotification({
                        type: 'success',
                        message: `Invited ${selectedInviteFriends.length} friend${selectedInviteFriends.length > 1 ? 's' : ''}!`
                    });

                    // Reset modal state
                    setShowInviteModal(false);
                    setInviteSessionId(null);
                    setSelectedInviteFriends([]);
                } catch (error) {
                    console.error("Error sending invites:", error);
                    setNotification({ type: 'error', message: `Failed to send invites: ${error.message}` });
                }
            };

            // Accept session invite and join existing session
            const handleAcceptSessionInvite = async (invite) => {
                try {
                    // Check if session still exists
                    const sessionRef = window.doc(db, 'sharedTimers', invite.sessionId);
                    const sessionSnapshot = await window.getDoc(sessionRef);

                    if (!sessionSnapshot.exists()) {
                        setNotification({ type: 'error', message: 'This session has ended.' });
                        // Mark invite as expired
                        await window.updateDoc(window.doc(db, 'sessionInvites', invite.id), {
                            status: 'expired'
                        });
                        return;
                    }

                    const sessionData = sessionSnapshot.data();

                    // Get current user's profile
                    const userDoc = await window.getDoc(window.doc(db, 'users', userId));
                    const userProfile = userDoc.data();

                    // Update session to add new participant
                    await window.updateDoc(sessionRef, {
                        participants: [...sessionData.participants, userId],
                        participantNames: [...sessionData.participantNames, userProfile.username],
                        participantHabits: {
                            ...sessionData.participantHabits,
                            [userId]: {
                                habitId: 'nous_together',
                                habitName: 'Nous Together'
                            }
                        }
                    });

                    // Mark invite as accepted
                    await window.updateDoc(window.doc(db, 'sessionInvites', invite.id), {
                        status: 'accepted',
                        acceptedAt: window.Timestamp.now()
                    });

                    setNotification({
                        type: 'success',
                        message: `Joined ${invite.fromUsername}'s session!`
                    });
                } catch (error) {
                    console.error("Error accepting session invite:", error);
                    setNotification({ type: 'error', message: `Failed to join session: ${error.message}` });
                }
            };

            // Decline session invite
            const handleDeclineSessionInvite = async (invite) => {
                try {
                    await window.updateDoc(window.doc(db, 'sessionInvites', invite.id), {
                        status: 'declined',
                        declinedAt: window.Timestamp.now()
                    });

                    setNotification({ type: 'info', message: 'Invite declined.' });
                } catch (error) {
                    console.error("Error declining session invite:", error);
                    setNotification({ type: 'error', message: 'Failed to decline invite.' });
                }
            };

            // Scroll chat to bottom
            const scrollChatToBottom = (timerId) => {
                requestAnimationFrame(() => {
                    const container = chatMessagesRefs.current[timerId];
                    if (container) {
                        container.scrollTop = container.scrollHeight;
                    }
                });
            };

            // Send a chat message
            const sendMessage = async (timerId) => {
                const message = messageInput[timerId]?.trim();

                if (!message || !timerId) return;

                try {
                    const timer = sharedTimers.find(t => t.id === timerId);
                    if (!timer) return;

                    // Get current user's profile for username
                    const userDoc = await window.getDoc(window.doc(db, 'users', userId));
                    const username = userDoc.exists() ? userDoc.data().username : 'Anonymous';

                    const messageData = {
                        timerId,
                        senderId: userId,
                        senderName: username,
                        message,
                        participants: timer.participants,
                        createdAt: window.Timestamp.now()
                    };

                    await window.addDoc(window.collection(db, 'chatMessages'), messageData);

                    // Clear input
                    setMessageInput(prev => ({ ...prev, [timerId]: '' }));

                    // Scroll to bottom after sending
                    scrollChatToBottom(timerId);
                } catch (error) {
                    console.error("Error sending message:", error);
                    setNotification({ type: 'error', message: `Failed to send message: ${error.message}` });
                }
            };

            // Toggle chat open/closed and mark messages as read
            const toggleChat = (timerId) => {
                const isOpening = !chatOpen[timerId];

                setChatOpen(prev => ({ ...prev, [timerId]: isOpening }));

                // Mark messages as read when opening chat
                if (isOpening) {
                    setLastReadTime(prev => ({ ...prev, [timerId]: Date.now() }));
                    setUnreadMessages(prev => ({ ...prev, [timerId]: 0 }));
                }
            };

            // Play ping sound using Web Audio API
            const playPingSound = async () => {
                try {
                    // Get or create audio context
                    if (!audioContextRef.current) {
                        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
                    }

                    const audioContext = audioContextRef.current;

                    // Resume audio context if suspended (required by browser autoplay policies)
                    if (audioContext.state === 'suspended') {
                        await audioContext.resume();
                    }

                    // Create a pleasant two-tone bell sound
                    const playTone = (frequency, startTime, duration) => {
                        const oscillator = audioContext.createOscillator();
                        const gainNode = audioContext.createGain();

                        oscillator.connect(gainNode);
                        gainNode.connect(audioContext.destination);

                        oscillator.frequency.value = frequency;
                        oscillator.type = 'sine';

                        // Envelope for natural bell decay
                        gainNode.gain.setValueAtTime(0, startTime);
                        gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
                        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

                        oscillator.start(startTime);
                        oscillator.stop(startTime + duration);
                    };

                    // Two-tone chime: higher note then lower note
                    const now = audioContext.currentTime;
                    playTone(800, now, 0.3);      // First chime (E5)
                    playTone(600, now + 0.15, 0.4); // Second chime (D5)

                } catch (error) {
                    console.error('Error playing ping sound:', error);
                }
            };

            // Send a ping to all participants in a session
            const sendPing = async (timerId) => {
                try {
                    // Rate limit: don't allow pinging more than once every 5 seconds
                    const lastPing = lastPingTime[timerId] || 0;
                    const now = Date.now();
                    if (now - lastPing < 5000) {
                        setNotification({
                            type: 'info',
                            message: 'Please wait a few seconds before pinging again!'
                        });
                        return;
                    }

                    const timer = sharedTimers.find(t => t.id === timerId);
                    if (!timer) return;

                    // Get current user's profile for username
                    const userDoc = await window.getDoc(window.doc(db, 'users', userId));
                    const username = userDoc.exists() ? userDoc.data().username : 'Anonymous';

                    const pingData = {
                        timerId,
                        senderId: userId,
                        senderName: username,
                        participants: timer.participants,
                        createdAt: window.Timestamp.now()
                    };

                    await window.addDoc(window.collection(db, 'sessionPings'), pingData);

                    // Update last ping time
                    setLastPingTime(prev => ({ ...prev, [timerId]: now }));

                    // Play sound for sender too
                    playPingSound();

                    setNotification({
                        type: 'success',
                        message: `👋 Pinged everyone in the session!`
                    });
                } catch (error) {
                    console.error("Error sending ping:", error);
                    setNotification({ type: 'error', message: `Failed to send ping: ${error.message}` });
                }
            };

            if (isLoading) {
                return React.createElement('div', { className: "flex justify-center items-center p-8" },
                    React.createElement(LoaderIcon),
                    React.createElement('span', { className: "ml-2" }, "loading your dashboard...")
                );
            }

            return React.createElement('div', { className: "max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8" },
                modalHabit && React.createElement(ManualEntryModal, { db, userId, habit: modalHabit, onClose: () => setModalHabit(null), setNotification }),

                // Session Invites Notification (full width across columns)
                sessionInvites.length > 0 && React.createElement('div', { className: "lg:col-span-3 bg-purple-50 border-2 border-purple-200 rounded-lg p-4" },
                    React.createElement('h3', { className: "text-lg text-purple-800 mb-3", style: { fontWeight: 400 } },
                        `Session Invites (${sessionInvites.length})`
                    ),
                    React.createElement('div', { className: "space-y-2" },
                        sessionInvites.map(invite =>
                            React.createElement('div', {
                                key: invite.id,
                                className: "bg-white p-3 rounded-lg flex justify-between items-center gap-3"
                            },
                                React.createElement('div', null,
                                    React.createElement('p', { className: "text-gray-800", style: { fontWeight: 400 } },
                                        `@${invite.fromUsername} invited you to join their Nous session`
                                    ),
                                    React.createElement('p', { className: "text-sm text-gray-600", style: { fontWeight: 300 } },
                                        formatDate(invite.createdAt)
                                    )
                                ),
                                React.createElement('div', { className: "flex gap-2 flex-shrink-0" },
                                    React.createElement('button', {
                                        onClick: () => handleAcceptSessionInvite(invite),
                                        className: "px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm",
                                        style: { fontWeight: 400 }
                                    }, "Join"),
                                    React.createElement('button', {
                                        onClick: () => handleDeclineSessionInvite(invite),
                                        className: "px-3 py-1.5 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition text-sm",
                                        style: { fontWeight: 400 }
                                    }, "Decline")
                                )
                            )
                        )
                    )
                ),

                // Left/Main Column: Habits
                React.createElement('div', { className: "lg:col-span-2" },
                    React.createElement('h2', { className: "text-2xl text-gray-800 mb-4", style: { fontWeight: 300 } }, "my habits"),

                    // Nous Requests
                    nousRequests.length > 0 && React.createElement('div', { className: "bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4" },
                        React.createElement('h3', { className: "text-lg text-purple-900 mb-3", style: { fontWeight: 400 } },
                            `📨 ${nousRequests.length} friend${nousRequests.length !== 1 ? 's' : ''} want${nousRequests.length === 1 ? 's' : ''} to Nous together!`
                        ),
                        React.createElement('div', { className: "space-y-2" },
                            nousRequests.map(request =>
                                React.createElement('div', {
                                    key: request.id,
                                    className: "flex items-center justify-between bg-white rounded-lg p-3"
                                },
                                    React.createElement('span', { className: "text-gray-800", style: { fontWeight: 400 } },
                                        `@${request.fromUsername}`
                                    ),
                                    React.createElement('div', { className: "flex gap-2" },
                                        React.createElement('button', {
                                            onClick: () => handleAcceptNousRequest(request),
                                            className: "px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm",
                                            style: { fontWeight: 400 }
                                        }, "accept"),
                                        React.createElement('button', {
                                            onClick: () => handleDeclineNousRequest(request),
                                            className: "px-3 py-1 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition text-sm",
                                            style: { fontWeight: 400 }
                                        }, "decline")
                                    )
                                )
                            )
                        )
                    ),


                    // Add new habit form
                    React.createElement('form', { onSubmit: handleAddHabit, className: "bg-white p-4 rounded-lg shadow-sm mb-6 flex gap-4" },
                        React.createElement('input', {
                            type: "text",
                            value: newHabitName,
                            onChange: (e) => setNewHabitName(e.target.value),
                            placeholder: "e.g., Morning Run",
                            className: "flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        }),
                        React.createElement('button', { type: "submit", className: "bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition", style: { fontWeight: 400 } }, "add habit")
                    ),

                    // Habits List (including shared timers)
                    React.createElement('div', { className: "space-y-4" },
                        (() => {
                            // Combine shared timers and habits
                            const sharedTimerItems = sharedTimers.map(timer => ({
                                type: 'sharedTimer',
                                data: timer,
                                id: timer.id
                            }));
                            const habitItems = habits.map(habit => ({
                                type: 'habit',
                                data: habit,
                                id: habit.id
                            }));
                            const allItems = [...sharedTimerItems, ...habitItems];

                            if (allItems.length === 0) {
                                return React.createElement('p', { className: "text-gray-500 text-center py-8" }, "No habits yet. Add one to get started!");
                            }

                            return allItems.map((item, index) => {
                                if (item.type === 'sharedTimer') {
                                    // Render Nous session with shared timer
                                    const session = item.data;
                                    const messages = chatMessages[session.id] || [];

                                    // Calculate shared timer time
                                    const currentElapsed = session.elapsedBeforePause || 0;
                                    const sessionElapsed = !session.isPaused && session.startTime
                                        ? currentTime - session.startTime.toMillis()
                                        : 0;

                                    return React.createElement('div', { key: session.id, className: "space-y-2" },
                                        // Nous session card
                                        React.createElement('div', {
                                            className: "bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300 p-4 rounded-lg shadow-sm"
                                        },
                                            React.createElement('div', { className: "flex flex-col gap-4" },
                                                // Header with drag handle
                                                React.createElement('div', { className: "flex items-center gap-2" },
                                                    React.createElement('div', { className: "p-2 text-purple-400 opacity-50" },
                                                        React.createElement(GripIcon)
                                                    ),
                                                    React.createElement('h3', { className: "text-xl text-purple-900", style: { fontWeight: 400 } },
                                                        `Nous Together (${session.participants.length} participants)`
                                                    )
                                                ),

                                                // Show all participants with their habits
                                                React.createElement('div', { className: "mb-3 space-y-1" },
                                                    session.participants.map((participantId, idx) => {
                                                        const participantName = session.participantNames[idx];
                                                        const participantHabit = session.participantHabits?.[participantId];
                                                        const isCurrentUser = participantId === userId;
                                                        return React.createElement('div', {
                                                            key: participantId,
                                                            className: `text-sm ${isCurrentUser ? 'text-purple-900 font-medium' : 'text-purple-700'}`,
                                                            style: { fontWeight: isCurrentUser ? 500 : 300 }
                                                        },
                                                            `${isCurrentUser ? '👤 You' : `👥 @${participantName}`} • ${participantHabit?.habitName || 'Nous Together'}`
                                                        );
                                                    })
                                                ),

                                                // Ping notification
                                                pings[session.id] && React.createElement('div', {
                                                    className: "mb-2 p-2 bg-yellow-50 border border-yellow-300 rounded-lg flex items-center gap-2 animate-pulse"
                                                },
                                                    React.createElement('span', { className: "text-lg" }, '👋'),
                                                    React.createElement('span', { className: "text-sm text-yellow-900" },
                                                        `@${pings[session.id].senderName} says hi!`
                                                    )
                                                ),

                                                // Timer mode toggle for shared session
                                                React.createElement('div', { className: "flex items-center gap-2 mb-2 border-t border-purple-200 pt-3" },
                                                    React.createElement('button', {
                                                        onClick: () => toggleSharedTimerMode(session.id),
                                                        className: `p-2 rounded transition ${session.timerMode === 'timer' ? 'bg-purple-200 text-purple-700 hover:bg-purple-300' : 'bg-purple-100 text-purple-600 hover:bg-purple-200'}`,
                                                        title: session.timerMode === 'timer' ? 'Countdown mode - Click to switch to stopwatch' : 'Stopwatch mode - Click to switch to countdown'
                                                    },
                                                        // Icon based on mode
                                                        session.timerMode === 'timer' ?
                                                            // Hourglass icon for countdown
                                                            React.createElement('svg', {
                                                                width: "18",
                                                                height: "18",
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
                                                            )
                                                            :
                                                            // Stopwatch icon for count up
                                                            React.createElement('svg', {
                                                                width: "18",
                                                                height: "18",
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
                                                            )
                                                    ),
                                                    session.timerMode === 'timer' && React.createElement('select', {
                                                        value: session.targetDuration || 25 * 60 * 1000,
                                                        onChange: (e) => updateSharedTimerDuration(session.id, parseInt(e.target.value)),
                                                        className: "px-2 py-1 rounded text-xs border border-purple-300 bg-white",
                                                        disabled: !session.isPaused
                                                    },
                                                        React.createElement('option', { value: 5 * 60 * 1000 }, '5 min'),
                                                        React.createElement('option', { value: 10 * 60 * 1000 }, '10 min'),
                                                        React.createElement('option', { value: 15 * 60 * 1000 }, '15 min'),
                                                        React.createElement('option', { value: 25 * 60 * 1000 }, '25 min'),
                                                        React.createElement('option', { value: 30 * 60 * 1000 }, '30 min'),
                                                        React.createElement('option', { value: 45 * 60 * 1000 }, '45 min'),
                                                        React.createElement('option', { value: 60 * 60 * 1000 }, '60 min')
                                                    )
                                                ),

                                                // Shared timer display and controls
                                                React.createElement('div', { className: "flex items-center justify-between" },
                                                    React.createElement('div', {
                                                        className: `timer-display ${!session.isPaused ? 'running' : 'paused'}`
                                                    },
                                                        React.createElement('span', null,
                                                            formatTimeDisplay(
                                                                session.timerMode === 'timer'
                                                                    ? Math.max(0, (session.targetDuration || 25 * 60 * 1000) - (currentElapsed + sessionElapsed))
                                                                    : currentElapsed + sessionElapsed
                                                            )
                                                        ),
                                                        React.createElement('span', { className: "milliseconds" },
                                                            `.${String(Math.floor((
                                                                session.timerMode === 'timer'
                                                                    ? Math.max(0, (session.targetDuration || 25 * 60 * 1000) - (currentElapsed + sessionElapsed))
                                                                    : (currentElapsed + sessionElapsed)
                                                            ) % 1000 / 10)).padStart(2, '0')}`
                                                        )
                                                    ),

                                                    // Action buttons for shared timer
                                                    React.createElement('div', { className: "flex items-center gap-2 flex-wrap" },
                                                        !session.isPaused ?
                                                            React.createElement('button', {
                                                                onClick: () => pauseSharedTimer(session.id),
                                                                className: "p-3 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200 transition"
                                                            },
                                                                React.createElement(PauseIcon)
                                                            ) :
                                                            React.createElement('button', {
                                                                onClick: () => resumeSharedTimer(session.id),
                                                                className: "p-3 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200 transition"
                                                            },
                                                                React.createElement(PlayIcon)
                                                            ),
                                                        React.createElement('button', {
                                                            onClick: () => stopSharedTimer(session.id),
                                                            className: "p-3 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200 transition"
                                                        },
                                                            React.createElement(StopIcon)
                                                        ),
                                                        // Chat button with notification badge
                                                        React.createElement('button', {
                                                            onClick: () => toggleChat(session.id),
                                                            className: "relative p-3 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200 transition"
                                                        },
                                                    React.createElement('svg', {
                                                        width: "20",
                                                        height: "20",
                                                        viewBox: "0 0 24 24",
                                                        fill: "none",
                                                        stroke: "currentColor",
                                                        strokeWidth: "2",
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round"
                                                    },
                                                        React.createElement('path', { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" })
                                                    ),
                                                    // Unread badge
                                                    unreadMessages[session.id] > 0 && React.createElement('span', {
                                                        className: "absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center",
                                                        style: { fontSize: '10px' }
                                                    }, unreadMessages[session.id])
                                                ),
                                                        // Invite Friends button
                                                        React.createElement('button', {
                                                            onClick: () => handleOpenInviteModal(session.id),
                                                            className: "p-3 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200 transition",
                                                            title: "Invite more friends"
                                                        },
                                                            React.createElement('svg', {
                                                                width: "20",
                                                                height: "20",
                                                                viewBox: "0 0 24 24",
                                                                fill: "none",
                                                                stroke: "currentColor",
                                                                strokeWidth: "2",
                                                                strokeLinecap: "round",
                                                                strokeLinejoin: "round"
                                                            },
                                                                React.createElement('path', { d: "M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }),
                                                                React.createElement('circle', { cx: "8.5", cy: "7", r: "4" }),
                                                                React.createElement('line', { x1: "20", y1: "8", x2: "20", y2: "14" }),
                                                                React.createElement('line', { x1: "23", y1: "11", x2: "17", y2: "11" })
                                                            )
                                                        ),
                                                        // Ping button
                                                        React.createElement('button', {
                                                            onClick: () => sendPing(session.id),
                                                            className: "relative p-3 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200 transition",
                                                            title: "Say hi to everyone!"
                                                        },
                                                            React.createElement('svg', {
                                                                width: "20",
                                                                height: "20",
                                                                viewBox: "0 0 24 24",
                                                                fill: "none",
                                                                stroke: "currentColor",
                                                                strokeWidth: "2",
                                                                strokeLinecap: "round",
                                                                strokeLinejoin: "round"
                                                            },
                                                                React.createElement('path', { d: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" }),
                                                                React.createElement('path', { d: "M10.3 21a1.94 1.94 0 0 0 3.4 0" })
                                                            ),
                                                            // Ping notification badge
                                                            pings[session.id] && React.createElement('span', {
                                                                className: "absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse",
                                                                style: { fontSize: '10px' }
                                                            }, '👋')
                                                        )
                                            )
                                            )
                                        )
                                            ),

                                        // Chat box (only show when open)
                                        chatOpen[session.id] && React.createElement('div', {
                                            className: "bg-white border-2 border-purple-200 rounded-lg p-4 shadow-sm"
                                        },
                                            React.createElement('h4', { className: "text-sm text-purple-900 mb-2", style: { fontWeight: 500 } }, "Chat"),

                                            // Messages
                                            React.createElement('div', {
                                                ref: (el) => {
                                                    chatMessagesRefs.current[session.id] = el;
                                                    if (el) {
                                                        // Scroll to bottom immediately when element is attached
                                                        requestAnimationFrame(() => {
                                                            el.scrollTop = el.scrollHeight;
                                                        });
                                                    }
                                                },
                                                className: "space-y-2 mb-3 max-h-40 overflow-y-auto"
                                            },
                                                messages.length > 0 ?
                                                    messages.map(msg =>
                                                        React.createElement('div', {
                                                            key: msg.id,
                                                            className: `flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`
                                                        },
                                                            React.createElement('div', {
                                                                className: `${msg.senderId === userId ? 'bg-purple-100' : 'bg-gray-100'} rounded-lg px-3 py-2 max-w-xs`
                                                            },
                                                                React.createElement('div', { className: "text-xs text-gray-600 mb-1" }, msg.senderName),
                                                                React.createElement('div', { className: "text-sm" }, msg.message)
                                                            )
                                                        )
                                                    ) :
                                                    React.createElement('p', { className: "text-xs text-gray-400 text-center py-4" }, "no messages yet. start chatting!")
                                            ),

                                            // Input
                                            React.createElement('div', { className: "flex gap-2" },
                                                React.createElement('input', {
                                                    type: "text",
                                                    value: messageInput[session.id] || '',
                                                    onChange: (e) => setMessageInput(prev => ({ ...prev, [session.id]: e.target.value })),
                                                    onKeyDown: (e) => {
                                                        if (e.key === 'Enter') sendMessage(session.id);
                                                    },
                                                    placeholder: "Type a message...",
                                                    className: "flex-grow px-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none text-sm"
                                                }),
                                                React.createElement('button', {
                                                    onClick: () => sendMessage(session.id),
                                                    className: "px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm",
                                                    style: { fontWeight: 400 }
                                                }, "send")
                                            )
                                        )
                                    );
                                } else {
                                    // Render regular habit
                                    const habit = item.data;
                                    const habit_index = habits.findIndex(h => h.id === habit.id);
                                    const timer = activeTimers[habit.id];
                                    const isRunning = timer && !timer.isPaused;
                                    const isEditing = editingHabitId === habit.id;
                                    const isDragging = draggedHabitId === habit.id;
                                    const isDropTarget = dragOverIndex === habit_index;

                                    return React.createElement('div', {
                                        key: habit.id,
                                        draggable: !isEditing,
                                        onDragStart: (e) => handleDragStart(e, habit.id),
                                        onDragOver: (e) => handleDragOver(e, habit_index),
                                        onDragLeave: handleDragLeave,
                                        onDrop: (e) => handleDrop(e, habit_index),
                                        onDragEnd: handleDragEnd,
                                        className: `bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row sm:items-center gap-4 transition-all ${isDragging ? 'opacity-50 scale-95' : ''} ${isDropTarget ? 'border-2 border-blue-400 border-dashed' : ''}`
                                    },
                                        // Drag handle (left side)
                                        React.createElement('div', {
                                            className: `p-2 text-gray-400 transition ${isEditing ? 'cursor-default opacity-30' : 'cursor-move hover:text-gray-600'}`,
                                            title: isEditing ? "" : "Drag to reorder",
                                            onMouseDown: (e) => {
                                                if (isEditing) e.preventDefault();
                                            }
                                        },
                                            React.createElement(GripIcon)
                                        ),

                                        // Habit name and timer (middle)
                                        React.createElement('div', { className: "flex-grow" },
                                            isEditing ?
                                                React.createElement('div', { className: "flex items-center gap-2 mb-4" },
                                                    React.createElement('input', {
                                                        type: "text",
                                                        value: tempHabitName,
                                                        onChange: (e) => setTempHabitName(e.target.value),
                                                        onKeyDown: (e) => {
                                                            if (e.key === 'Enter') handleRenameHabit(habit.id, tempHabitName);
                                                            if (e.key === 'Escape') { setEditingHabitId(null); setTempHabitName(''); }
                                                        },
                                                        className: "flex-grow px-3 py-1 border border-blue-400 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none",
                                                        autoFocus: true
                                                    }),
                                                    React.createElement('button', {
                                                        onClick: () => {
                                                            console.log('Save button clicked');
                                                            handleRenameHabit(habit.id, tempHabitName);
                                                        },
                                                        className: "p-2 bg-green-100 text-green-600 rounded hover:bg-green-200 transition",
                                                        title: "save"
                                                    },
                                                        React.createElement(CheckIcon)
                                                    ),
                                                    React.createElement('button', {
                                                        onClick: () => { setEditingHabitId(null); setTempHabitName(''); },
                                                        className: "p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition",
                                                        title: "cancel"
                                                    },
                                                        React.createElement(XIcon)
                                                    )
                                                ) :
                                                React.createElement('div', { className: "flex items-center gap-2 mb-4" },
                                                    React.createElement('h3', { className: "text-xl text-gray-700", style: { fontWeight: 400 } }, habit.name),
                                                    React.createElement('button', {
                                                        onClick: () => { setEditingHabitId(habit.id); setTempHabitName(habit.name); },
                                                        className: "p-1 text-gray-400 hover:text-gray-600 transition",
                                                        title: "Rename habit"
                                                    },
                                                        React.createElement(PencilIcon)
                                                    )
                                                ),
                                            // Timer mode toggle and target duration
                                            React.createElement('div', { className: "flex items-center gap-2 mb-2" },
                                                React.createElement('button', {
                                                    onClick: () => toggleTimerMode(habit.id),
                                                    className: `p-2 rounded transition ${habit.timerMode === 'timer' ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`,
                                                    title: habit.timerMode === 'timer' ? 'Countdown mode - Click to switch to stopwatch' : 'Stopwatch mode - Click to switch to countdown'
                                                },
                                                    // Icon based on mode
                                                    habit.timerMode === 'timer' ?
                                                        // Hourglass icon for countdown
                                                        React.createElement('svg', {
                                                            width: "18",
                                                            height: "18",
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
                                                        )
                                                        :
                                                        // Stopwatch icon for count up
                                                        React.createElement('svg', {
                                                            width: "18",
                                                            height: "18",
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
                                                        )
                                                ),
                                                habit.timerMode === 'timer' && React.createElement('input', {
                                                    type: "text",
                                                    value: getTimeInputString(habit.id, habit),
                                                    onChange: (e) => handleTimeInputChange(habit.id, e.target.value),
                                                    onBlur: (e) => handleTimeInputBlur(habit.id, e.target.value),
                                                    className: "w-32 px-3 py-2 rounded border border-gray-300 text-center text-base font-mono",
                                                    disabled: isRunning,
                                                    placeholder: "00:00:00",
                                                    title: "Format: HH:MM:SS (e.g., 00:05:00 for 5 minutes)"
                                                })
                                            ),
                                            React.createElement('div', {
                                                className: `timer-display ${isRunning ? 'running' : (timer ? 'paused' : '')}`
                                            },
                                                React.createElement('span', null, formatTimeDisplay(getTimerElapsedTime(timer, habit))),
                                                React.createElement('span', { className: "milliseconds" },
                                                    `.${String(getMilliseconds(getTimerElapsedTime(timer, habit))).padStart(2, '0')}`
                                                )
                                            )
                                        ),

                                        // Action buttons (right side)
                                        React.createElement('div', { className: "flex items-center gap-2 flex-wrap" },
                                            isRunning ?
                                                React.createElement('button', { onClick: () => pauseTimer(habit.id), className: "p-3 bg-yellow-100 text-yellow-600 rounded-full hover:bg-yellow-200 transition" },
                                                    React.createElement(PauseIcon)
                                                ) :
                                                React.createElement('button', { onClick: () => startTimer(habit.id), className: "p-3 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition" },
                                                    React.createElement(PlayIcon)
                                                ),
                                            React.createElement('button', { onClick: () => stopTimer(habit.id, habit.name), disabled: !timer, className: "p-3 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed" },
                                                React.createElement(StopIcon)
                                            ),
                                            React.createElement('button', { onClick: () => setModalHabit(habit), className: "p-3 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition" },
                                                React.createElement(PlusCircleIcon)
                                            ),
                                            React.createElement('button', {
                                                onClick: () => handleResetTimer(habit.id, habit.name),
                                                disabled: !timer,
                                                className: "p-3 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200 transition disabled:opacity-50 disabled:cursor-not-allowed",
                                                title: "Reset timer to 0"
                                            },
                                                React.createElement(ResetIcon)
                                            ),
                                            React.createElement('button', { onClick: () => handleDeleteHabit(habit.id), className: "p-3 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 transition" },
                                                React.createElement(TrashIcon)
                                            )
                                        )
                                    );
                                }
                            });
                        })()
                    )
                ),

                // Right/Side Column: Growth Tree & Recent Sessions
                React.createElement('div', { className: "lg:col-span-1 space-y-6" },
                    // Growth Tree
                    React.createElement(GrowthTree, { sessions, db, userId, setNotification }),

                    // Recent Sessions
                    React.createElement('div', null,
                        React.createElement('h2', { className: "text-2xl text-gray-800 mb-4", style: { fontWeight: 300 } }, "recent sessions"),
                        React.createElement('div', { className: "bg-white p-4 rounded-lg shadow-sm space-y-3 max-h-[600px] overflow-y-auto" },
                            sessions.length > 0 ? sessions.slice(0, 15).map(session =>
                                React.createElement('div', { key: session.id, className: "border-b pb-2 last:border-b-0 flex items-center justify-between gap-2" },
                                    React.createElement('div', { className: "flex-grow" },
                                        React.createElement('p', { style: { fontWeight: 400 } }, session.habitName),
                                        React.createElement('div', { className: "flex justify-between text-sm text-gray-600" },
                                            React.createElement('span', null, formatDate(session.startTime)),
                                            React.createElement('span', null, formatTime(session.duration))
                                        )
                                    ),
                                    React.createElement('button', {
                                        onClick: () => handleDeleteSession(session.id),
                                        className: "p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition flex-shrink-0",
                                        title: "Delete session"
                                    },
                                        React.createElement(TrashIcon)
                                    )
                                )
                            ) :
                            React.createElement('p', { className: "text-gray-500" }, "no sessions recorded yet.")
                        )
                    )
                ),

                // Invite Friends to Existing Session Modal
                showInviteModal && React.createElement('div', {
                    className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",
                    onClick: () => {
                        setShowInviteModal(false);
                        setInviteSessionId(null);
                        setSelectedInviteFriends([]);
                    }
                },
                    React.createElement('div', {
                        className: "bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto",
                        onClick: (e) => e.stopPropagation()
                    },
                        React.createElement('h3', { className: "text-2xl text-purple-800 mb-4", style: { fontWeight: 400 } },
                            "Invite Friends to Session"
                        ),

                        React.createElement('p', { className: "text-gray-600 mb-4", style: { fontWeight: 300 } },
                            "Select friends to invite to this Nous session. They'll receive an invitation to join."
                        ),

                        // Select Friends Section
                        React.createElement('div', { className: "mb-6" },
                            React.createElement('h4', { className: "text-lg text-gray-700 mb-3", style: { fontWeight: 400 } },
                                `Select friends (${selectedInviteFriends.length} selected)`
                            ),
                            React.createElement('div', { className: "space-y-2 max-h-64 overflow-y-auto border border-purple-200 rounded-lg p-3" },
                                friends.length === 0 ?
                                    React.createElement('p', { className: "text-gray-500 text-center py-4", style: { fontWeight: 300 } },
                                        "No friends available. Add friends first!"
                                    ) :
                                    friends.map(friend =>
                                        React.createElement('label', {
                                            key: friend.userId,
                                            className: "flex items-center gap-3 p-2 hover:bg-purple-50 rounded cursor-pointer"
                                        },
                                            React.createElement('input', {
                                                type: "checkbox",
                                                checked: selectedInviteFriends.some(f => f.userId === friend.userId),
                                                onChange: () => handleToggleInviteFriend(friend),
                                                className: "w-4 h-4 text-purple-600"
                                            }),
                                            React.createElement('div', { className: "flex-grow" },
                                                React.createElement('span', { className: "text-gray-800", style: { fontWeight: 400 } },
                                                    `@${friend.username}`
                                                ),
                                                React.createElement('div', { className: "text-sm text-gray-600", style: { fontWeight: 300 } },
                                                    `${friend.stats?.totalHours?.toFixed(1) || 0}h total`
                                                )
                                            )
                                        )
                                    )
                            )
                        ),

                        // Action Buttons
                        React.createElement('div', { className: "flex gap-3 justify-end" },
                            React.createElement('button', {
                                onClick: () => {
                                    setShowInviteModal(false);
                                    setInviteSessionId(null);
                                    setSelectedInviteFriends([]);
                                },
                                className: "px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition",
                                style: { fontWeight: 400 }
                            }, "Cancel"),
                            React.createElement('button', {
                                onClick: handleInviteToSession,
                                disabled: selectedInviteFriends.length === 0,
                                className: `px-4 py-2 rounded-lg transition ${
                                    selectedInviteFriends.length === 0
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-purple-600 text-white hover:bg-purple-700'
                                }`,
                                style: { fontWeight: 400 }
                            }, "Send Invites")
                        )
                    )
                )
            );
        };

        const Reports = ({ db, userId, setNotification }) => {
            const [reportData, setReportData] = useState([]);
            const [sessions, setSessions] = useState([]);
            const [isLoading, setIsLoading] = useState(true);
            const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
            const [viewMode, setViewMode] = useState('monthly'); // 'monthly' or 'weekly'
            const [weeklyData, setWeeklyData] = useState([]);
            const [timeOfDayData, setTimeOfDayData] = useState([]);

            const appId = typeof __app_id !== 'undefined' ? __app_id : 'study-tracker-app';

            useEffect(() => {
                if (!db || !userId) return;

                const fetchReportData = async () => {
                    setIsLoading(true);
                    try {
                        const [year, monthNum] = month.split('-').map(Number);
                        const startDate = new Date(year, monthNum - 1, 1);
                        const endDate = new Date(year, monthNum, 0, 23, 59, 59);

                        const sessionsQuery = window.query(
                            window.collection(db, `/artifacts/${appId}/users/${userId}/sessions`),
                            window.where('startTime', '>=', window.Timestamp.fromDate(startDate)),
                            window.where('startTime', '<=', window.Timestamp.fromDate(endDate))
                        );

                        const snapshot = await window.getDocs(sessionsQuery);
                        const monthlySessions = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
                        monthlySessions.sort((a,b) => b.startTime.toMillis() - a.startTime.toMillis());
                        setSessions(monthlySessions);

                        const data = monthlySessions.reduce((acc, session) => {
                            acc[session.habitName] = (acc[session.habitName] || 0) + session.duration;
                            return acc;
                        }, {});
                        
                        const formattedData = Object.entries(data).map(([name, duration]) => ({ name, duration }));
                        setReportData(formattedData);

                    } catch (error) {
                        console.error("Error fetching report data:", error);
                        setNotification({ type: 'error', message: 'Failed to load report data.' });
                    } finally {
                        setIsLoading(false);
                    }
                };

                fetchReportData();
            }, [db, userId, month, appId, setNotification]);

            // Fetch weekly and time-of-day data
            useEffect(() => {
                if (!db || !userId || viewMode !== 'weekly') return;

                const fetchWeeklyData = async () => {
                    try {
                        // Get all sessions
                        const sessionsQuery = window.collection(db, `/artifacts/${appId}/users/${userId}/sessions`);
                        const snapshot = await window.getDocs(sessionsQuery);
                        const allSessions = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));

                        // Get start of week (Sunday) for the last 8 weeks
                        const weeks = [];
                        for (let i = 0; i < 8; i++) {
                            const date = new Date();
                            date.setDate(date.getDate() - (i * 7));
                            const startOfWeek = new Date(date);
                            startOfWeek.setDate(date.getDate() - date.getDay());
                            startOfWeek.setHours(0, 0, 0, 0);

                            const endOfWeek = new Date(startOfWeek);
                            endOfWeek.setDate(startOfWeek.getDate() + 6);
                            endOfWeek.setHours(23, 59, 59, 999);

                            const weekSessions = allSessions.filter(session => {
                                const sessionTime = session.startTime.toMillis();
                                return sessionTime >= startOfWeek.getTime() && sessionTime <= endOfWeek.getTime();
                            });

                            const totalDuration = weekSessions.reduce((sum, s) => sum + s.duration, 0);
                            weeks.push({
                                weekStart: startOfWeek,
                                weekEnd: endOfWeek,
                                totalHours: totalDuration / (1000 * 60 * 60),
                                sessions: weekSessions
                            });
                        }

                        weeks.reverse(); // Show oldest to newest
                        setWeeklyData(weeks);

                        // Calculate time of day distribution (for all time) - Singapore timezone (UTC+8)
                        const hourBuckets = Array(24).fill(0);
                        allSessions.forEach(session => {
                            // Convert to Singapore time (UTC+8)
                            const date = new Date(session.startTime.toMillis());
                            const singaporeHour = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Singapore' })).getHours();
                            hourBuckets[singaporeHour] += session.duration;
                        });

                        const timeOfDayStats = hourBuckets.map((duration, hour) => ({
                            hour,
                            duration,
                            label: `${hour.toString().padStart(2, '0')}:00`
                        })).filter(item => item.duration > 0);

                        setTimeOfDayData(timeOfDayStats);
                    } catch (error) {
                        console.error("Error fetching weekly data:", error);
                    }
                };

                fetchWeeklyData();
            }, [db, userId, appId, viewMode]);

            const handleDeleteSession = async (sessionId) => {
                if (window.confirm("Are you sure you want to delete this session? This cannot be undone.")) {
                    try {
                        const sessionDocRef = window.doc(db, `/artifacts/${appId}/users/${userId}/sessions/${sessionId}`);
                        await window.deleteDoc(sessionDocRef);
                        setNotification({ type: 'success', message: 'Session deleted successfully.' });
                        // Refresh data after deletion
                        const [year, monthNum] = month.split('-').map(Number);
                        const startDate = new Date(year, monthNum - 1, 1);
                        const endDate = new Date(year, monthNum, 0, 23, 59, 59);
                        const sessionsQuery = window.query(
                            window.collection(db, `/artifacts/${appId}/users/${userId}/sessions`),
                            window.where('startTime', '>=', window.Timestamp.fromDate(startDate)),
                            window.where('startTime', '<=', window.Timestamp.fromDate(endDate))
                        );
                        const snapshot = await window.getDocs(sessionsQuery);
                        const monthlySessions = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
                        monthlySessions.sort((a,b) => b.startTime.toMillis() - a.startTime.toMillis());
                        setSessions(monthlySessions);
                        const data = monthlySessions.reduce((acc, session) => {
                            acc[session.habitName] = (acc[session.habitName] || 0) + session.duration;
                            return acc;
                        }, {});
                        const formattedData = Object.entries(data).map(([name, duration]) => ({ name, duration }));
                        setReportData(formattedData);
                    } catch (error) {
                        console.error("Error deleting session:", error);
                        setNotification({ type: 'error', message: 'Failed to delete session.' });
                    }
                }
            };

            const maxDuration = Math.max(...reportData.map(d => d.duration), 0);
            const maxWeeklyHours = Math.max(...weeklyData.map(w => w.totalHours), 0);
            const maxTimeOfDay = Math.max(...timeOfDayData.map(t => t.duration), 0);
            const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'];

            return React.createElement('div', { className: "max-w-7xl mx-auto p-4 sm:p-6 lg:p-8" },
                React.createElement('h2', { className: "text-3xl text-gray-800 mb-4", style: { fontWeight: 300 } }, "reports"),

                // View toggle buttons
                React.createElement('div', { className: "mb-6 flex gap-2" },
                    React.createElement('button', {
                        onClick: () => setViewMode('monthly'),
                        className: `px-4 py-2 rounded-lg transition ${viewMode === 'monthly' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
                    }, "monthly"),
                    React.createElement('button', {
                        onClick: () => setViewMode('weekly'),
                        className: `px-4 py-2 rounded-lg transition ${viewMode === 'weekly' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
                    }, "weekly")
                ),

                // Month selector (only for monthly view)
                viewMode === 'monthly' && React.createElement('div', { className: "mb-6" },
                    React.createElement('label', { htmlFor: "month-select", className: "mr-2", style: { fontWeight: 400 } }, "select month:"),
                    React.createElement('input', {
                        type: "month",
                        id: "month-select",
                        value: month,
                        onChange: e => setMonth(e.target.value),
                        className: "p-2 border border-gray-300 rounded-lg"
                    })
                ),

                // Monthly view
                viewMode === 'monthly' && (isLoading ?
                    React.createElement('div', { className: "flex justify-center items-center p-8" },
                        React.createElement(LoaderIcon),
                        React.createElement('span', { className: "ml-2" }, "generating report...")
                    ) :
                    React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-8" },
                        // Chart Section
                        React.createElement('div', { className: "bg-white p-6 rounded-lg shadow-sm" },
                            React.createElement('h3', { className: "text-xl mb-4", style: { fontWeight: 300 } }, "habit totals"),
                            React.createElement('div', { className: "space-y-4" },
                                reportData.length > 0 ? reportData.map((item, index) =>
                                    React.createElement('div', { key: item.name },
                                        React.createElement('div', { className: "flex justify-between mb-1 text-sm", style: { fontWeight: 400 } },
                                            React.createElement('span', null, item.name),
                                            React.createElement('span', null, formatTime(item.duration))
                                        ),
                                        React.createElement('div', { className: "w-full bg-gray-200 rounded-full h-4" },
                                            React.createElement('div', {
                                                className: `${colors[index % colors.length]} h-4 rounded-full`,
                                                style: { width: `${maxDuration > 0 ? (item.duration / maxDuration) * 100 : 0}%` }
                                            })
                                        )
                                    )
                                ) : React.createElement('p', null, "no data for this month.")
                            )
                        ),

                        // Sessions List
                        React.createElement('div', { className: "bg-white p-4 rounded-lg shadow-sm" },
                            React.createElement('h3', { className: "text-xl mb-4", style: { fontWeight: 300 } }, "session log"),
                            React.createElement('div', { className: "space-y-3 max-h-[400px] overflow-y-auto" },
                                sessions.length > 0 ? sessions.map(session =>
                                    React.createElement('div', { key: session.id, className: "border-b pb-2 last:border-b-0 flex items-center justify-between gap-2" },
                                        React.createElement('div', { className: "flex-grow" },
                                            React.createElement('p', { style: { fontWeight: 400 } }, session.habitName),
                                            React.createElement('div', { className: "flex justify-between text-sm text-gray-600" },
                                                React.createElement('span', null, formatDate(session.startTime)),
                                                React.createElement('span', null, formatTime(session.duration))
                                            )
                                        ),
                                        React.createElement('button', {
                                            onClick: () => handleDeleteSession(session.id),
                                            className: "p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition flex-shrink-0",
                                            title: "Delete session"
                                        },
                                            React.createElement(TrashIcon)
                                        )
                                    )
                                ) :
                                React.createElement('p', { className: "text-gray-500" }, "no sessions recorded this month.")
                            )
                        )
                    )
                ),

                // Weekly view
                viewMode === 'weekly' && React.createElement('div', { className: "space-y-8" },
                    // Weekly hours over time
                    React.createElement('div', { className: "bg-white p-6 rounded-lg shadow-sm" },
                        React.createElement('h3', { className: "text-xl mb-4", style: { fontWeight: 300 } }, "weekly hours (last 8 weeks)"),
                        React.createElement('div', { className: "space-y-3" },
                            weeklyData.length > 0 ? weeklyData.map((week, index) =>
                                React.createElement('div', { key: index },
                                    React.createElement('div', { className: "flex justify-between mb-1 text-sm", style: { fontWeight: 400 } },
                                        React.createElement('span', null,
                                            `${week.weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${week.weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                                        ),
                                        React.createElement('span', null, `${week.totalHours.toFixed(1)}h`)
                                    ),
                                    React.createElement('div', { className: "w-full bg-gray-200 rounded-full h-4" },
                                        React.createElement('div', {
                                            className: "bg-blue-500 h-4 rounded-full",
                                            style: { width: `${maxWeeklyHours > 0 ? (week.totalHours / maxWeeklyHours) * 100 : 0}%` }
                                        })
                                    )
                                )
                            ) : React.createElement('p', { className: "text-gray-500" }, "no data available.")
                        )
                    ),

                    // Time of day analysis
                    timeOfDayData.length > 0 && React.createElement('div', { className: "bg-white p-6 rounded-lg shadow-sm" },
                        React.createElement('h3', { className: "text-xl mb-4", style: { fontWeight: 300 } }, "time of day analysis"),
                        React.createElement('p', { className: "text-sm text-gray-600 mb-4" },
                            `you study most at ${timeOfDayData.reduce((max, item) => item.duration > max.duration ? item : max, timeOfDayData[0]).label}`
                        ),
                        React.createElement('div', { className: "space-y-2" },
                            timeOfDayData.sort((a, b) => b.duration - a.duration).slice(0, 10).map((item, index) =>
                                React.createElement('div', { key: item.hour },
                                    React.createElement('div', { className: "flex justify-between mb-1 text-sm", style: { fontWeight: 400 } },
                                        React.createElement('span', null, item.label),
                                        React.createElement('span', null, formatTime(item.duration))
                                    ),
                                    React.createElement('div', { className: "w-full bg-gray-200 rounded-full h-3" },
                                        React.createElement('div', {
                                            className: `${colors[index % colors.length]} h-3 rounded-full`,
                                            style: { width: `${maxTimeOfDay > 0 ? (item.duration / maxTimeOfDay) * 100 : 0}%` }
                                        })
                                    )
                                )
                            )
                        )
                    )
                )
            );
        };

        const Settings = ({ auth, userId, db, userProfile, setNotification, isNightMode, setIsNightMode }) => {
            const [username, setUsername] = useState('');
            const [isEditingUsername, setIsEditingUsername] = useState(false);
            const [showResetConfirm, setShowResetConfirm] = useState(false);
            const [isResetting, setIsResetting] = useState(false);
            const [usernameToDelete, setUsernameToDelete] = useState('');
            const [isDeleting, setIsDeleting] = useState(false);
            const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

            useEffect(() => {
                if (userProfile?.username) {
                    setUsername(userProfile.username);
                }
            }, [userProfile]);

            const handleSaveUsername = async () => {
                if (!username.trim() || username === userProfile?.username) {
                    setIsEditingUsername(false);
                    return;
                }

                try {
                    const usersQuery = window.query(
                        window.collection(db, 'users'),
                        window.where('username', '==', username.trim())
                    );
                    const snapshot = await window.getDocs(usersQuery);

                    if (!snapshot.empty && snapshot.docs[0].id !== userId) {
                        setNotification({ type: 'error', message: 'Username already taken.' });
                        setUsername(userProfile?.username || '');
                        setIsEditingUsername(false);
                        return;
                    }

                    const userDocRef = window.doc(db, 'users', userId);
                    await window.setDoc(userDocRef, {
                        username: username.trim()
                    }, { merge: true });

                    setNotification({ type: 'success', message: 'Username updated!' });
                    setIsEditingUsername(false);
                } catch (error) {
                    console.error("Error updating username:", error);
                    setNotification({ type: 'error', message: 'Failed to update username.' });
                    setIsEditingUsername(false);
                }
            };

            const handleLogout = () => {
                window.signOut(auth);
            };

            const handleResetProgress = async () => {
                setIsResetting(true);
                try {
                    const appId = typeof __app_id !== 'undefined' ? __app_id : 'study-tracker-app';
                    const batch = window.writeBatch(db);

                    // Delete all sessions
                    const sessionsQuery = window.query(
                        window.collection(db, `artifacts/${appId}/users/${userId}/sessions`)
                    );
                    const sessionsSnapshot = await window.getDocs(sessionsQuery);
                    sessionsSnapshot.forEach(doc => {
                        batch.delete(doc.ref);
                    });

                    // Delete all habits
                    const habitsQuery = window.query(
                        window.collection(db, `artifacts/${appId}/users/${userId}/habits`)
                    );
                    const habitsSnapshot = await window.getDocs(habitsQuery);
                    habitsSnapshot.forEach(doc => {
                        batch.delete(doc.ref);
                    });

                    // Delete all goals
                    const goalsQuery = window.query(
                        window.collection(db, `artifacts/${appId}/users/${userId}/goals`)
                    );
                    const goalsSnapshot = await window.getDocs(goalsQuery);
                    goalsSnapshot.forEach(doc => {
                        batch.delete(doc.ref);
                    });

                    // Reset user document stats
                    const userDocRef = window.doc(db, `artifacts/${appId}/users/${userId}`);
                    batch.set(userDocRef, {
                        treeName: '',
                        treeType: 'seedling',
                        updatedAt: window.Timestamp.now()
                    }, { merge: true });

                    // Reset user profile stats
                    const userProfileRef = window.doc(db, 'users', userId);
                    batch.set(userProfileRef, {
                        stats: {
                            totalHours: 0,
                            currentStreak: 0,
                            totalSessions: 0,
                            goalsCompleted: 0,
                            treeLevel: 0,
                            lastUpdated: window.Timestamp.now()
                        }
                    }, { merge: true });

                    await batch.commit();

                    setNotification({ type: 'success', message: 'All progress has been reset!' });
                    setShowResetConfirm(false);

                    // Reload page after 1 second to show fresh state
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } catch (error) {
                    console.error("Error resetting progress:", error);
                    setNotification({ type: 'error', message: 'Failed to reset progress: ' + error.message });
                } finally {
                    setIsResetting(false);
                }
            };

            const handleDeleteUser = async () => {
                if (!usernameToDelete.trim()) {
                    setNotification({ type: 'error', message: 'Please enter a username.' });
                    return;
                }

                setIsDeleting(true);
                try {
                    const functions = window.getFunctions();
                    const deleteUserByUsername = window.httpsCallable(functions, 'deleteUserByUsername');

                    const result = await deleteUserByUsername({ username: usernameToDelete.trim() });

                    setNotification({ type: 'success', message: result.data.message });
                    setUsernameToDelete('');
                    setShowDeleteConfirm(false);
                } catch (error) {
                    console.error("Error deleting user:", error);
                    setNotification({ type: 'error', message: error.message || 'Failed to delete user.' });
                } finally {
                    setIsDeleting(false);
                }
            };

            return React.createElement('div', { className: "max-w-4xl mx-auto p-4 sm:p-6 lg:p-8" },
                React.createElement('h2', { className: "text-3xl text-gray-800 mb-6", style: { fontWeight: 300 } }, "settings"),

                // Profile Section
                React.createElement('div', { className: "bg-white rounded-lg shadow-sm p-6 mb-6" },
                    React.createElement('h3', { className: "text-xl text-gray-700 mb-4", style: { fontWeight: 400 } }, "profile"),
                    React.createElement('div', { className: "space-y-3" },
                        React.createElement('div', { className: "flex justify-between items-center py-2 border-b" },
                            React.createElement('span', { className: "text-gray-600" }, "Username:"),
                            isEditingUsername ?
                                React.createElement('input', {
                                    type: "text",
                                    value: username,
                                    onChange: (e) => setUsername(e.target.value),
                                    onBlur: handleSaveUsername,
                                    onKeyPress: (e) => e.key === 'Enter' && handleSaveUsername(),
                                    autoFocus: true,
                                    className: "border px-2 py-1 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none",
                                    placeholder: "username"
                                }) :
                                React.createElement('span', {
                                    className: "text-gray-800 cursor-pointer hover:text-blue-600 transition",
                                    onClick: () => setIsEditingUsername(true),
                                    title: "Click to edit"
                                }, `@${userProfile?.username || 'loading...'}`)
                        ),
                        React.createElement('div', { className: "flex justify-between items-center py-2" },
                            React.createElement('span', { className: "text-gray-600" }, "Friend Code:"),
                            React.createElement('span', { className: "font-mono text-sm text-gray-800" }, userProfile?.friendCode || 'Loading...')
                        )
                    )
                ),

                // Night Mode Section - Toggle Switch
                React.createElement('div', { className: "bg-white rounded-lg shadow-sm p-6 mb-6" },
                    React.createElement('div', { className: "flex justify-between items-center" },
                        React.createElement('h3', { className: "text-xl text-gray-700", style: { fontWeight: 400 } }, "appearance"),
                        React.createElement('button', {
                            onClick: (e) => {
                                e.preventDefault();
                                setIsNightMode(!isNightMode);
                            },
                            className: "relative inline-flex items-center rounded-full transition-all duration-300",
                            style: {
                                cursor: 'pointer',
                                width: '80px',
                                height: '36px',
                                backgroundColor: isNightMode ? '#1e293b' : '#e5e7eb',
                                padding: '2px'
                            }
                        },
                            React.createElement('div', {
                                className: "absolute flex items-center justify-center rounded-full bg-white shadow-md transition-all duration-300",
                                style: {
                                    width: '32px',
                                    height: '32px',
                                    transform: isNightMode ? 'translateX(44px)' : 'translateX(0px)'
                                }
                            },
                                React.createElement('svg', {
                                    xmlns: "http://www.w3.org/2000/svg",
                                    width: "16",
                                    height: "16",
                                    viewBox: "0 0 24 24",
                                    fill: "none",
                                    stroke: isNightMode ? '#60a5fa' : '#f59e0b',
                                    strokeWidth: "2.5",
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round"
                                },
                                    isNightMode ?
                                        React.createElement('path', { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" }) :
                                        React.createElement(React.Fragment, null,
                                            React.createElement('circle', { cx: "12", cy: "12", r: "5" }),
                                            React.createElement('line', { x1: "12", y1: "1", x2: "12", y2: "3" }),
                                            React.createElement('line', { x1: "12", y1: "21", x2: "12", y2: "23" }),
                                            React.createElement('line', { x1: "4.22", y1: "4.22", x2: "5.64", y2: "5.64" }),
                                            React.createElement('line', { x1: "18.36", y1: "18.36", x2: "19.78", y2: "19.78" }),
                                            React.createElement('line', { x1: "1", y1: "12", x2: "3", y2: "12" }),
                                            React.createElement('line', { x1: "21", y1: "12", x2: "23", y2: "12" }),
                                            React.createElement('line', { x1: "4.22", y1: "19.78", x2: "5.64", y2: "18.36" }),
                                            React.createElement('line', { x1: "18.36", y1: "5.64", x2: "19.78", y2: "4.22" })
                                        )
                                )
                            )
                        )
                    )
                ),

                // Install App Section
                React.createElement('div', { className: "bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-sm p-6 mb-6 border border-blue-100" },
                    React.createElement('div', { className: "flex items-start gap-4" },
                        React.createElement('div', { className: "flex-shrink-0 mt-1" },
                            React.createElement('svg', {
                                xmlns: "http://www.w3.org/2000/svg",
                                width: "32",
                                height: "32",
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "#6B8DD6",
                                strokeWidth: "2",
                                strokeLinecap: "round",
                                strokeLinejoin: "round"
                            },
                                React.createElement('path', { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
                                React.createElement('polyline', { points: "7 10 12 15 17 10" }),
                                React.createElement('line', { x1: "12", y1: "15", x2: "12", y2: "3" })
                            )
                        ),
                        React.createElement('div', { className: "flex-1" },
                            React.createElement('h3', { className: "text-xl text-gray-800 mb-2", style: { fontWeight: 500 } }, "install nous app"),
                            React.createElement('p', { className: "text-gray-600 text-sm mb-4", style: { fontWeight: 300 } },
                                "Install Nous on your device for quick access, offline support, and a native app experience."
                            ),
                            React.createElement('div', { className: "space-y-3" },
                                React.createElement('div', { className: "bg-white rounded-lg p-4" },
                                    React.createElement('p', { className: "text-sm font-medium text-gray-700 mb-2" }, "on mobile (Safari/Chrome):"),
                                    React.createElement('ol', { className: "text-sm text-gray-600 space-y-1 list-decimal list-inside", style: { fontWeight: 300 } },
                                        React.createElement('li', null, "Look at the ", React.createElement('strong', null, "top-right corner"), " next to the URL"),
                                        React.createElement('li', null, "Tap the ", React.createElement('strong', null, "Share icon"), " (square with arrow up)"),
                                        React.createElement('li', null, "Scroll down and tap ", React.createElement('strong', null, "\"Add to Home Screen\"")),
                                        React.createElement('li', null, "Tap ", React.createElement('strong', null, "\"Add\""), " to confirm"),
                                        React.createElement('li', null, "Find Nous icon on your home screen")
                                    ),
                                    React.createElement('p', { className: "text-xs text-gray-500 mt-2" }, "Works on Chrome and Safari browsers")
                                ),
                                React.createElement('div', { className: "bg-white rounded-lg p-4" },
                                    React.createElement('p', { className: "text-sm font-medium text-gray-700 mb-2" }, "on desktop:"),
                                    React.createElement('ol', { className: "text-sm text-gray-600 space-y-1 list-decimal list-inside", style: { fontWeight: 300 } },
                                        React.createElement('li', null, "Look for the install icon in your browser's address bar"),
                                        React.createElement('li', null, "Or click the ", React.createElement('strong', null, "\"Install App\""), " button below"),
                                        React.createElement('li', null, "App opens in its own window")
                                    )
                                )
                            )
                        )
                    )
                ),

                // Account Information Section
                React.createElement('div', { className: "bg-white rounded-lg shadow-sm p-6 mb-6" },
                    React.createElement('h3', { className: "text-xl text-gray-700 mb-4", style: { fontWeight: 400 } }, "account information"),
                    React.createElement('div', { className: "space-y-3" },
                        React.createElement('div', { className: "flex justify-between items-center py-2 border-b" },
                            React.createElement('span', { className: "text-gray-600" }, "User ID:"),
                            React.createElement('span', { className: "font-mono text-sm text-gray-800 truncate ml-4" }, userId)
                        ),
                        React.createElement('div', { className: "flex justify-between items-center py-2 border-b" },
                            React.createElement('span', { className: "text-gray-600" }, "Email:"),
                            React.createElement('span', { className: "text-gray-800" }, auth.currentUser?.email || 'Guest User')
                        ),
                        React.createElement('div', { className: "flex justify-between items-center py-2" },
                            React.createElement('span', { className: "text-gray-600" }, "Account Type:"),
                            React.createElement('span', { className: "text-gray-800" }, auth.currentUser?.isAnonymous ? 'Guest' : 'Registered')
                        )
                    )
                ),

                // Admin Panel (only shown to admins)
                userProfile?.admin && React.createElement('div', { className: "bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg shadow-sm p-6 mb-6" },
                    React.createElement('h3', { className: "text-xl text-red-700 dark:text-red-300 mb-4 flex items-center gap-2", style: { fontWeight: 500 } },
                        React.createElement('span', null, '🛡️'),
                        "admin panel"
                    ),
                    React.createElement('p', { className: "text-sm text-red-600 dark:text-red-400 mb-4", style: { fontWeight: 300 } },
                        "Warning: These actions are permanent and cannot be undone."
                    ),
                    React.createElement('div', { className: "space-y-4" },
                        React.createElement('div', null,
                            React.createElement('label', { className: "block text-gray-700 dark:text-gray-300 mb-2", style: { fontWeight: 400 } }, "Delete user by username:"),
                            React.createElement('div', { className: "flex gap-2" },
                                React.createElement('input', {
                                    type: "text",
                                    value: usernameToDelete,
                                    onChange: (e) => setUsernameToDelete(e.target.value),
                                    placeholder: "Enter username to delete",
                                    className: "flex-1 border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
                                    style: { fontWeight: 300 }
                                }),
                                React.createElement('button', {
                                    onClick: () => setShowDeleteConfirm(true),
                                    disabled: !usernameToDelete.trim() || isDeleting,
                                    className: "bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed",
                                    style: { fontWeight: 400 }
                                }, "Delete User")
                            )
                        )
                    )
                ),

                // Actions Section
                React.createElement('div', { className: "bg-white rounded-lg shadow-sm p-6" },
                    React.createElement('h3', { className: "text-xl text-gray-700 mb-4", style: { fontWeight: 400 } }, "actions"),
                    React.createElement('div', { className: "space-y-3" },
                        React.createElement('button', {
                            onClick: handleLogout,
                            className: "w-full sm:w-auto bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2",
                            style: { fontWeight: 400 }
                        },
                            React.createElement(LogOutIcon),
                            "sign out"
                        ),
                        React.createElement('button', {
                            onClick: () => setShowResetConfirm(true),
                            className: "w-full sm:w-auto bg-gray-700 text-white py-2 px-6 rounded-lg hover:bg-gray-800 transition flex items-center justify-center gap-2",
                            style: { fontWeight: 400 }
                        },
                            React.createElement(XIcon),
                            "reset all progress"
                        )
                    )
                ),

                // Reset Confirmation Modal
                showResetConfirm && React.createElement('div', {
                    className: "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50",
                    onClick: () => !isResetting && setShowResetConfirm(false)
                },
                    React.createElement('div', {
                        className: "bg-white rounded-xl p-8 max-w-md m-4 soft-shadow-lg",
                        onClick: (e) => e.stopPropagation()
                    },
                        React.createElement('h3', {
                            className: "text-2xl text-gray-800 mb-4",
                            style: { fontWeight: 400 }
                        }, "are you sure?"),
                        React.createElement('p', {
                            className: "text-gray-600 mb-6",
                            style: { fontWeight: 300 }
                        }, "This will permanently delete all your habits, sessions, goals, and reset your tree progress. This action cannot be undone."),
                        React.createElement('div', { className: "flex gap-3 justify-end" },
                            React.createElement('button', {
                                onClick: () => setShowResetConfirm(false),
                                disabled: isResetting,
                                className: "px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50",
                                style: { fontWeight: 400 }
                            }, "cancel"),
                            React.createElement('button', {
                                onClick: handleResetProgress,
                                disabled: isResetting,
                                className: "px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2",
                                style: { fontWeight: 400 }
                            },
                                isResetting && React.createElement(LoaderIcon),
                                isResetting ? "resetting..." : "yes, reset everything"
                            )
                        )
                    )
                ),

                // Delete User Confirmation Modal
                showDeleteConfirm && React.createElement('div', {
                    className: "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50",
                    onClick: () => !isDeleting && setShowDeleteConfirm(false)
                },
                    React.createElement('div', {
                        className: "bg-white rounded-xl p-8 max-w-md m-4 soft-shadow-lg",
                        onClick: (e) => e.stopPropagation()
                    },
                        React.createElement('h3', {
                            className: "text-2xl text-red-700 mb-4 flex items-center gap-2",
                            style: { fontWeight: 500 }
                        },
                            React.createElement('span', null, '⚠️'),
                            "delete user account?"
                        ),
                        React.createElement('p', {
                            className: "text-gray-600 mb-4",
                            style: { fontWeight: 300 }
                        }, `Are you sure you want to permanently delete the user "@${usernameToDelete}"?`),
                        React.createElement('p', {
                            className: "text-red-600 text-sm mb-6",
                            style: { fontWeight: 400 }
                        }, "This will delete their account, all data, sessions, habits, friendships, and remove them from Firebase Authentication. This action CANNOT be undone."),
                        React.createElement('div', { className: "flex gap-3 justify-end" },
                            React.createElement('button', {
                                onClick: () => setShowDeleteConfirm(false),
                                disabled: isDeleting,
                                className: "px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50",
                                style: { fontWeight: 400 }
                            }, "cancel"),
                            React.createElement('button', {
                                onClick: handleDeleteUser,
                                disabled: isDeleting,
                                className: "px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2",
                                style: { fontWeight: 400 }
                            },
                                isDeleting && React.createElement(LoaderIcon),
                                isDeleting ? "deleting..." : "yes, delete user"
                            )
                        )
                    )
                )
            );
        };

        // About Component - Information about Nous philosophy and the app
        const About = () => {
            return React.createElement('div', { className: "max-w-4xl mx-auto p-4 sm:p-6 lg:p-8" },
                React.createElement('div', { className: "text-center mb-8" },
                    React.createElement('h1', { className: "text-4xl text-calm-800", style: { fontWeight: 300, letterSpacing: '0.05em' } }, "about")
                ),

                // Philosophy Section
                React.createElement('div', { className: "bg-white rounded-xl soft-shadow p-8 mb-6" },
                    React.createElement('h2', { className: "text-2xl text-calm-800 mb-4", style: { fontWeight: 400 } }, "what is nous?"),
                    React.createElement('div', { className: "space-y-4 text-calm-700", style: { lineHeight: '1.8' } },
                        React.createElement('p', { style: { fontWeight: 300 } },
                            "In ancient Greek philosophy, ",
                            React.createElement('span', { className: "italic text-accent-blue", style: { fontWeight: 400 } }, "nous"),
                            " (νοῦς) represents the highest form of intellect—the faculty of intuitive understanding and contemplative reason. It is the part of us that grasps fundamental truths, sees patterns, and comprehends the essence of things."
                        ),
                        React.createElement('p', { style: { fontWeight: 300 } },
                            "Aristotle described nous as the aspect of mind that allows us to understand first principles. Plato saw it as the eye of the soul, the capacity for deep insight and clear thinking."
                        )
                    )
                ),

                // How Nous Helps Section
                React.createElement('div', { className: "bg-white rounded-xl soft-shadow p-8 mb-6" },
                    React.createElement('h2', { className: "text-2xl text-calm-800 mb-4", style: { fontWeight: 400 } }, "cultivating your nous"),
                    React.createElement('div', { className: "space-y-6" },
                        React.createElement('div', null,
                            React.createElement('h3', { className: "text-lg text-accent-blue mb-2", style: { fontWeight: 400 } }, "mindful habit building"),
                            React.createElement('p', { className: "text-calm-700", style: { fontWeight: 300, lineHeight: '1.8' } },
                                "Nous helps you build habits with intention and awareness. By tracking your time and progress, you develop a clearer understanding of how you spend your days—the foundation of a well-lived life."
                            )
                        ),
                        React.createElement('div', null,
                            React.createElement('h3', { className: "text-lg text-accent-blue mb-2", style: { fontWeight: 400 } }, "growth through reflection"),
                            React.createElement('p', { className: "text-calm-700", style: { fontWeight: 300, lineHeight: '1.8' } },
                                "Like a tree growing from consistent nourishment, your skills and character develop through steady, deliberate practice. Nous visualizes this growth, helping you see the cumulative power of small, daily actions."
                            )
                        ),
                        React.createElement('div', null,
                            React.createElement('h3', { className: "text-lg text-accent-blue mb-2", style: { fontWeight: 400 } }, "purposeful living"),
                            React.createElement('p', { className: "text-calm-700", style: { fontWeight: 300, lineHeight: '1.8' } },
                                "By setting goals and tracking progress, you align your daily actions with your deeper aspirations."
                            )
                        ),
                        React.createElement('div', null,
                            React.createElement('h3', { className: "text-lg text-accent-blue mb-2", style: { fontWeight: 400 } }, "community and connection"),
                            React.createElement('p', { className: "text-calm-700", style: { fontWeight: 300, lineHeight: '1.8' } },
                                "Connect with friends, share your journey, and inspire each other toward excellence. Together, we cultivate wisdom and support each other's flourishing."
                            )
                        )
                    )
                ),

                // Quote Section
                React.createElement('div', { className: "bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 mb-6 border-l-4", style: { borderColor: '#6B8DD6' } },
                    React.createElement('blockquote', { className: "text-center" },
                        React.createElement('p', { className: "text-xl text-calm-800 italic mb-3", style: { fontWeight: 300, lineHeight: '1.8' } },
                            '"We are what we repeatedly do. Excellence, then, is not an act, but a habit."'
                        ),
                        React.createElement('cite', { className: "text-calm-600", style: { fontWeight: 300 } }, "— Aristotle")
                    )
                )
            );
        };

        // Growth Tree Component - Aesthetic visualization of study progress
        const GrowthTree = ({ sessions, db, userId, setNotification }) => {
            const [treeName, setTreeName] = useState('my tree');
            const [selectedTreeType, setSelectedTreeType] = useState('seedling');
            const [isEditingName, setIsEditingName] = useState(false);
            const [tempName, setTempName] = useState('');

            const appId = typeof __app_id !== 'undefined' ? __app_id : 'study-tracker-app';

            // Calculate growth metrics
            const totalHours = calculateTotalHours(sessions);
            const unlockedTrees = getUnlockedTrees(totalHours);
            const currentTree = TREE_TYPES.find(t => t.id === selectedTreeType) || TREE_TYPES[0];
            const growthPercent = getTreeGrowth(totalHours, currentTree);

            // Load tree preferences
            useEffect(() => {
                if (!db || !userId) return;
                const userDoc = window.doc(db, `artifacts/${appId}/users/${userId}`);
                window.onSnapshot(userDoc, (snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.data();
                        if (data.treeName) setTreeName(data.treeName);
                        if (data.treeType) setSelectedTreeType(data.treeType);
                    }
                });
            }, [db, userId, appId]);

            // Save tree name
            const handleSaveName = async () => {
                if (tempName.trim()) {
                    try {
                        const userDoc = window.doc(db, `artifacts/${appId}/users/${userId}`);
                        await window.setDoc(userDoc, { treeName: tempName.trim(), treeType: selectedTreeType }, { merge: true });
                        setTreeName(tempName.trim());
                        setIsEditingName(false);
                    } catch (error) {
                        console.error("Error saving tree name:", error);
                    }
                }
            };

            // Change tree type
            const handleChangeTree = async (treeId) => {
                try {
                    const userDoc = window.doc(db, `artifacts/${appId}/users/${userId}`);
                    await window.setDoc(userDoc, { treeName: treeName, treeType: treeId }, { merge: true });
                    setSelectedTreeType(treeId);
                    setNotification({ type: 'success', message: `Changed to ${TREE_TYPES.find(t => t.id === treeId).name}!` });
                } catch (error) {
                    console.error("Error changing tree:", error);
                }
            };

            // Beautiful Tree SVG with crisp animations
            const TreeSVG = ({ growth, color, treeType }) => {
                const [animationKey, setAnimationKey] = useState(0);
                const prevGrowthRef = useRef(growth);
                const prevTreeTypeRef = useRef(treeType);

                // Trigger re-animation when growth increases significantly OR tree type changes
                useEffect(() => {
                    if (growth > prevGrowthRef.current + 5 || treeType !== prevTreeTypeRef.current) {
                        setAnimationKey(prev => prev + 1);
                    }
                    prevGrowthRef.current = growth;
                    prevTreeTypeRef.current = treeType;
                }, [growth, treeType]);

                // Calculate growth stages (0-1 normalized)
                const normalizedGrowth = Math.min(growth / 100, 1);
                const trunkGrowth = Math.min(normalizedGrowth / 0.2, 1); // 0-20%
                const branchGrowth = Math.max(0, Math.min((normalizedGrowth - 0.2) / 0.4, 1)); // 20-60%
                const leafGrowth = Math.max(0, Math.min((normalizedGrowth - 0.6) / 0.35, 1)); // 60-95%
                const fruitGrowth = normalizedGrowth >= 0.95 ? 1 : 0;

                // Get tree configuration from TREE_TYPES
                const treeConfig = TREE_TYPES.find(t => t.id === treeType) || TREE_TYPES[0];
                const leafColors = treeConfig.leafColors || ['#5DAE49', '#3E7C17', '#A1C349'];
                const leafShapes = treeConfig.leafShapes || ['oval', 'triangle'];
                const mainBranchColor = treeConfig.branchColor || '#5A3E1B';

                // Debug logging
                console.log('TreeSVG rendering with treeType:', treeType);
                console.log('Tree config:', treeConfig.name);
                console.log('Leaf colors:', leafColors);

                // Enhanced colors with depth and variety - tree-specific branch colors
                // Create REAL color variations for depth (not just using the same color!)
                const hexToRgb = (hex) => {
                    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                    return result ? {
                        r: parseInt(result[1], 16),
                        g: parseInt(result[2], 16),
                        b: parseInt(result[3], 16)
                    } : null;
                };

                const rgbToHex = (r, g, b) => {
                    return "#" + [r, g, b].map(x => {
                        const hex = Math.round(Math.max(0, Math.min(255, x))).toString(16);
                        return hex.length === 1 ? "0" + hex : hex;
                    }).join('');
                };

                const adjustColor = (hex, factor) => {
                    const rgb = hexToRgb(hex);
                    if (!rgb) return hex;
                    return rgbToHex(rgb.r * factor, rgb.g * factor, rgb.b * factor);
                };

                const addWarmth = (hex, amount) => {
                    const rgb = hexToRgb(hex);
                    if (!rgb) return hex;
                    return rgbToHex(rgb.r + amount, rgb.g + amount * 0.5, rgb.b);
                };

                const addCool = (hex, amount) => {
                    const rgb = hexToRgb(hex);
                    if (!rgb) return hex;
                    return rgbToHex(rgb.r, rgb.g + amount * 0.5, rgb.b + amount);
                };

                // Create actual color variations based on tree's branch color
                const trunkBase = mainBranchColor;
                const trunkDark = adjustColor(mainBranchColor, 0.6);        // 40% darker
                const trunkMid = mainBranchColor;                            // Base color
                const trunkLight = adjustColor(mainBranchColor, 1.3);       // 30% lighter
                const trunkGrey = addCool(mainBranchColor, -15);            // Cooler tone
                const trunkRed = addWarmth(mainBranchColor, 20);            // Warmer/reddish
                const trunkOrange = addWarmth(mainBranchColor, 35);         // More orange

                // Minecraft-inspired fruit colors (apples, berries, cocoa)
                const fruitColors = [
                    "#DC143C", // Apple red (drops from oak trees)
                    "#E74C3C", // Sweet berry red-orange
                    "#F9CA24", // Glow berry golden/amber
                ];

                // Enhanced branch paths with natural, realistic shapes
                const branches = [
                    // Main branches - larger, thicker, more natural curves
                    { d: "M100,120 Q82,110 70,90 Q65,80 60,68", width: 6, color: trunkDark, delay: 0, visible: branchGrowth > 0 },
                    { d: "M100,120 Q118,110 130,90 Q135,80 140,68", width: 6, color: trunkDark, delay: 0.05, visible: branchGrowth > 0.05 },

                    // Secondary main branches with organic curves
                    { d: "M100,115 Q78,105 68,88 Q62,76 58,64", width: 5, color: trunkMid, delay: 0.1, visible: branchGrowth > 0.15 },
                    { d: "M100,115 Q122,105 132,88 Q138,76 142,64", width: 5, color: trunkMid, delay: 0.15, visible: branchGrowth > 0.2 },

                    // Mid-level branches - varied angles
                    { d: "M70,90 Q65,82 62,72 Q60,65 58,58", width: 4, color: trunkMid, delay: 0.2, visible: branchGrowth > 0.3 },
                    { d: "M130,90 Q135,82 138,72 Q140,65 142,58", width: 4, color: trunkMid, delay: 0.22, visible: branchGrowth > 0.32 },
                    { d: "M100,110 Q88,98 80,82 Q76,72 72,60", width: 4, color: trunkLight, delay: 0.24, visible: branchGrowth > 0.35 },
                    { d: "M100,110 Q112,98 120,82 Q124,72 128,60", width: 4, color: trunkLight, delay: 0.26, visible: branchGrowth > 0.38 },

                    // Tertiary branches - creating fuller canopy
                    { d: "M68,88 Q62,80 58,70 Q55,62 52,54", width: 3, color: trunkLight, delay: 0.3, visible: branchGrowth > 0.45 },
                    { d: "M132,88 Q138,80 142,70 Q145,62 148,54", width: 3, color: trunkLight, delay: 0.32, visible: branchGrowth > 0.48 },
                    { d: "M80,82 Q74,74 70,64 Q67,56 64,48", width: 3, color: trunkGrey, delay: 0.34, visible: branchGrowth > 0.5 },
                    { d: "M120,82 Q126,74 130,64 Q133,56 136,48", width: 3, color: trunkGrey, delay: 0.36, visible: branchGrowth > 0.52 },

                    // Fine detail branches - natural extensions
                    { d: "M60,68 Q56,62 54,54 Q52,48 50,42", width: 2.5, color: trunkGrey, delay: 0.4, visible: branchGrowth > 0.6 },
                    { d: "M140,68 Q144,62 146,54 Q148,48 150,42", width: 2.5, color: trunkGrey, delay: 0.42, visible: branchGrowth > 0.62 },
                    { d: "M72,60 Q68,54 65,46 Q63,40 61,34", width: 2, color: trunkLight, delay: 0.44, visible: branchGrowth > 0.65 },
                    { d: "M128,60 Q132,54 135,46 Q137,40 139,34", width: 2, color: trunkLight, delay: 0.46, visible: branchGrowth > 0.68 },

                    // Extra small branches for density
                    { d: "M62,72 Q58,66 55,58", width: 2, color: trunkOrange, delay: 0.48, visible: branchGrowth > 0.72 },
                    { d: "M138,72 Q142,66 145,58", width: 2, color: trunkOrange, delay: 0.5, visible: branchGrowth > 0.75 },
                ];

                // ENHANCED: Leaves change as tree matures!
                // Young trees (0-50% growth): Lighter, fewer leaves
                // Mature trees (50-100% growth): Darker, lusher, more leaves
                const maturityFactor = normalizedGrowth; // 0 to 1

                // Darken leaves as tree matures
                const matureLeafColors = leafColors.map(color => {
                    if (maturityFactor < 0.5) {
                        // Young tree: lighter colors
                        return adjustColor(color, 1.2);
                    } else {
                        // Mature tree: richer, darker colors
                        const darkening = 0.8 + (maturityFactor - 0.5) * 0.4; // 0.8 to 1.0
                        return adjustColor(color, darkening);
                    }
                });

                // Helper: pick varied color for each leaf (not just sequential)
                const getLeafColor = (index) => {
                    // Use hash-like distribution for more variety
                    const colorIndex = (index * 7 + Math.floor(index / 3)) % matureLeafColors.length;
                    return matureLeafColors[colorIndex];
                };

                // Helper: pick varied SHAPE for each leaf - truly random pattern!
                const getLeafShape = (index) => {
                    // Create pseudo-random but consistent shape distribution
                    const shapePattern = [
                        'oval', 'circle', 'oval', 'triangle', 'circle',
                        'oval', 'diamond', 'circle', 'oval', 'rectangle',
                        'oval', 'circle', 'hexagon', 'oval', 'circle',
                        'oval', 'triangle', 'circle', 'oval', 'diamond',
                        'star', 'circle', 'oval', 'fan', 'oval',
                        'circle', 'heart', 'oval', 'triangle', 'oval',
                        'circle', 'oval', 'rectangle', 'oval', 'circle',
                        'diamond', 'oval', 'circle', 'oval', 'hexagon',
                        'oval', 'fan', 'circle', 'oval', 'star',
                        'oval', 'circle', 'heart', 'oval', 'triangle'
                    ];
                    // Use tree type and index for variety
                    const treeShapeIndex = (treeType.length * 7) % leafShapes.length;
                    const shapeIndex = (index * 11 + treeShapeIndex) % shapePattern.length;
                    return shapePattern[shapeIndex];
                };

                // Enhanced leaf positions with size, color, and SHAPE variety!
                const leaves = [
                    // Top cluster - crown of the tree (MIX of shapes)
                    { x: 100, y: 42, size: 16, color: getLeafColor(0), shape: 'oval', delay: 0, visible: leafGrowth > 0 },
                    { x: 94, y: 46, size: 14, color: getLeafColor(1), shape: 'circle', delay: 0.02, visible: leafGrowth > 0.03 },
                    { x: 106, y: 46, size: 14, color: getLeafColor(2), shape: 'triangle', delay: 0.04, visible: leafGrowth > 0.06 },
                    { x: 88, y: 50, size: 13, color: getLeafColor(3), shape: 'oval', delay: 0.06, visible: leafGrowth > 0.09 },
                    { x: 112, y: 50, size: 13, color: getLeafColor(4), shape: 'diamond', delay: 0.08, visible: leafGrowth > 0.12 },
                    { x: 100, y: 52, size: 12, color: getLeafColor(5), shape: 'circle', delay: 0.09, visible: leafGrowth > 0.14 },

                    // Upper canopy - dense foliage (VARIED SHAPES!)
                    { x: 82, y: 56, size: 15, color: getLeafColor(6), shape: 'rectangle', delay: 0.1, visible: leafGrowth > 0.16 },
                    { x: 118, y: 56, size: 15, color: getLeafColor(7), shape: 'oval', delay: 0.12, visible: leafGrowth > 0.18 },
                    { x: 75, y: 60, size: 14, color: getLeafColor(8), shape: 'hexagon', delay: 0.14, visible: leafGrowth > 0.2 },
                    { x: 125, y: 60, size: 14, color: getLeafColor(9), shape: 'circle', delay: 0.16, visible: leafGrowth > 0.22 },
                    { x: 90, y: 62, size: 13, color: getLeafColor(10), shape: 'oval', delay: 0.18, visible: leafGrowth > 0.24 },
                    { x: 110, y: 62, size: 13, color: getLeafColor(11), shape: 'triangle', delay: 0.2, visible: leafGrowth > 0.26 },
                    { x: 96, y: 58, size: 11, color: getLeafColor(12), shape: 'circle', delay: 0.21, visible: leafGrowth > 0.27 },
                    { x: 104, y: 58, size: 11, color: getLeafColor(13), shape: 'diamond', delay: 0.22, visible: leafGrowth > 0.28 },

                    // Middle section - widest part of canopy (MORE VARIETY!)
                    { x: 68, y: 66, size: 16, color: getLeafColor(14), shape: 'star', delay: 0.24, visible: leafGrowth > 0.3 },
                    { x: 132, y: 66, size: 16, color: getLeafColor(15), shape: 'oval', delay: 0.26, visible: leafGrowth > 0.32 },
                    { x: 78, y: 70, size: 15, color: getLeafColor(16), shape: 'circle', delay: 0.28, visible: leafGrowth > 0.34 },
                    { x: 122, y: 70, size: 15, color: getLeafColor(17), shape: 'fan', delay: 0.3, visible: leafGrowth > 0.36 },
                    { x: 60, y: 72, size: 14, color: getLeafColor(18), shape: 'oval', delay: 0.32, visible: leafGrowth > 0.38 },
                    { x: 140, y: 72, size: 14, color: getLeafColor(19), shape: 'heart', delay: 0.34, visible: leafGrowth > 0.4 },
                    { x: 88, y: 74, size: 13, color: getLeafColor(20), shape: 'circle', delay: 0.36, visible: leafGrowth > 0.42 },
                    { x: 112, y: 74, size: 13, color: getLeafColor(21), shape: 'triangle', delay: 0.38, visible: leafGrowth > 0.44 },
                    { x: 100, y: 76, size: 12, color: getLeafColor(22), shape: 'oval', delay: 0.4, visible: leafGrowth > 0.46 },
                    { x: 72, y: 76, size: 12, color: getLeafColor(23), shape: 'diamond', delay: 0.42, visible: leafGrowth > 0.48 },
                    { x: 128, y: 76, size: 12, color: getLeafColor(24), shape: 'circle', delay: 0.44, visible: leafGrowth > 0.5 },

                    // Lower-middle section (EVEN MORE SHAPES!)
                    { x: 64, y: 80, size: 14, color: getLeafColor(25), shape: 'oval', delay: 0.46, visible: leafGrowth > 0.52 },
                    { x: 136, y: 80, size: 14, color: getLeafColor(26), shape: 'hexagon', delay: 0.48, visible: leafGrowth > 0.54 },
                    { x: 76, y: 82, size: 13, color: getLeafColor(27), shape: 'circle', delay: 0.5, visible: leafGrowth > 0.56 },
                    { x: 124, y: 82, size: 13, color: getLeafColor(28), shape: 'oval', delay: 0.52, visible: leafGrowth > 0.58 },
                    { x: 84, y: 84, size: 12, color: getLeafColor(29), shape: 'rectangle', delay: 0.54, visible: leafGrowth > 0.6 },
                    { x: 116, y: 84, size: 12, color: getLeafColor(30), shape: 'oval', delay: 0.56, visible: leafGrowth > 0.62 },
                    { x: 94, y: 86, size: 11, color: getLeafColor(31), shape: 'circle', delay: 0.58, visible: leafGrowth > 0.64 },
                    { x: 106, y: 86, size: 11, color: getLeafColor(32), shape: 'triangle', delay: 0.6, visible: leafGrowth > 0.66 },

                    // Lower outer leaves - creating natural edge (FULL VARIETY!)
                    { x: 56, y: 76, size: 13, color: getLeafColor(33), shape: 'oval', delay: 0.62, visible: leafGrowth > 0.68 },
                    { x: 144, y: 76, size: 13, color: getLeafColor(34), shape: 'diamond', delay: 0.64, visible: leafGrowth > 0.7 },
                    { x: 62, y: 68, size: 12, color: getLeafColor(35), shape: 'circle', delay: 0.66, visible: leafGrowth > 0.72 },
                    { x: 138, y: 68, size: 12, color: getLeafColor(36), shape: 'oval', delay: 0.68, visible: leafGrowth > 0.74 },
                    { x: 70, y: 88, size: 11, color: getLeafColor(37), shape: 'fan', delay: 0.7, visible: leafGrowth > 0.76 },
                    { x: 130, y: 88, size: 11, color: getLeafColor(38), shape: 'circle', delay: 0.72, visible: leafGrowth > 0.78 },

                    // Fill gaps for fuller appearance (MAXIMUM VARIETY!)
                    { x: 80, y: 66, size: 10, color: getLeafColor(39), shape: 'oval', delay: 0.74, visible: leafGrowth > 0.8 },
                    { x: 120, y: 66, size: 10, color: getLeafColor(40), shape: 'star', delay: 0.76, visible: leafGrowth > 0.82 },
                    { x: 92, y: 68, size: 10, color: getLeafColor(41), shape: 'circle', delay: 0.78, visible: leafGrowth > 0.84 },
                    { x: 108, y: 68, size: 10, color: getLeafColor(42), shape: 'heart', delay: 0.8, visible: leafGrowth > 0.86 },
                    { x: 86, y: 78, size: 10, color: getLeafColor(43), shape: 'oval', delay: 0.82, visible: leafGrowth > 0.88 },
                    { x: 114, y: 78, size: 10, color: getLeafColor(44), shape: 'triangle', delay: 0.84, visible: leafGrowth > 0.9 },
                    { x: 98, y: 72, size: 9, color: getLeafColor(45), shape: 'circle', delay: 0.86, visible: leafGrowth > 0.92 },
                    { x: 102, y: 80, size: 9, color: getLeafColor(46), shape: 'oval', delay: 0.88, visible: leafGrowth > 0.94 },
                ];

                // Minecraft-style fruits (apples, sweet berries, glow berries) - hidden for seedlings and pine
                const fruits = (fruitGrowth > 0 && treeType !== 'seedling' && treeType !== 'pine') ? [
                    { x: 100, y: 55, size: 4, color: fruitColors[0], delay: 0 },      // Apple (red)
                    { x: 88, y: 62, size: 3.5, color: fruitColors[1], delay: 0.1 },   // Sweet berry (orange-red)
                    { x: 112, y: 62, size: 3.5, color: fruitColors[2], delay: 0.15 }, // Glow berry (golden)
                    { x: 78, y: 68, size: 3, color: fruitColors[0], delay: 0.2 },     // Apple
                    { x: 122, y: 68, size: 3, color: fruitColors[1], delay: 0.25 },   // Sweet berry
                    { x: 95, y: 70, size: 3.5, color: fruitColors[2], delay: 0.3 },   // Glow berry
                    { x: 105, y: 70, size: 3.5, color: fruitColors[0], delay: 0.35 }, // Apple
                ] : [];

                // Helper function to render different leaf shapes
                const renderLeafShape = (leaf, index) => {
                    // Use the SPECIFIC shape assigned to THIS leaf!
                    const shapeType = leaf.shape || 'oval';
                    // Add varied rotation for organic look (based on position)
                    const rotation = -25 + ((leaf.x + leaf.y) % 50); // More varied rotation

                    switch (shapeType) {
                        case 'circle':
                            return React.createElement('circle', {
                                cx: leaf.x,
                                cy: leaf.y,
                                r: leaf.size * 0.42,
                                fill: leaf.color,
                                opacity: 0.9,
                                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
                            });

                        case 'triangle':
                            const triangleSize = leaf.size * 0.5;
                            const h = triangleSize * Math.sqrt(3) / 2;
                            return React.createElement('polygon', {
                                points: `${leaf.x},${leaf.y - h} ${leaf.x - triangleSize/2},${leaf.y + h/2} ${leaf.x + triangleSize/2},${leaf.y + h/2}`,
                                fill: leaf.color,
                                transform: `rotate(${rotation} ${leaf.x} ${leaf.y})`,
                                opacity: 0.85
                            });

                        case 'rectangle':
                            return React.createElement('rect', {
                                x: leaf.x - leaf.size * 0.25,
                                y: leaf.y - leaf.size * 0.4,
                                width: leaf.size * 0.5,
                                height: leaf.size * 0.8,
                                fill: leaf.color,
                                rx: leaf.size * 0.1,
                                transform: `rotate(${rotation} ${leaf.x} ${leaf.y})`,
                                opacity: 0.85
                            });

                        case 'diamond':
                            const diamondSize = leaf.size * 0.35;
                            return React.createElement('polygon', {
                                points: `${leaf.x},${leaf.y - diamondSize} ${leaf.x + diamondSize},${leaf.y} ${leaf.x},${leaf.y + diamondSize} ${leaf.x - diamondSize},${leaf.y}`,
                                fill: leaf.color,
                                transform: `rotate(${rotation} ${leaf.x} ${leaf.y})`,
                                opacity: 0.85
                            });

                        case 'hexagon':
                            const hexSize = leaf.size * 0.3;
                            const hexHeight = hexSize * Math.sqrt(3);
                            return React.createElement('polygon', {
                                points: `${leaf.x},${leaf.y - hexHeight} ${leaf.x + hexSize * 0.866},${leaf.y - hexHeight/2} ${leaf.x + hexSize * 0.866},${leaf.y + hexHeight/2} ${leaf.x},${leaf.y + hexHeight} ${leaf.x - hexSize * 0.866},${leaf.y + hexHeight/2} ${leaf.x - hexSize * 0.866},${leaf.y - hexHeight/2}`,
                                fill: leaf.color,
                                transform: `rotate(${rotation} ${leaf.x} ${leaf.y})`,
                                opacity: 0.85
                            });

                        case 'heart':
                            // Heart shape using path
                            const heartSize = leaf.size * 0.4;
                            const heartPath = `M ${leaf.x},${leaf.y + heartSize * 0.3} C ${leaf.x},${leaf.y - heartSize * 0.5} ${leaf.x - heartSize * 0.5},${leaf.y - heartSize * 0.5} ${leaf.x - heartSize * 0.5},${leaf.y} C ${leaf.x - heartSize * 0.5},${leaf.y + heartSize * 0.5} ${leaf.x},${leaf.y + heartSize * 0.5} ${leaf.x},${leaf.y + heartSize * 0.3} C ${leaf.x},${leaf.y + heartSize * 0.5} ${leaf.x + heartSize * 0.5},${leaf.y + heartSize * 0.5} ${leaf.x + heartSize * 0.5},${leaf.y} C ${leaf.x + heartSize * 0.5},${leaf.y - heartSize * 0.5} ${leaf.x},${leaf.y - heartSize * 0.5} ${leaf.x},${leaf.y + heartSize * 0.3} Z`;
                            return React.createElement('path', {
                                d: heartPath,
                                fill: leaf.color,
                                opacity: 0.8
                            });

                        case 'star':
                            // 5-point star shape
                            const starSize = leaf.size * 0.35;
                            let points = [];
                            for (let i = 0; i < 10; i++) {
                                const angle = Math.PI / 2 + i * Math.PI / 5;
                                const radius = i % 2 === 0 ? starSize : starSize * 0.4;
                                const pointX = leaf.x + radius * Math.cos(angle);
                                const pointY = leaf.y - radius * Math.sin(angle);
                                points.push(`${pointX},${pointY}`);
                            }
                            return React.createElement('polygon', {
                                points: points.join(' '),
                                fill: leaf.color,
                                transform: `rotate(${rotation} ${leaf.x} ${leaf.y})`,
                                opacity: 0.8
                            });

                        case 'fan':
                            // Ginkgo-style fan shape
                            const fanPath = `M ${leaf.x},${leaf.y} Q ${leaf.x - leaf.size * 0.4},${leaf.y - leaf.size * 0.3} ${leaf.x - leaf.size * 0.5},${leaf.y - leaf.size * 0.5} L ${leaf.x - leaf.size * 0.3},${leaf.y - leaf.size * 0.6} Q ${leaf.x},${leaf.y - leaf.size * 0.4} ${leaf.x + leaf.size * 0.3},${leaf.y - leaf.size * 0.6} L ${leaf.x + leaf.size * 0.5},${leaf.y - leaf.size * 0.5} Q ${leaf.x + leaf.size * 0.4},${leaf.y - leaf.size * 0.3} ${leaf.x},${leaf.y} Z`;
                            return React.createElement('path', {
                                d: fanPath,
                                fill: leaf.color,
                                opacity: 0.85
                            });

                        case 'oval':
                        default:
                            return React.createElement('ellipse', {
                                cx: leaf.x,
                                cy: leaf.y,
                                rx: leaf.size * 0.35,
                                ry: leaf.size * 0.5,
                                fill: leaf.color,
                                transform: `rotate(${rotation} ${leaf.x} ${leaf.y})`,
                                opacity: 0.9,
                                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
                            });
                    }
                };

                // VISUAL PROGRESSION: Tree scales up as it grows!
                // 0% growth = 60% size (young sapling)
                // 100% growth = 100% size (mature tree)
                const treeScale = 0.6 + (normalizedGrowth * 0.4);

                return React.createElement('svg', {
                    viewBox: "0 0 200 200",
                    className: "w-full h-full",
                    key: `${treeType}-${animationKey}`,
                    style: { overflow: 'visible' }
                },
                    // Wrap entire tree in scaling group for visual progression
                    React.createElement('g', {
                        transform: `scale(${treeScale}) translate(${(1 - treeScale) * 100}, ${(1 - treeScale) * 100})`,
                        style: { transformOrigin: 'center' }
                    },
                    // Define reusable symbols for performance
                    React.createElement('defs', null,
                        // Leaf symbol
                        React.createElement('symbol', { id: 'leaf', viewBox: '0 0 10 10' },
                            React.createElement('ellipse', {
                                cx: "5", cy: "5", rx: "4", ry: "6",
                                fill: leafColors[0],
                                transform: "rotate(-20 5 5)"
                            })
                        ),
                        // Sparkle symbol
                        React.createElement('symbol', { id: 'sparkle', viewBox: '0 0 10 10' },
                            React.createElement('path', {
                                d: "M5,0 L6,4 L10,5 L6,6 L5,10 L4,6 L0,5 L4,4 Z",
                                fill: "#fbbf24",
                                opacity: "0.6"
                            })
                        ),
                        // Animation keyframes via CSS - enhanced for smoother motion
                        React.createElement('style', null, `
                            @keyframes sway {
                                0%, 100% { transform: rotate(-1.5deg); }
                                50% { transform: rotate(1.5deg); }
                            }
                            @keyframes leafPop {
                                0% { transform: scale(0) rotate(-10deg); opacity: 0; }
                                60% { transform: scale(1.2) rotate(5deg); opacity: 0.9; }
                                80% { transform: scale(0.95) rotate(-2deg); opacity: 1; }
                                100% { transform: scale(1) rotate(0deg); opacity: 1; }
                            }
                            @keyframes fruitGlow {
                                0%, 100% { opacity: 0.85; transform: scale(1); }
                                50% { opacity: 1; transform: scale(1.05); }
                            }
                            @keyframes branchGrow {
                                from { stroke-dashoffset: 50; }
                                to { stroke-dashoffset: 0; }
                            }
                            @media (prefers-reduced-motion: reduce) {
                                .tree-sway { animation: none !important; }
                                .leaf-pop { animation: none !important; opacity: 1 !important; transform: scale(1) !important; }
                                .branch-draw { animation: none !important; stroke-dashoffset: 0 !important; }
                            }
                        `)
                    ),

                    // Enhanced ground line with subtle grass appearance
                    React.createElement('g', null,
                        React.createElement('line', {
                            x1: "30", y1: "180", x2: "170", y2: "180",
                            stroke: "#86A789",
                            strokeWidth: "4",
                            strokeLinecap: "round",
                            opacity: "0.6"
                        }),
                        React.createElement('line', {
                            x1: "40", y1: "182", x2: "160", y2: "182",
                            stroke: "#5F8D4E",
                            strokeWidth: "2",
                            strokeLinecap: "round",
                            opacity: "0.4"
                        })
                    ),

                    // Main tree group with idle sway
                    React.createElement('g', {
                        className: trunkGrowth > 0.5 ? "tree-sway" : "",
                        style: {
                            transformOrigin: "100px 180px",
                            animation: trunkGrowth > 0.5 ? "sway 8s ease-in-out infinite" : "none",
                            willChange: "transform"
                        }
                    },
                        // Enhanced trunk with multiple colors for depth and texture
                        React.createElement('g', null,
                            // Base trunk (darkest) - main structure
                            React.createElement('path', {
                                d: "M100,180 Q98,150 97,120 Q96,90 100,80",
                                stroke: trunkDark,
                                strokeWidth: "10",
                                strokeLinecap: "round",
                                fill: "none",
                                strokeDasharray: trunkGrowth > 0 ? "100" : "0",
                                strokeDashoffset: trunkGrowth > 0 ? `${100 - (trunkGrowth * 100)}` : "100",
                                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                                style: {
                                    transition: "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                                    willChange: "stroke-dashoffset"
                                }
                            }),
                            // Middle layer for depth
                            React.createElement('path', {
                                d: "M99,180 Q97,150 96.5,120 Q95.5,90 99,80",
                                stroke: trunkMid,
                                strokeWidth: "6",
                                strokeLinecap: "round",
                                fill: "none",
                                strokeDasharray: trunkGrowth > 0 ? "100" : "0",
                                strokeDashoffset: trunkGrowth > 0 ? `${100 - (trunkGrowth * 100)}` : "100",
                                opacity: "0.8",
                                style: {
                                    transition: "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                                    willChange: "stroke-dashoffset"
                                }
                            }),
                            // Highlight on left side - gives it dimension
                            React.createElement('path', {
                                d: "M97,180 Q95.5,150 95,120 Q94.5,90 97.5,80",
                                stroke: trunkLight,
                                strokeWidth: "2.5",
                                strokeLinecap: "round",
                                fill: "none",
                                strokeDasharray: trunkGrowth > 0 ? "100" : "0",
                                strokeDashoffset: trunkGrowth > 0 ? `${100 - (trunkGrowth * 100)}` : "100",
                                opacity: "0.7",
                                style: {
                                    transition: "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                                    willChange: "stroke-dashoffset"
                                }
                            })
                        ),

                        // Enhanced branches with varied widths and colors
                        ...branches.map((branch, i) =>
                            branch.visible ? React.createElement('path', {
                                key: `branch-${i}`,
                                d: branch.d,
                                stroke: branch.color,
                                strokeWidth: branch.width.toString(),
                                strokeLinecap: "round",
                                fill: "none",
                                strokeDasharray: "50",
                                strokeDashoffset: "0",
                                className: "branch-draw",
                                style: {
                                    strokeDashoffset: `${50 - (branchGrowth * 50)}`,
                                    transition: `stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${branch.delay}s`,
                                    willChange: "stroke-dashoffset",
                                    opacity: 0.9
                                }
                            }) : null
                        ),

                        // Enhanced leaves with varied colors, sizes, and shapes
                        ...leaves.map((leaf, i) =>
                            leaf.visible ? React.createElement('g', {
                                key: `leaf-${i}`,
                                className: "leaf-pop",
                                style: {
                                    animation: `leafPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${leaf.delay}s both`,
                                    transformOrigin: `${leaf.x}px ${leaf.y}px`,
                                    willChange: "transform, opacity"
                                }
                            }, renderLeafShape(leaf, i)) : null
                        ),

                        // Enhanced fruits with varied colors, sizes, and details
                        ...fruits.map((fruit, i) =>
                            React.createElement('g', { key: `fruit-${i}` },
                                // Glow effect
                                React.createElement('circle', {
                                    cx: fruit.x,
                                    cy: fruit.y,
                                    r: fruit.size * 1.5,
                                    fill: fruit.color,
                                    opacity: "0.3",
                                    style: {
                                        filter: "blur(4px)",
                                        animation: "fruitGlow 2s ease-in-out infinite"
                                    }
                                }),
                                // Main fruit
                                React.createElement('circle', {
                                    cx: fruit.x,
                                    cy: fruit.y,
                                    r: fruit.size,
                                    fill: fruit.color,
                                    style: {
                                        animation: `leafPop 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) ${fruit.delay}s both`
                                    }
                                }),
                                // Highlight on fruit
                                React.createElement('circle', {
                                    cx: fruit.x - fruit.size * 0.3,
                                    cy: fruit.y - fruit.size * 0.3,
                                    r: fruit.size * 0.35,
                                    fill: "#ffffff",
                                    opacity: "0.5",
                                    style: {
                                        animation: `leafPop 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) ${fruit.delay}s both`
                                    }
                                }),
                                // Stem
                                React.createElement('line', {
                                    x1: fruit.x,
                                    y1: fruit.y - fruit.size,
                                    x2: fruit.x,
                                    y2: fruit.y - fruit.size - 2,
                                    stroke: trunkMid,
                                    strokeWidth: "1",
                                    strokeLinecap: "round",
                                    style: {
                                        animation: `leafPop 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) ${fruit.delay + 0.05}s both`
                                    }
                                }),
                                // Sparkle
                                React.createElement('path', {
                                    d: `M${fruit.x},${fruit.y - fruit.size - 4} L${fruit.x + 1},${fruit.y - fruit.size - 2} L${fruit.x + 2.5},${fruit.y - fruit.size - 2.5} L${fruit.x + 1},${fruit.y - fruit.size - 3} L${fruit.x},${fruit.y - fruit.size - 5.5} L${fruit.x - 1},${fruit.y - fruit.size - 3} L${fruit.x - 2.5},${fruit.y - fruit.size - 2.5} L${fruit.x - 1},${fruit.y - fruit.size - 2} Z`,
                                    fill: "#fbbf24",
                                    opacity: "0.6",
                                    style: {
                                        animation: `leafPop 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) ${fruit.delay + 0.1}s both, fruitGlow 1.5s ease-in-out infinite`
                                    }
                                })
                            )
                        )
                    )
                    ) // Close the scaling group
                );
            };

            return React.createElement('div', { className: "bg-white rounded-xl soft-shadow p-6" },
                // Header
                React.createElement('div', { className: "flex justify-between items-center mb-4" },
                    isEditingName ?
                        React.createElement('input', {
                            type: "text",
                            value: tempName,
                            onChange: e => setTempName(e.target.value),
                            onBlur: handleSaveName,
                            onKeyPress: e => e.key === 'Enter' && handleSaveName(),
                            autoFocus: true,
                            className: "text-xl font-light text-calm-800 border-b-2 border-calm-300 focus:border-calm-600 outline-none",
                            style: { fontWeight: 300 }
                        }) :
                        React.createElement('h3', {
                            className: "text-xl text-calm-800 cursor-pointer hover:text-calm-600 transition",
                            style: { fontWeight: 300 },
                            onClick: () => {
                                setTempName(treeName);
                                setIsEditingName(true);
                            }
                        }, treeName),
                    React.createElement('span', {
                        className: "text-sm text-calm-500",
                        style: { fontWeight: 300 }
                    }, `${totalHours.toFixed(1)}h`)
                ),

                // Tree visualization with natural sky-to-earth gradient
                React.createElement('div', {
                    className: "relative rounded-lg p-4 mb-4",
                    style: {
                        height: '240px',
                        background: 'linear-gradient(to bottom, #e0f2fe 0%, #bae6fd 40%, #a7f3d0 70%, #86efac 100%)',
                        boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.05)'
                    }
                },
                    React.createElement(TreeSVG, { key: currentTree.id, growth: growthPercent, color: currentTree.color, treeType: currentTree.id }),

                    // Growth percentage badge
                    React.createElement('div', {
                        className: "absolute top-2 right-2 bg-white px-3 py-1 rounded-full text-sm soft-shadow",
                        style: { fontWeight: 300, color: currentTree.color }
                    }, `${Math.min(100, Math.round(growthPercent))}% grown`)
                ),

                // Progress bar
                React.createElement('div', { className: "mb-4" },
                    React.createElement('div', { className: "flex justify-between text-xs text-calm-600 mb-1", style: { fontWeight: 300 } },
                        React.createElement('span', null, currentTree.name),
                        React.createElement('span', null, `${Math.max(0, totalHours - currentTree.requiredHours).toFixed(1)} / 5.0 hours`)
                    ),
                    React.createElement('div', { className: "w-full bg-calm-200 rounded-full h-2" },
                        React.createElement('div', {
                            className: "h-2 rounded-full transition-all duration-1000",
                            style: {
                                width: `${Math.min(100, growthPercent)}%`,
                                backgroundColor: currentTree.color
                            }
                        })
                    )
                ),

                // Unlocked trees
                React.createElement('div', { className: "border-t border-calm-200 pt-4" },
                    React.createElement('p', {
                        className: "text-xs text-calm-600 mb-2",
                        style: { fontWeight: 300 }
                    }, `${unlockedTrees.length} of ${TREE_TYPES.length} trees unlocked`),

                    React.createElement('div', { className: "flex flex-wrap gap-2" },
                        TREE_TYPES.map(tree => {
                            const isUnlocked = unlockedTrees.some(t => t.id === tree.id);
                            const isSelected = tree.id === selectedTreeType;

                            return React.createElement('button', {
                                key: tree.id,
                                onClick: () => isUnlocked && handleChangeTree(tree.id),
                                disabled: !isUnlocked,
                                className: `px-3 py-1 rounded-lg text-xs transition ${
                                    isSelected ? 'ring-2' : ''
                                } ${
                                    !isUnlocked ? 'opacity-30 cursor-not-allowed' : 'hover:opacity-80 cursor-pointer'
                                }`,
                                style: {
                                    backgroundColor: tree.color + '20',
                                    color: tree.color,
                                    ringColor: tree.color,
                                    fontWeight: 300
                                },
                                title: isUnlocked ? tree.name : `Unlock at ${tree.requiredHours}h`
                            }, isUnlocked ? tree.name : '🔒 ' + tree.name.split(' ')[0]);
                        })
                    )
                ),

                // Next tree message - shows next tree to grow or unlock
                (() => {
                    // Find the first unlocked tree that's not fully grown
                    const nextTreeToGrow = unlockedTrees.find(tree => {
                        const growth = getTreeGrowth(totalHours, tree);
                        return growth < 100;
                    });

                    if (nextTreeToGrow) {
                        const hoursNeeded = 5 - (totalHours - nextTreeToGrow.requiredHours);
                        return React.createElement('p', {
                            className: "text-xs text-calm-500 mt-3 text-center",
                            style: { fontWeight: 300 }
                        }, `Study ${hoursNeeded.toFixed(1)} more hours to fully grow ${nextTreeToGrow.name}`);
                    } else if (unlockedTrees.length < TREE_TYPES.length) {
                        // All unlocked trees are fully grown, show next unlock
                        const nextToUnlock = TREE_TYPES[unlockedTrees.length];
                        return React.createElement('p', {
                            className: "text-xs text-calm-500 mt-3 text-center",
                            style: { fontWeight: 300 }
                        }, `Study ${(nextToUnlock.requiredHours - totalHours).toFixed(1)} more hours to unlock ${nextToUnlock.name}`);
                    }
                    return null;
                })()
            );
        };

        // GoalSection component - moved outside Goals to prevent re-creation on each render
        const GoalSection = ({ type, title, color, placeholder, activeGoals, newGoalText, setNewGoalText, handleAddGoal, handleToggleGoal, handleDeleteGoal }) => {
            const sectionGoals = activeGoals.filter(g => g.type === type);

            return React.createElement('div', { className: "bg-white rounded-xl soft-shadow p-6" },
                React.createElement('h3', { className: "text-xl font-light mb-4", style: { color, fontWeight: 300 } }, title),

                // Goal input
                React.createElement('div', { className: "flex gap-2 mb-4" },
                    React.createElement('input', {
                        type: "text",
                        value: newGoalText[type],
                        onChange: (e) => setNewGoalText({ ...newGoalText, [type]: e.target.value }),
                        onKeyPress: (e) => e.key === 'Enter' && handleAddGoal(type),
                        placeholder,
                        className: "flex-grow px-4 py-2 border border-calm-300 rounded-xl focus:ring-2 focus:outline-none transition",
                        style: { borderColor: '#d1d7e3', fontWeight: 300 }
                    }),
                    React.createElement('button', {
                        onClick: () => handleAddGoal(type),
                        className: "px-4 py-2 rounded-xl soft-shadow hover:opacity-90 transition text-white",
                        style: { backgroundColor: color, fontWeight: 400 }
                    }, "+")
                ),

                // Goal list
                React.createElement('div', { className: "space-y-2" },
                    sectionGoals.map(goal =>
                        React.createElement('div', {
                            key: goal.id,
                            className: "flex items-center gap-3 p-2 rounded-lg hover:bg-calm-50 transition group"
                        },
                            React.createElement('input', {
                                type: "checkbox",
                                checked: false,
                                onChange: () => handleToggleGoal(goal),
                                className: "w-5 h-5 rounded border-calm-400 cursor-pointer"
                            }),
                            React.createElement('span', {
                                className: "flex-grow text-calm-800",
                                style: { fontWeight: 300 }
                            }, goal.text),
                            React.createElement('button', {
                                onClick: () => handleDeleteGoal(goal.id),
                                className: "opacity-0 group-hover:opacity-100 text-calm-400 hover:text-red-500 transition",
                                style: { fontSize: '0.9rem' }
                            }, "×")
                        )
                    )
                )
            );
        };

        const Notebook = ({ db, userId, setNotification }) => {
            const [noteText, setNoteText] = useState('');
            const [todos, setTodos] = useState([]);
            const [newTodo, setNewTodo] = useState('');
            const [drawingTool, setDrawingTool] = useState('pen'); // 'pen', 'eraser', or 'text'
            const [isDrawing, setIsDrawing] = useState(false);
            const [isPanning, setIsPanning] = useState(false);
            const canvasRef = useRef(null);
            const contextRef = useRef(null);
            const [isLoadingNotes, setIsLoadingNotes] = useState(true);
            const [zoom, setZoom] = useState(1);
            const [panX, setPanX] = useState(0);
            const [panY, setPanY] = useState(0);
            const lastPanPoint = useRef({ x: 0, y: 0 });
            const [textElements, setTextElements] = useState([]);
            const [isTyping, setIsTyping] = useState(false);
            const [typingPosition, setTypingPosition] = useState(null);
            const [currentText, setCurrentText] = useState('');

            const appId = typeof __app_id !== 'undefined' ? __app_id : 'study-tracker-app';

            // Load notes and todos from Firebase
            useEffect(() => {
                if (!db || !userId) return;

                const notebookDocRef = window.doc(db, `/artifacts/${appId}/users/${userId}/notebook/data`);

                const unsubscribe = window.onSnapshot(notebookDocRef, (doc) => {
                    if (doc.exists()) {
                        const data = doc.data();
                        setNoteText(data.noteText || '');
                        setTodos(data.todos || []);
                        if (data.canvasData && canvasRef.current) {
                            const canvas = canvasRef.current;
                            const context = canvas.getContext('2d');
                            const img = new Image();
                            img.onload = () => {
                                context.clearRect(0, 0, canvas.width, canvas.height);
                                context.drawImage(img, 0, 0);
                            };
                            img.src = data.canvasData;
                        }
                    }
                    setIsLoadingNotes(false);
                }, (error) => {
                    console.error("Error fetching notebook:", error);
                    setIsLoadingNotes(false);
                });

                return () => unsubscribe();
            }, [db, userId, appId]);

            // Initialize canvas
            useEffect(() => {
                if (!canvasRef.current) return;

                const canvas = canvasRef.current;

                // Use setTimeout to ensure canvas is fully rendered
                const initCanvas = () => {
                    const dpr = window.devicePixelRatio || 1;
                    const rect = canvas.getBoundingClientRect();

                    // Set canvas size for high DPI displays
                    canvas.width = rect.width * dpr;
                    canvas.height = 400 * dpr;

                    // Set CSS size
                    canvas.style.width = rect.width + 'px';
                    canvas.style.height = '400px';

                    const context = canvas.getContext('2d');
                    if (context) {
                        // Scale context to match device pixel ratio
                        context.scale(dpr, dpr);
                        context.lineCap = 'round';
                        context.lineJoin = 'round';
                        context.strokeStyle = 'black';
                        context.lineWidth = 2;
                        contextRef.current = context;

                        console.log('Canvas initialized:', canvas.width, 'x', canvas.height, 'DPR:', dpr);
                    }
                };

                // Small delay to ensure DOM is ready
                setTimeout(initCanvas, 100);
            }, []);

            // Add wheel event listener with passive: false to prevent scroll
            useEffect(() => {
                const canvas = canvasRef.current;
                if (!canvas) return;

                const wheelHandler = (e) => {
                    e.preventDefault();
                    const delta = e.deltaY > 0 ? 0.9 : 1.1;
                    const newZoom = Math.max(0.1, Math.min(10, zoom * delta));
                    setZoom(newZoom);
                };

                canvas.addEventListener('wheel', wheelHandler, { passive: false });

                return () => {
                    canvas.removeEventListener('wheel', wheelHandler);
                };
            }, [zoom]);

            // Save to Firebase
            const saveToFirebase = async (updates) => {
                try {
                    const notebookDocRef = window.doc(db, `/artifacts/${appId}/users/${userId}/notebook/data`);
                    await window.setDoc(notebookDocRef, {
                        ...updates,
                        updatedAt: window.Timestamp.now()
                    }, { merge: true });
                } catch (error) {
                    console.error("Error saving notebook:", error);
                    setNotification({ type: 'error', message: 'Failed to save changes.' });
                }
            };

            // Get mouse position relative to canvas
            const getMousePos = (e) => {
                const canvas = canvasRef.current;
                if (!canvas) return { x: 0, y: 0 };

                const rect = canvas.getBoundingClientRect();
                return {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                };
            };

            // Redraw canvas with current transform
            const redrawCanvas = () => {
                const context = contextRef.current;
                const canvas = canvasRef.current;
                if (!context || !canvas) return;

                context.save();
                context.setTransform(zoom, 0, 0, zoom, panX, panY);
                context.restore();
            };

            // Drawing functions
            const startDrawing = ({ nativeEvent }) => {
                // Focus canvas for keyboard input
                if (canvasRef.current) {
                    canvasRef.current.focus();
                }

                if (nativeEvent.shiftKey) {
                    // Start panning
                    setIsPanning(true);
                    lastPanPoint.current = { x: nativeEvent.offsetX, y: nativeEvent.offsetY };
                    return;
                }

                const pos = screenToCanvas(nativeEvent.offsetX, nativeEvent.offsetY);

                // Handle text tool
                if (drawingTool === 'text') {
                    setIsTyping(true);
                    setTypingPosition({ x: pos.x, y: pos.y });
                    setCurrentText('');
                    return;
                }

                // Initialize context if not ready
                if (!contextRef.current && canvasRef.current) {
                    const ctx = canvasRef.current.getContext('2d');
                    if (ctx) {
                        ctx.lineCap = 'round';
                        ctx.lineJoin = 'round';
                        ctx.strokeStyle = 'black';
                        ctx.lineWidth = 2;
                        contextRef.current = ctx;
                        console.log('Canvas context initialized on first draw');
                    }
                }

                if (!contextRef.current) {
                    console.error('Canvas context not available');
                    return;
                }

                contextRef.current.save();
                contextRef.current.setTransform(zoom, 0, 0, zoom, panX, panY);
                contextRef.current.beginPath();
                contextRef.current.moveTo(pos.x, pos.y);
                contextRef.current.restore();
                setIsDrawing(true);
            };

            const draw = ({ nativeEvent }) => {
                if (isPanning) {
                    const dx = nativeEvent.offsetX - lastPanPoint.current.x;
                    const dy = nativeEvent.offsetY - lastPanPoint.current.y;
                    setPanX(prev => prev + dx);
                    setPanY(prev => prev + dy);
                    lastPanPoint.current = { x: nativeEvent.offsetX, y: nativeEvent.offsetY };
                    redrawCanvas();
                    return;
                }

                if (!isDrawing) return;

                // Initialize context if not ready
                if (!contextRef.current && canvasRef.current) {
                    const ctx = canvasRef.current.getContext('2d');
                    if (ctx) {
                        ctx.lineCap = 'round';
                        ctx.lineJoin = 'round';
                        ctx.strokeStyle = 'black';
                        ctx.lineWidth = 2;
                        contextRef.current = ctx;
                    }
                }

                if (!contextRef.current) return;

                const pos = screenToCanvas(nativeEvent.offsetX, nativeEvent.offsetY);

                contextRef.current.save();
                contextRef.current.setTransform(zoom, 0, 0, zoom, panX, panY);

                if (drawingTool === 'eraser') {
                    contextRef.current.globalCompositeOperation = 'destination-out';
                    contextRef.current.lineWidth = 20 / zoom;
                } else {
                    contextRef.current.globalCompositeOperation = 'source-over';
                    contextRef.current.lineWidth = 2 / zoom;
                }

                contextRef.current.lineTo(pos.x, pos.y);
                contextRef.current.stroke();
                contextRef.current.restore();
            };

            const stopDrawing = () => {
                if (isPanning) {
                    setIsPanning(false);
                    return;
                }

                if (isDrawing && contextRef.current) {
                    contextRef.current.closePath();
                    setIsDrawing(false);

                    // Save canvas to Firebase
                    const canvas = canvasRef.current;
                    if (canvas) {
                        const canvasData = canvas.toDataURL();
                        saveToFirebase({ canvasData, zoom, panX, panY });
                    }
                }
            };

            // Zoom functions
            const zoomIn = () => {
                setZoom(prev => Math.min(10, prev * 1.2));
            };

            const zoomOut = () => {
                setZoom(prev => Math.max(0.1, prev / 1.2));
            };

            const resetZoom = () => {
                setZoom(1);
                setPanX(0);
                setPanY(0);
            };

            // Text handling functions
            const handleCanvasKeyDown = (e) => {
                if (!isTyping) return;

                if (e.key === 'Enter') {
                    // Finish typing
                    if (currentText.trim() && typingPosition) {
                        const context = contextRef.current;
                        if (context) {
                            context.save();
                            context.setTransform(zoom, 0, 0, zoom, panX, panY);
                            context.font = `${16 / zoom}px Satoshi, sans-serif`;
                            context.fillStyle = 'black';
                            context.fillText(currentText, typingPosition.x, typingPosition.y);
                            context.restore();

                            const newTextElement = {
                                text: currentText,
                                x: typingPosition.x,
                                y: typingPosition.y
                            };
                            setTextElements(prev => [...prev, newTextElement]);

                            // Save canvas to Firebase
                            const canvas = canvasRef.current;
                            if (canvas) {
                                const canvasData = canvas.toDataURL();
                                saveToFirebase({ canvasData, zoom, panX, panY });
                            }
                        }
                    }
                    setIsTyping(false);
                    setCurrentText('');
                    setTypingPosition(null);
                } else if (e.key === 'Escape') {
                    setIsTyping(false);
                    setCurrentText('');
                    setTypingPosition(null);
                } else if (e.key === 'Backspace') {
                    setCurrentText(prev => prev.slice(0, -1));
                } else if (e.key.length === 1) {
                    setCurrentText(prev => prev + e.key);
                }
            };

            const clearCanvas = () => {
                const canvas = canvasRef.current;
                if (!canvas) return;

                const context = canvas.getContext('2d');
                if (!context) return;

                context.clearRect(0, 0, canvas.width, canvas.height);
                saveToFirebase({ canvasData: '' });
            };

            // Todo functions
            const handleAddTodo = () => {
                if (!newTodo.trim()) return;

                const updatedTodos = [...todos, { id: Date.now().toString(), text: newTodo, completed: false }];
                setTodos(updatedTodos);
                setNewTodo('');
                saveToFirebase({ todos: updatedTodos });
            };

            const handleToggleTodo = (id) => {
                const updatedTodos = todos.map(todo =>
                    todo.id === id ? { ...todo, completed: !todo.completed } : todo
                );
                setTodos(updatedTodos);
                saveToFirebase({ todos: updatedTodos });
            };

            const handleDeleteTodo = (id) => {
                const updatedTodos = todos.filter(todo => todo.id !== id);
                setTodos(updatedTodos);
                saveToFirebase({ todos: updatedTodos });
            };

            // Note text handler with debounced save
            const handleNoteChange = (e) => {
                const text = e.target.value;
                setNoteText(text);
            };

            useEffect(() => {
                const timeoutId = setTimeout(() => {
                    if (noteText !== undefined) {
                        saveToFirebase({ noteText });
                    }
                }, 1000);

                return () => clearTimeout(timeoutId);
            }, [noteText]);

            if (isLoadingNotes) {
                return React.createElement('div', null,
                    React.createElement('h2', { className: "text-3xl text-calm-800 mb-2", style: { fontWeight: 300 } }, "notebook"),
                    React.createElement('div', { className: "bg-white rounded-xl soft-shadow p-6 mb-6" },
                        React.createElement('div', { className: "flex justify-center items-center" },
                            React.createElement(LoaderIcon),
                            React.createElement('span', { className: "ml-2" }, "loading notebook...")
                        )
                    )
                );
            }

            return React.createElement('div', null,
                React.createElement('h2', { className: "text-3xl text-calm-800 mb-6", style: { fontWeight: 300 } }, "notebook"),

                React.createElement('div', { className: "bg-white rounded-xl soft-shadow p-6 mb-6" },

                // To-do list section
                React.createElement('div', { className: "mb-6" },
                    React.createElement('h4', { className: "text-lg text-calm-700 mb-2", style: { fontWeight: 400 } }, "to-do list"),
                    React.createElement('div', { className: "flex gap-2 mb-3" },
                        React.createElement('input', {
                            type: "text",
                            value: newTodo,
                            onChange: (e) => setNewTodo(e.target.value),
                            onKeyPress: (e) => e.key === 'Enter' && handleAddTodo(),
                            placeholder: "add a to-do item...",
                            className: "flex-grow px-4 py-2 border border-calm-300 rounded-lg focus:ring-2 focus:ring-calm-400 focus:outline-none transition",
                            style: { fontWeight: 300 }
                        }),
                        React.createElement('button', {
                            onClick: handleAddTodo,
                            className: "px-4 py-2 bg-calm-600 text-white rounded-lg hover:bg-calm-700 transition",
                            style: { fontWeight: 400 }
                        }, "+ add")
                    ),
                    React.createElement('div', { className: "space-y-2" },
                        todos.length > 0 ? todos.map(todo =>
                            React.createElement('div', {
                                key: todo.id,
                                className: "flex items-center gap-3 p-2 rounded-lg hover:bg-calm-50 transition group"
                            },
                                React.createElement('input', {
                                    type: "checkbox",
                                    checked: todo.completed,
                                    onChange: () => handleToggleTodo(todo.id),
                                    className: "w-5 h-5 rounded border-calm-400 cursor-pointer"
                                }),
                                React.createElement('span', {
                                    className: `flex-grow text-calm-800 ${todo.completed ? 'line-through text-calm-500' : ''}`,
                                    style: { fontWeight: 300 }
                                }, todo.text),
                                React.createElement('button', {
                                    onClick: () => handleDeleteTodo(todo.id),
                                    className: "opacity-0 group-hover:opacity-100 text-calm-400 hover:text-red-500 transition",
                                    style: { fontSize: '0.9rem' }
                                }, "×")
                            )
                        ) : React.createElement('p', { className: "text-calm-500 text-sm", style: { fontWeight: 300 } }, "no to-do items yet")
                    )
                ),

                // Notes section
                React.createElement('div', { className: "mb-6" },
                    React.createElement('h4', { className: "text-lg text-calm-700 mb-2", style: { fontWeight: 400 } }, "notes"),
                    React.createElement('textarea', {
                        value: noteText,
                        onChange: handleNoteChange,
                        placeholder: "write anything here...",
                        className: "w-full px-4 py-3 border border-calm-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-calm-400 focus:outline-none transition",
                        style: { minHeight: '150px', fontWeight: 300, resize: 'both' }
                    })
                )
                )
            );
        };

        const Goals = ({ db, userId, setNotification }) => {
            const [goals, setGoals] = useState([]);
            const [newGoalText, setNewGoalText] = useState({ daily: '', weekly: '', monthly: '', yearly: '' });
            const [isLoading, setIsLoading] = useState(true);

            const appId = typeof __app_id !== 'undefined' ? __app_id : 'study-tracker-app';

            useEffect(() => {
                if (!db || !userId) return;

                const goalsCol = window.collection(db, `/artifacts/${appId}/users/${userId}/goals`);

                const unsubscribe = window.onSnapshot(goalsCol, (snapshot) => {
                    const goalsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setGoals(goalsData);
                    setIsLoading(false);
                }, (error) => {
                    console.error("Error fetching goals:", error);
                    setNotification({ type: 'error', message: "Could not fetch goals." });
                    setIsLoading(false);
                });

                return () => unsubscribe();
            }, [db, userId, appId, setNotification]);

            const handleAddGoal = async (type) => {
                const text = newGoalText[type].trim();
                if (!text) return;

                try {
                    const goalsCol = window.collection(db, `/artifacts/${appId}/users/${userId}/goals`);
                    await window.addDoc(goalsCol, {
                        text,
                        type,
                        completed: false,
                        createdAt: window.Timestamp.now()
                    });
                    setNewGoalText({ ...newGoalText, [type]: '' });
                    setNotification({ type: 'success', message: 'Goal added!' });
                } catch (error) {
                    console.error("Error adding goal:", error);
                    setNotification({ type: 'error', message: 'Failed to add goal.' });
                }
            };

            const handleToggleGoal = async (goal) => {
                try {
                    const goalDocRef = window.doc(db, `/artifacts/${appId}/users/${userId}/goals/${goal.id}`);
                    await window.setDoc(goalDocRef, {
                        ...goal,
                        completed: !goal.completed,
                        completedAt: !goal.completed ? window.Timestamp.now() : null
                    }, { merge: true });
                } catch (error) {
                    console.error("Error toggling goal:", error);
                    setNotification({ type: 'error', message: 'Failed to update goal.' });
                }
            };

            const handleDeleteGoal = async (goalId) => {
                try {
                    const goalDocRef = window.doc(db, `/artifacts/${appId}/users/${userId}/goals/${goalId}`);
                    await window.deleteDoc(goalDocRef);
                    setNotification({ type: 'success', message: 'Goal deleted!' });
                } catch (error) {
                    console.error("Error deleting goal:", error);
                    setNotification({ type: 'error', message: 'Failed to delete goal.' });
                }
            };

            const activeGoals = goals.filter(g => !g.completed);
            const completedGoals = goals.filter(g => g.completed).sort((a, b) =>
                (b.completedAt?.toMillis() || 0) - (a.completedAt?.toMillis() || 0)
            );

            if (isLoading) {
                return React.createElement('div', { className: "flex justify-center items-center p-8" },
                    React.createElement(LoaderIcon),
                    React.createElement('span', { className: "ml-2" }, "loading your goals...")
                );
            }

            return React.createElement('div', { className: "max-w-4xl mx-auto p-4 sm:p-6 lg:p-8" },
                // Notebook section
                React.createElement(Notebook, { db, userId, setNotification }),

                React.createElement('h2', { className: "text-3xl text-calm-800 mb-6", style: { fontWeight: 300 } }, "goals"),

                React.createElement('div', { className: "space-y-6" },
                    React.createElement(GoalSection, {
                        type: 'daily',
                        title: 'daily goals',
                        color: '#5FA8A3',
                        placeholder: "what do you want to accomplish today?",
                        activeGoals,
                        newGoalText,
                        setNewGoalText,
                        handleAddGoal,
                        handleToggleGoal,
                        handleDeleteGoal
                    }),
                    React.createElement(GoalSection, {
                        type: 'weekly',
                        title: 'weekly goals',
                        color: '#6B8DD6',
                        placeholder: "what do you want to accomplish this week?",
                        activeGoals,
                        newGoalText,
                        setNewGoalText,
                        handleAddGoal,
                        handleToggleGoal,
                        handleDeleteGoal
                    }),
                    React.createElement(GoalSection, {
                        type: 'monthly',
                        title: 'monthly goals',
                        color: '#8B7FB8',
                        placeholder: "what do you want to accomplish this month?",
                        activeGoals,
                        newGoalText,
                        setNewGoalText,
                        handleAddGoal,
                        handleToggleGoal,
                        handleDeleteGoal
                    }),
                    React.createElement(GoalSection, {
                        type: 'yearly',
                        title: 'yearly goals',
                        color: '#7d8ca8',
                        placeholder: "what do you want to accomplish this year?",
                        activeGoals,
                        newGoalText,
                        setNewGoalText,
                        handleAddGoal,
                        handleToggleGoal,
                        handleDeleteGoal
                    }),

                    // Completed Goals Section
                    completedGoals.length > 0 && React.createElement('div', { className: "bg-white rounded-xl soft-shadow p-6 mt-8" },
                        React.createElement('h3', { className: "text-xl text-calm-600 mb-4", style: { fontWeight: 300 } }, "completed goals"),
                        React.createElement('div', { className: "space-y-2" },
                            completedGoals.map(goal =>
                                React.createElement('div', {
                                    key: goal.id,
                                    className: "flex items-center gap-3 p-2 rounded-lg hover:bg-calm-50 transition group"
                                },
                                    React.createElement('input', {
                                        type: "checkbox",
                                        checked: true,
                                        onChange: () => handleToggleGoal(goal),
                                        className: "w-5 h-5 rounded border-calm-400 cursor-pointer"
                                    }),
                                    React.createElement('span', {
                                        className: "flex-grow text-calm-500 line-through",
                                        style: { fontWeight: 300 }
                                    }, goal.text),
                                    React.createElement('span', {
                                        className: "text-xs text-calm-400",
                                        style: { fontWeight: 300 }
                                    }, goal.completedAt ? formatDate(goal.completedAt) : ''),
                                    React.createElement('button', {
                                        onClick: () => handleDeleteGoal(goal.id),
                                        className: "opacity-0 group-hover:opacity-100 text-calm-400 hover:text-red-500 transition",
                                        style: { fontSize: '0.9rem' }
                                    }, "×")
                                )
                            )
                        )
                    )
                )
            );
        };

        // --- Friends Page Component ---
        const Friends = ({ db, userId, setNotification, userProfile }) => {
            const [friendRequests, setFriendRequests] = useState([]);
            const [nousRequests, setNousRequests] = useState([]);
            const [friends, setFriends] = useState([]);
            const [suggestedFriends, setSuggestedFriends] = useState([]);
            const [searchTerm, setSearchTerm] = useState('');
            const [searchResult, setSearchResult] = useState(null);
            const [showNousModal, setShowNousModal] = useState(false);
            const [selectedFriends, setSelectedFriends] = useState([]);
            const [selectedHabit, setSelectedHabit] = useState(null);
            const [habits, setHabits] = useState([]);
            const [showAcceptModal, setShowAcceptModal] = useState(false);
            const [acceptingRequest, setAcceptingRequest] = useState(null);
            const [friendCodeInput, setFriendCodeInput] = useState('');
            const [isLoading, setIsLoading] = useState(true);
            const [isSearching, setIsSearching] = useState(false);

            // Load friend requests and friendships
            useEffect(() => {
                if (!db || !userId) return;

                // Listen to incoming friend requests
                const requestsQuery = window.query(
                    window.collection(db, 'friendRequests'),
                    window.where('toUserId', '==', userId),
                    window.where('status', '==', 'pending')
                );

                const unsubscribeRequests = window.onSnapshot(requestsQuery, async (snapshot) => {
                    const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setFriendRequests(requests);
                });

                // Listen to incoming Nous requests (multi-participant support with auto-decline)
                const nousRequestsQuery = window.query(
                    window.collection(db, 'nousRequests'),
                    window.where('toUserIds', 'array-contains', userId),
                    window.where('status', '==', 'pending')
                );

                const unsubscribeNousRequests = window.onSnapshot(nousRequestsQuery, async (snapshot) => {
                    const now = Date.now();
                    const TWO_HOURS = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

                    const requests = [];

                    for (const doc of snapshot.docs) {
                        const data = doc.data();
                        const requestAge = now - data.createdAt.toMillis();

                        // Auto-decline requests older than 2 hours
                        if (requestAge > TWO_HOURS) {
                            try {
                                await window.updateDoc(window.doc(db, 'nousRequests', doc.id), {
                                    status: 'expired',
                                    expiredAt: window.Timestamp.now()
                                });
                                console.log(`Auto-declined expired Nous request from @${data.fromUsername}`);
                            } catch (error) {
                                console.error('Error auto-declining request:', error);
                            }
                        } else {
                            requests.push({ id: doc.id, ...data });
                        }
                    }

                    setNousRequests(requests);
                });

                // Listen to friendships
                const friendshipsQuery1 = window.query(
                    window.collection(db, 'friendships'),
                    window.where('user1Id', '==', userId)
                );
                const friendshipsQuery2 = window.query(
                    window.collection(db, 'friendships'),
                    window.where('user2Id', '==', userId)
                );

                const fetchFriends = async () => {
                    try {
                        const [snap1, snap2] = await Promise.all([
                            window.getDocs(friendshipsQuery1),
                            window.getDocs(friendshipsQuery2)
                        ]);

                        const friendsList = [];

                        // Get friends from both queries
                        for (const doc of [...snap1.docs, ...snap2.docs]) {
                            const data = doc.data();
                            const friendId = data.user1Id === userId ? data.user2Id : data.user1Id;

                            // Fetch friend's user profile
                            const friendDocRef = window.doc(db, 'users', friendId);
                            const friendSnapshot = await window.getDoc(friendDocRef);
                            const friendData = friendSnapshot.data();

                            if (friendData) {
                                friendsList.push({
                                    id: doc.id,
                                    friendshipId: doc.id,
                                    userId: friendId,
                                    username: data.user1Id === userId ? data.user2Username : data.user1Username,
                                    ...friendData
                                });
                            }
                        }

                        setFriends(friendsList);
                        setIsLoading(false);
                    } catch (error) {
                        console.error("Error fetching friends:", error);
                        setNotification({ type: 'error', message: 'Failed to load friends: ' + error.message });
                        setIsLoading(false);
                    }
                };

                fetchFriends();
                return () => {
                    unsubscribeRequests();
                    unsubscribeNousRequests();
                };
            }, [db, userId, setNotification]);

            // Load suggested friends (active users, friends of friends, and NoahLim)
            useEffect(() => {
                if (!db || !userId) return;

                const fetchSuggestedFriends = async () => {
                    try {
                        // Calculate the date for 14 days ago (more lenient)
                        const twoWeeksAgo = window.Timestamp.fromDate(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000));
                        
                        // First, get all users to identify NoahLim
                        const usersRef = window.collection(db, 'users');
                        const allUsersSnapshot = await window.getDocs(usersRef);
                        const allUsers = allUsersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                        
                        // Get friends IDs to exclude them from suggestions
                        const friendIds = friends.map(f => f.userId);
                        
                        // Find users who have used the timer/stopwatch in the past 14 days
                        // Query all session collections to find recent activity
                        let activeUsers = [];
                        
                        // We'll check each user to see if they have recent sessions
                        for (const user of allUsers) {
                            // Skip current user, friends, users without usernames, and test accounts
                            if (user.id === userId || friendIds.includes(user.id) || !user.username || user.username.trim() === '' || user.username.toLowerCase().includes('test')) {
                                continue;
                            }
                            
                            try {
                                const appId = typeof __app_id !== 'undefined' ? __app_id : 'study-tracker-app';
                                const sessionsQuery = window.query(
                                    window.collection(db, `/artifacts/${appId}/users/${user.id}/sessions`),
                                    window.where('startTime', '>=', twoWeeksAgo) // Sessions from the last 14 days
                                );
                                
                                const sessionsSnapshot = await window.getDocs(sessionsQuery);
                                
                                // If the user has sessions in the past 14 days, they are active
                                if (!sessionsSnapshot.empty) {
                                    activeUsers.push({
                                        id: user.id,
                                        username: user.username,
                                        isFounder: false,
                                        stats: user.stats || {}
                                    });
                                }
                            } catch (sessionError) {
                                // If we can't access a user's sessions (maybe due to security rules), 
                                // skip them but don't break the entire process
                                console.warn(`Could not access sessions for user ${user.id}:`, sessionError.message);
                            }
                        }
                        
                        // Find friends of friends to include them in suggestions
                        let friendsOfFriends = [];
                        if (friends.length > 0) {
                            for (const friend of friends) {
                                const friendId = friend.userId;
                                
                                // Find friendships where the friend is user1
                                const friendships1Query = window.query(
                                    window.collection(db, 'friendships'),
                                    window.where('user1Id', '==', friendId)
                                );
                                
                                // Find friendships where the friend is user2
                                const friendships2Query = window.query(
                                    window.collection(db, 'friendships'),
                                    window.where('user2Id', '==', friendId)
                                );
                                
                                const [snap1, snap2] = await Promise.all([
                                    window.getDocs(friendships1Query),
                                    window.getDocs(friendships2Query)
                                ]);
                                
                                // Process both sets of friendships
                                for (const doc of [...snap1.docs, ...snap2.docs]) {
                                    const data = doc.data();
                                    
                                    // Get the other user in each friendship (not our friend)
                                    let friendOfFriendId;
                                    if (data.user1Id === friendId) {
                                        friendOfFriendId = data.user2Id;
                                    } else {
                                        friendOfFriendId = data.user1Id;
                                    }
                                    
                                    // Exclude current user and existing direct friends
                                    if (friendOfFriendId !== userId && !friendIds.includes(friendOfFriendId)) {
                                        // Get profile of friend of friend
                                        const friendOfFriendDoc = await window.getDoc(window.doc(db, 'users', friendOfFriendId));

                                        if (friendOfFriendDoc.exists()) {
                                            const friendOfFriendUsername = data.user1Id === friendId ? data.user2Username : data.user1Username;

                                            // Skip test accounts
                                            if (friendOfFriendUsername && friendOfFriendUsername.toLowerCase().includes('test')) {
                                                continue;
                                            }

                                            const friendOfFriendData = {
                                                id: friendOfFriendId,
                                                username: friendOfFriendUsername,
                                                isFriendOfFriend: true,
                                                mutualFriend: friend.username, // The friend they're connected through
                                                stats: friendOfFriendDoc.data().stats || {}
                                            };

                                            // Only add if not already in the list
                                            if (!friendsOfFriends.some(fof => fof.id === friendOfFriendId)) {
                                                friendsOfFriends.push(friendOfFriendData);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        
                        // Combine active users and friends of friends
                        let combinedSuggestions = [...activeUsers, ...friendsOfFriends];
                        
                        // Remove duplicates by user id
                        const uniqueSuggestions = [];
                        const seenIds = new Set();
                        for (const suggestion of combinedSuggestions) {
                            if (!seenIds.has(suggestion.id)) {
                                seenIds.add(suggestion.id);
                                uniqueSuggestions.push(suggestion);
                            }
                        }
                        
                        // Sort suggestions: NoahLim first, then friends of friends, then active users
                        uniqueSuggestions.sort((a, b) => {
                            // NoahLim should come first
                            if (a.username === 'noahlim') return -1;
                            if (b.username === 'noahlim') return 1;
                            
                            // Friends of friends should come next
                            if (a.isFriendOfFriend && !b.isFriendOfFriend) return -1;
                            if (!a.isFriendOfFriend && b.isFriendOfFriend) return 1;
                            
                            // Then by total hours
                            const bHours = b.stats?.totalHours || 0;
                            const aHours = a.stats?.totalHours || 0;
                            return bHours - aHours;
                        });
                        
                        // Check if NoahLim is already a friend by checking the friends array directly
                        const isNoahLimFriend = friends.some(friend => friend.username === 'noahlim');
                        
                        // Check if NoahLim exists in all users
                        const noahLimUser = allUsers.find(u => u.username === 'noahlim');
                        
                        if (noahLimUser && !isNoahLimFriend) {
                            // NoahLim exists and is not already a friend, so add to suggestions
                            setSuggestedFriends([{
                                id: noahLimUser.id,
                                username: 'noahlim',
                                isFounder: true,
                                stats: noahLimUser.stats || {}
                            }, ...uniqueSuggestions]);
                        } else {
                            // NoahLim is either not found or already a friend, so don't include him
                            setSuggestedFriends(uniqueSuggestions);
                        }
                    } catch (error) {
                        console.error("Error fetching suggested friends:", error);
                        // Show NoahLim as a fallback if there are any errors
                        setSuggestedFriends([{
                            id: 'noahlim',
                            username: 'noahlim',
                            isFounder: true,
                            stats: {}
                        }]);
                    }
                };

                fetchSuggestedFriends();
            }, [db, userId, friends]);

            // Load user's habits for Nous Together modal
            useEffect(() => {
                if (!db || !userId) return;

                const appId = typeof __app_id !== 'undefined' ? __app_id : 'study-tracker-app';
                const habitsCol = window.collection(db, `/artifacts/${appId}/users/${userId}/habits`);

                const unsubscribe = window.onSnapshot(habitsCol, (snapshot) => {
                    const habitsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setHabits(habitsData);
                });

                return () => unsubscribe();
            }, [db, userId]);

            // Search for user by username
            const handleSearchUsername = async (username = null) => {
                const searchUsername = username || searchTerm;
                if (!searchUsername.trim()) return;
                setIsSearching(true);
                setSearchResult(null);

                try {
                    const usersQuery = window.query(
                        window.collection(db, 'users'),
                        window.where('username', '==', searchUsername.trim())
                    );
                    const snapshot = await window.getDocs(usersQuery);

                    if (!snapshot.empty) {
                        const userData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };

                        if (userData.id === userId) {
                            setNotification({ type: 'error', message: "You can't add yourself!" });
                        } else {
                            setSearchResult(userData);
                        }
                    } else {
                        setNotification({ type: 'error', message: 'User not found.' });
                    }
                } catch (error) {
                    console.error("Error searching user:", error);
                    setNotification({ type: 'error', message: 'Search failed.' });
                } finally {
                    setIsSearching(false);
                }
            };

            // Search by friend code
            const handleSearchByCode = async () => {
                if (!friendCodeInput.trim()) return;
                setIsSearching(true);
                setSearchResult(null);

                try {
                    const usersQuery = window.query(
                        window.collection(db, 'users'),
                        window.where('friendCode', '==', friendCodeInput.trim().toUpperCase())
                    );
                    const snapshot = await window.getDocs(usersQuery);

                    if (!snapshot.empty) {
                        const userData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };

                        if (userData.id === userId) {
                            setNotification({ type: 'error', message: "That's your own code!" });
                        } else {
                            setSearchResult(userData);
                        }
                    } else {
                        setNotification({ type: 'error', message: 'Invalid friend code.' });
                    }
                } catch (error) {
                    console.error("Error searching by code:", error);
                    setNotification({ type: 'error', message: 'Search failed.' });
                } finally {
                    setIsSearching(false);
                }
            };

            // Send friend request
            const handleSendRequest = async (toUser) => {
                try {
                    // Check if request already exists
                    const existingQuery = window.query(
                        window.collection(db, 'friendRequests'),
                        window.where('fromUserId', '==', userId),
                        window.where('toUserId', '==', toUser.id)
                    );
                    const existing = await window.getDocs(existingQuery);

                    if (!existing.empty) {
                        setNotification({ type: 'error', message: 'Request already sent!' });
                        return;
                    }

                    await window.addDoc(window.collection(db, 'friendRequests'), {
                        fromUserId: userId,
                        fromUsername: userProfile?.username || 'Anonymous',
                        toUserId: toUser.id,
                        toUsername: toUser.username,
                        status: 'pending',
                        createdAt: window.Timestamp.now()
                    });

                    setNotification({ type: 'success', message: `Friend request sent to @${toUser.username}!` });
                    setSearchResult(null);
                    setSearchTerm('');
                    setFriendCodeInput('');
                } catch (error) {
                    console.error("Error sending request:", error);
                    setNotification({ type: 'error', message: 'Failed to send request.' });
                }
            };

            // Accept friend request
            const handleAcceptRequest = async (request) => {
                try {
                    // Update request status
                    const requestRef = window.doc(db, 'friendRequests', request.id);
                    await window.setDoc(requestRef, { status: 'accepted' }, { merge: true });

                    // Create friendship
                    await window.addDoc(window.collection(db, 'friendships'), {
                        user1Id: request.fromUserId,
                        user1Username: request.fromUsername,
                        user2Id: userId,
                        user2Username: userProfile?.username || 'Anonymous',
                        createdAt: window.Timestamp.now()
                    });

                    setNotification({ type: 'success', message: `You're now friends with @${request.fromUsername}!` });

                    // Refresh friends list
                    setFriendRequests(prev => prev.filter(r => r.id !== request.id));
                } catch (error) {
                    console.error("Error accepting request:", error);
                    setNotification({ type: 'error', message: 'Failed to accept request.' });
                }
            };

            // Decline friend request
            const handleDeclineRequest = async (request) => {
                try {
                    const requestRef = window.doc(db, 'friendRequests', request.id);
                    await window.setDoc(requestRef, { status: 'declined' }, { merge: true });
                    setFriendRequests(prev => prev.filter(r => r.id !== request.id));
                    setNotification({ type: 'success', message: 'Request declined.' });
                } catch (error) {
                    console.error("Error declining request:", error);
                    setNotification({ type: 'error', message: 'Failed to decline request.' });
                }
            };

            // Unfriend
            const handleUnfriend = async (friendship) => {
                if (!window.confirm(`Remove @${friendship.username} from friends?`)) return;

                try {
                    await window.deleteDoc(window.doc(db, 'friendships', friendship.friendshipId));
                    setFriends(prev => prev.filter(f => f.friendshipId !== friendship.friendshipId));
                    setNotification({ type: 'success', message: 'Friend removed.' });
                } catch (error) {
                    console.error("Error unfriending:", error);
                    setNotification({ type: 'error', message: 'Failed to remove friend.' });
                }
            };

            // Copy friend code
            const handleCopyCode = () => {
                if (userProfile?.friendCode) {
                    navigator.clipboard.writeText(userProfile.friendCode);
                    setNotification({ type: 'success', message: 'Friend code copied!' });
                }
            };

            // Open Nous modal with selected friend
            const handleOpenNousModal = (friend) => {
                setSelectedFriends([friend]);
                setShowNousModal(true);
            };

            // Toggle friend selection in modal
            const handleToggleFriend = (friend) => {
                setSelectedFriends(prev => {
                    const isSelected = prev.some(f => f.userId === friend.userId);
                    if (isSelected) {
                        return prev.filter(f => f.userId !== friend.userId);
                    } else if (prev.length < 4) { // Max 4 friends (5 total including sender)
                        return [...prev, friend];
                    } else {
                        setNotification({ type: 'error', message: 'Maximum 4 friends (5 total participants)!' });
                        return prev;
                    }
                });
            };

            // Send Nous together request to multiple participants
            const handleSendNousRequest = async () => {
                try {
                    if (selectedFriends.length === 0) {
                        setNotification({ type: 'error', message: 'Please select at least one friend!' });
                        return;
                    }

                    if (!selectedHabit) {
                        setNotification({ type: 'error', message: 'Please select what you\'re working on!' });
                        return;
                    }

                    if (!db || !userId || !userProfile) {
                        setNotification({ type: 'error', message: 'Missing required data. Please try refreshing the page.' });
                        return;
                    }

                    if (!userProfile.username) {
                        setNotification({ type: 'error', message: 'Your profile is incomplete. Please check your settings.' });
                        return;
                    }

                    // Create a group request (one request for all participants)
                    const requestData = {
                        fromUserId: userId,
                        fromUsername: userProfile.username,
                        fromHabitId: selectedHabit.id,
                        fromHabitName: selectedHabit.name,
                        toUserIds: selectedFriends.map(f => f.userId),
                        toUsernames: selectedFriends.map(f => f.username),
                        acceptedBy: [], // Track who has accepted
                        participantHabits: {
                            [userId]: { habitId: selectedHabit.id, habitName: selectedHabit.name }
                        },
                        status: 'pending',
                        createdAt: window.Timestamp.now()
                    };

                    await window.addDoc(window.collection(db, 'nousRequests'), requestData);

                    setNotification({
                        type: 'success',
                        message: `Nous request sent to ${selectedFriends.length} friend${selectedFriends.length > 1 ? 's' : ''}!`
                    });

                    // Reset modal state
                    setShowNousModal(false);
                    setSelectedFriends([]);
                    setSelectedHabit(null);
                } catch (error) {
                    console.error("Error sending Nous request:", error);
                    setNotification({ type: 'error', message: `Failed to send Nous request: ${error.message}` });
                }
            };

            // Show accept modal with habit selection
            const handleOpenAcceptModal = (request) => {
                setAcceptingRequest(request);
                setShowAcceptModal(true);
            };

            // Accept Nous request with selected habit
            const handleAcceptNousRequest = async () => {
                try {
                    if (!selectedHabit) {
                        setNotification({ type: 'error', message: 'Please select what you\'re working on!' });
                        return;
                    }

                    const request = acceptingRequest;
                    const requestDocRef = window.doc(db, 'nousRequests', request.id);

                    // Add user to acceptedBy array and add their habit
                    const updatedParticipantHabits = {
                        ...request.participantHabits,
                        [userId]: { habitId: selectedHabit.id, habitName: selectedHabit.name }
                    };

                    const updatedAcceptedBy = [...(request.acceptedBy || []), userId];

                    await window.updateDoc(requestDocRef, {
                        acceptedBy: updatedAcceptedBy,
                        participantHabits: updatedParticipantHabits
                    });

                    // Check if all participants have accepted
                    const allParticipants = [request.fromUserId, ...(request.toUserIds || [request.toUserId])];
                    const allAccepted = allParticipants.every(id =>
                        id === request.fromUserId || updatedAcceptedBy.includes(id)
                    );

                    if (allAccepted) {
                        // Everyone has accepted - create Nous session with shared timer
                        const participantIds = [request.fromUserId, ...updatedAcceptedBy];
                        const participantNames = [
                            request.fromUsername,
                            ...(request.toUsernames || [request.toUsername])
                        ];

                        const nousSessionData = {
                            participants: participantIds,
                            participantNames: participantNames,
                            participantHabits: updatedParticipantHabits,
                            status: 'active',
                            startTime: window.Timestamp.now(),
                            elapsedBeforePause: 0,
                            isPaused: false,
                            createdAt: window.Timestamp.now(),
                            createdBy: request.fromUserId
                        };

                        await window.addDoc(window.collection(db, 'sharedTimers'), nousSessionData);

                        // Mark request as accepted (will be cleaned up later)
                        await window.updateDoc(requestDocRef, { status: 'accepted' });

                        setNotification({
                            type: 'success',
                            message: `Nous session started with ${participantIds.length} participants!`
                        });
                    } else {
                        setNotification({
                            type: 'success',
                            message: `You accepted! Waiting for ${allParticipants.length - updatedAcceptedBy.length - 1} more...`
                        });
                    }

                    // Reset modal state
                    setShowAcceptModal(false);
                    setAcceptingRequest(null);
                    setSelectedHabit(null);
                    setNousRequests(prev => allAccepted ? prev.filter(r => r.id !== request.id) : prev);
                } catch (error) {
                    console.error("Error accepting Nous request:", error);
                    setNotification({ type: 'error', message: 'Failed to accept request.' });
                }
            };

            // Decline Nous request
            const handleDeclineNousRequest = async (request) => {
                try {
                    const requestDocRef = window.doc(db, 'nousRequests', request.id);
                    await window.updateDoc(requestDocRef, {
                        status: 'declined'
                    });
                    setNousRequests(prev => prev.filter(r => r.id !== request.id));
                    setNotification({ type: 'success', message: 'Nous request declined.' });
                } catch (error) {
                    console.error("Error declining Nous request:", error);
                    setNotification({ type: 'error', message: 'Failed to decline request.' });
                }
            };

            if (isLoading) {
                return React.createElement('div', { className: "flex justify-center items-center p-8" },
                    React.createElement(LoaderIcon),
                    React.createElement('span', { className: "ml-2" }, "loading friends...")
                );
            }

            return React.createElement('div', { className: "max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6" },
                // Header
                React.createElement('h2', { className: "text-3xl text-calm-800 mb-2", style: { fontWeight: 300 } }, "friends"),

                // Friend Code Card
                React.createElement('div', { className: "bg-white rounded-xl soft-shadow p-6" },
                    React.createElement('div', { className: "flex justify-between items-center" },
                        React.createElement('div', null,
                            React.createElement('h3', { className: "text-sm text-calm-600 mb-1", style: { fontWeight: 300 } }, "my friend code"),
                            React.createElement('span', { className: "text-2xl font-mono text-calm-800", style: { fontWeight: 400, letterSpacing: '0.1em' } },
                                userProfile?.friendCode || 'Loading...'
                            )
                        ),
                        React.createElement('button', {
                            onClick: handleCopyCode,
                            className: "px-4 py-2 bg-calm-600 text-white rounded-lg hover:bg-calm-700 transition",
                            style: { fontWeight: 400 }
                        }, "Copy Code")
                    )
                ),

                // Add Friends Card
                React.createElement('div', { className: "bg-white rounded-xl soft-shadow p-6" },
                    React.createElement('h3', { className: "text-xl text-calm-800 mb-4", style: { fontWeight: 300 } }, "add friends"),

                    // Search by username
                    React.createElement('div', { className: "mb-4" },
                        React.createElement('label', { className: "block text-sm text-calm-600 mb-2", style: { fontWeight: 300 } }, "search by username"),
                        React.createElement('div', { className: "flex gap-2" },
                            React.createElement('input', {
                                type: "text",
                                value: searchTerm,
                                onChange: (e) => setSearchTerm(e.target.value),
                                onKeyPress: (e) => e.key === 'Enter' && handleSearchUsername(),
                                placeholder: "Enter username...",
                                className: "flex-grow px-4 py-2 border border-calm-300 rounded-lg focus:ring-2 focus:ring-calm-500 focus:outline-none",
                                style: { fontWeight: 300 }
                            }),
                            React.createElement('button', {
                                onClick: handleSearchUsername,
                                disabled: isSearching,
                                className: "px-4 py-2 bg-calm-600 text-white rounded-lg hover:bg-calm-700 transition disabled:opacity-50",
                                style: { fontWeight: 400 }
                            }, React.createElement(SearchIcon))
                        )
                    ),

                    // Search by friend code
                    React.createElement('div', null,
                        React.createElement('label', { className: "block text-sm text-calm-600 mb-2", style: { fontWeight: 300 } }, "or add by friend code"),
                        React.createElement('div', { className: "flex gap-2" },
                            React.createElement('input', {
                                type: "text",
                                value: friendCodeInput,
                                onChange: (e) => setFriendCodeInput(e.target.value.toUpperCase()),
                                onKeyPress: (e) => e.key === 'Enter' && handleSearchByCode(),
                                placeholder: "ABC12345",
                                maxLength: 8,
                                className: "flex-grow px-4 py-2 border border-calm-300 rounded-lg focus:ring-2 focus:ring-calm-500 focus:outline-none font-mono",
                                style: { fontWeight: 300, letterSpacing: '0.1em' }
                            }),
                            React.createElement('button', {
                                onClick: handleSearchByCode,
                                disabled: isSearching,
                                className: "px-4 py-2 bg-calm-600 text-white rounded-lg hover:bg-calm-700 transition disabled:opacity-50",
                                style: { fontWeight: 400 }
                            }, "Add")
                        )
                    ),

                    // Search Result
                    searchResult && React.createElement('div', { className: "mt-4 p-4 bg-calm-50 rounded-lg border border-calm-200" },
                        React.createElement('div', { className: "flex justify-between items-center" },
                            React.createElement('div', null,
                                React.createElement('p', { className: "text-lg text-calm-800", style: { fontWeight: 400 } }, `@${searchResult.username}`),
                                React.createElement('p', { className: "text-sm text-calm-600", style: { fontWeight: 300 } },
                                    `${searchResult.stats?.totalHours?.toFixed(1) || 0}h studied`
                                )
                            ),
                            React.createElement('button', {
                                onClick: () => handleSendRequest(searchResult),
                                className: "px-4 py-2 bg-accent-blue text-white rounded-lg hover:opacity-90 transition",
                                style: { fontWeight: 400, backgroundColor: '#6B8DD6' }
                            }, "Send Request")
                        )
                    )
                ),

                // Friend Requests
                friendRequests.length > 0 && React.createElement('div', { className: "bg-white rounded-xl soft-shadow p-6" },
                    React.createElement('h3', { className: "text-xl text-calm-800 mb-4", style: { fontWeight: 300 } },
                        `friend requests (${friendRequests.length})`
                    ),
                    React.createElement('div', { className: "space-y-3" },
                        friendRequests.map(request =>
                            React.createElement('div', {
                                key: request.id,
                                className: "p-4 bg-calm-50 rounded-lg border border-calm-200 flex justify-between items-center"
                            },
                                React.createElement('div', null,
                                    React.createElement('p', { className: "text-lg text-calm-800", style: { fontWeight: 400 } },
                                        `@${request.fromUsername}`
                                    ),
                                    React.createElement('p', { className: "text-sm text-calm-600", style: { fontWeight: 300 } },
                                        formatDate(request.createdAt)
                                    )
                                ),
                                React.createElement('div', { className: "flex gap-2" },
                                    React.createElement('button', {
                                        onClick: () => handleAcceptRequest(request),
                                        className: "p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                                    }, React.createElement(CheckIcon)),
                                    React.createElement('button', {
                                        onClick: () => handleDeclineRequest(request),
                                        className: "p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                                    }, React.createElement(XIcon))
                                )
                            )
                        )
                    )
                ),

                // Nous Requests
                nousRequests.length > 0 && React.createElement('div', { className: "bg-white rounded-xl soft-shadow p-6" },
                    React.createElement('h3', { className: "text-xl text-calm-800 mb-4", style: { fontWeight: 300 } },
                        `nous together requests (${nousRequests.length})`
                    ),
                    React.createElement('div', { className: "space-y-3" },
                        nousRequests.map(request =>
                            React.createElement('div', {
                                key: request.id,
                                className: "p-4 bg-purple-50 rounded-lg border border-purple-200 flex justify-between items-center"
                            },
                                React.createElement('div', null,
                                    React.createElement('p', { className: "text-lg text-calm-800", style: { fontWeight: 400 } },
                                        `@${request.fromUsername} wants to Nous together`
                                    ),
                                    React.createElement('p', { className: "text-sm text-calm-600", style: { fontWeight: 300 } },
                                        formatDate(request.createdAt)
                                    )
                                ),
                                React.createElement('div', { className: "flex gap-2" },
                                    React.createElement('button', {
                                        onClick: () => handleOpenAcceptModal(request),
                                        className: "px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm",
                                        style: { fontWeight: 400 }
                                    }, "accept"),
                                    React.createElement('button', {
                                        onClick: () => handleDeclineNousRequest(request),
                                        className: "px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition text-sm",
                                        style: { fontWeight: 400 }
                                    }, "decline")
                                )
                            )
                        )
                    )
                ),

                // My Friends List
                React.createElement('div', { className: "bg-white rounded-xl soft-shadow p-6 mb-6" },
                    React.createElement('h3', { className: "text-xl text-calm-800 mb-4", style: { fontWeight: 300 } },
                        `my friends (${friends.length})`
                    ),
                    friends.length > 0 ?
                        React.createElement('div', { className: "space-y-3" },
                            friends.map(friend =>
                                React.createElement('div', {
                                    key: friend.friendshipId,
                                    className: "p-4 bg-calm-50 rounded-lg border border-calm-200 hover:border-calm-300 transition"
                                },
                                    React.createElement('div', { className: "flex flex-col gap-3" },
                                        React.createElement('div', { className: "flex justify-between items-start" },
                                            React.createElement('div', { className: "flex-grow" },
                                                React.createElement('div', { className: "flex items-center gap-2 mb-1" },
                                                    React.createElement('p', { className: "text-lg text-calm-800", style: { fontWeight: 400 } },
                                                        `@${friend.username}`
                                                    ),
                                                    // Active indicator when friend is currently working (verified by lastActive timestamp)
                                                    (() => {
                                                        if (!friend.currentTopic || !friend.lastActive) return null;

                                                        const lastActiveDate = friend.lastActive.toDate ? friend.lastActive.toDate() : new Date(friend.lastActive);
                                                        const now = new Date();
                                                        const threeMinutesAgo = new Date(now.getTime() - 3 * 60 * 1000);

                                                        // Only show active if lastActive was within the last 3 minutes
                                                        const isActive = lastActiveDate >= threeMinutesAgo;

                                                        if (!isActive) return null;

                                                        return React.createElement('div', {
                                                            className: "flex items-center gap-1 px-2 py-0.5 bg-green-100 rounded-full",
                                                            title: "Currently active"
                                                        },
                                                            React.createElement('div', {
                                                                className: "w-2 h-2 bg-green-500 rounded-full animate-pulse"
                                                            }),
                                                            React.createElement('span', { className: "text-xs text-green-700", style: { fontWeight: 400 } },
                                                                "Active"
                                                            )
                                                        );
                                                    })()
                                                ),
                                                // Current topic - more prominent when active
                                                friend.currentTopic && React.createElement('div', { className: "mb-2 p-2 bg-blue-50 rounded-lg border border-blue-200" },
                                                    React.createElement('div', { className: "flex items-center gap-2" },
                                                        React.createElement('span', { className: "text-sm text-blue-600", style: { fontWeight: 400 } },
                                                            `📚 Working on: ${friend.currentTopic}`
                                                        )
                                                    )
                                                ),
                                                React.createElement('div', { className: "flex items-center gap-4 text-sm text-calm-600", style: { fontWeight: 300 } },
                                                    React.createElement('span', null,
                                                        `${friend.stats?.totalHours?.toFixed(1) || 0}h total`
                                                    ),
                                                    friend.stats?.currentStreak > 0 && React.createElement('span', null,
                                                        `${friend.stats.currentStreak} day streak 🔥`
                                                    )
                                                ),
                                                // Today's hours
                                                React.createElement('div', { className: "flex items-center gap-4 text-sm text-calm-700 mt-1", style: { fontWeight: 300 } },
                                                    React.createElement('span', null,
                                                        `Today: ${friend.stats?.hoursToday?.toFixed(1) || 0}h`
                                                    )
                                                )
                                            ),
                                            React.createElement('button', {
                                                onClick: () => handleUnfriend(friend),
                                                className: "text-sm text-calm-500 hover:text-red-600 transition",
                                                style: { fontWeight: 300 }
                                            }, "Unfriend")
                                        ),
                                        // Nous together button
                                        React.createElement('button', {
                                            onClick: () => handleOpenNousModal(friend),
                                            className: "px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition text-xs",
                                            style: { fontWeight: 400 }
                                        }, "Nous together")
                                    )
                                )
                            )
                        ) :
                        React.createElement('p', { className: "text-center text-calm-500 py-8", style: { fontWeight: 300 } },
                            "No friends yet. Add some friends to get started!"
                        )
                ),

                // Suggested Friends List (now includes friends of friends automatically)
                React.createElement('div', { className: "bg-white rounded-xl soft-shadow p-6" },
                    React.createElement('h3', { className: "text-xl text-calm-800 mb-4", style: { fontWeight: 300 } },
                        "suggested friends"
                    ),
                    suggestedFriends.length > 0 ?
                        React.createElement('div', { className: "space-y-3" },
                            suggestedFriends.map(suggested =>
                                React.createElement('div', {
                                    key: suggested.id,
                                    className: "p-4 bg-calm-50 rounded-lg border border-calm-200 hover:border-calm-300 transition flex justify-between items-start"
                                },
                                    React.createElement('div', { className: "flex-grow" },
                                        React.createElement('p', { className: "text-lg text-calm-800 mb-1", style: { fontWeight: 400 } },
                                            `@${suggested.username}${suggested.isFounder ? ' 🧑‍💼' : ''}`
                                        ),
                                        React.createElement('div', { className: "flex items-center gap-4 text-sm text-calm-600", style: { fontWeight: 300 } },
                                            React.createElement('span', null,
                                                `${suggested.stats?.totalHours?.toFixed(1) || 0}h total`
                                            ),
                                            suggested.stats?.currentStreak > 0 && React.createElement('span', null,
                                                `${suggested.stats.currentStreak} day streak 🔥`
                                            )
                                        ),
                                        suggested.isFounder && React.createElement('p', { className: "text-sm text-calm-600 mt-1", style: { fontWeight: 300 } },
                                            "creator of nous"
                                        ),
                                        // Show mutual friend info for friends of friends
                                        suggested.isFriendOfFriend && React.createElement('p', { className: "text-sm text-calm-600 mt-1", style: { fontWeight: 300 } },
                                            `via @${suggested.mutualFriend}`
                                        )
                                    ),
                                    React.createElement('button', {
                                        onClick: () => {
                                            setSearchTerm(suggested.username);
                                            handleSearchUsername(suggested.username);
                                        },
                                        className: "px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm",
                                        style: { fontWeight: 400 }
                                    }, "Add")
                                )
                            )
                        ) :
                        React.createElement('p', { className: "text-center text-calm-500 py-4", style: { fontWeight: 300 } },
                            "No suggested friends at the moment"
                        )
                ),

                // Nous Together Modal (Send Request)
                showNousModal && React.createElement('div', {
                    className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",
                    onClick: () => {
                        setShowNousModal(false);
                        setSelectedFriends([]);
                        setSelectedHabit(null);
                    }
                },
                    React.createElement('div', {
                        className: "bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto",
                        onClick: (e) => e.stopPropagation()
                    },
                        React.createElement('h3', { className: "text-2xl text-calm-800 mb-4", style: { fontWeight: 400 } },
                            "Nous Together"
                        ),

                        // Select Friends Section
                        React.createElement('div', { className: "mb-6" },
                            React.createElement('h4', { className: "text-lg text-calm-700 mb-3", style: { fontWeight: 400 } },
                                `Select friends (${selectedFriends.length}/4 selected)`
                            ),
                            React.createElement('div', { className: "space-y-2 max-h-48 overflow-y-auto border border-calm-200 rounded-lg p-3" },
                                friends.map(friend =>
                                    React.createElement('label', {
                                        key: friend.userId,
                                        className: "flex items-center gap-3 p-2 hover:bg-calm-50 rounded cursor-pointer"
                                    },
                                        React.createElement('input', {
                                            type: "checkbox",
                                            checked: selectedFriends.some(f => f.userId === friend.userId),
                                            onChange: () => handleToggleFriend(friend),
                                            className: "w-4 h-4 text-purple-600"
                                        }),
                                        React.createElement('span', { className: "text-calm-800", style: { fontWeight: 400 } },
                                            `@${friend.username}`
                                        )
                                    )
                                )
                            )
                        ),

                        // Select Habit Section
                        React.createElement('div', { className: "mb-6" },
                            React.createElement('h4', { className: "text-lg text-calm-700 mb-3", style: { fontWeight: 400 } },
                                "What are you working on?"
                            ),
                            React.createElement('div', { className: "space-y-2 max-h-48 overflow-y-auto border border-calm-200 rounded-lg p-3" },
                                habits.length === 0 ?
                                    React.createElement('p', { className: "text-calm-500 text-center py-4", style: { fontWeight: 300 } },
                                        "No habits yet. Create one in the Dashboard first!"
                                    ) :
                                    habits.map(habit =>
                                        React.createElement('label', {
                                            key: habit.id,
                                            className: "flex items-center gap-3 p-2 hover:bg-calm-50 rounded cursor-pointer"
                                        },
                                            React.createElement('input', {
                                                type: "radio",
                                                name: "habit",
                                                checked: selectedHabit?.id === habit.id,
                                                onChange: () => setSelectedHabit(habit),
                                                className: "w-4 h-4 text-purple-600"
                                            }),
                                            React.createElement('span', { className: "text-calm-800", style: { fontWeight: 400 } },
                                                habit.name
                                            )
                                        )
                                    )
                            )
                        ),

                        // Action Buttons
                        React.createElement('div', { className: "flex gap-3 justify-end" },
                            React.createElement('button', {
                                onClick: () => {
                                    setShowNousModal(false);
                                    setSelectedFriends([]);
                                    setSelectedHabit(null);
                                },
                                className: "px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition",
                                style: { fontWeight: 400 }
                            }, "Cancel"),
                            React.createElement('button', {
                                onClick: handleSendNousRequest,
                                disabled: selectedFriends.length === 0 || !selectedHabit,
                                className: `px-4 py-2 rounded-lg transition ${
                                    selectedFriends.length === 0 || !selectedHabit
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-purple-600 text-white hover:bg-purple-700'
                                }`,
                                style: { fontWeight: 400 }
                            }, "Send Request")
                        )
                    )
                ),

                // Accept Request Modal (With Habit Selection)
                showAcceptModal && React.createElement('div', {
                    className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",
                    onClick: () => {
                        setShowAcceptModal(false);
                        setAcceptingRequest(null);
                        setSelectedHabit(null);
                    }
                },
                    React.createElement('div', {
                        className: "bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto",
                        onClick: (e) => e.stopPropagation()
                    },
                        React.createElement('h3', { className: "text-2xl text-calm-800 mb-4", style: { fontWeight: 400 } },
                            `Nous with @${acceptingRequest?.fromUsername}`
                        ),

                        React.createElement('p', { className: "text-calm-600 mb-4", style: { fontWeight: 300 } },
                            `They're working on: ${acceptingRequest?.fromHabitName}`
                        ),

                        // Select Your Habit
                        React.createElement('div', { className: "mb-6" },
                            React.createElement('h4', { className: "text-lg text-calm-700 mb-3", style: { fontWeight: 400 } },
                                "What will you work on?"
                            ),
                            React.createElement('div', { className: "space-y-2 max-h-64 overflow-y-auto border border-calm-200 rounded-lg p-3" },
                                habits.length === 0 ?
                                    React.createElement('p', { className: "text-calm-500 text-center py-4", style: { fontWeight: 300 } },
                                        "No habits yet. Create one in the Dashboard first!"
                                    ) :
                                    habits.map(habit =>
                                        React.createElement('label', {
                                            key: habit.id,
                                            className: "flex items-center gap-3 p-2 hover:bg-calm-50 rounded cursor-pointer"
                                        },
                                            React.createElement('input', {
                                                type: "radio",
                                                name: "acceptHabit",
                                                checked: selectedHabit?.id === habit.id,
                                                onChange: () => setSelectedHabit(habit),
                                                className: "w-4 h-4 text-purple-600"
                                            }),
                                            React.createElement('span', { className: "text-calm-800", style: { fontWeight: 400 } },
                                                habit.name
                                            )
                                        )
                                    )
                            )
                        ),

                        // Action Buttons
                        React.createElement('div', { className: "flex gap-3 justify-end" },
                            React.createElement('button', {
                                onClick: () => {
                                    setShowAcceptModal(false);
                                    setAcceptingRequest(null);
                                    setSelectedHabit(null);
                                },
                                className: "px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition",
                                style: { fontWeight: 400 }
                            }, "Cancel"),
                            React.createElement('button', {
                                onClick: handleAcceptNousRequest,
                                disabled: !selectedHabit,
                                className: `px-4 py-2 rounded-lg transition ${
                                    !selectedHabit
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-purple-600 text-white hover:bg-purple-700'
                                }`,
                                style: { fontWeight: 400 }
                            }, "Accept & Join")
                        )
                    )
                )
            );
        };


        // --- Leaderboard Page Component ---
        const Leaderboard = ({ db, userId, setNotification, userProfile }) => {
            const [friendsData, setFriendsData] = useState([]);
            const [friendsDailyData, setFriendsDailyData] = useState({}); // Store daily data
            const [friendsWeeklyData, setFriendsWeeklyData] = useState({}); // Store weekly data
            const [friendsMonthlyData, setFriendsMonthlyData] = useState({}); // Store monthly data
            const [selectedMetric, setSelectedMetric] = useState('totalHours');
            const [isLoading, setIsLoading] = useState(true);

            // Helper function to calculate daily study hours for a user
            const calculateDailyHours = async (userId) => {
                try {
                    const appId = typeof __app_id !== 'undefined' ? __app_id : 'study-tracker-app';
                    const sessionsQuery = window.collection(db, `/artifacts/${appId}/users/${userId}/sessions`);

                    // Calculate the start and end of today
                    const now = new Date();
                    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    startOfDay.setHours(0, 0, 0, 0); // Start of day

                    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    endOfDay.setHours(23, 59, 59, 999); // End of day

                    const snapshot = await window.getDocs(sessionsQuery);
                    const sessions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                    // Filter sessions to only those from today
                    const dailySessions = sessions.filter(session => {
                        const sessionDate = session.startTime.toDate();
                        return sessionDate >= startOfDay && sessionDate <= endOfDay;
                    });

                    // Calculate total hours for the day
                    const dailyTotalMs = dailySessions.reduce((sum, s) => sum + (s.duration || 0), 0);
                    const dailyTotalHours = dailyTotalMs / (1000 * 60 * 60);

                    return dailyTotalHours;
                } catch (error) {
                    console.error(`Error calculating daily hours for user ${userId}:`, error);
                    return 0;
                }
            };

            // Helper function to calculate weekly study hours for a user
            const calculateWeeklyHours = async (userId) => {
                try {
                    const appId = typeof __app_id !== 'undefined' ? __app_id : 'study-tracker-app';
                    const sessionsQuery = window.collection(db, `/artifacts/${appId}/users/${userId}/sessions`);
                    
                    // Calculate the start of the current week (Monday)
                    const now = new Date();
                    const dayOfWeek = now.getDay(); // 0 (Sunday) to 6 (Saturday)
                    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust to make Monday 0
                    
                    const startOfCurrentWeek = new Date(now);
                    startOfCurrentWeek.setDate(now.getDate() - daysSinceMonday);
                    startOfCurrentWeek.setHours(0, 0, 0, 0); // Start of day

                    const endOfCurrentWeek = new Date(startOfCurrentWeek);
                    endOfCurrentWeek.setDate(startOfCurrentWeek.getDate() + 7);
                    endOfCurrentWeek.setHours(23, 59, 59, 999); // End of day

                    const snapshot = await window.getDocs(sessionsQuery);
                    const sessions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    
                    // Filter sessions to only those in the current week
                    const weeklySessions = sessions.filter(session => {
                        const sessionDate = session.startTime.toDate();
                        return sessionDate >= startOfCurrentWeek && sessionDate <= endOfCurrentWeek;
                    });

                    // Calculate total hours for the week
                    const weeklyTotalMs = weeklySessions.reduce((sum, s) => sum + (s.duration || 0), 0);
                    const weeklyTotalHours = weeklyTotalMs / (1000 * 60 * 60);
                    
                    return weeklyTotalHours;
                } catch (error) {
                    console.error(`Error calculating weekly hours for user ${userId}:`, error);
                    return 0;
                }
            };

            // Helper function to calculate monthly study hours for a user
            const calculateMonthlyHours = async (userId) => {
                try {
                    const appId = typeof __app_id !== 'undefined' ? __app_id : 'study-tracker-app';
                    const sessionsQuery = window.collection(db, `/artifacts/${appId}/users/${userId}/sessions`);
                    
                    // Calculate the start of the current month
                    const now = new Date();
                    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                    startOfMonth.setHours(0, 0, 0, 0); // Start of day

                    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                    endOfMonth.setHours(23, 59, 59, 999); // End of day

                    const snapshot = await window.getDocs(sessionsQuery);
                    const sessions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    
                    // Filter sessions to only those in the current month
                    const monthlySessions = sessions.filter(session => {
                        const sessionDate = session.startTime.toDate();
                        return sessionDate >= startOfMonth && sessionDate <= endOfMonth;
                    });

                    // Calculate total hours for the month
                    const monthlyTotalMs = monthlySessions.reduce((sum, s) => sum + (s.duration || 0), 0);
                    const monthlyTotalHours = monthlyTotalMs / (1000 * 60 * 60);
                    
                    return monthlyTotalHours;
                } catch (error) {
                    console.error(`Error calculating monthly hours for user ${userId}:`, error);
                    return 0;
                }
            };

            // Load friends and their stats
            useEffect(() => {
                if (!db || !userId) return;

                const fetchLeaderboard = async () => {
                    try {
                        // Get all friendships
                        const friendshipsQuery1 = window.query(
                            window.collection(db, 'friendships'),
                            window.where('user1Id', '==', userId)
                        );
                        const friendshipsQuery2 = window.query(
                            window.collection(db, 'friendships'),
                            window.where('user2Id', '==', userId)
                        );

                        const [snap1, snap2] = await Promise.all([
                            window.getDocs(friendshipsQuery1),
                            window.getDocs(friendshipsQuery2)
                        ]);

                        const allFriendsData = [];

                        // Get stats for each friend
                        for (const doc of [...snap1.docs, ...snap2.docs]) {
                            const data = doc.data();
                            const friendId = data.user1Id === userId ? data.user2Id : data.user1Id;

                            // Fetch friend's profile
                            const friendDocRef = window.doc(db, 'users', friendId);
                            const friendSnapshot = await window.getDoc(friendDocRef);
                            const friendData = friendSnapshot.data();

                            if (friendData && friendData.stats) {
                                allFriendsData.push({
                                    userId: friendId,
                                    username: data.user1Id === userId ? data.user2Username : data.user1Username,
                                    stats: friendData.stats,
                                    isCurrentUser: false
                                });
                            }
                        }

                        // Add current user to leaderboard
                        if (userProfile && userProfile.stats) {
                            allFriendsData.push({
                                userId: userId,
                                username: userProfile.username,
                                stats: userProfile.stats,
                                isCurrentUser: true
                            });
                        }

                        // Calculate daily hours for all friends
                        const dailyData = {};
                        for (const friend of allFriendsData) {
                            const dailyHours = await calculateDailyHours(friend.userId);
                            dailyData[friend.userId] = dailyHours;
                        }
                        setFriendsDailyData(dailyData);

                        // Calculate weekly hours for all friends
                        const weeklyData = {};
                        for (const friend of allFriendsData) {
                            const weeklyHours = await calculateWeeklyHours(friend.userId);
                            weeklyData[friend.userId] = weeklyHours;
                        }
                        setFriendsWeeklyData(weeklyData);

                        // Calculate monthly hours for all friends
                        const monthlyData = {};
                        for (const friend of allFriendsData) {
                            const monthlyHours = await calculateMonthlyHours(friend.userId);
                            monthlyData[friend.userId] = monthlyHours;
                        }
                        setFriendsMonthlyData(monthlyData);

                        setFriendsData(allFriendsData);
                        setIsLoading(false);
                    } catch (error) {
                        console.error("Error fetching leaderboard:", error);
                        setNotification({ type: 'error', message: 'Failed to load leaderboard: ' + error.message });
                        setIsLoading(false);
                    }
                };

                fetchLeaderboard();
            }, [db, userId, userProfile]);

            // Sort friends by selected metric
            const sortedFriends = [...friendsData].sort((a, b) => {
                let aValue, bValue;

                if (selectedMetric === 'dailyHours') {
                    aValue = friendsDailyData[a.userId] || 0;
                    bValue = friendsDailyData[b.userId] || 0;
                } else if (selectedMetric === 'weeklyHours') {
                    aValue = friendsWeeklyData[a.userId] || 0;
                    bValue = friendsWeeklyData[b.userId] || 0;
                } else if (selectedMetric === 'monthlyHours') {
                    aValue = friendsMonthlyData[a.userId] || 0;
                    bValue = friendsMonthlyData[b.userId] || 0;
                } else {
                    aValue = a.stats?.[selectedMetric] || 0;
                    bValue = b.stats?.[selectedMetric] || 0;
                }

                return bValue - aValue;
            });

            // Get current user's rank
            const currentUserIndex = sortedFriends.findIndex(f => f.isCurrentUser);
            const currentUserRank = currentUserIndex + 1;

            // Get motivational message
            const getMotivationalMessage = () => {
                if (sortedFriends.length === 0) return "Add friends to compete!";
                if (currentUserRank === 1) return "You're leading the pack! 🎉";
                if (currentUserRank === 2) return "So close to #1! Keep going! 💪";
                if (currentUserRank === 3) return "Great work! Push for the podium! 🚀";

                const nextFriend = sortedFriends[currentUserRank - 2];

                let diff;
                if (selectedMetric === 'dailyHours') {
                    const currentUserDailyHours = friendsDailyData[userId] || 0;
                    const nextFriendDailyHours = friendsDailyData[nextFriend.userId] || 0;
                    diff = nextFriendDailyHours - currentUserDailyHours;
                } else if (selectedMetric === 'weeklyHours') {
                    const currentUserWeeklyHours = friendsWeeklyData[userId] || 0;
                    const nextFriendWeeklyHours = friendsWeeklyData[nextFriend.userId] || 0;
                    diff = nextFriendWeeklyHours - currentUserWeeklyHours;
                } else if (selectedMetric === 'monthlyHours') {
                    const currentUserMonthlyHours = friendsMonthlyData[userId] || 0;
                    const nextFriendMonthlyHours = friendsMonthlyData[nextFriend.userId] || 0;
                    diff = nextFriendMonthlyHours - currentUserMonthlyHours;
                } else {
                    diff = nextFriend.stats?.[selectedMetric] - (userProfile?.stats?.[selectedMetric] || 0);
                }

                if (selectedMetric === 'totalHours' || selectedMetric === 'dailyHours' || selectedMetric === 'weeklyHours' || selectedMetric === 'monthlyHours') {
                    return `${diff.toFixed(1)}h to reach #${currentUserRank - 1} 🚀`;
                } else if (selectedMetric === 'currentStreak') {
                    return `${Math.ceil(diff)} days to reach #${currentUserRank - 1} 🚀`;
                } else if (selectedMetric === 'longestSession') {
                    return `${diff.toFixed(1)}h to reach #${currentUserRank - 1} 🚀`;
                }
            };

            // Format metric value
            const formatMetricValue = (user, metric) => {
                if (metric === 'dailyHours') {
                    const dailyHours = friendsDailyData[user.userId] || 0;
                    return `${dailyHours.toFixed(1)} hours today`;
                } else if (metric === 'weeklyHours') {
                    const weeklyHours = friendsWeeklyData[user.userId] || 0;
                    return `${weeklyHours.toFixed(1)} hours this week`;
                } else if (metric === 'monthlyHours') {
                    const monthlyHours = friendsMonthlyData[user.userId] || 0;
                    return `${monthlyHours.toFixed(1)} hours this month`;
                } else if (metric === 'totalHours') {
                    return `${user.stats?.[metric]?.toFixed(1) || 0} hours`;
                } else if (metric === 'currentStreak') {
                    return `${Math.floor(user.stats?.[metric] || 0)} day${(user.stats?.[metric] || 0) !== 1 ? 's' : ''}`;
                } else if (metric === 'longestSession') {
                    return `${(user.stats?.[metric] || 0).toFixed(1)} hours`;
                } else {
                    return `${Math.floor(user.stats?.[metric] || 0)} session${(user.stats?.[metric] || 0) !== 1 ? 's' : ''}`;
                }
            };

            // Get medal emoji
            const getMedal = (rank) => {
                if (rank === 1) return '🥇';
                if (rank === 2) return '🥈';
                if (rank === 3) return '🥉';
                return '';
            };

            if (isLoading) {
                return React.createElement('div', { className: "flex justify-center items-center p-8" },
                    React.createElement(LoaderIcon),
                    React.createElement('span', { className: "ml-2" }, "loading leaderboard...")
                );
            }

            return React.createElement('div', { className: "max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6" },
                // Header
                React.createElement('h2', { className: "text-3xl text-calm-800 mb-2", style: { fontWeight: 300 } }, "leaderboard"),

                // Metric Selector
                React.createElement('div', { className: "bg-white rounded-xl soft-shadow p-6" },
                    React.createElement('div', { className: "flex flex-wrap gap-2" },
                        [
                            { key: 'currentStreak', label: 'Current Streak' },
                            { key: 'dailyHours', label: 'Daily Hours' },
                            { key: 'weeklyHours', label: 'Weekly Hours' },
                            { key: 'monthlyHours', label: 'Monthly Hours' },
                            { key: 'totalHours', label: 'Total Hours' },
                            { key: 'longestSession', label: 'Longest Session' }
                        ].map(metric =>
                            React.createElement('button', {
                                key: metric.key,
                                onClick: () => setSelectedMetric(metric.key),
                                className: `px-4 py-2 rounded-lg transition ${
                                    selectedMetric === metric.key
                                        ? 'bg-calm-600 text-white'
                                        : 'bg-calm-100 text-calm-700 hover:bg-calm-200'
                                }`,
                                style: { fontWeight: selectedMetric === metric.key ? 400 : 300 }
                            }, metric.label)
                        )
                    )
                ),

                // Leaderboard List
                React.createElement('div', { className: "bg-white rounded-xl soft-shadow p-6" },
                    sortedFriends.length > 0 ?
                        React.createElement('div', { className: "space-y-2" },
                            sortedFriends.map((friend, index) => {
                                const rank = index + 1;
                                const medal = getMedal(rank);
                                const value = friend.stats?.[selectedMetric] || 0;

                                return React.createElement('div', {
                                    key: friend.userId,
                                    className: `p-4 rounded-lg border-2 transition ${
                                        friend.isCurrentUser
                                            ? 'bg-blue-50 border-blue-200'
                                            : 'bg-calm-50 border-calm-200 hover:border-calm-300'
                                    }`
                                },
                                    React.createElement('div', { className: "flex justify-between items-center" },
                                        React.createElement('div', { className: "flex items-center gap-3" },
                                            React.createElement('span', {
                                                className: "text-2xl w-8 text-center",
                                                style: { fontWeight: 300 }
                                            }, medal || rank),
                                            React.createElement('div', null,
                                                React.createElement('p', {
                                                    className: `text-lg ${friend.isCurrentUser ? 'text-blue-800' : 'text-calm-800'}`,
                                                    style: { fontWeight: 400 }
                                                }, `@${friend.username}${friend.isCurrentUser ? ' (you)' : ''}`),
                                                React.createElement('p', {
                                                    className: "text-sm text-calm-600",
                                                    style: { fontWeight: 300 }
                                                }, formatMetricValue(friend, selectedMetric))
                                            )
                                        ),
                                        friend.isCurrentUser && React.createElement('div', {
                                            className: "px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm",
                                            style: { fontWeight: 400 }
                                        }, `#${rank}`)
                                    )
                                );
                            })
                        ) :
                        React.createElement('p', { className: "text-center text-calm-500 py-8", style: { fontWeight: 300 } },
                            "Add friends to see the leaderboard!"
                        )
                ),

                // User Rank Summary
                sortedFriends.length > 0 && React.createElement('div', { className: "bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl soft-shadow p-6 text-center" },
                    React.createElement('p', { className: "text-2xl text-calm-800 mb-2", style: { fontWeight: 300 } },
                        currentUserRank > 0 ? `Your Rank: #${currentUserRank} of ${sortedFriends.length}` : 'Join the competition!'
                    ),
                    React.createElement('p', { className: "text-calm-600", style: { fontWeight: 300 } },
                        getMotivationalMessage()
                    )
                )
            );
        };
        // --- Main App Component ---
        function App() {
            // These would be provided by the environment (e.g., Netlify build environment variables)
            // For local testing, you would replace these with your actual Firebase config.
            const firebaseConfig = typeof __firebase_config !== 'undefined' 
                ? __firebase_config 
                : null;
                
            const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

            const [firebaseApp, setFirebaseApp] = useState(null);
            const [auth, setAuth] = useState(null);
            const [db, setDb] = useState(null);
            const [user, setUser] = useState(null);
            const [userId, setUserId] = useState(null);
            const [isAuthReady, setIsAuthReady] = useState(false);
            const [currentPage, setCurrentPage] = useState('dashboard');
            const [notification, setNotification] = useState(null);
            const [userProfile, setUserProfile] = useState(null);
            const [configError, setConfigError] = useState(null);
            const [firebaseReady, setFirebaseReady] = useState(window.firebaseSDKReady || false);
            const [showUsernameSetup, setShowUsernameSetup] = useState(false);
            const [newUsername, setNewUsername] = useState('');
            const [usernameError, setUsernameError] = useState('');
            const [isSettingUsername, setIsSettingUsername] = useState(false);

            // Timer state lifted to App level so it persists across page navigation
            const [activeTimers, setActiveTimers] = useState({});
            const timerIntervals = useRef({});

            // Night mode state
            const [isNightMode, setIsNightMode] = useState(() => {
                const saved = localStorage.getItem('nightMode');
                console.log('Initial night mode from localStorage:', saved);
                return saved === 'true';
            });

            // Apply night mode to body
            useEffect(() => {
                console.log('=== Night mode useEffect triggered ===');
                console.log('isNightMode value:', isNightMode);
                console.log('isNightMode type:', typeof isNightMode);
                console.log('Body element:', document.body);
                console.log('Current body classes before change:', document.body.className);

                if (isNightMode) {
                    document.body.classList.add('night-mode');
                    console.log('✓ Added night-mode class');
                } else {
                    document.body.classList.remove('night-mode');
                    console.log('✓ Removed night-mode class');
                }

                localStorage.setItem('nightMode', isNightMode);
                console.log('Current body classes after change:', document.body.className);
                console.log('Has night-mode class?', document.body.classList.contains('night-mode'));
                console.log('Computed background color:', window.getComputedStyle(document.body).backgroundColor);
                console.log('=== End useEffect ===');
            }, [isNightMode]);

            // Listen for Firebase SDK ready event
            useEffect(() => {
                if (window.firebaseSDKReady) {
                    setFirebaseReady(true);
                } else {
                    const handleFirebaseReady = () => setFirebaseReady(true);
                    window.addEventListener('firebaseReady', handleFirebaseReady, { once: true });
                    return () => window.removeEventListener('firebaseReady', handleFirebaseReady);
                }
            }, []);

            useEffect(() => {
                // Check if Firebase is available (not in offline mode)
                if (!window.__isFirebaseAvailable) {
                    console.warn("⚠️  Running in offline mode. Cloud features disabled.");
                    // Don't show error - just run in offline mode
                    setIsAuthReady(true);
                    // Enable offline guest mode
                    const offlineId = 'offline-guest-' + Date.now();
                    setUserId(offlineId);
                    setUser({ isAnonymous: true, uid: offlineId, displayName: 'Offline Mode' });
                    // Show notification instead of blocking error
                    setNotification({
                        type: 'info',
                        message: 'Running in offline mode. Data stored locally only.'
                    });
                    return;
                }

                if (!firebaseReady) return;

                // Validate Firebase config
                if (!firebaseConfig || !firebaseConfig.apiKey || !firebaseConfig.projectId) {
                    const errorMsg = "Firebase configuration is missing required values. Please check your environment variables.";
                    console.error(errorMsg);
                    setConfigError(errorMsg);
                    setIsAuthReady(true);
                    return;
                }

                // Wrap async operations in an async function
                (async () => {
                    try {
                        // Check if Firebase app is already initialized to avoid duplicate initialization
                        let app;
                        try {
                            app = window.initializeApp(firebaseConfig);
                        } catch (error) {
                            if (error.code === 'app/duplicate-app' || error.message.includes('already exists')) {
                                app = window.getApp(); // Get the existing app
                            } else {
                                throw error; // Re-throw if it's a different error
                            }
                        }

                        const authInstance = window.getAuth(app);

                        // Initialize Firestore with persistent cache (modern API, no deprecation warnings)
                        let dbInstance;
                        try {
                            dbInstance = window.initializeFirestore(app, {
                                localCache: window.persistentLocalCache({
                                    tabManager: window.persistentMultipleTabManager()
                                })
                            });
                        } catch (err) {
                            // Already initialized, use existing instance
                            dbInstance = window.getFirestore(app);
                        }

                        setFirebaseApp(app);
                        setAuth(authInstance);
                        setDb(dbInstance);

                        // Expose to window for debugging
                        window.db = dbInstance;
                        window.auth = authInstance;

                        const unsubscribe = window.onAuthStateChanged(authInstance, async (user) => {
                        if (user) {
                            setUser(user);
                            setUserId(user.uid);
                            // Expose to window for debugging
                            window.userId = user.uid;
                        } else {
                            // If no user and an initial token exists, try to sign in with it.
                            // This handles the case where the Canvas environment provides a token.
                            if(initialAuthToken) {
                                 try {
                                    await window.signInWithCustomToken(authInstance, initialAuthToken);
                                    // The onAuthStateChanged will re-trigger with the new user.
                                 } catch (error) {
                                     console.error("Custom token sign-in failed, trying anonymous:", error);
                                     await window.signInAnonymously(authInstance); // Fallback to anonymous
                                 }
                            } else {
                                // Otherwise, no user and no token, so clear state.
                                setUser(null);
                                setUserId(null);
                                // Clear window references
                                window.userId = null;
                            }
                        }
                        setIsAuthReady(true);
                        });
                        return unsubscribe;
                    } catch (error) {
                        console.error("Firebase initialization error:", error);
                        setConfigError(`Firebase initialization failed: ${error.message}`);
                        setIsAuthReady(true);
                        return null;
                    }
                })().then(unsubscribe => {
                    // Store unsubscribe function for cleanup
                    if (unsubscribe && typeof unsubscribe === 'function') {
                        window.__authUnsubscribe = unsubscribe;
                    }
                });

                // Return cleanup function
                return () => {
                    if (window.__authUnsubscribe && typeof window.__authUnsubscribe === 'function') {
                        window.__authUnsubscribe();
                        window.__authUnsubscribe = null;
                    }
                };
            }, [firebaseReady, JSON.stringify(firebaseConfig), initialAuthToken]); // Effect depends on config values and Firebase SDK being ready

            // User profile initialization
            useEffect(() => {
                if (!db || !userId || !auth) return;

                const userDocRef = window.doc(db, 'users', userId);

                // Use includeMetadataChanges to get cached data INSTANTLY
                const unsubscribe = window.onSnapshot(
                    userDocRef,
                    { includeMetadataChanges: true }, // Get cached data immediately, don't wait for server
                    async (snapshot) => {
                        const isGuest = auth.currentUser?.isAnonymous;
                        const fromCache = snapshot.metadata.fromCache;

                        if (!snapshot.exists()) {
                            // Only create new profile if we've checked the server (not from cache)
                            if (fromCache) {
                                console.log('⏳ Checking server for user profile...');
                                return; // Wait for server response
                            }

                            // Create new user profile (we confirmed user doesn't exist on server)
                            try {
                                const uniqueCode = await generateUniqueFriendCode(db);
                                await window.setDoc(userDocRef, {
                                    username: isGuest ? `guest_${userId.substring(0, 6)}` : '',
                                    email: auth.currentUser?.email || '',
                                    friendCode: uniqueCode,
                                    createdAt: window.Timestamp.now(),
                                    settings: {
                                        showStats: true,
                                        showActivity: true,
                                        allowFriendRequests: true
                                    },
                                    stats: {
                                        totalHours: 0,
                                        currentStreak: 0,
                                        totalSessions: 0,
                                        goalsCompleted: 0,
                                        treeLevel: 0,
                                        lastUpdated: window.Timestamp.now()
                                    }
                                });
                                // Show username setup ONLY for non-guests AND new users
                                if (!isGuest) {
                                    setShowUsernameSetup(true);
                                }
                            } catch (error) {
                                console.error("Error creating user profile:", error);
                            }
                        } else {
                            const data = snapshot.data();
                            setUserProfile(data);

                            if (fromCache) {
                                console.log('⚡ Loaded user profile from cache (instant!)');
                            }

                            // Check if user needs to set a username (and is not a guest)
                            // Only check when we have server data OR valid cached data with a username
                            if (!isGuest && (!data.username || data.username.startsWith('user_') || data.username === '')) {
                                // Only show username setup if we've confirmed with server (not cached old state)
                                if (!fromCache) {
                                    setShowUsernameSetup(true);
                                }
                            } else {
                                setShowUsernameSetup(false);
                            }

                            // Backfill friend code for existing users who don't have one (only when online)
                            if (!data.friendCode && !fromCache) {
                                try {
                                    const newFriendCode = await generateUniqueFriendCode(db);
                                    await window.setDoc(userDocRef, {
                                        friendCode: newFriendCode
                                    }, { merge: true });
                                    setUserProfile({ ...data, friendCode: newFriendCode });
                                } catch (error) {
                                    console.error("Error generating friend code:", error);
                                }
                            }
                        }
                    },
                    (error) => {
                        console.error("Error loading user profile:", error);
                        // Don't block UI on error - app continues with cached data
                    }
                );

                return () => unsubscribe();
            }, [db, userId, auth]);

            // Handle username submission
            const handleUsernameSubmit = async (e) => {
                e.preventDefault();
                if (!newUsername.trim()) {
                    setUsernameError('Username cannot be empty');
                    return;
                }

                if (newUsername.length < 3) {
                    setUsernameError('Username must be at least 3 characters');
                    return;
                }

                if (newUsername.length > 20) {
                    setUsernameError('Username must be less than 20 characters');
                    return;
                }

                if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
                    setUsernameError('Username can only contain letters, numbers, and underscores');
                    return;
                }

                setIsSettingUsername(true);
                setUsernameError('');

                try {
                    // Check if username is unique
                    const usersQuery = window.query(
                        window.collection(db, 'users'),
                        window.where('username', '==', newUsername.trim())
                    );
                    const snapshot = await window.getDocs(usersQuery);

                    if (!snapshot.empty && snapshot.docs[0].id !== userId) {
                        setUsernameError('Username already taken');
                        setIsSettingUsername(false);
                        return;
                    }

                    // Save username
                    const userDocRef = window.doc(db, 'users', userId);
                    await window.setDoc(userDocRef, {
                        username: newUsername.trim()
                    }, { merge: true });

                    setShowUsernameSetup(false);
                    setNewUsername('');
                    setNotification({ type: 'success', message: `Welcome, @${newUsername}!` });
                } catch (error) {
                    console.error("Error setting username:", error);
                    setUsernameError('Failed to set username. Please try again.');
                } finally {
                    setIsSettingUsername(false);
                }
            };

            // Notification timeout
            useEffect(() => {
                if (notification) {
                    const timer = setTimeout(() => setNotification(null), 5000);
                    return () => clearTimeout(timer);
                }
            }, [notification]);

            // Only show config error for actual configuration problems, not offline mode
            if (configError && window.__isFirebaseAvailable !== false) {
                return React.createElement('div', { className: "min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4" },
                    React.createElement('div', { className: "max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center" },
                        React.createElement('h2', { className: "text-2xl text-red-600 mb-4", style: { fontWeight: 400 } }, "Configuration Error"),
                        React.createElement('p', { className: "text-gray-700 mb-4", style: { fontWeight: 300 } }, configError),
                        React.createElement('p', { className: "text-gray-600 text-sm", style: { fontWeight: 300 } }, "Please contact the administrator to fix the configuration.")
                    )
                );
            }

            if (!isAuthReady) {
                return React.createElement('div', { className: "min-h-screen bg-gray-50 flex justify-center items-center" },
                    React.createElement(LoaderIcon),
                    React.createElement('span', { className: "text-xl ml-4" }, "Connecting...")
                );
            }

            return React.createElement('div', { className: "min-h-screen font-sans" },
                // Username Setup Modal
                showUsernameSetup && React.createElement('div', {
                    className: "fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50",
                    style: { backdropFilter: 'blur(4px)' }
                },
                    React.createElement('div', {
                        className: "bg-white rounded-2xl p-8 max-w-md w-full m-4 soft-shadow-lg",
                        onClick: (e) => e.stopPropagation()
                    },
                        React.createElement('div', { className: "text-center mb-6" },
                            React.createElement('h2', {
                                className: "text-3xl text-calm-800 mb-2",
                                style: { fontWeight: 300 }
                            }, "welcome to nous"),
                            React.createElement('p', {
                                className: "text-calm-600",
                                style: { fontWeight: 300 }
                            }, "choose a unique username to get started")
                        ),
                        React.createElement('form', { onSubmit: handleUsernameSubmit, className: "space-y-4" },
                            React.createElement('div', null,
                                React.createElement('label', {
                                    htmlFor: "username",
                                    className: "block text-sm text-calm-600 mb-2",
                                    style: { fontWeight: 300 }
                                }, "username"),
                                React.createElement('input', {
                                    id: "username",
                                    type: "text",
                                    value: newUsername,
                                    onChange: (e) => {
                                        setNewUsername(e.target.value);
                                        setUsernameError('');
                                    },
                                    placeholder: "your_username",
                                    autoFocus: true,
                                    disabled: isSettingUsername,
                                    className: "w-full px-4 py-3 border-2 border-calm-300 rounded-lg focus:ring-2 focus:ring-calm-500 focus:border-transparent focus:outline-none transition disabled:opacity-50",
                                    style: { fontWeight: 300 }
                                }),
                                usernameError && React.createElement('p', {
                                    className: "text-red-500 text-sm mt-2",
                                    style: { fontWeight: 300 }
                                }, usernameError)
                            ),
                            React.createElement('div', { className: "text-sm text-calm-600 space-y-1", style: { fontWeight: 300 } },
                                React.createElement('p', null, "• 3-20 characters"),
                                React.createElement('p', null, "• letters, numbers, and underscores only"),
                                React.createElement('p', null, "• must be unique")
                            ),
                            userProfile?.friendCode && React.createElement('div', { className: "bg-calm-50 p-4 rounded-lg" },
                                React.createElement('p', {
                                    className: "text-sm text-calm-600 mb-1",
                                    style: { fontWeight: 300 }
                                }, "your friend code:"),
                                React.createElement('p', {
                                    className: "font-mono text-xl text-calm-800",
                                    style: { fontWeight: 400, letterSpacing: '0.1em' }
                                }, userProfile.friendCode)
                            ),
                            React.createElement('button', {
                                type: "submit",
                                disabled: isSettingUsername || !newUsername.trim(),
                                className: "w-full py-3 bg-calm-600 text-white rounded-lg hover:bg-calm-700 transition disabled:opacity-50 flex items-center justify-center gap-2",
                                style: { fontWeight: 400 }
                            },
                                isSettingUsername && React.createElement(LoaderIcon),
                                isSettingUsername ? "creating..." : "continue"
                            )
                        )
                    )
                ),

                notification && React.createElement('div', {
                    className: `fixed top-5 right-5 p-4 rounded-2xl soft-shadow-lg text-white z-50 ${notification.type === 'success' ? 'neuron-pulse' : ''}`,
                    style: {
                        backgroundColor: notification.type === 'success' ? '#6B8DD6' : '#a8b3c7',
                        fontWeight: 300
                    }
                }, notification.message),

                !user ?
                    React.createElement(AuthComponent, { auth, setNotification }) :
                    React.createElement(React.Fragment, null,
                        React.createElement(Header, { setCurrentPage, currentPage }),
                        React.createElement('main', null,
                            currentPage === 'dashboard' && React.createElement(Dashboard, { db, userId, setNotification, activeTimers, setActiveTimers, timerIntervals }),
                            currentPage === 'goals' && React.createElement(Goals, { db, userId, setNotification }),
                            currentPage === 'friends' && React.createElement(Friends, { db, userId, setNotification, userProfile }),
                            currentPage === 'leaderboard' && React.createElement(Leaderboard, { db, userId, setNotification, userProfile }),
                            currentPage === 'reports' && React.createElement(Reports, { db, userId, setNotification }),
                            currentPage === 'about' && React.createElement(About),
                            currentPage === 'settings' && React.createElement(Settings, { auth, userId, db, userProfile, setNotification, isNightMode, setIsNightMode })
                        )
                    )
            );
        }

        // Render the app (React 18 syntax)
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(React.createElement(App));

        // Register Service Worker
        if ('serviceWorker' in navigator) {
            // Force clear ALL caches on load - nuclear option for stuck PWAs
            const APP_VERSION = '2025-10-24-v7-AUTO-MIGRATE'; // Update this to force refresh
            const storedVersion = localStorage.getItem('appVersion');

            if (storedVersion !== APP_VERSION) {
                console.log('Version mismatch detected! Clearing all caches...');
                // Clear all caches
                caches.keys().then(cacheNames => {
                    return Promise.all(
                        cacheNames.map(cacheName => {
                            console.log('Deleting cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                    );
                }).then(() => {
                    // Unregister all service workers
                    navigator.serviceWorker.getRegistrations().then(registrations => {
                        return Promise.all(
                            registrations.map(registration => {
                                console.log('Unregistering service worker');
                                return registration.unregister();
                            })
                        );
                    }).then(() => {
                        // Store new version
                        localStorage.setItem('appVersion', APP_VERSION);
                        console.log('Cache cleared! Reloading...');
                        // Hard reload from server
                        window.location.reload(true);
                    });
                });
                // Don't register SW yet, we're about to reload
            } else {
                // Version matches, proceed with normal SW registration
                window.addEventListener('load', () => {
                navigator.serviceWorker.register('/service-worker.js')
                    .then((registration) => {
                        console.log('ServiceWorker registered successfully:', registration.scope);

                        // Check for updates every 10 seconds (more aggressive)
                        setInterval(() => {
                            registration.update();
                        }, 10000);

                        // Listen for updates
                        registration.addEventListener('updatefound', () => {
                            const newWorker = registration.installing;
                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    // New service worker is installed and ready
                                    console.log('New version available! Reloading...');
                                    // Force reload to get new version
                                    window.location.reload(true);
                                }
                            });
                        });
                    })
                    .catch((error) => {
                        console.log('ServiceWorker registration failed:', error);
                    });
                });

                // Handle controller change (when new SW takes over)
                navigator.serviceWorker.addEventListener('controllerchange', () => {
                    console.log('New service worker activated, reloading...');
                    window.location.reload();
                });

                // Listen for messages from service worker
                navigator.serviceWorker.addEventListener('message', (event) => {
                    if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
                        console.log('Update available, version:', event.data.version);
                        // Reload immediately to get new version
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000); // Small delay to ensure everything is ready
                    }
                });
            }
        }

        // PWA Install Prompt
        let deferredPrompt;
        let installButton;

        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later
            deferredPrompt = e;
            // Update UI to show install button
            showInstallPromotion();
        });

        function showInstallPromotion() {
            // Create install button if it doesn't exist
            if (!installButton) {
                installButton = document.createElement('button');
                installButton.id = 'installButton';
                installButton.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    <span>Install App</span>
                `;
                installButton.style.cssText = `
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: #5d6b86;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 50px;
                    font-family: Satoshi, sans-serif;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(93, 107, 134, 0.3);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    z-index: 9999;
                    transition: all 0.3s ease;
                `;

                installButton.addEventListener('mouseenter', () => {
                    installButton.style.background = '#4a5568';
                    installButton.style.transform = 'translateY(-2px)';
                    installButton.style.boxShadow = '0 6px 16px rgba(93, 107, 134, 0.4)';
                });

                installButton.addEventListener('mouseleave', () => {
                    installButton.style.background = '#5d6b86';
                    installButton.style.transform = 'translateY(0)';
                    installButton.style.boxShadow = '0 4px 12px rgba(93, 107, 134, 0.3)';
                });

                installButton.addEventListener('click', async () => {
                    if (!deferredPrompt) {
                        return;
                    }
                    // Show the install prompt
                    deferredPrompt.prompt();
                    // Wait for the user to respond to the prompt
                    const { outcome } = await deferredPrompt.userChoice;
                    console.log(`User response to the install prompt: ${outcome}`);
                    // Clear the deferredPrompt
                    deferredPrompt = null;
                    // Hide the install button
                    hideInstallPromotion();
                });

                document.body.appendChild(installButton);
            }
        }

        function hideInstallPromotion() {
            if (installButton) {
                installButton.style.opacity = '0';
                setTimeout(() => {
                    if (installButton && installButton.parentNode) {
                        installButton.parentNode.removeChild(installButton);
                        installButton = null;
                    }
                }, 300);
            }
        }

        // Hide install button when app is installed
        window.addEventListener('appinstalled', () => {
            console.log('Nous PWA was installed');
            hideInstallPromotion();
            deferredPrompt = null;
        });

        // Check if app is already installed (standalone mode)
        if (window.matchMedia('(display-mode: standalone)').matches) {
            console.log('Running as installed PWA');
        }
