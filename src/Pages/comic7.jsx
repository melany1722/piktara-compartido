import React from 'react';
import { Link } from "react-router-dom";
import "../Comic.css";
import Contador from "../Components/Contador";
import RelojEscondido from "../Components/RelojEscondido";

const fDisplay = "'Baloo 2', 'Comic Sans MS', sans-serif";

const palette = {
  morado: "#5A189A",
  amarillo: "#FFC300",
  crema: "#FFF8E7",
  borde: "#3A2312",
  rosa: "#FF597B",
  fondoEscena: "#D4F7DC",
};

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

// Clave del reloj escondido de esta escena en el contador (una por escena: relojEscena1 … relojEscena8)
const CLAVE_RELOJ = "relojEscena7";

const Comic7 = () => {
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

        @keyframes dashPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
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
            style={{ height: "55px", filter: `drop-shadow(0 3px 0 ${palette.borde})` }}
          />
        </Link>

        <Link
          to="/nuestro-comic"
          className="ms-auto comic-back-btn d-flex align-items-center text-decoration-none"
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
          <Contador />

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
            Aventura 7
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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            <div
              style={{
                width: "110px",
                height: "110px",
                borderRadius: "50%",
                border: `5px dashed ${palette.borde}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: "dashPulse 2s ease-in-out infinite",
              }}
            >
              <div style={{ width: "44px", height: "44px", borderRadius: "10px", border: `4px solid ${palette.borde}` }} />
            </div>
            <div
              style={{
                fontFamily: fDisplay,
                fontWeight: 800,
                fontSize: "1.15rem",
                color: palette.borde,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Escena en construccion
            </div>

            {/* Reloj escondido: UN clic y se suma al instante */}
            <RelojEscondido clave={CLAVE_RELOJ} left="84%" top="78%" size={36} />

            <Link
              to="/comic/6"
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
              to="/comic/8"
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

export default Comic7;