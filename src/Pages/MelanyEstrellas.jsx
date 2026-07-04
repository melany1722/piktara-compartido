import React, { useEffect, useRef, useState } from 'react'
import { Link } from "react-router-dom";
import lottie from "lottie-web";
import "../Comic.css";

const f = "Arial, sans-serif";
const relojImg = "/lottie/images/img_0.png";

const Comick = () => {
  const lottieContainer = useRef(null);
  const animRef = useRef(null);

  const [score, setScore] = useState(() => Number(localStorage.getItem("piktaraScore")) || 0);
  const [relojEncontrado, setRelojEncontrado] = useState(() => localStorage.getItem("relojComick") === "true");
  const [pulse, setPulse] = useState(false);
  const [reproducido, setReproducido] = useState(false);

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: lottieContainer.current,
      renderer: "svg",
      loop: true,
      autoplay: false,
      path: "/lottiem/fondomela.json",
      rendererSettings: {
        preserveAspectRatio: "xMidYMid meet",
      },
    });

    animRef.current = anim;

    return () => anim.destroy();
  }, []);

  const handlePlayClick = () => {
    if (animRef.current) {
      animRef.current.play();
      setReproducido(true);
    }
  };

  const handleRelojClick = (e) => {
  e.stopPropagation();

  if (!relojEncontrado) {
    const nuevoScore = score + 1;

    setScore(nuevoScore);
    localStorage.setItem("piktaraScore", nuevoScore);

    setRelojEncontrado(true);

    setPulse(true);
    setTimeout(() => setPulse(false), 400);
  }
};

  return (
    <div
      className="w-100"
      style={{
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >

      {/* HEADER */}
      <nav
        className="navbar navbar-expand-lg px-5"
        style={{ background: "#c8a870", flexShrink: 0 }}
      >
        <Link to="/" className="navbar-brand me-5">
          <img src="/logo-piktara.png" alt="Piktara" style={{ height: "55px" }} />
        </Link>

        {/* CONTADOR DE PUNTOS */}
        <div
          className="ms-auto me-4 d-flex align-items-center"
          style={{
            fontFamily: f,
            background: "#2a2a2a",
            color: "#f4d9a0",
            padding: "8px 18px",
            borderRadius: "999px",
            border: "2px solid #f4d9a0",
            boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
            fontSize: "0.85rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontWeight: "bold",
            animation: pulse ? "pulseScore 0.4s ease" : "none",
          }}
        >
          <img
            src={relojImg}
            alt=""
            style={{
              width: "22px",
              height: "22px",
              objectFit: "contain",
              marginRight: "8px",
            }}
          />
          {score}
        </div>

        <Link
          to="/nuestro-comic"
          className="d-flex align-items-center text-decoration-none"
          style={{
            fontFamily: f,
            fontSize: "0.8rem",
            letterSpacing: "0.12em",
            color: "#2a2a2a",
            textTransform: "uppercase",
          }}
        >
          <i className="bi bi-arrow-left me-2" style={{ fontSize: "1.1rem" }}></i>
          Volver
        </Link>
      </nav>

      {/* ESCENARIO */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          backgroundColor: "#2a2a2a",
        }}
      >
        <div
          style={{
            position: "relative",
            height: "100%",
            aspectRatio: "1920 / 1080",
            maxWidth: "100%",
          }}
        >

          {/* ANIMACIÓN LOTTIE */}
          <div
            ref={lottieContainer}
            style={{
              width: "100%",
              height: "100%",
            }}
          />

          {/* BOTÓN DE PLAY */}
          {!reproducido && (
            <img
              src={relojImg}
              alt="Reproducir animación"
              onClick={handlePlayClick}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "90px",
                height: "90px",
                objectFit: "contain",
                animation: "pulseClock 1.2s ease-in-out infinite",
                cursor: "pointer",
                zIndex: 20,
                filter: "drop-shadow(0 0 10px rgba(255, 230, 160, 0.85))",
              }}
            />
          )}

{/* RELOJ ESCONDIDO */}
{!relojEncontrado && (
  <img
    src={relojImg}
    alt="Reloj escondido"
    onClick={handleRelojClick}
    style={{
      position: "absolute",

      // Posición del reloj
      left: "51.2%",
      top: "47.5%",

      transform: "translate(-50%, -50%) rotate(-18deg)",

      // Tamaño
      width: "30px",
      height: "30px",
      objectFit: "contain",

      // Apariencia
      opacity: 0.55,
      cursor: "pointer",
      zIndex: 999,
      pointerEvents: "auto",

      filter: "drop-shadow(0 0 3px rgba(255,220,120,.6))",
    }}
  />
)}
          {/* BOTÓN ESCENA ANTERIOR */}
          <Link
            to="/comicj"
            className="d-flex align-items-center justify-content-center text-decoration-none"
            style={{
              position: "absolute",
              top: "50%",
              left: "12px",
              transform: "translateY(-50%)",
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "rgba(42,42,42,0.7)",
              color: "#f4d9a0",
              fontSize: "1.6rem",
              zIndex: 15,
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
            aria-label="Escena anterior"
          >
            ‹
          </Link>

          {/* BOTÓN SIGUIENTE ESCENA */}
          <Link
            to="/comic"
            className="d-flex align-items-center justify-content-center text-decoration-none"
            style={{
              position: "absolute",
              top: "50%",
              right: "12px",
              transform: "translateY(-50%)",
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "rgba(42,42,42,0.7)",
              color: "#f4d9a0",
              fontSize: "1.6rem",
              zIndex: 15,
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
            aria-label="Siguiente escena"
          >
            ›
          </Link>

        </div>
      </div>
    </div>
  )
}

export default Comick
