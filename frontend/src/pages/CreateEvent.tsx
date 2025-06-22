import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { toast } from "@/hooks/use-toast";

const BACKEND_BASE_URL = "http://localhost:8000";
const IMAGE_UPLOAD_URL = `${BACKEND_BASE_URL}/api/v1/uploads/images`;
const EVENT_CREATE_URL = `${BACKEND_BASE_URL}/api/v1/events/`;

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "capacity" ? (value === "" ? 0 : parseInt(value)) : value,
    }));
  };

  const uploadImage = async (file: File): Promise<string> => {
    setImageUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const token = localStorage.getItem("access_token");

    const res = await fetch(IMAGE_UPLOAD_URL, {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: formData,
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => null);
      setImageUploading(false);
      throw new Error(errData?.detail || "Image upload failed");
    }

    const data = await res.json();
    setImageUploading(false);
    return data.url; // Relative URL from backend like "/static/uploads/xxx.jpg"
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    try {
      const url = await uploadImage(acceptedFiles[0]);
      setFormData((prev) => ({ ...prev, image_url: url }));
      toast({
        title: "Image uploaded",
        description: "Image uploaded successfully",
      });
    } catch (err: any) {
      toast({
        title: "Upload failed",
        description: err.message || "Failed to upload image",
        variant: "destructive",
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.image_url) {
      setLoading(false);
      setError("Please upload an image");
      return;
    }

    const payload = {
      ...formData,
      start_time: new Date(formData.start_time).toISOString(),
      end_time: new Date(formData.end_time).toISOString(),
      capacity: Number(formData.capacity),
    };

    const token = localStorage.getItem("access_token");

    try {
      const res = await fetch(EVENT_CREATE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.detail || `Server error: ${res.status}`);
      }

      toast({
        title: "Success!",
        description: "Event created successfully",
      });
      navigate("/events");
    } catch (err: any) {
      setError(err.message || "Failed to create event");
      toast({
        title: "Error",
        description: err.message || "Failed to create event",
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
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg resize-none"
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg"
        />

        <input
          type="datetime-local"
          name="start_time"
          value={formData.start_time}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg"
        />

        <input
          type="datetime-local"
          name="end_time"
          value={formData.end_time}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg"
        />

        <input
          type="number"
          name="capacity"
          placeholder="Capacity"
          value={formData.capacity === 0 ? "" : formData.capacity}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg"
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg"
        />

        {/* Drag & drop image upload */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer ${
            isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
        >
          <input {...getInputProps()} />
          {imageUploading ? (
            <p>Uploading image...</p>
          ) : formData.image_url ? (
            <img
              src={
                formData.image_url.startsWith("http")
                  ? formData.image_url
                  : BACKEND_BASE_URL + formData.image_url
              }
              alt="Uploaded preview"
              className="mx-auto h-40 object-contain"
            />
          ) : (
            <p>Drag & drop an image here, or click to select one</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || imageUploading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
