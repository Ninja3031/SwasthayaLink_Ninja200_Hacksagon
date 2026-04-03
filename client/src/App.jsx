import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import useAuthStore from "./store/useAuthStore";
import PatientLayout from "./components/Layout/PatientLayout";
import DoctorLayout from "./components/Layout/DoctorLayout";
import HospitalLayout from "./components/Layout/HospitalLayout";
import PatientDashboard from "./pages/patient/PatientDashboard";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import HospitalDashboard from "./pages/hospital/HospitalDashboard";
import HealthRecords from "./pages/patient/HealthRecords";
import Appointments from "./pages/patient/Appointments";
import Medications from "./pages/patient/Medications";
import Reminders from "./pages/patient/Reminders";
import SymptomTracker from "./pages/patient/SymptomTracker";
import LabResults from "./pages/patient/LabResults";
import EmergencySOS from "./pages/patient/EmergencySOS";
import Chat from "./pages/patient/Chat";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to={`/${user.role}/dashboard`} replace />;

  return children;
};

function App() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          isAuthenticated ? <Navigate to={`/${user.role}/dashboard`} replace /> : <Navigate to="/login" replace />
        } />
        <Route path="/login" element={<Auth />} />

        {/* Patient Routes */}
        <Route path="/patient" element={<ProtectedRoute allowedRoles={["patient"]}><PatientLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<PatientDashboard />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="medications" element={<Medications />} />
          <Route path="reminders" element={<Reminders />} />
          <Route path="records" element={<HealthRecords />} />
          <Route path="symptoms" element={<SymptomTracker />} />
          <Route path="lab-results" element={<LabResults />} />
          <Route path="chat" element={<Chat />} />
          <Route path="sos" element={<EmergencySOS />} />
        </Route>

        {/* Doctor Routes */}
        <Route path="/doctor" element={<ProtectedRoute allowedRoles={["doctor"]}><DoctorLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="appointments" element={<div className="p-8 text-center text-gray-500 font-semibold bg-white rounded-xl shadow-sm border border-gray-100">Doctor Appointments Placeholder...</div>} />
          <Route path="availability" element={<div className="p-8 text-center text-gray-500 font-semibold bg-white rounded-xl shadow-sm border border-gray-100">Doctor Availability Placeholder...</div>} />
        </Route>

        {/* Hospital Routes */}
        <Route path="/hospital" element={<ProtectedRoute allowedRoles={["hospital"]}><HospitalLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<HospitalDashboard />} />
          <Route path="doctors" element={<div className="p-8 text-center text-gray-500 font-semibold bg-white rounded-xl shadow-sm border border-gray-100">Manage Doctors Placeholder...</div>} />
          <Route path="appointments" element={<div className="p-8 text-center text-gray-500 font-semibold bg-white rounded-xl shadow-sm border border-gray-100">Manage Appointments Placeholder...</div>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
