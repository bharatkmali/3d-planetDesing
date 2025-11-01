import React, { useEffect, useRef } from "react";

const OrbitalCanvas = ({ planets = [], orbitalSystemRef }) => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const system = orbitalSystemRef?.current;
    if (!canvas || !system) return;
    
    const ctx = canvas.getContext("2d");
    
    const updateCanvas = () => {
      // Set canvas to full viewport size
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Get orbital system position and center
      const systemRect = system.getBoundingClientRect();
      const centerX = systemRect.left + systemRect.width / 2;
      const centerY = systemRect.top + systemRect.height / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw orbit circles with subtle appearance
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1;

      if (Array.isArray(planets)) {
        // Draw orbit circles for all celestial bodies
        const drawnDistances = new Set();
        
        planets.forEach((planet) => {
          if (!planet.isCenter && planet.distance > 0) {
            // Only draw unique distances to avoid overlapping circles
            const distance = Math.round(planet.distance);
            
            if (!drawnDistances.has(distance)) {
              drawnDistances.add(distance);
              
              // Different styling for planets vs moons - subtle and elegant
              // Adjust line width for mobile devices
              const isMobile = window.innerWidth <= 768
              const baseLineWidth = isMobile ? 0.8 : 1.2
              const baseOpacity = isMobile ? 0.15 : 0.2
              
              if (planet.type === 'planet') {
                ctx.strokeStyle = `rgba(255, 255, 255, ${baseOpacity})`;
                ctx.lineWidth = baseLineWidth;
              } else {
                ctx.strokeStyle = `rgba(255, 255, 255, ${baseOpacity * 0.5})`;
                ctx.lineWidth = baseLineWidth * 0.67;
              }
              
              ctx.beginPath();
              ctx.arc(centerX, centerY, planet.distance, 0, Math.PI * 2);
              ctx.stroke();
            }
          }
        });

        // Draw additional orbital rings to fill the screen
        const planetDistances = planets
          .filter(p => !p.isCenter && p.distance > 0)
          .map(p => p.distance);
        
        if (planetDistances.length > 0) {
          const maxDistance = Math.max(
            ...planetDistances,
            window.innerWidth / 2,
            window.innerHeight / 2
          );
          
          const minDistance = Math.min(...planetDistances);
          const screenMaxDistance = Math.max(window.innerWidth, window.innerHeight) / 2;

          // Fill in gaps with additional subtle orbits - very faint
          // Adjust spacing for mobile
          const spacing = window.innerWidth <= 768 ? 120 : 150
          const minGapDistance = window.innerWidth <= 480 ? 80 : 100
          for (let i = Math.floor(minDistance); i <= screenMaxDistance; i += spacing) {
            if (!drawnDistances.has(i) && i > minGapDistance) {
              const gapOpacity = window.innerWidth <= 768 ? 0.03 : 0.05
              ctx.strokeStyle = `rgba(255, 255, 255, ${gapOpacity})`;
              ctx.lineWidth = window.innerWidth <= 768 ? 0.4 : 0.5;
              ctx.beginPath();
              ctx.arc(centerX, centerY, i, 0, Math.PI * 2);
              ctx.stroke();
            }
          }
        }
      }
    };

    const animate = () => {
      updateCanvas();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation loop
    animate();

    // Update on window resize with debouncing for performance
    const resizeTimeoutRef = { current: null };
    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = setTimeout(() => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        animate();
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(system);

    return () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      resizeObserver.disconnect();
    };
  }, [planets, orbitalSystemRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
};

export default OrbitalCanvas;
