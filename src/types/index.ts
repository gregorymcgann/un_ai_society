export type UserRole = 'member' | 'organizer' | 'admin';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  department?: string; // UN Agency (e.g., UNDP, UNICRI, ITU, UNODA)
  title?: string;
  role: UserRole;
  emailVerified?: boolean;
  createdAt: string;
  lastLoginAt: string;
}

export type EventCategory = 'Keynote' | 'Workshop' | 'Working Group' | 'Panel' | 'Social';

export type LocationType = 'in-person' | 'virtual' | 'hybrid';

export interface Speaker {
  id: string;
  name: string;
  title: string;
  organization: string; // e.g. "UNESCO", "UN Global Pulse", "ITU"
  avatarUrl?: string;
}

export interface SocietyEvent {
  id: string;
  title: string;
  summary: string;
  description: string;
  category: EventCategory;
  startTime: string; // ISO String
  endTime: string;   // ISO String
  locationType: LocationType;
  venue?: string;
  meetingUrl?: string; // Restricted to UN members
  speakers: Speaker[];
  createdById: string;
  updatedAt: string;
  targetAudience?: string;
  topics?: string[];
  capacity?: number;
}

export type RSVPStatus = 'attending' | 'interested' | 'declined';

export interface EventRSVP {
  id: string; // `${eventId}_${userId}`
  eventId: string;
  userId: string;
  userDisplayName: string;
  userEmail: string;
  userDepartment?: string;
  status: RSVPStatus;
  updatedAt: string;
}

export type ViewMode = 'month' | 'week' | 'agenda';
