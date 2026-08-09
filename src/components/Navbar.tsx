import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  LogOut, 
  ChevronDown, 
  Moon, 
  Sun,
  Shield,
  Building
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import type { UserRole } from '../types';

export const Navbar: React.FC<{ theme: 'light' | 'dark'; toggleTheme: () => void }> = ({
  theme,
  toggleTheme,
}) => {
  const { currentUser, isAuthenticated, logout, switchUserRole, setCurrentPage } = useAuth();
  const { searchQuery, setSearchQuery, setIsCreateModalOpen } = useEvents();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const isOrganizerOrAdmin = currentUser && (currentUser.role === 'admin' || currentUser.role === 'organizer');

  return (
    <header className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 40,
      borderBottom: '1px solid var(--surface-border)',
      padding: '0.75rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
    }}>
      <div 
        onClick={() => setCurrentPage('calendar')}
        style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', cursor: 'pointer' }}
      >
        <img
          src="/UN_AI_Society_Logo.png"
          alt="UN AI Society Logo"
          style={{
            height: '48px',
            width: 'auto',
            maxHeight: '48px',
            objectFit: 'contain',
            borderRadius: '6px',
          }}
        />
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
            United Nations
          </h1>
          <p style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)', margin: 0, lineHeight: 1.2 }}>
            AI Society
          </p>
        </div>
      </div>

      <div style={{
        flex: '1',
        maxWidth: '420px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
      }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Search AI events, topics, or speakers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem 1rem 0.5rem 2.3rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--surface-border)',
            background: 'var(--surface-card)',
            color: 'var(--text-main)',
            fontSize: '0.875rem',
            outline: 'none',
            transition: 'all var(--transition-fast)',
          }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {isOrganizerOrAdmin && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-un-primary"
            style={{ fontSize: '0.85rem' }}
          >
            <Plus size={16} /> New Event
          </button>
        )}

        <button
          onClick={toggleTheme}
          className="btn-un-secondary"
          title="Toggle Light/Dark Theme"
          style={{ padding: '0.5rem', borderRadius: '50%' }}
        >
          {theme === 'dark' ? <Sun size={18} color="#FFB800" /> : <Moon size={18} />}
        </button>

        {isAuthenticated && currentUser ? (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                background: 'var(--surface-card)',
                border: '1px solid var(--surface-border)',
                padding: '0.35rem 0.65rem 0.35rem 0.4rem',
                borderRadius: '9999px',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              <img
                src={currentUser.photoURL}
                alt={currentUser.displayName}
                style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <ChevronDown size={14} color="var(--text-muted)" />
            </button>

            {isProfileMenuOpen && (
              <div
                className="glass-panel animate-fade-in"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '115%',
                  width: '280px',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1rem',
                  boxShadow: 'var(--glass-shadow)',
                  zIndex: 50,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--surface-border)' }}>
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName}
                    style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                      {currentUser.displayName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {currentUser.email}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--un-blue)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Building size={12} /> {currentUser.department}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '0.75rem', marginBottom: '0.75rem' }}>
                  <label style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Demo Role Switcher:
                  </label>
                  <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.35rem' }}>
                    {(['member', 'organizer', 'admin'] as UserRole[]).map((role) => (
                      <button
                        key={role}
                        onClick={() => switchUserRole(role)}
                        style={{
                          flex: 1,
                          padding: '0.25rem 0.4rem',
                          fontSize: '0.7rem',
                          fontWeight: currentUser.role === role ? 700 : 500,
                          borderRadius: 'var(--radius-sm)',
                          border: currentUser.role === role ? '1px solid var(--un-blue)' : '1px solid var(--surface-border)',
                          background: currentUser.role === role ? 'var(--un-blue-light)' : 'transparent',
                          color: currentUser.role === role ? 'var(--un-blue)' : 'var(--text-muted)',
                          cursor: 'pointer',
                        }}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    logout();
                  }}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(225, 29, 72, 0.2)',
                    background: 'rgba(225, 29, 72, 0.05)',
                    color: '#E11D48',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    marginTop: '0.5rem',
                  }}
                >
                  <LogOut size={14} /> Sign Out (UN SSO)
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setCurrentPage('auth')}
            className="btn-un-primary"
            style={{ fontSize: '0.85rem' }}
          >
            <Shield size={16} /> Sign In / Create Account
          </button>
        )}
      </div>
    </header>
  );
};
