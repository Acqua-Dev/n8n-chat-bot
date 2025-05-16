import ChatView from '@/components/views/chat-view';
import { notFound } from 'next/navigation';

interface Props {
  searchParams: Promise<{
    webhookUrl?: string;
    id?: string;
  }>;
}

export default async function ChatPage({ searchParams }: Props) {
  const { webhookUrl, id } = await searchParams;

  if (!webhookUrl && !id) {
    return notFound();
  }

  const url = webhookUrl || `${process.env.N8N_BASE_URL}/webhook/${id}/chat`;

  return (
    <div className="h-full">
      <ChatView webhookUrl={url} />
    </div>
  );
}
