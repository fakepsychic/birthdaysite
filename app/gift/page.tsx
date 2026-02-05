'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from '@/systems/ProgressProvider';
import SplitText from '@/components/SplitText';
import Shuffle from '@/components/Shuffle';

const CORRECT_ANSWER = 'patrick jane';

export default function GiftPage() {
  const router = useRouter();
  const { progress, setGiftUnlocked } = useProgress();
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [shouldShake, setShouldShake] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [mascotState, setMascotState] = useState<'idle' | 'tantrum' | 'happy'>('idle');

  useEffect(() => {
    // Only auto-redirect if gift was just unlocked (not on page load)
    if (progress.giftUnlocked && isUnlocking) {
      setTimeout(() => {
        router.push('/final');
      }, 1300); // Wait 1.3 seconds for animation
    }
  }, [progress.giftUnlocked, isUnlocking, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const normalizedAnswer = answer.trim().toLowerCase();
    const normalizedCorrect = CORRECT_ANSWER.toLowerCase();

    if (normalizedAnswer === normalizedCorrect) {
      setIsUnlocking(true);
      setGiftUnlocked(true);
      setMascotState('happy');
      // Redirect happens immediately in useEffect
    } else {
      setAttempts(prev => prev + 1);
      setError(getErrorMessage(attempts + 1));
      setAnswer('');
      setShouldShake(true);
      setMascotState('tantrum'); // Switch to tantrum on first wrong answer, stays tantrum
      setTimeout(() => setShouldShake(false), 800);
    }
  };

  const getErrorMessage = (attemptCount: number) => {
    const messages = [
      "Nahhh nahhh!",
      "Still wrong kuchu puchu...Think harder!",
      "You know this one comeon...maryummmy ",
      "ehh are u frr!",
      "bzzz..bzzzz",
      "i can give u a hint..tho after u fail this time",
      "he's very handsome😩",
      "wottt again",
      "ahhhhhhhhhhhhhhh"

    ];
    return messages[Math.min(attemptCount - 1, messages.length - 1)];
  };

  return (
    <main
      className="relative min-h-screen flex items-center justify-center overflow-hidden transition-colors duration-700"
      style={{
        fontFamily: '"Special Gothic Expanded One", sans-serif',
        background: isUnlocking
          ? 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 50%, #c084fc 100%)'
          : 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 50%, #c084fc 100%)'
      }}
    >
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      {/* Ambient gradient overlay */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 20% 30%, rgba(0, 0, 0, 0.03) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 70%, rgba(0, 0, 0, 0.03) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.03) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 30%, rgba(0, 0, 0, 0.03) 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Vignette effect */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.05) 100%)'
      }} />

      {/* Floating geometric shapes */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-black/5"
          style={{
            width: `${150 + Math.random() * 200}px`,
            height: `${150 + Math.random() * 200}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Single Mascot - Changes based on state */}
      <motion.div
        className="absolute z-20"
        style={{ left: '25%', top: '60%', transform: 'translate(-50%, -50%) scale(1.2)' }}
        key={mascotState}
      >
        <AnimatePresence mode="sync">
          {mascotState === 'idle' && (
            <motion.img
              key="idle"
              src="/assets/gift/mascot-idle.png"
              alt="mascot idle"
              className="w-32 h-32 object-contain"
              style={{
                filter: 'drop-shadow(0 10px 25px rgba(0, 0, 0, 0.3)) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2))',
                transform: 'scale(1.495)'
              }}
              initial={{ opacity: 0, scale: 1.196, y: 20 }}
              animate={{
                opacity: 1,
                scale: 1.495,
                y: [0, -8, 0],
              }}
              exit={{ opacity: 1, scale: 1.495 }}
              transition={{
                opacity: { duration: 0.4 },
                scale: { duration: 0.4 },
                y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                exit: { duration: 0 }
              }}
            />
          )}

          {mascotState === 'tantrum' && (
            <motion.img
              key="tantrum"
              src="/assets/gift/mascot-tantrum.png"
              alt="mascot tantrum"
              className="w-36 h-36 object-contain"
              style={{
                filter: 'drop-shadow(0 12px 30px rgba(0, 0, 0, 0.35)) drop-shadow(0 6px 16px rgba(0, 0, 0, 0.25))',
                transform: 'scale(1.3)'
              }}
              initial={{ opacity: 1, scale: 1.69, rotate: 15 }}
              animate={shouldShake ? {
                opacity: 1,
                x: [-20, 20, -18, 18, -15, 15, -12, 12, -8, 8, -4, 4, 0],
                rotate: [-15, 15, -12, 12, -10, 10, -8, 8, -5, 5, -3, 3, 0],
                scale: [1.69, 1.56, 1.625, 1.495, 1.56, 1.43, 1.495, 1.365, 1.43, 1.3],
              } : {
                opacity: 1,
                x: 0,
                rotate: 0,
                scale: 1.3,
                y: [0, -5, 0]
              }}
              exit={{ opacity: 1, scale: 1.3 }}
              transition={shouldShake ? {
                duration: 0.8,
                ease: [0.4, 0, 0.6, 1],
                times: [0, 0.08, 0.16, 0.24, 0.32, 0.4, 0.48, 0.56, 0.64, 0.72, 0.8, 0.9, 1]
              } : {
                opacity: { duration: 0 },
                y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
                exit: { duration: 0 }
              }}
            />
          )}

          {mascotState === 'happy' && (
            <motion.img
              key="happy"
              src="/assets/gift/mascot-happy.png"
              alt="mascot happy"
              className="w-36 h-36 object-contain"
              style={{
                filter: 'drop-shadow(0 15px 35px rgba(192, 132, 252, 0.4)) drop-shadow(0 8px 20px rgba(233, 213, 255, 0.6)) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2))',
                transform: 'scale(1.3)'
              }}
              initial={{ opacity: 1, scale: 0, rotate: -180 }}
              animate={{
                opacity: 1,
                scale: [0, 1.69, 1.3],
                rotate: [-180, 10, -10, 5, -5, 0],
                y: [0, -25, -10, -20, -5, 0]
              }}
              transition={{
                duration: 1,
                ease: [0.16, 1, 0.3, 1]
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      <div className="relative z-10 max-w-md w-full mx-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Gift Icon */}
          <motion.div
            className="flex justify-center mb-10"
          >
            <motion.img
              src="/assets/gift/gift.png"
              alt="gift"
              className="w-40 h-40 object-contain"
              style={{
                filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.2))'
              }}
              animate={isUnlocking ? {
                rotate: [0, -15, 20, -25, 30, -20, 15, -10, 5, 0],
                scale: [1, 1.2, 1.05, 1.25, 1, 1.22, 1.03, 1.18, 1.07, 1],
                y: [0, -5, 3, -8, 5, -6, 4, -3, 2, 0],
              } : {
                y: [0, -12, 0],
              }}
              transition={isUnlocking ? {
                duration: 1.3,
                ease: [0.4, 0, 0.6, 1],
                times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.85, 1]
              } : {
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>

          {/* Title */}
          <motion.div
            className="mb-3"
            style={{ paddingLeft: '5%' }}
            animate={isUnlocking ? {
              scale: [1, 1.05, 1],
            } : {}}
          >
            {isUnlocking ? (
              <Shuffle
                text="Unlocked!"
                tag="h1"
                className="text-5xl md:text-6xl font-bold text-center text-black tracking-tight"
                shuffleDirection="right"
                duration={0.4}
                ease="power3.out"
                threshold={0}
                rootMargin="0px"
                textAlign="center"
                shuffleTimes={2}
                animationMode="evenodd"
                stagger={0.05}
                scrambleCharset="ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%"
                triggerOnce={true}
                triggerOnHover={false}
              />
            ) : (
              <SplitText
                text="Secret Gift"
                tag="h1"
                className="text-5xl md:text-6xl font-bold text-center text-black tracking-tight"
                splitType="chars"
                delay={80}
                duration={1}
                ease="power3.out"
                from={{ opacity: 0, y: 50, rotateX: -90 }}
                to={{ opacity: 1, y: 0, rotateX: 0 }}
                threshold={0}
                rootMargin="0px"
                textAlign="center"
              />
            )}
          </motion.div>

          <motion.p
            className="text-center text-neutral-500 mb-12 text-sm font-medium tracking-wider uppercase"
            style={{
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              fontFamily: '"Roboto Condensed", sans-serif',
              fontOpticalSizing: 'auto',
              fontWeight: 500
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {isUnlocking ? 'Opening your gift...' : 'Answer to unlock'}
          </motion.p>

          {/* Quiz Form - Always visible */}
          <div className="bg-white rounded-3xl p-6 shadow-2xl border border-neutral-200">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-lg font-semibold text-black mb-4 text-center" style={{
                  textShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
                }}>
                  Who do I love the most?
                </label>

                <motion.div
                  animate={shouldShake ? {
                    x: [0, -10, 10, -10, 10, 0],
                  } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-neutral-200 focus:border-black focus:outline-none transition-all bg-neutral-50 text-black text-base font-medium placeholder:text-neutral-400"
                    placeholder="Type your answer..."
                    autoFocus
                    disabled={isUnlocking}
                  />
                </motion.div>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    className="px-5 py-4 rounded-2xl bg-neutral-100 border border-neutral-200"
                  >
                    <p className="text-center text-black font-medium text-sm">
                      {error}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-4 rounded-2xl font-semibold text-base text-white bg-black shadow-lg hover:shadow-xl transition-all relative overflow-hidden"
                disabled={isUnlocking}
              >
                <motion.div
                  className="absolute inset-0 bg-white"
                  style={{ opacity: 0 }}
                  whileHover={{ opacity: 0.1 }}
                  transition={{ duration: 0.2 }}
                />
                <span className="relative z-10 tracking-wide">
                  {isUnlocking ? 'Unlocking...' : 'Unlock Gift'}
                </span>
              </motion.button>

              {/* Attempts counter */}
              {attempts > 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-xs text-neutral-400 font-medium tracking-wider uppercase"
                  style={{
                    fontFamily: '"Roboto Condensed", sans-serif',
                    fontOpticalSizing: 'auto',
                    fontWeight: 500
                  }}
                >
                  Attempts: {attempts}
                </motion.p>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
