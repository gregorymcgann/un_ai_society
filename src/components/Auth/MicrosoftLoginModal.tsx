import React, { useState } from 'react';
import { X, Shield, Lock, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MOCK_USERS } from '../../services/mockData';

export const MicrosoftLoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, loginAsUser, loginWithMicrosoft } = useAuth();
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [departmentInput, setDepartmentInput] = useState('UN Global Pulse / Technology Bureau');
  const [activeTab, setActiveTab] = useState<'quick' | 'custom'>('quick');

  if (!isLoginModalOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    loginWithMicrosoft(emailInput, nameInput, departmentInput);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 31, 63, 0.65)',
        backdropFilter: 'blur(8px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        className="glass-panel animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '480px',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          backgroundColor: 'var(--surface-card)',
          border: '1px solid var(--surface-border)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div style={{
          background: 'linear-gradient(135deg, #002244 0%, #003366 60%, #009EDB 100%)',
          padding: '1.5rem',
          color: 'white',
          position: 'relative',
        }}>
          <button
            onClick={closeLoginModal}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Shield size={22} color="#FFFFFF" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
                Microsoft Entra ID
              </h2>
              <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                United Nations Single Sign-On (UN Auth)
              </span>
            </div>
          </div>
          <p style={{ fontSize: '0.8rem', opacity: 0.85, marginTop: '0.5rem', margin: 0 }}>
            Sign in with your official @un.org or agency credentials to access confidential event meeting links and delegate RSVPs.
          </p>
        </div>

        <div style={{ display: 'flex', borderBottom: '1px solid var(--surface-border)', background: 'var(--bg-primary)' }}>
          <button
            onClick={() => setActiveTab('quick')}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: 'none',
              borderBottom: activeTab === 'quick' ? '2px solid var(--un-blue)' : 'none',
              background: activeTab === 'quick' ? 'var(--surface-card)' : 'transparent',
              color: activeTab === 'quick' ? 'var(--un-blue)' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            Select Pre-Verified UN Delegate
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: 'none',
              borderBottom: activeTab === 'custom' ? '2px solid var(--un-blue)' : 'none',
              background: activeTab === 'custom' ? 'var(--surface-card)' : 'transparent',
              color: activeTab === 'custom' ? 'var(--un-blue)' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            Custom @un.org Sign In
          </button>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {activeTab === 'quick' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                Choose a sample verified UN profile to explore role permissions:
              </p>

              {MOCK_USERS.map((user) => (
                <div
                  key={user.uid}
                  onClick={() => loginAsUser(user.uid)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--surface-border)',
                    backgroundColor: 'var(--surface-card)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--un-blue)';
                    e.currentTarget.style.backgroundColor = 'var(--un-blue-light)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--surface-border)';
                    e.currentTarget.style.backgroundColor = 'var(--surface-card)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                        {user.displayName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {user.email}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--un-blue)', marginTop: '0.15rem' }}>
                        {user.department}
                      </div>
                    </div>
                  </div>

                  <span className="un-badge badge-keynote" style={{ fontSize: '0.65rem' }}>
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleCustomSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ambassador Maria Santos"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--surface-border)',
                    background: 'var(--surface-card)',
                    color: 'var(--text-main)',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                  UN Email Address (@un.org)
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. m.santos@un.org"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--surface-border)',
                    background: 'var(--surface-card)',
                    color: 'var(--text-main)',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                  UN Agency / Organization
                </label>
                <input
                  type="text"
                  placeholder="e.g. UNICRI / UNDP / ITU / UNESCO"
                  value={departmentInput}
                  onChange={(e) => setDepartmentInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--surface-border)',
                    background: 'var(--surface-card)',
                    color: 'var(--text-main)',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn-un-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', marginTop: '0.5rem' }}
              >
                <UserCheck size={18} /> Complete OAuth UN Sign-In
              </button>
            </form>
          )}
        </div>

        <div style={{
          padding: '0.85rem 1.5rem',
          background: 'var(--bg-primary)',
          borderTop: '1px solid var(--surface-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
        }}>
          <Lock size={12} /> Encrypted via Azure AD / UN Tenant OAuth 2.0 Security
        </div>
      </div>
    </div>
  );
};
