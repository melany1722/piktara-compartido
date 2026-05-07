import React, { useEffect, useState } from 'react'

const StatusKevin = () => {
    const [puntos, setpuntos] = useState(0)      
const [personajes, setPersonajes] = useState([])
  const getCharacters = async () => {

    const res = await fetch("https://rickandmortyapi.com/api/character")
    const data = await res.json()
    



  setPersonajes(data.results)
    console.log(data);
   
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





<h1>Personajes Rick And Morty (Kevin)</h1>
{
 personajes.map((per, index) => (
  <li key={index}>{per.name} </li>
 ))

}

<div class="card" style={{width: "18rem;"}}>
  <img src="..." class="card-img-top" alt="..."/>
  <div class="card-body">
    <h5 class="card-title">Card title</h5>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>



    <div>StatusKevin</div>
    </>
    
  )
}

export default StatusKevin