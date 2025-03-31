
// Import and initialize polyfills first
import './polyfills';
import initPolyfills from './polyfills';

// Initialize React
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize polyfills explicitly and verify they're working
initPolyfills();

// Debug info to verify polyfills are working
console.log("main.tsx loaded");
console.log("Global util check:", window.util);
console.log("Global crypto check:", window.crypto && window.crypto.randomBytes ? "randomBytes available" : "no randomBytes");
console.log("Global require check:", window.require);

createRoot(document.getElementById("root")!).render(<App />);
