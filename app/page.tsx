'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';

const springValues = {
  damping: 30,
  stiffness: 100,
  mass: 2
};

export default function Welcome() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [isDayMode, setIsDayMode] = useState(true);
  const [bgMuted, setBgMuted] = useState(true);
  const [isBouncing, setIsBouncing] = useState(false);
  const mascotRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.24;
    }
  }, []);

  const handleButtonClick = () => {
    router.push('/cake');
  };

  const toggleTheme = () => {
    setIsDayMode(!isDayMode);
  };

  const handleMascotClick = () => {
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 1200);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden">
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
          background: isDayMode
            ? 'rgba(168, 218, 255, 0.3)'
            : 'rgba(30, 27, 75, 0.3)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}
        whileHover={{ scale: 1.05, background: isDayMode ? 'rgba(168, 218, 255, 0.5)' : 'rgba(30, 27, 75, 0.5)' }}
        whileTap={{ scale: 0.95 }}
      >
        {bgMuted ? '🔇' : '🔊'}
      </motion.button>

      {/* Toggle Button */}
      <motion.button
        onClick={toggleTheme}
        className="absolute top-8 right-8 z-50 flex items-center gap-3 px-4 py-3 rounded-full backdrop-blur-md border-2 border-white/30 shadow-lg"
        style={{
          background: isDayMode
            ? 'linear-gradient(135deg, #a8daff 0%, #e0f4ff 100%)'
            : 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 100%)'
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Sun Icon */}
        <motion.div
          animate={{
            opacity: isDayMode ? 1 : 0.3,
            scale: isDayMode ? 1.2 : 0.9,
            filter: isDayMode ? 'brightness(1.3) drop-shadow(0 0 12px rgba(255, 200, 0, 1)) drop-shadow(0 0 20px rgba(255, 200, 0, 0.6))' : 'brightness(0.5)'
          }}
          transition={{ duration: 0.3 }}
          className="text-2xl"
        >
          ☀️
        </motion.div>

        {/* Divider */}
        <div className="w-px h-6 bg-white/40" />

        {/* Moon Icon */}
        <motion.div
          animate={{
            opacity: isDayMode ? 0.3 : 1,
            scale: isDayMode ? 0.9 : 1.2,
            filter: isDayMode ? 'brightness(0.5)' : 'brightness(1.3) drop-shadow(0 0 12px rgba(200, 200, 255, 1)) drop-shadow(0 0 20px rgba(200, 200, 255, 0.6))'
          }}
          transition={{ duration: 0.3 }}
          className="text-2xl"
        >
          🌙
        </motion.div>
      </motion.button>

      {/* Background with transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={isDayMode ? 'day' : 'night'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 bg-cover bg-center blur-xl"
          style={{
            backgroundImage: isDayMode
              ? 'url(/assets/day%20welcome/day%20bg.png)'
              : 'url(/assets/night%20welcome/night%20bg.png)',
            transform: 'scale(1.1)',
          }}
        />
      </AnimatePresence>

      <motion.div
        key={isDayMode ? 'day-main' : 'night-main'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative bg-cover bg-center z-10 w-full h-full"
        style={{
          maxWidth: '100vh',
          maxHeight: '100vw',
          aspectRatio: '1080 / 1350',
          backgroundImage: isDayMode
            ? 'url(/assets/day%20welcome/day%20bg.png)'
            : 'url(/assets/night%20welcome/night%20bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow: '0 0 60px rgba(0, 0, 0, 0.3), 0 0 120px rgba(0, 0, 0, 0.2), 0 20px 80px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isDayMode
              ? 'radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.08) 100%)'
              : 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 50%, transparent 100%)',
          }}
        />

        {/* Clouds with animation */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            left: isDayMode ? '48.74%' : '38.74%',
            top: isDayMode ? '0%' : '5%',
            width: isDayMode ? '110.9416%' : '100.856%',
          }}
          animate={{ y: [0, -8, 0] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={isDayMode ? 'day-clouds' : 'night-clouds'}
              src={isDayMode ? '/assets/day%20welcome/day%20cloud.png' : '/assets/night%20welcome/night%20cloud.png'}
              alt="clouds"
              className="w-full h-auto"
              draggable={false}
              style={{ transform: 'translateX(-50%)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            />
          </AnimatePresence>
        </motion.div>

        {/* Welcome Button */}
        <motion.div
          className="absolute cursor-pointer"
          style={{
            left: isDayMode ? '20%' : '22%',
            top: isDayMode ? '61%' : '59%',
            width: isDayMode ? '61.242156%' : '60.829262%',
            transform: isDayMode ? 'translateX(-50%) scale(1.08)' : 'translateX(-50%) scaleX(1.07272) scaleY(0.736)',
            zIndex: 30,
          }}
          onClick={handleButtonClick}
          whileHover={{ filter: 'brightness(0.9)' }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{
            scale: {
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            },
            filter: { duration: 0.1 }
          }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={isDayMode ? 'day-button' : 'night-button'}
              src={isDayMode ? '/assets/day%20welcome/welcome%20day%20button.png' : '/assets/night%20welcome/welcome%20night%20button.png'}
              alt="welcome"
              className="w-full h-auto block"
              draggable={false}
              style={{ display: 'block' }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            />
          </AnimatePresence>
        </motion.div>

        {/* Mascot with delay and transition - NOT CLICKABLE */}
        <motion.div
          ref={mascotRef}
          className="absolute cursor-pointer"
          style={{
            left: isDayMode ? '-1.1%' : '-4.1%',
            top: isDayMode ? '33.4%' : '32.4%',
            width: isDayMode ? '41.976%' : '46.34146%',
            zIndex: 40,
            perspective: '800px',
            pointerEvents: 'auto',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: isBouncing ? [0, -35, 0, -18, 0, -8, 0, -3, 0] : [0, -8.8, 0]
          }}
          transition={{
            opacity: { duration: 0.8, delay: 0.5 },
            y: isBouncing
              ? {
                duration: 1.2,
                ease: "easeOut",
                times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.85, 0.95, 1]
              }
              : {
                duration: 4.4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5
              }
          }}
          onClick={handleMascotClick}
        >
          <motion.div
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={isDayMode ? 'day-kuromi' : 'night-kuromi'}
                src={isDayMode ? '/assets/day%20welcome/day%20kuromi.png' : '/assets/night%20welcome/night%20kuromi.png'}
                alt="kuromi"
                className="w-full h-auto pointer-events-none"
                draggable={false}
                style={{
                  filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.2))',
                  transform: 'translateZ(0)',
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              />
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </motion.div>
    </div >
  );
}
