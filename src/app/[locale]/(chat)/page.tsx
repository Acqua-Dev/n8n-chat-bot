'use client';

import { notFound, redirect, useSearchParams } from 'next/navigation';
import { useChatStore } from '@/store/chat-store';

export default function ChatRedirectPage() {
  const searchParams = useSearchParams();
  const webhookUrl = searchParams.get('webhookUrl');
  const id = searchParams.get('id');
  const { getSessionId, getMostRecentSession } = useChatStore();

  let url: string = '';

  if (webhookUrl) {
    url = webhookUrl;
  } else if (id && process.env.NEXT_PUBLIC_N8N_BASE_URL) {
    url = `${process.env.NEXT_PUBLIC_N8N_BASE_URL}/webhook/${id}/chat`;
  }

  if (!url) {
    console.error('No valid URL could be constructed');
    notFound();
  }

  const existingSession = getMostRecentSession(url);
  const sessionId = existingSession
    ? existingSession.sessionId
    : getSessionId(url);

  redirect(`/${sessionId}?webhookUrl=${url}`);
}
