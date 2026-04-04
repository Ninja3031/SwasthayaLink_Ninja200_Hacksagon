import React, { useState, useEffect } from "react";
import axios from "axios";
import { AlertTriangle, MapPin, Activity, Navigation } from "lucide-react";

export default function EmergencyAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Poll exactly every 10 seconds checking native signals (in lieu of WebSockets for scope boundaries constraints)
  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await axios.get("/api/v1/emergency/alerts", { withCredentials: true });
      setAlerts(res.data.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-100 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <AlertTriangle className="w-8 h-8 mr-3 text-red-600" />
          Active Emergency Alerts
        </h1>
        <p className="text-gray-500 mt-2">Monitoring native SOS Dispatch webhooks dynamically.</p>
      </div>

      {loading ? (
         <div className="p-8 text-center text-gray-500 font-bold animate-pulse">Syncing nodes...</div>
      ) : alerts.length === 0 ? (
         <div className="p-16 border-2 border-dashed border-gray-200 rounded-3xl text-center bg-gray-50">
            <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-500">No Active SOS Dispatch requests mapping to your Hospital bounds currently.</h2>
         </div>
      ) : (
         <div className="grid grid-cols-1 gap-6">
            {alerts.map(alert => (
               <div key={alert._id} className="bg-red-50 border-2 border-red-500 rounded-2xl shadow-xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-red-600 text-white font-black text-xs uppercase px-4 py-1 tracking-widest rounded-bl-xl shadow-sm">
                    Active Extraction Map
                  </div>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                     <div>
                        <h2 className="text-2xl font-black text-red-900 mb-1 flex items-center">
                          {alert.patientId?.name || "Unregistered Patient Node"} 
                        </h2>
                        <div className="space-y-1 text-sm text-red-800 font-medium">
                           <p><strong>Contact Lock:</strong> {alert.patientId?.contactNumber || "N/A"}</p>
                           <p><strong>Dispatch Hash:</strong> {new Date(alert.createdAt).toLocaleString()}</p>
                           {alert.patientId?.emergencyContacts && alert.patientId.emergencyContacts.length > 0 && (
                             <p><strong>Emergency Contact Bound:</strong> {alert.patientId.emergencyContacts[0].name} ({alert.patientId.emergencyContacts[0].phone})</p>
                           )}
                        </div>
                     </div>
                     <div className="mt-6 md:mt-0 bg-white p-4 rounded-xl border border-red-200 shadow-sm text-center">
                        <MapPin className="w-8 h-8 text-red-500 mx-auto mb-2" />
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Live Coordinates</p>
                        <p className="font-mono text-sm text-gray-800">LAT: {alert.location.lat.toFixed(4)}</p>
                        <p className="font-mono text-sm text-gray-800">LNG: {alert.location.lng.toFixed(4)}</p>
                        <a href={`https://maps.google.com/?q=${alert.location.lat},${alert.location.lng}`} target="_blank" rel="noreferrer" className="mt-3 block bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-lg text-xs font-bold transition-colors">
                           <Navigation className="w-4 h-4 inline mr-1" /> Open Maps Framework
                        </a>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      )}
    </div>
  );
}
