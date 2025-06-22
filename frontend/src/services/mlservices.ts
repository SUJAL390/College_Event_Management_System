const API_BASE = "http://localhost:8000/api/v1/ml";

export interface AttendancePrediction {
  user_id: number;
  event_id: number;
  attendance_probability: number;
}

export async function getAttendancePredictions(
  eventId: number,
  userIds: number[]
): Promise<AttendancePrediction[]> {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${API_BASE}/predict-attendance`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify({
      event_id: eventId,
      user_ids: userIds,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch attendance predictions");
  }

  return response.json();
}
