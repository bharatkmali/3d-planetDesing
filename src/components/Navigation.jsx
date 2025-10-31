import { useState } from 'react'
import './Navigation.css'

/**
 * Navigation component with METEORA branding
 */
function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <nav className="navigation">
      <div className="nav-left">
        <a href="#" className="nav-link" onClick={closeMenu}>Home</a>
        <a href="#" className="nav-link" onClick={closeMenu}>About</a>
        <a href="#" className="nav-link" onClick={closeMenu}>Contact</a>
      </div>
      <div className="nav-center">
        <h2 className="nav-logo">METEORA</h2>
      </div>
      <div className="nav-right">
        <a href="#" className="nav-link active" onClick={closeMenu}>Galaxies</a>
        <a href="#" className="nav-link" onClick={closeMenu}>Solar System</a>
        <a href="#" className="nav-link" onClick={closeMenu}>Earth</a>
      </div>
      <button 
        className="menu-toggle" 
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span className={isMenuOpen ? 'open' : ''}></span>
        <span className={isMenuOpen ? 'open' : ''}></span>
        <span className={isMenuOpen ? 'open' : ''}></span>
      </button>
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <a href="#" className="mobile-nav-link" onClick={closeMenu}>Home</a>
        <a href="#" className="mobile-nav-link" onClick={closeMenu}>About</a>
        <a href="#" className="mobile-nav-link" onClick={closeMenu}>Contact</a>
        <a href="#" className="mobile-nav-link active" onClick={closeMenu}>Galaxies</a>
        <a href="#" className="mobile-nav-link" onClick={closeMenu}>Solar System</a>
        <a href="#" className="mobile-nav-link" onClick={closeMenu}>Earth</a>
      </div>
    </nav>
  )
}

export default Navigation

