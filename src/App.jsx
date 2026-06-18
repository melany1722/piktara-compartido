import React from 'react'
import NuestroComic from './Pages/NuestroComic'
import SobrePiktara from './Pages/SobrePiktara'
import Home from './Pages/Home'
import Trailer from './Pages/Trailer'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LottieMelany } from './Components/LottieMelany'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre-piktara" element={<SobrePiktara />} />
        <Route path="/nuestro-comic" element={<Trailer />} />
        <Route path="/sobre-el-proyecto" element={<NuestroComic />} />
        <Route path="/melany" element={<LottieMelany />} />
      </Routes>
    </BrowserRouter>
  )
  
}

export default App