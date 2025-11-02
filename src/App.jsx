import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Galaxy from './pages/Galaxy'
import './App.css'
import Navigation from './components/Navigation'

export default function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path='/home' element={<Home />} />
        <Route path='/' element={<Galaxy />} />
      </Routes>
    </Router>
    )
}