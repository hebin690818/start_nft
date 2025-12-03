import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export function useNoemiNavigation() {
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
      
      // 将根路径 "/" 视为 "/noemi1"
      if (currentPath === "/") {
        currentPath = "/noemi1";
      }

      if (direction === "up") {
        // 上箭头：上一个页面
        if (currentPath === "/noemi1") {
          // Noemi1 是第一个，上箭头不执行操作
        } else if (currentPath === "/noemi2") {
          navigate("/noemi1");
        } else if (currentPath === "/noemi3") {
          navigate("/noemi2");
        }
      } else if (direction === "down") {
        // 下箭头：下一个页面
        if (currentPath === "/noemi1") {
          navigate("/noemi2");
        } else if (currentPath === "/noemi2") {
          navigate("/noemi3");
        } else if (currentPath === "/noemi3") {
          // Noemi3 是最后一个，下箭头跳转到 page1
          navigate("/page1");
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
