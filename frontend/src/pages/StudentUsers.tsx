import React, { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { User } from "@/types";
import { getAllUsers } from "@/services/UserServices";

const StudentUsers: React.FC = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const allUsers = await getAllUsers();
        // Filter students (is_admin === false)
        const studentUsers = allUsers.filter((user) => !user.is_admin);
        setStudents(studentUsers);
      } catch (err) {
        setError("Failed to fetch student users.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Student Accounts</h1>

        <Card>
          <CardHeader>
            <CardTitle>Students</CardTitle>
            <CardDescription>List of all student users</CardDescription>
          </CardHeader>
          <CardContent>
            {loading && <p>Loading students...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && students.length === 0 && (
              <p>No student accounts found.</p>
            )}

            {!loading && !error && students.length > 0 && (
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                {students.map((student) => (
                  <li key={student.id}>
                    <strong>{student.username}</strong> — {student.email}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentUsers;
