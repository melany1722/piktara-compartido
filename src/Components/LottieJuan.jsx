import LottieModule from "lottie-react";
import circuloj from "../assets/animacionjuan.json";
import { useRef } from "react";

const Lottie = LottieModule.default;

export const LottieJuan = () => {

  const lottieRef = useRef()

  const reproducir = () => {
    lottieRef.current.play()
  }
  return (
    <>
      <div onClick={reproducir}>
        <Lottie
          lottieRef={lottieRef}
          animationData={circuloj}
          loop={false}
          autoplay={false}
          style={{
            width: 500,
            height: 500
          }}
        />
      </div>
    </>
  );
};

