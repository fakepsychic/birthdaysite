'use client';

import type { SpringOptions } from 'motion/react';
import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

interface TiltedCardProps {
    imageSrc: React.ComponentProps<'img'>['src'];
    altText?: string;
    captionText?: string;
    containerHeight?: React.CSSProperties['height'];
    containerWidth?: React.CSSProperties['width'];
    imageHeight?: React.CSSProperties['height'];
    imageWidth?: React.CSSProperties['width'];
    scaleOnHover?: number;
    rotateAmplitude?: number;
    showMobileWarning?: boolean;
    showTooltip?: boolean;
    overlayContent?: React.ReactNode;
    displayOverlayContent?: boolean;
    onClick?: () => void;
}

const springValues: SpringOptions = {
    damping: 30,
    stiffness: 100,
    mass: 2
};

export default function TiltedCard({
    imageSrc,
    altText = 'Tilted card image',
    captionText = '',
    containerHeight = '300px',
    containerWidth = '100%',
    imageHeight = '300px',
    imageWidth = '300px',
    scaleOnHover = 1.1,
    rotateAmplitude = 14,
    showMobileWarning = false,
    showTooltip = false,
    overlayContent = null,
    displayOverlayContent = false,
    onClick
}: TiltedCardProps) {
    const ref = useRef<HTMLElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useSpring(useMotionValue(0), springValues);
    const rotateY = useSpring(useMotionValue(0), springValues);
    const scale = useSpring(1, springValues);
    const opacity = useSpring(0);
    const shadowOpacity = useMotionValue(1);
    const rotateFigcaption = useSpring(0, {
        stiffness: 350,
        damping: 30,
        mass: 1
    });
    const [lastY, setLastY] = useState(0);
    const [hasShadow, setHasShadow] = useState(true);
    const imgRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // Create a hidden canvas to check pixel transparency
    function isPixelTransparent(x: number, y: number): boolean {
        if (!imgRef.current || !canvasRef.current) return false;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return false;

        try {
            // Scale coordinates to match natural image size
            const img = imgRef.current;
            const scaleX = canvas.width / img.width;
            const scaleY = canvas.height / img.height;
            const scaledX = Math.floor(x * scaleX);
            const scaledY = Math.floor(y * scaleY);

            const imageData = ctx.getImageData(scaledX, scaledY, 1, 1);
            return imageData.data[3] < 50; // Alpha channel < 50 is considered transparent (more lenient)
        } catch (e) {
            return false;
        }
    }

    function handleMouse(e: React.MouseEvent<HTMLElement>) {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const offsetX = e.clientX - rect.left - rect.width / 2;
        const offsetY = e.clientY - rect.top - rect.height / 2;

        const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
        const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

        rotateX.set(rotationX);
        rotateY.set(rotationY);

        x.set(e.clientX - rect.left);
        y.set(e.clientY - rect.top);

        const velocityY = offsetY - lastY;
        rotateFigcaption.set(-velocityY * 0.6);
        setLastY(offsetY);
    }

    function handleMouseEnter() {
        scale.set(scaleOnHover);
        opacity.set(1);
    }

    function handleMouseLeave() {
        opacity.set(0);
        scale.set(1);
        rotateX.set(0);
        rotateY.set(0);
        rotateFigcaption.set(0);
        shadowOpacity.set(1);
        setHasShadow(true);
    }

    function handleTap(e: React.MouseEvent<HTMLElement>) {
        if (!ref.current || !imgRef.current) return;

        const rect = imgRef.current.getBoundingClientRect();
        const x = Math.floor(e.clientX - rect.left);
        const y = Math.floor(e.clientY - rect.top);

        // Check if clicked on transparent area
        if (isPixelTransparent(x, y)) {
            return; // Don't trigger click on transparent areas
        }

        scale.set(0.9);
        shadowOpacity.set(0);
        setHasShadow(false);

        setTimeout(() => {
            if (onClick) onClick();
        }, 150);
    }

    return (
        <figure
            ref={ref}
            className="relative w-full h-full [perspective:800px] flex flex-col items-center justify-center cursor-pointer"
            style={{
                height: containerHeight,
                width: containerWidth
            }}
            onMouseMove={handleMouse}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleTap}
        >
            {showMobileWarning && (
                <div className="absolute top-4 text-center text-sm block sm:hidden">
                    This effect is not optimized for mobile. Check on desktop.
                </div>
            )}

            {/* Hidden canvas for transparency detection */}
            <canvas
                ref={canvasRef}
                style={{ display: 'none' }}
            />

            <motion.div
                className="relative [transform-style:preserve-3d]"
                style={{
                    width: imageWidth,
                    height: imageHeight,
                    rotateX,
                    rotateY,
                    scale
                }}
            >
                <motion.img
                    ref={imgRef}
                    src={imageSrc}
                    alt={altText}
                    className="absolute top-0 left-0 object-contain will-change-transform [transform:translateZ(0)] pointer-events-none"
                    style={{
                        width: imageWidth,
                        height: imageHeight,
                    }}
                    animate={{
                        filter: hasShadow
                            ? 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3)) drop-shadow(0 5px 10px rgba(0, 0, 0, 0.2)) brightness(1)'
                            : 'drop-shadow(0 0 0 rgba(0, 0, 0, 0)) brightness(0.7)'
                    }}
                    transition={{
                        duration: 0.3,
                        ease: [0.16, 1, 0.3, 1]
                    }}
                    onLoad={(e) => {
                        // Draw image to canvas when loaded
                        const img = e.currentTarget;
                        const canvas = canvasRef.current;
                        if (canvas) {
                            canvas.width = img.naturalWidth;
                            canvas.height = img.naturalHeight;
                            const ctx = canvas.getContext('2d');
                            if (ctx) {
                                ctx.drawImage(img, 0, 0);
                            }
                        }
                    }}
                />

                {displayOverlayContent && overlayContent && (
                    <motion.div className="absolute top-0 left-0 z-[2] will-change-transform [transform:translateZ(30px)]">
                        {overlayContent}
                    </motion.div>
                )}
            </motion.div>

            {showTooltip && (
                <motion.figcaption
                    className="pointer-events-none absolute left-0 top-0 rounded-[4px] bg-white px-[10px] py-[4px] text-[10px] text-[#2d2d2d] opacity-0 z-[3] hidden sm:block"
                    style={{
                        x,
                        y,
                        opacity,
                        rotate: rotateFigcaption
                    }}
                >
                    {captionText}
                </motion.figcaption>
            )}
        </figure>
    );
}
