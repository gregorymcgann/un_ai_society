import React, { useState } from 'react';
import { X, Calendar, Plus, Sparkles } from 'lucide-react';
import { useEvents } from '../../context/EventContext';
import type { EventCategory, LocationType, Speaker } from '../../types';

export const CreateEventModal: React.FC = () => {
  const { isCreateModalOpen, setIsCreateModalOpen, createEvent } = useEvents();

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<EventCategory>('Workshop');
  const [locationType, setLocationType] = useState<LocationType>('virtual');
  const [venue, setVenue] = useState('');
  const [meetingUrl, setMeetingUrl] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(dateStr);
  const [startTime, setStartTime] = useState('10:00');
  const [endDate, setEndDate] = useState(dateStr);
  const [endTime, setEndTime] = useState('12:00');

  const [speakerName, setSpeakerName] = useState('');
  const [speakerTitle, setSpeakerTitle] = useState('');
  const [speakerOrg, setSpeakerOrg] = useState('');
  const [speakers, setSpeakers] = useState<Speaker[]>([]);

  if (!isCreateModalOpen) return null;

  const handleAddSpeaker = () => {
    if (!speakerName.trim()) return;
    const newSpeaker: Speaker = {
      id: `spk-${Date.now()}`,
      name: speakerName.trim(),
      title: speakerTitle.trim(),
      organization: speakerOrg.trim(),
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(speakerName)}&background=009EDB&color=fff`
    };
    setSpeakers([...speakers, newSpeaker]);
    setSpeakerName('');
    setSpeakerTitle('');
    setSpeakerOrg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) return;

    const startISO = new Date(`${startDate}T${startTime}:00.000Z`).toISOString();
    const endISO = new Date(`${endDate}T${endTime}:00.000Z`).toISOString();

    createEvent({
      title: title.trim(),
      summary: summary.trim(),
      description: description.trim() || summary.trim(),
      category,
      startTime: startISO,
      endTime: endISO,
      locationType,
      venue: locationType !== 'virtual' ? venue.trim() : undefined,
      meetingUrl: locationType !== 'in-person' ? (meetingUrl.trim() || undefined) : undefined,
      speakers,
      targetAudience: targetAudience.trim(),
      topics: [category]
    });
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 15, 30, 0.7)',
      backdropFilter: 'blur(8px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
    }}>
      <div
        className="glass-panel animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '640px',
          maxHeight: '90vh',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--surface-card)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div className="un-gradient-header" style={{
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Calendar size={22} color="#00B0FF" />
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
                Publish New Society Event
              </h2>
              <span style={{ fontSize: '0.75rem', opacity: 0.85 }}>
                Organizer & Admin Rights Enabled
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(false)}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
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
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Event Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. High-Level Briefing on Generative AI Policy Standards"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--surface-border)',
                background: 'var(--surface-card)',
                color: 'var(--text-main)',
                fontSize: '0.9rem',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--surface-border)',
                  background: 'var(--surface-card)',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem',
                }}
              >
                <option value="Keynote">Keynote</option>
                <option value="Workshop">Workshop</option>
                <option value="Working Group">Working Group</option>
                <option value="Panel">Panel</option>
                <option value="Social">Social</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Location Access *
              </label>
              <select
                value={locationType}
                onChange={(e) => setLocationType(e.target.value as LocationType)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--surface-border)',
                  background: 'var(--surface-card)',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem',
                }}
              >
                <option value="virtual">Virtual (Online Link)</option>
                <option value="in-person">In-Person (HQ / Venue)</option>
                <option value="hybrid">Hybrid (Both)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>Start Date</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--surface-border)', background: 'var(--surface-card)', color: 'var(--text-main)', fontSize: '0.8rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>Start Time (UTC)</label>
              <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--surface-border)', background: 'var(--surface-card)', color: 'var(--text-main)', fontSize: '0.8rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>End Date</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--surface-border)', background: 'var(--surface-card)', color: 'var(--text-main)', fontSize: '0.8rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>End Time (UTC)</label>
              <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--surface-border)', background: 'var(--surface-card)', color: 'var(--text-main)', fontSize: '0.8rem' }} />
            </div>
          </div>

          {locationType !== 'virtual' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Venue Location</label>
              <input
                type="text"
                placeholder="e.g. Conference Room 4, UN Headquarters, New York"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)', background: 'var(--surface-card)', color: 'var(--text-main)', fontSize: '0.85rem' }}
              />
            </div>
          )}

          {locationType !== 'in-person' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Meeting Link (Restricted to Signed-In Members)</label>
              <input
                type="url"
                placeholder="e.g. https://teams.microsoft.com/l/meetup-join/..."
                value={meetingUrl}
                onChange={(e) => setMeetingUrl(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)', background: 'var(--surface-card)', color: 'var(--text-main)', fontSize: '0.85rem' }}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Target Audience</label>
            <input
              type="text"
              placeholder="e.g. UN Delegates, Policy Experts, AI Researchers"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)', background: 'var(--surface-card)', color: 'var(--text-main)', fontSize: '0.85rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Short Summary *</label>
            <input
              type="text"
              required
              placeholder="Brief 1-2 sentence overview for calendar cards"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)', background: 'var(--surface-card)', color: 'var(--text-main)', fontSize: '0.85rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Detailed Agenda / Markdown Description</label>
            <textarea
              rows={4}
              placeholder="Provide agenda, discussion points, background reading..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)', background: 'var(--surface-card)', color: 'var(--text-main)', fontSize: '0.85rem', resize: 'vertical' }}
            />
          </div>

          <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--surface-border)' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--un-navy)' }}>
              Add Keynotes & Speakers
            </label>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <input placeholder="Name" value={speakerName} onChange={e => setSpeakerName(e.target.value)} style={{ padding: '0.45rem', fontSize: '0.8rem', borderRadius: '6px', border: '1px solid var(--surface-border)' }} />
              <input placeholder="Title" value={speakerTitle} onChange={e => setSpeakerTitle(e.target.value)} style={{ padding: '0.45rem', fontSize: '0.8rem', borderRadius: '6px', border: '1px solid var(--surface-border)' }} />
              <input placeholder="UN Org (e.g. ITU)" value={speakerOrg} onChange={e => setSpeakerOrg(e.target.value)} style={{ padding: '0.45rem', fontSize: '0.8rem', borderRadius: '6px', border: '1px solid var(--surface-border)' }} />
              <button type="button" onClick={handleAddSpeaker} className="btn-un-secondary" style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}>
                <Plus size={14} /> Add
              </button>
            </div>

            {speakers.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {speakers.map((spk, idx) => (
                  <span key={idx} style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)', padding: '0.25rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    {spk.name} ({spk.organization})
                  </span>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={() => setIsCreateModalOpen(false)} className="btn-un-secondary" style={{ flex: 1, justifyContent: 'center' }}>
              Cancel
            </button>
            <button type="submit" className="btn-un-primary" style={{ flex: 2, justifyContent: 'center' }}>
              <Sparkles size={16} /> Publish Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
