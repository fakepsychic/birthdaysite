'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import TiltedCard from '@/components/TiltedCard';
import Head from 'next/head';
import { useState } from 'react';

export default function HubPage() {
  const router = useRouter();
  const [ribbonRotate, setRibbonRotate] = useState(0);

  const icons = [
    {
      name: 'Music',
      href: '/playlist',
      src: '/assets/hub/musicplayer.icon.png',
      prominent: false,
      size: 270,
      offsetX: -10,
      offsetY: -10,
      offsetPx: 0
    },
    {
      name: 'Gift',
      href: '/gift',
      src: '/assets/hub/gift.icon.png',
      prominent: true,
      size: 280,
      offsetX: 12,
      offsetY: -5,
      offsetPx: 0
    },
    {
      name: 'Gallery',
      href: '/gallery',
      src: '/assets/hub/gallery.icon.png',
      prominent: false,
      size: 290,
      offsetX: -12,
      offsetY: -20,
      offsetPx: 0
    },
    {
      name: 'Notes',
      href: '/notes',
      src: '/assets/hub/note.icon.png',
      prominent: false,
      size: 300,
      offsetX: 10,
      offsetY: -25,
      offsetPx: 0
    }
  ];

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400..700&family=Pacifico&display=swap" rel="stylesheet" />
      </Head>

      <div className="relative w-screen h-screen overflow-hidden flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 50%, #c084fc 100%)'
      }}>
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

        {/* Main viewport container - maintains 1080x1350 portrait ratio */}
        <div
          className="relative w-full h-full max-w-[85vh] max-h-[85vw] flex items-center justify-center"
          style={{
            boxShadow: '0 0 120px rgba(0, 0, 0, 0.5), 0 0 200px rgba(0, 0, 0, 0.3), 0 0 300px rgba(0, 0, 0, 0.2)',
          }}
        >
          {/* Kuromi background image */}
          <img
            src="/assets/hub/backgroundhub.jpg"
            className="absolute inset-0 w-full h-full object-cover"
            alt=""
            style={{
              imageRendering: '-webkit-optimize-contrast',
              filter: 'blur(0.48px)'
            }}
          />

          {/* Subtle vignette overlay on portrait viewport */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0, 0, 0, 0.2) 100%)',
            }}
          />

          {/* Title at top */}
          <motion.img
            src="/assets/hub/title.png"
            alt="title"
            className="absolute z-20 object-contain"
            style={{
              left: '31%',
              top: '1%',
              transform: 'translateX(-50%)',
              width: '34.71563%',
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))'
            }}
            initial={{ opacity: 0, y: -30 }}
            animate={{
              opacity: 1,
              y: [0, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{
              opacity: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
              y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
              scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
            }}
          />

          {/* Icon Grid - centered as a group */}
          <div className="relative w-full h-full flex items-center justify-center px-12 md:px-16 z-10">
            <div
              className="grid grid-cols-2 gap-16"
              style={{
                width: 'min(70vw, 800px)',
                height: 'min(70vh, 800px)',
                placeItems: 'center'
              }}
            >
              {icons.map((icon, index) => {
                return (
                  <div
                    key={icon.name}
                    className="flex items-center justify-center"
                    style={{
                      width: `${icon.size}px`,
                      height: `${icon.size}px`,
                      isolation: 'isolate',
                      zIndex: index,
                      transform: `translate(calc(${icon.offsetX || 0}% + ${icon.offsetPx || 0}px), calc(${icon.offsetY || 0}% + ${icon.offsetPx || 0}px))`
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 30, scale: 0.8 }}
                      animate={{
                        opacity: 1,
                        y: [0, -8, 0],
                        scale: 1
                      }}
                      transition={{
                        opacity: { duration: 0.6, delay: index * 0.15 },
                        scale: { duration: 0.6, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] },
                        y: {
                          duration: 4,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: index * 0.15
                        },
                        default: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
                      }}
                      whileHover={{
                        scale: 1.08,
                        filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 40px rgba(255, 255, 255, 0.4))',
                      }}
                      style={{
                        isolation: 'isolate',
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      <TiltedCard
                        imageSrc={icon.src}
                        altText={icon.name}
                        containerHeight={`${icon.size}px`}
                        containerWidth={`${icon.size}px`}
                        imageHeight={`${icon.size}px`}
                        imageWidth={`${icon.size}px`}
                        scaleOnHover={1.05}
                        rotateAmplitude={10}
                        showMobileWarning={false}
                        showTooltip={false}
                        onClick={() => {
                          console.log('Icon clicked:', icon.name);
                          router.push(icon.href);
                        }}
                      />
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
