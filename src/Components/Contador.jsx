import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

// =====================================================================
//  CONTADOR DE PROGRESO (compartido por las 8 escenas)
//  Guardar como: src/Components/Contador.jsx
//
//  Uso en cada escena:
//    import Contador, { recogerReloj } from "../Components/Contador";
//    <Contador />                                   → dentro del recuadro de la escena
//    recogerReloj("relojComic", e.currentTarget);   → al hacer clic en el reloj
//
//  - El reloj vuela hasta el contador y, al llegar, suma 1 punto.
//  - Cada reloj solo suma UNA vez (la clave identifica de qué escena es).
//  - El total se guarda en localStorage ("piktaraScore").
// =====================================================================

const fDisplay = "'Baloo 2', 'Comic Sans MS', sans-serif";
const palette = {
  morado: "#5A189A",
  crema: "#FFF8E7",
  borde: "#3A2312",
};

const CLAVE_PUNTOS = "piktaraScore";
const EVENTO = "piktara-score";
const ID_CONTADOR = "contador-progreso";

const leerPuntos = () => Number(localStorage.getItem(CLAVE_PUNTOS)) || 0;

// Suma 1 punto solo si ese reloj no se había encontrado antes
export const sumarPunto = (claveReloj) => {
  if (localStorage.getItem(claveReloj) === "true") return false;
  localStorage.setItem(claveReloj, "true");
  localStorage.setItem(CLAVE_PUNTOS, String(leerPuntos() + 1));
  window.dispatchEvent(new Event(EVENTO));
  return true;
};

// El reloj vuela desde donde está hasta el contador y, al llegar, suma el punto
export const recogerReloj = (claveReloj, origen) => {
  const destino = document.getElementById(ID_CONTADOR);

  if (!origen || !destino) {
    sumarPunto(claveReloj);
    return;
  }

  const o = origen.getBoundingClientRect();
  const d = destino.getBoundingClientRect();

  const vuelo = document.createElement("img");
  vuelo.src = "/RELOJ.svg";
  vuelo.style.cssText =
    "position:fixed;top:0;left:0;width:26px;pointer-events:none;z-index:9999;" +
    "filter:drop-shadow(0 0 6px #FFC300);";
  document.body.appendChild(vuelo);

  gsap.set(vuelo, {
    xPercent: -50,
    yPercent: -50,
    x: o.left + o.width / 2,
    y: o.top + o.height / 2,
    rotate: -12,
  });

  gsap.to(vuelo, {
    x: d.left + d.width / 2,
    y: d.top + d.height / 2,
    scale: 0.25,
    rotate: 360,
    duration: 0.75,
    ease: "power2.inOut",
    onComplete: () => {
      vuelo.remove();
      sumarPunto(claveReloj);
    },
  });
};

// El recuadro: va arriba a la izquierda dentro del marco de cada escena
const Contador = () => {
  const [puntos, setPuntos] = useState(leerPuntos);
  const [pulso, setPulso] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    const alCambiar = () => {
      setPuntos(leerPuntos());
      setPulso(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setPulso(false), 500);
    };
    window.addEventListener(EVENTO, alCambiar);
    return () => {
      window.removeEventListener(EVENTO, alCambiar);
      clearTimeout(timer.current);
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes contadorPop {
          0% { transform: scale(1); }
          40% { transform: scale(1.35) rotate(6deg); }
          70% { transform: scale(0.9) rotate(-4deg); }
          100% { transform: scale(1); }
        }
      `}</style>
      <div
        id={ID_CONTADOR}
        style={{
          position: "absolute",
          top: "30px",
          left: "30px",
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          fontFamily: fDisplay,
          background: palette.crema,
          color: palette.morado,
          padding: "5px 16px",
          borderRadius: "14px",
          border: `3.5px solid ${palette.borde}`,
          boxShadow: `0 4px 0 ${palette.borde}`,
          fontSize: "0.95rem",
          fontWeight: 800,
          pointerEvents: "none",
          animation: pulso ? "contadorPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)" : "none",
        }}
      >
        <span style={{ marginRight: "8px", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" }}>
          Progreso:
        </span>
        {puntos}
      </div>
    </>
  );
};

export default Contador;