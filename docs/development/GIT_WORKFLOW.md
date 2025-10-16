# Git Workflow Guide

This guide will help you manage your code with Git and push changes to GitHub.

## Prerequisites

- Git installed on your system
- GitHub repository already initialized (this project is already a Git repository)
- GitHub account with proper authentication set up

## Basic Git Workflow

### 1. Check Current Status

Before making any changes, check what files have been modified:

```bash
git status
```

This shows:
- Modified files (marked with `M`)
- New files (marked with `??` or `A`)
- Deleted files (marked with `D`)

### 2. View Changes

To see what changed in your files:

```bash
# View all changes
git diff

# View changes for a specific file
git diff index.html
```

### 3. Stage Files for Commit

Add files you want to include in your commit:

```bash
# Stage all changes
git add .

# Stage specific files
git add index.html style.css

# Stage multiple specific files
git add index.html style.css system/firestore.rules
```

### 4. Commit Your Changes

Create a commit with a descriptive message:

```bash
git commit -m "Your commit message here"
```

**Good commit message examples:**
- `"Add multi-participant Nous Together feature"`
- `"Fix shared timer to save sessions for all participants"`
- `"Extract CSS to external style.css file"`
- `"Update Firestore rules for multi-participant support"`

**For multi-line commit messages:**

```bash
git commit -m "$(cat <<'EOF'
Summary line of the change

- Detailed point 1
- Detailed point 2
- Detailed point 3

🤖 Generated with Claude Code
EOF
)"
```

### 5. Push to GitHub

Push your commits to the remote repository:

```bash
# Push to main branch
git push origin main

# If you're on a different branch
git push origin your-branch-name
```

## Complete Workflow Example

Here's a typical workflow from start to finish:

```bash
# 1. Check status
git status

# 2. View changes (optional)
git diff

# 3. Stage all changes
git add .

# 4. Commit with message
git commit -m "Add multi-participant Nous Together with habit selection"

# 5. Push to GitHub
git push origin main
```

## Common Git Commands

### Viewing History

```bash
# View commit history
git log

# View compact history
git log --oneline

# View last 5 commits
git log -5
```

### Undoing Changes

```bash
# Discard changes in a file (before staging)
git checkout -- filename.html

# Unstage a file (but keep changes)
git reset HEAD filename.html

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes) - USE WITH CAUTION
git reset --hard HEAD~1
```

### Branches

```bash
# View all branches
git branch

# Create new branch
git branch feature-name

# Switch to branch
git checkout feature-name

# Create and switch to new branch
git checkout -b feature-name

# Delete branch
git branch -d feature-name
```

## Quick Reference for This Project

### Typical Changes You'll Make:

1. **After feature development:**
   ```bash
   git add index.html system/firestore.rules
   git commit -m "Add [feature name]"
   git push origin main
   ```

2. **After bug fixes:**
   ```bash
   git add index.html
   git commit -m "Fix [bug description]"
   git push origin main
   ```

3. **After optimization:**
   ```bash
   git add index.html style.css
   git commit -m "Optimize [what you optimized]"
   git push origin main
   ```

## Troubleshooting

### If push is rejected:

```bash
# Pull latest changes first
git pull origin main

# Then push again
git push origin main
```

### If you have conflicts:

1. Git will tell you which files have conflicts
2. Open those files and look for `<<<<<<<`, `=======`, and `>>>>>>>` markers
3. Edit the files to resolve conflicts
4. Stage the resolved files: `git add filename`
5. Commit: `git commit -m "Resolve merge conflicts"`
6. Push: `git push origin main`

### If you want to see what will be pushed:

```bash
# See commits that will be pushed
git log origin/main..HEAD

# See changed files that will be pushed
git diff --stat origin/main HEAD
```

## Best Practices

1. **Commit often** - Make small, focused commits rather than large ones
2. **Write clear messages** - Future you will thank present you
3. **Pull before push** - Always pull latest changes before pushing
4. **Test before commit** - Make sure your changes work before committing
5. **Don't commit sensitive data** - Never commit API keys, passwords, or config files with secrets

## Files to NEVER Commit

These files are already in `.gitignore` but be aware:
- `config.js` (contains Firebase credentials)
- `node_modules/`
- `.env` files
- Any files with API keys or passwords

## Quick Workflow Cheat Sheet

```bash
git status              # Check what changed
git add .               # Stage all changes
git commit -m "msg"     # Commit with message
git push origin main    # Push to GitHub
```

That's it! You now have a complete guide for managing your code with Git.
