import React, { useState } from 'react';
import { Mail, CheckCircle2, RefreshCw, LogOut, ShieldAlert, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import PixelBlast from '../Background/PixelBlast';

interface EmailVerificationViewProps {
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
}

export const EmailVerificationView: React.FC<EmailVerificationViewProps> = ({
  theme: propTheme,
}) => {
  const { currentUser, reloadAndCheckVerification, resendVerificationEmail, logout } = useAuth();
  
  const [internalTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('un_ai_society_theme') as 'light' | 'dark') || 'light';
    }
    return 'light';
  });

  const theme = propTheme || internalTheme;
  const isLight = theme === 'light';

  const [isChecking, setIsChecking] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const handleCheckStatus = async () => {
    setIsChecking(true);
    setMessage(null);
    try {
      const verified = await reloadAndCheckVerification();
      if (verified) {
        setMessage({
          type: 'success',
          text: 'Email verified successfully! Redirecting to UN AI Society Portal...'
        });
      } else {
        setMessage({
          type: 'error',
          text: 'Email is not verified yet. Please check your inbox (and spam folder) for the verification email.'
        });
      }
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err?.message || 'Failed to check verification status. Please try again.'
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleResendEmail = async () => {
    setIsResending(true);
    setMessage(null);
    try {
      await resendVerificationEmail();
      setMessage({
        type: 'info',
        text: `Verification email resent to ${currentUser?.email || 'your email'}. Check your inbox!`
      });
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err?.message || 'Failed to resend verification email. Please try again in a few minutes.'
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: isLight ? '#FFFFFF' : '#040C16',
      color: isLight ? '#0F172A' : '#F8FAFC',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Roboto', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background Effect */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'auto',
        opacity: isLight ? 0.4 : 1,
      }}>
        <PixelBlast
          key={isLight ? 'light-mode' : 'dark-mode'}
          variant="square"
          pixelSize={4}
          color={isLight ? '#C5E3F6' : '#003366'}
          patternScale={2.2}
          patternDensity={isLight ? 0.6 : 1}
          speed={0.4}
          transparent
        />
      </div>

      {/* Main Container */}
      <main style={{
        position: 'relative',
        zIndex: 10,
        flex: 1,
        maxWidth: '560px',
        width: '100%',
        margin: 'auto',
        padding: '3rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}>
        
        {/* Animated Badge Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: isLight ? 'rgba(0, 158, 219, 0.1)' : 'rgba(0, 158, 219, 0.2)',
          border: '2px solid #009EDB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem',
          boxShadow: '0 8px 24px rgba(0, 158, 219, 0.25)',
        }}>
          <Mail size={38} color="#009EDB" />
        </div>

        <h1 style={{
          fontSize: '2rem',
          fontWeight: 800,
          margin: '0 0 0.75rem 0',
          letterSpacing: '-0.02em',
          color: isLight ? '#0F172A' : '#FFFFFF',
        }}>
          Verify Your Email Address
        </h1>

        <p style={{
          fontSize: '1rem',
          color: isLight ? '#475569' : '#94A3B8',
          lineHeight: 1.6,
          margin: '0 0 1.5rem 0',
          maxWidth: '460px',
        }}>
          We sent a verification link to: <br />
          <strong style={{ color: '#009EDB', fontSize: '1.05rem', wordBreak: 'break-all' }}>
            {currentUser?.email || 'your email address'}
          </strong>
        </p>

        <div style={{
          backgroundColor: isLight ? 'rgba(0, 158, 219, 0.06)' : 'rgba(0, 158, 219, 0.1)',
          border: `1px solid ${isLight ? 'rgba(0, 158, 219, 0.2)' : 'rgba(0, 158, 219, 0.3)'}`,
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          marginBottom: '2rem',
          width: '100%',
          textAlign: 'left',
          fontSize: '0.9rem',
          color: isLight ? '#334155' : '#CBD5E1',
          lineHeight: 1.5,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <ShieldAlert size={20} color="#009EDB" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>UN AI Society Security Notice:</strong>
              <p style={{ margin: '0.35rem 0 0 0' }}>
                Email verification is required before accessing UN AI Society calendar events and committee resources. Please check your inbox and click the verification link.
              </p>
            </div>
          </div>
        </div>

        {/* Message Banner */}
        {message && (
          <div style={{
            width: '100%',
            padding: '0.85rem 1rem',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: 500,
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textAlign: 'left',
            backgroundColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.15)' :
                             message.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(0, 158, 219, 0.15)',
            border: `1px solid ${message.type === 'success' ? '#10B981' :
                                 message.type === 'error' ? '#EF4444' : '#009EDB'}`,
            color: message.type === 'success' ? (isLight ? '#065F46' : '#6EE7B7') :
                   message.type === 'error' ? (isLight ? '#991B1B' : '#FCA5A5') : (isLight ? '#075985' : '#7DD3FC'),
          }}>
            {message.type === 'success' ? <CheckCircle2 size={18} /> : <ShieldAlert size={18} />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Primary & Secondary Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
          
          <button
            type="button"
            onClick={handleCheckStatus}
            disabled={isChecking}
            style={{
              width: '100%',
              padding: '0.85rem 1.5rem',
              backgroundColor: '#009EDB',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: isChecking ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 14px rgba(0, 158, 219, 0.3)',
            }}
          >
            {isChecking ? (
              <>
                <RefreshCw size={18} className="spin-animation" style={{ animation: 'spin 1s linear infinite' }} />
                <span>Checking Verification Status...</span>
              </>
            ) : (
              <>
                <span>I've Verified My Email</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleResendEmail}
            disabled={isResending}
            style={{
              width: '100%',
              padding: '0.8rem 1.5rem',
              backgroundColor: 'transparent',
              color: isLight ? '#0F172A' : '#F8FAFC',
              border: `1px solid ${isLight ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.2)'}`,
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: 500,
              cursor: isResending ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease',
            }}
          >
            <RefreshCw size={16} />
            <span>{isResending ? 'Resending Link...' : 'Resend Verification Email'}</span>
          </button>

          <button
            type="button"
            onClick={logout}
            style={{
              marginTop: '0.5rem',
              padding: '0.6rem 1rem',
              backgroundColor: 'transparent',
              color: '#64748B',
              border: 'none',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}
          >
            <LogOut size={15} />
            <span>Sign Out / Use Different Account</span>
          </button>
        </div>

      </main>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
