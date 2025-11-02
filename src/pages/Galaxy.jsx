import { useState, useEffect, useRef } from 'react'
import StarField from '../components/StarField'
import PlanetDisplay from '../components/PlanetDisplay'
import OrbitalSystem from '../components/OrbitalSystem'

export default function Galaxy() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [focusedPlanet, setFocusedPlanet] = useState('etheron')
  const mainContentRef = useRef(null)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (focusedPlanet && mainContentRef.current && !mainContentRef.current.contains(event.target)) {
        setFocusedPlanet(null)
      }
    }

    if (focusedPlanet) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [focusedPlanet])

  const handlePlanetClick = (planetId) => {
    // Always set the clicked planet as focused (don't toggle)
    setFocusedPlanet(planetId)
  }

  return (
    
    <div 
      className={`app ${isLoaded ? 'loaded' : ''}`}
      // style={{ backgroundImage: `url(${spaceBg})` }}
    >
      <StarField />
      
      <main ref={mainContentRef} className="main-content">
      
        <PlanetDisplay 
          focusedPlanet={focusedPlanet} 
          onPlanetClick={handlePlanetClick}
        />
        <OrbitalSystem 
          focusedPlanet={focusedPlanet}
          onPlanetClick={handlePlanetClick}
        />
      </main>
    </div>
  )
}