import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { Flip } from "gsap/Flip";
import PiktaraLoader from "./PiktaraLoader";

// Requiere gsap >= 3.13 (todos estos plugins ya son gratuitos):  npm i gsap@latest
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText, ScrambleTextPlugin, DrawSVGPlugin, MotionPathPlugin, Flip);

const fDisplay = "'Baloo 2', 'Comic Sans MS', sans-serif";
const fBody = "'Quicksand', 'Comic Sans MS', sans-serif";

const palette = {
  morado: "#9D6A8E",
  amarillo: "#FFC300",
  crema: "#FFF8E7",
  borde: "#3A2312",
  lavanda: "#E6E6FA",
};

const HERO_TITLE = "¡Atraviesa el portal del tiempo y descubre la aventura!";

const personajes = [
  {
    nombre: "ADAD",
    img: "/Adad.svg",
    rot: "-2deg",
    descripcion:
      "Un niño curioso y valiente que crece rodeado de las historias antiguas de Mesopotamia.",
    funcion:
      "Es el guía del lector: hace las preguntas que todos nos haríamos y ayuda a descubrir el mundo paso a paso.",
  },
  {
    nombre: "ATREUS",
    img: "/diosgriego.svg",
    rot: "1.5deg",
    descripcion:
      "Un joven con raíces en la mitología griega, siempre coronado con laurel como los héroes clásicos.",
    funcion:
      "Introduce al lector en las leyendas y valores del mundo griego, aportando sabiduría a las decisiones de la historia.",
  },
  {
    nombre: "NINOVE",
    img: "/Ninove.svg",
    rot: "-1.5deg",
    descripcion:
      "Una joven decidida y protectora, conectada a las tradiciones ancestrales de su pueblo.",
    funcion:
      "Acompaña al lector en los momentos clave, ayudando a tomar las decisiones que cambian el rumbo de la aventura.",
  },
];

const equipo = [
  {
    nombre: "KEVIN RESTREPO",
    img: "/Kevin.svg",
    desc: "Tengo 18 años, me gusta mucho el arte y la historia. Soy muy creativo y me apasiona el diseño gráfico.",
  },
  {
    nombre: "MELANY BELTRAN",
    img: "/Mely.svg",
    desc: "Tengo 18 años. Entre mis pasiones está el arte abstracto y el dibujo; me considero una chica alegre y solidaria.",
  },
  {
    nombre: "JUAN LOPERA",
    img: "/Juan.svg",
    desc: "Tengo 18 años, apasionado por la tecnología, los videojuegos y la creatividad aplicada al diseño gráfico.",
  },
];

// Estrellas decorativas del hero: posición (%), tamaño (px) y "profundidad" para el parallax del mouse
const ESTRELLAS = [
  { x: 6, y: 18, s: 34, d: 1.0 }, { x: 14, y: 62, s: 22, d: 0.6 }, { x: 22, y: 32, s: 16, d: 0.4 },
  { x: 31, y: 78, s: 28, d: 0.9 }, { x: 44, y: 12, s: 20, d: 0.5 }, { x: 58, y: 84, s: 18, d: 0.5 },
  { x: 67, y: 20, s: 30, d: 1.0 }, { x: 76, y: 70, s: 24, d: 0.7 }, { x: 84, y: 38, s: 16, d: 0.4 },
  { x: 91, y: 14, s: 26, d: 0.9 }, { x: 94, y: 76, s: 32, d: 1.1 }, { x: 52, y: 46, s: 14, d: 0.3 },
];

// cuántos relojes hay que atrapar para abrir el portal
const META = 3;

const sinMovimiento = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Tilt 3D + brillo ("glare") que sigue al mouse
const crearTilt = (maxTilt = 10, esc = 1.05) => ({
  onMouseEnter: (e) => {
    gsap.to(e.currentTarget, { scale: esc, duration: 0.35, ease: "power2.out", overwrite: "auto" });
  },
  onMouseMove: (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty("--gx", `${(px + 0.5) * 100}%`);
    card.style.setProperty("--gy", `${(py + 0.5) * 100}%`);
    gsap.to(card, { rotationY: px * maxTilt, rotationX: py * -maxTilt, transformPerspective: 800, duration: 0.4, ease: "power2.out", overwrite: "auto" });
  },
  onMouseLeave: (e) => {
    gsap.to(e.currentTarget, { scale: 1, rotationX: 0, rotationY: 0, duration: 0.8, ease: "elastic.out(1, 0.5)", overwrite: "auto" });
  },
});

// Efecto imán (botones sociales)
const iman = {
  onMouseMove: (e) => {
    const b = e.currentTarget.getBoundingClientRect();
    gsap.to(e.currentTarget, { x: (e.clientX - (b.left + b.width / 2)) * 0.4, y: (e.clientY - (b.top + b.height / 2)) * 0.4, duration: 0.35, ease: "power3.out", overwrite: "auto" });
  },
  onMouseLeave: (e) => {
    gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)", overwrite: "auto" });
  },
};

// --- MODAL DE PERSONAJE: la imagen "vuela" desde la tarjeta (GSAP Flip) ---
const PersonajeModal = ({ personaje, origen, onClose }) => {
  const overlayRef = useRef(null);
  const cardRef = useRef(null);
  const cerrando = useRef(false);

  const cerrar = () => {
    if (cerrando.current) return;
    cerrando.current = true;
    gsap
      .timeline({ onComplete: onClose })
      .to(cardRef.current, { y: 50, opacity: 0, scale: 0.9, duration: 0.35, ease: "power2.in" })
      .to(overlayRef.current, { opacity: 0, duration: 0.25 }, "-=0.15");
  };

  useEffect(() => {
    if (!personaje) return;
    cerrando.current = false;
    const onKey = (e) => { if (e.key === "Escape") cerrar(); };
    window.addEventListener("keydown", onKey);

    const rm = sinMovimiento();
    const ctx = gsap.context(() => {
      const img = cardRef.current.querySelector(".ptk-modal-img");
      const textos = cardRef.current.querySelectorAll(".ptk-modal-title, .ptk-modal-desc, .ptk-modal-fn");
      if (rm) return;
      gsap.set(textos, { opacity: 0, y: 24 });
      const vuela = origen && origen.isConnected;
      if (vuela) Flip.fit(img, origen, { scale: true }); // la imagen empieza exactamente sobre la miniatura

      const tl = gsap.timeline();
      tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power1.out" })
        .fromTo(cardRef.current, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: "power2.out" }, 0.05);
      if (vuela) tl.to(img, { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 0.95, ease: "expo.inOut" }, 0.1);
      else tl.fromTo(img, { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" }, 0.15);
      tl.to(textos, { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: "back.out(1.6)" }, 0.7)
        .to(".ptk-modal-title", { duration: 0.9, ease: "none", scrambleText: { text: personaje.nombre, chars: "upperCase", speed: 0.6 } }, 0.75)
        .add(() => {
          gsap.to(img, { y: -8, rotation: 1.5, duration: 2, ease: "sine.inOut", yoyo: true, repeat: -1 });
        });
    }, cardRef);

    return () => {
      window.removeEventListener("keydown", onKey);
      ctx.revert();
    };
  }, [personaje]);

  if (!personaje) return null;

  return (
    <div
      ref={overlayRef}
      onClick={cerrar}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(58, 35, 18, 0.6)",
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        backdropFilter: "blur(5px)",
      }}
    >
      <div
        ref={cardRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: palette.morado,
          border: `5px solid ${palette.borde}`,
          borderRadius: "28px",
          boxShadow: `0 12px 0 ${palette.borde}`,
          maxWidth: "480px",
          width: "100%",
          padding: "28px",
          position: "relative",
          textAlign: "center",
        }}
      >
        <button
          onClick={cerrar}
          style={{
            position: "absolute",
            top: "-16px",
            right: "-16px",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: palette.amarillo,
            border: `3px solid ${palette.borde}`,
            boxShadow: `0 4px 0 ${palette.borde}`,
            fontFamily: fDisplay,
            fontWeight: 800,
            fontSize: "1.1rem",
            color: palette.borde,
            cursor: "pointer",
            lineHeight: 1,
            zIndex: 2,
          }}
          aria-label="Cerrar"
        >
          X
        </button>

        <img
          src={personaje.img}
          alt={personaje.nombre}
          className="ptk-modal-img"
          style={{
            width: "160px",
            aspectRatio: "3/4",
            objectFit: "contain",
            objectPosition: "top",
            background: palette.crema,
            border: `3px solid ${palette.amarillo}`,
            borderRadius: "18px",
            margin: "0 auto 16px",
            boxShadow: `0 6px 0 ${palette.borde}33`,
            display: "block",
            position: "relative",
            zIndex: 3,
          }}
        />

        <h3
          className="ptk-modal-title"
          style={{
            fontFamily: fDisplay,
            fontSize: "1.4rem",
            letterSpacing: "0.06em",
            color: palette.amarillo,
            textTransform: "uppercase",
            fontWeight: 800,
            marginBottom: "14px",
          }}
        >
          {personaje.nombre}
        </h3>

        <p
          className="ptk-modal-desc"
          style={{ fontFamily: fBody, fontSize: "1.02rem", lineHeight: 1.6, color: "#ffffff", fontWeight: 600, marginBottom: "18px" }}
        >
          {personaje.descripcion}
        </p>

        <div
          className="ptk-modal-fn"
          style={{
            display: "inline-block",
            background: "rgba(58, 35, 18, 0.3)",
            color: "#ffffff",
            borderRadius: "16px",
            padding: "12px 20px",
            border: `2px solid ${palette.borde}`,
            boxShadow: `0 4px 0 ${palette.borde}`,
            width: "100%",
          }}
        >
          <p
            style={{
              fontFamily: fDisplay,
              fontSize: "0.85rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              margin: 0,
              marginBottom: "4px",
              color: palette.amarillo,
            }}
          >
            Función en la historia
          </p>
          <p style={{ fontFamily: fBody, fontSize: "0.92rem", fontWeight: 600, margin: 0, lineHeight: 1.5, color: "#ffffff" }}>
            {personaje.funcion}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [overlayOn, setOverlayOn] = useState(true);
  const [personajeActivo, setPersonajeActivo] = useState(null);
  const [origen, setOrigen] = useState(null);

  const rootRef = useRef(null);
  const navRef = useRef(null);
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const progressBarRef = useRef(null);
  const bgWrapRef = useRef(null);
  const bgLayersRef = useRef([]);
  const cursorRef = useRef(null);
  const topRef = useRef(null);
  const contadorRef = useRef(null);
  const encontrados = useRef(0);
  const relojTween = useRef(null);
  const [portalAbierto, setPortalAbierto] = useState(false);
  const location = useLocation();

  const personajeTilt = crearTilt(8);
  const equipoTilt = crearTilt(12);

  const backgroundImages = ["./ultimofondo (1).svg", "./fondo111.svg"];

  /* ---------- Fondo del hero: crossfade + zoom lento (todo con GSAP) ---------- */
  useEffect(() => {
    const layers = bgLayersRef.current.filter(Boolean);
    if (!layers.length) return;
    gsap.set(layers, { opacity: 0, scale: 1.05 });
    gsap.set(layers[0], { opacity: 1 });
    if (sinMovimiento()) return;

    let i = 0;
    let llamada;
    const zooms = [];
    const zoom = (k) => {
      if (zooms[k]) zooms[k].kill();
      zooms[k] = gsap.fromTo(layers[k], { scale: 1.05 }, { scale: 1.4, duration: 9, ease: "none" });
    };
    zoom(0);
    const ciclo = () => {
      const sig = (i + 1) % layers.length;
      zoom(sig);
      gsap.to(layers[i], { opacity: 0, duration: 1.5, ease: "power2.inOut" });
      gsap.to(layers[sig], { opacity: 1, duration: 1.5, ease: "power2.inOut" });
      i = sig;
      llamada = gsap.delayedCall(6, ciclo);
    };
    llamada = gsap.delayedCall(6, ciclo);
    return () => { llamada && llamada.kill(); zooms.forEach((z) => z && z.kill()); gsap.killTweensOf(layers); };
  }, []);

  useEffect(() => {
    if (location.state?.scrollTo) {
      const targetId = location.state.scrollTo;
      const t = setTimeout(() => {
        const elem = document.getElementById(targetId);
        if (elem) gsap.to(window, { duration: 1.1, ease: "power2.inOut", scrollTo: { y: elem, offsetY: 90 } });
      }, 300);
      return () => clearTimeout(t);
    }
  }, [location]);

  /* ---------- Navbar: entra deslizándose ---------- */
  useEffect(() => {
    gsap.fromTo(navRef.current, { y: -90, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.6)", delay: 0.1 });
  }, []);

  /* ---------- Hero: título por letras en 3D, estrellas, ruta con reloj escondido ---------- */
  useEffect(() => {
    if (loading || sinMovimiento()) return;
    const splits = [];
    const ctx = gsap.context(() => {
      const split = SplitText.create(titleRef.current, { type: "words,chars", charsClass: "ptk-c" });
      splits.push(split);

      gsap.set(".ptk-reloj", { autoAlpha: 0 });
      const tl = gsap.timeline({ defaults: { ease: "back.out(1.7)" } });
      tl.fromTo(".ptk-hero-logo", { scale: 0, opacity: 0, rotate: -180 }, { scale: 1, opacity: 1, rotate: 0, duration: 1.1 })
        .fromTo(
          split.chars,
          { y: 90, opacity: 0, rotationX: -90, transformOrigin: "50% 100%", transformPerspective: 700 },
          { y: 0, opacity: 1, rotationX: 0, duration: 0.8, stagger: 0.022, ease: "back.out(1.8)" },
          "-=0.5"
        )
        .fromTo(".ptk-star", { scale: 0, rotation: -120, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: 0.8, stagger: { each: 0.06, from: "random" } }, "-=0.9")
        .fromTo(".ptk-contador", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.5")
        .fromTo(".ptk-scroll", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.3")
        .add(() => {
          // el título flota; las estrellas titilan y flotan; la aguja del reloj gira
          gsap.to(titleRef.current, { y: -8, duration: 1.8, ease: "sine.inOut", yoyo: true, repeat: -1 });
          gsap.utils.toArray(".ptk-star").forEach((st) => {
            gsap.to(st, { yPercent: "random(-45,45)", rotation: "random(-25,25)", duration: "random(3,6)", ease: "sine.inOut", yoyo: true, repeat: -1 });
            gsap.to(st, { opacity: "random(0.45,1)", scale: "random(0.8,1.15)", duration: "random(0.8,1.8)", ease: "sine.inOut", yoyo: true, repeat: -1 });
          });
          gsap.to(".ptk-aguja", { rotation: 360, svgOrigin: "24 24", duration: 4, ease: "none", repeat: -1 });

          // aviso de scroll: rebota suave y las flechas se encienden en cascada
          gsap.to(".ptk-scroll-in", { y: 8, duration: 0.9, ease: "sine.inOut", yoyo: true, repeat: -1 });
          gsap.timeline({ repeat: -1, repeatDelay: 0.2 })
            .fromTo(".ptk-chev", { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out", stagger: 0.18 })
            .to(".ptk-chev", { opacity: 0, y: 6, duration: 0.35, ease: "power2.in", stagger: 0.1 }, "+=0.35");

          // la ruta se dibuja sola y el reloj escondido la recorre
          gsap.fromTo(".ptk-ruta-path", { drawSVG: "0%" }, { drawSVG: "100%", duration: 3, ease: "power2.inOut" });
          gsap.to(".ptk-reloj", { autoAlpha: 1, duration: 0.6, delay: 1.2 });
          relojTween.current = gsap.to(".ptk-reloj", {
            motionPath: { path: "#ptk-ruta-path", align: "#ptk-ruta-path", alignOrigin: [0.5, 0.5] },
            duration: 18,
            ease: "none",
            repeat: -1,
            delay: 1,
          });
        });

      // letras del título: bote al pasar el mouse
      const rebota = (e) => {
        if (e.target.classList && e.target.classList.contains("ptk-c")) {
          gsap.fromTo(e.target, { y: 0, rotation: 0 }, { y: -22, rotation: gsap.utils.random(-14, 14), duration: 0.22, yoyo: true, repeat: 1, ease: "power2.out", overwrite: "auto" });
        }
      };
      titleRef.current.addEventListener("pointerover", rebota);
      return () => titleRef.current && titleRef.current.removeEventListener("pointerover", rebota);
    }, heroRef);

    return () => { splits.forEach((s) => s.revert()); ctx.revert(); };
  }, [loading]);

  /* ---------- Cursor propio + parallax del mouse en el hero (solo con mouse) ---------- */
  useEffect(() => {
    const fino = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fino || sinMovimiento()) return;
    const cur = cursorRef.current;
    const hero = heroRef.current;
    gsap.set(cur, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    const cx = gsap.quickTo(cur, "x", { duration: 0.3, ease: "power3" });
    const cy = gsap.quickTo(cur, "y", { duration: 0.3, ease: "power3" });

    const logoW = hero.querySelector(".ptk-logo-wrap");
    const lx = gsap.quickTo(logoW, "x", { duration: 1, ease: "power3" });
    const ly = gsap.quickTo(logoW, "y", { duration: 1, ease: "power3" });
    const tx = gsap.quickTo(titleRef.current, "x", { duration: 1.1, ease: "power3" });
    const estrellas = Array.from(hero.querySelectorAll(".ptk-star")).map((el) => ({
      d: Number(el.dataset.d),
      x: gsap.quickTo(el, "x", { duration: 1.2, ease: "power3" }),
      y: gsap.quickTo(el, "y", { duration: 1.2, ease: "power3" }),
    }));

    const move = (e) => {
      gsap.to(cur, { autoAlpha: 1, duration: 0.2, overwrite: "auto" });
      cx(e.clientX); cy(e.clientY);
    };
    const over = (e) => {
      const t = e.target.closest && e.target.closest("a, button, .personaje-card, .piktara-card");
      gsap.to(cur, { scale: t ? 1.9 : 1, backgroundColor: t ? "rgba(255,195,0,0.35)" : "rgba(255,195,0,0)", duration: 0.3, overwrite: "auto" });
    };
    const heroMove = (e) => {
      const r = hero.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      lx(nx * 40); ly(ny * 30);
      tx(nx * -24);
      estrellas.forEach((s) => { s.x(nx * -90 * s.d); s.y(ny * -70 * s.d); });
    };
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerover", over);
    hero.addEventListener("pointermove", heroMove);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      hero.removeEventListener("pointermove", heroMove);
    };
  }, []);

  /* ---------- Scroll: parallax, textos que se rellenan, 3D ---------- */
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const splits = [];
      const limpiezas = [];

      const ctx = gsap.context(() => {
        // barra de progreso de lectura
        gsap.fromTo(progressBarRef.current, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });

        // la navbar se esconde al bajar y vuelve al subir
        let oculta = false;
        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            const hide = self.direction === 1 && self.scroll() > 400;
            if (hide !== oculta) {
              oculta = hide;
              gsap.to(navRef.current, { yPercent: hide ? -115 : 0, duration: 0.45, ease: "power3.out", overwrite: "auto" });
            }
          },
        });

        // botón "volver arriba"
        gsap.set(topRef.current, { autoAlpha: 0, y: 24, scale: 0.6 });
        ScrollTrigger.create({
          start: 700,
          end: "max",
          onToggle: (self) => gsap.to(topRef.current, { autoAlpha: self.isActive ? 1 : 0, y: self.isActive ? 0 : 24, scale: self.isActive ? 1 : 0.6, duration: 0.5, ease: "back.out(2)", overwrite: "auto" }),
        });

        // hero: fondo y contenido con parallax
        gsap.to(bgWrapRef.current, { yPercent: 14, ease: "none", scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: true } });
        gsap.to(".ptk-hero-content", { y: -90, opacity: 0.15, ease: "none", scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom 20%", scrub: true } });
        gsap.to(".ptk-hero-logo", { rotation: 40, scale: 0.8, ease: "none", scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: true } });
        gsap.fromTo(".ptk-scroll", { autoAlpha: 1 }, { autoAlpha: 0, ease: "none", scrollTrigger: { trigger: heroRef.current, start: "top top", end: "+=220", scrub: true } });

        // ¿Qué es?: el texto se "rellena" palabra por palabra con el scroll
        const par = rootRef.current.querySelector(".ptk-fill");
        const sp = SplitText.create(par, { type: "words" });
        splits.push(sp);
        gsap.fromTo(sp.words, { opacity: 0.15 }, { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: par, start: "top 85%", end: "bottom 55%", scrub: true } });
        gsap.fromTo(".ptk-que-es-inner", { x: -40 }, { x: 40, ease: "none", scrollTrigger: { trigger: "#que-es", start: "top bottom", end: "bottom top", scrub: true } });

        gsap.utils.toArray(".ptk-reveal").forEach((el) => {
          gsap.fromTo(el, { opacity: 0, y: 70 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" } });
        });

        gsap.fromTo(".ptk-badge", { opacity: 0, y: -40, rotate: -10, scale: 0.7 }, { opacity: 1, y: 0, rotate: -1, scale: 1, duration: 0.7, ease: "back.out(2)", scrollTrigger: { trigger: ".ptk-badge", start: "top 88%", toggleActions: "play none none reverse" } });

        // Personajes: título por letras y tarjetas que giran en 3D
        const h = SplitText.create(".ptk-h-personajes", { type: "chars" });
        splits.push(h);
        gsap.fromTo(h.chars, { y: 60, opacity: 0, rotationX: -90, transformOrigin: "50% 100%" }, { y: 0, opacity: 1, rotationX: 0, duration: 0.7, stagger: 0.05, ease: "back.out(1.8)", scrollTrigger: { trigger: ".ptk-h-personajes", start: "top 88%" } });

        const cards = gsap.utils.toArray(".personaje-card");
        gsap.set(cards, { rotation: (i) => parseFloat(personajes[i].rot) });
        gsap.fromTo(cards, { opacity: 0, y: 100, rotationY: -90, transformPerspective: 900 }, { opacity: 1, y: 0, rotationY: 0, duration: 1, ease: "back.out(1.4)", stagger: 0.18, scrollTrigger: { trigger: "#personajes", start: "top 75%" } });
        gsap.utils.toArray(".personaje-card .card").forEach((c, i) => {
          gsap.to(c, { y: -7, duration: 2 + i * 0.4, ease: "sine.inOut", yoyo: true, repeat: -1, delay: i * 0.3 });
        });

        // Banner de bienvenida: la tarjeta se endereza en 3D con el scroll; la manita gira
        gsap.fromTo(".ptk-banner-card", { rotationX: 32, y: 80, opacity: 0, transformPerspective: 1000, transformOrigin: "50% 100%" }, { rotationX: 0, y: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: ".ptk-banner", start: "top 92%", end: "top 40%", scrub: 0.6 } });
        gsap.to(".ptk-banner-hand", { rotation: 360, ease: "none", scrollTrigger: { trigger: ".ptk-banner", start: "top bottom", end: "bottom top", scrub: true } });
        const bt = SplitText.create(".ptk-banner-title", { type: "words,chars", charsClass: "ptk-c" });
        splits.push(bt);
        gsap.fromTo(bt.chars, { scale: 0, rotation: () => gsap.utils.random(-90, 90), opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: 0.6, stagger: { each: 0.03, from: "center" }, ease: "back.out(2.4)", scrollTrigger: { trigger: ".ptk-banner-title", start: "top 85%" } });
        const bTitle = rootRef.current.querySelector(".ptk-banner-title");
        const bote = (e) => {
          if (e.target.classList && e.target.classList.contains("ptk-c")) gsap.fromTo(e.target, { y: 0 }, { y: -14, duration: 0.2, yoyo: true, repeat: 1, ease: "power2.out", overwrite: "auto" });
        };
        bTitle.addEventListener("pointerover", bote);
        limpiezas.push(() => bTitle.removeEventListener("pointerover", bote));

        // Origen del nombre
        gsap.utils.toArray(".ptk-origen-col").forEach((el, i) => {
          gsap.fromTo(el, { opacity: 0, x: i === 0 ? -80 : 80 }, { opacity: 1, x: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" } });
        });
        gsap.fromTo(".ptk-squig path", { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.4, ease: "power2.inOut", scrollTrigger: { trigger: ".ptk-squig", start: "top 88%" } });
        gsap.utils.toArray(".ptk-scr").forEach((el, i) => {
          gsap.to(el, { duration: 1.2, delay: i * 0.3, ease: "none", scrambleText: { text: el.dataset.t, chars: "upperCase", speed: 0.5 }, scrollTrigger: { trigger: el, start: "top 90%" } });
        });

        // Equipo: tarjetas que "caen" colgando desde arriba
        gsap.fromTo(".ptk-equipo-badge", { opacity: 0, scale: 0.5, y: -30 }, { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(2)", scrollTrigger: { trigger: ".ptk-equipo-badge", start: "top 85%" } });
        gsap.fromTo(".piktara-card", { opacity: 0, y: -60, rotationX: 80, transformOrigin: "50% 0%", transformPerspective: 900 }, { opacity: 1, y: 0, rotationX: 0, duration: 1.1, ease: "elastic.out(1, 0.6)", stagger: 0.2, scrollTrigger: { trigger: ".ptk-equipo-grid", start: "top 78%" } });
        gsap.utils.toArray(".ptk-equipo-img").forEach((el, i) => {
          gsap.to(el, { y: -9, rotation: i % 2 ? 2 : -2, duration: 2.2 + i * 0.3, ease: "sine.inOut", yoyo: true, repeat: -1 });
        });

        // Footer
        gsap.fromTo(".ptk-footer-content", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: "footer", start: "top 92%" } });
        gsap.fromTo(".social-icon-btn", { scale: 0, rotation: -90 }, { scale: 1, rotation: 0, duration: 0.7, stagger: 0.12, ease: "back.out(2.4)", scrollTrigger: { trigger: "footer", start: "top 88%" } });
      }, rootRef);

      const refrescar = () => ScrollTrigger.refresh();
      window.addEventListener("load", refrescar);

      return () => {
        window.removeEventListener("load", refrescar);
        limpiezas.forEach((f) => f());
        splits.forEach((s) => s.revert());
        ctx.revert();
      };
    });
    return () => mm.revert();
  }, []);

  /* ---------- Reloj escondido: atraparlo suelta chispas y suma puntos ---------- */
  const atraparReloj = (e) => {
    const hero = heroRef.current;
    const el = e.currentTarget;
    const b = el.getBoundingClientRect();
    const hb = hero.getBoundingClientRect();
    const cx = b.left - hb.left + b.width / 2;
    const cy = b.top - hb.top + b.height / 2;
    encontrados.current += 1;
    if (contadorRef.current) contadorRef.current.textContent = `${encontrados.current}/${META}`;
    const pip = hero.querySelectorAll(".ptk-pip")[encontrados.current - 1];
    if (pip) pip.classList.add("ptk-pip-on");
    if (sinMovimiento()) return;

    gsap.fromTo(".ptk-contador", { scale: 1 }, { scale: 1.18, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out", overwrite: "auto" });
    if (pip) gsap.fromTo(pip, { scale: 0.3 }, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.4)" });

    gsap.fromTo(el, { scale: 1 }, { scale: 1.8, duration: 0.2, yoyo: true, repeat: 1, ease: "power2.out", overwrite: "auto" });
    for (let k = 0; k < 14; k++) {
      const s = document.createElement("span");
      s.className = "ptk-chispa";
      s.textContent = "★";
      hero.appendChild(s);
      const ang = (k / 14) * Math.PI * 2;
      const dist = gsap.utils.random(70, 150);
      gsap.fromTo(s, { x: cx, y: cy, scale: 1, opacity: 1 }, { x: cx + Math.cos(ang) * dist, y: cy + Math.sin(ang) * dist, rotation: gsap.utils.random(-180, 180), scale: 0.2, opacity: 0, duration: 1, ease: "power3.out", onComplete: () => s.remove() });
    }
    const pts = document.createElement("span");
    pts.className = "ptk-chispa ptk-pts";
    pts.textContent = "+10";
    hero.appendChild(pts);
    gsap.fromTo(pts, { x: cx - 20, y: cy - 30, scale: 0.4, opacity: 1 }, { y: cy - 130, scale: 1.3, opacity: 0, duration: 1.2, ease: "power2.out", onComplete: () => pts.remove() });

    if (encontrados.current >= META) {
      // ¡los atrapó todos! el reloj desaparece y se abre el portal
      if (relojTween.current) relojTween.current.kill();
      gsap.to(el, { autoAlpha: 0, scale: 0, duration: 0.4, delay: 0.25, overwrite: "auto" });
      setPortalAbierto(true);
    } else {
      // el reloj se esconde y reaparece en otro punto de la ruta
      gsap.to(el, { autoAlpha: 0, duration: 0.2, delay: 0.3 });
      gsap.delayedCall(0.8, () => {
        if (relojTween.current) relojTween.current.progress(gsap.utils.random(0, 1));
        gsap.to(el, { autoAlpha: 1, duration: 0.4 });
      });
    }
  };

  const cerrarPortal = () => {
    gsap.to(".ptk-portal-card", { scale: 0, rotation: 10, duration: 0.3, ease: "back.in(2)" });
    gsap.to(".ptk-portal", { opacity: 0, duration: 0.3, delay: 0.15, onComplete: () => setPortalAbierto(false) });
  };

  // animación del portal
  useEffect(() => {
    if (!portalAbierto) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".ptk-portal", { opacity: 0 }, { opacity: 1, duration: 0.4 });
      gsap.fromTo(".ptk-portal-aro", { scale: 0, opacity: 0.9 }, { scale: 6, opacity: 0, duration: 1.8, stagger: 0.3, ease: "power2.out", repeat: -1 });
      gsap.fromTo(".ptk-portal-card", { scale: 0, rotation: -25, opacity: 0 }, { scale: 1, rotation: -1, opacity: 1, duration: 0.9, ease: "back.out(1.8)", delay: 0.2 });
    }, heroRef);
    return () => ctx.revert();
  }, [portalAbierto]);

  const subir = () => gsap.to(window, { duration: 1.4, ease: "power4.inOut", scrollTo: 0 });
  const irAbajo = () => gsap.to(window, { duration: 1.2, ease: "power3.inOut", scrollTo: { y: "#que-es", offsetY: 0 } });

  return (
    <div ref={rootRef} style={{ background: palette.crema, minHeight: "100vh", fontFamily: fBody, color: palette.borde, overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Quicksand:wght@500;600;700&display=swap');

        .ptk-reveal, .ptk-badge, .personaje-card, .ptk-origen-col, .ptk-equipo-badge, .piktara-card, .ptk-footer-content {
          opacity: 0;
          will-change: transform, opacity;
        }

        .ptk-c { display: inline-block; will-change: transform, opacity; }

        .home-navlink { transition: transform 0.15s ease, color 0.15s ease; }
        .home-navlink:hover { transform: scale(1.08) rotate(-1deg); color: ${palette.morado} !important; }

        /* ===== BOTÓN "NUESTRO CÓMIC": GLOBO DE DIÁLOGO ===== */
        .ptk-bubble {
          --ptk-bg: ${palette.crema};
          position: relative;
          display: inline-block;
          background: var(--ptk-bg);
          color: ${palette.morado} !important;
          font-family: ${fDisplay};
          font-size: 1.6rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          border: 5px solid ${palette.borde};
          border-radius: 30px;
          padding: 14px 44px !important;
          margin-bottom: 20px;
          box-shadow: 0 7px 0 ${palette.borde}, 0 0 0 6px ${palette.morado};
          animation: ptk-bubble-bounce 1.8s ease-in-out infinite;
          transition: background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
        }
        .ptk-bubble::before,
        .ptk-bubble::after { content: ""; position: absolute; left: 26px; border-style: solid; border-color: transparent; }
        .ptk-bubble::before { bottom: -22px; border-width: 18px 12px 0 12px; border-top-color: ${palette.borde}; }
        .ptk-bubble::after { bottom: -14px; left: 29px; border-width: 14px 9px 0 9px; border-top-color: var(--ptk-bg); transition: border-top-color 0.2s ease; }
        .ptk-bubble:hover {
          --ptk-bg: ${palette.morado};
          color: ${palette.amarillo} !important;
          animation: none;
          transform: translateY(-5px) rotate(-2deg) scale(1.08);
          box-shadow: 0 12px 0 ${palette.borde}, 0 0 0 6px ${palette.morado};
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
        }
        .ptk-bubble:active { transform: translateY(2px) scale(0.97); box-shadow: 0 2px 0 ${palette.borde}, 0 0 0 6px ${palette.morado}; }
        @keyframes ptk-bubble-bounce {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50%      { transform: translateY(-6px) rotate(1deg); }
        }

        .personaje-card { cursor: pointer; transform-style: preserve-3d; }
        .personaje-card .card { position: relative; overflow: hidden; }

        .piktara-card {
          position: relative;
          overflow: hidden;
          background: #ffffff;
          border: 4px solid ${palette.borde};
          border-radius: 28px;
          box-shadow: 0 8px 0 ${palette.borde};
          cursor: default;
          transform-style: preserve-3d;
        }

        /* brillo que sigue al mouse dentro de las tarjetas */
        .ptk-glare {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          background: radial-gradient(circle at var(--gx, 50%) var(--gy, 50%), rgba(255,255,255,0.6), rgba(255,255,255,0) 55%);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 5;
        }
        .personaje-card:hover .ptk-glare, .piktara-card:hover .ptk-glare { opacity: 1; }

        .social-icon-btn {
          width: 44px;
          height: 44px;
          background: ${palette.crema};
          border: 3px solid ${palette.borde};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${palette.morado};
          transition: background-color 0.2s ease, color 0.2s ease;
          box-shadow: 0 4px 0 ${palette.borde};
          text-decoration: none;
        }
        .social-icon-btn:hover { background: ${palette.morado}; color: ${palette.amarillo}; }

        /* ===== Hero: estrellas, ruta y reloj escondido ===== */
        .ptk-star { position: absolute; z-index: 3; pointer-events: none; will-change: transform; }
        .ptk-ruta { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 3; pointer-events: none; }
        .ptk-reloj {
          position: absolute;
          left: 0;
          top: 0;
          z-index: 6;
          width: 54px;
          height: 54px;
          padding: 0;
          border: 0;
          background: none;
          cursor: pointer;
          filter: drop-shadow(0 4px 0 ${palette.borde});
          will-change: transform;
        }
        /* contador de relojes: debajo del título, centrado */
        .ptk-contador {
          position: relative;
          z-index: 6;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          margin-top: 2rem;
          font-family: ${fDisplay};
          font-weight: 800;
          font-size: 1.05rem;
          background: ${palette.crema};
          color: ${palette.morado};
          border: 3px solid ${palette.borde};
          border-radius: 999px;
          padding: 8px 22px;
          box-shadow: 0 4px 0 ${palette.borde};
        }
        .ptk-pips { display: inline-flex; gap: 6px; }
        .ptk-pip {
          width: 16px;
          height: 16px;
          box-sizing: border-box;
          border-radius: 50%;
          border: 3px solid ${palette.borde};
          background: #ffffff;
        }
        .ptk-pip-on { background: ${palette.amarillo}; }

        /* aviso para seguir bajando */
        .ptk-scroll {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 100px;
          margin: 0 auto;
          width: max-content;
          z-index: 6;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: none;
          border: 0;
          padding: 4px 10px;
          cursor: pointer;
        }
        .ptk-scroll-in { display: flex; flex-direction: column; align-items: center; gap: 2px; }
        .ptk-scroll-txt {
          font-family: ${fDisplay};
          font-weight: 800;
          font-size: 1rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: ${palette.amarillo};
          text-shadow: 2px 2px 0 ${palette.borde}, -1px -1px 0 ${palette.borde}, 1px -1px 0 ${palette.borde}, -1px 1px 0 ${palette.borde};
          margin-bottom: 4px;
        }
        .ptk-chev { display: block; filter: drop-shadow(0 3px 0 ${palette.borde}); }
        .ptk-chev + .ptk-chev { margin-top: -6px; }

        .ptk-chispa {
          position: absolute;
          left: 0;
          top: 0;
          z-index: 7;
          pointer-events: none;
          font-size: 22px;
          line-height: 1;
          color: ${palette.amarillo};
          text-shadow: 2px 2px 0 ${palette.borde}, -1px -1px 0 ${palette.borde};
        }
        .ptk-pts { font-family: ${fDisplay}; font-weight: 800; font-size: 2rem; }

        /* ===== Portal (premio al atrapar los relojes) ===== */
        .ptk-portal {
          position: absolute;
          inset: 0;
          z-index: 9;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(58, 35, 18, 0.6);
          backdrop-filter: blur(3px);
          overflow: hidden;
        }
        .ptk-portal-aro {
          position: absolute;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          border: 5px solid ${palette.amarillo};
          pointer-events: none;
        }
        .ptk-portal-card {
          position: relative;
          max-width: 460px;
          margin: 0 20px;
          padding: 30px 28px;
          text-align: center;
          background: ${palette.morado};
          border: 5px solid ${palette.borde};
          border-radius: 28px;
          box-shadow: 0 12px 0 ${palette.borde};
        }
        .ptk-portal-card h3 { font-family: ${fDisplay}; font-weight: 800; font-size: 1.8rem; color: ${palette.amarillo}; text-shadow: 2px 2px 0 ${palette.borde}; margin: 0 0 10px; }
        .ptk-portal-card p { font-family: ${fBody}; font-weight: 600; color: #fff; line-height: 1.6; margin: 0 0 18px; }
        .ptk-portal-btn {
          display: inline-block;
          font-family: ${fDisplay};
          font-weight: 800;
          font-size: 1.2rem;
          text-transform: uppercase;
          text-decoration: none;
          color: ${palette.morado};
          background: ${palette.amarillo};
          border: 4px solid ${palette.borde};
          border-radius: 999px;
          padding: 10px 28px;
          box-shadow: 0 6px 0 ${palette.borde};
          transition: transform 0.2s ease;
        }
        .ptk-portal-btn:hover { transform: translateY(-3px) scale(1.05); }
        .ptk-portal-seguir { display: block; margin: 16px auto 0; background: none; border: 0; color: #fff; font-family: ${fBody}; font-weight: 700; text-decoration: underline; cursor: pointer; }

        /* ===== Cursor propio ===== */
        .ptk-cursor {
          position: fixed;
          left: 0;
          top: 0;
          width: 34px;
          height: 34px;
          border: 2.5px solid ${palette.morado};
          border-radius: 50%;
          pointer-events: none;
          z-index: 11000;
          display: none;
        }
        @media (hover: hover) and (pointer: fine) { .ptk-cursor { display: block; } }

        /* ===== Volver arriba ===== */
        .ptk-top {
          position: fixed;
          right: 22px;
          bottom: 22px;
          z-index: 900;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: ${palette.amarillo};
          color: ${palette.morado};
          border: 4px solid ${palette.borde};
          box-shadow: 0 6px 0 ${palette.borde};
          font-family: ${fDisplay};
          font-weight: 800;
          font-size: 1.5rem;
          line-height: 1;
          cursor: pointer;
        }
        .ptk-top:hover { background: ${palette.morado}; color: ${palette.amarillo}; }

        @media (prefers-reduced-motion: reduce) {
          .ptk-reveal, .ptk-badge, .personaje-card, .ptk-origen-col, .ptk-equipo-badge, .piktara-card, .ptk-footer-content { opacity: 1 !important; }
          .ptk-bubble { animation: none; }
          .ptk-reloj, .ptk-ruta, .ptk-cursor { display: none !important; }
          .ptk-top { opacity: 1; }
        }
      `}</style>

      <div ref={cursorRef} className="ptk-cursor" aria-hidden="true" />

      {/* Barra de progreso de lectura, fija arriba de todo */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "5px", zIndex: 10000, background: "rgba(58, 35, 18, 0.15)" }}>
        <div
          ref={progressBarRef}
          style={{ height: "100%", width: "100%", background: `linear-gradient(90deg, ${palette.amarillo}, ${palette.morado})`, transformOrigin: "left center", transform: "scaleX(0)" }}
        />
      </div>

      <button ref={topRef} type="button" className="ptk-top" onClick={subir} aria-label="Volver arriba">↑</button>

      {/* LOADER DE ENTRADA (portal del tiempo) */}
      {overlayOn && (
        <PiktaraLoader
          onReveal={() => setLoading(false)}
          onDone={() => { setOverlayOn(false); ScrollTrigger.refresh(); }}
        />
      )}

      {/* NAVBAR */}
      <nav
        ref={navRef}
        className="navbar navbar-expand-lg px-4 px-md-5"
        style={{ background: palette.amarillo, borderBottom: `6px solid ${palette.morado}`, position: "sticky", top: 0, zIndex: 30, minHeight: "125px", paddingTop: "28px", paddingBottom: "30px", overflow: "visible" }}
      >
        <Link to="/" className="navbar-brand me-5">
          <img src="./MANOLOGO.svg" alt="Piktara" style={{ height: "70px", filter: `drop-shadow(0 3px 0 ${palette.borde})` }} />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuHome">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-center" id="menuHome">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <Link to="/nuestro-comic" className="ptk-bubble nav-link">Nuestro Cómic</Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* HERO */}
      <div
        ref={heroRef}
        className="position-relative overflow-hidden d-flex align-items-center justify-content-center w-100"
        style={{ minHeight: "100vh", paddingTop: "8rem", paddingBottom: "8rem", borderBottom: `6px solid ${palette.borde}` }}
      >
        {/* Fondo: capas con crossfade y zoom (GSAP) dentro de un contenedor con parallax */}
        <div ref={bgWrapRef} style={{ position: "absolute", left: 0, top: "-20%", width: "100%", height: "140%", zIndex: 1 }}>
          {backgroundImages.map((bgImg, index) => (
            <div
              key={index}
              ref={(el) => (bgLayersRef.current[index] = el)}
              style={{ position: "absolute", inset: 0, backgroundImage: `url('${bgImg}')`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", opacity: index === 0 ? 1 : 0, willChange: "transform, opacity" }}
            />
          ))}
        </div>

        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.45)", zIndex: 2 }} />

        {/* Ruta del reloj escondido */}
        <svg className="ptk-ruta" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
          <path id="ptk-ruta-path" className="ptk-ruta-path" d="M-40,470 C150,90 330,640 520,300 S860,60 1040,330" fill="none" stroke="rgba(255,195,0,0.35)" strokeWidth="3" strokeLinecap="round" />
        </svg>

        {ESTRELLAS.map((s, i) => (
          <svg key={i} className="ptk-star" data-d={s.d} viewBox="0 0 24 24" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s }} aria-hidden="true">
            <path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18 22l-6-3.6L6 22l1.5-7.2L2 10l7.1-1.1z" fill={palette.amarillo} stroke={palette.borde} strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
        ))}

        <button type="button" className="ptk-reloj" onClick={atraparReloj} aria-label="Reloj escondido: haz clic para atraparlo">
          <svg viewBox="0 0 48 48" width="54" height="54" aria-hidden="true">
            <circle cx="24" cy="24" r="20" fill={palette.crema} stroke={palette.borde} strokeWidth="3" />
            <circle cx="24" cy="5" r="3" fill={palette.amarillo} stroke={palette.borde} strokeWidth="2" />
            <g className="ptk-aguja"><path d="M24 11v13l8 5" stroke={palette.morado} strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>
          </svg>
        </button>

        {portalAbierto && (
          <div className="ptk-portal">
            <span className="ptk-portal-aro" /><span className="ptk-portal-aro" /><span className="ptk-portal-aro" />
            <div className="ptk-portal-card">
              <h3>¡Portal del tiempo abierto!</h3>
              <p>Atrapaste los {META} relojes escondidos. Ahora sí: cruza al otro lado y empieza la aventura.</p>
              <Link to="/nuestro-comic" className="ptk-portal-btn">Entrar al cómic</Link>
              <button type="button" className="ptk-portal-seguir" onClick={cerrarPortal}>Seguir explorando</button>
            </div>
          </div>
        )}

        <div className="container text-center position-relative py-5 ptk-hero-content" style={{ zIndex: 4 }}>
          <div className="mx-auto px-3" style={{ maxWidth: "1150px" }}>
            <div className="mb-4 ptk-logo-wrap">
              <img className="ptk-hero-logo" src="./MANOLOGO.svg" alt="Isotipo Mano" style={{ height: "210px", objectFit: "contain", filter: `drop-shadow(0 8px 0 ${palette.borde})` }} />
            </div>

            <h1
              ref={titleRef}
              style={{
                fontFamily: fDisplay,
                fontSize: "clamp(3.2rem, 6.8vw, 5.8rem)",
                fontWeight: 800,
                color: palette.amarillo,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                lineHeight: 1.12,
                margin: 0,
                textShadow: `5px 5px 0 ${palette.borde}, -4px -4px 0 ${palette.borde}, 4px -4px 0 ${palette.borde}, -4px 4px 0 ${palette.borde}, 0 10px 25px rgba(0,0,0,0.8)`,
              }}
            >
              {HERO_TITLE}
            </h1>

            <div className="ptk-contador">
              <span>⏱ Atrapa los relojes:</span>
              <span className="ptk-pips" aria-hidden="true">
                {Array.from({ length: META }).map((_, i) => <span className="ptk-pip" key={i} />)}
              </span>
              <span ref={contadorRef}>{`0/${META}`}</span>
            </div>
          </div>
        </div>

        <button type="button" className="ptk-scroll" onClick={irAbajo} aria-label="Seguir bajando">
          <span className="ptk-scroll-in">
            <span className="ptk-scroll-txt">¡Sigue bajando!</span>
            {[0, 1, 2].map((i) => (
              <svg className="ptk-chev" key={i} width="38" height="22" viewBox="0 0 38 22" aria-hidden="true">
                <path d="M4 4 L19 18 L34 4" fill="none" stroke={palette.amarillo} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ))}
          </span>
        </button>

        <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "30px", background: palette.lavanda, borderTop: `4px solid ${palette.borde}`, zIndex: 5 }} />
      </div>

      {/* ¿QUÉ ES? */}
      <section id="que-es" className="py-5 overflow-hidden" style={{ background: palette.morado, position: "relative", borderBottom: `6px solid ${palette.borde}`, paddingTop: "4rem" }}>
        <div className="container py-4 text-center ptk-que-es-inner">
          <div className="row justify-content-center">
            <div className="col-md-9">
              <div
                className="ptk-badge"
                style={{ display: "inline-block", background: palette.amarillo, border: `4px solid ${palette.borde}`, borderRadius: "24px", padding: "10px 32px", marginBottom: "1.5rem", boxShadow: `0 6px 0 ${palette.borde}` }}
              >
                <h2 style={{ fontFamily: fDisplay, fontSize: "1.3rem", color: palette.morado, fontWeight: 800, margin: 0, textTransform: "uppercase" }}>
                  ¿Qué es un cómic digital interactivo?
                </h2>
              </div>
              <p className="ptk-fill" style={{ fontFamily: fBody, fontSize: "1.15rem", lineHeight: 1.8, color: palette.crema, fontWeight: 600 }}>
                Un cómic digital interactivo es una nueva forma de contar historias que combina ilustraciones,
                texto, animaciones y decisiones del lector. A diferencia de un cómic tradicional, el lector puede
                tomar decisiones que afectan el desarrollo de la narrativa, convirtiendo la lectura en una
                experiencia inmersiva y personalizada.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PERSONAJES */}
      <section id="personajes" className="py-5 overflow-hidden" style={{ background: palette.crema }}>
        <div className="text-center mb-5">
          <h2
            className="ptk-h-personajes"
            style={{ display: "inline-block", fontFamily: fDisplay, fontSize: "1.8rem", color: palette.morado, textTransform: "uppercase", fontWeight: 800, letterSpacing: "0.04em", borderBottom: `5px solid ${palette.amarillo}`, paddingBottom: "6px" }}
          >
            Personajes
          </h2>
        </div>
        <div className="container">
          <div className="row justify-content-center g-4">
            {personajes.map((p, i) => (
              <div
                key={i}
                className="col-6 col-md-4 text-center personaje-card"
                onClick={(e) => { setOrigen(e.currentTarget.querySelector("img")); setPersonajeActivo(p); }}
                {...personajeTilt}
              >
                <div className="card h-100" style={{ borderRadius: "24px", border: `5px solid ${palette.morado}`, padding: "14px", boxShadow: `0 8px 0 ${palette.borde}22`, background: "#fff" }}>
                  <img
                    src={p.img}
                    alt={p.nombre}
                    className="rounded-4 mb-3"
                    style={{ width: "100%", aspectRatio: "3/4", objectFit: "contain", objectPosition: "top", background: "#fff", border: `3px solid ${palette.amarillo}` }}
                  />
                  <p style={{ fontFamily: fDisplay, fontSize: "1.1rem", letterSpacing: "0.08em", color: palette.morado, textTransform: "uppercase", fontWeight: 800, margin: 0 }}>
                    {p.nombre}
                  </p>
                  <span className="ptk-glare" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PersonajeModal personaje={personajeActivo} origen={origen} onClose={() => setPersonajeActivo(null)} />

      {/* BANNER DE BIENVENIDA */}
      <div className="py-5 px-3 overflow-hidden ptk-banner" style={{ background: palette.crema, borderBottom: `5px solid ${palette.borde}` }}>
        <div className="container text-center py-3 position-relative" style={{ maxWidth: "850px" }}>
          <div
            className="p-4 p-md-5 position-relative ptk-banner-card"
            style={{ background: "#ffffff", borderRadius: "36px", border: `6px solid ${palette.borde}`, boxShadow: `0 10px 0 ${palette.borde}` }}
          >
            <div className="mb-4">
              <img
                className="ptk-banner-hand"
                src="/MANOLOGO.svg"
                alt="Isotipo Mano"
                style={{ height: "90px", objectFit: "contain", filter: `drop-shadow(0 4px 0 ${palette.borde})` }}
              />
            </div>

            <h2
              className="ptk-banner-title"
              style={{ fontFamily: fDisplay, fontSize: "2.5rem", fontWeight: 800, color: palette.morado, letterSpacing: "0.05em", textShadow: `0 3px 0 ${palette.amarillo}`, marginBottom: "1rem" }}
            >
              BIENVENIDOS A PIKTARA
            </h2>

            <p className="ptk-reveal" style={{ fontFamily: fBody, fontSize: "1.05rem", lineHeight: 1.8, color: palette.borde, fontWeight: 600, margin: 0 }}>
              Piktara es una marca creativa que une arte, historia y narrativa digital. Su esencia nace de la
              inspiración en lo místico y antiguo, transformado en experiencias modernas como cómics interactivos y
              proyectos visuales llenos de imaginación.
            </p>
          </div>
        </div>
      </div>

      {/* ORIGEN DEL NOMBRE */}
      <section className="py-5 px-3 overflow-hidden" style={{ background: palette.crema }}>
        <div className="container">
          <div
            className="row align-items-center g-4 p-4 p-md-5"
            style={{ background: "#ffffff", borderRadius: "32px", border: `5px solid ${palette.borde}`, boxShadow: `0 8px 0 ${palette.borde}`, position: "relative" }}
          >
            <div className="col-md-5 text-center text-md-start ptk-origen-col">
              <h2 style={{ fontFamily: fDisplay, fontSize: "1.8rem", fontWeight: 800, color: palette.morado, lineHeight: 1.3, margin: 0 }}>
                ¿Cómo surge el nombre PIKTARA?
              </h2>
              <svg className="ptk-squig" viewBox="0 0 300 20" width="220" height="16" aria-hidden="true" style={{ display: "block", marginTop: "6px" }}>
                <path d="M4 12 C 30 0, 50 22, 80 10 S 130 0, 160 12 S 220 22, 250 10 S 285 4, 296 12" fill="none" stroke={palette.amarillo} strokeWidth="6" strokeLinecap="round" />
              </svg>
            </div>
            <div className="col-md-7 ptk-origen-col">
              <p style={{ fontFamily: fBody, fontSize: "1rem", lineHeight: 1.8, color: palette.borde, fontWeight: 600, margin: 0 }}>
                Surge de la conexión con la historia antigua:
                <br />
                <br />
                <strong>"<span className="ptk-scr" data-t="PIK">PIK</span>":</strong> Proviene de los pictogramas y jeroglíficos egipcios, entendiendo la
                escritura como un arte visual y sagrado.
                <br />
                <strong>"<span className="ptk-scr" data-t="TARA">TARA</span>":</strong> Se relaciona con el concepto de las estrellas y astros que guiaban la
                navegación y el tiempo en las civilizaciones antiguas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* EQUIPO */}
      <section className="py-5 px-3 overflow-hidden" style={{ background: palette.amarillo, borderTop: `5px solid ${palette.borde}`, borderBottom: `6px solid ${palette.borde}` }}>
        <div className="container">
          <div className="text-center mb-5">
            <span
              className="ptk-equipo-badge"
              style={{ fontFamily: fDisplay, fontSize: "2rem", fontWeight: 800, background: palette.morado, color: "#ffffff", padding: "8px 30px", borderRadius: "999px", border: `4px solid ${palette.borde}`, boxShadow: `0 6px 0 ${palette.borde}`, display: "inline-block" }}
            >
              NUESTRO EQUIPO
            </span>
          </div>

          <div className="row justify-content-center g-4 ptk-equipo-grid">
            {equipo.map((miembro, i) => (
              <div key={i} className="col-12 col-md-4 d-flex">
                <div className="piktara-card text-center p-4 w-100 d-flex flex-column align-items-center position-relative" {...equipoTilt}>
                  <div className="mb-3 w-100 ptk-equipo-img" style={{ height: "200px" }}>
                    <img src={miembro.img} alt={miembro.nombre} style={{ width: "100%", height: "100%", objectFit: "contain", filter: `drop-shadow(0 5px 0 ${palette.borde})` }} />
                  </div>
                  <h3 style={{ fontFamily: fDisplay, fontSize: "1.3rem", fontWeight: 800, color: palette.morado, marginTop: "10px" }}>{miembro.nombre}</h3>
                  <p style={{ fontFamily: fBody, fontSize: "0.92rem", lineHeight: 1.6, color: palette.borde, fontWeight: 600, margin: 0 }}>{miembro.desc}</p>
                  <span className="ptk-glare" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-5" style={{ background: palette.amarillo, borderTop: `6px solid ${palette.morado}` }}>
        <div className="container ptk-footer-content">
          <div className="row justify-content-between align-items-center gy-4">
            <div className="col-md-3 text-center text-md-start">
              <img src="/nombresolo.svg" alt="Piktara" style={{ width: "150px", filter: `drop-shadow(0 3px 0 ${palette.borde})` }} />
            </div>

            <div className="col-md-4 text-center">
              <p className="mb-2" style={{ fontFamily: fDisplay, fontSize: "1rem", color: palette.morado, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                ACERCA DE
              </p>
              <div className="d-flex justify-content-center gap-4">
                <Link to="/nuestro-comic" style={{ fontFamily: fBody, color: palette.borde, textDecoration: "none", fontWeight: 700, fontSize: "0.95rem" }}>
                  Nuestro Proyecto
                </Link>
              </div>
            </div>

            <div className="col-md-3 text-center text-md-end">
              <p className="mb-2" style={{ fontFamily: fDisplay, fontSize: "1rem", color: palette.morado, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                REDES SOCIALES
              </p>
              <div className="d-flex gap-3 justify-content-center justify-content-md-end">
                <a href="https://www.tiktok.com/@piktaraoficial" target="_blank" rel="noreferrer" className="social-icon-btn" title="TikTok" {...iman}>
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z"/>
                  </svg>
                </a>

                <a href="https://www.instagram.com/piktaraoficial/" target="_blank" rel="noreferrer" className="social-icon-btn" title="Instagram" {...iman}>
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}