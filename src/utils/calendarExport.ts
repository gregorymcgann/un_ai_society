import type { SocietyEvent } from '../types';

function formatDateForICal(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toISOString().replace(/-|:|\.\d+/g, '');
}

export function generateICSContent(event: SocietyEvent): string {
  const start = formatDateForICal(event.startTime);
  const end = formatDateForICal(event.endTime);
  const now = formatDateForICal(new Date().toISOString());

  const location = event.locationType === 'virtual' 
    ? (event.meetingUrl || 'Virtual Meeting')
    : (event.venue || 'TBD');

  const cleanDescription = (event.summary + '\n\n' + event.description)
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');

  const cleanTitle = event.title.replace(/,/g, '\\,').replace(/;/g, '\\;');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//United Nations AI Society//Event Portal//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.id}@un_ai_society.web.app`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:[UN AI Society] ${cleanTitle}`,
    `DESCRIPTION:${cleanDescription}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

export function downloadICSFile(event: SocietyEvent): void {
  const content = generateICSContent(event);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `un-ai-society-${event.id}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function getGoogleCalendarUrl(event: SocietyEvent): string {
  const start = formatDateForICal(event.startTime);
  const end = formatDateForICal(event.endTime);
  const title = encodeURIComponent(`[UN AI Society] ${event.title}`);
  const details = encodeURIComponent(`${event.summary}\n\nTarget Audience: ${event.targetAudience || 'UN Members'}`);
  const location = encodeURIComponent(
    event.locationType === 'virtual' ? (event.meetingUrl || 'Online') : (event.venue || 'UN HQ')
  );

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
}

export function getOutlookCalendarUrl(event: SocietyEvent): string {
  const start = new Date(event.startTime).toISOString();
  const end = new Date(event.endTime).toISOString();
  const title = encodeURIComponent(`[UN AI Society] ${event.title}`);
  const body = encodeURIComponent(`${event.summary}\n\n${event.description}`);
  const location = encodeURIComponent(
    event.locationType === 'virtual' ? (event.meetingUrl || 'Online') : (event.venue || 'UN HQ')
  );

  return `https://outlook.office.com/calendar/0/deeplink/compose?subject=${title}&startdt=${start}&enddt=${end}&body=${body}&location=${location}`;
}
