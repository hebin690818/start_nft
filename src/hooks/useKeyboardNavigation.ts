import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// 页面顺序数组（按照命名顺序）
const pageOrder = [
  "/page1",
  "/page2",
  "/page3",
  "/page4",
  "/page5",
  "/page6",
  "/page7",
  "/page8",
  "/page9",
  "/page10",
  "/page11",
  "/page12",
  "/page13",
  "/page14",
];

export function useKeyboardNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 只处理左右箭头键
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        let currentPath = location.pathname;
        
        // 将根路径 "/" 视为 "/page1"
        if (currentPath === "/") {
          currentPath = "/page1";
        }
        
        const currentIndex = pageOrder.indexOf(currentPath);

        if (currentIndex === -1) {
          // 如果当前路径不在页面列表中，不处理
          return;
        }

        if (event.key === "ArrowLeft") {
          // 左箭头：上一个页面
          // 如果在第一个页面（page1），跳转到 Noemi3
          if (currentIndex === 0) {
            navigate("/noemi3");
            return;
          }
          const nextIndex = currentIndex - 1;
          const nextPath = pageOrder[nextIndex];
          navigate(nextPath);
        } else if (event.key === "ArrowRight") {
          // 右箭头：下一个页面
          // 如果在 page13，跳转到 last
          if (currentPath === "/page13") {
            navigate("/last");
            return;
          }
          // 如果在最后一个页面（page14），不执行跳转
          if (currentIndex === pageOrder.length - 1) {
            return;
          }
          const nextIndex = currentIndex + 1;
          const nextPath = pageOrder[nextIndex];
          navigate(nextPath);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate, location.pathname]);
}
