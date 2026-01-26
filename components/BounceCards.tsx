'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { AnimatePresence, motion } from 'framer-motion';

interface BounceCardsProps {
    className?: string;
    images?: string[];
    containerWidth?: number;
    containerHeight?: number;
    animationDelay?: number;
    animationStagger?: number;
    easeType?: string;
    transformStyles?: string[];
    enableHover?: boolean;
}

export default function BounceCards({
    className = '',
    images = [],
    containerWidth = 400,
    containerHeight = 400,
    animationDelay = 0.5,
    animationStagger = 0.06,
    easeType = 'elastic.out(1, 0.8)',
    transformStyles = [
        'rotate(10deg) translate(-170px)',
        'rotate(5deg) translate(-85px)',
        'rotate(-3deg)',
        'rotate(-10deg) translate(85px)',
        'rotate(2deg) translate(170px)'
    ],
    enableHover = false
}: BounceCardsProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const touchStartRef = useRef<{ x: number; y: number } | null>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.card',
                { scale: 0 },
                {
                    scale: 1,
                    stagger: animationStagger,
                    ease: easeType,
                    delay: animationDelay
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, [animationDelay, animationStagger, easeType]);

    // Keyboard navigation when modal is open
    useEffect(() => {
        if (selectedIndex === null) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                setSelectedIndex(prev => prev! > 0 ? prev! - 1 : prev);
            } else if (e.key === 'ArrowRight') {
                setSelectedIndex(prev => prev! < images.length - 1 ? prev! + 1 : prev);
            } else if (e.key === 'Escape') {
                setSelectedIndex(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIndex, images.length]);

    // Swipe navigation when modal is open
    const handleModalTouchStart = (e: React.TouchEvent) => {
        const touch = e.touches[0];
        touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleModalTouchEnd = (e: React.TouchEvent) => {
        if (!touchStartRef.current) return;

        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - touchStartRef.current.x;
        const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);

        if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > deltaY) {
            if (deltaX > 0 && selectedIndex! > 0) {
                setSelectedIndex(selectedIndex! - 1);
            } else if (deltaX < 0 && selectedIndex! < images.length - 1) {
                setSelectedIndex(selectedIndex! + 1);
            }
        }

        touchStartRef.current = null;
    };

    const getNoRotationTransform = (transformStr: string): string => {
        const hasRotate = /rotate\([\s\S]*?\)/.test(transformStr);
        if (hasRotate) {
            return transformStr.replace(/rotate\([\s\S]*?\)/, 'rotate(0deg)');
        } else if (transformStr === 'none') {
            return 'rotate(0deg)';
        } else {
            return `${transformStr} rotate(0deg)`;
        }
    };

    const getPushedTransform = (baseTransform: string, offsetX: number): string => {
        const translateRegex = /translate\(([-0-9.]+)px\)/;
        const match = baseTransform.match(translateRegex);
        if (match) {
            const currentX = parseFloat(match[1]);
            const newX = currentX + offsetX;
            return baseTransform.replace(translateRegex, `translate(${newX}px)`);
        } else {
            return baseTransform === 'none' ? `translate(${offsetX}px)` : `${baseTransform} translate(${offsetX}px)`;
        }
    };

    const pushSiblings = (hoveredIdx: number) => {
        const q = gsap.utils.selector(containerRef);
        if (!enableHover || !containerRef.current) return;

        images.forEach((_, i) => {
            const selector = q(`.card-${i}`);
            gsap.killTweensOf(selector);

            const baseTransform = transformStyles[i] || 'none';

            if (i === hoveredIdx) {
                const noRotation = getNoRotationTransform(baseTransform);
                gsap.to(selector, {
                    transform: noRotation,
                    duration: 0.4,
                    ease: 'back.out(1.4)',
                    overwrite: 'auto'
                });
            } else {
                const offsetX = i < hoveredIdx ? -160 : 160;
                const pushedTransform = getPushedTransform(baseTransform, offsetX);
                const distance = Math.abs(hoveredIdx - i);
                const delay = distance * 0.05;
                gsap.to(selector, {
                    transform: pushedTransform,
                    duration: 0.4,
                    ease: 'back.out(1.4)',
                    delay,
                    overwrite: 'auto'
                });
            }
        });
    };

    const resetSiblings = () => {
        if (!enableHover || !containerRef.current) return;

        const q = gsap.utils.selector(containerRef);
        images.forEach((_, i) => {
            const selector = q(`.card-${i}`);
            gsap.killTweensOf(selector);

            const baseTransform = transformStyles[i] || 'none';
            gsap.to(selector, {
                transform: baseTransform,
                duration: 0.4,
                ease: 'back.out(1.4)',
                overwrite: 'auto'
            });
        });
    };

    const handleCardClick = (index: number) => {
        setSelectedIndex(index);
    };

    const handleClose = () => {
        setSelectedIndex(null);
    };

    return (
        <>
            <div
                className={`relative flex items-center justify-center ${className}`}
                ref={containerRef}
                style={{
                    width: containerWidth,
                    height: containerHeight,
                    filter: selectedIndex !== null ? 'blur(8px)' : 'none',
                    transition: 'filter 0.3s ease'
                }}
            >
                {images.map((src, idx) => (
                    <div
                        key={idx}
                        className={`card card-${idx} absolute w-[200px] aspect-square border-8 border-white rounded-[30px] overflow-hidden cursor-pointer`}
                        style={{
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                            transform: transformStyles[idx] || 'none'
                        }}
                        onMouseEnter={() => pushSiblings(idx)}
                        onMouseLeave={resetSiblings}
                        onClick={() => handleCardClick(idx)}
                    >
                        <img className="w-full h-full object-cover" src={src} alt={`card-${idx}`} />
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {selectedIndex !== null && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={handleClose}
                        onTouchStart={handleModalTouchStart}
                        onTouchEnd={handleModalTouchEnd}
                    >
                        <div className="absolute inset-0 bg-black/30 backdrop-blur-md" />
                        <motion.div
                            className="relative z-10"
                            key={selectedIndex}
                            initial={{ scale: 0.8, opacity: 0, rotate: 0 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={images[selectedIndex]}
                                alt={`Note ${selectedIndex + 1}`}
                                className="max-w-[90vw] max-h-[90vh] object-contain rounded-2xl shadow-2xl"
                                style={{
                                    filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.4))'
                                }}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
