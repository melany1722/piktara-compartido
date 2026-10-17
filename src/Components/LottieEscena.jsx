import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";

// src:       ruta al JSON, ej. "/lottie-fondo6/fondo6.json"
// base:      carpeta de las imágenes (con "/" al final)
// imagen:    (opcional) nombre de archivo que reemplaza la imagen del JSON
// ajuste:    "xMidYMid meet" (cabe entero) o "xMidYMid slice" (llena todo el marco)
// alClick:   true = la animación solo corre cuando se hace clic (o cuando cambia "disparo")
// inicio:    frame donde empieza la animación
// fin:       frame donde termina (por defecto, el último)
// reposo:    frame en el que queda quieta antes del clic (por defecto, igual a inicio)
// final:     frame en el que queda quieta al terminar (por defecto, igual a reposo)
// disparo:   número; cada vez que sube, la animación se reproduce (para activarla desde otro elemento)
// alIniciar: función que se ejecuta cuando esta animación arranca por un clic propio
// escalas:   { NombreDeCapa: porcentaje } para agrandar capas (ej. { Arbol1: 120 })
// desplazar: { NombreDeCapa: [x, y] } para mover capas con posición fija
//            (en unidades del lienzo del JSON; y positivo = hacia abajo)
const LottieEscena = ({
  src,
  base,
  imagen,
  loop = true,
  ajuste = "xMidYMid meet",
  alClick = false,
  inicio = 0,
  fin,
  reposo,
  final,
  disparo = 0,
  alIniciar,
  escalas,
  desplazar,
  style,
  className,
}) => {
  const ref = useRef(null);
  const animRef = useRef(null);
  const corriendo = useRef(false);
  const escalasKey = JSON.stringify(escalas || {});
  const desplazarKey = JSON.stringify(desplazar || {});

  useEffect(() => {
    let anim;
    let cancelado = false;
    const frameReposo = reposo ?? inicio;
    const frameFinal = final ?? frameReposo;

    fetch(src)
      .then((r) => r.json())
      .then((data) => {
        if (cancelado || !ref.current) return;

        // Apunta cada imagen a su carpeta real (y cambia el archivo si se pidió)
        data.assets?.forEach((a) => {
          if (a.p && !a.layers && !a.p.startsWith("data:")) {
            a.u = base;
            if (imagen) a.p = imagen;
          }
        });

        // Agranda capas por nombre (para tapar huecos al animarse)
        const mapa = JSON.parse(escalasKey);
        data.layers?.forEach((l) => {
          const v = mapa[l.nm];
          if (v != null && l.ks) {
            l.ks.s = { a: 0, k: [v, v, 100], ix: 6 };
          }
        });

        // Mueve capas por nombre (solo las que tienen posición fija)
        const desp = JSON.parse(desplazarKey);
        data.layers?.forEach((l) => {
          const d = desp[l.nm];
          const p = l.ks?.p;
          if (d && p && p.a === 0 && Array.isArray(p.k)) {
            p.k = [p.k[0] + d[0], p.k[1] + d[1], p.k[2] || 0];
          }
        });

        anim = lottie.loadAnimation({
          container: ref.current,
          renderer: "svg",
          loop: alClick ? false : loop,
          autoplay: !alClick,
          animationData: data,
          rendererSettings: { preserveAspectRatio: ajuste },
        });

        animRef.current = anim;

        if (alClick) {
          anim.goToAndStop(frameReposo, true);

          anim.addEventListener("complete", () => {
            anim.goToAndStop(frameFinal, true);
            corriendo.current = false;
          });
        }
      })
      .catch((e) => console.error("Error cargando Lottie:", src, e));

    return () => {
      cancelado = true;
      corriendo.current = false;
      anim?.destroy();
      animRef.current = null;
    };
  }, [
    src,
    base,
    imagen,
    loop,
    ajuste,
    alClick,
    inicio,
    fin,
    reposo,
    final,
    escalasKey,
    desplazarKey,
  ]);

  // Arranca la animación. Devuelve true si realmente arrancó.
  const iniciar = () => {
    const anim = animRef.current;
    if (!alClick || !anim || corriendo.current) return false;
    corriendo.current = true;
    anim.playSegments([inicio, fin ?? anim.totalFrames], true);
    return true;
  };

  // Se reproduce cuando otro elemento sube el número "disparo"
  useEffect(() => {
    if (disparo > 0) iniciar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disparo]);

  const manejarClick = () => {
    if (iniciar()) alIniciar?.();
  };

  return (
    <div
      ref={ref}
      onClick={manejarClick}
      style={{ cursor: alClick ? "pointer" : "default", ...style }}
      className={className}
    />
  );
};

export default LottieEscena;