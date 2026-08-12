import React, { useState } from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  Mail, 
  Lock, 
  User, 
  Building2, 
  Sparkles,
  CheckCircle2,
  Sun,
  Moon,
  ArrowLeft,
  Send
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import PixelBlast from '../Background/PixelBlast';

interface AuthPageProps {
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  theme: propTheme,
  toggleTheme: propToggleTheme,
}) => {
  const { 
    signInWithEmail, 
    signUpWithEmail, 
    sendPasswordReset 
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'create' | 'forgot'>('signin');

  const [internalTheme, setInternalTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('un_ai_society_theme') as 'light' | 'dark') || 'light';
    }
    return 'light';
  });

  const theme = propTheme || internalTheme;
  const toggleTheme = propToggleTheme || (() => {
    const next = theme === 'light' ? 'dark' : 'light';
    setInternalTheme(next);
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('un_ai_society_theme', next);
    }
  });

  const isLight = theme === 'light';
  
  // Form fields state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getReadableAuthError = (err: any) => {
    const code = err?.code || '';
    if (code === 'auth/email-already-in-use') {
      return 'This email address is already registered. Please sign in or recover your password.';
    }
    if (code === 'auth/invalid-email') {
      return 'Please enter a valid email address.';
    }
    if (code === 'auth/weak-password') {
      return 'Password should be at least 6 characters long.';
    }
    if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
      return 'Invalid email or password. Please check your credentials and try again.';
    }
    if (code === 'auth/too-many-requests') {
      return 'Too many failed login attempts. Please reset your password or try again later.';
    }
    return err?.message || 'Authentication failed. Please try again.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setError('Please enter a valid UN email address');
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'forgot') {
        await sendPasswordReset(email.trim());
        setSuccessMsg(`Password reset email sent to ${email.trim()}! Check your inbox to reset your password.`);
      } else if (mode === 'create') {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setIsLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setIsLoading(false);
          return;
        }
        await signUpWithEmail(
          email.trim(),
          password,
          fullName.trim() || email.trim().split('@')[0],
          department
        );
      } else {
        // signin mode
        if (!password) {
          setError('Please enter your password');
          setIsLoading(false);
          return;
        }
        await signInWithEmail(email.trim(), password);
      }
    } catch (err: any) {
      setError(getReadableAuthError(err));
    } finally {
      setIsLoading(false);
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
      transition: 'background-color 0.3s ease, color 0.3s ease',
    }}>
      {/* Interactive Pixel Background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'auto',
        opacity: isLight ? 0.4 : 1,
        transition: 'opacity 0.3s ease',
      }}>
        <PixelBlast
          key={isLight ? 'light-mode' : 'dark-mode'}
          variant="square"
          pixelSize={4}
          color={isLight ? '#C5E3F6' : '#003366'}
          patternScale={2.2}
          patternDensity={isLight ? 0.6 : 1}
          pixelSizeJitter={0}
          enableRipples
          rippleSpeed={0.35}
          rippleThickness={0.12}
          rippleIntensityScale={isLight ? 0.8 : 1.5}
          liquid={false}
          liquidStrength={0.12}
          liquidRadius={1.2}
          liquidWobbleSpeed={5}
          speed={0.4}
          edgeFade={isLight ? 0.4 : 0.25}
          transparent
        />
      </div>

      {/* Ambient background glow */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '1000px',
        height: '600px',
        background: isLight 
          ? 'radial-gradient(ellipse at center, rgba(0, 158, 219, 0.12) 0%, rgba(0, 158, 219, 0.04) 45%, transparent 70%)'
          : 'radial-gradient(ellipse at center, rgba(0, 158, 219, 0.15) 0%, rgba(0, 51, 102, 0.1) 45%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      {/* Top Header Bar */}
      <header style={{
        position: 'relative',
        zIndex: 10,
        padding: '1.75rem 2.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '1rem',
      }}>
        <button
          onClick={toggleTheme}
          style={{
            background: isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.1)',
            border: `1px solid ${isLight ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.15)'}`,
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: isLight ? '#0F172A' : '#F8FAFC',
            transition: 'all 0.2s ease',
          }}
          title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
        >
          {isLight ? <Moon size={18} /> : <Sun size={18} color="#FFB800" />}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: isLight ? '#475569' : '#64748B' }}>
          <ShieldCheck size={16} color="#009EDB" />
          <span>Firebase & Entra ID Security</span>
        </div>
      </header>

      {/* Main Content Body */}
      <main style={{
        position: 'relative',
        zIndex: 10,
        flex: 1,
        maxWidth: '680px',
        width: '100%',
        margin: '0 auto',
        padding: '2rem 1.5rem 4rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
      }}>

        {/* Hero Section */}
        <div style={{ marginBottom: '2.5rem' }}>
          <img 
            src={isLight ? "/UN_AI_Society_Logo.png" : "/un_ai_society_logo_white.png"}
            alt="UN AI Society Logo" 
            style={{ 
              height: '72px', 
              width: 'auto', 
              objectFit: 'contain',
              marginBottom: '1.5rem',
              filter: isLight 
                ? 'drop-shadow(0 4px 12px rgba(0, 158, 219, 0.18))'
                : 'drop-shadow(0 4px 12px rgba(0, 158, 219, 0.25))'
            }} 
          />

          <h1 style={{ 
            fontSize: '2.25rem', 
            fontWeight: 800, 
            color: isLight ? '#0F172A' : '#FFFFFF', 
            margin: '0 0 0.6rem 0',
            letterSpacing: '-0.03em',
            lineHeight: 1.2,
          }}>
            {mode === 'signin' ? 'Sign In to UN AI Society' : 
             mode === 'create' ? 'Create UN AI Society Account' : 'Password Recovery'}
          </h1>
          <p style={{ 
            fontSize: '1.05rem', 
            color: isLight ? '#475569' : '#94A3B8', 
            margin: '0 0 1.5rem 0', 
            lineHeight: 1.6,
            maxWidth: '540px' 
          }}>
            {mode === 'forgot'
              ? 'Enter your registered email address to receive a secure password reset link.'
              : 'Access society events and delegate resources.'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        {mode !== 'forgot' ? (
          <div style={{
            display: 'flex',
            gap: '2rem',
            borderBottom: `1px solid ${isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'}`,
            marginBottom: '2rem',
            paddingBottom: '0.75rem',
          }}>
            <button
              type="button"
              onClick={() => { setMode('signin'); setError(null); setSuccessMsg(null); }}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '1rem',
                fontWeight: mode === 'signin' ? 700 : 500,
                color: mode === 'signin' ? '#009EDB' : (isLight ? '#64748B' : '#94A3B8'),
                cursor: 'pointer',
                padding: 0,
                position: 'relative',
                transition: 'color 0.2s ease',
              }}
            >
              Sign In
              {mode === 'signin' && (
                <span style={{
                  position: 'absolute',
                  bottom: '-0.85rem',
                  left: 0,
                  right: 0,
                  height: '2px',
                  backgroundColor: '#009EDB',
                  borderRadius: '2px',
                }} />
              )}
            </button>

            <button
              type="button"
              onClick={() => { setMode('create'); setError(null); setSuccessMsg(null); }}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '1rem',
                fontWeight: mode === 'create' ? 700 : 500,
                color: mode === 'create' ? '#009EDB' : (isLight ? '#64748B' : '#94A3B8'),
                cursor: 'pointer',
                padding: 0,
                position: 'relative',
                transition: 'color 0.2s ease',
              }}
            >
              Create Account
              {mode === 'create' && (
                <span style={{
                  position: 'absolute',
                  bottom: '-0.85rem',
                  left: 0,
                  right: 0,
                  height: '2px',
                  backgroundColor: '#009EDB',
                  borderRadius: '2px',
                }} />
              )}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => { setMode('signin'); setError(null); setSuccessMsg(null); }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'transparent',
              border: 'none',
              color: '#009EDB',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: '1.5rem',
              padding: 0,
            }}
          >
            <ArrowLeft size={16} /> Back to Sign In
          </button>
        )}

        {/* Error notification */}
        {error && (
          <div style={{
            color: '#EF4444',
            fontSize: '0.875rem',
            marginBottom: '1.5rem',
            padding: '0.75rem 1rem',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <span>•</span> {error}
          </div>
        )}

        {/* Success Notification */}
        {successMsg && (
          <div style={{
            color: isLight ? '#065F46' : '#6EE7B7',
            fontSize: '0.9rem',
            fontWeight: 500,
            marginBottom: '1.5rem',
            padding: '0.85rem 1rem',
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <CheckCircle2 size={18} color="#10B981" /> {successMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Create Account Fields */}
          {mode === 'create' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: isLight ? '#334155' : '#CBD5E1', marginBottom: '0.5rem' }}>
                Full Name
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <User size={18} style={{ position: 'absolute', left: '0.75rem', color: '#64748B' }} />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                    background: isLight ? 'rgba(0, 0, 0, 0.03)' : 'rgba(255, 255, 255, 0.04)',
                    border: `1px solid ${isLight ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)'}`,
                    borderRadius: '8px',
                    color: isLight ? '#0F172A' : '#FFFFFF',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#009EDB')}
                  onBlur={(e) => (e.target.style.borderColor = isLight ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)')}
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: isLight ? '#334155' : '#CBD5E1', marginBottom: '0.5rem' }}>
              Email Address
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={18} style={{ position: 'absolute', left: '0.75rem', color: '#64748B' }} />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.5rem',
                  background: isLight ? 'rgba(0, 0, 0, 0.03)' : 'rgba(255, 255, 255, 0.04)',
                  border: `1px solid ${isLight ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)'}`,
                  borderRadius: '8px',
                  color: isLight ? '#0F172A' : '#FFFFFF',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#009EDB')}
                onBlur={(e) => (e.target.style.borderColor = isLight ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)')}
              />
            </div>
          </div>

          {/* Department Field for Create Account */}
          {mode === 'create' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: isLight ? '#334155' : '#CBD5E1', marginBottom: '0.5rem' }}>
                Agency / Organization
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Building2 size={18} style={{ position: 'absolute', left: '0.75rem', color: '#64748B' }} />
                <input
                  type="text"
                  placeholder="Organization or Agency Name"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                    background: isLight ? 'rgba(0, 0, 0, 0.03)' : 'rgba(255, 255, 255, 0.04)',
                    border: `1px solid ${isLight ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)'}`,
                    borderRadius: '8px',
                    color: isLight ? '#0F172A' : '#FFFFFF',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#009EDB')}
                  onBlur={(e) => (e.target.style.borderColor = isLight ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)')}
                />
              </div>
            </div>
          )}

          {/* Password Field */}
          {mode !== 'forgot' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 500, color: isLight ? '#334155' : '#CBD5E1' }}>
                  Password
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setError(null); setSuccessMsg(null); }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#009EDB',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Lock size={18} style={{ position: 'absolute', left: '0.75rem', color: '#64748B' }} />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                    background: isLight ? 'rgba(0, 0, 0, 0.03)' : 'rgba(255, 255, 255, 0.04)',
                    border: `1px solid ${isLight ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)'}`,
                    borderRadius: '8px',
                    color: isLight ? '#0F172A' : '#FFFFFF',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#009EDB')}
                  onBlur={(e) => (e.target.style.borderColor = isLight ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)')}
                />
              </div>
            </div>
          )}

          {/* Confirm Password for Create Account */}
          {mode === 'create' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: isLight ? '#334155' : '#CBD5E1', marginBottom: '0.5rem' }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Lock size={18} style={{ position: 'absolute', left: '0.75rem', color: '#64748B' }} />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                    background: isLight ? 'rgba(0, 0, 0, 0.03)' : 'rgba(255, 255, 255, 0.04)',
                    border: `1px solid ${isLight ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)'}`,
                    borderRadius: '8px',
                    color: isLight ? '#0F172A' : '#FFFFFF',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#009EDB')}
                  onBlur={(e) => (e.target.style.borderColor = isLight ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)')}
                />
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              marginTop: '0.5rem',
              padding: '0.85rem 1.5rem',
              backgroundColor: '#009EDB',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0086BC')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#009EDB')}
          >
            {isLoading ? (
              <span>Processing...</span>
            ) : mode === 'signin' ? (
              <>
                <UserCheck size={18} /> Sign In to Portal
              </>
            ) : mode === 'create' ? (
              <>
                <Sparkles size={18} /> Create Account & Verify Email
              </>
            ) : (
              <>
                <Send size={18} /> Send Reset Link
              </>
            )}
          </button>
        </form>

      </main>

      {/* Footer */}
      <footer style={{
        position: 'relative',
        zIndex: 10,
        padding: '1.5rem',
        textAlign: 'center',
        fontSize: '0.75rem',
        color: isLight ? '#64748B' : '#475569',
        borderTop: `1px solid ${isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.05)'}`,
      }}>
        United Nations AI Society • Official Delegate Portal • Firebase & Microsoft Entra ID Authentication Framework
      </footer>
    </div>
  );
};
