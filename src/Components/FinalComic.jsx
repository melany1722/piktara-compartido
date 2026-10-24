import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const fDisplay = "'Baloo 2', 'Comic Sans MS', sans-serif";
const palette = {
  morado: "#5A189A",
  amarillo: "#FFC300",
  crema: "#FFF8E7",
  borde: "#3A2312",
  rosa: "#FF597B",
};

const TOTAL_ESCENAS = 8;
const CLAVES = Array.from({ length: TOTAL_ESCENAS }, (_, i) => `relojEscena${i + 1}`);

// Ilustración de la cueva: el archivo debe estar en public/cueva.jpg
// (si lo dejas en null se usa la cueva dibujada aquí mismo).
const CUEVA_IMG = "/cueva.jpg";

// ⚠️ Imagen del reloj: debe ser LA MISMA que usa RelojEscondido (ruta dentro de /public).
// Ejemplo: si en RelojEscondido ves src="/reloj.png", escribe aquí "/reloj.png".
// Si la imagen no carga, se avisa en la consola del navegador (F12) con la ruta que falló.
const RELOJ_IMG = "/RELOJ.svg";

// ⚠️ ÚNICO lugar a ajustar si Contador guarda los relojes de otra forma
const leerTotal = () =>
  CLAVES.filter((k) => {
    try {
      const v = localStorage.getItem(k);
      return v && v !== "false" && v !== "0" && v !== "null";
    } catch {
      return false;
    }
  }).length;

// Estalactitas: [x, ancho, alto] sobre el borde de arriba de la abertura
const ESTALACTITAS = [
  [700, 46, 90], [770, 34, 150], [840, 52, 110], [910, 30, 170], [975, 44, 120],
  [1040, 34, 160], [1105, 50, 100], [1170, 32, 140], [1230, 44, 80],
];

const FinalComic = ({ urlSiguiente, bloqueado = false }) => {
  const [total, setTotal] = useState(leerTotal);
  const [fase, setFase] = useState("oculto"); // oculto | ventana | cueva
  const [descartado, setDescartado] = useState(false);
  const cuevaRef = useRef(null);
  const redirigido = useRef(false);

  // Revisa el progreso (en la misma pestaña localStorage no avisa, por eso el intervalo)
  useEffect(() => {
    const id = setInterval(() => setTotal(leerTotal()), 500);
    const onStorage = () => setTotal(leerTotal());
    window.addEventListener("storage", onStorage);
    return () => {
      clearInterval(id);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // Al completar los 8 relojes → ventana de logro
  useEffect(() => {
    if (total >= TOTAL_ESCENAS && !bloqueado && !descartado && fase === "oculto") {
      setFase("ventana");
    }
  }, [total, bloqueado, descartado, fase]);

  const irAlSiguiente = () => {
    if (redirigido.current) return;
    redirigido.current = true;
    window.location.href = urlSiguiente;
  };

  // Entrada de la escena de la cueva
  useEffect(() => {
    if (fase !== "cueva") return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(".fc-cueva-fondo", { scale: 1.35, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.6, ease: "power2.out" })
        .fromTo(".fc-luz", { opacity: 0.3 }, { opacity: 1, duration: 1.4 }, 0.4)
        .from(".fc-reloj", { scale: 0, opacity: 0, duration: 0.5, stagger: 0.12, ease: "back.out(2)" }, 1.0)
        .fromTo(".fc-texto", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 1.4)
        .fromTo(".fc-boton", { y: 40, opacity: 0, scale: 0.8 }, { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "back.out(2)" }, 2.2);

      // los relojes flotan suavemente
      gsap.to(".fc-reloj", {
        y: "-=14", duration: 1.6, yoyo: true, repeat: -1, ease: "sine.inOut",
        stagger: { each: 0.2, from: "random" }, delay: 2,
      });
      // la luz del fondo respira
      gsap.to(".fc-luz", { opacity: 0.75, duration: 2.2, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 2 });
      // el botón late
      gsap.to(".fc-boton", { scale: 1.06, duration: 0.8, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 3 });
    }, cuevaRef);
    return () => ctx.revert();
  }, [fase]);

  if (fase === "oculto") return null;

  const boton = {
    fontFamily: fDisplay, fontWeight: 800, fontSize: "1.05rem", color: palette.borde,
    background: palette.amarillo, border: `3.5px solid ${palette.borde}`, borderRadius: "14px",
    boxShadow: `0 4px 0 ${palette.borde}`, padding: "10px 28px", cursor: "pointer",
  };

  // ---------- Ventana "Cómic completado" ----------
  if (fase === "ventana") {
    return (
      <div style={{
        position: "fixed", inset: 0, background: "rgba(58,35,18,0.7)", zIndex: 9000,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          background: palette.crema, border: `5px solid ${palette.morado}`, borderRadius: "28px",
          boxShadow: `0 8px 0 ${palette.borde}`, padding: "32px 48px", textAlign: "center",
          fontFamily: fDisplay, maxWidth: "85%",
        }}>
          <div style={{ fontSize: "3.2rem", lineHeight: 1 }}>🏆</div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: palette.morado, margin: "8px 0 4px" }}>
            ¡Cómic completado!
          </div>
          <div style={{ fontSize: "1.05rem", fontWeight: 700, color: palette.borde, marginBottom: "20px" }}>
            Encontraste los {TOTAL_ESCENAS} relojes escondidos. ¡Una cueva misteriosa se ha abierto!
          </div>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button style={boton} onClick={() => setFase("cueva")}>
              Entrar a la cueva ➜
            </button>
            <button
              style={{ ...boton, background: palette.crema }}
              onClick={() => { setDescartado(true); setFase("oculto"); }}
            >
              Quedarme aquí
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Escena de la cueva ----------
  return (
    <div
      ref={cuevaRef}
      style={{
        position: "fixed", inset: 0, zIndex: 9999, overflow: "hidden",
        background: "#12041f", fontFamily: fDisplay,
      }}
    >
      {/* Fondo: ilustración propia o cueva dibujada.
          Con la imagen, el contenedor es un 4% más grande por cada lado
          para que no se vea ningún borde (el overflow: hidden recorta lo que sobra). */}
      <div
        className="fc-cueva-fondo"
        style={{ position: "absolute", inset: CUEVA_IMG ? "-4%" : 0 }}
      >
        {CUEVA_IMG ? (
          <img
            src={CUEVA_IMG}
            alt="Cueva"
            draggable={false}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <svg viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%", display: "block" }}>
            <defs>
              <radialGradient id="fcLuz" cx="50%" cy="62%" r="55%">
                <stop offset="0%" stopColor="#FFE9A0" />
                <stop offset="35%" stopColor="#FFC300" />
                <stop offset="70%" stopColor="#8B3FD0" />
                <stop offset="100%" stopColor="#2A0A4A" />
              </radialGradient>
              <radialGradient id="fcPiso" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFD86B" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#FFD86B" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="fcRoca" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5b3a22" />
                <stop offset="100%" stopColor="#2b1a0e" />
              </linearGradient>
            </defs>

            {/* cielo de fondo */}
            <rect width="1920" height="1080" fill="#1b0636" />

            {/* interior luminoso de la cueva */}
            <g className="fc-luz">
              <path
                d="M560 1080 C 560 700, 700 330, 960 300 C 1220 330, 1360 700, 1360 1080 Z"
                fill="url(#fcLuz)"
              />
              {/* rayos de luz */}
              <g opacity="0.25" fill="#FFF3C4">
                <polygon points="960,560 880,1080 1040,1080" />
                <polygon points="960,560 760,1080 840,1080" />
                <polygon points="960,560 1080,1080 1160,1080" />
              </g>
            </g>

            {/* estalactitas */}
            <g fill="#3a2312" stroke="#22130a" strokeWidth="4" strokeLinejoin="round">
              {ESTALACTITAS.map(([x, w, h], i) => (
                <polygon key={i} points={`${x},${300 + Math.abs(960 - x) * 0.18 - 10} ${x + w},${300 + Math.abs(960 - x) * 0.18 - 10} ${x + w / 2},${300 + Math.abs(960 - x) * 0.18 + h}`} />
              ))}
            </g>

            {/* roca alrededor de la entrada (con hueco) */}
            <path
              fillRule="evenodd"
              fill="url(#fcRoca)"
              stroke="#22130a"
              strokeWidth="6"
              d="M0 0 H1920 V1080 H0 Z M560 1080 C 560 700, 700 330, 960 300 C 1220 330, 1360 700, 1360 1080 Z"
            />

            {/* textura de la roca */}
            <g fill="#22130a" opacity="0.35">
              <ellipse cx="200" cy="260" rx="120" ry="60" />
              <ellipse cx="420" cy="620" rx="90" ry="140" />
              <ellipse cx="110" cy="860" rx="140" ry="70" />
              <ellipse cx="1560" cy="220" rx="130" ry="70" />
              <ellipse cx="1760" cy="640" rx="100" ry="150" />
              <ellipse cx="1500" cy="900" rx="150" ry="60" />
              <ellipse cx="960" cy="120" rx="260" ry="70" />
            </g>
            <g fill="#7a5233" opacity="0.4">
              <ellipse cx="240" cy="240" rx="70" ry="26" />
              <ellipse cx="1600" cy="200" rx="80" ry="28" />
              <ellipse cx="380" cy="590" rx="40" ry="70" />
              <ellipse cx="1720" cy="610" rx="40" ry="70" />
            </g>

            {/* suelo con brillo de la luz */}
            <ellipse cx="960" cy="1040" rx="520" ry="70" fill="url(#fcPiso)" />
          </svg>
        )}
      </div>

      {/* Relojes flotando frente a la cueva */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {Array.from({ length: TOTAL_ESCENAS }, (_, i) => {
          const ang = Math.PI + (i / (TOTAL_ESCENAS - 1)) * Math.PI; // arco de izquierda a derecha, por arriba
          const x = 50 + Math.cos(ang) * 30;
          const y = 52 + Math.sin(ang) * 30;
          return (
            <span
              key={i}
              className="fc-reloj"
              style={{
                position: "absolute", left: `${x}%`, top: `${y}%`,
                transform: "translate(-50%, -50%)",
                filter: "drop-shadow(0 0 12px rgba(255,195,0,0.95))",
                display: "block", lineHeight: 1,
              }}
            >
              <img
                src={RELOJ_IMG}
                alt="Reloj"
                draggable={false}
                onError={() => console.error("FinalComic: no se encontró la imagen del reloj en", RELOJ_IMG, "→ pon la misma ruta que usa RelojEscondido")}
                style={{ width: "clamp(40px, 6vw, 84px)", height: "auto", display: "block" }}
              />
            </span>
          );
        })}
      </div>

      {/* Texto y botón */}
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: "7%",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 18, padding: "0 20px",
      }}>
        <div className="fc-texto" style={{ textAlign: "center" }}>
          <div style={{
            fontSize: "clamp(1.6rem, 4vw, 2.6rem)", fontWeight: 800, color: palette.amarillo,
            textShadow: `0 4px 0 ${palette.borde}, 0 0 20px rgba(0,0,0,0.6)`,
          }}>
            Los relojes han abierto una cueva…
          </div>
          <div style={{
            fontSize: "clamp(0.95rem, 2vw, 1.2rem)", fontWeight: 700, color: palette.crema,
            textShadow: `0 2px 0 ${palette.borde}`, marginTop: 4,
          }}>
            Algo brilla en su interior. ¿Te atreves a entrar?
          </div>
        </div>

        <button
          className="fc-boton"
          onClick={irAlSiguiente}
          style={{
            ...boton,
            fontSize: "1.25rem", padding: "14px 40px", borderRadius: "18px",
            border: `4px solid ${palette.borde}`, boxShadow: `0 6px 0 ${palette.borde}`,
            background: palette.amarillo,
          }}
        >
          Continuar la historia ➜
        </button>
      </div>
    </div>
  );
};

export default FinalComic;