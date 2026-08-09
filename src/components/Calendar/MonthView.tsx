import React from 'react';
import { Video, MapPin, Globe, CheckCircle2, Clock } from 'lucide-react';
import { useEvents } from '../../context/EventContext';
import type { EventCategory } from '../../types';

export const MonthView: React.FC = () => {
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

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const startingDayOfWeek = firstDayOfMonth.getDay();
  const totalDaysInMonth = lastDayOfMonth.getDate();

  const calendarDays: { date: Date; isCurrentMonth: boolean }[] = [];

  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    calendarDays.push({
      date: new Date(year, month - 1, prevMonthLastDay - i),
      isCurrentMonth: false,
    });
  }

  for (let d = 1; d <= totalDaysInMonth; d++) {
    calendarDays.push({
      date: new Date(year, month, d),
      isCurrentMonth: true,
    });
  }

  const remainingCells = (7 - (calendarDays.length % 7)) % 7;
  for (let i = 1; i <= remainingCells; i++) {
    calendarDays.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false,
    });
  }

  const filteredEvents = events.filter((evt) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = evt.title.toLowerCase().includes(q);
      const matchesSummary = evt.summary.toLowerCase().includes(q);
      const matchesTopics = evt.topics?.some(t => t.toLowerCase().includes(q));
      if (!matchesTitle && !matchesSummary && !matchesTopics) return false;
    }
    if (selectedCategory !== 'All' && evt.category !== selectedCategory) {
      return false;
    }
    if (selectedLocationType !== 'All' && evt.locationType !== selectedLocationType) {
      return false;
    }
    return true;
  });

  const getEventsForDay = (dayDate: Date) => {
    return filteredEvents.filter((evt) => {
      const evtDate = new Date(evt.startTime);
      return (
        evtDate.getFullYear() === dayDate.getFullYear() &&
        evtDate.getMonth() === dayDate.getMonth() &&
        evtDate.getDate() === dayDate.getDate()
      );
    });
  };

  const isToday = (dayDate: Date) => {
    const today = new Date(2026, 7, 9);
    return (
      today.getFullYear() === dayDate.getFullYear() &&
      today.getMonth() === dayDate.getMonth() &&
      today.getDate() === dayDate.getDate()
    );
  };

  const getCategoryClass = (category: EventCategory) => {
    switch (category) {
      case 'Keynote': return 'badge-keynote';
      case 'Workshop': return 'badge-workshop';
      case 'Working Group': return 'badge-[#059669] badge-working-group';
      case 'Panel': return 'badge-panel';
      case 'Social': return 'badge-social';
      default: return 'badge-keynote';
    }
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="glass-panel" style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        background: 'var(--bg-primary)',
        borderBottom: '1px solid var(--surface-border)',
      }}>
        {weekDays.map((wd, i) => (
          <div
            key={wd}
            style={{
              padding: '0.75rem 0.5rem',
              textAlign: 'center',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: i === 0 || i === 6 ? 'var(--un-blue)' : 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {wd}
          </div>
        ))}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gridAutoRows: 'minmax(120px, auto)',
        gap: '1px',
        backgroundColor: 'var(--surface-border)',
      }}>
        {calendarDays.map(({ date, isCurrentMonth }, idx) => {
          const dayEvents = getEventsForDay(date);
          const today = isToday(date);

          return (
            <div
              key={idx}
              style={{
                backgroundColor: isCurrentMonth ? 'var(--surface-card)' : 'var(--bg-primary)',
                opacity: isCurrentMonth ? 1 : 0.45,
                padding: '0.5rem',
                minHeight: '135px',
                display: 'flex',
                flexDirection: 'column',
                transition: 'background-color var(--transition-fast)',
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.4rem',
              }}>
                <span
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: today ? 800 : 600,
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: today ? 'var(--un-blue)' : 'transparent',
                    color: today ? '#FFFFFF' : 'var(--text-main)',
                  }}
                >
                  {date.getDate()}
                </span>
                {dayEvents.length > 0 && (
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    {dayEvents.length} {dayEvents.length === 1 ? 'event' : 'events'}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
                {dayEvents.map((evt) => {
                  const isSelected = selectedEvent?.id === evt.id;
                  const rsvp = getUserRSVPStatus(evt.id);
                  const startTimeStr = new Date(evt.startTime).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  });

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
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.borderColor = 'var(--un-blue)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.transform = 'none';
                          e.currentTarget.style.borderColor = 'var(--surface-border)';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.25rem', marginBottom: '0.15rem' }}>
                        <span className={`un-badge ${getCategoryClass(evt.category)}`} style={{ fontSize: '0.6rem', padding: '0.05rem 0.35rem' }}>
                          {evt.category}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          {rsvp === 'attending' && (
                            <span title="You are attending">
                              <CheckCircle2 size={12} color="#059669" />
                            </span>
                          )}
                          {evt.locationType === 'virtual' && <Video size={11} color="var(--un-blue)" />}
                          {evt.locationType === 'in-person' && <MapPin size={11} color="#D97706" />}
                          {evt.locationType === 'hybrid' && <Globe size={11} color="#8A2BE2" />}
                        </div>
                      </div>

                      <div style={{
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: 'var(--text-main)',
                        lineHeight: 1.25,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}>
                        {evt.title}
                      </div>

                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <Clock size={10} /> {startTimeStr}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
