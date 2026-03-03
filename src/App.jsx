import React, { useState } from 'react';
import CoverPage from './pages/CoverPage';
import MatchingGame from './pages/MatchingGame';
import MemoryGame from './pages/MemoryGame';
import SuccessScreen from './pages/SuccessScreen';
import { useLanguage } from './LanguageContext';

const App = () => {
  const [currentPage, setCurrentPage] = useState('cover');
  const [finalScore, setFinalScore] = useState(0);
  const { lang } = useLanguage();

  const pages = ['cover', 'matching', 'memory', 'success'];
  
  const handleNext = () => {
    const currentIndex = pages.indexOf(currentPage);
    if (currentIndex < pages.length - 1) {
      setCurrentPage(pages[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const currentIndex = pages.indexOf(currentPage);
    if (currentIndex > 0) {
      setCurrentPage(pages[currentIndex - 1]);
    }
  };

  const handleGameComplete = (score) => {
    setFinalScore(prev => prev + score);
    handleNext();
  };

  return (
    <div className="app-main" style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Navigation Buttons - Arrows only change pages (games) */}
      <div style={{
        position: 'fixed',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '20px',
        zIndex: 1000,
        flexDirection: 'row-reverse' // Forced RTL
      }}>
        <button 
          onClick={handleBack}
          disabled={currentPage === 'cover'}
          style={{
            background: 'white',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
            border: 'none',
            fontSize: '1.5rem',
            opacity: currentPage === 'cover' ? 0.3 : 1,
            cursor: currentPage === 'cover' ? 'default' : 'pointer'
          }}
        >
         ←
        </button>
        <button 
          onClick={handleNext}
          disabled={currentPage === 'success'}
          style={{
            background: 'white',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
            border: 'none',
            fontSize: '1.5rem',
            opacity: currentPage === 'success' ? 0.3 : 1,
            cursor: currentPage === 'success' ? 'default' : 'pointer'
          }}
        >
           →
        </button>
      </div>

      {currentPage === 'cover' && (
        <CoverPage onSelect={() => setCurrentPage('matching')} />
      )}
      
      {currentPage === 'matching' && (
        <MatchingGame 
          onComplete={handleGameComplete} 
          onBack={handleBack} 
        />
      )}

      {currentPage === 'memory' && (
        <MemoryGame 
          onComplete={(score) => {
            setFinalScore(prev => prev + score);
            setCurrentPage('success');
          }}
          onBack={handleBack} 
        />
      )}

      {currentPage === 'success' && (
        <SuccessScreen 
          score={finalScore} 
          onPlayAgain={() => {
            setCurrentPage('cover');
            setFinalScore(0);
          }} 
        />
      )}
    </div>
  );
};

export default App;
