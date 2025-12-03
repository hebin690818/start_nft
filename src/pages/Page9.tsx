import { useState } from "react";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";
import video3 from "../assets/video/video3.mp4";

function Page9() {
  useKeyboardNavigation();
  const [showVideo, setShowVideo] = useState(false);
  const [showText, setShowText] = useState(true);

  const handleClick = () => {
    if (!showVideo) {
      setShowVideo(true);
      setShowText(false);
    }
  };

  return (
    <div
      className="page-transition relative min-h-screen bg-black text-white overflow-hidden cursor-pointer"
      onClick={handleClick}
    >
      {/* Start 文字 - 3D 效果 (SVG 路径复制 + 平移 + 填充/描边分离) */}
      {showText && (
        <div 
          className="absolute inset-0 flex items-center justify-center z-20"
          style={{
            opacity: showText ? 1 : 0,
            transition: "opacity 0.5s ease-out",
            width: "100%",
            height: "100%",
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 2000 600"
            preserveAspectRatio="xMidYMid meet"
            style={{
              overflow: "visible",
            }}
          >
            {/* 多层轮廓效果 - 使用描边（底层） */}
            {[...Array(4)].map((_, i) => {
              const offset = (i + 1) * 5;
              return (
                <text
                  key={`stroke-${i}`}
                  x="1000"
                  y="300"
                  fontFamily="sans-serif"
                  fontSize="750"
                  fontWeight="700"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  letterSpacing="0.02em"
                  fill="none"
                  stroke="#2AD167"
                  strokeWidth="2"
                  transform={`translate(${-offset * 0.4}, ${offset*1.5})`}
                  style={{
                    textTransform: "lowercase",
                  }}
                >
                  start
                </text>
              );
            })}

            {/* 顶层实心文字 - 使用填充 */}
            <text
              x="1000"
              y="300"
              fontFamily="sans-serif"
              fontSize="750"
              fontWeight="700"
              textAnchor="middle"
              dominantBaseline="middle"
              letterSpacing="0.02em"
              fill="#2AD167"
              style={{
                textTransform: "lowercase",
              }}
            >
              start
            </text>
          </svg>
        </div>
      )}

      {/* 视频容器 - 从底部滑入 */}
      {showVideo && (
        <div
          className="absolute bottom-0 left-0 right-0 z-10"
          style={{
            animation: "slideUp 0.8s ease-out forwards",
          }}
        >
          <video
            src={video3}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-auto"
            style={{
              maxHeight: "100vh",
              objectFit: "contain",
            }}
          />
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default Page9;

