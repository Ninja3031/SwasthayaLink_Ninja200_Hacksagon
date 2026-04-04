import React, { useState, useEffect } from "react";
import axios from "axios";
import { Upload, X, FileText, CheckCircle } from "lucide-react";

export default function DoctorLabResults() {
  const [reports, setReports] = useState([]);
  const [patients, setPatients] = useState([]);
  
  // Upload Form State
  const [showForm, setShowForm] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [reportTitle, setReportTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchMyUploads();
    fetchPatientList();
  }, []);

  const fetchMyUploads = async () => {
    try {
      const res = await axios.get("/api/v1/lab-results/doctor", { withCredentials: true });
      setReports(res.data.data);
    } catch (err) {
      console.error("Failed to map physican uploads");
    }
  };

  const fetchPatientList = async () => {
     try {
       const res = await axios.get("/api/v1/doctors/patients", { withCredentials: true });
       setPatients(res.data.data);
     } catch (err) {
       console.error("Failed mapping explicit patient structures");
     }
  };

  const submitUpload = async (e) => {
    e.preventDefault();
    if (!file || !selectedPatientId || !reportTitle) return alert("Fill mandatory fields and attach file.");
    
    const formData = new FormData();
    formData.append("patientId", selectedPatientId);
    formData.append("reportTitle", reportTitle);
    formData.append("notes", notes);
    formData.append("reportFile", file);

    try {
      await axios.post("/api/v1/lab-results/upload", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      });
      setShowForm(false);
      setFile(null);
      setReportTitle("");
      setNotes("");
      fetchMyUploads();
    } catch (err) {
      alert("Upload payload failed injection");
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-end border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lab Reports Hub</h1>
          <p className="text-gray-500 mt-1">Upload and map clinical reports to patients securely.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center transition-colors">
          <Upload className="w-5 h-5 mr-2" /> Dispatch Report
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
         <h2 className="text-xl font-bold text-gray-800 mb-2">My Uploaded Documents</h2>
         {reports.length === 0 ? (
            <div className="p-8 text-center text-gray-400 bg-gray-50 rounded-xl border border-gray-100">
               No documents actively uploaded by your terminal.
            </div>
         ) : (
            reports.map(r => (
               <div key={r._id} className="bg-white p-4 items-center flex justify-between rounded-xl shadow-sm border border-gray-100">
                   <div>
                     <p className="font-bold text-gray-900">{r.reportTitle}</p>
                     <p className="text-sm text-gray-500">Target Patient: {r.patientId?.name || r.patientId}</p>
                   </div>
                   <div className="text-sm text-gray-400">
                     {new Date(r.createdAt).toLocaleDateString()}
                   </div>
               </div>
            ))
         )}
      </div>

      {/* Upload Modal Payload */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">
             <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
               <h2 className="text-xl font-bold text-gray-900">Upload Clinical Data</h2>
               <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-red-500"><X className="w-6 h-6"/></button>
             </div>

             <form onSubmit={submitUpload} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Patient *</label>
                  <select required value={selectedPatientId} onChange={e=>setSelectedPatientId(e.target.value)} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-blue-500 bg-white">
                      <option value="">Select an affiliated patient...</option>
                      {patients.map(p => (
                          <option key={p._id} value={p._id}>{p.name} ({p.email})</option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Document Title *</label>
                  <input required placeholder="e.g. CBC Bloodwork" value={reportTitle} onChange={e=>setReportTitle(e.target.value)} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Document Image/PDF *</label>
                  <input required type="file" onChange={e=>setFile(e.target.files[0])} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea rows="2" value={notes} onChange={e=>setNotes(e.target.value)} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-blue-500"></textarea>
                </div>

                <div className="pt-2">
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition flex justify-center items-center">
                    <CheckCircle className="w-5 h-5 mr-2"/> Encrypt & Send
                  </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
