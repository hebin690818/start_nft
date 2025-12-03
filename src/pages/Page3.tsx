import { useEffect, useState } from "react";
import page3 from "../assets/page3.png";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";

function Page3() {
  useKeyboardNavigation();
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    setOpacity(1);
  }, []);

  return (
    <div className="page-transition min-h-screen bg-black flex items-center justify-center">
      <img
        src={page3}
        alt="Page 3"
        className="w-full h-auto object-contain"
        style={{ opacity, transition: "opacity 0.8s ease-in-out" }}
      />
    </div>
  );
}

export default Page3;
