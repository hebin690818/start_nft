import { useEffect, useMemo, useState } from "react";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";
import collection1 from "../assets/collections/collection1.png";
import collection2 from "../assets/collections/collection2.png";
import collection3 from "../assets/collections/collection3.png";
import collection4 from "../assets/collections/collection4.png";
import collection5 from "../assets/collections/collection5.png";
import collection6 from "../assets/collections/collection6.png";
import collection7 from "../assets/collections/collection7.png";

const collections = [
  {
    id: 1,
    image: collection7,
    bg: "linear-gradient(135deg, #2C91E8, #7AE6FF)",
    border: "#4EFAC7",
  },
  {
    id: 2,
    image: collection6,
    bg: "linear-gradient(135deg, #B0FFD6, #78D4A7)",
    border: "#65FF9A",
  },
  {
    id: 3,
    image: collection3,
    bg: "linear-gradient(135deg, #FFE18E, #FFB347)",
    border: "#68FF9E",
  },
  {
    id: 4,
    image: collection1,
    bg: "linear-gradient(135deg, #FFB347, #FF6B01)",
    border: "#4EFAC7",
  },
  {
    id: 5,
    image: collection2,
    bg: "linear-gradient(135deg, #FDCFFB, #FF9ADE)",
    border: "#65FF9A",
  },
  {
    id: 6,
    image: collection4,
    bg: "linear-gradient(135deg, #FFE18E, #FFB347)",
    border: "#4EFAC7",
  },
  {
    id: 7,
    image: collection5,
    bg: "linear-gradient(135deg, #65F5FF, #3A6CD6)",
    border: "#68FF9E",
  },
];

function Page2() {
  useKeyboardNavigation();
  const [activeIndex, setActiveIndex] = useState(3); // 默认中间位置（索引3）
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1920
  );

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const visibleCollections = useMemo(() => {
    const half = 3;
    return Array.from({ length: half * 2 + 1 }, (_, offset) => {
      const relative = offset - half;
      const normalizedIndex =
        (activeIndex + relative + collections.length) % collections.length;
      return {
        ...collections[normalizedIndex],
        originalIndex: normalizedIndex,
        isActive: relative === 0,
        relative,
      };
    });
  }, [activeIndex]);

  const layoutConfig = useMemo(() => {
    if (viewportWidth >= 1680) {
      return {
        stageHeight: 440,
        activeSize: 460,
        inactiveSize: 400,
        overlapActive: -170,
        overlapInactive: -170,
      };
    }
    if (viewportWidth >= 1280) {
      return {
        stageHeight: 360,
        activeSize: 360,
        inactiveSize: 300,
        overlapActive: -130,
        overlapInactive: -130,
      };
    }
    if (viewportWidth >= 1024) {
      return {
        stageHeight: 360,
        activeSize: 360,
        inactiveSize: 280,
        overlapActive: -110,
        overlapInactive: -110,
      };
    }
    return {
      stageHeight: 320,
      activeSize: 300,
      inactiveSize: 220,
      overlapActive: -90,
      overlapInactive: -90,
    };
  }, [viewportWidth]);

  const handleImageClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="page-transition min-h-screen bg-linear-to-br from-[#020c06] via-[#031207] to-[#010402] text-white flex items-center justify-center py-8">
      <div className="flex flex-col w-full max-w-7xl mx-auto px-6">
        {/* Top Section - Header and Navigation */}
        <div className="pb-8 shrink-0">
          {/* NODE/NFTs - 单独一行，右上角 */}
          <div className="flex justify-end mb-6">
            <div className="text-[#2AD167] text-base md:text-lg font-medium whitespace-nowrap">
              NODE/NFTs
            </div>
          </div>

          {/* Title and Navigation Row */}
          <div className="flex items-center justify-between mb-8 gap-6">
            {/* Left Side - Title */}
            <h1 className="text-5xl md:text-6xl lg:text-6xl font-bold shrink-0">
              <span className="bg-linear-to-r from-[#2AD167] to-[#54D8A9] bg-clip-text text-transparent">
                NFTs
              </span>
              <span className="ml-3 bg-linear-to-r from-[#54D8A9] to-[#6FFF98] bg-clip-text text-transparent">
                Collections
              </span>
            </h1>

            {/* Right Side - Navigation Bar */}
            <div className="flex items-center flex-1 justify-end">
              {/* Navigation Bar - 长条形选择栏 */}
              <div className="flex items-center gap-1 px-2.5 py-2 rounded-lg border border-[#2AD167]/50 bg-gray-800/70 backdrop-blur-sm">
                <button className="px-4 py-1.5 text-sm md:text-base text-gray-400 hover:text-gray-300 transition-colors whitespace-nowrap">
                  ALL
                </button>
                <button
                  className="px-4 py-1 text-sm md:text-base text-white rounded-md font-semibold whitespace-nowrap transition-all"
                  style={{
                    background:
                      "linear-gradient(282deg, #72FFF3 -14.75%, #54D8A9 22.58%, #6FFF98 67.15%, #307FE7 110.51%)",
                  }}
                >
                  NFT
                </button>
                <button className="px-4 py-1.5 text-sm md:text-base text-gray-400 hover:text-gray-300 transition-colors whitespace-nowrap">
                  钱包/Wallet
                </button>
                <button className="px-4 py-1.5 text-sm md:text-base text-gray-400 hover:text-gray-300 transition-colors whitespace-nowrap">
                  官网
                </button>
                <button className="px-4 py-1.5 text-sm md:text-base text-gray-400 hover:text-gray-300 transition-colors whitespace-nowrap">
                  DATA
                </button>
                <button className="px-4 py-1.5 text-sm md:text-base text-gray-400 hover:text-gray-300 transition-colors whitespace-nowrap">
                  AIGC
                </button>
              </div>
            </div>
          </div>

          {/* Text Content - 在导航栏下方，左对齐 */}
          <div className="space-y-4 text-left">
            <p
              className="text-base leading-relaxed"
              style={{
                color: "#E2FFED",
                textIndent: "2em",
                fontSize: "20px",
              }}
            >
              With the rise of Web3 technology, digital assets are gradually
              becoming a core component of the next generation of the internet.
              NFTs (Non-Fungible Tokens), as an important carrier of this
              technology, not only represent the uniqueness of digital art but
              also redefine the concept of "ownership."
            </p>
            <p
              className="text-base leading-relaxed"
              style={{
                color: "#E2FFED",
                textIndent: "2em",
                fontSize: "20px",
              }}
            >
              This project focuses on NFTs, exploring ways to combine digital
              art with blockchain technology. The design goal is to create an
              immersive platform experience for users, allowing them to freely
              create, display, and trade NFTs through a simple, intuitive
              interface and a futuristic visual style.
            </p>
            <p
              className="text-white text-base leading-relaxed"
              style={{
                color: "rgba(226, 255, 237, 0.50)",
                textIndent: "2em",
              }}
            >
              随着 Web3
              技术的兴起,数字资产正逐步成为新一代互联网的核心组成部分。NFT(非同质化代币)作为其中的重要载体,不仅代表了数字艺术的独特性,也重新定义了"拥有"的概念。本项目以
              NFT
              为核心,探索数字艺术与区块链技术的结合方式。设计目标是通过简洁直观的交互与具有未来感的视觉风格,为用户打造一个可自由创建、展示与交易
              NFT 的沉浸式平台体验。
            </p>
          </div>
        </div>

        {/* Bottom Section - NFT Characters */}
        <div className="relative flex flex-col items-center justify-center py-8">
          <div className="relative w-full px-4 md:px-12 py-6 md:py-10">
            <div
              className="pointer-events-none"
              style={{ height: `${layoutConfig.stageHeight}px` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              {visibleCollections.map((collection, idx) => {
                const circleSize = collection.isActive
                  ? layoutConfig.activeSize
                  : layoutConfig.inactiveSize;
                const depth = 60 - Math.abs(collection.relative) * 5;
                const overlap =
                  idx === 0
                    ? "0"
                    : collection.isActive
                    ? `${layoutConfig.overlapActive}px`
                    : `${layoutConfig.overlapInactive}px`;
                return (
                  <div
                    key={`${collection.id}-${collection.originalIndex}`}
                    onClick={() => handleImageClick(collection.originalIndex)}
                    className="shrink-0 cursor-pointer relative transition-all duration-500"
                    style={{
                      zIndex: collection.isActive ? 100 : depth,
                      transform: collection.isActive
                        ? "translateY(0)"
                        : "translateY(16px)",
                      marginLeft: overlap,
                      transitionTimingFunction:
                        "cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                  >
                    <div
                      className="transition-all duration-500 ease-in-out"
                      style={{
                        width: `${circleSize}px`,
                        height: `${circleSize}px`,
                      }}
                    >
                      <div
                        className="rounded-full overflow-hidden w-full h-full flex items-center justify-center transition-all duration-50"
                        style={{
                          filter: collection.isActive
                            ? "none"
                            : "saturate(0.85)",
                        }}
                      >
                        <img
                          src={collection.image}
                          alt={`NFT Collection ${collection.id}`}
                          className="w-[85%] h-[85%] object-contain transition-all duration-500"
                          style={{
                            transform: collection.isActive
                              ? "scale(1.05)"
                              : "scale(0.95)",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer - 底部 */}
          <div className="w-full flex items-center justify-between px-4 md:px-8 pt-8 pb-4">
            <div className="text-[#2AD167] text-base md:text-lg">2025</div>
            <div className="flex items-center gap-2 md:gap-3">
              <span className="text-white text-xs md:text-sm">30%</span>

              <div
                className="w-25 h-3 bg-[#129D45] rounded-full overflow-hidden"
                style={{
                  padding: "1px",
                }}
              >
                <div
                  className="h-full bg-white transition-all duration-500 rounded-full"
                  style={{ width: "30%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

export default Page2;
