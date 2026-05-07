import React from 'react'

const StatusKevin = () => {
    const [puntos, setpuntos] = useState(0)      



  return (
    <>
    <div className='puntos'>  
      <h1>Puntos: {puntos}</h1>   
        <button onClick={ () => { setpuntos( (prev) => {prev + 2} ) } }>puntos +10s</button>
        <button onClick={ () => { setpuntos( () => {} ) } }>puntos +20s</button>        
        <button onClick={ () => { setpuntos( () => {} ) } }>puntos +30s</button>
        <button onClick={ () => {setpuntos( () => {} ) } }>puntos +40s</button>
</div>






    <div>StatusKevin</div>
    </>
    
  )
}

export default StatusKevin