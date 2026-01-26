"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function FinalPage() {
  const router = useRouter();
  const [showButton, setShowButton] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 3700);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = 1.0; // Set to full volume
    }
  }, []);

  const handleNext = () => {
    router.push('/final-message');
  };

  const handleBackToHub = () => {
    router.push('/hub');
  };

  return (
    <motion.main
      className="fixed inset-0 flex items-center justify-center p-2 md:p-3 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 50%, #e8e8e8 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      {/* Animated gradient overlay */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 20% 30%, rgba(0, 0, 0, 0.04) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 70%, rgba(0, 0, 0, 0.04) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.04) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 30%, rgba(0, 0, 0, 0.04) 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Vignette effect */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.08) 100%)'
      }} />

      <motion.div
        className="rounded-2xl overflow-hidden border-4 cursor-default relative"
        style={{
          borderColor: 'rgba(255, 255, 255, 0.5)',
          aspectRatio: '1 / 1',
          width: 'min(98vmin, 700px)',
          height: 'min(98vmin, 700px)',
          boxShadow: '0 0 0 8px rgba(255, 255, 255, 0.2), 0 20px 60px rgba(0, 0, 0, 0.3), 0 0 80px rgba(255, 255, 255, 0.1)'
        }}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Animated border glow */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            boxShadow: '0 0 30px rgba(255, 255, 255, 0.5)',
          }}
          animate={{
            boxShadow: [
              '0 0 30px rgba(255, 255, 255, 0.5)',
              '0 0 50px rgba(255, 255, 255, 0.7)',
              '0 0 30px rgba(255, 255, 255, 0.5)',
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        <video
          ref={videoRef}
          src="/video/final-edit.mp4"
          className="w-full h-full object-cover block"
          playsInline
          autoPlay
          muted={false}
          controls
          loop
        />
      </motion.div>

      <AnimatePresence>
        {showButton && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-8 right-8 md:bottom-12 md:right-12 z-10"
            style={{ pointerEvents: 'auto' }}
          >
            <motion.button
              whileHover={{ scale: 1.1, x: 4 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-2 backdrop-blur-sm"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                borderColor: '#333333',
                color: '#ffffff'
              }}
            >
              <motion.svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </motion.svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}
