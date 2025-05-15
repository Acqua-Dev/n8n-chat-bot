'use client';

import React, { useEffect, useRef, useState } from 'react';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import './bpmn.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import BpmnModeler from 'bpmn-js/dist/bpmn-modeler.production.min.js';

const BpmnDiagram = ({ xml }: { xml: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bpmnViewer, setBpmnViewer] = useState<BpmnModeler | null>(null);

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
    console.log('xmlString:', xml, bpmnViewer);
    if (!bpmnViewer || !xml) return;

    const loadDiagram = async () => {
      try {
        const { warnings } = await bpmnViewer.importXML(xml);

        if (warnings.length) {
          console.warn('XML Warnings:', warnings);
        }

        setTimeout(() => {
          const canvas = bpmnViewer.get('canvas');
          (canvas as any).zoom('fit-viewport', 'auto');
        }, 10);
      } catch (error) {
        const err = error as Error;
        console.error('XML Parsing Failed:', {
          message: err.message,
          stack: err.stack,
        });
      }
    };

    loadDiagram();
  }, [xml, bpmnViewer]);

  return (
    <div
      ref={containerRef}
      className="bpmn-container w-full h-[600px] border-2 border-gray-200 rounded-xl bg-white shadow-lg"
    />
  );
};

export default BpmnDiagram;
