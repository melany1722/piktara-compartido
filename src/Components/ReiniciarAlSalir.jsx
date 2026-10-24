import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { reiniciarProgreso } from "./Contador";

// =====================================================================
//  REINICIAR AL SALIR DEL CÓMIC
//  Guardar como: src/Components/ReiniciarAlSalir.jsx
//
//  Ponlo UNA sola vez, dentro del <Router> (por ejemplo en App.js, junto a tus <Routes>):
//    <ReiniciarAlSalir />
//
//  Qué hace: cada vez que la ruta cambia, si la página NO es una escena del cómic
//  (/comic/1 … /comic/8), pone el contador en cero y borra los relojes encontrados.
//  Así, al volver al inicio (o a /nuestro-comic) y empezar otra vez, hay que
//  recoger los 8 relojes de nuevo. También se reinicia si abren la web desde cero
//  en una página que no es del cómic.
//
//  Si quieres que /nuestro-comic (el botón VOLVER) NO reinicie, agrégalo a RUTAS_SIN_REINICIO.
// =====================================================================

const PREFIJO_COMIC = "/comic/";
const RUTAS_SIN_REINICIO = []; // ejemplo: ["/nuestro-comic"]

const ReiniciarAlSalir = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const enComic = pathname.startsWith(PREFIJO_COMIC);
    if (!enComic && !RUTAS_SIN_REINICIO.includes(pathname)) {
      reiniciarProgreso();
    }
  }, [pathname]);

  return null;
};

export default ReiniciarAlSalir;