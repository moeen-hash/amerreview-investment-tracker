import React, { useState, useEffect } from 'react';
import { Lock, TrendingUp } from 'lucide-react';

interface LoginPageProps {
    onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                localStorage.setItem('isAuthenticated', 'true');
                onLogin();
            } else {
                setError(data.message || 'Invalid password');
            }
        } catch (err) {
            setError('Connection error. Make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-primary)',
            padding: '1rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background decoration */}
            <div style={{
                position: 'absolute',
                top: '-10%',
                right: '-10%',
                width: '40%',
                height: '40%',
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(60px)',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-10%',
                left: '-10%',
                width: '40%',
                height: '40%',
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(60px)',
                pointerEvents: 'none'
            }} />

            <div style={{
                background: 'var(--card-bg)',
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-lg)',
                padding: '3rem 2.5rem',
                width: '100%',
                maxWidth: '420px',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginBottom: '2rem'
                }}>
                    <img 
                        src="/Group 1.png" 
                        alt="AmerReview Logo" 
                        style={{ 
                            height: '48px', 
                            width: 'auto',
                            marginBottom: '1.5rem'
                        }} 
                    />
                    <p style={{
                        color: 'var(--text-secondary)',
                        fontSize: '0.9375rem',
                        textAlign: 'center'
                    }}>
                        Investment Tracking System
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                            marginBottom: '0.5rem'
                        }}>
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{
                                position: 'absolute',
                                left: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--text-muted)',
                                pointerEvents: 'none'
                            }} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                disabled={loading}
                                autoFocus
                                style={{
                                    width: '100%',
                                    padding: '0.875rem 1rem 0.875rem 3rem',
                                    fontSize: '0.9375rem',
                                    border: '2px solid var(--border-color)',
                                    borderRadius: '10px',
                                    outline: 'none',
                                    transition: 'all 0.2s',
                                    boxSizing: 'border-box',
                                    background: 'var(--bg-tertiary)',
                                    color: 'var(--text-primary)'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = 'var(--accent-primary)';
                                    e.target.style.background = 'var(--bg-secondary)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'var(--border-color)';
                                    e.target.style.background = 'var(--bg-tertiary)';
                                }}
                            />
                        </div>
                    </div>

                    {error && (
                        <div style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: 'var(--danger)',
                            padding: '0.875rem 1rem',
                            borderRadius: '10px',
                            fontSize: '0.875rem',
                            marginBottom: '1.5rem',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <span style={{ fontSize: '1.125rem' }}>⚠</span>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !password}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: 'white',
                            background: loading || !password 
                                ? 'var(--bg-tertiary)' 
                                : 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: loading || !password ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                            opacity: loading || !password ? 0.5 : 1,
                            boxShadow: loading || !password ? 'none' : '0 4px 16px rgba(59, 130, 246, 0.4)'
                        }}
                        onMouseEnter={(e) => {
                            if (!loading && password) {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 6px 24px rgba(59, 130, 246, 0.5)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.4)';
                        }}
                    >
                        {loading ? (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <span style={{
                                    width: '16px',
                                    height: '16px',
                                    border: '2px solid rgba(255,255,255,0.3)',
                                    borderTopColor: 'white',
                                    borderRadius: '50%',
                                    animation: 'spin 0.8s linear infinite'
                                }} />
                                Verifying...
                            </span>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <div style={{
                    marginTop: '2rem',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid var(--border-color)',
                    textAlign: 'center',
                    fontSize: '0.8125rem',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                }}>
                    <Lock size={14} />
                    <span>Secure access • Protected system</span>
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default LoginPage;
