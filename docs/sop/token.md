# Token Optimization Strategies for AI-Assisted Development

## Overview
When working with large codebases (like our 4000+ line index.html), token efficiency becomes critical for both cost and performance. This guide provides battle-tested strategies for minimizing token usage while maintaining code quality.

---

## 🎯 Core Principles

1. **Read Only What You Need**: Every character read costs tokens
2. **Use Targeted Tools**: Grep/Glob over full file reads
3. **Batch Operations**: Multiple edits in single operations
4. **Smart Context**: Maintain mental model to avoid re-reading
5. **Plan Before Acting**: Think through changes before reading files

---

## 📖 Reading Strategies for Large Files

### ❌ AVOID: Full File Reads
```javascript
// BAD: Wastes ~50,000 tokens
Read(file_path: "index.html")
```

### ✅ USE: Targeted Section Reads
```javascript
// GOOD: Only 1,000-2,000 tokens
Read(file_path: "index.html", offset: 1000, limit: 50)
```

### 🔍 Best: Search Before Reading
```javascript
// BEST: Find exact location first (minimal tokens)
Grep(pattern: "const MyComponent", output_mode: "content", -n: true)
// Result: "1234: const MyComponent = ..."
// Then read specific section
Read(file_path: "index.html", offset: 1230, limit: 30)
```

---

## 🔧 Tool Usage Hierarchy (Most → Least Efficient)

### 1. Grep (Most Efficient)
**Use for**: Finding code locations, counting occurrences, checking existence
```javascript
// Find component location
Grep(pattern: "const Header", -n: true) // Returns line numbers

// Check if feature exists
Grep(pattern: "calculateCoins") // Returns files with matches

// Find all usages
Grep(pattern: "setCurrentPage\\('myworld'\\)", output_mode: "content")
```

**Token Cost**: ~500-1000 tokens per search

### 2. Glob (File Discovery)
**Use for**: Finding files by pattern
```javascript
Glob(pattern: "**/*.js")
Glob(pattern: "**/test-*.js")
```

**Token Cost**: ~300-600 tokens per search

### 3. Targeted Read
**Use for**: Reading specific sections after Grep identifies location
```javascript
Read(file_path: "index.html", offset: 1500, limit: 50)
```

**Token Cost**: 1,000-3,000 tokens depending on limit

### 4. Full Read (Last Resort)
**Use for**: ONLY when absolutely necessary
```javascript
Read(file_path: "index.html") // Avoid unless critical
```

**Token Cost**: 50,000+ tokens for index.html

---

## 💡 High-Yield Optimization Strategies

### Strategy 1: Grep → Pinpoint → Edit
**Scenario**: Modifying a specific function

**❌ Wasteful Approach** (50,000 tokens):
1. Read entire file
2. Find function
3. Make edit

**✅ Efficient Approach** (2,000 tokens):
1. Grep to find function line number
2. Read small section around that line
3. Make targeted edit

**Example**:
```javascript
// Step 1: Find location (500 tokens)
Grep(pattern: "const stopTimer", -n: true)
// Returns: "1396: const stopTimer = useCallback..."

// Step 2: Read context (1,500 tokens)
Read(file_path: "index.html", offset: 1390, limit: 40)

// Step 3: Edit (0 additional read tokens)
Edit(old_string: "...", new_string: "...")
```

**Savings**: 48,000 tokens (96% reduction)

### Strategy 2: Batch Multiple Edits
**Scenario**: Adding multiple related functions

**❌ Wasteful Approach** (150,000 tokens):
1. Read file → Add function A → Re-read file
2. Read file → Add function B → Re-read file
3. Read file → Add function C → Re-read file

**✅ Efficient Approach** (55,000 tokens):
1. Grep to find insertion point
2. Read once for context
3. Single large edit adding all functions at once

**Example**:
```javascript
Edit(
  old_string: "};",
  new_string: `};

  const FunctionA = ...

  const FunctionB = ...

  const FunctionC = ...`
)
```

**Savings**: 95,000 tokens (63% reduction)

### Strategy 3: Pattern Recognition
**Scenario**: Finding similar code patterns

**Use Regex Grep** to match patterns without reading:
```javascript
// Find all React components
Grep(pattern: "const \\w+ = \\(", output_mode: "files_with_matches")

// Find all Firebase operations
Grep(pattern: "window\\.\\w+Doc\\(", output_mode: "count")

// Find state declarations
Grep(pattern: "useState\\(", -n: true)
```

**Token Cost**: ~500 tokens vs 50,000 for full read

### Strategy 4: Contextual Memory
**Build Mental Model** to avoid re-reading:

After initial discovery, remember:
- Component locations (line ranges)
- Import locations
- Key function names
- File structure

**Example Memory Map**:
```
Lines 180-225: Firebase imports
Lines 700-740: Utility functions
Lines 845-940: Header component
Lines 1000-1400: Dashboard component
Lines 3400+: App component
```

Use this map for subsequent operations without re-reading.

### Strategy 5: Smart Search Patterns
**Use specific, unique strings** in Grep:

```javascript
// ❌ Too broad (many results)
Grep(pattern: "function")

// ✅ Specific (exact match)
Grep(pattern: "const calculateCoinsEarned")

// ✅ Context-aware (unique identifier)
Grep(pattern: "React.createElement\\(MyWorld")
```

---

## 📊 Token Cost Comparison Table

| Operation | Token Cost | When to Use |
|-----------|-----------|-------------|
| Grep search | 500-1k | Finding locations, checking existence |
| Glob search | 300-600 | File discovery |
| Targeted Read (50 lines) | 1k-3k | Reading specific sections |
| Full File Read | 50k+ | Initial discovery only |
| Edit operation | 2k-5k | Making changes |
| Multiple parallel Greps | 1.5k-3k | Searching multiple patterns |

---

## 🚀 Advanced Techniques

### Technique 1: Parallel Searches
Run multiple Greps in one message to save round-trips:

```javascript
// Single message with 3 searches (3k tokens total)
Grep(pattern: "const Header")
Grep(pattern: "const Dashboard")
Grep(pattern: "const MyWorld")
```

vs.

```javascript
// Three separate messages (9k tokens with overhead)
Message 1: Grep(pattern: "const Header")
Message 2: Grep(pattern: "const Dashboard")
Message 3: Grep(pattern: "const MyWorld")
```

**Savings**: 6,000 tokens (67% reduction)

### Technique 2: Head Limiting
Use `head_limit` to sample results:

```javascript
// Get first 10 matches only
Grep(pattern: "React.createElement", output_mode: "content", head_limit: 10)
```

This is useful for:
- Understanding patterns
- Checking consistency
- Quick verification

### Technique 3: Context Lines
Use -A, -B, -C for minimal context reading:

```javascript
// Get function signature + 5 lines after
Grep(pattern: "const stopTimer", output_mode: "content", -n: true, -A: 5)
```

**Token Cost**: ~1,500 tokens vs 3,000 for Read

---

## 📝 Real-World Examples

### Example 1: Adding New Page Component

**Efficient Workflow**:
```
1. Grep(pattern: "const Settings =") → Find insertion point [500 tokens]
2. Read(offset: 1790, limit: 10) → Verify location [500 tokens]
3. Edit(old_string: "};", new_string: "...\n\nconst MyWorld = ...") [3k tokens]
4. Grep(pattern: "currentPage === 'settings'") → Find routing [500 tokens]
5. Edit routing to add new page [2k tokens]
```

**Total**: ~6,500 tokens
**Naive Approach**: 100,000+ tokens
**Savings**: 93.5%

### Example 2: Understanding Component

**Efficient Workflow**:
```
1. Grep(pattern: "const Header", -n: true) → Get line number [500 tokens]
2. Read(offset: 845, limit: 100) → Read full component [2k tokens]
3. Grep(pattern: "React.createElement\\(Header") → Find usage [500 tokens]
```

**Total**: ~3,000 tokens
**Naive Approach**: 50,000 tokens (full read)
**Savings**: 94%

### Example 3: Debugging Feature

**Efficient Workflow**:
```
1. Grep(pattern: "calculateCoinsEarned", output_mode: "content", -A: 10) [1k tokens]
2. Grep(pattern: "coinsEarned", output_mode: "content") [1k tokens]
3. Read specific function if needed [2k tokens]
```

**Total**: ~4,000 tokens
**Saves**: Multiple full file reads

---

## 🎯 Project-Specific Tips (index.html)

### Structure Memory
```
Lines 1-250: Imports, styles, utilities
Lines 250-700: Icon components
Lines 700-1000: Helper functions, Auth
Lines 1000-3400: Page components (Dashboard, Reports, etc.)
Lines 3400-3800: My World components
Lines 3800+: Main App logic
```

### Common Patterns
```javascript
// Finding component definitions
Grep(pattern: "const \\w+ = \\({ db, userId")

// Finding page routing
Grep(pattern: "currentPage === '")

// Finding Firebase operations
Grep(pattern: "window\\.\\w+\\(db,")

// Finding state declarations
Grep(pattern: "const \\[\\w+, set\\w+\\] = useState")
```

### Insertion Points
- **New components**: After line 3454 (before "// --- Main App Component ---")
- **New utilities**: After line 740 (after calculateCoinsEarned)
- **New routing**: Around line 4128 (in main render)
- **New navigation**: Around lines 900-940 (in Header)

---

## 📈 Measuring Success

### Track Your Token Usage
Monitor these metrics:
- Average tokens per operation
- Read/Edit ratio
- Grep-first success rate
- Number of full file reads

### Target Metrics
- **Grep-first rate**: >80% of operations start with Grep
- **Full reads per session**: <3
- **Average Read size**: <50 lines
- **Tokens per feature**: <10k for simple, <50k for complex

---

## 🏆 Best Practices Summary

1. **Always Grep First**: Find before reading
2. **Use Offset/Limit**: Never read full files unnecessarily
3. **Batch Operations**: Multiple edits in single message
4. **Build Mental Model**: Remember structure to avoid re-reading
5. **Specific Patterns**: Use unique search strings
6. **Parallel Searches**: Multiple Greps in one message
7. **Context Lines**: Use -A/-B/-C for minimal context
8. **Head Limiting**: Sample results when appropriate
9. **Smart Caching**: Remember previous discoveries
10. **Plan Ahead**: Think through workflow before executing

---

## 💰 Cost Impact

### Token Pricing (Claude Sonnet 4)
- Input: $3 per million tokens
- Output: $15 per million tokens

### Example Feature Cost Comparison

**Full Gamification System Implementation**:

| Approach | Input Tokens | Output Tokens | Cost |
|----------|-------------|---------------|------|
| Naive (full reads) | 500k | 50k | $2.25 |
| Optimized (Grep-first) | 120k | 40k | $0.96 |
| **Savings** | **76%** | **20%** | **$1.29** |

### Per-Operation Costs

| Operation | Naive Cost | Optimized Cost | Savings |
|-----------|-----------|----------------|---------|
| Add function | $0.15 | $0.02 | 87% |
| Modify function | $0.18 | $0.03 | 83% |
| Debug issue | $0.25 | $0.04 | 84% |
| Add page | $0.30 | $0.08 | 73% |

---

## 🔮 Advanced: Token Budget Planning

### Pre-Operation Estimation
Before starting work, estimate tokens:

**Simple Change** (1 function):
- 1 Grep: 500 tokens
- 1 Read: 2,000 tokens
- 1 Edit: 3,000 tokens
- **Total**: ~5,500 tokens (~$0.02)

**Complex Feature** (multiple components):
- 5 Greps: 2,500 tokens
- 3 Reads: 6,000 tokens
- 5 Edits: 15,000 tokens
- **Total**: ~23,500 tokens (~$0.10)

**Large Refactor**:
- 10 Greps: 5,000 tokens
- 5 Reads: 10,000 tokens
- 10 Edits: 30,000 tokens
- 1 Test cycle: 20,000 tokens
- **Total**: ~65,000 tokens (~$0.45)

---

## 📚 Quick Reference Card

```
REMEMBER: Grep → Read (small) → Edit

✅ DO:
- Grep before reading
- Use offset/limit on reads
- Batch multiple edits
- Remember file structure
- Use specific search patterns

❌ DON'T:
- Read entire file first
- Re-read for every operation
- Use vague search patterns
- Forget previous discoveries
- Skip Grep step
```

---

## 🎓 Learning Exercises

Practice these to build efficiency:

1. **Find & Modify**: Use only Grep + targeted Read to modify a function
2. **Component Hunt**: Find all components using just Grep
3. **Zero Full Reads**: Complete a feature without reading full file
4. **Batch Challenge**: Add 3 functions in one Edit operation
5. **Pattern Master**: Write Grep patterns for common structures

---

## 📞 When to Break the Rules

Sometimes full reads are justified:
- **Initial exploration** of new codebase
- **Major refactoring** requiring full understanding
- **Documentation generation** needing complete context
- **Security audits** checking entire file

Even then, consider alternatives:
- Read in chunks (offsets)
- Use multiple targeted reads
- Grep for specific patterns first

---

## 🚀 Continuous Improvement

Track your efficiency over time:
1. Log tokens per operation
2. Identify common patterns
3. Build reusable search patterns
4. Create operation templates
5. Share learnings with team

**Goal**: Reduce token usage by 80% while maintaining or improving code quality.

---

## 📖 Additional Resources

- Grep regex patterns library
- Common file structure maps
- Operation cost calculator
- Token tracking templates

---

**Remember**: Every token saved is money saved and faster development. Master these strategies and you'll see 70-90% token reduction on large files!
