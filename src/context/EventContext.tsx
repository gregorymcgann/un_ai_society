import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { SocietyEvent, EventRSVP, RSVPStatus, EventCategory, LocationType, ViewMode } from '../types';
import { INITIAL_EVENTS, INITIAL_RSVPS } from '../services/mockData';
import { useAuth } from './AuthContext';

interface EventContextType {
  events: SocietyEvent[];
  rsvps: EventRSVP[];
  selectedEvent: SocietyEvent | null;
  isDrawerOpen: boolean;
  viewMode: ViewMode;
  currentDate: Date;
  searchQuery: string;
  selectedCategory: EventCategory | 'All';
  selectedLocationType: LocationType | 'All';
  isCreateModalOpen: boolean;

  setSelectedEvent: (event: SocietyEvent | null) => void;
  closeDrawer: () => void;
  setViewMode: (mode: ViewMode) => void;
  setCurrentDate: (date: Date) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: EventCategory | 'All') => void;
  setSelectedLocationType: (type: LocationType | 'All') => void;
  setIsCreateModalOpen: (open: boolean) => void;
  
  setRSVPStatus: (eventId: string, status: RSVPStatus) => void;
  getUserRSVPStatus: (eventId: string) => RSVPStatus | null;
  getEventRSVPCounts: (eventId: string) => { attending: number; interested: number; declined: number };
  createEvent: (newEvent: Omit<SocietyEvent, 'id' | 'createdById' | 'updatedAt'>) => void;
  deleteEvent: (eventId: string) => void;
}

const EVENTS_STORAGE_KEY = 'un_ai_society_events';
const RSVPS_STORAGE_KEY = 'un_ai_society_rsvps';

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();

  const [events, setEvents] = useState<SocietyEvent[]>(() => {
    const saved = localStorage.getItem(EVENTS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved events:', e);
      }
    }
    return INITIAL_EVENTS;
  });

  const [rsvps, setRsvps] = useState<EventRSVP[]>(() => {
    const saved = localStorage.getItem(RSVPS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved rsvps:', e);
      }
    }
    return INITIAL_RSVPS;
  });

  const [selectedEvent, setSelectedEventState] = useState<SocietyEvent | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'All'>('All');
  const [selectedLocationType, setSelectedLocationType] = useState<LocationType | 'All'>('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(RSVPS_STORAGE_KEY, JSON.stringify(rsvps));
  }, [rsvps]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen]);

  const setSelectedEvent = (event: SocietyEvent | null) => {
    setSelectedEventState(event);
    setIsDrawerOpen(!!event);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedEventState(null), 300);
  };

  const setRSVPStatus = (eventId: string, status: RSVPStatus) => {
    if (!currentUser) return;

    const compositeId = `${eventId}_${currentUser.uid}`;
    const existingIndex = rsvps.findIndex(r => r.id === compositeId);

    const updatedRSVP: EventRSVP = {
      id: compositeId,
      eventId,
      userId: currentUser.uid,
      userDisplayName: currentUser.displayName,
      userEmail: currentUser.email,
      userDepartment: currentUser.department,
      status,
      updatedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      const updatedList = [...rsvps];
      updatedList[existingIndex] = updatedRSVP;
      setRsvps(updatedList);
    } else {
      setRsvps([...rsvps, updatedRSVP]);
    }

    if (status === 'attending') {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#009EDB', '#003366', '#00B0FF', '#FFFFFF']
      });
    }
  };

  const getUserRSVPStatus = (eventId: string): RSVPStatus | null => {
    if (!currentUser) return null;
    const compositeId = `${eventId}_${currentUser.uid}`;
    const found = rsvps.find(r => r.id === compositeId);
    return found ? found.status : null;
  };

  const getEventRSVPCounts = (eventId: string) => {
    const eventRSVPs = rsvps.filter(r => r.eventId === eventId);
    return {
      attending: eventRSVPs.filter(r => r.status === 'attending').length,
      interested: eventRSVPs.filter(r => r.status === 'interested').length,
      declined: eventRSVPs.filter(r => r.status === 'declined').length
    };
  };

  const createEvent = (newEventData: Omit<SocietyEvent, 'id' | 'createdById' | 'updatedAt'>) => {
    const createdEvent: SocietyEvent = {
      ...newEventData,
      id: `evt-${Date.now()}`,
      createdById: currentUser?.uid || 'un-user-001',
      updatedAt: new Date().toISOString()
    };
    setEvents([createdEvent, ...events]);
    setIsCreateModalOpen(false);
    setSelectedEvent(createdEvent);
  };

  const deleteEvent = (eventId: string) => {
    setEvents(events.filter(e => e.id !== eventId));
    if (selectedEvent?.id === eventId) {
      closeDrawer();
    }
  };

  return (
    <EventContext.Provider
      value={{
        events,
        rsvps,
        selectedEvent,
        isDrawerOpen,
        viewMode,
        currentDate,
        searchQuery,
        selectedCategory,
        selectedLocationType,
        isCreateModalOpen,
        setSelectedEvent,
        closeDrawer,
        setViewMode,
        setCurrentDate,
        setSearchQuery,
        setSelectedCategory,
        setSelectedLocationType,
        setIsCreateModalOpen,
        setRSVPStatus,
        getUserRSVPStatus,
        getEventRSVPCounts,
        createEvent,
        deleteEvent,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};
