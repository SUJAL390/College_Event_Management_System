import React, { useEffect, useState } from "react";
import EventCard from "./EventCard";
import { Event } from "@/types";
import { getUserRegistrations } from "@/services/eventService";

interface EventListProps {
  events: Event[];
  loading?: boolean;
}

const EventList: React.FC<EventListProps> = ({ events, loading = false }) => {
  const [registrationCounts, setRegistrationCounts] = useState<{
    [eventId: number]: number;
  }>({});

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const registrations = await getUserRegistrations();
        const counts: { [eventId: number]: number } = {};

        registrations.forEach((reg: any) => {
          const eventId = reg.event_id;
          counts[eventId] = (counts[eventId] || 0) + 1;
        });

        setRegistrationCounts(counts);
      } catch (error) {
        console.error("Failed to load registration counts:", error);
      }
    };

    fetchCounts();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="rounded-lg border border-muted p-4 animate-pulse h-[360px]"
          >
            <div className="w-full h-48 bg-muted rounded-md mb-4"></div>
            <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-muted rounded w-full mb-2"></div>
            <div className="h-4 bg-muted rounded w-2/3 mb-6"></div>
            <div className="h-10 bg-muted rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-2xl font-semibold text-muted-foreground">
          No events found
        </h3>
        <p className="text-muted-foreground mt-2">
          Check back later for upcoming events
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          registeredCount={registrationCounts[event.id] || 0}
        />
      ))}
    </div>
  );
};

export default EventList;
