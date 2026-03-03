import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import BalloonEffect from '../components/BalloonEffect';
import { useLanguage } from '../LanguageContext';

const animals = [
  { id: 'lion', male: 'lionMale.jpg', female: 'lionFemale.jpg' },
  { id: 'monkey', male: 'monkeyMale.jpg', female: 'monkeyFemale.jpg' },
  { id: 'elephant', male: 'elephantMale.jpg', female: 'elphantFemale.jpg' },
];

const MatchingGame = ({ onComplete, onBack }) => {
  const [activeMales, setActiveMales] = useState([]);
  const [activeFemales, setActiveFemales] = useState([]);
  const [score, setScore] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);
  const [showBalloons, setShowBalloons] = useState(false);
  const [feedback, setFeedback] = useState(null); // { id, type: 'error' | 'success' }
  const [isLocked, setIsLocked] = useState(false);
  const { t, lang } = useLanguage();
  
  const maleControls = useAnimation();

  useEffect(() => {
    const males = animals.map(a => ({ ...a, type: 'male' })).sort(() => Math.random() - 0.5);
    const females = animals.map(a => ({ ...a, type: 'female' })).sort(() => Math.random() - 0.5);
    setActiveMales(males);
    setActiveFemales(females);
  }, []);

  // Animated score counter
  useEffect(() => {
    if (displayScore < score) {
      const timer = setTimeout(() => setDisplayScore(displayScore + 1), 50);
      return () => clearTimeout(timer);
    }
  }, [score, displayScore]);

  const playSound = (type) => {
    const soundMap = {
      success: 'congratulations.mp3',
      error: 'fail.mp3'
    };
    const audio = new Audio(`/src/assets/audio/${soundMap[type]}`);
    audio.play().catch(() => console.log(`Audio ${type} not found`));
  };

  const handleMatch = async (maleId, femaleId) => {
    if (isLocked) return;
    setIsLocked(true);

    if (maleId === femaleId) {
      setFeedback({ id: maleId, type: 'success' });
      playSound('success');
      setShowBalloons(true);
      
      // Delay for success animation before removal
      setTimeout(() => {
        setScore(s => s + 10);
        setActiveMales(prev => prev.filter(m => m.id !== maleId));
        setActiveFemales(prev => prev.filter(f => f.id !== femaleId));
        setShowBalloons(false);
        setFeedback(null);
        setIsLocked(false);
        
        if (activeMales.length === 1) {
          onComplete(score + 10);
        }
      }, 2000);
    } else {
      setFeedback({ id: maleId, type: 'error' });
      playSound('error');
      
      setTimeout(() => {
        setFeedback(null);
        setIsLocked(false);
      }, 600);
    }
  };

  return (
    <div className="page-container" style={{ background: 'var(--pastel-yellow)', position: 'relative', overflow: 'hidden' }}>
      <BalloonEffect active={showBalloons} count={25} />
      
      <div style={{ position: 'absolute', top: '20px', [lang === 'ar' ? 'right' : 'left']: '20px', fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent-orange)' }}>
        {t('score')}: {displayScore}
      </div>

      <h1 style={{ marginBottom: '30px', fontSize: '2.2rem' }}>{t('matching_title')}</h1>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '40px', 
        width: '100%', 
        maxWidth: '600px', 
        zIndex: 10,
        padding: '0 20px',
        flexDirection: lang === 'ar' ? 'row-reverse' : 'row'
      }}>
        {/* Males Column (Draggable items) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
          <AnimatePresence>
            {activeMales.map((m) => (
              <motion.div
                key={m.id}
                layout
                drag={!isLocked}
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.6}
                onDragEnd={(e, info) => {
                  if (isLocked) return;
                  
                  // Get the pointer position relative to the viewport
                  const pointerX = e.clientX || (e.touches && e.touches[0].clientX);
                  const pointerY = e.clientY || (e.touches && e.touches[0].clientY);

                  let matchedId = null;

                  activeFemales.forEach(f => {
                    const targetEl = document.getElementById(`female-${f.id}`);
                    if (!targetEl) return;
                    
                    const targetRect = targetEl.getBoundingClientRect();

                    // Check if pointer is inside target
                    if (pointerX >= targetRect.left && pointerX <= targetRect.right &&
                        pointerY >= targetRect.top && pointerY <= targetRect.bottom) {
                      matchedId = f.id;
                    }
                  });

                  if (matchedId) {
                    handleMatch(m.id, matchedId);
                  } else {
                    setFeedback({ id: m.id, type: 'error' });
                    playSound('error');
                    setTimeout(() => setFeedback(null), 600);
                  }
                }}
                animate={
                  feedback?.id === m.id 
                  ? (feedback.type === 'error' ? { x: [-10, 10, -10, 10, 0], scale: 1 } : { scale: [1, 1.3, 1.2], rotate: [0, 10, -10, 0] })
                  : { scale: 1, x: 0, y: 0 }
                }
                exit={{ scale: 0, opacity: 0, transition: { duration: 0.5 } }}
                whileHover={!isLocked ? { scale: 1.05 } : {}}
                whileTap={!isLocked ? { scale: 0.95, zIndex: 50 } : {}}
                style={{ 
                  width: '100%', 
                  aspectRatio: '1/1',
                  maxWidth: '120px',
                  background: 'white', 
                  borderRadius: '20px',
                  margin: '0 auto',
                  boxShadow: feedback?.id === m.id && feedback.type === 'success' 
                    ? '0 0 30px rgba(255, 215, 0, 0.8)' 
                    : '0 6px 12px rgba(0,0,0,0.1)',
                  cursor: isLocked ? 'default' : 'grab', 
                  padding: '8px',
                  border: feedback?.id === m.id && feedback.type === 'error' ? '4px solid #ff4d4d' : '4px solid white',
                  position: 'relative'
                }}
              >
                <img src={`/images/${m.male}`} alt="Male" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Females Column (Drop targets) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
          <AnimatePresence>
            {activeFemales.map((f) => (
              <motion.div
                key={f.id}
                id={`female-${f.id}`}
                layout
                exit={{ scale: 0, opacity: 0, transition: { duration: 0.5 } }}
                style={{ 
                  width: '100%', 
                  aspectRatio: '1/1',
                  maxWidth: '120px',
                  margin: '0 auto',
                  background: 'var(--pastel-blue)', 
                  borderRadius: '25px',
                  border: '4px dashed white', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  padding: '8px', 
                  transition: 'all 0.3s ease',
                  boxShadow: feedback?.id === f.id && feedback.type === 'success' ? '0 0 20px white' : 'none'
                }}
              >
                <img src={`/images/${f.female}`} alt="Female" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '15px' }} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <button 
        onClick={onBack} 
        disabled={isLocked}
        style={{ marginTop: '40px', background: 'white', color: 'var(--text-dark)', opacity: isLocked ? 0.5 : 1 }}
      >
        {t('back')}
      </button>

      <style>{`
        .page-container {
          user-select: none;
          touch-action: none;
        }
      `}</style>
    </div>
  );
};

export default MatchingGame;
