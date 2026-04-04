import { Users, Calendar, Activity, BedDouble } from "lucide-react";

export default function Dashboard() {
  const stats = [
    { title: "Total Patients", value: "1,245", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Appointments Today", value: "48", icon: Calendar, color: "text-green-600", bg: "bg-green-100" },
    { title: "Available Beds", value: "12", icon: BedDouble, color: "text-purple-600", bg: "bg-purple-100" },
    { title: "Active Claims", value: "156", icon: Activity, color: "text-orange-600", bg: "bg-orange-100" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Hospital Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center shadow-md hover:shadow-lg transition-shadow">
            <div className={`p-3 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <h3 className="text-xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Recent Appointments</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                <div>
                  <p className="font-medium text-gray-800">Patient Name #{item}</p>
                  <p className="text-sm text-gray-500">Dr. Smith • General Checkup</p>
                </div>
                <span className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                  10:30 AM
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Bed Utilization Fast Stats</h2>
          <div className="space-y-4">
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div className="bg-blue-600 h-4 rounded-full" style={{ width: '85%' }}></div>
            </div>
            <p className="text-sm text-gray-600">85% Capacity (ICU Full)</p>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
               <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                 <p className="text-red-600 font-bold">0 ICU Beds</p>
               </div>
               <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                 <p className="text-green-600 font-bold">12 General Beds</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
