import React, { useState, useEffect } from 'react';
import Header from './Sidebar.tsx';
import Panel from './Panel.tsx';
import CreateItemPage from './CreateItemPage.tsx';
import ArchivePage from './ArchivePage.tsx';
import ViewItemPage from './ViewItemPage.tsx';
import LoginPage from './LoginPage.tsx';
import type { InvestmentItem } from '../types.ts';
import * as api from '../services/api';

const Dashboard: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [activePage, setActivePage] = useState<'panel' | 'create' | 'archive'>('panel');
    const [items, setItems] = useState<{
        followUp: InvestmentItem[];
        executed: InvestmentItem[];
        closed: InvestmentItem[];
        archive: InvestmentItem[];
    }>({
        followUp: [],
        executed: [],
        closed: [],
        archive: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewingItem, setViewingItem] = useState<InvestmentItem | null>(null);

    // Check authentication on mount
    useEffect(() => {
        const authStatus = localStorage.getItem('isAuthenticated');
        if (authStatus === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    // Load items from API on mount
    useEffect(() => {
        if (isAuthenticated) {
            loadItems();
        }
    }, [isAuthenticated]);

    const loadItems = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.getAllItems();
            setItems(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load items');
            console.error('Error loading items:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateItem = async (newItem: Omit<InvestmentItem, 'id' | 'creationDate' | 'status'>) => {
        try {
            setError(null);
            const createdItem = await api.createItem(newItem);
            
            setItems(prev => ({
                ...prev,
                followUp: [createdItem, ...prev.followUp]
            }));
            setActivePage('panel');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create item');
            console.error('Error creating item:', err);
        }
    };

    const handleUpdateItems = (updatedItems: typeof items) => {
        setItems(updatedItems);
    };

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    // Show login page if not authenticated
    if (!isAuthenticated) {
        return <LoginPage onLogin={handleLogin} />;
    }

    const handleSignOut = () => {
        localStorage.removeItem('isAuthenticated');
        setIsAuthenticated(false);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <Header activePage={activePage} setActivePage={setActivePage} onSignOut={handleSignOut} />

            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-secondary)', padding: '2rem' }}>
                {error && (
                    <div style={{
                        background: '#fee',
                        color: '#c33',
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        border: '1px solid #fcc'
                    }}>
                        ⚠️ {error}
                    </div>
                )}
                
                {loading ? (
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        height: '50vh',
                        fontSize: '1.2rem',
                        color: 'var(--text-muted)'
                    }}>
                        Loading...
                    </div>
                ) : (
                    <>
                        {activePage === 'panel' && (
                            <Panel 
                                items={items} 
                                setItems={handleUpdateItems} 
                                onCreateItem={() => setActivePage('create')}
                                refreshItems={loadItems}
                            />
                        )}
                        {activePage === 'create' && (
                            <CreateItemPage onCreate={handleCreateItem} />
                        )}
                        {activePage === 'archive' && (
                            <ArchivePage 
                                items={items.archive}
                                onDelete={async (id) => {
                                    try {
                                        await api.deleteItem(id);
                                        setItems(prev => ({
                                            ...prev,
                                            archive: prev.archive.filter(item => item.id !== id)
                                        }));
                                    } catch (err) {
                                        console.error('Error deleting item:', err);
                                    }
                                }}
                                onView={(id) => {
                                    const item = items.archive.find(item => item.id === id);
                                    if (item) {
                                        setViewingItem(item);
                                    }
                                }}
                            />
                        )}
                    </>
                )}
            </main>

            {viewingItem && (
                <ViewItemPage
                    item={viewingItem}
                    onClose={() => setViewingItem(null)}
                    onEdit={() => {
                        // Could implement edit functionality if needed
                        console.log('Edit archived item');
                    }}
                    onMove={async (newStatus) => {
                        try {
                            const updatedItem = await api.updateItemStatus(viewingItem.id, newStatus);
                            setItems(prev => {
                                const newItems = { ...prev };
                                // Remove from archive
                                newItems.archive = prev.archive.filter(item => item.id !== viewingItem.id);
                                // Add to new status
                                if (newStatus === 'followUp') {
                                    newItems.followUp = [...prev.followUp, updatedItem];
                                } else if (newStatus === 'executed') {
                                    newItems.executed = [...prev.executed, updatedItem];
                                } else if (newStatus === 'closed') {
                                    newItems.closed = [...prev.closed, updatedItem];
                                }
                                return newItems;
                            });
                            setViewingItem(null);
                        } catch (err) {
                            console.error('Error moving item:', err);
                        }
                    }}
                />
            )}
        </div>
    );
};

export default Dashboard;
