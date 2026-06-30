import lottieReact from "lottie-react"
import Oso from "../assets/Oso.json";
import pinguinoAndres from "../assets/pinguinoAndres.json"
import "./stylemelany.css"
import { useRef } from "react";

const Lottie = lottieReact.default;

export const LottieMelany = () => {
  const LottieRef = useRef();
  const LottieRefPingui = useRef();


  const ReproducirOso = () => {
    LottieRef.current.play();

  }

  const ReproducirPingui = () => {
    LottieRefPingui.current.play();
  }

  const lanzarhielo = () => {
    LottieRefPingui.current.playSegments([0, 30], true);
  }

  const lanzarpez = () => {
    LottieRef.current.playSegments([20, 50], true);
  }



  return (
    <>



      <div className="pantalla">

        <img className="position-absolute fondo" src="../public/Fondo.svg" alt="" />
        <img className="position-absolute nube1" src="../public/Nube1.svg" alt="" />
        <img className="position-absolute nube2" src="../public/Nube2.svg" alt="" />
        <img onClick={lanzarhielo} className="position-absolute hielo" src="../public/SVG/Hielo.svg" alt="" />
        <img onClick={lanzarpez} className="position-absolute pez" src="../public/SVG/pez.svg" alt="" />


        <div onClick={ReproducirOso}>
          <Lottie
            lottieRef={LottieRef}
            animationData={Oso}
            loop={true}
            autoplay={false}
            className="Oso"
          />
        </div>

        <div onClick={ReproducirPingui}>
          <Lottie
            lottieRef={LottieRefPingui}
            animationData={pinguinoAndres}
            loop={true}
            autoplay={false}
            className="pingo"
          />
        </div>

      </div>



    </>


  );
};