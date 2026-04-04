import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Calendar, Clock, X, CheckCircle, Filter, AlertCircle } from "lucide-react";
import useAuthStore from "../../store/useAuthStore";

export default function Appointments() {
  const [activeTab, setActiveTab] = useState("browse"); // 'browse' or 'mine'
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [myAppointments, setMyAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("All");

  // Booking Modal State (Single Form Layout)
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Toast notifications
  const [toast, setToast] = useState({ visible: false, type: "", message: "" });
  
  // Form Payloads
  const [formData, setFormData] = useState({
      doctorId: "",
      date: "",
      time: "",
      type: "Consultation",
      hospital: "",
      specialty: "",
      includeSymptoms: false,
      notes: ""
  });

  const { user } = useAuthStore();

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "browse") {
        const [docRes, hospRes] = await Promise.all([
           axios.get("/api/v1/doctors", { withCredentials: true }),
           axios.get("/api/v1/hospitals", { withCredentials: true })
        ]);
        setDoctors(docRes.data.data);
        setHospitals(hospRes.data.data);
      } else {
        const res = await axios.get("/api/v1/appointments/user", { withCredentials: true });
        setMyAppointments(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const showToast = (type, message) => {
      setToast({ visible: true, type, message });
      setTimeout(() => setToast({ visible: false, type: "", message: "" }), 4000);
  };

  const handleBookInitiate = (doc = null) => {
    setFormData({
        doctorId: doc ? doc._id : "",
        date: "",
        time: "",
        type: "Consultation",
        hospital: doc ? doc.hospitalName : "",
        specialty: doc ? doc.speciality : "",
        includeSymptoms: false,
        notes: ""
    });
    setShowModal(true);
  };

  // Helper hook to dynamically fill hospital and specialty when a doctor is selected via dropdown
  const handleDoctorChange = (e) => {
      const selectedId = e.target.value;
      const targetDoc = doctors.find(d => d._id === selectedId);
      if(targetDoc) {
          setFormData({
              ...formData,
              doctorId: targetDoc._id,
              hospital: targetDoc.hospitalName || "",
              specialty: targetDoc.speciality
          });
      } else {
          setFormData({ ...formData, doctorId: "", hospital: "", specialty: "" });
      }
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
       // Posts exactly the mapped bounds requested in the integration map
      await axios.post("/api/v1/appointments", formData, { withCredentials: true });
      setShowModal(false);
      showToast("success", "Appointment Successfully Booked!");
      if(activeTab === "mine") fetchData();
    } catch (err) {
      showToast("error", err.response?.data?.message || "Failed to book appointment. Please verify fields.");
    }
    setIsSubmitting(false);
  };

  const cancelAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await axios.patch(`/api/v1/appointments/${id}/status`, { status: "cancelled" }, { withCredentials: true });
      fetchData();
      showToast("success", "Appointment cancelled successfully.");
    } catch (err) {
      showToast("error", "Error mapping cancellation.");
    }
  };

  const filteredDoctors = doctors.filter(d => {
    const matchesName = d.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpec = specializationFilter === "All" || d.speciality === specializationFilter;
    return matchesName && matchesSpec;
  });

  const uniqueSpecializations = ["All", ...new Set(doctors.map(d => d.speciality))];
  
  // Validation checker for submit button enablement
  const isFormValid = formData.doctorId && formData.date && formData.time && formData.type;
  
  // Dynamic slot generation for currently selected doctor
  const currentDoctorSlots = doctors.find(d => d._id === formData.doctorId)?.availableSlots || [];

  return (
    <div className="space-y-6 relative">
      
      {/* Absolute Header Toast Notification */}
      {toast.visible && (
          <div className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-[100] flex items-center px-6 py-3 rounded-xl shadow-lg border text-sm font-bold tracking-wide transition-all ${toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
             {toast.type === 'success' ? <CheckCircle className="w-5 h-5 mr-3" /> : <AlertCircle className="w-5 h-5 mr-3" />}
             {toast.message}
          </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl border-l-4 border-blue-600 pl-3 font-bold text-gray-900 tracking-tight">Appointments Hub</h1>
          <p className="text-gray-500 mt-1">Book, manage, and track your healthcare consultations securely.</p>
        </div>
        <div className="bg-gray-100/80 backdrop-blur-sm p-1.5 rounded-xl flex space-x-1 border border-gray-200">
          <button onClick={() => setActiveTab("browse")} className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'browse' ? 'bg-white shadow-sm text-blue-700' : 'text-gray-500 hover:text-gray-800'}`}>Browse Doctors</button>
          <button onClick={() => setActiveTab("mine")} className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'mine' ? 'bg-white shadow-sm text-blue-700' : 'text-gray-500 hover:text-gray-800'}`}>My Appointments</button>
        </div>
      </div>
      
      {/* Global Booking Button mapping generic form logic */}
      {activeTab === "browse" && (
        <div className="flex justify-end">
            <button onClick={() => handleBookInitiate()} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20 px-6 py-3 rounded-xl font-bold flex items-center transition-all">
                <Calendar className="w-5 h-5 mr-2" /> Quick Book Appointment
            </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20 text-gray-400">Loading directory maps...</div>
      ) : activeTab === "browse" ? (
        <>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
              <input type="text" placeholder="Search by doctor name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-gray-800 placeholder-gray-400" />
            </div>
            <div className="relative w-full md:w-64">
              <Filter className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
              <select value={specializationFilter} onChange={e => setSpecializationFilter(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 appearance-none font-medium text-gray-800 transition-all">
                {uniqueSpecializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map(doc => (
              <div key={doc._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="h-28 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 opacity-90"></div>
                <div className="px-6 pb-6 relative">
                  <div className="w-20 h-20 bg-white rounded-2xl shadow border-4 border-white absolute -top-10 flex items-center justify-center text-3xl font-black text-indigo-600 rotate-3 overflow-hidden">
                    {doc.name?.charAt(0)}
                  </div>
                  <div className="mt-14">
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">Dr. {doc.name}</h3>
                    <p className="text-indigo-600 font-bold text-sm tracking-wide uppercase mt-0.5">{doc.speciality}</p>
                    <div className="flex items-center text-sm font-medium text-gray-500 mt-4 bg-gray-50 inline-flex px-3 py-1.5 rounded-lg">
                       <span className="flex items-center"><Clock className="w-4 h-4 mr-2 text-indigo-500"/> {doc.experience || 5}+ yrs Exp</span>
                       <span className="mx-3 text-gray-300">|</span>
                       <span>₹{doc.consultationFee} </span>
                    </div>
                    <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between">
                       <span className={`px-3 py-1 text-xs font-bold rounded-full ${doc.availabilityStatus ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                         {doc.availabilityStatus ? "Accepting Slots" : "Currently Busy"}
                       </span>
                       <button onClick={() => handleBookInitiate(doc)} disabled={!doc.availabilityStatus} className="bg-gray-900 hover:bg-black disabled:opacity-30 disabled:hover:bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md">
                         Book Now
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
           <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 uppercase text-xs tracking-wider text-gray-500">
                <th className="py-5 px-6 font-bold">Date & Time</th>
                <th className="py-5 px-6 font-bold">Doctor / Specialty</th>
                <th className="py-5 px-6 font-bold">Scope / Type</th>
                <th className="py-5 px-6 font-bold">Status</th>
                <th className="py-5 px-6 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {myAppointments.length === 0 ? (
                <tr><td colSpan="5" className="py-12 text-center text-gray-500 font-medium bg-gray-50/30">No appointments tracked.</td></tr>
              ) : myAppointments.map(app => (
                 <tr key={app._id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-bold text-gray-900">{new Date(app.date).toLocaleDateString()}</p>
                      <p className="text-sm font-medium text-indigo-600 mt-1 bg-indigo-50 inline-block px-2 py-0.5 rounded">{app.timeSlot}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-gray-900">Dr. {app.doctorDetailsSnapshot?.name || app.doctor?.name || "Unknown"}</p>
                      <p className="text-sm text-gray-500 uppercase tracking-wide text-xs mt-1">{app.specialty || "General"}</p>
                    </td>
                    <td className="py-4 px-6 text-gray-600 max-w-[200px]">
                      <p className="font-medium text-gray-900 truncate">{app.type}</p>
                      {app.notes && <p className="text-xs text-gray-400 mt-1 truncate">{app.notes}</p>}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border 
                        ${app.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-200 shadow-sm' : 
                          app.status === 'cancelled' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200 shadow-sm'}
                      `}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {['pending', 'confirmed'].includes(app.status) && (
                        <button onClick={() => cancelAppointment(app._id)} className="text-red-500 font-bold text-sm hover:text-red-700 hover:underline px-2 py-1 rounded transition-colors">Cancel Booking</button>
                      )}
                    </td>
                 </tr>
              ))}
            </tbody>
           </table>
        </div>
      )}

      {/* Modern Centered Modal: Single SaaS-grade View */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl relative animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
               <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Book New Appointment</h2>
                  <p className="text-sm font-medium text-gray-400 mt-1">Schedule a verified consultation digitally</p>
               </div>
               <button onClick={() => setShowModal(false)} className="bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-600 p-2.5 rounded-full transition-colors">
                  <X className="w-5 h-5"/>
               </button>
            </div>

            {/* Modal Body / Complete Overhauled Form Bounds */}
            <div className="p-6 md:p-8">
              <form onSubmit={submitBooking}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   
                   {/* Col 1 */}
                   <div className="space-y-6">
                      <div className="space-y-1.5">
                         <label className="text-sm font-bold text-gray-700 tracking-wide uppercase">Select Doctor <span className="text-red-500">*</span></label>
                         <select required value={formData.doctorId} onChange={handleDoctorChange} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white font-medium transition-all">
                            <option value="" disabled>-- Select a specialized doctor --</option>
                            {doctors.filter(d => d.availabilityStatus).map(doc => (
                              <option key={doc._id} value={doc._id}>Dr. {doc.name || "Unknown Doctor"} ({doc.speciality || "General"})</option>
                            ))}
                         </select>
                      </div>

                      <div className="space-y-1.5">
                         <label className="text-sm font-bold text-gray-700 tracking-wide uppercase">Consultation Date <span className="text-red-500">*</span></label>
                         <input type="date" required value={formData.date} min={new Date().toISOString().split("T")[0]} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white font-medium transition-all" />
                      </div>

                      <div className="space-y-1.5">
                         <label className="text-sm font-bold text-gray-700 tracking-wide uppercase">Time Slot <span className="text-red-500">*</span></label>
                         {currentDoctorSlots.length > 0 ? (
                           <select required value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white font-medium transition-all">
                              <option value="" disabled>-- Pick an available slot --</option>
                              {currentDoctorSlots.map(slot => (
                                 <option key={slot} value={slot}>{slot}</option>
                              ))}
                           </select>
                         ) : (
                           <input type="time" required value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white font-medium transition-all" />
                         )}
                      </div>

                      <div className="space-y-1.5">
                         <label className="text-sm font-bold text-gray-700 tracking-wide uppercase">Appointment Type <span className="text-red-500">*</span></label>
                         <select required value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white font-medium transition-all">
                            <option value="Consultation">Standard Consultation</option>
                            <option value="Follow-up">Patient Follow-up</option>
                            <option value="Emergency">Emergency Evaluation</option>
                         </select>
                      </div>
                   </div>

                   {/* Col 2 */}
                   <div className="space-y-6">
                      <div className="space-y-1.5">
                         <label className="text-sm font-bold text-gray-700 tracking-wide uppercase">Hospital / Clinic</label>
                         <input readOnly disabled type="text" placeholder="Auto-filled from doctor" value={formData.hospital} className="w-full bg-gray-100 border border-gray-200 text-gray-500 rounded-xl px-4 py-3 outline-none font-medium transition-all cursor-not-allowed" />
                      </div>

                      <div className="space-y-1.5">
                         <label className="text-sm font-bold text-gray-700 tracking-wide uppercase">Specialty</label>
                         <input type="text" placeholder="e.g. Cardiology" value={formData.specialty} onChange={(e) => setFormData({...formData, specialty: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white font-medium transition-all placeholder-gray-400" />
                      </div>

                      <div className="space-y-1.5">
                         <label className="text-sm font-bold text-gray-700 tracking-wide uppercase">Additional Notes</label>
                         <textarea placeholder="Outline existing conditions, medications, or any constraints..." rows="3" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white font-medium transition-all placeholder-gray-400 resize-none"></textarea>
                      </div>

                      <div className="mt-2 bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-start space-x-3">
                         <input type="checkbox" checked={formData.includeSymptoms} onChange={(e) => setFormData({...formData, includeSymptoms: e.target.checked})} className="mt-1 w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                         <div>
                            <p className="text-sm font-bold text-indigo-900">Inject Top Symptoms Profile</p>
                            <p className="text-xs text-indigo-700 mt-0.5">Dynamically pulls your latest 5 active tracker symptoms directly onto this appointment sheet.</p>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col-reverse sm:flex-row justify-end space-y-4 space-y-reverse sm:space-y-0 sm:space-x-4">
                   <button type="button" onClick={() => setShowModal(false)} className="px-8 py-3.5 rounded-xl font-bold bg-white border-2 border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors w-full sm:w-auto">
                      Cancel
                   </button>
                   <button type="submit" disabled={!isFormValid || isSubmitting} className="px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:shadow-none w-full sm:w-auto transition-all relative overflow-hidden">
                      {isSubmitting ? (
                         <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Processing Booking...
                         </span>
                      ) : "Confirm & Book Slot"}
                   </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
