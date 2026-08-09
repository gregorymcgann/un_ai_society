import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  UserCheck, 
  Mail, 
  Lock, 
  User, 
  Building2, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MOCK_USERS } from '../../services/mockData';

export const AuthPage: React.FC = () => {
  const { loginWithMicrosoft, loginAsUser, setCurrentPage } = useAuth();
  const [mode, setMode] = useState<'signin' | 'create'>('signin');
  
  // Form fields state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('UN Global Pulse / Technology Bureau');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please enter a valid UN email address');
      return;
    }

    if (mode === 'create') {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
    }

    setIsLoading(true);
    try {
      await loginWithMicrosoft(
        email, 
        mode === 'create' ? fullName || email.split('@')[0] : undefined, 
        department
      );
    } catch (err) {
      setError('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#040C16',
      color: '#F8FAFC',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Roboto', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient background glow - unboxed and fluid */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '1000px',
        height: '600px',
        background: 'radial-gradient(ellipse at center, rgba(0, 158, 219, 0.15) 0%, rgba(0, 51, 102, 0.1) 45%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Top Header Bar - Flat navigation */}
      <header style={{
        position: 'relative',
        zIndex: 10,
        padding: '1.75rem 2.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <button
          onClick={() => setCurrentPage('calendar')}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94A3B8',
            fontSize: '0.9rem',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: 0,
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#009EDB')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
        >
          <ArrowLeft size={18} /> Return to Event Calendar
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#64748B' }}>
          <ShieldCheck size={16} color="#009EDB" />
          <span>UN Entra ID Single Sign-On</span>
        </div>
      </header>

      {/* Main Content Body - Completely Flat & Unboxed */}
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

        {/* ------------------------------------------------------------- */}
        {/* Microsoft Login & Logo Section - FLAT UNBOXED WITH LOGO LEFT  */}
        {/* ------------------------------------------------------------- */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          flexWrap: 'wrap',
          marginBottom: '2.5rem',
          paddingBottom: '2rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
          {/* Logo on the left of Microsoft button */}
          <img 
            src="/un_ai_society_logo_white.png" 
            alt="UN AI Society Logo" 
            style={{ 
              height: '44px', 
              width: 'auto', 
              objectFit: 'contain',
              filter: 'drop-shadow(0 2px 8px rgba(0, 158, 219, 0.2))'
            }} 
          />

          {/* Login with Microsoft Option Text Button - UNBOXED */}
          <button
            type="button"
            onClick={() => loginWithMicrosoft()}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              padding: '0.4rem 0',
              color: '#FFFFFF',
              fontSize: '1.15rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.65rem',
              letterSpacing: '-0.01em',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#38BDF8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#FFFFFF';
            }}
          >
            {/* Official 4-color Microsoft Symbol */}
            <svg width="22" height="22" viewBox="0 0 23 23" fill="none" style={{ flexShrink: 0 }}>
              <path fill="#F35325" d="M1 1h10v10H1z"/>
              <path fill="#81BC06" d="M12 1h10v10H12z"/>
              <path fill="#05A6F0" d="M1 12h10v10H1z"/>
              <path fill="#FFBA08" d="M12 12h10v10H12z"/>
            </svg>
            <span style={{ 
              borderBottom: '2px solid rgba(0, 158, 219, 0.6)', 
              paddingBottom: '2px' 
            }}>
              Login with Microsoft
            </span>
          </button>
        </div>

        {/* Hero Title & Subtitle */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ 
            fontSize: '2.25rem', 
            fontWeight: 800, 
            color: '#FFFFFF', 
            margin: '0 0 0.6rem 0',
            letterSpacing: '-0.03em',
            lineHeight: 1.2,
          }}>
            {mode === 'signin' ? 'Sign In to UN AI Society' : 'Create UN AI Account'}
          </h1>
          <p style={{ 
            fontSize: '1rem', 
            color: '#94A3B8', 
            margin: 0, 
            lineHeight: 1.6,
            maxWidth: '540px' 
          }}>
            Access confidential UN AI governance working groups, policy briefs, and verified delegate event RSVPs using the same portal.
          </p>
        </div>

        {/* Unboxed Mode Switcher Tabs */}
        <div style={{
          display: 'flex',
          gap: '2rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '2rem',
          paddingBottom: '0.75rem',
        }}>
          <button
            type="button"
            onClick={() => { setMode('signin'); setError(null); }}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '1rem',
              fontWeight: mode === 'signin' ? 700 : 500,
              color: mode === 'signin' ? '#009EDB' : '#64748B',
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
            onClick={() => { setMode('create'); setError(null); }}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '1rem',
              fontWeight: mode === 'create' ? 700 : 500,
              color: mode === 'create' ? '#009EDB' : '#64748B',
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

        {/* Error notification */}
        {error && (
          <div style={{
            color: '#F87171',
            fontSize: '0.875rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <span>•</span> {error}
          </div>
        )}

        {/* Flat Unboxed Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Create Account Fields */}
          {mode === 'create' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#CBD5E1', marginBottom: '0.5rem' }}>
                Full Name
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <User size={18} style={{ position: 'absolute', left: '0.75rem', color: '#64748B' }} />
                <input
                  type="text"
                  placeholder="e.g. Dr. Helena Vance"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#009EDB')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
                />
              </div>
            </div>
          )}

          {/* UN Email Field */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#CBD5E1', marginBottom: '0.5rem' }}>
              UN Email Address (@un.org)
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={18} style={{ position: 'absolute', left: '0.75rem', color: '#64748B' }} />
              <input
                type="email"
                required
                placeholder="e.g. delegate@un.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.5rem',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#009EDB')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
              />
            </div>
          </div>

          {/* Department Field for Create Account */}
          {mode === 'create' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#CBD5E1', marginBottom: '0.5rem' }}>
                UN Agency / Organization
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Building2 size={18} style={{ position: 'absolute', left: '0.75rem', color: '#64748B' }} />
                <input
                  type="text"
                  placeholder="e.g. UNICRI / UNDP / ITU / UNESCO"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#009EDB')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
                />
              </div>
            </div>
          )}

          {/* Password Field */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#CBD5E1', marginBottom: '0.5rem' }}>
              Password
            </label>
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
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#009EDB')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
              />
            </div>
          </div>

          {/* Confirm Password for Create Account */}
          {mode === 'create' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#CBD5E1', marginBottom: '0.5rem' }}>
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
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#009EDB')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
                />
              </div>
            </div>
          )}

          {/* Action Button - Unboxed flat accent */}
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
              <span>Authenticating...</span>
            ) : mode === 'signin' ? (
              <>
                <UserCheck size={18} /> Sign In to Portal
              </>
            ) : (
              <>
                <Sparkles size={18} /> Create Society Account
              </>
            )}
          </button>
        </form>

        {/* Flat Unboxed Fast Access Demo Profiles */}
        <div style={{ marginTop: '3.5rem', paddingTop: '2rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
            Fast Demo Delegate Access (1-Click Sign In):
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {MOCK_USERS.map((user) => (
              <div
                key={user.uid}
                onClick={() => loginAsUser(user.uid)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 0',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#F1F5F9' }}>
                      {user.displayName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                      {user.email} • <span style={{ color: '#009EDB' }}>{user.department}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#38BDF8', fontWeight: 500 }}>
                  <CheckCircle2 size={14} /> Direct Sign In
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Flat Footer */}
      <footer style={{
        position: 'relative',
        zIndex: 10,
        padding: '1.5rem',
        textAlign: 'center',
        fontSize: '0.75rem',
        color: '#475569',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      }}>
        United Nations AI Society • Official Delegate Portal • Microsoft Entra ID Authentication Framework
      </footer>
    </div>
  );
};
