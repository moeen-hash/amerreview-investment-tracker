import React from 'react';
import { Eye, Calendar, Clock, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import type { InvestmentItem } from '../types.ts';

interface InvestmentCardProps {
    item: InvestmentItem;
    onView: (id: string) => void;
    onDelete?: (id: string) => void;
}

const InvestmentCard: React.FC<InvestmentCardProps> = ({ item, onView, onDelete }) => {
    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', item.id);
        (e.target as HTMLElement).style.opacity = '0.5';
    };

    const handleDragEnd = (e: React.DragEvent) => {
        (e.target as HTMLElement).style.opacity = '1';
    };

    const formatDateDDMMYYYY = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <div
            className="clean-card investment-card"
            draggable="true"
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            style={{ 
                cursor: 'grab',
                transition: 'all 0.2s ease'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ 
                        fontSize: '0.9375rem', 
                        fontWeight: 600, 
                        color: 'var(--text-primary)',
                        marginBottom: '0.5rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>
                        {item.instrument}
                    </h4>
                    
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        gap: '0.25rem'
                    }}>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.35rem', 
                            color: 'var(--text-muted)', 
                            fontSize: '0.75rem' 
                        }}>
                            <Clock size={12} />
                            <span>Created: {formatDateDDMMYYYY(item.creationDate)}</span>
                        </div>
                        
                        {item.followUpTime && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                color: 'var(--text-primary)',
                                fontSize: '0.75rem',
                                fontWeight: 500
                            }}>
                                <Calendar size={12} />
                                <span>Follow up: {item.followUpTime}</span>
                            </div>
                        )}
                    </div>
                </div>
                
                <div style={{ display: 'flex', gap: '0.375rem', flexShrink: 0 }}>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onView(item.id);
                        }}
                        style={{ 
                            color: 'var(--accent-primary)',
                            background: 'rgba(0, 102, 255, 0.1)',
                            padding: '0.5rem',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = 'rgba(0, 102, 255, 0.2)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = 'rgba(0, 102, 255, 0.1)';
                        }}
                    >
                        <Eye size={16} />
                    </button>
                    
                    {onDelete && (
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm('Are you sure you want to delete this investment?')) {
                                    onDelete(item.id);
                                }
                            }}
                            style={{ 
                                color: 'var(--danger)',
                                background: 'rgba(239, 68, 68, 0.1)',
                                padding: '0.5rem',
                                borderRadius: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                            }}
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InvestmentCard;
