import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Activity, Home, CalendarCheck, Pill, Bell, Stethoscope, TestTube, AlertOctagon, MessageCircle, LogOut } from "lucide-react";
import useAuthStore from "../../store/useAuthStore";

export default function PatientLayout() {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menus = [
    { name: "Dashboard", link: "/patient/dashboard", icon: Home },
    { name: "Appointments", link: "/patient/appointments", icon: CalendarCheck },
    { name: "Medications", link: "/patient/medications", icon: Pill },
    { name: "Reminders", link: "/patient/reminders", icon: Bell },
    { name: "Health Records", link: "/patient/records", icon: Activity },
    { name: "Symptom Tracker", link: "/patient/symptoms", icon: Stethoscope },
    { name: "Lab Results", link: "/patient/lab-results", icon: TestTube },
    { name: "Messaging", link: "/patient/chat", icon: MessageCircle },
    { name: "Emergency SOS", link: "/patient/sos", icon: AlertOctagon },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col shadow-sm">
        <div className="p-5 flex items-center border-b border-gray-100">
          <Activity className="h-8 w-8 text-blue-600 mr-2" />
          <span className="text-xl font-bold text-gray-800">SwasthyaLink</span>
        </div>
        
        <div className="p-4 border-b border-gray-100 bg-blue-50/50">
          <p className="text-sm font-medium text-gray-500">Welcome,</p>
          <p className="font-semibold text-gray-900 truncate">{user?.name || "Patient"}</p>
          <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full uppercase tracking-wide font-bold">Patient Portal</span>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menus.map((menu, idx) => (
            <NavLink 
              key={idx}
              to={menu.link}
              className={({isActive}) => `flex items-center p-3 rounded-xl transition-all ${isActive ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'}`}
            >
              <menu.icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{menu.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="flex items-center w-full p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium">
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
