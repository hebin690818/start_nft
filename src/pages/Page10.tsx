import { useEffect, useState } from "react";
import page10 from "../assets/page10.png";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";

function Page10() {
  useKeyboardNavigation();
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    setOpacity(1);
  }, []);
  
  return (
    <div className="page-transition min-h-screen bg-black flex items-center justify-center">
      <img
        src={page10}
        alt="Page 10"
        className="w-full h-auto object-contain"
        style={{ opacity, transition: "opacity 0.8s ease-in-out" }}
      />
    </div>
  );
}

export default Page10;

