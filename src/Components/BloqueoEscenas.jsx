import React, { useEffect, useRef, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import {
  EVENTO_PROGRESO,
  TOTAL_RELOJES,
  relojEncontrado,
  primeraEscenaPendiente,
} from "./Contador";

// =====================================================================
//  BLOQUEO DE ESCENAS
//  Guardar como: src/Components/BloqueoEscenas.jsx
//
//  Regla: para pasar a la escena N+1 hay que haber encontrado el reloj de la escena N.
//
//  Se usa en App.js en dos sitios:
//    1) <BloqueoEscenas />            una sola vez, dentro del <BrowserRouter>
//         - deja la flecha ">" (y el botón "Siguiente aventura") gris y con candado
//           mientras no se encuentre el reloj de la escena actual
//         - si la tocan, no navega y sale un aviso
//    2) <EscenaProtegida n={3}>…</EscenaProtegida>   envolviendo cada escena en su <Route>
//         - si escriben /comic/5 en la barra sin haber llegado, los manda a la
//           primera escena que todavía no han completado
//
//  No hay que tocar el código de las escenas: todo se decide aquí por la ruta
//  (/comic/N → siguiente = /comic/N+1).
//
//  BLOQUEO_ACTIVO = false  → apaga todo el bloqueo (útil para probar las escenas).
// =====================================================================

const BLOQUEO_ACTIVO = true;

const fDisplay = "'Baloo 2', 'Comic Sans MS', sans-serif";
const palette = { morado: "#5A189A", crema: "#FFF8E7", borde: "#3A2312" };

// "/comic/3" → 3 · cualquier otra ruta → null
const numeroDeEscena = (pathname) => {
  const m = pathname.match(/^\/comic\/(\d+)\/?$/);
  return m ? Number(m[1]) : null;
};

// Envuelve una escena: si todavía no se puede entrar a ella, redirige a la que toca
export const EscenaProtegida = ({ n, children }) => {
  if (!BLOQUEO_ACTIVO) return children;
  const pendiente = primeraEscenaPendiente();
  if (n > pendiente) return <Navigate to={`/comic/${pendiente}`} replace />;
  return children;
};

const BloqueoEscenas = () => {
  const { pathname } = useLocation();
  const [, refrescar] = useState(0);
  const [aviso, setAviso] = useState(false);
  const timer = useRef(null);

  // Se vuelve a calcular cada vez que se encuentra un reloj
  useEffect(() => {
    const alCambiar = () => refrescar((n) => n + 1);
    window.addEventListener(EVENTO_PROGRESO, alCambiar);
    return () => window.removeEventListener(EVENTO_PROGRESO, alCambiar);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  const actual = numeroDeEscena(pathname);
  // la última escena (8) no tiene siguiente, así que nunca se bloquea
  const bloqueada =
    BLOQUEO_ACTIVO && actual !== null && actual < TOTAL_RELOJES && !relojEncontrado(actual);
  const hrefSiguiente = actual !== null ? `/comic/${actual + 1}` : null;

  // Si tocan el enlace a la siguiente escena estando bloqueada: no navega y sale el aviso
  useEffect(() => {
    if (!bloqueada) return;
    const alClic = (e) => {
      const enlace = e.target && e.target.closest ? e.target.closest("a") : null;
      if (!enlace || enlace.getAttribute("href") !== hrefSiguiente) return;
      e.preventDefault();
      e.stopPropagation();
      setAviso(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setAviso(false), 2800);
    };
    // en fase de captura, para ganarle al Link de react-router
    document.addEventListener("click", alClic, true);
    return () => document.removeEventListener("click", alClic, true);
  }, [bloqueada, hrefSiguiente]);

  // Al desbloquearse (o cambiar de escena) el aviso se quita
  useEffect(() => {
    if (!bloqueada) setAviso(false);
  }, [bloqueada]);

  if (!bloqueada) return null;

  return (
    <>
      <style>{`
        /* flecha ">" y botón "Siguiente aventura" bloqueados */
        .comic-nav-btn[href="${hrefSiguiente}"],
        .comic-retry-btn[href="${hrefSiguiente}"] {
          opacity: 0.55;
          filter: grayscale(1);
          cursor: not-allowed !important;
        }
        .comic-nav-btn[href="${hrefSiguiente}"]:hover {
          transform: translateY(-50%) !important;
        }
        .comic-retry-btn[href="${hrefSiguiente}"] {
          position: relative;
        }
        .comic-retry-btn[href="${hrefSiguiente}"]:hover {
          transform: none !important;
        }
        .comic-nav-btn[href="${hrefSiguiente}"]::after,
        .comic-retry-btn[href="${hrefSiguiente}"]::after {
          content: "🔒";
          position: absolute;
          right: -8px;
          bottom: -8px;
          font-size: 1.1rem;
          line-height: 1;
        }
        @keyframes avisoBloqueoEntra {
          0% { opacity: 0; transform: translate(-50%, 12px); }
          100% { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>

      {aviso && (
        <div
          role="status"
          style={{
            position: "fixed",
            left: "50%",
            bottom: "28px",
            transform: "translateX(-50%)",
            zIndex: 9999,
            background: palette.crema,
            color: palette.morado,
            border: `3.5px solid ${palette.borde}`,
            borderRadius: "14px",
            boxShadow: `0 4px 0 ${palette.borde}`,
            padding: "8px 20px",
            fontFamily: fDisplay,
            fontWeight: 800,
            fontSize: "0.95rem",
            textAlign: "center",
            maxWidth: "90vw",
            animation: "avisoBloqueoEntra 0.25s ease-out",
          }}
        >
          🔒 Encuentra el reloj escondido de esta escena para desbloquear la siguiente
        </div>
      )}
    </>
  );
};

export default BloqueoEscenas;