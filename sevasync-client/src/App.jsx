import { BrowserRouter, Routes, Route } from "react-router-dom";
import PatientLogin from "./auth/PatientLogin";
import PatientSignup from "./auth/PatientSignup";
import Dashboard from "./patient/Dashboard";
import Specialities from "./patient/Specialities";
import Doctors from "./patient/Doctors";
import Book from "./patient/Book";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PatientLogin />} />
        <Route path="/signup" element={<PatientSignup />} />

        <Route path="/patient/dashboard" element={
          <ProtectedRoute role="patient"><Dashboard /></ProtectedRoute>
        } />

        <Route path="/patient/specialities" element={
          <ProtectedRoute role="patient"><Specialities /></ProtectedRoute>
        } />

        <Route path="/patient/doctors" element={
          <ProtectedRoute role="patient"><Doctors /></ProtectedRoute>
        } />

        <Route path="/patient/book" element={
          <ProtectedRoute role="patient"><Book /></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}
