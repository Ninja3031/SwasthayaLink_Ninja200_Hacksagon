import React, { useState, useEffect, useRef } from "react";
import { Phone, PhoneOff, Video, Mic, MicOff, VideoOff, PhoneIncoming, Loader2 } from "lucide-react";

export default function VideoCallModal({ socket, currentUser, activeContact, callingTarget, setCallingTarget }) {
  const [callActive, setCallActive] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [callStatus, setCallStatus] = useState(""); // "calling...", "connecting...", "connected"
  
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);

  const ICE_SERVERS = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" }
    ],
  };

  // Listen to socket events for incoming calls and signals
  useEffect(() => {
    if (!socket) return;

    socket.on("receive-call", async (data) => {
      setIncomingCall(data);
    });

    socket.on("call-accepted", async (signal) => {
      setCallStatus("connected");
      if (peerConnectionRef.current) {
         try {
           await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(signal));
         } catch (err) {
           console.error("Failed handling remote desc", err);
         }
      }
    });

    socket.on("ice-candidate", async (candidate) => {
      if (peerConnectionRef.current) {
        try {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.error("Error adding ice candidate", e);
        }
      }
    });

    socket.on("call-rejected", () => {
      cleanupCall();
      alert("Call was rejected by the other party.");
    });

    socket.on("call-ended", () => {
      cleanupCall();
    });

    return () => {
      socket.off("receive-call");
      socket.off("call-accepted");
      socket.off("ice-candidate");
      socket.off("call-rejected");
      socket.off("call-ended");
    };
  }, [socket]);

  // Bind local/remote stream refs dynamically
  useEffect(() => {
     if (localVideoRef.current && localStream) {
        localVideoRef.current.srcObject = localStream;
     }
  }, [localStream, callActive]);

  useEffect(() => {
     if (remoteVideoRef.current && remoteStream) {
        remoteVideoRef.current.srcObject = remoteStream;
     }
  }, [remoteStream, callActive]);

  // Handle outgoing call initiation from parent component
  useEffect(() => {
    if (callingTarget && !callActive) {
      initiateCall(callingTarget);
      // Reset the prop trigger gracefully
      setCallingTarget(null);
    }
  }, [callingTarget]);

  const initWebRTC = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    setLocalStream(stream);

    const peerConnection = new RTCPeerConnection(ICE_SERVERS);
    peerConnectionRef.current = peerConnection;

    // Add local tracks to peer connection
    stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));

    // Handle remote streams securely
    peerConnection.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    return { stream, peerConnection };
  };

  const initiateCall = async (targetId) => {
    try {
      setCallActive(true);
      setCallStatus("calling...");

      const { peerConnection } = await initWebRTC();

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", { to: targetId, candidate: event.candidate });
        }
      };

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      socket.emit("call-user", {
        userToCall: targetId,
        signalData: offer,
        from: currentUser._id,
        callerName: currentUser.name
      });
    } catch (err) {
      console.error("Error initiating peer execution", err);
      cleanupCall();
    }
  };

  const answerCall = async () => {
    try {
      setCallActive(true);
      setCallStatus("connecting...");

      const { peerConnection } = await initWebRTC();

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", { to: incomingCall.from, candidate: event.candidate });
        }
      };

      await peerConnection.setRemoteDescription(new RTCSessionDescription(incomingCall.signal));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      socket.emit("accept-call", { to: incomingCall.from, signal: answer });
      setIncomingCall(null);
      setCallStatus("connected");
    } catch (err) {
      console.error("Answer bindings failed natively", err);
      cleanupCall();
    }
  };

  const rejectCall = () => {
    socket.emit("reject-call", { to: incomingCall.from });
    setIncomingCall(null);
  };

  const endCall = () => {
    // Determine the target to strictly disconnect securely
    const target = incomingCall ? incomingCall.from : (activeContact?._id);
    if (target) {
        socket.emit("end-call", { to: target });
    }
    cleanupCall();
  };

  const cleanupCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    setLocalStream(null);
    setRemoteStream(null);
    setCallActive(false);
    setCallStatus("");
    setIncomingCall(null);
  };

  const toggleMic = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setMicOn(audioTrack.enabled);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setVideoOn(videoTrack.enabled);
    }
  };

  // Render simple Incoming Call overlay dynamically
  if (incomingCall && !callActive) {
     return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-gray-100 flex flex-col items-center animate-in fade-in zoom-in duration-300">
               <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-inner relative overflow-hidden">
                   <PhoneIncoming className="w-10 h-10 text-green-600 animate-bounce" />
                   <div className="absolute inset-0 rounded-full border-4 border-green-500 animate-ping opacity-20"></div>
               </div>
               <h3 className="text-2xl font-black text-gray-900 mb-2">Incoming Video Call</h3>
               <p className="text-gray-500 font-medium mb-8 text-center">{incomingCall.callerName} is executing a priority connect.</p>
               
               <div className="flex gap-4 w-full">
                  <button onClick={rejectCall} className="flex-1 py-3 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center">
                     Reject
                  </button>
                  <button onClick={answerCall} className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-green-200 flex items-center justify-center">
                     Accept
                  </button>
               </div>
            </div>
        </div>
     );
  }

  // Render Full Active Call Mode Overlay dynamically
  if (callActive) {
     return (
        <div className="fixed inset-0 bg-gray-900 z-[9999] flex flex-col animate-in fade-in duration-300">
           {/* Top Info Bar */}
           <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center bg-gradient-to-b from-black/70 to-transparent z-10 pointer-events-none">
              <div className="flex items-center text-white">
                 <div className="w-12 h-12 bg-gray-800 rounded-full flex justify-center items-center font-bold text-lg border border-gray-700 pointer-events-auto">
                    {incomingCall?.callerName?.charAt(0) || activeContact?.name?.charAt(0) || "U"}
                 </div>
                 <div className="ml-4">
                    <h4 className="font-black text-xl tracking-tight leading-tight">{incomingCall?.callerName || activeContact?.name || "Unknown Identity"}</h4>
                    <span className="text-xs font-bold uppercase tracking-widest text-green-400 flex items-center">
                       {callStatus === 'connected' ? <><span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span> Connected Securely</> : <><Loader2 className="w-3 h-3 animate-spin mr-1"/> {callStatus}</>}
                    </span>
                 </div>
              </div>
           </div>

           {/* Video Stages */}
           <div className="flex-1 w-full flex items-center justify-center relative p-8">
               {/* Remote Video Array */}
               {remoteStream ? (
                  <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover rounded-3xl shadow-2xl border border-gray-800 bg-black"></video>
               ) : (
                  <div className="w-full h-full rounded-3xl shadow-2xl bg-gray-800 border border-gray-700 flex flex-col items-center justify-center">
                      <div className="w-24 h-24 bg-gray-700 rounded-full flex justify-center items-center mb-4 border border-gray-600">
                         <Video className="w-10 h-10 text-gray-500" />
                      </div>
                      <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Awaiting Video Node...</p>
                  </div>
               )}

               {/* Local Self-View Video PIP (Picture-in-Picture) */}
               <div className="absolute bottom-10 right-10 w-48 lg:w-64 aspect-video bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-700 overflow-hidden transform transition-all hover:scale-105">
                  <video ref={localVideoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${!videoOn ? 'opacity-0' : 'opacity-100'}`}></video>
                  {!videoOn && (
                     <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-0">
                         <p className="text-white font-bold opacity-50 text-xs">Video Paused</p>
                     </div>
                  )}
                  {/* Status Badges Overlay */}
                  <div className="absolute bottom-2 left-2 flex gap-1 z-10">
                     {!micOn && <span className="bg-red-500 text-white rounded-full p-1"><MicOff className="w-3 h-3" /></span>}
                     {!videoOn && <span className="bg-red-500 text-white rounded-full p-1"><VideoOff className="w-3 h-3" /></span>}
                  </div>
               </div>
           </div>

           {/* Floating Call Controls Dashboard */}
           <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center shadow-2xl rounded-full px-6 py-4 border border-gray-800/50 backdrop-blur-xl bg-gray-900/80 gap-6">
               <button onClick={toggleMic} className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors shadow-inner ${micOn ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-red-500/20 text-red-500 border border-red-500'}`}>
                   {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
               </button>
               
               <button onClick={endCall} className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-900 border-4 border-gray-900 shadow-2xl shadow-red-900/50 flex items-center justify-center text-white transition-transform active:scale-95 z-20">
                   <PhoneOff className="w-6 h-6" />
               </button>

               <button onClick={toggleVideo} className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors shadow-inner ${videoOn ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-red-500/20 text-red-500 border border-red-500'}`}>
                   {videoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
               </button>
           </div>
        </div>
     );
  }

  return null;
}
