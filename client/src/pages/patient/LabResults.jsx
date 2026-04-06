import React, { useState, useEffect } from "react";
import axios from "axios";
import { FileText, Download, UserCheck, Calendar } from "lucide-react";
import { API_BASE_URL } from "../../api/config";

export default function LabResults() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;
      const user = JSON.parse(userStr);

      const res = await axios.get(`/api/v1/lab-results/patient/${user._id}`, { withCredentials: true });
      setReports(res.data.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 border-b border-gray-100 pb-4">Lab Results Hub</h1>
        <p className="text-gray-500 mt-2">View verified diagnostic reports securely dispatched by your physician.</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading diagnostic array...</div>
      ) : reports.length === 0 ? (
        <div className="bg-gray-50 rounded-2xl p-12 text-center border border-gray-100">
           <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
           <h3 className="text-xl font-bold text-gray-900">No Reports Available</h3>
           <p className="text-gray-500 max-w-md mx-auto mt-2">Your physician has not uploaded any specific lab outcomes to your directory yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           {reports.map(r => (
              <div key={r._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center hover:border-blue-200 transition-colors">
                  <div className="flex-1 mb-4 md:mb-0">
                     <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-blue-500" /> {r.reportTitle}
                     </h3>
                     <p className="text-sm text-gray-600 mb-3">{r.notes || "No standard notes attached."}</p>
                     
                     <div className="flex space-x-4 text-xs font-semibold text-gray-500">
                        <span className="flex items-center"><UserCheck className="w-4 h-4 mr-1 text-green-500"/> Dr. {r.doctorId?.name || 'Unknown'}</span>
                        <span className="flex items-center"><Calendar className="w-4 h-4 mr-1 text-blue-400"/> {new Date(r.createdAt).toLocaleDateString()}</span>
                     </div>
                  </div>
                  
                  <a href={`${API_BASE_URL}${r.reportFile}`} target="_blank" rel="noreferrer" className="flex items-center px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-bold transition-colors">
                     <Download className="w-4 h-4 mr-2" /> Download Document
                  </a>
              </div>
           ))}
        </div>
      )}
    </div>
  );
}
