import React, { useState, useEffect } from "react";
import { Building2, Stethoscope, Users, BedDouble, Calendar, Activity, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import axios from "axios";

const MOCK_BEDS = {
  private: { total: 50, occupied: 32, available: 18 },
  doubleSharing: { total: 80, occupied: 55, available: 25 },
  tripleSharing: { total: 120, occupied: 90, available: 30 }
};

export default function HospitalDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    doctors: 0,
    appointments: 0,
    activeSos: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const docRes = await axios.get(`/api/v1/hospitals/${encodeURIComponent(user.name)}/doctors`, { withCredentials: true });
        const aptRes = await axios.get(`/api/v1/hospitals/${encodeURIComponent(user.name)}/appointments`, { withCredentials: true });
        setStats({
          doctors: docRes.data.data.length,
          appointments: aptRes.data.data.length,
          activeSos: 0 // Mock for now
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    };
    if (user?.name) fetchStats();
  }, [user]);

  const cards = [
    { title: "Allocated Doctors", value: stats.doctors, icon: Stethoscope, color: "text-blue-500", bg: "bg-blue-50", link: "/hospital/doctors" },
    { title: "Active Appointments", value: stats.appointments, icon: Calendar, color: "text-purple-500", bg: "bg-purple-50", link: "/hospital/appointments" },
    { title: "Emergency Alerts", value: stats.activeSos, icon: Activity, color: "text-red-500", bg: "bg-red-50", link: "/hospital/sos" },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header section */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name}</h1>
          <p className="text-slate-400 text-lg max-w-xl">
            You are managing the {user?.name} healthcare facility. Access medical personnel, patient queues, and emergency responses from your command center.
          </p>
        </div>
        <Building2 className="absolute right-[-20px] bottom-[-20px] h-64 w-64 text-slate-800 opacity-50 rotate-12" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <Link to={card.link} key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
            <div className="flex items-center justify-between">
              <div className={`p-4 rounded-2xl ${card.bg}`}>
                <card.icon className={`h-8 w-8 ${card.color}`} />
              </div>
              <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-gray-500 transform group-hover:translate-x-1 transition-all" />
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{card.title}</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{card.value}</h3>
            </div>
          </Link>
        ))}
      </div>

      {/* Bed availability section */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center mb-6">
           <BedDouble className="h-6 w-6 text-purple-600 mr-2" />
           <h2 className="text-2xl font-bold text-gray-900">Bed Availability (Live Summary)</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(MOCK_BEDS).map(([key, data]) => (
            <div key={key} className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
               <h3 className="text-lg font-bold text-gray-800 capitalize mb-4">{key.replace(/([A-Z])/g, ' $1')}</h3>
               <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm font-medium">
                     <span className="text-gray-500">Total Capacity</span>
                     <span className="text-gray-900 font-bold">{data.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                     <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-1000" 
                        style={{ width: `${(data.occupied/data.total)*100}%` }}
                     ></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                     <div>
                        <span className="text-[10px] uppercase font-bold text-red-500 tracking-widest block mb-1">Occupied</span>
                        <span className="text-xl font-bold text-gray-900">{data.occupied}</span>
                     </div>
                     <div>
                        <span className="text-[10px] uppercase font-bold text-green-500 tracking-widest block mb-1">Available</span>
                        <span className="text-xl font-bold text-gray-900">{data.available}</span>
                     </div>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
