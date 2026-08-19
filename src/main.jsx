import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../src/componentes/encabezado/encabezado.css'
import '../src/componentes/pie_de_pagina/pie_de_pagina.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
