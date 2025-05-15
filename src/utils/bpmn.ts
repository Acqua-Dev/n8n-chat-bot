/**
 * Detects if a string contains BPMN 2.0 XML content
 * @param text The text to check for BPMN content
 * @returns The BPMN XML string if found, otherwise null
 */
export function detectBpmnXml(text: string): string | null {
  // If text is not a string or is empty, return null
  if (typeof text !== 'string' || !text.trim()) {
    return null;
  }

  try {
    // More general BPMN XML detection patterns that capture any targetNamespace

    // Standard namespace prefix format
    const bpmnRegex = /<bpmn:definitions[^>]*>[\s\S]*<\/bpmn:definitions>/i;

    // Alternative format without namespace prefix
    const bpmnRegexAlt = /<definitions[^>]*>[\s\S]*<\/definitions>/i;

    let match = text.match(bpmnRegex);
    if (match) {
      return validateAndFixBpmnXml(match[0]);
    }

    match = text.match(bpmnRegexAlt);
    if (match) {
      return validateAndFixBpmnXml(match[0]);
    }

    // Look for code blocks with BPMN XML
    const codeBlockRegex =
      /```xml\s*((?:<bpmn:definitions[\s\S]*<\/bpmn:definitions>|<definitions[\s\S]*<\/definitions>))\s*```/i;
    match = text.match(codeBlockRegex);
    if (match && match[1]) {
      return validateAndFixBpmnXml(match[1]);
    }
  } catch (error) {
    console.error('Error detecting BPMN XML:', error);
  }

  return null;
}

/**
 * Validates and fixes BPMN XML to ensure it can be rendered
 * @param xml Original BPMN XML
 * @returns Fixed BPMN XML or null if validation fails
 */
function validateAndFixBpmnXml(xml: string): string | null {
  try {
    // Basic validation - check if XML is well-formed
    if (typeof window !== 'undefined') {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, 'text/xml');

      // Check for parsing errors
      const parserError = xmlDoc.querySelector('parsererror');
      if (parserError) {
        console.warn('BPMN XML parsing error:', parserError.textContent);
        return null;
      }

      // Check for required elements
      const hasDefinitions = xmlDoc.querySelector(
        'bpmn\\:definitions, definitions',
      );
      const hasProcess = xmlDoc.querySelector('bpmn\\:process, process');

      if (!hasDefinitions || !hasProcess) {
        console.warn('BPMN XML missing required elements');
        return null;
      }

      // Check if this XML has sequence flows defined in the process but missing in the diagram
      const sequenceFlows = xmlDoc.querySelectorAll(
        'bpmn\\:sequenceFlow, sequenceFlow',
      );
      const diagramFlows = xmlDoc.querySelectorAll(
        'bpmndi\\:BPMNEdge, BPMNEdge',
      );

      // If there are sequence flows but fewer diagram edges, add a warning
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
