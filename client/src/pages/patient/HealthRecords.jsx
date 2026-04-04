import React, { useState, useEffect } from "react";
import axios from "axios";
import { UploadCloud, FileText, CheckCircle, Database, ServerCog, Activity, Search, Copy } from "lucide-react";

export default function HealthRecords() {
  const [records, setRecords] = useState([]);
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState(null);
  
  // Drag State Tracker bounds
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
     fetchRecords();
  }, []);

  const fetchRecords = async () => {
      try {
         const res = await axios.get("/api/v1/records", { withCredentials: true });
         setRecords(res.data.data);
      } catch (err) {
         console.error("Fetch tracing mapping error", err);
      }
  };

  const executeOCRUpload = async () => {
      if (!file) return;
      setIsProcessing(true);
      setActiveAnalysis(null);

      const formData = new FormData();
      formData.append("recordFile", file);

      try {
         const res = await axios.post("/api/v1/records/upload", formData, { 
             withCredentials: true,
             headers: { 'Content-Type': 'multipart/form-data'}
         });
         
         const injectedResult = res.data.data;
         setActiveAnalysis(injectedResult);
         
         // Dynamically unbox file safely to prevent re-execution boundaries
         setFile(null);
         fetchRecords();
      } catch (err) {
         alert("Optical Character Recognition execution bounds failed dynamically.");
      }
      setIsProcessing(false);
  };

  const handleDragOver = (e) => {
     e.preventDefault();
     setIsDragging(true);
  };

  const handleDragLeave = (e) => {
     e.preventDefault();
     setIsDragging(false);
  };

  const handleDrop = (e) => {
     e.preventDefault();
     setIsDragging(false);
     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
         setFile(e.dataTransfer.files[0]);
     }
  };

  const copyToClipboard = (text) => {
     navigator.clipboard.writeText(text);
     alert("Extracted limits copied natively!");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center"><Activity className="w-8 h-8 mr-3 text-indigo-600"/> Smart Record Scanner</h1>
            <p className="text-gray-500 mt-1 font-medium">Upload physical prescriptions. Let Tesseract OCR extract structural data natively.</p>
          </div>
          <p className="bg-indigo-50 border border-indigo-200 text-indigo-700 font-black text-xs px-4 py-2 rounded-xl flex items-center uppercase tracking-widest"><ServerCog className="w-4 h-4 mr-2"/> Tesseract OCR Active</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Uploader Column */}
          <div className="lg:col-span-1 space-y-6">
               <div 
                   onDragOver={handleDragOver}
                   onDragLeave={handleDragLeave}
                   onDrop={handleDrop}
                   className={`bg-white p-8 rounded-3xl shadow-sm border-2 border-dashed transition-all text-center flex flex-col items-center justify-center min-h-[300px] ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`}
               >
                   <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                      <UploadCloud className="w-10 h-10 text-indigo-600" />
                   </div>
                   <h3 className="text-lg font-black text-gray-900 mb-2">Drag Prescription Here</h3>
                   <p className="text-sm font-medium text-gray-400 mb-6">JPG, PNG, or PDF formats allowed.</p>
                   
                   <label className="bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-xl font-bold cursor-pointer transition-colors shadow-md">
                      Browse Files
                      <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => setFile(e.target.files[0])} />
                   </label>

                   {file && (
                      <div className="mt-8 bg-indigo-100/50 p-4 rounded-xl border border-indigo-200 w-full flex items-center justify-between animate-in fade-in zoom-in">
                         <div className="flex items-center truncate">
                            <FileText className="w-5 h-5 mr-3 text-indigo-600 flex-shrink-0" />
                            <p className="text-sm font-bold text-indigo-900 truncate">{file.name}</p>
                         </div>
                         <button onClick={() => setFile(null)} className="text-indigo-400 hover:text-red-500 ml-4 font-black">X</button>
                      </div>
                   )}
               </div>

               <button 
                  onClick={executeOCRUpload} 
                  disabled={!file || isProcessing}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center"
               >
                  {isProcessing ? (
                     <><ServerCog className="w-5 h-5 mr-3 animate-spin"/> MAPPING OCR...</>
                  ) : "Execute OCR Parse"}
               </button>

               <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mt-8">
                   <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest border-b border-gray-100 pb-3 mb-4 flex items-center"><Database className="w-4 h-4 mr-2"/> Historic Logs</h3>
                   <div className="space-y-3 max-h-[300px] overflow-y-auto">
                       {records.map(rec => (
                          <div key={rec._id} onClick={() => setActiveAnalysis(rec)} className="p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer transition-colors flex flex-col items-start gap-1">
                             <div className="flex justify-between w-full">
                                <span className="text-xs font-black uppercase tracking-wider text-indigo-600">{rec.documentType}</span>
                                <span className="text-xs font-bold text-gray-400">{new Date(rec.createdAt).toLocaleDateString()}</span>
                             </div>
                             <p className="text-sm font-bold text-gray-800 line-clamp-1">{rec.structuredData?.patientName || "Unknown Execution"}</p>
                          </div>
                       ))}
                       {records.length === 0 && <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mt-4">No Transcriptions Logged</p>}
                   </div>
               </div>
          </div>

          {/* Visualization Column: Split Viewer */}
          <div className="lg:col-span-2">
             {activeAnalysis ? (
                 <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-[700px] flex flex-col animate-in fade-in slide-in-from-right-8 duration-500">
                     
                     <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                         <div>
                            <h2 className="text-xl font-black text-gray-900 flex items-center"><CheckCircle className="text-green-500 w-6 h-6 mr-3"/> Analysis Executed Successfully</h2>
                            <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest ml-9">Trace: {activeAnalysis._id}</p>
                         </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100 flex-1">
                         
                         {/* Raw Terminal bounds */}
                         <div className="p-6 bg-gray-900 text-green-400 flex flex-col relative w-full h-full max-h-[600px]">
                            <div className="flex justify-between items-center mb-4 sticky top-0 bg-gray-900 pb-2 z-10">
                               <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center">
                                  <Search className="w-4 h-4 mr-2"/> Raw OCR Terminal Transcript
                               </h3>
                               <button onClick={() => copyToClipboard(activeAnalysis.extractedText)} className="text-gray-400 hover:text-white transition-colors"><Copy className="w-4 h-4"/></button>
                            </div>
                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                <p className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
                                   {activeAnalysis.extractedText || "No text parsed seamlessly."}
                                </p>
                            </div>
                         </div>

                         {/* Structured Mapping JSON constraints */}
                         <div className="p-6 bg-white w-full h-full max-h-[600px] overflow-y-auto">
                            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6">Structured NLP Ingestion Map</h3>
                            
                            <div className="space-y-6">
                               <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/50">
                                  <p className="text-xs font-black uppercase text-indigo-400 tracking-wider mb-1">Identified Patient Name</p>
                                  <p className="text-lg font-black text-indigo-900">{activeAnalysis.structuredData?.patientName}</p>
                               </div>

                               <div className="grid grid-cols-2 gap-4">
                                   <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                                      <p className="text-xs font-black uppercase text-gray-400 tracking-wider mb-1">Prescribing Doctor</p>
                                      <p className="font-bold text-gray-900">{activeAnalysis.structuredData?.doctor}</p>
                                   </div>
                                   <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                                      <p className="text-xs font-black uppercase text-gray-400 tracking-wider mb-1">Transcript Date</p>
                                      <p className="font-bold text-gray-900">{activeAnalysis.structuredData?.date}</p>
                                   </div>
                               </div>

                               <div>
                                  <p className="text-xs font-black uppercase text-gray-400 tracking-wider mb-3 border-b border-gray-100 pb-2">Medical Identifications Plucked</p>
                                  {activeAnalysis.structuredData?.medicines?.length > 0 ? (
                                      <div className="space-y-2">
                                          {activeAnalysis.structuredData.medicines.map((med, i) => (
                                              <div key={i} className="p-3 bg-green-50 border border-green-200 text-green-800 font-bold text-sm rounded-lg flex items-start">
                                                  <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 opacity-70" /> {med}
                                              </div>
                                          ))}
                                      </div>
                                  ) : (
                                      <div className="p-4 bg-gray-50 border border-gray-100 text-gray-500 font-bold text-sm rounded-xl text-center">
                                         No explicitly formatted medications extracted algorithmically.
                                      </div>
                                  )}
                               </div>
                            </div>
                         </div>
                     </div>
                 </div>
             ) : (
                 <div className="bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 min-h-[700px] flex flex-col items-center justify-center text-center p-8">
                     <Search className="w-16 h-16 text-gray-300 mb-6" />
                     <h2 className="text-2xl font-black text-gray-800 mb-2">No Active Context Mounted</h2>
                     <p className="text-gray-500 font-medium">Upload a document to automatically populate structural intelligence outputs seamlessly alongside raw Tesseract data flows.</p>
                 </div>
             )}
          </div>
      </div>

    </div>
  );
}
