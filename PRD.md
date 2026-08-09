# Product Requirement Document (PRD): United Nations AI Society Web Application

## 1. Executive Summary

The **United Nations AI Society** web application serves as a hub for UN staff, delegates, and affiliated researchers interested in artificial intelligence governance, policy, and innovation. The portal provides identity-verified membership sign-in via Microsoft Entra ID (UN Auth), an interactive graphical calendar of upcoming events and workshops, and a detailed collapsible event sidebar for quick access to session details and registration.

- **Target Domain:** `un_ai_society.web.app`
- **Primary Objective:** Streamline event discovery, engagement, and membership onboarding for UN AI Society members.

---

## 2. Core Features & User Stories

### 2.1 User Authentication & Onboarding (Microsoft / UN Auth)
- **Feature:** Single Sign-On (SSO) using Microsoft Authentication via Firebase Auth.
- **Requirements:**
  - Support OAuth 2.0 / OpenID Connect login via Microsoft Entra ID (configured for UN tenant IDs and official `@un.org` email domains).
  - Automatically create and synchronize user profiles in Cloud Firestore upon first successful login.
  - Display member status, profile avatar, role (e.g., Member, Organizer, Admin), and sign-out option in the navbar.
  - Session persistence and automatic silent token refresh.

### 2.2 Graphical Calendar of Events
- **Feature:** Interactive, responsive visual calendar interface.
- **Requirements:**
  - Interactive grid displaying events across Month, Week, and List/Agenda views.
  - Color-coded event markers based on category (e.g., Keynote, Workshop, Policy Working Group, Social).
  - Filtering by event category, topic, or target audience.
  - Quick month-to-month and week-to-week navigation.
  - Visual indicators for virtual (online link), in-person (building/room), or hybrid meetings.

### 2.3 Collapsible Right Panel for Event Details
- **Feature:** Slide-out / drawer sidebar triggered by selecting any event on the calendar.
- **Requirements:**
  - Smooth animation upon opening/closing (expandable drawer or persistent split pane on larger displays).
  - Displays comprehensive event information:
    - **Header:** Event Title, Category Badge, Date & Time Range (with user timezone detection).
    - **Location/Access:** Venue details or secure video conferencing link (visible to authenticated members).
    - **Description:** Full agenda, speaker bios, key discussion points, and external references.
    - **Interactions:** One-click RSVP/Registration button ("Attending", "Interested", "Decline").
    - **Add to Personal Calendar:** Export options (`.ics`, Google Calendar, Outlook Calendar).
  - Can be toggled open/closed via calendar click, close button (X), or pressing the `Escape` key.

---

## 3. Technology Stack & Infrastructure

| Layer | Technology Choice | Details & Rationale |
| :--- | :--- | :--- |
| **Frontend** | React / Next.js + TypeScript | High performance, accessible UI components, rich ecosystem for calendar integration |
| **Styling** | Vanilla CSS / CSS Modules | Tailored UN blue palette (`#009EDB`, `#003366`), clean modern glassmorphism UI |
| **Authentication** | Firebase Authentication | Provider setup for Microsoft (OAuth2) with UN Organization tenant rules |
| **Database** | Cloud Firestore | Realtime database for storing users, event listings, RSVPs, and user preferences |
| **Hosting & Deployment** | Firebase App Hosting / Hosting | Direct hosting configured for `un_ai_society.web.app` custom domain |

---

## 4. Database Schema (Cloud Firestore)

### `users` collection
```typescript
interface UserProfile {
  uid: string;                 // Firebase Auth UID
  displayName: string;
  email: string;               // e.g. user@un.org
  photoURL?: string;
  department?: string;         // UN Agency/Department (e.g., UNDP, UNICRI, ITU)
  role: 'member' | 'organizer' | 'admin';
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
}
```

### `events` collection
```typescript
interface SocietyEvent {
  id: string;
  title: string;
  summary: string;
  description: string;         // Markdown supported
  category: 'Keynote' | 'Workshop' | 'Working Group' | 'Panel' | 'Social';
  startTime: Timestamp;
  endTime: Timestamp;
  locationType: 'in-person' | 'virtual' | 'hybrid';
  venue?: string;              // e.g. "Conference Room 4, UN HQ NYC"
  meetingUrl?: string;         // Secure link (restricted to members)
  speakers: Array<{
    name: string;
    title: string;
    organization: string;
    avatarUrl?: string;
  }>;
  createdById: string;
  updatedAt: Timestamp;
}
```

### `rsvps` collection
```typescript
interface EventRSVP {
  id: string;                  // Composite: `${eventId}_${userId}`
  eventId: string;
  userId: string;
  status: 'attending' | 'interested' | 'declined';
  updatedAt: Timestamp;
}
```

---

## 5. Security & Access Control

1. **Firestore Security Rules:**
   - **Users:** Users can read and write only their own user document; admins can read all.
   - **Events:** Public/authenticated read access for all society events. Only users with role `organizer` or `admin` can create or modify events.
   - **Meeting Links:** Only authenticated members (`request.auth != null`) can retrieve `meetingUrl` values.

2. **Domain Authorization:**
   - Auth settings configured to validate Microsoft Entra ID tenant domains (restricting registration to official UN organization credentials if required).

---

## 6. Hosting & Custom Domain Deployment

- **Firebase Hosting Configuration (`firebase.json`):**
  - Configured for SPA / Next.js rewrite routing.
  - SSL/TLS certificate auto-provisioning for `un_ai_society.web.app`.

---

## 7. Roadmap & Future Enhancements

- **Phase 1:** Core Authentication, Graphical Calendar, Collapsible Sidebar, Firestore Integration.
- **Phase 2:** Automated Email / Teams notifications for upcoming registered events.
- **Phase 3:** Resource & Publication Library (AI policy whitepapers, conference recordings).
- **Phase 4:** AI-assisted event summaries and chat Q&A for past working group sessions.
