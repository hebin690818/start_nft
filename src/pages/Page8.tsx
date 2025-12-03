import { useEffect, useState } from "react";
import page8 from "../assets/page8.png";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";

function Page8() {
  useKeyboardNavigation();
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    setOpacity(1);
  }, []);
  
  return (
    <div className="page-transition h-screen bg-black flex items-center justify-center">
      <img
        src={page8}
        alt="Page 8"
        className="w-full h-full object-cover"
        style={{ opacity, transition: "opacity 0.8s ease-in-out" }}
      />
    </div>
  );
}

export default Page8;

