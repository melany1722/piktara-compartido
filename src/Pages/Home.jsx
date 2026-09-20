import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

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

// Tilt 3D suave sobre una tarjeta al mover el mouse encima (GSAP quickTo)
const useTiltHandlers = (maxTilt = 10) => {
  const onEnter = (e) => {
    gsap.to(e.currentTarget, { scale: 1.05, duration: 0.35, ease: "power2.out" });
  };
  const onMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(card, {
      rotateY: px * maxTilt,
      rotateX: py * -maxTilt,
      transformPerspective: 800,
      duration: 0.4,
      ease: "power2.out",
    });
  };
  const onLeave = (e) => {
    gsap.to(e.currentTarget, {
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.5)",
    });
  };
  return { onMouseEnter: onEnter, onMouseMove: onMove, onMouseLeave: onLeave };
};

// --- MODAL DE PERSONAJE ---
const PersonajeModal = ({ personaje, onClose }) => {
  const overlayRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    if (!personaje) return;
    const tl = gsap.timeline();
    tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power1.out" })
      .fromTo(
        cardRef.current,
        { scale: 0.4, opacity: 0, rotate: -10, y: 50 },
        { scale: 1, opacity: 1, rotate: -0.5, y: 0, duration: 0.55, ease: "back.out(1.8)" },
        "-=0.1"
      )
      .fromTo(".ptk-modal-img", { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)" }, "-=0.3")
      .fromTo(".ptk-modal-title", { opacity: 0, y: -18 }, { opacity: 1, y: 0, duration: 0.35 }, "-=0.2")
      .fromTo(".ptk-modal-desc", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.35 }, "-=0.15")
      .fromTo(".ptk-modal-fn", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.35 }, "-=0.15");
    return () => tl.kill();
  }, [personaje]);

  if (!personaje) return null;

  return (
    <div
      ref={overlayRef}
      onClick={onClose}
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
          onClick={onClose}
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
          style={{
            fontFamily: fBody,
            fontSize: "1.02rem",
            lineHeight: 1.6,
            color: "#ffffff",
            fontWeight: 600,
            marginBottom: "18px",
          }}
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
            transform: "rotate(1deg)",
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
          <p
            style={{
              fontFamily: fBody,
              fontSize: "0.92rem",
              fontWeight: 600,
              margin: 0,
              lineHeight: 1.5,
              color: "#ffffff",
            }}
          >
            {personaje.funcion}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [personajeActivo, setPersonajeActivo] = useState(null);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  const rootRef = useRef(null);
  const navRef = useRef(null);
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const loaderOverlayRef = useRef(null);
  const loaderLogoRef = useRef(null);
  const loaderGlowRef = useRef(null);
  const progressBarRef = useRef(null);
  const bgLayersRef = useRef([]);
  const location = useLocation();

  const personajeTilt = useTiltHandlers(8);
  const equipoTilt = useTiltHandlers(12);

  // Actualizado a fondo111.svg
  const backgroundImages = ["./ultimofondo (1).svg", "./fondo111.svg"];

  // Loader de apertura: logo con pop elástico + halo, y un iris-wipe (clip-path)
  // que abre la escena. El timeline es la única fuente de verdad del timing:
  // cuando termina, se quita el overlay (nada de setTimeout desacoplado).
  useEffect(() => {
    const overlay = loaderOverlayRef.current;
    const logo = loaderLogoRef.current;
    const glow = loaderGlowRef.current;
    if (!overlay || !logo || !glow) return;

    const clip = { r: 150 };
    overlay.style.clipPath = `circle(${clip.r}% at 50% 50%)`;

    const tl = gsap.timeline({ onComplete: () => setLoading(false) });
    tl.fromTo(glow, { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 0.55, duration: 0.7, ease: "power2.out" })
      .fromTo(
        logo,
        { scale: 0.2, opacity: 0, rotate: -18 },
        { scale: 1, opacity: 1, rotate: 0, duration: 0.8, ease: "back.out(1.9)" },
        "-=0.5"
      )
      .to(logo, { y: -8, duration: 0.6, ease: "sine.inOut", yoyo: true, repeat: 1 })
      .to(logo, { scale: 1.5, opacity: 0, duration: 0.55, ease: "power2.in" }, "wipe")
      .to(glow, { opacity: 0, scale: 1.6, duration: 0.55, ease: "power2.in" }, "wipe")
      .to(
        clip,
        {
          r: 0,
          duration: 1,
          ease: "power3.inOut",
          onUpdate: () => {
            overlay.style.clipPath = `circle(${clip.r}% at 50% 50%)`;
          },
        },
        "wipe"
      );

    return () => tl.kill();
  }, []);

  // Slider automático configurado a 6 segundos (6000 ms)
  useEffect(() => {
    const bgTimer = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex === 0 ? 1 : 0));
    }, 6000);
    return () => clearInterval(bgTimer);
  }, []);

  useEffect(() => {
    if (location.state?.scrollTo) {
      const targetId = location.state.scrollTo;
      const t = setTimeout(() => {
        const elem = document.getElementById(targetId);
        if (elem) {
          gsap.to(window, { duration: 1.1, ease: "power2.inOut", scrollTo: { y: elem, offsetY: 90 } });
        }
      }, 300);
      return () => clearTimeout(t);
    }
  }, [location]);

  // Navbar: entra deslizándose desde arriba apenas monta la página
  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -90, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.6)", delay: 0.1 }
    );
  }, []);

  // Hero: logo + título se revelan palabra por palabra justo cuando termina el loader
  useEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "back.out(1.7)" } });
      tl.fromTo(".ptk-hero-logo", { scale: 0, opacity: 0, rotate: -15 }, { scale: 1, opacity: 1, rotate: 0, duration: 0.9 })
        .fromTo(
          ".ptk-word",
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.06, ease: "power3.out" },
          "-=0.45"
        )
        .add(() => {
          gsap.to(titleRef.current, { y: -8, duration: 1.8, ease: "sine.inOut", yoyo: true, repeat: -1 });
        });
    }, heroRef);
    return () => ctx.revert();
  }, [loading]);

  // Resto de la página: parallax y revelados al hacer scroll
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Barra de progreso fija arriba: se llena de 0 a 100% con todo el documento
      gsap.fromTo(
        progressBarRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
        }
      );

      // Parallax suave del fondo del hero al hacer scroll
      gsap.to(bgLayersRef.current, {
        yPercent: 18,
        ease: "none",
        scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: true },
      });

      gsap.fromTo(
        ".ptk-que-es-inner",
        { x: -60 },
        {
          x: 60,
          ease: "none",
          scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: true },
        }
      );

      gsap.utils.toArray(".ptk-reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 70 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" },
          }
        );
      });

      gsap.fromTo(
        ".ptk-badge",
        { opacity: 0, y: -40, rotate: -10, scale: 0.7 },
        {
          opacity: 1,
          y: 0,
          rotate: -1,
          scale: 1,
          duration: 0.7,
          ease: "back.out(2)",
          scrollTrigger: { trigger: ".ptk-badge", start: "top 88%", toggleActions: "play none none reverse" },
        }
      );

      gsap.fromTo(
        ".personaje-card",
        { opacity: 0, y: 90, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.6)",
          stagger: 0.18,
          scrollTrigger: { trigger: "#personajes", start: "top 75%" },
        }
      );

      gsap.utils.toArray(".ptk-origen-col").forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, x: i === 0 ? -80 : 80 },
          {
            opacity: 1,
            x: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" },
          }
        );
      });

      gsap.fromTo(
        ".ptk-equipo-badge",
        { opacity: 0, scale: 0.5, y: -30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          ease: "back.out(2)",
          scrollTrigger: { trigger: ".ptk-equipo-badge", start: "top 85%" },
        }
      );

      gsap.fromTo(
        ".piktara-card",
        { opacity: 0, y: 90, scale: 0.85 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.6)",
          stagger: 0.2,
          scrollTrigger: { trigger: ".ptk-equipo-grid", start: "top 78%" },
        }
      );

      gsap.fromTo(
        ".ptk-footer-content",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: "footer", start: "top 92%" },
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} style={{ background: palette.crema, minHeight: "100vh", fontFamily: fBody, color: palette.borde, overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Quicksand:wght@500;600;700&display=swap');

        .ptk-reveal, .ptk-badge, .personaje-card, .ptk-origen-col, .ptk-equipo-badge, .piktara-card, .ptk-footer-content {
          opacity: 0;
          will-change: transform, opacity;
        }

        .ptk-word { display: inline-block; will-change: transform, opacity; }

        .home-navlink { transition: transform 0.15s ease, color 0.15s ease; }
        .home-navlink:hover { transform: scale(1.08) rotate(-1deg); color: ${palette.morado} !important; }

        .personaje-card { cursor: pointer; transform-style: preserve-3d; }

        .piktara-card {
          background: #ffffff;
          border: 4px solid ${palette.borde};
          border-radius: 28px;
          box-shadow: 0 8px 0 ${palette.borde};
          cursor: default;
          transform-style: preserve-3d;
        }

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
          transition: transform 0.2s ease, background-color 0.2s ease, color 0.2s ease;
          box-shadow: 0 4px 0 ${palette.borde};
          text-decoration: none;
        }
        .social-icon-btn:hover {
          transform: translateY(-4px) scale(1.15);
          background: ${palette.morado};
          color: ${palette.amarillo};
        }
      `}</style>

      {/* Barra de progreso de lectura, fija arriba de todo */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "5px", zIndex: 10000, background: "rgba(58, 35, 18, 0.15)" }}>
        <div
          ref={progressBarRef}
          style={{
            height: "100%",
            width: "100%",
            background: `linear-gradient(90deg, ${palette.amarillo}, ${palette.morado})`,
            transformOrigin: "left center",
            transform: "scaleX(0)",
          }}
        />
      </div>

      {loading && (
        <div
          ref={loaderOverlayRef}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            overflow: "hidden",
            background: palette.morado,
          }}
        >
          <div
            ref={loaderGlowRef}
            style={{
              position: "absolute",
              width: "440px",
              height: "440px",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${palette.amarillo} 0%, rgba(255,195,0,0) 70%)`,
              opacity: 0,
            }}
          />
          <img
            ref={loaderLogoRef}
            src="./MANOLOGO.svg"
            alt="Piktara Logo"
            style={{
              position: "relative",
              width: "260px",
              height: "auto",
              opacity: 0,
              filter: `drop-shadow(0 8px 0px ${palette.borde}) drop-shadow(0 15px 25px rgba(58, 35, 18, 0.5))`,
            }}
          />
        </div>
      )}

      {/* NAVBAR */}
      <nav
        ref={navRef}
        className="navbar navbar-expand-lg px-4 px-md-5"
        style={{
          background: palette.amarillo,
          borderBottom: `6px solid ${palette.morado}`,
          position: "sticky",
          top: 0,
          zIndex: 30,
        }}
      >
        <Link to="/" className="navbar-brand me-5">
          <img
            src="./MANOLOGO.svg"
            alt="Piktara"
            style={{ height: "55px", filter: `drop-shadow(0 3px 0 ${palette.borde})` }}
          />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuHome">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-center" id="menuHome">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <Link
                to="/nuestro-comic"
                className="home-navlink nav-link"
                style={{
                  fontFamily: fDisplay,
                  fontSize: "1.05rem",
                  letterSpacing: "0.04em",
                  color: palette.borde,
                  fontWeight: 800,
                  textTransform: "uppercase",
                }}
              >
                Nuestro Cómic
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* HERO SECTION CON SLIDER DE IMÁGENES Y ANIMACIÓN DE ESCALA (1.5) */}
      <div
        ref={heroRef}
        className="position-relative overflow-hidden d-flex align-items-center justify-content-center w-100"
        style={{
          minHeight: "100vh",
          paddingTop: "8rem",
          paddingBottom: "8rem",
          borderBottom: `6px solid ${palette.borde}`
        }}
      >
        {/* Capas de imágenes del Slider con transición y escalado a 1.5 */}
        {backgroundImages.map((bgImg, index) => (
          <div
            key={index}
            ref={(el) => (bgLayersRef.current[index] = el)}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage: `url('${bgImg}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              opacity: currentBgIndex === index ? 1 : 0,
              transform: currentBgIndex === index ? "scale(1.5)" : "scale(1)",
              transition: "opacity 1.5s ease-in-out, transform 2s cubic-bezier(0.25, 1, 0.5, 1)",
              zIndex: 1,
            }}
          />
        ))}

        {/* Capa oscura semitransparente para mantener contraste con los textos */}
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.45)", zIndex: 2 }} />

        <div className="container text-center position-relative py-5" style={{ zIndex: 3 }}>
          <div className="mx-auto px-3" style={{ maxWidth: "1150px" }}>
            <div className="mb-4">
              <img
                className="ptk-hero-logo"
                src="./MANOLOGO.svg"
                alt="Isotipo Mano"
                style={{
                  height: "210px",
                  objectFit: "contain",
                  filter: `drop-shadow(0 8px 0 ${palette.borde})`,
                }}
              />
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
              {HERO_TITLE.split(" ").map((word, i, arr) => (
                <span key={i} className="ptk-word">
                  {word}
                  {i < arr.length - 1 ? " " : ""}
                </span>
              ))}
            </h1>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "30px",
            background: palette.lavanda,
            borderTop: `4px solid ${palette.borde}`,
            zIndex: 5
          }}
        />
      </div>

      {/* SECCIÓN: ¿QUÉ ES? */}
      <section
        id="que-es"
        className="py-5 overflow-hidden"
        style={{ background: palette.morado, position: "relative", borderBottom: `6px solid ${palette.borde}` }}
      >
        <div className="container py-4 text-center ptk-que-es-inner">
          <div className="row justify-content-center">
            <div className="col-md-9">
              <div
                className="ptk-badge"
                style={{
                  display: "inline-block",
                  background: palette.amarillo,
                  border: `4px solid ${palette.borde}`,
                  borderRadius: "24px",
                  padding: "10px 32px",
                  marginBottom: "1.5rem",
                  boxShadow: `0 6px 0 ${palette.borde}`,
                }}
              >
                <h2
                  style={{
                    fontFamily: fDisplay,
                    fontSize: "1.3rem",
                    color: palette.morado,
                    fontWeight: 800,
                    margin: 0,
                    textTransform: "uppercase",
                  }}
                >
                  ¿Qué es un cómic digital interactivo?
                </h2>
              </div>
              <p
                className="ptk-reveal"
                style={{ fontFamily: fBody, fontSize: "1.15rem", lineHeight: 1.8, color: palette.crema, fontWeight: 600 }}
              >
                Un cómic digital interactivo es una nueva forma de contar historias que combina ilustraciones,
                texto, animaciones y decisiones del lector. A diferencia de un cómic tradicional, el lector puede
                tomar decisiones que afectan el desarrollo de la narrativa, convirtiendo la lectura en una
                experiencia inmersiva y personalizada.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN: PERSONAJES */}
      <section id="personajes" className="py-5 overflow-hidden" style={{ background: palette.crema }}>
        <div className="text-center mb-5 ptk-reveal">
          <h2
            style={{
              display: "inline-block",
              fontFamily: fDisplay,
              fontSize: "1.8rem",
              color: palette.morado,
              textTransform: "uppercase",
              fontWeight: 800,
              letterSpacing: "0.04em",
              borderBottom: `5px solid ${palette.amarillo}`,
              paddingBottom: "6px",
            }}
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
                style={{ transform: `rotate(${p.rot})` }}
                onClick={() => setPersonajeActivo(p)}
                {...personajeTilt}
              >
                <div
                  className="card h-100"
                  style={{
                    borderRadius: "24px",
                    border: `5px solid ${palette.morado}`,
                    padding: "14px",
                    boxShadow: `0 8px 0 ${palette.borde}22`,
                    background: "#fff",
                  }}
                >
                  <img
                    src={p.img}
                    alt={p.nombre}
                    className="rounded-4 mb-3"
                    style={{
                      width: "100%",
                      aspectRatio: "3/4",
                      objectFit: "contain",
                      objectPosition: "top",
                      background: "#fff",
                      border: `3px solid ${palette.amarillo}`,
                    }}
                  />
                  <p
                    style={{
                      fontFamily: fDisplay,
                      fontSize: "1.1rem",
                      letterSpacing: "0.08em",
                      color: palette.morado,
                      textTransform: "uppercase",
                      fontWeight: 800,
                      margin: 0,
                    }}
                  >
                    {p.nombre}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PersonajeModal personaje={personajeActivo} onClose={() => setPersonajeActivo(null)} />

      {/* BANNER PRINCIPAL DE BIENVENIDA A PIKTARA */}
      <div className="py-5 px-3 overflow-hidden" style={{ background: palette.crema, borderBottom: `5px solid ${palette.borde}` }}>
        <div className="container text-center py-3 position-relative" style={{ maxWidth: "850px" }}>
          <div
            className="p-4 p-md-5 position-relative ptk-reveal"
            style={{
              background: "#ffffff",
              borderRadius: "36px",
              border: `6px solid ${palette.borde}`,
              boxShadow: `0 10px 0 ${palette.borde}`,
            }}
          >
            <div className="mb-4">
              <img
                src="/MANOLOGO.svg"
                alt="Isotipo Mano"
                style={{
                  height: "90px",
                  objectFit: "contain",
                  filter: `drop-shadow(0 4px 0 ${palette.borde})`,
                }}
              />
            </div>

            <h2
              style={{
                fontFamily: fDisplay,
                fontSize: "2.5rem",
                fontWeight: 800,
                color: palette.morado,
                letterSpacing: "0.05em",
                textShadow: `0 3px 0 ${palette.amarillo}`,
                marginBottom: "1rem",
              }}
            >
              BIENVENIDOS A PIKTARA
            </h2>

            <p
              style={{ fontFamily: fBody, fontSize: "1.05rem", lineHeight: 1.8, color: palette.borde, fontWeight: 600, margin: 0 }}
            >
              Piktara es una marca creativa que une arte, historia y narrativa digital. Su esencia nace de la
              inspiración en lo místico y antiguo, transformado en experiencias modernas como cómics interactivos y
              proyectos visuales llenos de imaginación.
            </p>
          </div>
        </div>
      </div>

      {/* SECCIÓN ORIGEN DEL NOMBRE */}
      <section className="py-5 px-3 overflow-hidden" style={{ background: palette.crema }}>
        <div className="container">
          <div
            className="row align-items-center g-4 p-4 p-md-5"
            style={{
              background: "#ffffff",
              borderRadius: "32px",
              border: `5px solid ${palette.borde}`,
              boxShadow: `0 8px 0 ${palette.borde}`,
              position: "relative",
            }}
          >
            <div className="col-md-5 text-center text-md-start ptk-origen-col">
              <h2 style={{ fontFamily: fDisplay, fontSize: "1.8rem", fontWeight: 800, color: palette.morado, lineHeight: 1.3, margin: 0 }}>
                ¿Cómo surge el nombre PIKTARA?
              </h2>
            </div>
            <div className="col-md-7 ptk-origen-col">
              <p style={{ fontFamily: fBody, fontSize: "1rem", lineHeight: 1.8, color: palette.borde, fontWeight: 600, margin: 0 }}>
                Surge de la conexión con la historia antigua:
                <br />
                <br />
                <strong>"PIK":</strong> Proviene de los pictogramas y jeroglíficos egipcios, entendiendo la
                escritura como un arte visual y sagrado.
                <br />
                <strong>"TARA":</strong> Se relaciona con el concepto de las estrellas y astros que guiaban la
                navegación y el tiempo en las civilizaciones antiguas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN EQUIPO */}
      <section className="py-5 px-3 overflow-hidden" style={{ background: palette.amarillo, borderTop: `5px solid ${palette.borde}`, borderBottom: `6px solid ${palette.borde}` }}>
        <div className="container">
          <div className="text-center mb-5">
            <span
              className="ptk-equipo-badge"
              style={{
                fontFamily: fDisplay,
                fontSize: "2rem",
                fontWeight: 800,
                background: palette.morado,
                color: "#ffffff",
                padding: "8px 30px",
                borderRadius: "999px",
                border: `4px solid ${palette.borde}`,
                boxShadow: `0 6px 0 ${palette.borde}`,
                display: "inline-block",
              }}
            >
              NUESTRO EQUIPO
            </span>
          </div>

          <div className="row justify-content-center g-4 ptk-equipo-grid">
            {equipo.map((miembro, i) => (
              <div key={i} className="col-12 col-md-4 d-flex">
                <div
                  className="piktara-card text-center p-4 w-100 d-flex flex-column align-items-center position-relative"
                  {...equipoTilt}
                >
                  <div className="mb-3 w-100" style={{ height: "200px" }}>
                    <img
                      src={miembro.img}
                      alt={miembro.nombre}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        filter: `drop-shadow(0 5px 0 ${palette.borde})`,
                      }}
                    />
                  </div>

                  <h3 style={{ fontFamily: fDisplay, fontSize: "1.3rem", fontWeight: 800, color: palette.morado, marginTop: "10px" }}>
                    {miembro.nombre}
                  </h3>

                  <p style={{ fontFamily: fBody, fontSize: "0.92rem", lineHeight: 1.6, color: palette.borde, fontWeight: 600, margin: 0 }}>
                    {miembro.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="py-5"
        style={{
          background: palette.amarillo,
          borderTop: `6px solid ${palette.morado}`,
        }}
      >
        <div className="container ptk-footer-content">
          <div className="row justify-content-between align-items-center gy-4">
            <div className="col-md-3 text-center text-md-start">
              <img
                src="/nombresolo.svg"
                alt="Piktara"
                style={{ width: "150px", filter: `drop-shadow(0 3px 0 ${palette.borde})` }}
              />
            </div>

            <div className="col-md-4 text-center">
              <p
                className="mb-2"
                style={{
                  fontFamily: fDisplay,
                  fontSize: "1rem",
                  color: palette.morado,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                ACERCA DE
              </p>
              <div className="d-flex justify-content-center gap-4">
                <Link
                  to="/nuestro-comic"
                  style={{
                    fontFamily: fBody,
                    color: palette.borde,
                    textDecoration: "none",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                  }}
                >
                  Nuestro Proyecto
                </Link>
              </div>
            </div>

            <div className="col-md-3 text-center text-md-end">
              <p
                className="mb-2"
                style={{
                  fontFamily: fDisplay,
                  fontSize: "1rem",
                  color: palette.morado,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                REDES SOCIALES
              </p>
              <div className="d-flex gap-3 justify-content-center justify-content-md-end">
                <a
                  href="https://www.facebook.com/share/1CUVKmwfeK/"
                  target="_blank"
                  rel="noreferrer"
                  className="social-icon-btn"
                  title="Facebook"
                >
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                  </svg>
                </a>

                <a
                  href="https://www.instagram.com/piktara.2026/"
                  target="_blank"
                  rel="noreferrer"
                  className="social-icon-btn"
                  title="Instagram"
                >
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
