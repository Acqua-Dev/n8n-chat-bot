import ChatView from '@/components/views/chat-view';
import SideBar from '@/components/bars/side-bar';

interface Props {
  searchParams: Promise<{
    webhookUrl: string;
  }>;
}

export default async function ChatPage({ searchParams }: Props) {
  const { webhookUrl } = await searchParams;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-8 p-8 sm:p-12">
      <SideBar />
      <div className="h-[70vh] lg:h-[80vh] relative">
        <ChatView webhookUrl={webhookUrl} />
      </div>
    </div>
  );
}
