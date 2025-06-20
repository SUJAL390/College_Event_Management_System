import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogOut = () => {
    logout();
    navigate("/login");
  };

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo or Nav links */}
          <div className="flex items-center">
            {/* Hamburger Button for Mobile */}
            <button
              onClick={toggleMobileMenu}
              className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500"
              aria-label="Toggle menu"
            >
              {/* Hamburger icon */}
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            {/* Desktop Nav Links */}
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link
                to="/events"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive("/events")
                    ? "border-college-600 text-college-800"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Events
              </Link>

              {isAuthenticated && user.is_admin === false && (
                <Link
                  to="/dashboard"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive("/dashboard")
                      ? "border-college-600 text-college-800"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Dashboard
                </Link>
              )}

              <Link
                to="/about"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive("/about")
                    ? "border-college-600 text-college-800"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                About
              </Link>

              {isAuthenticated && user?.is_admin === true && (
                <Link
                  to="/admin"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive("/admin")
                      ? "border-college-600 text-college-800"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Admin
                </Link>
              )}

              {isAuthenticated && user?.is_admin === true && (
                <Link
                  to="/student"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive("/student")
                      ? "border-college-600 text-college-800"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Student Users
                </Link>
              )}

              {isAuthenticated && user?.is_admin === true && (
                <Link
                  to="/registrations"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive("/registrations")
                      ? "border-college-600 text-college-800"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Registrations
                </Link>
              )}
              {isAuthenticated && user?.is_admin === true && (
                <Link
                  to="/checkin"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive("/checkin")
                      ? "border-college-600 text-college-800"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Check-In
                </Link>
              )}

              {isAuthenticated && user.is_admin === false && (
                <Link
                  to="/bug-report"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive("/bug-report")
                      ? "border-college-600 text-college-800"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Report Bug
                </Link>
              )}
            </div>
          </div>

          {/* Right side - Auth buttons and avatar */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar>
                      <AvatarFallback className="bg-college-100 text-college-600">
                        {user?.username
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="font-medium">{user?.username}</div>
                    <div className="text-xs text-muted-foreground">
                      {user?.email}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {user?.is_admin === false ? `Student ` : "Administrator"}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogOut}>
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="space-x-2">
                <Button variant="outline" onClick={() => navigate("/login")}>
                  Log in
                </Button>
                <Button
                  className="bg-college-600 hover:bg-college-700"
                  onClick={() => navigate("/register")}
                >
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu, toggle visibility */}
      {mobileMenuOpen && (
        <div className="sm:hidden px-4 pt-2 pb-3 space-y-1 border-t border-gray-200">
          <Link
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive("/events")
                ? "bg-college-100 text-college-800"
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            Events
          </Link>

          {isAuthenticated && user.is_admin === false && (
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/dashboard")
                  ? "bg-college-100 text-college-800"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              Dashboard
            </Link>
          )}

          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive("/about")
                ? "bg-college-100 text-college-800"
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            About
          </Link>

          {isAuthenticated && user?.is_admin === true && (
            <>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/admin")
                    ? "bg-college-100 text-college-800"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                Admin
              </Link>
              <Link
                to="/student"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/student")
                    ? "bg-college-100 text-college-800"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                Student Users
              </Link>
              <Link
                to="/registrations"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/registrations")
                    ? "bg-college-100 text-college-800"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                Registrations
              </Link>
            </>
          )}

          {isAuthenticated && user.is_admin === false && (
            <Link
              to="/bug-report"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/bug-report")
                  ? "bg-college-100 text-college-800"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              Report Bug
            </Link>
          )}

          {!isAuthenticated && (
            <>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              >
                Log in
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
