import React, { useState } from 'react'

const StatusMelany = () => {
    const [gemas, setGemas] = useState(0)      



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