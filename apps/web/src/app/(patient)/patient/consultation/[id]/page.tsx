'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  PhoneOff,
  MessageSquare,
  Upload,
  Image as ImageIcon,
  Send,
  AlertTriangle,
  ShieldCheck,
  User,
  Clock,
  CheckCircle2,
  FileText,
  PhoneCall,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'DOCTOR' | 'PATIENT' | 'SYSTEM';
  text: string;
  timestamp: string;
}

export default function PatientConsultationRoomPage() {
  const params = useParams();
  const router = useRouter();
  const encounterId = params?.id || 'enc-live-01';

  // Lobby Queue vs Active Consultation toggle
  const [roomStage, setRoomStage] = useState<'LOBBY' | 'ACTIVE'>('ACTIVE');

  // Video/Audio Controls
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [callDuration, setCallDuration] = useState(142); // in seconds
  const [isCallActive, setIsCallActive] = useState(true);

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'SYSTEM',
      text: 'Encrypted Telemedicine Session established under NDPR guidelines. Doctor Dr. Chidi Okafor (LOC-8492, MDCN-78320) has entered the room.',
      timestamp: '14:02',
    },
    {
      id: '2',
      sender: 'DOCTOR',
      text: 'Hello Amaka, I see your intake notes mentioning a persistent sore throat and fever for 2 days. Can you tell me more about how you feel right now?',
      timestamp: '14:03',
    },
    {
      id: '3',
      sender: 'PATIENT',
      text: 'Good afternoon Dr. Okafor. Yes, it hurts to swallow and I had a low fever yesterday evening. No chest pain or breathing issues.',
      timestamp: '14:04',
    },
  ]);
  const [newInputText, setNewInputText] = useState('');

  // Symptom / Rash Image Uploader State
  const [uploadedPhotos, setUploadedPhotos] = useState<
    Array<{ id: string; url: string; caption: string; uploadedAt: string }>
  >([
    {
      id: 'photo-1',
      url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80',
      caption: 'Throat redness & tonsillar swelling (Day 2)',
      uploadedAt: '14:05',
    },
  ]);
  const [photoCaption, setPhotoCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Timer counter
  useEffect(() => {
    if (!isCallActive) return;
    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isCallActive]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInputText.trim()) return;
    const newMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'PATIENT',
      text: newInputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prev) => [...prev, newMsg]);
    setNewInputText('');
  };

  const handleSimulatedPhotoUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setTimeout(() => {
      setUploadedPhotos((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          url: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=400&q=80',
          caption: photoCaption || 'Skin rash / clinical observation upload',
          uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setPhotoCaption('');
      setIsUploading(false);
    }, 800);
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    alert('Consultation encounter concluded. Redirecting to your Medical Records & E-Prescription.');
    router.push('/patient/records');
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Session Top Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#efeeeb] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#31ce01] animate-ping" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg text-[#080331]">
                {roomStage === 'LOBBY' ? 'Waiting Lobby Queue' : 'Live Consultation'}
              </span>
              <span className="font-mono text-xs bg-[#e1f4df] text-[#0f3e17] px-2 py-0.5 rounded font-bold">
                {encounterId}
              </span>
            </div>
            <p className="text-xs text-[#747679]">
              Provider: <strong>Dr. Chidi Okafor</strong> (MDCN-78320 • Locum ID LOC-9941)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setRoomStage(roomStage === 'LOBBY' ? 'ACTIVE' : 'LOBBY')}
            className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-[#ebf0f8] text-[#4865ff] border border-[#4865ff]/25 hover:brightness-95 transition"
          >
            {roomStage === 'LOBBY' ? 'Simulate Doctor Join →' : 'Preview Lobby View'}
          </button>

          <div className="flex items-center gap-1.5 bg-[#f8f3eb] px-3 py-1.5 rounded-full border border-neutral-200 text-xs font-mono font-bold text-[#080331]">
            <Clock className="w-3.5 h-3.5 text-[#ff643b]" />
            <span>{formatTimer(callDuration)}</span>
          </div>

          <a
            href="tel:112"
            className="inline-flex items-center gap-1 text-[11px] bg-[#ffede8] text-[#ff643b] px-3 py-1.5 rounded-full font-semibold border border-[#ff643b]/30 hover:brightness-95 transition"
          >
            <AlertTriangle className="w-3 h-3" />
            <span>Emergency 112</span>
          </a>
        </div>
      </div>

      {/* Lobby Queue View (Sitemap Section 3.2.4) */}
      {roomStage === 'LOBBY' && (
        <div className="bg-[#0a3922] text-white rounded-[32px] p-8 md:p-12 border border-[#0f3e17] shadow-lg text-center max-w-2xl mx-auto space-y-6">
          <span className="inline-flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[#d2f2e3]">
            <span className="w-2 h-2 rounded-full bg-[#31ce01] animate-ping" />
            Live Redis Queue • Push Notifications Active
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal">
            You are <span className="text-[#ff643b]">#2</span> in the Lobby Queue
          </h2>
          <p className="text-sm text-[#cfe7d3] max-w-md mx-auto leading-relaxed">
            Estimated wait time: <strong>~4 minutes</strong>. You will receive an instant push & audio alert as soon as Dr. Chidi Okafor joins your encrypted consultation room.
          </p>
          <button
            type="button"
            onClick={() => setRoomStage('ACTIVE')}
            className="bg-[#ff643b] text-white px-7 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:brightness-105 transition shadow-md"
          >
            Enter Active Consultation Room Now
          </button>
        </div>
      )}

      {/* Main Grid: Video Stream + Clinical Chat & Rash Uploader */}
      {roomStage === 'ACTIVE' && (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Video SDK Container (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-4/3 sm:aspect-16/10 bg-[#0a3922] rounded-3xl overflow-hidden shadow-[0_16px_32px_rgba(75,68,57,0.12)] flex items-center justify-center border border-[#0f3e17]/20">
            {/* Remote Doctor Feed (Mock representation) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white space-y-3">
              <div className="w-24 h-24 rounded-full bg-[#1b1463] border-4 border-[#31ce01] flex items-center justify-center text-3xl font-serif text-white shadow-lg">
                👨🏾‍⚕️
              </div>
              <div>
                <h3 className="font-serif text-2xl text-white">Dr. Chidi Okafor</h3>
                <span className="text-xs text-[#d2f2e3] font-medium block">
                  Senior Clinical Consultant • MDCN #78320
                </span>
                <span className="inline-block mt-1 text-[10px] bg-[#31ce01]/20 text-[#31ce01] border border-[#31ce01]/30 px-2.5 py-0.5 rounded-full font-mono">
                  HD WebRTC Encrypted Stream
                </span>
              </div>
            </div>

            {/* Local Patient Self-View (Picture-in-Picture) */}
            <div className="absolute top-4 right-4 w-32 sm:w-40 aspect-4/3 bg-[#222326] rounded-2xl overflow-hidden border-2 border-white/40 shadow-md flex items-center justify-center">
              {isVideoOn ? (
                <div className="text-center p-2">
                  <div className="text-2xl">👩🏾</div>
                  <span className="text-[10px] text-white/90 block font-medium">You (Amaka)</span>
                </div>
              ) : (
                <div className="text-[10px] text-white/60">Camera Off</div>
              )}
            </div>

            {/* In-Call Controls Floating Capsule */}
            <div className="absolute bottom-6 inset-x-0 flex items-center justify-center gap-3 z-20 px-4">
              <div className="bg-black/70 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 flex items-center gap-3 shadow-lg">
                <button
                  type="button"
                  onClick={() => setIsMicOn(!isMicOn)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                    isMicOn
                      ? 'bg-white/20 text-white hover:bg-white/30'
                      : 'bg-[#ff643b] text-white'
                  }`}
                  title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
                >
                  {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                    isVideoOn
                      ? 'bg-white/20 text-white hover:bg-white/30'
                      : 'bg-[#ff643b] text-white'
                  }`}
                  title={isVideoOn ? 'Turn Camera Off' : 'Turn Camera On'}
                >
                  {isVideoOn ? <VideoIcon className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </button>

                <div className="w-px h-6 bg-white/20 mx-1" />

                <button
                  type="button"
                  onClick={handleEndCall}
                  className="bg-[#ff643b] text-white px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 hover:brightness-110 transition shadow-xs"
                >
                  <PhoneOff className="w-3.5 h-3.5" />
                  <span>Leave Encounter</span>
                </button>
              </div>
            </div>
          </div>

          {/* Rash / Symptom Photos Drawer */}
          <div className="bg-white rounded-3xl p-6 border border-[#efeeeb] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#4865ff]" />
                <h3 className="font-serif text-lg text-[#080331]">Rash & Clinical Photo Uploads</h3>
              </div>
              <span className="text-[10px] text-[#747679]">Visible to your doctor in real time</span>
            </div>

            {/* Existing Uploaded Photos */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {uploadedPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="rounded-xl overflow-hidden border border-neutral-200 bg-[#f8f3eb] group relative"
                >
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-24 object-cover"
                  />
                  <div className="p-2 text-[10px] leading-tight text-[#080331] font-medium bg-white">
                    {photo.caption}
                    <span className="text-[9px] text-[#747679] block mt-0.5">{photo.uploadedAt}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Upload Form */}
            <form onSubmit={handleSimulatedPhotoUpload} className="flex gap-2 pt-2">
              <input
                type="text"
                value={photoCaption}
                onChange={(e) => setPhotoCaption(e.target.value)}
                placeholder="Describe image (e.g. skin redness on inner elbow)"
                className="flex-1 text-xs border border-neutral-200 rounded-xl px-3 py-2 bg-[#f8f3eb]/30 focus:outline-none focus:border-[#4865ff]"
              />
              <button
                type="submit"
                disabled={isUploading}
                className="bg-[#0a3922] text-white px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#0f3e17] transition"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploading ? 'Uploading...' : 'Attach'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Real-Time Chat Sidebar (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#efeeeb] shadow-[0_8px_24px_rgba(75,68,57,0.06)] flex flex-col h-[650px] overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-[#f8f3eb]/40">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#0a3922]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#080331]">
                Encounter Chat & Doctor Notes
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#31ce01] bg-[#e1f4df] px-2 py-0.5 rounded-full font-bold">
              Secure Channel
            </span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {chatMessages.map((msg) => {
              if (msg.sender === 'SYSTEM') {
                return (
                  <div
                    key={msg.id}
                    className="p-2.5 rounded-xl bg-[#ebf0f8] border border-[#4865ff]/20 text-[#080331] text-[11px] leading-relaxed"
                  >
                    <span className="font-semibold text-[#4865ff] block mb-0.5">Clinical Protocol Notice</span>
                    {msg.text}
                  </div>
                );
              }
              const isPatient = msg.sender === 'PATIENT';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isPatient ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1 text-[10px] text-[#747679] mb-1">
                    <span>{isPatient ? 'You' : 'Dr. Chidi Okafor'}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <div
                    className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                      isPatient
                        ? 'bg-[#0a3922] text-[#fffefc] rounded-tr-none'
                        : 'bg-[#f8f3eb] text-[#222326] border border-neutral-200 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input Box */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-neutral-100 bg-white flex items-center gap-2"
          >
            <input
              type="text"
              value={newInputText}
              onChange={(e) => setNewInputText(e.target.value)}
              placeholder="Type message to Dr. Okafor..."
              className="flex-1 text-xs border border-neutral-200 rounded-xl px-3.5 py-2.5 bg-[#f8f3eb]/20 focus:outline-none focus:border-[#4865ff]"
            />
            <button
              type="submit"
              className="bg-[#0a3922] text-white p-2.5 rounded-xl hover:bg-[#0f3e17] transition shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
      )}
    </div>
  );
}
