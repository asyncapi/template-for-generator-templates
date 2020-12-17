/* eslint-disable sonarjs/cognitive-complexity */
/**
 * Disabled the rule for this function as there is no way to make it shorter in a meaningfull way
 */
/**
 * Generate Mermaid Class Diagram from payload schemas with non-anonymous id's
 * 
 * @param {AsyncAPIDocument} asyncapi parsed AsyncAPI document 
 */
export function generateMermaidDiagram(asyncapi) {
  if (!asyncapi || typeof asyncapi.version !== 'function') throw new Error('You need to pass entire parsed AsyncAPI document as an argument. Try this "{{ asyncapi | generateMermaidDiagram }}"');

  let diagram = '';
  //we need to store information about processed schemas, to later make sure we do not duplicate schema classes in the diagram
  const seenSchema = [];

  const generateDiagram = (schema) => {
    const schemaId = schema.uid();
    if (isAnonymousSchema(schemaId)) return;

    let classContent = '';
    let relations = '';

    switch (schema.type()) {
    //in case of object we need to traverse through all properties to list them in the class box
    case 'object': {
      for (const [propName, propValueMap] of Object.entries(schema.properties())) {
        const circularProp = schema.circularProps() && schema.circularProps().includes(propName);
        classContent += circularProp ? `${propName} [CIRCULAR] ${propValueMap.type()}\n` : `${propName} ${propValueMap.type()}\n`;
        const propSchemaId = propValueMap.uid();
        //if the schema id is not anonymous, this is how we figure out that it for sure has an individually defined model that we can set a relation too
        if (!isAnonymousSchema(propSchemaId)) relations += `${schemaId} --|> ${propSchemaId}\n`;
      }
      break;
    }
    //in case of array we only want to indicate the type of the array items. So far support for object in items is supported
    case 'array': {
      classContent = schema.type();
      if (Array.isArray(schema.items())) return;
      
      const itemSchemaId = schema.items().uid();
      if (!isAnonymousSchema(itemSchemaId)) relations += `${schema.uid()} --|> ${itemSchemaId}\n`;
      break;
    }
    default:
      classContent = schema.type();
    }

    //we add class to the diagram only if it is seen for the first time
    if (!seenSchema.includes(schemaId)) {
      diagram += `class ${schemaId} {
          ${classContent}}
          ${relations}\n`;
    }
    seenSchema.push(schemaId);
  };
  asyncapi.traverseSchemas(generateDiagram);
  return diagram ? `classDiagram\n${  diagram}` : '';
}

/**
 * Check if schema has anonymous id assigned during parsing of the asyncapi document
 * 
 * @private
 * @param {Schema} schema schema model
 * @param {Function} callback
 */
function isAnonymousSchema(schemaId) {
  return schemaId.startsWith('<anonymous-');
}
