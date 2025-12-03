import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export function useNoemiNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 只处理左右箭头键
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        const currentPath = location.pathname;

        if (event.key === "ArrowLeft") {
          // 左箭头：上一个页面
          if (currentPath === "/noemi1") {
            // Noemi1 是第一个，左箭头可以跳转到 Noemi3（循环）
          } else if (currentPath === "/noemi2") {
            navigate("/noemi1");
          } else if (currentPath === "/noemi3") {
            navigate("/noemi2");
          }
        } else if (event.key === "ArrowRight") {
          // 右箭头：下一个页面
          if (currentPath === "/noemi1") {
            navigate("/noemi2");
          } else if (currentPath === "/noemi2") {
            navigate("/noemi3");
          } else if (currentPath === "/noemi3") {
            // Noemi3 是最后一个，右箭头跳转到 page1
            navigate("/page1");
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate, location.pathname]);
}
