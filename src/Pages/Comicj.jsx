import React, { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import lottie from "lottie-web";
import "../Comic.css";
import Contador, { recogerReloj } from "../Components/Contador";

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
//  ESCENA 1
//  Archivos que deben estar en la carpeta /public:
//    otro-fondo (1).jpg · jarron-verde-1.svg · jarron-verde-2.svg · jarron-naranja.svg · cofre.svg
// =====================================================================
const ESCENA_IMG = "/otro-fondo (1).jpg";
const ESCENA_SIGUIENTE = "/comic/2";

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
//  NINOVE (animación Lottie con sus imágenes)
//  La carpeta lottie-fondo1 va en /public, sin renombrar nada:
//    public/lottie-fondo1/Ninove escena1.json
//    public/lottie-fondo1/img_0.png ... img_3.png
//  El código busca solo el nombre correcto de cada imagen si alguna no carga.
//
//  x = centro de Ninove · base = donde apoyan los pies · ancho / alto = tamaño
//  (todo en píxeles de la imagen 1920 x 1080). CALIBRAR según dónde la quieras.
// =====================================================================
const NINOVE_CARPETA = "/lottie-fondo1/";
const NINOVE_JSON = "Ninove escena1.json";
const NINOVE = { x: 720, base: 960, ancho: 250, alto: 540 };
const NINOVE_IGNORAR = []; // números de img_N que NO son del personaje (fondos); aquí no hay

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

// =====================================================================
//  PERSONAJE (Lottie con imágenes externas, como Ninove)
//  - Corrige las rutas de las imágenes del JSON (espacios y paréntesis incluidos).
//  - Si una imagen no carga, prueba variantes del nombre (img_1.png, img_1 (1).png, ...).
//  - Recorta la animación al personaje, así ancho / alto controlan su tamaño real.
//  (left, top) es el punto donde apoyan los pies; la caja crece hacia arriba.
// =====================================================================
const Personaje = ({ left, top, ancho, alto, carpeta, json, imagenes = null, ignorar = [], alias = {} }) => {
  const cajaRef = useRef(null);

  useEffect(() => {
    let cancelado = false;
    let anim = null;

    fetch(carpeta + encodeURIComponent(json))
      .then((r) => {
        if (!r.ok) throw new Error(`No se encontró ${json}`);
        return r.json();
      })
      .then((data) => {
        if (cancelado || !cajaRef.current) return;
        // Corrige las rutas de las imágenes (espacios y paréntesis incluidos)
        (data.assets || []).forEach((a) => {
          if (!a.p || a.e === 1) return; // e === 1: imagen embebida, no se toca
          const n = (a.p.match(/img_(\d+)/) || [])[1];
          const real = imagenes ? imagenes[n] : decodeURIComponent(a.p);
          if (real) {
            a.u = carpeta;
            a.p = encodeURIComponent(real);
          }
        });
        // Diagnóstico: muestra qué ruta pide cada imagen (útil si alguna sale rota)
        console.log(
          `Personaje (${json}) imágenes:`,
          (data.assets || []).map((a) => ({ id: a.id, u: a.u, p: a.p, embebida: a.e === 1 }))
        );
        anim = lottie.loadAnimation({
          container: cajaRef.current,
          renderer: "svg",
          loop: true,
          autoplay: true,
          animationData: data,
          rendererSettings: { preserveAspectRatio: "xMidYMax meet" },
        });

        // El lienzo de la animación suele ser mucho más grande que el personaje.
        // Aquí se recorta (viewBox) a la zona que ocupa en varios fotogramas.
        const ajustarAlPersonaje = () => {
          try {
            const svg = cajaRef.current && cajaRef.current.querySelector("svg");
            if (!svg || !anim) return;
            const href = (im) =>
              im.getAttribute("href") ||
              im.getAttributeNS("http://www.w3.org/1999/xlink", "href") ||
              "";
            const imgs = Array.from(svg.querySelectorAll("image")).filter((im) => {
              const n = (decodeURIComponent(href(im)).match(/img_(\d+)/) || [])[1];
              return !ignorar.includes(Number(n)); // ignorar = imágenes que no son del personaje (fondos)
            });
            const ctm = svg.getScreenCTM();
            if (!imgs.length || !ctm) return;
            const inv = ctm.inverse();
            let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
            const total = Math.max(1, Math.floor(anim.totalFrames));
            [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].forEach((f) => {
              anim.goToAndStop(Math.floor(f * total), true);
              imgs.forEach((im) => {
                const r = im.getBoundingClientRect();
                if (!r.width || !r.height) return;
                const a = new DOMPoint(r.left, r.top).matrixTransform(inv);
                const b = new DOMPoint(r.right, r.bottom).matrixTransform(inv);
                x1 = Math.min(x1, a.x); y1 = Math.min(y1, a.y);
                x2 = Math.max(x2, b.x); y2 = Math.max(y2, b.y);
              });
            });
            anim.goToAndPlay(0, true);
            if (!isFinite(x1) || x2 - x1 < 1 || y2 - y1 < 1) return;
            const mx = (x2 - x1) * 0.12;      // margen a los lados para el vaivén de la animación
            const myArriba = (y2 - y1) * 0.3;  // margen arriba: que NO se corte la cabeza
            const myAbajo = (y2 - y1) * 0.02;  // casi nada abajo: los pies quedan en el borde inferior
            svg.setAttribute(
              "viewBox",
              `${x1 - mx} ${y1 - myArriba} ${x2 - x1 + mx * 2} ${y2 - y1 + myArriba + myAbajo}`
            );
            console.log("Personaje recortado a:", { x1, y1, x2, y2 });
          } catch (e) {
            console.warn("Personaje: no se pudo recortar al personaje", e);
          }
        };

        // Si una imagen no carga, prueba variantes del nombre y usa la primera que exista.
        const XLINK = "http://www.w3.org/1999/xlink";
        const repararImagenes = () => {
          const svg = cajaRef.current && cajaRef.current.querySelector("svg");
          if (!svg) return;
          svg.querySelectorAll("image").forEach((im) => {
            const actual = im.getAttribute("href") || im.getAttributeNS(XLINK, "href") || "";
            if (!actual || actual.startsWith("data:")) return;
            const archivo = actual.split("/").pop();
            const carp = actual.slice(0, actual.length - archivo.length);
            const decod = decodeURIComponent(archivo);
            const base = decod.replace(/ \(\d+\)(?=\.png$)/i, "");
            const todos = [
              decod,
              base,
              ...[1, 2, 3, 4].map((k) => base.replace(/\.png$/i, ` (${k}).png`)),
              ...(alias[decod] || []), // archivos que sirven en lugar de uno que no existe
            ];
            const nombres = todos.filter((n, i) => todos.indexOf(n) === i);
            const probar = (i) => {
              if (i >= nombres.length) {
                console.error("Personaje: no se encontró ninguna variante de", decod, "en", carp);
                return;
              }
              const url = carp + encodeURIComponent(nombres[i]);
              const prueba = new Image();
              prueba.onload = () => {
                im.setAttribute("href", url);
                im.setAttributeNS(XLINK, "href", url);
                if (i > 0) console.log("Personaje: usando", nombres[i], "en lugar de", decod);
              };
              prueba.onerror = () => probar(i + 1);
              prueba.src = url;
            };
            probar(0);
          });
        };

        anim.addEventListener("DOMLoaded", () => {
          repararImagenes();
          ajustarAlPersonaje();
        });
      })
      .catch((err) => console.error("Personaje:", err.message, "→ revisa public" + carpeta));

    return () => {
      cancelado = true;
      try {
        if (anim) anim.destroy();
      } catch (e) {
        console.warn("Personaje: no se pudo destruir la animación", e);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={cajaRef}
      style={{
        position: "absolute",
        left,
        top: top - alto, // (left, top) es el punto de los pies; el cuadro crece hacia arriba
        width: ancho,
        height: alto,
        marginLeft: -ancho / 2,
        zIndex: 25,
        pointerEvents: "none",
      }}
    />
  );
};

// =====================================================================
//  RELOJ DE ARENA (animación Lottie) en el centro de la mesa.
//  Se ve quieto y SOLO se anima al hacer clic sobre la esfera.
//  IMPORTANTE: Juanreloj.json debe estar en public/lottie/Juanreloj.json
//
//  x    = centro de la mesa (píxeles de la imagen 1920x1080)
//  base = altura donde apoya la esfera sobre la mesa
//  alto = alto del lienzo de la animación (controla el tamaño del reloj)
//  Al abrirse, la animación baja la mitad de abajo de la esfera; para que no se meta
//  en la mesa, todo el reloj SUBE lo justo mientras se abre y vuelve a su sitio al terminar.
//  Si no calza con la mesa del dibujo, ajusta estos 3 números.
// =====================================================================
const RELOJ_ARENA_JSON = "/lottie/Juanreloj.json";
const RELOJ_ARENA = { x: 960, base: 686, alto: 380 };
const RELOJ_ARENA_RATIO = 550 / 1080;                         // ancho / alto del lienzo de la animación
const RELOJ_ARENA_ANCHO = RELOJ_ARENA.alto * RELOJ_ARENA_RATIO;
const ESFERA_BASE = 0.661;     // la base de la esfera queda al 66% del alto del lienzo
const ESFERA_CENTRO_Y = 0.47;  // el centro de la esfera queda al 47% del alto
const ESFERA_ANCHO = 0.68;     // la esfera ocupa el 68% del ancho del lienzo

// Subida mientras se abre (medidas del lienzo original de la animación: 550 x 1080)
const LIENZO_ALTO = 1080;
const SUBIDA_UNIDADES = 279;   // cuánto baja la mitad de abajo al abrirse (se compensa subiendo todo)
const ABRE_INI = 65;           // fotograma donde empieza a abrirse
const ABRE_FIN = 70;           // fotograma donde termina de abrirse
const CIERRA_INI = 100;        // fotograma donde empieza a cerrarse
const CIERRA_FIN = 105;        // fotograma donde termina de cerrarse

// El JSON se descarga una sola vez
let relojArenaPromesa = null;
const cargarRelojArena = () => {
  if (!relojArenaPromesa) {
    relojArenaPromesa = fetch(RELOJ_ARENA_JSON)
      .then((r) => {
        if (!r.ok) throw new Error(`No se encontró ${RELOJ_ARENA_JSON}`);
        return r.json();
      })
      .catch((err) => {
        relojArenaPromesa = null;
        console.warn("Reloj de arena:", err.message, "→ copia Juanreloj.json a public/lottie/");
        return null;
      });
  }
  return relojArenaPromesa;
};

const RelojArena = ({ left, top, ancho, alto }) => {
  const [animando, setAnimando] = useState(false);
  const cajaRef = useRef(null);
  const animRef = useRef(null);
  const altoRef = useRef(alto);
  useEffect(() => {
    altoRef.current = alto; // se actualiza si cambia el tamaño de la ventana
  });

  // Carga la animación: queda quieta en su primer fotograma hasta que le des clic
  useEffect(() => {
    let cancelado = false;
    cargarRelojArena().then((data) => {
      if (cancelado || !data || !cajaRef.current) return;
      if (data.h !== LIENZO_ALTO) {
        console.warn("Reloj de arena: este Juanreloj.json no es el original (alto " + data.h + "); usa el original de 550 x " + LIENZO_ALTO);
      }
      const anim = lottie.loadAnimation({
        container: cajaRef.current,
        renderer: "svg",
        loop: false,
        autoplay: false,
        animationData: JSON.parse(JSON.stringify(data)),
        rendererSettings: { preserveAspectRatio: "xMidYMid meet" },
      });
      // El reloj sube mientras se abre (para que la mitad de abajo no se meta en la mesa)
      // y baja mientras se cierra, en sincronía con la animación.
      anim.addEventListener("enterFrame", (e) => {
        if (!cajaRef.current) return;
        const f = e.currentTime;
        let t = 0; // 0 = en su sitio, 1 = subido del todo
        if (f > ABRE_INI && f < ABRE_FIN) t = (f - ABRE_INI) / (ABRE_FIN - ABRE_INI);
        else if (f >= ABRE_FIN && f <= CIERRA_INI) t = 1;
        else if (f > CIERRA_INI && f < CIERRA_FIN) t = 1 - (f - CIERRA_INI) / (CIERRA_FIN - CIERRA_INI);
        gsap.set(cajaRef.current, { y: -t * SUBIDA_UNIDADES * (altoRef.current / LIENZO_ALTO) });
      });
      anim.addEventListener("complete", () => {
        anim.goToAndStop(0, true); // vuelve a la pose quieta
        if (cajaRef.current) gsap.set(cajaRef.current, { y: 0 }); // y a su posición del principio
        setAnimando(false);
      });
      // se queda quieto en el primer fotograma; solo se reproduce al hacer clic
      anim.addEventListener("DOMLoaded", () => anim.goToAndStop(0, true));
      anim.goToAndStop(0, true);
      animRef.current = anim;
    });
    return () => {
      cancelado = true;
      try {
        if (animRef.current) animRef.current.destroy();
      } catch (e) {
        console.warn("Reloj de arena: no se pudo destruir la animación", e);
      }
      animRef.current = null;
    };
  }, []);

  // Clic sobre la esfera: reproduce la animación una vez
  const alClic = () => {
    if (!animRef.current || animando) return;
    setAnimando(true);
    animRef.current.goToAndPlay(0, true);
    gsap.fromTo(
      cajaRef.current,
      { scale: 1, transformOrigin: `50% ${ESFERA_BASE * 100}%` },
      { scale: 1.08, duration: 0.14, yoyo: true, repeat: 1, ease: "power2.out" }
    );
  };

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: ancho,
        height: alto,
        zIndex: 35,
        pointerEvents: "none",
      }}
    >
      <div
        ref={cajaRef}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          filter: "drop-shadow(0 6px 6px rgba(58, 35, 18, 0.35))",
        }}
      />
      {/* Zona de clic: solo la esfera, no todo el lienzo (que es transparente y mucho más alto) */}
      <div
        onClick={alClic}
        role="button"
        aria-label="Reloj de arena"
        style={{
          position: "absolute",
          left: `${((1 - ESFERA_ANCHO) / 2) * 100}%`,
          width: `${ESFERA_ANCHO * 100}%`,
          aspectRatio: "1 / 1",
          top: `${ESFERA_CENTRO_Y * 100}%`,
          transform: "translateY(-50%)",
          borderRadius: "50%",
          cursor: "pointer",
          pointerEvents: "auto",
        }}
      />
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

const Comicj = () => {
  // No se guarda en localStorage a propósito: el reloj escondido vuelve a aparecer
  // cada vez que se recarga la página o se entra de nuevo a esta escena.
  const [relojEncontrado, setRelojEncontrado] = useState(false);


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
  // se actualiza después de cada dibujo (no durante el render)
  useEffect(() => {
    geoRef.current = geo;
  });

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
    setRelojEncontrado(true);
    // el reloj vuela al contador y suma 1 punto (solo la primera vez)
    recogerReloj("relojEscena1", e.currentTarget);
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
            Aventura 1
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

            {/* Reloj de arena en el centro de la mesa: clic sobre la esfera para animarlo */}
            <BarreraErrores>
              {geo && (
                <RelojArena
                  left={geo.ox + (RELOJ_ARENA.x - RELOJ_ARENA_ANCHO / 2) * geo.s}
                  top={geo.oy + (RELOJ_ARENA.base - ESFERA_BASE * RELOJ_ARENA.alto) * geo.s}
                  ancho={RELOJ_ARENA_ANCHO * geo.s}
                  alto={RELOJ_ARENA.alto * geo.s}
                />
              )}
            </BarreraErrores>

            {/* Ninove: en su propia barrera para que, si falla, no afecte al resto de la escena */}
            <BarreraErrores>
              {geo && (
                <Personaje
                  left={geo.ox + NINOVE.x * geo.s}
                  top={geo.oy + NINOVE.base * geo.s}
                  ancho={NINOVE.ancho * geo.s}
                  alto={NINOVE.alto * geo.s}
                  carpeta={NINOVE_CARPETA}
                  json={NINOVE_JSON}
                  ignorar={NINOVE_IGNORAR}
                />
              )}
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

export default Comicj;