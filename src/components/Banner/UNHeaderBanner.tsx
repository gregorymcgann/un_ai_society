import React from 'react';
import { Globe, ShieldCheck } from 'lucide-react';

export const UNHeaderBanner: React.FC = () => {
  return (
    <div style={{
      background: 'linear-gradient(90deg, #001F3F 0%, #003366 50%, #009EDB 100%)',
      color: '#FFFFFF',
      padding: '0.4rem 1rem',
      fontSize: '0.8rem',
      fontWeight: 500,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25rem',
          background: 'rgba(255, 255, 255, 0.15)',
          padding: '0.15rem 0.5rem',
          borderRadius: '4px',
          fontSize: '0.7rem',
          fontWeight: 600,
          letterSpacing: '0.05em'
        }}>
          <Globe size={12} /> UNITED NATIONS
        </span>
        <span>Global AI Governance Initiative & Member Portal</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#BEE3F8' }}>
          <ShieldCheck size={13} /> Microsoft Entra ID Verified
        </span>
      </div>
    </div>
  );
};
