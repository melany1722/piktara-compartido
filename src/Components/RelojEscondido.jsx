import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { sumarPunto, recogerReloj } from "./Contador";

// =====================================================================
//  RELOJ ESCONDIDO (el mismo para las 8 escenas)
//  Guardar como: src/Components/RelojEscondido.jsx
//
//  Uso dentro del recuadro de la escena (el div con position: "relative"):
//
//    import RelojEscondido from "../Components/RelojEscondido";
//    <RelojEscondido clave="relojEscena5" left="42%" top="62%" />
//
//  - Al hacer UN clic en el reloj: el punto se suma al instante, el reloj vuela al
//    contador y desaparece.
//  - Cada reloj suma una sola vez en total (la clave identifica la escena).
//    Si ya se encontró antes, el reloj ya no aparece.
//
//  Props:
//    clave   (obligatoria) "relojEscena1" … "relojEscena8"
//    left, top   posición del CENTRO del reloj (px o %, dentro de la escena)
//    size        tamaño en px (por defecto 46)
//    pegatina    true = círculo crema con borde punteado (se ve mejor en fondos claros)
//    entrada     true = aparece saltando (para relojes que salen de un jarrón, etc.)
//    salto       cuántos px sube al aparecer (solo con entrada)
//    zIndex      capa (por defecto 100)
//    onRecogido  función que se llama cuando ya se recogió
// =====================================================================

const palette = { crema: "#FFF8E7", borde: "#3A2312" };

const yaEncontrado = (clave) => {
  try {
    return localStorage.getItem(clave) === "true";
  } catch (e) {
    return false;
  }
};

const RelojEscondido = ({
  clave,
  left,
  top,
  size = 46,
  pegatina = false,
  entrada = false,
  salto = 0,
  zIndex = 100,
  onRecogido,
}) => {
  const ref = useRef(null);
  const recogiendo = useRef(false);
  const [oculto, setOculto] = useState(() => yaEncontrado(clave));

  // Salto de aparición (solo si "entrada")
  useEffect(() => {
    if (!entrada || oculto || !ref.current) return;
    const tl = gsap
      .timeline()
      .fromTo(
        ref.current,
        { opacity: 0, scale: 0.3, y: 0 },
        { opacity: 1, scale: 1.4, y: -salto * 1.7, duration: 0.35, ease: "power2.out" }
      )
      .to(ref.current, { y: -salto, scale: 1, duration: 0.5, ease: "bounce.out" });
    return () => tl.kill();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const alClic = (e) => {
    e.stopPropagation();
    if (recogiendo.current) return;
    recogiendo.current = true;

    // 1) el punto se suma AL INSTANTE
    sumarPunto(clave);
    // 2) copia del reloj que vuela hasta el contador (solo efecto visual)
    recogerReloj(clave, e.currentTarget);
    // 3) el reloj de la escena desaparece
    setOculto(true);
    if (onRecogido) onRecogido();
  };

  if (oculto) return null;

  return (
    <>
      <style>{`
        @keyframes relojBrillo {
          0%, 100% { filter: drop-shadow(0 0 5px #FFC300); }
          50% { filter: drop-shadow(0 0 13px #FFC300); }
        }
      `}</style>
      <div
        ref={ref}
        role="button"
        aria-label="Reloj escondido"
        onClick={alClic}
        style={{
          position: "absolute",
          left,
          top,
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          cursor: "pointer",
          zIndex,
          opacity: entrada ? 0 : 1,
          touchAction: "manipulation",
        }}
      >
        <img
          src="/RELOJ.svg"
          alt=""
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
            borderRadius: "50%",
            pointerEvents: "none",
            animation: "relojBrillo 1.6s ease-in-out infinite", // solo brilla, NO se mueve
            ...(pegatina
              ? { background: palette.crema, padding: 4, border: `2px dashed ${palette.borde}`, boxSizing: "border-box" }
              : {}),
          }}
        />
      </div>
    </>
  );
};

export default RelojEscondido;