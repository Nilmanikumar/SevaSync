import { useState } from "react";
import API from "../api/api";

export default function PatientLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const res = await API.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", "patient");
    window.location.href = "/patient/dashboard";
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4">Patient Login</h2>
        <input className="border p-2 w-full mb-2" placeholder="Email" onChange={e=>setEmail(e.target.value)} />
        <input className="border p-2 w-full mb-4" type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} />
        <button onClick={login} className="bg-blue-600 text-white w-full py-2 rounded">
          Login
        </button>
      </div>
    </div>
  );
}
