import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../LanguageContext';

const CoverPage = ({ onSelect }) => {
  const { t, lang } = useLanguage();

  return (
    <div className="page-container cover-page-container" style={{ 
      background: 'linear-gradient(135deg, #a7c7e7 0%, #f3cfc6 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Floating Background Elements */}
      <div className="bg-shapes">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="shape"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 20}%`,
              opacity: 0.2
            }}
          >
            {['🦁', '🎈', '⭐', '🐶', '🎨', '🚀'][i]}
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="card hero-card" 
        style={{ 
          padding: '50px 30px', 
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          borderRadius: '40px',
          border: '2px solid rgba(255,255,255,0.8)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          maxWidth: '450px',
          width: '90%',
          zIndex: 10
        }}
      >
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{ 
            color: 'var(--text-dark)', 
            fontSize: lang === 'ar' ? '2.4rem' : '2.8rem', 
            marginBottom: '10px',
            fontFamily: lang === 'ar' ? '"Cairo", sans-serif' : '"Nunito", sans-serif',
            fontWeight: 800,
            lineHeight: 1.2
          }}
        >
          {t('hero_title')}
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{ 
            marginBottom: '40px', 
            fontSize: '1.2rem', 
            color: '#555',
            fontWeight: 600
          }}
        >
          {t('hero_subtitle')}
        </motion.p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(255, 179, 71, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            onClick={() => onSelect('start')}
            style={{ 
              backgroundColor: 'var(--accent-orange)', 
              color: 'white', 
              padding: '20px 30px', 
              fontSize: lang === 'ar' ? '1.8rem' : '2rem', 
              width: '100%',
              borderRadius: '30px',
              border: '4px solid white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '15px',
              boxShadow: '0 15px 30px rgba(255, 179, 71, 0.4)'
            }}
          >
            <span style={{ fontFamily: lang === 'ar' ? '"Cairo", sans-serif' : '"Nunito", sans-serif' }}>{t('start')}</span>
          </motion.button>
        </div>
      </motion.div>

      <style>{`
        .cover-page-container {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
        }
        .bg-shapes {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }
        .shape {
          position: absolute;
          font-size: 3rem;
          filter: blur(1px);
        }
        .hero-card {
          margin: 20px;
          text-align: center;
        }
        @media (max-width: 450px) {
          h1 { font-size: 2.22rem !important; }
          button { font-size: 1.3rem !important; padding: 15px 20px !important; }
        }
      `}</style>
    </div>
  );
};

export default CoverPage;
