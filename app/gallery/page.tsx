'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Masonry from '@/components/Masonry';

type ImageItem = {
  id: string;
  img: string;
  url: string;
  height: number;
  caption?: string;
};

const images: ImageItem[] = [
  { id: '1', img: '/assets/gallery/p1.png', url: '#', height: 800, caption: 'Madam ji ki lag rhi ho😩' },
  { id: '2', img: '/assets/gallery/p2.jpg', url: '#', height: 600, caption: 'Looking hot asf' },
  { id: '3', img: '/assets/gallery/p3.png', url: '#', height: 900, caption: 'cutie' },
  { id: '4', img: '/assets/gallery/p4.png', url: '#', height: 700, caption: 'sexyyyy jaweeee' },
  { id: '5', img: '/assets/gallery/p5.png', url: '#', height: 850, caption: '2x cutiesss' },
  { id: '6', img: '/assets/gallery/p6.png', url: '#', height: 750, caption: 'A.I slop.... 😩 like wth we betta thn tht' },
];

export default function GalleryPage() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<typeof images[0] | null>(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      setScrollY(target.scrollTop);
    };

    const scrollContainer = document.getElementById('gallery-scroll');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleImageClick = (item: typeof images[0]) => {
    setSelectedImage(item);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!selectedImage) return;
    const currentIndex = images.findIndex(img => img.id === selectedImage.id);
    let newIndex;

    if (direction === 'next') {
      newIndex = (currentIndex + 1) % images.length;
    } else {
      newIndex = (currentIndex - 1 + images.length) % images.length;
    }

    setSelectedImage(images[newIndex]);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      navigateImage('next');
    }
    if (isRightSwipe) {
      navigateImage('prev');
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!selectedImage) return;
    if (e.key === 'ArrowLeft') navigateImage('prev');
    if (e.key === 'ArrowRight') navigateImage('next');
    if (e.key === 'Escape') closeModal();
  };

  useEffect(() => {
    if (selectedImage) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedImage]);

  return (
    <main
      className="fixed inset-0 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #ffd6e0 0%, #ffb6c1 50%, #ff69b4 100%)' }}
    >
      {/* Vignette effect */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.15) 100%)'
      }} />

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        onClick={() => router.push('/hub')}
        className="fixed top-6 left-6 z-50 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff69b4" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </motion.button>

      {/* Title - Hides when scrolling */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: scrollY > 50 ? 0 : 1,
          y: scrollY > 50 ? -20 : 0
        }}
        transition={{ duration: 0.3 }}
        className="fixed top-6 left-0 right-0 z-50 pointer-events-none"
      >
        <h1
          className="text-4xl md:text-5xl font-bold text-white text-center"
          style={{
            fontFamily: 'Special Gothic Expanded One, sans-serif',
            textShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
          }}
        >
          GALLERY
        </h1>
      </motion.div>

      {/* Masonry Grid - More space from top */}
      <div
        id="gallery-scroll"
        className="absolute inset-0 pt-32 pb-8 px-6 overflow-y-auto"
      >
        <div className="max-w-7xl mx-auto" style={{ minHeight: '100%' }}>
          <Masonry
            items={images}
            animateFrom="bottom"
            stagger={0.08}
            scaleOnHover={true}
            hoverScale={1.05}
            blurToFocus={true}
            colorShiftOnHover={false}
            onImageClick={handleImageClick}
          />
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }}
            onClick={closeModal}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/30 backdrop-blur-md" />
            {/* Left Arrow - Desktop */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('prev');
              }}
              className="hidden md:flex absolute left-8 z-10 w-12 h-12 items-center justify-center rounded-full backdrop-blur-sm"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: '#ff69b4'
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </motion.button>

            {/* Right Arrow - Desktop */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('next');
              }}
              className="hidden md:flex absolute right-8 z-10 w-12 h-12 items-center justify-center rounded-full backdrop-blur-sm"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: '#ff69b4'
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </motion.button>

            <motion.div
              key={selectedImage.id}
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl max-h-[90vh] w-full z-10"
            >
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-sm"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  color: '#ff69b4'
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </motion.button>

              <img
                src={selectedImage.img}
                alt="Selected"
                className="w-full h-full object-contain rounded-2xl"
                style={{
                  maxHeight: '90vh',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
