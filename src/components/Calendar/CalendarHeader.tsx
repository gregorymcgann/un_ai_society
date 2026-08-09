import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Grid, 
  List, 
  Filter, 
  Video, 
  MapPin, 
  Globe 
} from 'lucide-react';
import { useEvents } from '../../context/EventContext';
import type { EventCategory, LocationType, ViewMode } from '../../types';

export const CalendarHeader: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    currentDate,
    setCurrentDate,
    selectedCategory,
    setSelectedCategory,
    selectedLocationType,
    setSelectedLocationType,
  } = useEvents();

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date(2026, 7, 9)); // August 2026
  };

  const monthYearLabel = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const categories: (EventCategory | 'All')[] = [
    'All',
    'Keynote',
    'Workshop',
    'Working Group',
    'Panel',
    'Social',
  ];

  return (
    <div
      className="glass-panel"
      style={{
        borderRadius: 'var(--radius-lg)',
        padding: '1rem 1.25rem',
        marginBottom: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ display: 'flex', border: '1px solid var(--surface-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <button
              onClick={handlePrev}
              style={{
                padding: '0.45rem 0.65rem',
                border: 'none',
                background: 'var(--surface-card)',
                color: 'var(--text-main)',
                cursor: 'pointer',
              }}
              title="Previous"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleToday}
              style={{
                padding: '0.45rem 0.85rem',
                borderLeft: '1px solid var(--surface-border)',
                borderRight: '1px solid var(--surface-border)',
                borderTop: 'none',
                borderBottom: 'none',
                background: 'var(--surface-card)',
                color: 'var(--text-main)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Today
            </button>
            <button
              onClick={handleNext}
              style={{
                padding: '0.45rem 0.65rem',
                border: 'none',
                background: 'var(--surface-card)',
                color: 'var(--text-main)',
                cursor: 'pointer',
              }}
              title="Next"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, minWidth: '180px' }}>
            {monthYearLabel}
          </h2>
        </div>

        <div style={{
          display: 'flex',
          background: 'var(--bg-primary)',
          padding: '0.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--surface-border)',
        }}>
          {(['month', 'week', 'agenda'] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: viewMode === mode ? 'var(--surface-card)' : 'transparent',
                color: viewMode === mode ? 'var(--un-blue)' : 'var(--text-muted)',
                fontWeight: viewMode === mode ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: viewMode === mode ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                textTransform: 'capitalize',
                transition: 'all var(--transition-fast)',
              }}
            >
              {mode === 'month' && <CalendarIcon size={14} />}
              {mode === 'week' && <Grid size={14} />}
              {mode === 'agenda' && <List size={14} />}
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        paddingTop: '0.75rem',
        borderTop: '1px solid var(--surface-border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginRight: '0.25rem' }}>
            <Filter size={12} /> Category:
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.25rem 0.65rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: isSelected ? 700 : 500,
                  border: isSelected ? '1px solid var(--un-blue)' : '1px solid var(--surface-border)',
                  background: isSelected ? 'var(--un-blue)' : 'var(--surface-card)',
                  color: isSelected ? '#FFFFFF' : 'var(--text-main)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginRight: '0.25rem' }}>
            Format:
          </span>
          {(['All', 'virtual', 'in-person', 'hybrid'] as (LocationType | 'All')[]).map((type) => {
            const isSelected = selectedLocationType === type;
            return (
              <button
                key={type}
                onClick={() => setSelectedLocationType(type)}
                style={{
                  padding: '0.25rem 0.55rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontWeight: isSelected ? 700 : 500,
                  border: isSelected ? '1px solid var(--un-navy)' : '1px solid var(--surface-border)',
                  background: isSelected ? 'var(--un-navy)' : 'transparent',
                  color: isSelected ? '#FFFFFF' : 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  textTransform: 'capitalize',
                }}
              >
                {type === 'virtual' && <Video size={11} />}
                {type === 'in-person' && <MapPin size={11} />}
                {type === 'hybrid' && <Globe size={11} />}
                {type}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
