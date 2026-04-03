import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Calendar, Clock, X, CheckCircle, Filter } from "lucide-react";
import useAuthStore from "../../store/useAuthStore";

export default function Appointments() {
  const [activeTab, setActiveTab] = useState("browse"); // 'browse' or 'mine'
  const [doctors, setDoctors] = useState([]);
  const [myAppointments, setMyAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("All");

  // Booking Modal State
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [bDate, setBDate] = useState("");
  const [bTime, setBTime] = useState("");
  const [bReason, setBReason] = useState("");
  const [bSymptoms, setBSymptoms] = useState("");

  const { user } = useAuthStore();

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "browse") {
        const res = await axios.get("/api/v1/doctors", { withCredentials: true });
        setDoctors(res.data.data);
      } else {
        const res = await axios.get("/api/v1/appointments/user", { withCredentials: true });
        setMyAppointments(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleBookInitiate = (doc) => {
    setSelectedDoctor(doc);
    setBookingStep(1);
    setBDate("");
    setBTime("");
    setBReason("");
    setBSymptoms("");
    setShowModal(true);
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/v1/appointments", {
        doctorId: selectedDoctor._id,
        hospitalId: selectedDoctor.hospital._id,
        date: bDate,
        timeSlot: bTime,
        reason: bReason,
        symptoms: bSymptoms ? bSymptoms.split(",") : []
      }, { withCredentials: true });

      setBookingStep(3); // Success step
    } catch (err) {
      alert("Error booking appointment");
    }
  };

  const cancelAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await axios.patch(`/api/v1/appointments/${id}/status`, { status: "cancelled" }, { withCredentials: true });
      fetchData();
    } catch (err) {
      alert("Error cancelling");
    }
  };

  const filteredDoctors = doctors.filter(d => {
    const matchesName = d.user?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpec = specializationFilter === "All" || d.specialization === specializationFilter;
    return matchesName && matchesSpec;
  });

  const uniqueSpecializations = ["All", ...new Set(doctors.map(d => d.specialization))];

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments Hub</h1>
          <p className="text-gray-500 mt-1">Book, manage, and track your healthcare consultations.</p>
        </div>
        <div className="bg-gray-100 p-1 rounded-lg flex space-x-1">
          <button onClick={() => setActiveTab("browse")} className={`px-5 py-2 rounded-md font-medium transition-all ${activeTab === 'browse' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}>Browse Doctors</button>
          <button onClick={() => setActiveTab("mine")} className={`px-5 py-2 rounded-md font-medium transition-all ${activeTab === 'mine' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}>My Appointments</button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 text-gray-400">Loading data...</div>
      ) : activeTab === "browse" ? (
        <>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input type="text" placeholder="Search by doctor name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="relative w-full md:w-64">
              <Filter className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <select value={specializationFilter} onChange={e => setSpecializationFilter(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white">
                {uniqueSpecializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map(doc => (
              <div key={doc._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                <div className="px-6 pb-6 relative">
                  <div className="w-20 h-20 bg-white rounded-full border-4 border-white shadow-sm absolute -top-10 flex items-center justify-center text-2xl font-bold text-blue-600 overflow-hidden">
                    {doc.user?.name.charAt(0)}
                  </div>
                  <div className="mt-12">
                    <h3 className="text-xl font-bold text-gray-900">Dr. {doc.user?.name}</h3>
                    <p className="text-blue-600 font-medium">{doc.specialization}</p>
                    <div className="flex items-center text-sm text-gray-500 mt-2 space-x-4">
                       <span className="flex items-center"><Clock className="w-4 h-4 mr-1"/> {doc.experienceYears || 5}+ yrs</span>
                       <span>₹{doc.consultationFee} Fee</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                       <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${doc.availabilityStatus ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                         {doc.availabilityStatus ? "Available Today" : "Busy"}
                       </span>
                       <button onClick={() => handleBookInitiate(doc)} disabled={!doc.availabilityStatus} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                         Book Slot
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
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-4 px-6 font-semibold text-gray-600">Date & Time</th>
                <th className="py-4 px-6 font-semibold text-gray-600">Doctor</th>
                <th className="py-4 px-6 font-semibold text-gray-600">Reason</th>
                <th className="py-4 px-6 font-semibold text-gray-600">Status</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {myAppointments.length === 0 ? (
                <tr><td colSpan="5" className="py-8 text-center text-gray-500">No appointments found.</td></tr>
              ) : myAppointments.map(app => (
                 <tr key={app._id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <p className="font-semibold text-gray-900">{new Date(app.date).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-500">{app.timeSlot}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-medium text-gray-900">Dr. {app.doctor?.user?.name || "Unknown"}</p>
                      <p className="text-sm text-gray-500">{app.hospital?.registrationNumber || "Hospital"}</p>
                    </td>
                    <td className="py-4 px-6 text-gray-600 max-w-[200px] truncate">{app.reason}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider 
                        ${app.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                          app.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}
                      `}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {['pending', 'confirmed'].includes(app.status) && (
                        <button onClick={() => cancelAppointment(app._id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded transition-colors text-sm font-medium">Cancel</button>
                      )}
                    </td>
                 </tr>
              ))}
            </tbody>
           </table>
        </div>
      )}

      {/* Booking Modal */}
      {showModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
               <div>
                 <h2 className="text-xl font-bold text-gray-900">Book Appointment</h2>
                 <p className="text-sm text-gray-500">Dr. {selectedDoctor.user?.name}</p>
               </div>
               <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500 transition-colors"><X className="w-6 h-6"/></button>
            </div>

            <div className="p-6">
              {bookingStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                    <input type="date" required value={bDate} min={new Date().toISOString().split("T")[0]} onChange={e => setBDate(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Time Slot</label>
                    <div className="grid grid-cols-3 gap-3">
                      {selectedDoctor.availableSlots?.map(slot => (
                        <button key={slot} onClick={() => setBTime(slot)} className={`py-2 rounded-lg text-sm font-medium border transition-all ${bTime === slot ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'}`}>
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => setBookingStep(2)} disabled={!bDate || !bTime} className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-3 rounded-xl font-bold transition-colors">
                    Continue
                  </button>
                </div>
              )}

              {bookingStep === 2 && (
                <form onSubmit={submitBooking} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Visit</label>
                    <input required type="text" placeholder="e.g. Fever, routine checkup" value={bReason} onChange={e => setBReason(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms (Optional)</label>
                    <textarea placeholder="e.g. Headache, Nausea (comma separated)" value={bSymptoms} onChange={e => setBSymptoms(e.target.value)} rows="3" className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <button type="button" onClick={() => setBookingStep(1)} className="w-1/3 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">Back</button>
                    <button type="submit" className="w-2/3 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-colors">Confirm Booking</button>
                  </div>
                </form>
              )}

              {bookingStep === 3 && (
                <div className="text-center py-8">
                  <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
                  <p className="text-gray-500 mb-8">Your appointment request has been securely dispatched to the clinic.</p>
                  <button onClick={() => { setShowModal(false); setActiveTab("mine"); }} className="bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-xl font-medium transition-colors">
                    View My Appointments
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
