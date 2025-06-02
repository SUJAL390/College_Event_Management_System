
import { BugReport } from '@/types';

// Mock data
const MOCK_BUG_REPORTS: BugReport[] = [
  {
    id: 'BUG-1001',
    title: 'Registration button not working',
    description: 'When trying to register for an event, the button sometimes does not respond on first click.',
    submittedBy: '2',
    submittedDate: '2025-01-20T14:22:30Z',
    status: 'open',
    priority: 'medium',
  },
  {
    id: 'BUG-1002',
    title: 'QR code not displaying on mobile',
    description: 'The QR code for event check-in is not displaying correctly on some mobile devices.',
    submittedBy: '2',
    submittedDate: '2025-01-18T09:45:12Z',
    status: 'in-progress',
    priority: 'high',
  },
  {
    id: 'BUG-1003',
    title: 'Date format inconsistent',
    description: 'Date format is displayed differently in different parts of the application.',
    submittedBy: '1',
    submittedDate: '2025-01-15T16:07:40Z',
    status: 'resolved',
    priority: 'low',
  }
];

export const fetchBugReports = async (): Promise<BugReport[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return [...MOCK_BUG_REPORTS];
};

export const submitBugReport = async (bugReport: Omit<BugReport, 'id'>): Promise<BugReport> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newBugReport: BugReport = {
    ...bugReport,
    id: `BUG-${1000 + MOCK_BUG_REPORTS.length + 1}`
  };
  
  MOCK_BUG_REPORTS.unshift(newBugReport);
  return newBugReport;
};

export const updateBugStatus = async (bugId: string, status: 'open' | 'in-progress' | 'resolved'): Promise<BugReport> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const bugReport = MOCK_BUG_REPORTS.find(bug => bug.id === bugId);
  if (!bugReport) {
    throw new Error('Bug report not found');
  }
  
  bugReport.status = status;
  return bugReport;
};

export const getUserBugReports = async (userId: string): Promise<BugReport[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return MOCK_BUG_REPORTS.filter(bug => bug.submittedBy === userId);
};
