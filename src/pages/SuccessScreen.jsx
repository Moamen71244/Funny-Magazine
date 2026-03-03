import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import BalloonEffect from '../components/BalloonEffect';
import confetti from 'canvas-confetti';

const SuccessScreen = ({ score, onPlayAgain }) => {
  useEffect(() => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page-container" style={{ background: 'var(--pastel-purple)', color: 'white', overflow: 'hidden' }}>
      <BalloonEffect active={true} count={40} />
      
      <motion.div 
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="card" 
        style={{ padding: '40px', textAlign: 'center', background: 'white', borderRadius: '40px' }}
      >
        <motion.h1 
          animate={{ scale: [1, 1.2, 1], color: ['#FFB347', '#FF69B4', '#FFB347'] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ fontSize: '3.5rem', marginBottom: '10px' }}
        >
        برااافووو 🤩
        </motion.h1>
        
        <p style={{ color: 'var(--text-dark)', fontSize: '1.4rem', fontWeight: '600' }}>
         أنت بطل جدع ياخوياا
        </p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ 
            fontSize: '4.5rem', fontWeight: '900', color: 'var(--accent-orange)',
            margin: '30px 0', textShadow: '4px 4px 0px rgba(0,0,0,0.05)'
          }}
        >
          {score}
        </motion.div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPlayAgain}
          style={{ 
            backgroundColor: 'var(--accent-orange)', color: 'white', 
            width: '100%', padding: '20px', fontSize: '1.8rem',
            boxShadow: '0 8px 16px rgba(255, 179, 71, 0.4)'
          }}
        >
          تاني؟
        </motion.button>
      </motion.div>

      {/* CSS Floating Sparkles */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ 
            y: [-20, -100], 
            opacity: [0, 1, 0],
            scale: [0.5, 1.5, 1]
          }}
          transition={{ 
            duration: 2 + Math.random() * 2, 
            repeat: Infinity, 
            delay: Math.random() * 2 
          }}
          style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: '24px',
            pointerEvents: 'none'
          }}
        >
          ✨
        </motion.div>
      ))}

      <style>{`
        .app-main { overflow: hidden; height: 100vh; }
      `}</style>
    </div>
  );
};

export default SuccessScreen;
