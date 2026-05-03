import { supabase } from '../lib/supabase';
import { ChatSession, LiveChatMessage } from '../types';

export function getOrCreateVisitorId(): string {
  const key = 'helix_visitor_id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export async function createChatSession(visitorId: string, visitorName: string): Promise<ChatSession | null> {
  const { data, error } = await supabase
    .from('chat_sessions')
    .insert({ visitor_id: visitorId, visitor_name: visitorName, status: 'waiting' })
    .select()
    .single();
  if (error) return null;
  const session = data as ChatSession;
  void notifyNewChat(session.id);
  return session;
}

async function notifyNewChat(sessionId: string): Promise<void> {
  try {
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/notify-new-chat`;
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
      },
      body: JSON.stringify({ session_id: sessionId }),
    });
  } catch {
    /* best-effort */
  }
}

export async function getActiveSession(visitorId: string): Promise<ChatSession | null> {
  const { data } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('visitor_id', visitorId)
    .neq('status', 'closed')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  return data as ChatSession | null;
}

export async function sendMessage(
  sessionId: string,
  senderRole: 'visitor' | 'agent',
  senderId: string,
  text: string
): Promise<LiveChatMessage | null> {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({ session_id: sessionId, sender_role: senderRole, sender_id: senderId, text })
    .select()
    .single();
  if (error) return null;
  return data as LiveChatMessage;
}

export async function getMessages(sessionId: string): Promise<LiveChatMessage[]> {
  const { data } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });
  return (data ?? []) as LiveChatMessage[];
}

export async function getAllSessions(): Promise<ChatSession[]> {
  const { data } = await supabase
    .from('chat_sessions')
    .select('*')
    .neq('status', 'closed')
    .order('updated_at', { ascending: false });
  return (data ?? []) as ChatSession[];
}

export async function claimSession(sessionId: string, agentId: string): Promise<void> {
  await supabase
    .from('chat_sessions')
    .update({ status: 'open', agent_id: agentId, unread_by_agent: 0 })
    .eq('id', sessionId);
}

export async function closeSession(sessionId: string): Promise<void> {
  await supabase
    .from('chat_sessions')
    .update({ status: 'closed' })
    .eq('id', sessionId);
}

export async function markSessionRead(sessionId: string): Promise<void> {
  await supabase
    .from('chat_sessions')
    .update({ unread_by_agent: 0 })
    .eq('id', sessionId);
}

export async function incrementUnread(sessionId: string): Promise<void> {
  const { data } = await supabase
    .from('chat_sessions')
    .select('unread_by_agent')
    .eq('id', sessionId)
    .maybeSingle();
  if (data) {
    await supabase
      .from('chat_sessions')
      .update({ unread_by_agent: (data.unread_by_agent ?? 0) + 1 })
      .eq('id', sessionId);
  }
}

export async function savePushSubscription(
  userId: string,
  subscription: PushSubscription
): Promise<void> {
  const json = subscription.toJSON();
  await supabase.from('push_subscriptions').upsert({
    user_id: userId,
    endpoint: json.endpoint!,
    p256dh: (json.keys as Record<string, string>)?.p256dh ?? '',
    auth_key: (json.keys as Record<string, string>)?.auth ?? '',
  }, { onConflict: 'endpoint' });
}

export async function deletePushSubscription(endpoint: string): Promise<void> {
  await supabase.from('push_subscriptions').delete().eq('endpoint', endpoint);
}
