import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";
import video1 from "../assets/video/video1.mp4";
import video2 from "../assets/video/video2.mp4";
import flowImage from "../assets/945.png";
import ico1 from "../assets/ico1.png";

function Page4() {
  useKeyboardNavigation();

  return (
    <div className="page-transition relative min-h-screen bg-black text-white overflow-x-hidden">
      {/* 右上角视频动画 */}
      <div className="absolute top-2.5 right-9 z-10">
        <video
          src={video1}
          autoPlay
          muted
          loop
          playsInline
          className="rounded-lg shadow-2xl"
          style={{
            transform: "rotate(-30deg)",
            width: "12.5rem",
            height: "12.5rem",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-24 pb-20 md:pb-24">
        {/* 顶部区域 */}
        <div className="mb-8 md:mb-12 pl-16">
          {/* User Flow 标签 */}
          <div className="flex items-center gap-3 mb-6">
            <img src={ico1} alt="Page 4" className="w-[250px] h-[56px]" />
          </div>

          {/* 平台描述 - 英文 */}
          <div
            className="mb-6 leading-relaxed text-center"
            style={{
              maxWidth: "1300px",
              margin: "0 auto",
              fontSize: "48px",
            }}
          >
            <p className="text-white mb-2">
              A decentralized{" "}
              <span className="text-[#2AD167] font-semibold">
                platform integrating
              </span>{" "}
              NFT creation, trading, and discovery. Users can{" "}
              <span className="text-[#2AD167] font-semibold">
                buy, publish, collect
              </span>
              , and explore digital art and creative assets from around the
              world,{" "}
              <span className="text-[#2AD167] font-semibold">easily</span>{" "}
              participating in the Web3 creative economy.
            </p>
          </div>

          {/* 平台描述 - 中文 */}
          <div
            className="leading-relaxed space-y-2 text-center"
            style={{
              maxWidth: "1300px",
              margin: "0 auto",
              fontSize: "24px",
              color: "rgba(255, 255, 255, 0.60)",
            }}
          >
            <p>
              NODE是一个集
              NFT创作、交易与发现于一体的去中心化平台。用户可以在这里购买、发布、收藏和探索来自全球的数字艺术与创意资产,轻松参与
              Web3 创作经济。
            </p>
            <p>
              我们致力于让每一位创作者拥有真正的数字所有权,让每一份创意都能被发现、流通与尊重。
            </p>
          </div>
        </div>

        {/* 用户流程图 - 使用图片 */}
        <div className="relative flex flex-col items-center justify-center pt-12">
          <img
            src={flowImage}
            alt="User Flow Diagram"
            className="w-full h-auto object-contain relative z-10"
          />

          {/* 底部视频背景 */}
          <div className="absolute bottom-[-100px] left-0 right-0 overflow-hidden z-0">
            <video
              src={video2}
              autoPlay
              muted
              loop
              playsInline
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "906px",
                opacity: 0.1,
              }}
            />
            {/* 视频蒙层 */}
            {/* <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, #000 25.66%, rgba(0, 0, 0, 0.00) 50%), url(<path-to-image>) lightgray 50% / cover no-repeat",
              }}
            /> */}
          </div>
        </div>

        {/* 底部区域 */}
        <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 right-4 md:right-8 flex items-center justify-between">
          <div className="text-[#2AD167] text-base md:text-lg font-medium pl-16">
            2025
          </div>
          <div className="flex items-center gap-2 md:gap-3 pr-16">
            <span className="text-white text-xs md:text-sm">30%</span>
            <div className="w-20 md:w-32 h-2 md:h-3 bg-[#129D45] rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: "30%" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page4;
