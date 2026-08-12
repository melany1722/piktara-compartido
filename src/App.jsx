import React from 'react'
import Comic from './Pages/Comic'
import NuestroComic from './Pages/NuestroComic'

import Home from './Pages/Home'
import Trailer from './Pages/Trailer'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nuestro-comic" element={<Trailer />} />
        <Route path="/sobre-el-proyecto" element={<NuestroComic />} />
        <Route path="/comicj" element={<Comic />} />
        <Route path="/melany" element={<Comic />} />
        <Route path="/comic" element={<Comic />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App