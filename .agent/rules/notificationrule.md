---
trigger: always_on
---

# Notification Rules
When agent pauses for approval, task completes, or generates Inbox artifact:
1. Execute: curl -d "🚨 Antigravity: [current-task] needs review" ntfy.sh/antigravity
2. Wait for "approved" before continuing.
3. On completion: curl -d "✅ Task complete: Check $(pwd)" ntfy.sh/antigravity