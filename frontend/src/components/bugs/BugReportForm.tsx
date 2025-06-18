import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { BugReport } from "@/types";

interface BugReportFormProps {
  onSubmitSuccess?: (report: BugReport) => void;
}

const BugReportForm: React.FC<BugReportFormProps> = ({ onSubmitSuccess }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch("http://localhost:8000/api/v1/bugs/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // If auth is required
        },
        body: JSON.stringify({
          title,
          description,
          status: "Open",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit bug report");
      }

      const data = await response.json();

      toast({
        title: "Bug report submitted",
        description: "Thank you for your feedback!",
      });

      // Reset form
      setTitle("");
      setDescription("");
      setPriority("medium");

      if (onSubmitSuccess) {
        // You can map the API response to your custom BugReport type if needed
        onSubmitSuccess({
          id: `BUG-${data.id}`, // or just use data.id
          title: data.title,
          description: data.description,
          reported_by: user?.id ? String(user.id) : "anonymous",
          created_at: data.created_at,
          status: data.status,
          updated_at: "",
        });
      }
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Brief description of the issue"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Please provide details about the bug, steps to reproduce, and expected behavior"
          rows={5}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Submitting..." : "Submit Bug Report"}
      </Button>
    </form>
  );
};

export default BugReportForm;
