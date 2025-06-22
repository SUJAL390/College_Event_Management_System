import React, { useState } from "react";
// @ts-ignore

import QrReader from "react-qr-scanner";

import { useNavigate } from "react-router-dom";

import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";

const AdminCheckIn: React.FC = () => {
  const { user } = useAuth();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleScan = async (data: string | null) => {
    if (!data || loading || scanned) return;

    console.log("Scanned data:", data);

    try {
      setLoading(true);
      setScanned(true); // prevent multiple scans

      const [registrationIdStr, unique_code] = data.split(":");
      const registration_id = parseInt(registrationIdStr, 10);

      if (isNaN(registration_id) || !unique_code) {
        throw new Error("Invalid QR code format");
      }

      const token = localStorage.getItem("access_token");

      const response = await axios.post(
        `http://localhost:8000/api/v1/registrations/${registration_id}/check-in?unique_code=${encodeURIComponent(
          unique_code
        )}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast({
        title: "Check-in successful",
        description: response.data?.message || "User checked in successfully.",
      });

      setTimeout(() => {
        navigate("/admin");
      }, 1500);
    } catch (err: any) {
      toast({
        title: "Check-in failed",
        description:
          err?.response?.data?.detail ||
          err.message ||
          "Invalid or already checked-in",
        variant: "destructive",
      });

      setTimeout(() => {
        navigate("/admin");
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (err: any) => {
    console.error("QR Scan Error:", err);
  };

  if (!user?.is_admin) {
    return (
      <div className="text-center text-red-500 p-4">
        You are not authorized to access the QR scanner.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Event Check-In (QR Scanner)</h2>

      {/* Render scanner only if not already scanned */}
      {!scanned && (
        <QrReader
          delay={300}
          onError={handleError}
          onScan={(data) => {
            if (data?.text) {
              handleScan(data.text);
            }
          }}
          style={{ width: "100%" }}
        />
      )}

      {loading && <p className="mt-4 text-muted-foreground">Checking in...</p>}
    </div>
  );
};

export default AdminCheckIn;
