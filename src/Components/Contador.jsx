import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

// =====================================================================
//  CONTADOR DE PROGRESO (compartido por las 8 escenas)
//  Guardar como: src/Components/Contador.jsx
//
//  Uso en cada escena:
//    import Contador, { recogerReloj } from "../Components/Contador";
//    <Contador />                                   → dentro del recuadro de la escena
//    recogerReloj("relojEscena3", e.currentTarget); → al hacer clic en el reloj
//
//  Cómo funciona ahora:
//   - Hay 8 relojes, uno por escena, con las claves relojEscena1 … relojEscena8.
//   - Los relojes REAPARECEN cada vez que se carga la escena (eso lo hace
//     RelojEscondido, que ya no mira localStorage para decidir si se muestra).
//   - Al hacer clic, el reloj vuela hasta el contador. El punto se suma solo la
//     PRIMERA vez que se encuentra ese reloj, así el contador nunca pasa de 8
//     aunque recarguen la escena y lo vuelvan a tocar.
//   - El puntaje se calcula contando cuántas de las 8 claves están en "true",
//     por eso no se puede desajustar (ya no existe un número "piktaraScore" aparte).
//   - reiniciarProgreso() pone todo en cero. Llamarla al empezar el cómic de nuevo.
// =====================================================================

const fDisplay = "'Baloo 2', 'Comic Sans MS', sans-serif";
const palette = {
  morado: "#5A189A",
  crema: "#FFF8E7",
  borde: "#3A2312",
};

export const TOTAL_RELOJES = 8;
const CLAVES_RELOJES = Array.from({ length: TOTAL_RELOJES }, (_, i) => `relojEscena${i + 1}`);

const EVENTO = "piktara-score";
const ID_CONTADOR = "contador-progreso";

// Valor viejo de versiones anteriores: ya no se usa, se limpia para que no estorbe
try {
  localStorage.removeItem("piktaraScore");
} catch (e) {
  /* sin localStorage: no pasa nada */
}

// Cuenta cuántos de los 8 relojes ya se encontraron
const leerPuntos = () => CLAVES_RELOJES.filter((k) => localStorage.getItem(k) === "true").length;

// Aviso que se dispara cada vez que cambia el progreso (lo escucha BloqueoEscenas)
export const EVENTO_PROGRESO = EVENTO;

// ¿Ya se encontró el reloj de la escena n? (n = 1 … 8)
export const relojEncontrado = (n) => localStorage.getItem(`relojEscena${n}`) === "true";

// Número de la primera escena cuyo reloj todavía no se ha encontrado (9 si ya están los 8).
// Se puede entrar a las escenas 1 … esa escena; las siguientes están bloqueadas.
export const primeraEscenaPendiente = () => {
  for (let n = 1; n <= TOTAL_RELOJES; n++) {
    if (!relojEncontrado(n)) return n;
  }
  return TOTAL_RELOJES + 1;
};

// Marca ese reloj como encontrado (solo suma si no se había encontrado antes)
export const sumarPunto = (claveReloj) => {
  if (!CLAVES_RELOJES.includes(claveReloj)) {
    console.warn(
      `Contador: la clave "${claveReloj}" no es una de ${CLAVES_RELOJES[0]} … ${CLAVES_RELOJES[TOTAL_RELOJES - 1]}, no suma.`
    );
    return false;
  }
  if (localStorage.getItem(claveReloj) === "true") return false;
  localStorage.setItem(claveReloj, "true");
  window.dispatchEvent(new Event(EVENTO));
  return true;
};

// Pone el progreso en cero: borra TODAS las claves de relojes encontrados
export const reiniciarProgreso = () => {
  Object.keys(localStorage)
    .filter((k) => k === "piktaraScore" || k.startsWith("reloj"))
    .forEach((k) => localStorage.removeItem(k));
  window.dispatchEvent(new Event(EVENTO));
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
        {puntos} / {TOTAL_RELOJES}
      </div>
    </>
  );
};

export default Contador;