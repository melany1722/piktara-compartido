import React from 'react'

const StatusKevin = () => {
    const [puntos, setpuntos] = useState(0)      



  return (
    <>
    <div className='puntos'>  
      <h1>Puntos: {puntos}</h1>   
        <button onClick={ () => { setpuntos( (prev) => {prev + 2} ) } }>puntos +10</button>
        <button onClick={ () => { setpuntos( () => {} ) } }>puntos +20</button>        
        <button onClick={ () => { setpuntos( () => {} ) } }>puntos +30</button>
        <button onClick={ () => {setpuntos( () => {} ) } }>puntos +40</button>
</div>






    <div>StatusKevin</div>
    </>
    
  )
}

export default StatusKevin