import React from 'react';

const EmptyPage: React.FC = () => {
    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)'
        }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Coming Soon</h2>
            <p>This section is currently under development.</p>
        </div>
    );
};

export default EmptyPage;
