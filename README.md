# 🌌 3D Planet Design - Interactive Orbital System

An interactive 3D planet visualization where you can explore planets and moons orbiting in real-time.

## ✨ Features

- **Four Planets**: ETHERON, ORIONIS, LUMENARA, and THERONIX
- **Six Moons**: Colorful moons orbiting in different layers
- **Click to Focus**: Click any planet to bring it to center
- **Smooth Animations**: Planets transition smoothly when selected
- **Orbital Rings**: Visible orbit circles show planet paths
- **Fully Responsive**: Works on desktop, tablet, and mobile

## 🚀 Quick Start

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start development server**

   ```bash
   npm run dev
   ```

3. **Open browser** at `http://localhost:5173`

## 🎮 How to Use

- Click any planet to bring it to the center
- Watch planets and moons orbit in real-time
- Use navigation to switch between pages

## 🛠️ Technologies

- React 19
- Vite
- React Router
- Canvas API

## 📁 Project Structure

```
src/
├── components/
│   ├── OrbitalSystem.jsx    # Main orbital system
│   ├── OrbitalCanvas.jsx     # Orbit rings rendering
│   ├── PlanetDisplay.jsx      # Planet info display
│   └── StarField.jsx         # Starfield background
├── pages/
│   ├── Galaxy.jsx           # Main galaxy view
│   └── Home.jsx             # Home page
└── assets/
    └── images/              # Planet images
```

## 🎨 Customization

### Add New Planet

1. Add image to `src/assets/images/`
2. Update `baseSizes` in `OrbitalSystem.jsx`
3. Add distance in `getOrbitalDistance()`

### Change Sizes

Edit `baseSizes` object:

```javascript
const baseSizes = {
  etheron: 130,
  orionis: 120,
  // your sizes
};
```

### Adjust Distances

Modify `getOrbitalDistance()`:

```javascript
const orbitalDistances = {
  moon1: 180,
  moon2: 240,
  orionis: 580,
  // your distances
};
```

## 📝 Build for Production

```bash
npm run build
```

---

**Made with React ⚛️**
