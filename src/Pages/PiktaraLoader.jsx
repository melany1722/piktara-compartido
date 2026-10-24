import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(SplitText, ScrambleTextPlugin, DrawSVGPlugin, MotionPathPlugin);

const C = { morado: "#9D6A8E", amarillo: "#FFC300", crema: "#FFF8E7", borde: "#3A2312" };
const fDisplay = "'Baloo 2', 'Comic Sans MS', sans-serif";

// Épocas que van "descifrándose" mientras carga
const ERAS = ["MESOPOTAMIA · 3000 a.C.", "EGIPTO · 2500 a.C.", "GRECIA · 450 a.C."];

// Campo de estrellas determinista (sin Math.random para que no cambie entre renders)
const ESTRELLAS = Array.from({ length: 56 }, (_, i) => ({
  x: (i * 37.31 + 11) % 100,
  y: (i * 61.73 + 7) % 100,
  s: 3 + ((i * 7) % 5) * 2,
}));

// Marcas tipo reloj alrededor del portal
const TICKS = Array.from({ length: 36 }, (_, i) => {
  const a = (i / 36) * Math.PI * 2;
  const r1 = i % 3 === 0 ? 178 : 186;
  const r2 = 196;
  return { x1: 200 + Math.cos(a) * r1, y1: 200 + Math.sin(a) * r1, x2: 200 + Math.cos(a) * r2, y2: 200 + Math.sin(a) * r2 };
});

const CHISPA = "M0 -14 Q2 -2 14 0 Q2 2 0 14 Q-2 2 -14 0 Q-2 -2 0 -14Z";

/**
 * Props:
 *  - onReveal: se llama justo cuando el portal empieza a abrirse (aquí arranca la animación del hero)
 *  - onDone:   se llama cuando termina todo (desmonta el loader)
 */
export default function PiktaraLoader({ onReveal, onDone }) {
  const wrapRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onReveal();
      onDone();
      return;
    }

    document.body.style.overflow = "hidden";
    const wrap = wrapRef.current;
    const loader = wrap.querySelector(".ptk-loader");
    const eraEl = wrap.querySelector(".ptk-l-era");
    const pctEl = wrap.querySelector(".ptk-l-pct");
    const barEl = wrap.querySelector(".ptk-l-bar");
    const R = Math.hypot(window.innerWidth, window.innerHeight) * 0.6 + 140; // radio final del portal
    let split;

    const ctx = gsap.context(() => {
      split = SplitText.create(".ptk-l-title", { type: "chars" });

      gsap.set(loader, { "--r": "0px" });
      gsap.set(".ptk-l-logo", { opacity: 0 });
      gsap.set(".ptk-l-orbit", { autoAlpha: 0 });
      gsap.set(".ptk-l-onda", { width: (R - 45) * 2, height: (R - 45) * 2, xPercent: -50, yPercent: -50, scale: 0, autoAlpha: 0 });

      /* ---------- Bucles continuos ---------- */
      gsap.to(".ptk-l-ticks", { rotation: 360, svgOrigin: "200 200", duration: 24, ease: "none", repeat: -1 });
      gsap.to(".ptk-l-dashg", { rotation: -360, svgOrigin: "200 200", duration: 14, ease: "none", repeat: -1 });
      gsap.to(".ptk-l-star", {
        opacity: "random(0.2,1)",
        y: "random(-22,22)",
        duration: "random(1,2.4)",
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: { each: 0.03, from: "random" },
      });
      gsap.to(".ptk-l-glow", { scale: 1.12, duration: 1.1, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.3 });
      gsap.to(".ptk-l-logo", { y: -10, duration: 1.3, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.9 });

      // chispas orbitando el anillo (MotionPath), desfasadas entre sí
      gsap.utils.toArray(".ptk-l-orbit").forEach((el, i) => {
        const t = gsap.to(el, {
          motionPath: { path: "#ptk-l-orbita", align: "#ptk-l-orbita", alignOrigin: [0.5, 0.5] },
          duration: 3.2,
          ease: "none",
          repeat: -1,
        });
        t.progress(i / 3);
      });

      // parallax suave con el mouse
      const fino = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      let offMove = () => {};
      if (fino) {
        const sx = gsap.quickTo(".ptk-l-starfield", "x", { duration: 1.2, ease: "power3" });
        const sy = gsap.quickTo(".ptk-l-starfield", "y", { duration: 1.2, ease: "power3" });
        const gx = gsap.quickTo(".ptk-l-stage", "x", { duration: 0.9, ease: "power3" });
        const gy = gsap.quickTo(".ptk-l-stage", "y", { duration: 0.9, ease: "power3" });
        const move = (e) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          sx(nx * -50); sy(ny * -50);
          gx(nx * 22); gy(ny * 22);
        };
        window.addEventListener("pointermove", move);
        offMove = () => window.removeEventListener("pointermove", move);
      }

      /* ---------- Línea de tiempo principal ---------- */
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "";
          onDone();
        },
      });

      // 1) Aparece el cosmos
      tl.from(".ptk-l-star", { scale: 0, duration: 0.9, ease: "back.out(3)", stagger: { amount: 1.2, from: "random" } }, 0)
        .fromTo(".ptk-l-glow", { scale: 0.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, ease: "power2.out" }, 0.1)
        // 2) Los anillos se dibujan solos (DrawSVG) y las marcas crecen desde el centro de cada trazo
        .fromTo(".ptk-l-draw", { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.4, ease: "power2.inOut", stagger: 0.18 }, 0.15)
        .fromTo(".ptk-l-tick", { drawSVG: "50% 50%" }, { drawSVG: "0% 100%", duration: 0.5, ease: "power2.out", stagger: { each: 0.03, from: "start" } }, 0.3)
        .fromTo(".ptk-l-dash", { scale: 0, opacity: 0, svgOrigin: "200 200" }, { scale: 1, opacity: 1, svgOrigin: "200 200", duration: 1, ease: "back.out(1.6)" }, 0.5)
        // 3) El logo irrumpe con elástico
        .fromTo(".ptk-l-logo", { scale: 0, rotation: -220, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: 1.3, ease: "elastic.out(1, 0.55)" }, 0.6)
        .to(".ptk-l-orbit", { autoAlpha: 1, duration: 0.5, stagger: 0.15 }, 1.3)
        // 4) El título PIKTARA entra letra por letra en 3D
        .fromTo(split.chars, { yPercent: 130, opacity: 0, rotationX: -90, transformOrigin: "50% 100%" }, { yPercent: 0, opacity: 1, rotationX: 0, duration: 0.8, ease: "back.out(2)", stagger: 0.07 }, 1.0)
        .fromTo(".ptk-l-era, .ptk-l-barwrap, .ptk-l-pct", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, 1.2);

      // 5) Contador + barra + épocas que se "descifran" (ScrambleText)
      const prog = { v: 0 };
      let eraIdx = -1;
      tl.to(prog, {
        v: 100,
        duration: 3,
        ease: "power1.inOut",
        onUpdate: () => {
          const v = prog.v;
          pctEl.textContent = `${Math.round(v)}%`;
          gsap.set(barEl, { scaleX: v / 100 });
          const idx = Math.min(ERAS.length - 1, Math.floor(v / (100 / ERAS.length)));
          if (idx !== eraIdx) {
            eraIdx = idx;
            gsap.to(eraEl, { duration: 0.7, ease: "none", scrambleText: { text: ERAS[idx], chars: "upperCase", speed: 0.7 }, overwrite: "auto" });
          }
        },
      }, 0.8);

      // 6) SALIDA: atravesar el portal
      tl.addLabel("salida", ">+0.15")
        .call(() => {
          gsap.to(eraEl, { duration: 0.7, ease: "none", scrambleText: { text: "¡PORTAL ABIERTO!", chars: "upperCase", speed: 0.8 }, overwrite: "auto" });
        }, null, "salida")
        .to(".ptk-l-barwrap, .ptk-l-pct", { opacity: 0, y: 10, duration: 0.3 }, "salida")
        // las letras salen disparadas
        .to(split.chars, {
          x: "random(-420,420)",
          y: "random(-260,260)",
          rotation: "random(-200,200)",
          scale: "random(0.4,1.8)",
          opacity: 0,
          duration: 0.8,
          ease: "power3.in",
          stagger: { amount: 0.3, from: "center" },
        }, "salida+=0.25")
        // zoom hacia el portal: anillos, cosmos y logo se nos vienen encima
        .to(".ptk-l-svg", { scale: 5, opacity: 0, duration: 1, ease: "power3.in" }, "salida+=0.3")
        .to(".ptk-l-starfield", { scale: 2.4, transformOrigin: "50% 43%", duration: 1.1, ease: "power2.in" }, "salida+=0.3")
        .to(".ptk-l-glow", { scale: 4, opacity: 0, duration: 1, ease: "power2.in" }, "salida+=0.3")
        .to(".ptk-l-logo", { scale: 14, duration: 0.95, ease: "power4.in" }, "salida+=0.3")
        .to(".ptk-l-logo", { opacity: 0, duration: 0.3, ease: "none" }, "salida+=0.95")
        // destello
        .fromTo(".ptk-l-flash", { opacity: 0 }, { opacity: 0.9, duration: 0.15, ease: "power2.out" }, "salida+=1.05")
        .to(".ptk-l-flash", { opacity: 0, duration: 0.45, ease: "power2.in" }, "salida+=1.2")
        // el hero empieza a animarse justo antes de que se abra el portal
        .call(onReveal, null, "salida+=1.1")
        // el portal se abre como un agujero con borde suave y una onda dorada en el borde
        .to(loader, { "--r": `${R}px`, duration: 1.3, ease: "power3.inOut" }, "salida+=1.15")
        .to(".ptk-l-onda", { scale: 1, autoAlpha: 1, duration: 1.3, ease: "power3.inOut" }, "salida+=1.15")
        .to(".ptk-l-onda", { autoAlpha: 0, duration: 0.5 }, "salida+=1.9");

      // clic para acelerar la intro
      const acelerar = () => tl.timeScale(2.5);
      wrap.addEventListener("click", acelerar);

      return () => {
        offMove();
        wrap.removeEventListener("click", acelerar);
      };
    }, wrap);

    return () => {
      document.body.style.overflow = "";
      split && split.revert();
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={wrapRef} className="ptk-l-wrap">
      <style>{`
        .ptk-l-wrap { position: fixed; inset: 0; z-index: 9999; }
        .ptk-loader {
          --r: 0px;
          --S: min(60vmin, 440px);
          position: absolute;
          inset: 0;
          overflow: hidden;
          cursor: pointer;
          background: radial-gradient(ellipse at 50% 43%, #B986AA 0%, ${C.morado} 42%, #5A3752 100%);
          -webkit-mask-image: radial-gradient(circle at 50% 43%, transparent calc(var(--r) - 90px), #000 var(--r));
          mask-image: radial-gradient(circle at 50% 43%, transparent calc(var(--r) - 90px), #000 var(--r));
        }
        .ptk-l-starfield { position: absolute; inset: -6%; pointer-events: none; }
        .ptk-l-star {
          position: absolute;
          border-radius: 50%;
          background: ${C.crema};
          box-shadow: 0 0 10px 2px rgba(255, 195, 0, 0.7);
          opacity: 0.8;
          will-change: transform, opacity;
        }
        .ptk-l-star:nth-child(even) { background: ${C.amarillo}; }
        .ptk-l-stage {
          position: absolute;
          left: calc(50% - var(--S) / 2);
          top: calc(43% - var(--S) / 2);
          width: var(--S);
          height: var(--S);
          display: grid;
          place-items: center;
        }
        .ptk-l-glow {
          position: absolute;
          inset: -22%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 195, 0, 0.75) 0%, rgba(255, 195, 0, 0) 68%);
          will-change: transform;
        }
        .ptk-l-svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
        .ptk-l-logo {
          position: relative;
          width: 42%;
          height: auto;
          will-change: transform;
          filter: drop-shadow(0 8px 0 ${C.borde}) drop-shadow(0 15px 25px rgba(58, 35, 18, 0.5));
        }
        .ptk-l-bottom {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 5vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          pointer-events: none;
        }
        .ptk-l-title {
          margin: 0;
          font-family: ${fDisplay};
          font-weight: 800;
          font-size: clamp(2rem, 6vmin, 3.4rem);
          letter-spacing: 0.14em;
          color: ${C.amarillo};
          text-shadow: 3px 3px 0 ${C.borde}, -2px -2px 0 ${C.borde}, 2px -2px 0 ${C.borde}, -2px 2px 0 ${C.borde};
          perspective: 700px;
        }
        .ptk-l-era {
          margin: 0;
          min-height: 1.4em;
          font-family: ${fDisplay};
          font-weight: 700;
          font-size: clamp(0.8rem, 2vmin, 1rem);
          letter-spacing: 0.18em;
          color: ${C.crema};
        }
        .ptk-l-barwrap {
          width: min(280px, 60vw);
          height: 10px;
          background: rgba(58, 35, 18, 0.35);
          border: 3px solid ${C.borde};
          border-radius: 999px;
          overflow: hidden;
        }
        .ptk-l-bar { width: 100%; height: 100%; background: linear-gradient(90deg, ${C.amarillo}, ${C.crema}); transform-origin: left center; transform: scaleX(0); }
        .ptk-l-pct { font-family: ${fDisplay}; font-weight: 800; font-size: 1.4rem; color: ${C.crema}; text-shadow: 2px 2px 0 ${C.borde}; }
        .ptk-l-flash { position: absolute; inset: 0; background: ${C.crema}; opacity: 0; pointer-events: none; }
        .ptk-l-onda {
          position: absolute;
          left: 50%;
          top: 43%;
          border-radius: 50%;
          border: 6px solid ${C.amarillo};
          box-shadow: 0 0 40px 8px rgba(255, 195, 0, 0.6), inset 0 0 40px 8px rgba(255, 195, 0, 0.4);
          pointer-events: none;
          will-change: transform;
        }
      `}</style>

      <div className="ptk-loader">
        <div className="ptk-l-starfield" aria-hidden="true">
          {ESTRELLAS.map((s, i) => (
            <span key={i} className="ptk-l-star" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s }} />
          ))}
        </div>

        <div className="ptk-l-stage">
          <div className="ptk-l-glow" />
          <svg className="ptk-l-svg" viewBox="0 0 400 400" aria-hidden="true">
            <path id="ptk-l-orbita" d="M350,200 A150,150 0 1,1 50,200 A150,150 0 1,1 350,200" fill="none" stroke="none" />
            <circle className="ptk-l-draw" cx="200" cy="200" r="172" fill="none" stroke={C.amarillo} strokeWidth="4" strokeLinecap="round" />
            <circle className="ptk-l-draw" cx="200" cy="200" r="150" fill="none" stroke={C.crema} strokeWidth="2" opacity="0.45" />
            <g className="ptk-l-dashg">
              <circle className="ptk-l-dash" cx="200" cy="200" r="128" fill="none" stroke={C.amarillo} strokeWidth="3" strokeDasharray="4 12" strokeLinecap="round" />
            </g>
            <g className="ptk-l-ticks">
              {TICKS.map((t, i) => (
                <line key={i} className="ptk-l-tick" x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={C.crema} strokeWidth="3" strokeLinecap="round" />
              ))}
            </g>
            {[0, 1, 2].map((i) => (
              <g key={i} className="ptk-l-orbit">
                <path d={CHISPA} fill={C.amarillo} stroke={C.borde} strokeWidth="1.5" strokeLinejoin="round" />
              </g>
            ))}
          </svg>
          <img className="ptk-l-logo" src="./MANOLOGO.svg" alt="Piktara" />
        </div>

        <div className="ptk-l-bottom">
          <h2 className="ptk-l-title">PIKTARA</h2>
          <p className="ptk-l-era">&nbsp;</p>
          <div className="ptk-l-barwrap"><div className="ptk-l-bar" /></div>
          <span className="ptk-l-pct">0%</span>
        </div>

        <div className="ptk-l-flash" />
      </div>

      <div className="ptk-l-onda" />
    </div>
  );
}