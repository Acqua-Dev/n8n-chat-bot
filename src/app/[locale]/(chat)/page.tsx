import ChatView from '@/components/views/chat-view';
import SideBar from '@/components/bars/side-bar';
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
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-8 p-8 sm:p-12">
      <SideBar />
      <div className="h-[70vh] lg:h-[80vh] relative">
        <ChatView webhookUrl={url} />
      </div>
    </div>
  );
}
