import { Link } from "react-router-dom";
import Buscar from "./Buscar";
import IniciarSeccion from "./IniciarSeccion";

const f = "Arial, sans-serif";

export default function Trailer() {
  return (
    <>
      <nav className="navbar navbar-expand-lg px-5" style={{ background: "#c8a870" }}>
        <Link to="/" className="navbar-brand me-5">
          <img src="/logo-piktara.png" alt="Piktara" style={{ height: "55px" }} />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu2">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-center" id="menu2">
          <ul className="navbar-nav gap-5">
            <li className="nav-item">
              <Link to="/sobre-piktara" className="nav-link" style={{ fontFamily: f, fontSize: "0.75rem", letterSpacing: "0.15em", color: "#2a2a2a", textTransform: "uppercase" }}>Sobre Piktara</Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#" style={{ fontFamily: f, fontSize: "0.75rem", letterSpacing: "0.15em", color: "#2a2a2a", textTransform: "uppercase", borderBottom: "2px solid #2a2a2a", paddingBottom: "2px" }}>Nuestro Cómic</a>
            </li>
          </ul>
        </div>
        <div className="d-flex gap-3 ms-auto align-items-center" style={{ fontSize: "1.2rem", color: "#2a2a2a" }}>
          <i className="bi bi-search" style={{ cursor: "pointer" }} data-bs-toggle="offcanvas" data-bs-target="#panelBuscar" />
          <i className="bi bi-person" style={{ cursor: "pointer" }} data-bs-toggle="offcanvas" data-bs-target="#panelLogin" />
        </div>
      </nav>

      <Buscar />
      <IniciarSeccion />

      {/* TABS */}
      <div className="d-flex justify-content-around" style={{ background: "#3a3a3a" }}>
        <Link to="/sobre-el-proyecto" className="px-5 py-3 text-decoration-none" style={{ fontFamily: f, fontSize: "0.75rem", letterSpacing: "0.18em", color: "#aaa", textTransform: "uppercase", borderBottom: "3px solid transparent" }}>
          Sobre el Proyecto
        </Link>
        <span className="px-5 py-3" style={{ fontFamily: f, fontSize: "0.75rem", letterSpacing: "0.18em", color: "#fff", textTransform: "uppercase", borderBottom: "3px solid #fff", cursor: "pointer" }}>
          Sobre el Cómic
        </span>
      </div>

      {/* TRAILER LABEL */}
      <div className="text-center py-3" style={{ background: "#f0ebe0" }}>
        <span style={{ fontFamily: f, fontSize: "0.85rem", letterSpacing: "0.3em", color: "#2a2a2a", textTransform: "uppercase" }}>TRAILER</span>
      </div>

      {/* TRAILER IMAGE */}
      <div className="position-relative" style={{ background: "#000" }}>
        <img src="/trailer_1.jpg" alt="Trailer" style={{ width: "100%", maxHeight: "380px", objectFit: "cover", opacity: 0.85 }} />
        <div className="position-absolute top-50 start-50 translate-middle d-flex align-items-center justify-content-center" style={{ width: "70px", height: "70px", border: "3px solid #fff", cursor: "pointer" }}>
          <i className="bi bi-play-fill" style={{ fontSize: "2.5rem", color: "#fff" }}></i>
        </div>
      </div>

      {/* SECCIÓN CÓMIC */}
      <section className="py-5" style={{ background: "#f0ebe0" }}>
        <div className="container">
          <div className="row align-items-start g-5">
            <div className="col-md-3">
              <img src="/comic_p.jpg" alt="El Reloj de las Arenas" style={{ width: "100%", borderRadius: "6px", boxShadow: "0 4px 16px rgba(0,0,0,0.18)" }} />
            </div>
            <div className="col-md-9">
              <p style={{ fontFamily: f, fontSize: "0.85rem", lineHeight: 1.9, color: "#3a3a3a", textAlign: "justify" }}>
                Un antiguo artefacto, capaz de viajar en el tiempo, ha permanecido oculto durante milenios en las pirámides de Egipto. Cuando Ninove, una arquitecta egipcia, lo activa por accidente, comienza una aventura que la llevará a cruzar civilizaciones, conocer a guardianes legendarios y descubrir que el Reloj de las Arenas no solo controla el tiempo... también el destino de la humanidad. Perseguidos por reyes y gobernantes que ansían su poder, Ninove y Adad deberán decidir: ¿proteger el conocimiento o arriesgarlo todo frente a la ambición?
              </p>
              <div className="mt-4">
                <a href="#" className="px-4 py-2 text-decoration-none fw-bold" style={{ fontFamily: f, fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", background: "#c8a870", color: "#2a2a2a", borderRadius: "4px" }}>
                  VER CÓMIC
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-5" style={{ background: "#c8a870" }}>
        <div className="container">
          <div className="row align-items-center justify-content-between">
            <div className="col-auto d-flex flex-column align-items-center gap-2">
              <Link to="/"><img src="/logo-piktara.png" alt="Piktara" style={{ width: "130px" }} /></Link>
              <span style={{ fontFamily: f, fontWeight: 700, letterSpacing: "0.4em", color: "#2a2a2a", fontSize: "1.1rem" }}>P I K T A R A</span>
            </div>
            <div className="col-auto text-center">
              <p className="mb-4" style={{ fontFamily: f, fontSize: "0.9rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#2a2a2a", fontWeight: 700 }}>Acerca de</p>
              <a href="#" className="d-block mb-3" style={{ fontFamily: f, fontSize: "0.82rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#2a2a2a", textDecoration: "none" }}>Nuestro Grupo</a>
              <a href="#" className="d-block" style={{ fontFamily: f, fontSize: "0.82rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#2a2a2a", textDecoration: "none" }}>Nuestro Proyecto</a>
            </div>
            <div className="col-auto text-center">
              <p className="mb-4" style={{ fontFamily: f, fontSize: "0.9rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#2a2a2a", fontWeight: 700 }}>Redes Sociales</p>
              <div className="d-flex gap-4 align-items-center justify-content-center">
                <a href="#" target="_blank" rel="noreferrer"><i className="bi bi-facebook" style={{ fontSize: "2.5rem", color: "#2a2a2a" }}></i></a>
                <a href="https://www.instagram.com/____sanchez_10?igsh=NHE0dTltcDU5MDFy&utm_source=qr" target="_blank" rel="noreferrer"><i className="bi bi-instagram" style={{ fontSize: "2.5rem", color: "#2a2a2a" }}></i></a>
                <a href="https://wa.me/573125965458" target="_blank" rel="noreferrer"><i className="bi bi-whatsapp" style={{ fontSize: "2.5rem", color: "#2a2a2a" }}></i></a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}