import { useEffect, useState } from "react";
import API from "../api/api";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get("/patients/dashboard-summary").then(res => setData(res.data));
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Patient Dashboard</h2>
        <p>Queue Position: {data?.queueInfo?.yourPosition || "-"}</p>
        <p>Next Appointment: {data?.todayAppointment?.appointmentTime || "None"}</p>
      </div>
    </>
  );
}
