import React from 'react'
import Comic from './Pages/Comic'
import NuestroComic from './Pages/NuestroComic'
import SobrePiktara from './Pages/SobrePiktara'
import Home from './Pages/Home'
import Trailer from './Pages/Trailer'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LottieMelany } from './Components/LottieMelany'
import { LottieKevin } from './Components/LottieKevin'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre-piktara" element={<SobrePiktara />} />
        <Route path="/nuestro-comic" element={<Trailer />} />
        <Route path="/sobre-el-proyecto" element={<NuestroComic />} />
        <Route path="/melany" element={<LottieMelany />} />
        <Route path="/kevin" element={<LottieKevin />} />
        <Route path="/comic" element={<Comic />} />
      </Routes>
    </BrowserRouter>
  )
  
}

export default App