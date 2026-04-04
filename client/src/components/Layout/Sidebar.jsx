import { Home, Users, Calendar, Bed, Settings, FileText } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const menus = [
    { name: "Dashboard", link: "/", icon: Home },
    { name: "Appointments", link: "/appointments", icon: Calendar },
    { name: "Bed Management", link: "/beds", icon: Bed },
    { name: "Insurance Claims", link: "/claims", icon: FileText },
    { name: "Patients", link: "/patients", icon: Users },
    { name: "Settings", link: "/settings", icon: Settings },
  ];

  return (
    <aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0" aria-label="Sidebar">
      <div className="h-full px-3 pb-4 overflow-y-auto bg-white">
        <ul className="space-y-2 font-medium">
          {menus.map((menu, idx) => (
            <li key={idx}>
              <NavLink 
                to={menu.link}
                className={({isActive}) => `flex items-center p-2 rounded-lg group transition-colors ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-900 hover:bg-gray-100'}`}
              >
                <menu.icon className={`w-5 h-5 transition duration-75 ${window.location.pathname === menu.link ? 'text-blue-700' : 'text-gray-500 group-hover:text-gray-900'}`}/>
                <span className="ms-3">{menu.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
