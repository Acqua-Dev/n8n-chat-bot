'use client';

import { redirect, useSearchParams } from 'next/navigation';
import { useChatStore } from '@/store/chat-store';

export default function ChatRedirectPage() {
  const searchParams = useSearchParams();
  const webhookUrl = searchParams.get('webhookUrl');
  const id = searchParams.get('id');
  const { createSession } = useChatStore();

  const url =
    webhookUrl || `${process.env.NEXT_PUBLIC_N8N_BASE_URL}/webhook/${id}/chat`;
  const newSessionId = createSession(url);

  redirect(`/${newSessionId}?webhookUrl=${url}`);
}
