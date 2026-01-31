import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useSearchParams } from 'react-router-dom';
import { Stethoscope, Bot, UserCheck, AlertTriangle, MapPin, Clock, CheckCircle, LogOut } from 'lucide-react';

// --- CONFIGURATION ---
const API_URL = "http://localhost:5000/api";

// --- 1. LOGIN COMPONENT ---
const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.name);
        navigate('/select-hospital');
      } else {
        setError(data.msg || 'Login failed');
      }
    } catch (err) {
      setError('Server error. Is backend running?');
    }
  };

  return (
    <div className="min-h-screen bg-teal-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-teal-100">
        <div className="text-center mb-6">
          <div className="bg-teal-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">S</div>
          <h1 className="text-3xl font-bold text-teal-900">Seva Sync</h1>
          <p className="text-gray-500">Intelligent Hospital Queuing</p>
        </div>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition"
              placeholder="patient@example.com"
              onChange={e => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition"
              placeholder="••••••••"
              onChange={e => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
          <button className="w-full bg-teal-600 text-white py-3 rounded-lg font-bold hover:bg-teal-700 transition shadow-lg shadow-teal-200">
            Sign In
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          Don't have an account? <span className="text-teal-600 font-bold cursor-pointer hover:underline">Register Now</span>
        </div>
      </div>
    </div>
  );
};

// --- 2. HOSPITAL SELECTION ---
const SelectHospital = () => {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    const fetchHospitals = async () => {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/');

      try {
        const res = await fetch(`${API_URL}/hospitals`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        
        // Use backend data if available, else fallback for demo
        if (Array.isArray(data) && data.length > 0) {
          setHospitals(data);
        } else {
          setHospitals([
            { _id: '1', name: 'Hindu Rao Hospital', location: 'Malka Ganj' },
            { _id: '2', name: 'Apollo Hospital', location: 'Jasola Vihar' },
            { _id: '3', name: 'AIIMS Delhi', location: 'Ansari Nagar' },
            { _id: '4', name: 'Fortis Escorts', location: 'Okhla' },
            { _id: '5', name: 'Sir Ganga Ram', location: 'Rajinder Nagar' },
            { _id: '6', name: 'Max Super Speciality', location: 'Saket' },
          ]);
        }
      } catch (err) { console.error(err); }
    };
    fetchHospitals();
  }, [navigate]);

  const handleSelect = (id) => {
    localStorage.setItem('hospitalId', id);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-teal-900 mb-2">Select Your Hospital</h1>
        <p className="text-center text-gray-500 mb-10">Choose a nearby facility to continue</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hospitals.map((h) => (
            <div 
              key={h._id} 
              onClick={() => handleSelect(h._id)} 
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-xl cursor-pointer transition transform hover:-translate-y-1 border-l-4 border-teal-500 group"
            >
              <h2 className="text-xl font-bold text-gray-800 group-hover:text-teal-700 transition">{h.name}</h2>
              <div className="flex items-center text-gray-500 mt-2 text-sm">
                <MapPin size={16} className="mr-1 text-teal-500" /> {h.location}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- 3. PATIENT DASHBOARD (4 SECTIONS) ---
const Dashboard = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Patient';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white p-6 font-sans">
      <header className="flex justify-between items-center mb-8 max-w-5xl mx-auto pb-6 border-b border-gray-100">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">Hello, {userName} 👋</h1>
           <p className="text-gray-500 text-sm">How can we help you today?</p>
        </div>
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-2 text-red-500 font-semibold hover:bg-red-50 px-4 py-2 rounded-lg transition"
        >
          <LogOut size={18} /> Logout
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        
        {/* 1. Direct Department Selection */}
        <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100 hover:shadow-lg transition duration-300">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-blue-100 p-3 rounded-2xl">
              <Stethoscope className="text-blue-600" size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-blue-900">Select Department</h2>
              <p className="text-sm text-blue-600/80">I know my problem</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {['ENT', 'Gynaecology', 'Cardiology', 'Orthopedics'].map(dept => (
              <button 
                key={dept} 
                onClick={() => navigate(`/doctors?dept=${dept}`)}
                className="bg-white py-3 px-4 rounded-xl text-blue-700 text-sm font-bold shadow-sm hover:bg-blue-600 hover:text-white transition"
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* 2. AI Chat */}
        <div className="bg-purple-50 p-8 rounded-3xl border border-purple-100 hover:shadow-lg transition duration-300">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-purple-100 p-3 rounded-2xl">
              <Bot className="text-purple-600" size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-purple-900">AI Symptom Check</h2>
              <p className="text-sm text-purple-600/80">I am confused</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-6">Describe your symptoms and let our AI suggest the right specialist for you.</p>
          <button className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold hover:bg-purple-700 shadow-lg shadow-purple-200 transition">
            Start AI Chat
          </button>
        </div>

        {/* 3. Helper Doctor */}
        <div className="bg-teal-50 p-8 rounded-3xl border border-teal-100 hover:shadow-lg transition duration-300">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-teal-100 p-3 rounded-2xl">
              <UserCheck className="text-teal-600" size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-teal-900">Helper Doctor</h2>
              <p className="text-sm text-teal-600/80">I need guidance</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-6">Connect with a junior doctor for a quick video consultation to guide you.</p>
          <button className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold hover:bg-teal-700 shadow-lg shadow-teal-200 transition">
            Call Helper
          </button>
        </div>

        {/* 4. EMERGENCY */}
        <div className="bg-gradient-to-br from-red-600 to-red-700 p-8 rounded-3xl text-white shadow-xl transform hover:scale-[1.02] transition duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <AlertTriangle size={120} />
          </div>
          <div className="flex items-center gap-4 mb-6 relative z-10">
             <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
               <AlertTriangle className="text-yellow-300" size={32} />
             </div>
             <h2 className="text-2xl font-black tracking-widest">EMERGENCY</h2>
          </div>
          <p className="text-red-100 mb-8 relative z-10 text-sm font-medium">Heart attack? Heavy bleeding? Trauma? Skip all registration.</p>
          <button 
            onClick={() => alert("🚨 ALERT SENT TO HOSPITAL STAFF! PROCEED TO GROUND FLOOR - ROOM 101")}
            className="w-full bg-white text-red-600 py-4 rounded-xl font-black text-lg hover:bg-gray-100 relative z-10 shadow-lg"
          >
            GO TO EMERGENCY WARD
          </button>
        </div>

      </div>
    </div>
  );
};

// --- 4. DOCTOR LIST & BOOKING ---
const DoctorList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dept = searchParams.get('dept');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      const token = localStorage.getItem('token');
      const hospitalId = localStorage.getItem('hospitalId');
      
      try {
        const res = await fetch(`${API_URL}/doctors?hospitalId=${hospitalId}&department=${dept}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (Array.isArray(data) && data.length > 0) {
          setDoctors(data);
        } else {
          // Mock Data if backend is empty
          setDoctors([
            { _id: '101', name: 'Dr. Sharma', fee: 500, time: '10:30 AM', department: dept },
            { _id: '102', name: 'Dr. Verma', fee: 800, time: '12:00 PM', department: dept },
            { _id: '103', name: 'Dr. Singh', fee: 600, time: '02:15 PM', department: dept },
          ]);
        }
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchDoctors();
  }, [dept]);

  const handleBook = async (doc) => {
    const token = localStorage.getItem('token');
    
    // Call API
    try {
      const res = await fetch(`${API_URL}/book`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ doctorId: doc._id })
      });
      const data = await res.json();
      
      // Navigate to success page
      navigate('/success', { 
        state: { 
          doctorName: doc.name, 
          time: data.time || doc.time, 
          id: data.appointmentId || "APPT-DEMO-123" 
        } 
      });
    } catch (err) { alert("Booking Failed"); }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/dashboard')} className="mb-6 text-gray-500 hover:text-teal-600 flex items-center gap-1">← Back to Dashboard</button>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Available <span className="text-teal-600">{dept}</span> Specialists</h1>
        
        {loading ? (
          <div className="text-center py-10">Loading doctors...</div>
        ) : (
          <div className="space-y-4">
            {doctors.map(doc => (
              <div key={doc._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center hover:shadow-md transition">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-2xl font-bold text-gray-800">{doc.name}</h3>
                  <p className="text-gray-500 font-medium mb-3">{doc.department} Specialist</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">₹{doc.fee} Fee</span>
                    <span className="flex items-center text-gray-600 text-sm bg-gray-100 px-3 py-1 rounded-full"><Clock size={14} className="mr-1"/> Next Slot: {doc.time}</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleBook(doc)} 
                  className="bg-teal-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-teal-700 shadow-lg shadow-teal-100 transition transform active:scale-95"
                >
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- 5. APPOINTMENT SUCCESS ---
const AppointmentSuccess = () => {
    const navigate = useNavigate();
    // Using simple mock state for demo purposes if location state is missing
    const state = { doctorName: "Dr. Sharma", time: "10:30 AM", id: "88392" }; 

    return (
        <div className="min-h-screen bg-teal-600 flex items-center justify-center p-4 font-sans">
            <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-400 to-green-400"></div>
                
                <div className="mx-auto bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <CheckCircle className="text-green-600" size={48} />
                </div>
                
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Confirmed!</h1>
                <p className="text-gray-500 mb-8">Your appointment is scheduled.</p>
                
                <div className="bg-gray-50 p-6 rounded-2xl text-left border border-dashed border-gray-300 mb-8">
                    <div className="mb-4">
                        <p className="text-xs text-gray-400 uppercase tracking-wide font-bold">Doctor</p>
                        <p className="font-bold text-xl text-gray-800">{state.doctorName}</p>
                    </div>
                    
                    <div className="flex justify-between">
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide font-bold">Time</p>
                            <p className="font-bold text-gray-800">{state.time}</p>
                        </div>
                        <div className="text-right">
                             <p className="text-xs text-gray-400 uppercase tracking-wide font-bold">Ref ID</p>
                             <p className="font-bold text-gray-800">{state.id}</p>
                        </div>
                    </div>
                </div>

                <button onClick={() => navigate('/dashboard')} className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold hover:bg-teal-700 transition">
                  Go to Dashboard
                </button>
            </div>
        </div>
    )
}

// --- MAIN ROUTER ---
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/select-hospital" element={<SelectHospital />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/doctors" element={<DoctorList />} />
        <Route path="/success" element={<AppointmentSuccess />} />
      </Routes>
    </Router>
  );
}

export default App;