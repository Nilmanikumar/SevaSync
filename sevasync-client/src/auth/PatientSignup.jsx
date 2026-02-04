import { useState } from "react";
import API from "../api/api";

export default function PatientSignup() {
  const [form, setForm] = useState({});

  const signup = async () => {
    await API.post("/auth/register", form);
    alert("Signup successful");
    window.location.href = "/";
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-xl font-bold mb-4">Patient Signup</h2>
        <input className="border p-2 w-full mb-2" placeholder="Name" onChange={e=>setForm({...form,name:e.target.value})} />
        <input className="border p-2 w-full mb-2" placeholder="Email" onChange={e=>setForm({...form,email:e.target.value})} />
        <input className="border p-2 w-full mb-4" type="password" placeholder="Password" onChange={e=>setForm({...form,password:e.target.value})} />
        <button onClick={signup} className="bg-green-600 text-white w-full py-2 rounded">
          Signup
        </button>
      </div>
    </div>
  );
}
