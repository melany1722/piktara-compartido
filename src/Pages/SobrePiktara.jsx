import React from "react";
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

const equipo = [
  { 
    nombre: "KEVIN RESTREPO", 
    img: "/kevin.png", 
    desc: "Tengo 18 años, me gusta mucho el arte y la historia. Soy muy creativo y me apasiona el diseño gráfico." 
  },
  { 
    nombre: "MELANY BELTRAN", 
    img: "/melany.png", 
    desc: "Tengo 18 años. Entre mis pasiones está el arte abstracto y el dibujo; me considero una chica alegre y solidaria." 
  },
  { 
    nombre: "JUAN LOPERA", 
    img: "/juan.png", 
    desc: "Tengo 18 años, apasionado por la tecnología, los videojuegos y la creatividad aplicada al diseño gráfico." 
  },
];

export default function SobrePiktara() {
  return (
    <div style={{ background: palette.crema, minHeight: "100vh", fontFamily: fBody, color: palette.borde }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Quicksand:wght@500;600;700&display=swap');
        
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

        .btn-icon-circle {
          width: 44px;
          height: 44px;
          background: ${palette.crema};
          border: 3px solid ${palette.borde};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${palette.borde};
          transition: transform 0.2s ease, background-color 0.2s ease, color 0.2s ease;
          box-shadow: 0 4px 0 ${palette.borde};
          cursor: pointer;
          text-decoration: none;
        }
        .btn-icon-circle:hover {
          transform: translateY(-3px) scale(1.08);
          background: ${palette.morado};
          color: ${palette.amarillo};
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

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuSobre" style={{ borderColor: palette.borde }}>
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-center" id="menuSobre">
          <ul className="navbar-nav gap-3 align-items-center">
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
                Sobre Piktara
              </a>
            </li>
            <li className="nav-item">
              <Link to="/nuestro-comic" className="nav-btn-link">
                Nuestro Cómic
              </Link>
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

      {/* BANNER PRINCIPAL */}
      <div className="py-5 px-3" style={{ background: palette.crema, borderBottom: `5px solid ${palette.borde}` }}>
        <div className="container text-center py-3 position-relative" style={{ maxWidth: "850px" }}>
          
          <div 
            className="p-4 p-md-5 position-relative"
            style={{
              background: "#ffffff",
              borderRadius: "36px",
              border: `6px solid ${palette.borde}`,
              boxShadow: `0 10px 0 ${palette.borde}`
            }}
          >
            <h1 
              style={{ 
                fontFamily: fDisplay, 
                fontSize: "3rem", 
                fontWeight: 800, 
                color: palette.morado,
                letterSpacing: "0.05em",
                textShadow: `0 3px 0 ${palette.amarillo}`,
                marginBottom: "1rem"
              }}
            >
              BIENVENIDOS A PIKTARA
            </h1>

            <p style={{ fontFamily: fBody, fontSize: "1.05rem", lineHeight: 1.8, color: palette.borde, fontWeight: 600, margin: 0 }}>
              Piktara es una marca creativa que une arte, historia y narrativa digital. Su esencia nace de la inspiración en lo místico y antiguo, transformado en experiencias modernas como cómics interactivos y proyectos visuales llenos de imaginación.
            </p>
          </div>

        </div>
      </div>

      {/* SECCIÓN ORIGEN DEL NOMBRE */}
      <section className="py-5 px-3">
        <div className="container">
          <div 
            className="row align-items-center g-4 p-4 p-md-5"
            style={{
              background: "#ffffff",
              borderRadius: "32px",
              border: `5px solid ${palette.borde}`,
              boxShadow: `0 8px 0 ${palette.borde}`,
              position: "relative"
            }}
          >
            <div className="col-md-5 text-center text-md-start">
              <h2 style={{ fontFamily: fDisplay, fontSize: "1.8rem", fontWeight: 800, color: palette.morado, lineHeight: 1.3, margin: 0 }}>
                ¿Cómo surge el nombre PIKTARA?
              </h2>
            </div>
            <div className="col-md-7">
              <p style={{ fontSize: "1rem", lineHeight: 1.8, color: palette.borde, fontWeight: 600, margin: 0 }}>
                Surge de la conexión con la historia antigua:
                <br /><br />
                <strong>"PIK":</strong> Proviene de los pictogramas y jeroglíficos egipcios, entendiendo la escritura como un arte visual y sagrado.
                <br />
                <strong>"TARA":</strong> Se relaciona con el concepto de las estrellas y astros que guiaban la navegación y el tiempo en las civilizaciones antiguas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN EQUIPO */}
      <section className="py-5 px-3" style={{ background: palette.amarillo, borderTop: `5px solid ${palette.borde}` }}>
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
                display: "inline-block"
              }}
            >
              NUESTRO EQUIPO
            </span>
          </div>

          <div className="row justify-content-center g-4">
            {equipo.map((miembro, i) => (
              <div key={i} className="col-12 col-md-4 d-flex">
                <div className="piktara-card text-center p-4 w-100 d-flex flex-column align-items-center position-relative">
                  
                  <div 
                    className="mb-3 overflow-hidden"
                    style={{
                      width: "160px",
                      height: "200px",
                      borderRadius: "20px",
                      border: `4px solid ${palette.borde}`,
                      background: palette.crema,
                      boxShadow: `0 5px 0 ${palette.borde}`
                    }}
                  >
                    {miembro.img ? (
                      <img src={miembro.img} alt={miembro.nombre} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                        <i className="bi bi-person-fill" style={{ fontSize: "4rem", color: palette.morado }} />
                      </div>
                    )}
                  </div>

                  <h3 style={{ fontFamily: fDisplay, fontSize: "1.3rem", fontWeight: 800, color: palette.morado }}>
                    {miembro.nombre}
                  </h3>

                  <p style={{ fontSize: "0.92rem", lineHeight: 1.6, color: palette.borde, fontWeight: 600, margin: 0 }}>
                    {miembro.desc}
                  </p>

                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-4" style={{ background: palette.amarillo, borderTop: `6px solid ${palette.borde}` }}>
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
                <a href="#" style={{ color: palette.borde, textDecoration: "none" }}>Sobre Piktara</a>
                <span>•</span>
                <Link to="/nuestro-comic" style={{ color: palette.borde, textDecoration: "none" }}>Nuestro Cómic</Link>
              </div>
            </div>

            <div className="col-12 col-md-auto text-center">
              <p className="mb-2" style={{ fontFamily: fDisplay, fontSize: "1.1rem", color: palette.morado, fontWeight: 800 }}>
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
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
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