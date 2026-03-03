import React from 'react';
import { Volume2 } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const StoryPage = ({ onNext, onBack }) => {
  const { t } = useLanguage();
  
  const playSound = (animal) => {
    const audio = new Audio(`/src/assets/audio/${animal}.mp3`);
    audio.play().catch(() => console.log('Audio not found yet'));
  };

  return (
    <div className="page-container" style={{ background: 'var(--pastel-green)' }}>
      <div className="card">
        <h2>{t('story_title')}</h2>
        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => playSound('lion')}>
          <img 
            src="/src/assets/images/lion.png" 
            alt="Leo the Lion" 
            style={{ width: '100%', borderRadius: '20px' }}
            onError={(e) => { e.target.src = 'https://via.placeholder.com/200?text=Lion+Image'; }}
          />
          <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'white', borderRadius: '50%', padding: '5px' }}>
            <Volume2 size={24} color="var(--text-dark)" />
          </div>
        </div>
        <p style={{ fontSize: '1.2rem', margin: '20px 0' }}>{t('story_instruction')}</p>
      </div>

      <div style={{ marginTop: '30px', display: 'flex', gap: '20px' }}>
        <button onClick={onBack} style={{ backgroundColor: 'white', color: 'var(--text-dark)' }}>{t('back')}</button>
        <button onClick={onNext} style={{ backgroundColor: 'var(--accent-orange)', color: 'white' }}>{t('next')}</button>
      </div>
    </div>
  );
};

export default StoryPage;
