import React, { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";
import lottie from "lottie-web";
import gsap from "gsap";
import "../Comic.css";
import Contador from "../Components/Contador";
import RelojEscondido from "../Components/RelojEscondido";
import AyudaEscenas from "../Components/AyudaEscenas";
import AudioEscena from "../Components/AudioEscena";

const fDisplay = "'Baloo 2', 'Comic Sans MS', sans-serif";

const palette = {
  morado: "#5A189A",
  amarillo: "#FFC300",
  crema: "#FFF8E7",
  borde: "#3A2312",
  rosa: "#FF597B",
  verde: "#00E676",
  fondoEscena: "#E9D8A6", // tono pergamino (arena cálida), para que combine con el mapa
};

// Cadena de escenas: 1 Comicj · 2 MelanyEstrellas · 3 Comic · 4 comic4 ...
const ESCENA_ANTERIOR = "/comic/2";
const ESCENA_SIGUIENTE = "/comic/4";

const CLAVE_RELOJ = "relojEscena3"; // clave del reloj de esta escena en el contador

// =====================================================================
//  MAPA (animación Lottie del pergamino que se desenrolla)
//  Archivos que deben estar en la carpeta /public:
//    public/lottie-mapa/mapaa.json
//    public/lottie-mapa/images/img_0.png
//    public/lottie-mapa/images/img_1.png
//    public/lottie-mapa/images/img_2.png
// =====================================================================
const MAPA_JSON = "/lottie-mapa/mapaa.json";
const MAPA_IMAGENES = "/lottie-mapa/images/"; // carpeta de las imágenes; debe terminar en "/"

// =====================================================================
//  BRÚJULA (se arma con 3 PNG y GSAP)
//    public/lottie-mapa/brujula-images/img_0.png  (pivote del centro)
//    public/lottie-mapa/brujula-images/img_1.png  (aguja roja)
//    public/lottie-mapa/brujula-images/img_2.png  (base de la brújula)
// =====================================================================
const BRUJULA_IMG = "/lottie-mapa/brujula-images/";
const BRUJULA_RATIO = 827 / 615; // alto / ancho de la base (img_2.png)

const BRUJULA_POS = { left: "15%", top: "72%", ancho: "8%" };

const BRUJULA_DESTINO = { x: 53.6, y: 51.8 };
const BRUJULA_DESTINO_ESCALA = 2;
const BRUJULA_GIRO_SEGUNDOS = 3;
const BRUJULA_GIRA_ANTES_DE_ESCONDERSE = 2;
const BRUJULA_ACHICAR_SEGUNDOS = 1.6;
const BRUJULA_APARECE_AL = 0.35;
const BRUJULA_ENTRADA_SEGUNDOS = 0.15;

// Pon true para ver la brújula desde el principio (solo para probar posición/tamaño)
const BRUJULA_PRUEBA = false;

// =====================================================================
//  CIVILIZACIONES
//  Cada una tiene un destello en el mapa (x / y en % de la escena; es el CENTRO del destello).
//  Al 1er clic: el destello se transforma en su animación Lottie (y el nombre aparece de una).
//  Al 2do clic (sobre la animación): aparece el resumen.
//
//  Archivos que deben estar directo en /public/lottie-mapa (con estos nombres):
//    Egipto.json       + img_0 (1).png   (pirámides)
//    Mesopotamia.json  + img_0 (2).png
//    Valle.json        + img_0 (3).png
//    China.json        + img_0.png
//  El código ignora la ruta que traiga cada JSON y usa directamente estos PNG.
//
//  Ajusta x / y si un destello no te calza justo en su lugar del mapa.
//  "ancho" = tamaño de la animación en % del ancho de la escena.
// =====================================================================
const CIVS = [
  {
    id: "egipto",
    nombre: "Antiguo Egipto",
    json: "/lottie-mapa/Egipto.json",
    imagen: "/lottie-mapa/img_0%20(1).png",
    x: 53.6, y: 51.8, ancho: 7,
    fecha: "Hace unos 5.000 años",
    color: "#FFC300",
    resumen: [
      "Nació a orillas del río Nilo, que cada año se desbordaba y dejaba la tierra fértil para cultivar.",
      "Lo gobernaban los faraones, considerados casi dioses. Construyeron pirámides gigantes como tumbas.",
      "Inventaron los jeroglíficos, el papiro para escribir y la momificación para cuidar a los muertos.",
    ],
  },
  {
    id: "mesopotamia",
    nombre: "Mesopotamia",
    json: "/lottie-mapa/Mesopotamia.json",
    imagen: "/lottie-mapa/img_0%20(2).png",
    x: 60.5, y: 45.5, ancho: 7,
    fecha: "Hace unos 6.000 años",
    color: "#FF597B",
    resumen: [
      "Su nombre significa “tierra entre ríos”: quedaba entre el Tigris y el Éufrates.",
      "Allí los sumerios levantaron las primeras ciudades y templos escalonados llamados zigurats.",
      "Crearon la escritura cuneiforme sobre tablillas de arcilla y se les atribuye la rueda. El Código de Hammurabi fue de las primeras leyes escritas.",
    ],
  },
  {
    id: "valle",
    nombre: "Valle del Indo",
    json: "/lottie-mapa/Valle.json",
    imagen: "/lottie-mapa/img_0%20(3).png",
    x: 68, y: 56, ancho: 7,
    fecha: "Hace unos 4.600 años",
    color: "#00E676",
    resumen: [
      "Floreció junto al río Indo, en lo que hoy es Pakistán y el noroeste de la India. Sus ciudades más famosas fueron Harappa y Mohenjo-Daro.",
      "Eran ciudades muy bien planeadas: calles en cuadrícula, casas de ladrillo, baños y desagües.",
      "Tenían una escritura con sellos que todavía no se ha logrado descifrar, así que guarda muchos secretos.",
    ],
  },
  {
    id: "china",
    nombre: "China Antigua",
    json: "/lottie-mapa/China.json",
    imagen: "/lottie-mapa/img_0.png",
    x: 78, y: 44, ancho: 7.5,
    fecha: "Hace unos 4.000 años",
    color: "#9D4EDD",
    resumen: [
      "Surgió junto al río Amarillo (Huang He), que también inundaba y fertilizaba los campos.",
      "Gobernaron dinastías de emperadores. La escritura china, con miles de caracteres, ya se usaba en la dinastía Shang.",
      "Con los siglos inventaron la seda, el papel, la brújula y la pólvora, y construyeron la Gran Muralla.",
    ],
  },
];

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

// visible = true cuando el mapa ya casi termina de abrirse.
// onFin = se llama cuando la brújula terminó de viajar a Egipto y desapareció.
const Brujula = ({ visible, onFin }) => {
  const envRef = useRef(null);
  const cajaRef = useRef(null);
  const agujaRef = useRef(null);
  const tlRef = useRef(null);
  const giroRef = useRef(null);
  const ocultarRef = useRef(null);
  const estadoRef = useRef("quieta"); // "quieta" | "animando" | "centro" | "fin"
  const onFinRef = useRef(onFin);
  onFinRef.current = onFin;
  const [clicable, setClicable] = useState(false);

  const detener = () => {
    if (tlRef.current) tlRef.current.kill();
    if (giroRef.current) giroRef.current.kill();
    if (ocultarRef.current) ocultarRef.current.kill();
    tlRef.current = null;
    giroRef.current = null;
    ocultarRef.current = null;
  };

  useEffect(() => {
    const env = envRef.current;
    const caja = cajaRef.current;
    const aguja = agujaRef.current;
    if (!env || !caja || !aguja) return;

    detener();
    gsap.killTweensOf([env, caja]);
    estadoRef.current = "quieta";
    gsap.set(env, { x: 0, y: 0, scale: 1, opacity: 1, transformOrigin: "49.9% 62%" });
    gsap.set(aguja, { rotation: 0, yPercent: 0, transformOrigin: "30.35% 68%" });

    if (!visible) {
      setClicable(false);
      gsap.set(caja, { opacity: 0, scale: 0.4, rotation: 0, transformOrigin: "50% 50%" });
      return;
    }
    setClicable(true);
    gsap.fromTo(
      caja,
      { opacity: 0, scale: 0.4, rotation: 0, transformOrigin: "50% 50%" },
      { opacity: 1, scale: 1, duration: BRUJULA_ENTRADA_SEGUNDOS, ease: "back.out(1.7)" }
    );
  }, [visible]);

  const irAlCentro = () => {
    const env = envRef.current;
    const caja = cajaRef.current;
    const aguja = agujaRef.current;
    if (!env || !caja || !aguja) return;
    const escena = env.offsetParent;
    if (!escena) return;

    const dx = (escena.clientWidth * BRUJULA_DESTINO.x) / 100 - (env.offsetLeft + env.offsetWidth * 0.499);
    const dy = (escena.clientHeight * BRUJULA_DESTINO.y) / 100 - (env.offsetTop + env.offsetHeight * 0.62);

    gsap.set(env, { zIndex: 25 });
    gsap.to(env, {
      x: dx,
      y: dy,
      scale: BRUJULA_DESTINO_ESCALA,
      duration: 1,
      ease: "power2.inOut",
      onComplete: () => {
        estadoRef.current = "centro";
        giroRef.current = gsap.to(caja, {
          rotation: "+=360",
          duration: BRUJULA_GIRO_SEGUNDOS,
          ease: "none",
          repeat: -1,
        });
        ocultarRef.current = gsap.delayedCall(BRUJULA_GIRA_ANTES_DE_ESCONDERSE, () => {
          ocultarRef.current = gsap
            .timeline({
              onComplete: () => {
                if (giroRef.current) giroRef.current.kill();
                giroRef.current = null;
                estadoRef.current = "fin";
                if (onFinRef.current) onFinRef.current(); // ← aquí salen los destellos
              },
            })
            .to(env, { scale: 0.08, duration: BRUJULA_ACHICAR_SEGUNDOS, ease: "power2.inOut" })
            .to(env, { opacity: 0, duration: 0.2, ease: "none" });
        });
      },
    });
  };

  const alClic = () => {
    const caja = cajaRef.current;
    const aguja = agujaRef.current;
    if (!visible || !caja || !aguja || estadoRef.current !== "quieta") return;
    estadoRef.current = "animando";
    setClicable(false);
    detener();

    gsap.set(aguja, { rotation: 0, yPercent: 0, transformOrigin: "30.35% 68%" });
    gsap.fromTo(
      caja,
      { scale: 1, transformOrigin: "50% 50%" },
      { scale: 1.1, duration: 0.14, yoyo: true, repeat: 1, ease: "power2.out", overwrite: "auto" }
    );
    tlRef.current = gsap
      .timeline({ onComplete: irAlCentro })
      .to(aguja, { rotation: 17, duration: 0.96, ease: "none" })
      .to(aguja, { rotation: 30, duration: 1.0, ease: "none" })
      .to(aguja, { rotation: 42, duration: 0.8, ease: "none" })
      .to(aguja, { yPercent: 6.2, duration: 1.0, ease: "none" }, 0.96);
  };

  useEffect(() => detener, []);

  const capa = { position: "absolute", display: "block", userSelect: "none", pointerEvents: "none" };

  return (
    <div
      ref={envRef}
      style={{
        position: "absolute",
        left: BRUJULA_POS.left,
        top: BRUJULA_POS.top,
        width: BRUJULA_POS.ancho,
        aspectRatio: `1 / ${BRUJULA_RATIO}`,
        zIndex: 15,
        pointerEvents: "none",
      }}
    >
      <div
        ref={cajaRef}
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0,
          pointerEvents: "none",
          filter: "drop-shadow(0 4px 4px rgba(58, 35, 18, 0.35))",
        }}
      >
        <img
          src={BRUJULA_IMG + "img_2.png"}
          alt="Brújula"
          draggable={false}
          style={{ ...capa, left: 0, top: 0, width: "100%", height: "100%" }}
        />
        <img
          ref={agujaRef}
          src={BRUJULA_IMG + "img_1.png"}
          alt=""
          draggable={false}
          style={{ ...capa, left: "44.4%", top: "43.76%", width: "32.36%", height: "23.34%" }}
        />
        <img
          src={BRUJULA_IMG + "img_0.png"}
          alt=""
          draggable={false}
          style={{ ...capa, left: "43.13%", top: "57.2%", width: "13.66%", height: "9.79%" }}
        />
      </div>

      {clicable && (
        <div
          onClick={alClic}
          role="button"
          aria-label="Brújula"
          style={{
            position: "absolute",
            left: "4.5%",
            width: "91%",
            aspectRatio: "1 / 1",
            top: "28.2%",
            borderRadius: "50%",
            cursor: "pointer",
            pointerEvents: "auto",
          }}
        />
      )}
    </div>
  );
};

// Destello (estrella brillante) en el mapa
const Destello = ({ color }) => (
  <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", overflow: "visible", display: "block" }}>
    <circle cx="50" cy="50" r="34" fill={color} opacity="0.35" className="destello-halo" />
    <path
      d="M50 2 C54 34 66 46 98 50 C66 54 54 66 50 98 C46 66 34 54 2 50 C34 46 46 34 50 2 Z"
      fill="#FFFDF0"
      stroke={palette.borde}
      strokeWidth="4"
      strokeLinejoin="round"
    />
    <circle cx="50" cy="50" r="7" fill={color} stroke={palette.borde} strokeWidth="3" />
  </svg>
);

// Devuelve la primera URL de la lista que carga como imagen (o null si ninguna)
const primeraQueCarga = (urls) =>
  new Promise((resolve) => {
    const probar = (i) => {
      if (i >= urls.length) return resolve(null);
      const img = new Image();
      img.onload = () => resolve(urls[i]);
      img.onerror = () => probar(i + 1);
      img.src = urls[i];
    };
    probar(0);
  });

// Marcador de una civilización:
//   fase "destello"  → estrellita brillando (clic 1)
//   fase "animacion" → su animación Lottie + su nombre de una (clic 2 abre el resumen)
const Marcador = ({ civ, onAbrir }) => {
  const contRef = useRef(null);
  const animRef = useRef(null);
  const [fase, setFase] = useState("destello");
  const [ratio, setRatio] = useState(1); // alto / ancho de la animación

  useEffect(() => {
    if (fase !== "animacion" || animRef.current) return;
    let cancelado = false;

    fetch(civ.json)
      .then((r) => {
        if (!r.ok) throw new Error(`No se encontró ${civ.json}`);
        return r.json();
      })
      .then(async (data) => {
        if (cancelado) return;

        // Busca el PNG de esta civilización probando varias rutas y usa la primera que cargue
        const assets = (data.assets || []).filter((a) => a.p && !a.e);
        for (const a of assets) {
          const nombreJson = String(a.p).split("/").pop();
          const candidatas = [
            civ.imagen,
            decodeURI(civ.imagen),
            `/lottie-mapa/${nombreJson}`,
            `/lottie-mapa/images/${nombreJson}`,
          ];
          const ok = await primeraQueCarga(candidatas);
          if (cancelado) return;
          if (ok) {
            a.u = "";
            a.p = ok;
          } else {
            console.error(`${civ.nombre}: no se encontró ninguna de estas rutas →`, candidatas);
          }
        }

        if (cancelado || !contRef.current) return;
        if (data.w && data.h) setRatio(data.h / data.w);

        const anim = lottie.loadAnimation({
          container: contRef.current,
          renderer: "svg",
          loop: false,
          autoplay: true,
          animationData: data,
          rendererSettings: { preserveAspectRatio: "xMidYMid meet" },
        });
        animRef.current = anim;
      })
      .catch((err) => {
        console.warn(`${civ.nombre}:`, err.message);
      });

    return () => {
      cancelado = true;
    };
  }, [fase]);

  useEffect(() => {
    return () => {
      if (animRef.current) animRef.current.destroy();
      animRef.current = null;
    };
  }, []);

  const alClic = () => {
    if (fase === "destello") setFase("animacion");
    else onAbrir(civ);
  };

  const esDestello = fase === "destello";

  return (
    <div
      onClick={alClic}
      role="button"
      aria-label={esDestello ? `Descubrir ${civ.nombre}` : `Ver resumen de ${civ.nombre}`}
      className={esDestello ? "marcador-destello" : "marcador-anim"}
      style={{
        position: "absolute",
        left: `${civ.x}%`,
        top: `${civ.y}%`,
        width: esDestello ? "3.4%" : `${civ.ancho}%`,
        aspectRatio: esDestello ? "1 / 1" : `1 / ${ratio}`,
        transform: "translate(-50%, -50%)",
        cursor: "pointer",
        zIndex: 18,
      }}
    >
      {esDestello && <Destello color={civ.color} />}

      {!esDestello && (
        <>
          <div
            ref={contRef}
            className="marcador-lottie"
            style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
          />
          {/* El nombre sale de una, en cuanto aparece la ciudad (sin esperar a que termine la animación) */}
          <div
            className="marcador-etiqueta"
            style={{
              position: "absolute",
              left: "50%",
              top: "100%",
              marginTop: "4px",
              transform: "translateX(-50%)",
              whiteSpace: "nowrap",
              background: civ.color,
              color: palette.borde,
              fontFamily: fDisplay,
              fontWeight: 800,
              fontSize: "0.8rem",
              padding: "3px 12px",
              borderRadius: "12px",
              border: `3px solid ${palette.borde}`,
              boxShadow: `0 3px 0 ${palette.borde}`,
              pointerEvents: "none",
              textTransform: "uppercase",
            }}
          >
            {civ.nombre}
          </div>
        </>
      )}
    </div>
  );
};

// Tarjeta con el resumen de la civilización
const Resumen = ({ civ, onCerrar }) => (
  <div
    onClick={onCerrar}
    style={{
      position: "absolute",
      inset: 0,
      zIndex: 50,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(58, 35, 18, 0.45)",
    }}
  >
    <div
      className="resumen-card"
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "relative",
        width: "min(560px, 80%)",
        maxHeight: "88%",
        overflowY: "auto",
        background: palette.crema,
        border: `5px solid ${palette.borde}`,
        borderRadius: "24px",
        boxShadow: `0 8px 0 ${palette.borde}`,
        padding: "22px 28px 24px",
        fontFamily: "'Quicksand', sans-serif",
        color: palette.borde,
      }}
    >
      <button
        onClick={onCerrar}
        aria-label="Cerrar"
        style={{
          position: "absolute",
          top: "10px",
          right: "12px",
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          border: `3px solid ${palette.borde}`,
          background: palette.rosa,
          color: "#fff",
          fontFamily: fDisplay,
          fontWeight: 800,
          fontSize: "1.1rem",
          lineHeight: 1,
          boxShadow: `0 3px 0 ${palette.borde}`,
          cursor: "pointer",
        }}
      >
        ✕
      </button>

      <div
        style={{
          display: "inline-block",
          background: civ.color,
          border: `3px solid ${palette.borde}`,
          borderRadius: "14px",
          padding: "2px 14px",
          fontFamily: fDisplay,
          fontWeight: 800,
          fontSize: "0.8rem",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          boxShadow: `0 3px 0 ${palette.borde}`,
        }}
      >
        {civ.fecha}
      </div>

      <h2
        style={{
          fontFamily: fDisplay,
          fontWeight: 800,
          fontSize: "1.9rem",
          margin: "10px 0 8px",
          color: palette.morado,
        }}
      >
        {civ.nombre}
      </h2>

      {civ.resumen.map((p, i) => (
        <p key={i} style={{ fontWeight: 600, fontSize: "1.02rem", lineHeight: 1.45, margin: "0 0 8px" }}>
          {p}
        </p>
      ))}
    </div>
  </div>
);

const Comic = () => {
  const mapaRef = useRef(null);
  const animRef = useRef(null);

  const [lista, setLista] = useState(false);
  const [fase, setFase] = useState("inicio"); // "inicio" | "reproduciendo" | "fin"
  const [brujulaVisible, setBrujulaVisible] = useState(false);
  const brujulaOkRef = useRef(false);

  const [destellosVisibles, setDestellosVisibles] = useState(false); // salen cuando la brújula termina
  const [civAbierta, setCivAbierta] = useState(null);                // civilización con el resumen abierto
  const [ronda, setRonda] = useState(0);                             // cambia al repetir, para reiniciar los marcadores

  useEffect(() => {
    let cancelado = false;
    let anim = null;

    fetch(MAPA_JSON)
      .then((r) => {
        if (!r.ok) throw new Error(`No se encontró ${MAPA_JSON}`);
        return r.json();
      })
      .then((data) => {
        if (cancelado || !mapaRef.current) return;

        (data.assets || []).forEach((a) => {
          const img = new Image();
          img.onerror = () => console.warn(`Mapa: falta la imagen ${MAPA_IMAGENES}${a.p}`);
          img.src = MAPA_IMAGENES + a.p;
        });

        anim = lottie.loadAnimation({
          container: mapaRef.current,
          renderer: "svg",
          loop: false,
          autoplay: false,
          animationData: data,
          assetsPath: MAPA_IMAGENES,
          rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
        });
        anim.addEventListener("enterFrame", (e) => {
          if (!brujulaOkRef.current && e.currentTime >= e.totalTime * BRUJULA_APARECE_AL) {
            brujulaOkRef.current = true;
            setBrujulaVisible(true);
          }
        });
        anim.addEventListener("complete", () => {
          setFase("fin");
          brujulaOkRef.current = true;
          setBrujulaVisible(true);
        });
        anim.goToAndStop(0, true);
        animRef.current = anim;
        setLista(true);
      })
      .catch((err) => {
        console.warn("Escena 3:", err.message, "→ copia mapaa.json a public/lottie-mapa/");
      });

    return () => {
      cancelado = true;
      if (anim) anim.destroy();
      animRef.current = null;
    };
  }, []);

  const reproducir = () => {
    if (!animRef.current) return;
    setFase("reproduciendo");
    brujulaOkRef.current = false;
    setBrujulaVisible(false);
    setDestellosVisibles(false);
    setCivAbierta(null);
    setRonda((n) => n + 1);
    animRef.current.goToAndPlay(0, true);
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

        @keyframes playBounce {
          0%, 100% { transform: translate(-50%, -50%) scale(1); box-shadow: 0 8px 0 ${palette.borde}; }
          50% { transform: translate(-50%, -54%) scale(1.08); box-shadow: 0 14px 0 ${palette.borde}; }
        }

        /* destello: aparece con un "pop" y luego palpita y brilla */
        @keyframes destelloPop {
          0% { transform: translate(-50%, -50%) scale(0) rotate(-90deg); opacity: 0; }
          70% { transform: translate(-50%, -50%) scale(1.3) rotate(10deg); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes destelloLatido {
          0%, 100% { transform: scale(1) rotate(0deg); filter: drop-shadow(0 0 4px #FFF3B0); }
          50% { transform: scale(1.18) rotate(12deg); filter: drop-shadow(0 0 12px #FFE066); }
        }
        @keyframes destelloHalo {
          0%, 100% { opacity: 0.25; transform: scale(0.8); }
          50% { opacity: 0.6; transform: scale(1.5); }
        }
        @keyframes animPop {
          0% { transform: translate(-50%, -50%) scale(0.2); opacity: 0; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        @keyframes etiquetaSube {
          0% { opacity: 0; transform: translateX(-50%) scale(0.6); }
          100% { opacity: 1; transform: translateX(-50%) scale(1); }
        }
        @keyframes resumenPop {
          0% { transform: scale(0.7); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        .marcador-destello {
          animation: destelloPop 0.5s ease-out both;
        }
        .marcador-destello svg {
          animation: destelloLatido 1.6s ease-in-out 0.5s infinite;
          transform-origin: 50% 50%;
        }
        .marcador-destello .destello-halo {
          animation: destelloHalo 1.6s ease-in-out infinite;
          transform-origin: 50% 50%;
          transform-box: fill-box;
        }
        .marcador-anim {
          animation: animPop 0.35s ease-out both;
          transition: filter 0.15s ease;
        }
        .marcador-anim:hover {
          filter: drop-shadow(0 0 10px #FFF3B0) brightness(1.06);
        }
        .marcador-lottie svg { width: 100% !important; height: 100% !important; display: block; }
        .marcador-etiqueta { animation: etiquetaSube 0.2s ease-out both; }
        .resumen-card { animation: resumenPop 0.25s ease-out both; }

        /* el mapa llena todo el recuadro de la escena */
        .mapa-lottie svg { width: 100% !important; height: 100% !important; display: block; }

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
        .mapa-repetir:hover {
          transform: translateX(-50%) translateY(-3px) scale(1.04);
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
            Aventura 3
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
            }}
          >
            {/* Mapa */}
            <div
              ref={mapaRef}
              className="mapa-lottie"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
            />

            {/* Brújula: al terminar su viaje a Egipto salen los destellos */}
            <Brujula
              visible={BRUJULA_PRUEBA || brujulaVisible}
              onFin={() => setDestellosVisibles(true)}
            />

            {/* Destellos de las civilizaciones: 1er clic = animación + nombre, 2do clic = resumen */}
            {destellosVisibles &&
              CIVS.map((civ) => (
                <Marcador key={`${civ.id}-${ronda}`} civ={civ} onAbrir={setCivAbierta} />
              ))}

            <RelojEscondido clave={CLAVE_RELOJ} left="42%" top="62%" size={34} pegatina />

            {lista && fase === "inicio" && (
              <div
                onClick={reproducir}
                role="button"
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

            {lista && fase === "fin" && (
              <div
                onClick={reproducir}
                role="button"
                className="mapa-repetir"
                style={{
                  position: "absolute",
                  left: "50%",
                  bottom: "14px",
                  transform: "translateX(-50%)",
                  padding: "6px 20px",
                  borderRadius: "14px",
                  background: palette.amarillo,
                  border: `3px solid ${palette.borde}`,
                  boxShadow: `0 4px 0 ${palette.borde}`,
                  fontFamily: fDisplay,
                  fontSize: "0.9rem",
                  fontWeight: 800,
                  color: palette.borde,
                  cursor: "pointer",
                  zIndex: 20,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  transition: "transform 0.15s ease",
                }}
              >
                Repetir
              </div>
            )}

            {/* Resumen de la civilización (2do clic) */}
            {civAbierta && <Resumen civ={civAbierta} onCerrar={() => setCivAbierta(null)} />}

            {/* Música de la escena 3: suena con el primer clic; botón 🔊/🔇 abajo a la izquierda */}
            <AudioEscena escena={3} />

            {/* Panel de ayuda lateral: cómo se juega en las escenas 1 a 8 */}
            <AyudaEscenas escenaActual={3} />

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

export default Comic;