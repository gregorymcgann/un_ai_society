import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useEvents } from '../../context/EventContext';
import type { EventCategory } from '../../types';

export const WeekView: React.FC = () => {
  const {
    events,
    currentDate,
    searchQuery,
    selectedCategory,
    selectedLocationType,
    setSelectedEvent,
    selectedEvent,
    getUserRSVPStatus,
  } = useEvents();

  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

  const weekDays: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    weekDays.push(d);
  }

  const hours = Array.from({ length: 12 }, (_, i) => i + 8);

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

  const filteredEvents = events.filter((evt) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = evt.title.toLowerCase().includes(q);
      const matchesSummary = evt.summary.toLowerCase().includes(q);
      if (!matchesTitle && !matchesSummary) return false;
    }
    if (selectedCategory !== 'All' && evt.category !== selectedCategory) return false;
    if (selectedLocationType !== 'All' && evt.locationType !== selectedLocationType) return false;
    return true;
  });

  return (
    <div className="glass-panel" style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '60px repeat(7, 1fr)',
        background: 'var(--bg-primary)',
        borderBottom: '1px solid var(--surface-border)',
      }}>
        <div style={{ padding: '0.75rem 0.5rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
          UTC
        </div>
        {weekDays.map((d, i) => {
          const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
          const dayNum = d.getDate();
          const isToday = d.toDateString() === new Date(2026, 7, 9).toDateString();

          return (
            <div
              key={i}
              style={{
                padding: '0.75rem 0.5rem',
                textAlign: 'center',
                borderLeft: '1px solid var(--surface-border)',
                background: isToday ? 'var(--un-blue-light)' : 'transparent',
              }}
            >
              <div style={{ fontSize: '0.75rem', color: isToday ? 'var(--un-blue)' : 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                {dayName}
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: isToday ? 'var(--un-blue)' : 'var(--text-main)' }}>
                {dayNum}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
        {hours.map((hour) => {
          const hourLabel = `${hour === 12 ? 12 : hour % 12}:00 ${hour >= 12 ? 'PM' : 'AM'}`;

          return (
            <div
              key={hour}
              style={{
                display: 'grid',
                gridTemplateColumns: '60px repeat(7, 1fr)',
                minHeight: '75px',
                borderBottom: '1px solid var(--surface-border)',
              }}
            >
              <div style={{
                padding: '0.5rem',
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                fontWeight: 600,
                textAlign: 'right',
                borderRight: '1px solid var(--surface-border)',
                background: 'var(--bg-primary)',
              }}>
                {hourLabel}
              </div>

              {weekDays.map((dayDate, dayIdx) => {
                const hourEvents = filteredEvents.filter((evt) => {
                  const evtStart = new Date(evt.startTime);
                  return (
                    evtStart.getFullYear() === dayDate.getFullYear() &&
                    evtStart.getMonth() === dayDate.getMonth() &&
                    evtStart.getDate() === dayDate.getDate() &&
                    evtStart.getHours() === hour
                  );
                });

                return (
                  <div
                    key={dayIdx}
                    style={{
                      borderRight: dayIdx < 6 ? '1px solid var(--surface-border)' : 'none',
                      padding: '0.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem',
                      background: 'var(--surface-card)',
                    }}
                  >
                    {hourEvents.map((evt) => {
                      const isSelected = selectedEvent?.id === evt.id;
                      const rsvp = getUserRSVPStatus(evt.id);

                      return (
                        <div
                          key={evt.id}
                          onClick={() => setSelectedEvent(evt)}
                          style={{
                            padding: '0.35rem 0.45rem',
                            borderRadius: 'var(--radius-sm)',
                            border: isSelected ? '1.5px solid var(--un-blue)' : '1px solid var(--surface-border)',
                            background: isSelected ? 'var(--un-blue-light)' : 'var(--glass-bg)',
                            cursor: 'pointer',
                            transition: 'all var(--transition-fast)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.2rem' }}>
                            <span className={`un-badge ${getCategoryClass(evt.category)}`} style={{ fontSize: '0.55rem', padding: '0.05rem 0.25rem' }}>
                              {evt.category}
                            </span>
                            {rsvp === 'attending' && <CheckCircle2 size={10} color="#059669" />}
                          </div>

                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.2rem', lineHeight: 1.2 }}>
                            {evt.title}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
