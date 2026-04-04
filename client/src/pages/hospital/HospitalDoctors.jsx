import React, { useState, useEffect } from "react";
import { Mail, Phone, Activity, User } from "lucide-react";
import useAuthStore from "../../store/useAuthStore";
import axios from "axios";

export default function HospitalDoctors() {
  const { user } = useAuthStore();
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !user.name) return;
    
    const fetchDoctors = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get(`/api/v1/hospitals/${encodeURIComponent(user.name)}/doctors`, { withCredentials: true });
        setDoctors(res.data.data);
      } catch (err) {
        setError("Failed to load doctors. Please check your connection.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, [user]);

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading Doctors...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (doctors.length === 0) return (
    <div className="p-12 text-center bg-white rounded-2xl shadow-sm border border-gray-100">
      <User className="mx-auto h-12 w-12 text-gray-300 mb-4" />
      <h3 className="text-lg font-medium text-gray-900">No Doctors Found</h3>
      <p className="text-gray-500">No doctors are currently associated with {user?.name}.</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Manage Doctors</h2>
        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
          {doctors.length} Registered
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map(doc => (
          <div key={doc._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4">
              <span className={`h-3 w-3 rounded-full inline-block ${doc.availabilityStatus ? 'bg-green-500' : 'bg-gray-300'}`}></span>
            </div>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg transform group-hover:scale-105 transition-transform">
                {doc.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-xl">Dr. {doc.name}</h3>
                <p className="text-purple-600 font-medium">{doc.speciality || "General Physician"}</p>
              </div>
            </div>
            
            <div className="space-y-3 text-gray-600 border-t border-gray-50 pt-4">
              <div className="flex items-center text-sm">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center mr-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                </div>
                <span className="truncate">{doc.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center mr-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                </div>
                <span>{doc.phone}</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center mr-3">
                  <Activity className="w-4 h-4 text-gray-400" />
                </div>
                <span className="font-medium text-gray-900">{doc.experience} Years Experience</span>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-xl text-sm font-medium transition-colors border border-gray-100">
                View Schedule
              </button>
              <button className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-700 py-2 rounded-xl text-sm font-medium transition-colors border border-purple-100">
                Contact
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
