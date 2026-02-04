import { useEffect, useState } from "react";
import API from "../api/api";
import Navbar from "../components/Navbar";

export default function Specialities() {
  const [list, setList] = useState([]);

  useEffect(() => {
    API.get("/patients/specialities").then(res => setList(res.data.specialities));
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Select Speciality</h2>
        {list.map(s => (
          <button
            key={s}
            className="block bg-gray-200 p-2 mb-2 rounded"
            onClick={() => window.location.href=`/patient/doctors?dept=${s}`}
          >
            {s}
          </button>
        ))}
      </div>
    </>
  );
}
