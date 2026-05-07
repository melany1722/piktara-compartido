import React, { useEffect, useState } from 'react'

export const StatusAndres = () => {

  const [monedas, setMonedas] = useState(0)
  const [characters, setCharacters] = useState([])


  const getCharacters = async () => {

    const res = await fetch("https://rickandmortyapi.com/api/character");
    const data = await res.json();
    setCharacters(data.results)
    console.log(data);

  }

  useEffect(() => {
    getCharacters();
  }, [])

  return (
    <>
      <div className='monedas'>
        <h1>Monedas: {monedas}</h1>
        <button onClick={() => { setMonedas((prev) => { prev + 2 }) }}>Gemas Azules</button>
        <button onClick={() => { setMonedas(() => { }) }}>Gemas Verdes</button>
        <button onClick={() => { setMonedas(() => { }) }}>Gemas Gris</button>
        <button onClick={() => { setMonedas(() => { }) }}>Gemas Rojas</button>
      </div>

      <h1>Personajes Rick and Morty (Andrés)</h1>
      {
        characters.map( (char, index) => (
          <li key={index}>{char.name}</li>
        ) )
      }

      
    </>
  )
}
