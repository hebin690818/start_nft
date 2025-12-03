import bgImage from "../assets/bg1.png";
import img1 from "../assets/img1.png";
import img2 from "../assets/img2.png";
import img3 from "../assets/img3.png";
import triangle from "../assets/triangle.png";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";

function Page1() {
  useKeyboardNavigation();
  
  return (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-[#020c06] via-[#031207] to-[#010402] text-white">
      <div className="flex flex-1 items-end justify-center px-4 sm:px-6 md:px-8">
        <div className="mx-auto flex flex-col items-center gap-8 sm:gap-10 md:gap-14 lg:flex-row lg:items-center lg:gap-38">
          <div className="relative w-full max-w-2xl overflow-hidden sm:overflow-visible xl:max-w-3xl">
            <div className="absolute inset-x-0 top-0 bottom-6 rounded-[48px] bg-linear-to-b from-emerald-500/10 to-transparent blur-3xl" />
            <img
              src={triangle}
              alt="Neon triangle outline"
              className="relative z-0 mx-auto h-[300px] w-[310px] opacity-60 sm:h-[400px] sm:w-[410px] md:h-[500px] md:w-[510px] lg:h-[600px] lg:w-[620px] xl:h-[550px] xl:w-[570px]"
            />
            <img
              src={img3}
              alt="Bear NFT card 3"
              className="absolute left-[9%] bottom-[-5%] z-10 w-[200px] drop-shadow-2xl sm:w-[250px] md:w-[320px] lg:w-[430px] xl:w-[380px]"
            />
            <img
              src={img2}
              alt="Bear NFT card 2"
              className="absolute right-[-8%] top-[7%] z-20 w-[200px] drop-shadow-2xl sm:right-[-10%] sm:w-[250px] md:right-[-12%] md:w-[320px] lg:right-[-14%] lg:w-[430px] xl:right-[-12%] xl:w-[380px]"
            />
            <img
              src={img1}
              alt="Bear NFT card 1"
              className="absolute left-1/2 top-[-3%] z-30 w-[200px] -translate-x-1/2 -rotate-3 drop-shadow-2xl sm:w-[250px] md:w-[320px] lg:w-[430px] xl:w-[380px]"
            />
          </div>

          <div className="flex w-full max-w-xl flex-col items-center gap-8 text-center lg:items-start lg:text-left">
            <h1 className="text-5xl font-bold leading-tight md:text-6xl">
              NFT Design
              <br />
              Reimagining Digital
              <br />
              <span className="text-emerald-400">Value.</span>
            </h1>
            <p className="text-xl text-gray-300">
              技术是结构，艺术是灵魂。在去中心化的世界中，创造新的叙述语言。以代码雕刻情感，让艺术永不褪色。
            </p>
            <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
              <div
                className="h-auto rounded-lg border-none px-10 py-2 font-semibold text-white shadow-lg shadow-emerald-500/30"
                style={{
                  background:
                    "linear-gradient(282deg, #72FFF3 -14.75%, #54D8A9 22.58%, #6FFF98 67.15%, #307FE7 110.51%)",
                  fontSize: "20px",
                }}
              >
                Explore Now
              </div>
              <div
                className="h-auto rounded-lg border px-10 py-2"
                style={{
                  borderColor: "#72FFF3",
                  backgroundImage:
                    "linear-gradient(282deg, #72FFF3 -14.75%, #54D8A9 22.58%, #6FFF98 67.15%, #307FE7 110.51%)",
                  backgroundColor: "transparent",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  WebkitTextFillColor: "transparent",
                  fontFamily: "Poppins",
                  fontSize: "20px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "normal",
                }}
              >
                Create NFT
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-5 w-full">
        <img
          src={bgImage}
          alt="Ticker background"
          className="h-auto w-full object-cover"
        />
      </div>
    </div>
  );
}

export default Page1;
