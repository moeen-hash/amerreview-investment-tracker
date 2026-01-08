import React from 'react';
import type { InvestmentItem } from '../types';
import { Archive, Eye, Trash2 } from 'lucide-react';

interface ArchivePageProps {
    items: InvestmentItem[];
    onDelete: (id: string) => void;
    onView: (id: string) => void;
}

const ArchivePage: React.FC<ArchivePageProps> = ({ items, onDelete, onView }) => {

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
        } catch (e) {
            return dateString;
        }
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '2rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid var(--border-color)'
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: 'rgba(234, 179, 8, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--warning)'
                }}>
                    <Archive size={24} />
                </div>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Archive</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        {items.length} {items.length === 1 ? 'item' : 'items'} archived
                    </p>
                </div>
            </div>

            {items.length === 0 ? (
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-secondary)',
                    gap: '1rem'
                }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        background: 'var(--bg-tertiary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-muted)'
                    }}>
                        <Archive size={32} />
                    </div>
                    <p style={{ fontSize: '1.125rem', fontWeight: 500 }}>No items in archive</p>
                </div>
            ) : (
                <div style={{
                    background: 'var(--card-bg)',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    overflow: 'hidden'
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Instrument</th>
                                <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Created Date</th>
                                <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Status</th>
                                <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '1rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                                        {item.instrument}
                                    </td>
                                    <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                        {formatDate(item.creationDate)}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '999px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            background: 'rgba(234, 179, 8, 0.1)',
                                            color: 'var(--warning)'
                                        }}>
                                            Archived
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <button
                                                onClick={() => onView(item.id)}
                                                style={{
                                                    padding: '0.5rem',
                                                    borderRadius: '6px',
                                                    color: 'var(--accent-primary)',
                                                    background: 'rgba(0, 102, 255, 0.1)',
                                                    transition: 'all 0.2s'
                                                }}
                                                title="View Details"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (window.confirm('Are you sure you want to delete this archived item?')) {
                                                        onDelete(item.id);
                                                    }
                                                }}
                                                style={{
                                                    padding: '0.5rem',
                                                    borderRadius: '6px',
                                                    color: 'var(--danger)',
                                                    background: 'rgba(239, 68, 68, 0.1)',
                                                    transition: 'all 0.2s'
                                                }}
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ArchivePage;
