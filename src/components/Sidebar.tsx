import React from 'react';
import { LayoutDashboard, PlusCircle, FolderOpen, LogOut } from 'lucide-react';

interface HeaderProps {
    activePage: string;
    setActivePage: (page: 'panel' | 'create' | 'archive') => void;
    onSignOut: () => void;
}

const Header: React.FC<HeaderProps> = ({ activePage, setActivePage, onSignOut }) => {
    const navItems = [
        { id: 'panel', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'create', label: 'Create Item', icon: PlusCircle },
        { id: 'archive', label: 'Archive', icon: FolderOpen },
    ];

    return (
        <header style={{
            height: 'var(--header-height)',
            background: 'var(--header-bg)',
            borderBottom: '1px solid var(--border-color)',
            position: 'sticky',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            padding: '0 2rem',
            gap: '2rem'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img src="/Group 1.png" alt="AmerFX Logo" style={{ height: '36px', width: 'auto' }} />
            </div>

            <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePage === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActivePage(item.id as any)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.625rem 1rem',
                                borderRadius: '8px',
                                color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                background: isActive ? 'var(--accent-bg)' : 'transparent',
                                transition: 'all 0.2s ease',
                                fontWeight: isActive ? 600 : 500,
                                fontSize: '0.9375rem'
                            }}
                            onMouseOver={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.background = 'var(--hover-bg)';
                                    e.currentTarget.style.color = 'var(--text-primary)';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = 'var(--text-secondary)';
                                }
                            }}
                        >
                            <Icon size={18} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button 
                    onClick={onSignOut}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.625rem 1rem',
                        color: 'var(--danger)',
                        borderRadius: '8px',
                        transition: 'all 0.2s ease',
                        fontSize: '0.9375rem',
                        fontWeight: 500
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.background = 'transparent';
                    }}
                >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                </button>
            </div>
        </header>
    );
};

export default Header;
