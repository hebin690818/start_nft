import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './last/last.css'
import img from './last/images/img.png'
import img1 from './last/images/img_1.png'
import img2 from './last/images/img_2.png'
import img3 from './last/images/img_3.png'
import img4 from './last/images/img_4.png'
import img5 from './last/images/img_5.png'

const images = [img, img1, img2, img3, img4, img5]

function Last() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        // 如果已经是最后一张，禁止右箭头
        if (currentSlide < images.length - 1) {
          setCurrentSlide((prev) => prev + 1)
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        // 如果是第一张，跳转到 page13
        if (currentSlide === 0) {
          navigate('/page13')
        } else {
          setCurrentSlide((prev) => prev - 1)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentSlide, navigate])

  const nextSlide = () => {
    // 如果已经是最后一张，禁止右箭头
    if (currentSlide < images.length - 1) {
      setCurrentSlide((prev) => prev + 1)
    }
  }

  const prevSlide = () => {
    // 如果是第一张，跳转到 page13
    if (currentSlide === 0) {
      navigate('/page13')
    } else {
      setCurrentSlide((prev) => prev - 1)
    }
  }

  return (
    <div className="last-slideshow-container">
      {images.map((imageSrc, index) => (
        <div
          key={index}
          className={`last-slide ${index === currentSlide ? 'active' : ''}`}
        >
          <img src={imageSrc} alt={`图片${index + 1}`} />
        </div>
      ))}

      <div className="last-slide-counter">
        <span>{currentSlide + 1}</span><span>/{images.length}</span>
      </div>

      <div className="last-controls">
        <button className="last-control-btn prev-btn" onClick={prevSlide}>
          ←
        </button>
        <button 
          className="last-control-btn next-btn" 
          onClick={nextSlide}
          disabled={currentSlide === images.length - 1}
          style={{ 
            opacity: currentSlide === images.length - 1 ? 0.5 : 1,
            cursor: currentSlide === images.length - 1 ? 'not-allowed' : 'pointer'
          }}
        >
          →
        </button>
      </div>
    </div>
  )
}

export default Last

