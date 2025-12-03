import './first/css/noemi2.css'
import menuIcon from './first/img/menu.png'
import userImg from './first/img/user.png'
import iconImg from './first/img/icons/img.png'
import iconImg1 from './first/img/icons/img_1.png'
import iconImg2 from './first/img/icons/img_2.png'
import iconImg3 from './first/img/icons/img_3.png'
import iconImg4 from './first/img/icons/img_4.png'
import iconImg5 from './first/img/icons/img_5.png'
import iconImg6 from './first/img/icons/img_6.png'
import iconImg7 from './first/img/icons/img_7.png'
import iconImg8 from './first/img/icons/img_8.png'
import iconImg9 from './first/img/icons/img_9.png'
import iconImg10 from './first/img/icons/img_10.png'
import iconImg11 from './first/img/icons/img_11.png'
import { useNoemiNavigation } from '../hooks/useNoemiNavigation'

function Noemi2() {
  useNoemiNavigation()
  
  return (
    <div className="noemi2-wrapper bg-black">
      <div className="content">
        <header className="header">
          <div className="enter-btn">personal information</div>
          <img alt="" className="menu-icon" src={menuIcon} />
        </header>
        <section>
          <div className="left">
            <div className="title">
              <div>
                <span>Pe</span>
                <span className="blue">re</span>
                <span>onal</span>
              </div>
              <div>
                <span>Inform</span>
                <span className="blue">atio</span>
                <span>n</span>
              </div>
            </div>
            <div className="info">
              <div>
                <div>
                  <span className="label">Name:</span>
                  <span>Noemi</span>
                </div>
                <div>
                  <div>
                    <span className="label">Age:</span>
                    <span>27</span>
                  </div>
                </div>
                <div>
                  <div>
                    <span className="label">Place:</span>
                    <span>CHENGDU</span>
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <div>
                    <span className="label">Works:</span>
                    <span>years</span>
                  </div>
                </div>
                <div>
                  <div>
                    <span className="label">UI Design:</span>
                    <span>3 years</span>
                  </div>
                </div>
                <div>
                  <div>
                    <span className="label">GenDer:</span>
                    <span>FEMALE</span>
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <span className="label">Telephone:</span>
                  <span>15178925969(wechat)</span>
                </div>
              </div>
              <div>
                <div>
                  <span className="label">email:</span>
                  <span>1511325057@qq.com</span>
                </div>
              </div>
            </div>
            <div className="icons">
              <div className='flex'>
                <img src={iconImg} alt="" />
                <img src={iconImg1} alt="" />
                <img src={iconImg2} alt="" />
                <img src={iconImg3} alt="" />
              </div>
              <div className='flex'>
                <img src={iconImg4} alt="" />
                <img src={iconImg5} alt="" />
                <img src={iconImg6} alt="" />
                <img src={iconImg7} alt="" />
                <img src={iconImg8} alt="" />
                <img src={iconImg9} alt="" />
                <img src={iconImg10} alt="" />
                <img src={iconImg11} alt="" />
              </div>
            </div>
            <div className="year">[2025]</div>
          </div>
          <div className="right">
            <img src={userImg} alt="" />
          </div>
        </section>
      </div>
    </div>
  )
}

export default Noemi2

