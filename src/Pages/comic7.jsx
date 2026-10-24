import React, { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";
import lottie from "lottie-web";
import "../Comic.css";
import Contador from "../Components/Contador";
import RelojEscondido from "../Components/RelojEscondido";
import LottieEscena from "../Components/LottieEscena";
import AyudaEscenas from "../Components/AyudaEscenas";

const fDisplay = "'Baloo 2', 'Comic Sans MS', sans-serif";

const palette = {
  morado: "#5A189A",
  amarillo: "#FFC300",
  crema: "#FFF8E7",
  borde: "#3A2312",
  rosa: "#FF597B",
  fondoEscena: "#D4F7DC",
};

// =====================================================================
//  PERSONAJES DE LA ESCENA 7 (Adad leyendo y Ninove parpadeando)
//  Cada uno: JSON + imágenes (img_0 a img_3) juntos en su carpeta.
//  Los dos JSON miden 1920x1080 (igual que el fondo) y se colocan por sus PIES.
//
//  x, y   = dónde quedan SUS PIES (en % de la escena; x: más alto = más a la derecha,
//           y: más alto = más abajo)
//  escala = tamaño (1 = el original del JSON, que es muy grande)
//
//  Adad y Ninove vienen dibujados a distinto tamaño (el dibujo de Adad es ~20% más alto),
//  por eso la escala de Ninove es mayor: así se ven del mismo tamaño en pantalla.
// =====================================================================
// Ninove ocupa el lugar donde estaba Adad (centro de la escena, junto al canal).
// Adad pasa a la esquina inferior derecha, sobre la arena libre a la derecha de la vasija.
const ADAD = { x: 94, y: 93, escala: 0.38 };
const NINOVE = { x: 49, y: 86, escala: 0.56 };

const ADAD_JSON = "/lottie-fondo7/adad/Adad_leyendo.json";
const NINOVE_JSON = "/lottie-fondo7/ninove/Ninove_parpadeo.json";

// Dónde están los pies de cada uno dentro de su JSON original (1920x1080). No lo cambies.
const ADAD_PIES = { x: 49.7, y: 81.4 };
const NINOVE_PIES = { x: 50, y: 76.6 };

// Fotogramas que se reproducen al hacer clic. Los JSON tienen mucho tiempo quieto al principio
// (Adad ~2,5 s, Ninove ~3 s), y por eso parecía que el clic no hacía nada.
// Se reproduce solo la parte donde pasa algo: [fotograma inicial, fotograma final].
const ADAD_SEGMENTO = [74, 178];   // Adad mueve la cabeza leyendo
const NINOVE_SEGMENTO = [88, 112]; // Ninove parpadea una vez

// false = Ninove parpadea solo cuando le haces clic. true = parpadea sola, sin parar.
const NINOVE_EN_BUCLE = false;

// ---------------------------------------------------------------------
//  OPACIDAD: los personajes siguen la animación del fondo ("Escena 7 dia", 455 fotogramas)
//    fotogramas 0 a 236  → el fondo de DÍA se va volviendo transparente (100% → 0%)
//    fotograma 214       → aparece el fondo de NOCHE por debajo
//    fotogramas 214 a 232 → aparece la luna
//  Los personajes hacen lo mismo: se desvanecen con el día y reaparecen con la noche.
//  Cuando el fondo vuelve al inicio (al terminar), ellos vuelven a verse al 100%.
// ---------------------------------------------------------------------
const FONDO_NOMBRE = "Escena 7 dia"; // nombre ("nm") del JSON del fondo
const DIA_TRANSPARENTE = 236;         // fotograma en que el fondo de día llega a 0%
const NOCHE_APARECE = 214;            // fotograma en que aparece la noche
const NOCHE_COMPLETA = 232;           // fotograma en que los personajes ya se ven al 100%

const opacidadPersonajes = (f) => {
  if (f <= NOCHE_APARECE) return Math.max(0, 1 - f / DIA_TRANSPARENTE);
  if (f < NOCHE_COMPLETA) {
    const base = Math.max(0, 1 - NOCHE_APARECE / DIA_TRANSPARENTE);
    return base + ((1 - base) * (f - NOCHE_APARECE)) / (NOCHE_COMPLETA - NOCHE_APARECE);
  }
  return 1;
};

// MODO AJUSTAR: pon true para ARRASTRAR al personaje con el mouse y cambiar su tamaño con la rueda.
// Abajo a la derecha sale un panel con la línea para pegar arriba. Luego vuelve a false.
const AJUSTAR_ADAD = false;
const AJUSTAR_NINOVE = false;

// ---------------------------------------------------------------------
//  Carga un personaje Lottie. Se anima SOLO al hacerle clic, vuelve a su
//  primera pose al terminar (no desaparece) y se puede repetir.
// ---------------------------------------------------------------------
const usePersonajeLottie = ({ json, nombre, segmento, enBucle = false, bloqueado = false }) => {
  const ref = useRef(null);
  const animRef = useRef(null);
  const corriendoRef = useRef(false);

  useEffect(() => {
    let cancelado = false;
    let anim = null;
    const carpeta = json.slice(0, json.lastIndexOf("/") + 1); // las imágenes están junto al JSON

    (async () => {
      try {
        const r = await fetch(json);
        if (!r.ok) throw new Error(`No se encontró ${json}`);
        const data = await r.json();
        if (cancelado || !ref.current) return;

        (data.assets || []).forEach((a) => {
          if (!a.p) return;
          a.u = "";
          a.p = encodeURIComponent(a.p);
          const img = new Image();
          img.onerror = () => console.warn(`${nombre}: falta la imagen ${carpeta}${a.p}`);
          img.src = carpeta + a.p;
        });

        anim = lottie.loadAnimation({
          container: ref.current,
          renderer: "svg",
          loop: enBucle,
          autoplay: enBucle,
          animationData: data,
          assetsPath: carpeta,
          rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
        });

        anim.addEventListener("complete", () => {
          corriendoRef.current = false;
          // vuelve a la primera pose (un instante después: si no, lottie se queda
          // en un fotograma vacío y el personaje desaparece)
          setTimeout(() => {
            if (!anim) return;
            anim.resetSegments(true); // vuelve a considerar la animación completa
            anim.goToAndStop(0, true);
          }, 0);
        });

        if (!enBucle) anim.goToAndStop(0, true);
        animRef.current = anim;
      } catch (err) {
        console.warn(`${nombre}:`, err.message, "→ revisa la carpeta del JSON y sus imágenes");
      }
    })();

    return () => {
      cancelado = true;
      if (anim) anim.destroy();
      animRef.current = null;
      corriendoRef.current = false;
    };
  }, [json, nombre, enBucle]);

  const alHacerClic = () => {
    if (bloqueado || enBucle) return;
    const a = animRef.current;
    if (!a || corriendoRef.current) return;
    corriendoRef.current = true;
    if (segmento) a.playSegments(segmento, true);
    else a.goToAndPlay(0, true);
  };

  return { ref, alHacerClic };
};

// ---------------------------------------------------------------------
//  Modo ajustar: arrastrar (mueve los pies) y rueda (tamaño)
// ---------------------------------------------------------------------
const useAjuste = (inicial, activo, escenaRef) => {
  const [v, setV] = useState(inicial);
  const dragRef = useRef(null);

  const handlers = {
    onPointerDown: (e) => {
      if (!activo) return;
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      dragRef.current = { cx: e.clientX, cy: e.clientY, x: v.x, y: v.y };
    },
    onPointerMove: (e) => {
      const d = dragRef.current;
      if (!d || !escenaRef.current) return;
      const r = escenaRef.current.getBoundingClientRect();
      const dx = ((e.clientX - d.cx) / r.width) * 100;
      const dy = ((e.clientY - d.cy) / r.height) * 100;
      setV((n) => ({ ...n, x: +(d.x + dx).toFixed(1), y: +(d.y + dy).toFixed(1) }));
    },
    onPointerUp: () => {
      dragRef.current = null;
    },
    onWheel: (e) => {
      if (!activo) return;
      const paso = e.deltaY < 0 ? 0.02 : -0.02;
      setV((n) => ({ ...n, escala: +Math.max(0.1, n.escala + paso).toFixed(2) }));
    },
  };

  return [v, handlers];
};

// estilo de la capa de un personaje: mismo encuadre 1920x1080, movida y reducida desde sus pies
const estiloPersonaje = (v, pies, z) => ({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  zIndex: z,
  pointerEvents: "none",
  transformOrigin: `${pies.x}% ${pies.y}%`,
  transform: `translate(${v.x - pies.x}%, ${v.y - pies.y}%) scale(${v.escala})`,
  touchAction: "none",
});

const WashiTape = ({ top, left, right, rotate, color }) => (
  <div
    style={{
      position: "absolute",
      top,
      left,
      right,
      width: "70px",
      height: "26px",
      background: color,
      border: `2.5px solid ${palette.borde}`,
      transform: `rotate(${rotate}deg)`,
      boxShadow: `0 3px 0 ${palette.borde}`,
      borderRadius: "4px",
      zIndex: 40,
    }}
  />
);

// Clave del reloj escondido de esta escena en el contador (una por escena: relojEscena1 … relojEscena8)
const CLAVE_RELOJ = "relojEscena7";

const Comic7 = () => {
  const escenaRef = useRef(null); // el recuadro de la escena (para medir el arrastre)

  const adadLottie = usePersonajeLottie({
    json: ADAD_JSON,
    nombre: "Adad",
    segmento: ADAD_SEGMENTO,
    bloqueado: AJUSTAR_ADAD,
  });
  const ninoveLottie = usePersonajeLottie({
    json: NINOVE_JSON,
    nombre: "Ninove",
    segmento: NINOVE_SEGMENTO,
    enBucle: NINOVE_EN_BUCLE,
    bloqueado: AJUSTAR_NINOVE,
  });

  const [adad, adadHandlers] = useAjuste(ADAD, AJUSTAR_ADAD, escenaRef);
  const [ninove, ninoveHandlers] = useAjuste(NINOVE, AJUSTAR_NINOVE, escenaRef);

  // Sigue el fotograma del fondo (lo crea LottieEscena) y ajusta la opacidad de los personajes
  useEffect(() => {
    let anim = null;
    let intentos = 0;

    const aplicar = () => {
      if (!anim) return;
      const o = String(opacidadPersonajes(anim.currentFrame + (anim.firstFrame || 0)));
      [adadLottie.ref.current, ninoveLottie.ref.current].forEach((el) => {
        if (el) el.style.opacity = o;
      });
    };

    const buscar = () => {
      const todas = lottie.getRegisteredAnimations ? lottie.getRegisteredAnimations() : [];
      const fondo = todas.find((a) => a.animationData && a.animationData.nm === FONDO_NOMBRE);
      if (fondo) {
        anim = fondo;
        anim.addEventListener("enterFrame", aplicar);
        aplicar();
        clearInterval(intervalo);
      } else if (++intentos > 50) {
        clearInterval(intervalo);
        console.warn(`No se encontró la animación del fondo "${FONDO_NOMBRE}" para sincronizar la opacidad`);
      }
    };

    // el fondo se carga un instante después (fetch), por eso se busca hasta que aparezca
    const intervalo = setInterval(buscar, 200);
    buscar();

    return () => {
      clearInterval(intervalo);
      if (anim) anim.removeEventListener("enterFrame", aplicar);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const textoAdad = `const ADAD = { x: ${adad.x}, y: ${adad.y}, escala: ${adad.escala} };`;
  const textoNinove = `const NINOVE = { x: ${ninove.x}, y: ${ninove.y}, escala: ${ninove.escala} };`;
  const textoPanel = [AJUSTAR_ADAD && textoAdad, AJUSTAR_NINOVE && textoNinove]
    .filter(Boolean)
    .join("\n");

  const copiarValores = () => {
    console.log(textoPanel);
    if (navigator.clipboard) navigator.clipboard.writeText(textoPanel).catch(() => {});
  };

  return (
    <div
      className="w-100"
      style={{
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        background: palette.crema,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Quicksand:wght@500;600;700&display=swap');

        /* los personajes llenan el recuadro (mismo encuadre 1920x1080 que el fondo) */
        .personaje-lottie svg { width: 100% !important; height: 100% !important; display: block; }

        /* solo las imágenes del personaje reciben el clic (el resto de la capa deja pasar el mouse) */
        .personaje-lottie svg image { pointer-events: auto; cursor: pointer; }

        .comic-nav-btn {
          transition: transform 0.15s ease;
        }
        .comic-nav-btn:hover {
          transform: translateY(-50%) scale(1.12) !important;
        }
        .comic-back-btn:hover {
          transform: translateY(-3px) scale(1.04);
          box-shadow: 0 6px 0 ${palette.borde} !important;
        }
      `}</style>

      <nav
        className="navbar navbar-expand-lg px-4 px-md-5"
        style={{
          background: palette.amarillo,
          flexShrink: 0,
          borderBottom: `6px solid ${palette.morado}`,
          position: "relative",
          zIndex: 20,
        }}
      >
        <Link to="/" className="navbar-brand me-4">
          <img
            src="/logo-piktara.png"
            alt="Piktara"
            style={{ height: "55px", filter: `drop-shadow(0 3px 0 ${palette.borde})` }}
          />
        </Link>

        <Link
          to="/nuestro-comic"
          className="ms-auto comic-back-btn d-flex align-items-center text-decoration-none"
          style={{
            fontFamily: fDisplay,
            fontSize: "0.95rem",
            color: palette.borde,
            background: palette.crema,
            padding: "8px 20px",
            borderRadius: "14px",
            border: `3.5px solid ${palette.borde}`,
            boxShadow: `0 4px 0 ${palette.borde}`,
            fontWeight: 800,
          }}
        >
          VOLVER
        </Link>
      </nav>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          position: "relative",
          padding: "2%",
          zIndex: 5,
        }}
      >
        <div
          style={{
            position: "relative",
            height: "100%",
            aspectRatio: "1920 / 1080",
            maxWidth: "100%",
            background: palette.crema,
            borderRadius: "32px",
            padding: "16px",
            border: `6px solid ${palette.morado}`,
            boxShadow: `0 10px 0 ${palette.borde}`,
          }}
        >
          <WashiTape top="-14px" left="-18px" rotate={-18} color={palette.amarillo} />
          <WashiTape top="-14px" right="-18px" rotate={18} color={palette.rosa} />
          <Contador />

          <div
            style={{
              position: "absolute",
              top: "-6px",
              left: "50%",
              transform: "translate(-50%, 0)",
              background: palette.morado,
              color: palette.crema,
              fontFamily: fDisplay,
              fontWeight: 800,
              fontSize: "0.95rem",
              letterSpacing: "0.04em",
              padding: "6px 24px",
              borderRadius: "0 0 16px 16px",
              border: `3px solid ${palette.borde}`,
              borderTop: "none",
              boxShadow: `0 4px 0 ${palette.borde}`,
              zIndex: 45,
              textTransform: "uppercase",
            }}
          >
            Aventura 7
          </div>

          <div
            ref={escenaRef}
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              borderRadius: "22px",
              overflow: "hidden",
              border: `3px solid ${palette.borde}`,
              backgroundColor: palette.fondoEscena,
            }}
          >
            {/* Fondo de la escena 7: llena todo el marco.
                El JSON y las imágenes (img_0 a img_12) están juntos en public/lottie-fondo7/.
                El nombre del archivo tiene un espacio, por eso va como Fondo%207.json */}
            <LottieEscena
              src="/lottie-fondo7/Fondo%207.json"
              base="/lottie-fondo7/"
              ajuste="xMidYMid slice"
              alClick
              style={{ position: "absolute", inset: 0, zIndex: 1 }}
            />

            {/* Adad leyendo: en la esquina inferior derecha.
                Lee una vez al hacerle clic y vuelve a su pose inicial */}
            <div
              ref={adadLottie.ref}
              className="personaje-lottie"
              onClick={adadLottie.alHacerClic}
              {...adadHandlers}
              style={estiloPersonaje(adad, ADAD_PIES, 3)}
            />

            {/* Ninove parpadeando: donde estaba Adad.
                Parpadea una vez al hacerle clic y vuelve a su pose inicial */}
            <div
              ref={ninoveLottie.ref}
              className="personaje-lottie"
              onClick={ninoveLottie.alHacerClic}
              {...ninoveHandlers}
              style={estiloPersonaje(ninove, NINOVE_PIES, 2)}
            />

            {/* Panel del modo ajustar */}
            {(AJUSTAR_ADAD || AJUSTAR_NINOVE) && (
              <div
                style={{
                  position: "absolute",
                  right: "12px",
                  bottom: "12px",
                  zIndex: 200,
                  background: "rgba(255,255,255,0.95)",
                  border: `3px solid ${palette.borde}`,
                  borderRadius: "12px",
                  padding: "10px 14px",
                  fontFamily: "monospace",
                  fontSize: "0.8rem",
                  color: palette.borde,
                }}
              >
                <div style={{ fontWeight: 800, marginBottom: "4px" }}>
                  Arrastra = mover · Rueda = tamaño
                </div>
                <pre style={{ margin: 0 }}>{textoPanel}</pre>
                <button
                  onClick={copiarValores}
                  style={{
                    marginTop: "6px",
                    cursor: "pointer",
                    fontWeight: 800,
                    border: `2px solid ${palette.borde}`,
                    borderRadius: "8px",
                    background: palette.amarillo,
                    padding: "3px 10px",
                  }}
                >
                  Copiar valores
                </button>
              </div>
            )}

            {/* Reloj escondido: UN clic y se suma al instante */}
            <RelojEscondido clave={CLAVE_RELOJ} left="84%" top="78%" size={36} />

            {/* Panel de ayuda lateral: cómo se juega en las escenas 1 a 8 */}
            <AyudaEscenas escenaActual={7} />

            <Link
              to="/comic/6"
              className="comic-nav-btn d-flex align-items-center justify-content-center text-decoration-none"
              style={{
                position: "absolute",
                top: "50%",
                left: "14px",
                transform: "translateY(-50%)",
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                border: `4px solid ${palette.borde}`,
                background: palette.amarillo,
                color: palette.borde,
                fontSize: "1.8rem",
                fontFamily: fDisplay,
                fontWeight: 800,
                zIndex: 60,
                boxShadow: `0 5px 0 ${palette.borde}`,
              }}
            >
              &lt;
            </Link>

            <Link
              to="/comic/8"
              className="comic-nav-btn d-flex align-items-center justify-content-center text-decoration-none"
              style={{
                position: "absolute",
                top: "50%",
                right: "14px",
                transform: "translateY(-50%)",
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                border: `4px solid ${palette.borde}`,
                background: palette.rosa,
                color: "#fff",
                fontSize: "1.8rem",
                fontFamily: fDisplay,
                fontWeight: 800,
                zIndex: 60,
                boxShadow: `0 5px 0 ${palette.borde}`,
              }}
            >
              &gt;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comic7;