
// Import modular polyfills first to ensure they're available
import './polyfills/util.js';
import './polyfills/crypto.js';
import './polyfills/process.js';

// Define a global require function that will handle common Node.js modules
if (typeof window !== 'undefined' && typeof window.require !== 'function') {
  const modules = {
    'util': window.util || window._utilExports,
    'crypto': window.crypto || window._cryptoExports,
    'process': window.process || window._processExports,
  };
  
  // Create a more complete require function that satisfies NodeRequire interface
  const requireFn = function(moduleName: string) {
    if (modules[moduleName]) {
      return modules[moduleName];
    }
    throw new Error(`Module ${moduleName} not found`);
  };

  // Add the missing properties to make TypeScript happy
  requireFn.resolve = (id: string) => id;
  requireFn.cache = {} as NodeModule;
  requireFn.extensions = {
    '.js': () => {},
    '.json': () => {},
    '.node': () => {},
  };
  requireFn.main = undefined;

  // Assign the enhanced require function to window
  window.require = requireFn as any;
  
  // Create Node.js-style module.exports structure if it doesn't exist
  if (typeof window.module === 'undefined') {
    window.module = { exports: {} };
  }
  
  console.log("require polyfill initialized with complete NodeRequire interface");
}

// Add comprehensive type declarations
declare global {
  interface Window {
    util: {
      promisify: (fn: Function) => (...args: any[]) => Promise<any>;
      inherits: (ctor: any, superCtor: any) => void;
      [key: string]: any;
    };
    process: {
      env: Record<string, string>;
      browser: boolean;
      version: string;
      nextTick: (callback: () => void) => void;
      [key: string]: any;
    };
    crypto: Crypto & {
      randomBytes?: (size: number) => Uint8Array;
    };
    module: any;
    require: NodeRequire;
    _utilExports: any;
    _cryptoExports: any;
    _processExports: any;
  }
}

// Export a function to initialize and verify polyfills
export default function initPolyfills() {
  console.log("Polyfills initialization check:");
  console.log("- util.promisify available:", typeof window?.util?.promisify === 'function');
  console.log("- process available:", typeof window?.process !== 'undefined');
  console.log("- crypto.randomBytes available:", typeof window?.crypto?.randomBytes === 'function');
  console.log("- require available:", typeof window?.require === 'function');
  return true;
}

// Export util methods directly for ES modules
export const promisify = window?.util?.promisify;
export const inherits = window?.util?.inherits;
