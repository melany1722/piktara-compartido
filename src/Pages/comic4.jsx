import React, { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import lottie from "lottie-web";
import "../Comic.css";

gsap.registerPlugin(Draggable);

const fDisplay = "'Baloo 2', 'Comic Sans MS', sans-serif";

const palette = {
  morado: "#5A189A",
  amarillo: "#FFC300",
  crema: "#FFF8E7",
  borde: "#3A2312",
  rosa: "#FF597B",
};

// =====================================================================
//  ESCENA 4
//  Archivos que deben estar en la carpeta /public:
//    otro-fondo (1).jpg · jarron-verde-1.svg · jarron-verde-2.svg · jarron-naranja.svg
// =====================================================================
const ESCENA_IMG = "/otro-fondo (1).jpg";
const ESCENA_ANTERIOR = "/comic/3";
const ESCENA_SIGUIENTE = "/comic/5";

// Las posiciones se dan en PÍXELES DE LA IMAGEN (1920 x 1080), así los jarrones
// quedan pegados al dibujo sin importar el tamaño de la ventana.
const IMG_W = 1920;
const IMG_H = 1080;

// x = centro del objeto · base = donde apoya en el piso · alto = altura del objeto
// (incluye los 3 jarrones y el cofre; todos se arrastran igual)
const JARRONES = [
  { id: "verde1", src: "/jarron-verde-1.svg", ratio: 281.45 / 379.37, x: 330, base: 1030, alto: 300 },
  { id: "verde2", src: "/jarron-verde-2.svg", ratio: 131.34 / 163.33, x: 955, base: 1055, alto: 180 },
  { id: "naranja", src: "/jarron-naranja.svg", ratio: 197.09 / 314.78, x: 1560, base: 1030, alto: 330 },
  { id: "cofre", src: "/cofre.svg", ratio: 237 / 186.92, x: 1200, base: 1045, alto: 140 },
];

// El reloj está escondido DENTRO de este jarrón: "verde1", "verde2" o "naranja".
// Sale al tocar el jarrón o al sacudirlo (arrastrarlo de lado a lado).
const JARRON_CON_RELOJ = "naranja";
const SACUDIDA_PARA_SOLTAR = 250; // cuánto hay que sacudirlo (en píxeles de la imagen)

const MOSTRAR_PISTA = true; // texto "Toca o sacude los jarrones..." mientras no se haya encontrado el reloj

// =====================================================================
//  ANTORCHAS: los dos pebeteros (mesitas con cuenco) al fondo de la escena.
//  La llama siempre se ve quieta y SOLO se anima al hacer clic sobre el fuego.
//  IMPORTANTE: flamaj.json debe estar en public/lottie/flamaj.json
//
//  x, y = punto donde se apoya la base de la llama (píxeles de la imagen 1920x1080)
//  ancho = ancho de la llama (píxeles de la imagen)
//  Si no calzan con el cuenco del dibujo, ajusta estos 3 números por antorcha.
// =====================================================================
const LLAMA_JSON = "/lottie/flamaj.json";
const LLAMA_RECORTE = "66 63 227 335"; // recorte del lienzo original de la llama (x y ancho alto)
const LLAMA_RATIO = 335 / 227;          // alto / ancho de la llama ya recortada
const VECES_POR_CLIC = 3;               // cuántas veces se repite la animación después de cada clic

const ANTORCHAS = [
  { x: 570, y: 675, ancho: 88 },  // pebetero izquierdo
  { x: 1343, y: 675, ancho: 88 }, // pebetero derecho
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

const Llama = ({ left, top, ancho }) => {
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
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: "100%",
          aspectRatio: `1 / ${LLAMA_RATIO}`,
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

const relojImg = "/RELOJ.svg";

const Comic4 = () => {
  const [score, setScore] = useState(() => Number(localStorage.getItem("piktaraScore")) || 0);
  // No se guarda en localStorage a propósito: el reloj escondido vuelve a aparecer
  // cada vez que se recarga la página o se entra de nuevo a esta escena.
  const [relojEncontrado, setRelojEncontrado] = useState(false);
  const [pulse, setPulse] = useState(false);

  const scoreRef = useRef(null);
  const flyingRef = useRef(null);

  // ---------- Escena y jarrones ----------
  const escenaRef = useRef(null);
  const jarronRefs = useRef([]);
  const arrastres = useRef([]);
  const zTop = useRef(10);
  const relojElRef = useRef(null);      // el reloj que está dentro del jarrón
  const relojSueltoRef = useRef(false); // ya salió del jarrón
  const sacudida = useRef(0);
  const desplazados = useRef(Object.fromEntries(JARRONES.map((j) => [j.id, { x: 0, y: 0 }])));

  // Tamaño real de la escena → escala y desplazamiento de la imagen (background-size: cover)
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
        const s = Math.max(caja.w / IMG_W, caja.h / IMG_H);
        return { s, ox: (caja.w - IMG_W * s) / 2, oy: (caja.h - IMG_H * s) / 2 };
      })()
    : null;
  const geoRef = useRef(null);
  geoRef.current = geo;

  // El reloj salta desde la boca del jarrón
  const soltarReloj = () => {
    const el = relojElRef.current;
    if (!el || relojSueltoRef.current) return;
    relojSueltoRef.current = true;
    const alto = el.parentElement ? el.parentElement.offsetHeight : 100;
    gsap
      .timeline()
      .set(el, { opacity: 1, scale: 0.3, y: 0, pointerEvents: "auto", transformOrigin: "50% 50%" })
      .to(el, { y: -alto * 0.55, scale: 1.4, duration: 0.35, ease: "power2.out" })
      .to(el, { y: -alto * 0.32, scale: 1, duration: 0.5, ease: "bounce.out" });
  };

  // Crea los arrastres una sola vez
  const listo = !!geo;
  useEffect(() => {
    if (!listo) return;
    const els = jarronRefs.current;

    // Draggable de GSAP con type: "x" → cada jarrón solo se desliza en horizontal
    arrastres.current = JARRONES.map(
      (j, i) =>
        Draggable.create(els[i], {
          type: "x",               // ← solo eje X
          bounds: escenaRef.current, // no se pueden sacar de la escena
          edgeResistance: 1,
          zIndexBoost: false,
          // el reloj (cuando ya salió) se puede tocar sin arrastrar el jarrón
          clickableTest: (el) => !!(el.closest && el.closest("[data-reloj]")),
          onPress: function () {
            // se levanta un poquito al agarrarlo
            gsap.set(this.target, { zIndex: ++zTop.current, transformOrigin: "50% 100%" });
            gsap.to(this.target, { scale: 1.06, duration: 0.15, ease: "power2.out", overwrite: "auto" });
          },
          onDrag: function () {
            // se inclina hacia donde lo arrastras
            const giro = gsap.utils.clamp(-9, 9, this.deltaX * 0.7);
            gsap.to(this.target, { rotation: giro, duration: 0.2, ease: "power2.out", overwrite: "auto" });
            // sacudir el jarrón con el reloj lo hace caer
            if (j.id === JARRON_CON_RELOJ && !relojSueltoRef.current) {
              sacudida.current += Math.abs(this.deltaX);
              if (sacudida.current > SACUDIDA_PARA_SOLTAR * geoRef.current.s) soltarReloj();
            }
          },
          onRelease: function () {
            // al soltarlo se acomoda con un rebote
            gsap.to(this.target, { rotation: 0, scale: 1, duration: 0.7, ease: "elastic.out(1, 0.4)", overwrite: "auto" });
          },
          onDragEnd: function () {
            const s = geoRef.current.s;
            desplazados.current[j.id] = { x: this.x / s, y: 0 };
          },
          // clic sin arrastrar: el jarrón se bambolea
          onClick: function () {
            gsap.fromTo(
              this.target,
              { rotation: -5, transformOrigin: "50% 100%" },
              {
                rotation: 5,
                duration: 0.09,
                yoyo: true,
                repeat: 5,
                ease: "sine.inOut",
                overwrite: "auto",
                onComplete: () => gsap.set(this.target, { rotation: 0 }),
              }
            );
            if (j.id === JARRON_CON_RELOJ) gsap.delayedCall(0.25, soltarReloj);
          },
        })[0]
    );

    return () => {
      arrastres.current.forEach((d) => d && d.kill());
      arrastres.current = [];
    };
  }, [listo]);

  // Si cambia el tamaño de la ventana, los jarrones conservan su sitio en el dibujo
  useEffect(() => {
    if (!geo || arrastres.current.length === 0) return;
    JARRONES.forEach((j, i) => {
      const d = desplazados.current[j.id];
      if (jarronRefs.current[i]) gsap.set(jarronRefs.current[i], { x: d.x * geo.s });
    });
    arrastres.current.forEach((d) => {
      d.applyBounds(escenaRef.current);
      d.update();
    });
  }, [geo && geo.s, geo && geo.ox, geo && geo.oy]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---------- Reloj escondido (punto de progreso) ----------
  const handleRelojClick = (e) => {
    e.stopPropagation();
    if (relojEncontrado) return;

    const relojRect = e.currentTarget.getBoundingClientRect();
    const scoreRect = scoreRef.current.getBoundingClientRect();
    const flyEl = flyingRef.current;

    setRelojEncontrado(true);

    gsap.set(flyEl, {
      opacity: 1,
      x: relojRect.left + relojRect.width / 2,
      y: relojRect.top + relojRect.height / 2,
      scale: 1,
      rotate: -12,
    });

    const destinoX = scoreRect.left + scoreRect.width / 2;
    const destinoY = scoreRect.top + scoreRect.height / 2;

    gsap.to(flyEl, {
      x: destinoX,
      y: destinoY,
      scale: 0.25,
      rotate: 360,
      duration: 0.75,
      ease: "power2.inOut",
      onComplete: () => {
        gsap.set(flyEl, { opacity: 0 });

        const nuevoScore = score + 1;
        setScore(nuevoScore);
        localStorage.setItem("piktaraScore", nuevoScore);

        setPulse(true);
        gsap.fromTo(
          scoreRef.current,
          { scale: 1 },
          { scale: 1.4, duration: 0.18, ease: "power2.out", yoyo: true, repeat: 1 }
        );
        setTimeout(() => setPulse(false), 450);
      },
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

        @keyframes wiggleSticker {
          0%, 100% { transform: rotate(-12deg) scale(1); }
          50% { transform: rotate(-2deg) scale(1.08); }
        }
        @keyframes scorePop {
          0% { transform: scale(1); }
          40% { transform: scale(1.35) rotate(6deg); }
          70% { transform: scale(0.9) rotate(-4deg); }
          100% { transform: scale(1); }
        }

        .llama-lottie svg { pointer-events: none !important; }
        .llama-lottie svg path { pointer-events: visiblePainted; cursor: pointer; }

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

      {/* Reloj volador: se anima desde su posicion original hasta el marcador de progreso */}
      <img
        ref={flyingRef}
        src={relojImg}
        alt=""
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "26px",
          opacity: 0,
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate(-50%, -50%)",
          filter: `drop-shadow(0 0 6px ${palette.amarillo})`,
        }}
      />

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

        <div
          ref={scoreRef}
          className="ms-auto me-3 d-flex align-items-center"
          style={{
            fontFamily: fDisplay,
            background: palette.crema,
            color: palette.morado,
            padding: "6px 20px",
            borderRadius: "16px",
            border: `3.5px solid ${palette.borde}`,
            boxShadow: `0 4px 0 ${palette.borde}`,
            fontSize: "1rem",
            fontWeight: 800,
            animation: pulse ? "scorePop 0.45s ease" : "none",
          }}
        >
          <span style={{ marginRight: "8px", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase" }}>Progreso:</span>
          {score}
        </div>

        <Link
          to="/nuestro-comic"
          className="comic-back-btn d-flex align-items-center text-decoration-none"
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
            ref={escenaRef}
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              borderRadius: "22px",
              overflow: "hidden",
              border: `3px solid ${palette.borde}`,
              backgroundImage: `url('${ESCENA_IMG}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Pebeteros al fondo: clic sobre el fuego para encender la llama */}
            <BarreraErrores>
              {geo &&
                ANTORCHAS.map((a, i) => (
                  <Llama
                    key={i}
                    left={geo.ox + a.x * geo.s}
                    top={geo.oy + a.y * geo.s}
                    ancho={a.ancho * geo.s}
                  />
                ))}
            </BarreraErrores>

            {/* Capa de jarrones (por encima del reloj, por debajo de las flechas) */}
            <div style={{ position: "absolute", inset: 0, zIndex: 30, pointerEvents: "none" }}>
              {geo &&
                JARRONES.map((j, i) => {
                  const ancho = j.alto * j.ratio;
                  return (
                    <div
                      key={j.id}
                      ref={(el) => (jarronRefs.current[i] = el)}
                      style={{
                        position: "absolute",
                        left: geo.ox + (j.x - ancho / 2) * geo.s,
                        top: geo.oy + (j.base - j.alto) * geo.s,
                        width: ancho * geo.s,
                        height: j.alto * geo.s,
                        zIndex: 1,
                        cursor: "grab",
                        pointerEvents: "auto",
                        touchAction: "none",
                        filter: "drop-shadow(0 6px 6px rgba(58, 35, 18, 0.35))",
                      }}
                    >
                      <img
                        src={j.src}
                        alt={j.id === "cofre" ? "Cofre" : "Jarrón"}
                        draggable={false}
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "block",
                          userSelect: "none",
                          pointerEvents: "none",
                        }}
                      />

                      {/* El reloj escondido dentro del jarrón (invisible hasta que sale) */}
                      {j.id === JARRON_CON_RELOJ && !relojEncontrado && (
                        <div
                          ref={relojElRef}
                          data-reloj
                          onClick={handleRelojClick}
                          style={{
                            position: "absolute",
                            left: "50%",
                            top: "6%",
                            width: 46,
                            height: 46,
                            marginLeft: -23,
                            marginTop: -23,
                            opacity: 0,
                            pointerEvents: "none",
                            cursor: "pointer",
                          }}
                        >
                          <img
                            src={relojImg}
                            alt="Reloj"
                            draggable={false}
                            style={{
                              width: "100%",
                              display: "block",
                              borderRadius: "50%",
                              filter: `drop-shadow(0 0 6px ${palette.amarillo})`,
                              animation: "wiggleSticker 1.6s ease-in-out infinite",
                            }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>

            {MOSTRAR_PISTA && !relojEncontrado && (
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
                  whiteSpace: "nowrap",
                }}
              >
                Toca o sacude los jarrones: ¡hay un reloj escondido!
              </div>
            )}

            <Link
              to={ESCENA_ANTERIOR}
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
              to={ESCENA_SIGUIENTE}
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

export default Comic4;