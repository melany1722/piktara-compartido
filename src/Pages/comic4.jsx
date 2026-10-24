import React, { useState, useRef, useEffect } from 'react';
import { Link } from "react-router-dom";
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
  verde: "#2FBF71",
  fondoEscena: "#FFD9E3",
};

// ===== CURSOR DE GUANTE DE BOX =====
// Usa public/guante-cursor.png (guante.png reducido a 64x64). Los navegadores limitan el cursor a 128x128 px (si es más grande, no se ve).
// "32 28" es el hotspot: el punto de la imagen donde cae el clic (x y, en píxeles desde la esquina
// superior izquierda). Ajústalo al centro o a la punta del puño según el tamaño de tu imagen.
const CURSOR_GUANTE = 'url("/guante-cursor.png") 32 28, pointer';

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
const CLAVE_RELOJ = "relojEscena4";

// ===== TAMAÑO Y POSICIÓN DE ATREUS (porcentajes de la escena) =====
const ATREUS = { left: "37%", bottom: "8%", width: "41%" };

// ===== ZONA DONDE SE PUEDE GOLPEAR A ATREUS =====
// Solo los clics dentro de esta zona cuentan para la barra (los clics fuera no hacen nada).
// Son porcentajes del recuadro de Atreus (el de arriba), así que se mueve con él.
//   left / top: dónde empieza la zona · width / height: su tamaño
// Pon DEBUG_ZONA_GOLPE = true para ver la zona con un recuadro rojo y ajustarla al dibujo.
const ZONA_GOLPE = { left: "28%", top: "6%", width: "44%", height: "88%" };
const DEBUG_ZONA_GOLPE = false;

// ===== DÓNDE QUEDA EL RELOJ QUE SUELTA ATREUS (porcentajes de la escena; es el CENTRO del reloj) =====
// Atreus se robó el reloj: no se ve hasta que cae derrotado. Entonces lo suelta, cae al suelo
// junto a él y ahí se puede recoger. Si no calza con el suelo del dibujo, mueve left / top:
//   left: más alto = más a la derecha · top: más alto = más abajo
const RELOJ_SUELTO = { left: "68%", top: "82%" };

// ===== FASES DE ATREUS =====
// El atreus.json original se dividió en un archivo por fase (las imágenes ya vienen dentro de cada JSON).
// Mientras se llena la barra N, Atreus está en la fase N. Al completar esa barra pasa a la siguiente:
//   fase 1 -> Atreus de pie (sin golpes)
//   fase 2 -> primer golpe (cara aplastada)
//   fase 3 -> ojo morado y nariz sangrando
//   fase 4 -> tambaleándose, a punto de caer
//   caído  -> al completar la 4ª barra cae al suelo
// Archivos en public/lottie-fondo4/
const FASES_ATREUS = [
  { src: "/lottie-fondo4/atreus-fase1.json", base: "/lottie-fondo4/" },
  { src: "/lottie-fondo4/atreus-fase2.json", base: "/lottie-fondo4/" },
  { src: "/lottie-fondo4/atreus-fase3.json", base: "/lottie-fondo4/" },
  { src: "/lottie-fondo4/atreus-fase4.json", base: "/lottie-fondo4/" },
];
const FASE_CAIDO = { src: "/lottie-fondo4/atreus-caido.json", base: "/lottie-fondo4/" };
const TOTAL_FASES = FASES_ATREUS.length;

// Duración de los efectos del golpe (retroceso, temblor, destello, POW)
const EFECTO_MS = 600;

// ===== AJUSTES DE LA BARRA =====
const PASO_POR_CLIC = 7;     // cuánto sube la sección en cada clic (100 / 7 ≈ 15 clics para llenarla)
const PAUSA_MS = 500;        // tiempo sin clics antes de que la sección en curso empiece a bajar
const BAJADA_POR_TICK = 3;   // cuánto baja cada 80 ms cuando dejan de dar clic (0 = se queda quieta)

const Comic4 = () => {
  // Llenado de la sección actual de la barra (0 a 100)
  const [energia, setEnergia] = useState(0);
  const energiaRef = useRef(0);
  const ultimoClic = useRef(0);

  // Golpes completados (cada uno deja una sección llena) y fase actual de Atreus
  const [golpes, setGolpes] = useState(0);
  const [fase, setFase] = useState(0);
  const faseRef = useRef(0);
  const [golpeando, setGolpeando] = useState(false);
  const golpeandoRef = useRef(false);
  const timeoutGolpe = useRef(null);

  // Atreus derrotado y victoria
  const [caido, setCaido] = useState(false);
  const [victoria, setVictoria] = useState(false);
  const victoriaRef = useRef(false);

  // El reloj que soltó Atreus ya fue recogido (solo para el aviso de la ventana de victoria)
  const [relojRecogido, setRelojRecogido] = useState(false);

  // Si dejan de dar clic, baja solo la sección en curso (las completadas se quedan llenas)
  useEffect(() => {
    const id = setInterval(() => {
      if (
        !golpeandoRef.current &&
        !victoriaRef.current &&
        energiaRef.current > 0 &&
        Date.now() - ultimoClic.current > PAUSA_MS
      ) {
        energiaRef.current = Math.max(0, energiaRef.current - BAJADA_POR_TICK);
        setEnergia(energiaRef.current);
      }
    }, 80);
    return () => {
      clearInterval(id);
      clearTimeout(timeoutGolpe.current);
    };
  }, []);

  const manejarClic = () => {
    // Durante el golpe o la victoria los clics no cuentan
    if (golpeandoRef.current || victoriaRef.current) return;

    ultimoClic.current = Date.now();

    const nueva = energiaRef.current + PASO_POR_CLIC;
    if (nueva < 100) {
      energiaRef.current = nueva;
      setEnergia(nueva);
      return;
    }

    // ¡Sección llena = GOLPE a Atreus! La sección se queda llena y empieza la siguiente
    energiaRef.current = 0;
    setEnergia(0);
    setGolpes((g) => g + 1);

    const eraLaUltima = faseRef.current >= TOTAL_FASES - 1;
    if (eraLaUltima) {
      // Último golpe: Atreus cae (y suelta el reloj)
      setCaido(true);
    } else {
      // Atreus pasa a la siguiente fase (más golpeado)
      faseRef.current += 1;
      setFase(faseRef.current);
    }

    golpeandoRef.current = true;
    setGolpeando(true);
    clearTimeout(timeoutGolpe.current);
    timeoutGolpe.current = setTimeout(() => {
      golpeandoRef.current = false;
      setGolpeando(false);
      if (eraLaUltima) {
        victoriaRef.current = true;
        setVictoria(true);
      }
    }, EFECTO_MS);
  };

  const jugarDeNuevo = () => {
    clearTimeout(timeoutGolpe.current);
    energiaRef.current = 0;
    faseRef.current = 0;
    golpeandoRef.current = false;
    victoriaRef.current = false;
    setEnergia(0);
    setFase(0);
    setGolpes(0);
    setGolpeando(false);
    setCaido(false);
    setVictoria(false);
    setRelojRecogido(false); // Atreus vuelve a tener el reloj hasta que lo derroten otra vez
  };

  // Animación que se muestra: la de la fase actual, o la de Atreus caído
  const animacionActual = caido ? FASE_CAIDO : FASES_ATREUS[fase];

  // Cursor de la escena: guante de box; normal en la victoria
  const cursorEscena = victoria ? "default" : CURSOR_GUANTE;

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
        .comic-retry-btn {
          transition: transform 0.15s ease;
        }
        .comic-retry-btn:hover {
          transform: translateY(-3px) scale(1.05);
        }

        @keyframes escenaTiembla {
          0%, 100% { transform: translate(0, 0); }
          15% { transform: translate(-10px, 4px) rotate(-0.6deg); }
          30% { transform: translate(9px, -5px) rotate(0.6deg); }
          45% { transform: translate(-8px, 3px); }
          60% { transform: translate(7px, -3px); }
          80% { transform: translate(-3px, 2px); }
        }
        @keyframes atreusGolpeado {
          0% { transform: translate(0, 0) rotate(0deg); }
          20% { transform: translate(-7%, -2%) rotate(-6deg); }
          45% { transform: translate(3%, 1%) rotate(3deg); }
          70% { transform: translate(-2%, 0) rotate(-1.5deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        @keyframes atreusCae {
          0% { transform: translate(0, -22%) rotate(-18deg); opacity: 0.3; }
          50% { transform: translate(0, 3%) rotate(2deg); opacity: 1; }
          70% { transform: translate(0, -3%) rotate(0deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        @keyframes destelloGolpe {
          0% { opacity: 0.65; }
          100% { opacity: 0; }
        }
        @keyframes powPop {
          0% { transform: translate(-50%, -50%) scale(0.3) rotate(-12deg); opacity: 0; }
          25% { transform: translate(-50%, -50%) scale(1.25) rotate(-6deg); opacity: 1; }
          100% { transform: translate(-50%, -80%) scale(1) rotate(-6deg); opacity: 0; }
        }
        @keyframes barraPulso {
          0%, 100% { box-shadow: 0 3px 0 ${palette.borde}; }
          50% { box-shadow: 0 3px 0 ${palette.borde}, 0 0 14px 4px ${palette.rosa}; }
        }
        @keyframes victoriaEntra {
          0% { opacity: 0; transform: scale(0.6) rotate(-4deg); }
          70% { opacity: 1; transform: scale(1.08) rotate(1deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes oscurece {
          0% { opacity: 0; }
          100% { opacity: 1; }
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
            Aventura 4
          </div>

          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              borderRadius: "22px",
              overflow: "hidden",
              border: `3px solid ${palette.borde}`,
              backgroundColor: palette.fondoEscena,
              cursor: cursorEscena,
              animation: golpeando ? `escenaTiembla ${EFECTO_MS}ms ease-in-out` : "none",
            }}
          >
            {/* Fondo: la sala de columnas. Solo se golpea a Atreus (zona invisible sobre él), no el fondo */}
            <img
              src="/lottie-fondo4/escena-4.png"
              alt="Sala de columnas"
              draggable={false}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                zIndex: 1,
                cursor: cursorEscena,
                userSelect: "none",
              }}
            />

            {/* ATREUS
                capa 1: posición en la escena
                capa 2: caída al suelo cuando se completa la última barra
                capa 3: retroceso y color rojo cada vez que recibe un golpe
                El daño (ojo morado, sangre, caído…) ya viene dibujado en cada JSON de fase */}
            <div
              style={{
                position: "absolute",
                aspectRatio: "1920 / 1080",
                zIndex: 3,
                pointerEvents: "none",
                ...ATREUS,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  transformOrigin: "50% 92%",
                  animation: caido ? "atreusCae 0.7s ease-out" : "none",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    transformOrigin: "50% 92%",
                    animation: golpeando ? `atreusGolpeado ${EFECTO_MS}ms ease-out` : "none",
                    filter: golpeando
                      ? "sepia(1) saturate(6) hue-rotate(-35deg) brightness(1.15)"
                      : "none",
                  }}
                >
                  {/* Solo se monta una animación a la vez; al cambiar de fase se carga el JSON de esa fase */}
                  <LottieEscena
                    key={animacionActual.src}
                    src={animacionActual.src}
                    base={animacionActual.base}
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
              </div>

              {/* Zona de golpe: solo los clics aquí cuentan para la barra */}
              <div
                onClick={manejarClic}
                style={{
                  position: "absolute",
                  ...ZONA_GOLPE,
                  zIndex: 2,
                  pointerEvents: victoria || caido ? "none" : "auto",
                  cursor: cursorEscena,
                  background: DEBUG_ZONA_GOLPE ? "rgba(255, 0, 0, 0.25)" : "transparent",
                  outline: DEBUG_ZONA_GOLPE ? "2px dashed red" : "none",
                }}
              />
            </div>

            {/* Destello rojo del golpe */}
            {golpeando && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "#FF2A2A",
                  zIndex: 30,
                  pointerEvents: "none",
                  animation: `destelloGolpe ${EFECTO_MS}ms ease-out forwards`,
                }}
              />
            )}

            {/* ¡POW! */}
            {golpeando && (
              <div
                style={{
                  position: "absolute",
                  top: "45%",
                  left: "58%",
                  zIndex: 35,
                  pointerEvents: "none",
                  fontFamily: fDisplay,
                  fontWeight: 800,
                  fontSize: "clamp(2rem, 6vw, 4.5rem)",
                  color: palette.amarillo,
                  WebkitTextStroke: `3px ${palette.borde}`,
                  textShadow: `0 5px 0 ${palette.borde}`,
                  animation: `powPop ${EFECTO_MS + 200}ms ease-out forwards`,
                }}
              >
                ¡POW!
              </div>
            )}

            {/* Barra de golpes: una sección por golpe.
                Las completadas se quedan llenas; la actual se va llenando con los clics */}
            <div
              style={{
                position: "absolute",
                top: "14px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "42%",
                zIndex: 50,
                pointerEvents: "none",
                fontFamily: fDisplay,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: 800,
                  fontSize: "0.8rem",
                  color: palette.crema,
                  WebkitTextStroke: `0.5px ${palette.borde}`,
                  textShadow: `0 2px 0 ${palette.borde}`,
                  marginBottom: "3px",
                  letterSpacing: "0.04em",
                }}
              >
                <span>¡GOLPEA A ATREUS!</span>
                <span>FASE {Math.min(fase + 1, TOTAL_FASES)} / {TOTAL_FASES}</span>
                <span>GOLPES: {golpes} / {TOTAL_FASES}</span>
              </div>

              <div
                style={{
                  display: "flex",
                  height: "22px",
                  background: palette.crema,
                  border: `3.5px solid ${palette.borde}`,
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: `0 3px 0 ${palette.borde}`,
                  animation:
                    energia > 80 && !victoria ? "barraPulso 0.3s infinite" : "none",
                }}
              >
                {Array.from({ length: TOTAL_FASES }).map((_, i) => {
                  // Secciones ya completadas = 100%, la actual = energía, las demás = 0%
                  const llenado = i < golpes ? 100 : i === golpes ? energia : 0;
                  return (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        position: "relative",
                        borderRight:
                          i < TOTAL_FASES - 1 ? `3px solid ${palette.borde}` : "none",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${llenado}%`,
                          background:
                            i < golpes
                              ? palette.rosa
                              : `linear-gradient(90deg, ${palette.amarillo}, ${palette.rosa})`,
                          transition: "width 0.08s linear",
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reloj escondido: Atreus se lo robó, así que NO se ve hasta que cae derrotado.
                Entonces lo suelta (cae al suelo con rebote) y ahí se puede recoger.
                Está por encima de la ventana de victoria (zIndex 80) para poder tocarlo.
                Al "Jugar de nuevo" desaparece y vuelve a soltarse cuando lo derroten otra vez
                (el punto solo se suma la primera vez). */}
            {caido && (
              <RelojEscondido
                clave={CLAVE_RELOJ}
                left={RELOJ_SUELTO.left}
                top={RELOJ_SUELTO.top}
                size={34}
                zIndex={80}
                caer
                onRecoger={() => setRelojRecogido(true)}
              />
            )}

            {/* VICTORIA: aparece cuando Atreus ya recibió todos los golpes */}
            {victoria && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 70,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(40, 10, 60, 0.6)",
                  animation: "oscurece 0.5s ease-out forwards",
                }}
              >
                <div
                  style={{
                    textAlign: "center",
                    background: palette.crema,
                    border: `6px solid ${palette.morado}`,
                    borderRadius: "28px",
                    boxShadow: `0 10px 0 ${palette.borde}`,
                    padding: "28px 48px",
                    fontFamily: fDisplay,
                    animation: "victoriaEntra 0.6s ease-out forwards",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: "clamp(2rem, 6vw, 4rem)",
                      color: palette.amarillo,
                      WebkitTextStroke: `3px ${palette.borde}`,
                      textShadow: `0 5px 0 ${palette.borde}`,
                      letterSpacing: "0.04em",
                      lineHeight: 1.1,
                    }}
                  >
                    ¡VICTORIA!
                  </div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      color: palette.borde,
                      margin: "12px 0 20px",
                    }}
                  >
                    ¡Derrotaste a Atreus!
                    {!relojRecogido && (
                      <div style={{ marginTop: "6px", color: palette.morado }}>
                        Soltó el reloj que se había robado: recógelo en el suelo.
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "14px",
                      justifyContent: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <Link
                      to="/comic/5"
                      className="comic-retry-btn text-decoration-none"
                      style={{
                        fontFamily: fDisplay,
                        fontWeight: 800,
                        fontSize: "1.05rem",
                        color: "#fff",
                        background: palette.verde,
                        padding: "10px 24px",
                        borderRadius: "14px",
                        border: `4px solid ${palette.borde}`,
                        boxShadow: `0 5px 0 ${palette.borde}`,
                      }}
                    >
                      SIGUIENTE AVENTURA
                    </Link>

                    <button
                      onClick={jugarDeNuevo}
                      className="comic-retry-btn"
                      style={{
                        fontFamily: fDisplay,
                        fontWeight: 800,
                        fontSize: "1.05rem",
                        color: palette.borde,
                        background: palette.amarillo,
                        padding: "10px 24px",
                        borderRadius: "14px",
                        border: `4px solid ${palette.borde}`,
                        boxShadow: `0 5px 0 ${palette.borde}`,
                        cursor: "pointer",
                      }}
                    >
                      JUGAR DE NUEVO
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Panel de ayuda lateral: cómo se juega en las escenas 1 a 8 */}
            <AyudaEscenas escenaActual={4} />

            <Link
              to="/comic/3"
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
                cursor: "pointer",
              }}
            >
              &lt;
            </Link>

            <Link
              to="/comic/5"
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
                cursor: "pointer",
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

export default Comic4;