import { useEffect, useState } from "react";
import page13 from "../assets/page13.png";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";

function Page13() {
  useKeyboardNavigation();
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    setOpacity(1);
  }, []);
  
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <img
        src={page13}
        alt="Page 13"
        className="w-full h-auto object-contain"
        style={{ opacity, transition: "opacity 0.8s ease-in-out" }}
      />
    </div>
  );
}

export default Page13;

