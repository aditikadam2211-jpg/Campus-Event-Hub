export const currentUser = {
  id: 'user-001',
  name: 'Aditi Kadam',
  email: 'aditi.kadam@campus.edu',
  role: 'student',
  department: 'Electronics and Computer Science',
  year: 'Third Year',
  interests: ['AI', 'Design', 'Entrepreneurship'],
}

export const users = [
  currentUser,
  { id: 'coord-001', name: 'Aaryan Wavare', email: 'aaryan@campus.edu', role: 'coordinator' },
  { id: 'admin-001', name: 'Campus Admin', email: 'admin@campus.edu', role: 'admin' },
]

export const clubs = [
  { id: 'club-tech', name: 'Tech Society', coordinatorIds: ['coord-001'], color: 'indigo' },
  { id: 'club-culture', name: 'Cultural Council', coordinatorIds: ['coord-001'], color: 'rose' },
  { id: 'club-business', name: 'Business Club', coordinatorIds: ['coord-001'], color: 'emerald' },
  { id: 'club-literary', name: 'Literature Club', coordinatorIds: ['coord-001'], color: 'amber' },
]

export const events = [
  {
    id: 'event-ai-summit',
    title: 'Campus AI Summit',
    clubId: 'club-tech',
    category: 'Technology',
    venue: 'Conclave',
    startTime: '2026-09-08T10:00:00+05:30',
    endTime: '2026-09-08T16:00:00+05:30',
    seatLimit: 180,
    seatsFilled: 126,
    status: 'approved',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80',
    description: 'A day of student-led AI demos, faculty talks, and rapid prototyping sessions for applied campus problems.',
    highlights: ['Prototype showcase', 'Faculty keynote', 'Networking lunch'],
  },
  {
    id: 'event-music-night',
    title: 'Music Night',
    clubId: 'club-culture',
    category: 'Culture',
    venue: 'Conclave',
    startTime: '2026-09-05T18:30:00+05:30',
    endTime: '2026-09-05T21:00:00+05:30',
    seatLimit: 250,
    seatsFilled: 212,
    status: 'approved',
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=80',
    description: 'An open-air evening featuring student bands, poetry sets, and low-key food stalls under the courtyard lights.',
    highlights: ['Live bands', 'Open mic', 'Food stalls'],
  },
  
  {
    id: 'event-debate-cup',
    title: 'Interdepartment Debate Cup',
    clubId: 'club-literary',
    category: 'Literary',
    venue: 'Seminar Hall 2',
    startTime: '2026-09-18T15:00:00+05:30',
    endTime: '2026-09-18T18:00:00+05:30',
    seatLimit: 120,
    seatsFilled: 64,
    status: 'approved',
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80',
    description: 'A structured debate tournament with preliminary rounds, finals, adjudicator notes, and audience voting.',
    highlights: ['Team rounds', 'Audience vote', 'Final trophy'],
  },
  
]

export const registrations = [
  {
    id: 'reg-001',
    userId: 'user-001',
    eventId: 'event-ai-summit',
    status: 'registered',
    createdAt: '2026-08-26T12:10:00+05:30',
    checkedInAt: null,
  },
  {
    id: 'reg-002',
    userId: 'user-001',
    eventId: 'event-music-night',
    status: 'checked-in',
    createdAt: '2026-08-27T17:22:00+05:30',
    checkedInAt: '2026-09-05T18:41:00+05:30',
  },
]
