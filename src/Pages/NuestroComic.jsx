import { useState } from "react";
import { Link } from "react-router-dom";
import Buscar from "./Buscar";
import IniciarSeccion from "./IniciarSeccion";

// ── Tipografías y Paleta Oficial (Reducida a 2 colores principales) ─────────────────
const fDisplay = "'Baloo 2', 'Comic Sans MS', sans-serif";
const fBody = "'Quicksand', 'Comic Sans MS', sans-serif";

const palette = {
  morado: "#5A189A", // Color principal 1 (Acciones y destacados)
  crema: "#FFF8E7",  // Fondo general limpio
  borde: "#3A2312",  // Color principal 2 (Textos, contornos y estructura fuerte)
};

const tabs = {
  proyecto: {
    title: "SOBRE EL PROYECTO",
    text: 'El proyecto "Primeras civilizaciones y la invención de la escritura" busca acercar a los niños y jóvenes al conocimiento histórico mediante un cómic digital interactivo transmedia. A través de ilustraciones, animaciones, sonido y decisiones del lector, se crea una experiencia de aprendizaje dinámica, entretenida e inmersiva.',
  },
  funciona: {
    title: "¿CÓMO FUNCIONA?",
    text: "Un cómic digital interactivo permite al lector tomar decisiones que afectan la narrativa, combinando texto, imágenes, audio y animación. Además, al ser transmedia, la historia puede expandirse en diferentes formatos y plataformas.",
  },
  objetivo: {
    title: "OBJETIVO DEL PROYECTO",
    text: "Desarrollar un cómic digital interactivo transmedia sobre las primeras civilizaciones y la invención de la escritura, que permita a los estudiantes aprender historia de forma dinámica, entretenida e inmersiva, fomentando el pensamiento crítico y la creatividad.",
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

const WashiTape = ({ top, left, right, rotate }) => (
  <div
    style={{
      position: "absolute",
      top,
      left,
      right,
      width: "60px",
      height: "20px",
      background: palette.morado,
      opacity: 0.85,
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
      {/* Estilos optimizados para máxima usabilidad */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Quicksand:wght@500;600;700&display=swap');

        /* Botones de navegación principales más grandes y accesibles */
        .nav-btn-pill {
          font-family: ${fDisplay};
          font-weight: 800;
          font-size: 1.15rem;
          padding: 12px 28px;
          border-radius: 999px;
          border: 4px solid ${palette.borde};
          background: ${palette.morado};
          color: #ffffff !important;
          box-shadow: 0 5px 0 ${palette.borde};
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease-in-out;
          cursor: pointer;
        }
        .nav-btn-pill:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 0 ${palette.borde};
        }
        .nav-btn-pill:active {
          transform: translateY(2px);
          box-shadow: 0 2px 0 ${palette.borde};
        }

        /* Pestañas interiores interactivas y amplias */
        .tab-button {
          font-family: ${fDisplay};
          font-weight: 800;
          font-size: 1.1rem;
          padding: 14px 30px;
          border-radius: 999px;
          border: 4px solid ${palette.borde};
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 5px 0 ${palette.borde};
        }
        .tab-button.active {
          background: ${palette.morado};
          color: #ffffff;
          transform: translateY(-3px);
          box-shadow: 0 8px 0 ${palette.borde};
        }
        .tab-button.inactive {
          background: #ffffff;
          color: ${palette.borde};
        }
        .tab-button.inactive:hover {
          background: ${palette.morado};
          color: #ffffff;
          transform: translateY(-2px);
        }

        /* Botones de iconos circulares de fácil clic */
        .btn-icon-circle {
          width: 50px;
          height: 50px;
          background: #ffffff;
          border: 4px solid ${palette.borde};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${palette.borde};
          transition: all 0.2s ease;
          box-shadow: 0 4px 0 ${palette.borde};
          cursor: pointer;
          text-decoration: none;
        }
        .btn-icon-circle:hover {
          transform: translateY(-3px);
          background: ${palette.morado};
          color: #ffffff;
          box-shadow: 0 7px 0 ${palette.borde};
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
          border: 3px solid ${palette.borde};
          padding: 18px;
        }

        .carousel-indicators [data-bs-target] {
          background-color: ${palette.morado};
          height: 12px;
          width: 12px;
          border-radius: 50%;
          border: 2px solid ${palette.borde};
        }
      `}</style>

      {/* NAVBAR */}
      <nav
        className="navbar navbar-expand-lg px-4 px-md-5 py-3"
        style={{
          background: palette.morado,
          borderBottom: `6px solid ${palette.borde}`,
          position: "relative",
          zIndex: 20,
        }}
      >
        <Link to="/" className="navbar-brand me-4">
          <img 
            src="/LOGO COMPL...ARA.svg" 
            alt="Piktara" 
            style={{ height: "55px", objectFit: "contain", filter: `drop-shadow(0 3px 0 ${palette.borde})` }} 
          />
        </Link>

        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#menuComic" 
          style={{ borderColor: palette.borde, background: "#ffffff", padding: "10px" }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-center" id="menuComic">
          <ul className="navbar-nav gap-4 align-items-center my-3 my-lg-0">
            <li>
              <Link to="/sobre-piktara" className="nav-btn-pill">
                Sobre Piktara
              </Link>
            </li>
            <li>
              <span
                className="nav-btn-pill"
                style={{
                  background: "#ffffff",
                  color: palette.morado,
                }}
              >
                Nuestro Cómic
              </span>
            </li>
          </ul>
        </div>

        <div className="d-flex gap-3 ms-auto align-items-center mt-3 mt-lg-0">
          <div className="btn-icon-circle" data-bs-toggle="offcanvas" data-bs-target="#panelBuscar" title="Buscar">
            <i className="bi bi-search" style={{ fontSize: "1.3rem" }} />
          </div>
          <div className="btn-icon-circle" data-bs-toggle="offcanvas" data-bs-target="#panelLogin" title="Iniciar Sesión">
            <i className="bi bi-person" style={{ fontSize: "1.4rem" }} />
          </div>
        </div>
      </nav>

      <Buscar />
      <IniciarSeccion />

      {/* PESTAÑAS DE NAVEGACIÓN SUPERIOR (INTERNAS) */}
      <div className="py-4 px-3" style={{ background: "#ffffff", borderBottom: `5px solid ${palette.borde}` }}>
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
      <div className="py-5 px-3" style={{ background: palette.crema, borderBottom: `5px solid ${palette.borde}` }}>
        <div className="container position-relative" style={{ maxWidth: "900px" }}>
          
          <div 
            className="p-4 p-md-5 position-relative"
            style={{
              background: "#ffffff",
              borderRadius: "36px",
              border: `6px solid ${palette.borde}`,
              boxShadow: `0 10px 0 ${palette.borde}`
            }}
          >
            <WashiTape top="-14px" left="-14px" rotate={-15} />
            <WashiTape top="-14px" right="-14px" rotate={15} />

            <div className="row align-items-center g-4">
              <div className="col-md-5 text-center text-md-start">
                <h1 
                  style={{ 
                    fontFamily: fDisplay, 
                    fontSize: "2.3rem", 
                    fontWeight: 800, 
                    color: palette.morado,
                    lineHeight: 1.2
                  }}
                >
                  {c.title}
                </h1>
              </div>
              <div className="col-md-7">
                <p style={{ fontFamily: fBody, fontSize: "1.1rem", lineHeight: 1.8, color: palette.borde, fontWeight: 700, margin: 0 }}>
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
                fontSize: "2.1rem",
                fontWeight: 800,
                background: palette.morado,
                color: "#ffffff",
                padding: "12px 36px",
                borderRadius: "999px",
                border: `4px solid ${palette.borde}`,
                boxShadow: `0 6px 0 ${palette.borde}`,
                display: "inline-block"
              }}
            >
              MUNDO E ILUSTRACIONES
            </span>
          </div>

          {/* Carrusel de Imágenes */}
          <div className="comic-carousel-container position-relative mb-5">
            <WashiTape top="-14px" left="30px" rotate={-8} />
            <WashiTape top="-14px" right="30px" rotate={8} />

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
                  background: "#ffffff", 
                  color: palette.borde, 
                  borderRadius: "28px",
                  border: `5px solid ${palette.borde}`,
                  boxShadow: `0 8px 0 ${palette.borde}`
                }}
              >
                <p className="mb-0" style={{ fontFamily: fBody, fontSize: "1.1rem", lineHeight: 1.8, fontWeight: 700 }}>
                  Nuestro cómic explora las <strong style={{ color: palette.morado }}>primeras civilizaciones y la invención de la escritura</strong>, haciendo énfasis en las primeras ciudades y pueblos como Mesopotamia y Egipto. Este acontecimiento marca el inicio formal de la Historia, transformando la tradición oral en relatos permanentes.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-5" style={{ background: palette.morado, borderTop: `6px solid ${palette.borde}` }}>
        <div className="container">
          <div className="row align-items-center justify-content-between g-4 text-center text-md-start">
            
            <div className="col-12 col-md-auto d-flex flex-column align-items-center align-items-md-start">
              <Link to="/">
                <img src="/PIKTARA LOGO (1).svg" alt="Piktara" style={{ width: "150px", filter: `drop-shadow(0 3px 0 ${palette.borde})` }} />
              </Link>
            </div>

            <div className="col-12 col-md-auto text-center">
              <p className="mb-2" style={{ fontFamily: fDisplay, fontSize: "1.2rem", color: "#ffffff", fontWeight: 800 }}>
                Navegación
              </p>
              <div className="d-flex gap-3 justify-content-center fw-bold" style={{ fontSize: "1.1rem" }}>
                <Link to="/sobre-piktara" style={{ color: "#ffffff", textDecoration: "underline" }}>Sobre Piktara</Link>
                <span style={{ color: "#ffffff" }}>•</span>
                <span style={{ color: "#ffffff" }}>Nuestro Cómic</span>
              </div>
            </div>

            <div className="col-12 col-md-auto text-center">
              <p className="mb-2" style={{ fontFamily: fDisplay, fontSize: "1.2rem", color: "#ffffff", fontWeight: 800 }}>
                Redes Sociales
              </p>
              <div className="d-flex gap-3 align-items-center justify-content-center">
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/share/1CUVKmwfeK/"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-icon-circle"
                  title="Facebook"
                >
                  <svg width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/piktara.2026/"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-icon-circle"
                  title="Instagram"
                >
                  <svg width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                  </svg>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/573125965458"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-icon-circle"
                  title="WhatsApp"
                >
                  <svg width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.64 1.93 6.559 6.559 0 0 1 1.929 4.646c-.002 3.627-2.958 6.585-6.57 6.585zm3.61-4.933c-.197-.099-1.17-.578-1.353-.646-.182-.067-.315-.099-.448.099-.133.197-.513.646-.629.778-.117.133-.232.148-.43.05-.197-.099-.833-.307-1.587-.98-.588-.524-.985-1.172-1.101-1.37-.116-.197-.012-.304.086-.402.088-.088.197-.232.296-.349.099-.117.133-.197.198-.329.065-.133.033-.248-.016-.347-.049-.099-.448-1.08-.614-1.479-.161-.389-.327-.336-.448-.342-.115-.006-.248-.007-.38-.007s-.348.049-.53.248c-.182.198-.696.68-.696 1.658 0 .979.712 1.925.811 2.057.099.133 1.398 2.137 3.388 2.997.473.204.843.326 1.13.418.475.152.908.13 1.25.079.381-.058 1.17-.478 1.335-.94.165-.463.165-.859.116-.94-.049-.082-.182-.132-.38-.231z"/>
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