
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, Check, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import QRCodeDisplay from '@/components/checkin/QRCodeDisplay';
import { getUserRegistrations, cancelRegistration } from '@/services/eventService';
import { Event, Registration } from '@/types';
import { toast } from '@/hooks/use-toast';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState<{ event: Event; registration: Registration }[]>([]);
  const [selectedRegistration, setSelectedRegistration] = useState<{ event: Event; registration: Registration } | null>(null);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const loadRegistrations = async () => {
      if (!user) return;
      
      try {
        const userRegistrations = await getUserRegistrations(user.id);
        setRegistrations(userRegistrations);
      } catch (error) {
        console.error('Failed to fetch registrations:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your registrations',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadRegistrations();
  }, [user, isAuthenticated, navigate]);
  
  const handleCancelRegistration = async (registrationId: string) => {
    try {
      await cancelRegistration(registrationId);
      
      // Update local state
      setRegistrations(prev => prev.filter(r => r.registration.id !== registrationId));
      
      toast({
        title: 'Registration cancelled',
        description: 'You have successfully cancelled your registration',
      });
      
      // If the cancelled registration was the selected one, clear the selection
      if (selectedRegistration && selectedRegistration.registration.id === registrationId) {
        setSelectedRegistration(null);
      }
    } catch (error) {
      console.error('Failed to cancel registration:', error);
      toast({
        title: 'Error',
        description: 'Failed to cancel registration',
        variant: 'destructive',
      });
    }
  };
  
  const upcomingEvents = registrations.filter(r => new Date(r.event.date) >= new Date());
  const pastEvents = registrations.filter(r => new Date(r.event.date) < new Date());

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Your Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your event registrations and QR codes
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs defaultValue="upcoming" className="w-full">
                <div className="bg-white rounded-lg shadow">
                  <div className="p-4 border-b">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
                      <TabsTrigger value="past">Past Events</TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="upcoming" className="p-4">
                    {loading ? (
                      <div className="text-center py-12">
                        <p>Loading your registrations...</p>
                      </div>
                    ) : upcomingEvents.length > 0 ? (
                      <div className="space-y-4">
                        {upcomingEvents.map(({ event, registration }) => (
                          <Card key={registration.id} className="overflow-hidden">
                            <div className="flex flex-col sm:flex-row">
                              <div className="sm:w-1/4 bg-muted">
                                <img 
                                  src={event.imageUrl || '/placeholder.svg'} 
                                  alt={event.title} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="sm:w-3/4 p-4">
                                <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
                                <div className="space-y-1 text-sm text-muted-foreground mb-4">
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" /> {event.date}
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1" /> {event.time}
                                  </div>
                                  <div className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-1" /> {event.location}
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  <Button 
                                    size="sm"
                                    onClick={() => setSelectedRegistration({ event, registration })}
                                  >
                                    View QR Code
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => navigate(`/events/${event.id}`)}
                                  >
                                    Event Details
                                  </Button>
                                  <Button 
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive hover:text-destructive/80"
                                    onClick={() => handleCancelRegistration(registration.id)}
                                  >
                                    Cancel Registration
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">You don't have any upcoming event registrations.</p>
                        <Button 
                          className="mt-4"
                          onClick={() => navigate('/events')}
                        >
                          Browse Events
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="past" className="p-4">
                    {loading ? (
                      <div className="text-center py-12">
                        <p>Loading your registrations...</p>
                      </div>
                    ) : pastEvents.length > 0 ? (
                      <div className="space-y-4">
                        {pastEvents.map(({ event, registration }) => (
                          <Card key={registration.id} className="overflow-hidden">
                            <div className="flex flex-col sm:flex-row">
                              <div className="sm:w-1/4 bg-muted">
                                <img 
                                  src={event.imageUrl || '/placeholder.svg'} 
                                  alt={event.title} 
                                  className="w-full h-full object-cover opacity-70"
                                />
                              </div>
                              <div className="sm:w-3/4 p-4">
                                <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
                                <div className="space-y-1 text-sm text-muted-foreground mb-4">
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" /> {event.date}
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1" /> {event.time}
                                  </div>
                                  <div className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-1" /> {event.location}
                                  </div>
                                </div>
                                <div className="flex items-center mb-4">
                                  <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    registration.attended 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {registration.attended ? (
                                      <>
                                        <Check className="h-3 w-3 mr-1" />
                                        Attended
                                      </>
                                    ) : (
                                      <>
                                        <X className="h-3 w-3 mr-1" />
                                        Did not attend
                                      </>
                                    )}
                                  </div>
                                </div>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => navigate(`/events/${event.id}`)}
                                >
                                  Event Details
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">You haven't attended any events yet.</p>
                      </div>
                    )}
                  </TabsContent>
                </div>
              </Tabs>
              
              {user?.role === 'admin' && (
                <div className="mt-8 bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Admin Actions</h2>
                  <div className="space-x-4">
                    <Button onClick={() => navigate('/admin')}>
                      Admin Dashboard
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/events/create')}>
                      Create Event
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Your Profile</CardTitle>
                  <CardDescription>Account information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium">Name</p>
                      <p className="text-muted-foreground">{user?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-muted-foreground">{user?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Role</p>
                      <p className="text-muted-foreground capitalize">{user?.role}</p>
                    </div>
                    {user?.role === 'student' && (
                      <div>
                        <p className="text-sm font-medium">Student ID</p>
                        <p className="text-muted-foreground">{user?.studentId}</p>
                      </div>
                    )}
                    <div className="pt-4 border-t">
                      <Button variant="outline" className="w-full" onClick={() => navigate('/settings')}>
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                  <CardDescription>Event participation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium">Upcoming Events</p>
                        <p className="text-3xl font-bold">{upcomingEvents.length}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Past Events</p>
                        <p className="text-3xl font-bold">{pastEvents.length}</p>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium">Events Attended</p>
                        <p className="text-3xl font-bold">
                          {pastEvents.filter(({ registration }) => registration.attended).length}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Missed Events</p>
                        <p className="text-3xl font-bold">
                          {pastEvents.filter(({ registration }) => !registration.attended).length}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* QR Code Modal */}
      {selectedRegistration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <QRCodeDisplay 
                qrValue={selectedRegistration.registration.qrCode}
                eventTitle={selectedRegistration.event.title}
              />
            </div>
            <div className="border-t p-4 flex justify-end">
              <Button 
                variant="ghost"
                onClick={() => setSelectedRegistration(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <footer className="bg-white py-6 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} CampusEvents. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
