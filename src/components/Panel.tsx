import React, { useState, useRef } from 'react';
import BoardColumn from './BoardColumn.tsx';
import ViewItemPage from './ViewItemPage.tsx';
import CreateItemPage from './CreateItemPage.tsx';
import type { InvestmentItem, AnalysisPoint } from '../types.ts';
import { X, Plus, Trash2, Calendar } from 'lucide-react';
import * as api from '../services/api';

interface PanelProps {
    items: {
        followUp: InvestmentItem[];
        executed: InvestmentItem[];
        closed: InvestmentItem[];
        archive: InvestmentItem[];
    };
    setItems: (items: any) => void;
    onCreateItem?: () => void;
    refreshItems?: () => void;
}

const Panel: React.FC<PanelProps> = ({ items, setItems, onCreateItem, refreshItems }) => {
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    
    // Execution form state
    const [showExecutionForm, setShowExecutionForm] = useState(false);
    const [itemToExecute, setItemToExecute] = useState<InvestmentItem | null>(null);
    const [executedDate, setExecutedDate] = useState('');
    const [openPrice, setOpenPrice] = useState('');
    const [openReason, setOpenReason] = useState('');
    const [executedFollowUpDate, setExecutedFollowUpDate] = useState('');
    const [executedFollowUpTime, setExecutedFollowUpTime] = useState('');
    const [executedImageFile, setExecutedImageFile] = useState<string | null>(null);
    const [executedAnalysis, setExecutedAnalysis] = useState<AnalysisPoint[]>([{ headline: '', description: '' }]);
    
    // Closed form state
    const [showClosedForm, setShowClosedForm] = useState(false);
    const [itemToClose, setItemToClose] = useState<InvestmentItem | null>(null);
    const [closedDate, setClosedDate] = useState('');
    const [closePrice, setClosePrice] = useState('');
    const [closeReason, setCloseReason] = useState('');
    const [closedImageFile, setClosedImageFile] = useState<string | null>(null);
    const [closedAnalysis, setClosedAnalysis] = useState<AnalysisPoint[]>([{ headline: '', description: '' }]);
    
    // Date picker state
    const [showExecutedDatePicker, setShowExecutedDatePicker] = useState(false);
    const [showFollowUpDatePicker, setShowFollowUpDatePicker] = useState(false);
    const [showClosedDatePicker, setShowClosedDatePicker] = useState(false);
    const [selectedExecutedDate, setSelectedExecutedDate] = useState<Date>(new Date());
    const [selectedFollowUpDate, setSelectedFollowUpDate] = useState<Date>(new Date());
    const [selectedClosedDate, setSelectedClosedDate] = useState<Date>(new Date());
    const [executedHour, setExecutedHour] = useState('14');
    const [executedMinute, setExecutedMinute] = useState('00');
    const [followUpHour, setFollowUpHour] = useState('14');
    const [followUpMinute, setFollowUpMinute] = useState('00');
    const executedDatePickerRef = useRef<HTMLDivElement>(null);
    const followUpDatePickerRef = useRef<HTMLDivElement>(null);
    const closedDatePickerRef = useRef<HTMLDivElement>(null);

    const handleViewItem = (id: string) => {
        setSelectedItemId(id);
        setIsEditing(false);
    };

    const handleCloseView = () => {
        setSelectedItemId(null);
        setIsEditing(false);
    };

    const findItem = (id: string) => {
        for (const key in items) {
            const item = items[key as keyof typeof items].find(i => i.id === id);
            if (item) return item;
        }
        return null;
    };

    const selectedItem = selectedItemId ? findItem(selectedItemId) : null;

    // Date picker helper functions
    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const changeExecutedMonth = (increment: number) => {
        setSelectedExecutedDate(new Date(selectedExecutedDate.getFullYear(), selectedExecutedDate.getMonth() + increment, 1));
    };

    const changeFollowUpMonth = (increment: number) => {
        setSelectedFollowUpDate(new Date(selectedFollowUpDate.getFullYear(), selectedFollowUpDate.getMonth() + increment, 1));
    };

    const changeClosedMonth = (increment: number) => {
        setSelectedClosedDate(new Date(selectedClosedDate.getFullYear(), selectedClosedDate.getMonth() + increment, 1));
    };

    const handleExecutedDateSelect = (day: number) => {
        const newDate = new Date(selectedExecutedDate.getFullYear(), selectedExecutedDate.getMonth(), day);
        setSelectedExecutedDate(newDate);
        setExecutedDate(formatDate(newDate));
    };

    const handleClosedDateSelect = (day: number) => {
        const newDate = new Date(selectedClosedDate.getFullYear(), selectedClosedDate.getMonth(), day);
        setSelectedClosedDate(newDate);
        setClosedDate(formatDate(newDate));
    };

    const handleFollowUpDateSelect = (day: number) => {
        const newDate = new Date(selectedFollowUpDate.getFullYear(), selectedFollowUpDate.getMonth(), day);
        setSelectedFollowUpDate(newDate);
        const formattedDateTime = `${formatDate(newDate)} ${followUpHour}:${followUpMinute}`;
        setExecutedFollowUpDate(formatDate(newDate));
        setExecutedFollowUpTime(`${followUpHour}:${followUpMinute}`);
    };

    const handleFollowUpTimeConfirm = () => {
        const formattedDateTime = `${formatDate(selectedFollowUpDate)} ${followUpHour}:${followUpMinute}`;
        setExecutedFollowUpDate(formatDate(selectedFollowUpDate));
        setExecutedFollowUpTime(`${followUpHour}:${followUpMinute}`);
        setShowFollowUpDatePicker(false);
    };

    // Close date pickers on outside click
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (executedDatePickerRef.current && !executedDatePickerRef.current.contains(event.target as Node)) {
                setShowExecutedDatePicker(false);
            }
            if (followUpDatePickerRef.current && !followUpDatePickerRef.current.contains(event.target as Node)) {
                setShowFollowUpDatePicker(false);
            }
            if (closedDatePickerRef.current && !closedDatePickerRef.current.contains(event.target as Node)) {
                setShowClosedDatePicker(false);
            }
        };
        if (showExecutedDatePicker || showFollowUpDatePicker || showClosedDatePicker) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showExecutedDatePicker, showFollowUpDatePicker, showClosedDatePicker]);

    const handleUpdateItem = (updatedItem: Omit<InvestmentItem, 'id' | 'creationDate' | 'status'>) => {
        if (!selectedItemId) return;

        const newItems = { ...items };
        for (const key in newItems) {
            const index = newItems[key as keyof typeof items].findIndex(i => i.id === selectedItemId);
            if (index !== -1) {
                const original = newItems[key as keyof typeof items][index];
                const updated = {
                    ...original,
                    ...updatedItem
                };
                newItems[key as keyof typeof items][index] = updated;
                
                // Update via API
                api.updateItem(selectedItemId, updated).catch(err => {
                    console.error('Error updating item:', err);
                });
                break;
            }
        }

        setItems(newItems);
        setIsEditing(false);
    };

    const handleMoveItem = async (id: string, newStatus: InvestmentItem['status']) => {
        // If moving to executed, show the execution form first
        if (newStatus === 'executed') {
            const item = findItem(id);
            if (item) {
                setItemToExecute(item);
                setExecutedDate(new Date().toISOString().split('T')[0]); // Default to today
                setOpenPrice('');
                setOpenReason('');
                setExecutedFollowUpDate('');
                setExecutedFollowUpTime('');
                setExecutedImageFile(null);
                setExecutedAnalysis([{ headline: '', description: '' }]);
                setShowExecutionForm(true);
                return;
            }
        }

        // If moving to closed, show the closed form first
        if (newStatus === 'closed') {
            const item = findItem(id);
            if (item) {
                setItemToClose(item);
                setClosedDate(new Date().toISOString().split('T')[0]); // Default to today
                setClosePrice('');
                setCloseReason('');
                setClosedImageFile(null);
                setClosedAnalysis([{ headline: '', description: '' }]);
                setShowClosedForm(true);
                return;
            }
        }

        // For other statuses, move directly
        const newItems = { ...items };
        let itemToMove: InvestmentItem | null = null;

        // Remove from current column
        for (const key in newItems) {
            const index = newItems[key as keyof typeof items].findIndex(i => i.id === id);
            if (index !== -1) {
                itemToMove = newItems[key as keyof typeof items].splice(index, 1)[0];
                break;
            }
        }

        // Add to new column
        if (itemToMove) {
            itemToMove.status = newStatus;
            newItems[newStatus] = [itemToMove, ...newItems[newStatus]];
            
            // Update via API
            api.updateItemStatus(id, newStatus).catch(err => {
                console.error('Error updating item status:', err);
            });
        }

        setItems(newItems);
        handleCloseView();
    };

    const handleSaveExecution = async () => {
        if (!itemToExecute) return;

        const newItems = { ...items };
        let itemToMove: InvestmentItem | null = null;

        // Remove from current column
        for (const key in newItems) {
            const index = newItems[key as keyof typeof items].findIndex(i => i.id === itemToExecute.id);
            if (index !== -1) {
                itemToMove = newItems[key as keyof typeof items].splice(index, 1)[0];
                break;
            }
        }

        // Add to executed column with execution data
        if (itemToMove) {
            itemToMove.status = 'executed';
            itemToMove.executedDate = executedDate;
            itemToMove.openPrice = openPrice;
            itemToMove.openReason = openReason;
            itemToMove.executedFollowUpDate = executedFollowUpDate;
            itemToMove.executedFollowUpTime = executedFollowUpTime;
            itemToMove.executedImage = executedImageFile;
            itemToMove.executedAnalysis = executedAnalysis.filter(a => a.headline || a.description);
            newItems.executed = [itemToMove, ...newItems.executed];
            
            // Update via API
            api.updateItem(itemToExecute.id, itemToMove).catch(err => {
                console.error('Error updating item:', err);
            });
        }

        setItems(newItems);
        setShowExecutionForm(false);
        setItemToExecute(null);
        handleCloseView();
    };

    const handleSaveClosed = async () => {
        if (!itemToClose) return;

        const newItems = { ...items };
        let itemToMove: InvestmentItem | null = null;

        // Remove from current column
        for (const key in newItems) {
            const index = newItems[key as keyof typeof items].findIndex(i => i.id === itemToClose.id);
            if (index !== -1) {
                itemToMove = newItems[key as keyof typeof items].splice(index, 1)[0];
                break;
            }
        }

        // Add to closed column with closed data
        if (itemToMove) {
            itemToMove.status = 'closed';
            itemToMove.closedDate = closedDate;
            itemToMove.closePrice = closePrice;
            itemToMove.closeReason = closeReason;
            itemToMove.closedImage = closedImageFile;
            itemToMove.closedAnalysis = closedAnalysis.filter(a => a.headline || a.description);
            newItems.closed = [itemToMove, ...newItems.closed];
            
            // Update via API
            api.updateItem(itemToClose.id, itemToMove).catch(err => {
                console.error('Error updating item:', err);
            });
        }

        setItems(newItems);
        setShowClosedForm(false);
        setItemToClose(null);
        handleCloseView();
    };

    const handleCardDrop = (status: InvestmentItem['status']) => (itemId: string) => {
        handleMoveItem(itemId, status);
    };

    const handleDeleteItem = async (id: string) => {
        try {
            await api.deleteItem(id);
            
            const newItems = { ...items };
            for (const key in newItems) {
                const index = newItems[key as keyof typeof items].findIndex(i => i.id === id);
                if (index !== -1) {
                    newItems[key as keyof typeof items].splice(index, 1);
                    break;
                }
            }
            setItems(newItems);
        } catch (err) {
            console.error('Error deleting item:', err);
            alert('Failed to delete item. Please try again.');
        }
    };

    if (selectedItem && isEditing) {
        return <CreateItemPage onCreate={handleUpdateItem} initialData={selectedItem} onCancel={handleCloseView} />;
    }

    if (selectedItem) {
        return (
            <ViewItemPage
                item={selectedItem}
                onClose={handleCloseView}
                onEdit={() => setIsEditing(true)}
                onMove={(newStatus) => handleMoveItem(selectedItem.id, newStatus)}
            />
        );
    }

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', paddingTop: 'var(--header-height)' }}>
                <div style={{ display: 'flex', gap: '1.5rem', height: '75vh', padding: '0.25rem 1rem 0.5rem 1rem', overflow: 'visible' }}>
                    <BoardColumn title="Follow Up" items={items.followUp} onView={handleViewItem} onCreate={onCreateItem} onDrop={handleCardDrop('followUp')} status="followUp" onDelete={handleDeleteItem} />
                    <BoardColumn title="Executed" items={items.executed} onView={handleViewItem} onDrop={handleCardDrop('executed')} status="executed" onDelete={handleDeleteItem} />
                    <BoardColumn title="Closed" items={items.closed} onView={handleViewItem} onDrop={handleCardDrop('closed')} status="closed" onDelete={handleDeleteItem} />
                </div>
            </div>

            {/* Execution Form Modal */}
            {showExecutionForm && itemToExecute && (
                <div 
                    onClick={() => {
                        setShowExecutionForm(false);
                        setItemToExecute(null);
                    }}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2rem'
                    }}
                >
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: 'var(--card-bg)',
                            borderRadius: '16px',
                            maxWidth: '800px',
                            width: '100%',
                            maxHeight: '90vh',
                            overflow: 'auto',
                            boxShadow: 'var(--shadow-lg)',
                            border: '1px solid var(--border-color)'
                        }}
                    >
                        {/* Header */}
                        <div style={{ 
                            position: 'sticky',
                            top: 0,
                            background: 'var(--card-bg)',
                            borderBottom: '1px solid var(--border-color)',
                            padding: '1.5rem 2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            zIndex: 10
                        }}>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Execute Trade</h2>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{itemToExecute.instrument}</p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowExecutionForm(false);
                                    setItemToExecute(null);
                                }}
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--text-secondary)',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'var(--hover-bg)';
                                    e.currentTarget.style.color = 'var(--text-primary)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = 'var(--text-secondary)';
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Form Content */}
                        <div style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {/* Date Executed */}
                                <div style={{ position: 'relative' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                                        Date Executed *
                                    </label>
                                    <div 
                                        onClick={() => setShowExecutedDatePicker(!showExecutedDatePicker)}
                                        style={{ 
                                            position: 'relative',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <input
                                            type="text"
                                            value={executedDate || 'Select date'}
                                            readOnly
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                paddingRight: '2.5rem',
                                                border: '1px solid var(--border-color)',
                                                borderRadius: '8px',
                                                fontSize: '0.9375rem',
                                                cursor: 'pointer',
                                                background: 'var(--card-bg)'
                                            }}
                                        />
                                        <Calendar 
                                            size={18} 
                                            style={{ 
                                                position: 'absolute', 
                                                right: '0.875rem', 
                                                top: '50%', 
                                                transform: 'translateY(-50%)',
                                                color: 'var(--accent-primary)',
                                                pointerEvents: 'none'
                                            }} 
                                        />
                                    </div>
                                    
                                    {showExecutedDatePicker && (
                                        <div 
                                            ref={executedDatePickerRef}
                                            style={{
                                                position: 'absolute',
                                                top: '100%',
                                                left: 0,
                                                marginTop: '0.5rem',
                                                background: 'var(--card-bg)',
                                                border: '1px solid var(--border-color)',
                                                borderRadius: '12px',
                                                padding: '1.25rem',
                                                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                                                zIndex: 1001,
                                                width: '320px'
                                            }}
                                        >
                                            {/* Month Navigation */}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => changeExecutedMonth(-1)}
                                                    style={{ padding: '0.375rem', borderRadius: '6px', background: 'var(--bg-secondary)', fontWeight: 600 }}
                                                >
                                                    ←
                                                </button>
                                                <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>
                                                    {selectedExecutedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => changeExecutedMonth(1)}
                                                    style={{ padding: '0.375rem', borderRadius: '6px', background: 'var(--bg-secondary)', fontWeight: 600 }}
                                                >
                                                    →
                                                </button>
                                            </div>

                                            {/* Day Headers */}
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem', marginBottom: '0.5rem' }}>
                                                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                                    <div key={day} style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', padding: '0.375rem' }}>
                                                        {day}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Calendar Days */}
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem' }}>
                                                {Array.from({ length: getFirstDayOfMonth(selectedExecutedDate) }).map((_, i) => (
                                                    <div key={`empty-${i}`} />
                                                ))}
                                                {Array.from({ length: getDaysInMonth(selectedExecutedDate) }).map((_, i) => {
                                                    const day = i + 1;
                                                    const currentDate = new Date(selectedExecutedDate.getFullYear(), selectedExecutedDate.getMonth(), day);
                                                    const isSelected = executedDate === formatDate(currentDate);
                                                    const isToday = formatDate(currentDate) === formatDate(new Date());
                                                    
                                                    return (
                                                        <button
                                                            key={day}
                                                            type="button"
                                                            onClick={() => {
                                                                handleExecutedDateSelect(day);
                                                                setShowExecutedDatePicker(false);
                                                            }}
                                                            style={{
                                                                padding: '0.5rem',
                                                                borderRadius: '6px',
                                                                fontSize: '0.8125rem',
                                                                fontWeight: isSelected ? 600 : 400,
                                                                background: isSelected ? 'var(--accent-primary)' : isToday ? 'var(--bg-secondary)' : 'transparent',
                                                                color: isSelected ? 'white' : 'var(--text-primary)',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.15s'
                                                            }}
                                                            onMouseOver={(e) => {
                                                                if (!isSelected) e.currentTarget.style.background = 'var(--bg-secondary)';
                                                            }}
                                                            onMouseOut={(e) => {
                                                                if (!isSelected) e.currentTarget.style.background = isToday ? 'var(--bg-secondary)' : 'transparent';
                                                            }}
                                                        >
                                                            {day}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Open Price */}
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                                        Open Price
                                    </label>
                                    <input
                                        type="text"
                                        value={openPrice}
                                        onChange={(e) => setOpenPrice(e.target.value)}
                                        placeholder="e.g. 2750.50"
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: '1px solid var(--border-color)',
                                            borderRadius: '8px',
                                            fontSize: '0.9375rem'
                                        }}
                                    />
                                </div>

                                {/* Open Reason */}
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                                        Open Reason
                                    </label>
                                    <textarea
                                        value={openReason}
                                        onChange={(e) => setOpenReason(e.target.value)}
                                        placeholder="Why did you open this trade?"
                                        rows={3}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: '1px solid var(--border-color)',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem',
                                            resize: 'vertical'
                                        }}
                                    />
                                </div>

                                {/* Follow Up Date & Time */}
                                <div style={{ position: 'relative' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                                        New Follow-up Date & Time
                                    </label>
                                    <div 
                                        onClick={() => setShowFollowUpDatePicker(!showFollowUpDatePicker)}
                                        style={{ 
                                            position: 'relative',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <input
                                            type="text"
                                            value={executedFollowUpDate && executedFollowUpTime ? `${executedFollowUpDate} ${executedFollowUpTime}` : 'Select date and time'}
                                            readOnly
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                paddingRight: '2.5rem',
                                                border: '1px solid var(--border-color)',
                                                borderRadius: '8px',
                                                fontSize: '0.9375rem',
                                                cursor: 'pointer',
                                                background: 'var(--card-bg)'
                                            }}
                                        />
                                        <Calendar 
                                            size={18} 
                                            style={{ 
                                                position: 'absolute', 
                                                right: '0.875rem', 
                                                top: '50%', 
                                                transform: 'translateY(-50%)',
                                                color: 'var(--accent-primary)',
                                                pointerEvents: 'none'
                                            }} 
                                        />
                                    </div>
                                    
                                    {showFollowUpDatePicker && (
                                        <div 
                                            ref={followUpDatePickerRef}
                                            style={{
                                                position: 'absolute',
                                                top: '100%',
                                                left: 0,
                                                marginTop: '0.5rem',
                                                background: 'var(--card-bg)',
                                                border: '1px solid var(--border-color)',
                                                borderRadius: '12px',
                                                padding: '1.25rem',
                                                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                                                zIndex: 1001,
                                                width: '320px'
                                            }}
                                        >
                                            {/* Month Navigation */}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => changeFollowUpMonth(-1)}
                                                    style={{ padding: '0.375rem', borderRadius: '6px', background: 'var(--bg-secondary)', fontWeight: 600 }}
                                                >
                                                    ←
                                                </button>
                                                <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>
                                                    {selectedFollowUpDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => changeFollowUpMonth(1)}
                                                    style={{ padding: '0.375rem', borderRadius: '6px', background: 'var(--bg-secondary)', fontWeight: 600 }}
                                                >
                                                    →
                                                </button>
                                            </div>

                                            {/* Day Headers */}
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem', marginBottom: '0.5rem' }}>
                                                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                                    <div key={day} style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', padding: '0.375rem' }}>
                                                        {day}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Calendar Days */}
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem', marginBottom: '1rem' }}>
                                                {Array.from({ length: getFirstDayOfMonth(selectedFollowUpDate) }).map((_, i) => (
                                                    <div key={`empty-${i}`} />
                                                ))}
                                                {Array.from({ length: getDaysInMonth(selectedFollowUpDate) }).map((_, i) => {
                                                    const day = i + 1;
                                                    const currentDate = new Date(selectedFollowUpDate.getFullYear(), selectedFollowUpDate.getMonth(), day);
                                                    const isSelected = executedFollowUpDate === formatDate(currentDate);
                                                    const isToday = formatDate(currentDate) === formatDate(new Date());
                                                    
                                                    return (
                                                        <button
                                                            key={day}
                                                            type="button"
                                                            onClick={() => handleFollowUpDateSelect(day)}
                                                            style={{
                                                                padding: '0.5rem',
                                                                borderRadius: '6px',
                                                                fontSize: '0.8125rem',
                                                                fontWeight: isSelected ? 600 : 400,
                                                                background: isSelected ? 'var(--accent-primary)' : isToday ? 'var(--bg-secondary)' : 'transparent',
                                                                color: isSelected ? 'white' : 'var(--text-primary)',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.15s'
                                                            }}
                                                            onMouseOver={(e) => {
                                                                if (!isSelected) e.currentTarget.style.background = 'var(--bg-secondary)';
                                                            }}
                                                            onMouseOut={(e) => {
                                                                if (!isSelected) e.currentTarget.style.background = isToday ? 'var(--bg-secondary)' : 'transparent';
                                                            }}
                                                        >
                                                            {day}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {/* Time Selection */}
                                            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                                                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                                    Time
                                                </div>
                                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                    <select
                                                        value={followUpHour}
                                                        onChange={(e) => {
                                                            setFollowUpHour(e.target.value);
                                                            if (executedFollowUpDate) {
                                                                setExecutedFollowUpTime(`${e.target.value}:${followUpMinute}`);
                                                            }
                                                        }}
                                                        style={{
                                                            padding: '0.5rem',
                                                            borderRadius: '6px',
                                                            border: '1px solid var(--border-color)',
                                                            fontSize: '0.875rem',
                                                            flex: 1
                                                        }}
                                                    >
                                                        {Array.from({ length: 24 }).map((_, i) => (
                                                            <option key={i} value={String(i).padStart(2, '0')}>
                                                                {String(i).padStart(2, '0')}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <span style={{ fontWeight: 600 }}>:</span>
                                                    <select
                                                        value={followUpMinute}
                                                        onChange={(e) => {
                                                            setFollowUpMinute(e.target.value);
                                                            if (executedFollowUpDate) {
                                                                setExecutedFollowUpTime(`${followUpHour}:${e.target.value}`);
                                                            }
                                                        }}
                                                        style={{
                                                            padding: '0.5rem',
                                                            borderRadius: '6px',
                                                            border: '1px solid var(--border-color)',
                                                            fontSize: '0.875rem',
                                                            flex: 1
                                                        }}
                                                    >
                                                        {['00', '15', '30', '45'].map(min => (
                                                            <option key={min} value={min}>{min}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Confirm Button */}
                                            <button
                                                type="button"
                                                onClick={handleFollowUpTimeConfirm}
                                                style={{
                                                    marginTop: '1rem',
                                                    width: '100%',
                                                    padding: '0.625rem',
                                                    background: 'var(--accent-primary)',
                                                    color: 'white',
                                                    borderRadius: '6px',
                                                    fontSize: '0.875rem',
                                                    fontWeight: 600,
                                                    border: 'none',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Confirm
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Upload Executed Chart */}
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                                        Executed Chart Image
                                    </label>
                                    <div style={{ 
                                        border: '2px dashed var(--border-color)', 
                                        borderRadius: '8px', 
                                        padding: '1.5rem', 
                                        textAlign: 'center',
                                        background: 'var(--bg-tertiary)'
                                    }}>
                                        {executedImageFile ? (
                                            <div style={{ position: 'relative' }}>
                                                <img src={executedImageFile} alt="Executed chart" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }} />
                                                <button
                                                    onClick={() => setExecutedImageFile(null)}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '0.5rem',
                                                        right: '0.5rem',
                                                        background: 'rgba(0, 0, 0, 0.7)',
                                                        color: 'white',
                                                        padding: '0.5rem',
                                                        borderRadius: '50%'
                                                    }}
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <div style={{ 
                                                    width: '48px',
                                                    height: '48px',
                                                    borderRadius: '50%',
                                                    background: '#eff6ff',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    margin: '0 auto 0.75rem'
                                                }}>
                                                    <Calendar size={24} color="#0066FF" />
                                                </div>
                                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>Upload executed chart image</p>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => setExecutedImageFile(reader.result as string);
                                                            reader.readAsDataURL(file);
                                                        }
                                                    }}
                                                    style={{ display: 'none' }}
                                                    id="executed-chart-upload"
                                                />
                                                <label
                                                    htmlFor="executed-chart-upload"
                                                    style={{
                                                        display: 'inline-block',
                                                        background: '#0066FF',
                                                        color: 'white',
                                                        padding: '0.625rem 1.25rem',
                                                        borderRadius: '8px',
                                                        fontSize: '0.875rem',
                                                        fontWeight: 600,
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Choose File
                                                </label>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Executed Analysis Points */}
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <label style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                                            Executed Analysis Points
                                        </label>
                                        <button
                                            onClick={() => setExecutedAnalysis([...executedAnalysis, { headline: '', description: '' }])}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.375rem',
                                                color: '#0066FF',
                                                fontSize: '0.875rem',
                                                fontWeight: 600
                                            }}
                                        >
                                            <Plus size={16} />
                                            Add Point
                                        </button>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {executedAnalysis.map((point, index) => (
                                            <div key={index} style={{ 
                                                background: 'var(--bg-tertiary)', 
                                                padding: '1rem', 
                                                borderRadius: '8px',
                                                border: '1px solid var(--border-color)'
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                                    <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Point {index + 1}</span>
                                                    {executedAnalysis.length > 1 && (
                                                        <button
                                                            onClick={() => setExecutedAnalysis(executedAnalysis.filter((_, i) => i !== index))}
                                                            style={{ color: '#ef4444', padding: '0.25rem' }}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                                <input
                                                    type="text"
                                                    value={point.headline}
                                                    onChange={(e) => {
                                                        const updated = [...executedAnalysis];
                                                        updated[index].headline = e.target.value;
                                                        setExecutedAnalysis(updated);
                                                    }}
                                                    placeholder="Headline"
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.625rem',
                                                        border: '1px solid var(--border-color)',
                                                        borderRadius: '6px',
                                                        marginBottom: '0.5rem',
                                                        fontSize: '0.875rem',
                                                        background: 'var(--card-bg)',
                                                        color: 'var(--text-primary)'
                                                    }}
                                                />
                                                <textarea
                                                    value={point.description}
                                                    onChange={(e) => {
                                                        const updated = [...executedAnalysis];
                                                        updated[index].description = e.target.value;
                                                        setExecutedAnalysis(updated);
                                                    }}
                                                    placeholder="Description"
                                                    rows={3}
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.625rem',
                                                        border: '1px solid var(--border-color)',
                                                        borderRadius: '6px',
                                                        fontSize: '0.875rem',
                                                        resize: 'vertical',
                                                        background: 'var(--card-bg)',
                                                        color: 'var(--text-primary)'
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Footer Buttons */}
                            <div style={{ 
                                marginTop: '2rem', 
                                paddingTop: '1.5rem', 
                                borderTop: '1px solid var(--border-color)',
                                display: 'flex',
                                gap: '0.75rem',
                                justifyContent: 'flex-end'
                            }}>
                                <button
                                    onClick={() => {
                                        setShowExecutionForm(false);
                                        setItemToExecute(null);
                                    }}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        borderRadius: '8px',
                                        fontSize: '0.9375rem',
                                        fontWeight: 600,
                                        color: 'var(--text-secondary)',
                                        border: '1px solid var(--border-color)'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveExecution}
                                    disabled={!executedDate}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        borderRadius: '8px',
                                        fontSize: '0.9375rem',
                                        fontWeight: 600,
                                        background: !executedDate ? 'var(--border-color)' : 'var(--accent-primary)',
                                        color: !executedDate ? 'var(--text-muted)' : 'white',
                                        cursor: !executedDate ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    Execute Trade
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Closed Trade Form Modal */}
            {showClosedForm && itemToClose && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem'
                }}>
                    <div style={{
                        background: 'var(--card-bg)',
                        borderRadius: '12px',
                        width: '100%',
                        maxWidth: '800px',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        boxShadow: 'var(--shadow-lg)'
                    }}>
                        {/* Header */}
                        <div style={{
                            padding: '1.5rem 2rem',
                            borderBottom: '1px solid var(--border-color)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: 'var(--card-bg)',
                            position: 'sticky',
                            top: 0,
                            zIndex: 10
                        }}>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>Close Trade</h3>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{itemToClose.instrument}</p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowClosedForm(false);
                                    setItemToClose(null);
                                }}
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--text-secondary)',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'var(--hover-bg)';
                                    e.currentTarget.style.color = 'var(--text-primary)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = 'var(--text-secondary)';
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Form Content */}
                        <div style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {/* Closed Date */}
                                <div style={{ position: 'relative' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                                        Closed Date *
                                    </label>
                                    <div 
                                        onClick={() => setShowClosedDatePicker(!showClosedDatePicker)}
                                        style={{ 
                                            position: 'relative',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <input
                                            type="text"
                                            value={closedDate || 'Select date'}
                                            readOnly
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                paddingRight: '2.5rem',
                                                border: '1px solid var(--border-color)',
                                                borderRadius: '8px',
                                                fontSize: '0.9375rem',
                                                cursor: 'pointer',
                                                background: 'var(--card-bg)'
                                            }}
                                        />
                                        <Calendar 
                                            size={18} 
                                            style={{ 
                                                position: 'absolute', 
                                                right: '0.875rem', 
                                                top: '50%', 
                                                transform: 'translateY(-50%)',
                                                color: 'var(--accent-primary)',
                                                pointerEvents: 'none'
                                            }} 
                                        />
                                    </div>
                                    
                                    {showClosedDatePicker && (
                                        <div 
                                            ref={closedDatePickerRef}
                                            style={{
                                                position: 'absolute',
                                                top: '100%',
                                                left: 0,
                                                marginTop: '0.5rem',
                                                background: 'var(--card-bg)',
                                                border: '1px solid var(--border-color)',
                                                borderRadius: '12px',
                                                padding: '1.25rem',
                                                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                                                zIndex: 1001,
                                                width: '320px'
                                            }}
                                        >
                                            {/* Month Navigation */}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => changeClosedMonth(-1)}
                                                    style={{ padding: '0.375rem', borderRadius: '6px', background: 'var(--bg-secondary)', fontWeight: 600 }}
                                                >
                                                    ←
                                                </button>
                                                <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>
                                                    {selectedClosedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => changeClosedMonth(1)}
                                                    style={{ padding: '0.375rem', borderRadius: '6px', background: 'var(--bg-secondary)', fontWeight: 600 }}
                                                >
                                                    →
                                                </button>
                                            </div>

                                            {/* Day Headers */}
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem', marginBottom: '0.5rem' }}>
                                                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                                    <div key={day} style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', padding: '0.375rem' }}>
                                                        {day}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Calendar Days */}
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem' }}>
                                                {Array.from({ length: getFirstDayOfMonth(selectedClosedDate) }).map((_, i) => (
                                                    <div key={`empty-${i}`} />
                                                ))}
                                                {Array.from({ length: getDaysInMonth(selectedClosedDate) }).map((_, i) => {
                                                    const day = i + 1;
                                                    const currentDate = new Date(selectedClosedDate.getFullYear(), selectedClosedDate.getMonth(), day);
                                                    const isSelected = closedDate === formatDate(currentDate);
                                                    const isToday = formatDate(currentDate) === formatDate(new Date());
                                                    
                                                    return (
                                                        <button
                                                            key={day}
                                                            type="button"
                                                            onClick={() => {
                                                                handleClosedDateSelect(day);
                                                                setShowClosedDatePicker(false);
                                                            }}
                                                            style={{
                                                                padding: '0.5rem',
                                                                borderRadius: '6px',
                                                                fontSize: '0.8125rem',
                                                                fontWeight: isSelected ? 600 : 400,
                                                                background: isSelected ? 'var(--accent-primary)' : isToday ? 'var(--bg-secondary)' : 'transparent',
                                                                color: isSelected ? 'white' : 'var(--text-primary)',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.15s'
                                                            }}
                                                            onMouseOver={(e) => {
                                                                if (!isSelected) e.currentTarget.style.background = 'var(--bg-secondary)';
                                                            }}
                                                            onMouseOut={(e) => {
                                                                if (!isSelected) e.currentTarget.style.background = isToday ? 'var(--bg-secondary)' : 'transparent';
                                                            }}
                                                        >
                                                            {day}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Close Price */}
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                                        Close Price
                                    </label>
                                    <input
                                        type="text"
                                        value={closePrice}
                                        onChange={(e) => setClosePrice(e.target.value)}
                                        placeholder="e.g. 2780.00"
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: '1px solid var(--border-color)',
                                            borderRadius: '8px',
                                            fontSize: '0.9375rem'
                                        }}
                                    />
                                </div>

                                {/* Close Reason */}
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                                        Close Reason
                                    </label>
                                    <textarea
                                        value={closeReason}
                                        onChange={(e) => setCloseReason(e.target.value)}
                                        placeholder="Why did you close this trade?"
                                        rows={3}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: '1px solid var(--border-color)',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem',
                                            resize: 'vertical'
                                        }}
                                    />
                                </div>

                                {/* Upload Closed Chart */}
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                                        Closed Chart Image
                                    </label>
                                    <div style={{ 
                                        border: '2px dashed var(--border-color)', 
                                        borderRadius: '8px', 
                                        padding: '1.5rem', 
                                        textAlign: 'center',
                                        background: 'var(--bg-tertiary)',
                                        cursor: 'pointer'
                                    }}>
                                        {closedImageFile ? (
                                            <div>
                                                <img src={closedImageFile} alt="Closed chart" style={{ maxWidth: '100%', borderRadius: '8px', marginBottom: '0.75rem' }} />
                                                <button
                                                    type="button"
                                                    onClick={() => setClosedImageFile(null)}
                                                    style={{
                                                        padding: '0.5rem 1rem',
                                                        background: 'var(--danger)',
                                                        color: 'white',
                                                        borderRadius: '6px',
                                                        fontSize: '0.875rem',
                                                        fontWeight: 500
                                                    }}
                                                >
                                                    Remove Image
                                                </button>
                                            </div>
                                        ) : (
                                            <div>
                                                <div style={{
                                                    width: '48px',
                                                    height: '48px',
                                                    borderRadius: '50%',
                                                    background: 'var(--accent-bg)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    margin: '0 auto 0.75rem'
                                                }}>
                                                    <Calendar size={24} color="#0066FF" />
                                                </div>
                                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>Upload closed chart image</p>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => setClosedImageFile(reader.result as string);
                                                            reader.readAsDataURL(file);
                                                        }
                                                    }}
                                                    style={{ display: 'none' }}
                                                    id="closed-chart-upload"
                                                />
                                                <label
                                                    htmlFor="closed-chart-upload"
                                                    style={{
                                                        padding: '0.625rem 1.25rem',
                                                        background: 'var(--accent-primary)',
                                                        color: 'white',
                                                        borderRadius: '6px',
                                                        fontSize: '0.875rem',
                                                        fontWeight: 600,
                                                        cursor: 'pointer',
                                                        display: 'inline-block'
                                                    }}
                                                >
                                                    Choose File
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Closed Analysis Points */}
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                        <label style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                                            Closed Analysis
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setClosedAnalysis([...closedAnalysis, { headline: '', description: '' }])}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.375rem',
                                                padding: '0.5rem 0.875rem',
                                                background: 'var(--accent-primary)',
                                                color: 'white',
                                                borderRadius: '6px',
                                                fontSize: '0.8125rem',
                                                fontWeight: 600
                                            }}
                                        >
                                            <Plus size={14} />
                                            Add Point
                                        </button>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {closedAnalysis.map((point, index) => (
                                            <div key={index} style={{ 
                                                background: 'var(--bg-tertiary)', 
                                                padding: '1rem', 
                                                borderRadius: '8px',
                                                border: '1px solid var(--border-color)'
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                                    <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Point {index + 1}</span>
                                                    {closedAnalysis.length > 1 && (
                                                        <button
                                                            onClick={() => setClosedAnalysis(closedAnalysis.filter((_, i) => i !== index))}
                                                            style={{ color: '#ef4444', padding: '0.25rem' }}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                    <input
                                                        type="text"
                                                        placeholder="Headline"
                                                        value={point.headline}
                                                        onChange={(e) => {
                                                            const newAnalysis = [...closedAnalysis];
                                                            newAnalysis[index].headline = e.target.value;
                                                            setClosedAnalysis(newAnalysis);
                                                        }}
                                                        style={{
                                                            padding: '0.625rem',
                                                            border: '1px solid var(--border-color)',
                                                            borderRadius: '6px',
                                                            fontSize: '0.875rem'
                                                        }}
                                                    />
                                                    <textarea
                                                        placeholder="Description"
                                                        value={point.description}
                                                        onChange={(e) => {
                                                            const newAnalysis = [...closedAnalysis];
                                                            newAnalysis[index].description = e.target.value;
                                                            setClosedAnalysis(newAnalysis);
                                                        }}
                                                        rows={3}
                                                        style={{
                                                            padding: '0.625rem',
                                                            border: '1px solid var(--border-color)',
                                                            borderRadius: '6px',
                                                            fontSize: '0.875rem',
                                                            resize: 'vertical'
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div style={{ 
                                marginTop: '2rem', 
                                paddingTop: '1.5rem', 
                                borderTop: '1px solid var(--border-color)',
                                display: 'flex',
                                gap: '0.75rem',
                                justifyContent: 'flex-end'
                            }}>
                                <button
                                    onClick={() => {
                                        setShowClosedForm(false);
                                        setItemToClose(null);
                                    }}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        borderRadius: '8px',
                                        fontSize: '0.9375rem',
                                        fontWeight: 600,
                                        color: 'var(--text-secondary)',
                                        border: '1px solid var(--border-color)'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveClosed}
                                    disabled={!closedDate}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        borderRadius: '8px',
                                        fontSize: '0.9375rem',
                                        fontWeight: 600,
                                        background: !closedDate ? 'var(--border-color)' : 'var(--accent-primary)',
                                        color: !closedDate ? 'var(--text-muted)' : 'white',
                                        cursor: !closedDate ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    Close Trade
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Panel;
