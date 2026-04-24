import { MessageCircle, X, Send, Loader as Loader2, UserCheck } from 'lucide-react';
import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import {
  getOrCreateVisitorId,
  createChatSession,
  getActiveSession,
  sendMessage,
  getMessages,
} from '../services/liveChatService';
import { LiveChatMessage } from '../types';
import logoImg from '../assets/transparentlogo.png';
import { supabase } from '../lib/supabase';

function formatTime(date: Date | string) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

type Mode = 'idle' | 'waiting' | 'live';

export function ChatBubble() {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [mode, setMode] = useState<Mode>('idle');
  const [starting, setStarting] = useState(false);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [liveMessages, setLiveMessages] = useState<LiveChatMessage[]>([]);
  const [liveInput, setLiveInput] = useState('');
  const [liveSending, setLiveSending] = useState(false);
  const [agentOnline, setAgentOnline] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const liveInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && mode === 'live') {
      setTimeout(() => liveInputRef.current?.focus(), 150);
    }
  }, [open, mode]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [liveMessages, mode]);

  useEffect(() => {
    const visitorId = getOrCreateVisitorId();
    getActiveSession(visitorId).then((session) => {
      if (session) {
        setSessionId(session.id);
        setMode(session.status === 'waiting' ? 'waiting' : 'live');
        setAgentOnline(session.status === 'open');
        getMessages(session.id).then(setLiveMessages);
      }
    });
  }, []);

  useEffect(() => {
    if (!sessionId) return;

    const msgChannel = supabase
      .channel(`chat-messages-${sessionId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `session_id=eq.${sessionId}` },
        (payload) => {
          const newMsg = payload.new as LiveChatMessage;
          setLiveMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      )
      .subscribe();

    const sessionChannel = supabase
      .channel(`chat-session-${sessionId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'chat_sessions', filter: `id=eq.${sessionId}` },
        (payload) => {
          const updated = payload.new as { status: string };
          if (updated.status === 'open') {
            setMode('live');
            setAgentOnline(true);
          } else if (updated.status === 'closed') {
            setMode('idle');
            setAgentOnline(false);
            setSessionId(null);
            setLiveMessages([]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(msgChannel);
      supabase.removeChannel(sessionChannel);
    };
  }, [sessionId]);

  async function startLiveChat() {
    if (starting) return;
    setStarting(true);
    try {
      const visitorId = getOrCreateVisitorId();
      const session = await createChatSession(visitorId, 'Visitor');
      if (!session) return;
      setSessionId(session.id);
      setMode('waiting');
      setLiveMessages([]);
    } finally {
      setStarting(false);
    }
  }

  async function handleLiveSend() {
    const text = liveInput.trim();
    if (!text || liveSending || !sessionId) return;
    setLiveSending(true);
    setLiveInput('');
    const visitorId = getOrCreateVisitorId();
    await sendMessage(sessionId, 'visitor', visitorId, text);
    setLiveSending(false);
    liveInputRef.current?.focus();
  }

  function handleLiveKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleLiveSend(); }
  }

  const visitorId = getOrCreateVisitorId();

  return (
    <div className="fixed bottom-20 right-3 sm:bottom-24 sm:right-5 z-50 flex flex-col items-end gap-3 max-w-[100vw]">
      {open && (
        <div
          className="bg-[#07111d] border border-cyan-800/40 shadow-[0_24px_80px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200 fixed inset-x-2 bottom-2 rounded-2xl min-h-[70dvh] sm:static sm:inset-auto sm:w-[360px] sm:rounded-2xl sm:min-h-[460px]"
          style={{ maxHeight: 'calc(100dvh - 1rem - env(safe-area-inset-bottom, 0px))' }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-900/30 bg-[#060f1a] flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={logoImg} alt="Helix Amino" className="w-8 h-8 object-contain rounded-full bg-[#050d14] p-0.5" />
                <span
                  className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#060f1a] ${
                    mode === 'live' && agentOnline ? 'bg-green-400' : mode === 'waiting' ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'
                  }`}
                />
              </div>
              <div>
                <div className="text-white text-sm font-bold leading-tight">Helix Amino Support</div>
                <div className={`text-xs ${mode === 'waiting' ? 'text-yellow-400' : 'text-green-400'}`}>
                  {mode === 'waiting'
                    ? 'Connecting you to an agent...'
                    : mode === 'live'
                    ? agentOnline ? 'Agent connected' : 'Agent online'
                    : 'Live support'}
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-white/5">
              <X className="w-4 h-4" />
            </button>
          </div>

          {mode === 'idle' && (
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-5">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-teal-600/20 border border-cyan-500/30 flex items-center justify-center">
                <UserCheck className="w-7 h-7 text-cyan-400" />
              </div>
              <div>
                <div className="text-white font-semibold mb-1">Chat with our team</div>
                <div className="text-gray-400 text-sm">Start a conversation with a live agent for help with products, shipping, COAs, and more.</div>
              </div>
              <button
                onClick={startLiveChat}
                disabled={starting}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 text-white text-sm font-semibold hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50"
              >
                {starting ? 'Starting...' : 'Start live chat'}
              </button>
            </div>
          )}

          {mode === 'waiting' && (
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500/20 to-teal-600/20 border border-cyan-500/30 flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-cyan-400 animate-pulse" />
              </div>
              <div>
                <div className="text-white font-semibold mb-1">Connecting you to an agent</div>
                <div className="text-gray-400 text-sm">Please wait a moment. An agent will join shortly.</div>
              </div>
              <div ref={bottomRef} />
            </div>
          )}

          {mode === 'live' && (
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-3">
              {liveMessages.length === 0 && (
                <div className="text-center text-gray-500 text-sm py-4">Agent has joined. Say hello!</div>
              )}
              {liveMessages.map((msg) => {
                const isVisitor = msg.sender_id === visitorId;
                return (
                  <div key={msg.id} className={`flex ${isVisitor ? 'justify-end' : 'justify-start'} gap-2`}>
                    {!isVisitor && (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center flex-shrink-0 mt-0.5 overflow-hidden">
                        <img src={logoImg} alt="" className="w-5 h-5 object-contain" />
                      </div>
                    )}
                    <div className={`max-w-[75%] flex flex-col gap-1 ${isVisitor ? 'items-end' : 'items-start'}`}>
                      <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        isVisitor
                          ? 'bg-gradient-to-br from-cyan-600 to-teal-600 text-white rounded-tr-sm'
                          : 'bg-cyan-950/40 border border-cyan-900/20 text-gray-200 rounded-tl-sm'
                      }`}>
                        {msg.text}
                      </div>
                      <span className="text-gray-600 text-[10px] px-1">{formatTime(msg.created_at)}</span>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>
          )}

          {mode === 'live' && (
            <div className="px-4 py-3 border-t border-cyan-900/30 bg-[#060f1a] flex items-center gap-2 flex-shrink-0">
              <input
                ref={liveInputRef}
                type="text"
                value={liveInput}
                onChange={(e) => setLiveInput(e.target.value)}
                onKeyDown={handleLiveKey}
                placeholder="Message agent..."
                maxLength={500}
                className="flex-1 bg-cyan-950/30 border border-cyan-900/30 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-600 placeholder-gray-600 transition-colors"
              />
              <button
                onClick={handleLiveSend}
                disabled={!liveInput.trim() || liveSending}
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-white disabled:opacity-40 hover:shadow-[0_0_16px_rgba(0,212,255,0.4)] hover:scale-105 active:scale-95 transition-all duration-200 flex-shrink-0"
              >
                {liveSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}

          {mode === 'waiting' && (
            <div className="px-4 py-3 border-t border-cyan-900/30 bg-[#060f1a] flex-shrink-0">
              <div className="text-center text-gray-600 text-xs">Waiting for an agent to connect...</div>
            </div>
          )}
        </div>
      )}

      {!dismissed && !open && (
        <div className="hidden sm:flex items-center gap-2 bg-[#07111d] border border-cyan-800/40 rounded-full pl-3 pr-2 py-2 shadow-lg">
          <span className="text-gray-300 text-xs whitespace-nowrap">Need help? Chat with us</span>
          <button onClick={() => setDismissed(true)} className="text-gray-600 hover:text-gray-400 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <button
        onClick={() => { setOpen(!open); setDismissed(true); }}
        className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 text-white shadow-[0_8px_30px_rgba(0,212,255,0.35)] hover:shadow-[0_8px_40px_rgba(0,212,255,0.5)] hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center"
      >
        <MessageCircle className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-200 ${open ? 'opacity-0 scale-75' : 'opacity-100 scale-100'} absolute`} />
        <X className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-200 ${open ? 'opacity-100 scale-100' : 'opacity-0 scale-75'} absolute`} />
        {!open && <span className="hidden sm:block absolute inset-0 rounded-full bg-cyan-400/30 animate-ping" />}
        {!open && mode === 'waiting' && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-yellow-400 border-2 border-[#050d14] animate-pulse" />
        )}
        {!open && mode === 'live' && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-[#050d14]" />
        )}
      </button>
    </div>
  );
}
