'use client';

import { useRouter } from 'next/navigation';
import { Home, Cake, Grid3x3 } from 'lucide-react';
import Dock, { type DockItemData } from './Dock';

export default function NavigationDock() {
    const router = useRouter();

    const dockItems: DockItemData[] = [
        {
            icon: <Home size={20} />,
            label: 'Home',
            onClick: () => router.push('/')
        },
        {
            icon: <Grid3x3 size={20} />,
            label: 'Hub',
            onClick: () => router.push('/hub')
        },
        {
            icon: <Cake size={20} />,
            label: 'Cake',
            onClick: () => router.push('/cake')
        }
    ];

    return <Dock items={dockItems} />;
}
