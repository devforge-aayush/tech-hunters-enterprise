import React, { useRef, useEffect } from 'react';

export function SparklesCore({
  background = "transparent",
  particleColor = "#FFFFFF",
  particleDensity = 1200,
  minSize = 0.4,
  maxSize = 1,
  speed = 0.6,
  className = "",
  style = {}
}) {
  const canvasRef = useRef(null);

  const numMinSize = parseFloat(minSize) || 0.4;
  const numMaxSize = parseFloat(maxSize) || 1.0;
  const numDensity = parseInt(particleDensity, 10) || 1200;
  const numSpeed = parseFloat(speed) || 0.6;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationFrameId;

    const updateDimensions = () => {
      const parent = canvas.parentElement;
      const width = parent?.clientWidth || window.innerWidth;
      const height = parent?.clientHeight || 160;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      return { width, height };
    };

    let { width, height } = updateDimensions();

    const particles = [];
    const count = Math.min(numDensity, 1200);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * (numMaxSize - numMinSize) + numMinSize,
        speedX: (Math.random() - 0.5) * numSpeed,
        speedY: (Math.random() - 0.5) * numSpeed,
        opacity: Math.random() * 0.85 + 0.15
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = particleColor;
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      const dims = updateDimensions();
      width = dims.width;
      height = dims.height;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [particleColor, numDensity, numMinSize, numMaxSize, numSpeed]);

  return (
    <canvas
      ref={canvasRef}
      className={`block w-full h-full pointer-events-none ${className}`}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        background: background || 'transparent',
        border: 'none',
        outline: 'none',
        boxShadow: 'none',
        ...style
      }}
    />
  );
}

export default SparklesCore;
