# Testing Guide

## How to Test the Application Locally

### Prerequisites
- Local HTTP server running on port 8000
- Web browser

### Testing Steps

1. **Start the local server** (if not already running):
   ```bash
   python3 -m http.server 8000
   ```

2. **Open the application**:
   - Navigate to `http://localhost:8000` in your browser

3. **Login as Guest**:
   - Click "Continue as Guest" button
   - Enter a random username (e.g., "testuser", "alice", etc.)
   - Click to continue

4. **View the Enhanced Tree**:
   - Once logged in, you should see the Growth Tree visualization
   - The tree now features:
     - Multiple shades of brown in the trunk and branches
     - 31 leaves with 5 different green colors
     - Varied leaf sizes (9-14px)
     - 12 branches with different widths and colors
     - When fully grown: 7 colorful fruits (red, orange, yellow) with highlights and stems

5. **Test Tree Growth**:
   - Log study sessions to see the tree grow
   - Watch for smooth animations as new branches, leaves, and fruits appear

## Enhanced Tree Features to Verify

### Trunk
- ✓ Dark brown base (#6B5947)
- ✓ Light brown highlight for 3D effect (#A0826D)

### Branches
- ✓ 12 total branches (up from 6)
- ✓ Three tiers: main (5px), secondary (3-4px), tertiary (2px)
- ✓ Three brown shades for depth

### Leaves
- ✓ 31 leaves (up from 11)
- ✓ 5 green color variations
- ✓ Varied sizes for organic appearance
- ✓ Natural clustering pattern

### Fruits (at 95%+ growth)
- ✓ 7 fruits (up from 3)
- ✓ Red, orange, and yellow colors
- ✓ Highlights and stems
- ✓ Sparkle effects
- ✓ Glow animations

## Notes
- The tree grows based on total study hours logged
- Different growth stages reveal trunk → branches → leaves → fruits
- All animations are smooth and performant
- Design inspired by Forest app aesthetic
