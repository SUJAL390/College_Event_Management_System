
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, Search, Plus, Edit, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import { fetchEvents, deleteEvent } from '@/services/eventService';
import { fetchBugReports, updateBugStatus } from '@/services/bugService';
import { Event, BugReport } from '@/types';
import { toast } from '@/hooks/use-toast';

const AdminDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [events, setEvents] = useState<Event[]>([]);
  const [bugReports, setBugReports] = useState<BugReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventsSearchQuery, setEventsSearchQuery] = useState('');
  const [bugsSearchQuery, setBugsSearchQuery] = useState('');
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user?.role !== 'admin') {
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to view this page',
        variant: 'destructive',
      });
      navigate('/dashboard');
      return;
    }
    
    const loadData = async () => {
      try {
        const [eventsData, bugsData] = await Promise.all([
          fetchEvents(),
          fetchBugReports()
        ]);
        
        setEvents(eventsData);
        setBugReports(bugsData);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load administrative data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [user, isAuthenticated, navigate]);
  
  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      try {
        await deleteEvent(eventId);
        
        // Update local state
        setEvents(prev => prev.filter(event => event.id !== eventId));
        
        toast({
          title: 'Event deleted',
          description: 'The event has been successfully deleted',
        });
      } catch (error) {
        console.error('Failed to delete event:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete event',
          variant: 'destructive',
        });
      }
    }
  };
  
  const handleUpdateBugStatus = async (bugId: string, status: 'open' | 'in-progress' | 'resolved') => {
    try {
      await updateBugStatus(bugId, status);
      
      // Update local state
      setBugReports(prev => prev.map(bug => 
        bug.id === bugId ? { ...bug, status } : bug
      ));
      
      toast({
        title: 'Status updated',
        description: `Bug report status changed to ${status}`,
      });
    } catch (error) {
      console.error('Failed to update bug status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update bug status',
        variant: 'destructive',
      });
    }
  };
  
  // Filter events based on search query
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(eventsSearchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(eventsSearchQuery.toLowerCase())
  );
  
  // Filter bug reports based on search query
  const filteredBugReports = bugReports.filter(bug => 
    bug.title.toLowerCase().includes(bugsSearchQuery.toLowerCase()) ||
    bug.description.toLowerCase().includes(bugsSearchQuery.toLowerCase()) ||
    bug.id.toLowerCase().includes(bugsSearchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Manage events, users, and system reports
              </p>
            </div>
            
            <div>
              <Button onClick={() => navigate('/events/create')}>
                <Plus className="h-4 w-4 mr-1" />
                Create Event
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="events" className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-2">
              <TabsTrigger value="events">Events Management</TabsTrigger>
              <TabsTrigger value="bugs">Bug Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="events">
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search events..."
                      value={eventsSearchQuery}
                      onChange={(e) => setEventsSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  {loading ? (
                    <div className="text-center py-12">
                      <p>Loading events...</p>
                    </div>
                  ) : filteredEvents.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Registration</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredEvents.map(event => (
                          <TableRow key={event.id}>
                            <TableCell className="font-medium">{event.title}</TableCell>
                            <TableCell>{event.date}</TableCell>
                            <TableCell>{event.location}</TableCell>
                            <TableCell>
                              <span className={`font-medium ${
                                event.registered >= event.capacity ? 'text-destructive' : ''
                              }`}>
                                {event.registered}/{event.capacity}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => navigate(`/events/${event.id}/edit`)}
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-destructive hover:text-destructive/80"
                                  onClick={() => handleDeleteEvent(event.id)}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No events found matching your search.</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="bugs">
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search bug reports..."
                      value={bugsSearchQuery}
                      onChange={(e) => setBugsSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  {loading ? (
                    <div className="text-center py-12">
                      <p>Loading bug reports...</p>
                    </div>
                  ) : filteredBugReports.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date Submitted</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredBugReports.map(bug => (
                          <TableRow key={bug.id}>
                            <TableCell className="font-medium">{bug.id}</TableCell>
                            <TableCell>{bug.title}</TableCell>
                            <TableCell>
                              <Badge className={`${
                                bug.priority === 'high' ? 'bg-red-500' :
                                bug.priority === 'medium' ? 'bg-yellow-500' :
                                'bg-blue-500'
                              }`}>
                                {bug.priority}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={`${
                                bug.status === 'open' ? 'bg-blue-500' :
                                bug.status === 'in-progress' ? 'bg-yellow-500' :
                                'bg-green-500'
                              }`}>
                                {bug.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{new Date(bug.submittedDate).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => navigate(`/bug-report/${bug.id}`)}
                                >
                                  View
                                </Button>
                                <select
                                  value={bug.status}
                                  onChange={(e) => handleUpdateBugStatus(
                                    bug.id, 
                                    e.target.value as 'open' | 'in-progress' | 'resolved'
                                  )}
                                  className="text-sm px-2 py-1 border border-gray-300 rounded"
                                >
                                  <option value="open">Open</option>
                                  <option value="in-progress">In Progress</option>
                                  <option value="resolved">Resolved</option>
                                </select>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No bug reports found matching your search.</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-4 rounded-md">
                <div className="text-blue-600 text-3xl font-bold">{events.length}</div>
                <div className="text-sm text-blue-700">Total Events</div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-md">
                <div className="text-green-600 text-3xl font-bold">
                  {events.reduce((total, event) => total + event.registered, 0)}
                </div>
                <div className="text-sm text-green-700">Total Registrations</div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-md">
                <div className="text-yellow-600 text-3xl font-bold">
                  {bugReports.filter(bug => bug.status === 'open').length}
                </div>
                <div className="text-sm text-yellow-700">Open Bug Reports</div>
              </div>
              
              <div className="bg-red-50 p-4 rounded-md">
                <div className="text-red-600 text-3xl font-bold">
                  {bugReports.filter(bug => bug.priority === 'high' && bug.status !== 'resolved').length}
                </div>
                <div className="text-sm text-red-700">High Priority Bugs</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="bg-white py-6 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} CampusEvents Admin Dashboard. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;
