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
import { Code, FileCode, Copy, ChevronDown, ChevronRight } from 'lucide-react';
import { useI18n } from '@/utils/localization/client';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import json from 'react-syntax-highlighter/dist/cjs/languages/prism/json';
import {
  oneDark,
  oneLight,
} from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { useTheme } from 'next-themes';

export interface MessageMarkdownProps {
  content: string;
}

// Register JSON language for syntax highlighting
SyntaxHighlighter.registerLanguage('json', json);

interface JsonBlockProps {
  content: string;
  isCollapsible?: boolean;
}

function JsonBlock({ content, isCollapsible = false }: JsonBlockProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy JSON:', err);
    }
  };

  const shouldCollapse = isCollapsible && content.length > 500;
  const displayContent =
    shouldCollapse && isCollapsed
      ? JSON.stringify(JSON.parse(content), null, 2).slice(0, 200) +
        '\n  ...\n}'
      : content;

  return (
    <div className="json-block border border-border/50 rounded-lg mb-4 overflow-hidden">
      <div className="bg-muted/50 p-2 flex justify-between items-center border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium">JSON</div>
          {shouldCollapse && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-8 w-8"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="h-8 w-8"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{copied ? 'Copied!' : 'Copy JSON'}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language="json"
          style={theme === 'dark' ? oneDark : oneLight}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: 'transparent',
            fontSize: '0.875rem',
          }}
          wrapLongLines={true}
        >
          {displayContent}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export default function MessageMarkdown({ content }: MessageMarkdownProps) {
  const [bpmnXml, setBpmnXml] = useState<string | null>(null);
  const [showDiagram, setShowDiagram] = useState<boolean>(true);
  const t = useI18n();

  const [detectedJsonBlocks, setDetectedJsonBlocks] = useState<
    Array<{ content: string; isLarge: boolean }>
  >([]);

  const detectJsonBlocks = (text: string) => {
    const jsonBlocks: Array<{ content: string; isLarge: boolean }> = [];

    // Try to detect if the entire content is a JSON string
    try {
      const trimmed = text.trim();
      if (
        (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
        (trimmed.startsWith('[') && trimmed.endsWith(']'))
      ) {
        const parsed = JSON.parse(trimmed);
        const formatted = JSON.stringify(parsed, null, 2);
        jsonBlocks.push({
          content: formatted,
          isLarge: formatted.length > 500,
        });
        return jsonBlocks;
      }
    } catch {
      // Not a pure JSON response, continue with other detection
    }

    // Look for JSON code blocks
    const codeBlockRegex = /```json\s*\n([\s\S]*?)\n\s*```/gi;
    let match;
    while ((match = codeBlockRegex.exec(text)) !== null) {
      try {
        const jsonContent = match[1].trim();
        const parsed = JSON.parse(jsonContent);
        const formatted = JSON.stringify(parsed, null, 2);
        jsonBlocks.push({
          content: formatted,
          isLarge: formatted.length > 500,
        });
      } catch {}
    }

    // Look for inline JSON objects (simple heuristic)
    const inlineJsonRegex = /(\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\})/g;
    while ((match = inlineJsonRegex.exec(text)) !== null) {
      try {
        const jsonContent = match[1];
        if (jsonContent.length > 50) {
          // Only consider substantial JSON objects
          const parsed = JSON.parse(jsonContent);
          const formatted = JSON.stringify(parsed, null, 2);
          jsonBlocks.push({
            content: formatted,
            isLarge: formatted.length > 500,
          });
        }
      } catch {
        // Invalid JSON, skip
      }
    }

    return jsonBlocks;
  };

  useEffect(() => {
    try {
      const detectedXml = detectBpmnXml(content);
      setBpmnXml(detectedXml);

      const jsonBlocks = detectJsonBlocks(content);
      setDetectedJsonBlocks(jsonBlocks);
    } catch (error) {
      console.error('Error detecting BPMN XML or JSON:', error);
      setBpmnXml(null);
      setDetectedJsonBlocks([]);
    }
  }, [content]);

  const formatXml = (xml: string) => {
    return xml.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };

  const getFilteredContent = () => {
    let filteredContent = content;

    // Remove BPMN XML if present
    if (bpmnXml) {
      const codeBlockRegex =
        /```xml\s*(<bpmn:definitions[\s\S]*<\/bpmn:definitions>|<definitions[\s\S]*<\/definitions>)\s*```/i;
      filteredContent = filteredContent.replace(codeBlockRegex, '');
      filteredContent = filteredContent.replace(bpmnXml, '');
    }

    // Remove JSON blocks if they match our detected ones
    if (detectedJsonBlocks.length > 0) {
      detectedJsonBlocks.forEach((jsonBlock) => {
        // Remove JSON code blocks
        const jsonCodeBlockRegex = /```json\s*\n([\s\S]*?)\n\s*```/gi;
        filteredContent = filteredContent.replace(
          jsonCodeBlockRegex,
          (match, jsonContent) => {
            try {
              const parsed = JSON.parse(jsonContent.trim());
              const formatted = JSON.stringify(parsed, null, 2);
              if (formatted === jsonBlock.content) {
                return ''; // Remove this JSON block as we'll render it separately
              }
            } catch {
              // Keep the original if it doesn't match
            }
            return match;
          },
        );

        // Check if the entire content is this JSON block
        try {
          const trimmed = filteredContent.trim();
          if (
            (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
            (trimmed.startsWith('[') && trimmed.endsWith(']'))
          ) {
            const parsed = JSON.parse(trimmed);
            const formatted = JSON.stringify(parsed, null, 2);
            if (formatted === jsonBlock.content) {
              filteredContent = ''; // Remove entire content as it's just JSON
            }
          }
        } catch {
          // Continue with normal processing
        }
      });
    }

    return filteredContent;
  };

  return (
    <div className="prose prose-sm max-w-none text-foreground overflow-x-auto">
      {/* Render detected JSON blocks first */}
      {detectedJsonBlocks.map((jsonBlock, index) => (
        <JsonBlock
          key={`json-${index}`}
          content={jsonBlock.content}
          isCollapsible={jsonBlock.isLarge}
        />
      ))}

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

            // Handle JSON code blocks specially
            if (!inline && match && match[1] === 'json') {
              try {
                const jsonContent = children.toString().trim();
                const parsed = JSON.parse(jsonContent);
                const formatted = JSON.stringify(parsed, null, 2);

                // Check if this JSON block was already rendered separately
                const isAlreadyRendered = detectedJsonBlocks.some(
                  (block) => block.content === formatted,
                );
                if (isAlreadyRendered) {
                  return null; // Don't render duplicate
                }

                // Render inline JSON with syntax highlighting
                return (
                  <JsonBlock
                    content={formatted}
                    isCollapsible={formatted.length > 500}
                  />
                );
              } catch {
                // Fall through to regular code block if not valid JSON
              }
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
        {getFilteredContent()}
      </ReactMarkdown>
    </div>
  );
}
