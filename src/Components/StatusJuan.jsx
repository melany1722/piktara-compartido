import React, { useEffect, useState } from 'react'

const StatusJuan = () => {
  const [corazon, setcorazon] = useState(0)  
  const [personajes, setpersonajes] = useState([])

  const getCharacters = async () => {

    const res = await fetch('https://rickandmortyapi.com/api/character')
    const data = await res.json()

    setpersonajes(data.results)
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


<h1>personajes Rick and Morty (Juan)</h1>
{
  personajes.map((per, index) => (
    <li key={index}>{per.name}</li>
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



    <div>StatusJuan</div>
    </>
  )
}

export default StatusJuan