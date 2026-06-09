import LottieModule from "lottie-react";
import circuloj from "../assets/animacionjuan.json";

const Lottie = LottieModule.default;

export const LottieJuan = () => {
  return <Lottie animationData={circuloj} />;
};

