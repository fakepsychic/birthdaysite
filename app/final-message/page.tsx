"use client";

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import DockNavigation from '@/components/DockNavigation';
import { useState } from 'react';

export default function MessagePage() {
  const router = useRouter();
  const [isBouncing, setIsBouncing] = useState(false);

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
      {/* Kuromi GIF in background */}
      <motion.img
        src="/assets/message/kuromi final.gif"
        alt="Kuromi"
        className="absolute w-auto h-[60vh] object-contain cursor-pointer"
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
          right: '7%',
          zIndex: 1,
          imageRendering: '-webkit-optimize-contrast'
        }}
        onClick={handleKuromiTap}
        whileTap={{ scale: 0.68 }}
        key="kuromi-gif"
      />

      {/* Letter container - no floating animation */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: '100vh', rotate: 60, scale: 0.66 }}
        animate={{ opacity: 1, y: 0, rotate: 20, scale: 0.66 }}
        transition={{
          delay: 0.5,
          duration: 1.5,
          ease: [0.16, 1, 0.3, 1]
        }}
      >
        <img
          src="/assets/message/letter.png"
          alt="Letter"
          className="w-full max-w-2xl h-auto object-contain mx-6"
          style={{
            imageRendering: '-webkit-optimize-contrast',
            filter: 'drop-shadow(0 20px 60px rgba(0, 0, 0, 0.3)) drop-shadow(0 10px 30px rgba(0, 0, 0, 0.2)) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))',
            zIndex: 2
          }}
        />
      </motion.div>

      {/* Pin positioned at the white blank box on letter */}
      <motion.img
        src="/assets/message/pin.png"
        alt="Pin"
        className="absolute w-16 h-auto object-contain"
        initial={{ opacity: 0, scale: 0, rotate: -45 }}
        animate={{
          opacity: 1,
          scale: 0.833,
          rotate: 0
        }}
        transition={{
          delay: 1.1,
          duration: 0.6,
          ease: [0.16, 1, 0.3, 1]
        }}
        style={{
          top: 'calc(21% + 5px)',
          left: 'calc(60% + 35px)',
          transform: 'translate(-50%, -50%)',
          imageRendering: '-webkit-optimize-contrast',
          filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3))',
          zIndex: 3
        }}
      />

      {/* Dock Navigation */}
      <DockNavigation />
    </main>
  );
}
