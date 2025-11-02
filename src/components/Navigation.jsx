import { useState } from 'react'
import './Navigation.css'
import { Link } from 'react-router-dom'
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
        <Link to="/home" className="nav-link" onClick={closeMenu}>Home</Link>
        <Link to="/about" className="nav-link" onClick={closeMenu}>About</Link>
        <Link to="/contact" className="nav-link" onClick={closeMenu}>Contact</Link>
      </div>
      <div className="nav-center">
        <h2 className="nav-logo">METEORA</h2>
      </div>
      <div className="nav-right">
        <Link to="/" className="nav-link" onClick={closeMenu}>Galaxies</Link>
        <Link to="/solar-system" className="nav-link" onClick={closeMenu}>Solar System</Link>
        <Link to="/earth" className="nav-link" onClick={closeMenu}>Earth</Link>
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
        <Link to="/home" className="mobile-nav-link" onClick={closeMenu}>Home</Link>
        <Link to="/about" className="mobile-nav-link" onClick={closeMenu}>About</Link>
        <Link to="/contact" className="mobile-nav-link" onClick={closeMenu}>Contact</Link>
        <Link to="/" className="mobile-nav-link" onClick={closeMenu}>Galaxies</Link>
        <Link to="/solar-system" className="mobile-nav-link" onClick={closeMenu}>Solar System</Link>
        <Link to="/earth" className="mobile-nav-link" onClick={closeMenu}>Earth</Link>
      </div>
    </nav>
  )
}

export default Navigation

