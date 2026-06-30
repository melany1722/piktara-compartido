import React from 'react'
import Comic from './Pages/Comic'
import NuestroComic from './Pages/NuestroComic'
import SobrePiktara from './Pages/SobrePiktara'
import Home from './Pages/Home'
import Trailer from './Pages/Trailer'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MelanyEstrellas } from './Pages/MelanyEstrellas'
import EscenaJ from './Pages/EscenaJ'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre-piktara" element={<SobrePiktara />} />
        <Route path="/nuestro-comic" element={<Trailer />} />
        <Route path="/sobre-el-proyecto" element={<NuestroComic />} />
        <Route path="/comic" element={<EscenaJ />} />
        <Route path="/comic/alien" element={<Comic />} />
        <Route path="/melany" element={<MelanyEstrellas />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App