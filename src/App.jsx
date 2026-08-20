import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Trailer from './Pages/Trailer'
import Comic from './Pages/Comic'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nuestro-comic" element={<Trailer />} />
        <Route path="/comicj" element={<Comic />} />
        <Route path="/melany" element={<Comic />} />
        <Route path="/comic" element={<Comic />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App