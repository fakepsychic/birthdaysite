'use client';

import { useRouter } from 'next/navigation';
import Dock from '@/components/Dock';
import { Home, Cake, Grid3x3 } from 'lucide-react';

export default function DockNavigation() {
    const router = useRouter();

    const dockItems = [
        {
            icon: <Home size={24} strokeWidth={2} color="white" />,
            label: 'Welcome',
            onClick: () => router.push('/')
        },
        {
            icon: <Grid3x3 size={24} strokeWidth={2} color="white" />,
            label: 'Hub',
            onClick: () => router.push('/hub')
        },
        {
            icon: <Cake size={24} strokeWidth={2} color="white" />,
            label: 'Cake',
            onClick: () => router.push('/cake')
        }
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
            <div className="pointer-events-auto">
                <Dock
                    items={dockItems}
                    magnification={70}
                    distance={150}
                    baseItemSize={50}
                    panelHeight={64}
                />
            </div>
        </div>
    );
}
