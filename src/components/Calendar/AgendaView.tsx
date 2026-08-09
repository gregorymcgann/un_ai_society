import React from 'react';
import { Calendar, Clock, MapPin, Video, Globe, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useEvents } from '../../context/EventContext';
import type { EventCategory } from '../../types';

export const AgendaView: React.FC = () => {
  const {
    events,
    searchQuery,
    selectedCategory,
    selectedLocationType,
    setSelectedEvent,
    selectedEvent,
    getUserRSVPStatus,
  } = useEvents();

  const filteredEvents = events.filter((evt) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = evt.title.toLowerCase().includes(q);
      const matchesSummary = evt.summary.toLowerCase().includes(q);
      const matchesTopics = evt.topics?.some((t) => t.toLowerCase().includes(q));
      if (!matchesTitle && !matchesSummary && !matchesTopics) return false;
    }
    if (selectedCategory !== 'All' && evt.category !== selectedCategory) return false;
    if (selectedLocationType !== 'All' && evt.locationType !== selectedLocationType) return false;
    return true;
  });

  const sortedEvents = [...filteredEvents].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

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

  if (sortedEvents.length === 0) {
    return (
      <div className="glass-panel" style={{ borderRadius: 'var(--radius-xl)', padding: '3rem', textAlign: 'center' }}>
        <Calendar size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>No Matching UN AI Events Found</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          Try broadening your search term, clearing category filters, or selecting "All" locations.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {sortedEvents.map((evt) => {
        const isSelected = selectedEvent?.id === evt.id;
        const rsvp = getUserRSVPStatus(evt.id);

        const startDate = new Date(evt.startTime);
        const endDate = new Date(evt.endTime);

        const dateStr = startDate.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });

        const timeStr = `${startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} - ${endDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} UTC`;

        return (
          <div
            key={evt.id}
            onClick={() => setSelectedEvent(evt)}
            className="glass-panel"
            style={{
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              border: isSelected ? '2px solid var(--un-blue)' : '1px solid var(--surface-border)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.borderColor = 'var(--un-blue)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.borderColor = 'var(--surface-border)';
                e.currentTarget.style.transform = 'none';
              }
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className={`un-badge ${getCategoryClass(evt.category)}`}>
                  {evt.category}
                </span>

                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Calendar size={12} /> {dateStr}
                </span>

                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={12} /> {timeStr}
                </span>
              </div>

              {rsvp && (
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: rsvp === 'attending' ? '#059669' : rsvp === 'interested' ? '#D97706' : '#E11D48',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <CheckCircle2 size={13} /> RSVP: {rsvp.toUpperCase()}
                </span>
              )}
            </div>

            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 0.35rem' }}>
                {evt.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                {evt.summary}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--surface-border)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                {evt.locationType === 'virtual' && <><Video size={14} color="var(--un-blue)" /> <span>Virtual Link (UN Member Access)</span></>}
                {evt.locationType === 'in-person' && <><MapPin size={14} color="#D97706" /> <span>{evt.venue}</span></>}
                {evt.locationType === 'hybrid' && <><Globe size={14} color="#8A2BE2" /> <span>Hybrid: {evt.venue} & Video Link</span></>}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {evt.speakers && evt.speakers.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    {evt.speakers.map((spk) => (
                      <img
                        key={spk.id}
                        src={spk.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(spk.name)}`}
                        alt={spk.name}
                        title={`${spk.name} - ${spk.organization}`}
                        style={{ width: '26px', height: '26px', borderRadius: '50%', border: '2px solid var(--surface-card)', objectFit: 'cover' }}
                      />
                    ))}
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                      {evt.speakers.map(s => s.name.split(' ')[0]).join(', ')}
                    </span>
                  </div>
                )}

                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--un-blue)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  Details <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
