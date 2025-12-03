import { useEffect, useState, useRef } from 'react'
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
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const navigateSlide = (direction: 'up' | 'down') => {
      if (direction === 'down') {
        // 向下：下一个幻灯片
        // 如果已经是最后一张，禁止
        if (currentSlide < images.length - 1) {
          setCurrentSlide((prev) => prev + 1)
        }
      } else if (direction === 'up') {
        // 向上：上一个幻灯片
        // 如果是第一张，跳转到 page13
        if (currentSlide === 0) {
          navigate('/page13')
        } else {
          setCurrentSlide((prev) => prev - 1)
        }
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        navigateSlide('down')
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        navigateSlide('up')
      }
    }

    const handleWheel = (event: WheelEvent) => {
      // 防止默认滚动行为
      event.preventDefault()

      // 设置一个最小滚动阈值，避免轻微滚动就触发翻页
      const THRESHOLD = 40 // 需要明显滚动才触发
      if (Math.abs(event.deltaY) < THRESHOLD) {
        return
      }

      // 使用节流，避免滚动过快
      if (scrollTimeoutRef.current) {
        return
      }

      scrollTimeoutRef.current = setTimeout(() => {
        scrollTimeoutRef.current = null
      }, 900) // 900ms 内只响应一次滚动

      if (event.deltaY > 0) {
        // 向下滚动：下一个幻灯片
        navigateSlide('down')
      } else if (event.deltaY < 0) {
        // 向上滚动：上一个幻灯片
        navigateSlide('up')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('wheel', handleWheel)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
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
    <div className="page-transition last-slideshow-container">
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

