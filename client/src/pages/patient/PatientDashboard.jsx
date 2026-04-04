import { Activity, Calendar as CalendarIcon, FileText, Search } from "lucide-react";
import useAuthStore from "../../store/useAuthStore";
import { Link } from "react-router-dom";

export default function PatientDashboard() {
  const { user } = useAuthStore();

  const actions = [
    { title: "Find a Hospital", link: "/patient/search", icon: Search, color: "bg-blue-100 text-blue-600" },
    { title: "Book Appointment", link: "/patient/book", icon: CalendarIcon, color: "bg-green-100 text-green-600" },
    { title: "View Records", link: "#", icon: FileText, color: "bg-purple-100 text-purple-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Hello, {user?.name}</h1>
        <p className="text-gray-500 mt-1">Here is a quick overview of your health profile.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {actions.map((action, idx) => (
          <Link key={idx} to={action.link} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-300 transition-all flex items-center transform hover:-translate-y-1">
            <div className={`p-4 rounded-xl ${action.color}`}>
              <action.icon className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-gray-900 text-lg">{action.title}</h3>
              <p className="text-gray-500 text-sm">Click to proceed</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-600" />
            Upcoming Appointments
          </h2>
          <div className="space-y-4">
               <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex justify-between items-center">
                 <div>
                   <p className="font-semibold text-gray-900">Dr. Sarah Jenkins</p>
                   <p className="text-sm text-gray-500">General Checkup - City Care Hospital</p>
                 </div>
                 <div className="text-right">
                   <p className="text-blue-600 font-bold bg-blue-100 px-3 py-1 rounded-full text-sm inline-block">Tomorrow, 10:00 AM</p>
                 </div>
               </div>
               <div className="p-4 text-center text-gray-500 text-sm">No other upcoming appointments!</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 shadow-md text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-2">Insurance Status</h2>
            <p className="opacity-80 mb-6">You currently have no active insurance policy linked.</p>
            <button className="bg-white text-blue-700 hover:bg-gray-50 px-5 py-2.5 rounded-lg font-semibold transition-colors duration-200">
              Link Insurance
            </button>
          </div>
          {/* Abstract circles for decoration */}
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-10"></div>
          <div className="absolute bottom-0 right-12 -mb-8 w-24 h-24 rounded-full bg-white opacity-10"></div>
        </div>
      </div>
    </div>
  );
}
