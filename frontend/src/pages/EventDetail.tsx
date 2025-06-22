import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchEventById } from "@/services/eventService";
import { Event } from "@/types";
import { Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/Navbar";
import { registerForEvent } from "@/services/eventService";
import { useAuth } from "@/context/AuthContext";

const BACKEND_BASE_URL = "http://localhost:8000";

const EventDetail: React.FC = () => {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [registering, setRegistering] = useState(false);
  const [registerMessage, setRegisterMessage] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        if (id) {
          const fetchedEvent = await fetchEventById(id);
          setEvent(fetchedEvent);
        }
      } catch (err) {
        setError("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };

    loadEvent();

    const checkIfRegistered = async () => {
      try {
        const userId = Number(localStorage.getItem("user_id"));
        const token = localStorage.getItem("access_token");

        if (!userId || !token) return;

        const response = await fetch(
          "http://localhost:8000/api/v1/registrations/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        const alreadyRegistered = data.some(
          (r: any) => r.user_id === userId && r.event_id === Number(id)
        );

        if (alreadyRegistered) {
          setIsRegistered(true);
          setRegisterMessage("You are already registered for this event.");
        }
      } catch (err) {
        console.error("Failed to check registration", err);
      }
    };

    checkIfRegistered();
  }, [id]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error || !event)
    return (
      <div className="p-6 text-center text-red-500">
        {error || "Event not found"}
      </div>
    );

  const formattedStartDate = new Date(event.start_time).toLocaleDateString();
  const formattedEndDate = new Date(event.end_time).toLocaleDateString();
  const formattedStartTime = new Date(event.start_time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const formattedEndTime = new Date(event.end_time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Fix image URL to include backend base URL if needed
  const imgSrc = event.image_url
    ? event.image_url.startsWith("http")
      ? event.image_url
      : BACKEND_BASE_URL + event.image_url
    : "/placeholder.svg";

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
          ← Back to Events
        </Button>

        <div className="rounded-lg overflow-hidden shadow bg-white">
          <img
            src={imgSrc}
            alt={event.title}
            className="w-full h-64 object-cover"
          />
          <div className="p-6 space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-600">Title:</h2>
              <p className="text-xl font-bold">{event.title}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-600">Category:</h2>
              <Badge variant="secondary" className="text-sm">
                {event.category}
              </Badge>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-600">
                Description:
              </h2>
              <p className="text-muted-foreground">{event.description}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-600">
                Start Date:
              </h2>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                {formattedStartDate}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-600">End Date:</h2>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                {formattedEndDate}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-600">
                Start Time:
              </h2>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                {formattedStartTime}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-600">End Time:</h2>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                {formattedEndTime}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-600">Location:</h2>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2" />
                {event.location}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-600">Capacity:</h2>
              <span className="text-emerald-600 font-medium">
                {event.capacity} spots
              </span>
            </div>

            <div className="pt-4">
              {!user?.is_admin && (
                <>
                  <Button
                    className="w-full"
                    disabled={registering || isRegistered}
                    onClick={async () => {
                      setRegistering(true);
                      setRegisterMessage("");

                      try {
                        const userId = Number(localStorage.getItem("user_id"));
                        if (!userId)
                          throw new Error("User ID not found in localStorage.");

                        await registerForEvent(userId, Number(event.id));
                        setRegisterMessage(
                          "Successfully registered for the event!"
                        );
                        setIsRegistered(true);
                      } catch (error: any) {
                        setRegisterMessage(
                          error.message || "Registration failed."
                        );
                      } finally {
                        setRegistering(false);
                      }
                    }}
                  >
                    {isRegistered
                      ? "Registered"
                      : registering
                      ? "Registering..."
                      : "Register"}
                  </Button>

                  {registerMessage && (
                    <p className="text-sm mt-2 text-center text-muted-foreground">
                      {registerMessage}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
