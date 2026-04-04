import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, FileText, UploadCloud, ArrowRight } from "lucide-react";

export default function ClaimNew() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
      disease: "",
      hospital: "",
      amount: "",
      documents: [] // tracking exact tags required by intelligence
  });

  const availableDiseases = ["Appendicitis", "Kidney Stone", "Fracture", "Fever / Viral", "Cataract", "Maternity"];
  const hospitalOptions = ["Apollo City Hospital", "Max Super Specialty", "Fortis Care", "Swasthya Clinic", "AIIMS Network"];

  const handleDocToggle = (docType) => {
    setFormData(prev => {
        const hasDoc = prev.documents.includes(docType);
        if (hasDoc) {
             return { ...prev, documents: prev.documents.filter(d => d !== docType) };
        }
        return { ...prev, documents: [...prev.documents, docType] };
    });
  };

  const handleVerify = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
         const { data } = await axios.post("/api/v1/claims/check", {
             disease: formData.disease,
             amount: Number(formData.amount),
             documents: formData.documents 
         }, { withCredentials: true });

         // Store base logic mapped natively into the navigator router stream
         navigate("/patient/claims/check", { state: { intelData: data.data, formData } });
      } catch (err) {
         alert(err.response?.data?.message || "Verification Failed natively. Ensure fields are filled.");
      }
      setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in zoom-in duration-300">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-3xl text-white shadow-lg overflow-hidden relative">
         <div className="relative z-10">
            <h1 className="text-3xl font-black mb-2 flex items-center tracking-tight"><ShieldCheck className="w-8 h-8 mr-3"/> Smart Mediclaim Wizard</h1>
            <p className="opacity-80 text-lg">Input your coverage boundaries and we'll dynamically identify your approval probability instantly!</p>
         </div>
         <ShieldCheck className="absolute -bottom-10 -right-10 w-64 h-64 text-white opacity-10" />
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
         <form onSubmit={handleVerify} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Diagnosis / Procedure <span className="text-red-500">*</span></label>
                   <select required value={formData.disease} onChange={e => setFormData({...formData, disease: e.target.value})} className="w-full mt-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium">
                      <option value="" disabled>Select Target Diagnosis</option>
                      {availableDiseases.map(d => <option key={d} value={d}>{d}</option>)}
                   </select>
                </div>
                
                <div>
                   <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Hospital Network <span className="text-red-500">*</span></label>
                   <select required value={formData.hospital} onChange={e => setFormData({...formData, hospital: e.target.value})} className="w-full mt-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium">
                      <option value="" disabled>Select Medical Hub</option>
                      {hospitalOptions.map(h => <option key={h} value={h}>{h}</option>)}
                   </select>
                </div>
            </div>

            <div>
               <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Total Estimated Cost (₹) <span className="text-red-500">*</span></label>
               <input type="number" required placeholder="e.g. 50000" min="1000" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full mt-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-gray-900" />
            </div>

            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <label className="text-sm font-black text-blue-900 uppercase tracking-wide flex items-center mb-4"><UploadCloud className="w-5 h-5 mr-2" /> Upload Secure Documents</label>
                <p className="text-sm text-blue-700 mb-4 font-medium">For this hackathon demo, simply toggle the documents you "uploaded" to securely run the Rules algorithm.</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                   {["prescription", "lab_report", "bill", "id_proof"].map(docType => (
                      <button type="button" key={docType} onClick={() => handleDocToggle(docType)} className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-bold uppercase transition-all flex flex-col items-center justify-center border-2 ${formData.documents.includes(docType) ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-gray-500 border-gray-200 hover:border-blue-300'}`}>
                         <FileText className="w-6 h-6 mb-1 opacity-80" />
                         {docType.replace("_", " ")}
                      </button>
                   ))}
                </div>
            </div>

            <div className="pt-4 flex justify-between items-center border-t border-gray-100">
                 <div className="w-1/2">
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-600 w-1/2 rounded-full"></div>
                    </div>
                    <p className="text-xs text-gray-400 font-medium mt-2 uppercase tracking-widest">Step 1 of 2: AI Verification</p>
                 </div>
                 
                 <button type="submit" disabled={loading} className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 text-white rounded-xl font-bold tracking-wide flex items-center transition-all disabled:opacity-50">
                    {loading ? "Checking Rules..." : "Verify Claim Limits"} <ArrowRight className="w-5 h-5 ml-2" />
                 </button>
            </div>
         </form>
      </div>
    </div>
  );
}
