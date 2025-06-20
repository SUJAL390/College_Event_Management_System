import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Layout
import SidebarWrapper from "./components/layout/Sidebar";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
// import Register from "./pages/Register";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import BugReport from "./pages/BugReport";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";
import BugReportDetail from "./pages/BugReportDetail";
import StudentUsers from "./pages/StudentUsers";
import Registrations from "./pages/Registrations";
import AdminCheckIn from "./pages/Checkin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Routes without Sidebar */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />

            {/* Routes with Sidebar */}
            <Route element={<SidebarWrapper />}>
              <Route path="/index" element={<Index />} />
              <Route path="/events" element={<Events />} />
              <Route path="/student" element={<StudentUsers />} />
              <Route path="/registrations" element={<Registrations />} />
              <Route path="/checkin" element={<AdminCheckIn />} />
              <Route path="/events/create" element={<CreateEvent />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/events/:id/edit" element={<EditEvent />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowAdmin={false}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/bug-report" element={<BugReport />} />
              <Route path="/bug-report/:id" element={<BugReportDetail />} />
              <Route path="/about" element={<About />} />
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
