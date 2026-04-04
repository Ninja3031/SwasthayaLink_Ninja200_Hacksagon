import React, { useState, useEffect } from "react";
import axios from "axios";
import { Users, FileText, FlaskConical, MessageSquare, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DoctorPatients() {
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
     const fetchMyPatients = async () => {
         try {
            const res = await axios.get("/api/v1/doctors/patients", { withCredentials: true });
            setPatients(res.data.data);
         } catch(e) {
            console.error("Mapping patient arrays securely failed.", e);
         }
     };
     fetchMyPatients();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      <div className="flex justify-between items-end border-b border-gray-100 pb-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center"><Users className="w-8 h-8 mr-3 text-emerald-600"/> My Dedicated Roster</h1>
            <p className="text-gray-500 font-medium mt-2">Historic array aggregating patients validated explicitly through natively cleared appointments.</p>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map(p => (
             <div key={p._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group flex flex-col items-start relative">
                 <button onClick={() => navigate(`/doctor/chat?userId=${p._id}`)} className="absolute top-6 right-6 text-emerald-100 group-hover:text-emerald-600 transition-colors">
                     <MessageSquare className="w-5 h-5"/>
                 </button>
                 
                 <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center font-black text-2xl text-emerald-600 mb-4">{p.name?.charAt(0)}</div>
                 <h2 className="text-xl font-black text-gray-900">{p.name}</h2>
                 <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest">{p.phone || "No Phone Registered"}</p>

                 <div className="mt-6 flex flex-wrap gap-2 w-full pt-4 border-t border-gray-50">
                    <button onClick={() => navigate(`/doctor/lab-results?userId=${p._id}`)} className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold py-2 rounded-xl text-xs flex items-center justify-center border border-gray-200 transition-colors">
                       <FlaskConical className="w-4 h-4 mr-2"/> Parse Records
                    </button>
                    <button className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold py-2 rounded-xl text-xs flex items-center justify-center border border-emerald-200 transition-colors">
                       <FileText className="w-4 h-4 mr-2"/> Full Profile
                    </button>
                 </div>
             </div>
          ))}

          {patients.length === 0 && (
              <div className="col-span-full py-20 text-center flex flex-col items-center justify-center bg-white border border-gray-100 rounded-3xl shadow-sm">
                 <Users className="w-16 h-16 text-gray-300 mb-4" />
                 <h3 className="text-xl font-black text-gray-800">Clear Roster Bounds</h3>
                 <p className="text-gray-400 font-medium max-w-md mx-auto mt-2">You explicitly lack natively mapped patients. Try clearing pending appointment requests.</p>
              </div>
          )}
      </div>

    </div>
  );
}
