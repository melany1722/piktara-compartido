import React, { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";
import lottie from "lottie-web";
import "../Comic.css";

const fDisplay = "'Baloo 2', 'Comic Sans MS', sans-serif";

const palette = {
  morado: "#5A189A",
  moradoClaro: "#F3E8FF",
  amarillo: "#FFC300",
  crema: "#FFF8E7",
  borde: "#3A2312",
  rosa: "#FF597B",
  fondoEscena: "#FFE8B8",
};

const relojImg = "/lottie/images/img_0.png";

const Cloud = ({ top, left, size, delay, duration }) => (
  <div
    style={{
      position: "absolute",
      top,
      left,
      width: size,
      height: size * 0.55,
      opacity: 0.85,
      animation: `driftCloud ${duration}s linear ${delay}s infinite`,
      pointerEvents: "none",
      zIndex: 1,
    }}
  >
    <svg viewBox="0 0 200 110" width="100%" height="100%">
      <ellipse cx="55" cy="70" rx="55" ry="35" fill={palette.crema} />
      <ellipse cx="110" cy="50" rx="65" ry="45" fill={palette.crema} />
      <ellipse cx="165" cy="72" rx="45" ry="30" fill={palette.crema} />
    </svg>
  </div>
);

const WashiTape = ({ top, left, right, rotate, color, delay }) => (
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
      animation: `tapeDrop 0.5s cubic-bezier(.34,1.56,.64,1) ${delay}s both`,
    }}
  />
);

const Confetti = ({ pieces }) => (
  <>
    {pieces.map((p) => (
      <span
        key={p.id}
        style={{
          position: "absolute",
          top: p.top,
          right: p.right,
          fontSize: p.size,
          zIndex: 150,
          pointerEvents: "none",
          "--tx": `${p.tx}px`,
          "--ty": `${p.ty}px`,
          animation: `confettiBurst 0.9s ease-out forwards`,
        }}
      >
        {p.emoji}
      </span>
    ))}
  </>
);

const Comicj = () => {
  const lottieContainer = useRef(null);
  const animRef = useRef(null);

  const [score, setScore] = useState(() => Number(localStorage.getItem("piktaraScore")) || 0);
  const [relojEncontrado, setRelojEncontrado] = useState(() => localStorage.getItem("relojComicj") === "true");
  const [pulse, setPulse] = useState(false);
  const [reproducido, setReproducido] = useState(false);
  const [confetti, setConfetti] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 30);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: lottieContainer.current,
      renderer: "svg",
      loop: true,
      autoplay: false,
      path: "/lottiej/animacionj.json",
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
      localStorage.setItem("relojComicj", "true");
      setRelojEncontrado(true);
      setPulse(true);
      setTimeout(() => setPulse(false), 500);

      const emojis = ["✨", "⭐", "🎉", "💥"];
      const pieces = Array.from({ length: 10 }).map((_, i) => ({
        id: `${Date.now()}-${i}`,
        emoji: emojis[i % emojis.length],
        top: "30%",
        right: "12%",
        size: `${14 + Math.random() * 12}px`,
        tx: Math.round((Math.random() - 0.5) * 220),
        ty: Math.round(-40 - Math.random() * 140),
      }));
      setConfetti(pieces);
      setTimeout(() => setConfetti([]), 900);
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
        background: palette.moradoClaro,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Quicksand:wght@500;600;700&display=swap');

        @keyframes driftCloud {
          from { transform: translateX(-15vw); }
          to { transform: translateX(105vw); }
        }
        @keyframes bounceIn {
          0% { transform: scale(1); }
          35% { transform: scale(1.25) rotate(-4deg); }
          65% { transform: scale(0.95) rotate(2deg); }
          100% { transform: scale(1) rotate(0); }
        }
        @keyframes wiggleSticker {
          0%, 100% { transform: rotate(-12deg) scale(1); }
          50% { transform: rotate(-2deg) scale(1.08); }
        }
        @keyframes sunPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.08); }
        }
        @keyframes confettiBurst {
          0% { transform: translate(0, 0) scale(0.6) rotate(0deg); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(1.1) rotate(200deg); opacity: 0; }
        }
        @keyframes headerDrop {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes sceneEnter {
          0% { opacity: 0; transform: scale(0.85) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
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
        .comic-header {
          animation: headerDrop 0.6s cubic-bezier(.34,1.56,.64,1) both;
        }
        .comic-frame {
          animation: sceneEnter 0.5s cubic-bezier(.34,1.56,.64,1) both;
        }
      `}</style>

      <Cloud top="8%" left="2%" size={140} delay={0} duration={24} />
      <Cloud top="75%" left="70%" size={160} delay={3} duration={28} />

      <nav
        className="comic-header navbar navbar-expand-lg px-4 px-md-5"
        style={{
          background: palette.amarillo,
          flexShrink: 0,
          borderBottom: `6px solid ${palette.morado}`,
          position: "relative",
          zIndex: 20,
          opacity: ready ? 1 : 0,
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
            animation: pulse ? "bounceIn 0.5s ease" : "none",
          }}
        >
          <span style={{ marginRight: "8px", fontSize: "1.2rem" }}>⭐</span>
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
          <span style={{ marginRight: "8px", fontSize: "1.1rem" }}>👈</span>
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
          className="comic-frame"
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
          <WashiTape top="-14px" left="-18px" rotate={-18} color={palette.rosa} />
          <WashiTape top="-14px" right="-18px" rotate={18} color={palette.amarillo} />

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
            Aventura 1
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
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  background: palette.amarillo,
                  border: `5px solid ${palette.borde}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2.4rem",
                  cursor: "pointer",
                  zIndex: 10,
                  animation: "sunPulse 1.3s ease-in-out infinite",
                  boxShadow: `0 6px 0 ${palette.borde}`,
                }}
                role="button"
              >
                ▶️
              </div>
            )}

            {!relojEncontrado && (
              <img
                src={relojImg}
                alt="Reloj escondido"
                onClick={handleRelojClick}
                style={{
                  position: "absolute",
                  bottom: "30%",
                  right: "12%",
                  width: "6%",
                  minWidth: "40px",
                  cursor: "pointer",
                  opacity: 1,
                  filter: `drop-shadow(0 0 8px ${palette.amarillo})`,
                  transform: "rotate(-12deg)",
                  animation: "wiggleSticker 1.6s ease-in-out infinite",
                  zIndex: 100,
                  borderRadius: "50%",
                  background: palette.crema,
                  padding: "4px",
                  border: `2px dashed ${palette.borde}`
                }}
              />
            )}
            <Confetti pieces={confetti} />

            <Link
              to="/melany"
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
              ›
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comicj;