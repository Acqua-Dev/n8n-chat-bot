import { cn } from '@/utils/ui/utils';
import ReactMarkdown from 'react-markdown';
import { useEffect, useState } from 'react';
import { detectBpmnXml } from '@/components/bpmn/bpmn';
import BpmnDiagram from '../../bpmn/BpmnDiagram';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { Code, FileCode } from 'lucide-react';
import { useI18n } from '@/utils/localization/client';

export interface MessageMarkdownProps {
  content: string;
}

export default function MessageMarkdown({ content }: MessageMarkdownProps) {
  const [bpmnXml, setBpmnXml] = useState<string | null>(null);
  const [showDiagram, setShowDiagram] = useState<boolean>(true);
  const t = useI18n();

  useEffect(() => {
    try {
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
    <div className="prose prose-sm max-w-none text-foreground overflow-x-auto">
      {bpmnXml && (
        <div className="border border-border/50 rounded-lg mb-4 overflow-hidden max-w-full">
          <div className="bg-muted/50 p-2 flex justify-between items-center border-b border-border/50">
            <div className="text-sm font-medium">
              {showDiagram ? t('bpmn.diagram') : t('bpmn.xml')}
            </div>
            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowDiagram(!showDiagram)}
                    className="h-8 w-8"
                  >
                    {showDiagram ? (
                      <Code className="h-4 w-4" />
                    ) : (
                      <FileCode className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {showDiagram ? t('bpmn.showXml') : t('bpmn.showDiagram')}
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className="p-2">
            {showDiagram ? (
              <BpmnDiagram xml={bpmnXml} />
            ) : (
              <div className="bg-background rounded-md border border-border/50 h-[400px] max-w-full overflow-auto">
                <pre className="p-3 text-xs min-w-min">
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
          p: ({ children }) => (
            <p className="mb-4 leading-relaxed">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="ml-4 mb-4 list-disc">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="ml-4 mb-4 list-decimal">{children}</ol>
          ),
          h1: ({ children }) => (
            <h1 className="text-xl font-bold mb-4">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold mb-3">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-medium mb-2">{children}</h3>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-muted pl-4 italic mb-4">
              {children}
            </blockquote>
          ),
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
                  'bg-muted/80 dark:bg-muted p-4 rounded-lg mt-2 mb-4 overflow-x-auto',
                  className,
                )}
              >
                <code className={cn('text-sm', className)} {...props}>
                  {children}
                </code>
              </pre>
            ) : (
              <code
                className={cn(
                  'bg-muted px-1.5 py-0.5 rounded text-sm font-mono',
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
              <pre className="whitespace-pre-wrap bg-muted/80 dark:bg-muted p-4 rounded-lg mt-2 mb-4 overflow-x-auto">
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
