import React from 'react';
import { X, Download, ExternalLink, Calendar as CalendarIcon } from 'lucide-react';
import type { SocietyEvent } from '../../types';
import { downloadICSFile, getGoogleCalendarUrl, getOutlookCalendarUrl } from '../../utils/calendarExport';

interface ExportCalendarModalProps {
  event: SocietyEvent;
  onClose: () => void;
}

export const ExportCalendarModal: React.FC<ExportCalendarModalProps> = ({ event, onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 15, 30, 0.6)',
      backdropFilter: 'blur(6px)',
      zIndex: 110,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
    }}>
      <div
        className="glass-panel animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '420px',
          borderRadius: 'var(--radius-xl)',
          backgroundColor: 'var(--surface-card)',
          padding: '1.5rem',
          boxShadow: 'var(--glass-shadow)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CalendarIcon size={20} color="var(--un-blue)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
              Export to Calendar
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
            }}
          >
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.4 }}>
          Add <strong>{event.title}</strong> directly to your personal calendar or diplomatic scheduling software.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            onClick={() => {
              downloadICSFile(event);
              onClose();
            }}
            className="btn-un-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.7rem' }}
          >
            <Download size={16} /> Download iCalendar (.ics) File
          </button>

          <a
            href={getGoogleCalendarUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="btn-un-secondary"
            style={{ textDecoration: 'none', width: '100%', justifyContent: 'center', padding: '0.7rem' }}
          >
            <ExternalLink size={16} /> Add to Google Calendar
          </a>

          <a
            href={getOutlookCalendarUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="btn-un-secondary"
            style={{ textDecoration: 'none', width: '100%', justifyContent: 'center', padding: '0.7rem' }}
          >
            <ExternalLink size={16} /> Add to Outlook / UN Teams
          </a>
        </div>
      </div>
    </div>
  );
};
