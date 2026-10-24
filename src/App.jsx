import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './Pages/Home'
import Trailer from './Pages/Trailer'
import Comic from './Pages/Comic'
import MelanyEstrellas from './Pages/MelanyEstrellas'
import Comicj from './Pages/Comicj'
import Comic4 from './Pages/comic4'
import Comic5 from './Pages/comic5'
import Comic6 from './Pages/comic6'
import Comic7 from './Pages/comic7'
import Comic8 from './Pages/comic8'
import ReiniciarAlSalir from './Components/ReiniciarAlSalir'
import BloqueoEscenas, { EscenaProtegida } from './Components/BloqueoEscenas'

const App = () => {
  return (
    <BrowserRouter>
      {/* Reinicia el progreso de relojes cuando se sale del cómic (debe ir dentro del Router) */}
      <ReiniciarAlSalir />
      {/* Bloquea la flecha ">" de cada escena hasta encontrar su reloj */}
      <BloqueoEscenas />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nuestro-comic" element={<Trailer />} />

        {/* Las 8 escenas, en orden. Cada una solo se abre si ya se encontraron los relojes de las anteriores */}
        <Route path="/comic/1" element={<EscenaProtegida n={1}><Comicj /></EscenaProtegida>} />
        <Route path="/comic/2" element={<EscenaProtegida n={2}><MelanyEstrellas /></EscenaProtegida>} />
        <Route path="/comic/3" element={<EscenaProtegida n={3}><Comic /></EscenaProtegida>} />
        <Route path="/comic/4" element={<EscenaProtegida n={4}><Comic4 /></EscenaProtegida>} />
        <Route path="/comic/5" element={<EscenaProtegida n={5}><Comic5 /></EscenaProtegida>} />
        <Route path="/comic/6" element={<EscenaProtegida n={6}><Comic6 /></EscenaProtegida>} />
        <Route path="/comic/7" element={<EscenaProtegida n={7}><Comic7 /></EscenaProtegida>} />
        <Route path="/comic/8" element={<EscenaProtegida n={8}><Comic8 /></EscenaProtegida>} />

        {/* Rutas antiguas: redirigen a la escena que les corresponde ahora */}
        <Route path="/comicj" element={<Navigate to="/comic/1" replace />} />
        <Route path="/comic" element={<Navigate to="/comic/1" replace />} />
        <Route path="/melany" element={<Navigate to="/comic/2" replace />} />
        <Route path="/MelanyEstrellas" element={<Navigate to="/comic/2" replace />} />

        <Route path="*" element={<h1 style={{ padding: 40 }}>404 - Página no encontrada</h1>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App