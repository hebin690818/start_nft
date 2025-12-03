import { useEffect, useState } from "react";
import page11 from "../assets/page11.png";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";

function Page11() {
  useKeyboardNavigation();
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    setOpacity(1);
  }, []);
  
  return (
    <div className="page-transition min-h-screen bg-black flex items-center justify-center">
      <img
        src={page11}
        alt="Page 11"
        className="w-full h-auto object-contain"
        style={{ opacity, transition: "opacity 0.8s ease-in-out" }}
      />
    </div>
  );
}

export default Page11;

