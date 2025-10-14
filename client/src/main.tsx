import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/app.tsx'
import '@/index.css'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster />
    <App />
  </StrictMode>,
)
