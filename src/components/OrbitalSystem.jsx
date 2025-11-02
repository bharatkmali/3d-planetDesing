import { useEffect, useRef, useState } from 'react'
import orionisImage from '../assets/images/ORIONIS.png'
import lumenaraImage from '../assets/images/LUMENARA.png'
import etheronImage from '../assets/images/ETHERON.png'
import theronixImage from '../assets/images/THERONIX.png'
import './OrbitalSystem.css'
import OrbitalCanvas from './OrbitalCanvas'

// Base sizes (desktop) - constant outside component
// ETHERON uses 400 when centered, but 130 when orbiting (like other planets)
const baseSizes = {
  etheron: 130,  // Default orbit size (same as theronix)
  orionis: 120,
  lumenara: 140,
  theronix: 130,
  moon1: 40,
  moon2: 35,
  moon3: 30,
  moon4: 32,
  moon5: 28,
  moon6: 25
}

// Calculate responsive size multiplier based on screen width
const getSizeMultiplier = (width) => {
  if (width <= 480) return 0.35      // Extra small mobile
  if (width <= 640) return 0.45      // Small mobile
  if (width <= 768) return 0.55      // Mobile
  if (width <= 1024) return 0.75     // Tablet
  if (width <= 1440) return 0.9      // Small desktop
  return 1                            // Large desktop
}

function OrbitalSystem({ focusedPlanet, onPlanetClick }) {
  const orbitalSystemRef = useRef(null)
  const animationFrameRef = useRef(null)
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080
  })
  
  // Get responsive size for planets and moons
  const getResponsiveSize = (baseSize) => {
    return Math.round(baseSize * getSizeMultiplier(screenSize.width))
  }
  
  const getOrbitalDistance = (bodyId) => {
    // Evenly spaced orbital distances for better visual distribution
    const orbitalDistances = {
      // Inner moons - evenly spaced
      'moon1': 780,
      'moon2': 730,
      'moon3': 580,
      'moon4': 530,
      'moon5': 680,
      'moon6': 630,
      // Planets - evenly spaced outward
      'orionis': 780,   // First planet layer
      'lumenara': 880,  // Second planet layer
      'theronix': 980,  // Third planet layer
      'etheron': 880    // Fourth planet layer (outermost)
    };
    
    return orbitalDistances[bodyId];
  };
  
  const [planetPositions, setPlanetPositions] = useState(() => {
    const multiplier = getSizeMultiplier(screenSize.width)
    const initialBodies = [
      { 
        id: 'etheron', 
        name: 'ETHERON', 
        image: etheronImage, 
        size: Math.round(500 * multiplier), // Start at center size
        baseSize: baseSizes.etheron, // Use orbit size (130) when not centered
        initialDistance: 0, // Center planet starts at center
        initialAngle: 180, 
        speed: 0.01, // Give it a slow speed for when it orbits
        type: 'planet', 
        isCenter: true 
      },
      { 
        id: 'orionis', 
        name: 'ORIONIS', 
        image: orionisImage, 
        size: Math.round(baseSizes.orionis * multiplier), 
        baseSize: baseSizes.orionis,
        initialDistance: getOrbitalDistance('orionis'), // 550
        initialAngle: 180, 
        speed: 0.02, 
        type: 'planet' 
      },
      { 
        id: 'lumenara', 
        name: 'LUMENARA', 
        image: lumenaraImage, 
        size: Math.round(baseSizes.lumenara * multiplier), 
        baseSize: baseSizes.lumenara,
        initialDistance: getOrbitalDistance('lumenara'), // 800
        initialAngle: 0, 
        speed: 0.015, 
        type: 'planet' 
      },
      { 
        id: 'theronix', 
        name: 'THERONIX', 
        image: theronixImage, 
        size: Math.round(baseSizes.theronix * multiplier), 
        baseSize: baseSizes.theronix,
        initialDistance: getOrbitalDistance('theronix'), // 1100
        initialAngle: 90, 
        speed: 0.018, 
        type: 'planet' 
      },
      { 
        id: 'moon1', 
        name: '', 
        color: '#4dd0e1', 
        size: Math.round(baseSizes.moon1 * multiplier), 
        baseSize: baseSizes.moon1,
        initialDistance: getOrbitalDistance('moon1'), // 380
        initialAngle: 45, 
        speed: 0.03, 
        type: 'moon' 
      },
      { 
        id: 'moon2', 
        name: '', 
        color: '#66bb6a', 
        size: Math.round(baseSizes.moon2 * multiplier), 
        baseSize: baseSizes.moon2,
        initialDistance: getOrbitalDistance('moon2'), // 420
        initialAngle: 135, 
        speed: 0.035, 
        type: 'moon' 
      },
      { 
        id: 'moon3', 
        name: '', 
        color: '#ff9800', 
        size: Math.round(baseSizes.moon3 * multiplier), 
        baseSize: baseSizes.moon3,
        initialDistance: getOrbitalDistance('moon3'), // 460
        initialAngle: 225, 
        speed: 0.025, 
        type: 'moon' 
      },
      { 
        id: 'moon4', 
        name: '', 
        color: '#ab47bc', 
        size: Math.round(baseSizes.moon4 * multiplier), 
        baseSize: baseSizes.moon4,
        initialDistance: getOrbitalDistance('moon4'), // 500
        initialAngle: 315, 
        speed: 0.027, 
        type: 'moon' 
      },
      { 
        id: 'moon5', 
        name: '', 
        color: '#ef5350', 
        size: Math.round(baseSizes.moon5 * multiplier), 
        baseSize: baseSizes.moon5,
        initialDistance: getOrbitalDistance('moon5'), // 540
        initialAngle: 270, 
        speed: 0.037, 
        type: 'moon' 
      },
      { 
        id: 'moon6', 
        name: '', 
        color: '#ffb74d', 
        size: Math.round(baseSizes.moon6 * multiplier), 
        baseSize: baseSizes.moon6,
        initialDistance: getOrbitalDistance('moon6'), // 580
        initialAngle: 90, 
        speed: 0.032, 
        type: 'moon' 
      }
    ]
    
    return initialBodies.reduce((acc, body) => {
      // Ensure each body gets its unique orbital distance
      const orbitalDistance = body.initialDistance || getOrbitalDistance(body.id) || 0
      acc[body.id] = {
        angle: body.initialAngle,
        distance: orbitalDistance,
        targetDistance: orbitalDistance, // Store the unique orbital distance as target
        targetX: 0,
        targetY: 0,
        currentX: body.isCenter ? 0 : orbitalDistance * Math.cos((body.initialAngle * Math.PI) / 180),
        currentY: body.isCenter ? 0 : orbitalDistance * Math.sin((body.initialAngle * Math.PI) / 180),
        isMovingToCenter: false,
        ...body
      }
      return acc
    }, {})
  })
  

  // Handle window resize to update sizes
  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth
      const newHeight = window.innerHeight
      
      // Calculate multiplier based on new width
      const multiplier = getSizeMultiplier(newWidth)
      
      setScreenSize({
        width: newWidth,
        height: newHeight
      })
      
      // Update all planet and moon sizes based on new screen size
      setPlanetPositions(prev => {
        const updated = {}
        Object.keys(prev).forEach(bodyId => {
          const body = prev[bodyId]
          // If planet is centered, use center size (500px responsive)
          if (body.isCenter) {
            updated[bodyId] = {
              ...body,
              size: Math.round(500 * multiplier)
            }
          } else {
            // Otherwise use base size for regular planets/moons
            const baseSize = body.baseSize || baseSizes[bodyId] || body.size
            updated[bodyId] = {
              ...body,
              size: Math.round(baseSize * multiplier)
            }
          }
        })
        return updated
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const system = orbitalSystemRef.current
    if (!system) return

    const animate = () => {
      const rect = system.getBoundingClientRect()
      // Responsive max distance based on screen size
      const isMobile = window.innerWidth <= 768
      const isSmallMobile = window.innerWidth <= 480
      const padding = isSmallMobile ? 60 : isMobile ? 80 : 100
      // Calculate max distance - use the smaller of width/height to ensure planets stay within bounds
      // Account for space above and below center (use 45% to leave margin at top and bottom)
      const containerMax = Math.min(rect.width / 2, rect.height * 0.45) - padding
      // Ensure maxDistance is reasonable - at least 400px but not larger than needed
      const maxDistance = containerMax > 0 ? Math.max(Math.min(containerMax, 600), 400) : 500
      
      // Calculate responsive center planet size (original: 500px, now responsive)
      const centerSizeMultiplier = getSizeMultiplier(window.innerWidth)
      const getCenterPlanetSize = () => {
        return Math.round(500 * centerSizeMultiplier)
      }

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
              size: isAtCenter ? getCenterPlanetSize() : body.size
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
            // Use the unique orbital distance for this body
            const bodyOrbitalDistance = getOrbitalDistance(bodyId)
            if (!bodyOrbitalDistance) {
              console.warn(`${bodyId}: getOrbitalDistance returned 0, using fallback`);
            }
            // Get the intended orbit distance
            let intendedDistance = bodyOrbitalDistance || body.targetDistance || body.distance
            
            // Scale all orbits proportionally to fit within container while maintaining relative spacing
            const largestOrbit = Math.max(
              getOrbitalDistance('etheron'),
              getOrbitalDistance('theronix'),
              getOrbitalDistance('lumenara'),
              getOrbitalDistance('orionis'),
              880 // Updated largest orbit
            )
            
            let finalDistance = intendedDistance
            
            // Always scale proportionally to ensure all planets fit and are visible
            if (maxDistance > 0 && largestOrbit > 0) {
              const scaleFactor = maxDistance / largestOrbit
              // Apply scaling, but ensure minimum visibility (at least 30% of original)
              const scaledDistance = intendedDistance * scaleFactor
              // Only use scaling if it results in a reasonable size
              if (scaledDistance > 50 && scaledDistance <= maxDistance) {
                finalDistance = scaledDistance
              } else if (intendedDistance > maxDistance) {
                // If still too large, cap at maxDistance
                finalDistance = maxDistance
              } else {
                // Use intended distance if it fits
                finalDistance = intendedDistance
              }
            }
            
            const angleRad = (newAngle * Math.PI) / 180
            const x = Math.cos(angleRad) * finalDistance
            const y = Math.sin(angleRad) * finalDistance
            
            updated[bodyId] = {
              ...body,
              angle: newAngle,
              distance: finalDistance,
              currentX: x,
              currentY: y,
              targetDistance: bodyOrbitalDistance || body.targetDistance // Keep original orbital distance as target
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
              size: getCenterPlanetSize()
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
        
        Object.keys(prev).forEach(id => {
          const body = prev[id]
          if (id === bodyId) {
            updated[id] = {
              ...body,
              isMovingToCenter: true,
              targetDistance: 0,
              targetX: 0,
              targetY: 0,
              isCenter: false
            }
          } else if (body.isCenter && id !== bodyId) {
            const atCenter = Math.abs(body.currentX || 0) < 1 && Math.abs(body.currentY || 0) < 1
            let returnAngle = body.angle || 180
            let returnDistance = body.targetDistance || getOrbitalDistance(body.id)
            
            if (!atCenter) {
              returnAngle = Math.atan2(body.currentY || 0, body.currentX || 0) * 180 / Math.PI
              returnDistance = Math.sqrt((body.currentX || 0) ** 2 + (body.currentY || 0) ** 2)
            }
            
            // If distance is too small, use unique orbital distance
            if (returnDistance < 50) {
              returnDistance = getOrbitalDistance(body.id)
              returnAngle = 180
            }
            
            // Reset size to responsive base size if it was center planet
            const baseSize = body.baseSize || baseSizes[id] || 120
            const multiplier = getSizeMultiplier(window.innerWidth)
            const responsiveSize = Math.round(baseSize * multiplier)
            
            updated[id] = {
              ...body,
              isCenter: false,
              isMovingToCenter: false,
              angle: returnAngle >= 0 ? returnAngle : returnAngle + 360,
              distance: returnDistance,
              targetDistance: returnDistance,
              size: responsiveSize, // Reset size to responsive base size
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
    <>
      <OrbitalCanvas orbitalSystemRef={orbitalSystemRef} planets={Object.values(planetPositions)} />
      <div ref={orbitalSystemRef} className="orbital-system">
      {Object.values(planetPositions).map((body) => {
        const isFocused = focusedPlanet === body.id
        const isCenter = body.isCenter || isFocused
        
        // Calculate position
        const x = body.currentX !== undefined ? body.currentX : 0
        const y = body.currentY !== undefined ? body.currentY : 0
        
        // Use the size from body state (already responsive)
        const planetSize = body.size || getResponsiveSize(baseSizes[body.id] || 100)
        
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
    </>
  )
}

export default OrbitalSystem

