import React, { useState, useEffect } from "react";
import axios from "axios";
import { FileText, Plus, XCircle, UserCheck, Stethoscope, Save } from "lucide-react";

export default function DoctorPrescriptions() {
   const [appointments, setAppointments] = useState([]);
   const [selectedAppointment, setSelectedAppointment] = useState("");
   const [medicines, setMedicines] = useState([
      { name: "", dosage: "", frequency: "", duration: "", notes: "" }
   ]);
   const [submitting, setSubmitting] = useState(false);

   useEffect(() => {
      fetchContext();
   }, []);

   const fetchContext = async () => {
      try {
         const resAppts = await axios.get("/api/v1/appointments/doctor", { withCredentials: true });
         // Filter strictly valid active arrays
         const valid = resAppts.data.data.filter(a => ['confirmed', 'completed'].includes(a.status));
         setAppointments(valid);
      } catch(e) {
         console.error("Context map failed", e);
      }
   };

   const addMedicineRow = () => {
      setMedicines([...medicines, { name: "", dosage: "", frequency: "", duration: "", notes: "" }]);
   };

   const removeMedicineRow = (index) => {
      setMedicines(medicines.filter((_, i) => i !== index));
   };

   const handleMedChange = (index, field, value) => {
      const updated = [...medicines];
      updated[index][field] = value;
      setMedicines(updated);
   };

   const submitPrescription = async (e) => {
      e.preventDefault();
      if (!selectedAppointment) return alert("Select an explicit patient appointment block first.");
      if (medicines.some(m => !m.name || !m.dosage || !m.frequency || !m.duration)) {
         return alert("Complete strictly all required medicine structure parameters natively.");
      }

      setSubmitting(true);
      try {
         await axios.post("/api/v1/prescriptions", {
            appointmentId: selectedAppointment,
            medicines
         }, { withCredentials: true });
         
         alert("Prescription explicitly transmitted perfectly to patient inbox.");
         setSelectedAppointment("");
         setMedicines([{ name: "", dosage: "", frequency: "", duration: "", notes: "" }]);
      } catch (err) {
         alert(err.response?.data?.message || "Execution limits threw exceptions block.");
      }
      setSubmitting(false);
   };

   return (
      <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-end">
              <div>
                 <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center">
                    <FileText className="w-8 h-8 mr-3 text-green-600"/> Prescription Dispatch Interface
                 </h1>
                 <p className="text-gray-500 font-medium mt-1">Generate exact structures securely mapping valid appointment contexts.</p>
              </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <form onSubmit={submitPrescription} className="space-y-8">
                  
                  {/* Select Bound Area */}
                  <div className="p-5 bg-green-50 rounded-2xl border border-green-200">
                     <label className="text-sm font-black text-green-800 tracking-widest uppercase flex items-center mb-3">
                         <UserCheck className="w-5 h-5 mr-2"/> Link Target Profile (Appointment Mapping)
                     </label>
                     <select 
                        required 
                        value={selectedAppointment} 
                        onChange={e => setSelectedAppointment(e.target.value)}
                        className="w-full bg-white border border-green-300 text-gray-900 rounded-xl px-4 py-3 font-semibold focus:ring-green-500 focus:border-green-500 outline-none transition-all shadow-sm"
                     >
                        <option value="" disabled>-- Select Explicit Authorised Appointment Node --</option>
                        {appointments.map(req => (
                           <option key={req._id} value={req._id}>
                              {req.date} | {req.patient?.name || "Unknown"} | {req.timeSlot} 
                           </option>
                        ))}
                     </select>
                     {appointments.length === 0 && <p className="text-xs text-red-600 font-bold mt-2">No cleared validated appointments securely mapped found natively.</p>}
                  </div>

                  {/* Medicines Layout Bounds */}
                  <div className="space-y-4">
                     <div className="flex justify-between items-end border-b border-gray-100 pb-3">
                         <h3 className="text-lg font-black text-gray-800 flex items-center">
                            <Stethoscope className="w-5 h-5 mr-2 text-green-600" /> Prescribed Constructs Array
                         </h3>
                         <button type="button" onClick={addMedicineRow} className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-xl font-black text-sm flex items-center transition-colors">
                            <Plus className="w-4 h-4 mr-1"/> Push Medicine Block
                         </button>
                     </div>

                     {medicines.map((med, index) => (
                         <div key={index} className="bg-gray-50 rounded-2xl border border-gray-200 p-5 relative transition-all">
                             {medicines.length > 1 && (
                                <button type="button" onClick={() => removeMedicineRow(index)} className="absolute -top-3 -right-3 bg-red-100 hover:bg-red-200 border-2 border-white text-red-600 rounded-full p-1 shadow-sm transition-transform active:scale-95">
                                   <XCircle className="w-5 h-5" />
                                </button>
                             )}
                             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="md:col-span-1">
                                   <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Medicine String</label>
                                   <input required type="text" placeholder="e.g. Paracetamol" value={med.name} onChange={e => handleMedChange(index, "name", e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 font-semibold text-sm outline-none focus:ring-2 focus:ring-green-400" />
                                </div>
                                <div>
                                   <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Dosage Volume</label>
                                   <input required type="text" placeholder="e.g. 500mg" value={med.dosage} onChange={e => handleMedChange(index, "dosage", e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 font-semibold text-sm outline-none focus:ring-2 focus:ring-green-400" />
                                </div>
                                <div>
                                   <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Frequency Loop</label>
                                   <input required type="text" placeholder="e.g. Three times / day" value={med.frequency} onChange={e => handleMedChange(index, "frequency", e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 font-semibold text-sm outline-none focus:ring-2 focus:ring-green-400" />
                                </div>
                                <div>
                                   <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Duration</label>
                                   <input required type="text" placeholder="e.g. 7 days" value={med.duration} onChange={e => handleMedChange(index, "duration", e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 font-semibold text-sm outline-none focus:ring-2 focus:ring-green-400" />
                                </div>
                                <div className="md:col-span-4 mt-2">
                                   <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Doctor's Memo Bounds (Optional)</label>
                                   <input type="text" placeholder="e.g. Take implicitly after consuming food." value={med.notes} onChange={e => handleMedChange(index, "notes", e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 font-semibold text-sm outline-none focus:ring-2 focus:ring-green-400" />
                                </div>
                             </div>
                         </div>
                     ))}
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                      <button disabled={submitting} type="submit" className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-8 py-3.5 rounded-xl font-black flex items-center shadow-md transition-all">
                         <Save className="w-5 h-5 mr-2"/> {submitting ? "Signing Native Constraints..." : "Dispatch Secure Protocol"}
                      </button>
                  </div>
              </form>
          </div>
      </div>
   );
}
