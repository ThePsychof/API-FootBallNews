import React, { useRef, useEffect } from "react";

function FireSplash({ Radius, speedFactor = 0.8, radiusMultiplier = 1, lifeFactor = 2.5 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];

    function randomColor() {
      return Math.random() > 0.5
        ? `rgba(255, ${Math.floor(Math.random() * 100)}, 0, 0.6)` // softer red
        : `rgba(0, ${Math.floor(Math.random() * 150)}, 255, 0.6)`; // softer blue
    }

    function spawnParticle(radiusVal) {
      const angle = Math.random() * Math.PI * 2;
      const spawnX = canvas.width / 2 + Math.cos(angle) * radiusVal * radiusMultiplier;
      const spawnY = canvas.height / 2 - 33 + Math.sin(angle) * radiusVal * radiusMultiplier;

      const speed = (Math.random() * 1.5 + 0.5) * speedFactor; // slower

      particles.push({
        x: spawnX,
        y: spawnY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: (120 + Math.random() * 100) * lifeFactor, // longer life
        color: randomColor(),
      });
    }

    function draw() {
      // Softer trail effect
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const radiusVal = Radius.get();

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2); // smaller particles
        ctx.fillStyle = p.color;
        ctx.fill();

        if (p.life >= p.maxLife) particles.splice(i, 1);
      }

      if (particles.length < 200) { // fewer particles
        for (let i = 0; i < 4; i++) spawnParticle(radiusVal); // spawn fewer per frame
      }

      requestAnimationFrame(draw);
    }

    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [Radius, speedFactor, radiusMultiplier, lifeFactor]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", top: 0, left: 0, zIndex: -1 }}
    />
  );
}

export default FireSplash;
