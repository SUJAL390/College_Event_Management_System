
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import EventList from '@/components/events/EventList';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar } from 'lucide-react';
import { fetchEvents } from '@/services/eventService';
import { Event as EventType } from '@/types';

const Events: React.FC = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const allEvents = await fetchEvents();
        setEvents(allEvents);
        setFilteredEvents(allEvents);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadEvents();
  }, []);
  
  useEffect(() => {
    // Filter events based on search query and selected tags
    const filtered = events.filter(event => {
      // Check if event title or description matches search query
      const matchesSearch = searchQuery === '' || 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        event.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Check if event has all selected tags
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => event.tags.includes(tag));
      
      return matchesSearch && matchesTags;
    });
    
    setFilteredEvents(filtered);
  }, [searchQuery, selectedTags, events]);
  
  // Extract all unique tags from events
  const allTags = [...new Set(events.flatMap(event => event.tags))];
  
  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prevTags => 
      prevTags.includes(tag)
        ? prevTags.filter(t => t !== tag)
        : [...prevTags, tag]
    );
  };
  
  // Filter events by date
  const filterByDate = (dateType: 'all' | 'upcoming' | 'past') => {
    const today = new Date();
    
    if (dateType === 'all') {
      setFilteredEvents(events);
    } else if (dateType === 'upcoming') {
      const upcoming = events.filter(event => new Date(event.date) >= today);
      setFilteredEvents(upcoming);
    } else {
      const past = events.filter(event => new Date(event.date) < today);
      setFilteredEvents(past);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">College Events</h1>
            <p className="text-muted-foreground">
              Browse and register for upcoming events on campus
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Tabs defaultValue="all" className="w-full md:w-auto">
                <TabsList>
                  <TabsTrigger value="all" onClick={() => filterByDate('all')}>All</TabsTrigger>
                  <TabsTrigger value="upcoming" onClick={() => filterByDate('upcoming')}>Upcoming</TabsTrigger>
                  <TabsTrigger value="past" onClick={() => filterByDate('past')}>Past</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Filter by tags:</h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              {filteredEvents.length} {filteredEvents.length === 1 ? 'Event' : 'Events'} Found
            </h2>
            {selectedTags.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Filtered by:</span>
                {selectedTags.map(tag => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button 
                      onClick={() => toggleTag(tag)} 
                      className="ml-1 text-xs font-bold opacity-70 hover:opacity-100"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                <Button 
                  variant="link" 
                  size="sm" 
                  onClick={() => setSelectedTags([])}
                  className="text-xs p-0 h-auto"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>
          
          <EventList events={filteredEvents} loading={loading} />
          
          {!loading && filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-500 mb-4">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium">No events found</h3>
              <p className="text-muted-foreground mt-1">
                Try adjusting your search or filters
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTags([]);
                }}
                className="mt-4"
              >
                Reset filters
              </Button>
            </div>
          )}
        </div>
      </main>
      
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

export default Events;
