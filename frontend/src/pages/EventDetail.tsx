
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, User, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import QRCodeDisplay from '@/components/checkin/QRCodeDisplay';
import { fetchEventById, registerForEvent, getUserRegistrations } from '@/services/eventService';
import { Event, Registration } from '@/types';
import { toast } from '@/hooks/use-toast';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [userRegistration, setUserRegistration] = useState<Registration | null>(null);
  const [showQrCode, setShowQrCode] = useState(false);
  
  useEffect(() => {
    const loadEvent = async () => {
      if (!id) return;
      
      try {
        const eventData = await fetchEventById(id);
        if (!eventData) {
          toast({
            title: 'Event not found',
            description: 'The event you are looking for does not exist or has been removed',
            variant: 'destructive',
          });
          navigate('/events');
          return;
        }
        
        setEvent(eventData);
        
        // Check if user is registered for this event
        if (isAuthenticated && user) {
          const userRegs = await getUserRegistrations(user.id);
          const registration = userRegs.find(reg => reg.event.id === id)?.registration || null;
          setUserRegistration(registration);
        }
      } catch (error) {
        console.error('Failed to fetch event:', error);
        toast({
          title: 'Error',
          description: 'Failed to load event details',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadEvent();
  }, [id, navigate, isAuthenticated, user]);
  
  const handleRegister = async () => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication required',
        description: 'You need to log in to register for events',
      });
      navigate('/login');
      return;
    }
    
    if (!event || !user) return;
    
    setRegistering(true);
    
    try {
      const registration = await registerForEvent(event.id, user.id);
      setUserRegistration(registration);
      
      // Update event data to reflect new registration count
      setEvent(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          registered: prev.registered + 1
        };
      });
      
      toast({
        title: 'Registration successful',
        description: `You are now registered for ${event.title}`,
      });
      
      // Show QR code after successful registration
      setShowQrCode(true);
    } catch (error) {
      console.error('Registration failed:', error);
      toast({
        title: 'Registration failed',
        description: error instanceof Error ? error.message : 'An error occurred during registration',
        variant: 'destructive',
      });
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow bg-gray-50 py-8">
        {loading ? (
          <div className="container mx-auto px-4 text-center py-12">
            <p>Loading event details...</p>
          </div>
        ) : event ? (
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-64 bg-muted overflow-hidden">
                <img 
                  src={event.imageUrl || '/placeholder.svg'} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    {userRegistration ? (
                      <Button onClick={() => setShowQrCode(true)}>Show Check-in QR</Button>
                    ) : (
                      <Button 
                        onClick={handleRegister} 
                        disabled={registering || event.registered >= event.capacity}
                      >
                        {registering 
                          ? 'Registering...' 
                          : event.registered >= event.capacity 
                            ? 'Fully Booked' 
                            : 'Register Now'
                        }
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Date & Time</h3>
                      <div className="flex items-start">
                        <Calendar className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                        <div>
                          <div>{event.date}</div>
                          <div className="text-muted-foreground">{event.time}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Location</h3>
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                        <div>{event.location}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Organizer</h3>
                      <div className="flex items-center">
                        <User className="h-5 w-5 mr-2 text-muted-foreground" />
                        <div>{event.organizer}</div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Capacity</h3>
                      <div className="flex items-center">
                        <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                        <div>
                          <span className={event.registered >= event.capacity ? "text-destructive" : ""}>
                            {event.registered} / {event.capacity}
                          </span> {' '}
                          attendees
                        </div>
                      </div>
                      
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            event.registered >= event.capacity 
                              ? 'bg-red-500' 
                              : event.registered >= event.capacity * 0.8 
                                ? 'bg-yellow-500' 
                                : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(100, (event.registered / event.capacity) * 100)}%` }}
                        ></div>
                      </div>
                      
                      {event.registered >= event.capacity && (
                        <p className="text-sm text-destructive mt-1">This event is fully booked</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Registration Status</h3>
                    
                    {userRegistration ? (
                      <div className="bg-green-50 border border-green-200 rounded-md p-4">
                        <div className="flex items-center text-green-800 font-medium mb-2">
                          <Check className="h-5 w-5 mr-2" />
                          You're registered
                        </div>
                        <p className="text-sm text-green-700">
                          You have successfully registered for this event. Use your QR code for check-in.
                        </p>
                        <Button 
                          variant="outline" 
                          className="mt-3"
                          onClick={() => setShowQrCode(true)}
                        >
                          Show QR Code
                        </Button>
                      </div>
                    ) : isAuthenticated ? (
                      <div className={`rounded-md p-4 ${
                        event.registered >= event.capacity 
                          ? 'bg-red-50 border border-red-200' 
                          : 'bg-blue-50 border border-blue-200'
                      }`}>
                        <p className={`text-sm ${
                          event.registered >= event.capacity 
                            ? 'text-red-700' 
                            : 'text-blue-700'
                        }`}>
                          {event.registered >= event.capacity 
                            ? 'This event is fully booked. No more registrations are available.'
                            : 'Register now to secure your spot at this event.'
                          }
                        </p>
                        <Button 
                          className={`mt-3 ${
                            event.registered >= event.capacity 
                              ? 'bg-gray-300 hover:bg-gray-300 cursor-not-allowed' 
                              : ''
                          }`} 
                          disabled={event.registered >= event.capacity || registering}
                          onClick={handleRegister}
                        >
                          {registering 
                            ? 'Registering...' 
                            : event.registered >= event.capacity 
                              ? 'Fully Booked' 
                              : 'Register Now'
                          }
                        </Button>
                      </div>
                    ) : (
                      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                        <p className="text-sm text-blue-700">
                          Please log in to register for this event.
                        </p>
                        <Button 
                          className="mt-3"
                          onClick={() => navigate('/login')}
                        >
                          Log In
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h2 className="text-xl font-semibold mb-4">Event Description</h2>
                  <div className="prose max-w-none">
                    <p>{event.description}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <Button 
                variant="outline" 
                onClick={() => navigate('/events')}
              >
                Back to Events
              </Button>
            </div>
          </div>
        ) : (
          <div className="container mx-auto px-4 text-center py-12">
            <p>Event not found</p>
            <Button 
              className="mt-4"
              onClick={() => navigate('/events')}
            >
              Back to Events
            </Button>
          </div>
        )}
      </div>
      
      {/* QR Code Modal */}
      {showQrCode && userRegistration && event && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <QRCodeDisplay 
                qrValue={userRegistration.qrCode}
                eventTitle={event.title}
              />
            </div>
            <div className="border-t p-4 flex justify-end">
              <Button 
                variant="ghost"
                onClick={() => setShowQrCode(false)}
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

export default EventDetail;
