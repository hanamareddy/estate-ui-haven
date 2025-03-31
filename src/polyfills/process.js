
// Polyfill for Node.js 'process' module
const process = {
  env: {},
  browser: true,
  version: 'v16.0.0',
  nextTick: function(callback) {
    return setTimeout(callback, 0);
  },
  // Add other process properties/methods as needed
  platform: 'browser',
  cwd: () => '/',
  exit: () => {},
};

// Make process available globally
if (typeof window !== 'undefined') {
  window.process = window.process || process;
  console.log("process module polyfill initialized");
}

// Handle module.exports for Node.js-like environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = process;
} else if (typeof window !== 'undefined') {
  // For pure browser environments without module system
  window._processExports = process;
}
