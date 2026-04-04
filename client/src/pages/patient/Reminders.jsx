import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bell, ShieldCheck, CheckCircle, Clock, ShoppingCart, Info, X } from "lucide-react";
import useAuthStore from "../../store/useAuthStore";

export default function Reminders() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  
  // Reminder Form
  const [rFrequency, setRFrequency] = useState("Once daily");
  const [rTimes, setRTimes] = useState(["08:00"]);
  const [rStartDate, setRStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [rEndDate, setREndDate] = useState("");

  const { user } = useAuthStore();

  useEffect(() => {
    fetchData();
  }, []);

  // Web Notification Loop
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
    const interval = setInterval(checkNotifications, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [reminders]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const pRes = await axios.get("/api/v1/patient/prescriptions", { withCredentials: true });
      const rRes = await axios.get("/api/v1/patient/reminders", { withCredentials: true });
      setPrescriptions(pRes.data.data);
      setReminders(rRes.data.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const checkNotifications = () => {
    const now = new Date();
    const currentTimeStr = now.toTimeString().substring(0, 5); // "HH:MM"
    
    reminders.forEach(rem => {
      // Basic check: is today within start/end dates
      if (new Date(rem.startDate) <= now && (!rem.endDate || new Date(rem.endDate) >= now)) {
        rem.times.forEach(time => {
          if (time === currentTimeStr) {
             if (Notification.permission === "granted") {
                new Notification(`Medication Reminder: ${rem.medicineName}`, {
                  body: `It is time to take your ${rem.medicineName}.`
                });
             }
          }
        });
      }
    });
  };

  // Restructuring prescriptions to a flat list of medicines for read-only tracking
  let medications = [];
  prescriptions.forEach(p => {
    p.medications.forEach(m => {
      if (m.status === "active") medications.push({ ...m, prescriptionId: p._id });
    });
  });

  const openReminderModal = (med) => {
    setSelectedMedicine(med);
    setRFrequency("Once daily");
    setRTimes(["08:00"]);
    setShowReminderModal(true);
  };

  const handleTimeChange = (index, value) => {
    const newTimes = [...rTimes];
    newTimes[index] = value;
    setRTimes(newTimes);
  };

  const addTimeSlot = () => setRTimes([...rTimes, "12:00"]);
  const removeTimeSlot = (index) => setRTimes(rTimes.filter((_, i) => i !== index));

  const saveReminder = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/v1/patient/reminders", {
        medicineName: selectedMedicine.name,
        frequency: rFrequency,
        times: rTimes,
        startDate: rStartDate,
        endDate: rEndDate
      }, { withCredentials: true });
      setShowReminderModal(false);
      fetchData();
    } catch(err) {
      alert("Failed to save reminder.");
    }
  };

  const markLogStatus = async (reminderId, time, status) => {
    const todayStr = new Date().toISOString().split("T")[0];
    try {
      await axios.put(`/api/v1/patient/reminders/${reminderId}/status`, {
        date: todayStr,
        time,
        status
      }, { withCredentials: true });
      fetchData();
    } catch(err) {
      alert("Error marking standard status.");
    }
  };

  const handleReorder = async (medName) => {
    if (!window.confirm(`Would you like to dispatch a reorder request for ${medName} to the partnered hospital pharmacy?`)) return;
    try {
      await axios.post("/api/v1/patient/orders", { medicineName: medName }, { withCredentials: true });
      alert(`Order for ${medName} placed successfully!`);
    } catch(err) {
      alert("Failed to process re-order mock.");
    }
  };

  // Helper to generate today's schedule out of all reminders
  const todayStr = new Date().toISOString().split("T")[0];
  const todaysSchedule = [];
  reminders.forEach(rem => {
     const sd = new Date(rem.startDate);
     const ed = rem.endDate ? new Date(rem.endDate) : new Date(todayStr); // if no end bounds, assume valid
     const td = new Date(todayStr);
     
     if (td >= sd && td <= ed) {
        rem.times.forEach(t => {
           // check logs mapping to see if handled
           const logForTodayTime = rem.logs.find(l => l.date === todayStr && l.time === t);
           todaysSchedule.push({
             reminderId: rem._id,
             medicineName: rem.medicineName,
             time: t,
             status: logForTodayTime ? logForTodayTime.status : "pending"
           });
        });
     }
  });

  // Sort chronologically 
  todaysSchedule.sort((a,b) => a.time.localeCompare(b.time));

  return (
    <div className="space-y-8 relative">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reminders & Reorders</h1>
        <p className="text-gray-500 mt-1">Strictly track existing prescribed dosages and seamlessly reorder supplies.</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading module...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* DAILY SCHEDULE LAYER (Left Side / Top Layer on Mobile) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10"><Bell className="w-24 h-24 text-blue-500" /></div>
               <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center relative z-10"><Clock className="w-5 h-5 mr-2 text-blue-600"/> Today's Schedule</h2>
               
               {todaysSchedule.length === 0 ? (
                 <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-500 text-center relative z-10">
                   No schedule active for today. Create reminders from your prescribed active medicines.
                 </div>
               ) : (
                 <div className="space-y-3 relative z-10">
                    {todaysSchedule.map((task, i) => (
                       <div key={i} className={`p-4 rounded-xl border ${task.status === 'taken' ? 'bg-green-50 border-green-200' : task.status === 'missed' ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
                          <div className="flex justify-between items-center mb-2">
                             <p className="font-bold text-gray-900">{task.medicineName}</p>
                             <p className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{task.time}</p>
                          </div>
                          
                          {task.status === "pending" ? (
                             <div className="flex space-x-2 mt-3">
                                <button onClick={() => markLogStatus(task.reminderId, task.time, "taken")} className="flex-1 bg-green-500 hover:bg-green-600 text-white py-1.5 rounded-lg text-sm font-semibold transition-colors">Take</button>
                                <button onClick={() => markLogStatus(task.reminderId, task.time, "missed")} className="flex-1 bg-gray-200 hover:bg-red-500 hover:text-white text-gray-700 py-1.5 rounded-lg text-sm font-semibold transition-colors">Miss</button>
                             </div>
                          ) : (
                             <div className="flex items-center text-sm font-medium mt-2">
                               {task.status === "taken" ? (
                                  <span className="text-green-700 flex items-center"><CheckCircle className="w-4 h-4 mr-1"/> Logged Taken</span>
                               ) : (
                                  <span className="text-red-700 flex items-center"><X className="w-4 h-4 mr-1"/> Logged Missed</span>
                               )}
                             </div>
                          )}
                       </div>
                    ))}
                 </div>
               )}
            </div>
          </div>

          {/* PRESCRIBED MEDICINES REORDER/REMINDER LIST (Right Side) */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center"><ShieldCheck className="w-6 h-6 mr-2 text-indigo-600"/> Verified Prescriptions Protocol</h2>
            <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800 flex items-start border border-blue-100">
               <Info className="w-5 h-5 mr-3 shrink-0" />
               <p>For your safety, alerts and reorders can <strong>only</strong> be generated for medications your registered SwasthyaLink doctor has explicitly prescribed to you below.</p>
            </div>

            <div className="space-y-4">
              {medications.length === 0 ? (
                <div className="bg-white p-8 rounded-xl border border-gray-100 text-center text-gray-500">
                  <p>No active prescriptions located for your profile.</p>
                </div>
              ) : medications.map((med, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:bg-gray-50">
                   <div>
                     <h3 className="text-lg font-bold text-gray-900">{med.name}</h3>
                     <p className="text-sm text-gray-500 mb-2">Dosage Rule: {med.dosage} ~ {med.frequency}</p>
                     
                     {/* Warning: Notice we stripped out specific Generic mapping per prompt instructions */}
                   </div>
                   <div className="flex space-x-3 shrink-0">
                      <button onClick={() => openReminderModal(med)} className="bg-white border border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center transition-colors">
                        <Bell className="w-4 h-4 mr-1" /> Add Alarm
                      </button>
                      <button onClick={() => handleReorder(med.name)} className="bg-gray-900 text-white hover:bg-black px-4 py-2 rounded-xl text-sm font-bold flex items-center transition-colors">
                        <ShoppingCart className="w-4 h-4 mr-1" /> Reorder
                      </button>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Set Reminder Modal */}
      {showReminderModal && selectedMedicine && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
             <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
               <div>
                 <h2 className="text-xl font-bold text-gray-900">Set Reminder Alarm</h2>
                 <p className="text-sm text-gray-500">For {selectedMedicine.name}</p>
               </div>
               <button onClick={() => setShowReminderModal(false)} className="text-gray-400 hover:text-red-500 transition-colors"><X className="w-6 h-6"/></button>
             </div>
             <form onSubmit={saveReminder} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Frequency Rule</label>
                  <select value={rFrequency} onChange={e => setRFrequency(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="Once daily">Once daily</option>
                    <option value="Twice daily">Twice daily</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Alarm Times</label>
                  <div className="space-y-2">
                    {rTimes.map((t, idx) => (
                      <div key={idx} className="flex gap-2">
                         <input type="time" required value={t} onChange={e => handleTimeChange(idx, e.target.value)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                         {rTimes.length > 1 && (
                           <button type="button" onClick={() => removeTimeSlot(idx)} className="px-3 bg-red-50 text-red-500 rounded-lg hover:bg-red-100">X</button>
                         )}
                      </div>
                    ))}
                    <button type="button" onClick={addTimeSlot} className="text-blue-600 text-sm font-bold mt-2 hover:underline">+ Add another time slot</button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                     <input type="date" required value={rStartDate} onChange={e => setRStartDate(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">End Date (Optional)</label>
                     <input type="date" value={rEndDate} onChange={e => setREndDate(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                   </div>
                </div>

                <div className="pt-6">
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-colors">Save Alarm System</button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
