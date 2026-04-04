import React, { useState, useEffect } from "react";
import axios from "axios";
import { Activity, Thermometer, Calendar, Plus, Trash2, Edit3, X, CheckCircle } from "lucide-react";
import useAuthStore from "../../store/useAuthStore";

export default function SymptomTracker() {
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Track Form
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [symptomTitle, setSymptomTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("Mild");
  const [dateTime, setDateTime] = useState(new Date().toISOString().slice(0, 16));

  const { user } = useAuthStore();

  useEffect(() => {
    fetchSymptoms();
  }, []);

  const fetchSymptoms = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/v1/patient/symptoms", { withCredentials: true });
      setSymptoms(res.data.data);
    } catch (err) {
      console.error("Failed to fetch symptoms", err);
    }
    setLoading(false);
  };

  const openNewForm = () => {
    setEditingId(null);
    setSymptomTitle("");
    setDescription("");
    setSeverity("Mild");
    setDateTime(new Date().toISOString().slice(0, 16));
    setShowForm(true);
  };

  const openEditForm = (symp) => {
    setEditingId(symp._id);
    setSymptomTitle(symp.symptomTitle);
    setDescription(symp.description || "");
    setSeverity(symp.severity);
    setDateTime(new Date(symp.dateTime).toISOString().slice(0, 16));
    setShowForm(true);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    const payload = { symptomTitle, description, severity, dateTime };
    
    try {
      if (editingId) {
        await axios.put(`/api/v1/patient/symptoms/${editingId}`, payload, { withCredentials: true });
      } else {
        await axios.post("/api/v1/patient/symptoms", payload, { withCredentials: true });
      }
      setShowForm(false);
      fetchSymptoms();
    } catch (err) {
      alert("Failed to save symptom.");
    }
  };

  const deleteSymptom = async (id) => {
    if (!window.confirm("Delete this logged symptom?")) return;
    try {
      await axios.delete(`/api/v1/patient/symptoms/${id}`, { withCredentials: true });
      fetchSymptoms();
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  const getSeverityBadge = (level) => {
     switch(level) {
       case "Mild": return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Mild</span>;
       case "Moderate": return <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Moderate</span>;
       case "Severe": return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Severe!</span>;
       default: return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">{level}</span>;
     }
  };

  return (
    <div className="space-y-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center"><Activity className="w-8 h-8 mr-3 text-red-500"/> Core Symptom Tracker</h1>
          <p className="text-gray-500 mt-1">Log localized symptoms natively to sync them with Doctor appointments.</p>
        </div>
        <button onClick={openNewForm} className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center transition-colors shadow-sm">
          <Plus className="w-5 h-5 mr-1" /> Log Symptom
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500 font-medium">Fetching history...</div>
      ) : symptoms.length === 0 ? (
        <div className="bg-gray-50 border border-gray-100 rounded-3xl p-12 text-center">
           <Thermometer className="w-16 h-16 text-gray-300 mx-auto mb-4" />
           <h3 className="text-xl font-bold text-gray-900">No Symptoms Recorded</h3>
           <p className="text-gray-500 mt-2 max-w-md mx-auto">Start logging your symptoms natively so they can be injected into explicit appointment dispatch requests.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {symptoms.map(symp => (
              <div key={symp._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative group transition-all hover:shadow-md hover:border-red-100">
                 <div className="flex justify-between items-start mb-3">
                   <h3 className="text-lg font-bold text-gray-900">{symp.symptomTitle}</h3>
                   {getSeverityBadge(symp.severity)}
                 </div>
                 
                 {symp.description && (
                   <p className="text-gray-600 text-sm mb-4 line-clamp-2">{symp.description}</p>
                 )}

                 <div className="flex items-center text-gray-500 text-sm font-medium mt-auto pt-4 border-t border-gray-50">
                    <Calendar className="w-4 h-4 mr-2 text-red-400" />
                    {new Date(symp.dateTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                 </div>

                 <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur rounded-lg shadow-sm border border-gray-100 flex p-1">
                    <button onClick={() => openEditForm(symp)} className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors"><Edit3 className="w-4 h-4"/></button>
                    <button onClick={() => deleteSymptom(symp._id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4"/></button>
                 </div>
              </div>
           ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">
               <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                 <h2 className="text-xl font-bold text-gray-900">{editingId ? "Update Log" : "New Symptom Log"}</h2>
                 <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-red-500"><X className="w-6 h-6"/></button>
               </div>

               <form onSubmit={submitForm} className="p-6 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Observation / Symptom Title *</label>
                    <input type="text" required value={symptomTitle} onChange={e=>setSymptomTitle(e.target.value)} placeholder="e.g. Sharp Stomach Pain" className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Details (Optional)</label>
                    <textarea value={description} onChange={e=>setDescription(e.target.value)} rows="3" placeholder="Context on how long or where exactly..." className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500"></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Severity Lock</label>
                      <select value={severity} onChange={e=>setSeverity(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500 bg-white">
                        <option value="Mild">Mild</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Severe">Severe</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                      <input type="datetime-local" required value={dateTime} onChange={e=>setDateTime(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500" />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors flex justify-center items-center">
                       <CheckCircle className="w-5 h-5 mr-2" /> Save Form
                    </button>
                  </div>
               </form>
           </div>
        </div>
      )}
    </div>
  );
}
