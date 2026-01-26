'use client';

import { useRouter } from 'next/navigation';
import { Home, Cake, Grid3x3 } from 'lucide-react';
import Dock, { type DockItemData } from './Dock';

export default function NavigationDock() {
    const router = useRouter();

    const dockItems: DockItemData[] = [
        {
            id: 'home',
            icon: Home,
            label: 'Home',
            onClick: () => router.push('/')
        },
        {
            id: 'hub',
            icon: Grid3x3,
            label: 'Hub',
            onClick: () => router.push('/hub')
        },
        {
            id: 'cake',
            icon: Cake,
            label: 'Cake',
            onClick: () => router.push('/cake')
        }
    ];

    return <Dock items={dockItems} />;
}
