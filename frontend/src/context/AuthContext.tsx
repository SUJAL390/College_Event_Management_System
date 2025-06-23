import React, { createContext, useState, useContext, ReactNode } from "react";
import { User, UserRole } from "@/types";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

const API_URL = "https://college-events-backend-j4bg.onrender.com/api/v1";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  register: (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const isAuthenticated = !!user;

  const login = async (email: string, password: string) => {
    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const response = await axios.post(`${API_URL}/auth/login`, formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      // Response contains access_token and token_type
      const { access_token } = response.data;
      localStorage.setItem("access_token", access_token);

      // Fetch user profile with token
      const profileResponse = await axios.get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      const userData: User = profileResponse.data;

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("user_id", userData.id.toString());

      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.username}!`,
      });
      return userData;
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ) => {
    if (!name || !email || !password || !role) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all the fields before registering.",
        variant: "destructive",
      });
      return;
    }
    try {
      const payload = {
        email,
        password,
        role,
        username: name,
      };

      await axios.post(`${API_URL}/auth/register`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      toast({
        title: "Registration successful",
        description: `Welcome, ${name}! You can now log in.`,
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Please enter a valid email",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, register, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
