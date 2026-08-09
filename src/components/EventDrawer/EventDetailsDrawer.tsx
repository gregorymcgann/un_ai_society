import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  Globe, 
  Lock, 
  Unlock, 
  Users, 
  Download, 
  Share2, 
  CheckCircle2, 
  HelpCircle, 
  XCircle, 
  Trash2,
  Shield,
  Building
} from 'lucide-react';
import { useEvents } from '../../context/EventContext';
import { useAuth } from '../../context/AuthContext';
import type { EventCategory } from '../../types';
import { ExportCalendarModal } from './ExportCalendarModal';

export const EventDetailsDrawer: React.FC = () => {
  const { selectedEvent, isDrawerOpen, closeDrawer, setRSVPStatus, getUserRSVPStatus, getEventRSVPCounts, deleteEvent } = useEvents();
  const { currentUser, isAuthenticated, openLoginModal } = useAuth();
  
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!selectedEvent) return null;

  const userRSVP = getUserRSVPStatus(selectedEvent.id);
  const counts = getEventRSVPCounts(selectedEvent.id);
  const isOwnerOrAdmin = currentUser && (currentUser.role === 'admin' || currentUser.uid === selectedEvent.createdById);

  const localTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const startDate = new Date(selectedEvent.startTime);
  const endDate = new Date(selectedEvent.endTime);

  const dateFormatted = startDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const localTimeFormatted = `${startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} - ${endDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} (${localTZ})`;

  const utcTimeFormatted = `${startDate.toISOString().substring(11, 16)} - ${endDate.toISOString().substring(11, 16)} UTC`;

  const getCategoryClass = (category: EventCategory) => {
    switch (category) {
      case 'Keynote': return 'badge-keynote';
      case 'Workshop': return 'badge-workshop';
      case 'Working Group': return 'badge-working-group';
      case 'Panel': return 'badge-panel';
      case 'Social': return 'badge-social';
      default: return 'badge-keynote';
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <>
      <div
        onClick={closeDrawer}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 15, 30, 0.4)',
          backdropFilter: 'blur(3px)',
          zIndex: 60,
          opacity: isDrawerOpen ? 1 : 0,
          pointerEvents: isDrawerOpen ? 'auto' : 'none',
          transition: 'opacity var(--transition-normal)',
        }}
      />

      <aside
        className="glass-panel"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: '520px',
          zIndex: 70,
          backgroundColor: 'var(--surface-card)',
          borderLeft: '1px solid var(--surface-border)',
          boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          transform: isDrawerOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform var(--transition-smooth)',
        }}
      >
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--surface-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-primary)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className={`un-badge ${getCategoryClass(selectedEvent.category)}`}>
              {selectedEvent.category}
            </span>
            {selectedEvent.targetAudience && (
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                • {selectedEvent.targetAudience}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={handleShare}
              className="btn-un-secondary"
              style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
              title="Share event link"
            >
              <Share2 size={14} /> {copiedLink ? 'Copied!' : 'Share'}
            </button>

            <button
              onClick={() => setIsExportModalOpen(true)}
              className="btn-un-secondary"
              style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
              title="Add to calendar"
            >
              <Download size={14} /> Export
            </button>

            <button
              onClick={closeDrawer}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                padding: '0.35rem',
                borderRadius: '50%',
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, lineHeight: 1.25 }}>
            {selectedEvent.title}
          </h2>

          <div style={{
            background: 'var(--bg-primary)',
            padding: '1rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--surface-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', fontWeight: 700, color: 'var(--un-navy)' }}>
              <Calendar size={16} color="var(--un-blue)" /> {dateFormatted}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-main)' }}>
              <Clock size={15} color="var(--text-muted)" /> {localTimeFormatted}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', paddingLeft: '1.45rem' }}>
              Reference UTC: {utcTimeFormatted}
            </div>
          </div>

          <div style={{
            background: selectedEvent.locationType === 'virtual' ? 'var(--un-blue-light)' : 'rgba(217, 119, 6, 0.08)',
            padding: '1rem',
            borderRadius: 'var(--radius-lg)',
            border: selectedEvent.locationType === 'virtual' ? '1px solid rgba(0, 158, 219, 0.3)' : '1px solid rgba(217, 119, 6, 0.3)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.85rem' }}>
              {selectedEvent.locationType === 'virtual' && <><Video size={16} color="var(--un-blue)" /> Virtual Session</>}
              {selectedEvent.locationType === 'in-person' && <><MapPin size={16} color="#D97706" /> In-Person Venue</>}
              {selectedEvent.locationType === 'hybrid' && <><Globe size={16} color="#8A2BE2" /> Hybrid Meeting</>}
            </div>

            {selectedEvent.venue && (
              <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', margin: '0 0 0.5rem', fontWeight: 500 }}>
                {selectedEvent.venue}
              </p>
            )}

            {selectedEvent.locationType !== 'in-person' && (
              isAuthenticated ? (
                <a
                  href={selectedEvent.meetingUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-un-primary"
                  style={{ textDecoration: 'none', width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}
                >
                  <Unlock size={16} /> Join Secure Meeting (Authenticated as {currentUser?.displayName?.split(' ')[0]})
                </a>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Lock size={14} color="#E11D48" /> Secure link restricted to verified UN members (@un.org).
                  </div>
                  <button
                    onClick={openLoginModal}
                    className="btn-un-secondary"
                    style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', borderColor: 'var(--un-blue)', color: 'var(--un-blue)' }}
                  >
                    <Shield size={14} /> Sign In with Microsoft to Unlock Link
                  </button>
                </div>
              )
            )}
          </div>

          <div style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Your Delegate RSVP
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Users size={13} /> {counts.attending} attending • {counts.interested} interested
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
              <button
                onClick={() => setRSVPStatus(selectedEvent.id, 'attending')}
                disabled={!isAuthenticated}
                style={{
                  padding: '0.55rem',
                  borderRadius: 'var(--radius-md)',
                  border: userRSVP === 'attending' ? '2px solid #059669' : '1px solid var(--surface-border)',
                  background: userRSVP === 'attending' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                  color: userRSVP === 'attending' ? '#059669' : 'var(--text-main)',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  cursor: isAuthenticated ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                }}
              >
                <CheckCircle2 size={15} /> Attending
              </button>

              <button
                onClick={() => setRSVPStatus(selectedEvent.id, 'interested')}
                disabled={!isAuthenticated}
                style={{
                  padding: '0.55rem',
                  borderRadius: 'var(--radius-md)',
                  border: userRSVP === 'interested' ? '2px solid #D97706' : '1px solid var(--surface-border)',
                  background: userRSVP === 'interested' ? 'rgba(217, 119, 6, 0.15)' : 'transparent',
                  color: userRSVP === 'interested' ? '#D97706' : 'var(--text-main)',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  cursor: isAuthenticated ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                }}
              >
                <HelpCircle size={15} /> Interested
              </button>

              <button
                onClick={() => setRSVPStatus(selectedEvent.id, 'declined')}
                disabled={!isAuthenticated}
                style={{
                  padding: '0.55rem',
                  borderRadius: 'var(--radius-md)',
                  border: userRSVP === 'declined' ? '2px solid #E11D48' : '1px solid var(--surface-border)',
                  background: userRSVP === 'declined' ? 'rgba(225, 29, 72, 0.15)' : 'transparent',
                  color: userRSVP === 'declined' ? '#E11D48' : 'var(--text-main)',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  cursor: isAuthenticated ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                }}
              >
                <XCircle size={15} /> Decline
              </button>
            </div>

            {!isAuthenticated && (
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.5rem' }}>
                Please sign in to register your attendance status.
              </div>
            )}
          </div>

          {selectedEvent.speakers && selectedEvent.speakers.length > 0 && (
            <div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--un-navy)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Keynote Speakers & Facilitators
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {selectedEvent.speakers.map((spk) => (
                  <div
                    key={spk.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--surface-border)',
                    }}
                  >
                    <img
                      src={spk.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(spk.name)}`}
                      alt={spk.name}
                      style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                        {spk.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {spk.title}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--un-blue)', fontWeight: 600, marginTop: '0.15rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <Building size={11} /> {spk.organization}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--un-navy)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Session Overview & Agenda
            </h3>
            <div
              style={{
                fontSize: '0.85rem',
                color: 'var(--text-main)',
                lineHeight: 1.6,
                whiteSpace: 'pre-line',
                background: 'var(--surface-card)',
              }}
            >
              {selectedEvent.description}
            </div>
          </div>

          {isOwnerOrAdmin && (
            <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--surface-border)' }}>
              <button
                onClick={() => deleteEvent(selectedEvent.id)}
                style={{
                  width: '100%',
                  padding: '0.6rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(225, 29, 72, 0.3)',
                  background: 'rgba(225, 29, 72, 0.06)',
                  color: '#E11D48',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                }}
              >
                <Trash2 size={15} /> Delete Event Listing (Admin)
              </button>
            </div>
          )}
        </div>
      </aside>

      {isExportModalOpen && (
        <ExportCalendarModal event={selectedEvent} onClose={() => setIsExportModalOpen(false)} />
      )}
    </>
  );
};
