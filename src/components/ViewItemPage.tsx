import React, { useState } from 'react';
import { X, Edit2, Archive } from 'lucide-react';
import type { InvestmentItem } from '../types.ts';

interface ViewItemPageProps {
    item: InvestmentItem;
    onClose: () => void;
    onEdit: () => void;
    onMove: (status: InvestmentItem['status']) => void;
}

const ViewItemPage: React.FC<ViewItemPageProps> = ({ item, onClose, onEdit, onMove }) => {

    const [showImageModal, setShowImageModal] = useState(false);
    const [modalImageSrc, setModalImageSrc] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'followUp' | 'executed' | 'closed' | 'summary'>('followUp');

    const formatDateDDMMYYYY = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <>
            <div style={{
                width: '100%',
                height: '100vh',
                background: 'var(--bg-secondary)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                position: 'fixed',
                top: 'var(--header-height)',
                left: 0,
                right: 0
            }}>
                <header style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid var(--border-color)',
                    padding: '0.5rem 1rem',
                    flexShrink: 0,
                    minHeight: '40px'
                }}>
                    <button onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
                        <X size={20} />
                        <span style={{ fontWeight: 500 }}>Back to Board</span>
                    </button>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button
                            onClick={onEdit}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                background: 'var(--card-bg)',
                                padding: '0.625rem 1rem',
                                borderRadius: '8px',
                                border: '1px solid var(--border-color)',
                                color: 'var(--text-primary)',
                                fontSize: '0.875rem',
                                fontWeight: 500
                            }}
                        >
                            <Edit2 size={16} />
                            Edit
                        </button>

                        <button
                            onClick={() => onMove('archive')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                background: 'rgba(239, 68, 68, 0.1)',
                                color: 'var(--danger)',
                                padding: '0.625rem 1rem',
                                borderRadius: '8px',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                            }}
                        >
                            <Archive size={16} />
                            Move to Archive
                        </button>
                    </div>
                </header>

                {/* Tabs for Executed Items */}
                {item.status === 'executed' && (
                    <div style={{ padding: '0 1rem', flexShrink: 0 }}>
                        <div style={{
                            display: 'inline-flex',
                            background: 'var(--card-bg)',
                            borderRadius: '10px',
                            padding: '0.25rem',
                            gap: '0.25rem',
                            border: '1px solid var(--border-color)'
                        }}>
                            <button
                                onClick={() => setActiveTab('followUp')}
                                style={{
                                    padding: '0.625rem 1.25rem',
                                    borderRadius: '8px',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    background: activeTab === 'followUp' ? 'var(--accent-primary)' : 'transparent',
                                    color: activeTab === 'followUp' ? 'white' : 'var(--text-secondary)',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Follow Up Analysis
                            </button>
                            <button
                                onClick={() => setActiveTab('executed')}
                                style={{
                                    padding: '0.625rem 1.25rem',
                                    borderRadius: '8px',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    background: activeTab === 'executed' ? 'var(--success)' : 'transparent',
                                    color: activeTab === 'executed' ? 'white' : 'var(--text-secondary)',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Executed Analysis
                            </button>
                        </div>
                    </div>
                )}

                {/* Tabs for Closed Items - Show all three tabs */}
                {item.status === 'closed' && (
                    <div style={{ padding: '0.5rem 1rem', flexShrink: 0 }}>
                        <div style={{
                            display: 'inline-flex',
                            background: 'var(--card-bg)',
                            borderRadius: '10px',
                            padding: '0.25rem',
                            gap: '0.25rem',
                            border: '1px solid var(--border-color)'
                        }}>
                            <button
                                onClick={() => setActiveTab('followUp')}
                                style={{
                                    padding: '0.625rem 1.25rem',
                                    borderRadius: '8px',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    background: activeTab === 'followUp' ? 'var(--accent-primary)' : 'transparent',
                                    color: activeTab === 'followUp' ? 'white' : 'var(--text-secondary)',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Follow Up Analysis
                            </button>
                            <button
                                onClick={() => setActiveTab('executed')}
                                style={{
                                    padding: '0.625rem 1.25rem',
                                    borderRadius: '8px',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    background: activeTab === 'executed' ? 'var(--success)' : 'transparent',
                                    color: activeTab === 'executed' ? 'white' : 'var(--text-secondary)',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Executed Analysis
                            </button>
                            <button
                                onClick={() => setActiveTab('closed')}
                                style={{
                                    padding: '0.625rem 1.25rem',
                                    borderRadius: '8px',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    background: activeTab === 'closed' ? 'var(--danger)' : 'transparent',
                                    color: activeTab === 'closed' ? 'white' : 'var(--text-secondary)',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Closed Analysis
                            </button>
                            <button
                                onClick={() => setActiveTab('summary')}
                                style={{
                                    padding: '0.625rem 1.25rem',
                                    borderRadius: '8px',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    background: activeTab === 'summary' ? 'var(--warning)' : 'transparent',
                                    color: activeTab === 'summary' ? 'white' : 'var(--text-secondary)',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Summary
                            </button>
                        </div>
                    </div>
                )}

                {/* Summary View - Full Width Layout */}
                {activeTab === 'summary' ? (
                    <div style={{ padding: '1rem', overflowY: 'auto', flex: 1 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 0.8fr', gap: '1.5rem', height: '100%' }}>
                            {/* Position Overview */}
                            <div style={{ overflowY: 'auto' }}>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem' }}>Position Overview</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '0.75rem', fontSize: '0.9375rem' }}>
                                    <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Instrument:</span>
                                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{item.instrument}</span>

                                    <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Created:</span>
                                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{formatDateDDMMYYYY(item.creationDate)}</span>

                                    {item.executedDate && (
                                        <>
                                            <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Execute Date:</span>
                                            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{formatDateDDMMYYYY(item.executedDate)}</span>
                                        </>
                                    )}

                                    {item.openPrice && (
                                        <>
                                            <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Open Price:</span>
                                            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{item.openPrice}</span>
                                        </>
                                    )}

                                    {item.openReason && (
                                        <>
                                            <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Open Reason:</span>
                                            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{item.openReason}</span>
                                        </>
                                    )}

                                    {item.closedDate && (
                                        <>
                                            <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Closed Date:</span>
                                            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{formatDateDDMMYYYY(item.closedDate)}</span>
                                        </>
                                    )}

                                    {item.closePrice && (
                                        <>
                                            <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Close Price:</span>
                                            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{item.closePrice}</span>
                                        </>
                                    )}

                                    {item.closeReason && (
                                        <>
                                            <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Close Reason:</span>
                                            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{item.closeReason}</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Analysis Timeline */}
                            <div style={{ overflowY: 'auto' }}>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem' }}>Analysis Timeline</h3>

                                {item.analysisPoints && item.analysisPoints.length > 0 && (
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.75rem' }}>Follow Up Analysis</div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                                            {item.analysisPoints.map((point, index) => (
                                                <div key={index}>
                                                    <div style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.375rem', color: 'var(--text-primary)' }}>{index + 1}. {point.headline}</div>
                                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{point.description}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {item.executedAnalysis && item.executedAnalysis.length > 0 && (
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.75rem' }}>Executed Analysis</div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                                            {item.executedAnalysis.map((point, index) => (
                                                <div key={index}>
                                                    <div style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.375rem', color: 'var(--text-primary)' }}>{index + 1}. {point.headline}</div>
                                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{point.description}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {item.closedAnalysis && item.closedAnalysis.length > 0 && (
                                    <div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.75rem' }}>Closed Analysis</div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                                            {item.closedAnalysis.map((point, index) => (
                                                <div key={index}>
                                                    <div style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.375rem', color: 'var(--text-primary)' }}>{index + 1}. {point.headline}</div>
                                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{point.description}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Charts Timeline */}
                            <div>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem' }}>Chart Timeline</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {item.image && (
                                        <div>
                                            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.375rem' }}>Follow Up Chart</div>
                                            <img
                                                src={item.image}
                                                alt="Follow Up"
                                                onClick={() => { setModalImageSrc(item.image || ''); setShowImageModal(true); }}
                                                style={{ width: '100%', height: '140px', objectFit: 'contain', borderRadius: '8px', border: '1px solid var(--border-color)', cursor: 'pointer', transition: 'transform 0.2s', background: 'var(--bg-tertiary)' }}
                                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                            />
                                        </div>
                                    )}
                                    {item.executedImage && (
                                        <div>
                                            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.375rem' }}>Executed Chart</div>
                                            <img
                                                src={item.executedImage}
                                                alt="Executed"
                                                onClick={() => { setModalImageSrc(item.executedImage || ''); setShowImageModal(true); }}
                                                style={{ width: '100%', height: '140px', objectFit: 'contain', borderRadius: '8px', border: '1px solid var(--border-color)', cursor: 'pointer', transition: 'transform 0.2s', background: 'var(--bg-tertiary)' }}
                                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                            />
                                        </div>
                                    )}
                                    {item.closedImage && (
                                        <div>
                                            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.375rem' }}>Closed Chart</div>
                                            <img
                                                src={item.closedImage}
                                                alt="Closed"
                                                onClick={() => { setModalImageSrc(item.closedImage || ''); setShowImageModal(true); }}
                                                style={{ width: '100%', height: '140px', objectFit: 'contain', borderRadius: '8px', border: '1px solid var(--border-color)', cursor: 'pointer', transition: 'transform 0.2s', background: 'var(--bg-tertiary)' }}
                                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', height: 'calc(100vh - var(--header-height) - 8rem)', maxHeight: 'calc(100vh - var(--header-height) - 8rem)', overflow: 'hidden', padding: '0.5rem 1rem' }}>
                        {/* First Card - Instrument Info */}
                        <div className="clean-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflow: 'hidden' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', flexShrink: 0 }}>
                                Investment Details
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', paddingRight: '0.5rem', flex: 1 }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                        Instrument
                                    </label>
                                    <input
                                        type="text"
                                        value={item.instrument}
                                        readOnly
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: '1px solid var(--border-color)',
                                            borderRadius: '8px',
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            color: 'var(--text-primary)',
                                            background: 'var(--bg-tertiary)',
                                            cursor: 'default'
                                        }}
                                    />
                                </div>

                                {/* Show Created field only on followUp tab OR if not executed/closed status */}
                                {(activeTab === 'followUp' || (item.status !== 'executed' && item.status !== 'closed')) && (
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                            Created
                                        </label>
                                        <input
                                            type="text"
                                            value={formatDateDDMMYYYY(item.creationDate)}
                                            readOnly
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                border: '1px solid var(--border-color)',
                                                borderRadius: '8px',
                                                fontSize: '0.9375rem',
                                                color: 'var(--text-primary)',
                                                background: 'var(--bg-tertiary)',
                                                cursor: 'default'
                                            }}
                                        />
                                    </div>
                                )}

                                {/* Show follow-up date for followUp tab OR if not executed/closed status */}
                                {(activeTab === 'followUp' || (item.status !== 'executed' && item.status !== 'closed')) && (
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                            Follow-up
                                        </label>
                                        <input
                                            type="text"
                                            value={`${item.followUpDate} ${item.followUpTime}`}
                                            readOnly
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                border: '1px solid var(--border-color)',
                                                borderRadius: '8px',
                                                fontSize: '0.9375rem',
                                                fontWeight: 500,
                                                color: 'var(--text-primary)',
                                                background: 'var(--bg-tertiary)',
                                                cursor: 'default'
                                            }}
                                        />
                                    </div>
                                )}

                                {/* Show executed data if on executed tab and data exists */}
                                {activeTab === 'executed' && item.executedDate && (
                                    <>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                                Executed Date
                                            </label>
                                            <input
                                                type="text"
                                                value={formatDateDDMMYYYY(item.executedDate)}
                                                readOnly
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem',
                                                    border: '1px solid var(--border-color)',
                                                    borderRadius: '8px',
                                                    fontSize: '0.9375rem',
                                                    fontWeight: 600,
                                                    color: 'var(--text-primary)',
                                                    background: 'var(--bg-tertiary)',
                                                    cursor: 'default'
                                                }}
                                            />
                                        </div>

                                        {item.openPrice && (
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                                    Open Price
                                                </label>
                                                <input
                                                    type="text"
                                                    value={item.openPrice}
                                                    readOnly
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.75rem',
                                                        border: '1px solid var(--border-color)',
                                                        borderRadius: '8px',
                                                        fontSize: '0.9375rem',
                                                        fontWeight: 600,
                                                        color: 'var(--text-primary)',
                                                        background: 'var(--bg-tertiary)',
                                                        cursor: 'default'
                                                    }}
                                                />
                                            </div>
                                        )}

                                        {item.openReason && (
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                                    Open Reason
                                                </label>
                                                <textarea
                                                    value={item.openReason}
                                                    readOnly
                                                    rows={2}
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.75rem',
                                                        border: '1px solid var(--border-color)',
                                                        borderRadius: '8px',
                                                        fontSize: '0.875rem',
                                                        color: 'var(--text-secondary)',
                                                        lineHeight: '1.6',
                                                        background: 'var(--bg-tertiary)',
                                                        cursor: 'default',
                                                        resize: 'none'
                                                    }}
                                                />
                                            </div>
                                        )}

                                        {item.executedFollowUpDate && (
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                                    New Follow-up
                                                </label>
                                                <input
                                                    type="text"
                                                    value={`${item.executedFollowUpDate} ${item.executedFollowUpTime || ''}`}
                                                    readOnly
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.75rem',
                                                        border: '1px solid var(--border-color)',
                                                        borderRadius: '8px',
                                                        fontSize: '0.9375rem',
                                                        fontWeight: 500,
                                                        color: 'var(--text-primary)',
                                                        background: 'var(--bg-tertiary)',
                                                        cursor: 'default'
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* Show closed data if on closed tab */}
                                {item.status === 'closed' && activeTab === 'closed' && item.closedDate && (
                                    <>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                                Closed Date
                                            </label>
                                            <input
                                                type="text"
                                                value={formatDateDDMMYYYY(item.closedDate)}
                                                readOnly
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem',
                                                    border: '1px solid var(--border-color)',
                                                    borderRadius: '8px',
                                                    fontSize: '0.9375rem',
                                                    fontWeight: 600,
                                                    color: 'var(--text-primary)',
                                                    background: 'var(--bg-tertiary)',
                                                    cursor: 'default'
                                                }}
                                            />
                                        </div>

                                        {item.closePrice && (
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                                    Close Price
                                                </label>
                                                <input
                                                    type="text"
                                                    value={item.closePrice}
                                                    readOnly
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.75rem',
                                                        border: '1px solid var(--border-color)',
                                                        borderRadius: '8px',
                                                        fontSize: '0.9375rem',
                                                        fontWeight: 600,
                                                        color: 'var(--text-primary)',
                                                        background: 'var(--bg-tertiary)',
                                                        cursor: 'default'
                                                    }}
                                                />
                                            </div>
                                        )}

                                        {item.closeReason && (
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                                    Close Reason
                                                </label>
                                                <textarea
                                                    value={item.closeReason}
                                                    readOnly
                                                    rows={2}
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.75rem',
                                                        border: '1px solid var(--border-color)',
                                                        borderRadius: '8px',
                                                        fontSize: '0.875rem',
                                                        color: 'var(--text-secondary)',
                                                        lineHeight: '1.6',
                                                        background: 'var(--bg-tertiary)',
                                                        cursor: 'default',
                                                        resize: 'none'
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Second Card - Chart Image */}
                        <div className="clean-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflow: 'hidden' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', flexShrink: 0 }}>
                                Chart Image
                            </h3>
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                {/* Chart Image - Show based on tab */}
                                {((item.status !== 'executed' && item.status !== 'closed') || activeTab === 'followUp') && item.image && (
                                    <div
                                        onClick={() => setShowImageModal(true)}
                                        style={{
                                            background: 'var(--card-bg)',
                                            borderRadius: '12px',
                                            padding: '1rem',
                                            boxShadow: 'var(--shadow-sm)',
                                            border: '1px solid var(--border-color)',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.instrument}
                                            style={{
                                                width: '100%',
                                                height: 'auto',
                                                borderRadius: '8px',
                                                display: 'block'
                                            }}
                                        />
                                    </div>
                                )}

                                {/* Executed Chart Image - Show on executed tab */}
                                {activeTab === 'executed' && item.executedImage && (
                                    <div
                                        onClick={() => setShowImageModal(true)}
                                        style={{
                                            background: 'var(--card-bg)',
                                            borderRadius: '12px',
                                            padding: '1rem',
                                            boxShadow: 'var(--shadow-sm)',
                                            border: '1px solid var(--border-color)',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--success)' }}>
                                            Executed Chart
                                        </label>
                                        <img
                                            src={item.executedImage}
                                            alt={`${item.instrument} - Executed`}
                                            style={{
                                                width: '100%',
                                                height: 'auto',
                                                borderRadius: '8px',
                                                display: 'block'
                                            }}
                                        />
                                    </div>
                                )}

                                {/* Closed Chart Image - Show on closed tab */}
                                {activeTab === 'closed' && item.closedImage && (
                                    <div
                                        onClick={() => setShowImageModal(true)}
                                        style={{
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            width: '100%',
                                            height: 'auto',
                                            borderRadius: '8px',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <img
                                            src={item.closedImage}
                                            alt={`${item.instrument} - Closed`}
                                            style={{
                                                width: '100%',
                                                height: 'auto',
                                                borderRadius: '8px',
                                                display: 'block'
                                            }}
                                        />
                                    </div>
                                )}

                                {!((item.status !== 'executed' && item.status !== 'closed') || activeTab === 'followUp') &&
                                    !item.image && !(activeTab === 'executed' && item.executedImage) &&
                                    !(activeTab === 'closed' && item.closedImage) && (
                                        <div style={{
                                            flex: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'var(--text-muted)',
                                            fontSize: '0.875rem'
                                        }}>
                                            No image available
                                        </div>
                                    )}
                            </div>
                        </div>

                        {/* Third Card - Analysis based on tab */}
                        <div className="clean-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflow: 'hidden' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', flexShrink: 0 }}>
                                {activeTab === 'followUp' ? 'Follow Up Analysis' :
                                    activeTab === 'executed' ? 'Executed Analysis' :
                                        activeTab === 'closed' ? 'Closed Analysis' : 'Position Summary'}
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', flex: 1, paddingRight: '0.5rem' }}>
                                {/* Show Original Analysis for followUp tab */}
                                {activeTab === 'followUp' && (
                                    <>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            marginBottom: '0.5rem'
                                        }}>
                                            <div style={{
                                                width: '4px',
                                                height: '28px',
                                                background: 'var(--accent-primary)',
                                                borderRadius: '2px'
                                            }} />
                                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>Analysis</h2>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                            {item.analysisPoints.map((point, index) => (
                                                <div key={index} style={{
                                                    background: 'var(--card-bg)',
                                                    borderRadius: '12px',
                                                    padding: '1.5rem',
                                                    boxShadow: 'var(--shadow-sm)',
                                                    border: '1px solid var(--border-color)',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '1rem'
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                        <div style={{
                                                            width: '32px',
                                                            height: '32px',
                                                            borderRadius: '50%',
                                                            background: 'var(--accent-bg)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontWeight: 700,
                                                            fontSize: '0.875rem',
                                                            color: 'var(--accent-primary)',
                                                            flexShrink: 0
                                                        }}>
                                                            {index + 1}
                                                        </div>
                                                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                                            Analysis Point {index + 1}
                                                        </label>
                                                    </div>
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                                            Headline
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={point.headline}
                                                            readOnly
                                                            style={{
                                                                width: '100%',
                                                                padding: '0.75rem',
                                                                border: '1px solid var(--border-color)',
                                                                borderRadius: '8px',
                                                                fontSize: '0.9375rem',
                                                                fontWeight: 600,
                                                                color: 'var(--text-primary)',
                                                                background: 'var(--bg-tertiary)',
                                                                cursor: 'default'
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                                            Description
                                                        </label>
                                                        <textarea
                                                            value={point.description}
                                                            readOnly
                                                            rows={3}
                                                            style={{
                                                                width: '100%',
                                                                padding: '0.75rem',
                                                                border: '1px solid var(--border-color)',
                                                                borderRadius: '8px',
                                                                fontSize: '0.875rem',
                                                                color: 'var(--text-secondary)',
                                                                lineHeight: '1.6',
                                                                background: 'var(--bg-tertiary)',
                                                                cursor: 'default',
                                                                resize: 'none'
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {/* Show Executed Analysis for executed tab */}
                                {activeTab === 'executed' && (
                                    <>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            marginBottom: '0.5rem'
                                        }}>
                                            <div style={{
                                                width: '4px',
                                                height: '28px',
                                                background: 'var(--accent-primary)',
                                                borderRadius: '2px'
                                            }} />
                                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>Executed Analysis</h2>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                            {(item.executedAnalysis && item.executedAnalysis.length > 0) ? (
                                                item.executedAnalysis.map((point, index) => (
                                                    <div key={index} style={{
                                                        background: 'var(--card-bg)',
                                                        borderRadius: '12px',
                                                        padding: '1.5rem',
                                                        boxShadow: 'var(--shadow-sm)',
                                                        border: '1px solid var(--border-color)',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: '1rem'
                                                    }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                            <div style={{
                                                                width: '32px',
                                                                height: '32px',
                                                                borderRadius: '50%',
                                                                background: 'var(--accent-bg)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                fontWeight: 700,
                                                                fontSize: '0.875rem',
                                                                color: 'var(--accent-primary)',
                                                                flexShrink: 0
                                                            }}>
                                                                {index + 1}
                                                            </div>
                                                            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                                                Executed Point {index + 1}
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                                                Headline
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={point.headline}
                                                                readOnly
                                                                style={{
                                                                    width: '100%',
                                                                    padding: '0.75rem',
                                                                    border: '1px solid var(--border-color)',
                                                                    borderRadius: '8px',
                                                                    fontSize: '0.9375rem',
                                                                    fontWeight: 600,
                                                                    color: 'var(--text-primary)',
                                                                    background: 'var(--bg-tertiary)',
                                                                    cursor: 'default'
                                                                }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                                                Description
                                                            </label>
                                                            <textarea
                                                                value={point.description}
                                                                readOnly
                                                                rows={3}
                                                                style={{
                                                                    width: '100%',
                                                                    padding: '0.75rem',
                                                                    border: '1px solid var(--border-color)',
                                                                    borderRadius: '8px',
                                                                    fontSize: '0.875rem',
                                                                    color: 'var(--text-secondary)',
                                                                    lineHeight: '1.6',
                                                                    background: 'var(--bg-tertiary)',
                                                                    cursor: 'default',
                                                                    resize: 'none'
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div style={{
                                                    background: 'var(--card-bg)',
                                                    borderRadius: '12px',
                                                    padding: '3rem',
                                                    textAlign: 'center',
                                                    border: '1px solid var(--border-color)'
                                                }}>
                                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
                                                        No executed analysis added yet
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}

                                {/* Show Closed Analysis for closed tab */}
                                {activeTab === 'closed' && (
                                    <>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            marginBottom: '0.5rem'
                                        }}>
                                            <div style={{
                                                width: '4px',
                                                height: '28px',
                                                background: 'var(--danger)',
                                                borderRadius: '2px'
                                            }} />
                                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>Closed Analysis</h2>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                            {(item.closedAnalysis && item.closedAnalysis.length > 0) ? (
                                                item.closedAnalysis.map((point, index) => (
                                                    <div key={index} style={{
                                                        background: 'var(--card-bg)',
                                                        borderRadius: '12px',
                                                        padding: '1.5rem',
                                                        boxShadow: 'var(--shadow-sm)',
                                                        border: '1px solid var(--border-color)',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: '1rem'
                                                    }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                            <div style={{
                                                                width: '32px',
                                                                height: '32px',
                                                                borderRadius: '50%',
                                                                background: 'var(--accent-bg)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                fontWeight: 700,
                                                                fontSize: '0.875rem',
                                                                color: 'var(--accent-primary)',
                                                                flexShrink: 0
                                                            }}>
                                                                {index + 1}
                                                            </div>
                                                            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                                                Closed Point {index + 1}
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                                                Headline
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={point.headline}
                                                                readOnly
                                                                style={{
                                                                    width: '100%',
                                                                    padding: '0.75rem',
                                                                    border: '1px solid var(--border-color)',
                                                                    borderRadius: '8px',
                                                                    fontSize: '0.9375rem',
                                                                    fontWeight: 600,
                                                                    color: 'var(--text-primary)',
                                                                    background: 'var(--bg-tertiary)',
                                                                    cursor: 'default'
                                                                }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                                                Description
                                                            </label>
                                                            <textarea
                                                                value={point.description}
                                                                readOnly
                                                                rows={3}
                                                                style={{
                                                                    width: '100%',
                                                                    padding: '0.75rem',
                                                                    border: '1px solid var(--border-color)',
                                                                    borderRadius: '8px',
                                                                    fontSize: '0.875rem',
                                                                    color: 'var(--text-secondary)',
                                                                    lineHeight: '1.6',
                                                                    background: 'var(--bg-tertiary)',
                                                                    cursor: 'default',
                                                                    resize: 'none'
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div style={{
                                                    background: 'var(--card-bg)',
                                                    borderRadius: '12px',
                                                    padding: '3rem',
                                                    textAlign: 'center',
                                                    border: '1px solid var(--border-color)'
                                                }}>
                                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
                                                        No closed analysis added yet
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Image Modal */}
            {showImageModal && (
                <div
                    onClick={() => setShowImageModal(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.9)',
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2rem',
                        cursor: 'zoom-out'
                    }}
                >
                    <button
                        onClick={() => setShowImageModal(false)}
                        style={{
                            position: 'absolute',
                            top: '1.5rem',
                            right: '1.5rem',
                            background: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            padding: '0.75rem',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                    >
                        <X size={24} />
                    </button>
                    <img
                        src={modalImageSrc}
                        alt="Chart"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            maxWidth: '95%',
                            maxHeight: '95%',
                            objectFit: 'contain',
                            borderRadius: '12px',
                            cursor: 'default'
                        }}
                    />
                </div>
            )}
        </>
    );
};

export default ViewItemPage;
