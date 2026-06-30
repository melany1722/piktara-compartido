import React, { useEffect, useRef, useState } from 'react'
import { Link } from "react-router-dom";
import lottie from "lottie-web";
import "../Comic.css";

const f = "Arial, sans-serif";

const Comic = () => {
  const lottieContainer = useRef(null);
  const animRef = useRef(null);

  const [score, setScore] = useState(0);
  const [relojEncontrado, setRelojEncontrado] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: lottieContainer.current,
      renderer: "svg",
      loop: true,
      autoplay: false,
      path: "/lottie/gifalien.json",
      rendererSettings: {
        preserveAspectRatio: "xMidYMid meet",
      },
    });

    animRef.current = anim;

    return () => anim.destroy();
  }, []);

  const handleClick = () => {
    if (animRef.current) {
      animRef.current.play();
    }
  };

  const handleRelojClick = (e) => {
    e.stopPropagation();
    if (!relojEncontrado) {
      setScore((prev) => prev + 1);
      setRelojEncontrado(true);
      setPulse(true);
      setTimeout(() => setPulse(false), 400);
    }
  };

  return (
    <div className="min-vh-100 w-100 fondo-desierto">

      {/* HEADER */}
      <nav className="navbar navbar-expand-lg px-5" style={{ background: "#c8a870" }}>
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
          <span style={{ marginRight: "8px", fontSize: "1.1rem" }}>⏳</span>
          {score}
        </div>

        <Link
          to="/nuestro-comic"
          className="d-flex align-items-center text-decoration-none"
          style={{ fontFamily: f, fontSize: "0.8rem", letterSpacing: "0.12em", color: "#2a2a2a", textTransform: "uppercase" }}
        >
          <i className="bi bi-arrow-left me-2" style={{ fontSize: "1.1rem" }}></i>
          Volver
        </Link>
      </nav>

      {/* ESCENARIO */}
      <div style={{ position: "relative", width: "100%" }}>

        {/* ANIMACIÓN LOTTIE */}
        <div
          ref={lottieContainer}
          onClick={handleClick}
          style={{
            width: "100%",
            aspectRatio: "1920 / 1080",
            cursor: "pointer",
          }}
        />

        {/* RELOJ ESCONDIDO */}
        {!relojEncontrado && (
          <img
            src="/lottie/images/img_0.png"
            alt=""
            onClick={handleRelojClick}
            style={{
              position: "absolute",
              bottom: "8%",
              right: "6%",
              width: "2.5%",
              cursor: "pointer",
              opacity: 0.55,
              filter: "sepia(0.6) brightness(0.8)",
              transform: "rotate(-15deg)",
            }}
          />
        )}

      </div>

    </div>
  )
}

export default Comic