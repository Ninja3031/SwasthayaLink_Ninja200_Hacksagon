import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Activity, Building2, Users, Calendar, LogOut } from "lucide-react";
import useAuthStore from "../../store/useAuthStore";

export default function HospitalLayout() {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menus = [
    { name: "Hospital Dashboard", link: "/hospital/dashboard", icon: Building2 },
    { name: "Manage Doctors", link: "/hospital/doctors", icon: Users },
    { name: "All Appointments", link: "/hospital/appointments", icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white h-screen sticky top-0 flex flex-col shadow-xl">
        <div className="p-5 flex items-center border-b border-slate-700 bg-slate-950">
          <Activity className="h-8 w-8 text-purple-400 mr-2" />
          <span className="text-xl font-bold">SwasthyaLink</span>
        </div>
        
        <div className="p-4 border-b border-slate-700 bg-slate-800">
          <p className="text-sm font-medium text-slate-400">Administered By,</p>
          <p className="font-semibold truncate">{user?.name || "Admin"}</p>
          <span className="inline-block mt-1 px-2 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs rounded-full uppercase tracking-wide font-bold">Hospital Portal</span>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menus.map((menu, idx) => (
            <NavLink 
              key={idx}
              to={menu.link}
              className={({isActive}) => `flex items-center p-3 rounded-xl transition-all ${isActive ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <menu.icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{menu.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700 bg-slate-950">
          <button onClick={handleLogout} className="flex items-center w-full p-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-colors font-medium">
            <LogOut className="w-5 h-5 mr-3" />
            Logout Session
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
