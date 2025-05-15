'use client';

import { useEffect, useRef, useState } from 'react';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import '@/styles/bpmn.css';

interface BpmnDiagramProps {
  xml: string;
}

export function BpmnDiagram({ xml }: BpmnDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAndRenderBpmn() {
      if (!containerRef.current) return;

      setIsLoading(true);
      setError(null);

      try {
        // Dynamically import BpmnJS to avoid SSR issues
        const BpmnJS = (
          await import('bpmn-js/dist/bpmn-navigated-viewer.production.min.js')
        ).default;

        // Create new instance for each render to avoid stale state issues
        const bpmnViewer = new BpmnJS({
          container: containerRef.current,
        });

        // Check if the XML contains a warning about missing connections
        const hasMissingConnectionsWarning = xml.includes(
          'Warning: This BPMN diagram has missing sequence flow graphics',
        );

        try {
          await bpmnViewer.importXML(xml);
          const canvas = bpmnViewer.get('canvas');
          canvas.zoom('fit-viewport', 'auto');

          // If we detected missing connections, show a warning
          if (hasMissingConnectionsWarning) {
            setError(
              'Note: This diagram has missing connection graphics. The process flow is defined but not all connections are visible.',
            );
          }
        } catch (importError: any) {
          console.error('Error importing BPMN XML:', importError);
          setError(
            'Failed to render BPMN diagram: The XML format appears to be invalid or incompatible.',
          );
        }

        // Attach cleanup logic
        return () => {
          bpmnViewer.destroy();
        };
      } catch (err: any) {
        console.error('Failed to initialize BPMN viewer:', err);
        setError('Failed to initialize BPMN viewer: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadAndRenderBpmn();
  }, [xml]);

  return (
    <div className="bpmn-diagram-wrapper">
      {error && (
        <div
          className={`${
            error.startsWith('Note:')
              ? 'bg-amber-50 border border-amber-200 text-amber-800'
              : 'bg-red-100 border border-red-400 text-red-700'
          } px-4 py-3 rounded mb-4 text-sm`}
        >
          {error}
        </div>
      )}
      {isLoading && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      <div
        ref={containerRef}
        className="bpmn-container bg-white rounded-md my-4 border border-gray-300 h-[400px] w-full"
      ></div>
    </div>
  );
}
