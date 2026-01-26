'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import ClickSpark from '@/components/ClickSpark';
import Ribbons from '@/components/Ribbons';

function useMicBlow(onBlow: () => void, enabled: boolean) {
  const triggered = useRef(false);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let audioCtx: AudioContext;
    let analyser: AnalyserNode;
    let dataArray: Uint8Array<ArrayBuffer>;
    let rafId: number;
    let stream: MediaStream;

    async function init() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioCtx = new AudioContext();
        const source = audioCtx.createMediaStreamSource(stream);
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        dataArray = new Uint8Array(analyser.frequencyBinCount);

        const tick = () => {
          analyser.getByteTimeDomainData(dataArray);

          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            const v = (dataArray[i] - 128) / 128;
            sum += v * v;
          }

          const volume = Math.sqrt(sum / dataArray.length);

          if (volume > 0.07 && !triggered.current) {
            triggered.current = true;
            onBlow();

            // Cleanup microphone after 0.5s
            setTimeout(() => {
              if (rafId) cancelAnimationFrame(rafId);
              if (stream) stream.getTracks().forEach(track => track.stop());
              if (audioCtx) audioCtx.close();
            }, 500);
            return;
          }

          rafId = requestAnimationFrame(tick);
        };

        tick();

        cleanupRef.current = () => {
          if (rafId) cancelAnimationFrame(rafId);
          if (stream) stream.getTracks().forEach(track => track.stop());
          if (audioCtx) audioCtx.close();
        };
      } catch (error) {
        console.error('Microphone access denied:', error);
      }
    }

    init();

    return () => {
      if (cleanupRef.current) cleanupRef.current();
    };
  }, [onBlow, enabled]);
}

export default function CakePage() {
  const router = useRouter();
  const [state, setState] = useState(1); // 1: mascot animation, 2: blow interaction, 3: celebration
  const [flameOut, setFlameOut] = useState(false);
  const [enableMicBlow, setEnableMicBlow] = useState(false);
  const [showBubble2, setShowBubble2] = useState(false);
  const [enableSwipe, setEnableSwipe] = useState(false);
  const [showRibbon, setShowRibbon] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [enableHover, setEnableHover] = useState(false);

  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  useMicBlow(() => {
    setFlameOut(true);
  }, enableMicBlow);

  // Transition to State 2 after mascot animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setState(2);
    }, 5600); // Match mascot animation duration

    return () => clearTimeout(timer);
  }, []);

  // Enable mic blow detection 1s after black screen fades (at 4.6s total)
  useEffect(() => {
    const timer = setTimeout(() => {
      setEnableMicBlow(true);
    }, 4600); // Black screen finishes fading at ~3.6s, + 1s = 4.6s

    return () => clearTimeout(timer);
  }, []);

  // Transition to State 3 after flame extinguish animation
  useEffect(() => {
    if (flameOut) {
      const timer = setTimeout(() => {
        setState(3);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [flameOut]);

  // Handle screen tap to show bubble 2
  const handleScreenTap = (e: React.MouseEvent<HTMLDivElement>) => {
    if (state === 3 && !showBubble2 && !isNavigating) {
      setShowBubble2(true);
    }
  };

  // Enable swipe 2 seconds after bubble 2 appears
  useEffect(() => {
    if (showBubble2) {
      const timer = setTimeout(() => {
        setEnableSwipe(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showBubble2]);

  // Enable hover 1 second after bubble 2 appears (desktop)
  useEffect(() => {
    if (showBubble2) {
      const timer = setTimeout(() => {
        setEnableHover(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showBubble2]);

  // Handle swipe detection
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!enableSwipe || isNavigating) return;

    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!enableSwipe || isNavigating || !touchStartRef.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const deltaTime = Date.now() - touchStartRef.current.time;

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const velocity = distance / deltaTime;

    // Detect swipe (minimum distance 50px or fast velocity)
    if (distance > 50 || velocity > 0.5) {
      setIsNavigating(true);
      setShowRibbon(true);

      // Navigate after ribbon animation completes (960ms total - 40% less than 1600ms)
      setTimeout(() => {
        router.push('/hub');
      }, 960);
    }

    touchStartRef.current = null;
  };

  // Handle mouse move for desktop hover effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!enableHover || isNavigating || showRibbon) return;

    // Show ribbon on any mouse movement after hover is enabled
    setIsNavigating(true);
    setShowRibbon(true);

    // Navigate after ribbon animation completes (960ms total - 40% less than 1600ms)
    setTimeout(() => {
      router.push('/hub');
    }, 960);
  };

  return (
    <ClickSpark
      sparkColor="#f4c2a1"
      sparkSize={12}
      sparkRadius={25}
      sparkCount={12}
      duration={500}
      easing="ease-out"
      extraScale={1.2}
      onChildClick={handleScreenTap}
    >
      <div
        className="relative w-screen h-screen overflow-hidden bg-black flex items-center justify-center"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseMove={handleMouseMove}
      >
        {/* Ambient background - fills gaps */}
        <img
          src="/assets/cake/bg-room.png"
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-3xl opacity-60"
          alt=""
        />

        {/* Main viewport container - maintains natural aspect ratio */}
        <div className="relative w-full h-full max-w-[85vh] max-h-[85vw] flex items-center justify-center">
          {/* Main background - never stretched */}
          <img
            src="/assets/cake/bg-room.png"
            className="w-full h-full object-contain scale-110"
            alt=""
          />

          {/* State 3 - Black Overlay - contained to background size */}
          {state === 3 && (
            <motion.div
              className="absolute inset-0 bg-black z-50"
              style={{ width: 'calc(110% + 1px)', left: 'calc(-5% - 0.5px)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ duration: 0.5, delay: 0 }}
            />
          )}

          {/* Cake positioned relative to the background */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[554.75px] pointer-events-none" style={{ transform: 'translate(calc(-50% + 5%), 17%)' }}>
            <div className="relative">
              {/* Glow effect when candle is lit */}
              {!flameOut && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(255, 200, 100, 0.3) 0%, transparent 70%)',
                    filter: 'blur(40px)',
                    top: '-20%',
                    left: '-10%',
                    right: '-10%',
                    bottom: '20%'
                  }}
                  animate={{
                    opacity: [0.6, 0.8, 0.6],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                />
              )}

              <motion.img
                src="/assets/cake/cake.png"
                className="w-full origin-bottom"
                style={{
                  filter: 'drop-shadow(0 15px 35px rgba(0,0,0,0.4)) drop-shadow(0 25px 50px rgba(0,0,0,0.3))'
                }}
                alt=""
                initial={{ scale: 0.84, y: 8 }}
                animate={{
                  scale: 0.875,
                  y: 0,
                  filter: [
                    'drop-shadow(0 15px 35px rgba(0,0,0,0.4)) drop-shadow(0 25px 50px rgba(0,0,0,0.3))',
                    'drop-shadow(0 18px 40px rgba(0,0,0,0.45)) drop-shadow(0 28px 55px rgba(0,0,0,0.35))',
                    'drop-shadow(0 15px 35px rgba(0,0,0,0.4)) drop-shadow(0 25px 50px rgba(0,0,0,0.3))'
                  ]
                }}
                transition={{
                  scale: { duration: 0.6, ease: "easeOut" },
                  y: { duration: 0.6, ease: "easeOut" },
                  filter: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }}
              />

              {/* Candle with flame as child */}
              <div className="absolute left-[47%] top-[13px] h-[105px] z-10" style={{ transform: 'translateX(calc(-50% - 5px))' }}>
                <motion.img
                  src="/assets/cake/candle.png"
                  className="h-full drop-shadow-lg"
                  alt=""
                  initial={{ scale: 1.008, y: 8 }}
                  animate={{ scale: 1.05, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />

                {/* Flame positioned relative to candle */}
                <motion.img
                  src="/assets/cake/flame.png"
                  className="absolute h-[30.8px]"
                  style={{
                    left: 'calc(50% - 4%)',
                    top: 'calc(-30.8px + 15%)',
                    transform: 'translateX(-50%)'
                  }}
                  alt=""
                  initial={{ scale: 1, opacity: 1, y: 0 }}
                  animate={
                    flameOut
                      ? { scale: 0.2, opacity: 0, y: 6 }
                      : {
                        scale: [1, 1.05, 0.98, 1.02, 1],
                        y: [0, -2, 1, -1, 0],
                        opacity: [1, 0.95, 1, 0.97, 1],
                      }
                  }
                  transition={
                    flameOut
                      ? { duration: 0.35, ease: "easeIn" }
                      : {
                        duration: 1.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }
                  }
                />
              </div>
            </div>
          </div>

          {/* Black Overlay - fades out when mascot exits */}
          <motion.div
            className="absolute top-0 left-0 h-full bg-black z-20"
            style={{ width: 'calc(110% + 1px)', transform: 'translateX(calc(-5% + 3px))' }}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: [0.6, 0.6, 0.6, 0] }}
            transition={{
              duration: 5.6,
              times: [0, 0.38, 0.52, 1],
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Mascot Animation */}
        <motion.img
          src="/assets/cake/mascot.png"
          alt=""
          className="absolute left-[35%] -translate-x-1/2 w-[420px] z-40"
          initial={{ y: "110%", opacity: 0 }}
          animate={{
            y: ["110%", "0%", "0%", "-200%"],
            opacity: [0, 1, 1, 1],
          }}
          transition={{
            duration: 5.6,
            times: [0, 0.3, 0.52, 1],
            ease: "easeInOut",
          }}
        />

        {/* Speech Bubble */}
        <motion.div
          className="absolute left-[51%] top-[20%] -translate-x-1/2 -translate-y-1/2 z-30"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: [0, 1, 1, 0], scale: 1 }}
          transition={{
            duration: 2.4,
            delay: 1.62,
            times: [0, 0.2, 0.7, 1],
          }}
        >
          <img src="/assets/cake/speech-bubble.png" className="w-[342px]" />
          <p className="absolute inset-0 flex items-center justify-center text-sm">

          </p>
        </motion.div>

        {/* State 3 - Mascot 2 */}
        {state === 3 && (
          <motion.img
            src="/assets/cake/mascot2.png"
            alt=""
            className="absolute left-[25%] -translate-x-1/2 top-[50%] -translate-y-1/2 w-[504px] z-[60]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -8, 0]
            }}
            transition={{
              opacity: { duration: 0.5, delay: 1 },
              scale: { duration: 0.5, delay: 1 },
              y: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }
            }}
          />
        )}

        {/* State 3 - Speech Bubble 1 */}
        {state === 3 && !showBubble2 && (
          <motion.img
            src="/assets/cake/speech bubble 1.png"
            alt=""
            className="absolute left-[34.38%] -translate-x-1/2 top-[40.43%] -translate-y-1/2 w-[400px] z-[60]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            transition={{
              opacity: { duration: 0.5, delay: 1 },
              scale: { duration: 0.5, delay: 1 }
            }}
          />
        )}

        {/* State 3 - Speech Bubble 2 */}
        {state === 3 && showBubble2 && (
          <motion.img
            src="/assets/cake/speech bubble 2.png"
            alt=""
            className="absolute left-[32.63%] -translate-x-1/2 top-[35.65%] -translate-y-1/2 w-[480px] z-[60]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              opacity: { duration: 0.5 },
              scale: { duration: 0.5 }
            }}
          />
        )}
      </div>

      {/* Ribbon Transition Effect */}
      <AnimatePresence>
        {showRibbon && (
          <motion.div
            className="fixed inset-0 z-[200]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Ribbons
              colors={['#9b59b6']}
              baseSpring={0.08}
              baseFriction={0.85}
              baseThickness={40}
              offsetFactor={0.08}
              maxAge={600}
              pointCount={80}
              speedMultiplier={0.8}
              enableFade={false}
              enableShaderEffect={false}
              backgroundColor={[0, 0, 0, 0]}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </ClickSpark>
  );
}