import { BugReport } from "@/types";
const BASE_URL = "http://localhost:8000/api/v1/bugs";
// Mock data
const MOCK_BUG_REPORTS: BugReport[] = [
  {
    id: "BUG-1001",
    title: "Registration button not working",
    description:
      "When trying to register for an event, the button sometimes does not respond on first click.",
    // submittedBy:"",
    created_at: "2025-01-20T14:22:30Z",
    status: "Open",
    reported_by: "",
    updated_at: "",
  },
  {
    id: "BUG-1002",
    title: "QR code not displaying on mobile",
    description:
      "The QR code for event check-in is not displaying correctly on some mobile devices.",
    // submittedBy: "2",
    created_at: "2025-01-18T09:45:12Z",
    status: "In-Progress",
    reported_by: "",
    updated_at: "",
  },
  {
    id: "BUG-1003",
    title: "Date format inconsistent",
    description:
      "Date format is displayed differently in different parts of the application.",
    // submittedBy: "1",
    created_at: "2025-01-15T16:07:40Z",
    status: "Resolved",
    reported_by: "",
    updated_at: "",
  },
];

export const fetchBugReports = async (
  skip = 0,
  limit = 100
): Promise<BugReport[]> => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${BASE_URL}/?skip=${skip}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch bug reports");
  }

  const data = await response.json();
  return data;
};

// Submit a new bug report

// export const submitBugReport = async (
//   bugReport: Omit<BugReport, "id">
// ): Promise<BugReport> => {
//   // Simulate API call delay
//   await new Promise((resolve) => setTimeout(resolve, 1000));

//   const newBugReport: BugReport = {
//     ...bugReport,
//     id: `BUG-${1000 + MOCK_BUG_REPORTS.length + 1}`,
//   };

//   MOCK_BUG_REPORTS.unshift(newBugReport);
//   return newBugReport;
// };

export const updateBugStatus = async (
  bugId: number,
  status: "open" | "in-progress" | "resolved"
): Promise<BugReport> => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("User not authenticated");
  }

  // Map lowercase status to title case (required by backend)
  const statusMap: Record<
    "open" | "in-progress" | "resolved",
    "Open" | "In-Progress" | "Resolved"
  > = {
    open: "Open",
    "in-progress": "In-Progress",
    resolved: "Resolved",
  };

  try {
    const response = await fetch(`${BASE_URL}/${bugId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: statusMap[status],
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update bug report");
    }

    const updatedBug: BugReport = await response.json();
    return updatedBug;
  } catch (error) {
    console.error("Error updating bug report:", error);
    throw error;
  }
};

export const getUserBugReports = async (
  userId: string
): Promise<BugReport[]> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  return MOCK_BUG_REPORTS.filter((bug) => bug.reported_by === userId);
};

export const deleteBugReport = async (bugId: string): Promise<void> => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("No access token found");
  }

  const response = await fetch(`${BASE_URL}/${bugId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete bug report");
  }
};

export const getBugReportById = async (id: string): Promise<BugReport> => {
  const token = localStorage.getItem("access_token");
  const response = await fetch(`http://localhost:8000/api/v1/bugs/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch bug report");
  }

  return await response.json();
};
