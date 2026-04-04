import { Calendar as CalendarIcon, Clock, Users } from "lucide-react";
import useAuthStore from "../../store/useAuthStore";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function DoctorDashboard() {
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get("/api/v1/appointments/doctor", { withCredentials: true });
        setAppointments(res.data.data || []);
      } catch (error) {
        console.error("Failed fetching dynamic appointments", error);
      }
    };
    fetchAppointments();
  }, []);

  const todayString = new Date().toDateString();
  const todaysAppointments = appointments.filter(a => new Date(a.date).toDateString() === todayString);
  const pendingRequests = appointments.filter(a => a.status === "pending");
  const uniquePatients = new Set(appointments.map(a => typeof a.patient === 'object' ? a.patient?._id : a.patient)).size;

  const stats = [
    { title: "Today's Appointments", value: todaysAppointments.length.toString(), icon: CalendarIcon, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Pending Requests", value: pendingRequests.length.toString(), icon: Clock, color: "text-orange-600", bg: "bg-orange-100" },
    { title: "Total Patients", value: uniquePatients.toString(), icon: Users, color: "text-green-600", bg: "bg-green-100" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome, Dr. {user?.name}</h1>
        <p className="text-gray-500 mt-1">Here is a summary of your schedule for today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
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

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2 text-green-600" />
            Today's Schedule
          </h2>
          <Link to="/doctor/appointments" className="text-sm font-semibold text-green-600 hover:text-green-700">View All</Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-3 px-4 text-sm font-medium text-gray-500">Time</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-500">Patient</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-500">Reason</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-500 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {todaysAppointments.length === 0 ? (
                <tr>
                   <td colSpan="5" className="py-6 text-center text-sm text-gray-500">No appointments scheduled for today.</td>
                </tr>
              ) : (
                todaysAppointments.map((apt, idx) => {
                  let statusBg = "bg-gray-100 text-gray-700";
                  if (apt.status === "pending") statusBg = "bg-orange-100 text-orange-700";
                  if (apt.status === "confirmed") statusBg = "bg-blue-100 text-blue-700";
                  if (apt.status === "completed") statusBg = "bg-green-100 text-green-700";
                  if (apt.status === "cancelled") statusBg = "bg-red-100 text-red-700";

                  return (
                    <tr key={apt._id || idx} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 font-medium text-gray-900">{apt.timeSlot || new Date(apt.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                      <td className="py-4 px-4">{apt.patient?.name || "Unknown Patient"}</td>
                      <td className="py-4 px-4 text-gray-500 truncate max-w-[200px]">{apt.reason || apt.type}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest ${statusBg}`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Link to="/doctor/appointments" className="text-green-600 hover:text-green-800 font-medium text-sm border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-50 transition-colors inline-block">Manage</Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
