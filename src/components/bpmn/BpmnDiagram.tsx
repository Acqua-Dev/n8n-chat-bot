'use client';

import React, { useEffect, useRef, useState } from 'react';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import './bpmn.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import BpmnModeler from 'bpmn-js/dist/bpmn-modeler.production.min.js';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { Download, Copy } from 'lucide-react';

interface BpmnDiagramProps {
  xml: string;
}

export default function BpmnDiagram({ xml }: BpmnDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bpmnViewer, setBpmnViewer] = useState<BpmnModeler | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const exportAsPNG = async () => {
    if (!bpmnViewer) return;

    try {
      const { svg } = await bpmnViewer.saveSVG();

      const svgBlob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(svgBlob);

      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          console.error('Could not get canvas context');
          URL.revokeObjectURL(url);
          return;
        }

        canvas.width = image.width;
        canvas.height = image.height;

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(image, 0, 0);

        canvas.toBlob((blob) => {
          if (!blob) {
            console.error('Could not create blob');
            return;
          }

          const pngUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = pngUrl;
          a.download = 'bpmn-diagram.png';
          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);
          URL.revokeObjectURL(pngUrl);
        }, 'image/png');

        URL.revokeObjectURL(url);
      };

      image.src = url;
    } catch (error) {
      console.error('Error exporting diagram as PNG:', error);
    }
  };

  const copyXML = async () => {
    if (!xml) return;

    try {
      await navigator.clipboard.writeText(xml);
    } catch (error) {
      console.error('Error copying XML:', error);
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const viewer = new BpmnModeler({
      container: containerRef.current,
    });

    setBpmnViewer(viewer);

    return () => {
      viewer.destroy();
    };
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Loading BPMN XML');
    }

    if (!bpmnViewer || !xml) return;

    setLoading(true);
    setError(null);

    const loadDiagram = async () => {
      try {
        const { warnings } = await bpmnViewer.importXML(xml);

        if (warnings.length) {
          console.warn('XML Warnings:', warnings);
        }

        const canvas = bpmnViewer.get('canvas');
        if (canvas) {
          setTimeout(() => {
            canvas.zoom('fit-viewport', 'auto');
          }, 100);
        }

        setLoading(false);
      } catch (error) {
        const err = error as Error;
        console.error('XML Parsing Failed:', {
          message: err.message,
          stack: err.stack,
        });
        setError(err.message || 'Failed to parse BPMN diagram');
        setLoading(false);
      }
    };

    loadDiagram();
  }, [xml, bpmnViewer]);

  return (
    <div className="bpmn-diagram-wrapper">
      <div className="relative">
        <div
          ref={containerRef}
          className="bpmn-container w-full h-[600px] border-2 border-gray-200 rounded-xl bg-white shadow-lg"
        />

        <div className="absolute top-2 right-2 flex gap-2 z-10">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={exportAsPNG}
                disabled={loading || !!error}
                className="h-8 w-8 bg-white/90 hover:bg-white"
              >
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Export as PNG</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={copyXML}
                disabled={loading || !!error}
                className="h-8 w-8 bg-white/90 hover:bg-white"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy XML</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80">
            <div className="flex flex-col items-center gap-2">
              <Spinner size="lg" />
              <span className="text-sm text-muted-foreground">
                Loading diagram...
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80">
            <div className="bg-destructive/10 text-destructive p-4 rounded-md max-w-md m-4">
              <h3 className="font-bold mb-2">Diagram Error</h3>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
