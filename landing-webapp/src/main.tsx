import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App.tsx'
import { Analytics } from '@vercel/analytics/react'

// Initialize Google Analytics if measurement ID is provided
const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
if (gaId && typeof window !== 'undefined' && window.gtag) {
  window.gtag('config', gaId);
}

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <App />
    <Analytics />
  </StrictMode>,
)
