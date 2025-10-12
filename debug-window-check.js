// Check what's available in window
console.log('🔍 Checking window object...\n');

console.log('window.db:', typeof window.db, window.db);
console.log('window.userId:', typeof window.userId, window.userId);
console.log('window.Timestamp:', typeof window.Timestamp);
console.log('window.collection:', typeof window.collection);
console.log('window.doc:', typeof window.doc);
console.log('window.getDoc:', typeof window.getDoc);
console.log('window.addDoc:', typeof window.addDoc);
console.log('window.query:', typeof window.query);
console.log('window.where:', typeof window.where);
console.log('window.onSnapshot:', typeof window.onSnapshot);

console.log('\n🔍 Checking for React root...');
console.log('Root element:', document.getElementById('root'));

console.log('\n💡 Try this instead:');
console.log('Open React DevTools and inspect the App component props');
console.log('Or check the console for any errors during page load');
