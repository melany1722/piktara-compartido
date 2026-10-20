import React, { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";
import lottie from "lottie-web";
import "../Comic.css";
import Contador, { recogerReloj } from "../Components/Contador";

const fDisplay = "'Baloo 2', 'Comic Sans MS', sans-serif";

const palette = {
  morado: "#5A189A",
  amarillo: "#FFC300",
  crema: "#FFF8E7",
  borde: "#3A2312",
  rosa: "#FF597B",
  verde: "#00E676",
  fondoEscena: "#87CEEB", // celeste, igual al cielo del fondo
};

// Cadena de escenas: 1 Comicj · 2 MelanyEstrellas · 3 Comic · 4 comic4 ...
const ESCENA_ANTERIOR = "/comic/1";
const ESCENA_SIGUIENTE = "/comic/3";

// =====================================================================
//  FONDO (animación Lottie de Egipto: nubes, agua, pirámides, columnas)
//  Todo está en public/lottie-fondo2/ (imágenes JUNTO a los JSON)
// =====================================================================
const CARPETA = "/lottie-fondo2/"; // debe terminar en "/"
const FONDO_JSON = CARPETA + "Fondo2.json";

// El JSON del fondo pide img_0.png e img_2.png, pero tus archivos se llaman distinto.
const NOMBRES_IMAGENES = {
  "img_0.png": "img_0 (1).png",
  "img_2.png": "img_2 (3).png",
};

// =====================================================================
//  CICLO DE CAMINADO DE NINOVE
//  JSON + imágenes en public/lottie-fondo2/caminado-ninove/
// =====================================================================
const CARPETA_NINOVE = CARPETA + "caminado-ninove/"; // debe terminar en "/"
const NINOVE_JSON = CARPETA_NINOVE + "Ninove_escena_2.json";

// El JSON pide img_2.png pero tu archivo se llama "img_2 (1).png".
// Si lo renombras a img_2.png, deja esto en {}.
const NOMBRES_NINOVE = {
  "img_2.png": "img_2 (1).png",
};

// Dónde y de qué tamaño se ve Ninove (en % del recuadro de la escena):
//   x, y   = dónde quedan SUS PIES (x: más alto = más a la derecha, y: más alto = más abajo)
//   escala = tamaño (1 = el original del JSON, 0.45 = menos de la mitad)
const NINOVE = { x: 51, y: 91, escala: 0.66 };

// Dónde están los pies de Ninove dentro del JSON original (1920x1080). No lo cambies.
const NINOVE_PIES = { x: 53.2, y: 85.9 };

// MODO AJUSTAR NINOVE: pon true para ARRASTRARLO con el mouse y cambiar su tamaño con la rueda.
// Abajo a la derecha sale un panel con los valores para copiarlos en NINOVE. Luego vuelve a false.
const AJUSTAR_NINOVE = false;

// =====================================================================
//  CICLO DE CAMINADO DE ADAD (delante de Ninove, mismo tamaño)
//  JSON + imágenes en public/lottie-fondo2/caminado-ninove/adad-caminado/
// =====================================================================
const CARPETA_ADAD = CARPETA_NINOVE + "adad-caminado/"; // debe terminar en "/"
const ADAD_JSON = CARPETA_ADAD + "Adad_escena_2.json";

// El JSON de Adad NO es 1920x1080: mide 407x372. Por eso va en una caja propia con esa proporción.
//   x, y   = dónde quedan SUS PIES (en % de la escena)
//   ancho  = ancho de la caja de Adad en % de la escena (23.5 = mismo tamaño visual que Ninove)
//   espejo = true lo voltea (ojo: de fábrica Adad mira a la derecha y Ninove a la izquierda,
//            por eso Adad va a la izquierda y Ninove a la derecha: se miran sin voltear a nadie)
const ADAD = { x: 32, y: 91, ancho: 23.5, espejo: false };

const ADAD_ASPECTO = 407 / 372;          // proporción del JSON de Adad
const ADAD_PIES = { x: 47.4, y: 87 };  // dónde están sus pies dentro de su caja (en %). No lo cambies.

// MODO AJUSTAR ADAD: igual que el de Ninove (arrastrar = mover, rueda = tamaño).
// El panel sale abajo en el centro. Luego vuelve a false.
const AJUSTAR_ADAD = false;

// El Fondo2.json se parte en dos para meter los arbustos EN MEDIO:
//   ATRÁS  = cielo, nubes, agua, pirámides y ciudad
//   FRENTE = Capa 11 (arbustitos del río), Capa 4 (plantas), Capa 3 (columnas), Capa 2 (terraza)
// Estos números son el "ind" de cada capa en el JSON.
const CAPAS_FRENTE = [1, 2, 3, 4];

// =====================================================================
//  ARBUSTOS: cada uno es un Lottie con su PNG. Van entre el fondo y la terraza.
//  Cada uno se anima SOLO cuando le haces clic.
//  Posición y tamaño, en % del recuadro de la escena (son números, sin "%"):
//    left  = distancia desde la izquierda   (más alto = más a la derecha)
//    top   = distancia desde arriba         (más alto = más abajo)
//    width = ancho                          (más alto = más grande; el alto se ajusta solo)
// =====================================================================
const ARBUSTOS = [
  { json: CARPETA + "Arbusto1.json", png: "arbusto1.png", left: 2.5, top: 53, width: 35 },
  { json: CARPETA + "Arbusto2.json", png: "arbusto2.png", left: 5, top: 51, width: 35 }, // ahora entre las columnas
  { json: CARPETA + "Arbusto3.json", png: "arbusto3.png", left: 26, top: 55, width: 37 },
  { json: CARPETA + "Arbusto4.json", png: "arbusto4.png", left: 26, top: 60.5, width: 35 },

];

// MODO AJUSTAR: pon true para ARRASTRAR cada arbusto con el mouse y cambiar su tamaño con la rueda.
// Abajo sale un panel con los valores y un botón para copiarlos. Cuando quede bien, vuelve a false.
const AJUSTAR_ARBUSTOS = false;

const relojImg = "/RELOJ.svg";

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

const navBtnBase = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  width: "52px",
  height: "52px",
  borderRadius: "50%",
  border: `4px solid ${palette.borde}`,
  fontSize: "1.8rem",
  fontFamily: fDisplay,
  fontWeight: 800,
  zIndex: 60,
  boxShadow: `0 5px 0 ${palette.borde}`,
};

// Lee un JSON de Lottie y arregla el nombre de sus imágenes.
// renombrar(asset) devuelve el nombre real del archivo de imagen de ese asset.
// carpeta = carpeta donde están las imágenes (por defecto la del fondo).
const leerJSON = async ({ json, renombrar, nombre, carpeta = CARPETA }) => {
  const r = await fetch(json);
  if (!r.ok) throw new Error(`No se encontró ${json}`);
  const data = await r.json();

  // solo los assets que son imágenes (tienen "p"); los demás se dejan igual
  (data.assets || []).forEach((a) => {
    if (!a.p) return;
    a.u = "";
    a.p = encodeURIComponent(renombrar(a));
  });

  // avisa si falta alguna imagen
  (data.assets || []).forEach((a) => {
    if (!a.p) return;
    const img = new Image();
    img.onerror = () => console.warn(`${nombre}: falta la imagen ${carpeta}${a.p}`);
    img.src = carpeta + a.p;
  });

  return data;
};

// Crea la animación dentro de un contenedor
const crearAnim = (data, contenedor, { carpeta = CARPETA, loop = false } = {}) =>
  lottie.loadAnimation({
    container: contenedor,
    renderer: "svg",
    loop,
    autoplay: false,
    animationData: data,
    assetsPath: carpeta,
    // "slice" hace que llene TODO el recuadro
    rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
  });

const MelanyEstrellas = () => {
  const escenaRef = useRef(null);       // el recuadro de la escena (para medir el arrastre)
  const fondoAtrasRef = useRef(null);   // cielo, agua, pirámides, ciudad
  const fondoFrenteRef = useRef(null);  // terraza, columnas, plantas
  const ninoveRef = useRef(null);       // contenedor del ciclo de caminado de Ninove
  const arbustoRefs = useRef([]);       // un contenedor por arbusto
  const animRef = useRef(null);         // animación del fondo de atrás (controla el "complete")
  const ninoveAnimRef = useRef(null);   // animación de Ninove caminando
  const ninoveCorriendoRef = useRef(false); // true mientras Ninove está caminando
  const ninoveArrastreRef = useRef(null);
  const adadRef = useRef(null);         // contenedor del caminado de Adad
  const adadAnimRef = useRef(null);     // animación de Adad
  const adadCorriendoRef = useRef(false); // true mientras Adad está caminando
  const adadArrastreRef = useRef(null);
  const fondoAnimsRef = useRef([]);     // animaciones del fondo (atrás y frente)
  const arbustosAnimRef = useRef([]);   // una animación por arbusto
  const arbustoCorriendoRef = useRef([]); // true mientras un arbusto se está animando
  const arrastreRef = useRef(null);

  const [relojEncontrado, setRelojEncontrado] = useState(() => localStorage.getItem("relojMelany") === "true");
  const [lista, setLista] = useState(false);          // el fondo cargó bien
  const [reproducido, setReproducido] = useState(false);
  const [ninove, setNinove] = useState(NINOVE);
  const [adad, setAdad] = useState(ADAD);
  const [pos, setPos] = useState(() =>
    ARBUSTOS.map((a) => ({ left: a.left, top: a.top, width: a.width }))
  );

  // Carga segura: si falta un JSON o una imagen, la escena no se rompe, solo avisa en consola
  useEffect(() => {
    let cancelado = false;
    const todas = [];

    // Fondo principal, partido en dos mitades (atrás / frente)
    leerJSON({
      json: FONDO_JSON,
      nombre: "Fondo",
      renombrar: (a) => NOMBRES_IMAGENES[a.p] || a.p,
    })
      .then((data) => {
        if (cancelado || !fondoAtrasRef.current || !fondoFrenteRef.current) return;

        const atras = JSON.parse(JSON.stringify(data));
        const frente = JSON.parse(JSON.stringify(data));
        atras.layers = data.layers.filter((l) => !CAPAS_FRENTE.includes(l.ind));
        frente.layers = data.layers.filter((l) => CAPAS_FRENTE.includes(l.ind));

        const animAtras = crearAnim(atras, fondoAtrasRef.current);
        const animFrente = crearAnim(frente, fondoFrenteRef.current);
        todas.push(animAtras, animFrente);

        animAtras.addEventListener("complete", () => {
          setReproducido(false);
        });

        animAtras.goToAndStop(0, true);
        animFrente.goToAndStop(0, true);
        animRef.current = animAtras;
        fondoAnimsRef.current.push(animAtras, animFrente);
        setLista(true);
      })
      .catch((err) => {
        console.warn("Escena 2:", err.message, "→ copia Fondo2.json a public/lottie-fondo2/");
      });

    // Ciclo de caminado de Ninove (solo se reproduce al hacerle clic)
    leerJSON({
      json: NINOVE_JSON,
      nombre: "Ninove",
      carpeta: CARPETA_NINOVE,
      renombrar: (a) => NOMBRES_NINOVE[a.p] || a.p,
    })
      .then((data) => {
        if (cancelado || !ninoveRef.current) return;
        const anim = crearAnim(data, ninoveRef.current, { carpeta: CARPETA_NINOVE, loop: false });
        todas.push(anim);
        anim.addEventListener("complete", () => {
          ninoveCorriendoRef.current = false;
          // vuelve a la primera pose (se hace un instante después: si no, lottie se queda
          // en un fotograma vacío y el personaje desaparece)
          setTimeout(() => anim.goToAndStop(0, true), 0);
        });
        anim.goToAndStop(0, true);
        ninoveAnimRef.current = anim;
      })
      .catch((err) => {
        console.warn("Ninove:", err.message, "→ revisa public/lottie-fondo2/caminado-ninove/");
      });

    // Ciclo de caminado de Adad (solo se reproduce al hacerle clic)
    leerJSON({
      json: ADAD_JSON,
      nombre: "Adad",
      carpeta: CARPETA_ADAD,
      renombrar: (a) => a.p,
    })
      .then((data) => {
        if (cancelado || !adadRef.current) return;
        // El JSON de Adad dura 600 fotogramas pero su dibujo termina en el 221: se recorta la cola vacía
        data.op = Math.max(...data.layers.map((l) => l.op));
        const anim = crearAnim(data, adadRef.current, { carpeta: CARPETA_ADAD, loop: false });
        todas.push(anim);
        anim.addEventListener("complete", () => {
          adadCorriendoRef.current = false;
          setTimeout(() => anim.goToAndStop(0, true), 0); // vuelve a la primera pose
        });
        anim.goToAndStop(0, true);
        adadAnimRef.current = anim;
      })
      .catch((err) => {
        console.warn("Adad:", err.message, "→ revisa public/lottie-fondo2/caminado-ninove/adad-caminado/");
      });

    // Arbustos (cada uno independiente: si uno falla, los demás siguen)
    ARBUSTOS.forEach((arbusto, i) => {
      const contenedor = arbustoRefs.current[i];
      if (!contenedor) return;
      const nombre = `Arbusto${i + 1}`;

      leerJSON({
        json: arbusto.json,
        nombre,
        // cada arbusto tiene una sola imagen: se usa su PNG real
        renombrar: () => arbusto.png,
      })
        .then((data) => {
          if (cancelado) return;
          const anim = crearAnim(data, contenedor);
          todas.push(anim);
          anim.addEventListener("complete", () => {
            arbustoCorriendoRef.current[i] = false;
          });
          anim.goToAndStop(0, true);
          arbustosAnimRef.current[i] = anim;
        })
        .catch((err) => {
          console.warn(`${nombre}:`, err.message);
        });
    });

    return () => {
      cancelado = true;
      todas.forEach((a) => a.destroy());
      animRef.current = null;
      ninoveAnimRef.current = null;
      ninoveCorriendoRef.current = false;
      adadAnimRef.current = null;
      adadCorriendoRef.current = false;
      fondoAnimsRef.current = [];
      arbustosAnimRef.current = [];
      arbustoCorriendoRef.current = [];
    };
  }, []);

  // Botón Reproducir: solo mueve el FONDO (ni los arbustos ni Ninove)
  const handlePlayClick = () => {
    if (!animRef.current) return;
    fondoAnimsRef.current.forEach((a) => a.goToAndPlay(0, true));
    setReproducido(true);
  };

  // Clic en Ninove: camina una vez y vuelve a su pose inicial
  const clicNinove = () => {
    if (AJUSTAR_NINOVE) return;
    const anim = ninoveAnimRef.current;
    if (!anim || ninoveCorriendoRef.current) return;
    ninoveCorriendoRef.current = true;
    anim.goToAndPlay(0, true);
  };

  // ---- Modo ajustar Ninove: arrastrar (mueve sus pies) y rueda (tamaño) ----
  const iniciarArrastreNinove = (e) => {
    if (!AJUSTAR_NINOVE) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    ninoveArrastreRef.current = { cx: e.clientX, cy: e.clientY, x: ninove.x, y: ninove.y };
  };

  const moverArrastreNinove = (e) => {
    const d = ninoveArrastreRef.current;
    if (!d || !escenaRef.current) return;
    const r = escenaRef.current.getBoundingClientRect();
    const dx = ((e.clientX - d.cx) / r.width) * 100;
    const dy = ((e.clientY - d.cy) / r.height) * 100;
    setNinove((n) => ({ ...n, x: +(d.x + dx).toFixed(1), y: +(d.y + dy).toFixed(1) }));
  };

  const soltarArrastreNinove = () => {
    ninoveArrastreRef.current = null;
  };

  const cambiarEscalaNinove = (e) => {
    if (!AJUSTAR_NINOVE) return;
    const paso = e.deltaY < 0 ? 0.02 : -0.02;
    setNinove((n) => ({ ...n, escala: +Math.max(0.1, n.escala + paso).toFixed(2) }));
  };

  const textoNinove = `const NINOVE = { x: ${ninove.x}, y: ${ninove.y}, escala: ${ninove.escala} };`;

  const copiarNinove = () => {
    console.log(textoNinove);
    if (navigator.clipboard) navigator.clipboard.writeText(textoNinove).catch(() => {});
  };

  // Clic en Adad: camina una vez y vuelve a su pose inicial
  const clicAdad = () => {
    if (AJUSTAR_ADAD) return;
    const anim = adadAnimRef.current;
    if (!anim || adadCorriendoRef.current) return;
    adadCorriendoRef.current = true;
    anim.goToAndPlay(0, true);
  };

  // ---- Modo ajustar Adad ----
  const iniciarArrastreAdad = (e) => {
    if (!AJUSTAR_ADAD) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    adadArrastreRef.current = { cx: e.clientX, cy: e.clientY, x: adad.x, y: adad.y };
  };

  const moverArrastreAdad = (e) => {
    const d = adadArrastreRef.current;
    if (!d || !escenaRef.current) return;
    const r = escenaRef.current.getBoundingClientRect();
    const dx = ((e.clientX - d.cx) / r.width) * 100;
    const dy = ((e.clientY - d.cy) / r.height) * 100;
    setAdad((n) => ({ ...n, x: +(d.x + dx).toFixed(1), y: +(d.y + dy).toFixed(1) }));
  };

  const soltarArrastreAdad = () => {
    adadArrastreRef.current = null;
  };

  const cambiarEscalaAdad = (e) => {
    if (!AJUSTAR_ADAD) return;
    const paso = e.deltaY < 0 ? 0.02 : -0.02;
    setAdad((n) => ({ ...n, ancho: +Math.max(5, n.ancho + paso * 25).toFixed(1) }));
  };

  const textoAdad = `const ADAD = { x: ${adad.x}, y: ${adad.y}, ancho: ${adad.ancho}, espejo: ${adad.espejo} };`;

  const copiarAdad = () => {
    console.log(textoAdad);
    if (navigator.clipboard) navigator.clipboard.writeText(textoAdad).catch(() => {});
  };

  // Clic en un arbusto: solo se anima ESE arbusto
  const clicArbusto = (i) => {
    if (AJUSTAR_ARBUSTOS) return;
    const anim = arbustosAnimRef.current[i];
    if (!anim || arbustoCorriendoRef.current[i]) return;
    arbustoCorriendoRef.current[i] = true;
    anim.goToAndPlay(0, true);
  };

  // ---- Modo ajustar: arrastrar y cambiar tamaño ----
  const iniciarArrastre = (e, i) => {
    if (!AJUSTAR_ARBUSTOS) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    arrastreRef.current = { i, x: e.clientX, y: e.clientY, left: pos[i].left, top: pos[i].top };
  };

  const moverArrastre = (e) => {
    const d = arrastreRef.current;
    if (!d || !escenaRef.current) return;
    const r = escenaRef.current.getBoundingClientRect();
    const dx = ((e.clientX - d.x) / r.width) * 100;
    const dy = ((e.clientY - d.y) / r.height) * 100;
    setPos((p) =>
      p.map((q, k) =>
        k === d.i
          ? { ...q, left: +(d.left + dx).toFixed(1), top: +(d.top + dy).toFixed(1) }
          : q
      )
    );
  };

  const soltarArrastre = () => {
    arrastreRef.current = null;
  };

  const cambiarAncho = (e, i) => {
    if (!AJUSTAR_ARBUSTOS) return;
    const paso = e.deltaY < 0 ? 0.5 : -0.5;
    setPos((p) =>
      p.map((q, k) => (k === i ? { ...q, width: +Math.max(3, q.width + paso).toFixed(1) } : q))
    );
  };

  const textoValores = ARBUSTOS.map(
    (a, i) => `Arbusto${i + 1}: left: ${pos[i].left}, top: ${pos[i].top}, width: ${pos[i].width}`
  ).join("\n");

  const copiarValores = () => {
    console.log(textoValores);
    if (navigator.clipboard) navigator.clipboard.writeText(textoValores).catch(() => {});
  };

  const handleRelojClick = (e) => {
    e.stopPropagation();
    if (relojEncontrado) return;
    setRelojEncontrado(true);
    // el reloj vuela al contador y suma 1 punto (solo la primera vez)
    recogerReloj("relojMelany", e.currentTarget);
  };

  // capa de fondo: llena todo el recuadro
  const capaLottie = (z) => ({
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    zIndex: z,
    pointerEvents: "none",
  });

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

        @keyframes scorePop {
          0% { transform: scale(1); }
          40% { transform: scale(1.35) rotate(6deg); }
          70% { transform: scale(0.9) rotate(-4deg); }
          100% { transform: scale(1); }
        }
        @keyframes wiggleSticker {
          0%, 100% { transform: translate(-50%, -50%) rotate(-18deg) scale(1); }
          50% { transform: translate(-50%, -50%) rotate(-10deg) scale(1.08); }
        }
        @keyframes playBounce {
          0%, 100% { transform: translate(-50%, -50%) scale(1); box-shadow: 0 8px 0 ${palette.borde}; }
          50% { transform: translate(-50%, -54%) scale(1.08); box-shadow: 0 14px 0 ${palette.borde}; }
        }

        /* el fondo (y Ninove) llenan todo el recuadro de la escena */
        .capa-lottie svg { width: 100% !important; height: 100% !important; display: block; }

        /* solo las imágenes de Ninove reciben el clic (el resto de la capa deja pasar el mouse) */
        .ninove-lottie svg image { pointer-events: auto; cursor: pointer; }

        /* los arbustos mantienen su forma: el ancho lo da el contenedor y el alto se ajusta solo */
        .arbusto-lottie svg { width: 100% !important; height: auto !important; display: block; }

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
            style={{
              height: "55px",
              filter: `drop-shadow(0 3px 0 ${palette.borde})`,
            }}
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
            Aventura 2
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
            {/* 1) Fondo de ATRÁS: cielo, nubes, agua, pirámides, ciudad */}
            <div ref={fondoAtrasRef} className="capa-lottie" style={capaLottie(1)} />

            {/* 2) Arbustos: delante de la ciudad, pero detrás de la terraza y las columnas.
                   Cada uno se anima solo al hacerle clic. */}
            {ARBUSTOS.map((_, i) => (
              <div
                key={i}
                ref={(el) => (arbustoRefs.current[i] = el)}
                className="arbusto-lottie"
                onClick={() => clicArbusto(i)}
                onPointerDown={(e) => iniciarArrastre(e, i)}
                onPointerMove={moverArrastre}
                onPointerUp={soltarArrastre}
                onWheel={(e) => cambiarAncho(e, i)}
                style={{
                  position: "absolute",
                  left: `${pos[i].left}%`,
                  top: `${pos[i].top}%`,
                  width: `${pos[i].width}%`,
                  zIndex: 2 + i,
                  cursor: AJUSTAR_ARBUSTOS ? "move" : "pointer",
                  outline: AJUSTAR_ARBUSTOS ? "2px dashed #ff00aa" : "none",
                  touchAction: "none",
                }}
              />
            ))}

            {/* 3) Fondo de FRENTE: terraza, columnas, plantas, arbustitos del río */}
            <div ref={fondoFrenteRef} className="capa-lottie" style={capaLottie(2 + ARBUSTOS.length)} />

            {/* 4) Ninove (camina al hacerle clic; mismo encuadre 1920x1080 que el fondo).
                   Está DELANTE de todo. Si lo quieres detrás de la terraza y las columnas,
                   cambia el z-index a capaLottie(1 + ARBUSTOS.length). */}
            <div
              ref={ninoveRef}
              className="capa-lottie ninove-lottie"
              onClick={clicNinove}
              onPointerDown={iniciarArrastreNinove}
              onPointerMove={moverArrastreNinove}
              onPointerUp={soltarArrastreNinove}
              onWheel={cambiarEscalaNinove}
              style={{
                ...capaLottie(3 + ARBUSTOS.length),
                transformOrigin: `${NINOVE_PIES.x}% ${NINOVE_PIES.y}%`,
                transform: `translate(${ninove.x - NINOVE_PIES.x}%, ${ninove.y - NINOVE_PIES.y}%) scale(${ninove.escala})`,
                touchAction: "none",
              }}
            />

            {/* 5) Adad (camina al hacerle clic; delante de Ninove, en su propia caja 407x372) */}
            <div
              ref={adadRef}
              className="capa-lottie ninove-lottie"
              onClick={clicAdad}
              onPointerDown={iniciarArrastreAdad}
              onPointerMove={moverArrastreAdad}
              onPointerUp={soltarArrastreAdad}
              onWheel={cambiarEscalaAdad}
              style={{
                position: "absolute",
                left: `${adad.x}%`,
                top: `${adad.y}%`,
                width: `${adad.ancho}%`,
                aspectRatio: `${ADAD_ASPECTO}`,
                zIndex: 4 + ARBUSTOS.length,
                pointerEvents: "none",
                transformOrigin: `${ADAD_PIES.x}% ${ADAD_PIES.y}%`,
                transform: `translate(-${ADAD_PIES.x}%, -${ADAD_PIES.y}%) scaleX(${adad.espejo ? -1 : 1})`,
                touchAction: "none",
              }}
            />

            {/* Panel del modo ajustar Adad */}
            {AJUSTAR_ADAD && (
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
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
                  Arrastra a Adad = mover · Rueda = tamaño
                </div>
                <pre style={{ margin: 0 }}>{textoAdad}</pre>
                <button
                  onClick={copiarAdad}
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

            {/* Panel del modo ajustar Ninove */}
            {AJUSTAR_NINOVE && (
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
                  Arrastra a Ninove = mover · Rueda = tamaño
                </div>
                <pre style={{ margin: 0 }}>{textoNinove}</pre>
                <button
                  onClick={copiarNinove}
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

            {/* Panel del modo ajustar */}
            {AJUSTAR_ARBUSTOS && (
              <div
                style={{
                  position: "absolute",
                  left: "12px",
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
                <pre style={{ margin: 0 }}>{textoValores}</pre>
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

            {lista && !reproducido && (
              <div
                onClick={handlePlayClick}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  padding: "16px 36px",
                  borderRadius: "50px",
                  background: palette.amarillo,
                  border: `4px solid ${palette.borde}`,
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  fontFamily: fDisplay,
                  fontSize: "1.3rem",
                  fontWeight: 800,
                  color: palette.borde,
                  cursor: "pointer",
                  zIndex: 20,
                  animation: "playBounce 1.8s ease-in-out infinite",
                  boxShadow: `0 8px 0 ${palette.borde}`,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
                role="button"
              >
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderTop: "9px solid transparent",
                    borderBottom: "9px solid transparent",
                    borderLeft: `15px solid ${palette.borde}`,
                  }}
                />
                Reproducir
              </div>
            )}

            {!relojEncontrado && (
              <img
                src={relojImg}
                alt=""
                onClick={handleRelojClick}
                style={{
                  position: "absolute",
                  left: "22%",
                  top: "25%",
                  transform: "translate(-50%, -50%) rotate(-18deg)",
                  width: "24px",
                  height: "24px",
                  objectFit: "contain",
                  opacity: 1,
                  cursor: "pointer",
                  zIndex: 100,
                  pointerEvents: "auto",
                  filter: `drop-shadow(0 0 8px ${palette.amarillo})`,
                  animation: "wiggleSticker 1.6s ease-in-out infinite",
                  background: palette.crema,
                  padding: "4px",
                  borderRadius: "50%",
                  border: `2px dashed ${palette.borde}`,
                }}
              />
            )}

            <Link
              to={ESCENA_ANTERIOR}
              className="comic-nav-btn d-flex align-items-center justify-content-center text-decoration-none"
              style={{
                ...navBtnBase,
                left: "14px",
                background: palette.amarillo,
                color: palette.borde,
              }}
            >
              &lt;
            </Link>

            <Link
              to={ESCENA_SIGUIENTE}
              className="comic-nav-btn d-flex align-items-center justify-content-center text-decoration-none"
              style={{
                ...navBtnBase,
                right: "14px",
                background: palette.rosa,
                color: "#fff",
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

export default MelanyEstrellas;