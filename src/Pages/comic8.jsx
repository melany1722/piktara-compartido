import React, { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";
import gsap from "gsap";
import lottie from "lottie-web";
import "../Comic.css";
import Contador from "../Components/Contador";
import RelojEscondido from "../Components/RelojEscondido";

const fDisplay = "'Baloo 2', 'Comic Sans MS', sans-serif";

const palette = {
  morado: "#5A189A",
  amarillo: "#FFC300",
  crema: "#FFF8E7",
  borde: "#3A2312",
  rosa: "#FF597B",
  fondoEscena: "#E6D9FF",
};

// =====================================================================
//  ESTELA DE JEROGLÍFICOS + RELOJES ESCONDIDOS
//  Archivo que debe estar en la carpeta /public:
//    Recurso_1.png  (la estela)
//
//  Los relojes se dibujan aquí mismo, planos y del mismo color exacto que los
//  jeroglíficos, sin brillo ni relieve. Están en los huecos libres entre jeroglíficos
//  (no tapan ninguno), así que solo se ven si te fijas bien.
//
//  x, y  = centro del reloj en PÍXELES DE LA ESTELA (529 x 1080)
//  size  = tamaño del reloj en esos mismos píxeles (más grande = más fácil de ver)
// =====================================================================
// =====================================================================
//  FONDO: public/ultimofondo.png
//  Las posiciones se dan en PÍXELES DE LA IMAGEN DE FONDO (1923 x 1096), así la estela
//  queda pegada al dibujo sin importar el tamaño de la ventana.
//
//  ESTELA_X    = centro de la estela (en el hueco del medio, sobre las escaleritas)
//  ESTELA_BASE = donde apoya la estela (la parte de arriba del escalón de más arriba)
//  ESTELA_ALTO_IMG = alto de la estela
// =====================================================================
const FONDO_IMG = "/ultimofondo.png";
const IMG_W = 1923;
const IMG_H = 1096;
const ESTELA_X = 978;
const ESTELA_BASE = 916;
const ESTELA_ALTO_IMG = 540;

const ESTELA_IMG = "/Recurso_1.png";
const RELOJ_COLOR = "#472910"; // mismo café que los jeroglíficos
const ESTELA_W = 529;
const ESTELA_H = 1080;
const AREA_CLIC = 56;      // zona donde se puede hacer clic (en píxeles de la estela)

const RELOJES = [
  { id: "r1", x: 389, y: 343, size: 28 },   // fila 1
  { id: "r2", x: 129, y: 392, size: 28 },   // fila 1
  { id: "r3", x: 343, y: 433, size: 28 },   // fila 2
  { id: "r4", x: 244, y: 441, size: 28 },   // fila 2
  { id: "r5", x: 213, y: 518, size: 22 },   // fila 3
  { id: "r6", x: 263, y: 642, size: 28 },   // fila 4
  { id: "r7", x: 256, y: 730, size: 28 },   // fila 5
  { id: "r8", x: 355, y: 845, size: 28 },   // fila 6
  { id: "r9", x: 291, y: 954, size: 28 },   // fila 7
  { id: "r10", x: 112, y: 953, size: 28 },  // fila 7
  { id: "r11", x: 362, y: 984, size: 22 },  // fila 8
  { id: "r12", x: 272, y: 1034, size: 22 }, // fila 8
];

// =====================================================================
//  ANTORCHAS: las dos urnas de los lados (una a cada lado de las escaleritas).
//  La llama siempre se ve quieta y SOLO se anima al hacer clic sobre el fuego.
//  IMPORTANTE: flamaj.json debe estar en public/lottie/flamaj.json
//
//  x, y = punto donde se apoya la base de la llama (píxeles de la imagen de fondo 1923x1096)
//  ancho = ancho de la llama (píxeles de la imagen)
//  Si no calzan con el cuenco de la urna, ajusta estos 3 números por antorcha.
// =====================================================================
const LLAMA_JSON = "/lottie/flamaj.json";
const LLAMA_RECORTE = "66 63 227 335"; // recorte del lienzo original de la llama (x y ancho alto)
const LLAMA_RATIO = 335 / 227;          // alto / ancho de la llama ya recortada
const VECES_POR_CLIC = 3;               // cuántas veces se repite la animación después de cada clic

const ANTORCHAS = [
  // x = centro exacto del cuenco · y = base de la llama (un poco dentro del borde del cuenco)
  // giro = grados de perspectiva: la llama "mira" hacia el centro de la escena (negativo = izquierda, positivo = derecha)
  { x: 498, y: 827, ancho: 70, giro: -14 },  // urna izquierda (cuenco de x 437 a 558, borde en y 826)
  { x: 1428, y: 829, ancho: 70, giro: 14 },  // urna derecha (cuenco de x 1367 a 1488, borde en y 828)
];

// =====================================================================
//  BANDERAS: los dos estandartes azules colgados en el fondo (uno a cada lado).
//  Se mueven SOLO al hacer clic sobre ellos (una vez, y vuelven a quedar quietos).
//  IMPORTANTE, copia estos archivos a la carpeta public:
//    public/lottie-mapa/bandera.json
//    public/lottie-mapa/bandera-images/img_0.png
//
//  cx  = centro horizontal de la bandera (píxeles de la imagen de fondo 1923x1096)
//  bajar = cuánto se separa la varita del borde de arriba de la escena (0 = pegada al borde)
//  ancho = ancho de la bandera (píxeles de la imagen de fondo)
//  Si no calzan con el dibujo, ajusta estos 3 números por bandera.
// =====================================================================
const BANDERA_JSON = "/lottie-mapa/bandera.json";
const BANDERA_IMAGENES = "/lottie-mapa/bandera-images/"; // carpeta donde está img_0.png
const BANDERA_RECORTE = "23 20 235 498";            // recorte del lienzo original (x y ancho alto), con un poquito de margen
const BANDERA_RECORTE_W = 235;
const BANDERA_RECORTE_H = 498;
const BANDERA_CONTENIDO_W = 203;                    // ancho del dibujo dentro del lienzo original
const BANDERA_MARGEN = 16;                          // margen que dejamos alrededor del dibujo en el recorte

const BANDERAS = [
  { cx: 611, bajar: 0, ancho: 200 },   // bandera izquierda
  { cx: 1357, bajar: 0, ancho: 200 },  // bandera derecha
];

// Si algo falla con las llamas, NO se cae la escena ni la navegación
class BarreraErrores extends React.Component {
  constructor(props) {
    super(props);
    this.state = { fallo: false };
  }
  static getDerivedStateFromError() {
    return { fallo: true };
  }
  componentDidCatch(err) {
    console.error("Antorchas:", err);
  }
  render() {
    return this.state.fallo ? null : this.props.children;
  }
}

// El JSON se descarga una sola vez y se reutiliza en todas las antorchas
let llamaPromesa = null;
const cargarLlama = () => {
  if (!llamaPromesa) {
    llamaPromesa = fetch(LLAMA_JSON)
      .then((r) => {
        if (!r.ok) throw new Error(`No se encontró ${LLAMA_JSON}`);
        return r.json();
      })
      .catch((err) => {
        llamaPromesa = null;
        console.error("Llama:", err.message, "→ copia flamaj.json a public/lottie/");
        return null;
      });
  }
  return llamaPromesa;
};

const Llama = ({ left, top, ancho, giro = 0 }) => {
  const [animando, setAnimando] = useState(false);
  const cajaRef = useRef(null);
  const animRef = useRef(null);
  const vueltas = useRef(0);

  // Carga la llama: queda quieta en su primer fotograma hasta que le des clic
  useEffect(() => {
    let cancelado = false;
    cargarLlama().then((data) => {
      if (cancelado || !data || !cajaRef.current) return;
      const anim = lottie.loadAnimation({
        container: cajaRef.current,
        renderer: "svg",
        loop: true,
        autoplay: false,
        animationData: JSON.parse(JSON.stringify(data)),
        rendererSettings: { preserveAspectRatio: "xMidYMax meet", viewBoxSize: LLAMA_RECORTE },
      });
      anim.addEventListener("loopComplete", () => {
        vueltas.current += 1;
        if (vueltas.current >= VECES_POR_CLIC) {
          anim.goToAndStop(0, true); // vuelve a la pose quieta
          setAnimando(false);
        }
      });
      anim.goToAndStop(0, true);
      animRef.current = anim;
    });
    return () => {
      cancelado = true;
      try {
        if (animRef.current) animRef.current.destroy();
      } catch (e) {
        console.warn("Llama: no se pudo destruir la animación", e);
      }
      animRef.current = null;
    };
  }, []);

  // Clic sobre el fuego: reproduce la animación
  const alClic = () => {
    if (!animRef.current) return;
    vueltas.current = 0;
    animRef.current.goToAndPlay(0, true);
    setAnimando(true);
    gsap.fromTo(
      cajaRef.current,
      { scale: 1, transformOrigin: "50% 100%" },
      { scale: 1.18, duration: 0.14, yoyo: true, repeat: 1, ease: "power2.out" }
    );
  };

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: ancho,
        marginLeft: -ancho / 2,
        height: 0,
        zIndex: 20,
      }}
    >
      {/* Resplandor aplastado dentro del cuenco (da la sensación de profundidad) */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          width: ancho * 1.5,
          height: ancho * 0.26,
          transform: "translate(-50%, -55%)",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(255, 190, 60, 0.85) 0%, rgba(255, 150, 0, 0.35) 45%, rgba(255, 150, 0, 0) 72%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: "100%",
          aspectRatio: `1 / ${LLAMA_RATIO}`,
          // perspectiva: la llama se gira un poco hacia el centro de la escena
          transform: `perspective(${ancho * 5}px) rotateY(${giro}deg)`,
          transformOrigin: "50% 100%",
        }}
      >
        {/* Solo el dibujo del fuego recibe el clic (ver .llama-lottie en los estilos) */}
        <div
          ref={cajaRef}
          className="llama-lottie"
          onClick={alClic}
          style={{
            position: "absolute",
            inset: 0,
            transition: "filter 0.3s ease",
            filter: animando
              ? "drop-shadow(0 0 22px rgba(255, 190, 40, 1))"
              : "drop-shadow(0 0 14px rgba(255, 170, 0, 0.85))",
          }}
        />
      </div>
    </div>
  );
};

// El JSON de la bandera también se descarga una sola vez
let banderaPromesa = null;
const cargarBandera = () => {
  if (!banderaPromesa) {
    banderaPromesa = fetch(BANDERA_JSON)
      .then((r) => {
        if (!r.ok) throw new Error(`No se encontró ${BANDERA_JSON}`);
        return r.json();
      })
      .catch((err) => {
        banderaPromesa = null;
        console.error("Bandera:", err.message, "→ copia bandera.json a public/lottie-mapa/");
        return null;
      });
  }
  return banderaPromesa;
};

// left, top, ancho = ya en píxeles de pantalla. Se pone el recorte con margen incluido.
const Bandera = ({ left, top, ancho }) => {
  const cajaRef = useRef(null);
  const animRef = useRef(null);
  const sonando = useRef(false);

  useEffect(() => {
    let cancelado = false;
    cargarBandera().then((data) => {
      if (cancelado || !data || !cajaRef.current) return;

      // Las máscaras de la animación empiezan debajo de la varita, así que la varita
      // (con sus dos perillas) no se dibuja. Se agrega aquí como una capa quieta más,
      // con la misma imagen, para que la bandera quede completa y pegada arriba.
      const datos = JSON.parse(JSON.stringify(data));
      const varita = JSON.parse(JSON.stringify(datos.layers[2])); // capa quieta (sin rotación)
      varita.ind = datos.layers.length + 1;
      varita.nm = "varita";
      varita.masksProperties[0].pt.k.v = [[36, 34], [246, 34], [246, 62], [36, 62]];
      datos.layers.push(varita); // al final = queda detrás de las otras capas

      const anim = lottie.loadAnimation({
        container: cajaRef.current,
        renderer: "svg",
        loop: false,
        autoplay: false,
        animationData: datos,
        assetsPath: BANDERA_IMAGENES,
        rendererSettings: { preserveAspectRatio: "xMidYMid meet", viewBoxSize: BANDERA_RECORTE },
      });
      anim.addEventListener("complete", () => {
        anim.goToAndStop(0, true); // vuelve a quedar quieta
        sonando.current = false;
      });
      anim.goToAndStop(0, true);
      animRef.current = anim;
    });
    return () => {
      cancelado = true;
      try {
        if (animRef.current) animRef.current.destroy();
      } catch (e) {
        console.warn("Bandera: no se pudo destruir la animación", e);
      }
      animRef.current = null;
    };
  }, []);

  // Clic sobre la bandera: se mueve una vez (si ya se está moviendo, no se reinicia)
  const alClic = () => {
    if (!animRef.current || sonando.current) return;
    sonando.current = true;
    animRef.current.goToAndPlay(0, true);
  };

  // el recorte es un poco más grande que el dibujo: se ajusta para que el dibujo mida "ancho"
  const anchoCaja = ancho * (BANDERA_RECORTE_W / BANDERA_CONTENIDO_W);
  const margen = ancho * (BANDERA_MARGEN / BANDERA_CONTENIDO_W);

  return (
    <div
      ref={cajaRef}
      onClick={alClic}
      role="button"
      aria-label="Bandera"
      style={{
        position: "absolute",
        left: left - anchoCaja / 2,
        top: top - margen,
        width: anchoCaja,
        aspectRatio: `${BANDERA_RECORTE_W} / ${BANDERA_RECORTE_H}`,
        cursor: "pointer",
        zIndex: 15,
      }}
    />
  );
};

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
const CLAVE_RELOJ = "relojEscena8";

// Confeti de la ventana final: se genera una sola vez (posición, color, tamaño y velocidad al azar)
const COLORES_CONFETI = [palette.amarillo, palette.rosa, palette.morado, "#3DDC97", "#4CC9F0", palette.crema];
const CONFETI = Array.from({ length: 70 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,                 // % horizontal
  delay: Math.random() * 1.2,                // s
  duracion: 2.4 + Math.random() * 2,         // s
  ancho: 8 + Math.random() * 8,              // px
  alto: 10 + Math.random() * 10,             // px
  color: COLORES_CONFETI[i % COLORES_CONFETI.length],
  redondo: Math.random() > 0.65,
  giro: 360 + Math.random() * 720,           // grados totales
  deriva: (Math.random() - 0.5) * 160,       // px a los lados
}));

const Comic8 = () => {
  const [encontradas, setEncontradas] = useState([]);
  const [cerrarFin, setCerrarFin] = useState(false); // cierra la ventana de "ya los encontraste todos"
  const relojRefs = useRef({});

  // Tamaño real de la escena → escala y desplazamiento del fondo (background-size: cover)
  const escenaRef = useRef(null);
  const [caja, setCaja] = useState(null);
  useEffect(() => {
    const el = escenaRef.current;
    if (!el) return;
    const calc = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      setCaja((prev) => (prev && prev.w === w && prev.h === h ? prev : { w, h }));
    };
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const geo = caja
    ? (() => {
        const sc = Math.max(caja.w / IMG_W, caja.h / IMG_H);
        return { s: sc, ox: (caja.w - IMG_W * sc) / 2, oy: (caja.h - IMG_H * sc) / 2 };
      })()
    : null;
  const estelaAncho = ESTELA_ALTO_IMG * (ESTELA_W / ESTELA_H);

  const total = RELOJES.length;
  const todas = encontradas.length === total;

  // Clic sobre un reloj: salta, se agranda y desaparece
  const alClicReloj = (id) => {
    const el = relojRefs.current[id];
    if (!el || encontradas.includes(id)) return;
    gsap.to(el, {
      scale: 2.4,
      opacity: 0,
      duration: 0.4,
      ease: "power2.out",
      onComplete: () => setEncontradas((prev) => (prev.includes(id) ? prev : [...prev, id])),
    });
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

        .llama-lottie svg { pointer-events: none !important; }
        .llama-lottie svg path { pointer-events: visiblePainted; cursor: pointer; }

        @keyframes ventanaFinEntra {
          0% { transform: scale(0.6); opacity: 0; }
          70% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes confetiCae {
          0% { transform: translate3d(0, 0, 0) rotate(0deg); opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translate3d(var(--deriva), 115vh, 0) rotate(var(--giro)); opacity: 0; }
        }

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
            Aventura 8
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
              backgroundImage: `url('${FONDO_IMG}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* La estela con los relojes escondidos entre los jeroglíficos */}
            {geo && (
              <>
                {/* sombrita en el escalón, debajo de la estela */}
                <div
                  style={{
                    position: "absolute",
                    left: geo.ox + (ESTELA_X - estelaAncho * 0.6) * geo.s,
                    top: geo.oy + (ESTELA_BASE - 9) * geo.s,
                    width: estelaAncho * 1.2 * geo.s,
                    height: 18 * geo.s,
                    borderRadius: "50%",
                    background: "rgba(58, 35, 18, 0.35)",
                    filter: "blur(3px)",
                    zIndex: 9,
                    pointerEvents: "none",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: geo.ox + (ESTELA_X - estelaAncho / 2) * geo.s,
                    top: geo.oy + (ESTELA_BASE - ESTELA_ALTO_IMG) * geo.s,
                    width: estelaAncho * geo.s,
                    height: ESTELA_ALTO_IMG * geo.s,
                    zIndex: 10,
                  }}
                >
                  <img
                    src={ESTELA_IMG}
                    alt="Estela con jeroglíficos"
                    draggable={false}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      display: "block",
                      userSelect: "none",
                      pointerEvents: "none",
                      // la sombra va solo en la estela (no en los relojes, para no darles relieve)
                      filter: "drop-shadow(0 4px 4px rgba(58, 35, 18, 0.35))",
                    }}
                  />

                  {RELOJES.filter((b) => !encontradas.includes(b.id)).map((b) => (
                    <div
                      key={b.id}
                      ref={(el) => (relojRefs.current[b.id] = el)}
                      onClick={() => alClicReloj(b.id)}
                      role="button"
                      aria-label="Reloj escondido"
                      style={{
                        position: "absolute",
                        left: `${(b.x / ESTELA_W) * 100}%`,
                        top: `${(b.y / ESTELA_H) * 100}%`,
                        width: `${(AREA_CLIC / ESTELA_W) * 100}%`,
                        aspectRatio: "1 / 1",
                        transform: "translate(-50%, -50%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "default", // sin manito, para que no delate dónde están
                        zIndex: 10,
                      }}
                    >
                      <div
                        style={{
                          width: `${(b.size / AREA_CLIC) * 100}%`,
                          height: `${(b.size / AREA_CLIC) * 100}%`,
                          borderRadius: "50%",
                          background: RELOJ_COLOR,
                          pointerEvents: "none",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Banderas colgadas en el fondo: clic para que se muevan */}
            <BarreraErrores>
              {geo &&
                BANDERAS.map((b, i) => (
                  <Bandera
                    key={i}
                    left={geo.ox + b.cx * geo.s}
                    top={b.bajar * geo.s}
                    ancho={b.ancho * geo.s}
                  />
                ))}
            </BarreraErrores>

            {/* Urnas a los lados: clic sobre el fuego para encender la llama */}
            <BarreraErrores>
              {geo &&
                ANTORCHAS.map((a, i) => (
                  <Llama
                    key={i}
                    left={geo.ox + a.x * geo.s}
                    top={geo.oy + a.y * geo.s}
                    ancho={a.ancho * geo.s}
                    giro={a.giro}
                  />
                ))}
            </BarreraErrores>

            {/* Reloj escondido: UN clic y se suma al instante (cuenta en el Contador general) */}
            <RelojEscondido clave={CLAVE_RELOJ} left="70%" top="31%" size={30} />

            {/* Mensaje centrado abajo: solo la instrucción */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                bottom: "14px",
                transform: "translateX(-50%)",
                background: palette.crema,
                color: palette.morado,
                fontFamily: fDisplay,
                fontWeight: 800,
                fontSize: "0.9rem",
                padding: "6px 18px",
                borderRadius: "14px",
                border: `3px solid ${palette.borde}`,
                boxShadow: `0 4px 0 ${palette.borde}`,
                zIndex: 55,
                pointerEvents: "none",
                textAlign: "center",
                whiteSpace: "nowrap",
              }}
            >
              🕰️ ¡Hay relojes escondidos en la estela del centro! Encuéntralos
            </div>

            {/* Contador original: abajo a la derecha, como estaba */}
            <div
              style={{
                position: "absolute",
                right: "14px",
                bottom: "14px",
                background: palette.crema,
                color: palette.morado,
                fontFamily: fDisplay,
                fontWeight: 800,
                fontSize: "0.9rem",
                padding: "6px 18px",
                borderRadius: "14px",
                border: `3px solid ${palette.borde}`,
                boxShadow: `0 4px 0 ${palette.borde}`,
                zIndex: 55,
                pointerEvents: "none",
                whiteSpace: "nowrap",
              }}
            >
              {todas
                ? "¡Encontraste todos los relojes!"
                : `Busca los relojes escondidos: ${encontradas.length} / ${total}`}
            </div>

            {/* Sub ventana: aparece cuando se encuentran los 12 relojes de la estela */}
            {todas && !cerrarFin && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(58, 35, 18, 0.55)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 80,
                  overflow: "hidden",
                }}
              >
                {/* Confeti cayendo (no recibe clics) */}
                {CONFETI.map((c) => (
                  <span
                    key={c.id}
                    style={{
                      position: "absolute",
                      top: "-24px",
                      left: `${c.left}%`,
                      width: `${c.ancho}px`,
                      height: `${c.alto}px`,
                      background: c.color,
                      borderRadius: c.redondo ? "50%" : "2px",
                      border: `1.5px solid ${palette.borde}`,
                      pointerEvents: "none",
                      "--giro": `${c.giro}deg`,
                      "--deriva": `${c.deriva}px`,
                      animation: `confetiCae ${c.duracion}s ${c.delay}s ease-in forwards`,
                    }}
                  />
                ))}
                <div
                  style={{
                    background: palette.crema,
                    border: `5px solid ${palette.morado}`,
                    borderRadius: "28px",
                    boxShadow: `0 8px 0 ${palette.borde}`,
                    padding: "28px 44px",
                    textAlign: "center",
                    fontFamily: fDisplay,
                    maxWidth: "80%",
                    animation: "ventanaFinEntra 0.45s ease-out",
                  }}
                >
                  <div style={{ fontSize: "3rem", lineHeight: 1 }}>🕰️</div>
                  <div
                    style={{
                      fontSize: "1.6rem",
                      fontWeight: 800,
                      color: palette.morado,
                      margin: "8px 0 4px",
                    }}
                  >
                    ¡Lo lograste!
                  </div>
                  <div
                    style={{
                      fontSize: "1.05rem",
                      fontWeight: 700,
                      color: palette.borde,
                      marginBottom: "18px",
                    }}
                  >
                    Ya encontraste todos los relojes de la estela.
                  </div>
                  <button
                    onClick={() => setCerrarFin(true)}
                    style={{
                      fontFamily: fDisplay,
                      fontWeight: 800,
                      fontSize: "1rem",
                      color: palette.borde,
                      background: palette.amarillo,
                      border: `3.5px solid ${palette.borde}`,
                      borderRadius: "14px",
                      boxShadow: `0 4px 0 ${palette.borde}`,
                      padding: "8px 28px",
                      cursor: "pointer",
                    }}
                  >
                    ¡Genial!
                  </button>
                </div>
              </div>
            )}

            <Link
              to="/comic/7"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comic8;