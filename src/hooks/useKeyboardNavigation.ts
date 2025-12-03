import { useEffect, useRef } from "react";
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
  const previousPathRef = useRef<string>(location.pathname);

  useEffect(() => {
    // 只在页面路径改变时重置滚动位置
    if (previousPathRef.current !== location.pathname) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      previousPathRef.current = location.pathname;
    }

    const navigateToPage = (direction: "up" | "down") => {
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

      if (direction === "up") {
        // 上箭头：上一个页面
        // 如果在第一个页面（page1），跳转到 Noemi3
        if (currentIndex === 0) {
          navigate("/noemi3");
        } else {
          const nextIndex = currentIndex - 1;
          const nextPath = pageOrder[nextIndex];
          navigate(nextPath);
        }
      } else if (direction === "down") {
        // 下箭头：下一个页面
        // 如果在 page13，跳转到 last
        if (currentPath === "/page13") {
          navigate("/last");
        } else if (currentIndex === pageOrder.length - 1) {
          // 如果在最后一个页面（page14），不执行跳转
          return;
        } else {
          const nextIndex = currentIndex + 1;
          const nextPath = pageOrder[nextIndex];
          navigate(nextPath);
        }
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      // 只处理上下箭头键
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
        if (event.key === "ArrowUp") {
          navigateToPage("up");
        } else if (event.key === "ArrowDown") {
          navigateToPage("down");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate, location.pathname]);
}
