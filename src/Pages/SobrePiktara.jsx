import { Link } from "react-router-dom";
import Buscar from "./Buscar";
import IniciarSeccion from "./IniciarSeccion";

const f = "Arial, sans-serif";

const equipo = [
  { nombre: "KEVIN RESTREPO", img: "/kevin.png", desc: "tengo 18 años, me gusta mucho el arte y la historia, soy muy creativo y me gusta mucho el diseño gráfico." },
  { nombre: "MELANY BELTRAN", img: "/melany.png", desc: "tengo 18 años y entre mis pasiones es el arte abstracto, todo lo relacionado con el dibujo y el arte, soy una chica solidaria y alegre." },
  { nombre: "JUAN LOPERA", img: "/juan.png", desc: "tengo 18 años y me gusta mucho la tecnología y los videojuegos, soy un chico muy creativo y me gusta mucho el diseño gráfico." },
];

export default function SobrePiktara() {
  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg px-5" style={{ background: "#c8a870" }}>
        <Link to="/" className="navbar-brand me-5">
          <img src="/logo-piktara.png" alt="Piktara" style={{ height: "55px" }} />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuSobre">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-center" id="menuSobre">
          <ul className="navbar-nav gap-5">
            <li className="nav-item">
              <a className="nav-link" href="#" style={{ fontFamily: f, fontSize: "0.75rem", letterSpacing: "0.15em", color: "#2a2a2a", textTransform: "uppercase", borderBottom: "2px solid #2a2a2a", paddingBottom: "2px" }}>
                Sobre Piktara
              </a>
            </li>
            <li className="nav-item">
              <Link to="/nuestro-comic" className="nav-link" style={{ fontFamily: f, fontSize: "0.75rem", letterSpacing: "0.15em", color: "#2a2a2a", textTransform: "uppercase" }}>
                Nuestro Cómic
              </Link>
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

      {/* HERO */}
      <div className="position-relative overflow-hidden" style={{ minHeight: "400px" }}>
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundImage: "url('/atardecer_1.jpg')", backgroundSize: "cover", backgroundPosition: "center", zIndex: 0 }} />
        <div className="position-relative d-flex flex-column align-items-center justify-content-center text-center py-5 px-4" style={{ zIndex: 2, minHeight: "400px" }}>
          <h1 className="fw-bold mb-3" style={{ fontFamily: f, fontSize: "2.2rem", letterSpacing: "0.3em", color: "#fff", textTransform: "uppercase" }}>
            PIKTARA
          </h1>
          <p className="fst-italic" style={{ fontFamily: f, fontSize: "0.88rem", lineHeight: 1.85, color: "#fff", maxWidth: "600px", textShadow: "0 1px 8px rgba(0,0,0,0.6)" }}>
            Piktara es una marca fuerte, elegante y sofisticada, es una marca creativa que une arte, historia y narrativa digital. Su esencia nace de la inspiración en lo antiguo y lo místico, transformado en experiencias modernas como cómics y proyectos visuales. Representa innovación, imaginación y conexión con símbolos que trascienden el tiempo.
          </p>
        </div>
      </div>

      {/* BANNER */}
      <div className="text-center py-4" style={{ background: "#e8d5b0" }}>
        <span style={{ fontFamily: f, fontSize: "1.1rem", letterSpacing: "0.45em", color: "#2a2a2a", textTransform: "uppercase" }}>P I K T A R A</span>
      </div>

      {/* ¿CÓMO SURGE? */}
      <section className="py-5" style={{ background: "#f0ebe0" }}>
        <div className="container">
          <div className="row align-items-start g-5">
            <div className="col-md-4">
              <h2 style={{ fontFamily: f, fontSize: "1rem", letterSpacing: "0.12em", color: "#2a2a2a", textTransform: "uppercase", fontWeight: 700, lineHeight: 1.6 }}>
                ¿CÓMO SURGE EL NOMBRE PIKTARA?
              </h2>
            </div>
            <div className="col-md-8">
              <p style={{ fontFamily: f, fontSize: "0.85rem", lineHeight: 1.9, color: "#3a3a3a" }}>
                PIKTARA surge Del Egipto antiguo, Se conecta con los jeroglíficos y los pictogramas (de ahí "PIK"), ya que la escritura egipcia era una forma de arte visual y sagrada. "TARA" puede relacionarse con el concepto de estrella, muy importante en Egipto porque los astros (como Sirio) guiaban las cosechas, los calendarios y hasta la construcción de las pirámides.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* EQUIPO */}
      <section className="py-5" style={{ background: "#c8a870" }}>
        <h2 className="text-center mb-5" style={{ fontFamily: f, fontSize: "1.3rem", letterSpacing: "0.22em", color: "#2a2a2a", textTransform: "uppercase" }}>
          EQUIPO
        </h2>
        <div className="container">
          <div className="row justify-content-center g-4">
            {equipo.map((miembro, i) => (
              <div key={i} className="col-12 col-md-4 text-center">
                <div className="mx-auto mb-3" style={{ width: "160px", height: "200px", background: "#f0ebe0", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  {miembro.img
                    ? <img src={miembro.img} alt={miembro.nombre} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <i className="bi bi-person-fill" style={{ fontSize: "5rem", color: "#2a2a2a", opacity: 0.3 }} />
                  }
                </div>
                <p className="fw-bold mb-1" style={{ fontFamily: f, fontSize: "0.8rem", letterSpacing: "0.15em", color: "#2a2a2a", textTransform: "uppercase" }}>
                  {miembro.nombre}
                </p>
                <p style={{ fontFamily: f, fontSize: "0.78rem", lineHeight: 1.7, color: "#5a5a5a", maxWidth: "260px", margin: "0 auto" }}>
                  {miembro.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-5" style={{ background: "#c8a870" }}>
        <div className="container">
          <div className="row align-items-center justify-content-between">
            <div className="col-auto d-flex flex-column align-items-center gap-2">
              <Link to="/">
                <img src="/logo-piktara.png" alt="Piktara" style={{ width: "130px" }} />
              </Link>
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
                <a href="https://www.facebook.com/share/1CUVKmwfeK/" target="_blank" rel="noreferrer"><i className="bi bi-facebook" style={{ fontSize: "2.5rem", color: "#2a2a2a" }}></i></a>
                <a href="https://www.instagram.com/____sanchez_10" target="_blank" rel="noreferrer"><i className="bi bi-instagram" style={{ fontSize: "2.5rem", color: "#2a2a2a" }}></i></a>
                <a href="https://wa.me/573125965458" target="_blank" rel="noreferrer"><i className="bi bi-whatsapp" style={{ fontSize: "2.5rem", color: "#2a2a2a" }}></i></a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}