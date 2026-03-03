import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useLanguage } from "../LanguageContext";

const QuizPage = ({ onNext, onBack }) => {
  const [selected, setSelected] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { t } = useLanguage();

  // 🔊 Preload Audio Once
  const successAudio = useRef(null);
  const errorAudio = useRef(null);

  useEffect(() => {
    successAudio.current = new Audio("/assets/audio/success.mp3");
    errorAudio.current = new Audio("/assets/audio/error.mp3");

    successAudio.current.preload = "auto";
    errorAudio.current.preload = "auto";
  }, []);

  const options = [
    { id: "lion", label: t('lion'), eatsCarrots: false },
    { id: "rabbit", label: t('rabbit'), eatsCarrots: true },
    { id: "cat", label: t('cat'), eatsCarrots: false },
  ];

  const handleSelect = (option) => {
    if (isAnimating) return; // 🔒 Prevent double click

    setSelected(option.id);
    setIsAnimating(true);

    if (option.eatsCarrots) {
      setIsCorrect(true);

      // 🔊 Play sound synced
      successAudio.current.currentTime = 0;
      successAudio.current.play().catch(() => {});

      // 🎉 Confetti Burst
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        setIsAnimating(false);
      }, 1200);
    } else {
      setIsCorrect(false);

      errorAudio.current.currentTime = 0;
      errorAudio.current.play().catch(() => {});

      setTimeout(() => {
        setSelected(null);
        setIsAnimating(false);
      }, 800);
    }
  };

  return (
    <div className="page-container" style={{ background: "var(--pastel-blue)" }}>
      <h1>{t('quiz_title')}</h1>
      <p style={{ fontSize: "1.5rem", marginBottom: "30px" }}>
        {t('quiz_question')}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        {options.map((opt) => (
          <motion.div
            key={opt.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={
              selected === opt.id && !opt.eatsCarrots
                ? { x: [0, -10, 10, -10, 10, 0] } // ❌ Shake
                : {}
            }
            onClick={() => handleSelect(opt)}
            style={{
              background: "white",
              borderRadius: "30px",
              padding: "20px",
              cursor: "pointer",
              textAlign: "center",
              border:
                selected === opt.id
                  ? opt.eatsCarrots
                    ? "4px solid #4CAF50"
                    : "4px solid #ff4d4d"
                  : "4px solid transparent",
              boxShadow:
                selected === opt.id && opt.eatsCarrots
                  ? "0 0 20px rgba(76, 175, 80, 0.6)"
                  : "0 4px 10px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease",
            }}
          >
            <img
              src={`/assets/images/${opt.id}.png`}
              alt={opt.label}
              style={{ width: "80px", marginBottom: "10px" }}
            />
            <div style={{ fontWeight: "800", fontSize: "1.2rem" }}>
              {opt.label}
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ marginTop: "50px", display: "flex", gap: "20px" }}>
        <button
          onClick={onBack}
          disabled={isAnimating}
          style={{ backgroundColor: "white", color: "var(--text-dark)" }}
        >
          {t('back')}
        </button>

        {isCorrect && (
          <button
            onClick={onNext}
            style={{
              backgroundColor: "var(--accent-orange)",
              color: "white",
              animation: "pulse 1s infinite",
            }}
          >
            {t('finish')}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizPage;