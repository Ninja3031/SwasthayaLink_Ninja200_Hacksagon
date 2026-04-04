import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Pill, FileText, CheckCircle, Clock, AlertTriangle, ArrowRight, DollarSign } from "lucide-react";
import useAuthStore from "../../store/useAuthStore";

export default function Medications() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Alternative Search State mappings inline to the specific medication
  const [activeAlternativeId, setActiveAlternativeId] = useState(null); 
  const [alternativesData, setAlternativesData] = useState(null);
  const [findingAlternative, setFindingAlternative] = useState(false);

  // Manual generic search
  const [manualSearch, setManualSearch] = useState("");
  const [manualResults, setManualResults] = useState(null);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const res = await axios.get("/api/v1/patient/prescriptions", { withCredentials: true });
      setPrescriptions(res.data.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleFindAlternatives = async (medName, medId) => {
    if(activeAlternativeId === medId) {
      // Toggle off if already active
      setActiveAlternativeId(null);
      return;
    }

    setActiveAlternativeId(medId);
    setFindingAlternative(true);
    try {
      const res = await axios.get(`/api/medicines/jan-alternative/${encodeURIComponent(medName)}`, { withCredentials: true });
      if(res.data.error) {
         setAlternativesData({ error: res.data.error });
      } else {
         setAlternativesData(res.data);
      }
    } catch (err) {
      setAlternativesData({ error: "Could not map medication parameters." });
    }
    setFindingAlternative(false);
  };

  const doManualSearch = async (e) => {
    e.preventDefault();
    if(!manualSearch) return;
    try {
      const res = await axios.get(`/api/medicines/jan-alternative/${encodeURIComponent(manualSearch)}`, { withCredentials: true });
      setManualResults(res.data);
    } catch(err) {
      setManualResults({ error: "No generics found for this term."});
    }
  };

  return (
    <div className="space-y-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medications Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage active prescriptions and find low-cost Jan Aushadhi alternatives.</p>
        </div>
      </div>

      {/* Manual Search Module */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 shadow-sm">
         <h2 className="text-lg font-bold text-blue-900 flex items-center mb-4"><Search className="w-5 h-5 mr-2" /> Global Alternative Search</h2>
         <form onSubmit={doManualSearch} className="flex gap-3">
            <input type="text" placeholder="Search any medicine name (e.g. Crocin, Augmentin)..." value={manualSearch} onChange={e => setManualSearch(e.target.value)} className="flex-1 px-4 py-3 border border-blue-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-colors">Search</button>
         </form>

         {manualResults && (
           <div className="mt-6 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
             {manualResults.error ? (
               <div className="text-amber-600 flex items-center"><AlertTriangle className="w-5 h-5 mr-2"/> {manualResults.error}</div>
             ) : (
               <div>
                  <h3 className="font-bold text-gray-900 mb-2">Target Match: <span className="text-blue-600">{manualResults.searchedDrug}</span></h3>
                  <p className="text-sm text-gray-600 mb-3 font-mono bg-gray-50 p-2 rounded">Composition: {manualResults.genericComposition}</p>
                  
                  {manualResults.cheapestAlternative ? (
                     <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex justify-between items-center shadow-sm">
                        <div>
                           <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-1 flex items-center"><DollarSign className="w-4 h-4 mr-1"/> Lowest Jan Aushadhi Generic</p>
                           <p className="font-bold text-gray-900 text-lg">{manualResults.cheapestAlternative.name}</p>
                           <p className="text-sm text-gray-500">{manualResults.cheapestAlternative.manufacturer}</p>
                        </div>
                        <div className="text-right">
                           <span className="bg-green-600 text-white font-black px-4 py-2 rounded-full text-xl shadow-lg">₹{manualResults.cheapestAlternative.price}</span>
                        </div>
                     </div>
                  ) : (
                     <p className="text-sm text-gray-500 italic">No cost structure found.</p>
                  )}
                  <p className="text-xs text-blue-800 mt-3">{manualResults.note}</p>
               </div>
             )}
           </div>
         )}
      </div>

      {/* Prescriptions List */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 border-b border-gray-100 pb-2">Your Prescriptions</h2>
      
      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading Prescriptions...</div>
      ) : prescriptions.length === 0 ? (
        <div className="bg-gray-50 py-16 text-center rounded-2xl border border-gray-100">
           <Pill className="w-16 h-16 text-gray-300 mx-auto mb-4" />
           <h3 className="text-xl font-bold text-gray-700">No active medications</h3>
           <p className="text-gray-500 mt-2">Any assignments generated by your doctor will populate here automatically.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {prescriptions.map(prescription => (
            <div key={prescription._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                     <FileText className="text-blue-500 w-5 h-5"/>
                     <div>
                       <p className="text-sm text-gray-500">Prescription Date</p>
                       <p className="font-semibold text-gray-900">{new Date(prescription.createdAt).toLocaleDateString()}</p>
                     </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Prescribed by</p>
                    <p className="font-bold text-gray-900">Dr. {prescription.doctor?.user?.name || "Clinic"}</p>
                  </div>
               </div>

               <div className="p-6">
                 {prescription.notes && (
                   <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-100">
                     <p className="text-sm text-amber-800 font-medium">Doctor's Note: <span className="font-normal">{prescription.notes}</span></p>
                   </div>
                 )}

                 <div className="space-y-4">
                   {prescription.medications.map((med, index) => {
                     const uniqueId = `${prescription._id}_${index}`;
                     const isActive = activeAlternativeId === uniqueId;

                     return (
                      <div key={index} className="border border-gray-100 rounded-xl p-5 hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                             <div className="flex items-center space-x-3 mb-1">
                               <h3 className="text-xl font-bold text-gray-900">{med.name}</h3>
                               <span className={`px-2 py-0.5 text-xs font-semibold rounded ${med.status === 'completed' ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'}`}>
                                 {med.status.toUpperCase()}
                               </span>
                             </div>
                             {med.composition && <p className="text-sm text-gray-500 mb-2">Composition: {med.composition}</p>}
                             <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-1 text-blue-500"/> {med.dosage}</span>
                                <span className="flex items-center"><Clock className="w-4 h-4 mr-1 text-blue-500"/> {med.frequency} for {med.duration}</span>
                             </div>
                          </div>
                          <div>
                            <button onClick={() => handleFindAlternatives(med.name, uniqueId)} className={`flex items-center px-4 py-2 border rounded-lg font-medium transition-colors ${isActive ? 'bg-green-50 border-green-200 text-green-700' : 'border-gray-200 text-gray-700 hover:bg-white hover:border-green-400 hover:text-green-600 shadow-sm'}`}>
                               {isActive ? "Close Alternatives" : "Find Equivalents" } <ArrowRight className="w-4 h-4 ml-2" />
                            </button>
                          </div>
                        </div>

                        {/* Dropdown Alternatives Display */}
                        {isActive && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                             {findingAlternative ? (
                               <p className="text-center text-gray-500 text-sm italic">Scanning Jan Aushadhi database...</p>
                             ) : alternativesData?.error ? (
                               <p className="text-amber-600 text-sm font-medium p-3 bg-amber-50 rounded-lg">{alternativesData.error}</p>
                             ) : alternativesData?.cheapestAlternative ? (
                               <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                                  <p className="text-xs font-bold uppercase tracking-wider text-green-800 mb-3">Govt. Verified Alternatives</p>
                                  <p className="text-sm text-gray-600 mb-3"><span className="font-semibold text-gray-900">Generic Formula:</span> {alternativesData.genericComposition}</p>
                                  
                                  <div className="space-y-2">
                                        <div className="flex justify-between items-center bg-white p-3 rounded-lg border-2 border-green-400 shadow-sm">
                                           <div>
                                             <div className="text-[10px] font-black text-white bg-green-500 px-2 py-0.5 rounded uppercase tracking-wider inline-block mb-1">Cheapest Available</div>
                                             <p className="font-bold text-gray-900">{alternativesData.cheapestAlternative.name}</p>
                                             <p className="text-xs text-gray-500">{alternativesData.cheapestAlternative.manufacturer}</p>
                                           </div>
                                           <div className="text-right flex flex-col items-end">
                                             <span className="text-green-800 font-black bg-green-100 px-3 py-1 rounded-full text-lg shadow-sm">
                                                 ₹{alternativesData.cheapestAlternative.price}
                                             </span>
                                           </div>
                                        </div>
                                  </div>
                                  <p className="text-xs text-green-800 mt-3 pt-3 border-t border-green-200">{alternativesData.note}</p>
                               </div>
                             ) : (
                               <p className="text-gray-500 text-sm italic">No verified alternatives found for exactly this composition block.</p>
                             )}
                          </div>
                        )}

                      </div>
                     );
                   })}
                 </div>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
