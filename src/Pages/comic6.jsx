import React, { useState } from 'react';
import { Link } from "react-router-dom";
import "../Comic.css";
import Contador from "../Components/Contador";
import RelojEscondido from "../Components/RelojEscondido";
import LottieEscena from "../Components/LottieEscena";
import AyudaEscenas from "../Components/AyudaEscenas";

const fDisplay = "'Baloo 2', 'Comic Sans MS', sans-serif";

const palette = {
  morado: "#5A189A",
  amarillo: "#FFC300",
  crema: "#FFF8E7",
  borde: "#3A2312",
  rosa: "#FF597B",
  fondoEscena: "#FFF3B0",
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
const CLAVE_RELOJ = "relojEscena6";

// Agranda los árboles para que al girar no se vea el blanco detrás
const ESCALAS_FONDO = { Arbol1: 120, Arbol2: 115 };

// Baja el árbol rosa para tapar el blanco que queda debajo (y positivo = más abajo; sube el número para bajarlo más)
const DESPLAZAR_FONDO = { Arbol1: [0, 14] };

// ===== POSICIÓN DE LOS ARBUSTOS (porcentajes de la escena) =====
// left / bottom los mueven (sube bottom = más arriba). width cambia el tamaño.
const ARBUSTO_IZQUIERDO = { left: "-2.5%", bottom: "20.5%", width: "22%" }; // bajo, tres tonos
const ARBUSTO_DERECHO = { left: "34%", bottom: "17%", width: "19%" }; // alto, mancha oscura

// ===== TAMAÑO Y POSICIÓN DE NINOVE (porcentajes de la escena) =====
// width: tamaño de TODO el lienzo del personaje. Más grande = Ninove más grande.
// bottom: sube el número = Ninove más arriba; bájalo (negativo) para que quede más al frente, más cerca del borde inferior.
// left: mueve a Ninove (y todo su recorrido) a la derecha si aumenta.
const NINOVE = { left: "3%", bottom: "-5%", width: "68%" };

// ===== TAMAÑO Y POSICIÓN DE ADAD (porcentajes de la escena) =====
// El lienzo de Adad es de 1920x1080 y el personaje está en el centro del lienzo.
// width: tamaño de Adad (más grande = Adad más grande).
// left: mueve a Adad a la derecha si aumenta.
// bottom: sube el número = Adad más arriba; bájalo (negativo) para que sus pies queden más abajo en el suelo.
// Ahora está frente al pergamino del templo (lado derecho), con los pies sobre el suelo.
const ADAD = { left: "61%", bottom: "15%", width: "50%" };

const Comic6 = () => {
  // Cada vez que se hace clic en el fondo, este número sube y Ninove empieza a caminar
  const [disparoNinove, setDisparoNinove] = useState(0);
  // Cada vez que se hace clic sobre Adad, este número sube y Adad repite su animación (independiente de Ninove)
  const [disparoAdad, setDisparoAdad] = useState(0);

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
            Aventura 6
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
            {/* Fondo: llena todo el marco. Al hacer clic corre del frame 0 al 140 y queda en reposo en el 140.
                Además, al arrancar, hace caminar a Ninove (alIniciar) */}
            <LottieEscena
              src="/lottie-fondo6/fondo6.json"
              base="/lottie-fondo6/"
              ajuste="xMidYMid slice"
              alClick
              inicio={0}
              fin={140}
              reposo={140}
              escalas={ESCALAS_FONDO}
              desplazar={DESPLAZAR_FONDO}
              alIniciar={() => setDisparoNinove((n) => n + 1)}
              style={{ position: "absolute", inset: 0, zIndex: 1 }}
            />

            {/* Arbusto IZQUIERDO: bajo, tres tonos (animación de Arbusto2.json) */}
            <LottieEscena
              src="/lottie-fondo6/arbusto2/Arbusto2.json"
              base="/lottie-fondo6/"
              imagen="arbusto-bajo.png"
              alClick
              inicio={0}
              fin={41}
              style={{
                position: "absolute",
                aspectRatio: "285 / 117",
                zIndex: 2,
                ...ARBUSTO_IZQUIERDO,
              }}
            />

            {/* Arbusto DERECHO: alto, mancha verde oscura (animación de Arbusto1.json) */}
            <LottieEscena
              src="/lottie-fondo6/arbusto1/Arbusto1.json"
              base="/lottie-fondo6/"
              imagen="arbusto-alto.png"
              alClick
              inicio={0}
              fin={42}
              style={{
                position: "absolute",
                aspectRatio: "288 / 158",
                zIndex: 2,
                ...ARBUSTO_DERECHO,
              }}
            />

            {/* ADAD: patea la roca (167 frames: 0 a 166). Es independiente de Ninove y del fondo.
                Se anima solo al hacer clic sobre él (zona transparente de abajo) y se queda quieto
                en el último frame (reposo=166), sin desaparecer. Otro clic lo repite.
                El contenedor tiene pointerEvents none para no bloquear el resto de la escena;
                solo la zona del personaje recibe clics. */}
            <div
              style={{
                position: "absolute",
                aspectRatio: "1920 / 1080",
                zIndex: 3,
                pointerEvents: "none",
                ...ADAD,
              }}
            >
              <LottieEscena
                src="/lottie-fondo6/adad/Adad_escena_en_china.json"
                base="/lottie-fondo6/adad/images/"
                alClick
                inicio={0}
                final={166}
                reposo={166}
                disparo={disparoAdad}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
              />
              <div
                onClick={() => setDisparoAdad((n) => n + 1)}
                style={{
                  position: "absolute",
                  left: "41%",
                  top: "18%",
                  width: "27%",
                  height: "66%",
                  cursor: "pointer",
                  pointerEvents: "auto",
                }}
              />
            </div>

            {/* Ninove caminando. El lienzo de 1920x1080 del personaje se reduce y se coloca abajo a la izquierda.
                Frames 0-97 = camina, 98-220 = pose final con el reloj abierto.
                pointerEvents none = no bloquea los clics de lo que hay debajo */}
            <LottieEscena
              src="/lottie-fondo6/ciclo/ninove-pasos.json"
              base="/lottie-fondo6/ciclo/"
              alClick
              inicio={0}
              final={220}
              disparo={disparoNinove}
              style={{
                position: "absolute",
                aspectRatio: "1920 / 1080",
                zIndex: 3,
                pointerEvents: "none",
                ...NINOVE,
              }}
            />

            {/* Reloj escondido: UN clic y se suma al instante */}
            <RelojEscondido clave={CLAVE_RELOJ} left="31%" top="21%" size={32} />

            {/* Panel de ayuda lateral: cómo se juega en las escenas 1 a 8 */}
            <AyudaEscenas escenaActual={6} />

            <Link
              to="/comic/5"
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
              to="/comic/7"
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

export default Comic6;