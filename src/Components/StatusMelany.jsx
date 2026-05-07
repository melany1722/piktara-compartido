import React, { useState } from 'react'

const StatusMelany = () => {
    const [gemas, setGemas] = useState(0)      



  return (
    <>
    <div className='gemas'>     
        <button onClick={ () => { setGemas( () => {} ) } }>Gemas Azules</button>
        <button>Gemas Verdes</button>        
        <button>Gemas Gris</button>
        <button>Gemas Rojas</button>
</div>






    <div>StatuMelany</div>
    </>
    
  )
}

export default StatusMelany