
import { Event, Registration } from '@/types';

// Mock data
const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Annual College Hackathon',
    description: 'A 24-hour coding event where students collaborate to build innovative solutions to real-world problems.',
    date: '2025-06-15',
    time: '10:00 AM - 10:00 AM (next day)',
    location: 'Engineering Building, Room 201',
    organizer: 'Computer Science Department',
    capacity: 100,
    registered: 78,
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    tags: ['technology', 'coding', 'competition']
  },
  {
    id: '2',
    title: 'Spring Music Festival',
    description: 'Featuring performances from student bands, local artists and our award-winning college orchestra.',
    date: '2025-05-20',
    time: '6:00 PM - 10:00 PM',
    location: 'Campus Central Plaza',
    organizer: 'Music Department',
    capacity: 500,
    registered: 423,
    imageUrl: 'https://images.unsplash.com/photo-1501612780327-45045538702b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    tags: ['music', 'arts', 'entertainment']
  },
  {
    id: '3',
    title: 'Career Fair 2025',
    description: 'Connect with over 50 top employers looking to hire students and recent graduates.',
    date: '2025-04-10',
    time: '9:00 AM - 3:00 PM',
    location: 'Student Union Building',
    organizer: 'Career Services',
    capacity: 300,
    registered: 300,
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    tags: ['career', 'professional', 'networking']
  },
  {
    id: '4',
    title: 'Environmental Awareness Workshop',
    description: 'Learn about sustainability practices and how you can contribute to a greener campus.',
    date: '2025-03-22',
    time: '2:00 PM - 5:00 PM',
    location: 'Science Building, Lecture Hall 3',
    organizer: 'Environmental Science Club',
    capacity: 75,
    registered: 42,
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    tags: ['environment', 'workshop', 'sustainability']
  },
  {
    id: '5',
    title: 'Sports Tournament Kickoff',
    description: 'Opening ceremony for the annual inter-college sports competition featuring 12 different sports.',
    date: '2025-07-05',
    time: '11:00 AM - 2:00 PM',
    location: 'University Stadium',
    organizer: 'Athletics Department',
    capacity: 2000,
    registered: 987,
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    tags: ['sports', 'competition', 'physical']
  },
  {
    id: '6',
    title: 'International Food Festival',
    description: 'Taste dishes from around the world prepared by our multicultural student community.',
    date: '2025-04-18',
    time: '12:00 PM - 4:00 PM',
    location: 'Campus Quad',
    organizer: 'International Students Association',
    capacity: 400,
    registered: 325,
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    tags: ['food', 'culture', 'international']
  }
];

const MOCK_REGISTRATIONS: Registration[] = [
  {
    id: 'reg1',
    eventId: '1',
    userId: '2', // student user
    registrationDate: '2025-01-15T10:30:00Z',
    attended: false,
    qrCode: 'reg1-event1-user2'
  }
];

export const fetchEvents = async (): Promise<Event[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return [...MOCK_EVENTS];
};

export const fetchEventById = async (eventId: string): Promise<Event | undefined> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_EVENTS.find(event => event.id === eventId);
};

export const registerForEvent = async (eventId: string, userId: string): Promise<Registration> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const event = MOCK_EVENTS.find(e => e.id === eventId);
  if (!event) {
    throw new Error('Event not found');
  }
  
  if (event.registered >= event.capacity) {
    throw new Error('Event is fully booked');
  }
  
  // Check if already registered
  const existingRegistration = MOCK_REGISTRATIONS.find(
    reg => reg.eventId === eventId && reg.userId === userId
  );
  
  if (existingRegistration) {
    throw new Error('Already registered for this event');
  }
  
  // Create new registration
  const newRegistration: Registration = {
    id: `reg${MOCK_REGISTRATIONS.length + 1}`,
    eventId,
    userId,
    registrationDate: new Date().toISOString(),
    attended: false,
    qrCode: `reg${MOCK_REGISTRATIONS.length + 1}-event${eventId}-user${userId}`
  };
  
  MOCK_REGISTRATIONS.push(newRegistration);
  
  // Update event registration count
  const eventIndex = MOCK_EVENTS.findIndex(e => e.id === eventId);
  if (eventIndex !== -1) {
    MOCK_EVENTS[eventIndex] = {
      ...MOCK_EVENTS[eventIndex],
      registered: MOCK_EVENTS[eventIndex].registered + 1
    };
  }
  
  return newRegistration;
};

export const getUserRegistrations = async (userId: string): Promise<{ event: Event, registration: Registration }[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const registrations = MOCK_REGISTRATIONS.filter(reg => reg.userId === userId);
  
  return registrations.map(reg => {
    const event = MOCK_EVENTS.find(e => e.id === reg.eventId);
    if (!event) {
      throw new Error(`Event with id ${reg.eventId} not found`);
    }
    return { event, registration: reg };
  });
};

export const cancelRegistration = async (registrationId: string): Promise<void> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const index = MOCK_REGISTRATIONS.findIndex(reg => reg.id === registrationId);
  if (index === -1) {
    throw new Error('Registration not found');
  }
  
  const eventId = MOCK_REGISTRATIONS[index].eventId;
  
  // Remove registration
  MOCK_REGISTRATIONS.splice(index, 1);
  
  // Update event registration count
  const eventIndex = MOCK_EVENTS.findIndex(e => e.id === eventId);
  if (eventIndex !== -1) {
    MOCK_EVENTS[eventIndex] = {
      ...MOCK_EVENTS[eventIndex],
      registered: Math.max(0, MOCK_EVENTS[eventIndex].registered - 1)
    };
  }
};

export const createEvent = async (eventData: Omit<Event, 'id'>): Promise<Event> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const newEvent: Event = {
    ...eventData,
    id: `${MOCK_EVENTS.length + 1}`
  };
  
  MOCK_EVENTS.push(newEvent);
  return newEvent;
};

export const updateEvent = async (eventId: string, eventData: Partial<Event>): Promise<Event> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const index = MOCK_EVENTS.findIndex(e => e.id === eventId);
  if (index === -1) {
    throw new Error('Event not found');
  }
  
  MOCK_EVENTS[index] = {
    ...MOCK_EVENTS[index],
    ...eventData
  };
  
  return MOCK_EVENTS[index];
};

export const deleteEvent = async (eventId: string): Promise<void> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const index = MOCK_EVENTS.findIndex(e => e.id === eventId);
  if (index === -1) {
    throw new Error('Event not found');
  }
  
  MOCK_EVENTS.splice(index, 1);
  
  // Also remove registrations for this event
  const regIndices = MOCK_REGISTRATIONS
    .map((reg, i) => reg.eventId === eventId ? i : -1)
    .filter(i => i !== -1)
    .sort((a, b) => b - a);
  
  for (const i of regIndices) {
    MOCK_REGISTRATIONS.splice(i, 1);
  }
};

export const markAttendance = async (registrationId: string, attended: boolean): Promise<void> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const registration = MOCK_REGISTRATIONS.find(r => r.id === registrationId);
  if (!registration) {
    throw new Error('Registration not found');
  }
  
  registration.attended = attended;
};
