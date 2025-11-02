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
            // Use the planet's distance (already scaled responsively in OrbitalSystem)
            // Round to nearest pixel for crisp rendering
            const distance = Math.round(planet.distance);
            
            // Only draw unique distances to avoid overlapping circles
            if (!drawnDistances.has(distance)) {
              drawnDistances.add(distance);
              
              // Different styling for planets vs moons - responsive based on screen size
              const isMobile = window.innerWidth <= 768;
              const isSmallMobile = window.innerWidth <= 480;
              const baseLineWidth = isSmallMobile ? 0.7 : isMobile ? 0.8 : 1.2;
              const baseOpacity = isSmallMobile ? 0.12 : isMobile ? 0.15 : 0.2;
              
              if (planet.type === 'planet') {
                ctx.strokeStyle = `rgba(255, 255, 255, ${baseOpacity})`;
                ctx.lineWidth = baseLineWidth;
              } else {
                ctx.strokeStyle = `rgba(255, 255, 255, ${baseOpacity * 0.5})`;
                ctx.lineWidth = baseLineWidth * 0.67;
              }
              
              // Draw circle at the responsive distance
              ctx.beginPath();
              ctx.arc(centerX, centerY, distance, 0, Math.PI * 2);
              ctx.stroke();
            }
          }
        });

        // Draw additional orbital rings to fill gaps (optional, responsive)
        const planetDistances = planets
          .filter(p => !p.isCenter && p.distance > 0)
          .map(p => p.distance);
          
        if (planetDistances.length > 0) {
          const minDistance = Math.min(...planetDistances);
          const maxDistance = Math.max(...planetDistances);
          const screenMaxDistance = Math.max(window.innerWidth, window.innerHeight) / 2;
          
          // Responsive spacing for gap-filling rings
          const isMobile = window.innerWidth <= 768;
          const isSmallMobile = window.innerWidth <= 480;
          const spacing = isSmallMobile ? 80 : isMobile ? 100 : 120;
          const minGapDistance = Math.max(minDistance, isSmallMobile ? 60 : isMobile ? 80 : 100);
          
          // Fill gaps between actual orbits with subtle rings
          for (let i = Math.floor(minDistance); i <= Math.min(maxDistance * 1.2, screenMaxDistance); i += spacing) {
            if (!drawnDistances.has(i) && i >= minGapDistance) {
              const gapOpacity = isSmallMobile ? 0.02 : isMobile ? 0.03 : 0.04;
              ctx.strokeStyle = `rgba(255, 255, 255, ${gapOpacity})`;
              ctx.lineWidth = isSmallMobile ? 0.3 : isMobile ? 0.4 : 0.5;
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
