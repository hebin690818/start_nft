import './first/css/noemi3.css'
import menuIcon from './first/img/menu.png'
import card1 from './first/img/card1.png'
import card2 from './first/img/card2.png'
import card3 from './first/img/card3.jpg'
import card4 from './first/img/card4.png'
import card5 from './first/img/card5.png'
import pageFooter from './first/img/pageFooter.png'
import { useNoemiNavigation } from '../hooks/useNoemiNavigation'

function Noemi3() {
  useNoemiNavigation()
  
  return (
    <div className="noemi3-wrapper">
      <div className="content">
        <header className="header">
          <div className="enter-btn">works</div>
          <img alt="" className="menu-icon" src={menuIcon} />
        </header>
        <section className="card-list">
          <div className="card-first">
            <div className="card">
              <div className="card-header">
                <div className="sort">
                  <span>NO.1</span>
                  <span>APP</span>
                </div>
                <img alt="icon" src={card1} />
              </div>
              <h2>NODE</h2>
              <p className="description">This is an app about NFTs, which allows for the free trading and posting of NFTs.</p>
              <p>关于NFT的移动端</p>
            </div>
            <div className="card">
              <div className="card-header">
                <div className="sort">
                  <span>NO.2</span>
                  <span>APP&WEB</span>
                </div>
                <img src={card2} alt="icon" />
              </div>
              <h2>CryptoBridge</h2>
              <p className="description">This is an on-chain transaction wallet where users can transact directly.</p>
              <p>链上交易的钱包移动/pc端</p>
            </div>

            <div className="card-empty"></div>

            <div className="card no-margin-right">
              <div className="card-header">
                <div className="sort">
                  <span>NO.3</span>
                  <span>WEB(官网)</span>
                </div>
                <img src={card3} alt="icon" />
              </div>
              <h2>TECHPULSE</h2>
              <p className="description">The company's official website includes a company introduction and information about its business.</p>
              <a style={{ cursor: 'pointer' }} href="https://www.techpulse.pro/" target="_blank" rel="noopener noreferrer">https://www.techpulse.pro/</a>
            </div>
          </div>

          <div className="card-second">
            <div className="card-pie">
              <div className="pie"></div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="sort">
                  <span>NO.4</span>
                  <span>DATA DASHBOARD</span>
                </div>
                <img src={card4} alt="icon" />
              </div>
              <h2>VISUALIZATION</h2>
              <p className="description">Some data visualization content display</p>
              <p>数据大屏</p>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="sort">
                  <span>NO.5</span>
                  <span>AIGC&OTHER DESIGNS</span>
                </div>
                <img src={card5} alt="icon" />
              </div>
              <h2>AIGC&OTHER</h2>
              <p className="description">Works produced by AIGC, including poster designs, IP designs, and other design content.</p>
              <p>AIGC&其他设计</p>
            </div>
          </div>
        </section>
        <footer className="footer">
          <span className="year">[2025]</span>
          <img alt="" className="menu-icon" src={pageFooter} />
        </footer>
      </div>
    </div>
  )
}

export default Noemi3

