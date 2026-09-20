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

// =====================================================================
//  PUZZLE DEL RELOJ
//  IMPORTANTE: copia el archivo RELOJ.svg a la carpeta /public
//  (queda como /RELOJ.svg). Las 4 piezas se recortan de ese mismo
//  archivo, así que ya no necesitas pieza1.svg ... pieza4.svg.
// =====================================================================
const DEBUG_PUZZLE = false; // true = muestra el borde rojo del tablero y loguea posiciones
const RELOJ_SRC = "/RELOJ.svg";
const RELOJ_RATIO = 401.97 / 383.53; // alto / ancho del SVG

// TABLERO: el recuadro beige donde las piezas se pueden mover (en % de la escena).
// Si no calza con el recuadro real, cambia estos 4 números (usa DEBUG_PUZZLE = true).
const TABLERO = { left: 34, top: 25, width: 32.5, height: 39.5 };

const RELOJ_ANCHO = 0.3;    // ancho del reloj armado (fracción del ancho del tablero)
const RELOJ_ALTO_MAX = 0.5; // tope de alto del reloj (fracción del alto del tablero)
const TOLERANCIA = 0.35;     // qué tan cerca hay que soltar la pieza (fracción de su tamaño)
const AJUSTE_FINO = { x: 0, y: 0 }; // mueve el reloj armado (fracción del tablero, ej. 0.02)
const MOSTRAR_GUIA = true;   // true = sombra tenue del reloj donde se arma

// bx, by, bw, bh: caja de la pieza dentro del reloj completo (fracciones 0..1)
// clip: forma exacta de la pieza (recorte por la costura del reloj)
// inicio: dónde aparece (0 = borde izquierdo/superior, 1 = borde derecho/inferior)
const PIEZAS = [
  {
    id: 1, // arriba-izquierda
    bx: 0.0, by: 0.0, bw: 0.5, bh: 0.64523,
    clip: "polygon(0.00% 0.00%, 100.00% 0.00%, 100.00% 100.00%, 82.45% 99.71%, 65.88% 98.44%, 52.13% 96.70%, 41.50% 94.99%, 31.92% 93.23%, 23.10% 91.35%, 15.06% 89.42%, 7.83% 87.50%, 1.46% 85.66%, 0.00% 85.66%)",
    inicio: { x: 0.86, y: 0.78 },
  },
  {
    id: 2, // arriba-derecha
    bx: 0.5, by: 0.0, bw: 0.5, bh: 0.64539,
    clip: "polygon(0.00% 0.00%, 100.00% 0.00%, 100.00% 80.35%, 99.26% 80.35%, 93.79% 82.54%, 87.69% 84.81%, 80.97% 87.10%, 73.64% 89.35%, 65.71% 91.52%, 60.43% 92.82%, 53.34% 94.37%, 44.61% 96.01%, 34.39% 97.56%, 22.84% 98.86%, 1.54% 100.00%, 0.00% 99.97%)",
    inicio: { x: 0.08, y: 0.72 },
  },
  {
    id: 3, // abajo-izquierda
    bx: 0.0, by: 0.55268, bw: 0.5, bh: 0.44732,
    clip: "polygon(0.00% 0.00%, 1.46% 0.00%, 7.83% 2.66%, 15.06% 5.43%, 23.10% 8.21%, 31.92% 10.93%, 41.50% 13.47%, 52.13% 15.93%, 65.88% 18.43%, 82.45% 20.27%, 100.00% 20.69%, 100.00% 100.00%, 0.00% 100.00%)",
    inicio: { x: 0.84, y: 0.1 },
  },
  {
    id: 4, // abajo-derecha
    bx: 0.5, by: 0.51855, bw: 0.5, bh: 0.48145,
    clip: "polygon(0.00% 26.31%, 1.54% 26.35%, 22.84% 24.81%, 34.39% 23.08%, 44.61% 20.99%, 53.34% 18.80%, 60.43% 16.72%, 65.71% 14.98%, 73.64% 12.07%, 80.97% 9.05%, 87.69% 5.99%, 93.79% 2.94%, 99.26% 0.00%, 100.00% 0.00%, 100.00% 100.00%, 0.00% 100.00%)",
    inicio: { x: 0.1, y: 0.08 },
  },
];

// =====================================================================
//  ANTORCHAS PEQUEÑAS: la llama siempre se ve y SOLO se anima al hacer
//  clic directamente sobre el fuego (Lottie).
//  IMPORTANTE:
//   1) instala la librería:  npm install lottie-web
//   2) copia flamaj.json a  public/lottie/flamaj.json
// =====================================================================
const LLAMA_JSON = "/lottie/flamaj.json";
// La animación se recorta al espacio que realmente ocupa la llama (x, y, ancho, alto del lienzo original)
const LLAMA_RECORTE = "66 63 227 335";
const LLAMA_RATIO = 335 / 227;   // alto / ancho de la llama ya recortada
const VECES_POR_CLIC = 3;        // cuántas veces se repite la animación después de cada clic

// Una línea por antorcha:
//  x, y  = punto donde se apoya la base de la llama (en % de la escena)
//  ancho = ancho de la llama (en % del ancho de la escena)
// Las llamas quedan pegadas al dibujo de las antorchas en cualquier tamaño de ventana.
const ANTORCHAS = [
  { x: 25.7, y: 40.9, ancho: 2.3 }, // antorcha izquierda
  { x: 74.5, y: 41.4, ancho: 2.3 }, // antorcha derecha
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
  const wrapRef = useRef(null);
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
      ref={wrapRef}
      style={{
        position: "absolute",
        left: left,
        top: top,
        width: ancho,
        marginLeft: -ancho / 2,
        height: 0,
        zIndex: 30,
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

// La escena es una imagen con background-size: cover, así que al cambiar la forma de la
// ventana se recorta distinto. Esta función convierte las coordenadas calibradas (en % de
// la escena a 16:9) a píxeles reales, para que antorchas y tablero sigan pegados al dibujo.
const ESCENA_IMG = "/escena5.jpg";
const CALIB_ASPECTO = 16 / 9;
const crearMapa = (cw, ch, A) => {
  const c0 = CALIB_ASPECTO;
  const s0 = Math.max(c0 / A, 1);       // escala de la calibración (alto de imagen = 1)
  const o0x = (c0 - A * s0) / 2;
  const o0y = (1 - s0) / 2;
  const sc = Math.max(cw / A, ch);      // escala real (píxeles por alto de imagen)
  const ox = (cw - A * sc) / 2;
  const oy = (ch - sc) / 2;
  return {
    punto: (px, py) => {
      const u = ((px / 100) * c0 - o0x) / (A * s0);
      const v = (py / 100 - o0y) / s0;
      return { x: ox + u * A * sc, y: oy + v * sc };
    },
    ancho: (pw) => (pw / 100) * c0 * (sc / s0),
    alto: (ph) => (ph / 100) * (sc / s0),
  };
};

const Comic5 = () => {
  const [score, setScore] = useState(() => Number(localStorage.getItem("piktaraScore")) || 0);
  const [relojEncontrado, setRelojEncontrado] = useState(() => localStorage.getItem("relojComic5") === "true");
  const [pulse, setPulse] = useState(false);
  const [modalReloj, setModalReloj] = useState(false); // alerta de "reloj armado"
  const timers = useRef([]);
  const confetiCapa = useRef(null);

  const scoreRef = useRef(null);
  const flyingRef = useRef(null);

  // ---------- Puzzle ----------
  const escenaRef = useRef(null);

  // Tamaño real de la escena y proporción de la imagen de fondo
  const [caja, setCaja] = useState(null);
  const [aspectoImg, setAspectoImg] = useState(16 / 9);

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

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) setAspectoImg(img.naturalWidth / img.naturalHeight);
    };
    img.src = ESCENA_IMG;
  }, []);

  const mapa = caja ? crearMapa(caja.w, caja.h, aspectoImg) : null;
  let estiloTablero = {
    left: `${TABLERO.left}%`,
    top: `${TABLERO.top}%`,
    width: `${TABLERO.width}%`,
    height: `${TABLERO.height}%`,
  };
  if (mapa) {
    const p = mapa.punto(TABLERO.left, TABLERO.top);
    estiloTablero = {
      left: p.x,
      top: p.y,
      width: mapa.ancho(TABLERO.width),
      height: mapa.alto(TABLERO.height),
    };
  }
  const mesaRef = useRef(null);
  const piezaRefs = useRef([]);
  const arrastres = useRef([]);

  // medidas del tablero y del reloj (en píxeles)
  const [m, setM] = useState(null);
  const medidasRef = useRef(null);
  medidasRef.current = m;

  // piezas ya encajadas: el puzzle NO se guarda, siempre arranca desde cero
  // (al salir de la escena o volver a entrar se puede repetir)
  const [fijadas, setFijadas] = useState(() => {
    localStorage.removeItem("relojArmadoComic5"); // limpia el valor guardado por versiones anteriores
    return Object.fromEntries(PIEZAS.map((p) => [p.id, false]));
  });
  const fijadasRef = useRef(fijadas);
  const armado = PIEZAS.every((p) => fijadas[p.id]);

  // posición libre de cada pieza (0..1 dentro del espacio disponible del tablero)
  const estado = useRef(
    Object.fromEntries(PIEZAS.map((p) => [p.id, { fx: p.inicio.x, fy: p.inicio.y }]))
  );

  // Mide el tablero y calcula el tamaño del reloj
  useEffect(() => {
    const mesa = mesaRef.current;
    if (!mesa) return;
    const calc = () => {
      const W = mesa.clientWidth;
      const H = mesa.clientHeight;
      if (!W || !H) return;
      const rw = Math.min(W * RELOJ_ANCHO, (H * RELOJ_ALTO_MAX) / RELOJ_RATIO);
      setM((prev) =>
        prev && prev.W === W && prev.H === H ? prev : { W, H, rw, rh: rw * RELOJ_RATIO }
      );
    };
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(mesa);
    return () => ro.disconnect();
  }, []);

  // Posición final (px) de la pieza i dentro del tablero
  const destino = (i) => {
    const { W, H, rw, rh } = medidasRef.current;
    const p = PIEZAS[i];
    return {
      x: (W - rw) / 2 + AJUSTE_FINO.x * W + p.bx * rw,
      y: (H - rh) / 2 + AJUSTE_FINO.y * H + p.by * rh,
    };
  };

  // Coloca todas las piezas según el tamaño actual del tablero
  const colocar = () => {
    if (!medidasRef.current) return;
    const { W, H } = medidasRef.current;
    PIEZAS.forEach((p, i) => {
      const el = piezaRefs.current[i];
      if (!el) return;
      if (fijadasRef.current[p.id]) {
        const d = destino(i);
        gsap.set(el, { x: d.x, y: d.y, zIndex: 10 });
      } else {
        const st = estado.current[p.id];
        const libreX = Math.max(0, W - el.offsetWidth);
        const libreY = Math.max(0, H - el.offsetHeight);
        gsap.set(el, { x: st.fx * libreX, y: st.fy * libreY });
      }
    });
    arrastres.current.forEach((d) => {
      if (!d) return;
      d.applyBounds(mesaRef.current);
      d.update();
    });
  };

  // Lluvia de confeti que sale desde el centro del reloj armado
  const lanzarConfeti = () => {
    const mesa = mesaRef.current;
    const med = medidasRef.current;
    if (!mesa || !med) return;
    const r = mesa.getBoundingClientRect();
    const cx = r.left + med.W / 2 + AJUSTE_FINO.x * med.W;
    const cy = r.top + med.H / 2 + AJUSTE_FINO.y * med.H;
    const colores = [palette.amarillo, palette.rosa, palette.morado, "#3DDC97", "#4CC9F0", palette.crema];

    if (confetiCapa.current) confetiCapa.current.remove();
    const capa = document.createElement("div");
    capa.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9500;overflow:hidden";
    document.body.appendChild(capa);
    confetiCapa.current = capa;

    for (let k = 0; k < 80; k++) {
      const p = document.createElement("div");
      const size = 8 + Math.random() * 10;
      const redonda = Math.random() < 0.35;
      p.style.cssText = `position:absolute;left:0;top:0;width:${size}px;height:${redonda ? size : size * 0.5}px;background:${colores[k % colores.length]};border:2px solid ${palette.borde};box-sizing:border-box;border-radius:${redonda ? "50%" : "2px"};`;
      capa.appendChild(p);

      const ang = Math.random() * Math.PI * 2;
      const fuerza = 160 + Math.random() * 380;
      const dx = Math.cos(ang) * fuerza;
      const dy = Math.sin(ang) * fuerza * 0.8 - 120;

      gsap.set(p, { x: cx, y: cy, rotation: Math.random() * 360, scale: 0 });
      const tl = gsap.timeline({ delay: Math.random() * 0.15 });
      tl.to(p, {
        x: cx + dx,
        y: cy + dy,
        scale: 1,
        rotation: "+=" + (Math.random() * 720 - 360),
        duration: 0.7,
        ease: "power2.out",
      }).to(p, {
        y: cy + dy + window.innerHeight * 0.6 + Math.random() * 200,
        x: "+=" + (Math.random() * 160 - 80),
        rotation: "+=" + (Math.random() * 540 - 270),
        opacity: 0,
        duration: 1.6 + Math.random() * 0.8,
        ease: "power1.in",
      });
    }
    timers.current.push(setTimeout(() => capa.remove(), 4500));
  };

  // Celebración: confeti primero y, un momento después, la alerta
  const celebrar = () => {
    lanzarConfeti();
    timers.current.push(setTimeout(() => setModalReloj(true), 900));
  };

  // Vuelve a mezclar las piezas para armar el reloj otra vez
  const reiniciar = () => {
    const vacias = Object.fromEntries(PIEZAS.map((p) => [p.id, false]));
    fijadasRef.current = vacias;
    PIEZAS.forEach((p) => {
      estado.current[p.id] = { fx: p.inicio.x, fy: p.inicio.y };
    });
    setModalReloj(false);
    setFijadas(vacias);
    arrastres.current.forEach((d) => d && d.enable());
    requestAnimationFrame(() => {
      piezaRefs.current.forEach((el) => el && gsap.set(el, { zIndex: 5 }));
      colocar();
    });
  };

  // Limpia timers y confeti si sales de la escena
  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
      if (confetiCapa.current) confetiCapa.current.remove();
    };
  }, []);

  // Encaja la pieza i en su lugar
  const fijar = (i) => {
    const d = destino(i);
    const el = piezaRefs.current[i];
    arrastres.current[i].disable();

    gsap.to(el, {
      x: d.x,
      y: d.y,
      zIndex: 10,
      duration: 0.3,
      ease: "back.out(2.2)",
      onComplete: () => {
        const nuevas = { ...fijadasRef.current, [PIEZAS[i].id]: true };
        fijadasRef.current = nuevas;
        setFijadas(nuevas);
        if (PIEZAS.every((q) => nuevas[q.id])) {
          celebrar();
          // 👉 aquí también puedes dar un punto / premio cuando el reloj queda armado
          // (no se guarda en localStorage: al volver a la escena el puzzle se puede repetir)
        }
      },
    });
  };

  // Crea los arrastres una sola vez, cuando ya existen las piezas
  const listo = !!m;
  useEffect(() => {
    if (!listo) return;
    const mesa = mesaRef.current;
    const els = piezaRefs.current;
    let zTop = 200;

    arrastres.current = PIEZAS.map(
      (p, i) =>
        Draggable.create(els[i], {
          type: "x,y",
          bounds: mesa,          // solo se mueve dentro del tablero
          edgeResistance: 1,     // límite duro
          zIndexBoost: false,
          onPress: function () {
            gsap.set(this.target, { zIndex: ++zTop });
            if (els[i].firstChild) els[i].firstChild.style.cursor = "grabbing";
          },
          onRelease: function () {
            if (els[i].firstChild) els[i].firstChild.style.cursor = "grab";
          },
          onDragEnd: function () {
            const { W, H } = medidasRef.current;
            const libreX = Math.max(1, W - els[i].offsetWidth);
            const libreY = Math.max(1, H - els[i].offsetHeight);
            const st = estado.current[p.id];
            st.fx = this.x / libreX;
            st.fy = this.y / libreY;

            if (DEBUG_PUZZLE) {
              console.log(`Pieza ${p.id}:`, { x: Math.round(this.x), y: Math.round(this.y) });
            }

            const d = destino(i);
            const dist = Math.hypot(this.x - d.x, this.y - d.y);
            const tol = Math.min(els[i].offsetWidth, els[i].offsetHeight) * TOLERANCIA;
            if (dist <= tol) fijar(i);
          },
        })[0]
    );

    colocar();
    arrastres.current.forEach((d, i) => {
      if (fijadasRef.current[PIEZAS[i].id]) d.disable();
    });

    return () => {
      arrastres.current.forEach((d) => d && d.kill());
      arrastres.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listo]);

  // Si cambia el tamaño de la pantalla, recoloca las piezas
  useEffect(() => {
    if (!m || arrastres.current.length === 0) return;
    colocar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [m]);

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
        localStorage.setItem("relojComic5", "true");

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

  // Posición del reloj armado / sombra guía (px dentro del tablero)
  const relojPos = m
    ? {
        left: (m.W - m.rw) / 2 + AJUSTE_FINO.x * m.W,
        top: (m.H - m.rh) / 2 + AJUSTE_FINO.y * m.H,
      }
    : null;

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
        @keyframes relojArmadoPop {
          0% { transform: scale(1); }
          45% { transform: scale(1.07); }
          100% { transform: scale(1); }
        }
        @keyframes brilloReloj {
          0%, 100% { transform: scale(1.05); opacity: 0.55; }
          50% { transform: scale(1.45); opacity: 0.95; }
        }
        .llama-lottie svg { pointer-events: none !important; }
        .llama-lottie svg path { pointer-events: visiblePainted; cursor: pointer; }
        @keyframes fondoEntra {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalEntra {
          0% { transform: scale(0.5) rotate(-6deg); opacity: 0; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes relojFlota {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
        }
        .comic-modal-btn {
          font-family: ${fDisplay};
          font-weight: 800;
          font-size: 1rem;
          padding: 10px 24px;
          border-radius: 14px;
          border: 3.5px solid ${palette.borde};
          box-shadow: 0 4px 0 ${palette.borde};
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .comic-modal-btn:hover {
          transform: translateY(-3px) scale(1.04);
          box-shadow: 0 6px 0 ${palette.borde};
        }
        .comic-modal-btn:active {
          transform: translateY(2px);
          box-shadow: 0 2px 0 ${palette.borde};
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

      {/* Alerta cuando el reloj queda armado */}
      {modalReloj && (
        <div
          onClick={() => setModalReloj(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 9000,
            background: "rgba(58, 35, 18, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "fondoEntra 0.25s ease",
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-reloj-armado"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "min(440px, 90vw)",
              background: palette.crema,
              border: `6px solid ${palette.morado}`,
              borderRadius: "28px",
              boxShadow: `0 10px 0 ${palette.borde}`,
              padding: "34px 32px 28px",
              textAlign: "center",
              fontFamily: fDisplay,
              animation: "modalEntra 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <WashiTape top="-16px" left="-20px" rotate={-18} color={palette.amarillo} />
            <WashiTape top="-16px" right="-20px" rotate={18} color={palette.rosa} />

            <img
              src={RELOJ_SRC}
              alt=""
              draggable={false}
              style={{
                width: "130px",
                animation: "relojFlota 2s ease-in-out infinite",
                filter: "drop-shadow(0 6px 4px rgba(0,0,0,0.3))",
              }}
            />

            <h2
              id="titulo-reloj-armado"
              style={{
                margin: "14px 0 6px",
                color: palette.morado,
                fontFamily: fDisplay,
                fontWeight: 800,
                fontSize: "2rem",
              }}
            >
              ¡Reloj armado!
            </h2>
            <p
              style={{
                margin: "0 0 22px",
                color: palette.borde,
                fontFamily: "'Quicksand', sans-serif",
                fontWeight: 700,
                fontSize: "1.05rem",
              }}
            >
              Juntaste las 4 piezas y el reloj quedó como nuevo.
            </p>

            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                type="button"
                className="comic-modal-btn"
                onClick={() => setModalReloj(false)}
                style={{ background: palette.amarillo, color: palette.borde }}
              >
                SEGUIR
              </button>
              <button
                type="button"
                className="comic-modal-btn"
                onClick={reiniciar}
                style={{ background: palette.rosa, color: "#fff" }}
              >
                ARMAR OTRA VEZ
              </button>
            </div>
          </div>
        </div>
      )}

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
            Aventura 5
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
            {/* TABLERO: las 4 piezas se mueven libremente solo dentro de este recuadro */}
            <div
              ref={mesaRef}
              style={{
                position: "absolute",
                ...estiloTablero,
                zIndex: 1,
                ...(DEBUG_PUZZLE ? { outline: "3px dashed red" } : {}),
              }}
            >
              {/* Sombra guía: muestra dónde se arma el reloj */}
              {m && MOSTRAR_GUIA && !armado && (
                <img
                  src={RELOJ_SRC}
                  alt=""
                  draggable={false}
                  style={{
                    position: "absolute",
                    left: relojPos.left,
                    top: relojPos.top,
                    width: m.rw,
                    height: m.rh,
                    maxWidth: "none",
                    filter: "brightness(0)",
                    opacity: 0.16,
                    pointerEvents: "none",
                    userSelect: "none",
                    zIndex: 0,
                  }}
                />
              )}

              {/* Brillo que palpita detrás del reloj armado */}
              {m && armado && (
                <div
                  style={{
                    position: "absolute",
                    left: relojPos.left + m.rw * 0.05,
                    top: relojPos.top + m.rh * 0.05,
                    width: m.rw * 0.9,
                    height: m.rh * 0.9,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(255,224,102,0.95) 0%, rgba(255,195,0,0) 70%)",
                    animation: "brilloReloj 1.6s ease-in-out infinite",
                    pointerEvents: "none",
                    zIndex: 9,
                  }}
                />
              )}

              {/* Reloj completo (aparece cuando las 4 piezas están en su lugar) */}
              {m && armado && (
                <img
                  src={RELOJ_SRC}
                  alt="Reloj armado"
                  draggable={false}
                  style={{
                    position: "absolute",
                    left: relojPos.left,
                    top: relojPos.top,
                    width: m.rw,
                    height: m.rh,
                    maxWidth: "none",
                    filter: "drop-shadow(0 4px 4px rgba(0,0,0,0.35))",
                    pointerEvents: "none",
                    userSelect: "none",
                    zIndex: 10,
                    animation: "relojArmadoPop 0.45s ease",
                  }}
                />
              )}

              {/* Las 4 piezas, recortadas del mismo RELOJ.svg */}
              {m &&
                PIEZAS.map((p, i) => (
                  <div
                    key={p.id}
                    ref={(el) => (piezaRefs.current[i] = el)}
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      width: p.bw * m.rw,
                      height: p.bh * m.rh,
                      zIndex: 5,
                      pointerEvents: "none",
                      touchAction: "none",
                      visibility: armado ? "hidden" : "visible",
                      filter: fijadas[p.id] ? "none" : "drop-shadow(0 4px 5px rgba(0,0,0,0.4))",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        clipPath: p.clip,
                        overflow: "hidden",
                        pointerEvents: fijadas[p.id] ? "none" : "auto",
                        cursor: "grab",
                        touchAction: "none",
                      }}
                    >
                      <img
                        src={RELOJ_SRC}
                        alt="Pieza del reloj"
                        draggable={false}
                        style={{
                          position: "absolute",
                          left: -p.bx * m.rw,
                          top: -p.by * m.rh,
                          width: m.rw,
                          height: m.rh,
                          maxWidth: "none",
                          pointerEvents: "none",
                          userSelect: "none",
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>

            {/* Antorchas pequeñas: clic para encender la llama */}
            <BarreraErrores>
              {mapa &&
                ANTORCHAS.map((a, i) => {
                  const p = mapa.punto(a.x, a.y);
                  return <Llama key={i} left={p.x} top={p.y} ancho={mapa.ancho(a.ancho)} />;
                })}
            </BarreraErrores>

            {!relojEncontrado && (
              <img
                src={relojImg}
                alt=""
                onClick={handleRelojClick}
                style={{
                  position: "absolute",
                  top: "12%",
                  right: "15%",
                  width: "26px",
                  cursor: "pointer",
                  opacity: 0.95,
                  filter: `drop-shadow(0 0 6px ${palette.amarillo})`,
                  transform: "rotate(-12deg)",
                  animation: "wiggleSticker 1.6s ease-in-out infinite",
                  zIndex: 500,
                  borderRadius: "50%",
                }}
              />
            )}

            <Link
              to="/comic/4"
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
              to="/comic/6"
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

export default Comic5;