import { useEffect, useState } from "react";
import page7 from "../assets/page7.png";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";

function Page7() {
  useKeyboardNavigation();
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    setOpacity(1);
  }, []);
  
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <img
        src={page7}
        alt="Page 7"
        className="w-full h-auto object-contain"
        style={{ opacity, transition: "opacity 0.8s ease-in-out" }}
      />
    </div>
  );
}

export default Page7;

