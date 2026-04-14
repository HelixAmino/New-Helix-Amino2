import { MessageCircle, X, Send, Loader as Loader2, UserCheck, ArrowLeft } from 'lucide-react';
import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { ChatMessage, getBotResponse } from '../services/chatService';
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

let msgCounter = 0;
function newId() {
  return `msg-${++msgCounter}-${Date.now()}`;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: newId(),
  role: 'assistant',
  text: 'Hi! Welcome to Helix Amino. I can help with product questions, shipping, COA requests, and more. What can I assist you with today?',
  timestamp: new Date(),
};

const QUICK_REPLIES = ['Shipping info', 'Product purity', 'Contact support', 'Talk to an agent'];

function formatTime(date: Date | string) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

type Mode = 'bot' | 'live' | 'waiting';

export function ChatBubble() {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [mode, setMode] = useState<Mode>('bot');

  // Bot mode state
  const [botMessages, setBotMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);

  // Live chat state
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [liveMessages, setLiveMessages] = useState<LiveChatMessage[]>([]);
  const [liveInput, setLiveInput] = useState('');
  const [liveSending, setLiveSending] = useState(false);
  const [agentOnline, setAgentOnline] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const liveInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        (mode === 'live' ? liveInputRef : inputRef).current?.focus();
      }, 150);
    }
  }, [open, mode]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [botMessages, liveMessages, typing, mode]);

  // Restore existing live session on mount
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

  // Subscribe to live messages when in live/waiting mode
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
            setMode('bot');
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
    const visitorId = getOrCreateVisitorId();
    const session = await createChatSession(visitorId, 'Visitor');
    if (!session) return;
    setSessionId(session.id);
    setMode('waiting');
    setLiveMessages([]);
  }

  function dispatchBotMessage(text: string) {
    if (text === 'Talk to an agent') {
      startLiveChat();
      return;
    }
    const userMsg: ChatMessage = { id: newId(), role: 'user', text, timestamp: new Date() };
    setBotMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    const delay = 800 + Math.random() * 700;
    setTimeout(() => {
      const reply = getBotResponse(text);
      setBotMessages((prev) => [
        ...prev,
        { id: newId(), role: 'assistant', text: reply, timestamp: new Date() },
      ]);
      setTyping(false);
    }, delay);
  }

  function handleBotSend() {
    const text = input.trim();
    if (!text || typing) return;
    dispatchBotMessage(text);
  }

  function handleBotKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleBotSend(); }
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

  const showQuickReplies = botMessages.length <= 1 && !typing && mode === 'bot';
  const visitorId = getOrCreateVisitorId();

  return (
    <div className="fixed bottom-24 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div
          className="bg-[#07111d] border border-cyan-800/40 rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.7)] w-[340px] sm:w-[360px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200"
          style={{ maxHeight: 'calc(100vh - 160px)', minHeight: '460px' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-900/30 bg-[#060f1a] flex-shrink-0">
            <div className="flex items-center gap-3">
              {(mode === 'live' || mode === 'waiting') && (
                <button
                  onClick={() => {
                    setMode('bot');
                    setSessionId(null);
                    setLiveMessages([]);
                  }}
                  className="text-gray-500 hover:text-gray-300 transition-colors mr-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
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
                    : 'Online — typically replies instantly'}
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-white/5">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Bot messages */}
          {mode === 'bot' && (
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {botMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center flex-shrink-0 mt-0.5 overflow-hidden">
                      <img src={logoImg} alt="" className="w-5 h-5 object-contain" />
                    </div>
                  )}
                  <div className={`max-w-[75%] flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-cyan-600 to-teal-600 text-white rounded-tr-sm'
                        : 'bg-cyan-950/40 border border-cyan-900/20 text-gray-200 rounded-tl-sm'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-gray-600 text-[10px] px-1">{formatTime(msg.timestamp)}</span>
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img src={logoImg} alt="" className="w-5 h-5 object-contain" />
                  </div>
                  <div className="bg-cyan-950/40 border border-cyan-900/20 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                    {[0, 150, 300].map((d) => (
                      <span key={d} className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: `${d}ms` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}

          {/* Waiting screen */}
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

          {/* Live messages */}
          {mode === 'live' && (
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
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

          {/* Quick replies (bot mode only) */}
          {showQuickReplies && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5 flex-shrink-0">
              {QUICK_REPLIES.map((q) => (
                <button
                  key={q}
                  onClick={() => dispatchBotMessage(q)}
                  className={`px-3 py-1 rounded-full border text-xs hover:bg-cyan-900/30 transition-colors ${
                    q === 'Talk to an agent'
                      ? 'border-teal-600/60 text-teal-300 hover:bg-teal-900/30'
                      : 'border-cyan-800/50 text-cyan-300'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input area */}
          {mode === 'bot' && (
            <div className="px-4 py-3 border-t border-cyan-900/30 bg-[#060f1a] flex items-center gap-2 flex-shrink-0">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleBotKey}
                placeholder="Type a message..."
                maxLength={300}
                className="flex-1 bg-cyan-950/30 border border-cyan-900/30 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-600 placeholder-gray-600 transition-colors"
              />
              <button
                onClick={handleBotSend}
                disabled={!input.trim() || typing}
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-white disabled:opacity-40 hover:shadow-[0_0_16px_rgba(0,212,255,0.4)] hover:scale-105 active:scale-95 transition-all duration-200 flex-shrink-0"
              >
                {typing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              </button>
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
        <div className="flex items-center gap-2 bg-[#07111d] border border-cyan-800/40 rounded-full pl-3 pr-2 py-2 shadow-lg">
          <span className="text-gray-300 text-xs whitespace-nowrap">Need help? Chat with us</span>
          <button onClick={() => setDismissed(true)} className="text-gray-600 hover:text-gray-400 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <button
        onClick={() => { setOpen(!open); setDismissed(true); }}
        className="relative w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 text-white shadow-[0_8px_30px_rgba(0,212,255,0.35)] hover:shadow-[0_8px_40px_rgba(0,212,255,0.5)] hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center"
      >
        <MessageCircle className={`w-6 h-6 transition-all duration-200 ${open ? 'opacity-0 scale-75' : 'opacity-100 scale-100'} absolute`} />
        <X className={`w-6 h-6 transition-all duration-200 ${open ? 'opacity-100 scale-100' : 'opacity-0 scale-75'} absolute`} />
        {!open && <span className="absolute inset-0 rounded-full bg-cyan-400/30 animate-ping" />}
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
