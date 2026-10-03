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

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nuestro-comic" element={<Trailer />} />

        {/* Las 8 escenas, en orden */}
        <Route path="/comic/1" element={<Comicj />} />
        <Route path="/comic/2" element={<MelanyEstrellas />} />
        <Route path="/comic/3" element={<Comic />} />
        <Route path="/comic/4" element={<Comic4 />} />
        <Route path="/comic/5" element={<Comic5 />} />
        <Route path="/comic/6" element={<Comic6 />} />
        <Route path="/comic/7" element={<Comic7 />} />
        <Route path="/comic/8" element={<Comic8 />} />

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