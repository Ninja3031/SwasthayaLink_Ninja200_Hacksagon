import { Building2, Stethoscope, Users, BedDouble } from "lucide-react";
import useAuthStore from "../../store/useAuthStore";

export default function HospitalDashboard() {
  const { user } = useAuthStore();

  const stats = [
    { title: "Total Doctors", value: "45", icon: Stethoscope, color: "text-blue-400", bg: "bg-slate-800" },
    { title: "Total Patients Today", value: "112", icon: Users, color: "text-purple-400", bg: "bg-slate-800" },
    { title: "Occupied Beds", value: "85%", icon: BedDouble, color: "text-rose-400", bg: "bg-slate-800" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-purple-100 text-purple-800 p-4 rounded-lg border border-purple-200">
        <h1 className="text-xl font-bold">hello hospital</h1>
      </div>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Hospital Administration</h1>
       <p className="text-gray-500 mt-1">Logged in as {user?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center">
            <div className={`p-4 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden h-64 flex flex-col justify-center">
          <div className="relative z-10">
            <Building2 className="w-12 h-12 text-purple-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Hospital Registration is Active</h2>
            <p className="text-slate-400 max-w-sm">
              Your hospital directory is visible to all patients searching for treatments. Manage your doctors to accept new bookings.
            </p>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10">
            <Building2 className="w-64 h-64 -mb-16 -mr-16" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-64 overflow-y-auto">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Doctor Activity</h2>
          <div className="space-y-4">
             {[1, 2, 3].map((item) => (
               <div key={item} className="flex items-center p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-slate-100">
                 <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold shrink-0">
                   DR
                 </div>
                 <div className="ml-4">
                   <p className="font-semibold text-sm text-gray-900">Dr. Smith closed a consultation</p>
                   <p className="text-xs text-gray-500">10 mins ago</p>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
