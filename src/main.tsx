import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { applyMode, getMode } from './utils/theme'
import App from './App.tsx'

// Apply the persisted color mode (auto/light/dark) before first paint
applyMode(getMode())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
