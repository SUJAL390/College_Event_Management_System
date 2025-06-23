// @/services/eventService.ts
import { Event } from "@/types";

const API_URL =
  "https://college-events-backend-j4bg.onrender.com/api/v1/events/";

export async function fetchEvents(): Promise<Event[]> {
  const token = localStorage.getItem("access_token");

  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }

  const data = await response.json();
  return data as Event[];
}

export const deleteEvent = async (eventId: number) => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `https://college-events-backend-j4bg.onrender.com/api/v1/events/${eventId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete event");
  }

  // Only parse JSON if there's content
  if (response.status === 204) {
    return; // No content to return
  }

  return response.json();
};

export const registerForEvent = async (userId: number, eventId: number) => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    "https://college-events-backend-j4bg.onrender.com/api/v1/registrations",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // assuming backend requires it
      },
      body: JSON.stringify({ user_id: userId, event_id: eventId }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to register for the event");
  }

  return await response.json();
};

export const fetchEventById = async (id: string): Promise<Event> => {
  const token = localStorage.getItem("access_token");
  const response = await fetch(
    `https://college-events-backend-j4bg.onrender.com/api/v1/events/${id}/`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch event by ID");
  }

  return await response.json();
};

export const getUserRegistrations = async (skip = 0, limit = 100) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `https://college-events-backend-j4bg.onrender.com/api/v1/registrations?skip=${skip}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch registrations.");
  }

  return response.json();
};

export const cancelRegistration = async () => {
  return;
};

export const fetchRegistrationById = async (registrationId: number) => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `https://college-events-backend-j4bg.onrender.com/api/v1/registrations/${registrationId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch registration details.");
  }

  return await response.json();
};
