import React, { useState, useRef } from 'react';
import { Plus, Trash2, X, Upload, Save, Calendar } from 'lucide-react';
import type { AnalysisPoint, InvestmentItem } from '../types.ts';

interface CreateItemPageProps {
    onCreate: (item: any) => void;
    initialData?: InvestmentItem;
    onCancel?: () => void;
}

const CreateItemPage: React.FC<CreateItemPageProps> = ({ onCreate, initialData, onCancel }) => {
    const [instrument, setInstrument] = useState(initialData?.instrument || '');
    const [followUpDate, setFollowUpDate] = useState(initialData?.followUpDate || '');
    const [followUpTime, setFollowUpTime] = useState(initialData?.followUpTime || '');
    const [analysisPoints, setAnalysisPoints] = useState<AnalysisPoint[]>(
        initialData?.analysisPoints || [{ headline: '', description: '' }]
    );
    const [image, setImage] = useState<string | null>(initialData?.image || null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedHour, setSelectedHour] = useState('14');
    const [selectedMinute, setSelectedMinute] = useState('00');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const datePickerRef = useRef<HTMLDivElement>(null);

    const handleAddPoint = () => {
        setAnalysisPoints([...analysisPoints, { headline: '', description: '' }]);
    };

    const handleRemovePoint = (index: number) => {
        setAnalysisPoints(analysisPoints.filter((_, i) => i !== index));
    };

    const handlePointChange = (index: number, field: keyof AnalysisPoint, value: string) => {
        const newPoints = [...analysisPoints];
        newPoints[index][field] = value;
        setAnalysisPoints(newPoints);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleDateSelect = (day: number) => {
        const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
        setSelectedDate(newDate);
        setFollowUpDate(formatDate(newDate));
        setFollowUpTime(`${selectedHour}:${selectedMinute}`);
    };

    const handleTimeConfirm = () => {
        setFollowUpDate(formatDate(selectedDate));
        setFollowUpTime(`${selectedHour}:${selectedMinute}`);
        setShowDatePicker(false);
    };

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const changeMonth = (increment: number) => {
        setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + increment, 1));
    };

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
                setShowDatePicker(false);
            }
        };
        if (showDatePicker) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showDatePicker]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!instrument || analysisPoints.some(p => !p.headline)) {
            alert('Please fill in Instrument and all Headlines');
            return;
        }
        onCreate({ instrument, followUpDate, followUpTime, analysisPoints, image });
    };

    return (
        <div style={{ 
            width: '100%', 
            height: 'calc(100vh - var(--header-height))', 
            background: 'var(--bg-secondary)', 
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'hidden',
            marginTop: 'var(--header-height)'
        }}>
            <form onSubmit={handleSubmit} style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr 1fr', 
                gap: '1rem', 
                height: '75vh',
                maxHeight: '75vh',
                padding: '0.25rem 1rem 0.5rem 1rem',
                overflow: 'hidden'
            }}>
                {/* First Card - Form Fields */}
                <div className="clean-card" style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '1rem',
                    overflow: 'hidden'
                }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                        Investment Details
                    </h3>
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '1rem',
                        overflowY: 'auto',
                        paddingRight: '0.5rem',
                        flex: 1
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Instrument</label>
                            <input
                                type="text"
                                placeholder="e.g. Gold (XAU/USD)"
                                value={instrument}
                                onChange={(e) => setInstrument(e.target.value)}
                                className="big-text"
                                style={{ padding: '0.75rem', fontSize: '1rem' }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', position: 'relative' }}>
                            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Follow-up Time</label>
                            <div 
                                onClick={() => setShowDatePicker(!showDatePicker)}
                                style={{ 
                                    position: 'relative',
                                    cursor: 'pointer'
                                }}
                            >
                                <input
                                    type="text"
                                    value={followUpDate && followUpTime ? `${followUpDate} ${followUpTime}` : 'Select date and time'}
                                    readOnly
                                    style={{ 
                                        padding: '0.75rem',
                                        paddingRight: '2.5rem',
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
                            
                            {showDatePicker && (
                                <div 
                                    ref={datePickerRef}
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
                                        zIndex: 1000,
                                        width: '320px'
                                    }}
                                >
                                    {/* Month Navigation */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <button
                                            type="button"
                                            onClick={() => changeMonth(-1)}
                                            style={{ padding: '0.375rem', borderRadius: '6px', background: 'var(--bg-secondary)', fontWeight: 600 }}
                                        >
                                            ←
                                        </button>
                                        <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>
                                            {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => changeMonth(1)}
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
                                        {Array.from({ length: getFirstDayOfMonth(selectedDate) }).map((_, i) => (
                                            <div key={`empty-${i}`} />
                                        ))}
                                        {Array.from({ length: getDaysInMonth(selectedDate) }).map((_, i) => {
                                            const day = i + 1;
                                            const isSelected = day === selectedDate.getDate() && 
                                                selectedDate.getMonth() === new Date().getMonth() &&
                                                selectedDate.getFullYear() === new Date().getFullYear();
                                            const isToday = day === new Date().getDate() && 
                                                selectedDate.getMonth() === new Date().getMonth() &&
                                                selectedDate.getFullYear() === new Date().getFullYear();
                                            
                                            return (
                                                <button
                                                    key={day}
                                                    type="button"
                                                    onClick={() => handleDateSelect(day)}
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
                                                value={selectedHour}
                                                onChange={(e) => setSelectedHour(e.target.value)}
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
                                                value={selectedMinute}
                                                onChange={(e) => setSelectedMinute(e.target.value)}
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
                                        onClick={handleTimeConfirm}
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
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        style={{
                            background: 'var(--accent-primary)',
                            color: 'white',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            marginTop: 'auto',
                            flexShrink: 0
                        }}
                    >
                        <Save size={16} />
                        {initialData ? 'Update' : 'Create'}
                    </button>
                </div>

                {/* Second Card - Analysis Points */}
                <div className="clean-card" style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '1rem',
                    overflow: 'hidden'
                }}>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        paddingBottom: '0.5rem',
                        borderBottom: '1px solid var(--border-color)',
                        flexShrink: 0
                    }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Analysis Points</h3>
                        <button
                            type="button"
                            onClick={handleAddPoint}
                            style={{
                                background: 'var(--accent-primary)',
                                color: 'white',
                                padding: '0.375rem 0.75rem',
                                borderRadius: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.375rem',
                                fontSize: '0.75rem',
                                fontWeight: 600
                            }}
                        >
                            <Plus size={14} /> Add
                        </button>
                    </div>

                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '0.875rem', 
                        overflowY: 'auto', 
                        paddingRight: '0.5rem',
                        flex: 1
                    }}>
                        {analysisPoints.map((point, index) => (
                            <div key={index} style={{ 
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                padding: '0.875rem',
                                display: 'flex', 
                                flexDirection: 'column', 
                                gap: '0.75rem', 
                                position: 'relative'
                            }}>
                                {analysisPoints.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemovePoint(index)}
                                        style={{ 
                                            position: 'absolute', 
                                            top: '0.75rem', 
                                            right: '0.75rem', 
                                            color: 'var(--danger)',
                                            background: 'var(--card-bg)',
                                            padding: '0.25rem',
                                            borderRadius: '4px',
                                            border: '1px solid var(--border-color)'
                                        }}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                        Headline {index + 1}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Key catalyst..."
                                        value={point.headline}
                                        onChange={(e) => handlePointChange(index, 'headline', e.target.value)}
                                        style={{ padding: '0.625rem', fontSize: '0.875rem' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Description</label>
                                    <textarea
                                        rows={2}
                                        placeholder="Detailed analysis..."
                                        value={point.description}
                                        onChange={(e) => handlePointChange(index, 'description', e.target.value)}
                                        style={{ resize: 'vertical', padding: '0.625rem', fontSize: '0.875rem', minHeight: '60px' }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Third Card - Image Preview */}
                <div className="clean-card" style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: '1rem',
                    overflow: 'hidden'
                }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', flexShrink: 0 }}>
                        Chart Image
                    </h3>
                    
                    <div style={{ 
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        overflow: 'hidden'
                    }}>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                                border: '2px dashed var(--border-color)',
                                borderRadius: '8px',
                                padding: '0.75rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                cursor: 'pointer',
                                background: 'var(--bg-secondary)',
                                transition: 'all 0.2s ease',
                                flexShrink: 0
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = 'var(--bg-tertiary)';
                                e.currentTarget.style.borderColor = 'var(--accent-primary)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = 'var(--bg-secondary)';
                                e.currentTarget.style.borderColor = 'var(--border-color)';
                            }}
                        >
                            <Upload size={18} />
                            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{image ? 'Change Image' : 'Upload Image'}</span>
                            <input
                                type="file"
                                ref={fileInputRef}
                                hidden
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </div>

                        <div style={{ 
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: image ? '#000' : 'var(--bg-secondary)',
                            borderRadius: '8px',
                            border: '1px solid var(--border-color)',
                            overflow: 'hidden',
                            position: 'relative'
                        }}>
                            {image ? (
                                <>
                                    <img 
                                        src={image} 
                                        alt="Preview" 
                                        style={{ 
                                            maxWidth: '100%', 
                                            maxHeight: '100%', 
                                            objectFit: 'contain' 
                                        }} 
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setImage(null)}
                                        style={{ 
                                            position: 'absolute',
                                            top: '0.75rem',
                                            right: '0.75rem',
                                            color: 'white',
                                            background: 'rgba(239, 68, 68, 0.9)',
                                            padding: '0.5rem',
                                            borderRadius: '6px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem',
                                            fontSize: '0.75rem',
                                            fontWeight: 600
                                        }}
                                    >
                                        <Trash2 size={14} />
                                        Remove
                                    </button>
                                </>
                            ) : (
                                <div style={{ 
                                    textAlign: 'center', 
                                    color: 'var(--text-muted)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '2rem'
                                }}>
                                    <Upload size={48} strokeWidth={1.5} />
                                    <div>
                                        <div style={{ fontSize: '0.9375rem', fontWeight: 500, marginBottom: '0.25rem' }}>
                                            No image uploaded
                                        </div>
                                        <div style={{ fontSize: '0.8125rem' }}>
                                            Upload to preview
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateItemPage;
