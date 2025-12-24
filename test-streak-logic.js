
const calculateStreakAndCoins = (lastCompletedDate, currentStreak, difficulty) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today

    // Normalize lastCompleted
    let last = null;
    if (lastCompletedDate) {
        last = new Date(lastCompletedDate);
        last.setHours(0, 0, 0, 0);
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const wasYesterday = last && last.getTime() === yesterday.getTime();
    const isToday = last && last.getTime() === today.getTime();

    if (isToday) return { streak: currentStreak, coins: 0, msg: "Already completed" };

    // Streak Logic
    // If it was yesterday, increment. 
    // If it's the first time (!last), start at 1.
    // If it wasn't yesterday and wasn't today (missed a day), reset to 1.
    let newStreak = (wasYesterday || !last) ? (currentStreak || 0) + 1 : 1;
    // Edge case: if !last, currentStreak should be ignored, it's 1.
    if (!last) newStreak = 1;

    // Bonus Logic
    let baseCoins = difficulty === 'hard' ? 20 : difficulty === 'medium' ? 10 : 5;
    let multiplier = 1;
    let bonusType = "";

    if (newStreak >= 7) { multiplier = 1.4; bonusType = "40%"; }
    else if (newStreak >= 5) { multiplier = 1.25; bonusType = "25%"; }
    else if (newStreak >= 3) { multiplier = 1.1; bonusType = "10%"; }

    const finalCoins = Math.round(baseCoins * multiplier);

    return {
        newStreak,
        baseCoins,
        multiplier,
        finalCoins,
        bonusType,
        wasYesterday
    };
};

// --- TESTS ---
const runTest = (desc, lastDateOffset, currentStreak, difficulty, expectedStreak, expectedCoins) => {
    const today = new Date();
    let lastDate = null;
    if (lastDateOffset !== null) {
        lastDate = new Date(today);
        lastDate.setDate(today.getDate() - lastDateOffset);
    }

    const result = calculateStreakAndCoins(lastDate, currentStreak, difficulty);
    console.log(`Test: ${desc}`);
    console.log(`  Input: Offset=${lastDateOffset}, Streak=${currentStreak}, Diff=${difficulty}`);
    console.log(`  Result: NewStreak=${result.newStreak}, Coins=${result.finalCoins} (${result.bonusType})`);

    const pass = result.newStreak === expectedStreak && result.finalCoins === expectedCoins;
    console.log(`  Status: ${pass ? 'PASS' : 'FAIL'}`, !pass ? `Expected: S=${expectedStreak}, C=${expectedCoins}` : '');
    console.log('---');
};

console.log("Running Streak Logic Tests...\n");

// 1. New Habit (No last date)
runTest("First Completion (Easy)", null, 0, 'easy', 1, 5);

// 2. Continuous Streak (Yesterday)
runTest("Day 2 Streak (Easy)", 1, 1, 'easy', 2, 5); // No bonus
runTest("Day 3 Streak (Easy - 10%)", 1, 2, 'easy', 3, 6); // 5 * 1.1 = 5.5 -> 6
runTest("Day 5 Streak (Medium - 25%)", 1, 4, 'medium', 5, 13); // 10 * 1.25 = 12.5 -> 13
runTest("Day 7 Streak (Hard - 40%)", 1, 6, 'hard', 7, 28); // 20 * 1.4 = 28.0 -> 28

// 3. Broken Streak
runTest("Broken Streak (2 days ago)", 2, 10, 'hard', 1, 20); // Reset to 1, no bonus

// 4. Already Completed
// Logic handles this inside app, but func check:
// (RunTest helper generates today for offset 0)
// runTest("Today (Skip)", 0, 5, 'medium', 5, 0); 
