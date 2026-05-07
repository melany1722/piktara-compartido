import React, { useEffect, useState } from 'react'

const StatusKevin = () => {
    const [puntos, setpuntos] = useState(0)      

  const getCharacters = async () => {

    const res = await fetch("https://rickandmortyapi.com/api/character")
    const data = await res.json()


    console.log(data)


  }

useEffect(() => {
  getCharacters();

}, [])


  return (
    <>
    <div className='puntos'>  
      <h1>Puntos: {puntos}</h1>   
        <button onClick={ () => { setpuntos( (prev) => {prev + 2} ) } }>puntos +10</button>
        <button onClick={ () => { setpuntos( () => {} ) } }>puntos +20s</button>        
        <button onClick={ () => { setpuntos( () => {} ) } }>puntos +30s</button>
        <button onClick={ () => {setpuntos( () => {} ) } }>puntos +40s</button>
</div>






    <div>StatusKevin</div>
    </>
    
  )
}

export default StatusKevin