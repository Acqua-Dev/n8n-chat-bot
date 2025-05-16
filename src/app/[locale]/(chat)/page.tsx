import { redirect } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  searchParams: Promise<{
    webhookUrl?: string;
    id?: string;
  }>;
}

export default async function ChatRedirectPage({ searchParams }: Props) {
  const { webhookUrl, id } = await searchParams;

  const sessionId = uuidv4();

  const urlParams = new URLSearchParams();
  if (webhookUrl) urlParams.set('webhookUrl', webhookUrl);
  if (id) urlParams.set('id', id);

  const queryString = urlParams.toString();
  const redirectUrl = `/${sessionId}${queryString ? `?${queryString}` : ''}`;

  redirect(redirectUrl);
}
