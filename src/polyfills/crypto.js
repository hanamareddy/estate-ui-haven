
// Polyfill for Node.js 'crypto' module
const cryptoPolyfill = {
  // Use the browser's crypto API when available
  randomBytes: function(size) {
    if (typeof window !== 'undefined' && window.crypto) {
      const array = new Uint8Array(size);
      window.crypto.getRandomValues(array);
      return array;
    }
    throw new Error('No cryptographic randomness available');
  },
  
  // Add other crypto methods as needed
  createHash: function() {
    throw new Error('createHash is not implemented in this polyfill');
  },
};

// Make crypto methods available globally without overwriting the native crypto object
if (typeof window !== 'undefined') {
  // Instead of overwriting window.crypto, we'll extend it with our methods
  if (window.crypto) {
    // Only add methods that don't exist
    if (!window.crypto.randomBytes) {
      // Use defineProperty to add a non-enumerable property
      Object.defineProperty(window.crypto, 'randomBytes', {
        value: cryptoPolyfill.randomBytes,
        configurable: true,
        writable: true
      });
    }
  }
  console.log("crypto module polyfill initialized without overwriting native crypto");
}

// Handle module.exports for Node.js-like environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = cryptoPolyfill;
} else if (typeof window !== 'undefined') {
  // For pure browser environments without module system
  window._cryptoExports = cryptoPolyfill;
}
