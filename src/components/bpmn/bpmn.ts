export function detectBpmnXml(text: string): string | null {
  if (!text.trim()) {
    return null;
  }

  try {
    const bpmnRegex = /<bpmn:definitions[^>]*>[\s\S]*<\/bpmn:definitions>/i;

    const bpmnRegexAlt = /<definitions[^>]*>[\s\S]*<\/definitions>/i;

    let match = text.match(bpmnRegex);
    if (match) {
      return validateAndFixBpmnXml(match[0]);
    }

    match = text.match(bpmnRegexAlt);
    if (match) {
      return validateAndFixBpmnXml(match[0]);
    }

    const codeBlockRegex =
      /```xml\s*(<bpmn:definitions[\s\S]*<\/bpmn:definitions>|<definitions[\s\S]*<\/definitions>)\s*```/i;
    match = text.match(codeBlockRegex);
    if (match && match[1]) {
      return validateAndFixBpmnXml(match[1]);
    }
  } catch (error) {
    console.error('Error detecting BPMN XML:', error);
  }

  return null;
}

function validateAndFixBpmnXml(xml: string): string | null {
  try {
    if (typeof window !== 'undefined') {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, 'text/xml');

      const parserError = xmlDoc.querySelector('parsererror');
      if (parserError) {
        console.warn('BPMN XML parsing error:', parserError.textContent);
        return null;
      }

      const hasDefinitions = xmlDoc.querySelector(
        'bpmn\\:definitions, definitions',
      );
      const hasProcess = xmlDoc.querySelector('bpmn\\:process, process');

      if (!hasDefinitions || !hasProcess) {
        console.warn('BPMN XML missing required elements');
        return null;
      }

      const sequenceFlows = xmlDoc.querySelectorAll(
        'bpmn\\:sequenceFlow, sequenceFlow',
      );
      const diagramFlows = xmlDoc.querySelectorAll(
        'bpmndi\\:BPMNEdge, BPMNEdge',
      );

      if (
        sequenceFlows.length > 0 &&
        diagramFlows.length < sequenceFlows.length
      ) {
        const commentWarning =
          '<!-- Warning: This BPMN diagram has missing sequence flow graphics. The connections may not be visible. -->';
        return commentWarning + xml;
      }
    }

    return xml;
  } catch (error) {
    console.error('Error validating BPMN XML:', error);
    return null;
  }
}
