'use client';

import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import BounceCards from '@/components/BounceCards';
import ClickSpark from '@/components/ClickSpark';

const images = [
  "/assets/notes/N1.png",
  "/assets/notes/N2.png",
  "/assets/notes/N3.png",
  "/assets/notes/N4.png",
  "/assets/notes/N5.png"
];

const transformStyles = [
  "rotate(10deg) translate(-170px)",
  "rotate(5deg) translate(-85px)",
  "rotate(-3deg)",
  "rotate(-10deg) translate(85px)",
  "rotate(2deg) translate(170px)"
];

export default function NotesPage() {
  const containerRef = useRef<HTMLElement>(null);
  const [mascotPosition, setMascotPosition] = useState({ x: 100, y: 100 });

  const moveAwayFromPointer = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    const mascotSize = window.innerWidth >= 768 ? 240 : 192;

    // Get mascot center position
    const mascotCenterX = mascotPosition.x + mascotSize / 2;
    const mascotCenterY = mascotPosition.y + mascotSize / 2;

    // Calculate distance from pointer to mascot center
    const dx = mascotCenterX - clientX;
    const dy = mascotCenterY - clientY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // If pointer is close (within 150px), move away
    if (distance < 150) {
      // Calculate direction away from pointer
      const angle = Math.atan2(dy, dx);

      // Move in opposite direction
      const moveDistance = 200;
      let newX = mascotPosition.x + Math.cos(angle) * moveDistance;
      let newY = mascotPosition.y + Math.sin(angle) * moveDistance;

      // Keep within bounds
      const maxX = containerWidth - mascotSize;
      const maxY = containerHeight - mascotSize;

      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));

      setMascotPosition({ x: newX, y: newY });
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    moveAwayFromPointer(clientX, clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current || e.touches.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const clientX = touch.clientX - rect.left;
    const clientY = touch.clientY - rect.top;
    moveAwayFromPointer(clientX, clientY);
  };

  return (
    <main
      ref={containerRef}
      className="min-h-screen flex items-center justify-center p-6 md:p-8 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #ffd6e0 0%, #ffb6c1 50%, #ff69b4 100%)' }}
      onPointerMove={handlePointerMove}
      onTouchMove={handleTouchMove}
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{
          opacity: 1,
          y: [0, -8, 0]
        }}
        transition={{
          opacity: { duration: 0.6 },
          y: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        className="absolute flex justify-center w-full z-10"
        style={{ top: '-170px' }}
      >
        <img
          src="/assets/notes/note.png"
          alt="Notes"
          className="w-[652.8px] h-[652.8px] object-contain"
          style={{ filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))' }}
        />
      </motion.div>

      {/* Shy Mascot */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: 1,
          scale: 1,
          left: mascotPosition.x,
          top: mascotPosition.y
        }}
        transition={{
          opacity: { duration: 0.8, delay: 0.3 },
          scale: { duration: 0.8, delay: 0.3 },
          left: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
          top: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
        }}
        className="absolute z-20 w-48 h-48 md:w-60 md:h-60 pointer-events-none"
        style={{ left: mascotPosition.x, top: mascotPosition.y }}
      >
        <img
          src="/assets/notes/Shy.png"
          alt="Mascot"
          className="w-full h-full object-contain"
          style={{ filter: 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.25))' }}
        />
      </motion.div>

      <div className="w-full max-w-4xl relative z-30">
        <BounceCards
          className="custom-bounceCards"
          images={images}
          containerWidth={800}
          containerHeight={400}
          animationDelay={0.5}
          animationStagger={0.06}
          easeType="elastic.out(1, 0.8)"
          transformStyles={transformStyles}
          enableHover={true}
        />

        {/* Instruction Text */}
        <div className="mt-6 flex flex-col items-center gap-2 text-zinc-600">
          <p className="text-xs font-thin tracking-wide">*Tap on notes to read them</p>
          <p className="text-xs font-thin tracking-wide">*The mascot got shy after writing these notes... try catching it!</p>
        </div>
      </div>
    </main>
  );
}
