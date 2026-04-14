import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { MessageSquare, User, CheckCheck, X, LogOut, Bell, BellOff, Menu, ArrowLeft, Loader as Loader2, Send, Clock, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { supabase } from '../lib/supabase';
import {
  getAllSessions,
  getMessages,
  sendMessage,
  claimSession,
  closeSession,
  markSessionRead,
  savePushSubscription,
  deletePushSubscription,
} from '../services/liveChatService';
import { ChatSession, LiveChatMessage } from '../types';
import logoImg from '../assets/transparentlogo.png';

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined;

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = window.atob(base64);
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const STATUS_COLORS: Record<string, string> = {
  waiting: 'bg-yellow-400',
  open: 'bg-green-400',
  closed: 'bg-gray-500',
};

export function AdminChatPage() {
  const { user, signOut } = useAuth();
  const { navigate } = useNavigation();

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<LiveChatMessage[]>([]);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushLoading, setPushLoading] = useState(false);
  const [mobileShowThread, setMobileShowThread] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const replyRef = useRef<HTMLInputElement>(null);

  // Load sessions
  async function loadSessions() {
    const data = await getAllSessions();
    setSessions(data);
    setLoading(false);
  }

  useEffect(() => {
    loadSessions();
  }, []);

  // Subscribe to new/updated sessions
  useEffect(() => {
    const channel = supabase
      .channel('admin-sessions')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_sessions' }, (payload) => {
        setSessions((prev) => {
          if (prev.some((s) => s.id === (payload.new as ChatSession).id)) return prev;
          return [payload.new as ChatSession, ...prev];
        });
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'chat_sessions' }, (payload) => {
        const updated = payload.new as ChatSession;
        setSessions((prev) =>
          updated.status === 'closed'
            ? prev.filter((s) => s.id !== updated.id)
            : prev.map((s) => (s.id === updated.id ? updated : s))
        );
        setSelectedSession((prev) => (prev?.id === updated.id ? updated : prev));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // Load messages when session selected
  useEffect(() => {
    if (!selectedSession) return;
    getMessages(selectedSession.id).then(setMessages);
    if (user) markSessionRead(selectedSession.id);
  }, [selectedSession, user]);

  // Subscribe to new messages for selected session
  useEffect(() => {
    if (!selectedSession) return;
    const channel = supabase
      .channel(`admin-messages-${selectedSession.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `session_id=eq.${selectedSession.id}` },
        (payload) => {
          const msg = payload.new as LiveChatMessage;
          setMessages((prev) => {
            if (prev.some((m) => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
          if (user) markSessionRead(selectedSession.id);
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [selectedSession, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Check push subscription state
  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
    navigator.serviceWorker.ready.then(async (reg) => {
      const sub = await reg.pushManager.getSubscription();
      setPushEnabled(!!sub);
    });
  }, []);

  async function handleSelectSession(session: ChatSession) {
    setSelectedSession(session);
    setMobileShowThread(true);
    if (!session.agent_id && user) {
      await claimSession(session.id, user.id);
    }
  }

  async function handleSend() {
    const text = reply.trim();
    if (!text || sending || !selectedSession || !user) return;
    setSending(true);
    setReply('');
    await sendMessage(selectedSession.id, 'agent', user.id, text);
    setSending(false);
    replyRef.current?.focus();
  }

  function handleReplyKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }

  async function handleClose() {
    if (!selectedSession) return;
    await closeSession(selectedSession.id);
    setSelectedSession(null);
    setMessages([]);
    setMobileShowThread(false);
  }

  async function handleRefresh() {
    setRefreshing(true);
    await loadSessions();
    setRefreshing(false);
  }

  async function togglePush() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      alert('Push notifications are not supported in this browser.');
      return;
    }
    if (!VAPID_PUBLIC_KEY) {
      alert('Push notifications are not configured yet.');
      return;
    }
    setPushLoading(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const existing = await reg.pushManager.getSubscription();
      if (pushEnabled && existing) {
        await existing.unsubscribe();
        if (user) await deletePushSubscription(existing.endpoint);
        setPushEnabled(false);
      } else {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') { setPushLoading(false); return; }
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });
        if (user) await savePushSubscription(user.id, sub);
        setPushEnabled(true);
      }
    } catch {
      alert('Could not toggle push notifications.');
    }
    setPushLoading(false);
  }

  const totalUnread = sessions.reduce((acc, s) => acc + (s.unread_by_agent ?? 0), 0);

  return (
    <div className="fixed inset-0 bg-[#050d14] flex flex-col z-50">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-900/30 bg-[#060f1a] flex-shrink-0">
        <div className="flex items-center gap-3">
          {mobileShowThread && (
            <button
              onClick={() => setMobileShowThread(false)}
              className="md:hidden text-gray-400 hover:text-white transition-colors mr-1"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <img src={logoImg} alt="Helix Amino" className="w-7 h-7 object-contain" />
          <div>
            <div className="text-white font-bold text-sm">Live Chat Admin</div>
            <div className="text-gray-500 text-xs hidden sm:block">{user?.email}</div>
          </div>
          {totalUnread > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold min-w-[20px] text-center">
              {totalUnread}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={togglePush}
            disabled={pushLoading}
            title={pushEnabled ? 'Disable push notifications' : 'Enable push notifications'}
            className={`p-2 rounded-lg transition-colors ${pushEnabled ? 'text-cyan-400 bg-cyan-900/30' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
          >
            {pushLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : pushEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
          </button>
          <button
            onClick={() => navigate('home')}
            title="Back to store"
            className="p-2 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors"
          >
            <Menu className="w-4 h-4" />
          </button>
          <button
            onClick={signOut}
            title="Sign out"
            className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Session list */}
        <div className={`${mobileShowThread ? 'hidden md:flex' : 'flex'} md:flex w-full md:w-80 lg:w-96 flex-col border-r border-cyan-900/20 flex-shrink-0`}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-900/20">
            <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
              Active Chats ({sessions.length})
            </div>
            <button
              onClick={handleRefresh}
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-cyan-500 animate-spin" />
              </div>
            )}
            {!loading && sessions.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-3">
                <MessageSquare className="w-10 h-10 text-gray-700" />
                <div className="text-gray-500 text-sm">No active chats</div>
                <div className="text-gray-600 text-xs">New conversations will appear here in real time</div>
              </div>
            )}
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => handleSelectSession(session)}
                className={`w-full px-4 py-3.5 flex items-start gap-3 hover:bg-white/5 transition-colors border-b border-cyan-900/10 text-left ${
                  selectedSession?.id === session.id ? 'bg-cyan-900/20 border-l-2 border-l-cyan-500' : ''
                }`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-800 to-teal-900 flex items-center justify-center">
                    <User className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#050d14] ${STATUS_COLORS[session.status] ?? 'bg-gray-500'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="text-white text-sm font-medium truncate">{session.visitor_name || 'Visitor'}</span>
                    <span className="text-gray-600 text-xs flex-shrink-0 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {timeAgo(session.updated_at)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                      session.status === 'waiting' ? 'bg-yellow-900/40 text-yellow-400' : 'bg-green-900/40 text-green-400'
                    }`}>
                      {session.status === 'waiting' ? 'Waiting' : 'Open'}
                    </span>
                    {session.unread_by_agent > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-cyan-600 text-white text-xs font-bold min-w-[20px] text-center">
                        {session.unread_by_agent}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Thread panel */}
        <div className={`${mobileShowThread ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>
          {!selectedSession ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
              <div className="w-16 h-16 rounded-full bg-cyan-900/20 border border-cyan-900/30 flex items-center justify-center">
                <MessageSquare className="w-7 h-7 text-cyan-800" />
              </div>
              <div className="text-gray-500 text-sm">Select a conversation to start chatting</div>
            </div>
          ) : (
            <>
              {/* Thread header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-900/20 bg-[#060f1a] flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-800 to-teal-900 flex items-center justify-center">
                      <User className="w-4 h-4 text-cyan-400" />
                    </div>
                    <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#060f1a] ${STATUS_COLORS[selectedSession.status]}`} />
                  </div>
                  <div>
                    <div className="text-white text-sm font-semibold">{selectedSession.visitor_name || 'Visitor'}</div>
                    <div className="text-gray-500 text-xs">Started {timeAgo(selectedSession.created_at)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleClose}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-red-400 border border-red-800/40 hover:bg-red-900/20 transition-colors"
                  >
                    <X className="w-3 h-3" />
                    <span className="hidden sm:inline">Close chat</span>
                  </button>
                  {selectedSession.agent_id && (
                    <div className="flex items-center gap-1 text-green-400 text-xs">
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Claimed</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {messages.length === 0 && (
                  <div className="text-center text-gray-600 text-sm py-8">No messages yet. Say hello!</div>
                )}
                {messages.map((msg) => {
                  const isAgent = msg.sender_role === 'agent';
                  return (
                    <div key={msg.id} className={`flex ${isAgent ? 'justify-end' : 'justify-start'} gap-2`}>
                      {!isAgent && (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-800 to-teal-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <User className="w-3.5 h-3.5 text-cyan-400" />
                        </div>
                      )}
                      <div className={`max-w-[72%] flex flex-col gap-1 ${isAgent ? 'items-end' : 'items-start'}`}>
                        <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          isAgent
                            ? 'bg-gradient-to-br from-cyan-600 to-teal-600 text-white rounded-tr-sm'
                            : 'bg-[#0d1f2e] border border-cyan-900/30 text-gray-200 rounded-tl-sm'
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

              {/* Reply input */}
              <div className="px-4 py-3 border-t border-cyan-900/20 bg-[#060f1a] flex items-center gap-2 flex-shrink-0">
                <input
                  ref={replyRef}
                  type="text"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={handleReplyKey}
                  placeholder="Type a reply..."
                  maxLength={1000}
                  className="flex-1 bg-cyan-950/30 border border-cyan-900/30 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-600 placeholder-gray-600 transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={!reply.trim() || sending}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-white disabled:opacity-40 hover:shadow-[0_0_16px_rgba(0,212,255,0.4)] hover:scale-105 active:scale-95 transition-all duration-200 flex-shrink-0"
                >
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
