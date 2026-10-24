import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

// =====================================================================
//  PANEL DE AYUDA (lateral, se abre y se cierra)
//  Guardar como: src/Components/AyudaEscenas.jsx
//
//  Uso (dentro del recuadro de la escena, el que tiene position: relative):
//    import AyudaEscenas from "../Components/AyudaEscenas";
//    <AyudaEscenas escenaActual={1} />
//
//  Props:
//    escenaActual    = número de la escena (se marca en la fila de 1 a 8)
//    total           = cuántas escenas tiene el cómic (8)
//    abiertaAlInicio = false (por defecto): el panel empieza CERRADO y solo se ve la
//                      pestañita "?"; se abre cuando la persona la toca.
//                      true: sale abierto al entrar a la escena.
// =====================================================================

const fDisplay = "'Baloo 2', 'Comic Sans MS', sans-serif";
const fBody = "'Quicksand', 'Comic Sans MS', sans-serif";

const palette = {
  morado: "#5A189A",
  amarillo: "#FFC300",
  crema: "#FFF8E7",
  borde: "#3A2312",
};

const ITEMS = [
  {
    icono: "👆",
    texto: (
      <>
        Toca, arrastra y explora. <b>No todo es interactivo</b>, pero hay cosas que se mueven, se encienden o se
        pueden agarrar.
      </>
    ),
  },
  {
    reloj: true,
    texto: (
      <>
        En <b>cada escena</b> hay un <b>reloj escondido</b>. ¡Encuéntralo para poder seguir avanzando a la
        siguiente escena!
      </>
    ),
  },
  {
    icono: "⭐",
    texto: (
      <>
        Cada reloj suma <b>1 punto</b> en tu Progreso (arriba a la izquierda).
      </>
    ),
  },
  {
    icono: "➡️",
    texto: (
      <>
        Usa las flechas <b>{"<"}</b> y <b>{">"}</b> para moverte entre escenas.
      </>
    ),
  },
];

// Escena 4: en vez de buscar el reloj escondido, hay que golpear a Atreus.
// Reemplaza el 2.º punto de la lista (el del reloj escondido) solo en esa escena.
const ESCENA_ATREUS = 4;
const ITEM_ATREUS = {
  icono: "👊",
  texto: (
    <>
      En esta escena <b>debes golpear a Atreus</b>. ¡Dale clic muchas veces hasta derrotarlo!
    </>
  ),
};

export default function AyudaEscenas({ escenaActual = 1, total = 8, abiertaAlInicio = false }) {
  const [abierta, setAbierta] = useState(abiertaAlInicio);
  const raizRef = useRef(null);
  const panelRef = useRef(null);
  const tabRef = useRef(null);

  // Lista que se muestra: igual para todas las escenas, menos la 4
  const items = ITEMS.map((it, i) => (escenaActual === ESCENA_ATREUS && i === 1 ? ITEM_ATREUS : it));

  // Entrada:
  //  - cerrado (por defecto): el panel queda escondido a la izquierda y solo asoma la pestañita "?"
  //  - abierto: el panel se desliza desde la izquierda y su contenido aparece en cascada
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const xFinal = abiertaAlInicio ? 0 : -100;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(panel, { autoAlpha: 1, xPercent: xFinal });
      return;
    }

    const ctx = gsap.context(() => {
      if (abiertaAlInicio) {
        gsap
          .timeline({ delay: 0.5 })
          .fromTo(
            panel,
            { xPercent: -105, autoAlpha: 0 },
            { xPercent: 0, autoAlpha: 1, duration: 0.9, ease: "back.out(1.4)" }
          )
          .fromTo(".ayuda-titulo", { y: -16, opacity: 0, scale: 0.8 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" }, "-=0.45")
          .fromTo(".ayuda-item", { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, stagger: 0.14, ease: "power3.out" }, "-=0.2")
          .fromTo(".ayuda-dot", { scale: 0 }, { scale: 1, duration: 0.4, stagger: 0.06, ease: "back.out(3)" }, "-=0.2");
      } else {
        // empieza cerrado: sin animación de entrada, el panel ya está escondido
        gsap.set(panel, { autoAlpha: 1, xPercent: -100 });
      }

      // bucles: el reloj del tutorial se mece y la escena actual late
      gsap.fromTo(".ayuda-reloj", { rotation: -14 }, { rotation: 14, duration: 0.45, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.fromTo(".ayuda-pulso", { scale: 1, opacity: 0.7 }, { scale: 2, opacity: 0, duration: 1.2, ease: "power2.out", repeat: -1, delay: 2.5 });
    }, raizRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Con el panel cerrado, la pestañita late para llamar la atención
  useEffect(() => {
    const tab = tabRef.current;
    if (!tab || abierta) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = gsap.to(tab, { scale: 1.18, duration: 0.6, ease: "sine.inOut", yoyo: true, repeat: -1 });
    return () => {
      t.kill();
      gsap.set(tab, { scale: 1 });
    };
  }, [abierta]);

  const alternar = () => {
    const abrir = !abierta;
    setAbierta(abrir);
    gsap.to(panelRef.current, {
      xPercent: abrir ? 0 : -100,
      duration: abrir ? 0.7 : 0.5,
      ease: abrir ? "back.out(1.5)" : "power3.in",
      overwrite: "auto",
    });
    if (abrir && raizRef.current) {
      gsap.fromTo(
        raizRef.current.querySelectorAll(".ayuda-item"),
        { x: -20, opacity: 0.2 },
        { x: 0, opacity: 1, duration: 0.4, stagger: 0.08, delay: 0.15, ease: "power2.out" }
      );
    }
  };

  return (
    <div
      ref={raizRef}
      style={{ position: "absolute", inset: 0, zIndex: 58, pointerEvents: "none", fontFamily: fBody }}
    >
      <div
        ref={panelRef}
        style={{
          position: "absolute",
          left: 0,
          top: "56px",
          width: "clamp(230px, 25%, 330px)",
          maxHeight: "calc(100% - 120px)",
          display: "flex",
          flexDirection: "column",
          visibility: "hidden", // GSAP lo muestra al entrar (así no hay un parpadeo antes de animar)
          pointerEvents: "auto",
        }}
      >
        <div
          style={{
            flex: "1 1 auto",
            minHeight: 0,
            overflowY: "auto",
            background: palette.crema,
            border: `4px solid ${palette.borde}`,
            borderLeft: "none",
            borderRadius: "0 22px 22px 0",
            boxShadow: `0 6px 0 ${palette.borde}`,
            padding: "14px 16px 14px 14px",
            color: palette.borde,
          }}
        >
          <div
            className="ayuda-titulo"
            style={{
              display: "inline-block",
              background: palette.morado,
              color: palette.amarillo,
              fontFamily: fDisplay,
              fontWeight: 800,
              fontSize: "1rem",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              padding: "4px 14px",
              border: `3px solid ${palette.borde}`,
              borderRadius: "14px",
              boxShadow: `0 3px 0 ${palette.borde}`,
              marginBottom: "10px",
            }}
          >
            ¿Cómo se juega?
          </div>

          <div style={{ fontWeight: 700, fontSize: "clamp(0.78rem, 1vw, 0.9rem)", marginBottom: "8px" }}>
            Esta aventura tiene <b>{total} escenas</b>.
          </div>

          {/* fila de escenas 1 a 8 */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
            {Array.from({ length: total }).map((_, i) => {
              const n = i + 1;
              const actual = n === escenaActual;
              return (
                <span
                  key={n}
                  className="ayuda-dot"
                  title={actual ? "Estás aquí" : `Escena ${n}`}
                  style={{
                    position: "relative",
                    width: "24px",
                    height: "24px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    border: `2.5px solid ${palette.borde}`,
                    background: actual ? palette.amarillo : "#ffffff",
                    fontFamily: fDisplay,
                    fontWeight: 800,
                    fontSize: "0.75rem",
                    color: actual ? palette.borde : palette.morado,
                  }}
                >
                  {actual && (
                    <span
                      className="ayuda-pulso"
                      style={{
                        position: "absolute",
                        inset: "-2px",
                        borderRadius: "50%",
                        border: `2.5px solid ${palette.amarillo}`,
                        pointerEvents: "none",
                      }}
                    />
                  )}
                  {n}
                </span>
              );
            })}
          </div>

          {/* qué hay que hacer */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {items.map((it, i) => (
              <div key={i} className="ayuda-item" style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <span
                  style={{
                    flex: "none",
                    width: "30px",
                    height: "30px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#FFF3B0",
                    border: `2.5px solid ${palette.borde}`,
                    borderRadius: "50%",
                    fontSize: "0.95rem",
                    lineHeight: 1,
                  }}
                >
                  {it.reloj ? (
                    <img className="ayuda-reloj" src="/RELOJ.svg" alt="" draggable={false} style={{ width: "20px", display: "block" }} />
                  ) : (
                    it.icono
                  )}
                </span>
                <span style={{ fontWeight: 600, fontSize: "clamp(0.76rem, 0.95vw, 0.88rem)", lineHeight: 1.4 }}>
                  {it.texto}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* pestañita pegada al borde del panel: abre y cierra la ayuda */}
        <button
          ref={tabRef}
          type="button"
          onClick={alternar}
          aria-label={abierta ? "Cerrar ayuda" : "Abrir ayuda"}
          aria-expanded={abierta}
          style={{
            position: "absolute",
            left: "100%",
            top: "14px",
            width: "42px",
            height: "46px",
            padding: 0,
            background: palette.amarillo,
            color: palette.borde,
            border: `4px solid ${palette.borde}`,
            borderLeft: "none",
            borderRadius: "0 14px 14px 0",
            boxShadow: `0 4px 0 ${palette.borde}`,
            fontFamily: fDisplay,
            fontWeight: 800,
            fontSize: "1.5rem",
            lineHeight: 1,
            cursor: "pointer",
          }}
        >
          {abierta ? "‹" : "?"}
        </button>
      </div>
    </div>
  );
}