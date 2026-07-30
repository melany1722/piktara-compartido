import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const fDisplay = "'Baloo 2', 'Comic Sans MS', sans-serif";

const palette = {
  morado: "#5A189A",
  amarillo: "#FFC300",
  crema: "#FFF8E7",
  borde: "#3A2312",
};

const seccionesPagina = [
  { id: "hero", titulo: "Inicio / Desierto", desc: "Sección principal con el desierto y pirámides", selector: "hero", link: "/" },
  { id: "que-es", titulo: "¿Qué es Piktara?", desc: "Explicación de los cómics interactivos", selector: "que-es", link: "/" },
  { id: "personajes", titulo: "Personajes", desc: "Conoce a Adad, Ninove y Naramsin", selector: "personajes", link: "/" },
  { id: "aventuras", titulo: "Otras Aventuras", desc: "Explora la Revolución y Crónicas del Imperio", selector: "aventuras", link: "/" },
  { id: "sobre-piktara", titulo: "Sobre Piktara", desc: "Información sobre el equipo y el proyecto", link: "/sobre-piktara" },
];

export default function Buscar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const resultados = query.trim() === "" 
    ? [] 
    : seccionesPagina.filter((item) =>
        item.titulo.toLowerCase().includes(query.toLowerCase()) ||
        item.desc.toLowerCase().includes(query.toLowerCase())
      );

  const irASeccion = (item) => {
    // 1. Cerrar el panel Offcanvas de Bootstrap
    const elem = document.getElementById("panelBuscar");
    if (elem) {
      const bsOffcanvas = window.bootstrap?.Offcanvas?.getInstance(elem);
      if (bsOffcanvas) bsOffcanvas.hide();
    }

    // 2. Ejecutar la navegación o el scroll
    if (item.selector) {
      if (location.pathname !== "/") {
        // Si no estamos en Home, vamos a Home y pasamos el destino
        navigate("/", { state: { scrollTo: item.selector } });
      } else {
        // Si ya estamos en Home, hacemos scroll directamente
        setTimeout(() => {
          const el = document.getElementById(item.selector);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 150);
      }
    } else if (item.link) {
      navigate(item.link);
    }

    setQuery("");
  };

  return (
    <>
      {/* BOTÓN LUPA  */}
      <i
        
        style={{ cursor: "pointer", fontSize: "1.2rem", color: "#2a2a2a" }}
        data-bs-toggle="offcanvas"
        data-bs-target="#panelBuscar"
        aria-controls="panelBuscar"
      />

      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="panelBuscar"
        aria-labelledby="panelBuscarLabel"
        style={{
          width: "380px",
          background: palette.crema,
          borderLeft: `6px solid ${palette.morado}`,
          boxShadow: `-10px 0 30px rgba(58, 35, 18, 0.15)`,
        }}
      >
        <div className="piktara-pop-card h-100 d-flex flex-column">
          {/* Cabecera */}
          <div className="offcanvas-header px-4 pt-4 pb-2 align-items-center justify-content-between">
            <div
              style={{
                background: palette.amarillo,
                border: `3.5px solid ${palette.borde}`,
                borderRadius: "16px",
                padding: "6px 20px",
                boxShadow: `0 4px 0 ${palette.borde}`,
              }}
            >
              <h5
                id="panelBuscarLabel"
                style={{
                  fontFamily: fDisplay,
                  fontWeight: 800,
                  fontSize: "1.2rem",
                  color: palette.morado,
                  margin: 0,
                  textTransform: "uppercase",
                }}
              >
                🔍 ¿Qué buscas?
              </h5>
            </div>

            <button
              type="button"
              className="btn-close-piktara d-flex align-items-center justify-content-center"
              data-bs-dismiss="offcanvas"
              aria-label="Cerrar"
              style={{
                width: "36px",
                height: "36px",
                background: palette.morado,
                color: palette.crema,
                borderRadius: "50%",
                border: `3px solid ${palette.borde}`,
                boxShadow: `0 3px 0 ${palette.borde}`,
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>

          {/* Cuerpo */}
          <div className="offcanvas-body px-4 pt-3 d-flex flex-column gap-3">
            <input
              type="text"
              className="form-control input-piktara-buscar"
              placeholder="Buscar 'Personajes', 'Piktara'..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                fontFamily: "'Quicksand', sans-serif",
                fontSize: "0.95rem",
                fontWeight: 700,
                color: palette.borde,
                background: "#fff",
                border: `3.5px solid ${palette.borde}`,
                borderRadius: "18px",
                padding: "12px 18px",
                boxShadow: `0 4px 0 ${palette.borde}22`,
              }}
            />

            <div className="d-flex flex-column gap-2 mt-2" style={{ maxHeight: "65vh", overflowY: "auto" }}>
              {query.trim() !== "" && resultados.length === 0 && (
                <p className="text-center py-3" style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, color: palette.borde }}>
                  😕 No encontramos la sección "{query}"
                </p>
              )}

              {resultados.map((item) => (
                <div
                  key={item.id}
                  className="resultado-card p-3"
                  onClick={() => irASeccion(item)}
                  style={{
                    background: "#fff",
                    border: `3px solid ${palette.borde}`,
                    borderRadius: "16px",
                    boxShadow: `0 3.5px 0 ${palette.borde}22`,
                  }}
                >
                  <h6
                    style={{
                      fontFamily: fDisplay,
                      fontWeight: 800,
                      color: palette.morado,
                      margin: 0,
                      textTransform: "uppercase",
                      fontSize: "0.95rem",
                    }}
                  >
                    👉 {item.titulo}
                  </h6>
                  <p
                    style={{
                      fontFamily: "'Quicksand', sans-serif",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: palette.borde,
                      margin: "4px 0 0 0",
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}