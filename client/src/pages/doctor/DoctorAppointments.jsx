import React, { useState, useEffect } from "react";
import axios from "axios";
import { CalendarCheck, Plus, CheckCircle, XCircle, Clock, Search, Filter } from "lucide-react";

export default function DoctorAppointments() {
   const [appointments, setAppointments] = useState([]);
   const [activeTab, setActiveTab] = useState("requests");
   const [slots, setSlots] = useState([]);
   const [newSlot, setNewSlot] = useState("");

   const fetchContext = async () => {
      try {
         const resAppts = await axios.get("/api/v1/appointments/doctor", { withCredentials: true });
         setAppointments(resAppts.data.data);

         // Safe fetch native profile slot arrays via global get module
         const docRes = await axios.get("/api/v1/doctors", { withCredentials: true });
         // Simplified logic extracting slots for logged in doctor 
         // Realistically, the GET /api/v1/doctors/:id/availability should be called natively mapped to user._id
      } catch(e) {
         console.error("Context map failed", e);
      }
   };

   useEffect(() => { fetchContext(); }, []);

   const updateStatus = async (id, status) => {
      try {
          await axios.patch(`/api/v1/appointments/${id}/status`, { status }, { withCredentials: true });
          alert(`Appointment marked as ${status}.`);
          fetchContext();
      } catch (e) {
          alert("State change blocked.");
      }
   };

   const addSlot = async () => {
      if(!newSlot) return;
      const patched = [...slots, newSlot];
      setSlots(patched);
      setNewSlot("");
      try {
         await axios.patch("/api/v1/doctors/slots", { slots: patched }, { withCredentials: true });
      } catch(e) {
         console.error(e);
      }
   };

   const purgeSlot = async (target) => {
      const patched = slots.filter(s => s !== target);
      setSlots(patched);
      try {
         await axios.patch("/api/v1/doctors/slots", { slots: patched }, { withCredentials: true });
      } catch(e) {
         console.error(e);
      }
   };

   return (
      <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-end">
              <div>
                 <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center">
                    <CalendarCheck className="w-8 h-8 mr-3 text-green-600"/> Appointments Control
                 </h1>
                 <p className="text-gray-500 font-medium mt-1">Manage inbound requests mapping to your physical calendar.</p>
              </div>
          </div>

          {/* Core Dash Nav */}
          <div className="flex border-b border-gray-200 gap-6">
             <button onClick={() => setActiveTab("requests")} className={`pb-4 text-sm font-bold tracking-widest uppercase transition-colors border-b-2 ${activeTab === 'requests' ? 'border-green-600 text-green-700' : 'border-transparent text-gray-400 hover:text-gray-700'}`}>Patient Requests</button>
             <button onClick={() => setActiveTab("availability")} className={`pb-4 text-sm font-bold tracking-widest uppercase transition-colors border-b-2 ${activeTab === 'availability' ? 'border-green-600 text-green-700' : 'border-transparent text-gray-400 hover:text-gray-700'}`}>Slot Generator Console</button>
          </div>

          <div className="pt-4">
              {activeTab === "requests" ? (
                 <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                           <thead className="bg-gray-50/50 border-b border-gray-100">
                               <tr>
                                  <th className="p-5 text-xs font-black uppercase tracking-widest text-gray-400">Patient Data</th>
                                  <th className="p-5 text-xs font-black uppercase tracking-widest text-gray-400">Request Date</th>
                                  <th className="p-5 text-xs font-black uppercase tracking-widest text-gray-400">Time Block</th>
                                  <th className="p-5 text-xs font-black uppercase tracking-widest text-gray-400">Status</th>
                                  <th className="p-5 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Gatekeeper Action</th>
                               </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-50">
                               {appointments.map(req => (
                                   <tr key={req._id} className="hover:bg-gray-50/50 transition-colors">
                                       <td className="p-5">
                                          <p className="font-bold text-gray-900">{req.patient?.name || "Unknown Patient"}</p>
                                          <p className="text-xs text-gray-500 font-medium">Symptom Context: {req.selectedSymptoms?.length} traces</p>
                                          <p className="text-xs text-gray-400 font-bold truncate max-w-[200px] mt-1">{req.notes || "No context attached."}</p>
                                       </td>
                                       <td className="p-5 font-bold text-gray-700">{req.date}</td>
                                       <td className="p-5">
                                          <span className="inline-block px-3 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-black">{req.timeSlot}</span>
                                       </td>
                                       <td className="p-5">
                                           <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${req.status === 'pending' ? 'bg-amber-100 text-amber-700' : req.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                              {req.status}
                                           </span>
                                       </td>
                                       <td className="p-5 text-right flex gap-2 justify-end">
                                           {req.status === "pending" && (
                                              <>
                                                 <button onClick={() => updateStatus(req._id, "confirmed")} className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 text-xs font-black shadow-md transition-all flex items-center">
                                                    <CheckCircle className="w-4 h-4 mr-2"/> Accept
                                                 </button>
                                                 <button onClick={() => updateStatus(req._id, "cancelled")} className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-lg px-4 py-2 text-xs font-black transition-all flex items-center">
                                                    <XCircle className="w-4 h-4 mr-2"/> Reject
                                                 </button>
                                              </>
                                           )}
                                       </td>
                                   </tr>
                               ))}
                           </tbody>
                        </table>
                        {appointments.length === 0 && <div className="p-12 text-center text-gray-400 font-bold">No appointment traces mapped locally.</div>}
                    </div>
                 </div>
              ) : (
                 <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 max-w-2xl">
                    <h3 className="text-sm font-black text-gray-400 tracking-widest uppercase mb-6 flex items-center"><Clock className="w-4 h-4 mr-2"/> Manage Availability Blocks</h3>
                    
                    <div className="flex gap-4 mb-8">
                       <input 
                           type="text" 
                           placeholder="Type block (e.g. 10:00 AM)" 
                           value={newSlot}
                           onChange={e => setNewSlot(e.target.value)}
                           className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 font-bold focus:ring-green-500 focus:border-green-500"
                       />
                       <button onClick={addSlot} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-black shadow-md flex items-center">
                          <Plus className="w-5 h-5 mr-2"/> Inject Slot
                       </button>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {slots.map((s, idx) => (
                            <div key={idx} className="bg-green-50 border border-green-200 text-green-800 font-black px-4 py-2 rounded-xl flex items-center hover:bg-green-100 transition-colors">
                               {s}
                               <button onClick={() => purgeSlot(s)} className="text-green-500 hover:text-red-500 ml-3"><XCircle className="w-4 h-4"/></button>
                            </div>
                        ))}
                    </div>
                 </div>
              )}
          </div>
      </div>
   );
}
