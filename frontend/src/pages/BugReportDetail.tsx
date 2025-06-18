import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import { getBugReportById } from "@/services/bugService";
import { getAllUsers } from "@/services/UserServices";
import { BugReport, User } from "@/types";

const BugReportDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bug, setBug] = useState<BugReport | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bugData = await getBugReportById(id!);
        const allUsers = await getAllUsers();

        setBug(bugData);
        setUsers(allUsers);
      } catch (err) {
        setError("Failed to fetch bug or users.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleBack = () => navigate(-1);

  // Find the reporter from user list
  const reporter = users.find((u) => u.id === Number(bug?.reported_by));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Bug Report Details</h1>
          <Button variant="outline" onClick={handleBack}>
            ← Back
          </Button>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {bug && (
          <Card>
            <CardHeader>
              <CardTitle>{bug.title}</CardTitle>
              <CardDescription>Bug ID: {bug.id}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  <strong>Description:</strong> {bug.description}
                </p>
                <p>
                  <strong>Status:</strong> {bug.status}
                </p>
                <p>
                  <strong>Reported By:</strong>{" "}
                  {reporter ? reporter.username : "Unknown"}
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(bug.created_at).toLocaleString()}
                </p>
                <p>
                  <strong>Updated At:</strong>{" "}
                  {new Date(bug.updated_at).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BugReportDetail;
