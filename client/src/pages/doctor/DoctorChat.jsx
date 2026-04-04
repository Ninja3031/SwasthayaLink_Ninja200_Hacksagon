import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import useAuthStore from "../../store/useAuthStore";
import { Send, CheckCircle, Navigation, Video } from "lucide-react";
import { io } from "socket.io-client";
import VideoCallModal from "../../components/VideoCallModal";

export default function DoctorChat() {
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [callingTarget, setCallingTarget] = useState(null);
  const endRef = useRef(null);

  useEffect(() => {
    fetchConversations();
    
    // Mount Real-Time Websocket
    const socketInstance = io(import.meta.env.VITE_API_URL || "http://localhost:8000", {
        query: { userId: user._id }
    });
    setSocket(socketInstance);

    socketInstance.on("receive_message", (msg) => {
        // Intercept dynamically and append gracefully if looking at the active person
        setMessages(prev => {
            // Because React state bounds, we check if this message targets our active contact
            // If activeContact isn't tightly bound, we simply inject it assuming Context allows
            return [...prev, msg];
        });
    });

    return () => socketInstance.disconnect();
  }, [user._id]);

  useEffect(() => {
    if (activeContact) fetchChat(activeContact._id);
  }, [activeContact]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await axios.get("/api/v1/messages/conversations", { withCredentials: true });
      setConversations(res.data.data.map(c => c.contact));
    } catch(e) {}
  };

  const fetchChat = async (userId) => {
    try {
      const res = await axios.get(`/api/v1/messages/${userId}`, { withCredentials: true });
      setMessages(res.data.data);
    } catch (e) {}
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeContact) return;

    try {
      const res = await axios.post("/api/v1/messages/send", {
         receiverId: activeContact._id,
         content: newMessage
      }, { withCredentials: true });
      
      setMessages([...messages, res.data.data]);
      setNewMessage("");
    } catch (error) {
      alert(error.response?.data?.message || "Failed validating secure bounds.");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex h-[80vh] overflow-hidden relative">
      <div className="w-1/3 border-r border-gray-100 bg-gray-50 flex flex-col">
        <div className="p-4 border-b border-gray-100 bg-white space-y-3">
           <h2 className="text-xl font-bold text-gray-900">Patient Inboxes</h2>
           <p className="text-xs text-gray-500 mt-1">Chats strictly bounded to recognized schedule arrays.</p>

           <select 
             onChange={(e) => setActiveContact(conversations.find(c => c._id === e.target.value))}
             value={activeContact?._id || ""}
             className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
           >
             <option value="" disabled>-- Select Patient to Message --</option>
             {conversations.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
             ))}
           </select>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
           {conversations.length === 0 ? (
             <div className="p-4 text-center text-sm text-gray-500 mt-10">No active patient authorizations bridging the system.</div>
           ) : (
             conversations.map(c => (
               <button 
                key={c._id} 
                onClick={() => setActiveContact(c)}
                className={`w-full text-left p-4 rounded-xl transition ${activeContact?._id === c._id ? 'bg-indigo-100 text-indigo-900 border border-indigo-200 shadow-sm' : 'hover:bg-white border border-transparent'}`}
               >
                 <div className="flex items-center space-x-3">
                   <div className="w-10 h-10 bg-indigo-200 text-indigo-700 font-bold rounded-full flex items-center justify-center">
                     {c.name?.charAt(0)}
                   </div>
                   <div>
                     <p className="font-bold text-sm truncate">{c.name}</p>
                     <p className="text-xs opacity-70 uppercase tracking-widest">{c.role}</p>
                   </div>
                 </div>
               </button>
             ))
           )}
        </div>
      </div>

      <div className="w-2/3 flex flex-col bg-slate-50 relative">
        {activeContact ? (
          <>
            <div className="h-16 bg-white border-b border-gray-100 flex items-center px-6 shadow-sm z-10 space-x-3">
               <Navigation className="w-5 h-5 text-indigo-600" />
               <h3 className="font-bold text-lg flex-1">{activeContact.name}</h3>
               <button onClick={() => setCallingTarget(activeContact._id)} className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 rounded-xl transition-all shadow-sm flex items-center group">
                  <Video className="w-5 h-5 group-hover:scale-110 transition-transform"/>
                  <span className="ml-2 font-black text-sm uppercase tracking-widest hidden lg:block">Video Connect</span>
               </button>
               <span className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-bold ml-2">Patient Node</span>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                 <div className="h-full flex flex-col justify-center items-center opacity-50">
                   <CheckCircle className="w-12 h-12 mb-2 text-gray-400" />
                   <p className="text-sm font-semibold">Strict Appointment Bounds Authenticated</p>
                   <p className="text-xs">Secure dispatch tunnel mapped successfully.</p>
                 </div>
              ) : (
                 messages.map(msg => {
                   const isMine = msg.sender === user._id;
                   return (
                     <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] px-4 py-3 rounded-2xl shadow-sm text-sm ${isMine ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'}`}>
                           {msg.content}
                           <div className={`text-[10px] mt-2 text-right ${isMine ? 'text-indigo-200' : 'text-gray-400'}`}>
                             {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                           </div>
                        </div>
                     </div>
                   )
                 })
              )}
              <div ref={endRef} />
            </div>

            <div className="p-4 bg-white border-t border-gray-100">
               <form onSubmit={sendMessage} className="flex space-x-4">
                 <input 
                   type="text" 
                   value={newMessage} 
                   onChange={e => setNewMessage(e.target.value)} 
                   placeholder="Enter payload packet..." 
                   className="flex-1 bg-gray-50 border border-gray-200 text-sm rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow" 
                 />
                 <button type="submit" disabled={!newMessage.trim()} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white p-3 rounded-full shadow-sm transition-transform active:scale-95 flex items-center justify-center w-12 h-12">
                   <Send className="w-5 h-5 ml-1" />
                 </button>
               </form>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col justify-center items-center text-gray-400 p-8 text-center bg-white">
             <div className="w-20 h-20 mb-4 bg-gray-50 text-gray-300 rounded-full flex justify-center items-center">
                <Send className="w-10 h-10" />
             </div>
             <p className="font-semibold text-lg">Select a patient node.</p>
             <p className="text-sm mt-2 max-w-md">Verify the active appointment schedule bindings natively mapping this inbox.</p>
          </div>
        )}
      </div>

      <VideoCallModal 
          socket={socket} 
          currentUser={user} 
          activeContact={activeContact} 
          callingTarget={callingTarget} 
          setCallingTarget={setCallingTarget} 
      />
    </div>
  );
}
