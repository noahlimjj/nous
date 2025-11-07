#!/bin/bash

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║   Offline Mode Setup Verification                     ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

PASSED=0
FAILED=0

check_file() {
    local file="$1"
    local description="$2"

    if [ -f "$file" ]; then
        echo "✅ $description"
        ((PASSED++))
        return 0
    else
        echo "❌ $description - FILE NOT FOUND"
        ((FAILED++))
        return 1
    fi
}

check_content() {
    local file="$1"
    local pattern="$2"
    local description="$3"

    if grep -q "$pattern" "$file" 2>/dev/null; then
        echo "✅ $description"
        ((PASSED++))
        return 0
    else
        echo "❌ $description - PATTERN NOT FOUND"
        ((FAILED++))
        return 1
    fi
}

echo "📁 Checking Core Files..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_file "service-worker-v18.js" "Service Worker v18"
check_file "offline-handler.js" "Offline Handler"
check_file "index.html" "Main HTML"
check_file "index.js" "Main JS"
check_file "manifest.json" "PWA Manifest"
echo ""

echo "🔧 Checking Configuration..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_content "index.html" "service-worker-v18.js" "index.html registers v18 SW"
check_content "index.html" "offline-handler.js" "index.html loads offline handler"
check_content "service-worker-v18.js" "nous-v18-phase2" "SW has correct cache version"
check_content "service-worker-v18.js" "request.mode === 'navigate'" "SW handles navigation"
check_content "offline-handler.js" "offline-indicator" "Handler creates indicator"
echo ""

echo "🧪 Checking Test Files..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_file "tests/test-offline-with-handler.spec.js" "Offline handler test"
check_file "tests/full-offline-test.spec.js" "Full offline test"
check_file "tests/debug-sw-v18.spec.js" "SW debug test"
check_file "tests/test-comprehensive-offline.spec.js" "Comprehensive test"
check_file "run-all-tests.sh" "Test automation script"
echo ""

echo "📚 Checking Documentation..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_file "QUICK_TEST_GUIDE.md" "Quick test guide"
check_file "UPDATE_SW.md" "SW update guide"
check_file "diagnose-offline.html" "Diagnostic tool"
check_file "OFFLINE_MODE_COMPLETE.md" "Complete documentation"
echo ""

echo "🔍 Checking Service Worker Registration..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if SW registration code exists and looks correct
if grep -q "navigator.serviceWorker.register" index.html 2>/dev/null; then
    echo "✅ SW registration code present"
    ((PASSED++))

    # Check if v18 is referenced
    if grep -q "service-worker-v18.js" index.html 2>/dev/null; then
        echo "✅ SW v18 configured"
        ((PASSED++))
    else
        echo "❌ SW v18 not configured"
        ((FAILED++))
    fi

    # Check if there's version checking logic
    if grep -q "CURRENT_SW\|hasCurrentVersion" index.html 2>/dev/null; then
        echo "✅ SW version checking logic present"
        ((PASSED++))
    else
        echo "⚠️  No SW version checking (may reload multiple times)"
    fi
else
    echo "❌ SW registration code not found"
    ((FAILED++))
fi
echo ""

# Summary
echo "╔════════════════════════════════════════════════════════╗"
echo "║   VERIFICATION SUMMARY                                 ║"
echo "╠════════════════════════════════════════════════════════╣"
echo "║ ✅ Passed: $PASSED                                             ║"
echo "║ ❌ Failed: $FAILED                                              ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

if [ $FAILED -eq 0 ]; then
    echo "🎉 ALL CHECKS PASSED!"
    echo ""
    echo "Next steps:"
    echo "1. Run tests: bash run-all-tests.sh"
    echo "2. Check diagnostic: http://localhost:8081/diagnose-offline.html"
    echo "3. Manual test: See QUICK_TEST_GUIDE.md"
    echo ""
    exit 0
else
    echo "⚠️  Some checks failed - review output above"
    echo ""
    exit 1
fi
