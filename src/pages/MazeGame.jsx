import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useLanguage } from "../LanguageContext";

const MazeGame = ({ onNext, onBack }) => {
  const mouseRef = useRef(null);
  const targetRef = useRef(null);
  const [finished, setFinished] = useState(false);
  const [nearTarget, setNearTarget] = useState(false);
  const { t, lang } = useLanguage();

  const successSound = useRef(new Audio("/assets/audio/success.mp3"));
  const moveSound = useRef(new Audio("/assets/audio/move.mp3")); // optional step sound

  useEffect(() => {
    successSound.current.preload = "auto";
    moveSound.current.preload = "auto";
  }, []);

  // ================= Collision Detection =================
  const checkCollision = () => {
    if (!mouseRef.current || !targetRef.current) return false;
    const mouseRect = mouseRef.current.getBoundingClientRect();
    const targetRect = targetRef.current.getBoundingClientRect();

    return !(
      mouseRect.right < targetRect.left ||
      mouseRect.left > targetRect.right ||
      mouseRect.bottom < targetRect.top ||
      mouseRect.top > targetRect.bottom
    );
  };

  const handleDragEnd = () => {
    if (checkCollision()) {
      setFinished(true);
      setNearTarget(true);
      successSound.current.currentTime = 0;
      successSound.current.play().catch(() => {});
      confetti({ particleCount: 150, spread: 120, origin: { y: 0.6 } });
    }
  };

  return (
    <div
      className="page-container"
      style={{
        background: "var(--pastel-purple)",
        padding: "20px",
        borderRadius: "20px",
      }}
    >
      <h2 style={{ color: "white" }}>{t('maze_title')}</h2>

      <div
        style={{
          position: "relative",
          width: "90vw",
          maxWidth: "400px",
          aspectRatio: "1 / 1",
          backgroundImage: "url(/assets/images/maze.png)",
          backgroundSize: "cover",
          borderRadius: "20px",
          border: "5px solid white",
          overflow: "hidden",
          marginTop: "20px",
        }}
      >
        {/* Cheese Target */}
        <motion.div
          ref={targetRef}
          style={{
            position: "absolute",
            top: "80%", // adjust depending on maze
            left: lang === 'ar' ? '5%' : '80%',
            width: "15%",
            height: "15%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          animate={{ scale: nearTarget ? [1, 1.2, 1] : 1 }}
        >
          <img
            src="/assets/images/cheese.png"
            alt="cheese"
            style={{ width: "100%", height: "100%" }}
          />
        </motion.div>

        {/* Draggable Mouse */}
        <motion.div
          ref={mouseRef}
          drag={!finished}
          dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          whileDrag={{ scale: 1.1 }}
          style={{
            position: "absolute",
            top: "0%",
            left: lang === 'ar' ? '85%' : '0%',
            width: "15%",
            height: "15%",
            cursor: finished ? "default" : "grab",
            zIndex: 10,
          }}
        >
          <img
            src="/assets/images/mouse.png"
            alt="mouse"
            style={{ width: "100%", height: "100%" }}
          />
        </motion.div>
      </div>

      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <button onClick={onBack}>{t('back')}</button>
        {finished && (
          <button
            onClick={onNext}
            style={{ background: "orange", color: "white" }}
          >
            {t('next')}
          </button>
        )}
      </div>
    </div>
  );
};

export default MazeGame;