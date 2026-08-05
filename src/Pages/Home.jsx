import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Buscar from "./Buscar";
import IniciarSeccion from "./IniciarSeccion";

const fDisplay = "'Baloo 2', 'Comic Sans MS', sans-serif";

const palette = {
  morado: "#9D6A8E",
  amarillo: "#FFC300",
  crema: "#FFF8E7",
  borde: "#3A2312",
};

const personajes = [
  { nombre: "ADAD", img: "/Adad.svg", rot: "-2deg" },
  { nombre: "ATREUS", img: "/diosgriego.svg", rot: "1.5deg" },
  { nombre: "NINOVE", img: "/Ninove.svg", rot: "-1.5deg" },
];

const Cloud = ({ top, left, size, delay, duration, color = palette.crema }) => (
  <div
    style={{
      position: "absolute",
      top,
      left,
      width: size,
      height: size * 0.55,
      opacity: 0.85,
      animation: `driftCloud ${duration}s linear ${delay}s infinite`,
      pointerEvents: "none",
      zIndex: 2,
    }}
  >
    <svg viewBox="0 0 200 110" width="100%" height="100%">
      <ellipse cx="55" cy="70" rx="55" ry="35" fill={color} />
      <ellipse cx="110" cy="50" rx="65" ry="45" fill={color} />
      <ellipse cx="165" cy="72" rx="45" ry="30" fill={color} />
    </svg>
  </div>
);

export default function Home() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  // Escuchar si el buscador requiere hacer scroll tras navegar
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

        @keyframes rotateSunburst {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes comicBounceLogo {
          0% { transform: scale(0.2) rotate(-10deg); opacity: 0; }
          50% { transform: scale(1.15) rotate(4deg); opacity: 1; }
          75% { transform: scale(0.95) rotate(-2deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }

        @keyframes curtainElasticExit {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: translateY(-100%); opacity: 0; visibility: hidden; }
        }

        @keyframes driftCloud {
          from { transform: translateX(-15vw); }
          to { transform: translateX(105vw); }
        }

        @keyframes headerDrop {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .home-navlink { transition: transform 0.15s ease, color 0.15s ease; }
        .home-navlink:hover { transform: scale(1.08) rotate(-1deg); color: ${palette.morado} !important; }

        .personaje-card { transition: transform 0.25s ease; }
        .personaje-card:hover { transform: translateY(-10px) scale(1.04) rotate(0deg) !important; }

        .aventura-img { transition: transform 0.25s ease; }
        .aventura-img:hover { transform: translateY(-8px) scale(1.05) rotate(0deg) !important; }

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

      {/* CORTINA / ANIMACIÓN DE ENTRADA LIMPIA */}
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: palette.amarillo,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            overflow: "hidden",
            animation: "curtainElasticExit 0.5s ease-in-out 1.7s forwards",
          }}
        >
          {/* Fondo Pop-Art Giratorio */}
          <div
            style={{
              position: "absolute",
              width: "180vw",
              height: "180vw",
              background: `conic-gradient(
                ${palette.morado} 0deg 15deg, 
                transparent 15deg 30deg, 
                ${palette.morado} 30deg 45deg, 
                transparent 45deg 60deg,
                ${palette.morado} 60deg 75deg, 
                transparent 75deg 90deg,
                ${palette.morado} 90deg 105deg, 
                transparent 105deg 120deg,
                ${palette.morado} 120deg 135deg, 
                transparent 135deg 150deg,
                ${palette.morado} 150deg 165deg, 
                transparent 165deg 180deg,
                ${palette.morado} 180deg 195deg, 
                transparent 195deg 210deg,
                ${palette.morado} 210deg 225deg, 
                transparent 225deg 240deg,
                ${palette.morado} 240deg 255deg, 
                transparent 255deg 270deg,
                ${palette.morado} 270deg 285deg, 
                transparent 285deg 300deg,
                ${palette.morado} 300deg 315deg, 
                transparent 315deg 330deg,
                ${palette.morado} 330deg 345deg, 
                transparent 345deg 360deg
              )`,
              opacity: 0.12,
              animation: "rotateSunburst 20s linear infinite",
              pointerEvents: "none",
            }}
          />

          {/* Logo Animado Solo */}
          <div
            style={{
              animation: "comicBounceLogo 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both",
              textAlign: "center",
              position: "relative",
              zIndex: 5,
            }}
          >
            <img
              src="./MANOLOGO.svg"
              alt="Piktara"
              style={{
                width: "250px",
                filter: `drop-shadow(6px 8px 0px ${palette.borde})`,
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
            src="./MANOLOGO.svg"
            alt="Piktara"
            style={{ height: "55px", filter: `drop-shadow(0 3px 0 ${palette.borde})` }}
          />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuHome">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-center" id="menuHome">
          <ul className="navbar-nav gap-5">
            <li className="nav-item">
              <Link
                to="/sobre-piktara"
                className="home-navlink nav-link"
                style={{
                  fontFamily: fDisplay,
                  fontSize: "0.95rem",
                  letterSpacing: "0.04em",
                  color: palette.borde,
                  fontWeight: 800,
                  textTransform: "uppercase",
                }}
              >
                Sobre Piktara
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/nuestro-comic"
                className="home-navlink nav-link"
                style={{
                  fontFamily: fDisplay,
                  fontSize: "0.95rem",
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

      {/* HERO SECTION - ID: hero */}
      <div id="hero" className="position-relative overflow-hidden py-5 px-3 d-flex align-items-center" style={{ background: palette.crema, minHeight: "82vh" }}>
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundImage: "url('/piramide 1.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.3,
            zIndex: 0,
          }}
        />

        <Cloud top="10%" left="4%" size={140} delay={0} duration={22} />
        <Cloud top="18%" left="72%" size={110} delay={4} duration={18} />
      </div>

      {/* SECCIÓN: ¿QUÉ ES? - ID: que-es */}
      <section id="que-es" className="py-5" style={{ background: palette.morado, position: "relative" }}>
        <div className="container py-3">
          <div className="row justify-content-center">
            <div className="col-md-9 text-center">
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

      {/* SECCIÓN: PERSONAJES - ID: personajes */}
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
              <div key={i} className="col-6 col-md-4 text-center personaje-card" style={{ transform: `rotate(${p.rot})` }}>
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

      {/* SECCIÓN: DESCUBRE MÁS AVENTURAS - ID: aventuras */}
      <section id="aventuras" className="py-5" style={{ background: palette.crema }}>
        <div className="container py-3">
          <div className="row align-items-center g-4">
            <div className="col-md-5 text-center text-md-start">
              <div
                style={{
                  display: "inline-block",
                  background: palette.morado,
                  color: palette.crema,
                  borderRadius: "20px",
                  padding: "16px 32px",
                  boxShadow: `0 6px 0 ${palette.borde}`,
                  transform: "rotate(-2deg)",
                }}
              >
                <h2
                  style={{
                    fontFamily: fDisplay,
                    fontSize: "1.4rem",
                    letterSpacing: "0.03em",
                    fontWeight: 800,
                    margin: 0,
                  }}
                >
                  Descubre más aventuras
                </h2>
              </div>
            </div>

            <div className="col-md-7 d-flex justify-content-center justify-content-md-end gap-4 align-items-center flex-wrap">
              <img
                src="/revolucion2 1.png"
                alt="Revolución"
                className="aventura-img"
                style={{
                  height: "210px",
                  borderRadius: "16px",
                  border: `4px solid ${palette.borde}`,
                  boxShadow: "0 8px 16px rgba(0,0,0,0.12)",
                  objectFit: "cover",
                  transform: "rotate(-3deg)",
                }}
              />
              <img
                src="/Imagen de WhatsApp 2025-10-03 a las 12.53.55_32a9272f 2.png"
                alt="Crónicas del Imperio"
                className="aventura-img"
                style={{
                  height: "230px",
                  borderRadius: "16px",
                  border: `4px solid ${palette.amarillo}`,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
                  objectFit: "cover",
                }}
              />
              <img
                src="/bixuales2 1.png"
                alt="Bisual"
                className="aventura-img"
                style={{
                  height: "210px",
                  borderRadius: "16px",
                  border: `4px solid ${palette.borde}`,
                  boxShadow: "0 8px 16px rgba(0,0,0,0.12)",
                  objectFit: "cover",
                  transform: "rotate(3deg)",
                }}
              />
            </div>
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
                src="./nombresolo.svg"
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
                  to="/sobre-piktara"
                  style={{
                    fontFamily: "Quicksand, sans-serif",
                    color: palette.borde,
                    textDecoration: "none",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                  }}
                >
                  Nuestro Grupo
                </Link>
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

          <div className="row mt-4 pt-3" style={{ borderTop: `2px dashed ${palette.borde}33` }}>
            <div className="col-12 text-center">
              <Link
                to="/"
                style={{
                  color: palette.borde,
                  textDecoration: "none",
                  fontFamily: fDisplay,
                  fontWeight: 800,
                  fontSize: "0.9rem",
                }}
              >
                Volver al Inicio
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}