import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Search, Plus, Edit, X, MoreVertical } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import {
  fetchEvents,
  deleteEvent,
  getUserRegistrations,
} from "@/services/eventService";
import { getAttendancePredictions } from "@/services/mlservices";
import {
  fetchBugReports,
  updateBugStatus,
  deleteBugReport,
} from "@/services/bugService";
import { Event, BugReport } from "@/types";
import { toast } from "@/hooks/use-toast";

// Table components implemented directly for responsive design
const Table = ({ children, className = "", ...props }) => (
  <div className="overflow-x-auto">
    <table
      className={`w-full min-w-full divide-y divide-gray-200 ${className}`}
      {...props}
    >
      {children}
    </table>
  </div>
);

const TableHeader = ({ children, className = "", ...props }) => (
  <thead className={`bg-gray-50 ${className}`} {...props}>
    {children}
  </thead>
);

const TableRow = ({ children, className = "", ...props }) => (
  <tr className={`${className}`} {...props}>
    {children}
  </tr>
);

const TableHead = ({ children, className = "", ...props }) => (
  <th
    className={`px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}
    {...props}
  >
    {children}
  </th>
);

const TableBody = ({ children, className = "", ...props }) => (
  <tbody
    className={`bg-white divide-y divide-gray-200 ${className}`}
    {...props}
  >
    {children}
  </tbody>
);

const TableCell = ({ children, className = "", ...props }) => (
  <td
    className={`px-3 py-4 whitespace-nowrap text-sm text-gray-900 ${className}`}
    {...props}
  >
    {children}
  </td>
);

const AdminDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState<Event[]>([]);
  const [bugReports, setBugReports] = useState<BugReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventsSearchQuery, setEventsSearchQuery] = useState("");
  const [bugsSearchQuery, setBugsSearchQuery] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const [eventRegistrationCount, setEventRegistrationCount] = useState<
    Record<number, number>
  >({});
  const [attendancePrediction, setAttendancePrediction] = useState<
    Record<number, number>
  >({});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user?.is_admin !== true) {
      toast({
        title: "Access Denied",
        description: "You do not have permission to view this page",
        variant: "destructive",
      });
      navigate("/dashboard");
      return;
    }
    const loadRegistrations = async () => {
      try {
        const allRegistrations = await getUserRegistrations(); // admin will get all
        setRegistrations(allRegistrations);
        const countMap: Record<number, number> = {};
        allRegistrations.forEach((reg) => {
          countMap[reg.event_id] = (countMap[reg.event_id] || 0) + 1;
        });
        setEventRegistrationCount(countMap);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    loadRegistrations();

    const fetchBugs = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(
          "https://college-events-backend-j4bg.onrender.com/api/v1/bugs/?skip=0&limit=100",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch bug reports");
        }

        const data = await response.json();
        setBugReports(data);
      } catch (error) {
        console.error("Error fetching bug reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBugs();

    const loadData = async () => {
      try {
        const [eventsData, bugsData, allRegistrations] = await Promise.all([
          fetchEvents(),
          fetchBugReports(),
          getUserRegistrations(),
        ]);

        setEvents(eventsData);
        setBugReports(bugsData);
        setRegistrations(allRegistrations);

        const countMap: Record<number, number> = {};
        const eventUserMap: Record<number, number[]> = {};

        allRegistrations.forEach((reg: any) => {
          countMap[reg.event_id] = (countMap[reg.event_id] || 0) + 1;
          if (!eventUserMap[reg.event_id]) eventUserMap[reg.event_id] = [];
          eventUserMap[reg.event_id].push(reg.user_id);
        });

        setEventRegistrationCount(countMap);

        const predictionMap: Record<number, number> = {};
        const predictionCountMap: Record<number, number> = {};

        for (const [eventId, userIds] of Object.entries(eventUserMap)) {
          const predictions = await getAttendancePredictions(
            Number(eventId),
            userIds
          );

          predictions.forEach(({ event_id, attendance_probability }) => {
            predictionMap[event_id] =
              (predictionMap[event_id] || 0) + attendance_probability;
            predictionCountMap[event_id] =
              (predictionCountMap[event_id] || 0) + 1;
          });
        }

        Object.keys(predictionMap).forEach((eventId) => {
          const id = Number(eventId);
          predictionMap[id] = predictionMap[id] / predictionCountMap[id];
        });

        setAttendancePrediction(predictionMap);
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
        toast({
          title: "Error",
          description: "Failed to load administrative data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, isAuthenticated, navigate]);

  const handleUpdateBugStatus = async (
    bugId: number,
    status: "open" | "in-progress" | "resolved"
  ) => {
    try {
      // Call the API and get the updated bug
      const updatedBug: BugReport = await updateBugStatus(bugId, status);

      // Update local state with the full updated bug
      setBugReports((prev) =>
        prev.map((bug) => (bug.id === updatedBug.id ? updatedBug : bug))
      );

      toast({
        title: "Status updated",
        description: `Bug report status changed to ${status}`,
      });
    } catch (error) {
      console.error("Failed to update bug status:", error);
      toast({
        title: "Error",
        description: "Failed to update bug status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBug = async (bugId: string) => {
    try {
      await deleteBugReport(bugId);
      // Update the local state to remove the deleted bug
      setBugReports((prev) => prev.filter((bug) => bug.id !== bugId));

      toast({
        title: "Bug Deleted",
        description: "The bug report has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting bug:", error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete the bug report.",
        variant: "destructive",
      });
    }
  };

  // Filter events based on search query
  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(eventsSearchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(eventsSearchQuery.toLowerCase())
  );

  // Filter bug reports based on search query
  const filteredBugReports = bugReports.filter(
    (bug) =>
      bug.title.toLowerCase().includes(bugsSearchQuery.toLowerCase()) ||
      bug.description.toLowerCase().includes(bugsSearchQuery.toLowerCase()) ||
      bug.id.toLowerCase().includes(bugsSearchQuery.toLowerCase())
  );

  // Mobile Event Card Component
  const EventCard = ({ event }: { event: Event }) => (
    <div className="border rounded-lg p-3 sm:p-4 space-y-3 bg-white shadow-sm">
      <div className="flex flex-col space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <h3 className="font-semibold text-base sm:text-lg leading-tight flex-1">
            {event.title}
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/events/${event.id}/edit`)}
            className="flex items-center space-x-1 w-full sm:w-auto"
          >
            <Edit className="h-3 w-3" />
            <span>Edit</span>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span>{new Date(event.start_time).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
              {event.location}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="text-sm">
          <span className="font-medium">Registration: </span>
          <span
            className={`font-semibold ${
              eventRegistrationCount[event.id] >= event.capacity
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {eventRegistrationCount[event.id] || 0}/{event.capacity}
          </span>
        </div>

        {attendancePrediction[event.id] && (
          <div className="text-sm">
            <span className="font-medium">Predicted: </span>
            <span className="font-semibold text-blue-600">
              {(attendancePrediction[event.id] * 100).toFixed(2)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );

  // Mobile Bug Card Component
  const BugCard = ({ bug }: { bug: BugReport }) => (
    <div className="border rounded-lg p-3 sm:p-4 space-y-3 bg-white shadow-sm">
      <div className="flex flex-col space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-gray-500">#{bug.id}</span>
            <Badge
              className={`text-xs ${
                bug.status === "Open"
                  ? "bg-red-100 text-red-800"
                  : bug.status === "In-Progress"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {bug.status}
            </Badge>
          </div>
        </div>
        <h3 className="font-semibold leading-tight">{bug.title}</h3>
        <p className="text-sm text-gray-600">
          {new Date(bug.created_at).toLocaleDateString()}
        </p>
      </div>

      <div className="flex flex-col space-y-2">
        <select
          value={bug.status.toLowerCase()}
          onChange={(e) =>
            handleUpdateBugStatus(
              Number(bug.id),
              e.target.value as "open" | "in-progress" | "resolved"
            )
          }
          className="text-sm px-3 py-2 border border-gray-300 rounded-md w-full"
        >
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/bug-report/${bug.id}`)}
            className="flex-1"
          >
            View
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDeleteBug(bug.id)}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow bg-gray-50 py-4 sm:py-6 lg:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Manage events, users, and system reports
                </p>
              </div>
              <Button
                onClick={() => navigate("/events/create")}
                className="w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </div>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="events" className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-2 h-auto">
              <TabsTrigger
                value="events"
                className="text-xs sm:text-sm py-2 sm:py-3"
              >
                <span className="hidden sm:inline">Events Management</span>
                <span className="sm:hidden">Events</span>
              </TabsTrigger>
              <TabsTrigger
                value="bugs"
                className="text-xs sm:text-sm py-2 sm:py-3"
              >
                <span className="hidden sm:inline">Bug Reports</span>
                <span className="sm:hidden">Bugs</span>
              </TabsTrigger>
            </TabsList>

            {/* Events Tab */}
            <TabsContent value="events">
              <div className="bg-white rounded-lg shadow">
                {/* Search Bar */}
                <div className="p-4 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search events..."
                      value={eventsSearchQuery}
                      onChange={(e) => setEventsSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Events Content */}
                {loading ? (
                  <div className="text-center py-12">
                    <p>Loading events...</p>
                  </div>
                ) : filteredEvents.length > 0 ? (
                  <>
                    {/* Desktop Table - Hidden on mobile/tablet */}
                    <div className="hidden xl:block">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Registration</TableHead>
                            <TableHead>Predicted Attendance</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredEvents.map((event) => (
                            <TableRow key={event.id}>
                              <TableCell className="font-medium">
                                {event.title}
                              </TableCell>
                              <TableCell>
                                {new Date(
                                  event.start_time
                                ).toLocaleDateString()}
                              </TableCell>
                              <TableCell>{event.location}</TableCell>
                              <TableCell>
                                <span
                                  className={`font-medium ${
                                    eventRegistrationCount[event.id] >=
                                    event.capacity
                                      ? "text-destructive"
                                      : ""
                                  }`}
                                >
                                  {eventRegistrationCount[event.id] || 0}/
                                  {event.capacity}
                                </span>
                              </TableCell>
                              <TableCell>
                                {attendancePrediction[event.id]
                                  ? `${(
                                      attendancePrediction[event.id] * 100
                                    ).toFixed(2)}%`
                                  : "-"}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    navigate(`/events/${event.id}/edit`)
                                  }
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Mobile/Tablet Cards */}
                    <div className="xl:hidden p-4 space-y-4">
                      {filteredEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      No events found matching your search.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Bug Reports Tab */}
            <TabsContent value="bugs">
              <div className="bg-white rounded-lg shadow">
                {/* Search Bar */}
                <div className="p-4 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search bug reports..."
                      value={bugsSearchQuery}
                      onChange={(e) => setBugsSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Bug Reports Content */}
                {loading ? (
                  <div className="text-center py-12">
                    <p>Loading bug reports...</p>
                  </div>
                ) : bugReports.length > 0 ? (
                  <>
                    {/* Desktop Table - Hidden on mobile/tablet */}
                    <div className="hidden xl:block">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date Submitted</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {bugReports.map((bug) => (
                            <TableRow key={bug.id}>
                              <TableCell className="font-medium">
                                {bug.id}
                              </TableCell>
                              <TableCell>{bug.title}</TableCell>
                              <TableCell>
                                <Badge
                                  className={`${
                                    bug.status === "Open"
                                      ? "bg-red-500"
                                      : bug.status === "In-Progress"
                                      ? "bg-yellow-500"
                                      : "bg-blue-500"
                                  }`}
                                >
                                  {bug.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {new Date(bug.created_at).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col xl:flex-row gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      navigate(`/bug-report/${bug.id}`)
                                    }
                                  >
                                    View
                                  </Button>
                                  <select
                                    value={bug.status.toLowerCase()}
                                    onChange={(e) =>
                                      handleUpdateBugStatus(
                                        Number(bug.id),
                                        e.target.value as
                                          | "open"
                                          | "in-progress"
                                          | "resolved"
                                      )
                                    }
                                    className="text-sm px-2 py-1 border border-gray-300 rounded min-w-0"
                                  >
                                    <option value="open">Open</option>
                                    <option value="in-progress">
                                      In Progress
                                    </option>
                                    <option value="resolved">Resolved</option>
                                  </select>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDeleteBug(bug.id)}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Mobile/Tablet Cards */}
                    <div className="xl:hidden p-4 space-y-4">
                      {bugReports.map((bug) => (
                        <BugCard key={bug.id} bug={bug} />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      No bug reports found matching your search.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Quick Stats Section */}
          <div className="mt-6 sm:mt-8 bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              Quick Stats
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
              <div className="bg-blue-50 p-3 sm:p-4 rounded-md">
                <div className="text-blue-600 text-xl sm:text-2xl lg:text-3xl font-bold">
                  {events.length}
                </div>
                <div className="text-xs sm:text-sm text-blue-700">
                  Total Events
                </div>
              </div>

              <div className="bg-green-50 p-3 sm:p-4 rounded-md">
                <div className="text-green-600 text-xl sm:text-2xl lg:text-3xl font-bold">
                  {registrations.length}
                </div>
                <div className="text-xs sm:text-sm text-green-700">
                  Total Registrations
                </div>
              </div>

              <div className="bg-red-50 p-3 sm:p-4 rounded-md">
                <div className="text-red-600 text-xl sm:text-2xl lg:text-3xl font-bold">
                  {bugReports.filter((bug) => bug.status === "Open").length}
                </div>
                <div className="text-xs sm:text-sm text-red-700">
                  Open Bug Reports
                </div>
              </div>

              <div className="bg-yellow-50 p-3 sm:p-4 rounded-md">
                <div className="text-yellow-600 text-xl sm:text-2xl lg:text-3xl font-bold">
                  {
                    bugReports.filter((bug) => bug.status === "In-Progress")
                      .length
                  }
                </div>
                <div className="text-xs sm:text-sm text-yellow-700">
                  In-Progress Bugs
                </div>
              </div>

              <div className="bg-blue-50 p-3 sm:p-4 rounded-md col-span-2 sm:col-span-1">
                <div className="text-blue-600 text-xl sm:text-2xl lg:text-3xl font-bold">
                  {bugReports.filter((bug) => bug.status === "Resolved").length}
                </div>
                <div className="text-xs sm:text-sm text-blue-700">
                  Resolved Bugs
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-4 sm:py-6 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-7xl">
          <p className="text-xs sm:text-sm text-gray-500">
            © {new Date().getFullYear()} CampusEvents Admin Dashboard. All
            rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;
