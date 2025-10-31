import { useState, useEffect, useRef } from 'react'
import Navigation from './components/Navigation'
import PlanetDisplay from './components/PlanetDisplay'
import OrbitalSystem from './components/OrbitalSystem'
import StarField from './components/StarField'
import spaceBg from './assets/Space.png'
import './App.css'

/**
 * Main application component
 * Displays a celestial body information page with smooth animations
 */
function App() {
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
      style={{ backgroundImage: `url(${spaceBg})` }}
    >
      {/* <StarField /> */}
      <Navigation />
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

export default App
