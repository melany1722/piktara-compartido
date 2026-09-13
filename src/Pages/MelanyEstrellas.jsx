import React, { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";
import lottie from "lottie-web";
import "../Comic.css";

const fDisplay = "'Baloo 2', 'Comic Sans MS', sans-serif";

const palette = {
  morado: "#5A189A",
  amarillo: "#FFC300",
  crema: "#FFF8E7",
  borde: "#3A2312",
  rosa: "#FF597B",
  verde: "#00E676",
  fondoEscena: "#D9C7FF",
};

const relojImg = "/lottie/images/img_0.png";

const WashiTape = ({ top, left, right, rotate, color }) => (
  <div
    style={{
      position: "absolute",
      top,
      left,
      right,
      width: "70px",
      height: "26px",
      background: color,
      border: `2.5px solid ${palette.borde}`,
      transform: `rotate(${rotate}deg)`,
      boxShadow: `0 3px 0 ${palette.borde}`,
      borderRadius: "4px",
      zIndex: 40,
    }}
  />
);

const MelanyEstrellas = () => {
  const lottieContainer = useRef(null);
  const animRef = useRef(null);

  const [score, setScore] = useState(() => Number(localStorage.getItem("piktaraScore")) || 0);
  const [relojEncontrado, setRelojEncontrado] = useState(() => localStorage.getItem("relojMelany") === "true");
  const [pulse, setPulse] = useState(false);
  const [reproducido, setReproducido] = useState(false);

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: lottieContainer.current,
      renderer: "svg",
      loop: false,
      autoplay: false,
      path: "/lottiem/fondomela.json",
      rendererSettings: {
        preserveAspectRatio: "xMidYMid meet",
      },
    });

    animRef.current = anim;

    anim.addEventListener('complete', () => {
      setReproducido(false);
    });

    return () => {
      anim.destroy();
    };
  }, []);

  const handlePlayClick = () => {
    if (animRef.current) {
      animRef.current.goToAndPlay(0, true);
      setReproducido(true);
    }
  };

  const handleRelojClick = (e) => {
    e.stopPropagation();

    if (!relojEncontrado) {
      const nuevoScore = score + 1;
      setScore(nuevoScore);
      localStorage.setItem("piktaraScore", nuevoScore);
      localStorage.setItem("relojMelany", "true");
      setRelojEncontrado(true);
      setPulse(true);
      setTimeout(() => setPulse(false), 500);
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
        position: "relative",
        background: palette.crema,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Quicksand:wght@500;600;700&display=swap');

        @keyframes scorePop {
          0% { transform: scale(1); }
          40% { transform: scale(1.35) rotate(6deg); }
          70% { transform: scale(0.9) rotate(-4deg); }
          100% { transform: scale(1); }
        }
        @keyframes wiggleSticker {
          0%, 100% { transform: translate(-50%, -50%) rotate(-18deg) scale(1); }
          50% { transform: translate(-50%, -50%) rotate(-10deg) scale(1.08); }
        }
        @keyframes playBounce {
          0%, 100% { transform: translate(-50%, -50%) scale(1); box-shadow: 0 8px 0 ${palette.borde}; }
          50% { transform: translate(-50%, -54%) scale(1.08); box-shadow: 0 14px 0 ${palette.borde}; }
        }

        .comic-nav-btn {
          transition: transform 0.15s ease;
        }
        .comic-nav-btn:hover {
          transform: translateY(-50%) scale(1.12) !important;
        }
        .comic-back-btn:hover {
          transform: translateY(-3px) scale(1.04);
          box-shadow: 0 6px 0 ${palette.borde} !important;
        }
      `}</style>

      <nav
        className="navbar navbar-expand-lg px-4 px-md-5"
        style={{
          background: palette.amarillo,
          flexShrink: 0,
          borderBottom: `6px solid ${palette.morado}`,
          position: "relative",
          zIndex: 20,
        }}
      >
        <Link to="/" className="navbar-brand me-4">
          <img
            src="/logo-piktara.png"
            alt="Piktara"
            style={{
              height: "55px",
              filter: `drop-shadow(0 3px 0 ${palette.borde})`,
            }}
          />
        </Link>

        <div
          className="ms-auto me-3 d-flex align-items-center"
          style={{
            fontFamily: fDisplay,
            background: palette.crema,
            color: palette.morado,
            padding: "6px 20px",
            borderRadius: "16px",
            border: `3.5px solid ${palette.borde}`,
            boxShadow: `0 4px 0 ${palette.borde}`,
            fontSize: "1rem",
            fontWeight: 800,
            animation: pulse ? "scorePop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)" : "none",
          }}
        >
          <span style={{ marginRight: "8px", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase" }}>Progreso:</span>
          {score}
        </div>

        <Link
          to="/nuestro-comic"
          className="comic-back-btn d-flex align-items-center text-decoration-none"
          style={{
            fontFamily: fDisplay,
            fontSize: "0.95rem",
            color: palette.borde,
            background: palette.crema,
            padding: "8px 20px",
            borderRadius: "14px",
            border: `3.5px solid ${palette.borde}`,
            boxShadow: `0 4px 0 ${palette.borde}`,
            fontWeight: 800,
          }}
        >
          VOLVER
        </Link>
      </nav>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          position: "relative",
          padding: "2%",
          zIndex: 5,
        }}
      >
        <div
          style={{
            position: "relative",
            height: "100%",
            aspectRatio: "1920 / 1080",
            maxWidth: "100%",
            background: palette.crema,
            borderRadius: "32px",
            padding: "16px",
            border: `6px solid ${palette.morado}`,
            boxShadow: `0 10px 0 ${palette.borde}`,
          }}
        >
          <WashiTape top="-14px" left="-18px" rotate={-18} color={palette.amarillo} />
          <WashiTape top="-14px" right="-18px" rotate={18} color={palette.rosa} />

          <div
            style={{
              position: "absolute",
              top: "-6px",
              left: "50%",
              transform: "translate(-50%, 0)",
              background: palette.morado,
              color: palette.crema,
              fontFamily: fDisplay,
              fontWeight: 800,
              fontSize: "0.95rem",
              letterSpacing: "0.04em",
              padding: "6px 24px",
              borderRadius: "0 0 16px 16px",
              border: `3px solid ${palette.borde}`,
              borderTop: "none",
              boxShadow: `0 4px 0 ${palette.borde}`,
              zIndex: 45,
              textTransform: "uppercase",
            }}
          >
            Aventura 2
          </div>

          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              borderRadius: "22px",
              overflow: "hidden",
              border: `3px solid ${palette.borde}`,
              backgroundColor: palette.fondoEscena,
            }}
          >
            <div ref={lottieContainer} style={{ width: "100%", height: "100%" }} />

            {!reproducido && (
              <div
                onClick={handlePlayClick}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  padding: "16px 36px",
                  borderRadius: "50px",
                  background: palette.amarillo,
                  border: `4px solid ${palette.borde}`,
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  fontFamily: fDisplay,
                  fontSize: "1.3rem",
                  fontWeight: 800,
                  color: palette.borde,
                  cursor: "pointer",
                  zIndex: 20,
                  animation: "playBounce 1.8s ease-in-out infinite",
                  boxShadow: `0 8px 0 ${palette.borde}`,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
                role="button"
              >
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderTop: "9px solid transparent",
                    borderBottom: "9px solid transparent",
                    borderLeft: `15px solid ${palette.borde}`,
                  }}
                />
                Reproducir
              </div>
            )}

            {!relojEncontrado && (
              <img
                src={relojImg}
                alt=""
                onClick={handleRelojClick}
                style={{
                  position: "absolute",
                  left: "22%",
                  top: "25%",
                  transform: "translate(-50%, -50%) rotate(-18deg)",
                  width: "24px",
                  height: "24px",
                  objectFit: "contain",
                  opacity: 1,
                  cursor: "pointer",
                  zIndex: 100,
                  pointerEvents: "auto",
                  filter: `drop-shadow(0 0 8px ${palette.amarillo})`,
                  animation: "wiggleSticker 1.6s ease-in-out infinite",
                  background: palette.crema,
                  padding: "4px",
                  borderRadius: "50%",
                  border: `2px dashed ${palette.borde}`,
                }}
              />
            )}

            <Link
              to="/comicj"
              className="comic-nav-btn d-flex align-items-center justify-content-center text-decoration-none"
              style={{
                position: "absolute",
                top: "50%",
                left: "14px",
                transform: "translateY(-50%)",
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                border: `4px solid ${palette.borde}`,
                background: palette.amarillo,
                color: palette.borde,
                fontSize: "1.8rem",
                fontFamily: fDisplay,
                fontWeight: 800,
                zIndex: 60,
                boxShadow: `0 5px 0 ${palette.borde}`,
              }}
            >
              &lt;
            </Link>

            <Link
              to="/comic"
              className="comic-nav-btn d-flex align-items-center justify-content-center text-decoration-none"
              style={{
                position: "absolute",
                top: "50%",
                right: "14px",
                transform: "translateY(-50%)",
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                border: `4px solid ${palette.borde}`,
                background: palette.rosa,
                color: "#fff",
                fontSize: "1.8rem",
                fontFamily: fDisplay,
                fontWeight: 800,
                zIndex: 60,
                boxShadow: `0 5px 0 ${palette.borde}`,
              }}
            >
              &gt;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MelanyEstrellas;