"use client";

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import DockNavigation from '@/components/DockNavigation';
import { useState, useRef, useEffect } from 'react';

export default function MessagePage() {
  const router = useRouter();
  const [isBouncing, setIsBouncing] = useState(false);
  const [bgMuted, setBgMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.24;
    }
  }, []);

  const handleBackToHub = () => {
    router.push('/hub');
  };

  const handleKuromiTap = () => {
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 600);
  };

  return (
    <main
      className="fixed inset-0 flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #ffd6e0 0%, #ffb6c1 50%, #ff69b4 100%)' }}
    >
      {/* Background Music */}
      <audio ref={audioRef} src="/audio/welcomepage.mp3" loop muted={bgMuted} autoPlay preload="auto" />

      {/* Mute Button */}
      <motion.button
        onClick={() => {
          const newMutedState = !bgMuted;
          setBgMuted(newMutedState);
          if (!newMutedState && audioRef.current) {
            audioRef.current.play();
          }
        }}
        className="absolute top-8 left-8 z-50 px-4 py-3 rounded-full backdrop-blur-md border border-white/20 text-2xl"
        style={{
          background: 'rgba(255, 105, 180, 0.3)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}
        whileHover={{ scale: 1.05, background: 'rgba(255, 105, 180, 0.5)' }}
        whileTap={{ scale: 0.95 }}
      >
        {bgMuted ? '🔇' : '🔊'}
      </motion.button>

      {/* Main container grouping letter, pin, and Kuromi - scales together */}
      <div className="relative w-full h-full max-w-[85vh] max-h-[85vw] flex items-center justify-center">
        {/* Kuromi GIF */}
        <motion.img
          src="/assets/message/kuromi final.gif"
          alt="Kuromi"
          className="absolute w-auto object-contain cursor-pointer"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{
            opacity: 1,
            scale: 0.7,
            y: isBouncing ? [0, -30, 0, -15, 0] : 0
          }}
          transition={{
            opacity: { delay: 0.3, duration: 0.8 },
            scale: { delay: 0.3, duration: 0.8 },
            y: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
          }}
          style={{
            height: '60%',
            right: '-65%',
            zIndex: 1,
            imageRendering: '-webkit-optimize-contrast'
          }}
          onClick={handleKuromiTap}
          whileTap={{ scale: 0.68 }}
          key="kuromi-gif"
        />

        {/* Letter container with pin - no floating animation */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: '100vh', rotate: 60, scale: 0.66 }}
          animate={{ opacity: 1, y: 0, rotate: 20, scale: 0.66 }}
          transition={{
            delay: 0.5,
            duration: 1.5,
            ease: [0.16, 1, 0.3, 1]
          }}
          style={{ width: '100%', maxWidth: '40rem' }}
        >
          <img
            src="/assets/message/letter.png"
            alt="Letter"
            className="w-full h-auto object-contain mx-6"
            style={{
              imageRendering: '-webkit-optimize-contrast',
              filter: 'drop-shadow(0 20px 60px rgba(0, 0, 0, 0.3)) drop-shadow(0 10px 30px rgba(0, 0, 0, 0.2)) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))',
              zIndex: 2
            }}
          />

          {/* Pin positioned relative to letter */}
          <motion.img
            src="/assets/message/pin.png"
            alt="Pin"
            className="absolute object-contain"
            initial={{ opacity: 0, scale: 0, rotate: -45 }}
            animate={{
              opacity: 1,
              scale: 0.882,
              rotate: 0
            }}
            transition={{
              delay: 1.1,
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1]
            }}
            style={{
              width: '4rem',
              top: '10%',
              left: '84%',
              transform: 'translate(-50%, -50%)',
              imageRendering: '-webkit-optimize-contrast',
              filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3))',
              zIndex: 3
            }}
          />
        </motion.div>
      </div>

      {/* Dock Navigation */}
      <DockNavigation />
    </main>
  );
}
