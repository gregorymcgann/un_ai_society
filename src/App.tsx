import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EventProvider, useEvents } from './context/EventContext';
import { UNHeaderBanner } from './components/Banner/UNHeaderBanner';
import { Navbar } from './components/Navbar';
import { CalendarHeader } from './components/Calendar/CalendarHeader';
import { MonthView } from './components/Calendar/MonthView';
import { WeekView } from './components/Calendar/WeekView';
import { AgendaView } from './components/Calendar/AgendaView';
import { EventDetailsDrawer } from './components/EventDrawer/EventDetailsDrawer';
import { MicrosoftLoginModal } from './components/Auth/MicrosoftLoginModal';
import { AuthPage } from './components/Auth/AuthPage';
import { CreateEventModal } from './components/Modals/CreateEventModal';

const CalendarViewRenderer: React.FC = () => {
  const { viewMode } = useEvents();

  switch (viewMode) {
    case 'month':
      return <MonthView />;
    case 'week':
      return <WeekView />;
    case 'agenda':
      return <AgendaView />;
    default:
      return <MonthView />;
  }
};

const MainLayout: React.FC = () => {
  const { currentPage, isAuthenticated } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('un_ai_society_theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('un_ai_society_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  if (!isAuthenticated || currentPage === 'auth') {
    return <AuthPage theme={theme} toggleTheme={toggleTheme} />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      {/* Top Banner */}
      <UNHeaderBanner />

      {/* Main Navbar */}
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      {/* Main Content Body */}
      <main style={{ flex: 1, padding: '1.5rem 2rem', maxWidth: '1440px', width: '100%', margin: '0 auto' }}>
        <CalendarHeader />
        <CalendarViewRenderer />
      </main>

      {/* Footer */}
      <footer style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--surface-border)',
        padding: '1.25rem 2rem',
        backgroundColor: 'var(--surface-card)',
        textAlign: 'center',
        fontSize: '0.78rem',
        color: 'var(--text-muted)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
          <span>© 2026 United Nations AI Society</span>
          <span>•</span>
          <span>Microsoft Entra ID Protected</span>
          <span>•</span>
          <span>General Assembly & Secretariat Network</span>
        </div>
        <p style={{ margin: 0, opacity: 0.8 }}>
          Promoting safe, inclusive, and equitable AI governance frameworks globally.
        </p>
      </footer>

      {/* Drawers & Modals */}
      <EventDetailsDrawer />
      <MicrosoftLoginModal />
      <CreateEventModal />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <MainLayout />
      </EventProvider>
    </AuthProvider>
  );
}

export default App;
