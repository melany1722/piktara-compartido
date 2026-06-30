import LottieModule from "lottie-react";
import { useRef } from "react";

const Lottie = LottieModule;

export const LottieKevin = () => {

  const lottieRef = useRef()

  const reproducir = () => {
    lottieRef.current.play()
  }
  return (
    <>
      <div className="pantalla">
        <img className="position-absolute fondo" src="../public/SVG/Fondo.svg" alt="" />
        <img className="position-absolute nube1" src="../public/SVG/Nube1.svg" alt="" />
        <img className="position-absolute nube2" src="../public/SVG/Nube2.svg" alt="" />
        <img className="position-absolute hielo" src="../public/SVG/Hielo.svg" alt="" />
        <img className="position-absolute pez" src="../public/SVG/Pez.svg" alt="" />
      </div>

      {/* 
      <div onClick={reproducir}>
        <Lottie
          lottieRef={lottieRef}
          animationData={animacionkevin}
          loop={false}
          autoplay={false}
          style={{
            width: 500,
            height: 500
          }}
        />
      </div>
      */}
    </>
  );
};
