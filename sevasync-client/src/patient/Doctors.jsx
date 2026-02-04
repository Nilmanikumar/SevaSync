import { useEffect, useState } from "react";
import API from "../api/api";
import Navbar from "../components/Navbar";

export default function Doctors() {
  const dept = new URLSearchParams(window.location.search).get("dept");
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    API.get(`/patients/doctors?department=${dept}`)
      .then(res => setDoctors(res.data.doctors));
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">{dept} Doctors</h2>
        {doctors.map(d => (
          <div key={d._id} className="border p-4 mb-3 rounded">
            <h3 className="font-bold">{d.name}</h3>
            <p>Fee: ₹{d.consultationFee}</p>
            <button
              className="bg-blue-600 text-white px-4 py-1 mt-2 rounded"
              onClick={() => window.location.href=`/patient/book?doctorId=${d._id}`}
            >
              Book
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
