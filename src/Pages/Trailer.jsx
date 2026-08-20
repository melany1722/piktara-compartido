import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const fDisplay = "'Baloo 2', 'Comic Sans MS', sans-serif";
const fBody = "'Quicksand', 'Comic Sans MS', sans-serif";

const palette = {
  morado: "#5A189A",
  amarillo: "#FFC300",
  crema: "#FFF8E7",
  borde: "#3A2312",
};

export default function Trailer() {
  const [reproducir, setReproducir] = useState(false);
  const [animando, setAnimando] = useState(false);

  useEffect(() => {
    // Inicializar AOS con una configuración fluida y atractiva
    AOS.init({
      duration: 900,
      once: false,
      easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      offset: 100,
    });
  }, []);

  const handleVerComic = (e) => {
    e.preventDefault();
    setAnimando(true);

    localStorage.removeItem("piktaraScore");
    localStorage.removeItem("relojComicj");
    localStorage.removeItem("relojComic");

    setTimeout(() => {
      window.location.href = "/comicj";
    }, 500);
  };

  return (
    <div style={{ background: palette.crema, minHeight: "100vh", fontFamily: fBody, color: palette.borde, overflowX: "hidden" }}>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Quicksand:wght@500;600;700&display=swap');

        @keyframes clickPopAndZoom {
          0% { transform: scale(1); }
          40% { transform: scale(0.88) rotate(-2deg); }
          100% { transform: scale(15) rotate(5deg); opacity: 0; }
        }

        @keyframes headerDrop {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .comic-box {
          background: #fff;
          border-radius: 32px;
          border: 5px solid ${palette.morado};
          box-shadow: 0 8px 0 ${palette.borde}22;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .comic-box:hover {
          transform: translateY(-5px);
          box-shadow: 0 14px 0 ${palette.borde}33;
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
          transform: scale(1.15) rotate(5deg);
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
          transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
          text-transform: uppercase;
          cursor: pointer;
          position: relative;
          z-index: 10;
        }
        .btn-ver-comic:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 9px 0 ${palette.borde};
          background: ${palette.crema};
        }

        .btn-ver-comic.animar-salida {
          animation: clickPopAndZoom 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
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
          transform: translateY(-3px) scale(1.15);
          background: ${palette.morado};
          color: ${palette.amarillo};
        }
      `}</style>

      {/* NAVBAR */}
      <nav
        className="navbar navbar-expand-lg px-4 px-md-5"
        style={{
          background: palette.amarillo,
          borderBottom: `6px solid ${palette.morado}`,
          position: "sticky",
          top: 0,
          zIndex: 30,
          minHeight: "85px",
          animation: "headerDrop 0.6s cubic-bezier(.34,1.56,.64,1) both",
        }}
      >
        <div className="d-flex w-100 align-items-center position-relative">
          <Link to="/" className="navbar-brand p-0 m-0 position-absolute start-0">
            <img
              src="/LOGO COMPLETO PIKTARA.svg"
              alt="Piktara"
              style={{ height: "55px", filter: `drop-shadow(0 3px 0 ${palette.borde})` }}
            />
          </Link>

          <div className="flex-grow-1 text-center d-none d-md-block">
            <span
              style={{
                fontFamily: fDisplay,
                fontSize: "1.5rem",
                letterSpacing: "0.06em",
                color: palette.borde,
                fontWeight: 800,
                textTransform: "uppercase",
              }}
            >
              Nuestro Cómic
            </span>
          </div>
        </div>
      </nav>

      {/* SECCIÓN DEL TRAILER */}
      <section className="py-5 px-3" style={{ background: palette.crema, borderBottom: `5px solid ${palette.morado}` }}>
        <div className="container" style={{ maxWidth: "1100px" }}>
          
          <div className="w-100 text-center mb-4" data-aos="fade-down" data-aos-duration="800">
            <span 
              style={{
                fontFamily: fDisplay,
                fontSize: "1.5rem",
                fontWeight: 800,
                background: palette.morado,
                color: palette.amarillo,
                padding: "8px 30px",
                borderRadius: "16px",
                border: `3.5px solid ${palette.borde}`,
                boxShadow: `0 4px 0 ${palette.borde}`,
                display: "inline-block",
                textTransform: "uppercase",
                letterSpacing: "0.05em"
              }}
            >
              Trailer Oficial
            </span>
          </div>

          <div 
            className="position-relative overflow-hidden p-2 p-md-3 mx-auto"
            data-aos="zoom-in-up"
            data-aos-duration="900"
            style={{
              background: palette.morado,
              borderRadius: "32px",
              border: `6px solid ${palette.borde}`,
              boxShadow: `0 10px 0 ${palette.borde}44`,
              maxWidth: "100%"
            }}
          >
            <div style={{ borderRadius: "20px", overflow: "hidden", background: "#000", position: "relative" }}>
              {reproducir ? (
                <iframe
                  src="https://drive.google.com/file/d/1VkMxdeUUWXW2NUuJKH_7WiqJ6mqPR8-N/preview"
                  style={{ width: "100%", height: "520px", border: "none", display: "block" }}
                  allow="autoplay"
                  allowFullScreen
                  title="Trailer Piktara"
                />
              ) : (
                <div 
                  onClick={() => setReproducir(true)} 
                  className="position-relative d-flex align-items-center justify-content-center"
                  style={{ cursor: "pointer", height: "520px" }}
                >
                  <img 
                    src="/FONDO2.svg" 
                    alt="Trailer" 
                    style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }} 
                  />
                  <div className="position-absolute btn-play-custom" data-aos="zoom-in" data-aos-delay="200">
                    <i className="bi bi-play-fill" style={{ fontSize: "3.2rem", color: palette.morado, marginLeft: "4px" }} />
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* SECCIÓN INFORMACIÓN DEL CÓMIC Y BOTÓN DE ACCIÓN */}
      <section className="py-5 px-3" style={{ background: palette.crema }}>
        <div className="container" style={{ maxWidth: "1100px" }}>
          <div 
            className="row align-items-center g-4 p-4 p-md-5 comic-box mx-auto" 
            data-aos="fade-up"
            data-aos-duration="900"
            style={{ position: "relative" }}
          >
            
            <div className="col-md-4 col-lg-3 text-center" data-aos="fade-right" data-aos-delay="200">
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

            <div className="col-md-8 col-lg-9 text-center text-md-start" data-aos="fade-left" data-aos-delay="300">
              <h2 style={{ fontFamily: fDisplay, fontSize: "2rem", fontWeight: 800, color: palette.morado, textTransform: "uppercase" }}>
                El Reloj de las Arenas
              </h2>

              <p style={{ fontSize: "1.05rem", lineHeight: 1.8, color: palette.borde, fontWeight: 600 }}>
                Un antiguo artefacto, capaz de viajar en el tiempo, ha permanecido oculto durante milenios en las pirámides de Egipto. Cuando Ninove, una arquitecta egipcia, lo activa por accidente, comienza una aventura que la llevará a cruzar civilizaciones, conocer a guardianes legendarios y descubrir que el <strong>Reloj de las Arenas</strong> no solo controla el tiempo... también el destino de la humanidad.
              </p>

              <div className="mt-4" data-aos="zoom-in" data-aos-delay="400">
                <button 
                  onClick={handleVerComic} 
                  className={`btn-ver-comic ${animando ? 'animar-salida' : ''}`}
                >
                  Leer Comic Ahora
                </button>
              </div>
            </div>

          </div>
        </div> 
      </section>

      {/* FOOTER */}
      <footer
        className="py-5" 
        style={{ background: palette.amarillo, borderTop: `6px solid ${palette.morado}` }}
      >
        <div className="container" data-aos="fade-up" data-aos-duration="800">
          <div className="row justify-content-between align-items-center gy-4 text-center text-md-start">
            
            <div className="col-12 col-md-4 d-flex flex-column align-items-center align-items-md-start">
              <Link to="/">
                <img src="/MANOLOGO.svg" alt="Piktara" style={{ width: "140px", filter: `drop-shadow(0 3px 0 ${palette.borde})` }} />
              </Link>
              <p className="mt-3 mb-0 text-muted" style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                2026 Piktara. Todos los derechos reservados.
              </p>
            </div>

            <div className="col-12 col-md-4 text-center">
              <p className="mb-2" style={{ fontFamily: fDisplay, fontSize: "1.1rem", color: palette.morado, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Explora
              </p>
              <div className="d-flex gap-4 justify-content-center fw-bold">
                <Link to="/" style={{ color: palette.borde, textDecoration: "none", fontFamily: fBody, fontWeight: 700, fontSize: "1rem" }}>
                  Inicio
                </Link>
                <Link to="/nuestro-comic" style={{ color: palette.borde, textDecoration: "none", fontFamily: fBody, fontWeight: 700, fontSize: "1rem" }}>
                  Nuestro Cómic
                </Link>
              </div>
            </div>

            <div className="col-12 col-md-3 text-center text-md-end">
              <p className="mb-3" style={{ fontFamily: fDisplay, fontSize: "1.1rem", color: palette.morado, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Siguenos
              </p>
              <div className="d-flex gap-4 justify-content-center justify-content-md-end">
                <a href="https://www.facebook.com/share/1CUVKmwfeK/" target="_blank" rel="noreferrer" className="btn-icon-circle" title="Facebook">
                  <i className="bi bi-facebook" style={{ fontSize: "1.4rem" }} />
                </a>

                <a href="https://www.instagram.com/____sanchez_10" target="_blank" rel="noreferrer" className="btn-icon-circle" title="Instagram">
                  <i className="bi bi-instagram" style={{ fontSize: "1.4rem" }} />
                </a>

                <a href="https://wa.me/573125965458" target="_blank" rel="noreferrer" className="btn-icon-circle" title="WhatsApp">
                  <i className="bi bi-whatsapp" style={{ fontSize: "1.4rem" }} />
                </a>
              </div>
            </div>

          </div>
        </div>
      </footer>

    </div>
  );
}