import { Link } from "react-router-dom";
import Buscar from "./Buscar";
import IniciarSeccion from "./IniciarSeccion";

const f = "Arial, sans-serif";

const personajes = [
  { nombre: "ADAD", img: "/adad.png" },
  { nombre: "NINOVE", img: "/ninove.png" },
  { nombre: "NARAMSIN", img: "/naramsin.png" },
];

export default function Home() {
  return (
    <>
      <nav className="navbar navbar-expand-lg px-5" style={{ background: "#c8a870" }}>
        <Link to="/" className="navbar-brand me-5">
          <img src="/logo-piktara.png" alt="Piktara" style={{ height: "55px" }} />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuHome">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-center" id="menuHome">
          <ul className="navbar-nav gap-5">
            <li className="nav-item">
              <Link to="/sobre-piktara" className="nav-link" style={{ fontFamily: f, fontSize: "0.75rem", letterSpacing: "0.15em", color: "#2a2a2a", textTransform: "uppercase" }}>Sobre Piktara</Link>
            </li>
            <li className="nav-item">
              <Link to="/nuestro-comic" className="nav-link" style={{ fontFamily: f, fontSize: "0.75rem", letterSpacing: "0.15em", color: "#2a2a2a", textTransform: "uppercase" }}>Nuestro Cómic</Link>
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
      <div className="position-relative overflow-hidden" style={{ minHeight: "420px" }}>
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundImage: "url('/piramide 1.png')", backgroundSize: "cover", backgroundPosition: "center", zIndex: 0 }} />
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: "rgba(0,0,0,0.15)", zIndex: 1 }} />
      </div>

      {/* ¿QUÉ ES? */}
      <section className="py-5" style={{ background: "#e8d5b0" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
              <h2 style={{ fontFamily: f, fontSize: "1rem", letterSpacing: "0.15em", color: "#2a2a2a", textTransform: "uppercase", fontWeight: 700, marginBottom: "1.2rem" }}>
                ¿QUÉ ES UN CÓMIC DIGITAL INTERACTIVO?
              </h2>
              <p style={{ fontFamily: f, fontSize: "0.82rem", lineHeight: 1.85, color: "#3a3a3a" }}>
                Un cómic digital interactivo es una nueva forma de contar historias que combina ilustraciones, texto, animaciones y decisiones del lector. A diferencia de un cómic tradicional, el lector puede tomar decisiones que afectan el desarrollo de la narrativa, convirtiendo la lectura en una experiencia inmersiva y personalizada.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PERSONAJES */}
      <section className="py-5" style={{ background: "#f0ebe0" }}>
        <h2 className="text-center mb-5" style={{ fontFamily: f, fontSize: "1rem", letterSpacing: "0.22em", color: "#2a2a2a", textTransform: "uppercase", fontWeight: 700 }}>
          PERSONAJES
        </h2>
        <div className="container">
          <div className="row justify-content-center g-4">
            {personajes.map((p, i) => (
              <div key={i} className="col-6 col-md-3 text-center">
                <img src={p.img} alt={p.nombre} className="rounded-3 mb-3" style={{ width: "100%", maxWidth: "180px", aspectRatio: "3/4", objectFit: "cover", objectPosition: "top" }} />
                <p style={{ fontFamily: f, fontSize: "0.78rem", letterSpacing: "0.18em", color: "#2a2a2a", textTransform: "uppercase", fontWeight: 600 }}>{p.nombre}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DESCUBRE MÁS AVENTURAS */}
      <section className="py-5" style={{ background: "#c8a870" }}>
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-md-5">
              <h2 style={{ fontFamily: f, fontSize: "1.1rem", letterSpacing: "0.18em", color: "#2a2a2a", textTransform: "uppercase", fontWeight: 700, lineHeight: 1.6 }}>
                DESCUBRE MÁS<br />AVENTURAS
              </h2>
            </div>
            <div className="col-md-7 d-flex justify-content-center gap-3 align-items-end">
              <img src="/revolucion2 1.png" alt="Revolución" className="rounded-3" style={{ height: "180px", objectFit: "cover" }} />
              <img src="/Imagen de WhatsApp 2025-10-03 a las 12.53.55_32a9272f 2.png" alt="Crónicas del Imperio" className="rounded-3" style={{ height: "210px", objectFit: "cover" }} />
              <img src="/bixuales2 1.png" alt="Bisual" className="rounded-3" style={{ height: "180px", objectFit: "cover" }} />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-5" style={{ background: "#c8a870", borderTop: "1px solid rgba(0,0,0,0.1)" }}>
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