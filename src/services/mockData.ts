import type { UserProfile, SocietyEvent, EventRSVP } from '../types';

export const MOCK_USERS: UserProfile[] = [
  {
    uid: 'un-user-001',
    displayName: 'Dr. Amara Okezie',
    email: 'amara.okezie@un.org',
    photoURL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
    department: 'UN Office for Disarmament Affairs (UNODA)',
    title: 'Senior AI Risk Advisor',
    role: 'admin',
    createdAt: '2026-01-15T09:00:00Z',
    lastLoginAt: '2026-08-09T08:30:00Z',
  },
  {
    uid: 'un-user-002',
    displayName: 'Jean-Luc Dupont',
    email: 'jeanluc.dupont@un.org',
    photoURL: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256',
    department: 'ITU - International Telecommunication Union',
    title: 'Chief of AI Standards & Policy',
    role: 'organizer',
    createdAt: '2026-02-01T10:15:00Z',
    lastLoginAt: '2026-08-08T14:20:00Z',
  },
  {
    uid: 'un-user-003',
    displayName: 'Elena Rostova',
    email: 'elena.rostova@un.org',
    photoURL: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256',
    department: 'UNDP Policy Bureau',
    title: 'Digital Inclusion Specialist',
    role: 'member',
    createdAt: '2026-03-10T11:45:00Z',
    lastLoginAt: '2026-08-09T07:10:00Z',
  }
];

const YYYY = 2026;
const MM = '08';

export const INITIAL_EVENTS: SocietyEvent[] = [
  {
    id: 'evt-101',
    title: 'Global AI Governance Summit 2026: Multilateral Frameworks',
    summary: 'High-level plenary session on harmonizing international AI safety protocols and binding policy standards across UN member states.',
    description: `### Overview
Join delegates, international policy makers, and AI governance experts for the flagship UN AI Society summit. This session focuses on constructing unified multilateral frameworks for frontier AI safety, alignment verification, and cross-border risk mitigation.

### Key Discussion Topics
* **Harmonizing Safety Benchmarks:** Aligning national AI registries with UN treaty frameworks.
* **Geopolitical Equity in AI:** Ensuring Global South representation in foundational AI compute distribution.
* **Autonomous Decision Systems:** Establishing human-in-the-loop compliance in international law.

### Agenda
- **09:00 - 09:30:** Welcome & Opening Remarks by UN Tech Envoy
- **09:30 - 11:00:** Plenary Panel: Harmonized Frontier AI Evaluation
- **11:00 - 12:00:** Q&A & Delegate Resolution Drafting`,
    category: 'Keynote',
    startTime: `${YYYY}-${MM}-12T09:00:00.000Z`,
    endTime: `${YYYY}-${MM}-12T12:00:00.000Z`,
    locationType: 'hybrid',
    venue: 'General Assembly Hall & Conference Room 4, UN Headquarters, New York',
    meetingUrl: 'https://teams.microsoft.com/l/meetup-join/un-ai-governance-summit-2026',
    speakers: [
      {
        id: 'spk-1',
        name: 'Dr. Sarah Al-Mansoor',
        title: 'Director of AI Policy',
        organization: 'UN Executive Office of the Secretary-General',
        avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=256'
      },
      {
        id: 'spk-2',
        name: 'Prof. Marcus Vance',
        title: 'Chair of Responsible Compute',
        organization: 'ITU Policy Research Institute',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'
      }
    ],
    createdById: 'un-user-001',
    updatedAt: '2026-08-01T12:00:00Z',
    targetAudience: 'Diplomats, Policy Advisors, Tech Envoys',
    topics: ['AI Governance', 'Multilateral Treaties', 'Frontier Safety']
  },
  {
    id: 'evt-102',
    title: 'Generative AI in Multilingual Diplomacy Workshop',
    summary: 'Hands-on technical workshop evaluating LLM translation fidelity, dialect preservation, and security in diplomatic communications.',
    description: `### Workshop Focus
This interactive workshop tests state-of-the-art multilingual language models against formal diplomatic transcripts across all 6 official UN languages (Arabic, Chinese, English, French, Russian, Spanish).

### Learning Objectives
1. Quantify translation hallucination rates in sensitive policy documents.
2. Implement retrieval-augmented generation (RAG) over UN Treaty Series databases.
3. Establish data privacy guardrails for confidential delegation notes.`,
    category: 'Workshop',
    startTime: `${YYYY}-${MM}-15T14:00:00.000Z`,
    endTime: `${YYYY}-${MM}-15T17:00:00.000Z`,
    locationType: 'virtual',
    meetingUrl: 'https://un.zoom.us/j/98421039812?pwd=un-ai-multilingual',
    speakers: [
      {
        id: 'spk-3',
        name: 'Carlos Mendez-Vega',
        title: 'Lead NLP Scientist',
        organization: 'UN Global Pulse Geneva',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256'
      }
    ],
    createdById: 'un-user-002',
    updatedAt: '2026-08-03T15:30:00Z',
    targetAudience: 'Translators, Data Scientists, Policy Analysts',
    topics: ['Generative AI', 'NLP', 'Multilingualism']
  },
  {
    id: 'evt-103',
    title: 'AI & Humanitarian Action Policy Working Group',
    summary: 'Bi-weekly working session drafting ethical deployment guidelines for machine learning in crisis management and disaster relief.',
    description: `### Session Objectives
The AI & Humanitarian Action Working Group meets to finalize the Draft Principles for Predictive Analytics in Early Warning Disaster Systems.

### Key Working Agenda
- Reviewing field trial telemetry from UN OCHA & WFP pilot deployments.
- Algorithmic fairness audits in resource allocation models.
- Open floor for delegate feedback on Section 4: Privacy & Surveillance Risks.`,
    category: 'Working Group',
    startTime: `${YYYY}-${MM}-18T11:00:00.000Z`,
    endTime: `${YYYY}-${MM}-18T13:00:00.000Z`,
    locationType: 'hybrid',
    venue: 'Palais des Nations, Room XVII, Geneva & MS Teams',
    meetingUrl: 'https://teams.microsoft.com/l/meetup-join/un-humanitarian-ai-wg',
    speakers: [
      {
        id: 'spk-4',
        name: 'Dr. Priya Sharma',
        title: 'Chief Humanitarian Data Strategist',
        organization: 'UN Office for the Coordination of Humanitarian Affairs (OCHA)',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256'
      }
    ],
    createdById: 'un-user-001',
    updatedAt: '2026-08-04T09:15:00Z',
    targetAudience: 'Humanitarian Officers, Data Officers',
    topics: ['Humanitarian AI', 'Ethics', 'Crisis Response']
  },
  {
    id: 'evt-104',
    title: 'Panel Discussion: AI, Copyright, and Indigenous Knowledge Preservation',
    summary: 'A critical panel on protectable cultural heritage, open training datasets, and intellectual property rights in the generative era.',
    description: `### Expert Panel Insights
As generative models digest vast cultural heritage archives, how do we protect Indigenous data sovereignty and traditional knowledge?

### Featured Speakers
Panelists from UNESCO, WIPO, and indigenous tech networks discuss governance protocols, attribution standards, and fair compensation models for data contributors.`,
    category: 'Panel',
    startTime: `${YYYY}-${MM}-21T15:00:00.000Z`,
    endTime: `${YYYY}-${MM}-21T16:30:00.000Z`,
    locationType: 'virtual',
    meetingUrl: 'https://unesco.zoom.us/j/81239019283',
    speakers: [
      {
        id: 'spk-5',
        name: 'Kiri Te Kanawa',
        title: 'Cultural IP Specialist',
        organization: 'UNESCO Sector for Culture',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256'
      },
      {
        id: 'spk-6',
        name: 'David Nkomo',
        title: 'Senior Counsel',
        organization: 'WIPO Traditional Knowledge Division',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256'
      }
    ],
    createdById: 'un-user-002',
    updatedAt: '2026-08-05T14:00:00Z',
    targetAudience: 'Legal Counsel, Cultural Officers, Researchers',
    topics: ['Copyright', 'Data Sovereignty', 'UNESCO']
  },
  {
    id: 'evt-105',
    title: 'UN AI Society Networking Coffee & Tech Demo',
    summary: 'Informal monthly social gathering for UN staff, interns, and visiting delegates interested in emerging tech, with live demo stations.',
    description: `### Social Gathering & Lightning Demos
Unwind with fellow UN AI Society members over espresso and light refreshments!

### Event Highlights
* **Demo Station 1:** Local open-source LLMs running privately on UN hardware.
* **Demo Station 2:** Spatial computing for environmental crisis visualization.
* **Networking:** Meet colleagues across UN Secretariat, UNDP, UNICEF, and specialized agencies.`,
    category: 'Social',
    startTime: `${YYYY}-${MM}-25T16:30:00.000Z`,
    endTime: `${YYYY}-${MM}-25T18:30:00.000Z`,
    locationType: 'in-person',
    venue: 'UN Delegates Lounge & Terrace, 4th Floor, Secretariat Building, NYC',
    speakers: [
      {
        id: 'spk-7',
        name: 'UN AI Society Steering Committee',
        title: 'Community Organizers',
        organization: 'UN AI Society',
        avatarUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=256'
      }
    ],
    createdById: 'un-user-003',
    updatedAt: '2026-08-06T10:00:00Z',
    targetAudience: 'All UN Staff, Delegates, Interns & Friends',
    topics: ['Networking', 'Community', 'Tech Demos']
  },
  {
    id: 'evt-106',
    title: 'Autonomous Weapons Systems & International Law Briefing',
    summary: 'Closed-door briefing for disarmament experts on lethal autonomous weapons (LAWS) verification protocols.',
    description: `### Confidential Policy Session
An in-depth briefing analyzing technical verification mechanisms for autonomous targeting systems, human control thresholds, and compliance reporting.`,
    category: 'Keynote',
    startTime: `${YYYY}-${MM}-28T10:00:00.000Z`,
    endTime: `${YYYY}-${MM}-28T12:00:00.000Z`,
    locationType: 'in-person',
    venue: 'Conference Room C, UN Disarmament Affairs Wing, Vienna',
    speakers: [
      {
        id: 'spk-1',
        name: 'Dr. Amara Okezie',
        title: 'Senior AI Risk Advisor',
        organization: 'UNODA',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256'
      }
    ],
    createdById: 'un-user-001',
    updatedAt: '2026-08-07T11:00:00Z',
    targetAudience: 'UNODA Delegates, Security Advisors',
    topics: ['Disarmament', 'Autonomous Weapons', 'Ethics']
  }
];

export const INITIAL_RSVPS: EventRSVP[] = [
  {
    id: 'evt-101_un-user-001',
    eventId: 'evt-101',
    userId: 'un-user-001',
    userDisplayName: 'Dr. Amara Okezie',
    userEmail: 'amara.okezie@un.org',
    userDepartment: 'UNODA',
    status: 'attending',
    updatedAt: '2026-08-02T10:00:00Z'
  },
  {
    id: 'evt-101_un-user-002',
    eventId: 'evt-101',
    userId: 'un-user-002',
    userDisplayName: 'Jean-Luc Dupont',
    userEmail: 'jeanluc.dupont@un.org',
    userDepartment: 'ITU',
    status: 'attending',
    updatedAt: '2026-08-02T11:15:00Z'
  },
  {
    id: 'evt-102_un-user-003',
    eventId: 'evt-102',
    userId: 'un-user-003',
    userDisplayName: 'Elena Rostova',
    userEmail: 'elena.rostova@un.org',
    userDepartment: 'UNDP',
    status: 'interested',
    updatedAt: '2026-08-03T16:00:00Z'
  }
];
