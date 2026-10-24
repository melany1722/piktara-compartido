import React, { useEffect, useRef, useState } from "react";

// =====================================================================
//  AUDIO DE ESCENA (sirve para las 8 escenas)
//
//  Uso en cada escena:  <AudioEscena escena={1} />
//
//  - La lista de abajo dice qué audio tiene cada escena.
//  - Si una escena no tiene audio (null), no hace nada y no muestra nada.
//    Cuando tengas el audio, solo pon su nombre aquí.
//  - El audio suena UNA sola vez (no se repite solo).
//  - Botón grande: reproduce, pausa y repite. La barra muestra el avance
//    y se puede tocar para saltar a otro punto.
//  - Barra de volumen: el nivel se recuerda al cambiar de escena y al recargar.
//  - Se detiene solo al salir de la escena.
//  - El estilo es el mismo del cómic: bordes gruesos, pegatina washi, botones que se hunden.
// =====================================================================
const CARPETA_AUDIOS = "/audios/";

const AUDIOS = {
  1: "Escena1.mp3",
  2: "escena2.mp3",
  3: "Escena3.mp3",
  4: null, // cuando tengas el audio: "Escena4.mp3"
  5: null,
  6: null,
  7: null,
  8: null,
};

const VOLUMEN_INICIAL = 0.8; // 0 a 1 (la primera vez que se entra)
const CLAVE_VOLUMEN = "piktaraVolumen";

const palette = {
  morado: "#5A189A",
  amarillo: "#FFC300",
  crema: "#FFF8E7",
  borde: "#3A2312",
  rosa: "#FF597B",
  verde: "#2FBF71",
};
const fDisplay = "'Baloo 2', 'Comic Sans MS', sans-serif";

// Lee el volumen guardado (si el navegador no deja guardar, usa el inicial)
const leerVolumen = () => {
  try {
    const v = parseFloat(localStorage.getItem(CLAVE_VOLUMEN));
    if (!isNaN(v) && v >= 0 && v <= 1) return v;
  } catch (e) {
    /* sin almacenamiento: no pasa nada */
  }
  return VOLUMEN_INICIAL;
};

// Iconos del botón grande, dibujados con formas simples
const IconoBoton = ({ tipo }) => {
  const base = { width: 18, height: 18, viewBox: "0 0 24 24", "aria-hidden": "true", style: { display: "block" } };
  if (tipo === "pausa")
    return (
      <svg {...base} fill={palette.borde}>
        <rect x="5" y="4" width="5" height="16" rx="1.5" />
        <rect x="14" y="4" width="5" height="16" rx="1.5" />
      </svg>
    );
  if (tipo === "repetir")
    return (
      <svg {...base} fill="none" stroke={palette.borde} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 12a8 8 0 1 1-2.5-5.8" />
        <path d="M20 3v5h-5" />
      </svg>
    );
  return (
    <svg {...base} fill={palette.borde}>
      <path d="M8 4.5l12 7.5-12 7.5z" strokeLinejoin="round" stroke={palette.borde} strokeWidth="2" />
    </svg>
  );
};

const IconoVolumen = ({ nivel }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke={palette.borde}
    strokeWidth="2.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={{ display: "block", flexShrink: 0 }}
  >
    <path d="M4 9v6h4l5 4V5L8 9z" fill={palette.borde} />
    {nivel === 0 && <path d="M17 9l5 6M22 9l-5 6" />}
    {nivel > 0 && <path d="M16.5 9.5a4 4 0 0 1 0 5" />}
    {nivel >= 0.5 && <path d="M19 6.5a8 8 0 0 1 0 11" />}
  </svg>
);

const AudioEscena = ({ escena }) => {
  const archivo = AUDIOS[escena];
  const audioRef = useRef(null);
  // "listo" (aún no suena) | "sonando" | "pausa" | "terminado"
  const [estado, setEstado] = useState("listo");
  const [volumen, setVolumen] = useState(leerVolumen);
  const [avance, setAvance] = useState(0); // 0 a 1

  useEffect(() => {
    if (!archivo) return; // esta escena todavía no tiene audio

    const audio = new Audio(CARPETA_AUDIOS + archivo);
    audio.loop = false; // suena una sola vez
    audio.volume = leerVolumen();
    audio.preload = "auto";
    audio.addEventListener("play", () => setEstado("sonando"));
    audio.addEventListener("pause", () => {
      if (!audio.ended) setEstado("pausa");
    });
    audio.addEventListener("ended", () => {
      setEstado("terminado");
      setAvance(1);
    });
    audio.addEventListener("timeupdate", () => {
      if (audio.duration && isFinite(audio.duration)) setAvance(audio.currentTime / audio.duration);
    });
    audioRef.current = audio;
    setEstado("listo");
    setAvance(0);

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [archivo]);

  if (!archivo) return null;

  // Un solo botón: reproduce, pausa o repite según el momento
  const alClic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (estado === "sonando") {
      audio.pause();
      return;
    }
    if (estado === "terminado") audio.currentTime = 0; // empieza de nuevo
    audio
      .play()
      .catch((err) => console.warn("Audio:", err.message, "→ revisa public/audios/" + archivo));
  };

  // Tocar la barra de avance salta a ese punto
  const saltar = (e) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration || !isFinite(audio.duration)) return;
    const r = e.currentTarget.getBoundingClientRect();
    const f = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    audio.currentTime = f * audio.duration;
    setAvance(f);
  };

  const cambiarVolumen = (e) => {
    const v = parseFloat(e.target.value);
    setVolumen(v);
    if (audioRef.current) audioRef.current.volume = v;
    try {
      localStorage.setItem(CLAVE_VOLUMEN, String(v));
    } catch (err) {
      /* sin almacenamiento: no pasa nada */
    }
  };

  const tipoIcono = { listo: "play", sonando: "pausa", pausa: "play", terminado: "repetir" }[estado];
  const colorBoton = { listo: palette.verde, sonando: palette.rosa, pausa: palette.verde, terminado: palette.amarillo }[estado];
  const aviso = {
    listo: "Toca para escuchar",
    sonando: "Escuchando...",
    pausa: "En pausa",
    terminado: "Toca para repetir",
  }[estado];
  const etiquetaBoton = { listo: "Escuchar", sonando: "Pausar", pausa: "Seguir", terminado: "Repetir" }[estado];

  const frenar = (e) => e.stopPropagation(); // los clics aquí no llegan al resto de la escena
  const pctVol = Math.round(volumen * 100);

  return (
    <div
      onClick={frenar}
      onPointerDown={frenar}
      className="audio-panel"
      style={{
        position: "absolute",
        top: "14px",
        right: "14px",
        zIndex: 70,
        display: "flex",
        alignItems: "center",
        gap: "9px",
        padding: "8px 12px 9px 8px",
        background: palette.crema,
        border: `3.5px solid ${palette.borde}`,
        borderRadius: "16px",
        boxShadow: `0 5px 0 ${palette.borde}`,
        transform: "rotate(1.2deg)",
        transformOrigin: "right top",
        fontFamily: fDisplay,
      }}
    >
      <style>{`
        .audio-btn {
          transition: transform 0.12s ease, box-shadow 0.12s ease;
        }
        .audio-btn:hover { transform: translateY(-2px); }
        .audio-btn:active {
          transform: translateY(4px);
          box-shadow: 0 1px 0 ${palette.borde} !important;
        }

        .audio-vol {
          -webkit-appearance: none;
          appearance: none;
          height: 10px;
          width: 100%;
          border-radius: 7px;
          border: 2.5px solid ${palette.borde};
          outline: none;
          cursor: pointer;
          margin: 0;
        }
        .audio-vol::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: ${palette.amarillo};
          border: 2.5px solid ${palette.borde};
          box-shadow: 0 2px 0 ${palette.borde};
          cursor: grab;
        }
        .audio-vol::-moz-range-thumb {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: ${palette.amarillo};
          border: 2.5px solid ${palette.borde};
          box-shadow: 0 2px 0 ${palette.borde};
          cursor: grab;
        }
        .audio-vol::-moz-range-track { background: transparent; }
      `}</style>

      {/* Cinta washi pegada en la esquina, como en el marco de la escena */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-10px",
          right: "-12px",
          width: "40px",
          height: "16px",
          background: palette.amarillo,
          border: `2.5px solid ${palette.borde}`,
          borderRadius: "4px",
          transform: "rotate(24deg)",
          boxShadow: `0 2px 0 ${palette.borde}`,
        }}
      />

      {/* Botón grande */}
      <button
        onClick={alClic}
        aria-label={etiquetaBoton}
        title={etiquetaBoton}
        className="audio-btn"
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          border: `3.5px solid ${palette.borde}`,
          background: colorBoton,
          boxShadow: `0 4px 0 ${palette.borde}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          padding: 0,
          flexShrink: 0,
        }}
      >
        <IconoBoton tipo={tipoIcono} />
      </button>

      <div style={{ width: "128px", display: "flex", flexDirection: "column", gap: "4px" }}>
        {/* Título y estado */}
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.05 }}>
          <span
            style={{
              fontWeight: 800,
              fontSize: "0.8rem",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: palette.morado,
            }}
          >
            Narración
          </span>
          <span style={{ fontWeight: 700, fontSize: "0.66rem", color: palette.borde }}>{aviso}</span>
        </div>

        {/* Avance (se puede tocar para saltar) */}
        <div
          onClick={saltar}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(avance * 100)}
          style={{
            height: "10px",
            borderRadius: "7px",
            border: `2.5px solid ${palette.borde}`,
            background: palette.crema,
            overflow: "hidden",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: `${avance * 100}%`,
              height: "100%",
              background: palette.rosa,
              transition: "width 0.2s linear",
            }}
          />
        </div>

        {/* Volumen */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <IconoVolumen nivel={volumen} />
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volumen}
            onChange={cambiarVolumen}
            aria-label="Volumen"
            className="audio-vol"
            style={{
              background: `linear-gradient(90deg, ${palette.amarillo} ${pctVol}%, ${palette.crema} ${pctVol}%)`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AudioEscena;