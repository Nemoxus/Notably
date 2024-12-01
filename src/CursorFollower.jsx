import React, { useEffect, useRef } from 'react';

const CursorFollower = () => {
  const circleRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const circlePositionRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef(null);

  useEffect(() => {
    const circleElement = circleRef.current;
    
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const speed = 0.15;
    let currentScale = 0;
    let currentAngle = 0;

    const tick = () => {
      const mouse = mouseRef.current;
      const prevMouse = prevMouseRef.current;
      const circle = circlePositionRef.current;

      // Move circle
      const dx = mouse.x - circle.x;
      const dy = mouse.y - circle.y;

      circle.x += dx * speed;
      circle.y += dy * speed;

      const translateTransform = `translate(${circle.x}px, ${circle.y}px)`;

      // Elastic Squeeze Calculation
      const delMouseX = mouse.x - prevMouse.x;
      const delMouseY = mouse.y - prevMouse.y;
      
      prevMouse.x = mouse.x;
      prevMouse.y = mouse.y;

      const mouseVel = Math.min(Math.sqrt(delMouseX**2 + delMouseY**2) * 4, 150);

      const scaleVal = (mouseVel / 150) * 0.5;
      currentScale += (scaleVal - currentScale) * speed;

      const scaleTransform = `scale(${1 + currentScale}, ${1 - currentScale})`;

      // Rotation of cursor
      const angle = Math.atan2(delMouseX, delMouseY) * 180 / Math.PI;

      if (mouseVel > 20) {
        currentAngle = angle;
      }

      const rotateTransform = `rotate(${currentAngle}deg)`;

      // Application of transformations
      if (circleElement) {
        circleElement.style.transform = `${translateTransform} ${scaleTransform} ${rotateTransform}`;
      }

      animationRef.current = window.requestAnimationFrame(tick);
    };

    // Start the animation
    animationRef.current = window.requestAnimationFrame(tick);

    // Add event listener
    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return <div className="circle" ref={circleRef}></div>;
};

export default CursorFollower;