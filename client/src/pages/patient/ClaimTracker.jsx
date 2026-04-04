import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Copy, UploadCloud, Map, HeartPulse, Activity, Zap, ShieldCheck } from "lucide-react";

export default function ClaimTracker() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);

  // Strictly maps timeline definitions natively
  const timelinePhases = ["SUBMITTED", "UNDER_REVIEW", "APPROVED", "SETTLED"];

  useEffect(() => {
     fetchTimeline();
  }, [id]);

  const fetchTimeline = async () => {
      try {
         const res = await axios.get(`/api/v1/claims/${id}`, { withCredentials: true });
         setClaim(res.data.data);
      } catch (err) {
         console.error(err);
      }
      setLoading(false);
  };

  const hookDemoSimulation = async () => {
      const currentIdx = timelinePhases.indexOf(claim.status);
      if (currentIdx === -1 || currentIdx === timelinePhases.length - 1) return;
      
      const targetPhase = timelinePhases[currentIdx + 1];
      
      try {
         const res = await axios.patch(`/api/v1/claims/${id}/simulate`, { targetStatus: targetPhase }, { withCredentials: true });
         setClaim(res.data.data);
      } catch (err) {
         alert("Artificial Simulation override failed bounds.");
      }
  };

  if (loading) return <div className="text-center py-20 text-gray-500 font-bold uppercase tracking-widest">Compiling Neural Map...</div>;
  if (!claim) return <div className="text-center py-20 text-red-500 font-bold">Unlocatable Claim Request. Mapping dropped.</div>;

  const currentIdx = timelinePhases.indexOf(claim.status);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <div className="flex justify-between items-end mb-8">
         <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center"><Activity className="w-8 h-8 mr-3 text-blue-600"/> Mediclaim Tracking Interface</h1>
            <p className="text-sm font-medium bg-gray-100 text-gray-600 px-3 py-1 rounded inline-flex items-center mt-2 font-mono">
               System Trace ID: {claim._id} <Copy className="w-3 h-3 ml-2 text-gray-400" />
            </p>
         </div>
         <button onClick={() => navigate("/patient/claims/new")} className="bg-white border-2 border-gray-200 text-gray-700 hover:text-black hover:border-gray-500 px-6 py-2.5 rounded-xl font-bold transition-all text-sm uppercase tracking-wider">
            File New Request
         </button>
      </div>

      <div className="bg-white px-8 py-10 rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative">
          
          <h2 className="text-xl font-black text-gray-800 mb-8 border-b border-gray-100 pb-3 flex justify-between items-center">
             Status Roadmap Flow
             {currentIdx < timelinePhases.length - 1 && (
                <button onClick={hookDemoSimulation} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs px-4 py-2 rounded-full uppercase tracking-widest flex items-center shadow-md transition-all hover:scale-105 active:scale-95">
                   <Zap className="w-3 h-3 mr-1.5"/> Demo Artificial Progress
                </button>
             )}
          </h2>

          {/* Core Timeline Stepper */}
          <div className="relative flex justify-between items-center px-4 md:px-12 my-12">
              <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-gray-100 -translate-y-1/2 rounded-full z-0 px-12">
                 <div className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-in-out" style={{ width: `${(Math.max(currentIdx, 0) / (timelinePhases.length - 1)) * 100}%`}}></div>
              </div>
              
              {timelinePhases.map((phase, i) => {
                  const isActive = i <= currentIdx;
                  const isCurrent = i === currentIdx;
                  return (
                     <div key={phase} className="relative z-10 flex flex-col items-center group">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold border-4 transition-all duration-700 shadow-sm ${isActive ? 'bg-blue-600 border-blue-200 text-white' : 'bg-white border-gray-200 text-gray-400'} ${isCurrent ? 'ring-4 ring-blue-500/20 scale-125' : ''}`}>
                            <ShieldCheck className="w-5 h-5"/>
                        </div>
                        <p className={`absolute -bottom-10 whitespace-nowrap text-xs md:text-sm font-black tracking-widest uppercase transition-all duration-500 ${isCurrent ? 'text-blue-800 scale-110' : isActive ? 'text-gray-800' : 'text-gray-400'}`}>
                           {phase.replace("_", " ")}
                        </p>
                     </div>
                  )
              })}
          </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-gray-50 border border-gray-200 p-8 rounded-3xl">
             <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 border-b border-gray-200 pb-2">Policy Utilization Meta</h3>
             <div className="space-y-4">
                 <div>
                    <p className="text-xs text-gray-400 uppercase font-black tracking-wider">Diagnosis Block</p>
                    <p className="text-lg font-black text-gray-900 mt-0.5">{claim.disease}</p>
                 </div>
                 <div>
                    <p className="text-xs text-gray-400 uppercase font-black tracking-wider">Operational Medical Hub</p>
                    <p className="text-lg font-black text-gray-900 mt-0.5">{claim.hospital}</p>
                 </div>
                 <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs text-blue-500 uppercase font-black tracking-wider">Total Requested Reclaim</p>
                    <p className="text-3xl font-black text-blue-700 mt-1">₹{claim.amount}</p>
                 </div>
             </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 p-8 rounded-3xl">
             <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 border-b border-gray-200 pb-2">Intelligence Profile Snapshot</h3>
             
             <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                 <p className="text-sm font-black text-gray-700 uppercase tracking-wider">Algorithmic Readiness Edge</p>
                 <span className="bg-indigo-100 text-indigo-700 font-black px-3 py-1 rounded text-lg">{claim.score}%</span>
             </div>

             <div>
                <p className="text-xs text-gray-400 uppercase font-black tracking-wider mb-2">Ingested Documents</p>
                {claim.documents && claim.documents.length > 0 ? (
                   <ul className="space-y-2">
                      {claim.documents.map(doc => (
                         <li key={doc} className="flex items-center text-sm font-bold text-gray-700 bg-white border border-gray-100 rounded-lg px-3 py-2 uppercase tracking-wide">
                             <UploadCloud className="w-4 h-4 mr-2 text-green-500" /> {doc.replace("_", " ")}
                         </li>
                      ))}
                   </ul>
                ) : (
                   <div className="bg-red-50 text-red-600 text-sm font-bold p-3 rounded-lg border border-red-100 uppercase tracking-wide flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2"/> No Traces Logged
                   </div>
                )}
             </div>
          </div>
      </div>
    </div>
  );
}
