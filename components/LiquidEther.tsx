'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export interface LiquidEtherProps {
    mouseForce?: number;
    cursorSize?: number;
    isViscous?: boolean;
    viscous?: number;
    iterationsViscous?: number;
    iterationsPoisson?: number;
    dt?: number;
    BFECC?: boolean;
    resolution?: number;
    isBounce?: boolean;
    colors?: string[];
    style?: React.CSSProperties;
    className?: string;
    autoDemo?: boolean;
    autoSpeed?: number;
    autoIntensity?: number;
    takeoverDuration?: number;
    autoResumeDelay?: number;
    autoRampDuration?: number;
}

const defaultColors = ['#5227FF', '#FF9FFC', '#B19EEF'];

export default function LiquidEther({
    mouseForce = 20,
    cursorSize = 100,
    isViscous = false,
    viscous = 30,
    iterationsViscous = 32,
    iterationsPoisson = 32,
    dt = 0.014,
    BFECC = true,
    resolution = 0.5,
    isBounce = false,
    colors = defaultColors,
    style = {},
    className = '',
    autoDemo = true,
    autoSpeed = 0.5,
    autoIntensity = 2.2,
    takeoverDuration = 0.25,
    autoResumeDelay = 1000,
    autoRampDuration = 0.6
}: LiquidEtherProps): React.ReactElement {
    const mountRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // Placeholder - full implementation would go here
        // For now, just create a simple canvas
        const canvas = document.createElement('canvas');
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        mountRef.current.appendChild(canvas);

        return () => {
            if (canvas.parentNode) {
                canvas.parentNode.removeChild(canvas);
            }
        };
    }, []);

    return (
        <div
            ref={mountRef}
            className={`w-full h-full absolute inset-0 overflow-hidden pointer-events-none ${className || ''}`}
            style={style}
        />
    );
}
