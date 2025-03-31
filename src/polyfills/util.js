
// Polyfill for Node.js 'util' module
const util = {
  promisify: function promisify(fn) {
    return function(...args) {
      return new Promise((resolve, reject) => {
        fn(...args, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    };
  },
  
  inherits: function inherits(ctor, superCtor) {
    ctor.super_ = superCtor;
    Object.setPrototypeOf(ctor.prototype, superCtor.prototype);
  },
  
  // Add other util methods as needed
  debuglog: () => () => {},
  deprecate: fn => fn,
  format: (...args) => args.join(' '),
  inspect: obj => JSON.stringify(obj),
};

// Make util available globally
if (typeof window !== 'undefined') {
  window.util = util;
  console.log("util module polyfill initialized");
}

// Handle module.exports for Node.js-like environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = util;
} else if (typeof window !== 'undefined') {
  // For pure browser environments without module system
  window._utilExports = util;
}
