import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

window.addEventListener('error', (event) => {
  document.body.innerHTML = `<div style="padding: 20px; color: red;">
    <h2>JavaScript Error:</h2>
    <pre>${event.message}</pre>
    <pre>${event.filename}:${event.lineno}</pre>
  </div>`;
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
