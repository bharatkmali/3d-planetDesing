import { useEffect, useRef, useState } from 'react'
import orionisImage from '../assets/ORIONIS.png'
import lumenaraImage from '../assets/LUMENARA.png'
import etheronImage from '../assets/ETHERON.png'
import theronixImage from '../assets/THERONIX.png'
import './OrbitalSystem.css'

/**
 * OrbitalSystem component displaying celestial bodies
 */
function OrbitalSystem({ focusedPlanet, onPlanetClick }) {
  const orbitalSystemRef = useRef(null)
  const animationFrameRef = useRef(null)
  
  const [planetPositions, setPlanetPositions] = useState(() => {
    const initialBodies = [
      { id: 'etheron', name: 'ETHERON', image: etheronImage, size: 400, initialDistance: 0, initialAngle: 0, speed: 0, type: 'planet', isCenter: true },
      { id: 'orionis', name: 'ORIONIS', image: orionisImage, size: 120, initialDistance: 600, initialAngle: 180, speed: 0.02, type: 'planet' },
      { id: 'lumenara', name: 'LUMENARA', image: lumenaraImage, size: 140, initialDistance: 650, initialAngle: 0, speed: 0.015, type: 'planet' },
      { id: 'theronix', name: 'THERONIX', image: theronixImage, size: 130, initialDistance: 620, initialAngle: 90, speed: 0.018, type: 'planet' },
      // { id: 'moon1', name: '', color: '#4dd0e1', size: 40, initialDistance: 250, initialAngle: 45, speed: 0.03, type: 'moon' },
      // { id: 'moon2', name: '', color: '#66bb6a', size: 35, initialDistance: 200, initialAngle: 135, speed: 0.035, type: 'moon' },
      // { id: 'moon3', name: '', color: '#ff9800', size: 30, initialDistance: 300, initialAngle: 225, speed: 0.025, type: 'moon' },
      // { id: 'moon4', name: '', color: '#ab47bc', size: 32, initialDistance: 280, initialAngle: 315, speed: 0.027, type: 'moon' },
      // { id: 'moon5', name: '', color: '#ef5350', size: 28, initialDistance: 180, initialAngle: 270, speed: 0.037, type: 'moon' },
      // { id: 'moon6', name: '', color: '#ffb74d', size: 25, initialDistance: 220, initialAngle: 90, speed: 0.032, type: 'moon' }
    ]
    
    return initialBodies.reduce((acc, body) => {
      acc[body.id] = {
        angle: body.initialAngle,
        distance: body.initialDistance,
        targetDistance: body.initialDistance,
        targetX: 0,
        targetY: 0,
        currentX: body.isCenter ? 0 : body.initialDistance * Math.cos((body.initialAngle * Math.PI) / 180),
        currentY: body.isCenter ? 0 : body.initialDistance * Math.sin((body.initialAngle * Math.PI) / 180),
        isMovingToCenter: false,
        ...body
      }
      return acc
    }, {})
  })

  useEffect(() => {
    const system = orbitalSystemRef.current
    if (!system) return

    const animate = () => {
      const rect = system.getBoundingClientRect()
      const maxDistance = Math.min(rect.width, rect.height) / 2 - 100

      setPlanetPositions(prev => {
        const updated = {}
        Object.keys(prev).forEach(bodyId => {
          const body = prev[bodyId]
          
          // Handle planet moving to center
          if (body.isMovingToCenter && focusedPlanet === bodyId) {
            const centerX = 0
            const centerY = 0
            const easeFactor = 0.12
            const currentX = body.currentX || 0
            const currentY = body.currentY || 0
            
            const newX = currentX + (centerX - currentX) * easeFactor
            const newY = currentY + (centerY - currentY) * easeFactor
            
            // Check if close enough to center
            const distanceToCenter = Math.sqrt(newX * newX + newY * newY)
            const isAtCenter = distanceToCenter < 2
            
            updated[bodyId] = {
              ...body,
              currentX: isAtCenter ? 0 : newX,
              currentY: isAtCenter ? 0 : newY,
              distance: 0,
              isMovingToCenter: !isAtCenter,
              isCenter: isAtCenter,
              size: isAtCenter ? 400 : body.size
            }
          }
          // Handle previous center planet returning to orbit
          else if (body.isCenter && bodyId !== focusedPlanet) {
            const newAngle = (body.angle + body.speed) % 360
            const boundedDistance = Math.min(body.targetDistance || body.distance, maxDistance)
            const angleRad = (newAngle * Math.PI) / 180
            const targetX = Math.cos(angleRad) * boundedDistance
            const targetY = Math.sin(angleRad) * boundedDistance
            
            // Smooth transition back to orbit
            const easeFactor = 0.1
            const currentX = body.currentX || 0
            const currentY = body.currentY || 0
            const newX = currentX + (targetX - currentX) * easeFactor
            const newY = currentY + (targetY - currentY) * easeFactor
            
            const distanceToTarget = Math.sqrt((targetX - newX) ** 2 + (targetY - newY) ** 2)
            const hasReachedOrbit = distanceToTarget < 10
            
            updated[bodyId] = {
              ...body,
              angle: newAngle,
              distance: hasReachedOrbit ? boundedDistance : body.distance,
              currentX: hasReachedOrbit ? targetX : newX,
              currentY: hasReachedOrbit ? targetY : newY,
              targetDistance: boundedDistance,
              isCenter: !hasReachedOrbit
            }
          } 
          // Handle other planets orbiting
          else if (bodyId !== focusedPlanet && !body.isCenter) {
            const newAngle = (body.angle + body.speed) % 360
            const boundedDistance = Math.min(body.targetDistance || body.distance, maxDistance)
            const angleRad = (newAngle * Math.PI) / 180
            const x = Math.cos(angleRad) * boundedDistance
            const y = Math.sin(angleRad) * boundedDistance
            
            updated[bodyId] = {
              ...body,
              angle: newAngle,
              distance: boundedDistance,
              currentX: x,
              currentY: y,
              targetDistance: boundedDistance
            }
          }
          // Handle center planet (focused)
          else if (focusedPlanet === bodyId || body.isCenter) {
            updated[bodyId] = {
              ...body,
              currentX: 0,
              currentY: 0,
              distance: 0,
              isCenter: true,
              size: 400
            }
          }
          // Default case
          else {
            updated[bodyId] = body
          }
        })
        return updated
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [focusedPlanet])

  useEffect(() => {
    const system = orbitalSystemRef.current
    if (!system) return

    const updateBoundaries = () => {
      const rect = system.getBoundingClientRect()
      const maxDistance = Math.min(rect.width, rect.height) / 2 - 100
      
      setPlanetPositions(prev => {
        const updated = {}
        Object.keys(prev).forEach(bodyId => {
          const body = prev[bodyId]
          updated[bodyId] = {
            ...body,
            distance: Math.min(body.distance, maxDistance)
          }
        })
        return updated
      })
    }

    window.addEventListener('resize', updateBoundaries)

    return () => {
      window.removeEventListener('resize', updateBoundaries)
    }
  }, [])

  const handleBodyClick = (bodyId) => {
    if (planetPositions[bodyId]?.type === 'planet') {
      // Mark all planets for position update
      setPlanetPositions(prev => {
        const updated = {}
        const previousCenter = Object.values(prev).find(b => b.isCenter && b.id !== bodyId)
        
        Object.keys(prev).forEach(id => {
          const body = prev[id]
          if (id === bodyId) {
            // Mark clicked planet to move to center
            const currentX = body.currentX || 0
            const currentY = body.currentY || 0
            updated[id] = {
              ...body,
              isMovingToCenter: true,
              targetDistance: 0,
              targetX: 0,
              targetY: 0,
              isCenter: false // Will be set when it reaches center
            }
          } else if (body.isCenter && id !== bodyId) {
            // Previous center planet moves back to orbit
            // Use default orbital parameters if at center (0,0)
            const atCenter = Math.abs(body.currentX || 0) < 1 && Math.abs(body.currentY || 0) < 1
            let returnAngle = body.angle || 180
            let returnDistance = body.targetDistance || body.size === 400 ? 0 : 600
            
            if (!atCenter) {
              returnAngle = Math.atan2(body.currentY || 0, body.currentX || 0) * 180 / Math.PI
              returnDistance = Math.sqrt((body.currentX || 0) ** 2 + (body.currentY || 0) ** 2)
            }
            
            if (returnDistance < 50) {
              returnDistance = 600
              returnAngle = 180
            }
            
            updated[id] = {
              ...body,
              isCenter: false,
              isMovingToCenter: false,
              angle: returnAngle >= 0 ? returnAngle : returnAngle + 360,
              distance: returnDistance,
              targetDistance: returnDistance,
              size: body.size === 400 ? 120 : body.size, // Reset size if it was center planet
              currentX: atCenter ? returnDistance : body.currentX || 0,
              currentY: atCenter ? 0 : body.currentY || 0
            }
          } else if (body.type === 'planet') {
            // Other planets continue orbiting
            updated[id] = {
              ...body,
              isMovingToCenter: false,
              isCenter: false
            }
          } else {
            updated[id] = body
          }
        })
        return updated
      })
      onPlanetClick(bodyId)
    }
  }

  return (
    <div ref={orbitalSystemRef} className="orbital-system">
      {Object.values(planetPositions).map((body) => {
        const isFocused = focusedPlanet === body.id
        const isCenter = body.isCenter || isFocused
        
        // Calculate position
        const x = body.currentX !== undefined ? body.currentX : 0
        const y = body.currentY !== undefined ? body.currentY : 0
        
        const planetSize = body.size || (isCenter ? 400 : body.size)
        
        return (
          <div
            key={body.id}
            className={`celestial-body ${body.type} ${body.id} ${isFocused ? 'focused' : ''} ${isCenter ? 'center-planet' : ''}`}
            style={{
              '--size': `${planetSize}px`,
              '--color': body.color || 'transparent',
              width: `${planetSize}px`,
              height: `${planetSize}px`,
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              zIndex: isCenter ? 1000 : (isFocused && body.isMovingToCenter ? 1001 : 20),
              transition: isCenter || body.isMovingToCenter ? 'transform 0.1s linear, width 0.5s ease, height 0.5s ease, z-index 0.3s ease' : 'transform 0.3s ease, z-index 0.3s ease'
            }}
            onClick={() => handleBodyClick(body.id)}
          >
            {body.image ? (
              <img 
                src={body.image} 
                alt={body.name || body.id} 
                className="body-image"
                draggable="false"
              />
            ) : (
              <div className="body-sphere"></div>
            )}
            {body.name && !isCenter && <div className="body-name">{body.name}</div>}
          </div>
        )
      })}
      {/* Orbital paths */}
      {/* <div className="orbital-path path-1"></div>
      <div className="orbital-path path-2"></div>
      <div className="orbital-path path-3"></div> */}
    </div>
  )
}

export default OrbitalSystem

