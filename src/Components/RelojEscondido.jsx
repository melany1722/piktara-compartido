import React, { useState } from "react";
import { recogerReloj } from "./Contador";

// =====================================================================
//  RELOJ ESCONDIDO (escenas 3 a 8)
//  Guardar como: src/Components/RelojEscondido.jsx
//
//  Uso:
//    <RelojEscondido clave="relojEscena3" left="42%" top="62%" size={34} pegatina />
//
//  - Aparece SIEMPRE que se carga la escena (no mira localStorage para mostrarse).
//  - Al hacer clic vuela al contador y desaparece hasta que se recargue la escena.
//  - El punto se suma solo la primera vez que se encuentra (lo controla Contador),
//    así el progreso nunca pasa de 8.
//
//  Props: clave · left / top (en % de la escena) · size (px) · zIndex (por defecto 40)
//  Todos los relojes se ven iguales: sin círculo alrededor, solo el brillo amarillo.
//  Si una escena todavía pasa la prop "pegatina", se ignora (no hace falta quitarla).
//
//  Props opcionales:
//    caer      = true → el reloj entra "soltado": cae desde arriba, rebota y se queda balanceándose
//                (se usa en la escena 4: Atreus lo suelta al caer derrotado)
//    onRecoger = función que se llama cuando hacen clic en el reloj
// =====================================================================

const palette = {
  amarillo: "#FFC300",
  crema: "#FFF8E7",
  borde: "#3A2312",
};

const RelojEscondido = ({ clave, left, top, size = 34, zIndex = 40, caer = false, onRecoger }) => {
  const [recogido, setRecogido] = useState(false); // solo vale mientras dura esta visita a la escena

  if (recogido) return null;

  const alClic = (e) => {
    e.stopPropagation();
    recogerReloj(clave, e.currentTarget); // vuela al contador y suma el punto al llegar
    setRecogido(true);
    if (onRecoger) onRecoger(); // avisa a la escena que ya lo recogieron
  };

  return (
    <>
      <style>{`
        @keyframes relojEscondidoWiggle {
          0%, 100% { transform: translate(-50%, -50%) rotate(-18deg) scale(1); }
          50% { transform: translate(-50%, -50%) rotate(-10deg) scale(1.08); }
        }
        @keyframes relojSueltoCae {
          0% { transform: translate(-450%, -650%) scale(0.4) rotate(-220deg); opacity: 0; }
          15% { opacity: 1; }
          55% { transform: translate(-50%, -50%) scale(1.2) rotate(0deg); opacity: 1; }
          72% { transform: translate(-50%, -190%) scale(1) rotate(-10deg); opacity: 1; }
          88% { transform: translate(-50%, -50%) scale(1.05) rotate(-16deg); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1) rotate(-18deg); opacity: 1; }
        }
      `}</style>
      <img
        src="/RELOJ.svg"
        alt="Reloj escondido"
        draggable={false}
        onClick={alClic}
        style={{
          position: "absolute",
          left,
          top,
          width: size,
          height: size,
          objectFit: "contain",
          cursor: "pointer",
          zIndex,
          pointerEvents: "auto",
          userSelect: "none",
          filter: `drop-shadow(0 0 6px ${palette.amarillo})`,
          animation: caer
            ? "relojSueltoCae 1.1s ease-out 0.4s both, relojEscondidoWiggle 1.6s ease-in-out 1.5s infinite"
            : "relojEscondidoWiggle 1.6s ease-in-out infinite",
        }}
      />
    </>
  );
};

export default RelojEscondido;