import React, { useState, useEffect } from "react";
import { Calendar, User, Clock, Activity, Search } from "lucide-react";
import useAuthStore from "../../store/useAuthStore";
import axios from "axios";

export default function HospitalAppointments() {
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!user || !user.name) return;
    
    const fetchAppointments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get(`/api/v1/hospitals/${encodeURIComponent(user.name)}/appointments`, { withCredentials: true });
        setAppointments(res.data.data);
      } catch (err) {
        setError("Failed to load appointments. Please check your connection.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [user]);

  const filteredAppointments = appointments.filter(apt => 
    (apt.doctor?.name || apt.doctorDetailsSnapshot?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (apt.patient?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading Appointments...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">All Appointments</h2>
          <p className="text-gray-500 text-sm">Monitor all medical consultations across {user?.name}.</p>
        </div>
        
        <div className="relative w-full md:w-64">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
           <input 
             type="text" 
             placeholder="Search doctor or patient..."
             className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm uppercase tracking-wider">Date & Time</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm uppercase tracking-wider">Doctor</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm uppercase tracking-wider">Patient</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {filteredAppointments.length > 0 ? filteredAppointments.map(apt => (
                 <tr key={apt._id} className="hover:bg-gray-50/80 transition-colors group">
                   <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center font-bold">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{new Date(apt.date).toLocaleDateString()}</div>
                          <div className="text-gray-500 text-xs flex items-center">
                            <Clock className="w-3 h-3 mr-1" /> {apt.timeSlot || "N/A"}
                          </div>
                        </div>
                      </div>
                   </td>
                   <td className="py-4 px-6 font-medium text-gray-900">
                      <div className="flex items-center italic">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mr-2">DR</div>
                        Dr. {apt.doctor?.name || apt.doctorDetailsSnapshot?.name || "Unmapped"}
                      </div>
                   </td>
                   <td className="py-4 px-6">
                      <div className="text-gray-900 font-medium">{apt.patient?.name || "Anonymous Patient"}</div>
                      <div className="text-xs text-gray-500 uppercase tracking-tight">{apt.type || "General Consult"}</div>
                   </td>
                   <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${
                        apt.status === 'completed' ? 'bg-green-50 text-green-700 border-green-100' :
                        apt.status === 'pending' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                        apt.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-100' :
                        'bg-blue-50 text-blue-700 border-blue-100'
                      }`}>
                        {apt.status || "Scheduled"}
                      </span>
                   </td>
                   <td className="py-4 px-6">
                      <button className="text-purple-600 hover:text-purple-700 font-bold text-sm tracking-tight hover:underline">
                        Details
                      </button>
                   </td>
                 </tr>
               )) : (
                 <tr>
                    <td colSpan="5" className="py-12 text-center text-gray-500 italic font-medium">No appointments found matching your search.</td>
                 </tr>
               )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
