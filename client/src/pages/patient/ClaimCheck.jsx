import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, AlertTriangle, XCircle, TrendingUp, ChevronLeft } from "lucide-react";

export default function ClaimCheck() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  if (!state || !state.intelData) {
      return (
          <div className="text-center py-20 animate-in spin-in-1">
             <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
             <h2 className="text-xl font-black text-gray-800">No Intelligence Payload Found</h2>
             <button onClick={() => navigate("/patient/claims/new")} className="mt-4 px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">Return to Verification Wizard</button>
          </div>
      );
  }

  const { intelData, formData } = state;

  const handleSubmit = async () => {
      setSubmitting(true);
      try {
          const res = await axios.post("/api/v1/claims", {
              disease: formData.disease,
              hospital: formData.hospital,
              amount: formData.amount,
              documents: formData.documents,
              score: intelData.claimScore,
              approvalChance: intelData.approvalChance
          }, { withCredentials: true });
          
          // Route perfectly to timeline tracker UI using created MongoDB ID
          navigate(`/patient/claims/${res.data.data._id}`);
      } catch (err) {
          alert("Error dynamically creating persistent claim limits.");
      }
      setSubmitting(false);
  };

  const coverageGap = Math.max(intelData.requestedAmount - intelData.maxLimit, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <button onClick={() => navigate("/patient/claims/new")} className="flex items-center text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors uppercase tracking-widest"><ChevronLeft className="w-4 h-4 mr-1"/> Modify Parameters</button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
              
              <div className={`p-8 rounded-3xl border shadow-sm relative overflow-hidden transition-all ${intelData.approvalChance === 'HIGH' ? 'bg-green-50 border-green-200' : intelData.approvalChance === 'MEDIUM' ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'}`}>
                 <h2 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-2">Algorithm Determination</h2>
                 <div className="flex items-center space-x-4">
                     {intelData.approvalChance === 'HIGH' && <CheckCircle className="w-12 h-12 text-green-600" />}
                     {intelData.approvalChance === 'MEDIUM' && <TrendingUp className="w-12 h-12 text-yellow-600" />}
                     {intelData.approvalChance === 'LOW' && <XCircle className="w-12 h-12 text-red-600" />}
                     
                     <div>
                        <p className={`text-3xl font-black ${intelData.approvalChance === 'HIGH' ? 'text-green-800' : intelData.approvalChance === 'MEDIUM' ? 'text-yellow-800' : 'text-red-800'}`}>
                           {intelData.approvalChance} APPROVAL LIKELIHOOD
                        </p>
                        <p className="text-gray-600 font-medium mt-1">Claim Readiness Score: {intelData.claimScore}%</p>
                     </div>
                 </div>

                 <div className="mt-8 bg-white/60 p-4 rounded-xl border border-white/50 shadow-sm backdrop-blur-sm">
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                       <div className={`h-full rounded-full transition-all duration-1000 ${intelData.approvalChance === 'HIGH' ? 'bg-green-500' : intelData.approvalChance === 'MEDIUM' ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${intelData.claimScore}%`}}></div>
                    </div>
                 </div>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Financial Coverage Check</h3>
                  <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                          <p className="text-sm font-bold text-gray-500 uppercase">Policy Max Cap</p>
                          <p className="text-2xl font-black text-gray-900">₹{intelData.maxLimit}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                          <p className="text-sm font-bold text-gray-500 uppercase">Your Request</p>
                          <p className="text-2xl font-black text-gray-900">₹{intelData.requestedAmount}</p>
                      </div>
                  </div>
                  
                  {coverageGap > 0 ? (
                      <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center">
                          <AlertTriangle className="text-red-600 w-6 h-6 mr-3" />
                          <p className="font-bold text-red-800">Your requested amount exceeds the dynamic policy cap. <br/><span className="font-medium text-red-600">Out-of-Pocket Liability: ₹{coverageGap}</span></p>
                      </div>
                  ) : (
                      <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-xl flex items-center">
                          <CheckCircle className="text-green-600 w-6 h-6 mr-3" />
                          <p className="font-bold text-green-800">Costs fully covered underneath standard disease limits.</p>
                      </div>
                  )}
              </div>
          </div>

          <div className="space-y-6">
              <div className="bg-white px-6 py-8 rounded-3xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Required Documents Checklist</h3>
                  <ul className="space-y-3">
                      {intelData.missingDocs.map(doc => (
                          <li key={doc} className="flex flex-col bg-red-50 border border-red-100 px-4 py-3 rounded-xl shadow-sm">
                             <div className="flex items-center text-red-700 font-bold">
                               <XCircle className="w-5 h-5 mr-2" /> {doc}
                             </div>
                             <p className="text-xs text-red-600 font-medium ml-7 mt-1">Penalty applied (-20 points). Please upload this.</p>
                          </li>
                      ))}
                      {intelData.missingDocs.length === 0 && (
                          <li className="flex items-center text-green-700 font-bold bg-green-50 border border-green-100 px-4 py-3 rounded-xl shadow-sm">
                             <CheckCircle className="w-5 h-5 mr-2" /> All Required Documents Checked!
                          </li>
                      )}
                  </ul>
              </div>

              <div className="pt-4 border-t border-gray-100 flex flex-col justify-end">
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-4">
                       <div className="h-full bg-blue-600 w-full rounded-full"></div>
                    </div>
                   <button onClick={handleSubmit} disabled={submitting || intelData.approvalChance === 'LOW'} className="w-full py-4 bg-gray-900 hover:bg-black shadow-lg text-white rounded-xl font-bold tracking-widest uppercase transition-all disabled:opacity-50 disabled:shadow-none">
                      {submitting ? "Deploying Schema..." : "Formally Submit Claim"}
                   </button>
                   {intelData.approvalChance === 'LOW' && <p className="text-xs font-bold text-red-500 text-center mt-3 uppercase">Address bounds to unlock deployment limits natively.</p>}
              </div>
          </div>
      </div>
    </div>
  );
}
