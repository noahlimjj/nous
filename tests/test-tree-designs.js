
const { test, expect } = require('@playwright/test');

// The updated TREE_TYPES array with new designs
const TREE_TYPES = [
    { id: 'oak', name: 'Oak', requiredHours: 0, color: '#4a7c2c', leafShapes: ['oval', 'diamond'], leafColors: ['#3E7C17', '#5DAE49', '#A1C349', '#4a7c2c', '#6d9f4f'], branchColor: '#5A3E1B' },
    { id: 'maple', name: 'Maple', requiredHours: 5, color: '#d94f04', leafShapes: ['star', 'triangle'], leafColors: ['#FF4C29', '#FFB84C', '#D94F04', '#c2410c', '#f97316'], branchColor: '#6B2B06' },
    { id: 'cherry', name: 'Cherry Blossom', requiredHours: 15, color: '#f9a8d4', leafShapes: ['heart', 'circle'], leafColors: ['#F8C8DC', '#FADADD', '#FFD6E8', '#fbcfe8', '#fce7f3'], branchColor: '#8B5E3C' },
    { id: 'willow', name: 'Willow', requiredHours: 30, color: '#94a3b8', leafShapes: ['oval', 'rectangle'], leafColors: ['#A3C9A8', '#6BA292', '#446A46', '#94a3b8', '#d1d5db'], branchColor: '#4E3B31' },
    { id: 'pine', name: 'Pine', requiredHours: 50, color: '#166534', leafShapes: ['rectangle', 'hexagon'], leafColors: ['#2C5F2D', '#166534', '#15803d', '#052e16', '#064e3b'], branchColor: '#3B2F2F' },
    { id: 'cypress', name: 'Cypress', requiredHours: 75, color: '#4d7c0f', leafShapes: ['hexagon', 'diamond'], leafColors: ['#557A46', '#A9C46C', '#7BA23F', '#65a30d', '#84cc16'], branchColor: '#4B3D28' },
    { id: 'birch', name: 'Birch', requiredHours: 100, color: '#fde047', leafShapes: ['diamond', 'triangle'], leafColors: ['#C7E6D7', '#fef08a', '#fde047', '#facc15', '#eab308'], branchColor: '#8E7C5D' },
    { id: 'sakura', name: 'Ancient Sakura', requiredHours: 150, color: '#db2777', leafShapes: ['heart', 'fan'], leafColors: ['#EFBBCF', '#F2A7B9', '#FFCBDD', '#f472b6', '#ec4899'], branchColor: '#705243' },
    { id: 'baobab', name: 'Baobab', requiredHours: 250, color: '#4d7c0f', leafShapes: ['star', 'circle'], leafColors: ['#8ABF69', '#C8E7A7', '#EBF2C0', '#4d7c0f', '#a3e635'], branchColor: '#8B5A2B' },
    { id: 'magnolia', name: 'Magnolia', requiredHours: 400, color: '#e879f9', leafShapes: ['oval', 'heart'], leafColors: ['#F6D6AD', '#EFBBCF', '#E6AACE', '#f5d0fe', '#f0abfc'], branchColor: '#7E6651' },
    {
        id: 'starry-night',
        name: 'Starry Night Tree',
        requiredHours: 600,
        color: '#8A2BE2',
        branchColor: '#2C3E50',
        leafColors: ['#0B0B45', '#23238E', '#4B0082', '#8A2BE2', '#FFD700'],
        leafShapes: ['star', 'diamond', 'circle'],
    },
    { id: 'redwood', name: 'Redwood', requiredHours: 800, color: '#7f1d1d', leafShapes: ['rectangle', 'triangle'], leafColors: ['#7D6B91', '#B88B4A', '#A17C3A', '#450a0a', '#991b1b'], branchColor: '#4A2C2A' },
    { id: 'ginkgo', name: 'Ginkgo', requiredHours: 1000, color: '#facc15', leafShapes: ['fan'], leafColors: ['#F4E409', '#FFD23F', '#F6AE2D', '#facc15', '#eab308'], branchColor: '#8C5E24' }
];

test.describe('Tree Designs', () => {
  for (const tree of TREE_TYPES) {
    test(`should render ${tree.name} correctly`, async ({ page }) => {
      await page.goto('http://localhost:8000/tests/test-page.html');

      // Inject the tree type into the page
      await page.evaluate((tree) => {
        window.renderTree(tree);
      }, tree);

      // Wait for the tree to render
      await page.waitForSelector('#tree-container svg');

      // Take a screenshot
      await page.screenshot({ path: `tests/test-results/tree-designs/${tree.id}.png` });
    });
  }
});
