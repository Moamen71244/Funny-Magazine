import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../LanguageContext';
import memoryBg from '../assets/images/memory_game_bg.png';

const EMOJIS = ['🦁', '🐯', '🐘', '🦒', '🦓', '🦘', '🦙', '🦩', '🐨', '🐼', '🦊', '🐸'];

const LEVEL_CONFIG = {
  1: { cardCount: 4, gridCols: 2 },
  2: { cardCount: 8, gridCols: 4 },
  3: { cardCount: 12, gridCols: 4 },
  4: { cardCount: 16, gridCols: 4 },
};

const MemoryGame = ({ onComplete, onBack }) => {
  const [level, setLevel] = useState(1);
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [bestScore, setBestScore] = useState(localStorage.getItem('memoryGameBest') || '-');
  const [showWinModal, setShowWinModal] = useState(false);
  const { t, lang } = useLanguage();

  const initializeGame = useCallback((levelNum = 1) => {
    const config = LEVEL_CONFIG[levelNum] || LEVEL_CONFIG[1];
    const emojiSubset = EMOJIS.slice(0, config.cardCount / 2);
    
    const shuffledCards = [...emojiSubset, ...emojiSubset]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: `${levelNum}-${index}`,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
      
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setTime(0);
    setIsRunning(false);
    setIsLocked(false);
    setShowWinModal(false);
  }, []);

  useEffect(() => {
    initializeGame(level);
  }, [level, initializeGame]);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleCardClick = (index) => {
    if (isLocked || flippedCards.includes(index) || matchedCards.includes(index)) return;

    if (!isRunning) setIsRunning(true);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      setIsLocked(true);

      const firstCard = cards[newFlipped[0]];
      const secondCard = cards[newFlipped[1]];

      if (firstCard.emoji === secondCard.emoji) {
        setMatchedCards((prev) => [...prev, ...newFlipped]);
        setFlippedCards([]);
        setIsLocked(false);
      } else {
        setTimeout(() => {
          setFlippedCards([]);
          setIsLocked(false);
        }, 800);
      }
    }
  };

  useEffect(() => {
    if (matchedCards.length === cards.length && cards.length > 0) {
      setIsRunning(false);
      
      // Update best score only if finishing level 4 (the full game)
      if (level === 4) {
        const currentBest = localStorage.getItem('memoryGameBest');
        if (!currentBest || moves < parseInt(currentBest)) {
          localStorage.setItem('memoryGameBest', moves.toString());
          setBestScore(moves.toString());
        }
      }

      // Small delay before showing modal
      setTimeout(() => setShowWinModal(true), 500);
    }
  }, [matchedCards, cards.length, moves, level]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNextLevel = () => {
    if (level < 4) {
      setLevel(level + 1);
      setShowWinModal(false);
    } else {
      onComplete(moves); // Or final level score
      setShowWinModal(false);
    }
  };

  const gridCols = LEVEL_CONFIG[level]?.gridCols || 4;

  return (
    <div className="page-container memory-game-container" style={{ 
      backgroundImage: `url(${memoryBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: 'var(--text-dark)',
      position: 'relative'
    }}>
      {/* Overlay to ensure readability over background */}
      <div style={{ 
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
        background: 'rgba(255, 255, 255, 0.4)', zIndex: 0 
      }} />

      <div style={{ 
        position: 'absolute', top: '15px', left: '15px', right: '15px', 
        display: 'flex', justifyContent: 'space-between', 
        fontSize: '0.9rem', fontWeight: 'bold', zIndex: 10,
        background: 'rgba(255, 255, 255, 0.8)',
        padding: '8px 15px',
        borderRadius: '15px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        flexDirection: lang === 'ar' ? 'row-reverse' : 'row'
      }}>
        <div>{t('lvl')}: {level}</div>
        <div>{t('moves')}: {moves}</div>
        <div>{t('time')}: {formatTime(time)}</div>
        <div className="hide-mobile">{t('best')}: {bestScore}</div>
      </div>

      <h1 className="game-title" style={{ 
        marginTop: '60px', marginBottom: '10px', 
        fontSize: '1.6rem', zIndex: 1, position: 'relative',
        textShadow: '0 2px 4px rgba(255,255,255,0.8)'
      }}>
        {t('memory_title')}
      </h1>

      <div className="grid-wrapper" style={{ 
        zIndex: 1, position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '100%', maxWidth: '400px', flex: 1
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: `repeat(${gridCols}, 1fr)`, 
          gap: '8px', 
          width: '100%',
          perspective: '1000px',
          padding: '10px'
        }}>
          {cards.map((card, index) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(index)}
              style={{
                aspectRatio: '1/1',
                position: 'relative',
                cursor: 'pointer',
                transformStyle: 'preserve-3d',
                transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: flippedCards.includes(index) || matchedCards.includes(index) ? 'rotateY(180deg)' : 'rotateY(0deg)',
                width: '100%'
              }}
            >
              {/* Front Face */}
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                background: 'white',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: level > 3 ? '1.8rem' : '2.5rem',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                transform: 'rotateY(180deg)',
                border: matchedCards.includes(index) ? '3px solid var(--pastel-green)' : 'none'
              }}>
                {card.emoji}
              </div>

              {/* Back Face */}
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                background: 'var(--pastel-blue)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                color: 'white',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                border: '3px solid white'
              }}>
                ?
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '15px', marginTop: '20px', zIndex: 1, position: 'relative' }}>
        <button onClick={onBack} style={{ background: 'white', color: 'var(--text-dark)', fontSize: '1rem', padding: '10px 25px' }}>{t('back')}</button>
        <button onClick={() => initializeGame(level)} style={{ background: 'var(--accent-orange)', color: 'white', fontSize: '1rem', padding: '10px 25px' }}>{t('restart')}</button>
      </div>

      <AnimatePresence>
        {showWinModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100,
              padding: '20px'
            }}
          >
            <div className="card" style={{ padding: '30px', background: 'white', maxWidth: '320px', borderRadius: '25px' }}>
              <h1 style={{ color: 'var(--pastel-green)', fontSize: '1.8rem', marginBottom: '10px' }}>{t('level_clear', { level })}</h1>
              <div style={{ fontSize: '1.1rem', margin: '15px 0' }}>
                <p>{t('moves')}: {moves}</p>
                <p>{t('time')}: {formatTime(time)}</p>
              </div>
              <button 
                onClick={handleNextLevel}
                style={{ backgroundColor: 'var(--accent-orange)', color: 'white', width: '100%', padding: '12px', fontSize: '1.2rem' }}
              >
                {level < 4 ? t('next_level') : t('play_again')}
              </button>
              <button 
                onClick={onBack}
                style={{ backgroundColor: 'transparent', color: '#666', width: '100%', marginTop: '10px', boxShadow: 'none', border: 'none', fontSize: '1rem' }}
              >
                {t('back_to_menu')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .memory-game-container {
          height: 100vh;
          overflow: hidden;
          padding: 10px;
        }
        @media (max-width: 400px) {
          .hide-mobile { display: none; }
          .game-title { font-size: 1.4rem !important; margin-top: 50px !important; }
        }
        @media (max-height: 600px) {
           .grid-wrapper { flex: 0 1 auto !important; }
           .game-title { margin-top: 40px !important; margin-bottom: 5px !important; }
        }
      `}</style>
    </div>
  );
};

export default MemoryGame;
