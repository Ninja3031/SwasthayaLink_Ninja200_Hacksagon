import React, { useState } from "react";
import axios from "axios";
import { AlertTriangle, MapPin, PhoneCall, ShieldAlert } from "lucide-react";

export default function EmergencySOS() {
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState("");

  const triggerSOS = () => {
    setStatus("loading");
    setErrorMessage("");

    if (!navigator.geolocation) {
      setStatus("error");
      setErrorMessage("Geolocation is completely disabled or unsupported by your active browser payload.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          await axios.post("/api/v1/emergency/sos", {
            lat: latitude,
            lng: longitude
          }, { withCredentials: true });
          
          setStatus("success");
        } catch (err) {
          setStatus("error");
          setErrorMessage(err.response?.data?.message || "Failed to establish network pipeline sequence to dispatch emergency beacon.");
        }
      },
      (geoError) => {
        setStatus("error");
        setErrorMessage("Permission actively denied or GPS locked! Please check your native browser permission bounds.");
      }
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 text-center pt-8">
      <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 flex items-start text-left">
         <AlertTriangle className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" />
         <div>
            <h3 className="font-bold text-lg">Strict Emergency Module</h3>
            <p className="text-sm">This button dispatches your exact longitudinal footprint to local hospitals and emergency contacts natively. Please trigger this strictly during acute emergencies.</p>
         </div>
      </div>

      <div className="flex justify-center py-10">
        <button 
          onClick={triggerSOS}
          disabled={status === "loading" || status === "success"}
          className={`
            relative w-64 h-64 rounded-full flex flex-col items-center justify-center text-white
            shadow-2xl transition-all duration-300 transform
            ${status === "success" ? "bg-green-500 scale-100" : "bg-red-600 hover:bg-red-700 hover:scale-105 hover:shadow-red-500/50"}
            ${status === "loading" ? "animate-pulse" : ""}
          `}
        >
          {status === "idle" && (
            <>
              <ShieldAlert className="w-20 h-20 mb-2" />
              <span className="text-3xl font-black tracking-widest">SOS</span>
              <span className="text-sm font-medium mt-1 opacity-80">Tap for dispatch</span>
            </>
          )}
          {status === "loading" && (
            <>
              <MapPin className="w-16 h-16 animate-bounce mb-2" />
              <span className="text-xl font-bold">Locking GPS...</span>
            </>
          )}
          {status === "success" && (
            <>
              <PhoneCall className="w-16 h-16 mb-2" />
              <span className="text-2xl font-bold">Help is strictly</span>
              <span className="text-xl font-medium">on the way.</span>
            </>
          )}
        </button>
      </div>

      {status === "error" && (
        <div className="bg-red-100 text-red-600 font-bold p-4 rounded-xl">
           [ERROR]: {errorMessage}
        </div>
      )}
      {status === "success" && (
         <div className="bg-green-50 border border-green-200 text-green-800 font-medium p-4 rounded-xl">
           Your geographical nodes were securely registered inside the database block via the POST hook. Emergency services are dispatched dynamically!
         </div>
      )}

    </div>
  );
}
