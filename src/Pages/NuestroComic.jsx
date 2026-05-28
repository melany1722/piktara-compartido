import { useState } from "react";

const tabs = {
  proyecto: {
    title: "SOBRE EL PROYECTO",
    text: 'El proyecto "Primeras civilizaciones y la invención de la escritura" busca acercar a los niños y jóvenes al conocimiento histórico mediante un cómic digital interactivo transmedia. A través de ilustraciones, animaciones, sonido y decisiones del lector, se crea una experiencia de aprendizaje dinámica, entretenida e inmersiva.',
    bg: "/hero-proyecto.png",
    rust: true,
  },
  funciona: {
    title: "¿CÓMO FUNCIONA?",
    text: "Un cómic digital interactivo permite al lector tomar decisiones que afectan la narrativa, combinando texto, imágenes, audio y animación. Además, al ser transmedia, la historia puede expandirse en diferentes formatos y plataformas.",
    bg: "/comic-funciona.png",
    rust: false,
  },
  objetivo: {
    title: "OBJETIVO DEL PROYECTO",
    text: "Desarrollar un cómic digital interactivo transmedia sobre las primeras civilizaciones y la invención de la escritura, que permita a los estudiantes aprender historia de forma dinámica, entretenida e inmersiva, fomentando el pensamiento crítico y la creatividad.",
    bg: "/comic-objetivo.png",
    rust: false,
  },
};

const f = "Arial, sans-serif";

export default function NuestroComic() {
  const [tab, setTab] = useState("proyecto");
  const c = tabs[tab];

  return (
    <>
     

      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg px-5" style={{ background: "#c8a870" }}>
        <a className="navbar-brand me-5" href="#">
          <img src="/logo-piktara.png" alt="Piktara" style={{ height: "55px" }} />
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-center" id="menu">
          <ul className="navbar-nav gap-5">
            <li className="nav-item">
              <a className="nav-link" href="#" style={{ fontFamily: f, fontSize: "0.75rem", letterSpacing: "0.15em", color: "#2a2a2a", textTransform: "uppercase" }}>Sobre Piktara</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#" style={{ fontFamily: f, fontSize: "0.75rem", letterSpacing: "0.15em", color: "#2a2a2a", textTransform: "uppercase", borderBottom: "2px solid #2a2a2a", paddingBottom: "2px" }}>Nuestro Cómic</a>
            </li>
          </ul>
        </div>
        <div className="d-flex gap-3 ms-auto" style={{ fontSize: "1.2rem", color: "#2a2a2a" }}>
          <i className="bi bi-search" style={{ cursor: "pointer" }}></i>
          <i className="bi bi-person" style={{ cursor: "pointer" }}></i>
        </div>
      </nav>

     {/* TABS PRINCIPALES */}
<div className="d-flex justify-content-around" style={{ background: "#3a3a3a" }}>
  {["Sobre el Proyecto", "Sobre el Cómic"].map((label, i) => (
    <span key={i} className="px-5 py-3" style={{ fontFamily: f, fontSize: "0.75rem", letterSpacing: "0.18em", color: i === 0 ? "#fff" : "#aaa", textTransform: "uppercase", borderBottom: i === 0 ? "3px solid #fff" : "3px solid transparent", cursor: "pointer" }}>
      {label}
    </span>
  ))}
</div>

      {/* HERO */}
      <div className="position-relative overflow-hidden" style={{ minHeight: "400px" }}>
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundImage: `url('${c.bg}')`, backgroundSize: "cover", backgroundPosition: "center", zIndex: 0 }} />
        {c.rust && (
          <div className="position-absolute top-0 start-0 h-100" style={{ width: "38%", background: "#9b4e2a", clipPath: "polygon(0 0, 85% 0, 100% 100%, 0 100%)", zIndex: 1 }} />
        )}
        {!c.rust && (
          <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: "rgba(0,0,0,0.35)", zIndex: 1 }} />
        )}
        <div className="position-relative container-fluid py-5 px-5 d-flex align-items-center" style={{ zIndex: 2, minHeight: "400px" }}>
          <div className="row align-items-center w-100">
            <div className="col-lg-4 col-md-5">
              <p className="fw-bold mb-0" style={{ fontFamily: f, fontSize: "1.4rem", letterSpacing: "0.08em", color: "#fff", textTransform: "uppercase", lineHeight: 1.5 }}>
                {c.title}
              </p>
            </div>
            <div className="col-lg-6 col-md-7 offset-lg-1">
              <p className="mb-0 fst-italic text-center" style={{ fontFamily: f, fontSize: "0.88rem", lineHeight: 1.8, color: "#fff", textShadow: "0 1px 8px rgba(0,0,0,0.6)" }}>
                {c.text}
              </p>
            </div>
          </div>
        </div>
        {!c.rust && (
          <div className="position-absolute d-flex align-items-center justify-content-center" style={{ bottom: "24px", right: "24px", zIndex: 10, width: "54px", height: "54px", borderRadius: "50%", background: "rgba(232,213,176,0.92)", border: "2.5px solid #2a2a2a", fontSize: "1.8rem", color: "#2a2a2a", cursor: "pointer" }}>
            +
          </div>
        )}
      </div>

     {/* SUBTABS */}
<div className="d-flex justify-content-center" style={{ background: "#2a2a2a" }}>
  {[
    { key: "proyecto", label: "Sobre el Proyecto" },
    { key: "funciona", label: "¿Cómo Funciona?" },
    { key: "objetivo", label: "Objetivo del Proyecto" }
  ].map(({ key, label }) => (
    <span key={key} onClick={() => setTab(key)} className="px-5 py-3" style={{ fontFamily: f, fontSize: "0.72rem", letterSpacing: "0.12em", color: tab === key ? "#fff" : "#aaa", textTransform: "uppercase", borderBottom: tab === key ? "3px solid #c8a870" : "3px solid transparent", cursor: "pointer" }}>
      {label}
    </span>
  ))}
</div>

      {/* SOBRE EL COMIC */}
      <section className="py-5" style={{ background: "#f0ebe0" }}>
        <h2 className="text-center mb-4" style={{ fontFamily: f, fontSize: "1.3rem", letterSpacing: "0.22em", color: "#2a2a2a" }}>
          SOBRE EL COMIC
        </h2>
        <div className="container">
          <div className="row g-3 justify-content-center mb-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="col-4 col-md-3">
                <div className="rounded-3" style={{ background: "#f0a830", aspectRatio: "3/4" }} />
              </div>
            ))}
          </div>
          <div className="row g-3 justify-content-center mb-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="col-4 col-md-3">
                <div className="rounded-3" style={{ background: "#f0a830", aspectRatio: "3/4" }} />
              </div>
            ))}
          </div>
          <div className="row justify-content-center">
            <div className="col-md-7">
              <div className="p-4 rounded-2" style={{ fontFamily: f, background: "#7a6a5a", color: "#f5f0e8", fontSize: "0.82rem", lineHeight: 1.75 }}>
                Nuestro cómic habla de las primeras civilizaciones y la invención de la escritura, que hace énfasis a las primeras ciudades y pueblos: Mesopotamia, Egipto, etc. Este tema marca el inicio de lo que llamamos Historia. Antes de eso, los pueblos transmitían sus conocimientos solo de forma oral, lo que podía olvidarse fácilmente.
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
              <img src="/logo-piktara.png" alt="Piktara" style={{ width: "130px" }} />
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
                <a href="#" target="_blank" rel="noreferrer">
                  <i className="bi bi-facebook" style={{ fontSize: "2.5rem", color: "#2a2a2a" }}></i>
                </a>
                <a href="https://www.instagram.com/____sanchez_10?igsh=NHE0dTltcDU5MDFy&utm_source=qr" target="_blank" rel="noreferrer">
                  <i className="bi bi-instagram" style={{ fontSize: "2.5rem", color: "#2a2a2a" }}></i>
                </a>
                <a href="https://wa.me/573125965458" target="_blank" rel="noreferrer">
                  <i className="bi bi-whatsapp" style={{ fontSize: "2.5rem", color: "#2a2a2a" }}></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}