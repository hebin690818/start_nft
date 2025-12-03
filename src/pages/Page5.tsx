import { useEffect, useState } from "react";
import page5 from "../assets/page5.png";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";

function Page5() {
  useKeyboardNavigation();
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    setOpacity(1);
  }, []);

  return (
    <div className="h-screen bg-black flex items-center justify-center">
      <img 
        src={page5} 
        alt="Page 5" 
        className="w-full h-full object-cover"
        style={{ opacity, transition: "opacity 0.8s ease-in-out" }}
      />
    </div>
  );
}

export default Page5;
