import React, { useEffect, useRef } from 'react';

const BalloonEffect = ({ active, count = 15, onComplete }) => {
  const canvasRef = useRef(null);
  const balloons = useRef([]);
  const animationFrame = useRef(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#FFB347', '#FF69B4', '#A7C7E7', '#C1E1C1', '#C3B1E1', '#FFFF99'];

    class Balloon {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100;
        this.size = 20 + Math.random() * 30;
        this.speed = 2 + Math.random() * 3;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.swing = Math.random() * 0.1;
        this.swingOffset = Math.random() * Math.PI * 2;
      }

      update() {
        this.y -= this.speed;
        this.x += Math.sin(this.swingOffset) * 0.5;
        this.swingOffset += this.swing;

        if (this.y < -this.size * 2) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.ellipse(this.x, this.y, this.size * 0.8, this.size, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // String
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.size);
        ctx.lineTo(this.x, this.y + this.size + 20);
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.stroke();
      }
    }

    // Initialize balloons
    balloons.current = Array.from({ length: count }, () => new Balloon());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      balloons.current.forEach(b => {
        b.update();
        b.draw();
      });
      animationFrame.current = requestAnimationFrame(animate);
    };

    animate();

    const timer = setTimeout(() => {
      cancelAnimationFrame(animationFrame.current);
      if (onComplete) onComplete();
    }, 4000); // 4 seconds of balloons

    return () => {
      cancelAnimationFrame(animationFrame.current);
      clearTimeout(timer);
    };
  }, [active, count, onComplete]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 1000,
        width: '100%',
        height: '100%'
      }}
    />
  );
};

export default BalloonEffect;
