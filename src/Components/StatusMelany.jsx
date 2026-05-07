import React, { useEffect, useState } from 'react'

const StatusMelany = () => {
    const [gemas, setGemas] = useState(0)  
    
    const getCharacters= async()=>{
        const res= await fetch("https://rickandmortyapi.com/api/character")
        const data = await res.json()
        console.log( data )
    }

    useEffect(() => {

   getCharacters()

    }, [])



  return (
    <>
    <div className='gemas'>
        <h1>Gemas: {gemas}</h1>     
        <button onClick={ () => { setGemas( (prev) => {prev + 2} ) } }>Gemas Azules</button>
        <button onClick={ () => { setGemas( () => {} ) } }>Gemas Verdes</button>        
        <button onClick={ () => { setGemas( () => {} ) } }>Gemas Gris</button>
        <button onClick={ () => {setGemas ( () => {} ) } }>Gemas Rojas</button>
</div>






    <div>StatuMelany</div>
    </>
    
  )
}

export default StatusMelany