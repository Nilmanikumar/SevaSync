import { useState } from "react";
import API from "../api/api";
import Navbar from "../components/Navbar";

export default function Book() {
  const doctorId = new URLSearchParams(window.location.search).get("doctorId");
  const [form, setForm] = useState({ doctorId });

  const book = async () => {
    await API.post("/patients/book", form);
    alert("Appointment booked");
    window.location.href="/patient/dashboard";
  };

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Book Appointment</h2>
        <input className="border p-2 w-full mb-2" placeholder="Name" onChange={e=>setForm({...form,patientName:e.target.value})} />
        <input className="border p-2 w-full mb-2" placeholder="Phone" onChange={e=>setForm({...form,phone:e.target.value})} />
        <input className="border p-2 w-full mb-2" placeholder="Symptoms" onChange={e=>setForm({...form,symptoms:e.target.value})} />
        <input className="border p-2 w-full mb-2" placeholder="Date (dd-mm-yyyy)" onChange={e=>setForm({...form,appointmentDate:e.target.value})} />
        <input className="border p-2 w-full mb-4" placeholder="Time" onChange={e=>setForm({...form,appointmentTime:e.target.value})} />
        <button onClick={book} className="bg-green-600 text-white px-4 py-2 rounded">
          Confirm
        </button>
      </div>
    </>
  );
}
