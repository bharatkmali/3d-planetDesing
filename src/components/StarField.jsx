import { useEffect, useRef } from 'react'
import './StarField.css'

/**
 * StarField component for animated starry background
 */
function StarField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const stars = []

    // Create stars
    const createStars = () => {
      stars.length = 0
      const numStars = Math.floor((canvas.width * canvas.height) / 8000)
      for (let i = 0; i < numStars; i++) {
        const starType = Math.random()
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: starType > 0.9 ? Math.random() * 2 + 1.5 : Math.random() * 1.2 + 0.5,
          opacity: starType > 0.9 ? Math.random() * 0.5 + 0.8 : Math.random() * 0.7 + 0.3,
          twinkleSpeed: Math.random() * 0.03 + 0.01,
          twinklePhase: Math.random() * Math.PI * 2
        })
      }
    }

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      createStars()
    }
    setCanvasSize()
    window.addEventListener('resize', setCanvasSize)

    let twinklePhase = 0
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      twinklePhase += 0.01

      stars.forEach(star => {
        const twinkle = Math.sin(twinklePhase * star.twinkleSpeed + star.twinklePhase) * 0.3 + 0.7
        const opacity = star.opacity * twinkle
        
        // Draw star with glow effect for larger stars
        if (star.radius > 1.5) {
          const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.radius * 2)
          gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`)
          gradient.addColorStop(0.5, `rgba(255, 255, 255, ${opacity * 0.5})`)
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
          ctx.fillStyle = gradient
          ctx.fillRect(star.x - star.radius * 2, star.y - star.radius * 2, star.radius * 4, star.radius * 4)
        }
        
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, Math.min(1, opacity))})`
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', setCanvasSize)
    }
  }, [])

  return <canvas ref={canvasRef} className="star-field" />
}

export default StarField

