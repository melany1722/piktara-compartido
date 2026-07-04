import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from "react-router-dom";
import lottie from "lottie-web";
import "../Comic.css";

const f = "Arial, sans-serif";
const relojImg = "/lottie/images/img_0.png";

const scenes = [
  {
    route: "/comicj",
    animationPath: "/lottiej/animacionj.json",
    foundKey: "relojComicj",
    backgroundColor: "#c8a870",
  },
  {
    route: "/melany",
    animationPath: "/lottiem/fondomela.json",
    foundKey: "relojComick",
    backgroundColor: "#2a2a2a",
  },
  {
    route: "/comic",
    animationPath: "/lottie/gifalien.json",
    foundKey: "relojComic",
    backgroundColor: "#c8a870",
  },
];

const getInitialScene = (pathname) => {
  const sceneIndex = scenes.findIndex((scene) => scene.route === pathname);
  return sceneIndex >= 0 ? sceneIndex : 0;
};

const Comic = () => {
  const location = useLocation();
  const lottieContainer = useRef(null);
  const animRef = useRef(null);

  const [sceneIndex, setSceneIndex] = useState(() => getInitialScene(location.pathname));
  const scene = scenes[sceneIndex];

  const [score, setScore] = useState(() => Number(localStorage.getItem("piktaraScore")) || 0);
  const [relojEncontrado, setRelojEncontrado] = useState(() => localStorage.getItem(scene.foundKey) === "true");
  const [pulse, setPulse] = useState(false);
  const [reproducido, setReproducido] = useState(false);

  useEffect(() => {
    setSceneIndex(getInitialScene(location.pathname));
  }, [location.pathname]);

  useEffect(() => {
    setReproducido(false);
    setRelojEncontrado(localStorage.getItem(scene.foundKey) === "true");

    const anim = lottie.loadAnimation({
      container: lottieContainer.current,
      renderer: "svg",
      loop: true,
      autoplay: false,
      path: scene.animationPath,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid meet",
      },
    });

    animRef.current = anim;

    return () => anim.destroy();
  }, [scene]);

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
      localStorage.setItem(scene.foundKey, "true");
      setRelojEncontrado(true);
      setPulse(true);
      setTimeout(() => setPulse(false), 400);
    }
  };

  const goToPreviousScene = () => {
    setSceneIndex((currentScene) => Math.max(currentScene - 1, 0));
  };

  const goToNextScene = () => {
    setSceneIndex((currentScene) => Math.min(currentScene + 1, scenes.length - 1));
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
          <span style={{ marginRight: "8px", fontSize: "1.1rem" }}>⏳</span>
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
          backgroundColor: scene.backgroundColor,
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
                animation: "pulseClock 1.2s ease-in-out infinite",
                cursor: "pointer",
                zIndex: 10,
              }}
            />
          )}

          {/* RELOJ ESCONDIDO */}
          {!relojEncontrado && (
            <img
              src={relojImg}
              alt=""
              onClick={handleRelojClick}
              style={{
                position: "absolute",
                bottom: "30%",
                right: "12%",
                width: "3%",
                cursor: "pointer",
                opacity: 0.55,
                filter: "sepia(0.6) brightness(0.8)",
                transform: "rotate(-15deg)",
                zIndex: 50,
              }}
            />
          )}

          {/* BOTÓN ESCENA ANTERIOR */}
          {sceneIndex > 0 && (
            <button
              type="button"
              onClick={goToPreviousScene}
              className="d-flex align-items-center justify-content-center"
              style={{
                position: "absolute",
                top: "50%",
                left: "12px",
                transform: "translateY(-50%)",
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                border: "none",
                background: "rgba(42,42,42,0.7)",
                color: "#f4d9a0",
                fontSize: "1.6rem",
                zIndex: 60,
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                cursor: "pointer",
              }}
              aria-label="Escena anterior"
            >
              ‹
            </button>
          )}

          {/* BOTÓN SIGUIENTE ESCENA */}
          {sceneIndex < scenes.length - 1 && (
            <button
              type="button"
              onClick={goToNextScene}
              className="d-flex align-items-center justify-content-center"
              style={{
                position: "absolute",
                top: "50%",
                right: "12px",
                transform: "translateY(-50%)",
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                border: "none",
                background: "rgba(42,42,42,0.7)",
                color: "#f4d9a0",
                fontSize: "1.6rem",
                zIndex: 60,
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                cursor: "pointer",
              }}
              aria-label="Siguiente escena"
            >
              ›
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Comic
