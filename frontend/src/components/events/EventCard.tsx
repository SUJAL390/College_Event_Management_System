import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";
import { Event } from "@/types";
import { useAuth } from "@/context/AuthContext";

interface EventCardProps {
  event: Event;
  registeredCount?: number; // passed optionally from parent
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  registeredCount = 0,
}) => {
  const navigate = useNavigate();
  const isFullyBooked = registeredCount >= event.capacity;
  const { user } = useAuth();

  // Extract date and time from ISO string
  const formattedDate = new Date(event.start_time).toLocaleDateString();
  const formattedTime = new Date(event.start_time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card className="event-card overflow-hidden h-full flex flex-col">
      <div className="aspect-video w-full overflow-hidden bg-muted">
        <img
          src={event.image_url || "/placeholder.svg"}
          alt={event.title}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader className="p-4">
        <div className="space-y-1">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg line-clamp-2">{event.title}</h3>
          </div>
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs">
              {event.category}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
          {event.description}
        </p>
        <div className="text-sm space-y-2">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" /> {formattedDate} •{" "}
            {formattedTime}
          </div>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
          {user.is_admin === true && (
            <div className="text-xs">
              <span
                className={
                  isFullyBooked ? "text-destructive" : "text-emerald-600"
                }
              >
                {registeredCount} / {event.capacity} spots filled
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => navigate(`/events/${event.id}`)}
          className="w-full"
          disabled={isFullyBooked}
        >
          {isFullyBooked ? "Fully Booked" : "View Details"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
