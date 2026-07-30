import { useState } from "react";
import { Link } from "react-router-dom";
import Buscar from "./Buscar";
import IniciarSeccion from "./IniciarSeccion";

// ── Tipografías y Paleta Oficial (3 Colores + Contorno) ─────────────────
const fDisplay = "'Baloo 2', 'Comic Sans MS', sans-serif";
const fBody = "'Quicksand', 'Comic Sans MS', sans-serif";

const palette = {
  morado: "#5A189A",
  amarillo: "#FFC300",
  crema: "#FFF8E7",
  borde: "#3A2312",
};

const tabs = {
  proyecto: {
    title: "SOBRE EL PROYECTO",
    text: 'El proyecto "Primeras civilizaciones y la invención de la escritura" busca acercar a los niños y jóvenes al conocimiento histórico mediante un cómic digital interactivo transmedia. A través de ilustraciones, animaciones, sonido y decisiones del lector, se crea una experiencia de aprendizaje dinámica, entretenida e inmersiva.',
    bg: "/hero-proyecto.png",
  },
  funciona: {
    title: "¿CÓMO FUNCIONA?",
    text: "Un cómic digital interactivo permite al lector tomar decisiones que afectan la narrativa, combinando texto, imágenes, audio y animación. Además, al ser transmedia, la historia puede expandirse en diferentes formatos y plataformas.",
    bg: "/comic-funciona.png",
   
  },
  objetivo: {
    title: "OBJETIVO DEL PROYECTO",
    text: "Desarrollar un cómic digital interactivo transmedia sobre las primeras civilizaciones y la invención de la escritura, que permita a los estudiantes aprender historia de forma dinámica, entretenida e inmersiva, fomentando el pensamiento crítico y la creatividad.",
    bg: "/comic-objetivo.png",
   
  },
};

const imagenesComic = [
  { src: "/fondo_9.png", alt: "Desierto con oasis" },
  { src: "/fondo_10.png", alt: "Sala con columnas" },
  { src: "/fondo_11.png", alt: "Ruinas antiguas" },
  { src: "/fondo_12.png", alt: "Paisaje con sol" },
  { src: "/fondo_7.png", alt: "Templo con antorchas" },
  { src: "/Fondo_8.png", alt: "Mercado antiguo" },
];

const WashiTape = ({ top, left, right, rotate, color }) => (
  <div
    style={{
      position: "absolute",
      top,
      left,
      right,
      width: "60px",
      height: "20px",
      background: color,
      opacity: 0.9,
      transform: `rotate(${rotate}deg)`,
      boxShadow: `0 2px 4px ${palette.borde}44`,
      borderRadius: "3px",
      zIndex: 10,
    }}
  />
);

export default function NuestroComic() {
  const [tab, setTab] = useState("proyecto");
  const c = tabs[tab];

  return (
    <div style={{ background: palette.crema, minHeight: "100vh", fontFamily: fBody, color: palette.borde }}>
      {/* Estilos */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Quicksand:wght@500;600;700&display=swap');

        .nav-btn-link {
          font-family: ${fDisplay};
          font-weight: 700;
          color: #ffffff !important;
          background: ${palette.morado};
          padding: 8px 20px;
          border-radius: 999px;
          border: 3px solid ${palette.borde};
          box-shadow: 0 4px 0 ${palette.borde};
          text-decoration: none;
          transition: transform 0.15s ease;
        }
        .nav-btn-link:hover {
          transform: scale(1.05);
        }

        .tab-button {
          font-family: ${fDisplay};
          font-weight: 700;
          font-size: 1rem;
          padding: 10px 24px;
          border-radius: 999px;
          border: 3.5px solid ${palette.borde};
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 0 ${palette.borde};
        }
        .tab-button.active {
          background: ${palette.morado};
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 6px 0 ${palette.borde};
        }
        .tab-button.inactive {
          background: #ffffff;
          color: ${palette.borde};
        }
        .tab-button.inactive:hover {
          background: ${palette.amarillo};
          color: ${palette.morado};
          transform: translateY(-2px);
        }

        .comic-carousel-container {
          border: 5px solid ${palette.borde};
          border-radius: 28px;
          background: #ffffff;
          box-shadow: 0 8px 0 ${palette.borde};
          padding: 20px;
        }

        .carousel-control-prev-icon,
        .carousel-control-next-icon {
          background-color: ${palette.morado};
          border-radius: 50%;
          border: 2px solid ${palette.borde};
          padding: 15px;
        }

        .carousel-indicators [data-bs-target] {
          background-color: ${palette.morado};
          height: 10px;
          width: 10px;
          border-radius: 50%;
          border: 1px solid ${palette.borde};
        }
      `}</style>

      {/* NAVBAR */}
      <nav
        className="navbar navbar-expand-lg px-4 px-md-5 py-2"
        style={{
          background: palette.amarillo,
          borderBottom: `6px solid ${palette.borde}`,
          position: "relative",
          zIndex: 20,
        }}
      >
        <Link to="/" className="navbar-brand me-4">
          <img src="/logo-piktara.png" alt="Piktara" style={{ height: "55px", filter: `drop-shadow(0 3px 0 ${palette.borde})` }} />
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuComic" style={{ borderColor: palette.borde }}>
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-center" id="menuComic">
          <ul className="navbar-nav gap-3 align-items-center">
            <li className="nav-item">
              <Link to="/sobre-piktara" className="nav-btn-link">
                Sobre Piktara
              </Link>
            </li>
            <li className="nav-item">
              <a
                className="nav-link fw-bold px-3 py-1"
                href="#"
                style={{
                  fontFamily: fDisplay,
                  fontSize: "1.1rem",
                  color: palette.morado,
                  background: palette.crema,
                  borderRadius: "20px",
                  border: `3px solid ${palette.borde}`,
                  boxShadow: `0 3px 0 ${palette.borde}`
                }}
              >
                Nuestro Cómic
              </a>
            </li>
          </ul>
        </div>

        <div className="d-flex gap-3 ms-auto align-items-center" style={{ fontSize: "1.3rem", color: palette.borde }}>
          <div 
            className="d-flex align-items-center justify-content-center"
            style={{ 
              width: "42px", 
              height: "42px", 
              background: palette.crema, 
              borderRadius: "50%", 
              border: `3px solid ${palette.borde}`,
              cursor: "pointer",
              boxShadow: `0 3px 0 ${palette.borde}`
            }}
            data-bs-toggle="offcanvas" data-bs-target="#panelBuscar"
          >
            <i className="bi bi-search" />
          </div>
          <div 
            className="d-flex align-items-center justify-content-center"
            style={{ 
              width: "42px", 
              height: "42px", 
              background: palette.crema, 
              borderRadius: "50%", 
              border: `3px solid ${palette.borde}`,
              cursor: "pointer",
              boxShadow: `0 3px 0 ${palette.borde}`
            }}
            data-bs-toggle="offcanvas" data-bs-target="#panelLogin"
          >
            <i className="bi bi-person" />
          </div>
        </div>
      </nav>

      <Buscar />
      <IniciarSeccion />

      {/* PESTAÑAS DE NAVEGACIÓN SUPERIOR */}
      <div className="py-3 px-3" style={{ background: palette.morado, borderBottom: `4px solid ${palette.borde}` }}>
        <div className="container d-flex justify-content-center gap-3 flex-wrap">
          {[
            { key: "proyecto", label: "Sobre el Proyecto" },
            { key: "funciona", label: "¿Cómo Funciona?" },
            { key: "objetivo", label: "Objetivo del Proyecto" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`tab-button ${tab === key ? "active" : "inactive"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* DISPLAY DINÁMICO (HERO TAB) */}
      <div className="py-5 px-3" style={{ background: palette.crema, borderBottom: `5px solid ${palette.morado}` }}>
        <div className="container position-relative" style={{ maxWidth: "900px" }}>
          
          <div 
            className="p-4 p-md-5 position-relative"
            style={{
              background: "#ffffff",
              borderRadius: "36px",
              border: `6px solid ${palette.morado}`,
              boxShadow: `0 10px 0 ${palette.borde}22`
            }}
          >
            <WashiTape top="-12px" left="-12px" rotate={-15} color={palette.amarillo} />
            <WashiTape top="-12px" right="-12px" rotate={15} color={palette.morado} />

            <div className="row align-items-center g-4">
              <div className="col-md-5 text-center text-md-start">
                <h1 
                  style={{ 
                    fontFamily: fDisplay, 
                    fontSize: "2.2rem", 
                    fontWeight: 800, 
                    color: palette.morado,
                    lineHeight: 1.2
                  }}
                >
                  {c.title}
                </h1>
              </div>
              <div className="col-md-7">
                <p style={{ fontFamily: fBody, fontSize: "1.02rem", lineHeight: 1.8, color: palette.borde, fontWeight: 600, margin: 0 }}>
                  {c.text}
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* SECCIÓN MUESTRA DEL CÓMIC CON CARRUSEL */}
      <section className="py-5 px-3" style={{ background: palette.crema }}>
        <div className="container" style={{ maxWidth: "850px" }}>
          
          <div className="text-center mb-5">
            <span 
              style={{
                fontFamily: fDisplay,
                fontSize: "2rem",
                fontWeight: 800,
                background: palette.amarillo,
                color: palette.morado,
                padding: "8px 32px",
                borderRadius: "999px",
                border: `4px solid ${palette.morado}`,
                boxShadow: `0 6px 0 ${palette.borde}`
              }}
            >
              MUNDO E ILUSTRACIONES
            </span>
          </div>

          {/* Carrusel de Imágenes */}
          <div className="comic-carousel-container position-relative mb-5">
            <WashiTape top="-12px" left="30px" rotate={-8} color={palette.amarillo} />
            <WashiTape top="-12px" right="30px" rotate={8} color={palette.morado} />

            <div id="carouselIlustraciones" className="carousel slide" data-bs-ride="carousel">
              <div className="carousel-indicators mb-0">
                {imagenesComic.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    data-bs-target="#carouselIlustraciones"
                    data-bs-slide-to={i}
                    className={i === 0 ? "active" : ""}
                    aria-current={i === 0 ? "true" : "false"}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>

              <div className="carousel-inner" style={{ borderRadius: "18px", overflow: "hidden" }}>
                {imagenesComic.map((img, i) => (
                  <div key={i} className={`carousel-item ${i === 0 ? "active" : ""}`}>
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="d-block w-100"
                      style={{
                        maxHeight: "450px",
                        objectFit: "cover",
                        border: `3px solid ${palette.borde}`,
                        borderRadius: "18px"
                      }}
                    />
                  </div>
                ))}
              </div>

              <button className="carousel-control-prev" type="button" data-bs-target="#carouselIlustraciones" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Anterior</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#carouselIlustraciones" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Siguiente</span>
              </button>
            </div>
          </div>

          {/* Tarjeta Explicativa */}
          <div className="row justify-content-center">
            <div className="col-12">
              <div 
                className="p-4 p-md-5 text-center position-relative" 
                style={{ 
                  background: palette.morado, 
                  color: "#ffffff", 
                  borderRadius: "28px",
                  border: `5px solid ${palette.borde}`,
                  boxShadow: `0 8px 0 ${palette.borde}`
                }}
              >
                <p className="mb-0" style={{ fontFamily: fBody, fontSize: "1rem", lineHeight: 1.8, fontWeight: 600 }}>
                  Nuestro cómic explora las <strong>primeras civilizaciones y la invención de la escritura</strong>, haciendo énfasis en las primeras ciudades y pueblos como Mesopotamia y Egipto. Este acontecimiento marca el inicio formal de la Historia, transformando la tradición oral en relatos permanentes.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-4" style={{ background: palette.amarillo, borderTop: `6px solid ${palette.morado}` }}>
        <div className="container">
          <div className="row align-items-center justify-content-between g-4 text-center text-md-start">
            
            <div className="col-12 col-md-auto d-flex flex-column align-items-center align-items-md-start">
              <Link to="/">
                <img src="/logo-piktara.png" alt="Piktara" style={{ width: "120px", filter: `drop-shadow(0 2px 0 ${palette.borde})` }} />
              </Link>
              <span style={{ fontFamily: fDisplay, fontWeight: 800, color: palette.morado, fontSize: "1.2rem" }}>
                PIKTARA
              </span>
            </div>

            <div className="col-12 col-md-auto text-center">
              <p className="mb-2" style={{ fontFamily: fDisplay, fontSize: "1.1rem", color: palette.morado, fontWeight: 800 }}>
                Navegación
              </p>
              <div className="d-flex gap-3 justify-content-center fw-bold">
                <Link to="/sobre-piktara" style={{ color: palette.borde, textDecoration: "none" }}>Sobre Piktara</Link>
                <span>•</span>
                <a href="#" style={{ color: palette.borde, textDecoration: "none" }}>Nuestro Cómic</a>
              </div>
            </div>

            <div className="col-12 col-md-auto text-center">
              <p className="mb-2" style={{ fontFamily: fDisplay, fontSize: "1.1rem", color: palette.morado, fontWeight: 800 }}>
                Redes Sociales
              </p>
              <div className="d-flex gap-3 align-items-center justify-content-center">
                <a href="https://www.facebook.com/share/1CUVKmwfeK/" target="_blank" rel="noreferrer" style={{ color: palette.morado }}>
                  <i className="bi bi-facebook" style={{ fontSize: "1.8rem" }}></i>
                </a>
                <a href="https://www.instagram.com/____sanchez_10" target="_blank" rel="noreferrer" style={{ color: palette.morado }}>
                  <i className="bi bi-instagram" style={{ fontSize: "1.8rem" }}></i>
                </a>
                <a href="https://wa.me/573125965458" target="_blank" rel="noreferrer" style={{ color: palette.morado }}>
                  <i className="bi bi-whatsapp" style={{ fontSize: "1.8rem" }}></i>
                </a>
              </div>
            </div>

          </div>
        </div>
      </footer>
    </div>
  );
}