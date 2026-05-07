import React, { useEffect, useState } from 'react'

const StatusJuan = () => {
  const [corazon, setcorazon] = useState(0)  

  const getCharacters = async () => {

    const res = await fetch('https://rickandmortyapi.com/api/character')
    const data = await res.json()

    console.log(data)
   
  }

  useEffect(() => {
    getCharacters()
  }, [])

  return (
    <>
    <div className='gemas'>  
      <h1>corazones: {corazon}</h1>   
        <button onClick={ () => { setcorazon( (prev) => {prev + 2} ) } }>1</button>
        <button onClick={ () => { setcorazon( () => {} ) } }>2</button>        
        <button onClick={ () => { setcorazon( () => {} ) } }>3</button>
        <button onClick={ () => { setcorazon ( () => {} ) } }>4</button>
</div>










    <div>StatusJuan</div>
    </>
  )
}

export default StatusJuan