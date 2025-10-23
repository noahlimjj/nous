# Ideas Board Feature - Development Notes

## Overview
The Ideas Board is an infinite canvas whiteboard feature integrated into the Notebook component. It was temporarily removed from production due to technical issues that need to be resolved.

## Current Status
**Removed from production** - The feature is currently disabled and not rendered in the Notebook component.

## Intended Functionality
The Ideas Board should provide:
1. **Drawing Tools**
   - Pen tool for freehand drawing
   - Eraser tool for removing content
   - Text tool for adding typed text
   - Clear button to reset the canvas

2. **Infinite Canvas**
   - Zoom in/out functionality (0.1x to 10x)
   - Pan around the canvas (Hold Shift + Drag)
   - Scroll to zoom
   - Reset button to return to default view (1x zoom, 0,0 pan)

3. **Persistence**
   - All drawings, text, and canvas state should be saved to Firebase
   - State should persist across sessions

## Known Issues

### 1. Drawing Quality - **HIGH PRIORITY**
- **Problem**: Drawings appear pixelated and jagged
- **Cause**: Canvas resolution not properly accounting for high-DPI displays (Retina displays)
- **Fix Needed**:
  - Implement `devicePixelRatio` scaling in canvas initialization
  - Set canvas internal resolution higher than CSS display size
  - Scale context to match device pixel ratio

  ```javascript
  const dpr = window.devicePixelRatio || 1;
  canvas.width = displayWidth * dpr;
  canvas.height = displayHeight * dpr;
  context.scale(dpr, dpr);
  ```

### 2. Mouse Position Offset - **HIGH PRIORITY**
- **Problem**: Drawing appears to the right of where the mouse cursor is positioned
- **Cause**: Incorrect coordinate transformation between screen space and canvas space
- **Current Implementation Issue**:
  - Using `nativeEvent.offsetX/offsetY` which may not account for canvas transformations
  - Zoom/pan transforms being applied incorrectly causing coordinate misalignment
- **Fix Needed**:
  - Use `getBoundingClientRect()` to get accurate canvas position
  - Properly calculate mouse position relative to canvas:
    ```javascript
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom - panX;
    const y = (e.clientY - rect.top) / zoom - panY;
    ```
  - Review coordinate transform logic in `screenToCanvas()` function

### 3. Panning Not Working - **MEDIUM PRIORITY**
- **Problem**: Shift + Drag does not pan the canvas
- **Possible Causes**:
  - `isPanning` state not properly triggering pan mode
  - Pan offset (`panX`, `panY`) not being applied to canvas transform
  - Mouse move handler not updating pan position correctly
- **Fix Needed**:
  - Debug event handlers for Shift key detection
  - Ensure `setTransform()` is being called with correct pan offsets
  - Add visual feedback when in pan mode (cursor change to grab icon)

### 4. Eraser Not Working - **MEDIUM PRIORITY**
- **Problem**: Eraser tool doesn't remove content
- **Current Implementation**:
  - Uses `globalCompositeOperation = 'destination-out'`
  - Sets wider line width (20px / zoom)
- **Fix Needed**:
  - Verify `globalCompositeOperation` is being reset properly after erasing
  - Check if zoom transform affects eraser size correctly
  - Test if eraser path is being drawn at correct coordinates

### 5. Canvas State Persistence - **LOW PRIORITY**
- **Current Implementation**: Saves canvas as base64 `toDataURL()` to Firebase
- **Potential Issues**:
  - Large file sizes for complex drawings
  - Zoom and pan state not being restored correctly
  - Text elements not stored separately from canvas bitmap
- **Improvements Needed**:
  - Consider storing drawing commands instead of bitmap
  - Save zoom/pan state separately
  - Implement efficient delta updates rather than full canvas saves

## Technical Architecture

### Component Structure
```
Notebook Component
├── State
│   ├── drawingTool ('pen' | 'eraser' | 'text')
│   ├── isDrawing (boolean)
│   ├── isPanning (boolean)
│   ├── zoom (number, 0.1-10)
│   ├── panX (number)
│   ├── panY (number)
│   ├── isTyping (boolean)
│   ├── typingPosition ({ x, y })
│   └── currentText (string)
├── Refs
│   ├── canvasRef (canvas element)
│   ├── contextRef (2D context)
│   └── lastPanPoint ({ x, y })
└── Firebase
    └── /artifacts/{appId}/users/{userId}/notebook/data
        ├── canvasData (base64 PNG)
        ├── zoom (number)
        ├── panX (number)
        └── panY (number)
```

### Key Functions to Review
1. **Canvas Initialization** (line ~4496)
   - `useEffect` for canvas setup
   - DPI scaling implementation needed

2. **Coordinate Transformation** (line ~4566)
   - `getMousePos()` - Convert screen to canvas coordinates
   - Needs to account for zoom/pan transforms

3. **Drawing Functions** (line ~4577+)
   - `startDrawing()` - Initialize drawing path
   - `draw()` - Continue drawing path
   - `stopDrawing()` - End path and save to Firebase

4. **Text Handling** (line ~4656+)
   - `handleCanvasKeyDown()` - Keyboard input for text tool
   - Text rendering with Satoshi font

5. **Zoom/Pan Controls** (line ~4654+)
   - `zoomIn()`, `zoomOut()`, `resetZoom()`
   - Wheel event handler for scroll zoom

## Development Priorities

1. **Phase 1 - Core Drawing (Critical)**
   - Fix canvas resolution for smooth drawing
   - Fix mouse position accuracy
   - Ensure basic pen tool works perfectly

2. **Phase 2 - Navigation (Important)**
   - Fix panning functionality
   - Verify zoom works correctly
   - Test zoom/pan interaction with drawing

3. **Phase 3 - Tools (Nice to Have)**
   - Fix eraser tool
   - Improve text tool positioning with zoom/pan
   - Add more drawing options (colors, line width)

4. **Phase 4 - Polish (Future)**
   - Optimize Firebase saves
   - Add undo/redo functionality
   - Improve performance for complex drawings

## Testing Checklist

Before re-enabling this feature:
- [ ] Drawing appears smooth on both regular and Retina displays
- [ ] Mouse cursor matches exactly where ink appears
- [ ] Can draw continuously without gaps or jumps
- [ ] Shift + Drag pans the canvas smoothly
- [ ] Scroll wheel zooms in/out correctly
- [ ] Eraser removes content when dragging
- [ ] Text tool places text at cursor position
- [ ] Text renders in Satoshi font
- [ ] All drawings persist after page refresh
- [ ] Zoom and pan state persists
- [ ] Reset button returns to initial state (1x, 0, 0)
- [ ] Performance is acceptable with complex drawings

## Resources

### Reference Implementations
- Excalidraw (https://github.com/excalidraw/excalidraw) - Infinite canvas implementation
- Tldraw (https://github.com/tldraw/tldraw) - Canvas coordinate systems
- Fabric.js (http://fabricjs.com/) - Canvas manipulation library

### Relevant Documentation
- MDN Canvas API: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
- High DPI Canvas: https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio
- Canvas Transforms: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/transform

## Next Steps

1. **Investigate** - Deep dive into coordinate system and understand current transform logic
2. **Prototype** - Create isolated test page to experiment with canvas transforms
3. **Fix** - Implement fixes one by one, testing thoroughly
4. **Integrate** - Re-add feature to Notebook component
5. **Test** - Full QA on different devices and screen sizes
6. **Deploy** - Push to production once stable

## Notes

- Font for text: Satoshi (already loaded in the app)
- Colors: Using calm-600 (#5d6b86) for UI elements
- Icons: PenIcon, EraserIcon, TextIcon, TrashIcon already created
- The feature was working partially but had too many UX issues for production
