import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import Buscar from "./Buscar";
import IniciarSeccion from "./IniciarSeccion";

const fDisplay = "'Baloo 2', 'Comic Sans MS', sans-serif";

const palette = {
  morado: "#9D6A8E",
  amarillo: "#FFC300",
  crema: "#FFF8E7",
  borde: "#3A2312",
  lavanda: "#E6E6FA",
};

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

// --- MODAL DE PERSONAJE ---
const PersonajeModal = ({ personaje, onClose }) => {
  if (!personaje) return null;

  return (
    <div
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
          transform: "rotate(-0.5deg)",
          animation: "modalPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both",
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
          ✕
        </button>

        <img
          src={personaje.img}
          alt={personaje.nombre}
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
          style={{
            fontFamily: "Quicksand, sans-serif",
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
              fontFamily: "Quicksand, sans-serif",
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
  const [scrollProgress, setScrollProgress] = useState(0);
  const heroRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = heroRef.current?.offsetHeight || 800;
      const progress = Math.min(window.scrollY / heroHeight, 1);
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (location.state?.scrollTo) {
      const targetId = location.state.scrollTo;
      setTimeout(() => {
        const elem = document.getElementById(targetId);
        if (elem) {
          elem.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
    }
  }, [location]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Quicksand:wght@500;600;700&display=swap');

        @keyframes spiralAndLogoIntro {
          0% { transform: scale(0.1) rotate(0deg); opacity: 0; }
          40% { transform: scale(1.5) rotate(1080deg); opacity: 1; }
          60% { transform: scale(1.2) rotate(1440deg); opacity: 1; }
          80% { transform: scale(3.2) rotate(1800deg); opacity: 1; }
          100% { transform: scale(4.5) rotate(2160deg); opacity: 0; }
        }

        @keyframes logoPopReveal {
          0% { transform: scale(0.2) rotate(-10deg); opacity: 0; }
          50% { transform: scale(0.2) rotate(-10deg); opacity: 0; }
          65% { transform: scale(1.15) rotate(3deg); opacity: 1; }
          78% { transform: scale(0.95) rotate(-2deg); opacity: 1; }
          90% { transform: scale(1.05) rotate(0deg); opacity: 1; }
          100% { transform: scale(1.3) rotate(0deg); opacity: 0; }
        }

        @keyframes spiralFadeOutBg {
          0% { background-color: ${palette.morado}; }
          88% { background-color: ${palette.morado}; }
          100% { background-color: transparent; visibility: hidden; }
        }

        @keyframes headerDrop {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes modalPop {
          0% { transform: scale(0.5) rotate(-4deg); opacity: 0; }
          70% { transform: scale(1.05) rotate(1deg); opacity: 1; }
          100% { transform: scale(1) rotate(-0.5deg); opacity: 1; }
        }

        .home-navlink { transition: transform 0.15s ease, color 0.15s ease; }
        .home-navlink:hover { transform: scale(1.08) rotate(-1deg); color: ${palette.morado} !important; }

        .personaje-card { transition: transform 0.25s ease; cursor: pointer; }
        .personaje-card:hover { transform: translateY(-10px) scale(1.04) rotate(0deg) !important; }

        .piktara-card {
          background: #ffffff;
          border: 4px solid ${palette.borde};
          border-radius: 28px;
          box-shadow: 0 8px 0 ${palette.borde};
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .piktara-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 0 ${palette.borde};
        }

        .btn-interactivo {
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .btn-interactivo:hover {
          transform: translateY(-3px) scale(1.04);
          box-shadow: 0 7px 0 ${palette.borde};
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
          transform: translateY(-3px) scale(1.1);
          background: ${palette.morado};
          color: ${palette.amarillo};
        }
      `}</style>

      {loading && (
        <div
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
            animation: "spiralFadeOutBg 4.2s ease-in-out forwards",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "220px",
              height: "220px",
              borderRadius: "50%",
              background: `conic-gradient(${palette.morado} 0deg 180deg, ${palette.amarillo} 180deg 360deg)`,
              border: `6px solid ${palette.borde}`,
              boxShadow: `0 0 0 3000px ${palette.morado}`,
              animation: "spiralAndLogoIntro 4s cubic-bezier(0.77, 0, 0.175, 1) forwards",
            }}
          />
          <div
            style={{
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "logoPopReveal 4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
              zIndex: 10000,
            }}
          >
            <img
              src="/LOGO COMPLETO PIKTARA.svg"
              alt="Piktara Logo"
              style={{
                width: "280px",
                height: "auto",
                filter: `drop-shadow(0 8px 0px ${palette.borde}) drop-shadow(0 15px 25px rgba(58, 35, 18, 0.5))`,
              }}
            />
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav
        className="navbar navbar-expand-lg px-4 px-md-5"
        style={{
          background: palette.amarillo,
          borderBottom: `6px solid ${palette.morado}`,
          animation: "headerDrop 0.6s cubic-bezier(.34,1.56,.64,1) both",
          position: "sticky",
          top: 0,
          zIndex: 30,
        }}
      >
        <Link to="/" className="navbar-brand me-5">
          <img
            src="/LOGO COMPLETO PIKTARA.svg"
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
        <div className="d-flex gap-3 ms-auto align-items-center">
          <button
            className="btn btn-interactivo"
            style={{
              fontFamily: fDisplay,
              background: palette.crema,
              border: `3px solid ${palette.borde}`,
              color: palette.borde,
              borderRadius: "14px",
              padding: "6px 18px",
              fontWeight: 800,
              boxShadow: `0 4px 0 ${palette.borde}`,
            }}
            data-bs-toggle="offcanvas"
            data-bs-target="#panelBuscar"
          >
            Buscar
          </button>
          <button
            className="btn btn-interactivo"
            style={{
              fontFamily: fDisplay,
              background: palette.crema,
              border: `3.5px solid ${palette.borde}`,
              color: palette.borde,
              borderRadius: "14px",
              padding: "6px 18px",
              fontWeight: 800,
              boxShadow: `0 4px 0 ${palette.borde}`,
            }}
            data-bs-toggle="offcanvas"
            data-bs-target="#panelLogin"
          >
            Iniciar Sesión
          </button>
        </div>
      </nav>

      <Buscar />
      <IniciarSeccion />

      {/* HERO SECTION CON IMAGEN DE FONDO (BACKGROUND-IMAGE) */}
      <div 
        ref={heroRef}
        className="position-relative overflow-hidden d-flex align-items-center justify-content-center w-100" 
        style={{ 
          backgroundImage: `url('/fondo_7.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "95vh",
          borderBottom: `6px solid ${palette.borde}`
        }}
      >
        <div 
          className="position-absolute w-100 px-3 px-md-5 text-center d-flex justify-content-center pointer-events-none"
          style={{
            zIndex: 4,
            transform: `translateY(${scrollProgress * -200}px) scale(${Math.max(1 - scrollProgress * 0.4, 0.5)}) rotate(${scrollProgress * 20}deg)`,
            opacity: Math.max(1 - scrollProgress * 1.5, 0),
            transition: "transform 0.05s ease-out, opacity 0.05s ease-out",
          }}
        />

        <div 
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "25px",
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
        <div 
          className="container py-4 text-center"
          style={{
            transform: `translateX(${(scrollProgress - 0.5) * 110}px)`,
            transition: "transform 0.05s ease-out"
          }}
        >
          <div className="row justify-content-center">
            <div className="col-md-9">
              <div
                style={{
                  display: "inline-block",
                  background: palette.amarillo,
                  border: `4px solid ${palette.borde}`,
                  borderRadius: "24px",
                  padding: "10px 32px",
                  marginBottom: "1.5rem",
                  transform: "rotate(-1deg)",
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
              <p style={{ fontFamily: "Quicksand, sans-serif", fontSize: "1.15rem", lineHeight: 1.8, color: palette.crema, fontWeight: 600 }}>
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
      <section id="personajes" className="py-5" style={{ background: palette.crema }}>
        <div className="text-center mb-5">
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

      {/* BANNER PRINCIPAL DE BIENVENIDA */}
      <div className="py-5 px-3" style={{ background: palette.crema, borderBottom: `5px solid ${palette.borde}` }}>
        <div className="container text-center py-3 position-relative" style={{ maxWidth: "850px" }}>
          <div
            className="p-4 p-md-5 position-relative"
            style={{
              background: "#ffffff",
              borderRadius: "36px",
              border: `6px solid ${palette.borde}`,
              boxShadow: `0 10px 0 ${palette.borde}`,
            }}
          >
            <div className="mb-4">
              <img
                src="/LOGO COMPLETO PIKTARA.svg"
                alt="Isotipo Mano"
                style={{
                  height: "90px",
                  objectFit: "contain",
                  filter: `drop-shadow(0 4px 0 ${palette.borde})`,
                }}
              />
            </div>

            <h1
              style={{
                fontFamily: fDisplay,
                fontSize: "3rem",
                fontWeight: 800,
                color: palette.morado,
                letterSpacing: "0.05em",
                textShadow: `0 3px 0 ${palette.amarillo}`,
                marginBottom: "1rem",
              }}
            >
              BIENVENIDOS A PIKTARA
            </h1>

            <p style={{ fontFamily: "Quicksand, sans-serif", fontSize: "1.05rem", lineHeight: 1.8, color: palette.borde, fontWeight: 600, margin: 0 }}>
              Piktara es una marca creativa que une arte, historia y narrativa digital. Su esencia nace de la
              inspiración en lo místico y antiguo, transformado en experiencias modernas como cómics interactivos y
              proyectos visuales llenos de imaginación.
            </p>
          </div>
        </div>
      </div>

      {/* SECCIÓN ORIGEN DEL NOMBRE */}
      <section className="py-5 px-3" style={{ background: palette.crema }}>
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
            <div className="col-md-5 text-center text-md-start">
              <h2 style={{ fontFamily: fDisplay, fontSize: "1.8rem", fontWeight: 800, color: palette.morado, lineHeight: 1.3, margin: 0 }}>
                ¿Cómo surge el nombre PIKTARA?
              </h2>
            </div>
            <div className="col-md-7">
              <p style={{ fontFamily: "Quicksand, sans-serif", fontSize: "1rem", lineHeight: 1.8, color: palette.borde, fontWeight: 600, margin: 0 }}>
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
      <section className="py-5 px-3" style={{ background: palette.amarillo, borderTop: `5px solid ${palette.borde}`, borderBottom: `6px solid ${palette.borde}` }}>
        <div className="container">
          <div className="text-center mb-5">
            <span
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

          <div className="row justify-content-center g-4">
            {equipo.map((miembro, i) => (
              <div key={i} className="col-12 col-md-4 d-flex">
                <div className="piktara-card text-center p-4 w-100 d-flex flex-column align-items-center position-relative">
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

                  <p style={{ fontFamily: "Quicksand, sans-serif", fontSize: "0.92rem", lineHeight: 1.6, color: palette.borde, fontWeight: 600, margin: 0 }}>
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
        <div className="container">
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
                    fontFamily: "Quicksand, sans-serif",
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

                <a
                  href="https://wa.me/573125965458"
                  target="_blank"
                  rel="noreferrer"
                  className="social-icon-btn"
                  title="WhatsApp"
                >
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.64 1.93 6.559 6.559 0 0 1 1.929 4.646c-.002 3.627-2.958 6.585-6.57 6.585zm3.61-4.933c-.197-.099-1.17-.578-1.353-.646-.182-.067-.315-.099-.448.099-.133.197-.513.646-.629.778-.117.133-.232.148-.43.05-.197-.099-.833-.307-1.587-.98-.588-.524-.985-1.172-1.101-1.37-.116-.197-.012-.304.086-.402.088-.088.197-.232.296-.349.099-.117.133-.197.198-.329.065-.133.033-.248-.016-.347-.049-.099-.448-1.08-.614-1.479-.161-.389-.327-.336-.448-.342-.115-.006-.248-.007-.38-.007s-.348.049-.53.248c-.182.198-.696.68-.696 1.658 0 .979.712 1.925.811 2.057.099.133 1.398 2.137 3.388 2.997.473.204.843.326 1.13.418.475.152.908.13 1.25.079.381-.058 1.17-.478 1.335-.94.165-.463.165-.859.116-.94-.049-.082-.182-.132-.38-.231z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <PersonajeModal personaje={personajeActivo} onClose={() => setPersonajeActivo(null)} />
    </>
  );
}