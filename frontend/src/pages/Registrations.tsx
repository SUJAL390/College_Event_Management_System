import React, { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchEvents, getUserRegistrations } from "@/services/eventService";
import { getAllUsers } from "@/services/UserServices";
import { Event, User } from "@/types";

interface Registration {
  id: number;
  user_id: number;
  event_id: number;
  registration_date: string;
  check_in_time: string;
  unique_code: string;
}

const Registrations: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [visibleEventIds, setVisibleEventIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [eventsData, usersData, regData] = await Promise.all([
          fetchEvents(),
          getAllUsers(),
          getUserRegistrations(),
        ]);
        setEvents(eventsData);
        setUsers(usersData);
        setRegistrations(regData);
      } catch (err) {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const toggleVisible = (eventId: number) => {
    setVisibleEventIds((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
  };

  const getRegistrationsForEvent = (eventId: number) =>
    registrations.filter((reg) => reg.event_id === eventId);

  const getUserById = (userId: number) => users.find((u) => u.id === userId);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Event Registrations</h1>

        {loading && <p>Loading events and registrations...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading &&
          !error &&
          events.map((event) => {
            const eventRegs = getRegistrationsForEvent(event.id);
            const isVisible = visibleEventIds.includes(event.id);

            return (
              <Card key={event.id} className="mb-6">
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription>
                    {eventRegs.length} student(s) registered
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => toggleVisible(event.id)}
                    className="mb-4"
                  >
                    {isVisible ? "Hide" : "View"}
                  </Button>

                  {isVisible && (
                    <>
                      {eventRegs.length === 0 ? (
                        <p className="text-muted-foreground">
                          No students registered.
                        </p>
                      ) : (
                        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                          {eventRegs.map((reg) => {
                            const user = getUserById(reg.user_id);
                            return (
                              <li key={reg.id}>
                                <strong>
                                  {user?.username ?? "Unknown User"}
                                </strong>{" "}
                                — {user?.email ?? "No email"}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
      </div>
    </div>
  );
};

export default Registrations;
