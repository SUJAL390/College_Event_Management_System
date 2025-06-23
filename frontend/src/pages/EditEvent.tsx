import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const API_BASE =
  "https://college-events-backend-j4bg.onrender.com/api/v1/events";
const IMAGE_UPLOAD_URL =
  "https://college-events-backend-j4bg.onrender.com/api/v1/uploads/images";

const EditEvent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

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

  useEffect(() => {
    const fetchEvent = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const response = await fetch(`${API_BASE}/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch event.");
        const data = await response.json();

        setFormData({
          ...data,
          start_time: data.start_time.slice(0, 16), // for datetime-local input
          end_time: data.end_time.slice(0, 16),
        });
      } catch (err) {
        toast({
          title: "Error loading event",
          description: "Could not load event data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "capacity" ? parseInt(value) || 0 : value,
    }));
  };

  // Handle drag-drop or click file input change
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Only image files are allowed.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const token = localStorage.getItem("access_token");
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const response = await fetch(IMAGE_UPLOAD_URL, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: formDataUpload,
      });

      if (!response.ok) throw new Error("Image upload failed.");

      const data = await response.json();
      setFormData((prev) => ({
        ...prev,
        image_url: data.url,
      }));

      toast({
        title: "Image uploaded",
        description: "Image uploaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: (error as Error).message || "Could not upload image.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Reset input so same file can be re-uploaded if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Drag and Drop Handlers
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      // Manually trigger file input change event with this file
      const dt = new DataTransfer();
      dt.items.add(file);
      if (fileInputRef.current) {
        fileInputRef.current.files = dt.files;
        handleFileChange({
          target: fileInputRef.current,
        } as React.ChangeEvent<HTMLInputElement>);
      }
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Trigger file dialog on box click
  const handleBoxClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          ...formData,
          start_time: new Date(formData.start_time).toISOString(),
          end_time: new Date(formData.end_time).toISOString(),
        }),
      });

      if (!response.ok) throw new Error("Update failed.");
      toast({ title: "Event Updated!", description: "Successfully saved." });
      navigate("/events");
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Please check input or try again later.",
        variant: "destructive",
      });
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full px-4 py-2 border rounded-lg resize-none"
          required
        />
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
        <input
          type="datetime-local"
          name="start_time"
          value={formData.start_time}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
        <input
          type="datetime-local"
          name="end_time"
          value={formData.end_time}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
        <input
          type="number"
          name="capacity"
          value={formData.capacity}
          onChange={handleChange}
          placeholder="Capacity"
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category"
          className="w-full px-4 py-2 border rounded-lg"
          required
        />

        {/* Image upload area */}
        <div
          className={`w-full h-40 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer
            ${
              uploading
                ? "opacity-50 pointer-events-none"
                : "hover:border-blue-600"
            }
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={handleBoxClick}
          title="Click or drag & drop image here to upload"
        >
          {formData.image_url ? (
            <img
              src={formData.image_url}
              alt="Event"
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <p className="text-muted-foreground select-none">
              Drag & drop an image or click to select
            </p>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditEvent;
