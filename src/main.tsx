import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary";
import "@github/spark/spark"

import App from './App.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'

import "./main.css"
import "./index.css"
import "./styles/theme.css"
import { initCapacitorUI } from './capacitor-setup'

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <App />
   </ErrorBoundary>
)

// Initialize Capacitor UI adjustments (noop on web)
initCapacitorUI()

// Prevent context menu (right-click/long-press) on all images
document.addEventListener('contextmenu', (e) => {
  if (e.target instanceof HTMLImageElement) {
    e.preventDefault();
  }
});
