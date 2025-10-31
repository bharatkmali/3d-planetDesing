import './PlanetDisplay.css'

/**
 * PlanetDisplay component for displaying planet statistics
 */
function PlanetDisplay({ focusedPlanet }) {
  const planetData = {
    etheron: {
      name: 'ETHERON',
      stats: [
        { label: 'GALAXY', value: 'Andromeda-IV' },
        { label: 'DIAMETER', value: '16,400 km' },
        { label: 'DAY LENGTH', value: '26 Earth hours' },
        { label: 'AVG TEMPERATURE', value: '-20°C to 0°C' },
        { label: 'CLIMATE', value: 'Polar' }
      ]
    },
    orionis: {
      name: 'ORIONIS',
      stats: [
        { label: 'GALAXY', value: 'Virgo A' },
        { label: 'DIAMETER', value: '120,780 km' },
        { label: 'DAY LENGTH', value: '4 Earth hours' },
        { label: 'AVG TEMPERATURE', value: '10°C to 40°C' },
        { label: 'CLIMATE', value: 'Temperate' }
      ]
    },
    lumenara: {
      name: 'LUMENARA',
      stats: [
        { label: 'GALAXY', value: 'Andromeda-IV' },
        { label: 'DIAMETER', value: '11,540 km' },
        { label: 'DAY LENGTH', value: '56 Earth hours' },
        { label: 'AVG TEMPERATURE', value: '10°C to 30°C' },
        { label: 'CLIMATE', value: 'Tropical' }
      ]
    },
    theronix: {
      name: 'THERONIX',
      stats: [
        { label: 'GALAXY', value: 'Sombrero' },
        { label: 'DIAMETER', value: '56,780 km' },
        { label: 'DAY LENGTH', value: '12 Earth hours' },
        { label: 'AVG TEMPERATURE', value: '60°C to 90°C' },
        { label: 'CLIMATE', value: 'Tropical' }
      ]
    }
  }

  const currentPlanet = planetData[focusedPlanet] || planetData.etheron
  const isFocused = !!focusedPlanet

  return (
    <div className={`planet-display ${isFocused ? 'focused' : ''}`}>
      <h1 className="planet-name">{currentPlanet.name}</h1>
      <div className="planet-stats">
        {currentPlanet.stats.map((stat, index) => (
          <div key={index} className="stat-item">
            <span className="stat-label">{stat.label}</span>
            <span className="stat-value">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PlanetDisplay

