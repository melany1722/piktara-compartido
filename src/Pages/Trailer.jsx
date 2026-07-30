import { useState } from "react";
import { Link } from "react-router-dom";
import Buscar from "./Buscar";
import IniciarSeccion from "./IniciarSeccion";

// ── Tipografías y Paleta Unificada de 3 Colores (+ Marrón para bordes de cómic) ──
const fDisplay = "'Baloo 2', 'Comic Sans MS', sans-serif";
const fBody = "'Quicksand', 'Comic Sans MS', sans-serif";

const palette = {
  morado: "#5A189A",   // Color Primario (Aventura / Estructura)
  amarillo: "#FFC300", // Color Secundario (Destacados / Energía)
  crema: "#FFF8E7",    // Fondo Suave
  borde: "#3A2312",    // Color para trazos y sombras estilo cómic
};

export default function Trailer() {
  const [reproducir, setReproducir] = useState(false);

  const handleVerComic = () => {
    localStorage.removeItem("piktaraScore");
    localStorage.removeItem("relojComicj");
    localStorage.removeItem("relojComic");
  };

  return (
    <div style={{ background: palette.crema, minHeight: "100vh", fontFamily: fBody, color: palette.borde }}>
      {/* ESTILOS CSS REORGANIZADOS Y ADAPTADOS A LA PALETA */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Quicksand:wght@500;600;700&display=swap');

        .nav-btn-link {
          font-family: ${fDisplay};
          font-weight: 800;
          color: ${palette.morado} !important;
          background: ${palette.crema};
          padding: 8px 22px;
          border-radius: 999px;
          border: 3px solid ${palette.borde};
          box-shadow: 0 4px 0 ${palette.borde};
          text-decoration: none;
          transition: transform 0.15s ease, background 0.15s ease;
          text-transform: uppercase;
        }
        .nav-btn-link:hover {
          transform: scale(1.05);
          background: ${palette.amarillo};
        }

        .tab-button-nav {
          font-family: ${fDisplay};
          font-weight: 800;
          font-size: 0.95rem;
          padding: 8px 24px;
          border-radius: 999px;
          border: 3px solid ${palette.borde};
          text-decoration: none;
          transition: all 0.2s ease;
          box-shadow: 0 4px 0 ${palette.borde};
          text-transform: uppercase;
        }
        .tab-button-nav.active {
          background: ${palette.morado};
          color: ${palette.crema} !important;
        }
        .tab-button-nav.inactive {
          background: ${palette.crema};
          color: ${palette.borde} !important;
        }
        .tab-button-nav.inactive:hover {
          background: ${palette.amarillo};
          transform: translateY(-2px);
        }

        .btn-play-custom {
          width: 84px;
          height: 84px;
          background: ${palette.amarillo};
          border: 4px solid ${palette.borde};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 0 ${palette.borde};
          transition: transform 0.2s ease, background 0.2s ease;
        }
        .btn-play-custom:hover {
          transform: scale(1.1) rotate(5deg);
          background: ${palette.crema};
        }

        .btn-ver-comic {
          font-family: ${fDisplay};
          font-size: 1.15rem;
          font-weight: 800;
          color: ${palette.morado} !important;
          background: ${palette.amarillo};
          border: 4px solid ${palette.borde};
          border-radius: 999px;
          padding: 12px 34px;
          box-shadow: 0 6px 0 ${palette.borde};
          display: inline-block;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          text-transform: uppercase;
        }
        .btn-ver-comic:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 9px 0 ${palette.borde};
          background: ${palette.crema};
        }

        .btn-icon-circle {
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
          cursor: pointer;
          text-decoration: none;
        }
        .btn-icon-circle:hover {
          transform: translateY(-3px) scale(1.1);
          background: ${palette.morado};
          color: ${palette.amarillo};
        }
      `}</style>

      {/* NAVBAR */}
      <nav
        className="navbar navbar-expand-lg px-4 px-md-5 py-2"
        style={{
          background: palette.amarillo,
          borderBottom: `6px solid ${palette.morado}`,
          position: "relative",
          zIndex: 20,
        }}
      >
        <Link to="/" className="navbar-brand me-4">
          <img src="/logo-piktara.png" alt="Piktara" style={{ height: "55px", filter: `drop-shadow(0 3px 0 ${palette.borde})` }} />
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu2" style={{ borderColor: palette.borde }}>
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-center" id="menu2">
          <ul className="navbar-nav gap-3 align-items-center">
            <li className="nav-item">
              <Link to="/sobre-piktara" className="nav-btn-link">
                Sobre Piktara
              </Link>
            </li>
            <li className="nav-item">
              <a
                className="nav-link fw-bold px-4 py-2"
                href="#"
                style={{
                  fontFamily: fDisplay,
                  fontSize: "1rem",
                  color: palette.crema,
                  background: palette.morado,
                  borderRadius: "999px",
                  border: `3px solid ${palette.borde}`,
                  boxShadow: `0 4px 0 ${palette.borde}`,
                  textTransform: "uppercase"
                }}
              >
                Nuestro Cómic
              </a>
            </li>
          </ul>
        </div>

        <div className="d-flex gap-3 ms-auto align-items-center">
          <div className="btn-icon-circle" data-bs-toggle="offcanvas" data-bs-target="#panelBuscar" title="Buscar">
            <i className="bi bi-search" style={{ fontSize: "1.1rem" }} />
          </div>
          <div className="btn-icon-circle" data-bs-toggle="offcanvas" data-bs-target="#panelLogin" title="Iniciar Sesión">
            <i className="bi bi-person" style={{ fontSize: "1.2rem" }} />
          </div>
        </div>
      </nav>

      <Buscar />
      <IniciarSeccion />

      {/* PESTAÑAS DE CAMBIO DE SECCIÓN */}
      <div className="py-3 px-3" style={{ background: palette.morado, borderBottom: `5px solid ${palette.borde}` }}>
        <div className="container d-flex justify-content-center gap-3">
          <Link to="/sobre-el-proyecto" className="tab-button-nav inactive">
            Sobre el Proyecto
          </Link>
          <span className="tab-button-nav active">
            Sobre el Cómic
          </span>
        </div>
      </div>

      {/* REPRODUCTOR DE TRAILER */}
      <section className="py-5 px-3" style={{ background: palette.crema, borderBottom: `5px solid ${palette.morado}` }}>
        <div className="container" style={{ maxWidth: "850px" }}>
          
          <div className="text-center mb-4">
            <span 
              style={{
                fontFamily: fDisplay,
                fontSize: "1.6rem",
                fontWeight: 800,
                background: palette.amarillo,
                color: palette.morado,
                padding: "8px 32px",
                borderRadius: "999px",
                border: `4px solid ${palette.morado}`,
                boxShadow: `0 6px 0 ${palette.borde}`,
                display: "inline-block",
                transform: "rotate(-1deg)",
                textTransform: "uppercase"
              }}
            >
              TRAILER OFICIAL
            </span>
          </div>

          {/* Marco tipo Pantalla Ilustrada */}
          <div 
            className="position-relative overflow-hidden p-2 p-md-3"
            style={{
              background: palette.morado,
              borderRadius: "32px",
              border: `6px solid ${palette.borde}`,
              boxShadow: `0 10px 0 ${palette.borde}44`
            }}
          >
            <div style={{ borderRadius: "20px", overflow: "hidden", background: "#000", position: "relative" }}>
              {reproducir ? (
                <iframe
                  src="https://drive.google.com/file/d/1VkMxdeUUWXW2NUuJKH_7WiqJ6mqPR8-N/preview"
                  style={{ width: "100%", height: "400px", border: "none", display: "block" }}
                  allow="autoplay"
                  allowFullScreen
                  title="Trailer Piktara"
                />
              ) : (
                <div 
                  onClick={() => setReproducir(true)} 
                  className="position-relative d-flex align-items-center justify-content-center"
                  style={{ cursor: "pointer", height: "400px" }}
                >
                  <img 
                    src="/trailer_1.jpg" 
                    alt="Trailer" 
                    style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }} 
                  />
                  <div className="position-absolute btn-play-custom">
                    <i className="bi bi-play-fill" style={{ fontSize: "3.2rem", color: palette.morado, marginLeft: "4px" }} />
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* DETALLES DEL CÓMIC / SINOPSIS */}
      <section className="py-5 px-3" style={{ background: palette.crema }}>
        <div className="container">
          <div 
            className="row align-items-center g-4 p-4 p-md-5"
            style={{
              background: "#fff",
              borderRadius: "32px",
              border: `5px solid ${palette.morado}`,
              boxShadow: `0 8px 0 ${palette.borde}22`,
              position: "relative"
            }}
          >
            {/* Portada del Cómic */}
            <div className="col-md-4 col-lg-3 text-center">
              <div 
                className="p-2 position-relative d-inline-block"
                style={{
                  background: palette.crema,
                  border: `4px solid ${palette.borde}`,
                  borderRadius: "20px",
                  boxShadow: `0 6px 0 ${palette.borde}33`,
                  transform: "rotate(-2deg)"
                }}
              >
                <img 
                  src="/comic_p.jpg" 
                  alt="El Reloj de las Arenas" 
                  style={{ width: "100%", maxWidth: "220px", borderRadius: "12px", display: "block" }} 
                />
              </div>
            </div>

            {/* Sinopsis y Botón */}
            <div className="col-md-8 col-lg-9 text-center text-md-start">
              <h2 style={{ fontFamily: fDisplay, fontSize: "2rem", fontWeight: 800, color: palette.morado, textTransform: "uppercase" }}>
                El Reloj de las Arenas
              </h2>

              <p style={{ fontSize: "1.05rem", lineHeight: 1.8, color: palette.borde, fontWeight: 600 }}>
                Un antiguo artefacto, capaz de viajar en el tiempo, ha permanecido oculto durante milenios en las pirámides de Egipto. Cuando Ninove, una arquitecta egipcia, lo activa por accidente, comienza una aventura que la llevará a cruzar civilizaciones, conocer a guardianes legendarios y descubrir que el <strong>Reloj de las Arenas</strong> no solo controla el tiempo... también el destino de la humanidad.
              </p>

              <div className="mt-4">
                <Link 
                  to="/comicj" 
                  onClick={handleVerComic} 
                  className="btn-ver-comic text-decoration-none"
                >
                  ¡LEER CÓMIC AHORA!
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-5" style={{ background: palette.amarillo, borderTop: `6px solid ${palette.morado}` }}>
        <div className="container">
          <div className="row justify-content-between align-items-center gy-4 text-center text-md-start">
            
            <div className="col-12 col-md-3 d-flex flex-column align-items-center align-items-md-start">
              <Link to="/">
                <img src="/logo-piktara.png" alt="Piktara" style={{ width: "140px", filter: `drop-shadow(0 3px 0 ${palette.borde})` }} />
              </Link>
            </div>

            <div className="col-12 col-md-4 text-center">
              <p className="mb-2" style={{ fontFamily: fDisplay, fontSize: "1rem", color: palette.morado, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Navegación
              </p>
              <div className="d-flex gap-4 justify-content-center fw-bold">
                <Link to="/sobre-piktara" style={{ color: palette.borde, textDecoration: "none", fontFamily: fBody, fontWeight: 700 }}>
                  Sobre Piktara
                </Link>
                <Link to="/sobre-el-proyecto" style={{ color: palette.borde, textDecoration: "none", fontFamily: fBody, fontWeight: 700 }}>
                  Nuestro Cómic
                </Link>
              </div>
            </div>

            {/* REDES SOCIALES CON ICONOS VECTORIALES UNIFICADOS */}
            <div className="col-12 col-md-3 text-center text-md-end">
              <p className="mb-2" style={{ fontFamily: fDisplay, fontSize: "1rem", color: palette.morado, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Redes Sociales
              </p>
              <div className="d-flex gap-3 justify-content-center justify-content-md-end">
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/share/1CUVKmwfeK/"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-icon-circle"
                  title="Facebook"
                >
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/____sanchez_10"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-icon-circle"
                  title="Instagram"
                >
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
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
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
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