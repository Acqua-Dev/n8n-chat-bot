import { cn } from '@/utils/ui/utils';
import ReactMarkdown from 'react-markdown';
import { useEffect, useState } from 'react';
import { detectBpmnXml } from '@/components/bpmn/bpmn';
import BpmnDiagram from '../../bpmn/BpmnDiagram';
import { Button } from '@/components/ui/button';

export interface MessageMarkdownProps {
  content: string;
}

export function MessageMarkdown({ content }: MessageMarkdownProps) {
  const [bpmnXml, setBpmnXml] = useState<string | null>(null);
  const [showDiagram, setShowDiagram] = useState<boolean>(true);

  useEffect(() => {
    try {
      // Detect if message contains BPMN XML
      const detectedXml = detectBpmnXml(content);
      setBpmnXml(detectedXml);
    } catch (error) {
      console.error('Error detecting BPMN XML:', error);
      setBpmnXml(null);
    }
  }, [content]);

  const formatXml = (xml: string) => {
    return xml.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };

  const getFilteredContent = () => {
    if (!bpmnXml) return content;

    let filteredContent = content;

    const codeBlockRegex =
      /```xml\s*(<bpmn:definitions[\s\S]*<\/bpmn:definitions>|<definitions[\s\S]*<\/definitions>)\s*```/i;
    filteredContent = filteredContent.replace(codeBlockRegex, '');

    filteredContent = filteredContent.replace(bpmnXml, '');

    return filteredContent;
  };

  return (
    <div className="text-sm [&>p]:my-2 [&>ul]:ml-6 [&>ul]:list-disc [&>ol]:ml-6 [&>ol]:list-decimal [&>ul>li]:mb-1 [&>ol>li]:mb-1 [&>h1]:text-xl [&>h1]:font-bold [&>h1]:my-3 [&>h2]:text-lg [&>h2]:font-semibold [&>h2]:my-2 [&>h3]:font-medium [&>h3]:my-1 [&>blockquote]:border-l-4 [&>blockquote]:border-gray-300 [&>blockquote]:pl-4 [&>blockquote]:italic w-full overflow-hidden">
      {/* If BPMN XML is detected, show the diagram or XML based on toggle */}
      {bpmnXml && (
        <div className="border rounded-md mb-4 overflow-hidden max-w-full">
          <div className="bg-gray-100 dark:bg-gray-800 p-2 flex justify-between items-center border-b">
            <div className="font-medium">
              {showDiagram ? 'BPMN Diagram' : 'BPMN XML'}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDiagram(!showDiagram)}
            >
              {showDiagram ? 'Show XML' : 'Show Diagram'}
            </Button>
          </div>

          <div className="p-2">
            {showDiagram ? (
              <BpmnDiagram xml={bpmnXml} />
            ) : (
              <div className="bpmn-container bg-white rounded-md border border-gray-300 h-[400px] max-w-full overflow-y-auto">
                <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto text-xs w-full max-w-full break-words whitespace-pre-wrap">
                  <code
                    dangerouslySetInnerHTML={{ __html: formatXml(bpmnXml) }}
                  />
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      <ReactMarkdown
        components={{
          code(props: any) {
            const { inline, className, children } = props;
            const match = /language-(\w+)/.exec(className || '');

            if (
              !inline &&
              match &&
              match[1] === 'xml' &&
              bpmnXml &&
              children.toString().includes(bpmnXml)
            ) {
              return null;
            }

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
        {bpmnXml ? getFilteredContent() : content}
      </ReactMarkdown>
    </div>
  );
}
