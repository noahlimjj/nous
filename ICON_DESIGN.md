# Timer/Stopwatch Icon Design

## Visual Overview

### Stopwatch Mode Icon (Default)
```
    ___
   /   \
  |  ⏱️  |  ← Stopwatch with top button/knob
   \___/
     |
```

**Design Details:**
- Circle (outer ring) representing the watch face
- Smaller circle inside at cx="12" cy="13"
- Timer hand path: "M12 9v4l2 2" (pointing at angle)
- Top horizontal line: "M9 4h6" (the top button area)
- Vertical line: "M12 2v2" (the knob/button)

**Visual Characteristics:**
- Gray background (bg-gray-100) when active
- Gray text color (text-gray-600)
- 18x18px size for compact, clean look
- Hover effect: bg-gray-200

**Tooltip:** "Stopwatch mode - Click to switch to countdown"

---

### Countdown Timer Mode Icon (Hourglass)
```
  ______
  |    |  ← Top sand container
   \  /
    \/    ← Narrow neck (sand flowing through)
    /\
   /  \
  |____| ← Bottom sand container
```

**Design Details:**
- Top horizontal line: "M5 2h14" (top of hourglass)
- Bottom horizontal line: "M5 22h14" (bottom of hourglass)
- Upper chamber: "M7 2v4.172a2 2 0 0 0 .586 1.414L12 12..."
  - Starts wide at top, narrows to center point (12, 12)
- Lower chamber: "M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12..."
  - Starts narrow at center, widens to bottom
- Creates distinctive X-shape in the middle where sand flows

**Visual Characteristics:**
- Blue background (bg-blue-100) when active
- Blue text color (text-blue-600)
- 18x18px size matching stopwatch
- Hover effect: bg-blue-200
- Perfectly represents "time running out"

**Tooltip:** "Countdown mode - Click to switch to stopwatch"

---

## Implementation Details

### SVG Attributes (Both Icons)
- `width="18"`
- `height="18"`
- `viewBox="0 0 24 24"`
- `fill="none"`
- `stroke="currentColor"` (inherits text color)
- `strokeWidth="2"`
- `strokeLinecap="round"`
- `strokeLinejoin="round"`

### Button Styling

**Stopwatch Mode Button:**
```css
className: p-2 rounded transition bg-gray-100 text-gray-600 hover:bg-gray-200
```

**Countdown Mode Button:**
```css
className: p-2 rounded transition bg-blue-100 text-blue-600 hover:bg-blue-200
```

### For Nous Together (Purple Theme)

**Stopwatch Mode:**
```css
className: p-2 rounded transition bg-purple-100 text-purple-600 hover:bg-purple-200
```

**Countdown Mode:**
```css
className: p-2 rounded transition bg-purple-200 text-purple-700 hover:bg-purple-300
```

---

## Color Palette

### Regular Habits
- **Stopwatch**:
  - Background: `#f3f4f6` (gray-100)
  - Text: `#4b5563` (gray-600)
  - Hover: `#e5e7eb` (gray-200)

- **Countdown**:
  - Background: `#dbeafe` (blue-100)
  - Text: `#2563eb` (blue-600)
  - Hover: `#bfdbfe` (blue-200)

### Nous Together
- **Stopwatch**:
  - Background: `#f3e8ff` (purple-100)
  - Text: `#9333ea` (purple-600)
  - Hover: `#e9d5ff` (purple-200)

- **Countdown**:
  - Background: `#e9d5ff` (purple-200)
  - Text: `#7e22ce` (purple-700)
  - Hover: `#d8b4fe` (purple-300)

---

## User Experience

### Visual Hierarchy
1. **Icon button** - Primary visual indicator of mode
2. **Background color** - Secondary reinforcement
3. **Duration selector** - Only visible in countdown mode
4. **Timer display** - Shows actual time
5. **Control buttons** - Play/pause/stop actions

### Interaction Flow
1. User sees stopwatch icon (default)
2. Clicks icon to toggle
3. Icon smoothly transitions to clock icon
4. Background color changes to blue
5. Duration selector appears
6. User can start countdown timer

### Accessibility
- Clear visual distinction between modes
- Hover states for interactivity feedback
- Tooltips explain mode on hover
- Icons are universally recognizable
- Color + shape for redundancy (not just color)

---

## Design Rationale

**Why Stopwatch Icon for Count Up?**
- Stopwatches are culturally associated with measuring elapsed time
- The top button/knob is distinctive and instantly recognizable
- Vertical orientation suggests "going up"

**Why Hourglass Icon for Countdown?**
- Hourglasses universally represent time running out
- The visual of sand flowing down is intuitive for countdown
- X-shape in middle shows the narrow passage of time
- Classic metaphor for "time is running out"

**Why Different Colors?**
- Blue suggests "set time" / planning / structure
- Gray suggests neutral / flexible / open-ended
- Purple maintains brand consistency for shared features

**Size & Spacing:**
- 18x18px is large enough to be clear but small enough to not dominate
- p-2 padding (8px) creates breathing room
- Rounded corners match app's soft aesthetic

---

## Responsive Behavior

### Mobile (< 640px)
- Icons remain 18x18px (still clearly tappable)
- Touch target is 34x34px minimum (18px + 2*8px padding)
- No changes needed - icons are touch-friendly

### Tablet/Desktop (≥ 640px)
- Same size maintains consistency
- Hover states work on mouse over
- Cursor changes to pointer on hover

---

## Future Enhancements

Potential improvements:
- Animated transition when toggling (icon morphing)
- Subtle pulse animation when countdown nears zero
- Icon fills with color as countdown progresses
- Custom icons for different duration presets
- Theme-aware icon colors (dark mode support)
