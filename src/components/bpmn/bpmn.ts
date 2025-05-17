export function detectBpmnXml(text: string): string | null {
  if (!text.trim()) {
    return null;
  }

  try {
    // Check for XML declaration
    const xmlDeclarationRegex = /<\?xml[^>]*\?>/i;
    const xmlDeclarationMatch = text.match(xmlDeclarationRegex);
    const xmlDeclaration = xmlDeclarationMatch ? xmlDeclarationMatch[0] : '';

    // BPMN regex patterns
    const bpmnRegex = /<bpmn:definitions[^>]*>[\s\S]*<\/bpmn:definitions>/i;
    const bpmn2Regex = /<bpmn2:definitions[^>]*>[\s\S]*<\/bpmn2:definitions>/i;
    const bpmnRegexAlt = /<definitions[^>]*>[\s\S]*<\/definitions>/i;

    let match = text.match(bpmnRegex);
    if (match) {
      const fullXml = xmlDeclaration
        ? xmlDeclaration + '\n' + match[0]
        : match[0];
      return validateAndFixBpmnXml(fullXml);
    }

    match = text.match(bpmn2Regex);
    if (match) {
      const fullXml = xmlDeclaration
        ? xmlDeclaration + '\n' + match[0]
        : match[0];
      return validateAndFixBpmnXml(fullXml);
    }

    match = text.match(bpmnRegexAlt);
    if (match) {
      const fullXml = xmlDeclaration
        ? xmlDeclaration + '\n' + match[0]
        : match[0];
      return validateAndFixBpmnXml(fullXml);
    }

    // Check if in code block
    const codeBlockRegex =
      /```xml\s*((?:<\?xml[^>]*\?>)?[\s\S]*?(<bpmn:definitions[\s\S]*<\/bpmn:definitions>|<bpmn2:definitions[\s\S]*<\/bpmn2:definitions>|<definitions[\s\S]*<\/definitions>))\s*```/i;
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
        'bpmn\\:definitions, bpmn2\\:definitions, definitions',
      );
      const hasProcess = xmlDoc.querySelector(
        'bpmn\\:process, bpmn2\\:process, process',
      );
      const hasCollaboration = xmlDoc.querySelector(
        'bpmn\\:collaboration, bpmn2\\:collaboration, collaboration',
      );

      if (!hasDefinitions) {
        console.warn('BPMN XML missing definitions element');
        return null;
      }

      if (!hasProcess && !hasCollaboration) {
        console.warn(
          'BPMN XML missing required process or collaboration element',
        );
        return null;
      }

      const sequenceFlows = xmlDoc.querySelectorAll(
        'bpmn\\:sequenceFlow, bpmn2\\:sequenceFlow, sequenceFlow',
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
