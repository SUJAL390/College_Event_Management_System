import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const API_URL = "http://localhost:8000/api/v1/events/";

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    start_time: "",
    end_time: "",
    capacity: 0,
    category: "",
    image_url: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "capacity" ? (value === "" ? "" : parseInt(value)) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Format dates for API
    const payload = {
      ...formData,
      start_time: new Date(formData.start_time).toISOString(),
      end_time: new Date(formData.end_time).toISOString(),
    };
    
    const token = localStorage.getItem("access_token");
    
    console.log("payload", payload);
    
    try {
      // Use fetch instead of axios as a test
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ""
        },
        credentials: "include",
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Server error:", errorData);
        throw new Error(`Server responded with ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Event created:", data);
      toast({
        title: "Success!",
        description: "Event created successfully",
      });
      navigate("/events");
    } catch (error: any) {
      console.error(error);
      setError(error.message || "Failed to create event");
      toast({
        title: "Error",
        description: error.message || "Failed to create event",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Event</h2>
      {error && (
        <div className="p-3 mb-4 text-sm bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form fields... */}
        {/* Title */}
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring resize-none"
        />

        {/* Location */}
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
        />

        {/* Start Time */}
        <input
          type="datetime-local"
          name="start_time"
          value={formData.start_time}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
        />

        {/* End Time */}
        <input
          type="datetime-local"
          name="end_time"
          value={formData.end_time}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
        />

        {/* Capacity */}
        <input
          type="number"
          name="capacity"
          placeholder="Capacity"
          value={formData.capacity === 0 ? "" : formData.capacity}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
        />

        {/* Category */}
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
        />

        {/* Image URL (Optional) */}
        <input
          type="text"
          name="image_url"
          placeholder="Image URL (optional)"
          value={formData.image_url}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;