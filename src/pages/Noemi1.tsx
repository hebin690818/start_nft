import "./first/css/noemi1.css";
import bgVideo from "./first/img/bg.mp4";
import titleImg from "./first/img/title.png";
import menuIcon from "./first/img/menu.png";
import pageFooter from "./first/img/pageFooter.png";
import { useNoemiNavigation } from "../hooks/useNoemiNavigation";

function Noemi1() {
  useNoemiNavigation();

  return (
    <div className="noemi1-wrapper bg-black">
      {/* 背景视频 */}
      <video autoPlay className="noemi1-bg-video" loop muted>
        <source src={bgVideo} type="video/mp4" />
      </video>

      <div className="content">
        {/* 顶部区域 */}
        <header className="header">
          <div className="logo-area">
            <img alt="" src={titleImg} />
          </div>

          <div className="header-right">
            <div className="enter-btn">Enter</div>
            <img alt="" className="menu-icon" src={menuIcon} />
          </div>
        </header>

        {/* 内容主体 */}
        <section className="hero">
          <h1 className="hero-title">
            Noemi`s
            <br />
            UI Portfolio
          </h1>
          <p className="sub-title">
            Presenting you with a visual feast
            <br />
            More than 3 years of UI/UX design experience
          </p>

          <div className="start-btn">Get Started Now →</div>

          <div className="year-text">2025年度作品集展示</div>
        </section>

        {/* 底部 */}
        <footer className="footer">
          <span className="year">[2025]</span>
          <div className="app_web">
            <span className="app_web_test">
              <span>APP</span>
              <span>WEB</span>
              <span>LARGE</span>
              <span>DATA</span>
              <span>SCREEN</span>
              <span>AIGC</span>
            </span>
          </div>
          <img alt="" className="menu-icon" src={pageFooter} />
        </footer>
      </div>
    </div>
  );
}

export default Noemi1;
