import { cn } from '@/utils/ui/utils';
import ReactMarkdown from 'react-markdown';

export interface MessageMarkdownProps {
  content: string;
}

export function MessageMarkdown({ content }: MessageMarkdownProps) {
  return (
    <div className="text-sm [&>p]:my-2 [&>ul]:ml-6 [&>ul]:list-disc [&>ol]:ml-6 [&>ol]:list-decimal [&>ul>li]:mb-1 [&>ol>li]:mb-1 [&>h1]:text-xl [&>h1]:font-bold [&>h1]:my-3 [&>h2]:text-lg [&>h2]:font-semibold [&>h2]:my-2 [&>h3]:font-medium [&>h3]:my-1 [&>blockquote]:border-l-4 [&>blockquote]:border-gray-300 [&>blockquote]:pl-4 [&>blockquote]:italic">
      <ReactMarkdown
        components={{
          code(props: any) {
            const { inline, className, children } = props;
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <pre
                className={cn(
                  'bg-gray-100 dark:bg-gray-800 p-3 rounded-md mt-2 overflow-x-auto',
                  className,
                )}
              >
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            ) : (
              <code
                className={cn(
                  'bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono',
                  className,
                )}
                {...props}
              >
                {children}
              </code>
            );
          },
          pre(props: any) {
            const { children } = props;
            return (
              <pre className="whitespace-pre-wrap bg-gray-100 dark:bg-gray-800 p-3 rounded-md mt-2 overflow-x-auto">
                {children}
              </pre>
            );
          },
        }}
        remarkPlugins={[]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
