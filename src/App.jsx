import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import StatusJuan from './Components/StatusJuan'
import StatusKevin from './Components/StatusKevin'
import StatusMelany from './Components/StatusMelany'
import { StatusAndres } from './Components/StatusAndres'
import NuestroComic from './Pages/NuestroComic'
import SobrePiktara from './Pages/SobrePiktara'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Trailer from './Pages/Trailer'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NuestroComic />} />
        <Route path="/sobre-piktara" element={<SobrePiktara />} />
        <Route path="/nuestro-comic" element={<Trailer />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App