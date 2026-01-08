import React from 'react';
import { PlusCircle } from 'lucide-react';
import InvestmentCard from './InvestmentCard.tsx';
import type { InvestmentItem } from '../types.ts';

interface BoardColumnProps {
    title: string;
    items: InvestmentItem[];
    onView: (id: string) => void;
    onCreate?: () => void;
    onDrop?: (itemId: string) => void;
    status: InvestmentItem['status'];
    onDelete?: (id: string) => void;
}

const BoardColumn: React.FC<BoardColumnProps> = ({ title, items, onView, onCreate, onDrop, status, onDelete }) => {
    const [isDragOver, setIsDragOver] = React.useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        if (e.currentTarget === e.target) {
            setIsDragOver(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const itemId = e.dataTransfer.getData('text/plain');
        if (onDrop && itemId) {
            onDrop(itemId);
        }
    };

    return (
        <div 
            className="board-column"
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
                background: isDragOver ? 'rgba(0, 102, 255, 0.05)' : 'var(--bg-secondary)',
                transition: 'background 0.2s ease'
            }}
        >
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {title}
                        <span style={{
                            background: 'var(--bg-tertiary)',
                            padding: '2px 8px',
                            borderRadius: '10px',
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)'
                        }}>{items.length}</span>
                    </div>
                    {onCreate && (
                        <button
                            onClick={onCreate}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                padding: '0.375rem 0.625rem',
                                background: 'var(--accent-primary)',
                                color: 'white',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 500,
                                transition: 'all 0.2s ease',
                                cursor: 'pointer'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                        >
                            <PlusCircle size={14} />
                            Create
                        </button>
                    )}
                </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, overflowY: 'auto' }}>
                {items.map(item => (
                    <InvestmentCard key={item.id} item={item} onView={onView} onDelete={onDelete} />
                ))}
                {items.length === 0 && (
                    <div style={{
                        padding: '2rem',
                        textAlign: 'center',
                        color: 'var(--text-muted)',
                        fontSize: '0.875rem',
                        border: '2px dashed var(--border-color)',
                        borderRadius: '12px'
                    }}>
                        No items here
                    </div>
                )}
            </div>
        </div>
    );
};

export default BoardColumn;
