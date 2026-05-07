import React, { useState } from 'react'

export const StatusAndres = () => {

  const [monedas, setMonedas] = useState(0)

  return (
    <>
      <div className='monedas'>
        <h1>Monedas: {monedas}</h1>
        <button onClick={() => { setMonedas((prev) => { prev + 2 }) }}>Gemas Azules</button>
        <button onClick={() => { setMonedas(() => { }) }}>Gemas Verdes</button>
        <button onClick={() => { setMonedas(() => { }) }}>Gemas Gris</button>
        <button onClick={() => { setMonedas(() => { }) }}>Gemas Rojas</button>
      </div>
    </>
  )
}
