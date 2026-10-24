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
// acciones:  para JSON que traen varias animaciones seguidas. Puede ser:
//              - un número N: divide los frames del JSON en N partes iguales
//              - una lista [[inicio, fin], [inicio, fin], ...] con los frames exactos de cada una
//              - "marcadores": usa los marcadores (markers) que tenga el JSON como acciones
// accion:    índice (empieza en 0) de cuál de las acciones se muestra; se repite en bucle
//            y cambia sola cuando este número cambia (solo se ve una a la vez)
// depurar:   true = escribe en la consola (F12) los frames de cada acción que se reproduce
// alIniciar: función que se ejecuta cuando esta animación arranca por un clic propio
// alTerminar: función que se ejecuta cuando la animación llega a su final (solo con alClick)
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
  acciones,
  accion = 0,
  depurar = false,
  alIniciar,
  alTerminar,
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

  // Modo por acciones: el JSON trae varias animaciones y se muestra una a la vez
  const porAcciones = acciones !== undefined;
  const accionesKey = JSON.stringify(acciones ?? null);

  // Guarda siempre la versión más reciente de alTerminar sin recargar la animación
  const alTerminarRef = useRef(alTerminar);
  alTerminarRef.current = alTerminar;

  // Guarda la acción actual para usarla cuando termine de cargar
  const accionRef = useRef(accion);
  accionRef.current = accion;

  // Lista de rangos [inicio, fin] de cada acción
  const obtenerRangos = (anim) => {
    const total = anim.totalFrames;

    if (Array.isArray(acciones)) return acciones;

    if (acciones === "marcadores") {
      return (anim.markers || [])
        .map((m) => [m.time, m.duration > 0 ? m.time + m.duration : total])
        .filter((r) => r[1] > r[0]);
    }

    const n = Math.max(1, Number(acciones) || 1);
    const tam = total / n;
    return Array.from({ length: n }, (_, i) => [
      Math.round(i * tam),
      i === n - 1 ? total : Math.round((i + 1) * tam),
    ]);
  };

  // Reproduce en bucle solo los frames de la acción pedida
  const reproducirAccion = () => {
    const anim = animRef.current;
    if (!anim || acciones === undefined) return;

    const rangos = obtenerRangos(anim);
    if (!rangos.length) {
      console.warn("[LottieEscena] No hay acciones para", src, "(¿el JSON no tiene marcadores?)");
      return;
    }

    const i = Math.min(Math.max(accionRef.current, 0), rangos.length - 1);
    const rango = rangos[i];

    if (depurar) {
      console.info(
        `[LottieEscena] ${src} → total ${anim.totalFrames} frames, acción ${i + 1}/${rangos.length}: frames ${rango[0]} a ${rango[1]}`
      );
    }

    anim.resetSegments(true);
    anim.loop = true;
    anim.playSegments(rango, true);
  };

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
          loop: porAcciones ? true : alClick ? false : loop,
          autoplay: !alClick && !porAcciones,
          animationData: data,
          rendererSettings: { preserveAspectRatio: ajuste },
        });

        animRef.current = anim;

        if (porAcciones) {
          // Cuando el JSON está listo, arranca la acción que toca
          anim.addEventListener("DOMLoaded", reproducirAccion);
          if (anim.isLoaded) reproducirAccion();
        } else if (alClick) {
          anim.goToAndStop(frameReposo, true);

          anim.addEventListener("complete", () => {
            anim.goToAndStop(frameFinal, true);
            corriendo.current = false;
            alTerminarRef.current?.();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    src,
    base,
    imagen,
    loop,
    ajuste,
    alClick,
    porAcciones,
    accionesKey,
    inicio,
    fin,
    reposo,
    final,
    escalasKey,
    desplazarKey,
  ]);

  // Cuando cambia la acción, salta a esa animación
  useEffect(() => {
    if (porAcciones) reproducirAccion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accion]);

  // Arranca la animación. Devuelve true si realmente arrancó.
  const iniciar = () => {
    const anim = animRef.current;
    if (porAcciones || !alClick || !anim || corriendo.current) return false;
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
      style={{ cursor: alClick && !porAcciones ? "pointer" : "default", ...style }}
      className={className}
    />
  );
};

export default LottieEscena;