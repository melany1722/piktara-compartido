import React, { useEffect, useRef } from 'react'
import { Link } from "react-router-dom";
import lottie from "lottie-web";
import animacionAdad from "../assets/adadsaludo.json";
import "../Comic.css";

const f = "Arial, sans-serif";

const EscenaJ = () => {
  const lottieContainer = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: lottieContainer.current,
      renderer: "svg",
      loop: false,
      autoplay: false,
      animationData: animacionAdad,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid meet",
      },
    });

    animRef.current = anim;

    return () => anim.destroy();
  }, []);

  const handleClick = () => {
    if (animRef.current) {
      animRef.current.goToAndPlay(0, true);
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

        <Link
          to="/nuestro-comic"
          className="ms-auto d-flex align-items-center text-decoration-none"
          style={{ fontFamily: f, fontSize: "0.8rem", letterSpacing: "0.12em", color: "#2a2a2a", textTransform: "uppercase" }}
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
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >

        {/* FONDO */}
        <img
          src="/lottiej/images/fondodesiertoo.jpg"
          alt=""
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
          }}
        />

        {/* Recuadro con la proporción del gif */}
        <div
          style={{
            position: "relative",
            height: "100%",
            aspectRatio: "1920 / 1080",
            maxWidth: "100%",
            zIndex: 1,
          }}
        >

          {/* ANIMACIÓN LOTTIE (clickeable, se repite en cada click) */}
          <div
            ref={lottieContainer}
            onClick={handleClick}
            style={{
              width: "100%",
              height: "100%",
              cursor: "pointer",
            }}
          />

        </div>

        {/* BOTÓN PROVISIONAL PARA PASAR A LA SIGUIENTE ESCENA */}
        <Link
          to="/comic/alien"
          style={{
            position: "absolute",
            bottom: "5%",
            right: "5%",
            zIndex: 10,
            fontFamily: f,
            fontSize: "0.8rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontWeight: "bold",
            color: "#2a2a2a",
            background: "#f4d9a0",
            padding: "10px 22px",
            borderRadius: "999px",
            textDecoration: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            border: "2px solid #2a2a2a",
          }}
        >
          Siguiente →
        </Link>

      </div>

    </div>
  )
}

export default EscenaJ