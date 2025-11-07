#!/bin/bash

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║   Running ALL Offline Mode Tests                      ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

PASSED=0
FAILED=0

run_test() {
    local test_name="$1"
    local test_file="$2"
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🧪 Test: $test_name"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    if npx playwright test "$test_file" --reporter=list 2>&1 | tail -5 | grep -q "1 passed"; then
        echo "✅ PASSED: $test_name"
        ((PASSED++))
    else
        echo "❌ FAILED: $test_name"
        ((FAILED++))
    fi
    echo ""
}

# Run all tests
run_test "Offline Handler" "tests/test-offline-with-handler.spec.js"
run_test "Complete Offline Test" "tests/full-offline-test.spec.js"
run_test "Debug SW v18" "tests/debug-sw-v18.spec.js"
run_test "Comprehensive Test" "tests/test-comprehensive-offline.spec.js"

# Summary
echo "╔════════════════════════════════════════════════════════╗"
echo "║   TEST SUMMARY                                         ║"
echo "╠════════════════════════════════════════════════════════╣"
echo "║ ✅ Passed: $PASSED                                              ║"
echo "║ ❌ Failed: $FAILED                                              ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

if [ $FAILED -eq 0 ]; then
    echo "🎉 ALL TESTS PASSED!"
    exit 0
else
    echo "⚠️  Some tests failed"
    exit 1
fi
